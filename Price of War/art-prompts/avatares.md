# Avatares do jogador (retratos em óleo, mesmo estilo dos Generais)

**Decisão do dono (rodada 25):** os seis avatares antigos ficaram **cartunescos** ao lado dos retratos dos Generais. Vão ser refeitos **no estilo dos retratos** (`art-prompts/retratos-generais.md`: óleo sobre tela, claro-escuro), mantendo os **mesmos personagens** (rosto, roupa e cor de fundo reconhecíveis), só que adultos e pintados, não desenho.

Como gerar (cada um): anexar **1º** o retrato aprovado do Aurelion (estilo) e **2º** o avatar antigo do personagem (`src/assets/avatar-0X.webp`). Mesmo bloco de estilo de sempre. Salvar quadrado (~512 px) em `src/assets/avatares/<id>.webp` e trocar o `image` da opção em `AVATAR_OPTIONS` (`src/App.tsx`); o id não muda, então quem já escolheu continua com o mesmo personagem.

## Prompts (versão 2: roupa e penteado de época)
Lição: termos modernos (bandana, faixa, lenço, bob com franja, jaqueta) saíram em roupa estranha, e o avatar antigo anexado passava o visual cartunesco. Agora: roupa descrita com nomes medievais, cláusula de precisão medieval e o avatar antigo vale **só para o rosto**.

