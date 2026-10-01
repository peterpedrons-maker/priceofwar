// Pure rule helpers: constants and "what is true about this board" questions. Nothing here changes
// anything; game.ts uses these to decide and to apply.
import { getCardDef } from './catalog';
import type { Card, CardType, TurnPhase } from './types';

// ── Match economy ───────────────────────────────────────────────────────────
export const START_GOLD = 15;
export const START_HAND = 10;
export const GOLD_PER_TURN = 5;
export const GOLD_FROM_ROUND = 2;
export const HAND_LIMIT = 12;

export type Board = (Card | null)[];

export const phasesForTurn = (combatOpen: boolean): TurnPhase[] =>
  combatOpen ? ['preparacao', 'combate', 'movimentacao'] : ['preparacao', 'movimentacao'];

// ── Geometry ────────────────────────────────────────────────────────────────
export const isFrontline = (slot: number) => slot >= 0 && slot <= 4;
export const isBackline = (slot: number) => slot >= 5 && slot <= 9;
export const isUnitSlot = (slot: number) => slot >= 0 && slot <= 9;
export const getLaneCol = (slot: number) => {
  if (isFrontline(slot)) return slot;
  if (isBackline(slot)) return slot - 5;
  return -1; // General/Relíquia/Terreno do not occupy a lane themselves
};
export const getMoveRow = (slot: number) => (slot <= 4 ? 0 : 1);
export const getMoveCol = (slot: number) => (slot <= 4 ? slot : slot - 5);
// Orthogonal neighbours inside the 2x5 grid of Vanguarda/Retaguarda only.
export const areSlotsAdjacent = (a: number, b: number) => {
  if (a < 0 || a > 9 || b < 0 || b > 9 || a === b) return false;
  return Math.abs(getMoveRow(a) - getMoveRow(b)) + Math.abs(getMoveCol(a) - getMoveCol(b)) === 1;
};
export const adjacentSlots = (slot: number): number[] =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(j => areSlotsAdjacent(slot, j));

// Cavaleiro Tático swaps with anyone in its own row; every other unit only with orthogonal neighbours.
export const canReposition = (mover: Card | null, from: number, to: number): boolean => {
  if (!mover || from === to) return false;
  if (mover.name === 'Cavaleiro Tático') return getMoveRow(from) === getMoveRow(to) && isUnitSlot(from) && isUnitSlot(to);
  return areSlotsAdjacent(from, to);
};

// ── Card kinds ──────────────────────────────────────────────────────────────
export const SOLDIER_TYPES: CardType[] = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'];

export type TacticTargetKind =
  | 'avanco_coordenado' | 'reposicionamento_rapido' | 'linha_fechada' | 'ordem_retirada'
  | 'balesta' | 'catapulta' | 'equip_armadura' | 'equip_corcelete' | 'equip_flecha' | 'equip_espada';

export const TARGETABLE_TACTICS: Record<string, TacticTargetKind> = {
  'Avanço Coordenado': 'avanco_coordenado',
  'Reposicionamento Rápido': 'reposicionamento_rapido',
  'Linha Fechada': 'linha_fechada',
  'Ordem de Retirada': 'ordem_retirada',
  'Balestra de Precisão': 'balesta',
  'Catapulta de Guerra': 'catapulta',
  'Armadura de Guerra': 'equip_armadura',
  'Couraça Reforçada': 'equip_corcelete',
  'Flechas Venenosas': 'equip_flecha',
  'Espada Longa': 'equip_espada',
};
export const ENEMY_TARGET_KINDS = new Set<TacticTargetKind>(['reposicionamento_rapido', 'balesta', 'catapulta']);
export const TACTIC_TARGET_PROMPTS: Record<TacticTargetKind, string> = {
  avanco_coordenado: 'Escolha uma unidade sua que já se moveu neste turno.',
  reposicionamento_rapido: 'Escolha uma unidade inimiga para deslocar.',
  linha_fechada: 'Escolha uma unidade sua — os aliados ao lado dela recebem menos dano.',
  ordem_retirada: 'Escolha uma unidade sua na Vanguarda.',
  balesta: 'Escolha uma unidade inimiga para causar 3 de dano.',
  catapulta: 'Escolha uma fileira inimiga (clique em qualquer slot dela).',
  equip_armadura: 'Escolha uma Infantaria sua para equipar (+2 HP).',
  equip_corcelete: 'Escolha um Arqueiro ou Infantaria sua para equipar (+1 HP).',
  equip_flecha: 'Escolha um Arqueiro seu para equipar (+1 ATK).',
  equip_espada: 'Escolha uma Cavalaria ou Infantaria sua para equipar (+2 ATK).',
};
export const EQUIP_ALLOWED_TYPES: Record<string, CardType[]> = {
  equip_armadura: ['Infantaria'],
  equip_corcelete: ['Arqueiro', 'Infantaria'],
  equip_flecha: ['Arqueiro'],
  equip_espada: ['Cavalaria', 'Infantaria'],
};

// Táticas that resolve at once, with no board target (some open a pick prompt).
export const IMMEDIATE_CARD_NAMES = new Set([
  'Reformar Linhas', 'Tributo de Guerra', 'Trabuco de Cerco',
  'Retorno do Soldado', 'Graal da Dádiva', 'Doutrina Renovada',
  'Recrutamento Seletivo', 'Recrutar Veteranos', 'Chamado às Armas',
]);

