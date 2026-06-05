import type { CalendarEvent } from "./types.ts";
import { atTime, minutesBetween } from "./time.ts";

export interface AvailabilityWindow {
  id: string;
  startsAt: string;
  endsAt: string;
  minutes: number;
  label: string;
  score: number;
  reason: string;
}

export interface CalendarConflict {
  id: string;
  firstEventId: string;
  secondEventId: string;
  title: string;
  startsAt: string;
  endsAt: string;
}

function toMs(value: string): number {
  return new Date(value).getTime();
}

function isSameDay(value: string, base: Date): boolean {
  const date = new Date(value);
  return (
    date.getFullYear() === base.getFullYear() &&
    date.getMonth() === base.getMonth() &&
    date.getDate() === base.getDate()
  );
}

export function findOpenWindows(
  events: CalendarEvent[],
  options: {
    baseDate?: Date;
    dayStartHour?: number;
    dayEndHour?: number;
    minimumMinutes?: number;
  } = {}
): AvailabilityWindow[] {
  const baseDate = options.baseDate ?? new Date();
  const dayStartHour = options.dayStartHour ?? 8;
  const dayEndHour = options.dayEndHour ?? 18;
  const minimumMinutes = options.minimumMinutes ?? 30;
  const dayStart = atTime(dayStartHour, 0, 0, baseDate);
  const dayEnd = atTime(dayEndHour, 0, 0, baseDate);

  const busy = events
    .filter((event) => event.status !== "cancelled" && isSameDay(event.startsAt, baseDate))
    .sort((a, b) => toMs(a.startsAt) - toMs(b.startsAt))
    .reduce<Array<{ startsAt: string; endsAt: string }>>((merged, event) => {
      const startsAt = new Date(Math.max(toMs(event.startsAt), toMs(dayStart))).toISOString();
      const endsAt = new Date(Math.min(toMs(event.endsAt), toMs(dayEnd))).toISOString();

      if (toMs(endsAt) <= toMs(dayStart) || toMs(startsAt) >= toMs(dayEnd)) {
        return merged;
      }

      const previous = merged[merged.length - 1];
      if (previous && toMs(startsAt) <= toMs(previous.endsAt)) {
        previous.endsAt = new Date(Math.max(toMs(previous.endsAt), toMs(endsAt))).toISOString();
        return merged;
      }

      merged.push({ startsAt, endsAt });
      return merged;
    }, []);

  const openings: AvailabilityWindow[] = [];
  let cursor = dayStart;

  for (const block of busy) {
    if (minutesBetween(cursor, block.startsAt) >= minimumMinutes) {
      openings.push(toWindow(cursor, block.startsAt, openings.length));
    }
    cursor = new Date(Math.max(toMs(cursor), toMs(block.endsAt))).toISOString();
  }

  if (minutesBetween(cursor, dayEnd) >= minimumMinutes) {
    openings.push(toWindow(cursor, dayEnd, openings.length));
  }

  return openings.sort((a, b) => b.score - a.score);
}

export function detectCalendarConflicts(events: CalendarEvent[], baseDate = new Date()): CalendarConflict[] {
  const todaysEvents = events
    .filter((event) => event.status !== "cancelled" && isSameDay(event.startsAt, baseDate))
    .sort((a, b) => toMs(a.startsAt) - toMs(b.startsAt));

  const conflicts: CalendarConflict[] = [];

  for (let index = 0; index < todaysEvents.length - 1; index += 1) {
    const first = todaysEvents[index];
    const second = todaysEvents[index + 1];

    if (toMs(first.endsAt) > toMs(second.startsAt)) {
      conflicts.push({
        id: `${first.id}-${second.id}`,
        firstEventId: first.id,
        secondEventId: second.id,
        title: `${first.title} overlaps ${second.title}`,
        startsAt: second.startsAt,
        endsAt: new Date(Math.min(toMs(first.endsAt), toMs(second.endsAt))).toISOString()
      });
    }
  }

  return conflicts;
}

export function findFocusBlocks(events: CalendarEvent[], baseDate = new Date()): AvailabilityWindow[] {
  return findOpenWindows(events, {
    baseDate,
    dayStartHour: 8,
    dayEndHour: 18,
    minimumMinutes: 60
  }).filter((window) => window.minutes >= 60);
}

function toWindow(startsAt: string, endsAt: string, index: number): AvailabilityWindow {
  const minutes = minutesBetween(startsAt, endsAt);
  const startsHour = new Date(startsAt).getHours();
  const score = minutes + (startsHour >= 9 && startsHour <= 14 ? 25 : 0);

  return {
    id: `window-${index + 1}`,
    startsAt,
    endsAt,
    minutes,
    label: minutes >= 60 ? "Focus block" : "Call window",
    score,
    reason:
      minutes >= 90
        ? "Long enough for deep work plus a short buffer."
        : minutes >= 45
          ? "Enough time for a call with notes."
          : "Best for a quick decision or reply sprint."
  };
}
