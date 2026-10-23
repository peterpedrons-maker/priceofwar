// Código de deck: um texto curto que representa um deck (General + cartas e quantidades) para copiar e colar entre jogadores.
//   POW1-<base64url>          bytes: versão(1) · nº do General(2) · quantidade de cartas diferentes(1) · [nº da carta(2) · cópias(1)]… · soma de conferência(1)
// O número de cada carta é o da coleção (`cardNumber`, posição no catálogo: carta nova entra no FIM, então os códigos antigos continuam valendo).
// O código só diz qual é o deck; quem importa só recebe as cartas que tem (o servidor continua conferindo o deck contra a coleção na hora de jogar).
import { CARD_DEFS } from './engine/catalog';
import { cardNumber } from './rarity';

const BY_NUMBER: string[] = [];
CARD_DEFS.forEach(d => { const n = cardNumber(d.name); if (n && !BY_NUMBER[n]) BY_NUMBER[n] = d.name; });

const b64 = (bytes: number[]): string => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s: string): number[] | null => {
  try { const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)); return [...bin].map(c => c.charCodeAt(0)); } catch { return null; }
};
const sum8 = (bytes: number[]) => bytes.reduce((a, b) => (a * 31 + b + 7) & 255, 17);

export const encodeDeck = (general: string, cards: Record<string, number>): string => {
  const g = cardNumber(general);
  const list = Object.entries(cards).filter(([n, c]) => c > 0 && cardNumber(n) > 0).sort((a, b) => cardNumber(a[0]) - cardNumber(b[0]));
  const bytes = [1, g >> 8, g & 255, list.length];
  list.forEach(([n, c]) => { const k = cardNumber(n); bytes.push(k >> 8, k & 255, Math.min(255, c)); });
  bytes.push(sum8(bytes));
  return 'POW1-' + b64(bytes);
};
export type DecodedDeck = { general: string; cards: Record<string, number> };
export const decodeDeck = (raw: string): DecodedDeck | { error: string } => {
  const code = raw.trim().replace(/\s+/g, '');
  if (!/^POW1-[A-Za-z0-9_-]+$/.test(code)) return { error: 'Código de deck inválido.' };
  const b = unb64(code.slice(5));
  if (!b || b.length < 5 || b[0] !== 1) return { error: 'Código de deck inválido.' };
  if (sum8(b.slice(0, -1)) !== b[b.length - 1]) return { error: 'Código de deck inválido (faltou um pedaço ao copiar?).' };
  const general = BY_NUMBER[(b[1] << 8) | b[2]], n = b[3];
  if (!general || b.length !== 5 + n * 3) return { error: 'Código de deck inválido.' };
  const cards: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const name = BY_NUMBER[(b[4 + i * 3] << 8) | b[5 + i * 3]];
    if (!name) return { error: 'Esse deck tem cartas que o seu jogo ainda não conhece. Atualize o jogo.' };
    cards[name] = b[6 + i * 3];
  }
  return { general, cards };
};
