// Efeitos de carta no canvas, com GSAP na coreografia (pedido do dono, rodada 26): carta que desce e assenta (fxLand), carta que leva o golpe (fxImpact)
// e carta que queima até sumir (fxBurn). Um canvas só (z 288), por cima de tudo, desenhado só enquanto há efeito; sem WebGL e sem trocar nada no tabuleiro.
// O GSAP só anima números (o "relógio" de cada efeito); o canvas lê esses números a cada quadro. Tamanhos são relativos à largura da carta.
// Ligado/desligado em Opções ("Efeitos de carta novos", getGameSettings().fxNovo); desligado, o jogo usa os efeitos antigos (PunchFx, BurningCard + folhas, fxLanding).
import gsap from 'gsap';

export type CardRect = { left: number; top: number; width: number; height: number };
type Part = { kind: 'spark' | 'chip' | 'dust' | 'ember' | 'ash'; x: number; y: number; vx: number; vy: number; g: number; drag: number; life: number; age: number; s: number; rgb: string; a: number; rot?: number; vr?: number };

// ── canvas e laço ────────────────────────────────────────────────────────────────────────────────────────────────────
let cv: HTMLCanvasElement | null = null, cx: CanvasRenderingContext2D, RES = 1, raf = 0, last = 0;
const parts: Part[] = [], items: { draw: (dt: number) => boolean }[] = [];
const ensure = () => {
  if (cv) return;
  cv = document.createElement('canvas'); cv.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100dvh;pointer-events:none;z-index:288'; document.body.appendChild(cv); cx = cv.getContext('2d')!;
  const size = () => { RES = Math.min(2, window.devicePixelRatio || 1); cv!.width = Math.round(window.innerWidth * RES); cv!.height = Math.round(window.innerHeight * RES); };
  size(); window.addEventListener('resize', size);
};
const kick = () => { ensure(); if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
function frame(ts: number) {
  raf = 0; const dt = Math.min(.05, Math.max(0, (ts - last) / 1000)); last = ts; if (!cv) return;
  cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cv.width, cv.height); cx.setTransform(RES, 0, 0, RES, 0, 0);
  for (let i = items.length - 1; i >= 0; i--) { cx.save(); const keep = items[i].draw(dt); cx.restore(); if (!keep) items.splice(i, 1); }
  stepParts(dt); drawParts();
  if (items.length || parts.length) raf = requestAnimationFrame(frame);
  else cx.clearRect(0, 0, cv.width, cv.height);
}
const R = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const add = (draw: (dt: number) => boolean) => { items.push({ draw }); kick(); };
// um efeito = um "relógio" animado pelo GSAP (k de 0 a 1) e uma função que desenha em função dele
function run(dur: number, ease: string, draw: (k: number) => void, onEnd?: () => void, delay = 0) {
  const st = { k: 0 }; let done = false;
  gsap.to(st, { k: 1, duration: dur, ease, delay, onComplete: () => { done = true; onEnd?.(); } });
  add(() => { if (done) return false; draw(st.k); return true; });
}

