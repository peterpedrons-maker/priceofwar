-- Price of War: "Reportar um problema" (parte 10). Rode DEPOIS dos outros (Supabase -> SQL Editor -> New query -> Run). Pode rodar de novo.
-- Os avisos que os jogadores mandam de dentro do jogo (bug, algo confuso, ideia), com a tela, a partida e os erros recentes. Só o servidor do jogo lê e escreve; o painel GM mostra.
create table if not exists public.feedback (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null check (kind in ('bug', 'confuso', 'ideia', 'outro')),
  text       text not null,
  match_id   uuid,
  ctx        text not null default '',
  done       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists feedback_open_idx on public.feedback (done, created_at desc);
create index if not exists feedback_user_idx on public.feedback (user_id, created_at desc);
alter table public.feedback enable row level security;
revoke all on public.feedback from anon, authenticated;
