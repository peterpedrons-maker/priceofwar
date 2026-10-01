// What the game server needs from its database, so the same rules-and-matchmaking code runs on Supabase
// (the Edge Function) and on an in-memory store (tests, local mock).
import type { DeckSetup } from '../src/engine/game';
import type { Action, GameState, Seat } from '../src/engine/types';

export interface DeckJson { general: string; cards: Record<string, number> }

export interface QueueRow {
  user_id: string;
  deck: DeckJson;
  created_at: string; // ISO
}

export interface StepRow {
  n: number;      // 1, 2, 3 … in the order actions were applied (step 1 is the match's `begin`)
  seat: Seat;
  action: Action;
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
  created_at: string;
}

export interface Db {
  collection(userId: string): Promise<Record<string, number>>;
  profile(userId: string): Promise<{ username: string; avatar_id: string } | null>;
  // Atomically removes and returns the oldest waiting entry belonging to someone else.
  queueTake(excludeUserId: string): Promise<QueueRow | null>;
  queueGet(userId: string): Promise<QueueRow | null>;
  queuePut(row: QueueRow): Promise<void>;
  queueDelete(userId: string): Promise<void>;
  createMatch(row: Omit<MatchRow, 'id' | 'created_at'>, steps: StepRow[]): Promise<MatchRow>;
  getMatch(id: string): Promise<MatchRow | null>;
  activeMatchOf(userId: string): Promise<MatchRow | null>;
  // Saves a match only if nobody else changed it meanwhile (compare-and-swap on steps_count).
  saveMatch(id: string, expectedStepsCount: number, patch: Pick<MatchRow, 'state' | 'steps_count' | 'status' | 'winner'>, newSteps: StepRow[]): Promise<boolean>;
  steps(matchId: string, sinceN: number): Promise<StepRow[]>;
}

export type { DeckSetup };
