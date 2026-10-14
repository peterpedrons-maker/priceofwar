// Lê balance-out/todos.json e imprime tabelas em markdown.   IN=balance-out/todos npx tsx tests/balance-todos-report.ts
import { readFileSync } from 'node:fs';
const g: any[] = JSON.parse(readFileSync((process.env.IN ?? 'balance-out/todos') + '.json', 'utf8')).games;
const IDS = ['cardeal', 'capitao', 'mercenarios', 'campo'], NM: any = { cardeal: 'Cardeal', capitao: 'Capitão', mercenarios: 'Mercenários', campo: 'Campo' };
const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0), f1 = (n: number) => n.toFixed(1), pc = (n: number, d: number) => (d ? Math.round(100 * n / d) : 0) + '%';
const row = (...c: any[]) => '| ' + c.join(' | ') + ' |';
const per = (id: string) => g.flatMap(x => x.seats.filter((p: any) => p.deck === id).map((p: any) => ({ p, x })));
console.log('### Vitória (linha vence coluna)');
console.log(row('', ...IDS.map(i => NM[i]), 'Média')); console.log(row('---', ...IDS.map(() => '---'), '---'));
for (const a of IDS) { const cells = IDS.map(b => { if (a === b) return '–'; const gs = g.filter(x => (x.a === a && x.b === b) || (x.a === b && x.b === a)); const w = gs.filter(x => x.winner !== null && x.seats[x.winner].deck === a).length; return pc(w, gs.length); });
  const mine = per(a); console.log(row(NM[a], ...cells, pc(mine.filter(({ p }) => p.won).length, mine.length))); }
console.log('\nPartidas por confronto: ' + g.filter(x => x.a === 'cardeal' && x.b === 'capitao').length + ' · sem vencedor: ' + g.filter(x => x.winner === null).length + ' · quem começa vence: ' + pc(g.filter(x => x.winner === x.first).length, g.filter(x => x.winner !== null).length));
console.log('\n### Duração (rodadas)');
console.log(row('Confronto', 'Média', 'Mais curta', 'Mais longa', 'Mais comum', 'Acabam até a 3ª', 'Passam da 6ª')); console.log(row(...Array(7).fill('---')));
const dur = (label: string, gs: any[]) => { const r = gs.map(x => x.rounds), cnt: any = {}; r.forEach(v => cnt[v] = (cnt[v] ?? 0) + 1); const mode = Object.entries(cnt).sort((a: any, b: any) => b[1] - a[1])[0]; console.log(row(label, f1(avg(r)), Math.min(...r), Math.max(...r), `${mode[0]} (${pc(mode[1] as number, r.length)})`, pc(r.filter(v => v <= 3).length, r.length), pc(r.filter(v => v > 6).length, r.length))); };
for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) dur(`${NM[IDS[i]]} × ${NM[IDS[j]]}`, g.filter(x => x.a === IDS[i] && x.b === IDS[j]));
dur('Todos', g);
console.log('\n### Por deck (média por partida, contra todos)');
console.log(row('Deck', 'Vitória', 'Rodadas', 'Ouro sobrando no fim do turno', 'Ouro gasto', 'Unidades em campo (média)', 'Máx. em campo', 'Unidades inimigas destruídas', 'Unidades perdidas', 'Ataques', 'Vida do General no fim')); console.log(row(...Array(11).fill('---')));
for (const id of IDS) { const m = per(id); console.log(row(NM[id], pc(m.filter(({ p }) => p.won).length, m.length), f1(avg(m.map(({ x }) => x.rounds))), f1(avg(m.flatMap(({ p }) => p.leftover))), f1(avg(m.map(({ p }) => p.spent))), f1(avg(m.flatMap(({ p }) => p.units))), f1(avg(m.map(({ p }) => p.maxUnits))), f1(avg(m.map(({ p }) => p.killed))), f1(avg(m.map(({ p }) => p.lost))), f1(avg(m.map(({ p }) => p.attacks))), f1(avg(m.map(({ p }) => p.generalHp))))); }
console.log('\n### Vida do General: vitórias e derrotas');
console.log(row('Deck', 'Vida média ao vencer', 'Vida média ao perder')); console.log(row('---', '---', '---'));
for (const id of IDS) { const m = per(id); console.log(row(NM[id], f1(avg(m.filter(({ p }) => p.won).map(({ p }) => p.generalHp))), f1(avg(m.filter(({ p }) => !p.won).map(({ p }) => p.generalHp))))); }
console.log('\n### Cartas jogadas por partida, por tipo');
const types = [...new Set(g.flatMap(x => x.seats.flatMap((p: any) => Object.keys(p.played))))].sort();
console.log(row('Deck', ...types)); console.log(row('---', ...types.map(() => '---')));
for (const id of IDS) { const m = per(id); console.log(row(NM[id], ...types.map(t => f1(avg(m.map(({ p }) => p.played[t] ?? 0)))))); }
console.log('\n### Modos de Terreno/Relíquia escolhidos (por 100 partidas)');
const modes = [...new Set(g.flatMap(x => x.seats.flatMap((p: any) => Object.keys(p.modes))))].sort();
console.log(row('Modo', ...IDS.map(i => NM[i]))); console.log(row('---', ...IDS.map(() => '---')));
for (const mo of modes) { const cells = IDS.map(id => { const m = per(id); return f1(100 * m.reduce((t, { p }) => t + (p.modes[mo] ?? 0), 0) / m.length); }); if (cells.some(c => c !== '0.0')) console.log(row(mo, ...cells)); }
