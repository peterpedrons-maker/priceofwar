// ══ efeitos do Cardeal: auxiliares ═══════════════════════════════════════════════════════════════════════════════
const GRAVE = { x: 352, y: 332 }, HAND = { x: 195, y: 652 };
// pilar de luz sagrada: o pé fica em (x, y); sheet de 192x384, o chão está a 86% da altura
function pilar(x, y, sc = .55, delay = 0, dur = 1.5, alpha = 1) {
  at(delay, () => add({ dur, draw(p) { const fr = Math.min(23, Math.floor(p * 24)), c = fr % 6, r = Math.floor(fr / 6);
    ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(sc * 1.2, sc * .72);
    ctx.drawImage(IMG.pilar, c * 192, r * 384, 192, 384, -96, -384 * .86, 192, 384); ctx.restore(); } }));
}
// sigilo sagrado no chão (achatado em elipse); color 'gold' ou 'azul'
function sigilo(x, y, sc = .6, sy = .42, delay = 0, dur = 1.6, color = 'gold', alpha = 1) {
  at(delay, () => add({ dur, draw(p) { const fr = Math.min(23, Math.floor(p * 24)), c = fr % 6, r = Math.floor(fr / 6);
    ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(sc, sc * sy);
    ctx.drawImage(color === 'azul' ? IMG.sigilo_azul : IMG.sigilo, c * 256, r * 256, 256, 256, -128, -128, 256, 256); ctx.restore(); } }));
}
function cruzAt(x, y, sc = .5, delay = 0, dur = .7) {
  at(delay, () => add({ dur, draw(p) { sheetXY(IMG.cruz, 4, 256, 256, Math.min(15, Math.floor(p * 16)), x, y, sc, sc, 1, 'lighter'); } }));
}
function trompaAt(x, y, sc = 1, delay = 0, dur = .8, alpha = 1) {
  at(delay, () => add({ dur, draw(p) { sheetXY(IMG.trompa, 4, 256, 256, Math.min(15, Math.floor(p * 16)), x, y, sc, sc * .62, alpha, 'lighter'); } }));
}
function almaAt(x, y, sc = .6, t, alpha = 1) {
  const fr = Math.floor(t * 14) % 16, c = fr % 8;
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.drawImage(IMG.alma, c * 128, 0, 128, 192, -64, -192 * .62, 128, 192); ctx.restore();
}
// orbe de luz que voa de um ponto a outro deixando rastro; color 'r,g,b'
function orb({ from, to, dur = .6, delay = 0, arc = 60, size = 15, color = '255,232,150', onEnd }) {
  at(delay, () => add({ dur, draw(p) {
    const u = p * p * (3 - 2 * p) * .4 + p * .6, x = from.x + (to.x - from.x) * u, y = from.y + (to.y - from.y) * u - arc * 4 * u * (1 - u);
    for (let i = 0; i < 2; i++) add({ dur: .38, draw(q) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${color},${.7 * (1 - q)})`; ctx.beginPath(); ctx.arc(x + R(-4, 4), y + R(-4, 4), size * .3 * (1 - q) + .6, 0, 7); ctx.fill(); ctx.restore(); } });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, size * 1.9); g.addColorStop(0, 'rgba(255,255,245,1)'); g.addColorStop(.28, `rgba(${color},.9)`); g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - size * 2, y - size * 2, size * 4, size * 4); ctx.restore();
  }, end() { onEnd && onEnd(); } }));
}
// dissolve uma carta em luz (some subindo e deixando fagulhas)
function dissolve(el, x, y, delay = 0, dur = .8, color = '255,226,150') {
  tween(dur, p => { el.style.opacity = 1 - ei(clamp((p - .1) / .8)); el.style.filter = `brightness(${1 + 1.4 * Math.sin(Math.min(1, p * 1.6) * Math.PI * .8)}) saturate(${1 - p * .6})`; setT(el, 0, -10 * p, 0, 1 + .05 * p); }, delay, () => { el.style.opacity = 0; });
  for (let i = 0; i < 20; i++) at(delay + R(0, .5), () => { const px = x + R(-24, 24), py = y + R(-34, 34), vy = -R(30, 90);
    add({ dur: R(.6, 1.1), draw(p) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${color},${1 - p})`; ctx.beginPath(); ctx.arc(px + Math.sin(p * 6 + i) * 5, py + vy * p, 1.8 * (1 - p) + .6, 0, 7); ctx.fill(); ctx.restore(); } }); });
}
// a carta é atacada: investida do atacante, impacto e tremida
function lunge(att, defX, defY, delay = 0, dy = 120, onHit) {
  slide(att, 0, dy, .2, { delay, ease: u => u * u }); at(delay + .2, () => { shake(.25, 4, 0); play('dano', 0, .5, .9); explosion(defX, defY, .38, 0, 1); flash(defX, defY, 80, '255,170,90', .6, .3); onHit && onHit(); });
  slide(att, 0, 0, .35, { delay: delay + .3 });
}

