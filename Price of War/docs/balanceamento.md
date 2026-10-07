# Balanceamento e IA do adversário

Como medir: partidas IA×IA no motor (rápido, sem tela). Ferramentas em `tests/`:

- `tests/ai-arena.ts` — a IA nova (planejadora) contra a antiga (`aiLegacyAction`). `MIRROR=1 N=25 npx tsx tests/ai-arena.ts` dá a mesma deck aos dois lados, então o resultado mede a IA, não o baralho.
- Taxa de vitória entre baralhos: rodar partidas Capitão × Cardeal com a IA nova dos dois lados, alternando cadeira e quem começa.

## O que foi encontrado (antes das mudanças)

- A IA antiga não tinha bug de regras: jogava legalmente e respondia a todos os prompts. O que parecia "joga bem a 1ª rodada e depois não faz nada" era:
  1. a compra é de 1 carta por turno, e a mão inicial era gasta quase toda na rodada 1;
  2. o baralho do Capitão tinha 12 Emboscadas (que a IA segura de propósito) e 20 Táticas de posição (Reformar Linhas, Avanço Coordenado…) sem bom uso na maioria dos turnos; só 27 de 62 cartas eram unidades;
  3. o ouro sobra (+5 por turno): o gargalo do jogo são as **cartas**, não o ouro. Por isso mudar **custos** quase não altera o resultado, e mudar atributos altera.
- O confronto Capitão × Cardeal (IA×IA) era de 2–7% para o Capitão. Mudar a economia (ouro, compra) mexia muito no resultado do confronto, mas é uma mudança global (tutorial, online); mudar o Cardeal exigia um pacote grande de nerfs.

## O que foi aplicado (e o que foi desfeito)

1. **IA planejadora** (`aiNextAction` em `src/engine/ai.ts`): em vez de decidir carta por carta, simula o turno inteiro no próprio motor (jogar, mover, atacar, usar habilidades, passar de fase) e escolhe a melhor sequência pela avaliação do tabuleiro, da mão e das ameaças. Guardar uma carta também é uma opção: uma carta na mão vale pontos, então só é jogada quando o efeito na mesa vale mais. Não "trapaceia": a mão do adversário some da simulação, e a ordem do próprio baralho é embaralhada. Tempo: ~12 ms por ação, pior caso ~170 ms. A IA antiga continua exportada (`aiLegacyAction`) para comparação e como reserva. O servidor usa a mesma IA para a cadeira do bot. **Mantida.**
2. **Buff do Capitão** (+2 ATK / +1 HP nas unidades) e **baralho do Capitão menor** (Táticas de posição 4→2, Emboscadas 4→3, 49 cartas): fizeram o Capitão vencer ~43% do Cardeal em IA×IA, mas foram **desfeitos** a pedido (pareceram demais e deixaram os dois baralhos iniciais desproporcionais). O mecanismo `BALANCE` do catálogo ficou, vazio, para ajustes futuros apartados dos atributos base.

## Resultados medidos

- IA nova contra a antiga, mesmo baralho: vence **83%** (40 de 48), igualmente com Capitão e com Cardeal.
- Tempo de pensamento da IA: ~13 ms por ação, pior caso ~165 ms.
- Com os buffs (desfeitos): Capitão × Cardeal 43%, turnos parados 5%. Sem eles, o confronto entre os baralhos iniciais volta a ser favorável ao Cardeal (ver o número medido logo abaixo).
- Medido sem os buffs (baralhos originais, IA nova dos dois lados): Capitão vence **5%** do Cardeal, 3,8 rodadas por partida, 11% de turnos parados. Esse é o ponto de partida para um ajuste mais leve.

## Baralhos iniciais
Todo jogador começa com os dois baralhos prontos: Cardeal no slot 1 e Capitão no slot 2 (`buildStarterStore` em App.tsx), com a coleção completa dos dois. O Capitão tem 62 cartas na receita e o limite de baralho é 60, então o deck pronto deixa de fora uma cópia de Reformar Linhas e uma de Reposicionamento Rápido (`starterDeckCards` em `catalog.ts`); a IA continua usando a receita completa. Contas e aparelhos antigos são migrados ao abrir (`ensureStarterDecks`): ganham a coleção do Capitão e, se o slot 2 estiver vazio, o deck pronto nele (um slot já montado pelo jogador nunca é alterado).

## Laboratório de balanceamento (ferramenta)
Três peças, todas em `tests/`, que rodam sem tela e sem mexer no jogo:

