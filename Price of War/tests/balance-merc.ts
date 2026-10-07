// Laboratório do deck Mercenários (experimental): joga o deck em teste contra o Cardeal e o Capitão (e, de referência, Cardeal × Capitão),
// IA planejadora dos dois lados, cadeiras e quem começa alternando. Nada muda no jogo: as cartas do deck só existem aqui (src/engine/experimental.ts).
//
//   N=100 OUT=balance-out/merc-base npx tsx tests/balance-merc.ts
//   N=100 PATCH=balance-out/m1.json OUT=balance-out/merc-m1 npx tsx tests/balance-merc.ts       (e se...)
//
// Patch: { "name": "...", "cards": { "Livro de Contratos": { "set": {...}, "merge": { "modes.0": { "upkeepFlat": 1 } } }, "Desertor": { "upkeep": 2, "cost": 1, "atk": 3, "hp": 2 } },
//          "deck": { "Lanceiro de Aluguel": 3 }, "rules": { ... } }      (cards: campos absolutos; deck: cópias na receita dos Mercenários, 0 tira)
// MATCHUPS=mercenarios:cardeal,mercenarios:capitao,cardeal:capitao  (padrão: os três)
import './balance-rules-preload';
import { fork } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { getCardDef, CARD_DEFS, DECK_RECIPES } from '../src/engine/catalog';
import { MERCENARIOS_RECIPE, registerMercenarios } from '../src/engine/experimental';
import { aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe, type DeckSetup } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { GameState, Seat, GameEvent, Card } from '../src/engine/types';

registerMercenarios();
// O deck é só de cartas novas: nenhuma do Cardeal nem do Capitão (decisão do dono do jogo).
{
  const old = new Set(CARD_DEFS.map(c => c.name));
  const repeated = [...Object.keys(MERCENARIOS_RECIPE.cards), MERCENARIOS_RECIPE.general].filter(n => old.has(n));
  if (repeated.length) throw new Error(`O deck Mercenários repete cartas do jogo: ${repeated.join(', ')}`);
}

type Patch = { name?: string; cards?: Record<string, Record<string, unknown>>; deck?: Record<string, number>; rules?: unknown };
type Per = { deck: string; won: boolean; generalHp: number; drawn: Record<string, number>; played: Record<string, number>; upkeepPaid: number; dismissed: number; dismissedHand: number; modes: Record<string, number>; relicPlayed: boolean; unitsLost: number };
type Rec = { matchup: string; seed: number; first: Seat; rounds: number; winner: Seat | null; seats: [Per, Per] };

const setupOf = (id: string): DeckSetup => id === 'mercenarios'
  ? { general: MERCENARIOS_RECIPE.general, cards: MERCENARIOS_RECIPE.cards }
  : deckSetupFromRecipe(id as keyof typeof DECK_RECIPES);

function applyPatch(p: Patch) {
  for (const [name, d] of Object.entries(p.cards ?? {})) {
    const def = getCardDef(name) as any;
    if (!def) throw new Error(`patch: carta desconhecida ${name}`);
    const { set, merge, abilityCost, ...fields } = d as any;
    Object.assign(def, fields);
    if (set) Object.assign(def, set);
    for (const [path, f] of Object.entries(merge ?? {})) {
      const target = path.split('.').reduce((o: any, k) => o?.[k], def);
      if (!target || typeof target !== 'object') throw new Error(`patch: ${name} não tem nada em ${path}`);
      Object.assign(target, f);
    }
    if (abilityCost !== undefined) { const ab = def.abilities?.find((a: any) => a.on === 'ability'); if (!ab) throw new Error(`patch: ${name} sem habilidade`); ab.cost = abilityCost; }
  }
  for (const [name, n] of Object.entries(p.deck ?? {})) { if (n <= 0) delete MERCENARIOS_RECIPE.cards[name]; else MERCENARIOS_RECIPE.cards[name] = n; }
}

