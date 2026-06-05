import { AiInsightPanel } from "@/components/ai-insight-panel";
import { PageHeading } from "@/components/page-heading";
import { UnifiedInbox } from "@/components/unified-inbox";
import { getDemoContext } from "@/lib/demo-data";

export default function InboxPage() {
  const context = getDemoContext();

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading eyebrow="Unified Inbox" title="All Gmail accounts">
        {context.emailThreads.filter((thread) => thread.needsResponse).length} threads need response across{" "}
        {context.connectedAccounts.filter((account) => account.scopes.includes("gmail")).length} inboxes.
      </PageHeading>
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-12">
        <div className="2xl:col-span-8">
          <UnifiedInbox context={context} />
        </div>
        <div className="2xl:col-span-4">
          <AiInsightPanel insights={context.aiInsights.filter((insight) => insight.type !== "schedule")} />
        </div>
      </div>
    </div>
  );
}
