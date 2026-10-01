// Scenario tests, one per rule:  npx tsx tests/engine-rules.ts
import { requireCardDef } from '../src/engine/catalog';
import { applyAction, combatOpen, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import type { Action, Card, GameEvent, GameState, Seat } from '../src/engine/types';

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
  return { id: `x${++n}`, name: d.name, cardType: d.cardType, atk: d.atk, hp: d.hp, cost: d.cost, effect: d.effect };
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
test('opening: 15 gold, 10 cards each, then 11 after the first draw', () => {
  const created = createMatch({ seed: 1, decks: [deckSetupFromRecipe('cardeal'), deckSetupFromRecipe('capitao')], first: 0 }).state;
  eq(created.players.map(p => [p.gold, p.hand.length]), [[15, 10], [15, 10]]);
  const s = act(created, 0, { type: 'begin' }).s;
  eq([s.players[0].gold, s.players[0].hand.length, s.players[1].hand.length], [15, 11, 10]);
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
test('the round counter goes up after the second player, whoever starts', () => {
  let s = fresh({ first: 1 });
  eq(s.turn.round, 1);
  s = act(s, 1, { type: 'advance' }).s; s = act(s, 1, { type: 'advance' }).s;
  eq([s.turn.active, s.turn.round], [0, 1]);
  s = act(s, 0, { type: 'advance' }).s; s = act(s, 0, { type: 'advance' }).s; s = act(s, 0, { type: 'advance' }).s;
  eq([s.turn.active, s.turn.round], [1, 2]);
});
test('draw at every turn start, but not above the hand limit of 12', () => {
  let s = fresh();
  for (let i = 0; i < 12; i++) give(s, 1, 'Batedor');
  s = act(s, 0, { type: 'advance' }).s; s = act(s, 0, { type: 'advance' }).s;
  eq(s.players[1].hand.length, 12);
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
test('Relíquia goes in slot 10, Terreno in slot 11 only; only in Preparação', () => {
  const s = fresh();
  const rel = give(s, 0, 'Estandarte da Legião');
  const ter = give(s, 0, 'Fortaleza de Pedra');
  refused(s, 0, { type: 'play', cardId: rel.id, slot: 4 }, 'especial');
  refused(s, 0, { type: 'play', cardId: rel.id, slot: 11 });
  refused(s, 0, { type: 'play', cardId: ter.id, slot: 10 });
  const r = act(act(s, 0, { type: 'play', cardId: rel.id, slot: 10 }).s, 0, { type: 'play', cardId: ter.id, slot: 11 }).s;
  eq([r.players[0].board[10]?.name, r.players[0].board[11]?.name], ['Estandarte da Legião', 'Fortaleza de Pedra']);
  const late = fresh(); const c = give(late, 0, 'Batedor'); late.turn.phase = 'movimentacao';
  refused(late, 0, { type: 'play', cardId: c.id, slot: 1 }, 'Preparação');
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
  eq(act(s2, 0, { type: 'attack', from: 2, to: 12 }).s.players[1].board[12]!.hp, 20 - 4);
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
test('Estandarte +1 ATK to allies, Veterano +2 in column 3, Lanceiro -1 to whoever faces it', () => {
  const s = combat(fresh());
  put(s, 0, 10, 'Estandarte da Legião');
  put(s, 0, 2, 'Veterano de Guerra'); // 4 +1 (Estandarte) +2 (column 3) = 7
  put(s, 1, 2, 'Devotos da Cruzada').hp = 30;
  const r = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(r.players[1].board[2]!.hp, 30 - 7);
  const l = combat(fresh());
  put(l, 0, 2, 'Veterano de Guerra'); // 4 + 2 - 1 (Lanceiro facing it) = 5
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
  eq(act(a, 0, { type: 'attack', from: 2, to: 10 }).s.players[1].board[10]!.hp, 27);
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
  eq(r.players[1].board[12]!.hp, 20 - 3);
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
  eq([declined.pending, declined.players[1].board[2]], [null, null]); // 4 ATK kills the 2/4 Escudeiro
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
  eq(r.players[1].board[2]!.hp, 4 + 1 - 4); // 4/4 Escudeiro +1 HP, takes 4
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
  put(s, 1, 0, 'Batedor'); put(s, 1, 5, 'Soldado Tático');
  const r = act(s, 0, { type: 'play', cardId: c.id }).s;
  eq([r.players[1].board[0], r.players[1].board[5]!.hp, r.players[1].board[12]!.hp], [null, 1, 18]);
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
  eq(s.players[0].board[2]!.atk, 3);
  const lf = give(s, 0, 'Linha Fechada');
  s = act(s, 0, { type: 'play', cardId: lf.id, target: 2 }).s; // neighbours of slot 2: 1 (empty) and 3
  eq(s.players[0].board[3]!.dmgReduction, 1);
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
test('Mercador da Cruzada: see 2, keep 1, the other goes under the deck', () => {
  let s = fresh({ a: 'cardeal' });
  put(s, 0, 1, 'Mercador da Cruzada');
  s = act(s, 0, { type: 'ability', slot: 1 }).s;
  const pend: any = s.pending;
  eq(pend.options.length, 2);
  const before = s.players[0].drawPile.length;
  s = act(s, 0, { type: 'choose', cardIds: [pend.options[0].id] }).s;
  eq([s.players[0].hand.length, s.players[0].drawPile.length], [1, before + 1]);
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
test('Capitão de Formação: neighbours +1 ATK after it moves, gone at its owner\'s next turn', () => {
  let s = fresh({ a: 'capitao' }); put(s, 0, 0, 'Capitão de Formação'); put(s, 0, 2, 'Batedor'); s.turn.phase = 'movimentacao';
  s = act(s, 0, { type: 'move', from: 0, to: 1 }).s;
  eq(s.players[0].board[2]!.formationBuffAtk, 1);
  s = act(s, 0, { type: 'advance' }).s; s = act(s, 1, { type: 'advance' }).s; s = act(s, 1, { type: 'advance' }).s; s = act(s, 1, { type: 'advance' }).s;
  eq([s.turn.active, s.players[0].board[2]!.formationBuffAtk], [0, 0]);
});
test('Batedor moves once, free, right after attacking', () => {
  let s = combat(fresh({ a: 'capitao' })); put(s, 0, 2, 'Batedor'); put(s, 1, 2, 'Devotos da Cruzada').hp = 30;
  s = act(s, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(s.turn.batedorFree, 2);
  refused(s, 0, { type: 'move', from: 2, to: 8 }, 'adjacente');
  s = act(s, 0, { type: 'move', from: 2, to: 7 }).s;
  eq([s.players[0].board[7]?.name, s.turn.batedorFree], ['Batedor', null]);
});
test('Aurelion: up to 2 units that moved get +1/+1 for the next combat; Soldado Tático swaps at end of turn', () => {
  let s = fresh({ a: 'capitao' }); s.turn.phase = 'movimentacao';
  put(s, 0, 1, 'Batedor'); put(s, 0, 5, 'Soldado Tático'); put(s, 0, 6, 'Escudeiro de Linha');
  s = act(s, 0, { type: 'move', from: 1, to: 0 }).s;
  s = act(s, 0, { type: 'advance' }).s;
  eq(s.players[0].board[0]?.pendingCombatBonus, { atk: 1, hp: 1 });
  eq([s.players[0].board[5]?.name, s.players[0].board[6]?.name], ['Escudeiro de Linha', 'Soldado Tático']);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
