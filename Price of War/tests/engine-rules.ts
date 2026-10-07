import './raw-stats';
// Scenario tests, one per rule:  npx tsx tests/engine-rules.ts
import { CARD_DEFS, getCardDef, requireCardDef } from '../src/engine/catalog';
import { aiNextAction } from '../src/engine/ai';
import { mirrorEvents, mirrorSeats } from '../src/engine/view';
import { applyReward, rewardFor, xpToNext } from '../src/engine/rewards';
import { applyAction, combatOpen, createMatch, deckSetupFromRecipe, newMatchLog, replayMatch } from '../src/engine/game';
import { HAND_LIMIT, getEffectiveAtk, getIncomingDamageReduction, hasVerb, reinforceShield, START_HAND, targetSpecsOf, verbsOn } from '../src/engine/rules';
import { TRIGGER_LABEL, type Action, type Card, type GameEvent, type GameState, type Seat } from '../src/engine/types';

let passed = 0, failed = 0;
const test = (name: string, fn: () => void) => {
  try { fn(); passed++; } catch (e) { failed++; console.log(`  ✗ ${name}\n      ${(e as Error).message}`); }
};
const eq = (a: unknown, b: unknown, msg = '') => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`);
};
const ok = (c: boolean, msg: string) => { if (!c) throw new Error(msg); };

// ── helpers ─────────────────────────────────────────────────────────────────
let n = 0;
const mk = (name: string): Card => {
  const d = requireCardDef(name);
  return { id: `x${++n}`, name: d.name, cardType: d.cardType, atk: d.atk, hp: d.hp, cost: d.cost, effect: d.effect, ...(d.trigger ? { trigger: d.trigger } : {}) };
};
// A started match, seat 0 on turn, empty hands and boards (except Generals), plenty of gold.
const fresh = (opts: { a?: 'capitao' | 'cardeal'; b?: 'capitao' | 'cardeal'; first?: Seat; round?: number; phase?: GameState['turn']['phase'] } = {}): GameState => {
  const first = opts.first ?? 0;
  let s = createMatch({ seed: 7, decks: [deckSetupFromRecipe(opts.a ?? 'cardeal'), deckSetupFromRecipe(opts.b ?? 'capitao')], first }).state;
  const r = applyAction(s, first, { type: 'begin' });
  if (r.ok === false) throw new Error(r.error);
  s = r.state;
  s.players.forEach(p => { p.hand = []; p.gold = 50; });
  if (opts.round) s.turn.round = opts.round;
  if (opts.phase) s.turn.phase = opts.phase;
  return s;
};
const put = (s: GameState, seat: Seat, slot: number, name: string): Card => { const c = mk(name); s.players[seat].board[slot] = c; return c; };
const give = (s: GameState, seat: Seat, name: string): Card => { const c = mk(name); s.players[seat].hand.push(c); return c; };
const act = (s: GameState, seat: Seat, a: Action): { s: GameState; ev: GameEvent[] } => {
  const r = applyAction(s, seat, a);
  if (r.ok === false) throw new Error(`refused: ${r.error}`);
  return { s: r.state, ev: r.events };
};
const refused = (s: GameState, seat: Seat, a: Action, text?: string) => {
  const r = applyAction(s, seat, a);
  if (r.ok === true) throw new Error(`should have been refused: ${JSON.stringify(a)}`);
  if (text) ok(r.error.includes(text), `error "${r.error}" does not mention "${text}"`);
};
const names = (cards: Card[]) => cards.map(c => c.name);
const combat = (s: GameState) => { s.turn.round = 2; s.turn.phase = 'combate'; return s; };

// ── economy and turn flow ───────────────────────────────────────────────────
test('opening: 15 gold, 7 cards each, then 8 after the first draw', () => {
  const created = createMatch({ seed: 1, decks: [deckSetupFromRecipe('cardeal'), deckSetupFromRecipe('capitao')], first: 0 }).state;
  eq(created.players.map(p => [p.gold, p.hand.length]), [[15, START_HAND], [15, START_HAND]]);
  const s = act(created, 0, { type: 'begin' }).s;
  eq([s.players[0].gold, s.players[0].hand.length, s.players[1].hand.length], [15, START_HAND + 1, START_HAND]);
});
test('gold +5 from round 2, stacking; the second player gets it too', () => {
  let s = act(createMatch({ seed: 2, decks: [deckSetupFromRecipe('cardeal'), deckSetupFromRecipe('capitao')], first: 0 }).state, 0, { type: 'begin' }).s;
  const endTurn = () => { const seat = s.turn.active; while (s.turn.active === seat) s = act(s, seat, { type: 'advance' }).s; };
  endTurn(); // seat 0 ends round 1: seat 1 plays round 1 with no gold bonus
  eq([s.turn.round, s.turn.active, s.players[1].gold], [1, 1, 15]);
  endTurn(); // seat 1 ends round 1 -> round 2 starts: seat 0 gets +5
  eq([s.turn.round, s.turn.active, s.players[0].gold], [2, 0, 20]);
  endTurn(); // seat 1 gets +5 too
  eq([s.turn.active, s.players[1].gold], [1, 20]);
  endTurn(); // and it keeps stacking
  eq([s.players[0].gold], [25]);
});
test('combat: closed for the first player in turn 1, open for the second player, open from round 2', () => {
  let s = fresh();
  eq(combatOpen(s), false);
  s = act(s, 0, { type: 'advance' }).s;
  eq(s.turn.phase, 'movimentacao');
  s = act(s, 0, { type: 'advance' }).s;
  eq([s.turn.active, s.turn.phase, combatOpen(s)], [1, 'preparacao', true]);
  s = act(s, 1, { type: 'advance' }).s;
  eq(s.turn.phase, 'combate');
});
test('choose_first: the toss winner picks first or second before begin; nobody else, and not after the match started', () => {
  const create = () => createMatch({ seed: 5, decks: [deckSetupFromRecipe('cardeal'), deckSetupFromRecipe('capitao')], first: 1 }).state;
  const s = create();
  refused(s, 0, { type: 'choose_first', goFirst: true }, 'moeda');
  const first = act(s, 1, { type: 'choose_first', goFirst: true }).s;
  eq([first.turn.first, first.turn.active, first.turn.started], [1, 1, false]);
  const second = act(s, 1, { type: 'choose_first', goFirst: false }).s;
  eq([second.turn.first, second.turn.active], [0, 0]);
  refused(second, 1, { type: 'choose_first', goFirst: true }, 'moeda');   // the other chair is the active one now
  const begun = act(second, 0, { type: 'begin' }).s;
  eq([begun.turn.phase, begun.players[0].hand.length], ['preparacao', 8]);
  refused(begun, 0, { type: 'choose_first', goFirst: false }, 'já começou');
});
test('the round counter goes up after the second player, whoever starts', () => {
  let s = fresh({ first: 1 });
  eq(s.turn.round, 1);
  s = act(s, 1, { type: 'advance' }).s; s = act(s, 1, { type: 'advance' }).s;
  eq([s.turn.active, s.turn.round], [0, 1]);
  for (let i = 0; i < 3; i++) s = act(s, 0, { type: 'advance' }).s; // Preparação → Combate → Movimentação → end
  eq([s.turn.active, s.turn.round], [1, 2]);
});
test('the turn draw has no cap: at the hand limit you still draw (the limit is only checked at the end of the turn)', () => {
  let s = fresh();
  for (let i = 0; i < HAND_LIMIT; i++) give(s, 1, 'Batedor');
  s = act(s, 0, { type: 'advance' }).s; s = act(s, 0, { type: 'advance' }).s;
  eq([s.turn.active, s.players[1].hand.length], [1, HAND_LIMIT + 1]);
});
test('turn start runs Compra then Suprimentos by itself and rests in Preparação', () => {
  const created = createMatch({ seed: 3, decks: [deckSetupFromRecipe('cardeal'), deckSetupFromRecipe('capitao')], first: 0 }).state;
  const r = act(created, 0, { type: 'begin' });
  eq(r.ev.filter(e => e.t === 'phase').map(e => (e as any).phase), ['compra', 'suprimentos', 'preparacao']);
  const order = r.ev.map(e => e.t).filter(t => ['turn_start', 'phase', 'draw'].includes(t));
  eq(order, ['turn_start', 'phase', 'draw', 'phase', 'phase']);
  eq(r.s.turn.phase, 'preparacao');
});
test('full turn with combat open: Preparação → Combate → Movimentação', () => {
  let s = fresh({ round: 2 });
  const seen: string[] = [s.turn.phase];
  while (s.turn.active === 0) { s = act(s, 0, { type: 'advance' }).s; if (s.turn.active === 0) seen.push(s.turn.phase); }
  eq(seen, ['preparacao', 'combate', 'movimentacao']);
});
test('the first turn of the match has no Combate', () => {
  let s = fresh();
  s = act(s, 0, { type: 'advance' }).s;
  eq(s.turn.phase, 'movimentacao');
});
test('skip flags: a card can skip the next Compra / Suprimentos', () => {
  let s = fresh({ round: 2 });
  s.players[1].skip = { compra: true, suprimentos: true };
  const hand = s.players[1].hand.length, gold = s.players[1].gold;
  let ev: GameEvent[] = [];
  while (s.turn.active === 0) { const r = act(s, 0, { type: 'advance' }); s = r.s; ev = r.ev; }
  eq([s.players[1].hand.length, s.players[1].gold, s.turn.phase], [hand, gold, 'preparacao']);
  eq(ev.filter(e => e.t === 'skip').map(e => (e as any).phase), ['compra', 'suprimentos']);
  eq(s.players[1].skip, undefined);
});
test('Movimentação: Táticas only — never units, Relíquias or Terrenos from the hand', () => {
  const s = fresh({ round: 2, phase: 'movimentacao' });
  const soldier = give(s, 0, 'Batedor'); const relic = give(s, 0, 'Cálice da Graça'); const tac = give(s, 0, 'Chamado às Armas');
  refused(s, 0, { type: 'play', cardId: soldier.id, slot: 1 }, 'Movimentação');
  refused(s, 0, { type: 'play', cardId: relic.id, slot: 10 }, 'Movimentação');
  const t = act(s, 0, { type: 'play', cardId: tac.id }).s;
  ok(t.pending?.kind === 'pick', 'Chamado às Armas opens its pick in Movimentação');
});
test('ability phases: General heal and Cavaleiro Hospitalário also work in Movimentação, Mercador only in Preparação', () => {
  let s = fresh({ a: 'cardeal', round: 2, phase: 'movimentacao' });
  put(s, 0, 3, 'Batedor').hp -= 1;
  s = act(s, 0, { type: 'ability', slot: 12, target: 3 }).s;
  const m = put(s, 0, 4, 'Mercador da Cruzada');
  refused(s, 0, { type: 'ability', slot: 4 }, 'Preparação');
  ok(!!m, 'placed');
  const c = fresh({ a: 'cardeal', round: 2, phase: 'combate' }); put(c, 0, 3, 'Batedor');
  refused(c, 0, { type: 'ability', slot: 12, target: 3 }, 'Movimentação');
});
test('Avanço Coordenado is playable in Movimentação, units are not', () => {
  let s = fresh({ a: 'capitao' }); s.turn.phase = 'movimentacao';
  put(s, 0, 1, 'Batedor');
  const av = give(s, 0, 'Avanço Coordenado'); const other = give(s, 0, 'Batedor');
  s = act(s, 0, { type: 'move', from: 1, to: 2 }).s;
  refused(s, 0, { type: 'play', cardId: other.id, slot: 3 }, 'Movimentação');
  s = act(s, 0, { type: 'play', cardId: av.id, target: 2 }).s;
  eq(s.players[0].board[2]!.atk, 4); // Batedor 1 + 3
});
test('over the hand limit at the end of the turn: must discard down to the limit before the turn passes', () => {
  let s = fresh();
  for (let i = 0; i < HAND_LIMIT + 2; i++) give(s, 0, 'Batedor');
  s = act(s, 0, { type: 'advance' }).s;           // -> Movimentação (no combat in the very first turn)
  s = act(s, 0, { type: 'advance' }).s;           // last phase: the turn does not end yet
  eq([s.turn.active, s.pending?.kind, (s.pending as any).count], [0, 'discard', 2]);
  refused(s, 0, { type: 'advance' }, 'pendente');
  refused(s, 0, { type: 'discard', cardIds: [s.players[0].hand[0].id] }, 'exatamente 2');
  refused(s, 1, { type: 'discard', cardIds: [] }, 'turno');
  const ids = s.players[0].hand.slice(0, 2).map(c => c.id);
  s = act(s, 0, { type: 'discard', cardIds: ids }).s;
  eq([s.turn.active, s.pending, s.players[0].hand.length, s.players[0].graveyard.length], [1, null, HAND_LIMIT, 2]);
});
test('exactly at the limit nothing has to be discarded', () => {
  let s = fresh();
  for (let i = 0; i < HAND_LIMIT; i++) give(s, 0, 'Batedor');
  s = act(act(s, 0, { type: 'advance' }).s, 0, { type: 'advance' }).s;
  eq([s.turn.active, s.pending], [1, null]);
});
test('cards that draw can take the hand past the limit during the turn', () => {
  let s = fresh({ a: 'cardeal' });
  for (let i = 0; i < HAND_LIMIT; i++) give(s, 0, 'Batedor');
  const c = give(s, 0, 'Recrutamento Seletivo');
  s = act(s, 0, { type: 'play', cardId: c.id }).s;
  s = act(s, 0, { type: 'choose', cardIds: [(s.pending as any).options[0].id] }).s;
  eq(s.players[0].hand.length, HAND_LIMIT + 1);
});
test('only the active seat can act, and nothing after the match ends', () => {
  const s = fresh();
  refused(s, 1, { type: 'advance' }, 'turno');
  const done = act(s, 0, { type: 'concede' }).s;
  eq(done.winner, 1);
  refused(done, 1, { type: 'advance' }, 'terminou');
});

// ── placing cards ───────────────────────────────────────────────────────────
test('creature placement, gold, slot rules', () => {
  const s = fresh();
  const c = give(s, 0, 'Soldado Tático');
  refused(s, 0, { type: 'play', cardId: c.id, slot: 10 }, 'Relíquia ou Terreno');
  refused(s, 0, { type: 'play', cardId: c.id, slot: 12 }, 'General');
  const r = act(s, 0, { type: 'play', cardId: c.id, slot: 2 }).s;
  eq([r.players[0].board[2]?.name, r.players[0].gold, r.players[0].hand.length], ['Soldado Tático', 48, 0]);
  const c2 = give(r, 0, 'Batedor');
  refused(r, 0, { type: 'play', cardId: c2.id, slot: 2 }, 'ocupado');
  s.players[0].gold = 1;
  refused(s, 0, { type: 'play', cardId: c.id, slot: 3 }, 'Ouro');
});
test('Relíquia goes in slot 10, Terreno in slot 11 only; only in Preparação (not in Movimentação)', () => {
  const s = fresh();
  const rel = give(s, 0, 'Estandarte da Legião');
  const ter = give(s, 0, 'Fortaleza de Pedra');
  refused(s, 0, { type: 'play', cardId: rel.id, slot: 4 }, 'especial');
  refused(s, 0, { type: 'play', cardId: rel.id, slot: 11 });
  refused(s, 0, { type: 'play', cardId: ter.id, slot: 10 });
  const r = act(act(s, 0, { type: 'play', cardId: rel.id, slot: 10 }).s, 0, { type: 'play', cardId: ter.id, slot: 11 }).s;
  eq([r.players[0].board[10]?.name, r.players[0].board[11]?.name], ['Estandarte da Legião', 'Fortaleza de Pedra']);
  const late = fresh(); const c = give(late, 0, 'Batedor'); late.turn.phase = 'movimentacao';
  refused(late, 0, { type: 'play', cardId: c.id, slot: 1 }, 'Movimentação');
});
test('Nobre da Cruzada summons Soldados Leais on free neighbours', () => {
  const s = fresh();
  put(s, 0, 3, 'Batedor');
  const c = give(s, 0, 'Nobre da Cruzada');
  const r = act(s, 0, { type: 'play', cardId: c.id, slot: 2 }).s;
  eq([r.players[0].board[1]?.name, r.players[0].board[3]?.name], ['Soldado Leal', 'Batedor']);
});

// ── combat ──────────────────────────────────────────────────────────────────
test('melee must hit the card in front; ranged can pick a neighbouring lane', () => {
  const s = combat(fresh());
  put(s, 0, 2, 'Soldados da Ordem'); put(s, 0, 1, 'Arqueiro da Ordem');
  put(s, 1, 2, 'Soldado Tático'); put(s, 1, 1, 'Escudeiro de Linha'); put(s, 1, 6, 'Batedor');
  refused(s, 0, { type: 'attack', from: 2, to: 1 }, 'alcance');
  act(s, 0, { type: 'attack', from: 2, to: 2 });
  act(s, 0, { type: 'attack', from: 1, to: 2 }); // ranged: lane 2 is reachable from col 1
  refused(s, 0, { type: 'attack', from: 1, to: 6 }, 'alcance'); // back card shielded by its front... (col 1 is 6-5=1? slot 6 -> lane 1, front 1 occupied)
});
test('back row is reachable only when its own front is empty; General only through a clear lane', () => {
  const s = combat(fresh());
  put(s, 0, 2, 'Cavaleiro da Luz');
  put(s, 1, 7, 'Batedor');
  refused(s, 0, { type: 'attack', from: 2, to: 12 }, 'alcance');
  act(s, 0, { type: 'attack', from: 2, to: 7 });
  const s2 = combat(fresh()); put(s2, 0, 2, 'Cavaleiro da Luz');
  eq(act(s2, 0, { type: 'attack', from: 2, to: 12 }).s.players[1].board[12]!.hp, 30 - 4);
});
test('damage exchange, death goes to the graveyard, equipped weapons follow', () => {
  const s = combat(fresh());
  put(s, 0, 2, 'Cavaleiro da Luz'); // 4/5
  const def = put(s, 1, 2, 'Batedor'); // 1/2
  def.equippedWeapons = [mk('Espada Longa')];
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(r.players[0].board[2]!.hp, 4);
  eq(r.players[1].board[2], null);
  eq(names(r.players[1].graveyard), ['Batedor', 'Espada Longa']);
});
test('a unit attacks once per turn; Arqueiro da Ordem twice', () => {
  const s = combat(fresh());
  put(s, 0, 2, 'Soldados da Ordem'); put(s, 0, 1, 'Arqueiro da Ordem');
  put(s, 1, 2, 'Devotos da Cruzada').hp = 30; // 0 ATK, lots of HP: nobody dies, nothing hits back
  let r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  refused(r, 0, { type: 'attack', from: 2, to: 2 }, 'já atacou');
  r = act(r, 0, { type: 'attack', from: 1, to: 2 }).s;
  r = act(r, 0, { type: 'attack', from: 1, to: 2 }).s;
  refused(r, 0, { type: 'attack', from: 1, to: 2 }, 'já atacou');
});
test('Infantaria in the Retaguarda cannot attack; only Combate allows attacks', () => {
  const s = combat(fresh());
  put(s, 0, 7, 'Soldado Tático'); put(s, 1, 2, 'Batedor');
  refused(s, 0, { type: 'attack', from: 7, to: 2 }, 'Retaguarda');
  const p = fresh(); put(p, 0, 2, 'Cavaleiro da Luz'); put(p, 1, 2, 'Batedor');
  refused(p, 0, { type: 'attack', from: 2, to: 2 }, 'Combate');
});
test('General dies -> the attacker wins', () => {
  const s = combat(fresh());
  put(s, 0, 2, 'Comandante da Ordem'); // 5 ATK
  s.players[1].board[12]!.hp = 3;
  const r = act(s, 0, { type: 'attack', from: 2, to: 12 });
  eq(r.s.winner, 0);
  ok(r.ev.some(e => e.t === 'winner'), 'winner event');
});
test('Estandarte +1 ATK to allies, Veterano +2 in column 3 and +1 in the Vanguarda, Lanceiro -2 to whoever faces it', () => {
  const s = combat(fresh());
  put(s, 0, 10, 'Estandarte da Legião');
  put(s, 0, 2, 'Veterano de Guerra'); // 4 +1 (Estandarte) +2 (column 3) +1 (Vanguarda) = 8
  put(s, 1, 2, 'Devotos da Cruzada').hp = 30;
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(r.players[1].board[2]!.hp, 30 - 8);
  const l = combat(fresh());
  put(l, 0, 2, 'Veterano de Guerra'); // 4 + 2 + 1 - 2 (Lanceiro facing it) = 5
  put(l, 1, 2, 'Lanceiro de Controle').hp = 30;
  eq(act(l, 0, { type: 'attack', from: 2, to: 2 }).s.players[1].board[2]!.hp, 30 - 5);
});
test('Pântano Maldito (-1 ATK to the Vanguarda it faces); Fortaleza and Aurelion reduce damage', () => {
  const s = combat(fresh());
  put(s, 0, 2, 'Soldado Tático'); // 3 ATK
  put(s, 1, 11, 'Pântano Maldito');
  put(s, 1, 2, 'Devotos da Cruzada').hp = 30;
  eq(act(s, 0, { type: 'attack', from: 2, to: 2 }).s.players[1].board[2]!.hp, 30 - 2);
  const f = combat(fresh());
  put(f, 0, 2, 'Cavaleiro da Luz'); // ranged target in the back row
  put(f, 1, 11, 'Fortaleza de Pedra'); put(f, 1, 7, 'Devotos da Cruzada').hp = 30;
  put(f, 0, 1, 'Arqueiro da Ordem'); // 1 ATK, -1 from Fortaleza -> 0
  eq(act(f, 0, { type: 'attack', from: 1, to: 7 }).s.players[1].board[7]!.hp, 30);
  const a = combat(fresh({ b: 'capitao' }));
  put(a, 0, 2, 'Cavaleiro da Luz');
  put(a, 1, 10, 'Estandarte da Legião'); a.players[1].board[10]!.hp = 30;
  // Aurelion's passive covers the relic/terrain slots next to it: 4 ATK - 1 = 3 (lane 1 is clear, so slot 10 is reachable)
  eq(act(a, 0, { type: 'attack', from: 2, to: 10 }).s.players[1].board[10]!.hp, 28); // ...and the Estandarte's own +1 combat HP soaks 1 more
});
test('Comandante da Ordem: Infantaria/Arqueiro allies +1 ATK and +1 HP during combat', () => {
  const s = combat(fresh());
  put(s, 0, 0, 'Comandante da Ordem'); put(s, 0, 2, 'Soldados da Ordem'); // 3/4 -> 4 ATK, 5 effective HP
  put(s, 1, 2, 'Cavaleiro da Luz'); // 4/5
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(r.players[1].board[2]!.hp, 1); // 5 - 4
  eq(r.players[0].board[2]!.hp, 1); // took 4, but the aura's +1 HP absorbed 1 of it: 4 - 3 = 1 (and the bonus is gone afterwards)
  const again = combat(fresh());
  put(again, 0, 0, 'Comandante da Ordem'); put(again, 0, 2, 'Soldados da Ordem'); put(again, 1, 2, 'Devotos da Cruzada').hp = 30;
  eq(act(again, 0, { type: 'attack', from: 2, to: 2 }).s.players[0].board[2]!.hp, 4); // untouched: no permanent +1 HP
});
test('Jorge splashes the Retaguarda card behind a Vanguarda target', () => {
  const s = combat(fresh());
  put(s, 0, 2, 'Jorge, Lança Sagrada');
  put(s, 1, 2, 'Escudeiro de Linha'); put(s, 1, 7, 'Batedor');
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(r.players[1].board[7], null);
});
test('Fanático da Cruzada gets +2 ATK against a General that is not Cardeal Pedro', () => {
  const s = combat(fresh({ a: 'cardeal', b: 'capitao' }));
  put(s, 0, 2, 'Fanático da Cruzada');
  const r = act(s, 0, { type: 'attack', from: 2, to: 12 }).s;
  eq(r.players[1].board[12]!.hp, 30 - 3);
});
test('Atirador da Cruzada draws 2 cards when it dies', () => {
  const s = combat(fresh());
  put(s, 0, 2, 'Cavaleiro da Luz');
  put(s, 1, 2, 'Atirador da Cruzada');
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(r.players[1].hand.length, 2);
});
test('Infiltrado da Ordem: damaging the General blocks its ability next turn', () => {
  const s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Cavaleiro da Luz'); put(s, 1, 5, 'Infiltrado da Ordem');
  let r = act(s, 0, { type: 'attack', from: 2, to: 12 }).s;
  eq(r.players[1].pendingGeneralBlock, true);
  r = act(r, 0, { type: 'advance' }).s; // -> movimentacao
  r = act(r, 0, { type: 'advance' }).s; // -> seat 1 turn
  eq(r.players[1].generalAbilityBlocked, true);
  put(r, 1, 3, 'Batedor'); r.players[1].gold = 10;
  refused(r, 1, { type: 'ability', slot: 12, target: 3 }, 'bloqueada');
});

// ── ambushes ────────────────────────────────────────────────────────────────
const ambushSetup = (cardName: string) => {
  const s = combat(fresh({ a: 'cardeal', b: 'capitao' }));
  const atk = put(s, 0, 2, 'Cavaleiro da Luz');
  const defA = put(s, 1, 2, 'Escudeiro de Linha');
  const emb = give(s, 1, cardName);
  return { s, atk, defA, emb };
};
test('an attack against a defender holding an Emboscada waits for its answer', () => {
  const { s } = ambushSetup('Bloqueio Instantâneo');
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(r.pending?.kind, 'ambush');
  refused(r, 0, { type: 'advance' }, 'pendente');
  refused(r, 0, { type: 'ambush', cardId: null }, 'não é sua');
  const declined = act(r, 1, { type: 'ambush', cardId: null }).s;
  eq([declined.pending, declined.players[1].board[2]!.hp], [null, 1]); // 4 ATK -1 (Escudeiro's own protection) leaves the 2/4 Escudeiro on 1 HP
  eq(declined.players[1].hand.length, 1); // it kept the Emboscada
});
test('Bloqueio Instantâneo cancels the attack when the defender has an adjacent ally', () => {
  const { s, emb } = ambushSetup('Bloqueio Instantâneo');
  put(s, 1, 3, 'Batedor');
  let r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  r = act(r, 1, { type: 'ambush', cardId: emb.id }).s;
  eq([r.players[1].board[2]!.hp, r.players[0].board[2]!.hp, names(r.players[1].graveyard)], [4, 5, ['Bloqueio Instantâneo']]);
});
test('Contra-Manobra swaps in an adjacent ally who takes the hit', () => {
  const { s, emb } = ambushSetup('Contra-Manobra');
  put(s, 1, 3, 'Batedor');
  let r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  r = act(r, 1, { type: 'ambush', cardId: emb.id }).s;
  // the ally (Batedor 1/2) stepped into the targeted slot and took the 4-damage hit instead
  eq([r.players[1].board[2], r.players[1].board[3]?.name, r.players[1].board[3]?.hp], [null, 'Escudeiro de Linha', 4]);
  eq(names(r.players[1].graveyard).sort(), ['Batedor', 'Contra-Manobra']);
});
test('Formação Quebrada pulls the attacker to a random free slot, no damage', () => {
  const { s, emb } = ambushSetup('Formação Quebrada');
  let r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  r = act(r, 1, { type: 'ambush', cardId: emb.id }).s;
  eq(r.players[0].board[2], null);
  eq(r.players[1].board[2]!.hp, 4);
  eq(r.players[0].board.filter((c, i) => i <= 9 && c).length, 1);
});
test('Reforços Ocultos buffs the defender (+2/+1) before damage', () => {
  const { s, emb } = ambushSetup('Reforços Ocultos');
  let r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  r = act(r, 1, { type: 'ambush', cardId: emb.id }).s;
  eq(r.players[1].board[2]!.hp, 4 + 1 - 3); // 4/4 Escudeiro +1 HP, takes 4 -1 (his own protection)
  eq(r.players[0].board[2]!.hp, 5 - 4); // defender ATK 2+2
});
test('Infiltrado da Ordem in the attacker Vanguarda stops the ambush prompt', () => {
  const { s } = ambushSetup('Bloqueio Instantâneo');
  put(s, 0, 4, 'Infiltrado da Ordem');
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(r.pending, null);
});

// ── tactics ─────────────────────────────────────────────────────────────────
test('Reformar Linhas: +3 bonus repositions, to the graveyard', () => {
  const s = fresh({ a: 'capitao' }); const c = give(s, 0, 'Reformar Linhas');
  const r = act(s, 0, { type: 'play', cardId: c.id }).s;
  eq([r.turn.bonusRepositions, names(r.players[0].graveyard)], [3, ['Reformar Linhas']]);
});
test('Tributo de Guerra: free and +1 gold', () => {
  const s = fresh(); const c = give(s, 0, 'Tributo de Guerra');
  eq(act(s, 0, { type: 'play', cardId: c.id }).s.players[0].gold, 51);
});
test('Trabuco de Cerco: 2 damage to every enemy unit and the General', () => {
  const s = fresh(); const c = give(s, 0, 'Trabuco de Cerco');
  put(s, 1, 0, 'Batedor'); put(s, 1, 5, 'Soldados da Ordem');
  const r = act(s, 0, { type: 'play', cardId: c.id }).s;
  // the Batedor falls; the Soldados da Ordem behind it (2 HP left) steps forward (it is tagged Reforço)
  eq([r.players[1].board[0]?.name, r.players[1].board[0]?.hp, r.players[1].board[5], r.players[1].board[12]!.hp], ['Soldados da Ordem', 2, null, 28]);
});
test('targeted Táticas validate before spending anything', () => {
  const s = fresh({ a: 'capitao' });
  const c = give(s, 0, 'Avanço Coordenado'); put(s, 0, 1, 'Batedor');
  refused(s, 0, { type: 'play', cardId: c.id, target: 1 }, 'não se moveu');
  eq(s.players[0].gold, 50);
});
test('Avanço Coordenado after a move; Linha Fechada; Ordem de Retirada', () => {
  let s = fresh({ a: 'capitao' }); s.turn.phase = 'movimentacao';
  put(s, 0, 1, 'Batedor'); put(s, 0, 3, 'Soldado Tático');
  s = act(s, 0, { type: 'move', from: 1, to: 2 }).s;
  s.turn.phase = 'preparacao';
  const av = give(s, 0, 'Avanço Coordenado');
  s = act(s, 0, { type: 'play', cardId: av.id, target: 2 }).s;
  eq(s.players[0].board[2]!.atk, 4); // Batedor 1 + 3
  const lf = give(s, 0, 'Linha Fechada');
  s = act(s, 0, { type: 'play', cardId: lf.id, target: 2 }).s; // neighbours of slot 2: 1 (empty) and 3
  eq(s.players[0].board[3]!.dmgReduction, 2);
  const or = give(s, 0, 'Ordem de Retirada');
  s = act(s, 0, { type: 'play', cardId: or.id, target: 3 }).s;
  eq([s.players[0].board[3], s.players[0].board[8]?.hp], [null, 5]);
});
test('Reposicionamento Rápido displaces an enemy to an adjacent free slot', () => {
  const s = fresh({ a: 'capitao' }); const c = give(s, 0, 'Reposicionamento Rápido');
  put(s, 1, 2, 'Batedor');
  const r = act(s, 0, { type: 'play', cardId: c.id, target: 2 }).s;
  eq(r.players[1].board[2], null);
  eq(r.players[1].board.filter((x, i) => i <= 9 && x).length, 1);
});
test('Balestra: 3 damage to a unit (kills it); Catapulta: 2 to a whole row', () => {
  let s = fresh(); const b = give(s, 0, 'Balestra de Precisão'); put(s, 1, 2, 'Escudeiro de Linha');
  s = act(s, 0, { type: 'play', cardId: b.id, target: 2 }).s;
  eq(s.players[1].board[2]!.hp, 1);
  const cat = give(s, 0, 'Catapulta de Guerra'); put(s, 1, 0, 'Batedor'); put(s, 1, 4, 'Batedor');
  s = act(s, 0, { type: 'play', cardId: cat.id, target: 3 }).s;
  eq([s.players[1].board[0], s.players[1].board[4], s.players[1].board[2]], [null, null, null]);
});
test('equipment: right unit types only, stays attached, stats change', () => {
  const s = fresh({ a: 'capitao', b: 'cardeal' }); const sw = give(s, 0, 'Espada Longa'); const ar = give(s, 0, 'Flechas Venenosas');
  put(s, 0, 0, 'Soldado Tático'); put(s, 0, 1, 'Arqueiro da Ordem');
  refused(s, 0, { type: 'play', cardId: ar.id, target: 0 }, 'tipo certo');
  let r = act(s, 0, { type: 'play', cardId: sw.id, target: 0 }).s;
  eq([r.players[0].board[0]!.atk, names(r.players[0].board[0]!.equippedWeapons!), r.players[0].graveyard.length], [5, ['Espada Longa'], 0]);
  r = act(r, 0, { type: 'play', cardId: ar.id, target: 1 }).s;
  eq(r.players[0].board[1]!.atk, 2);
});
test('Emboscadas and not-yet-implemented cards cannot be played', () => {
  const s = fresh(); const e = give(s, 0, 'Reforços Ocultos');
  refused(s, 0, { type: 'play', cardId: e.id, slot: 1 }, 'Emboscadas');
});

// ── picks ───────────────────────────────────────────────────────────────────
test('Retorno do Soldado: pick a soldier from the graveyard', () => {
  let s = fresh(); const c = give(s, 0, 'Retorno do Soldado');
  refused(s, 0, { type: 'play', cardId: c.id }, 'cemitério');
  s.players[0].graveyard.push(mk('Batedor'));
  s = act(s, 0, { type: 'play', cardId: c.id }).s;
  eq(s.pending?.kind, 'pick');
  const opt = (s.pending as any).options[0];
  s = act(s, 0, { type: 'choose', cardIds: [opt.id] }).s;
  eq([names(s.players[0].hand), names(s.players[0].graveyard)], [['Batedor'], ['Retorno do Soldado']]);
});
test('deck searches: Graal, Doutrina, Recrutamento', () => {
  let s = fresh(); const g = give(s, 0, 'Graal da Dádiva');
  s = act(s, 0, { type: 'play', cardId: g.id }).s;
  eq(names((s.pending as any).options), ['Cálice da Graça']);
  s = act(s, 0, { type: 'choose', cardIds: [(s.pending as any).options[0].id] }).s;
  eq(names(s.players[0].hand), ['Cálice da Graça']);
  const r = give(s, 0, 'Recrutamento Seletivo');
  s = act(s, 0, { type: 'play', cardId: r.id }).s;
  ok((s.pending as any).options.every((o: Card) => ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'].includes(o.cardType)), 'only soldiers');
  refused(s, 0, { type: 'choose', cardIds: [] });
  refused(s, 1, { type: 'choose', cardIds: [(s.pending as any).options[0].id] }, 'não é sua');
});
test('Recrutar Veteranos: keep 1-2 of the top 4, the rest go to the bottom', () => {
  let s = fresh(); const c = give(s, 0, 'Recrutar Veteranos');
  const before = s.players[0].drawPile.length;
  s = act(s, 0, { type: 'play', cardId: c.id }).s;
  const pend: any = s.pending;
  eq(pend.options.length, 4);
  refused(s, 0, { type: 'choose', cardIds: pend.options.slice(0, 3).map((o: Card) => o.id) });
  s = act(s, 0, { type: 'choose', cardIds: pend.options.slice(0, 2).map((o: Card) => o.id) }).s;
  eq([s.players[0].hand.length, s.pending], [2, null]);
  ok(s.players[0].drawPile.length >= before - 4 + 2, 'two cards went to the bottom of the deck');
});
test('Chamado às Armas summons 0-ATK soldiers into free Vanguarda slots', () => {
  let s = fresh(); const c = give(s, 0, 'Chamado às Armas');
  put(s, 0, 0, 'Batedor');
  s = act(s, 0, { type: 'play', cardId: c.id }).s;
  const pend: any = s.pending;
  eq(names(pend.options), ['Devotos da Cruzada', 'Recruta Devoto']);
  s = act(s, 0, { type: 'choose', cardIds: pend.options.map((o: Card) => o.id) }).s;
  eq([s.players[0].board[1]?.name, s.players[0].board[2]?.name], ['Devotos da Cruzada', 'Recruta Devoto']);
});

// ── abilities ───────────────────────────────────────────────────────────────
test('Cardeal Pedro: pay 2, heal 1 (2 with Cálice), once per turn; Recruta Devoto gains ATK', () => {
  let s = fresh({ a: 'cardeal' });
  put(s, 0, 1, 'Recruta Devoto');
  s = act(s, 0, { type: 'ability', slot: 12, target: 1 }).s;
  eq([s.players[0].board[1]!.hp, s.players[0].board[1]!.atk, s.players[0].gold], [3, 1, 48]);
  refused(s, 0, { type: 'ability', slot: 12, target: 1 }, 'já foi usada');
  const t = fresh({ a: 'cardeal' }); put(t, 0, 10, 'Cálice da Graça'); put(t, 0, 1, 'Batedor');
  eq(act(t, 0, { type: 'ability', slot: 12, target: 1 }).s.players[0].board[1]!.hp, 4);
});
test('Cavaleiro Hospitalário: heal a damaged ally and hit an enemy Vanguarda card', () => {
  let s = fresh({ a: 'cardeal' });
  put(s, 0, 4, 'Cavaleiro Hospitalário'); const hurt = put(s, 0, 1, 'Soldados da Ordem'); hurt.hp = 1;
  put(s, 1, 2, 'Batedor');
  refused(s, 0, { type: 'ability', slot: 4, target: 1 }, 'Vanguarda');
  s = act(s, 0, { type: 'ability', slot: 4, target: 1, target2: 2 }).s;
  eq([s.players[0].board[1]!.hp, s.players[1].board[2]!.hp], [2, 1]);
  refused(s, 0, { type: 'ability', slot: 4, target: 1, target2: 2 }, 'já foi usada');
});
test('Mercador da Cruzada: pay 1 gold, see 2, keep 1, the other goes to the graveyard', () => {
  let s = fresh({ a: 'cardeal' });
  put(s, 0, 1, 'Mercador da Cruzada');
  const gold = s.players[0].gold;
  s = act(s, 0, { type: 'ability', slot: 1 }).s;
  eq(s.players[0].gold, gold - 1);
  const pend: any = s.pending;
  eq(pend.options.length, 2);
  const before = s.players[0].drawPile.length, grave = s.players[0].graveyard.length;
  s = act(s, 0, { type: 'choose', cardIds: [pend.options[0].id] }).s;
  eq([s.players[0].hand.length, s.players[0].drawPile.length, s.players[0].graveyard.length], [1, before, grave + 1]);
  s = fresh({ a: 'cardeal' }); put(s, 0, 1, 'Mercador da Cruzada'); s.players[0].gold = 0;
  refused(s, 0, { type: 'ability', slot: 1 }, 'Ouro');
});
test('Intendente do Exército refills the hand to 2 at turn start', () => {
  let s = fresh({ a: 'cardeal', b: 'cardeal' });
  put(s, 1, 1, 'Intendente do Exército');
  s = act(s, 0, { type: 'advance' }).s; s = act(s, 0, { type: 'advance' }).s;
  ok(s.players[1].hand.length >= 2, 'drew up to 2');
});

// ── movement ────────────────────────────────────────────────────────────────
test('reposition: adjacent only, once per unit per turn, only in Movimentação', () => {
  let s = fresh({ a: 'capitao' }); put(s, 0, 1, 'Batedor');
  refused(s, 0, { type: 'move', from: 1, to: 2 }, 'Movimentação');
  s.turn.phase = 'movimentacao';
  refused(s, 0, { type: 'move', from: 1, to: 4 }, 'adjacente');
  s = act(s, 0, { type: 'move', from: 1, to: 2 }).s;
  refused(s, 0, { type: 'move', from: 2, to: 3 }, 'já se reposicionou');
});
test('Reformar Linhas bonus moves let a moved unit move again', () => {
  let s = fresh({ a: 'capitao' }); put(s, 0, 1, 'Batedor'); s.turn.phase = 'movimentacao'; s.turn.bonusRepositions = 1;
  s = act(s, 0, { type: 'move', from: 1, to: 2 }).s;
  s = act(s, 0, { type: 'move', from: 2, to: 3 }).s;
  eq(s.turn.bonusRepositions, 0);
});
test('swap with an occupied adjacent slot; Cavaleiro Tático swaps anywhere in its row', () => {
  let s = fresh({ a: 'capitao' }); put(s, 0, 0, 'Cavaleiro Tático'); put(s, 0, 4, 'Batedor'); s.turn.phase = 'movimentacao';
  s = act(s, 0, { type: 'move', from: 0, to: 4 }).s;
  eq([s.players[0].board[0]?.name, s.players[0].board[4]?.name], ['Batedor', 'Cavaleiro Tático']);
});
test('Capitão de Formação: neighbours +2 ATK after it moves, gone at its owner\'s next turn', () => {
  let s = fresh({ a: 'capitao' }); put(s, 0, 0, 'Capitão de Formação'); put(s, 0, 2, 'Batedor'); s.turn.phase = 'movimentacao';
  s = act(s, 0, { type: 'move', from: 0, to: 1 }).s;
  eq(s.players[0].board[2]!.formationBuffAtk, 2);
  s = act(s, 0, { type: 'advance' }).s; while (s.turn.active === 1) s = act(s, 1, { type: 'advance' }).s;
  eq([s.turn.active, s.players[0].board[2]!.formationBuffAtk], [0, 0]);
});
// ── Reforço ─────────────────────────────────────────────────────────────────
test('Reforço: when a Vanguarda card falls, the Infantaria behind it steps forward with an Escudo', () => {
  let s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Cavaleiro da Luz'); put(s, 1, 2, 'Devotos da Cruzada'); put(s, 1, 7, 'Soldados da Ordem');
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 });
  const foe = r.s.players[1].board;
  eq([foe[2]?.name, foe[7]], ['Soldados da Ordem', null]);
  eq([foe[2]!.shield, foe[2]!.pendingCombatBonus], [reinforceShield({ name: 'Soldados da Ordem' }), undefined]);
  const ev = r.ev.find(e => e.t === 'reinforce') as any;
  eq([ev.seat, ev.from, ev.to, ev.card.name], [1, 7, 2, 'Soldados da Ordem']);
  ok(r.ev.some(e => e.t === 'shield' && (e as any).slot === 2 && (e as any).shield === reinforceShield({ name: 'Soldados da Ordem' })), 'the Escudo is announced');
  ok(r.ev.findIndex(e => e.t === 'destroyed') < r.ev.findIndex(e => e.t === 'reinforce'), 'the fall comes before the step forward');
});
test('Reforço: an Infantaria that is NOT tagged Reforço stays where it is when the card in front falls', () => {
  const s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Cavaleiro da Luz'); put(s, 1, 2, 'Devotos da Cruzada'); put(s, 1, 7, 'Escudeiro de Linha');
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 });
  eq([r.s.players[1].board[2], r.s.players[1].board[7]?.name], [null, 'Escudeiro de Linha']);
  ok(!r.ev.some(e => e.t === 'reinforce'), 'no Reforço without the tag');
});
test('Reforço: the Escudo comes only when the reserve ADVANCES — an Infantaria standing in the Retaguarda has none', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao' });
  const inf = give(s, 0, 'Escudeiro de Linha');
  s = act(s, 0, { type: 'play', cardId: inf.id, slot: 7 }).s;
  eq([s.players[0].board[7]?.name, s.players[0].board[7]?.shield, s.players[0].board[7]?.block], ['Escudeiro de Linha', undefined, undefined]);
});
test('Reforço: only Infantaria steps forward, and only when the front slot is really empty', () => {
  let s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Cavaleiro da Luz'); put(s, 1, 2, 'Devotos da Cruzada'); put(s, 1, 7, 'Arqueiro da Ordem');
  let r = act(s, 0, { type: 'attack', from: 2, to: 2 });
  eq([r.s.players[1].board[2], r.s.players[1].board[7]?.name], [null, 'Arqueiro da Ordem']);
  ok(!r.ev.some(e => e.t === 'reinforce'), 'an archer does not reinforce');
  s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Batedor'); put(s, 1, 2, 'Veterano de Guerra'); put(s, 1, 7, 'Escudeiro de Linha');
  r = act(s, 0, { type: 'attack', from: 2, to: 2 });
  eq([r.s.players[1].board[2]?.name, r.s.players[1].board[7]?.name], ['Veterano de Guerra', 'Escudeiro de Linha']);
  ok(!r.ev.some(e => e.t === 'reinforce'), 'nothing falls, nothing moves');
});
test('Reforço: also after effects — Balestra, and Catapulta clearing a whole row', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao' });
  put(s, 1, 1, 'Recruta Devoto'); put(s, 1, 6, 'Soldados da Ordem');
  const bal = give(s, 0, 'Balestra de Precisão');
  let r = act(s, 0, { type: 'play', cardId: bal.id, target: 1 });
  eq([r.s.players[1].board[1]?.name, r.s.players[1].board[6]], ['Soldados da Ordem', null]);
  s = fresh({ a: 'cardeal', b: 'capitao' });
  [0, 1, 2].forEach(i => { put(s, 1, i, 'Recruta Devoto'); put(s, 1, i + 5, 'Soldados da Ordem'); });
  const cat = give(s, 0, 'Catapulta de Guerra');
  r = act(s, 0, { type: 'play', cardId: cat.id, target: 0 });
  eq([0, 1, 2].map(i => r.s.players[1].board[i]?.name), ['Soldados da Ordem', 'Soldados da Ordem', 'Soldados da Ordem']);
  eq([5, 6, 7].map(i => r.s.players[1].board[i]), [null, null, null]);
});

// ── Escudo and Bloqueio ─────────────────────────────────────────────────────
const shielded = (name: string, shield: number, block = false) => { const c = mk(name); if (shield) c.shield = shield; if (block) c.block = true; return c; };
test('Escudo: a weak hit only wears it down — HP is untouched', () => {
  let s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Batedor');                                    // ATK 1
  s.players[1].board[2] = shielded('Devotos da Cruzada', 3);
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 });
  const d = r.s.players[1].board[2]!;
  eq([d.shield, d.hp], [2, 3]);
  const hit = r.ev.find(e => e.t === 'shield_hit') as any;
  eq([hit.absorbed, hit.left, hit.broken, hit.blocked], [1, 2, false, false]);
});
test('Escudo: a hit bigger than it breaks it and the rest goes through to HP', () => {
  let s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Cavaleiro da Luz');                           // ATK 4
  s.players[1].board[2] = shielded('Veterano de Guerra', 3);  // HP 3 -> takes 1
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 });
  const d = r.s.players[1].board[2]!;
  eq([d.shield, d.hp], [undefined, 2]);
  eq((r.ev.find(e => e.t === 'shield_hit') as any).broken, true);
});
test('Bloqueio: negates one whole hit however big, then it is gone', () => {
  let s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Cavaleiro da Luz').hp = 20; put(s, 0, 3, 'Cavaleiro da Luz').hp = 20;   // sturdy: the retaliation still lands
  s.players[1].board[2] = shielded('Veterano de Guerra', 0, true);
  let r = act(s, 0, { type: 'attack', from: 2, to: 2 });
  eq([r.s.players[1].board[2]!.block, r.s.players[1].board[2]!.hp], [undefined, 3]);
  eq((r.ev.find(e => e.t === 'shield_hit') as any).blocked, true);
  r = act(r.s, 0, { type: 'attack', from: 3, to: 2 });         // the second hit finds nothing in the way
  ok((r.s.players[1].board[2]?.hp ?? 0) < 3, 'the second blow lands (the Veterano falls)');
});
test('Escudo / Bloqueio also soak damage from effects, and the attacker still takes the normal retaliation', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao' });
  s.players[1].board[1] = shielded('Veterano de Guerra', 2);
  const bal = give(s, 0, 'Balestra de Precisão');             // 3 damage
  const r = act(s, 0, { type: 'play', cardId: bal.id, target: 1 });
  eq([r.s.players[1].board[1]!.shield, r.s.players[1].board[1]!.hp], [undefined, 2]);
  let t = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(t, 0, 2, 'Batedor'); t.players[0].board[2]!.hp = 5;
  t.players[1].board[2] = { ...shielded('Soldados da Ordem', 0, true) };   // ATK 3
  const r2 = act(t, 0, { type: 'attack', from: 2, to: 2 });
  eq(r2.s.players[0].board[2]!.hp, 2);                        // the Batedor still takes the 3 back
});

test('Batedor moves once, free, right after attacking', () => {
  let s = combat(fresh({ a: 'capitao' })); put(s, 0, 2, 'Batedor'); put(s, 1, 2, 'Devotos da Cruzada').hp = 30;
  s = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(s.turn.batedorFree, 2);
  refused(s, 0, { type: 'move', from: 2, to: 8 }, 'adjacente');
  s = act(s, 0, { type: 'move', from: 2, to: 7 }).s;
  eq([s.players[0].board[7]?.name, s.turn.batedorFree], ['Batedor', null]);
});
test('Aurelion: up to 2 units that moved get +2/+1 for the next combat; Soldado Tático swaps at end of turn', () => {
  let s = fresh({ a: 'capitao' }); s.turn.phase = 'movimentacao';
  put(s, 0, 1, 'Batedor'); put(s, 0, 5, 'Soldado Tático'); put(s, 0, 6, 'Escudeiro de Linha');
  s = act(s, 0, { type: 'move', from: 1, to: 0 }).s;
  s = act(s, 0, { type: 'advance' }).s;
  eq(s.players[0].board[0]?.pendingCombatBonus, { atk: 2, hp: 1 });
  eq([s.players[0].board[5]?.name, s.players[0].board[6]?.name], ['Escudeiro de Linha', 'Soldado Tático']);
});

// ── the AI uses everything ──────────────────────────────────────────────────
const aiTurn = (s: GameState, seat: Seat): { s: GameState; played: string[] } => {
  const played: string[] = [];
  let guard = 0;
  while (s.turn.active === seat && s.winner === null && guard++ < 200) {
    const a = aiNextAction(s, seat, () => 0.37);
    if (a.type === 'play') played.push(s.players[seat].hand.find(h => h.id === a.cardId)!.name);
    s = act(s, seat, a).s;
  }
  return { s, played };
};
test('AI plays Relíquia and Terreno into their own slots', () => {
  let s = fresh({ a: 'capitao', b: 'capitao', first: 1 });
  s.turn.active = 1; s.turn.first = 1;
  give(s, 1, 'Estandarte da Legião'); give(s, 1, 'Fortaleza de Pedra'); give(s, 1, 'Tributo de Guerra'); give(s, 1, 'Batedor');
  const r = aiTurn(s, 1);
  eq([r.s.players[1].board[10]?.name, r.s.players[1].board[11]?.name], ['Estandarte da Legião', 'Fortaleza de Pedra']);
  ok(r.played.includes('Batedor'), 'and still fields the unit: ' + r.played);
});
test('AI uses Balestra on a unit it can kill, Trabuco/Catapulta when they pay off, equips on its front line', () => {
  let s = fresh({ a: 'capitao', b: 'cardeal', first: 1 });
  s.turn.active = 1; s.turn.first = 1;
  put(s, 0, 2, 'Escudeiro de Linha'); put(s, 0, 0, 'Batedor'); put(s, 0, 4, 'Batedor'); put(s, 0, 5, 'Batedor'); put(s, 0, 7, 'Batedor');
  put(s, 1, 1, 'Soldados da Ordem');
  give(s, 1, 'Balestra de Precisão'); give(s, 1, 'Espada Longa'); give(s, 1, 'Trabuco de Cerco');
  const r = aiTurn(s, 1);
  ok(r.played.includes('Balestra de Precisão') || r.played.includes('Trabuco de Cerco'), 'removal was used: ' + r.played);
  ok(r.played.includes('Espada Longa'), 'equip was used: ' + r.played);
  ok(r.s.players[1].board.some((c, i) => i <= 4 && c?.equippedWeapons?.length), 'sword rides on a front-line unit');
});
test('AI repositions: brings back-row Infantaria forward (or into the General lane), and covers an exposed General lane', () => {
  let s = fresh({ a: 'capitao', b: 'cardeal', first: 1 });
  s.turn.active = 1; s.turn.first = 1; s.turn.phase = 'movimentacao';
  s.players[1].generalAbilityUses = 1; // keep the General's heal out of this test
  put(s, 1, 6, 'Soldados da Ordem'); // 3/4 Infantaria stuck in the back row: cannot attack there
  put(s, 0, 2, 'Soldado Tático');    // the enemy has something that can hit
  const a1 = aiNextAction(s, 1, () => 0.5);
  eq(a1.type, 'move');
  s = act(s, 1, a1).s;
  ok(s.players[1].board.some((c, i) => (i <= 4 || i === 7) && c?.name === 'Soldados da Ordem'), 'moved to the Vanguarda or into the General\'s lane: ' + JSON.stringify(s.players[1].board.map(c => c?.name ?? null)));
  // exposed lane: units everywhere except columns 2
  let t = fresh({ a: 'capitao', b: 'cardeal', first: 1 });
  t.turn.active = 1; t.turn.first = 1; t.turn.phase = 'movimentacao';
  t.players[1].generalAbilityUses = 1;
  put(t, 1, 1, 'Soldados da Ordem'); put(t, 1, 3, 'Soldados da Ordem'); put(t, 0, 2, 'Soldado Tático');
  const moves: string[] = [];
  for (let i = 0; i < 6 && t.turn.active === 1; i++) { const a = aiNextAction(t, 1, () => 0.5); if (a.type === 'move') moves.push(`${a.from}>${a.to}`); t = act(t, 1, a).s; }
  ok(!!(t.players[1].board[2] || t.players[1].board[7]), 'the General lane is covered after moving: ' + moves.join(','));
});
test('AI uses the free Batedor move only when it helps; Avanço Coordenado after moving', () => {
  let s = fresh({ a: 'capitao', b: 'capitao', first: 1 });
  s.turn.active = 1; s.turn.first = 1; s.turn.round = 2; s.turn.phase = 'movimentacao';
  put(s, 1, 7, 'Soldado Tático'); put(s, 0, 2, 'Batedor');
  const av = give(s, 1, 'Avanço Coordenado');
  const seen: string[] = [];
  for (let i = 0; i < 6 && s.turn.active === 1; i++) { const a = aiNextAction(s, 1, () => 0.5); seen.push(a.type); s = act(s, 1, a).s; }
  ok(seen.includes('move'), 'it moved: ' + seen);
  ok(seen.indexOf('play') > seen.indexOf('move'), 'then played Avanço Coordenado: ' + seen);
  void av;
});
test('AI discards down to the limit by itself', () => {
  let s = fresh({ first: 1 });
  s.turn.active = 1; s.turn.first = 1;
  for (let i = 0; i < 14; i++) give(s, 1, i % 2 ? 'Reforços Ocultos' : 'Cavaleiro da Luz');
  s.players[1].gold = 0;
  const r = aiTurn(s, 1);
  eq([r.s.turn.active, r.s.players[1].hand.length], [0, HAND_LIMIT]);
});
test('mirroring swaps the chairs and is its own inverse', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao', first: 1 });
  s.turn.active = 1; s.turn.first = 1;
  put(s, 0, 2, 'Batedor'); put(s, 1, 2, 'Soldado Tático');
  s.winner = null;
  const m = mirrorSeats(s);
  eq([m.players[0].general, m.players[1].general], [s.players[1].general, s.players[0].general]);
  eq([m.turn.active, m.turn.first], [0, 0]);
  eq(JSON.stringify(mirrorSeats(m)), JSON.stringify(s));
  // an engine run on the mirror behaves like one run on the original, seat for seat
  const a1 = act(s, 1, { type: 'advance' });
  const a2 = act(m, 0, { type: 'advance' });
  eq(JSON.stringify(mirrorSeats(a2.s).turn), JSON.stringify(a1.s.turn));
  eq(JSON.stringify(mirrorEvents(a2.ev).map((e: any) => e.t)), JSON.stringify(a1.ev.map((e: any) => e.t)));
});
test('rewards: wins, losses, too-short matches, giving up, and level-ups', () => {
  const base = { vsBot: false, ending: 'general' as const, rounds: 6, steps: 60 };
  eq(rewardFor({ ...base, won: true }), { xp: 60, coroas: 25, reason: 'win' });
  eq(rewardFor({ ...base, won: false }), { xp: 25, coroas: 8, reason: 'loss' });
  eq(rewardFor({ ...base, won: true, vsBot: true }), { xp: 35, coroas: 12, reason: 'win' });
  eq(rewardFor({ ...base, won: false, ending: 'concede' }), { xp: 0, coroas: 0, reason: 'abandoned' });
  eq(rewardFor({ ...base, won: false, ending: 'timeout' }).reason, 'abandoned');
  eq(rewardFor({ ...base, won: true, ending: 'timeout' }).reason, 'win');          // the player who stayed is still rewarded
  eq(rewardFor({ ...base, won: true, rounds: 2 }).reason, 'too_short');
  eq(rewardFor({ ...base, won: true, steps: 5 }).reason, 'too_short');
  eq(xpToNext(1), 100); eq(xpToNext(3), 200);
  eq(applyReward({ level: 1, xp: 90, coroas: 150 }, { xp: 60, coroas: 25 }), { level: 2, xp: 50, coroas: 175, levelsGained: 1 });
  eq(applyReward({ level: 1, xp: 0, coroas: 0 }, { xp: 500, coroas: 0 }).level, 4);
});
test('a replay of the recorded actions reaches the same state (and a cheated action is rejected)', () => {
  const opts = { seed: 11, decks: [deckSetupFromRecipe('cardeal'), deckSetupFromRecipe('capitao')] as [any, any], first: 0 as Seat };
  const log = newMatchLog(opts);
  let s = createMatch(opts).state;
  log.actions.push({ seat: 0, action: { type: 'begin' } }); s = act(s, 0, { type: 'begin' }).s;
  for (let i = 0; i < 60 && s.winner === null; i++) {
    const seat = (s.pending ? s.pending.seat : s.turn.active) as Seat;
    const a = aiNextAction(s, seat, () => 0.5);
    log.actions.push({ seat, action: a }); s = act(s, seat, a).s;
  }
  const r = replayMatch(log);
  ok(r.ok === true, 'replay ok');
  eq(JSON.stringify((r as any).state), JSON.stringify(s));
  const tampered = { ...log, actions: [...log.actions, { seat: 0 as Seat, action: { type: 'play', cardId: 'nope', slot: 1 } as Action }] };
  ok(replayMatch(tampered).ok === false, 'a made-up action fails the replay');
});

test('vocabulary: 7 triggers with a label each, card triggers are valid, and no card text says "invocar"', () => {
  eq(Object.keys(TRIGGER_LABEL).length, 7);
  for (const d of CARD_DEFS) {
    if (d.trigger) ok(d.trigger in TRIGGER_LABEL, `${d.name}: unknown trigger ${d.trigger}`);
    ok(!/invoc|invoq/i.test(d.effect), `${d.name}: "invocar" should be "convocar"`);
  }
});
test('the deck is finite: drawn and searched cards never come back, an empty deck draws nothing', () => {
  let s = fresh();
  const p = s.players[0];
  const count = (arr: string[], n: string) => arr.filter(x => x === n).length;
  eq(p.deckList.length, p.drawPile.length);
  // a search takes that copy out of the deck for good
  const before = { n: p.deckList.length, cálice: count(p.deckList, 'Cálice da Graça') };
  const g = give(s, 0, 'Graal da Dádiva');
  s = act(s, 0, { type: 'play', cardId: g.id }).s;
  s = act(s, 0, { type: 'choose', cardIds: [(s.pending as any).options[0].id] }).s;
  eq([s.players[0].deckList.length, s.players[0].drawPile.length], [before.n - 1, before.n - 1]);
  eq(count(s.players[0].deckList, 'Cálice da Graça'), before.cálice - 1);
  // the draw pile runs dry: nothing is drawn and nothing is reshuffled in
  s.players[0].drawPile = ['Batedor']; s.players[0].deckList = ['Batedor'];
  s.players[0].hand = [];
  const m = give(s, 0, 'Mercador da Cruzada'); s.players[0].hand = [];
  put(s, 0, 1, 'Mercador da Cruzada');
  s = act(s, 0, { type: 'ability', slot: 1 }).s;
  eq((s.pending as any).options.length, 1);   // only one card was left to reveal
  s = act(s, 0, { type: 'choose', cardIds: [(s.pending as any).options[0].id] }).s;
  eq([s.players[0].deckList.length, s.players[0].drawPile.length, names(s.players[0].hand)], [0, 0, ['Batedor']]);
  void m;
});
test('the catalog describes every card by effect types, with nothing left half-defined', () => {
  const defs = CARD_DEFS;
  for (const d of defs) {
    const abilities = d.abilities ?? [];
    if (d.cardType === 'Tática') ok(abilities.some(a => a.on === 'play'), `${d.name}: a Tática needs a "play" ability`);
    if (d.cardType === 'Emboscada') ok(abilities.some(a => a.on === 'ambush'), `${d.name}: an Emboscada needs an "ambush" ability`);
    if (d.cardType !== 'Tática') ok(!abilities.some(a => a.on === 'play'), `${d.name}: only a Tática has a "play" ability`);
    if (d.cardType !== 'Emboscada') ok(!abilities.some(a => a.on === 'ambush'), `${d.name}: only an Emboscada has an "ambush" ability`);
    abilities.forEach(a => {
      ok(a.do.length > 0, `${d.name}: an ability with no effects`);
      a.do.forEach(v => {
        if ('target' in v && v.target) ok(!!v.target.prompt, `${d.name}: a target without the sentence shown to the player`);
        if (v.kind === 'summon_token') ok(!!getCardDef(v.token), `${d.name}: unknown token ${v.token}`);
      });
    });
    // every Tática with a board choice has exactly one for the single `target` of a play action
    if (d.cardType === 'Tática') ok(targetSpecsOf(verbsOn(d.name, 'play')).length <= 1, `${d.name}: a Tática can ask for only one board choice`);
    if (d.cardType === 'General') ok(!!d.faction, `${d.name}: a General needs a faction`);
  }
  // the vocabulary tags on the cards agree with what the cards actually do
  ok(CARD_DEFS.filter(d => d.trigger === 'reforco').every(d => hasVerb(d.name, 'reinforce')), 'a Reforço-tagged card must carry the reinforce effect');
  ok(CARD_DEFS.filter(d => hasVerb(d.name, 'reinforce')).every(d => d.trigger === 'reforco'), 'a card with the reinforce effect must carry the Reforço tag');
  ok(CARD_DEFS.filter(d => d.trigger === 'comando').every(d => (d.abilities ?? []).some(a => a.on === 'ability' || a.on === 'turn_start')), 'a Comando card must have an active or start-of-turn ability');
});
test('Escudeiro de Linha: in the Vanguarda, the unit right behind takes 1 less damage (only that one, only while he is in front)', () => {
  let s = fresh({ a: 'capitao', b: 'cardeal' });
  put(s, 0, 2, 'Escudeiro de Linha'); put(s, 0, 7, 'Soldado Tático'); put(s, 0, 8, 'Batedor'); put(s, 0, 3, 'Batedor');
  const board = s.players[0].board;
  eq([getIncomingDamageReduction(7, board), getIncomingDamageReduction(8, board), getIncomingDamageReduction(3, board), getIncomingDamageReduction(2, board)], [1, 0, 0, 1]); // slot 2 = the Escudeiro himself: -1 on his own
  // he moved to the back: his protection no longer applies
  s.players[0].board[2] = null; put(s, 0, 6, 'Escudeiro de Linha');
  eq(getIncomingDamageReduction(7, s.players[0].board), 0);
});

// ── trigger audit: every effect fires when it should, and only then ──────────────────────────────────────────
const atkOf = (s: GameState, seat: Seat, slot: number) => getEffectiveAtk(s.players[seat].board[slot]!, slot, s.players[seat].board, s.players[1 - seat].board);
const endTurnOf = (s: GameState, seat: Seat) => { let g = 0; while (s.turn.active === seat && s.winner === null && g++ < 20) s = act(s, seat, { type: 'advance' }).s; return s; };

test('Capitão de Formação (Manobra): moving it gives its neighbours +2 ATK, through the foe turn, gone when its owner\'s next turn starts', () => {
  let s = fresh({ a: 'capitao', phase: 'movimentacao' }); s.turn.round = 3;
  put(s, 0, 2, 'Capitão de Formação'); put(s, 0, 1, 'Soldado Tático'); put(s, 0, 4, 'Escudeiro de Linha'); put(s, 0, 0, 'Batedor');
  s = act(s, 0, { type: 'move', from: 2, to: 3 }).s;                       // neighbours of slot 3: 2 (empty now) and 4
  eq([s.players[0].board[4]!.formationBuffAtk, s.players[0].board[1]!.formationBuffAtk ?? 0], [2, 0], 'only the neighbours');
  eq(atkOf(s, 0, 4), 4, 'Escudeiro 2 +2');
  s = endTurnOf(s, 0);
  eq(atkOf(s, 0, 4), 4, 'still on during the foe turn');
  s = endTurnOf(s, 1);
  eq(s.players[0].board[4]!.formationBuffAtk ?? 0, 0, 'gone once the owner\'s next turn starts');
});
test('Capitão de Formação does not fire for other units moving, nor for a move that only swaps another card', () => {
  let s = fresh({ a: 'capitao', phase: 'movimentacao' }); s.turn.round = 3;
  put(s, 0, 2, 'Capitão de Formação'); put(s, 0, 1, 'Soldado Tático'); put(s, 0, 0, 'Batedor');
  s = act(s, 0, { type: 'move', from: 0, to: 5 }).s;
  eq(s.players[0].board.map(c => c?.formationBuffAtk ?? 0).join(''), '0000000000000');
});
test('Aurelion: only 2 of the units that moved are buffed, units that stayed put are not, and the bonus is spent in the next combat', () => {
  let s = fresh({ a: 'capitao', phase: 'movimentacao' }); s.turn.round = 3;
  put(s, 0, 0, 'Batedor'); put(s, 0, 1, 'Soldado Tático'); put(s, 0, 2, 'Escudeiro de Linha'); put(s, 0, 4, 'Lanceiro de Controle');
  s.turn.bonusRepositions = 3;
  s = act(s, 0, { type: 'move', from: 0, to: 5 }).s;
  s = act(s, 0, { type: 'move', from: 1, to: 6 }).s;
  s = act(s, 0, { type: 'move', from: 2, to: 7 }).s;
  s = act(s, 0, { type: 'advance' }).s;
  const buffed = s.players[0].board.map((c, i) => (c?.pendingCombatBonus ? i : -1)).filter(i => i >= 0);
  eq(buffed.length, 2, 'up to 2 units');
  ok(!s.players[0].board[4]!.pendingCombatBonus, 'the unit that did not move gets nothing');
});
test('Capitão balance pass: Batedor grows +1 ATK after each attack it survives; Cavaleiro Tático\'s move gives its neighbours +1 ATK; Reformar Linhas draws a card', () => {
  let s = combat(fresh({ a: 'capitao', b: 'cardeal' }));
  put(s, 0, 2, 'Batedor'); put(s, 1, 2, 'Devotos da Cruzada').hp = 30;
  s = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(s.players[0].board[2]!.atk, 2, 'Batedor 1 -> 2');
  let t = fresh({ a: 'capitao', phase: 'movimentacao' }); t.turn.round = 3;
  put(t, 0, 0, 'Cavaleiro Tático'); put(t, 0, 2, 'Batedor');
  t = act(t, 0, { type: 'move', from: 0, to: 1 }).s;
  eq(t.players[0].board[2]!.formationBuffAtk, 1, 'neighbour of the Cavaleiro');
  let u = fresh({ a: 'capitao' }); u.turn.phase = 'preparacao';
  const rl = give(u, 0, 'Reformar Linhas'); const hand = u.players[0].hand.length, pile = u.players[0].drawPile.length;
  u = act(u, 0, { type: 'play', cardId: rl.id }).s;
  eq([u.players[0].hand.length, u.players[0].drawPile.length], [hand, pile - 1], 'played one, drew one');
});
test('Lanceiro de Controle (Postura): the foe in front has -2 ATK only while the Lanceiro is in the Vanguarda', () => {
  const s = fresh({ a: 'capitao', b: 'cardeal' });
  put(s, 0, 2, 'Lanceiro de Controle'); put(s, 1, 2, 'Soldado Tático');
  eq(atkOf(s, 1, 2), 1, 'Soldado Tático 3 -2');
  const t = fresh({ a: 'capitao', b: 'cardeal' });
  put(t, 0, 7, 'Lanceiro de Controle'); put(t, 1, 2, 'Soldado Tático');
  eq(atkOf(t, 1, 2), 3, 'Lanceiro in the Retaguarda: no effect');
});
test('Jorge, Lança Sagrada (Ofensiva): hitting the Vanguarda also deals 2 to the card behind', () => {
  let s = fresh({ a: 'capitao', b: 'cardeal' }); combat(s);
  put(s, 0, 2, 'Jorge, Lança Sagrada'); put(s, 1, 2, 'Soldado Tático'); put(s, 1, 7, 'Escudeiro de Linha');
  const before = s.players[1].board[7]!.hp;
  s = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(s.players[1].board[7]!.hp, before - 2, 'the card behind takes 2');
});
test('Fanático da Cruzada (Ofensiva): +2 ATK against a General of the other faction, not against units', () => {
  const s = fresh({ a: 'cardeal', b: 'capitao' }); combat(s);
  put(s, 0, 2, 'Fanático da Cruzada');
  const base = atkOf(s, 0, 2);
  let t = act(s, 0, { type: 'attack', from: 2, to: 12 });
  ok(t.ev.some(e => e.t === 'attack'), 'the general can be reached');
  const gHp = s.players[1].board[12]!.hp;
  eq(gHp - t.s.players[1].board[12]!.hp, base + 2, 'ATK +2 on the General');
  put(s, 1, 2, 'Batedor'); put(s, 0, 3, 'Fanático da Cruzada');
});
test('Intendente do Exército (Comando): at the start of its owner\'s turn the hand is refilled to 2', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao', phase: 'movimentacao' }); s.turn.round = 3;
  put(s, 0, 2, 'Intendente do Exército');
  s = endTurnOf(s, 0); s = endTurnOf(s, 1);
  ok(s.turn.active === 0, 'back to seat 0');
  ok(s.players[0].hand.length >= 2, 'at least 2 cards in hand');
});
test('Atirador da Cruzada (Queda): destroyed, its owner draws 2', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao' }); combat(s);
  put(s, 1, 2, 'Atirador da Cruzada'); put(s, 0, 2, 'Jorge, Lança Sagrada');
  s.turn.active = 0;
  const hand = s.players[1].hand.length;
  s = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(s.players[1].board[2], null, 'the Atirador fell');
  eq(s.players[1].hand.length, hand + 2, 'drew 2');
});
test('Nobre da Cruzada (Convocação): placing it summons Soldados Leais into the free slots beside it', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao', round: 3 }); s.turn.phase = 'preparacao';
  const nobre = give(s, 0, 'Nobre da Cruzada');
  s = act(s, 0, { type: 'play', cardId: nobre.id, slot: 2 }).s;
  eq([s.players[0].board[1]?.name, s.players[0].board[3]?.name], ['Soldado Leal', 'Soldado Leal']);
});
test('Pântano Maldito: enemies in the Vanguarda have -1 ATK, the Retaguarda is spared', () => {
  const s = fresh({ a: 'cardeal', b: 'capitao' });
  put(s, 0, 11, 'Pântano Maldito'); put(s, 1, 2, 'Soldado Tático'); put(s, 1, 7, 'Arqueiro da Ordem');
  eq(atkOf(s, 1, 2), 2, 'Vanguarda: 3 -1');
  eq(atkOf(s, 1, 7), 1, 'Retaguarda: unchanged');
});
test('Catapulta de Guerra: 2 damage to every unit of one enemy row', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao', round: 3 }); s.turn.phase = 'preparacao';
  put(s, 1, 0, 'Escudeiro de Linha'); put(s, 1, 1, 'Soldado Tático'); put(s, 1, 6, 'Arqueiro da Ordem');
  const c = give(s, 0, 'Catapulta de Guerra');
  const hp = [s.players[1].board[0]!.hp, s.players[1].board[1]!.hp, s.players[1].board[6]!.hp];
  s = act(s, 0, { type: 'play', cardId: c.id, target: 1 }).s;
  eq([s.players[1].board[0]!.hp, s.players[1].board[1]!.hp, s.players[1].board[6]!.hp], [hp[0] - 2, hp[1] - 2, hp[2]], 'the Vanguarda row only');
});
test('Armadura de Guerra / Couraça Reforçada / Flechas Venenosas equip the units they name, and refuse the others', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao', round: 3 }); s.turn.phase = 'preparacao';
  put(s, 0, 0, 'Soldado Tático'); put(s, 0, 1, 'Arqueiro da Ordem'); put(s, 0, 2, 'Cavaleiro Tático');
  const arm = give(s, 0, 'Armadura de Guerra'), cur = give(s, 0, 'Couraça Reforçada'), fle = give(s, 0, 'Flechas Venenosas');
  refused(s, 0, { type: 'play', cardId: arm.id, target: 2 });                         // Cavalaria: no
  refused(s, 0, { type: 'play', cardId: fle.id, target: 0 });                         // Infantaria: no
  const hp0 = s.players[0].board[0]!.hp, hp1 = s.players[0].board[1]!.hp, a1 = s.players[0].board[1]!.atk;
  s = act(s, 0, { type: 'play', cardId: arm.id, target: 0 }).s;
  s = act(s, 0, { type: 'play', cardId: cur.id, target: 1 }).s;
  s = act(s, 0, { type: 'play', cardId: fle.id, target: 1 }).s;
  eq([s.players[0].board[0]!.hp, s.players[0].board[1]!.hp, s.players[0].board[1]!.atk], [hp0 + 2, hp1 + 1, a1 + 1]);
});
test('Doutrina Renovada: take a Tática from the deck to the hand', () => {
  let s = fresh({ a: 'cardeal', b: 'capitao', round: 3 }); s.turn.phase = 'preparacao';
  const c = give(s, 0, 'Doutrina Renovada');
  const before = s.players[0].deckList.filter(n => requireCardDef(n).cardType === 'Tática').length;
  s = act(s, 0, { type: 'play', cardId: c.id }).s;
  ok(s.pending?.kind === 'pick', 'a pick prompt opens');
  const pick = (s.pending as any).options[0];
  eq(requireCardDef(pick.name).cardType, 'Tática');
  s = act(s, 0, { type: 'choose', cardIds: [pick.id] }).s;
  ok(s.players[0].hand.some(h => h.name === pick.name), 'it is in the hand (as a fresh copy)');
  eq(s.players[0].deckList.filter(n => requireCardDef(n).cardType === 'Tática').length, before - 1);
});
test('Reposicionamento Rápido moves a foe to a free neighbouring slot; Linha Fechada\'s -2 stays for good; Ordem de Retirada sends the unit back and gives +2 HP', () => {
  let s = fresh({ a: 'capitao', b: 'cardeal', round: 3 }); s.turn.phase = 'preparacao';
  put(s, 1, 2, 'Soldado Tático');
  const r = give(s, 0, 'Reposicionamento Rápido');
  s = act(s, 0, { type: 'play', cardId: r.id, target: 2 }).s;
  eq([s.players[1].board[2], [1, 3].some(i => s.players[1].board[i]?.name === 'Soldado Tático')], [null, true]);
  put(s, 0, 2, 'Escudeiro de Linha'); put(s, 0, 1, 'Batedor'); put(s, 0, 3, 'Batedor');
  const lf = give(s, 0, 'Linha Fechada');
  s = act(s, 0, { type: 'play', cardId: lf.id, target: 2 }).s;
  eq([s.players[0].board[1]!.dmgReduction, s.players[0].board[3]!.dmgReduction], [2, 2]);
  s = endTurnOf(s, 0); s = endTurnOf(s, 1);
  eq(s.players[0].board[1]!.dmgReduction, 2, 'permanent');
  s.turn.phase = 'preparacao';
  const hp = s.players[0].board[2]!.hp;
  const ro = give(s, 0, 'Ordem de Retirada');
  s = act(s, 0, { type: 'play', cardId: ro.id, target: 2 }).s;
  eq([s.players[0].board[2], s.players[0].board.findIndex(c => c?.name === 'Escudeiro de Linha') >= 5], [null, true]);
  eq(s.players[0].board.find(c => c?.name === 'Escudeiro de Linha')!.hp, hp + 2);
});

// The same triggers with the SECOND player as owner: nothing may assume seat 0.
for (const me of [0, 1] as Seat[]) {
  const foe = (1 - me) as Seat;
  const start = (deck: 'capitao' | 'cardeal', other: 'capitao' | 'cardeal', phase?: GameState['turn']['phase']) =>
    fresh({ a: me === 0 ? deck : other, b: me === 1 ? deck : other, first: me, round: 3, phase });
  test(`seat ${me}: Capitão de Formação buffs its neighbours when it moves, and the buff ends when its owner's next turn starts`, () => {
    let s = start('capitao', 'cardeal', 'movimentacao');
    put(s, me, 2, 'Capitão de Formação'); put(s, me, 4, 'Escudeiro de Linha');
    s = act(s, me, { type: 'move', from: 2, to: 3 }).s;
    eq(s.players[me].board[4]!.formationBuffAtk, 2);
    s = endTurnOf(s, me); s = endTurnOf(s, foe);
    eq(s.players[me].board[4]!.formationBuffAtk ?? 0, 0);
  });
  test(`seat ${me}: Aurelion grants +2/+1 to the unit that moved, at the end of the turn`, () => {
    let s = start('capitao', 'cardeal', 'movimentacao');
    put(s, me, 1, 'Batedor');
    s = act(s, me, { type: 'move', from: 1, to: 0 }).s;
    s = act(s, me, { type: 'advance' }).s;
    eq(s.players[me].board[0]?.pendingCombatBonus, { atk: 2, hp: 1 });
  });
  test(`seat ${me}: Jorge splashes the card behind, Fanático hits a General for +2, Atirador draws 2 when it falls`, () => {
    let s = start('cardeal', 'capitao', 'combate');
    put(s, me, 2, 'Jorge, Lança Sagrada'); put(s, foe, 2, 'Atirador da Cruzada'); put(s, foe, 7, 'Escudeiro de Linha');
    const behind = s.players[foe].board[7]!.hp, hand = s.players[foe].hand.length;
    s = act(s, me, { type: 'attack', from: 2, to: 2 }).s;
    eq(s.players[foe].board[7]!.hp, behind - 2, 'splash');
    eq(s.players[foe].board[2], null, 'Atirador fell');
    eq(s.players[foe].hand.length, hand + 2, 'Queda draws 2');
  });
  test(`seat ${me}: Nobre summons its Soldados Leais, Soldados da Ordem reinforce, Tática equip works`, () => {
    let s = start('cardeal', 'capitao', 'preparacao');
    const nobre = give(s, me, 'Nobre da Cruzada');
    s = act(s, me, { type: 'play', cardId: nobre.id, slot: 2 }).s;
    eq([s.players[me].board[1]?.name, s.players[me].board[3]?.name], ['Soldado Leal', 'Soldado Leal']);
    put(s, me, 0, 'Soldado Tático');
    const sword = give(s, me, 'Espada Longa'); const atk = s.players[me].board[0]!.atk;
    s = act(s, me, { type: 'play', cardId: sword.id, target: 0 }).s;
    eq(s.players[me].board[0]!.atk, atk + 2);
  });
  test(`seat ${me}: Cavaleiro Hospitalário (Comando) heals an ally and hits a foe in the Vanguarda; the Cardeal heals for 2 gold`, () => {
    let s = start('cardeal', 'capitao', 'preparacao');
    put(s, me, 2, 'Cavaleiro Hospitalário'); put(s, me, 3, 'Soldado Tático'); put(s, foe, 1, 'Escudeiro de Linha');
    s.players[me].board[3]!.hp -= 2; const hurt = s.players[me].board[3]!.hp, foeHp = s.players[foe].board[1]!.hp;
    s = act(s, me, { type: 'ability', slot: 2, target: 3, target2: 1 }).s;
    eq([s.players[me].board[3]!.hp, s.players[foe].board[1]!.hp], [hurt + 1, foeHp - 1]);
    const gold = s.players[me].gold;
    s = act(s, me, { type: 'ability', slot: 12, target: 3 }).s;
    eq([s.players[me].gold, s.players[me].board[3]!.hp], [gold - 2, hurt + 2]);
  });
}

