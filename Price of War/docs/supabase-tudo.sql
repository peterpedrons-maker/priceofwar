-- Price of War: TODOS os SQLs de uma vez (contas, coleção, decks, partidas online, frases e emojis, 3º deck na nuvem).
-- Cole tudo em Supabase -> SQL Editor -> New query -> Run. Pode rodar quantas vezes quiser: cada parte só cria o que falta.
-- Equivale a rodar, nesta ordem: supabase-schema.sql, supabase-online.sql, supabase-online-2.sql, supabase-online-3.sql, supabase-slot-3.sql.

-- ################ supabase-schema.sql ################
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

-- ################ supabase-online.sql ################
-- Price of War: online matches. Run AFTER docs/supabase-schema.sql (Supabase -> SQL Editor -> New query -> Run).
-- Safe to run more than once.
--
-- The game server (the `game` Edge Function) is the only thing that writes here. Players can read the list of
-- actions of the matches they sit in (match_steps) — never the stored full state.

-- ============ matchmaking queue (server only) ============
create table if not exists public.queue (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  deck       jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.queue enable row level security;
revoke all on public.queue from anon, authenticated;

-- Takes (and removes) the oldest waiting player other than p_me, safely even when two players queue at once.
create or replace function public.queue_take(p_me uuid)
returns setof public.queue
language sql
security definer
set search_path = public
as $$
  delete from public.queue
  where user_id = (
    select user_id from public.queue
    where user_id <> p_me
    order by created_at
    limit 1
    for update skip locked
  )
  returning *;
$$;
revoke all on function public.queue_take(uuid) from public, anon, authenticated;

-- ============ matches ============
create table if not exists public.matches (
  id          uuid primary key default gen_random_uuid(),
  seed        int  not null,
  status      text not null default 'active' check (status in ('active', 'finished')),
  first       smallint not null check (first in (0, 1)),
  seat0       uuid references auth.users(id) on delete set null,
  seat1       uuid references auth.users(id) on delete set null,
  bot_seat    smallint check (bot_seat in (0, 1)),
  decks       jsonb not null,
  state       jsonb not null,            -- the full game state: server only
  steps_count int  not null default 0,
  winner      smallint check (winner in (0, 1)),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists matches_seat0_idx on public.matches (seat0) where status = 'active';
create index if not exists matches_seat1_idx on public.matches (seat1) where status = 'active';
alter table public.matches enable row level security;
drop policy if exists "matches: read mine" on public.matches;
create policy "matches: read mine" on public.matches for select to authenticated using (auth.uid() = seat0 or auth.uid() = seat1);
revoke all on public.matches from anon, authenticated;
grant select (id, seed, status, first, seat0, seat1, bot_seat, decks, steps_count, winner, created_at) on public.matches to authenticated;

drop trigger if exists matches_touch on public.matches;
create trigger matches_touch before update on public.matches for each row execute function public.touch_updated_at();

-- ============ match_steps: every action, in order ============
create table if not exists public.match_steps (
  match_id   uuid not null references public.matches(id) on delete cascade,
  n          int  not null,
  seat       smallint not null check (seat in (0, 1)),
  action     jsonb not null,
  created_at timestamptz not null default now(),
  primary key (match_id, n)
);
alter table public.match_steps enable row level security;
drop policy if exists "match_steps: read mine" on public.match_steps;
create policy "match_steps: read mine" on public.match_steps for select to authenticated
  using (exists (select 1 from public.matches m where m.id = match_id and (m.seat0 = auth.uid() or m.seat1 = auth.uid())));
revoke all on public.match_steps from anon, authenticated;
grant select on public.match_steps to authenticated;

-- ################ supabase-online-2.sql ################
-- Price of War: online matches, part 2 (hidden hands, turn clock, rewards).
-- Run AFTER docs/supabase-online.sql (Supabase -> SQL Editor -> New query -> Run). Safe to run more than once.

-- Matches played with the first version have no per-player views: close them.
-- (só na primeira vez, quando ainda não existe match_views; nas seguintes não encerra partidas em andamento)
do $$ begin
  if to_regclass('public.match_views') is null then
    update public.matches set status = 'finished' where status = 'active';
  end if;
end $$;

-- ============ matches: turn clock, how it ended, rewards paid ============
alter table public.matches add column if not exists turn_deadline bigint;                         -- epoch ms
alter table public.matches add column if not exists timeouts jsonb not null default '[0,0]'::jsonb; -- consecutive timeouts per chair
alter table public.matches add column if not exists end_reason text check (end_reason in ('general', 'concede', 'timeout'));
alter table public.matches add column if not exists rewards jsonb;                                -- null until paid

-- Players no longer read matches or match_steps at all (they hold the seed and both decks): only the game server does.
drop policy if exists "matches: read mine" on public.matches;
revoke all on public.matches from anon, authenticated;
drop policy if exists "match_steps: read mine" on public.match_steps;
revoke all on public.match_steps from anon, authenticated;

-- ============ match_views: what each player is allowed to see of each step ============
create table if not exists public.match_views (
  match_id    uuid not null references public.matches(id) on delete cascade,
  viewer      smallint not null check (viewer in (0, 1)),
  n           int  not null,
  viewer_user uuid not null references auth.users(id) on delete cascade,
  actor       smallint not null check (actor in (0, 1)),   -- 0 = the viewer acted, 1 = the opponent
  action      jsonb not null,
  events      jsonb not null,
  state       jsonb not null,                              -- the match as this player sees it (no opponent hand, no deck order)
  deadline    bigint,
  created_at  timestamptz not null default now(),
  primary key (match_id, viewer, n)
);
create index if not exists match_views_user_idx on public.match_views (viewer_user, match_id, n);
alter table public.match_views enable row level security;
drop policy if exists "match_views: read mine" on public.match_views;
create policy "match_views: read mine" on public.match_views for select to authenticated using (viewer_user = auth.uid());
revoke all on public.match_views from anon, authenticated;
grant select on public.match_views to authenticated;

-- ============ rewards: paid once per match, by the server only ============
create or replace function public.apply_match_rewards(p_match uuid, p_rows jsonb)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  done boolean := false;
  r jsonb;
begin
  update public.matches set rewards = p_rows where id = p_match and rewards is null returning true into done;
  if not coalesce(done, false) then return false; end if;
  for r in select * from jsonb_array_elements(p_rows) loop
    update public.profiles
       set level  = (r->>'level')::int,
           xp     = (r->>'xp_after')::int,
           coroas = (r->>'coroas_after')::int
     where id = (r->>'user_id')::uuid;
  end loop;
  return true;
end;
$$;
revoke all on function public.apply_match_rewards(uuid, jsonb) from public, anon, authenticated;

-- ################ supabase-online-3.sql ################
-- Price of War: online matches, part 3 (quick messages: ready-made phrases and emojis).
-- Run AFTER docs/supabase-online-2.sql (Supabase -> SQL Editor -> New query -> Run). Safe to run more than once.
-- Only the game server (service role) reads or writes this table; players never touch it directly.

create table if not exists public.match_emotes (
  id         bigint generated always as identity primary key,
  match_id   uuid not null references public.matches(id) on delete cascade,
  seat       smallint not null check (seat in (0, 1)),
  code       text not null,                 -- p1..p6 (phrases) or e1..e6 (emojis); the app maps them to text and art
  at         bigint not null                -- epoch ms
);
create index if not exists match_emotes_match_idx on public.match_emotes (match_id, id);
alter table public.match_emotes enable row level security;
revoke all on public.match_emotes from anon, authenticated;

-- ################ supabase-slot-3.sql ################
-- Libera o 3º deck salvo (Mercenários) na nuvem. Rode UMA vez no SQL Editor do Supabase e depois troque CLOUD_DECK_SLOTS para 3 em src/App.tsx
-- (e [1, 2] por [1, 2, 3] em syncDeckStoreWithCloud). Enquanto isso não for feito, o deck 3 fica só no aparelho (o jogo cria sozinho).
alter table public.decks drop constraint if exists decks_slot_check;
alter table public.decks add constraint decks_slot_check check (slot between 1 and 3);
