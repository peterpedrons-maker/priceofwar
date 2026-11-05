-- Price of War: desafio por link / sala privada (parte 9). Rode DEPOIS dos outros (Supabase -> SQL Editor -> New query -> Run). Pode rodar de novo.
-- Uma sala por anfitrião: o código do convite e o deck dele. A sala some quando o amigo entra, quando o anfitrião cancela ou depois de 15 minutos. Só o servidor do jogo lê e escreve.
create table if not exists public.rooms (
  code       text primary key,
  host       uuid not null unique references auth.users(id) on delete cascade,
  deck       jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.rooms enable row level security;
revoke all on public.rooms from anon, authenticated;
