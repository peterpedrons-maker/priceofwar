// What the game server needs from its database, so the same rules-and-matchmaking code runs on Supabase
// (the Edge Function) and on an in-memory store (tests, local mock).
import type { DeckSetup } from '../src/engine/game';
import type { RankedProfile } from '../src/engine/ranked';
import type { Action, GameEvent, GameState, Seat } from '../src/engine/types';

// rar: how many copies of each card are special versions (cosmetic only, the rules never read it); the other player sees them on the cards.
export type DeckRar = Record<string, { rara?: number; ultra?: number; secreta?: number; n?: number }>;   // n: only in what the opponent is sent
export interface DeckJson { general: string; cards: Record<string, number>; rar?: DeckRar }

// A private room for challenging a friend by link: the host waits here, the friend joins with the code and the two are matched (never ranked).
export interface RoomRow { code: string; host: string; deck: DeckJson; created_at: string }

export interface QueueRow {
  user_id: string;
  deck: DeckJson;
  created_at: string; // ISO (refreshed by every status poll: it says the player is still here)
  // Ranked only: when the player first started waiting (never refreshed), for the widening Elo window.
  since?: string;
  ranked: boolean;    // the ranked queue and the casual queue never mix
}

// The full record of a match: every action, in order, by the real chair. Used to replay/verify a match.
export interface StepRow {
  n: number;      // 1, 2, 3 … in the order actions were applied (step 1 is the match's `begin`)
  seat: Seat;
  action: Action;
}

// What ONE player receives for a step: the state and events as that player is allowed to see them (secrets
// removed, mirrored so the player is always seat 0). This is all a device ever reads.
export interface ViewRow {
  n: number;
  viewer: Seat;           // real chair of the player this row is for
  user: string;           // that player's user id (Row Level Security checks it)
  actor: Seat;            // who acted, from the viewer's point of view: 0 = me, 1 = the opponent
  action: Action;
  events: GameEvent[];
  state: GameState;
  deadline: number | null; // epoch ms: when the player who must move runs out of time
}

export type EndReason = 'general' | 'concede' | 'timeout';

export interface RewardRow {
  user_id: string;
  seat: Seat;
  reason: 'win' | 'loss' | 'too_short' | 'abandoned';
  xp: number;
  coroas: number;         // already includes `first_win`
  first_win?: number;     // the first-win-of-the-day bonus, when it was paid in this match
  level: number;          // after the reward
  xp_after: number;       // progress inside the level, after the reward
  coroas_after: number;
  levels_gained: number;
  // Only for a ranked match: what it did to the player's ladder numbers (the whole new profile is here so the server can settle it once).
  ranked?: RankedOutcome;
}
export interface RankedOutcome {
  delta: number; mmr_delta: number; placement: boolean; promoted: boolean; demoted: boolean; shield_used: boolean;
  league_before: string; league_after: string; profile: RankedProfile;
  // The same two players already played several ranked matches today: this one moved no points (stops win-trading between friends or two accounts).
  repeat?: boolean;
}

export interface MatchRow {
  id: string;
  seed: number;
  status: 'active' | 'finished';
  first: Seat;
  seat0: string | null;   // user ids; null for the bot
  seat1: string | null;
  bot_seat: Seat | null;
  decks: [DeckJson, DeckJson];
  state: GameState;       // the full state — never readable by players
  steps_count: number;
  winner: Seat | null;
  turn_deadline: number | null;
  timeouts: [number, number];   // consecutive times each chair ran out of time
  end_reason: EndReason | null;
  rewards: RewardRow[] | null;
  ranked: boolean;
  ranked_done: boolean;   // the ladder points of this match were already applied
  created_at: string;
}

export type MatchPatch = Pick<MatchRow, 'state' | 'steps_count' | 'status' | 'winner' | 'turn_deadline' | 'timeouts' | 'end_reason'>;

// A quick message (a ready-made phrase or emoji, never free text) from one chair to the other.
export interface EmoteRow { id: number; seat: Seat; code: string; at: number }

// One finished season of one player: the highest league reached and the Coroas it pays (`claimed` once paid).
export interface SeasonRow { user_id?: string; season: number; peak: number; league: string; coroas: number; claimed: boolean }

