import { CardData } from '../App';

export type AiAction =
  | { type: 'play_card', slotIndex: number, card: CardData }
  | { type: 'attack', attackerSlot: number, targetSlot: number };

export const playAiTurn = (
  npcSlots: (CardData | null)[],
  playerSlots: (CardData | null)[],
  npcMana: number,
  hand: CardData[]
): { actions: AiAction[] } => {
  const actions: AiAction[] = [];
  let currentNpcMana = npcMana;
  let currentNpcSlots = [...npcSlots];

  // 1. Play a card — only into Vanguarda/Retaguarda (0-9). Slots 10/11 are
  // Relíquia/Terreno-only and slot 12 holds the fixed General.
  const availableSlots = currentNpcSlots
    .map((slot, i) => (slot === null && i <= 9 ? i : -1))
    .filter(i => i !== -1);
  if (availableSlots.length > 0 && currentNpcMana >= 2) {
    const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
    const newCard = { id: `npc_${Date.now()}`, name: 'Minion', atk: 2, hp: 2, cost: 2, art: '', effect: '' };
    actions.push({ type: 'play_card', slotIndex: slot, card: newCard });
    currentNpcSlots[slot] = newCard;
    currentNpcMana -= 2;
  }

  // 2. Attack — target any of the 13 slots (0-9 units, 10/11 Relíquia/Terreno, 12 General)
  currentNpcSlots.forEach((card, i) => {
    if (card) {
      const targetSlot = Math.floor(Math.random() * 13);
      if (playerSlots[targetSlot]) {
        actions.push({ type: 'attack', attackerSlot: i, targetSlot });
      }
    }
  });

  return { actions };
};
