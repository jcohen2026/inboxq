import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

export async function POST(request: NextRequest) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: "Local setup is only available from localhost." }, { status: 403 });
  }

  const body = (await request.json()) as {
    supabaseUrl?: string;
    anonKey?: string;
    serviceRoleKey?: string;
  };

  const supabaseUrl = sanitizeValue(body.supabaseUrl);
  const anonKey = sanitizeValue(body.anonKey);
  const serviceRoleKey = sanitizeValue(body.serviceRoleKey);

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase URL, anon key, and service role key are required." }, { status: 400 });
  }

  let parsedSupabaseUrl: URL;
  try {
    parsedSupabaseUrl = new URL(supabaseUrl);
  } catch {
    return NextResponse.json({ error: "Supabase URL must be a valid URL." }, { status: 400 });
  }

  if (parsedSupabaseUrl.protocol !== "https:" || !parsedSupabaseUrl.hostname.endsWith(".supabase.co")) {
    return NextResponse.json({ error: "Supabase URL should look like https://your-project.supabase.co." }, { status: 400 });
  }

  if (!anonKey.startsWith("sb_publishable_") && !anonKey.startsWith("eyJ")) {
    return NextResponse.json({ error: "Anon key does not look like a Supabase anon or publishable key." }, { status: 400 });
  }

  if (!serviceRoleKey.startsWith("sb_secret_") && !serviceRoleKey.startsWith("eyJ")) {
    return NextResponse.json({ error: "Service role key does not look like a Supabase secret or service role key." }, { status: 400 });
  }

  const envPath = path.join(process.cwd(), ".env.local");
  const examplePath = path.join(process.cwd(), ".env.example");
  const existing = await readTextIfExists(envPath);
  const fallback = existing ?? (await readTextIfExists(examplePath)) ?? "";
  const env = parseEnvFile(fallback);

  env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey;
  env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;

  await fs.writeFile(envPath, stringifyEnvFile(env), "utf8");

  return NextResponse.json({
    status: "saved",
    restartRequired: true,
    configured: Object.fromEntries(SUPABASE_ENV_KEYS.map((key) => [key, Boolean(env[key])]))
  });
}

function isLocalRequest(request: NextRequest) {
  const host = request.nextUrl.hostname;
  return host === "127.0.0.1" || host === "localhost" || host === "::1";
}

function sanitizeValue(value?: string) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed.includes("\n") || trimmed.includes("\r")) {
    return "";
  }

  return trimmed;
}

async function readTextIfExists(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function parseEnvFile(contents: string) {
  const env: Record<string, string> = {};

  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();
    if (key) {
      env[key] = value;
    }
  }

  return env;
}

function stringifyEnvFile(env: Record<string, string>) {
  const orderedKeys = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_DEMO_MODE",
    "",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
    "",
    "SLACK_CLIENT_ID",
    "SLACK_CLIENT_SECRET"
  ];

  const seen = new Set<string>();
  const lines = orderedKeys.map((key) => {
    if (!key) {
      return "";
    }

    seen.add(key);
    return `${key}=${env[key] ?? ""}`;
  });

  for (const key of Object.keys(env).sort()) {
    if (!seen.has(key)) {
      lines.push(`${key}=${env[key]}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
