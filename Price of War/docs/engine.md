# The rules engine (`src/engine`)

One piece of code decides every rule of a match. The local game (you vs the AI) runs it in the browser; online
play will run the very same code on a server, so both players are always judged by identical rules.

```
catalog.ts  every card (stats + rules text, by NAME, no artwork) and the two prebuilt decks
types.ts    GameState, Action, GameEvent  (all plain JSON)
rules.ts    constants (gold, hand size…) and "what is true about this board" helpers
game.ts     createMatch(...) and applyAction(state, seat, action)
ai.ts       aiNextAction(state, seat): the opponent, speaking the same Actions as a human
view.ts     redactFor / redactEvents: what a seat is allowed to see
rng.ts      seeded random numbers (the state keeps the generator, so a match can be replayed)
```

## How a match runs

```ts
const { state, events } = createMatch({ seed, decks: [deckA, deckB], first: 0 });   // hands dealt, Generals placed
let r = applyAction(state, 0, { type: 'begin' });                                    // first turn starts (draw)
if (r.ok === false) show(r.error);                                                   // refused: nothing changed
else { state = r.state; animate(r.events); }                                         // accepted: new state + what happened
```

`applyAction` never modifies the state it receives. A refused action returns the sentence to show the player
("Ouro insuficiente!", "Alvo fora de alcance…").

### Actions

| action | meaning |
| --- | --- |
| `begin` | start the first turn |
| `play {cardId, slot?, target?}` | play a hand card: `slot` for creatures/Relíquia/Terreno, `target` for targeted Táticas |
| `attack {from, to}` | Combate phase; may open an ambush prompt for the defender |
| `move {from, to}` | Movimentação (or Batedor's free move) |
| `ability {slot, target?, target2?}` | once-per-turn abilities (Cardeal Pedro, Mercador, Hospitalário) |
| `ambush {cardId \| null}` | the defender answers an ambush prompt |
| `choose {cardIds}` | answers a search/reveal prompt |
| `discard {cardIds}` | answers the end-of-turn discard prompt (see below) |
| `advance` | end the phase (from the last phase: end the turn) |
| `concede` | give up |

`state.pending` says when the match is waiting for an `ambush` or a `choose` — nothing else is accepted until it is answered.

### Events

Everything that happened comes back as events (`turn_start`, `gold`, `draw`, `attack`, `damage`, `destroyed`,
`move`, `log`, `winner`…) — the client turns them into animation, sound and toasts; the server will send them to both players.

## Rules decided in the engine

- Turn phases: **Compra → Suprimentos → Preparação → Combate → Pós-combate → Movimentação**, then the end-of-turn discard check. Compra (draw 1, Intendente) and Suprimentos (+5 gold from round 2, stacking) run by themselves inside `startTurn`; the seat only rests in the last four (`activePhases`). `phasesForTurn(combatOpen)` lists all six for the UI. A card effect can skip them: set `players[seat].skip = { compra?, suprimentos? }` before that seat's next turn start (emits a `skip` event instead of drawing / paying).
- Combate and Pós-combate only exist once combat is open; the first player's first turn goes Preparação → Movimentação.
- Which phase an active ability works in is `abilityPhases(cardName)` in `rules.ts` (default Preparação; the General's heal and Cavaleiro Hospitalário also in Pós-combate).
- 15 gold and 7 cards each; one card drawn at the start of every turn, always (there is no cap on starting a turn with cards).
- The hand limit (10) is only checked at the END of a turn: with more, the player must choose which cards to discard, down to 10 (`state.pending.kind === 'discard'`), the cards go to the graveyard, and only then does the turn pass.
- Combat opens from the 2nd turn of the match: the first player cannot attack in their first turn.
- Cards are played in Preparação. In Pós-combate only Táticas, Relíquias and Terrenos (never units from the hand — Chamado às Armas still summons). Avanço Coordenado is also playable in Movimentação (after moving).
- Relíquia goes only in slot 10, Terreno only in slot 11.
- Bonus HP in combat (Comandante da Ordem's aura, Aurelion's +1/+1) lasts only for that combat.
- Contra-Manobra: the adjacent ally steps into the targeted slot and takes the hit.
- Batedor's free move ends when the Combate phase does.

## The AI (`ai.ts`)

It plays every kind of card: creatures (placed where the formation scores best), Relíquia/Terreno in their slots,
removal (Balestra, Trabuco, Catapulta), equipment, buffs, searches, Reformar Linhas / Reposicionamento Rápido /
Avanço Coordenado. It attacks by scoring each possible attack (kills and General hits up, pointless suicide down),
repositions in Movimentação (back-row Infantaria forward, archers behind, the General's lane covered, fragile units
behind tough ones), takes Batedor's free move, answers ambush prompts and discards its least valuable cards.

## Match record

`newMatchLog` / `replayMatch` (game.ts): a match is fully described by how it was created plus the list of applied actions.
The client keeps this record for **every** match — against the AI exactly like against a person — so a server can re-run
it, reject anything illegal, and only then hand out rewards. The AI is a bot seat that submits the same actions as a human
(`aiNextAction`), so it flows through the same pipeline.

## Tests

`npm test` runs `tests/engine-rules.ts` (one scenario per rule), and `tests/engine-sim.ts` (AI vs AI full matches
with invariants checked after every action, deterministic replay, random fuzzing, and the hidden-information check).

## Online

See `docs/online-setup.md`. The server (`server/`) holds the full `GameState` and runs this same engine. For every
step it stores what each player may see (`viewFor` / `eventsFor` in `view.ts`: the opponent's hand and every deck
order removed, seats mirrored so "me" is always seat 0). A device only keeps its own view: `dispatchAction`
(App.tsx) applies my action to the view at once when that is safe, sends it, and the server's step confirms it;
the opponent's steps arrive ready-made and are played out with the usual animations.

`rewards.ts` holds the payout rules (XP / Coroas per result, the minimum length for a match to pay, the level curve)
and `deck.ts` the deck rules the server checks when a player enters the queue.
