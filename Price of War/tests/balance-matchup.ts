// Cardeal × Capitão with the planner AI on both sides, alternating chairs and who starts:   N=20 npx tsx tests/balance-matchup.ts
// MERC_COST=2 tries a gold cost on the Cambista do Dízimo's ability (without touching the catalog), to see what it does to the matchup.
import { CARD_DEFS } from '../src/engine/catalog';
import { aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { GameState, Seat } from '../src/engine/types';

const N = Number(process.env.N ?? 20);
if (process.env.MERC_COST !== undefined) {
  const m = CARD_DEFS.find(c => c.name === 'Cambista do Dízimo') as any;
  m.abilities[0].cost = Number(process.env.MERC_COST);
}
let cardealWins = 0, capitaoWins = 0, undecided = 0, rounds = 0, games = 0;
for (let seed = 1; seed <= N; seed++) for (const cardealSeat of [0, 1] as Seat[]) {
  const first = (seed % 2) as Seat;
  const decks = cardealSeat === 0 ? ['cardeal', 'capitao'] : ['capitao', 'cardeal'];
  let s: GameState = createMatch({ seed, decks: decks.map(d => deckSetupFromRecipe(d as any)) as any, first }).state;
  const rng = { rng: seedFrom(seed * 7 + 1) }; const rand = () => nextRandom(rng);
  s = (applyAction(s, first, { type: 'begin' }) as any).state;
  let guard = 0;
  while (s.winner === null && s.turn.round <= 40 && guard++ < 5000) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const r = applyAction(s, seat, aiNextAction(s, seat, rand));
    if (r.ok === false) { console.log('REFUSED', r.error); break; }
    s = r.state;
  }
  games++; rounds += s.turn.round;
  if (s.winner === null) undecided++; else if (s.winner === cardealSeat) cardealWins++; else capitaoWins++;
}
console.log(`MERC_COST=${process.env.MERC_COST ?? 'catalog'} | Cardeal ${cardealWins} × Capitão ${capitaoWins} (undecided ${undecided}) of ${games} | Capitão wins ${(100 * capitaoWins / Math.max(1, games - undecided)).toFixed(0)}% | avg rounds ${(rounds / games).toFixed(1)}`);
