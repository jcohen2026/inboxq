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
