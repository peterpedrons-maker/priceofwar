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

`src/CollectionRoom.tsx`, aberta pelo botão **Coleção** do menu principal (`roomOpen` em `MainMenu`). O link `…/priceofwar/?colecao` abre direto nela, sem login: entra como convidado (nome "Visitante1234") sozinho; "‹ MENU" leva ao menu. A sala é uma imagem só
(`src/assets/room-collection.webp`, palco de 768 x 1376) encaixada na tela inteira (contain: a sala toda aparece, com barras escuras em cima/embaixo se a tela for mais larga ou mais alta). **Tela estática:** não há arrastar, inclinar o celular nem parallax (decisão do dono: mostrar tudo, sem "olhar em volta"); o menu principal também é estático (fundo `menu-bg.webp` fixo). Só o zoom ao tocar num objeto move a câmera, e a poeira/chamas continuam como animação ambiente.
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
- **Nomes dentro da cena**: não há mais plaquinhas flutuando. "COLEÇÃO 50/50" está em dourado na capa do livro (a mesma capa, com o mesmo texto, no fichário que abre), "LOJA" na placa pendurada, "BOOSTERS" numa plaquinha de madeira com moldura de metal pregada na tábua de cima da estante e "MEU DECK" numa plaquinha igual, em frente ao pergaminho, na beira da mesa (componente `Plaque`). Os objetos continuam tocáveis (botão invisível + brilho que pulsa).
- **Estante de boosters**: a imagem da sala (`room-collection.webp`) foi montada por cima da original: o livro com a vela e a prateleira de parede
  foram recortados e subiram, e a estante da loja (`shop-shelf.webp`, só 3 prateleiras) ficou **encostada na parede**, de pé no chão, com sombra
  de contato. O barril foi apagado (o piso foi refeito seguindo a direção das tábuas). Cada tipo de booster forma uma pilha numa prateleira
  (`shelfSlot` em `CollectionRoom.tsx`), um atrás do outro com perspectiva (cada um menor, mais escuro e mais alto que o da frente). Tocar na
  estante dá zoom; tocar numa pilha abre o pacote da frente (`PackOpening`, o mesmo da loja) e, ao terminar, o próximo desliza para a frente.
  **Base de teste:** o estoque nunca acaba (`BOOSTERS`). A mesa redonda ficou só como decoração.
  A imagem do pano vermelho (`src/assets/room-table-cloth.webp`) ficou guardada para uso futuro.
- A coleção, por enquanto, é o catálogo inteiro (os dois decks, sem restrição). O botão "Simular faltantes" mostra como ficam os
  bolsos vazios. Falta o inventário real do jogador (quantidade de cada booster).

Arte: `room-collection`, `room-book-cover` (recortada do fundo cinza), `room-book-page`, `room-book-inside` em `src/assets`;
miniaturas das cartas em `src/assets/card-thumb` (300 px). Os prompts estão em `art-prompts/README.md`, seção 4aa.

## Golpe final e números de dano (feito)
- **Números de dano por tamanho** (`NUMBER_TIERS`, `damageTier`, `FloatNumber` em `App.tsx`): 1–2 pequeno; 3–4 médio; 5–7 grande; 8 ou mais enorme (treme, dura ~2 s). Sem estrela/anéis de explosão atrás do dano de combate (a pedido do dono); cura, ouro e escudo mantêm a estrela e usam sempre o tamanho pequeno. `floatLife` diz quanto tempo o número fica na tela.
- **Golpe final (câmera lenta)**: quando o ataque vai matar um General (o ensaio `applyAction` já traz o evento `winner`), `beginFinalBlow` liga `TIME.k = 2`: o avanço da carta, o soco (`PunchFx`) e a queima (`BurningCard`) rodam na metade da velocidade; o avanço termina num congelamento de 380 ms (`FINAL_FREEZE_MS`) com clarão branco; uma vinheta escura fica por cima. A tela de Vitória/Derrota só aparece `FINAL_AFTER_MS` (2,3 s) depois do golpe (o evento `winner` espera esse tempo enquanto `TIME.k > 1`). Vale para o seu ataque (local e online) e para o ataque da IA. Se uma Emboscada salvar o General, a câmera lenta só termina. Não vale para o ataque do adversário humano no online (esse passa pelo apresentador de passos).
- **Não fazer (decisão do dono):** tremor de tela proporcional ao dano e vibração do celular.

