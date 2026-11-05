# Online matches: setup and how to test

Online play has three parts: **two tables + one function in the database** (the SQL), **the `game` Edge Function**
(the server that matches players and checks every move with the game's own rules engine), and the app itself.
Until the function is deployed the app still works: Desafios falls back to a local match, and Online → Casual says the
server is unavailable.

## 1. Create the tables (once each)

Supabase → **SQL Editor** → New query → paste the file → Run, in this order:
1. `docs/supabase-online.sql` (the first online version: queue and matches);
2. `docs/supabase-online-2.sql` (hidden hands, turn clock and rewards: adds the per-player views table, the clock and
   reward columns, and the function that pays rewards). It also closes any match left open by the first version.
(Run `docs/supabase-schema.sql` first if you have not — it is already done in this project.)

Run step 2 **right after** the new version of the app and the function are published: the old app does not know the
new tables.

## 1b. Quick messages (phrases and emojis): one more table
Supabase → SQL Editor → New query → paste `docs/supabase-online-3.sql` → Run (safe to repeat). It creates `match_emotes`, which only the game server reads and writes. **Without it the rest of the game works; only the new balloon button fails** (the server answers an error and nothing is shown). Run it right after publishing the new server function (step 2).

## 1c. Ranked ladder: one more SQL
Run `docs/supabase-online-4.sql` (safe to repeat; also included at the end of `docs/supabase-tudo.sql`). It adds the ranked flag to the queue and matches, the `ranked_profiles` table, and the `queue_take` / `apply_ranked_result` functions. Run it before using ranked. Casual matches keep working on a database that has not run it yet (the server only touches the ranked columns for a ranked match). See `docs/ranqueado.md`.

Then run `docs/supabase-online-5.sql` (ranked seasons: the `frame` column, the `ranked_seasons` table, `close_ranked_season` / `claim_ranked_season`, and an updated `apply_ranked_result`; also at the end of `docs/supabase-tudo.sql`). The new server needs it for any ranked call.

## 2. Deploy the game server

The server is one file: `supabase/functions/game/index.ts` (generated from `server/` and `src/engine/`; rebuild it
with `npm run build:edge` after changing rules — it is committed, so you normally do not need to). `tests/edge-bundle.ts` (part of `npm test`) fails when the committed file is stale.

**Option A — dashboard (no tools):** Supabase → **Edge Functions** → *Deploy a new function* → *Via Editor* →
name it exactly `game` → replace the sample code with the whole contents of `supabase/functions/game/index.ts` → Deploy.
In the function's settings, turn **off** "Verify JWT" (the function checks the player's login itself).

**Option A2 — automatic, from GitHub (best from a phone, nothing to paste):** the repository has a workflow,
*Deploy game server*, that publishes the function by itself. One-time setup:
1. Supabase → your avatar (top right) → **Account preferences → Access Tokens → Generate new token**; copy it.
2. GitHub → this repository → **Settings → Secrets and variables → Actions → New repository secret**:
   name `SUPABASE_ACCESS_TOKEN`, value = the token.
3. GitHub → **Actions → Deploy game server → the latest run → Re-run all jobs** (or push any change under `supabase/`).
   When it turns green the function is live — nothing else to do (Verify JWT is already off).

**Option B — CLI** (from the repository root):
```
npx supabase login
npx supabase functions deploy game --project-ref ljytihmtsaagsxzhlmsg --no-verify-jwt
```

Nothing else to configure: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided to Edge Functions automatically.

## 3. Test it

- **Two people (or two devices / one normal + one private window):** each opens the game, signs in (guest is fine),
  Online → Casual → pick a deck. The first one waits on "Procurando adversário…"; as soon as the second joins both get
  "Adversário encontrado!", the coin toss, and the match.
- **Alone:** Online → Casual keeps waiting on "Procurando adversário…": **there is no AI opponent in online play** (owner's
  decision, rodada 21). The AI is only in the **Desafios**. Testing the online mode alone therefore needs two accounts or two devices.
  A waiting player's queue entry is refreshed by every status poll; an entry nobody has refreshed for 20 s (`queueStaleMs`) is a player who
  left and is skipped, so nobody is matched with a ghost. Without an account, Online shows "Online precisa de conta".
- **Desafios** (against the AI) also goes through the server now, so it is recorded like any other match.
- **Desistir** (top right) gives up. Reloading mid-match and choosing Online → Casual again brings you back to the match.

## How it works (so you know what is and is not checked)

- The server holds the match and applies each action with `applyAction`; a refused action is never recorded. It checks
  your deck against your cloud collection (size, copies, ownership) when you enter the queue.
- **Hidden information:** the server sends each player only their own view of the match (the opponent's hand shows as
  face-down cards, nobody can see the order of any deck). A modified app cannot show what it never received.
