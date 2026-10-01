// Checks of the game server's logic (matchmaking, validation, bot seat) on an in-memory database:
//   npx tsx tests/online-server.ts
import { aiNextAction } from '../src/engine/ai';
import { DECK_RECIPES } from '../src/engine/catalog';
import { applyAction, createMatch } from '../src/engine/game';
import type { Action, Seat } from '../src/engine/types';
import { handleGame, type GameConfig, type GameResponse, type MatchInit } from '../server/handler';
import { MemoryDb } from '../server/memoryDb';

let passed = 0, failed = 0;
const test = async (name: string, fn: () => Promise<void>) => {
  try { await fn(); passed++; } catch (e) { failed++; console.log(`  ✗ ${name}\n      ${(e as Error).message}`); }
};
const ok = (c: boolean, msg: string) => { if (!c) throw new Error(msg); };
const eq = (a: unknown, b: unknown, msg = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };

let clock = 1_700_000_000_000;
let rngState = 7;
const cfg: GameConfig = { botAfterMs: 15000, now: () => clock, random: () => { rngState = (rngState * 1103515245 + 12345) & 0x7fffffff; return rngState / 0x7fffffff; } };

const fresh = () => {
  const db = new MemoryDb();
  const addUser = (id: string, name: string, deck: 'cardeal' | 'capitao' = 'cardeal') => {
    db.tables.profiles.push({ id, username: name, avatar_id: 'batedora' });
    Object.entries(DECK_RECIPES[deck].cards).forEach(([card, copies]) => db.tables.collection.push({ user_id: id, card_name: card, copies }));
    db.tables.collection.push({ user_id: id, card_name: DECK_RECIPES[deck].general, copies: 1 });
  };
  addUser('A', 'Alice'); addUser('B', 'Bruno', 'capitao');
  return db;
};
// The prebuilt Capitão list has 62 cards; a player's deck is at most 60, so trim two copies off.
const deckOf = (d: 'cardeal' | 'capitao') => {
  const cards = { ...DECK_RECIPES[d].cards };
  let extra = Object.values(cards).reduce((a, n) => a + n, 0) - 60;
  for (const name of Object.keys(cards)) { while (extra > 0 && cards[name] > 1) { cards[name]--; extra--; } }
  return { cards, general: DECK_RECIPES[d].general };
};
const matched = (r: GameResponse): MatchInit => { if (r.ok !== true || r.status !== 'matched') throw new Error('not matched: ' + JSON.stringify(r)); return r.match; };

