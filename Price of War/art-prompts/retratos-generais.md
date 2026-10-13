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

## Cardeal Anselmo (Cardeal): versão 2 (guerreiro, não sacerdote)
O Anselmo **luta**: é um cardeal guerreiro com um martelo dourado. A primeira versão (mão erguida, mitra alta, pombo, olhar gentil) saiu com cara de padre e de desenho animado. Lição: para personagens religiosos de combate, **nada de gesto de bênção, pombo ou olhar gentil**; mostrar armadura, arma e olhar de veterano, e proibir "cartoon, comic, outlines, cel shading".
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Dark fantasy painterly style with dramatic chiaroscuro, visible oil-paint brush texture, realistic proportions, one warm golden light falling on the face from the side. A battle-hardened elderly warrior-cardinal of about 68, long white beard and white moustache, strong weathered face with deep lines and a firm stern gaze of a veteran who has led men in battle, a faint old scar across one cheekbone, eyes steady and hard, jaw set. Wears a white-and-gold plate gorget and pauldrons with fine gold engraving under a white and gold war-cloak, a simple gold-trimmed skullcap-style helm-cap with a small cross instead of a tall priestly mitre. At the edge of the frame the head of a huge golden war hammer with a cross on its face rests against his shoulder, held in a gauntleted fist. No raised hands, no blessing gesture, no doves. Behind him a softly blurred ruined cathedral at dusk with a dim amber rose window and a few soldiers' banners, smoke in the air. Strictly medieval. Painterly and serious, not cartoon, not comic book, no outlines, no cel shading, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```
Dica: se o rosto ainda sair diferente, anexar como referência o retrato do Aurelion (estilo) e a carta do Anselmo (rosto).

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
