// Efeitos do deck de Campo no jogo (mockup aprovado: public/mockups/efeitos-campo/, receita em docs/animacoes.md "Efeitos do Campo").
// Tudo desenhado por código, sem imagens. Dois canvas: o de BAIXO (z 30, como o terrainFx) guarda os efeitos que ficam em campo
// (forja acesa, torres do sinal, geada, noite) e o de CIMA (z 285, como o combatFx) toca os efeitos de uma vez só.
// As coordenadas são "de projeto" (carta = 64 de largura): posição na tela / U, onde U = largura de uma casa / 64.
import { getCardDef } from './engine/catalog';
import { getGameSettings } from './gameSettings';
import type { GameState } from './engine/types';

type Side = 'player' | 'npc';
interface Env { pop: (side: Side, slot: number, kind: 'atk-up' | 'hp-up' | 'swap', text: string) => void; handPoint: (side: Side) => { cx: number; cy: number; w: number; h: number } }

// ── canvas e linha do tempo ─────────────────────────────────────────────────────────────────────────────────────────
const cvs: HTMLCanvasElement[] = [], cxs: CanvasRenderingContext2D[] = [];
let ctx: CanvasRenderingContext2D, RES = 2, U = 1, now = 0, last = 0, raf = 0, ready = false;
const fxs: any[] = [], sched: any[] = [], P: any[] = [];
const ensure = () => {
  if (ready) return; ready = true;
  [30, 285].forEach(z => { const c = document.createElement('canvas'); c.style.cssText = `position:fixed;left:0;top:0;width:100vw;height:100dvh;pointer-events:none;z-index:${z}`; document.body.appendChild(c); cvs.push(c); cxs.push(c.getContext('2d')!); });
  ctx = cxs[0]; resize(); window.addEventListener('resize', resize);
};
const resize = () => { RES = Math.min(2.5, window.devicePixelRatio || 1); cvs.forEach(c => { c.width = Math.round(window.innerWidth * RES); c.height = Math.round(window.innerHeight * RES); }); };
const R = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3), eio = (u: number) => { u = clamp(u); return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const at = (d: number, fn: () => void) => { sched.push({ t: now + d, fn }); kick(); };
const add = (o: any) => { o.t0 = now; o.dur = o.dur ?? 1; o.lay = o.lay ?? 1; fxs.push(o); kick(); return o; };
const wait = (sec: number) => new Promise<void>(r => at(sec, r));

// ── geometria (lida do DOM, acompanha qualquer tamanho de celular) ───────────────────────────────────────────────────
const rc = (side: Side, slot: number) => { const el = document.getElementById(`${side}-${slot}`); if (!el) return null; const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2) / U, y: (r.top + r.height / 2) / U, w: r.width / U, h: r.height / U }; };
const setU = () => { const el = document.getElementById('player-2'); if (el) { const w = el.getBoundingClientRect().width; if (w > 0) U = w / 64; } };
const dirOf = (s: Side) => (s === 'player' ? -1 : 1);                       // para onde o fogo sobe: o jogador de baixo para cima, o adversário de cima para baixo
const edgeY = (s: Side) => { const r = rc(s, 2); return r ? r.y + dirOf(s) * r.h / 2 : 0; };   // borda da fileira da frente voltada para o meio
const cols = (s: Side) => [0, 1, 2, 3, 4].map(i => rc(s, i)?.x ?? 0);
const midY = () => { const a = rc('npc', 2), b = rc('player', 2); return a && b ? (a.y + b.y) / 2 : 300; };

