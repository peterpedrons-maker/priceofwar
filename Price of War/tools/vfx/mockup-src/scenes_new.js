
// ══ novos auxiliares (efeitos das cartas únicas) ═══════════════════════════════════════════════════════════════════
const extras = [];                                         // elementos de DOM criados por uma cena (saem quando a próxima começa)
function mk(tag, cls, css, parent) { const d = document.createElement(tag); if (cls) d.className = cls; if (css) d.style.cssText = css; (parent || $('#stage')).appendChild(d); extras.push(d); return d; }
const E = (col, row) => cardByPos(COLX[col], ROW[row]);
const X = c => COLX[c], Y = r => ROW[r];
const setT = (el, dx = 0, dy = 0, rot = 0, s = 1) => { el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(${s})`; };
// anima algo que se desenha sozinho (DOM ou canvas) dentro da linha do tempo, então respeita a câmera lenta
function tween(dur, fn, delay = 0, final) { at(delay, () => add({ dur, draw: fn, end() { fn(1); final && final(); } })); }
function sheetXY(img, cols, fw, fh, frame, x, y, sx, sy, alpha, mode, ax = .5, ay = .5) {
  const c = frame % cols, r = Math.floor(frame / cols);
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = mode || 'source-over'; ctx.translate(x, y); ctx.scale(sx, sy);
  ctx.drawImage(img, c * fw, r * fh, fw, fh, -fw * ax, -fh * ay, fw, fh); ctx.restore();
}
function glowCard(el, rgb = '255,214,110', dur = 600, b = 1.35) { const a = el.animate([{ filter: 'brightness(1)' }, { filter: `brightness(${b}) drop-shadow(0 0 12px rgba(${rgb},.95))`, offset: .3 }, { filter: 'brightness(1)' }], { duration: dur }); a.playbackRate = speed; }
function tag(x, y, text, color = '255,224,120', delay = 0, size = 17) {
  at(delay, () => { const d = mk('div', 'tag', `left:${x}px;top:${y}px;font-size:${size}px;color:rgb(${color})`); d.textContent = text; setTimeout(() => d.remove(), 1750 / speed); });
}
function shake(dur = .5, amp = 5, delay = 0) {
  tween(dur, p => { const k = amp * (1 - p) * (1 - p), dx = Math.sin(p * 90) * k, dy = Math.cos(p * 70) * k * .7; cardsEl.style.transform = cv.style.transform = `translate(${dx}px,${dy}px)`; }, delay, () => { cardsEl.style.transform = ''; cv.style.transform = ''; });
}
// ouro: o contador e as moedas
const GOLD = { x: 34, y: 322 }; let goldN = 0;
const setGold = n => { goldN = n; $('#goldn').textContent = n; };
const addGold = d => { setGold(goldN + d); const g = $('#gold'); g.classList.remove('pop'); void g.offsetWidth; g.classList.add('pop'); };
function ding(when = 0, vol = .22, f = 1760) {
  if (!sndOn()) return; const t = AC.currentTime + when;
  [[1, 1], [2.76, .45], [5.4, .22]].forEach(([m, a]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = f * m;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol * a, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .55); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + .6); });
}
function clink(when = 0, vol = .18) { ding(when, vol, 2400 + R(0, 700)); }
const COIN_FR = 16;
function coinAt(x, y, size, t, alpha = 1, rot = 0, speedK = 18) {
  const fr = Math.floor(t * speedK) % COIN_FR, c = fr % 8, r = Math.floor(fr / 8);
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 4;
  ctx.drawImage(IMG.coin, c * 96, r * 96, 96, 96, -size / 2, -size / 2, size, size); ctx.restore();
}
function coinFly({ from, to, dur = .5, delay = 0, arc = 50, size = 22, onEnd, ph = R(0, 1) }) {
  at(delay, () => add({ dur, draw(p) {
    const u = p * p * (3 - 2 * p) * .35 + p * .65, x = from.x + (to.x - from.x) * u, y = from.y + (to.y - from.y) * u - arc * 4 * u * (1 - u);
    if (Math.random() < .7) add({ dur: .3, draw(q) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,224,130,${.8 * (1 - q)})`; ctx.beginPath(); ctx.arc(x + R(-3, 3), y + R(-3, 3), 2.2 * (1 - q) + .4, 0, 7); ctx.fill(); ctx.restore(); } });
    coinAt(x, y, size * (1 - .2 * u), p * dur + ph);
  }, end() { onEnd && onEnd(); } }));
}
// moedas que saltam para os lados e caem
function coinBurst(x, y, n = 8, power = 1, delay = 0, ground = 28) {
  at(delay, () => { for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + R(-1.3, 1.3), sp = R(120, 300) * power, vx = Math.cos(a) * sp, vy = Math.sin(a) * sp, g = 700, life = R(.9, 1.3), ph = R(0, 1), size = R(15, 21);
    add({ dur: life, draw(p) { const t = p * life; let py = y + vy * t + .5 * g * t * t, px = x + vx * t, onG = false;
      if (py > y + ground) { py = y + ground - Math.abs(Math.sin((t - .55) * 8)) * 3 * Math.exp(-(t - .55) * 4); onG = true; px = x + vx * .55 + vx * (t - .55) * .12; }
      coinAt(px, py, size, onG ? ph : t + ph, 1 - ei((p - .78) / .22), 0, onG ? 0 : 18); } });
  } });
}
function cardBack(x, y, scale = 1) {
  const d = mk('div', 'cb', `left:${x}px;top:${y}px;`); setT(d, 0, 0, 0, scale); return d;
}
function flyBack(from, to, dur = .55, delay = 0, onEnd, arc = 60) {
  at(delay, () => { const d = cardBack(from.x, from.y, .7);
    tween(dur, p => { const u = eo(p), x = from.x + (to.x - from.x) * u, y = from.y + (to.y - from.y) * u - arc * 4 * u * (1 - u); d.style.left = x + 'px'; d.style.top = y + 'px'; setT(d, 0, 0, (1 - u) * -12, .7 + .15 * Math.sin(p * Math.PI)); d.style.opacity = 1 - ei((p - .85) / .15); }, 0, () => { d.remove(); onEnd && onEnd(); }); });
}
// uma carta de Emboscada se revela no meio do tabuleiro (vira de costas para a frente) e some
function popCard(path, delay = 0, hold = 1.0) {
  at(delay, () => { const im = mk('img', 'card big', `left:${TAC.x}px;top:${TAC.y}px;width:86px;z-index:6;opacity:0`, cardsEl); im.src = path + '.webp'; im.draggable = false;
    tween(.3, p => { const s = eo(p); im.style.opacity = Math.min(1, p * 4); im.style.transform = `translate(-50%,-50%) scale(${.35 + .65 * s},${.35 + .65 * s}) perspective(300px) rotateY(${(1 - s) * 80}deg)`; im.style.filter = `brightness(${1 + .7 * (1 - p)}) drop-shadow(0 0 ${16 * p}px rgba(255,214,120,.95))`; });
    at(.3, () => { flash(TAC.x, TAC.y, 100, '255,226,150', .55, .3); ding(0, .14, 1300); ring(TAC.x, TAC.y, 60, .4, '255,226,150', 3); });
    tween(.3, p => { im.style.opacity = 1 - p; im.style.transform = `translate(-50%,-50%) scale(${1 + .12 * p})`; }, hold, () => im.remove()); });
}
// uma carta anda de um lugar a outro (com arco, giro e escala), desenhada pela linha do tempo; fica no destino até a próxima cena
function slide(el, dx, dy, dur, { arc = 0, rot = 0, ease = eo, delay = 0, sc = 1, keep = true } = {}) {
  at(delay, () => add({ dur, draw(p) { const u = ease(p), h = arc ? 4 * u * (1 - u) : 0; setT(el, dx * u, dy * u - arc * h, rot * u, 1 + (sc - 1) * u + (arc ? .08 * h : 0)); },
    end() { if (keep) setT(el, dx, dy, rot, sc); else setT(el); } }));
}
// onda de comando: um anel que corre pela fileira
function rowWave(y, color = '255,214,110', delay = 0, dur = .6) {
  tween(dur, p => { const x = -20 + 430 * eo(p); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(x - 70, 0, x + 70, 0); g.addColorStop(0, `rgba(${color},0)`); g.addColorStop(.5, `rgba(${color},${.55 * (1 - p * .5)})`); g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - 70, y - 54, 140, 108); ctx.restore(); }, delay);
}

