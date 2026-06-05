import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_ENV_KEYS = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"] as const;

export async function POST(request: NextRequest) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: "Local setup is only available from localhost." }, { status: 403 });
  }

  const body = (await request.json()) as {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  };

  const clientId = sanitizeValue(body.clientId);
  const clientSecret = sanitizeValue(body.clientSecret);
  const redirectUri = sanitizeValue(body.redirectUri);

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "Client ID, client secret, and redirect URI are required." }, { status: 400 });
  }

  let parsedRedirectUri: URL;
  try {
    parsedRedirectUri = new URL(redirectUri);
  } catch {
    return NextResponse.json({ error: "Redirect URI must be a valid URL." }, { status: 400 });
  }

  if (!["127.0.0.1", "localhost"].includes(parsedRedirectUri.hostname)) {
    return NextResponse.json({ error: "This local setup flow only accepts localhost redirect URIs." }, { status: 400 });
  }

  if (parsedRedirectUri.pathname !== "/api/auth/google/callback") {
    return NextResponse.json({ error: "Redirect URI path must be /api/auth/google/callback." }, { status: 400 });
  }

  const envPath = path.join(process.cwd(), ".env.local");
  const examplePath = path.join(process.cwd(), ".env.example");
  const existing = await readTextIfExists(envPath);
  const fallback = existing ?? (await readTextIfExists(examplePath)) ?? "";
  const env = parseEnvFile(fallback);

  env.NEXT_PUBLIC_APP_URL = parsedRedirectUri.origin;
  env.NEXT_PUBLIC_DEMO_MODE = "false";
  env.GOOGLE_CLIENT_ID = clientId;
  env.GOOGLE_CLIENT_SECRET = clientSecret;
  env.GOOGLE_REDIRECT_URI = redirectUri;

  await fs.writeFile(envPath, stringifyEnvFile(env), "utf8");

  return NextResponse.json({
    status: "saved",
    restartRequired: true,
    configured: Object.fromEntries(GOOGLE_ENV_KEYS.map((key) => [key, Boolean(env[key])]))
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
