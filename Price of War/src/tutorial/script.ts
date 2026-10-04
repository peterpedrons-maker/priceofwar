// Tutorials: the list shown in the menu, and the script of "Seu primeiro duelo" (see docs/tutorial-1-roteiro.md).
// Everything here is plain data plus two small pure helpers, so the duel can be tested headless
// (tests/tutorial-script.ts): fixed hands and draws, the trainer's fixed moves, and a path that always ends in a win on turn 4.
import { applyAction, createMatch, deckSetupFromRecipe } from '../engine/game';
import { requireCardDef } from '../engine/catalog';
import type { Action, Card, GameState, TurnPhase } from '../engine/types';

export type TutorialMeta = { id: string; title: string; blurb: string; available: boolean };
export const TUTORIALS: TutorialMeta[] = [
  { id: 'primeiro-duelo', title: 'Seu primeiro duelo', blurb: 'O básico, passo a passo: moeda, ouro, cartas, fases do turno, combate e como vencer.', available: true },
  { id: 'habilidades', title: 'Habilidades das cartas', blurb: 'Buscar no cemitério, no baralho, para a mão ou para o campo.', available: false },
  { id: 'taticas', title: 'Táticas e Emboscadas', blurb: 'Cartas que mudam a batalha em um instante.', available: false },
];

// The instructor's face. Art lives in src/assets/npc-instrutor-<expression>.webp; until it exists a silhouette stands in.
export type Expr = 'neutral' | 'point' | 'happy' | 'warn' | 'think' | 'cheer';
export const NPC_NAME = 'Aldric';

// What a step lights up (and, in a "do" step, lets the player touch).
export type Tgt =
  | { sel: string; pad?: number }                    // one element (a card on the board gets its exact silhouette)
  | { sels: string[]; pad?: number }                 // the rectangle around several elements
  | { hand: true }                                   // the whole fan of cards in hand
  | { handCard: string };                            // one card in hand, by name

// What the player has to do to finish a "do" step.
export type Until =
  | { t: 'tracker' }
  | { t: 'advance'; from: TurnPhase }
  | { t: 'select'; card: string }
  | { t: 'play'; card: string; slot: number }
  | { t: 'attack'; from: number; to: number }
  | { t: 'move'; from: number; to: number }
  | { t: 'slotTap'; slot: number };

export type Step = {
  id: string;
  kind: 'read' | 'do' | 'wait' | 'enemy';
  expr?: Expr;
  title?: string;
  lines?: string[];
  note?: string;
  targets?: Tgt[];
  allow?: Tgt[];                       // what is touchable in a "do" step (default: targets)
  point?: Tgt;                         // where the hand taps (default: first target)
  until?: Until;
  panel?: 'top' | 'bottom';            // default: the side away from what is lit
  tracker?: TurnPhase;                 // the turn panel shows this phase while the step is up
  enter?: string;                      // an App-side effect to run when the step starts ('begin', 'unselect', …)
  ms?: number;                         // wait
  quiet?: boolean;                     // no dimming (the step just talks)
  chapter?: number;                    // 1-based chapter, for the progress dots
};
export const CHAPTERS = 14;

// ── The fixed duel ───────────────────────────────────────────────────────────
const HAND_P = ['Devotos da Cruzada', 'Soldados da Ordem', 'Soldados da Ordem', 'Cavaleiro da Luz', 'Soldados da Ordem', 'Devotos da Cruzada', 'Soldados da Ordem'];
const PILE_P = ['Soldados da Ordem', 'Cavaleiro da Luz', 'Soldados da Ordem', 'Cavaleiro da Luz', 'Soldados da Ordem', 'Soldados da Ordem', 'Soldados da Ordem', 'Soldados da Ordem'];
const HAND_E = ['Soldados da Ordem', 'Devotos da Cruzada', 'Devotos da Cruzada', 'Soldados da Ordem', 'Devotos da Cruzada', 'Soldados da Ordem', 'Soldados da Ordem'];
const PILE_E = ['Soldados da Ordem', 'Devotos da Cruzada', 'Soldados da Ordem', 'Devotos da Cruzada', 'Soldados da Ordem', 'Soldados da Ordem', 'Soldados da Ordem', 'Soldados da Ordem'];