// ══ cenas ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
const UPK = [[0, 'pFront', 1], [1, 'pFront', 2], [3, 'pFront', 1], [2, 'pFront', 2], [1, 'pBack', 1]];   // coluna, fileira, manutenção
const scenes = {
  // ── Mercenários ─────────────────────────────────────────────────────────────────────────────────────────────────
  manutencao: {
    cap: 'Pagar a manutenção (fase de Suprimentos): para cada carta paga, moedas voam do contador de ouro até ela, com um "ding" e um brilho dourado. A que não foi paga (Rato da Muralha) fica apagada e vai embora na próxima cena.',
    run() {
      setGold(7); let d = .35, k = 0;
      UPK.forEach(([c, r, cost]) => {
        const el = E(c, r), x = X(c), y = Y(r);
        for (let n = 0; n < cost; n++) coinFly({ from: GOLD, to: { x, y: y - 8 }, dur: .5, delay: d + n * .13, arc: 54, size: 22, onEnd() { clink(0, .2); addGold(-1); ring(x, y - 8, 30, .3, '255,214,110', 3); glint(x, y - 8, 34, .22); } });
        const done = d + .5 + (cost - 1) * .13;
        at(done, () => { glowCard(el, '255,214,110', 650, 1.3); }); tag(x, y - 40, '−' + cost, '255,224,120', done, 20);
        d += .2 + cost * .06; k++;
      });
      const rat = E(4, 'pFront'); at(d + .5, () => { rat.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(.55) saturate(.5)' }], { duration: 400, fill: 'forwards' }); });
      tag(X(4), Y('pFront') - 40, 'sem soldo', '255,120,100', d + .55, 15);
    }
  },
  dispensar: {
    cap: 'Dispensar (Rescisão): o contrato se rasga em cima do Rato da Muralha, ele some em poeira dourada e jogam-se moedas; a Rescisão compra 1 carta (a carta voa para a mão). Depois, o Cavaleiro do Escudo Raspado, que "volta para a mão": ele se ergue e desce até a mão.',
    run() {
      const rat = E(4, 'pFront'), x = X(4), y = Y('pFront');
      at(0, () => { whoosh(0, .25, .22, 900, 2600); flash(x, y, 70, '255,226,150', .4, .3); });
      tween(1.4, p => sheetXY(IMG.contrato, 5, 256, 256, Math.min(19, Math.floor(p * 20)), x, y - 4, .78, .78, 1), .05);
      at(.5, () => { whoosh(0, .3, .45, 3200, 700); play('hit', 0, .35, 1.6); });
      tween(.7, p => { rat.style.opacity = 1 - ei(clamp((p - .1) / .6)); setT(rat, 0, -4 * p, 0, 1 - .12 * p); rat.style.filter = `brightness(${1 + .6 * (1 - p)}) sepia(${p * .6})`; }, .15, () => { rat.style.opacity = 0; });
      for (let i = 0; i < 18; i++) at(.5 + R(0, .35), () => { const a = R(0, 6.28), r0 = R(8, 30); add({ dur: R(.5, .95), draw(p) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,110,${1 - p})`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r0 * (1 + p), y - 30 * p + Math.sin(a) * r0 * .5, 2 + 1.4 * (1 - p), 0, 7); ctx.fill(); ctx.restore(); } }); });
      coinBurst(x, y - 6, 7, .9, .55);
      at(.9, () => ding(0, .12, 1900));
      tag(x, y - 42, 'Rescisão', '255,224,120', .75, 16);
      flyBack({ x, y }, { x: 195, y: 650 }, .6, 1.05, () => { ding(0, .16, 1500); }, 70); tag(195, 596, '+1 carta', '200,235,255', 1.4, 17);
      // volta para a mão
      const kn = E(3, 'pFront'), kx = X(3), ky = Y('pFront');
      at(2.0, () => { glowCard(kn, '200,230,255', 700, 1.4); whoosh(0, .4, .3, 500, 1700); flash(kx, ky, 80, '200,230,255', .5, .5); });
      slide(kn, 0, 240, .7, { delay: 2.15, ease: u => u * u, sc: .6 });
      tween(.7, p => { kn.style.opacity = 1 - ei(clamp((p - .5) / .5)); }, 2.15);
      tag(kx, ky - 44, 'volta para a mão', '200,235,255', 2.15, 14);
    }
  },
  muralha: {
    cap: 'O Dia em que a Muralha Caiu (2 de dano em tudo): a carta desce, o chão treme, rachaduras brilhando em brasa se abrem sob todas as cartas inimigas e a explosão corre da frente para trás até o General, com muita poeira e pedaços.',
    run() {
      landTactic('cards/o-dia-em-que-a-muralha-caiu', () => {
        whoosh(0, .6, .3, 100, 420); play('boom', 0, .5, .45); shake(1.7, 3, 0);
        enemyCards.forEach(e => {
          const x = +e.dataset.x, y = +e.dataset.y, k = y === ROW.eFront ? 0 : y === ROW.eBack ? 1 : 2, d = .55 + k * .3 + R(0, .09);
          stonesFall(x, y, 6, d - .4);
          at(d, () => { explosion(x, y + 2, y < 80 ? .6 : .46, 0, Math.random() < .5 ? 1 : -1); flash(x, y, 80, '255,190,90', .55, .28); debris(x, y, 6, .9); sparks(x, y, 7, .8);
            play('dano', 0, .3, .7 + R(0, .4)); hit(e, 0, k % 2); num(x, y - 38, '-2', .05, y < 80 ? 34 : 26); dust(x, y + 28, 80, 5, 42); });
        });
        at(.9, () => { shake(.7, 7, 0); play('boom', 0, .8, .8); });
        at(1.45, () => { play('boom', 0, .9, .6); shake(.9, 9, 0); shock(195, ROW.eBack + 40, 260, .8, '255,200,150', 4); scorch(195, ROW.eBack + 30, 190); dust(195, ROW.eBack + 10, 190, 14, 62); });
      });
      leaveTactic(4.1);
    }
  },
  chuva: {
    cap: 'Chuva de Ferro Barato (2 de dano numa fileira): a carta desce e dezenas de virotes caem do alto sobre a fileira da frente, cada um crava com um "tump" e fica tremendo. Cada carta da fileira recebe o golpe.',
    run() {
      landTactic('cards/chuva-de-ferro-barato', () => {
        const vt = pick('virote'); whoosh(0, 1.0, .4, 400, 1300); play('dano', 0, .3, 1.4);
        const row = ROW.eFront, LEN = 64; let n = 0;
        for (let i = 0; i < 26; i++) {
          const col = i % 5, x = COLX[col] + R(-26, 26), y = row + R(-22, 28), d = .08 + i * .04 + R(0, .03), T = .34, from = { x: x + R(-70, -36), y: -30 };
          const ang = Math.atan2(y - from.y, x - from.x);
          at(d, () => {
            fly({ img: vt.img, size: vt.size, from, to: { x, y }, dur: T, aim: true, len: [LEN, LEN], ease: u => Math.pow(u, 1.5), ribbon: { n: 5, c: '255,255,255', w: 2 } });
            at(T, () => { stick(vt.img, vt.size, { x, y }, ang, LEN, 1.1, 10); sparksDir(x, y, ang + Math.PI, .7, 3, .5, '255,236,170'); puff(x, y + 2, 0, -8, 18, .35, .35, 1.2); if (i % 4 === 0) { thunk(x, y, ang); play('hit', 0, .45, 1 + R(0, .3)); } });
          });
        }
        enemyCards.filter(e => +e.dataset.y === row).forEach((e, i) => { const x = +e.dataset.x, d = .3 + i * .13; hit(e, d, i % 2); num(x, row - 38, '-2', d + .05, 26); });
      });
      leaveTactic(3.2);
    }
  },
  punhal: {
    cap: 'Pacto do Punhal Vermelho (3 de dano a uma unidade): o punhal cai do alto e crava na carta; um selo de cera vermelho se estampa por cima, estoura em respingos, e uma moeda cai da mesa (o pagamento).',
    run() {
      landTactic('cards/pacto-do-punhal-vermelho', () => {
        const tg = E(2, 'eFront'), x = X(2), y = Y('eFront'), L = 104, T = .3; whoosh(0, .3, .5, 700, 3000);
        tween(T, p => { const u = p * p, px = x + 8 - 8 * u, py = -50 + (y - 6 + 50) * u; ctx.save(); ctx.translate(px, py); ctx.rotate(.1 * (1 - u)); const k = L / 128; ctx.scale(k, k); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 8;
          ctx.drawImage(IMG.dagger, -64, -122, 128, 128); ctx.restore(); });
        at(T, () => { play('hit', 0, .9, .8); play('dano', 0, .35, .9); flash(x, y, 70, '255,70,50', .6, .25); ring(x, y, 40, .3, '255,120,100', 3); burst(x, y, 8, 44, '255,150,130', .2); sparksDir(x, y, -Math.PI / 2, 1.0, 8, .8, '255,200,170'); hit(tg, 0, 0); glowCard(tg, '255,40,30', 800, 1.1); });
        tween(1.6, p => { const wob = Math.sin(p * 40) * .05 * Math.exp(-p * 8); ctx.save(); ctx.translate(x, y - 6); ctx.rotate(wob); const k = L / 128; ctx.scale(k, k); ctx.globalAlpha = 1 - ei((p - .75) / .25); ctx.drawImage(IMG.dagger, -64, -122, 128, 128); ctx.restore(); }, T);
        at(T + .08, () => { play('dano', 0, .3, .6); tween(1.05, p => sheetXY(IMG.seal, 5, 256, 256, Math.min(19, Math.floor(p * 20)), x + 6, y + 18, .3, .3, 1)); });
        at(T + .12, () => { shock(x + 6, y + 20, 70, .4, '255,90,70', 3); });
        num(x, y - 38, '-3', T + .1, 34);
        at(T + .3, () => { coinBurst(x + 34, y - 30, 3, .45, 0, 40); });
      });
      leaveTactic(3.0);
    }
  },
  bolsa: {
    cap: 'O Peso da Bolsa (Emboscada: cancela o ataque): o atacante parte para o golpe, a carta se revela, uma bolsa cheia cai na mesa e as moedas se espalham; o atacante congela, coberto por um verniz de ouro, e o ataque é cancelado.',
    run() {
      const att = E(2, 'eFront'), ax = X(2), ay = Y('eFront');
      tween(.38, p => { const dy = p < .35 ? -14 * eo(p / .35) : -14 + 66 * ei((p - .35) / .65); setT(att, 0, dy); }, .1, () => setT(att, 0, 52));
      at(.16, () => { whoosh(0, .3, .25, 300, 1100); });
      popCard('cards/o-peso-da-bolsa', .2, 1.0);
      const tx = X(2), ty = 322;
      // a bolsa cai
      tween(.3, p => { const u = p * p, y = -40 + (ty + 6 + 40) * u; ctx.save(); ctx.translate(tx, y); ctx.rotate(.18 * Math.sin(p * 6)); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 8; ctx.drawImage(IMG.purse, -29, -29, 58, 58); ctx.restore(); }, .55);
      tween(1.6, p => { const sq = 1 + .12 * Math.exp(-p * 18) * Math.sin(p * 40); ctx.save(); ctx.translate(tx, ty + 6); ctx.scale(sq, 2 - sq); ctx.globalAlpha = 1 - ei((p - .8) / .2); ctx.drawImage(IMG.purse, -29, -29, 58, 58); ctx.restore(); }, .85);
      at(.85, () => { play('dano', 0, .8, .5); play('hit', 0, .4, .7); shock(tx, ty + 22, 110, .5, '255,226,150', 4); dust(tx, ty + 28, 60, 6, 32); for (let i = 0; i < 4; i++) clink(i * .07, .16); flash(tx, ty, 90, '255,214,110', .5, .3); });
      coinBurst(tx, ty - 4, 11, 1.1, .85, 36);
      // o atacante congela em ouro
      at(.95, () => { att.style.filter = 'sepia(.85) saturate(1.8) brightness(1.15)'; whoosh(0, .5, .22, 500, 2600); ding(0, .2, 1200); });
      tween(1.5, p => sheetXY(IMG.gold, 5, 256, 384, Math.min(19, Math.floor(p * 20)), ax, ay + 52, .27, .27, 1, 'lighter'), .95);
      tag(ax, ay + 12, 'ataque cancelado', '255,224,120', 1.1, 15);
      at(2.5, () => { att.style.filter = ''; });
      tween(.5, p => setT(att, 0, 52 * (1 - eo(p))), 2.55, () => setT(att));
    }
  },
  boca: {
    cap: 'Boca-de-Fogo (ataque à distância): a bombarda recua com o disparo, o clarão e a fumaça saem do cano e a bala de ferro voa quase reta, deixando um rastro de fumaça, até acertar o alvo (3 de dano).',
    run() {
      const sh = E(1, 'pBack'), sx = X(1), sy = Y('pBack'), tg = E(1, 'eFront'), tx = X(1), ty = Y('eFront'), mz = { x: sx + 4, y: sy - 42 };
      tween(.4, p => setT(sh, 0, 9 * Math.sin(Math.PI * Math.min(1, p * 1.6)) * (1 - p) * 1.4), .45, () => setT(sh));
      at(.1, () => { glowCard(sh, '255,170,80', 400, 1.2); whoosh(0, .35, .2, 200, 500); });
      at(.45, () => { play('boom', 0, .7, 1.2); explosion(mz.x, mz.y + 4, .42, 0, 1); flash(mz.x, mz.y, 90, '255,200,120', .8, .22); sparksDir(mz.x, mz.y, -Math.PI / 2, .5, 10, .9, '255,210,120'); shake(.25, 2.5, 0);
        for (let i = 0; i < 7; i++) puff(mz.x + R(-8, 8), mz.y + R(-4, 4), R(-18, 18), R(-34, -10), R(24, 40), R(.9, 1.5), .5, 1.8); });
      const T = .34;
      at(.5, () => { whoosh(0, T, .35, 1500, 3200); fly({ img: IMG.ball, size: [128, 128], from: mz, to: { x: tx, y: ty }, dur: T, arc: 24, scale: [.2, .13], trail: 'smoke', shadow: false, ribbon: { n: 6, c: '255,255,255', w: 2 }, ease: u => Math.pow(u, 1.15) }); });
      at(.5 + T, () => { play('boom', 0, .6, 1); play('hit', 0, .6, .9); explosion(tx, ty + 2, .45, 0, 1); flash(tx, ty, 70, '255,200,120', .6, .2); debris(tx, ty, 6, .8); sparks(tx, ty, 8, .8); hit(tg, 0, 0); num(tx, ty - 38, '-3', .04, 34); dust(tx, ty + 30, 60, 5, 36); });
    }
  },
  codice: {
    cap: 'Códice das Mil Dívidas (Relíquia com modos): ela pousa e abre. SOLDO EM DOBRO: moedas douradas chovem sobre quem tem manutenção (+1 de ataque, em vermelho). SAQUE: ao destruir uma unidade inimiga, uma moeda sai dela e vira uma carta comprada.',
    run() {
      landTactic('cards/codice-das-mil-dividas', () => {
        tag(195, 262, 'SOLDO EM DOBRO', '255,214,110', .02, 17); ding(0, .18, 1300);
        ring(TAC.x, TAC.y, 120, .6, '255,214,110', 4); rowWave(ROW.pFront, '255,200,90', .1, .7);
        UPK.forEach(([c, r], i) => { const x = X(c), y = Y(r), el = E(c, r), d = .12 + i * .11;
          coinFly({ from: { x: TAC.x, y: TAC.y - 10 }, to: { x, y: y - 10 }, dur: .55, delay: d, arc: 70, size: 20, onEnd() { clink(0, .2); flash(x, y, 56, '255,190,80', .6, .3); ring(x, y, 32, .3, '255,214,110', 3); glowCard(el, '255,150,90', 700, 1.3); } });
          num(x, y - 36, '+1', d + .6, 28); });
        // Saque
        const vic = E(1, 'eFront'), vx = X(1), vy = Y('eFront');
        at(2.0, () => { tag(195, 262, 'SAQUE', '200,235,255', 0, 17); ding(0, .16, 1700); });
        at(2.5, () => { play('dano', 0, .5, .8); hit(vic, 0, 0); num(vx, vy - 38, '-9', .05, 32); flash(vx, vy, 80, '255,160,100', .5, .3); });
        tween(.6, p => { vic.style.opacity = 1 - ei(clamp((p - .2) / .8)); vic.style.filter = `brightness(${1 + .8 * (1 - p)})`; }, 2.75, () => { vic.style.opacity = 0; });
        for (let i = 0; i < 12; i++) at(2.8 + R(0, .3), () => { const a = R(0, 6.28); add({ dur: R(.5, .9), draw(p) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,200,120,${1 - p})`; ctx.beginPath(); ctx.arc(vx + Math.cos(a) * 28 * p, vy - 24 * p + Math.sin(a) * 18 * p, 2.4 * (1 - p) + .5, 0, 7); ctx.fill(); ctx.restore(); } }); });
        coinFly({ from: { x: vx, y: vy }, to: { x: TAC.x, y: TAC.y }, dur: .55, delay: 2.85, arc: 60, size: 22, onEnd() { clink(0, .2); flash(TAC.x, TAC.y, 80, '255,214,110', .6, .3); glint(TAC.x, TAC.y, 50, .25); } });
        flyBack({ x: TAC.x, y: TAC.y }, { x: 195, y: 650 }, .6, 3.5, () => ding(0, .15, 1500), 70); tag(195, 596, '+1 carta', '200,235,255', 3.85, 17);
      });
    }
  },
  contamoedas: {
    cap: 'Quillon Contamoedas (+1 de ouro no início do turno): a carta brilha e uma moeda sobe dela em arco até o contador de ouro, que tilinta e ganha 1.',
    run() {
      setGold(5); const el = E(3, 'pBack'), x = X(3), y = Y('pBack');
      at(.15, () => { glowCard(el, '255,214,110', 800, 1.35); ding(0, .1, 2300); flash(x, y, 64, '255,214,110', .55, .4); sparksDir(x, y - 20, -Math.PI / 2, .9, 8, .5, '255,214,110'); });
      coinFly({ from: { x, y: y - 24 }, to: GOLD, dur: .8, delay: .4, arc: 120, size: 28, onEnd() { ding(0, .26, 1760); addGold(1); ring(GOLD.x, GOLD.y, 28, .45, '255,214,110', 3); glint(GOLD.x, GOLD.y, 40, .3); } });
      tag(x, y - 48, '+1 ouro', '255,224,120', .45, 16);
    }
  },
  // ── Capitão ─────────────────────────────────────────────────────────────────────────────────────────────────────
  contra: {
    cap: 'Contra-Manobra (Emboscada: troca a unidade atacada com uma aliada ao lado): o atacante parte para o golpe, a carta se revela e as duas aliadas giram trocando de lugar, uma por cima e outra por baixo, com um clarão azul; o golpe cai em quem entrou.',
    run() {
      const att = E(2, 'pFront'), a = E(2, 'eFront'), b = E(3, 'eFront'), ay = Y('eFront');
      tween(.42, p => { const dy = p < .35 ? 12 * eo(p / .35) : 12 - 74 * ei((p - .35) / .65); setT(att, 0, dy); }, .1);
      popCard('../quarto/cards/contra-manobra', .2, .85);
      at(.7, () => { whoosh(0, .45, .3, 400, 1800); ring(195, ay, 50, .4, '140,190,255', 3); ring(265, ay, 50, .4, '140,190,255', 3); flash(230, ay, 100, '140,190,255', .5, .4); });
      slide(a, 70, 0, .5, { delay: .7, arc: 40, rot: 360, ease: u => u * u * (3 - 2 * u) });
      slide(b, -70, 0, .5, { delay: .7, arc: -40, rot: -360, ease: u => u * u * (3 - 2 * u) });
      at(1.2, () => { play('dano', 0, .4, 1.4); shock(230, ay + 30, 90, .4, '150,200,255', 3); dust(195, ay + 30, 40, 4, 26); dust(265, ay + 30, 40, 4, 26); });
      // o golpe chega em quem entrou (agora na coluna 2)
      tween(.22, p => setT(att, 0, -62 - 58 * p), 1.3);
      at(1.52, () => { play('hit', 0, .8); cleanHit(195, ay + 6, -Math.PI / 2, 1); hit(b, 0, 0); num(195, ay - 38, '-4', .05, 34); });
      tween(.5, p => setT(att, 0, -120 * (1 - eo(p))), 1.9, () => setT(att));
    }
  },
  formacao: {
    cap: 'Formação Quebrada (Emboscada: move o atacante para um espaço livre, o ataque falha): a carta se revela, uma onda de choque empurra o atacante, que voa girando até outro lugar, levanta poeira e fica tonto com estrelas girando na cabeça.',
    run() {
      const att = E(3, 'pFront'), tg = E(3, 'eFront'), ax = X(3), ay = Y('pFront'), nx = X(4), ny = Y('pBack');
      tween(.42, p => { const dy = p < .35 ? 12 * eo(p / .35) : 12 - 74 * ei((p - .35) / .65); setT(att, 0, dy); }, .1);
      popCard('../quarto/cards/formacao-quebrada', .2, .8);
      at(.72, () => { play('dano', 0, .6, .7); whoosh(0, .35, .45, 500, 2400); shock(ax, ay - 70, 120, .4, '255,230,170', 4); flash(ax, ay - 70, 90, '255,230,170', .55, .25); burst(ax, ay - 70, 12, 60, '255,236,180', .24); });
      slide(att, nx - ax, ny - ay, .6, { delay: .78, arc: 70, rot: 540, ease: eo });
      at(.78, () => { for (let i = 0; i < 8; i++) puff(ax + R(-14, 14), ay - 50 + R(-10, 10), R(-30, 30), R(10, 40), R(22, 34), R(.5, .9), .4, 1.4); });
      at(1.38, () => { play('dano', 0, .6, .6); shock(nx, ny + 30, 100, .4, '255,226,170', 3); dust(nx, ny + 36, 60, 4, 24); shake(.25, 3, 0); });
      tween(1.8, p => sheetXY(IMG.stars, 8, 128, 128, Math.floor(p * 1.8 * 16) % 16, nx, ny - 46, 1.05, 1.05, 1 - ei((p - .8) / .2), 'lighter'), 1.45);
      tag(nx, ny + 52, 'ataque falhou', '255,224,120', 1.5, 15);
      at(.78, () => { tg.animate([{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-50%,calc(-50% - 4px)) scale(1.04)' }, { transform: 'translate(-50%,-50%)' }], { duration: 300 }).playbackRate = speed; });
    }
  },
  reformar: {
    cap: 'Reformar Linhas (3 movimentos extras, compra 1): linhas douradas de formação varrem as fileiras, as cartas dão um saltinho em onda e encaixam no lugar com poeira; uma carta é comprada.',
    run() {
      landTactic('../quarto/cards/reformar-linhas', () => {
        ding(0, .14, 1400); whoosh(0, .5, .25, 300, 1500);
        [['eFront', 0], ['eBack', .22]].forEach(([r, dl]) => {
          const y = Y(r); rowWave(y, '255,214,110', dl, .65);
          tween(1.0, p => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,214,110,${.8 * Math.sin(Math.PI * p)})`; ctx.lineWidth = 2; ctx.setLineDash([14, 8]); ctx.lineDashOffset = -p * 120; ctx.beginPath(); ctx.moveTo(14, y + 52); ctx.lineTo(376, y + 52); ctx.stroke(); ctx.beginPath(); ctx.moveTo(14, y - 52); ctx.lineTo(376, y - 52); ctx.stroke(); ctx.restore(); }, dl);
          enemyCards.filter(e => +e.dataset.y === Y(r)).forEach(e => { const x = +e.dataset.x, d = dl + .08 + (x - 55) / 280 * .45;
            slide(e, 0, 0, .3, { delay: d, arc: 16, keep: false, ease: u => u }); at(d + .3, () => { dust(x, Y(r) + 30, 36, 3, 22); shock(x, Y(r) + 34, 44, .3, '255,226,170', 2); play('dano', 0, .1, 1.6 + R(0, .4)); }); });
        });
        tag(195, 300, '3 movimentos', '255,224,120', .15, 17);
        flyBack({ x: 350, y: 300 }, { x: 195, y: -30 }, .6, .8, () => ding(0, .14, 1500), 40);
      });
      leaveTactic(3.0);
    }
  },
  pantano: {
    cap: 'Pântano Maldito (Terreno: inimigos na Vanguarda −1 ATK): a carta pousa e uma névoa verde-escura com bolhas sobe sobre a Vanguarda inimiga e fica lá (no jogo, enquanto o Terreno estiver em campo); as cartas ficam esverdeadas e perdem 1 de ataque.',
    run() {
      landTactic('../quarto/cards/pantano-maldito', () => {
        whoosh(0, .8, .2, 120, 500); play('magic', 0, .4, .8);
        const y = ROW.pFront, FOGT = 4.2;
        tween(FOGT, p => { const a = Math.min(1, p * 5) * (1 - ei((p - .85) / .15)); sheetXY(IMG.swamp, 4, 256, 128, Math.floor(p * FOGT * 12) % 24, 195, y + 4, 1.56, 1.5, a * .85);
          sheetXY(IMG.swamp, 4, 256, 128, (Math.floor(p * FOGT * 9) + 11) % 24, 195, y + 14, -1.56, 1.1, a * .45); });
        for (let i = 0; i < 5; i++) { const el = E(i, 'pFront'), x = X(i);
          at(.4 + i * .1, () => { el.animate([{ filter: 'none' }, { filter: 'brightness(.82) sepia(.6) hue-rotate(50deg) saturate(1.6)' }], { duration: 500, fill: 'forwards' }); tag(x, y - 44, '−1 ATK', '170,230,110', 0, 14); sparksDir(x, y, -Math.PI / 2, .9, 4, .3, '150,230,90'); }); }
        at(FOGT * .9, () => { for (let i = 0; i < 5; i++) E(i, 'pFront').animate([{ filter: 'brightness(.82) sepia(.6) hue-rotate(50deg) saturate(1.6)' }, { filter: 'none' }], { duration: 500, fill: 'forwards' }); });
      });
      leaveTactic(1.9);
    }
  },
  estandarte: {
    cap: 'Estandarte da Legião (Relíquia: +1/+1 em combate às suas cartas): a relíquia pousa e uma onda vermelho-dourada corre pelo campo do Capitão; cada carta aliada brilha e mostra +1/+1.',
    run() {
      landTactic('../quarto/cards/estandarte-da-legiao', () => {
        play('magic', 0, .45, 1.1); whoosh(0, .5, .3, 300, 1700); ring(TAC.x, TAC.y, 150, .8, '255,110,80', 4); ring(TAC.x, TAC.y, 90, .6, '255,214,110', 3); flash(TAC.x, TAC.y, 130, '255,120,90', .55, .5);
        ['eFront', 'eBack'].forEach((r, k) => rowWave(Y(r), '255,100,70', .15 + k * .2, .7));
        enemyCards.filter(e => +e.dataset.y > 120).forEach((e, i) => { const x = +e.dataset.x, y = +e.dataset.y, d = .25 + (y === ROW.eBack ? .18 : 0) + (x - 55) / 280 * .3;
          at(d, () => { flash(x, y, 70, '255,100,70', .5, .6); ring(x, y, 44, .5, '255,160,110', 3); sparksDir(x, y, -Math.PI / 2, 1.1, 7, .5, '255,200,130'); glowCard(e, '255,110,80', 800, 1.3); play('dano', 0, .12, 1.7); });
          num(x, y - 36, '+1/+1', d + .05, 24, 'buff'); });
      });
    }
  },
};
