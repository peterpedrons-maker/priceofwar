// Turns the JSON(s) written by `tests/balance-lab.ts` into one self-contained page (works on a phone):
//   BASE=balance-out/base.json [VARIANTS=a.json,b.json] [DETAIL=cenario.json: the one whose per-card tables are shown] OUT=balance-out/report.html npx tsx tests/balance-report.ts
import { readFileSync, writeFileSync } from 'node:fs';

type Per = { deck: string; won: boolean; generalHp: number; drawn: Record<string, number>; played: Record<string, number>; abilities: Record<string, number>; dmg: Record<string, number>; kills: Record<string, number> };
type G = { seed: number; first: 0 | 1; rounds: number; winner: 0 | 1 | null; seats: [Per, Per] };
type Lab = { name: string; patch: unknown; games: G[]; recipes: Record<string, { name: string; general: string; cards: Record<string, number> }>; defs: { name: string; cardType: string; atk: number; hp: number; cost: number; effect: string; abilities?: { on: string; cost?: number; once?: boolean }[] }[] };

const load = (f: string): Lab => JSON.parse(readFileSync(f, 'utf8'));
const mean = (a: number[]) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const se = (p: number, n: number) => n ? Math.sqrt(p * (1 - p) / n) : 0;

function summarize(lab: Lab) {
  const games = lab.games, n = games.length;
  const decided = games.filter(g => g.winner !== null);
  const wins = (deck: string) => decided.filter(g => g.seats[g.winner!].deck === deck).length;
  const firstWins = decided.filter(g => g.winner === g.first).length;
  const rounds = games.map(g => g.rounds);
  const hist: Record<number, number> = {}; rounds.forEach(r => { hist[r] = (hist[r] ?? 0) + 1; });
  const decks: Record<string, any> = {};
  for (const id of Object.keys(lab.recipes)) {
    // one row per (deck, game) from that deck's point of view
    const rows = games.map(g => { const i = g.seats[0].deck === id ? 0 : 1; return { me: g.seats[i], opp: g.seats[1 - i], margin: g.seats[i].generalHp - g.seats[1 - i].generalHp }; });
    const base = { wr: mean(rows.map(r => +r.me.won)), margin: mean(rows.map(r => r.margin)) };
    const recipe = lab.recipes[id];
    const cards = Object.entries(recipe.cards).map(([name, copies]) => {
      const def = lab.defs.find(d => d.name === name)!;
      const seen = rows.filter(r => (r.me.drawn[name] ?? 0) > 0), not = rows.filter(r => !(r.me.drawn[name] ?? 0));
      const wrSeen = mean(seen.map(r => +r.me.won)), wrNot = mean(not.map(r => +r.me.won));
      const ab = def.abilities?.find(a => a.on === 'ability');
      const per = (f: (r: typeof rows[0]) => number) => seen.length ? mean(seen.map(f)) : 0;
      return {
        name, type: def.cardType, cost: def.cost, atk: def.atk, hp: def.hp, copies, effect: def.effect, abilityCost: ab?.cost ?? null,
        seen: seen.length, wrSeen, dWr: seen.length && not.length ? wrSeen - wrNot : 0, dWrSe: Math.sqrt(se(wrSeen, seen.length) ** 2 + se(wrNot, not.length) ** 2),
        dMargin: seen.length && not.length ? mean(seen.map(r => r.margin)) - mean(not.map(r => r.margin)) : 0,
        plays: per(r => (r.me.played[name] ?? 0) + (r.me.abilities[name] ?? 0)), dmg: per(r => r.me.dmg[name] ?? 0), kills: per(r => r.me.kills[name] ?? 0),
        drawnPerGame: mean(rows.map(r => r.me.drawn[name] ?? 0)),
      };
    });
    const total = Object.values(recipe.cards).reduce((a, b) => a + b, 0);
    const types: Record<string, number> = {};
    cards.forEach(c => { types[c.type] = (types[c.type] ?? 0) + c.copies; });
    const avgCost = cards.reduce((a, c) => a + c.cost * c.copies, 0) / total;
    const dmgPerGame = mean(rows.map(r => Object.values(r.me.dmg).reduce((a, b) => a + b, 0)));
    decks[id] = { id, dmgPerGame, name: recipe.name, general: recipe.general, total, types, avgCost, wr: base.wr, wrSe: se(base.wr, n), margin: base.margin, cards };
  }
  return { name: lab.name, patch: lab.patch, n, undecided: n - decided.length, rounds: mean(rounds), hist, firstWinRate: decided.length ? firstWins / decided.length : 0,
    cardeal: wins('cardeal') / Math.max(1, decided.length), capitao: wins('capitao') / Math.max(1, decided.length), decks };
}

