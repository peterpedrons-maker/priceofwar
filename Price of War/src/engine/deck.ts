// Deck-building rules, shared by the deck editor (to tell the player what is wrong) and the server (to refuse a
// cheated or stale deck when a match starts).
import { getCardDef, isGeneralName } from './catalog';

export const DECK_MIN_CARDS = 40;
export const DECK_MAX_CARDS = 60;
export const DECK_MAX_COPIES = 4;

export const deckCardCount = (cards: Record<string, number>): number =>
  Object.values(cards).reduce((sum, n) => sum + n, 0);

// null when the deck is playable; otherwise the sentence to show. With `collection`, the deck is also checked
// against what the player actually owns.
export const deckProblem = (cards: Record<string, number>, general: string, collection?: Record<string, number>): string | null => {
  if (!isGeneralName(general)) return 'General inválido.';
  const n = deckCardCount(cards);
  if (n < DECK_MIN_CARDS) return `Faltam ${DECK_MIN_CARDS - n} cartas (mínimo ${DECK_MIN_CARDS})`;
  if (n > DECK_MAX_CARDS) return `${n - DECK_MAX_CARDS} cartas a mais (máximo ${DECK_MAX_CARDS})`;
  for (const [name, copies] of Object.entries(cards)) {
    const def = getCardDef(name);
    if (!def || def.cardType === 'General') return `Carta inválida no deck: ${name}`;
    if (!Number.isInteger(copies) || copies < 1) return `Quantidade inválida de ${name}`;
    if (copies > DECK_MAX_COPIES) return `Limite de ${DECK_MAX_COPIES} cópias por carta (${name})`;
    if (collection && copies > (collection[name] ?? 0)) return `Você não tem ${copies} cópias de ${name}`;
  }
  if (collection && (collection[general] ?? 0) < 1) return `Você não tem o General ${general}`;
  return null;
};
