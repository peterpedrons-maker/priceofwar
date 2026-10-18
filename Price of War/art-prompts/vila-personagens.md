# Personagens da vila (cavaleiros e gente andando pela estrada)

O teste com silhuetas feitas por código (`public/mockups/vila/index.html?clean`) não combinou com a pintura. Solução: sprites pintados no mesmo estilo da vila (`src/assets/menu-vila.webp`), gerados pela IA em folhas de quadros e recortados por mim; o jogo anima o passo (troca de quadros) e o deslocamento pela estrada.
Regras do projeto: só técnica de pintura; sem "realismo/foto/cinematográfico", sem nome de jogo; sem moldura, texto ou números. Fundo cinza chapado (vira transparente no recorte, como os ícones do menu). Gerar 2–3 variantes de cada folha e escolher a que tiver os quadros mais parecidos entre si.
Arquivos esperados: `src/assets/vila-cavaleiros.webp` e `src/assets/vila-gente.webp` (a folha inteira; eu recorto os quadros).

## 1) Cavaleiros (2 cavaleiros x 4 quadros de passo)
```
Character sprite sheet, game animation frames, painted in a dark medieval-fantasy painterly style with soft visible brushwork, warm amber torch rim lighting on the side and cool blue-violet shadows, matching a gritty war-kingdom village at dusk. Two horse riders walking calmly at a slow pace, strict side view facing right, each shown in 4 animation frames of one walking cycle arranged in a grid of 2 rows and 4 columns (row 1: a mounted soldier in dark steel armor and a faded red cloak holding a tall spear with a small purple pennant; row 2: a mounted scout in a brown hooded cloak holding a lit torch). In each row the 4 frames must be the same character, same size, same scale and same position on the frame, only the legs of the horse and the rider's slight bobbing change from frame to frame, hooves landing on a common ground line. Small characters, clean readable silhouette at a very small size, generous empty space between frames. Flat, solid mid-gray background with nothing else, no ground, no shadows on the ground, no scenery. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark.
```

## 2) Gente a pé (4 personagens x 4 quadros de passo)
```
Character sprite sheet, game animation frames, painted in a dark medieval-fantasy painterly style with soft visible brushwork, warm amber torch rim lighting on the side and cool blue-violet shadows, matching a gritty war-kingdom village at dusk. Four different villagers walking at a calm pace, strict side view facing right, each shown in 4 animation frames of one walking cycle, arranged in a grid of 4 rows and 4 columns (row 1: a guard in dark armor carrying a lit torch; row 2: a peasant in a hooded brown cloak carrying a basket; row 3: a soldier carrying a long spear over the shoulder; row 4: a monk in a grey robe holding a small lantern). In each row the 4 frames must be the same character, same size, same scale and same position, only the legs and arms swing from frame to frame, feet landing on a common ground line. Small characters, clean readable silhouette at a very small size, generous empty space between frames. Flat, solid mid-gray background with nothing else, no ground, no shadows on the ground, no scenery. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark.
```

## Como ligar
1. Salvar as folhas em `src/assets/` com os nomes acima.
2. Eu recorto cada quadro (fundo cinza → transparente), monto o ciclo de passo e substituo as silhuetas do protótipo; só depois porto para `VillageScene.tsx` (com a opção "reduzir movimento").
3. Se os quadros de uma variante não ficarem parecidos, uso 2 quadros alternados + leve balanço, que ainda lê como passo.
