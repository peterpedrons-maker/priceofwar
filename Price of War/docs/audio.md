# Áudio do jogo

Sons de efeito tocam por `src/sfx.ts` (WebAudio): cada arquivo é decodificado uma vez (`preloadSfx`, ao começar a partida) e começa no relógio
de áudio, para cair no mesmo quadro da imagem. Um `<audio>` comum atrasaria um pouco, de forma variável. Com `?debug`, `window.__sfxLog` guarda
(nome, ms) de cada som e das imagens que ele acompanha, para conferir a sincronia.

| Momento | Arquivo | Como está sincronizado |
| --- | --- | --- |
| Música da partida | `music-duelo.mp3` ("The Tournament", 116,5 s, em laço) | Sem silêncio no começo (0,75 s cortados) e sem cauda morta no fim (corte em 117,3 s, com 0,1 s de fade para não estalar no laço). Ganho 0,19, o mesmo nível percebido da música antiga. |
| Carta ataca outra (combate) | `sfx-combate-explosao.wav` (volume 0,48) | O golpe forte do som fica a 42 ms do começo (16 ms de silêncio cortados). `playAttackSfx()` toca **antes** do hit-stop de 40 ms (`HIT_STOP_MS`), então o golpe cai no quadro do impacto. Medido no jogo: som e impacto com 1,6 ms de diferença. |
| Carta destruída | `sfx-destruicao-fogo.wav` (ganho 1,1) | Clipe "fire burst" sem os 0,24 s iniciais (silêncio). O crepitar sobe a partir de 0,2 s e a explosão cai em **0,44 s**, o quadro 7 a 16 fps, o mais forte da animação de queima (`BURN_FPS`). Toca no quadro em que a carta começa a queimar (`isDestroyed`). O som termina com o último fogo (~1,1 s), junto com o fim da queima. Medido: som e início da queima com 0,1 ms de diferença. |
| Efeito de carta dispara | `sfx-efeito-magico.mp3` (volume 0,7) | Ver `docs/vocabulario.md`, seção 10: o brilho (`tb-*` em `src/index.css`) tem o pico no golpe principal do som (~0,73 s). |

| Começa uma fase de Combate (de qualquer lado) | `sfx-corneta-guerra.mp3` (volume 0,8, `playWarHornSfx`, tocado junto com o banner "Fase de Combate" em `showBanner`) | "Tum tuuum" de ~1,9 s feito de **gravações reais de trompa** (notas C2 e G2 do pacote npm `tonejs-instrument-french-horn-mp3`, amostras da Universidade de Iowa, livres para uso), mais uma batida e eco curto. Não é uma corneta de guerra gravada: sites de som (freesound, opengameart etc.) estão bloqueados neste ambiente. Pode ser trocada por um arquivo melhor com o mesmo nome. |

Outros sons (jogar carta, comprar, selecionar, tática, banner etc.) continuam como estavam, tocando por `<audio>`.

Para trocar um som mantendo a sincronia: encontre o instante do golpe forte no arquivo, corte o silêncio inicial para que ele caia no instante da imagem
(ataque: 40 ms; queima: 0,44 s) e ajuste o volume pelo nível médio dos outros sons.

## Ajustes de som do jogador (botão Opções, no menu e durante a partida)

`src/audioSettings.ts`: volume **Geral**, **Música** e **Efeitos** (uma barra cada, de 0 a 100%) e um botão **Mudo**, salvos neste aparelho
(`localStorage`, chave `pow.audio`) e aplicados na hora, inclusive na música que já está tocando. A posição da barra vira volume numa curva
(posição ao quadrado): no meio da barra o som parece metade, e não três quartos. Todos os sons passam por `sfxLevel()` / `musicLevel()`:
os de `<audio>` (`sfxVol`), os de `src/sfx.ts` e os sintetizados (banner de fase, moeda). A música do duelo, com a barra em 100%, fica a 60% do nível
em que foi entregue (`MUSIC_BASE_GAIN` = 0,114).
