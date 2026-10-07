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

### Perfil de partida: Cardeal × Capitão (120 partidas IA × IA; `N=60 npx tsx tests/match-report.ts`)
Cardeal 54,2% × Capitão 45,8%; quem começa vence 55,8%. Duração: média 7,4 rodadas, mediana 7, de 3 a 18; 28% acabam até a rodada 5, 33% na 6–7, 39% na 8 ou mais. Médias por turno do próprio deck:
| Por turno | Cardeal | Capitão |
|---|---|---|
| Dano causado no próprio turno (no General) | 5,4 (2,8) | 7,5 (2,5) |
| Ataques / unidades abatidas | 1,6 / 0,63 | 1,5 / 0,91 |
| Cartas jogadas (todas) | 2,2 | 1,7 |
| Soldados convocados da mão | 1,4 | 1,0 |
| Táticas jogadas | 0,75 | 0,61 |
| Soldados por efeito (fichas, Chamado às Armas) | 0,26 | 0 |
| Ouro gasto / ouro que sobra no fim do turno | 6,0 / 1,2 | 3,6 / **12,3** |
| Cartas na mão no fim do turno | 2,2 | 1,6 |
| Unidades em campo / material (ATK + vida) | 3,2 / 16,4 | 1,95 / 12,1 |
| Turnos sem jogar carta / sem atacar | 7% / 32% | 22% / 34% |
| Dano por partida na vez do adversário (retaliação, Emboscada) | 9,0 | 20,9 |
Primeiro turno (cartas jogadas / soldados / dano / material): Cardeal 5,8 / 3,9 / 5,8 / 24; Capitão 5,8 / 3,6 / 5,6 / 23. Depois do 1º turno, os dois jogam de 1 a 2 cartas por turno (a mão esvazia: 7 cartas + 1 compra por turno).
Leitura: o **Cardeal é limitado por ouro** (gasta tudo, ~6 por turno) e o **Capitão é limitado por cartas** (termina o turno com ~12 de ouro sobrando e 22% dos turnos sem jogar nada). O Capitão causa mais dano por turno (Cavaleiro Tático) e vence pela qualidade de poucas peças; o Cardeal ocupa mais campo. A tabela de custo mexe no Cardeal, não no Capitão.
Uma partida narrada fica em `balance-out/partida-narrada.txt` (a pasta é ignorada pelo git).

### Rodada 11: Relíquia dos Mercenários com modos que pagam em cartas (200 partidas por confronto)
| Cenário | Mercenários × Cardeal | Mercenários × Capitão | Média | Vitória com × sem a Relíquia |
|---|---|---|---|---|
| S · só Soldo em Dobro | 53% | 53% | 53% | 53,2% × 52,5% |
| **C1 · Soldo em Dobro + Saque** (ao destruir unidade inimiga, compre 1 carta, máx. 1 por ciclo) | 61,5% | 49,5% | 55,5% | **56,5% × 52,5%** |
| C2 · C1 + Cofre de Guerra | 56% | 47,5% | 51,8% | 51,5% × 52,5% |
Leitura: com modos que pagam em carta ou atributo, **a Relíquia passa a se pagar** (C1: +4 pontos com ela em campo; com os modos de ouro era −13). A IA escolhe Saque em 71% das vezes em C1. Voltar o Cofre de Guerra (C2) dilui de novo. Os modos de ouro (Cofre de Guerra, Extorsão) devem ser trocados. `RelicMode.loot` agora aceita `draw` (cartas) além de `gold`.

### Rodada 12: mão inicial de 10 cartas (era 7), custos e ouro como estão (120 partidas Cardeal × Capitão; `PATCH` com `rules.startHand`)
Teste a pedido do dono (só no laboratório; o jogo segue com 7). Comparação com o perfil de partida acima (mão de 7):
| | 7 cartas | 10 cartas |
|---|---|---|
| Vitórias Cardeal × Capitão | 54,2% × 45,8% | **39,2% × 60,8%** |
| Quem começa vence | 55,8% | 47,5% |
| Duração média / mediana; acabam até a rodada 5 | 7,4 / 7; 28% | 7,6 / 6; 33% |
| 1º turno: cartas jogadas / material em campo (Cardeal; Capitão) | 5,8 / 24; 5,8 / 23 | 6,1 / 26; 6,3 / 26 |
| Cartas jogadas por turno (Cardeal; Capitão) | 2,2; 1,7 | 2,5; 2,0 |
| Soldados convocados por turno | 1,4; 1,0 | 1,5; 1,15 |
| Unidades em campo / material no fim do turno (Cardeal) | 3,2 / 16,4 | 3,3 / 16,3 |
| Unidades em campo / material no fim do turno (Capitão) | 1,95 / 12,1 | 2,4 / 14,5 |
| Dano por turno (Cardeal; Capitão) | 5,4; 7,5 | 5,2; **9,1** |
| Ouro que sobra no fim do turno (Cardeal; Capitão) | 1,2; 12,3 | 0,5; 9,9 |
| Cartas na mão no fim do turno (Cardeal; Capitão) | 2,2; 1,6 | **3,5**; 2,4 |
Leitura: a mão maior **só ajuda o Capitão** (limitado por cartas) e desloca o confronto ~15 pontos a favor dele; o Cardeal (limitado por ouro) acumula cartas na mão (3,5) mas põe a mesma tropa em campo. O 1º turno quase não muda (limitado por ouro) e o campo continua longe de cheio (média de 3,3 e 2,4 unidades de 10 casas). Duas alavancas atacam gargalos diferentes: mais cartas (Capitão) e custo/ouro (Cardeal); a combinação das duas ainda não foi testada.

