
// ══ Brecha e Estandarte de conquista ══════════════════════════════════════════════════════════════════════════════
function stonesFall(x, y, n, delay) {
  for (let i = 0; i < n; i++) at(delay + R(0, .22), () => {
    const sx = x + R(-34, 34), ex = x + R(-22, 22), ey = y + R(-8, 22), TT = R(.26, .38), k = Math.floor(Math.random() * 4), sz = R(16, 30), rot0 = R(0, 6.28), vr = R(-9, 9);
    add({ dur: TT, draw(p) { const u = p * p, px = sx + (ex - sx) * u, py = -40 + (ey + 40) * u;
      ctx.save(); ctx.globalAlpha = .35 * u; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(ex, ey + 6, sz * .5 * u, sz * .2 * u, 0, 0, 7); ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(px, py); ctx.rotate(rot0 + vr * p * TT); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 4; ctx.drawImage(IMG.debris, k * 64, 0, 64, 64, -sz / 2, -sz / 2, sz, sz); ctx.restore(); },
      end() { puff(ex, ey + 4, R(-14, 14), -R(8, 26), R(22, 34), .5, .45, 1.4); sparksDir(ex, ey, -Math.PI / 2, 1.2, 2, .35, '255,226,170'); } });
  });
}
const FL = { w: 128, h: 192 };
// the flag stays on screen (a looping sheet) until `stopFlag()`; each scene resets it
let flagFx = null;
function flagDraw(key, cx, baseY, sc, state) {   // state: {mode:'plant'|'wave'|'fall', t0}
  return add({ dur: 60, draw(p) {
    const t = p * 60 - 0; let img, cols, frames, fr;
    if (flagFx && flagFx.stop && now > flagFx.stop) return;
    ctx.save();
    const m = state.mode(now);
    if (m.kind === 'plant') { img = IMG['plantar_' + key]; frames = 20; cols = 5; fr = Math.min(19, Math.floor(m.u * 20)); }
    else if (m.kind === 'fall') { img = IMG['cair_' + key]; frames = 16; cols = 4; fr = Math.min(15, Math.floor(m.u * 16)); }
    else { img = IMG['bandeira_' + key]; frames = 24; cols = 6; fr = Math.floor((now * 11) % 24); }
    if (m.hidden) { ctx.restore(); return; }
    const c = fr % cols, r = Math.floor(fr / cols);
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 6;
    ctx.drawImage(img, c * FL.w, r * FL.h, FL.w, FL.h, cx - 34 * sc, baseY - 186 * sc, FL.w * sc, FL.h * sc);
    ctx.restore();
  } });
}
function wallCollapse(x, y, sc = .62, delay = 0) {   // y = centre of the (enemy) front slot; the wall stands on its lower edge
  at(delay, () => { play('boom', 0, .6, .5); shake(.9, 4, .25);
    tween(24 / 18, p => sheetXY(IMG.muro, 6, 256, 192, Math.min(23, Math.floor(p * 24)), x, y + 16, sc * 1.1, sc * 1.1, 1), 0);
    for (let k = 0; k < 5; k++) at(.3 + k * .09, () => { play('dano', 0, .25, .6 + R(0, .5)); });
    at(.45, () => { dust(x, y + 20, 90, 10, 40); shock(x, y + 26, 110, .5, '255,226,170', 4); });
  });
}
function ruins(x, y, sc = .62, fade = 1, delay = 0, dur = 6) { tween(dur, p => { ctx.save(); ctx.globalAlpha = Math.min(1, p * 10) * fade * (1 - ei((p - .92) / .08)); ctx.drawImage(IMG.ruinas, x - 128 * sc * 1.1, y + 16 - 150 * sc * 1.1, 256 * sc * 1.1, 192 * sc * 1.1); ctx.restore(); }, delay); }