## Batedora (`batedora`)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly. Use the second attached reference ONLY for the face, age and skin tone of the person: ignore its clothing, hairstyle and background completely, and repaint the face realistically as an adult, not cartoon. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. MEDIEVAL ACCURACY: authentic 14th-century European clothing only, hand-stitched wool, linen and rough leather, laced collars, cord ties, iron buckles and brooches, natural dyes in muted earth colors, hairstyles of the period. No bandanas, no headbands, no neckerchiefs, no modern haircuts, no modern jackets, no zippers, no modern fabric, no modern jewelry. A Black woman of about 28 with a warm confident smile and dark expressive eyes, her hair in tight braids pinned up and covered by a plain dull-red linen coif tied under the chin. A coarse linen shirt with a laced collar under a brown leather jerkin laced with cord, a green wool hood resting on her shoulders fastened with a small iron brooch. Behind her a dark misty forest, soft green-grey light between the trunks. Hands out of frame. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Escudeiro (`escudeiro`)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly. Use the second attached reference ONLY for the face, age and skin tone of the person: ignore its clothing, hairstyle and background completely, and repaint the face realistically as an adult, not cartoon. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. MEDIEVAL ACCURACY: authentic 14th-century European clothing only, hand-stitched wool, linen and rough leather, laced collars, cord ties, iron buckles and brooches, natural dyes in muted earth colors, hairstyles of the period. No bandanas, no headbands, no neckerchiefs, no modern haircuts, no modern jackets, no zippers, no modern fabric, no modern jewelry. A young man of about 22 with shaggy copper-red medieval hair, freckles, green eyes and a cheeky half-smile. A faded blue padded gambeson with visible vertical quilting channels and a laced collar over a cream linen shirt, a thin leather strap across one shoulder. Behind him a dusty golden-orange dusk sky with the soft shapes of old stone walls. Hands out of frame. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Arqueiro (`arqueiro`)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly. Use the second attached reference ONLY for the face, age and skin tone of the person: ignore its clothing, hairstyle and background completely, and repaint the face realistically as an adult, not cartoon. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. MEDIEVAL ACCURACY: authentic 14th-century European clothing only, hand-stitched wool, linen and rough leather, laced collars, cord ties, iron buckles and brooches, natural dyes in muted earth colors, hairstyles of the period. No bandanas, no headbands, no neckerchiefs, no modern haircuts, no modern jackets, no zippers, no modern fabric, no modern jewelry. A man of about 38 with a neat black beard, calm warm brown eyes, a dark green wool cloth wound around his head and held with a small round brass pin. A plain brown wool tunic with a laced collar, a leather baldric across the chest with the strap of a quiver, a leather bracer on the forearm. Behind him a sandy warm-ochre dusk with faint ruined stones. Hands out of frame. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Clériga (`clerigo`)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly. Use the second attached reference ONLY for the face, age and skin tone of the person: ignore its clothing, hairstyle and background completely, and repaint the face realistically as an adult, not cartoon. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. MEDIEVAL ACCURACY: authentic 14th-century European clothing only, hand-stitched wool, linen and rough leather, laced collars, cord ties, iron buckles and brooches, natural dyes in muted earth colors, hairstyles of the period. No bandanas, no headbands, no neckerchiefs, no modern haircuts, no modern jackets, no zippers, no modern fabric, no modern jewelry. A young woman of about 25 with a gentle thoughtful gaze and a small serene smile, a long black braid falling over one shoulder. A white wool hooded mantle with gold-embroidered trim, fastened at the neck with a plain gold clasp, a coarse linen collar beneath. Behind her a dark violet dusk and the faint warm glow of candlelight. Hands out of frame. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Soldado (`soldado`)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly. Use the second attached reference ONLY for the face, age and skin tone of the person: ignore its clothing, hairstyle and background completely, and repaint the face realistically as an adult, not cartoon. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. MEDIEVAL ACCURACY: authentic 14th-century European clothing only, hand-stitched wool, linen and rough leather, laced collars, cord ties, iron buckles and brooches, natural dyes in muted earth colors, hairstyles of the period. No bandanas, no headbands, no neckerchiefs, no modern haircuts, no modern jackets, no zippers, no modern fabric, no modern jewelry. A man of about 40 with dark skin, very short cropped hair, a stern steady gaze and a firm jaw. A mail coif lowered around the neck, a steel gorget, and a deep red wool surcoat with a white vertical stripe, rivets on a leather strap. Behind him a dark crimson dusk, softly blurred. Hands out of frame. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Caçadora (`cacadora`)
```
SQUARE IMAGE 1:1, approx 1024x1024px. Head-and-shoulders portrait, face large and centered with a margin of background around the head so a circular crop never cuts it. Match the painting style, brushwork, lighting and color grading of the first attached reference portrait exactly. Use the second attached reference ONLY for the face, age and skin tone of the person: ignore its clothing, hairstyle and background completely, and repaint the face realistically as an adult, not cartoon. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light falling on the face, muted earthy palette with deep shadows, no outlines, no smooth airbrushed skin, no digital sharpness, no cartoon look. MEDIEVAL ACCURACY: authentic 14th-century European clothing only, hand-stitched wool, linen and rough leather, laced collars, cord ties, iron buckles and brooches, natural dyes in muted earth colors, hairstyles of the period. No bandanas, no headbands, no neckerchiefs, no modern haircuts, no modern jackets, no zippers, no modern fabric, no modern jewelry. A woman of about 30 with long wavy chestnut-brown hair in a loose braid blown by the wind, a bright confident smile, light brown eyes. A faded red wool hood pushed back onto her shoulders, a worn leather jerkin laced with cord over a linen shirt, the feathers of arrows and a quiver strap over one shoulder. Behind her a stormy teal-grey sky with clouds, windswept. Hands out of frame. Painted portrait, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no title, no name, no numbers, no icons, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Ícones de símbolo (sem rosto): 23 sugestões (19 gerais + 4 emblemas dos decks; **sem criaturas fantásticas**, decisão do dono: dragões e afins ficam para depois)
Estilo único para todos: **emblema pintado a óleo como metal batido, aço e esmalte** (mesma técnica dos retratos, mas o objeto no centro, com margem larga para o recorte redondo). Anexar o retrato do Aurelion como referência de estilo. Salvar em `src/assets/avatares/<slug>.webp` e acrescentar em `AVATAR_OPTIONS`.

### Leão rampante
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a golden rampant lion standing on its hind legs, mane flowing, claws out, on a worn steel roundel. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Lobo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a grey wolf's head in profile, snarling, fur painted in thick strokes, set in a dark steel medallion with a gold rim. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Corvo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a black raven with spread wings perched on a gold-rimmed iron roundel, one glinting amber eye. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Cervo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a majestic stag's head with tall branching antlers seen from the front, antlers tipped in gold. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Javali
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a charging boar in profile with curved tusks, bristling dark hide, on a worn bronze roundel. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Águia
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a golden eagle with spread wings seen from the front, head turned to the side, feathers in hammered gold. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Coroa
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. an old gold royal crown with a few dull red gemstones and small dents, resting on its side. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Espada e escudo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. an upright longsword with a plain steel crossguard in front of a round wooden shield with an iron boss. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Elmo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a closed steel knight's great helm seen from the front with a narrow eye slit and a worn red plume. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Torre
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a grey stone castle tower with crenellations and a small banner on top, seen from slightly below. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Arco e flecha
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a longbow of yew wood with one arrow nocked and a small quiver of arrows beside it, crossed composition. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Machado e martelo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a battle axe and a war hammer crossed in an X, wooden hafts, dented iron heads. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Cavalo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a war horse's head in profile with a steel chanfron on its face and a red mane, nostrils flared. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Cálice
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a golden chalice with small jewels on the stem, catching the warm light. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Bigorna
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a blacksmith's anvil with a glowing orange-hot horseshoe and a hammer resting on it, a few sparks. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Tocha
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a burning torch on a wooden handle wrapped in iron bands, bright orange flame, sparks rising. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Catapulta
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a medieval wooden catapult with its arm raised, ropes and wheels, small boulder in the sling. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Estandarte
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a tall banner on a spear with a swallow-tailed dark green flag and gold fringe, hanging in folds. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Moedas
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a small stack of old gold coins with one coin balanced on edge, worn and glinting. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Emblema do Campo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a grey stone tower with a dark green banner showing a crossed spear and war hammer. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Emblema dos Mercenários
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a broken half-crown in gold with one gold coin resting against it, on a dark leather background. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Emblema do Cardeal
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a large golden war hammer with a cross on its head standing upright, lit by warm candlelight. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### Emblema do Capitão
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a disciplined ranked formation shown as a steel standard: a crimson banner with a gold sword upright on it. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

## Por liga (decisão do dono, rodada 25)
- Já existem `src/assets/ligas/simbolo-<liga>.webp` (emblema) e `src/assets/ligas/<liga>.webp` (aro) para as 8 ligas.
- **Vale o MAIOR elo já alcançado** (não se perde ao cair de elo). Ao alcançar uma liga, o jogador libera o **ícone** (emblema) e a **moldura** (aro) dela.
- **A moldura aparece em todo lugar** onde o avatar aparece (menu, seletor, partidas casuais e ranqueadas, ranking), não só nas ranqueadas.
- O jogador escolhe ícone e moldura entre os liberados; os trancados mostram o cadeado e a liga necessária.

## Ícones de símbolo, segunda leva (sem fantasia, medieval realista)
Regra do dono: **nada de dragões nem criaturas ou coisas fantasiosas por enquanto**; só quando houver esse tema nas cartas. Mesmo molde dos 23 anteriores; anexar o retrato do Aurelion como estilo.

### 24. Besta
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a medieval crossbow of dark wood with a steel prod and a cocked bolt, a small windlass crank beside it. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 25. Sino de guerra
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a heavy bronze war bell hanging from a wooden beam, worn green patina, a rope hanging down. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 26. Falcão
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a hunting falcon perched on a thick leather falconer's gauntlet, wings half open, sharp eye. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 27. Alabarda
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a halberd with a long wooden shaft, an axe blade, a back spike and a steel spear point, a small tassel. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 28. Cota de malha
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a steel mail hauberk hung on a wooden stand, thousands of tiny rings catching the warm light. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 29. Portão do castelo
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a stone castle gatehouse seen from the front with a raised iron portcullis and a heavy wooden gate, arrow slits above. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 30. Nau de guerra
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a medieval cog sailing ship with a single square sail and a high stern castle, riding dark waves. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 31. Balança do mercador
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a brass merchant's balance scale with two pans, a few gold coins in one pan and a small iron weight in the other. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 32. Pena e tinteiro
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a goose-feather quill resting in a small iron inkwell beside a rolled blank parchment, no writing on it. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 33. Rosa dos ventos
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. an old brass compass with a pointed needle and ornate cardinal points shown only as pointed shapes, no letters. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 34. Ampulheta
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a wooden hourglass with brass fittings and fine golden sand running through, standing upright. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 35. Maça
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a spiked steel flanged mace with a wooden handle wrapped in leather, resting upright. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 36. Lança com flâmula
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a long lance with a steel point and a swallow-tailed crimson pennant fluttering from it. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 37. Chaves cruzadas
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. two large wrought iron keys crossed in an X, one gold-tinted and one dark iron, ornate bows. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 38. Trompa de guerra
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a curved war horn made of horn and bound with bronze bands, a leather strap hanging from it. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 39. Mapa selado
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a rolled parchment map tied with a cord and sealed with red wax, only faint lines and no writing. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 40. Fogueira de acampamento
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a soldiers' campfire with stacked logs and a bright orange flame, an iron cooking pot hanging over it. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```

