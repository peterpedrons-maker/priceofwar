# Planos futuros (ideias do dono, ainda nada aplicado): economia, boosters e ranqueado

Registro das decisões e ideias conversadas. **Nenhuma está no código.** A ordem combinada: primeiro fechar as cartas e os boosters; só depois ligar o que depende deles.

## 1. Limites de cartas no ranqueado (estilo Hearthstone, sem banimento)
- Não proibir cartas: **limitar a 1 cópia** no ranqueado as cartas muito fortes. Casual e Desafios seguem livres.
- Fazer em **dados** (um campo no catálogo, ex.: `rankedLimit: 1`), conferido pelo servidor junto com `deckProblem` só quando a fila é ranqueada; nada por nome de carta no código.
- Decidir a lista com **números**: o laboratório (`docs/balanceamento.md`) mostra quais cartas sobem muito a taxa de vitória do deck; depois do lançamento, com partidas reais. A lista pode mudar a cada temporada.
- Espera os novos decks do dono.

## 2. Pontos de liga mais "inteligentes" (Elo escondido guiando o que o jogador ganha e perde)
Hoje: vitória +20 e derrota −18 de base, ajustadas até ±8 pela diferença de Elo para o **adversário**. Ideia: o ganho e a perda também dependerem de **como o Elo escondido do jogador está em relação aos pontos que ele mostra** (e/ou da sequência recente), sem virar "ganha 20, perde 25":
- Se o Elo escondido diz que ele é melhor do que o ranque mostra, vitórias valem um pouco mais e derrotas custam um pouco menos (sobe mais rápido até o lugar certo). Se está pior, o contrário.
- Variação pequena e **simétrica no meio**: perto da média, ganho e perda quase iguais (ex.: +23 / −21), e nunca a distância de 20 para 25 do League of Legends. Limite proposto: |ganho − perda| ≤ ~4 no estado normal e ajuste de sequência de no máximo ±3.
- Validar com **simulação** antes de aplicar (jogadores com habilidade escondida jogando milhares de partidas): cada um deve parar no ranque que combina com a habilidade, sem inflação de pontos nem jogador preso.

## 3. Economia e boosters
- Primeiro refazer os boosters (que cartas entram em cada um). Depois, custo "razoável" em coroas (ex.: 120).
- Contra a IA o ganho deve ser **pequeno** (ex.: ~5 coroas por vitória) para ninguém farmar bot. Duas formas, que podem somar:
  1. **Primeira vitória do dia por General** (ex.: 30 coroas) e as seguintes bem menos, com **teto diário**. Incentiva testar todos os decks.
  2. **Missões diárias** (como no Hearthstone), sorteadas no servidor, **só com o que o jogador já liberou** (nunca "derrote o General X" sem ter acesso a ele), com um sorteio novo por dia.
- Ordem de grandeza para pensar: no máximo ~1 booster por dia para quem joga bastante.
- **Importante:** hoje cada vitória online paga +25 coroas e XP. Quando as coroas valerem de verdade, isso vira fazenda (duas contas se alternando). Antes de cobrar boosters: reduzir o pagamento, aplicar o mesmo limite de "mesmo adversário" também às coroas e exigir número mínimo de rodadas.
- Tudo isso (contador diário, missões, boosters) precisa ser **no servidor** (ver `docs/anti-trapaca.md`: abrir booster por função no servidor e fechar a escrita da coleção pelo aparelho).

## 4. Entrada no ranqueado
- O ranqueado só abre depois de o jogador ter **nível mínimo** (ideia: 10 a 15), jogando casual e contra a IA, para conhecer o jogo antes.
- Pontos a decidir: a curva de XP hoje é muito rápida (subiu ao nível 4 na primeira partida), então o nível precisa ser reajustado para esse número significar algumas horas de jogo; além do nível, pode exigir ter concluído o tutorial. Mostrar no menu "Ranqueado libera no nível N" com o progresso.
- O servidor confere o nível (não o aparelho).
