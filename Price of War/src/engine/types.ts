// Shared types of the rules engine. Everything here is plain, JSON-serializable data: a whole match
// can be saved, sent over a network, or replayed from a seed + the list of actions.

export type CardType =
  | 'Infantaria' | 'Cavalaria' | 'Arqueiro' | 'Artilharia' | 'General'
  | 'Relíquia' | 'Terreno' | 'Tática' | 'Emboscada';

// A seat is a chair at the table, not "the human" or "the NPC": online play seats two humans, the
// local game seats a human and the AI, and the rules never care which is which.
export type Seat = 0 | 1;
export const otherSeat = (s: Seat): Seat => (s === 0 ? 1 : 0);

// Turn flow: Compra and Suprimentos run by themselves at the start of the turn (cards can skip them);
// the seat only ever rests in Preparação, Combate and Movimentação (cartas descem na Preparação; na Movimentação só Táticas e habilidades).
export type TurnPhase = 'compra' | 'suprimentos' | 'preparacao' | 'combate' | 'movimentacao';

// Gatilhos (o "quando" do efeito de uma carta) — vocabulário em docs/vocabulario.md. Só rótulo na carta por
// enquanto: a regra de cada gatilho continua nas habilidades da própria carta.
export type Trigger = 'convocacao' | 'ofensiva' | 'queda' | 'manobra' | 'comando' | 'postura' | 'reforco';
export const TRIGGER_LABEL: Record<Trigger, string> = {
  convocacao: 'Convocação', ofensiva: 'Ofensiva', queda: 'Queda', manobra: 'Manobra',
  comando: 'Comando', postura: 'Postura', reforco: 'Reforço',
};

// ── Efeitos: o "quê" de uma carta, descrito por TIPO ────────────────────────────────────────────────────────────
// Uma carta não tem código próprio: o catálogo lista, em dados, as habilidades dela (`abilities`: quando acontece +
// o que acontece) e o que ela faz sozinha enquanto está em campo (`passives`). O motor só sabe executar cada TIPO de
// efeito ("verbo") — criar uma carta nova é combinar tipos que já existem. Vocabulário completo: docs/efeitos.md.

// Quem pode ser escolhido como alvo de um efeito.
export interface TargetSpec {
  side: 'own' | 'enemy';
  // 'unit': uma unidade (slot 0-9). 'row': qualquer slot da fileira — o efeito vale para a fileira inteira.
  area: 'unit' | 'row';
  where?: 'front' | 'back';          // só unidades dessa fileira
  types?: CardType[];                // só unidades desses tipos
  needs?: 'moved' | 'damaged';       // só unidades que se moveram neste turno / que estão feridas
  // Alvo "se houver": só é exigido quando alguma unidade serve (a habilidade precisa de ao menos um alvo válido).
  optional?: boolean;
  prompt?: string;                   // frase mostrada ao jogador na hora de escolher
}

export interface CardFilter { types?: CardType[]; atk?: number }