(async () => {
  await test('deck rules are enforced on the server (size, copies, ownership)', async () => {
    const db = fresh();
    const small = await handleGame(db, 'A', { op: 'queue', cards: { 'Soldados da Ordem': 2 }, general: DECK_RECIPES.cardeal.general }, cfg);
    ok(small.ok === false && /Faltam/.test(small.error), 'too small: ' + JSON.stringify(small));
    const notMine = await handleGame(db, 'A', { op: 'queue', ...deckOf('capitao') }, cfg);   // Alice only owns the Cardeal cards
    ok(notMine.ok === false && /não tem/.test(notMine.error), 'not owned: ' + JSON.stringify(notMine));
    const cheat = await handleGame(db, 'A', { op: 'queue', cards: { ...deckOf('cardeal').cards, 'Cavaleiro da Luz': 9 }, general: DECK_RECIPES.cardeal.general }, cfg);
    ok(cheat.ok === false, 'too many copies');
  });

  await test('two players queue, get matched into the same match on different seats', async () => {
    const db = fresh();
    const a = await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    eq([a.ok, a.ok && a.status], [true, 'waiting']);
    eq(((await handleGame(db, 'A', { op: 'status' }, cfg)) as any).status, 'waiting');
    const mb = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
    const ma = matched(await handleGame(db, 'A', { op: 'status' }, cfg));
    eq(ma.id, mb.id);
    ok(ma.seat !== mb.seat, 'different seats');
    eq([ma.opponent.name, mb.opponent.name], ['Bruno', 'Alice']);
    eq([ma.steps.length, ma.steps[0].action.type], [1, 'begin']);
    eq(ma.decks[ma.seat].general, DECK_RECIPES.cardeal.general);
    eq(db.queue.length, 0);
  });

  await test('a whole match played through the server; its steps replay to the stored state', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    const init = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
    const userOf = (seat: Seat) => (db.matches[0].seat0 && seat === 0 ? db.matches[0].seat0 : db.matches[0].seat1)!;
    let rejected = 0;
    for (let i = 0; i < 400; i++) {
      const m = db.matches[0];
      if (m.status === 'finished') break;
      const mover = (m.state.pending ? m.state.pending.seat : m.state.turn.active) as Seat;
      const action = aiNextAction(m.state, mover, () => 0.43);
      const r = await handleGame(db, userOf(mover), { op: 'act', matchId: init.id, action }, cfg);
      if (r.ok === false) { rejected++; break; }
    }
    eq(rejected, 0, 'server rejected a legal action');
    const m = db.matches[0];
    ok(m.steps_count > 30, 'played a real match: ' + m.steps_count);
    // replay exactly what a client would: create the match, apply every step in order
    let s = createMatch({ seed: m.seed, decks: m.decks, first: m.first }).state;
    for (const st of await db.steps(m.id, 0)) { const r = applyAction(s, st.seat, st.action); if (r.ok === false) throw new Error('replay refused step ' + st.n + ': ' + r.error); s = r.state; }
    eq(JSON.stringify(s), JSON.stringify(m.state), 'replayed state');
  });

  await test('the server refuses cheats: acting out of turn, as a stranger, begin, after the end', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    const init = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
    const m = db.matches[0];
    const idle = (m.state.turn.active === 0 ? m.seat1 : m.seat0)!;   // the player whose turn it is NOT
    const active = (m.state.turn.active === 0 ? m.seat0 : m.seat1)!;
    const r1 = await handleGame(db, idle, { op: 'act', matchId: init.id, action: { type: 'advance' } }, cfg);
    ok(r1.ok === false && /turno/.test(r1.error), 'out of turn: ' + JSON.stringify(r1));
    const r2 = await handleGame(db, 'Z', { op: 'act', matchId: init.id, action: { type: 'advance' } }, cfg);
    ok(r2.ok === false, 'stranger');
    const r3 = await handleGame(db, active, { op: 'act', matchId: init.id, action: { type: 'begin' } }, cfg);
    ok(r3.ok === false, 'client cannot send begin');
    const r4 = await handleGame(db, active, { op: 'act', matchId: init.id, action: { type: 'play', cardId: 'made-up', slot: 1 } }, cfg);
    ok(r4.ok === false, 'made-up card');
    eq(db.matches[0].steps_count, 1, 'nothing was recorded for refused actions');
    const r5 = await handleGame(db, active, { op: 'act', matchId: init.id, action: { type: 'concede' } }, cfg);
    ok(r5.ok === true && r5.status === 'acted' && r5.finished, 'concede ends the match');
    const r6 = await handleGame(db, active, { op: 'act', matchId: init.id, action: { type: 'advance' } }, cfg);
    ok(r6.ok === false && /terminou/.test(r6.error), 'after the end');
  });

  await test('vs bot: the bot seat plays by itself through the same server and keeps a record', async () => {
    const db = fresh();
    const init = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true }, cfg));
    eq(init.opponent.bot, true);
    let m = db.matches[0];
    eq(m.bot_seat === 0 ? m.seat0 : m.seat1, null);
    // whoever opens, a human can always act when it is their move: play 25 of their own actions
    let human = 0;
    for (let i = 0; i < 300 && db.matches[0].status === 'active' && human < 25; i++) {
      m = db.matches[0];
      const mover = (m.state.pending ? m.state.pending.seat : m.state.turn.active) as Seat;
      ok(mover !== m.bot_seat, 'server left the bot with a move to make');
      const action = aiNextAction(m.state, mover, () => 0.43);
      const r = await handleGame(db, 'A', { op: 'act', matchId: init.id, action }, cfg);
      ok(r.ok === true, 'human action refused: ' + JSON.stringify(r));
      human++;
    }
    const steps = await db.steps(init.id, 0);
    ok(steps.some(s => s.seat === db.matches[0].bot_seat), 'bot steps were recorded');
    ok(steps.every((s, i) => s.n === i + 1), 'steps are numbered 1..n');
  });

  await test('nobody to play with: after the wait the bot takes the other chair', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    clock += 5000;
    eq(((await handleGame(db, 'A', { op: 'status' }, cfg)) as any).status, 'waiting');
    clock += 11000;
    const init = matched(await handleGame(db, 'A', { op: 'status' }, cfg));
    eq(init.opponent.bot, true);
    eq(db.queue.length, 0);
  });

  await test('cancel leaves the queue; asking to queue again during a match resumes it', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    await handleGame(db, 'A', { op: 'cancel' }, cfg);
    eq(db.queue.length, 0);
    const first = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true }, cfg));
    const again = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg));
    eq(again.id, first.id);
    eq(db.matches.length, 1);
  });

  await test('backing out just as a match was made ends it instead of leaving it waiting', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    const mb = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
    await handleGame(db, 'A', { op: 'cancel' }, cfg);            // A never saw the match
    eq(db.matches[0].status, 'finished');
    eq(db.matches[0].winner, mb.seat, 'B (still there) wins');
    const again = await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    eq([again.ok && again.status], ['waiting']);                   // A is not thrown back into the dead match
  });

  await test('two writers at once: only one wins the compare-and-swap', async () => {
    const db = fresh();
    const init = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true }, cfg));
    const m = (await db.getMatch(init.id))!;
    const a = await db.saveMatch(m.id, m.steps_count, { state: m.state, steps_count: m.steps_count + 1, status: 'active', winner: null }, [{ n: m.steps_count + 1, seat: 0, action: { type: 'advance' } as Action }]);
    const b = await db.saveMatch(m.id, m.steps_count, { state: m.state, steps_count: m.steps_count + 1, status: 'active', winner: null }, [{ n: m.steps_count + 1, seat: 1, action: { type: 'advance' } as Action }]);
    eq([a, b], [true, false]);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
