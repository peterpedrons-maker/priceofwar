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

## 4e. Botão do Menu — Campanha

**Referência:** mockup completo gerado por outra IA que o usuário trouxe
como inspiração pro redesign do menu (não salvo em `reference/` — imagem
só compartilhada no chat) · **Vai em:** substitui `boardBattlefieldImage`
(reaproveitado como placeholder) no `bgImage` do card "Campanha" em
`MainMenu` (`src/App.tsx`) — salvar como
`src/assets/menu-card-campanha.webp` e trocar o import · **Estilo:**
elemento/ícone de UI · **Status:** pronto pra gerar

O redesign do menu trocou os 4 botões de placa lisa (ver 4c acima, agora
substituído) por cards maiores, cada um com sua própria arte de fundo —
igual ao mockup de referência que o usuário mandou. Esse é o card em
destaque (o maior dos quatro, ~3,3:1 de proporção), então pede a cena mais
"cinematográfica" do lote.

```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio approx 3.3:1 (width:height), approx 1600x480px — much wider than tall, a thin horizontal banner, NOT a square or portrait image. Epic painterly digital illustration for a game menu button background: a lone
crimson-and-gold armored knight seen from behind at medium-close range,
standing at the edge of a war camp looking out over a vast army marching
toward a besieged castle burning on the horizon at dusk, warm golden-
orange sky breaking through storm clouds, banners and spear-tips of the
distant army silhouetted against the light, dramatic atmospheric haze
separating the knight in the foreground from the army and castle in the
distance. Same painterly premium fantasy key-art style as the game's
title screen background (League of Legends / Total War loading-screen
quality), warm dusk palette of crimson, gold and deep blue-violet shadow,
cinematic wide banner composition with the knight positioned left-of-
center and open sky/battle vista filling the right two-thirds of the
frame — leave the left third and the top/bottom edges relatively dark and
uncluttered, since UI text and an icon sit on top of them in code. No
text, no UI, no watermark, no logo, wide landscape banner orientation
(about 1600×480px, roughly 3.3:1, much wider than tall)
```

**Notas:** pedi de propósito espaço "escuro e limpo" no terço esquerdo —
é exatamente onde o ícone e o título "CAMPANHA" ficam sobrepostos em
código (ver `MenuCard` em `App.tsx`), então a arte não pode competir com o
texto ali. O restante da imagem some numa vinheta escura por cima (código
já aplica um gradiente preto de ~65-85%), então pode (e deve) ser bem
vívida/detalhada — só essa faixa esquerda precisa ficar mais "vazia".

---

## 4f. Botão do Menu — Partida Rápida

**Vai em:** substitui `startScreenBgImage` (placeholder) no `bgImage` do
card "Partida Rápida" em `MainMenu` — salvar como
`src/assets/menu-card-partida-rapida.webp` · **Estilo:** elemento/ícone de
UI · **Status:** pronto pra gerar

Esse e o próximo (Meu Deck) dividem a mesma fileira lado a lado, então são
mais "quadrados" que o card da Campanha (~2:1 em vez de ~3,3:1). Partida
Rápida = ação rápida contra a IA, então pede um duelo direto e dinâmico.

```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio approx 2:1 (width:height), approx 1200x580px — wider than tall but noticeably more square than a thin banner, NOT a portrait image. Two crimson-and-gold armored knights clashing swords in a tight,
dynamic close-up duel, sparks flying at the point of impact, motion blur
on the striking arms, dust kicked up around their boots, dramatic side
lighting from a low sun. Bold, dynamic graphic stylization with dramatic
flat color blocking and confident linework, closer to Yu-Gi-Oh monster-
card energy than soft painterly realism (same treatment as Jorge, Lança
Sagrada's own card art — this game's own reference for that style), warm
palette of crimson, gold and steel gray, dynamic diagonal action
composition with the clash pushed toward the upper-right of the frame,
leaving the lower-left corner and edges relatively dark and uncluttered
for UI text/icon placed on top in code. No text, no UI, no watermark,
wide landscape banner orientation (about 1200×580px, roughly 2:1, wider
than tall)
```

**Notas:** mesma lógica de "canto escuro reservado pro texto" do prompt
anterior, só que aqui é o canto inferior-esquerdo (onde o ícone/título
"PARTIDA RÁPIDA" ficam) em vez do terço esquerdo inteiro — a composição é
mais compacta/quadrada, então o espaço reservado também é menor.

---

## 4g. Botão do Menu — Meu Deck

**Vai em:** substitui `cardBackplateImage` (placeholder) no `bgImage` do
card "Meu Deck" em `MainMenu` — salvar como
`src/assets/menu-card-meu-deck.webp` · **Estilo:** elemento/ícone de UI ·
**Status:** pronto pra gerar

