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
