import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthorizationUrl, getGoogleRedirectUri } from "@/lib/integrations/google-oauth";

export async function GET(request: NextRequest) {
  const state = crypto.randomUUID();
  const settingsUrl = new URL("/settings", request.url);
  const redirectUri = getGoogleRedirectUri();

  if (redirectUri) {
    const configuredRedirectUrl = new URL(redirectUri);
    const currentAppUrl = new URL(request.url);

    if (configuredRedirectUrl.host !== currentAppUrl.host) {
      settingsUrl.searchParams.set("google", "host_mismatch");
      settingsUrl.searchParams.set("appHost", currentAppUrl.host);
      settingsUrl.searchParams.set("callbackHost", configuredRedirectUrl.host);
      return NextResponse.redirect(settingsUrl);
    }
  }

  const url = getGoogleAuthorizationUrl(state);

  if (!url) {
    settingsUrl.searchParams.set("google", "not_configured");
    return NextResponse.redirect(settingsUrl);
  }

  const response = NextResponse.redirect(url);
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10
  });

  return response;
}
