// MOCKUP: terreno "Fortaleza de Pedra" (Capitão) — uma muralha com torres e portão é construída tijolo a tijolo no seu lado e desaba se o terreno cai
(() => {
  const W = innerWidth, H = innerHeight, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:none'; document.body.appendChild(cv);
  const cx = cv.getContext('2d'), root = document.getElementById('root');
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), easeOut = x => 1 - Math.pow(1 - x, 3), back = x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let T0 = null, E = null, HIT = null; window.__muralhaHit = () => { HIT = performance.now(); }; window.__muralhaStart = () => { T0 = performance.now(); E = null; }; window.__muralhaEnd = () => { E = performance.now(); };
  const yB = 727, TW = 30, GX0 = 150, GX1 = 240, MODE = window.__muralhaMode || 'u';
  const bricks = [];
  let pat = null; const img = new Image(); img.onload = () => { const o = document.createElement('canvas'); o.width = o.height = 512; const oc = o.getContext('2d'); oc.filter = 'brightness(1.75) contrast(1.08) saturate(1.15)'; oc.drawImage(img, 0, 0, 512, 512); pat = cx.createPattern(o, 'repeat'); pat.setTransform(new DOMMatrix().scale(.25)); }; img.src = '/pedra.jpg';
  const add = (x, y, w, h, appear, kind, row) => bricks.push({ x, y, w, h, appear, kind, row, s: rnd(), vx: (rnd() - .5) * 110, vy: -rnd() * 90, vr: (rnd() - .5) * 7, d: rnd() * 380 });
  // um retângulo de muralha vira pedaços (CW x CH) que sobem em ordem; `ap` dá o instante de cada um
  function block(x0, y0, w, h, cw, ch, kind, ap) {
    const nx = Math.max(1, Math.round(w / cw)), ny = Math.max(1, Math.round(h / ch)), pw = w / nx, ph = h / ny;
    for (let r = 0; r < ny; r++) for (let c = 0; c < nx; c++) { const y = y0 + h - (r + 1) * ph, x = x0 + c * pw; add(x, y, pw, ph, ap(x + pw / 2, y + ph / 2, r, c), kind, r); }
  }
  const tower = (x0, delay, h) => { block(x0, yB - h, TW, h, 10, 9, 't', (cx0, cy0, r) => delay + r * 80 + Math.abs(cx0 - x0 - TW / 2) * 1.4); block(x0 - 3, yB - h - 5, TW + 6, 5, 11, 5, 'l', () => delay + (h / 9) * 80 + 60); for (let k = 0; k < 4; k++) add(x0 - 1 + k * 9.3, yB - h - 11, 6.6, 6, delay + (h / 9) * 80 + 120 + k * 25, 'm', 9); };
  tower(6, 150, 52); tower(354, 380, 52);
  block(36, yB - 24, GX0 - 36, 24, 13, 8, 'w', (cx0, cy0, r) => 950 + ((cx0 - 36) / 13) * 46 + r * 36);
  block(GX1, yB - 24, 354 - GX1, 24, 13, 8, 'w', (cx0, cy0, r) => 1150 + ((354 - cx0) / 13) * 46 + r * 36);
  for (let x = 38; x + 9 <= GX0; x += 16) add(x, yB - 30, 9, 6, 1300 + (x - 36) * 3.4, 'm', 9);
  for (let x = GX1 + 2; x + 9 <= 354; x += 16) add(x, yB - 30, 9, 6, 1500 + (354 - x) * 3.4, 'm', 9);
  // portão: bloco central com abertura do arco
  block(GX0, yB - 40, 32, 40, 11, 8, 'g', (cx0, cy0, r) => 1800 + r * 90 + Math.abs(cx0 - 195) * 1.1); block(GX1 - 32, yB - 40, 32, 40, 11, 8, 'g', (cx0, cy0, r) => 1800 + r * 90 + Math.abs(cx0 - 195) * 1.1);
  block(GX0 + 32, yB - 40, GX1 - GX0 - 64, 14, 13, 7, 'g', (cx0, cy0, r) => 1980 + Math.abs(cx0 - 195) * 1.1 + r * 60);
  block(GX0 - 2, yB - 44, GX1 - GX0 + 4, 4, 12, 4, 'l', () => 2300); for (let x = GX0 + 1; x + 9 <= GX1; x += 15) add(x, yB - 50, 9, 6, 2380 + rnd() * 80, 'm', 9);
  // muralhas laterais (finas) e torrinhas da frente
  const wallSide = (x0, delay) => block(x0, 436, 10, yB - 436, 10, 15, 's', (cx0, cy0, r) => delay + (yB - cy0) * 2.1);
  wallSide(0, 1100); wallSide(380, 1250);
  const endTower = (x0, delay) => { block(x0, 412, 22, 26, 11, 9, 't', (cx0, cy0, r) => delay + r * 70); for (let k = 0; k < 3; k++) add(x0 + 1 + k * 7.6, 406, 5, 6, delay + 320 + k * 25, 'm', 9); };
  endTower(0, 1700); endTower(368, 1800);
  if (MODE === 'quad') { block(22, 427, 346, 8, 14, 8, 's', (cx0) => 2000 + Math.abs(cx0 - 195) * 2.4); for (let x = 26; x + 6 <= 366; x += 15) add(x, 423, 6, 4, 2450 + Math.abs(x - 195) * 1.6, 'm', 9); }
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  function brick(c, b, x, y, w, h, rot, alpha) {
    if (!pat) return; c.save(); c.globalAlpha = alpha;
    const cx0 = b.x + b.w / 2, cy0 = b.y + b.h / 2; c.translate(x + b.w / 2, y + b.h / 2); if (rot) c.rotate(rot); c.translate(-cx0, -cy0);
    c.beginPath(); c.rect(b.x, b.y, b.w, b.h); c.clip(); c.fillStyle = pat; c.fillRect(b.x, b.y, b.w, b.h);
    c.fillStyle = `rgba(0,0,0,${.1 + b.s * .2})`; c.fillRect(b.x, b.y, b.w, b.h);
    c.fillStyle = 'rgba(255,238,200,.3)'; c.fillRect(b.x, b.y, b.w, 1.4); c.fillStyle = 'rgba(255,238,200,.14)'; c.fillRect(b.x, b.y, 1.2, b.h);
    c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(b.x, b.y + b.h - 1.6, b.w, 1.6); c.fillRect(b.x + b.w - 1.2, b.y, 1.2, b.h); c.restore();
  }
  function flame(c, x, y, t, k) { const f = .75 + .25 * Math.sin(t / 90 + k * 3) + .1 * Math.sin(t / 37 + k); const h = 11 * f; c.save(); c.globalCompositeOperation = 'lighter';
    let g = c.createRadialGradient(x, y - 3, 0, x, y - 3, 46); g.addColorStop(0, `rgba(255,170,70,${.2 * f})`); g.addColorStop(1, 'rgba(255,150,50,0)'); c.fillStyle = g; c.fillRect(x - 46, y - 49, 92, 92);
    g = c.createRadialGradient(x, y - h * .4, 0, x, y - h * .4, h); g.addColorStop(0, 'rgba(255,248,205,.95)'); g.addColorStop(.4, 'rgba(255,190,80,.75)'); g.addColorStop(1, 'rgba(230,90,20,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y - h * .45, 4.2, h, 0, 0, 7); c.fill(); c.restore(); }
  function pennant(c, x, y, t, un, k) { if (un <= 0) return; c.save(); c.strokeStyle = '#3b2d1b'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 20); c.stroke(); const L = 20 * un; c.beginPath(); c.moveTo(x, y - 20); for (let i = 0; i <= 8; i++) { const u = i / 8; c.lineTo(x + u * L, y - 20 + 2.5 + Math.sin(t / 220 - u * 3 + k) * 2 * u); } c.lineTo(x, y - 10); c.closePath(); const g = c.createLinearGradient(x, 0, x + L, 0); g.addColorStop(0, '#4a78c4'); g.addColorStop(1, '#223f7a'); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(240,205,110,.85)'; c.lineWidth = 1; c.stroke(); c.restore(); }
  function hangBanner(c, x, y, t, un, k) { if (un <= 0) return; const sw = Math.sin(t / 700 + k) * 1.6, h = 22 * easeOut(un); c.save(); c.translate(x, y); c.fillStyle = '#6b5a2a'; c.fillRect(-9, -1, 18, 2.4); c.beginPath(); c.moveTo(-7, 1); c.lineTo(7, 1); c.lineTo(7 + sw * .4, h); c.lineTo(sw * .8, h - 5); c.lineTo(-7 + sw * .4, h); c.closePath(); const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3f6ab8'); g.addColorStop(1, '#1f3a74'); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(240,205,110,.9)'; c.lineWidth = 1; c.stroke(); if (h > 14) { c.fillStyle = 'rgba(245,215,120,.95)'; c.beginPath(); c.arc(sw * .3, 11, 2.6, 0, 7); c.fill(); } c.restore(); }
  function pennantAt(c, x, y, t, un, k) { if (un <= 0) return; c.save(); c.strokeStyle = '#3b2d1b'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 14); c.stroke(); const L = 17 * un; c.beginPath(); c.moveTo(x, y - 14); for (let i = 0; i <= 8; i++) { const u = i / 8; c.lineTo(x + u * L, y - 14 + 2 + Math.sin(t / 220 - u * 3 + k) * 1.8 * u); } c.lineTo(x, y - 6); c.closePath(); const g = c.createLinearGradient(x, 0, x + L, 0); g.addColorStop(0, '#e8c25a'); g.addColorStop(1, '#a9791d'); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(60,35,5,.8)'; c.lineWidth = .8; c.stroke(); c.restore(); }
  function sentry(c, x, y, d, now) { const bob = Math.abs(Math.sin(now / 150 + x)) * .9; c.save(); c.translate(x, y - bob); c.scale(d, 1);
    c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(0, bob, 4, 1.2, 0, 0, 7); c.fill();
    c.strokeStyle = '#d5d9e0'; c.lineWidth = .9; c.beginPath(); c.moveTo(3.5, 1); c.lineTo(3.5, -17); c.stroke(); c.fillStyle = '#f2f5fa'; c.beginPath(); c.moveTo(3.5, -19.5); c.lineTo(2.4, -16.5); c.lineTo(4.6, -16.5); c.closePath(); c.fill();
    c.fillStyle = '#1f3a74'; c.beginPath(); c.moveTo(-3.2, -4); c.lineTo(3, -4); c.lineTo(3.6, -10.5); c.lineTo(-3.6, -10.5); c.closePath(); c.fill(); c.fillStyle = '#6f757e'; c.fillRect(-2.4, -10.5, 4.8, 3.2);
    c.fillStyle = '#2a2420'; c.fillRect(-2.3, -4, 1.7, 4.2 + Math.sin(now / 150 + x) * .5); c.fillRect(.7, -4, 1.7, 4.2 - Math.sin(now / 150 + x) * .5);
    c.fillStyle = '#d6a77a'; c.beginPath(); c.arc(0, -12.4, 1.9, 0, 7); c.fill(); c.fillStyle = '#9aa1ab'; c.beginPath(); c.arc(0, -12.9, 2.3, Math.PI, 0); c.fill(); c.fillStyle = '#c93a2a'; c.fillRect(-.4, -16.4, 1.1, 2.4);
    c.fillStyle = '#e0b04a'; c.beginPath(); c.arc(-.5, -7.5, .8, 0, 7); c.fill(); c.restore(); }
  function dust(c, x, y, q, k) { if (q <= 0 || q >= 1) return; const g = c.createRadialGradient(x, y - q * 8, 0, x, y - q * 8, (5 + q * 15) * k); g.addColorStop(0, `rgba(190,176,150,${.3 * (1 - q)})`); g.addColorStop(1, 'rgba(190,176,150,0)'); c.fillStyle = g; c.fillRect(x - 30, y - 40, 60, 56); }
  function frame(now) {
    requestAnimationFrame(frame); cx.clearRect(0, 0, W, H); if (T0 == null) { root && (root.style.transform = ''); return; }
    const t = now - T0, te = E ? now - E : -1; if (te > 2000) { root && (root.style.transform = ''); return; }
    // tremor leve quando as peças assentam
    let sh = 0; for (const ts of [330, 640, 1500, 2100]) { const d = t - ts; if (d > 0 && d < 380) sh = Math.max(sh, (1 - d / 380) * 1.6); } if (te >= 0 && te < 500) sh = Math.max(sh, (1 - te / 500) * 2.2);
    if (root) root.style.transform = sh > .05 ? `translate(${(Math.sin(now / 17) * sh).toFixed(2)}px,${(Math.cos(now / 23) * sh).toFixed(2)}px)` : '';
    // sombra no chão
    const gi = clamp((t - 300) / 1400) * (te >= 0 ? clamp(1 - te / 1500) : 1); if (gi > 0) { const g = cx.createLinearGradient(0, yB - 2, 0, yB + 14); g.addColorStop(0, `rgba(0,0,0,${.55 * gi})`); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(2, yB - 2, W - 4, 16); }
    // peças
    const drawB = b => {
      let p = clamp((t - b.appear) / 300); if (p <= 0) return; let x = b.x, y = b.y, a = 1, rot = 0;
      if (te >= 0) { const q = Math.max(0, te - b.d) / 1000; if (q > 0) { x += b.vx * q; y += b.vy * q + .5 * 640 * q * q; rot = b.vr * q; a = clamp(1 - (q - .15) / 1.1); } if (a <= 0) return; }
      else { y -= (1 - back(p)) * 26; a = clamp(p * 1.6); }
      brick(cx, b, x, y, b.w, b.h, rot, a);
    };
    const order = { s: 0, w: 1, g: 2, l: 3, m: 3, t: 4 }; const sorted = bricks.slice().sort((a, b2) => order[a.kind] - order[b2.kind]); for (const b of sorted) drawB(b);
    // arco do portão + grade
    if (te < 0) { const ap = clamp((t - 2150) / 400); if (ap > 0) { cx.save(); cx.globalAlpha = ap; const ax = 182, aw = 26, ay = yB - 24; const g = cx.createLinearGradient(0, ay, 0, yB); g.addColorStop(0, '#0e0a07'); g.addColorStop(1, '#241a10'); cx.fillStyle = g; cx.beginPath(); cx.moveTo(ax, yB); cx.lineTo(ax, ay + 10); cx.arc(ax + aw / 2, ay + 10, aw / 2, Math.PI, 0); cx.lineTo(ax + aw, yB); cx.closePath(); cx.fill(); const gp = clamp((t - 2600) / 900), gh = 24 * easeOut(gp); cx.beginPath(); cx.rect(ax + 1, ay - 3, aw - 2, gh + 3); cx.clip(); cx.strokeStyle = '#6f5a36'; cx.lineWidth = 1.6; for (let i = 0; i < 6; i++) { cx.beginPath(); cx.moveTo(ax + 3 + i * 4, ay - 3); cx.lineTo(ax + 3 + i * 4, ay + gh); cx.stroke(); } for (let j = 0; j < 3; j++) { cx.beginPath(); cx.moveTo(ax, ay + 5 + j * 8); cx.lineTo(ax + aw, ay + 5 + j * 8); cx.stroke(); } cx.restore(); } }
    // bandeiras, flâmulas e tochas (somem quando desaba)
    if (te < 0) { hangBanner(cx, 163, yB - 40, now, clamp((t - 2700) / 700), 0); hangBanner(cx, 227, yB - 40, now, clamp((t - 2850) / 700), 2); 
      const fl = clamp((t - 2400) / 500); if (fl > 0) { cx.save(); cx.globalAlpha = fl; flame(cx, GX0 + 5, yB - 46, now, 1); flame(cx, GX1 - 5, yB - 46, now, 2); cx.restore(); } }

    // ───────── detalhes (só com a muralha de pé) ─────────
    const DELAYS = [150, 380], TX = [6, 354];
    const flameS = (c, x, y, tt, k, S) => { c.save(); c.translate(x, y); c.scale(S, S); flame(c, 0, 0, tt, k); c.restore(); };
    const wallDone = clamp((t - 2300) / 700);
    if (te < 0) {
      // andaimes de madeira nas torres e no portão enquanto se constrói
      const scaf = (xA, xB, hNow, fade) => { if (hNow <= 2 || fade <= 0) return; cx.save(); cx.globalAlpha = fade; cx.strokeStyle = '#8a6a3a'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(xA, yB); cx.lineTo(xA, yB - hNow); cx.moveTo(xB, yB); cx.lineTo(xB, yB - hNow); cx.stroke(); cx.lineWidth = 1.6; cx.strokeStyle = '#a58450'; cx.beginPath(); for (let y = 12; y < hNow; y += 13) { cx.moveTo(xA - 3, yB - y); cx.lineTo(xB + 3, yB - y); } cx.stroke(); cx.strokeStyle = 'rgba(70,45,20,.9)'; cx.lineWidth = 1.1; cx.beginPath(); for (let y = 0; y + 13 < hNow; y += 26) { cx.moveTo(xA, yB - y); cx.lineTo(xB, yB - y - 13); cx.moveTo(xB, yB - y - 13); cx.lineTo(xA, yB - y - 26); } cx.stroke(); cx.restore(); };
      const sf = clamp(1 - (t - 2500) / 800);
      scaf(TX[0] - 4, TX[0] + TW + 4, clamp((t - DELAYS[0]) / 760) * 64, sf); scaf(TX[1] - 4, TX[1] + TW + 4, clamp((t - DELAYS[1]) / 760) * 64, sf); scaf(GX0 - 2, GX1 + 2, clamp((t - 1800) / 700) * 52, sf);
      if (pat) {
        // talude (base mais larga) das torres
        for (let i = 0; i < 2; i++) { const a = clamp((t - DELAYS[i] - 500) / 400); if (a <= 0) continue; const x0 = TX[i]; cx.save(); cx.globalAlpha = a; cx.beginPath(); cx.moveTo(x0 - 5, yB); cx.lineTo(x0 + TW + 5, yB); cx.lineTo(x0 + TW, yB - 13); cx.lineTo(x0, yB - 13); cx.closePath(); cx.clip(); cx.fillStyle = pat; cx.fillRect(x0 - 6, yB - 14, TW + 12, 15); cx.fillStyle = 'rgba(0,0,0,.22)'; cx.fillRect(x0 - 6, yB - 14, TW + 12, 15); cx.fillStyle = 'rgba(255,238,200,.22)'; cx.fillRect(x0 - 6, yB - 14, TW + 12, 1.2); cx.restore(); }
      }
      // sombras e luz sobre a pedra (só depois de pronta)
      if (wallDone > 0) {
        for (const [xa, xb] of [[36, GX0], [GX1, 354], [GX0, GX1]]) { const g = cx.createLinearGradient(0, yB - 40, 0, yB); g.addColorStop(0, 'rgba(255,235,190,0)'); g.addColorStop(.35, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${.38 * wallDone})`); cx.fillStyle = g; cx.fillRect(xa, yB - 40, xb - xa, 40); }
        for (const [xa, xb] of [[36, GX0], [GX1, 354]]) { cx.fillStyle = `rgba(255,236,190,${.16 * wallDone})`; cx.fillRect(xa, yB - 25, xb - xa, 1.6); cx.fillStyle = `rgba(0,0,0,${.4 * wallDone})`; cx.fillRect(xa, yB - 24, xb - xa, 2.4); }
        // mata-cães sob a borda das torres e do portão
        cx.fillStyle = `rgba(10,7,3,${.7 * wallDone})`; for (const [xa, xb, y] of [[TX[0] - 2, TX[0] + TW + 2, yB - 52], [TX[1] - 2, TX[1] + TW + 2, yB - 52], [GX0, GX1, yB - 40]]) for (let x = xa + 1; x + 3 <= xb; x += 6) cx.fillRect(x, y, 3, 3.5);
        // frestas de flecha e janelas das torres
        cx.fillStyle = `rgba(8,5,2,${.9 * wallDone})`; for (const x of [TX[0] + TW / 2, TX[1] + TW / 2]) { cx.fillRect(x - 1.2, yB - 33, 2.4, 10); } for (const x of [62, 100, 306, 342]) cx.fillRect(x - 1, yB - 18, 2, 8);
        cx.strokeStyle = `rgba(255,236,190,${.2 * wallDone})`; cx.lineWidth = .8; for (const x of [TX[0] + TW / 2, TX[1] + TW / 2]) { cx.strokeRect(x - 1.8, yB - 33.5, 3.6, 11); }
        for (const x of [TX[0] + TW / 2, TX[1] + TW / 2]) { const f = .8 + .2 * Math.sin(now / 130 + x); cx.save(); cx.fillStyle = `rgba(255,190,90,${.85 * f * wallDone})`; cx.beginPath(); cx.moveTo(x - 2.6, yB - 42); cx.lineTo(x - 2.6, yB - 46); cx.arc(x, yB - 46, 2.6, Math.PI, 0); cx.lineTo(x + 2.6, yB - 42); cx.closePath(); cx.fill(); cx.globalCompositeOperation = 'lighter'; const g = cx.createRadialGradient(x, yB - 44, 0, x, yB - 44, 11); g.addColorStop(0, `rgba(255,170,70,${.28 * f * wallDone})`); g.addColorStop(1, 'rgba(255,150,50,0)'); cx.fillStyle = g; cx.fillRect(x - 11, yB - 55, 22, 22); cx.restore(); }
        // aduelas do arco do portão com a pedra-chave dourada
        { const ax = 195, ay = yB - 24 + 10, r0 = 13; cx.save(); cx.globalAlpha = wallDone; for (let i = 0; i < 9; i++) { const a0 = Math.PI + (i / 9) * Math.PI, a1 = Math.PI + ((i + .9) / 9) * Math.PI; cx.beginPath(); cx.arc(ax, ay, r0, a0, a1); cx.arc(ax, ay, r0 + 4.5, a1, a0, true); cx.closePath(); cx.fillStyle = i % 2 ? 'rgba(170,160,140,.55)' : 'rgba(120,112,98,.55)'; cx.fill(); cx.strokeStyle = 'rgba(0,0,0,.55)'; cx.lineWidth = .7; cx.stroke(); }
          cx.fillStyle = '#e0b04a'; cx.beginPath(); cx.moveTo(ax - 2.4, ay - r0 - 4.5); cx.lineTo(ax + 2.4, ay - r0 - 4.5); cx.lineTo(ax + 1.6, ay - r0 + .5); cx.lineTo(ax - 1.6, ay - r0 + .5); cx.closePath(); cx.fill(); cx.strokeStyle = '#4a2f08'; cx.lineWidth = .7; cx.stroke(); cx.restore(); }
        // tochas de parede
        const tl = clamp((t - 3000) / 500); if (tl > 0) for (const x of [78, 312]) { cx.save(); cx.globalAlpha = tl; cx.strokeStyle = '#1c1409'; cx.lineWidth = 1.6; cx.beginPath(); cx.moveTo(x, yB - 6); cx.lineTo(x, yB - 11); cx.moveTo(x - 3, yB - 11); cx.lineTo(x + 3, yB - 11); cx.stroke(); flameS(cx, x, yB - 11, now, x, .7); cx.restore(); }
      }
      // telhados cônicos azuis nas torres de canto, com ponta dourada e flâmula
      for (let i = 0; i < 2; i++) { const q = clamp((t - DELAYS[i] - 800) / 520); if (q <= 0) continue; const x0 = TX[i], mx = x0 + TW / 2, base = yB - 56, hh = 27 * Math.max(.02, back(q)), wd = TW / 2 + 5; cx.save();
        let g = cx.createLinearGradient(mx - wd, 0, mx + wd, 0); g.addColorStop(0, '#5f8fd6'); g.addColorStop(.45, '#365fa8'); g.addColorStop(1, '#1b3566'); cx.fillStyle = g; cx.beginPath(); cx.moveTo(mx - wd, base); cx.quadraticCurveTo(mx - wd * .35, base - hh * .45, mx, base - hh); cx.quadraticCurveTo(mx + wd * .35, base - hh * .45, mx + wd, base); cx.quadraticCurveTo(mx, base + 2.6, mx - wd, base); cx.fill();
        cx.strokeStyle = 'rgba(6,14,40,.7)'; cx.lineWidth = 1; cx.stroke(); cx.strokeStyle = 'rgba(190,215,255,.2)'; cx.lineWidth = .8; for (let k = 1; k < 5; k++) { const yy = base - hh * k / 5, ww = wd * (1 - k / 5) * .98; cx.beginPath(); cx.moveTo(mx - ww, yy + 1.5); cx.quadraticCurveTo(mx, yy + 3.4, mx + ww, yy + 1.5); cx.stroke(); }
        cx.fillStyle = 'rgba(255,255,255,.22)'; cx.beginPath(); cx.moveTo(mx - wd * .7, base - 1); cx.quadraticCurveTo(mx - wd * .3, base - hh * .5, mx - .6, base - hh + 2); cx.lineTo(mx - 2, base - hh * .55); cx.closePath(); cx.fill();
        if (q > .7) { cx.fillStyle = '#e0b04a'; cx.beginPath(); cx.arc(mx, base - hh - 1.2, 2.1, 0, 7); cx.fill(); cx.strokeStyle = '#4a2f08'; cx.lineWidth = .6; cx.stroke(); }
        cx.restore();
        if (q > .9) pennantAt(cx, mx, base - hh - 2, now, easeOut(clamp((t - DELAYS[i] - 1250) / 600)), i * 1.7); }
      // sentinelas patrulhando a muralha
      const sen = clamp((t - 3300) / 600); if (sen > 0) { cx.save(); cx.globalAlpha = sen; const pace = (lo, hi, sp, ph) => { const L = hi - lo, u = ((now * sp + ph) % (2 * L)); const x = u < L ? lo + u : hi - (u - L); return [x, u < L ? 1 : -1]; };
        for (const [lo, hi, sp, ph] of [[46, 142, .012, 20], [250, 346, .011, 70]]) { const [x, d] = pace(lo, hi, sp, ph); sentry(cx, x, yB - 24, d, now); }
        sentry(cx, 195 + Math.sin(now / 2500) * 14, yB - 46, Math.sin(now / 2500 + 1.57) > 0 ? 1 : -1, now); cx.restore(); }
      // brilho que varre a pedra quando fica pronta
      { const q = clamp((t - 3200) / 1100); if (q > 0 && q < 1) { cx.save(); cx.beginPath(); cx.rect(0, yB - 70, W, 74); cx.clip(); cx.globalCompositeOperation = 'lighter'; const x = -60 + q * (W + 120), g = cx.createLinearGradient(x - 50, 0, x + 50, 0); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, `rgba(255,240,200,${.34 * Math.sin(q * Math.PI)})`); g.addColorStop(1, 'rgba(255,240,200,0)'); cx.fillStyle = g; cx.fillRect(x - 50, yB - 70, 100, 74); cx.restore(); } }
      // reação quando o terreno protege (-1 de dano): a muralha brilha e solta poeira
      if (HIT) { const q = (now - HIT) / 1000; if (q >= 0 && q < 1) { cx.save(); cx.globalCompositeOperation = 'lighter'; for (const [x0, x1] of [[36, 150], [354, 240]]) { const x = x0 + (x1 - x0) * easeOut(q), a = .55 * Math.sin(q * Math.PI); const g = cx.createRadialGradient(x, yB - 14, 0, x, yB - 14, 46); g.addColorStop(0, `rgba(190,220,255,${a})`); g.addColorStop(1, 'rgba(160,200,255,0)'); cx.fillStyle = g; cx.fillRect(x - 46, yB - 40, 92, 44); } cx.restore(); for (let i = 0; i < 7; i++) dust(cx, 52 + i * 48, yB - 2, q * 1.1 - i * .03, 1); } }
    } else {
      // telhados caem junto
      for (let i = 0; i < 2; i++) { const q = Math.max(0, te - 120 * i) / 1000, a = clamp(1 - (q - .1) / 1.1); if (a <= 0) continue; const mx = TX[i] + TW / 2, base = yB - 56; cx.save(); cx.globalAlpha = a; cx.translate(mx + (i ? 30 : -30) * q, base + 300 * q * q); cx.rotate((i ? 1 : -1) * 1.4 * q); cx.fillStyle = '#365fa8'; cx.beginPath(); cx.moveTo(-20, 0); cx.lineTo(0, -27); cx.lineTo(20, 0); cx.closePath(); cx.fill(); cx.restore(); }
    }
    // poeira onde as peças assentam
    for (const b of bricks) { if (b.row !== 0 || b.kind === 'm' || b.y + b.h < yB - 1) continue; const q = (t - b.appear - 240) / 950; if (q > 0 && q < 1) { const a = .26 * (1 - q); const g = cx.createRadialGradient(b.x + b.w / 2, yB - 3 - q * 9, 0, b.x + b.w / 2, yB - 3 - q * 9, 5 + q * 17); g.addColorStop(0, `rgba(190,176,150,${a})`); g.addColorStop(1, 'rgba(190,176,150,0)'); cx.fillStyle = g; cx.fillRect(b.x - 24, yB - 40, b.w + 48, 52); } }
    if (te >= 0) for (let i = 0; i < 14; i++) { const q = te / 1700, xx = 12 + i * 27 + Math.sin(i * 5) * 8, a = .3 * Math.sin(clamp(q) * Math.PI) * (1 - q * .4); const g = cx.createRadialGradient(xx, yB - 10 - q * 24, 0, xx, yB - 10 - q * 24, 20 + q * 14); g.addColorStop(0, `rgba(170,156,132,${a})`); g.addColorStop(1, 'rgba(170,156,132,0)'); cx.fillStyle = g; cx.fillRect(xx - 36, yB - 70, 72, 90); }
    // aura de aço na carta do terreno
    const s = document.getElementById('player-11'); if (s && te < 0) { const r = s.getBoundingClientRect(), a = clamp((t - 300) / 700); cx.save(); cx.shadowColor = 'rgba(190,205,235,.9)'; cx.shadowBlur = 8 + 3 * Math.sin(t / 1100); cx.strokeStyle = `rgba(205,218,240,${a * (.3 + .08 * Math.sin(t / 1100))})`; cx.lineWidth = 1.6; rr(cx, r.x - 3, r.y - 3, r.width + 6, r.height + 6, 8); cx.stroke(); cx.restore(); }
  }
  requestAnimationFrame(frame);
})();
