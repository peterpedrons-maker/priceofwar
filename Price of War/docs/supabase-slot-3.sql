-- Libera o 3º deck salvo (Mercenários) na nuvem. Rode UMA vez no SQL Editor do Supabase e depois troque CLOUD_DECK_SLOTS para 3 em src/App.tsx
-- (e [1, 2] por [1, 2, 3] em syncDeckStoreWithCloud). Enquanto isso não for feito, o deck 3 fica só no aparelho (o jogo cria sozinho).
alter table public.decks drop constraint if exists decks_slot_check;
alter table public.decks add constraint decks_slot_check check (slot between 1 and 3);
