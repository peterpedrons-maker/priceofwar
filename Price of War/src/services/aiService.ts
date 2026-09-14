import { CardData } from '../App';

export type AiAction =
  | { type: 'play_card', slotIndex: number, card: CardData }
  | { type: 'attack', attackerSlot: number, targetSlot: number };

// Resolves which of the enemy's slots a given attacker can actually reach this turn —
// passed in from App.tsx (getValidAttackTargets) so both sides share the exact same
// lane-blocking rules instead of the AI having its own, possibly-diverging copy.
type ValidTargetsFn = (attackerIndex: number, attackerSlots: (CardData | null)[], enemySlots: (CardData | null)[]) => Set<number>;

// Táticas that resolve by picking a target on the board (see App.tsx's
// pendingTacticAction/resolveOwnTacticTarget/resolveEnemyTacticTarget) instead of
// just sitting there as an inert 0/0 card. The AI has no targeting logic for any of
// these yet — placing one on the board the way a normal creature gets played would
// just waste it as dead weight taking up a slot, so it's simplest and safest to
// leave them in the AI's hand entirely (same category of limitation as the
// Relíquia/Terreno skip below) rather than have the AI actively hurt itself.
const AI_UNSUPPORTED_TACTICS = new Set([
  'Reformar Linhas', 'Avanço Coordenado', 'Reposicionamento Rápido', 'Linha Fechada', 'Ordem de Retirada',
  'Balesta', 'Catapulta', 'Armadura Pesada', 'Corcelete', 'Flecha Envenenada', 'Espada Longa',
  'O Soldado Retorna', 'Busca pelo Santo Graal', 'Nova Tática', 'Escolher a Dedo', 'Escolher Tropas', 'Reunião de Fiéis',
  // Trabuco and Aumento de Impostos don't need a board target, but they still resolve
  // through the same play-card handler as every targeted Tática above (not the plain
  // "place a creature" path) — without this exclusion the AI was placing them as inert
  // 0/0 board occupants instead of ever triggering their effect, permanently wasting
  // both the card and the slot it sat in.
  'Trabuco', 'Aumento de Impostos',
]);

// Emboscada cards only ever resolve via the ambush interrupt (see maybeActivateNpcAmbush
// in App.tsx, which already reads straight from npcHand whenever the player attacks) —
// they're never "played" onto the board like a creature. Skipping them here for the exact
// same reason as AI_UNSUPPORTED_TACTICS above: placing one would waste it as an inert 0/0
// body instead of leaving it in hand for its real trigger.
const isEmboscada = (card: CardData) => card.cardType === 'Emboscada';

export const playAiTurn = (
  npcSlots: (CardData | null)[],
  playerSlots: (CardData | null)[],
  npcMana: number,
  npcHand: CardData[],
  getValidAttackTargets: ValidTargetsFn,
  turnNumber: number
): { actions: AiAction[]; playedCardIds: string[] } => {
  const actions: AiAction[] = [];
  const playedCardIds: string[] = [];
  let currentNpcMana = npcMana;
  const currentNpcSlots = [...npcSlots];

  // 1. Play cards — greedily play every affordable hand card (in hand order) into a
  // free Vanguarda/Retaguarda slot (0-9), preferring the Vanguarda: since attacks can
  // be blocked by whatever sits in front, putting units there first actually matters
  // now. Relíquia/Terreno cards need one of the two special slots beside the General
  // (10/11); the AI skips those for now and only plays regular units.
  for (const card of npcHand) {
    if (card.cardType === 'Relíquia' || card.cardType === 'Terreno') continue;
    if (isEmboscada(card)) continue;
    if (AI_UNSUPPORTED_TACTICS.has(card.name)) continue;
    if (card.cost > currentNpcMana) continue;
    const emptySlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => currentNpcSlots[i] === null);
    if (emptySlots.length === 0) break; // board is full, no point checking the rest of the hand
    const frontSlots = emptySlots.filter(i => i <= 4);
    const candidates = frontSlots.length > 0 ? frontSlots : emptySlots;
    const slot = candidates[Math.floor(Math.random() * candidates.length)];
    actions.push({ type: 'play_card', slotIndex: slot, card });
    playedCardIds.push(card.id);
    currentNpcSlots[slot] = card;
    currentNpcMana -= card.cost;
  }

  // 2. Attack — mirrors the player's own "Batalha only unlocks from turn 3 onward"
  // restriction (see handleSlotClick's turnPhase !== 'batalha' check in App.tsx):
  // without this, the AI could freely swing on turns 1-2 while the player couldn't,
  // a lopsided head start that isn't part of the actual rules.
  if (turnNumber < 3) return { actions, playedCardIds };

  // Each NPC minion swings at whatever it can actually reach given the lane-blocking
  // rules (see getValidAttackTargets), preferring the General when it's exposed,
  // otherwise a random valid target.
  for (let i = 0; i <= 9; i++) {
    const attacker = currentNpcSlots[i];
    if (!attacker || attacker.atk <= 0) continue;
    const targets = getValidAttackTargets(i, currentNpcSlots, playerSlots);
    if (targets.size === 0) continue;
    const targetsArr = Array.from(targets);
    const target = targets.has(12) ? 12 : targetsArr[Math.floor(Math.random() * targetsArr.length)];
    actions.push({ type: 'attack', attackerSlot: i, targetSlot: target });
  }

  return { actions, playedCardIds };
};
