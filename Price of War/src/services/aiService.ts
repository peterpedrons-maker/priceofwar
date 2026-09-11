import { CardData } from '../App';

export type AiAction =
  | { type: 'play_card', slotIndex: number, card: CardData }
  | { type: 'attack', attackerSlot: number, targetSlot: number };

// Resolves which of the enemy's slots a given attacker can actually reach this turn —
// passed in from App.tsx (getValidAttackTargets) so both sides share the exact same
// lane-blocking rules instead of the AI having its own, possibly-diverging copy.
type ValidTargetsFn = (attackerIndex: number, attackerSlots: (CardData | null)[], enemySlots: (CardData | null)[]) => Set<number>;

export const playAiTurn = (
  npcSlots: (CardData | null)[],
  playerSlots: (CardData | null)[],
  npcMana: number,
  npcHand: CardData[],
  getValidAttackTargets: ValidTargetsFn
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

  // 2. Attack — each NPC minion swings at whatever it can actually reach given the
  // lane-blocking rules (see getValidAttackTargets), preferring the General when it's
  // exposed, otherwise a random valid target.
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