// Os tipos de efeito que o motor sabe executar. Os que têm `target` pedem uma escolha no tabuleiro (na ordem em que
// aparecem na lista: o primeiro usa `target`, o segundo `target2` da ação).
export type Verb =
  // Recursos
  | { kind: 'gold'; amount: number }
  | { kind: 'draw'; amount: number }
  | { kind: 'refill_hand'; to: number }
  | { kind: 'extra_moves'; amount: number }
  // Dano e cura (`all: 'enemy'` = todas as unidades inimigas e o General, sem escolher)
  | { kind: 'damage'; amount: number; target?: TargetSpec; all?: 'enemy' }
  | { kind: 'heal'; amount: number; target: TargetSpec; withAuras?: boolean }
  // Atributos e proteção
  | { kind: 'buff'; atk?: number; hp?: number; target?: TargetSpec }       // sem `target`: a própria carta, para sempre
  | { kind: 'equip'; atk?: number; hp?: number; target: TargetSpec }       // fica presa à unidade até ela cair
  | { kind: 'guard_adjacent'; amount: number; target: TargetSpec }         // aliados ao lado do alvo sofrem menos dano
  | { kind: 'buff_adjacent'; atk: number }                                 // aliados ao lado: +ATK até o próximo turno do dono
  | { kind: 'buff_moved'; count: number; atk: number; hp: number }        // unidades que se moveram: bônus no próximo combate
  | { kind: 'reinforce'; shield: number }                                  // desce e ganha Escudo quando a carta da frente cai
  // Posição
  | { kind: 'retreat'; heal: number; target: TargetSpec }                  // alvo na Vanguarda vai para a Retaguarda e cura
  | { kind: 'displace'; target: TargetSpec }                               // alvo inimigo vai para um slot livre ao lado
  | { kind: 'swap_adjacent' }                                              // troca de lugar com um aliado ao lado
  | { kind: 'free_move' }                                                  // um reposicionamento grátis
  // Cartas
  | { kind: 'look_top'; count: number; keepMin: number; keepMax: number }  // vê o topo do baralho, fica com algumas
  | { kind: 'search'; zone: 'deck' | 'graveyard'; filter: CardFilter }     // escolhe uma carta e leva para a mão
  | { kind: 'summon_deck'; max: number; filter: CardFilter }               // convoca soldados do baralho na Vanguarda
  | { kind: 'summon_token'; token: string }                                // convoca fichas nos slots livres ao lado
  // Combate
  | { kind: 'attack_bonus'; amount: number; ifEnemyGeneral?: 'other_faction' }
  | { kind: 'splash_behind'; amount: number }                              // atingiu a Vanguarda: dano na carta de trás
  // Emboscada (resolvem o ataque que a ativou)
  | { kind: 'cancel_attack'; ifAdjacentAlly?: boolean }
  | { kind: 'swap_defender' }
  | { kind: 'displace_attacker' }
  | { kind: 'buff_defender'; atk: number; hp: number };

// QUANDO o efeito acontece.
export type AbilityOn =
  | 'play'          // Tática jogada da mão
  | 'ability'       // habilidade ativa, tocada por quem joga (Comando)
  | 'place'         // a carta entrou em campo (Convocação)
  | 'attack'        // a carta atacou (Ofensiva)
  | 'after_attack'  // logo depois de atacar e sobreviver
  | 'destroyed'     // a carta caiu (Queda)
  | 'move'          // a carta se reposicionou (Manobra)
  | 'healed'        // a carta foi curada
  | 'turn_start' | 'turn_end'
  | 'front_fell'    // a carta da frente da coluna caiu (Reforço)
  | 'ambush';       // Emboscada ativada

export interface Ability {
  on: AbilityOn;
  // 'ability': fases em que dá para usar (padrão: Preparação). Uma Tática pode ser jogada na Preparação e na Movimentação.
  phases?: TurnPhase[];
  once?: boolean;     // 'ability': uma vez por turno
  cost?: number;      // 'ability': ouro pago ao usar
  do: Verb[];
}

// Quem recebe o bônus de uma aura.
export interface Who {
  side: 'self' | 'own' | 'enemy';
  row?: 'front' | 'back';
  types?: CardType[];
  slots?: number[];       // slots específicos (Relíquia 10, Terreno 11, General 12)
  facing?: boolean;       // 'enemy': só a carta no mesmo slot, de frente para esta
  behind?: boolean;       // 'own': só a carta logo atrás desta (mesma coluna, na Retaguarda)
}

// O que a carta faz sozinha enquanto está em campo (sem ninguém tocar).
export type Passive =
  | {
      kind: 'aura'; who: Who;
      from?: 'front' | 'back';          // só vale se esta carta estiver nessa fileira
      when?: { col: number };           // só vale se o alvo estiver nessa coluna
      atk?: number; combatHp?: number; reduce?: number; healBonus?: number; attacks?: number;
    }
  | { kind: 'flag'; flag: 'row_swap' | 'blocks_ambush' | 'locks_general'; from?: 'front' };

// What the catalog stores for a card name (no artwork, no per-copy data).
export interface CardDef {
  name: string;
  cardType: CardType;
  atk: number;
  hp: number;
  cost: number;
  effect: string;
  isFullArt?: boolean;
  // Gatilho do efeito (ícone na linha do tipo + nome em dourado no começo do texto). Opcional: sem ele a carta fica como era.
  trigger?: Trigger;
  // O que a carta faz, por tipo de efeito (veja acima). Uma carta sem nenhum dos dois é só estatística.
  abilities?: Ability[];
  passives?: Passive[];
  // Só nos Generais: a "tendência" (Fanático da Cruzada compara com a do General inimigo).
  faction?: string;
}

