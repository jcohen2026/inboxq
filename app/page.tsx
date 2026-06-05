import { Mail, RefreshCcw, Sparkles } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { DashboardWidgets } from "@/components/dashboard-widgets";
import { PageHeading } from "@/components/page-heading";
import { Badge, Metric, Panel } from "@/components/ui";
import { getDemoContext } from "@/lib/demo-data";
import { getEmailsNeedingResponse, getUpcomingDeadlines } from "@/lib/commitments";

export default function HomePage() {
  const context = getDemoContext();
  const responseCount = getEmailsNeedingResponse(context.emailThreads).length;
  const deadlineCount = getUpcomingDeadlines(context.workItems).length;
  const googleAccountCount = context.connectedAccounts.filter((account) => account.provider === "google").length;
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Morning Command Center"
        title="InboxQ / Command Alpha"
        action={
          <a
            href="/api/ai/morning-briefing"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-quiet hover:bg-zinc-50"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Refresh Brief
          </a>
        }
      >
        One personal view across Gmail, calendars, commitments, projects, people, and AI recommendations.
      </PageHeading>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel className="px-4 py-4 lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            {googleAccountCount ? (
              context.connectedAccounts
                .filter((account) => account.provider === "google")
                .map((account) => (
                <AccountBadge key={account.id} account={account} />
                ))
            ) : (
              <p className="text-sm text-zinc-600">No Google accounts connected yet.</p>
            )}
          </div>
        </Panel>
        <Panel className="grid grid-cols-3 gap-4 px-4 py-4 lg:col-span-7">
          <Metric label="Inboxes" value={googleAccountCount} tone="blue" />
          <Metric label="Need reply" value={responseCount} tone="amber" />
          <Metric label="Deadlines" value={deadlineCount} tone="green" />
        </Panel>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge tone="green">
          <RefreshCcw className="mr-1 h-3 w-3" aria-hidden="true" />
          {demoMode ? "Demo sync current" : "Private beta mode"}
        </Badge>
        <Badge tone="blue">
          <Mail className="mr-1 h-3 w-3" aria-hidden="true" />
          {responseCount} response loops
        </Badge>
      </div>

      <DashboardWidgets context={context} />
    </div>
  );
}
