# Price of War (guia para Claude)

Jogo de cartas digital em React + TypeScript; o app fica em `Price of War/` (há também `Price of War Godot/`, migração para o Godot **adiada**, foco no jogo web: se voltar, leia `Price of War/docs/godot.md`). Responda **sempre em português do Brasil**; o dono joga no celular (mobile primeiro, poucos toques) e quer ver mockup/opinião antes de mudanças visuais grandes. Não crie PR sem pedido; desenvolva na branch `claude/price-of-war-project-xgzrn3` (commit + `git push -u origin` dela, com as linhas de atribuição pedidas pelo ambiente).

## Antes de mexer (para não reler o jogo inteiro)
1. Leia `Price of War/docs/visao-geral.md` (uma página: regras, decks, decisões, pendências, "onde mexer para...").
2. Ache o arquivo e a linha em `Price of War/docs/mapa-do-codigo.md` (`grep -n Nome`); leia só o trecho. `src/App.tsx` tem 10 mil linhas: nunca leia inteiro.
3. Se o assunto tem documento próprio, leia só ele: regras do motor `docs/engine.md`, efeitos `docs/efeitos.md`, palavras do jogo `docs/vocabulario.md`, textos de carta `docs/textos-cartas.md`, balanceamento `docs/balanceamento.md`, animações `docs/animacoes.md`, tutorial `docs/tutorial.md`, online `docs/online-setup.md`, áudio `docs/audio.md`.

## Depois de mexer
- Atualize o documento do assunto no mesmo commit (regra, carta ou decisão nova) e, se mudou a estrutura do código, rode `npm run map` (regera `docs/mapa-do-codigo.md`). Se mudou o estado do jogo ou as pendências, atualize `docs/visao-geral.md`.
- Nunca ponha identificador de modelo em arquivos do repositório.

## Comandos (dentro de `Price of War/`)
- `npm test` (regras, simulação IA × IA, tutorial, servidor online) · `npx tsc --noEmit` (ignore TS2307/TS2339 preexistentes) · `VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY= npm run build`.
- `npm run map` regera o mapa do código.
- Balanceamento: `N=100 OUT=balance-out/x PATCH=balance-out/patch.json npx tsx tests/balance-lab.ts`, depois `tests/balance-report.ts` e `tests/balance-comeback.ts` (ver `docs/balanceamento.md`). Nunca dê ao `OUT` o mesmo nome do patch.
- Teste visual: servidor estático do `dist` e scripts Playwright (Chromium já instalado; não rode `playwright install`).

## Regras de ouro do projeto
- **Godot x web isolados:** trabalho do Godot só em `Price of War Godot/` (commits `Godot: ...`); nunca altere `Price of War/`, `supabase/` ou `.github/` por causa dele, nem importe uma pasta da outra (artes e dados são copiados/gerados). Exceções listadas em `docs/godot.md` seção 7.
- **Contêiner/destaque de carta sempre no formato exato da carta** (brilho e sombra seguem o recorte real, nunca uma caixa retangular gerada por código; em mockup, recorte as cartas do jogo com transparência real).
- O motor (`src/engine`) é a única fonte das regras; cliente e servidor só o chamam. O que uma carta faz está em dados no catálogo, não em código por nome de carta.
- Hooks do React ficam antes dos `return` antecipados do componente `App`.
- Mudança de regra, carta ou equilíbrio: meça antes no laboratório (IA × IA mostra tendência, não a verdade).