Object.assign(scenes, {
  brecha: {
    cap: 'BRECHA: a Capa-Rota destrói a carta da frente do inimigo; o trecho de muralha atrás dela racha e desaba, levanta poeira e a casa fica com escombros. A coluna está aberta.',
    run() {
      const foe = E(2, 'eFront'), fx = X(2), fy = Y('eFront'), me = E(2, 'pFront');
      tween(.4, p => setT(me, 0, p < .4 ? -60 * eo(p / .4) : -60), .1);
      at(.5, () => { play('hit', 0, .8); cleanHit(fx, fy + 30, -Math.PI / 2, 1); hit(foe, 0, 0); num(fx, fy - 38, '-5', .05, 34); });
      tween(.7, p => { foe.style.opacity = 1 - ei(clamp((p - .1) / .7)); }, .85, () => { foe.style.opacity = 0; });
      tween(.5, p => setT(me, 0, -60 * (1 - eo(p))), 1.0, () => setT(me));
      wallCollapse(fx, fy, .62, 1.25);
      ruins(fx, fy, .62, 1, 1.9, 5);
      tag(fx, fy - 56, 'BRECHA!', '255,214,110', 2.0, 22);
    }
  },
  plantar: {
    cap: 'ESTANDARTE: com a coluna aberta, o jogador paga 1 de ouro e planta o estandarte. O mastro cai do alto, crava (poeira e tremor) e o pano se abre ao vento. A Capa-Rota, que sustenta o estandarte, brilha: é a ÂNCORA.',
    run() {
      const fx = X(2), fy = Y('eFront'), me = E(2, 'pFront'); setGold(7);
      ruins(fx, fy, .62, 1, 0, 8);
      const key = 'a', sc = .85, bx = fx - 24, by = fy + 50, st = { t0: now + 1.1 };
      at(.1, () => { glowCard(me, '255,214,110', 1200, 1.4); tag(fx, Y('pFront') - 52, 'ÂNCORA', '255,224,120', 0, 15); });
      coinFly({ from: GOLD, to: { x: fx, y: fy + 20 }, dur: .5, delay: .3, arc: 60, size: 22, onEnd() { ding(0, .2, 1700); addGold(-1); } });
      at(1.1, () => { whoosh(0, .3, .4, 700, 2200); });
      flagDraw(key, bx, by, sc, { mode: n => { const u = (n - st.t0) / (20 / 12); return u < 1 ? { kind: 'plant', u: Math.max(0, u), hidden: n < st.t0 } : { kind: 'wave' }; } });
      at(1.1 + 6 / 12, () => { play('hit', 0, .9, .7); play('dano', 0, .4, .6); shock(bx, by, 80, .45, '255,226,170', 4); dust(bx, by, 50, 8, 28); shake(.3, 3, 0); });
      at(1.1 + 8 / 12, () => { whoosh(0, .5, .3, 300, 1400); ding(0, .14, 1300); });
      tag(fx, fy - 56, 'ESTANDARTE', '255,224,120', 2.1, 18);
    }
  },
  pilhagem: {
    cap: 'PILHAGEM: no início do seu turno, o estandarte de pé rende +1 de ouro (moeda sobe até o contador) e as suas unidades que atacam por essa coluna ganham +1 de ataque.',
    run() {
      const fx = X(2), fy = Y('eFront'), me = E(2, 'pFront'); setGold(7);
      ruins(fx, fy, .62, 1, 0, 6); flagDraw('a', fx - 24, fy + 50, .85, { mode: () => ({ kind: 'wave' }) });
      at(.5, () => { glowCard(me, '255,150,90', 900, 1.35); num(fx, Y('pFront') - 36, '+1', 0, 28); ring(fx, Y('pFront'), 40, .5, '255,150,110', 3); });
      coinFly({ from: { x: fx - 8, y: fy - 40 }, to: GOLD, dur: .9, delay: .9, arc: 130, size: 28, onEnd() { ding(0, .26, 1760); addGold(1); ring(GOLD.x, GOLD.y, 28, .45, '255,214,110', 3); glint(GOLD.x, GOLD.y, 40, .3); } });
      tag(fx, fy - 70, 'pilhagem +1', '255,224,120', 1.0, 15);
    }
  },
  retomada: {
    cap: 'RETOMADA: o adversário destrói a âncora. Sem ela o estandarte tomba e o pano cai; a coluna volta a ser do defensor, que compra 1 carta (contra-ofensiva).',
    run() {
      const fx = X(2), fy = Y('eFront'), me = E(2, 'pFront'); let down = -1;
      ruins(fx, fy, .62, 1, 0, 6);
      flagDraw('a', fx - 24, fy + 50, .85, { mode: n => (down < 0 ? { kind: 'wave' } : { kind: 'fall', u: Math.min(.999, (n - down) / (16 / 12)), hidden: n - down > 1.45 }) });
      at(.5, () => { play('hit', 0, .9); flash(fx, Y('pFront'), 80, '255,70,50', .6, .25); hit(me, 0, 0); num(fx, Y('pFront') - 38, '-6', .05, 34); });
      tween(.7, p => { me.style.opacity = 1 - ei(clamp((p - .1) / .7)); }, .7, () => { me.style.opacity = 0; });
      at(.95, () => { down = now; whoosh(0, .5, .3, 1200, 300); tag(fx, fy + 4, 'ÂNCORA CAIU', '255,120,100', 0, 16); });
      at(1.95, () => { play('dano', 0, .4, .7); dust(fx - 30, fy + 60, 50, 6, 28); });
      flyBack({ x: 195, y: -30 }, { x: 195, y: 640 }, .7, 2.1, () => ding(0, .15, 1500), 50);
      tag(195, 580, 'contra-ofensiva: +1 carta', '200,235,255', 2.5, 15);
    }
  },
  reparar: {
    cap: 'REPARAR A MURALHA: o defensor paga 2 de ouro na Preparação; moedas voam até a muralha, tijolos novos se levantam, a bandeira inimiga cai e as ruínas somem. A coluna fecha.',
    run() {
      const fx = X(2), fy = Y('eFront'); let down = -1; setGold(7);
      ruins(fx, fy, .62, 1, 0, 4.2);
      flagDraw('b', fx - 24, fy + 50, .85, { mode: n => (down < 0 ? { kind: 'wave' } : { kind: 'fall', u: Math.min(.999, (n - down) / (16 / 12)), hidden: n - down > 1.45 }) });
      for (let k = 0; k < 2; k++) coinFly({ from: GOLD, to: { x: fx, y: fy + 36 }, dur: .55, delay: .3 + k * .15, arc: 70, size: 22, onEnd() { ding(0, .2, 1500 + k * 400); addGold(-1); ring(fx, fy + 36, 34, .3, '255,214,110', 3); } });
      at(.95, () => { down = now; play('dano', 0, .5, .6); whoosh(0, .6, .3, 300, 1500); flash(fx, fy + 30, 110, '255,226,150', .6, .5); shock(fx, fy + 40, 100, .5, '255,226,170', 3); });
      tween(1.0, p => { ctx.save(); ctx.globalAlpha = p * (1 - ei((p - .6) / .4)); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,150,${.2 * Math.sin(p * Math.PI)})`; ctx.fillRect(fx - 60, fy - 10, 120, 80); ctx.restore(); }, .95);
      tag(fx, fy - 56, 'MURALHA REPARADA', '255,224,120', 1.0, 17);
    }
  },
});