// What the GM panel (only the owner's account) is shown: everything is counted by the server, never by the device.
export interface AdminOverview {
  accounts: number; newToday: number; newWeek: number; recent: { username: string; created_at: string }[];
  online: number;                 // seen (a ping every ~90 s) in the last 3 minutes
  waitingCasual: number; waitingRanked: number; playingCasual: number; playingRanked: number; vsBot: number; matches24h: number;
  // Every account (online first, then the most recently seen), with what the GM wants to know about each one; and the sums over all accounts.
  players: AdminPlayer[];
  totals: { coroas: number; xp: number; cards: number };
  // How many different players were seen in the last hour / day / week / month, and a day-by-day flow of the last 14 days (oldest first, days in Brasília time).
  windows: { h1: number; h24: number; d7: number; d30: number };
  daily: { day: string; active: number; newAccounts: number; matches: number }[];
  dailyTracked: boolean;   // false while the presence_days table (SQL 7) does not exist: `active` is then 0
  reports: AdminReport[];  // the latest reports (newest first)
  bans: { id: string; name: string; reason: string; banned_at: string }[];
  feedback: AdminFeedback[];   // problems players reported from inside the game, not yet marked as solved (newest first)
}
export type FeedbackKind = 'bug' | 'confuso' | 'ideia' | 'outro';
export const FEEDBACK_KINDS: FeedbackKind[] = ['bug', 'confuso', 'ideia', 'outro'];
export interface FeedbackRow { id: number; user_id: string; kind: FeedbackKind; text: string; match_id: string | null; ctx: string; created_at: string; done: boolean }
export interface AdminFeedback { id: number; created_at: string; kind: FeedbackKind; text: string; matchId: string | null; ctx: string; user: { id: string; name: string } }
export type ReportReason = 'nome' | 'comportamento' | 'trapaca' | 'outro';
export const REPORT_REASONS: ReportReason[] = ['nome', 'comportamento', 'trapaca', 'outro'];
export interface ReportRow { id: number; reporter: string; reported: string; match_id: string | null; reason: ReportReason; note: string; created_at: string }
export interface AdminReport {
  id: number; created_at: string; reason: ReportReason; note: string;
  reporter: { id: string; name: string }; reported: { id: string; name: string; count: number; banned: boolean };   // count: how many reports this player has received in all
}
export interface AdminPlayer {
  id: string; username: string; avatar_id: string; level: number; xp: number; coroas: number; created_at: string;
  seen_at: string | null; online: boolean;                 // seen_at: the last "I am here" ping (null: never, or before the presence table existed)
  state: 'queue' | 'casual' | 'ranked' | 'bot' | null;      // what the account is doing right now
  ranked: { points: number; games: number; wins: number; losses: number } | null;
  cards: number;                                           // copies owned (all versions)
  banned: boolean;
}

export interface MissionStateRow { items: { id: string; progress: number; claimed: boolean; gens?: string[] }[]; rerolls: number }

