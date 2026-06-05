import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { PageHeading } from "@/components/page-heading";
import { Badge, Panel, PanelHeader, PriorityPill, StatusPill } from "@/components/ui";
import { getDemoContext } from "@/lib/demo-data";
import { getTopWorkItems, getUpcomingDeadlines } from "@/lib/commitments";
import { formatDateTime } from "@/lib/time";
import type { WorkItem } from "@/lib/types";

export default function TasksPage() {
  const context = getDemoContext();
  const topItems = getTopWorkItems(context.workItems, context.workItems.length);
  const upcoming = getUpcomingDeadlines(context.workItems, 4);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading eyebrow="Tasks / Commitments" title="Work items">
        {context.workItems.filter((item) => item.createdByAi).length} commitments extracted from email and calendar sources.
      </PageHeading>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-8">
          <PanelHeader title="Open commitments" action={<Badge>{topItems.length} active</Badge>} />
          <div className="divide-y divide-zinc-100">
            {topItems.map((item) => (
              <WorkItemCard key={item.id} item={item} context={context} />
            ))}
          </div>
        </Panel>

        <div className="space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Upcoming deadlines" />
            <div className="divide-y divide-zinc-100">
              {upcoming.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    {item.dueDate ? <p className="mt-1 text-sm text-zinc-600">{formatDateTime(item.dueDate)}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="AI extraction health" />
            <div className="grid grid-cols-3 gap-3 px-4 py-4">
              <MiniStat value="5" label="Extracted" />
              <MiniStat value="88%" label="Avg confidence" />
              <MiniStat value="3" label="Sources" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function WorkItemCard({ item, context }: { item: WorkItem; context: ReturnType<typeof getDemoContext> }) {
  const account = context.connectedAccounts.find((candidate) => candidate.id === item.sourceAccountId);
  const project = context.projects.find((candidate) => candidate.id === item.relatedProjectId);
  const person = context.people.find((candidate) => candidate.id === item.relatedPersonId);
  const Icon = item.status === "done" ? CheckCircle2 : item.status === "waiting" ? Clock3 : Circle;

  return (
    <article className="px-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            <StatusPill status={item.status} />
            <PriorityPill priority={item.priority} />
            {item.createdByAi ? <Badge tone="purple">AI extracted</Badge> : null}
          </div>
          <h2 className="mt-3 text-base font-semibold text-ink">{item.title}</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{item.description}</p>
        </div>
        {item.dueDate ? <p className="shrink-0 text-sm font-medium text-zinc-600">{formatDateTime(item.dueDate)}</p> : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {account ? <AccountBadge account={account} compact /> : null}
        {project ? <Badge>{project.name}</Badge> : null}
        {person ? <Badge>{person.name}</Badge> : null}
        <Badge>{item.sourceType}</Badge>
        {typeof item.confidenceScore === "number" ? <Badge tone="green">{Math.round(item.confidenceScore * 100)}% confidence</Badge> : null}
      </div>
    </article>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-normal text-zinc-500">{label}</p>
    </div>
  );
}
