// Checks of the game server's logic (matchmaking, validation, hidden information, turn clock, rewards, bot seat)
// on an in-memory database:   npx tsx tests/online-server.ts
import { aiNextAction } from '../src/engine/ai';
import { DECK_RECIPES } from '../src/engine/catalog';
import { applyAction, createMatch } from '../src/engine/game';
import { applyReward, rewardFor } from '../src/engine/rewards';
import type { Action, Seat } from '../src/engine/types';
import { viewFor } from '../src/engine/view';
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
const cfg: GameConfig = {
  botAfterMs: 15000, turnMs: 100000, promptMs: 40000, maxTimeouts: 2, now: () => clock,
  random: () => { rngState = (rngState * 1103515245 + 12345) & 0x7fffffff; return rngState / 0x7fffffff; },
};

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

const userOf = (db: MemoryDb, seat: Seat) => (seat === 0 ? db.matches[0].seat0 : db.matches[0].seat1)!;
// The toss winner's choice, sent like a client would. `m.first` is the winner's chair.
const choose = async (db: MemoryDb, goFirst: boolean) => handleGame(db, userOf(db, db.matches[0].first), { op: 'act', matchId: db.matches[0].id, action: { type: 'choose_first', goFirst } }, cfg);
// A match against the bot, opened: when a person won the toss they go first (a bot that won already chose).
const botMatch = async (db: MemoryDb) => {
  const init = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true }, cfg));
  if (db.matches[0].steps_count === 0) { const r = await choose(db, true); ok(r.ok === true, 'choice accepted: ' + JSON.stringify(r)); }
  return init;
};
// A match between two people. By default the toss winner chooses to go first, so it is ready to play;
// `choice: null` leaves it waiting for the choice.
const pvp = async (db: MemoryDb, choice: boolean | null = true) => {
  await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
  const b = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
  const a = matched(await handleGame(db, 'A', { op: 'status' }, cfg));
  if (choice !== null) { const r = await choose(db, choice); ok(r.ok === true, 'choice accepted: ' + JSON.stringify(r)); }
  return { a, b, id: a.id };
};
// Plays the match with the AI choosing for whoever has to move, through the server, until `stop` says so.
const drive = async (db: MemoryDb, id: string, stop: (m: ReturnType<MemoryDb['matches']['at']> & object) => boolean, limit = 800) => {
  for (let i = 0; i < limit; i++) {
    const m = db.matches[0];
    if (m.status === 'finished' || stop(m)) return;
    const mover = (m.state.pending ? m.state.pending.seat : m.state.turn.active) as Seat;
    if (mover === m.bot_seat) throw new Error('the server left the bot with a move to make');
    const r = await handleGame(db, userOf(db, mover), { op: 'act', matchId: id, action: aiNextAction(m.state, mover, () => 0.43) }, cfg);
    if (r.ok === false) throw new Error('server rejected a legal action: ' + r.error);
  }
};

