# Menu inicial em vila (proposta aprovada na estrutura, rodada 26)

Mapeamento: Quartel→Desafios, Arena→Online + Ranking, Biblioteca→Coleção, Forja→Meu Deck, Mercado→Loja, Quadro de avisos→Missões, Academia→Tutoriais. Config e Opções: ícones pequenos nos cantos. Botão **Jogar/Continuar** grande e sempre visível.

Cuidados: nome escrito sob cada prédio; prédios só na faixa central da arte (telas de alturas diferentes); badge vermelho em prédio com novidade (missões a coletar, loja); animações leves por código (fumaça, bandeiras, pulso no prédio tocado).

Estado: prompt em `art-prompts/vila.md`, mockup em `public/mockups/vila/` (fundo provisório). Falta: dono gerar a arte, depois ligar no `MainMenu` com hotspots em % e remover as placas atuais.

## Arte recebida e animação (rodada 26)
Arte da vila em `src/assets/menu-vila.webp` (704×1520). Animação **por código sobre a mesma imagem**, sem pedir variações à IA (quadros gerados à parte não saem idênticos e tremem): fumaça da chaminé/incêndio/castelo e brasas em canvas, brilhos tremeluzentes (fornalha, tochas, lanternas, janelas) com `mix-blend-mode: screen`, badges pulsando. Protótipo em `public/mockups/vila/` (coordenadas em px da imagem; o palco escala por "cover"). Possíveis extras: nuvens se movendo, cavaleiros/pessoas andando na estrada (sprites pequenos), bandeiras do Quartel (pedir camada separada se quiser).
Prédios (x,y na imagem): Academia 90,470 · Biblioteca 130,700 · Forja 340,640 · Mercado 570,590 · Missões 560,830 · Arena 140,990 · Quartel 510,1110.

## No jogo (rodada 26)
`src/VillageScene.tsx` (arte `menu-vila.webp`, hotspots, brilhos e canvas de fumaça/brasas; respeita "reduzir movimento") substitui o fundo e as placas do `MainMenu`. Sem botão "Jogar" (decisão do dono): o Quartel (Desafios) é o atalho. Toques: Quartel→Desafios, Arena→Online (Casual/Ranqueado/Amigo), Biblioteca→Coleção, Forja→Meu Deck, Mercado→Loja, Academia→Tutoriais, Missões→tela de missões (`MissionsScreen`). Rodapé: Config., Ranking, Opções (+GM). Badge do Quadro = missões a coletar.

Rodada 26b: logo removido do menu; nomes dos prédios viraram plaquetas douradas com medalhão e ícone (clampadas para não sair da tela).
Rodada 26c: plaquetas reusam a moldura de ouro do menu antigo (menu-plaque-*), com pontas nos dois lados, nome + subtítulo do destino (Quartel = Desafios/batalhas, Arena = partidas online).

Rodada 26d (substitui o mapeamento anterior): só texto dourado com contorno escuro, sem contêiner, nomes pela função. **Castelo do horizonte (fumaça/combate) = Desafios**; Arena = Online; Quartel (fortaleza com mesa de mapa) = Ranking; Biblioteca = Coleção; Forja = Meu Deck; Mercado = Loja; Quadro = Missões (em breve); Academia = Tutoriais. Rodapé só com Config. e Opções (+GM).

Rodada 26e: nome (só texto) fica em chão livre ao lado do prédio, separado da área tocável (`BUILDINGS`: x,y,w,h = toque; lx,ly = nome). Ao trocar a arte, reposicione os dois.

Rodada 26g (referência do dono: menu de vila de outro jogo): nome pequeno, branco em negrito com contorno fino, linha dourada e setinha embaixo, medalhão com ícone em cima (badge no medalhão), tudo em chão calmo ao lado do prédio. A ideia das placas em branco (prompt acima) fica como plano B.

Rodada 26h: rótulos (medalhão + nome + linha) agora ficam sobre o corpo de cada prédio, como na referência.