### 41. Tenda de campanha
```
SQUARE IMAGE 1:1, approx 1024x1024px. A single heraldic emblem, centered, filling about 60% of the frame with a wide dark margin around it so a circular crop never cuts it. a medieval pavilion tent with a conical roof, striped fabric and a small pennant on top, ropes and pegs. STYLE: old-master oil painting on canvas, thick visible brushstrokes and impasto, matte surface, soft painterly edges, dark moody chiaroscuro with one warm light, muted earthy palette with deep shadows, the object rendered as if hammered gold, worn steel and enamel, no outlines, no smooth digital sharpness, no cartoon look. Plain dark textured background with a faint warm glow behind the emblem. Strictly medieval, no fantasy and no magic. Painted, not a photograph, not photorealistic. ARTWORK ONLY: no card frame, no border, no ring, no title, no name, no numbers, no text boxes, no letters, no readable writing, full-bleed artwork.
```


## Estado (rodada 25)
Os 6 avatares em óleo (v2, roupa medieval) e os **41 ícones de símbolo** (das 5 folhas) estão em `src/assets/avatares/<id>.webp` e no seletor (`AVATAR_OPTIONS` em `src/App.tsx`, abas **Personagens** e **Símbolos**; os 4 Generais ficam em Personagens). A primeira tela de perfil mostra só os 6 primeiros personagens.
Descartados por defeito de imagem: chaves cruzadas (feia), estandarte do Capitão repetido com a espada maior que o pano, e as cópias repetidas de nau e flor-de-lis da folha 5 (a folha saiu 3x3 em vez de 2x3). Lição para folhas: **pedir sempre a grade exata (linhas x colunas) e conferir se a IA não repetiu células**; a folha de 6 virou 9 células com repetidos.
Falta: ícone e moldura **por liga** (maior elo alcançado, moldura em todo lugar), com os aros e emblemas de `src/assets/ligas/`.
