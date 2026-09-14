# Prompts de Arte — Price of War

Registro dos prompts usados (ou a usar) para gerar a arte das cartas. Cada
carta ganha uma entrada aqui com o prompt exato que foi (ou vai ser) usado,
pra qual estilo de moldura ele serve, e o status (pronto pra gerar / já
gerado / aguardando referência).

As imagens de referência que forem enviadas ficam salvas em
[`reference/`](./reference).

## Os dois estilos de carta

- **Padrão** — o encaixe que já está no jogo hoje: uma janela de arte
  pequena e larga (proporção ~16:10) no topo do card, com a moldura
  (dourada, prata ou champanhe conforme o tipo da carta) ao redor, e o
  texto de efeito embaixo, num painel de pergaminho separado. Arte
  paisagem, não retrato — a moldura corta bastante das bordas.
- **Full Art** — a variação que você criou em cima da moldura dourada: a
  arte preenche o card praticamente inteiro atrás da moldura (proporção
  ~2:3, retrato), sem painel de pergaminho separado — nome, custo, tipo e
  ATK/HP ficam sobrepostos direto em cima da ilustração.

**Regra pras cartas que têm as duas versões:** Padrão e Full Art têm que
ser DUAS ARTES DIFERENTES de verdade — um momento, ângulo ou cenário
diferente pra mesma carta — nunca a mesma cena só reenquadrada/esticada
pra outra proporção. Por exemplo, se a Padrão mostra um cavaleiro
atacando, a Full Art dele não repete a mesma investida vista de outro
ângulo: mostra um momento totalmente diferente (ele descansando depois da
batalha, um close num detalhe específico, etc.). Todos os pares abaixo já
seguem essa regra.

Os prompts abaixo estão em inglês (é o que os geradores de imagem
respondem melhor), com as notas em português.

**⚠️ Sobre orientação/resolução saindo errada:** se alguma arte está saindo
em paisagem quando devia ser retrato (ou vice-versa), a causa quase sempre
é confiar só no texto do prompt pra isso — a maioria dos geradores de
imagem ignora ou "esquece" a orientação pedida em texto quando não recebe
também um parâmetro de proporção/resolução separado, e muitos acabam
caindo de volta pra paisagem ou quadrado por padrão. Pra cada carta
abaixo:

- **Padrão** (a maioria das cartas): paisagem ~16:10. Se seu gerador tiver
  um campo de proporção/resolução separado do texto (Midjourney `--ar
  16:10`, um seletor de "landscape"/paisagem, ou um campo de largura×altura
  em pixels), configure algo como **1600×1000** ou **1280×800** ANTES de
  gerar — não dependa só da palavra "landscape orientation" no fim do
  prompt.
- **Full Art**: retrato ~0,72:1 (mais alto que largo). Configure algo como
  `--ar 5:7` no Midjourney, ou **1024×1424** / **900×1250** em pixels — de
  novo, antes de gerar, não só no texto.

Se o seu gerador não tem esse tipo de campo separado (só aceita texto),
tente colocar a proporção/resolução desejada bem no INÍCIO do prompt (ex.:
"Vertical portrait image, 1024×1424, ...") em vez de só no fim — alguns
modelos dão mais peso ao que vem primeiro.

---

## 1. Comandante Aurelion, Mestre da Formação — Padrão

**Carta:** General do Deck Capitão (ATK 0 / HP 20 / custo 0)
**Estilo:** Padrão · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic fantasy digital painting of a battle-hardened human army commander in
ornate gold-trimmed plate armor, standing on a stone battlefield rampart at
dawn, one gauntleted hand raised as if directing troop formations below, a
tattered crimson-and-gold banner whipping in the wind behind him, storm
clouds parting to reveal warm golden light breaking through, dramatic rim
lighting, painterly brushwork in the style of a premium collectible card
game (Hearthstone / Legends of Runeterra quality), rich warm color palette
of gold, crimson and steel blue, medium-wide shot with the commander
centered and fully visible from head to boots, cinematic composition,
landscape orientation (about 1600×1000px, wider than tall), no text, no card frame, no border, no watermark
```

**Notas:** proporção ~16:10 (paisagem larga e baixa, não um retrato — a
janela do card corta em cima/embaixo). Evite detalhes importantes bem na
borda da imagem, já que a moldura cobre uma faixa fina ao redor.

---

## 1b. Comandante Aurelion, Mestre da Formação — Padrão (alta fidelidade)

**Carta:** General do Deck Capitão (ATK 0 / HP 20 / custo 0)
**Estilo:** Padrão · **Status:** pronto pra gerar
**Diferença pro prompt 1:** muito mais detalhado, com sensação de
profundidade/3D (câmera em ângulo baixo, primeiro plano/meio/fundo bem
separados) em vez de uma pintura "chapada" — no estilo de cartas full art
de TCG como Pokémon, onde a ilustração parece ter perspectiva de verdade.

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Ultra-detailed fantasy trading card illustration of a battle-hardened human
army commander, dynamic low-angle three-quarter hero shot (camera looking
slightly upward at the subject), ornate gold-trimmed heavy plate armor with
intricate engraved filigree, a flowing tattered crimson-and-gold cape
caught mid-motion by the wind, one gauntleted fist raised high as if
directing troop formations below, the other hand resting on an ornate
greatsword planted into cracked stone ground, strong sense of depth and
three-dimensionality rather than a flat illustration: a sharp in-focus
subject in the foreground, a softly blurred army of spear-and-shield
infantry marching in formation in the midground, and a glowing golden
sunrise breaking through dramatic storm clouds in the background,
atmospheric haze separating each depth layer, drifting dust and embers
catching the light as they cross between the layers, extremely detailed
rendering — individual scratches and dents in the armor plating, woven
texture in the cape fabric, strands of windswept hair, reflective specular
highlights on polished metal, a subtle warm glow where light rakes across
the gold trim, painted in the hyper-detailed style of premium trading card
game full-art illustrations (Pokémon TCG full-art / Legends of Runeterra
epic-tier quality), rich saturated color palette of gold, crimson and
steel blue, cinematic rim lighting separating the subject from the
background, shot as if on an 85mm lens with shallow depth of field to
reinforce the illusion of real depth, ultra high detail, masterpiece
quality, no text, no card frame, no border, no watermark
```

**Notas:** mesma proporção ~16:10 do prompt 1 (ainda é pra versão Padrão,
não Full Art) — a diferença aqui é só o nível de detalhe e a sensação de
profundidade/perspectiva pedida no prompt. Se o resultado ficar bom demais
pra caber numa janela pequena, vale considerar reaproveitar essa mesma
imagem como base pra uma versão Full Art também.

---

## 2. Comandante Aurelion, Mestre da Formação — Full Art

**Carta:** General do Deck Capitão (ATK 0 / HP 20 / custo 0)
**Estilo:** Full Art · **Status:** pronto pra gerar
**Importante — proporção:** essa janela é **retrato**, não paisagem — o
oposto da versão Padrão. Proporção largura:altura de **~0,72:1** (mais
alta do que larga). Se o seu gerador aceita um parâmetro de proporção
separado do texto do prompt (ex.: `--ar 5:7` no Midjourney, ou escolher
"portrait"/retrato em outras ferramentas), configure isso ANTES de gerar —
descrever "retrato" só no texto não é confiável o bastante. Se precisar de
um tamanho exato em pixels, use algo como **1024×1424** ou **900×1250**.

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic fantasy trading-card full-art
illustration of a battle-hardened human army commander, tall vertical
portrait composition filling the entire frame from head to boots, dynamic
low-angle hero shot looking slightly upward at the subject, the commander
standing atop a shattered stone battlement with one gauntleted fist thrust
triumphantly into the sky, radiant golden energy crackling around the
raised fist, the other hand gripping an ornate greatsword driven
point-down into cracked stone at his feet, an immense tattered
crimson-and-gold cape billowing dramatically behind him and trailing
toward the edges of the frame, ornate gold-trimmed heavy plate armor with
intricate engraved filigree catching the light, layered depth
composition: a sharp in-focus hero filling most of the vertical frame in
the foreground, a vast army of spear-and-shield infantry marching in
formation far below in the midground, and towering fortress spires and a
colossal shattered banner silhouetted against a churning sky in the
background, dramatic storm clouds parting overhead to unleash a single
beam of golden sunlight directly onto the commander like a divine
spotlight, swirling embers, dust and torn banner fragments caught in the
wind crossing between the depth layers, extremely detailed rendering —
individual rivets and battle-worn scratches in the armor plating,
embroidered thread texture in the cape fabric, windswept hair and beard,
sharp specular highlights on polished gold and steel, painted in the
hyper-detailed epic style of premium full-art trading cards (Pokémon TCG
full-art / Legends of Runeterra legendary-tier quality), rich saturated
color palette of gold, crimson and stormy steel blue, powerful sense of
scale and grandeur, tall vertical portrait aspect ratio (approximately
0.72:1 width to height, noticeably taller than wide), composition
designed to fill a tall card frame edge-to-edge with no empty margins at
the top or bottom, no text, no card frame, no border, no watermark
```

**Notas:** essa é a MESMA carta do prompt 1/1b, mas pensada do zero pra
janela vertical grande da moldura Full Art (item 3 abaixo), não um recorte
da versão Padrão — corpo inteiro visível de cima a baixo, pose bem mais
dinâmica/heroica (punho erguido com energia, capa enorme tomando conta do
quadro, exército embaixo) pra aproveitar o espaço vertical e parecer
"mais épica" de verdade, em vez de uma cena horizontal só esticada.

---

## 3b. Superfície do Tabuleiro — Arenito Iluminado por Tochas (versão anterior)

**Arquivo:** substituído — ver 3b-v2 logo abaixo pra versão atualmente em jogo
· **Referência original:** [`reference/board-interior-sandstone-v1.png`](./reference/board-interior-sandstone-v1.png)
· **Estilo:** cenário/ambiente · **Status:** substituído

A arte atual do tabuleiro é uma pedra cinza-azulada com entalhes de runas —
bonita, mas fria demais pra combinar com as molduras das cartas (douradas,
prateadas e champanhe, todas em tons quentes de pergaminho), e clara
demais: as cartas em cima dela ficam com pouco contraste, difícil de
identificar rápido durante o jogo. Esse prompt troca a pedra fria por um
arenito/calcário quente (o mesmo espírito da arena de duelo do Yu-Gi-Oh
Forbidden Memories de PS1) e acrescenta iluminação de tochas — pensada pra
já servir de referência visual pras sombras dinâmicas das cartas (ambas
"iluminadas" pela mesma fonte de luz quente vinda de cima/dos cantos).

```
Top-down flat-lay photograph of an ancient medieval fantasy stone duel
table, carved from warm sandstone and pale limestone rather than cold gray
rock — a rich honey-tan and weathered-cream color palette throughout, the
same warm parchment family as gold-trimmed heraldic banners, not a blue or
gray stone. The surface is deeply carved with an ornate symmetrical rune
circle and battle-sigil engravings, worn smooth in places by centuries of
use, fine cracks and a light scattering of sand and dust in the grooves.
Warm torchlight spills in from just outside the frame at the upper-left
and upper-right corners, casting soft flickering amber pools of light and
long, soft-edged shadows across the stone — the lighting is warm firelight
(amber/orange, ~2000K), not cold moonlight or magic-blue glow. The very
center of the table, where the game pieces sit, is the brightest, most
evenly and clearly lit area, gently vignetting into deeper warm shadow
toward the four edges/corners of the frame, so objects placed in the
middle read with strong contrast against the stone. Subtle atmospheric
haze and a few drifting dust motes catch the torchlight. Painterly digital
illustration in the style of a premium medieval-fantasy tabletop game
(Gwent / Yu-Gi-Oh Forbidden Memories duel arena quality), extremely
detailed stone texture, no characters, no cards, no UI, no text, no
watermark, straight-down top-view perspective (camera looking directly
down at the table, no tilt), tall vertical portrait orientation
```

**Notas:** proporção ~0,71:1 (retrato, mais alto que largo — mesma
proporção do arquivo atual). Pedi explicitamente a câmera "reta, direto de
cima" porque a gente também está considerando tirar a inclinação 3D do
tabuleiro no jogo (ver decisão em separado) — se a gente mantiver alguma
inclinação, essa mesma imagem ainda funciona, só com um pouco de
perspectiva "de graça" vindo do ângulo em que ela for exibida. As tochas
nos cantos superiores foram pedidas de propósito: a ideia é usar exatamente
essas posições de luz também como referência pra a direção da sombra
dinâmica das cartas no tabuleiro (mais claro perto do centro/tochas, sombra
mais longa quanto mais a carta estiver "de costas" pra elas).

---

## 3b-v2. Superfície do Tabuleiro — Pátio com Portões (versão em jogo)

**Arquivo:** `src/assets/board-interior.webp` (848×1264, feito por fora do
Grimório — sem prompt documentado aqui) · **Referência:**
[`reference/board-interior-gateway-v1.png`](./reference/board-interior-gateway-v1.png)
· **Estilo:** cenário/ambiente · **Status:** substituído — ver 3d logo abaixo

Substitui a versão 3b acima. Em vez de uma mesa isolada cercada de pedra
lisa, esse tabuleiro é um pátio de castelo com um portão/passagem real no
topo e embaixo — cada um com tochas e estandartes (vermelho no topo,
adversário; azul embaixo, jogador) — em vez do trono que tinha ali antes
(removido: a IA que gerou a imagem sempre desenhava os dois tronos virados
pro mesmo lado, sem se encarar, e não teve jeito de corrigir só por
prompt). O General agora fica centralizado bem na passagem/portão; Relíquia
e Terreno ficam nas laterais, na mesma altura, em frente aos muros que
flanqueiam o portão — ver o bloco "General/Relíquia/Terreno" em `App.tsx`
(posicionamento por porcentagem, não mais uma fileira flex, já que os
muros/portão não são um espaçamento uniforme).

---

## 3c. Fundo de Tela (Exterior) — Câmara de Pedra ao Redor da Mesa

**Vai em:** `BOARD_EXTERIOR_ART_URL` em `src/App.tsx` (hoje vazio — cai num
degradê marrom escuro liso enquanto isso) · **Estilo:** cenário/ambiente ·
**Status:** substituído — ver 3d logo abaixo

Depois de deixar a câmera do tabuleiro 100% reta (sem inclinação 3D), sobra
uma faixa visível de tela acima e abaixo da mesa — bem onde a mão do
jogador fica flutuando — que hoje é só um degradê escuro liso. A ideia
aqui é o oposto da arte da mesa (item 3b): em vez de chamar atenção, essa
arte precisa ser **calma e neutra**, pra não competir com as cartas da mão
em cima dela nem com a mesa (que é a parte "bonita" que o jogador realmente
olha durante a partida) — mas ainda parecendo a MESMA sala de pedra
continuando por trás, não um fundo genérico qualquer.

```
Full-screen tall portrait background of a dim, quiet stone chamber
continuing beyond a ritual duel table, same warm sandstone/limestone
material and honey-tan color family as the table itself, but plain and
calm rather than a scene focal point: a smooth, mostly unadorned stone
floor and soft out-of-focus stone walls, only a few faint, sparse rune
markings (nowhere near as dense or detailed as the table's central carved
circle), no strong shapes or subjects to draw the eye. Even, dim, slightly
desaturated ambient torchlight — the same warm amber firelight family as
the table's lighting, but noticeably darker and lower-contrast here, so
objects placed on top of this background (cards, UI) stand out easily
against it. Soft vignette, darkest at the very top and bottom edges of the
frame. A very subtle, soft-focus hint of the stone circle's outer ring
motif may bleed in faintly near the vertical center of the image (where it
will sit behind the table), but the top quarter and bottom quarter of the
image — the parts that stay visible on screen — should read as calm,
low-detail stone with nothing important happening in them. Painterly
digital illustration, same medieval-fantasy tabletop style as the duel
table (Gwent / Yu-Gi-Oh Forbidden Memories quality), no characters, no
cards, no UI, no text, no watermark, very tall vertical portrait
orientation (safe to generate taller than a typical phone screen — it
gets center-cropped to fit)
```

**Notas:** essa imagem cobre a tela inteira (não só o tabuleiro), então
gere bem alta/vertical — algo como 1080×2400 ou mais alto — já que o jogo
corta ela pelo centro pra caber em qualquer proporção de celular
(`object-cover`). O pedido de "calmo, sem detalhe" é de propósito: essa
parte não é o que o jogador deve olhar, é só o que evita a sensação de
"vazio preto" atrás da mão de cartas.

---

## 3d. Arte Única de Tela Inteira — Campo de Batalha Épico (substitui 3b-v2 + 3c)

**Arquivo:** `src/assets/board-battlefield.webp` (feito por fora do Grimório
a partir deste prompt) · **Referência:**
[`reference/board-battlefield-v1.png`](./reference/board-battlefield-v1.png)
· Vai em `BOARD_EXTERIOR_ART_URL` (`src/App.tsx`) — `BOARD_INTERIOR_ART_URL`
ficou vazio, a caixa do tabuleiro virou só uma janela transparente por cima
desta arte · **Estilo:** cenário/ambiente · **Status:** integrado no jogo

A 3b-v2 (pátio com portões, só a mesa) e a 3c (câmara vazia ao redor, nunca
chegou a ser gerada) eram pensadas como duas artes separadas que
precisavam combinar visualmente uma com a outra — mesma pedra, mesma luz,
bordas que emendassem sem costura visível. Na prática isso nunca ficou bom
o suficiente (general "flutuando" sobre a paisagem vista pelo portão,
relíquia/terreno encostando nas paredes, e a integração das duas peças
seguia parecendo remendada). Esse prompt pede a cena inteira como um único
desenho contínuo, sem costura nenhuma pra acertar depois — e também troca
o cenário: em vez de um pátio de castelo (achado fraco demais), agora é um
campo de batalha à noite, com fogueiras/braseiros e estandartes fincados no
chão marcando o "limite" de cada lado, no lugar dos portões de pedra.

```
Full-screen, single continuous top-down illustration of an epic medieval
fantasy battlefield at night, tall vertical portrait spanning the entire
frame edge-to-edge — one seamless scene from the very top edge to the very
bottom edge, not two separate pieces to be joined later.