// ── partículas ───────────────────────────────────────────────────────────────────────────────────────────────────────
const spawn = (o: any) => { o.age = 0; o.lay = o.lay ?? 1; P.push(o); kick(); return o; };
function glow(x: number, y: number, r: number, rgb: string, a: number, mode = 'lighter') { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.globalCompositeOperation = mode as GlobalCompositeOperation; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
function drawP(p: any) {
  const u = clamp(p.age / p.life);
  if (p.kind === 'flame') {
    const k = 1 - u * .55, h = p.s * 2.4 * k, w = p.s * .62 * (1 - u * .45), a = (1 - u) * p.a, sw = Math.sin(p.age * 13 + p.x * .3) * w * .4;
    ctx.save(); ctx.translate(p.x, p.y); if (p.dir > 0) ctx.scale(1, -1); ctx.globalCompositeOperation = 'lighter';
    const blob = (cy: number, rx: number, ry: number, rgb: string, al: number) => { ctx.save(); ctx.translate(sw * (1 - cy / h), -cy); ctx.scale(rx / ry, 1); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry); g.addColorStop(0, `rgba(${rgb},${al})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, ry, 0, 7); ctx.fill(); ctx.restore(); };
    blob(h * .28, w * 1.3, h * .5, u < .5 ? '255,120,35' : '200,55,20', a * .55); blob(h * .42, w, h * .42, '255,170,60', a * .6); blob(h * .26, w * .55, h * .3, '255,235,160', a * .75);
    ctx.restore();
  } else if (p.kind === 'ember') { const f = .6 + .4 * Math.sin(p.age * 18 + p.ph); glow(p.x, p.y, p.s * 2.6, '255,150,50', (1 - u) * f * .55); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,225,150,${(1 - u) * f})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * .55, 0, 7); ctx.fill(); }
  else if (p.kind === 'spark') { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${p.rgb || '255,230,160'},${1 - u})`; ctx.lineWidth = p.s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * .035, p.y - p.vy * .035); ctx.stroke(); }
  else if (p.kind === 'smoke' || p.kind === 'dust') { ctx.globalCompositeOperation = 'source-over'; const r = p.s * (1 + u * (p.kind === 'smoke' ? 1.8 : 1.4)); const rgb = p.rgb || (p.kind === 'smoke' ? '70,62,56' : '120,96,66'); const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); g.addColorStop(0, `rgba(${rgb},${(1 - u) * p.a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill(); }
  else if (p.kind === 'snow') { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(225,242,255,${(1 - Math.abs(u * 2 - 1)) * p.a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 7); ctx.fill(); }
  else if (p.kind === 'leaf') { ctx.globalCompositeOperation = 'source-over'; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot + p.age * p.vr); ctx.globalAlpha = 1 - u * u; ctx.fillStyle = p.col; ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .45, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(20,50,10,.6)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-p.s, 0); ctx.lineTo(p.s, 0); ctx.stroke(); ctx.restore(); }
  else if (p.kind === 'glint') { const a = Math.sin(u * Math.PI); ctx.globalCompositeOperation = 'lighter'; ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = `rgba(${p.rgb || '255,255,255'},${a})`; const L = p.s * (.5 + a * .8), w = p.s * .12; ctx.beginPath(); ctx.moveTo(0, -L); ctx.lineTo(w, -w); ctx.lineTo(L, 0); ctx.lineTo(w, w); ctx.lineTo(0, L); ctx.lineTo(-w, w); ctx.lineTo(-L, 0); ctx.lineTo(-w, -w); ctx.closePath(); ctx.fill(); ctx.restore(); }
  else if (p.kind === 'ring') { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${p.rgb},${(1 - u) * p.a})`; ctx.lineWidth = p.s * (1 - u * .6); const r = p.r0 + (p.r1 - p.r0) * eo(u); ctx.beginPath(); ctx.ellipse(p.x, p.y, r, r * (p.sq || .5), 0, 0, 7); ctx.stroke(); }
}
function stepP(dt: number) {
  for (const p of P) { p.age += dt; if (p.vx !== undefined) { p.x += p.vx * dt; p.y += p.vy * dt; } if (p.g) p.vy += p.g * dt; if (p.drag) { const k = Math.pow(p.drag, dt * 60); p.vx *= k; p.vy *= k; } if (p.sway) p.x += Math.sin(p.age * 3 + p.ph) * p.sway * dt; }
  for (let i = P.length - 1; i >= 0; i--) if (P[i].age >= P[i].life) P.splice(i, 1);
}
const flame = (x: number, y: number, s = 14, o: any = {}) => spawn(Object.assign({ kind: 'flame', x, y, vx: R(-8, 8), vy: R(-50, -90), s, a: .9, life: R(.5, .9), drag: .99, dir: -1 }, o));
const ember = (x: number, y: number, o: any = {}) => spawn(Object.assign({ kind: 'ember', x, y, vx: R(-14, 14), vy: R(-40, -90), s: R(1.4, 2.6), life: R(1.2, 2.4), ph: R(0, 6), sway: R(10, 24) }, o));
const fan = (x: number, y: number, n: number, a0: number, a1: number, sp: number, o: any = {}) => { for (let i = 0; i < n; i++) { const a = R(a0, a1), v = R(sp * .4, sp); spawn(Object.assign({ kind: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 300, s: R(1, 2), life: R(.35, .7), drag: .985 }, o)); } };
const ring = (x: number, y: number, r0: number, r1: number, rgb: string, s = 4, a = .9, life = .6, sq = .5, lay = 1) => spawn({ kind: 'ring', x, y, r0, r1, rgb, s, a, life, sq, lay });
const dust = (x: number, y: number, n: number, o: any = {}) => { for (let i = 0; i < n; i++) spawn(Object.assign({ kind: 'dust', x: x + R(-14, 14), y: y + R(-5, 5), vx: R(-40, 40), vy: R(-18, -4), s: R(8, 16), a: .5, life: R(.6, 1), drag: .97 }, o)); };
const glints = (x: number, y: number, n: number, rgb: string, spread = 30, s = 9) => { for (let k = 0; k < n; k++) spawn({ kind: 'glint', x: x + R(-spread, spread), y: y + R(-spread * 1.4, spread * 1.4), s, life: .5, rgb }); };

// ── camadas que ficam em campo ───────────────────────────────────────────────────────────────────────────────────────
// uma por lado e por tipo; a sincronização (syncCampoLayers) liga e desliga conforme o estado da partida
interface Layer { kind: 'forja' | 'fogo' | 'arsenal'; side: Side; mode: string | null; I: number; tgt: number; age: number; armed: number[]; lit: [number, number]; ignite: boolean; end: number | null }
const layers: Layer[] = [];
let night = { v: 0, tgt: 0 }, stars: { x: number; y: number; r: number; ph: number }[] = [];
const animated = () => getGameSettings().terrainFx;

function tower(x: number, yb: number, flip: number) {
  ctx.globalCompositeOperation = 'source-over'; const w = 26, h = 62; ctx.save(); ctx.translate(x, yb); ctx.scale(1, flip);
  ctx.fillStyle = '#2c2825'; ctx.strokeStyle = '#0c0a08'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2 + 3, -h); ctx.lineTo(w / 2 - 3, -h); ctx.lineTo(w / 2, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a3531'; for (let i = 0; i < 3; i++) ctx.fillRect(-w / 2 + 1 + i * 8, -h - 6, 7, 7);
  ctx.fillStyle = '#1b1713'; ctx.fillRect(-3, -40, 6, 12);
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; for (let r = 1; r < 6; r++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 2, -r * 10); ctx.lineTo(w / 2 - 2, -r * 10); ctx.stroke(); }
  ctx.restore();
}
const armedOf = (s: GameState, seat: 0 | 1) => s.players[seat].board.flatMap((c, i) => (c && i < 10 && (c as any).equippedWeapons?.length ? [i] : []));

