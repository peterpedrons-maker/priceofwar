# Molduras das ligas (ranqueado): prompts para gerar com IA

Pedido do dono: cada liga tem uma moldura redonda em volta do retrato do jogador (a moldura compacta junto ao ouro, ver `docs/janelas/ranqueado-moldura-do-ouro-compacta.png`). Ela aparece pequena (uns 34 a 46 pixels), então o desenho tem de ser **simples, forte e legível pequeno**: silhueta clara, poucos detalhes finos. As ligas sobem de riqueza (ferro rústico, topo com coroa e chamas).
Mesmas regras de sempre: sem texto na imagem, fundo magenta `#FF00FF` chapado (o miolo também é magenta, para eu recortar o furo onde entra o retrato). Prompts em inglês.
Ligas (a de topo tem nome provisório "Senhor da Guerra"): Ferro, Bronze, Prata, Ouro, Platina, Diamante, Mestre, Senhor da Guerra.

## Prompt: folha com as oito molduras
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Eight round avatar ring frames laid out in a 4x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained. NO text, NO letters, NO numbers. The CENTER of every ring is an empty circular hole filled with the same flat magenta #FF00FF (a portrait will be placed there later), the hole is about 62% of the ring's outer diameter. Each ring has a small diamond-shaped gem set into the bottom center of the rim.
Style: the same hand-painted medieval metal as the game's coin-like medallions: thick worn metal rim, soft highlights, subtle grain, light from the top left, flat orthographic front view, no cast shadow on the background. Every ring must read clearly when shrunk to 40 px: strong simple silhouette, no tiny details.
The eight rings, from lowest to highest rank (each one richer than the previous, but all clearly the same family):
1) IRON: dull dark grey iron, rough hammered surface, a few rivets, gem of grey steel.
2) BRONZE: warm brown-orange bronze, slightly worn, simple rope-like edge, gem of copper.
3) SILVER: polished silver, clean bright rim, a thin engraved line, gem of pale silver-white.
4) GOLD: polished warm gold with a thin beaded edge, gem of yellow gold.
5) PLATINUM: cool teal-white metal with a delicate engraved pattern and a glowing mint-teal gem.
6) DIAMOND: deep blue steel set with small faceted pale-blue crystals around the rim, a large bright blue gem.
7) MASTER: dark violet metal with ornate gold edges and two small pointed wing-like flourishes at the sides, a glowing violet gem.
8) WARLORD (the top rank): blackened red-gold metal with a small crown of spikes on the top, tiny flames licking up from the rim, a large glowing ruby gem. The most impressive of the eight.
Palette hints: iron #7d838c, bronze #9a5f2c / #e2a56a, silver #9aa6b3 / #eef3f8, gold #c8962c / #ffe08a, platinum #4aa7a0 / #b8fff2, diamond #4f7fe0 / #bcd7ff, master #8a4fc4 / #e2c0ff, warlord #c0392b / #ffd36a.
```

## Se a folha vier fraca: uma moldura por vez
Use o mesmo texto de estilo e peça só uma, por exemplo: "ONE round avatar ring frame, GOLD league, on a flat magenta background, the center hole also flat magenta, ...", mudando a liga conforme a lista acima.

## Como vou usar (depois que vierem)
1. Recorto cada anel do magenta (fora e o furo do miolo) e guardo em `src/assets/ligas/<liga>.webp`.
2. O retrato do jogador entra por baixo do anel; o losango da liga que está na arte fica na parte de baixo do anel (a divisão, I a IV, é uma medalhinha desenhada pelo jogo).
3. A moldura que o jogador usa é a da **maior liga que alcançou na temporada anterior** (ver `docs/visao-geral.md`, seção do ranqueado).
