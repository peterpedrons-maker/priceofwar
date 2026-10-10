// MOCKUP v4: terreno Fortaleza de Pedra (Capitão) com ARTE PINTADA (torres, muros e portão gerados por IA, em /art/*.png),
// iluminação noturna por código e animação: sobe do chão peça por peça, tochas, bandeiras, reação ao proteger (__muralhaHit) e desabamento.
(() => {
  const W = innerWidth, H = innerHeight, DPR = Math.min(3, window.devicePixelRatio || 1), cv = document.createElement('canvas');
  cv.width = W * DPR; cv.height = H * DPR; cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:none'; document.body.appendChild(cv);
  const root = document.getElementById('root'), mkc = () => { const c = document.createElement('canvas'); c.width = W * DPR; c.height = H * DPR; return c; };
  const mc = cv.getContext('2d'), scn = mkc(), lgt = mkc(), sc = scn.getContext('2d'), lc = lgt.getContext('2d'); for (const c of [mc, sc, lc]) c.imageSmoothingQuality = 'high';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), easeOut = x => 1 - Math.pow(1 - x, 3), back = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  let T0 = null, E = null, HIT = null; window.__muralhaHit = () => { HIT = performance.now(); }; window.__muralhaStart = () => { T0 = performance.now(); E = null; }; window.__muralhaEnd = () => { E = performance.now(); };
  // ── imagens ──
  const IMG = {}; const NAMES = 'torre muro_a muro_b portao'.split(' ');
  NAMES.forEach(n => { const i = new Image(); i.src = '/art/' + n + '.png'; IMG[n] = i; }); const pedra = new Image(); pedra.src = '/pedra.jpg';
  const ready = () => NAMES.every(n => IMG[n].complete && IMG[n].naturalWidth) && pedra.complete;
  // desenha a peça ancorada no meio da base: h = altura final em px, q = quanto já "subiu" (0..1)
  function spr(c, n, x, yb, h, o = {}) { const im = IMG[n]; if (!im.naturalWidth) return; const w = h * im.naturalWidth / im.naturalHeight, flip = o.flip ? -1 : 1, a = o.a == null ? 1 : o.a; if (a <= 0) return;
    c.save(); c.globalAlpha = a; c.translate(x, yb + (o.dy || 0)); if (o.rot) c.rotate(o.rot); c.scale(flip * (o.sx || 1), o.sy || 1);
    if (o.rise != null && o.rise < 1) { c.beginPath(); c.rect(-w / 2 - 4, -h - 6, w + 8, h * 1.1 * clamp(o.rise)); c.clip(); c.translate(0, h * (1 - clamp(o.rise)) * 0.0); }
    c.drawImage(im, -w / 2, -h, w, h); c.restore(); return { w, h }; }
  function shadow(c, x, y, w, a = .4) { c.save(); c.globalAlpha = a; const g = c.createRadialGradient(x, y, 0, x, y, w); g.addColorStop(0, 'rgba(0,0,0,.8)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.translate(0, 0); c.scale(1, .16); c.fillStyle = g; c.beginPath(); c.arc(x, y / .16, w, 0, 7); c.fill(); c.restore(); }
  function dust(c, x, y, q, k = 1) { if (q <= 0 || q >= 1) return; const g = c.createRadialGradient(x, y - q * 8, 0, x, y - q * 8, (6 + q * 16) * k); g.addColorStop(0, `rgba(190,170,130,${.3 * (1 - q)})`); g.addColorStop(1, 'rgba(190,170,130,0)'); c.fillStyle = g; c.fillRect(x - 30 * k, y - 40, 60 * k, 56); }
  function glow(c, x, y, r, col, a) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore(); }
  function flame(c, x, y, t, k, S) { c.save(); c.globalCompositeOperation = 'lighter';
    let g = c.createRadialGradient(x, y - 4, 0, x, y - 4, 70 * S); g.addColorStop(0, `rgba(255,170,70,${.2 * S})`); g.addColorStop(1, 'rgba(255,150,50,0)'); c.fillStyle = g; c.fillRect(x - 80, y - 80, 160, 130);
    const tongues = [[-5, 9, 1.0, 0], [0, 15, 1.35, 1.3], [5.5, 10, 1.05, 2.4], [-2.5, 12, 1.2, 3.6], [2.5, 7, .9, 4.9]];
    for (const [dx, hh, wd, ph] of tongues) { const f = (.8 + .2 * Math.sin(t / 85 + ph * 2 + k) + .1 * Math.sin(t / 37 + ph)) * S, h = hh * f, sway = Math.sin(t / 150 + ph * 1.7) * 1.8 * S, bx = x + dx * S, by = y + 1;
      const gr = c.createLinearGradient(bx, by, bx, by - h); gr.addColorStop(0, 'rgba(255,236,170,.95)'); gr.addColorStop(.35, 'rgba(255,170,60,.85)'); gr.addColorStop(1, 'rgba(220,70,15,0)'); c.fillStyle = gr;
      c.beginPath(); c.moveTo(bx - 3.4 * wd * S, by); c.quadraticCurveTo(bx - 3.2 * wd * S + sway * .3, by - h * .55, bx + sway, by - h); c.quadraticCurveTo(bx + 3.2 * wd * S + sway * .3, by - h * .55, bx + 3.4 * wd * S, by); c.closePath(); c.fill(); }
    g = c.createRadialGradient(x, y - 2, 0, x, y - 2, 7 * S); g.addColorStop(0, 'rgba(255,250,215,.9)'); g.addColorStop(1, 'rgba(255,190,80,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y - 2, 6 * S, 3.4 * S, 0, 0, 7); c.fill(); c.restore(); }
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const yB = 727, GX = 196;
  // peças: torres nos cantos, muros que sobem a partir delas até o portão do meio
  const items = [
    { n: 'muro_b', x: 74, h: 38, ap: 950, yb: yB, kind: 'wall' }, { n: 'muro_a', x: 122, h: 38, ap: 1100, yb: yB, kind: 'wall' }, { n: 'muro_b', x: 160, h: 38, ap: 1250, yb: yB, kind: 'wall' },
    { n: 'muro_b', x: 318, h: 38, ap: 1100, yb: yB, kind: 'wall', flip: true }, { n: 'muro_a', x: 270, h: 38, ap: 1250, yb: yB, kind: 'wall', flip: true }, { n: 'muro_b', x: 232, h: 38, ap: 1400, yb: yB, kind: 'wall', flip: true },
    { n: 'torre', x: 22, h: 80, ap: 150, yb: yB + 1, kind: 'tower', tip: 1 }, { n: 'torre', x: 368, h: 80, ap: 380, yb: yB + 1, kind: 'tower', flip: true, tip: 1 },
    { n: 'portao', x: GX, h: 63, ap: 1800, yb: yB + 1, kind: 'gate' },
  ];
  const sides = [{ x: 0, ap: 1100 }, { x: 380, ap: 1250 }];
  const vel = items.map(() => ({ vx: (Math.random() - .5) * 70, vy: -Math.random() * 60, vr: (Math.random() - .5) * 2.4, d: Math.random() * .35 }));
  const sideChunks = []; for (let k = 0; k < 2; k++) for (let y = yB - 14; y > 436; y -= 14) sideChunks.push({ x: sides[k].x, y, ap: sides[k].ap + (yB - y) * 2.1, k, v: { vx: (Math.random() - .5) * 80, vy: -Math.random() * 60, d: Math.random() * .4 } });
  function pedraPat() { if (!window.__pp) { const p = sc.createPattern(pedra, 'repeat'); p.setTransform(new DOMMatrix().scale(.12)); window.__pp = p; } return window.__pp; }
  function pennant(c, x, y, t, un, k) { if (un <= 0) return; c.save(); c.strokeStyle = '#3b2d1b'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 13); c.stroke(); const L = 16 * un; c.beginPath(); c.moveTo(x, y - 13); for (let i = 0; i <= 8; i++) { const u = i / 8; c.lineTo(x + u * L, y - 13 + 1.8 + Math.sin(t / 220 - u * 3 + k) * 1.7 * u); } c.lineTo(x, y - 6); c.closePath(); const g = c.createLinearGradient(x, 0, x + L, 0); g.addColorStop(0, '#6f93d6'); g.addColorStop(1, '#2a4a8c'); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(230,195,100,.85)'; c.lineWidth = .7; c.stroke(); c.restore(); }
  function torch(c, x, y, t, k, S) { c.save(); c.strokeStyle = '#2a1c0e'; c.lineWidth = 1.8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y + 9); c.lineTo(x, y - 1); c.stroke(); c.fillStyle = '#3a3a3e'; c.beginPath(); c.moveTo(x - 3.2, y - 2); c.lineTo(x + 3.2, y - 2); c.lineTo(x + 2, y + 2); c.lineTo(x - 2, y + 2); c.closePath(); c.fill(); c.restore(); flame(c, x, y - 2, t, k, S); }
  function frame(now) {
    requestAnimationFrame(frame); for (const c of [mc, sc, lc]) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.setTransform(DPR, 0, 0, DPR, 0, 0); }
    if (T0 == null || !ready()) { root && (root.style.transform = ''); return; }
    const t = now - T0, te = E ? now - E : -1; if (te > 2400) { root && (root.style.transform = ''); return; }
    const dead = te >= 0, td = dead ? te / 1000 : 0;
    let sh = 0; for (const ts of [330, 640, 1500, 2100, 2500]) { const d = t - ts; if (d > 0 && d < 380) sh = Math.max(sh, (1 - d / 380) * 1.5); } if (dead && te < 500) sh = Math.max(sh, (1 - te / 500) * 2.2);
    if (root) root.style.transform = sh > .05 ? `translate(${(Math.sin(now / 17) * sh).toFixed(2)}px,${(Math.cos(now / 23) * sh).toFixed(2)}px)` : '';
    // ───────── CENA ─────────
    const gi = clamp((t - 200) / 1200) * (dead ? clamp(1 - te / 1500) : 1); if (gi > 0) { const g = sc.createLinearGradient(0, yB - 2, 0, yB + 14); g.addColorStop(0, `rgba(0,0,0,${.6 * gi})`); g.addColorStop(1, 'rgba(0,0,0,0)'); sc.fillStyle = g; sc.fillRect(0, yB - 2, W, 16); }
    // muralhas laterais finas (textura de pedra), em pedaços
    for (const ch of sideChunks) { let q = clamp((t - ch.ap) / 300), x = ch.x, y = ch.y, a = 1, rot = 0; if (dead) { const qq = Math.max(0, td - ch.v.d); a = clamp(1 - (qq - .1) / 1.1); if (a <= 0) continue; x += ch.v.vx * qq * .5; y += ch.v.vy * qq + 300 * qq * qq; rot = qq * 1.2; } else { if (q <= 0) continue; y -= (1 - back(q)) * 24; a = clamp(q * 1.6); }
      sc.save(); sc.globalAlpha = a; sc.translate(x + 5, y + 7); sc.rotate(rot); sc.translate(-5, -7); sc.beginPath(); sc.rect(0, 0, 10, 14); sc.clip(); sc.fillStyle = pedraPat(); sc.fillRect(0, 0, 10, 14); sc.fillStyle = 'rgba(0,0,0,.25)'; sc.fillRect(0, 0, 10, 14); sc.fillStyle = 'rgba(255,238,200,.28)'; sc.fillRect(0, 0, 10, 1.2); sc.fillStyle = 'rgba(0,0,0,.55)'; sc.fillRect(0, 12.4, 10, 1.6); sc.restore(); }
    const order = { wall: 0, gate: 1, tower: 2 }, list = items.map((it, i) => [it, i]).sort((A, B) => order[A[0].kind] - order[B[0].kind]);
    for (const [it, i] of list) { let o = { flip: it.flip }; const pr = clamp((t - it.ap) / (it.kind === 'wall' ? 450 : it.kind === 'gate' ? 800 : 800));
      if (!dead) { if (pr <= 0) continue; o.rise = easeOut(pr); o.dy = (1 - easeOut(pr)) * 3; o.a = clamp(pr * 4); }
      else { const v = vel[i], q = Math.max(0, td - v.d - (it.kind === 'tower' ? 0 : .05)), a = clamp(1 - (q - .1) / 1.1); if (a <= 0) continue; o.dy = 330 * q * q - 30 * q; o.rot = v.vr * q * (it.kind === 'wall' ? 1 : .35) * (it.flip ? -1 : 1); o.a = a; it.dx = v.vx * q * .5; }
      spr(sc, it.n, it.x + (dead ? (it.dx || 0) : 0), it.yb, it.h, o); }
    if (!dead) for (const [it] of list) dust(sc, it.x, yB + 1, (t - it.ap - 200) / 1000, it.kind === 'tower' ? 2.2 : 1.5);
    // bandeiras/flâmulas nas pontas dos telhados
    if (!dead) for (const it of items) if (it.tip) { const q = clamp((t - it.ap - 1100) / 700); pennant(sc, it.x, yB - it.h + 3, now, easeOut(q), it.x); }
    // ───────── LUZ ─────────
    sc.save(); sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-atop'; sc.fillStyle = 'rgba(14,16,30,.36)'; sc.fillRect(0, 0, cv.width, cv.height); sc.restore();
    lc.save(); lc.setTransform(1, 0, 0, 1, 0, 0); lc.drawImage(scn, 0, 0); lc.restore(); lc.globalCompositeOperation = 'source-in';
    const L = (x, y, r, rgb, a) => { const g = lc.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(.5, `rgba(${rgb},${a * .45})`); g.addColorStop(1, `rgba(${rgb},0)`); lc.fillStyle = g; lc.fillRect(x - r, y - r, r * 2, r * 2); };
    const tl = dead ? 0 : clamp((t - 2600) / 500) * (.88 + .08 * Math.sin(now / 95) + .05 * Math.sin(now / 41));
    const torches = [[66, yB - 17], [326, yB - 17], [GX - 30, yB - 21], [GX + 30, yB - 21]];
    if (tl > 0) for (const [x, y] of torches) L(x, y, 46, '255,160,70', .95 * tl);
    if (!dead) { const wl = clamp((t - 2000) / 700); if (wl > 0) for (const x of [22, 368]) { L(x, yB - 50, 30, '255,180,90', .55 * wl * (.9 + .1 * Math.sin(now / 130 + x))); } }
    lc.globalCompositeOperation = 'source-over';
    // ───────── composição ─────────
    mc.save(); mc.setTransform(1, 0, 0, 1, 0, 0); mc.drawImage(scn, 0, 0); mc.globalCompositeOperation = 'lighter'; mc.drawImage(lgt, 0, 0); mc.filter = `blur(${4 * DPR}px)`; mc.globalAlpha = .45; mc.drawImage(lgt, 0, 0); mc.restore();
    // ───────── efeitos por cima ─────────
    if (tl > 0) for (const [x, y] of torches) torch(mc, x, y, now, x, tl * .85);
    // brilho que varre a pedra quando fica pronta
    { const q = clamp((t - 3000) / 1100); if (q > 0 && q < 1 && !dead) { mc.save(); mc.beginPath(); mc.rect(0, yB - 84, W, 88); mc.clip(); mc.globalCompositeOperation = 'lighter'; const x = -60 + q * (W + 120), g = mc.createLinearGradient(x - 50, 0, x + 50, 0); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, `rgba(255,240,200,${.28 * Math.sin(q * Math.PI)})`); g.addColorStop(1, 'rgba(255,240,200,0)'); mc.fillStyle = g; mc.fillRect(x - 50, yB - 84, 100, 88); mc.restore(); } }
    // reação quando o terreno protege (-1 de dano)
    if (HIT && !dead) { const q = (now - HIT) / 1000; if (q >= 0 && q < 1) { mc.save(); mc.globalCompositeOperation = 'lighter'; for (const [x0, x1] of [[40, 165], [352, 227]]) { const x = x0 + (x1 - x0) * easeOut(q), a = .6 * Math.sin(q * Math.PI); const g = mc.createRadialGradient(x, yB - 16, 0, x, yB - 16, 50); g.addColorStop(0, `rgba(190,220,255,${a})`); g.addColorStop(1, 'rgba(160,200,255,0)'); mc.fillStyle = g; mc.fillRect(x - 50, yB - 50, 100, 50); } mc.restore(); for (let i = 0; i < 7; i++) dust(mc, 52 + i * 48, yB - 2, q * 1.1 - i * .03, 1); } }
    if (dead && te < 1700) for (let i = 0; i < 14; i++) { const q = te / 1700, xx = 12 + i * 27 + Math.sin(i * 5) * 8, a = .3 * Math.sin(clamp(q) * Math.PI) * (1 - q * .4); const g = mc.createRadialGradient(xx, yB - 10 - q * 24, 0, xx, yB - 10 - q * 24, 20 + q * 14); g.addColorStop(0, `rgba(170,156,132,${a})`); g.addColorStop(1, 'rgba(170,156,132,0)'); mc.fillStyle = g; mc.fillRect(xx - 36, yB - 70, 72, 90); }
    const s = document.getElementById('player-11'); if (s && !dead) { const r = s.getBoundingClientRect(), a = clamp((t - 300) / 700); mc.save(); mc.shadowColor = 'rgba(190,205,235,.9)'; mc.shadowBlur = 8 + 3 * Math.sin(t / 1100); mc.strokeStyle = `rgba(205,218,240,${a * (.3 + .08 * Math.sin(t / 1100))})`; mc.lineWidth = 1.6; rr(mc, r.x - 3, r.y - 3, r.width + 6, r.height + 6, 8); mc.stroke(); mc.restore(); }
  }
  requestAnimationFrame(frame);
})();
