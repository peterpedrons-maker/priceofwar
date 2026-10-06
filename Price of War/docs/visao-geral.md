# Price of War — visão geral

Uma página para entender o jogo antes de mexer em qualquer parte. Detalhes de cada assunto estão nos outros documentos de `docs/` (índice em `CLAUDE.md`); onde cada coisa fica no código está em `docs/mapa-do-codigo.md`.

## O que é
Jogo de cartas digital (TCG) em português do Brasil, feito para jogar no celular (poucos toques). Você contra a IA ou online contra outra pessoa. React 19 + Vite 6 + TypeScript + Tailwind v4 + motion; o motor de regras é código puro (`src/engine`), roda no navegador e no servidor (Supabase) com as mesmas regras. Publicado em https://peterpedrons-maker.github.io/priceofwar/.

**Os dois pilares do jogo** (decididos pelo dono do jogo):
1. **Tabuleiro vivo:** as peças mudam de lugar (mover, trocar, deslocar o inimigo); a posição importa.
2. **Ouro como recurso de tudo:** você gasta ouro para jogar e ativar; não é mana que sobe sozinha nem um jogo sem recurso.

## Regras em uma página
- Cada lado tem 13 casas: **0–4 Vanguarda**, **5–9 Retaguarda**, **10 Relíquia**, **11 Terreno**, **12 General**. Ganha quem derruba o General inimigo (**30 de vida** nos dois).
- Começo: 15 de ouro, 7 cartas na mão. A cada turno compra 1 carta; a partir da rodada 2 ganha +5 de ouro. Limite de mão 10 (o excesso se descarta no fim do turno). Rodada = um turno de cada jogador.
- Fases do turno: Compra → Suprimentos → **Preparação** (convocar, usar táticas, armar emboscadas) → **Combate** → **Movimentação** (mover tropas; só táticas saem da mão). Quem começa não ataca no primeiro turno.
- Tipos de carta: Infantaria, Cavalaria, Arqueiro, Tática (uso único), Emboscada (armada, o defensor decide responder), Relíquia, Terreno, Armamento (equipamento), General. Alcance: corpo a corpo acerta o da frente; à distância olha as três colunas; o General só é atingido por uma coluna livre.
- Efeitos têm gatilho (Convocação, Ofensiva, Queda, Manobra, Comando, Postura, Reforço) e são descritos em dados no catálogo (`docs/efeitos.md`, `docs/vocabulario.md`). Escudo, Bloqueio e redução de dano seguem a ordem de `docs/engine.md`.
- Baralho: 40 a 60 cartas, até 4 cópias de cada. Baralho finito (carta que saiu não volta).

## Os dois decks (60 cartas cada)
- **Cardeal Pedro, Voz da Fé** (Cardeal): fé e ferro; cura, convocações, emboscadas sagradas, cerco (Trabuco, Catapulta). General: paga 2 de ouro para curar 1 HP de uma unidade.
- **Capitão** (General Aurelion, Mestre da Formação): infantaria disciplinada, movimento e controle; recebeu poucas táticas do Cardeal (2 Catapultas, 2 Balestras, 1 Trabuco) e vários efeitos alterados. General: unidades que se moveram ganham +2/+1.
- Balanceamento (decidido): ver `docs/balanceamento.md`. Em IA × IA o Capitão vence ~37,5% e as partidas acabam na rodada ~6,9. Só gente jogando dirá a verdade; mudanças de regra são testadas antes no laboratório (`tests/balance-lab.ts`).

## Telas e sistemas (o que existe)
Menu e perfil · login (convidado, Google, Discord, e-mail) · partida contra a IA com animações, mão em leque, alvos, tutorial 1 · tutorial "Seu primeiro duelo" · Sala de Coleção (quarto com livro/fichário, estante de boosters, mesa do deck, porta da loja) · loja de boosters · editor de decks (2 slots) · modo online (fila, partida por passos, recompensas, relógio) · opções (avisos, áudio) · visualizador 3D de carta.

## O que é provisório ou está pendente
- **Coleção e inventário reais:** hoje todo jogador tem as cartas dos dois decks e os boosters nunca acabam (`TEST_FREE_BOOSTERS`). Falta quantidade real de cada booster, bolsos vazios no livro e decidir coleções (por facção, "base", cartas em mais de uma coleção).
- **Booster do Capitão:** arte provisória (letra "C").
- **Balanceamento a revisar:** Mercador da Cruzada e cartas que compram carta; viradas (comeback) com pessoas reais; novos decks só depois de o equilíbrio atual estar bom.
- **Ícone do botão "Coleção" no menu:** provisório.
- Tutoriais 2 e 3: "em breve".

## Decisões fixas de trabalho
- Responder sempre em português do Brasil. Mobile primeiro. Mostrar mockup/opinião antes de mudanças visuais grandes.
- Não criar PR sem pedido. Branch de desenvolvimento: `claude/price-of-war-project-xgzrn3`.
- Mudar regra ou carta: testar no laboratório antes, atualizar `docs/` e rodar `npm test`.

## Onde mexer para...
| Quero mudar... | Onde |
|---|---|
| Atributos, texto ou efeito de uma carta; receita de um deck | `src/engine/catalog.ts` (+ `docs/textos-cartas.md`, `docs/efeitos.md`) |
| Uma regra da partida | `src/engine/game.ts` e `rules.ts` (+ teste em `tests/engine-rules.ts`) |
| Como a IA joga | `src/engine/ai.ts` |
| Equilíbrio entre decks | `tests/balance-lab.ts` + `docs/balanceamento.md` |
| Desenho de uma carta, animação, tela da partida | `src/App.tsx` (use `docs/mapa-do-codigo.md`; animações em `docs/animacoes.md`) |
| Sala de Coleção, livro, estante | `src/CollectionRoom.tsx` |
| Loja e boosters | `src/App.tsx` (`ShopScreen`, `BOOSTERS`, `pullBooster`) |
| Editor de decks e coleção salva | `src/App.tsx` (`DeckEditor`, `loadDeckStore`) |
| Tutorial | `src/tutorial/` (+ `docs/tutorial.md`) |
| Online | `server/`, `src/services/online.ts` (+ `docs/online-setup.md`) |
