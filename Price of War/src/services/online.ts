// Talking to the game server (the `game` Edge Function and the match_steps table, see docs/online-setup.md).
// Only used when accounts are configured (authMode === 'supabase').
import type { Action, Seat } from '../engine/types';
import { getClient } from './auth';

export interface DeckJson { general: string; cards: Record<string, number> }
export interface StepRow { n: number; seat: Seat; action: Action }
export interface MatchInit {
  id: string;
  seat: Seat;
  seed: number;
  first: Seat;
  decks: [DeckJson, DeckJson];
  opponent: { name: string; avatarId: string; bot: boolean };
  steps: StepRow[];
  status: 'active' | 'finished';
  winner: Seat | null;
  // True when the match was already under way (you came back to it) instead of just starting.
  resumed: boolean;
}

export type QueueResult =
  | { ok: true; status: 'waiting' | 'none' }
  | { ok: true; status: 'matched'; match: MatchInit }
  | { ok: false; error: string; unavailable?: boolean };

export type ActResult =
  | { ok: true; steps: StepRow[]; finished: boolean; winner: Seat | null }
  | { ok: false; error: string; unavailable?: boolean };

// Calls the function. A missing/unreachable function is reported as `unavailable` so the caller can fall back.
const call = async (body: Record<string, unknown>): Promise<any> => {
  try {
    const { data, error } = await (await getClient()).functions.invoke('game', { body });
    if (error) {
      // supabase-js hides the JSON body of non-2xx answers inside error.context
      let detail: any = null;
      try { detail = await (error as any).context?.json?.(); } catch { /* not JSON */ }
      if (detail && typeof detail.error === 'string') return { ok: false, error: detail.error };
      const status = (error as any).context?.status;
      return { ok: false, error: 'Servidor de partidas indisponível.', unavailable: status === 404 || status === undefined || status >= 500 };
    }
    return data;
  } catch {
    return { ok: false, error: 'Sem conexão com o servidor de partidas.', unavailable: true };
  }
};

export const queueForMatch = (deck: DeckJson, vsBot: boolean): Promise<QueueResult> => call({ op: 'queue', cards: deck.cards, general: deck.general, vsBot });
export const queueStatus = (): Promise<QueueResult> => call({ op: 'status' });
export const cancelQueue = (): Promise<QueueResult> => call({ op: 'cancel' });
export const sendAction = (matchId: string, action: Action, since: number): Promise<ActResult> => call({ op: 'act', matchId, action, since });

// The recorded actions of a match after step `since` (the table is readable by the match's two players).
export const fetchSteps = async (matchId: string, since: number): Promise<StepRow[] | null> => {
  try {
    const { data, error } = await (await getClient()).from('match_steps').select('n, seat, action').eq('match_id', matchId).gt('n', since).order('n', { ascending: true });
    if (error) return null;
    return data as StepRow[];
  } catch { return null; }
};

export const fetchMatchState = async (matchId: string): Promise<{ status: 'active' | 'finished'; winner: Seat | null } | null> => {
  try {
    const { data, error } = await (await getClient()).from('matches').select('status, winner').eq('id', matchId).maybeSingle();
    if (error || !data) return null;
    return data as { status: 'active' | 'finished'; winner: Seat | null };
  } catch { return null; }
};
