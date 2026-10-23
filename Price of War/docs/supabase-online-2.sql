-- Price of War: online matches, part 2 (hidden hands, turn clock, rewards).
-- Run AFTER docs/supabase-online.sql (Supabase -> SQL Editor -> New query -> Run). Safe to run more than once.

-- Matches played with the first version have no per-player views: close them.
update public.matches set status = 'finished' where status = 'active';

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
