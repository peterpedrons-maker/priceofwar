# Vila / Reino (novo menu inicial)

Decisão do dono (rodada 26): o menu vira uma **vila** com prédios tocáveis. Mapeamento: Quartel→Desafios, Arena→Online+Ranking, Biblioteca→Coleção, Forja→Meu Deck, Mercado→Loja, Quadro de avisos→Missões, Academia→Tutoriais. Config e Opções = ícones pequenos no canto; botão Jogar/Continuar sempre visível. Mockup: `public/mockups/vila/`; doc: `docs/menu-vila.md`.

Regras: só técnica de pintura, sem "realismo/foto/cinematográfico", sem nome de jogo, sem moldura, texto ou números. Gerar 2–3 variantes e escolher. Formato vertical ~9:19.5 (ex.: 1080×2340). Prédios na faixa central (de 18% a 78% da altura); topo e rodapé escuros e simples (barra superior e botão Jogar).

## Prompt (vila completa)
```
VERTICAL PORTRAIT IMAGE, aspect ratio 9:19.5 (very tall, like a modern phone screen), approx 1080x2340px. Epic painterly digital illustration of a small fortified medieval-fantasy war-kingdom village at dusk, seen from a slightly elevated three-quarter bird's-eye angle, warm dark-fantasy palette of deep blue-violet shadows, amber torch light and ember-orange glows, matching a gritty war-torn heroic mood. Seven clearly separated, easily readable landmark buildings arranged along a winding cobbled road that climbs from the bottom to a distant castle on the horizon, each building distinct in silhouette and well spaced so none overlaps another: (1) a stone barracks fortress with banners and a large war-map table visible under an open awning; (2) a round stone arena with crowd stands and crossed swords above the gate; (3) a tall library-archive tower with glowing arched windows and stacks of scrolls; (4) a blacksmith forge with a huge glowing furnace, anvil and chimney smoke; (5) a busy market square with colorful striped stalls and hanging lanterns; (6) a wooden notice board in front of a small hut, covered with pinned parchment notices; (7) a small training academy courtyard with wooden practice dummies and weapon racks. All seven buildings are placed inside the central 60% of the image height. The top 15% is a dark stormy sky with drifting embers and smoke, calm and uncluttered; the bottom 20% is a dark, quiet foreground of road and shadowed stones with no important details, leaving room for interface buttons. Soft rim lighting, rich painterly brushwork with visible texture, strong depth and atmospheric haze, tiny people and horses for scale. ARTWORK ONLY, no frame, no border, no title, no letters, no numbers, no text, no watermark, no user interface.
```

## Variantes (acrescentar ao fim do prompt acima, uma por geração)
- **Ao anoitecer, tochas** (padrão acima).
- **Amanhecer nublado:** troque "at dusk" por "at cold misty dawn, pale gold light breaking through grey clouds", mantendo o resto.
- **Noite de lua cheia:** troque "at dusk" por "under a huge pale moon, deep indigo night, windows and furnaces glowing warm", mantendo o resto.

## Como ligar
Salvar em `src/assets/menu-vila.webp`; hotspots por porcentagem em `docs/menu-vila.md` (ajustar depois da arte real).
