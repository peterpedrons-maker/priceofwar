# Terrenos com efeito visual ainda fora do jogo: Solo Sagrado (Cardeal) e Acampamento (Mercenários)

Guardado para retomar depois. **Os dois efeitos visuais estão prontos como mockup; falta existir a carta** (nome, custo, efeito de jogo) e ligar o visual a ela. Nada aqui está aplicado no jogo.
O que já está no jogo desta família: a **muralha da Fortaleza de Pedra** (`src/terrainFx.ts`, ver `docs/animacoes.md`). Os dois abaixo devem entrar pelo mesmo caminho.

## Como ligar um terreno novo ao jogo (receita)
1. Criar a carta de Terreno em `src/engine/catalog.ts` com `fx: 'solo_sagrado'` (ou `'acampamento'`) e as `passives`/`abilities` dela; atualizar `DECK_RECIPES`, rodar `npm run build:edge`, `npm test` e o laboratório (`docs/balanceamento.md`).
2. Em `src/terrainFx.ts`: acrescentar o tipo em `TerrainFxKind` e um desenho para ele em `drawSide` (hoje só há a muralha). O mecanismo (um canvas, uma instância por lado, sobe/fica/desaba, medição pelo DOM, opção "Terrenos animados") já serve.
3. Em `src/App.tsx`: o trecho "Terreno com efeito permanente" lê `getCardDef(...).fx === 'muralha'`; trocar por uma leitura que devolva o tipo (`'muralha' | 'solo_sagrado' | 'acampamento'`).
4. Pré-carregar as imagens em `preloadTerrainFx`, conferir no celular (desempenho) e atualizar `docs/animacoes.md` e `docs/visao-geral.md`.

## 1. Solo Sagrado (Cardeal)
**Ideia do dono:** um terreno que deixa claro, o tempo todo, que o lado do jogador está em solo sagrado; o efeito tem de ser **sutil**, porque fica sempre na tela (a primeira versão foi considerada agressiva demais).
- **Visual aprovado (mockup):** `tools/vfx/mockup-src/solo-sagrado.js`. GIF de referência: `docs/terrenos/solo-sagrado.gif`.
  - Na jogada: um clarão curto na casa do terreno e uma onda de luz dourada que varre só o lado do jogador (some em uns 3 s).
  - Em repouso: tom dourado muito fraco no chão (só nas casas e entre as cartas, "furado" onde há carta), um sigilo sagrado (círculos, runas e cruz) quase transparente girando devagar, 1 ou 2 partículas de luz subindo, aura discreta na carta do terreno, brilho fraco sob as unidades.
  - Ao sair o terreno: tudo se apaga aos poucos.
  - Intensidade única `I` (0,3 em repouso, 0,8 na entrada). Se ficar forte ou fraco no celular, mexer só nela.
  - Só o lado de quem jogou o terreno tem o efeito.
- **Carta (PROPOSTA, nada decidido):** nome provisório "Solo Sagrado", Terreno, vida 6, custo 2. Efeito possível, no tema de cura do Cardeal: "Suas unidades na Retaguarda: +1 de cura recebida" (já existe `healBonus` em `aura`, ver `docs/efeitos.md`) ou "no fim do seu turno, cure 1 de vida a uma unidade sua". Medir no laboratório antes de aceitar.
- **Falta:** a carta e o desenho dele em `terrainFx.ts` (portar o mockup para TypeScript, em camada de faixa e não de tela inteira, como a muralha).

## 2. Acampamento dos Mercenários (nome provisório "Acampamento de Contratos")
Hoje o deck Mercenários **não tem nenhuma carta de Terreno** (só Capitão tem Fortaleza de Pedra e Pântano Maldito).
- **Visual aprovado (mockup v4, com a arte pintada do dono):** `tools/vfx/mockup-src/acampamento4.js`. GIF de referência: `docs/terrenos/acampamento-mercenarios.gif`. Versões antigas (`acampamento.js` a `acampamento3.js`) são estudos em código puro, que o dono achou "cartoon".
  - Arte (recortada do magenta, em `public/mockups/terrenos/art/`): `tenda_a`, `tenda_b`, `rack`, `caixotes`, `barril`, `mesa`, `bau`, `sacos`, `fogueira`, `mastro`, `bandeirolas`, `cerca`, mercenários (`m_beber`, `m_afiar`, `m_guarda`, `m_anda_a/b/c`, `m_contar_a/b`) e texturas (`tex_pano`, `tex_madeira`, `tex_terra`). Prompts originais: `art-prompts/terreno-acampamento.md`.
  - Cena desenhada **sem luz**, escurecida como noite e iluminada só pela fogueira, portas das barracas, vela e baú (mesmo pipeline da muralha).
  - Montagem: terra batida, estacas e corda, barracas sobem, adereços caem com poeira e tremor leve, fogueira acende, dois mercenários chegam andando (quadros de caminhada alternados) e se sentam, guarda na barraca, bandeirolas e estandarte. Ao sair o terreno tudo desaba e os mercenários fogem.
  - Animado por código: chamas em línguas, brasas, fumaça e vapor da panela, brilho do ouro do baú, vela.
- **Carta (PROPOSTA, nada decidido):** "Acampamento de Contratos", Terreno, vida 6, custo 2. Efeitos possíveis ligados à manutenção (o motor já tem `discount` na manutenção e `upkeepFlat` nos modos da Relíquia, ver `docs/efeitos.md`): "a manutenção das suas cartas custa 1 a menos no total" ou "no início do seu turno, se tiver 3 ou mais unidades, ganhe 1 de ouro". Mercenários já está forte nas simulações (`docs/balanceamento.md`, rodada 19), então medir com cuidado.
- **Falta:** definir a carta, portar o mockup para `terrainFx.ts` (as imagens passam para `src/assets/terrenos/` em webp) e conferir o peso no celular (são muitas peças e camadas de luz; manter o desenho só na faixa de baixo do tabuleiro e respeitar a opção "Terrenos animados").

## Lições que valem para qualquer terreno novo
- Terreno de **estrutura** (muralha, acampamento) pode ser um objeto bem visível; terreno de **clima/ambiente** (sagrado, chuva, pântano) tem de ser **sutil**. Evitar feixes de luz passando por cima da arte (o dono não gostou).
- A faixa livre do tabuleiro é a de **baixo** (e a de cima para o adversário); o quadrado fechando o lado cobre os nomes das fileiras e a barra de fase, então o desenho "em U" ou só na faixa de baixo é o caminho.
- Peças de arte vindas da IA: recortar o magenta, conferir a perspectiva (um portão em 3/4 foi desentortado com um cisalhamento e espelhado), preencher buracos e sobrepor as peças para não aparecer fresta.
- Texturas e peças são guardadas no repositório; os GIFs de referência estão em `docs/terrenos/`.