1. **`balance-lab.ts`** joga muitas partidas Cardeal × Capitão (IA planejadora dos dois lados, cadeiras e quem começa alternando, 4 processos em paralelo, ~2 partidas por segundo no total) e grava o que cada carta fez: quantas vezes foi comprada, jogada, usada, quanto dano causou, quantos abates, e como terminou a partida (vencedor, vida final do General, rodadas).
   `N=150 OUT=balance-out/base npx tsx tests/balance-lab.ts` (o `OUT` não pode ter o mesmo nome do patch: o resultado sobrescreveria o arquivo) (300 partidas, uns 3 minutos).
2. **Patches ("e se...")**: um JSON com as mudanças, aplicado só na simulação (nada muda no jogo). `PATCH=balance-out/p1.json`:
   `{ "name": "Mercador custa 2", "cards": { "Mercador da Cruzada": { "abilityCost": 2 } }, "decks": { "capitao": { "Reformar Linhas": 2 } } }`.
   Em `cards`: `atk`, `hp`, `cost`, `abilityCost`, `abilityOnce` (valores absolutos). Em `decks`: cópias da carta na receita (0 tira).
3. **`balance-report.ts`** transforma um ou dois resultados numa página que abre no celular: quem vence, em quantas rodadas, e uma tabela por deck, ordenável, com Δ de vitória (quanto a vitória sobe nas partidas em que a carta foi comprada), Δ de vida do General, usos, dano e abates por partida. Com `VARIANT=` mostra o antes × depois.
   `BASE=balance-out/base.json VARIANT=balance-out/p1.json OUT=balance-out/report.html npx tsx tests/balance-report.ts`.

Limites: a IA joga diferente de uma pessoa, então os números mostram tendências. Quando um deck perde quase sempre (como o Capitão hoje), "Δ de vitória" quase não diz nada para as cartas dele; o Δ de vida do General, o dano e os abates continuam úteis.

### Primeira medição (300 partidas, catálogo atual)
- Cardeal 97% × Capitão 3%; quem começa vence 49%; partidas duram 3,8 rodadas (a maioria acaba na 3ª ou 4ª).
- Dano por partida: Cardeal 24,6 × Capitão 8,0. O Cardeal causa dano com Trabuco de Cerco, Catapulta, Cavaleiro da Luz, Jorge e Comandante; o Capitão (posição e reação) quase não tem como ferir o General.

### Cenários testados (200 partidas cada, IA × IA; % de vitórias do Capitão)
| Cenário | Capitão vence | Rodadas |
|---|---|---|
| Hoje | 3% | 3,8 |
| A · só o Capitão sobe (+1 ATK nas unidades) | 5% | 4,3 |
| B · só o Cardeal desce (-1 HP nos cavaleiros, 1 Trabuco, 2 Catapultas) | 4% | 4,5 |
| C · os dois um pouco | 8% | 4,4 |
| D · decks de 50 cartas (Capitão sem as piores, Cardeal sem 8 boas) | 14% | 5,4 |
| E · D + unidades do Capitão com +1 HP | 39% | 6,1 |
| F · D + unidades do Capitão com +1/+1 | 52% | 5,3 |
| G · F + cavaleiros do Cardeal com -1 HP | 59% | 5,3 |

Leitura: mexer só nos atributos quase não muda nada; o que mais pesa é enxugar os baralhos e dar corpo às unidades do Capitão (que tinham 1 ponto a menos que as do Cardeal pelo mesmo custo e sofrem mais com o dano em área). Os patches estão em `balance-out/p1..p7.json` (pasta ignorada pelo git; ficam registrados dentro de cada resultado).

### Rodada 2: decks de 60 cartas, cartas emprestadas e efeito alterado (200 partidas cada; % de vitórias do Capitão)
Regras do teste: os dois decks com 60 cartas, sem mexer nos atributos das unidades (só na composição); o Cardeal troca cartas fortes por médias/fracas repetidas (1 Trabuco, 2 Catapultas, 2 Jorge, 3 Cavaleiros da Luz, 1 Mercador, 1 Recrutar Veteranos; entram +2 Soldados da Ordem, +1 Intendente, +2 Recruta Devoto, +1 Atirador, +1 Arqueiro, +1 Hospitalário); o Capitão recebe táticas do Cardeal e perde as cartas de posição mais fracas.
| Cenário | Capitão vence | Rodadas |
|---|---|---|
| H1 · Capitão com 3 Catapultas, 2 Balestras, 3 Espadas Longas | 14% | 5,0 |
| H2 · H1 + unidades do Capitão com +1 HP | 25% | 5,9 |
| H3 · Capitão mais agressivo (4 Catapultas, 3 Balestras, 4 Espadas, 3 Armaduras) | 18% | 5,2 |
| I1 · 4 Catapultas, 4 Balestras, 2 Trabucos, 4 Armaduras, 2 Recrutamentos Seletivos; sem Espada Longa | 26% | 5,7 |
| I2 · I1 + General Aurelion dá +2 ATK (em vez de +1) às unidades que se moveram | 32% | 5,5 |
| I3 · I1 + 3 Cavaleiros da Luz no Capitão | 35% | 5,6 |
| J1 · I1 + General +2 ATK + 3 Cavaleiros da Luz | 40% | 5,4 |
| **K1 · J1 + Cardeal com 1 Catapulta (mantém 1 Trabuco)** | **44%** | 5,0 |
| **K2 · J1 + Cardeal sem Trabuco (mantém 2 Catapultas)** | **43%** | 5,3 |
| J2 · J1 + Cardeal sem Trabuco e com 1 Catapulta | 55% | 5,3 |

