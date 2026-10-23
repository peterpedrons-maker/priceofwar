# Personagens da vila (cavaleiros e gente andando pela estrada)

O teste com silhuetas feitas por código (`public/mockups/vila/index.html?clean`) não combinou com a pintura. Solução: sprites pintados no mesmo estilo da vila (`src/assets/menu-vila.webp`). **Um prompt por personagem** (a IA se confunde com várias linhas): cada um gera uma tira de 4 quadros de passo; eu recorto, animo o passo e o deslocamento pela estrada.

Regras do projeto: só técnica de pintura; sem "realismo/foto/cinematográfico", sem nome de jogo; sem moldura, texto ou números. Fundo cinza chapado (vira transparente no recorte). Gerar 2–3 variantes de cada um e escolher a de quadros mais parecidos. Salvar em `src/assets/vila-<nome>.webp` (ou mandar no chat).

## 1) Soldado montado (`vila-riders-soldado.webp`)
```
Character sprite strip for game animation, painted in a dark medieval-fantasy painterly style with soft visible brushwork, warm amber torch rim lighting on one side and cool blue-violet shadows, matching a gritty war-kingdom village at dusk. A single mounted soldier on a brown horse, walking at a slow calm pace, strict side view facing right, dark steel armor, faded red cloak, holding a tall spear upright with a small purple pennant. Show exactly 4 animation frames of one walking cycle in a single horizontal row of 4 columns, evenly spaced. In all 4 frames it is the exact same character with the exact same size, scale, colors and outfit, standing on the same ground line at the same height; only the legs and arms change from frame to frame to show a smooth walking cycle (contact, passing, contact, passing). Small character, clean readable silhouette at a very small size, generous empty space between frames. Flat, solid mid-gray background with nothing else: no ground, no ground shadow, no scenery, no other characters. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark.
```

## 2) Batedor montado (`vila-riders-batedor.webp`)
```
Character sprite strip for game animation, painted in a dark medieval-fantasy painterly style with soft visible brushwork, warm amber torch rim lighting on one side and cool blue-violet shadows, matching a gritty war-kingdom village at dusk. A single mounted scout on a dark grey horse, walking at a slow calm pace, strict side view facing right, brown hooded cloak, holding a lit torch in one raised hand. Show exactly 4 animation frames of one walking cycle in a single horizontal row of 4 columns, evenly spaced. In all 4 frames it is the exact same character with the exact same size, scale, colors and outfit, standing on the same ground line at the same height; only the legs and arms change from frame to frame to show a smooth walking cycle (contact, passing, contact, passing). Small character, clean readable silhouette at a very small size, generous empty space between frames. Flat, solid mid-gray background with nothing else: no ground, no ground shadow, no scenery, no other characters. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark.
```

## 3) Guarda com tocha (`vila-guarda.webp`)
```
Character sprite strip for game animation, painted in a dark medieval-fantasy painterly style with soft visible brushwork, warm amber torch rim lighting on one side and cool blue-violet shadows, matching a gritty war-kingdom village at dusk. A single guard, walking at a calm pace, strict side view facing right, dark steel armor and a short cape, carrying a lit torch in one hand. Show exactly 4 animation frames of one walking cycle in a single horizontal row of 4 columns, evenly spaced. In all 4 frames it is the exact same character with the exact same size, scale, colors and outfit, standing on the same ground line at the same height; only the legs and arms change from frame to frame to show a smooth walking cycle (contact, passing, contact, passing). Small character, clean readable silhouette at a very small size, generous empty space between frames. Flat, solid mid-gray background with nothing else: no ground, no ground shadow, no scenery, no other characters. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark.
```

## 4) Camponês (`vila-campones.webp`)
```
Character sprite strip for game animation, painted in a dark medieval-fantasy painterly style with soft visible brushwork, warm amber torch rim lighting on one side and cool blue-violet shadows, matching a gritty war-kingdom village at dusk. A single peasant, walking at a calm pace, strict side view facing right, hooded brown cloak, carrying a wicker basket on one arm. Show exactly 4 animation frames of one walking cycle in a single horizontal row of 4 columns, evenly spaced. In all 4 frames it is the exact same character with the exact same size, scale, colors and outfit, standing on the same ground line at the same height; only the legs and arms change from frame to frame to show a smooth walking cycle (contact, passing, contact, passing). Small character, clean readable silhouette at a very small size, generous empty space between frames. Flat, solid mid-gray background with nothing else: no ground, no ground shadow, no scenery, no other characters. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark.
```

## 5) Lanceiro (`vila-lanceiro.webp`)
```
Character sprite strip for game animation, painted in a dark medieval-fantasy painterly style with soft visible brushwork, warm amber torch rim lighting on one side and cool blue-violet shadows, matching a gritty war-kingdom village at dusk. A single soldier, walking at a calm pace, strict side view facing right, leather and chainmail with a dark red tabard, carrying a long spear over the shoulder. Show exactly 4 animation frames of one walking cycle in a single horizontal row of 4 columns, evenly spaced. In all 4 frames it is the exact same character with the exact same size, scale, colors and outfit, standing on the same ground line at the same height; only the legs and arms change from frame to frame to show a smooth walking cycle (contact, passing, contact, passing). Small character, clean readable silhouette at a very small size, generous empty space between frames. Flat, solid mid-gray background with nothing else: no ground, no ground shadow, no scenery, no other characters. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark.
```

## 6) Monge com lanterna (`vila-monge.webp`)
```
Character sprite strip for game animation, painted in a dark medieval-fantasy painterly style with soft visible brushwork, warm amber torch rim lighting on one side and cool blue-violet shadows, matching a gritty war-kingdom village at dusk. A single monk, walking at a calm pace, strict side view facing right, long grey robe with a hood, holding a small glowing lantern in one hand. Show exactly 4 animation frames of one walking cycle in a single horizontal row of 4 columns, evenly spaced. In all 4 frames it is the exact same character with the exact same size, scale, colors and outfit, standing on the same ground line at the same height; only the legs and arms change from frame to frame to show a smooth walking cycle (contact, passing, contact, passing). Small character, clean readable silhouette at a very small size, generous empty space between frames. Flat, solid mid-gray background with nothing else: no ground, no ground shadow, no scenery, no other characters. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark.
```

## Como ligar
1. Eu recorto cada tira (fundo cinza → transparente) e monto o ciclo de passo.
2. Substituo as silhuetas do protótipo, gravo novo vídeo para aprovação e só então porto para `VillageScene.tsx` (com a opção "reduzir movimento").
3. Se os quadros de uma variante não ficarem parecidos, uso 2 quadros alternados + leve balanço, que ainda lê como passo.
