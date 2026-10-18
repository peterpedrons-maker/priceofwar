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

## Cinzas até o cemitério (prévia v2, rodada 26; NÃO ligado ao jogo)
A v1 (toda sintetizada: vento, brasas, poeira, sino) foi reprovada pelo dono ("muito barulho sem nexo") e descartada. A v2 (`tools/audio/cinzas.py <saida> src/assets`) usa **só sons que o dono já aprovou** e poucos: t=0 o fogo (`sfx-destruicao-fogo.wav`); na versão A, de t=0,55 a 2,33 o brilho mágico (`sfx-efeito-magico.mp3`, abafado e baixo, com entrada e saída suaves) como a nuvem viajando; em t=2,33 (a nuvem chega, medido no jogo) a carta pousando na pilha (`sfx-jogar-carta.wav`, abafado) mais um baque grave curto. Versão B = fogo + chegada, sem nada no meio. Falta o dono escolher A ou B para ligar ao jogo (fogo na queima, pouso em `onArrive`). Lição: sem poder ouvir, não inventar camadas de ruído; reaproveitar os sons do jogo.

**Ligado ao jogo (versão B aprovada pelo dono):** o fogo continua tocando quando a carta começa a queimar (`playDestroySfx`) e, quando a nuvem chega ao cemitério, toca `sfx-cinzas-chegada.wav` (`playAshArriveSfx`, volume 1,16 = a mesma proporção da prévia em relação ao fogo; gerado por `tools/audio/cinzas.py` junto com as prévias). A versão A (brilho mágico no meio) não foi usada.

## Música da vila (menu principal, rodada 26)
`src/assets/music-vila.mp3` (90,8 s, estéreo, 160 kbps, nível médio ≈ o da música do duelo: −13,9 dB contra −13,6 dB). **Versão 2: instrumentos reais gravados.** O dono achou a primeira (toda sintetizada, `tools/audio/musica-vila-sintese.py`) boa mas com "cara de sintetizador"; a atual (`tools/audio/musica-vila.py`) toca a **mesma peça** com **amostras do soundfont FluidR3_GM** (MIT, © Frank Wen; pacote npm `soundfont-for-samplers`, MP3 por nota): violão de nylon (alaúde), harpa, corne inglês/oboé/flauta (melodia, com vibrato leve), cordas em conjunto + viola, violoncelo e contrabaixo, trompa, coro, tímpano e taiko; só o tambor de moldura e o chocalho continuam sintetizados, bem baixos. Notas longas são sustentadas repetindo o trecho estável da amostra com crossfade; tempo e volume têm pequenas variações de "mão humana".
Para refazer: `npm pack soundfont-for-samplers`, extrair `package/FluidR3_GM/<instrumento>-mp3/` (acoustic_guitar_nylon orchestral_harp cello contrabass english_horn oboe flute string_ensemble_1 viola french_horn timpani taiko_drum pad_4_choir), `python3 tools/audio/musica-vila.py <pasta FluidR3_GM> saida.wav` e `ffmpeg -i saida.wav -af "treble=g=2:f=5000,volume=3.5dB,alimiter=limit=0.95" -c:a libmp3lame -b:a 160k src/assets/music-vila.mp3`. **Crédito:** FluidR3 SoundFont, Copyright (c) 2000-2002, 2008, 2013 Frank Wen, MIT License.
Folk sombrio de guerra em **Ré menor/dórico, 74 BPM, 28 compassos**: intro (bordão + alaúde + harpa) → verso 1 (corne inglês) → verso 2 (oboé + cordas) → refrões 1 e 2 (flauta e oboé uma oitava acima, tímpano e taiko, trompa e coro no segundo) → ponte (coro, trompa, cordas) → final que afina até o bordão e volta à intro. O fim dobra a cauda do reverb sobre o começo, então o laço não tem emenda.
`src/menuMusic.ts`: toca em laço (AudioBufferSource) enquanto o menu está na tela, com fade de 2,5 s na entrada e 0,8 s na saída (quando uma partida começa); segue os ajustes de som (Música) ao vivo e, se o navegador ainda não deixou tocar (reabriu o jogo já logado), começa no primeiro toque.