const bump = (o: Record<string, number>, k: string, n = 1) => { o[k] = (o[k] ?? 0) + n; };

function playGame(matchup: string, seed: number, seatA: Seat, first: Seat): Rec {
  const [a, b] = matchup.split(':');
  const decks = seatA === 0 ? [a, b] : [b, a];
  let s: GameState = createMatch({ seed, decks: decks.map(setupOf) as any, first }).state;
  const rng = { rng: seedFrom(seed * 7 + 1) }; const rand = () => nextRandom(rng);
  const seats: [Per, Per] = [0, 1].map(i => ({ deck: decks[i], won: false, generalHp: 0, drawn: {}, played: {}, upkeepPaid: 0, dismissed: 0, dismissedHand: 0, modes: {}, relicPlayed: false, unitsLost: 0 })) as any;
  const see = (events: GameEvent[]) => {
    for (const e of events) {
      if (e.t === 'draw') bump(seats[e.seat].drawn, e.card.name);
      else if (e.t === 'play') { bump(seats[e.seat].played, e.card.name); if (e.card.cardType === 'Relíquia') seats[e.seat].relicPlayed = true; }
      else if (e.t === 'upkeep') { seats[e.seat].upkeepPaid += e.paid; seats[e.seat].dismissed += e.dismissed; }
      else if (e.t === 'dismissed' && e.toHand) seats[e.seat].dismissedHand++;
      else if (e.t === 'relic_mode') bump(seats[e.seat].modes, e.mode);
      else if (e.t === 'destroyed' && e.card.cardType !== 'General') seats[e.seat].unitsLost++;
    }
  };
  s = (() => { const r = applyAction(s, first, { type: 'begin' }) as any; see(r.events ?? []); return r.state; })();
  seats.forEach((per, i) => { s.players[i].hand.forEach((c: Card) => bump(per.drawn, c.name)); });
  let guard = 0;
  while (s.winner === null && s.turn.round <= 40 && guard++ < 6000) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const r = applyAction(s, seat, aiNextAction(s, seat, rand));
    if (r.ok === false) { console.error('RECUSADO', matchup, seed, r.error); break; }
    see(r.events); s = r.state;
  }
  seats.forEach((per, i) => { per.won = s.winner === i; per.generalHp = s.players[i].board[12]?.hp ?? 0; });
  return { matchup, seed, first, rounds: s.turn.round, winner: s.winner, seats };
}

const pct = (n: number, d: number) => (d ? (100 * n / d).toFixed(1) : '–') + '%';

