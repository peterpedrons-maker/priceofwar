// Deck-building rules: size (50 to 60), copies per card (3 unless the card says otherwise), and that the prebuilt decks obey them:   npx tsx tests/deck-rules.ts
import { DECK_RECIPES, getCardDef } from '../src/engine/catalog';
import { DECK_DEFAULT_MAX_COPIES, DECK_MAX_CARDS, DECK_MIN_CARDS, deckCardCount, deckProblem, maxCopiesOf } from '../src/engine/deck';
let passed = 0, failed = 0;
const test = (name: string, fn: () => void) => { try { fn(); passed++; } catch (e) { failed++; console.log(`  ✗ ${name}\n      ${(e as Error).message}`); } };
const ok = (c: boolean, msg: string) => { if (!c) throw new Error(msg); };
const eq = (a: unknown, b: unknown, msg = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };

const recipe = DECK_RECIPES.cardeal;
// Some playable list of a given size: cards of the Cardeal deck, never above each card's own limit.
const listOf = (size: number): Record<string, number> => {
  const cards: Record<string, number> = {};
  let n = 0;
  while (n < size) {
    let added = false;
    for (const name of Object.keys(recipe.cards)) {
      if (n >= size) break;
      if ((cards[name] ?? 0) < maxCopiesOf(name)) { cards[name] = (cards[name] ?? 0) + 1; n++; added = true; }
    }
    if (!added) break;
  }
  return cards;
};

test('size: 50 to 60 cards', () => {
  eq([DECK_MIN_CARDS, DECK_MAX_CARDS], [50, 60]);
  ok(deckProblem(listOf(50), recipe.general) === null, 'exactly 50 is playable: ' + deckProblem(listOf(50), recipe.general));
  ok(deckProblem(listOf(60), recipe.general) === null, 'exactly 60 is playable');
  ok(/mínimo 50/.test(deckProblem(listOf(49), recipe.general) ?? ''), '49 is too few');
  ok(/máximo 60/.test(deckProblem({ ...listOf(60), 'Escudeiro de Linha': 5 }, recipe.general) ?? ''), 'above 60 is too many');
});

test('copies: the default limit is 3 and a card can set its own', () => {
  eq(DECK_DEFAULT_MAX_COPIES, 3);
  const plain = Object.keys(recipe.cards).find(n => getCardDef(n)?.maxCopies === undefined)!;
  eq(maxCopiesOf(plain), 3, 'a card without maxCopies');
  const cards = { ...listOf(50) };
  const base = cards[plain] ?? 0;
  cards[plain] = 4;
  const other = Object.keys(cards).find(n => n !== plain && cards[n] > 1)!;
  cards[other] -= base < 4 ? 4 - base : 0;   // keep the size near, the copies rule is what is under test
  ok(/Limite de 3 cópias/.test(deckProblem(cards, recipe.general) ?? ''), 'a 4th copy of a normal card is refused: ' + deckProblem(cards, recipe.general));
});

test('the prebuilt decks are valid, and only the temporary exceptions go above 3 copies', () => {
  const above3 = new Set<string>();
  for (const [id, d] of Object.entries(DECK_RECIPES)) {
    ok(deckProblem(d.cards, d.general) === null, `${id} must be a valid deck: ${deckProblem(d.cards, d.general)}`);
    ok(deckCardCount(d.cards) >= DECK_MIN_CARDS, `${id} has at least ${DECK_MIN_CARDS} cards`);
    for (const [name, copies] of Object.entries(d.cards)) if ((copies as number) > DECK_DEFAULT_MAX_COPIES) above3.add(name);
  }
  // Every card with a limit above the default is one the prebuilt decks still need: when a deck is rebuilt to fit 3 copies, its exception goes away.
  const exceptions = Object.keys(DECK_RECIPES).flatMap(id => Object.keys(DECK_RECIPES[id as keyof typeof DECK_RECIPES].cards)).filter((n, i, a) => a.indexOf(n) === i && maxCopiesOf(n) > DECK_DEFAULT_MAX_COPIES);
  eq(exceptions.sort(), [...above3].sort(), 'temporary exceptions = cards the prebuilt decks run above 3');
  eq(above3.size, 22, 'step 2 (rebuild the decks) removes these 22');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
