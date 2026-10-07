// @ts-nocheck
// Efeitos de combate (ataques à distância, Táticas de dano, habilidade dos Generais): um canvas por cima do tabuleiro com uma
// linha do tempo própria. É a mesma engine do mockup (public/mockups/projeteis/index.html, docs/animacoes.md); as funções
// exportadas no fim são a API do jogo. Todo desenho usa "unidades lógicas" em que a largura de uma casa vale 64
// (U = largura da casa em pixels / 64), então os números ficam iguais em qualquer tamanho de tela.
import fxFire from './assets/proj-boom-fire.webp';
import fxSmoke from './assets/proj-boom-smoke.webp';
import fxHoly from './assets/proj-holy.webp';
import fxPuff from './assets/proj-puff.webp';
import fxDebris from './assets/proj-debris.webp';
import artLanca from './assets/proj-art-lanca.webp';
import artVirote from './assets/proj-art-virote.webp';
import artFlecha from './assets/proj-art-flecha.webp';
import artPedra from './assets/proj-art-pedra.webp';
import artBrasa from './assets/proj-art-brasa.webp';
import artEspada from './assets/proj-art-espada.webp';
import artMartelo from './assets/proj-art-martelo.webp';
import sfxBoomUrl from './assets/sfx-destruicao-fogo.wav';
import sfxHitUrl from './assets/sfx-combate-explosao.wav';
import sfxDanoUrl from './assets/sfx-dano.wav';
import sfxMagicUrl from './assets/sfx-efeito-magico.mp3';
import { playSfxAt, playWhoosh, preloadSfx } from './sfx';

export type FxSide = 'player' | 'npc';
export type FxRect = { cx: number; cy: number; w: number; h: number };
export type FxTarget = { side: FxSide; slot: number; amount: number };
// What the game gives the effects: where things are on screen, and the few things an effect has to do to the game itself.
export interface FxEnv {
  rectOf: (side: FxSide, slot: number) => FxRect | null;
  number: (side: FxSide, slot: number, amount: number, kind: 'damage' | 'heal') => void;   // the floating number, at the moment of the hit
  commit: () => void;                  // the effect has landed: show the new life totals, deaths and so on (called once)
  showCard: (on: boolean) => void;     // the Tática card lands on the board / burns away
}

// ── canvas and the timeline ──────────────────────────────────────────────────────────────────────────────────
let cv: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D;
let RES = 2, U = 1, now = 0, running = false, lastT = 0;
const fxs: any[] = [], sched: any[] = [];
const IMG: Record<string, HTMLImageElement> = {};
const SRC: Record<string, string> = { fire: fxFire, smoke: fxSmoke, holy: fxHoly, puff: fxPuff, debris: fxDebris, a_lanca: artLanca, a_virote: artVirote, a_flecha: artFlecha, a_pedra: artPedra, a_brasa: artBrasa, a_espada: artEspada, a_martelo: artMartelo };
let readyP: Promise<void> | null = null;
export const preloadCombatFx = (): Promise<void> => (readyP ??= Promise.all(Object.entries(SRC).map(([k, src]) => new Promise<void>(r => { const i = new Image(); i.onload = () => { IMG[k] = i; r(); }; i.onerror = () => r(); i.src = src; }))).then(() => {
  [sfxBoomUrl, sfxHitUrl, sfxDanoUrl, sfxMagicUrl].forEach(preloadSfx);
}));

const resize = () => { if (!cv) return; RES = Math.min(3, window.devicePixelRatio || 1); cv.width = Math.round(window.innerWidth * RES); cv.height = Math.round(window.innerHeight * RES); };
const ensureCanvas = () => {
  if (cv) return;
  cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100dvh;pointer-events:none;z-index:285';
  document.body.appendChild(cv);
  ctx = cv.getContext('2d')!;
  resize(); window.addEventListener('resize', resize);
};

const R = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3), ei = (u: number) => clamp(u) * clamp(u);
const at = (delay: number, fn: () => void) => { sched.push({ t: now + delay, fn }); kick(); };
const add = (o: any) => { o.t0 = o.t0 ?? now; fxs.push(o); kick(); return o; };
const wait = (sec: number) => new Promise<void>(r => at(sec, r));

function tick(dt: number) {
  now += dt;
  for (let i = sched.length - 1; i >= 0; i--) if (sched[i].t <= now) { const s = sched.splice(i, 1)[0]; s.fn(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv!.width, cv!.height);
  ctx.setTransform(RES * U, 0, 0, RES * U, 0, 0);
  for (let i = 0; i < fxs.length; i++) {
    const f = fxs[i], p = (now - f.t0) / f.dur;
    if (p >= 1) { f.end && f.end(); fxs.splice(i, 1); i--; continue; }
    if (p >= 0) f.draw(p);
  }
}
function loop(t: number) {
  tick(Math.min(.05, (t - lastT) / 1000)); lastT = t;
  if (fxs.length || sched.length) requestAnimationFrame(loop); else { running = false; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv!.width, cv!.height); }
}
function kick() { if (running || !cv) return; running = true; lastT = performance.now(); requestAnimationFrame(loop); }

// ── sound ────────────────────────────────────────────────────────────────────────────────────────────────────
const URLS: Record<string, string> = { boom: sfxBoomUrl, hit: sfxHitUrl, dano: sfxDanoUrl, magic: sfxMagicUrl };
const play = (name: string, when: number, vol = 1, rate = 1) => playSfxAt(URLS[name], Math.max(0, when), vol, rate);
const whoosh = (when: number, dur: number, vol = .5, f0 = 400, f1 = 1800) => playWhoosh(when, dur, vol, f0, f1);

