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

**Variedade de estilo pictórico:** cartas de TCG de verdade (Magic,
Yu-Gi-Oh) não usam sempre a mesma técnica de pintura — misturam realismo
quase fotográfico, ilustração estilizada/gráfica, pinceladas soltas e
impressionistas, e até elementos semi-abstratos (diagramas, símbolos
brilhantes) dentro de cenas realistas. Pra não ficar tudo com a mesma cara
de "pintura digital genérica", cada prompt abaixo pede deliberadamente uma
abordagem diferente, escolhida pelo clima da cena — por exemplo: cenas de
ação/ataque tendem a pedir estilização gráfica ousada — blocos de cor
chapada, traço confiante, composição dinâmica em diagonal e contraste de
luz quente-contra-fria — mais perto da energia de uma carta de monstro de
Yu-Gi-Oh (foi esse o estilo usado no Jorge, Lança Sagrada Padrão, a arte
que você achou que ficou com a cara mais profissional de carta de TCG até
agora, e que vale usar de referência sempre que uma cena de ação/investida
pedir esse tipo de energia); cenas noturnas/furtivas
pedem realismo cinematográfico de contraste forte; momentos
tranquilos/emocionais pedem pincelada solta e impressionista; cartas de
tática/magia/efeito abstrato pedem uma mistura semi-abstrata com
elementos gráficos/diagramáticos brilhantes junto da cena real; relíquias
e cartas antigas pedem um traço mais gráfico inspirado em manuscritos
iluminados e gravuras; still-lifes de equipamento pedem realismo macro
hiper-detalhado. Isso é uma camada a mais de variedade além do cenário/
ângulo de cada carta (já tratado acima).

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
illustration, a dramatic low three-quarter hero angle looking slightly up
at the subject so he dominates the frame — full body clearly visible and
instantly recognizable as the same commander from the Padrão portraits,
same ornate gold-trimmed plate armor and crimson-and-gold cape, but caught
in a completely different moment: standing with both arms thrown wide
instead of one fist raised, head tilted back, as a vast dome of golden
light bursts outward from his chest and armor in a single visible
shockwave-ring, the front rank of his soldiers just inside the dome's
edge visibly shielded — sparks and enemy arrows shown shattering
harmlessly against the light's outer surface right at the edge of the
frame, a literal, striking image of his protective aura rather than a
flat diagram or a generic glow. The force of the burst whips his cape
and the ground's dust violently outward. Storm clouds recoil and part
around the dome's upper edge, a shaft of gold breaking through directly
above him. Layered depth composition: the commander sharp, larger-than-
life and fully lit in the foreground, the shielded front rank and
shattering projectiles at the dome's edge in the midground, the
recoiling storm and distant fortress spires in the background. Extremely
detailed rendering — individual rivets and engraved filigree on the
armor, cape fabric caught mid-whip, sparks scattering off the light's
surface. Painted in the hyper-detailed epic style of premium full-art
trading cards (Pokémon TCG full-art / Legends of Runeterra legendary-tier
quality), rich saturated color palette of gold, crimson and stormy steel
blue, powerful sense of scale and raw protective force, composition
designed to fill a tall card frame edge-to-edge with no empty margins at
the top or bottom, no text, no card frame, no border, no watermark
```

**Notas:** a versão anterior deste prompt (punho erguido, capa enorme,
exército embaixo) acabava sendo essencialmente a MESMA pose do prompt
1/1b, só "mais épica" — mesmo ângulo de câmera, mesmo gesto, mesmo fundo,
só em corpo inteiro. Uma primeira tentativa de correção foi longe demais
pro outro lado: uma visão quase reta de cima deixava o próprio comandante
pequeno e quase irreconhecível, sem aquele impacto de "carta rara e linda"
que uma Full Art precisa ter. Reescrevi de novo com um meio-termo: ângulo
baixo dramático (olhando um pouco de baixo pra cima, não reto de cima),
corpo inteiro bem visível e claramente o mesmo personagem em armadura, mas
num gesto e momento diferentes dos dois prompts anteriores (braços abertos
liberando uma cúpula de luz, em vez de punho erguido ou mão apontando) —
mantém a habilidade passiva dele (aliados adjacentes tomam -1 de dano)
visualizada de forma mais abstrata (uma cúpula literal de luz protetora,
com flechas se estilhaçando nela) sem sacrificar o quanto a imagem
precisa ser bonita/épica por si só.



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
usado 4 vezes · **Estilo:** elemento/ícone de UI · **Status:** substituído
— ver 4e/4f/4g/4h logo abaixo

O menu foi redesenhado em cima de uma referência nova (mockup gerado por
outra IA, ver 4e abaixo) trocando os 4 botões de placa lisa por cards
maiores com arte de fundo própria por trás de cada um — esse plaque único
reaproveitado 4x não é mais usado (o componente `MenuButton` que o
desenhava foi removido de `App.tsx`). Prompt fica registrado aqui só como
histórico.

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

## 4e–4m. Menu principal — artes entregues

**Status:** entregue e integrada (`MainMenu` em `src/App.tsx`). Substitui os antigos
4e (Campanha), 4f (Partida Rápida), 4g (Meu Deck), 4h (Multijogador), 4i/4j
(pílulas de Coroas e de perfil), 4k/4l (molduras larga e compacta) e 4m (Loja).

**Layout final:** 4 botões do mesmo tamanho, empilhados, todos em 4:1
(1600×400): **Desafios**, **Online**, **Editar Deck**, **Loja**, mais uma
fileira de 4 ícones pequenos embaixo (Config., Tutoriais, Ranking, Som). Não
existe mais "Partida Rápida": Desafios abre o seletor de deck e inicia a
partida contra a IA (hoje o único modo em que o adversário joga). Online,
Editar Deck e Loja ainda abrem um aviso "em breve".

| Arquivo em `src/assets/` | O que é |
|---|---|
| `menu-card-desafios.webp` | mesa de guerra com mapa e figuras de comandantes |
| `menu-card-online.webp` | dois comandantes frente a frente numa ponte |
| `menu-card-editar-deck.webp` | cartas sobre uma mesa de madeira, com vela |
| `menu-card-loja.webp` | baú com pacotes lacrados, moedas e ametistas |
| `ui-frame-menu-card.webp` | moldura 4:1 com a janela central transparente |
| `ui-pill-coroas.webp` | container da pílula de Coroas (encaixe da coroa à esquerda) |
| `ui-pill-perfil.webp` | container do perfil (encaixe do avatar, faixa do nome, trilho de XP) |
| `ui-icon-button.webp` | placa quadrada dos ícones pequenos |
| `ui-icon-config/tutoriais/ranking/som.webp` | os 4 ícones, recortados da folha |

**Como foram recortados** (a IA de imagem não gera fundo transparente e devolveu
cinza chapado em JPG): flood fill do cinza a partir da borda, mais os vãos
fechados nos ícones (engrenagem, alças do troféu, espiral da corneta) e, na
moldura, só a janela central; depois limpeza de ruído, erosão de 1px e
suavização da borda, e recoloração da franja com a cor do interior para não
sobrar halo cinza. Os quatro banners dos botões não tinham cinza (só foram
convertidos e reduzidos a 1600 px de largura).

**Observações:**
- `menu-card-editar-deck.webp`: as cartas na imagem foram inventadas pela IA
  (nomes como "Griffon", texto embaralhado), não são cartas reais do jogo. No
  menu elas ficam pequenas e atrás do degradê de leitura, então não aparece
  como problema; se um dia incomodar, o plano B é gerar só a mesa com a vela e
  compor as cartas reais em código por cima.
- `ui-icon-tutoriais.webp`: a página do livro tem texto falso pintado; ilegível
  no tamanho usado (28 px).
- Terreno ainda não tem moldura Full Art própria (usa a prateada da Tática).

<details>
<summary>Prompts finais usados (para regenerar alguma arte)</summary>

Todos os banners: 4:1, terço esquerdo escuro e vazio (o ícone/título ficam ali).

**Desafios**
```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio 4:1 (width:height), approx 1600x400px, very wide and short, a thin horizontal banner, NOT a square or portrait image. Epic painterly digital illustration for a game menu button background: a candlelit war-council table seen from a low angle, an aged map of a besieged kingdom spread across it, a row of carved wooden commander figurines standing on the map facing the viewer, each wearing different heraldry (crimson lion, steel-blue eagle, black wolf, golden sun), small war banners planted in the map, a glowing red wax seal, a dark torchlit tent interior fading into shadow behind. Same painterly premium fantasy key-art style as a League of Legends / Total War loading screen, warm palette of amber candlelight, crimson, gold and deep shadow. Composition pushed toward the right two-thirds of the frame, leaving the left third and the top and bottom edges dark and uncluttered, since UI text and an icon sit on top of them in code. No text, no letters on the map, no UI, no watermark, no logo, wide banner orientation (1600x400, 4:1)
```

**Online**
```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio 4:1 (width:height), approx 1600x400px, very wide and short, a thin horizontal banner, NOT a square or portrait image. Epic painterly digital illustration for a game menu button background: two armored commanders facing each other across a long stone bridge at dusk, one in crimson-and-gold heraldry, the other in steel-blue-and-silver heraldry, each with their own banner planted behind them, swords planted point-down in the ground in front of them, a faint bright spark of light hanging in the air between the two, hazy battlefield stretching away into the distance. Same painterly premium fantasy key-art style as a League of Legends / Total War loading screen, warm crimson-gold on one side and cool steel-blue on the other, united by a dusk-gold sky. Composition pushed toward the right two-thirds of the frame, leaving the left third and the top and bottom edges dark and uncluttered, since UI text and an icon sit on top of them in code. No text, no UI, no watermark, no logo, wide banner orientation (1600x400, 4:1)
```

**Editar Deck** (anexar 3-4 cartas reais do jogo como referência, de cores diferentes)
```
Use the attached reference images as the EXACT card design. Every card in the scene must reproduce the same layout as the references: an ornate winged metal frame with a title bar at the top with a round coin badge at its right end, the illustration filling the whole card, and a translucent text panel over the lower part of the art. The frame comes in three colors in the references (red-and-gold, silver, champagne gold); use those three and mix them in the row. Some frames have shield-shaped stat badges at the bottom corners and some have only a small emblem in the bottom right corner; copy each one exactly as shown, do not add or remove badges. Do not invent a different card design, and do not draw ordinary playing cards, suits, pips or numbers. The illustrations inside the cards may differ from each other (medieval fantasy warriors, banners, fortresses), but the frame and layout must match the references exactly. WIDE LANDSCAPE BANNER IMAGE, aspect ratio 4:1 (width:height), approx 1600x400px, very wide and short, NOT a square or portrait image. Scene: five of these cards laid out in a slightly overlapping horizontal row on a dark wooden table, seen from a low angle so the row reads as a wide strip (the row may be cropped by the top and bottom edges), one lit candle in an iron holder at the right edge casting warm light and soft shadows across the cards. Hyperreal macro product-photography realism, warm palette of candlelight amber, gold and dark wood brown. Cards placed in the right two-thirds of the frame, leaving the left third in soft dark shadow and uncluttered, since UI text and an icon sit on top of it in code. No text outside the cards, no UI, no watermark, wide banner orientation (1600x400, 4:1)
```

**Loja**
```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio 4:1 (width:height), approx 1600x400px, very wide and short, a thin horizontal banner, NOT a square or portrait image. Hyperreal macro still-life illustration of an open wooden merchant's chest overflowing with treasure: several small sealed card packs made of crimson parchment tied with gold ribbon and closed with gold wax seals stamped with a rearing lion, a pile of loose gold coins, and two or three faceted amethyst-purple gems spilling out alongside them, warm lantern light from just outside the frame catching the gold and gems. Hyperreal macro product-photography realism, every material rendered with tack-sharp physically-based detail, warm palette of lantern amber, gold coin shine and a cool purple glint off the gems. Composition pushed toward the right two-thirds of the frame, leaving the left third and the top and bottom edges dark and uncluttered, since UI text and an icon sit on top of them in code. No text, no UI, no watermark, wide banner orientation (1600x400, 4:1)
```

**Moldura dos botões** (janela central cinza, removida depois)
```
Top-down-neutral game UI illustration of a single ornate rectangular picture-frame border, aged bronze and gold with engraved corner brackets, rivets and a thin rope-and-vine trim running along the inner and outer edge of the frame. The frame's center is a large, plain, flat solid mid-gray rectangular window, completely empty, no texture, no gradient, representing where a background image will show through once composited in code; only the border itself should have any detail or color. Painterly medieval-fantasy game style (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading on the bronze and gold border only, no text, no watermark, wide landscape frame composition, roughly 4:1 outer aspect ratio, the border itself only a thin strip relative to the whole frame
```

**Pílula de Coroas**
```
Top-down-neutral game UI icon illustration of a single ornate horizontal pill-shaped capsule badge: aged bronze metal with gold trim, a small circular medallion socket at the left end (sized to hold a crown icon, added separately in code) bordered by a faceted amethyst-purple gem, engraved rope-and-vine detailing running along the top and bottom edges of the capsule, the rest of the pill's surface smooth, flat and evenly lit so a number reads clearly on top of it in code. Isolated game UI asset on a flat, solid mid-gray background (no scene, no other elements) so it can be cleanly cut out. Painterly medieval-fantasy game style (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading (amber highlights on the bronze, a cool purple glint on the gem), no text, no numbers baked into it, no watermark, wide short pill composition, roughly 3:1, wider than tall
```

**Barra de perfil** (mandar a pílula de Coroas junto como referência, se possível)
```
Top-down-neutral game UI illustration of a single ornate horizontal pill-shaped capsule badge, wider than a small currency pill: aged bronze metal with gold trim, matching the exact same material, engraving style and rope-and-vine border as a companion currency-pill asset in this set, but with a larger circular recessed socket at the left end, deep enough to visually hold a round avatar portrait added separately in code, with its own raised gold ring border around the socket. The rest of the capsule to the right of the socket is a smooth, flat, evenly lit surface divided into two horizontal bands by a thin engraved line: a slightly taller top band (for a player name in code) and a shorter bottom band with a shallow carved groove running its full length (a track for a thin progress bar rendered in code). Isolated game UI asset on a flat, solid mid-gray background (no scene, no other elements) so it can be cleanly cut out. Painterly medieval-fantasy game style (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading, no text, no avatar, no numbers baked into it, no watermark, wide horizontal pill composition, roughly 4.5:1, noticeably wider than the currency pill
```

**Placa dos ícones pequenos**
```
Top-down-neutral game UI illustration of a single ornate square button plaque with softly rounded corners: aged bronze metal with gold trim, a thin engraved rope-and-vine border, and a flat, smooth, evenly lit recessed center where an icon will be added separately in code. Same material and engraving style as the rest of this game's bronze-and-gold UI set. Isolated game UI asset on a flat, solid mid-gray background (no scene, no other elements) so it can be cleanly cut out. Painterly medieval-fantasy game style (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading, no text, no icon, no watermark, square composition, 1:1
```

**Pacote de ícones**
```
Sheet of four matching game UI icons arranged in a 2x2 grid with generous empty space between them, on a flat, solid mid-gray background. Each icon is an embossed gold-and-bronze medieval-fantasy emblem with soft rim lighting: top-left a cogwheel (settings), top-right an open ancient book with visible pages (tutorials), bottom-left a golden trophy cup (ranking), bottom-right a war horn with sound waves coming out of it (sound). All four in the same style, same size, same lighting, each centered in its own quarter. Painterly medieval-fantasy game style (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), no text, no labels, no watermark, square composition
```

</details>

---

## 4n. Menu principal — segunda rodada

**Status:** moldura fina, placa fina e ícones **entregues e integradas**; avatares
**pendentes** (24 prompts avulsos abaixo).

Pedido do usuário depois de ver o menu integrado: molduras **mais finas**, **sem
subtítulo** nos botões (só ícone + título, pra mostrar mais da arte) e **ícones
desenhados** no lugar dos emojis, mais avatares variados no lugar do leão.

Entregue (cinza recortado do mesmo jeito da primeira rodada, ver 4e–4m):
- `ui-frame-menu-card.webp` — moldura 4:1 fina, com cantoneiras; agora é uma
  sobreposição direta (o 9-slice provisório saiu) e o botão tem a proporção 1600:397.
- `ui-icon-button.webp` — placa fina dos ícones de baixo.
- `ui-icon-coroa/desafios/online/editar-deck/loja/mais.webp` — os 6 ícones da
  folha (coroa das Coroas, espadas e escudo, globo, cartas com pena, bolsa de
  moedas, botão "+" verde). Foram separados por componente conectado, não por
  coluna fixa, porque a pena das cartas cruza a linha da grade.

Avatares: **6 entregues e integrados** (`avatar-01/02/04/05/06/07.webp`, em estilo
de retrato ilustrado; a primeira versão dos prompts saía realista demais e foi
trocada, ver o trecho comum abaixo). O usuário decidiu ficar só com esses por
enquanto; os prompts 03 e 08-24 seguem guardados. O `AvatarBadge` corta em círculo
e o seletor é uma grade 3x2; um perfil salvo com um id antigo (emoji) cai no
primeiro avatar.

Container do perfil: **entregue e integrado** (`ui-profile-plate.webp`, substitui
`ui-pill-perfil`). Recorte: o brilho laranja em volta (que se misturava ao cinza) foi
tratado por distância de cor ao cinza, e a estrelinha de marca d'água da IA no canto
inferior direito foi apagada (o buraco que ela deixou na trança foi preenchido).
Medidas usadas no código (arte 1679x499): recesso do avatar centro (17,5%; 47,6%),
20,4% de largura; escudo do nível centro (33,4%; 73%); caixa do nome x 39-93%,
y 25-46%; trilho de XP x 42-88%, y 59-66%. O botão "Comandante" agora cabe inteiro
(fonte do nome 3,9cqw, o lápis de editar saiu; tocar no nome continua editando).

<details>
<summary>Prompts (moldura, placa, ícones e avatares)</summary>

**Moldura fina dos botões (4:1)** → `ui-frame-menu-card.webp`
```
Top-down-neutral game UI illustration of a single slim ornate rectangular picture-frame border, aged bronze and gold, a delicate thin metal rim with a fine rope trim along its inner edge and small engraved corner brackets with tiny rivets. The border must be VERY THIN: each side only about 3% of the image's height thick (about 12px on a 400px-tall image), with the corner brackets only slightly larger than the rim, so that the empty center window covers about 94% of the whole image. The frame's center is a large, plain, flat solid mid-gray rectangular window, completely empty, no texture, no gradient, representing where a background image will show through once composited in code; only the slim border itself has any detail or color. Same material and engraving style as this game's other bronze-and-gold UI pieces. Painterly medieval-fantasy game style (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading on the bronze and gold only, no text, no watermark, wide landscape frame composition, 4:1 outer aspect ratio (1600x400)
```

**Placa fina dos ícones pequenos (1:1)** → `ui-icon-button.webp`
```
Top-down-neutral game UI illustration of a single slim ornate square button frame with softly rounded corners: aged bronze and gold, a delicate thin metal rim only about 6% of the image's width thick with a fine rope trim along its inner edge, and a large flat, smooth, evenly lit dark-bronze recessed center covering about 85% of the width where an icon will be placed in code. Same material and engraving style as the rest of this game's bronze-and-gold UI set. Isolated game UI asset on a flat, solid mid-gray background (no scene, no other elements) so it can be cleanly cut out. Painterly medieval-fantasy game style (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading, no text, no icon, no watermark, square composition, 1:1
```

**Ícones do menu (folha 3x2)** → `ui-icon-coroa/desafios/online/editar-deck/loja/mais.webp`
```
Sheet of six matching game UI icons arranged in a 3x2 grid (three columns, two rows) with generous empty space between them, on a flat, solid mid-gray background. Each icon is an embossed gold-and-bronze medieval-fantasy emblem with soft rim lighting, same style, same size, same lighting, each centered in its own cell. Top row: (1) a golden crown with a large faceted amethyst-purple gem in its center, (2) two crossed swords over a small heater shield, (3) a golden globe of the world ringed by a thin orbit band. Bottom row: (4) a small fan of three cards seen from the back, each with an ornate gold border and a rearing lion crest in the middle, with a feather quill lying across them (no suits, no numbers, no playing-card pips), (5) a leather coin pouch tied with rope with gold coins spilling out, (6) a round emerald-green button with a gold rim and a bold golden plus sign in the middle. Painterly medieval-fantasy game style (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), no text, no labels, no watermark, landscape composition, 3:2 aspect ratio
```

**Avatares (24 prompts avulsos, 1:1)** → `avatar-01..24.webp`

As folhas de 8 retratos por imagem foram descartadas: a IA repetia o mesmo rosto. Agora é um prompt por avatar, cada um com um personagem único (idade, pele, rosto, cabelo, roupa, expressão e cor de fundo diferentes). Gerar uma imagem por prompt; o jogo corta em círculo. O estilo é de avatar ilustrado (retrato de jogo de cartas), não realista: a primeira versão pedia "semi-realista" e a IA gerou rostos de foto, que destoavam da arte do jogo. Se ainda sair realista, anexar 2 artes de carta do jogo como referência de estilo. Cada prompt = o trecho comum abaixo + a descrição do personagem.

Trecho comum:
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark.
```

**01 Batedora de pele escura**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young woman of about 22 with deep brown skin, tight black coily hair in a high puff tied with a red cloth band, high cheekbones and a wide confident smile, a small gold hoop earring, a brown leather scout jerkin with a green scarf. Head turned three-quarters to the right, light from the left, misty forest-green background.
```

**02 Escudeiro ruivo**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young man of about 20 with very pale freckled skin, messy copper-red hair, green eyes, a cheeky lopsided grin and a small scar through his left eyebrow, wearing a faded blue padded squire's gambeson with the collar open. Head tilted slightly, warm sunset-orange background.
```

**03 Guerreira da trança**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young woman of about 25 with light olive skin, a single thick black braid over one shoulder, sharp almond eyes, a calm serious expression and a thin scar on her chin, dark steel chainmail coif hanging around her neck. Looking straight at the viewer, cold slate-blue background.
```

**04 Arqueiro de turbante**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young man of about 28 with medium brown skin, a neatly trimmed short black beard, thick eyebrows and a warm smile, a dark green cloth wrapped around his head with a brass clasp, a brown wool tunic with a leather strap across the chest holding a quiver. Dusty ochre background.
```

**05 Aprendiz de clériga**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young woman of about 19 with fair East Asian features, a short black bob with straight bangs, a round face and wide curious eyes looking slightly upward, a white apprentice hood with gold trim. Soft lavender background.
```

**06 Soldado careca**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young man of about 24 with dark brown skin, a shaved head, a strong jaw, a small stud earring and a stern determined look, a steel gorget over a plain red tabard with a white stripe. Deep crimson background.
```

**07 Caçadora de bandana**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young woman of about 27 with tan skin, wavy chestnut hair blowing in the wind, freckles across the nose and a sun-lined grin, a red bandana on her forehead, a worn leather archer's bracer and arrow fletching visible at the shoulder. Teal sky background.
```

**08 Nórdico de coque**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young man of about 23 with pale skin, blond hair in a top-knot with shaved sides, light blue eyes, a sparse blond beard and an intense stare, a fur-trimmed cloak fastened with a bronze brooch. Pale icy-blue background with frost.
```

**09 Capitão veterano**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. An old man of about 70 with a long white braided beard, weathered ruddy skin, one milky blind left eye crossed by an old scar, a dented dark steel helm with a faded red plume. Smoky charcoal background with drifting embers.
```

**10 Avó sorridente**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. An elderly woman of about 68 with dark brown skin, short cropped white curly hair, deep laugh lines and a kind warm smile, a patterned orange-and-yellow headwrap and a wooden bead necklace. Warm terracotta background.
```

**11 Ferreiro careca**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A man of about 55 with medium tan skin, a bald head, a thick grey mustache, huge bushy eyebrows, a soot-smudged cheek and a burn scar on his neck, leather apron straps over his shoulders. Lit by the orange glow of a forge, dark red-orange background.
```

**12 Matrona da trança coroa**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A woman of about 50 with fair rosy skin, silver-blonde hair in an elaborate crown braid, blue-grey eyes and a dignified stern expression, a dark green velvet hood trimmed with fur and a silver brooch. Deep green and gold tapestry background.
```

**13 Sábio de óculos**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. An old man of about 75 with East Asian features, a thin long white beard, a white top-knot, tiny round wire spectacles and a wise gentle half-smile, a deep indigo scholar's robe with a high collar. Softly blurred candlelit bookshelves in the background.
```

**14 Sacerdotisa de véu negro**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A woman of about 60 with olive skin, jet-black hair with one grey streak pulled back under a black veil, a sharp hawk-like nose, piercing dark eyes and tight lips, a gold sun pendant on black-and-gold vestments. Dark violet background.
```

**15 Sargento cicatrizado**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A man of about 52 with brown-black skin, close-cropped grey hair and a salt-and-pepper beard, a heavy scar from forehead to cheek, tired but noble eyes, a battered steel breastplate with a crimson sash. Stormy grey background.
```

**16 Herbalista de penas**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A woman of about 65 with tan skin, wild grey-white hair tied with leather cord and small feathers, a deeply lined face and a mischievous grin with a missing tooth, a patched fur vest and a small herb pouch on a strap. Warm amber wooden-hut background.
```

**17 Cavaleira de armadura**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A female knight of about 30 with pale skin, cropped dark hair, dirt and sweat on her face and a determined expression, polished silver plate armor with gold trim, a crimson-plumed helmet tucked under her arm, her breath fogging in the cold. Golden sunlit cathedral background.
```

**18 Arqueiro encapuzado**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A hooded male archer of about 35 with tan skin and rough stubble, a dark green cloak hood shadowing his eyes so only the lower face and one glinting eye show, arrow fletching over his shoulder. Deep forest at night, cold moonlight.
```

**19 Clériga radiante**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A female cleric of about 26 with deep brown skin, serene eyes lifted upward and a faint golden halo glow around her head, a white-and-gold hooded robe embroidered with suns. Radiant white-gold light background.
```

**20 Comandante de manto**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A male commander of about 48 with fair skin, a sharply trimmed dark beard with silver at the chin and a commanding gaze, a steel helm with gold trim and a tall crimson crest, a crimson cloak fastened with a golden lion clasp. Red battle banners in the background.
```

**21 Maga de olhos brilhantes**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A female mage of about 32 with light brown skin, long silver-white hair, softly glowing pale blue eyes, a deep blue hood with silver runes stitched along the edge, small arcane sparks floating around her. Deep blue starry background.
```

**22 Escudeiro adolescente**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A young male squire of about 16 with a round ruddy pale face, big ears, unruly straw-yellow hair, freckles and an awed wide-eyed expression, an oversized padded gambeson and a pot helm sitting crooked on his head. Muted grey-green training-yard background.
```

**23 Nobre de coroa de rubi**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A noblewoman of about 38 with dark ebony skin, hair in intricate braids swept up beneath a slim gold circlet with a small ruby, long gold earrings, a high-necked burgundy velvet gown with a gold lion brooch and a cool confident expression. Deep burgundy drapery background.
```

**24 Mercenário de tapa-olho**
```
Square 1:1 stylized fantasy character avatar portrait for a mobile card game, head-and-shoulders bust, the face centered with the whole head and shoulders inside the central 80% of the frame (it will be cropped to a circle in code), full-bleed simple painted background with no border, ring or frame. Hand-painted digital illustration in the style of a fantasy trading card game (Hearthstone, Gwent, Legends of Runeterra portraits): bold clean shapes, confident brushwork, slightly exaggerated and expressive features, simplified soft shading, rich saturated colors. NOT photorealistic: no photo look, no realistic skin pores or textures, no 3D render look, no uncanny realism. No text, no watermark. A male mercenary of about 40 with tanned leathery skin, dark hair pulled back with shaved sides, a thick scar across the nose, black stubble and a gold-toothed grin, a black eyepatch over one eye, a red bandana on his forehead, a patched dark leather jacket with a bone necklace. Smoky amber tavern background.
```

**Novo container do perfil (gamificado)** → `ui-profile-plate.webp`

Substitui `ui-pill-perfil` (achado estranho: avatar minúsculo dentro de um anel grosso
e muito espaço vazio). Proporção 3,2:1, então fica mais alto que a pílula atual e o
conteúdo do menu precisa descer ~35 px. Layout que o código vai assumir (medir de
novo na arte recebida): anel do avatar à esquerda (~96% da altura, centro em ~15%),
selo do nível no canto inferior direito do anel, placa do nome em cima à direita,
trilho de XP embaixo com uma gema na ponta.
```
Top-down-neutral game UI illustration of a single ornate player profile plate for a mobile fantasy card game, wide landscape composition, 3.2:1 aspect ratio (1600x500). Aged bronze and gold metalwork with a few crimson enamel accents and small gold gem studs, engraved rope-and-vine trim, subtle warm glow along the gold edges, same material and style as this game's other bronze-and-gold UI pieces. Layout, left to right: (1) a large round avatar frame at the far left, an ornate thick gold ring with small wing-like flourishes on its sides, its outer diameter about 96% of the image height so it slightly overlaps the top and bottom edges of the plate, containing an EMPTY round recess with a flat solid dark-brown center where a portrait will be placed in code; (2) a small shield-shaped level badge attached to the lower-right of the avatar ring, gold rim with a crimson center left completely empty for a number; (3) to the right, a long horizontal name plate with a slightly banner-like shape, dark smooth inset surface in the upper half of the plate (for a player name added in code), and below it a recessed carved track for an experience bar, long and thin, with a small round gold gem cap at its right end (the bar fill is added in code, leave the track empty). Isolated game UI asset on a flat, solid mid-gray background (no scene, no other elements) so it can be cleanly cut out. Painterly medieval-fantasy game style (Gwent / Hearthstone UI quality), warm torchlit color grading, no text, no numbers, no portrait, no watermark.
```

</details>

---

## 4o. Janelas do menu — moldura e textura de fundo

**Status:** moldura **entregue e integrada** (`ui-window-frame.webp`, 768x768) e textura de
fundo **entregue e integrada** (`ui-window-texture.webp`, 512x512; a arte veio com 4x4 repetições
do mesmo motivo e costuras de couro entre elas, e emenda bem nas bordas — testado; é
repetida a 400 px sob um brilho quente suave). A primeira moldura (linha fina solta por fora e cantos
enormes com corte diagonal) foi descartada e o prompt foi refeito pedindo um anel só e
cantos pequenos apoiados nele.

A moldura é usada por **todas** as janelas do menu, através de um componente só
(`FramedWindow` / `WindowOverlay` / `WindowTitle` / `WindowText` / `WindowButton` em
`src/App.tsx`): Online, escolha de avatar, avisos "em breve", escolha de deck e "instale o
app". Ela é desenhada em 9 fatias (CSS `border-image`, fatia de 160 px na arte de 768):
os quatro cantos mantêm o tamanho e os lados retos esticam. O fundo do painel é definido em
`FramedWindow` (textura + brilho); mudar ali muda todas as janelas. Qualquer janela nova deve
usar o mesmo componente.

Recorte: o cinza foi removido por inteiro (janela central e fora), a moldura tem cantos
internos arredondados que ficam transparentes.

<details>
<summary>Prompts</summary>

**Moldura da janela (usado)**
```
Top-down-neutral game UI illustration of a single square window frame for a mobile fantasy card game, 1:1 aspect ratio (1024x1024), perfectly symmetrical, centered, with about 2% of empty margin on every side.

THE FRAME IS ONE SINGLE, CONTINUOUS, CLOSED RING of aged bronze and gold metal, about 6% of the image width thick, running all the way around with no gaps, no breaks, no second or outer line, no floating pieces and no empty space between parts. Every straight stretch of the ring is IDENTICAL, plain and uniform: a flat bronze band with a thin bright gold rim on its outer edge and a fine rope trim along its inner edge. Nothing else decorates the straight stretches: no gems, no emblems, no notches, no ornaments, no changes in width.

Each of the four corners has a small ornamental cap that sits FLUSH on the ring (same thickness as the ring, not wider), square in shape, only about 11% of the image width along each side, with a small carved Celtic knot, one rivet, and a slightly raised gold edge. All four corner caps are identical, only rotated. No diagonal cuts, no wings, no pieces that stick out beyond the ring or extend far along the sides.

The area inside the ring is a large, plain, flat, solid mid-gray square (RGB 125,125,125) window, completely empty: no texture, no gradient, no shadow, no vignette, no glow. The background outside the ring is the exact same flat solid mid-gray. Only the ring itself has any detail or color.

Painterly medieval-fantasy game style (Gwent / Hearthstone UI quality), the same bronze-and-gold material and engraving as this game's other UI pieces, warm torchlit color grading on the metal only, crisp clean edges, no text, no watermark.
```

**Textura de fundo das janelas (usado)** → `ui-window-texture.webp`
```
Seamless tileable square texture, 1:1 aspect ratio (1024x1024), a flat top-down view of a dark aged surface for the background of medieval-fantasy game menus: deep brown-black embossed leather with a very faint, low-contrast engraved filigree pattern of interlaced vines and small repeating knotwork, subtle stitched seams, soft worn patina and tiny scuffs. Warm dark palette only: darkest tones around #140d07, lightest tones no brighter than #3a2914, with very faint bronze highlights on the raised parts of the pattern. Even lighting across the whole image: no vignette, no gradient from one side to the other, no shadows falling across it, no glow, no focal point, no large features, no borders, no frame, no edge damage. The pattern must repeat seamlessly in both directions so that tiling it produces no visible seams. Low overall contrast so that light cream text and small icons stay clearly readable on top of it. No text, no letters, no symbols, no watermark.
```

</details>

---

## 4p. Fundo da tela inicial — versão épica

**Status:** a v1 está integrada (`start-screen-bg.webp`, 704x1389; o reino ao entardecer
anterior continua em `reference/start-screen-bg-v1.png`). A v1 veio com uma faixa azul lisa de
131 px no topo, cortada; a causa foi o próprio prompt, que dizia que o topo era "onde fica uma
barra de status" e o gerador desenhou a barra. **A v2 (prompt abaixo) está pendente**: o
logo saiu do menu (vai para a futura tela de login/criação de conta, que usará este mesmo
fundo, com o logo por cima do céu), então a composição mudou — o miolo agora é o herói da
imagem e a calma fica embaixo, onde ficam os botões. Usada em `MainMenu`, na tela de
carregamento e, no futuro, no login.

Layout que a arte precisa respeitar (celular 9:19,5): topo ~13% = barra de perfil; do topo até
~60% = a cena principal, livre de botões (no login o logo vai no terço superior); de ~60% a 100%
= botões e ícones, então calmo, escuro e de baixo contraste.

<details>
<summary>Prompt v2</summary>

```
Tall vertical portrait key-art background for a mobile game, 9:19.5 aspect ratio, as high resolution as the generator allows (at least 1080x2340), epic painterly digital illustration in the style of a premium fantasy card game (Hearthstone, Legends of Runeterra, League of Legends loading-screen quality). FULL-BLEED ARTWORK: the painting fills the entire canvas edge to edge from the very first row of pixels, with NO flat bar, band, strip, header, footer, letterbox, border or solid-color area anywhere.

Scene: a colossal gothic fortress-cathedral with tall spires, a huge carved rose window and burning battlements, built into a black cliff and seen from a low angle at dusk, its windows and towers glowing with orange firelight; a vast burning sky of storm clouds torn open by a blazing golden sunset, shafts of golden light breaking through, drifting embers and sparks in the air. A river of tiny marching soldiers with crimson-and-gold lion banners flows toward the great gates far below, and the ruins of an enemy siege camp smolder in the mist. In the foreground on the left and right edges, dark planted swords, broken spears and tattered crimson banners rise from the ground like a stage frame. Palette: fire orange, molten gold, deep crimson and blue-violet shadows, rich and saturated with soft atmospheric haze.

COMPOSITION FOR A MENU (very important): the fortress and the glowing sky are the hero and live in the upper 60% of the image, with the tallest spires and the brightest light in the upper-middle, and a fairly open glowing sky area at the top center (a logo will be placed over it); the top 13% is still painted sky, just slightly darker. The lower 40% of the image is calm, hazy, low-contrast and mostly dark: the fortress base fades into thick misty shadow, with only faint hints of the marching army, since wide buttons will cover this area. Strongest detail, light and contrast in the upper 60% and along the left and right edges; a soft dark vignette toward the bottom edge.

No text, no letters, no UI, no logo, no watermark, no people in close-up.
```

</details>

---

## 4q. Divisor fino das janelas (pendente)

**Status:** prompt pronto. Hoje o divisor é desenhado em CSS (`WindowDivider` em `src/App.tsx`:
duas linhas douradas que somem nas pontas em volta de um losango). A arte vai substituir esse
CSS e pode ser usada para separar seções em qualquer janela. Pedido do usuário: uma arte "bem
fininha" só para dividir. Como os geradores não fazem faixas muito finas, o prompt pede um
canvas 4:1 com o divisor só no meio (cortar o cinza e o excesso depois).

<details>
<summary>Prompt</summary>

```
Top-down-neutral game UI illustration of a single thin horizontal ornamental divider rule for a medieval-fantasy game menu, centered on a wide 4:1 canvas (2064x512) with a flat, solid mid-gray background (RGB 125,125,125) and nothing else in the image. The divider occupies only the middle band, about 8% of the image height, and spans about 90% of the width, perfectly symmetrical left to right. Aged bronze and gold metal: a very thin straight gold line that tapers to fine points at both ends, with a small elegant central ornament (a diamond-shaped gem cap flanked by two tiny curled leaf flourishes and a small Celtic knot), a fine rope trim along the line. Same material and engraving style as this game's other bronze-and-gold UI pieces, warm torchlit color grading on the metal only, crisp clean edges. No text, no watermark, no shadow on the background, no glow, no other decoration.
```

</details>

---

## 4r. Molduras de linha fina — botões e janelas (pendente)

**Status:** **entregue e integrado** (`ui-frame-menu-card.webp` 810x183 e `ui-window-frame.webp` 640x641, recortados com transparência gradual — o cinza vira alpha proporcional à distância dele — porque o fio tem só 2 a 5 px e o recorte por borda comeria ele). Nos botões a moldura deixou de ser 4:1 e virou 810:183 (a arte veio 4,4:1), e nas janelas a fatia caiu de 160 para 90 px e a borda de 34 para 28. As molduras grossas antigas saíram do projeto. Pedido do usuário: as molduras atuais (dos botões e das janelas)
ainda estão grossas demais; quer algo "como se fosse só uma linha dourada", que não chame
atenção, feito por arte e usado em tudo. Vão substituir `ui-frame-menu-card.webp` (botões, 4:1)
e `ui-window-frame.webp` (janelas, 1:1). Para os botões basta trocar o arquivo (é uma
sobreposição direta); para as janelas, trocar o arquivo e reduzir `WINDOW_FRAME_PX` e a fatia
(`borderImageSlice`) em `FramedWindow`, medindo os cantos na arte nova. O mesmo prompt gera as
duas; só muda a proporção e o tamanho dos cantinhos.

<details>
<summary>Prompts</summary>

**Moldura fina dos botões (4:1)** → `ui-frame-menu-card.webp`
```
Top-down-neutral game UI illustration of a single, extremely thin, elegant gold-line rectangular frame for a medieval-fantasy game menu button, on a wide 4:1 canvas (1600x400), perfectly symmetrical and centered with about 1% of empty margin on every side. The frame is just a delicate line: one crisp polished gold line only about 0.8% of the image height thick (about 3px on a 400px-tall image), with a second, even finer darker-gold hairline running just inside it, and nothing else along the straight sides: no bronze band, no rope, no gems, no engraving, no texture, no thick border, no shadow. Only the four corners carry a tiny ornament: a small curled gold bracket with a fine leaf flourish and a single tiny dot, identical on all four corners (mirrored), no larger than 3% of the image width, drawn with the same thin line weight. The straight stretches of the line are perfectly uniform so the frame can be stretched in code. The area inside the frame is a large, flat, solid mid-gray (RGB 125,125,125) rectangle, completely empty, and the background outside the frame is the exact same flat mid-gray. Polished gold with a subtle warm highlight, crisp clean edges, painterly medieval-fantasy game style (Gwent / Hearthstone UI quality). No text, no watermark, no glow.
```

**Moldura fina das janelas (1:1)** → `ui-window-frame.webp`
```
Top-down-neutral game UI illustration of a single, extremely thin, elegant gold-line square frame for a medieval-fantasy game window, 1:1 canvas (1024x1024), perfectly symmetrical and centered with about 2% of empty margin on every side. The frame is just a delicate line: one crisp polished gold line only about 0.7% of the image width thick (about 7px on a 1024px image), with a second, even finer darker-gold hairline running just inside it, and nothing else along the straight sides: no bronze band, no rope, no gems, no engraving, no texture, no thick border, no shadow. Only the four corners carry a small ornament: a curled gold bracket with a fine leaf flourish, a tiny Celtic knot and a single tiny dot, identical on all four corners (mirrored), no larger than 6% of the image width, drawn with the same thin line weight. The straight stretches of the line are perfectly uniform so the frame can be stretched in code. The area inside the frame is a large, flat, solid mid-gray (RGB 125,125,125) square, completely empty, and the background outside the frame is the exact same flat mid-gray. Polished gold with a subtle warm highlight, crisp clean edges, painterly medieval-fantasy game style (Gwent / Hearthstone UI quality). No text, no watermark, no glow.
```

</details>

---

## 4s. Molduras finas — ícones de baixo, perfil e Coroas (pendente)

**Status:** **entregue e integrado** (`ui-icon-button.webp` 256, `ui-profile-plate.webp` 1100x287, `ui-pill-coroas.webp` 620x126). Recorte com transparência gradual (como 4r) e, como a moldura fina deixa o interior vazio, os vãos fechados foram preenchidos por código com um marrom quase preto semi-opaco, para os ícones e os textos ficarem legíveis; medidas do layout refeitas na arte nova (comentário em `ProfileBar`). A pílula veio 4,9:1 (o prompt pedia 3,8:1) e a placa 3,8:1 (pedia 3,2:1), então ficaram um pouco menores em altura. Pedido do usuário: o resto da tela inicial ainda tem as artes de
bronze grosso (quadradinhos de Config./Tutoriais/Ranking/Som, placa do perfil, pílula de
Coroas); quer tudo na mesma linha dourada fina. Como o resto do menu, o objetivo é combinar
com `ui-frame-menu-card.webp` (linha dupla, cantinhos com folhinha).

Ao integrar: `ui-icon-button.webp` (1:1, miolo cinza vira transparente — o ícone entra
por cima, hoje em `MenuIconButton`), `ui-profile-plate.webp` e `ui-pill-coroas.webp` (medidas
do layout em cqw em `ProfileBar` precisam ser refeitas na arte nova). Recortar com transparência
gradual, como em 4r.

<details>
<summary>Prompts</summary>

**Moldura fina dos ícones (1:1)** → `ui-icon-button.webp`
```
Top-down-neutral game UI illustration of a single, extremely thin, elegant gold-line square frame for a small medieval-fantasy game icon button, 1:1 canvas (1024x1024), perfectly symmetrical and centered with about 3% of empty margin on every side. The frame is just a delicate line with softly rounded corners: one crisp polished gold line only about 1% of the image width thick (about 10px on a 1024px image), with a second, even finer darker-gold hairline running just inside it, and nothing else: no bronze band, no rope, no gems, no engraving, no texture, no thick border, no shadow. Each of the four corners carries only a tiny curled leaf flourish, identical on all four corners (mirrored), no larger than 9% of the image width, drawn with the same thin line weight. The area inside the frame is a large, flat, solid mid-gray (RGB 125,125,125) square, completely empty, and the background outside the frame is the exact same flat mid-gray. Polished gold with a subtle warm highlight, crisp clean edges, painterly medieval-fantasy game style (Gwent / Hearthstone UI quality). No text, no icon, no watermark, no glow.
```

**Placa fina do perfil (3,2:1)** → `ui-profile-plate.webp`
```
Top-down-neutral game UI illustration of a slim, elegant gold-line player profile plate for a mobile medieval-fantasy card game, wide landscape composition, 3.2:1 aspect ratio (1600x500), on a flat solid mid-gray background (RGB 125,125,125). Everything is drawn with fine polished gold lines, no thick bronze bands: (1) at the far left, a round avatar ring made of one thin gold line (about 1% of the image height thick) with a second fine darker-gold hairline just inside it, and two small, delicate wing-like leaf flourishes curling from its left and right sides; the ring's diameter is about 92% of the image height, and inside it a flat solid mid-gray disc (same gray as the background) where a portrait will be placed in code; (2) a small shield-shaped level badge attached to the lower right of the ring, outlined in thin gold, its inside flat solid mid-gray; (3) to the right, a long rectangular plate outlined by a thin double gold line with tiny corner flourishes, split into an upper wide name field and, below it, a slim rounded track for an experience bar with a tiny round gold gem at its right end; the insides of the name field and of the track are flat solid mid-gray (same gray), completely empty. Same material and line weight everywhere, crisp clean edges, subtle warm highlight on the gold only, painterly medieval-fantasy game style (Gwent / Hearthstone UI quality). No text, no numbers, no portrait, no watermark, no glow, no shadow.
```

**Pílula fina de Coroas (3,8:1)** → `ui-pill-coroas.webp`
```
Top-down-neutral game UI illustration of a slim, elegant gold-line currency pill for a medieval-fantasy game, wide 3.8:1 canvas (1520x400) on a flat solid mid-gray background (RGB 125,125,125), centered with about 4% margin. A horizontal capsule with fully rounded ends, outlined by a thin polished gold line (about 1% of the image height thick) with a second fine darker-gold hairline just inside it. At the left end sits a round medallion socket outlined by the same thin gold line with a single small faceted amethyst-purple gem set at its lower edge; the socket's inside is flat solid mid-gray (a crown icon will be placed there in code). The rest of the capsule's inside is flat solid mid-gray, completely empty. No bronze band, no rope, no thick border, no engraving, no shadow. Crisp clean edges, subtle warm highlight on the gold only, painterly medieval-fantasy game style (Gwent / Hearthstone UI quality). No text, no numbers, no watermark, no glow.
```

</details>

---

## 4t. Editor de deck (Meu Deck) — artes da tela (pendente)

**Status:** pendente. Hoje a tela usa só as molduras finas já existentes (`ui-frame-menu-card.webp`
em botões, linhas e casas das cartas). Objetivo: arte própria, na mesma linha fina dourada
(4r/4s), para o editor ficar com cara de jogo e não de formulário. Peças: (1) casa da carta
(retrato 5:7), (2) linha da lista (larga, com soquete do custo à esquerda e da quantidade à direita),
(3) placa do cabeçalho do deck (nome, General, contador), (4) abas Deck/Reserva (selecionada e
apagada), (5) pílula de filtro (selecionada e apagada), (6) ícones (8 tipos de carta, Lista, Cartas,
Ordem, Buscar, Limpar deck, Preencher automático). Cinza RGB 125,125,125 no fundo e nos vãos,
recorte com transparência gradual como em 4r. Prompts completos foram enviados no chat.

---

## 4u. Loja de boosters — camadas da cena (pendente)

**Status:** integrado, exceto o booster do Capitão (E2), que ainda usa um desenho provisório. Entregues e recortados: prateleira (com chão e laterais), balcão, vendedor em 4 poses e booster Cardeal, todos em `src/assets/shop-*.webp` / `booster-cardeal.webp`, registrados em `SHOP_ART` (`ShopScreen` em `src/App.tsx`). Todas as camadas usam o
**mesmo canvas 9:16 (1024x1792)**, fundo cinza RGB 125,125,125 (recorto como nas outras) e a mesma luz/paleta
da cena de referência (A). Arquivos: `shop-counter`, `shop-shelf` (opaca, sem recorte), `shop-npc-greet/show/happy/sorry`,
`booster-cardeal`, `booster-capitao`.

Ordem sugerida: A (referência) → B (prateleira) → C (balcão) → D (NPC: primeiro a pose "greet", depois as
outras usando a primeira como referência) → E (boosters). Nas camadas B–E anexar a imagem A no gerador.

Prateleira: 5 fileiras de até 10 boosters (50). Boosters ~5:8 em pé, apoiados na tábua de cada fileira. As posições
exatas eu ajusto no código depois de ver a arte.

<details>
<summary>Prompts (formato já incluso em cada um)</summary>

**A · Cena de referência**
```
Portrait 9:16 aspect ratio, exactly 1024x1792 pixels. Painterly medieval-fantasy illustration, the interior of a cozy merchant's card shop seen from the customer's eye level, strict one-point perspective. In the foreground at the bottom, a heavy wooden counter with gold coin stacks, a small golden crown, a brass balance scale, a quill and inkwell, a lit candle and two sealed booster packs. Behind the counter, centered, a friendly middle-aged merchant with a short grey-flecked beard, kind eyes, a soft cap with a feather, a burgundy vest with gold trim over a cream shirt and a brown leather apron. Behind him, filling the wall, tall wooden shelving with five evenly spaced shelves, each lined with rows of small sealed card booster packs in cream-and-gold and crimson-and-steel wrappers. Warm candlelight, soft golden glow, the shelves slightly out of focus (depth of field), rich shadows, palette of warm brown wood, gold and crimson. Same high-quality painterly game-art style as a premium collectible card game. No text, no letters, no watermark, no UI.
```

**B · Prateleira (opaca, sem recorte)**
```
Portrait 9:16 aspect ratio, exactly 1024x1792 pixels. Painterly medieval-fantasy illustration of the back wall of a merchant's card shop: a tall wooden shelving unit with exactly five evenly spaced horizontal shelves, filling most of the width, perfectly frontal one-point perspective with the shelf planks showing a little of their top surface so they read as deep. The shelves are completely EMPTY (no packs, no objects, nothing on them) and the whole wall is fully visible with nothing standing in front of it. Warm dim candlelight from the sides, dark wood, small carved details on the frame, a stone wall behind, the upper and lower parts of the canvas continue the room (dark ceiling beams above, wooden floor line below). The planks sit at roughly 25%, 36%, 48%, 59% and 70% of the image height. Slight depth-of-field softness. Must match the lighting, palette and style of the attached reference image. No text, no watermark, no characters.
```

**C · Balcão**
```
Portrait 9:16 aspect ratio, exactly 1024x1792 pixels. Painterly medieval-fantasy game-art foreground element on a flat solid mid-gray background (RGB 125,125,125). Only the bottom 26% of the canvas contains art: a heavy carved wooden shop counter seen from the front, its top edge running straight across the full width (edge to edge, no gap on either side) with a subtle warm highlight along the front lip. On the counter top: stacks of gold coins, a small golden crown, a brass balance scale, a quill in an inkwell, a lit candle, and two sealed booster packs. Everything above the counter is plain flat gray. Same lighting and style as the attached reference image. No text, no watermark.
```

**D1 · Vendedor — greet**
```
Portrait 9:16 aspect ratio, exactly 1024x1792 pixels. A friendly middle-aged merchant, waist-up, centered, occupying about x 8%-92% and y 25%-78% of the canvas (the counter will hide his lower body). Short grey-flecked beard, kind eyes, soft cap with a feather, burgundy vest with gold trim over a cream shirt, brown leather apron. Painterly medieval-fantasy character art, same style and lighting as the attached reference images, the same character, same outfit, same framing, size and position in every pose. Flat solid mid-gray background (RGB 125,125,125) everywhere around him. No text, no watermark, no other objects. POSE: warm welcoming smile, right hand raised in a friendly greeting, left hand resting on the counter.
```

**D2 · Vendedor — show**
```
Portrait 9:16 aspect ratio, exactly 1024x1792 pixels. A friendly middle-aged merchant, waist-up, centered, occupying about x 8%-92% and y 25%-78% of the canvas (the counter will hide his lower body). Short grey-flecked beard, kind eyes, soft cap with a feather, burgundy vest with gold trim over a cream shirt, brown leather apron. Painterly medieval-fantasy character art, same style and lighting as the attached reference images, the same character, same outfit, same framing, size and position in every pose. Flat solid mid-gray background (RGB 125,125,125) everywhere around him. No text, no watermark, no other objects. POSE: body turned slightly, one arm sweeping out to the side as if presenting the shelves behind him, raised eyebrows, inviting expression.
```

**D3 · Vendedor — happy**
```
Portrait 9:16 aspect ratio, exactly 1024x1792 pixels. A friendly middle-aged merchant, waist-up, centered, occupying about x 8%-92% and y 25%-78% of the canvas (the counter will hide his lower body). Short grey-flecked beard, kind eyes, soft cap with a feather, burgundy vest with gold trim over a cream shirt, brown leather apron. Painterly medieval-fantasy character art, same style and lighting as the attached reference images, the same character, same outfit, same framing, size and position in every pose. Flat solid mid-gray background (RGB 125,125,125) everywhere around him. No text, no watermark, no other objects. POSE: pleased satisfied smile, hands together in front of him as if about to hand over a booster pack, eyes bright.
```

**D4 · Vendedor — sorry**
```
Portrait 9:16 aspect ratio, exactly 1024x1792 pixels. A friendly middle-aged merchant, waist-up, centered, occupying about x 8%-92% and y 25%-78% of the canvas (the counter will hide his lower body). Short grey-flecked beard, kind eyes, soft cap with a feather, burgundy vest with gold trim over a cream shirt, brown leather apron. Painterly medieval-fantasy character art, same style and lighting as the attached reference images, the same character, same outfit, same framing, size and position in every pose. Flat solid mid-gray background (RGB 125,125,125) everywhere around him. No text, no watermark, no other objects. POSE: apologetic expression, shoulders in a small shrug, both palms open and turned up, gentle sad smile.
```

**E1 · Booster Cardeal**
```
Portrait 5:8 aspect ratio, exactly 1000x1600 pixels. Game asset: a single sealed collectible card booster pack standing upright, front view, centered with about 6% margin, on a flat solid mid-gray background (RGB 125,125,125). Foil wrapper with crimped, zig-zag sealed edges at the top and bottom, slight foil sheen and a couple of soft creases, a thin gold border line, a large central emblem. Painterly medieval-fantasy style matching the attached reference. No text, no letters, no watermark, no shadow on the background. Colors and emblem: cream-white and gold wrapper, a radiant golden cross with a dove.
```

**E2 · Booster Capitão**
```
Portrait 5:8 aspect ratio, exactly 1000x1600 pixels. Game asset: a single sealed collectible card booster pack standing upright, front view, centered with about 6% margin, on a flat solid mid-gray background (RGB 125,125,125). Foil wrapper with crimped, zig-zag sealed edges at the top and bottom, slight foil sheen and a couple of soft creases, a thin gold border line, a large central emblem. Painterly medieval-fantasy style matching the attached reference. No text, no letters, no watermark, no shadow on the background. Colors and emblem: deep crimson and steel-gray wrapper, a rampant golden lion.
```

</details>


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

## Deck Cardeal Pedro, Voz da Fé

**Identidade visual do deck:** uma ordem militar-religiosa cruzada — branco,
dourado e vermelho-carmesim, luz quente e dourada de caráter "sagrado" (não
azulada/mágica), cruzes e símbolos de fé, cavaleiros com mantos sobre a
armadura no estilo Cavaleiro Hospitalário/Templário.

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
da Padrão: Jorge, Lança Sagrada, Nobre da Cruzada, Cavaleiro da Luz, Comandante
da Ordem, Trabuco de Cerco, Retorno do Soldado — critério nos comentários originais
mantido (estatística/raridade/impacto na estratégia).

Todas as artes deste baralho já foram entregues.

## Deck Capitão

**Identidade visual do deck:** um exército profissional disciplinado, sem
tom religioso — carmesim, dourado e cinza-aço, o mesmo brasão do leão
rampante que já aparece nas bandeiras do campo de batalha (item 3d) e no
logo do jogo (4d-v2). Diferente do Cardeal Pedro, Voz da Fé (fé e cura), esse
baralho é sobre formação e movimento tático.

**Cartas com Full Art alternativa:** mesmo critério do Deck Cardeal Pedro, Voz da Fé —
além do General e da Relíquia (que só existem em Full Art), estas seis
ganham uma versão Full Art opcional além da Padrão: Cavaleiro Tático,
Capitão de Formação, Veterano de Guerra, Reformar Linhas, Contra-Manobra,
Fortaleza de Pedra.

Todas as artes deste baralho já foram entregues e integradas no jogo
(`DECK_CAPITAO` em `src/App.tsx`).

