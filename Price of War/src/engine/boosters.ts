// Boosters: o que cada um traz, o sorteio e o que acontece com cartas repetidas. O servidor é quem sorteia e cobra (op `openBooster`);
// o aparelho só pede e mostra. Convidados (sem conta) usam as mesmas funções, localmente.
import { BOOSTER_EXTRA, DECK_RECIPES, LEGACY_STARTERS, getCardDef, type DeckId } from './catalog';
import { maxCopiesOf } from './deck';
import { FULLART_PACK_CHANCE, rollRarity, type Rarity } from '../rarity';

export const BOOSTER_PRICE = 150;
export const BOOSTER_CARDS = 5;
export const BOOSTER_IDS: DeckId[] = ['cardeal', 'capitao', 'mercenarios', 'campo'];
// Carta repetida (já tem o máximo de cópias) vira coroas, pela raridade da cópia sorteada (decisão do dono, rodada 26).
export const DUP_COROAS: Record<Rarity, number> = { comum: 5, rara: 15, ultra: 50, secreta: 50 };
// Proteção de sorte suave: carta que o jogador ainda não tem pesa o triplo no sorteio (não é garantia, só empurra para o novo).
export const NEW_CARD_BOOST = 3;

export interface PoolEntry { name: string; cost: number; fullArt: boolean; weight: number }
// O que um booster da facção pode trazer: as cartas dela (listas antigas + baralho de hoje + extras), sem o General; o peso soma as cópias.
export const boosterPool = (id: DeckId): PoolEntry[] => {
  const count: Record<string, number> = { ...LEGACY_STARTERS[id][0] };
  [DECK_RECIPES[id].cards, BOOSTER_EXTRA[id] ?? {}].forEach(list => Object.entries(list).forEach(([name, n]) => { count[name] = Math.max(count[name] ?? 0, n); }));
  return Object.entries(count).map(([name, n]) => {
    const def = getCardDef(name)!;
    return { name, cost: def.cost, fullArt: !!def.isFullArt, weight: n };
  });
};

export interface Pull { name: string; rarity: Rarity }
// Cartas baratas saem mais; a última do pacote é sempre de custo 3 ou mais; 1 pacote em 8 traz uma Full Art no lugar de uma das quatro primeiras.
export const rollBooster = (id: DeckId, owned: Record<string, number> = {}, rnd: () => number = Math.random): Pull[] => {
  const all = boosterPool(id), pool = all.filter(c => !c.fullArt), fullArts = all.filter(c => c.fullArt);
  const weight = (c: PoolEntry) => c.weight * (c.cost <= 1 ? 6 : c.cost === 2 ? 4 : c.cost === 3 ? 2 : 1) * ((owned[c.name] ?? 0) === 0 ? NEW_CARD_BOOST : 1);
  const draw = (list: PoolEntry[]) => {
    let roll = rnd() * list.reduce((s, c) => s + weight(c), 0);
    for (const c of list) { roll -= weight(c); if (roll <= 0) return c; }
    return list[list.length - 1];
  };
  const strong = pool.filter(c => c.cost >= 3);
  const out: PoolEntry[] = [];
  for (let i = 0; i < BOOSTER_CARDS - 1; i++) out.push(draw(pool));
  out.push(draw(strong.length ? strong : pool));
  if (fullArts.length && rnd() < FULLART_PACK_CHANCE) out[Math.floor(rnd() * (BOOSTER_CARDS - 1))] = fullArts[Math.floor(rnd() * fullArts.length)];
  return out.map(c => ({ name: c.name, rarity: rollRarity(c.fullArt, rnd) }));
};

export interface Settled extends Pull {
  isNew: boolean;
  dup: 'no' | 'upgrade' | 'coroas';   // upgrade: o jogador já tinha o máximo, mas ainda havia uma cópia comum: ela vira esta versão (e a comum rende coroas)
  coroas: number;                     // quanto esta carta rendeu em coroas (repetida)
}
// Aplica o pacote à coleção (`owned` usa os mesmos nomes da nuvem: "<carta>" e "<carta>#rara|ultra|secreta") e diz o que gravar:
// `adds` são incrementos por nome (cópias e versões) e `refund` o total devolvido em coroas pelas repetidas.
export const settleBooster = (owned: Record<string, number>, pulls: Pull[]): { cards: Settled[]; adds: Record<string, number>; refund: number } => {
  const have = { ...owned }, adds: Record<string, number> = {}, cards: Settled[] = [];
  let refund = 0;
  const add = (k: string) => { have[k] = (have[k] ?? 0) + 1; adds[k] = (adds[k] ?? 0) + 1; };
  for (const p of pulls) {
    const total = have[p.name] ?? 0, special = (['rara', 'ultra', 'secreta'] as const).reduce((s, r) => s + (have[`${p.name}#${r}`] ?? 0), 0);
    const mark = () => { if (p.rarity !== 'comum') add(`${p.name}#${p.rarity}`); };
    if (total < maxCopiesOf(p.name)) { add(p.name); mark(); cards.push({ ...p, isNew: total === 0, dup: 'no', coroas: 0 }); continue; }
    if (p.rarity !== 'comum' && total - special > 0) { mark(); refund += DUP_COROAS.comum; cards.push({ ...p, isNew: false, dup: 'upgrade', coroas: DUP_COROAS.comum }); continue; }
    refund += DUP_COROAS[p.rarity]; cards.push({ ...p, isNew: false, dup: 'coroas', coroas: DUP_COROAS[p.rarity] });
  }
  return { cards, adds, refund };
};
