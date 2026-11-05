# Terreno dos Mercenários ("Acampamento de Contratos", nome provisório): prompts de arte para gerar com IA

Objetivo: trocar o acampamento desenhado em código (que ficou "cartoon") por **arte pintada de verdade**, no mesmo nível da textura de pedra da muralha. O jogo continua animando por cima: luz da fogueira, chamas, brasas, fumaça, balanço do pano, mercenários que chegam e se sentam, montagem peça por peça e o desabamento no fim.

Regras para todos os prompts (já estão dentro deles):
- **Sem texto nas imagens** (a IA erra letras). Emblemas são só desenho (moeda e espadas cruzadas).
- **Fundo magenta `#FF00FF` chapado**, para eu recortar. Nada de chão, sombra no fundo ou degradê atrás.
- **Sem luz forte colorida, sem fogo, sem sombras projetadas**: a luz e a sombra são feitas pelo jogo (é isso que faz parecer noite com fogueira). Chama, vela e tocha **apagadas**.
- **Mesma câmera em tudo**: de frente, inclinada uns 20 graus para baixo, como uma peça de tabuleiro (igual à arte das cartas e do tabuleiro).
- Cada peça pequena e de silhueta forte: na tela elas aparecem com 15 a 90 px, então detalhe fino se perde.
- Gere cada prompt em **imagem grande** (2048 px de largura ou mais) e me mande em PNG. Se a IA aceitar imagem de referência, use junto a **textura de pedra** que você já gerou e uma **carta do jogo** para fixar o estilo.

## Bloco de estilo (cole no começo de TODOS os prompts)
```
Dark medieval fantasy game art, hand-painted digital painting with visible brushwork, semi-realistic, gritty and weathered, desaturated earthy palette (muted olive green, ochre mustard, umber brown, dull steel grey), soft painterly form shading, no black outlines, not cartoon, not cel-shaded, not vector, no text, no letters, no logos, no watermark.
Lighting: neutral, soft and even, slightly cool ambient light. NO strong colored light, NO glowing fire, NO flames, NO embers, NO cast shadows on the ground (the game adds fire light and shadows by itself). Candles, torches and fires are unlit.
Camera: front view with a slight top-down tilt of about 20 degrees, like a tabletop board-game miniature, orthographic, every object drawn at the same angle and scale.
Background: perfectly flat solid magenta #FF00FF, no ground plane, no floor, no shadow on the background, a clear magenta margin around every object, nothing touching the image edge.
```

## Prompt 1: barracas (2 modelos)
```
[cole o bloco de estilo]
Two different mercenary field tents standing side by side with a wide magenta gap between them, each fully visible. Tent A: medium A-frame canvas tent in weathered olive-green canvas with ochre trim along the bottom hem, mended patches, mud stains and dirt on the lower third, taut guy ropes ending in small wooden stakes, entrance opening with the two flaps tied back to the sides, the inside of the entrance dark and EMPTY (nothing inside, no light), a short wooden ridge pole tip poking out of the top. Tent B: larger and a little taller, slightly different patches and faded stripes in olive and ochre, a faded gold coin with two crossed swords painted on the front panel (emblem only, no text), a tied-back entrance with an empty dark interior, ropes and stakes. Both seen from the front with a slight three-quarter turn so one roof slope is visible. Heavy canvas folds and sagging cloth, worn and lived-in, mercenary camp, not new.
Output: one wide image, 2048x1024.
```

