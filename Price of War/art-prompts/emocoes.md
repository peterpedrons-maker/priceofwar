# Emojis próprios da partida online: prompt para gerar com IA

Pedido do dono: os ícones devem ser **parecidos com os emojis de verdade, mas em outro estilo de arte e outras cores** (o estilo do jogo). Só emojis neutros: sem risada e sem raiva (podem soar como deboche ou provocação). Mockup: `docs/janelas/emocoes-lado-a-lado.png`. Mesma regra do kit: sem texto na imagem, fundo magenta `#FF00FF` chapado para recortar.

Oito ícones, os mesmos das frases e da fileira de emojis (mesma ideia dos emojis do sistema, redesenhada com o tema medieval: mãos viram **manoplas** de armadura e carinhas viram **elmos** com a viseira aberta mostrando a expressão):
1. Joinha: manopla com o polegar para cima (positivo)
2. Palmas: duas manoplas batendo palmas (bela jogada)
3. Prece: duas manoplas juntas em prece (que a fé o guie / obrigado)
4. Aperto de mãos: duas manoplas apertando-se (obrigado / boa partida)
5. Surpresa: elmo com a viseira levantada, olhos arregalados e boca em "o" (nossa!)
6. Pensativo: elmo com a viseira levantada, sobrancelha erguida e uma manopla no queixo (pense bem)
7. Ops: elmo com a viseira levantada, sorriso sem graça e uma gota de suor (ops!)
8. Troféu: cálice-troféu dourado com duas alças (boa partida)

## Prompt: folha com os oito
```
Emoji icon sheet for a medieval dark-fantasy mobile card game. Eight round medallion icons laid out in a 4x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained. NO text, NO letters, NO numbers.
Each medallion is a round coin-like badge: thick worn gold-bronze rim with a thin inner dark line, a dark warm-brown center, and the symbol painted in the middle in a polished-steel, gold and warm-ivory palette with soft highlights (hand-painted illustration style, subtle grain, slightly worn metal). Same lighting on all eight (soft light from the top left). The symbols look like the familiar emoji but redrawn as medieval armor art, simple and readable at 40 px:
1) an armored gauntlet giving a thumbs up, 2) two armored gauntlets clapping, 3) two armored gauntlets pressed together in prayer, 4) two armored gauntlets in a firm handshake, 5) a steel knight helmet with the visor raised showing a surprised face (wide eyes, small round open mouth), 6) a steel knight helmet with the visor raised showing a thoughtful face (one raised eyebrow) with a gauntlet on the chin, 7) a steel knight helmet with the visor raised showing an awkward smile with one drop of sweat, 8) a golden two-handled victory cup.
Faces are neutral and respectful (never laughing, never angry, no mockery). Palette: near-black brown #120d08 center, aged bronze #8a6a2c rim, polished gold #e6c36a with highlight #f6e3a3, steel grey #8d949c with highlight #cfd5db, ivory #efe3c2 for the faces. Flat orthographic front view, no cast shadows on the background.
```
Depois de gerar: recortar do magenta, fatiar cada medalhão em PNG/WebP transparente de ~160 px e guardar em `src/assets/emotes/` (a tela usa 40 px, o resto é para telas de alta densidade). Se a folha vier fraca, peça um medalhão por vez com o mesmo texto de estilo.