function layerTick(L: Layer, dt: number) {
  L.age += dt; const target = L.end != null ? 0 : L.tgt; L.I += (target - L.I) * Math.min(1, dt * 1.7);
  const I = L.I, d = dirOf(L.side), cs = cols(L.side), ey = edgeY(L.side); if (!cs[0]) return;
  if (L.kind === 'forja') {
    for (const i of L.armed) { const r = rc(L.side, i); if (r && Math.random() < dt * 26 * I) flame(r.x + R(-26, 26), r.y + d * r.h / 2 - d * 2, R(10, 16) * (.7 + I * .5), { vy: d * R(34, 70) * (.7 + I), a: .55 * Math.min(1, I) + .15, life: R(.45, .9), dir: d, lay: 0 }); if (r && Math.random() < dt * 8 * I) ember(r.x + R(-26, 26), r.y + d * r.h / 2, { vy: d * R(50, 110), lay: 0 }); }
    if (Math.random() < dt * 30 * I) flame(cs[(Math.random() * 5) | 0] + R(-30, 30), ey, R(10, 16), { vy: d * R(40, 80), a: .45, life: R(.4, .8), dir: d, lay: 0 });
    const t = rc(L.side, 11); if (t && Math.random() < dt * 30 * I) flame(t.x + R(-22, 22), t.y + d * t.h / 2 * .8, R(8, 13), { vy: d * R(36, 70), a: .7, dir: d, lay: 0 });
  } else if (L.kind === 'fogo') {
    for (let k = 0; k < 2; k++) { const lit = L.lit[k]; if (lit <= 0) continue; const x = k ? cs[4] + 39 : cs[0] - 39, f2 = rc(L.side, 2), yb = f2 ? f2.y + f2.h / 2 : ey;
      if (Math.random() < dt * 45 * lit) flame(x + R(-5, 5), yb - 70, R(9, 15), { vy: -R(50, 95), a: .9, dir: -1, lay: 0 }); if (Math.random() < dt * 8 * lit) spawn({ kind: 'smoke', x: x + R(-4, 4), y: yb - 90, vx: R(6, 22) * (k ? -1 : 1), vy: R(-30, -50), s: R(10, 16), a: .3, life: R(1.6, 2.4), lay: 0 }); if (Math.random() < dt * 12 * lit) ember(x + R(-5, 5), yb - 72, { lay: 0 }); }
  } else if (L.kind === 'arsenal') {
    if (Math.random() < dt * 5 * I && L.armed.length) { const i = L.armed[(Math.random() * L.armed.length) | 0], r = rc(L.side, i); if (r) spawn({ kind: 'glint', x: r.x + R(-30, 30), y: r.y + R(-44, 44), s: R(6, 10), life: .7, rgb: '215,240,255', lay: 0 }); }
  }
}
// desenha uma camada (ctx = canvas de baixo)
function layerDraw(L: Layer) {
  const I = L.I, d = dirOf(L.side), cs = cols(L.side), ey = edgeY(L.side); if (!cs[0] || I < .02) return; const t = L.age;
  if (L.kind === 'forja') {
    for (const i of L.armed) { const r = rc(L.side, i); if (!r) continue;
      glow(r.x, r.y, 78, '255,130,40', (.3 * Math.min(1, I) + .05 * Math.sin(t * 9 + r.x)));
      if (L.mode === 'muralha') { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,170,90,${.2 * Math.min(1, I) + .08 * Math.sin(t * 3 + r.x)})`; ctx.lineWidth = 2.6; ctx.beginPath(); (ctx as any).roundRect(r.x - r.w / 2 - 2, r.y - r.h / 2 - 2, r.w + 4, r.h + 4, 8); ctx.stroke(); }
      else if (L.mode === 'afiacao') { const ph = (t * .9 + r.x * .013) % 1, sx = r.x - 28 + ph * 56, sy = r.y + 40 - ph * 80; glow(sx, sy, 14, '255,250,210', .4 * Math.min(1, I)); ctx.strokeStyle = `rgba(255,248,200,${.5 * Math.min(1, I)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx - 8, sy + 8); ctx.lineTo(sx + 8, sy - 8); ctx.stroke(); } }
    const tr = rc(L.side, 11); if (tr) glow(tr.x, tr.y, 70, '255,140,50', .3 * Math.min(1, I));
    const g = ctx.createLinearGradient(0, ey, 0, ey + d * 40); g.addColorStop(0, `rgba(255,150,50,${.24 * Math.min(1, I)})`); g.addColorStop(1, 'rgba(255,120,30,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, Math.min(ey, ey + d * 40), window.innerWidth / U, 40);
  } else if (L.kind === 'fogo') {
    const f2 = rc(L.side, 2), yb = f2 ? f2.y + f2.h / 2 : ey;
    for (let k = 0; k < 2; k++) { const x = k ? cs[4] + 39 : cs[0] - 39; tower(x, yb, 1); if (L.lit[k] > 0) glow(x, yb - 70, 56 + 7 * Math.sin(t * 11), '255,150,50', .42 * L.lit[k]); }
  } else if (L.kind === 'arsenal') {
    const mid = (rc(L.side, 2)?.y ?? 0) + d * 0 , h = rc(L.side, 2)?.h ?? 71;
    const g = ctx.createLinearGradient(0, ey - h * 1.2, 0, ey + h * 1.8); g.addColorStop(0, 'rgba(160,210,255,0)'); g.addColorStop(.5, `rgba(170,215,255,${.14 * I + .03 * Math.sin(t * 2)})`); g.addColorStop(1, 'rgba(160,210,255,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, ey - h * 1.2, window.innerWidth / U, h * 3); void mid;
    for (const i of L.armed) { const r = rc(L.side, i); if (!r) continue; ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(190,232,255,${.3 * I + .1 * Math.sin(t * 2 + r.x)})`; ctx.lineWidth = 2; ctx.beginPath(); (ctx as any).roundRect(r.x - r.w / 2 - 1, r.y - r.h / 2 - 1, r.w + 2, r.h + 2, 7); ctx.stroke();
      for (let k = 0; k < 6; k++) { const side = k % 4, o = ((k * 53 + i * 17) % 100) / 100 * 1.6 - .8, hw = r.w / 2, hh = r.h / 2; let bx: number, by: number, dx = 0, dy = 0; if (side === 0) { bx = r.x + o * hw * .9; by = r.y - hh; dy = -1; } else if (side === 1) { bx = r.x - hw; by = r.y + o * hh * .9; dx = -1; } else if (side === 2) { bx = r.x + hw; by = r.y + o * hh * .9; dx = 1; } else { bx = r.x + o * hw * .9; by = r.y + hh; dy = 1; }
        const len = (6 + (k * 7 % 9)) * clamp(I * 1.1) * (.9 + .1 * Math.sin(t * 2 + k)), w = (2.6 + (k % 3)) * clamp(I * 1.1), nx = -dy, ny = dx; const gr = ctx.createLinearGradient(bx, by, bx + dx * len, by + dy * len); gr.addColorStop(0, 'rgba(210,240,255,.8)'); gr.addColorStop(1, 'rgba(120,190,255,.2)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(bx - nx * w, by - ny * w); ctx.lineTo(bx + dx * len, by + dy * len); ctx.lineTo(bx + nx * w, by + ny * w); ctx.closePath(); ctx.fill(); } }
  }
}
function nightTick(dt: number) {
  night.v += (night.tgt - night.v) * Math.min(1, dt * 2.2); if (night.tgt === 0 && night.v < .01) night.v = 0;
  if (!stars.length) stars = Array.from({ length: 46 }, () => ({ x: R(6, 384), y: R(6, 360), r: R(.6, 1.5), ph: R(0, 6) }));
}
function nightDraw() {
  const a = night.v; if (a < .01) return; const W = window.innerWidth / U, H = window.innerHeight / U;
  const g = ctx.createRadialGradient(W / 2, H * .45, H * .1, W / 2, H * .45, H * .75); g.addColorStop(0, `rgba(14,22,60,${.34 * a})`); g.addColorStop(1, `rgba(5,8,30,${.62 * a})`); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter'; for (const s of stars) { const f = (.5 + .5 * Math.sin(last / 330 + s.ph)) * a; ctx.fillStyle = `rgba(210,225,255,${f * .9})`; ctx.beginPath(); ctx.arc(s.x * W / 390, s.y * H / 640, s.r, 0, 7); ctx.fill(); }
  const mx = W - 62, my = 68; glow(mx, my, 70, '170,190,255', .26 * a); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = a; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(mx + 11, my - 6, 15, 0, 7); ctx.clip('evenodd'); ctx.fillStyle = '#e8eeff'; ctx.beginPath(); ctx.arc(mx, my, 17, 0, 7); ctx.fill(); ctx.restore(); ctx.globalAlpha = 1;
}

// ── laço ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
let inFrame = false;
const busy = () => fxs.length || sched.length || P.length || layers.length || night.v > 0 || night.tgt > 0;
function frame(ts: number) {
  raf = 0; inFrame = true; try { step(ts); } finally { inFrame = false; }
  if (busy()) raf = requestAnimationFrame(frame); else cxs.forEach((c, i) => c.clearRect(0, 0, cvs[i].width, cvs[i].height));
}
function step(ts: number) {
  const dt = Math.min(.05, Math.max(0, (ts - last) / 1000)); last = ts; if (!ready) return;
  const onlyPersist = !fxs.length && !sched.length;
  if (onlyPersist && !getGameSettings().terrainFx && !layers.some(l => l.end != null)) { clearAll(); return; }
  setU(); now += dt;
  for (let i = sched.length - 1; i >= 0; i--) if (sched[i].t <= now) { const s = sched.splice(i, 1)[0]; s.fn(); }
  for (const L of layers) { if (L.ignite) { if (L.age > .25 && L.lit[0] === 0) L.lit[0] = 1; if (L.age > 2.35 && L.lit[1] === 0) L.lit[1] = 1; } layerTick(L, dt); }
  for (let i = layers.length - 1; i >= 0; i--) if (layers[i].end != null && layers[i].I < .02) layers.splice(i, 1);
  nightTick(dt); stepP(dt);
  cxs.forEach((c, i) => { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cvs[i].width, cvs[i].height); c.setTransform(RES * U, 0, 0, RES * U, 0, 0); });
  ctx = cxs[0]; nightDraw(); for (const L of layers) { ctx.save(); layerDraw(L); ctx.restore(); }
  for (const lay of [0, 1]) { ctx = cxs[lay]; for (const p of P) if (p.lay === lay) { ctx.save(); drawP(p); ctx.restore(); } }
  for (let i = 0; i < fxs.length; i++) { const f = fxs[i], p = (now - f.t0) / f.dur; if (p >= 1) { f.end && f.end(); fxs.splice(i, 1); i--; continue; } ctx = cxs[f.lay]; ctx.save(); f.draw && f.draw(p, now - f.t0); ctx.restore(); f.tick && f.tick(p, now - f.t0, dt); }
  cxs.forEach(c => { c.globalCompositeOperation = 'source-over'; });
}
function kick() { if (!ready) ensure(); if (inFrame) return; if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
function clearAll() { layers.length = 0; night = { v: 0, tgt: 0 }; fxs.length = 0; sched.length = 0; P.length = 0; if (raf) { cancelAnimationFrame(raf); raf = 0; } cxs.forEach((c, i) => c.clearRect(0, 0, cvs[i].width, cvs[i].height)); }
export const clearCampoLayers = () => { if (ready) clearAll(); };

// ── sincronização com o estado da partida ──────────────────────────────────────────────────────────────────────────────
// Chamado a cada atualização da tela. `instant`: a partida já começa com o Terreno em campo (sem ignição animada).
export function syncCampoLayers(s: GameState, instant = false) {
  const wantKinds: Record<string, { fx: string; slot: number }[]> = {};
  ([0, 1] as const).forEach(seat => {
    const side: Side = seat === 0 ? 'player' : 'npc', b = s.players[seat].board, armed = armedOf(s, seat);
    const want: { kind: Layer['kind']; mode: string | null }[] = [];
    const t = b[11] ? getCardDef(b[11]!.name)?.fx : null, r = b[10] ? getCardDef(b[10]!.name)?.fx : null;
    if (t === 'forja') want.push({ kind: 'forja', mode: (b[11] as any).mode ?? null });
    if (t === 'fogo') want.push({ kind: 'fogo', mode: (b[11] as any).mode ?? null });
    if (r === 'arsenal') want.push({ kind: 'arsenal', mode: null });
    for (const w of want) {
      let L = layers.find(l => l.side === side && l.kind === w.kind && l.end == null);
      if (!L) { ensure(); const anim = animated() && !instant; L = { kind: w.kind, side, mode: w.mode, I: anim ? 0 : .6, tgt: .6, age: anim ? 0 : 10, armed, lit: anim && w.kind === 'fogo' ? [0, 0] : [1, 1], ignite: anim && w.kind === 'fogo', end: null }; layers.push(L); }
      L.mode = w.mode; L.armed = armed;
    }
    for (const L of layers) if (L.side === side && L.end == null && !want.some(w => w.kind === L.kind)) L.end = now;
  });
  void wantKinds;
  night.tgt = s.turn.bonusRepositions > 0 ? 1 : 0;
  if (layers.length || night.tgt || night.v) { ensure(); kick(); }
}

// ── efeitos de uma vez só (canvas de cima) ──────────────────────────────────────────────────────────────────────────────
const clang = (x: number, y: number, big: boolean) => { ring(x, y, 6, big ? 70 : 46, '255,210,140', 4, .9, .5, .6); add({ dur: .3, draw: (p: number) => glow(x, y, big ? 70 : 46, '255,200,120', .9 * (1 - p)) }); fan(x, y, big ? 34 : 22, -2.9, -.2, big ? 330 : 240, { rgb: '255,236,170' }); fan(x, y, big ? 20 : 12, -3.1, 0, 160, { rgb: '255,160,60' }); };
const prep = () => { ensure(); setU(); };

// A Forja que Nunca Apaga entra em campo: três marteladas e uma onda de fogo pelo chão
export async function fxForjaPlaced(side: Side): Promise<void> {
  prep(); const T = rc(side, 11) ?? rc(side, 10); if (!T) return; const d = dirOf(side), ey = edgeY(side), cs = cols(side);
  [.1, .5, .9].forEach((t, i) => at(t, () => { clang(T.x, T.y + 6, i === 2); if (i === 0) dust(T.x, T.y + T.h / 2, 6); }));
  at(.15, () => add({ dur: 1.3, draw: (p: number) => glow(lerp(T.x, T.x + (cs[4] - T.x) * 1.1, p), ey + d * -4, 60, '255,150,50', .5 * (1 - p)),
    tick: (p: number) => { const x = lerp(T.x, T.x + (cs[4] - T.x) * 1.1, p); for (let i = 0; i < 2; i++) flame(x + R(-10, 10), ey, R(12, 20), { vy: d * R(70, 130), dir: d }); if (Math.random() < .5) spawn({ kind: 'spark', x, y: ey, vx: R(-30, 60), vy: d * R(90, 200), g: -d * 300, s: 1.6, life: .6, rgb: '255,220,150' }); } }));
  await wait(1.6);
}
// Modo da Forja escolhido: aro (Muralha) ou lâmina de luz (Afiação) em cada Armada
export async function fxForjaModo(env: Env, side: Side, mode: string, armed: number[]): Promise<void> {
  prep(); armed.forEach((slot, i) => at(i * .09, () => { const r = rc(side, slot); if (!r) return;
    if (mode === 'muralha') { ring(r.x, r.y + 6, 10, 56, '255,170,90', 4, .8, .55, .7); dust(r.x, r.y + r.h / 2 - 4, 3, { rgb: '140,120,100', a: .4 }); glints(r.x, r.y, 6, '255,200,140'); env.pop(side, slot, 'hp-up', '+2'); }
    else { fan(r.x, r.y, 14, -2.6, -.5, 260, { rgb: '255,250,210' }); add({ dur: .4, draw: (p: number) => glow(r.x, r.y, 46, '255,248,210', .45 * (1 - p)) }); glints(r.x, r.y, 4, '255,255,235', 30, 11); env.pop(side, slot, 'atk-up', '+2'); } }));
  await wait(.9 + armed.length * .09);
}
// Posto do Fogo-Sinal entra: a bola de fogo atravessa o campo de ponta a ponta
export async function fxFogoPlaced(side: Side): Promise<void> {
  prep(); const cs = cols(side), f2 = rc(side, 2); if (!cs[0] || !f2) return; const xa = cs[0] - 39, xb = cs[4] + 39, ty = f2.y + f2.h / 2 - 70;
  const burst = (x: number, y: number) => { add({ dur: .5, draw: (p: number) => glow(x, y, 80, '255,200,100', .8 * (1 - p)) }); for (let i = 0; i < 24; i++) flame(x + R(-8, 8), y + R(-6, 8), R(10, 18), { vy: -R(90, 170), vx: R(-30, 30), life: R(.5, 1) }); fan(x, y, 20, -2.6, -.5, 260, { rgb: '255,210,130' }); };
  at(.25, () => burst(xa, ty));
  at(.8, () => add({ dur: 1.5, draw: (p: number) => { const x = lerp(xa, xb, eio(p)), y = ty + 20 - Math.sin(p * Math.PI) * 12; glow(x, y, 34, '255,200,90', .9); glow(x, y, 16, '255,255,210', .8); },
    tick: (p: number) => { const x = lerp(xa, xb, eio(p)), y = ty + 20 - Math.sin(p * Math.PI) * 12; flame(x, y + 2, 11, { vx: R(-10, 10), vy: R(-14, 10), life: .5 }); ember(x + R(-4, 4), y, { vy: R(-10, 20), life: 1.4 }); } }));
  at(2.35, () => { burst(xb, ty); ring(xb, ty + 20, 6, 60, '255,190,100', 4, .8, .6); });
  await wait(2.9);
}
// Modo Trincheira: barrancos de terra sobem à frente das Armadas
export async function fxFogoTrincheira(side: Side, armed: number[]): Promise<void> {
  prep(); const cs = cols(side), ey = edgeY(side), d = dirOf(side); if (!cs[0]) return;
  add({ dur: 1.4, draw: (p: number) => { const u = eo(p / .55), a = p > .8 ? 1 - (p - .8) / .2 : 1; ctx.globalAlpha = a; ctx.globalCompositeOperation = 'source-over';
    for (const x of cs) { const h = 16 * u, yb = ey + d * 6; ctx.save(); ctx.translate(x, yb); ctx.scale(1, -d); const g = ctx.createLinearGradient(0, -h, 0, 10); g.addColorStop(0, '#6e5538'); g.addColorStop(1, '#2d2318'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-37, 8); ctx.quadraticCurveTo(-20, -h * 1.6, 0, -h); ctx.quadraticCurveTo(20, -h * 1.6, 37, 8); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(10,6,2,.7)'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore(); } } });
  cs.forEach((x, i) => at(i * .06, () => dust(x, ey + d * 6, 3, { rgb: '120,96,66', a: .5 })));
  armed.forEach((slot, i) => at(.5 + i * .08, () => { const r = rc(side, slot); if (r) ring(r.x, r.y, 12, 52, '255,214,150', 3, .7, .5, .8); }));
  await wait(1.5);
}
// Modo Saque (Posto do Fogo-Sinal): a unidade que caiu vira brasa e uma carta voa para a mão
export async function fxFogoSaque(env: Env, side: Side, victim: { side: Side; slot: number }): Promise<void> {
  prep(); const v = rc(victim.side, victim.slot), hp = env.handPoint(side); if (!v) return; const hx = hp.cx / U, hy = hp.cy / U;
  add({ dur: .9, draw: (p: number) => glow(v.x, v.y, 80 * (1 - p * .4), '255,120,40', .5 * (1 - p)) });
  fan(v.x, v.y, 40, -3.1, .1, 300, { rgb: '255,200,110' }); fan(v.x, v.y, 20, 0, 3.2, 150, { rgb: '255,120,40' }); dust(v.x, v.y, 6, { rgb: '70,60,50', a: .5 });
  for (let i = 0; i < 24; i++) at(.1 + i * .02, () => ember(v.x + R(-18, 18), v.y + R(-20, 20), { vy: R(-30, 10), vx: R(-20, 20), life: 1.1 }));
  at(.4, () => add({ dur: .85, draw: (p: number) => { const u = eio(p), x = lerp(v.x, hx, u), y = lerp(v.y, hy, u); glow(x, y, 36, '255,160,60', .6 * (1 - p * .5)); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#5a1f1a'; ctx.strokeStyle = '#d9b45a'; ctx.lineWidth = 2; const w = 22 + 12 * u, h = 31 + 17 * u; ctx.beginPath(); (ctx as any).roundRect(x - w / 2, y - h / 2, w, h, 4); ctx.fill(); ctx.stroke(); },
    tick: (p: number) => { const u = eio(p); ember(lerp(v.x, hx, u) + R(-8, 8), lerp(v.y, hy, u) + R(-8, 8), { vx: R(-10, 10), vy: R(-10, 10), life: .6 }); } }));
  await wait(1.4);
}
// Noite Sem Parar jogada: a noite cai (a camada de noite fica enquanto houver movimento extra) e a unidade deixa rastro de tocha ao correr
export async function fxNoitePlay(): Promise<void> { prep(); night.tgt = 1; kick(); await wait(.9); }
export async function fxNoiteTrail(side: Side, from: number, to: number): Promise<void> {
  prep(); const a = rc(side, from), b = rc(side, to); if (!a || !b) return;
  add({ dur: .6, draw: (p: number) => { const e = eio(p), x = lerp(a.x, b.x, e), y = lerp(a.y, b.y, e); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let k = 1; k <= 14; k++) { const q = Math.max(0, e - k * .035), q2 = Math.max(0, e - (k - 1) * .035), t = 1 - k / 14; ctx.strokeStyle = `rgba(255,${120 + 90 * t | 0},50,${.5 * t})`; ctx.lineWidth = 4 + 22 * t; ctx.beginPath(); ctx.moveTo(lerp(a.x, b.x, q), lerp(a.y, b.y, q)); ctx.lineTo(lerp(a.x, b.x, q2), lerp(a.y, b.y, q2)); ctx.stroke(); ctx.strokeStyle = `rgba(255,240,190,${.6 * t})`; ctx.lineWidth = 2 + 6 * t; ctx.stroke(); }
      glow(x, y, 40, '255,150,60', .4 * Math.sin(p * Math.PI)); },
    tick: (p: number) => { const e = eio(p), x = lerp(a.x, b.x, e), y = lerp(a.y, b.y, e); dust(x, y + 30, 1, { rgb: '90,100,130', a: .4 }); ember(x + R(-6, 6), y + R(-8, 20), { vy: R(-20, 10), life: .9 }); } });
  await wait(.7);
}
// A Mata Devolve: galhos e folhas estouram em volta da unidade Armada atacada
function branch(x: number, y: number, ang: number, len: number, w: number, d: number) {
  const pts: number[][] = []; let cx = x, cy = y, a = ang; for (let i = 0; i <= 18; i++) { pts.push([cx, cy]); a += R(-.22, .22) + .02 * Math.sin(i * .9); cx += Math.cos(a) * len / 18; cy += Math.sin(a) * len / 18; }
  add({ dur: d, draw: (p: number) => { const g = eo(p * 1.6), fade = p > .7 ? 1 - (p - .7) / .3 : 1, n = Math.max(2, Math.floor(g * pts.length)); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = fade; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const path = (lw: number, col: string) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); };
    path(w + 2, '#2a1c0e'); path(w, '#6a4a22'); path(Math.max(1, w * .35), 'rgba(150,200,80,.55)');
    for (let i = 3; i < n; i += 3) { const sc = clamp((g * pts.length - i) / 3); ctx.fillStyle = i % 2 ? '#7fae3a' : '#b6c94a'; ctx.beginPath(); ctx.ellipse(pts[i][0] + (i % 2 ? 4 : -4), pts[i][1], 6 * sc, 3 * sc, i % 2 ? .6 : -.6, 0, 7); ctx.fill(); } } });
}
export async function fxMata(env: Env, side: Side, slot: number): Promise<void> {
  prep(); const r = rc(side, slot); if (!r) return; const d = dirOf(side);
  ring(r.x, r.y + r.h / 2 - 4, 8, 80, '170,240,110', 5, .9, .7, .45); add({ dur: .5, draw: (p: number) => glow(r.x, r.y, 90, '150,240,90', .6 * (1 - p)) }); dust(r.x, r.y + r.h / 2, 8, { rgb: '90,70,40', a: .6 });
  for (let i = 0; i < 9; i++) { const sd = i % 2 ? 1 : -1; at(i * .035, () => branch(r.x + sd * R(14, 38), r.y + r.h / 2 - 2, -Math.PI / 2 * (side === 'player' ? 1 : -1) + sd * R(.15, .9) * (side === 'player' ? 1 : -1), R(60, 96), R(3, 5.5), 1.6)); }
  for (let i = 0; i < 26; i++) at(.1 + i * .02, () => spawn({ kind: 'leaf', x: r.x + R(-40, 40), y: r.y + R(-10, 50), vx: R(-70, 70), vy: R(-150, -40), g: 120, s: R(4, 7), life: R(1, 1.8), rot: R(0, 6), vr: R(-5, 5), col: Math.random() < .5 ? '#7fae3a' : '#c8d64c', drag: .985, sway: 20, ph: R(0, 6) }));
  at(.05, () => env.pop(side, slot, 'atk-up', '+2')); at(.25, () => env.pop(side, slot, 'hp-up', '+1')); void d;
  await wait(1.8);
}
// Arsenal dos Mil Invernos entra: onda de frio, armas fantasmas de gelo e cristais (a geada e a neve ficam na camada)
const WEAPONS = ['sword', 'axe', 'spear', 'sword', 'hammer', 'spear', 'axe'];
function weaponPath(kind: string, x: number, yb: number, h: number) {
  ctx.beginPath();
  if (kind === 'sword') { ctx.moveTo(x, yb - h); ctx.lineTo(x + 3, yb - h * .35); ctx.lineTo(x + 9, yb - h * .3); ctx.lineTo(x + 9, yb - h * .24); ctx.lineTo(x + 2, yb - h * .22); ctx.lineTo(x + 2, yb); ctx.lineTo(x - 2, yb); ctx.lineTo(x - 2, yb - h * .22); ctx.lineTo(x - 9, yb - h * .24); ctx.lineTo(x - 9, yb - h * .3); ctx.lineTo(x - 3, yb - h * .35); }
  else if (kind === 'spear') { ctx.moveTo(x, yb - h); ctx.lineTo(x + 5, yb - h * .85); ctx.lineTo(x + 1.5, yb - h * .8); ctx.lineTo(x + 1.5, yb); ctx.lineTo(x - 1.5, yb); ctx.lineTo(x - 1.5, yb - h * .8); ctx.lineTo(x - 5, yb - h * .85); }
  else if (kind === 'axe') { ctx.moveTo(x - 1.5, yb); ctx.lineTo(x - 1.5, yb - h); ctx.lineTo(x + 14, yb - h * .98); ctx.quadraticCurveTo(x + 8, yb - h * .82, x + 14, yb - h * .66); ctx.lineTo(x + 1.5, yb - h * .72); ctx.lineTo(x + 1.5, yb); }
  else { ctx.moveTo(x - 1.5, yb); ctx.lineTo(x - 1.5, yb - h * .82); ctx.lineTo(x - 11, yb - h * .82); ctx.lineTo(x - 11, yb - h); ctx.lineTo(x + 11, yb - h); ctx.lineTo(x + 11, yb - h * .82); ctx.lineTo(x + 1.5, yb - h * .82); ctx.lineTo(x + 1.5, yb); }
  ctx.closePath();
}
export async function fxArsenalPlaced(side: Side, armed: number[]): Promise<void> {
  prep(); const T = rc(side, 10), cs = cols(side), d = dirOf(side), back = rc(side, 7), yb = (back?.y ?? 0) - d * (back?.h ?? 71) / 2; if (!T || !cs[0]) return;
  add({ dur: .4, draw: (p: number) => glow(T.x, T.y, 100, '170,225,255', .8 * (1 - p)) }); ring(T.x, T.y + T.h / 2 - 4, 8, 70, '190,235,255', 5, .9, .6);
  for (let i = 0; i < 16; i++) { const a = R(-Math.PI, 0) * -d, v = R(120, 300); spawn({ kind: 'spark', x: T.x, y: T.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 120, s: 2.4, life: .7, rgb: '200,236,255', drag: .98 }); }
  add({ dur: 1.5, draw: (p: number) => { const x = lerp(T.x + 40, cs[0] - 80, eo(p)); const g = ctx.createRadialGradient(x, midY(), 0, x, midY(), 120); g.addColorStop(0, `rgba(200,236,255,${.5 * (1 - p)})`); g.addColorStop(1, 'rgba(200,236,255,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - 120, midY() - 120, 240, 240); } });
  const xs = [cs[0] - 25, cs[0] + 35, cs[1] + 25, cs[2], cs[3] - 25, cs[4] - 35, cs[4] + 30];
  xs.forEach((x, i) => at(.25 + i * .1, () => add({ dur: 2.2, draw: (p: number) => { const u = eo(p / .35), a = p < .7 ? 1 : 1 - (p - .7) / .3, h = (96 + (i % 3) * 22) * u; if (h < 2) return; ctx.globalCompositeOperation = 'lighter'; ctx.save(); ctx.translate(0, yb); ctx.scale(1, d < 0 ? 1 : -1); ctx.translate(0, -yb);
      const gr = ctx.createLinearGradient(0, yb - h, 0, yb); gr.addColorStop(0, `rgba(240,250,255,${.8 * a})`); gr.addColorStop(1, `rgba(120,185,255,${.18 * a})`); ctx.fillStyle = gr; weaponPath(WEAPONS[i], x, yb, h); ctx.fill(); ctx.strokeStyle = `rgba(255,255,255,${.65 * a})`; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore(); glow(x, yb - d * -1 * h * .55, 26, '150,210,255', .2 * a); },
    tick: (p: number) => { if (p < .6 && Math.random() < .3) spawn({ kind: 'glint', x: x + R(-8, 8), y: yb - d * -1 * R(10, 100), s: 8, life: .6, rgb: '230,248,255' }); } })));
  armed.forEach((slot, i) => at(.9 + i * .1, () => { const r = rc(side, slot); if (r) ring(r.x, r.y, 12, 54, '190,235,255', 3, .8, .5, .8); }));
  await wait(2.6);
}