let uid = 0;
const fresh = (name: string): Card => {
  const d = requireCardDef(name);
  return { id: `tut${++uid}`, name: d.name, cardType: d.cardType, atk: d.atk, hp: d.hp, cost: d.cost, effect: d.effect, ...(d.trigger ? { trigger: d.trigger } : {}) };
};

// The match as it stands before the first turn: the Generals in place, the fixed hands dealt, the draw piles stacked.
export const createTutorialMatch = (): GameState => {
  uid = 0;
  const s = createMatch({ seed: 11, decks: [deckSetupFromRecipe('cardeal'), deckSetupFromRecipe('capitao')], first: 0 }).state;
  s.players[0].hand = HAND_P.map(fresh); s.players[0].drawPile = [...PILE_P];
  s.players[1].hand = HAND_E.map(fresh); s.players[1].drawPile = [...PILE_E];
  return s;
};

// The trainer's turns, move by move (turn number = the match round; the player always goes first).
export type EnemyMove = { play: string; slot: number } | { attack: [number, number] } | { advance: true };
const ADV: EnemyMove = { advance: true };
export const ENEMY_SCRIPT: Record<number, EnemyMove[]> = {
  1: [{ play: 'Soldados da Ordem', slot: 1 }, { play: 'Devotos da Cruzada', slot: 3 }, ADV, { attack: [1, 1] }, ADV, ADV, ADV],
  2: [{ play: 'Soldados da Ordem', slot: 0 }, { play: 'Soldados da Ordem', slot: 5 }, ADV, { attack: [0, 1] }, ADV, ADV, ADV],
  3: [{ play: 'Devotos da Cruzada', slot: 2 }, ADV, { attack: [0, 1] }, ADV, ADV, ADV],
};
// `done` = how many moves of this turn were already made.
export const nextEnemyAction = (s: GameState, done: number): Action | null => {
  const move = ENEMY_SCRIPT[s.turn.round]?.[done];
  if (!move) return { type: 'advance' } as Action;
  if ('advance' in move) return { type: 'advance' } as Action;
  if ('attack' in move) return { type: 'attack', from: move.attack[0], to: move.attack[1] } as Action;
  const card = s.players[1].hand.find(h => h.name === move.play);
  if (!card) return { type: 'advance' } as Action;
  return { type: 'play', cardId: card.id, slot: move.slot } as Action;
};

// The player's whole path, used by the headless test (the real thing is driven by the taps the steps ask for).
export type PlayerMove = { play: string; slot: number } | { attack: [number, number] } | { move: [number, number] } | { advance: true };
export const PLAYER_PATH: PlayerMove[][] = [
  [{ play: 'Devotos da Cruzada', slot: 1 }, { play: 'Soldados da Ordem', slot: 6 }, { play: 'Cavaleiro da Luz', slot: 3 }, ADV, ADV],
  [{ play: 'Cavaleiro da Luz', slot: 2 }, { play: 'Soldados da Ordem', slot: 7 }, ADV, { attack: [2, 1] }, { attack: [1, 12] }, { attack: [3, 3] }, ADV, ADV],
  [ADV, { attack: [1, 12] }, { attack: [2, 12] }, { attack: [3, 12] }, ADV, { move: [7, 6] }, ADV],
  [ADV, { attack: [2, 2] }, { attack: [3, 12] }, { attack: [1, 12] }],
];