Leitura: só trocar cartas dentro do deck não basta (14–18%); o que mais ajudou foi dar ao Capitão dano em área e direto (Catapulta, Balestra, Trabuco), mais corpo (Cavaleiro da Luz) e um General mais forte. A Espada Longa foi a pior carta emprestada (equipar não rende para o Capitão). K1/K2 ficam na faixa de 43–44% e J2 em 55%, então o ponto de equilíbrio está entre eles. Nada disso está aplicado ao catálogo ainda.

### Aplicado ao jogo (versão "L")
Decidido com o dono do jogo depois da rodada 2, **só com mudanças em cartas táticas** (os soldados continuam de cada facção; nada de Cavaleiro da Luz no Capitão), os dois decks com **60 cartas**:
- **Capitão** (`DECK_RECIPES.capitao`): +1 Veterano de Guerra (4); Reformar Linhas 4→1; Reposicionamento Rápido 4→2; Ordem de Retirada 4→2; Bloqueio Instantâneo 4→2; Contra-Manobra 4→1; Formação Quebrada 4→2; **saem** Linha Fechada e Fortaleza de Pedra; **entram** 4 Catapultas de Guerra, 4 Balestras de Precisão, 4 Armaduras de Guerra, 2 Trabucos de Cerco e 2 Recrutamentos Seletivos. Sem Espada Longa.
- **Cardeal** (`DECK_RECIPES.cardeal`): 1 Trabuco (era 2), 1 Catapulta (era 3), 2 Jorge (3), 3 Cavaleiros da Luz (4), 1 Mercador da Cruzada (2), 1 Recrutar Veteranos (2); entram +2 Soldados da Ordem (4), +1 Intendente (3), +2 Recruta Devoto (4), +1 Atirador (3), +1 Arqueiro (3), +1 Cavaleiro Hospitalário (3), +1 Doutrina Renovada (3).
- **General Aurelion**: as unidades que se moveram ganham **+2/+1** (era +1/+1) no próximo combate.
- Medido (300 partidas IA × IA): **Capitão vence 30%**, 5,2 rodadas por partida. (Com os 3 Cavaleiros da Luz seriam 40%; ver J1.)
- Ajustes simples para aproximar de 45–50%, já medidos sobre essa versão (200 partidas): Cardeal sem Trabuco → Capitão 40,5%; General em até 3 unidades → 36%; 3 Trabucos no Capitão → 31%. Os dois primeiros juntos ainda não foram medidos.

Decks salvos: quem ainda tem o deck inicial antigo (idêntico à lista antiga, ver `LEGACY_STARTERS`) recebe a nova; deck editado pelo jogador não é tocado. A coleção ganha todas as cartas das listas novas e antigas; as cartas que saíram de um deck (Linha Fechada, Fortaleza de Pedra) continuam existindo e saem em boosters do Capitão. Os boosters de cada facção continuam sorteando só cartas da própria facção (`BOOSTER_POOLS`).

