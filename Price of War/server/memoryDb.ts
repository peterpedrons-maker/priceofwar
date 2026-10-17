// An in-memory Db: used by the tests and by the local mock server, so the very same handler runs without Supabase.
import type { Seat } from '../src/engine/types';
import type { RankedProfile } from '../src/engine/ranked';
import { buildAdminFeedback, buildAdminPlayers, buildAdminReports, dayKey, lastDays, windowsOf } from './types';
import type { FeedbackKind, FeedbackRow, ReportReason, ReportRow, RoomRow } from './types';
import type { AdminOverview, Db, EmoteRow, SeasonRow, MatchPatch, MatchRow, QueueRow, RewardRow, StepRow, ViewRow } from './types';

export interface MemoryTables {
  profiles: { id: string; username: string; avatar_id: string; level?: number; xp?: number; coroas?: number; created_at?: string }[];
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
  presence = new Map<string, number>();
  now = () => Date.now();
  feedbackRows: FeedbackRow[] = [];
  async addFeedback(r: { user_id: string; kind: FeedbackKind; text: string; match_id: string | null; ctx: string }) { this.feedbackRows.push({ ...r, id: this.feedbackRows.length + 1, created_at: new Date(this.now()).toISOString(), done: false }); }
  async feedbackBy(userId: string, sinceMs: number) { return this.feedbackRows.filter(r => r.user_id === userId && Date.parse(r.created_at) >= sinceMs).length; }
  async feedbackDone(id: number) { const r = this.feedbackRows.find(x => x.id === id); if (r) r.done = true; }
  dailyRows = new Map<string, { bot_coroas: number; first_win: boolean }>();
  async dailyGet(userId: string, day: string) { return { ...(this.dailyRows.get(`${userId}|${day}`) ?? { bot_coroas: 0, first_win: false }) }; }
  async dailyPut(userId: string, day: string, d: { bot_coroas: number; first_win: boolean }) { this.dailyRows.set(`${userId}|${day}`, { ...d }); }
  rooms: RoomRow[] = [];
  async roomPut(row: RoomRow) { this.rooms = this.rooms.filter(r => r.host !== row.host && r.code !== row.code); this.rooms.push(clone(row)); }
  async roomGet(code: string) { const r = this.rooms.find(x => x.code === code); return r ? clone(r) : null; }
  async roomOfHost(host: string) { const r = this.rooms.find(x => x.host === host); return r ? clone(r) : null; }
  async roomTake(code: string) { const i = this.rooms.findIndex(x => x.code === code); return i === -1 ? null : this.rooms.splice(i, 1)[0]; }
  async roomDeleteByHost(host: string) { this.rooms = this.rooms.filter(r => r.host !== host); }
  bans = new Map<string, { reason: string; banned_at: string }>();
  reports: ReportRow[] = [];
  async isBanned(userId: string) { return this.bans.has(userId); }
  async ban(userId: string, reason: string) { this.bans.set(userId, { reason, banned_at: new Date(this.now()).toISOString() }); this.queue = this.queue.filter(q => q.user_id !== userId); }
  async unban(userId: string) { this.bans.delete(userId); }
  async addReport(r: { reporter: string; reported: string; match_id: string | null; reason: ReportReason; note: string }) {
    if (r.match_id && this.reports.some(x => x.reporter === r.reporter && x.match_id === r.match_id)) return false;
    this.reports.push({ ...r, id: this.reports.length + 1, created_at: new Date(this.now()).toISOString() }); return true;
  }
  async deleteAccount(userId: string) {
    const t = this.tables;
    t.profiles = t.profiles.filter(p => p.id !== userId); t.collection = t.collection.filter(r => r.user_id !== userId);
    this.queue = this.queue.filter(q => q.user_id !== userId); this.rooms = this.rooms.filter(r => r.host !== userId); this.presence.delete(userId); this.bans.delete(userId); this.rankedRows.delete(userId);
    this.reports = this.reports.filter(r => r.reporter !== userId && r.reported !== userId);
    this.matches.forEach(m => { if (m.seat0 === userId) m.seat0 = null; if (m.seat1 === userId) m.seat1 = null; });
  }
  async reportsBy(reporter: string, sinceMs: number) { return this.reports.filter(r => r.reporter === reporter && Date.parse(r.created_at) >= sinceMs).length; }
  presenceDays = new Set<string>();   // `${user}|${day}`
  async presenceTouch(userId: string) { this.presence.set(userId, this.now()); this.presenceDays.add(`${userId}|${dayKey(this.now())}`); }
  async adminOverview(nowMs: number, onlineMs: number): Promise<AdminOverview> {
    const day = 864e5, at = (p: { created_at?: string }) => (p.created_at ? Date.parse(p.created_at) : nowMs);
    const ps = [...this.tables.profiles].sort((a, b) => at(b) - at(a));
    const active = this.matches.filter(m => m.status === 'active');
    return {
      accounts: ps.length, newToday: ps.filter(p => nowMs - at(p) < day).length, newWeek: ps.filter(p => nowMs - at(p) < 7 * day).length,
      recent: ps.slice(0, 15).map(p => ({ username: p.username, created_at: p.created_at ?? new Date(nowMs).toISOString() })),
      online: [...this.presence.values()].filter(t => nowMs - t < onlineMs).length,
      waitingCasual: this.queue.filter(q => !q.ranked).length, waitingRanked: this.queue.filter(q => q.ranked).length,
      playingCasual: active.filter(m => m.bot_seat === null && !m.ranked).length, playingRanked: active.filter(m => m.bot_seat === null && m.ranked).length,
      vsBot: active.filter(m => m.bot_seat !== null).length, matches24h: this.matches.filter(m => nowMs - Date.parse(m.created_at) < day).length,
      windows: windowsOf(nowMs, [...this.presence.values()]), dailyTracked: true,
      daily: lastDays(nowMs).map(day => ({ day, active: [...this.presenceDays].filter(k => k.endsWith('|' + day)).length,
        newAccounts: ps.filter(p => dayKey(at(p)) === day).length, matches: this.matches.filter(m => dayKey(Date.parse(m.created_at)) === day).length })),
      ...buildAdminPlayers(nowMs, onlineMs, this.tables.profiles, this.presence,
        new Map([...this.rankedRows.entries()].map(([id, r]) => [id, { points: r.points, games: r.games, wins: r.wins, losses: r.losses }])),
        this.tables.collection.reduce((m, r) => m.set(r.user_id, (m.get(r.user_id) ?? 0) + r.copies), new Map<string, number>()),
        (() => { const b = new Map<string, 'queue' | 'casual' | 'ranked' | 'bot'>(); this.queue.forEach(q => b.set(q.user_id, 'queue'));
          active.forEach(m => ([m.seat0, m.seat1] as (string | null)[]).forEach(u => { if (u) b.set(u, m.bot_seat !== null ? 'bot' : m.ranked ? 'ranked' : 'casual'); })); return b; })(), new Set(this.bans.keys())),
      feedback: buildAdminFeedback(this.feedbackRows, id => this.tables.profiles.find(p => p.id === id)?.username ?? '?'),
      ...buildAdminReports(this.reports, [...this.bans.entries()].map(([user_id, v]) => ({ user_id, ...v })), id => this.tables.profiles.find(p => p.id === id)?.username ?? '?'),
    };
  }
  rankedRows = new Map<string, RankedProfile>();
  seasonRows: SeasonRow[] = [];
  seasonOffset = 0;
  async seasonOffsetDays() { return this.seasonOffset; }
  async queueTake(excludeUserId: string, ranked: boolean) {
    const i = this.queue.findIndex(q => q.user_id !== excludeUserId && !!q.ranked === ranked);
    return i === -1 ? null : this.queue.splice(i, 1)[0];
  }
  async queueWaiting(excludeUserId: string, ranked: boolean) { return this.queue.filter(q => q.user_id !== excludeUserId && !!q.ranked === ranked).map(q => ({ ...q })); }
  async queueTakeUser(userId: string) {
    const i = this.queue.findIndex(q => q.user_id === userId);
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
  async rankedProfile(userId: string) { const r = this.rankedRows.get(userId); return r ? { ...r } : null; }
  async rankedSettle(matchId: string, rows: { user_id: string; profile: RankedProfile }[]) {
    const m = this.matches.find(x => x.id === matchId);
    if (!m || m.ranked_done) return false;
    m.ranked_done = true;
    rows.forEach(r => this.rankedRows.set(r.user_id, { ...r.profile }));
    return true;
  }
  async rankedTop(limit: number, season: number) {
    return [...this.rankedRows.entries()].filter(([, r]) => (r.season ?? 1) === season).sort((a, b) => b[1].points - a[1].points).slice(0, limit).map(([user_id, profile]) => {
      const p = this.tables.profiles.find(x => x.id === user_id);
      return { user_id, username: p?.username ?? 'Jogador', avatar_id: p?.avatar_id ?? 'batedora', profile: { ...profile } };
    });
  }
  async rankedPosition(points: number, season: number) { return 1 + [...this.rankedRows.values()].filter(r => (r.season ?? 1) === season && r.points > points).length; }
  async rankedCloseSeason(userId: string, row: SeasonRow, next: RankedProfile) {
    const cur = this.rankedRows.get(userId);
    if (!cur || (cur.season ?? 1) !== row.season) return false;
    if (!this.seasonRows.some(x => x.user_id === userId && x.season === row.season)) this.seasonRows.push({ ...row, user_id: userId, claimed: false });
    this.rankedRows.set(userId, { ...next });
    return true;
  }
  async rankedPairCount(a: string, b: string, sinceMs: number, exceptMatchId: string) {
    return this.matches.filter(m => m.ranked && m.status === 'finished' && m.id !== exceptMatchId && Date.parse(m.created_at) >= sinceMs
      && ((m.seat0 === a && m.seat1 === b) || (m.seat0 === b && m.seat1 === a))).length;
  }
  async rankedSeasons(userId: string) { return this.seasonRows.filter(x => x.user_id === userId).sort((a, b) => b.season - a.season).slice(0, 6).map(x => ({ ...x })); }
  async rankedClaim(userId: string, season: number) {
    const row = this.seasonRows.find(x => x.user_id === userId && x.season === season && !x.claimed);
    const prof = this.tables.profiles.find(x => x.id === userId);
    if (!row || !prof) return null;
    row.claimed = true;
    prof.coroas = (prof.coroas ?? 150) + row.coroas;
    return { coroas: row.coroas, coroas_after: prof.coroas };
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