Rodada 26i: teste (`public/mockups/vila/index.html?clean`, vídeo `vila-vivo.mp4`) com nuvens escuras atravessando o céu e 2 cavaleiros + 3 pessoas (2 com tocha) andando pela estrada em silhuetas desenhadas por código (escala por profundidade, viram ao inverter o sentido). Bandeiras do forte ficaram de fora: pedem camada recortada. Se aprovado, portar para `VillageScene.tsx`.

Rodada 26j: personagens da estrada redesenhados por código com técnica de pintura (curvas, gradiente, luz de contorno quente, sombra fria, textura de pincel, render em 4x e redução, escurecimento por profundidade): 2 cavaleiros (soldado com lança e pendão, batedor com tocha) e 4 pessoas (guarda com tocha, camponês com cesta, lanceiro, monge com lanterna), 8 quadros de passo. Protótipo em `public/mockups/vila/index.html?clean` (vídeo `vila-vivo.mp4`). Os prompts de sprites pintados pela IA (`art-prompts/vila-personagens.md`) ficam como opção de qualidade maior.

Rodada 26k (substitui os personagens desenhados por código): os cavaleiros e as pessoas agora são **recortes das próprias figuras pintadas na vila** (mesmo estilo da arte). Ferramentas: `tools/vila/recortar-personagens.py` (acha cada figura pela diferença para o fundo estimado) e `tools/vila/montar-sprites.py` (gera `spr-*.png`, `spr-meta.json` e `vila-bg-limpo.webp`, a vila sem as figuras originais, com o buraco preenchido). Protótipo: `public/mockups/vila/index.html?clean` (vídeo `vila-vivo.mp4`): 2 cavaleiros (o mesmo recorte, um sobe e outro desce espelhado) + 4 pessoas que descem a estrada olhando para a câmera e voltam ao topo; balanço do passo por código (sobe/desce + inclinação), sombra no chão, escurecimento por profundidade.
**Sem atravessar:** quem anda no mesmo sentido mantém distância do da frente (diminui a velocidade); sentidos opostos andam em faixas separadas da estrada (cavaleiros a ±40 px, pessoas no meio).
Limite: os recortes são poses fixas (a pintura não tem quadros de passo), então a animação é de deslizar com balanço; para passos de verdade, usar as folhas de sprites geradas pela IA (`art-prompts/vila-personagens.md`).

Rodada 26l (ideia do dono, substitui a de andar pela estrada): as figuras **ficam paradas onde foram pintadas**, só com movimento mínimo (respirar, balançar o peso, 1 px de deslocamento, fases diferentes); acaba o problema de atravessar uns aos outros. `vila-bg-limpo.webp` tem as figuras animadas removidas (os outros personagens pintados continuam na imagem); `spr-meta.json` guarda o ponto do pé de cada sprite (`x`,`y` na imagem). Protótipo: `public/mockups/vila/index.html?clean`, vídeo `vila-vivo.mp4`.

Rodada 26m: no jogo (`VillageScene.tsx`): figuras paradas respirando (mais movimento: respiração 3–4,5%, balanço ~1,4°, deslocamento ~1,4 px), nuvens, fumaça, brasas e luzes; `src/assets/menu-vila.webp` agora é a vila **sem** as figuras animadas (original da IA no histórico do git/`public/mockups/vila/vila-bg.webp`), sprites em `src/assets/vila/`. "Reduzir movimento": desenha as figuras paradas, sem nuvens nem respiração.

Rodada 26n: nomes reposicionados à mão na base/ao lado de cada prédio (Desafios à esquerda do castelo; Coleção ao lado da torre, Meu Deck na estrada, etc.) para não cobrir a arquitetura.

Rodada 26o: nomes de volta sobre o PÉ de cada prédio (base/fundação), perto da construção, sem cobrir o centro nem os detalhes principais (janelas da torre, fornalha, portão da arena, castelo).