## Prompt 2: adereços do acampamento (folha, 10 peças)
```
[cole o bloco de estilo]
A prop sheet of 10 separate camp objects laid out in a 5x2 grid with generous magenta space between them, each one fully visible and drawn at the same scale and angle:
1) a stack of two weathered wooden crates tied with rope, a rolled parchment contract with a red wax seal on top (no writing visible),
2) a wooden barrel with dark iron bands,
3) a wooden weapon rack holding four spears and two swords, with a round olive-green shield painted with a faded gold coin leaning against it (emblem only),
4) a small rough camp table with an open ledger book (blank pages, no text), an inkwell with a quill, a few scattered gold coins, and an UNLIT candle in an iron holder,
5) an open iron-bound dark-wood treasure chest filled to the brim with gold coins and a few gems, lid thrown back (no glow, just painted gold),
6) three burlap supply sacks leaning against each other, one slightly open with grain,
7) a campfire pit: ring of grey stones with a pile of crossed UNBURNED fresh logs and an iron tripod holding a black cooking pot hanging by a chain (no fire, no embers, no smoke),
8) a tall rough wooden banner pole with an olive-green cloth banner hanging straight down, a faded gold coin and two crossed swords painted on it (emblem only), an ornamental spear tip on top,
9) a rope fence segment: two wooden stakes joined by a sagging rope, with a small unlit iron lantern hanging from one of them,
10) a string of small triangular bunting pennants in olive green, ochre and cream cloth hanging on a thin rope, laid straight and horizontal, slightly frayed.
Output: one image, 2560x1280.
```

## Prompt 3: mercenários (6 poses)
```
[cole o bloco de estilo]
A sheet of 6 separate mercenary soldier figures, bold readable silhouettes, all facing to the right, all at the same scale, laid out in a 3x2 grid with magenta space between them. Gritty sellsword look: mismatched armor, leather jerkins, mail coifs and open helmets, scraps of olive-green and mustard cloth, a small gold coin pendant, dirty and weathered, faces mostly in shadow under hoods or helmets (no cartoon faces, no big eyes). Poses:
1) sitting on a log, holding a wooden tankard up toward the mouth, relaxed,
2) sitting on a log, sharpening a sword on a whetstone, head down,
3) standing guard, leaning on a spear, one foot forward,
4) walking in profile, mid-stride with the LEFT leg forward, carrying a sack over the shoulder,
5) walking in profile, mid-stride with the RIGHT leg forward, carrying the same sack over the shoulder (same figure and scale as pose 4, for a two-frame walk cycle),
6) kneeling and counting a small pile of gold coins on the ground.
Output: one image, 2400x1600.
```

## Prompt 4: texturas que se repetem (3 imagens separadas)
Para o pano, a madeira e o chão. Peça **sem emenda** (seamless/tileable), como a textura de pedra que você mandou, 1024x1024, e mande cada uma como arquivo.
```
Seamless tileable texture, 1024x1024, hand-painted dark medieval game texture with visible brushwork, desaturated, no text, no lighting from any particular direction, even flat illumination.
(A) heavy weathered canvas tent fabric in muted olive green with faint ochre stripes, visible coarse weave, sun fading, small stitched mends and a few dirt and mud stains, fine wrinkles.
(B) rough old wooden planks, dark brown with grey weathering, visible grain, nail heads, scratches and small cracks, planks running horizontally.
(C) top-down trampled camp ground, dark brown packed dirt with scattered straw, small pebbles, boot prints and a few hoof marks, subtle darker mud patches.
```

## Opcional (se quiser ir mais longe)
- **Baú e moedas em outra folha**, com moedas soltas separadas (para eu espalhar e fazer brilhar).
- **Sentinela/capitão do acampamento** de pé, mais bem acabado (mesmo estilo do prompt 3), para ser o "rosto" do terreno.
- **Estandarte maior** (uma bandeira comprida, só o pano, sem mastro), para eu animar o balanço de verdade.

## O que eu faço quando as imagens chegarem
1. Recorto o magenta (como fiz com o kit de interface), corto cada peça em um arquivo e otimizo (webp).
2. Troco o desenho em código por essas imagens, **mantendo a luz noturna e a fogueira** (chamas, brasas, vapor, brilho do ouro e da vela continuam animados por mim).
3. Monto a sequência: estacas e corda, barracas sobem, adereços caem, mercenários chegam andando (os dois quadros de caminhada alternam) e se sentam, bandeirolas e estandarte, e o desabamento no fim.
4. Mando o GIF para você aprovar antes de ligar ao jogo.

Observação: o terreno dos Mercenários ainda **não existe como carta**. O nome "Acampamento de Contratos" e o efeito de jogo são provisórios; a arte acima serve em qualquer caso.
