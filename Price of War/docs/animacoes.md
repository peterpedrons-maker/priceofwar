# Animações do jogo: técnicas e tempos

Notas do que funciona (pesquisa + o que já está no jogo). Leia antes de mexer em animação.

## Regras gerais
- Resposta de toque 100–200 ms; transições maiores 200–400 ms. O que acontece todo turno precisa ser curto.
- Antecipação (40–80 ms de recuo) antes do movimento principal; entrada com ease-out, saída com ease-in.
- Efeitos em cascata com 40–120 ms de diferença entre as partes, mesma curva.
- O tabuleiro é desenhado em 1000×1250 e reduzido no celular (~0,4): tamanhos de efeito dentro dele parecem pequenos na
  tela. Teste sempre em 390×844.
- A câmera NÃO se move ao jogar carta (pedido do dono do jogo). O tremor do ataque é de poucos pixels e dura 0,3 s.

## Ataque (feito)
`handleNpcSlotClick` (jogador) e o executor do turno do adversário seguem a mesma sequência:
recuo lento para pegar embalo (ease-out, 46 px, carta inclinada ~8°) e golpe bem mais rápido (ease-in, ~100 ms) com a carta virada ~17° para a quina bater primeiro — `ATTACK_MS` 400 ms no total → **hit stop** `HIT_STOP_MS` (90 ms parado) → impacto `IMPACT_MS` (230 ms: som, clarão, anel,
tremor do tabuleiro) → o motor aplica o dano.
- Atacante: recua, estica (scaleY 1,08) na ida e achata (scaleX 1,08) no contato (`CardSlot`).
- Defensor: é empurrado 12 px para longe do atacante e volta; `ImpactSparks` solta faíscas em risco (mais e mais longe
  se for o General); número de dano maior a partir de 4.
- Tabuleiro: tremor de 3 px (6 px se o alvo é o General) na camada interna `gridZoomDelta`.

## Pancada física (feito, sprite sheet)
`src/assets/fx-punch-sheet.webp` (14 quadros, 5×3, 332×388 cada, ~360 KB) é gerado por `tools/vfx/punch_overlay.py`
(`python3 tools/vfx/punch_overlay.py`; precisa de numpy, scipy e Pillow). Cada quadro é a carta + margem: estrela de
impacto e linhas de velocidade, anel de choque, poeira, lascas, clarão, hematoma vermelho e rachaduras que brilham e
depois escurecem. Os dois primeiros quadros são o pico segurado (hit stop).
- `PunchFx` (App.tsx) toca a 30 fps (≈470 ms) numa camada fixa por cima do tabuleiro, posicionada pelo retângulo da
  carta atingida (`triggerPunch`). Não pode ficar dentro da carta: o atacante, que avança em 3D, a esconderia.
- O empurrão, o achatar, a inclinação e o tremor da carta atingida são feitos ao vivo em `CardSlot`.
- A seta do ataque some quando o golpe acerta. O efeito é desenhado maior que a carta (×1,4; ×1,7 no General).

## Destruição com queima (feito, sprite sheets)
`tools/vfx/burn_sheets.py` gera duas imagens que servem para QUALQUER carta (nada é específico da arte):
- `src/assets/fx-burn-mask.webp` (22 KB): máscara por quadro (opaco = a carta ainda existe), aplicada com CSS `mask-image`
  sobre o rosto da carta de verdade — a carta queima sobre a própria arte.
- `src/assets/fx-burn-fire.webp` (330 KB): borda de fogo brilhando, faixa chamuscada, brasas e fumaça por cima.
O fogo começa embaixo, no meio (onde a pancada pegou) e se espalha. `BurningCard` toca 18 quadros a 16 fps (1,1 s), dentro dos
1,3 s que a carta destruída fica no tabuleiro (`ghostsRef`). Trocar o ponto de origem, a velocidade ou a cor é só mexer no script
e rodar de novo.

## Escolher alvo de um efeito (feito)
Tudo que pede um alvo no tabuleiro (habilidade do General, Cavaleiro Hospitalário, Táticas com alvo) usa o mesmo visual,
`TargetingHud` + a camada de alvos em `App.tsx` (`targetingMode` calcula carta de origem, tipo do efeito, frase e alvos legais):
- a carta de origem fica grande e brilhando no canto inferior esquerdo (aura pulsando na cor do efeito, faíscas subindo);
  no caso do General ela vem do centro (onde pergunta "Pagar 2 ouro / Não ativar") e assenta no canto;
