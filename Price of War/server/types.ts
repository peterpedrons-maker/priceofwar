// What the game server needs from its database, so the same rules-and-matchmaking code runs on Supabase
// (the Edge Function) and on an in-memory store (tests, local mock).
import type { DeckSetup } from '../src/engine/game';
import type { Action, GameEvent, GameState, Seat } from '../src/engine/types';

export interface DeckJson { general: string; cards: Record<string, number> }

export interface QueueRow {
  user_id: string;
  deck: DeckJson;
  created_at: string; // ISO
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
  created_at: string;
}

export type MatchPatch = Pick<MatchRow, 'state' | 'steps_count' | 'status' | 'winner' | 'turn_deadline' | 'timeouts' | 'end_reason'>;

export interface Db {
  collection(userId: string): Promise<Record<string, number>>;
  profile(userId: string): Promise<{ username: string; avatar_id: string; level: number; xp: number; coroas: number } | null>;
  // Atomically removes and returns the oldest waiting entry belonging to someone else.
  queueTake(excludeUserId: string): Promise<QueueRow | null>;
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
  // Pays a match's rewards exactly once: false when they were already paid.
  applyRewards(matchId: string, rows: RewardRow[]): Promise<boolean>;
}

export type { DeckSetup };
