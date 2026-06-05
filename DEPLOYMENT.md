# Hosted Beta Deployment

This app can run as a real web app, reachable from desktop and mobile browsers.

## Recommended Beta Stack

- Vercel for the Next.js app
- Supabase Cloud for auth and database
- Google Cloud OAuth for Gmail and Calendar access
- OpenAI API for server-side AI summaries and briefing generation

## Deployment Steps

### 1. Put The Code Somewhere Vercel Can Read

Create a GitHub repository and push this project to it. Vercel can also import from GitLab or Bitbucket, but GitHub is the usual simplest path.

### 2. Create Supabase

Create a new Supabase Cloud project.

Open the SQL editor and run:

```text
supabase/migrations/0001_initial_schema.sql
```

Copy these values from Supabase Project Settings > API:

- Project URL
- Anon public key
- Service role key

Keep the service role key private.

### 3. Create Google OAuth

In Google Cloud:

- Create or select a project.
- Enable Gmail API.
- Enable Google Calendar API.
- Configure the OAuth consent screen.
- Add yourself as a test user.
- Create an OAuth Client ID for a Web application.

You will add the hosted redirect URI after Vercel gives you a URL.

### 4. Deploy To Vercel

In Vercel:

- Import the repository.
- Framework preset: Next.js.
- Build command: `npm run build`.
- Output directory: leave default.

Add these environment variables:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.example
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://your-domain.example/api/auth/google/callback
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Use your Vercel production URL or custom domain for `NEXT_PUBLIC_APP_URL`.

### 5. Finish The Google Redirect

In Google Cloud, add the hosted callback URL as an authorized redirect URI:

```text
https://your-domain.example/api/auth/google/callback
```

Then update `GOOGLE_REDIRECT_URI` in Vercel to that exact value if needed.

### 6. Open On Mobile

Open the hosted URL on your phone. Once it is over HTTPS, the PWA manifest and service worker make it installable.

## Mobile Access

The app includes:

- A responsive layout for phone and tablet browsers
- A web app manifest
- A lightweight service worker
- Installable mobile web app behavior over HTTPS

For iPhone, open the hosted site in Safari and choose Share > Add to Home Screen.

For Android, open the hosted site in Chrome and choose Install app or Add to Home screen.

## Important Google OAuth Notes

For localhost, use:

```text
http://127.0.0.1:3000/api/auth/google/callback
```

For hosted beta, use:

```text
https://your-domain.example/api/auth/google/callback
```

Do not mix `localhost`, `127.0.0.1`, and hosted URLs inside the same OAuth flow.

## What Still Needs Implementation For Real Inbox Use

- Persist Google refresh tokens securely in Supabase.
- Encrypt tokens before storage.
- Run live Gmail and Calendar sync jobs.
- Add a hosted auth/session model so only you can access your beta.
- Add background sync and failure/re-auth handling.
