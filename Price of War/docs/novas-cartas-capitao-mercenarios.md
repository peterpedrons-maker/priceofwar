# Ideias de cartas novas: Capitão e Mercenários (PROPOSTA, nada aplicado)

**Por que:** com baralho de 50 cartas e no máximo 3 cópias, o Capitão e os Mercenários (21 cartas diferentes cada) são obrigados a jogar quase todas as cartas, inclusive as fracas (`docs/balanceamento.md`, rodada 22). Com **8 a 10 cartas novas** cada um passa a ter ~30 diferentes e o jogador a escolher. Regras lembradas: Terreno **não tem vida e nenhum ataque o alcança**; limite de cópias por carta: 3 (comuns), 2 (fortes), 1 (únicas).
Coluna "Motor": **ok** = só usa efeitos que o jogo já tem (`docs/efeitos.md`); **novo** = pede uma pequena adição ao motor.

## Capitão (identidade: infantaria disciplinada, movimento e controle)
Lacunas que as cartas cobrem: **compra de cartas** (o deck quase não compra), **defesa contra tropas baratas e rápidas** (as dos Mercenários), **um jeito de fechar a partida** (o deck só tem o Trabuco) e **mais motivo para mover**.

| Carta | Tipo, ATK/HP, custo | Efeito | Cópias | Motor |
|---|---|---|---|---|
| Corneteiro da Coluna | Infantaria 1/3, 1 | **Convocação:** compre 1 carta. | 3 | ok |
| Tenente de Marcha | Infantaria 2/3, 2 | **Manobra:** depois de se mover, compre 1 carta (1 vez por turno). | 2 | ok (gatilho "se moveu") |
| Escolta Montada | Cavalaria 3/3, 2 | **Ofensiva:** depois de atacar e sobreviver, move-se 1 casa de graça. | 3 | ok (igual ao Batedor) |
| Guarda de Fileira | Infantaria 2/5, 3 | **Postura:** suas unidades na Retaguarda +1 HP em combate. | 3 | ok |
| Brigadeiro Voss, Quebra-Linhas | Infantaria 4/5, 4 | **Ofensiva:** ao atacar o General, +3 ATK. | 1 | ok (`attack_bonus` contra General) |
| Passo Cadenciado | Tática, 1 | Mova uma unidade sua 1 casa de graça; ela ganha +1 ATK até o próximo turno. | 3 | ok |
| Revista de Tropas | Tática, 2 | Compre 1 carta; uma unidade sua que se moveu neste turno ganha +1 ATK para sempre. | 2 | ok |
| Resposta Disciplinada | Emboscada, 2 | A unidade atacada ganha +2 ATK e +2 HP até o fim do turno. | 2 | ok |
| Campo de Treino | Terreno (sem vida), 2 | Suas Infantarias na Vanguarda +1 HP em combate. | 1 | ok (aura) |
| Mapa de Campanha | Relíquia (5 de vida), 2 | No início do seu turno: 1 movimento extra. | 1 | novo (habilidade da Relíquia no início do turno) |

Sugestão de troca no deck de 50: tirar Reposicionamento Rápido (já fora), Fortaleza de Pedra e 1 cópia de Contra-Manobra/Formação Quebrada, e entrar as cartas acima. Limites: Voss 1, Mapa 1, Campo 1, Revista 2, Tenente 2, resto 3.

## Mercenários (identidade: ouro, manutenção, Rescisão, Relíquia com modos)
Lacunas: o deck **perde para o Cardeal** (54% a 46% para ele; antes da regra era mais parelho) e não tem como **escolher o momento da Rescisão**. Cartas novas dão **controle do ouro do adversário**, **defesa** e **Rescisão por escolha**.

| Carta | Tipo, ATK/HP, custo | Efeito | Cópias | Motor |
|---|---|---|---|---|
| Cobrador de Dívidas | Infantaria 2/2, 1 (Manutenção 1) | **Convocação:** o adversário perde 1 de ouro. | 3 | novo (verbo "tirar ouro do adversário") |
| Sentinela de Aluguel | Infantaria 1/5, 2 (Manutenção 1) | **Postura:** recebe -1 de dano. **Rescisão:** compre 1 carta. | 3 | ok |
| Atirador de Aluguel | Arqueiro 3/2, 2 (Manutenção 2) | Ataca à distância. **Rescisão:** você perde 1 de ouro. | 3 | ok |
| Caçador de Recompensas | Cavalaria 4/3, 3 (Manutenção 2) | **Ofensiva:** se destruir uma unidade, ganhe 2 de ouro. **Rescisão:** 2 de dano ao seu General. | 2 | novo (ouro ao destruir, fora do modo Saque) |
| Intendente do Soldo | Infantaria 1/4, 2 | **Postura:** a manutenção das suas cartas custa 1 a menos no total. | 2 | novo (passiva de manutenção; hoje só nos modos da Relíquia) |
| Contrato Rasgado | Tática, 2 | Escolha uma unidade sua com manutenção: ela é dispensada (vai ao cemitério, com a Rescisão dela) e você compra 2 cartas. | 2 | novo (verbo "dispensar") |
| Folha de Pagamento | Tática, 1 | Neste turno, você não paga manutenção. | 1 | novo (efeito no passo de manutenção) |
| Carta Branca | Emboscada, 2 | Cancela um ataque a uma de suas unidades; ela ganha +2 ATK até o fim do turno. | 2 | ok |
| Acampamento de Contratos | Terreno (sem vida), 2 | A manutenção das suas cartas custa 1 a menos no total. | 1 | novo (igual ao Intendente) |

Obs.: o **Acampamento de Contratos** já tem visual e arte prontos (`docs/terrenos-pendentes.md`). O Intendente e o Acampamento fazem a mesma coisa; escolher um dos dois, ou deixar o Acampamento só com o desconto e o Intendente com outro efeito (ex.: +1 ATK às suas cartas com manutenção).

## Como medir antes de aplicar
1. Entrar com as cartas "ok" primeiro (rodar o laboratório: `tests/balance-merc.ts`, 200 partidas por confronto).
2. Meta de referência: nenhum confronto abaixo de ~40% nem acima de ~60%; hoje o Capitão perde para os Mercenários (32%).
3. Só depois implementar as de motor "novo" que o dono aprovar.
4. Cada carta nova precisa de arte (`art-prompts/`), nome em `docs/textos-cartas.md` e o campo `maxCopies`.
