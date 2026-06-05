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
