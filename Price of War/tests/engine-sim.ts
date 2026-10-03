// Headless checks of the rules engine:  npx tsx tests/engine-sim.ts
//  1. AI vs AI full matches: they finish, rules invariants hold after EVERY action.
//  2. Determinism: the same seed and the same actions give the same match.
//  3. Fuzz: random (mostly illegal) actions never crash and a refused action changes nothing.
//  4. Redaction: the opponent's hand and deck order are never exposed.
import { DECK_RECIPES, type DeckId } from '../src/engine/catalog';
import { aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe, replayMatch } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import { eventsFor, redactFor, viewFor } from '../src/engine/view';
import type { Action, Card, GameState, Seat } from '../src/engine/types';

let failures = 0;
const usage: Record<string, number> = {};
const tactics: Record<string, number> = {};
let discards = 0;
const check = (cond: boolean, msg: string) => { if (!cond) { failures++; if (failures <= 25) console.log('  ✗', msg); } };

const allCards = (s: GameState): Card[] => {
  const out: Card[] = [];
  const push = (c: Card) => { out.push(c); (c.equippedWeapons ?? []).forEach(push); };
  s.players.forEach(p => { p.hand.forEach(push); p.board.forEach(c => c && push(c)); p.graveyard.forEach(push); });
  if (s.pending?.kind === 'pick') { if (s.pending.mode !== 'graveyard_soldier') s.pending.options.forEach(push); if (s.pending.source) push(s.pending.source); }
  return out;
};

const invariants = (s: GameState, where: string) => {
  s.players.forEach((p, i) => {
    check(p.board.length === 13, `${where}: board ${i} has ${p.board.length} slots`);
    check(p.board.every(c => c === null || typeof c === 'object'), `${where}: board ${i} has an undefined slot`);
    check(p.gold >= 0, `${where}: seat ${i} gold ${p.gold} < 0`);
    check(p.hand.length <= 24, `${where}: seat ${i} hand ${p.hand.length}`);
    check(p.board.every(c => !c || c.hp > 0), `${where}: a dead card is still on seat ${i}'s board`);
    if (s.winner === null) check(!!p.board[12], `${where}: seat ${i} lost the General but no winner`);
    check(p.board[10] === null || ['Relíquia'].includes(p.board[10]!.cardType), `${where}: slot 10 holds ${p.board[10]?.cardType}`);
    check(p.board[11] === null || ['Terreno'].includes(p.board[11]!.cardType), `${where}: slot 11 holds ${p.board[11]?.cardType}`);
    for (let k = 0; k <= 9; k++) {
      const c = p.board[k];
      check(!c || !['Relíquia', 'Terreno', 'Tática', 'Emboscada', 'General'].includes(c.cardType), `${where}: ${c?.cardType} sits in unit slot ${k}`);
    }
  });
  const ids = allCards(s).map(c => c.id);
  check(new Set(ids).size === ids.length, `${where}: duplicate card ids`);
};

const play = (seed: number, a: DeckId, b: DeckId, first: Seat, maxRounds = 150) => {
  let { state } = createMatch({ seed, decks: [deckSetupFromRecipe(a), deckSetupFromRecipe(b)], first });
  const history: { seat: Seat; action: Action }[] = [];
  const rand = () => nextRandom(rng);
  const rng = { rng: seedFrom(seed * 7 + 1) };
  const step = (seat: Seat, action: Action) => {
    if (action.type === 'play') { const c = state.players[seat].hand.find(h => h.id === action.cardId); if (c) usage[c.cardType] = (usage[c.cardType] ?? 0) + 1; if (c && c.cardType === 'Tática') tactics[c.name] = (tactics[c.name] ?? 0) + 1; }
    if (action.type === 'discard') discards += action.cardIds.length;
    if (action.type === 'move') usage['(moves)'] = (usage['(moves)'] ?? 0) + 1;
    const before = JSON.stringify(state);
    const deckBefore = state.players.map(p => p.drawPile.length);
    const wasReveal = state.pending?.kind === 'pick' && state.pending.mode === 'top_reveal';
    const r = applyAction(state, seat, action);
    check(JSON.stringify(state) === before, `seed ${seed}: applyAction mutated its input`);
    // The deck is finite: it only shrinks (the one exception is giving back the cards of a top reveal that were not kept).
    if (r.ok) r.state.players.forEach((p, i) => check(p.drawPile.length <= deckBefore[i] + (wasReveal ? 4 : 0) && p.deckList.length === p.drawPile.length, `seed ${seed}: deck of seat ${i} grew or went out of sync after ${action.type} (${deckBefore[i]} -> ${p.drawPile.length}/${p.deckList.length})`));
    if (r.ok === false) { check(false, `seed ${seed}: AI action refused (${r.error}) ${JSON.stringify(action)}`); return false; }
    history.push({ seat, action });
    state = r.state;
    invariants(state, `seed ${seed} ${action.type}`);
    return true;
  };
  if (!step(first, { type: 'begin' })) return null;
  let guard = 0;
  while (state.winner === null && state.turn.round <= maxRounds && guard++ < 20000) {
    const seat = state.pending ? state.pending.seat : state.turn.active;
    if (!step(seat, aiNextAction(state, seat, rand))) break;
  }
  return { state, history, createdWith: { seed, a, b, first } };
};

