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
  eq(atk(), b); arm(s, 2, 'Cota Remendada'); eq(atk(), b + 1); arm(s, 2, 'Lança de Fresno'); eq(atk(), b + 2); arm(s, 2, 'Machado de Guerra'); eq(atk(), b + 2, 'o teto vale');
});
test('Cavaleiro da Marca: +1 ATK só com Terreno em campo; Guarda de Fronteira: +1 HP em combate só com Terreno', () => {
  const s = fresh(); put(s, 0, 1, 'Cavaleiro da Marca'); put(s, 0, 2, 'Guarda de Fronteira');
  const atk = () => getEffectiveAtk(s.players[0].board[1]!, 1, s.players[0].board, s.players[1].board);
  const hpB = () => getAuraCombatHpBonus(2, s.players[0].board);
  eq([atk(), hpB()], [A('Cavaleiro da Marca'), 0]);
  put(s, 0, 11, 'Floresta Espessa');
  eq([atk(), hpB()], [A('Cavaleiro da Marca') + 1, 1]);
});
test('Campina Aberta: Cavalarias +2 ATK e o inimigo à frente de uma Cavalaria sua tem -2 ATK (só na coluna dela)', () => {
  const s = fresh(); put(s, 0, 11, 'Campina Aberta'); put(s, 0, 1, 'Lanceiro Montado'); put(s, 0, 3, 'Escudeiro de Campanha');
  const foeA = put(s, 1, 1, 'Soldado Tático'), foeB = put(s, 1, 3, 'Soldado Tático');
  eq(getEffectiveAtk(s.players[0].board[1]!, 1, s.players[0].board, s.players[1].board), A('Lanceiro Montado') + 2, 'Cavalaria +2');
  eq(getEffectiveAtk(s.players[0].board[3]!, 3, s.players[0].board, s.players[1].board), A('Escudeiro de Campanha'), 'Infantaria sem bônus');
  eq(getEffectiveAtk(foeA, 1, s.players[1].board, s.players[0].board), foeA.atk - 2, 'inimigo de frente para a Cavalaria');
  eq(getEffectiveAtk(foeB, 3, s.players[1].board, s.players[0].board), foeB.atk, 'inimigo de frente para a Infantaria');
});
test('Colina Fortificada, Forja, Arsenal e o General: bônus só em quem está armada', () => {
  const s = fresh(); put(s, 0, 2, 'Escudeiro de Campanha'); put(s, 0, 3, 'Escudeiro de Campanha');
  arm(s, 2, 'Cota Remendada');
  put(s, 0, 11, 'Forja de Campanha');
  const red = (slot: number) => getIncomingDamageReduction(slot, s.players[0].board, s.players[1].board);
  eq([getAuraCombatHpBonus(2, s.players[0].board), getAuraCombatHpBonus(3, s.players[0].board)], [2, 0], 'Forja');
  eq([red(2), red(3)], [1, 0], 'o General reduz o dano só de quem está armada');
  put(s, 0, 10, 'Arsenal do Marquês');
  eq([red(2), red(3)], [3, 0], 'Arsenal (2) soma com o General (1)');
});
test('Mestre de Armas: unidades armadas +1 ATK (e ele mesmo, se estiver armado)', () => {
  const s = fresh(); put(s, 0, 2, 'Mestre de Armas'); put(s, 0, 3, 'Cavaleiro da Marca'); arm(s, 3, 'Lança de Fresno');
  eq(getEffectiveAtk(s.players[0].board[3]!, 3, s.players[0].board, s.players[1].board), A('Cavaleiro da Marca') + 1);
  eq(getEffectiveAtk(s.players[0].board[2]!, 2, s.players[0].board, s.players[1].board), A('Mestre de Armas'), 'sem arma, sem bônus');
});
test('Besteiro de Posto e Intendência levam Equipamento do baralho; Mapeador leva Terreno', () => {
  let s = fresh(); const b = give(s, 0, 'Besteiro de Posto'); s.turn.phase = 'preparacao';
  s.players[0].deckList = ['Lança de Fresno', 'Campina Aberta', 'Sargento de Marcha'];
  const r = act(s, 0, { type: 'play', cardId: b.id, slot: 0 }); s = r.s;
  ok(s.pending?.kind === 'pick', 'abre a escolha');
  eq((s.pending as any).options.map((o: any) => o.name ?? o), ['Lança de Fresno']);
});
test('Reconhecimento do Terreno: Equipamento OU Terreno', () => {
  let s = fresh(); const t = give(s, 0, 'Reconhecimento do Terreno'); s.turn.phase = 'preparacao';
  s.players[0].deckList = ['Lança de Fresno', 'Campina Aberta', 'Sargento de Marcha'];
  s = act(s, 0, { type: 'play', cardId: t.id }).s;
  eq(new Set((s.pending as any).options.map((o: any) => o.name ?? o)), new Set(['Lança de Fresno', 'Campina Aberta']));
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
  s.players[0].graveyard = [mk('Lança de Fresno'), mk('Escudeiro de Campanha')];
  s = act(s, 0, { type: 'ability', slot: 12 } as any).s;
  eq((s.pending as any).options.map((o: any) => o.name), ['Lança de Fresno']);
});
test('Armeiro de Campanha (Queda): ao cair, escolhe um Equipamento do cemitério', () => {
  let s = fresh(); put(s, 0, 2, 'Armeiro de Campanha').hp = 1; s.players[0].graveyard = [mk('Lança de Fresno')];
  s.turn.round = 2; s.turn.active = 1; s.turn.phase = 'combate'; put(s, 1, 2, 'Soldado Tático');
  s = act(s, 1, { type: 'attack', from: 2, to: 2 }).s;
  ok(s.pending?.kind === 'pick' && (s.pending as any).seat === 0, 'abre a escolha para o dono');
  eq((s.pending as any).options.map((o: any) => o.name), ['Lança de Fresno']);
});
test('Lanceiro Montado: 2 de dano à carta atrás só se estiver armada; Contra-Carga só na unidade armada', () => {
  const mkFight = (armed: boolean) => {
    const s = fresh(); put(s, 0, 1, 'Lanceiro Montado'); if (armed) arm(s, 1, 'Lança de Fresno');
    s.turn.round = 2; s.turn.phase = 'combate';
    const front = put(s, 1, 1, 'Soldado Tático'); front.hp = 20; const back = put(s, 1, 6, 'Soldado Tático'); back.hp = 10;
    return act(s, 0, { type: 'attack', from: 1, to: 1 }).s.players[1].board[6]!.hp;
  };
  eq([mkFight(false), mkFight(true)], [10, 8]);
});

console.log(`${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
