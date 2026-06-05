import { CalendarClock, CloudSun, Link as LinkIcon, Newspaper, Trophy } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { Badge, Metric, Panel, PanelHeader, PriorityPill, StatusPill } from "@/components/ui";
import {
  getEmailsNeedingResponse,
  getTopWorkItems,
  getUpcomingDeadlines,
  getWaitingOnOthers
} from "@/lib/commitments";
import type { DemoContext, EmailThread, WorkItem } from "@/lib/types";
import { findOpenWindows } from "@/lib/availability";
import { formatDate, formatTime, sameLocalDay } from "@/lib/time";

export function DashboardWidgets({ context }: { context: DemoContext }) {
  const topWorkItems = getTopWorkItems(context.workItems);
  const responseThreads = getEmailsNeedingResponse(context.emailThreads);
  const waitingOnOthers = getWaitingOnOthers(context.emailThreads, context.workItems);
  const deadlines = getUpcomingDeadlines(context.workItems);
  const todaysEvents = context.calendarEvents
    .filter((event) => sameLocalDay(event.startsAt))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const openWindows = findOpenWindows(context.calendarEvents).slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Panel className="xl:col-span-7">
        <PanelHeader title="AI Morning Briefing" eyebrow="Generated 12 minutes ago" />
        <div className="px-4 py-4">
          <p className="text-lg font-semibold text-ink">{context.aiBriefing.greeting}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{context.aiBriefing.narrative}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Metric label="Priorities" value={context.aiBriefing.topPriorities.length} tone="blue" />
            <Metric label="Risks" value={context.aiBriefing.risks.length} tone="amber" />
            <Metric label="Follow-ups" value={context.aiBriefing.followUps.length} tone="green" />
          </div>
        </div>
      </Panel>

      <Panel className="xl:col-span-5">
        <PanelHeader title="Today's Priorities" />
        <div className="divide-y divide-zinc-100">
          {topWorkItems.map((item) => (
            <WorkItemRow key={item.id} item={item} />
          ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-5">
        <PanelHeader title="Calendar Snapshot" action={<Badge>{todaysEvents.length} events</Badge>} />
        <div className="divide-y divide-zinc-100">
          {todaysEvents.slice(0, 5).map((event) => {
            const account = context.connectedAccounts.find((candidate) => candidate.id === event.sourceAccountId);
            const calendar = context.calendars.find((candidate) => candidate.id === event.calendarId);
            return (
              <div key={event.id} className="flex gap-3 px-4 py-3">
                <div className="w-16 shrink-0 text-sm font-semibold text-ink">{formatTime(event.startsAt)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-ink">{event.title}</p>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: calendar?.color ?? account?.color }} />
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatTime(event.endsAt)} {calendar ? `- ${calendar.name}` : ""}
                  </p>
                </div>
                <AccountBadge account={account} compact />
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel className="xl:col-span-4">
        <PanelHeader title="Open Focus Windows" />
        <div className="divide-y divide-zinc-100">
          {openWindows.map((window) => (
            <div key={window.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">
                  {formatTime(window.startsAt)}-{formatTime(window.endsAt)}
                </p>
                <Badge tone={window.minutes >= 60 ? "green" : "blue"}>{window.minutes} min</Badge>
              </div>
              <p className="mt-1 text-sm text-zinc-600">{window.reason}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-3">
        <PanelHeader title="Available Call Times" />
        <div className="space-y-3 px-4 py-4">
          {openWindows.slice(0, 2).map((window) => (
            <div key={`call-${window.id}`} className="flex items-center gap-3">
              <CalendarClock className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ink">{formatTime(window.startsAt)}</p>
                <p className="text-xs text-zinc-500">{window.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-6">
        <PanelHeader title="Emails Needing Response" action={<Badge tone="amber">{responseThreads.length}</Badge>} />
        <div className="divide-y divide-zinc-100">
          {responseThreads.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} context={context} />
          ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-3">
        <PanelHeader title="Waiting On Me" />
        <div className="divide-y divide-zinc-100">
          {context.workItems
            .filter((item) => item.status !== "done" && item.status !== "waiting")
            .slice(0, 4)
            .map((item) => (
              <WorkItemRow key={item.id} item={item} compact />
            ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-3">
        <PanelHeader title="Waiting On Others" />
        <div className="divide-y divide-zinc-100">
          {waitingOnOthers.slice(0, 4).map((item) => (
            <div key={"subject" in item ? item.id : item.id} className="px-4 py-3">
              <p className="text-sm font-semibold text-ink">{"subject" in item ? item.subject : item.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{"subject" in item ? "Email follow-up" : "Work item"}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-4">
        <PanelHeader title="Upcoming Deadlines" />
        <div className="divide-y divide-zinc-100">
          {deadlines.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
                {item.dueDate ? <p className="mt-1 text-xs text-zinc-500">{formatDate(item.dueDate)}</p> : null}
              </div>
              <PriorityPill priority={item.priority} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-2">
        <PanelHeader title="Weather" />
        <div className="px-4 py-4">
          <CloudSun className="h-7 w-7 text-amber-500" aria-hidden="true" />
          <p className="mt-3 text-2xl font-semibold text-ink">72 F</p>
          <p className="mt-1 text-sm text-zinc-600">Clear morning, rain possible after 5 PM.</p>
        </div>
      </Panel>

      <Panel className="xl:col-span-3">
        <PanelHeader title="RSS / News" />
        <div className="divide-y divide-zinc-100">
          {context.rssSources.flatMap((source) =>
            source.latestItems.map((item) => (
              <div key={item.id} className="flex gap-3 px-4 py-3">
                <Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold leading-5 text-ink">{item.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.source}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>

      <Panel className="xl:col-span-2">
        <PanelHeader title="Sports" />
        <div className="space-y-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">Mets 4, Phillies 2</p>
              <p className="text-xs text-zinc-500">Final</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">Knicks at Celtics</p>
              <p className="text-xs text-zinc-500">7:30 PM</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="xl:col-span-3">
        <PanelHeader title="Quick Links" />
        <div className="grid grid-cols-2 gap-2 px-4 py-4">
          {context.quickLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <LinkIcon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
              <span className="truncate">{link.label}</span>
            </a>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function WorkItemRow({ item, compact = false }: { item: WorkItem; compact?: boolean }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-ink">{item.title}</p>
          {!compact ? <p className="mt-1 text-sm leading-5 text-zinc-600">{item.description}</p> : null}
        </div>
        <PriorityPill priority={item.priority} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusPill status={item.status} />
        {item.createdByAi ? <Badge tone="purple">AI</Badge> : null}
      </div>
    </div>
  );
}

function ThreadRow({ thread, context }: { thread: EmailThread; context: DemoContext }) {
  const account = context.connectedAccounts.find((candidate) => candidate.id === thread.sourceAccountId);

  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <AccountBadge account={account} compact />
        {thread.unread ? <Badge tone="blue">Unread</Badge> : null}
        {thread.possibleCommitment ? <Badge tone="amber">Commitment</Badge> : null}
        {thread.replySuggested ? <Badge tone="green">Reply suggested</Badge> : null}
      </div>
      <p className="mt-2 text-sm font-semibold text-ink">{thread.subject}</p>
      <p className="mt-1 text-sm leading-5 text-zinc-600">{thread.aiSummary}</p>
    </div>
  );
}
