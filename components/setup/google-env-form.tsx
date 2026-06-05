"use client";

import { type FormEvent, useState } from "react";
import { CheckCircle2, Copy, KeyRound, Save } from "lucide-react";
import { Badge, Panel, PanelHeader } from "@/components/ui";

type GoogleEnvFormProps = {
  defaultRedirectUri: string;
  configured: {
    clientId: boolean;
    clientSecret: boolean;
    redirectUri: boolean;
  };
};

type Status =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function GoogleEnvForm({ defaultRedirectUri, configured }: GoogleEnvFormProps) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState(defaultRedirectUri);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "saving" });

    const response = await fetch("/api/setup/google-env", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ clientId, clientSecret, redirectUri })
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus({ type: "error", message: payload.error ?? "Could not save Google settings." });
      return;
    }

    setStatus({ type: "success", message: "Saved to .env.local. Restart the app, then use Connect Google." });
  }

  async function copyRedirectUri() {
    await navigator.clipboard.writeText(redirectUri);
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Panel className="xl:col-span-7">
        <PanelHeader
          title="Google OAuth keys"
          eyebrow="Local beta"
          action={
            <div className="flex flex-wrap gap-2">
              <Badge tone={configured.clientId ? "green" : "amber"}>Client ID</Badge>
              <Badge tone={configured.clientSecret ? "green" : "amber"}>Secret</Badge>
              <Badge tone={configured.redirectUri ? "green" : "amber"}>Callback</Badge>
            </div>
          }
        />
        <form onSubmit={onSubmit} className="space-y-4 px-4 py-4">
          <Field
            label="Google client ID"
            value={clientId}
            onChange={setClientId}
            placeholder="1234567890-abc.apps.googleusercontent.com"
          />
          <Field
            label="Google client secret"
            value={clientSecret}
            onChange={setClientSecret}
            placeholder="GOCSPX-..."
            type="password"
          />
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-normal text-zinc-500">Redirect URI</span>
            <span className="mt-1 flex items-center gap-2">
              <input
                value={redirectUri}
                onChange={(event) => setRedirectUri(event.target.value)}
                className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-zinc-400"
              />
              <button
                type="button"
                onClick={copyRedirectUri}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-quiet hover:bg-zinc-50"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy
              </button>
            </span>
          </label>

          {status.type === "success" ? (
            <div className="flex gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{status.message}</span>
            </div>
          ) : null}

          {status.type === "error" ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{status.message}</div>
          ) : null}

          <button
            type="submit"
            disabled={status.type === "saving"}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {status.type === "saving" ? "Saving" : "Save local settings"}
          </button>
        </form>
      </Panel>

      <Panel className="xl:col-span-5">
        <PanelHeader title="Google Cloud checklist" action={<KeyRound className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
        <div className="space-y-4 px-4 py-4 text-sm leading-6 text-zinc-700">
          <p>Create a Google Cloud OAuth client for a Web application, then paste its client ID and client secret here.</p>
          <div>
            <p className="font-semibold text-ink">Authorized redirect URI</p>
            <p className="mt-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-700">{redirectUri}</p>
          </div>
          <div>
            <p className="font-semibold text-ink">Enable APIs</p>
            <p className="mt-1">Gmail API and Google Calendar API.</p>
          </div>
          <div>
            <p className="font-semibold text-ink">OAuth test users</p>
            <p className="mt-1">Add the Google account you want to connect as a test user.</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "password";
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-normal text-zinc-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-zinc-400"
      />
    </label>
  );
}
