// Mercenários: hoje as cartas e a receita ficam no catálogo (src/engine/catalog.ts), como as dos outros decks.
// Este arquivo mantém os nomes que o laboratório (tests/balance-merc.ts, tools/mercenarios-tabela.ts) já usava e
// mantém também os nomes do deck de Campo (que agora também está no catálogo, ver docs/deck-campo.md).
// Proposta e decisões: docs/deck-mercenarios.md e docs/deck-campo.md.
import { CARD_DEFS, DECK_RECIPES } from './catalog';
import type { CardDef } from './types';

const names = new Set(Object.keys(DECK_RECIPES.mercenarios.cards).concat(DECK_RECIPES.mercenarios.general));
export const MERCENARIOS_DEFS: readonly CardDef[] = CARD_DEFS.filter(c => names.has(c.name));
export const MERCENARIOS_RECIPE = DECK_RECIPES.mercenarios;
export const registerMercenarios = () => { /* já no catálogo */ };

const campoNames = new Set(Object.keys(DECK_RECIPES.campo.cards).concat(DECK_RECIPES.campo.general));
export const CAMPO_DEFS: readonly CardDef[] = CARD_DEFS.filter(c => campoNames.has(c.name));
export const CAMPO_RECIPE = DECK_RECIPES.campo;
export const registerCampo = () => { /* já no catálogo */ };
