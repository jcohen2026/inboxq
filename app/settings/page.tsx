import { AlertCircle, CheckCircle2, Database, KeyRound, Link as LinkIcon, RefreshCcw, Settings2, ShieldCheck, Slack, Plus, Trash2 } from "lucide-react";
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
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

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
              className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-quiet hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
              Add Account
            </a>
          </div>
        }
      >
        {demoMode
          ? "Demo mode is active. Add multiple Google accounts to test the unified sync loop."
          : "Connected accounts will appear here. Multi-account OAuth is enabled."}
      </PageHeading>

      <GoogleOAuthBanner params={params} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-8">
          <PanelHeader 
            title="Connected Accounts" 
            action={<Badge>{context.connectedAccounts.length} sources</Badge>} 
          />
          <div className="divide-y divide-zinc-100">
            {context.connectedAccounts.length ? (
              context.connectedAccounts.map((account) => (
                <div key={account.id} className="flex flex-col gap-3 px-4 py-6 md:flex-row md:items-center md:justify-between hover:bg-zinc-50/50 transition-colors">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`mt-1 h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-lg font-bold shadow-sm`}>
                       {account.displayName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink truncate max-w-[200px]">{account.displayName}</span>
                        <Badge tone={account.status === "connected" ? "green" : "amber"}>
                          {account.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500 truncate">{account.email}</p>
                      <div className="mt-2 flex gap-1.5">
                        {account.scopes.map(s => (
                           <Badge key={s} tone="zinc" className="text-[10px] uppercase tracking-wider px-1.5 py-0">
                             {s}
                           </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Provider</p>
                      <p className="text-sm font-semibold text-zinc-700">{account.provider}</p>
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                  <LinkIcon className="h-6 w-6 text-zinc-400" />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-ink">No accounts connected</h3>
                <p className="mt-1 text-sm text-zinc-500">Add your Google accounts to start syncing emails and calendars.</p>
                <div className="mt-6">
                  <a href="/api/auth/google/start" className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-quiet hover:bg-zinc-800">
                    <Plus className="h-4 w-4" />
                    Connect your first account
                  </a>
                </div>
              </div>
            )}
          </div>
        </Panel>

        <div className="space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Sync Health" action={<RefreshCcw className="h-4 w-4 text-emerald-600" aria-hidden="true" />} />
            <div className="px-4 py-4 space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">Success Rate</span>
                    <span className="font-medium">98.2%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98.2%]" />
                  </div>
               </div>
               <div className="pt-2 border-t border-zinc-50 space-y-3">
                  <SyncMetric label="Last Global Sync" value="2m ago" />
                  <SyncMetric label="Parallel Workers" value="3 active" />
                  <SyncMetric label="Rate Limit Status" value="Healthy" tone="green" />
               </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Security" action={<ShieldCheck className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
            <div className="space-y-3 px-4 py-4">
              <SecurityRow icon={KeyRound} title="OAuth Storage" value="Encrypted (AES-256)" />
              <SecurityRow icon={ShieldCheck} title="Privacy" value="On-device processing preferred" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function SyncMetric({ label, value, tone = "zinc" }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className={`text-sm font-medium ${tone === 'green' ? 'text-emerald-600' : 'text-zinc-900'}`}>{value}</span>
    </div>
  )
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
      title: "Account connected successfully",
      body: hasRefreshToken
        ? "Your Google account has been connected and a refresh token was secured for background sync."
        : "The account was connected with an access token only. Background sync may be limited."
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
