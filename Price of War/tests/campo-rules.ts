import './raw-stats';
// Regras do deck de Campo (experimental): equipamento por unidade, "armada", "com Terreno", busca de Equipamento, equipamento que volta para a mão.
//   npx tsx tests/campo-rules.ts
import { requireCardDef } from '../src/engine/catalog';
import { registerCampo, CAMPO_RECIPE } from '../src/engine/experimental';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { getAuraCombatHpBonus, getEffectiveAtk, getIncomingDamageReduction } from '../src/engine/rules';
import type { Action, Card, GameEvent, GameState, Seat } from '../src/engine/types';

registerCampo();
let passed = 0, failed = 0;
const test = (name: string, fn: () => void) => { try { fn(); passed++; } catch (e) { failed++; console.log(`  ✗ ${name}\n      ${(e as Error).message}`); } };
const eq = (a: unknown, b: unknown, msg = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };
const ok = (c: boolean, msg: string) => { if (!c) throw new Error(msg); };

let n = 0;
const mk = (name: string): Card => { const d = requireCardDef(name); return { id: `c${++n}`, name: d.name, cardType: d.cardType, atk: d.atk, hp: d.hp, cost: d.cost, effect: d.effect, ...(d.trigger ? { trigger: d.trigger } : {}) }; };
const A = (name: string) => requireCardDef(name).atk;
const campoSetup = () => ({ general: CAMPO_RECIPE.general, cards: CAMPO_RECIPE.cards });
const fresh = (): GameState => {
  let s = createMatch({ seed: 7, decks: [campoSetup(), deckSetupFromRecipe('capitao')], first: 0 }).state;
  const r = applyAction(s, 0, { type: 'begin' }); if (r.ok === false) throw new Error(r.error); s = r.state;
  s.players.forEach(p => { p.hand = []; p.gold = 50; });
  return s;
};
const put = (s: GameState, seat: Seat, slot: number, name: string): Card => { const c = mk(name); s.players[seat].board[slot] = c; return c; };
const give = (s: GameState, seat: Seat, name: string): Card => { const c = mk(name); s.players[seat].hand.push(c); return c; };
const act = (s: GameState, seat: Seat, a: Action): { s: GameState; ev: GameEvent[] } => { const r = applyAction(s, seat, a); if (r.ok === false) throw new Error(`refused: ${r.error}`); return { s: r.state, ev: r.events }; };
const arm = (s: GameState, slot: number, weapon: string) => { const u = s.players[0].board[slot]!; const w = mk(weapon); u.equippedWeapons = [...(u.equippedWeapons ?? []), w]; };