Par do prompt anterior na mesma fileira (mesma proporção ~2:1), mas
contemplativo em vez de ação — é o botão que leva pro gerenciamento de
cartas, então mostra as próprias cartas como objeto, no mesmo estilo
still-life hiper-realista já usado pras cartas de equipamento do Deck
Cardeal Pedro.

```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio approx 2:1 (width:height), approx 1200x580px — wider than tall but noticeably more square than a thin banner, NOT a portrait image. Hyperreal macro still-life illustration of a neat stack of ornate
crimson-and-gold playing cards resting on a dark wooden table, the top
card's gilded card-back design catching warm candlelight from a single
lit candle in an iron holder just beside the stack, soft shadow pooling
around the base of the cards, a few loose cards fanned slightly at the
edge of the stack. Hyperreal macro product-photography-level realism,
every material surface rendered with tack-sharp physically-based detail
(same treatment as this game's equipment still-life cards), warm palette
of candlelight amber, gold leaf and dark wood brown, intimate close-up
composition with the stack positioned right-of-center, leaving the left
side of the frame in soft dark shadow and relatively uncluttered for UI
text/icon placed on top in code. No text, no UI, no watermark, wide
landscape banner orientation (about 1200×580px, roughly 2:1, wider than
tall)
```

**Notas:** mesma ideia de "lado escuro reservado" dos dois anteriores, só
que aqui é o lado esquerdo inteiro (a pilha de cartas fica deslocada pra
direita de propósito). Se quiser trocar o baralho genérico por algo mais
"deste jogo" (leão dourado no verso, por exemplo), dá pra acrescentar uma
frase tipo "the top card's back bearing a rearing golden lion crest" —
deixei genérico porque still-life hiper-realista tende a sair melhor sem
pedir um símbolo heráldico específico de uma vez.

---

## 4h. Botão do Menu — Multijogador

**Vai em:** substitui `boardBattlefieldImage` (placeholder) no `bgImage`
do card "Multijogador" em `MainMenu` — salvar como
`src/assets/menu-card-multijogador.webp` · **Estilo:** elemento/ícone de
UI · **Status:** pronto pra gerar
**Revisado:** o layout do menu mudou depois desse prompt ter sido
escrito — Multijogador deixou de ter sua própria linha de largura total
e passou a dividir uma linha com o novo card "Loja" (ver 4m), então a
proporção e a composição abaixo foram ajustadas de ~3,3:1/simétrico pra
~2:1/canto reservado, igual os outros cards compactos (4f/4g).

```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio approx 2:1 (width:height), approx 1200x580px — wider than tall but noticeably more square than a thin banner, NOT a portrait image. Two armored knights facing off in a standoff, one in crimson-and-gold
heraldry in the foreground-left, one in steel-blue-and-silver heraldry
facing them from the right, each with their own banner planted in the
ground behind them, swords drawn and held ready, a hazy battlefield
stretching between them into the distance at dusk. Same painterly
premium fantasy key-art style as the game's title screen background
(League of Legends / Total War loading-screen quality), rich palette
split between warm crimson-gold (left knight) and cool steel-blue (right
knight) with a neutral dusk-gold sky uniting them, composition pushed
toward the upper-right of the frame, leaving the lower-left corner and
edges relatively dark and uncluttered for UI text/icon placed on top in
code. No text, no UI, no watermark, no logo, wide landscape banner
orientation (about 1200×580px, roughly 2:1, wider than tall)
```

**Notas:** mesma lógica de "canto inferior-esquerdo reservado" dos
outros cards compactos (4f/4g) — a versão anterior deste prompt pedia uma
composição simétrica com uma faixa escura central, que fazia sentido
quando esse card ocupava a largura toda sozinho; num card menor ao lado
da Loja, o padrão dos outros três cards (canto reservado, não faixa
central) fica mais consistente. A ideia de dois lados com cor de
heráldica diferente (carmesim-dourado vs. azul-aço) se manteve — ainda
comunica "times diferentes" antes mesmo de o jogador ler o nome do modo.

---

## 4m. Botão do Menu — Loja

**Vai em:** substitui `cardTemplateFullArtGoldImage` (placeholder) no
`bgImage` do card "Loja" em `MainMenu` — salvar como
`src/assets/menu-card-loja.webp` · **Estilo:** elemento/ícone de UI ·
**Status:** pronto pra gerar

Card novo — faltava um jeito de chegar na loja direto pela tela inicial
(antes só existia o atalho discreto do "+" ao lado das Coroas). Fica na
mesma linha do Multijogador (ver 4h), então usa a mesma proporção
compacta ~2:1 dos outros cards secundários.

