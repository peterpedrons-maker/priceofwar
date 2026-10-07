// O servidor online (Desafios inclusive) roda o pacote gerado em ../supabase/functions/game/index.ts.
// Se o motor ou o catálogo mudam e o pacote não é regerado, as partidas nascem com as regras antigas
// (foi assim que o General do Desafio ficou com 20 de vida). Este teste falha quando o pacote está defasado.
//   se falhar: npm run build:edge  (e commitar o resultado)
import { execSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'pow-edge-'));
const out = join(dir, 'index.ts');
const cmd = (JSON.parse(readFileSync('package.json', 'utf8')).scripts['build:edge'] as string).replace(/--outfile=\S+/, `--outfile=${out}`);
execSync(`npx ${cmd}`, { stdio: 'pipe' });
const fresh = readFileSync(out, 'utf8');
const committed = readFileSync('../supabase/functions/game/index.ts', 'utf8');
if (fresh !== committed) {
  console.error('FALHOU: supabase/functions/game/index.ts está defasado em relação a src/engine e server/. Rode `npm run build:edge` e faça commit.');
  process.exit(1);
}
console.log('pacote do servidor online está em dia');
