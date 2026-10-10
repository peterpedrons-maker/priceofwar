// Gera a tabela de cartas do deck Mercenários a partir do código (src/engine/experimental.ts) e a troca em docs/deck-mercenarios.md.
//   npx tsx tools/mercenarios-tabela.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { MERCENARIOS_DEFS, MERCENARIOS_RECIPE } from '../src/engine/experimental';

const rows = Object.entries(MERCENARIOS_RECIPE.cards).map(([name, n]) => {
  const d = MERCENARIOS_DEFS.find(x => x.name === name)!;
  const tipo = d.cardType === 'Relíquia' ? `Relíquia (${d.hp} de vida), ${d.cost}`
    : ['Tática', 'Emboscada'].includes(d.cardType) ? `${d.cardType}, ${d.cost}` : `${d.cardType} ${d.atk}/${d.hp}, ${d.cost}`;
  return `| ${name} | ${n} | ${tipo} | ${d.upkeep ?? '—'} | ${d.effect || 'só atributos'} |`;
});
const table = `| Carta | Cópias | Tipo, ATK/HP, custo | Manutenção | O que faz |\n|---|---|---|---|---|\n${rows.join('\n')}\n`;
const path = 'docs/deck-mercenarios.md';
const doc = readFileSync(path, 'utf8');
const start = doc.indexOf('| Carta | Cópias |');
const end = doc.indexOf('(A primeira simulação', start);
if (start < 0 || end < 0) throw new Error('não achei a tabela em docs/deck-mercenarios.md');
writeFileSync(path, doc.slice(0, start) + table + doc.slice(end));
console.log(`${rows.length} cartas, ${Object.values(MERCENARIOS_RECIPE.cards).reduce((a, b) => a + b, 0)} no total`);
