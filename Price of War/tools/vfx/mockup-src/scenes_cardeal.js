// ══ efeitos do Cardeal: auxiliares ═══════════════════════════════════════════════════════════════════════════════
const GRAVE = { x: 352, y: 332 }, HAND = { x: 195, y: 652 };
const GOLDC = '255,226,150', HOLYC = '200,224,255';

// brilho de 4 pontas (folha fx-brilhos: 4 variantes em linhas, 8 quadros)
function twNow(x, y, size, dur, v = 0, rot = 0, alpha = 1) {
  add({ dur, draw(p) { const fr = Math.min(7, Math.floor(p * 8)); ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.rotate(rot);
    ctx.drawImage(IMG.brilhos, fr * 64, v * 64, 64, 64, -size / 2, -size / 2, size, size); ctx.restore(); } });
}
function tw(x, y, size = 22, delay = 0, dur = .5, v = 0, rot = 0, alpha = 1) { at(delay, () => twNow(x, y, size, dur, v, rot, alpha)); }
// brilho que se desloca (explosão para fora ou convergência para dentro)
function twMove(x0, y0, x1, y1, size = 16, delay = 0, dur = .6, v = 0, ease = eo, alpha = 1) {
  at(delay, () => add({ dur, draw(p) { const u = ease(p), x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u, fr = Math.min(7, Math.floor(p * 8));
    ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.rotate(p * 2);
    ctx.drawImage(IMG.brilhos, fr * 64, v * 64, 64, 64, -size / 2, -size / 2, size, size); ctx.restore(); } }));
}
function twBurst(x, y, n = 14, rad = 60, delay = 0, size = 16, dur = .7) {
  for (let i = 0; i < n; i++) { const a = R(0, 6.28), d = R(.35, 1) * rad; twMove(x, y, x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - 10, size * R(.6, 1.3), delay + R(0, .12), dur * R(.7, 1.2), Math.floor(R(0, 4))); }
}
function charge(x, y, n = 14, rad = 70, delay = 0, dur = .6, size = 15) {
  for (let i = 0; i < n; i++) { const a = R(0, 6.28), d = R(.6, 1) * rad; twMove(x + Math.cos(a) * d, y + Math.sin(a) * d * .8, x, y, size * R(.6, 1.2), delay + R(0, dur * .5), dur * R(.55, .9), Math.floor(R(0, 4)), ei); }
}
function risers(x, y, w, n = 10, delay = 0, rise = 70, dur = 1.1, size = 12) {
  for (let i = 0; i < n; i++) { const sx = x + R(-w / 2, w / 2); twMove(sx, y, sx + R(-10, 10), y - rise * R(.6, 1.2), size * R(.6, 1.3), delay + R(0, .7), dur * R(.8, 1.3), Math.floor(R(0, 4)), u => u); }
}
// poça de luz no chão
function groundGlow(x, y, rx = 46, delay = 0, dur = 1.2, color = GOLDC, a = .55) {
  at(delay, () => add({ dur, draw(p) { const k = Math.sin(Math.PI * Math.min(1, p * 1.05)) * a; ctx.save(); ctx.translate(x, y); ctx.scale(1, .35); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${color},${k})`); g.addColorStop(1, `rgba(${color},0)`); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-rx, -rx, rx * 2, rx * 2); ctx.restore(); } }));
}
// escurece o campo deixando um foco de luz em (fx,fy)
function dim(fx, fy, r = 130, amount = .5, delay = 0, hold = 1.5) {
  at(delay, () => { const d = mk('div', '', `position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(circle at ${fx}px ${fy}px, rgba(0,0,0,0) ${r * .45}px, rgba(0,0,0,${amount}) ${r}px)`); $('#stage').insertBefore(d, cv);
    tween(.3, p => { d.style.opacity = p; }); tween(.45, p => { d.style.opacity = 1 - p; }, .3 + hold, () => d.remove()); });
}
// clarão de tela cheia
function whiteFlash(a = .3, delay = 0, dur = .35, color = '255,240,200') {
  at(delay, () => add({ dur, draw(p) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${color},${a * (1 - p) * (1 - p)})`; ctx.fillRect(0, 0, 390, 640); ctx.restore(); } }));
}
// a carta sobe um pouco enquanto a luz está nela e volta
function lift(el, dy = -7, delay = 0, hold = 1.0) {
  tween(.25, p => setT(el, 0, dy * eo(p), 0, 1 + .05 * eo(p)), delay); tween(.4, p => setT(el, 0, dy * (1 - eo(p)), 0, 1.05 - .05 * eo(p)), delay + .25 + hold, () => setT(el));
}
// pilar de luz sagrada: pé em (x,y); sheet 224x420, 8 colunas, 32 quadros; o chão fica a 88% da altura
function pilar(x, y, sc = .55, delay = 0, dur = 1.6, alpha = 1) {
  at(delay, () => add({ dur, draw(p) { const fr = Math.min(31, Math.floor(p * 32)), c = fr % 8, r = Math.floor(fr / 8);
    ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(sc * 1.15, sc * .72);
    ctx.drawImage(IMG.pilar, c * 224, r * 420, 224, 420, -112, -420 * .88, 224, 420); ctx.restore(); } }));
}
// sigilo sagrado no chão (achatado em elipse); 28 quadros em 7 colunas
function sigilo(x, y, sc = .6, sy = .42, delay = 0, dur = 1.8, color = 'gold', alpha = 1) {
  at(delay, () => add({ dur, draw(p) { const fr = Math.min(27, Math.floor(p * 28)), c = fr % 7, r = Math.floor(fr / 7);
    ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(sc, sc * sy);
    ctx.drawImage(color === 'azul' ? IMG.sigilo_azul : IMG.sigilo, c * 256, r * 256, 256, 256, -128, -128, 256, 256); ctx.restore(); } }));
}
function cruzAt(x, y, sc = .5, delay = 0, dur = .8) {
  at(delay, () => add({ dur, draw(p) { sheetXY(IMG.cruz, 5, 256, 256, Math.min(19, Math.floor(p * 20)), x, y, sc, sc, 1, 'lighter'); } }));
}
function trompaAt(x, y, sc = 1, delay = 0, dur = .8, alpha = 1) {
  at(delay, () => add({ dur, draw(p) { sheetXY(IMG.trompa, 4, 256, 256, Math.min(15, Math.floor(p * 16)), x, y, sc, sc * .62, alpha, 'lighter'); } }));
}
function almaAt(x, y, sc = .6, t, alpha = 1) {
  const fr = Math.floor(t * 14) % 16, c = fr % 8;
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.drawImage(IMG.alma, c * 128, 0, 128, 192, -64, -192 * .62, 128, 192); ctx.restore();
}
// coração sagrado que sobe e some (cura)
function heartAt(x, y, sc = .5, delay = 0, rise = 34, dur = 1.15) {
  at(delay, () => add({ dur, draw(p) { const fr = Math.min(19, Math.floor(p * 20)), c = fr % 5, r = Math.floor(fr / 5); ctx.save(); ctx.translate(x, y - rise * eo(p)); ctx.scale(sc, sc);
    ctx.drawImage(IMG.coracao, c * 128, r * 128, 128, 128, -64, -64, 128, 128); ctx.restore(); } }));
}
// orbe de luz que voa de um ponto a outro deixando rastro de brilhos
function orb({ from, to, dur = .6, delay = 0, arc = 60, size = 15, color = GOLDC, onEnd }) {
  at(delay, () => add({ dur, draw(p) {
    const u = p * p * (3 - 2 * p) * .4 + p * .6, x = from.x + (to.x - from.x) * u, y = from.y + (to.y - from.y) * u - arc * 4 * u * (1 - u);
    if (Math.random() < .85) twNow(x + R(-5, 5), y + R(-5, 5), R(8, 16), R(.3, .5), Math.floor(R(0, 4)), R(0, 6), .9);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, size * 1.9); g.addColorStop(0, 'rgba(255,255,245,1)'); g.addColorStop(.28, `rgba(${color},.9)`); g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - size * 2, y - size * 2, size * 4, size * 4); ctx.restore();
  }, end() { onEnd && onEnd(); } }));
}
// cometa sagrado (cabeça em cruz estrelada, cauda comprida)
function cometaFly({ from, to, dur = .5, delay = 0, arc = 0, sc = .5, onEnd }) {
  at(delay, () => add({ dur, draw(p) {
    const f = q => { const u = q * q * (3 - 2 * q) * .3 + q * .7; return [from.x + (to.x - from.x) * u, from.y + (to.y - from.y) * u - arc * 4 * u * (1 - u)]; };
    const [x, y] = f(p), [x2, y2] = f(Math.min(1, p + .03)), ang = Math.atan2(y2 - y, x2 - x), fr = Math.floor(p * 26) % 8, c = fr % 2, r = Math.floor(fr / 2);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc); ctx.drawImage(IMG.cometa, c * 320, r * 96, 320, 96, -262, -48, 320, 96); ctx.restore();
    if (Math.random() < .9) twNow(x + R(-8, 8), y + R(-8, 8), R(10, 20), R(.3, .55), Math.floor(R(0, 4)), R(0, 6), .9);
  }, end() { onEnd && onEnd(); } }));
}
// dissolve uma carta em luz (some subindo e deixando brilhos)
function dissolve(el, x, y, delay = 0, dur = .8, v = 0) {
  tween(dur, p => { el.style.opacity = 1 - ei(clamp((p - .1) / .8)); el.style.filter = `brightness(${1 + 1.6 * Math.sin(Math.min(1, p * 1.6) * Math.PI * .8)}) saturate(${1 - p * .6})`; setT(el, 0, -10 * p, 0, 1 + .05 * p); }, delay, () => { el.style.opacity = 0; });
  at(delay, () => twBurst(x, y, 18, 54, 0, 15, .9)); risers(x, y + 10, 40, 12, delay, 80, .9, 12);
}
// investida do atacante, impacto e tremida
function lunge(att, defX, defY, delay = 0, dy = 120, onHit) {
  slide(att, 0, dy, .2, { delay, ease: u => u * u }); at(delay + .2, () => { shake(.25, 4, 0); play('dano', 0, .5, .9); explosion(defX, defY, .38, 0, 1); flash(defX, defY, 80, '255,170,90', .6, .3); onHit && onHit(); });
  slide(att, 0, 0, .35, { delay: delay + .3 });
}
// emblema do escudo com número, fica na carta
function shieldBadge(x, y, n, delay = 0) {
  at(delay, () => { const d = mk('div', '', `left:${x + 22}px;top:${y + 30}px;width:24px;height:28px;transform:translate(-50%,-50%) scale(0);position:absolute;display:flex;align-items:center;justify-content:center;font:900 14px/1 Georgia,serif;color:#fff2c0;text-shadow:0 1px 2px #000;background:linear-gradient(160deg,#4d6fc4,#1b2a66);clip-path:polygon(0 0,100% 0,100% 55%,50% 100%,0 55%);filter:drop-shadow(0 0 4px rgba(255,214,110,.9))`); d.textContent = n;
    tween(.35, p => { const s = p < .6 ? p / .6 * 1.3 : 1.3 - .3 * (p - .6) / .4; d.style.transform = `translate(-50%,-50%) scale(${s})`; }); });
}

