# Retratos de rosto dos Generais (e personagens marcantes)

**Regra do dono (rodada 25):** toda vez que for criar a arte de um **General** (ou outro personagem marcante com nome, "tags", heróis únicos), entregar **também** um prompt de **retrato de rosto** (busto, quadrado 1:1, rosto grande e centrado, estilo "foto 3x4" de personagem). Serve de **avatar** do jogador, de foto no **mapa de Desafios** (no lugar do pino) e de retrato nas telas de partida.

**O estilo do retrato é SEMPRE o mesmo, o do Aurelion** (pintura de fantasia sombria, claro-escuro dramático, uma luz quente no rosto), para os avatares formarem um conjunto. O que muda de um personagem para outro é só o rosto, a roupa/armadura e o fundo (cor e símbolo do deck). **Não** variar a técnica de pintura aqui (a regra de "variedade de estilo" vale para as cartas, não para os retratos).

Ao gerar: **anexar a arte da carta do general como referência** (a IA não repete um rosto só pela descrição). Conferir: sem binóculos, armas de fogo ou equipamento moderno; sem texto na imagem; cabeça inteira com folga para o recorte redondo.

## Molde (trocar só o que está entre colchetes)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Dark fantasy painterly style with dramatic chiaroscuro, one warm light falling on the face. [ROSTO: idade, cabelo, barba, mandíbula, olhos, expressão, marcas]. [ROUPA/ARMADURA]. [FUNDO suave e desfocado, com a cor e o símbolo do deck]. Strictly medieval. Stylized painterly character, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Aurelion (Capitão): referência de estilo
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Dark fantasy painterly style with dramatic chiaroscuro. A man of about 58, short swept-back silver-grey hair, short trimmed grey beard, strong square jaw, deep lines on the forehead, heavy brows, intense commanding eyes, mouth set in stern resolve, a faint old scar on the cheek. Wears dark engraved steel armor with fine gold filigree and the collar of a crimson cape trimmed in gold. Behind him a stormy dark sky with a single warm golden shaft of light falling on his face. Strictly medieval. Stylized painterly character, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Cardeal Anselmo (Cardeal)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Dark fantasy painterly style with dramatic chiaroscuro, one warm golden light falling on the face. An elderly man of about 70, long flowing white beard and white moustache, kind but firm pale-blue eyes, calm wise expression with deep smile lines. Wears a tall white-and-gold bishop's mitre with a small cross and white and gold embroidered vestments with a high gold collar. Behind him a softly blurred glowing rose window of stained glass in amber and orange, a white dove at the edge of the frame, the warm glow of a raised hand lighting his face from below. Strictly medieval. Stylized painterly character, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Brann Meia-Coroa (Mercenários)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Dark fantasy painterly style with dramatic chiaroscuro, warm dusk light falling on the face. A rugged man of about 50, short tousled brown hair going grey, grey-brown stubble beard, weathered tanned skin with crow's feet, a crooked knowing half-smile with one eyebrow slightly raised, the look of a shrewd merchant of wars. Wears a worn black leather greatcoat with a thick fur collar and one brushed-gold pauldron over a scuffed steel breastplate. A small gold coin glints in the air near his raised hand at the edge of the frame. Behind him a dusk sky with a thin column of smoke and a dark banner with a golden half-crown, softly blurred. Strictly medieval. Stylized painterly character, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Margrave Osric (Campo)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Dark fantasy painterly style with dramatic chiaroscuro, warm forge-ember orange light falling on one side of the face against cool slate shadows. A weathered man of about 52, short cropped grey hair, grey stubble, strong jaw, broad nose, a small scar through one eyebrow, calm stern steady eyes, the flat unimpressed expression of a veteran border lord. Wears an olive-green wool coat over riveted steel plates with worn leather straps crossing the chest and a steel gorget at the neck. Behind him, softly blurred, a grey stone tower with a dark green banner showing crossed spear and hammer, and a faint orange forge glow in the dusk. Strictly medieval, no modern gear. Stylized painterly character, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## O que fazer quando as imagens chegarem
Salvar em `src/assets/retratos/<slug-do-general>.webp` (quadrado, ~512 px), usar no mapa de Desafios no lugar do pino (`src/DesafiosScreen.tsx`, `PLACES[...].img`), no cartão do general e como opção de avatar do jogador.
