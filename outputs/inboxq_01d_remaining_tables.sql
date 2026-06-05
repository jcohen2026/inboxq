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
