# Molduras das ligas (ranqueado): prompts para gerar com IA

Pedido do dono: cada liga tem uma moldura redonda em volta do retrato do jogador (a moldura compacta junto ao ouro, ver `docs/janelas/ranqueado-moldura-do-ouro-compacta.png`). Ela aparece pequena (uns 34 a 46 pixels), então o desenho tem de ser **simples, forte e legível pequeno**.
**Versão atual (rodada 2):** cada liga tem 4 divisões (IV a I) e **as quatro molduras de uma liga mudam aos poucos**: a IV é a mais simples e a I a mais rica, sempre do mesmo material. Mestre e a liga de topo não têm divisões (uma moldura cada). Total: 6 ligas x 4 + 2 = 26 molduras.
**Como gerar:** uma liga por vez (uma folha com as 4 divisões). Depois de gerar a primeira, mande a folha como referência de estilo (imagem) junto com o prompt das seguintes, para as ligas ficarem da mesma família.
Mesmas regras de sempre: sem texto na imagem, fundo magenta `#FF00FF` chapado (o miolo também é magenta, para recortar o furo onde entra o retrato). Prompts em inglês. A liga de topo tem nome provisório "Senhor da Guerra".

## 1. Ferro: as quatro divisões
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Four round avatar ring frames laid out in a 2x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained, all exactly the same outer size. NO text, NO letters, NO numbers. The CENTER of every ring is an empty circular hole filled with the same flat magenta #FF00FF (a portrait will be placed there later), the hole is about 62% of the ring's outer diameter. Each ring has a diamond-shaped gem set into the bottom center of the rim.
Style: the same hand-painted medieval metal as the game's coin-like medallions: thick worn metal rim, soft highlights, subtle grain, light from the top left, flat orthographic front view, no cast shadow on the background. Every ring must read clearly when shrunk to 40 px: strong simple silhouette, no tiny details.
The four rings are four DIVISIONS of the same IRON league and must look like one family made of the same material (dull dark grey hammered iron). They differ only GRADUALLY, each one a little richer than the one before it, so that the four read as a clear step-by-step progression:
IV: a plain rough iron ring, no decoration, a small grey steel gem.
III: the same ring a little thicker, with four small rivets around the rim, a slightly larger gem.
II: a riveted iron band (eight rivets) with a thin raised inner edge, a larger gem.
I: a reinforced iron ring with a double band, eight rivets and small notched teeth along the top edge, the largest and brightest steel gem.
Top-left = division IV (the plainest), top-right = III, bottom-left = II, bottom-right = I (the richest, but still clearly IRON, not the next league).
Palette hints: iron #7d838c / #c3c9d0.
```

## 2. Bronze: as quatro divisões
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Four round avatar ring frames laid out in a 2x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained, all exactly the same outer size. NO text, NO letters, NO numbers. The CENTER of every ring is an empty circular hole filled with the same flat magenta #FF00FF (a portrait will be placed there later), the hole is about 62% of the ring's outer diameter. Each ring has a diamond-shaped gem set into the bottom center of the rim.
Style: the same hand-painted medieval metal as the game's coin-like medallions: thick worn metal rim, soft highlights, subtle grain, light from the top left, flat orthographic front view, no cast shadow on the background. Every ring must read clearly when shrunk to 40 px: strong simple silhouette, no tiny details.
The four rings are four DIVISIONS of the same BRONZE league and must look like one family made of the same material (warm brown-orange worn bronze). They differ only GRADUALLY, each one a little richer than the one before it, so that the four read as a clear step-by-step progression:
IV: a plain bronze ring, slightly worn, a small copper gem.
III: a rope-like twisted edge around the rim, a slightly larger gem.
II: the rope edge plus small round studs set in the rim, a larger gem.
I: the rope edge, studs and a small shield-shaped plate at the top, the largest warm copper gem.
Top-left = division IV (the plainest), top-right = III, bottom-left = II, bottom-right = I (the richest, but still clearly BRONZE, not the next league).
Palette hints: bronze #9a5f2c / #e2a56a.
```

## 3. Prata: as quatro divisões
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Four round avatar ring frames laid out in a 2x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained, all exactly the same outer size. NO text, NO letters, NO numbers. The CENTER of every ring is an empty circular hole filled with the same flat magenta #FF00FF (a portrait will be placed there later), the hole is about 62% of the ring's outer diameter. Each ring has a diamond-shaped gem set into the bottom center of the rim.
Style: the same hand-painted medieval metal as the game's coin-like medallions: thick worn metal rim, soft highlights, subtle grain, light from the top left, flat orthographic front view, no cast shadow on the background. Every ring must read clearly when shrunk to 40 px: strong simple silhouette, no tiny details.
The four rings are four DIVISIONS of the same SILVER league and must look like one family made of the same material (polished bright silver). They differ only GRADUALLY, each one a little richer than the one before it, so that the four read as a clear step-by-step progression:
IV: a plain polished silver ring, a small pale gem.
III: a thin engraved line running around the rim, a slightly larger gem.
II: the engraved line plus a scalloped (wavy) outer edge, a larger gem.
I: the engraved line, the scalloped edge and a small pointed fleur-de-lis shape at the top, the largest silver-white gem.
Top-left = division IV (the plainest), top-right = III, bottom-left = II, bottom-right = I (the richest, but still clearly SILVER, not the next league).
Palette hints: silver #9aa6b3 / #eef3f8.
```

## 4. Ouro: as quatro divisões
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Four round avatar ring frames laid out in a 2x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained, all exactly the same outer size. NO text, NO letters, NO numbers. The CENTER of every ring is an empty circular hole filled with the same flat magenta #FF00FF (a portrait will be placed there later), the hole is about 62% of the ring's outer diameter. Each ring has a diamond-shaped gem set into the bottom center of the rim.
Style: the same hand-painted medieval metal as the game's coin-like medallions: thick worn metal rim, soft highlights, subtle grain, light from the top left, flat orthographic front view, no cast shadow on the background. Every ring must read clearly when shrunk to 40 px: strong simple silhouette, no tiny details.
The four rings are four DIVISIONS of the same GOLD league and must look like one family made of the same material (polished warm gold). They differ only GRADUALLY, each one a little richer than the one before it, so that the four read as a clear step-by-step progression:
IV: a plain polished gold ring, a small yellow gem.
III: a thin beaded (tiny pearls) edge on the outside, a slightly larger gem.
II: the beaded edge plus a delicate engraved leaf pattern on the rim, a larger gem.
I: the beaded edge, the leaf pattern and two small pointed leaf flourishes at the top, the largest glowing gold gem.
Top-left = division IV (the plainest), top-right = III, bottom-left = II, bottom-right = I (the richest, but still clearly GOLD, not the next league).
Palette hints: gold #c8962c / #ffe08a.
```