// ── partículas ───────────────────────────────────────────────────────────────────────────────────────────────────────
function emit(p: Partial<Part> & { kind: Part['kind']; x: number; y: number }) { if (parts.length > 700) return; parts.push({ vx: 0, vy: 0, g: 0, drag: .98, life: 1, age: 0, s: 2, rgb: '255,220,150', a: 1, ...p }); kick(); }
function stepParts(dt: number) {
  for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.age += dt; if (p.age >= p.life) { parts.splice(i, 1); continue; } const k = Math.pow(p.drag, dt * 60); p.vx *= k; p.vy *= k; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.vr) p.rot = (p.rot ?? 0) + p.vr * dt; }
}
function drawParts() {
  for (const p of parts) {
    const u = p.age / p.life, a = p.a * (1 - u);
    if (p.kind === 'spark') { cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = `rgba(${p.rgb},${a})`; cx.lineWidth = p.s * (1 - u * .5); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x - p.vx * .04, p.y - p.vy * .04); cx.stroke(); }
    else if (p.kind === 'ember') { const f = .65 + .35 * Math.sin(p.age * 20 + p.x); softGlow(p.x, p.y, p.s * 3, p.rgb, a * f * .5); cx.globalCompositeOperation = 'lighter'; cx.fillStyle = `rgba(255,235,170,${a * f})`; cx.beginPath(); cx.arc(p.x, p.y, p.s * .6, 0, 7); cx.fill(); }
    else if (p.kind === 'chip') { cx.globalCompositeOperation = 'source-over'; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot ?? 0); cx.fillStyle = `rgba(${p.rgb},${Math.min(1, a * 1.4)})`; cx.beginPath(); cx.moveTo(-p.s, -p.s * .5); cx.lineTo(p.s, -p.s * .3); cx.lineTo(p.s * .4, p.s * .6); cx.lineTo(-p.s * .7, p.s * .4); cx.closePath(); cx.fill(); cx.restore(); }
    else { cx.globalCompositeOperation = 'source-over'; const r = p.s * (1 + u * (p.kind === 'ash' ? .6 : 1.5)), g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); g.addColorStop(0, `rgba(${p.rgb},${a * (p.kind === 'ash' ? .5 : 1)})`); g.addColorStop(1, `rgba(${p.rgb},0)`); cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, r, 0, 7); cx.fill(); }
  }
  cx.globalCompositeOperation = 'source-over';
}
function softGlow(x: number, y: number, r: number, rgb: string, a: number) { if (a < .005) return; const g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); cx.globalCompositeOperation = 'lighter'; cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill(); }
const rr = (r: CardRect, pad = 0) => { const rad = r.width * .09 + pad; cx.beginPath(); cx.roundRect(r.left - pad, r.top - pad, r.width + pad * 2, r.height + pad * 2, rad); };
// ── contorno no formato EXATO da carta (regra do dono: nunca um retângulo de cantos arredondados) ───────────────────────────────────
// Lê o alfa da imagem da moldura da própria carta (a `img.inset-0` dentro dela), dilata cópias coloridas e tira o miolo: sobra um brilho só por fora.
const RINGS = new Map<string, { c: HTMLCanvasElement; pad: number; bw: number; bh: number }>();
const frameImgOf = (el: Element | null): HTMLImageElement | null => { if (!el) return null; let best: HTMLImageElement | null = null, area = 0; el.querySelectorAll<HTMLImageElement>('img').forEach(im => { if (!im.complete || !im.naturalWidth || !/inset-0/.test(im.className)) return; const r = im.getBoundingClientRect(), ar = r.width * r.height; if (ar > area) { area = ar; best = im; } }); return best; };
// silhueta MACIÇA da moldura: o que não é alcançável a partir de fora por pixels transparentes (as janelas de arte e de texto ficam preenchidas)
const SOLID = new Map<string, HTMLCanvasElement>();
function solidOf(img: HTMLImageElement): HTMLCanvasElement | null {
  const key = img.currentSrc || img.src, hit = SOLID.get(key); if (hit) return hit;
  const W = 96, H = Math.max(8, Math.round(W * img.naturalHeight / img.naturalWidth)), c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d', { willReadFrequently: true })!; g.drawImage(img, 0, 0, W, H);
  let im: ImageData; try { im = g.getImageData(0, 0, W, H); } catch { return null; }
  const d = im.data, out = new Uint8Array(W * H), q: number[] = [], push = (x: number, y: number) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const i = y * W + x; if (out[i] || d[i * 4 + 3] > 40) return; out[i] = 1; q.push(i); };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); } for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  for (let h = 0; h < q.length; h++) { const i = q[h], x = i % W, y = (i / W) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
  for (let i = 0; i < W * H; i++) { d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 255; d[i * 4 + 3] = out[i] ? 0 : 255; }
  g.putImageData(im, 0, 0); SOLID.set(key, c); return c;
}
function silRing(img: HTMLImageElement, pw: number, ph: number, rgb: string) {
  const key = `${img.currentSrc || img.src}|${Math.round(pw / 6)}|${rgb}`, hit = RINGS.get(key); if (hit) return hit;
  const pad = Math.ceil(pw * .16), c = document.createElement('canvas'); c.width = Math.round(pw + pad * 2); c.height = Math.round(ph + pad * 2); const g = c.getContext('2d')!;
  const t = document.createElement('canvas'); t.width = Math.round(pw); t.height = Math.round(ph); const tg = t.getContext('2d')!; tg.imageSmoothingEnabled = true; tg.drawImage(solidOf(img) ?? img, 0, 0, t.width, t.height); tg.globalCompositeOperation = 'source-in'; tg.fillStyle = `rgb(${rgb})`; tg.fillRect(0, 0, t.width, t.height);
  const sc = pw / 64; for (const [r, al] of [[1.2, 1], [2.6, .6], [4.6, .34], [7, .16]]) { g.globalAlpha = al; for (let k = 0; k < 20; k++) { const an = k / 20 * Math.PI * 2; g.drawImage(t, pad + Math.cos(an) * r * sc, pad + Math.sin(an) * r * sc); } }
  g.globalAlpha = 1; g.globalCompositeOperation = 'destination-out'; g.drawImage(t, pad, pad);
  const o = { c, pad, bw: pw, bh: ph }; RINGS.set(key, o); return o;
}
// desenha o contorno da moldura `img`, que hoje ocupa `r`, ampliado `grow` vezes em volta do centro
function drawSil(img: HTMLImageElement, r: CardRect, rgb: string, alpha: number, grow = 1) {
  if (alpha < .01) return; const ring = silRing(img, r.width, r.height, rgb), sx = r.width / ring.bw * grow, sy = r.height / ring.bh * grow, w = ring.c.width * sx, h = ring.c.height * sy, { x, y } = ctr(r);
  cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = Math.min(1, alpha); cx.drawImage(ring.c, x - w / 2, y - h / 2, w, h); cx.globalAlpha = 1;
}
let hintEl: HTMLElement | null = null;
// A carta que está pousando avisa qual elemento é ela (para o contorno do assentar seguir a moldura dela)
export const fxHintFrame = (el: HTMLElement | null) => { hintEl = el; };
const ctr = (r: CardRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

// ── 1. carta que desce e assenta ─────────────────────────────────────────────────────────────────────────────────────
// A carta toca o tabuleiro: clarão e três ondas que correm pelo CONTORNO (nunca uma caixa), poeira que sai dos lados e faíscas; carta de arte total (big) ganha mais.
export function fxLand(r: CardRect, big = false) {
  const s = r.width / 56, { x, y } = ctr(r), base = r.top + r.height;
  // o formato vem da moldura de uma carta que já está no tabuleiro (a da mão é retangular); ela ocupa 122% x 145,5% da casa, com o centro 5,8% mais baixo
  const fimg = frameImgOf(hintEl); hintEl = null; const fw = r.width * 1.22, fh = r.height * 1.455, fr: CardRect | null = fimg ? { left: x - fw / 2, top: y + r.height * .058 - fh / 2, width: fw, height: fh } : null;
  // fissuras no chão a partir das quinas de baixo e dos lados (curtas, escuras, com brilho laranja que apaga)
  const cracks = Array.from({ length: big ? 7 : 5 }, (_, i) => { const sx = x + (i / (big ? 6 : 4) - .5) * r.width * 1.1, pts: [number, number][] = [[sx, base - r.height * .06]]; let a = Math.PI / 2 + R(-.7, .7) + (i - 2) * .12, px = sx, py = pts[0][1]; for (let j = 0; j < 3; j++) { a += R(-.5, .5); const l = R(.1, .2) * r.width * (big ? 1.3 : 1); px += Math.cos(a) * l; py += Math.sin(a) * l * .6; pts.push([px, py]); } return pts; });
  run(.7, 'power2.out', k => {
    cx.globalCompositeOperation = 'lighter';
    // clarão branco-quente no toque
    softGlow(x, y, r.width * (1.05 + .9 * k), '255,240,200', (1 - clamp(k / .35)) ** 2 * (big ? 1 : .8));
    // ondas que crescem a partir da própria moldura (formato exato da carta)
    for (let i = 0; i < 3; i++) { const kk = clamp((k - i * .08) / .7); if (kk <= 0) continue; if (fimg && fr) drawSil(fimg, fr, big ? '255,214,120' : '255,236,190', (1 - kk) * (big ? 1 : .85), 1 + (.05 + .36 * kk + i * .03)); }
    // onda de poeira/energia rente ao chão (elipse achatada, sem linha dura)
    const kr = clamp(k / .75); const g = cx.createRadialGradient(x, base - 2 * s, r.width * .2 * kr, x, base - 2 * s, r.width * (.5 + 1.7 * kr)); g.addColorStop(0, 'rgba(255,230,170,0)'); g.addColorStop(.75, `rgba(255,220,150,${(1 - kr) * (big ? .62 : .46)})`); g.addColorStop(1, 'rgba(255,220,150,0)'); cx.save(); cx.translate(x, base - 2 * s); cx.scale(1, .32); cx.translate(-x, -(base - 2 * s)); cx.fillStyle = g; cx.beginPath(); cx.arc(x, base - 2 * s, r.width * (.5 + 1.7 * kr), 0, 7); cx.fill(); cx.restore();
    // rachaduras no chão
    const ac = (1 - clamp((k - .1) / .9)) * clamp(k / .1); cx.lineCap = 'round'; cx.lineJoin = 'round';
    for (const c of cracks) { cx.beginPath(); c.forEach(([px, py], i) => i ? cx.lineTo(px, py) : cx.moveTo(px, py)); cx.strokeStyle = `rgba(255,130,50,${ac * .8})`; cx.lineWidth = 2.6 * s; cx.stroke(); cx.strokeStyle = `rgba(255,236,180,${ac})`; cx.lineWidth = 1 * s; cx.stroke(); }
  });
  // poeira em anel que sai rasteira para os lados + nuvem que sobe
  for (let i = 0; i < (big ? 30 : 22); i++) { const a = i / (big ? 30 : 22) * 6.283 + R(-.15, .15), v = R(110, 230) * s; emit({ kind: 'dust', x: x + Math.cos(a) * r.width * .3, y: base - r.height * .05, vx: Math.cos(a) * v, vy: Math.sin(a) * v * .3 - R(0, 12) * s, drag: .95, life: R(.5, .95), s: R(12, 24) * s, rgb: '150,126,92', a: .65 }); }
  for (let i = 0; i < (big ? 26 : 18); i++) { const a = R(-Math.PI * .98, -Math.PI * .02), v = R(150, 430) * s; emit({ kind: 'spark', x: x + R(-.45, .45) * r.width, y: base - r.height * R(0, .15), vx: Math.cos(a) * v * 1.3, vy: Math.sin(a) * v, g: 620 * s, drag: .965, life: R(.3, .62), s: R(1.4, 2.4) * s, rgb: Math.random() < .4 ? '255,250,225' : (big ? '255,206,110' : '255,226,160') }); }
  for (let i = 0; i < (big ? 12 : 8); i++) { const side = i % 2 ? 1 : -1, v = R(90, 280) * s; emit({ kind: 'chip', x: x + side * r.width * R(.2, .5), y: base - r.height * .05, vx: side * v * .7, vy: -R(120, 260) * s, g: 900 * s, drag: .985, life: R(.55, .9), s: R(2.2, 4.4) * s, rgb: Math.random() < .5 ? '170,128,70' : '82,58,40', rot: R(0, 6), vr: R(-14, 14) }); }
}

// ── 2. carta que leva o golpe ────────────────────────────────────────────────────────────────────────────────────────
// dir: +1 = o golpe vem de cima (a carta é empurrada para baixo), -1 = de baixo.
export function fxImpact(r: CardRect, heavy = false, dir = 1) {
  const s = r.width / 56 * (heavy ? 1.25 : 1), { x, y } = ctr(r);
  const rays = Array.from({ length: heavy ? 14 : 10 }, (_, i) => ({ a: i / (heavy ? 14 : 10) * 6.283 + R(-.2, .2), len: R(.55, 1.15), w: R(.05, .11) }));
  const cracks = Array.from({ length: heavy ? 6 : 5 }, () => { const a = R(0, 6.283); const pts: [number, number][] = [[0, 0]]; let px = 0, py = 0, aa = a; for (let i = 0; i < 4; i++) { aa += R(-.6, .6); const l = R(.12, .22) * r.width; px += Math.cos(aa) * l; py += Math.sin(aa) * l; pts.push([px, py]); } return pts; });
  run(.62, 'power2.out', k => {
    cx.globalCompositeOperation = 'lighter';
    const a1 = (1 - clamp(k / .55)) ** 1.6;
    softGlow(x, y, r.width * (.6 + .9 * k), '255,230,170', a1 * .9); softGlow(x, y, r.width * .35, '255,255,255', (1 - clamp(k / .25)) * 1);
    const pop = 1 - Math.pow(1 - clamp(k / .3), 3);
    for (const ry of rays) { const L = r.width * ry.len * (.35 + 1.0 * pop) * (heavy ? 1.2 : 1), w = ry.w * L; const g = cx.createLinearGradient(x, y, x + Math.cos(ry.a) * L, y + Math.sin(ry.a) * L); g.addColorStop(0, `rgba(255,250,225,${a1})`); g.addColorStop(1, 'rgba(255,170,60,0)'); cx.fillStyle = g; cx.beginPath(); cx.moveTo(x - Math.sin(ry.a) * w, y + Math.cos(ry.a) * w); cx.lineTo(x + Math.cos(ry.a) * L, y + Math.sin(ry.a) * L); cx.lineTo(x + Math.sin(ry.a) * w, y - Math.cos(ry.a) * w); cx.closePath(); cx.fill(); }
    const kr = clamp(k / .8); cx.strokeStyle = `rgba(255,215,140,${(1 - kr) * .85})`; cx.lineWidth = (5 - 3 * kr) * s; cx.beginPath(); cx.ellipse(x, y, r.width * (.2 + 1.0 * kr), r.width * (.2 + 1.0 * kr) * .62, 0, 0, 7); cx.stroke();
    // rachaduras que brilham dentro da carta e depois apagam
    cx.save(); rr(r); cx.clip(); cx.lineCap = 'round'; cx.lineJoin = 'round';
    const ac = (1 - clamp((k - .15) / .85)) * clamp(k / .12);
    for (const c of cracks) { cx.beginPath(); c.forEach(([px, py], i) => i ? cx.lineTo(x + px, y + py) : cx.moveTo(x + px, y + py)); cx.strokeStyle = `rgba(255,120,40,${ac * .9})`; cx.lineWidth = 2.4 * s; cx.stroke(); cx.strokeStyle = `rgba(255,235,170,${ac})`; cx.lineWidth = 1 * s; cx.stroke(); }
    cx.restore();
  });
  // faíscas em leque para o lado oposto ao do atacante, lascas, poeira
  const base = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
  for (let i = 0; i < (heavy ? 42 : 24); i++) { const a = base + R(-1.35, 1.35), v = R(110, 460) * s; emit({ kind: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 760 * s, drag: .965, life: R(.3, .7), s: R(1.3, 2.6) * s, rgb: Math.random() < .35 ? '255,250,225' : '255,196,90' }); }
  for (let i = 0; i < (heavy ? 12 : 7); i++) { const a = base + R(-1.8, 1.8), v = R(70, 260) * s; emit({ kind: 'chip', x: x + R(-.3, .3) * r.width, y: y + R(-.3, .3) * r.height, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60 * s, g: 900 * s, drag: .98, life: R(.55, .95), s: R(2.4, 5) * s, rgb: Math.random() < .5 ? '196,150,70' : '92,60,40', rot: R(0, 6), vr: R(-14, 14) }); }
  for (let i = 0; i < (heavy ? 9 : 5); i++) emit({ kind: 'dust', x: x + R(-.45, .45) * r.width, y: y + R(-.1, .45) * r.height, vx: R(-40, 40) * s, vy: R(-30, 6) * s, drag: .955, life: R(.5, .9), s: R(8, 15) * s, rgb: '130,108,80', a: .5 });
}

// ── 3. carta que queima ─────────────────────────────────────────────────────────────────────────────────────────────
// A carta de verdade (HTML) é "comida" por uma máscara de ruído, de baixo para o alto, a partir do ponto onde a pancada pegou; o canvas põe por cima
// a borda incandescente, o carvão, brasas, fumaça, a luz que ilumina o entorno e, no fim, a marca chamuscada no chão. A máscara é gerada aqui
// (nenhuma imagem): a mesma função F decide o que queimou na máscara do HTML e na borda do canvas, então as duas coincidem.
const BN = 40, BCOLS = 8, BROWS = 5, BW = 64, BH = 88, T0 = -.12, T1 = 1.1;
export const BURN = { frames: BN, cols: BCOLS, rows: BROWS, thr0: T0, thr1: T1 };
const noise = (() => { let sd = 9; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647; const octs = [[8, .5], [16, .3], [32, .2]], grids = octs.map(([n]) => Array.from({ length: n * n }, rnd)), f = new Float32Array(64 * 64), sm = (t: number) => t * t * (3 - 2 * t);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { let v = 0; octs.forEach(([n, a], k) => { const fx = x / 64 * n, fy = y / 64 * n, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0, G = (i: number, j: number) => grids[k][(j % n) * n + (i % n)]; v += ((G(x0, y0) * (1 - sm(tx)) + G(x0 + 1, y0) * sm(tx)) * (1 - sm(ty)) + (G(x0, y0 + 1) * (1 - sm(tx)) + G(x0 + 1, y0 + 1) * sm(tx)) * sm(ty)) * a; }); f[y * 64 + x] = v; }
  return f; })();
const nz = (u: number, v: number) => { const x = ((u * 64) % 64 + 64) % 64, y = ((v * 64) % 64 + 64) % 64, x0 = Math.floor(x), y0 = Math.floor(y), tx = x - x0, ty = y - y0, G = (i: number, j: number) => noise[(j % 64) * 64 + (i % 64)]; return (G(x0, y0) * (1 - tx) + G(x0 + 1, y0) * tx) * (1 - ty) + (G(x0, y0 + 1) * (1 - tx) + G(x0 + 1, y0 + 1) * tx) * ty; };
// F pequeno = queima primeiro. Origem: embaixo, no meio da carta.
const F = (u: number, v: number) => nz(u * 2, v * 2.2) * .4 + Math.min(1.1, Math.hypot((u - .5) * .9, (v - .88)) / 1.0) * .6;
let maskUrl = '';
// folha de máscaras (opaco = a carta ainda existe), gerada uma vez
export function burnMaskSheet(): string {
  if (maskUrl) return maskUrl;
  const c = document.createElement('canvas'); c.width = BW * BCOLS; c.height = BH * BROWS; const g = c.getContext('2d')!; const im = g.createImageData(c.width, c.height);
  for (let i = 0; i < BN; i++) { const thr = T0 + (T1 - T0) * i / (BN - 1), ox = (i % BCOLS) * BW, oy = Math.floor(i / BCOLS) * BH;
    for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) { const f = F(x / BW, y / BH), a = clamp((f - thr) / .025); const o = ((oy + y) * c.width + ox + x) * 4; im.data[o] = im.data[o + 1] = im.data[o + 2] = 255; im.data[o + 3] = Math.round(a * 255); } }
  g.putImageData(im, 0, 0); maskUrl = c.toDataURL('image/png'); return maskUrl;
}
const mkLayer = () => { const c = document.createElement('canvas'); c.width = BW; c.height = BH; return { c, g: c.getContext('2d')!, im: null as ImageData | null }; };
// Começa a queimar a carta que está em `r`. `onThr(i)` recebe o quadro da máscara (0..BN-1) a cada passo; `onEnd` quando acabou.
export function fxBurn(r: CardRect, onThr: (frame: number) => void, onEnd?: () => void) {
  const s = r.width / 56, { x, y } = ctr(r), hot = mkLayer(), char = mkLayer();
  hot.im = hot.g.createImageData(BW, BH); char.im = char.g.createImageData(BW, BH);
  const st = { thr: T0, heat: 0 }; let done = false, light = 1;
  gsap.to(st, { heat: 1, duration: .25, ease: 'power2.out' });
  gsap.to(st, { thr: T1, duration: 1.15, ease: 'power1.in', onComplete: () => { done = true; light = 0; onEnd?.(); scorch(); } });
  const lt = { v: 1 }; gsap.to(lt, { v: 0, duration: 1.2, delay: .9, onUpdate: () => { light = lt.v; } });
  const scorch = () => run(2.4, 'power1.inOut', k => {
    cx.globalCompositeOperation = 'source-over'; const a = Math.sin(Math.min(1, k * 1.3) * Math.PI * .5) * (1 - clamp((k - .5) / .5)) * .55;
    const g = cx.createRadialGradient(x, y + r.height * .12, 2, x, y + r.height * .12, r.width * .75); g.addColorStop(0, `rgba(10,5,3,${a})`); g.addColorStop(1, 'rgba(10,5,3,0)'); cx.fillStyle = g; cx.save(); cx.translate(x, y + r.height * .12); cx.scale(1, 1.15); cx.translate(-x, -(y + r.height * .12)); cx.beginPath(); cx.arc(x, y + r.height * .12, r.width * .75, 0, 7); cx.fill(); cx.restore();
    softGlow(x, y + r.height * .1, r.width * .5, '255,80,20', (1 - k) * (1 - k) * .28);
  });
  add(dt => {
    if (done) return false;
    const thr = st.thr; onThr(clamp(Math.round((thr - T0) / (T1 - T0) * (BN - 1)), 0, BN - 1));
    // borda incandescente e carvão, calculadas pixel a pixel numa imagem pequena e esticadas (a suavidade do esticar vira brilho)
    const hd = hot.im!.data, cd = char.im!.data; hd.fill(0); cd.fill(0);
    for (let py = 0; py < BH; py++) for (let px = 0; px < BW; px++) { const d = F(px / BW, py / BH) - thr, o = (py * BW + px) * 4; if (d < 0) continue;
      if (d < .09) { const t = d / .09; hd[o] = 255; hd[o + 1] = Math.round(80 + 170 * (1 - t)); hd[o + 2] = Math.round(10 + 130 * (1 - t) ** 2); hd[o + 3] = Math.round(255 * (1 - t * .7)); }
      else if (d < .26) { const t = (d - .09) / .17; cd[o] = 14; cd[o + 1] = 7; cd[o + 2] = 3; cd[o + 3] = Math.round(200 * (1 - t) ** 1.4); } }
    hot.g.putImageData(hot.im!, 0, 0); char.g.putImageData(char.im!, 0, 0);
    cx.save(); rr(r, 1); cx.clip(); cx.imageSmoothingEnabled = true;
    cx.globalCompositeOperation = 'source-over'; cx.drawImage(char.c, r.left, r.top, r.width, r.height);
    cx.globalCompositeOperation = 'lighter'; cx.drawImage(hot.c, r.left, r.top, r.width, r.height); cx.globalAlpha = .55; cx.drawImage(hot.c, r.left - r.width * .05, r.top - r.height * .05, r.width * 1.1, r.height * 1.1);
    cx.restore();
    // luz do fogo sobre o entorno e sobre a própria carta
    softGlow(x, y, r.width * 1.9, '255,120,40', .34 * st.heat * light * (.85 + .15 * Math.sin(performance.now() / 55)));
    // brasas e fumaça nascem na frente da queima (sorteio dentro da carta até achar um ponto na faixa quente)
    for (let n = dt * 300; n > 0; n -= 1) { if (Math.random() > n) continue; for (let k = 0; k < 8; k++) { const u = Math.random(), v = Math.random(), d = F(u, v) - thr; if (d > 0 && d < .08) { const px = r.left + u * r.width, py = r.top + v * r.height;
      emit({ kind: 'ember', x: px, y: py, vx: R(-18, 18) * s, vy: -R(30, 110) * s, drag: .985, life: R(.6, 1.5), s: R(1.2, 2.6) * s, rgb: Math.random() < .5 ? '255,140,40' : '255,200,90' });
      if (Math.random() < .3) emit({ kind: 'dust', x: px, y: py, vx: R(-14, 14) * s, vy: -R(24, 60) * s, drag: .985, life: R(.9, 1.8), s: R(7, 13) * s, rgb: Math.random() < .5 ? '52,44,38' : '84,74,64', a: .5 });
      if (Math.random() < .08) emit({ kind: 'ash', x: px, y: py, vx: R(-10, 10) * s, vy: -R(14, 40) * s, drag: .99, life: R(1.4, 2.4), s: R(2, 4) * s, rgb: '40,34,30', a: .8 });
      break; } } }
    return true;
  });
}