const base = summarize(load(process.env.BASE ?? 'balance-out/base.json'));
const detail = process.env.DETAIL ? summarize(load(process.env.DETAIL)) : base;
const variants = (process.env.VARIANTS ?? process.env.VARIANT ?? '').split(',').filter(Boolean).map(f => summarize(load(f)));
const html = `<title>Laboratório de Balanceamento</title>
<style>
/* panel layout: summary tiles, then one sortable table per deck */
:root{--bg:#f3f1ec;--panel:#ffffff;--line:#ddd7c9;--ink:#221c12;--dim:#6f6652;--gold:#8a5f10;--good:#1d8a43;--bad:#c2392b;--bar:#b88a2e}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#12100c;--panel:#1c1812;--line:#38302a;--ink:#f1e3c4;--dim:#a8977a;--gold:#e3b556;--good:#6fcf8a;--bad:#e8776a;--bar:#e3b556;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#12100c;--panel:#1c1812;--line:#38302a;--ink:#f1e3c4;--dim:#a8977a;--gold:#e3b556;--good:#6fcf8a;--bad:#e8776a;--bar:#e3b556;color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font:14px/1.45 system-ui,sans-serif;padding-inline:16px;padding-block:16px}
main{max-width:1100px;margin:0 auto}
h1{font-size:20px;margin:0 0 4px;color:var(--gold);letter-spacing:.04em}h2{font-size:16px;margin:26px 0 8px;color:var(--gold);text-wrap:balance}p.s{color:var(--dim);margin:0 0 12px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}.k{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 12px}.k b{display:block;font-size:22px;font-variant-numeric:tabular-nums}.k span{color:var(--dim);font-size:12px}
.wrap{overflow-x:auto;border:1px solid var(--line);border-radius:10px;background:var(--panel)}table{border-collapse:collapse;width:100%;min-width:760px;font-variant-numeric:tabular-nums}th,td{padding:6px 8px;text-align:right;border-bottom:1px solid var(--line);white-space:nowrap}th{background:var(--panel);cursor:pointer;color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.05em}
td:first-child,th:first-child{text-align:left;position:sticky;left:0;background:var(--panel)}tr:last-child td{border-bottom:0}
.bar{display:inline-block;height:8px;border-radius:4px;vertical-align:middle;margin-left:6px}.pos{background:var(--good)}.neg{background:var(--bad)}
.tag{font-size:10px;padding:1px 6px;border-radius:8px;border:1px solid var(--line);color:var(--dim)}.flag{color:var(--bad);font-weight:700}.ok{color:var(--good)}
.hist{display:flex;align-items:flex-end;gap:4px;height:70px}.hist div{flex:1;background:var(--bar);opacity:.85;border-radius:3px 3px 0 0;position:relative}.hist small{position:absolute;bottom:-16px;left:0;right:0;text-align:center;color:var(--dim);font-size:10px}
.note{color:var(--dim);font-size:12px;margin:6px 2px}
</style>
<main>
<h1>Laboratório de Balanceamento</h1>
<p class="s">Partidas IA × IA (a IA planejadora nos dois lados, cadeiras e quem começa alternando). A IA joga diferente de uma pessoa: os números mostram tendências, não verdades.</p>
<div id="root"></div>
<script>
const BASE=${JSON.stringify(base)}, DETAIL=${JSON.stringify(detail)}, VARIANTS=${JSON.stringify(variants)};
const pct=(x,d=0)=>(100*x).toFixed(d)+'%', sg=(x,d=1)=>(x>0?'+':'')+x.toFixed(d);
function summary(S){
  const h=Object.keys(S.hist).map(Number).sort((a,b)=>a-b), mx=Math.max(...Object.values(S.hist));
  return '<h2>'+S.name+'</h2><div class="grid">'+
   '<div class="k"><b>'+pct(S.cardeal)+'</b><span>Cardeal vence</span></div><div class="k"><b>'+pct(S.capitao)+'</b><span>Capitão vence</span></div>'+
   '<div class="k"><b>'+pct(S.firstWinRate)+'</b><span>quem começa vence</span></div><div class="k"><b>'+S.rounds.toFixed(1)+'</b><span>rodadas por partida</span></div>'+
   '<div class="k"><b>'+S.n+'</b><span>partidas'+(S.undecided?' ('+S.undecided+' sem vencedor)':'')+'</span></div></div>'+
   '<div class="note">Rodadas em que as partidas terminam:</div><div class="hist" style="margin-bottom:22px">'+h.map(r=>'<div style="height:'+Math.max(4,70*S.hist[r]/mx)+'px"><small>'+r+'</small></div>').join('')+'</div>';
}
function deckTable(D,V){
  const cols=[['name','Carta'],['type','Tipo'],['cost','Custo'],['stats','ATK/HP'],['copies','Cópias'],['seen','Jogos c/ ela'],['dWr','Δ vitória'],['dMargin','Δ vida do General'],['plays','Usos/jogo'],['dmg','Dano/jogo'],['kills','Abates/jogo']];
  const vm=V?Object.fromEntries(V.cards.map(c=>[c.name,c])):null;
  let rows=D.cards.slice();
  const render=()=>{
    const t=document.getElementById('t-'+D.id);
    t.innerHTML='<thead><tr>'+cols.map(c=>'<th data-k="'+c[0]+'">'+c[1]+'</th>').join('')+'</tr></thead><tbody>'+rows.map(c=>{
      const sig=Math.abs(c.dWr)>1.96*c.dWrSe&&c.seen>=20;
      const bar=(v,sc)=>'<span class="bar '+(v>=0?'pos':'neg')+'" style="width:'+Math.min(60,Math.abs(v)*sc)+'px"></span>';
      const ab=c.abilityCost!==null?' <span class="tag">hab. '+c.abilityCost+' ouro</span>':'';
      return '<tr><td>'+c.name+ab+'</td><td>'+c.type+'</td><td>'+c.cost+'</td><td>'+(c.type==='Infantaria'||c.type==='Arqueiro'||c.type==='Cavalaria'||c.type==='Armamento'||c.type==='General'?c.atk+'/'+c.hp:'—')+'</td><td>'+c.copies+'</td><td>'+c.seen+'</td>'+
        '<td class="'+(sig?(c.dWr>0?'ok':'flag'):'')+'">'+sg(100*c.dWr,0)+' pp'+bar(c.dWr,160)+'</td><td>'+sg(c.dMargin,1)+bar(c.dMargin,6)+'</td><td>'+c.plays.toFixed(2)+'</td><td>'+c.dmg.toFixed(1)+'</td><td>'+c.kills.toFixed(2)+'</td></tr>';
    }).join('')+'</tbody>';
    t.querySelectorAll('th').forEach(th=>th.onclick=()=>{const k=th.dataset.k;const key=k==='stats'?'atk':k;const dir=th.dataset.dir==='1'?-1:1;th.dataset.dir=dir===1?'1':'0';rows.sort((a,b)=>(typeof a[key]==='string'?a[key].localeCompare(b[key]):(a[key]-b[key]))*dir*(typeof a[key]==='string'?1:-1)*-1);render();});
  };
  setTimeout(render,0);
  const ty=Object.entries(D.types).map(([k,v])=>v+' '+k.toLowerCase()).join(' · ');
  return '<h2>'+D.name+' — '+pct(D.wr)+' de vitórias <span class="tag">'+DETAIL.name+'</span></h2><p class="s">'+D.total+' cartas · custo médio '+D.avgCost.toFixed(2)+' · '+ty+'. Δ vitória = quanto a vitória sobe (ou cai) nas partidas em que a carta foi comprada, comparado às que não. Vermelho/verde = diferença que não é acaso. Clique no título da coluna para ordenar.</p><div class="wrap"><table id="t-'+D.id+'"></table></div>';
}
function changes(S){
  const p=S.patch; if(!p) return '<i>nada mudou</i>';
  const L=[];
  Object.entries(p.cards||{}).forEach(([n,d])=>{const x=[];if(d.atk!==undefined)x.push('ATK '+d.atk);if(d.hp!==undefined)x.push('HP '+d.hp);if(d.cost!==undefined)x.push('custo '+d.cost);if(d.abilityCost!==undefined)x.push('habilidade custa '+d.abilityCost);if(d.set)x.push('efeito reescrito ('+Object.keys(d.set).join(', ')+')');if(d.merge)x.push('efeito ajustado');L.push(n+': '+x.join(', '));});
  if(p.rules)Object.entries(p.rules).forEach(([k,v])=>L.push(({startGold:'Ouro inicial',goldPerTurn:'Ouro por turno',goldFromRound:'Ouro a partir da rodada',combatFromRound:'Combate a partir da rodada'})[k]+': '+v));
  Object.entries(p.decks||{}).forEach(([id,c])=>Object.entries(c).forEach(([n,k])=>L.push((id==='capitao'?'Capitão':'Cardeal')+': '+n+' → '+k+' cópia'+(k===1?'':'s'))));
  return L.join('<br>');
}
function compare(B,Vs){
  const all=[B,...Vs];
  const row=(l,f)=>'<tr><td>'+l+'</td>'+all.map(S=>'<td>'+f(S)+'</td>').join('')+'</tr>';
  return '<h2>Lado a lado</h2><div class="wrap"><table><thead><tr><th>Medida</th>'+all.map((S,i)=>'<th style="white-space:normal;text-align:right">'+(i?S.name:'Hoje')+'</th>').join('')+'</tr></thead><tbody>'+
    row('Cardeal vence',S=>pct(S.cardeal))+row('Capitão vence',S=>pct(S.capitao))+row('Quem começa vence',S=>pct(S.firstWinRate))+row('Rodadas por partida',S=>S.rounds.toFixed(1))+
    row('Dano por partida (Cardeal)',S=>S.decks.cardeal.dmgPerGame.toFixed(1))+row('Dano por partida (Capitão)',S=>S.decks.capitao.dmgPerGame.toFixed(1))+
    row('Cartas no deck (Cardeal / Capitão)',S=>S.decks.cardeal.total+' / '+S.decks.capitao.total)+row('Partidas simuladas',S=>S.n)+
    '<tr><td style="vertical-align:top">O que mudou</td>'+all.map(S=>'<td style="white-space:normal;font-size:12px;vertical-align:top">'+changes(S)+'</td>').join('')+'</tr></tbody></table></div>';
}
let h=summary(BASE);
if(VARIANTS.length) h+=compare(BASE,VARIANTS);
Object.keys(BASE.decks).forEach(id=>{h+=deckTable(DETAIL.decks[id],null);});
document.getElementById('root').innerHTML=h;
</script></main>`;
writeFileSync(process.env.OUT ?? 'balance-out/report.html', html);
console.log('ok');