// One physical copy of a card inside a match. Field names intentionally match the client's CardData
// (minus `art`) so the UI can render an engine card by attaching the artwork found via `name`.
export interface Card {
  id: string;
  name: string;
  cardType: CardType;
  atk: number;
  hp: number;
  cost: number;
  effect: string;
  isFullArt?: boolean;
  // Copied from the card's definition: today only Reforço matters to the rules (see canReinforce).
  trigger?: Trigger;
  // A one-time "+X ATK / +X HP in its next combat" bonus (Comandante Aurelion's active).
  pendingCombatBonus?: { atk: number; hp: number };
  // A permanent stack of "-1 damage taken" stamps (Linha Fechada).
  dmgReduction?: number;
  // A temporary ATK stack from Capitão de Formação's "Ao mover" — cleared at every turn start.
  formationBuffAtk?: number;
  // Escudo N: absorbs the next N damage before the unit's HP is touched (any damage, any source); it stays until used up.
  shield?: number;
  // Bloqueio: negates the next instance of damage completely, whatever its size, and is used up doing so.
  block?: boolean;
  // Armamentos stay attached until the unit dies, then go to the graveyard with it.
  equippedWeapons?: Card[];
  // Only on what a seat is not allowed to see (see redactFor): a face-down placeholder.
  hidden?: boolean;
}

// Slot layout per side (13 slots):
//   0-4 Vanguarda · 5-9 Retaguarda · 10 Relíquia · 11 Terreno · 12 General
export const SLOT_COUNT = 13;
export const GENERAL_SLOT = 12;
export const RELIC_SLOT = 10;
export const TERRAIN_SLOT = 11;

export interface PlayerState {
  gold: number;
  hand: Card[];
  board: (Card | null)[];
  graveyard: Card[];
  // The deck is a list of card names (copies included) and it is finite: `drawPile` is the shuffled queue being
  // drawn from, `deckList` is the same cards without the draw order (what searches look through). A card that left
  // the deck (drawn, searched, summoned) never comes back; when the deck runs out nothing is drawn.
  deckList: string[];
  drawPile: string[];
  general: string;
  // General ability (Cardeal Pedro): uses this turn, blocked this turn, blocked next turn.
  generalAbilityUses: number;
  generalAbilityBlocked: boolean;
  pendingGeneralBlock: boolean;
  // Set by card effects: skips the automatic Compra / Suprimentos of this seat's next turn start.
  skip?: { compra?: boolean; suprimentos?: boolean };
}

export interface TurnState {
  // false until the `begin` action ran (the opening hands are dealt, nobody has started a turn yet).
  started: boolean;
  active: Seat;
  // Counts rounds: it goes up when the SECOND player of the round finishes their turn.
  round: number;
  phase: TurnPhase;
  first: Seat;
  // Slots (of the active seat) touched by a reposition this turn.
  moved: number[];
  bonusRepositions: number;
  // Batedor: the slot that may move once for free right after its attack.
  batedorFree: number | null;
  attackCounts: Record<number, number>;
  // Card ids that already used their once-per-turn ability this turn.
  activated: string[];
}

export type PickMode = 'graveyard_soldier' | 'deck_search' | 'top_reveal' | 'summon';

// What the match is waiting for before anything else can happen.
export type Pending =
  | {
      kind: 'pick';
      seat: Seat;
      mode: PickMode;
      title: string;
      options: Card[];
      min: number;
      max: number;
      // The tactic being resolved (it goes to the graveyard once resolved), or null for a board ability.
      source: Card | null;
      // Cards revealed from the top of the deck and not chosen go back to the bottom.
      revealed?: boolean;
      // Chamado às Armas: where the summoned soldiers land.
      slots?: number[];
    }
  | {
      // End of turn with more than HAND_LIMIT cards: the seat must discard down to the limit.
      kind: 'discard';
      seat: Seat;
      count: number;
    }
  | {
      kind: 'ambush';
      // The DEFENDER decides whether to spring an Emboscada.
      seat: Seat;
      attacker: Seat;
      from: number;
      to: number;
      options: string[];
    };

