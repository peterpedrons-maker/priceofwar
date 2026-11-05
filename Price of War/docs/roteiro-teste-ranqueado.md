# Roteiro de teste do ranqueado (duas contas)

Objetivo: ver, numa partida de verdade, a fila ranqueada, os pontos, as placas com anel, a subida de liga e o fim de temporada com o resgate.

## 0. Antes de começar
1. **Banco:** no Supabase → SQL Editor → New query, cole o `docs/supabase-tudo.sql` inteiro e clique Run. Pode rodar de novo à vontade. Ele inclui os SQLs 1 a 5 e a tabela do ajuste de calendário. Se aparecer "Success. No rows returned", deu certo.
2. **Servidor:** o push na branch publica sozinho (GitHub → Actions → "Deploy game server" verde). Se estiver vermelho, me avise.
3. **App:** abra o jogo atualizado nos dois aparelhos (recarregue a página/PWA, ou feche e abra de novo, para pegar a versão nova).
4. **Contas:** duas contas diferentes (duas contas Google/Discord, ou uma em cada aparelho). Cada uma precisa de um deck válido.

## 1. Fila ranqueada
1. Nos dois aparelhos: menu → **Online → Ranqueado** → escolha o deck.
2. Esperado: "Procurando adversário ranqueado…". Os dois são pareados em poucos segundos (a fila ranqueada só pareia com ranqueada).
3. Contra-prova: com um aparelho no **Casual** e o outro no **Ranqueado**, eles **não** devem se encontrar.
4. Sem conta (modo local): "Online precisa de conta".

## 2. Dentro da partida
1. Cada lado do painel de turno mostra uma placa: retrato com anel da liga, ouro e nome.
2. Confira: nada sobrepõe o painel de turno; o número do ouro cabe no contador; o nome longo é cortado com "…".
3. Jogue umas rodadas. O ouro gasto deve continuar "voando" para o contador certo.
4. Teste os recados rápidos (emotes), se quiser.

## 3. Fim da partida e pontos
1. Termine a partida (um vence, o outro perde). Dica: um pode desistir pelo menu para ser rápido (desistir custa 6 pontos a mais).
2. Esperado na tela de Vitória/Derrota: símbolo da liga, os pontos ganhos/perdidos e a barra de tubo (verde = ganho, vermelho hachurado = perda).
3. **Classificação:** nas 5 primeiras partidas, vitória vale +60 e derrota −6. Depois, ~+20 / −18.
4. Menu → **Ranking**: os dois aparecem; sua linha mostra a posição. Botão **Ligas**: símbolo, gemas das divisões, barra e vitórias/derrotas.
5. **Partida muito curta** (desistir logo no começo) não mexe em nenhum ponto.
6. Para ver a **subida de liga** (efeito do símbolo trocando): ganhe até passar de 400 pontos (Ferro → Bronze). Na classificação são +60 por vitória, então ~7 vitórias.

## 4. Fim de temporada (adiantando o calendário)
Use contas de teste: quem fecha a temporada não volta atrás.
1. No SQL Editor:
   ```sql
   update public.game_settings set value = '61' where key = 'season_offset_days';
   ```
2. Em cada aparelho, abra **Ranking** ou **Ligas**.
3. Esperado:
   - o Ranking mostra "Temporada 2";
   - seus pontos caem pela metade (ex.: 500 → 200) e as 5 partidas de classificação voltam;
   - na janela de Ligas, o ícone **Recompensas** ganha uma bolinha vermelha com "1".
4. Toque em **Recompensas** → cartão "Temporada 1 encerrada" → **Resgatar**.
   - O cartão some, a bolinha some e as coroas aumentam (Ferro +25, Bronze +50, Prata +100…; confira no menu).
   - Tocar de novo / reabrir **não** paga outra vez.
5. Jogue mais uma partida ranqueada: o anel do retrato deve ser o da moldura conquistada (ou o da liga atual, se for melhor).
6. Voltar ao normal:
   ```sql
   update public.game_settings set value = '0' where key = 'season_offset_days';
   ```
   Quem já fechou fica na temporada nova.

## 5. O que me contar
Prints ou descrição de qualquer coisa estranha: placa apertada no seu celular (modelo), número do ouro cortado, pontos que não bateram com o esperado, fila que não pareia, botão que não responde, erro vermelho na tela.
