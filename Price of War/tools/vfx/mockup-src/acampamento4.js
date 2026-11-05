// MOCKUP v4: terreno dos Mercenários (nome provisório "Acampamento de Contratos") com ARTE PINTADA (peças geradas por IA, em /art/*.png),
// iluminação noturna por código (cena escurecida + luz da fogueira, das portas, da vela e do baú) e animação: montagem, mercenários chegando e desabamento.
(() => {
  const W = innerWidth, H = innerHeight, DPR = Math.min(3, window.devicePixelRatio || 1), cv = document.createElement('canvas');
  cv.width = W * DPR; cv.height = H * DPR; cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:none'; document.body.appendChild(cv);
  const root = document.getElementById('root'), mkc = () => { const c = document.createElement('canvas'); c.width = W * DPR; c.height = H * DPR; return c; };
  const mc = cv.getContext('2d'), scn = mkc(), lgt = mkc(), sc = scn.getContext('2d'), lc = lgt.getContext('2d'); for (const c of [mc, sc, lc]) c.imageSmoothingQuality = 'high';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), easeOut = x => 1 - Math.pow(1 - x, 3), back = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  let T0 = null, E = null; window.__acampStart = () => { T0 = performance.now(); E = null; }; window.__acampEnd = () => { E = performance.now(); };
  const yG = 724, FX = 196;
  // ── imagens ──
  const IMG = {}; const NAMES = 'tenda_a tenda_b rack caixotes barril mesa bau sacos fogueira mastro bandeirolas cerca m_beber m_afiar m_guarda m_anda_a m_anda_b m_anda_c m_contar_b'.split(' ');
  NAMES.forEach(n => { const i = new Image(); i.src = '/art/' + n + '.png'; IMG[n] = i; }); const terra = new Image(); terra.src = '/art/tex_terra.jpg';
  const ready = () => NAMES.every(n => IMG[n].complete && IMG[n].naturalWidth) && terra.complete;
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
  // ── lista de peças da cena: tudo aparece, assenta e cai por aqui ──
  const items = [
    { n: 'mastro', x: 112, h: 62, ap: 2700, kind: 'pole', yb: yG - 4 },
    { n: 'tenda_a', x: 40, h: 63, ap: 900, kind: 'tent', yb: yG + 2, door: [.64, .78], k: 0 },
    { n: 'tenda_b', x: 352, h: 66, ap: 1200, kind: 'tent', yb: yG + 2, door: [.38, .74], k: 1.7 },
    { n: 'rack', x: 93, h: 44, ap: 1550, kind: 'drop', yb: yG },
    { n: 'caixotes', x: 126, h: 33, ap: 1700, kind: 'drop', yb: yG },
    { n: 'barril', x: 146, h: 27, ap: 1770, kind: 'drop', yb: yG },
    { n: 'mesa', x: 264, h: 30, ap: 1650, kind: 'drop', yb: yG, light: [.78, .14, 30, '255,190,100', .55] },
    { n: 'bau', x: 290, h: 26, ap: 1800, kind: 'drop', yb: yG, light: [.5, .3, 30, '255,205,100', .6] },
    { n: 'sacos', x: 72, h: 20, ap: 1900, kind: 'drop', yb: yG + 1 },
    { n: 'fogueira', x: FX, h: 52, ap: 2000, kind: 'drop', yb: yG + 3 },
  ];
  const guard = { n: 'm_guarda', x: 314, h: 36, ap: 3100, yb: yG + 1 };
  const seats = [{ sit: 'm_beber', walk: ['m_anda_b', 'm_anda_c'], x: 160, h: 32, from: -20, flip: false, ap: 2300, dir: 1 }, { sit: 'm_afiar', walk: ['m_anda_a', 'm_anda_a'], x: 232, h: 33, from: 410, flip: true, ap: 2500, dir: -1 }];
  const vel = items.concat([guard], seats).map(() => ({ vx: (Math.random() - .5) * 90, vy: -Math.random() * 70, vr: (Math.random() - .5) * 3, d: Math.random() * .3 }));
  function frame(now) {
    requestAnimationFrame(frame); for (const c of [mc, sc, lc]) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.setTransform(DPR, 0, 0, DPR, 0, 0); }
    if (T0 == null || !ready()) { root && (root.style.transform = ''); return; }
    const t = now - T0, te = E ? now - E : -1; if (te > 2600) { root && (root.style.transform = ''); return; }
    const dead = te >= 0, td = dead ? te / 1000 : 0, fade = dead ? clamp(1 - td / 1.8) : 1;
    let sh = 0; for (const ts of [1000, 1250, 1750, 1900, 2050]) { const d = t - ts; if (d > 0 && d < 240) sh = Math.max(sh, (1 - d / 240) * .8); } if (dead && te < 400) sh = Math.max(sh, (1 - te / 400) * 1.2);
    if (root) root.style.transform = sh > .05 ? `translate(${(Math.sin(now / 17) * sh).toFixed(2)}px,${(Math.cos(now / 23) * sh).toFixed(2)}px)` : '';
    const fire = dead ? clamp(1 - te / 800) : easeOut(clamp((t - 2200) / 700)), flick = .88 + .08 * Math.sin(now / 95) + .05 * Math.sin(now / 41);
    const FY = yG + 3 - 52 * .28;
    // ───────── CENA ─────────
    // terra batida com palha (suave nas bordas)
    const gi = clamp(t / 900) * fade; if (gi > 0) { if (!window.__dl) { const l = document.createElement('canvas'); l.width = 400 * DPR; l.height = 64 * DPR; window.__dl = l; } const l = window.__dl, g2 = l.getContext('2d'); g2.setTransform(DPR, 0, 0, DPR, 0, 0); g2.globalCompositeOperation = 'source-over'; g2.clearRect(0, 0, 400, 64);
      const p = g2.createPattern(terra, 'repeat'); p.setTransform(new DOMMatrix().scale(.28)); g2.fillStyle = p; g2.fillRect(0, 0, 400, 64);
      g2.globalCompositeOperation = 'destination-in'; g2.save(); g2.translate(195, 36); g2.scale(1, .14); const gg = g2.createRadialGradient(0, 0, 0, 0, 0, 215); gg.addColorStop(0, 'rgba(0,0,0,.95)'); gg.addColorStop(.7, 'rgba(0,0,0,.6)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); g2.fillStyle = gg; g2.fillRect(-220, -260, 440, 520); g2.restore();
      sc.save(); sc.globalAlpha = gi * .9; sc.drawImage(l, 0, 0, l.width, l.height, 0, yG - 36, 400, 64); sc.restore(); }
    // desenho de cada peça
    const place = (it, i, order) => { const dying = dead; let o = {}; let x = it.x, yb = it.yb, h = it.h;
      if (!dying) { const q = clamp((t - it.ap) / (it.kind === 'tent' ? 700 : it.kind === 'pole' ? 800 : 340)); if (q <= 0) return; if (it.kind === 'tent') { o = { sy: Math.max(.04, back(q)), a: clamp(q * 4) }; } else if (it.kind === 'pole') { o = { rise: easeOut(q) }; } else { o = { dy: (1 - back(q)) * -34, a: clamp(q * 3) }; } }
      else { const v = vel[i], q = Math.max(0, td - v.d), a = clamp(1 - (q - .1) / 1.1); if (a <= 0) return; if (it.kind === 'tent') o = { sy: Math.max(.05, 1 - clamp(q * 1.6) * .93), a }; else o = { dy: 330 * q * q - 40 * q, rot: v.vr * q * (it.kind === 'drop' ? 1.2 : .4), a, sx: 1 }; x += v.vx * q * (it.kind === 'tent' ? 0 : .45); }
      shadow(sc, x, yb - 1, h * .55, o.a == null ? .5 : .5 * o.a); spr(sc, it.n, x, yb, h, o); };
    items.forEach((it, i) => place(it, i));
    if (!dead) { for (const it of items) if (it.kind !== 'pole') dust(sc, it.x, yG + 1, (t - it.ap - 240) / (it.kind === 'tent' ? 1100 : 900), it.kind === 'tent' ? 2.2 : 1.1); }
    // mercenários: chegam andando, sentam, e fogem quando o terreno cai
    seats.forEach((m, i) => { const tw = t - m.ap; if (tw < 0) return; const WT = 1500; const v = vel[items.length + 1 + i];
      if (dead) { const q = Math.max(0, te - 100) / 1000, xx = m.x + (m.dir > 0 ? -1 : 1) * q * 280 * (1 + q); if (xx < -30 || xx > 420) return; const fr = Math.floor(now / 140) % 2; spr(sc, m.walk[fr], xx, yG, m.h * 1.02, { flip: m.dir < 0 ? false : true, a: clamp(1 - q * .25), dy: -Math.abs(Math.sin(now / 90)) * 1.2 }); return; }
      const wp = clamp(tw / WT);
      if (wp < 1) { const xx = m.from + (m.x - m.from) * easeOut(wp); const fr = Math.floor(now / 140) % 2; shadow(sc, xx, yG - 1, 8, .5); spr(sc, m.walk[fr], xx, yG + 1, m.h * 1.02, { flip: m.dir < 0, dy: -Math.abs(Math.sin(now / 90)) * 1.2 }); }
      else { const sit = clamp((tw - WT) / 350); shadow(sc, m.x, yG, 12, .5); if (sit < 1) spr(sc, m.walk[0], m.x, yG + 1, m.h * 1.02, { flip: m.dir < 0, a: 1 - sit }); spr(sc, m.sit, m.x, yG + 1.5, m.h, { flip: m.flip && false, a: sit }); } });
    // coletor de moedas (ajoelhado) e guarda na porta da tenda B
    for (const [it, j] of [[guard, 1]]) { if (dead) { const q = Math.max(0, td - .1), a = clamp(1 - q * 1.2); if (a > 0) spr(sc, it.n, it.x + (j ? 40 : -30) * q, it.yb - 120 * q * (1 - q), it.h, { a }); continue; } const q = clamp((t - it.ap) / 500); if (q <= 0) continue; shadow(sc, it.x, it.yb - 1, 8, .5 * q); spr(sc, it.n, it.x, it.yb, it.h, { a: q, dy: (1 - q) * 6 }); }
    // cerca de corda à frente e bandeirolas esticadas entre as barracas
    if (!dead) { const q = clamp((t - 700) / 700); if (q > 0) { spr(sc, 'cerca', 118, yG + 6, 30, { a: q, flip: false }); spr(sc, 'cerca', 285, yG + 6, 30, { a: q, flip: true }); } }
    { const q = dead ? 0 : clamp((t - 2900) / 900); if (q > 0 || (dead && te < 600)) { const im = IMG.bandeirolas; if (im.naturalWidth) { const w = 280, hh = 23; sc.save(); sc.globalAlpha = dead ? clamp(1 - te / 500) : q; sc.translate(195, yG - 58 + Math.sin(now / 700) * .6); sc.beginPath(); sc.rect(-w / 2, -4, w * (dead ? 1 : easeOut(q)), hh + 8); sc.clip(); sc.drawImage(im, -w / 2, 0, w, hh); sc.restore(); } } }
    // ───────── LUZ ─────────
    sc.save(); sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-atop'; sc.fillStyle = 'rgba(14,16,30,.40)'; sc.fillRect(0, 0, cv.width, cv.height); sc.restore();
    lc.save(); lc.setTransform(1, 0, 0, 1, 0, 0); lc.drawImage(scn, 0, 0); lc.globalCompositeOperation = 'source-in'; lc.restore(); lc.globalCompositeOperation = 'source-in';
    const L = (x, y, r, rgb, a) => { const g = lc.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(.5, `rgba(${rgb},${a * .45})`); g.addColorStop(1, `rgba(${rgb},0)`); lc.fillStyle = g; lc.fillRect(x - r, y - r, r * 2, r * 2); };
    if (fire > .02) L(FX, FY - 8, 210, '255,150,60', 1.05 * fire * flick);
    if (!dead) for (const it of items) { const q = clamp((t - it.ap - 450) / 600); if (q <= 0) continue; const im = IMG[it.n], w = it.h * im.naturalWidth / im.naturalHeight; if (it.door) { const [dx, dy] = it.door; L(it.x - w / 2 + dx * w, it.yb - it.h + dy * it.h, 40, '255,150,60', .9 * q * (.85 + .1 * Math.sin(now / 130 + it.k))); } if (it.light) { const [lx, ly, r, rgb, a] = it.light; L(it.x - w / 2 + lx * w, it.yb - it.h + ly * it.h, r, rgb, a * q * (.9 + .1 * Math.sin(now / 90 + lx * 9))); } }
    lc.globalCompositeOperation = 'source-over';
    // ───────── composição ─────────
    mc.save(); mc.setTransform(1, 0, 0, 1, 0, 0); mc.drawImage(scn, 0, 0); mc.globalCompositeOperation = 'lighter'; mc.drawImage(lgt, 0, 0); mc.filter = `blur(${5 * DPR}px)`; mc.globalAlpha = .5; mc.drawImage(lgt, 0, 0); mc.restore();
    // ───────── efeitos de luz por cima ─────────
    if (fire > .02) { flame(mc, FX, FY + 1, now, 3, fire);
      mc.save(); mc.globalCompositeOperation = 'lighter'; for (let i = 0; i < 10; i++) { const ph = ((now / 1500 + i * .137) % 1), x = FX + Math.sin(now / 400 + i * 2.3) * (6 + ph * 14), y = FY - 6 - ph * 56, a = (1 - ph) * .85 * fire; mc.fillStyle = `rgba(255,${150 + ph * 80},70,${a})`; mc.beginPath(); mc.arc(x, y, 1.1 * (1 - ph * .5) + .3, 0, 7); mc.fill(); } mc.restore();
      for (let i = 0; i < 4; i++) { const ph = ((now / 4200 + i * .25) % 1), x = FX + Math.sin(now / 1300 + i * 1.7) * 9 + ph * 12, y = FY - 26 - ph * 46, a = Math.sin(ph * Math.PI) * .09 * fire; const g = mc.createRadialGradient(x, y, 0, x, y, 12 + ph * 12); g.addColorStop(0, `rgba(170,160,150,${a})`); g.addColorStop(1, 'rgba(170,160,150,0)'); mc.fillStyle = g; mc.beginPath(); mc.arc(x, y, 12 + ph * 12, 0, 7); mc.fill(); } }
    if (!dead) { const cf = .85 + .15 * Math.sin(now / 90 + 2); const m = items.find(i => i.n === 'mesa'); if (m && t > m.ap + 400) { const im = IMG.mesa, w = m.h * im.naturalWidth / im.naturalHeight; glow(mc, m.x - w / 2 + .78 * w, yG - m.h * .86, 6, '255,214,120', .8 * cf); }
      const b = items.find(i => i.n === 'bau'); if (b && t > b.ap + 500) { const k = (now / 1300) % 1, im = IMG.bau, w = b.h * im.naturalWidth / im.naturalHeight, gx = b.x - w / 2 + .25 * w + k * .5 * w, gy = yG - b.h * .62; if (k < .5) { mc.save(); mc.globalCompositeOperation = 'lighter'; for (const [dx, dy] of [[1, 0], [0, 1]]) { const g2 = mc.createLinearGradient(gx - dx * 4.5, gy - dy * 4.5, gx + dx * 4.5, gy + dy * 4.5); g2.addColorStop(0, 'rgba(255,230,160,0)'); g2.addColorStop(.5, `rgba(255,250,220,${Math.sin(k * 2 * Math.PI) * .95})`); g2.addColorStop(1, 'rgba(255,230,160,0)'); mc.strokeStyle = g2; mc.lineWidth = 1.2; mc.beginPath(); mc.moveTo(gx - dx * 4.5, gy - dy * 4.5); mc.lineTo(gx + dx * 4.5, gy + dy * 4.5); mc.stroke(); } mc.restore(); } } }
    if (dead && te < 1400) { const q = te / 1400; for (let i = 0; i < 5; i++) { const x = FX + (i - 2) * 6, y = FY - 8 - q * 40 - i * 3, a = (1 - q) * .2; const g = mc.createRadialGradient(x, y, 0, x, y, 14 + q * 12); g.addColorStop(0, `rgba(150,145,135,${a})`); g.addColorStop(1, 'rgba(150,145,135,0)'); mc.fillStyle = g; mc.beginPath(); mc.arc(x, y, 14 + q * 12, 0, 7); mc.fill(); } }
    const s = document.getElementById('player-11'); if (s && !dead) { const r = s.getBoundingClientRect(), a = clamp((t - 300) / 700); mc.save(); mc.shadowColor = 'rgba(255,196,90,.9)'; mc.shadowBlur = 8 + 3 * Math.sin(t / 900); mc.strokeStyle = `rgba(240,205,120,${a * (.3 + .08 * Math.sin(t / 900))})`; mc.lineWidth = 1.6; rr(mc, r.x - 3, r.y - 3, r.width + 6, r.height + 6, 8); mc.stroke(); mc.restore(); }
  }
  requestAnimationFrame(frame);
})();
