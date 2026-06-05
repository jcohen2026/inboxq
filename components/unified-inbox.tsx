"use client";

import { useMemo, useState } from "react";
import { Filter, MailOpen, Reply, Search } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { Badge, Panel, PanelHeader } from "@/components/ui";
import type { DemoContext, EmailThread } from "@/lib/types";
import { formatDateTime } from "@/lib/time";

type FlagFilter =
  | "all"
  | "unread"
  | "needs_response"
  | "important"
  | "waiting_on_me"
  | "waiting_on_others"
  | "commitments"
  | "reply_suggested"
  | "follow_up";

const flagLabels: Record<FlagFilter, string> = {
  all: "All",
  unread: "Unread",
  needs_response: "Needs response",
  important: "Important",
  waiting_on_me: "Waiting on me",
  waiting_on_others: "Waiting on others",
  commitments: "Commitments",
  reply_suggested: "Reply suggested",
  follow_up: "Follow-up"
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

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Panel className="xl:col-span-3">
        <PanelHeader title="Filters" action={<Filter className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
        <div className="space-y-4 px-4 py-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-normal text-zinc-500">Search</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none"
                placeholder="Subject, label, summary"
              />
            </span>
          </label>

          <Select label="Account" value={accountId} onChange={setAccountId}>
            <option value="all">All accounts</option>
            {context.connectedAccounts
              .filter((account) => account.provider === "google")
              .map((account) => (
                <option key={account.id} value={account.id}>
                  {account.displayName}
                </option>
              ))}
          </Select>

          <Select label="Project" value={projectId} onChange={setProjectId}>
            <option value="all">All projects</option>
            {context.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>

          <Select label="Person" value={personId} onChange={setPersonId}>
            <option value="all">All people</option>
            {context.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </Select>

          <Select label="Flag" value={flag} onChange={(value) => setFlag(value as FlagFilter)}>
            {(Object.keys(flagLabels) as FlagFilter[]).map((key) => (
              <option key={key} value={key}>
                {flagLabels[key]}
              </option>
            ))}
          </Select>
        </div>
      </Panel>

      <Panel className="xl:col-span-9">
        <PanelHeader title="Unified Inbox" action={<Badge>{filteredThreads.length} threads</Badge>} />
        <div className="divide-y divide-zinc-100">
          {filteredThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} context={context} />
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
  children
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-normal text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-zinc-400"
      >
        {children}
      </select>
    </label>
  );
}

function ThreadCard({ thread, context }: { thread: EmailThread; context: DemoContext }) {
  const account = context.connectedAccounts.find((candidate) => candidate.id === thread.sourceAccountId);
  const project = context.projects.find((candidate) => candidate.id === thread.projectId);
  const people = context.people.filter((person) => thread.personIds.includes(person.id));

  return (
    <article className="px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <AccountBadge account={account} compact />
            {thread.unread ? <Badge tone="blue">Unread</Badge> : null}
            {thread.important ? <Badge tone="amber">Important</Badge> : null}
            {thread.needsResponse ? <Badge tone="red">Needs response</Badge> : null}
            {thread.waitingOnOthers ? <Badge tone="green">Waiting on others</Badge> : null}
          </div>
          <h2 className="mt-3 text-base font-semibold text-ink">{thread.subject}</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{thread.aiSummary}</p>
        </div>
        <p className="shrink-0 text-sm text-zinc-500">{formatDateTime(thread.lastMessageAt)}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {thread.possibleCommitment ? <Badge tone="amber">Possible commitment detected</Badge> : null}
        {thread.replySuggested ? (
          <Badge tone="green">
            <Reply className="mr-1 h-3 w-3" aria-hidden="true" />
            Reply suggested
          </Badge>
        ) : null}
        {thread.followUpSuggested ? (
          <Badge tone="blue">
            <MailOpen className="mr-1 h-3 w-3" aria-hidden="true" />
            Follow-up suggested
          </Badge>
        ) : null}
        {project ? <Badge>{project.name}</Badge> : null}
        {people.map((person) => (
          <Badge key={person.id}>{person.name}</Badge>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Source labels</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {thread.labels.map((label) => (
            <Badge key={label}>{label}</Badge>
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
  }
}
