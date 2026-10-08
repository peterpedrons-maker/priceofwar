import re, io
S='/tmp/claude-0/-home-user-priceofwar/53582eeb-f6be-53f8-9656-e04ea703ad88/scratchpad/'
src=open('projeteis/index.html',encoding='utf8').read().split('\n')
L=lambda a,b:'\n'.join(src[a-1:b])         # 1-based inclusive
idx=lambda s:next(i for i,l in enumerate(src,1) if l.startswith(s))
a_stage=idx('// ── scale the stage'); a_tac=idx('// ── tactic cards'); a_weapon=idx('// A General\'s ability'); a_main=idx('// ── main loop')
engine=L(a_stage,a_tac-1)
tac=L(a_tac,a_weapon-1)
main=L(a_main,len(src))
# ---- ajustes no motor copiado ----
# assets: troca o bloco de carregamento
i0=engine.index('const IMG = {};'); i1=engine.index('// painted art')
engine=engine[:i0]+'''const IMG = {};
const PJ = '../projeteis/';
const load = (k, src) => new Promise(r => { const i = new Image(); i.onload = () => { IMG[k] = i; r(); }; i.onerror = () => { console.warn('falta', src); r(); }; i.src = src; });
const ready = Promise.all([load('fire', PJ + 'fx-boom-fire.webp'), load('smoke', PJ + 'fx-boom-smoke.webp'), load('holy', PJ + 'fx-holy.webp'), load('puff', PJ + 'fx-puff.webp'), load('debris', PJ + 'fx-debris.webp'),
  load('rock', PJ + 'proj-rock.webp'), load('bolt', PJ + 'proj-bolt.webp'), load('arrow', PJ + 'proj-arrow.webp'), load('lance', PJ + 'proj-lance.webp'),
  load('a_lanca', PJ + 'art/lanca.webp'), load('a_virote', PJ + 'art/virote.webp'), load('a_flecha', PJ + 'art/flecha.webp'), load('a_veneno', PJ + 'art/flecha-veneno.webp'),
  load('a_pedra', PJ + 'art/pedra.webp'), load('a_brasa', PJ + 'art/pedra-brasa.webp'), load('a_espada', PJ + 'art/espada-aurelion.webp'), load('a_martelo', PJ + 'art/martelo.webp'),
  load('coin', 'fx-coin.webp'), load('seal', 'fx-seal.webp'), load('contrato', 'fx-contrato.webp'), load('stars', 'fx-stars.webp'), load('swamp', 'fx-pantano.webp'), load('cracks', 'fx-cracks.webp'), load('gold', 'fx-gold.webp'),
  load('muro', 'fx-muro.webp'), load('ruinas', 'fx-ruinas.webp'), load('bandeira_a', 'fx-bandeira-a.webp'), load('bandeira_b', 'fx-bandeira-b.webp'), load('plantar_a', 'fx-bandeira-plantar-a.webp'), load('plantar_b', 'fx-bandeira-plantar-b.webp'), load('cair_a', 'fx-bandeira-cair-a.webp'), load('cair_b', 'fx-bandeira-cair-b.webp'),
  load('dagger', 'proj-dagger.webp'), load('purse', 'proj-purse.webp'), load('ball', 'proj-ball.webp')]);
'''+engine[i1:]
engine=engine.replace("fetch(n + (n === 'magic' ? '.mp3' : '.wav'))","fetch(PJ + n + (n === 'magic' ? '.mp3' : '.wav'))")
engine=engine.replace('`num/burst-','`${PJ}num/burst-').replace('`num/${kind}','`${PJ}num/${kind}')
assert 'PJ}num/burst' in engine and 'PJ + n' in engine
tac=tac.replace("im.src = `../quarto/cards/${name}.webp`;","im.src = (name.includes('/') ? name : `../quarto/cards/${name}`) + '.webp';")
assert "name.includes('/')" in tac
# ---- cabeça (CSS reaproveitado) ----
css=L(1,idx('</style>')-1)
css=css.replace('<title>Projéteis do combate</title>','<title>Efeitos das cartas únicas</title>')
css+='''
  .tag { position:absolute; transform:translate(-50%,-50%); font:900 17px/1 Georgia,serif; letter-spacing:.02em; pointer-events:none; white-space:nowrap; text-shadow:0 2px 0 rgba(40,20,0,.9), 0 0 6px rgba(0,0,0,.9), 1px 1px 0 #000, -1px -1px 0 #000; animation: tagup 1.7s ease-out forwards; z-index:20; }
  @keyframes tagup { 0%{opacity:0; transform:translate(-50%,-30%) scale(.6)} 14%{opacity:1; transform:translate(-50%,-60%) scale(1.15)} 28%{transform:translate(-50%,-70%) scale(1)} 78%{opacity:1; transform:translate(-50%,-120%)} 100%{opacity:0; transform:translate(-50%,-150%)} }
  .cb { position:absolute; width:44px; height:62px; transform:translate(-50%,-50%); border-radius:5px; border:2px solid #d9b45a; background:radial-gradient(circle at 50% 45%, #6b2a2a 0 28%, #3a1a1a 29% 60%, #241010 61%); box-shadow:0 3px 8px rgba(0,0,0,.7); z-index:7; }
  .cb::after { content:''; position:absolute; inset:7px; border:1px solid rgba(217,180,90,.6); border-radius:3px; }
  #gold { position:absolute; left:8px; top:300px; width:52px; height:44px; display:flex; align-items:center; justify-content:center; gap:4px; border-radius:22px; background:linear-gradient(#3a2a14,#1c140a); border:2px solid #d9b45a; box-shadow:0 3px 8px rgba(0,0,0,.7); z-index:15; font:900 18px Georgia,serif; color:#ffe9a8; }
  #gold i { width:16px; height:16px; border-radius:50%; background:radial-gradient(circle at 35% 30%, #fff1a8, #d89a1c 60%, #8a5a08); box-shadow:0 0 0 1px #6b4608; }
  #gold.pop { animation: gpop .45s ease-out; } @keyframes gpop { 0%{transform:scale(1)} 30%{transform:scale(1.28); filter:brightness(1.5)} 100%{transform:scale(1)} }
  .tabs { grid-column:1/-1; display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; }
  .tabs button { font-size:13px; padding:8px 4px; } .grp { display:none; grid-column:1/-1; grid-template-columns:repeat(2,1fr); gap:6px; } .grp.on { display:grid; }
  nav { grid-template-columns:1fr; }
</style>'''
body='''</head>
<body>
<div id="app">
  <header>
    <h1>Efeitos das cartas únicas</h1>
    <p id="cap">Mercenários (embaixo) contra Capitão (em cima). Toque num botão para ver o efeito. (Mockup: ainda não está no jogo.)</p>
  </header>
  <div id="holder">
    <div id="stage">
      <img id="bg" src="../projeteis/board-battlefield.webp" alt="">
      <div id="cards"></div>
      <canvas id="fx"></canvas>
      <div id="nums"></div>
      <div id="gold"><i></i><span id="goldn">7</span></div>
    </div>
  </div>
  <nav>
    <div class="tabs"><button data-g="m" class="on">Mercenários</button><button data-g="c">Capitão</button><button data-g="b">Brecha</button></div>
    <div class="grp on" id="g-m">
      <button data-a="manutencao">Pagar manutenção<small>moedas voam do ouro</small></button>
      <button data-a="dispensar">Dispensar<small>contrato rasgado e Rescisão</small></button>
      <button data-a="muralha">O Dia em que a Muralha Caiu<small>tática, 2 em tudo</small></button>
      <button data-a="chuva">Chuva de Ferro Barato<small>virotes sobre uma fileira</small></button>
      <button data-a="punhal">Pacto do Punhal Vermelho<small>punhal e selo de cera</small></button>
      <button data-a="bolsa">O Peso da Bolsa<small>emboscada: ataque congelado</small></button>
      <button data-a="boca">Boca-de-Fogo<small>bombarda e bala de ferro</small></button>
      <button data-a="codice">Códice das Mil Dívidas<small>Soldo em Dobro e Saque</small></button>
      <button data-a="contamoedas">Quillon Contamoedas<small>+1 de ouro por turno</small></button>
    </div>
    <div class="grp" id="g-c">
      <button data-a="contra">Contra-Manobra<small>emboscada: troca de lugar</small></button>
      <button data-a="formacao">Formação Quebrada<small>emboscada: atacante empurrado</small></button>
      <button data-a="reformar">Reformar Linhas<small>linhas de formação</small></button>
      <button data-a="pantano">Pântano Maldito<small>névoa sobre a Vanguarda</small></button>
      <button data-a="estandarte">Estandarte da Legião<small>pulso +1/+1</small></button>
    </div>
    <div class="grp" id="g-b">
      <button data-a="brecha">Brecha<small>a muralha desaba</small></button>
      <button data-a="plantar">Plantar estandarte<small>mastro, vento e âncora</small></button>
      <button data-a="pilhagem">Pilhagem<small>+1 ouro por turno</small></button>
      <button data-a="retomada">Retomada<small>a âncora cai</small></button>
      <button data-a="reparar">Reparar a muralha<small>2 de ouro</small></button>
    </div>
    <div id="opts">
      <label><input type="checkbox" id="art" checked> arte pintada</label>
      <label><input type="checkbox" id="slow"> câmera lenta (¼)</label>
      <label><input type="checkbox" id="snd" checked> som</label>
    </div>
  </nav>
</div>
<script>
'use strict';
const W = 390, H = 640;
const $ = s => document.querySelector(s);
const q = new URLSearchParams(location.search);
const COLX = [55, 125, 195, 265, 335];
const ROW = { eGen: 50, eBack: 142, eFront: 234, pFront: 410, pBack: 502, pGen: 592 };
const CAPD = '../quarto/cards/', MERC = 'cards/';
const CARDS = [
  // em cima: Capitão
  [CAPD + 'comandante-aurelion-mestre-da-formacao', 195, ROW.eGen, 'big'],
  [CAPD + 'cavaleiro-tatico', COLX[1], ROW.eBack], [CAPD + 'capitao-de-formacao', COLX[2], ROW.eBack],
  [CAPD + 'escudeiro-de-linha', COLX[0], ROW.eFront], [CAPD + 'soldado-tatico', COLX[1], ROW.eFront], [CAPD + 'veterano-de-guerra', COLX[2], ROW.eFront], [CAPD + 'batedor', COLX[3], ROW.eFront], [CAPD + 'lanceiro-de-controle', COLX[4], ROW.eFront],
  // embaixo: Mercenários
  [MERC + 'lanceiro-pes-de-lama', COLX[0], ROW.pFront], [MERC + 'capa-rota', COLX[1], ROW.pFront], [MERC + 'florete-de-aposta', COLX[2], ROW.pFront], [MERC + 'cavaleiro-do-escudo-raspado', COLX[3], ROW.pFront], [MERC + 'rato-da-muralha', COLX[4], ROW.pFront],
  [MERC + 'boca-de-fogo', COLX[1], ROW.pBack], [MERC + 'quillon-contamoedas', COLX[3], ROW.pBack],
  [MERC + 'brann-meia-coroa-comprador-de-guerras', 195, ROW.pGen, 'big'],
];
const els = []; const cardsEl = $('#cards');
for (const row of [ROW.eBack, ROW.eFront, ROW.pFront, ROW.pBack]) for (const x of COLX) { const s = document.createElement('div'); s.className = 'slot'; s.style.left = x + 'px'; s.style.top = row + 'px'; cardsEl.appendChild(s); }
CARDS.forEach(([n, x, y, cls]) => { const im = document.createElement('img'); im.className = 'card ' + (cls || ''); im.src = n + '.webp'; im.style.left = x + 'px'; im.style.top = y + 'px'; im.draggable = false;
  cardsEl.appendChild(im); els.push(im); im.dataset.x = x; im.dataset.y = y; });
const enemyCards = els.filter(e => +e.dataset.y <= ROW.eFront);
const cardByPos = (x, y) => els.find(e => +e.dataset.x === x && +e.dataset.y === y);
'''
tail_scenes=open(S+'scenes_new.js',encoding='utf8').read()
runner='''
let current = null;
function resetBoard() {
  extras.splice(0).forEach(d => d.remove()); document.getAnimations().forEach(a => a.cancel());
  els.forEach(e => { e.style.cssText = `left:${e.dataset.x}px;top:${e.dataset.y}px;`; e.classList.remove('hit', 'hit2', 'windup', 'kick'); });
  cardsEl.style.transform = ''; cv.style.transform = ''; if (tacEl) { tacEl.remove(); tacEl = null; }
}
function runScene(k) {
  audio();
  document.querySelectorAll('nav button[data-a]').forEach(b => b.classList.toggle('on', b.dataset.a === k));
  fxs.length = 0; sched.length = 0; now = 0; $('#nums').innerHTML = ''; resetBoard(); setGold(7);
  current = k; $('#cap').textContent = scenes[k].cap;
  speed = $('#slow').checked ? .25 : 1;
  scenes[k].run();
}
document.querySelectorAll('nav button[data-a]').forEach(b => b.onclick = () => runScene(b.dataset.a));
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { document.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('on', x === b)); $('#g-m').classList.toggle('on', b.dataset.g === 'm'); $('#g-c').classList.toggle('on', b.dataset.g === 'c'); $('#g-b').classList.toggle('on', b.dataset.g === 'b'); });
'''
tail_b=open(S+'scenes_brecha.js',encoding='utf8').read()
html='\n'.join([css,body,engine,tac,tail_scenes,tail_b,runner,main])
open('efeitos-decks/index.html','w',encoding='utf8').write(html)
print(len(html))