### Rodada 3: Capitão com as próprias cartas e efeitos alterados (200 partidas cada; % de vitórias do Capitão)
Em vez de emprestar táticas ao Capitão, o deck dele volta à lista própria de 60 cartas (a lista inicial antiga) e os efeitos mudam (o Cardeal é o que está no jogo hoje; o General Aurelion com +2/+1 em todos os cenários). Os patches usam `set` (reescreve `abilities`/`passives` de uma carta) e `merge`, em `tests/balance-lab.ts`.
| Cenário | Mudanças de efeito | Capitão vence | Rodadas |
|---|---|---|---|
| (jogo hoje) | táticas emprestadas, efeitos originais | 30% | 5,2 |
| N0 | nenhuma | 11,5% | 4,6 |
| N1 · movimento | Capitão de Formação: aliados ao lado +2 ATK (era +1); Batedor ganha +1 ATK para sempre a cada ataque que sobrevive; Cavaleiro Tático: aliados ao lado +1 ATK ao se mover | 12,5% | 4,9 |
| N2 · controle | Lanceiro: inimigo à frente -2 ATK (era -1); Escudeiro: ele e a carta de trás recebem -1 de dano; Veterano: +2 ATK na coluna central e +1 ATK na Vanguarda | 10,5% | 4,9 |
| N3 · táticas | Avanço Coordenado custa 1 e dá +3 ATK; Reformar Linhas também compra 1 carta; Linha Fechada -2 de dano; Estandarte +1 ATK e +1 HP em combate; Bloqueio Instantâneo custa 1 | 19% | 5,4 |
| N4 · N1+N2+N3 | todos | 32% | 5,3 |
| N5 | N4 + Pântano Maldito -2 ATK e Fortaleza de Pedra -2 de dano | 34,5% | 5,5 |
| N6 | N4 + Cavaleiro Tático ataca 2 vezes por rodada | 33,5% | 4,8 |
| N7 | N4 + N5 + N6 | 35,5% | 5,1 |
| **N8** | N7 + Cardeal sem Trabuco | **42%** | 5,8 |
| **N9** | N7 + Cardeal sem Catapulta (mantém 1 Trabuco) | **43,5%** | 5,3 |

Leitura: mudar efeitos de unidades (movimento ou controle) quase não move o resultado (10–13%); o que pesa são as táticas (N3, +8 pontos) e os efeitos somados chegam a ~35%, o mesmo que o caminho das cartas emprestadas (30%). Para chegar perto de 45% com os efeitos, ainda é preciso tirar uma das duas cartas de dano em área do Cardeal (N8/N9). Nada disso está aplicado.

### Rodada 4: meio a meio (poucas táticas emprestadas + efeitos) (200 partidas cada; % de vitórias do Capitão; Cardeal como está no jogo)
Capitão com 60 cartas: a lista própria antiga, trocando Reposicionamento Rápido 3→1, Contra-Manobra 4→2, Formação Quebrada 4→2, e com +1 Veterano (4), mais **2 Catapultas, 2 Balestras e 1 Trabuco** emprestados.
| Cenário | Efeitos alterados | Capitão vence | Rodadas |
|---|---|---|---|
| O1 | só táticas e Estandarte (Avanço Coordenado custa 1 e dá +3 ATK; Reformar Linhas compra 1; Linha Fechada -2; Estandarte +1/+1; Bloqueio Instantâneo custa 1) | 31,5% | 5,5 |
| O2 | O1 + movimento (Capitão de Formação +2 aos lados, Batedor +1 ATK por ataque, Cavaleiro Tático +1 aos lados) e controle (Lanceiro -2 ATK no inimigo à frente, Escudeiro -1 de dano nele e na carta de trás, Veterano +1 ATK na Vanguarda) | 40% | 5,5 |
| **O3** | O2 + Pântano -2 ATK, Fortaleza -2 de dano, Cavaleiro Tático ataca 2 vezes | **45%** | 4,9 |

### Versão final aplicada ao jogo: O2 (decidida com o dono do jogo)
Fica determinado assim; outras revisões (Mercador e cartas de comprar carta, novos decks) ficam para depois. Medido no catálogo real: **Capitão 39,5% × Cardeal 60,5%** (200 partidas IA × IA), 5,5 rodadas por partida.
- **Cardeal**: sem mudança desde a versão L (1 Trabuco, 1 Catapulta, mais cartas médias; 60 cartas).
- **Capitão (60 cartas)**: lista própria com Veterano de Guerra 4, Reposicionamento Rápido 1, Contra-Manobra 2, Formação Quebrada 2, e **2 Catapultas de Guerra, 2 Balestras de Precisão e 1 Trabuco de Cerco** emprestados. Linha Fechada, Fortaleza de Pedra e Pântano Maldito continuam no deck.
- **Efeitos novos**: Capitão de Formação +2 ATK aos lados; Batedor +1 ATK para sempre a cada ataque que sobrevive; Cavaleiro Tático dá +1 ATK aos aliados ao lado ao se mover; Lanceiro de Controle -2 ATK no inimigo à frente; Escudeiro de Linha recebe -1 de dano (e a carta de trás também, na Vanguarda); Veterano de Guerra +1 ATK na Vanguarda (além do +2 central); Avanço Coordenado custa 1 e dá +3 ATK; Reformar Linhas também compra 1 carta; Linha Fechada protege 2; Estandarte da Legião dá +1/+1 em combate às cartas em campo; Bloqueio Instantâneo custa 1; General Aurelion dá +2/+1.
- Não entraram (testados em O3): Pântano/Fortaleza mais fortes e o ataque duplo do Cavaleiro Tático.
- `LEGACY_STARTERS` guarda as listas antigas de cada deck (a original e a da primeira rodada): quem ainda tem uma delas sem editar recebe a nova lista ao abrir o jogo.

