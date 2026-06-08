import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ProjectHealth, WorkItemPriority, WorkItemStatus } from "@/lib/types";

export function Panel({
  children,
  className,
  variant = "default"
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "palms";
}) {
  return (
    <section 
      className={cn(
        "rounded-lg border shadow-quiet", 
        variant === "default" ? "border-zinc-200 bg-white" : "border-palms-gold/30 bg-palms-black shadow-gold",
        className
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  action,
  className,
  variant = "default"
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
  variant?: "default" | "palms";
}) {
  return (
    <div 
      className={cn(
        "flex items-start justify-between gap-3 border-b px-4 py-3", 
        variant === "default" ? "border-zinc-100" : "border-palms-gold/20",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p 
            className={cn(
              "text-xs font-medium uppercase tracking-normal",
              variant === "default" ? "text-zinc-500" : "text-palms-amber"
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 
          className={cn(
            "truncate text-base font-semibold",
            variant === "default" ? "text-ink" : "text-white"
          )}
        >
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "zinc",
  variant = "default",
  className
}: {
  children: ReactNode;
  tone?: "zinc" | "blue" | "green" | "amber" | "red" | "purple" | "gold";
  variant?: "default" | "palms";
  className?: string;
}) {
  const tones = {
    zinc: "border-zinc-200 bg-zinc-50 text-zinc-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    purple: "border-violet-200 bg-violet-50 text-violet-700",
    gold: "border-palms-gold/50 bg-palms-accent text-palms-gold"
  };

  const palmsTones = {
    zinc: "border-white/10 bg-white/5 text-zinc-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    amber: "border-palms-amber/30 bg-palms-amber/10 text-palms-amber",
    red: "border-red-500/30 bg-red-500/10 text-red-300",
    purple: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    gold: "border-palms-gold/50 bg-palms-gold/10 text-palms-gold"
  };

  const activeTones = variant === "palms" ? palmsTones : tones;

  return (
    <span className={cn("inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium", activeTones[tone as keyof typeof activeTones], className)}>
      {children}
    </span>
  );
}

export function PriorityPill({ priority, variant = "default" }: { priority: WorkItemPriority, variant?: "default" | "palms" }) {
  const tone = priority === "urgent" ? "red" : priority === "high" ? "amber" : priority === "medium" ? "blue" : "zinc";
  return <Badge tone={tone} variant={variant}>{priority}</Badge>;
}

export function StatusPill({ status, variant = "default" }: { status: WorkItemStatus, variant?: "default" | "palms" }) {
  const labels: Record<WorkItemStatus, string> = {
    todo: "To do",
    in_progress: "In progress",
    waiting: "Waiting",
    done: "Done"
  };
  const tone = status === "done" ? "green" : status === "waiting" ? "amber" : status === "in_progress" ? "blue" : "zinc";
  return <Badge tone={tone} variant={variant}>{labels[status]}</Badge>;
}

export function HealthPill({ health, variant = "default" }: { health: ProjectHealth, variant?: "default" | "palms" }) {
  const labels: Record<ProjectHealth, string> = {
    healthy: "Healthy",
    watch: "Watch",
    at_risk: "At risk"
  };
  const tone = health === "healthy" ? "green" : health === "watch" ? "amber" : "red";
  return <Badge tone={tone} variant={variant}>{labels[health]}</Badge>;
}

export function Metric({
  label,
  value,
  tone = "zinc",
  variant = "default"
}: {
  label: string;
  value: string | number;
  tone?: "zinc" | "blue" | "green" | "amber" | "red" | "gold";
  variant?: "default" | "palms";
}) {
  const toneClasses = {
    zinc: variant === "palms" ? "text-zinc-300" : "text-zinc-700",
    blue: "text-blue-500",
    green: "text-emerald-500",
    amber: "text-amber-500",
    red: "text-red-500",
    gold: "text-palms-gold"
  };

  return (
    <div>
      <p className={cn("text-2xl font-semibold", toneClasses[tone as keyof typeof toneClasses])}>{value}</p>
      <p 
        className={cn(
          "mt-0.5 text-xs font-medium uppercase tracking-normal",
          variant === "default" ? "text-zinc-500" : "text-palms-amber/70"
        )}
      >
        {label}
      </p>
    </div>
  );
}
