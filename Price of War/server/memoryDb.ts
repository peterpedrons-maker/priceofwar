// An in-memory Db: used by the tests and by the local mock server, so the very same handler runs without Supabase.
import type { Db, MatchRow, QueueRow, StepRow } from './types';

export interface MemoryTables {
  profiles: { id: string; username: string; avatar_id: string }[];
  collection: { user_id: string; card_name: string; copies: number }[];
}

export class MemoryDb implements Db {
  queue: QueueRow[] = [];
  matches: MatchRow[] = [];
  stepRows: (StepRow & { match_id: string })[] = [];
  private nextId = 1;
  constructor(public tables: MemoryTables = { profiles: [], collection: [] }) {}

  async collection(userId: string) {
    const out: Record<string, number> = {};
    this.tables.collection.filter(r => r.user_id === userId).forEach(r => { out[r.card_name] = r.copies; });
    return out;
  }
  async profile(userId: string) {
    const p = this.tables.profiles.find(x => x.id === userId);
    return p ? { username: p.username, avatar_id: p.avatar_id } : null;
  }
  async queueTake(excludeUserId: string) {
    const i = this.queue.findIndex(q => q.user_id !== excludeUserId);
    return i === -1 ? null : this.queue.splice(i, 1)[0];
  }
  async queueGet(userId: string) { return this.queue.find(q => q.user_id === userId) ?? null; }
  async queuePut(row: QueueRow) { this.queue = this.queue.filter(q => q.user_id !== row.user_id); this.queue.push(row); }
  async queueDelete(userId: string) { this.queue = this.queue.filter(q => q.user_id !== userId); }
  async createMatch(row: Omit<MatchRow, 'id' | 'created_at'>, steps: StepRow[]) {
    const m: MatchRow = { ...JSON.parse(JSON.stringify(row)), id: `match-${this.nextId++}`, created_at: new Date().toISOString() };
    this.matches.push(m);
    steps.forEach(s => this.stepRows.push({ ...JSON.parse(JSON.stringify(s)), match_id: m.id }));
    return JSON.parse(JSON.stringify(m)) as MatchRow;
  }
  async getMatch(id: string) {
    const m = this.matches.find(x => x.id === id);
    return m ? (JSON.parse(JSON.stringify(m)) as MatchRow) : null;
  }
  async activeMatchOf(userId: string) {
    const m = [...this.matches].reverse().find(x => x.status === 'active' && (x.seat0 === userId || x.seat1 === userId));
    return m ? (JSON.parse(JSON.stringify(m)) as MatchRow) : null;
  }
  async saveMatch(id: string, expected: number, patch: Pick<MatchRow, 'state' | 'steps_count' | 'status' | 'winner'>, newSteps: StepRow[]) {
    const m = this.matches.find(x => x.id === id);
    if (!m || m.steps_count !== expected) return false;
    Object.assign(m, JSON.parse(JSON.stringify(patch)));
    newSteps.forEach(s => this.stepRows.push({ ...JSON.parse(JSON.stringify(s)), match_id: id }));
    return true;
  }
  async steps(matchId: string, sinceN: number) {
    return this.stepRows.filter(s => s.match_id === matchId && s.n > sinceN).sort((a, b) => a.n - b.n).map(({ n, seat, action }) => ({ n, seat, action }));
  }
}
