// Pure rule helpers: constants and "what is true about this board" questions. Nothing here changes
// anything; game.ts uses these to decide and to apply.
import { getCardDef } from './catalog';
import type { Ability, AbilityOn, Card, CardType, Passive, TargetSpec, TurnPhase, Verb, Who } from './types';

// ── Match economy ───────────────────────────────────────────────────────────
export const START_GOLD = 15;
export const START_HAND = 7;
export const GOLD_PER_TURN = 5;
export const GOLD_FROM_ROUND = 2;
export const HAND_LIMIT = 10;

// The few fields the board rules read. The engine's Card and the client's CardData both satisfy it, so the
// UI can ask the very same questions of what it is showing.
export type Unit = {
  name: string; cardType?: CardType; atk: number; hp: number;
  pendingCombatBonus?: { atk: number; hp: number }; formationBuffAtk?: number; dmgReduction?: number;
  shield?: number; block?: boolean;
};
export type Board = (Unit | null)[];

// Every phase of a turn, in order — what the UI shows. Combate and Pós-combate only exist once combat is open.
export const phasesForTurn = (combatOpen: boolean): TurnPhase[] =>
  combatOpen
    ? ['compra', 'suprimentos', 'preparacao', 'combate', 'pos_combate', 'movimentacao']
    : ['compra', 'suprimentos', 'preparacao', 'movimentacao'];

// The phases the seat actually stops in (the first two are automatic), i.e. what `advance` walks through.
export const AUTOMATIC_PHASES: TurnPhase[] = ['compra', 'suprimentos'];
export const restingPhasesForTurn = (combatOpen: boolean): TurnPhase[] =>
  phasesForTurn(combatOpen).filter(p => !AUTOMATIC_PHASES.includes(p));

// ── Efeitos lidos do catálogo ───────────────────────────────────────────────────────────────────────────────────
// O que uma carta faz está nos dados dela (CardDef.abilities / passives, veja types.ts); aqui só se consulta.
export const abilitiesOf = (name: string): Ability[] => getCardDef(name)?.abilities ?? [];
export const passivesOf = (name: string): Passive[] => getCardDef(name)?.passives ?? [];
export const abilityOn = (name: string, on: AbilityOn): Ability | undefined => abilitiesOf(name).find(a => a.on === on);
export const verbsOn = (name: string, on: AbilityOn): Verb[] => abilitiesOf(name).filter(a => a.on === on).flatMap(a => a.do);
export const hasVerb = (name: string, kind: Verb['kind']): boolean => abilitiesOf(name).some(a => a.do.some(v => v.kind === kind));

// Phases in which a board card's active ability can be used. Everything defaults to Preparação.
export const abilityPhases = (cardName: string): TurnPhase[] => abilityOn(cardName, 'ability')?.phases ?? ['preparacao'];

// Units (slots 0-9) that satisfy a target spec's filters, seen from the seat whose boards are `own` / `enemy`.
export const specCandidatesOn = (spec: TargetSpec, own: Board, enemy: Board, moved: number[]): number[] => {
  const board = spec.side === 'own' ? own : enemy;
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => {
    const u = board[i];
    if (!u) return false;
    if (spec.where === 'front' && !isFrontline(i)) return false;
    if (spec.where === 'back' && !isBackline(i)) return false;
    if (spec.types && !(u.cardType && spec.types.includes(u.cardType))) return false;
    if (spec.needs === 'damaged' && !isCardDamaged(u)) return false;
    if (spec.needs === 'moved' && spec.side === 'own' && !moved.includes(i)) return false;
    return true;
  });
};

// The board choices an ability / Tática asks for, in order (the first is the action's `target`, the second `target2`).
export const targetSpecsOf = (verbs: Verb[]): TargetSpec[] => verbs.flatMap(v => ('target' in v && v.target ? [v.target] : []));
export const playTargetSpecs = (cardName: string): TargetSpec[] => targetSpecsOf(verbsOn(cardName, 'play'));
// The (single) board target of a Tática, if it needs one.
export const targetSpecOf = (cardName: string): TargetSpec | undefined => playTargetSpecs(cardName)[0];

// True when the result of these effects depends on what only the server knows (the deck, the opponent's hand, the dice): the
// client waits for the server's step instead of predicting it.
export const needsHiddenInfo = (verbs: Verb[]): boolean =>
  verbs.some(v => v.kind === 'look_top' || v.kind === 'summon_deck' || v.kind === 'displace' || v.kind === 'displace_attacker' || (v.kind === 'search' && v.zone === 'deck'));

// Reforço: when a Vanguarda card falls, the card right behind it (same column, Retaguarda) steps forward into the empty
// slot for free and arrives with an Escudo. Only a card that carries the `reinforce` effect does it; 0 = none.
export const reinforceShield = (card: { name: string } | null | undefined): number => {
  const v = card ? verbsOn(card.name, 'front_fell').find(x => x.kind === 'reinforce') : undefined;
  return v && v.kind === 'reinforce' ? v.shield : 0;
};
export const canReinforce = (card: { name: string } | null | undefined): boolean => reinforceShield(card) > 0;