// ── The steps ────────────────────────────────────────────────────────────────
const G = (n: number) => ({ sel: `#player-${n}` });
const E = (n: number) => ({ sel: `#npc-${n}` });
const row = (side: 'player' | 'npc', a: number, b: number): Tgt => ({ sels: Array.from({ length: b - a + 1 }, (_, i) => `#${side}-${a + i}`), pad: 6 });
const TRACKER: Tgt = { sel: '[data-tut="tracker"]', pad: 8 };
const GOLD_ME: Tgt = { sel: '#player-gold-badge', pad: 8 };
const GOLD_FOE: Tgt = { sel: '#npc-gold-badge', pad: 8 };

// Before the match: the instructor says hello (a full screen of its own).
export const INTRO_LINES: string[][] = [
  ['Salve, comandante! Eu sou Aldric.', 'Já treinei muita gente, e hoje é a sua vez.'],
  ['Neste duelo eu vou te mostrar tudo, passo a passo:', 'a moeda, o ouro, as cartas, as fases do turno, o combate e o Reforço.'],
  ['Pode ficar tranquilo: este duelo é só treino, e você vai vencer.', 'Quem aprende bem, luta bem!'],
  ['Se perder alguma explicação, toque em REPETIR. Para rever a anterior, toque em VOLTAR.', 'Pronto? Então vamos começar!'],
];

export const COIN_STEP: Step = { id: 'coin', kind: 'read', expr: 'happy', chapter: 1, title: 'A MOEDA', lines: ['Toda batalha começa com uma moeda.', 'Ela decide quem joga primeiro. Hoje ela cai a seu favor: você começa!', 'Um aviso: quem começa não pode atacar no 1º turno.'], quiet: true, panel: 'bottom' };

