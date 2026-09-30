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
