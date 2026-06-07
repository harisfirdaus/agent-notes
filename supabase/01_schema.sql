-- AgentNotes MVP schema only.
-- Run this first in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

create or replace function public.slugify(value text)
returns text
language sql
immutable
as $fn$
  select trim(both '-' from regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', '-', 'g'));
$fn$;

create or replace function public.set_space_slug()
returns trigger
language plpgsql
as $fn$
begin
  if new.slug is null or trim(new.slug) = '' then
    new.slug = public.slugify(new.name);
  else
    new.slug = public.slugify(new.slug);
  end if;

  return new;
end;
$fn$;

create or replace function public.set_tag_slug()
returns trigger
language plpgsql
as $fn$
begin
  if new.slug is null or trim(new.slug) = '' then
    new.slug = public.slugify(new.name);
  else
    new.slug = public.slugify(new.slug);
  end if;

  return new;
end;
$fn$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, slug)
);

create table if not exists public.agent_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  permissions jsonb not null,
  scope jsonb,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(key_hash)
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid references public.spaces(id) on delete set null,
  type text not null default 'capture' check (type in ('capture', 'note')),
  title text,
  content text not null default '',
  content_format text not null default 'plain' check (content_format in ('plain', 'markdown')),
  status text not null default 'inbox' check (status in ('inbox', 'active', 'archived', 'deleted')),
  created_by text not null default 'user' check (created_by in ('user', 'agent')),
  updated_by text not null default 'user' check (updated_by in ('user', 'agent')),
  created_by_agent_key_id uuid,
  updated_by_agent_key_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint notes_note_requires_title check (
    type <> 'note' or nullif(trim(coalesce(title, '')), '') is not null
  )
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, slug)
);

create table if not exists public.note_tags (
  note_id uuid not null references public.notes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (note_id, tag_id)
);

create table if not exists public.agent_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_key_id uuid references public.agent_keys(id) on delete set null,
  action text not null,
  resource_type text,
  resource_id uuid,
  metadata jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

do $fn$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'notes_created_by_agent_key_id_fkey'
  ) then
    alter table public.notes
    add constraint notes_created_by_agent_key_id_fkey
    foreign key (created_by_agent_key_id)
    references public.agent_keys(id)
    on delete set null;
  end if;
end;
$fn$;

do $fn$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'notes_updated_by_agent_key_id_fkey'
  ) then
    alter table public.notes
    add constraint notes_updated_by_agent_key_id_fkey
    foreign key (updated_by_agent_key_id)
    references public.agent_keys(id)
    on delete set null;
  end if;
end;
$fn$;

create index if not exists spaces_user_id_idx on public.spaces(user_id);
create index if not exists spaces_user_slug_idx on public.spaces(user_id, slug);
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_user_status_type_idx on public.notes(user_id, status, type);
create index if not exists notes_user_space_idx on public.notes(user_id, space_id);
create index if not exists notes_updated_at_idx on public.notes(updated_at desc);
create index if not exists notes_title_idx on public.notes(user_id, title);
create index if not exists tags_user_id_idx on public.tags(user_id);
create index if not exists tags_user_slug_idx on public.tags(user_id, slug);
create index if not exists note_tags_tag_id_idx on public.note_tags(tag_id);
create index if not exists agent_keys_user_id_idx on public.agent_keys(user_id);
create index if not exists agent_keys_prefix_idx on public.agent_keys(key_prefix);
create index if not exists agent_activity_logs_user_created_idx on public.agent_activity_logs(user_id, created_at desc);
create index if not exists agent_activity_logs_agent_key_idx on public.agent_activity_logs(agent_key_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists spaces_set_updated_at on public.spaces;
create trigger spaces_set_updated_at
before update on public.spaces
for each row execute function public.set_updated_at();

drop trigger if exists spaces_set_slug on public.spaces;
create trigger spaces_set_slug
before insert or update on public.spaces
for each row execute function public.set_space_slug();

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

drop trigger if exists tags_set_updated_at on public.tags;
create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists tags_set_slug on public.tags;
create trigger tags_set_slug
before insert or update on public.tags
for each row execute function public.set_tag_slug();

drop trigger if exists agent_keys_set_updated_at on public.agent_keys;
create trigger agent_keys_set_updated_at
before update on public.agent_keys
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(public.profiles.display_name, excluded.display_name),
      updated_at = now();

  return new;
end;
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

select 'schema_created' as result;
