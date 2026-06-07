-- AgentNotes development reset.
-- Use only while the project has no real data yet.
-- Run this before 01_schema.sql if earlier partial schema attempts created broken tables.

drop table if exists public.agent_activity_logs cascade;
drop table if exists public.note_tags cascade;
drop table if exists public.notes cascade;
drop table if exists public.tags cascade;
drop table if exists public.spaces cascade;
drop table if exists public.agent_keys cascade;
drop table if exists public.profiles cascade;

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_tag_slug() cascade;
drop function if exists public.set_space_slug() cascade;
drop function if exists public.slugify(text) cascade;
drop function if exists public.set_updated_at() cascade;

select 'agentnotes_dev_schema_reset' as result;
