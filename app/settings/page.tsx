import { AlertCircle, CheckCircle2, Database, KeyRound, Link as LinkIcon, RefreshCcw, Settings2, ShieldCheck, Slack } from "lucide-react";
import { AccountBadge } from "@/components/account-badge";
import { PageHeading } from "@/components/page-heading";
import { Badge, Panel, PanelHeader } from "@/components/ui";
import { getDemoContext } from "@/lib/demo-data";
import { getSlackConnectionStatus } from "@/lib/integrations/slack";
import { formatDateTime } from "@/lib/time";

type SettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = searchParams ? await searchParams : {};
  const context = getDemoContext();
  const slack = getSlackConnectionStatus();
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Integrations / Settings"
        title="Connected sources"
        action={
          <div className="flex flex-wrap gap-2">
            <a
              href="/setup/supabase"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-quiet hover:bg-zinc-50"
            >
              <Database className="h-4 w-4" aria-hidden="true" />
              Set Up Supabase
            </a>
            <a
              href="/setup/google"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-quiet hover:bg-zinc-50"
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              Set Up Google
            </a>
            <a
              href="/api/auth/google/start"
              className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white shadow-quiet hover:bg-zinc-800"
            >
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
              Connect Google
            </a>
          </div>
        }
      >
        {demoMode
          ? "Demo mode is active until Google, Supabase, Slack, and OpenAI environment variables are configured."
          : "Private beta mode is active. Connected accounts will appear here after live Google sync is enabled."}
      </PageHeading>

      <GoogleOAuthBanner params={params} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-7">
          <PanelHeader title="Accounts" action={<Badge>{context.connectedAccounts.length} sources</Badge>} />
          <div className="divide-y divide-zinc-100">
            {context.connectedAccounts.length ? (
              context.connectedAccounts.map((account) => (
                <div key={account.id} className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <AccountBadge account={account} />
                      <Badge tone={account.status === "connected" ? "green" : "amber"}>{account.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">{account.scopes.join(", ")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{account.provider}</Badge>
                    <Badge>{String(account.providerMetadata.sourceLabel ?? account.providerMetadata.workspace ?? "source")}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6">
                <p className="text-sm font-semibold text-ink">No connected accounts yet</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Use Set Up Google to add OAuth credentials, then Connect Google. The account will appear here once token storage and live sync are enabled.
                </p>
              </div>
            )}
          </div>
        </Panel>

        <div className="space-y-4 xl:col-span-5">
          <Panel>
            <PanelHeader title="Security posture" action={<ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />} />
            <div className="space-y-3 px-4 py-4">
              <SecurityRow icon={KeyRound} title="OAuth tokens" value="Server-side only" />
              <SecurityRow icon={Database} title="Storage" value="Supabase schema ready" />
              <SecurityRow icon={ShieldCheck} title="RLS" value="Policies included" />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Slack" action={<Slack className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
            <div className="px-4 py-4">
              <Badge tone={slack.enabled ? "green" : "amber"}>{slack.enabled ? "configured" : "stubbed"}</Badge>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{slack.message}</p>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Sync logs" action={<RefreshCcw className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
            <div className="divide-y divide-zinc-100">
              {context.syncLogs.map((log) => {
                const account = context.connectedAccounts.find((candidate) => candidate.id === log.sourceAccountId);
                return (
                  <div key={log.id} className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <AccountBadge account={account} compact />
                      <Badge tone={log.status === "success" ? "green" : "amber"}>{log.status}</Badge>
                      <Badge>{log.syncType}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">{log.message}</p>
                    <p className="mt-1 text-xs text-zinc-500">{formatDateTime(log.completedAt)}</p>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function GoogleOAuthBanner({ params }: { params: Record<string, string | string[] | undefined> }) {
  const status = readParam(params.google);

  if (!status) {
    return null;
  }

  const appHost = readParam(params.appHost);
  const callbackHost = readParam(params.callbackHost);
  const reason = readParam(params.reason);
  const hasRefreshToken = readParam(params.refresh) === "1";

  const copy: Record<string, { tone: "success" | "warning"; title: string; body: string }> = {
    not_configured: {
      tone: "warning",
      title: "Google OAuth is not configured",
      body: "Use Set Up Google to save GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI locally, then restart the app."
    },
    host_mismatch: {
      tone: "warning",
      title: "Google callback host does not match this app",
      body: `You opened the app on ${appHost ?? "this host"}, but GOOGLE_REDIRECT_URI points to ${callbackHost ?? "a different host"}. Use one host consistently, for example 127.0.0.1:3000 everywhere.`
    },
    invalid_callback: {
      tone: "warning",
      title: "Google callback could not be verified",
      body:
        reason === "state_mismatch"
          ? "The OAuth state cookie did not match. Start from Connect Google again, and make sure the app URL and Google redirect URI use the exact same host."
          : "The callback was missing the expected Google code or state. Start from Connect Google again."
    },
    exchange_failed: {
      tone: "warning",
      title: "Google token exchange failed",
      body: "Google returned a code, but the app could not exchange it. Check the client secret and make sure the redirect URI exactly matches Google Cloud."
    },
    oauth_received: {
      tone: "success",
      title: "Google authorization received",
      body: hasRefreshToken
        ? "The callback returned a refresh token. The next beta step is encrypting and saving it to connected_accounts, then running live sync."
        : "The callback returned an access token but no refresh token. Reconnect with consent prompt if offline sync is needed."
    }
  };

  const message = copy[status];

  if (!message) {
    return null;
  }

  const Icon = message.tone === "success" ? CheckCircle2 : AlertCircle;
  const toneClasses =
    message.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <div className={`mb-4 flex gap-3 rounded-lg border px-4 py-3 ${toneClasses}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold">{message.title}</p>
        <p className="mt-1 text-sm leading-6">{message.body}</p>
      </div>
    </div>
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function SecurityRow({
  icon: Icon,
  title,
  value
}: {
  icon: typeof KeyRound;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-sm text-zinc-600">{value}</p>
      </div>
    </div>
  );
}
