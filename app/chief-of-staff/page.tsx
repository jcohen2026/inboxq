import { ArrowRight, CalendarClock, CheckCircle2, Lightbulb, ShieldAlert, Sparkles, Users } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Badge, Panel, PanelHeader } from "@/components/ui";
import { getDemoContext } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/time";

export default function ChiefOfStaffPage() {
  const context = getDemoContext();
  const briefing = context.aiBriefing;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="AI Chief of Staff"
        title="Executive briefing"
        action={<Badge tone="purple">Generated {formatDateTime(briefing.generatedAt)}</Badge>}
      >
        {briefing.narrative}
      </PageHeading>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-5">
          <PanelHeader title="Top 5 priorities" action={<Sparkles className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
          <NumberedList items={briefing.topPriorities} />
        </Panel>

        <Panel className="xl:col-span-4">
          <PanelHeader title="Risks" action={<ShieldAlert className="h-4 w-4 text-red-500" aria-hidden="true" />} />
          <PlainList items={briefing.risks} tone="red" />
        </Panel>

        <Panel className="xl:col-span-3">
          <PanelHeader title="Opportunities" action={<Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />} />
          <PlainList items={briefing.opportunities} tone="green" />
        </Panel>

        <BriefingPanel title="Follow-ups" icon={ArrowRight} items={briefing.followUps} />
        <BriefingPanel title="Deadlines" icon={CalendarClock} items={briefing.deadlines} />
        <BriefingPanel title="Waiting on me" icon={CheckCircle2} items={briefing.waitingOnMe} />
        <BriefingPanel title="Waiting on others" icon={ArrowRight} items={briefing.waitingOnOthers} />
        <BriefingPanel title="Schedule adjustments" icon={CalendarClock} items={briefing.scheduleAdjustments} />
        <BriefingPanel title="Relationship follow-ups" icon={Users} items={briefing.relationshipRecommendations} />
      </div>
    </div>
  );
}

function BriefingPanel({
  title,
  icon: Icon,
  items
}: {
  title: string;
  icon: typeof ArrowRight;
  items: string[];
}) {
  return (
    <Panel className="xl:col-span-4">
      <PanelHeader title={title} action={<Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
      <PlainList items={items} />
    </Panel>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="divide-y divide-zinc-100">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3 px-4 py-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink text-xs font-semibold text-white">{index + 1}</span>
          <span className="text-sm leading-6 text-ink">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function PlainList({ items, tone = "zinc" }: { items: string[]; tone?: "zinc" | "green" | "red" }) {
  const dot = tone === "green" ? "bg-emerald-500" : tone === "red" ? "bg-red-500" : "bg-zinc-400";

  return (
    <div className="divide-y divide-zinc-100">
      {items.map((item) => (
        <div key={item} className="flex gap-3 px-4 py-3">
          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <p className="text-sm leading-6 text-zinc-700">{item}</p>
        </div>
      ))}
    </div>
  );
}
