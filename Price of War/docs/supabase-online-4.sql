-- Price of War: online matches, part 4 (ranked ladder: points, leagues, hidden Elo).
-- Run AFTER docs/supabase-online-3.sql (Supabase -> SQL Editor -> New query -> Run). Safe to run more than once.
-- Only the game server (service role) reads or writes these; players never touch them directly.

-- the ranked queue never mixes with the casual one
alter table public.queue   add column if not exists ranked boolean not null default false;
alter table public.matches add column if not exists ranked boolean not null default false;
alter table public.matches add column if not exists ranked_done boolean not null default false;   -- the ladder points of this match were applied

-- one ladder row per player (season resets come later)
create table if not exists public.ranked_profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  season     int  not null default 1,
  points     int  not null default 0,        -- shown: 100 per division, 400 per league
  mmr        int  not null default 1000,     -- hidden Elo
  games      int  not null default 0,
  wins       int  not null default 0,
  losses     int  not null default 0,
  shield     boolean not null default false, -- the next loss costs nothing (right after climbing a league)
  peak       int  not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists ranked_profiles_points_idx on public.ranked_profiles (points desc);
alter table public.ranked_profiles enable row level security;
revoke all on public.ranked_profiles from anon, authenticated;

-- the queue takes only waiting players of the same kind (ranked with ranked, casual with casual)
drop function if exists public.queue_take(uuid);
create or replace function public.queue_take(p_me uuid, p_ranked boolean default false)
returns setof public.queue
language sql
security definer
set search_path = public
as $$
  delete from public.queue
  where user_id = (
    select user_id from public.queue
    where user_id <> p_me and ranked = p_ranked
    order by created_at
    limit 1
    for update skip locked
  )
  returning *;
$$;
revoke all on function public.queue_take(uuid, boolean) from public, anon, authenticated;

-- applies the ladder result of one match, exactly once
create or replace function public.apply_ranked_result(p_match uuid, p_rows jsonb)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  done boolean := false;
  r jsonb;
begin
  update public.matches set ranked_done = true where id = p_match and ranked_done = false returning true into done;
  if not coalesce(done, false) then return false; end if;
  for r in select * from jsonb_array_elements(p_rows) loop
    insert into public.ranked_profiles (user_id, points, mmr, games, wins, losses, shield, peak, updated_at)
    values ((r->>'user_id')::uuid, (r->'profile'->>'points')::int, (r->'profile'->>'mmr')::int, (r->'profile'->>'games')::int,
            (r->'profile'->>'wins')::int, (r->'profile'->>'losses')::int, (r->'profile'->>'shield')::boolean, (r->'profile'->>'peak')::int, now())
    on conflict (user_id) do update set
      points = excluded.points, mmr = excluded.mmr, games = excluded.games, wins = excluded.wins,
      losses = excluded.losses, shield = excluded.shield, peak = excluded.peak, updated_at = now();
  end loop;
  return true;
end;
$$;
revoke all on function public.apply_ranked_result(uuid, jsonb) from public, anon, authenticated;
