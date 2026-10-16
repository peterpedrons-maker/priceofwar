// Talking to the game server (the `game` Edge Function and the match_views table, see docs/online-setup.md).
// Only used when accounts are configured (authMode === 'supabase').
//
// The server holds the real match. For every step it keeps what THIS player may see (no opponent hand, no deck
// order); a device only ever reads those views and sends its own actions.
import type { Action, GameEvent, GameState, Seat } from '../engine/types';
import { getClient } from './auth';

export interface DeckJson { general: string; cards: Record<string, number>; rar?: Record<string, { rara?: number; ultra?: number; secreta?: number }> }

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
  // Ranked matches only: what the match did to the ladder (the hidden Elo is not sent to the device).
  ranked?: { repeat?: boolean; delta: number; placement: boolean; promoted: boolean; demoted: boolean; shield_used: boolean; league_before: string; league_after: string; profile: { points: number; games: number; wins: number; losses: number; shield: boolean; peak: number } };
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
  // Who won the coin toss (that player chooses to go first or second), and whether the choice was already made.
  iWonToss?: boolean;
  chosen?: boolean;
  mySide?: 'cara' | 'coroa';
  myDeck: DeckJson;
  opponentGeneral: string;
  opponentRar?: Record<string, { rara?: number; ultra?: number; secreta?: number }>;
  opponent: { name: string; avatarId: string; bot: boolean };
  start: GameState;
  rows: ViewRow[];
  latest: ViewRow | null;
  status: 'active' | 'finished';
  winner: Seat | null;
  resumed: boolean;
  ranked?: boolean;
  leagues?: [string, string];
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

export const queueForMatch = (deck: DeckJson, vsBot: boolean, botDeck?: string, ranked = false): Promise<QueueResult> => call({ op: 'queue', cards: deck.cards, rar: deck.rar, general: deck.general, vsBot, botDeck, ranked });
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

// Quick messages (ready-made phrases and emojis, see src/Emotes.tsx): `from` 0 = me, 1 = the opponent. `since` = the last id already seen.
export type EmoteMsg = { id: number; from: 0 | 1; code: string };
export type EmoteResult = { ok: true; emotes: EmoteMsg[] } | { ok: false; error: string; unavailable?: boolean };
const asEmoteResult = (r: any): EmoteResult =>
  r && r.ok === true && r.status === 'emotes' ? { ok: true, emotes: r.emotes ?? [] } : { ok: false, error: r?.error ?? 'Resposta inesperada do servidor.', unavailable: r?.unavailable };
export const sendEmote = async (matchId: string, code: string, since: number): Promise<EmoteResult> => asEmoteResult(await call({ op: 'emote', matchId, code, since }));
export const fetchEmotes = async (matchId: string, since: number): Promise<EmoteResult> => asEmoteResult(await call({ op: 'emotes', matchId, since }));

// The ladder (ranked mode): my numbers, and the ranking list with my place.
export interface RankedView { points: number; label: string; league: string; division: number | null; inDivision: number; games: number; wins: number; losses: number; shield: boolean; peak: number; placementLeft: number; position: number; top: boolean;
  season: number; endsAt: number; frame: string | null; pending: { season: number; league: string; coroas: number }[] }
export interface RankingRow { rank: number; user: string; name: string; avatarId: string; points: number; label: string; top: boolean; me: boolean }
export const fetchRanked = async (): Promise<RankedView | null> => { const r = await call({ op: 'ranked' }); return r && r.ok === true && r.status === 'ranked' ? r.profile : null; };
export const fetchRanking = async (limit = 50): Promise<{ rows: RankingRow[]; me: RankedView } | null> => { const r = await call({ op: 'ranking', limit }); return r && r.ok === true && r.status === 'ranking' ? { rows: r.rows, me: r.me } : null; };

// Pays the Coroas of a finished season (once). `coroas_after` is the new balance, to show at once.
export const claimSeason = async (season: number): Promise<{ coroas: number; coroas_after: number; profile: RankedView } | null> => { const r = await call({ op: 'claim', season }); return r && r.ok === true && r.status === 'claimed' ? { coroas: r.coroas, coroas_after: r.coroas_after, profile: r.profile } : null; };

// GM mode (only the owner's account): the server answers `forbidden` to everybody else, so a normal player gets null and never sees the panel.
export interface AdminInfo {
  accounts: number; newToday: number; newWeek: number; recent: { username: string; created_at: string }[]; online: number;
  waitingCasual: number; waitingRanked: number; playingCasual: number; playingRanked: number; vsBot: number; matches24h: number;
  top: { rank: number; name: string; points: number; label: string }[]; season: number; me: { id: string; email: string | null };
  players: { id: string; username: string; avatar_id: string; level: number; xp: number; coroas: number; created_at: string; seen_at: string | null; online: boolean;
    state: 'queue' | 'casual' | 'ranked' | 'bot' | null; ranked: { points: number; games: number; wins: number; losses: number } | null; cards: number }[];
  totals: { coroas: number; xp: number; cards: number };
  windows: { h1: number; h24: number; d7: number; d30: number };
  daily: { day: string; active: number; newAccounts: number; matches: number }[]; dailyTracked: boolean;
}
export const fetchAdmin = async (): Promise<AdminInfo | null> => { const r = await call({ op: 'admin' }); return r && r.ok === true && r.status === 'admin' ? (r.admin as AdminInfo) : null; };
// "I am here": a light mark every ~90 s while the app is open (the GM panel counts the recent ones as online).
export const pingPresence = () => { void call({ op: 'ping' }); };