## Combate AAA: decisões do dono (lista de trabalho)
- Feito: números de dano por tamanho; câmera lenta no golpe final.
- Querem ver **mockup antes**: projéteis por carta (Catapulta/Trabuco lançando e explodindo em área; lança do Jorge voando até o alvo).
- Música: não dá para mudar a faixa; a ideia é **batidas/tensão sintetizadas por cima** (WebAudio) em momentos de perigo.
- Abertura do duelo (Generais se encarando) e vitória/derrota com cerimônia: aprovadas.
- Habilidade do General como golpe especial: **só a parte visual** (o dono coloca o som/frase depois).
- Histórico das últimas jogadas: aprovado. Turno da IA: **diminuir a velocidade** (ela joga carta atrás de carta e não dá tempo de ver).
- Prévia do resultado do ataque: boa, mas **opcional** (ligar/desligar nas opções, junto do tutorial).
- Partículas no cenário: só as que fazem sentido com a imagem de fundo. Quebra da armadura do General: **não**.

## Mockup dos projéteis (`public/mockups/projeteis/`)
Página para ver no celular (`/priceofwar/mockups/projeteis/`) com um tabuleiro de cartas de verdade e seis ataques: **Catapulta** (pedra em arco com rastro de fumaça e sombra no chão; explode na fileira inteira), **Trabuco** (pedra em brasa, arco mais alto; explosão grande, onda de choque e explosões menores em cada carta e no General), **Balestra** (virote em linha reta, risco de velocidade, crava na carta), **Lança do Jorge** (lança dourada com rastro de luz; atravessa o alvo e acerta a carta de trás, com explosão sagrada), **Arqueiro** (três flechas em arco curto) e **Hoje (seta)**, a seta vermelha atual, só para comparar. Tem câmera lenta (¼) e som de teste (os sons do jogo mais um "vush" sintetizado).
- Arte feita por código em `tools/vfx/projectiles.py` (numpy/PIL, ~40 s): bola de fogo e fumaça (30 quadros cada), explosão sagrada (24), nuvens de fumaça, pedaços de pedra, pedra, virote, flecha e lança. A bola de fogo usa mistura aditiva (`lighter`/`screen`) e a fumaça mistura normal por baixo.
- A lógica (`index.html`): linha do tempo própria, projétil (`fly`: arco, escala com a altura, sombra, rastro), partículas (fumaça, poeira, detritos, faíscas), clarão, onda de choque e marca de queimado; as cartas reagem (`hit`) e o dano sobe em números. `?manual&run=catapulta` + `window.__step(s)` avançam o tempo na mão (usado para tirar quadros de teste).
- **Ainda não está no jogo.** Se aprovado, o próximo passo é ligar estas animações ao evento de ataque à distância/tática (no lugar da seta de hoje) e tirar os assets de `public/` para `src/assets/`.

### Mockup v2: a tática desce no tabuleiro (ideia do dono)
As Táticas (Catapulta, Trabuco, Balestra) **descem no tabuleiro** com peso (queda, poeira, sombra), **brilham** com luz dourada sendo puxada para a carta e só então o efeito **sai da carta**: a Catapulta lança a pedra em arco, o Trabuco solta uma bola de fogo que sobe e **se divide em bolas menores**, uma por carta inimiga (e o General), e a Balestra solta o virote. Depois a carta queima e some (vai ao cemitério). O fogo foi reduzido (blasts ~40% menores, uma explosão pequena por carta, em vez de uma parede de fogo). Regra do motor inalterada: Tática não ocupa slot; o "lugar" da carta é só visual (faixa do meio, perto do jogador). A IA usaria o mesmo espaço, espelhado para o lado dela.

### Mockup v3 (ajustes do dono)
- **Balestra:** virote de balestra redesenhado (haste curta e grossa, ponta de aço larga com colar, duas aletas de couro) e impacto **seco, sem fogo**: clarão curto, anel fino, faíscas de metal jogadas para trás, lascas de madeira e uma baforada de poeira; o virote fica cravado tremendo (`thunk`, `stick`).
- **Arqueiro:** a flecha segue a **tangente do arco** (sobe, vira acompanhando a curva e desce cravando) e a flecha cravada guarda o ângulo com que chegou (antes ela era desenhada com um ângulo fixo e "virava" ao chegar). Flecha nova (haste clara, ponta em folha, 3 penas).
- **Lança do Jorge:** **pega impulso** (a lança é puxada para trás, treme e carrega luz enquanto a carta agacha) e é arremessada **acelerando** (`ease`); menor (metade do tamanho), com colar, lâmina com nervura e bandeirola; impacto limpo: clarão curto, cruz de luz (`glint`), raios finos, anel e faíscas para a frente, sem o disco amarelo.

