import { CardData } from '../App';

export type AiAction =
  | { type: 'play_card'; slotIndex: number; card: CardData; handIndex: number }
  | { type: 'attack'; attackerSlot: number; targetSlot: number | 'avatar' };

export const playAiTurn = (
  npcSlots: (CardData | null)[],
  playerSlots: (CardData | null)[],
  npcMana: number,
  npcHand: CardData[],
  getValidTargets: (attackerIndex: number, slots: (CardData | null)[], enemySlots: (CardData | null)[]) => Set<number | 'avatar'>,
  canAttack: boolean = true
): { actions: AiAction[] } => {
  const actions: AiAction[] = [];
  let currentNpcMana = npcMana;
  let currentNpcSlots = [...npcSlots];
  let currentHand = [...npcHand];

  // 1. Play Cards
  // Sort hand by cost descending, try to play most expensive cards first
  const playableCardsAndIndices = currentHand
    .map((c, idx) => ({ card: c, idx }))
    .filter(({ card }) => card.cardType !== 'General' && !card.isSpell && !card.isEquipment && card.cardType !== 'Terreno' && card.cardType !== 'Relíquia' && card.cardType !== 'Emboscada' && card.cardType !== 'Armamento' && card.cardType !== 'Tática')
    .sort((a, b) => b.card.cost - a.card.cost);

  let playedIndices = new Set<number>();

  for (const { card, idx } of playableCardsAndIndices) {
    if (playedIndices.has(idx)) continue;

    if (currentNpcMana >= card.cost) {
      // Find valid slots. Troops can go to slots 0-11
      const availableSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(i => currentNpcSlots[i] === null);

      if (availableSlots.length > 0) {
        // Pick front mostly
        const frontSlots = availableSlots.filter(i => i < 5);
        const slot = frontSlots.length > 0
          ? frontSlots[Math.floor(Math.random() * frontSlots.length)]
          : availableSlots[Math.floor(Math.random() * availableSlots.length)];

        actions.push({ type: 'play_card', slotIndex: slot, card, handIndex: idx });
        currentNpcSlots[slot] = card;
        currentNpcMana -= card.cost;
        playedIndices.add(idx);
      }
    }
  }

  // 2. Attack
  if (canAttack) {
    // Attack with front row first, then back
    const attackOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    
    for (const i of attackOrder) {
      const card = currentNpcSlots[i];
      if (card && card.atk > 0 && !card.isDestroyed) {
        const validTargets = getValidTargets(i, currentNpcSlots, playerSlots);
        
        if (validTargets.size > 0) {
          // Prioritize Avatar if possible, else random
          let target: number | 'avatar';
          if (validTargets.has('avatar')) {
            target = 'avatar';
          } else {
            const targetsArr = Array.from(validTargets) as number[];
            target = targetsArr[Math.floor(Math.random() * targetsArr.length)];
          }
          actions.push({ type: 'attack', attackerSlot: i, targetSlot: target });
        }
      }
    }
  }

  return { actions };
};
