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

## Os três decks (60 cartas cada)
- **Cardeal Pedro, Voz da Fé** (Cardeal): fé e ferro; cura, convocações, emboscadas sagradas, cerco (Trabuco, Catapulta). General: paga 2 de ouro para curar 1 HP de uma unidade. Custos (rodada 6): cavalaria de 4 de ouro e unidades médias de 3; só as cartas de 1 de ouro continuam baratas.
- **Capitão** (General Aurelion, Mestre da Formação): infantaria disciplinada, movimento e controle; recebeu poucas táticas do Cardeal (2 Catapultas, 2 Balestras, 1 Trabuco) e vários efeitos alterados. General: unidades que se moveram ganham +2/+1.
- **Mercenários** (Brann Meia-Coroa, Comprador de Guerras; 22 cartas diferentes, todas novas): ouro como base. Cartas com **Manutenção** (paga na fase de Suprimentos: o jogador escolhe quem paga; quem não é pago sai do campo, e algumas voltam à mão ou têm Rescisão) e a **Relíquia Códice das Mil Dívidas** com modos (Soldo em Dobro: +1 ATK nas cartas com manutenção; Saque: compra 1 carta ao destruir unidade inimiga, máx. 1 por ciclo), escolhido no fim do turno. General: paga 3 de ouro, compra 1 carta. Detalhes em `docs/deck-mercenarios.md`; arte ainda provisória.
- Balanceamento (decidido): ver `docs/balanceamento.md`. Em IA × IA o Capitão vence ~37,5% e as partidas acabam na rodada ~6,9. Só gente jogando dirá a verdade; mudanças de regra são testadas antes no laboratório (`tests/balance-lab.ts`).

## Telas e sistemas (o que existe)
Menu principal (fundo "A guerra dos dois Generais", logo no céu e cinco placas de ouro em cascata saindo da parede esquerda; `MenuCard`/`MainMenu` em App.tsx, assets `menu-bg.webp` e `menu-plaque-*`) · perfil · login (convidado, Google, Discord, e-mail) · partida contra a IA com animações, mão em leque, alvos, tutorial 1 · tutorial "Seu primeiro duelo" · Sala de Coleção (quarto com livro/fichário, estante de boosters, mesa do deck, porta da loja) · loja de boosters · editor de decks (3 slots no aparelho; só 2 sincronizam na nuvem) · modo online (fila, partida por passos, recompensas, relógio) · opções (avisos, áudio) · visualizador 3D de carta. **Efeitos de combate** (`src/combatFx.ts`): táticas de dano descem no tabuleiro e soltam o projétil, Generais erguem a arma ao ativar, Jorge e Arqueiros lançam lança/flecha (ver `docs/animacoes.md`).

## O que é provisório ou está pendente
- **Coleção e inventário reais:** hoje todo jogador tem as cartas dos três decks e os boosters nunca acabam (`TEST_FREE_BOOSTERS`). Falta quantidade real de cada booster, bolsos vazios no livro e decidir coleções (por facção, "base", cartas em mais de uma coleção).
- **Booster do Capitão:** arte provisória (letra "C").
- **Balanceamento a revisar:** Mercador da Cruzada (agora com custo de 1 de ouro e resto ao cemitério) e as outras cartas que compram carta (Intendente, Recrutar Veteranos); viradas (comeback) com pessoas reais; novos decks só depois de o equilíbrio atual estar bom.
- **Efeitos das cartas únicas:** mockup com 14 cenas (Capitão e Mercenários) em `public/mockups/efeitos-decks/`, folhas em Python (`tools/vfx/efeitos_decks.py`); **falta o dono aprovar** para ligar ao jogo (ver `docs/animacoes.md`).
- **Menu:** a arte de fundo foi ampliada de 704×1520 (convém uma versão ≥ 1170×2532); Coleção e Meu Deck dividem a mesma imagem na placa; o logo ainda tem a tagline em inglês.
- **Mercenários (no jogo desde a rodada 17):** 21 de 22 artes reais entregues; só o **Códice das Mil Dívidas** ainda usa arte provisória (emblema por tipo, `src/assets/merc/<slug>.webp`; troque pelo arquivo real com o mesmo nome; prompt refeito em `art-prompts/README.md` seção 5 e em `/mockups/prompts-mercenarios/`); balanceamento é só de IA × IA (~55% contra o Cardeal, ~44% contra o Capitão): ajustar conforme gente jogar. **Nuvem:** a tabela de decks só aceita os slots 1 e 2, então o 3º deck fica só no aparelho até rodar `docs/supabase-slot-3.sql` e subir `CLOUD_DECK_SLOTS` para 3. Depois dele, ideia de Artilharia como infantaria.
- **Servidor online desatualizado = regras antigas:** o Desafio e o Online rodam o pacote `supabase/functions/game/index.ts` (gerado). Depois de mudar `src/engine`, rode `npm run build:edge` e faça commit; `tests/edge-bundle.ts` (dentro de `npm test`) falha se o pacote estiver defasado (foi assim que o General do Desafio nasceu com 20 de vida em vez de 30).
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
