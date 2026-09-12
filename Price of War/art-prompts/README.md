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

## 2. Moldura Full Art (dourada) — referência de layout

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