### Duração das partidas (rodada 5: 80 a 200 partidas cada; Capitão vence / rodada média em que a partida acaba)
Base: catálogo final (O2), General com 20 de vida: 39,5% / 5,5. O laboratório agora aceita `rules` no patch (`startGold`, `goldPerTurn`, `goldFromRound`, `combatFromRound`), lidos por `rules.ts` só quando `globalThis.__POW_RULES__` existe (o jogo nunca define).
| Cenário | Capitão vence | Rodada média |
|---|---|---|
| General com 25 de vida | 36,5% | 6,4 |
| General com 30 de vida | 37,5% | 6,9 |
| 30 de vida + 4 de ouro por turno (era 5) | 42% | 7,2 |
| 30 de vida + 3 de ouro por turno | 52% | 7,3 |
| 30 de vida + dano em área de 1 (Trabuco e Catapulta) | 56% | 7,3 |
| 30 de vida + ouro inicial 10 (era 15) e 4 por turno | 47,5% | 8,0 |
| 30 de vida + combate só a partir da rodada 3 | 38% | 8,4 |
| 30 de vida + ouro 10/4 + combate a partir da rodada 3 | 49% | 8,4 |
Nada disso está aplicado ao jogo.

### Aplicado: General com 30 de vida (decidido com o dono do jogo)
Só isso, sem mexer em ouro nem no início do combate (o pacote com menos ouro e combate na rodada 3 foi descartado: deixaria o jogo lento demais, já que se começa com 7 cartas na mão). Os dois Generais passam de 20 para 30 de vida (`catalog.ts`). Medido no catálogo real: **Capitão 37,5% × Cardeal 62,5%, partida acaba na rodada 6,9 em média** (antes 5,5). No tutorial o General do treinador continua com 20 de vida (para a aula acabar no 4º turno do jogador) e o do jogador mostra 30; os testes de regras foram atualizados (30 - dano).

### Viradas (comeback) — `tests/balance-comeback.ts`
O laboratório agora grava, a cada fim de turno, a vida dos Generais e o material em campo (ATK + HP das unidades). Medido no catálogo atual (250 partidas IA × IA): quem está claramente à frente depois da rodada 2 ou 3 (8 de material ou 5 de vida) vence **cerca de 87–92%**; a virada acontece em 8–13% dos casos. Mesmo assim, o vencedor chegou a estar bem atrás (≥ 6) em ~1/3 das partidas, e muito atrás em ~18%. Ou seja: virar existe, mas é raro quando a vantagem já é grande. Ideias para testar depois: dano em área maior ou mais táticas de recuperação, ouro extra para quem está atrás, Emboscadas mais fortes.

### Rodada 6: custo das cartas do Cardeal (200 partidas cada; % de vitórias do Capitão; General com 30 de vida)
Motivo: jogando com o Capitão contra a IA do Cardeal, o dono viu o Cardeal encher o campo já no 1º turno (15 de ouro, cartas de custo 1–3). Mediu-se também o material em campo (ATK+HP) depois do 1º turno de cada lado. Só mudam os custos das **unidades** do Cardeal (táticas ficam, porque Catapulta/Trabuco são compartilhadas com o Capitão).
| Cenário | Mudança de custo (só Cardeal) | Capitão vence | Material após o 1º turno (Cardeal × Capitão) |
|---|---|---|---|
| Q0 | nenhuma | 37,5% | 27,2 × 22,6 |
| Q1 | cavalaria 3→4 (Jorge, Nobre, Cavaleiro da Luz, Comandante) | 41,5% | 26,1 × 22,6 |
| Q2 | unidades de 2→3 (Intendente, Soldados da Ordem, Hospitalário, Arqueiro, Atirador) | 44,5% | 25,3 × 22,7 |
| **Q3** | Q1 + Q2 | **47%** | 23,9 × 22,8 |
| Q4 | Q3 + unidades de 1→2 (Devotos, Recruta, Mercador, Infiltrado, Fanático) | 48% | 22,7 × 22,8 |
| Q5 | cavalaria 3→5 + unidades 2→3 | 58% | 22,3 × 22,5 |
Leitura: com 30 de vida os custos voltam a pesar (a rodada 1 do estudo antigo dizia o contrário). Q3 deixa o jogo próximo de 50% e o 1º turno do Cardeal quase igual ao do Capitão. **Q3 aplicado ao jogo** (decidido com o dono): Jorge, Nobre, Cavaleiro da Luz e Comandante custam 4; Intendente, Soldados da Ordem, Cavaleiro Hospitalário, Arqueiro e Atirador custam 3. Remedido no catálogo real: Capitão 47% × Cardeal 53%, 7,5 rodadas.

