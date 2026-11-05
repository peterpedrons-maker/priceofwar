// Idiomas (português do Brasil e inglês). O jogo é escrito em português: os textos no código ficam como estão e o inglês vem do dicionário `en.json`
// (chave = texto em português; "{}" marca um pedaço que muda, como um número ou um nome). Em inglês, um tradutor de tela (`startTranslator`) troca o
// texto que aparece; em português ele nem liga. Nomes e efeitos de cartas são trocados nos dados (`tEffect`), porque o desenho do texto da carta
// reconhece palavras de regra. Os identificadores (nomes de carta na coleção, ids) nunca mudam: só o que o jogador lê.
import en from './en.json';

export type Lang = 'pt' | 'en';
const KEY = 'pow.lang';
const read = (): Lang => { try { const v = localStorage.getItem(KEY); return v === 'en' ? 'en' : 'pt'; } catch { return 'pt'; } };
let lang: Lang = read();
export const getLang = (): Lang => lang;
export const hasChosenLang = (): boolean => { try { return localStorage.getItem(KEY) !== null; } catch { return true; } };
export const setLang = (l: Lang) => { lang = l; try { localStorage.setItem(KEY, l); } catch { /* sem armazenamento */ } try { document.documentElement.lang = l === 'en' ? 'en' : 'pt-BR'; } catch { /* sem DOM */ } };
// Trocar o idioma recarrega a página: cartas e janelas já desenhadas pegam o idioma novo do zero.
export const changeLang = (l: Lang) => { setLang(l); window.location.reload(); };

const DICT = en as Record<string, string>;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
interface Pat { re: RegExp; out: string; weight: number }
let patterns: Pat[] | null = null;
const buildPatterns = (): Pat[] => {
  const list: Pat[] = [];
  for (const [k, v] of Object.entries(DICT)) {
    if (!k.includes('{}')) continue;
    list.push({ re: new RegExp('^' + k.split('{}').map(esc).join('(.+?)') + '$', 's'), out: v, weight: k.replace(/\{\}/g, '').length });
  }
  return list.sort((a, b) => b.weight - a.weight);
};
const cache = new Map<string, string | null>();
// Traduz um texto (sem mexer nos espaços das pontas). null: não há tradução.
const lookup = (text: string, depth = 0): string | null => {
  const key = norm(text);
  if (!key) return null;
  const hit = DICT[key];
  if (hit !== undefined) return hit;
  if (cache.has(key)) return cache.get(key)!;
  let res: string | null = null;
  if (depth < 3) {
    patterns = patterns ?? buildPatterns();
    for (const p of patterns) {
      const m = p.re.exec(key);
      if (!m) continue;
      const parts = m.slice(1).map(g => lookup(g, depth + 1) ?? g);
      let i = 0;
      res = p.out.replace(/\{(\d*)\}/g, (_, n: string) => parts[n ? Number(n) - 1 : i++] ?? '');
      break;
    }
  }
  cache.set(key, res);
  return res;
};
const keepEdges = (orig: string, tr: string) => (/^\s/.test(orig) ? ' ' : '') + tr + (/\s$/.test(orig) ? ' ' : '');
// Para código: t('Voltar') devolve 'Back' em inglês. Texto sem tradução volta igual.
export const t = (pt: string): string => (lang === 'en' ? lookup(pt) ?? pt : pt);
// Efeito de carta (texto de regra com **palavras de regra**): traduzido nos dados antes de desenhar.
export const tEffect = (pt: string): string => (lang === 'en' ? DICT[norm(pt)] ?? pt : pt);
export const hasEnglish = (pt: string): boolean => lookup(pt) !== null;

