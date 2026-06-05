# Production Hardening TODOs

- Encrypt OAuth access and refresh tokens before writing `connected_accounts.oauth_*_encrypted`.
- Add a token refresh job and mark accounts `needs_reauth` when refresh fails.
- Persist Google OAuth callback results to Supabase through the service-role client.
- Add incremental Gmail sync with `historyId` checkpoints and backfill pagination.
- Add incremental Calendar sync with sync tokens and deleted-event handling.
- Replace demo Slack status with OAuth, channel selection, and event ingestion.
- Move AI prompts into versioned templates and store prompt/model metadata on every insight.
- Add privacy controls for which snippets are eligible for OpenAI processing.
- Add Supabase Edge Functions or scheduled jobs for background sync and morning briefing generation.
- Add rate limiting, audit logs, and integration health alerts.
- Expand tests around provider mapping, RLS assumptions, and AI JSON validation.
