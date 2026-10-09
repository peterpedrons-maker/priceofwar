// MOCKUP: terreno "Solo Sagrado" — brilho dourado permanente só no lado do jogador (canvas por cima do tabuleiro real)
(() => {
  const W = innerWidth, H = innerHeight, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:none'; document.body.appendChild(cv);
  const cx = cv.getContext('2d'), lay = document.createElement('canvas'); lay.width = W; lay.height = H; const lx = lay.getContext('2d');
  const rect = id => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 }; };
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), ease = x => 1 - Math.pow(1 - x, 3);
  let T0 = null, E = null; window.__sagradoStart = () => { T0 = performance.now(); E = null; }; window.__sagradoEnd = () => { E = performance.now(); };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const P = Array.from({ length: 46 }, () => ({ x: rnd(), y: rnd(), v: .012 + rnd() * .03, ph: rnd() * 6.28, s: .8 + rnd() * 1.9, sw: 6 + rnd() * 16 }));
  const SP = Array.from({ length: 9 }, () => ({ x: rnd(), y: rnd(), ph: rnd() * 6.28, per: 1800 + rnd() * 2200, s: 5 + rnd() * 6 }));
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const star = (c, x, y, s, a) => { c.save(); c.translate(x, y); c.globalAlpha *= a; for (const [dx, dy] of [[1, 0], [0, 1]]) { const g = c.createLinearGradient(-s * dx, -s * dy, s * dx, s * dy); g.addColorStop(0, 'rgba(255,230,160,0)'); g.addColorStop(.5, 'rgba(255,248,215,1)'); g.addColorStop(1, 'rgba(255,230,160,0)'); c.strokeStyle = g; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-s * dx, -s * dy); c.lineTo(s * dx, s * dy); c.stroke(); } const g2 = c.createRadialGradient(0, 0, 0, 0, 0, s * .6); g2.addColorStop(0, 'rgba(255,245,200,.9)'); g2.addColorStop(1, 'rgba(255,220,130,0)'); c.fillStyle = g2; c.beginPath(); c.arc(0, 0, s * .6, 0, 7); c.fill(); c.restore(); };
  function sigil(c, x, y, r, rot, a) {
    c.save(); c.translate(x, y); c.lineCap = 'round'; c.strokeStyle = `rgba(255,226,150,${a})`; c.fillStyle = `rgba(255,226,150,${a})`;
    c.lineWidth = 2.6; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
    c.lineWidth = 1.2; c.beginPath(); c.arc(0, 0, r - 9, 0, 7); c.stroke();
    c.lineWidth = 1.6; c.beginPath(); c.arc(0, 0, r * .66, 0, 7); c.stroke();
    c.save(); c.rotate(rot); for (let i = 0; i < 24; i++) { c.rotate(Math.PI / 12); c.lineWidth = i % 2 ? 1.2 : 2.2; c.beginPath(); c.moveTo(r - 9, 0); c.lineTo(r - (i % 2 ? 16 : 22), 0); c.stroke(); } c.restore();
    c.save(); c.rotate(-rot * .8); for (let i = 0; i < 8; i++) { c.rotate(Math.PI / 4); c.save(); c.translate(r * .82, 0); c.beginPath(); c.moveTo(0, -9); c.lineTo(6, 0); c.lineTo(0, 9); c.lineTo(-6, 0); c.closePath(); c.globalAlpha = .9; c.fill(); c.restore(); } c.restore();
    c.save(); c.rotate(rot * .5); c.lineWidth = 1.8; c.beginPath(); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 * 3, px = Math.cos(an) * r * .66, py = Math.sin(an) * r * .66; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); c.stroke(); c.restore();
    // cruz patada no centro
    c.save(); const k = r * .34; c.beginPath(); for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.moveTo(0, -k * .16); c.lineTo(k * .62, -k * .16); c.lineTo(k * 1.02, -k * .5); c.lineTo(k * 1.02, k * .5); c.lineTo(k * .62, k * .16); c.lineTo(0, k * .16); } c.closePath(); c.globalAlpha = a * .9; c.fill(); c.restore();
    c.restore();
  }
  function frame(now) {
    requestAnimationFrame(frame); cx.clearRect(0, 0, W, H); if (T0 == null) return;
    const t = now - T0, fade = E ? clamp(1 - (now - E) / 1500) : 1; if (fade <= 0) return;
    const slot = rect('player-11'), top = rect('player-0'), bot = rect('player-10'); if (!slot || !top) return;
    const HX = 20, HY = top.y - 24, HW = W - 40, HH = bot.y + bot.h + 18 - HY, mx = HX + HW / 2, my = HY + HH / 2;
    const sx = slot.cx, sy = slot.cy, grow = ease(clamp(t / 1700)), R = grow * 470, pulse = .88 + .12 * Math.sin(t / 900);
    const eng = window.__powEngine && window.__powEngine(), occ = i => eng && eng.players[0].board[i];
    // ── camada do chão (só aparece fora das cartas) ──
    lx.globalCompositeOperation = 'source-over'; lx.clearRect(0, 0, W, H);
    let g = lx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(R, 1)); g.addColorStop(0, `rgba(255,208,112,${.24 * pulse})`); g.addColorStop(.7, `rgba(255,190,84,${.12 * pulse})`); g.addColorStop(1, 'rgba(255,190,84,0)'); lx.fillStyle = g; lx.fillRect(0, 0, W, H);
    // brilho mais forte no centro da metade
    g = lx.createRadialGradient(mx, my, 0, mx, my, 210); g.addColorStop(0, `rgba(255,236,170,${.1 * pulse * clamp((t - 600) / 900)})`); g.addColorStop(1, 'rgba(255,236,170,0)'); lx.fillStyle = g; lx.fillRect(0, 0, W, H);
    // sigilo
    lx.save(); lx.beginPath(); lx.arc(sx, sy, R, 0, 7); lx.clip(); lx.shadowColor = 'rgba(255,200,90,.9)'; lx.shadowBlur = 10; sigil(lx, mx, my, 158, t / 9000, .34 * clamp((t - 350) / 900)); lx.restore();
    // feixes de luz
    lx.save(); lx.translate(mx, HY); lx.rotate(-.34); for (let k = 0; k < 4; k++) { const x0 = -200 + k * 120 + Math.sin(t / 3000 + k) * 14, w = 34 + k * 8, a = (.1 + .05 * Math.sin(t / 1900 + k * 1.7)) * clamp((t - 800) / 900); const gg = lx.createLinearGradient(0, 0, 0, HH + 60); gg.addColorStop(0, `rgba(255,236,176,${a})`); gg.addColorStop(1, 'rgba(255,236,176,0)'); lx.fillStyle = gg; lx.fillRect(x0, -20, w, HH + 80); } lx.restore();
    // onda de choque
    if (t < 2100) { const a = clamp(1 - t / 2000); for (const [k, w, aa] of [[1, 7, .95], [.86, 3, .5], [.7, 2, .3]]) { const rad = R * k; if (rad < 4) continue; const gg = lx.createRadialGradient(sx, sy, Math.max(0, rad - w * 2), sx, sy, rad + w); gg.addColorStop(0, 'rgba(255,220,130,0)'); gg.addColorStop(.6, `rgba(255,238,180,${a * aa})`); gg.addColorStop(1, 'rgba(255,220,130,0)'); lx.fillStyle = gg; lx.beginPath(); lx.arc(sx, sy, rad + w, 0, 7); lx.fill(); } }
    // abre um vazado nas cartas
    lx.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 13; i++) { if (!occ(i)) continue; const r = rect('player-' + i); if (!r) continue; lx.fillStyle = 'rgba(0,0,0,.82)'; rr(lx, r.x - 2, r.y - 2, r.w + 4, r.h + 4, 7); lx.fill(); }
    if (!window.__mk) { const m = document.createElement('canvas'); m.width = W; m.height = H; const mc = m.getContext('2d'); mc.filter = 'blur(13px)'; mc.fillStyle = '#000'; rr(mc, HX + 6, HY + 6, HW - 12, HH - 12, 18); mc.fill(); window.__mk = m; }
    lx.globalCompositeOperation = 'destination-in'; lx.drawImage(window.__mk, 0, 0); lx.globalCompositeOperation = 'source-over';
    // ── composição ──
    cx.save(); cx.globalAlpha = fade;
    cx.globalCompositeOperation = 'screen'; cx.drawImage(lay, 0, 0);
    cx.globalCompositeOperation = 'lighter';
    // brilho sob as unidades
    for (let i = 0; i < 10; i++) { if (!occ(i)) continue; const r = rect('player-' + i); const rv = clamp((R - Math.hypot(r.cx - sx, r.cy - sy)) / 90); if (rv <= 0) continue; const gg = cx.createRadialGradient(r.cx, r.y + r.h, 0, r.cx, r.y + r.h, 44); const a = .34 * rv * (.8 + .2 * Math.sin(t / 700 + i)); gg.addColorStop(0, `rgba(255,214,120,${a})`); gg.addColorStop(1, 'rgba(255,214,120,0)'); cx.fillStyle = gg; cx.fillRect(r.cx - 50, r.y + r.h - 20, 100, 50); }
    // clarão da carta
    if (t < 1100) { const a = Math.sin(clamp(t / 1100) * Math.PI) ; const gg = cx.createRadialGradient(sx, sy, 0, sx, sy, 110); gg.addColorStop(0, `rgba(255,250,225,${.95 * a})`); gg.addColorStop(.35, `rgba(255,214,120,${.55 * a})`); gg.addColorStop(1, 'rgba(255,200,90,0)'); cx.fillStyle = gg; cx.beginPath(); cx.arc(sx, sy, 110, 0, 7); cx.fill(); for (const [dx, dy, L] of [[1, 0, 190], [0, 1, 150]]) { const l2 = cx.createLinearGradient(sx - dx * L, sy - dy * L, sx + dx * L, sy + dy * L); l2.addColorStop(0, 'rgba(255,230,160,0)'); l2.addColorStop(.5, `rgba(255,248,215,${a})`); l2.addColorStop(1, 'rgba(255,230,160,0)'); cx.strokeStyle = l2; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(sx - dx * L, sy - dy * L); cx.lineTo(sx + dx * L, sy + dy * L); cx.stroke(); } }
    // aura permanente da carta de terreno
    { const a = clamp((t - 500) / 600); cx.save(); cx.shadowColor = 'rgba(255,200,90,1)'; cx.shadowBlur = 14 + 6 * Math.sin(t / 650); cx.strokeStyle = `rgba(255,226,150,${a * (.6 + .25 * Math.sin(t / 650))})`; cx.lineWidth = 2.2; rr(cx, slot.x - 3, slot.y - 3, slot.w + 6, slot.h + 6, 8); cx.stroke(); cx.restore(); }
    // fio de luz que corre pela borda da metade
    { const a = clamp((t - 900) / 900), per = 2 * (HW + HH); cx.save(); cx.shadowColor = 'rgba(255,200,90,1)'; cx.shadowBlur = 12; cx.strokeStyle = `rgba(255,222,140,${a * (.13 + .05 * Math.sin(t / 1300))})`; cx.lineWidth = 2; rr(cx, HX + 1, HY + 1, HW - 2, HH - 2, 15); cx.stroke(); cx.strokeStyle = `rgba(255,248,215,${a * .8})`; cx.lineWidth = 2.6; cx.setLineDash([80, per]); cx.lineDashOffset = -t * .22; rr(cx, HX + 1, HY + 1, HW - 2, HH - 2, 15); cx.stroke(); cx.restore(); }
    // partículas de luz subindo
    for (const p of P) { const px0 = HX + p.x * HW, py = HY + HH - ((p.y * HH + t * p.v) % (HH + 30)) + 15, px = px0 + Math.sin(t / 1200 + p.ph) * p.sw; const vis = clamp((R - Math.hypot(px - sx, py - sy)) / 60) * clamp((t - 500) / 800); if (vis <= 0) continue; const tw = .5 + .5 * Math.sin(t / 380 + p.ph * 3); const gg = cx.createRadialGradient(px, py, 0, px, py, p.s * 4); gg.addColorStop(0, `rgba(255,244,196,${.95 * vis * tw})`); gg.addColorStop(.3, `rgba(255,214,120,${.45 * vis * tw})`); gg.addColorStop(1, 'rgba(255,200,90,0)'); cx.fillStyle = gg; cx.beginPath(); cx.arc(px, py, p.s * 4, 0, 7); cx.fill(); }
    // cintilar em cruz
    for (const s of SP) { const ph = ((t + s.ph * 900) % s.per) / s.per, a = Math.pow(Math.sin(clamp(ph * 1.6) * Math.PI), 2) * clamp((t - 1200) / 800); if (a > .02) star(cx, HX + s.x * HW, HY + s.y * HH, s.s * (.6 + .6 * a), a); }
    cx.restore();
  }
  requestAnimationFrame(frame);
})();
