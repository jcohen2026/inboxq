import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectCalendarConflicts, findOpenWindows } from "../lib/availability.ts";
import type { CalendarEvent } from "../lib/types.ts";

const baseDate = new Date("2026-06-03T12:00:00.000Z");

function event(id: string, startsAt: string, endsAt: string): CalendarEvent {
  return {
    id,
    sourceAccountId: "acct-test",
    calendarId: "cal-test",
    title: id,
    startsAt,
    endsAt,
    attendeePersonIds: [],
    status: "confirmed",
    providerMetadata: {}
  };
}

describe("availability utilities", () => {
  it("finds open windows around busy calendar blocks", () => {
    const windows = findOpenWindows(
      [
        event("morning", "2026-06-03T13:00:00.000Z", "2026-06-03T14:00:00.000Z"),
        event("afternoon", "2026-06-03T16:00:00.000Z", "2026-06-03T16:30:00.000Z")
      ],
      {
        baseDate,
        dayStartHour: 8,
        dayEndHour: 13,
        minimumMinutes: 30
      }
    );

    assert.equal(windows.some((window) => window.minutes >= 120), true);
  });

  it("detects overlapping events", () => {
    const conflicts = detectCalendarConflicts(
      [
        event("a", "2026-06-03T14:00:00.000Z", "2026-06-03T15:00:00.000Z"),
        event("b", "2026-06-03T14:30:00.000Z", "2026-06-03T15:30:00.000Z")
      ],
      baseDate
    );

    assert.equal(conflicts.length, 1);
    assert.equal(conflicts[0].firstEventId, "a");
    assert.equal(conflicts[0].secondEventId, "b");
  });
});
