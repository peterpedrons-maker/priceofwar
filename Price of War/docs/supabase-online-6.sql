-- Price of War: GM / online agora (parte 6). Rode DEPOIS dos outros (Supabase -> SQL Editor -> New query -> Run). Pode rodar de novo.
-- Uma linha por jogador com a hora em que ele foi visto pela última vez (o app avisa a cada ~90 s enquanto está aberto). Só o servidor do jogo lê e escreve.
create table if not exists public.presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  seen_at timestamptz not null default now()
);
create index if not exists presence_seen_idx on public.presence (seen_at desc);
alter table public.presence enable row level security;
revoke all on public.presence from anon, authenticated;
