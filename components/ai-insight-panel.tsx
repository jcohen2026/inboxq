import { AlertTriangle, ArrowRight, Clock, Lightbulb, Sparkles } from "lucide-react";
import { Badge, Panel, PanelHeader, PriorityPill } from "@/components/ui";
import type { AiInsight } from "@/lib/types";

const icons = {
  priority: Sparkles,
  risk: AlertTriangle,
  opportunity: Lightbulb,
  follow_up: ArrowRight,
  deadline: Clock,
  waiting_on_me: Clock,
  waiting_on_others: Clock,
  schedule: Clock,
  relationship: Sparkles
};

export function AiInsightPanel({
  title = "AI Chief of Staff",
  insights
}: {
  title?: string;
  insights: AiInsight[];
}) {
  return (
    <Panel>
      <PanelHeader title={title} eyebrow="Live insights" />
      <div className="divide-y divide-zinc-100">
        {insights.map((insight) => {
          const Icon = icons[insight.type];
          return (
            <article key={insight.id} className="flex gap-3 px-4 py-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-ink">{insight.title}</h3>
                  <PriorityPill priority={insight.priority} />
                </div>
                <p className="mt-1 text-sm leading-5 text-zinc-600">{insight.body}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {insight.sourceIds.slice(0, 3).map((sourceId) => (
                    <Badge key={sourceId}>{sourceId.replace(/^(thread|event|work)-/, "")}</Badge>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
