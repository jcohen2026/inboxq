import { ArrowRight, CalendarClock, Mail, Users } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { PageHeading } from "@/components/page-heading";
import { Badge, HealthPill, Panel, PanelHeader, PriorityPill, StatusPill } from "@/components/ui";
import { getDemoContext } from "@/lib/demo-data";
import { formatDate } from "@/lib/time";

export default function ProjectsPage() {
  const context = getDemoContext();

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading eyebrow="Projects" title="Project dashboard">
        {context.projects.length} active areas with linked email, calendar, people, and commitments.
      </PageHeading>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {context.projects.map((project) => {
          const tasks = context.workItems.filter((item) => item.relatedProjectId === project.id && item.status !== "done");
          const threads = context.emailThreads.filter((thread) => thread.projectId === project.id);
          const events = context.calendarEvents.filter((event) => event.projectId === project.id);
          const people = context.people.filter((person) => project.relatedPersonIds.includes(person.id));
          const waiting = tasks.filter((item) => item.status === "waiting");

          return (
            <Panel key={project.id}>
              <PanelHeader
                title={project.name}
                eyebrow={project.client}
                action={<span className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />}
              />
              <div className="space-y-4 px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <HealthPill health={project.health} />
                  <Badge>{project.status}</Badge>
                  <Badge tone="blue">Due {formatDate(project.dueDate)}</Badge>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">AI suggested next action</p>
                  <p className="mt-1 text-sm leading-6 text-ink">{project.nextAction}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 border-y border-zinc-100 py-3">
                  <ProjectMetric icon={Mail} value={threads.length} label="Messages" />
                  <ProjectMetric icon={CalendarClock} value={events.length} label="Events" />
                  <ProjectMetric icon={Users} value={people.length} label="People" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Open tasks</p>
                  <div className="mt-2 space-y-2">
                    {tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-ink">{task.title}</p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            <StatusPill status={task.status} />
                            <PriorityPill priority={task.priority} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Related people</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {people.map((person) => (
                      <Badge key={person.id}>{person.name}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {waiting.length ? <Badge tone="amber">{waiting.length} waiting item</Badge> : <Badge tone="green">No waiting blockers</Badge>}
                  {threads.slice(0, 1).map((thread) => {
                    const account = context.connectedAccounts.find((candidate) => candidate.id === thread.sourceAccountId);
                    return <AccountBadge key={thread.id} account={account} compact />;
                  })}
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function ProjectMetric({
  icon: Icon,
  value,
  label
}: {
  icon: typeof ArrowRight;
  value: number;
  label: string;
}) {
  return (
    <div>
      <Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}