export const STEPS: Step[] = [
  // 2. the field
  { id: 'general-me', kind: 'read', expr: 'point', chapter: 2, title: 'SEU GENERAL', lines: ['Este é o seu General. Ele tem 20 pontos de vida.', 'Se a vida dele chegar a zero, você perde o duelo. Proteja-o!'], targets: [G(12)] },
  { id: 'general-foe', kind: 'read', expr: 'point', chapter: 2, title: 'O GENERAL INIMIGO', lines: ['Aquele é o General do adversário.', 'Derrube-o e a vitória é sua!'], targets: [E(12)] },
  { id: 'vanguarda', kind: 'read', expr: 'neutral', chapter: 2, title: 'A VANGUARDA', lines: ['Esta fileira é a Vanguarda, a linha de frente.', 'Quem fica aqui ataca, mas também é atacado.'], targets: [row('player', 0, 4)] },
  { id: 'retaguarda', kind: 'read', expr: 'neutral', chapter: 2, title: 'A RETAGUARDA', lines: ['Esta fileira é a Retaguarda, a linha de trás.', 'Quem fica aqui não ataca, mas está protegido e espera a sua vez.'], targets: [row('player', 5, 9)] },
  { id: 'especiais', kind: 'read', expr: 'think', chapter: 2, title: 'CASAS ESPECIAIS', lines: ['Ao lado do General ficam duas casas especiais: Relíquia e Terreno.', 'Elas ficam para outra aula. Por enquanto, pode ignorar.'], targets: [{ sels: ['#player-10', '#player-11'], pad: 6 }] },
  { id: 'pilhas', kind: 'read', expr: 'neutral', chapter: 2, title: 'BARALHO E CEMITÉRIO', lines: ['À direita está o seu baralho: de lá saem as cartas que você compra.', 'À esquerda está o cemitério: para onde vão as cartas destruídas.'], targets: [{ sel: '[data-tut="deck"]', pad: 6 }, { sel: '[data-tut="graveyard"]', pad: 6 }] },
  // 3. the hand
  { id: 'mao', kind: 'read', expr: 'point', chapter: 3, title: 'SUAS CARTAS', lines: ['Estas são as cartas da sua mão. Você começa com 7.', 'No fim do turno o máximo é 10. O que passar disso vai para o cemitério.'], targets: [{ hand: true }] },
  { id: 'toque-carta', kind: 'do', expr: 'point', chapter: 3, title: 'VAMOS LER UMA CARTA', lines: ['Toque na Devotos da Cruzada para ver os detalhes dela.'], targets: [{ handCard: 'Devotos da Cruzada' }], until: { t: 'select', card: 'Devotos da Cruzada' } },
  { id: 'anatomia', kind: 'read', expr: 'point', chapter: 3, title: 'COMO LER UMA CARTA', lines: ['A moeda no canto é o custo: quanto ouro você paga para jogá-la.', 'O número da esquerda é o ataque e o da direita é a vida.'], targets: [{ handCard: 'Devotos da Cruzada' }], enter: 'keep-selection', panel: 'top' },
  // 4. gold
  { id: 'ouro', kind: 'read', expr: 'point', chapter: 4, title: 'O OURO', lines: ['Este é o seu ouro. O do adversário fica do outro lado.', 'Você começa com 15 e ganha +5 a cada turno, a partir da 2ª rodada.', 'É com ouro que você paga para jogar cartas. O que sobra fica guardado.'], targets: [GOLD_ME, GOLD_FOE], enter: 'unselect', panel: 'top' },
  // 5. draw phase
  { id: 'compra', kind: 'do', expr: 'point', chapter: 5, title: 'FASE DE COMPRA', lines: ['Todo turno começa com a Compra: você puxa 1 carta do baralho.', 'Toque em COMPRA para pegar a sua 8ª carta.'], note: 'Só no treino você precisa tocar. Na partida de verdade isso é automático.', targets: [TRACKER, { hand: true }], allow: [TRACKER], point: TRACKER, until: { t: 'tracker' }, tracker: 'compra', panel: 'top' },
  { id: 'comprando', kind: 'wait', ms: 2400, tracker: 'compra', quiet: true, enter: 'begin' },
  // 6. supplies
  { id: 'suprimentos', kind: 'do', expr: 'think', chapter: 6, title: 'FASE DE SUPRIMENTOS', lines: ['Agora os Suprimentos: é aqui que você recebe ouro.', 'No 1º turno ninguém recebe. O +5 começa na 2ª rodada.'], note: 'Toque em SUPRIMENTOS para continuar.', targets: [TRACKER, GOLD_ME], allow: [TRACKER], point: TRACKER, until: { t: 'tracker' }, tracker: 'suprimentos', panel: 'top' },
  // 7-8. preparation
  { id: 'prep', kind: 'read', expr: 'neutral', chapter: 7, enter: 'announce-prep', title: 'FASE DE PREPARAÇÃO', lines: ['Esta é a fase principal do turno.', 'Aqui você coloca cartas no campo, pagando o custo em ouro.'], targets: [TRACKER], panel: 'top' },
  { id: 'devotos', kind: 'do', expr: 'point', chapter: 7, title: 'SUA PRIMEIRA CARTA', lines: ['Toque na Devotos da Cruzada e depois na casa brilhante da Vanguarda.', 'Ela é fraca: vai servir de isca para o inimigo.'], targets: [{ handCard: 'Devotos da Cruzada' }, G(1)], until: { t: 'play', card: 'Devotos da Cruzada', slot: 1 } },
  { id: 'reforco-aviso', kind: 'read', expr: 'warn', chapter: 8, title: 'ATENÇÃO: REFORÇO', lines: ['Agora vem um truque importante. Vou pôr a Soldados da Ordem ATRÁS da Devotos.', 'Se a Devotos cair, a Soldados desce de graça e ganha Escudo 2.'], targets: [G(1), G(6)], panel: 'bottom' },
  { id: 'soldados', kind: 'do', expr: 'point', chapter: 8, title: 'A RESERVA', lines: ['Toque na Soldados da Ordem e depois na casa de trás, bem atrás da Devotos.'], targets: [{ handCard: 'Soldados da Ordem' }, G(6)], until: { t: 'play', card: 'Soldados da Ordem', slot: 6 } },
  { id: 'cavaleiro', kind: 'do', expr: 'point', chapter: 8, title: 'UM CAVALEIRO FORTE', lines: ['Agora o Cavaleiro da Luz: ataque 4 e vida 5.', 'Coloque-o na Vanguarda, na casa indicada.'], targets: [{ handCard: 'Cavaleiro da Luz' }, G(3)], until: { t: 'play', card: 'Cavaleiro da Luz', slot: 3 } },
  { id: 'ouro-gasto', kind: 'read', expr: 'happy', chapter: 8, title: 'OURO GASTO', lines: ['Você gastou 6 de ouro e ficou com 9.', 'O que sobra fica guardado para os próximos turnos.'], targets: [GOLD_ME], panel: 'top' },
  { id: 'finalizar-prep', kind: 'do', expr: 'point', chapter: 8, title: 'JOGOU TUDO?', lines: ['Quando terminar de jogar cartas, toque em FINALIZAR PREPARAÇÃO.'], targets: [TRACKER], until: { t: 'advance', from: 'preparacao' }, panel: 'top' },
  // 9. movement (turn 1)
  { id: 'sem-combate', kind: 'read', expr: 'warn', chapter: 9, title: 'SEM COMBATE HOJE', lines: ['O Combate está trancado: quem começa não ataca no 1º turno.', 'Por isso vamos direto para a Movimentação.'], targets: [TRACKER], panel: 'top', tracker: 'movimentacao' },
  { id: 'mov1', kind: 'read', expr: 'neutral', chapter: 9, title: 'FASE DE MOVIMENTAÇÃO', lines: ['Aqui você pode mover suas cartas, uma casa por vez.', 'Não precisa mover nada agora. Vamos praticar mais tarde.'], targets: [TRACKER], panel: 'top', tracker: 'movimentacao' },
  { id: 'fim-turno-1', kind: 'do', expr: 'point', chapter: 9, title: 'FIM DO TURNO', lines: ['Toque em FINALIZAR TURNO para passar a vez ao adversário.'], targets: [TRACKER], until: { t: 'advance', from: 'movimentacao' }, panel: 'top' },
  // 10. enemy turn 1 (its beats are below)
  { id: 'enemy1', kind: 'enemy' },
  // 11. turn 2
  { id: 'auto', kind: 'read', expr: 'happy', chapter: 11, title: 'AGORA É AUTOMÁTICO', lines: ['Compra e Suprimentos agora acontecem sozinhas.', 'Repare: você comprou uma carta e o ouro subiu para 14 (+5).'], targets: [GOLD_ME, { hand: true }], panel: 'top' },
  { id: 't2-cavaleiro', kind: 'do', expr: 'point', chapter: 11, title: 'MAIS UM CAVALEIRO', lines: ['Coloque o Cavaleiro da Luz na Vanguarda, na casa do meio.'], targets: [{ handCard: 'Cavaleiro da Luz' }, G(2)], until: { t: 'play', card: 'Cavaleiro da Luz', slot: 2 } },
  { id: 't2-reserva', kind: 'do', expr: 'point', chapter: 11, title: 'OUTRA RESERVA', lines: ['Agora uma Soldados da Ordem na Retaguarda, atrás do Cavaleiro.', 'Ela ficará de reserva para ele.'], targets: [{ handCard: 'Soldados da Ordem' }, G(7)], until: { t: 'play', card: 'Soldados da Ordem', slot: 7 } },
  { id: 't2-fin-prep', kind: 'do', expr: 'point', chapter: 11, title: 'HORA DO COMBATE', lines: ['Agora o Combate está liberado!', 'Toque em FINALIZAR PREPARAÇÃO para ir à batalha.'], targets: [TRACKER], until: { t: 'advance', from: 'preparacao' }, panel: 'top' },
  { id: 'combate', kind: 'read', expr: 'warn', chapter: 11, title: 'FASE DE COMBATE', lines: ['Aqui suas cartas atacam, uma vez por turno cada.', 'O dano é o número de ataque. Cuidado: quem apanha revida!'], targets: [TRACKER], panel: 'top', tracker: 'combate' },
  { id: 'atq1', kind: 'do', expr: 'point', chapter: 11, title: 'PRIMEIRO ATAQUE', lines: ['Toque no Cavaleiro do meio e depois na Soldados inimiga, à esquerda.'], targets: [G(2), E(1)], until: { t: 'attack', from: 2, to: 1 } },
  { id: 'atq1-ok', kind: 'read', expr: 'think', chapter: 11, title: 'ELE REVIDOU', lines: ['A Soldados inimiga caiu, mas revidou: seu Cavaleiro perdeu 3 de vida.', 'Todo ataque tem revide, exceto contra quem tem ataque 0.'], targets: [G(2)], panel: 'bottom' },
  { id: 'atq2', kind: 'do', expr: 'point', chapter: 11, title: 'CAMINHO LIVRE!', lines: ['Sem carta na frente, dá para atacar o General!', 'Toque na Soldados com escudo e depois no General inimigo.'], targets: [G(1), E(12)], until: { t: 'attack', from: 1, to: 12 } },
  { id: 'atq3', kind: 'do', expr: 'point', chapter: 11, title: 'DERRUBE O OBSTÁCULO', lines: ['O Cavaleiro da direita ataca a Devotos inimiga.', 'Ela tem ataque 0, então não revida.'], targets: [G(3), E(3)], until: { t: 'attack', from: 3, to: 3 } },
  { id: 'sem-alcance', kind: 'do', expr: 'warn', chapter: 11, title: 'E A RESERVA?', lines: ['Toque na Soldados que ficou na Retaguarda.', 'Vamos ver se ela pode atacar.'], targets: [G(7)], until: { t: 'slotTap', slot: 7 } },
  { id: 'sem-alcance-ok', kind: 'read', expr: 'think', chapter: 11, title: 'RESERVA NÃO ATACA', lines: ['Viu? Infantaria na Retaguarda não ataca.', 'Ela espera a hora de descer.'], targets: [G(7)], panel: 'top', enter: 'unselect' },
  { id: 'pos', kind: 'do', expr: 'neutral', chapter: 12, title: 'PÓS-COMBATE', lines: ['Aqui só entram Táticas, Relíquias e Terrenos.', 'Você não tem nenhuma agora, então toque para avançar.'], targets: [TRACKER], until: { t: 'advance', from: 'combate' }, panel: 'top', tracker: 'movimentacao' },
  { id: 'mov2', kind: 'do', expr: 'neutral', chapter: 12, title: 'MOVIMENTAÇÃO', lines: ['Mover é opcional, e hoje vamos pular.', 'Toque em FINALIZAR TURNO.'], targets: [TRACKER], until: { t: 'advance', from: 'movimentacao' }, panel: 'top' },
  { id: 'enemy2', kind: 'enemy' },
  // 13. turn 3
  { id: 't3-intro', kind: 'read', expr: 'cheer', chapter: 13, title: 'TURNO 3', lines: ['O escudo cumpriu o seu papel! E o caminho até o General está livre.', 'Vamos atacar com tudo!'], targets: [E(12)], panel: 'bottom' },
  { id: 't3-fin-prep', kind: 'do', expr: 'point', chapter: 13, title: 'VÁ AO COMBATE', lines: ['Toque em FINALIZAR PREPARAÇÃO.'], targets: [TRACKER], until: { t: 'advance', from: 'preparacao' }, panel: 'top' },
  { id: 't3-a1', kind: 'do', expr: 'point', chapter: 13, title: 'ATAQUE AO GENERAL', lines: ['Toque na Soldados da esquerda e depois no General inimigo.'], targets: [G(1), E(12)], until: { t: 'attack', from: 1, to: 12 } },
  { id: 't3-a2', kind: 'do', expr: 'point', chapter: 13, title: 'MAIS UM GOLPE', lines: ['Agora o Cavaleiro do meio ataca o General.'], targets: [G(2), E(12)], until: { t: 'attack', from: 2, to: 12 } },
  { id: 't3-a3', kind: 'do', expr: 'point', chapter: 13, title: 'E OUTRO MAIS', lines: ['Por fim, o Cavaleiro da direita.'], targets: [G(3), E(12)], until: { t: 'attack', from: 3, to: 12 } },
  { id: 't3-geral', kind: 'read', expr: 'cheer', chapter: 13, title: 'ELE ESTÁ FRACO!', lines: ['O General inimigo está com 6 de vida.', 'No próximo turno ele cai.'], targets: [E(12)], panel: 'bottom' },
  { id: 't3-pos', kind: 'do', expr: 'neutral', chapter: 13, title: 'PÓS-COMBATE', lines: ['Toque para avançar.'], targets: [TRACKER], until: { t: 'advance', from: 'combate' }, panel: 'top', tracker: 'movimentacao' },
  { id: 't3-move', kind: 'do', expr: 'point', chapter: 13, title: 'HORA DE MOVER', lines: ['Mova a Soldados da reserva para trás da Soldados da frente.', 'Toque nela e depois na casa indicada. Assim ela protege a carta da frente.'], targets: [G(7), G(6)], until: { t: 'move', from: 7, to: 6 } },
  { id: 't3-fim', kind: 'do', expr: 'point', chapter: 13, title: 'FIM DO TURNO', lines: ['Toque em FINALIZAR TURNO.'], targets: [TRACKER], until: { t: 'advance', from: 'movimentacao' }, panel: 'top' },
  { id: 'enemy3', kind: 'enemy' },
  // 14. turn 4
  { id: 't4-intro', kind: 'read', expr: 'warn', chapter: 14, title: 'ÚLTIMO TURNO', lines: ['O adversário colocou uma carta na coluna do meio.', 'Ela bloqueia o caminho até o General.'], targets: [E(2)], panel: 'bottom' },
  { id: 't4-fin-prep', kind: 'do', expr: 'point', chapter: 14, title: 'VÁ AO COMBATE', lines: ['Toque em FINALIZAR PREPARAÇÃO.'], targets: [TRACKER], until: { t: 'advance', from: 'preparacao' }, panel: 'top' },
  { id: 't4-a1', kind: 'do', expr: 'point', chapter: 14, title: 'DERRUBE O BLOQUEIO', lines: ['Cavaleiro do meio, ataque a carta que está na frente dele.'], targets: [G(2), E(2)], until: { t: 'attack', from: 2, to: 2 } },
  { id: 't4-a2', kind: 'do', expr: 'point', chapter: 14, title: 'CAMINHO ABERTO', lines: ['O caminho abriu! Cavaleiro da direita, ataque o General.'], targets: [G(3), E(12)], until: { t: 'attack', from: 3, to: 12 } },
  { id: 't4-a3', kind: 'do', expr: 'cheer', chapter: 14, title: 'GOLPE FINAL', lines: ['Agora a Soldados da esquerda. Acabe com ele!'], targets: [G(1), E(12)], until: { t: 'attack', from: 1, to: 12 } },
];

