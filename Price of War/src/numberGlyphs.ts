// Números flutuantes (dano, cura, ouro, escudo): cada dígito é uma imagem gerada em Python (Cinzel Black com contorno,
// degradê e brilho), uma família de cores por tipo; o "estouro" atrás é a mesma coisa, uma estrela por tipo.
export type NumberKind = 'damage' | 'heal' | 'gold' | 'goldspend' | 'shield';

const files = (import.meta as any).glob('./assets/num/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const NAME: Record<string, string> = { '-': 'minus', '+': 'plus' };

export const glyphUrl = (kind: NumberKind, ch: string): string | undefined => files[`./assets/num/${kind}-${NAME[ch] ?? ch}.webp`];
export const burstUrl = (kind: NumberKind): string | undefined => files[`./assets/num/burst-${kind === 'goldspend' ? 'damage' : kind}.webp`];

// Cor do brilho em volta do número, por tipo.
export const NUMBER_GLOW: Record<NumberKind, string> = {
  damage: 'rgba(255,70,30,0.85)', heal: 'rgba(90,230,110,0.85)', gold: 'rgba(255,214,70,0.85)',
  goldspend: 'rgba(255,130,100,0.75)', shield: 'rgba(120,180,255,0.9)',
};