// ══ cenas do Cardeal ══════════════════════════════════════════════════════════════════════════════════════════════
const scenes = {
  bencao: {
    cap: 'Cardeal Pedro, Comando (pague 2 de ouro: +1 HP): duas moedas saem do contador e se apagam no General; um sigilo sagrado acende aos pés dele, um orbe de luz sobe e voa até o aliado, e sobre ele desce um pilar de luz com poeira dourada subindo e o +1.',
    run() {
      const gen = E(2, 'pGen'), gx = 195, gy = ROW.pGen, tgt = E(1, 'pFront'), tx = X(1), ty = Y('pFront');
      setGold(7);
      for (let n = 0; n < 2; n++) coinFly({ from: GOLD, to: { x: gx, y: gy - 10 }, dur: .55, delay: .2 + n * .14, arc: 70, size: 22, onEnd() { clink(0, .2); addGold(-1); ring(gx, gy - 10, 34, .3, '255,214,110', 3); glint(gx, gy - 10, 30, .22); } });
      tag(gx + 52, gy - 52, '−2', '255,224,120', .5, 18);
      at(.8, () => { glowCard(gen, '255,232,160', 1000, 1.45); whoosh(0, .55, .26, 300, 1400); flash(gx, gy, 100, '255,232,160', .55, .45); play('magic', 0, .3, 1.2); });
      sigilo(gx, gy + 38, .66, .4, .78, 1.5);
      tag(gx, gy - 66, 'Bênção', '255,238,175', .85, 17);
      orb({ from: { x: gx, y: gy - 30 }, to: { x: tx, y: ty - 10 }, dur: .6, delay: 1.25, arc: 110, onEnd() { ring(tx, ty - 10, 40, .4, '255,238,180', 3); ding(0, .16, 1500); } });
      at(1.85, () => { glowCard(tgt, '255,238,175', 1300, 1.4); whoosh(0, .7, .22, 250, 900); flash(tx, ty, 90, '255,236,170', .55, .5); ding(0, .14, 1900); });
      pilar(tx, ty + 34, .66, 1.85, 1.55); sigilo(tx, ty + 40, .5, .4, 1.85, 1.4);
      num(tx, ty - 34, '+1', 2.05, 32, 'heal');
      for (let i = 0; i < 3; i++) at(2.0 + i * .18, () => sparksDir(tx + R(-18, 18), ty + 20, -Math.PI / 2, .35, 5, .35, '255,240,170'));
    }
  },
  calice: {
    cap: 'Cálice da Graça (Relíquia: seu General dá +2 HP em vez de +1): a relíquia pousa e transborda luz dourada, que escorre como um fio até o General; na bênção seguinte o pilar desce em dose dupla (dois pulsos) e o número mostra +2.',
    run() {
      const gen = E(2, 'pGen'), gx = 195, gy = ROW.pGen, tgt = E(1, 'pFront'), tx = X(1), ty = Y('pFront');
      landTactic('../quarto/cards/calice-da-graca', () => {
        play('magic', 0, .4, 1.0); whoosh(0, .6, .26, 250, 1500);
        pilar(TAC.x, TAC.y + 40, .5, 0, 1.4, .8); ring(TAC.x, TAC.y, 120, .8, '255,224,140', 4); flash(TAC.x, TAC.y, 120, '255,224,140', .6, .5);
        orb({ from: { x: TAC.x, y: TAC.y + 30 }, to: { x: gx, y: gy - 20 }, dur: .75, delay: .5, arc: -30, size: 17, onEnd() { glowCard(gen, '255,232,160', 1000, 1.45); sigilo(gx, gy + 38, .66, .4, 0, 1.5); flash(gx, gy, 110, '255,232,160', .6, .5); ding(0, .16, 1300); } });
        tag(gx, gy - 66, 'Cálice', '255,238,175', 1.3, 16);
        orb({ from: { x: gx, y: gy - 30 }, to: { x: tx, y: ty - 10 }, dur: .55, delay: 1.7, arc: 110, onEnd() { ring(tx, ty - 10, 40, .4, '255,238,180', 3); ding(0, .16, 1500); } });
        at(2.25, () => { glowCard(tgt, '255,238,175', 1400, 1.45); ding(0, .14, 1800); flash(tx, ty, 100, '255,236,170', .6, .5); });
        pilar(tx, ty + 34, .66, 2.25, 1.55); sigilo(tx, ty + 40, .5, .4, 2.25, 1.4);
        pilar(tx - 14, ty + 36, .5, 2.55, 1.3, .8); pilar(tx + 14, ty + 36, .5, 2.7, 1.2, .7);
        num(tx - 12, ty - 34, '+1', 2.4, 30, 'heal'); num(tx + 12, ty - 34, '+1', 2.7, 30, 'heal');
        at(2.6, () => ding(0, .14, 2200));
      });
      leaveTactic(4.4);
    }
  },
  hospitalario: {
    cap: 'Cavaleiro Hospitalário, Comando (+1 HP a um aliado ferido e 1 de dano a um inimigo da Vanguarda): ele ergue a mão e o aliado ferido recebe um pilar de luz; depois um cometa sagrado cruza o campo e explode em cruz de luz sobre o inimigo.',
    run() {
      const kn = E(1, 'pFront'), kx = X(1), ky = Y('pFront'), ally = E(2, 'pFront'), ax = X(2), ay = Y('pFront'), foe = E(2, 'eFront'), fx = X(2), fy = Y('eFront');
      at(0, () => { kn.classList.remove('windup'); void kn.offsetWidth; kn.classList.add('windup'); glowCard(kn, '255,232,160', 900, 1.35); whoosh(0, .4, .22, 300, 1200); });
      tag(kx, ky - 52, 'Comando', '255,238,175', .1, 15);
      sigilo(kx, ky + 38, .5, .4, .1, 1.4);
      orb({ from: { x: kx, y: ky - 20 }, to: { x: ax, y: ay - 10 }, dur: .45, delay: .45, arc: 70, onEnd() { ring(ax, ay - 10, 36, .35, '255,238,180', 3); } });
      at(.95, () => { glowCard(ally, '255,238,175', 1100, 1.4); ding(0, .15, 1700); flash(ax, ay, 80, '255,236,170', .5, .45); });
      pilar(ax, ay + 34, .6, .95, 1.4); num(ax, ay - 34, '+1', 1.1, 28, 'heal');
      // o golpe sagrado
      at(1.55, () => { whoosh(0, .55, .3, 500, 2200); glowCard(kn, '255,200,110', 500, 1.35); });
      orb({ from: { x: kx, y: ky - 24 }, to: { x: fx, y: fy + 4 }, dur: .5, delay: 1.6, arc: 20, size: 14, color: '255,214,110', onEnd() { play('boom', 0, .35, 1.3); play('dano', 0, .4, 1.0); } });
      at(2.1, () => { cruzAt(fx, fy, .62, 0, .75); flash(fx, fy, 110, '255,230,150', .7, .35); shock(fx, fy, 72, .4, '255,236,170', 3); hit(foe, 0, false); sparks(fx, fy, 10, .9, '255,226,140'); shake(.3, 3, 0); });
      num(fx, fy - 38, '-1', 2.15, 30);
    }
  },
  nobre: {
    cap: 'Nobre da Cruzada, Convocação (Soldados Leais 1/1 nos espaços livres ao lado): o Nobre desce com um estrondo e dois sigilos sagrados acendem nos espaços livres ao lado dele; pilares de luz sobem e deles se materializam os Soldados Leais.',
    run() {
      const nb = E(2, 'pBack'), nx = X(2), ny = Y('pBack');
      nb.style.opacity = 0;
      at(0, () => { nb.animate([{ opacity: 0, transform: 'translate(-50%,-50%) translateY(-120px) scale(1.7) rotate(-6deg)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: .6 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1.1,.9)', offset: .75 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }], { duration: 520, fill: 'forwards', easing: 'cubic-bezier(.45,0,.9,.55)' }); });
      at(.32, () => { nb.style.opacity = 1; play('dano', 0, .5, .6); dust(nx, ny + 36, 90, 8, 36); shock(nx, ny + 38, 80, .45, '255,226,170', 3); shake(.3, 4, 0); });
      tag(nx, ny - 56, 'Convocação', '255,238,175', .55, 16);
      at(.6, () => { glowCard(nb, '255,226,150', 900, 1.4); whoosh(0, .5, .26, 300, 1300); play('magic', 0, .3, 1.1); });
      [1, 3].forEach((c, k) => {
        const x = X(c), y = Y('pBack'), d = .85 + k * .18;
        sigilo(x, y + 36, .62, .4, d, 1.5); pilar(x, y + 38, .56, d + .15, 1.4);
        at(d + .3, () => { flash(x, y, 90, '255,232,160', .5, .45); ding(0, .13, 1400 + k * 300); whoosh(0, .4, .2, 300, 1000); });
        at(d + .55, () => {
          const t = mk('img', 'card', `left:${x}px;top:${y}px;opacity:0`, cardsEl); t.src = CAPD + 'devotos-da-cruzada.webp'; t.draggable = false;
          tween(.5, p => { t.style.opacity = Math.min(1, p * 2.2); t.style.filter = `brightness(${1 + 2.2 * (1 - p)}) saturate(${.4 + .6 * p})`; setT(t, 0, -26 * (1 - eo(p)), 0, .78 + .22 * eo(p)); });
          at(.5, () => { ring(x, y, 50, .45, '255,238,180', 3); glint(x, y - 20, 34, .28); dust(x, y + 34, 50, 4, 24); });
        });
        tag(x, y - 52, 'Soldado Leal 1/1', '255,238,175', d + .8, 12);
      });
    }
  },
  soldados: {
    cap: 'Soldados da Ordem, Reforço (se a da frente cair, desce e ganha Escudo 2): a carta da frente é destruída e se desfaz em luz; a de trás avança com poeira para o lugar e um escudo heráldico dourado se forma sobre ela, mostrando o Escudo 2.',
    run() {
      const front = E(0, 'pFront'), fx = X(0), fy = Y('pFront'), sol = E(0, 'pBack'), foe = E(0, 'eFront');
      tag(fx, fy - 56, 'a da frente cai', '255,130,110', .1, 13);
      lunge(foe, fx, fy, .2, 150, () => { hit(front, 0, false); num(fx, fy - 34, '-3', .05, 30); });
      dissolve(front, fx, fy, .75, .8, '255,214,130');
      at(.95, () => { play('dano', 0, .3, 1.5); });
      // reforço: desce
      at(1.45, () => { whoosh(0, .35, .28, 400, 1100); glowCard(sol, '255,226,150', 600, 1.3); });
      slide(sol, 0, fy - Y('pBack'), .38, { delay: 1.5, ease: u => 1 - Math.pow(1 - u, 3), arc: 14 });
      at(1.88, () => { dust(fx, fy + 34, 60, 6, 30); shock(fx, fy + 36, 56, .35, '255,226,170', 3); play('dano', 0, .35, .8); shake(.2, 3, 0); });
      tag(fx, fy - 56, 'Reforço', '255,238,175', 1.55, 16);
      // escudo 2
      at(1.95, () => { play('magic', 0, .35, 1.3); });
      tween(1.7, p => { const fr = Math.min(19, Math.floor(p * 20)), c = fr % 5, r = Math.floor(fr / 5); ctx.save(); ctx.translate(fx, fy - 2); ctx.scale(.4, .4); ctx.drawImage(IMG.escudo, c * 192, r * 224, 192, 224, -96, -112, 192, 224); ctx.restore(); }, 1.95);
      at(2.3, () => { ding(0, .16, 1500); ring(fx, fy, 56, .5, '255,226,150', 3); });
      tag(fx + 2, fy + 42, 'Escudo 2', '170,205,255', 2.35, 15);
    }
  },
  comandante: {
    cap: 'Comandante da Ordem, Postura (na Vanguarda, seus Infantaria e Arqueiros têm +1/+1 em combate): o toque de uma trompa de guerra abre ondas douradas sobre um sigilo sagrado; a onda alcança cada Infantaria e Arqueiro aliado, que brilham e ganham +1/+1.',
    run() {
      const cm = E(3, 'pFront'), cx = X(3), cy = Y('pFront');
      at(0, () => { glowCard(cm, '255,226,150', 1100, 1.45); play('boom', 0, .22, 1.8); whoosh(0, .5, .3, 150, 700); shake(.35, 2.5, 0); });
      tag(cx, cy - 56, 'Postura', '255,238,175', .1, 16);
      sigilo(cx, cy + 38, .8, .42, 0, 2.2);
      [0, .22, .44].forEach(d => trompaAt(cx, cy + 6, 1.55, d, .9, .85));
      flash(cx, cy, 130, '255,226,150', .6, .5);
      const targets = [[0, 'pFront'], [4, 'pFront'], [0, 'pBack'], [4, 'pBack']];
      targets.forEach(([c, r], i) => { const x = X(c), y = Y(r), dist = Math.hypot(x - cx, y - cy), d = .3 + dist / 330 * .55;
        orb({ from: { x: cx, y: cy - 10 }, to: { x, y: y - 6 }, dur: d - .05, delay: .15, arc: 50 + i * 8, size: 11, color: '255,226,140' });
        at(d + .1, () => { glowCard(E(c, r), '255,232,160', 1500, 1.4); ring(x, y, 44, .5, '255,238,180', 3); sparksDir(x, y, -Math.PI / 2, 1.0, 7, .45, '255,226,140'); glint(x, y - 24, 26, .3); play('dano', 0, .1, 1.8); });
        num(x, y - 38, '+1/+1', d + .15, 22, 'buff'); });
    }
  },
  retorno: {
    cap: 'Retorno do Soldado (leve 1 soldado do cemitério para a mão): a carta pousa, um sigilo azul-claro acende sobre o cemitério e uma alma se ergue em espiral; ela voa até a mão do jogador e vira carta.',
    run() {
      // cemitério: pilha de cartas viradas
      [-6, 0, 5].forEach((rot, i) => { const g = cardBack(GRAVE.x, GRAVE.y, .95); setT(g, 0, -i * 1.5, rot * 1.4, .95); });
      landTactic('../quarto/cards/retorno-do-soldado', () => {
        play('magic', 0, .4, .9); whoosh(0, .7, .22, 120, 600);
        orb({ from: { x: TAC.x + 20, y: TAC.y }, to: { x: GRAVE.x - 6, y: GRAVE.y - 4 }, dur: .5, arc: -20, size: 12, color: '190,215,255' });
        sigilo(GRAVE.x, GRAVE.y + 26, .62, .42, .45, 1.8, 'azul');
        at(.55, () => { flash(GRAVE.x, GRAVE.y, 90, '190,215,255', .55, .5); ding(0, .13, 1100); ring(GRAVE.x, GRAVE.y, 52, .6, '190,215,255', 3); });
        // a alma sobe em espiral
        tween(1.3, p => { const e = eo(p), a = Math.sin(Math.min(1, p * 1.3) * Math.PI) ** .5, r0 = 26 * (1 - p) + 4;
          const x = GRAVE.x + Math.sin(p * 11) * r0, y = GRAVE.y - 4 - e * 96; almaAt(x, y + 20, .72 + .15 * e, p * 1.3, Math.min(1, p * 3) * (1 - ei((p - .85) / .15))); }, .75);
        for (let i = 0; i < 3; i++) at(.9 + i * .22, () => sparksDir(GRAVE.x + R(-12, 12), GRAVE.y - 20, -Math.PI / 2, .5, 4, .3, '190,215,255'));
        // vira carta e voa para a mão
        at(2.0, () => { ring(GRAVE.x, GRAVE.y - 100, 36, .35, '190,215,255', 3); flash(GRAVE.x, GRAVE.y - 100, 70, '210,228,255', .6, .35); });
        flyBack({ x: GRAVE.x, y: GRAVE.y - 100 }, HAND, .65, 2.05, () => { ding(0, .16, 1600); ring(HAND.x, HAND.y - 40, 50, .4, '255,238,180', 3); }, 80);
        tag(195, 598, '+1 soldado', '200,235,255', 2.55, 17);
      });
      leaveTactic(2.4);
    }
  },
  atirador: {
    cap: 'Atirador da Cruzada, Queda (compre 2 cartas): ao ser destruído, o Atirador se desfaz em luz e penas brancas caem lentas sobre o lugar dele; duas cartas voam do baralho até a mão.',
    run() {
      const at_ = E(4, 'pBack'), x = X(4), y = Y('pBack'), foe = E(4, 'eFront');
      lunge(foe, X(4), Y('pBack') - 6, .1, 150, () => { hit(at_, 0, true); num(x, y - 34, '-3', .05, 30); });
      dissolve(at_, x, y, .65, .8, '255,244,210');
      tag(x, y - 54, 'Queda', '255,238,175', .75, 17);
      at(.8, () => { whoosh(0, .8, .2, 700, 300); play('magic', 0, .3, 1.5); flash(x, y, 90, '255,244,210', .5, .6); });
      tween(2.0, p => { const fr = Math.min(23, Math.floor(p * 24)); sheetXY(IMG.penas, 6, 256, 320, fr, x, y - 4, .72, .72, 1, 'source-over', .5, .55); }, .8);
      pilar(x, y + 34, .5, .8, 1.4, .6);
      flyBack({ x, y }, HAND, .6, 1.3, () => ding(0, .15, 1500), 90); flyBack({ x, y }, { x: HAND.x + 22, y: HAND.y }, .6, 1.55, () => { ding(0, .15, 1800); ring(HAND.x, HAND.y - 40, 50, .4, '255,238,180', 3); }, 100);
      tag(195, 598, '+2 cartas', '200,235,255', 1.95, 17);
    }
  },
};
