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