export interface Db {
  // A player's "I am here" mark (presence table); the GM panel counts the recent ones as online.
  presenceTouch(userId: string): Promise<void>;
  adminOverview(nowMs: number, onlineMs: number): Promise<AdminOverview>;
  // Bans (a banned account cannot play online) and reports (a player reports the opponent of a match they were in). Both tables come from SQL 8.
  isBanned(userId: string): Promise<boolean>;
  ban(userId: string, reason: string): Promise<void>;
  unban(userId: string): Promise<void>;
  addReport(r: { reporter: string; reported: string; match_id: string | null; reason: ReportReason; note: string }): Promise<boolean>;   // false: the same player had already reported that match
  reportsBy(reporter: string, sinceMs: number): Promise<number>;
  // Rooms (SQL 9): one per host. `roomTake` removes and returns it in one step, so only one friend can join.
  roomPut(row: RoomRow): Promise<void>;
  roomGet(code: string): Promise<RoomRow | null>;
  roomOfHost(host: string): Promise<RoomRow | null>;
  roomTake(code: string): Promise<RoomRow | null>;
  roomDeleteByHost(host: string): Promise<void>;
  // "Reportar um problema" (SQL 10): what a player wrote plus the context the game attached.
  addFeedback(r: { user_id: string; kind: FeedbackKind; text: string; match_id: string | null; ctx: string }): Promise<void>;
  feedbackBy(userId: string, sinceMs: number): Promise<number>;
  feedbackDone(id: number): Promise<void>;
  // The day's tally of coroas won from the AI and whether the first-win bonus was paid (SQL 11). null: the table does not exist yet (then the daily bonus and cap are skipped).
  dailyGet(userId: string, day: string): Promise<{ bot_coroas: number; first_win: boolean } | null>;
  dailyPut(userId: string, day: string, d: { bot_coroas: number; first_win: boolean }): Promise<void>;
  // Missões (SQL 12): o estado de um período (`d:` dia, `w:` semana, `s:` temporada) como JSON com versão. `missionsPut` só grava se a versão ainda é a lida (0 = linha nova): false quando outra requisição mudou antes ou a tabela não existe.
  missionsGet(userId: string, key: string): Promise<{ data: MissionStateRow; version: number } | null>;
  missionsPut(userId: string, key: string, data: MissionStateRow, expectedVersion: number): Promise<boolean>;
  // Soma coroas ao saldo de forma atômica; devolve o novo saldo (null: perfil não encontrado).
  grantCoroas(userId: string, amount: number): Promise<number | null>;
  // Abre um booster de forma atômica (SQL 13): debita `price`, devolve `refund` (repetidas) e soma `adds` à coleção, tudo ou nada. Devolve o novo saldo; -1 se faltam coroas; null se a função não existe ainda.
  openBooster(userId: string, price: number, refund: number, adds: Record<string, number>): Promise<number | null>;
  // Deletes the account and everything that belongs to it (the player's own request from Settings). The tables hang from auth.users with `on delete cascade`.
  deleteAccount(userId: string): Promise<void>;
  collection(userId: string): Promise<Record<string, number>>;
  profile(userId: string): Promise<{ username: string; avatar_id: string; level: number; xp: number; coroas: number } | null>;
  // Atomically removes and returns the oldest waiting entry belonging to someone else.
  queueTake(excludeUserId: string, ranked: boolean): Promise<QueueRow | null>;
  queueGet(userId: string): Promise<QueueRow | null>;
  // Ranked matchmaking: everybody else waiting in the ranked queue (oldest first), and an atomic take of one chosen entry (null when somebody took it first).
  queueWaiting(excludeUserId: string, ranked: boolean): Promise<QueueRow[]>;
  queueTakeUser(userId: string): Promise<QueueRow | null>;
  queuePut(row: QueueRow): Promise<void>;
  queueDelete(userId: string): Promise<void>;
  createMatch(row: Omit<MatchRow, 'id' | 'created_at'>, steps: StepRow[], views: ViewRow[]): Promise<MatchRow>;
  getMatch(id: string): Promise<MatchRow | null>;
  activeMatchOf(userId: string): Promise<MatchRow | null>;
  // Saves a match only if nobody else changed it meanwhile (compare-and-swap on steps_count).
  saveMatch(id: string, expectedStepsCount: number, patch: MatchPatch, newSteps: StepRow[], newViews: ViewRow[]): Promise<boolean>;
  steps(matchId: string, sinceN: number): Promise<StepRow[]>;
  views(matchId: string, viewer: Seat, sinceN: number): Promise<ViewRow[]>;
  latestView(matchId: string, viewer: Seat): Promise<ViewRow | null>;
  // The ladder: one row per player (null until their first ranked match).
  rankedProfile(userId: string): Promise<RankedProfile | null>;
  // Applies a ranked match's results exactly once: false when it was already applied.
  rankedSettle(matchId: string, rows: { user_id: string; profile: RankedProfile }[]): Promise<boolean>;
  rankedTop(limit: number, season: number): Promise<{ user_id: string; username: string; avatar_id: string; profile: RankedProfile }[]>;
  rankedPosition(points: number, season: number): Promise<number>;
  // Closes a season for one player exactly once: records the season's result (paid later by `rankedClaim`) and swaps the ladder row for the reset one. False when it was already closed.
  rankedCloseSeason(userId: string, row: SeasonRow, next: RankedProfile): Promise<boolean>;
  rankedSeasons(userId: string): Promise<SeasonRow[]>;
  // Test aid: days the season calendar is moved forward (0 normally). Only the season number and its end use it, never the match clock.
  seasonOffsetDays(): Promise<number>;
  // Pays a closed season's Coroas once: the amount paid and the new balance, or null when there is nothing (left) to claim.
  // Test of fair play: how many finished ranked matches these two players played since `sinceMs` (not counting `exceptMatchId`).
  rankedPairCount(a: string, b: string, sinceMs: number, exceptMatchId: string): Promise<number>;
  rankedClaim(userId: string, season: number): Promise<{ coroas: number; coroas_after: number } | null>;
  addEmote(matchId: string, seat: Seat, code: string, at: number): Promise<EmoteRow>;
  emotesSince(matchId: string, sinceId: number): Promise<EmoteRow[]>;
  // Pays a match's rewards exactly once: false when they were already paid.
  applyRewards(matchId: string, rows: RewardRow[]): Promise<boolean>;
}

