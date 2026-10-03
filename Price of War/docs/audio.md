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

Outros sons (jogar carta, comprar, selecionar, tática, banner etc.) continuam como estavam, tocando por `<audio>`.

Para trocar um som mantendo a sincronia: encontre o instante do golpe forte no arquivo, corte o silêncio inicial para que ele caia no instante da imagem
(ataque: 40 ms; queima: 0,44 s) e ajuste o volume pelo nível médio dos outros sons.
