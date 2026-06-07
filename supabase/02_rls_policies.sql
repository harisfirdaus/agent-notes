-- AgentNotes MVP RLS policies.
-- Run this after 01_schema.sql.

alter table public.profiles enable row level security;
alter table public.spaces enable row level security;
alter table public.notes enable row level security;
alter table public.tags enable row level security;
alter table public.note_tags enable row level security;
alter table public.agent_keys enable row level security;
alter table public.agent_activity_logs enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select to authenticated using (id = auth.uid());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Users can read own spaces" on public.spaces;
create policy "Users can read own spaces" on public.spaces
for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can create own spaces" on public.spaces;
create policy "Users can create own spaces" on public.spaces
for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Users can update own spaces" on public.spaces;
create policy "Users can update own spaces" on public.spaces
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can delete own empty spaces" on public.spaces;
create policy "Users can delete own empty spaces" on public.spaces
for delete to authenticated using (
  user_id = auth.uid()
  and not exists (
    select 1 from public.notes
    where notes.space_id = spaces.id
      and notes.status <> 'deleted'
  )
);

drop policy if exists "Users can read own notes" on public.notes;
create policy "Users can read own notes" on public.notes
for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can create own notes" on public.notes;
create policy "Users can create own notes" on public.notes
for insert to authenticated with check (
  user_id = auth.uid()
  and created_by = 'user'
  and updated_by = 'user'
);

drop policy if exists "Users can update own notes" on public.notes;
create policy "Users can update own notes" on public.notes
for update to authenticated using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and updated_by = 'user'
);

drop policy if exists "Users can delete own notes" on public.notes;
create policy "Users can delete own notes" on public.notes
for delete to authenticated using (user_id = auth.uid());

drop policy if exists "Users can read own tags" on public.tags;
create policy "Users can read own tags" on public.tags
for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can create own tags" on public.tags;
create policy "Users can create own tags" on public.tags
for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Users can update own tags" on public.tags;
create policy "Users can update own tags" on public.tags
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can delete own tags" on public.tags;
create policy "Users can delete own tags" on public.tags
for delete to authenticated using (user_id = auth.uid());

drop policy if exists "Users can read own note tags" on public.note_tags;
create policy "Users can read own note tags" on public.note_tags
for select to authenticated using (
  exists (
    select 1 from public.notes
    where notes.id = note_tags.note_id
      and notes.user_id = auth.uid()
  )
);

drop policy if exists "Users can create own note tags" on public.note_tags;
create policy "Users can create own note tags" on public.note_tags
for insert to authenticated with check (
  exists (
    select 1 from public.notes
    where notes.id = note_tags.note_id
      and notes.user_id = auth.uid()
  )
  and exists (
    select 1 from public.tags
    where tags.id = note_tags.tag_id
      and tags.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own note tags" on public.note_tags;
create policy "Users can delete own note tags" on public.note_tags
for delete to authenticated using (
  exists (
    select 1 from public.notes
    where notes.id = note_tags.note_id
      and notes.user_id = auth.uid()
  )
);

drop policy if exists "Users can read own agent keys" on public.agent_keys;
create policy "Users can read own agent keys" on public.agent_keys
for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can create own agent keys" on public.agent_keys;
create policy "Users can create own agent keys" on public.agent_keys
for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Users can update own agent keys" on public.agent_keys;
create policy "Users can update own agent keys" on public.agent_keys
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can read own activity logs" on public.agent_activity_logs;
create policy "Users can read own activity logs" on public.agent_activity_logs
for select to authenticated using (user_id = auth.uid());

select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'profiles',
    'spaces',
    'notes',
    'tags',
    'note_tags',
    'agent_keys',
    'agent_activity_logs'
  )
order by table_name;
