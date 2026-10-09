// Efeitos permanentes de Terreno (a muralha da Fortaleza de Pedra): arte pintada por cima do tabuleiro, iluminada à noite por código.
// Um canvas só, por cima das casas e abaixo da mão e dos avisos. Cada lado (jogador e adversário) tem a sua instância:
// sobe quando o Terreno entra em campo, fica de pé animada e desaba quando ele sai. Mockup e receita: docs/animacoes.md.
import imgTorre from './assets/terrenos/torre.webp';
import imgMuroA from './assets/terrenos/muro_a.webp';
import imgMuroB from './assets/terrenos/muro_b.webp';
import imgPortao from './assets/terrenos/portao.webp';
import imgPedra from './assets/terrenos/pedra.webp';
import { getGameSettings, subscribeSettings } from './gameSettings';

export type TerrainFxKind = 'muralha';
type Side = 'player' | 'npc';
type Sprite = { n: 'torre' | 'muro_a' | 'muro_b' | 'portao'; x: number; h: number; ap: number; kind: 'wall' | 'tower' | 'gate'; flip?: boolean; yb?: number; tip?: boolean; crop?: boolean; w?: number };
interface Inst { side: Side; kind: TerrainFxKind; t0: number; end: number | null; hit: number | null }

const SRC: Record<string, string> = { torre: imgTorre, muro_a: imgMuroA, muro_b: imgMuroB, portao: imgPortao, pedra: imgPedra };
const IMG: Record<string, HTMLImageElement> = {};
let readyP: Promise<void> | null = null;
export const preloadTerrainFx = (): Promise<void> => (readyP ??= Promise.all(Object.entries(SRC).map(([k, src]) => new Promise<void>(r => { const i = new Image(); i.onload = () => { IMG[k] = i; r(); }; i.onerror = () => r(); i.src = src; }))).then(() => undefined));

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const back = (x: number) => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
let seed = 17; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// ── a muralha, em coordenadas de "projeto" (390 de largura, 1 casa = 71 de altura); y = 0 é a linha do chão, para cima é negativo ──
const GX = 196;
// Os muros preenchem exatamente o vão entre cada torre e o portão: entram um pouco por baixo deles (que são desenhados por cima) e se sobrepõem entre si,
// então não sobra espaço nem aparece a quina da imagem. As larguras vêm da proporção das imagens (torre 159x330, portão 238x330).
const TOWER_H = 80, GATE_H = 63, WALL_H = 38, TOWER_W = TOWER_H * 159 / 330, GATE_W = GATE_H * 238 / 330, SEG = 3, OVER = 6;
const wallRun = (from: number, to: number, flip: boolean, ap0: number): Sprite[] => Array.from({ length: SEG }, (_, i) => {
  const step = (to - from) / SEG, w = Math.abs(step) + OVER;
  return { n: (i % 2 ? 'muro_a' : 'muro_b') as Sprite['n'], x: from + step * (i + .5), h: WALL_H, w, ap: ap0 + i * 150, kind: 'wall' as const, flip, crop: true };
});
const SPRITES: Sprite[] = [
  ...wallRun(34, GX - GATE_W / 2 + 9, false, 950), ...wallRun(356, GX + GATE_W / 2 - 9, true, 1100),
  { n: 'torre', x: 22, h: TOWER_H, ap: 150, kind: 'tower', yb: 1, tip: true }, { n: 'torre', x: 368, h: TOWER_H, ap: 380, kind: 'tower', flip: true, yb: 1, tip: true },
  { n: 'portao', x: GX, h: GATE_H, ap: 1800, kind: 'gate', yb: 1 },
];
const SIDE_X = [{ x: 0, ap: 1100 }, { x: 380, ap: 1250 }];
const TORCHES: [number, number][] = [[66, -17], [326, -17], [GX - 30, -21], [GX + 30, -21]];
const ORDER = { wall: 0, gate: 1, tower: 2 } as const;
type Piece = { vx: number; vy: number; vr: number; d: number };
const mkPiece = (): Piece => ({ vx: (rnd() - .5) * 70, vy: -rnd() * 60, vr: (rnd() - .5) * 2.4, d: rnd() * .35 });
const PIECES = SPRITES.map(mkPiece);
const SIDE_CHUNKS: { x: number; k: number; ap: number; v: Piece; i: number }[] = [];
for (let k = 0; k < 2; k++) for (let i = 1; i <= 20; i++) SIDE_CHUNKS.push({ x: SIDE_X[k].x, k, i, ap: SIDE_X[k].ap + i * 29, v: mkPiece() });

