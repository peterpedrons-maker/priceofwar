-- Price of War: abrir booster no servidor (parte 13). Rode DEPOIS dos outros (Supabase -> SQL Editor -> New query -> Run). Pode rodar de novo.
-- Debita o preço, devolve as coroas das repetidas e soma as cartas à coleção, tudo ou nada, numa única chamada.
-- Devolve o novo saldo, ou -1 se faltam coroas. Só o servidor do jogo chama (a chave de serviço); o aparelho não.
create or replace function public.open_booster(p_user uuid, p_price int, p_refund int, p_adds jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare v_coroas int;
begin
  update public.profiles set coroas = coroas - p_price + p_refund
    where id = p_user and coroas >= p_price returning coroas into v_coroas;
  if not found then return -1; end if;
  insert into public.collection (user_id, card_name, copies)
    select p_user, e.key, e.value::int from jsonb_each_text(p_adds) e
    on conflict (user_id, card_name) do update set copies = public.collection.copies + excluded.copies;
  return v_coroas;
end $$;
revoke all on function public.open_booster(uuid, int, int, jsonb) from public, anon, authenticated;
