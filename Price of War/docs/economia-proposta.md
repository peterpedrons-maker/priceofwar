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

## Missões: desenho combinado (rodada 26) e dados prontos
- **Modos:** missões `ia` (vitória/partidas nos Desafios), `free` (qualquer modo: Táticas jogadas, unidades convocadas, armas equipadas) e `ranked` (vitórias e ligas no ranqueado). Decisão do dono: as de vitória valem contra a IA e as **ranqueadas existem nos dados mas ficam desligadas** pela chave `RANKED_MISSIONS_ON` em `src/engine/missions.ts` (poucos jogadores no começo: missão ranqueada seria impossível). Desligadas, a vaga ranqueada do dia vira vaga "livre".
- **Dados:** `src/engine/missions.ts` (catálogo com prêmio, alvo e modo; vagas por dia e por semana; 1 troca por dia; bônus de +10 por divisão nova). Teste: `tests/missions.ts` (ids únicos, ranqueadas desligadas, ritmo: diárias ≤ 100, total ≤ 150 coroas por dia).
- **Prêmios:** diárias IA 10 a 15, livres 20, ranqueadas 25 e 35; semanais 60 a 100; temporada 50 (Ouro), 100 (Diamante), 200 (Senhor da Guerra), 40 (30 partidas). Ritmo medido no teste: diárias 85 + semanais 200/7 = ~114 coroas por dia no máximo (com as ranqueadas ligadas ~134).
- **Onde aparece:** botão **Missões** no menu principal (com bolinha vermelha com as que já podem ser coletadas); **dentro da partida não precisa**. Mockup: `public/mockups/missoes/` (`?v=menu|diarias|semanais|temporada`), feito com o kit do ranqueado (`janela`, `fita-coroa`, abas, linhas, barra, chips, botões).
- **Ainda falta (servidor + tela):** sorteio por dia/semana/temporada, contagem pelos eventos da partida, coleta e troca, tabela de missões (SQL), quadro no menu, e o servidor abrir os boosters.

## Missões: implementação (rodada 26)
- **Servidor** (`server/missions.ts`, ops `missions`, `missionClaim`, `missionReroll`): sorteio estável por jogador e período (dia de Brasília `d:`, semana de segunda `w:`, temporada `s:`), 5 diárias (2 IA + 3 livres) e 3 semanais com as ranqueadas desligadas; progresso contado **uma vez por partida** na hora do prêmio (partida curta/abandonada não conta): vitórias, partidas, Táticas jogadas, unidades jogadas da mão ("convocar"), armas equipadas, vitória com Generais diferentes. Coleta só com a missão cumprida, uma vez (versão da linha + `grant_coroas` atômico); troca 1 por dia, só de missão não cumprida, do mesmo modo e sem repetir. Tabela `missions` e função `grant_coroas` no **SQL 12** (`docs/supabase-online-12.sql`; sem ele as missões ficam indisponíveis e o resto do jogo segue normal). Teste: `tests/online-server.ts` ("missões: ...").
- **Tela** (`src/MissionsScreen.tsx`): abas Diárias/Semanais (Temporada só quando houver missões de temporada, ou seja, com `RANKED_MISSIONS_ON`), barra de progresso, coletar, "↻ Trocar", bolinha vermelha na aba e no Quadro (Missões) da vila com o número de missões a coletar. Só com conta (convidado vê o aviso para entrar).
- **Falta:** booster aberto pelo servidor (preço 150), repetidas → coroas, bônus por divisão, missão "vença 1 partida" no lugar do bônus de primeira vitória.

Teste de ponta a ponta (rodada 26q): com o mock (`/__debug/complete-missions`) completei as missões, a tela mostrou Coletar, coletou (saldo e bolinha da aba atualizados) e as coletadas descem para o fim da lista.
- **Transições na tela de Missões** (rodada 26): coletar dispara primeiro o efeito (brilho dourado na linha, moedas saltando, "+N" subindo, "✓ Completa!" no lugar do botão) e só depois chega o quadro novo, com a linha descendo até o fim da lista deslizando (`layout` do motion). Um aviso "+N coroas" aparece no topo (soma se coletar várias seguidas) e o botão **Coletar tudo +X** (aparece com 2 ou mais prontas) coleta uma por vez com o mesmo efeito.
- **Recompensa mais "sentida" (rodada 26b)**: ao coletar, no toque: brilho dourado na linha, raios girando e onda de choque saindo da recompensa, faíscas, moedas saltando, o selo dourado **COMPLETA** (com um visto) carimbando por cima do ícone (com clarão de impacto), som (`src/rewardSfx.ts`: batida grave do selo, arpejo de sinos em Ré, moedas) e vibração curta; **moedas voam do botão até o saldo** no topo da janela (portal no body), o saldo conta para cima e pulsa quando elas chegam; só então a linha desce. **Coletar tudo** termina com o painel "Missões completas!" (raios, clarão e acorde de Ré). O cabeçalho mostra "Hoje: X/Y coletadas" e o saldo de coroas.
- **Painel legível**: fundo escuro por dentro da moldura de cada linha (dourado-escuro quando pronta, verde-escuro quando coletada), painel geral escurecido, título #fff3d4 em 13 px com sombra e descrição #ecdfbf em 12,5 px (antes: letra clara sobre cinza claro).
- **Janela inteira escura (rodada 26c):** `Win` ganhou a opção `dark` (usada só nas Missões): um véu escuro cobre todo o interior da janela, incluindo cabeçalho e rodapé, e não só a coluna das missões.
- **Fundo todo da mesma cor (rodada 26d):** o véu sozinho não alcançava a faixa de pedra/couro da própria moldura (a imagem `kit-rank/janela.png` desenha esses 34 px de borda). Por isso a janela das Missões usa `kit-rank/janela-escura.png`: a mesma moldura com tudo o que **não é ouro nem gema** escurecido e levemente esquentado (pedra cinza e couro, por saturação; gerado por script PIL, ver o trecho no histórico do git desta rodada), mais um véu leve (`dark` em `Win`, `RankedScreens.tsx`). Resultado: uma cor só da borda ao centro, com o ouro intacto.