```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio approx 2:1 (width:height), approx 1200x580px — wider than tall but noticeably more square than a thin banner, NOT a portrait image. Hyperreal macro still-life illustration of an open wooden merchant's
chest overflowing with treasure relevant to this game's own economy: a
few sealed booster packs of playing cards tied with ribbon, a small pile
of loose gold coins, and two or three faceted amethyst-purple gems
(matching the game's own "Coroas" currency gem, see 4i) spilling out
alongside them, warm lantern light from just outside the frame catching
the gold and gems. Hyperreal macro product-photography-level realism,
every material surface rendered with tack-sharp physically-based detail
(same treatment as this game's equipment still-life cards and the Meu
Deck menu card, 4g), warm palette of lantern amber, gold coin shine and
a cool purple glint off the gems, composition pushed toward the upper-
right of the frame, leaving the lower-left corner and edges relatively
dark and uncluttered for UI text/icon placed on top in code. No text, no
UI, no watermark, wide landscape banner orientation (about 1200×580px,
roughly 2:1, wider than tall)
```

**Notas:** pedi booster + ouro + gemas de ametista juntos de propósito —
é literalmente o que a Loja vai vender (boosters, e Coroas usam essa
mesma gema como ícone, ver 4i), então a arte já "spoila" o conteúdo da
tela sem precisar de texto nenhum. Mesma lógica de canto reservado dos
outros cards compactos.

---

## 4i. Container — Pílula de Coroas

**Vai em:** substitui o fundo desenhado em CSS (`bg-black/50` + borda
dourada) atrás do ícone 👑 e do número de Coroas, no canto superior
direito da tela inicial (`ProfileBar` em `src/App.tsx`) — salvar como
`src/assets/ui-pill-coroas.webp` · **Estilo:** elemento/ícone de UI ·
**Status:** pronto pra gerar

Mesma família de material dos itens 4b/4c antigos (bronze envelhecido e
ouro, entalhado) — é o "container bem legal" que o usuário pediu pra
substituir a pílula lisa atual. Curta e larga o bastante pra caber o
ícone da coroa + até 4 dígitos de número por cima em código.

```
Top-down-neutral game UI icon illustration of a single ornate horizontal
pill-shaped capsule badge: aged bronze metal with gold trim, a small
circular medallion socket at the left end (sized to hold a crown icon,
added separately in code) bordered by a faceted amethyst-purple gem,
engraved rope-and-vine detailing running along the top and bottom edges
of the capsule, the rest of the pill's surface smooth, flat and evenly
lit so a number reads clearly on top of it in code. Isolated game UI
asset on a flat, solid mid-gray background (no scene, no other elements)
so it can be cleanly cut out and reused as a currency-pill background.
Same painterly medieval-fantasy game style as the rest of the set (Gwent
/ Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading
(amber highlights on the bronze, a cool purple glint on the gem), no
text, no numbers baked into it, no watermark, wide short pill/capsule
composition (roughly 3:1, wider than tall)
```

**Notas:** pedi a gema em ametista de propósito — é a mesma cor usada no
mockup de referência do usuário pro ícone da coroa, e ajuda a "Coroas"
(moeda de fora da partida) se diferenciar ainda mais do Ouro (moeda de
dentro da partida, sempre dourado puro sem gema). "Sem número" é
proposital, igual o botão antigo (4c) — o valor é renderizado em código
por cima.

---

## 4j. Container — Barra de Perfil

**Vai em:** substitui o fundo em CSS (`bg-black/50` + borda dourada) da
barra de perfil inteira no canto superior esquerdo (avatar + nome + rank
+ barra de XP, `ProfileBar` em `src/App.tsx`) — salvar como
`src/assets/ui-pill-perfil.webp` · **Estilo:** elemento/ícone de UI ·
**Status:** pronto pra gerar

"Mesmo design de container" pedido pelo usuário pra combinar com a
pílula de Coroas (4i) — mesmo material/acabamento, só maior e com um
encaixe circular pro avatar do jogador em vez do medalhão da coroa.

```
Top-down-neutral game UI icon illustration of a single ornate horizontal
pill-shaped capsule badge, wider than a small currency pill: aged bronze
metal with gold trim, matching the exact same material, engraving style
and rope-and-vine border as a companion currency-pill asset in this set,
but with a larger circular recessed socket at the left end — deep enough
to visually hold a round avatar portrait added separately in code, with
its own raised gold ring border around the socket. The rest of the
capsule to the right of the socket is a smooth, flat, evenly lit surface
divided into two horizontal bands by a thin engraved line: a slightly
taller top band (for a player name in code) and a shorter bottom band
with a shallow carved groove running its full length (a track for a
thin progress bar rendered in code on top of it). Isolated game UI asset
on a flat, solid mid-gray background (no scene, no other elements) so it
can be cleanly cut out and reused as the profile-bar background. Same
painterly medieval-fantasy game style as the rest of the set (Gwent /
Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color grading
(amber highlights on the bronze), no text, no avatar, no numbers baked
into it, no watermark, wide horizontal pill/capsule composition (roughly
4.5:1, noticeably wider than the currency pill)
```