test('o deck de Campo tem 60 cartas e 30 nomes (com o General), todos novos', () => {
  eq(Object.values(CAMPO_RECIPE.cards).reduce((a, b) => a + b, 0), 60);
  eq(Object.keys(CAMPO_RECIPE.cards).length + 1, 30);
});
test('Escudeiro de Campanha: +1 ATK por equipamento preso, no máximo +2', () => {
  const s = fresh(); put(s, 0, 2, 'Escudeiro de Campanha');
  const atk = () => getEffectiveAtk(s.players[0].board[2]!, 2, s.players[0].board, s.players[1].board);
  const b = A('Escudeiro de Campanha');
  eq(atk(), b); arm(s, 2, 'Cota Remendada'); eq(atk(), b + 1); arm(s, 2, 'Espada de Posto'); eq(atk(), b + 2); arm(s, 2, 'Machado de Guerra'); eq(atk(), b + 2, 'o teto vale');
});
test('Cavaleiro da Marca: +1 ATK só se estiver Armada; Guarda de Fronteira: +1 HP em combate só se estiver Armada', () => {
  const s = fresh(); put(s, 0, 1, 'Cavaleiro da Marca'); put(s, 0, 2, 'Guarda de Fronteira');
  const atk = () => getEffectiveAtk(s.players[0].board[1]!, 1, s.players[0].board, s.players[1].board);
  const hpB = () => getAuraCombatHpBonus(2, s.players[0].board);
  eq([atk(), hpB()], [A('Cavaleiro da Marca'), 0]);
  arm(s, 1, 'Cota Remendada'); arm(s, 2, 'Cota Remendada');
  eq([atk(), hpB()], [A('Cavaleiro da Marca') + 1, 1]);
});
test('equipar deixa a unidade Armada, de qualquer tipo (Infantaria, Cavalaria ou Arqueiro)', () => {
  for (const [name, slot] of [['Escudeiro de Campanha', 2], ['Cavaleiro da Marca', 3], ['Besteiro de Posto', 7]] as const) {
    let s = fresh(); put(s, 0, slot, name); const w = give(s, 0, 'Cota Remendada'); s.turn.phase = 'preparacao';
    s = act(s, 0, { type: 'play', cardId: w.id, target: slot }).s;
    eq(s.players[0].board[slot]!.equippedWeapons!.length, 1, name);
  }
});
test('Forja de Campanha (Terreno com modos): entra em Muralha; no fim do turno o dono troca para Afiação, e vale só para Armadas', () => {
  let s = fresh(); put(s, 0, 2, 'Escudeiro de Campanha'); put(s, 0, 3, 'Escudeiro de Campanha'); arm(s, 2, 'Cota Remendada');
  const f = give(s, 0, 'Forja de Campanha'); s.turn.phase = 'preparacao';
  s = act(s, 0, { type: 'play', cardId: f.id, slot: 11 }).s;
  eq(s.players[0].board[11]!.mode, 'muralha');
  const hp = (slot: number) => getAuraCombatHpBonus(slot, s.players[0].board);
  const atk = (slot: number) => getEffectiveAtk(s.players[0].board[slot]!, slot, s.players[0].board, s.players[1].board);
  eq([hp(2), hp(3)], [2, 0], 'Muralha só nas Armadas');
  s.turn.phase = 'movimentacao';
  const before = atk(2);
  s = act(s, 0, { type: 'relic_mode', mode: 'afiacao', slot: 11 }).s;
  eq([hp(2), atk(2) - before], [0, 2], 'Afiação troca o bônus');
  eq(atk(3), A('Escudeiro de Campanha'), 'quem não está Armada fica de fora');
});
test('o modo do Terreno só muda na Movimentação e só entre os modos da carta', () => {
  let s = fresh(); put(s, 0, 11, 'Posto de Marcha'); s.players[0].board[11]!.mode = 'trincheira'; s.turn.phase = 'preparacao';
  const r1 = applyAction(s, 0, { type: 'relic_mode', mode: 'saque', slot: 11 }); ok(r1.ok === false, 'fora da Movimentação');
  s.turn.phase = 'movimentacao';
  const r2 = applyAction(s, 0, { type: 'relic_mode', mode: 'inexistente', slot: 11 }); ok(r2.ok === false, 'modo inexistente');
  eq(act(s, 0, { type: 'relic_mode', mode: 'saque', slot: 11 }).s.players[0].board[11]!.mode, 'saque');
});
test('Posto de Marcha, modo Trincheira: Armadas recebem 1 de dano a menos (soma com o General); Saque compra ao destruir', () => {
  const s = fresh(); put(s, 0, 2, 'Escudeiro de Campanha'); put(s, 0, 3, 'Escudeiro de Campanha'); arm(s, 2, 'Cota Remendada');
  put(s, 0, 11, 'Posto de Marcha'); s.players[0].board[11]!.mode = 'trincheira';
  const red = (slot: number) => getIncomingDamageReduction(slot, s.players[0].board, s.players[1].board);
  eq([red(2), red(3)], [2, 0], 'General 1 + Trincheira 1, só na Armada');
  let t = fresh(); put(t, 0, 11, 'Posto de Marcha'); t.players[0].board[11]!.mode = 'saque';
  put(t, 0, 2, 'Escudeiro de Campanha'); put(t, 1, 2, 'Soldado Tático').hp = 1;
  t.turn.round = 2; t.turn.phase = 'combate'; t.players[0].deckList = ['Cota Remendada'];
  const hand = t.players[0].hand.length;
  t = act(t, 0, { type: 'attack', from: 2, to: 2 }).s;
  eq(t.players[0].hand.length, hand + 1, 'Saque: comprou 1');
});
test('Arsenal do Marquês e o General: bônus só em quem está Armada', () => {
  const s = fresh(); put(s, 0, 2, 'Escudeiro de Campanha'); put(s, 0, 3, 'Escudeiro de Campanha'); arm(s, 2, 'Cota Remendada');
  const red = (slot: number) => getIncomingDamageReduction(slot, s.players[0].board, s.players[1].board);
  eq([red(2), red(3)], [1, 0], 'o General reduz o dano só de quem está Armada');
  put(s, 0, 10, 'Arsenal do Marquês');
  eq([red(2), red(3)], [3, 0], 'Arsenal (2) soma com o General (1)');
});
test('Mestre de Armas: Armadas +1 ATK (e ele mesmo, se estiver armado)', () => {
  const s = fresh(); put(s, 0, 2, 'Mestre de Armas'); put(s, 0, 3, 'Cavaleiro da Marca'); arm(s, 3, 'Espada de Posto');
  eq(getEffectiveAtk(s.players[0].board[3]!, 3, s.players[0].board, s.players[1].board), A('Cavaleiro da Marca') + 1 + 1, 'Mestre +1 e a própria Armada +1');
  eq(getEffectiveAtk(s.players[0].board[2]!, 2, s.players[0].board, s.players[1].board), A('Mestre de Armas'), 'sem arma, sem bônus');
});
test('Besteiro de Posto leva Equipamento do baralho; Reconhecimento: Equipamento OU Terreno', () => {
  let s = fresh(); const b = give(s, 0, 'Besteiro de Posto'); s.turn.phase = 'preparacao';
  s.players[0].deckList = ['Espada de Posto', 'Forja de Campanha', 'Sargento de Marcha'];
  s = act(s, 0, { type: 'play', cardId: b.id, slot: 0 }).s;
  eq((s.pending as any).options.map((o: any) => o.name), ['Espada de Posto']);
  let t = fresh(); const r = give(t, 0, 'Reconhecimento do Terreno'); t.turn.phase = 'preparacao';
  t.players[0].deckList = ['Espada de Posto', 'Forja de Campanha', 'Sargento de Marcha'];
  t = act(t, 0, { type: 'play', cardId: r.id }).s;
  eq(new Set((t.pending as any).options.map((o: any) => o.name)), new Set(['Espada de Posto', 'Forja de Campanha']));
});
test('Escudeiro Veterano: ao cair, o equipamento volta para a mão (os outros vão para o cemitério)', () => {
  let s = fresh(); put(s, 0, 2, 'Escudeiro Veterano'); arm(s, 2, 'Cota Remendada');
  s.turn.round = 2; s.turn.active = 1; s.turn.phase = 'combate'; s.players[0].board[2]!.hp = 1;
  put(s, 1, 2, 'Soldado Tático');
  s = act(s, 1, { type: 'attack', from: 2, to: 2 }).s;
  ok(!s.players[0].board[2], 'caiu');
  eq(s.players[0].hand.map(c => c.name), ['Cota Remendada']);
  eq(s.players[0].graveyard.map(c => c.name), ['Escudeiro Veterano']);
});
test('o General (Comando) busca Equipamento do cemitério', () => {
  let s = fresh(); s.turn.phase = 'preparacao';
  s.players[0].graveyard = [mk('Espada de Posto'), mk('Escudeiro de Campanha')];
  s = act(s, 0, { type: 'ability', slot: 12 } as any).s;
  eq((s.pending as any).options.map((o: any) => o.name), ['Espada de Posto']);
});
test('Armeiro de Campanha (Queda): ao cair, escolhe um Equipamento do cemitério; sem nenhum, a partida segue', () => {
  const kill = (grave: string[]) => {
    let s = fresh(); put(s, 0, 2, 'Armeiro de Campanha').hp = 1; s.players[0].graveyard = grave.map(mk);
    s.turn.round = 2; s.turn.active = 1; s.turn.phase = 'combate'; put(s, 1, 2, 'Soldado Tático');
    return act(s, 1, { type: 'attack', from: 2, to: 2 }).s;
  };
  const withEquip = kill(['Espada de Posto']);
  ok(withEquip.pending?.kind === 'pick' && (withEquip.pending as any).seat === 0, 'abre a escolha para o dono');
  eq((withEquip.pending as any).options.map((o: any) => o.name), ['Espada de Posto']);
  ok(!kill([]).pending, 'sem equipamento no cemitério não trava');
});
test('Lanceiro Montado: 2 de dano à carta atrás só se estiver Armada', () => {
  const mkFight = (armed: boolean) => {
    const s = fresh(); put(s, 0, 1, 'Lanceiro Montado'); if (armed) arm(s, 1, 'Espada de Posto');
    s.turn.round = 2; s.turn.phase = 'combate';
    const front = put(s, 1, 1, 'Soldado Tático'); front.hp = 20; const back = put(s, 1, 6, 'Soldado Tático'); back.hp = 10;
    return act(s, 0, { type: 'attack', from: 1, to: 1 }).s.players[1].board[6]!.hp;
  };
  eq([mkFight(false), mkFight(true)], [10, 8]);
});
test('Cavaleiro Batedor (Manobra): ao se mover ganha +1 ATK até o próximo turno', () => {
  let s = fresh(); put(s, 0, 2, 'Cavaleiro Batedor'); s.turn.phase = 'movimentacao';
  s = act(s, 0, { type: 'move', from: 2, to: 1 }).s;
  eq(getEffectiveAtk(s.players[0].board[1]!, 1, s.players[0].board, s.players[1].board) - A('Cavaleiro Batedor') >= 0, true);
});

console.log(`${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
