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

- Turn phases: **Compra → Suprimentos → Preparação → Combate → Movimentação**, then the end-of-turn discard check. Compra (draw 1, Intendente) and Suprimentos (+5 gold from round 2, stacking) run by themselves inside `startTurn`; the seat only rests in the last three (`activePhases`). `phasesForTurn(combatOpen)` lists all five for the UI. A card effect can skip them: set `players[seat].skip = { compra?, suprimentos? }` before that seat's next turn start (emits a `skip` event instead of drawing / paying).
- Combate only exists once combat is open; the first player's first turn goes Preparação → Movimentação.
- Which phase an active ability works in is `abilityPhases(cardName)` in `rules.ts` (default Preparação; the General's heal and Cavaleiro Hospitalário also in Movimentação).
- 15 gold and 7 cards each; one card drawn at the start of every turn, always (there is no cap on starting a turn with cards).
- The hand limit (10) is only checked at the END of a turn: with more, the player must choose which cards to discard, down to 10 (`state.pending.kind === 'discard'`), the cards go to the graveyard, and only then does the turn pass.
- Combat opens from the 2nd turn of the match: the first player cannot attack in their first turn.
- Cards are played in Preparação. In Movimentação only Táticas can come out of the hand (`canPlayInPhase` in `rules.ts`; never units, Relíquias or Terrenos — Chamado às Armas still summons), plus moving troops and the abilities above. Avanço Coordenado is meant for Movimentação (after moving).
- **Escudo e Bloqueio** (`Card.shield`, `Card.block`): damage — from combat or from any effect — meets a card's Bloqueio first (the whole instance is negated, however big, and the Bloqueio is spent), then its Escudo (it absorbs up to N points and is worn down by them; anything over N goes on to HP). The order, everywhere damage is dealt (`attack` and `damageSlot`, via `soak()`): reduction (Fortaleza / Linha Fechada) → Bloqueio → Escudo → bonus-HP buffer → HP. The attacker's retaliation is not affected by the defender's Escudo/Bloqueio. Events: `shield` (gained) and `shield_hit` (absorbed / left / broken / blocked). `grantShield` / `grantBlock` are the hooks for future cards, boosters and General abilities; no card grants them yet except Reforço.
- **Reforço:** when a Vanguarda card is destroyed (combat, Táticas, abilities — everything goes through `sendDestroyed`), the Infantaria standing right behind it in the Retaguarda steps forward for free and arrives with an Escudo of `REINFORCE_SHIELD` points (2), and a `reinforce` event is emitted (after the `destroyed` one, followed by the `shield` one). `canReinforce` in `rules.ts` is the single place that decides who may do it: today every Infantaria; later it can become a card keyword ("Infantaria Reforço") and cards can add their own effect on `reinforce`.
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

## Baralho finito
O baralho é exatamente o que o jogador montou: `drawPile` (ordem de compra) e `deckList` (o que ainda resta, sem a ordem) começam iguais e só **diminuem**. Comprar, buscar (Graal, Doutrina, Recrutamento), revelar (Mercador, Recrutar Veteranos) e convocar (Chamado às Armas) tiram a carta do baralho; ela nunca volta, só vai para mão, campo e cemitério. As cartas reveladas e não escolhidas voltam para o **fundo**. Baralho vazio = não compra nada ("O baralho acabou"). Há um contador de cartas no monte de cada lado do campo. Teste: `engine-rules` ("the deck is finite") e o invariante em `engine-sim`.

## Efeitos por tipo
O que cada carta faz está no catálogo, descrito por tipos de efeito (sem código por nome de carta). Vocabulário, `on`, alvos, passivas e como criar uma carta: [`docs/efeitos.md`](efeitos.md).

## Opções do jogador
`src/gameSettings.ts` (`pow.settings` no localStorage, `useGameSettings`): avisos opcionais, todos ligados por padrão — `hintsDrag` (dedo sobre a mão, "segure e arraste", "solte aqui") e `hintsBoard` (palavras Ataca/Reserva/Protegida e etiquetas dos alvos de Tática). O modal `OptionsModal` (App.tsx) reúne esses avisos e o áudio; abre pelo botão "Opções" do menu e pelo botão no canto superior esquerdo durante a partida. O tutorial (`tutOn`) não é afetado.

## Quem começa
`createMatch({ first })` recebe o vencedor da moeda. Localmente (contra a IA) o cliente já cria a partida com a escolha feita. Online, a partida nasce com `first` = vencedor e ele manda `{ type: 'choose_first', goFirst }` antes do `begin`: só vale antes do início e só para quem é `turn.active` (o vencedor); ajusta `turn.first` e `turn.active`. `begin` começa o turno de `turn.first`.
