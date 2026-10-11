# Artes das 13 cartas novas (Capitão e Mercenários, rodada 23)

As cartas já estão no jogo **sem arte** (a janela de arte fica vazia). Todas são **Padrão** (paisagem ~16:10, 1600×1000), no estilo de pintura medieval sombria do resto do jogo (ver `art-prompts/README.md`, "Os dois estilos de carta" e "Variedade de estilo pictórico"); Terreno e Relíquia também são Padrão. Sem texto, sem letras, sem números na imagem. Cada cena é uma só imagem clara que lê bem pequena.

Prefixo de estilo para todos: `Medieval dark-fantasy card illustration, hand-painted look, warm torchlight and muted earth tones, strong readable silhouette, landscape 16:10, no text, no letters, no numbers, no watermark.`

## Capitão (disciplina, formação, movimento)
1. **Corneteiro da Coluna** (Infantaria 1/2, custo 2): `A young infantry bugler marching at the head of a column of soldiers, raising a brass horn to his lips, the column of spears and shields stretching behind him into the dust of the road.`
2. **Tenente de Marcha** (Infantaria 2/3): `A lieutenant in plain steel and a red sash striding between two moving ranks, pointing the way with a short baton, soldiers shifting positions around him in orderly motion.`
3. **Escolta Montada** (Cavalaria 3/3, custo 2): `A light cavalry rider in a quick escort gallop along the flank of an infantry line, lance lowered, banner trailing, a swirl of dust behind the horse.`
4. **Guarda de Fileira** (Infantaria 2/5, custo 3): `A heavily armored rear-rank guard in a kite shield and long mail, standing firm behind the front line with his shield angled up to cover the soldiers ahead.`
5. **Brigadeiro Voss, Quebra-Linhas** (Infantaria 4/5, custo 4): `A veteran brigadier with a battered breastplate and a scarred face charging straight at an enemy commander's banner, sword drawn, his men breaking through the line behind him.` (se for Full Art, pedir retrato 1024×1424 com um momento diferente: ele parado com o capacete na mão)
6. **Passo Cadenciado** (Tática): `Ranks of infantry stepping in perfect unison across a muddy field, boots hitting the ground together, drumbeat implied by the rhythm of the legs and shields.`
7. **Revista de Tropas** (Tática): `A commander walking down the front of a line of soldiers on parade, inspecting armor and weapons, a clerk behind him taking notes.`
8. **Resposta Disciplinada** (Emboscada): `A line of soldiers snapping their shields shut together at a sudden attack, an overwhelming wall of steel with spears leveled over the top.`
9. **Campo de Treino** (Terreno): `A training ground at dawn: wooden dummies, a sword rack, a worn dirt circle with soldiers sparring in the distance, a flag on a pole.`
10. **Mapa de Campanha** (Relíquia): `A large old campaign map laid out on a field table, weighted with daggers and wooden figures, an inked route winding across it, a candle at the corner.`

## Mercenários (ouro, manutenção, contratos)
11. **Sentinela de Aluguel** (Infantaria 1/5, custo 2): `A hired sentry in a mismatched, too-large helmet standing guard at a gate with a heavy shield, a small pouch of coins hanging at his belt, tired but dependable.`
12. **Atirador de Aluguel** (Arqueiro 3/2, custo 2): `A hired crossbowman crouched behind a barricade, aiming with one eye closed, a pile of coins on a barrel beside him, quick and sharp.`
13. **Carta Branca** (Emboscada, custo 3): `A hand sliding a sealed blank contract across a table to a scowling captain, a heavy purse of coins on top of it, and in the background the enemy attack suddenly stopping.`

Depois de gerar: salvar em `src/assets/` como `card-<nome>.webp` e ligar no `ART_BY_NAME` de `src/App.tsx` (mesmo caminho das outras cartas).
