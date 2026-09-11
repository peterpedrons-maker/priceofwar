import { CardData } from '../App';

export type AiAction =
  | { type: 'play_card', slotIndex: number, card: CardData }
  | { type: 'attack', attackerSlot: number, targetSlot: number };

export const playAiTurn = (
  npcSlots: (CardData | null)[],
  playerSlots: (CardData | null)[],
  npcMana: number,
  npcHand: CardData[]
): { actions: AiAction[]; playedCardIds: string[] } => {
  const actions: AiAction[] = [];
  const playedCardIds: string[] = [];
  let currentNpcMana = npcMana;
  const currentNpcSlots = [...npcSlots];

  // 1. Play cards — greedily play every affordable hand card (in hand order) into any
  // free Vanguarda/Retaguarda slot (0-9). Relíquia/Terreno cards need one of the two
  // special slots beside the General (10/11); the AI skips those for now and only
  // plays regular units, keeping its board logic simple.
  for (const card of npcHand) {
    if (card.cardType === 'Relíquia' || card.cardType === 'Terreno') continue;
    if (card.cost > currentNpcMana) continue;
    const emptySlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => currentNpcSlots[i] === null);
    if (emptySlots.length === 0) break; // board is full, no point checking the rest of the hand
    const slot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
    actions.push({ type: 'play_card', slotIndex: slot, card });
    playedCardIds.push(card.id);
    currentNpcSlots[slot] = card;
    currentNpcMana -= card.cost;
  }

  // 2. Attack — each NPC minion swings at the player's most exposed row: Vanguarda
  // first, then Retaguarda, then the General itself once the front lines are clear.
  const pickTarget = (): number | null => {
    const front = [0, 1, 2, 3, 4].filter(i => playerSlots[i]);
    if (front.length > 0) return front[Math.floor(Math.random() * front.length)];
    const back = [5, 6, 7, 8, 9].filter(i => playerSlots[i]);
    if (back.length > 0) return back[Math.floor(Math.random() * back.length)];
    return playerSlots[12] ? 12 : null;
  };

  for (let i = 0; i <= 9; i++) {
    const attacker = currentNpcSlots[i];
    if (!attacker || attacker.atk <= 0) continue;
    const target = pickTarget();
    if (target !== null) {
      actions.push({ type: 'attack', attackerSlot: i, targetSlot: target });
    }
  }

  return { actions, playedCardIds };
};
