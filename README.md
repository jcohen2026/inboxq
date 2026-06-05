# InboxQ / Command Alpha

Single-user proof-of-concept for a personal AI morning homepage and productivity command center. It runs immediately in demo mode with three Google accounts, three calendars, unified inbox data, tasks, projects, people, AI insights, RSS/news placeholders, weather, sports, and quick links.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase schema for auth, storage, sync data, and RLS
- Google OAuth scaffolding for Gmail and Calendar
- OpenAI server-side briefing and extraction helpers
- Slack integration stub

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment values:

```bash
cp .env.example .env.local
```

3. Run the app:

```bash
npm run dev
```

4. Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

Use the same host everywhere during OAuth testing. If you open the app at `http://127.0.0.1:3000`, set the Google Cloud redirect URI and `GOOGLE_REDIRECT_URI` to `http://127.0.0.1:3000/api/auth/google/callback`. If you prefer `localhost`, use `localhost` everywhere instead.

Demo mode is enabled by default with `NEXT_PUBLIC_DEMO_MODE=true`. The app does not need Supabase, Google, Slack, or OpenAI credentials to render the product experience.

## Local Google Setup

Open [http://127.0.0.1:3000/setup/google](http://127.0.0.1:3000/setup/google) to save Google OAuth keys to `.env.local` from the app itself.

## Local Supabase Setup

Open [http://127.0.0.1:3000/setup/supabase](http://127.0.0.1:3000/setup/supabase) to save Supabase keys to `.env.local` from the app itself.

Paste the service role key only into that local setup page or directly into `.env.local`. Do not paste it into chat.

In Google Cloud:

- Create an OAuth Client ID for a Web application.
- Add `http://127.0.0.1:3000/api/auth/google/callback` as an authorized redirect URI.
- Enable Gmail API and Google Calendar API.
- Add your Google account as a test user.

After saving the keys in the setup screen, restart the app so the server can load `.env.local`.

## Environment

Required only when moving beyond demo mode:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SLACK_CLIENT_ID`
- `SLACK_CLIENT_SECRET`

## Pages

- Home Dashboard: morning briefing, priorities, calendar, availability, email loops, waiting lists, deadlines, placeholders, and quick links.
- Unified Inbox: multi-account Gmail feed with filters, source badges, AI summaries, commitments, suggested replies, and follow-ups.
- Calendar: agenda view across calendars with account/calendar filtering and AI availability analysis.
- Tasks / Commitments: normalized work items extracted from email/calendar or created manually.
- Projects: health, open tasks, recent source activity, related people, deadlines, and AI next action.
- People / Relationships: normalized contacts, recent loops, waiting states, and recommended follow-up.
- AI Chief of Staff: executive briefing with priorities, risks, opportunities, follow-ups, deadlines, and schedule adjustments.
- Integrations / Settings: account inventory, Google OAuth entry point, Slack stub, security posture, and sync logs.

## Data Model

The Supabase migration lives at `supabase/migrations/0001_initial_schema.sql` and includes:

- `users`
- `connected_accounts`
- `email_threads`
- `email_messages`
- `calendars`
- `calendar_events`
- `work_items`
- `projects`
- `people`
- `rss_sources`
- `dashboard_widgets`
- `ai_briefings`
- `ai_insights`
- `sync_logs`

Every provider-derived item preserves `source_account_id`, provider metadata, labels/colors, and related project/person references where available.

## Demo Data

Demo data lives in `lib/demo-data.ts`. It includes:

- 3 Google accounts
- 3 calendars
- Gmail threads/messages with AI labels
- Calendar events and conflicts
- AI-generated briefing sample
- Tasks/commitments
- Projects and people
- RSS/news, weather, sports, quick links, and sync logs

## Live Integration Notes

- Google OAuth routes are under `app/api/auth/google/*`.
- Google sync scaffolding is in `lib/integrations/gmail-sync.ts` and `lib/integrations/calendar-sync.ts`.
- OpenAI helpers are in `lib/ai.ts` and use compact structured inputs.
- Tokens must be encrypted and stored server-side before live sync is enabled.

## Tests

```bash
npm run test
```

Current coverage focuses on availability detection, conflict detection, priority sorting, and stale follow-up detection.

## Production TODOs

See `TODO.md`.

## Hosted Mobile Beta

See `DEPLOYMENT.md` for the Vercel, Supabase, Google OAuth, and mobile/PWA deployment path.
