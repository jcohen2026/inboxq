create extension if not exists pgcrypto;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  timezone text not null default 'America/New_York',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider text not null check (provider in ('google', 'slack', 'rss')),
  provider_account_id text not null,
  display_name text not null,
  email text,
  color text not null default '#3868d6',
  scopes text[] not null default '{}',
  status text not null default 'connected' check (status in ('connected', 'needs_reauth', 'stubbed')),
  oauth_access_token_encrypted text,
  oauth_refresh_token_encrypted text,
  oauth_token_expires_at timestamptz,
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  client text,
  health text not null default 'healthy' check (health in ('healthy', 'watch', 'at_risk')),
  status text not null default 'active' check (status in ('planning', 'active', 'paused', 'complete')),
  color text not null default '#3868d6',
  due_date timestamptz,
  ai_suggested_next_action text,
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  primary_email text,
  name text not null,
  role text,
  company text,
  relationship_health text not null default 'steady' check (relationship_health in ('strong', 'steady', 'needs_attention')),
  notes text,
  last_interaction_at timestamptz,
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.person_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  connected_account_id uuid not null references public.connected_accounts(id) on delete cascade,
  provider_person_id text,
  provider_metadata jsonb not null default '{}'
);

create table public.email_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_account_id uuid not null references public.connected_accounts(id) on delete cascade,
  provider_thread_id text not null,
  subject text not null,
  snippet text,
  last_message_at timestamptz,
  unread boolean not null default false,
  important boolean not null default false,
  labels text[] not null default '{}',
  ai_summary text,
  needs_response boolean not null default false,
  waiting_on_me boolean not null default false,
  waiting_on_others boolean not null default false,
  possible_commitment boolean not null default false,
  reply_suggested boolean not null default false,
  follow_up_suggested boolean not null default false,
  related_project_id uuid references public.projects(id) on delete set null,
  related_person_ids uuid[] not null default '{}',
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.email_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  thread_id uuid not null references public.email_threads(id) on delete cascade,
  source_account_id uuid not null references public.connected_accounts(id) on delete cascade,
  provider_message_id text not null,
  from_person_id uuid references public.people(id) on delete set null,
  to_person_ids uuid[] not null default '{}',
  sent_at timestamptz,
  snippet text,
  body_preview text,
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.calendars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_account_id uuid not null references public.connected_accounts(id) on delete cascade,
  provider_calendar_id text not null,
  name text not null,
  color text not null default '#3868d6',
  timezone text not null default 'UTC',
  selected boolean not null default true,
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_account_id uuid not null references public.connected_accounts(id) on delete cascade,
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  provider_event_id text not null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  attendee_person_ids uuid[] not null default '{}',
  status text not null default 'confirmed' check (status in ('confirmed', 'tentative', 'cancelled')),
  related_project_id uuid references public.projects(id) on delete set null,
  description_preview text,
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'waiting', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  source_type text not null default 'manual' check (source_type in ('email', 'calendar', 'slack', 'manual')),
  source_id uuid,
  source_account_id uuid references public.connected_accounts(id) on delete set null,
  related_person_id uuid references public.people(id) on delete set null,
  related_project_id uuid references public.projects(id) on delete set null,
  confidence_score numeric(4, 3) check (confidence_score is null or (confidence_score >= 0 and confidence_score <= 1)),
  created_by_ai boolean not null default false,
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rss_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  url text not null,
  category text,
  enabled boolean not null default true,
  provider_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  type text not null,
  position integer not null,
  enabled boolean not null default true,
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_briefings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  generated_at timestamptz not null default now(),
  greeting text,
  narrative text,
  top_priorities text[] not null default '{}',
  risks text[] not null default '{}',
  opportunities text[] not null default '{}',
  follow_ups text[] not null default '{}',
  deadlines text[] not null default '{}',
  waiting_on_me text[] not null default '{}',
  waiting_on_others text[] not null default '{}',
  schedule_adjustments text[] not null default '{}',
  relationship_recommendations text[] not null default '{}',
  model text,
  prompt_version text,
  source_metadata jsonb not null default '{}'
);

create table public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  source_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  provider_metadata jsonb not null default '{}'
);

create table public.sync_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_account_id uuid references public.connected_accounts(id) on delete set null,
  provider text not null check (provider in ('google', 'slack', 'rss')),
  sync_type text not null,
  status text not null check (status in ('success', 'warning', 'error')),
  started_at timestamptz not null,
  completed_at timestamptz,
  item_count integer not null default 0,
  message text,
  provider_metadata jsonb not null default '{}'
);

create unique index connected_accounts_user_provider_account_unique
  on public.connected_accounts(user_id, provider, provider_account_id);

create unique index person_accounts_person_connected_account_unique
  on public.person_accounts(person_id, connected_account_id);

create unique index email_threads_source_provider_thread_unique
  on public.email_threads(source_account_id, provider_thread_id);

create unique index email_messages_source_provider_message_unique
  on public.email_messages(source_account_id, provider_message_id);

create unique index calendars_source_provider_calendar_unique
  on public.calendars(source_account_id, provider_calendar_id);

create unique index calendar_events_calendar_provider_event_unique
  on public.calendar_events(calendar_id, provider_event_id);

create index email_threads_user_last_message_idx on public.email_threads(user_id, last_message_at desc);
create index email_threads_source_account_idx on public.email_threads(source_account_id);
create index calendar_events_user_starts_idx on public.calendar_events(user_id, starts_at);
create index calendar_events_source_account_idx on public.calendar_events(source_account_id);
create index work_items_user_status_due_idx on public.work_items(user_id, status, due_date);
create index work_items_source_account_idx on public.work_items(source_account_id);
create index ai_insights_user_created_idx on public.ai_insights(user_id, created_at desc);
create index sync_logs_user_started_idx on public.sync_logs(user_id, started_at desc);

alter table public.users enable row level security;
alter table public.connected_accounts enable row level security;
alter table public.projects enable row level security;
alter table public.people enable row level security;
alter table public.person_accounts enable row level security;
alter table public.email_threads enable row level security;
alter table public.email_messages enable row level security;
alter table public.calendars enable row level security;
alter table public.calendar_events enable row level security;
alter table public.work_items enable row level security;
alter table public.rss_sources enable row level security;
alter table public.dashboard_widgets enable row level security;
alter table public.ai_briefings enable row level security;
alter table public.ai_insights enable row level security;
alter table public.sync_logs enable row level security;

create policy users_own_rows on public.users
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy connected_accounts_own_rows on public.connected_accounts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy projects_own_rows on public.projects
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy people_own_rows on public.people
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy person_accounts_own_rows on public.person_accounts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy email_threads_own_rows on public.email_threads
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy email_messages_own_rows on public.email_messages
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy calendars_own_rows on public.calendars
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy calendar_events_own_rows on public.calendar_events
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy work_items_own_rows on public.work_items
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy rss_sources_own_rows on public.rss_sources
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy dashboard_widgets_own_rows on public.dashboard_widgets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy ai_briefings_own_rows on public.ai_briefings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy ai_insights_own_rows on public.ai_insights
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy sync_logs_own_rows on public.sync_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
