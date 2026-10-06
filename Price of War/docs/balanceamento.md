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
