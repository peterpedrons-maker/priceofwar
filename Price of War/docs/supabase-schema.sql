-- Price of War: accounts, collection and decks.
-- Safe to run more than once. Paste it in Supabase -> SQL Editor -> New query -> Run.

-- ============ profiles ============
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null,
  avatar_id   text not null default 'batedora',
  level       int  not null default 1,
  xp          int  not null default 0,
  coroas      int  not null default 150,
  created_at  timestamptz not null default now(),
  constraint username_format check (
    username ~ '^[[:alnum:] _.-]{3,16}$'
    and username = btrim(username)
    and username !~ '  '
  )
);
-- one name per player, ignoring upper/lower case
create unique index if not exists profiles_username_key on public.profiles (lower(username));

alter table public.profiles enable row level security;
drop policy if exists "profiles: read own"   on public.profiles;
drop policy if exists "profiles: create own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: read own"   on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles: create own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- The app may only write the name and the avatar. Level, XP and Coroas are changed later by
-- server-side functions, so nobody can give themselves Coroas from the browser console.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (id, username, avatar_id) on public.profiles to authenticated;
grant update (username, avatar_id)     on public.profiles to authenticated;

-- "Is this name free?" without letting players read each other's rows.
create or replace function public.username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(btrim(name)));
$$;
revoke all on function public.username_available(text) from public, anon;
grant execute on function public.username_available(text) to authenticated;

-- ============ collection (cards owned) ============
-- TEST PHASE: the app writes here directly, because boosters are free and opened on the device.
-- When real purchases exist, remove the insert/update/delete policies below and let a
-- security-definer function add the cards.
create table if not exists public.collection (
  user_id    uuid not null references auth.users(id) on delete cascade,
  card_name  text not null,
  copies     int  not null check (copies > 0 and copies <= 999),
  updated_at timestamptz not null default now(),
  primary key (user_id, card_name)
);
alter table public.collection enable row level security;
drop policy if exists "collection: read own"   on public.collection;
drop policy if exists "collection: insert own" on public.collection;
drop policy if exists "collection: update own" on public.collection;
drop policy if exists "collection: delete own" on public.collection;
create policy "collection: read own"   on public.collection for select to authenticated using (auth.uid() = user_id);
create policy "collection: insert own" on public.collection for insert to authenticated with check (auth.uid() = user_id);
create policy "collection: update own" on public.collection for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "collection: delete own" on public.collection for delete to authenticated using (auth.uid() = user_id);
revoke all on public.collection from anon;

-- ============ decks (2 saved slots) ============
create table if not exists public.decks (
  user_id    uuid not null references auth.users(id) on delete cascade,
  slot       smallint not null check (slot between 1 and 2),
  name       text not null default '',
  general    text not null,
  cards      jsonb not null default '{}'::jsonb,   -- { "card name": copies }
  updated_at timestamptz not null default now(),
  primary key (user_id, slot)
);
alter table public.decks enable row level security;
drop policy if exists "decks: read own"   on public.decks;
drop policy if exists "decks: insert own" on public.decks;
drop policy if exists "decks: update own" on public.decks;
drop policy if exists "decks: delete own" on public.decks;
create policy "decks: read own"   on public.decks for select to authenticated using (auth.uid() = user_id);
create policy "decks: insert own" on public.decks for insert to authenticated with check (auth.uid() = user_id);
create policy "decks: update own" on public.decks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "decks: delete own" on public.decks for delete to authenticated using (auth.uid() = user_id);
revoke all on public.decks from anon;

-- keep updated_at honest
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists collection_touch on public.collection;
create trigger collection_touch before update on public.collection for each row execute function public.touch_updated_at();
drop trigger if exists decks_touch on public.decks;
create trigger decks_touch before update on public.decks for each row execute function public.touch_updated_at();
