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

## O que foi aplicado

1. **Capitão**: unidades com +2 ATK e +1 HP (`BALANCE` em `src/engine/catalog.ts`, separado dos atributos base; os testes de regras usam os atributos base, ver `tests/raw-stats.ts`). Táticas de posição de 4 para 2 cópias e Emboscadas de 4 para 3 (baralho de 62 para 49 cartas).
2. **IA planejadora** (`aiNextAction` em `src/engine/ai.ts`): em vez de decidir carta por carta, simula o turno inteiro no próprio motor (jogar, mover, atacar, usar habilidades, passar de fase) e escolhe a melhor sequência pela avaliação do tabuleiro, da mão e das ameaças. Guardar uma carta também é uma opção: uma carta na mão vale pontos, então só é jogada quando o efeito na mesa vale mais. Não "trapaceia": a mão do adversário some da simulação, e a ordem do próprio baralho é embaralhada. Tempo: ~12 ms por ação, pior caso ~170 ms. A IA antiga continua exportada (`aiLegacyAction`) para comparação e como reserva.
3. O servidor usa a mesma IA para a cadeira do bot.

## Resultados

Ver o final deste arquivo (números medidos depois das mudanças).

### Medido depois das mudanças (IA nova dos dois lados)
- Capitão × Cardeal: o Capitão vence **43%** (antes: 2–5%). Quem começa vence 57%. Partidas de ~5 rodadas.
- Turnos em que a IA não faz nada: **5%** (antes: 15–25%).
- IA nova contra a antiga, mesmo baralho: vence **83%** (40 de 48), igualmente com Capitão e com Cardeal.
- Tempo de pensamento da IA: ~13 ms por ação, pior caso ~165 ms (o servidor usa a mesma IA para o bot).
