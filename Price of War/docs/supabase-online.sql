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