// ── Mercenários: manutenção, dispensa, Rescisão, modos da Relíquia ───────────────────────────────────────────────────
const freshMerc = (): GameState => {
  let s = createMatch({ seed: 7, decks: [deckSetupFromRecipe('mercenarios'), deckSetupFromRecipe('capitao')], first: 0 }).state;
  s = act(s, 0, { type: 'begin' }).s;
  s.players.forEach(p => { p.hand = []; p.gold = 20; });
  return s;
};
// Passes seat 0's turn and the opponent's, until seat 0's next turn starts (stops at the upkeep prompt, if it opens).
const toNextTurn = (s: GameState): GameState => {
  const leave = (until: (st: GameState) => boolean) => { for (let g = 0; g < 40 && !until(s); g++) s = act(s, s.pending ? s.pending.seat : s.turn.active, { type: 'advance' }).s; };
  leave(st => st.turn.active !== 0);
  leave(st => st.turn.active === 0);
  return s;
};
test('Mercenários: the upkeep prompt opens at Suprimentos; paying keeps the unit, dismissing sends it to the graveyard', () => {
  let s = freshMerc();
  const esp = put(s, 0, 2, 'Espadachim do Soldo'), duel = put(s, 0, 1, 'Duelista Livre'), lanc = put(s, 0, 3, 'Lanceiro de Aluguel');
  s = toNextTurn(s);
  ok(s.pending?.kind === 'upkeep' && s.pending.seat === 0, 'no upkeep prompt');
  eq((s.pending as any).entries.map((e: any) => [e.cardId, e.cost]), [[duel.id, 2], [esp.id, 2], [lanc.id, 1]]);
  eq(s.turn.phase, 'suprimentos');
  const gold = s.players[0].gold;                       // 20 + 5 (round 2)
  refused(s, 0, { type: 'play', cardId: 'nada', slot: 4 }, 'pendente');
  const r = act(s, 0, { type: 'upkeep', keep: [esp.id, duel.id] });
  s = r.s;
  eq([s.players[0].gold, s.turn.phase, s.pending], [gold - 4, 'preparacao', null]);
  eq([s.players[0].board[3], names(s.players[0].graveyard)], [null, ['Lanceiro de Aluguel']]);
  ok(r.ev.some(e => e.t === 'upkeep' && e.paid === 4 && e.dismissed === 1), 'upkeep event');
});
test('Mercenários: not enough gold to pay everyone is refused; dismissing is the way out', () => {
  let s = freshMerc();
  const esp = put(s, 0, 2, 'Espadachim do Soldo'), duel = put(s, 0, 1, 'Duelista Livre');
  s = toNextTurn(s);
  s.players[0].gold = 3;                                  // as duas juntas custam 4
  refused(s, 0, { type: 'upkeep', keep: [esp.id, duel.id] }, 'Ouro insuficiente');
  s = act(s, 0, { type: 'upkeep', keep: [esp.id] }).s;
  eq([s.players[0].board[2]?.name, s.players[0].board[1]], ['Espadachim do Soldo', null]);
});
test('Mercenários: a dismissed Duelista Livre goes back to the hand; a dismissed Desertor pays Rescisão (draw 1)', () => {
  let s = freshMerc();
  const duel = put(s, 0, 1, 'Duelista Livre'), des = put(s, 0, 3, 'Desertor');
  s = toNextTurn(s);
  const handBefore = s.players[0].hand.length;
  s = act(s, 0, { type: 'upkeep', keep: [] }).s;
  ok(s.players[0].hand.some(c => c.name === 'Duelista Livre'), 'Duelista did not return to the hand');
  ok(!s.players[0].graveyard.some(c => c.name === 'Duelista Livre'), 'Duelista went to the graveyard');
  eq(names(s.players[0].graveyard), ['Desertor']);
  eq(s.players[0].hand.length, handBefore + 2, 'Duelista back + Rescisão draw');
  void duel; void des;
});
test('Relíquia com modos: Soldo em Dobro gives +1 ATK to cards with upkeep; the mode changes only in Movimentação', () => {
  let s = freshMerc();
  s.players[0].board[10] = { ...mk('Livro de Contratos'), mode: 'soldo' };
  put(s, 0, 2, 'Espadachim do Soldo'); put(s, 0, 3, 'Sentinela Fiel');
  const b = s.players[0].board, foe = s.players[1].board;
  eq([getEffectiveAtk(b[2]!, 2, b, foe), getEffectiveAtk(b[3]!, 3, b, foe)], [5, 2]);   // Sentinela has no upkeep
  refused(s, 0, { type: 'relic_mode', mode: 'saque' }, 'fim do turno');
  s.turn.phase = 'movimentacao';
  refused(s, 0, { type: 'relic_mode', mode: 'nao-existe' }, 'não existe');
  const r = act(s, 0, { type: 'relic_mode', mode: 'saque' });
  eq(r.s.players[0].board[10]?.mode, 'saque');
  ok(r.ev.some(e => e.t === 'relic_mode' && e.mode === 'saque'), 'relic_mode event');
  const b2 = r.s.players[0].board;
  eq(getEffectiveAtk(b2[2]!, 2, b2, foe), 4);
});
test('Relíquia com modos: Saque draws one card per enemy unit destroyed, at most 1 per cycle', () => {
  let s = freshMerc();
  s.players[0].board[10] = { ...mk('Livro de Contratos'), mode: 'saque' };
  put(s, 0, 1, 'Espadachim do Soldo'); put(s, 0, 2, 'Espadachim do Soldo');
  put(s, 1, 1, 'Batedor'); put(s, 1, 2, 'Batedor');
  combat(s);
  const before = s.players[0].hand.length;
  s = act(s, 0, { type: 'attack', from: 1, to: 1 }).s;
  eq(s.players[0].hand.length, before + 1);
  s = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq([s.players[0].hand.length, names(s.players[1].graveyard).length], [before + 1, 2]);   // the second kill is over the cap
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
