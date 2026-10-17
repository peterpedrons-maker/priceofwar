# Planos futuros (ideias do dono, ainda nada aplicado): economia, boosters e ranqueado

Registro das decisões e ideias conversadas. **Nenhuma está no código.** A ordem combinada: primeiro fechar as cartas e os boosters; só depois ligar o que depende deles.

## 1. Limites de cartas no ranqueado (estilo Hearthstone, sem banimento)
- Não proibir cartas: **limitar a 1 cópia** no ranqueado as cartas muito fortes. Casual e Desafios seguem livres.
- Fazer em **dados** (um campo no catálogo, ex.: `rankedLimit: 1`), conferido pelo servidor junto com `deckProblem` só quando a fila é ranqueada; nada por nome de carta no código.
- Decidir a lista com **números**: o laboratório (`docs/balanceamento.md`) mostra quais cartas sobem muito a taxa de vitória do deck; depois do lançamento, com partidas reais. A lista pode mudar a cada temporada.
- Espera os novos decks do dono.

## 2. Pontos de liga mais "inteligentes" (Elo escondido guiando o que o jogador ganha e perde)
Hoje: vitória +20 e derrota −18 de base, ajustadas até ±8 pela diferença de Elo para o **adversário**. Ideia: o ganho e a perda também dependerem de **como o Elo escondido do jogador está em relação aos pontos que ele mostra** (e/ou da sequência recente), sem virar "ganha 20, perde 25":
- Se o Elo escondido diz que ele é melhor do que o ranque mostra, vitórias valem um pouco mais e derrotas custam um pouco menos (sobe mais rápido até o lugar certo). Se está pior, o contrário.
- Variação pequena e **simétrica no meio**: perto da média, ganho e perda quase iguais (ex.: +23 / −21), e nunca a distância de 20 para 25 do League of Legends. Limite proposto: |ganho − perda| ≤ ~4 no estado normal e ajuste de sequência de no máximo ±3.
- Validar com **simulação** antes de aplicar (jogadores com habilidade escondida jogando milhares de partidas): cada um deve parar no ranque que combina com a habilidade, sem inflação de pontos nem jogador preso.

## 3. Economia e boosters
- Primeiro refazer os boosters (que cartas entram em cada um). Depois, custo "razoável" em coroas (ex.: 120).
- Contra a IA o ganho deve ser **pequeno** (ex.: ~5 coroas por vitória) para ninguém farmar bot. Duas formas, que podem somar:
  1. **Primeira vitória do dia por General** (ex.: 30 coroas) e as seguintes bem menos, com **teto diário**. Incentiva testar todos os decks.
  2. **Missões diárias** (como no Hearthstone), sorteadas no servidor, **só com o que o jogador já liberou** (nunca "derrote o General X" sem ter acesso a ele), com um sorteio novo por dia.
- Ordem de grandeza para pensar: no máximo ~1 booster por dia para quem joga bastante.
- **Importante:** hoje cada vitória online paga +25 coroas e XP. Quando as coroas valerem de verdade, isso vira fazenda (duas contas se alternando). Antes de cobrar boosters: reduzir o pagamento, aplicar o mesmo limite de "mesmo adversário" também às coroas e exigir número mínimo de rodadas.
- Tudo isso (contador diário, missões, boosters) precisa ser **no servidor** (ver `docs/anti-trapaca.md`: abrir booster por função no servidor e fechar a escrita da coleção pelo aparelho).

## 4. Entrada no ranqueado
- O ranqueado só abre depois de o jogador ter **nível mínimo** (ideia: 10 a 15), jogando casual e contra a IA, para conhecer o jogo antes.
- Pontos a decidir: a curva de XP hoje é muito rápida (subiu ao nível 4 na primeira partida), então o nível precisa ser reajustado para esse número significar algumas horas de jogo; além do nível, pode exigir ter concluído o tutorial. Mostrar no menu "Ranqueado libera no nível N" com o progresso.
- O servidor confere o nível (não o aparelho).

## 5. Limite de cópias por carta (ideia do dono; nada aplicado)
Hoje o limite é **4 por carta** (`DECK_MAX_COPIES` em `src/engine/deck.ts`, baralho de 40 a 60). Proposta: **3 no máximo** para as cartas de núcleo e **1 ou 2** para as mais fortes.
- Fazer em **dados**: um campo `maxCopies` por carta (padrão 3; fortes 2; únicas 1), conferido no editor, no servidor e na IA. Casa com a ideia de raridade dos boosters (comum 3, rara 2, única 1) e com a lista de limites do ranqueado (a lista do ranqueado passa a servir só para exceções temporárias).
- Peso da mudança hoje (cartas com 4 cópias): **Capitão 11** (21 diferentes), **Mercenários 8** (21 diferentes), **Cardeal 3** (30 diferentes). São 11, 8 e 3 vagas a refazer; o Capitão e os Mercenários precisam de umas 6 a 10 cartas diferentes novas cada um para o deck não ficar sem folga (com 21 diferentes e limite 3, o máximo é 63 cartas: quase todas teriam de ter 3 cópias, sem espaço para cartas de 1 ou 2).
- Os decks novos (Bardos e Campo) já foram desenhados com 30 diferentes.
- Efeitos: decks menos consistentes (menos cópias do núcleo) -> buscas e compra de cartas ganham valor; rodar o laboratório de novo (os números atuais, ex.: Capitão ~37,5%, mudam); migrar decks já salvos que passem do limite (avisar em vez de apagar); colecionar um conjunto completo fica mais barato (3 em vez de 4).

