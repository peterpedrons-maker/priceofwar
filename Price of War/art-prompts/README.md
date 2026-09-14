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

Os prompts abaixo estão em inglês (é o que os geradores de imagem
respondem melhor), com as notas em português.

---

## 1. Comandante Aurelion, Mestre da Formação — Padrão

**Carta:** General do Deck Capitão (ATK 0 / HP 20 / custo 0)
**Estilo:** Padrão · **Status:** pronto pra gerar

```
Epic fantasy digital painting of a battle-hardened human army commander in
ornate gold-trimmed plate armor, standing on a stone battlefield rampart at
dawn, one gauntleted hand raised as if directing troop formations below, a
tattered crimson-and-gold banner whipping in the wind behind him, storm
clouds parting to reveal warm golden light breaking through, dramatic rim
lighting, painterly brushwork in the style of a premium collectible card
game (Hearthstone / Legends of Runeterra quality), rich warm color palette
of gold, crimson and steel blue, medium-wide shot with the commander
centered and fully visible from head to boots, cinematic composition,
landscape orientation, no text, no card frame, no border, no watermark
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
Ultra-detailed fantasy trading card illustration of a battle-hardened human
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
Legendary hero portrait, ultra-epic fantasy trading-card full-art
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
cosmética no jogo, não muda o prompt da arte em si. As duas exceções desse
deck são o **General** e a **Relíquia**, que são Full Art (moldura
dourada, janela grande retrato ~0,72:1, ver item 3 acima) — marcadas como
tal em cada entrada.

## Deck Cardeal Pedro

**Identidade visual do deck** (pra manter consistência entre as 31
cartas): uma ordem militar-religiosa cruzada — branco, dourado e
vermelho-carmesim, luz quente e dourada de caráter "sagrado" (não azulada/
mágica), cruzes e símbolos de fé, cavaleiros com mantos sobre a armadura no
estilo Hospitalário/Templário. Onde fizer sentido, os prompts abaixo pedem
essa mesma paleta e iconografia pra tudo ficar com cara do mesmo baralho.

### General

#### 5.1. Cardeal Pedro

**Carta:** General (ATK 0 / HP 20 / custo 0) · **Estilo:** Full Art ·
**Status:** pronto pra gerar

```
Legendary hero portrait, ultra-epic fantasy trading-card full-art
illustration of an elderly but powerfully built warrior-cardinal, tall
vertical portrait composition filling the entire frame from head to
boots, dynamic low-angle hero shot looking slightly upward at the
subject. He wears ornate white-and-gold clerical plate armor fused with a
priest's vestments — a long white mantle trimmed in gold over the
breastplate, a tall ceremonial gold mitre-shaped helm, a heavy jeweled
cross hanging on his chest. In one hand he grips a massive gold warhammer
shaped like an inverted cross planted into the ground; the other hand is
raised, palm open, radiating warm healing golden light that spills
downward like sunlight through his fingers. His expression is serene but
resolute — a healer and a warrior at once. Layered depth composition: the
cardinal sharp and in focus filling most of the frame, a blurred row of
white-and-gold banners and kneeling wounded soldiers being healed by his
light in the midground, and a glowing cathedral-like ruin silhouetted
against a golden dusk sky in the background. Drifting motes of holy light
cross between the depth layers. Extremely detailed rendering — engraved
filigree in the armor, embroidered gold thread in the mantle, a long white
beard, soft specular highlights on polished gold, painted in the
hyper-detailed epic style of premium full-art trading cards (Pokémon TCG
full-art / Legends of Runeterra legendary-tier quality), rich warm palette
of white, gold and deep crimson, powerful sense of scale and reverence,
tall vertical portrait aspect ratio (approximately 0.72:1 width to
height, noticeably taller than wide), composition designed to fill a tall
card frame edge-to-edge with no empty margins at top or bottom, no text,
no card frame, no border, no watermark
```

**Notas:** contraponto direto do Comandante Aurelion (Deck Capitão) — ele é
força/formação militar pura, o Cardeal Pedro é fé/cura com poder militar
por trás dela; por isso a luz dourada saindo da mão em vez de uma arma
erguida como pose principal.

---

### Relíquia

#### 5.2. Cálice da Vida

**Carta:** Relíquia (ATK 0 / HP 5 / custo 3) · **Estilo:** Full Art ·
**Status:** pronto pra gerar

```
Legendary relic portrait, ultra-epic fantasy trading-card full-art
illustration of an ornate golden chalice resting on a carved stone altar,
tall vertical portrait composition filling the entire frame. The chalice
overflows with glowing liquid light instead of wine — warm golden-white
radiance spilling gently down its sides and pooling on the altar like
liquid sunlight, faint wisps of holy light rising from the surface like
steam. The cup itself is heavily engraved with cross motifs and filigree,
inlaid with small red gemstones. Layered depth composition: the chalice
sharp and in focus filling the lower two-thirds of the frame, soft
out-of-focus stone archways and hanging white-and-gold banners in the
midground, and tall stained-glass-like windows glowing with warm light in
the background. Drifting motes of golden light float upward through the
whole scene. Extremely detailed engraved metal texture, reflective
specular highlights on the gold, painted in the hyper-detailed epic style
of premium full-art trading cards (Pokémon TCG full-art / Legends of
Runeterra legendary-tier quality), rich warm palette of gold, white and
deep crimson, powerful sense of reverence and sacred power, tall vertical
portrait aspect ratio (approximately 0.72:1 width to height), composition
designed to fill a tall card frame edge-to-edge with no empty margins at
top or bottom, no characters, no text, no card frame, no border, no
watermark
```

**Notas:** é uma relíquia-objeto, não um personagem — segue a mesma lógica
do Estandarte da Legião (Deck Capitão), que também é Full Art sem
figura central, só o objeto em destaque.

---

### Infantaria

#### 5.3. Multidão de Fiéis

**Carta:** Infantaria (ATK 0 / HP 3 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a small huddled group of devout peasant
pilgrims thrown into a holy war, wearing simple travel-worn robes rather
than armor, clutching wooden holy symbols, walking staffs and improvised
farm-tool weapons, faces showing fear mixed with fierce faith, standing
together shoulder to shoulder on a battlefield at dawn, warm golden light
breaking through clouds behind them, painterly brushwork in the style of a
premium collectible card game (Hearthstone / Legends of Runeterra
quality), warm palette of cream, gold and dusty crimson, medium-wide shot
with the whole group visible, cinematic composition, landscape
orientation, no text, no card frame, no border, no watermark
```