// ── canvas, laço e estado ──
let cv: HTMLCanvasElement | null = null, mc: CanvasRenderingContext2D | null = null;
const scn = document.createElement('canvas'), lgt = document.createElement('canvas');
const sc = scn.getContext('2d')!, lc = lgt.getContext('2d')!;
let RES = 2, raf = 0, last = 0;
const insts: Record<Side, Inst | null> = { player: null, npc: null };
let wanted: Record<Side, TerrainFxKind | null> = { player: null, npc: null };

const ensureCanvas = () => {
  if (cv) return;
  cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100dvh;pointer-events:none;z-index:30';
  document.body.appendChild(cv); mc = cv.getContext('2d')!; resize();
  window.addEventListener('resize', resize);
};
const resize = () => { if (!cv) return; RES = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(window.innerWidth * RES); cv.height = Math.round(window.innerHeight * RES); redraw(); };
const animated = () => getGameSettings().terrainFx;

// onde fica o lado de cada jogador na tela (as casas são lidas do DOM, então acompanha qualquer tamanho de celular)
type Geo = { s: number; x0: number; base: number; dir: -1 | 1; len: number };
const geoOf = (side: Side): Geo | null => {
  const a = document.getElementById(`${side}-10`)?.getBoundingClientRect(), b = document.getElementById(`${side}-0`)?.getBoundingClientRect(), e = document.getElementById(`${side}-4`)?.getBoundingClientRect(); if (!a || !b || !e || !a.height) return null;
  const s = a.height / 71, x0 = (b.left + e.right) / 2 - 195 * s;
  if (side === 'player') return { s, x0, base: a.top + 137 * s, dir: -1, len: 291 * s };
  return { s, x0, base: a.top - 6 * s, dir: 1, len: (b.bottom - (a.top - 6 * s)) + 6 * s };
};

