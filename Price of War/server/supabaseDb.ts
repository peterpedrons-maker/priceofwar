// The Db on Supabase (Postgres), used by the Edge Function with the service-role key. Tables and the queue_take /
// apply_match_rewards functions are created by docs/supabase-online.sql and docs/supabase-online-2.sql.
import type { Seat } from '../src/engine/types';
import type { Db, EmoteRow, MatchRow, QueueRow, RewardRow, StepRow, ViewRow } from './types';

// Only the tiny part of the supabase-js client this file touches.
type Client = any;

const must = <T,>(r: { data: T; error: any }, what: string): T => {
  if (r.error) throw new Error(`${what}: ${r.error.message ?? r.error}`);
  return r.data;
};

const viewToDb = (matchId: string, v: ViewRow) => ({
  match_id: matchId, n: v.n, viewer: v.viewer, viewer_user: v.user, actor: v.actor, action: v.action, events: v.events, state: v.state, deadline: v.deadline,
});
const viewFromDb = (r: any): ViewRow => ({ n: r.n, viewer: r.viewer, user: r.viewer_user, actor: r.actor, action: r.action, events: r.events, state: r.state, deadline: r.deadline === null ? null : Number(r.deadline) });
const matchFromDb = (r: any): MatchRow => ({ ...r, turn_deadline: r.turn_deadline === null || r.turn_deadline === undefined ? null : Number(r.turn_deadline), timeouts: r.timeouts ?? [0, 0] });

export const supabaseDb = (c: Client): Db => ({
  async collection(userId) {
    const rows = must(await c.from('collection').select('card_name, copies').eq('user_id', userId).limit(5000), 'collection') as { card_name: string; copies: number }[];
    const out: Record<string, number> = {};
    rows.forEach(r => { out[r.card_name] = r.copies; });
    return out;
  },
  async profile(userId) {
    return must(await c.from('profiles').select('username, avatar_id, level, xp, coroas').eq('id', userId).maybeSingle(), 'profile');
  },
  async queueTake(excludeUserId) {
    const rows = must(await c.rpc('queue_take', { p_me: excludeUserId }), 'queue_take') as QueueRow[] | null;
    return rows && rows.length ? rows[0] : null;
  },
  async queueGet(userId) {
    return must(await c.from('queue').select('user_id, deck, created_at').eq('user_id', userId).maybeSingle(), 'queue get');
  },
  async queuePut(row) {
    must(await c.from('queue').upsert({ user_id: row.user_id, deck: row.deck, created_at: row.created_at }), 'queue put');
  },
  async queueDelete(userId) {
    must(await c.from('queue').delete().eq('user_id', userId), 'queue delete');
  },
  async createMatch(row, steps, views) {
    const m = matchFromDb(must(await c.from('matches').insert(row).select('*').single(), 'create match'));
    if (steps.length) must(await c.from('match_steps').insert(steps.map(s => ({ match_id: m.id, n: s.n, seat: s.seat, action: s.action }))), 'create steps');
    if (views.length) must(await c.from('match_views').insert(views.map(v => viewToDb(m.id, v))), 'create views');
    return m;
  },
  async getMatch(id) {
    const r = must(await c.from('matches').select('*').eq('id', id).maybeSingle(), 'get match');
    return r ? matchFromDb(r) : null;
  },
  async activeMatchOf(userId) {
    const rows = must(await c.from('matches').select('*').eq('status', 'active').or(`seat0.eq.${userId},seat1.eq.${userId}`).order('created_at', { ascending: false }).limit(1), 'active match') as any[];
    return rows.length ? matchFromDb(rows[0]) : null;
  },
  async saveMatch(id, expected, patch, newSteps, newViews) {
    // Steps first (the unique key (match_id, n) makes two writers collide instead of both succeeding), then
    // the compare-and-swap on the match row.
    if (newSteps.length) {
      const ins = await c.from('match_steps').insert(newSteps.map(s => ({ match_id: id, n: s.n, seat: s.seat, action: s.action })));
      if (ins.error) return false;
    }
    const upd = must(await c.from('matches').update({
      state: patch.state, steps_count: patch.steps_count, status: patch.status, winner: patch.winner,
      turn_deadline: patch.turn_deadline, timeouts: patch.timeouts, end_reason: patch.end_reason,
    }).eq('id', id).eq('steps_count', expected).select('id'), 'save match') as { id: string }[];
    if (upd.length === 0) {
      if (newSteps.length) await c.from('match_steps').delete().eq('match_id', id).in('n', newSteps.map(s => s.n));
      return false;
    }
    if (newViews.length) must(await c.from('match_views').upsert(newViews.map(v => viewToDb(id, v)), { onConflict: 'match_id,viewer,n' }), 'save views');
    return true;
  },
  async steps(matchId, sinceN) {
    return must(await c.from('match_steps').select('n, seat, action').eq('match_id', matchId).gt('n', sinceN).order('n', { ascending: true }), 'steps') as StepRow[];
  },
  async views(matchId, viewer: Seat, sinceN) {
    const rows = must(await c.from('match_views').select('n, viewer, viewer_user, actor, action, events, state, deadline').eq('match_id', matchId).eq('viewer', viewer).gt('n', sinceN).order('n', { ascending: true }), 'views') as any[];
    return rows.map(viewFromDb);
  },
  async latestView(matchId, viewer: Seat) {
    const rows = must(await c.from('match_views').select('n, viewer, viewer_user, actor, action, events, state, deadline').eq('match_id', matchId).eq('viewer', viewer).order('n', { ascending: false }).limit(1), 'latest view') as any[];
    return rows.length ? viewFromDb(rows[0]) : null;
  },
  async addEmote(matchId, seat: Seat, code, at) {
    const r = must(await c.from('match_emotes').insert({ match_id: matchId, seat, code, at }).select('id, seat, code, at').single(), 'add emote') as any;
    return { id: Number(r.id), seat: r.seat, code: r.code, at: Number(r.at) } as EmoteRow;
  },
  async emotesSince(matchId, sinceId) {
    const rows = must(await c.from('match_emotes').select('id, seat, code, at').eq('match_id', matchId).gt('id', sinceId).order('id', { ascending: true }).limit(200), 'emotes') as any[];
    return rows.map(r => ({ id: Number(r.id), seat: r.seat, code: r.code, at: Number(r.at) }));
  },
  async applyRewards(matchId, rows: RewardRow[]) {
    return must(await c.rpc('apply_match_rewards', { p_match: matchId, p_rows: rows }), 'apply rewards') === true;
  },
});
