-- Price of War: fechar a escrita da coleção (parte 14). Rode DEPOIS da parte 13 E DEPOIS de republicar a função `game` (Edge Function).
-- Daqui em diante só o servidor do jogo escreve na tabela `collection` (boosters, coleção inicial). O aparelho só lê a própria coleção.
-- Pode rodar de novo.
revoke insert, update, delete on public.collection from anon, authenticated;
grant select on public.collection to authenticated;

-- Completa a coleção até as quantidades pedidas (nunca diminui). Só o servidor chama.
create or replace function public.ensure_collection(p_user uuid, p_cards jsonb) returns void
language sql security definer set search_path = public as $$
  insert into public.collection (user_id, card_name, copies)
    select p_user, e.key, e.value::int from jsonb_each_text(p_cards) e
    on conflict (user_id, card_name) do update set copies = greatest(public.collection.copies, excluded.copies);
$$;
revoke all on function public.ensure_collection(uuid, jsonb) from public, anon, authenticated;