- uma barra ao lado diz o que fazer (rótulo colorido Cura / Dano / Reforço / Deslocar + frase) e tem o botão Cancelar;
- os alvos legais recebem o alvo vermelho do ataque (`halo-valid-target`), recolorido por CSS: verde cura, vermelho dano,
  dourado reforço, azul deslocar; as outras cartas escurecem; tocar numa carta não abre mais o zoom enquanto se escolhe;
- habilidades prontas (`AbilityReadyGlow`): a moldura respira em dourado e solta brasas.
Para um efeito novo com alvo basta adicionar um ramo em `targetingMode`.

## Como conferir uma animação (sem aparelho)
O `page.screenshot` é lento demais para pegar efeitos de 0,3 s. Use o relógio falso do Playwright:
`page.clock.install()` no início, `page.clock.pauseAt(...)` antes do clique e depois `clock.runFor(45)` + captura em
loop. Dá quadros de 45 ms certinhos.

## Próximas (ideias pesquisadas)
- Destruição: dissolver/queimar com `feTurbulence` + `feDisplacementMap` (filtro só na carta que some).
- Brilho holográfico em cartas raras/General: inclinação 3D + camada `conic-gradient` com `color-dodge`; no celular, varredura
  automática lenta.
- Compra de carta em arco (curva), girando de costas para frente durante o voo; mão com leve balanço.
- Tela de vitória/derrota com mais cerimônia.

## Painel do turno (`src/TurnTracker.tsx`)

Arte única (`ui-turn-tracker-art.webp`, 1400×341) + duas máscaras (`-band`, `-neutral`) do mesmo tamanho. Faixa do nome
verde no turno do jogador e vermelha no do adversário; a parte de baixo fica neutra. Cinco medalhões (compra, suprimentos,
preparação, combate, movimentação) com estados `done` (✓), `now` (brilho pulsando), `future` (escurecido) e
`lock` (cadeado, Combate antes de abrir o combate). Animações em CSS (`.trk-*` em `index.css`): brilho que passa
pela faixa a cada mudança de fase ou toque, e varredura diagonal verde↔vermelho quando o turno troca.
Compra e Suprimentos passam sozinhas no painel (`autoPhase` no cliente, ou `npcVisiblePhase` no turno do adversário).

## Reforço (carta que avança quando a da frente cai)

Evento `reinforce` do motor, depois de `destroyed`. No cliente: a carta caída queima na casa (1,3 s), a reforço continua visível atrás
(`holdsRef` faz o quadro mostrar o ghost na frente e a reforço atrás), e aos 1,45 s ela desliza reta para a frente (`repositionFlight` com
`reinforce: true`, 0,34 s, ease de aceleração) e cai com poeira. Só depois o quadro volta a mostrar o estado real do motor.

## Equipar (Armamento) e máscaras de revelação

`equip` (evento do motor, com `atk`/`hp` do bônus) → `EquipFxLayer`, na escala do próprio tabuleiro: a unidade levanta só um pouco (com sombra no chão),
a carta de equipamento entra vinda da mão para a casa, por baixo, e a unidade pousa em cima com clarão, dois anéis dourados e faíscas; o ícone do bônus
(espada +N ou coração +N, `IconPop`) aparece sobre a carta. ~2,2 s; a casa fica escondida (`holdsRef`) e o toque no tabuleiro bloqueado nesse tempo.
Depois disso a carta carrega **marcas permanentes** (`CardSlot`): espada+ sobre o ATK quando está acima do impresso na carta (equipamento, bônus) e coração+ sobre a vida.
`.reveal-in` / `.reveal-out` (index.css, `@property --rv`): qualquer imagem pode surgir de dentro para fora ou de fora para dentro.

## Ícones de efeito (arte pintada + animação por código)

`tools/vfx/effect_icons.py` recorta cada ícone (`art-prompts/reference/ui-effect-*.jpg`), separa o objeto do sinal e gera uma folha de 30 quadros
(`fx-<nome>-sheet.webp`) mais o ícone parado (`ui-effect-<nome>.webp`). Coração: bate duas vezes e o + aparece em fade; escudo: sobe e a luz corre
pelas setas; setas: giram 180° (trocam de lugar). O **−** de ataque e de vida é um + reconstruído por código em barra vermelha (`minus_from_plus`).
No jogo (`EFFECT_ICONS`, `SpriteIcon`, `IconPop`): cura → coração +N sobre a carta curada; bônus de ATK/VIDA → espada/coração; Reforço → escudo "REFORÇO +1"
quando a reserva avança; troca de lugar → "TROCA". A Infantaria na Retaguarda leva o escudinho permanente (`ui-effect-reinforce`).