### Rodada 13: comprar 2 cartas por turno (120 partidas Cardeal × Capitão por cenário; `rules.drawPerTurn` + `tests/match-report.ts`)
Cenários (só no laboratório): **base** (compra 1); **D2** (compra 2, custos como estão); **D2C** (compra 2 e os custos do Cardeal antes da rodada 6: cavalaria 4→3, unidades 3→2). Valores por partida/turno, Cardeal | Capitão:
| | Base | D2 (compra 2) | D2C (compra 2 + custos do Cardeal aliviados) |
|---|---|---|---|
| Vitórias | 54% × 46% | **13% × 87%** | 42,5% × 57,5% |
| Duração média; acabam até a rodada 5 | 7,4; 28% | 7,0; 34% | 6,8; 37% |
| Cartas usadas por partida (jogadas + Emboscadas) | 15,5 \| 11,8 | 18,5 \| 17,2 | 21,0 \| 16,9 |
| Cartas compradas por partida | 10,5 \| 7,3 | 16,2 \| 13,9 | 17,0 \| 13,2 |
| Cartas jogadas por turno / soldados da mão | 2,2 / 1,4 \| 1,7 / 1,0 | 2,8 / 1,7 \| 2,5 / 1,4 | 3,2 / 2,0 \| 2,6 / 1,5 |
| Ouro gasto por turno / sobra no fim | 6,0 / 1,2 \| 3,6 / 12,3 | 6,6 / 0,2 \| 5,3 / 4,7 | 6,5 / 0,3 \| 5,5 / 4,0 |
| Cartas na mão no fim do turno | 2,2 \| 1,6 | 4,5 \| 2,4 | 3,2 \| 2,1 |
| Turnos sem jogar carta | 7% \| 22% | 0% \| 9% | 1% \| 6% |
| Unidades em campo (média no fim do turno) / pico | 3,3 / 5,5 \| 2,0 / 3,9 | 3,1 / 5,4 \| 3,1 / 4,6 | **4,0 / 6,4** \| 2,7 / 4,5 |
| Material em campo (ATK + vida) | 16,4 \| 12,1 | 15,4 \| 18,5 | 19,5 \| 16,5 |
| Dano por turno / abates por turno | 5,4 / 0,6 \| 7,5 / 0,9 | 4,8 / 0,8 \| **11,5 / 1,4** | 6,8 / 1,0 \| 10,4 / 1,4 |
| 1º turno: cartas / soldados / material | 5,8 / 3,9 / 24 \| 5,8 / 3,6 / 23 | 6,0 / 4,1 / 25 \| 6,2 / 3,9 / 25 | **7,0 / 4,8 / 28** \| 6,2 / 3,9 / 25 |
| Cartas que restam no baralho no fim | 41 \| 45 | 35 \| 38 | 34 \| 39 |
| Descartes por excesso de mão (limite 10) | 0 \| 0 | 0 \| 0 | 0 \| 0 |
Leitura:
- **Comprar 2 sozinho quebra o equilíbrio** (Cardeal 13%): o Capitão, limitado por cartas, transforma carta em dano (11,5 por turno); o Cardeal, limitado por ouro, acumula 4,5 cartas na mão e põe a mesma tropa em campo.
- **Aliviar os custos do Cardeal conserta a maior parte** (42,5%), usa 35% mais cartas por partida e quase some com os turnos sem jogar, **mas devolve o problema do 1º turno do Cardeal** (7 cartas, 4,8 soldados, 28 de material), o que levou à rodada 6.
- **O tabuleiro continua longe de cheio** (4,0 e 2,7 de 10 casas em média; pico 6,4 e 4,5): quanto mais se joga, mais se mata (até 1,4 unidades abatidas por turno), então a ocupação se mantém. Encher as casas pede reduzir a letalidade ou criar corpos fora da mão (fichas/Levas), além de mais cartas.
- Nunca houve descarte por excesso de mão: a mão não passa de 4,5 cartas.

