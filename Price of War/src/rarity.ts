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
// Probabilidade de cada cópia de um booster (por cópia, independente da carta). Ajustável em um lugar só.
export const RARITY_ODDS = { padrao: { comum: 72, rara: 24, ultra: 4 }, fullart: { comum: 70, rara: 22, ultra: 8 } } as const;
export const rollRarity = (isFullArt: boolean, rnd: () => number = Math.random): Rarity => {
  const o = isFullArt ? RARITY_ODDS.fullart : RARITY_ODDS.padrao; let r = rnd() * (o.comum + o.rara + o.ultra);
  if ((r -= o.comum) < 0) return 'comum'; if ((r -= o.rara) < 0) return 'rara'; return 'ultra';
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
