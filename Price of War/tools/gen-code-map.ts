// Writes docs/mapa-do-codigo.md: every source file, what it is for (FILE_NOTES below, kept by hand) and where its top-level pieces are
// (found by reading the code, so the line numbers are always current). Run it again after changing the code:   npm run map
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FILE_NOTES: Record<string, string> = {
  'src/App.tsx': 'O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.',
  'src/CollectionRoom.tsx': 'Sala de Coleção: o quarto em imagem única com objetos tocáveis (livro, porta, estante de boosters, mesa/deck), câmera com zoom e o fichário (Binder).',
  'src/CardViewer3D.tsx': 'Visualizador 3D de carta (three.js, carregado sob demanda); também a página ?3d.',
  'src/TurnTracker.tsx': 'Marcador de turno/fases na tela da partida.',
  'src/audioSettings.ts': 'Volumes de música e efeitos (localStorage).',
  'src/gameSettings.ts': 'Opções do jogador (avisos de arrastar/tabuleiro), hook useGameSettings.',
  'src/card3d.ts': 'Caminho das faces pré-renderizadas das cartas para o 3D.',
  'src/main.tsx': 'Ponto de entrada do React.',
  'src/numberGlyphs.ts': 'Imagens dos números (ATK/HP/dano) usadas nas cartas.',
  'src/sfx.ts': 'Efeitos sonoros curtos por Web Audio.',
  'src/triggers.ts': 'Ícones/nomes dos gatilhos (Convocação, Ofensiva, ...).',
  'src/services/auth.ts': 'Login (convidado, Google, Discord, e-mail) via Supabase.',
  'src/services/cloud.ts': 'Salvar/ler coleção e decks na nuvem.',
  'src/services/online.ts': 'Cliente do modo online: fila, partida por passos, relógio.',
  'src/tutorial/script.ts': 'Dados do tutorial 1: partida fixa, jogadas do treinador, passos e falas.',
  'src/tutorial/ui.tsx': 'Peças visuais do tutorial: Aldric, mãozinha, escurecimento com buracos, lista.',
  'src/ui/ThinFrame.tsx': 'Moldura fina reutilizável.',
  'src/engine/catalog.ts': 'TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).',
  'src/engine/types.ts': 'Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.',
  'src/engine/rules.ts': 'Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).',
  'src/engine/game.ts': 'O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).',
  'src/engine/ai.ts': 'A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).',
  'src/engine/view.ts': 'O que cada jogador pode ver (esconde mão e baralho do outro).',
  'src/engine/rewards.ts': 'Regras de recompensa (XP, Coroas, nível).',
  'src/engine/deck.ts': 'Regras de montagem de deck (40 a 60 cartas, 4 cópias).',
  'src/engine/rng.ts': 'Números aleatórios com semente (a partida pode ser repetida).',
  'server/handler.ts': 'Servidor da partida online: fila, passos, relógio, recompensas.',
  'server/types.ts': 'Tipos do servidor e do banco.',
  'server/memoryDb.ts': 'Banco em memória (testes).',
  'server/supabaseDb.ts': 'Banco no Supabase.',
  'server/edge.ts': 'Entrada da Edge Function (gerada em supabase/functions/game).',
  'tests/engine-rules.ts': 'Um cenário por regra do jogo (npm test).',
  'tests/engine-sim.ts': 'Partidas IA × IA com invariantes, repetição determinística e fuzz (npm test).',
  'tests/tutorial-script.ts': 'Joga o tutorial inteiro e confere que o jogador vence no 4º turno (npm test).',
  'tests/online-server.ts': 'Testes do servidor online (npm test).',
  'tests/mock-supabase.ts': 'Supabase falso para os testes online.',
  'tests/raw-stats.ts': 'Faz os testes de regras usarem os atributos base (ignora BALANCE).',
  'tests/ai-arena.ts': 'IA nova contra a antiga.',
  'tests/balance-lab.ts': 'LABORATÓRIO de balanceamento: joga muitas partidas IA × IA, com patches "e se" (docs/balanceamento.md).',
  'tests/balance-report.ts': 'Transforma os resultados do laboratório em uma página (relatório lado a lado).',
  'tests/balance-comeback.ts': 'Mede viradas (comeback) a partir dos resultados do laboratório.',
  'tests/balance-matchup.ts': 'Teste rápido Cardeal × Capitão.',
  'tests/balance-rules-preload.ts': 'Passa as regras do patch (ouro, início do combate) ao motor antes de ele carregar.',
  'tools/gen-code-map.ts': 'Gera este arquivo.',
};
const ROOTS = ['src', 'server', 'tests', 'tools'];
const files: string[] = [];
const walk = (dir: string) => { for (const n of readdirSync(dir)) { const p = join(dir, n); if (statSync(p).isDirectory()) { if (n !== 'assets' && n !== '__pycache__') walk(p); } else if (/\.(ts|tsx)$/.test(n)) files.push(p); } };
ROOTS.forEach(walk);
files.sort((a, b) => ROOTS.indexOf(a.split('/')[0]) - ROOTS.indexOf(b.split('/')[0]) || a.localeCompare(b));

const DECL = /^(export )?(default )?(async )?(const|let|function|class|type|interface|enum) ([A-Za-z_$][\w$]*)/;
const NESTED = /^  (const|function) ([A-Za-z_$][\w$]*) = (async )?(\(|function|useCallback|useMemo)|^  function ([A-Za-z_$][\w$]*)\(/;
let out = '<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->\n# Mapa do código\n\nComo achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.\nAs linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.\n';
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  out += `\n## ${f}  (${lines.length} linhas)\n${FILE_NOTES[f] ?? '(sem descrição ainda: acrescente em FILE_NOTES)'}\n`;
  const decls: { line: number; name: string }[] = [];
  lines.forEach((l, i) => { const m = DECL.exec(l); if (m) decls.push({ line: i + 1, name: m[5] }); });
  if (decls.length === 0) continue;
  out += '\n' + decls.map(d => `${d.name}:${d.line}`).join(' · ') + '\n';
  // inside a very large component/function: its named inner functions, so the 5000 lines of App are not a blob
  decls.forEach((d, i) => {
    const end = (decls[i + 1]?.line ?? lines.length) - 1;
    if (end - d.line < 800) return;
    const inner: string[] = [];
    for (let n = d.line; n < end; n++) { const m = NESTED.exec(lines[n]); if (m) inner.push(`${m[2] ?? m[5]}:${n + 1}`); }
    if (inner.length) out += `\nDentro de \`${d.name}\` (linhas ${d.line}–${end}), funções internas:\n${inner.join(' · ')}\n`;
  });
}
writeFileSync('docs/mapa-do-codigo.md', out);
console.log(`docs/mapa-do-codigo.md: ${files.length} arquivos, ${out.length} caracteres`);