// ── 4. investida do ataque ────────────────────────────────────────────────────────────────────────────────────────────
// A carta que ataca (era um vaivém do framer-motion): recua para pegar embalo (luz dourada se juntando, faíscas sendo sugadas), treme de tensão e
// dispara com um rastro de luz e linhas de velocidade. Move a carta pelas propriedades CSS soltas (translate / rotate / scale), que se somam ao
// `transform` do framer-motion sem brigar com ele (o framer segue cuidando do impacto: escala 1,32, tremor). O tempo total é o de sempre (ms).
export function fxLunge(el: HTMLElement, attackY: number, ms: number, windFrac: number, windPx: number, tiltDeg: number) {
  const dir = Math.sign(attackY) || -1, st = { y: 0, rot: 0, sc: 1, sx: 1, sy: 1, charge: 0, speed: 0 };
  const apply = () => { el.style.translate = `0 ${st.y}px`; el.style.rotate = `${st.rot}deg`; el.style.scale = `${st.sc * st.sx} ${st.sc * st.sy}`; };
  const w = ms / 1000 * windFrac, sdur = ms / 1000 - w;
  const tl = gsap.timeline({ onUpdate: apply });
  tl.to(st, { y: -dir * windPx, rot: -dir * tiltDeg * .5, sc: 1.07, charge: 1, duration: w, ease: 'power2.out' }, 0);
  tl.to(st, { rot: `+=${dir * 1.6}`, duration: .035, repeat: 3, yoyo: true, ease: 'sine.inOut' }, w * .55);                       // tremor de tensão
  tl.to(st, { y: attackY, rot: dir * tiltDeg, sc: 1.2, sx: .96, sy: 1.08, charge: 0, speed: 1, duration: sdur, ease: 'power3.in' }, w);
  let trail: { x: number; y: number }[] = [], dead = false, wasEnd = false; const fimg = frameImgOf(el);
  const rect = () => el.getBoundingClientRect();
  add(dt => {
    if (dead) return false; const r = rect(), c = ctr({ left: r.left, top: r.top, width: r.width, height: r.height }), s = r.width / 56;
    if (st.charge > .02) { softGlow(c.x, c.y, r.width * (.8 + .5 * st.charge), '255,205,110', .22 * st.charge); if (fimg) { const fr = fimg.getBoundingClientRect(); drawSil(fimg, { left: fr.left, top: fr.top, width: fr.width, height: fr.height }, '255,224,150', .85 * st.charge, 1 + .03 * st.charge); }
      if (Math.random() < dt * 40 * st.charge) { const a = R(0, 6.283), d = R(.7, 1.2) * r.width; emit({ kind: 'ember', x: c.x + Math.cos(a) * d, y: c.y + Math.sin(a) * d, vx: -Math.cos(a) * d * 2.6, vy: -Math.sin(a) * d * 2.6, drag: .9, life: .28, s: 1.4 * s, rgb: '255,210,120' }); } }
    if (st.speed > 0) {
      trail.push(c); if (trail.length > 7) trail.shift();
      for (let i = 1; i < trail.length; i++) { const a = i / trail.length; cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = `rgba(255,236,190,${a * .5})`; cx.lineWidth = r.width * .55 * a; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(trail[i - 1].x, trail[i - 1].y); cx.lineTo(trail[i].x, trail[i].y); cx.stroke(); }
      for (let i = 0; i < 4; i++) { const ox = (i - 1.5) * r.width * .3, L = R(40, 90) * s; cx.strokeStyle = `rgba(255,246,220,${R(.25, .5)})`; cx.lineWidth = 1.4 * s; cx.beginPath(); cx.moveTo(c.x + ox, c.y - dir * r.height * .45); cx.lineTo(c.x + ox, c.y - dir * (r.height * .45 + L)); cx.stroke(); }
    }
    if (tl.progress() >= 1 && !wasEnd) { wasEnd = true; trail = []; }
    return !(wasEnd && st.speed >= 1 && dead);
  });
  return {
    impact() { gsap.to(st, { sc: 1, sx: 1, sy: 1, speed: 0, duration: .06, onUpdate: apply }); },
    settle() { dead = true; tl.kill(); gsap.to(st, { y: 0, rot: 0, sc: 1, sx: 1, sy: 1, charge: 0, speed: 0, duration: .28, ease: 'power2.out', onUpdate: apply, onComplete: () => { el.style.translate = ''; el.style.rotate = ''; el.style.scale = ''; } }); },
  };
}

