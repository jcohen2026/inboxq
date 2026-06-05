import { google } from "googleapis";
import type { CalendarEvent, CalendarSource } from "../types.ts";
import { getGoogleClientWithTokens } from "./google-oauth.ts";
import type { GmailSyncTokenSet } from "./gmail-sync.ts";

export async function syncGoogleCalendars(input: {
  sourceAccountId: string;
  tokens: GmailSyncTokenSet;
}): Promise<CalendarSource[]> {
  const auth = getGoogleClientWithTokens(input.tokens);
  const calendar = google.calendar({ version: "v3", auth });
  const list = await calendar.calendarList.list();

  return (list.data.items ?? []).map((item) => ({
    id: `gcal-${item.id}`,
    sourceAccountId: input.sourceAccountId,
    providerCalendarId: item.id ?? "unknown",
    name: item.summary ?? "Calendar",
    color: item.backgroundColor ?? "#3868d6",
    timezone: item.timeZone ?? "UTC",
    selected: item.selected ?? true,
    providerMetadata: {
      accessRole: item.accessRole,
      primary: item.primary ?? false
    }
  }));
}

export async function syncGoogleCalendarEvents(input: {
  sourceAccountId: string;
  calendarId: string;
  providerCalendarId: string;
  tokens: GmailSyncTokenSet;
  timeMin?: string;
  timeMax?: string;
}): Promise<CalendarEvent[]> {
  const auth = getGoogleClientWithTokens(input.tokens);
  const calendar = google.calendar({ version: "v3", auth });
  const result = await calendar.events.list({
    calendarId: input.providerCalendarId,
    timeMin: input.timeMin ?? new Date().toISOString(),
    timeMax: input.timeMax,
    singleEvents: true,
    orderBy: "startTime"
  });

  return (result.data.items ?? []).map((event) => ({
    id: `gcal-event-${event.id}`,
    sourceAccountId: input.sourceAccountId,
    calendarId: input.calendarId,
    title: event.summary ?? "(No title)",
    startsAt: event.start?.dateTime ?? event.start?.date ?? new Date().toISOString(),
    endsAt: event.end?.dateTime ?? event.end?.date ?? new Date().toISOString(),
    location: event.location ?? undefined,
    attendeePersonIds: [],
    status: event.status === "cancelled" ? "cancelled" : event.status === "tentative" ? "tentative" : "confirmed",
    descriptionPreview: event.description?.slice(0, 220),
    providerMetadata: {
      googleEventId: event.id,
      htmlLink: event.htmlLink,
      attendees: event.attendees
    }
  }));
}
