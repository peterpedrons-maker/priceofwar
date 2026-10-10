// Mercenários (deck novo): hoje as cartas e a receita ficam no catálogo (src/engine/catalog.ts), como as dos outros decks.
// Este arquivo só mantém os nomes que o laboratório (tests/balance-merc.ts, tools/mercenarios-tabela.ts) já usava.
// Proposta e decisões: docs/deck-mercenarios.md.
import { CARD_DEFS, DECK_RECIPES } from './catalog';
import type { CardDef } from './types';

const names = new Set(Object.keys(DECK_RECIPES.mercenarios.cards).concat(DECK_RECIPES.mercenarios.general));
export const MERCENARIOS_DEFS: readonly CardDef[] = CARD_DEFS.filter(c => names.has(c.name));
export const MERCENARIOS_RECIPE = DECK_RECIPES.mercenarios;
export const registerMercenarios = () => { /* já no catálogo */ };