## Escudo e Bloqueio (aura de vidro)

`tools/vfx/shield_aura.py` → quatro folhas (`fx-shield-{appear,loop,hit,break}-sheet.webp`, quadros de 332×388 = carta + 50 px de cada lado, a mesma geometria do soco).
No cliente: `ShieldAura` (loop contínuo sobre a carta, azul com o valor num selinho cinza-azulado; Bloqueio = a mesma bolha girada para dourado, sem número) e
`ShieldFxOnce` (surgir, golpe que não quebra = ondula, quebrar = cacos). Um golpe que o escudo engole inteiro não faz a carta tremer nem leva o soco (`soakedBlow`);
o número azul que sobe é o quanto o escudo absorveu. Depois de um Reforço o escudo só surge quando a carta termina de deslizar.

## Mão bloqueada durante animações (e o que não bloqueia)

Arrastar uma carta da mão só começa quando nenhuma animação que mexe no campo está rodando (carta em voo, câmera assentando, deslize de movimento, banner de fase). Se você tenta arrastar nesse momento, aparece o aviso "Só um instante: a animação ainda está rodando." (antes a mão ignorava em silêncio). O efeito de equipar libera a mão assim que a carta pousa (fase `land`), sem esperar o brilho final.

Enquanto o efeito de uma carta flutua (Manobra, Comando, Convocação) ou ela está sendo equipada, o espaço dela fica vazio na tela, mas para as regras a carta continua ali: `specSlots` (App.tsx) enxerga essas cartas, então uma Tática solta nessa unidade vale. Antes, logo depois de um movimento do Capitão de Formação, o Avanço Coordenado era ignorado por ~2,7 s.

## Faixa do meio do campo: moedas nas bordas e "Encerrar turno"

A faixa entre as duas Vanguardas ocupa a largura do campo: a moeda do adversário e a do jogador ficam nas bordas e o rastreador de fases fica no meio. O rastreador ganhou um **segmento "Encerrar turno"** à direita, na mesma altura da placa: a moldura da própria placa continua, com a divisória formada pelas duas pontas de moldura costas com costas. Ele é parte do `TurnTracker` (`onEnd`, `endReady`); a arte vem de `tools/vfx/turn_tracker_end.py` (`ui-turn-tracker-end-art`, `ui-turn-tracker-end-mask`).

A placa continua passando fase por fase. O segmento passa todas as fases que faltam de uma vez (Combate e Movimentação inclusive), sem confirmação e sem os banners de cada fase; o motor cuida do resto (bônus do Aurelion, trocas do Soldado Tático, descarte se a mão passar do limite, turno do adversário). Ele fica escuro quando não dá para usar (turno do adversário, fases automáticas, tutorial) e dourado aceso no seu turno.

## Números das cartas no tabuleiro: o valor real, em verde ou vermelho

O ATK e o HP desenhados numa carta do tabuleiro são os valores de verdade naquele momento (`CardData.shown`, calculado em `shownStats` no App.tsx): o ATK passa por `getEffectiveAtk` (a mesma função do combate: auras, bônus do Aurelion, Capitão de Formação, armas, bônus permanentes) e o HP soma o que vale em combate (bônus do Aurelion, auras como a do Comandante da Ordem).

Cor: **verde** quando o número está acima do impresso na carta, **vermelho** quando está abaixo. Para o HP, "abaixo" significa ferida (HP atual menor que o impresso mais o que as armas dão); ferida tem prioridade sobre bônus. Cartas na mão, no cemitério e no catálogo continuam com os números impressos. O ícone de espada/coração pequeno nos cantos continua indicando bônus permanentes.

## Brilho de Postura e Reforço

Todo efeito que dispara faz o mesmo brilho dourado (`burstAt`, cor única `TRIGGER_GLOW`). **Postura** brilha quando a carta passa a estar na Vanguarda: ao ser jogada nela (depois de pousar) ou ao se mover da Retaguarda para a Vanguarda (inclusive a que troca de lugar e vai para a frente). **Reforço** brilha quando a carta termina de subir para o lugar da que caiu. Nenhum dos dois brilha no tabuleiro restaurado (`quietTurn`).

