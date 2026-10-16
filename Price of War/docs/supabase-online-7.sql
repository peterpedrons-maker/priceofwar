-- Price of War: GM / fluxo de jogadores (parte 7). Rode DEPOIS dos outros (Supabase -> SQL Editor -> New query -> Run). Pode rodar de novo.
-- Uma linha por jogador por dia em que ele abriu o jogo (o app avisa a cada ~90 s enquanto está aberto). Só o servidor do jogo lê e escreve.
-- Serve para o gráfico "jogadores ativos por dia" do painel GM. O dia é contado no horário de Brasília.
create table if not exists public.presence_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  primary key (user_id, day)
);
create index if not exists presence_days_day_idx on public.presence_days (day);
alter table public.presence_days enable row level security;
revoke all on public.presence_days from anon, authenticated;
