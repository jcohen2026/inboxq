import { google } from "googleapis";
import type { EmailThread } from "../types.ts";
import { getGoogleClientWithTokens } from "./google-oauth.ts";

export interface GmailSyncTokenSet {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
}

export async function syncRecentGmailThreads(input: {
  sourceAccountId: string;
  tokens: GmailSyncTokenSet;
  maxResults?: number;
}): Promise<Pick<EmailThread, "id" | "sourceAccountId" | "subject" | "snippet" | "lastMessageAt" | "providerMetadata">[]> {
  const auth = getGoogleClientWithTokens(input.tokens);
  const gmail = google.gmail({ version: "v1", auth });
  const list = await gmail.users.threads.list({
    userId: "me",
    maxResults: input.maxResults ?? 25
  });

  const threadIds = list.data.threads?.map((thread) => thread.id).filter(Boolean) ?? [];
  const threads = await Promise.all(
    threadIds.map(async (threadId) => {
      const result = await gmail.users.threads.get({
        userId: "me",
        id: threadId as string,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "To", "Date"]
      });

      const messages = result.data.messages ?? [];
      const lastMessage = messages[messages.length - 1];
      const headers = lastMessage?.payload?.headers ?? [];
      const subject = headers.find((header) => header.name?.toLowerCase() === "subject")?.value ?? "(No subject)";

      return {
        id: `gmail-${threadId}`,
        sourceAccountId: input.sourceAccountId,
        subject,
        snippet: result.data.snippet ?? "",
        lastMessageAt: lastMessage?.internalDate
          ? new Date(Number(lastMessage.internalDate)).toISOString()
          : new Date().toISOString(),
        providerMetadata: {
          gmailThreadId: threadId,
          historyId: result.data.historyId,
          messageCount: messages.length
        }
      };
    })
  );

  return threads;
}