export interface GameState {
  v: 1;
  rng: number;
  uid: number;
  players: [PlayerState, PlayerState];
  turn: TurnState;
  pending: Pending | null;
  winner: Seat | null;
}

// ── Actions: everything a player can ask the engine to do ───────────────────
export type Action =
  // Starts the very first turn (draw for the first seat). Sent once after the opening hands.
  | { type: 'begin' }
  // Before `begin`: whoever won the coin toss (the seat that is `turn.active` at creation) decides to play first or second.
  | { type: 'choose_first'; goFirst: boolean }
  // Plays a hand card. `slot` is the destination for creatures/Relíquia/Terreno; `target` is the board
  // slot a targeted Tática aims at (own board or enemy board depending on the card).
  | { type: 'play'; cardId: string; slot?: number; target?: number }
  | { type: 'attack'; from: number; to: number }
  | { type: 'move'; from: number; to: number }
  // Activates a once-per-turn ability of the unit/General standing in `slot`. Targets depend on the card.
  | { type: 'ability'; slot: number; target?: number; target2?: number }
  // The defender answers an ambush prompt: the Emboscada card id, or null to let the attack through.
  | { type: 'ambush'; cardId: string | null }
  // Resolves a pick prompt (search/reveal): the chosen card ids.
  | { type: 'choose'; cardIds: string[] }
  // Answers the end-of-turn discard prompt: exactly the number of cards asked for, they go to the graveyard.
  | { type: 'discard'; cardIds: string[] }
  // Ends the current phase (and the turn, from the last phase).
  | { type: 'advance' }
  | { type: 'concede' };

// ── Events: what happened, for animation/sound/log ──────────────────────────
export type GameEvent =
  | { t: 'turn_start'; seat: Seat; round: number }
  | { t: 'phase'; seat: Seat; phase: TurnPhase }
  // An automatic phase (Compra / Suprimentos) was skipped by a card effect.
  | { t: 'skip'; seat: Seat; phase: TurnPhase }
  | { t: 'gold'; seat: Seat; delta: number; reason: 'turn' | 'spend' | 'gain' }
  | { t: 'draw'; seat: Seat; card: Card; reason: 'turn' | 'effect' | 'deal' }
  | { t: 'play'; seat: Seat; card: Card; slot?: number }
  | { t: 'place'; seat: Seat; slot: number; card: Card }
  | { t: 'summon'; seat: Seat; slot: number; card: Card }
  | { t: 'attack'; seat: Seat; from: number; to: number }
  | { t: 'ambush'; seat: Seat; card: Card }
  | { t: 'cancelled'; seat: Seat; from: number; to: number }
  | { t: 'damage'; seat: Seat; slot: number; amount: number }
  | { t: 'heal'; seat: Seat; slot: number; amount: number }
  | { t: 'buff'; seat: Seat; slot: number; atk: number; hp: number }
  | { t: 'destroyed'; seat: Seat; slot: number; card: Card }
  | { t: 'move'; seat: Seat; from: number; to: number; swapped: boolean }
  // Reforço: the card behind a fallen Vanguarda card stepped forward into its place.
  | { t: 'reinforce'; seat: Seat; from: number; to: number; card: Card }
  // Escudo / Bloqueio gained (`shield` = how much Escudo was added; `block` = a Bloqueio was added).
  | { t: 'shield'; seat: Seat; slot: number; shield: number; block: boolean }
  // Damage met an Escudo or a Bloqueio: how much it soaked, what is left of the Escudo, and whether each one is gone now.
  | { t: 'shield_hit'; seat: Seat; slot: number; absorbed: number; left: number; broken: boolean; blocked: boolean }
  | { t: 'equip'; seat: Seat; slot: number; card: Card; atk: number; hp: number }
  | { t: 'graveyard'; seat: Seat; card: Card }
  | { t: 'ability'; seat: Seat; slot: number; name: string }
  | { t: 'pick'; seat: Seat; title: string }
  | { t: 'winner'; seat: Seat }
  // Plain-language line for the UI toast/log (pt-BR).
  // `private`: only the acting seat gets to read it (it names a card taken from the deck/hand).
  | { t: 'log'; seat: Seat; text: string; private?: boolean };

export type ActionResult =
  | { ok: true; state: GameState; events: GameEvent[] }
  | { ok: false; error: string };
