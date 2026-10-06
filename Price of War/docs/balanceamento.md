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
