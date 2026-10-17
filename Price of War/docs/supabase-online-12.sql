-- Price of War: missões (parte 12). Rode DEPOIS dos outros (Supabase -> SQL Editor -> New query -> Run). Pode rodar de novo.
-- Uma linha por jogador por período (`d:AAAA-MM-DD` dia, `w:AAAA-MM-DD` semana a partir da segunda, `s:N` temporada) com as missões sorteadas e o progresso em JSON.
-- `version` impede pagar duas vezes: toda escrita só vale se a versão ainda é a lida. Só o servidor do jogo lê e escreve.
create table if not exists public.missions (
  user_id uuid not null references auth.users(id) on delete cascade,
  key     text not null,
  data    jsonb not null,
  version int  not null default 1,
  primary key (user_id, key)
);
alter table public.missions enable row level security;
revoke all on public.missions from anon, authenticated;

-- Soma coroas ao saldo de forma atômica e devolve o novo saldo.
create or replace function public.grant_coroas(p_user uuid, p_amount int) returns int
language sql security definer set search_path = public as $$
  update public.profiles set coroas = coroas + p_amount where id = p_user returning coroas;
$$;
revoke all on function public.grant_coroas(uuid, int) from public, anon, authenticated;
