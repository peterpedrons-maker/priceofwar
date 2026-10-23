// Texturas das cartas (3D, abertura de booster, Sala de Coleção): o desenho da carta tem nome e efeito escritos, então há uma pasta por idioma.
// `src/assets/card3d` (português, tem também o verso `_back`) e `src/assets/card3d-en` (inglês; se uma carta não estiver lá, cai no português).
// Para gerar o inglês: LANG_UI=en node tools/card3d/render-faces.cjs <pasta>  e  DST=src/assets/card3d-en python3 tools/card3d/to-webp.py <pasta>.
import { getLang } from './index';

const PT = import.meta.glob('../assets/card3d/*.webp', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const EN = import.meta.glob('../assets/card3d-en/*.webp', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const PT_EAGER = import.meta.glob('../assets/card3d/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const EN_EAGER = import.meta.glob('../assets/card3d-en/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export const faceUrl = async (slug: string): Promise<string | null> => {
  const f = (getLang() === 'en' && EN[`../assets/card3d-en/${slug}.webp`]) || PT[`../assets/card3d/${slug}.webp`];
  return f ? f() : null;
};
export const faceThumb = (slug: string): string | undefined => (getLang() === 'en' && EN_EAGER[`../assets/card3d-en/${slug}.webp`]) || PT_EAGER[`../assets/card3d/${slug}.webp`];