// Beats of the trainer's turns: talk first, then (after the attack) explain what just happened.
const R = (id: string, expr: Expr, title: string, lines: string[], targets: Tgt[] = [], panel?: 'top' | 'bottom', chapter = 10): Step => ({ id, kind: 'read', expr, title, lines, targets, panel, chapter });
export const BEATS: Record<string, Step[]> = {
  'enemy1:start': [R('e1-start', 'neutral', 'VEZ DO ADVERSÁRIO', ['Agora o adversário joga. Ele passa pelas mesmas fases que você.', 'Observe com atenção!'], [{ sel: '[data-tut="tracker"]', pad: 8 }], 'top')],
  'enemy1:afterAttack': [
    R('e1-hit', 'warn', 'ELE ATACOU!', ['O adversário atacou a Devotos e ela caiu.', 'Calma: era a isca. Veja o que acontece agora.'], [G(1)], 'bottom'),
    R('e1-reforco', 'cheer', 'REFORÇO!', ['A Soldados que estava atrás desceu de graça para a frente.', 'E ganhou Escudo 2: ele absorve os 2 primeiros pontos de dano.'], [G(1)], 'bottom'),
  ],
  'enemy2:start': [R('e2-start', 'neutral', 'VEZ DO ADVERSÁRIO', ['Ele vai jogar mais cartas e atacar a sua Soldados com escudo.', 'Veja o escudo trabalhando!'], [], 'top')],
  'enemy2:afterAttack': [R('e2-escudo', 'cheer', 'O ESCUDO FUNCIONOU!', ['O ataque era 3, o escudo absorveu 2 e só 1 passou.', 'Sem escudo, a Soldados teria perdido 3 de vida.'], [G(1)], 'bottom', 12)],
  'enemy3:start': [R('e3-start', 'warn', 'VEZ DO ADVERSÁRIO', ['Ele vai atacar a sua Soldados da frente.', 'Veja se a reserva que você moveu faz diferença.'], [], 'top', 13)],
  'enemy3:afterAttack': [R('e3-reforco', 'cheer', 'REFORÇO DE NOVO!', ['A Soldados da frente caiu, mas a reserva que você moveu desceu com Escudo 2.', 'O adversário também usou o Reforço dele.'], [G(1), E(0)], 'bottom', 13)],
};

