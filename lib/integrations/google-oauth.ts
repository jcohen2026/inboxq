import { google } from "googleapis";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile"
];

export function getGoogleRedirectUri() {
  return process.env.GOOGLE_REDIRECT_URI;
}

export function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getGoogleRedirectUri();

  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getGoogleAuthorizationUrl(state: string): string | null {
  const client = getGoogleOAuthClient();

  if (!client) {
    return null;
  }

  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    scope: GOOGLE_SCOPES,
    state
  });
}

export async function exchangeGoogleCodeForTokens(code: string) {
  const client = getGoogleOAuthClient();

  if (!client) {
    throw new Error("Google OAuth is not configured.");
  }

  const { tokens } = await client.getToken(code);
  return tokens;
}

export function getGoogleClientWithTokens(tokens: {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
}) {
  const client = getGoogleOAuthClient();

  if (!client) {
    throw new Error("Google OAuth is not configured.");
  }

  client.setCredentials(tokens);
  return client;
}

export async function getGoogleUserProfile(tokens: any) {
  const client = getGoogleClientWithTokens(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data } = await oauth2.userinfo.get();
  return data;
}
