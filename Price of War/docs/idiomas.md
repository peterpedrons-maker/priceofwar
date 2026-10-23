# Idiomas (português e inglês)

**Decisão do dono (rodada 27):** o jogo tem português do Brasil e inglês; a escolha aparece **na primeira abertura** (tela bilíngue `src/i18n/LanguageGate.tsx`) e depois em Opções → "Idioma / Language" (trocar recarrega a página). O português continua sendo o idioma "de origem": os textos no código ficam em português e **nada muda no modo português**.

## Como funciona
- `src/i18n/index.ts`: idioma guardado em `localStorage` (`pow.lang`), `t()`, `tEffect()` e o **tradutor de tela** (`startTranslator`, só em inglês).
- `src/i18n/en.json`: o dicionário. **Chave = texto em português**, valor = inglês. `{}` marca um pedaço que muda (número, nome); no valor pode ser `{}` (na mesma ordem) ou `{1}`, `{2}` (para trocar a ordem). O que vem dentro de `{}` também é traduzido (nome de carta dentro de uma frase, por exemplo).
- O tradutor troca o texto de cada nó de tela e os atributos `placeholder`, `aria-label`, `title`, `alt`, e junta os pedaços que o React escreve em sequência ("Faltam ", "3", " cartas") para achar o padrão. Texto sem tradução aparece em português. Para um bloco nunca ser traduzido: atributo `data-no-i18n`.
- **Cartas:** nomes e identificadores não mudam (a coleção é por nome em português). Nome na tela vem do dicionário; **efeito** de carta é traduzido nos dados (`tEffect` em `FitEffectText`), porque o desenho do texto reconhece as palavras de regra: em inglês `N damage`, `N gold`, `**Armed**`, `**Contract N**`, `**Termination:**`, `The equipped unit becomes **Armed**` (ver `STAT_TOKEN` e `renderEffectText`).
- **Imagens com texto desenhado:** as faixas BATALHA/VITÓRIA/DERROTA (`src/i18n/banners.ts`): em inglês usa `src/assets/banner-<batalha|vitoria|derrota>-en.webp` se existir; enquanto não existe, uma faixa em SVG dourada ("BATTLE!", "VICTORY!", "DEFEAT"). As **texturas 3D das cartas** (abertura de booster, visualizador, Sala de Coleção) têm uma pasta por idioma: `src/assets/card3d` (PT) e `src/assets/card3d-en` (EN; sem a carta lá, cai no PT) em `src/i18n/cardFaces.ts`. Gerar o inglês: `LANG_UI=en node tools/card3d/render-faces.cjs <pasta>` com o jogo em `localhost:4513/?debug` e depois `DST=src/assets/card3d-en python3 tools/card3d/to-webp.py <pasta>`.
- **Servidor:** as mensagens de erro e de partida continuam em português no servidor e o tradutor de tela as traduz (todas estão no dicionário).

## Vocabulário em inglês (use sempre as mesmas palavras)
Coroas = **Crowns** · Ouro = **Gold** · Vanguarda/Retaguarda = **Vanguard/Rearguard** · Reserva = **Reserve** · Cemitério = **Graveyard** · Baralho = **Deck** · Tática/Emboscada/Terreno/Relíquia/Equipamento = **Tactic/Ambush/Terrain/Relic/Equipment** · gatilhos Convocação/Ofensiva/Queda/Manobra/Comando/Postura/Reforço = **Summon/Offensive/Fall/Maneuver/Command/Stance/Reinforce** · Armada = **Armed** · Contrato/Rescisão = **Contract/Termination** · Escudo N = **Shield N** · Guarda = **Guard** · Desafios = **Challenges** · Loja = **Shop** · Missões = **Missions** · ligas Ferro/Bronze/Prata/Ouro/Platina/Diamante/Mestre/Senhor da Guerra = **Iron/Bronze/Silver/Gold/Platinum/Diamond/Master/Warlord** · cara ou coroa = **Heads/Tails**.

## Fluxo para texto novo (obrigatório)
1. Escreva o texto em português no código, como sempre.
2. Rode `npx tsx tests/i18n.ts`: ele lista o que está sem tradução (usa `tools/i18n/extrair.ts`, que varre `src/` e `server/`).
3. Traduza em `src/i18n/en.json`. **Carta nova: nome e efeito** (o teste confere também o catálogo). O que não é texto de jogador (CSS, ids) fica em `tools/i18n/ignorar.json`.
4. Confira em inglês: `window`? Use o roteiro `scratchpad`: abrir `?debug`, escolher English e olhar a tela; buscar sobras em português.
- Cuidado com frase dividida por elementos (`<b>`): cada pedaço de texto é traduzido sozinho; escreva o pedaço já pensando na ordem das palavras em inglês.
