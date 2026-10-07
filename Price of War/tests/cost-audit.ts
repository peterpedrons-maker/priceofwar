// Auditoria de custo: compara o custo de cada unidade com a tabela por soma de atributos (ATK + vida) e lista os desvios.
//   npx tsx tests/cost-audit.ts            → Cardeal + Capitão (catálogo do jogo)
//   MERC=1 npx tsx tests/cost-audit.ts     → inclui o deck experimental Mercenários
// Tabela (docs/balanceamento.md, "Tabela de custo"): soma ≤3 → 1 · 4–6 → 2 · 7–8 → 3 · ≥9 → 4.
// Manutenção: cada ponto deixa a carta passar 1 de soma da faixa (a soma é descontada da manutenção antes de achar a faixa).
// Ajustes de leitura: à distância (Arqueiro/Artilharia) com ATK ≥ 2 paga +1; efeito forte +1 (julgamento, marcado com *).
import { CARD_DEFS, DECK_RECIPES } from '../src/engine/catalog';
import { MERCENARIOS_DEFS, MERCENARIOS_RECIPE } from '../src/engine/experimental';

const UNITS = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'];
export const bandCost = (soma: number) => (soma <= 3 ? 1 : soma <= 6 ? 2 : soma <= 8 ? 3 : 4);
const defs = [...CARD_DEFS, ...(process.env.MERC ? MERCENARIOS_DEFS : [])];
const where = (name: string) => {
  const ids: string[] = [];
  for (const [id, r] of Object.entries(DECK_RECIPES)) if ((r.cards as Record<string, number>)[name]) ids.push(id === 'capitao' ? 'Cap' : 'Car');
  if (process.env.MERC && MERCENARIOS_RECIPE.cards[name]) ids.push('Mer');
  return ids.join('+') || '—';
};
const rows = defs.filter(c => UNITS.includes(c.cardType)).map(c => {
  const soma = c.atk + c.hp;
  const ranged = (c.cardType === 'Arqueiro' || c.cardType === 'Artilharia') && c.atk >= 2;
  const upkeep = (c as any).upkeep ?? 0;   // manutenção compra atributos: +1 de soma além da faixa por ponto de manutenção
  const base = bandCost(soma - upkeep) + (ranged ? 1 : 0);
  const effect = !!(c.abilities?.length || c.passives?.length);
  return { name: c.name, deck: where(c.name), t: c.cardType.slice(0, 3), stats: `${c.atk}/${c.hp}`, soma, cost: c.cost, base, delta: c.cost - base, effect, upkeep };
}).sort((a, b) => a.cost - b.cost || a.soma - b.soma);
console.log('deck | carta | tipo | ATK/HP | soma | custo | custo pela tabela | desvio | efeito | manutenção');
for (const r of rows) {
  const d = r.delta === 0 ? '  ok' : r.delta > 0 ? ` +${r.delta}` : ` ${r.delta}`;
  console.log(`${r.deck.padEnd(7)} ${r.name.padEnd(26)} ${r.t} ${r.stats.padEnd(4)} soma ${String(r.soma).padStart(2)} custo ${r.cost} tabela ${r.base} ${d.padEnd(4)}${r.effect ? '*' : ' '}${r.upkeep ? ' m' + r.upkeep : ''}`);
}
const off = rows.filter(r => r.delta !== 0);
console.log(`\n${rows.length} unidades; ${rows.length - off.length} na tabela; ${off.length} fora: ${off.map(r => `${r.name} (${r.delta > 0 ? '+' : ''}${r.delta}${r.effect ? ', com efeito' : ''})`).join(', ') || '—'}`);
