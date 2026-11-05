# Arte das Missões (botão do menu): ícone e fundo

Pedido do dono (rodada 26): o botão **Missões** do menu precisa de um **ícone próprio** (no mockup usei a coroa provisória) e de uma **arte de fundo**, no mesmo padrão dos outros botões (`menu-card-*.webp`, 4:1, terço esquerdo escuro e vazio). Mockup do painel: `public/mockups/missoes/`.
Regras do projeto: sem "realismo/foto/cinematográfico", sem nome de jogo, só a técnica de pintura; sem moldura, texto, números ou marca d'água.

## 1) Ícone (folha 3x1 com 3 opções, para o dono escolher)
Arquivo esperado: `src/assets/ui-icon-missoes.webp` (recortar a opção escolhida; o fundo cinza vira transparente como nos outros ícones do menu, ver README "Ícones do menu").
```
Sheet of three matching game UI icon options arranged in one row of three columns with generous empty space between them, on a flat, solid mid-gray background. Each icon is an embossed gold-and-bronze medieval-fantasy emblem with soft rim lighting, same style, same size, same lighting, each centered in its own cell, readable at a very small size (about 40 pixels), bold simple silhouette. Option 1: a rolled parchment scroll tied with a crimson ribbon and sealed with a round red wax seal, one end partly unrolled. Option 2: a small wooden notice board with a gold frame and two parchment sheets pinned to it by iron nails, one with a red wax seal. Option 3: a sealed folded map of a kingdom with a gold-edged corner and a red wax seal, a small gold compass rose on its face. Painterly medieval-fantasy game icon style, warm palette of gold, bronze, aged cream parchment and crimson, same look as a set of menu icons for a dark-fantasy card game. No text, no letters, no labels, no watermark, landscape composition, 3:1 aspect ratio, approx 1800x600px
```

## 2) Fundo do botão (banner 4:1)
Arquivo esperado: `src/assets/menu-card-missoes.webp` (1600×400; o jogo reduz e põe o degradê de leitura e o título por cima).
```
WIDE LANDSCAPE BANNER IMAGE, aspect ratio 4:1 (width:height), approx 1600x400px, very wide and short, a thin horizontal banner, NOT a square or portrait image. Epic painterly digital illustration for a game menu button background: a quest board in a torchlit medieval war camp seen from a low angle, a weathered wooden notice board covered with pinned parchment contracts and bounties, each sealed with red wax, a rolled scroll tied with a crimson ribbon in the foreground, a small leather pouch with a few gold coins spilling out beside it, an iron lantern casting warm light, a goose-feather quill in an inkwell, a dark canvas tent and a distant banner fading into shadow behind. Premium painterly fantasy key-art style, warm palette of amber candlelight, crimson, gold and deep shadow. Composition pushed toward the right two-thirds of the frame, leaving the left third and the top and bottom edges dark and uncluttered, since UI text and an icon sit on top of them in code. No text, no letters on the parchments, no UI, no watermark, no logo, wide banner orientation (1600x400, 4:1)
```

## Como ligar (quando as artes chegarem)
1. Colocar `ui-icon-missoes.webp` e `menu-card-missoes.webp` em `src/assets/`.
2. Trocar a coroa provisória do mockup/menu pelo ícone novo e usar o banner no botão (mesmo componente `MenuCard` dos outros botões).
3. Atualizar a tabela de arquivos em `art-prompts/README.md` e `docs/visao-geral.md`.
