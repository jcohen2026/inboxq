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
