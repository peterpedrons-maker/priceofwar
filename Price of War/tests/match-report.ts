// Relatório de partidas Cardeal × Capitão (IA × IA): médias por turno de cada deck e uma partida narrada.
//   N=60 npx tsx tests/match-report.ts            → N sementes × 2 cadeiras; imprime o resumo e grava balance-out/partida-narrada.txt
// Cada "turno" é um turno do próprio deck (rodada = um turno de cada lado).
import './balance-rules-preload';
import { fork } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { CARD_DEFS } from '../src/engine/catalog';
import { aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { SOLDIER_TYPES } from '../src/engine/rules';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { GameState, Seat, GameEvent, Card } from '../src/engine/types';

type Turn = { n: number; played: number; units: number; tactics: number; relicTerrain: number; summons: number; ambush: number; attacks: number; dmgOut: number; dmgGeneral: number; kills: number; spent: number; goldEnd: number; drawn: number; handEnd: number; matEnd: number; unitsEnd: number; moves: number };
type Game = { seed: number; rounds: number; winner: Seat | null; first: Seat; decks: [string, string]; turns: [Turn[], Turn[]]; dmgOnTheirTurn: [number, number]; generalHp: [number, number]; text: string[]; discarded: [number, number]; deckLeft: [number, number]; peakUnits: [number, number]; drawnTotal: [number, number] };
// Patch opcional (PATCH=arquivo.json): `cards` com atk/hp/cost absolutos e `rules` (lido por balance-rules-preload).
if (process.env.PATCH) {
  const patch = JSON.parse(readFileSync(process.env.PATCH, 'utf8'));
  for (const [name, d] of Object.entries(patch.cards ?? {}) as [string, any][]) {
    const def = CARD_DEFS.find(c => c.name === name) as any; if (!def) throw new Error(`patch: carta desconhecida ${name}`);
    for (const k of ['atk', 'hp', 'cost']) if (d[k] !== undefined) def[k] = d[k];
  }
}
const blank = (n: number): Turn => ({ n, played: 0, units: 0, tactics: 0, relicTerrain: 0, summons: 0, ambush: 0, attacks: 0, dmgOut: 0, dmgGeneral: 0, kills: 0, spent: 0, goldEnd: 0, drawn: 0, handEnd: 0, matEnd: 0, unitsEnd: 0, moves: 0 });
const SOLD = SOLDIER_TYPES as string[];
const material = (b: (Card | null)[]) => b.slice(0, 10).reduce((a, c) => a + (c ? c.atk + c.hp : 0), 0);
const count = (b: (Card | null)[]) => b.slice(0, 10).filter(Boolean).length;
const SLOT = (i: number) => (i < 5 ? `Vanguarda ${i + 1}` : i < 10 ? `Retaguarda ${i - 4}` : i === 10 ? 'Relíquia' : i === 11 ? 'Terreno' : 'General');

function play(seed: number, cardealSeat: Seat, first: Seat, narrate: boolean): Game {
  const decks = (cardealSeat === 0 ? ['Cardeal', 'Capitão'] : ['Capitão', 'Cardeal']) as [string, string];
  let s: GameState = createMatch({ seed, decks: decks.map(d => deckSetupFromRecipe(d === 'Cardeal' ? 'cardeal' : 'capitao')) as any, first }).state;
  const rng = { rng: seedFrom(seed * 7 + 1) }; const rand = () => nextRandom(rng);
  s = (applyAction(s, first, { type: 'begin' }) as any).state;
  const turns: [Turn[], Turn[]] = [[], []];
  const discarded: [number, number] = [0, 0], peakUnits: [number, number] = [0, 0], drawnTotal: [number, number] = [0, 0];
  const dmgOnTheirTurn: [number, number] = [0, 0];
  let cur: Turn = blank(1); turns[first].push(cur); let active: Seat = first;
  const text: string[] = []; let line: string[] = [];
  const flush = () => { if (narrate && line.length) { text.push(line.join(' ')); line = []; } };
  const head = (seat: Seat, st: GameState) => `R${st.turn.round} · ${decks[seat]} (ouro ${st.players[seat].gold}, mão ${st.players[seat].hand.length}):`;
  if (narrate) line.push(head(first, s));
  let guard = 0;
  while (s.winner === null && s.turn.round <= 40 && guard++ < 6000) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const act = aiNextAction(s, seat, rand, { ration: Number(process.env.AI_RATION ?? 0) });
    const pre = s;
    const r = applyAction(s, seat, act);
    if (r.ok === false) break;
    if (act.type === 'discard') discarded[seat] += act.cardIds.length;
    for (const e of r.events as GameEvent[]) {
      if (e.t === 'turn_start') {
        // fecha o turno que acabou com o estado de antes da ação (último estado dele)
        const prev = active; cur.goldEnd = pre.players[prev].gold; cur.handEnd = pre.players[prev].hand.length; cur.matEnd = material(pre.players[prev].board); cur.unitsEnd = count(pre.players[prev].board);
        flush();
        active = e.seat; cur = blank(turns[active].length + 1); turns[active].push(cur);
        if (narrate) line.push(head(active, r.state as GameState));
      } else if (e.t === 'play') {
        cur.played++;
        if (SOLD.includes(e.card.cardType)) { cur.units++; if (narrate) line.push(`convoca ${e.card.name} (${SLOT(e.slot ?? 0)});`); }
        else if (e.card.cardType === 'Tática') { cur.tactics++; if (narrate) line.push(`joga a tática ${e.card.name};`); }
        else { cur.relicTerrain++; if (narrate) line.push(`coloca ${e.card.name};`); }
      } else if (e.t === 'summon') { cur.summons++; if (narrate) line.push(`(${e.card.name} surge);`); }
      else if (e.t === 'ambush') { if (e.seat === active) cur.ambush++; if (narrate) line.push(`EMBOSCADA ${e.card.name};`); }
      else if (e.t === 'attack') {
        cur.attacks++;
        if (narrate) { const a = pre.players[e.seat].board[e.from]?.name, d = pre.players[1 - e.seat as Seat].board[e.to]?.name; line.push(`${a ?? '?'} ataca ${d ?? '?'};`); }
      } else if (e.t === 'damage') {
        const victim = e.seat; const attackerSeat = (1 - victim) as Seat;
        if (attackerSeat === active) { cur.dmgOut += e.amount; if (e.slot === 12) cur.dmgGeneral += e.amount; } else dmgOnTheirTurn[attackerSeat] += e.amount;
        if (narrate && e.slot === 12) line.push(`${e.amount} de dano no General;`);
      } else if (e.t === 'destroyed' && e.card.cardType !== 'General') { if (e.seat !== active) cur.kills++; if (narrate) line.push(`${e.card.name} (${decks[e.seat]}) cai;`); }
      else if (e.t === 'gold' && e.delta < 0 && e.reason === 'spend') cur.spent -= e.delta;
      else if (e.t === 'draw' && e.reason !== 'deal') { cur.drawn++; drawnTotal[e.seat]++; }
      else if (e.t === 'move') cur.moves++;
    }
    s = r.state;
    for (const i of [0, 1] as const) peakUnits[i] = Math.max(peakUnits[i], count(s.players[i].board));
  }
  cur.goldEnd = s.players[active].gold; cur.handEnd = s.players[active].hand.length; cur.matEnd = material(s.players[active].board); cur.unitsEnd = count(s.players[active].board);
  if (narrate) { flush(); text.push(`Fim: vence ${s.winner === null ? '—' : decks[s.winner]} na rodada ${s.turn.round}. General Cardeal ${s.players[decks.indexOf('Cardeal')].board[12]?.hp ?? 0}, Capitão ${s.players[decks.indexOf('Capitão')].board[12]?.hp ?? 0}.`); }
  return { seed, rounds: s.turn.round, winner: s.winner, first, decks, turns, dmgOnTheirTurn, generalHp: [s.players[0].board[12]?.hp ?? 0, s.players[1].board[12]?.hp ?? 0], text, discarded, deckLeft: [s.players[0].drawPile.length, s.players[1].drawPile.length], peakUnits, drawnTotal };
}

