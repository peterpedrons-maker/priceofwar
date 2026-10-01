// Talking to the game server (the `game` Edge Function and the match_views table, see docs/online-setup.md).
// Only used when accounts are configured (authMode === 'supabase').
//
// The server holds the real match. For every step it keeps what THIS player may see (no opponent hand, no deck
// order); a device only ever reads those views and sends its own actions.
import type { Action, GameEvent, GameState, Seat } from '../engine/types';
import { getClient } from './auth';

export interface DeckJson { general: string; cards: Record<string, number> }

// One step of the match as this player sees it. `actor`: 0 = I acted, 1 = the opponent (or the bot) acted.
export interface ViewRow {
  n: number;
  actor: Seat;
  action: Action;
  events: GameEvent[];
  state: GameState;
  deadline: number | null;
}

export interface RewardInfo {
  reason: 'win' | 'loss' | 'too_short' | 'abandoned';
  xp: number;
  coroas: number;
  level: number;
  xp_after: number;
  coroas_after: number;
  levels_gained: number;
}

export interface MatchInit {
  id: string;
  iGoFirst: boolean;
  myDeck: DeckJson;
  opponentGeneral: string;
  opponent: { name: string; avatarId: string; bot: boolean };
  start: GameState;
  rows: ViewRow[];
  latest: ViewRow | null;
  status: 'active' | 'finished';
  winner: Seat | null;
  resumed: boolean;
  deadline: number | null;
  now: number;
}

export type QueueResult =
  | { ok: true; status: 'waiting' | 'none' }
  | { ok: true; status: 'matched'; match: MatchInit }
  | { ok: false; error: string; unavailable?: boolean };

export type ActResult =
  | { ok: true; rows: ViewRow[]; finished: boolean; deadline: number | null; now: number; reward: RewardInfo | null }
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

const asActResult = (r: any): ActResult =>
  r && r.ok === true && r.status === 'acted'
    ? { ok: true, rows: r.rows ?? [], finished: !!r.finished, deadline: r.deadline ?? null, now: r.now ?? Date.now(), reward: r.reward ?? null }
    : { ok: false, error: r?.error ?? 'Resposta inesperada do servidor.', unavailable: r?.unavailable };

export const queueForMatch = (deck: DeckJson, vsBot: boolean): Promise<QueueResult> => call({ op: 'queue', cards: deck.cards, general: deck.general, vsBot });
export const queueStatus = (): Promise<QueueResult> => call({ op: 'status' });
export const cancelQueue = (): Promise<QueueResult> => call({ op: 'cancel' });
export const sendAction = async (matchId: string, action: Action, since: number): Promise<ActResult> => asActResult(await call({ op: 'act', matchId, action, since }));
// Also what enforces the turn clock: anybody's tick makes the server check whether the player to move ran out of time.
export const tickMatch = async (matchId: string, since: number): Promise<ActResult> => asActResult(await call({ op: 'tick', matchId, since }));
export const fetchResult = async (matchId: string): Promise<{ finished: boolean; reward: RewardInfo | null } | null> => {
  const r = await call({ op: 'result', matchId });
  return r && r.ok === true && r.status === 'result' ? { finished: !!r.finished, reward: r.reward ?? null } : null;
};

// The views of the steps after `since` (the table is readable only by the player each row is for).
export const fetchViews = async (matchId: string, since: number): Promise<ViewRow[] | null> => {
  try {
    const { data, error } = await (await getClient()).from('match_views').select('n, actor, action, events, state, deadline').eq('match_id', matchId).gt('n', since).order('n', { ascending: true });
    if (error) return null;
    return (data as any[]).map(r => ({ ...r, deadline: r.deadline === null || r.deadline === undefined ? null : Number(r.deadline) })) as ViewRow[];
  } catch { return null; }
};
