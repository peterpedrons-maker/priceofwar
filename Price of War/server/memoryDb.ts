// An in-memory Db: used by the tests and by the local mock server, so the very same handler runs without Supabase.
import type { Seat } from '../src/engine/types';
import type { Db, EmoteRow, MatchPatch, MatchRow, QueueRow, RewardRow, StepRow, ViewRow } from './types';

export interface MemoryTables {
  profiles: { id: string; username: string; avatar_id: string; level?: number; xp?: number; coroas?: number }[];
  collection: { user_id: string; card_name: string; copies: number }[];
}

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

export class MemoryDb implements Db {
  queue: QueueRow[] = [];
  matches: MatchRow[] = [];
  stepRows: (StepRow & { match_id: string })[] = [];
  viewRows: (ViewRow & { match_id: string })[] = [];
  emoteRows: (EmoteRow & { match_id: string })[] = [];
  private nextId = 1;
  private nextEmote = 1;
  constructor(public tables: MemoryTables = { profiles: [], collection: [] }) {}

  async collection(userId: string) {
    const out: Record<string, number> = {};
    this.tables.collection.filter(r => r.user_id === userId).forEach(r => { out[r.card_name] = r.copies; });
    return out;
  }
  async profile(userId: string) {
    const p = this.tables.profiles.find(x => x.id === userId);
    return p ? { username: p.username, avatar_id: p.avatar_id, level: p.level ?? 1, xp: p.xp ?? 0, coroas: p.coroas ?? 150 } : null;
  }
  async queueTake(excludeUserId: string) {
    const i = this.queue.findIndex(q => q.user_id !== excludeUserId);
    return i === -1 ? null : this.queue.splice(i, 1)[0];
  }
  async queueGet(userId: string) { return this.queue.find(q => q.user_id === userId) ?? null; }
  async queuePut(row: QueueRow) { this.queue = this.queue.filter(q => q.user_id !== row.user_id); this.queue.push(row); }
  async queueDelete(userId: string) { this.queue = this.queue.filter(q => q.user_id !== userId); }
  async createMatch(row: Omit<MatchRow, 'id' | 'created_at'>, steps: StepRow[], views: ViewRow[]) {
    const m: MatchRow = { ...clone(row), id: `match-${this.nextId++}`, created_at: new Date().toISOString() };
    this.matches.push(m);
    steps.forEach(s => this.stepRows.push({ ...clone(s), match_id: m.id }));
    views.forEach(v => this.viewRows.push({ ...clone(v), match_id: m.id }));
    return clone(m);
  }
  async getMatch(id: string) {
    const m = this.matches.find(x => x.id === id);
    return m ? clone(m) : null;
  }
  async activeMatchOf(userId: string) {
    const m = [...this.matches].reverse().find(x => x.status === 'active' && (x.seat0 === userId || x.seat1 === userId));
    return m ? clone(m) : null;
  }
  async saveMatch(id: string, expected: number, patch: MatchPatch, newSteps: StepRow[], newViews: ViewRow[]) {
    const m = this.matches.find(x => x.id === id);
    if (!m || m.steps_count !== expected) return false;
    Object.assign(m, clone(patch));
    newSteps.forEach(s => this.stepRows.push({ ...clone(s), match_id: id }));
    newViews.forEach(v => this.viewRows.push({ ...clone(v), match_id: id }));
    return true;
  }
  async steps(matchId: string, sinceN: number) {
    return this.stepRows.filter(s => s.match_id === matchId && s.n > sinceN).sort((a, b) => a.n - b.n).map(({ n, seat, action }) => ({ n, seat, action }));
  }
  async views(matchId: string, viewer: Seat, sinceN: number) {
    return clone(this.viewRows.filter(v => v.match_id === matchId && v.viewer === viewer && v.n > sinceN).sort((a, b) => a.n - b.n).map(({ match_id: _m, ...v }) => v as ViewRow));
  }
  async latestView(matchId: string, viewer: Seat) {
    const all = await this.views(matchId, viewer, 0);
    return all.length ? all[all.length - 1] : null;
  }
  async addEmote(matchId: string, seat: Seat, code: string, at: number) {
    const row = { id: this.nextEmote++, seat, code, at };
    this.emoteRows.push({ ...row, match_id: matchId });
    return row;
  }
  async emotesSince(matchId: string, sinceId: number) {
    return this.emoteRows.filter(e => e.match_id === matchId && e.id > sinceId).sort((a, b) => a.id - b.id).map(({ id, seat, code, at }) => ({ id, seat, code, at }));
  }
  async applyRewards(matchId: string, rows: RewardRow[]) {
    const m = this.matches.find(x => x.id === matchId);
    if (!m || m.rewards) return false;
    m.rewards = clone(rows);
    rows.forEach(r => {
      const p = this.tables.profiles.find(x => x.id === r.user_id);
      if (p) { p.level = r.level; p.xp = r.xp_after; p.coroas = r.coroas_after; }
    });
    return true;
  }
}