// the painted art the owner made (src/assets/proj-art-*)
function pick(k: string) {
  const M: Record<string, string> = { lanca: 'a_lanca', virote: 'a_virote', flecha: 'a_flecha', pedra: 'a_pedra', brasa: 'a_brasa', espada: 'a_espada', martelo: 'a_martelo' };
  const img = IMG[M[k]];
  return { img, size: [img.naturalWidth, img.naturalHeight], frame: 0, painted: true };
}

// ── pieces taken from the mockup ─────────────────────────────────────────────────────────────────────────────
const FS = .72;   // the blasts are drawn smaller than the sprite sheet
function sprite(img, cols, size, frame, x, y, sc, alpha, mode, ax = .5, ay = .5, flip = 1) {
  const c = frame % cols, r = Math.floor(frame / cols);
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = mode || 'source-over';
  ctx.translate(x, y); ctx.scale(sc * flip, sc);
  ctx.drawImage(img, c * size, r * size, size, size, -size * ax, -size * ay, size, size);
  ctx.restore();
}
function explosion(x, y, sc = 1, delay = 0, flip = 1) {
  sc *= FS; const dur = 1.25, f = flip < 0 ? -1 : 1;
  at(delay, () => add({ dur, draw(p) {
    const fr = Math.min(29, Math.floor(p * 30));
    sprite(IMG.smoke, 6, 256, fr, x, y, sc, 1, 'source-over', .5, .6, f);
    sprite(IMG.fire, 6, 256, fr, x, y, sc, 1, 'lighter', .5, .6, f);
  } }));
}
function holy(x, y, sc = 1, delay = 0) {
  at(delay, () => add({ dur: 1.0, draw(p) { sprite(IMG.holy, 6, 256, Math.min(23, Math.floor(p * 24)), x, y, sc, 1, 'lighter'); } }));
}
function flash(x, y, r, color = '255,190,90', a = .55, dur = .28) {
  add({ dur, draw(p) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); const al = a * (1 - p) * (1 - p);
    g.addColorStop(0, `rgba(${color},${al})`); g.addColorStop(1, `rgba(${color},0)`); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); } });
}
function shock(x, y, r, dur = .55, color = '255,226,170', w = 5) {
  add({ dur, draw(p) { const e = eo(p), rx = r * e, al = (1 - p) * (1 - p) * .6;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${color},${al})`; ctx.lineWidth = w * (1 - p) * .7 + .8;
    ctx.beginPath(); ctx.ellipse(x, y, rx, rx * .42, 0, 0, Math.PI * 2); ctx.stroke();
    const g = ctx.createRadialGradient(x, y, rx * .5, x, y, rx); g.addColorStop(0, 'rgba(255,200,120,0)'); g.addColorStop(1, `rgba(255,200,120,${al * .18})`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, rx * .42, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } });
}
function scorch(x, y, rx, dur = 2.6) {
  add({ dur, draw(p) { const al = .5 * Math.min(1, p * 8) * (1 - p); const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
    g.addColorStop(0, `rgba(10,6,3,${al})`); g.addColorStop(1, 'rgba(10,6,3,0)'); ctx.save(); ctx.translate(x, y); ctx.scale(1, .45); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.fillRect(x - rx, y - rx, rx * 2, rx * 2); ctx.restore(); } });
}
function puff(x, y, vx, vy, size, life, a = .6, grow = 2.2, tint = 0) {
  const k = Math.floor(Math.random() * 4), rot = R(0, 6.28), vr = R(-1, 1);
  add({ dur: life, draw(p) { const px = x + vx * p * life, py = y + vy * p * life; const s = size * (1 + grow * eo(p)) / 128;
    ctx.save(); ctx.globalAlpha = a * (1 - p) * Math.min(1, p * 10); ctx.translate(px, py); ctx.rotate(rot + vr * p);
    ctx.drawImage(IMG.puff, k * 128, 0, 128, 128, -64 * s, -64 * s, 128 * s, 128 * s); ctx.restore(); } });
}
function dust(x, y, spread, n = 10, size = 46) {
  for (let i = 0; i < n; i++) { const a = R(0, Math.PI * 2), sp = R(.35, 1) * spread; puff(x + Math.cos(a) * 8, y + Math.sin(a) * 4, Math.cos(a) * sp / .9, Math.sin(a) * sp * .4 / .9, R(.6, 1) * size, R(.7, 1.1), .55, 1.6); }
}
function debris(x, y, n = 9, power = 1) {
  for (let i = 0; i < n; i++) {
    const vx = R(-190, 190) * power, vy = -R(170, 360) * power, g = 760, k = Math.floor(Math.random() * 4), sz = R(10, 24) * Math.min(1.4, .6 + power * .5), rot0 = R(0, 6.28), vr = R(-9, 9), life = R(.8, 1.15);
    add({ dur: life, draw(p) { const t = p * life; const px = x + vx * t, py = Math.min(y + 30, y + vy * t + .5 * g * t * t);
      ctx.save(); ctx.globalAlpha = 1 - ei((p - .75) / .25); ctx.translate(px, py); ctx.rotate(rot0 + vr * t); ctx.drawImage(IMG.debris, k * 64, 0, 64, 64, -sz / 2, -sz / 2, sz, sz); ctx.restore(); } });
    // ember trail
    if (i % 2 === 0) add({ dur: life, draw(p) { const t = p * life; const px = x + vx * t, py = y + vy * t + .5 * g * t * t; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,150,40,${.8 * (1 - p)})`; ctx.beginPath(); ctx.arc(px, py, 2.2 * (1 - p) + .5, 0, 7); ctx.fill(); ctx.restore(); } });
  }
}
function sparks(x, y, n = 14, power = 1, color = '255,210,110') {
  for (let i = 0; i < n; i++) {
    const a = R(0, Math.PI * 2), sp = R(80, 300) * power, vx = Math.cos(a) * sp, vy = Math.sin(a) * sp * .8 - 90, g = 520, life = R(.35, .8);
    add({ dur: life, draw(p) { const t = p * life, t2 = Math.max(0, t - .045); const px = x + vx * t, py = y + vy * t + .5 * g * t * t, qx = x + vx * t2, qy = y + vy * t2 + .5 * g * t2 * t2;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${color},${1 - p})`; ctx.lineWidth = 2 * (1 - p) + .6; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(px, py); ctx.stroke(); ctx.restore(); } });
  }
}
function softAngle(from, to, arc, u) {
  // computed as if the target were to the right; mirrored when it is to the left
  const sx = to.x >= from.x ? 1 : -1, dx = Math.abs(to.x - from.x), dyT = to.y - from.y;
  const dy0 = dyT - arc * 4, a0 = clamp(Math.atan2(dy0, dx), -1.5, -.9), a1 = 1.25;
  const us = clamp(.5 - dyT / (8 * arc), .3, .85), t = clamp(u / (2 * us)), S = t * t * t * (t * (6 * t - 15) + 10);
  const soft = a0 + (a1 - a0) * S, tang = Math.atan2(dyT - arc * 4 * (1 - 2 * u), dx);
  // near the top of the arc only the smooth turn is used; towards the ends the arrow follows its real direction
  const d = Math.abs(u - us), w = 1 - clamp((d - .12) / .18), w2 = w * w * (3 - 2 * w);
  const a = tang * (1 - w2) + soft * w2;
  return sx > 0 ? a : Math.PI - a;
}
function fly({ img, cols = 1, frame = 0, size, from, to, dur, arc = 0, scale = [1, 1], spin = 0, trail = 'none', onEnd, aim = false, shadow = false, glow = null, ribbon = null, orb = 0, ease = x => x, lift = .55, shw = 1, len = null, liftLen = 0, soft = false, bez = null, uEnd = 1 }) {
  const pos = []; let ppx = null, ppy = null;
  const o = add({ dur, draw(p) {
    const u = ease(p) * uEnd;
    const gx = from.x + (to.x - from.x) * u, gy = from.y + (to.y - from.y) * u;
    const h = arc ? 4 * u * (1 - u) : 0;              // 0..1 height above the ground line
    let x = gx, y = gy - arc * h;
    if (bez) { const q = 1 - u; x = q * q * from.x + 2 * q * u * bez.x + u * u * to.x; y = q * q * from.y + 2 * q * u * bez.y + u * u * to.y; }
    const ang = aim ? (soft ? softAngle(from, to, arc, u) : Math.atan2((to.y - from.y) - (arc ? arc * 4 * (1 - 2 * u) : 0), to.x - from.x)) : spin * p * dur;
    let sc = scale[0] + (scale[1] - scale[0]) * u + (arc ? lift * h : 0), ssc = sc;
    if (len) { const L = len[0] + (len[1] - len[0]) * u + (arc ? liftLen * h : 0); ssc = L / size[0]; sc = Math.max(.15, L / 70); }
    if (shadow) { ctx.save(); ctx.globalAlpha = .38 * (1 - h * .55); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(gx, gy + 6, 17 * shw * sc * (1 - h * .35), 6 * shw * sc * (1 - h * .35), 0, 0, 7); ctx.fill(); ctx.restore(); }
    // trail: dots are laid along the path every few pixels, so a fast ball leaves a continuous streak and not a row of beads
    if (ppx === null) { ppx = x; ppy = y; }
    const seg = Math.hypot(x - ppx, y - ppy), step = trail === 'smoke' ? 9 : 3, cnt = Math.floor(seg / step);
    for (let i = 1; i <= cnt; i++) {
      const f = i * step / seg, tx = ppx + (x - ppx) * f, ty = ppy + (y - ppy) * f;
      if (trail === 'smoke' || trail === 'fire') puff(tx + R(-4, 4), ty + R(-4, 4), R(-14, 14), R(-8, 16), R(26, 40) * sc * (trail === 'fire' ? .75 : 1), R(.55, .9), trail === 'fire' ? .4 : .42, 1.7);
      if (trail === 'fire') add({ dur: .4, draw(pp) { const s = 5.5 * (1 - pp) + .8; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,${120 + 90 * (1 - pp) | 0},40,${.75 * (1 - pp)})`; ctx.beginPath(); ctx.arc(tx + R(-2, 2), ty + R(-2, 2) + pp * 12, s, 0, 7); ctx.fill(); ctx.restore(); } });
      if (trail === 'gold') add({ dur: .5, draw(pp) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,230,140,${.9 * (1 - pp)})`; ctx.beginPath(); ctx.arc(tx + R(-4, 4), ty + R(-4, 4), 3 * (1 - pp) + .6, 0, 7); ctx.fill(); ctx.restore(); } });
    }
    if (cnt > 0) { const f = cnt * step / seg; ppx += (x - ppx) * f; ppy += (y - ppy) * f; }
    if (ribbon) { pos.push([x, y]); if (pos.length > ribbon.n) pos.shift();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let i = 1; i < pos.length; i++) { const k = i / pos.length; ctx.strokeStyle = `rgba(${ribbon.c},${k * .75})`; ctx.lineWidth = ribbon.w * k; ctx.beginPath(); ctx.moveTo(pos[i - 1][0], pos[i - 1][1]); ctx.lineTo(pos[i][0], pos[i][1]); ctx.stroke(); }
      ctx.restore(); }
    if (glow) { const g = ctx.createRadialGradient(x, y, 0, x, y, glow.r); g.addColorStop(0, `rgba(${glow.c},${glow.a})`); g.addColorStop(1, `rgba(${glow.c},0)`); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - glow.r, y - glow.r, glow.r * 2, glow.r * 2); ctx.restore(); }
    if (orb) { const r = orb * sc; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,235,1)'); g.addColorStop(.35, 'rgba(255,200,90,.95)'); g.addColorStop(.75, 'rgba(255,100,20,.5)'); g.addColorStop(1, 'rgba(255,60,10,0)');
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
    if (img) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(ssc, ssc);
      const iw = size[0], ih = size[1];
      if (img === IMG.rock) { ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 8; ctx.filter = 'brightness(.78) contrast(1.25)'; }
      else { ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 5; }
      ctx.drawImage(img, frame * iw, 0, iw, ih, -iw / 2, -ih / 2, iw, ih); ctx.restore();
    }
  }, end() { onEnd && onEnd(); } });
  return o;
}
function arcTangent(from, to, arc, u) { return Math.atan2((to.y - from.y) - arc * 4 * (1 - 2 * u), to.x - from.x); }
function stick(img, size, to, ang, len, life, sink = 14) {
  const sc = len / size[0];
  const cx = to.x - Math.cos(ang) * (size[0] * sc / 2 - sink), cy = to.y - Math.sin(ang) * (size[0] * sc / 2 - sink);
  add({ dur: life, draw(p) { const wob = Math.sin(p * 46) * 0.07 * Math.exp(-p * 7); ctx.save(); ctx.globalAlpha = 1 - ei((p - .6) / .4); ctx.translate(to.x, to.y); ctx.rotate(wob);
    ctx.translate(cx - to.x, cy - to.y); ctx.rotate(ang); ctx.scale(sc, sc); ctx.drawImage(img, 0, 0, size[0], size[1], -size[0] / 2, -size[1] / 2, size[0], size[1]); ctx.restore(); } });
}
function ring(x, y, r, dur = .3, color = '255,226,150', w = 3) {
  add({ dur, draw(p) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${color},${(1 - p) * .9})`; ctx.lineWidth = w * (1 - p) + .5; ctx.beginPath(); ctx.arc(x, y, r * eo(p), 0, 7); ctx.stroke(); ctx.restore(); } });
}
function burst(x, y, n = 8, len = 46, color = '255,236,170', dur = .22, a0 = 0, spread = Math.PI * 2) {
  for (let i = 0; i < n; i++) { const a = a0 + (i / n) * spread + R(-.12, .12), L = len * R(.6, 1);
    add({ dur, draw(p) { const r0 = L * .25 * eo(p), r1 = L * eo(p); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${color},${1 - p})`; ctx.lineWidth = 2.4 * (1 - p) + .6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); ctx.restore(); } }); }
}
function sparksDir(x, y, ang, cone = .8, n = 8, power = 1, color = '255,210,110') {
  for (let i = 0; i < n; i++) {
    const a = ang + R(-cone, cone), sp = R(90, 280) * power, vx = Math.cos(a) * sp, vy = Math.sin(a) * sp - 40, g = 520, life = R(.25, .6);
    add({ dur: life, draw(p) { const t = p * life, t2 = Math.max(0, t - .04); const px = x + vx * t, py = y + vy * t + .5 * g * t * t, qx = x + vx * t2, qy = y + vy * t2 + .5 * g * t2 * t2;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${color},${1 - p})`; ctx.lineWidth = 1.8 * (1 - p) + .5; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(px, py); ctx.stroke(); ctx.restore(); } });
  }
}
function glint(x, y, L, dur = .26) {
  add({ dur, draw(p) { const k = Math.sin(Math.PI * Math.min(1, p * 1.15)), l = L * (.5 + .5 * eo(p));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y);
    for (const rot of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) { const len = rot === 0 || rot === Math.PI / 2 ? l : l * .55; ctx.save(); ctx.rotate(rot); const g = ctx.createLinearGradient(-len, 0, len, 0);
      g.addColorStop(0, 'rgba(255,240,190,0)'); g.addColorStop(.5, `rgba(255,252,235,${k})`); g.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = g; ctx.fillRect(-len, -1.6, len * 2, 3.2); ctx.restore(); }
    ctx.restore(); } });
}
function cleanHit(x, y, ang, k = 1) {
  flash(x, y, 56 * k, '255,238,180', .7, .15); glint(x, y, 46 * k); ring(x, y, 38 * k, .26); burst(x, y, 9, 52 * k, '255,240,190', .2);
  sparksDir(x, y, ang, .9, 9, 1 * k, '255,236,160');
}
function lanceFade(x, y) { for (let i = 0; i < 14; i++) add({ dur: R(.4, .8), draw(p) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,140,${1 - p})`; ctx.beginPath(); ctx.arc(x + R(-4, 4) + (i - 7) * 4 * p, y - 20 * p + R(-3, 3), 2.2 * (1 - p) + .5, 0, 7); ctx.fill(); ctx.restore(); } }); }
function thunk(x, y, ang) {
  flash(x, y, 46, '255,244,210', .8, .13); ring(x, y, 26, .22, '255,244,210', 2.2); burst(x, y, 6, 30, '255,244,210', .16, ang + Math.PI - .9, 1.8);
  sparksDir(x, y, ang + Math.PI, .75, 10, .9, '255,236,170'); puff(x, y + 2, 0, -10, 24, .42, .4, 1.3);
  for (let i = 0; i < 6; i++) { const a = ang + Math.PI + R(-1.1, 1.1), sp = R(60, 170), vx = Math.cos(a) * sp, vy = Math.sin(a) * sp - 50, life = R(.35, .6), sz = R(1.6, 3);
    add({ dur: life, draw(p) { const t = p * life; ctx.save(); ctx.globalAlpha = 1 - p; ctx.fillStyle = '#c9a36a'; ctx.fillRect(x + vx * t, y + vy * t + 380 * t * t, sz, sz * .7); ctx.restore(); } }); }
}
function rockBreak(rk, x, y, n = 8) {
  if (!rk.painted) return;
  const [w, h] = rk.size, L = 34;
  add({ dur: .2, draw(p) { ctx.save(); ctx.globalAlpha = 1 - ei(p); ctx.translate(x, y + 8 * p); ctx.scale(1 + .45 * p, 1 - .5 * p); const k = L / w; ctx.scale(k, k); ctx.drawImage(rk.img, 0, 0, w, h, -w / 2, -h / 2, w, h); ctx.restore(); } });
  for (let i = 0; i < n; i++) {
    const vx = R(-150, 150), vy = -R(120, 280), g = 720, life = R(.7, 1), sz = R(9, 17), rot0 = R(0, 6.28), vr = R(-8, 8), cw = w * R(.22, .34), cx0 = w * R(.1, .5), cy0 = h * R(.1, .45);
    add({ dur: life, draw(p) { const t = p * life, px = x + vx * t, py = Math.min(y + 26, y + vy * t + .5 * g * t * t);
      ctx.save(); ctx.globalAlpha = 1 - ei((p - .7) / .3); ctx.translate(px, py); ctx.rotate(rot0 + vr * t); ctx.beginPath(); ctx.arc(0, 0, sz / 2, 0, 7); ctx.clip();
      ctx.drawImage(rk.img, cx0, cy0, cw, cw * .8, -sz / 2, -sz / 2, sz, sz); ctx.restore(); } });
  }
}

// ── geometry ─────────────────────────────────────────────────────────────────────────────────────────────────
const setScale = (env: FxEnv) => { const r = env.rectOf('player', 2) ?? env.rectOf('npc', 2); U = r ? r.w / 64 : 1; };
const pt = (env: FxEnv, side: FxSide, slot: number) => { const r = env.rectOf(side, slot); return r ? { x: r.cx / U, y: r.cy / U, w: r.w / U, h: r.h / U } : null; };
// where a Tática lands: the middle band between the two boards (screen pixels)
export const tacticSpot = (rectOf: FxEnv['rectOf']): { x: number; y: number; w: number } | null => {
  const a = rectOf('npc', 2), b = rectOf('player', 2);
  if (!a || !b) return null;
  return { x: (a.cx + b.cx) / 2, y: (a.cy + a.h / 2 + b.cy - b.h / 2) / 2, w: a.w * 1.25 };
};
const tacPoint = (env: FxEnv) => { const s = tacticSpot(env.rectOf)!; return { x: s.x / U, y: s.y / U }; };

// the Tática card falls onto the board, glows (gold light is drawn into it) and then kicks as the effect leaves it
function landTactic(env: FxEnv, onLaunch: () => void) {
  const TAC = tacPoint(env);
  env.showCard(true);
  at(.31, () => {
    play('dano', 0, .5, .6); dust(TAC.x, TAC.y + 34, 90, 8, 36); shock(TAC.x, TAC.y + 36, 80, .45, '255,226,170', 3);
    add({ dur: 1.4, draw(p: number) { ctx.save(); ctx.globalAlpha = .35 * (1 - p); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(TAC.x + 4, TAC.y + 50, 40, 10, 0, 0, 7); ctx.fill(); ctx.restore(); } });
  });
  at(.5, () => {
    whoosh(0, .5, .22, 300, 1300);
    add({ dur: .52, draw(p: number) { const r = 60 + 40 * (1 - p), g = ctx.createRadialGradient(TAC.x, TAC.y, 0, TAC.x, TAC.y, r); g.addColorStop(0, `rgba(255,214,120,${.5 * p})`); g.addColorStop(1, 'rgba(255,214,120,0)');
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(TAC.x - r, TAC.y - r, 2 * r, 2 * r); ctx.restore(); } });
    for (let i = 0; i < 16; i++) { const a = R(0, 6.28), d0 = R(60, 110), dl = R(0, .22); add({ dur: .3 + .1 * R(0, 1), t0: now + dl, draw(p: number) { const d = d0 * (1 - eo(p)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,140,${.9 * (1 - p * .3)})`; ctx.beginPath(); ctx.arc(TAC.x + Math.cos(a) * d, TAC.y + Math.sin(a) * d * .8, 2.4 * (1 - p) + .8, 0, 7); ctx.fill(); ctx.restore(); } }); }
  });
  at(1.05, () => { flash(TAC.x, TAC.y, 110, '255,225,150', .6, .3); onLaunch(); });
}
const leaveTactic = (env: FxEnv, delay: number) => at(delay, () => { env.showCard(false); sparks(tacPoint(env).x, tacPoint(env).y, 10, .5, '255,190,90'); });

