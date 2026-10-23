// Deck-building rules, shared by the deck editor (to tell the player what is wrong) and the server (to refuse a
// cheated or stale deck when a match starts).
import { getCardDef, isGeneralName } from './catalog';

export const DECK_MIN_CARDS = 50;
export const DECK_MAX_CARDS = 60;
// Copies of one card: 3 unless the card says otherwise (`maxCopies` in the catalog: strong cards 2, unique cards 1).
export const DECK_DEFAULT_MAX_COPIES = 3;
export const maxCopiesOf = (name: string): number => getCardDef(name)?.maxCopies ?? DECK_DEFAULT_MAX_COPIES;

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
    if (copies > maxCopiesOf(name)) return `Limite de ${maxCopiesOf(name)} cópias por carta (${name})`;
    if (collection && copies > (collection[name] ?? 0)) return `Você não tem ${copies} cópias de ${name}`;
  }
  if (collection && (collection[general] ?? 0) < 1) return `Você não tem o General ${general}`;
  return null;
};