// ── 1 + 2: AI vs AI, determinism ────────────────────────────────────────────
console.log('AI vs AI…');
const decks: DeckId[] = ['capitao', 'cardeal'];
let finished = 0, stalled = 0, total = 0, rounds = 0, firstWins = 0;
const winsByDeck: Record<string, number> = {};
for (let seed = 1; seed <= 120; seed++) {
  const a = decks[seed % 2], b = decks[(seed >> 1) % 2];
  const first = (seed % 3 === 0 ? 1 : 0) as Seat;
  const r = play(seed, a, b, first);
  if (!r) continue;
  total++;
  if (r.state.winner !== null) {
    finished++;
    rounds += r.state.turn.round;
    if (r.state.winner === first) firstWins++;
    const wd = r.state.winner === 0 ? a : b;
    winsByDeck[wd] = (winsByDeck[wd] ?? 0) + 1;
  } else stalled++;
  if (seed <= 5) {
    // replay the recorded actions: must land on the identical state
    const rep = replayMatch({ seed, decks: [deckSetupFromRecipe(a), deckSetupFromRecipe(b)], first, actions: r.history });
    check(rep.ok === true, `seed ${seed}: replay refused an action`);
    if (rep.ok === true) check(JSON.stringify(rep.state) === JSON.stringify(r.state), `seed ${seed}: replay differs from the original match`);
  }
}
console.log(`  matches ${total}: finished ${finished}, stalled ${stalled}; avg rounds ${(rounds / Math.max(1, finished)).toFixed(1)}; first player won ${firstWins}/${finished}; deck wins`, winsByDeck);
console.log('  cards played by type', usage, '| tactics', tactics, '| discarded', discards);
check(total > 0 && finished / total > 0.9, 'most AI vs AI matches should finish');
check((usage['(moves)'] ?? 0) > 50, 'the AI repositions during the match');
check((usage['Tática'] ?? 0) > 20 && (usage['Relíquia'] ?? 0) > 0 && (usage['Terreno'] ?? 0) > 0, 'the AI uses Táticas, Relíquias and Terrenos');

