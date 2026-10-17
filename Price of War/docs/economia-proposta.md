# Economia (rodada 26)

## DECISÕES DO DONO (valem mais que a tabela de proposta mais abaixo)
- **Booster: 150 coroas** (ainda não ligado: precisa da abertura no servidor, etapas 1 e 2 abaixo).
- **Partida online contra pessoa não paga coroas** (só XP e ranking, como no Hearthstone). Coroas vêm de: IA (pouco), **primeira vitória do dia** e missões.
- **Repetidas viram coroas: comum 5, rara 15, ultra 50** (ainda não ligado).

## FEITO (etapa 3, no servidor): `src/engine/rewards.ts` + `server/handler.ts`
- Vitória contra pessoa: 60 XP, 0 coroas; derrota: 25 XP, 0 coroas.
- Vitória contra a IA: 35 XP, **5 coroas**; derrota 12 XP, 2 coroas; **teto de 30 coroas por dia vindo da IA** (`BOT_DAILY_CAP`).
- **Primeira vitória do dia: +30 coroas** em qualquer modo (`FIRST_WIN_COROAS`); aparece na tela de fim de partida. Partida curta ou abandonada não conta.
- O dia é o de Brasília. O contador fica na tabela `daily` (**SQL parte 11**, `docs/supabase-online-11.sql`); sem a tabela, o servidor paga só os valores base (sem bônus nem teto).
- Limite conhecido: duas contas do mesmo dono podem tirar 30 coroas por dia cada uma combinando partida; custo baixo, e o limite de "mesmo adversário" só vale hoje para pontos de ranking.

## Ritmo com essas regras
- Casual (1 vitória por dia, de qualquer modo): 30 + 5 = ~35 coroas/dia, um booster (150) a cada ~4 dias; com 1 missão de 25, ~3 dias.
- Dedicado (todas as missões + IA no teto): 30 + 30 + 2 missões de 25 = ~110/dia, um booster a cada ~1,4 dia.

## Proposta original (superada pelas decisões acima onde divergir)

Nada disto está no código. Hoje: boosters grátis e infinitos (`TEST_FREE_BOOSTERS`), preço de vitrine 100, jogador começa com 150 coroas, vitória online paga 25 (derrota 8), vitória contra a IA 12 (derrota 4), partida com menos de 3 rodadas não paga (`src/engine/rewards.ts`). A coleção ainda é escrita pelo aparelho (`docs/anti-trapaca.md`).

## Meta de ritmo (do dono: no máximo ~1 booster por dia para quem joga bastante)
- Jogador casual (1 partida por dia): um booster a cada ~3 dias.
- Jogador dedicado (muitas partidas): ~1 booster por dia, nunca mais.

## Proposta
| Item | Valor |
|---|---|
| Preço do booster (5 cartas) | **150** (igual às coroas iniciais: o primeiro booster sai de graça de verdade) |
| Vitória contra pessoa | 20 (hoje 25); derrota 8 |
| Vitória contra a IA (Desafios) | 5; derrota 2; **teto de 30 por dia** vindo da IA |
| 1ª vitória do dia (contra pessoa ou IA) | +30 |
| Missões diárias (2 por dia, sorteadas no servidor) | 25 coroas cada |
| Teto diário total de coroas por jogo | ~150 (dedicado chega perto; casual fica em ~55) |
| Carta repetida (acima do limite de cópias) | vira coroas: comum 10, rara 30, ultra 80 |

## Missões (só com o que o jogador já liberou)
Exemplos: "Vença 1 partida", "Jogue 5 cartas Táticas", "Destrua 3 unidades inimigas", "Jogue uma partida com cada um de 2 Generais". Sorteio por dia no servidor; nunca pede deck ou General que o jogador não tem.

## Contra fazenda (partida entre duas contas do mesmo dono)
- Coroas e XP seguem o mesmo limite de "mesmo adversário" já usado nos pontos (3 partidas em 24 h; depois não paga).
- Partida curta continua sem pagar (mínimo 3 rodadas, 14 passos).

## O que precisa ser feito no código (ordem)
1. **Servidor abre o booster** (função nova `openBooster`: cobra as coroas, sorteia as cartas e raridades, grava na coleção numa transação). O aparelho só pede e mostra.
2. **Fechar a escrita direta da coleção** pelo aparelho (SQL) e desligar `TEST_FREE_BOOSTERS`.
3. Valores novos em `rewards.ts`, contador diário e primeira vitória do dia (tabela `daily`), teto da IA.
4. Missões diárias (tabela `missions`, sorteio e progresso no servidor, mostradas na tela do menu).
5. Troca de repetidas por coroas.
6. Testes no servidor (preço, sorteio, teto, anti-fazenda) e simulação do ritmo (casual × dedicado).

Pontos que dependem do dono: o preço do booster, os valores diários, se haverá troca de repetidas e quais missões. Os decks, boosters e raridades já existem (`docs/raridades.md`).