// ── 5. carta que vem da mão ─────────────────────────────────────────────────────────────────────────────────────────────
// Acompanha o voo da carta (el) até a casa (alvo): a sombra na casa cresce e endurece conforme ela desce (dá a noção de altura) e, na queda,
// linhas de velocidade acima da carta. t em segundos desde o começo do voo: sobe até pairar (hover), paira, cai (de tFall a tHit).
export function fxDrop(el: HTMLElement, target: { cx: number; cy: number; w: number; h: number }, tFall: number, tHit: number) {
  const st = { t: 0 }; let done = false;
  gsap.to(st, { t: tHit + .05, duration: tHit + .05, ease: 'none', onComplete: () => { done = true; } });
  const T = { left: target.cx - target.w / 2, top: target.cy - target.h / 2, width: target.w, height: target.h };
  add(() => {
    if (done) return false; const k = clamp((st.t - .15) / (tHit - .15)), fall = clamp((st.t - tFall) / (tHit - tFall)), s = target.w / 56;
    // sombra: grande, fraca e borrada no alto; do tamanho da casa e escura quando a carta toca
    const grow = (1 - k) * .55, a = (.12 + .5 * k * k) * 1;
    cx.globalCompositeOperation = 'source-over'; cx.save(); const g = cx.createRadialGradient(target.cx, target.cy + target.h * .04, 0, target.cx, target.cy + target.h * .04, target.w * (.75 + grow)); g.addColorStop(0, `rgba(8,4,2,${a})`); g.addColorStop(.7, `rgba(8,4,2,${a * .6})`); g.addColorStop(1, 'rgba(8,4,2,0)'); cx.fillStyle = g; cx.scale(1, 1.25); cx.beginPath(); cx.arc(target.cx, (target.cy + target.h * .04) / 1.25, target.w * (.75 + grow), 0, 7); cx.fill(); cx.restore();
    if (fall > 0 && fall < 1) { const r = el.getBoundingClientRect(); for (let i = 0; i < 5; i++) { const ox = (i - 2) * r.width * .22, L = R(30, 80) * s * fall; cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = `rgba(255,240,200,${R(.2, .45) * fall})`; cx.lineWidth = 1.4 * s; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(r.left + r.width / 2 + ox, r.top - 2); cx.lineTo(r.left + r.width / 2 + ox, r.top - 2 - L); cx.stroke(); } }
    void T; return true;
  });
}

