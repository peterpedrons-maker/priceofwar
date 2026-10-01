# Online matches: setup and how to test

Online play has three parts: **two tables + one function in the database** (the SQL), **the `game` Edge Function**
(the server that matches players and checks every move with the game's own rules engine), and the app itself.
Until the function is deployed the app still works: Desafios falls back to a local match, and Online → Casual says the
server is unavailable.

## 1. Create the tables (once)

Supabase → **SQL Editor** → New query → paste all of `docs/supabase-online.sql` → Run.
(Run `docs/supabase-schema.sql` first if you have not — it is already done in this project.)

## 2. Deploy the game server

The server is one file: `supabase/functions/game/index.ts` (generated from `server/` and `src/engine/`; rebuild it
with `npm run build:edge` after changing rules — it is committed, so you normally do not need to).

**Option A — dashboard (no tools):** Supabase → **Edge Functions** → *Deploy a new function* → *Via Editor* →
name it exactly `game` → replace the sample code with the whole contents of `supabase/functions/game/index.ts` → Deploy.
In the function's settings, turn **off** "Verify JWT" (the function checks the player's login itself).

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
- Both devices run the same engine on the same seed and apply the same actions in the same order; your own actions are
  shown at once and sent to the server, the opponent's arrive within about a second and are played out with the usual
  animations. If the server ever disagrees with a device, the device rebuilds the match from the server's record.
- Every action is saved in `match_steps`, so any match can be replayed and verified before rewards are given.

**Known limits of this test version**
- Both devices simulate the whole match, so a modified client could look at the opponent's hand. Hiding it (the server
  sending each player only what they may see) is the next step; the engine already has `redactFor`/`redactEvents`.
- No turn timer yet: a player who just closes the app leaves the other waiting until they give up. Matches older than
  45 minutes are closed automatically.
- Rewards (Coroas, XP) are not given yet; the record needed for them is already stored.

## Trying it without Supabase

`tests/mock-supabase.ts` is a local stand-in that runs the real game server code in memory:
```
MOCK_BOT_MS=4000 npx tsx tests/mock-supabase.ts
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=test.anon.key npm run build
```
