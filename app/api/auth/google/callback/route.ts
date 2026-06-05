import { NextRequest, NextResponse } from "next/server";
import { exchangeGoogleCodeForTokens } from "@/lib/integrations/google-oauth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const settingsUrl = new URL("/settings", request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.cookies.get("google_oauth_state")?.value;

  if (!code || !state || state !== cookieState) {
    settingsUrl.searchParams.set("google", "invalid_callback");
    settingsUrl.searchParams.set("reason", !code || !state ? "missing_code_or_state" : "state_mismatch");
    const response = NextResponse.redirect(settingsUrl);
    response.cookies.delete("google_oauth_state");
    return response;
  }

  try {
    const tokens = await exchangeGoogleCodeForTokens(code);
    settingsUrl.searchParams.set("google", "oauth_received");
    settingsUrl.searchParams.set("access", tokens.access_token ? "1" : "0");
    settingsUrl.searchParams.set("refresh", tokens.refresh_token ? "1" : "0");
    const response = NextResponse.redirect(settingsUrl);
    response.cookies.delete("google_oauth_state");
    return response;
  } catch {
    settingsUrl.searchParams.set("google", "exchange_failed");
    const response = NextResponse.redirect(settingsUrl);
    response.cookies.delete("google_oauth_state");
    return response;
  }
}
