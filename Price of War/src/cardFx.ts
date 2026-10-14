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
const ctr = (r: CardRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

// ── 1. carta que desce e assenta ─────────────────────────────────────────────────────────────────────────────────────
// A carta toca o tabuleiro: clarão e três ondas que correm pelo CONTORNO (nunca uma caixa), poeira que sai dos lados e faíscas; carta de arte total (big) ganha mais.
export function fxLand(r: CardRect, big = false) {
  const s = r.width / 56, { x, y } = ctr(r), base = r.top + r.height;
  // fissuras no chão a partir das quinas de baixo e dos lados (curtas, escuras, com brilho laranja que apaga)
  const cracks = Array.from({ length: big ? 7 : 5 }, (_, i) => { const sx = x + (i / (big ? 6 : 4) - .5) * r.width * 1.1, pts: [number, number][] = [[sx, base - r.height * .06]]; let a = Math.PI / 2 + R(-.7, .7) + (i - 2) * .12, px = sx, py = pts[0][1]; for (let j = 0; j < 3; j++) { a += R(-.5, .5); const l = R(.1, .2) * r.width * (big ? 1.3 : 1); px += Math.cos(a) * l; py += Math.sin(a) * l * .6; pts.push([px, py]); } return pts; });
  run(.7, 'power2.out', k => {
    cx.globalCompositeOperation = 'lighter';
    // clarão branco-quente no toque
    softGlow(x, y, r.width * (1.05 + .9 * k), '255,240,200', (1 - clamp(k / .35)) ** 2 * (big ? 1 : .8));
    for (let i = 0; i < 3; i++) { const kk = clamp((k - i * .08) / .7); if (kk <= 0) continue; const pad = r.width * (.02 + .32 * kk + i * .03); cx.strokeStyle = `rgba(${big ? '255,214,120' : '255,236,190'},${(1 - kk) * (big ? .95 : .75)})`; cx.lineWidth = (5.5 - i * 1.3) * s * (1 - kk * .5); rr(r, pad); cx.stroke(); }
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
  let trail: { x: number; y: number }[] = [], dead = false, wasEnd = false;
  const rect = () => el.getBoundingClientRect();
  add(dt => {
    if (dead) return false; const r = rect(), c = ctr({ left: r.left, top: r.top, width: r.width, height: r.height }), s = r.width / 56;
    if (st.charge > .02) { softGlow(c.x, c.y, r.width * (.8 + .5 * st.charge), '255,205,110', .32 * st.charge); rr({ left: r.left, top: r.top, width: r.width, height: r.height }, 1 + 3 * st.charge); cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = `rgba(255,224,150,${.55 * st.charge})`; cx.lineWidth = 2 * s; cx.stroke();
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
