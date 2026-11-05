# Ícones dos prédios da vila (medalhões do menu)

Hoje o Quadro de Missões usa a coroa (igual ao contador de coroas) e Coleção/Meu Deck usam ícones de carta parecidos. Um prompt por ícone (a IA se confunde com várias opções por folha). Mesmo padrão dos outros ícones do menu (`src/assets/ui-icon-*.webp`): emblema dourado/bronze em relevo, fundo cinza chapado que vira transparente no recorte, legível em ~40 px.
Regras do projeto: só técnica de pintura; sem "realismo/foto/cinematográfico", sem nome de jogo; sem texto, números ou marca d'água. Gerar 2–3 variantes e escolher.
Onde entra: `src/VillageScene.tsx` (mapa `ICONS`) e o mockup/`MissionsScreen` se quiser.

## 1) Missões (`src/assets/ui-icon-missoes.webp`)
```
Single game UI icon, an embossed gold-and-bronze medieval-fantasy emblem with soft warm rim lighting, centered, bold simple silhouette that stays readable at a very small size (about 40 pixels): a rolled parchment scroll tied with a crimson ribbon and sealed with a round red wax seal, one end partly unrolled, with a small gold quill crossed behind it. Painterly dark-fantasy game icon style, warm palette of gold, bronze, aged cream parchment and crimson, same look as a set of menu icons for a dark-fantasy card game. Flat, solid mid-gray background, nothing else, no ground, no shadow on the ground. No text, no letters, no numbers, no labels, no watermark, square 1:1 aspect ratio, approx 1024x1024px
```

## 2) Missões, alternativa: quadro de avisos
```
Single game UI icon, an embossed gold-and-bronze medieval-fantasy emblem with soft warm rim lighting, centered, bold simple silhouette that stays readable at a very small size (about 40 pixels): a small wooden notice board with a gold frame and two parchment sheets pinned to it by iron nails, one of them with a red wax seal. Painterly dark-fantasy game icon style, warm palette of gold, bronze, aged cream parchment and crimson, same look as a set of menu icons for a dark-fantasy card game. Flat, solid mid-gray background, nothing else, no ground, no shadow on the ground. No text, no letters, no numbers, no labels, no watermark, square 1:1 aspect ratio, approx 1024x1024px
```

## 3) Coleção (`src/assets/ui-icon-colecao.webp`)
```
Single game UI icon, an embossed gold-and-bronze medieval-fantasy emblem with soft warm rim lighting, centered, bold simple silhouette that stays readable at a very small size (about 40 pixels): a thick open leather-bound tome with gold corner plates and a few small playing cards fanned out of its pages, a red ribbon bookmark hanging down. Painterly dark-fantasy game icon style, warm palette of gold, bronze, aged leather and crimson, same look as a set of menu icons for a dark-fantasy card game. Flat, solid mid-gray background, nothing else, no ground, no shadow on the ground. No text, no letters, no numbers, no labels, no watermark, square 1:1 aspect ratio, approx 1024x1024px
```

## Como ligar
Recorto o fundo cinza (transparente), reduzo para 128 px, salvo em `src/assets/` e troco em `ICONS` (`missoes`, `biblioteca`). O banner 4:1 de Missões (`missoes.md`, item 2) não é mais necessário: o menu agora é a vila.
