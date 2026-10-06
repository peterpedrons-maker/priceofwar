// The balance lab: plays lots of AI × AI matches between the two decks (planner AI on both sides, chairs and first player alternating), records what each
// card did, and writes a JSON for `tests/balance-report.ts` to turn into a page.
//
//   N=100 OUT=balance-out/base npx tsx tests/balance-lab.ts                  → 2N matches with the catalog as it is
//   N=100 PATCH=balance-out/patch1.json OUT=balance-out/p1 npx tsx ...        → the same with a patch applied (what-if, nothing changes in the game)
//
// A patch is plain JSON:  { "name": "Mercador custa 2", "cards": { "Mercador da Cruzada": { "abilityCost": 2, "atk": 1 } },
//                           "rules": { "goldPerTurn": 4, "startGold": 10, "goldFromRound": 2, "combatFromRound": 3 },
//                           "decks": { "capitao": { "Reformar Linhas": 2 } } }
// cards: atk / hp / cost / abilityCost / abilityOnce (absolute values) · merge: { "abilities.0.do.0": { "atk": 2 } } changes fields of an effect · decks: copies of a card in the recipe (0 removes it).
import './balance-rules-preload';
import { fork } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { CARD_DEFS, DECK_RECIPES } from '../src/engine/catalog';
import { aiNextAction } from '../src/engine/ai';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { GameState, Seat, GameEvent, Card } from '../src/engine/types';

type Patch = { name?: string; cards?: Record<string, { atk?: number; hp?: number; cost?: number; abilityCost?: number; abilityOnce?: boolean; merge?: Record<string, Record<string, unknown>>; set?: Record<string, unknown> }>; decks?: Record<string, Record<string, number>> };
type Per = { deck: string; won: boolean; generalHp: number; drawn: Record<string, number>; played: Record<string, number>; abilities: Record<string, number>; dmg: Record<string, number>; kills: Record<string, number> };
export type GameRecord = { seed: number; first: Seat; rounds: number; winner: Seat | null; seats: [Per, Per] };

function applyPatch(p: Patch) {
  for (const [name, d] of Object.entries(p.cards ?? {})) {
    const def = CARD_DEFS.find(c => c.name === name) as any;
    if (!def) throw new Error(`patch: unknown card ${name}`);
    if (d.atk !== undefined) def.atk = d.atk; if (d.hp !== undefined) def.hp = d.hp; if (d.cost !== undefined) def.cost = d.cost;
    // set: replaces whole fields of the definition (e.g. "abilities": [...], "passives": [...]) to rewrite what a card does
    if (d.set) Object.assign(def, d.set);
    // merge: "abilities.0.do.0": { "atk": 2 } → copies those fields over the object found at that path of the card definition
    for (const [path, fields] of Object.entries(d.merge ?? {})) {
      const target = path.split('.').reduce((o: any, k) => o?.[k], def);
      if (!target || typeof target !== 'object') throw new Error(`patch: ${name} has nothing at ${path}`);
      Object.assign(target, fields);
    }
    const ab = def.abilities?.find((a: any) => a.on === 'ability');
    if (d.abilityCost !== undefined) { if (!ab) throw new Error(`patch: ${name} has no ability`); ab.cost = d.abilityCost; }
    if (d.abilityOnce !== undefined) { if (!ab) throw new Error(`patch: ${name} has no ability`); ab.once = d.abilityOnce; }
  }
  for (const [id, cards] of Object.entries(p.decks ?? {})) for (const [name, n] of Object.entries(cards)) {
    const r = (DECK_RECIPES as any)[id].cards; if (n <= 0) delete r[name]; else r[name] = n;
  }
}

const bump = (o: Record<string, number>, k: string, n = 1) => { o[k] = (o[k] ?? 0) + n; };

