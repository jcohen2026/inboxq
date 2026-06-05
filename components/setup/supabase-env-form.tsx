"use client";

import { type FormEvent, useState } from "react";
import { CheckCircle2, Database, Save, ShieldCheck } from "lucide-react";
import { Badge, Panel, PanelHeader } from "@/components/ui";

type SupabaseEnvFormProps = {
  defaults: {
    supabaseUrl: string;
    anonKey: string;
  };
  configured: {
    supabaseUrl: boolean;
    anonKey: boolean;
    serviceRoleKey: boolean;
  };
};

type Status =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function SupabaseEnvForm({ defaults, configured }: SupabaseEnvFormProps) {
  const [supabaseUrl, setSupabaseUrl] = useState(defaults.supabaseUrl);
  const [anonKey, setAnonKey] = useState(defaults.anonKey);
  const [serviceRoleKey, setServiceRoleKey] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "saving" });

    const response = await fetch("/api/setup/supabase-env", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ supabaseUrl, anonKey, serviceRoleKey })
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus({ type: "error", message: payload.error ?? "Could not save Supabase settings." });
      return;
    }

    setStatus({ type: "success", message: "Saved to .env.local. Restart the app so the server can load the service role key." });
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Panel className="xl:col-span-7">
        <PanelHeader
          title="Supabase keys"
          eyebrow="Local beta"
          action={
            <div className="flex flex-wrap gap-2">
              <Badge tone={configured.supabaseUrl ? "green" : "amber"}>URL</Badge>
              <Badge tone={configured.anonKey ? "green" : "amber"}>Anon</Badge>
              <Badge tone={configured.serviceRoleKey ? "green" : "amber"}>Service role</Badge>
            </div>
          }
        />
        <form onSubmit={onSubmit} className="space-y-4 px-4 py-4">
          <Field label="Supabase project URL" value={supabaseUrl} onChange={setSupabaseUrl} placeholder="https://your-project.supabase.co" />
          <Field label="Anon / publishable key" value={anonKey} onChange={setAnonKey} placeholder="sb_publishable_..." />
          <Field
            label="Service role key"
            value={serviceRoleKey}
            onChange={setServiceRoleKey}
            placeholder="Paste from Supabase Project Settings > API"
            type="password"
          />

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
        <PanelHeader title="Where to find this" action={<Database className="h-4 w-4 text-zinc-500" aria-hidden="true" />} />
        <div className="space-y-4 px-4 py-4 text-sm leading-6 text-zinc-700">
          <div>
            <p className="font-semibold text-ink">Supabase dashboard</p>
            <p className="mt-1">Go to Project Settings, then API.</p>
          </div>
          <div>
            <p className="font-semibold text-ink">Use these values</p>
            <p className="mt-1">Project URL, anon or publishable key, and service role key.</p>
          </div>
          <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Only paste the service role key here locally. Do not put it in chat or client-side code.</p>
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