### Mockup v4 e regra de produção (conversa com o dono)
- **Flechas de longo alcance:** arco bem mais alto e voo mais longo (~1,1 s), flecha menor que encolhe com a distância (`scale [.52 → .34]`, `lift` pequeno) e sombra no chão separada da flecha, para parecer que vem de longe e não que encosta no inimigo.
- **Regra de produção:** não dá para animar todas as cartas. Fazer só as **cartas marcantes de cada deck** (as que definem a identidade ou que o jogador mais vê), e as demais usam os efeitos genéricos por tipo (golpe, brilho, número). As artes que o dono enviar entram **só no mockup** até ele aprovar; nada vai ao jogo antes.

### Mockup v5: arte pintada do dono (só no mockup)
- Chegaram 8 imagens (lança, virote, flecha, flecha envenenada, pedra, pedra em brasa, espada do Aurelion, martelo do Cardeal). Originais em `art-prompts/reference/projeteis/`; `tools/vfx/key_art.py` tira o fundo magenta (chave de cor com desmistura da borda, correção do rosa e corte justo) e grava WebP com alpha em `public/mockups/projeteis/art/`. As duas pedras vieram esticadas (4:1) e foram comprimidas na horizontal para ficarem arredondadas.
- Caixa **"arte pintada"** no mockup liga/desliga a arte nova contra os sprites feitos por código. `pick()` escolhe o sprite; `fly()` ganhou `len` (comprimento em px) no lugar de escala, para que qualquer imagem tenha o tamanho certo.
- Cenas novas: **Flecha Venenosa** (nuvem verde e gotas), **Martelo do Cardeal** (arremessado girando, martelada sagrada com cruz de luz) e **Espada do Aurelion** (varre a fileira com arco de luz). Nada disso está no jogo.

### Mockup v6 (ajustes do dono)
- **Generais não atacam:** a arma (martelo do Cardeal, espada do Aurelion) **aparece sobre a carta quando a habilidade ativa**, em vez de ser arremessada: surge com brilho, flutua, um reflexo de luz percorre a arma, partículas sobem e a carta do General também brilha (`weaponReveal`). Depois sai o efeito de verdade: o Cardeal **cura** uma unidade (luz dourada desce até ela, "+1" verde); o Aurelion dá **+2/+1** (onda vermelha e dourada passa pelas unidades aliadas).
- **Flecha de arco longo:** o ângulo agora é uma virada **suave** de "subindo" para "descendo", centrada no topo do arco (`softAngle`, curva de 5º grau), em vez da tangente crua, que num tabuleiro visto de cima girava a flecha meia volta em um instante no topo (da tangente: -42° para +56° em 10% do voo; agora vai de -16° a +7° e a +29° sem salto). A flecha cravada guarda o ângulo de chegada.

### Mockup v7 (ajustes do dono)
- **Generais:** a arma agora é **erguida na vertical** (sobe com leve sobrecarga, fica reta), brilha com um reflexo que sobe pela arma e **toca som** (`sfx-efeito-magico`), e a tática é liberada da ponta. **Cores:** cura = verde (martelo do Cardeal; luz verde desce até a unidade, "+1" verde); bônus de ataque = vermelho (espada do Aurelion; onda vermelha, "+2" vermelho e "+1" verde de vida).
- **Números do mockup** usam as imagens de dígito do jogo (`src/assets/num`) **com a estrela atrás** (estrela vermelha = dano, verde = cura/vida). No jogo de verdade o dano de combate está sem a estrela (tirada a pedido); decidir se volta uma estrela simples.
- **Trabuco:** a primeira bola agora **estoura no ar** (tem sombra no chão embaixo; clarão, anel fino, raios e brasas, sem explosão no chão) e as bolas menores saem para fora e para cima e **caem em arco** em cada carta inimiga. O rastro de fogo ficou contínuo (pontos a cada 3 px, em vez de contas separadas).
- **Catapulta:** a pedra não some ao cair: achata no chão e **quebra em pedaços** recortados da própria textura (`rockBreak`).
- **Flecha:** o ângulo segue a direção real nas pontas do voo e usa a virada suave só perto do topo (`softAngle` com mistura).