**Notas:** pedi "a mesma matéria/acabamento que uma pílula de moeda
irmã" de propósito pra IA que for gerar entender que são a mesma família
visual (mande a 4i junto como referência, se seu gerador aceitar
referência de imagem). O "trilho entalhado" pro grupo inferior é pra
onde a barra de XP (já implementada em código, cosmética por enquanto)
fica desenhada por cima.

---

## 4k. Container — Moldura dos Cards do Menu (banner largo)

**Vai em:** substitui a borda dourada simples em CSS (`border-2
border-[#d4af37]`) ao redor do card "Campanha" (o único de proporção
~3,3:1 agora — ver a nota revisada em 4h: Multijogador passou pra
proporção compacta ~2:1 quando ganhou a Loja do lado) — salvar como
`src/assets/ui-frame-menu-card-wide.webp` · **Estilo:** elemento/ícone de
UI · **Status:** pronto pra gerar

O usuário pediu uma moldura de verdade (não só uma borda lisa) ao redor
das novas artes de fundo do menu — mesma ideia de "moldura entalhada"
já usada nos frames das cartas de jogo, só que numa proporção bem mais
larga e baixa.

```
Top-down-neutral game UI icon illustration of a single ornate rectangular
picture-frame border, aged bronze and gold with engraved corner brackets,
rivets and a thin rope-and-vine trim running along the inner and outer
edge of the frame. The frame's center is a large, plain, flat solid
mid-gray rectangular window — completely empty, no texture, no
gradient — representing where a background image will show through once
composited in code; only the border itself should have any detail or
color. Same painterly medieval-fantasy game style as the rest of the set
(Gwent / Yu-Gi-Oh Forbidden Memories menu quality), warm torchlit color
grading on the bronze/gold border only, no text, no watermark, wide
landscape frame composition (roughly 3.3:1 outer aspect ratio, matching
a thin horizontal banner, the border itself only a thin strip relative
to the whole frame — most of the frame's own area is the empty gray
window)
```

**Notas:** diferente dos marcadores de zona (3e/3f/3g), que ficam com o
fundo cinza sólido de propósito (só recortados uma vez, no formato final),
essa moldura precisa MESMO virar transparente na janela central — ela
fica por CIMA da arte de fundo (4e/4h) em código, então o meio precisa
deixar a arte de trás aparecer. Como o meio é um retângulo grande, liso e
de cor sólida única (sem gradiente, sem textura), a remoção de fundo por
cor é bem simples de fazer depois (ferramenta de recorte automático ou
"remover fundo" da maioria dos editores) — só a borda entalhada
permanece opaca. Ordem de empilhamento em código: arte de fundo primeiro,
moldura (já com o meio transparente) por cima, ver `MenuCard` em
`App.tsx`.

---

## 4l. Container — Moldura dos Cards do Menu (compacto)

**Vai em:** substitui a mesma borda em CSS ao redor dos QUATRO cards de
proporção ~2:1 — Partida Rápida, Meu Deck (4f/4g), e agora também
Multijogador e Loja (4h/4m) depois da revisão de layout — salvar como
`src/assets/ui-frame-menu-card-compact.webp` · **Estilo:** elemento/ícone
de UI · **Status:** pronto pra gerar

Par do prompt anterior, mesma família visual, só numa proporção mais
quadrada pra combinar com os quatro cards menores em duas fileiras de
dois.

```
Top-down-neutral game UI icon illustration of a single ornate rectangular
picture-frame border, matching the exact same bronze-and-gold material,
engraved corner brackets, rivets and rope-and-vine trim as a companion
wide banner-frame asset in this set. The frame's center is a large,
plain, flat solid mid-gray rectangular window — completely empty, no
texture, no gradient — representing where a background image will show
through once composited in code; only the border itself should have any
detail or color. Same painterly medieval-fantasy game style as the rest
of the set (Gwent / Yu-Gi-Oh Forbidden Memories menu quality), warm
torchlit color grading on the bronze/gold border only, no text, no
watermark, landscape frame composition (roughly 2:1 outer aspect ratio,
noticeably more square than the wide banner frame, the border itself
only a thin strip relative to the whole frame)
```

**Notas:** mesma lógica de empilhamento do prompt anterior (arte de
fundo por trás, moldura por cima, sem remoção de fundo). Duas molduras
(larga + compacta) em vez de uma só reaproveitada em todos os cards
porque esticar uma moldura de proporção muito diferente deixaria os
cantos entalhados distorcidos — a larga (4k) cobre só a Campanha agora, a
compacta cobre os outros quatro (Partida Rápida, Meu Deck, Multijogador,
Loja — ver 4f/4g/4h/4m).

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