## A carta que cai no tabuleiro (peso) e a poeira do impacto

A carta jogada da mão (`flyingCard`, App.tsx) agora tem peso. Dura `FLIGHT_MS` = 1,2 s:

1. **Antecipação:** um pequeno mergulho antes de subir;
2. **Subida** até o ponto de exibição, passando um pouco do ponto (mola), com inclinação de ~-5°;
3. **Mira:** flutua um instante, inclinada para o slot;
4. **Queda:** acelerada (curva `[0.6, 0, 0.95, 0.35]`), a inclinação se endireita;
5. **Impacto** em `FLIGHT_HIT_MS` = 0,8 s: a carta fica parada uns 50 ms (hit-stop), se achata (`scaleY` 0,86 / `scaleX` 1,07, com a posição compensada para ela "sentar" no chão) e volta com uma mola.

O impacto em si (som e poeira) dispara em `FLIGHT_HIT_MS`, e não no fim da animação. Só se animam `x`, `y`, `scaleX`, `scaleY` e `rotate`, nunca `left/top/width/height`.

A poeira é o `ImpactFx` (canvas): nuvens de poeira que sobem e somem, faíscas douradas que caem, um anel de choque achatado e um clarão curto. Tudo escala com a largura da carta, e uma carta **full art** levanta bem mais: ~58 nuvens (contra 34), nuvens maiores e mais espalhadas, 34 faíscas (contra 18), dois anéis e um clarão maior. A carta do adversário e o Reforço usam o mesmo impacto.

## Coleção em 3D

Na tela de coleção/deck, a carta ampliada tem um botão **3D** que abre o visualizador (`CardViewer3D.tsx`, three.js): arrastar gira a carta com inércia, toque duplo vira, as setas passam para a carta anterior/seguinte da lista (como filtrada). O three.js é carregado só na primeira vez (`React.lazy`), então não pesa no jogo.

As faces são a carta como o jogo a desenha, **pré-renderizada** em `src/assets/card3d/<slug>.webp` (uma textura por carta, com a moldura inteira e fundo transparente). Quando o texto, os números ou a moldura de uma carta mudarem, é preciso gerar de novo, com o jogo rodando:

```
npx tsx tools/card3d/list-cards.ts > tools/card3d/cards.json
node tools/card3d/render-faces.cjs            # [pasta] [url] [slug,slug…]  (para refazer só algumas)
python3 tools/card3d/to-webp.py
```

O verso é o `card-backplate` do jogo **cortado na própria arte** (a imagem original tem margens transparentes; sem cortar, o verso ficava menor que a frente, com o corpo dourado aparecendo em volta). Brilho de folha holográfica: forte no General e nas full art, sutil nas outras.

## Mockup da sala de coleção (coleção em fichário)

`public/mockups/quarto/` é um protótipo navegável (HTML solto, sem build): a sala em camadas com parallax, o livro da coleção
abrindo, páginas de fichário com 9 bolsos que viram com o dedo, e o visualizador 3D real (`?3d&embed`) dentro de um frame.
As miniaturas em `cards/` saem das texturas de `src/assets/card3d` (recortadas e reduzidas a 300 px). A arte da sala é só
formas simples (SVG), para validar a navegação antes da arte final. Link: `/priceofwar/mockups/quarto/`.

## A carta na mão do jogador (física do arrasto)

A carta segurada com o dedo é um pequeno corpo físico simulado a cada quadro (`heldPhys` e o efeito logo antes de `if (!assetsReady)`
em `src/App.tsx`), escrito direto nos elementos (sem render do React por movimento):

- **Segue o dedo numa mola** (rígida, quase crítica): tem um atraso mínimo e uma folga de ultrapassagem, em vez de colada.
- **Balança como pêndulo**: pendurada na ponta do dedo (o pivô fica no dedo), gira no eixo Z conforme a velocidade horizontal;
  inclina em 3D (rotateX/rotateY) para o lado em que está sendo movida. Molas subamortecidas, então ela oscila ao parar.
- **Flutua parada**: um balanço leve de altura e inclinação que só aparece enquanto o dedo está quase parado.
- **Pop ao pegar**: sobe de 0,86 para 1 com mola. Sobre uma casa válida ela se acalma (a inclinação cai a 30%), cresce um pouco e é
  puxada 35% na direção da casa.