// A General's ability: it does not strike, so the weapon is raised upright over the card, shines, and lets the effect go.
function weaponReveal(env: FxEnv, side: FxSide, sp: any, { len, tint, dur = 2.2, onPeak }: { len: number; tint: string; dur?: number; onPeak?: (tx: number, ty: number) => void }) {
  const gen = pt(env, side, 12)!, gx = gen.x, gy = gen.y, k = len / sp.size[0], motes: any[] = [], UP = -Math.PI / 2;
  // the General's card itself glows (drawn over it, additive), pulsing while the weapon is up
  add({ dur, draw(p: number) { const a = Math.sin(Math.PI * clamp(p / .9)) * (.5 + .2 * Math.sin(p * dur * 7)), rx = gen.w * .95, ry = gen.h * .85;
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, ry); g.addColorStop(0, `rgba(${tint},${.42 * a})`); g.addColorStop(1, `rgba(${tint},0)`);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(gx, gy); ctx.scale(rx / ry, 1); ctx.translate(-gx, -gy); ctx.fillStyle = g; ctx.fillRect(gx - ry, gy - ry, ry * 2, ry * 2); ctx.restore(); } });
  const back = (x: number) => 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2);     // ease-out-back: it overshoots a little and settles
  play('magic', .1, .7); whoosh(0, .4, .3, 300, 1500);
  add({ dur, draw(p: number) {
    const inn = clamp(p / .26), out = 1 - ei((p - .8) / .2), a = Math.min(1, eo(p / .12)) * out, bob = p > .3 ? Math.sin(p * dur * 4.5) * 1.6 : 0;
    const raise = back(inn), x = gx, y = gy - 58 - 62 * raise + bob, rot = UP + (1 - raise) * .95, sc = k * (.75 + .25 * Math.min(1, raise));
    const pulse = .5 + .5 * Math.sin(p * dur * 7), held = p > .3 && p < .8;
    const r = 78 + 16 * pulse, gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${tint},${a * (.45 + (held ? .3 : 0) * pulse)})`); gr.addColorStop(1, `rgba(${tint},0)`);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.shadowColor = `rgba(${tint},.95)`; ctx.shadowBlur = 14 + (held ? 14 * pulse : 0);
    ctx.drawImage(sp.img, 0, 0, sp.size[0], sp.size[1], -sp.size[0] / 2, -sp.size[1] / 2, sp.size[0], sp.size[1]); ctx.restore();
    const sh = clamp((p - .3) / .35), sx = x, sy = y + len * (.5 - sh);
    if (sh > 0 && sh < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 26); gg.addColorStop(0, `rgba(255,255,240,${.95 * Math.sin(Math.PI * sh) * a})`); gg.addColorStop(1, 'rgba(255,255,240,0)'); ctx.fillStyle = gg; ctx.fillRect(sx - 26, sy - 26, 52, 52); ctx.restore(); }
    if (Math.random() < .55 && a > .3) motes.push({ x: x + R(-14, 14), y: y + R(-.5, .5) * len, vy: -R(16, 46), life: R(.5, 1), t: 0 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = motes.length - 1; i >= 0; i--) { const m = motes[i]; m.t += 1 / 60; m.y += m.vy / 60; const q = m.t / m.life; if (q >= 1) { motes.splice(i, 1); continue; } ctx.fillStyle = `rgba(${tint},${1 - q})`; ctx.beginPath(); ctx.arc(m.x, m.y, 2.2 * (1 - q) + .6, 0, 7); ctx.fill(); }
    ctx.restore();
  } });
  at(dur * .42, () => { const tx = gx, ty = gy - 58 - 62 - len * .5; glint(tx, ty, 70, .45); ring(tx, ty, 70, .5, tint, 4); flash(tx, ty, 120, tint, .6, .4); play('dano', 0, .3, 1.5); onPeak && onPeak(tx, ty); });
}

// ── the API ──────────────────────────────────────────────────────────────────────────────────────────────────
const once = (fn: () => void) => { let done = false; return () => { if (!done) { done = true; fn(); } }; };

// Catapulta de Guerra / Trabuco de Cerco / Balestra de Precisão: the card lands on the board, glows and the effect leaves it.
// `targets` come from the damage events; resolves when the next thing may be shown.
export async function fxTactic(kind: 'catapulta' | 'trabuco' | 'balestra', env: FxEnv, side: FxSide, targets: FxTarget[]): Promise<void> {
  await preloadCombatFx(); ensureCanvas(); setScale(env);
  const commit = once(env.commit);
  const T = targets.map(t => ({ ...t, p: pt(env, t.side, t.slot) })).filter(t => t.p);
  if (!T.length) { commit(); return; }
  const tp = tacPoint(env), dirY = side === 'player' ? -1 : 1;
  const hitNumber = (t: any, d: number) => at(d, () => env.number(t.side, t.slot, t.amount, 'damage'));
  return new Promise<void>(resolve => {
    landTactic(env, () => {
      const from = { x: tp.x, y: tp.y + 30 * dirY };
      if (kind === 'catapulta') {
        const rk = pick('pedra'), cx = T.reduce((s, t) => s + t.p!.x, 0) / T.length, cy = T.reduce((s, t) => s + t.p!.y, 0) / T.length, TT = .85;
        whoosh(0, .3, .35, 250, 900); play('dano', 0, .35, .7);
        fly({ img: rk.img, size: rk.size, from, to: { x: cx, y: cy + 6 }, dur: TT, arc: 200, len: [34, 34], liftLen: 62, spin: 7, trail: 'smoke', shadow: true });
        whoosh(.2, TT - .2, .45, 600, 300); play('boom', TT - .44, .8);
        at(TT, () => {
          commit();
          flash(cx, cy, 150, '255,180,80', .5, .25); rockBreak(rk, cx, cy + 6); explosion(cx, cy + 2, .62, 0);
          shock(cx, cy + 30, 190, .55, '255,226,170', 3); scorch(cx, cy + 30, 120);
          dust(cx, cy + 34, 110, 8, 40); debris(cx, cy, 7, .9); sparks(cx, cy, 10, .9);
          T.forEach(t => { const dx = Math.abs(t.p!.x - cx), d = dx / 1100; if (dx > 1) explosion(t.p!.x, t.p!.y + 2, .36, d, Math.random() < .5 ? 1 : -1); hitNumber(t, d + .06); });
        });
        leaveTactic(env, 1.35);
        at(TT + .7, resolve);
      } else if (kind === 'trabuco') {
        // the first ball bursts in the AIR (its shadow stays on the ground) and the pieces fall in arcs, one per target
        const rk = pick('brasa'), cx = T.reduce((s, t) => s + t.p!.x, 0) / T.length, cy = T.reduce((s, t) => s + t.p!.y, 0) / T.length;
        const ground = { x: cx, y: cy }, T1 = .78, UE = .62, ARC = 150;
        const gy = from.y + (ground.y - from.y) * UE, mid = { x: from.x + (ground.x - from.x) * UE, y: gy - ARC * 4 * UE * (1 - UE) };
        whoosh(0, .5, .5, 180, 700); play('boom', 0, .3, .6);
        fly({ img: rk.img, size: rk.size, from, to: ground, uEnd: UE, dur: T1, arc: ARC, scale: [.7, 1.2], len: [34, 58], spin: 4, shadow: true, shw: 2.2, trail: 'fire', glow: { r: 50, c: '255,120,30', a: .5 }, orb: 26 });
        whoosh(.1, T1, .35, 500, 250);
        let last = 0;
        at(T1, () => {
          commit();
          play('boom', -.2, .45, 1.3); flash(mid.x, mid.y, 160, '255,200,120', .8, .3); ring(mid.x, mid.y, 100, .45, '255,190,110', 4); ring(mid.x, mid.y, 60, .3, '255,230,170', 3);
          burst(mid.x, mid.y, 18, 96, '255,210,130', .34); glint(mid.x, mid.y, 70, .3); sparks(mid.x, mid.y, 22, 1.2, '255,190,100');
          T.forEach((t, i) => {
            const tx = t.p!.x, ty = t.p!.y + 4, d = i * .04, T2 = .5 + Math.hypot(tx - mid.x, ty - mid.y) / 1000, big = t.slot === 12;
            const c = { x: mid.x + (tx - mid.x) * 1.15, y: Math.min(mid.y, ty) - 36 - R(0, 26) };   // each piece first flies out and up, then drops onto its card
            last = Math.max(last, d + T2);
            at(d, () => {
              whoosh(0, .3, .13, 900, 1700);
              fly({ img: null, from: { x: mid.x + R(-6, 6), y: mid.y + R(-6, 6) }, to: { x: tx, y: ty }, bez: c, dur: T2, scale: [.9, .65], trail: 'fire', glow: { r: 24, c: '255,120,30', a: .5 }, orb: 12 });
              at(T2, () => { explosion(tx, ty, big ? .5 : .38, 0, Math.random() < .5 ? 1 : -1); flash(tx, ty, 60, '255,190,90', .5, .2); sparks(tx, ty, 5, .5); play('dano', 0, .22, 1.2 + R(0, .4)); hitNumber(t, 0); });
            });
          });
          leaveTactic(env, .5 + last + .3);
          at(.5 + last + .6, resolve);
        });
      } else {
        const vt = pick('virote'), t = T[0], to = { x: t.p!.x, y: t.p!.y + 6 }, TT = .3, LEN = 110, ang = Math.atan2(to.y - from.y, to.x - from.x);
        whoosh(0, .28, .5, 1200, 3200); play('dano', 0, .25, 1.4);
        fly({ img: vt.img, size: vt.size, from, to, dur: TT, aim: true, len: [LEN, LEN], ribbon: { n: 12, c: '255,255,255', w: 4 } });
        play('hit', TT - .042, .9);
        at(TT, () => { commit(); thunk(to.x, to.y, ang); stick(vt.img, vt.size, to, ang, LEN, 1.1, 16); hitNumber(t, .05); });
        leaveTactic(env, TT + .8);
        at(TT + .6, resolve);
      }
    });
  });
}

// The General's ability (they do not attack: the weapon is raised upright, shines, and the effect is released).
//   'cura'  — Cardeal Pedro: green; the light goes down to the healed unit (`targets` = the heal events)
//   'bonus' — Aurelion: red; a wave passes through the allied units that got the bonus (nothing is held back)
export async function fxHero(kind: 'cura' | 'bonus', env: FxEnv, side: FxSide, targets: FxTarget[]): Promise<void> {
  await preloadCombatFx(); ensureCanvas(); setScale(env);
  const commit = once(env.commit);
  const T = targets.map(t => ({ ...t, p: pt(env, t.side, t.slot) })).filter(t => t.p);
  return new Promise<void>(resolve => {
    if (kind === 'cura') {
      weaponReveal(env, side, pick('martelo'), { len: 124, tint: '120,235,120', dur: 2.3, onPeak(sx, sy) {
        T.forEach((t, k) => {
          const tx = t.p!.x, ty = t.p!.y;
          for (let i = 0; i < 10; i++) { const d = i * .05, c1x = sx + R(-90, -20), c1y = sy - R(0, 50);
            at(d, () => add({ dur: .75, draw(p: number) { const q = eo(p), x = (1 - q) * (1 - q) * sx + 2 * (1 - q) * q * c1x + q * q * tx, y = (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * c1y + q * q * (ty - 10);
              ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gr = ctx.createRadialGradient(x, y, 0, x, y, 10); gr.addColorStop(0, `rgba(220,255,200,${1 - p * .3})`); gr.addColorStop(1, 'rgba(90,220,100,0)'); ctx.fillStyle = gr; ctx.fillRect(x - 10, y - 10, 20, 20); ctx.restore(); } })); }
          at(.8 + k * .08, () => { play('dano', 0, .25, 1.7); flash(tx, ty, 90, '120,235,120', .55, .5); ring(tx, ty, 54, .5, '150,255,150', 3); sparksDir(tx, ty, -Math.PI / 2, 1.2, 10, .6, '170,255,150'); if (k === 0) commit(); env.number(t.side, t.slot, t.amount, 'heal'); });
        });
        if (!T.length) commit();
      } });
      at(2.3 * .42 + 1.0, resolve);
    } else {
      weaponReveal(env, side, pick('espada'), { len: 160, tint: '255,90,70', dur: 2.3, onPeak() {
        const g = pt(env, side, 12)!;
        whoosh(0, .5, .3, 400, 1600); ring(g.x, g.y - 20, 130, .6, '255,110,80', 4);
        T.forEach((t, i) => { const x = t.p!.x, y = t.p!.y, d = .25 + i * .08;
          at(d, () => { flash(x, y, 80, '255,90,70', .5, .6); ring(x, y, 50, .5, '255,140,110', 3); sparksDir(x, y, -Math.PI / 2, 1.1, 8, .5, '255,150,110'); play('dano', 0, .22, 1.6); }); });
      } });
      commit();               // nothing is held back: the bonus shows on the cards at once and the wave passes over them
      at(1.2, resolve);
    }
  });
}

// A ranged attack that replaces the lunge. Resolves `impact` the moment it lands (the game then applies the blow) and `done` once it is over.
//   'lanca'  — Jorge: he pulls the lance back, throws it speeding up, and it goes on through to the card behind (`behind`)
//   'flecha' — Arqueiro / Atirador: an arrow in a high arc that shrinks with the distance
export function fxRanged(kind: 'lanca' | 'flecha', env: FxEnv, a: { side: FxSide; from: number; to: number; behind?: number }): { impact: Promise<void>; done: Promise<void> } {
  let resolveImpact!: () => void, resolveDone!: () => void;
  const impact = new Promise<void>(r => { resolveImpact = r; }), done = new Promise<void>(r => { resolveDone = r; });
  (async () => {
    await preloadCombatFx(); ensureCanvas(); setScale(env);
    const A = pt(env, a.side, a.from), T1 = pt(env, a.side === 'player' ? 'npc' : 'player', a.to);
    if (!A || !T1) { resolveImpact(); resolveDone(); return; }
    const tgtSide: FxSide = a.side === 'player' ? 'npc' : 'player';
    if (kind === 'lanca') {
      const lc = pick('lanca'), T2 = a.behind !== undefined ? pt(env, tgtSide, a.behind) : null;
      const LEN = 150, WIND = .5, TT1 = .36, TT2 = .22;
      const dx = T1.x - A.x, dy = T1.y - A.y, dl = Math.hypot(dx, dy) || 1, d = { x: dx / dl, y: dy / dl }, ang = Math.atan2(d.y, d.x);
      const from = { x: A.x + d.x * 38, y: A.y + d.y * 38 };
      whoosh(.05, WIND, .3, 300, 1600);
      add({ dur: WIND, draw(p: number) {
        const back = 34 * eo(p / .8), tr = p > .55 ? Math.sin(p * 90) * 1.4 : 0, x = from.x - d.x * back + tr, y = from.y - d.y * back;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 48); g.addColorStop(0, `rgba(255,226,140,${.55 * p})`); g.addColorStop(1, 'rgba(255,226,140,0)');
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - 48, y - 48, 96, 96); ctx.restore();
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const k = LEN / lc.size[0]; ctx.scale(k, k); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 5;
        ctx.drawImage(lc.img, 0, 0, lc.size[0], lc.size[1], -lc.size[0] * .5, -lc.size[1] / 2, lc.size[0], lc.size[1]); ctx.restore();
      } });
      at(WIND, () => {
        play('dano', 0, .25, 1.5); whoosh(0, .32, .5, 600, 3000); play('hit', TT1 - .042, .95);
        flash(from.x, from.y, 70, '255,236,170', .5, .2);
        fly({ img: lc.img, size: lc.size, from: { x: from.x - d.x * 34, y: from.y - d.y * 34 }, to: T1, dur: TT1, aim: true, len: [LEN, LEN], ease: (u: number) => Math.pow(u, 2.1), trail: 'gold', glow: { r: 34, c: '255,222,130', a: .5 }, ribbon: { n: 12, c: '255,222,130', w: 7 } });
      });
      at(WIND + TT1, () => {
        resolveImpact();
        cleanHit(T1.x, T1.y, ang, 1);
        if (T2) {
          play('hit', TT2 - .042, .7, 1.15);
          fly({ img: lc.img, size: lc.size, from: T1, to: T2, dur: TT2, aim: true, len: [LEN, LEN * .9], trail: 'gold', glow: { r: 28, c: '255,222,130', a: .45 }, ribbon: { n: 8, c: '255,222,130', w: 5 } });
          at(TT2, () => { cleanHit(T2.x, T2.y, ang, .75); lanceFade(T2.x, T2.y); });
        } else lanceFade(T1.x, T1.y);
        at(T2 ? TT2 + .5 : .5, resolveDone);
      });
    } else {
      const ar = pick('flecha');
      const dist = Math.hypot(T1.x - A.x, T1.y - A.y), arc = clamp(dist * .9, 90, 205) + R(-12, 12), TT = clamp(.7 + dist / 600, .8, 1.15);
      const f = { x: A.x + R(-4, 4), y: A.y }, to = { x: T1.x + R(-10, 10), y: T1.y + R(-6, 8) };
      whoosh(0, .3, .3, 1400, 2400); whoosh(.55, .4, .18, 2400, 1200); play('dano', TT - .05, .3, 1.5);
      fly({ img: ar.img, size: ar.size, from: f, to, dur: TT, arc, aim: true, soft: true, len: [74, 50], liftLen: 12, shadow: true, shw: 2.6, ribbon: { n: 5, c: '255,255,255', w: 1 } });
      at(TT, () => {
        resolveImpact();
        const ang = softAngle(f, to, arc, 1);
        stick(ar.img, ar.size, to, ang, 50, 1.0, 9);
        puff(to.x, to.y + 4, 0, -12, 26, .45, .45, 1.3); sparksDir(to.x, to.y, ang + Math.PI, .8, 5, .5, '255,240,200');
        at(.4, resolveDone);
      });
    }
  })();
  return { impact, done };
}