async function main() {
  const patchFile = process.env.PATCH;
  const patch: Patch | null = patchFile ? JSON.parse(readFileSync(patchFile, 'utf8')) : null;
  if (patch) applyPatch(patch);
  const matchups = (process.env.MATCHUPS ?? 'mercenarios:cardeal,mercenarios:capitao,cardeal:capitao').split(',');
  if (process.env.WORKER !== undefined) {
    const w = Number(process.env.WORKER), W = Number(process.env.WORKERS), N = Number(process.env.N);
    const out: Rec[] = [];
    for (const m of matchups) for (let seed = 1 + w; seed <= N; seed += W) for (const seatA of [0, 1] as Seat[]) out.push(playGame(m, seed, seatA, ((seed + seatA) % 2) as Seat));
    process.send!(out, () => process.exit(0)); return;   // sai só depois de a mensagem ser entregue (senão parte dos resultados se perde)
  }
  const N = Number(process.env.N ?? 60), W = Math.min(4, Number(process.env.WORKERS ?? 4));
  const all: Rec[] = [];
  await Promise.all(Array.from({ length: W }, (_, w) => new Promise<void>(res => {
    const ch = fork(process.argv[1], [], { env: { ...process.env, WORKER: String(w), WORKERS: String(W), N: String(N) }, execArgv: process.execArgv });
    ch.on('message', (m: Rec[]) => { all.push(...m); });
    ch.on('exit', () => res());
  })));
  const out = process.env.OUT ?? 'balance-out/merc';
  if (patchFile && `${out}.json` === patchFile) throw new Error('OUT sobrescreveria o patch: dê outro nome');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(`${out}.json`, JSON.stringify({ name: patch?.name ?? 'Mercenários (base)', patch, games: all, recipe: MERCENARIOS_RECIPE }));
  console.log(`\n== ${patch?.name ?? 'Mercenários (base)'} ==`);
  for (const m of matchups) {
    const [a, b] = m.split(':');
    const g = all.filter(x => x.matchup === m);
    const wins = (id: string) => g.filter(x => x.winner !== null && x.seats[x.winner].deck === id).length;
    const aw = wins(a), bw = wins(b);
    const rounds = g.reduce((n, x) => n + x.rounds, 0) / Math.max(1, g.length);
    console.log(`${a} × ${b}: ${g.length} partidas | ${a} ${aw} (${pct(aw, g.length)}) × ${b} ${bw} (${pct(bw, g.length)}) | sem vencedor ${g.length - aw - bw} | rodadas ${rounds.toFixed(1)}`);
  }
  // o que aconteceu com a manutenção e a Relíquia nas partidas do Mercenários
  const mine = all.flatMap(x => x.seats.filter(p => p.deck === 'mercenarios').map(p => ({ p, x })));
  if (mine.length) {
    const n = mine.length, sum = (f: (p: Per) => number) => mine.reduce((t, { p }) => t + f(p), 0);
    const modes: Record<string, number> = {}; mine.forEach(({ p }) => Object.entries(p.modes).forEach(([k, v]) => bump(modes, k, v)));
    const tm = Object.values(modes).reduce((a, b) => a + b, 0) || 1;
    console.log(`Mercenários (${n} partidas): manutenção paga ${(sum(p => p.upkeepPaid) / n).toFixed(1)} de ouro/partida | dispensas ${(sum(p => p.dismissed) / n).toFixed(1)} (voltaram à mão ${(sum(p => p.dismissedHand) / n).toFixed(1)}) | unidades perdidas ${(sum(p => p.unitsLost) / n).toFixed(1)} | Relíquia jogada em ${pct(mine.filter(({ p }) => p.relicPlayed).length, n)} | modos: ${Object.entries(modes).map(([k, v]) => `${k} ${pct(v, tm)}`).join(', ') || '—'}`);
    const withRelic = mine.filter(({ p }) => p.relicPlayed), without = mine.filter(({ p }) => !p.relicPlayed);
    const winRate = (l: typeof mine) => pct(l.filter(({ p }) => p.won).length, l.length);
    console.log(`  vence com a Relíquia em campo: ${winRate(withRelic)} (${withRelic.length}) · sem ela: ${winRate(without)} (${without.length})`);
    // por carta: quanto a vitória sobe nas partidas em que ela foi comprada
    const names = Object.keys(MERCENARIOS_RECIPE.cards);
    const rows = names.map(name => {
      const dr = mine.filter(({ p }) => (p.drawn[name] ?? 0) > 0), nd = mine.filter(({ p }) => !(p.drawn[name] ?? 0));
      const rate = (l: typeof mine) => (l.length ? l.filter(({ p }) => p.won).length / l.length : 0);
      return { name, copies: MERCENARIOS_RECIPE.cards[name], delta: 100 * (rate(dr) - rate(nd)), played: mine.reduce((t, { p }) => t + (p.played[name] ?? 0), 0) / n };
    }).sort((a, b) => b.delta - a.delta);
    console.log('  carta (cópias) · Δ vitória ao comprar · jogadas/partida');
    rows.forEach(r => console.log(`  ${r.name.padEnd(26)} (${r.copies}) ${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(1)} pts · ${r.played.toFixed(2)}`));
  }
}
main();
