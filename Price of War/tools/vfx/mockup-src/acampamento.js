// MOCKUP: terreno dos Mercenários (nome provisório "Acampamento de Contratos") — barracas, cerca de corda, caixotes, fogueira e estandarte montados no seu lado; tudo desaba se o terreno cai
(() => {
  const W = innerWidth, H = innerHeight, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:none'; document.body.appendChild(cv);
  const cx = cv.getContext('2d'), root = document.getElementById('root');
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), easeOut = x => 1 - Math.pow(1 - x, 3), back = x => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let T0 = null, E = null; window.__acampStart = () => { T0 = performance.now(); E = null; }; window.__acampEnd = () => { E = performance.now(); };
  const yB = 722, FX = 195, FY = 708;
  const stakes = Array.from({ length: 10 }, (_, i) => ({ x: 108 + i * 19.5, ap: 150 + i * 70, s: rnd() }));
  const pieces = [ // tudo o que cai quando o terreno é destruído: { kind, x, y, w, h, ap, ... }
    { kind: 'tent', x: 10, w: 76, h: 46, ap: 900, c1: '#6f7d3b', c2: '#3e4a20', trim: '#c9a24a', k: 0 },
    { kind: 'tent', x: 290, w: 82, h: 50, ap: 1150, c1: '#7a8240', c2: '#454f23', trim: '#c9a24a', k: 1.6 },
    { kind: 'crate', x: 90, w: 16, h: 14, ap: 1650, y: yB - 14 }, { kind: 'crate', x: 92, w: 14, h: 12, ap: 1800, y: yB - 26 },
    { kind: 'barrel', x: 128, w: 15, h: 19, ap: 1750, y: yB - 19 }, { kind: 'crate', x: 262, w: 17, h: 15, ap: 1850, y: yB - 15 },
  ];
  const vel = pieces.map(() => ({ vx: (rnd() - .5) * 90, vy: -rnd() * 80, vr: (rnd() - .5) * 3, d: rnd() * 300 }));
  function dust(c, x, y, q, k = 1) { if (q <= 0 || q >= 1) return; const g = c.createRadialGradient(x, y - q * 8, 0, x, y - q * 8, (6 + q * 16) * k); g.addColorStop(0, `rgba(200,180,140,${.28 * (1 - q)})`); g.addColorStop(1, 'rgba(200,180,140,0)'); c.fillStyle = g; c.fillRect(x - 30 * k, y - 40, 60 * k, 56); }
  function tent(c, p, t, now, scl) {
    const q = clamp((t - p.ap) / 650); if (q <= 0) return; const w = p.w, h = p.h * Math.max(.02, back(q)), x = p.x, y = yB, sway = Math.sin(now / 900 + p.k) * .8 * q;
    c.save(); c.translate(0, 0);
    // sombra
    c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x + w / 2, y + 1, w * .56, 4, 0, 0, 7); c.fill();
    const ax = x + w / 2 + sway, ay = y - h;
    // corpo
    let g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, p.c1); g.addColorStop(.55, p.c1); g.addColorStop(1, p.c2);
    c.fillStyle = g; c.beginPath(); c.moveTo(x - 2, y); c.lineTo(ax, ay); c.lineTo(x + w + 2, y); c.closePath(); c.fill();
    // costura e listras de pano
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax, y); c.stroke();
    c.strokeStyle = 'rgba(255,240,190,.16)'; for (let i = 1; i < 4; i++) { const u = i / 4; c.beginPath(); c.moveTo(ax + (x - ax) * u, ay + (y - ay) * u); c.lineTo(ax + (x - ax) * u * .96, y); c.stroke(); }
    // faixa dourada na barra
    c.fillStyle = p.trim; c.globalAlpha = .85; c.beginPath(); c.moveTo(x + w * .06, y - h * .13); c.lineTo(x + w * .94, y - h * .13); c.lineTo(x + w * .98, y); c.lineTo(x + w * .02, y); c.closePath(); c.fill(); c.globalAlpha = 1;
    // porta
    c.fillStyle = '#140c06'; c.beginPath(); c.moveTo(ax, y - h * .62); c.lineTo(ax + w * .17, y); c.lineTo(ax - w * .17, y); c.closePath(); c.fill();
    c.fillStyle = p.c1; c.beginPath(); c.moveTo(ax, y - h * .66); c.lineTo(ax - w * .2, y); c.lineTo(ax - w * .09, y); c.closePath(); c.fill(); c.beginPath(); c.moveTo(ax, y - h * .66); c.lineTo(ax + w * .2, y); c.lineTo(ax + w * .09, y); c.closePath(); c.fill();
    // contorno
    c.strokeStyle = 'rgba(15,10,4,.7)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - 2, y); c.lineTo(ax, ay); c.lineTo(x + w + 2, y); c.stroke();
    // mastro e flâmula com moeda
    if (q > .6) { const f = clamp((q - .6) / .4); c.strokeStyle = '#2f2012'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax, ay - 14 * f); c.stroke();
      c.beginPath(); c.moveTo(ax, ay - 14 * f); for (let i = 0; i <= 6; i++) { const u = i / 6; c.lineTo(ax + u * 15 * f, ay - 14 * f + 2 + Math.sin(now / 200 - u * 3 + p.k) * 1.8 * u); } c.lineTo(ax, ay - 7 * f); c.closePath(); c.fillStyle = '#5d6b2c'; c.fill(); c.strokeStyle = 'rgba(230,195,100,.9)'; c.lineWidth = .9; c.stroke(); c.fillStyle = 'rgba(245,215,120,.95)'; c.beginPath(); c.arc(ax + 4.5 * f, ay - 10.5 * f, 1.5, 0, 7); c.fill(); }
    // estacas e cordas
    c.strokeStyle = '#c4a572'; c.lineWidth = .9; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s < 0 ? x + w * .12 : x + w * .88, y - h * .45); c.lineTo(s < 0 ? x - 10 : x + w + 10, y + 2); c.stroke(); c.fillStyle = '#3a2814'; c.fillRect((s < 0 ? x - 11 : x + w + 9), y - 1, 2.4, 5); }
    c.restore();
  }
  function crate(c, p, t) { const q = clamp((t - p.ap) / 320); if (q <= 0) return; const dy = (1 - back(q)) * -34, x = p.x, y = p.y + dy; c.save(); c.globalAlpha = clamp(q * 3);
    const g = c.createLinearGradient(0, y, 0, y + p.h); g.addColorStop(0, '#9a7442'); g.addColorStop(1, '#5e4223'); c.fillStyle = g; c.fillRect(x, y, p.w, p.h); c.strokeStyle = 'rgba(20,12,4,.8)'; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, p.w - 1, p.h - 1);
    c.beginPath(); c.moveTo(x + 1, y + 1); c.lineTo(x + p.w - 1, y + p.h - 1); c.moveTo(x + p.w - 1, y + 1); c.lineTo(x + 1, y + p.h - 1); c.stroke(); c.fillStyle = 'rgba(255,230,170,.22)'; c.fillRect(x, y, p.w, 1.3); c.restore(); }
  function barrel(c, p, t) { const q = clamp((t - p.ap) / 320); if (q <= 0) return; const dy = (1 - back(q)) * -34, x = p.x, y = p.y + dy; c.save(); c.globalAlpha = clamp(q * 3);
    const g = c.createLinearGradient(x, 0, x + p.w, 0); g.addColorStop(0, '#6b4a26'); g.addColorStop(.45, '#a07a46'); g.addColorStop(1, '#4e341a'); c.fillStyle = g; rr(c, x, y, p.w, p.h, 4); c.fill(); c.strokeStyle = 'rgba(25,16,6,.9)'; c.lineWidth = 1.5; for (const k of [.22, .75]) { c.beginPath(); c.moveTo(x, y + p.h * k); c.lineTo(x + p.w, y + p.h * k); c.stroke(); } c.restore(); }
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  function flame(c, x, y, t, k, S) { const f = (.75 + .25 * Math.sin(t / 90 + k * 3) + .1 * Math.sin(t / 37 + k)) * S; const h = 17 * f; c.save(); c.globalCompositeOperation = 'lighter';
    let g = c.createRadialGradient(x, y - 4, 0, x, y - 4, 74 * S); g.addColorStop(0, `rgba(255,170,70,${.2 * f})`); g.addColorStop(1, 'rgba(255,150,50,0)'); c.fillStyle = g; c.fillRect(x - 80, y - 80, 160, 130);
    g = c.createRadialGradient(x, y - h * .4, 0, x, y - h * .4, h); g.addColorStop(0, 'rgba(255,248,205,.95)'); g.addColorStop(.4, 'rgba(255,190,80,.8)'); g.addColorStop(1, 'rgba(230,90,20,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y - h * .45, 6.2, h, 0, 0, 7); c.fill();
    g = c.createRadialGradient(x - 6, y - h * .3, 0, x - 6, y - h * .3, h * .7); g.addColorStop(0, 'rgba(255,220,140,.6)'); g.addColorStop(1, 'rgba(255,130,40,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x - 5, y - h * .35, 3.6, h * .7, -.2, 0, 7); c.fill(); c.restore(); }
  function frame(now) {
    requestAnimationFrame(frame); cx.clearRect(0, 0, W, H); if (T0 == null) { root && (root.style.transform = ''); return; }
    const t = now - T0, te = E ? now - E : -1; if (te > 2000) { root && (root.style.transform = ''); return; }
    let sh = 0; for (const ts of [1000, 1250, 1750]) { const d = t - ts; if (d > 0 && d < 260) sh = Math.max(sh, (1 - d / 260) * .9); } if (te >= 0 && te < 400) sh = Math.max(sh, (1 - te / 400) * 1.2);
    if (root) root.style.transform = sh > .05 ? `translate(${(Math.sin(now / 17) * sh).toFixed(2)}px,${(Math.cos(now / 23) * sh).toFixed(2)}px)` : '';
    const dead = te >= 0, qd = dead ? te / 1000 : 0;
    // clareira de terra batida
    const gi = clamp((t - 100) / 900) * (dead ? clamp(1 - te / 1200) : 1); if (gi > 0) { const g = cx.createRadialGradient(195, yB - 6, 0, 195, yB - 6, 230); g.addColorStop(0, `rgba(30,20,10,${.5 * gi})`); g.addColorStop(1, 'rgba(30,20,10,0)'); cx.save(); cx.translate(0, 0); cx.scale(1, .22); cx.fillStyle = g; cx.fillRect(-40, (yB - 6) / .22 - 240, 480, 480); cx.restore(); }
    // estacas e corda
    if (!dead) { const rope = clamp((t - 650) / 700); cx.strokeStyle = '#2f2012'; for (const s of stakes) { const q = clamp((t - s.ap) / 220); if (q <= 0) continue; const y0 = yB + 1 - (1 - back(q)) * 12; cx.fillStyle = '#4a3320'; cx.fillRect(s.x - 1.4, y0 - 12, 2.8, 14); cx.fillStyle = 'rgba(230,200,150,.35)'; cx.fillRect(s.x - 1.4, y0 - 12, 1, 14); dust(cx, s.x, yB + 1, (t - s.ap - 160) / 650, .6); }
      if (rope > 0) { cx.strokeStyle = '#b9966a'; cx.lineWidth = 1.5; cx.beginPath(); const n = Math.floor(rope * (stakes.length - 1)); for (let i = 0; i < n; i++) { const a = stakes[i], b = stakes[i + 1]; cx.moveTo(a.x, yB - 9); cx.quadraticCurveTo((a.x + b.x) / 2, yB - 4, b.x, yB - 9); } cx.stroke(); } }
    // peças
    const drawPiece = (p, i) => { if (!dead) { if (p.kind === 'tent') tent(cx, p, t, now, 1); else if (p.kind === 'crate') crate(cx, p, t); else barrel(cx, p, t); return; }
      const v = vel[i], q = Math.max(0, te - v.d) / 1000, a = clamp(1 - (q - .1) / 1.1); if (a <= 0) return; cx.save(); cx.globalAlpha = a; const cxm = p.x + p.w / 2, cym = yB - (p.h || 20) / 2; cx.translate(v.vx * q * .6, v.vy * q * .5 + 420 * q * q); cx.translate(cxm, cym); cx.rotate(v.vr * q); cx.translate(-cxm, -cym);
      if (p.kind === 'tent') { const sq = { ...p, ap: -9999 }; tent(cx, { ...sq, h: p.h * (1 - clamp(q * 1.4) * .85) }, 9999, now, 1); } else if (p.kind === 'crate') crate(cx, { ...p, ap: -9999 }, 9999); else barrel(cx, { ...p, ap: -9999 }, 9999); cx.restore(); };
    pieces.forEach(drawPiece);
    // poeira onde as barracas e caixotes assentam
    if (!dead) for (const p of pieces) dust(cx, p.x + p.w / 2, yB, (t - p.ap - 300) / 900, 1.3);
    // fogueira
    const fi = clamp((t - 2000) / 600), fs = dead ? clamp(1 - te / 700) : easeOut(fi);
    const logs = clamp((t - 1700) / 300) * (dead ? clamp(1 - te / 900) : 1);
    if (logs > 0) { cx.save(); cx.globalAlpha = logs; cx.fillStyle = 'rgba(0,0,0,.35)'; cx.beginPath(); cx.ellipse(FX, FY + 4, 22, 5, 0, 0, 7); cx.fill(); for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283, sx = FX + Math.cos(a) * 15, sy = FY + 3 + Math.sin(a) * 3.2; cx.fillStyle = i % 2 ? '#6b665c' : '#8a8479'; cx.beginPath(); cx.ellipse(sx, sy, 4, 2.8, 0, 0, 7); cx.fill(); cx.strokeStyle = 'rgba(0,0,0,.5)'; cx.lineWidth = .8; cx.stroke(); }
      for (const [dx, rot] of [[-1, -.35], [1, .35]]) { cx.save(); cx.translate(FX + dx * 2, FY + 1); cx.rotate(rot); cx.fillStyle = '#4a321a'; cx.fillRect(-12, -2.4, 24, 4.8); cx.fillStyle = 'rgba(255,190,100,.25)'; cx.fillRect(-12, -2.4, 24, 1.2); cx.restore(); } cx.restore(); }
    if (fs > .02) { flame(cx, FX, FY - 1, now, 3, fs);
      // brasas subindo
      cx.save(); cx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const ph = ((now / 1500 + i * .137) % 1), x = FX + Math.sin(now / 400 + i * 2.3) * (6 + ph * 14), y = FY - 8 - ph * 54, a = (1 - ph) * .85 * fs; cx.fillStyle = `rgba(255,${150 + ph * 80},70,${a})`; cx.beginPath(); cx.arc(x, y, 1.1 * (1 - ph * .5) + .3, 0, 7); cx.fill(); } cx.restore();
      // fumaça fraca
      for (let i = 0; i < 4; i++) { const ph = ((now / 4200 + i * .25) % 1), x = FX + Math.sin(now / 1300 + i * 1.7) * 9 + ph * 12, y = FY - 22 - ph * 52, a = Math.sin(ph * Math.PI) * .09 * fs; const g = cx.createRadialGradient(x, y, 0, x, y, 12 + ph * 12); g.addColorStop(0, `rgba(190,185,175,${a})`); g.addColorStop(1, 'rgba(190,185,175,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, 12 + ph * 12, 0, 7); cx.fill(); } }
    if (dead && te < 1200) { const q = te / 1200; for (let i = 0; i < 5; i++) { const x = FX + (i - 2) * 6, y = FY - 10 - q * 40 - i * 3, a = (1 - q) * .22; const g = cx.createRadialGradient(x, y, 0, x, y, 14 + q * 12); g.addColorStop(0, `rgba(170,165,155,${a})`); g.addColorStop(1, 'rgba(170,165,155,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, 14 + q * 12, 0, 7); cx.fill(); } }
    // estandarte dos contratos (mastro alto à direita da fogueira)
    { const q = dead ? 0 : clamp((t - 2500) / 800); const bx = 232, by = yB; if (q > 0 || (dead && te < 900)) { const rise = dead ? 1 - clamp(te / 600) : easeOut(q); cx.save(); cx.globalAlpha = dead ? clamp(1 - te / 800) : 1; cx.strokeStyle = '#8a6a3a'; cx.lineWidth = 2.4; cx.beginPath(); cx.moveTo(bx, by); cx.lineTo(bx, by - 52 * rise); cx.stroke(); if (rise > .5) { const f = clamp((rise - .5) / .5), top = by - 52; cx.beginPath(); cx.moveTo(bx, top + 2); for (let i = 0; i <= 8; i++) { const u = i / 8; cx.lineTo(bx + u * 26 * f, top + 2 + Math.sin(now / 240 - u * 3.2) * 2.4 * u); } for (let i = 8; i >= 0; i--) { const u = i / 8; cx.lineTo(bx + u * 26 * f, top + 22 + Math.sin(now / 240 - u * 3.2) * 2.4 * u); } cx.closePath(); const g = cx.createLinearGradient(bx, 0, bx + 26, 0); g.addColorStop(0, '#6f7d3b'); g.addColorStop(1, '#3e4a20'); cx.fillStyle = g; cx.fill(); cx.strokeStyle = 'rgba(230,195,100,.9)'; cx.lineWidth = 1; cx.stroke(); cx.fillStyle = 'rgba(245,215,120,.96)'; cx.beginPath(); cx.arc(bx + 11 * f, top + 12 + Math.sin(now / 240 - 1.4) * 1.1, 4.6 * f, 0, 7); cx.fill(); cx.strokeStyle = 'rgba(120,80,10,.8)'; cx.lineWidth = .8; cx.stroke(); }
        cx.restore(); } }
    // moedas que brilham de vez em quando
    if (!dead) { const ct = clamp((t - 3000) / 600); if (ct > 0) { const n = Math.floor(now / 1700), k = ((now % 1700) / 1700); const pts = [[100, yB - 30], [137, yB - 24], [270, yB - 22], [330, yB - 40], [50, yB - 28]]; const [px, py] = pts[n % pts.length]; const a = Math.sin(clamp(k * 1.5) * Math.PI) * ct * .9; if (a > .02) { cx.save(); cx.globalCompositeOperation = 'lighter'; for (const [dx, dy] of [[1, 0], [0, 1]]) { const g = cx.createLinearGradient(px - dx * 6, py - dy * 6, px + dx * 6, py + dy * 6); g.addColorStop(0, 'rgba(255,230,160,0)'); g.addColorStop(.5, `rgba(255,248,215,${a})`); g.addColorStop(1, 'rgba(255,230,160,0)'); cx.strokeStyle = g; cx.lineWidth = 1.3; cx.beginPath(); cx.moveTo(px - dx * 6, py - dy * 6); cx.lineTo(px + dx * 6, py + dy * 6); cx.stroke(); } cx.restore(); } } }
    // aura quente na carta do terreno
    const s = document.getElementById('player-11'); if (s && !dead) { const r = s.getBoundingClientRect(), a = clamp((t - 300) / 700); cx.save(); cx.shadowColor = 'rgba(255,196,90,.9)'; cx.shadowBlur = 8 + 3 * Math.sin(t / 900); cx.strokeStyle = `rgba(240,205,120,${a * (.3 + .08 * Math.sin(t / 900))})`; cx.lineWidth = 1.6; rr(cx, r.x - 3, r.y - 3, r.width + 6, r.height + 6, 8); cx.stroke(); cx.restore(); }
  }
  requestAnimationFrame(frame);
})();
