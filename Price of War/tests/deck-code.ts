// Código de deck: ida e volta, e recusa de código estragado.   npx tsx tests/deck-code.ts
import { DECK_RECIPES } from '../src/engine/catalog';
import { decodeDeck, encodeDeck } from '../src/deckCode';
let failed = 0;
const ok = (c: boolean, m: string) => { if (!c) { failed++; console.log('  ✗ ' + m); } };
for (const id of ['cardeal', 'capitao', 'mercenarios', 'campo'] as const) {
  const r = DECK_RECIPES[id], code = encodeDeck(r.general, r.cards), back = decodeDeck(code);
  ok(!('error' in back) && back.general === r.general && JSON.stringify(Object.entries(back.cards).sort()) === JSON.stringify(Object.entries(r.cards).sort()), `${id}: ida e volta`);
  ok(code.length < 220, `${id}: código curto (${code.length})`);
}
const code = encodeDeck(DECK_RECIPES.cardeal.general, DECK_RECIPES.cardeal.cards);
ok('error' in decodeDeck(code.slice(0, -3)), 'código cortado é recusado');
ok('error' in decodeDeck(code.slice(0, 20) + (code[20] === 'A' ? 'B' : 'A') + code.slice(21)), 'código alterado é recusado');
ok('error' in decodeDeck('qualquer coisa'), 'texto qualquer é recusado');
ok('error' in decodeDeck(''), 'vazio é recusado');
ok(!('error' in decodeDeck('  ' + code.slice(0, 30) + '\n' + code.slice(30) + ' ')), 'espaços e quebra de linha ao colar não atrapalham');
console.log(failed ? `${failed} falha(s)` : 'deck-code: ok'); process.exit(failed ? 1 : 0);
