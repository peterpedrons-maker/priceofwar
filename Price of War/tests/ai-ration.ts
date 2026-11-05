// Arena: a IA atual contra a IA que racionaliza (AiStyle.ration), com Cardeal e Capitão, nas duas cadeiras e quem começa alternando.
//   N=30 RATION=1 npx tsx tests/ai-ration.ts
//   N=30 RATION=1 PATCH=balance-out/h10d2.json npx tsx tests/ai-ration.ts      (com regras de laboratório: mão inicial, compra por turno...)
// Cada semente joga 4 partidas (qual deck a IA racional comanda × em que cadeira ela senta). Imprime quanto a racional vence e o que ela faz diferente.
import './balance-rules-preload';
import { fork } from 'node:child_process';
import { aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { GameState, Seat, GameEvent } from '../src/engine/types';

type Side = { won: boolean; played: number; drawn: number; discarded: number; unitsEnd: number; turns: number; firstTurnPlayed: number };
type Rec = { seed: number; ratDeck: 'cardeal' | 'capitao'; ratSeat: Seat; rounds: number; winner: Seat | null; rat: Side; cur: Side };
const RATION = Number(process.env.RATION ?? 1);

function play(seed: number, ratDeck: 'cardeal' | 'capitao', ratSeat: Seat): Rec {
  const other = ratDeck === 'cardeal' ? 'capitao' : 'cardeal';
  const decks = ratSeat === 0 ? [ratDeck, other] : [other, ratDeck];
  const first = ((seed + ratSeat) % 2) as Seat;
  let s: GameState = createMatch({ seed, decks: decks.map(d => deckSetupFromRecipe(d as any)) as any, first }).state;
  const rng = { rng: seedFrom(seed * 7 + 1) }; const rand = () => nextRandom(rng);
  s = (applyAction(s, first, { type: 'begin' }) as any).state;
  const mk = (): Side => ({ won: false, played: 0, drawn: 0, discarded: 0, unitsEnd: 0, turns: 0, firstTurnPlayed: 0 });
  const side: [Side, Side] = [mk(), mk()];
  const seenTurn: [number, number] = [0, 0]; seenTurn[first] = 1;   // o `begin` já abriu o 1º turno de quem começa
  let guard = 0;
  while (s.winner === null && s.turn.round <= 40 && guard++ < 6000) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const act = aiNextAction(s, seat, rand, seat === ratSeat ? { ration: RATION } : {});
    const pre = s;
    const r = applyAction(s, seat, act);
    if (r.ok === false) { console.error('RECUSADO', r.error); break; }
    if (act.type === 'discard') side[seat].discarded += act.cardIds.length;
    for (const e of r.events as GameEvent[]) {
      if (e.t === 'turn_start') {
        side[pre.turn.active].unitsEnd += pre.players[pre.turn.active].board.slice(0, 10).filter(Boolean).length;
        side[pre.turn.active].turns++;
        seenTurn[e.seat]++;
      } else if (e.t === 'play') { side[e.seat].played++; if (seenTurn[e.seat] === 1) side[e.seat].firstTurnPlayed++; }
      else if (e.t === 'draw' && e.reason !== 'deal') side[e.seat].drawn++;
    }
    s = r.state;
  }
  side[0].won = s.winner === 0; side[1].won = s.winner === 1;
  return { seed, ratDeck, ratSeat, rounds: s.turn.round, winner: s.winner, rat: side[ratSeat], cur: side[1 - ratSeat as Seat] };
}

async function main() {
  if (process.env.WORKER !== undefined) {
    const w = Number(process.env.WORKER), W = Number(process.env.WORKERS), N = Number(process.env.N);
    const out: Rec[] = [];
    for (let seed = 1 + w; seed <= N; seed += W) for (const d of ['cardeal', 'capitao'] as const) for (const rs of [0, 1] as Seat[]) out.push(play(seed, d, rs));
    process.send!(out, () => process.exit(0)); return;
  }
  const N = Number(process.env.N ?? 30), W = Math.min(4, Number(process.env.WORKERS ?? 4));
  const all: Rec[] = [];
  await Promise.all(Array.from({ length: W }, (_, w) => new Promise<void>(res => {
    const ch = fork(process.argv[1], [], { env: { ...process.env, WORKER: String(w), WORKERS: String(W), N: String(N) }, execArgv: process.execArgv });
    ch.on('message', (m: Rec[]) => { all.push(...m); });
    ch.on('exit', () => res());
  })));
  const f = (n: number, d = 1) => n.toFixed(d).replace('.', ',');
  const pct = (a: number, b: number) => (b ? f(100 * a / b, 1) + '%' : '–');
  const decided = all.filter(g => g.winner !== null);
  const ratWins = decided.filter(g => g.winner === g.ratSeat).length;
  console.log(`IA racional (ration=${RATION}) contra a IA atual: ${all.length} partidas`);
  console.log(`Racional vence ${ratWins} de ${decided.length} (${pct(ratWins, decided.length)})`);
  for (const d of ['cardeal', 'capitao'] as const) {
    const g = decided.filter(x => x.ratDeck === d); const w = g.filter(x => x.winner === x.ratSeat).length;
    console.log(`  comandando o ${d === 'cardeal' ? 'Cardeal' : 'Capitão'} (contra o ${d === 'cardeal' ? 'Capitão' : 'Cardeal'} da IA atual): ${w} de ${g.length} (${pct(w, g.length)})`);
  }
  const avg = (fn: (g: Rec) => number) => all.reduce((a, g) => a + fn(g), 0) / all.length;
  console.log(`Rodadas por partida: ${f(avg(g => g.rounds))}`);
  const rows: [string, (s: Side) => number][] = [
    ['Cartas jogadas por partida', s => s.played],
    ['Cartas jogadas no 1º turno', s => s.firstTurnPlayed],
    ['Cartas compradas por partida', s => s.drawn],
    ['Cartas descartadas por excesso de mão por partida', s => s.discarded],
    ['Unidades em campo (média no fim do turno)', s => (s.turns ? s.unitsEnd / s.turns : 0)],
  ];
  console.log('Por IA:'.padEnd(52) + 'racional'.padStart(10) + 'atual'.padStart(10));
  for (const [name, fn] of rows) console.log(name.padEnd(52) + f(avg(g => fn(g.rat)), 2).padStart(10) + f(avg(g => fn(g.cur)), 2).padStart(10));
}
main();
