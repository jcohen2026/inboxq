import { Mail, MessageSquare, UserRound, Sparkles } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { PageHeading } from "@/components/page-heading";
import { Badge, Panel, PanelHeader } from "@/components/ui";
import { getDemoContext } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/time";
import { cn } from "@/lib/cn";

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
          
          // Check if this person is part of the Palms Outreach campaign
          const isPalmsLead = person.company === "Spekit" || person.company === "Anduril Industries" || person.company === "Guild";

          return (
            <Panel key={person.id} variant={isPalmsLead ? "palms" : "default"}>
              <PanelHeader 
                title={person.name} 
                eyebrow={isPalmsLead ? `Palms Lead - ${person.company}` : `${person.role} - ${person.company}`} 
                variant={isPalmsLead ? "palms" : "default"}
                action={
                  isPalmsLead ? (
                    <Sparkles className="h-4 w-4 text-palms-gold" aria-hidden="true" />
                  ) : (
                    <UserRound className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                  )
                } 
              />
              <div className="space-y-4 px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={isPalmsLead ? "palms" : "default"}
                    tone={person.relationshipHealth === "needs_attention" ? "amber" : person.relationshipHealth === "strong" ? "green" : "blue"}
                  >
                    {person.relationshipHealth.replace("_", " ")}
                  </Badge>
                  <Badge variant={isPalmsLead ? "palms" : "default"}>
                    {formatDateTime(person.lastInteractionAt)}
                  </Badge>
                </div>

                <p className={cn("text-sm leading-6", isPalmsLead ? "text-zinc-300" : "text-zinc-600")}>
                  {person.notes}
                </p>

                <div>
                  <p className={cn("text-xs font-medium uppercase tracking-normal", isPalmsLead ? "text-palms-amber/70" : "text-zinc-500")}>
                    Related accounts
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {accounts.map((account) => (
                      <AccountBadge key={account.id} account={account} compact />
                    ))}
                  </div>
                </div>

                <div className={cn("grid grid-cols-3 gap-3 border-y py-3", isPalmsLead ? "border-palms-gold/20" : "border-zinc-100")}>
                  <MiniRelationshipStat icon={Mail} value={threads.length} label="Emails" isPalms={isPalmsLead} />
                  <MiniRelationshipStat icon={MessageSquare} value={events.length} label="Events" isPalms={isPalmsLead} />
                  <MiniRelationshipStat icon={UserRound} value={workItems.length} label="Open loops" isPalms={isPalmsLead} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <LoopList title="Waiting on me" items={waitingOnMe.map((item) => item.title)} isPalms={isPalmsLead} />
                  <LoopList title="Waiting on them" items={waitingOnThem.map((item) => item.title)} isPalms={isPalmsLead} />
                </div>

                <div>
                  <p className={cn("text-xs font-medium uppercase tracking-normal", isPalmsLead ? "text-palms-amber/70" : "text-zinc-500")}>
                    Recommended follow-up
                  </p>
                  <p className={cn("mt-1 text-sm leading-6", isPalmsLead ? "text-white" : "text-ink")}>
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

function LoopList({ title, items, isPalms }: { title: string; items: string[]; isPalms?: boolean }) {
  return (
    <div>
      <p className={cn("text-xs font-medium uppercase tracking-normal", isPalms ? "text-palms-amber/70" : "text-zinc-500")}>
        {title}
      </p>
      <div className="mt-2 space-y-2">
        {items.length ? (
          items.map((item) => (
            <p key={item} className={cn("text-sm leading-5", isPalms ? "text-white" : "text-ink")}>
              {item}
            </p>
          ))
        ) : (
          <p className={cn("text-sm", isPalms ? "text-zinc-500" : "text-zinc-500")}>Clear</p>
        )}
      </div>
    </div>
  );
}

function MiniRelationshipStat({
  icon: Icon,
  value,
  label,
  isPalms
}: {
  icon: typeof Mail;
  value: number;
  label: string;
  isPalms?: boolean;
}) {
  return (
    <div>
      <Icon className={cn("h-4 w-4", isPalms ? "text-palms-gold" : "text-zinc-500")} aria-hidden="true" />
      <p className={cn("mt-2 text-lg font-semibold", isPalms ? "text-white" : "text-ink")}>{value}</p>
      <p className={cn("text-xs", isPalms ? "text-palms-amber/70" : "text-zinc-500")}>{label}</p>
    </div>
  );
}