// ══ cenas do Cardeal ══════════════════════════════════════════════════════════════════════════════════════════════
const scenes = {
  bencao: {
    cap: 'Cardeal Pedro, Comando (pague 2 de ouro: +1 HP): o campo escurece, luz converge para o General, duas moedas se apagam nele e um sigilo sagrado de rosácea acende aos pés dele. Um orbe de luz com rastro voa até o aliado; um clarão e um pilar de luz descem sobre ele, a carta se ergue, brilhos sobem em hélice e um coração dourado flutua com o +1.',
    run() {
      const gen = E(2, 'pGen'), gx = 195, gy = ROW.pGen, tgt = E(1, 'pFront'), tx = X(1), ty = Y('pFront');
      setGold(7); dim(gx, gy, 150, .5, 0, 1.0); dim(tx, ty, 120, .5, 1.45, 1.9);
      charge(gx, gy - 10, 16, 80, .05, .6);
      for (let n = 0; n < 2; n++) coinFly({ from: GOLD, to: { x: gx, y: gy - 10 }, dur: .55, delay: .25 + n * .14, arc: 70, size: 22, onEnd() { clink(0, .2); addGold(-1); ring(gx, gy - 10, 34, .3, '255,214,110', 3); twBurst(gx, gy - 10, 5, 26, 0, 12, .4); } });
      tag(gx + 54, gy - 52, '−2', '255,224,120', .55, 18);
      at(.8, () => { glowCard(gen, GOLDC, 1100, 1.5); whoosh(0, .55, .26, 300, 1400); flash(gx, gy, 110, GOLDC, .6, .5); play('magic', 0, .3, 1.2); });
      lift(gen, -5, .8, .5); sigilo(gx, gy + 38, .7, .4, .78, 1.7); groundGlow(gx, gy + 38, 70, .8, 1.5); risers(gx, gy + 30, 50, 8, .95, 60, .9);
      tag(gx, gy - 66, 'Bênção', '255,238,175', .85, 17);
      orb({ from: { x: gx, y: gy - 30 }, to: { x: tx, y: ty - 10 }, dur: .62, delay: 1.3, arc: 120, onEnd() { ring(tx, ty - 10, 44, .4, '255,238,180', 3); ding(0, .16, 1500); twBurst(tx, ty - 10, 8, 34, 0, 13, .5); } });
      at(1.95, () => { glowCard(tgt, '255,238,175', 1500, 1.5); whoosh(0, .7, .22, 250, 900); flash(tx, ty, 100, '255,236,170', .65, .55); ding(0, .14, 1900); whiteFlash(.22, 0, .35); shake(.3, 2, 0); });
      pilar(tx, ty + 34, .7, 1.95, 1.7); sigilo(tx, ty + 40, .55, .4, 1.95, 1.6); groundGlow(tx, ty + 38, 64, 1.95, 1.5); lift(tgt, -7, 2.0, .8);
      heartAt(tx, ty - 28, .5, 2.2); num(tx + 20, ty - 56, '+1', 2.3, 32, 'heal'); twBurst(tx, ty, 14, 60, 2.0, 15, .8); risers(tx, ty + 30, 44, 10, 2.1, 80, 1.0);
    }
  },
  calice: {
    cap: 'Cálice da Graça (Relíquia: seu General dá +2 HP em vez de +1): a relíquia pousa, o campo escurece e ela transborda um pilar de luz; um fio de luz dourada escorre até o General (vários orbes em fila). Na bênção, o pilar desce sobre o aliado em dose dupla: um segundo pulso, dois corações e dois números +1.',
    run() {
      const gen = E(2, 'pGen'), gx = 195, gy = ROW.pGen, tgt = E(1, 'pFront'), tx = X(1), ty = Y('pFront');
      dim(TAC.x, TAC.y, 150, .5, 0, 1.2); dim(tx, ty, 120, .5, 2.2, 2.0);
      landTactic('../quarto/cards/calice-da-graca', () => {
        play('magic', 0, .4, 1.0); whoosh(0, .6, .26, 250, 1500); whiteFlash(.18, 0, .35);
        pilar(TAC.x, TAC.y + 44, .55, 0, 1.5, .85); ring(TAC.x, TAC.y, 120, .8, '255,224,140', 4); flash(TAC.x, TAC.y, 120, '255,224,140', .6, .5); twBurst(TAC.x, TAC.y, 14, 70, 0, 15, .8);
        for (let i = 0; i < 7; i++) orb({ from: { x: TAC.x, y: TAC.y + 30 }, to: { x: gx, y: gy - 20 }, dur: .75, delay: .45 + i * .07, arc: -50 + i * 8, size: 11 + (i % 2) * 3, onEnd() { if (i === 6) { glowCard(gen, GOLDC, 1100, 1.5); sigilo(gx, gy + 38, .7, .4, 0, 1.6); flash(gx, gy, 110, GOLDC, .6, .5); ding(0, .16, 1300); groundGlow(gx, gy + 38, 70, 0, 1.4); } } });
        tag(gx, gy - 66, 'Cálice', '255,238,175', 1.3, 16);
        orb({ from: { x: gx, y: gy - 30 }, to: { x: tx, y: ty - 10 }, dur: .55, delay: 1.75, arc: 120, onEnd() { ring(tx, ty - 10, 44, .4, '255,238,180', 3); ding(0, .16, 1500); } });
        at(2.3, () => { glowCard(tgt, '255,238,175', 1600, 1.5); ding(0, .14, 1800); flash(tx, ty, 110, '255,236,170', .65, .55); whiteFlash(.22, 0, .35); shake(.3, 2, 0); });
        pilar(tx, ty + 34, .7, 2.3, 1.7); sigilo(tx, ty + 40, .55, .4, 2.3, 1.6); groundGlow(tx, ty + 38, 64, 2.3, 1.5); lift(tgt, -7, 2.35, .9);
        at(2.62, () => { ding(0, .14, 2300); flash(tx, ty, 110, '255,246,200', .6, .45); ring(tx, ty, 60, .5, '255,246,200', 4); });
        pilar(tx - 16, ty + 36, .5, 2.62, 1.3, .8); pilar(tx + 16, ty + 36, .5, 2.74, 1.25, .75);
        heartAt(tx - 14, ty - 26, .42, 2.5); heartAt(tx + 14, ty - 26, .42, 2.78);
        num(tx - 14, ty - 58, '+1', 2.55, 28, 'heal'); num(tx + 16, ty - 58, '+1', 2.8, 28, 'heal'); twBurst(tx, ty, 20, 70, 2.5, 15, .9); risers(tx, ty + 30, 50, 14, 2.5, 90, 1.1);
      });
      leaveTactic(4.6);
    }
  },
  hospitalario: {
    cap: 'Cavaleiro Hospitalário, Comando (+1 HP a um aliado ferido e 1 de dano a um inimigo da Vanguarda): ele se ergue e junta luz; o aliado ferido recebe um pilar e um coração. Em seguida a luz vira um cometa sagrado, que cruza o campo escuro e se crava no inimigo em uma explosão de cruz de luz, com tremida e clarão.',
    run() {
      const kn = E(1, 'pFront'), kx = X(1), ky = Y('pFront'), ally = E(2, 'pFront'), ax = X(2), ay = Y('pFront'), foe = E(2, 'eFront'), fx = X(2), fy = Y('eFront');
      dim(kx, ky, 130, .45, 0, .9); dim(ax, ay, 110, .45, .8, 1.0); dim(195, 322, 300, .5, 1.7, .9);
      at(0, () => { kn.classList.remove('windup'); void kn.offsetWidth; kn.classList.add('windup'); glowCard(kn, GOLDC, 900, 1.4); whoosh(0, .4, .22, 300, 1200); });
      tag(kx, ky - 52, 'Comando', '255,238,175', .1, 15); charge(kx, ky - 10, 12, 60, .05, .45, 13); sigilo(kx, ky + 38, .5, .4, .1, 1.4); groundGlow(kx, ky + 38, 50, .1, 1.2);
      orb({ from: { x: kx, y: ky - 20 }, to: { x: ax, y: ay - 10 }, dur: .45, delay: .5, arc: 70, onEnd() { ring(ax, ay - 10, 38, .35, '255,238,180', 3); twBurst(ax, ay - 10, 6, 28, 0, 12, .4); } });
      at(1.0, () => { glowCard(ally, '255,238,175', 1200, 1.45); ding(0, .15, 1700); flash(ax, ay, 80, '255,236,170', .55, .45); });
      pilar(ax, ay + 34, .62, 1.0, 1.5); lift(ally, -6, 1.05, .6); heartAt(ax, ay - 26, .42, 1.2); num(ax + 16, ay - 52, '+1', 1.3, 28, 'heal'); risers(ax, ay + 28, 40, 7, 1.1, 70, .9);
      // o golpe sagrado
      at(1.65, () => { whoosh(0, .55, .3, 500, 2200); glowCard(kn, '255,200,110', 500, 1.4); play('magic', 0, .3, 1.5); });
      charge(kx, ky - 20, 10, 50, 1.55, .3, 14);
      cometaFly({ from: { x: kx, y: ky - 24 }, to: { x: fx, y: fy + 4 }, dur: .5, delay: 1.75, arc: 30, sc: .55, onEnd() { play('boom', 0, .4, 1.3); play('dano', 0, .4, 1.0); } });
      at(2.25, () => { cruzAt(fx, fy, .7, 0, .85); flash(fx, fy, 120, '255,230,150', .75, .4); shock(fx, fy, 80, .45, '255,236,170', 4); hit(foe, 0, false); sparks(fx, fy, 12, 1.0, '255,226,140'); shake(.35, 4, 0); whiteFlash(.3, 0, .3); twBurst(fx, fy, 16, 70, 0, 16, .7); });
      num(fx, fy - 40, '-1', 2.3, 32);
    }
  },
  nobre: {
    cap: 'Nobre da Cruzada, Convocação (Soldados Leais 1/1 nos espaços livres ao lado): o Nobre desce com estrondo e o campo escurece. Dois sigilos de rosácea acendem nos espaços livres ao lado dele, pilares de luz sobem e uma onda de choque corre pela fileira; dos pilares se materializam os Soldados Leais, num estouro de brilhos.',
    run() {
      const nb = E(2, 'pBack'), nx = X(2), ny = Y('pBack');
      nb.style.opacity = 0; dim(nx, ny, 190, .5, 0, 2.2);
      at(0, () => { nb.animate([{ opacity: 0, transform: 'translate(-50%,-50%) translateY(-130px) scale(1.8) rotate(-6deg)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: .6 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1.12,.88)', offset: .75 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }], { duration: 520, fill: 'forwards', easing: 'cubic-bezier(.45,0,.9,.55)' }); });
      at(.32, () => { nb.style.opacity = 1; play('dano', 0, .5, .6); play('boom', 0, .25, 1.4); dust(nx, ny + 36, 90, 8, 36); shock(nx, ny + 38, 130, .55, '255,226,170', 4); shake(.35, 5, 0); whiteFlash(.18, 0, .3); });
      tag(nx, ny - 56, 'Convocação', '255,238,175', .55, 16);
      at(.6, () => { glowCard(nb, GOLDC, 1000, 1.45); whoosh(0, .5, .26, 300, 1300); play('magic', 0, .3, 1.1); });
      charge(nx, ny, 14, 80, .55, .5, 14);
      [1, 3].forEach((c, k) => {
        const x = X(c), y = Y('pBack'), d = .85 + k * .2;
        sigilo(x, y + 36, .66, .4, d, 1.7); groundGlow(x, y + 36, 60, d, 1.5); pilar(x, y + 38, .62, d + .15, 1.5); charge(x, y, 10, 50, d + .2, .4, 12);
        at(d + .3, () => { flash(x, y, 100, '255,232,160', .55, .5); ding(0, .13, 1400 + k * 300); whoosh(0, .4, .2, 300, 1000); });
        at(d + .6, () => {
          const t = mk('img', 'card', `left:${x}px;top:${y}px;opacity:0`, cardsEl); t.src = CAPD + 'devotos-da-cruzada.webp'; t.draggable = false;
          tween(.5, p => { t.style.opacity = Math.min(1, p * 2.2); t.style.filter = `brightness(${1 + 2.4 * (1 - p)}) saturate(${.4 + .6 * p})`; setT(t, 0, -28 * (1 - eo(p)), 0, .76 + .24 * eo(p)); });
          at(.5, () => { ring(x, y, 54, .5, '255,238,180', 3); glint(x, y - 20, 36, .3); dust(x, y + 34, 50, 4, 24); twBurst(x, y, 12, 56, 0, 14, .7); whiteFlash(.12, 0, .25); play('dano', 0, .3, 1.4); });
        });
        tag(x, y - 54, 'Soldado Leal 1/1', '255,238,175', d + .9, 12);
      });
    }
  },
  soldados: {
    cap: 'Soldados da Ordem, Reforço (se a da frente cair, desce e ganha Escudo 2): a carta da frente é destruída e se desfaz em luz. A de trás desce numa trilha de brilhos, o campo escurece e a luz converge para ela; o escudo heráldico se forma com um clarão, pulsa e vira um emblema "2" que fica na carta.',
    run() {
      const front = E(0, 'pFront'), fx = X(0), fy = Y('pFront'), sol = E(0, 'pBack'), foe = E(0, 'eFront');
      tag(fx, fy - 56, 'a da frente cai', '255,130,110', .1, 13);
      lunge(foe, fx, fy, .2, 150, () => { hit(front, 0, false); num(fx, fy - 34, '-3', .05, 30); });
      dissolve(front, fx, fy, .75, .8);
      dim(fx, fy, 130, .5, 1.3, 2.0);
      at(1.45, () => { whoosh(0, .35, .28, 400, 1100); glowCard(sol, GOLDC, 600, 1.3); });
      slide(sol, 0, fy - Y('pBack'), .38, { delay: 1.5, ease: u => 1 - Math.pow(1 - u, 3), arc: 14 });
      for (let i = 0; i < 8; i++) twMove(fx + R(-8, 8), Y('pBack'), fx + R(-14, 14), fy + 20, R(10, 16), 1.5 + i * .04, .5, Math.floor(R(0, 4)), eo);
      at(1.88, () => { dust(fx, fy + 34, 60, 6, 30); shock(fx, fy + 36, 60, .4, '255,226,170', 3); play('dano', 0, .35, .8); shake(.25, 3, 0); });
      tag(fx, fy - 56, 'Reforço', '255,238,175', 1.55, 16);
      charge(fx, fy, 16, 80, 1.95, .5, 14); at(2.0, () => { play('magic', 0, .35, 1.3); whoosh(0, .5, .2, 300, 1200); });
      tween(1.6, p => { const fr = Math.min(19, Math.floor(p * 20)), c = fr % 5, r = Math.floor(fr / 5); const a = 1 - ei((p - .7) / .3); ctx.save(); ctx.globalAlpha = a; ctx.translate(fx, fy - 2); const s = .4 + .12 * (p > .7 ? (p - .7) / .3 * -1 : 0); ctx.scale(s, s); ctx.drawImage(IMG.escudo, c * 192, r * 224, 192, 224, -96, -112, 192, 224); ctx.restore(); }, 2.1);
      at(2.45, () => { ding(0, .16, 1500); ring(fx, fy, 60, .55, '255,226,150', 4); whiteFlash(.18, 0, .3); twBurst(fx, fy, 14, 56, 0, 14, .7); flash(fx, fy, 100, '255,226,150', .6, .4); });
      shieldBadge(fx, fy, 2, 3.5); tag(fx + 2, fy + 44, 'Escudo 2', '170,205,255', 2.5, 15);
    }
  },
  comandante: {
    cap: 'Comandante da Ordem, Postura (na Vanguarda, seus Infantaria e Arqueiros têm +1/+1 em combate): o campo escurece, a luz converge para ele e uma trompa de guerra faz ondas douradas saírem de um sigilo sagrado, com a tela tremendo. Orbes cruzam o campo até cada Infantaria e Arqueiro aliado, que se erguem com um brilho e mostram +1/+1.',
    run() {
      const cm = E(3, 'pFront'), cx = X(3), cy = Y('pFront');
      dim(195, 470, 260, .5, 0, 1.9); charge(cx, cy, 16, 80, 0, .55, 14);
      at(.45, () => { glowCard(cm, GOLDC, 1200, 1.5); play('boom', 0, .25, 1.8); whoosh(0, .5, .3, 150, 700); shake(.5, 3, 0); whiteFlash(.16, 0, .3); });
      lift(cm, -6, .45, .9); tag(cx, cy - 56, 'Postura', '255,238,175', .5, 16);
      sigilo(cx, cy + 38, .85, .42, .4, 2.2); groundGlow(cx, cy + 38, 90, .4, 2.0);
      [.45, .67, .89].forEach(d => trompaAt(cx, cy + 6, 1.6, d, .9, .85));
      flash(cx, cy, 140, GOLDC, .65, .55); shock(cx, cy + 6, 170, .8, '255,226,150', 4);
      const targets = [[0, 'pFront'], [4, 'pFront'], [0, 'pBack'], [4, 'pBack']];
      targets.forEach(([c, r], i) => { const x = X(c), y = Y(r), dist = Math.hypot(x - cx, y - cy), d = .65 + dist / 330 * .55;
        orb({ from: { x: cx, y: cy - 10 }, to: { x, y: y - 6 }, dur: d - .55, delay: .55, arc: 50 + i * 8, size: 11, color: '255,226,140' });
        at(d + .1, () => { glowCard(E(c, r), '255,232,160', 1600, 1.45); ring(x, y, 46, .5, '255,238,180', 3); glint(x, y - 24, 28, .3); play('dano', 0, .1, 1.8); twBurst(x, y, 9, 40, 0, 13, .6); });
        sigilo(x, y + 36, .42, .4, d + .1, 1.4); lift(E(c, r), -5, d + .12, .7);
        num(x, y - 38, '+1/+1', d + .15, 22, 'buff'); });
    }
  },
  retorno: {
    cap: 'Retorno do Soldado (leve 1 soldado do cemitério para a mão): a carta pousa, o campo escurece e um sigilo azul-claro de rosácea acende sobre o cemitério. Uma alma se ergue em espiral, deixando um rastro de brilhos azuis; no alto ela vira carta e voa até a mão, onde chega com um clarão.',
    run() {
      [-6, 0, 5].forEach((rot, i) => { const g = cardBack(GRAVE.x, GRAVE.y, .95); setT(g, 0, -i * 1.5, rot * 1.4, .95); });
      dim(GRAVE.x, GRAVE.y - 30, 170, .55, 0, 2.6);
      landTactic('../quarto/cards/retorno-do-soldado', () => {
        play('magic', 0, .4, .9); whoosh(0, .7, .22, 120, 600);
        orb({ from: { x: TAC.x + 20, y: TAC.y }, to: { x: GRAVE.x - 6, y: GRAVE.y - 4 }, dur: .5, arc: -20, size: 12, color: '190,215,255' });
        sigilo(GRAVE.x, GRAVE.y + 26, .66, .42, .45, 2.0, 'azul'); groundGlow(GRAVE.x, GRAVE.y + 26, 70, .45, 1.8, HOLYC);
        at(.55, () => { flash(GRAVE.x, GRAVE.y, 100, '190,215,255', .6, .55); ding(0, .13, 1100); ring(GRAVE.x, GRAVE.y, 56, .6, '190,215,255', 3); });
        charge(GRAVE.x, GRAVE.y - 4, 12, 60, .5, .5, 13);
        // a alma sobe em espiral, com rastro de brilhos azuis
        tween(1.4, p => { const e = eo(p), r0 = 28 * (1 - p) + 4, x = GRAVE.x + Math.sin(p * 11) * r0, y = GRAVE.y - 4 - e * 98;
          almaAt(x, y + 20, .72 + .15 * e, p * 1.3, Math.min(1, p * 3) * (1 - ei((p - .85) / .15)));
          if (Math.random() < .9) add({ dur: .5, draw(q) { const fr = Math.min(7, Math.floor(q * 8)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8; ctx.translate(x + R(-4, 4), y + 22 + q * 18); ctx.drawImage(IMG.brilhos, fr * 64, 64, 64, 64, -9, -9, 18, 18); ctx.restore(); } }); }, .75);
        at(2.05, () => { ring(GRAVE.x, GRAVE.y - 100, 40, .4, '190,215,255', 3); flash(GRAVE.x, GRAVE.y - 100, 80, '210,228,255', .65, .4); twBurst(GRAVE.x, GRAVE.y - 100, 12, 46, 0, 14, .6); });
        flyBack({ x: GRAVE.x, y: GRAVE.y - 100 }, HAND, .65, 2.1, () => { ding(0, .16, 1600); ring(HAND.x, HAND.y - 40, 56, .45, '255,238,180', 3); flash(HAND.x, HAND.y - 30, 100, '255,238,180', .6, .45); twBurst(HAND.x, HAND.y - 40, 10, 44, 0, 13, .6); }, 80);
        tag(195, 598, '+1 soldado', '200,235,255', 2.6, 17);
      });
      leaveTactic(2.4);
    }
  },
  atirador: {
    cap: 'Atirador da Cruzada, Queda (compre 2 cartas): ao ser destruído, o Atirador se desfaz em luz e brilhos, o campo escurece e penas brancas caem lentas sobre o lugar dele sob um facho de luz suave; duas cartas voam do lugar até a mão, deixando rastros, e chegam com um clarão.',
    run() {
      const at_ = E(4, 'pBack'), x = X(4), y = Y('pBack'), foe = E(4, 'eFront');
      dim(x, y, 150, .5, .5, 2.0);
      lunge(foe, x, y - 6, .1, 150, () => { hit(at_, 0, true); num(x, y - 34, '-3', .05, 30); });
      dissolve(at_, x, y, .65, .8);
      tag(x, y - 54, 'Queda', '255,238,175', .75, 17);
      at(.8, () => { whoosh(0, .8, .2, 700, 300); play('magic', 0, .3, 1.5); flash(x, y, 100, '255,244,210', .55, .6); });
      tween(2.1, p => { const fr = Math.min(23, Math.floor(p * 24)); sheetXY(IMG.penas, 6, 256, 320, fr, x, y - 4, .8, .8, 1, 'source-over', .5, .55); }, .8);
      pilar(x, y + 34, .55, .8, 1.5, .6); groundGlow(x, y + 30, 50, .8, 1.6, '255,244,210', .4); risers(x, y + 20, 40, 8, .9, 70, 1.0);
      flyBack({ x, y }, HAND, .6, 1.35, () => { ding(0, .15, 1500); twBurst(HAND.x, HAND.y - 40, 8, 40, 0, 12, .5); }, 90);
      flyBack({ x, y }, { x: HAND.x + 22, y: HAND.y }, .6, 1.6, () => { ding(0, .15, 1800); ring(HAND.x, HAND.y - 40, 56, .45, '255,238,180', 3); flash(HAND.x, HAND.y - 30, 100, '255,238,180', .6, .45); twBurst(HAND.x + 10, HAND.y - 40, 10, 44, 0, 13, .6); }, 100);
      for (let i = 0; i < 2; i++) at(1.35 + i * .25, () => { for (let k = 0; k < 6; k++) twMove(x, y, x + (HAND.x - x) * (.3 + .1 * k) + R(-12, 12), y + (HAND.y - y) * (.3 + .1 * k) + R(-12, 12), R(9, 14), k * .05, .35, Math.floor(R(0, 4)), u => u); });
      tag(195, 598, '+2 cartas', '200,235,255', 2.0, 17);
    }
  },
};