// ── Tradutor de tela (só em inglês) ─────────────────────────────────────────
// Troca o texto dos nós de texto e de alguns atributos (placeholder, aria-label, title, alt). O React escreve vários nós de texto seguidos
// para "Faltam {n} cartas" (três nós): a sequência é juntada para achar o padrão. Cada nó guarda o texto original; se o React reescrever o nó,
// o valor novo vira o original.
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
const origText = new WeakMap<Text, string>(), wrote = new WeakMap<Text, string>();
const origAttr = new WeakMap<Element, Record<string, string>>(), wroteAttr = new WeakMap<Element, Record<string, string>>();
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'CODE']);
const skipNode = (n: Node) => { const p = n.parentElement; return !p || SKIP.has(p.tagName) || p.isContentEditable || !!p.closest('[data-no-i18n]'); };
const hasLetters = (s: string) => /[A-Za-zÀ-ú]/.test(s);
const originalOf = (n: Text): string => { const v = n.nodeValue ?? ''; if (wrote.get(n) === v && origText.has(n)) return origText.get(n)!; origText.set(n, v); return v; };
const runOf = (n: Text): Text[] => {
  let a: Node = n; while (a.previousSibling && a.previousSibling.nodeType === 3) a = a.previousSibling;
  const run: Text[] = []; for (let c: Node | null = a; c && c.nodeType === 3; c = c.nextSibling) run.push(c as Text); return run;
};
const setText = (n: Text, orig: string, val: string) => { wrote.set(n, val); origText.set(n, orig); if (n.nodeValue !== val) n.nodeValue = val; };
const processText = (n: Text, seen: Set<Text>) => {
  if (seen.has(n) || skipNode(n)) return;
  const run = runOf(n); run.forEach(r => seen.add(r));
  const origs = run.map(originalOf), joined = origs.join('');
  if (!hasLetters(joined)) { run.forEach((r, i) => setText(r, origs[i], origs[i])); return; }
  if (run.length > 1) {
    const tr = lookup(joined);
    if (tr !== null) { run.forEach((r, i) => setText(r, origs[i], i === 0 ? keepEdges(joined, tr) : '')); return; }
  }
  run.forEach((r, i) => { const tr = hasLetters(origs[i]) ? lookup(origs[i]) : null; setText(r, origs[i], tr === null ? origs[i] : keepEdges(origs[i], tr)); });
};
const processAttrs = (el: Element) => {
  for (const a of ATTRS) {
    const v = el.getAttribute(a); if (v === null) continue;
    const w = wroteAttr.get(el)?.[a], o = origAttr.get(el)?.[a];
    const orig = w === v && o !== undefined ? o : v;
    const tr = hasLetters(orig) ? lookup(orig) : null, val = tr === null ? orig : tr;
    (origAttr.get(el) ?? origAttr.set(el, {}).get(el)!)[a] = orig; (wroteAttr.get(el) ?? wroteAttr.set(el, {}).get(el)!)[a] = val;
    if (v !== val) el.setAttribute(a, val);
  }
};
const walk = (root: Node, seen: Set<Text>) => {
  if (root.nodeType === 3) { processText(root as Text, seen); return; }
  if (root.nodeType !== 1) return;
  const el = root as Element;
  if (SKIP.has(el.tagName)) return;
  processAttrs(el);
  for (let c = el.firstChild; c; c = c.nextSibling) walk(c, seen);
};
let observer: MutationObserver | null = null;
export const startTranslator = () => {
  if (observer || lang !== 'en' || typeof document === 'undefined') return;
  document.documentElement.lang = 'en';
  const run = (nodes: Iterable<Node>) => { const seen = new Set<Text>(); for (const n of nodes) walk(n, seen); };
  observer = new MutationObserver(muts => {
    const nodes = new Set<Node>();
    for (const m of muts) {
      if (m.type === 'characterData') { const n = m.target as Text; if (wrote.get(n) !== n.nodeValue) nodes.add(n); }
      else if (m.type === 'attributes') { const el = m.target as Element, a = m.attributeName!; if (wroteAttr.get(el)?.[a] !== el.getAttribute(a)) processAttrs(el); }
      else m.addedNodes.forEach(n => nodes.add(n));
    }
    if (nodes.size) run(nodes);
  });
  const go = () => { run([document.body]); observer!.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS }); };
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
};