### Rodada 14: IA que racionaliza (`AiStyle.ration`) e 10 cartas iniciais + comprar 2 (120 partidas por cenário)
**A IA racional** (opção desligada por padrão; `aiNextAction(state, seat, rand, { ration: 1 })`): cartas guardadas na mão valem mais e Táticas de dano em área esperam mais alvos. Arena (`tests/ai-ration.ts`): IA atual × IA racional, Cardeal e Capitão nas duas cadeiras.
| Regras | Racional vence | Racional com o Cardeal | Racional com o Capitão |
|---|---|---|---|
| De hoje (7 cartas, compra 1) | **50,8%** | 51,7% | 50,0% |
| 10 cartas iniciais + compra 2 | 46,7% | 1,7% | 91,7% |
Leitura: **racionar não torna a IA melhor nem pior** (50,8% é empate). Ela joga só ~3% menos cartas (13,4 contra 13,9 por partida; 5,7 contra 5,9 no 1º turno), porque o limite é o ouro, não a vontade de jogar. No cenário 10+2 o resultado é decidido pelo deck (o Capitão vence ~92% com qualquer IA), não pela IA. A IA atual não "joga tudo por defeito": gasta o ouro que tem, e guardar carta não rende mais.
**10 cartas iniciais + comprar 2, custos como estão (IA atual dos dois lados; IA racional dá resultado igual):** Cardeal 7,5% × Capitão 92,5%. Partidas curtas: média 5,9 rodadas, 53% acabam até a rodada 5. Por turno (Cardeal | Capitão): cartas jogadas 3,1 | 2,8; soldados da mão 1,9 | 1,7; dano 5,4 | 12,6; ouro gasto 7,0 | 6,0; ouro que sobra 0,06 | 1,5; **cartas na mão no fim do turno 6,5 | 4,2**; unidades em campo 3,1 | 3,4 (pico 5,3 | 5,0); material 15 | 21. Cartas usadas por partida 16,8 | 16,6; compradas 13,3 | 11,7; descarte por excesso de mão ≈ 0. Primeiro turno: 6,1 cartas / 27 de material (Cardeal) e 6,4 / 28 (Capitão).
Leitura: com 12 cartas no 1º turno o jogador não é forçado a descartar: o ouro limita o que se joga (~6 cartas) e a mão cai para ~6, nunca chegando ao limite de 10. A pressão "use ou perca" só existiria com limite de mão menor. O Cardeal, limitado por ouro, ainda perde de longe; esse pacote exige aliviar o ouro do Cardeal (custos, como na rodada 13) para equilibrar.

### Rodada 15: Mercenários com Soldo em Dobro + Saque (200 partidas por confronto, IA × IA, regras de hoje)
Relíquia só com os dois modos que funcionaram (Soldo em Dobro e Saque); uma Agência de Recrutamento a menos (2→1) e uma Armadura Alugada a mais (2→3); custos pela tabela.
| | Mercenários | Adversário |
|---|---|---|
| × Cardeal | **59,0%** | 41,0% |
| × Capitão | **46,5%** | 53,5% |
Média 52,8%. Com os resultados já medidos (Cardeal 54% × Capitão 46%), os três decks formam um **triângulo**: Mercenários vence o Cardeal (59%), o Capitão vence os Mercenários (53,5%) e o Cardeal vence o Capitão (54%), todos dentro de 40% a 60%.
Leitura: a Relíquia agora é neutra a favorável (vitória com ela 53,2%, sem ela 51,1%) e a IA escolhe Saque em 72% das vezes. Cartas fortes: Salva de Besteiros (+12), Carga de Pólvora (+12), Duelista Livre (+11), Espadachim do Soldo (+11), Agência de Recrutamento (+10, mesmo com 1 cópia). Fracas: Desertor (−7,7), Tesoureiro da Companhia (−6,9), Suborno (−6,1), Espada de Aluguel (−6,0), Escriba de Contratos (−5,4); margem de ±5 pontos por carta. Ainda sem prova: a IA quase não dispensa carta (0,0 por partida), então o "pagar ou dispensar" depende de gente jogando.

