"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, Clock, Focus, MapPin } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { Badge, Panel, PanelHeader } from "@/components/ui";
import { detectCalendarConflicts, findFocusBlocks, findOpenWindows } from "@/lib/availability";
import type { CalendarEvent, DemoContext } from "@/lib/types";
import { formatTime, minutesBetween, sameLocalDay } from "@/lib/time";

export function CalendarAgenda({ context }: { context: DemoContext }) {
  const [accountId, setAccountId] = useState("all");
  const [calendarId, setCalendarId] = useState("all");

  const filteredEvents = useMemo(() => {
    return context.calendarEvents
      .filter((event) => sameLocalDay(event.startsAt))
      .filter((event) => accountId === "all" || event.sourceAccountId === accountId)
      .filter((event) => calendarId === "all" || event.calendarId === calendarId)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [accountId, calendarId, context.calendarEvents]);

  const openWindows = findOpenWindows(filteredEvents).slice(0, 4);
  const focusBlocks = findFocusBlocks(filteredEvents).slice(0, 3);
  const conflicts = detectCalendarConflicts(filteredEvents);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Panel className="xl:col-span-8">
        <PanelHeader
          title="Day Agenda"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-ink"
              >
                <option value="all">All accounts</option>
                {context.connectedAccounts
                  .filter((account) => account.scopes.includes("calendar"))
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.displayName}
                    </option>
                  ))}
              </select>
              <select
                value={calendarId}
                onChange={(event) => setCalendarId(event.target.value)}
                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-ink"
              >
                <option value="all">All calendars</option>
                {context.calendars
                  .filter((calendar) => accountId === "all" || calendar.sourceAccountId === accountId)
                  .map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>
                      {calendar.name}
                    </option>
                  ))}
              </select>
            </div>
          }
        />
        <div className="divide-y divide-zinc-100">
          {filteredEvents.map((event) => (
            <EventRow key={event.id} event={event} context={context} />
          ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-4">
        <PanelHeader title="AI Calendar Panel" eyebrow="Availability" />
        <div className="divide-y divide-zinc-100">
          <InsightBlock icon={Clock} title="Best 30-minute call windows">
            {openWindows.slice(0, 2).map((window) => (
              <p key={window.id} className="text-sm text-zinc-600">
                {formatTime(window.startsAt)}-{formatTime(window.endsAt)} ({window.minutes} min)
              </p>
            ))}
          </InsightBlock>

          <InsightBlock icon={Focus} title="Best focus blocks">
            {focusBlocks.length ? (
              focusBlocks.map((window) => (
                <p key={window.id} className="text-sm text-zinc-600">
                  {formatTime(window.startsAt)}-{formatTime(window.endsAt)} ({window.minutes} min)
                </p>
              ))
            ) : (
              <p className="text-sm text-zinc-600">No 60-minute block after current filters.</p>
            )}
          </InsightBlock>

          <InsightBlock icon={CalendarDays} title="Meeting prep">
            <p className="text-sm text-zinc-600">Send Lucent proof points before the executive review.</p>
            <p className="mt-1 text-sm text-zinc-600">Bring Maple budget assumptions to the pricing review.</p>
          </InsightBlock>

          <InsightBlock icon={AlertTriangle} title="Conflicts and overbooking">
            {conflicts.length ? (
              conflicts.map((conflict) => (
                <p key={conflict.id} className="text-sm text-zinc-600">
                  {conflict.title}
                </p>
              ))
            ) : (
              <p className="text-sm text-zinc-600">No hard conflicts in the filtered agenda.</p>
            )}
            {filteredEvents.length >= 6 ? <p className="mt-1 text-sm text-zinc-600">Today is meeting-heavy.</p> : null}
          </InsightBlock>

          <InsightBlock icon={MapPin} title="Travel and buffers">
            <p className="text-sm text-zinc-600">Keep 15 minutes before school pickup.</p>
            <p className="mt-1 text-sm text-zinc-600">Avoid adding calls after 4:00 PM.</p>
          </InsightBlock>
        </div>
      </Panel>
    </div>
  );
}

function EventRow({ event, context }: { event: CalendarEvent; context: DemoContext }) {
  const account = context.connectedAccounts.find((candidate) => candidate.id === event.sourceAccountId);
  const calendar = context.calendars.find((candidate) => candidate.id === event.calendarId);
  const project = context.projects.find((candidate) => candidate.id === event.projectId);
  const people = context.people.filter((person) => event.attendeePersonIds.includes(person.id));
  const minutes = minutesBetween(event.startsAt, event.endsAt);

  return (
    <article className="grid gap-3 px-4 py-4 md:grid-cols-[92px_1fr_auto]">
      <div>
        <p className="text-base font-semibold text-ink">{formatTime(event.startsAt)}</p>
        <p className="text-sm text-zinc-500">{minutes} min</p>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: calendar?.color ?? account?.color }} />
          <h2 className="text-base font-semibold text-ink">{event.title}</h2>
          {event.status === "tentative" ? <Badge tone="amber">Tentative</Badge> : null}
        </div>
        {event.descriptionPreview ? <p className="mt-1 text-sm leading-6 text-zinc-600">{event.descriptionPreview}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {project ? <Badge>{project.name}</Badge> : null}
          {calendar ? <Badge tone="blue">{calendar.name}</Badge> : null}
          {people.map((person) => (
            <Badge key={person.id}>{person.name}</Badge>
          ))}
        </div>
      </div>
      <div className="md:text-right">
        <p className="text-sm font-medium text-ink">{formatTime(event.endsAt)}</p>
        <div className="mt-2">
          <AccountBadge account={account} compact />
        </div>
      </div>
    </article>
  );
}

function InsightBlock({
  icon: Icon,
  title,
  children
}: {
  icon: typeof Clock;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 px-4 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <div className="mt-2 space-y-1">{children}</div>
      </div>
    </div>
  );
}
