// A carta destruída vira cinza (mockup B aprovado pelo dono, rodada 26; public/mockups/cemiterio): ela é incinerada no próprio lugar, de dentro para fora, e se
// desfaz em brasas e cinzas com as cores da própria carta; a nuvem escorre em arco até o cemitério e SÓ QUANDO ela chega a carta aparece na pilha (`onArrive`).
// Canvas 2D por cima de tudo (um por efeito, criado e removido), tamanho de carta = o da casa do jogo. Quem chama conta a promessa como efeito em andamento
// (a IA e o jogador esperam). Sem som aqui: o som da destruição já toca no jogo.
type Box = { cx: number; cy: number; w: number; h: number };
export type AshOpts = { faceUrl: string | null; from: Box; to: Box; onArrive?: () => void };

const NS = 64;
let nz: Float32Array | null = null;
const noiseGrid = () => { if (!nz) { nz = new Float32Array(NS * NS); let s = 91; for (let i = 0; i < nz.length; i++) { s = (s * 16807) % 2147483647; nz[i] = s / 2147483647; } } return nz; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t, clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (t: number) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2), easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const noise = (u: number, v: number) => { const g = noiseGrid(), x = ((u * NS) % NS + NS) % NS, y = ((v * NS) % NS + NS) % NS, x0 = Math.floor(x), y0 = Math.floor(y), tx = x - x0, ty = y - y0, G = (i: number, j: number) => g[(j % NS) * NS + (i % NS)], sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty); return lerp(lerp(G(x0, y0), G(x0 + 1, y0), sx), lerp(G(x0, y0 + 1), G(x0 + 1, y0 + 1), sx), sy); };
const fbm = (u: number, v: number) => noise(u * 2, v * 2) * .55 + noise(u * 5, v * 5) * .3 + noise(u * 11, v * 11) * .15;
const HIT = { u: .5, v: .55 };   // onde a pancada pegou
const burnAt = (u: number, v: number) => Math.hypot((u - HIT.u) * .9, (v - HIT.v) * .7) * 1.05 + (fbm(u, v) - .5) * .5;   // queima de dentro para fora
const BURN_S = 1.15, ASPECT = 840 / 1129;

const loadImg = (u: string) => new Promise<HTMLImageElement | null>(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = u; });

type Part = { x: number; y: number; vx: number; vy: number; g: number; drag: number; age: number; life: number; s: number; c: [number, number, number]; a: number; smoke: boolean; add: boolean; grow?: number };
type Ash = { u: number; v: number; col: [number, number, number]; tb: number; dur: number; arcH: number; side: number; off: number; sz: number; done: boolean; released: boolean; x0: number; y0: number; rel: number; px: number; py: number; hot: number };

