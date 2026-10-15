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

| Convocar carta (carta cai no tabuleiro) | `sfx-convocar.mp3` (volume 0,32, `playCardPlaySfx`) | Baque grave + estalo + trava, mixados de amostras CC0 do pacote npm `uisfx` (estilos "cinematic" e "mechanical": `drop`, `snap`, `lock`); ~0,8 s. Antes: `sfx-jogar-carta.wav` (ainda no repositório). Variante mais seca: ver `docs/janelas/convocar-B.mp3`. |

| Cura (General do Cardeal, Samaritano de Aço, Bênção) | `sfx-cura.mp3` (arquivo enviado pelo dono, "holy healing spell", 2,5 s; volume 0,7 em `src/combatFx.ts`, nome `cura`) | Toca uma vez no momento em que a luz chega à unidade curada. |

| Frases e emojis da partida online | (sem som, decisão do dono: os sons testados foram recusados) | Se um dia voltar, usar um único som para todos. |

Outros sons (jogar carta, comprar, selecionar, tática, banner etc.) continuam como estavam, tocando por `<audio>`.

Para trocar um som mantendo a sincronia: encontre o instante do golpe forte no arquivo, corte o silêncio inicial para que ele caia no instante da imagem
(ataque: 40 ms; queima: 0,44 s) e ajuste o volume pelo nível médio dos outros sons.

## Ajustes de som do jogador (botão Opções, no menu e durante a partida)

`src/audioSettings.ts`: volume **Geral**, **Música** e **Efeitos** (uma barra cada, de 0 a 100%) e um botão **Mudo**, salvos neste aparelho
(`localStorage`, chave `pow.audio`) e aplicados na hora, inclusive na música que já está tocando. A posição da barra vira volume numa curva
(posição ao quadrado): no meio da barra o som parece metade, e não três quartos. Todos os sons passam por `sfxLevel()` / `musicLevel()`:
os de `<audio>` (`sfxVol`), os de `src/sfx.ts` e os sintetizados (banner de fase, moeda). A música do duelo, com a barra em 100%, fica a 60% do nível
em que foi entregue (`MUSIC_BASE_GAIN` = 0,114).

## Sons sintetizados (amostra, rodada 26; ainda NÃO ligados ao jogo)
`tools/audio/gerar-sons.py <pasta>` gera por síntese (numpy) efeitos todos afinados na **Ré menor pentatônica** (D F G A C), com o mesmo reverb curto, em WAV: `impacto-ataque`, `cura`, `comprar-carta` (versões A suave/musical e B seca/percussiva), `carta-pegar`, `carta-arrastando` (laço de 0,5 s), `carta-soltar`, `clique-ui` e o convocar em 3 partes (`convocar-1-voo`, `-2-impacto`, `-3-brilho`; no jogo: voo na subida, impacto em `FLIGHT_HIT_MS`, brilho logo depois). Limite: quem escolhe o gosto é o dono (eu não ouço); o ciclo é ouvir, dizer "mais grave/curto/metálico" e eu ajusto o script.

## Cinzas até o cemitério (prévia, rodada 26; NÃO ligado ao jogo)
`tools/audio/cinzas.py <saida> [src/assets/sfx-destruicao-fogo.wav]` gera `cinzas-nuvem-e-chegada.wav` e a prévia com o fogo do dono. Linha do tempo medida no jogo (`ashFx`): t=0 começa a queimar (som de fogo do dono, 1,3 s); as cinzas saem de 0,2 a 0,9 s; **a nuvem chega em t≈2,33 s**. Camadas: vento de cinza (ruído com filtro que passeia: começa agudo e quente, esfria e aperta ao convergir), rumor grave que cresce, brasas estalando (rareiam), poeira brilhante (notas curtas da pentatônica que se multiplicam ao entrar na pilha), e a chegada = baque surdo + sopro de cinza + a carta pousando e acomodando na pilha + dois toques de sino descendo (Ré e Lá, réquiem). Falta o dono aprovar para ligar ao jogo (tocar no início da queima e a chegada em `onArrive`).