## 5. Platina: as quatro divisões
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Four round avatar ring frames laid out in a 2x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained, all exactly the same outer size. NO text, NO letters, NO numbers. The CENTER of every ring is an empty circular hole filled with the same flat magenta #FF00FF (a portrait will be placed there later), the hole is about 62% of the ring's outer diameter. Each ring has a diamond-shaped gem set into the bottom center of the rim.
Style: the same hand-painted medieval metal as the game's coin-like medallions: thick worn metal rim, soft highlights, subtle grain, light from the top left, flat orthographic front view, no cast shadow on the background. Every ring must read clearly when shrunk to 40 px: strong simple silhouette, no tiny details.
The four rings are four DIVISIONS of the same PLATINUM league and must look like one family made of the same material (cool teal-white metal). They differ only GRADUALLY, each one a little richer than the one before it, so that the four read as a clear step-by-step progression:
IV: a plain smooth teal-white metal ring, a small mint gem.
III: a delicate engraved wave pattern around the rim, a slightly larger gem.
II: the wave pattern plus a thin glowing mint line along the inner edge, a larger gem.
I: the wave pattern, the glowing inner line and three small pointed crests at the top, the largest glowing mint-teal gem.
Top-left = division IV (the plainest), top-right = III, bottom-left = II, bottom-right = I (the richest, but still clearly PLATINUM, not the next league).
Palette hints: platinum #4aa7a0 / #b8fff2.
```

## 6. Diamante: as quatro divisões
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Four round avatar ring frames laid out in a 2x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained, all exactly the same outer size. NO text, NO letters, NO numbers. The CENTER of every ring is an empty circular hole filled with the same flat magenta #FF00FF (a portrait will be placed there later), the hole is about 62% of the ring's outer diameter. Each ring has a diamond-shaped gem set into the bottom center of the rim.
Style: the same hand-painted medieval metal as the game's coin-like medallions: thick worn metal rim, soft highlights, subtle grain, light from the top left, flat orthographic front view, no cast shadow on the background. Every ring must read clearly when shrunk to 40 px: strong simple silhouette, no tiny details.
The four rings are four DIVISIONS of the same DIAMOND league and must look like one family made of the same material (deep blue steel set with pale-blue crystals). They differ only GRADUALLY, each one a little richer than the one before it, so that the four read as a clear step-by-step progression:
IV: a plain deep blue steel ring, a small blue gem, no crystals.
III: the ring with two small faceted pale-blue crystals set at the sides, a slightly larger gem.
II: four small faceted crystals around the rim, a larger gem.
I: six faceted crystals around the rim and one taller crystal at the top, the largest bright blue gem.
Top-left = division IV (the plainest), top-right = III, bottom-left = II, bottom-right = I (the richest, but still clearly DIAMOND, not the next league).
Palette hints: diamond #4f7fe0 / #bcd7ff.
```

## 7. Mestre e 8. Senhor da Guerra (uma moldura cada, sem divisões)
```
Ring frame sheet for a medieval dark-fantasy mobile card game. Two round avatar ring frames side by side on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained, same outer size. NO text, NO letters, NO numbers. The CENTER of each ring is an empty circular hole filled with the same flat magenta #FF00FF (hole about 62% of the outer diameter). Each ring has a diamond-shaped gem set into the bottom center of the rim. Same style as the earlier rings: hand-painted medieval metal, soft highlights, light from the top left, flat front view, readable at 40 px.
Left = MASTER: dark violet metal with ornate gold edges and two small pointed wing-like flourishes at the sides, a glowing violet gem. Right = WARLORD (the top rank, the most impressive of all the rings): blackened red-gold metal with a small crown of spikes on the top, tiny flames licking up from the rim, a large glowing ruby gem.
Palette hints: master #8a4fc4 / #e2c0ff, warlord #c0392b / #ffd36a.
```

## Como vou usar (depois que vierem)
1. Recorto cada anel do magenta (fora e o furo do miolo) e guardo em `src/assets/ligas/<liga>-<divisao>.webp`.
2. O retrato do jogador entra por baixo do anel. O losango da liga já vem na arte; a divisão também aparece no anel (mais rico = divisão mais alta) e, se precisar, numa medalhinha desenhada pelo jogo.
3. A moldura que o jogador usa é a da **maior liga e divisão que alcançou na temporada anterior** (ver `docs/visao-geral.md`, seção do ranqueado).