## Efeitos de combate no jogo (`src/combatFx.ts`) — aprovados no mockup e ligados ao jogo
Tudo o que o mockup `public/mockups/projeteis/` mostrava está no jogo, com o mesmo visual e os mesmos sons. A engine é a do mockup (linha do tempo própria, partículas, explosões, projéteis) num canvas por cima do tabuleiro (`z-index` 285; acima dele só os números flutuantes e as janelas). Escrita em coordenadas lógicas em que a casa tem 64 de largura (`U` = largura real da casa / 64), então fica igual em qualquer tela. O arquivo usa `// @ts-nocheck` (é a engine do mockup portada; a API exportada é pequena e comentada).
- **Quando acontece:**
  - **Catapulta, Trabuco e Balestra** (`fxTactic`): ao jogar a carta ela **desce no tabuleiro** (faixa do meio; `tacticSpot`), brilha e o efeito sai dela. Os alvos e os números vêm dos eventos `damage` do motor (nada é decidido na animação). Vale para você, para a IA e para o adversário online (tudo passa por `commitState`).
  - **Cardeal Pedro (cura)** (`fxHero('cura')`): o General ergue o martelo na vertical, brilha em verde com som, a luz verde desce até a unidade curada.
  - **Aurelion (+2/+1)** (`fxHero('bonus')`): ergue a espada, brilho vermelho; a onda passa pelas unidades que ganharam o bônus. Roda junto com o fim do turno (não segura nada).
  - **Jorge e Arqueiros** (`fxRanged`): no ataque, em vez do avanço da carta, a lança (com impulso, atravessa o alvo e acerta a carta de trás) ou a flecha (arco alto, encolhe com a distância) voa e o golpe só é aplicado quando chega (`await fx.impact`). Ataque que mata o General mantém o avanço em câmera lenta.
- **Fila de apresentação (`commitState`)**: o motor já decidiu tudo; a tela mostra o resultado quando o efeito chega ao alvo. Se um lote tem efeito, ele entra numa fila (`fxQueueRef`) e o que vem depois espera; sem efeito e fila vazia, mostra na hora como antes. Enquanto a fila trabalha (`fxBusy`), uma camada transparente (z 284) segura os toques. A mão e o ouro já atualizam quando a carta pousa. `processEvents` recebe `fxNumbers` (os números de dano/cura saem do efeito, no instante de cada acerto), `fxSkipAbility` e `fxSkipTacticSfx`.
- **Arte e som:** arte pintada em `src/assets/proj-art-*.webp` (feita pelo dono; `tools/vfx/key_art.py` tira o fundo) e fogo/fumaça/explosão sagrada/poeira/pedaços em `proj-boom-*`, `proj-holy`, `proj-puff`, `proj-debris` (`tools/vfx/projectiles.py`). Sons do próprio jogo (`sfx-destruicao-fogo`, `sfx-combate-explosao`, `sfx-dano`, `sfx-efeito-magico`) mais um "vush" sintetizado; tudo respeita o volume de Efeitos (`playSfxAt`, `playWhoosh` em `src/sfx.ts`).
- **Números:** o número de dano/cura voltou a ter a **estrela** atrás (uma só, sem anéis), como no mockup.
- **Fora desta versão:** Flechas Venenosas (equipa, não ataca), o ataque de unidades no online do lado do adversário passa pelo mesmo laço da IA e já usa o efeito; a tutorial não tem tática de dano ainda.
- **Teste:** com `?debug`, `window.__powAct(seat, action)` aplica uma ação do motor e `window.__powSet` monta a situação (ver `docs/animacoes.md`, "Como conferir uma animação").

