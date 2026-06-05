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
