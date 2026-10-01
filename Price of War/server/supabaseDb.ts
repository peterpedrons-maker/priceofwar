// The Db on Supabase (Postgres), used by the Edge Function with the service-role key. Tables and the queue_take
// function are created by docs/supabase-online.sql.
import type { Db, MatchRow, QueueRow, StepRow } from './types';

// Only the tiny part of the supabase-js client this file touches.
type Client = any;

const must = <T,>(r: { data: T; error: any }, what: string): T => {
  if (r.error) throw new Error(`${what}: ${r.error.message ?? r.error}`);
  return r.data;
};

export const supabaseDb = (c: Client): Db => ({
  async collection(userId) {
    const rows = must(await c.from('collection').select('card_name, copies').eq('user_id', userId), 'collection') as { card_name: string; copies: number }[];
    const out: Record<string, number> = {};
    rows.forEach(r => { out[r.card_name] = r.copies; });
    return out;
  },
  async profile(userId) {
    return must(await c.from('profiles').select('username, avatar_id').eq('id', userId).maybeSingle(), 'profile');
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
  async createMatch(row, steps) {
    const m = must(await c.from('matches').insert(row).select('*').single(), 'create match') as MatchRow;
    if (steps.length) must(await c.from('match_steps').insert(steps.map(s => ({ match_id: m.id, n: s.n, seat: s.seat, action: s.action }))), 'create steps');
    return m;
  },
  async getMatch(id) {
    return must(await c.from('matches').select('*').eq('id', id).maybeSingle(), 'get match') as MatchRow | null;
  },
  async activeMatchOf(userId) {
    const rows = must(await c.from('matches').select('*').eq('status', 'active').or(`seat0.eq.${userId},seat1.eq.${userId}`).order('created_at', { ascending: false }).limit(1), 'active match') as MatchRow[];
    return rows.length ? rows[0] : null;
  },
  async saveMatch(id, expected, patch, newSteps) {
    // Steps first (the unique key (match_id, n) makes two writers collide instead of both succeeding), then
    // the compare-and-swap on the match row.
    if (newSteps.length) {
      const ins = await c.from('match_steps').insert(newSteps.map(s => ({ match_id: id, n: s.n, seat: s.seat, action: s.action })));
      if (ins.error) return false;
    }
    const upd = must(await c.from('matches').update({ state: patch.state, steps_count: patch.steps_count, status: patch.status, winner: patch.winner })
      .eq('id', id).eq('steps_count', expected).select('id'), 'save match') as { id: string }[];
    if (upd.length === 0) {
      if (newSteps.length) await c.from('match_steps').delete().eq('match_id', id).in('n', newSteps.map(s => s.n));
      return false;
    }
    return true;
  },
  async steps(matchId, sinceN) {
    return must(await c.from('match_steps').select('n, seat, action').eq('match_id', matchId).gt('n', sinceN).order('n', { ascending: true }), 'steps') as StepRow[];
  },
});
