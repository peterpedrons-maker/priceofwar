-- Price of War: online matches, part 5 (ranked seasons: season number, portrait frame, end-of-season rewards).
-- Run AFTER docs/supabase-online-4.sql (Supabase -> SQL Editor -> New query -> Run). Safe to run more than once.
-- Only the game server (service role) reads or writes these; players never touch them directly.

alter table public.ranked_profiles add column if not exists frame text;   -- league key of the portrait frame won in an earlier season

-- one row per player per finished season: the highest league reached and the Coroas it pays
create table if not exists public.ranked_seasons (
  user_id    uuid not null references auth.users(id) on delete cascade,
  season     int  not null,
  peak       int  not null,
  league     text not null,
  coroas     int  not null,
  claimed    boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, season)
);
alter table public.ranked_seasons enable row level security;
revoke all on public.ranked_seasons from anon, authenticated;
create index if not exists ranked_profiles_season_points_idx on public.ranked_profiles (season, points desc);

-- the ladder result of a match now also carries the season and the frame
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
    insert into public.ranked_profiles (user_id, season, points, mmr, games, wins, losses, shield, peak, frame, updated_at)
    values ((r->>'user_id')::uuid, coalesce((r->'profile'->>'season')::int, 1), (r->'profile'->>'points')::int, (r->'profile'->>'mmr')::int, (r->'profile'->>'games')::int,
            (r->'profile'->>'wins')::int, (r->'profile'->>'losses')::int, (r->'profile'->>'shield')::boolean, (r->'profile'->>'peak')::int, r->'profile'->>'frame', now())
    on conflict (user_id) do update set
      season = excluded.season, points = excluded.points, mmr = excluded.mmr, games = excluded.games, wins = excluded.wins,
      losses = excluded.losses, shield = excluded.shield, peak = excluded.peak, frame = excluded.frame, updated_at = now();
  end loop;
  return true;
end;
$$;
revoke all on function public.apply_ranked_result(uuid, jsonb) from public, anon, authenticated;

-- closes a season for one player, exactly once: records the result and swaps the ladder row for the reset one
create or replace function public.close_ranked_season(p_user uuid, p_season int, p_peak int, p_league text, p_coroas int, p_next jsonb)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  update public.ranked_profiles set
    season = (p_next->>'season')::int, points = (p_next->>'points')::int, mmr = (p_next->>'mmr')::int, games = 0, wins = 0, losses = 0,
    shield = false, peak = (p_next->>'peak')::int, frame = p_next->>'frame', updated_at = now()
  where user_id = p_user and season = p_season;
  get diagnostics n = row_count;
  if n = 0 then return false; end if;
  insert into public.ranked_seasons (user_id, season, peak, league, coroas) values (p_user, p_season, p_peak, p_league, p_coroas)
  on conflict (user_id, season) do nothing;
  return true;
end;
$$;
revoke all on function public.close_ranked_season(uuid, int, int, text, int, jsonb) from public, anon, authenticated;

-- pays a closed season's Coroas, exactly once
create or replace function public.claim_ranked_season(p_user uuid, p_season int)
returns table (paid_coroas int, balance int)
language plpgsql
security definer
set search_path = public
as $$
declare
  paid int;
  bal int;
begin
  update public.ranked_seasons s set claimed = true where s.user_id = p_user and s.season = p_season and s.claimed = false returning s.coroas into paid;
  if paid is null then return; end if;
  update public.profiles p set coroas = p.coroas + paid where p.id = p_user returning p.coroas into bal;
  paid_coroas := paid;
  balance := bal;
  return next;
end;
$$;
revoke all on function public.claim_ranked_season(uuid, int) from public, anon, authenticated;
