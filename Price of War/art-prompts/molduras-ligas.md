# Molduras das ligas (ranqueado)

**Decisão final do dono:** uma moldura por liga (8 no total), sem moldura diferente por divisão (IV a I). As artes foram entregues em uma folha (prompt abaixo) e recortadas do magenta, com o furo do miolo transparente, em `src/assets/ligas/<liga>.webp` (288x288; o furo tem diâmetro = 1/3 do lado nas oito, então o retrato de diâmetro 0,3267 x lado encaixa em todas; só o maior pedaço de cada anel é guardado, sem sobras dos vizinhos, e bolsões do miolo ficam preenchidos para o fundo não vazar):
ferro, bronze, prata, ouro, platina, diamante, mestre, senhor-da-guerra (nome provisório da liga de topo).
Prévia: `docs/janelas/ranqueado-ligas-com-retratos.png` e, no tabuleiro, `ranqueado-moldura-com-aneis.png`.
A divisão (IV a I) aparece como medalhinha/número desenhado pelo jogo, não na moldura. A moldura que o jogador usa é a da maior liga que alcançou na temporada anterior.

## Prompt usado (folha com as oito)
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Eight round avatar ring frames laid out in a 4x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained. NO text, NO letters, NO numbers. The CENTER of every ring is an empty circular hole filled with the same flat magenta #FF00FF (a portrait will be placed there later), the hole is about 62% of the ring's outer diameter. Each ring has a small diamond-shaped gem set into the bottom center of the rim.
Style: hand-painted medieval metal like the game's coin-like medallions, soft highlights, light from the top left, flat front view, readable when shrunk to 40 px.
The eight rings, from lowest to highest rank: 1) IRON: dull dark grey iron with rivets. 2) BRONZE: warm bronze with a rope-like edge. 3) SILVER: polished silver. 4) GOLD: polished gold with a beaded edge. 5) PLATINUM: cool teal-white metal with an engraved pattern and a mint gem. 6) DIAMOND: deep blue steel with small pale-blue crystals and a bright blue gem. 7) MASTER: dark violet metal with gold edges and two small wing-like flourishes, a violet gem. 8) WARLORD (top rank): blackened red-gold metal with a small spiked crown on top, tiny flames and a ruby gem.
```
