# Deck Mercenários (proposta e simulação — o deck não está no jogo)

Terceiro deck do jogo. Ideia do dono: um deck cuja base é **ouro** (segundo pilar do jogo): as tropas cobram **manutenção**, e uma **Relíquia com modos** é o centro do deck.
Mesa de teste jogável da economia (sem combate): `public/mockups/mercenarios/index.html` (publicado em `/mockups/mercenarios/`).

## Decisões já tomadas
- **Sem "contratar a carta do adversário"** (roubo). É a parte mais frustrante de enfrentar e a mais difícil de equilibrar, e complica o motor e o online (decisão do adversário no início do turno). Pode voltar depois, como poucas cartas, se o deck ficar sem graça.
- **Manutenção só em algumas cartas**, paga na fase de **Suprimentos** (depois dos +5 de ouro), numa decisão única por turno: pagar ou dispensar cada carta. Quem não for pago sai do campo.
- **Ao dispensar:** a maioria vai ao cemitério; **algumas voltam para a mão** (pagando o custo de novo para convocar). Algumas têm **Rescisão** (efeito quando são dispensadas).
- **Relíquia como base do deck**: 3 ou 4 cópias, mais cartas que a buscam (hoje já existe o Graal da Dádiva). Cada Relíquia tem **vários modos** e o jogador escolhe um. O modo é trocado **no fim do turno do dono** e fica travado até o fim do turno seguinte. O modo ativo é público.
- Modos propostos: **Cofre de Guerra** (cada mercenário paga 1 a menos, mínimo 0) · **Extorsão** (+1 ouro por carta inimiga destruída, máx. 2 por turno) · **Soldo em Dobro** (mercenários +1 ATK).
- Cartas universais (Trabuco, Catapulta etc.) valem em qualquer deck; o deck precisa ser testado também com elas.

## Lista simulada (60 cartas; `src/engine/experimental.ts`)
General **Comandante Brann, Senhor da Companhia** (30 de vida): pague 3 de ouro, compre 1 carta (uma vez por turno).
| Carta | Cópias | Tipo, ATK/HP, custo | Manutenção | O que faz |
|---|---|---|---|---|
| Lanceiro de Aluguel | 4 | Infantaria 3/3, 1 | 1 | só atributos |
| Besteiro Contratado | 4 | Arqueiro 2/2, 1 | 1 | ataca à distância |
| Espadachim do Soldo | 4 | Infantaria 4/4, 2 | 1 | só atributos |
| Desertor | 4 | Infantaria 2/2, 1 | 1 | Rescisão: compre 1 carta |
| Capitão da Companhia | 2 | Infantaria 3/5, 2 | 2 | na Vanguarda, seus Infantaria e Arqueiros têm +1 ATK |
| Cavaleiro Errante | 3 | Cavalaria 4/5, 3 | 1 | se dispensado, volta para a mão |
| Duelista Livre | 4 | Infantaria 5/3, 2 | 1 | se dispensado, volta para a mão |
| Bombardeiro Contratado | 3 | Artilharia 3/2, 2 | 1 | ataca à distância |
| Sentinela Fiel | 4 | Infantaria 2/4, 2 | — | só atributos |
| Tesoureiro da Companhia | 3 | Infantaria 1/3, 2 | — | no início do turno, ganhe 1 de ouro |
| Livro de Contratos | 3 | Relíquia (5 de vida), 3 | — | três modos, escolhido no fim do turno: **Cofre de Guerra** (manutenção total −2), **Extorsão** (+1 ouro por unidade inimiga destruída, máx. 2 por ciclo), **Soldo em Dobro** (cartas com manutenção +1 ATK) |
Já existentes (universais): Graal da Dádiva 3 (busca a Relíquia) · Catapulta de Guerra 2 · Balestra de Precisão 2 · Trabuco de Cerco 1 · Armadura de Guerra 2 · Couraça Reforçada 2 · Espada Longa 2 · Flechas Venenosas 1 · Recrutamento Seletivo 2 · Retorno do Soldado 1 · Reforços Ocultos 2 · Tributo de Guerra 2.
Resultados da simulação: `docs/balanceamento.md`, rodada 8.

## Regra de bolso das cartas (a calibrar no laboratório)
Mercenário custa 1 a menos para convocar do que uma carta normal do mesmo tamanho e cobra 1 de manutenção por turno; efeito forte cobra 2. Cartas "sem manutenção" e geradoras de ouro (Tesoureiro) compensam a conta.

## Pontos de atenção (opinião registrada)
- Relíquia tem 5 de vida e pode ser destruída: o deck não pode parar sem ela. Os modos ajudam (uma carta tem o kit inteiro).
- Achar a Relíquia: com 3 cópias em 60 cartas, ~31% na mão inicial e ~46% até o 5º turno; com 3 relíquias + 3 buscadores, ~70% até o 5º turno.
- Ouro por destruição acelera quem já ganha: por isso o teto por turno.
- Muita regra nova junta (manutenção, dispensa, Relíquia com modos, ouro por destruição, Rescisão): fazer em **camadas** e medir cada uma. Começar o deck mais fraco e subir.
- Meta de equilíbrio: 40% a 60% de vitórias contra os dois decks atuais, também com as universais fortes nos três. IA × IA só dá tendência.

## O que mudaria no motor (só quando a proposta for aprovada)
Manutenção por carta no início do turno (decisão pendente do dono), gatilho de Rescisão, "volta para a mão" ao dispensar, Relíquia com modo (estado público, troca no fim do turno), efeito de ouro ao destruir inimigo com teto, e a IA decidindo pagar ou dispensar. Detalhes na hora de implementar, em `docs/efeitos.md`.

## Ideia separada (4º deck): Artilharia como infantaria
Soldados com equipamentos de arremesso e veículos (lança-chamas, bombarda, aríete), não artilharia fixa atrás. Provável regra nova: **queimadura** (dano no fim do turno do alvo). Risco: dano em área punir demais campos cheios; travar com ataque alto, vida baixa e custo alto.
