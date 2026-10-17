// MOCKUP: terreno "Fortaleza de Pedra" (Capitão) — uma muralha com torres e portão é construída tijolo a tijolo no seu lado e desaba se o terreno cai
(() => {
  const W = innerWidth, H = innerHeight, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:none'; document.body.appendChild(cv);
  const cx = cv.getContext('2d'), root = document.getElementById('root');
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), easeOut = x => 1 - Math.pow(1 - x, 3), back = x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let T0 = null, E = null; window.__muralhaStart = () => { T0 = performance.now(); E = null; }; window.__muralhaEnd = () => { E = performance.now(); };
  const yB = 727, BH = 8, TW = 30, GX0 = 150, GX1 = 240;
  const bricks = [];
  const add = (x, y, w, h, appear, kind, row) => bricks.push({ x, y, w, h, appear, kind, row, s: rnd(), vx: (rnd() - .5) * 110, vy: -rnd() * 90, vr: (rnd() - .5) * 7, d: rnd() * 380 });
  function span(xA, xB, rows, bw, y0, kind, ap, skip) {
    for (let r = 0; r < rows; r++) for (let x = xA - (r % 2 ? bw / 2 : 0); x < xB - .5; x += bw) {
      const x1 = Math.max(x, xA), x2 = Math.min(x + bw, xB); if (x2 - x1 < 3) continue; const y = y0 - (r + 1) * BH;
      if (skip && skip(x1, x2, y)) continue; add(x1, y, x2 - x1, BH, ap((x1 + x2) / 2, r), kind, r);
    }
  }
  function merlons(xA, xB, y, step, w, ap, kind) { for (let x = xA + 1; x + w <= xB + 1; x += step) add(x, y - 6, w, 6, ap(x + w / 2), kind || 'm', 9); }
  const tower = (x0, delay) => { span(x0, x0 + TW, 6, TW / 3, yB, 't', (cxm, r) => delay + r * 85 + (cxm - x0) * 1.4); add(x0 - 2, yB - 52, TW + 4, 4, delay + 6 * 85 + 30, 'l', 8); for (let k = 0; k < 4; k++) add(x0 - 1 + k * 9.3, yB - 58, 6.6, 6, delay + 7 * 85 + k * 25, 'm', 9); };
  tower(6, 150); tower(354, 380);
  span(36, GX0, 3, 11, yB, 'w', (cxm, r) => 950 + ((cxm - 36) / 11) * 40 + r * 36);
  span(GX1, 354, 3, 11, yB, 'w', (cxm, r) => 1150 + ((354 - cxm) / 11) * 40 + r * 36);
  merlons(36, GX0, yB - 24, 16, 9, cxm => 1250 + ((cxm - 36) / 11) * 40);
  merlons(GX1, 354, yB - 24, 16, 9, cxm => 1450 + ((354 - cxm) / 11) * 40);
  span(GX0, GX1, 5, 12.9, yB, 'g', (cxm, r) => 1800 + r * 90 + Math.abs(cxm - 195) * 1.1, (x1, x2, y) => x2 > 182 && x1 < 208 && y > yB - 25);
  add(GX0 - 2, yB - 44, GX1 - GX0 + 4, 4, 2300, 'l', 8); merlons(GX0, GX1, yB - 44, 15, 9, () => 2380 + rnd() * 80);
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  function brick(c, b, x, y, w, h) {
    const lum = 78 + b.s * 22, warm = b.kind === 'g' ? 4 : 0; const g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, `rgb(${lum + 26 + warm},${lum + 20},${lum + 6})`); g.addColorStop(1, `rgb(${lum - 18 + warm},${lum - 22},${lum - 32})`);
    c.fillStyle = g; c.fillRect(x, y, w, h);
    c.fillStyle = 'rgba(255,236,190,.2)'; c.fillRect(x, y, w, 1.3); c.fillStyle = 'rgba(0,0,0,.42)'; c.fillRect(x, y + h - 1.2, w, 1.2); c.fillRect(x + w - 1, y, 1, h); c.fillStyle = 'rgba(255,230,190,.1)'; c.fillRect(x, y, 1, h);
  }
  function flame(c, x, y, t, k) { const f = .75 + .25 * Math.sin(t / 90 + k * 3) + .1 * Math.sin(t / 37 + k); const h = 11 * f; c.save(); c.globalCompositeOperation = 'lighter';
    let g = c.createRadialGradient(x, y - 3, 0, x, y - 3, 46); g.addColorStop(0, `rgba(255,170,70,${.2 * f})`); g.addColorStop(1, 'rgba(255,150,50,0)'); c.fillStyle = g; c.fillRect(x - 46, y - 49, 92, 92);
    g = c.createRadialGradient(x, y - h * .4, 0, x, y - h * .4, h); g.addColorStop(0, 'rgba(255,248,205,.95)'); g.addColorStop(.4, 'rgba(255,190,80,.75)'); g.addColorStop(1, 'rgba(230,90,20,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y - h * .45, 4.2, h, 0, 0, 7); c.fill(); c.restore(); }
  function pennant(c, x, y, t, un, k) { if (un <= 0) return; c.save(); c.strokeStyle = '#3b2d1b'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 20); c.stroke(); const L = 20 * un; c.beginPath(); c.moveTo(x, y - 20); for (let i = 0; i <= 8; i++) { const u = i / 8; c.lineTo(x + u * L, y - 20 + 2.5 + Math.sin(t / 220 - u * 3 + k) * 2 * u); } c.lineTo(x, y - 10); c.closePath(); const g = c.createLinearGradient(x, 0, x + L, 0); g.addColorStop(0, '#4a78c4'); g.addColorStop(1, '#223f7a'); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(240,205,110,.85)'; c.lineWidth = 1; c.stroke(); c.restore(); }
  function hangBanner(c, x, y, t, un, k) { if (un <= 0) return; const sw = Math.sin(t / 700 + k) * 1.6, h = 22 * easeOut(un); c.save(); c.translate(x, y); c.fillStyle = '#6b5a2a'; c.fillRect(-9, -1, 18, 2.4); c.beginPath(); c.moveTo(-7, 1); c.lineTo(7, 1); c.lineTo(7 + sw * .4, h); c.lineTo(sw * .8, h - 5); c.lineTo(-7 + sw * .4, h); c.closePath(); const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3f6ab8'); g.addColorStop(1, '#1f3a74'); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(240,205,110,.9)'; c.lineWidth = 1; c.stroke(); if (h > 14) { c.fillStyle = 'rgba(245,215,120,.95)'; c.beginPath(); c.arc(sw * .3, 11, 2.6, 0, 7); c.fill(); } c.restore(); }
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
      cx.save(); cx.globalAlpha = a; if (rot) { cx.translate(x + b.w / 2, y + b.h / 2); cx.rotate(rot); brick(cx, b, -b.w / 2, -b.h / 2, b.w, b.h); } else brick(cx, b, x, y, b.w, b.h); cx.restore();
    };
    const order = { w: 0, g: 1, l: 2, m: 2, t: 3 }; const sorted = bricks.slice().sort((a, b2) => order[a.kind] - order[b2.kind]); for (const b of sorted) drawB(b);
    // arco do portão + grade
    if (te < 0) { const ap = clamp((t - 2150) / 400); if (ap > 0) { cx.save(); cx.globalAlpha = ap; const ax = 182, aw = 26, ay = yB - 24; const g = cx.createLinearGradient(0, ay, 0, yB); g.addColorStop(0, '#0e0a07'); g.addColorStop(1, '#241a10'); cx.fillStyle = g; cx.beginPath(); cx.moveTo(ax, yB); cx.lineTo(ax, ay + 10); cx.arc(ax + aw / 2, ay + 10, aw / 2, Math.PI, 0); cx.lineTo(ax + aw, yB); cx.closePath(); cx.fill(); const gp = clamp((t - 2600) / 900), gh = 24 * easeOut(gp); cx.beginPath(); cx.rect(ax + 1, ay - 3, aw - 2, gh + 3); cx.clip(); cx.strokeStyle = '#6f5a36'; cx.lineWidth = 1.6; for (let i = 0; i < 6; i++) { cx.beginPath(); cx.moveTo(ax + 3 + i * 4, ay - 3); cx.lineTo(ax + 3 + i * 4, ay + gh); cx.stroke(); } for (let j = 0; j < 3; j++) { cx.beginPath(); cx.moveTo(ax, ay + 5 + j * 8); cx.lineTo(ax + aw, ay + 5 + j * 8); cx.stroke(); } cx.restore(); } }
    // bandeiras, flâmulas e tochas (somem quando desaba)
    if (te < 0) { hangBanner(cx, 163, yB - 40, now, clamp((t - 2700) / 700), 0); hangBanner(cx, 227, yB - 40, now, clamp((t - 2850) / 700), 2); pennant(cx, 6 + TW / 2, yB - 58, now, easeOut(clamp((t - 2300) / 800)), 0); pennant(cx, 354 + TW / 2, yB - 58, now, easeOut(clamp((t - 2500) / 800)), 1.7);
      const fl = clamp((t - 2400) / 500); if (fl > 0) { cx.save(); cx.globalAlpha = fl; flame(cx, GX0 + 5, yB - 46, now, 1); flame(cx, GX1 - 5, yB - 46, now, 2); cx.restore(); } }
    // poeira onde as peças assentam
    for (const b of bricks) { if (b.row !== 0 || b.kind === 'm') continue; const q = (t - b.appear - 240) / 950; if (q > 0 && q < 1) { const a = .26 * (1 - q); const g = cx.createRadialGradient(b.x + b.w / 2, yB - 3 - q * 9, 0, b.x + b.w / 2, yB - 3 - q * 9, 5 + q * 17); g.addColorStop(0, `rgba(190,176,150,${a})`); g.addColorStop(1, 'rgba(190,176,150,0)'); cx.fillStyle = g; cx.fillRect(b.x - 24, yB - 40, b.w + 48, 52); } }
    if (te >= 0) for (let i = 0; i < 14; i++) { const q = te / 1700, xx = 12 + i * 27 + Math.sin(i * 5) * 8, a = .3 * Math.sin(clamp(q) * Math.PI) * (1 - q * .4); const g = cx.createRadialGradient(xx, yB - 10 - q * 24, 0, xx, yB - 10 - q * 24, 20 + q * 14); g.addColorStop(0, `rgba(170,156,132,${a})`); g.addColorStop(1, 'rgba(170,156,132,0)'); cx.fillStyle = g; cx.fillRect(xx - 36, yB - 70, 72, 90); }
    // aura de aço na carta do terreno
    const s = document.getElementById('player-11'); if (s && te < 0) { const r = s.getBoundingClientRect(), a = clamp((t - 300) / 700); cx.save(); cx.shadowColor = 'rgba(190,205,235,.9)'; cx.shadowBlur = 8 + 3 * Math.sin(t / 1100); cx.strokeStyle = `rgba(205,218,240,${a * (.3 + .08 * Math.sin(t / 1100))})`; cx.lineWidth = 1.6; rr(cx, r.x - 3, r.y - 3, r.width + 6, r.height + 6, 8); cx.stroke(); cx.restore(); }
  }
  requestAnimationFrame(frame);
})();
