import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ProjectHealth, WorkItemPriority, WorkItemStatus } from "@/lib/types";

export function Panel({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("rounded-lg border border-zinc-200 bg-white shadow-quiet", className)}>{children}</section>;
}

export function PanelHeader({
  eyebrow,
  title,
  action,
  className
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">{eyebrow}</p> : null}
        <h2 className="truncate text-base font-semibold text-ink">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "zinc"
}: {
  children: ReactNode;
  tone?: "zinc" | "blue" | "green" | "amber" | "red" | "purple";
}) {
  const tones = {
    zinc: "border-zinc-200 bg-zinc-50 text-zinc-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    purple: "border-violet-200 bg-violet-50 text-violet-700"
  };

  return <span className={cn("inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function PriorityPill({ priority }: { priority: WorkItemPriority }) {
  const tone = priority === "urgent" ? "red" : priority === "high" ? "amber" : priority === "medium" ? "blue" : "zinc";
  return <Badge tone={tone}>{priority}</Badge>;
}

export function StatusPill({ status }: { status: WorkItemStatus }) {
  const labels: Record<WorkItemStatus, string> = {
    todo: "To do",
    in_progress: "In progress",
    waiting: "Waiting",
    done: "Done"
  };
  const tone = status === "done" ? "green" : status === "waiting" ? "amber" : status === "in_progress" ? "blue" : "zinc";
  return <Badge tone={tone}>{labels[status]}</Badge>;
}

export function HealthPill({ health }: { health: ProjectHealth }) {
  const labels: Record<ProjectHealth, string> = {
    healthy: "Healthy",
    watch: "Watch",
    at_risk: "At risk"
  };
  const tone = health === "healthy" ? "green" : health === "watch" ? "amber" : "red";
  return <Badge tone={tone}>{labels[health]}</Badge>;
}

export function Metric({
  label,
  value,
  tone = "zinc"
}: {
  label: string;
  value: string | number;
  tone?: "zinc" | "blue" | "green" | "amber" | "red";
}) {
  const toneClasses = {
    zinc: "text-zinc-700",
    blue: "text-blue-700",
    green: "text-emerald-700",
    amber: "text-amber-700",
    red: "text-red-700"
  };

  return (
    <div>
      <p className={cn("text-2xl font-semibold", toneClasses[tone])}>{value}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-normal text-zinc-500">{label}</p>
    </div>
  );
}
