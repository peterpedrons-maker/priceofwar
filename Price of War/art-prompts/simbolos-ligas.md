# Símbolos das ligas (ranqueado): prompt para gerar com IA

O **símbolo da liga** (emblema) é diferente da **moldura do retrato**: a moldura é o anel em volta do retrato (já entregue, `src/assets/ligas/`); o símbolo é o brasão da liga atual, grande, usado na tela de Ligas, no fim da partida e no ranking. Mockup com símbolos provisórios: `docs/janelas/ranqueado-simbolos-provisorios.png` e `ranqueado-tela-ligas.png`.
Oito brasões em forma de escudo, um símbolo heráldico por liga, mais ricos a cada liga. Sem texto; fundo magenta `#FF00FF` chapado (para recortar). A divisão (IV a I) é desenhada pelo jogo, em losangos, não no símbolo.

## Prompt: folha com os oito símbolos
```
Emblem sheet for a medieval dark-fantasy mobile card game. Eight heraldic shield-shaped rank emblems laid out in a 4x2 grid on a perfectly flat solid magenta #FF00FF background, generous spacing, each fully contained, all the same size. NO text, NO letters, NO numbers.
Style: hand-painted medieval metal and enamel, thick worn metal rim, soft highlights, light from the top left, flat front view, no cast shadow on the background. Each emblem is a shield with a bold simple heraldic symbol in the middle; the symbol must read clearly when shrunk to 48 px. Each emblem is richer than the previous one but all clearly belong to one family.
From lowest to highest rank:
1) IRON: dull dark grey iron shield with a plain simple kettle helmet, a few rivets.
2) BRONZE: warm bronze shield with two crossed swords.
3) SILVER: polished silver shield with a castle tower.
4) GOLD: polished gold shield with a lion head and a small laurel branch on each side.
5) PLATINUM: cool teal-white shield with a winged wyvern, delicate engraved edge.
6) DIAMOND: deep blue steel shield with a crown made of faceted pale-blue crystals.
7) MASTER: dark violet shield with gold edges, an upright sword with two large wings.
8) WARLORD (top rank): blackened red-gold shield with a great horned war helmet wreathed in flames and two crossed greatswords behind it, the most impressive of the eight.
Palette hints: iron #7d838c, bronze #9a5f2c / #e2a56a, silver #9aa6b3 / #eef3f8, gold #c8962c / #ffe08a, platinum #4aa7a0 / #b8fff2, diamond #4f7fe0 / #bcd7ff, master #8a4fc4 / #e2c0ff, warlord #c0392b / #ffd36a.
```
Se a folha vier fraca: peça um símbolo por vez com o mesmo texto de estilo. Depois: recorto do magenta e guardo em `src/assets/ligas/simbolo-<liga>.webp`.
