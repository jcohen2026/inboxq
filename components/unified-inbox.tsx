"use client";

import { useMemo, useState } from "react";
import { Filter, MailOpen, Reply, Search, Sparkles } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { Badge, Panel, PanelHeader } from "@/components/ui";
import type { DemoContext, EmailThread } from "@/lib/types";
import { formatDateTime } from "@/lib/time";
import { cn } from "@/lib/cn";

type FlagFilter =
  | "all"
  | "unread"
  | "needs_response"
  | "important"
  | "waiting_on_me"
  | "waiting_on_others"
  | "commitments"
  | "reply_suggested"
  | "follow_up"
  | "palms_outreach";

const flagLabels: Record<FlagFilter, string> = {
  all: "All",
  unread: "Unread",
  needs_response: "Needs response",
  important: "Important",
  waiting_on_me: "Waiting on me",
  waiting_on_others: "Waiting on others",
  commitments: "Commitments",
  reply_suggested: "Reply suggested",
  follow_up: "Follow-up",
  palms_outreach: "Palms Outreach"
};

export function UnifiedInbox({ context }: { context: DemoContext }) {
  const [accountId, setAccountId] = useState("all");
  const [projectId, setProjectId] = useState("all");
  const [personId, setPersonId] = useState("all");
  const [flag, setFlag] = useState<FlagFilter>("all");
  const [query, setQuery] = useState("");

  const filteredThreads = useMemo(() => {
    return context.emailThreads
      .filter((thread) => accountId === "all" || thread.sourceAccountId === accountId)
      .filter((thread) => projectId === "all" || thread.projectId === projectId)
      .filter((thread) => personId === "all" || thread.personIds.includes(personId))
      .filter((thread) => matchesFlag(thread, flag))
      .filter((thread) => {
        if (!query.trim()) {
          return true;
        }
        const haystack = `${thread.subject} ${thread.snippet} ${thread.aiSummary} ${thread.labels.join(" ")}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [accountId, context.emailThreads, flag, personId, projectId, query]);

  const isPalmsMode = flag === "palms_outreach";

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Panel className="xl:col-span-3" variant={isPalmsMode ? "palms" : "default"}>
        <PanelHeader 
          title="Filters" 
          variant={isPalmsMode ? "palms" : "default"}
          action={<Filter className={cn("h-4 w-4", isPalmsMode ? "text-palms-gold" : "text-zinc-500")} aria-hidden="true" />} 
        />
        <div className="space-y-4 px-4 py-4">
          <label className="block">
            <span className={cn("text-xs font-medium uppercase tracking-normal", isPalmsMode ? "text-palms-amber" : "text-zinc-500")}>Search</span>
            <span className={cn(
              "mt-1 flex items-center gap-2 rounded-md border px-3 py-2",
              isPalmsMode ? "border-palms-gold/30 bg-palms-accent" : "border-zinc-200 bg-white"
            )}>
              <Search className={cn("h-4 w-4", isPalmsMode ? "text-palms-gold" : "text-zinc-500")} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={cn(
                  "min-w-0 flex-1 bg-transparent text-sm outline-none",
                  isPalmsMode ? "text-white placeholder:text-zinc-500" : "text-ink"
                )}
                placeholder="Subject, label, summary"
              />
            </span>
          </label>

          <Select label="Account" value={accountId} onChange={setAccountId} variant={isPalmsMode ? "palms" : "default"}>
            <option value="all">All accounts</option>
            {context.connectedAccounts
              .filter((account) => account.provider === "google")
              .map((account) => (
                <option key={account.id} value={account.id}>
                  {account.displayName}
                </option>
              ))}
          </Select>

          <Select label="Project" value={projectId} onChange={setProjectId} variant={isPalmsMode ? "palms" : "default"}>
            <option value="all">All projects</option>
            {context.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>

          <Select label="Person" value={personId} onChange={setPersonId} variant={isPalmsMode ? "palms" : "default"}>
            <option value="all">All people</option>
            {context.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </Select>

          <Select label="Flag" value={flag} onChange={(value) => setFlag(value as FlagFilter)} variant={isPalmsMode ? "palms" : "default"}>
            {(Object.keys(flagLabels) as FlagFilter[]).map((key) => (
              <option key={key} value={key} className={key === "palms_outreach" ? "font-bold text-palms-gold" : ""}>
                {flagLabels[key]}
              </option>
            ))}
          </Select>
        </div>
      </Panel>

      <Panel className="xl:col-span-9" variant={isPalmsMode ? "palms" : "default"}>
        <PanelHeader 
          title={isPalmsMode ? "Palms Outreach View" : "Unified Inbox"} 
          variant={isPalmsMode ? "palms" : "default"}
          action={<Badge variant={isPalmsMode ? "palms" : "default"} tone={isPalmsMode ? "gold" : "zinc"}>{filteredThreads.length} threads</Badge>} 
        />
        <div className={cn("divide-y", isPalmsMode ? "divide-palms-gold/10" : "divide-zinc-100")}>
          {filteredThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} context={context} isPalmsMode={isPalmsMode} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
  variant = "default"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  variant?: "default" | "palms";
}) {
  const isPalms = variant === "palms";
  return (
    <label className="block">
      <span className={cn("text-xs font-medium uppercase tracking-normal", isPalms ? "text-palms-amber" : "text-zinc-500")}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none",
          isPalms 
            ? "border-palms-gold/30 bg-palms-accent text-white focus:border-palms-gold" 
            : "border-zinc-200 bg-white text-ink focus:border-zinc-400"
        )}
      >
        {children}
      </select>
    </label>
  );
}

function ThreadCard({ thread, context, isPalmsMode }: { thread: EmailThread; context: DemoContext; isPalmsMode?: boolean }) {
  const account = context.connectedAccounts.find((candidate) => candidate.id === thread.sourceAccountId);
  const project = context.projects.find((candidate) => candidate.id === thread.projectId);
  const people = context.people.filter((person) => thread.personIds.includes(person.id));
  
  const isPalmsLead = people.some(p => p.company === "Spekit" || p.company === "Anduril Industries" || p.company === "Guild");
  const cardVariant = isPalmsMode || isPalmsLead ? "palms" : "default";

  return (
    <article className={cn("px-4 py-4 transition-colors", isPalmsLead && !isPalmsMode && "bg-palms-gold/5")}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <AccountBadge account={account} compact />
            {isPalmsLead && <Badge variant="palms" tone="gold"><Sparkles className="mr-1 h-3 w-3" /> Palms Lead</Badge>}
            {thread.unread ? <Badge tone="blue" variant={cardVariant}>Unread</Badge> : null}
            {thread.important ? <Badge tone="amber" variant={cardVariant}>Important</Badge> : null}
            {thread.needsResponse ? <Badge tone="red" variant={cardVariant}>Needs response</Badge> : null}
          </div>
          <h2 className={cn("mt-3 text-base font-semibold", cardVariant === "palms" ? "text-white" : "text-ink")}>{thread.subject}</h2>
          <p className={cn("mt-1 text-sm leading-6", cardVariant === "palms" ? "text-zinc-300" : "text-zinc-600")}>{thread.aiSummary}</p>
        </div>
        <p className={cn("shrink-0 text-sm", cardVariant === "palms" ? "text-palms-amber/60" : "text-zinc-500")}>{formatDateTime(thread.lastMessageAt)}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {thread.possibleCommitment ? <Badge tone="amber" variant={cardVariant}>Possible commitment detected</Badge> : null}
        {thread.replySuggested ? (
          <Badge tone="green" variant={cardVariant}>
            <Reply className="mr-1 h-3 w-3" aria-hidden="true" />
            Reply suggested
          </Badge>
        ) : null}
        {thread.followUpSuggested ? (
          <Badge tone="blue" variant={cardVariant}>
            <MailOpen className="mr-1 h-3 w-3" aria-hidden="true" />
            Follow-up suggested
          </Badge>
        ) : null}
        {project ? <Badge variant={cardVariant}>{project.name}</Badge> : null}
        {people.map((person) => (
          <Badge key={person.id} variant={cardVariant} tone={person.company === "Spekit" || person.company === "Anduril Industries" || person.company === "Guild" ? "gold" : "zinc"}>
            {person.name}
          </Badge>
        ))}
      </div>

      <div className={cn(
        "mt-4 rounded-md border px-3 py-2",
        cardVariant === "palms" ? "border-palms-gold/20 bg-palms-accent/50" : "border-zinc-200 bg-zinc-50"
      )}>
        <p className={cn("text-xs font-medium uppercase tracking-normal", cardVariant === "palms" ? "text-palms-amber/70" : "text-zinc-500")}>Source labels</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {thread.labels.map((label) => (
            <Badge key={label} variant={cardVariant}>{label}</Badge>
          ))}
        </div>
      </div>
    </article>
  );
}

function matchesFlag(thread: EmailThread, flag: FlagFilter): boolean {
  switch (flag) {
    case "all":
      return true;
    case "unread":
      return thread.unread;
    case "needs_response":
      return thread.needsResponse;
    case "important":
      return thread.important;
    case "waiting_on_me":
      return thread.waitingOnMe;
    case "waiting_on_others":
      return thread.waitingOnOthers;
    case "commitments":
      return thread.possibleCommitment;
    case "reply_suggested":
      return thread.replySuggested;
    case "follow_up":
      return thread.followUpSuggested;
    case "palms_outreach":
      // Filter for specific campaign companies
      return thread.labels.some(l => l.toLowerCase().includes("palms") || l.toLowerCase().includes("sko")) || 
             thread.subject.toLowerCase().includes("palms") ||
             thread.subject.toLowerCase().includes("sko");
  }
}