// Final words after the win.
export const OUTRO: { lines: string[]; title: string } = {
  title: 'VITÓRIA!',
  lines: ['Você derrubou o General inimigo. Parabéns, comandante!', 'Agora você conhece o básico: moeda, ouro, fases, combate, escudo e Reforço.', 'Volte quando quiser: eu repito a aula.'],
};

// ── Headless check of the whole duel (used by tests/tutorial-script.ts) ─────────
export const playTutorialForTest = (): { winner: number | null; log: string[] } => {
  let s = createTutorialMatch(); const log: string[] = [];
  const run = (seat: 0 | 1, a: Action) => {
    const r = applyAction(s, seat, a);
    if (r.ok === false) throw new Error(`refused (${seat}) ${JSON.stringify(a)}: ${r.error}`);
    s = r.state;
  };
  run(0, { type: 'begin' } as Action);
  const doPlayer = (turn: number) => {
    for (const m of PLAYER_PATH[turn - 1]) {
      if ('advance' in m) run(0, { type: 'advance' } as Action);
      else if ('attack' in m) run(0, { type: 'attack', from: m.attack[0], to: m.attack[1] } as Action);
      else if ('move' in m) run(0, { type: 'move', from: m.move[0], to: m.move[1] } as Action);
      else { const c = s.players[0].hand.find(h => h.name === m.play); if (!c) throw new Error('no ' + m.play); run(0, { type: 'play', cardId: c.id, slot: m.slot } as Action); }
    }
  };
  for (let t = 1; t <= 4; t++) {
    doPlayer(t);
    log.push(`P${t} general hp ${s.players[1].board[12]?.hp ?? 'dead'}`);
    if (s.winner !== null) break;
    if (t === 4) break;
    const round = s.turn.round;
    let done = 0;
    while (s.turn.active === 1 && s.turn.round === round && done < 20) { run(1, nextEnemyAction(s, done)!); done++; }
  }
  return { winner: s.winner, log };
};