### 5.1 Baralho de 50 cartas e tamanho mínimo/máximo (análise; nada aplicado)
- **O limite por carta é um teto**, não uma obrigação: o deck pode ter 1, 2 ou 3 cópias de uma carta que o jogador gosta. Motivo para abrir booster: conseguir mais cópias dela. Cuidado: com teto de 3, a 4ª cópia não serve para nada, então é preciso planejar o que fazer com **repetidas** (ex.: converter em coroas ou em "pó" para fabricar cartas), senão o booster frustra.
- **Chance de ter uma carta específica na mão (abertura de 7 cartas / até o turno 4, com 10 cartas):** 60 cartas e 4 cópias: 40% / 53% (hoje). 60 cartas e 3 cópias: 32% / 43%. **50 cartas e 3 cópias: 37% / 50%** (quase o mesmo que hoje). 50 cartas e 2 cópias: 26% / 36%. 50 cartas e 1 cópia: 14% / 20%. Ou seja, baralho de 50 devolve a consistência que o limite de 3 tira.
- As partidas duram ~7 rodadas, então o jogador vê só ~14 das cartas; cartas além disso quase não aparecem. Baralho vazio **não faz perder** (só deixa de comprar), então não existe estratégia de "esvaziar o baralho".
- Com 50 e teto 3, o Capitão e os Mercenários (21 cartas diferentes cada) **cabem sem cartas novas** (ex.: 12 de 3 cópias, 6 de 2 e 2 de 1 = 50), mas ficam sem escolha para o jogador: o deck é quase todo o pool. Cartas novas são necessárias para os **boosters e a coleção**, não para a regra funcionar.
- **Mínimo sem máximo:** o mínimo é o que importa (mais cartas só diluem o deck, então todo mundo escolhe o mínimo), mas mantém-se um **teto técnico** (ex.: 60 ou 80): equilíbrio testável, tamanho do pedido ao servidor, efeitos futuros que dependam do tamanho do baralho. Referências: Yu-Gi-Oh 40 a 60; Hearthstone exatamente 30; Magic mínimo 60 sem máximo. Sugestão: **mínimo 50, máximo 60** (os decks salvos de 60 continuam válidos, sem migração).

### 5.2 Passo 1 feito (regra técnica)
- `src/engine/deck.ts`: mínimo **50**, máximo **60**, `DECK_DEFAULT_MAX_COPIES = 3` e `maxCopiesOf(nome)` (campo `maxCopies` opcional em `CardDef`). O editor de decks, a mensagem de deck inválido e o servidor usam o limite de cada carta.
- As 22 cartas que os decks prontos usam acima de 3 cópias ganharam `maxCopies: 4` **provisório** (assim nada quebra). O passo 2 (refazer os três decks para 50 cartas) tira essas exceções. Teste: `tests/deck-rules.ts`.
- Ao carregar decks salvos, o jogo **não corta mais as cópias em silêncio** (só limita ao que o jogador possui): o editor mostra "Limite de N cópias por carta (nome)" e o deck não entra na fila até ser ajustado.

### 5.3 Passo 2 feito (decks de 50 cartas)
Os três decks prontos agora têm **exatamente 50 cartas**, sem nenhuma acima de 3 cópias (as 22 exceções provisórias saíram). Limites por carta (`maxCopies`): **1** nas cartas únicas (Trabuco da Trombeta Final, Estandarte da Legião, Fortaleza de Pedra, Pântano Maldito, Cálice das Duas Bênçãos, Cambista do Dízimo, Confessor Silencioso, Zeloso da Pira, Marechal do Sol Poente, Convocação dos Veteranos de Fé, Peregrinação ao Graal, Tambor do Soldo Fácil, O Dia em que a Muralha Caiu, Os Dois do Beco); **2** nas fortes (compra de cartas, dano em área e em alvo único, Cavalarias e Relíquias de peso: Catapulta, Balestra, Jorge, Barão, Paladino, Despenseiro, Arqueiro de Dois Sinos, Vigia do Último Salmo, Preces na Sombra, Sermão, Chamado do Túmulo Santo, Reposicionamento Rápido, Cavaleiro do Escudo Raspado, Códice, Chuva de Ferro Barato, Pacto do Punhal Vermelho). O resto vale 3.
Resultado do laboratório (IA × IA, 200 partidas por confronto): ver rodada 22 em `docs/balanceamento.md`. Conclusão: **Capitão e Mercenários, com 21 cartas diferentes cada, ficam apertados** (quase todas as cartas entram, inclusive as fracas); eles precisam de cartas novas para o deck poder escolher.