// ── 6. setas de ataque ────────────────────────────────────────────────────────────────────────────────────────────────
// Substituem as setas antigas (uma imagem voando em linha reta de centro a centro, por cima das cartas). Agora: uma curva (arco) que sai da BORDA da carta
// que ataca e termina antes da borda do alvo, com fita que engrossa até a ponta, brilho, pontinhos correndo e um pulso de luz; a ponta segue a tangente.
// Vermelho: o jogador atacando; azul: o adversário. 'pick' = alvos possíveis enquanto escolhe; 'hit' = o ataque que está acontecendo (mais grosso).
export type ArrowSpec = { x1: number; y1: number; x2: number; y2: number; w1: number; h1: number; w2: number; h2: number; kind: 'pick' | 'hit'; mine: boolean };
let arrows: ArrowSpec[] = [], arrowItem = false; const ast = { a: 0, t: 0 };
const exitT = (dx: number, dy: number, w: number, h: number) => Math.min(Math.abs(dx) > 1e-6 ? (w / 2) / Math.abs(dx) : 1e9, Math.abs(dy) > 1e-6 ? (h / 2) / Math.abs(dy) : 1e9);
// Uma seta "viaja": nasce na borda da carta que ataca, corre até a mira do alvo e some ao tocá-lo; recomeça. O corpo tem rabo afilado e ondula de leve (S), a ponta é
// grande, com contorno escuro grosso, degradê e faixa de brilho (visual de jogo, plano). O ciclo dura PERIOD s: 80% de viagem, o resto some.
const PERIOD = 1.15;
function drawArrow(s: ArrowSpec, idx: number, a: number) {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, dist = Math.hypot(dx, dy); if (dist < 4) return; const ux = dx / dist, uy = dy / dist, k = s.w2 / 56;
  const t1 = exitT(ux, uy, s.w1, s.h1) - 2 * k, t2 = s.w2 * .36;
  const p0 = { x: s.x1 + ux * t1, y: s.y1 + uy * t1 }, p1 = { x: s.x2 - ux * t2, y: s.y2 - uy * t2 }, len = Math.hypot(p1.x - p0.x, p1.y - p0.y); if (len < 10) return;
  // arco conforme o ângulo (alvo à direita curva para a direita; em frente, reto) + ondulação em S, para a seta nunca ficar dura
  let px = -uy, py = ux; if (px * ux < 0) { px = -px; py = -py; }
  const bulge = Math.min(len * .3, 60 * k) * Math.min(1, Math.abs(ux) * 1.4), c = { x: (p0.x + p1.x) / 2 + px * bulge, y: (p0.y + p1.y) / 2 + py * bulge }, amp = Math.min(9 * k, len * .1);
  const pos = (u: number) => { const q = { x: (1 - u) * (1 - u) * p0.x + 2 * (1 - u) * u * c.x + u * u * p1.x, y: (1 - u) * (1 - u) * p0.y + 2 * (1 - u) * u * c.y + u * u * p1.y }, tx = 2 * (1 - u) * (c.x - p0.x) + 2 * u * (p1.x - c.x), ty = 2 * (1 - u) * (c.y - p0.y) + 2 * u * (p1.y - c.y), l = Math.hypot(tx, ty) || 1, w = amp * Math.sin(u * Math.PI * 2.2 + ast.t * 3.2 + idx) * Math.sin(Math.min(1, u * 5) * Math.PI / 2); return { x: q.x - ty / l * w, y: q.y + tx / l * w }; };
  const dirAt = (u: number) => { const e = .01, q0 = pos(Math.max(0, u - e)), q1 = pos(Math.min(1, u + e)), l = Math.hypot(q1.x - q0.x, q1.y - q0.y) || 1; return { x: (q1.x - q0.x) / l, y: (q1.y - q0.y) / l }; };
  // fase do ciclo: a ponta corre de 0 a 1 em 80% do tempo (acelera no meio), depois a seta some; o corpo mede ~55% do caminho
  const ph = ((ast.t + idx * .13) % PERIOD) / PERIOD, run = clamp(ph / .8), uH = Math.pow(run, .85) * (3 - 2 * run) * .5 + run * .5;
  const fade = Math.min(1, ph / .06) * (ph < .8 ? 1 : Math.max(0, 1 - (ph - .8) / .2)); const al = a * fade; if (al < .01) return;
  const head = 24 * k, headU = Math.min(.45, head / len), body = Math.max(.34, .55), uTail = Math.max(0, uH - body), uShaft = Math.max(uTail, uH - headU);
  const rgb = s.mine ? '255,76,44' : '60,140,255', rgbTail = s.mine ? '255,170,70' : '120,200,255', dark = s.mine ? '78,6,10' : '8,28,84', hwMax = 5.6 * k, hwH = 14 * k;
  const N = 24, L: { x: number; y: number }[] = [], Rt: { x: number; y: number }[] = [];
  for (let i = 0; i <= N; i++) { const u = uTail + (uShaft - uTail) * i / N, q = pos(u), d = dirAt(u), sp = uShaft > uTail ? i / N : 1, hw = hwMax * Math.pow(Math.min(1, sp / .55), .8) + .5 * k; L.push({ x: q.x - d.y * hw, y: q.y + d.x * hw }); Rt.push({ x: q.x + d.y * hw, y: q.y - d.x * hw }); }
  const hb = pos(uShaft), hd = dirAt(uH), tip = pos(uH);
  const poly = () => { cx.beginPath(); L.forEach((q, i) => i ? cx.lineTo(q.x, q.y) : cx.moveTo(q.x, q.y)); cx.lineTo(hb.x - hd.y * hwH, hb.y + hd.x * hwH); cx.lineTo(tip.x, tip.y); cx.lineTo(hb.x + hd.y * hwH, hb.y - hd.x * hwH); for (let i = N; i >= 0; i--) cx.lineTo(Rt[i].x, Rt[i].y); cx.closePath(); };
  cx.lineCap = 'round'; cx.lineJoin = 'round';
  // halo suave
  cx.globalCompositeOperation = 'lighter'; cx.beginPath(); for (let i = 0; i <= 20; i++) { const q = pos(uTail + (uH - uTail) * i / 20); i ? cx.lineTo(q.x, q.y) : cx.moveTo(q.x, q.y); } cx.strokeStyle = `rgba(${rgb},${.2 * al})`; cx.lineWidth = hwMax * 2 + 12 * k; cx.stroke();
  cx.globalCompositeOperation = 'source-over';
  // contorno escuro grosso, degradê do rabo (claro) para a ponta (cor cheia), faixa de brilho
  poly(); cx.strokeStyle = `rgba(${dark},${.95 * al})`; cx.lineWidth = 3.6 * k; cx.stroke();
  const g = cx.createLinearGradient(pos(uTail).x, pos(uTail).y, tip.x, tip.y); g.addColorStop(0, `rgba(${rgbTail},${al})`); g.addColorStop(.5, `rgba(${rgb},${al})`); g.addColorStop(1, `rgba(${rgb},${al})`);
  poly(); cx.fillStyle = g; cx.fill();
  cx.globalCompositeOperation = 'lighter'; cx.beginPath(); for (let i = 0; i <= 20; i++) { const u = uTail + (uShaft - uTail) * i / 20, q = pos(u), d = dirAt(u); const o = hwMax * .4 * (i / 20); i ? cx.lineTo(q.x - d.y * o, q.y + d.x * o) : cx.moveTo(q.x - d.y * o, q.y + d.x * o); } cx.strokeStyle = `rgba(255,255,255,${.55 * al})`; cx.lineWidth = 1.8 * k; cx.stroke();
  cx.beginPath(); cx.moveTo(hb.x - hd.y * hwH * .55, hb.y + hd.x * hwH * .55); cx.lineTo(tip.x - hd.x * 3 * k, tip.y - hd.y * 3 * k); cx.strokeStyle = `rgba(255,255,255,${.5 * al})`; cx.lineWidth = 1.8 * k; cx.stroke();
  // faísca no toque
  if (ph > .72 && ph < .92) softGlow(tip.x, tip.y, 16 * k, rgbTail, .5 * al);
}
// Define as setas do momento (lista vazia some com elas). Pode ser chamada a cada quadro do jogo: só liga o laço quando há seta.
export function fxArrows(list: ArrowSpec[]) {
  arrows = list;
  if (list.length) {
    gsap.to(ast, { a: 1, duration: .18, overwrite: true });
    if (!arrowItem) { arrowItem = true; add(dt => { ast.t += dt; if (!arrows.length && ast.a <= .01) { arrowItem = false; return false; } arrows.forEach((s, i) => { cx.save(); drawArrow(s, i, ast.a); cx.restore(); }); return true; }); }
  } else gsap.to(ast, { a: 0, duration: .14, overwrite: true });
}
