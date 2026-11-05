// Auditoria de ataque: quanto ATK as unidades realmente têm no momento do golpe, por deck (IA × IA, planejadora dos dois lados),
// e quantas movimentações a IA faz por turno. Responde "o Capitão fica forte demais por empilhar bônus?".
//   N=60 npx tsx tests/atk-audit.ts
import './balance-rules-preload';
import { aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { getEffectiveAtk } from '../src/engine/rules';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { GameEvent, GameState, Seat } from '../src/engine/types';

const DECKS = ['cardeal', 'capitao', 'mercenarios'] as const;
type D = typeof DECKS[number];
const N = Number(process.env.N ?? 60);
const stat: Record<string, { hits: number[]; moves: number; turns: number; wins: number; games: number; maxAtk: number; maxName: string }> = {};
for (const d of DECKS) stat[d] = { hits: [], moves: 0, turns: 0, wins: 0, games: 0, maxAtk: 0, maxName: '' };

function play(a: D, b: D, seed: number, first: Seat) {
  let s: GameState = createMatch({ seed, decks: [deckSetupFromRecipe(a), deckSetupFromRecipe(b)] as any, first }).state;
  const ids = [a, b]; const rng = { rng: seedFrom(seed * 7 + 1) }; const rand = () => nextRandom(rng);
  s = (applyAction(s, first, { type: 'begin' }) as any).state;
  let guard = 0;
  while (s.winner === null && s.turn.round <= 40 && guard++ < 6000) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const act = aiNextAction(s, seat, rand);
    if (act.type === 'attack') {
      const me = s.players[seat], foe = s.players[1 - seat as Seat], u = me.board[act.from];
      if (u) { const atk = getEffectiveAtk(u, act.from, me.board as any, foe.board as any); const st = stat[ids[seat]]; st.hits.push(atk); if (atk > st.maxAtk) { st.maxAtk = atk; st.maxName = u.name; } }
    }
    if (act.type === 'move') stat[ids[seat]].moves++;
    const r: any = applyAction(s, seat, act);
    if (r.ok === false) break;
    for (const e of r.events as GameEvent[]) if (e.t === 'turn_start') stat[ids[e.seat]].turns++;
    s = r.state;
  }
  stat[a].games++; stat[b].games++;
  if (s.winner !== null) stat[ids[s.winner]].wins++;
}
const pairs: [D, D][] = [['capitao', 'mercenarios'], ['capitao', 'cardeal'], ['cardeal', 'mercenarios']];
for (const [a, b] of pairs) for (let seed = 1; seed <= N; seed++) { play(a, b, seed, (seed % 2) as Seat); play(b, a, seed + 1000, (seed % 2) as Seat); }
const f = (n: number) => n.toFixed(2).replace('.', ',');
console.log('deck         | ataques | ATK médio | % com ATK ≥6 | % ≥8 | máx (carta) | movimentos/turno | vitórias');
for (const d of DECKS) {
  const s = stat[d], h = s.hits, avg = h.reduce((x, y) => x + y, 0) / Math.max(1, h.length);
  console.log(`${d.padEnd(12)} | ${String(h.length).padStart(7)} | ${f(avg).padStart(9)} | ${f(100 * h.filter(x => x >= 6).length / Math.max(1, h.length)).padStart(12)} | ${f(100 * h.filter(x => x >= 8).length / Math.max(1, h.length)).padStart(4)} | ${s.maxAtk} (${s.maxName}) | ${f(s.moves / Math.max(1, s.turns)).padStart(8)} | ${f(100 * s.wins / s.games)}%`);
}
