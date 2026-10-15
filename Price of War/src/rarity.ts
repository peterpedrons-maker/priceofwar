// Raridades e numeração das cartas (plano do dono, rodada 26; docs/raridades.md).
// Toda carta pode vir em qualquer raridade; a raridade é do EXEMPLAR (cópia), não da carta. Efeitos visuais:
//   carta padrão:  Comum = nada · Rara = brilha a arte · Ultra rara = brilha a arte e as letras do nome
//   carta Full Art: Comum = nada · Rara = brilham só as letras do nome · Ultra rara = a carta inteira brilha
//   (futuro: 'secreta' = Full Art com outra arte; reservada, ainda não sorteia)
// A numeração é de coleção: o mesmo número para todas as raridades; o sufixo diz qual é (0001C, 0001R, 0001UR, 0001S).
import { CARD_DEFS } from './engine/catalog';

export type Rarity = 'comum' | 'rara' | 'ultra' | 'secreta';
export const RARITY_CODE: Record<Rarity, string> = { comum: 'C', rara: 'R', ultra: 'UR', secreta: 'S' };
export const RARITY_NAME: Record<Rarity, string> = { comum: 'Comum', rara: 'Rara', ultra: 'Ultra rara', secreta: 'Secreta' };
export const RARITY_ORDER: Record<Rarity, number> = { comum: 0, rara: 1, ultra: 2, secreta: 3 };
// Probabilidades de nível TCG (pesquisa da rodada 26: Pokémon ~1 Ilustração Rara a cada 13 pacotes e ~1 Especial a cada 80-90; Yu-Gi-Oh Ultra ~1 a cada 6 e Secret ~1 a cada 12).
// Por cópia (um booster tem 5), independente da carta: Rara ≈ 1 pacote em 6; Ultra rara ≈ 1 pacote em 80 (quem tira uma teve muita sorte).
// Uma Full Art também é rara de aparecer: só 1 pacote em 8 traz uma (FULLART_PACK_CHANCE); dentro dela, Rara e Ultra rara são mais prováveis que nas cartas padrão.
export const RARITY_ODDS = { padrao: { rara: 0.035, ultra: 0.0025 }, fullart: { rara: 0.12, ultra: 0.03 } } as const;
export const FULLART_PACK_CHANCE = 0.125;
export const rollRarity = (isFullArt: boolean, rnd: () => number = Math.random): Rarity => {
  const o = isFullArt ? RARITY_ODDS.fullart : RARITY_ODDS.padrao, r = rnd();
  return r < o.ultra ? 'ultra' : r < o.ultra + o.rara ? 'rara' : 'comum';
};
export type Shine = 'none' | 'art' | 'name' | 'art+name' | 'card';
export const shineOf = (rarity: Rarity | undefined, isFullArt: boolean): Shine => {
  if (!rarity || rarity === 'comum') return 'none';
  if (rarity === 'rara') return isFullArt ? 'name' : 'art';
  return isFullArt ? 'card' : 'art+name';   // 'ultra' (a 'secreta' brilha como ultra até ter arte própria)
};
// Número da carta: posição (1, 2, 3…) na lista do catálogo. IMPORTANTE: carta nova entra no FIM de CARD_DEFS, senão os números mudam.
const NUMBERS = new Map<string, number>(); CARD_DEFS.forEach((d, i) => { if (!NUMBERS.has(d.name)) NUMBERS.set(d.name, NUMBERS.size + 1); void i; });
export const cardNumber = (name: string): number => NUMBERS.get(name) ?? 0;
export const cardCode = (name: string, rarity: Rarity = 'comum'): string => `${String(cardNumber(name)).padStart(4, '0')}${RARITY_CODE[rarity]}`;
export type RarityCounts = Partial<Record<'rara' | 'ultra' | 'secreta', number>>;   // quantas cópias da coleção não são comuns (o total fica em collection[nome])
