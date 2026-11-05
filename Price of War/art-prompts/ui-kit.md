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


## Prompt D: peças que faltam no kit (segunda folha; para aplicar o kit nas outras janelas)
Mesmo estilo e mesma paleta da folha A (cole a mesma "Art direction" e "Palette"). Se a IA aceitar imagem de referência, mande junto a folha A que você já gerou, para manter a mesma mão.
```
UI kit sheet number 2 for the same medieval dark-fantasy mobile card game as the reference sheet. Flat orthographic front view, every element drawn as a separate clean object on a perfectly flat solid magenta #FF00FF background with generous spacing between them. NO text, NO letters, NO numbers, NO logos, NO watermark, all interiors blank.
Art direction: identical to the first sheet. Restrained, elegant, Dark Souls-like medieval interface. Thin worn gold and bronze metal frames, dark warm-brown leather and aged-wood panels with very subtle grain, small ornamental corner flourishes, chamfered (cut) corners, polished gold highlights, soft inner shadows. No neon, no glow, no cartoon outlines, no 3D perspective. Light always comes from the top left. Same line weights and same metal colors as the first sheet.
Palette: near-black warm brown #120d08 for panels, aged bronze #8a6a2c, polished gold #e6c36a with highlight #f6e3a3, muted crimson #7a1f1f for danger accents, muted green #3f7a4a only for the "ok" count badge.
Elements, each fully contained:
1) TAB, two states side by side: active (polished gold plate with chamfered top corners, slightly raised) and inactive (dark brown with a thin gold edge, flat). Wide enough for a short word.
2) TEXT FIELD, three states in a column: empty (dark inset rounded bar with a thin bronze edge and inner shadow), focused (the edge becomes polished gold), error (the edge becomes muted crimson). Blank inside.
3) SEARCH FIELD: same as the text field but with a small gold magnifying-glass icon at the left end, one state.
4) SLIDER: a long horizontal groove (dark inset with thin bronze edge), a separate gold fill piece for the left part, and a separate round gold thumb knob with a dark center (like the round icon button, smaller).
5) VERTICAL SCROLLBAR: a thin dark groove track with a rounded gold-bronze thumb piece, separate pieces.
6) SPEECH BUBBLE and TOOLTIP: a dark-brown panel with a thin gold border and ornate small corners and a small triangular pointer; two versions: pointer at the bottom center, and pointer at the left center. 9-slice friendly (the pointer is a separate small piece).
7) CURRENCY CHIP: a wide capsule, dark with a thin gold edge, a round gold crown coin sitting at the left end (coin drawn inside, blank capsule on the right) and a small round gold "plus" button at the right end. Second version without the plus button.
8) XP CHIP: same capsule with a small gold shield-with-star emblem at the left end, blank on the right.
9) CHECKBOX and RADIO: unchecked (dark inset square with bronze edge) and checked (the same square with a gold check mark); radio button unchecked and checked with a gold dot.
10) DANGER BUTTON: same shape as the secondary button (wide plaque with chamfered corners) but in dark muted crimson with a gold edge and no emblems, three states: normal, pressed, disabled.
11) ICON BUTTON PLAQUE: the secondary button with a blank round gold-ringed slot at the left end for an icon, one state.
12) COUNT BADGES: two small rounded capsules with a thin ring: green (ok) and crimson (incomplete), blank inside.
13) NOTIFICATION DOT and NUMBER BADGE: a small round crimson dot with a thin gold ring, and a slightly larger round version for a number.
14) TOAST BANNER: a wide, short dark panel with thin gold edges and tiny corner flourishes, blank inside.
```
Para eu aplicar: abas (editor de decks, coleção), campos (busca, nome do deck, login), slider (Opções), barra de rolagem (listas), balão (Loja e dicas), chips de moeda e XP (menu, Loja, fim de partida), botão de perigo (sair da conta, limpar deck), contadores (editor), toast (avisos).

## Prompt E: conjunto de ícones (para botões redondos e chips)
```
Icon set for a medieval dark-fantasy mobile card game interface, 24 separate icons laid out in a 6x4 grid on a perfectly flat solid magenta #FF00FF background with generous spacing, each icon centered inside an invisible 128x128 square. Style: gold-on-dark, a single polished gold glyph with a slightly lighter top-left highlight and a thin darker bronze edge, no background plate, no glow, no outlines, simple bold silhouettes that stay readable at 20 pixels, the same stroke weight everywhere, a slightly engraved medieval feeling. NO text, NO letters, NO numbers.
Icons: back arrow (chevron), close (X), plus, minus, check mark, info (i), settings gear, padlock, search magnifying glass, pencil (edit), trash can, filter (funnel), list view (three bars), grid view (four squares), card (single upright card), sound on (horn), sound off (horn with a slash), crown coin, shield with star (XP), crossed swords, heart, clock (hourglass), share, refresh (two curved arrows).
```
Peço o conjunto em 2048x1536 ou maior; eu recorto cada ícone e uso nos botões redondos, chips e linhas.
