# Menu inicial em vila (proposta aprovada na estrutura, rodada 26)

Mapeamento: Quartel→Desafios, Arena→Online + Ranking, Biblioteca→Coleção, Forja→Meu Deck, Mercado→Loja, Quadro de avisos→Missões, Academia→Tutoriais. Config e Opções: ícones pequenos nos cantos. Botão **Jogar/Continuar** grande e sempre visível.

Cuidados: nome escrito sob cada prédio; prédios só na faixa central da arte (telas de alturas diferentes); badge vermelho em prédio com novidade (missões a coletar, loja); animações leves por código (fumaça, bandeiras, pulso no prédio tocado).

Estado: prompt em `art-prompts/vila.md`, mockup em `public/mockups/vila/` (fundo provisório). Falta: dono gerar a arte, depois ligar no `MainMenu` com hotspots em % e remover as placas atuais.

## Arte recebida e animação (rodada 26)
Arte da vila em `src/assets/menu-vila.webp` (704×1520). Animação **por código sobre a mesma imagem**, sem pedir variações à IA (quadros gerados à parte não saem idênticos e tremem): fumaça da chaminé/incêndio/castelo e brasas em canvas, brilhos tremeluzentes (fornalha, tochas, lanternas, janelas) com `mix-blend-mode: screen`, badges pulsando. Protótipo em `public/mockups/vila/` (coordenadas em px da imagem; o palco escala por "cover"). Possíveis extras: nuvens se movendo, cavaleiros/pessoas andando na estrada (sprites pequenos), bandeiras do Quartel (pedir camada separada se quiser).
Prédios (x,y na imagem): Academia 90,470 · Biblioteca 130,700 · Forja 340,640 · Mercado 570,590 · Missões 560,830 · Arena 140,990 · Quartel 510,1110.

## No jogo (rodada 26)
`src/VillageScene.tsx` (arte `menu-vila.webp`, hotspots, brilhos e canvas de fumaça/brasas; respeita "reduzir movimento") substitui o fundo e as placas do `MainMenu`. Sem botão "Jogar" (decisão do dono): o Quartel (Desafios) é o atalho. Toques: Quartel→Desafios, Arena→Online (Casual/Ranqueado/Amigo), Biblioteca→Coleção, Forja→Meu Deck, Mercado→Loja, Academia→Tutoriais, Missões→aviso "em breve" (sem tela ainda). Rodapé: Config., Ranking, Opções (+GM). Badges: prop `badges` pronta, ainda sem uso.