### Rodada 7: Mercador da Cruzada com custo (200 partidas cada; Capitão vence; custos do Q3 já aplicados, base 47%)
Pedido do dono: as cartas que buscam outras quase não custavam nada. Mudança aplicada ao Mercador: a habilidade custa **1 de ouro** (uma vez por turno) e a carta não escolhida vai para o **cemitério** (antes: fundo do baralho, grátis). Novo campo `rest: 'graveyard'` no verbo `look_top`.
| Cenário | Capitão vence | Rodadas |
|---|---|---|
| R0 · Mercador 1 de ouro + cemitério (aplicado) | 47,5% | 7,4 |
| R2 · Mercador 2 de ouro + cemitério | 48% | 7,5 |
| R3 · R0 + Recrutar Veteranos também manda o resto ao cemitério | 48% | 7,4 |
Leitura: o Mercador é 1 carta em 60, então o efeito no resultado geral é pequeno; a mudança vale pela regra (custo e perda de carta). Recrutar Veteranos (ver 4 cartas, ficar com 1 ou 2) ainda manda o resto para o fundo; Intendente do Exército também compra sem custo de ouro (candidatas à mesma revisão).

### Rodada 8: deck Mercenários (experimental) contra Cardeal e Capitão (200 partidas por confronto, IA × IA; `tests/balance-merc.ts`)
O deck (60 cartas, ver `docs/deck-mercenarios.md`) só existe no laboratório. Referência na mesma bateria: Cardeal 52,5% × Capitão 47,5%.
| Cenário | Mercenários × Cardeal | Mercenários × Capitão | Rodadas |
|---|---|---|---|
| **Base** (convocar com 1 a menos, manutenção 1; Capitão da Companhia 2) | **59%** | **52%** | 7,4 / 6,9 |
| M1 · manutenção dobrada (2; Capitão 3) | 51% | 42,5% | 8,7 / 6,9 |
| M2 · sem desconto de convocação (custo normal +1) | 37% | 36,5% | 8,2 / 6,8 |
Leitura:
- O desconto de convocação vale ~20 pontos; a manutenção de 1 custa pouco (**5,7 de ouro por partida**, quase 1 por turno) porque o ouro sobra neste jogo e o gargalo são as cartas. Dobrar a manutenção tira ~8 a 10 pontos e passa a pesar (9,8 de ouro por partida). O ponto de equilíbrio com o Capitão fica entre a base e M1; contra o Cardeal a base já está um pouco acima.
- **A IA quase nunca dispensa** (0,0 por partida na base, 0,5 em M1): a decisão "pagar ou dispensar" praticamente não é testada pelo laboratório. Isso só aparece com gente jogando.
- **A Relíquia ainda não é o centro do deck**: foi jogada em 44% das partidas (3 cópias + 3 Graal) e a vitória com ela em campo (53%) não é maior que sem ela (57%). Em M1 e M2, em que o ouro aperta, ela pesa (57% × 41% e 48% × 33%, confundido com ter comprado mais cartas). Modos escolhidos pela IA: Extorsão 53%, Cofre 45%, Soldo em Dobro 3%.
- Cartas: com 400 partidas o erro de cada Δ é de uns ±5 pontos. Melhores: Capitão da Companhia, Trabuco, Catapulta, Espadachim, Duelista. Piores quando compradas: Livro de Contratos, Graal da Dádiva (sem relíquia no baralho vira carta morta), Couraça Reforçada, Tributo de Guerra, Besteiro.

