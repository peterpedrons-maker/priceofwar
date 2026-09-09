import { CardData } from '../App';

export type AiAction = 
  | { type: 'play_card', slotIndex: number, card: CardData }
  | { type: 'attack', attackerSlot: number, targetSlot: number | 'avatar' };

export const playAiTurn = (
  npcSlots: (CardData | null)[], 
  playerSlots: (CardData | null)[], 
  npcMana: number,
  hand: CardData[]
): { actions: AiAction[] } => {
  const actions: AiAction[] = [];
  let currentNpcMana = npcMana;
  let currentNpcSlots = [...npcSlots];

  // 1. Play a card
  const availableSlots = currentNpcSlots.map((slot, i) => slot === null ? i : -1).filter(i => i !== -1);
  if (availableSlots.length > 0 && currentNpcMana >= 2) {
    const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
    const newCard = { id: `npc_${Date.now()}`, name: 'Minion', atk: 2, hp: 2, cost: 2, art: '', effect: '' };
    actions.push({ type: 'play_card', slotIndex: slot, card: newCard });
    currentNpcSlots[slot] = newCard;
    currentNpcMana -= 2;
  }

  // 2. Attack
  currentNpcSlots.forEach((card, i) => {
    if (card) {
      const targetSlot = Math.floor(Math.random() * 13); // 12 slots + avatar
      if (targetSlot < 12) {
        if (playerSlots[targetSlot]) {
          actions.push({ type: 'attack', attackerSlot: i, targetSlot });
        }
      } else {
        actions.push({ type: 'attack', attackerSlot: i, targetSlot: 'avatar' });
      }
    }
  });

  return { actions };
};