### Ajustes depois do teste do dono (carta tática no tabuleiro e pouso das cartas)
- **A Tática pousa numa casa vazia de quem a jogou** (`pickTacticSpot` em `App.tsx`): fundo da fileira de trás do meio para fora (7, 6, 8, 5, 9), depois a de frente (2, 1, 3, 0, 4). Mostra que a jogada usou um espaço do tabuleiro, e o ataque sai dali. Sem casa vazia, usa a faixa do meio mais perto de quem jogou. A carta tem o **tamanho exato da casa** (mesma arte mini das cartas do tabuleiro) e cai de cima, brilha e solta o efeito.
- **Impacto do pouso** (`landingImpact`/`fxLanding` em `combatFx.ts`, vale para toda carta que pousa: unidade, convocação, Tática): clarão curto, **ondas que correm para fora seguindo o contorno da carta** (retângulo de cantos arredondados) e poeira que nasce ao longo de todo o contorno (não só nos lados) e se afasta, mais faíscas douradas. Substituiu o `ImpactFx` antigo (poeira em duas linhas horizontais).
- **Tamanho no voo da carta da mão** (`flyingCard`): o tamanho agora muda **durante a queda e termina antes do impacto** (curva própria, separada da aceleração da queda), em vez de só no fim.
- **Sem achatar ao pousar:** removido o `justLanded` (a carta nova encolhia/esticava `scaleY 0,55 → 1,18` por 380 ms logo depois de pousar, e era isso que dava a impressão de mudar de tamanho). O peso agora vem do impacto pelo contorno.

## Casas do tabuleiro (estilo B, "entalhe no chão") — no jogo
- As casas de unidade (0 a 9) dos dois lados vazias deixaram de ser retângulo de linha com losango: agora são um **encaixe escuro afundado** (fundo translúcido, sombra por dentro, brilho quente quase invisível na borda de baixo e um fio da cor do lado: azul-aço no jogador, carmesim no adversário). Relíquia, Terreno e General mantêm o visual antigo. Código: `CardSlot` (`carvedStyle`, `unitSlot`) em `App.tsx`.
- **Emblema da fileira** (`SlotEmblem`, SVG por enquanto): Vanguarda = espada e escudo, Retaguarda = arco e estandarte, bem apagado. Quando o jogador pega ou seleciona uma carta que cabe na casa, o próprio emblema **acende e pulsa** (âmbar na frente, azul-céu atrás) com um brilho por dentro da casa; as palavras ATACA / RESERVA / PROTEGIDA continuam (opção "Dicas no tabuleiro"). Casa em que a carta não pode ir mantém o X vermelho.
- **Quando a arte pintada do emblema chegar** (bronze, um por fileira): trocar o `<motion.svg>` de `SlotEmblem` por uma imagem no mesmo lugar, com o mesmo brilho e pulso (`filter: drop-shadow`). Prompts das molduras (não usadas, grossas demais): `art-prompts/README.md` 4ad; as três artes recebidas estão em `art-prompts/reference/casas/`.
- **Cemitério vazio:** o texto vertical foi trocado por uma marca apagada (duas espadas quebradas cruzadas sobre um escudo, em SVG) e a palavra pequena na horizontal embaixo (`GraveyardPile` em `App.tsx`). A arte pintada tem prompt em `art-prompts/README.md` (3f-v2); quando chegar, entra no lugar da marca.

### Casas do tabuleiro com a arte do dono (ligado ao jogo)
- **Ícones em bronze** (`src/assets/slot-icone-*.webp`, recortados do magenta por `art-prompts/reference/casas/*.jpg` → ver script no histórico): Vanguarda (escudo e espada), Retaguarda (arco e bandeirola), Relíquia (cálice), Terreno (montanhas e árvore) e Cemitério (armas quebradas). Todos com a caixa quadrada de 200 px. `SlotEmblem` mostra o ícone apagado no centro da casa vazia e, quando a carta selecionada cabe, acende e pulsa (âmbar na frente e nas casas especiais, azul-céu atrás).
- **Só o ícone, sem moldura nova:** as casas mantêm o estilo B (encaixe afundado) em todas (0 a 9, Relíquia, Terreno e o Cemitério vazio); a moldura grossa que veio com a arte do Cemitério não é usada (`art-prompts/reference/casas/casa-cemiterio.jpg` guardada só como referência). Relíquia, Terreno e Cemitério têm o nome pequeno e horizontal embaixo do ícone.
- **Placas laterais** (`RowPlaque`, arte `placa-fileira.webp`): uma ao lado de cada fileira, na margem esquerda, com "VANGUARDA" ou "RETAGUARDA" na vertical (lê-se de baixo para cima) e um verniz leve azul (jogador) ou vermelho (adversário). Ancorada a partir do centro da fileira (`right-[calc(50%+20.55rem)]`), então fica colada na primeira casa em qualquer escala. Os textos minúsculos antigos entre as fileiras foram removidos.
