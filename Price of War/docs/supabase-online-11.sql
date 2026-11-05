-- Price of War: economia (parte 11): limite diário e primeira vitória do dia. Rode DEPOIS dos outros (Supabase -> SQL Editor -> New query -> Run). Pode rodar de novo.
-- Uma linha por jogador por dia (horário de Brasília): quantas coroas já vieram da IA hoje e se o bônus da primeira vitória do dia já foi pago. Só o servidor do jogo lê e escreve.
create table if not exists public.daily (
  user_id    uuid not null references auth.users(id) on delete cascade,
  day        date not null,
  bot_coroas int  not null default 0,
  first_win  boolean not null default false,
  primary key (user_id, day)
);
alter table public.daily enable row level security;
revoke all on public.daily from anon, authenticated;
