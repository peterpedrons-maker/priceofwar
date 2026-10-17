// Todos contra todos: os 4 decks base (Cardeal, Capitão, Mercenários, Campo), IA planejadora dos dois lados, cadeiras e quem começa alternando.
//   N=150 OUT=balance-out/todos npx tsx tests/balance-todos.ts      (N sementes × 2 cadeiras = 2N partidas por confronto)
import './balance-rules-preload';
import { fork } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DECK_RECIPES } from '../src/engine/catalog';
import { aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { GameState, Seat, GameEvent } from '../src/engine/types';

const IDS = ['cardeal', 'capitao', 'mercenarios', 'campo'] as const;
type Per = { deck: string; won: boolean; generalHp: number; spent: number; income: number; leftover: number[]; units: number[]; maxUnits: number; lost: number; killed: number; attacks: number; played: Record<string, number>; modes: Record<string, number>; firstUnit: number };
type Rec = { a: string; b: string; seed: number; first: Seat; rounds: number; winner: Seat | null; seats: [Per, Per] };
const bump = (o: Record<string, number>, k: string, n = 1) => { o[k] = (o[k] ?? 0) + n; };
const unitsOf = (s: GameState, i: number) => s.players[i].board.filter((c, k) => c && k < 10).length;

function playGame(a: string, b: string, seed: number, seatA: Seat, first: Seat): Rec {
  const decks = seatA === 0 ? [a, b] : [b, a];
  let s: GameState = createMatch({ seed, decks: decks.map(d => deckSetupFromRecipe(d as any)) as any, first }).state;
  const rng = { rng: seedFrom(seed * 7 + 1) }; const rand = () => nextRandom(rng);
  const seats: [Per, Per] = [0, 1].map(i => ({ deck: decks[i], won: false, generalHp: 0, spent: 0, income: 0, leftover: [], units: [], maxUnits: 0, lost: 0, killed: 0, attacks: 0, played: {}, modes: {}, firstUnit: 0 })) as any;
  const see = (events: GameEvent[], before: GameState) => {
    for (const e of events) {
      if (e.t === 'gold') { if (e.delta < 0) seats[e.seat].spent -= e.delta; else seats[e.seat].income += e.delta; }
      else if (e.t === 'play') bump(seats[e.seat].played, e.card.cardType);
      else if (e.t === 'ambush') bump(seats[e.seat].played, 'Emboscada');
      else if (e.t === 'attack') seats[e.seat].attacks++;
      else if (e.t === 'relic_mode') bump(seats[e.seat].modes, `${e.slot === 11 ? 'Terreno' : 'Relíquia'}: ${e.mode}`);
      else if (e.t === 'destroyed' && e.card.cardType !== 'General') { seats[e.seat].lost++; seats[1 - e.seat].killed++; }
      else if (e.t === 'turn_start') { const o = 1 - e.seat; seats[o].leftover.push(before.players[o].gold); seats[o].units.push(unitsOf(before, o)); }
    }
  };
  { const r = applyAction(s, first, { type: 'begin' }) as any; see(r.events ?? [], s); s = r.state; }
  let guard = 0;
  while (s.winner === null && s.turn.round <= 40 && guard++ < 6000) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const r = applyAction(s, seat, aiNextAction(s, seat, rand));
    if (r.ok === false) { console.error('RECUSADO', a, b, seed, r.error); break; }
    see(r.events, s); s = r.state;
    for (const i of [0, 1]) seats[i].maxUnits = Math.max(seats[i].maxUnits, unitsOf(s, i));
  }
  seats.forEach((per, i) => { per.won = s.winner === i; per.generalHp = s.players[i].board[12]?.hp ?? 0; });
  return { a, b, seed, first, rounds: s.turn.round, winner: s.winner, seats };
}

async function main() {
  const pairs: [string, string][] = []; for (let i = 0; i < IDS.length; i++) for (let j = i + 1; j < IDS.length; j++) pairs.push([IDS[i], IDS[j]]);
  if (process.env.WORKER !== undefined) {
    const w = Number(process.env.WORKER), W = Number(process.env.WORKERS), N = Number(process.env.N); const out: Rec[] = [];
    for (const [a, b] of pairs) for (let seed = 1 + w; seed <= N; seed += W) for (const seatA of [0, 1] as Seat[]) out.push(playGame(a, b, seed, seatA, ((seed + seatA) % 2) as Seat));
    process.send!(out, () => process.exit(0)); return;
  }
  const N = Number(process.env.N ?? 150), W = 4; const all: Rec[] = [];
  await Promise.all(Array.from({ length: W }, (_, w) => new Promise<void>(res => {
    const ch = fork(process.argv[1], [], { env: { ...process.env, WORKER: String(w), WORKERS: String(W), N: String(N) }, execArgv: process.execArgv });
    ch.on('message', (m: Rec[]) => { all.push(...m); }); ch.on('exit', () => res());
  })));
  const out = process.env.OUT ?? 'balance-out/todos'; mkdirSync(dirname(out), { recursive: true }); writeFileSync(`${out}.json`, JSON.stringify({ games: all }));
  console.log('games', all.length);
}
main();