const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const f = (n: number, d = 2) => n.toFixed(d).replace('.', ',');

async function main() {
  if (process.env.WORKER !== undefined) {
    const w = Number(process.env.WORKER), W = Number(process.env.WORKERS), N = Number(process.env.N);
    const out: Game[] = [];
    for (let seed = 1 + w; seed <= N; seed += W) for (const cs of [0, 1] as Seat[]) out.push(play(seed, cs, ((seed + cs) % 2) as Seat, false));
    process.send!(out, () => process.exit(0)); return;
  }
  const N = Number(process.env.N ?? 60), W = Math.min(4, Number(process.env.WORKERS ?? 4));
  const all: Game[] = [];
  await Promise.all(Array.from({ length: W }, (_, w) => new Promise<void>(res => {
    const ch = fork(process.argv[1], [], { env: { ...process.env, WORKER: String(w), WORKERS: String(W), N: String(N) }, execArgv: process.execArgv });
    ch.on('message', (m: Game[]) => { all.push(...m); });
    ch.on('exit', () => res());
  })));
  console.log(`${all.length} partidas (IA × IA, Cardeal e Capitão alternando cadeira e quem começa)\n`);
  const rounds = all.map(g => g.rounds).sort((a, b) => a - b);
  const wins = (d: string) => all.filter(g => g.winner !== null && g.decks[g.winner] === d).length;
  const firstWins = all.filter(g => g.winner === g.first).length;
  console.log(`Vitórias: Cardeal ${wins('Cardeal')} (${f(100 * wins('Cardeal') / all.length, 1)}%) · Capitão ${wins('Capitão')} (${f(100 * wins('Capitão') / all.length, 1)}%) · quem começa vence ${f(100 * firstWins / all.length, 1)}%`);
  console.log(`Duração: média ${f(avg(rounds), 1)} rodadas · mediana ${rounds[Math.floor(rounds.length / 2)]} · mais curta ${rounds[0]} · mais longa ${rounds[rounds.length - 1]} · terminam até a rodada 5: ${f(100 * rounds.filter(r => r <= 5).length / rounds.length, 0)}% · 6–7: ${f(100 * rounds.filter(r => r === 6 || r === 7).length / rounds.length, 0)}% · 8 ou mais: ${f(100 * rounds.filter(r => r >= 8).length / rounds.length, 0)}%\n`);
  const rows: [string, (t: Turn[]) => number][] = [
    ['Dano causado por turno (no próprio turno)', ts => avg(ts.map(t => t.dmgOut))],
    ['  desse, no General', ts => avg(ts.map(t => t.dmgGeneral))],
    ['Ataques por turno', ts => avg(ts.map(t => t.attacks))],
    ['Unidades abatidas por turno', ts => avg(ts.map(t => t.kills))],
    ['Cartas jogadas por turno (todas)', ts => avg(ts.map(t => t.played))],
    ['  soldados convocados da mão por turno', ts => avg(ts.map(t => t.units))],
    ['  táticas jogadas por turno', ts => avg(ts.map(t => t.tactics))],
    ['  relíquias/terrenos por turno', ts => avg(ts.map(t => t.relicTerrain))],
    ['Soldados que surgem por efeito (fichas, Chamado) por turno', ts => avg(ts.map(t => t.summons))],
    ['Ouro gasto por turno', ts => avg(ts.map(t => t.spent))],
    ['Ouro que sobra no fim do turno', ts => avg(ts.map(t => t.goldEnd))],
    ['Cartas compradas por turno (compra do turno + efeitos)', ts => avg(ts.map(t => t.drawn))],
    ['Cartas na mão no fim do turno', ts => avg(ts.map(t => t.handEnd))],
    ['Unidades em campo no fim do turno', ts => avg(ts.map(t => t.unitsEnd))],
    ['Material em campo no fim do turno (ATK + vida)', ts => avg(ts.map(t => t.matEnd))],
    ['Movimentos por turno', ts => avg(ts.map(t => t.moves))],
    ['Turnos sem jogar nenhuma carta (%)', ts => 100 * ts.filter(t => t.played === 0).length / ts.length],
    ['Turnos sem atacar (%)', ts => 100 * ts.filter(t => t.attacks === 0).length / ts.length],
  ];
  const ts = (d: string) => all.flatMap(g => g.turns[g.decks.indexOf(d) as 0 | 1]);
  console.log('Por turno de cada deck:'.padEnd(62) + 'Cardeal'.padStart(9) + 'Capitão'.padStart(9));
  for (const [name, fn] of rows) console.log(name.padEnd(62) + f(fn(ts('Cardeal'))).padStart(9) + f(fn(ts('Capitão'))).padStart(9));
  const sums = (d: string, k: 0 | 1) => avg(all.map(g => g.dmgOnTheirTurn[g.decks.indexOf(d) as 0 | 1]));
  console.log(`${'Dano por partida causado na vez do adversário (emboscada/retaliação)'.padEnd(62)}${f(sums('Cardeal', 0)).padStart(9)}${f(sums('Capitão', 0)).padStart(9)}`);
  console.log(`${'Turnos por partida (do próprio deck)'.padEnd(62)}${f(avg(all.map(g => g.turns[g.decks.indexOf('Cardeal') as 0 | 1].length)), 1).padStart(9)}${f(avg(all.map(g => g.turns[g.decks.indexOf('Capitão') as 0 | 1].length)), 1).padStart(9)}`);
  const G = (d: string, f2: (g: Game, i: 0 | 1) => number) => avg(all.map(g => f2(g, g.decks.indexOf(d) as 0 | 1)));
  const extra: [string, (g: Game, i: 0 | 1) => number][] = [
    ['Cartas usadas por partida (jogadas + Emboscadas)', (g, i) => g.turns[i].reduce((a, t) => a + t.played + t.ambush, 0)],
    ['Cartas compradas por partida (compra do turno + efeitos)', (g, i) => g.drawnTotal[i]],
    ['Cartas descartadas por excesso de mão por partida', (g, i) => g.discarded[i]],
    ['Cartas que restam no baralho no fim', (g, i) => g.deckLeft[i]],
    ['Máximo de unidades em campo na partida (de 10)', (g, i) => g.peakUnits[i]],
    ['Casas de unidade ocupadas, média nos fins de turno (de 10)', (g, i) => avg(g.turns[i].map(t => t.unitsEnd))],
  ];
  for (const [name, fn] of extra) console.log(name.padEnd(62) + f(G('Cardeal', fn), 1).padStart(9) + f(G('Capitão', fn), 1).padStart(9));
  // curva por turno do próprio deck
  console.log('\nPor turno do próprio deck (1º, 2º, ...): cartas jogadas / soldados convocados / dano causado / material em campo');
  for (const d of ['Cardeal', 'Capitão']) {
    const parts: string[] = [];
    for (let n = 1; n <= 8; n++) {
      const t = ts(d).filter(x => x.n === n); if (t.length < 10) break;
      parts.push(`T${n}: ${f(avg(t.map(x => x.played)), 1)}/${f(avg(t.map(x => x.units)), 1)}/${f(avg(t.map(x => x.dmgOut)), 1)}/${f(avg(t.map(x => x.matEnd)), 0)}`);
    }
    console.log(`${d.padEnd(8)} ${parts.join('  ')}`);
  }
  // uma partida narrada: a mais próxima da mediana de duração
  const med = rounds[Math.floor(rounds.length / 2)];
  const pick = all.find(g => g.rounds === med && g.winner !== null) ?? all[0];
  const g = play(pick.seed, pick.decks[0] === 'Cardeal' ? 0 : 1, pick.first, true);
  mkdirSync('balance-out', { recursive: true });
  writeFileSync(`balance-out/partida-narrada${process.env.TAG ? '-' + process.env.TAG : ''}.txt`, g.text.join('\n'));
  console.log(`\nPartida narrada (semente ${pick.seed}) gravada em balance-out/partida-narrada.txt (${g.text.length} linhas)`);
}
main();
