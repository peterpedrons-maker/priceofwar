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

test('the prebuilt decks are 50 cards, valid, and respect each card\'s own limit (no exception above 3 is left)', () => {
  for (const [id, d] of Object.entries(DECK_RECIPES)) {
    ok(deckProblem(d.cards, d.general) === null, `${id} must be a valid deck: ${deckProblem(d.cards, d.general)}`);
    eq(deckCardCount(d.cards), 50, `${id} has exactly 50 cards`);
    for (const [name, copies] of Object.entries(d.cards)) ok((copies as number) <= maxCopiesOf(name), `${id}: ${name} x${copies} is above its limit ${maxCopiesOf(name)}`);
  }
  const above = Object.keys(DECK_RECIPES).flatMap(id => Object.keys(DECK_RECIPES[id as keyof typeof DECK_RECIPES].cards)).filter(n => maxCopiesOf(n) > DECK_DEFAULT_MAX_COPIES);
  eq(above, [], 'no card may have a limit above the default');
});

test('limits follow strength: unique cards 1, strong cards 2', () => {
  eq(['Trabuco da Trombeta Final', 'Estandarte da Legião', 'Cambista do Dízimo'].map(maxCopiesOf), [1, 1, 1]);
  eq(['Jorge, Lança Sagrada', 'Vigia do Último Salmo', 'Códice das Mil Dívidas'].map(maxCopiesOf), [2, 2, 2]);
  eq(['Batedor', 'Soldado Tático', 'Penitente de Pedra'].map(maxCopiesOf), [3, 3, 3]);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
