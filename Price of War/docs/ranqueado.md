# Ranqueado (ligas, pontos e Elo): como funciona

Código: `src/engine/ranked.ts` (regras puras, testadas em `tests/ranked.ts`), `server/handler.ts` (fila, partida, pontos), `docs/supabase-online-4.sql` (tabelas). Números da primeira versão: mudam só em `ranked.ts`.

## Ligas e divisões
Ferro, Bronze, Prata, Ouro, Platina, Diamante e Mestre. 100 pontos = uma divisão, 4 divisões (IV a I) = uma liga (400 pontos). Mestre vai de 2400 pontos para cima, sem divisões. **Senhor da Guerra** não é uma faixa de pontos: são os 50 melhores Mestres (`TOP_LEAGUE_SIZE`), recalculado a cada consulta do ranking. Todo mundo começa com 0 (Ferro IV).

## Pontos (PDL, o que o jogador vê) e Elo escondido (MMR)
- **Classificação:** as 5 primeiras partidas ranqueadas. Vitória vale +60 e derrota −6 (os pontos andam rápido); o Elo anda com K = 48.
- **Depois:** vitória +20 e derrota −18 como base, ajustadas até ±8 pela diferença de Elo entre os dois (80 de Elo = 1 ponto): ganhar de quem é mais forte rende mais, perder para quem é mais fraco custa mais. Vitória vale no mínimo +8; derrota custa no mínimo −2. Elo com K = 32, começando em 1000.
- **Desistir ou deixar o relógio acabar:** perda com −6 a mais.
- **Escudo:** ao subir de liga, a próxima derrota não custa nada (uma vez). Cair de liga apaga o escudo.
- **Partida curta demais** (a que não paga recompensa, ver `rewards.ts`): nenhum ponto mexe.
- Os pontos nunca ficam abaixo de 0.

## Fila
Só entre pessoas (o adversário automático saiu do online; a IA fica nos Desafios). A fila ranqueada e a casual não se misturam (`queue.ranked`). Hoje a fila pega o jogador que espera há mais tempo; a função `mmrWindow` (janela de Elo que alarga com a espera) já existe e entra quando houver gente suficiente.

## Servidor
- `queue` com `ranked: true`: entra na fila ranqueada. `vsBot` nunca é ranqueado.
- Ao fim da partida, `ensureRewards` calcula, para os dois jogadores (lendo os dois perfis antes de mexer em qualquer um), o resultado de ladder e o guarda dentro da recompensa (`reward.ranked`); em seguida `rankedSettle` aplica uma única vez (`matches.ranked_done`), mesmo se a chamada que pagou as recompensas tiver caído no meio.
- `ranked` devolve os números do jogador (liga, divisão, pontos na divisão, vitórias, derrotas, escudo, pico, partidas de classificação que faltam, posição); `ranking` devolve a lista (até 100) e o jogador marcado. **O Elo escondido nunca vai para o aparelho** (há teste para isso).
- O aparelho já tem `fetchRanked`, `fetchRanking` e o parâmetro `ranked` em `queueForMatch` (`src/services/online.ts`). **As telas ainda não estão ligadas** (mockups em `docs/janelas/ranqueado-*.png`).

## Ordem de publicação
O servidor novo continua funcionando para partidas casuais mesmo antes do SQL 4 (as colunas de ranqueado só são usadas em partida ranqueada). Rode o SQL 4 antes de usar o ranqueado.

## Ainda não existe
Temporadas (o campo `season` já está na tabela), recompensas de fim de temporada, regras de quais decks valem no ranqueado, janela de Elo na fila, telas no jogo (Ligas, Ranking, fim de partida ranqueada, moldura do retrato no tabuleiro).
