// Player data in the cloud (Supabase tables from docs/supabase-schema.sql). Only used when accounts
// are configured (authMode === 'supabase'); in local mode the game keeps everything in the browser.
import { getClient } from './auth';

export type CloudProfile = { id: string; username: string; avatar_id: string; level: number; xp: number; coroas: number };
export type CloudResult<T> = { ok: true; data: T } | { ok: false; reason: 'taken' | 'invalid' | 'missing-db' | 'network' | 'other'; message: string };

const COLUMNS = 'id, username, avatar_id, level, xp, coroas';

const fail = (error: any): { ok: false; reason: 'taken' | 'invalid' | 'missing-db' | 'network' | 'other'; message: string } => {
  const code = String(error?.code ?? '');
  const msg = String(error?.message ?? error ?? '');
  console.error('cloud error', error);
  if (code === '23505') return { ok: false, reason: 'taken', message: 'Esse nome já está em uso. Escolha outro.' };
  if (code === '23514') return { ok: false, reason: 'invalid', message: 'Nome inválido: use de 3 a 16 letras, números, espaço, _ . ou -' };
  if (code === '42P01' || code === 'PGRST205' || /schema cache|does not exist/i.test(msg)) return { ok: false, reason: 'missing-db', message: 'O banco de dados ainda não foi preparado (rode o SQL do guia).' };
  if (/failed to fetch|network/i.test(msg)) return { ok: false, reason: 'network', message: 'Sem conexão com o servidor. Verifique sua internet.' };
  return { ok: false, reason: 'other', message: 'Algo deu errado ao falar com o servidor. Tente de novo.' };
};

// null when this account has no profile yet (first run).
export const fetchProfile = async (userId: string): Promise<CloudResult<CloudProfile | null>> => {
  try {
    const { data, error } = await (await getClient()).from('profiles').select(COLUMNS).eq('id', userId).maybeSingle();
    if (error) return fail(error);
    return { ok: true, data: (data as CloudProfile | null) ?? null };
  } catch (e) { return fail(e); }
};

export const usernameAvailable = async (name: string): Promise<boolean | null> => {
  try {
    const { data, error } = await (await getClient()).rpc('username_available', { name });
    if (error) { console.error('username_available', error); return null; }
    return data === true;
  } catch { return null; }
};

export const createProfile = async (userId: string, username: string, avatarId: string): Promise<CloudResult<CloudProfile>> => {
  try {
    const { data, error } = await (await getClient()).from('profiles').insert({ id: userId, username, avatar_id: avatarId }).select(COLUMNS).single();
    if (error) return fail(error);
    return { ok: true, data: data as CloudProfile };
  } catch (e) { return fail(e); }
};

export const updateProfileFields = async (userId: string, patch: { username?: string; avatar_id?: string }): Promise<CloudResult<CloudProfile>> => {
  try {
    const { data, error } = await (await getClient()).from('profiles').update(patch).eq('id', userId).select(COLUMNS).single();
    if (error) return fail(error);
    return { ok: true, data: data as CloudProfile };
  } catch (e) { return fail(e); }
};

// ── Collection and decks ─────────────────────────────────────────────────────
export type CloudDeck = { slot: number; name: string; general: string; cards: Record<string, number> };
export type CloudStore = { collection: Record<string, number>; decks: CloudDeck[] };

export const fetchStore = async (userId: string): Promise<CloudResult<CloudStore>> => {
  try {
    const c = await getClient();
    const [col, dk] = await Promise.all([
      c.from('collection').select('card_name, copies').eq('user_id', userId).limit(5000),
      c.from('decks').select('slot, name, general, cards').eq('user_id', userId),
    ]);
    if (col.error) return fail(col.error);
    if (dk.error) return fail(dk.error);
    const collection: Record<string, number> = {};
    (col.data ?? []).forEach((r: any) => { if (r.card_name && r.copies > 0) collection[r.card_name] = r.copies; });
    const decks: CloudDeck[] = (dk.data ?? []).map((r: any) => ({ slot: r.slot, name: r.name ?? '', general: r.general ?? '', cards: (r.cards && typeof r.cards === 'object') ? r.cards : {} }));
    return { ok: true, data: { collection, decks } };
  } catch (e) { return fail(e); }
};

// Writes the whole local store (the collection only grows for now, so nothing is ever deleted).
export const pushStore = async (userId: string, store: { collection: Record<string, number>; decks: CloudDeck[] }): Promise<CloudResult<null>> => {
  try {
    const c = await getClient();
    const rows = Object.entries(store.collection)
      .filter(([, n]) => n > 0)
      .map(([card_name, copies]) => ({ user_id: userId, card_name, copies: Math.min(Math.floor(copies), 999) }));
    for (let i = 0; i < rows.length; i += 300) {
      const { error } = await c.from('collection').upsert(rows.slice(i, i + 300), { onConflict: 'user_id,card_name' });
      if (error) return fail(error);
    }
    if (store.decks.length > 0) {
      const { error } = await c.from('decks').upsert(
        store.decks.map(d => ({ user_id: userId, slot: d.slot, name: d.name, general: d.general, cards: d.cards })),
        { onConflict: 'user_id,slot' },
      );
      if (error) return fail(error);
    }
    return { ok: true, data: null };
  } catch (e) { return fail(e); }
};