export async function fxAshes(o: AshOpts): Promise<void> {
  const face = o.faceUrl ? await loadImg(o.faceUrl) : null;
  const W = window.innerWidth, H = window.innerHeight, DPR = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas'); canvas.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100dvh;pointer-events:none;z-index:287';
  canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR); document.body.appendChild(canvas);
  const g = canvas.getContext('2d')!;
  let seed = (Math.floor(o.from.cx * 7 + o.from.cy * 13) % 9973) + 1; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const R = (a: number, b: number) => a + (b - a) * rnd();
  // a carta no tamanho da casa (com as asas, como o jogo a mostra), em pixels que se dissolvem
  const bw = o.from.w * 1.24, bh = bw / ASPECT, CW = clamp(Math.round(bw * DPR * 1.5), 96, 240), CH = Math.round(CW / ASPECT);
  const src = document.createElement('canvas'); src.width = CW; src.height = CH; const sg = src.getContext('2d', { willReadFrequently: true })!;
  if (face) sg.drawImage(face, 0, 0, CW, CH); else { const gr = sg.createLinearGradient(0, 0, 0, CH); gr.addColorStop(0, '#d9b873'); gr.addColorStop(1, '#6b4a22'); sg.fillStyle = gr; sg.beginPath(); sg.roundRect(CW * .1, CH * .06, CW * .8, CH * .88, 10); sg.fill(); }
  const pix = sg.getImageData(0, 0, CW, CH), outC = document.createElement('canvas'), edgeC = document.createElement('canvas'); outC.width = edgeC.width = CW; outC.height = edgeC.height = CH;
  const outG = outC.getContext('2d')!, edgeG = edgeC.getContext('2d')!;
  const dissolve = (burn: number) => {
    const out = outG.createImageData(CW, CH), edge = edgeG.createImageData(CW, CH), s = pix.data, d = out.data, e = edge.data;
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
      const i = (y * CW + x) * 4, a = s[i + 3]; if (a < 8) continue;
      const dd = burnAt(x / CW, y / CH) - burn * .75 + .1;
      if (dd < -.02) continue;
      if (dd < .03) { const k = 1 - (dd + .02) / .05; d[i] = 255; d[i + 1] = 170 + 80 * k; d[i + 2] = 40 + 90 * k * k; d[i + 3] = a; e[i] = 255; e[i + 1] = 150 + 90 * k; e[i + 2] = 40; e[i + 3] = a * k; continue; }
      if (dd < .16) { const k = (dd - .03) / .13, dk = .18 + .82 * k; d[i] = s[i] * dk + 70 * (1 - k); d[i + 1] = s[i + 1] * dk * .85 + 18 * (1 - k); d[i + 2] = s[i + 2] * dk * .7; d[i + 3] = a; if (k < .5) { e[i] = 255; e[i + 1] = 90; e[i + 2] = 20; e[i + 3] = a * (1 - k * 2) * .6; } continue; }
      d[i] = s[i]; d[i + 1] = s[i + 1]; d[i + 2] = s[i + 2]; d[i + 3] = a;
    }
    outG.putImageData(out, 0, 0); edgeG.putImageData(edge, 0, 0);
  };
  // as cinzas: pontos tirados da própria carta, liberados quando a frente de fogo passa por eles
  const ashes: Ash[] = [], N = clamp(Math.round(bw * bh / 5), 450, 1300), px = pix.data;
  for (let n = 0, guard = 0; n < N && guard < N * 6; guard++) {
    const x = Math.floor(R(0, CW)), y = Math.floor(R(0, CH)), i = (y * CW + x) * 4; if (px[i + 3] < 120) continue; n++;
    const u = x / CW, v = y / CH, b = (burnAt(u, v) + .1) / .75;
    ashes.push({ u, v, col: [px[i], px[i + 1], px[i + 2]], tb: b / 1.25 * BURN_S, dur: R(1.0, 1.7), arcH: R(40, 150) * (o.from.w / 66), side: R(-70, 90) * (o.from.w / 66), off: R(-14, 14), sz: R(.9, 2.2) * Math.max(.8, o.from.w / 66), done: false, released: false, x0: 0, y0: 0, rel: 0, px: 0, py: 0, hot: 0 });
  }
  const P: Part[] = [];
  const spawn = (p: Partial<Part>) => { if (P.length < 1800) P.push({ x: 0, y: 0, vx: 0, vy: 0, g: 0, drag: .98, age: 0, life: 1, s: 2, c: [255, 170, 60], a: 1, smoke: false, add: true, ...p }); };
  const glow = (x: number, y: number, r: number, rgb: string, a: number) => { g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(.4, `rgba(${rgb},${a * .35})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.globalCompositeOperation = 'source-over'; };
  const rings: { x: number; y: number; t0: number; dur: number; r: number }[] = [];
  const A = o.from, B = o.to; let arrived = false, tArrive = 0, done = false, ashDone = 0;
  const boom = (t: number) => {
    rings.push({ x: B.cx, y: B.cy, t0: t, dur: .7, r: B.w * .7 }, { x: B.cx, y: B.cy, t0: t, dur: .5, r: B.w * .42 });
    for (let i = 0; i < 38; i++) { const a = R(0, 6.283), v = R(30, 150) * (B.w / 66); spawn({ x: B.cx, y: B.cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, g: 140, drag: .95, life: R(.5, 1.1), s: R(1, 2.6), c: [255, R(120, 210), 40] }); }
    for (let i = 0; i < 8; i++) spawn({ x: B.cx + R(-8, 8), y: B.cy + R(-6, 6), vx: R(-14, 14), vy: R(-30, -8), g: -6, drag: .97, life: R(.9, 1.6), s: R(10, 18), grow: 1.4, c: [120, 100, 92], a: .35, smoke: true, add: false });
  };
  await new Promise<void>(resolve => {
    const t0 = performance.now(); let last = t0; let raf = 0;
    const finish = () => { if (done) return; done = true; cancelAnimationFrame(raf); canvas.remove(); if (!arrived) o.onArrive?.(); resolve(); };
    const frame = (now: number) => {
      if (done) return; const t = (now - t0) / 1000, dt = Math.min(.05, (now - last) / 1000); last = now;
      g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
      // partículas
      for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.age += dt; if (p.age >= p.life) { P.splice(i, 1); continue; } const k = Math.pow(p.drag, dt * 60); p.vx *= k; p.vy *= k; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      // a mancha de queimado na casa
      const scorch = clamp((t - .2) / 1, 0, 1) * (1 - clamp((t - 3.2) / 1.2, 0, 1));
      if (scorch > 0) { const r = A.w * .7, gr = g.createRadialGradient(A.cx, A.cy, 4, A.cx, A.cy, r); gr.addColorStop(0, `rgba(6,3,2,${.55 * scorch})`); gr.addColorStop(1, 'rgba(6,3,2,0)'); g.fillStyle = gr; g.fillRect(A.cx - r, A.cy - r, r * 2, r * 2); }
      // a carta queimando
      const burn = clamp(t / BURN_S * 1.25, 0, 1.25);
      if (burn < 1.25) {
        dissolve(burn);
        g.drawImage(outC, A.cx - bw / 2, A.cy - bh / 2, bw, bh);
        g.save(); g.globalCompositeOperation = 'lighter'; g.filter = 'blur(2.5px)'; g.drawImage(edgeC, A.cx - bw / 2, A.cy - bh / 2, bw, bh); g.filter = 'none'; g.globalAlpha = .5; g.drawImage(edgeC, A.cx - bw / 2, A.cy - bh / 2, bw, bh); g.restore();
        if (burn > .02 && burn < 1.2) {
          for (let i = 0; i < 2; i++) { const u = R(-.5, .5), v = R(-.5, .5); if (burnAt(.5 + u * .9, .5 + v * .9) - burn * .75 + .1 < .05) spawn({ x: A.cx + u * A.w, y: A.cy + v * A.h, vx: R(-12, 12), vy: R(-70, -25), g: -40, drag: .96, life: R(.5, 1.1), s: R(.9, 2.2), c: [255, R(110, 200), 40] }); }
          if (rnd() < .5) spawn({ x: A.cx + R(-.4, .4) * A.w, y: A.cy + R(-.3, .2) * A.h, vx: R(-8, 8), vy: R(-30, -12), g: -8, drag: .97, life: R(.8, 1.5), s: R(8, 15), grow: 1.5, c: [96, 88, 82], a: .22, smoke: true, add: false });
          glow(A.cx, A.cy, A.w * .8, '255,120,40', .35 * Math.sin(Math.PI * clamp(burn / 1.25, 0, 1)));
        }
      }
      // a nuvem
      for (const a of ashes) {
        if (!a.released && t >= a.tb) { a.released = true; a.x0 = A.cx + (a.u - .5) * bw * .95; a.y0 = A.cy + (a.v - .5) * bh * .95; a.rel = t; }
        if (!a.released || a.done) continue;
        const u = clamp((t - a.rel) / a.dur, 0, 1), e = u < .25 ? .5 * Math.pow(u / .25, 2) * .25 : ease((u - .125) / .875) * .9 + .025, uu = clamp(e, 0, 1), k = 1 - uu;
        const sc = B.w / 66, Pb = { x: B.cx + a.off * sc, y: B.cy + a.off * .5 * sc }, Cc = { x: (a.x0 + Pb.x) / 2 + a.side, y: Math.min(a.y0, Pb.y) - a.arcH };
        a.px = k * k * a.x0 + 2 * k * uu * Cc.x + uu * uu * Pb.x + Math.sin(t * 6 + a.u * 20) * 3 * (1 - uu); a.py = k * k * a.y0 + 2 * k * uu * Cc.y + uu * uu * Pb.y + Math.cos(t * 5 + a.v * 20) * 3 * (1 - uu);
        a.hot = clamp(1 - (t - a.rel) / .5, 0, 1);
        if (u >= 1) { a.done = true; ashDone++; continue; }
        const fade = u > .88 ? 1 - (u - .88) / .12 : 1, gray = lerp(1, 0, clamp((t - a.rel) / .45, 0, 1)), cr = a.col[0] * (1 - gray) + 150 * gray, cg = a.col[1] * (1 - gray) + 136 * gray, cb = a.col[2] * (1 - gray) + 124 * gray;
        g.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${.85 * fade})`; g.beginPath(); g.arc(a.px, a.py, a.sz * (1 - u * .35), 0, 6.283); g.fill();
        if (a.hot > 0) { g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,${120 + 90 * a.hot | 0},40,${a.hot * .8})`; g.beginPath(); g.arc(a.px, a.py, a.sz * 1.8, 0, 6.283); g.fill(); g.globalCompositeOperation = 'source-over'; }
        if (rnd() < .03) spawn({ x: a.px, y: a.py, vx: R(-8, 8), vy: R(-14, 4), g: -4, drag: .96, life: R(.5, 1), s: R(5, 10) * Math.max(.8, A.w / 66), grow: 1.2, c: [118, 108, 100], a: .18, smoke: true, add: false });
        if (a.hot > .6 && rnd() < .1) spawn({ x: a.px, y: a.py, vx: R(-20, 20), vy: R(-50, -15), g: -30, drag: .97, life: R(.4, .9), s: R(.8, 1.6), c: [255, R(130, 200), 40] });
      }
      // chegada ao cemitério
      const frac = ashes.length ? ashDone / ashes.length : 1;
      if (!arrived && frac > .15 && frac < 1 && rnd() < .3) for (let i = 0; i < 2; i++) spawn({ x: B.cx + R(-14, 14), y: B.cy + R(-10, 10), vx: R(-20, 20), vy: R(-40, -10), g: -10, drag: .96, life: R(.5, 1), s: R(1, 2), c: [255, R(130, 190), 50] });
      if (!arrived && (frac > .97 || t > 7)) { arrived = true; tArrive = t; boom(t); o.onArrive?.(); }
      if (!arrived && frac > .1) glow(B.cx, B.cy, B.w * 1.05, '255,150,60', clamp(frac * 1.3, 0, 1) * .45);
      // partículas por cima
      for (const p of P) { const u = p.age / p.life, f = u < .12 ? u / .12 : 1 - (u - .12) / .88, a = clamp(p.a * f, 0, 1); if (a <= .01) continue; g.globalCompositeOperation = p.add ? 'lighter' : 'source-over'; const r = p.s * (p.grow ? 1 + p.grow * u : 1);
        if (p.smoke) { const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); gr.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${a})`); gr.addColorStop(1, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`); g.fillStyle = gr; g.fillRect(p.x - r, p.y - r, r * 2, r * 2); }
        else { g.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${a})`; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.283); g.fill(); if (p.add && r > 1.2) { g.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${a * .25})`; g.beginPath(); g.arc(p.x, p.y, r * 2.4, 0, 6.283); g.fill(); } } }
      g.globalCompositeOperation = 'source-over';
      for (let i = rings.length - 1; i >= 0; i--) { const r = rings[i], u = (t - r.t0) / r.dur; if (u >= 1) { rings.splice(i, 1); continue; } g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,200,120,${(1 - u) * (1 - u)})`; g.lineWidth = 3 * (1 - u) + 1; g.beginPath(); g.arc(r.x, r.y, 6 + r.r * easeOut(u), 0, 6.283); g.stroke(); g.globalCompositeOperation = 'source-over'; }
      if (arrived && t - tArrive > 1.1 && P.length < 3 && rings.length === 0) { finish(); return; }
      if (t > 9) { finish(); return; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  });
}
