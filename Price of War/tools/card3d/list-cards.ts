// Prints every card of the catalog (what the 3D viewer needs a texture for) as JSON. Run: npx tsx tools/card3d/list-cards.ts > tools/card3d/cards.json
import { CARD_DEFS } from '../../src/engine/catalog';
import { cardSlug } from '../../src/card3d';
console.log(JSON.stringify(CARD_DEFS.map(d => ({ slug: cardSlug(d.name), name: d.name, type: d.cardType, atk: d.atk, hp: d.hp, cost: d.cost, effect: d.effect, full: !!d.isFullArt })), null, 1));
