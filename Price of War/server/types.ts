// What the game server needs from its database, so the same rules-and-matchmaking code runs on Supabase
// (the Edge Function) and on an in-memory store (tests, local mock).
import type { DeckSetup } from '../src/engine/game';
import type { RankedProfile } from '../src/engine/ranked';
import type { Action, GameEvent, GameState, Seat } from '../src/engine/types';

export interface DeckJson { general: string; cards: Record<string, number> }

export interface QueueRow {
  user_id: string;
  deck: DeckJson;
  created_at: string; // ISO
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
  coroas: number;
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

export interface Db {
  collection(userId: string): Promise<Record<string, number>>;
  profile(userId: string): Promise<{ username: string; avatar_id: string; level: number; xp: number; coroas: number } | null>;
  // Atomically removes and returns the oldest waiting entry belonging to someone else.
  queueTake(excludeUserId: string, ranked: boolean): Promise<QueueRow | null>;
  queueGet(userId: string): Promise<QueueRow | null>;
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
  // Pays a closed season's Coroas once: the amount paid and the new balance, or null when there is nothing (left) to claim.
  rankedClaim(userId: string, season: number): Promise<{ coroas: number; coroas_after: number } | null>;
  addEmote(matchId: string, seat: Seat, code: string, at: number): Promise<EmoteRow>;
  emotesSince(matchId: string, sinceId: number): Promise<EmoteRow[]>;
  // Pays a match's rewards exactly once: false when they were already paid.
  applyRewards(matchId: string, rows: RewardRow[]): Promise<boolean>;
}

export type { DeckSetup };