export type { DeckSetup };

// Puts together the GM's player list from the raw rows (shared by the Supabase and the in-memory Db, so both answer the same way).
export const buildAdminPlayers = (
  nowMs: number, onlineMs: number,
  profiles: { id: string; username: string; avatar_id: string; level?: number; xp?: number; coroas?: number; created_at?: string }[],
  seen: Map<string, number>, ranked: Map<string, { points: number; games: number; wins: number; losses: number }>, cards: Map<string, number>,
  busy: Map<string, 'queue' | 'casual' | 'ranked' | 'bot'>, banned: Set<string> = new Set(),
): { players: AdminPlayer[]; totals: { coroas: number; xp: number; cards: number } } => {
  const players: AdminPlayer[] = profiles.map(p => {
    const t = seen.get(p.id);
    return {
      id: p.id, username: p.username, avatar_id: p.avatar_id, level: p.level ?? 1, xp: p.xp ?? 0, coroas: p.coroas ?? 0, created_at: p.created_at ?? new Date(nowMs).toISOString(),
      seen_at: t === undefined ? null : new Date(t).toISOString(), online: t !== undefined && nowMs - t < onlineMs, state: busy.get(p.id) ?? null, ranked: ranked.get(p.id) ?? null, cards: cards.get(p.id) ?? 0, banned: banned.has(p.id),
    };
  });
  players.sort((a, b) => Number(b.online) - Number(a.online) || Date.parse(b.seen_at ?? b.created_at) - Date.parse(a.seen_at ?? a.created_at));
  return { players, totals: { coroas: players.reduce((n, p) => n + p.coroas, 0), xp: players.reduce((n, p) => n + p.xp, 0), cards: players.reduce((n, p) => n + p.cards, 0) } };
};

// A day key in Brasília time (UTC-3): the GM reads "today" the way the owner lives it.
export const dayKey = (ms: number) => new Date(ms - 3 * 3600e3).toISOString().slice(0, 10);
export const lastDays = (nowMs: number, n = 14): string[] => Array.from({ length: n }, (_, i) => dayKey(nowMs - (n - 1 - i) * 864e5));
export const windowsOf = (nowMs: number, seen: number[]) => ({
  h1: seen.filter(t => nowMs - t < 36e5).length, h24: seen.filter(t => nowMs - t < 864e5).length,
  d7: seen.filter(t => nowMs - t < 7 * 864e5).length, d30: seen.filter(t => nowMs - t < 30 * 864e5).length,
});

// The GM's view of reports and bans, with names (shared by the Supabase and the in-memory Db).
export const buildAdminReports = (
  reports: ReportRow[], bans: { user_id: string; reason: string; banned_at: string }[], nameOf: (id: string) => string,
): { reports: AdminReport[]; bans: AdminOverview['bans'] } => {
  const count = new Map<string, number>(); reports.forEach(r => count.set(r.reported, (count.get(r.reported) ?? 0) + 1));
  const banned = new Set(bans.map(b => b.user_id));
  return {
    reports: [...reports].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 40).map(r => ({
      id: r.id, created_at: r.created_at, reason: r.reason, note: r.note, reporter: { id: r.reporter, name: nameOf(r.reporter) },
      reported: { id: r.reported, name: nameOf(r.reported), count: count.get(r.reported) ?? 1, banned: banned.has(r.reported) },
    })),
    bans: bans.map(b => ({ id: b.user_id, name: nameOf(b.user_id), reason: b.reason, banned_at: b.banned_at })),
  };
};

export const buildAdminFeedback = (rows: FeedbackRow[], nameOf: (id: string) => string): AdminFeedback[] =>
  rows.filter(r => !r.done).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 40)
    .map(r => ({ id: r.id, created_at: r.created_at, kind: r.kind, text: r.text, matchId: r.match_id, ctx: r.ctx, user: { id: r.user_id, name: nameOf(r.user_id) } }));
