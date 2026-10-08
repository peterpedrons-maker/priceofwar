# Kit de interface (UI) e mapa de fundo: prompts para gerar com IA

Pedido do dono: um kit de interface próprio, padronizado (hoje os botões mudam muito de uma tela para outra), para ver como ficaria. O estilo parte do que o jogo já tem: painéis marrom-escuros com fio de ouro/bronze, placa dourada polida com espadas cruzadas (`button-plaque.webp`), moldura fina ornamentada (`ui-frame-menu-card.webp`), letras serifadas Cinzel em ouro/marfim, cartas com moldura vermelha e dourada. Referência de sobriedade: Dark Souls (poucos enfeites, muito respiro, nada de néon).
Os prompts estão em inglês (as IAs de imagem entendem melhor). **Sem texto nas imagens**: nomes e números são sempre desenhados pelo jogo (IA erra letras).
Fundo chapado de uma cor só (magenta `#FF00FF`) para eu recortar; depois eu fatio as peças (molduras em 9 fatias, que esticam sem distorcer) e monto os componentes em código.

## Prompt A: folha do kit (todas as peças numa imagem)
```
UI kit sheet for a medieval dark-fantasy mobile card game. Flat orthographic front view, every element drawn as a separate clean object laid out on a perfectly flat solid magenta #FF00FF background with generous spacing between them. NO text, NO letters, NO numbers, NO logos, NO watermark.
Art direction: restrained, elegant, Dark Souls-like medieval interface. Thin worn gold and bronze metal frames, dark warm-brown leather and aged-wood panels with very subtle grain, small ornamental corner flourishes, chamfered (cut) corners, polished gold highlights, soft inner shadows. No neon, no glow, no cartoon outlines, no 3D perspective. Light always comes from the top left. Consistent line weights across all elements, readable when small on a phone.
Palette: near-black warm brown #120d08 for panels, aged bronze #8a6a2c, polished gold #e6c36a with highlight #f6e3a3, muted crimson #7a1f1f used only as a small accent.
Elements, each fully contained:
1) PRIMARY BUTTON: wide plaque with chamfered corners in polished cracked gold, small crossed-swords emblem at each end, three states side by side: normal, pressed (darker and inset), disabled (desaturated grey-bronze).
2) SECONDARY BUTTON: same shape, dark brown with a gold border and no emblems, three states.
3) ROUND ICON BUTTON: small circle with a gold ring and dark center (blank inside), normal and pressed.
4) PANEL FRAME: wide rectangle with ornate corners and thin straight edges, plain flat dark-brown center, designed for 9-slice stretching (uniform edges, only the corners are ornate, the center is empty).
5) LIST ROW: wide and short frame with a square portrait slot on the left, three states: normal, selected (brighter gold border and a soft warm inner light), locked (greyed out, small padlock emblem in the portrait slot).
6) SEGMENTED CONTROL: two segments, the active one in polished gold, the inactive one in dark brown with a thin gold edge.
7) SMALL CHIP: capsule badge, dark with a thin gold edge.
8) DIVIDER: thin horizontal ornamental line with a tiny diamond in the center.
9) STAR RATING: one filled gold star and one empty dark star with a thin gold outline.
10) MODAL WINDOW FRAME: tall panel with an ornate top ribbon (blank) and a plain dark center, 9-slice friendly.
11) TOGGLE SWITCH: on and off.
12) PROGRESS BAR: empty frame and a gold fill piece.
```

## Prompt B: como ficaria a tela de Desafios inteira (conceito)
```
Mobile game screen concept, portrait 9:19.5, medieval dark-fantasy card game, "choose your opponent" screen. Top half: a dark, muted, painted medieval world map seen from above (vellum, coastlines, mountains, forests, tiny castle and city icons), with a soft glowing gold pin on one region and a vignette; the map must stay clearly visible and unobstructed. Bottom half: a vertical list of five opponent rows inside a dark-brown bottom sheet with thin gold edges and ornate corners; each row has a small square general portrait on the left, two blank lines for name and description, and three small stars on the right; one row is selected (brighter gold border, warm inner light), one row is locked and greyed with a padlock. Below the list: one large polished-gold plaque button with chamfered corners and crossed swords at the ends. Top bar: a round gold-ringed back button on the left, a title ribbon in the middle, a small deck chip on the right. Restrained Dark Souls-like interface, no neon, no glow, consistent gold and bronze metal, near-black warm brown panels. All text areas must be blank or blurred placeholders, no readable text.
```

## Prompt C: mapa-múndi de fundo (para a câmera deslizar entre regiões)
```
Top-down painted map of a fictional medieval continent, aged dark vellum with subtle stains, muted earthy colors, slightly desaturated so UI can sit on top. A varied coastline with islands and a bay, a mountain range in the north, a great river with a port town in the south, forests, farmland, a walled castle city in the west, a cathedral city in the center-east, a fortified harbor in the south-east. Small painted icons only (castles, towers, cathedrals, ships, banners), NO labels, NO text, NO compass rose, NO border, NO frame. Square 1:1, very high resolution, evenly detailed everywhere so any crop of it looks good, calm composition without a single dominant focal point, dark vignette at the corners. Painterly, hand-painted look, not photographic.
```

## Prompts individuais (se a folha vier boa mas faltar peça)
Cole o início do prompt A (a parte "Art direction" e "Palette") e peça uma peça só:
- "ONE primary button, 3 states in a column" · "ONE panel frame 9-slice, 1170x600" · "ONE list row, 3 states in a column" · "ONE modal window frame, 800x1100" · "ONE icon set: back arrow, close X, plus, minus, settings gear, lock, check, info, in a consistent gold-on-dark style, each in a 128x128 square".
