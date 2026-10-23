# Retratos de rosto dos Generais (e personagens marcantes)

**Regra do dono (rodada 25):** toda vez que for criar a arte de um **General** (ou outro personagem marcante com nome, "tags", heróis únicos), entregar **também** um prompt de **retrato de rosto** (busto, quadrado 1:1, rosto grande e centrado, estilo "foto 3x4" de personagem). Serve de **avatar** do jogador, de foto no **mapa de Desafios** (no lugar do pino) e de retrato nas telas de partida.

**O estilo do retrato é SEMPRE o mesmo, o do Aurelion** (pintura de fantasia sombria, claro-escuro dramático, uma luz quente no rosto), para os avatares formarem um conjunto. O que muda de um personagem para outro é só o rosto, a roupa/armadura e o fundo (cor e símbolo do deck). **Não** variar a técnica de pintura aqui (a regra de "variedade de estilo" vale para as cartas, não para os retratos).

Ao gerar: **anexar a arte da carta do general como referência** (a IA não repete um rosto só pela descrição). Conferir: sem binóculos, armas de fogo ou equipamento moderno; sem texto na imagem; cabeça inteira com folga para o recorte redondo.

## Estilo fixo dos retratos (lição da rodada 25)
Descrever só "fantasia sombria, claro-escuro" fez cada retrato sair com uma técnica diferente (Aurelion em óleo clássico, Brann em ilustração digital nítida, Osric em pintura digital macia). **Todo retrato leva o MESMO bloco de estilo, palavra por palavra, e o retrato aprovado do Aurelion anexado como referência de estilo** (mais a carta do personagem como referência de rosto e roupa). Gerar os retratos na mesma conversa, um depois do outro.

Bloco de estilo (copiar sem mudar):
```
STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look.
```
Frase de referência (também fixa): "Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly; only the person, clothing and background change. Same character as the second attached reference."

## Molde (trocar só o que está entre colchetes)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. [FRASE DE REFERÊNCIA]. [BLOCO DE ESTILO]. [ROSTO: idade, cabelo, barba, mandíbula, olhos, expressão, marcas]. [ROUPA/ARMADURA]. [FUNDO escuro e desfocado, com a cor e o símbolo do deck]. Hands out of frame. Strictly medieval. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Aurelion (Capitão): ÂNCORA de estilo (aprovado; anexar este retrato nos outros)
Já gerado e aprovado. Prompt original: ver histórico do git (`art-prompts/retratos-generais.md`, rodada 25). Serve de referência de estilo.


## Brann Meia-Coroa (Mercenários): v2 com estilo fixo
Anexar: retrato do Aurelion (estilo) + carta do Brann (rosto).
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly; only the person, clothing and background change. Same character as the second attached reference. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. A rugged man of about 50, short tousled brown hair going grey, grey-brown stubble beard, weathered tanned skin with crow's feet, a crooked knowing half-smile with one eyebrow slightly raised, the look of a shrewd merchant of wars. Black leather greatcoat with a thick fur collar, one brushed-gold pauldron over a scuffed steel breastplate. Behind him a dark dusk sky with a thin column of smoke and a dark banner with a golden half-crown, softly blurred. Hands out of frame. Strictly medieval. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Margrave Osric (Campo): v2 com estilo fixo
Anexar: retrato do Aurelion (estilo) + carta do Osric (rosto).
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly; only the person, clothing and background change. Same character as the second attached reference. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. A weathered man of about 52, short cropped grey hair, grey stubble, strong jaw, broad nose, a small scar through one eyebrow, calm stern steady eyes, the flat unimpressed look of a veteran border lord. Olive-green wool coat over riveted steel plates with worn leather straps across the chest and a steel gorget. Behind him a dark stormy dusk with a softly blurred grey stone tower and a dark green banner with crossed spear and hammer, a faint orange forge glow. Hands out of frame. Strictly medieval. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Cardeal Anselmo (Cardeal): v4 com estilo fixo
Histórico: v1 (mão erguida, pombo, olhar gentil) saiu com cara de padre; v2 (guerreiro com martelo inventado) saiu outro personagem; v3 (estilo quadrinho da carta) destoaria dos outros retratos em óleo. **Lição:** copiar rosto e roupa da carta (cenho franzido, olhar severo, mitra com rubi, peitoral de placas com cruz de rubis), mas pintar no estilo fixo do conjunto. Anexar: retrato do Aurelion (estilo) + carta do Anselmo (rosto e roupa).
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered, facing the viewer straight on, with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly; only the person, clothing and background change. Same character, face and costume as the second attached reference. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. A stern elderly man of about 70 with a deeply furrowed brow and a hard, severe, unsmiling gaze, long full white beard and white moustache, deep wrinkles. Tall white-and-gold bishop's mitre with gold filigree and a small red ruby, white-and-gold engraved plate breastplate with high gold-trimmed shoulder guards and a large gold cross set with red rubies on the chest, a dark crimson cloak. Both hands out of frame, no raised hand, no blessing gesture, no weapon. Behind him a dark ruined stone cathedral at dusk with a dim amber glowing rose window, softly blurred. Strictly medieval. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## O que fazer quando as imagens chegarem
Salvar em `src/assets/retratos/<slug-do-general>.webp` (quadrado, ~512 px), usar no mapa de Desafios no lugar do pino (`src/DesafiosScreen.tsx`, `PLACES[...].img`), no cartão do general e como opção de avatar do jogador.

## Estado (rodada 25)
Os quatro retratos estão em `src/assets/retratos/{aurelion,anselmo,brann,osric}.webp` (512 px). O do Anselmo foi gerado por repintura (v3 em quadrinho repintado em óleo) e depois recebeu correção de cor (menos amarelo e mais contraste, para igualar os outros três). Usados no cartão do general e nos chips de deck da tela Desafios e no editor de decks. Também são os pinos do mapa de Desafios (foto redonda com aro de ouro) e as 4 últimas opções do seletor de avatar (`AVATAR_OPTIONS` em `src/App.tsx`).