function spr(c: CanvasRenderingContext2D, n: string, x: number, yb: number, h: number, o: { flip?: boolean; a?: number; dy?: number; rot?: number; rise?: number; crop?: boolean; w?: number } = {}) {
  const im = IMG[n]; if (!im || !im.naturalWidth) return; const a = o.a ?? 1; if (a <= 0) return;
  const cropX = o.crop ? im.naturalWidth * .07 : 0, sw = im.naturalWidth - cropX * 2, w = o.w ?? h * sw / im.naturalHeight;
  c.save(); c.globalAlpha = a; c.translate(x, yb + (o.dy || 0)); if (o.rot) c.rotate(o.rot); c.scale(o.flip ? -1 : 1, 1);
  if (o.rise != null && o.rise < 1) { c.beginPath(); c.rect(-w / 2 - 4, -h - 6, w + 8, h * 1.1 * clamp(o.rise)); c.clip(); }
  c.drawImage(im, cropX, 0, sw, im.naturalHeight, -w / 2, -h, w, h); c.restore();
}
function dust(c: CanvasRenderingContext2D, x: number, y: number, q: number, k = 1) { if (q <= 0 || q >= 1) return; const g = c.createRadialGradient(x, y - q * 8, 0, x, y - q * 8, (6 + q * 16) * k); g.addColorStop(0, `rgba(190,170,130,${.3 * (1 - q)})`); g.addColorStop(1, 'rgba(190,170,130,0)'); c.fillStyle = g; c.fillRect(x - 30 * k, y - 40, 60 * k, 56); }
function flame(c: CanvasRenderingContext2D, x: number, y: number, t: number, k: number, S: number) { c.save(); c.globalCompositeOperation = 'lighter';
  let g = c.createRadialGradient(x, y - 4, 0, x, y - 4, 70 * S); g.addColorStop(0, `rgba(255,170,70,${.2 * S})`); g.addColorStop(1, 'rgba(255,150,50,0)'); c.fillStyle = g; c.fillRect(x - 80, y - 80, 160, 130);
  for (const [dx, hh, wd, ph] of [[-5, 9, 1.0, 0], [0, 15, 1.35, 1.3], [5.5, 10, 1.05, 2.4], [-2.5, 12, 1.2, 3.6], [2.5, 7, .9, 4.9]]) { const f = (.8 + .2 * Math.sin(t / 85 + ph * 2 + k) + .1 * Math.sin(t / 37 + ph)) * S, h = hh * f, sway = Math.sin(t / 150 + ph * 1.7) * 1.8 * S, bx = x + dx * S, by = y + 1;
    const gr = c.createLinearGradient(bx, by, bx, by - h); gr.addColorStop(0, 'rgba(255,236,170,.95)'); gr.addColorStop(.35, 'rgba(255,170,60,.85)'); gr.addColorStop(1, 'rgba(220,70,15,0)'); c.fillStyle = gr;
    c.beginPath(); c.moveTo(bx - 3.4 * wd * S, by); c.quadraticCurveTo(bx - 3.2 * wd * S + sway * .3, by - h * .55, bx + sway, by - h); c.quadraticCurveTo(bx + 3.2 * wd * S + sway * .3, by - h * .55, bx + 3.4 * wd * S, by); c.closePath(); c.fill(); }
  g = c.createRadialGradient(x, y - 2, 0, x, y - 2, 7 * S); g.addColorStop(0, 'rgba(255,250,215,.9)'); g.addColorStop(1, 'rgba(255,190,80,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y - 2, 6 * S, 3.4 * S, 0, 0, 7); c.fill(); c.restore(); }
function torch(c: CanvasRenderingContext2D, x: number, y: number, t: number, k: number, S: number) { c.save(); c.strokeStyle = '#2a1c0e'; c.lineWidth = 1.8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y + 9); c.lineTo(x, y - 1); c.stroke(); c.fillStyle = '#3a3a3e'; c.beginPath(); c.moveTo(x - 3.2, y - 2); c.lineTo(x + 3.2, y - 2); c.lineTo(x + 2, y + 2); c.lineTo(x - 2, y + 2); c.closePath(); c.fill(); c.restore(); flame(c, x, y - 2, t, k, S); }
function pennant(c: CanvasRenderingContext2D, x: number, y: number, t: number, un: number, k: number) { if (un <= 0) return; c.save(); c.strokeStyle = '#3b2d1b'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 13); c.stroke(); const L = 16 * un; c.beginPath(); c.moveTo(x, y - 13); for (let i = 0; i <= 8; i++) { const u = i / 8; c.lineTo(x + u * L, y - 13 + 1.8 + Math.sin(t / 220 - u * 3 + k) * 1.7 * u); } c.lineTo(x, y - 6); c.closePath(); const g = c.createLinearGradient(x, 0, x + L, 0); g.addColorStop(0, '#6f93d6'); g.addColorStop(1, '#2a4a8c'); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(230,195,100,.85)'; c.lineWidth = .7; c.stroke(); c.restore(); }

let pedraPat: CanvasPattern | null = null;
function drawSide(inst: Inst, now: number) {
  const g = geoOf(inst.side); if (!g || !mc || !cv) return; if (!IMG.torre) return;
  const { s, x0, base, dir, len } = g, t = now - inst.t0, te = inst.end != null ? now - inst.end : -1, dead = te >= 0, td = dead ? te / 1000 : 0, anim = animated();
  // faixa da tela onde o efeito mora (em px de tela)
  const top = dir < 0 ? base - (len + 20 * s) : base - 96 * s, bot = dir < 0 ? base + 16 * s : base + len + 20 * s, bx = Math.max(0, x0), bw = Math.min(window.innerWidth - bx, 390 * s + (x0 - bx));
  const BW = Math.max(2, Math.round(bw * RES)), BH = Math.max(2, Math.round((bot - top) * RES));
  if (scn.width !== BW || scn.height !== BH) { scn.width = lgt.width = BW; scn.height = lgt.height = BH; pedraPat = null; }
  const T = (c: CanvasRenderingContext2D) => { c.setTransform(RES * s, 0, 0, RES * s, (x0 - bx) * RES, (base - top) * RES); };
  for (const c of [sc, lc]) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, BW, BH); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; T(c); }
  if (!pedraPat && IMG.pedra) { pedraPat = sc.createPattern(IMG.pedra, 'repeat'); pedraPat?.setTransform(new DOMMatrix().scale(.25 * 128 / 512)); }
  // ───────── cena ─────────
  const gi = clamp((t - 200) / 1200) * (dead ? clamp(1 - te / 1500) : 1);
  if (gi > 0) { const gr = sc.createLinearGradient(0, -2, 0, 14); gr.addColorStop(0, `rgba(0,0,0,${.6 * gi})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); sc.fillStyle = gr; sc.fillRect(0, -2, 390, 16); }
  // muralhas laterais finas (textura de pedra), em pedaços que crescem em direção ao inimigo
  for (const ch of SIDE_CHUNKS) { if (ch.i * 14 > len / s) continue; const q = clamp((t - ch.ap) / 300); let a = 1, rot = 0, x = ch.x, y = dir < 0 ? -ch.i * 14 : (ch.i - 1) * 14;
    if (dead) { const qq = Math.max(0, td - ch.v.d); a = clamp(1 - (qq - .1) / 1.1); if (a <= 0) continue; x += ch.v.vx * qq * .5; y += ch.v.vy * qq + 300 * qq * qq; rot = qq * 1.2; } else { if (q <= 0) continue; y -= (1 - back(q)) * 24; a = clamp(q * 1.6); }
    sc.save(); sc.globalAlpha = a; sc.translate(x + 5, y + 7); sc.rotate(rot); sc.translate(-5, -7); sc.beginPath(); sc.rect(0, 0, 10, 14); sc.clip(); if (pedraPat) { sc.fillStyle = pedraPat; sc.fillRect(0, 0, 10, 14); } sc.fillStyle = 'rgba(0,0,0,.25)'; sc.fillRect(0, 0, 10, 14); sc.fillStyle = 'rgba(255,238,200,.28)'; sc.fillRect(0, 0, 10, 1.2); sc.fillStyle = 'rgba(0,0,0,.55)'; sc.fillRect(0, 12.4, 10, 1.6); sc.restore(); }
  const list = SPRITES.map((sp, i) => ({ sp, i })).sort((A, B) => ORDER[A.sp.kind] - ORDER[B.sp.kind]);
  for (const { sp, i } of list) {
    const o: { flip?: boolean; a?: number; dy?: number; rot?: number; rise?: number; crop?: boolean; w?: number } = { flip: sp.flip, crop: sp.crop, w: sp.w }; let dx = 0;
    if (!dead) { const pr = clamp((t - sp.ap) / (sp.kind === 'wall' ? 450 : 800)); if (pr <= 0) continue; o.rise = easeOut(pr); o.dy = (1 - easeOut(pr)) * 3; o.a = clamp(pr * 4); }
    else { const v = PIECES[i], q = Math.max(0, td - v.d - (sp.kind === 'tower' ? 0 : .05)), a = clamp(1 - (q - .1) / 1.1); if (a <= 0) continue; o.dy = 330 * q * q - 30 * q; o.rot = v.vr * q * (sp.kind === 'wall' ? 1 : .35) * (sp.flip ? -1 : 1); o.a = a; dx = v.vx * q * .5; }
    spr(sc, sp.n, sp.x + dx, (sp.yb ?? 0), sp.h, o);
  }
  if (!dead) for (const { sp } of list) dust(sc, sp.x, 1, (t - sp.ap - 200) / 1000, sp.kind === 'tower' ? 2.2 : 1.5);
  if (!dead) for (const sp of SPRITES) if (sp.tip) pennant(sc, sp.x, -sp.h + 3, now, easeOut(clamp((t - sp.ap - 1100) / 700)), sp.x);
  // o pé da muralha se mistura com a terra: escurece e suja só onde há pedra
  { sc.save(); sc.globalCompositeOperation = 'source-atop'; const gg = sc.createLinearGradient(0, -9, 0, 3); gg.addColorStop(0, 'rgba(30,20,10,0)'); gg.addColorStop(1, 'rgba(30,20,10,.5)'); sc.fillStyle = gg; sc.fillRect(0, -9, 390, 12); sc.restore(); }
  // ───────── luz ─────────
  sc.save(); sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-atop'; sc.fillStyle = 'rgba(14,16,30,.36)'; sc.fillRect(0, 0, BW, BH); sc.restore();
  lc.save(); lc.setTransform(1, 0, 0, 1, 0, 0); lc.drawImage(scn, 0, 0); lc.restore(); lc.globalCompositeOperation = 'source-in'; T(lc);
  const L = (x: number, y: number, r: number, rgb: string, a: number) => { const gr = lc.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(.5, `rgba(${rgb},${a * .45})`); gr.addColorStop(1, `rgba(${rgb},0)`); lc.fillStyle = gr; lc.fillRect(x - r, y - r, r * 2, r * 2); };
  const tl = dead ? 0 : clamp((t - 2600) / 500) * (anim ? .88 + .08 * Math.sin(now / 95) + .05 * Math.sin(now / 41) : .9);
  if (tl > 0) for (const [x, y] of TORCHES) L(x, y, 46, '255,160,70', .95 * tl);
  if (!dead) { const wl = clamp((t - 2000) / 700); if (wl > 0) for (const x of [22, 368]) L(x, -50, 30, '255,180,90', .55 * wl * (anim ? .9 + .1 * Math.sin(now / 130 + x) : .9)); }
  lc.globalCompositeOperation = 'source-over';
  // ───────── composição na tela ─────────
  mc.save(); mc.setTransform(1, 0, 0, 1, 0, 0); const dxp = Math.round(bx * RES), dyp = Math.round(top * RES);
  mc.drawImage(scn, dxp, dyp); mc.globalCompositeOperation = 'lighter'; mc.drawImage(lgt, dxp, dyp);
  mc.filter = `blur(${3 * RES}px)`; mc.globalAlpha = .45; mc.drawImage(lgt, dxp, dyp); mc.restore();
  // ───────── efeitos por cima, no mesmo espaço de projeto ─────────
  mc.save(); mc.setTransform(RES * s, 0, 0, RES * s, x0 * RES, base * RES);
  if (tl > 0) for (const [x, y] of TORCHES) torch(mc, x, y, now, x, tl * .85);
  { const q = clamp((t - 3000) / 1100); if (q > 0 && q < 1 && !dead) { mc.save(); mc.beginPath(); mc.rect(0, -84, 390, 88); mc.clip(); mc.globalCompositeOperation = 'lighter'; const x = -60 + q * (390 + 120), gr = mc.createLinearGradient(x - 50, 0, x + 50, 0); gr.addColorStop(0, 'rgba(255,240,200,0)'); gr.addColorStop(.5, `rgba(255,240,200,${.28 * Math.sin(q * Math.PI)})`); gr.addColorStop(1, 'rgba(255,240,200,0)'); mc.fillStyle = gr; mc.fillRect(x - 50, -84, 100, 88); mc.restore(); } }
  if (inst.hit != null && !dead) { const q = (now - inst.hit) / 1000; if (q >= 0 && q < 1) { mc.save(); mc.globalCompositeOperation = 'lighter'; for (const [a0, a1] of [[40, 165], [352, 227]]) { const x = a0 + (a1 - a0) * easeOut(q), a = .6 * Math.sin(q * Math.PI); const gr = mc.createRadialGradient(x, -16, 0, x, -16, 50); gr.addColorStop(0, `rgba(190,220,255,${a})`); gr.addColorStop(1, 'rgba(160,200,255,0)'); mc.fillStyle = gr; mc.fillRect(x - 50, -50, 100, 50); } mc.restore(); for (let i = 0; i < 7; i++) dust(mc, 52 + i * 48, -2, q * 1.1 - i * .03, 1); } }
  if (dead && te < 1700) for (let i = 0; i < 14; i++) { const q = te / 1700, xx = 12 + i * 27 + Math.sin(i * 5) * 8, a = .3 * Math.sin(clamp(q) * Math.PI) * (1 - q * .4); const gr = mc.createRadialGradient(xx, -10 - q * 24, 0, xx, -10 - q * 24, 20 + q * 14); gr.addColorStop(0, `rgba(170,156,132,${a})`); gr.addColorStop(1, 'rgba(170,156,132,0)'); mc.fillStyle = gr; mc.fillRect(xx - 36, -70, 72, 90); }
  mc.restore();
}

function redraw() { if (!cv || !mc) return; mc.setTransform(1, 0, 0, 1, 0, 0); mc.clearRect(0, 0, cv.width, cv.height); const now = performance.now(); for (const sd of ['player', 'npc'] as Side[]) { const i = insts[sd]; if (i) drawSide(i, now); } }
function frame(ts: number) {
  raf = 0; const anim = animated();
  if (anim && ts - last < 30) { raf = requestAnimationFrame(frame); return; } last = ts;
  redraw(); const now = performance.now();
  for (const sd of ['player', 'npc'] as Side[]) { const i = insts[sd]; if (i && i.end != null && now - i.end > 2600) insts[sd] = null; }
  if (insts.player || insts.npc) { if (anim || (insts.player?.end != null || insts.npc?.end != null) || (now - Math.max(insts.player?.t0 ?? 0, insts.npc?.t0 ?? 0) < 5200)) raf = requestAnimationFrame(frame); else stopLater(); }
  else shutdown();
}
const stopLater = () => { /* modo estático: a muralha já está de pé, nada mais a animar; o próximo redesenho vem do resize */ };
const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
const shutdown = () => { if (cv && mc) { mc.setTransform(1, 0, 0, 1, 0, 0); mc.clearRect(0, 0, cv.width, cv.height); } };

// Chamado pelo App sempre que os Terrenos em campo mudam. `instant` = a partida já começa com o Terreno em campo (sem animação de subida).
export function syncTerrainFx(next: Record<Side, TerrainFxKind | null>, instant = false) {
  wanted = next; ensureCanvas(); const now = performance.now(), anim = animated();
  for (const sd of ['player', 'npc'] as Side[]) {
    const cur = insts[sd], want = next[sd];
    if (want && (!cur || cur.end != null)) insts[sd] = { side: sd, kind: want, t0: instant || !anim ? now - 6000 : now, end: null, hit: null };
    else if (!want && cur && cur.end == null) { if (!anim) insts[sd] = null; else cur.end = now; }
  }
  if (insts.player || insts.npc) kick(); else shutdown();
}
export function clearTerrainFx() { insts.player = insts.npc = null; wanted = { player: null, npc: null }; if (raf) { cancelAnimationFrame(raf); raf = 0; } shutdown(); }
// O terreno protegeu de dano (a muralha brilha e solta poeira).
export function terrainHit(side: Side) { const i = insts[side]; if (i && i.end == null) { i.hit = performance.now(); kick(); } }
subscribeSettings(() => { if (insts.player || insts.npc) { syncTerrainFx(wanted, true); redraw(); } });
