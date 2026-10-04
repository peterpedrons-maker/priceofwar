// Pits the planner AI against the first (move-by-move) AI, in both decks and both chairs:   N=40 npx tsx tests/ai-arena.ts
// MIRROR=1 gives both sides the same deck, so the result says how good the AI is, not which deck is better.
// Prints how often the planner wins and how long it takes to think.
import { aiLegacyAction, aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { GameState, Seat } from '../src/engine/types';

const N = Number(process.env.N ?? 30);
type D = 'capitao' | 'cardeal';
let planWins = 0, games = 0, undecided = 0, planMs = 0, planCalls = 0, maxMs = 0, rounds = 0;
const byDeck: Record<string, [number, number]> = { capitao: [0, 0], cardeal: [0, 0] };
for (const deck of ['capitao', 'cardeal'] as D[]) {
  const other: D = process.env.MIRROR ? deck : deck === 'capitao' ? 'cardeal' : 'capitao';
  for (let seed = 1; seed <= N; seed++) for (const planSeat of [0, 1] as Seat[]) {
    const first = (seed % 2) as Seat;
    const decks = planSeat === 0 ? [deck, other] : [other, deck];
    let s: GameState = createMatch({ seed, decks: decks.map(d => deckSetupFromRecipe(d)) as any, first }).state;
    const rng = { rng: seedFrom(seed * 7 + 1) }; const rand = () => nextRandom(rng);
    s = (applyAction(s, first, { type: 'begin' }) as any).state;
    let guard = 0;
    while (s.winner === null && s.turn.round <= 40 && guard++ < 5000) {
      const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
      let act;
      if (seat === planSeat) { const t0 = performance.now(); act = aiNextAction(s, seat, rand); const dt = performance.now() - t0; planMs += dt; planCalls++; maxMs = Math.max(maxMs, dt); }
      else act = aiLegacyAction(s, seat, rand);
      const r = applyAction(s, seat, act);
      if (r.ok === false) { console.log('REFUSED', JSON.stringify(act), r.error); break; }
      s = r.state;
    }
    games++; rounds += s.turn.round;
    if (s.winner === null) undecided++;
    else { byDeck[deck][s.winner === planSeat ? 0 : 1]++; if (s.winner === planSeat) planWins++; }
  }
}
console.log(`planner wins ${planWins}/${games - undecided} (${(100 * planWins / (games - undecided)).toFixed(0)}%) | undecided ${undecided} | avg rounds ${(rounds / games).toFixed(1)}`);
console.log(`planner as capitão: ${byDeck.capitao[0]} wins, ${byDeck.capitao[1]} losses | as cardeal: ${byDeck.cardeal[0]} wins, ${byDeck.cardeal[1]} losses`);
console.log(`thinking: avg ${(planMs / planCalls).toFixed(1)} ms per action, worst ${maxMs.toFixed(0)} ms, ${planCalls} actions`);