function playGame(seed: number, cardealSeat: Seat, first: Seat): GameRecord {
  const decks = cardealSeat === 0 ? ['cardeal', 'capitao'] : ['capitao', 'cardeal'];
  let s: GameState = createMatch({ seed, decks: decks.map(d => deckSetupFromRecipe(d as any)) as any, first }).state;
  const rng = { rng: seedFrom(seed * 7 + 1) }; const rand = () => nextRandom(rng);
  const seats: [Per, Per] = [0, 1].map(i => ({ deck: decks[i], won: false, generalHp: 0, drawn: {}, played: {}, abilities: {}, dmg: {}, kills: {} })) as any;
  const seeEvents = (events: GameEvent[], seat: Seat, source: string | null) => {
    for (const e of events) {
      if (e.t === 'draw') bump(seats[e.seat].drawn, e.card.name);
      else if (e.t === 'play') bump(seats[e.seat].played, e.card.name);
      else if (e.t === 'ability') bump(seats[e.seat].abilities, e.name);
      else if (e.t === 'damage' && source && e.seat !== seat) bump(seats[seat].dmg, source, e.amount);
      else if (e.t === 'destroyed' && source && e.seat !== seat) bump(seats[seat].kills, source);
    }
  };
  s = (() => { const r = applyAction(s, first, { type: 'begin' }) as any; seeEvents(r.events ?? [], first, null); return r.state; })();
  // the opening hands are dealt by createMatch (its events are not replayed): count them from the state
  seats.forEach((per, i) => { s.players[i].hand.forEach((c: Card) => bump(per.drawn, c.name)); });
  let guard = 0;
  while (s.winner === null && s.turn.round <= 40 && guard++ < 5000) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const act = aiNextAction(s, seat, rand);
    let source: string | null = null;
    if (act.type === 'attack') source = s.players[seat].board[act.from]?.name ?? null;
    else if (act.type === 'ability') source = s.players[seat].board[act.slot]?.name ?? null;
    else if (act.type === 'play') source = s.players[seat].hand.find(c => c.id === act.cardId)?.name ?? null;
    const r = applyAction(s, seat, act);
    if (r.ok === false) break;
    seeEvents(r.events, seat, source);
    s = r.state;
  }
  seats.forEach((per, i) => { per.won = s.winner === i; per.generalHp = s.players[i].board[12]?.hp ?? 0; });
  return { seed, first, rounds: s.turn.round, winner: s.winner, seats };
}

async function main() {
  const patchFile = process.env.PATCH;
  const patch: Patch | null = patchFile ? JSON.parse(readFileSync(patchFile, 'utf8')) : null;
  if (patch) applyPatch(patch);
  if (process.env.WORKER !== undefined) {
    const w = Number(process.env.WORKER), W = Number(process.env.WORKERS), N = Number(process.env.N);
    const out: GameRecord[] = [];
    for (let seed = 1 + w; seed <= N; seed += W) for (const cardealSeat of [0, 1] as Seat[]) out.push(playGame(seed, cardealSeat, ((seed + cardealSeat) % 2) as Seat));
    process.send!(out); process.exit(0);
  }
  const N = Number(process.env.N ?? 60), W = Math.min(4, Number(process.env.WORKERS ?? 4));
  const all: GameRecord[] = [];
  await Promise.all(Array.from({ length: W }, (_, w) => new Promise<void>(res => {
    const ch = fork(process.argv[1], [], { env: { ...process.env, WORKER: String(w), WORKERS: String(W), N: String(N) }, execArgv: process.execArgv });
    ch.on('message', (m: GameRecord[]) => { all.push(...m); });
    ch.on('exit', () => res());
  })));
  const out = process.env.OUT ?? 'balance-out/lab';
  if (patchFile && `${out}.json` === patchFile) throw new Error('OUT would overwrite the patch file: give the result another name');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(`${out}.json`, JSON.stringify({ name: patch?.name ?? 'Catálogo atual', patch, games: all, recipes: JSON.parse(JSON.stringify(DECK_RECIPES)), defs: JSON.parse(JSON.stringify(CARD_DEFS)) }));
  const cw = all.filter(g => g.winner !== null && g.seats[g.winner].deck === 'cardeal').length, cp = all.filter(g => g.winner !== null && g.seats[g.winner].deck === 'capitao').length;
  console.log(`${patch?.name ?? 'Catálogo atual'}: ${all.length} partidas | Cardeal ${cw} × Capitão ${cp} (sem vencedor ${all.length - cw - cp}) | rodadas ${(all.reduce((a, g) => a + g.rounds, 0) / all.length).toFixed(1)} → ${out}.json`);
}
main();