(async () => {
  await test('deck rules are enforced on the server (size, copies, ownership)', async () => {
    const db = fresh();
    const small = await handleGame(db, 'A', { op: 'queue', cards: { 'Soldados da Ordem': 2 }, general: DECK_RECIPES.cardeal.general }, cfg);
    ok(small.ok === false && /Faltam/.test(small.error), 'too small: ' + JSON.stringify(small));
    const notMine = await handleGame(db, 'A', { op: 'queue', ...deckOf('capitao') }, cfg);
    ok(notMine.ok === false && /não tem/.test(notMine.error), 'not owned: ' + JSON.stringify(notMine));
    const cheat = await handleGame(db, 'A', { op: 'queue', cards: { ...deckOf('cardeal').cards, 'Cavaleiro da Luz': 9 }, general: DECK_RECIPES.cardeal.general }, cfg);
    ok(cheat.ok === false, 'too many copies');
  });

  await test('queue: two players are matched; each gets only their own view (no seed, no opponent deck or hand)', async () => {
    const db = fresh();
    const { a, b } = await pvp(db, null);
    eq(a.id, b.id);
    ok(a.iWonToss !== b.iWonToss, 'exactly one wins the toss');
    eq([a.chosen, b.chosen, a.rows.length, b.rows.length], [false, false, 0, 0], 'nothing happens until the winner chooses');
    ok(db.matches[0].turn_deadline !== null && db.matches[0].turn_deadline! > clock, 'the choice has a clock');
    ok(a.mySide !== b.mySide && [a.mySide, b.mySide].includes('cara') && [a.mySide, b.mySide].includes('coroa'), 'one is Cara, the other Coroa');
    eq([a.opponent.name, b.opponent.name], ['Bruno', 'Alice']);
    eq(a.myDeck.general, DECK_RECIPES.cardeal.general);
    eq(a.opponentGeneral, DECK_RECIPES.capitao.general);
    for (const init of [a, b]) {
      ok(!('seed' in init) && !('decks' in init), 'no seed / decks in what a player receives');
      ok(init.start.players[1].hand.every(c => c.hidden) && init.start.players[0].hand.every(c => !c.hidden), 'start view: own hand shown, opponent hand hidden');
      eq(init.start.players[0].hand.length, 7);
    }
    eq(db.queue.length, 0);
    // the winner chooses to go first: choose_first then begin, both by the winner
    const winner = a.iWonToss ? 'A' : 'B';
    const r = await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'choose_first', goFirst: true } }, cfg);
    ok(r.ok === true && r.status === 'acted', 'choice accepted');
    for (const user of ['A', 'B']) {
      const rows = await db.views(a.id, user === 'A' ? (db.matches[0].seat0 === 'A' ? 0 : 1) : (db.matches[0].seat0 === 'B' ? 0 : 1), 0);
      eq(rows.map(x => x.action.type), ['choose_first', 'begin']);
      eq(rows.map(x => x.actor === 0), user === winner ? [true, true] : [false, false]);
      ok(rows[1].deadline !== null, 'the turn clock started');
    }
  });

  await test('the toss winner chooses to go second: the other player opens the match; only the winner may choose, once', async () => {
    const db = fresh();
    const { a, b } = await pvp(db, null);
    const loser = a.iWonToss ? 'B' : 'A';
    const winner = a.iWonToss ? 'A' : 'B';
    const m = db.matches[0];
    const no = await handleGame(db, loser, { op: 'act', matchId: a.id, action: { type: 'choose_first', goFirst: true } }, cfg);
    ok(no.ok === false && /moeda/.test(no.error), 'the loser cannot choose: ' + JSON.stringify(no));
    const early = await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'advance' } }, cfg);
    ok(early.ok === false, 'nothing else before the choice');
    eq(db.matches[0].steps_count, 0, 'refusals record nothing');
    const r = await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'choose_first', goFirst: false } }, cfg);
    ok(r.ok === true, 'accepted');
    const after = db.matches[0];
    ok(after.state.turn.started && after.state.turn.first === (m.first === 0 ? 1 : 0) && after.state.turn.active === after.state.turn.first, 'the other chair goes first');
    eq(after.first, m.first, 'the stored toss winner does not change');
    const again = await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'choose_first', goFirst: true } }, cfg);
    ok(again.ok === false, 'no second choice: ' + JSON.stringify(again));
    // the first player can play; the winner (second) cannot yet
    const firstUser = after.state.turn.first === 0 ? after.seat0! : after.seat1!;
    ok((await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'advance' } }, cfg)).ok === false, 'not the winner\'s turn');
    ok((await handleGame(db, firstUser, { op: 'act', matchId: a.id, action: { type: 'advance' } }, cfg)).ok === true, 'the first player acts');
    // a player's own init after the choice
    const initWinner = matched(await handleGame(db, winner, { op: 'queue', ...deckOf('cardeal') }, cfg));
    eq([initWinner.iWonToss, initWinner.iGoFirst, initWinner.chosen], [true, false, true]);
    void b;
  });

  await test('the toss winner lets the clock run out: the match opens with them going first, no forfeit', async () => {
    const db = fresh();
    const { id, a } = await pvp(db, null);
    const winner = a.iWonToss ? 'A' : 'B';
    const loser = a.iWonToss ? 'B' : 'A';
    clock += 41000;
    const t = await handleGame(db, loser, { op: 'tick', matchId: id, since: 0 }, cfg);
    ok(t.ok === true && t.status === 'acted', 'tick ok');
    const m = db.matches[0];
    ok(m.status === 'active' && m.state.turn.started && m.state.turn.first === m.first, 'opened with the winner first');
    eq(m.timeouts[m.first], 1);
    ok(m.turn_deadline! > clock, 'fresh turn clock');
    eq((await db.steps(id, 0)).map(x => x.action.type), ['choose_first', 'begin']);
    void winner;
  });

  await test('a bot that wins the toss chooses at random and the match opens at once', async () => {
    const seen = new Set<boolean>();
    let botWon = 0;
    for (let i = 0; i < 40; i++) {
      const db = fresh();
      const init = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true }, cfg));
      const m = db.matches[0];
      if (m.first === m.bot_seat) {
        botWon++;
        ok(init.chosen && m.state.turn.started, 'opened by the bot');
        seen.add(m.state.turn.first === m.bot_seat);
      } else {
        ok(!init.chosen && m.steps_count === 0 && init.rows.length === 0, 'waits for the human');
        ok(init.iWonToss, 'the human won the toss');
      }
    }
    ok(botWon > 5 && botWon < 35, 'the bot wins about half the tosses: ' + botWon);
    ok(seen.size === 2, 'sometimes it goes first, sometimes second');
  });

  await test('a whole match through the server: every view hides the other hand; steps replay to the stored state', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    await drive(db, id, () => false);
    const m = db.matches[0];
    ok(m.status === 'finished' && m.winner !== null && m.steps_count > 30, 'played to the end: ' + m.steps_count);
    // replay exactly what the record says
    let s = createMatch({ seed: m.seed, decks: m.decks, first: m.first }).state;
    for (const st of await db.steps(m.id, 0)) { const r = applyAction(s, st.seat, st.action); if (r.ok === false) throw new Error('replay refused step ' + st.n + ': ' + r.error); s = r.state; }
    eq(JSON.stringify(s), JSON.stringify(m.state), 'replayed state');
    for (const viewer of [0, 1] as Seat[]) {
      const rows = await db.views(m.id, viewer, 0);
      eq(rows.length, m.steps_count, 'a view for every step');
      ok(rows.every((r, i) => r.n === i + 1), 'numbered in order');
      ok(rows.every(r => r.state.players[1].hand.every(c => c.hidden && c.name === '') && r.state.players[1].drawPile.every(x => x === '') && r.state.players[0].drawPile.every(x => x === '')), `viewer ${viewer}: no hidden card or deck order in any state`);
      ok(rows.every(r => r.events.every(e => !(e.t === 'draw' && e.seat === 1) || (e as any).card.hidden)), `viewer ${viewer}: opponent draws hidden`);
      eq(JSON.stringify(rows[rows.length - 1].state), JSON.stringify(viewFor(m.state, viewer)), 'last view = the final state as that player sees it');
    }
  });

  await test('the server refuses cheats: out of turn, a stranger, begin, made-up cards, after the end', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    const m = db.matches[0];
    const idle = (m.state.turn.active === 0 ? m.seat1 : m.seat0)!;
    const active = (m.state.turn.active === 0 ? m.seat0 : m.seat1)!;
    const r1 = await handleGame(db, idle, { op: 'act', matchId: id, action: { type: 'advance' } }, cfg);
    ok(r1.ok === false && /turno/.test(r1.error), 'out of turn: ' + JSON.stringify(r1));
    ok((await handleGame(db, 'Z', { op: 'act', matchId: id, action: { type: 'advance' } }, cfg)).ok === false, 'stranger');
    ok((await handleGame(db, active, { op: 'act', matchId: id, action: { type: 'begin' } }, cfg)).ok === false, 'client cannot send begin');
    ok((await handleGame(db, active, { op: 'act', matchId: id, action: { type: 'play', cardId: 'made-up', slot: 1 } }, cfg)).ok === false, 'made-up card');
    eq(db.matches[0].steps_count, 2, 'nothing recorded for refused actions (only choose_first and begin)');
    const r5 = await handleGame(db, active, { op: 'act', matchId: id, action: { type: 'concede' } }, cfg);
    ok(r5.ok === true && r5.status === 'acted' && r5.finished, 'concede ends the match');
    const r6 = await handleGame(db, active, { op: 'act', matchId: id, action: { type: 'advance' } }, cfg);
    ok(r6.ok === false && /terminou/.test(r6.error), 'after the end');
  });

  await test('vs bot: the bot seat plays through the same server; the human always has the move', async () => {
    const db = fresh();
    const init = await botMatch(db);
    eq(init.opponent.bot, true);
    const m0 = db.matches[0];
    eq(m0.bot_seat === 0 ? m0.seat0 : m0.seat1, null);
    let human = 0;
    for (let i = 0; i < 300 && db.matches[0].status === 'active' && human < 30; i++) {
      const m = db.matches[0];
      const mover = (m.state.pending ? m.state.pending.seat : m.state.turn.active) as Seat;
      ok(mover !== m.bot_seat, 'server left the bot with a move to make');
      const r = await handleGame(db, 'A', { op: 'act', matchId: init.id, action: aiNextAction(m.state, mover, () => 0.43) }, cfg);
      ok(r.ok === true, 'human action refused: ' + JSON.stringify(r));
      if (r.ok === true && r.status === 'acted') ok(r.rows.every(x => x.viewer === (m.seat0 === 'A' ? 0 : 1)), 'only my own views come back');
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

  await test('cancel leaves the queue; queueing again during a match resumes it (with the latest view only)', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    await handleGame(db, 'A', { op: 'cancel' }, cfg);
    eq(db.queue.length, 0);
    const first = await botMatch(db);
    // act a bit so the match is under way
    const m = db.matches[0];
    const mover = (m.state.pending ? m.state.pending.seat : m.state.turn.active) as Seat;
    await handleGame(db, 'A', { op: 'act', matchId: first.id, action: aiNextAction(m.state, mover, () => 0.4) }, cfg);
    const again = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg));
    eq(again.id, first.id);
    eq([again.resumed, again.rows.length, again.latest !== null], [true, 0, true]);
    eq(db.matches.length, 1);
  });

  await test('backing out just as a match was made ends it instead of leaving it waiting', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    const mb = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
    await handleGame(db, 'A', { op: 'cancel' }, cfg);
    eq(db.matches[0].status, 'finished');
    eq(db.matches[0].winner, db.matches[0].seat0 === 'B' ? 0 : 1, 'B (still there) wins');
    void mb;
    const again = await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    eq([again.ok && again.status], ['waiting']);
  });

  await test('two writers at once: only one wins the compare-and-swap', async () => {
    const db = fresh();
    const init = await botMatch(db);
    const m = (await db.getMatch(init.id))!;
    const patch = { state: m.state, steps_count: m.steps_count + 1, status: 'active' as const, winner: null, turn_deadline: m.turn_deadline, timeouts: m.timeouts, end_reason: null };
    const a = await db.saveMatch(m.id, m.steps_count, patch, [{ n: m.steps_count + 1, seat: 0, action: { type: 'advance' } as Action }], []);
    const b = await db.saveMatch(m.id, m.steps_count, patch, [{ n: m.steps_count + 1, seat: 1, action: { type: 'advance' } as Action }], []);
    eq([a, b], [true, false]);
  });

  await test('turn clock: the first time out passes the turn for you, the second forfeits the match', async () => {
    const db = fresh();
    const init = await botMatch(db);
    const mySeat: Seat = db.matches[0].seat0 === 'A' ? 0 : 1;
    ok(db.matches[0].turn_deadline !== null && db.matches[0].turn_deadline! > clock, 'a deadline is running');
    // it is my move (the bot has already played if it opened). let the clock run out.
    eq((db.matches[0].state.pending ? db.matches[0].state.pending.seat : db.matches[0].state.turn.active), mySeat);
    clock += 101000;
    const t1 = await handleGame(db, 'A', { op: 'tick', matchId: init.id, since: 0 }, cfg);
    ok(t1.ok === true && t1.status === 'acted', 'tick answered');
    const m1 = db.matches[0];
    eq(m1.timeouts[mySeat], 1);
    ok(m1.status === 'active', 'still playing after one timeout');
    if (t1.ok === true && t1.status === 'acted') ok(t1.rows.some(r => r.events.some(e => e.t === 'log' && /tempo acabou/i.test(e.text))), 'the player is told what happened');
    eq((m1.state.pending ? m1.state.pending.seat : m1.state.turn.active), mySeat, 'my move again (the bot played its turn)');
    ok(m1.turn_deadline! > clock, 'fresh clock');
    // a real move clears the streak
    clock += 1000;
    const mover = mySeat;
    await handleGame(db, 'A', { op: 'act', matchId: init.id, action: aiNextAction(m1.state, mover, () => 0.4) }, cfg);
    eq(db.matches[0].timeouts[mySeat], 0, 'acting resets the streak');
    // two in a row: forfeit
    clock += 101000; await handleGame(db, 'A', { op: 'tick', matchId: init.id }, cfg);
    clock += 101000; await handleGame(db, 'A', { op: 'tick', matchId: init.id }, cfg);
    const m2 = db.matches[0];
    eq([m2.status, m2.winner, m2.end_reason], ['finished', db.matches[0].bot_seat, 'timeout']);
  });

  await test('turn clock between two people: the waiting player\'s tick enforces it, and both are told', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    const m = db.matches[0];
    const afk = (m.state.turn.active) as Seat;
    const waiting = userOf(db, afk === 0 ? 1 : 0);
    clock += 101000;
    const t = await handleGame(db, waiting, { op: 'tick', matchId: id, since: 1 }, cfg);
    ok(t.ok === true && t.status === 'acted', 'tick ok');
    const rows = t.ok === true && t.status === 'acted' ? t.rows : [];
    ok(rows.length > 0 && rows.every(r => r.actor === 1), 'the waiting player sees the AFK player\'s turn pass (actor = opponent)');
    ok(rows.some(r => r.events.some(e => e.t === 'log' && /demorou demais/.test(e.text))), 'told the opponent was too slow');
    const afkRows = await db.views(id, afk, 1);
    ok(afkRows.some(r => r.events.some(e => e.t === 'log' && /seu turno foi encerrado/.test(e.text))), 'the AFK player is told too');
    eq(db.matches[0].state.turn.active, afk === 0 ? 1 : 0, 'the turn really passed');
  });

  await test('rewards: paid once, to both, by the rules; the profile is updated; a second ask pays nothing more', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    await drive(db, id, () => false);
    const m = db.matches[0];
    ok(m.status === 'finished' && m.rewards !== null && m.rewards.length === 2, 'rewards were stored for both players');
    const winnerUser = userOf(db, m.winner as Seat);
    const loserUser = userOf(db, (m.winner === 0 ? 1 : 0) as Seat);
    const expectWin = rewardFor({ won: true, vsBot: false, ending: 'general', rounds: m.state.turn.round, steps: m.steps_count });
    const expectLoss = rewardFor({ won: false, vsBot: false, ending: 'general', rounds: m.state.turn.round, steps: m.steps_count });
    const w = m.rewards!.find(r => r.user_id === winnerUser)!;
    const l = m.rewards!.find(r => r.user_id === loserUser)!;
    eq([w.xp, w.coroas, w.reason], [expectWin.xp, expectWin.coroas, expectWin.reason]);
    eq([l.xp, l.coroas, l.reason], [expectLoss.xp, expectLoss.coroas, expectLoss.reason]);
    const prof = (u: string) => db.tables.profiles.find(p => p.id === u)!;
    eq([prof(winnerUser).xp, prof(winnerUser).coroas], [applyReward({ level: 1, xp: 0, coroas: 150 }, expectWin).xp, 150 + expectWin.coroas]);
    const r1 = await handleGame(db, winnerUser, { op: 'result', matchId: id }, cfg);
    const r2 = await handleGame(db, winnerUser, { op: 'result', matchId: id }, cfg);
    ok(r1.ok === true && r1.status === 'result' && r1.reward !== null && r1.reward.reason === 'win', 'result says what I got');
    eq(JSON.stringify(r1), JSON.stringify(r2));
    eq(prof(winnerUser).coroas, 150 + expectWin.coroas, 'not paid twice');
  });

  await test('rewards: a match given up early pays nothing; a forfeit by the clock pays the one who stayed', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    const m = db.matches[0];
    const quitter = userOf(db, m.state.turn.active as Seat);
    await handleGame(db, quitter, { op: 'act', matchId: id, action: { type: 'concede' } }, cfg);
    const r = await handleGame(db, quitter, { op: 'result', matchId: id }, cfg);
    ok(r.ok === true && r.status === 'result' && r.reward?.reason === 'too_short', 'too short to pay: ' + JSON.stringify(r));
    const db2 = fresh();
    const g = await pvp(db2);
    await drive(db2, g.id, mm => mm.state.turn.round >= 4);
    const m2 = db2.matches[0];
    const afk = m2.state.turn.active as Seat;
    clock += 101000; await handleGame(db2, userOf(db2, afk === 0 ? 1 : 0), { op: 'tick', matchId: g.id }, cfg);
    // the AFK player's turn was passed; make them miss again
    for (let i = 0; i < 80 && db2.matches[0].status === 'active'; i++) {
      const mv = (db2.matches[0].state.pending ? db2.matches[0].state.pending.seat : db2.matches[0].state.turn.active) as Seat;
      if (mv === afk) { clock += 101000; await handleGame(db2, userOf(db2, afk === 0 ? 1 : 0), { op: 'tick', matchId: g.id }, cfg); }
      else { const mm = db2.matches[0]; await handleGame(db2, userOf(db2, mv), { op: 'act', matchId: g.id, action: aiNextAction(mm.state, mv, () => 0.4) }, cfg); }
    }
    const f = db2.matches[0];
    eq([f.status, f.end_reason], ['finished', 'timeout']);
    const stayed = userOf(db2, afk === 0 ? 1 : 0);
    const lost = userOf(db2, afk);
    eq(f.rewards!.find(x => x.user_id === stayed)!.reason, 'win');
    eq(f.rewards!.find(x => x.user_id === lost)!.reason, 'abandoned');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