export type CardDropKind = 'place' | 'ownTarget' | 'enemyTarget' | 'immediate' | 'blocked';
// What playing a given hand card means, decided purely from the card itself.
export const getCardDropKind = (card: Card): CardDropKind => {
  if (IMMEDIATE_CARD_NAMES.has(card.name)) return 'immediate';
  const kind = TARGETABLE_TACTICS[card.name];
  if (kind) return ENEMY_TARGET_KINDS.has(kind) ? 'enemyTarget' : 'ownTarget';
  if (card.cardType === 'Emboscada' || card.cardType === 'Tática') return 'blocked';
  return 'place';
};

// Whether a card type may be placed in a given slot: creatures anywhere in 0-9, the Relíquia only in its
// own special slot (10), the Terreno only in its own (11), the General never (it is placed at kickoff).
export const canPlaceInSlot = (cardType: CardType | undefined, slot: number): boolean => {
  if (slot < 0 || slot >= 12) return false;
  if (cardType === 'Emboscada' || cardType === 'Tática' || cardType === 'General') return false;
  if (cardType === 'Relíquia') return slot === 10;
  if (cardType === 'Terreno') return slot === 11;
  return slot <= 9;
};

// ── Damage and aura rules ───────────────────────────────────────────────────
export const isAliveAt = (board: Board, slot: number, name: string) => board[slot]?.name === name;

export const isCardDamaged = (card: Card): boolean => card.hp < (getCardDef(card.name)?.hp ?? card.hp);

export const hasLiderBuff = (card: Card, own: Board): boolean => {
  if (card.cardType !== 'Infantaria' && card.cardType !== 'Arqueiro') return false;
  return [0, 1, 2, 3, 4].some(i => own[i]?.name === 'Comandante da Ordem');
};
export const getAuraCombatHpBonus = (card: Card, own: Board): number => (hasLiderBuff(card, own) ? 1 : 0);

// Infiltrado da Ordem in the Vanguarda of the ATTACKING side blocks the defender's Emboscadas.
export const hasEspiaoInVanguarda = (board: Board): boolean => [0, 1, 2, 3, 4].some(i => board[i]?.name === 'Infiltrado da Ordem');
export const hasEspiaoOnBoard = (board: Board): boolean => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => board[i]?.name === 'Infiltrado da Ordem');

export const getMaxAttacksPerTurn = (card: Card): number => (card.name === 'Arqueiro da Ordem' ? 2 : 1);

// A unit's ATK after every static aura that touches it, plus any one-time bonus it holds.
export const getEffectiveAtk = (card: Card, ownIndex: number, own: Board, enemy: Board): number => {
  let atk = card.atk + (card.pendingCombatBonus?.atk ?? 0);
  atk += card.formationBuffAtk ?? 0;
  if (isAliveAt(own, 10, 'Estandarte da Legião')) atk += 1;
  if (card.name === 'Veterano de Guerra' && getLaneCol(ownIndex) === 2) atk += 2;
  const facing = enemy[ownIndex];
  if (facing && facing.name === 'Lanceiro de Controle') atk -= 1;
  if (isFrontline(ownIndex) && isAliveAt(enemy, 11, 'Pântano Maldito')) atk -= 1;
  if (hasLiderBuff(card, own)) atk += 1;
  return Math.max(0, atk);
};

export const getIncomingDamageReduction = (ownIndex: number, own: Board): number => {
  let reduction = 0;
  if ((ownIndex === 10 || ownIndex === 11) && isAliveAt(own, 12, 'Comandante Aurelion, Mestre da Formação')) reduction += 1;
  if (isBackline(ownIndex) && isAliveAt(own, 11, 'Fortaleza de Pedra')) reduction += 1;
  reduction += own[ownIndex]?.dmgReduction ?? 0;
  return reduction;
};

// Lane-based targeting: which enemy slots the unit at `attackerIndex` can reach right now.
export const getValidAttackTargets = (attackerIndex: number, attackerBoard: Board, enemyBoard: Board): Set<number> => {
  const valid = new Set<number>();
  const attacker = attackerBoard[attackerIndex];
  if (!attacker) return valid;
  const attackerCol = getLaneCol(attackerIndex);
  if (attackerCol === -1) return valid; // General/Relíquia/Terreno never attack
  // Infantaria posted in the Retaguarda does not attack.
  if (attacker.cardType === 'Infantaria' && isBackline(attackerIndex)) return valid;

  // Melee with an enemy straight ahead must hit that card; ranged units consider the three lanes.
  const isRanged = attacker.cardType === 'Arqueiro' || attacker.cardType === 'Artilharia';
  const directFrontal = !isRanged && !!enemyBoard[attackerCol];
  const scanCols = directFrontal
    ? [attackerCol]
    : [attackerCol - 1, attackerCol, attackerCol + 1].filter(c => c >= 0 && c <= 4);

  scanCols.forEach(col => {
    if (enemyBoard[col]) valid.add(col);
    else if (enemyBoard[col + 5]) valid.add(col + 5); // the back card is reachable only if its front is empty
  });

  // Center lane (Relíquia 10 at col 1, General 12 at col 2, Terreno 11 at col 3): reachable when the scan
  // includes that column AND the whole lane in front of it is clear.
  [{ col: 1, target: 10 }, { col: 2, target: 12 }, { col: 3, target: 11 }].forEach(({ col, target }) => {
    if (!enemyBoard[target] || !scanCols.includes(col)) return;
    if (!enemyBoard[col] && !enemyBoard[col + 5]) valid.add(target);
  });
  return valid;
};

// An Armamento rides along with its unit to the graveyard.
export const withEquippedWeapons = (cards: Card[]): Card[] =>
  cards.flatMap(c => (c.equippedWeapons?.length ? [{ ...c, equippedWeapons: undefined }, ...c.equippedWeapons] : [c]));
