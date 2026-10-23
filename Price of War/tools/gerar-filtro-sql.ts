// Gera docs/supabase-online-8.sql: o filtro de nomes (a MESMA lista de src/nameFilter.ts) como função e gatilho no banco, mais as tabelas de denúncia e banimento.
// Uso: npx tsx tools/gerar-filtro-sql.ts   (rode de novo se a lista de src/nameFilter.ts mudar e faça commit do SQL)
import { writeFileSync } from 'node:fs';
import { BAD_SUBSTR, BAD_WORD_START, BAD_WORD_EXACT } from '../src/nameFilter';

const arr = (a: string[]) => `array[${a.map(x => `'${x.replace(/'/g, "''")}'`).join(', ')}]`;
const sql = `-- Price of War: filtro de nomes, denúncias e banimento (parte 8). Rode DEPOIS dos outros (Supabase -> SQL Editor -> New query -> Run). Pode rodar de novo.
-- GERADO por tools/gerar-filtro-sql.ts a partir de src/nameFilter.ts: não edite à mão (mude a lista lá e gere de novo).

-- ============ 1. Filtro de nomes ofensivos (valendo também para quem escreve direto na API) ============
-- Normaliza como quem tenta enganar escreve: sem acento, "leet" (4=a, 3=e, 1=i, 0=o, 5=s, 7=t, @=a, $=s), sem separadores e sem letras repetidas.
create or replace function public.name_clean_word(t text) returns text language sql immutable as $$
  select regexp_replace(
    regexp_replace(
      translate(translate(lower(t), 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn'), '0134578@$!', 'oieastbasi'),
      '[^a-z]', '', 'g'),
    '(.)\\1+', '\\1', 'g')
$$;

create or replace function public.name_is_clean(p_name text) returns boolean language plpgsql immutable as $$
declare
  subs  text[] := ${arr(BAD_SUBSTR)};
  starts text[] := ${arr(BAD_WORD_START)};
  exacts text[] := ${arr(BAD_WORD_EXACT)};
  words text[] := '{}'; w text; allw text; b text; c text;
begin
  foreach w in array regexp_split_to_array(lower(coalesce(p_name, '')), '[[:space:]_.-]+') loop
    c := public.name_clean_word(w);
    if c <> '' then words := words || c; end if;
  end loop;
  allw := array_to_string(words, '');
  -- letters spelled one by one ("p.u.t.a", "c u") count as a single word
  if array_length(words, 1) > 1 and not exists (select 1 from unnest(words) x where length(x) > 1) then words := array[allw]; end if;
  foreach b in array subs loop
    if position(public.name_clean_word(b) in allw) > 0 then return false; end if;
  end loop;
  foreach w in array words loop
    foreach b in array starts loop
      if left(w, length(public.name_clean_word(b))) = public.name_clean_word(b) then return false; end if;
    end loop;
    foreach b in array exacts loop
      if w = public.name_clean_word(b) then return false; end if;
    end loop;
  end loop;
  return true;
end $$;

create or replace function public.profiles_name_guard() returns trigger language plpgsql as $$
begin
  if not public.name_is_clean(new.username) then
    raise exception 'name_not_allowed' using errcode = 'check_violation';
  end if;
  return new;
end $$;
drop trigger if exists profiles_name_guard on public.profiles;
create trigger profiles_name_guard before insert or update of username on public.profiles for each row execute function public.profiles_name_guard();

-- ============ 2. Banimentos (o servidor do jogo consulta; só ele lê e escreve) ============
create table if not exists public.bans (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  reason    text not null default '',
  banned_at timestamptz not null default now()
);
alter table public.bans enable row level security;
revoke all on public.bans from anon, authenticated;

-- ============ 3. Denúncias (um jogador denuncia o adversário de uma partida em que esteve) ============
create table if not exists public.reports (
  id         bigint generated always as identity primary key,
  reporter   uuid not null references auth.users(id) on delete cascade,
  reported   uuid not null references auth.users(id) on delete cascade,
  match_id   uuid,
  reason     text not null check (reason in ('nome', 'comportamento', 'trapaca', 'outro')),
  note       text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists reports_reported_idx on public.reports (reported, created_at desc);
create index if not exists reports_reporter_idx on public.reports (reporter, created_at desc);
create unique index if not exists reports_once_per_match on public.reports (reporter, match_id) where match_id is not null;
alter table public.reports enable row level security;
revoke all on public.reports from anon, authenticated;
`;
writeFileSync(new URL('../docs/supabase-online-8.sql', import.meta.url), sql);
console.log('ok', sql.length, 'bytes');
