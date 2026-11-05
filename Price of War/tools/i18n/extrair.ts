// Lista os textos em português do jogo (JSX, atributos, strings e templates) e os nomes/efeitos do catálogo, para o dicionário de inglês.
//   npx tsx tools/i18n/extrair.ts [saida.json]
// Padrão de dinâmico: "Faltam {} cartas" (cada ${...} ou {expressão} vira {}).
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const FILES: string[] = [];
const walk = (d: string) => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) { if (!['assets', 'node_modules'].includes(e.name)) walk(p); }
  else if (/\.(tsx?)$/.test(e.name) && !/\.d\.ts$/.test(e.name)) FILES.push(p);
});
walk(path.join(ROOT, 'src')); walk(path.join(ROOT, 'server'));

const ACCENT = /[áéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ]/;
const STOP = /\b(de|da|do|das|dos|para|você|voce|uma|um|seu|sua|seus|suas|não|nao|com|que|por|em|no|na|nos|nas|os|as|ou|se|é|já|mais|sem|ao|aos|ele|ela|este|esta|essa|esse|aqui|agora|tem|ter|vez|jogo|carta|cartas|partida|deck|coroas|vitória|derrota|turno|rodada|ouro|escolha|toque|voltar|sair|jogar|abrir|fechar|salvar|enviar|nome|erro|tente|aguarde|carregando)\b/i;
const looksCode = (s: string) => /^[a-z0-9_.:/#%@\-\[\]\(\),;=+*<>|&!?'"{}\\ ]*$/.test(s) && !ACCENT.test(s) && !/\s[a-zç]{3,}\s/.test(s) && !STOP.test(s);
const CSS = /(\bpx\b|rgba?\(|#[0-9a-f]{3,8}\b|\bvh\b|\bvw\b|flex|absolute|translate|gradient|\.webp|\.png|\.mp3|=>|\bfont-)/i;
export const isPt = (s: string) => { const t = s.trim(); if (t.length < 2 || !/[A-Za-zÀ-ú]{2}/.test(t)) return false; if (CSS.test(t) || looksCode(t)) return false; return ACCENT.test(t) || STOP.test(t) || /\s/.test(t) && /[A-Za-z]{3,}/.test(t) && !/^[a-z\-]+(\s[a-z\-\[\]0-9\/.:]+)+$/.test(t); };

export const extrairTudo = (): Map<string, Set<string>> => {
const found = new Map<string, Set<string>>();
  const add = (s: string, where: string, force = false) => { const k = s.replace(/\s+/g, ' ').trim(); if (!k || !(force ? /[A-Za-zÀ-ú]{2}/.test(k) && !CSS.test(k) : isPt(k))) return; (found.get(k) ?? found.set(k, new Set()).get(k)!).add(where); };
  
  for (const file of FILES) {
    const src = fs.readFileSync(file, 'utf8'), sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const rel = path.relative(ROOT, file), line = (n: ts.Node) => rel + ':' + (sf.getLineAndCharacterOfPosition(n.getStart()).line + 1);
    const visit = (n: ts.Node) => {
      if (ts.isJsxElement(n) || ts.isJsxFragment(n)) {
        // sequências de texto + expressões vizinhas viram um padrão só
        let cur = '', has = false, at: ts.Node = n;
        const flush = () => { if (has) add(cur, line(at), true); cur = ''; has = false; };
        n.children.forEach(c => {
          if (ts.isJsxText(c)) { const t = c.text.replace(/\s+/g, ' '); if (t.trim()) { if (!has) at = c; has = true; } cur += t; }
          else if (ts.isJsxExpression(c) && c.expression && !ts.isJsxElement(c.expression) && !(ts.isConditionalExpression(c.expression)) && !(ts.isBinaryExpression(c.expression) && (c.expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken || c.expression.operatorToken.kind === ts.SyntaxKind.BarBarToken)) && !(ts.isCallExpression(c.expression) && /\.map$/.test(c.expression.expression.getText()))) {
            if (ts.isStringLiteral(c.expression) || ts.isNoSubstitutionTemplateLiteral(c.expression)) { if (!has) at = c; has = true; cur += c.expression.text; } else cur += '{}';
          } else flush();
        });
        flush();
      }
      if (ts.isJsxAttribute(n) && n.initializer && ts.isStringLiteral(n.initializer) && /^(aria-label|placeholder|title|alt|label|sub|text|name)$/.test(n.name.getText())) add(n.initializer.text, line(n), true);
      if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) { if (!ts.isImportDeclaration(n.parent) && !ts.isExportDeclaration(n.parent)) add(n.text, line(n)); }
      if (ts.isTemplateExpression(n)) { let s = n.head.text; n.templateSpans.forEach(sp => { s += '{}' + sp.literal.text; }); add(s, line(n)); }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  
  return found;
};

if (process.argv[1] && import.meta.url === new URL('file://' + path.resolve(process.argv[1])).href) {
  const found = extrairTudo();
  const out = Object.fromEntries([...found.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pt')).map(([k, v]) => [k, [...v].slice(0, 2)]));
  const dest = process.argv[2];
  if (dest) fs.writeFileSync(dest, JSON.stringify(out, null, 1));
  console.log(Object.keys(out).length, 'textos');
}