---

#### 5.4. Comerciante das Cruzadas

**Carta:** Infantaria (ATK 1 / HP 1 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a shrewd crusade quartermaster-merchant,
practical leather and cloth robes with a small cross pendant, a satchel of
rolled maps and scrolls slung over one shoulder, holding up two cards or
scrolls to compare them with a calculating half-smile, standing at the
edge of a supply camp with tents and crates behind him, warm dawn light,
painterly brushwork in the style of a premium collectible card game
(Hearthstone / Legends of Runeterra quality), warm palette of gold, cream
and worn leather brown, medium shot fully visible, cinematic composition,
landscape orientation, no text, no card frame, no border, no watermark
```

---

#### 5.5. Espião Sabotador

**Carta:** Infantaria (ATK 1 / HP 2 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a hooded crusade spy and saboteur,
dark practical cloth robes over light armor with a hidden cross pendant
just visible at the collar, crouched low behind battlefield cover, one
hand raised in a silent "wait" signal, a curved dagger held ready in the
other, sharp watchful eyes scanning for enemy ambushes, dim warm torchlight
from off-frame, painterly brushwork in the style of a premium collectible
card game (Hearthstone / Legends of Runeterra quality), muted palette of
charcoal, dark crimson and gold accents, medium shot fully visible,
cinematic composition, landscape orientation, no text, no card frame, no
border, no watermark
```

---

#### 5.6. Soldado Fanático

**Carta:** Infantaria (ATK 1 / HP 2 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a wild-eyed religious zealot soldier
charging into battle, simple mismatched armor over crusade robes, eyes
blazing with fanatical fervor, swinging a heavy spiked mace overhead,
mouth open mid-battle-cry, dust and embers kicked up around his feet, warm
dramatic backlighting, painterly brushwork in the style of a premium
collectible card game (Hearthstone / Legends of Runeterra quality), warm
palette of crimson, gold and soot-black, dynamic medium shot fully
visible, cinematic composition, landscape orientation, no text, no card
frame, no border, no watermark
```

---

#### 5.7. Aprendiz de Infantaria

**Carta:** Infantaria (ATK 0 / HP 2 / custo 1) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a very young trainee crusader soldier,
ill-fitting hand-me-down armor a size too big, gripping a sword with both
hands in an earnest but slightly awkward stance, determined nervous
expression, an older soldier's cloak draped over his shoulders, standing
at the edge of a training yard at dawn, warm soft light, painterly
brushwork in the style of a premium collectible card game (Hearthstone /
Legends of Runeterra quality), warm palette of gold, cream and soft steel
blue, medium shot fully visible, cinematic composition, landscape
orientation, no text, no card frame, no border, no watermark
```

---

#### 5.8. Vigia de Mantimentos

**Carta:** Infantaria (ATK 2 / HP 3 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of an alert crusade quartermaster-guard
standing watch over stacked supply crates and barrels marked with a cross
sigil, practical leather armor, spear held ready at his side, scanning the
horizon at dusk, torchlight flickering nearby, painterly brushwork in the
style of a premium collectible card game (Hearthstone / Legends of
Runeterra quality), warm palette of amber, gold and worn wood brown,
medium shot fully visible, cinematic composition, landscape orientation,
no text, no card frame, no border, no watermark
```

---

#### 5.9. Infantaria Treinada

**Carta:** Infantaria (ATK 3 / HP 5 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a disciplined veteran crusader foot
soldier in matching white-and-gold livery over solid plate armor, a tall
kite shield bearing a red cross and a spear held at a steady guard stance,
calm confident veteran expression, standing in formation on a battlefield
at dawn, warm golden light, painterly brushwork in the style of a premium
collectible card game (Hearthstone / Legends of Runeterra quality), warm
palette of white, gold and crimson, medium shot fully visible, cinematic
composition, landscape orientation, no text, no card frame, no border, no
watermark
```

---

### Cavalaria

#### 5.10. Jorge, o Lanceiro

**Carta:** Cavalaria (ATK 4 / HP 6 / custo 3) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a heroic mounted knight lancer inspired
by Saint George, gleaming white-and-gold plate armor, riding a powerful
white warhorse at full charge, a long lance couched and leveled, a white
cape marked with a red cross billowing behind him, dynamic diagonal
charging composition, dust kicked up by the horse's hooves, dramatic warm
backlighting, painterly brushwork in the style of a premium collectible
card game (Hearthstone / Legends of Runeterra quality), warm palette of
white, gold and crimson, dynamic medium-wide shot with horse and rider
fully visible, cinematic composition, landscape orientation, no text, no
card frame, no border, no watermark
```

---

#### 5.11. Hospitalário

**Carta:** Cavalaria (ATK 2 / HP 4 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a mounted knight-healer inspired by the
Knights Hospitaller, white mantle bearing a red cross worn over plate
armor, riding a calm white horse, one hand holding the reins and a lance,
the other hand glowing faintly with soft healing light reaching toward an
unseen wounded ally off-frame, gentle compassionate expression contrasting
with his armor, warm dawn light, painterly brushwork in the style of a
premium collectible card game (Hearthstone / Legends of Runeterra
quality), warm palette of white, gold and soft red, medium shot with horse
and rider fully visible, cinematic composition, landscape orientation, no
text, no card frame, no border, no watermark
```

---

#### 5.12. Nobre Religioso

**Carta:** Cavalaria (ATK 4 / HP 5 / custo 3) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a richly armored noble crusader lord on
horseback, ornate gold-trimmed plate armor with elaborate religious
heraldry on his tabard, one arm raised in a commanding gesture rallying a
small group of loyal soldiers who kneel and rise around his horse as if
just called into service, banner-bearers flanking him, warm golden light,
painterly brushwork in the style of a premium collectible card game
(Hearthstone / Legends of Runeterra quality), rich palette of gold, white
and crimson, dynamic medium-wide shot with horse and rider fully visible,
cinematic composition, landscape orientation, no text, no card frame, no
border, no watermark
```

---

#### 5.13. Cavaleiro Branco

**Carta:** Cavalaria (ATK 5 / HP 7 / custo 3) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of the archetypal White Knight, a powerful
mounted knight in gleaming full white-and-gold plate armor with almost no
ornamentation beyond a simple engraved cross, riding a strong white
warhorse, sword raised high and wreathed in a faint holy white-gold glow,
heroic confident pose, warm dramatic backlighting silhouetting horse and
rider, painterly brushwork in the style of a premium collectible card game
(Hearthstone / Legends of Runeterra quality), warm palette of white, gold
and pale crimson, dynamic medium-wide shot with horse and rider fully
visible, cinematic composition, landscape orientation, no text, no card
frame, no border, no watermark
```

---

#### 5.14. Líder de Esquadrão

**Carta:** Cavalaria (ATK 5 / HP 5 / custo 3) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a mounted crusader squad captain rallying
troops, gold-trimmed armor slightly battle-worn, raising a tall
white-and-gold banner high with one arm while a small group of infantry
and archers look up at him with renewed resolve nearby, warm golden late
afternoon light, painterly brushwork in the style of a premium collectible
card game (Hearthstone / Legends of Runeterra quality), warm palette of
gold, white and crimson, dynamic medium-wide shot with horse and rider
fully visible, cinematic composition, landscape orientation, no text, no
card frame, no border, no watermark
```

---

### Arqueiros

#### 5.15. Arqueiro Profissional

**Carta:** Arqueiro (ATK 1 / HP 4 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a highly skilled crusader crossbowman
mid-action, already reloading a second bolt with practiced speed just as
the first one flies off-frame, white-and-gold tabard over practical
leather armor, a full quiver of bolts at his hip, focused intense
expression, warm dawn light, painterly brushwork in the style of a premium
collectible card game (Hearthstone / Legends of Runeterra quality), warm
palette of gold, cream and steel gray, dynamic medium shot fully visible,
cinematic composition, landscape orientation, no text, no card frame, no
border, no watermark
```

---

#### 5.16. Atirador Influente

**Carta:** Arqueiro (ATK 1 / HP 3 / custo 2) · **Estilo:** Padrão ·
**Status:** pronto pra gerar

```
Epic fantasy digital painting of a veteran crusader archer with a weathered,
wise face and graying hair, worn but well-kept gear, standing with calm
composure while drawing his bow, a few younger soldiers visible in the
soft-focus background looking toward him with visible respect and
inspiration, warm late-afternoon light, painterly brushwork in the style
of a premium collectible card game (Hearthstone / Legends of Runeterra
quality), warm palette of amber, cream and steel gray, medium shot fully
visible, cinematic composition, landscape orientation, no text, no card
frame, no border, no watermark
```

---

### Táticas de dano

#### 5.17. Trabuco

**Carta:** Tática (custo 3) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a massive wooden trebuchet siege engine
mid-launch on a battlefield at dawn, its long arm whipping upward and
hurling a flaming payload high across the sky toward a distant enemy line,
crusader soldiers in white-and-gold operating the machine and bracing
against the recoil, dust and splinters flying, dramatic warm light,
painterly brushwork in the style of a premium collectible card game
(Hearthstone / Legends of Runeterra quality), warm palette of gold, wood
brown and fire orange, dynamic wide shot with the whole machine visible,
cinematic composition, landscape orientation, no text, no card frame, no
border, no watermark
```

---

#### 5.18. Catapulta

**Carta:** Tática (custo 2) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a compact wooden catapult siege engine
firing on a battlefield at dawn, its throwing arm caught mid-swing
launching a heavy stone payload toward one specific row of distant enemy
soldiers, crusader crew bracing the frame, dust kicked up around its base,
warm dramatic light, painterly brushwork in the style of a premium
collectible card game (Hearthstone / Legends of Runeterra quality), warm
palette of gold, wood brown and stone gray, dynamic wide shot with the
whole machine visible, cinematic composition, landscape orientation, no
text, no card frame, no border, no watermark
```

---

#### 5.19. Balesta

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a massive mounted ballista, a
giant crossbow on a wooden frame, firing a single enormous bolt with
precise force directly toward the viewer/a chosen distant target, crusader
crew bracing the frame after release, sparks and tension visible in the
taut ropes, dramatic warm light, painterly brushwork in the style of a
premium collectible card game (Hearthstone / Legends of Runeterra
quality), warm palette of gold, wood brown and steel gray, dynamic wide
shot with the whole machine visible, cinematic composition, landscape
orientation, no text, no card frame, no border, no watermark
```

---

### Armamentos (equipáveis)

#### 5.20. Armadura Pesada

**Carta:** Tática/Armamento (custo 1) · **Estilo:** Padrão · **Status:**
pronto pra gerar

```
Epic fantasy digital painting, a still-life illustration of an ornate suit
of heavy white-and-gold full plate armor standing empty on a wooden
display stand in a quiet armory, cuirass, gauntlets and a closed great
helm all catching warm torchlight, faint engraved cross motifs on the
breastplate, dust motes drifting in the light, painterly brushwork in the
style of a premium collectible card game (Hearthstone / Legends of
Runeterra quality), warm palette of white, gold and deep shadow, medium
shot with the full armor stand visible, cinematic composition, landscape
orientation, no text, no card frame, no border, no watermark
```

---

#### 5.21. Corcelete

**Carta:** Tática/Armamento (custo 1) · **Estilo:** Padrão · **Status:**
pronto pra gerar

```
Epic fantasy digital painting, a still-life illustration of a lighter
gold-trimmed steel breastplate resting on a wooden armor stand in a quiet
armory, simpler and less ornate than full plate, leather straps hanging
loose, warm torchlight catching the polished metal, painterly brushwork in
the style of a premium collectible card game (Hearthstone / Legends of
Runeterra quality), warm palette of steel gray, gold and warm brown,
medium shot with the breastplate stand visible, cinematic composition,
landscape orientation, no text, no card frame, no border, no watermark
```

---

#### 5.22. Flecha Envenenada

**Carta:** Tática/Armamento (custo 1) · **Estilo:** Padrão · **Status:**
pronto pra gerar

```
Epic fantasy digital painting, a close still-life illustration of a single
ornate crossbow bolt resting on a dark cloth, its tip coated in a sickly
glowing green poison that drips slowly, faint toxic vapor curling off the
tip, dramatic dim torchlight with the poison itself as a secondary light
source, painterly brushwork in the style of a premium collectible card
game (Hearthstone / Legends of Runeterra quality), palette of dark cloth
black, gold fletching and toxic green, close-up shot with the whole bolt
visible, cinematic composition, landscape orientation, no text, no card
frame, no border, no watermark
```

---

#### 5.23. Espada Longa

**Carta:** Tática/Armamento (custo 1) · **Estilo:** Padrão · **Status:**
pronto pra gerar

```
Epic fantasy digital painting, a close still-life illustration of an
ornate blessed longsword laid across a velvet cloth, a cross-shaped gold
hilt, the blade itself catching a faint warm holy glow along its edge,
intricate engravings near the guard, dramatic warm torchlight, painterly
brushwork in the style of a premium collectible card game (Hearthstone /
Legends of Runeterra quality), palette of steel, gold and deep crimson
velvet, close-up shot with the whole sword visible, cinematic composition,
landscape orientation, no text, no card frame, no border, no watermark
```

---

### Emboscadas

#### 5.24. Forças Secretas

**Carta:** Emboscada (custo 1) · **Estilo:** Padrão · **Status:** pronto
pra gerar

```
Epic fantasy digital painting of a small group of crusader reinforcements
hidden in wait behind rocks and fallen banners at the edge of a
battlefield, weapons drawn and ready, tense alert expressions, about to
spring out to reinforce an ally under attack, dim dawn light with a hint
of warm light breaking through where they're about to charge into,
painterly brushwork in the style of a premium collectible card game
(Hearthstone / Legends of Runeterra quality), warm palette of gold, dusty
brown and crimson, medium-wide shot with the group visible, cinematic
composition, landscape orientation, no text, no card frame, no border, no
watermark
```

---

### Táticas de utilidade

#### 5.25. O Soldado Retorna

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a fallen soldier's translucent
golden-white spirit rising from a simple battlefield grave marked by a
planted sword and helm, warm holy light lifting the ghostly figure back
upright as if returning to the ranks, other soldiers watching in reverent
awe nearby, dusk battlefield setting, painterly brushwork in the style of
a premium collectible card game (Hearthstone / Legends of Runeterra
quality), warm palette of gold, translucent white and deep dusk blue,
medium-wide shot fully visible, cinematic composition, landscape
orientation, no text, no card frame, no border, no watermark
```

---

#### 5.26. Busca pelo Santo Graal

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a lone knight reaching toward the
legendary Holy Grail, glowing with soft radiant light atop an ancient
stone pedestal inside a crumbling sunlit shrine, awe and reverence on his
face, dust motes catching the divine light, painterly brushwork in the
style of a premium collectible card game (Hearthstone / Legends of
Runeterra quality), warm palette of gold, cream stone and soft white
light, medium shot fully visible, cinematic composition, landscape
orientation, no text, no card frame, no border, no watermark
```

---

#### 5.27. Nova Tática

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a war council scene, a cardinal-commander
unrolling a fresh battle plan across a wooden map table inside a candlelit
command tent, a few crusader officers leaning in around him studying it
intently, warm candlelight, painterly brushwork in the style of a premium
collectible card game (Hearthstone / Legends of Runeterra quality), warm
palette of amber candlelight, parchment cream and gold, medium-wide shot
fully visible, cinematic composition, landscape orientation, no text, no
card frame, no border, no watermark
```

---

#### 5.28. Escolher a Dedo

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a crusader officer walking down a line of
standing soldiers at attention, stopping to point decisively at one
specific soldier who straightens up with pride at being chosen, warm dawn
light across the formation, painterly brushwork in the style of a premium
collectible card game (Hearthstone / Legends of Runeterra quality), warm
palette of gold, white and cream, medium-wide shot fully visible,
cinematic composition, landscape orientation, no text, no card frame, no
border, no watermark
```

---

#### 5.29. Escolher Tropas

**Carta:** Tática (custo 1) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a crusader captain inspecting a short
row of assembled soldiers standing at attention at dawn, closely comparing
two of them side by side with a critical eye, the rest waiting calmly at
attention nearby, warm morning light, painterly brushwork in the style of
a premium collectible card game (Hearthstone / Legends of Runeterra
quality), warm palette of gold, white and pale blue dawn sky, medium-wide
shot fully visible, cinematic composition, landscape orientation, no text,
no card frame, no border, no watermark
```

---

#### 5.30. Aumento de Impostos

**Carta:** Tática (custo 0) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a crusade treasurer counting stacks of
gold coins by candlelight at a small wooden desk inside a supply tent, an
open ledger and a heavy coin chest beside him, a small cross pendant
around his neck, warm candlelight, painterly brushwork in the style of a
premium collectible card game (Hearthstone / Legends of Runeterra
quality), warm palette of gold coin shine, candle amber and worn wood
brown, medium shot fully visible, cinematic composition, landscape
orientation, no text, no card frame, no border, no watermark
```

---

#### 5.31. Reunião de Fiéis

**Carta:** Tática (custo 2) · **Estilo:** Padrão · **Status:** pronto pra
gerar

```
Epic fantasy digital painting of a crowd of humble faithful pilgrims and
villagers converging toward a raised white-and-gold banner planted in a
town square, answering a call to arms, hands raised or clutching holy
symbols, mixed expressions of fear and determination, warm late-afternoon
light, painterly brushwork in the style of a premium collectible card game
(Hearthstone / Legends of Runeterra quality), warm palette of gold, cream
and dusty crimson, wide shot with the gathering crowd visible, cinematic
composition, landscape orientation, no text, no card frame, no border, no
watermark
```