### Rodada 9: Mercenários só com cartas novas (200 partidas por confronto, IA × IA; `tests/balance-merc.ts`)
Pedido do dono: nenhuma carta do deck vem do Cardeal ou do Capitão (todas as táticas, equipamentos, buscas e a Emboscada foram recriadas com nome e efeito próprios; lista em `docs/deck-mercenarios.md`). Também entram mais mercenários (38 unidades, 3 Relíquias, 3 Escribas de Contratos).
| Cenário | Mercenários × Cardeal | Mercenários × Capitão | Média | Rodadas |
|---|---|---|---|---|
| **Base** (manutenção 1; Capitão da Companhia 2) | **69,5%** | **56%** | 62,8% | 7,7 / 6,9 |
| V1 · manutenção 2 só em Espadachim, Duelista, Cavaleiro Errante; Capitão 3 | 59,5% | 53,5% | 56,5% | 8,3 / 7,5 |
| **V2 · manutenção 2 em todos os mercenários; Capitão 3** | **56%** | **46%** | **51%** | 8,8 / 7,3 |
Leitura:
- O deck novo ficou **forte demais** na base (mais unidades eficientes e nenhuma carta morta emprestada). V2 deixa os dois confrontos dentro de 40% a 60% (média 51%); V1 ainda fica acima contra o Cardeal.
- Com manutenção 2 o custo aparece de verdade (11,7 de ouro por partida; dispensas 0,7 por partida, ainda poucas) e a Relíquia passa a pesar: com ela em campo a vitória é 67% contra 45% sem ela (confundido com comprar mais cartas). Na base a diferença também é grande (73% × 58%).
- Cartas que a simulação mostra fracas: **Tesoureiro da Companhia** (ouro não é o gargalo), Desertor, Besteiro Contratado, Espada de Aluguel. (Correção: o relatório antes dizia que a IA nunca ativa o Suborno; era só o laboratório não contar ativação de Emboscada. Contando, ele é a Emboscada mais ativada: 23 ativações em 32 partidas. O laboratório agora conta as ativações em `jogadas`.) Fortes: Carga de Pólvora, Duelista Livre, Espadachim do Soldo, Capitão da Companhia, Salva de Besteiros.
- Nada disso está no jogo; é só o laboratório. Esta rodada usava custos sem tabela; ver a rodada 10 (custos pela tabela).

## Tabela de custo (decidida com o dono do jogo)
Faltava um padrão entre atributos e custo; era a etapa que tinha sido pulada (o Mercenários saiu forte porque os custos não seguiam nenhum critério).
**Custo de uma unidade pela soma de ATK + vida:** soma ≤ 3 custa **1** · 4 a 6 custa **2** · 7 a 8 custa **3** · 9 ou mais custa **4**.
Ajustes (a tabela é guia, não lei; exceções com motivo são normais):
- **Efeito forte soma custo** (+1, ou o efeito é pago em atributos mais baixos). Cartas que compram/buscam carta pagam mais: ou +1 no custo, ou custo de ouro na habilidade (como o Mercador da Cruzada, que paga 1 de ouro para ativar).
- **À distância** (Arqueiro, Artilharia) com ATK ≥ 2 paga +1: alcança as três colunas e quase não é atingido.
- **Manutenção compra atributos:** cada ponto de manutenção deixa a carta passar 1 de soma da faixa do seu custo (mercenário de manutenção 1 no custo 2: até 7 de soma). Não dá desconto no custo de convocação (a rodada 8 mediu: o desconto valia ~20 pontos de vitória, a manutenção de 1 só ~6 de ouro por partida, porque o ouro sobra e o que falta é carta).
- Táticas (guia, a partir do que o jogo já faz): dano a uma unidade ≈ 1,5 de dano por ouro (Balestra 3 por 2); dano em fileira 2 por 2 (Catapulta); dano em todas as unidades inimigas e no General 2 por 3 (Trabuco); equipamento +2 de soma por 1 de ouro (Armadura +2 vida, Espada +2 ATK); busca de 1 carta por 1 (só barata se for restrita); comprar 2 cartas custa 3.
Ferramenta: `npx tsx tests/cost-audit.ts` (com `MERC=1` inclui o deck em teste) lista cada unidade, o custo pela tabela e o desvio.

### Auditoria dos dois decks (Cardeal e Capitão)
- **Unidades: 17 das 21 já seguem a tabela.** Os 4 fora estão todos **+1 acima**, e todos têm efeito forte: Atirador da Cruzada 1/3 (à distância, compra 2 ao cair), Arqueiro da Ordem 1/4 (à distância, ataca 2 vezes), Intendente do Exército 2/3 (compra até ter 2 cartas todo turno), Cavaleiro Hospitalário 2/3 (cura e dano). É a lógica que o dono descreveu, e na medição eles ficam neutros (Δ de vitória entre −2 e +6).
- **Nenhuma unidade pede mudança pela tabela.** Duas têm efeito forte sem o +1 e aparecem bem acima da média nas medições (300 partidas IA × IA do jogo atual; Cardeal 56%, Capitão 44%, margem ±3,5; Δ por carta ±5–6): **Cavaleiro Tático** (4/4, custo 3; troca de lugar com a fileira e dá +1 ATK aos lados; Δ +22,9 e é quem mais causa dano: 8,7 por partida) e **Comandante da Ordem** (5/5, custo 4, aura +1/+1; Δ +19,5). Candidatas a +1 de custo ou a atributos menores, **não alteradas**.
- **Fora das unidades:** o **Estandarte da Legião** (Relíquia de custo 3, +1/+1 em combate para todo o campo; Δ +33,8, a carta de maior efeito do jogo) e os **buscadores baratos** Doutrina Renovada (Δ +16,2, 3 cópias) e Recrutamento Seletivo (Δ +16,6), de custo 1, estão fortes para o preço: pela regra de "busca paga mais", candidatos a custo 2 ou menos cópias. O **Trabuco de Cerco** é forte nos dois decks (Δ +20 e +11) e já tem só 1 cópia em cada. A **Catapulta** vai bem no Cardeal (+22,7) e mal no Capitão (−10,9): provavelmente ruído e contexto.
- **Fracas** (custo alto para o que dão, ou pouco uso): Armadura de Guerra (Δ −17,8), Cálice da Graça (−15,4), Devotos da Cruzada (−14,5), Tributo de Guerra (−12,7), Espada Longa (−12,6), Formação Quebrada (−16,7), Fortaleza de Pedra (−8,3). Candidatas a custo 0 ou efeito maior.
- Observação: o ouro sobra e o gargalo são as cartas, então o custo mexe pouco no resultado (comparar com a rodada 6); a tabela vale mais para a **primeira rodada** (15 de ouro) e para manter o padrão entre decks do que como alavanca de equilíbrio.
Nada dos dois decks do jogo foi alterado.