// ── Auras e marcas (passivas) ───────────────────────────────────────────────────────────────────────────────────
type AuraStat = 'atk' | 'combatHp' | 'reduce' | 'healBonus' | 'attacks';
const rowOk = (row: 'front' | 'back' | undefined, slot: number) => !row || (row === 'front' ? isFrontline(slot) : isBackline(slot));
const whoMatches = (who: Who, sourceSlot: number, targetSlot: number, target: { cardType?: CardType } | null): boolean => {
  if (who.side === 'self') return sourceSlot === targetSlot;
  if (who.facing && sourceSlot !== targetSlot) return false;
  if (who.behind && targetSlot !== sourceSlot + 5) return false;
  if (!rowOk(who.row, targetSlot)) return false;
  if (who.types && !(target?.cardType && who.types.includes(target.cardType))) return false;
  if (who.slots && !who.slots.includes(targetSlot)) return false;
  return true;
};
// Sum of one stat over every aura that touches the card standing in `slot` of `own` (auras from its own side and from the enemy's).
export const auraTotal = (stat: AuraStat, slot: number, own: Board, enemy: Board = []): number => {
  const target = own[slot] ?? null;
  let total = 0;
  const scan = (board: Board, side: 'own' | 'enemy') => {
    for (let src = 0; src <= 12; src++) {
      const source = board[src];
      if (!source) continue;
      for (const p of passivesOf(source.name)) {
        if (p.kind !== 'aura' || p[stat] === undefined) continue;
        if (p.who.side === 'enemy' ? side !== 'enemy' : side !== 'own') continue;
        if (!rowOk(p.from, src)) continue;
        if (p.when && getLaneCol(slot) !== p.when.col) continue;
        if (!whoMatches(p.who, src, slot, target)) continue;
        total += p[stat]!;
      }
    }
  };
  scan(own, 'own');
  scan(enemy, 'enemy');
  return total;
};
// A flag some card on the board carries (and whose position condition holds).
export const boardHasFlag = (board: Board, flag: 'row_swap' | 'blocks_ambush' | 'locks_general'): boolean =>
  board.some((c, i) => !!c && passivesOf(c.name).some(p => p.kind === 'flag' && p.flag === flag && rowOk(p.from, i)));

// After combat only these may still come out of the hand (units may not).
export const POST_COMBAT_CARD_TYPES: CardType[] = ['Tática', 'Relíquia', 'Terreno'];

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

// A unit with the `row_swap` mark (Cavaleiro Tático) swaps with anyone in its own row; every other unit only with orthogonal neighbours.
export const canReposition = (mover: Unit | null, from: number, to: number): boolean => {
  if (!mover || from === to) return false;
  if (passivesOf(mover.name).some(p => p.kind === 'flag' && p.flag === 'row_swap')) return getMoveRow(from) === getMoveRow(to) && isUnitSlot(from) && isUnitSlot(to);
  return areSlotsAdjacent(from, to);
};

// ── Card kinds ──────────────────────────────────────────────────────────────
export const SOLDIER_TYPES: CardType[] = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'];

export type CardDropKind = 'place' | 'ownTarget' | 'enemyTarget' | 'immediate' | 'blocked';
// What playing a given hand card means, decided purely from the card itself: units, Relíquias and Terrenos are placed in a slot;
// a Tática with a board choice (its effects have a `target`) is aimed; one without is used at once; an Emboscada waits in the hand.
export const getCardDropKind = (card: { name: string; cardType?: CardType }): CardDropKind => {
  if (card.cardType === 'Emboscada') return 'blocked';
  if (card.cardType === 'Tática') {
    if (!abilityOn(card.name, 'play')) return 'blocked';
    const spec = targetSpecOf(card.name);
    return spec ? (spec.side === 'enemy' ? 'enemyTarget' : 'ownTarget') : 'immediate';
  }
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

export const isCardDamaged = (card: Unit): boolean => card.hp < (getCardDef(card.name)?.hp ?? card.hp);

// Extra HP a unit has only during combat (an aura like Comandante da Ordem's).
export const getAuraCombatHpBonus = (slot: number, own: Board): number => auraTotal('combatHp', slot, own);
// An Emboscada is blocked while the ATTACKER's side has a card that stops them (Infiltrado da Ordem in its Vanguarda).
export const blocksAmbush = (board: Board): boolean => boardHasFlag(board, 'blocks_ambush');
// A card on the board that locks the General's ability when the General takes damage.
export const locksGeneralOnDamage = (board: Board): boolean => boardHasFlag(board, 'locks_general');

export const getMaxAttacksPerTurn = (card: { name: string }): number =>
  1 + passivesOf(card.name).reduce((n, p) => n + (p.kind === 'aura' && p.who.side === 'self' && p.attacks ? p.attacks : 0), 0);

// A unit's ATK after every static aura that touches it, plus any one-time bonus it holds.
export const getEffectiveAtk = (card: Unit, ownIndex: number, own: Board, enemy: Board): number => {
  let atk = card.atk + (card.pendingCombatBonus?.atk ?? 0);
  atk += card.formationBuffAtk ?? 0;
  atk += auraTotal('atk', ownIndex, own, enemy);
  return Math.max(0, atk);
};

export const getIncomingDamageReduction = (ownIndex: number, own: Board, enemy: Board = []): number =>
  auraTotal('reduce', ownIndex, own, enemy) + (own[ownIndex]?.dmgReduction ?? 0);

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
