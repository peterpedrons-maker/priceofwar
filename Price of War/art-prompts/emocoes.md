# Emojis próprios da partida online: prompt para gerar com IA

Pedido do dono: os ícones devem ser **parecidos com os emojis de verdade, mas em outro estilo de arte e outras cores** (o estilo do jogo). Só emojis neutros: sem risada e sem raiva (podem soar como deboche ou provocação). Mockup: `docs/janelas/emocoes-lado-a-lado.png`. Mesma regra do kit: sem texto na imagem, fundo magenta `#FF00FF` chapado para recortar.

Os seis (mesma ideia dos emojis do sistema, trocando só o desenho):
1. Joinha (positivo) · 2. Palmas (bela jogada) · 3. Mãos juntas (obrigado) · 4. Rosto surpreso, boca em "o" (nossa!) · 5. Rosto pensativo, mão no queixo (pense bem) · 6. Aperto de mãos (boa partida)

## Prompt: folha com os seis
```
Emoji icon sheet for a medieval dark-fantasy mobile card game. Six round medallion icons laid out in a 3x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained. NO text, NO letters, NO numbers.
Each medallion is a round coin-like badge: thick worn gold-bronze rim with a thin inner dark line, a dark warm-brown center, and the emoji symbol painted in the middle in a polished-gold and warm-ivory palette with soft highlights (hand-painted illustration style, subtle grain, slightly worn metal). Same lighting on all six (soft light from the top left). The symbols look like the familiar emoji but redrawn as painted medieval-heraldry artwork, simple and readable at 40 px:
1) thumbs up, 2) clapping hands, 3) hands pressed together in thanks, 4) surprised face with a small round open mouth and raised eyebrows, 5) thoughtful face with a hand on the chin, 6) two hands in a firm handshake.
Faces are neutral and respectful (never laughing, never angry). Palette: near-black brown #120d08 center, aged bronze #8a6a2c rim, polished gold #e6c36a with highlight #f6e3a3, ivory #efe3c2 for faces and hands. Flat orthographic front view, no cast shadows on the background.
```
Depois de gerar: recortar do magenta, fatiar cada medalhão em PNG/WebP transparente de ~160 px e guardar em `src/assets/emotes/` (a tela usa 40 px, o resto é para telas de alta densidade).