At the very top edge of the frame: the enemy's front line, marked by a row
of tall red heraldic banners (a golden lion crest on dark red cloth)
planted firmly in the ground alongside two blazing iron war-braziers on
poles. Just beyond this line, low in the frame and soft-focus, a distant
hint of their war camp — silhouetted tents, a few distant bonfires, faint
smoke rising — small and atmospheric, not a place a card could stand.

At the very bottom edge of the frame, mirroring the top exactly in scale,
distance and composition: an identical front line of blue heraldic
banners and blazing war-braziers — this is the player's side, with its
own distant camp glimpsed beyond it.

Between the two front lines, filling the entire vertical middle of the
frame, a wide stretch of open battlefield ground — trampled dirt and
scorched, patchy grass, with only sparse, small battle debris (a few
broken arrows, scattered embers, faint scorch marks) kept clearly away
from the center. This middle area must be deliberately plain, flat, and
uncluttered across the bulk of its width and height — no large debris, no
craters, no bodies, no characters or creatures anywhere — because rows of
playing cards will be placed directly on top of this art in a game.
Specifically leave clearly solid, flat, readable ground: immediately in
front of each side's banner line (so a card standing there reads as
standing on solid ground, not lost against the distant camp), and across
the full width of the battlefield between the two front lines (enough
open ground for two more full rows of cards on each side, stacked between
each front line and the battlefield's center).

Keep both the left and right edges of the frame relatively calm and open
too — distant darkness, a few far-off silhouetted banners or spear tips at
the very edge of visibility, but no large foreground objects — so cards
placed near the battlefield's left/right edges read as standing in open
ground, not overlapping scenery.

Warm firelight (amber/orange, ~2000K) from the four braziers is the
dominant light source against the dark night sky, casting long dramatic
shadows and flickering pools of light across the ground, brightest near
the vertical center of the battlefield and fading into deeper shadow
toward the far edges and corners of the frame. A few embers and drifting
smoke catch the light. Painterly digital illustration, premium
medieval-fantasy tabletop game quality (Gwent / Yu-Gi-Oh Forbidden
Memories duel arena, dramatic war-epic atmosphere), extremely detailed
ground texture and fabric on the banners, no characters, no cards, no UI,
no text, no watermark, straight-down top-view camera (looking directly
down, no tilt, no perspective distortion), very tall vertical portrait
orientation — generate noticeably taller than a typical phone screen
(roughly 1080×2600 or taller) so it can be safely center-cropped to fit
any phone aspect ratio without losing either front line
```

**Notas:** a instrução "não são duas peças a serem combinadas depois" é
proposital — é exatamente o problema que a divisão 3b-v2/3c criava. Troquei
o portão de pedra por uma linha de estandartes + braseiros porque um campo
de batalha aberto não tem "portões" de verdade, mas ainda precisava de
algo que marcasse claramente onde cada lado começa, desse a cor de time
(vermelho/azul) e a luz quente — os braseiros fazem esse papel. Mantive os
mesmos 3 pontos "seguros" pedidos na versão anterior (em frente a cada
linha de frente, e nas duas fileiras entre elas, e margem nas laterais)
porque foram exatamente os pontos que ficaram ruins nas tentativas
anteriores: General em cima de cenário, e Relíquia/Terreno encostando em
alguma coisa. Gerar bem mais alto que a tela (proporção sugerida
~1080×2600+) dá margem pro corte central (`object-cover`) sem cortar
nenhuma das duas linhas de frente. Depois de gerada, essa imagem
provavelmente vira a arte de tela cheia (`BOARD_EXTERIOR_ART_URL`), com a
caixa do tabuleiro perdendo a própria borda/moldura pra virar só uma
janela por cima dela — mas isso é um ajuste de código pra depois, não
precisa decidir antes de gerar a arte.

---

## 3e. Marcador do General — Estandarte de Comando

**Vai em:** um elemento próprio, posicionado em cima do campo de batalha
(3d) exatamente no slot do General (`npc-12`/`player-12` em `App.tsx`),
tanto no topo quanto embaixo · **Estilo:** elemento/ícone de zona ·
**Status:** pronto pra gerar

Ideia da vez: em vez de pedir tudo numa arte só (o que gerou os problemas
de general flutuando, relíquia/terreno encostando em parede etc.), criar
cada elemento funcional do tabuleiro (General, Cemitério, Deck) como uma
peça separada, pequena, isolada num fundo liso fácil de recortar, e
posicionar por cima do campo de batalha liso — daí qualquer ajuste de
posição é só mexer numa porcentagem no código, não precisa gerar arte de
novo. Esse aqui marca onde o General fica: um pequeno pedestal/base de
comando, sem cor de time (a mesma peça serve pros dois lados — o vermelho/
azul já vem das bandeiras no fundo).

```
Top-down game icon illustration of a small commander's command platform: a
low circular stone dais built directly into trampled battlefield dirt, with
a single tall wooden banner pole planted dead center flying a plain,
weathered cloth pennant (no heraldry, no color, no crest — kept neutral so
this same piece works for either army), a pair of crossed ceremonial spears
resting against the base, and a couple of small unlit lanterns at the
platform's edge. Isolated game asset on a flat, solid mid-gray background
(no scene, no other elements, no ground texture bleeding past the edges of
the platform itself) so it can be cleanly cut out and placed on top of
other art. Same painterly medieval-fantasy tabletop game style as the rest
of the set (Gwent / Yu-Gi-Oh Forbidden Memories quality), warm torchlit
color grading (amber/orange highlights, matching a night battlefield),
straight-down top-view camera, no text, no UI, no watermark, roughly square
composition with the platform centered and comfortably inset from all four
edges
```

**Notas:** pedi fundo "liso cinza-médio sólido" em vez de "transparente"
de propósito — geradores de imagem raramente entendem transparência de
verdade (a maioria "inventa" um fundo xadrez ou branco em vez de canal
alpha real), então um fundo sólido e uniforme é bem mais fácil de recortar
depois (remoção de fundo por cor sólida, ou uma ferramenta de recorte
automático) do que tentar pedir "transparente" e não conseguir. Pedi
"quadrado, centralizado, com respiro nas bordas" pra sobrar margem de
corte sem cortar a peça em si.

---

## 3f. Marcador do Cemitério — Pilha de Armas Quebradas

**Vai em:** um elemento próprio, posicionado em cima do campo de batalha
(3d) no lugar do botão/zona "GRAVEYARD" em `App.tsx` (hoje só um retângulo
escuro com texto) · **Estilo:** elemento/ícone de zona · **Status:** pronto
pra gerar

```
Top-down game icon illustration of a small pile of broken battlefield
debris marking a graveyard/discard zone: a few cracked and broken sword
blades and a splintered shield stuck upright in the dirt at angles, a torn
scrap of banner cloth caught underneath them, a light scattering of ash
and a couple of dying embers still glowing faintly among the debris, no
skulls or bones, no color-coded heraldry (neutral, usable for either
army's discard pile). Isolated game asset on a flat, solid mid-gray
background (no scene, no ground texture bleeding past the pile's own
edges) so it can be cleanly cut out and placed on top of other art. Same
painterly medieval-fantasy tabletop game style as the rest of the set
(Gwent / Yu-Gi-Oh Forbidden Memories quality), warm torchlit color grading
matching a night battlefield, straight-down top-view camera, no text, no
UI, no watermark, roughly square composition with the pile centered and
comfortably inset from all four edges
```

**Notas:** mesma lógica de fundo sólido do prompt do General (3e), pelo
mesmo motivo — mais fácil de recortar depois. Evitei caveira/ossos de
propósito (o cemitério aqui é mais "monte de equipamento destruído em
campo de batalha" do que um cemitério literal, pra combinar com o cenário
novo).

---

## 3g. Marcador do Deck — Baú de Suprimentos

**Vai em:** um elemento próprio, posicionado em cima do campo de batalha
(3d) no lugar do ícone de deck em `App.tsx` (hoje um retângulo com o logo
do jogo) · **Estilo:** elemento/ícone de zona · **Status:** pronto pra
gerar

```
Top-down game icon illustration of a small closed wooden supply chest
reinforced with dark iron bands and corner fittings, sitting directly on
trampled battlefield dirt, with a stack of a few rolled parchment scrolls
tied with cord leaning against one side, no color-coded heraldry (neutral,
usable for either army's deck). Isolated game asset on a flat, solid
mid-gray background (no scene, no ground texture bleeding past the chest's
own edges) so it can be cleanly cut out and placed on top of other art.
Same painterly medieval-fantasy tabletop game style as the rest of the set
(Gwent / Yu-Gi-Oh Forbidden Memories quality), warm torchlit color grading
matching a night battlefield, straight-down top-view camera, no text, no
UI, no watermark, roughly square composition with the chest centered and
comfortably inset from all four edges
```

**Notas:** mesma lógica de fundo sólido dos dois prompts acima. Se
preferir algo menos "baú de tesouro" e mais "baralho de verdade", dá pra
trocar a primeira frase por algo tipo "a neat stack of aged playing cards
bound with a leather strap" — mantive baú porque combina mais com o clima
de acampamento militar do campo de batalha.

---

## 4. Tela de Início — Fundo Épico

**Arquivo:** `src/assets/start-screen-bg.webp` (feito pelo usuário a partir
deste prompt, paisagem 1287×816 — funciona bem cortado pra retrato de
celular via `object-cover`, o castelo já fica bem centralizado) ·
**Referência:** [`reference/start-screen-bg-v1.png`](./reference/start-screen-bg-v1.png)
e o mockup completo em [`reference/start-screen-mockup-v1.png`](./reference/start-screen-mockup-v1.png)
(esse último feito pelo usuário numa outra IA — usado só como guia de
estilo/composição) · **Estilo:** cenário/ambiente · **Status:** integrado
no jogo

Divisão em blocos pra tela de início (fundo, painel, botão, logo — cada um
uma imagem separada, isolada, do mesmo jeito que os marcadores de zona),
construída **por etapa**: primeiro o fundo sozinho, depois os botões, só
então o menu clicável de verdade por cima — diferente do tabuleiro (que
precisa de chão liso pras cartas encostarem), aqui a arte pode ser bem
mais cinematográfica, é uma tela de boas-vindas, não uma superfície
funcional.

O mockup de referência mostra uma cena bem mais "no chão" e próxima do que
o prompt original (que era uma vista elevada, exércitos minúsculos ao
longe): fumaça e brasas em primeiro plano, um castelo pegando fogo mais
perto, lanças/bandeiras bem próximas da câmera nas duas bordas, um pôr do
sol dramático furando as nuvens. O prompt abaixo já foi ajustado pra essa
composição.

```
Ultra-detailed epic fantasy digital painting for a game's title screen,
key-art quality: a besieged medieval castle burning at dusk, seen from
ground level at a respectful distance — close enough to feel the scale
and danger, not a tiny distant silhouette. The castle's towers rise
right-of-center against a dramatic, turbulent dusk sky, thick storm
clouds breaking apart to let a single warm shaft of golden-orange
sunlight spill through low on the horizon. Dark smoke billows up from
part of the castle and from a burning structure in the middle distance,
drifting across the sky. In the immediate foreground, tall spear-mounted
banner poles with tattered cloth banners stand close to the camera on
both the left and right edges of the frame, partially cropped by the
frame itself, silhouetted dark against the bright horizon. Scattered
glowing embers and a few drifting sparks float through the whole scene,
especially thick in the lower half of the frame. Deep blue-violet shadow
in the foreground ground and figures, warm gold/orange light dominating
the sky and castle. Painterly digital illustration, premium fantasy game
title-screen quality (League of Legends / Total War loading-screen key
art tier), rich cinematic contrast between cool shadow and warm light,
tall vertical portrait orientation filling a phone screen edge to edge,
no characters, no readable text, no UI, no watermark, no logo
```

**Notas:** diferente do fundo do tabuleiro (3d), aqui não existe restrição
de "deixar chão livre" — é só a tela de boas-vindas, então pode (e deve)
ser mais dramática/cinematográfica. Pedi retrato bem vertical porque cobre
a tela toda atrás do painel do menu (4b) e do logo (4d), que entram por
cima dela.

---

## 4b. Tela de Início — Painel do Menu

**Vai em:** painel/moldura que envolve a lista de botões do menu (hoje só
uma coluna flutuando sem fundo próprio) · **Estilo:** elemento/ícone de UI
· **Status:** não usado — os botões (4c) acabaram ficando bons direto
sobre o fundo (4), sem precisar de um painel por trás; prompt continua
aqui caso a gente queira revisitar

```
Top-down-neutral game UI icon illustration of an ornate vertical wooden
tablet/panel reinforced with aged bronze corner fittings and rivets, a
subtle engraved rope-and-vine border running just inside its edge, meant
to hold a vertical list of menu buttons on top of it. Isolated game UI
asset on a flat, solid mid-gray background (no scene, no other elements)
so it can be cleanly cut out and used as a UI panel background. Same
painterly medieval-fantasy game style as the rest of the set (Gwent /
Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading
(amber highlights on the bronze fittings), no text, no buttons drawn on
it, no watermark, tall vertical rectangle composition (roughly 2:3,
taller than wide) with generous flat, evenly-lit surface area in the
middle for UI content to sit on top of
```

**Notas:** mesma lógica de fundo sólido dos marcadores de zona (3e) — mais
fácil de recortar. Pedi "superfície plana e bem iluminada no meio" de
propósito: é onde os botões (4c) e o texto vão ficar por cima, então não
pode ter sombra/gravura pesada ali ou os botões ficam ilegíveis.

---

## 4c. Tela de Início — Botão Personalizado

**Arquivo:** `src/assets/button-plaque.webp` (recortado do maior de vários
tamanhos que a IA do usuário gerou de uma vez — os outros tamanhos foram
descartados, é só redimensionar este mesmo arquivo por CSS se algum botão
precisar ser maior/menor) · **Vai em:** textura reutilizada nos 4 botões
do menu (Campanha, Partida Rápida, Multiplayer, Meu Deck) — um só arquivo,
usado 4 vezes · **Estilo:** elemento/ícone de UI · **Status:** integrado
no jogo

```
Top-down-neutral game UI icon illustration of a single ornate horizontal
button plaque: a wide rounded rectangular bar carved from aged bronze and
dark wood, with a thin engraved gold trim border and a small stylized
flame or gem accent at the left end. Isolated game UI asset on a flat,
solid mid-gray background (no scene, no other elements) so it can be
cleanly cut out and reused as a button background. Same painterly
medieval-fantasy game style as the rest of the set (Gwent / Yu-Gi-Oh
Forbidden Memories menu quality), warm torchlit color grading, no text
baked into it (text/icon get added separately in code), no watermark,
wide horizontal rectangle composition (roughly 4:1, much wider than
tall), flat and evenly lit across the whole surface so text stays
readable wherever it's placed on top
```

**Notas:** mesmo arquivo serve pros 4 botões do menu — não precisa gerar
um pra cada. "Sem texto" é de propósito: o nome de cada modo (Campanha,
Partida Rápida etc.) é renderizado por cima em código, não pintado na
imagem — e acabou usando uma fonte bold/reta (não a serifada Cinzel do
resto do jogo) com preenchimento creme e contorno escuro, pra bater com
o mockup de referência do usuário (ver 4, `start-screen-mockup-v1.png`).

---

## 4d. Tela de Início — Logo/Emblema

**Vai em:** emblema decorativo acima do nome do jogo, na tela de início ·
**Estilo:** elemento/ícone de UI · **Status:** substituído — ver a nota em
"3d"/seção do logo: o verso da carta (`card-backplate.webp`) já trazia um
brasão idêntico com "PRICE OF WAR — FAITH AND FIRE" pintado nele, então
o usuário recortou aquele em vez de gerar um novo

```
Top-down-neutral heraldic emblem illustration: an ornate engraved bronze
and gold medallion crest, a shield at its center bearing a rearing lion
sigil (the same lion heraldry used on the battlefield's banners), flanked
by two crossed swords behind the shield, the whole emblem wreathed by a
carved laurel-and-banner ribbon border. Isolated game UI asset on a flat,
solid mid-gray background (no scene, no other elements) so it can be
cleanly cut out and placed over other art. Same painterly medieval-fantasy
game style as the rest of the set (Gwent / Yu-Gi-Oh Forbidden Memories
quality), warm torchlit color grading, richly detailed engraved metal
texture, dramatic rim lighting, no text, no watermark, roughly square
composition with the emblem centered and comfortably inset from all four
edges
```

**Notas:** pedi o mesmo brasão do leão que já aparece nas bandeiras do
campo de batalha (3d), pra manter a identidade visual do jogo consistente
— é o "escudo" da facção do jogador, não um símbolo novo. Sem texto de
propósito: o nome "PRICE OF WAR" é renderizado em código (fonte Cinzel,
já usada nos outros textos do jogo) por baixo ou por cima do emblema, não
pintado na imagem — texto pintado por geradores de imagem quase sempre
sai com letras erradas/ilegíveis.

---

## 4d-v2. Tela de Início — Logo (recortado do verso da carta)

**Arquivo:** `src/assets/logo-price-of-war.webp` (recorte com fundo
magenta removido — feito pelo usuário numa outra IA a partir do próprio
`card-backplate.webp`, não gerado do zero) · **Vai em:** topo da tela de
início (`MainMenu`) · **Estilo:** elemento/ícone de UI · **Status:**
integrado no jogo

Acontece que o verso da carta (item "CardBack" em `App.tsx`,
`card-backplate.webp`) já trazia um brasão completo pintado nele — leão,
espadas cruzadas, "PRICE OF WAR" e a faixa "FAITH AND FIRE" — então em vez
de gerar um logo novo do zero (prompt 4d acima), o usuário recortou esse
emblema direto da arte existente com fundo magenta (mais fácil de
remover que o pergaminho/moldura reais do verso da carta, que têm
vinheta/gradiente e não são uma cor sólida) e mandou pra integrar.

**Notas:** essa é a arte que efetivamente está no jogo — o prompt 4d fica
registrado só como alternativa caso um dia se queira um logo desenhado do
zero em vez de reaproveitar o brasão da carta.

---

## 3. Moldura Full Art (dourada) — referência de layout

**Arquivo:** [`reference/full-art-frame-gold-v1.png`](./reference/full-art-frame-gold-v1.png)
**Status:** moldura salva · aguardando uma carta de referência já ilustrada

Essa é a variação Full Art que você fez em cima da moldura dourada atual —
ainda sem arte de personagem dentro, só o encaixe. Medindo a janela
transparente dela: ela ocupa de **10,2% a 89,6%** da largura e de
**15,4% a 88,8%** da altura do card (proporção ~0,72:1, retrato) — é uma
janela única e grande, sem o painel de pergaminho separado que a versão
Padrão tem pro texto de efeito. O nome/custo continuam numa faixa própria
no topo, fora dessa janela.

Quando você mandar uma carta de referência **já ilustrada** (a arte pronta
dentro dessa moldura, ou de outra carta qualquer), eu salvo ela aqui
também e escrevo os dois prompts pra essa mesma carta: um pra versão
Padrão (janela pequena, item 1 acima) e um pra versão Full Art (janela
grande, usando essa proporção ~0,72:1 e a composição dessa referência como
guia de estilo).

---

# Cartas por Deck

A partir daqui os prompts ficam organizados por deck, um card do jogo por
entrada. **Fluxo de trabalho:** assim que você me mandar a arte pronta de
uma carta (ou avisar que já gerou), eu removo a entrada dela daqui — o
prompt já cumpriu seu papel e só ocuparia espaço à toa depois disso. Então
esta lista sempre mostra só o que ainda falta gerar; conforme cada deck for
sendo preenchido, a seção dele vai encolhendo até sumir.

Todo card aqui é **Padrão** (moldura pequena, paisagem ~16:10) e usa a
moldura dourada (Infantaria/Cavalaria/Arqueiro/Relíquia), a prata
(Tática/Terreno) ou a champanhe (Emboscada) — a cor da moldura é só
cosmética no jogo, não muda o prompt da arte em si. As duas exceções em
cada deck são o **General** e a **Relíquia**, que são sempre Full Art
(moldura dourada, janela grande retrato ~0,72:1, ver item 3 acima) —
marcadas como tal em cada entrada.

## Deck Cardeal Pedro

**Identidade visual do deck:** uma ordem militar-religiosa cruzada — branco,
dourado e vermelho-carmesim, luz quente e dourada de caráter "sagrado" (não
azulada/mágica), cruzes e símbolos de fé, cavaleiros com mantos sobre a
armadura no estilo Hospitalário/Templário.

**Nível de detalhe e unicidade (reescrito):** os prompts abaixo foram
reescritos pra parar de compartilhar a mesma composição genérica ("um
soldado parado num campo poeirento") — cada carta agora tem seu próprio
CENÁRIO específico (uma ponte, uma torre, um acampamento à noite, um
pátio de treino, uma floresta com neblina...), seu próprio ÂNGULO DE
CÂMERA (baixo/heroico, aéreo, ao nível do chão, por trás de um obstáculo...)
e sua própria AÇÃO/MOMENTO específico, no nível de detalhe pictórico de
Magic: The Gathering — camada de primeiro plano nítida, meio-campo e fundo
com narrativa visual própria, iluminação dramática específica pra cada
cena, texturas de material descritas (metal arranhado, tecido bordado,
pedra rachada, etc.), não só "pintura fantasia de um soldado". Todos ainda
compartilham a mesma paleta/identidade do baralho (branco, dourado,
carmesim, luz quente sagrada), mas nenhuma cena se repete.

**Cartas com Full Art alternativa:** além do General e da Relíquia (que só
existem em Full Art), estas seis ganham uma versão Full Art opcional além
da Padrão: Jorge o Lanceiro, Nobre Religioso, Cavaleiro Branco, Líder de
Esquadrão, Trabuco, O Soldado Retorna — critério nos comentários originais
mantido (estatística/raridade/impacto na estratégia).

### General

#### 5.1. Cardeal Pedro

**Carta:** General (ATK 0 / HP 20 / custo 0) · **Estilo:** Full Art ·
**Status:** pronto pra gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of an elderly but powerfully built
warrior-cardinal standing on the shattered steps of a half-ruined cathedral
at dusk, tall vertical portrait filling the entire frame, dynamic low-angle
hero shot looking slightly upward at the subject so he towers over the
viewer. He wears ornate white-and-gold clerical plate armor fused with a
priest's vestments — a long white mantle trimmed in gold over the
breastplate, a tall ceremonial gold mitre-shaped helm, a heavy jeweled
cross hanging on a thick chain. In one hand he grips a massive gold
warhammer shaped like an inverted cross, its head resting on a cracked
marble step; the other hand is raised, palm open, radiating warm healing
golden light that spills downward like liquid sunlight onto a kneeling,
wounded young soldier just below him whose armor is catching that same
glow. His expression is serene but resolute — a healer and a warrior at
once, deep creases of age around his eyes. Layered depth composition: the
cardinal and the kneeling soldier sharp in the foreground, a row of
white-and-gold banners and more wounded men waiting their turn in the
softly blurred midground, and the cathedral's broken stained-glass rose
window glowing amber behind him in the background, sky bruised purple and
orange at dusk. Drifting motes of holy light and a few loose feathers from
a startled dove cross between the depth layers. Extremely detailed
rendering — engraved filigree in the armor, individually rendered
embroidered gold thread in the mantle, weathered stone texture on the
cathedral steps, a long white beard catching the golden light, soft
specular highlights on polished gold. Rich warm palette of white, gold and
deep crimson, powerful sense of scale and reverence, composition designed
to fill a tall card frame edge-to-edge with no empty margins at top or
bottom, no text, no card frame, no border, no watermark
```

---

### Relíquia

#### 5.2. Cálice da Vida

**Carta:** Relíquia (ATK 0 / HP 5 / custo 3) · **Estilo:** Full Art ·
**Status:** pronto pra gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary relic portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of an ornate golden chalice resting on
a cracked marble altar inside a roofless, moss-eaten chapel ruin, tall
vertical portrait filling the entire frame. A single shaft of late
-afternoon sunlight cuts down through a gap in the collapsed ceiling,
landing exactly on the chalice, which overflows with glowing liquid light
instead of wine — warm golden-white radiance spilling gently down its
sides and pooling on the altar like liquid sunlight, faint wisps of holy
light rising from the surface like steam. The cup itself is heavily
engraved with cross motifs and filigree, inlaid with small red gemstones,
a fine crack running down one side that the light seems to be healing.
Layered depth composition: the chalice sharp and in focus filling the
lower half of the frame, ivy-choked broken archways and a fallen,
weathered statue of a saint in the softly blurred midground, and a
glimpse of open dusk sky through the ruined roof in the background.
Drifting motes of golden light and dust float upward through the whole
scene. Extremely detailed engraved metal texture, cracked marble grain,
moss and lichen detail on the stonework, reflective specular highlights on
the gold. Rich warm palette of gold, white and deep crimson, powerful
sense of quiet reverence and sacred power, composition designed to fill a
tall card frame edge-to-edge with no empty margins at top or bottom, no
characters, no text, no card frame, no border, no watermark
```

**Notas:** relíquia-objeto num cenário de capela em ruínas — diferente do
altar "limpo" da versão anterior, agora com uma história visual própria
(teto desabado, estátua caída) em vez de um fundo genérico.

---

### Infantaria

#### 5.3. Multidão de Fiéis

**Carta:** Infantaria (ATK 0 / HP 3 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a small
huddled group of devout peasant pilgrims gathered around a humble roadside
shrine at the edge of a muddy encampment at night, thrown into a holy war
with no real weapons — simple travel-worn robes rather than armor, a few
clutching crude wooden holy symbols, one holding up a guttering lantern
that casts the only warm light in the scene, faces lit from below showing
fear mixed with fierce faith. A worn stone marker carved with a cross
stands beside them, half-sunk in mud, small offerings of wildflowers at
its base. Fog rolls low across the ground behind them, distant campfires
of the main army barely visible as blurred orange smudges in the deep
background. Painterly brushwork in the style of premium Magic: The
Gathering card art, low warm lantern-light contrasted against cold blue
night fog, rich texture in the worn cloth and weathered stone, medium-wide
shot with the whole group visible, cinematic low-angle composition,
landscape orientation (about 1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

#### 5.4. Comerciante das Cruzadas

**Carta:** Infantaria (ATK 1 / HP 1 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a shrewd
crusade quartermaster-merchant inside a cramped supply tent lit by a
single hanging oil lamp, two unrolled scrolls of parchment weighted flat
on a crate in front of him, one hand hovering over each as he compares
them with a calculating half-smile, practical leather and cloth robes with
a small cross pendant. Behind him, stacked crates, coiled rope and a
half-open sack of grain crowd the tent's interior, a folded map of the
front lines pinned to the canvas wall. Warm amber lamplight pools on the
scrolls and his face, the tent's canvas walls glowing faintly from a
campfire just outside. Painterly brushwork in the style of premium Magic:
The Gathering card art, rich texture in aged parchment and worn leather,
intimate interior composition (unlike the open-battlefield scenes
elsewhere in this set), warm palette of amber lamplight, cream parchment
and worn leather brown, medium shot fully visible, landscape orientation
(about 1600×1000px, wider than tall), no text, no card frame, no border,
no watermark
```

---

#### 5.5. Espião Sabotador

**Carta:** Infantaria (ATK 1 / HP 2 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a hooded
crusade spy crouched motionless behind a moss-covered fallen log at the
edge of a dense, fog-choked forest at night, a hidden cross pendant just
visible at the collar of his dark practical cloth robes, one hand raised
in a silent "wait" signal, the other resting on a sheathed curved dagger.
Below him, framed through a gap in the trees, a cluster of distant enemy
campfires glows small and orange in a valley shrouded in mist — the thing
he's watching. Cold blue-gray moonlight rakes across the fog and tree
bark, sharply contrasted against the tiny warm enemy fires far below,
his own silhouette almost lost in shadow. Painterly brushwork in the style
of premium Magic: The Gathering card art, muted nocturnal palette of
charcoal, deep forest green and cold moonlight blue with small warm
accents, elevated vantage-point composition looking down into the valley,
cinematic wide shot, landscape orientation (about 1600×1000px, wider than
tall), no text, no card frame, no border, no watermark
```

---

#### 5.6. Soldado Fanático

**Carta:** Infantaria (ATK 1 / HP 2 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a wild-eyed
religious zealot soldier sprinting across a burning wheat field at night,
mismatched scavenged armor over crusade robes, a lit torch gripped in one
fist and a heavy spiked mace raised overhead in the other, eyes blazing
with fanatical fervor, mouth open mid battle-cry. Flames from the burning
crop race along the ground behind him in jagged orange lines, throwing his
silhouette forward in stark hard-edged light, sparks and burning chaff
whipping past in the wind of his own charge. Distant, blurred enemy
banners are just visible through the smoke ahead of him. Painterly
brushwork in the style of premium Magic: The Gathering card art, intense
high-contrast palette of fire orange, soot black and dull crimson,
dynamic low diagonal action composition emphasizing forward momentum,
cinematic wide shot, landscape orientation (about 1600×1000px, wider than
tall), no text, no card frame, no border, no watermark
```

---

#### 5.7. Aprendiz de Infantaria

**Carta:** Infantaria (ATK 0 / HP 2 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a very
young trainee crusader in a dusty outdoor training yard at dawn, wooden
practice dummies and hanging straw targets around him, ill-fitting
hand-me-down armor a size too big, gripping a wooden practice sword with
both hands in an earnest but slightly awkward two-handed stance. The long
shadow of an unseen older mentor stretches across the ground in front of
him from just outside the frame, implying guidance without showing the
teacher. Low golden morning light rakes sideways across the training yard,
catching dust kicked up from the dirt floor, a stack of spare wooden
weapons leaning against a fence post in the blurred background. Painterly
brushwork in the style of premium Magic: The Gathering card art, soft warm
dawn palette of gold, cream and pale steel blue, intimate low
ground-level composition, landscape orientation (about 1600×1000px, wider
than tall), no text, no card frame, no border, no watermark
```

---

#### 5.8. Vigia de Mantimentos

**Carta:** Infantaria (ATK 2 / HP 3 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of an alert
crusade quartermaster-guard standing atop a tall stack of supply crates
and grain sacks in the dead of night, a lantern held high in one hand
casting a warm pool of light, a spear resting against his shoulder,
counting sacks with a tally stick in his other hand while scanning the
dark horizon. Below him, more crates and barrels marked with a small cross
sigil stretch off into moonlit shadow, a sleeping camp of tents barely
visible beyond. Cold silver moonlight washes the background while his own
lantern-light is the only warm source, throwing a long dramatic shadow
down the crate stack. Painterly brushwork in the style of premium Magic:
The Gathering card art, high-contrast nocturnal palette of lantern amber
against moonlit blue-gray, elevated vantage composition looking slightly
down and across the camp, landscape orientation (about 1600×1000px, wider
than tall), no text, no card frame, no border, no watermark
```

---

#### 5.9. Infantaria Treinada

**Carta:** Infantaria (ATK 3 / HP 5 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting shot from a
dramatic worm's-eye ground-level angle looking almost straight up through
a tight, disciplined crusader shield wall — rows of white-and-gold kite
shields overlapping like scales directly overhead, spear-points bristling
between them against a bright overcast sky, one soldier's determined face
visible peering down between two shields directly above the camera. Dust
and a few loose straws drift down between the shields, backlit by the sky
beyond. The formation's discipline itself is the subject rather than any
one soldier — an unbroken wall of white, gold and crimson livery. Painterly
brushwork in the style of premium Magic: The Gathering card art, dramatic
extreme low-angle perspective distortion, bright overcast palette of
white, gold and steel gray, cinematic wide shot, landscape orientation
(about 1600×1000px, wider than tall), no text, no card frame, no border,
no watermark
```

---

### Cavalaria

#### 5.10. Jorge, o Lanceiro

**Carta:** Cavalaria (ATK 4 / HP 6 / custo 3) · **Estilo:** Padrão (+ Full
Art opcional, ver 5.10b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a heroic
mounted knight lancer inspired by Saint George, gleaming white-and-gold
plate armor, riding a powerful white warhorse at full charge down a narrow
gorge road flanked by jagged dark rock walls, a long lance couched and
leveled dead ahead, a white cape marked with a red cross whipping behind
him. In the rocky shadow of the gorge wall to one side, the coiled,
half-glimpsed silhouette of a slain dragon's ribcage juts from the stone —
old bones, not a threat, just a haunting detail hinting at his legend.
Dust and loose scree kick up from the warhorse's hooves, dramatic warm
side-lighting from a low sun at the mouth of the gorge ahead throwing long
shadows back toward the viewer. Painterly brushwork in the style of
premium Magic: The Gathering card art, warm palette of white, gold and
crimson against cold gray rock, dynamic diagonal charging composition
through a canyon, cinematic medium-wide shot with horse and rider fully
visible, landscape orientation (about 1600×1000px, wider than tall), no
text, no card frame, no border, no watermark
```

---

#### 5.10b. Jorge, o Lanceiro — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of the same heroic knight lancer
inspired by Saint George, but a completely different quiet moment than
his battlefield charge: standing dismounted and still atop a windswept
hilltop at sunrise, his lance driven point-down into the earth beside him,
one gauntleted hand resting on the massive bleached skull of a slain
dragon half-buried in the grass at his feet — the legend's aftermath, not
its action. His white-and-gold armor and cape are calm and undisturbed by
wind for once, catching the soft pink-gold light of dawn. His warhorse
grazes peacefully a short distance behind him. Layered depth composition:
the knight and dragon skull sharp in the foreground filling most of the
vertical frame, his resting horse in the midground, a vast, peaceful
sunrise valley stretching out below the hilltop in the background.
Drifting mist rises from the valley floor between the depth layers.
Extremely detailed rendering — engraved filigree in the armor, weathered
bone texture on the massive skull, dew on the grass, soft specular
highlights on polished gold. Rich palette of soft dawn pink, gold and
white, powerful sense of quiet triumph and legend, composition designed to
fill a tall card frame edge-to-edge with no empty margins at top or
bottom, no text, no card frame, no border, no watermark
```

---

#### 5.11. Hospitalário

**Carta:** Cavalaria (ATK 2 / HP 4 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a mounted
knight-healer inspired by the Knights Hospitaller, kneeling beside his
calm white horse in a quiet field strewn with the aftermath of battle at
dusk — broken shields and spent arrows half-sunk in trampled grass, a
white mantle bearing a red cross draped over his plate armor. He leans
over a wounded soldier lying in the grass, one hand glowing faintly with
soft healing light pressed to the man's shoulder, his own lance planted
upright in the ground beside them like a marker. Long shadows stretch
across the field in the fading orange light, distant campfires just
beginning to flicker on the horizon. A quieter, more sorrowful moment than
the charging knights elsewhere in this set. Painterly brushwork in the
style of premium Magic: The Gathering card art, warm dusk palette of
amber, white and soft red fading into cool shadow, intimate ground-level
composition, landscape orientation (about 1600×1000px, wider than tall),
no text, no card frame, no border, no watermark
```

---

#### 5.12. Nobre Religioso

**Carta:** Cavalaria (ATK 4 / HP 5 / custo 3) · **Estilo:** Padrão (+ Full
Art opcional, ver 5.12b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a richly
armored noble crusader lord on horseback atop a windswept hilltop
overlooking a misty valley at dawn, ornate gold-trimmed plate armor with
elaborate religious heraldry on his tabard, one arm raised in a commanding
gesture. Down in the valley below, small figures of loyal soldiers rise
from the drifting ground mist as if freshly summoned, golden light
pooling around their feet, seen from the noble's elevated vantage rather
than up close. Banner-bearers flank his horse at the hilltop's edge,
their standards snapping in the wind. Wide sweeping vista composition
emphasizing scale and distance rather than a close portrait. Painterly
brushwork in the style of premium Magic: The Gathering card art, rich
palette of gold, white and crimson against a cool misty valley below,
dynamic elevated wide shot, landscape orientation (about 1600×1000px,
wider than tall), no text, no card frame, no border, no watermark
```

---

#### 5.12b. Nobre Religioso — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of the same noble crusader lord, but a
completely different, intimate indoor moment instead of his outdoor
hilltop command: kneeling alone in prayer before a small candlelit shrine
inside a private chapel, dismounted, his ornate gold-trimmed armor still
worn but his head bowed and hands clasped around his sword's hilt planted
point-down before him like a cross. Around him, faint translucent figures
of loyal soldiers are just beginning to materialize out of the candlelight
and shadow, kneeling in the same reverent pose he holds, summoned by his
prayer rather than his command. Layered depth composition: the lord sharp
in the foreground filling most of the vertical frame, the materializing
soldiers taking shape in the candlelit shadow around him in the midground,
a small stained-glass window glowing faintly with moonlight in the
background. Drifting motes of candlelight and mist cross between the depth
layers. Extremely detailed rendering — engraved filigree in the armor,
wax pooling on the shrine's candles, soft specular highlights on polished
gold. Rich palette of warm candle-gold against deep chapel shadow,
powerful sense of quiet devotion rather than command, composition designed
to fill a tall card frame edge-to-edge with no empty margins at top or
bottom, no text, no card frame, no border, no watermark
```

---

#### 5.13. Cavaleiro Branco

**Carta:** Cavalaria (ATK 5 / HP 7 / custo 3) · **Estilo:** Padrão (+ Full
Art opcional, ver 5.13b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of the
archetypal White Knight fording a shallow river at the height of a
downpour, a powerful white warhorse throwing up sheets of spray with each
stride, the knight in gleaming full white-and-gold plate armor with almost
no ornamentation beyond a simple engraved cross, sword raised high and
wreathed in a faint holy white-gold glow that cuts through the gray rain.
Rain streaks the whole scene, lightning flashing on the horizon
silhouetting distant battlements, water droplets caught mid-air around the
horse's churning legs. Heroic confident pose undimmed by the storm.
Painterly brushwork in the style of premium Magic: The Gathering card art,
cool stormy palette of slate gray and rain-blue cut through by the knight's
own warm white-gold glow, dynamic river-crossing composition, cinematic
medium-wide shot with horse and rider fully visible, landscape orientation
(about 1600×1000px, wider than tall), no text, no card frame, no border,
no watermark
```

---

#### 5.13b. Cavaleiro Branco — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of the same archetypal White Knight,
but a completely different, still moment instead of his river-storm
crossing: standing perfectly motionless in the calm, sunlit eye of a
battlefield in the moment right after victory, surrounded by a wide ring
of fallen enemy weapons and banners planted broken in the earth, his sword
lowered and resting point-down in the dirt rather than raised, full white-
and-gold plate armor undamaged and gleaming in warm clear daylight, a
serene, almost sorrowful expression rather than triumphant fury. Layered
depth composition: the knight sharp in the foreground filling most of the
vertical frame, the ring of fallen banners and debris in the midground, a
clear, peaceful blue sky finally breaking after the storm in the
background. A single white feather drifts down between the depth layers.
Extremely detailed rendering — engraved plate armor catching clean
sunlight, individual strands of his horse's mane where it stands quietly
behind him, soft specular highlights on polished steel and gold. Rich
palette of clear sky blue, white and gold, powerful sense of solemn
victory and peace, composition designed to fill a tall card frame edge-to
-edge with no empty margins at top or bottom, no text, no card frame, no
border, no watermark
```

---

#### 5.14. Líder de Esquadrão

**Carta:** Cavalaria (ATK 5 / HP 5 / custo 3) · **Estilo:** Padrão (+ Full
Art opcional, ver 5.14b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a mounted
crusader squad captain rallying troops atop a battered, half-collapsed
stone bridge under siege, gold-trimmed armor scorched and dented, raising
a tall white-and-gold banner high with one arm while retreating infantry
and archers around him turn back to rally at the sight of it. Below the
bridge, a river choked with debris and drifting smoke; behind him, the
bridge's far arch has already crumbled into the water, giving the whole
scene the tension of a last stand at a chokepoint. Embers drift past from
a burning wagon nearby. Painterly brushwork in the style of premium Magic:
The Gathering card art, high-tension palette of smoke gray, gold and
crimson, dynamic wide siege-bridge composition, cinematic medium-wide shot
with horse and rider fully visible, landscape orientation (about
1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

#### 5.14b. Líder de Esquadrão — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of the same crusader squad captain, but
a completely different, offensive moment instead of his defensive bridge
stand: leading a full-speed triumphant charge across open golden dawn
fields, banner held level and streaming straight back from the speed of
the gallop rather than thrust upward, gold-trimmed armor pristine and
catching the morning sun, an unmistakable grin of exhilaration rather than
grim resolve. Layered depth composition: the captain and horse sharp in
the foreground filling most of the vertical frame, a wide wave of
cheering infantry charging alongside him in the midground, a bright open
sunrise horizon in the background. Dust and sunlit motes cross between the
depth layers. Extremely detailed rendering — polished undamaged armor,
embroidered banner fabric streaming in the wind, sharp specular highlights
on gold trim. Rich palette of golden sunrise, crimson and white, powerful
sense of unstoppable momentum and morale, composition designed to fill a
tall card frame edge-to-edge with no empty margins at top or bottom, no
text, no card frame, no border, no watermark
```

---

### Arqueiros

#### 5.15. Arqueiro Profissional

**Carta:** Arqueiro (ATK 1 / HP 4 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting shot from a
dramatic aerial vantage angle, looking out from inside a shattered stone
watchtower's topmost window ledge where a skilled crusader crossbowman
kneels, already reloading a second bolt with practiced speed just as the
first one flies off toward unseen targets far below. White-and-gold tabard
over practical leather armor, a full quiver of bolts at his hip, focused
intense expression lit from one side by the low sun. Through the broken
window frame beside him, a dizzying view down onto a distant battlefield
sprawls below, tiny figures and banners barely visible in the haze.
Painterly brushwork in the style of premium Magic: The Gathering card art,
warm palette of gold, cream and steel gray against a hazy pale sky far
below, dramatic elevated interior-to-exterior composition, cinematic wide
shot, landscape orientation (about 1600×1000px, wider than tall), no text,
no card frame, no border, no watermark
```

---

#### 5.16. Atirador Influente

**Carta:** Arqueiro (ATK 1 / HP 3 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a veteran
crusader archer with a weathered, wise face and graying hair, kneeling
behind a much younger apprentice archer at a quiet practice range at
golden hour, his own weathered hands gently adjusting the boy's grip and
draw on the bowstring, calm patient expression contrasting with the
battlefield scenes elsewhere in this set — a quiet legacy-passing moment
rather than combat. Worn but well-kept gear, a row of spent arrows already
stuck in a straw target downrange, long warm shadows stretching across the
grass. Painterly brushwork in the style of premium Magic: The Gathering
card art, warm golden-hour palette of amber, cream and soft green, intimate
low ground-level composition emphasizing the two figures together, wide
shot fully visible, landscape orientation (about 1600×1000px, wider than
tall), no text, no card frame, no border, no watermark
```

---

### Táticas de dano

#### 5.17. Trabuco

**Carta:** Tática (custo 3) · **Estilo:** Padrão (+ Full Art opcional, ver
5.17b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting shot from a
dizzying point-of-view mounted directly in the sling of a massive wooden
trebuchet siege engine at the exact instant of release, the flaming
payload just leaving the sling and hurtling toward the viewer as the arm
whips upward against a dawn sky, crusader soldiers below straining at
ropes and bracing against the machine's recoil, seen tiny and foreshortened
from this extreme vantage. A distant fortified enemy gatehouse looms on
the horizon, the trebuchet's true target. Dust, splinters and sparks
fly close to camera. Painterly brushwork in the style of premium Magic:
The Gathering card art, warm palette of gold, wood brown and fire orange
against a pale dawn sky, extreme dynamic point-of-view composition unlike
any other siege weapon in this set, cinematic wide shot, landscape
orientation (about 1600×1000px, wider than tall), no text, no card frame,
no border, no watermark
```

---

#### 5.17b. Trabuco — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Ultra-epic Magic: The Gathering-quality fantasy trading-card full-art
illustration of the aftermath moment of a Trabuco's strike rather than the
launch itself, tall vertical portrait filling the entire frame: seen from
very far away and low to the ground at night, a small silhouetted crusader
army camp in the foreground bottom of the frame, and high above in the
night sky, a massive fireball from the payload's impact blooms silently in
the distance like a second, brief sun, lighting the undersides of the
clouds orange and casting long dramatic shadows from the watching soldiers
below. Layered depth composition: silhouetted watching soldiers sharp in
the foreground filling the lower part of the frame, a dark empty stretch
of night battlefield in the midground, the massive distant fireball and
lit clouds dominating the upper background. Sparks and embers drift high
in the sky between the depth layers. Extremely detailed rendering —
individually rendered distant embers and smoke tendrils, silhouette detail
on the watching soldiers' armor rims. Rich palette of deep night blue-
black and blazing fire orange, powerful sense of awe and scale from a
safe distance, composition designed to fill a tall card frame edge-to-edge
with no empty margins at top or bottom, no text, no card frame, no border,
no watermark
```

---

#### 5.18. Catapulta

**Carta:** Tática (custo 2) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a wide,
bustling daytime siege camp, several crusader soldiers cheering and waving
as a compact wooden catapult mid-camp fires its throwing arm, launching a
heavy stone payload in a clean arc toward one specific distant row of
enemy soldiers atop a stone gatehouse. Unlike the trebuchet's tight close-
up power shot elsewhere in this set, this is a wide, populated battlefield
vista — mud, tents, spare ammunition stacked in pyramids, banners planted
in the ground, a whole army's energy captured in one frame. Bright midday
sun casts short hard shadows. Painterly brushwork in the style of premium
Magic: The Gathering card art, warm palette of gold, wood brown and stone
gray under bright daylight, dynamic wide vista composition, cinematic wide
shot, landscape orientation (about 1600×1000px, wider than tall), no text,
no card frame, no border, no watermark
```

---

#### 5.19. Balesta

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a single
massive mounted ballista standing alone atop a moonlit ridge at night, a
giant crossbow on a wooden frame, silhouetted starkly against a huge full
moon low on the horizon as it fires one enormous bolt directly across the
moon's face toward a distant, unseen target. Only two crusader crew
members are visible, small and quiet beside the machine, bracing the frame
after release — a solitary, moodier scene than the busy daytime siege
camps elsewhere in this set. Cold silver moonlight defines every edge,
taut ropes still vibrating from the shot. Painterly brushwork in the style
of premium Magic: The Gathering card art, high-contrast nocturnal palette
of deep indigo and silver moonlight with a single warm bolt-trail, stark
silhouette composition, cinematic wide shot, landscape orientation (about
1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

### Armamentos (equipáveis)

#### 5.20. Armadura Pesada

**Carta:** Tática/Armamento (custo 1) · **Estilo:** Padrão · **Status:**
pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting, a rich still
-life illustration of an ornate suit of heavy white-and-gold full plate
armor standing on a wooden display stand inside a candlelit stone armory,
cuirass, gauntlets and a closed great helm all catching warm flickering
candlelight from a nearby iron candelabra, faint engraved cross motifs on
the breastplate, old tapestries depicting past crusades hanging on the
stone wall behind it, dust motes drifting through the candlelight. A
polished shield leans against the stand's base. Painterly brushwork in
the style of premium Magic: The Gathering card art, warm palette of white,
gold and deep candlelit shadow, intimate interior still-life composition,
medium shot with the full armor stand visible, landscape orientation
(about 1600×1000px, wider than tall), no text, no card frame, no border,
no watermark
```

---

#### 5.21. Corcelete

**Carta:** Tática/Armamento (custo 1) · **Estilo:** Padrão · **Status:**
pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting, a still-life
illustration of a lighter gold-trimmed steel breastplate hanging from a
crude wooden weapon rack planted in the dirt beside a crackling outdoor
campfire at dusk, simpler and less ornate than full plate, leather straps
swaying slightly, the campfire's orange glow catching the polished metal
from below — a casual field-camp setting, deliberately different from the
formal candlelit armory of the heavier armor piece in this set. A
bedroll and a half-eaten meal sit nearby, implying a soldier just stepped
away. Painterly brushwork in the style of premium Magic: The Gathering
card art, warm palette of campfire orange, steel gray and dusk purple,
outdoor still-life composition, medium shot with the rack visible,
landscape orientation (about 1600×1000px, wider than tall), no text, no
card frame, no border, no watermark
```

---

#### 5.22. Flecha Envenenada

**Carta:** Tática/Armamento (custo 1) · **Estilo:** Padrão · **Status:**
pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting, an extreme
close-up macro still-life of a single ornate crossbow bolt resting across
two crossed daggers on a dark cloth, its tip coated in a sickly glowing
green poison that drips slowly onto the cloth below, faint toxic vapor
curling off the tip and catching a shaft of dim torchlight from one side —
the poison's own glow acting as a second light source against the
otherwise near-black background. Fletching feathers rendered in sharp
individual detail. Painterly brushwork in the style of premium Magic: The
Gathering card art, palette of near-black cloth, gold fletching and toxic
green glow, extreme macro close-up composition, landscape orientation
(about 1600×1000px, wider than tall), no text, no card frame, no border,
no watermark
```

---

#### 5.23. Espada Longa

**Carta:** Tática/Armamento (custo 1) · **Estilo:** Padrão · **Status:**
pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting, a close still
-life illustration of an ornate blessed longsword driven point-down into
a moss-covered stone slab outdoors at dawn, a cross-shaped gold hilt,
the blade itself catching a faint warm holy glow along its edge that
seems to come from within the metal rather than reflected light, dew
beading on the crossguard, soft mist curling around the base of the blade
at ground level. Intricate engravings near the guard just catching the
first sunlight. Painterly brushwork in the style of premium Magic: The
Gathering card art, palette of steel, gold and dawn-lit mist, outdoor
close-up composition (contrasting with the indoor candlelit still-lifes
elsewhere in this set), landscape orientation (about 1600×1000px, wider
than tall), no text, no card frame, no border, no watermark
```

---

### Emboscadas

#### 5.24. Forças Secretas

**Carta:** Emboscada (custo 1) · **Estilo:** Padrão · **Status:** pronto
pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a small
group of crusader reinforcements hidden in the shadows of a ruined
chapel's broken pillars, weapons drawn and ready, tense alert expressions
lit by a single shaft of light spilling through a hole in the collapsed
roof above them, about to spring out to reinforce an ally under attack
just beyond the chapel's shattered doorway. Ivy creeps over the fallen
stonework around them, a broken statue of a saint watching over the
hiding place. Painterly brushwork in the style of premium Magic: The
Gathering card art, warm palette of gold light against cool ruined-stone
shadow, tense interior-ambush composition unlike the open-field ambushes
elsewhere in this set, medium-wide shot with the group visible, landscape
orientation (about 1600×1000px, wider than tall), no text, no card frame,
no border, no watermark
```

---

### Táticas de utilidade

#### 5.25. O Soldado Retorna

**Carta:** Tática (custo 1) · **Estilo:** Padrão (+ Full Art opcional, ver
5.25b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a fallen
soldier's translucent golden-white spirit rising from a simple battlefield
grave marked by a planted sword and helm at the edge of a quiet moonlit
cemetery hill, warm holy light lifting the ghostly figure back upright as
if returning to the ranks, a handful of fellow soldiers kneeling in
reverent awe at the base of the hill, their lanterns the only other light
source. Rows of simpler grave markers stretch away into the misty dusk
background, implying this is one of many such graves. Painterly brushwork
in the style of premium Magic: The Gathering card art, warm palette of
gold and translucent white against deep dusk blue mist, elevated hillside
composition, medium-wide shot fully visible, landscape orientation (about
1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

#### 5.25b. O Soldado Retorna — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Ultra-epic Magic: The Gathering-quality fantasy trading-card full-art
illustration of the moment just AFTER the return, not the rising itself:
tall vertical portrait filling the entire frame, the once-fallen soldier
now fully solid and alive again, walking forward through the camp under a
bright clear dawn sky, still faintly glowing at the edges but otherwise
flesh and armor once more, arms opening wide as a group of his old
comrades rush forward to embrace him in disbelief and joy, tears and
laughter on their faces. Layered depth composition: the returned soldier
and the first comrade reaching him sharp in the foreground filling most of
the vertical frame, more soldiers running to join the reunion in the
midground, a bright dawn sky and the camp's banners in the background.
Sunlit dust and drifting fading motes of the last of his ghostly glow
cross between the depth layers. Extremely detailed rendering — genuine
emotion in the faces, weathered reunited armor, sharp specular highlights
in the bright dawn light. Rich palette of warm gold sunrise, white and
soft red, powerful sense of joy and homecoming rather than solemn
resurrection, composition designed to fill a tall card frame edge-to-edge
with no empty margins at top or bottom, no text, no card frame, no border,
no watermark
```

---

#### 5.26. Busca pelo Santo Graal

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a lone
knight kneeling in awe at the threshold of a sun-drenched, half-collapsed
underground shrine, the legendary Holy Grail glowing with soft radiant
light atop an ancient stone pedestal deep within, reachable down a short
flight of worn stone steps he's only just descended. Roots and vines have
grown through cracks in the shrine's ceiling, a single beam of sunlight
piercing down from above to strike the Grail directly. Dust motes hang
thick in the shaft of light. Painterly brushwork in the style of premium
Magic: The Gathering card art, warm palette of gold, cream stone and soft
white light against deep underground shadow, dramatic descending-steps
composition, medium shot fully visible, landscape orientation (about
1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

#### 5.27. Nova Tática

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a war
council scene shot from a high corner angle looking down over a wooden map
table inside a candlelit command tent, a cardinal-commander's hand
pinning a carved wooden marker onto a hand-drawn battlefield map while
several crusader officers lean in around the table studying it intently,
their faces lit from below by the map table's ring of candles. Rolled
scrolls, an inkwell and a compass rest at the map's corners. Warm
candlelight is the only light source, deep shadow pooling in the corners
of the tent. Painterly brushwork in the style of premium Magic: The
Gathering card art, warm palette of amber candlelight, parchment cream and
gold, elevated interior composition, medium-wide shot fully visible,
landscape orientation (about 1600×1000px, wider than tall), no text, no
card frame, no border, no watermark
```

---

#### 5.28. Escolher a Dedo

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a torchlit
night muster, a crusader officer walking down a line of soldiers standing
at rigid attention along a castle courtyard wall, torches mounted between
them casting alternating pools of warm light and shadow down the line,
stopping to point decisively at one specific soldier who straightens with
pride as the torchlight catches him. The rest of the line stands in
disciplined shadow, waiting. Painterly brushwork in the style of premium
Magic: The Gathering card art, high-contrast palette of torch-gold pools
against deep night shadow, dramatic repeating-light composition down the
line, medium-wide shot fully visible, landscape orientation (about
1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

#### 5.29. Escolher Tropas

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a crusader
captain inspecting a short row of assembled soldiers standing at attention
on a dew-covered parade ground at dawn, thick low mist swirling around
their boots, closely comparing two of them side by side with a critical
eye while the rest wait calmly in the mist behind. Pale gold dawn light
breaks low across the field, throwing long thin shadows across the wet
grass. Painterly brushwork in the style of premium Magic: The Gathering
card art, warm palette of gold, white and pale misty blue, atmospheric
low-mist dawn composition, medium-wide shot fully visible, landscape
orientation (about 1600×1000px, wider than tall), no text, no card frame,
no border, no watermark
```

---

#### 5.30. Aumento de Impostos

**Carta:** Tática (custo 0) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a crusade
treasurer counting stacks of gold coins by candlelight at a cluttered
wooden desk inside a cramped supply tent, an open ledger covered in tally
marks, a heavy iron-banded coin chest half-open beside him spilling more
coins onto the desk, a small cross pendant swinging from his neck as he
leans forward. A single candle in a dish throws warm flickering light
across the coins, making them glint individually. Painterly brushwork in
the style of premium Magic: The Gathering card art, warm palette of gold
coin shine, candle amber and worn wood brown, intimate cluttered-desk
composition, medium shot fully visible, landscape orientation (about
1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

#### 5.31. Reunião de Fiéis

**Carta:** Tática (custo 2) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting shot from a
high rooftop vantage looking down over a crowded stone town square at
dusk, a sea of humble faithful pilgrims and villagers converging from
every side street toward a single raised white-and-gold banner planted in
the square's center, hands raised or clutching holy symbols, torches
beginning to be lit throughout the crowd as evening falls. The
architecture of the town — narrow streets, tiled roofs, a small chapel bell
tower — frames the gathering from above, giving a genuine sense of a whole
town answering a call, distinct from the smaller, close-up group scenes
elsewhere in this set. Painterly brushwork in the style of premium Magic:
The Gathering card art, warm palette of gold, torch-orange and dusky
blue-violet sky, dramatic elevated wide-vista composition, landscape
orientation (about 1600×1000px, wider than tall), no text, no card frame,
no border, no watermark
```

## Deck Capitão

**Identidade visual do deck:** um exército profissional disciplinado, sem
tom religioso — carmesim, dourado e cinza-aço, o mesmo brasão do leão
rampante que já aparece nas bandeiras do campo de batalha (item 3d) e no
logo do jogo (4d-v2). Diferente do Cardeal Pedro (fé e cura), esse
baralho é sobre formação e movimento tático.

**Nível de detalhe e unicidade (reescrito):** mesmo tratamento aplicado ao
Deck Cardeal Pedro — cada carta abaixo tem seu próprio cenário específico,
ângulo de câmera e momento de ação, no nível de Magic: The Gathering, em
vez de repetir "um soldado parado num campo poeirento" com só o sujeito
trocado. Várias cenas literalmente visualizam a própria mecânica da carta
(o Lanceiro de Controle bloqueando uma passagem inteira, o Veterano na
terceira trincheira/"coluna", a Formação Quebrada como um vórtice de caos)
em vez de ilustrar só o nome. Todas ainda compartilham a mesma paleta/
identidade do baralho.

**Cartas com Full Art alternativa:** mesmo critério do Deck Cardeal Pedro —
além do General (já coberto pelos itens 1/1b/2) e da Relíquia (só existe em
Full Art), estas seis ganham uma versão Full Art opcional: Cavaleiro
Tático, Capitão de Formação, Veterano de Guerra, Reformar Linhas, Contra-
Manobra, Fortaleza de Pedra.

### General

Já coberto pelos itens **1**, **1b** e **2** lá em cima (Comandante
Aurelion, Mestre da Formação) — nada pra fazer aqui.

### Relíquia

#### 6.1. Estandarte da Legião

**Carta:** Relíquia (ATK 0 / HP 5 / custo 3) · **Estilo:** Full Art ·
**Status:** pronto pra gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary relic portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of an ornate legion war-standard
planted triumphantly atop the wreckage of a captured enemy siege engine on
a smoke-hazed battlefield, tall vertical portrait filling the entire
frame. The standard's pole is dark iron topped with a gleaming gold
rearing-lion finial, a heavy crimson-and-gold banner cloth hanging from it
and rippling in the wind, radiating a warm golden aura that visibly
empowers the ground and air around it — faint golden light lines pulsing
outward like a heartbeat. The broken timber and cracked wheel of the
enemy engine beneath it make the standard read as a victory marker, not
just decoration. Layered depth composition: the standard sharp and in
focus filling most of the frame, blurred rows of disciplined soldiers
marching past below in the midground, a dusty battlefield and steel-gray
smoke-streaked sky in the background. Drifting embers and dust motes cross
between the depth layers. Extremely detailed rendering — engraved ironwork
on the pole, embroidered gold thread in the banner cloth, splintered wood
texture on the wrecked siege engine, reflective specular highlights on
the lion finial. Rich palette of crimson, gold and steel gray, powerful
sense of authority and hard-won victory, composition designed to fill a
tall card frame edge-to-edge with no empty margins at top or bottom, no
characters, no text, no card frame, no border, no watermark
```

---

### Criaturas

#### 6.2. Soldado Tático

**Carta:** Infantaria (ATK 3 / HP 3 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of two
disciplined crimson-and-gold infantry soldiers caught mid-motion crossing
paths on a hard-packed drill yard, chalk-and-rope formation lines painted
on the ground beneath their boots making the choreography of the swap
visually readable, sturdy practical plate-and-mail armor, each glancing at
the other as they trade places in the line without breaking stride. Rows
of identically-drilled soldiers hold their positions in sharp formation in
the blurred background, a drill sergeant's raised flag visible at the
yard's edge. Warm dusty daylight, low golden sun raking across the packed
earth. Painterly brushwork in the style of premium Magic: The Gathering
card art, warm palette of crimson, gold and steel gray, dynamic crossing-
motion composition, medium-wide shot fully visible, landscape orientation
(about 1600×1000px, wider than tall), no text, no card frame, no border,
no watermark
```

---

#### 6.3. Escudeiro de Linha

**Carta:** Infantaria (ATK 2 / HP 4 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting shot from a
dramatic low worm's-eye angle from directly behind and below a sturdy
crimson-and-gold squire, looking up past his braced legs and raised tower
shield toward a sky full of incoming arrows frozen mid-fall, several
already stuck harmlessly in the shield's face. Between his planted boots,
partially visible, two younger soldiers crouch low in the shelter of his
shadow, safe behind him. Warm dusty daylight breaks around the shield's
edge in bright rim-light. Painterly brushwork in the style of premium
Magic: The Gathering card art, warm palette of crimson, gold and steel
gray against a bright sky, extreme low protective-angle composition,
landscape orientation (about 1600×1000px, wider than tall), no text, no
card frame, no border, no watermark
```

---

#### 6.4. Capitão de Formação

**Carta:** Infantaria (ATK 3 / HP 4 / custo 3) · **Estilo:** Padrão (+
Full Art opcional, ver 6.4b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a crimson-
and-gold formation captain in dynamic mid-stride motion-blur through a
line of soldiers at sunset, one arm thrust out in a sharp commanding
gesture, a visible shimmering wake of golden "resolve" trailing behind his
moving hand and rippling into the soldiers he passes, their postures
visibly straightening as the shimmer touches them. Orderly ranks
reorganize in his wake, dust kicked up by fast footwork. Warm low sunset
light throws his motion-blurred silhouette long across the field.
Painterly brushwork in the style of premium Magic: The Gathering card art,
warm palette of crimson, gold and steel gray with a magical golden motion
-trail accent, dynamic mid-motion composition, medium-wide shot fully
visible, landscape orientation (about 1600×1000px, wider than tall), no
text, no card frame, no border, no watermark
```

---

#### 6.4b. Capitão de Formação — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of the same formation captain, but a
completely different, elevated command moment instead of moving through
the ranks: standing tall atop a rocky outcrop or broken siege-engine
wreck at dawn, both hands planted on his hips as he surveys the entire
battlefield spread out below him, mouth open mid-shout giving orders,
wind whipping his crimson cape out behind him. No shimmer effect here —
his authority comes from vantage and voice, not visible magic. Layered
depth composition: the captain sharp in the foreground filling most of
the vertical frame, the whole disciplined army arrayed in formation far
below in the midground, a wide dawn battlefield vista in the background.
Drifting morning mist crosses between the depth layers. Extremely detailed
rendering — engraved plate-and-mail armor, windswept cape fabric, sharp
specular highlights on polished steel and gold. Rich palette of dawn gold,
crimson and steel gray, powerful sense of overview and command, composition
designed to fill a tall card frame edge-to-edge with no empty margins at
top or bottom, no text, no card frame, no border, no watermark
```

---

#### 6.5. Batedor

**Carta:** Infantaria (ATK 1 / HP 2 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a light,
agile crimson-and-gold scout soldier sprinting at full tilt across a
narrow, weathered rope-and-plank bridge strung between two dark cliff
faces at night, minimal armor built for speed, one hand trailing along the
rope for balance, already glancing toward the far cliff where his next
position waits. Below the bridge, a black chasm drops away into nothing;
above, a clear star-filled night sky. Cold moonlight is the only light
source, throwing his running silhouette sharp against the pale rock.
Painterly brushwork in the style of premium Magic: The Gathering card art,
cool nocturnal palette of moonlit silver-blue with small warm accents on
his crimson cloak, dynamic diagonal action composition over a dizzying
drop, landscape orientation (about 1600×1000px, wider than tall), no text,
no card frame, no border, no watermark
```

---

#### 6.6. Lanceiro de Controle

**Carta:** Infantaria (ATK 3 / HP 2 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a crimson-
and-gold spearman braced alone in the exact center of a narrow mountain
pass, a long spear held horizontally at chest height spanning almost the
full width of the passage between two sheer rock walls — a literal
chokepoint made visible. A single enemy soldier is pressed back hard
against the spear's tip at the very edge of the frame, unable to pass. Cold
wind-blown snow drifts through the pass, dramatic side lighting from a low
sun breaking between the peaks. Painterly brushwork in the style of
premium Magic: The Gathering card art, warm palette of crimson, gold and
steel gray against cold gray-white mountain rock, tight symmetrical
chokepoint composition, landscape orientation (about 1600×1000px, wider
than tall), no text, no card frame, no border, no watermark
```

---

#### 6.7. Cavaleiro Tático

**Carta:** Cavalaria (ATK 4 / HP 4 / custo 3) · **Estilo:** Padrão (+ Full
Art opcional, ver 6.7b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a mounted
tactical knight in crimson-and-gold armor captured mid-wheel on an open
golden-hour plain, his warhorse's sharp turn carving a wide, clearly
visible arc of churned-up dust and torn grass across the ground behind
them — the repositioning itself rendered as a visible path, not just
implied motion. A disciplined cavalry line waits in formation at the arc's
far end, exactly where he's headed. Long warm shadows stretch across the
plain from the low sun. Painterly brushwork in the style of premium Magic:
The Gathering card art, warm palette of crimson, gold and steel gray,
dynamic wide-arc turning composition, cinematic medium-wide shot with
horse and rider fully visible, landscape orientation (about 1600×1000px,
wider than tall), no text, no card frame, no border, no watermark
```

---

#### 6.7b. Cavaleiro Tático — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of the same mounted tactical knight in
crimson-and-gold armor, but a completely different action than his open-
plain wheeling turn: his warhorse fully airborne, leaping clean over a
smashed and burning supply wagon barricade in the middle of a chaotic
battlefield, wreckage and scattered crates strewn on both sides, the
knight crouched low over the horse's neck with sword sheathed, both hands
gripping the reins tight for the landing. Layered depth composition: horse
and rider sharp in mid-leap in the foreground filling most of the vertical
frame, the wrecked barricade and battle chaos in the midground, smoke and
a hazy battlefield in the background. Sparks and drifting embers from the
burning wagon cross between the depth layers. Extremely detailed rendering
— engraved plate armor, individual mane strands caught in the leap, sharp
specular highlights on polished steel and gold. Rich palette of crimson,
gold and steel gray lit by fire-orange from the wreckage, powerful sense
of daring and obstacle-crossing, composition designed to fill a tall card
frame edge-to-edge with no empty margins at top or bottom, no text, no
card frame, no border, no watermark
```

---

#### 6.8. Veterano de Guerra

**Carta:** Infantaria (ATK 4 / HP 3 / custo 3) · **Estilo:** Padrão (+
Full Art opcional, ver 6.8b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting shot in cross-
section profile through a layered defensive trench system, showing three
distinct trench lines stacked in depth — a grizzled war veteran in
battle-scarred crimson-and-gold armor stands alone and unshaken in the
third, deepest trench line while the two lines ahead of him are visibly
emptier and more battered, debris and arrows raining down past him
unheeded. A notched sword held low and ready, weathered confident
expression. Dust and faint smoke drift across the whole cross-section.
Painterly brushwork in the style of premium Magic: The Gathering card art,
warm palette of crimson, gold and steel gray, unusual layered cross-
section composition that makes the "third line" concept literal, landscape
orientation (about 1600×1000px, wider than tall), no text, no card frame,
no border, no watermark
```

---

#### 6.8b. Veterano de Guerra — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Legendary hero portrait, ultra-epic Magic: The Gathering-quality fantasy
trading-card full-art illustration of the same grizzled war veteran in
battle-scarred crimson-and-gold armor, but a completely different, quiet
character moment instead of the trench line: seated on an overturned
crate beside a low campfire at night, armor half-removed and resting
beside him, a group of much younger soldiers sitting cross-legged around
the fire listening intently as he gestures with a scarred hand mid-story,
an old notched sword laid flat across his knees. Firelight is the only
light source, warm orange flickering across every attentive young face.
Layered depth composition: the veteran sharp in the foreground filling
most of the vertical frame, the ring of listening soldiers around the
fire in the midground, dark tents and a starry night sky in the
background. Drifting sparks from the fire cross between the depth layers.
Extremely detailed rendering — battle-worn scratches and dents in the
resting armor, weathered scarred face lit warmly from below, individual
sparks rising from the campfire. Rich palette of firelight orange against
deep night blue, powerful sense of legacy and quiet mentorship rather than
combat, composition designed to fill a tall card frame edge-to-edge with
no empty margins at top or bottom, no text, no card frame, no border, no
watermark
```

---

### Táticas

#### 6.9. Reformar Linhas

**Carta:** Tática (custo 2) · **Estilo:** Padrão (+ Full Art opcional, ver
6.9b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting shot from a
steep tilted-down tactical angle over a battlefield, three crimson-and-
gold soldiers each mid-motion shifting to a new position at once as if a
giant unseen hand were rearranging pieces on a board, glowing golden
tactical lines connecting their start and end points like a living map
overlaid on the real battlefield, banners and orderly ranks around them
holding still while these three move. Warm dusty daylight. Painterly
brushwork in the style of premium Magic: The Gathering card art, warm
palette of crimson, gold and steel gray with glowing golden tactical-line
overlay, dynamic steep-angle composition with all three soldiers and their
paths visible, landscape orientation (about 1600×1000px, wider than
tall), no text, no card frame, no border, no watermark
```

---

#### 6.9b. Reformar Linhas — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Ultra-epic Magic: The Gathering-quality fantasy trading-card full-art
illustration of an entire army reforming at once, a true aerial bird's-
eye view directly down onto the whole battlefield formation, tall
vertical portrait filling the entire frame — unlike the close three-
soldier moment elsewhere in this set, this shows dozens of tiny crimson-
and-gold soldiers across the whole field shifting into a new shape
together, glowing golden tactical lines connecting entire blocks of troops
like a massive living diagram seen from directly above, the formation
visibly reshaping from a broken line into a solid wedge. Layered depth
composition: the nearest reforming ranks sharp in the foreground filling
the lower part of the frame, the glowing tactical-line network spanning
the midground, the full battlefield with its rivers, roads and enemy
lines tiny in the distant background far below. Drifting cloud shadow
crosses between the depth layers. Extremely detailed rendering — tiny
individually posed soldier figures, glowing line segments, terrain texture
seen from above. Rich palette of crimson, gold and steel gray with a
network of golden light, powerful sense of grand strategy and scale,
composition designed to fill a tall card frame edge-to-edge with no empty
margins at top or bottom, no text, no card frame, no border, no watermark
```

---

#### 6.10. Avanço Coordenado

**Carta:** Tática (custo 2) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a tight
line of crimson-and-gold infantry advancing together in perfect lockstep
through a shallow river ford at night, torches held high throwing warm
light and long reflections across the dark water, a faint golden glow of
gathering momentum building around their weapons and shields as they
march forward as one unbroken line. Splashing water catches the torchlight
around their boots. Painterly brushwork in the style of premium Magic:
The Gathering card art, warm torch-gold against cool night-water blue,
wide symmetrical advancing-line composition, landscape orientation (about
1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

#### 6.11. Reposicionamento Rápido

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a crimson-
and-gold soldier delivering a sharp shield-bash that sends an enemy
soldier stumbling sideways off the edge of a narrow wooden plank bridge
over a rocky ravine, the enemy's arms windmilling for balance right at
the plank's edge, dust and splinters kicked up at the point of impact.
The danger of the drop below adds real stakes to what would otherwise be
a simple shove. Dramatic midday light. Painterly brushwork in the style of
premium Magic: The Gathering card art, warm palette of crimson, gold and
steel gray against a rocky ravine backdrop, dynamic edge-of-danger
composition, medium shot with both figures visible, landscape orientation
(about 1600×1000px, wider than tall), no text, no card frame, no border,
no watermark
```

---

#### 6.12. Linha Fechada

**Carta:** Tática (custo 2) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting, an extreme
close side-profile shot of a tight crimson-and-gold shield wall at the
exact instant a heavy boulder slams into the interlocked shields, sparks
and splinters exploding outward from the point of impact, the shields
visibly flexing but holding, soldiers braced hard behind them with gritted
teeth. Dust and debris fill the air around the impact. Dramatic side
lighting catches the moment of collision. Painterly brushwork in the style
of premium Magic: The Gathering card art, warm palette of crimson, gold
and steel gray with a bright flash of impact sparks, extreme close-up
impact composition, landscape orientation (about 1600×1000px, wider than
tall), no text, no card frame, no border, no watermark
```

---

#### 6.13. Ordem de Retirada

**Carta:** Tática (custo 2) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a wounded
crimson-and-gold soldier being half-carried back across a foggy night
field by a comrade, a faint warm healing light trailing behind them like a
slow-fading comet tail across the mist, marking the path they've walked.
Other retreating soldiers with torches move in the same direction further
back, guiding the way to safety. Cold blue fog dominates the scene, cut
only by the warm trailing light and distant torches. Painterly brushwork
in the style of premium Magic: The Gathering card art, cool nocturnal
palette of fog-blue with a warm healing-light accent trail, atmospheric
wide retreat composition, landscape orientation (about 1600×1000px, wider
than tall), no text, no card frame, no border, no watermark
```

---

### Emboscadas

#### 6.14. Bloqueio Instantâneo

**Carta:** Emboscada (custo 2) · **Estilo:** Padrão · **Status:** pronto
pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting, an extreme
freeze-frame close-up of a crimson-and-gold soldier's shield intercepting
an incoming arrow just inches from a comrade's startled face behind him,
the arrowhead visibly splintering against the shield's rim, sparks and
wood fragments frozen mid-spray, both soldiers' expressions caught in that
exact instant of near-miss tension. Shallow depth of field blurs the
battlefield behind them into streaks of motion. Painterly brushwork in the
style of premium Magic: The Gathering card art, warm palette of crimson,
gold and steel gray with a bright flash at the point of impact, extreme
close-up freeze-frame composition, landscape orientation (about
1600×1000px, wider than tall), no text, no card frame, no border, no
watermark
```

---

#### 6.15. Contra-Manobra

**Carta:** Emboscada (custo 3) · **Estilo:** Padrão (+ Full Art opcional,
ver 6.15b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of two
crimson-and-gold soldiers trading positions in a blurred instant inside a
narrow ruined-corridor duel space — broken columns and rubble to either
side — dodging an incoming attack by swapping places at the last possible
moment, sharp motion-blur trails showing their swap, an enemy's blade
passing harmlessly through empty air exactly where one of them used to
stand. Shafts of light cut through gaps in the ruined ceiling above.
Painterly brushwork in the style of premium Magic: The Gathering card art,
warm palette of crimson, gold and steel gray against cool ruined-stone
shadow, dynamic tight-corridor swap composition, medium-wide shot with
both figures visible, landscape orientation (about 1600×1000px, wider
than tall), no text, no card frame, no border, no watermark
```

---

#### 6.15b. Contra-Manobra — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Ultra-epic Magic: The Gathering-quality fantasy trading-card full-art
illustration of the same swap-maneuver trick, but happening in the middle
of a huge chaotic open-field melee instead of an isolated ruined corridor:
tall vertical portrait filling the entire frame, two crimson-and-gold
soldiers blurring through each other's positions right in the thick of a
crowded clash of dozens of fighting soldiers, golden motion-trails
tracing their swap cutting clearly through the visual noise of the battle
around them, an enemy blade passing harmlessly through the empty air where
one of them used to stand. Layered depth composition: the two swapping
soldiers and their glowing trails sharp in the foreground, a dense mass of
clashing soldiers filling the midground on all sides, a smoky battlefield
sky in the background. Drifting dust and sparks cross between the depth
layers. Extremely detailed rendering — engraved armor, individual motion-
trail particles, varied armor and poses in the surrounding melee crowd.
Rich palette of crimson, gold and steel gray, powerful sense of a
precision trick executed amid total chaos, composition designed to fill a
tall card frame edge-to-edge with no empty margins at top or bottom, no
text, no card frame, no border, no watermark
```

---

#### 6.16. Formação Quebrada

**Carta:** Emboscada (custo 2) · **Estilo:** Padrão · **Status:** pronto
pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a chaotic
vortex moment: an enemy soldier caught fully airborne and disoriented,
tumbling sideways away from a sudden burst of force at the center of the
frame, debris, dust and loose equipment spiraling outward around him in
every direction like a small explosion, his formation-mates behind him
frozen mid-step in confusion as the order breaks apart. A crimson-and-gold
soldier's silhouette is barely visible at the very edge of the frame
having triggered the disruption. Dramatic radial motion-blur emphasizes
the chaos. Painterly brushwork in the style of premium Magic: The
Gathering card art, high-energy palette of dust ochre, crimson and steel
gray, dynamic radial chaos composition unlike any other card in this set,
landscape orientation (about 1600×1000px, wider than tall), no text, no
card frame, no border, no watermark
```

---

### Terrenos

#### 6.17. Fortaleza de Pedra

**Carta:** Terreno (custo 3) · **Estilo:** Padrão (+ Full Art opcional,
ver 6.17b) · **Status:** pronto pra gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting shot in cutaway
cross-section style through a sturdy fortified stone rampart, showing its
thick weathered core and the row of soldiers sheltering safely in its lee,
arrows and spear-tips visibly stuck harmlessly in the rampart's outer
stone face like a pincushion — visual proof of the protection it provides.
A crimson-and-gold banner mounted atop catches the wind. Warm dusty
daylight on the exposed side, cool shadow in the sheltered lee where the
soldiers rest. Painterly brushwork in the style of premium Magic: The
Gathering card art, warm palette of stone gray, crimson and gold, unusual
cutaway cross-section composition, wide shot with the rampart and
sheltered soldiers both visible, landscape orientation (about 1600×1000px,
wider than tall), no text, no card frame, no border, no watermark
```

---

#### 6.17b. Fortaleza de Pedra — Full Art

**Carta:** a mesma acima · **Estilo:** Full Art · **Status:** pronto pra
gerar

```
TALL VERTICAL PORTRAIT IMAGE, aspect ratio 0.72:1 (width:height), approx 1024x1424px or 900x1250px — noticeably taller than wide. Ultra-epic Magic: The Gathering-quality fantasy trading-card full-art
illustration of the same stone rampart under active night siege rather
than the calm daytime cutaway view elsewhere in this set: tall vertical
portrait filling the entire frame, seen from outside and below at night,
torchlight and burning arrows streaking through the dark sky toward the
battlements, defenders atop the wall silhouetted against the torchlight as
they pour a cauldron of boiling oil down over the parapet, the crimson-
and-gold banner lit orange by the chaos below. Layered depth composition:
the base of the rampart and attacking siege ladders sharp in the
foreground filling the lower part of the frame, the defenders and pouring
oil along the battlements in the midground, a smoke-and-fire-lit night sky
in the background. Sparks and burning debris cross between the depth
layers. Extremely detailed rendering — weathered stone texture lit by
firelight, individual streaks of flaming arrows, the oil's glinting
surface as it falls. Rich palette of deep night blue-black cut by intense
fire orange, powerful sense of active desperate defense rather than quiet
protection, composition designed to fill a tall card frame edge-to-edge
with no empty margins at top or bottom, no text, no card frame, no border,
no watermark
```

---

#### 6.18. Pântano Maldito

**Carta:** Terreno (custo 2) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
WIDE LANDSCAPE IMAGE, aspect ratio approx 16:10 (width:height), approx 1600x1000px or 1280x800px — noticeably wider than tall, NOT a vertical/portrait image. Epic Magic: The Gathering-quality fantasy digital painting of a cursed,
murky swampland at twilight bogging down a row of enemy soldiers standing
in it, withered blackened plants and thick low-hanging fog, pale sickly
green will-o'-the-wisp lights floating just above the mire — the only
light source, deliberately eerie and "wrong" compared to every other warm
-lit card in this set — their glow reflected in the black standing water
as the soldiers' boots sink deeper. Dim overcast twilight sky above.
Painterly brushwork in the style of premium Magic: The Gathering card art,
unsettling palette of murky green witch-light, dark mud brown and pale
sickly mist, wide shot with the swamp and mired soldiers visible, landscape
orientation (about 1600×1000px, wider than tall), no text, no card frame,
no border, no watermark
```
