# Kit de interface das telas do ranqueado: prompts para gerar com IA

Pedido do dono: um kit de interface próprio para as telas de Ligas, Ranking e fim de partida (a barra de progresso de pontos, em especial, estava fraca). O estilo acompanha os símbolos das ligas: metal esculpido, com brilho e profundidade. Proposta feita em código (para ver o que o kit precisa ter): `docs/janelas/ranqueado-kit-interface-proposta.png`. Mesmas regras de sempre: sem texto, fundo magenta `#FF00FF` chapado, peças separadas com espaço entre elas (para eu recortar e fatiar; as molduras em 9 fatias esticam sem distorcer).

## Prompt A: barra de progresso, divisões, abas e fitas
```
UI kit sheet for a medieval dark-fantasy mobile card game, ranked-mode screens. Flat orthographic front view, every element drawn as a separate clean object laid out on a perfectly flat solid magenta #FF00FF background with generous spacing between them. NO text, NO letters, NO numbers.
Art direction: premium sculpted metal and enamel, like the polished 3D rank emblems of modern competitive games, but medieval: worn gold and bronze metal, engraved details, glass tubes, small gems, soft glowing highlights, light from the top left. Palette: near-black warm brown #120d08, aged bronze #8a6a2c, polished gold #e6c36a with highlight #f6e3a3, emerald #2fa84f, ruby #d4493a.
Elements, each fully contained:
1) PROGRESS BAR FRAME, empty: a very wide, short horizontal tube, ornate gold metal frame with small rivets and rounded end caps, a dark glass tube inside, three small engraved notches evenly spaced inside it (for the four divisions), and a socket at each end. Designed to stretch horizontally in the middle (uniform middle part, only the end caps are ornate).
2) PROGRESS FILL, three separate pieces, each as a long thin glossy liquid-metal bar with a bright highlight on top: a) molten gold, b) emerald green, c) ruby red with a diagonal hatched pattern.
3) DIVISION GEM, two states side by side: a small faceted diamond-shaped gem in a gold setting, one empty (dark, dull crystal) and one filled (glowing gold).
4) TAB, two states side by side: a wide short tab with chamfered top corners, one active (bright polished gold, glowing edge) and one inactive (dark bronze).
5) TITLE RIBBON: a wide polished gold ribbon banner with swallow-tail ends and a small crown-shaped ornament at the top center, blank.
6) POSITION MEDALS, three round medals side by side with a raised rim and a blank center: gold, silver, bronze.
7) POINT CHIPS, three small capsule badges side by side, blank: neutral gold edge, green edge, red edge.
```

## Prompt B: janelas e linhas
```
UI kit sheet for a medieval dark-fantasy mobile card game, ranked-mode screens. Flat orthographic front view, every element drawn as a separate clean object on a perfectly flat solid magenta #FF00FF background with generous spacing. NO text, NO letters, NO numbers.
Same art direction as the previous sheet: premium sculpted worn gold and bronze metal, dark leather and aged-wood panels, engraved details, soft highlights, light from the top left.
Elements, each fully contained:
1) WINDOW FRAME: a tall panel with an ornate sculpted metal border (corner flourishes and small gems at the corners), a thin inner line of light and a plain flat dark-leather center, designed for 9-slice stretching (uniform edges, only the corners ornate, empty center).
2) LIST ROW, three states stacked: normal (dark leather with a thin bronze edge), current (brighter gold edge with a warm inner glow), locked (greyed out with a small padlock at the left). Each has an empty square slot at the left for an emblem and an empty area for text.
3) SEASON BANNER: a wide horizontal plaque with ornate end pieces and a small hourglass ornament at the center, blank.
4) PRIMARY BUTTON, two states: bright polished gold plaque with chamfered corners (normal, pressed/darker), no text and no emblems.
5) SECONDARY BUTTON: dark bronze plaque with a gold edge, same shape, no text.
6) SMALL REWARD SLOT: a square frame with a gold edge and a dark center, three states: normal, glowing (unclaimed), greyed (claimed).
```
Depois de gerar: recorto, fatio as molduras e monto os componentes em código (substituindo o kit atual dessas telas). Os símbolos e as molduras das ligas ficam como estão.
