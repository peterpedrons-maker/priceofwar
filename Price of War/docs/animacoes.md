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
investida 300 ms → **hit stop** `HIT_STOP_MS` (70 ms parado) → impacto `IMPACT_MS` (230 ms: som, clarão, anel,
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