- **Solta num lugar inválido**: voa de volta, com mola, para o lugar dela na mão (`returnHeld`), em vez de sumir.
- **Solta numa casa válida**: o voo de convocação começa exatamente da pose que a carta tinha no dedo (posição, tamanho, balanço e
  inclinação) e ela se endireita durante a subida; depois paira, cai reta e para firme no encaixe.

Ajustes finos: as constantes das molas estão no efeito (rigidez/amortecimento de posição, balanço, inclinação e pop).

## Sala de Coleção (no jogo)

`src/CollectionRoom.tsx`, aberta pelo botão **Coleção** do menu principal (`roomOpen` em `MainMenu`). A sala é uma imagem só
(`src/assets/room-collection.webp`, palco de 768 x 1376) ajustada à altura da tela; arrastar (ou inclinar o celular) mostra os lados.
Cada objeto é uma área de toque sobre a imagem: a câmera dá zoom nele e abre o que ele representa.

- **Livro** (estante): zoom, a capa abre e vira o álbum. Cada página tem 9 cartas sob **uma única folha de plástico** (`.bk-sheet`):
  as divisões são linhas dentro da folha, com brilho que se move. Deslizar vira a página; tocar numa carta a tira do bolso, ela vem
  para a frente sobre o fundo escurecido e vira o visualizador 3D (`CardViewer3D`, props `onReady` e `hideArrows`).
  A folha de plástico acompanha a moldura dourada da própria página. A página que vira é cortada em 9 fatias, cada uma articulada na
  anterior (`NS`, `BEND` em `CollectionRoom.tsx`): a fatia da lombada gira menos e cada seguinte um pouco mais, então o papel curva
  de verdade e as cartas se deformam junto; o verso do papel aparece depois dos 90°. Só as páginas ao lado da atual têm a versão em
  fatias (o resto é plano), para não pesar. A carta sai do bolso por completo: sobe por baixo do plástico até ficar toda acima do
  slot (~0,8 s) e só então vem para a frente (~1 s) enquanto o fundo escurece; ao fechar o 3D ela volta acima do slot e desce para
  dentro do plástico. A carta que vem para a frente chega no tamanho exato em que o 3D a mostra (a câmera do visualizador vê
  `2 * 9,4 * tan(fov/2)` unidades na altura da tela, e a arte da carta tem 3,77 unidades), e o 3D abre sem a rotação de entrada
  (`noIntro`), então a troca entre as duas é invisível. As páginas já viradas ficam deitadas à esquerda da lombada (as 4 últimas),
  como marca de que há páginas atrás.
- **Porta / placa**: zoom e abre a loja (`ShopScreen`). Ao fechar a loja, a câmera recua e o jogador continua na sala.
- **Mesa com o tabuleiro**: zoom (a câmera nunca passa da borda da imagem) e a sala escurece por baixo; o editor de deck (`DeckEditor`,
  prop `overRoom`, translúcido) abre por cima, com o mesmo caminho de volta.
- **Mesa redonda (Boosters)**: zoom, a sala escurece por baixo (é a própria sala, com o chão) e os boosters do jogador aparecem em **leque**, como uma
  mão de cartas (`PackFan`): o da frente grande, os outros abertos atrás dele, um pouco visíveis. Deslizar traz outro para a frente, tocar no da
  frente abre (`PackOpening`, o mesmo da loja). Só os 4 ou 5 em volta do da frente são desenhados, então funciona para qualquer quantidade.
  **Base de teste:** sempre dois boosters (`BOOSTERS`), que não acabam; `?boosters=14` coloca essa quantidade. A imagem do pano vermelho
  (`src/assets/room-table-cloth.webp`) ficou guardada para uso futuro.
- A coleção, por enquanto, é o catálogo inteiro (os dois decks, sem restrição). O botão "Simular faltantes" mostra como ficam os
  bolsos vazios. Falta o inventário real do jogador e os boosters sobre a mesa redonda.

Arte: `room-collection`, `room-book-cover` (recortada do fundo cinza), `room-book-page`, `room-book-inside` em `src/assets`;
miniaturas das cartas em `src/assets/card-thumb` (300 px). Os prompts estão em `art-prompts/README.md`, seção 4aa.
