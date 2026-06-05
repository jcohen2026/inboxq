import { Mail, MessageSquare, UserRound } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { PageHeading } from "@/components/page-heading";
import { Badge, Panel, PanelHeader } from "@/components/ui";
import { getDemoContext } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/time";

export default function PeoplePage() {
  const context = getDemoContext();

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading eyebrow="People / Relationships" title="Relationship loops">
        {context.people.length} normalized contacts across inboxes, calendars, and the Slack stub.
      </PageHeading>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {context.people.map((person) => {
          const accounts = context.connectedAccounts.filter((account) => person.accountIds.includes(account.id));
          const threads = context.emailThreads.filter((thread) => thread.personIds.includes(person.id));
          const events = context.calendarEvents.filter((event) => event.attendeePersonIds.includes(person.id));
          const workItems = context.workItems.filter((item) => item.relatedPersonId === person.id && item.status !== "done");
          const waitingOnMe = workItems.filter((item) => item.status !== "waiting");
          const waitingOnThem = workItems.filter((item) => item.status === "waiting");

          return (
            <Panel key={person.id}>
              <PanelHeader title={person.name} eyebrow={`${person.role} - ${person.company}`} action={<UserRound className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
              <div className="space-y-4 px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={person.relationshipHealth === "needs_attention" ? "amber" : person.relationshipHealth === "strong" ? "green" : "blue"}>
                    {person.relationshipHealth.replace("_", " ")}
                  </Badge>
                  <Badge>{formatDateTime(person.lastInteractionAt)}</Badge>
                </div>

                <p className="text-sm leading-6 text-zinc-600">{person.notes}</p>

                <div>
                  <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Related accounts</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {accounts.map((account) => (
                      <AccountBadge key={account.id} account={account} compact />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-y border-zinc-100 py-3">
                  <MiniRelationshipStat icon={Mail} value={threads.length} label="Emails" />
                  <MiniRelationshipStat icon={MessageSquare} value={events.length} label="Events" />
                  <MiniRelationshipStat icon={UserRound} value={workItems.length} label="Open loops" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <LoopList title="Waiting on me" items={waitingOnMe.map((item) => item.title)} />
                  <LoopList title="Waiting on them" items={waitingOnThem.map((item) => item.title)} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Recommended follow-up</p>
                  <p className="mt-1 text-sm leading-6 text-ink">
                    {person.relationshipHealth === "needs_attention"
                      ? "Send a warm nudge with one clear decision question."
                      : "Keep the next reply short and specific."}
                  </p>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function LoopList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">{title}</p>
      <div className="mt-2 space-y-2">
        {items.length ? (
          items.map((item) => (
            <p key={item} className="text-sm leading-5 text-ink">
              {item}
            </p>
          ))
        ) : (
          <p className="text-sm text-zinc-500">Clear</p>
        )}
      </div>
    </div>
  );
}

function MiniRelationshipStat({
  icon: Icon,
  value,
  label
}: {
  icon: typeof Mail;
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