// ── 3: fuzz ─────────────────────────────────────────────────────────────────
console.log('Fuzz…');
const rnd = { rng: seedFrom(99) };
const R = (n: number) => Math.floor(nextRandom(rnd) * n);
let accepted = 0, refused = 0;
for (let m = 0; m < 60; m++) {
  let { state } = createMatch({ seed: 1000 + m, decks: [deckSetupFromRecipe(decks[m % 2]), deckSetupFromRecipe(decks[(m + 1) % 2])], first: (m % 2) as Seat });
  const b = applyAction(state, state.turn.first, { type: 'begin' });
  if (b.ok === false) { check(false, 'begin refused'); continue; }
  state = b.state;
  for (let i = 0; i < 700 && state.winner === null; i++) {
    const seat = (R(10) < 8 ? (state.pending ? state.pending.seat : state.turn.active) : R(2)) as Seat;
    const hand = state.players[seat].hand;
    const pickCard = () => hand.length ? hand[R(hand.length)].id : 'nope';
    const kinds: Action[] = [
      { type: 'play', cardId: pickCard(), slot: R(14) - 1, target: R(14) - 1 },
      { type: 'attack', from: R(14) - 1, to: R(14) - 1 },
      { type: 'move', from: R(12) - 1, to: R(12) - 1 },
      { type: 'ability', slot: R(13), target: R(12) - 1, target2: R(12) - 1 },
      { type: 'ambush', cardId: R(2) ? pickCard() : null },
      { type: 'choose', cardIds: state.pending?.kind === 'pick' ? state.pending.options.slice(0, R(3)).map(o => o.id) : [pickCard()] },
      { type: 'discard', cardIds: hand.slice(0, R(4)).map(h => h.id) },
      { type: 'advance' }, { type: 'advance' },
    ];
    // half the time follow the AI so the match actually progresses; the other half is noise
    const action = R(2) ? aiNextAction(state, state.pending ? state.pending.seat : state.turn.active, () => nextRandom(rnd)) : kinds[R(kinds.length)];
    const before = JSON.stringify(state);
    const r = applyAction(state, seat, action);
    if (r.ok === true) { accepted++; state = r.state; invariants(state, `fuzz ${m}/${i} ${action.type}`); }
    else { refused++; check(JSON.stringify(state) === before, `fuzz: refused action changed state (${action.type})`); }
  }
}
console.log(`  actions accepted ${accepted}, refused ${refused}`);

// ── 4: redaction ────────────────────────────────────────────────────────────
console.log('Redaction…');
{
  const { state } = createMatch({ seed: 5, decks: [deckSetupFromRecipe('capitao'), deckSetupFromRecipe('cardeal')], first: 0 });
  const v = redactFor(state, 0);
  check(v.players[1].hand.length === state.players[1].hand.length, 'redacted hand keeps its size');
  check(v.players[1].hand.every(c => c.hidden && c.name === ''), 'opponent hand cards are hidden');
  check(v.players[1].deckList.length === 0 && v.players[1].drawPile.every(n => n === ''), 'opponent deck is hidden');
  check(v.players[0].hand.every(c => !c.hidden && c.name), 'own hand stays visible');
  check(v.players[0].deckList.length > 0 && v.players[0].drawPile.every(n => n === ''), 'own deck list stays, own draw order is hidden');
  check(v.rng === 0, 'rng is not exposed');
  // nothing about the opponent's hand or draw order may appear anywhere in what seat 0 receives
  const secretNames = new Set(state.players[1].hand.map(c => c.name).filter(n => !state.players[0].hand.some(c => c.name === n)));
  const text = JSON.stringify({ ...v, players: [v.players[0], { ...v.players[1], board: [], graveyard: [] }] });
  check(![...secretNames].some(n => text.includes(`"name":"${n}"`)), 'no opponent hand name leaks into the view');
  // viewFor: seat 1 receives a mirrored copy where it is seat 0
  const w = viewFor(state, 1);
  check(w.players[0].general === state.players[1].general && w.players[0].hand.every(c => !c.hidden), 'seat 1 sees itself as seat 0');
  check(w.players[1].hand.every(c => c.hidden), 'and its opponent as hidden seat 1');
  check(w.turn.first === (state.turn.first === 0 ? 1 : 0), 'turn order is mirrored too');
  // a whole AI match: at every step, neither side's view may contain the other's hidden card names
  let s = state;
  const begun = applyAction(s, 0, { type: 'begin' }); if (begun.ok === true) s = begun.state;
  const r2 = { rng: seedFrom(3) };
  for (let i = 0; i < 160 && s.winner === null; i++) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const res = applyAction(s, seat, aiNextAction(s, seat, () => nextRandom(r2)));
    if (res.ok === false) break;
    s = res.state;
    for (const viewer of [0, 1] as Seat[]) {
      const view = viewFor(s, viewer);
      const hiddenHand = view.players[1].hand;
      check(hiddenHand.every(c => c.hidden && c.name === ''), `step ${i}: opponent hand hidden for viewer ${viewer}`);
      check(view.players[1].drawPile.every(n => n === '') && view.players[0].drawPile.every(n => n === ''), `step ${i}: draw piles hidden`);
      const ev = eventsFor(res.events, viewer).filter(e => e.t === 'draw' && e.seat === 1);
      check(ev.every(e => (e as any).card.hidden), `step ${i}: opponent draws are hidden`);
    }
  }
}

console.log(failures === 0 ? '\nALL GOOD' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
