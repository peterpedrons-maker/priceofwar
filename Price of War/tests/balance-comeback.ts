// How often does the player who is behind turn the match around? Reads a lab result (it needs the `trace` the lab records):
//   COMEBACK=balance-out/comeback.json npx tsx tests/balance-comeback.ts
// "Ahead" = more board material (atk + hp of the units) or more General HP by the stated margin after a full round (both seats played).
import { readFileSync } from 'node:fs';
type G = { first: 0 | 1; winner: 0 | 1 | null; trace: number[][] };
const games = (JSON.parse(readFileSync(process.env.COMEBACK ?? 'balance-out/comeback.json', 'utf8')).games as G[]).filter(g => g.winner !== null);
const afterRound = (g: G, k: number) => g.trace.find(r => r[0] === k && r[1] !== g.first);
console.log(`${games.length} partidas`);
for (const k of [1, 2, 3, 4, 5]) {
  const line = (name: string, a: number, b: number, th: number) => {
    let n = 0, w = 0;
    for (const g of games) {
      const r = afterRound(g, k); if (!r) continue;
      const diff = r[a] - r[b]; if (Math.abs(diff) < th) continue;
      n++; if (g.winner === (diff > 0 ? 0 : 1)) w++;
    }
    if (n) console.log(`depois da rodada ${k}, à frente em ${name} por >= ${th}: ${n} partidas, quem está à frente vence ${(100 * w / n).toFixed(0)}% (virada ${(100 - 100 * w / n).toFixed(0)}%)`);
  };
  line('material', 4, 5, 8); line('vida do General', 2, 3, 5);
}
let trailed = 0, far = 0;
for (const g of games) {
  const w = g.winner!; let t = false, f = false;
  for (const r of g.trace) {
    const mat = w === 0 ? r[4] - r[5] : r[5] - r[4], hp = w === 0 ? r[2] - r[3] : r[3] - r[2];
    if (r[0] >= 2 && (mat <= -6 || hp <= -6)) t = true;
    if (r[0] >= 2 && (mat <= -12 || hp <= -10)) f = true;
  }
  if (t) trailed++; if (f) far++;
}
console.log(`o vencedor já esteve bem atrás (>= 6 de material ou de vida) depois da rodada 2 em ${(100 * trailed / games.length).toFixed(0)}% das partidas; muito atrás (>= 12 de material ou >= 10 de vida) em ${(100 * far / games.length).toFixed(0)}%`);
