// Faixas com texto desenhado na imagem (BATALHA, VITÓRIA, DERROTA): em inglês usa `banner-<nome>-en.webp` se a arte existir em src/assets;
// enquanto não existe, uma faixa em SVG (texto dourado) faz o papel, no mesmo tamanho da arte original.
import { getLang } from './index';

const EN_ART = import.meta.glob('../assets/banner-*-en.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const WORD = { batalha: 'BATTLE!', vitoria: 'VICTORY!', derrota: 'DEFEAT' } as const;
const COLORS = { batalha: ['#ffe9a8', '#e0a02a', '#6a3a08'], vitoria: ['#fff0b8', '#f0b52e', '#6a3a08'], derrota: ['#d8d2c8', '#8a7f74', '#2a2420'] } as const;
const svgBanner = (key: keyof typeof WORD): string => {
  const [a, b, edge] = COLORS[key], big = WORD[key].length > 7 ? 150 : 190;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 460"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${edge}"/></linearGradient><filter id="s" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity=".7"/></filter></defs><text x="384" y="270" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-weight="900" font-style="italic" font-size="${big}" letter-spacing="6" fill="url(#g)" stroke="${edge}" stroke-width="12" paint-order="stroke" filter="url(#s)">${WORD[key]}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};
export const bannerSrc = (key: keyof typeof WORD, ptSrc: string): string => {
  if (getLang() !== 'en') return ptSrc;
  const found = Object.entries(EN_ART).find(([p]) => p.includes(`banner-${key === 'batalha' ? 'batalha' : key === 'vitoria' ? 'vitoria' : 'derrota'}-en.webp`));
  return found ? found[1] : svgBanner(key);
};