- **Your actions** are shown at once on your screen and sent to the server; when the server's answer arrives it replaces
  what you see (a refused action is undone with a message). A few actions wait for the server before showing
  (attacks, because the other player's hand decides whether an Emboscada answers, and cards that search a deck).
  **The opponent's actions** arrive within about a second and are played out with the usual animations.
- **Turn clock:** 2 min 30 s per turn and 1 min to answer a prompt (Emboscada, pick). When the time runs out the server
  plays a pass for that player (the prompt is answered with the default choice); a second timeout in a row gives the
  match to the other player. The clock is shown at the top of the screen. It is enforced by the server whenever either
  player's app asks (every few seconds), so closing the app does not freeze the match.
- **Rewards:** paid by the server once, when the match ends (values in `src/engine/rewards.ts`, easy to tune):
  win against a person 60 XP + 25 Coroas, loss 25 XP + 8 Coroas; against the AI win 35 XP + 12 Coroas, loss 12 XP +
  4 Coroas. Matches shorter than 3 rounds or 14 steps pay nothing, and neither does giving up or being timed out.
  Level up costs 100 XP at level 1 and 50 more per level.
- Every action is saved in `match_steps`, so any match can be replayed and verified.

**Known limits of this test version**
- A player who stays away is only closed by the clock when somebody (the other player's app) is asking; a match
  against the AI that nobody watches is closed after 45 minutes.
- Rewards are only for matches played through the server (Online → Casual, and Desafios while logged in).
- The prices and rewards are test values.

## Trying it without Supabase

`tests/mock-supabase.ts` is a local stand-in that runs the real game server code in memory:
```
npx tsx tests/mock-supabase.ts
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=test.anon.key npm run build
```
(`MOCK_TURN_MS` / `MOCK_PROMPT_MS` shorten the turn clock for tests.)

## Quem começa (cara ou coroa)
O servidor sorteia o vencedor da moeda ao criar a partida (`matches.first` guarda a cadeira do vencedor, e não muda). A partida fica **sem nenhum passo** até o vencedor escolher: ele manda a ação `choose_first` (`goFirst: true` = começar, `false` = ir depois) e o servidor grava dois passos, `choose_first` e `begin` (feito por quem vai começar). Contra o bot: se o bot vence a moeda, ele escolhe ao acaso e a partida já abre; se o jogador vence, ele escolhe como qualquer um. A escolha tem o relógio de resposta (`promptMs`): se esgotar, a partida abre com o vencedor começando, e conta como um tempo esgotado. Nenhuma coluna nova no banco: o estado "esperando escolha" é `steps_count = 0`.

## GM / painel do dono (rodada 26)
Um botão **GM** aparece no menu principal **só** para a conta do dono. O painel mostra jogadores online agora, fila, partidas em andamento (casual, ranqueada, contra a IA), total de contas, contas novas (24 h e 7 dias) com a lista das últimas 15, partidas das últimas 24 h e o topo do ranking. Atualiza sozinho a cada 20 s.
- **Quem entra:** o servidor (função `game`, ops `admin` e `ping`) confere o login. Vale o **e-mail confirmado** que estiver no segredo `ADMIN_EMAILS` (lista separada por vírgula) ou o **id** de usuário que estiver em `ADMIN_USER_IDS`. A lista nunca fica no código nem no GitHub, e o app não decide nada: quem não é admin recebe `forbidden` e o botão nem aparece. Entre no jogo com Google/Discord (ou e-mail confirmado) na conta desse e-mail; convidado não tem e-mail.
- **Configurar (pelo celular):** Supabase → Edge Functions → *Secrets* (ou Project Settings → Edge Functions) → adicionar `ADMIN_EMAILS` = o e-mail da sua conta do jogo (o mesmo do login com Google/Discord). O id da conta aparece no rodapé do painel; se quiser ainda mais segurança, ponha-o também em `ADMIN_USER_IDS`.
- **SQL:** rode `docs/supabase-online-6.sql` (também no fim de `docs/supabase-tudo.sql`): cria a tabela `presence`. Sem ela o painel funciona, mas "online" fica em 0.
- **Online agora:** o app manda um aviso leve ("estou aqui") a cada ~90 s enquanto está aberto e visível e o jogador tem conta; conta como online quem foi visto nos últimos 3 minutos.
- O painel não tem ferramentas de alteração (só leitura). Teste da tela com números inventados: `?debug&gmdemo`.

### Painel GM: lista de jogadores (rodada 26)
O painel agora tem a seção **Jogadores** (Online / Todos, com busca por nome): para cada conta mostra se está online (ping dos últimos 3 min, bolinha verde), o que faz agora (no menu, na fila, jogando, ranqueada, contra a IA) ou quando foi visto, nível, XP, coroas, cartas (cópias de todas as versões), pontos e vitórias/derrotas do ranking e quando a conta foi criada; embaixo, a soma de coroas, XP e cartas de todas as contas. Tudo é lido pelo servidor (`adminOverview` em `server/supabaseDb.ts`, montado por `buildAdminPlayers` em `server/types.ts`), nunca pelo aparelho; tabelas que ainda não existem só deixam suas colunas vazias. Não precisa de SQL novo (usa `profiles`, `presence`, `ranked_profiles`, `collection`, `matches` e `queue`), só do deploy da função.

### Painel GM: fluxo de jogadores (rodada 26)
Seção **Fluxo de jogadores**: jogadores diferentes vistos na última hora, em 24 h, 7 e 30 dias (pelo último ping de cada conta, tabela `presence`) e três gráficos de barras dos últimos 14 dias (horário de Brasília): jogadores diferentes por dia, contas novas por dia e partidas por dia. A lista de jogadores ganhou o filtro **24 h**. O gráfico de jogadores por dia precisa do **SQL parte 7** (`docs/supabase-online-7.sql`, tabela `presence_days`, uma linha por jogador por dia, gravada a cada ping); sem ele o gráfico aparece apagado, avisando, e o resto funciona. O histórico só começa a contar depois que o SQL é rodado.

### Denúncias, banimentos e exclusão de conta (rodada 26)
Rode o **SQL parte 8** (`docs/supabase-online-8.sql`; também dentro de `docs/supabase-tudo.sql`): cria o filtro de nomes no banco, as tabelas `bans` e `reports`. Depois o GitHub republica a função (`deploy-game-server.yml`). Sem o SQL 8 o jogo continua funcionando (ninguém é banido, denúncia não grava) e o filtro roda só no aparelho. No painel GM: seção **Denúncias**, **Banidos** e botão Banir nas listas. Detalhes e limites em `docs/anti-trapaca.md` ("Antes de divulgar o jogo") e `docs/lancamento.md`.

## Desafio por link (rodada 26)
Online → **Desafiar amigo**: o anfitrião escolhe o deck e o jogo cria uma sala privada com um código de 6 letras e números fáceis de ler (sem 0, O, 1, I, L). A tela mostra o código, **Compartilhar link** (a folha de compartilhar do celular; no computador copia) e **Copiar link**; o link é o endereço do jogo com `?sala=CODIGO`. O amigo abre o link, entra (convidado, Google, Discord ou e-mail), vê "Fulano te chamou para uma partida privada", escolhe um deck e a partida começa (moeda do cara ou coroa como sempre). Sem pontos de ranking.
- Regras do servidor (`server/handler.ts`): `friendCreate` (confere o deck com a coleção, uma sala por anfitrião, vale 15 minutos), `friendStatus` (o anfitrião espera por ele: devolve a partida quando o amigo entra), `friendPeek` (mostra quem convidou), `friendJoin` (confere o deck do amigo, só um amigo entra, não entra no próprio convite nem em convite de banido ou de quem já está em outra partida), `friendCancel`. Limites por conta: criar 10/min, entrar 15/min (impede adivinhar códigos).
- O código fica guardado durante o login (`sessionStorage`, chave `pow.sala`), então sobrevive ao redirecionamento do Google/Discord; o convite aparece quando o menu está aberto. Se o convite expirou ou já foi usado, o jogo avisa.
- **Precisa do SQL parte 9** (`docs/supabase-online-9.sql`, tabela `rooms`; também em `docs/supabase-tudo.sql`) e do deploy da função. Testado de ponta a ponta com o servidor de mentira local (`tests/mock-supabase.ts`) e dois navegadores.

## Reportar problema (rodada 26)
Opções (no menu e na partida) → **Reportar problema**: o jogador escolhe o tipo (bug, algo confuso, ideia, outro) e escreve o que aconteceu (5 a 500 letras). O jogo anexa sozinho um **resumo técnico** (versão do jogo, tela, rodada/fase/ouro/mão da partida, tamanho da janela, navegador e os últimos erros do navegador: `src/diag.ts`) e, numa partida online, o número da partida (o servidor só guarda se a partida for mesmo do jogador). Sem senha nem e-mail. Limite: 6 avisos por hora por conta. No painel GM, seção **Problemas reportados**, com botão **Resolvido** e o resumo técnico escondido num "resumo técnico" que abre ao tocar. **Precisa do SQL parte 10** (`docs/supabase-online-10.sql`, tabela `feedback`; também em `docs/supabase-tudo.sql`) e do deploy da função. Só aparece com conta online (convidado também conta). Testado de ponta a ponta com o servidor de mentira local.