### Rodada 16: manutenção mais cara nos Mercenários (200 partidas por confronto, IA × IA; Relíquia com Soldo em Dobro + Saque)
Pergunta: com manutenção 1 a IA nunca dispensa e o ouro sobra; e se a manutenção custar mais? "Atributos +N" = soma de ATK + vida maior em todos os mercenários (regra de bolso "manutenção compra atributos", N por ponto de manutenção).
| Cenário | × Cardeal | × Capitão | Média | Ouro de manutenção por partida | Dispensas por partida |
|---|---|---|---|---|---|
| Manutenção 1 (rodada 15) | 59% | 46,5% | 52,8% | 6,4 | 0,0 |
| N2 · manutenção 2, atributos como estão | 39,5% | 39,5% | 39,5% | 9,5 | 0,4 |
| N3 · manutenção 3, atributos como estão | 31,5% | 38% | 34,8% | 10,8 | 1,1 |
| K2 · manutenção 2, atributos +1 de soma | 66,5% | 58,5% | 62,5% | 12,6 | 0,5 |
| K3 · manutenção 3, atributos +2 de soma | 71% | 58% | 64,5% | 13,6 | 1,8 |
Leitura: cada ponto a mais de manutenção custa uns 13 pontos de vitória ao deck, mas +1 de soma nos atributos devolve uns 23: **o troco de 1 de soma por ponto de manutenção é generoso demais**; o valor está perto de **meio ponto de soma por ponto de manutenção**. Mesmo com manutenção 3 a IA dispensa só 1 a 2 cartas por partida (paga ~2 de ouro por turno de uma renda de 5): o jogo continua sem pressão de ouro suficiente para "dispensar" ser rotina. A regra da tabela deve ser ajustada para ~0,5 de soma por ponto de manutenção.

### Rodada 17: IA que decide a manutenção + manutenção mais cara só em cartas fortes (200 partidas por confronto)
A IA agora decide quem continua comparando, para cada combinação, o valor das tropas mantidas com o que o ouro restante compra da mão (uma mochila de custo × valor); tropas que voltam à mão ou têm Rescisão que compra carta custam menos para dispensar (`upkeepAnswer` em `ai.ts`). Atributos das cartas não foram alterados em nenhum cenário.
| Cenário | × Cardeal | × Capitão | Média | Ouro de manutenção por partida | Dispensas por partida (voltam à mão) |
|---|---|---|---|---|---|
| Manutenção 1 (como na rodada 15) | 58,5% | 48,5% | 53,5% | 5,3 | 1,1 (0,6) |
| N2 · manutenção 2 em todos (Capitão 3) | 43% | 38,5% | 40,8% | 4,8 | **2,7** (1,5) |
| M3 · manutenção 2 em Espadachim, Duelista e Cavaleiro Errante; Capitão da Companhia 3 | 49% | 40,5% | 44,8% | 5,1 | 2,2 (1,3) |
| **M4 · manutenção 2 só em Espadachim do Soldo e Duelista Livre** | **55%** | **44%** | **49,5%** | 5,3 | **1,4** (0,8) |
Leitura: com a IA nova **a decisão "pagar ou dispensar" passa a existir** (de 0,0 para 1 a 3 dispensas por partida; antes a IA pagava tudo). Cada ponto de manutenção em cartas muito usadas custa ~2 pontos de vitória por carta. **M4 foi aplicado ao deck de teste** (`src/engine/experimental.ts`): os três decks seguem em triângulo (Mercenários vencem o Cardeal 55%, Capitão vence os Mercenários 56%, Cardeal vence o Capitão ~54%). Ainda sem prova: como uma pessoa decide, e a IA decide uma vez por turno (a escolha não vê o que o adversário fará).

## Rodada 18: auditoria de ataque do Capitão (a pedido do dono: "ele fica com 8, 9, 9, 7 de ataque")
Ferramentas: `tests/atk-audit.ts` (ATK real no momento do golpe, IA × IA, 40 sementes × 2 cadeiras × 3 duelos) e `tests/atk-combo.ts` (o teto de uma jogada humana, no motor).
- **IA × IA:** ATK médio por golpe: Cardeal 2,7 · Mercenários 3,5 · **Capitão 4,6**; golpes com ATK ≥ 6: 1,5% · 7,3% · **28%**; ≥ 8: 0% · 0,2% · **9%**; máximo visto: Cardeal 7 · Mercenários 8 · **Capitão 15 (Batedor)**. A IA move 1,9 vez por turno.
- **Teto humano (`atk-combo.ts`):** Reformar Linhas (+3 movimentos) + Capitão de Formação indo e voltando + Cavaleiro Tático + 2 Avanços Coordenados + Aurelion no fim do turno: Veterano de Guerra com **12**, Cavaleiro com **10**, Soldado com 7. Causas: `buff_adjacent` (Capitão de Formação +2, Cavaleiro Tático +1) **soma a cada movimento e não tem teto**; os movimentos extras de Reformar Linhas deixam a mesma carta se mover várias vezes; Batedor ganha +1 ATK permanente por ataque sem teto; Aurelion soma +2 a quem se moveu (inclusive o parceiro da troca).
- **Conclusão:** o equilíbrio medido (~50% do Capitão) subestima a força quando uma pessoa joga, porque a IA não procura essas sequências.
