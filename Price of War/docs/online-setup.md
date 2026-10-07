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
- **Alone:** Online → Casual and wait about 15 s: an AI opponent takes the other chair. It is the same server, the
  same rules and the same match record as a match between people.
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
MOCK_BOT_MS=4000 npx tsx tests/mock-supabase.ts
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=test.anon.key npm run build
```
(`MOCK_TURN_MS` / `MOCK_PROMPT_MS` shorten the turn clock for tests.)

## Quem começa (cara ou coroa)
O servidor sorteia o vencedor da moeda ao criar a partida (`matches.first` guarda a cadeira do vencedor, e não muda). A partida fica **sem nenhum passo** até o vencedor escolher: ele manda a ação `choose_first` (`goFirst: true` = começar, `false` = ir depois) e o servidor grava dois passos, `choose_first` e `begin` (feito por quem vai começar). Contra o bot: se o bot vence a moeda, ele escolhe ao acaso e a partida já abre; se o jogador vence, ele escolhe como qualquer um. A escolha tem o relógio de resposta (`promptMs`): se esgotar, a partida abre com o vencedor começando, e conta como um tempo esgotado. Nenhuma coluna nova no banco: o estado "esperando escolha" é `steps_count = 0`.
