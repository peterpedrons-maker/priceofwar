// Dicionário de inglês: todo texto em português do código precisa ter tradução (ou estar em tools/i18n/ignorar.json, que lista o que não é texto de jogador).
//   npx tsx tests/i18n.ts      Para ver os que faltam: a lista sai no erro. Depois de traduzir, ponha em src/i18n/en.json.
import fs from 'node:fs';
import { extrairTudo } from '../tools/i18n/extrair';
import en from '../src/i18n/en.json';
import { hasEnglish, t } from '../src/i18n';

let failed = 0;
const check = (ok: boolean, msg: string) => { if (!ok) { failed++; console.log('  ✗ ' + msg); } };
const D = en as Record<string, string>;
const ignore = new Set<string>(JSON.parse(fs.readFileSync(new URL('../tools/i18n/ignorar.json', import.meta.url), 'utf8')));
const missing = [...extrairTudo().keys()].filter(k => D[k] === undefined && !ignore.has(k));
check(missing.length === 0, `${missing.length} texto(s) sem tradução para o inglês:\n      ` + missing.slice(0, 40).join('\n      '));
// os espaços reservados batem: "{}" na chave e no valor (ou {1}, {2} numerados)
for (const [k, v] of Object.entries(D)) {
  const a = (k.match(/\{\}/g) ?? []).length, b = (v.match(/\{\d*\}/g) ?? []).length;
  check(a === b, `espaços reservados diferentes: "${k}" → "${v}"`);
  check(v.trim().length > 0, `tradução vazia: "${k}"`);
  check((k.match(/\*\*/g) ?? []).length === (v.match(/\*\*/g) ?? []).length, `marcas ** diferentes: "${k}" → "${v}"`);
}
// o tradutor: exato, com padrão e com nome de carta dentro do padrão
check(hasEnglish('Voltar') && hasEnglish('Faltam 3 cartas (mínimo 50)') && hasEnglish('O oponente ativou uma Emboscada: Linha Fechada!'), 'padrões do tradutor');
console.log(failed === 0 ? `${Object.keys(D).length} traduções, tudo coberto` : `${failed} falha(s)`);
process.exit(failed === 0 ? 0 : 1);
