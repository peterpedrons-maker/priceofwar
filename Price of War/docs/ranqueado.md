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
- O aparelho usa `fetchRanked`, `fetchRanking` e o parâmetro `ranked` em `queueForMatch` (`src/services/online.ts`).

## Telas (no jogo, `src/RankedScreens.tsx`)
- **Online → Ranqueado:** escolhe o deck e entra na fila ranqueada ("Procurando adversário ranqueado…"). Sem conta: "Online precisa de conta".
- **Ranking** (botão do menu): temporada, abas Global e Minha liga, lista com medalhas de 1º a 3º, o símbolo da liga de cada um, e a sua linha fixa embaixo (com a posição) quando você não está entre os 50.
- **Ligas** (botão dentro do Ranking, e o Ranking dentro das Ligas): o símbolo da sua liga, as divisões em gemas, a barra de pontos, vitórias e derrotas, e a lista das 8 ligas (emblema, nome e faixa de pontos; sem recompensas nas linhas). Um ícone redondo "Recompensas" (coroa) no canto abre `RewardsScreen`, janela própria com a moldura e o prêmio de cada liga. Prévia: `docs/janelas/ranqueado-ligas-e-recompensas.png`. Os prêmios listados (`REWARD_LINES`) são exemplos; a entrega real vem com as temporadas.
- **Fim de partida ranqueada** (`RankedResult`, na tela de Vitória/Derrota): símbolo da liga, pontos ganhos ou perdidos, barra de tubo de vidro (ganho em verde, perda hachurada em vermelho), aviso do escudo e da classificação.
- **Subida de liga** (`PromotionOverlay`): o símbolo antigo se apaga, um clarão, o símbolo novo surge (com partículas e raios girando devagar), o nome da liga e Continuar. Dispara quando a recompensa diz `promoted`.
- **Placas no tabuleiro** (`PlayerPlate` em `App.tsx`): nas partidas online contra pessoas, cada lado do painel de turno mostra retrato + ouro + nome; no ranqueado o retrato ganha o anel da liga (`LeagueRing`, arte em `src/assets/ligas/<liga>.webp`, o anel tem 3x o retrato). O servidor manda `leagues` (liga de cada jogador, minha primeiro) no `MatchInit` das partidas ranqueadas. O elemento do ouro mantém os ids `npc-gold-badge`/`player-gold-badge`, então as animações de ouro seguem funcionando. Contra a IA (Desafios) continua o contador antigo. Prévia: `docs/janelas/ranqueado-placas-no-tabuleiro.png`.
- Ainda falta: a entrega das recompensas de temporada. Prévias: `docs/janelas/ranqueado-telas-no-jogo.png`, `ranqueado-subida-de-liga.gif`.

## Ordem de publicação
O servidor novo continua funcionando para partidas casuais mesmo antes do SQL 4 (as colunas de ranqueado só são usadas em partida ranqueada). Rode o SQL 4 antes de usar o ranqueado.

## Ainda não existe
Temporadas (o campo `season` já está na tabela), recompensas de fim de temporada, regras de quais decks valem no ranqueado, janela de Elo na fila.