### Rodada 10: Mercenários com os custos pela tabela (200 partidas por confronto, IA × IA)
Custos e atributos refeitos pela tabela de custo (ver seção acima): Lanceiro de Aluguel 2/2 (custo 1), Besteiro Contratado 2/2 (custo 2, à distância), Espadachim do Soldo 4/3 (2), Duelista Livre 5/2 (2), Capitão da Companhia 3/5 (3, manutenção 2), Bombardeiro Contratado 3/2 (3), Cavaleiro Errante 4/5 (3); Agência de Recrutamento custo 2 e Recrutamento de Rua custo 3 (busca/compra paga mais). A auditoria (`MERC=1 npx tsx tests/cost-audit.ts`) confere o deck: 26 de 31 unidades na tabela, o único mercenário fora é o Capitão da Companhia (+1, efeito forte).
Também se corrigiu a IA: ela quase nunca jogava o **Livro de Contratos** (em 17 de 20 partidas em que o comprou, nunca entrou em campo), o que distorcia as rodadas 8 e 9; agora a Relíquia com modos vale mais na avaliação (só afeta esse deck) e entra em ~1 rodada.
| Cenário | Mercenários × Cardeal | Mercenários × Capitão | Média |
|---|---|---|---|
| (antes de corrigir a IA, custos pela tabela) | 39,5% | 44% | 41,8% |
| **T0 · custos pela tabela, IA corrigida** | **42%** | **42,5%** | **42,3%** |
| T1 · 4 Livros e 4 Escribas | 39,5% | 45% | 42,3% |
| **S · Relíquia só com o modo Soldo em Dobro** | **53%** | **53%** | **53%** |
| U2 · manutenção 2 em todos + atributos maiores (+1 de soma por ponto) | 57% | 59,5% | 58,3% |
Leitura:
- Os custos pela tabela deixam o deck na faixa baixa (≈42%); mais cópias da Relíquia não mudam nada (T1).
- **A Relíquia só atrapalha com os modos de ouro**: em T0 a vitória com ela em campo é 38,5% contra 51,8% sem ela. Cofre de Guerra (−2 de manutenção total) e Extorsão (+1 de ouro por destruição) poupam pouco ouro porque o jogo é limitado por cartas, não por ouro (a manutenção paga é só ~4 de ouro por partida). A IA escolhe Extorsão 52% e Cofre 42% das vezes e o Soldo em Dobro 5%.
- **Só com o Soldo em Dobro (+1 ATK nas cartas com manutenção) o deck vai a 53%** nos dois confrontos e a Relíquia passa a se pagar (53,2% com ela, 52,5% sem). Ou seja: o modo que dá **atributos** funciona; os que dão **ouro** não.
- U2 (manutenção 2, atributos maiores) deixa o deck forte (58%) e a Relíquia continua sem ajudar (55% × 65%).
- Caminhos a decidir com o dono (nada aplicado): (a) trocar Cofre e Extorsão por modos que paguem em **cartas ou atributos**, por exemplo "ao destruir uma unidade inimiga, compre 1 carta (máx. 1 por ciclo)" ou "suas cartas com manutenção ganham +1 de vida"; (b) manter os modos de ouro mas dar peso real à manutenção (U2) e retestar. A IA quase não dispensa cartas (0,0 a 0,4 por partida), então "pagar ou dispensar" segue sem prova no laboratório.
