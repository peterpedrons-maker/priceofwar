import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import turnButtonFrameImage from './assets/button-frame.webp';
import nodeCurrentImage from './assets/node-current.webp';
import nodeFutureImage from './assets/node-future.webp';
import nodeLockedImage from './assets/icon-lock-turn.webp';
import chevronDoubleImage from './assets/icon-chevron-double.webp';
import hourglassImage from './assets/icon-hourglass.webp';
import plaqueMaskImage from './assets/plaque-mask.webp';
import { playAiTurn, AiAction } from './services/aiService';
import boardBattlefieldImage from './assets/board-battlefield.webp';
import logoImage from './assets/logo-price-of-war.webp';
import startScreenBgImage from './assets/start-screen-bg.webp';
import buttonPlaqueImage from './assets/button-plaque.webp';
import cardTemplateImage from './assets/card-template.webp';
import cardTemplateSilverImage from './assets/card-template-silver.webp';
import cardTemplateChampagneImage from './assets/card-template-champagne.webp';
import cardBackplateImage from './assets/card-backplate.webp';
import cardTemplateFullArtGoldImage from './assets/card-template-fullart-gold.webp';
import cardTemplateMiniImage from './assets/card-template-mini.webp';
import cardTemplateSilverMiniImage from './assets/card-template-silver-mini.webp';
import cardTemplateChampagneMiniImage from './assets/card-template-champagne-mini.webp';
import cardFullArtFrameEmboscadaImage from './assets/card-fullart-frame-emboscada.webp';
import cardFullArtFrameTaticaImage from './assets/card-fullart-frame-tatica.webp';
import hudGoldBadgeImage from './assets/hud-gold-badge.webp';
// Combat visuals cropped from a single reference sheet the user supplied (a
// collage of style options, not individually-shipped assets — see git history
// for the exact crop coordinates) — one instance chosen per category instead of
// coding a full palette of unused alternatives.
import attackArrowRedImage from './assets/attack-arrow-red.png';
import attackArrowBlueImage from './assets/attack-arrow-blue.png';
import haloValidTargetImage from './assets/halo-valid-target.png';
import haloInvalidTargetImage from './assets/halo-invalid-target.png';
import haloSelectionImage from './assets/halo-selection.png';
import badgeSwordImage from './assets/badge-sword.png';
import badgeShieldImage from './assets/badge-shield.png';
import abilityReadyBorderImage from './assets/border-ability-ready.png';
import multidaoDeFieisArt from './assets/card-multidao-de-fieis.webp';
import comercianteDasCruzadasArt from './assets/card-comerciante-das-cruzadas.webp';
import espiaoSabotadorArt from './assets/card-espiao-sabotador.webp';
import soldadoFanaticoArt from './assets/card-soldado-fanatico.webp';
import vigiaDeMantimentosArt from './assets/card-vigia-de-mantimentos.webp';
import infantariaTreinadaArt from './assets/card-infantaria-treinada.webp';
import hospitalarioArt from './assets/card-hospitalario.webp';
import arqueiroProfissionalArt from './assets/card-arqueiro-profissional.webp';
import atiradorInfluenteArt from './assets/card-atirador-influente.webp';
import cardealPedroFullArt from './assets/card-cardeal-pedro-full.webp';
import caliceDaVidaFullArt from './assets/card-calice-da-vida-full.webp';
import nobreReligiosoFullArt from './assets/card-nobre-religioso-full.webp';
import liderDeEsquadraoFullArt from './assets/card-lider-de-esquadrao-full.webp';
import trabucoDeCercoFullArt from './assets/card-trabuco-de-cerco-full.webp';
import catapultaDeGuerraArt from './assets/card-catapulta-de-guerra.webp';
import balestraDePrecisaoArt from './assets/card-balestra-de-precisao.webp';
import armaduraDeGuerraArt from './assets/card-armadura-de-guerra.webp';
import couracaReforcadaArt from './assets/card-couraca-reforcada.webp';
import flechasVenenosasArt from './assets/card-flechas-venenosas.webp';
import espadaLongaArt from './assets/card-espada-longa.webp';
import reforcosOcultosArt from './assets/card-reforcos-ocultos.webp';
import retornoDoSoldadoFullArt from './assets/card-retorno-do-soldado-full.webp';
import graalDaDadivaArt from './assets/card-graal-da-dadiva.webp';
import doutrinaRenovadaArt from './assets/card-doutrina-renovada.webp';
import recrutamentoSeletivoArt from './assets/card-recrutamento-seletivo.webp';
import recrutarVeteranosArt from './assets/card-recrutar-veteranos.webp';
import tributoDeGuerraArt from './assets/card-tributo-de-guerra.webp';
import chamadoAsArmasArt from './assets/card-chamado-as-armas.webp';
import recrutaDevotoArt from './assets/card-recruta-devoto.webp';
import cavaleiroDaLuzFullArt from './assets/card-cavaleiro-da-luz-full.webp';
import jorgeOLanceiroFullArt from './assets/card-jorge-o-lanceiro-full.webp';
import cardDrawSfxUrl from './assets/sfx-comprar-carta.mp3';
import duelMusicUrl from './assets/music-duelo.mp3';
// SFX sourced from CC0 (public-domain) libraries — the "RPG Sound Pack" (a well-known
// freely-licensed pack) for the attack/tactic sounds, and real card-table recordings
// for the card-play thud, picked and approved by the user over a few rounds (see git
// history) rather than a first guess. No attribution is legally required for CC0, but
// noting the source here for anyone maintaining this later.
import cardPlaySfxUrl from './assets/sfx-jogar-carta.wav';
import attackSfxUrl from './assets/sfx-ataque.wav';
import tacticSfxUrl from './assets/sfx-tatica.wav';
import selectSfxUrl from './assets/sfx-selecionar.wav';

// Every card/board/UI image in the game besides the start screen's own background
// and logo (those two load first, in the loading screen's initial black-screen
// phase — see LoadingScreen below) — preloaded during the loading screen's bar
// phase so nothing pops in mid-match from a cold network fetch.
const ALL_PRELOAD_IMAGES: string[] = [
  boardBattlefieldImage, buttonPlaqueImage, cardTemplateImage, cardTemplateSilverImage,
  cardTemplateChampagneImage, cardBackplateImage, cardTemplateFullArtGoldImage,
  cardTemplateMiniImage, cardTemplateSilverMiniImage, cardTemplateChampagneMiniImage,
  cardFullArtFrameEmboscadaImage, cardFullArtFrameTaticaImage,
  multidaoDeFieisArt, comercianteDasCruzadasArt, espiaoSabotadorArt, soldadoFanaticoArt,
  vigiaDeMantimentosArt, infantariaTreinadaArt, hospitalarioArt, arqueiroProfissionalArt,
  atiradorInfluenteArt, cardealPedroFullArt, caliceDaVidaFullArt, nobreReligiosoFullArt,
  liderDeEsquadraoFullArt, trabucoDeCercoFullArt, catapultaDeGuerraArt, balestraDePrecisaoArt,
  armaduraDeGuerraArt, couracaReforcadaArt, flechasVenenosasArt, espadaLongaArt,
  reforcosOcultosArt, retornoDoSoldadoFullArt, graalDaDadivaArt, doutrinaRenovadaArt,
  recrutamentoSeletivoArt, recrutarVeteranosArt, tributoDeGuerraArt, chamadoAsArmasArt,
  recrutaDevotoArt, cavaleiroDaLuzFullArt, jorgeOLanceiroFullArt,
];

// How long a newly drawn card takes to travel from the deck and flip face-up in
// hand (see the flying-card motion.div's own transition, further down) — shared
// at module level so playCardDrawSfx (below) can delay its cue to match, instead
// of firing the instant the draw is logically resolved, well before the card is
// actually visible.
const DRAW_FLIGHT_MS = 750;

// One-shot SFX helper — a fresh Audio() per call (rather than one shared/reused
// element) so overlapping draws (e.g. Recrutar Veteranos drawing several cards at
// once) each get their own independent playback instead of cutting each other off.
// Delayed by the same duration as the draw's own flight animation so the sound
// lands when the card actually arrives in hand, not the instant it's dealt off
// the deck — otherwise it reads as playing before the player has drawn anything.
const playCardDrawSfx = () => {
  window.setTimeout(() => {
    const audio = new Audio(cardDrawSfxUrl);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }, DRAW_FLIGHT_MS);
};

// Same fresh-Audio()-per-call approach as playCardDrawSfx above, for the other
// three recurring game events that had no audio feedback at all — a card
// landing on the board, an attack connecting, and a Tática/Emboscada
// activating. Each fires right at its own visual moment (see call sites)
// rather than at the start of a longer animation, so it reads as tied to
// the thing that just happened on screen.
const playCardPlaySfx = () => {
  const audio = new Audio(cardPlaySfxUrl);
  audio.volume = 0.7;
  audio.play().catch(() => {});
};
const playAttackSfx = () => {
  const audio = new Audio(attackSfxUrl);
  audio.volume = 0.6;
  audio.play().catch(() => {});
};
const playTacticSfx = () => {
  const audio = new Audio(tacticSfxUrl);
  audio.volume = 0.6;
  audio.play().catch(() => {});
};
// Deliberately quieter than the others — this one can fire many times in a row
// (every hand-card tap) where the others are one-per-event, so it needs to sit
// in the background instead of competing with them.
const playSelectSfx = () => {
  const audio = new Audio(selectSfxUrl);
  audio.volume = 0.35;
  audio.play().catch(() => {});
};

export type CardType = 'Infantaria' | 'Cavalaria' | 'Arqueiro' | 'Artilharia' | 'General' | 'Relíquia' | 'Terreno' | 'Tática' | 'Emboscada';

export type CardData = {
  id: string;
  name: string;
  atk: number;
  hp: number;
  cost: number;
  art: string;
  effect: string;
  cardType?: CardType;
  isDestroyed?: boolean;
  // A handful of the most iconic cards (the Generals, for now — see DECK_CAPITAO/
  // DECK_CARDEAL) are marked as the "full art, legendary-weight" tier. Playing one
  // makes the whole board react (see triggerFullArtReaction): a stronger camera
  // shake and every other card on the field flinches, like a big finisher landing.
  isFullArt?: boolean;
  // A one-time "+X ATK/+X HP in its next combat" bonus — currently only granted by
  // Comandante Aurelion's active ability (see grantAurelionBuff) — consumed the
  // next time this exact card instance attacks or defends (see getEffectiveAtk and
  // the combat resolution blocks' own pendingCombatBonus.hp handling).
  pendingCombatBonus?: { atk: number; hp: number };
  // A permanent stack of "-1 damage taken" stamps — currently only granted by
  // Linha Fechada (see resolveOwnTacticTarget) to whoever was adjacent to the
  // chosen unit at cast time. Read in getIncomingDamageReduction alongside the
  // General/Fortaleza aura checks.
  dmgReduction?: number;
  // The explicit exception to "Táticas are single-use and never sit on the board":
  // an Armamento (Armadura de Guerra/Couraça Reforçada/Flechas Venenosas/Espada Longa) doesn't
  // go to the graveyard when used — it stays equipped, rendered as a card peeking
  // out from behind this one (see CardSlot), until this unit dies (see
  // graveyardWithEquipment, which sends any equipped weapons along with it).
  equippedWeapons?: CardData[];
};

// Slot layout per side (13 slots):
//   0-4  = Vanguarda (frontline, 5 columns)
//   5-9  = Retaguarda (backline, 5 columns)
//   10   = slot especial de Relíquia (ao lado do General)
//   11   = slot especial de Terreno (ao lado do General)
//   12   = General (fixo, colocado no início da partida — não vem da mão)

export type SlotHint = 'valid' | 'invalid';

// Whether a given card type can go in a given slot — shown on every empty slot at
// once while that card is tap-selected (see getPlayerSlotHint) — Vanguarda and
// Retaguarda count the same here on purpose: any creature can be placed in either,
// the difference between them (only Vanguarda-posted Infantaria can attack — see
// getValidAttackTargets) is a combat rule, not a placement rule, so it has no
// business being color-coded here (see getRowRoleHint just below for where that
// distinction actually gets surfaced instead).
const getSlotHint = (cardType: CardType | undefined, slotIndex: number): SlotHint => {
  if (slotIndex === 12) return 'invalid'; // General slot is fixed, never playable from hand
  // Emboscada cards only resolve via the ambush interrupt (see maybeActivatePlayerAmbush)
  // and Táticas either resolve immediately or via their own on-board targeting flow (see
  // TARGETABLE_TACTICS) — neither is ever dropped onto a slot like a creature.
  if (cardType === 'Emboscada' || cardType === 'Tática') return 'invalid';
  const isSpecialSlot = slotIndex === 10 || slotIndex === 11; // beside the General: Relíquia/Terreno only
  const isFieldOnlyCard = cardType === 'Relíquia' || cardType === 'Terreno';
  if (isSpecialSlot) return isFieldOnlyCard ? 'valid' : 'invalid';
  if (isFieldOnlyCard) return 'invalid';
  return 'valid';
};

// Annotates a valid empty-slot placement hint with what that row actually lets the
// unit DO, instead of leaving Vanguarda/Retaguarda visually identical during
// selection — but only where the rules already draw that line: today that's just
// Infantaria (see getValidAttackTargets' own isBackline check). Showing this badge
// for every unit type would imply a restriction that isn't real for e.g. Arqueiro,
// so nothing else gets one.
const getRowRoleHint = (cardType: CardType | undefined, slotIndex: number): 'combat' | 'support' | undefined => {
  if (cardType !== 'Infantaria') return undefined;
  if (isFrontline(slotIndex)) return 'combat';
  if (isBackline(slotIndex)) return 'support';
  return undefined;
};

// Lane-based combat targeting — ported from an earlier, fully-art version of this
// project (see git history: commit 8a3d7b8, later reverted for being too broken to
// keep) so the tactical rules survive even though that build didn't. Each side has 5
// lanes (columns 0-4): a Vanguarda (front) slot and a Retaguarda (back) slot per lane,
// plus a center lane holding the General (col 2) and the two special slots beside it
// (10 at col 1, 11 at col 3).
const isFrontline = (slotIndex: number) => slotIndex >= 0 && slotIndex <= 4;
const isBackline = (slotIndex: number) => slotIndex >= 5 && slotIndex <= 9;
const getLaneCol = (slotIndex: number) => {
  if (isFrontline(slotIndex)) return slotIndex;
  if (isBackline(slotIndex)) return slotIndex - 5;
  return -1; // General/Relíquia/Terreno don't occupy a lane themselves
};

const getValidAttackTargets = (
  attackerIndex: number,
  attackerSlots: (CardData | null)[],
  enemySlots: (CardData | null)[]
): Set<number> => {
  const validTargets = new Set<number>();
  const attacker = attackerSlots[attackerIndex];
  if (!attacker) return validTargets;

  // The General/Relíquia/Terreno don't initiate attacks.
  const attackerCol = getLaneCol(attackerIndex);
  if (attackerCol === -1) return validTargets;

  // Infantaria posted in the Retaguarda doesn't attack at all — a positioning
  // trade-off for whatever defensive perk it gets back there.
  if (attacker.cardType === 'Infantaria' && isBackline(attackerIndex)) return validTargets;

  // A non-ranged attacker with an enemy directly in front (same lane, enemy
  // Vanguarda) is FORCED to target only that card — no reaching past it. Ranged
  // units (Arqueiro/Artilharia) ignore this and can always consider all 3 lanes.
  const isRanged = attacker.cardType === 'Arqueiro' || attacker.cardType === 'Artilharia';
  const directFrontalEnemy = !isRanged && !!enemySlots[attackerCol];
  const scanCols = directFrontalEnemy
    ? [attackerCol]
    : [attackerCol - 1, attackerCol, attackerCol + 1].filter(c => c >= 0 && c <= 4);

  scanCols.forEach(col => {
    const frontIdx = col;
    const backIdx = col + 5;
    if (enemySlots[frontIdx]) {
      validTargets.add(frontIdx);
    } else if (enemySlots[backIdx]) {
      // The Retaguarda card in this lane is only reachable while its own
      // Vanguarda is empty.
      validTargets.add(backIdx);
    }
  });

  // Center lane (General at col 2, the two special slots at col 1/3): reachable
  // only when the attacker's scan angle includes that column AND the whole lane
  // leading to it (front + back) is completely clear of blockers.
  const centerLane: { col: number; target: number }[] = [
    { col: 1, target: 10 },
    { col: 2, target: 12 },
    { col: 3, target: 11 },
  ];
  centerLane.forEach(({ col, target }) => {
    if (!enemySlots[target]) return;
    if (!scanCols.includes(col)) return;
    const isPathClear = !enemySlots[col] && !enemySlots[col + 5];
    if (isPathClear) validTargets.add(target);
  });

  return validTargets;
};

// Turn phases — Compra (draw) is automatic and instant (see the currentTurn effect)
// but still gets its own announcement/step for readability; Preparação plays cards
// from hand and activates card/General abilities; Combate (turn 3+ only, ported from
// the earlier full-art version, commit 8a3d7b8) is the only phase that can attack;
// Movimentação repositions units. Combate sits BEFORE Movimentação on purpose — you
// attack with this turn's formation, then adjust it afterward for next turn (this is
// also when Batedor's free post-combat move and the Aurelion/Soldado Tático
// end-of-turn effects, which read this turn's movedSlots, actually fire — see the
// turn button's onClick).
//
// Reposicionar and Comando used to be merged into one phase — forcing them apart
// re-introduces the "nothing to do yet" step that merge was avoiding, but the user
// asked for the explicit Yu-Gi-Oh-style phase breakdown anyway; a phase with nothing
// to do is just a tap-through, not a real cost.
export type TurnPhase = 'preparacao' | 'combate' | 'movimentacao';
const phasesForTurn = (turn: number): TurnPhase[] =>
  turn >= 3 ? ['preparacao', 'combate', 'movimentacao'] : ['preparacao', 'movimentacao'];
// Short labels for the small always-on phase-tag column (see PhaseTagColumn below)
// planted at each field's own edge — brought back in a smaller, out-of-the-way
// form after the original center-HUD version was removed for being unreadable at
// that size; this one only has to fit a narrow column, not share a row with the
// gold badges and turn button.
const PHASE_TAG_LABELS: Record<TurnPhase, string> = {
  preparacao: 'Prep.',
  combate: 'Combate',
  movimentacao: 'Mov.',
};
const PHASE_TAG_ORDER: TurnPhase[] = ['preparacao', 'combate', 'movimentacao'];
// The ceremonial "FASE DE X" wording for the center-screen announcement banner
// (see announcePhase) — this is now the ONLY place a phase's name is shown to the
// player (the small always-on tracker chip was removed, see git history: too tiny
// to read, and redundant now that every transition gets this banner).
const PHASE_BANNER_TEXT: Record<TurnPhase, { title: string; subtitle: string }> = {
  preparacao: { title: 'Fase de Preparação', subtitle: 'Jogue cartas e ative habilidades' },
  combate: { title: 'Fase de Combate', subtitle: 'Ataque com suas unidades' },
  movimentacao: { title: 'Fase de Movimentação', subtitle: 'Reposicione suas unidades' },
};
// The Avançar button's own stepper row (see its render below) always spells out
// all three full names, Combate included even on turns 1-2 when it's locked —
// an abbreviated "Prep."/"Mov." read as meaningless to a player who doesn't
// already know the phase names by heart, so this shrinks the FONT instead of
// the words to make everything fit.
const PHASE_SHORT_LABEL: Record<TurnPhase, string> = {
  preparacao: 'Preparação',
  combate: 'Combate',
  movimentacao: 'Movimentação',
};
// The banner is driven as a 3-stage state machine (see announcePhase/phaseBanner)
// instead of one motion.div animating a 5-point opacity/x KEYFRAME array — that
// version genuinely ran, but this component re-renders constantly (gold badges,
// the turn ring's own looping animation, floating numbers, …), and every one of
// those re-renders restarted the keyframe animation from its very first frame,
// which never gave the opacity track time to climb anywhere near full strength
// the whole time the banner was on screen. Each stage below targets a single
// plain (non-array) value, which framer-motion just smoothly retargets toward —
// re-rendering mid-stage is a no-op since the target hasn't changed.
const PHASE_BANNER_STAGE_MS = { in: 250, hold: 1600, out: 250 } as const;
const PHASE_BANNER_DURATION_MS = PHASE_BANNER_STAGE_MS.in + PHASE_BANNER_STAGE_MS.hold + PHASE_BANNER_STAGE_MS.out;
// y is a constant lift, not something that changes stage to stage — the ribbon sits
// dead-center in the viewport by default (see the banner's own fixed inset-0
// flex-center wrapper below), which put its top edge low enough that the HUD's
// turn button, vertically centered a bit higher (near the board's own Vanguarda
// gap, not the screen's true center — see boardTopMargin's own math further down),
// poked out above it. Shifting the whole banner up clears that without having to
// touch the HUD itself.
const PHASE_BANNER_Y = -12;
const PHASE_BANNER_MOTION: Record<'in' | 'hold' | 'out', { animate: { opacity: number; x: number; y: number }; transition: { duration: number; ease: 'easeOut' | 'easeIn' | 'linear' } }> = {
  in: { animate: { opacity: 1, x: 0, y: PHASE_BANNER_Y }, transition: { duration: PHASE_BANNER_STAGE_MS.in / 1000, ease: 'easeOut' } },
  hold: { animate: { opacity: 1, x: 0, y: PHASE_BANNER_Y }, transition: { duration: 0, ease: 'linear' } },
  out: { animate: { opacity: 0, x: -420, y: PHASE_BANNER_Y }, transition: { duration: PHASE_BANNER_STAGE_MS.out / 1000, ease: 'easeIn' } },
};

// Reposition adjacency — only Vanguarda/Retaguarda slots (0-9) take part; the
// General/Relíquia/Terreno slots (10-12) are fixed, same as everywhere else they're
// special-cased in this file. A 2-row x 5-column grid, orthogonal adjacency only
// (no diagonals), matching the old version's grid-distance rule.
const getMoveRow = (slotIndex: number) => (slotIndex <= 4 ? 0 : 1);
const getMoveCol = (slotIndex: number) => (slotIndex <= 4 ? slotIndex : slotIndex - 5);
const areSlotsAdjacent = (a: number, b: number) => {
  if (a < 0 || a > 9 || b < 0 || b > 9 || a === b) return false;
  const dr = Math.abs(getMoveRow(a) - getMoveRow(b));
  const dc = Math.abs(getMoveCol(a) - getMoveCol(b));
  return dr + dc === 1;
};

// ── Deck Capitão mechanics ──────────────────────────────────────────────────
// Every card's `effect` string used to be flavor text only — none of it actually
// ran. This block gives Deck Capitão's abilities real behavior. Matched by
// `name` rather than `id`: drawFromDeck/drawFromNpcDeck stamp every drawn card
// with a fresh random id (`hand_<timestamp>_<random>`) to keep React keys and
// draw-animation bookkeeping unique per copy, which means the deck array's own
// descriptive ids (e.g. 'c_tactical_soldier_0') don't survive onto the board —
// only `name` does, and it's identical across every copy of a given card, so
// it's the stable thing to key off. Deck Cardeal Pedro's much larger and more
// varied set of abilities (healing, card draw, summon-on-play, equip-style
// buffs, deck/graveyard search) needs its own new subsystems (equipment
// attachment, reveal-and-choose UI for draws/searches) this pass doesn't build
// — those are still flavor-text-only, same as before. A few Capitão abilities
// are ALSO left as flavor-only where they need a kind of UI this pass doesn't
// add either (a free-standing "pick a unit and buff/move it" targeting mode for
// a Tática card): Reformar Linhas, Avanço Coordenado, Reposicionamento Rápido,
// Linha Fechada, Ordem de Retirada, and Batedor's "move after combat" (there's
// no post-Batalha phase to move again in — see phasesForTurn — so this would
// need a real phase-system change, not just a targeting UI). Escudeiro de
// Linha's "Protege unidades atrás" needs nothing new: getValidAttackTargets
// already blocks a lane's Retaguarda card from being attacked while its own
// Vanguarda is occupied, for any unit, so this is already generically true.

// Is the named card alive and on the field at this exact slot? Used for every
// singleton (General/Relíquia/Terreno) aura check below.
const isAliveAt = (slots: (CardData | null)[], index: number, name: string) =>
  slots[index]?.name === name && !slots[index]?.isDestroyed;

// A unit's ATK after every static Deck Capitão aura that touches it, plus any
// one-time "next combat" bonus it's currently holding (see pendingCombatBonus —
// granted by Comandante Aurelion's active below). Called from both combat
// resolution paths (handleNpcSlotClick and the AI turn loop) for whichever side
// is attacking or defending — auras are computed from board state, not stored,
// so they always reflect what's alive on the field right now.
const getEffectiveAtk = (
  card: CardData,
  ownIndex: number,
  ownSlots: (CardData | null)[],
  enemySlots: (CardData | null)[]
): number => {
  let atk = card.atk + (card.pendingCombatBonus?.atk ?? 0);
  // Estandarte da Legião (Relíquia, own slot 10): all allies +1 ATK.
  if (isAliveAt(ownSlots, 10, 'Estandarte da Legião')) atk += 1;
  // Veterano de Guerra: +2 ATK to itself while standing in column index 2
  // ("coluna 3", 1-indexed) — a positional self-buff, not an aura on others.
  if (card.name === 'Veterano de Guerra' && getLaneCol(ownIndex) === 2) atk += 2;
  // Lanceiro de Controle: the enemy unit directly facing its lane (same slot
  // index, mirrored across the board) gets -1 ATK while the Lanceiro is alive.
  const facingEnemy = enemySlots[ownIndex];
  if (facingEnemy && !facingEnemy.isDestroyed && facingEnemy.name === 'Lanceiro de Controle') atk -= 1;
  // Pântano Maldito (Terreno, enemy's own slot 11): enemy Vanguarda -1 ATK.
  if (isFrontline(ownIndex) && isAliveAt(enemySlots, 11, 'Pântano Maldito')) atk -= 1;
  // Comandante da Ordem (Deck Cardeal): +1 ATK for allied Infantaria/Arqueiro
  // while it's standing in the Vanguarda (see hasLiderBuff below).
  if (hasLiderBuff(card, ownSlots)) atk += 1;
  return Math.max(0, atk);
};

// How much incoming damage a slot's occupant shrugs off before it's subtracted
// from HP — Comandante Aurelion's passive and Fortaleza de Pedra, both flat -1
// reductions that stack if somehow both apply.
const getIncomingDamageReduction = (ownIndex: number, ownSlots: (CardData | null)[]): number => {
  let reduction = 0;
  // Comandante Aurelion passive: units adjacent to the General (the Relíquia/
  // Terreno slots on either side of him) take -1 damage.
  if ((ownIndex === 10 || ownIndex === 11) && isAliveAt(ownSlots, 12, 'Comandante Aurelion, Mestre da Formação')) reduction += 1;
  // Fortaleza de Pedra (Terreno, own slot 11): own Retaguarda takes -1 damage.
  if (isBackline(ownIndex) && isAliveAt(ownSlots, 11, 'Fortaleza de Pedra')) reduction += 1;
  // Linha Fechada: a permanent per-unit stamp (see resolveOwnTacticTarget), not an aura.
  reduction += ownSlots[ownIndex]?.dmgReduction ?? 0;
  return reduction;
};

// Comandante Aurelion's active: "Após Remanejamento, até 2 unidades que se
// moveram ganham +1/+1 no próximo combate." Called once, right as Preparação
// ends (see the turn button's onClick) — tags up to 2 of this turn's movedSlots
// with a one-time bonus, consumed (see getEffectiveAtk / the combat blocks'
// pendingCombatBonus.hp handling) the next time that unit actually fights.
// NPC-side is out of scope: aiService.ts never repositions its own units (see
// its Relíquia/Terreno skip), so movedSlots-style tracking has nothing to read
// there even if the AI ends up playing this same deck (see resetGame).
const grantAurelionBuff = (slots: (CardData | null)[], moved: Set<number>): (CardData | null)[] => {
  if (!isAliveAt(slots, 12, 'Comandante Aurelion, Mestre da Formação') || moved.size === 0) return slots;
  const targets = [...moved].filter(i => slots[i]).slice(0, 2);
  if (targets.length === 0) return slots;
  const next = [...slots];
  targets.forEach(i => { next[i] = { ...next[i]!, pendingCombatBonus: { atk: 1, hp: 1 } }; });
  return next;
};

// Capitão de Formação: "Ao mover: adjacentes +1 ATK." Called right after a
// reposition move lands (see handleSlotClick) — a permanent stat stamp on
// whoever was standing next to its NEW position, not a recomputed aura, so the
// buff persists even if the Capitão later moves away or dies.
const applyFormationCaptainBuff = (slots: (CardData | null)[], moverNewIndex: number): (CardData | null)[] => {
  const mover = slots[moverNewIndex];
  if (!mover || mover.name !== 'Capitão de Formação') return slots;
  const next = [...slots];
  for (let j = 0; j <= 9; j++) {
    if (areSlotsAdjacent(moverNewIndex, j) && next[j]) {
      next[j] = { ...next[j]!, atk: next[j]!.atk + 1 };
    }
  }
  return next;
};

// Soldado Tático: "Troca com aliado adjacente no fim do turno." Runs for
// whichever side's turn just ended (see the turn button's onClick and the AI
// turn loop's own end) — every Soldado Tático still on the Vanguarda/Retaguarda
// grid swaps with one adjacent ally, if it has one. A slot only takes part in one
// swap per pass so two adjacent Soldados don't bounce back and forth.
const applyEndOfTurnSwaps = (slots: (CardData | null)[]): (CardData | null)[] => {
  const next = [...slots];
  const settled = new Set<number>();
  for (let i = 0; i <= 9; i++) {
    if (settled.has(i)) continue;
    const card = next[i];
    if (!card || card.name !== 'Soldado Tático') continue;
    const partner = [i - 1, i + 1, i - 5, i + 5].find(j => areSlotsAdjacent(i, j) && next[j] && !settled.has(j));
    if (partner !== undefined) {
      [next[i], next[partner]] = [next[partner], next[i]];
      settled.add(i);
      settled.add(partner);
    }
  }
  return next;
};

// Cavaleiro Tático: "Troca com qualquer aliado na linha" — its own reposition
// range is the whole Vanguarda or Retaguarda row it's standing in, not just the
// orthogonal-neighbor rule every other unit uses (see areSlotsAdjacent). Shared
// by the move-target highlight (validMoveTargets) and the actual move's own
// validity check (handleSlotClick) so both agree on what's legal.
const canReposition = (moverCard: CardData | null, from: number, to: number): boolean => {
  if (!moverCard || from === to) return false;
  if (moverCard.name === 'Cavaleiro Tático') return getMoveRow(from) === getMoveRow(to);
  return areSlotsAdjacent(from, to);
};

// Which specific effect a chosen Emboscada card performs when activated,
// replacing the old one-size-fits-all "+2/+2 to the defender" placeholder now
// that Deck Capitão's three Emboscadas have actual written mechanics. Any
// Emboscada without a case here (Deck Cardeal's "Reforços Ocultos" isn't wired
// yet) still gets that original generic buff as a fallback.
const resolveAmbushEffect = (
  ambushCard: CardData,
  attackerSlots: (CardData | null)[],
  attackerIndex: number,
  defenderSlots: (CardData | null)[],
  defenderIndex: number
): {
  attackerSlots: (CardData | null)[];
  defenderSlots: (CardData | null)[];
  defenderIndex: number;
  defender: CardData | null;
  cancelled: boolean;
} => {
  const defender = defenderSlots[defenderIndex];

  // Bloqueio Instantâneo: cancels the attack outright if the defender has an
  // adjacent ally to lean on — no damage to either side.
  if (ambushCard.name === 'Bloqueio Instantâneo') {
    const hasAdjacentAlly = defenderIndex <= 9 &&
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(j => areSlotsAdjacent(defenderIndex, j) && defenderSlots[j]);
    return { attackerSlots, defenderSlots, defenderIndex, defender, cancelled: hasAdjacentAlly };
  }

  // Contra-Manobra: swaps the defender out for an adjacent ally, who takes the
  // hit in their place.
  if (ambushCard.name === 'Contra-Manobra') {
    if (defenderIndex <= 9) {
      const partner = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find(j => areSlotsAdjacent(defenderIndex, j) && defenderSlots[j]);
      if (partner !== undefined) {
        const nextDefenderSlots = [...defenderSlots];
        [nextDefenderSlots[defenderIndex], nextDefenderSlots[partner]] = [nextDefenderSlots[partner], nextDefenderSlots[defenderIndex]];
        return { attackerSlots, defenderSlots: nextDefenderSlots, defenderIndex: partner, defender: nextDefenderSlots[partner], cancelled: false };
      }
    }
    return { attackerSlots, defenderSlots, defenderIndex, defender, cancelled: false };
  }

  // Formação Quebrada: yanks the ATTACKER to a random empty slot on their own
  // side, so the attack never lands.
  if (ambushCard.name === 'Formação Quebrada') {
    const emptySlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => i !== attackerIndex && !attackerSlots[i]);
    const nextAttackerSlots = [...attackerSlots];
    if (emptySlots.length > 0) {
      const target = emptySlots[Math.floor(Math.random() * emptySlots.length)];
      nextAttackerSlots[target] = nextAttackerSlots[attackerIndex];
      nextAttackerSlots[attackerIndex] = null;
    }
    return { attackerSlots: nextAttackerSlots, defenderSlots, defenderIndex, defender, cancelled: true };
  }

  // Reforços Ocultos (Deck Cardeal): +2 ATK / +1 HP — same shape as the generic
  // fallback below but +1 HP, not +2, so it gets its own exact case.
  if (ambushCard.name === 'Reforços Ocultos') {
    const buffed = defender ? { ...defender, atk: defender.atk + 2, hp: defender.hp + 1 } : null;
    const nextDefenderSlots = [...defenderSlots];
    if (buffed) nextDefenderSlots[defenderIndex] = buffed;
    return { attackerSlots, defenderSlots: nextDefenderSlots, defenderIndex, defender: buffed, cancelled: false };
  }

  // Fallback — the original generic buff, for any Emboscada without its own case.
  const buffed = defender ? { ...defender, atk: defender.atk + 2, hp: defender.hp + 2 } : null;
  const nextDefenderSlots = [...defenderSlots];
  if (buffed) nextDefenderSlots[defenderIndex] = buffed;
  return { attackerSlots, defenderSlots: nextDefenderSlots, defenderIndex, defender: buffed, cancelled: false };
};

// The 4 Deck Capitão Táticas that resolve by picking a target on the board
// instead of just sitting there as an inert 0/0 card — see handlePlayCardButtonClick
// (which puts the game into "pick a target" mode instead of the normal slot-placement
// flow) and resolveOwnTacticTarget/resolveEnemyTacticTarget (which actually apply the
// effect once a target is clicked). Reformar Linhas isn't here: it doesn't target
// anything, it just grants bonus reposition moves immediately (see bonusRepositions).
export type TacticTargetKind =
  | 'avanco_coordenado' | 'reposicionamento_rapido' | 'linha_fechada' | 'ordem_retirada'
  | 'balesta' | 'catapulta' | 'equip_armadura' | 'equip_corcelete' | 'equip_flecha' | 'equip_espada';
const TARGETABLE_TACTICS: Record<string, TacticTargetKind> = {
  'Avanço Coordenado': 'avanco_coordenado',
  'Reposicionamento Rápido': 'reposicionamento_rapido',
  'Linha Fechada': 'linha_fechada',
  'Ordem de Retirada': 'ordem_retirada',
  'Balestra de Precisão': 'balesta',
  'Catapulta de Guerra': 'catapulta',
  'Armadura de Guerra': 'equip_armadura',
  'Couraça Reforçada': 'equip_corcelete',
  'Flechas Venenosas': 'equip_flecha',
  'Espada Longa': 'equip_espada',
};
const TACTIC_TARGET_PROMPTS: Record<TacticTargetKind, string> = {
  avanco_coordenado: 'Escolha uma unidade sua que já se moveu neste turno.',
  reposicionamento_rapido: 'Escolha uma unidade inimiga para deslocar.',
  linha_fechada: 'Escolha uma unidade sua — os aliados ao lado dela recebem menos dano.',
  ordem_retirada: 'Escolha uma unidade sua na Vanguarda.',
  balesta: 'Escolha uma unidade inimiga para causar 3 de dano.',
  catapulta: 'Escolha uma fileira inimiga (clique em qualquer slot dela).',
  equip_armadura: 'Escolha uma Infantaria sua para equipar (+2 HP).',
  equip_corcelete: 'Escolha um Arqueiro ou Infantaria sua para equipar (+1 HP).',
  equip_flecha: 'Escolha um Arqueiro seu para equipar (+1 ATK).',
  equip_espada: 'Escolha uma Cavalaria ou Infantaria sua para equipar (+2 ATK).',
};
// Which own-board card types each equipment Tática accepts.
const EQUIP_ALLOWED_TYPES: Record<string, CardType[]> = {
  equip_armadura: ['Infantaria'],
  equip_corcelete: ['Arqueiro', 'Infantaria'],
  equip_flecha: ['Arqueiro'],
  equip_espada: ['Cavalaria', 'Infantaria'],
};

// What "um soldado" means across the reveal/search Táticas below (Retorno do
// Soldado, Recrutamento Seletivo, Chamado às Armas) — any regular unit, not a
// General/Relíquia/Terreno/Tática/Emboscada.
const SOLDIER_TYPES: CardType[] = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'];

// ── Drag-to-play classification ──────────────────────────────────────────────
// What dragging a given hand card up onto the board should actually do, decided
// purely from the card's own name/type — mirrors handlePlayCardButtonClick's own
// dispatch order exactly (immediate-effect names first, then TARGETABLE_TACTICS,
// then Emboscada/unimplemented-Tática rejection, then the plain creature/
// equipment fallthrough) so the two never disagree about what a card does.
// 'place': drop on an empty own slot (plain creature/Relíquia/Terreno).
// 'ownTarget'/'enemyTarget': drop on an occupied own/enemy slot (buffs, equips,
// damage Táticas — see TARGETABLE_TACTICS/EQUIP_ALLOWED_TYPES above).
// 'immediate': no board target at all (resolves or opens a picker on release,
// wherever it's released) — Reformar Linhas, Tributo de Guerra, Trabuco de
// Cerco, and every reveal/search Tática.
// 'blocked': Emboscada or a not-yet-implemented Tática — dragging just surfaces
// the same explanatory toast handlePlayCardButtonClick already shows.
type CardDropKind = 'place' | 'ownTarget' | 'enemyTarget' | 'immediate' | 'blocked';
const ENEMY_TARGET_TACTIC_KINDS = new Set<TacticTargetKind>(['reposicionamento_rapido', 'balesta', 'catapulta']);
const IMMEDIATE_NO_TARGET_CARD_NAMES = new Set([
  'Reformar Linhas', 'Tributo de Guerra', 'Trabuco de Cerco',
  'Retorno do Soldado', 'Graal da Dádiva', 'Doutrina Renovada',
  'Recrutamento Seletivo', 'Recrutar Veteranos', 'Chamado às Armas',
]);
const getCardDropKind = (card: CardData): CardDropKind => {
  if (IMMEDIATE_NO_TARGET_CARD_NAMES.has(card.name)) return 'immediate';
  const tacticKind = TARGETABLE_TACTICS[card.name];
  if (tacticKind) return ENEMY_TARGET_TACTIC_KINDS.has(tacticKind) ? 'enemyTarget' : 'ownTarget';
  if (card.cardType === 'Emboscada' || card.cardType === 'Tática') return 'blocked';
  return 'place';
};

// ── Deck Cardeal Pedro mechanics ─────────────────────────────────────────────
// A first pass at this deck's own abilities — much larger and more varied than
// Deck Capitão's (healing, card draw, summon-on-play, equip-style buffs,
// deck/graveyard search), so this covers what's tractable without a brand new
// subsystem: direct-damage Táticas, the 4 equipment cards (reused as a permanent
// stat stamp via the same targeting flow as Deck Capitão's Táticas, not a real
// attach/detach system), Nobre da Cruzada's summon-on-play, Comandante da Ordem's
// aura, Jorge, Lança Sagrada's splash damage, and Reforços Ocultos' exact ambush
// effect. Cardeal Pedro, Voz da Fé's own heal ability + Cálice da Graça and Recruta
// Devoto's "Ao ser curado" trigger are wired too — see the
// generalAbilityPrompt/pendingGeneralHeal state, activateGeneralHeal/
// resolveGeneralHeal, and playerGeneralAbilityAvailable's "you may activate
// this" prompt on the General slot (Yu-Gi-Oh-style: the game itself notices
// the ability is usable and surfaces it, rather than it just sitting there as
// unusable flavor text). The same prompt pattern now also covers Mercador
// da Cruzada and Cavaleiro Hospitalário (see getPlayerCreatureAbilityKind and their
// activate/resolve functions) — a per-card Sparkles button on their own board
// slot instead of only the General's. Intendente do Exército is a passive
// version of the same "once per turn" idea, piggybacked on the turn-start draw
// effect instead of a button. Infiltrado da Ordem and Fanático da Cruzada's "General
// type" text is handled pragmatically, not with a real faction system — see
// hasEspiaoInVanguarda/hasEspiaoOnBoard and the Fanático da Cruzada comment at its
// attack-time ATK bonus. Atirador da Cruzada's death-trigger draw is hooked into
// every withEquippedWeapons call site (see drawForAtiradorInfluente). Arqueiro
// Profissional's double-attack introduced the game's first "already attacked
// this turn" tracking (playerAttackCounts, reset every player turn; the AI
// just queues two attack actions for it in aiService.ts) — every other unit
// implicitly caps at 1 via the same mechanism now (getMaxAttacksPerTurn).
// Still left as flavor-only: the reveal/search/graveyard-pick Táticas (O
// Soldado Retorna, Graal da Dádiva, Doutrina Renovada, Recrutamento Seletivo,
// Recrutar Veteranos, Chamado às Armas are actually already wired — see
// openCardPicker call sites — so nothing here is left un-wired for lack of a
// picker UI anymore). The AI doesn't know how to pick a target for the
// targeted Táticas — see AI_UNSUPPORTED_TACTICS in aiService.ts, which leaves
// them in its hand rather than wasting them as an inert placed card.

// Any Armamento cards riding along on a unit (see equippedWeapons/CardData) go to
// the graveyard together with it when it dies — nothing strips them off first, so
// every "push these destroyed cards onto the graveyard" site needs to expand
// through this rather than pushing the destroyed unit alone.
const withEquippedWeapons = (cards: CardData[]): CardData[] =>
  cards.flatMap(c => (c.equippedWeapons?.length ? [c, ...c.equippedWeapons] : [c]));

// Applies flat damage to one slot, same simple "hp minus damage, destroyed at 0"
// rule combat uses — but for effects (Trabuco de Cerco/Catapulta de Guerra/Balestra de Precisão/Jorge's splash)
// that hit a slot directly rather than through the normal attacker-vs-defender
// exchange. Returns the updated slots array and, if something died, that card
// (already flagged) for the caller to push onto the graveyard.
const applyDamageToSlot = (
  slots: (CardData | null)[],
  index: number,
  amount: number
): { slots: (CardData | null)[]; destroyed: CardData | null } => {
  const card = slots[index];
  if (!card) return { slots, destroyed: null };
  const next = [...slots];
  const newHp = card.hp - amount;
  if (newHp <= 0) {
    next[index] = null;
    return { slots: next, destroyed: { ...card, hp: newHp, isDestroyed: true } };
  }
  next[index] = { ...card, hp: newHp };
  return { slots: next, destroyed: null };
};

// Comandante da Ordem: "Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK
// e +1 HP durante o combate." A positional aura (must itself be standing in the
// Vanguarda) — the ATK half is folded into getEffectiveAtk below; the HP half is
// its own helper since it's added directly to HP in the combat blocks (same spot
// pendingCombatBonus.hp applies), not a damage-reduction value.
const hasLiderBuff = (card: CardData, ownSlots: (CardData | null)[]): boolean => {
  if (card.cardType !== 'Infantaria' && card.cardType !== 'Arqueiro') return false;
  return [0, 1, 2, 3, 4].some(i => {
    const c = ownSlots[i];
    return c && !c.isDestroyed && c.name === 'Comandante da Ordem';
  });
};
const getAuraCombatHpBonus = (card: CardData, ownSlots: (CardData | null)[]): number =>
  hasLiderBuff(card, ownSlots) ? 1 : 0;

// Infiltrado da Ordem: "Na Vanguarda: impede Emboscadas inimigas." — checked from the
// ATTACKING side (see maybeActivatePlayerAmbush/maybeActivateNpcAmbush) to see
// through the DEFENDER's Emboscada, so this only ever looks at slots 0-4.
const hasEspiaoInVanguarda = (slots: (CardData | null)[]): boolean =>
  [0, 1, 2, 3, 4].some(i => slots[i] && !slots[i]?.isDestroyed && slots[i]?.name === 'Infiltrado da Ordem');
// Infiltrado da Ordem's other half ("Se o General aliado receber dano...") cares about
// it being anywhere on the board, not specifically the Vanguarda — see the General
// damage checks in handleNpcSlotClick and the AI turn loop.
const hasEspiaoOnBoard = (slots: (CardData | null)[]): boolean =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => slots[i] && !slots[i]?.isDestroyed && slots[i]?.name === 'Infiltrado da Ordem');

// Arqueiro da Ordem: "Pode atacar duas vezes por rodada." Every other unit
// still only gets one swing per turn (see playerAttackCounts/handleSlotClick).
const getMaxAttacksPerTurn = (card: CardData): number => card.name === 'Arqueiro da Ordem' ? 2 : 1;

// Nobre da Cruzada: "Ao entrar em campo: invoca Soldados Leais (1 ATK / 2 HP) nos
// slots adjacentes livres da mesma fileira." Called right after ANY card lands on
// a slot (player or AI) — a no-op unless that card is actually Nobre da Cruzada.
const applyNobreReligiosoSummon = (slots: (CardData | null)[], placedIndex: number): (CardData | null)[] => {
  const placed = slots[placedIndex];
  if (!placed || placed.name !== 'Nobre da Cruzada' || placedIndex > 9) return slots;
  const next = [...slots];
  [placedIndex - 1, placedIndex + 1].forEach(j => {
    if (areSlotsAdjacent(placedIndex, j) && !next[j]) {
      next[j] = { id: `soldado_leal_${Date.now()}_${j}`, name: 'Soldado Leal', atk: 1, hp: 2, cost: 0, art: '', effect: '', cardType: 'Infantaria' };
    }
  });
  return next;
};

// Both Generals now come from whichever deck each side is playing (see DECKS
// below) — picked at match start in resetGame, not fixed constants like before.

const SlashEffect = () => (
  <motion.div
    initial={{ scale: 0, opacity: 1, rotateZ: -45 }}
    animate={{ scale: [0, 2, 2.5], opacity: [1, 1, 0] }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
  >
    <div className="w-[200%] h-4 bg-white shadow-[0_0_30px_rgba(255,255,255,1)] rounded-full" />
    <div className="absolute w-[200%] h-2 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] rounded-full" />
  </motion.div>
);

const ExplosionEffect = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
    {/* Explosion */}
    <motion.div
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="absolute flex items-center justify-center"
    >
      <div className="w-32 h-32 bg-orange-500 rounded-full blur-xl mix-blend-screen" />
      <div className="absolute w-24 h-24 bg-yellow-300 rounded-full blur-lg mix-blend-screen" />
      <div className="absolute w-16 h-16 bg-white rounded-full blur-md mix-blend-screen" />
    </motion.div>
    {/* Particles */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{ 
          x: (Math.random() - 0.5) * 300, 
          y: (Math.random() - 0.5) * 300,
          scale: 0,
          opacity: 0
        }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      />
    ))}
  </div>
);

// The on-board Graveyard pile — an empty placeholder box until a card actually dies.
// Shows the actual top (most recently destroyed) card as a real thumbnail now, not
// just its name as plain text — the same CardFace/"popup" variant/box size the card
// play announcement uses (see its own usage further down), since that's already
// tuned for a small, fully-legible card at this exact footprint. Clickable (onClick,
// wired by each call site below) to open the full graveyard browser overlay — the
// pile itself only ever shows the ONE top card, so opening it is the only way to see
// what else has piled up underneath.
const GraveyardPile = ({ cards, onClick }: { cards: CardData[]; onClick?: () => void }) => (
  <div
    className={`w-28 h-36 md:w-36 md:h-48 border-2 border-zinc-700 rounded-xl bg-zinc-900/80 flex items-center justify-center shadow-lg relative overflow-hidden ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
    onClick={onClick}
  >
    {cards.length === 0 ? (
      <span className="text-zinc-600 font-mono text-xs md:text-sm uppercase tracking-widest rotate-90 opacity-50">Cemitério</span>
    ) : (
      <>
        <div className="absolute inset-1 border border-zinc-700 rounded-lg bg-zinc-800/50 translate-x-1 translate-y-1 -z-10" />
        <div className="absolute inset-1 border border-zinc-700 rounded-lg bg-zinc-800/30 translate-x-2 translate-y-2 -z-20" />
        <div className="relative w-[88%] h-[92%]" style={{ filter: CARD_THICKNESS_SHADOW }}>
          <CardFace card={cards[cards.length - 1]} variant="popup" />
        </div>
        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-zinc-400 font-mono text-[6px] md:text-[8px] uppercase tracking-widest text-center py-0.5 z-10 pointer-events-none">
          Cemitério
        </span>
        <span className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-900/90 border border-red-500 text-red-200 text-[9px] md:text-xs font-black rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center z-10 pointer-events-none">
          {cards.length}
        </span>
      </>
    )}
  </div>
);

const AtkBadge = ({ value, className = "" }: { value: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
      <path d="M20 80 L80 20 M20 20 L80 80" stroke="#4a4a4a" strokeWidth="12" strokeLinecap="round" />
      <path d="M50 5 L85 20 L85 60 C85 80 50 95 50 95 C50 95 15 80 15 60 L15 20 Z" fill="#e4e4e7" stroke="#3f3f46" strokeWidth="8" strokeLinejoin="round" />
    </svg>
    <span className="relative z-10 text-zinc-900 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,1)] leading-none">{value}</span>
  </div>
);

// HUD-level HP readout for a General — unlike the plain AtkBadge/other stat
// badges, this one is the player's own life total, so it gets the same
// shake + floating "-N" combat feedback CardSlot gives a damaged board card
// (see its own damageFlash), just self-contained here since a General's HUD
// badge isn't a CardSlot. Purely reactive to `value` dropping between
// renders — whatever combat/Tática/splash source caused it.
const HpBadge = ({ value, className = "" }: { value: number, className?: string }) => {
  const prevValueRef = useRef(value);
  const [damageFlash, setDamageFlash] = useState<{ key: number; amount: number } | null>(null);
  useEffect(() => {
    if (value < prevValueRef.current) {
      setDamageFlash({ key: Date.now(), amount: prevValueRef.current - value });
    }
    prevValueRef.current = value;
  }, [value]);
  useEffect(() => {
    if (!damageFlash) return;
    const t = window.setTimeout(() => setDamageFlash(null), 900);
    return () => clearTimeout(t);
  }, [damageFlash]);

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      animate={{ x: damageFlash ? [0, -6, 6, -4, 4, 0] : 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
        <path d="M50 90 C 50 90, 10 60, 10 30 C 10 10, 35 10, 50 30 C 65 10, 90 10, 90 30 C 90 60, 50 90, 50 90 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="8" strokeLinejoin="round" />
      </svg>
      <span className="relative z-10 text-white font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none">{value}</span>
      {damageFlash && (
        <motion.span
          key={damageFlash.key}
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], y: -22, scale: 1.15 }}
          transition={{ duration: 0.9, ease: 'easeOut', opacity: { times: [0, 0.15, 0.7, 1] } }}
          className="absolute -top-1 left-1/2 -translate-x-1/2 text-red-500 font-black text-xs whitespace-nowrap pointer-events-none z-20"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 6px rgba(239,68,68,0.8)' }}
        >
          -{damageFlash.amount}
        </motion.span>
      )}
    </motion.div>
  );
};

const GoldBadge = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    {/* Scaled up ~18% and cropped by the wrapper's own overflow-hidden — makes the coin
        and plate fill noticeably more of the same box footprint (per the user's ask:
        bigger coin/number "desde que não estoure o tamanho da caixa") instead of
        growing the box itself, which would've thrown off the HUD row's alignment. */}
    <img src={hudGoldBadgeImage} alt="" className="w-full h-auto block scale-[1.18]" draggable={false} />
    <span className="absolute inset-y-0 right-[6%] left-[36%] flex items-center justify-center text-amber-100 font-black text-2xl md:text-3xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-none">
      {value}
    </span>
  </div>
);

// A plain gradient-gold number with a strong drop shadow and no background shape —
// unlike AtkBadge/HpBadge above, this is used INSIDE CardFace, where the
// imported card-template artwork already draws its own coin/blade/shield emblem at
// each of these exact spots; this just fills in the number on top of it.
//
// Self-fitting like FitText below: CardFace renders at several very different
// pixel sizes (a 224px-wide hand card, a small board slot, a 128px card-picker
// option, ...) sharing the same className-driven base font size, so a fixed
// size that looks right on one overflows its coin/blade/heart badge on a
// smaller one. This measures its own box and shrinks (never grows past the
// base size) exactly enough to always fit, on any container size.
const GoldNumber = ({ value, className = "" }: { value: number, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    const fit = () => {
      textEl.style.transform = 'scale(1)';
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleW = containerWidth > 0 && textEl.scrollWidth > containerWidth ? containerWidth / textEl.scrollWidth : 1;
      const scaleH = containerHeight > 0 && textEl.scrollHeight > containerHeight ? containerHeight / textEl.scrollHeight : 1;
      textEl.style.transform = `scale(${Math.min(scaleW, scaleH)})`;
    };
    fit();
    document.fonts?.ready?.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [value]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <span
        ref={textRef}
        className={`font-black leading-none ${className}`}
        style={{
          fontFamily: "'Cinzel', serif",
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FDE08B 30%, #D4AF37 60%, #AA7200 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.8))',
          display: 'inline-block',
          whiteSpace: 'nowrap',
          transformOrigin: 'center',
        }}
      >
        {value}
      </span>
    </div>
  );
};

// CardBack — the card back, wherever a face-down card renders (both deck piles, the
// opponent's hand, the flip a drawn card does on its way into yours).
//
// The artwork's outline is not a rectangle: red ribbons flare past the frame's sides and
// a carved spire juts out top and bottom. So the image is sized for the frame's straight
// BODY to fill the card's slot exactly (the body covers 80.5% x 73.9% of the source, hence
// these percentages) and those flourishes are left to spill past it — which means every
// container rendering this has to stay transparent and must NOT clip, or the overhang is
// sheared off and a box shows up around the card. Same reason the shadow is a drop-shadow
// and not a box-shadow: it has to follow the card's real silhouette, not a rectangle.
const CardBack = ({ offset = 0, brightness = 1, shadow = false }: {
  offset?: number, brightness?: number, shadow?: boolean
}) => {
  const filters = [
    brightness !== 1 ? `brightness(${brightness})` : '',
    shadow ? 'drop-shadow(0 5px 9px rgba(0,0,0,0.55))' : '',
  ].filter(Boolean).join(' ');
  return (
    <img
      src={cardBackplateImage}
      alt=""
      className="absolute pointer-events-none select-none max-w-none"
      style={{
        width: '124.5%',
        height: '135.3%',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50.7%)${offset ? ` translate(${offset}px, ${offset}px)` : ''}`,
        filter: filters || undefined,
      }}
      draggable={false}
    />
  );
};

// Shared "physical thickness" treatment for every rendered card front, per the user's
// own explicit ask for a stronger, exaggerated effect ("cartas muito chapadas... como
// se fosse só um papel") — three progressively darker, hard-edged (zero-blur)
// drop-shadow layers stacked behind the card read as the visible side-edges of a thick
// stack of cardstock, topped with one soft, wide, blurred layer for ambient lift/
// grounding. drop-shadow (not box-shadow) is deliberate: it follows the template art's
// own alpha silhouette (which isn't a plain rectangle — corners, banners, wings stick
// out past a bounding box on some frames) instead of a flat rectangular shadow. Applied
// via inline `style.filter` at every CardFace call site (there's no shared wrapper
// component — CardFace itself renders a bare fragment for its callers to size/position)
// rather than baked into CardFace, since a couple of sites (the equipped-weapon peek,
// this same drop-shadow chained on top of an existing colored glow) need to combine it
// with their own effects.
const CARD_THICKNESS_SHADOW =
  'drop-shadow(1px 1.5px 0 rgba(120,95,55,0.95)) ' +
  'drop-shadow(2.5px 3.5px 0 rgba(90,70,40,0.95)) ' +
  'drop-shadow(4px 5.5px 0 rgba(50,36,18,0.9)) ' +
  'drop-shadow(3px 12px 16px rgba(0,0,0,0.6))';

// CardFace — the shared visual for every place a card's front actually renders (hand,
// board slot, detail modal, the flying/announced overlays): the card-template artwork
// as the frame, the card's own art sitting in the template's cutout window, and the
// name/cost/type/effect/atk/hp positioned at the exact percentages the template was
// painted for. Ported from an earlier full-art version of this project (see
// card-template.webp / card-backplate.webp) — the template image and these
// coordinates are a matched pair, not independently adjustable.
const CARD_FACE_VARIANTS = {
  // combatStat is ATK/HP only — kept separate from stat (cost) so the board's tiny
  // combat numbers can be bumped up for readability without also inflating the gold
  // cost badge, which was never the part users said was hard to read.
  hand:  { name: 'text-lg',                    effect: 'text-[13px]',              type: 'text-[13px]',              stat: 'text-2xl',          combatStat: 'text-2xl' },
  field: { name: 'text-[8px] md:text-[10px]',  effect: 'text-[6px] md:text-[7px]', type: 'text-[7px] md:text-[9px]', stat: 'text-xs md:text-base', combatStat: 'text-base md:text-2xl' },
  modal: { name: 'text-2xl',                   effect: 'text-lg',                 type: 'text-lg',                  stat: 'text-3xl',          combatStat: 'text-3xl' },
  popup: { name: 'text-xs md:text-sm',         effect: 'text-[9px] md:text-[10px]', type: 'text-[9px] md:text-[11px]', stat: 'text-sm md:text-base', combatStat: 'text-sm md:text-base' },
} as const;

// Which physical card-stock a type is printed on. The gold frame has the
// ATK/HP emblem pair baked into its art; the silver and champagne frames don't —
// they carry a single decorative emblem instead, since Tática/Terreno/Emboscada
// cards mostly resolve their effect immediately rather than sitting in combat
// with real stats. Ported from the same full-art commit as the gold frame
// (see card-template.webp) — card-template-silver.webp and
// card-template-champagne.webp are that commit's other two frame variants.
const NO_STAT_TYPES = new Set<CardType>(['Tática', 'Terreno', 'Emboscada']);
const templateForType = (cardType?: CardType) => {
  if (cardType === 'Tática' || cardType === 'Terreno') return cardTemplateSilverImage;
  if (cardType === 'Emboscada') return cardTemplateChampagneImage;
  return cardTemplateImage;
};
const templateForTypeMini = (cardType?: CardType) => {
  if (cardType === 'Tática' || cardType === 'Terreno') return cardTemplateSilverMiniImage;
  if (cardType === 'Emboscada') return cardTemplateChampagneMiniImage;
  return cardTemplateMiniImage;
};

// FitText — shrinks a name's font size (and lets it wrap to a 2nd line) just
// enough that it always fits its container, measured for real off the actual
// rendered pixels rather than guessed from character count. Used to do this
// with a single-line CSS transform:scale instead — that guaranteed the name
// never got visually wider than its box, but a name long enough to need real
// clipping to fit width-only (unlike shorter overflow, which just leaves a
// small scaled-down single line) could still fit width-wise while its own
// scaled box height also shrank, which for a couple of the longer card names
// let the still-single, still-wide line sit close enough to the box's edge
// to read as crowding the coin icon beside it. Binary-searching font-size
// against wrapped height (same technique as FitEffectText below) sidesteps
// that entirely: a name that doesn't fit on one line wraps to a second
// instead of both shrinking AND staying single-line.
const FitText = ({ text, className, style }: { text: string, className?: string, style?: React.CSSProperties }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    // Sets the font size directly on the DOM node instead of going through
    // React state — this re-renders constantly (every animation tick on the
    // board), and a state-driven size kept getting stomped back to its
    // initial value by those re-renders faster than the effect could correct
    // it again.
    const fit = () => {
      const containerHeight = container.clientHeight;
      if (containerHeight <= 0) return;
      textEl.style.fontSize = '';
      const baseFontSize = parseFloat(window.getComputedStyle(textEl).fontSize);
      if (!baseFontSize) return;
      // Binary search the largest multiplier of the base font size, capped at
      // 1x, whose real wrapped height still fits — same cap/rationale as
      // FitEffectText, so a short name never renders bigger than a long one.
      let lo = 0.3, hi = 1.0;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        textEl.style.fontSize = `${baseFontSize * mid}px`;
        if (textEl.scrollHeight <= containerHeight) lo = mid; else hi = mid;
      }
      textEl.style.fontSize = `${baseFontSize * lo}px`;
    };
    fit();
    // Re-measure once the real font is done loading — measuring against the
    // fallback font (during the @font-face swap window) would bake in a size
    // fit to the wrong glyph metrics.
    document.fonts?.ready?.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <span
        ref={textRef}
        className={className}
        style={{ ...style, display: 'block', textAlign: 'center' }}
      >
        {text}
      </span>
    </div>
  );
};

// Same idea as FitText but for the effect-text box, which wraps across several lines
// instead of staying on one — a long ability description (e.g. Comandante Aurelion's
// "Após Remanejamento: até 2 unidades... Passiva: unidades adjacentes recebem -1 de
// dano.") used to just get sliced off by the box's overflow-hidden once it ran past
// its fixed height. Text already wraps to the container's width on its own, so this
// grows to fill the box when there's room to spare (a short effect used to always
// render at the same small base size, leaving a lot of visibly empty parchment
// below it) and still shrinks exactly as before when the wrapped block runs
// taller than its box. Unlike FitText's plain CSS-transform scale (fine for a
// single line), this changes the real font-size and lets the browser re-wrap at
// each candidate size — a transform-scale big enough to fill vertical space would
// also stretch each already-wrapped line past the box horizontally.
const FitEffectText = ({ text, className, style, align = 'center' }: { text: string, className?: string, style?: React.CSSProperties, align?: 'center' | 'start' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    const fit = () => {
      const containerHeight = container.clientHeight;
      if (containerHeight <= 0) return;
      textEl.style.fontSize = '';
      const baseFontSize = parseFloat(window.getComputedStyle(textEl).fontSize);
      if (!baseFontSize) return;
      // Binary search the largest multiplier of the base font size, capped at
      // 1x — never enlarged past the declared size for short text, so every
      // card's rules text reads at the same size instead of a short effect
      // looking bigger than a long one. Still shrinks below 1x as a fallback
      // for text too long to fit at the declared size.
      let lo = 0.3, hi = 1.0;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        textEl.style.fontSize = `${baseFontSize * mid}px`;
        if (textEl.scrollHeight <= containerHeight) lo = mid; else hi = mid;
      }
      textEl.style.fontSize = `${baseFontSize * lo}px`;
    };
    fit();
    document.fonts?.ready?.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [text]);

  // 'start' — the Full Art plate's own Yu-Gi-Oh-style flow: text begins at the
  // top-left and wraps normally left-to-right instead of centering as a block,
  // fitting more characters into the same box than a centered paragraph would.
  // 'center' (default) is the Padrão layout's existing look — unchanged.
  return (
    <div ref={containerRef} className={`w-full h-full flex overflow-hidden ${align === 'start' ? 'items-start justify-start' : 'items-center justify-center'}`}>
      <p ref={textRef} className={className} style={{ ...style, margin: 0 }}>
        {text}
      </p>
    </div>
  );
};

// Full Art layout — General/Relíquia (and, for now, any other card testing this
// print — see CardData.isFullArt) skip the Padrão frame entirely: the art fills
// almost the whole card behind a dedicated frame (card-template-fullart-gold),
// name/cost sit in its own top bar instead of a parchment name-plate. The frame
// image itself has no baked-in text plate for type/effect (its cutout is one
// plain window), so that plate is drawn entirely in code on top of the art —
// a darkened panel over the art's lower third, same idea as the reference
// mockup for this frame family (Comandante Aurelion) the user provided. Same
// GoldNumber/FitText/FitEffectText building blocks as the Padrão layout below,
// just placed for this frame's own window/badge coordinates (measured off
// reference/full-art-frame-gold-v1.png).
// The type/effect plate's own text sizes — deliberately a notch below
// CARD_FACE_VARIANTS' hand/modal sizes (built for the Padrão layout's wider
// parchment box): the reference mockup for this frame (Comandante Aurelion)
// runs noticeably smaller type, since the plate itself sits over the art
// rather than getting its own dedicated card real estate.
const FULL_ART_PLATE_VARIANTS = {
  hand:  { type: 'text-[10px]',                       effect: 'text-[11px]' },
  field: { type: 'text-[5px] md:text-[6px]',          effect: 'text-[4px] md:text-[5px]' },
  modal: { type: 'text-sm',                           effect: 'text-sm' },
  popup: { type: 'text-[8px] md:text-[9px]',          effect: 'text-[8px] md:text-[9px]' },
} as const;

const CardFaceFullArt = ({ card, variant = 'hand' }: { card: CardData, variant?: keyof typeof CARD_FACE_VARIANTS }) => {
  const v = CARD_FACE_VARIANTS[variant];
  const pv = FULL_ART_PLATE_VARIANTS[variant];
  const showStats = !NO_STAT_TYPES.has(card.cardType as CardType);
  return (
    // Everything — art, frame image, and every badge/text box — shares this one
    // oversized, shifted coordinate space (same trick the Padrão layout below
    // uses for its own template). The frame's illustration doesn't reach its own
    // canvas edges — median-sampled off its actual alpha, the real border sits
    // inset ~4% left/right, ~5.1% top, ~6.9% bottom — so rendering it at a plain
    // 100%/100% left a visible gap of card-colored nothing (the modal backdrop)
    // between the border and the card's real edge, on every side. Blowing this
    // whole layer up by those margins' inverse and recentering makes the actual
    // border touch the true edges, exactly like the Padrão frame does. Every
    // child below keeps the plain percentages already measured straight off the
    // frame image's own raw canvas — they don't change, only this wrapper does.
    <div className="absolute pointer-events-none" style={{ width: '108.2%', height: '113.2%', top: '50%', left: '50%', transform: 'translate(-50%, -49.1%)' }}>
      <div className="absolute overflow-hidden" style={{ left: '10.2%', top: '15.4%', width: '79.4%', height: '73.4%' }}>
        {card.art ? (
          <img src={card.art} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
        )}
      </div>

      {/* Type + effect plate — sits behind the frame image (below it in this
          stacking order) and in front of the art, so the frame's own opaque
          artwork (the shields' star ornaments, the side rails) naturally
          masks off whatever part of this plain rectangle would otherwise sit
          under it, exactly like the reference mockup: no manual clipping or
          chamfering needed, the frame does that for free. Height is capped at
          75% though (not just left to fill available room) — that masking
          cuts both ways: the shields' stars start crossing the plate's own
          10.5%/89.5% edges around 74-76% down the card, and text that grows
          down into that band gets its own edge characters masked away by the
          same opaque artwork, not just the background behind them. */}
      {card.effect && (
        <div className="absolute flex flex-col items-center px-2 pt-1.5 pb-1" style={{ left: '10.5%', right: '10.5%', top: '56%', height: '19%', background: 'linear-gradient(to bottom, rgba(15,12,6,0.28), rgba(10,8,4,0.42) 35%, rgba(8,6,3,0.48))' }}>
          {card.cardType && (
            <>
              <span className={`${pv.type} font-black uppercase tracking-widest shrink-0`} style={{ fontFamily: "'Cinzel', serif", color: '#e9d8a6' }}>
                {card.cardType}
              </span>
              <div className="w-2/3 h-px shrink-0 my-1" style={{ background: 'rgba(201,162,39,0.6)' }} />
            </>
          )}
          {/* Yu-Gi-Oh-style body: flows left-to-right from the top-left corner
              instead of centering as a block, so the plate's own full width and
              height actually get used — a centered block wastes the space a
              ragged edge would've used for more characters at a readable size. */}
          <div className="flex-1 w-full min-h-0">
            <FitEffectText
              text={card.effect}
              align="start"
              className={`${pv.effect} text-left leading-snug`}
              style={{ fontFamily: "'PT Serif', serif", color: '#f3e6c8' }}
            />
          </div>
        </div>
      )}

      <img src={cardTemplateFullArtGoldImage} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" draggable={false} />

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Name — sits on the frame's own dark top bar. Re-checked against the
            bar's actual dark fill (not just its outer gold trim): it runs from
            ~9% to ~71% (where the coin medallion starts), vertically ~8.5%-14% —
            the box now matches that instead of a slightly-off guess. */}
        <div className="absolute px-1 flex items-center" style={{ top: '8.5%', left: '9%', width: '62%', height: '5.5%' }}>
          <FitText
            text={card.name}
            className={`${v.name} font-bold uppercase tracking-tight`}
            style={{ fontFamily: "'Cinzel', serif", color: '#f5deA0', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
          />
        </div>

        {/* Cost — NOT inside the round medallion (that's a solid decorative coin,
            no room for a digit) but in the separate small dark plate immediately
            to its right, same idea as the Padrão layout's own coin+number pair.
            Pixel-checked against that plate's actual dark fill: x ~83.5%-91.5%,
            y ~9.3%-13.8%. */}
        <div className="absolute flex items-center justify-center" style={{ left: '83.5%', top: '9.3%', width: '8%', height: '4.5%' }}>
          <GoldNumber value={card.cost} className={v.stat} />
        </div>

        {/* ATK/HP — the frame's own black shield (left) and red heart shield
            (right). Nudged up slightly one more time per the user's final
            call after comparing the last deploy against the live card. */}
        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '16%', top: '85.7%', width: '14%', height: '11%', transform: 'translate(-50%, -50%)' }}>
              <GoldNumber value={card.atk} className={v.combatStat} />
            </div>
            <div className="absolute flex items-center justify-center" style={{ left: '84%', top: '85.7%', width: '14%', height: '11%', transform: 'translate(-50%, -50%)' }}>
              <GoldNumber value={card.hp} className={v.combatStat} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Per-type frame/art-window geometry for CardFaceFullArtMini. The Tática and
// Emboscada frames are separate assets from the creature one (own art,
// generated independently) so neither their outer bleed margin nor their art
// window lines up with the gold frame's own numbers by coincidence — each
// was measured off that frame's own alpha (largest-connected-component of
// the chroma-keyed transparent area, same technique as the general-frame
// asset from earlier in this project) rather than reused from the gold one.
// left/top here are negative-inset absolute values (a plain left/top/width/
// height box), not the gold frame's original top:50%/left:50%/translate(-50%,Y%)
// centering — the two are equivalent (this is that math already resolved to
// its rendered position), just simpler to add new entries to.
type FullArtMiniConfig = {
  image: string;
  wrapper: { left: string; top: string; width: string; height: string };
  art: { left: string; top: string; width: string; height: string };
};
const FULL_ART_MINI_CONFIG: Record<string, FullArtMiniConfig> = {
  Tática: {
    image: cardFullArtFrameTaticaImage,
    wrapper: { left: '-0.49%', top: '-0.61%', width: '100.99%', height: '103.71%' },
    art: { left: '9.77%', top: '15.43%', width: '80.86%', height: '72.72%' },
  },
  Emboscada: {
    image: cardFullArtFrameEmboscadaImage,
    wrapper: { left: '-0.79%', top: '-0.98%', width: '101.585%', height: '107.793%' },
    art: { left: '9.96%', top: '15.36%', width: '79.88%', height: '69.40%' },
  },
};
const FULL_ART_MINI_DEFAULT: FullArtMiniConfig = {
  image: cardTemplateFullArtGoldImage,
  wrapper: { left: '-4.1%', top: '-5.58%', width: '108.2%', height: '113.2%' },
  art: { left: '10.2%', top: '15.4%', width: '79.4%', height: '73.4%' },
};
const fullArtMiniConfigForType = (cardType?: CardType): FullArtMiniConfig =>
  FULL_ART_MINI_CONFIG[cardType ?? ''] ?? FULL_ART_MINI_DEFAULT;

// Mini counterpart of CardFaceFullArt, for board cards whose art is the
// full-art print (see CardData.isFullArt) — same frame image, same art
// window and name/cost/ATK-HP coordinates (nothing needed rescaling: unlike
// the Padrão mini below, this frame isn't a physically-shortened image, just
// the same one shrunk further, so its own percentages still line up as-is),
// just the type/effect plate dropped entirely so the art runs straight from
// the name bar into the shields. A full-art card forced through the Padrão
// mini's frame would put its full-bleed art behind that frame's much
// smaller art window instead — wrong crop, wrong proportions. Tática/
// Emboscada get their own frame (see FULL_ART_MINI_CONFIG) instead of the
// creature one — that one's baked-in ATK/HP shield sockets made no sense on
// a card type that never shows stats (see NO_STAT_TYPES).
const CardFaceFullArtMini = ({ card }: { card: CardData }) => {
  const showStats = !NO_STAT_TYPES.has(card.cardType as CardType);
  const cfg = fullArtMiniConfigForType(card.cardType);
  return (
    <div className="absolute pointer-events-none" style={{ ...cfg.wrapper }}>
      <div className="absolute overflow-hidden" style={{ ...cfg.art }}>
        {card.art ? (
          <img src={card.art} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
        )}
      </div>
      <img src={cfg.image} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" draggable={false} />
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute px-1 flex items-center" style={{ top: '8.5%', left: '9%', width: '62%', height: '5.5%' }}>
          <span
            className="block w-full truncate text-center text-[7px] md:text-[9px] font-bold uppercase tracking-tight"
            style={{ fontFamily: "'Cinzel', serif", color: '#f5deA0', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
          >
            {card.name}
          </span>
        </div>

        <div className="absolute flex items-center justify-center" style={{ left: '83.5%', top: '9.3%', width: '8%', height: '4.5%' }}>
          <span className="font-black text-xs md:text-base" style={{ fontFamily: "'Cinzel', serif", color: '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
            {card.cost}
          </span>
        </div>

        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '16%', top: '85.7%', width: '14%', height: '11%', transform: 'translate(-50%, -50%)' }}>
              <span className="font-black text-base md:text-xl" style={{ fontFamily: "'Cinzel', serif", color: '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
                {card.atk}
              </span>
            </div>
            <div className="absolute flex items-center justify-center" style={{ left: '84%', top: '85.7%', width: '14%', height: '11%', transform: 'translate(-50%, -50%)' }}>
              <span className="font-black text-base md:text-xl" style={{ fontFamily: "'Cinzel', serif", color: '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
                {card.hp}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CARD_FACE_MINI_STD_SCALE = 1536 / 1271;
const CardFaceStandardMini = ({ card }: { card: CardData }) => {
  const showStats = !NO_STAT_TYPES.has(card.cardType as CardType);
  const s = CARD_FACE_MINI_STD_SCALE;
  return (
    <>
      <div
        className="absolute pointer-events-none"
        style={{ width: '122%', height: '145.5%', top: '50%', left: '50%', transform: 'translate(-50%, -46%)' }}
      >
        <div className="absolute overflow-hidden" style={{ left: '11.52%', top: `${17.64 * s}%`, width: '76.95%', height: `${31.83 * s}%` }}>
          {card.art ? (
            <img src={card.art} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
          )}
        </div>
        <img src={templateForTypeMini(card.cardType)} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" draggable={false} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute px-1 flex items-center" style={{ top: '3%', left: '12%', right: '26%', height: `${8 * s}%` }}>
          {/* A single truncated line, not FitText's shrink-and-wrap — this bar
              is only ~7px tall at mini scale, nowhere near enough height for
              a wrapped 2nd line (a long name like "Mercador da Cruzada" wrapped
              and overflowed past the plate). Every name is still fully
              readable from the tap-to-expand preview this mini card opens. */}
          <span
            className="block w-full truncate text-center text-[7px] md:text-[9px] font-bold uppercase tracking-tight"
            style={{ fontFamily: "'Cinzel', serif", color: '#2a1605', textShadow: '0 1px 0 rgba(255,243,206,0.55)' }}
          >
            {card.name}
          </span>
        </div>

        {/* Plain text + textShadow instead of GoldNumber — cost/atk/hp here
            are always 1-2 digits in a fixed-size box, so GoldNumber's own
            ResizeObserver-driven shrink-to-fit (built for names/effect text
            of unpredictable length) is more machinery than this needs. */}
        <div className="absolute flex items-center justify-center" style={{ left: '92%', top: '8%', width: '16%', height: `${9 * s}%`, transform: 'translate(-50%, -50%)' }}>
          <span className="font-black text-xs md:text-base" style={{ fontFamily: "'Cinzel', serif", color: '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
            {card.cost}
          </span>
        </div>

        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '11%', top: '88%', width: '20%', height: '12%', transform: 'translate(-50%, -50%)' }}>
              <span className="font-black text-base md:text-xl" style={{ fontFamily: "'Cinzel', serif", color: '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
                {card.atk}
              </span>
            </div>
            <div className="absolute flex items-center justify-center" style={{ left: '89%', top: '88%', width: '20%', height: '12%', transform: 'translate(-50%, -50%)' }}>
              <span className="font-black text-base md:text-xl" style={{ fontFamily: "'Cinzel', serif", color: '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
                {card.hp}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const CardFace = ({ card, variant = 'hand' }: { card: CardData, variant?: keyof typeof CARD_FACE_VARIANTS }) => {
  const v = CARD_FACE_VARIANTS[variant];
  const showStats = !NO_STAT_TYPES.has(card.cardType as CardType);
  if (card.isFullArt) return <CardFaceFullArt card={card} variant={variant} />;
  return (
    <>
      {/* Art + frame share one oversized, shifted coordinate space because the template
          art itself has an ambient glow bleeding past the card's real edges. Both
          layers use the exact same box so the art aligns perfectly with the
          template's transparent cutout window. */}
      <div
        className="absolute pointer-events-none"
        style={{ width: '122%', height: '145.5%', top: '50%', left: '50%', transform: 'translate(-50%, -46%)' }}
      >
        <div className="absolute overflow-hidden" style={{ left: '11.52%', top: '17.64%', width: '76.95%', height: '31.83%' }}>
          {card.art ? (
            <img src={card.art} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" />
          )}
        </div>
        <img src={templateForType(card.cardType)} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" draggable={false} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Name — FitText shrinks/wraps long names (see its own comment) instead of
            truncating them with an ellipsis, so the full name is always readable.
            Right edge pulled back from 22% to 26% — pixel-checked against the coin
            badge's own art (accounting for this template's oversize transform above):
            its decorative structure actually starts around 75-76%, well before the
            cost number's own 84% box, so 78% (100-22) was landing text right on it. */}
        <div className="absolute px-1" style={{ top: '0%', left: '12%', right: '26%', height: '8%' }}>
          <FitText
            text={card.name}
            // The name plate and type ribbon are pale parchment, so the text on them is
            // dark ink, not gold — light-on-light was the reason they were hard to read.
            // The highlight underneath gives it the engraved-into-the-plate look.
            className={`${v.name} font-bold uppercase tracking-tight`}
            style={{ fontFamily: "'Cinzel', serif", color: '#2a1605', textShadow: '0 1px 0 rgba(255,243,206,0.55)' }}
          />
        </div>

        {/* Cost (Ouro) — mapped to the template's round cutout, top-right. Explicit
            width/height (not just left/top) so GoldNumber above has a real box to
            measure itself against and shrink to fit, same as the ATK/HP badges below. */}
        <div className="absolute flex items-center justify-center" style={{ left: '92%', top: '2.5%', width: '16%', height: '9%', transform: 'translate(-50%, -50%)' }}>
          <GoldNumber value={card.cost} className={v.stat} />
        </div>

        {/* Card type — the gold ribbon between art and rules text */}
        {card.cardType && (
          <div className="absolute flex items-center justify-center px-1 overflow-hidden" style={{ top: '56%', left: '12%', right: '12%', height: '7%' }}>
            <span
              className={`${v.type} font-black uppercase tracking-widest truncate w-full text-center`}
              style={{
                fontFamily: "'Cinzel', serif",
                color: card.cardType === 'Relíquia' ? '#6b3f00' : card.cardType === 'Terreno' ? '#17502a' : '#3a2408',
                textShadow: '0 1px 0 rgba(255,243,206,0.55)',
              }}
            >
              {card.cardType}
            </span>
          </div>
        )}

        {/* Effect — the parchment text area. Yu-Gi-Oh-style flow (left-to-right
            from the top-left corner, not centered as a block) like the Full
            Art plate — same FitEffectText 'start' alignment, just still in
            this layout's own existing parchment box instead of a new one.
            Widened toward the left (11%→8%) for a bit more room per line;
            bottom pulled up (10%→13%) so it can't run into the ATK/HP blade
            and heart emblems, whose own box starts around 89% down the card. */}
        <div className="absolute p-1" style={{ top: '64%', bottom: '13%', left: '8%', right: '11%' }}>
          <FitEffectText
            text={card.effect}
            align="start"
            className={`${v.effect} text-[#0d0901] font-semibold text-left leading-tight`}
            style={{ fontFamily: "'Crimson Pro', serif" }}
          />
        </div>

        {/* ATK/HP — blade + heart emblems, only on the gold frame (see NO_STAT_TYPES) */}
        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '1%', bottom: '-2%', width: '20%', height: '13%' }}>
              <GoldNumber value={card.atk} className={v.combatStat} />
            </div>
            <div className="absolute flex items-center justify-center" style={{ right: '0%', bottom: '-2%', width: '20%', height: '13%' }}>
              <GoldNumber value={card.hp} className={v.combatStat} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

// The board art used to be two separate images — one for the playing surface
// inside the bordered board frame, one for the space around it — that had to
// visually match up at the seam. That never worked well (see art-prompts/
// README.md, "3d"), so it's now a single full-screen battlefield image (both
// front lines AND the ground between them, top to bottom); the interior board
// frame has no image, border, or darkening tint of its own anymore, just a
// transparent window onto this same background (see the "3D Board" comment
// further down — its own separate tint used to make that box read as visibly
// darker than the rest of the art, like a leftover seam from the old two-image
// split, even though there's nothing left to seam against).
const BOARD_EXTERIOR_ART_URL = boardBattlefieldImage;

// How big the previewed card renders while parked at the edge during slot selection.
// The game is played almost entirely on phones, so legibility there matters more than
// avoiding every last bit of overlap with the board.
const FIELD_PREVIEW_SCALE = { mobile: 0.95, desktop: 0.95 };

// A single tap on a hand card used to just nudge it up slightly in place (scale
// 1.1) — reading it meant a separate "i" button opening a whole different, much
// bigger modal. Tapping now renders a fixed, top-level floating copy instead (see
// the "Hand card tap preview" overlay further down) — NOT an in-place enlarge of
// the real card, which lives inside the hand tray's own transformed stacking
// context and could end up rendering underneath an already-played board card
// sitting at the same screen position. A fixed/high-z overlay sidesteps that
// entirely — this same floating copy IS the "selected" representation of the card
// (see handleCardClick/getPlayerSlotHint): tapping a highlighted board destination
// next plays it. It shares FIELD_PREVIEW_SCALE (just above) and parks at the same
// left edge as the old drag-flow's in-hand preview used to — selection now lasts
// as long as the player is choosing a destination, not just a brief drag, so a
// centered/full-size preview spent that whole time blocking the board underneath.
// Board cards (see the "Board card preview" overlay) get their own, separate,
// slightly smaller scale — they're read-only previews, never dragged, so there's
// no ghost/ArrasteParaJogar hint competing for space around them.
const BOARD_PREVIEW_SCALE = 1.25;

// Hand fan layout: cards spread across a modest total angle, center card slightly raised.
const FAN_SPREAD_DEG = 26;
const FAN_LIFT_PX = 20;
const HAND_CARD_WIDTH = 224; // w-56
const HAND_CARD_HEIGHT = 320; // h-80
// Cards overlap like a real hand of cards instead of sitting apart with a gap —
// each card only advances this much past the previous one.
const HAND_CARD_STEP = HAND_CARD_WIDTH * 0.5;

// ── DECK CAPITÃO ────────────────────────────────────────────────────────────
// Ported from the earlier full-art version of this project (commit 8a3d7b8,
// constant DECK_1) — its own General, Criaturas, Táticas, Emboscadas, one
// Relíquia and two Terrenos. Every ability here is wired up now (move/swap
// rules, the +1/-1 ATK auras, the reposition Táticas, the 3 Emboscadas —
// search this file for each card's name to find its logic). The one gap is
// the AI: it doesn't reposition units at all, so the move-triggered
// abilities (Capitão de Formação, Batedor, Cavaleiro Tático's wider swap,
// Aurelion's own active ability) only ever fire for the player, and the
// targeted Táticas are left in the AI's hand entirely (see
// AI_UNSUPPORTED_TACTICS in aiService.ts) rather than risk it wasting them.
const DECK_CAPITAO: CardData[] = [
  { id: 'gen1', name: 'Comandante Aurelion, Mestre da Formação', atk: 0, hp: 20, cost: 0, art: '', effect: 'Após Remanejamento: até 2 unidades que se moveram ganham +1/+1 no próximo combate. Passiva: unidades adjacentes recebem -1 de dano.', cardType: 'General' },

  // Criaturas (27)
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_tactical_soldier_${i}`, name: 'Soldado Tático', atk: 3, hp: 3, cost: 2, art: '', effect: 'Troca com aliado adjacente no fim do turno.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_line_squire_${i}`, name: 'Escudeiro de Linha', atk: 2, hp: 4, cost: 2, art: '', effect: 'Protege unidades atrás.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_formation_captain_${i}`, name: 'Capitão de Formação', atk: 3, hp: 4, cost: 3, art: '', effect: 'Ao mover: adjacentes +1 ATK.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_scout_${i}`, name: 'Batedor', atk: 1, hp: 2, cost: 1, art: '', effect: 'Move após combate.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_control_lancer_${i}`, name: 'Lanceiro de Controle', atk: 3, hp: 2, cost: 2, art: '', effect: 'Inimigo à sua frente recebe -1 ATK.', cardType: 'Infantaria' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `c_tactical_knight_${i}`, name: 'Cavaleiro Tático', atk: 4, hp: 4, cost: 3, art: '', effect: 'Troca com qualquer aliado na linha.', cardType: 'Cavalaria' })),
  ...Array(3).fill(null).map((_, i): CardData => ({ id: `c_veteran_${i}`, name: 'Veterano de Guerra', atk: 4, hp: 3, cost: 3, art: '', effect: '+2 ATK na coluna 3.', cardType: 'Infantaria' })),

  // Táticas (20)
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_reform_lines_${i}`, name: 'Reformar Linhas', atk: 0, hp: 0, cost: 2, art: '', effect: 'Reorganiza até 3 unidades.', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_coordinated_advance_${i}`, name: 'Avanço Coordenado', atk: 0, hp: 0, cost: 2, art: '', effect: 'Após mover: +2 ATK.', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_quick_reposition_${i}`, name: 'Reposicionamento Rápido', atk: 0, hp: 0, cost: 1, art: '', effect: 'Move inimigo 1 slot.', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_closed_line_${i}`, name: 'Linha Fechada', atk: 0, hp: 0, cost: 2, art: '', effect: 'Adjacentes recebem menos dano.', cardType: 'Tática' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `t_retreat_order_${i}`, name: 'Ordem de Retirada', atk: 0, hp: 0, cost: 2, art: '', effect: 'Move para a Retaguarda + cura.', cardType: 'Tática' })),

  // Emboscadas (12)
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `a_instant_block_${i}`, name: 'Bloqueio Instantâneo', atk: 0, hp: 0, cost: 2, art: '', effect: 'Cancela ataque se houver adjacente.', cardType: 'Emboscada' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `a_counter_maneuver_${i}`, name: 'Contra-Manobra', atk: 0, hp: 0, cost: 3, art: '', effect: 'Troca posições durante o ataque.', cardType: 'Emboscada' })),
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `a_broken_formation_${i}`, name: 'Formação Quebrada', atk: 0, hp: 0, cost: 2, art: '', effect: 'Move inimigo aleatoriamente.', cardType: 'Emboscada' })),

  // Relíquia (1)
  { id: 'relic_banner_0', name: 'Estandarte da Legião', atk: 0, hp: 5, cost: 3, art: '', effect: 'Permanente. Todas as unidades aliadas ganham +1 ATK enquanto esta relíquia estiver no campo.', cardType: 'Relíquia', isFullArt: true },

  // Terrenos (2)
  { id: 'terrain_fortress_0', name: 'Fortaleza de Pedra', atk: 0, hp: 8, cost: 3, art: '', effect: 'Permanente. Unidades aliadas na Retaguarda recebem -1 de dano de ataques inimigos.', cardType: 'Terreno' },
  { id: 'terrain_swamp_0', name: 'Pântano Maldito', atk: 0, hp: 6, cost: 2, art: '', effect: 'Permanente. Unidades inimigas na Vanguarda sofrem -1 ATK enquanto este terreno estiver no campo.', cardType: 'Terreno' },
];

// ── DECK CARDEAL PEDRO ──────────────────────────────────────────────────────
// Ported from the same commit (constant DECK_CARDEAL). Every card there had
// its own unique ability keyed by `effectKey` (heal, draw, summon, buff on
// equip...) — none of that runs yet, same flavor-text-only scope as above.
// Three of the old commit's card types don't exist in this game's CardType
// union: Leve and Plebeu fold into Infantaria (they're stat-bearing frontline
// bodies same as any other Infantaria card), and Armamento (equipment) folds
// into Tática (a 0/0 card whose whole point is its one-time effect).
const DECK_CARDEAL: CardData[] = [
  { id: 'cardeal_gen', name: 'Cardeal Pedro, Voz da Fé', atk: 0, hp: 20, cost: 0, art: cardealPedroFullArt, effect: 'Fase Principal: cure 1 HP em um soldado aliado. Pague 1 ouro para curar 3 HP em vez disso.', cardType: 'General', isFullArt: true },
  { id: 'cardeal_relic', name: 'Cálice da Graça', atk: 0, hp: 5, cost: 3, art: caliceDaVidaFullArt, effect: 'Permanente. Permite que o General Cardeal Pedro use sua habilidade duas vezes por turno.', cardType: 'Relíquia', isFullArt: true },

  // Plebeus → Infantaria
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `cardeal_fiel_${i}`, name: 'Devotos da Cruzada', atk: 0, hp: 3, cost: 1, art: multidaoDeFieisArt, effect: '—', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_comerciante_${i}`, name: 'Mercador da Cruzada', atk: 1, hp: 1, cost: 1, art: comercianteDasCruzadasArt, effect: 'Uma vez por turno: veja as 2 cartas do topo do deck. Adicione 1 à mão e coloque a outra no fundo.', cardType: 'Infantaria' })),

  // Infantaria
  { id: 'cardeal_espiao', name: 'Infiltrado da Ordem', atk: 1, hp: 2, cost: 1, art: espiaoSabotadorArt, effect: 'Na Vanguarda: impede Emboscadas inimigas. Se o General aliado receber dano, no próximo turno não poderá usar sua habilidade.', cardType: 'Infantaria' },
  { id: 'cardeal_fanatico', name: 'Fanático da Cruzada', atk: 1, hp: 2, cost: 1, art: soldadoFanaticoArt, effect: 'Ao atacar: se o General inimigo for de tipo oposto, ganha +2 ATK.', cardType: 'Infantaria' },
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_aprendiz_${i}`, name: 'Recruta Devoto', atk: 0, hp: 2, cost: 1, art: recrutaDevotoArt, effect: 'Ao ser curado: recebe +1 ATK permanente.', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_vigia_${i}`, name: 'Intendente do Exército', atk: 2, hp: 3, cost: 2, art: vigiaDeMantimentosArt, effect: 'Uma vez por turno: se você tiver menos de 2 cartas na mão, compre até ficar com 2.', cardType: 'Infantaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_inf_treinada_${i}`, name: 'Soldados da Ordem', atk: 3, hp: 5, cost: 2, art: infantariaTreinadaArt, effect: '—', cardType: 'Infantaria' })),

  // Cavaleiros
  // Same Full Art testing swap as Nobre da Cruzada/Comandante da Ordem/Cavaleiro
  // da Luz/Trabuco de Cerco/Retorno do Soldado above.
  ...Array(3).fill(null).map((_, i): CardData => ({ id: `cardeal_jorge_${i}`, name: 'Jorge, Lança Sagrada', atk: 4, hp: 6, cost: 3, art: jorgeOLanceiroFullArt, isFullArt: true, effect: 'Ao atacar a Vanguarda: causa 2 de dano à unidade na Retaguarda da mesma coluna.', cardType: 'Cavalaria' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_hosp_${i}`, name: 'Cavaleiro Hospitalário', atk: 2, hp: 4, cost: 2, art: hospitalarioArt, effect: 'Uma vez por turno: cure 1 HP de um aliado e cause 1 de dano a um inimigo na Vanguarda.', cardType: 'Cavalaria' })),
  // Testing the Full Art print for this card (see CardFaceFullArt) instead of its
  // Padrão one now that both exist — once boosters exist this becomes a real
  // per-copy choice instead of swapping the one CardData entry's own art/isFullArt.
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_nobre_${i}`, name: 'Nobre da Cruzada', atk: 4, hp: 5, cost: 3, art: nobreReligiosoFullArt, isFullArt: true, effect: 'Ao entrar em campo: invoca Soldados Leais (1 ATK / 2 HP) nos slots adjacentes livres da mesma fileira.', cardType: 'Cavalaria' })),
  // Same Full Art testing swap as Nobre da Cruzada/Comandante da Ordem above.
  ...Array(4).fill(null).map((_, i): CardData => ({ id: `cardeal_cavaleiro_${i}`, name: 'Cavaleiro da Luz', atk: 5, hp: 7, cost: 3, art: cavaleiroDaLuzFullArt, isFullArt: true, effect: '—', cardType: 'Cavalaria' })),
  // Same Full Art testing swap as Nobre da Cruzada above.
  { id: 'cardeal_lider', name: 'Comandante da Ordem', atk: 5, hp: 5, cost: 3, art: liderDeEsquadraoFullArt, isFullArt: true, effect: 'Na Vanguarda: Infantaria e Arqueiros aliados ganham +1 ATK e +1 HP durante o combate.', cardType: 'Cavalaria' },

  // Arqueiros
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_arq_pro_${i}`, name: 'Arqueiro da Ordem', atk: 1, hp: 4, cost: 2, art: arqueiroProfissionalArt, effect: 'Pode atacar duas vezes por rodada.', cardType: 'Arqueiro' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_atirador_${i}`, name: 'Atirador da Cruzada', atk: 1, hp: 3, cost: 2, art: atiradorInfluenteArt, effect: 'Ao ir ao cemitério: compre 3 cartas.', cardType: 'Arqueiro' })),

  // Táticas de dano
  // Same Full Art testing swap as Nobre da Cruzada/Comandante da Ordem above —
  // both Padrão and Full Art exist for this one, using Full Art for now.
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_trabuco_${i}`, name: 'Trabuco de Cerco', atk: 0, hp: 0, cost: 3, art: trabucoDeCercoFullArt, isFullArt: true, effect: 'Causa 2 de dano a TODAS as unidades inimigas.', cardType: 'Tática' })),
  ...Array(3).fill(null).map((_, i): CardData => ({ id: `cardeal_catapulta_${i}`, name: 'Catapulta de Guerra', atk: 0, hp: 0, cost: 2, art: catapultaDeGuerraArt, effect: 'Escolha uma fileira inimiga. Todas as unidades naquela fileira recebem 2 de dano.', cardType: 'Tática' })),
  { id: 'cardeal_balesta', name: 'Balestra de Precisão', atk: 0, hp: 0, cost: 1, art: balestraDePrecisaoArt, effect: 'Causa 3 de dano a uma unidade inimiga à sua escolha.', cardType: 'Tática' },

  // Armamentos → Tática
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_armadura_${i}`, name: 'Armadura de Guerra', atk: 0, hp: 0, cost: 1, art: armaduraDeGuerraArt, effect: 'Infantaria equipada recebe +2 HP.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_corcelete_${i}`, name: 'Couraça Reforçada', atk: 0, hp: 0, cost: 1, art: couracaReforcadaArt, effect: 'Arqueiro, Plebeu ou Infantaria equipada recebe +1 HP.', cardType: 'Tática' })),
  { id: 'cardeal_flecha', name: 'Flechas Venenosas', atk: 0, hp: 0, cost: 1, art: flechasVenenosasArt, effect: 'Arqueiro equipado recebe +1 ATK.', cardType: 'Tática' },
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_espada_${i}`, name: 'Espada Longa', atk: 0, hp: 0, cost: 1, art: espadaLongaArt, effect: 'Cavalaria, Infantaria ou Plebeu equipado recebe +2 ATK.', cardType: 'Tática' })),

  // Emboscadas
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_forcas_${i}`, name: 'Reforços Ocultos', atk: 0, hp: 0, cost: 1, art: reforcosOcultosArt, effect: 'Durante um ataque inimigo: um soldado aliado recebe +2 ATK e +1 HP até o fim do turno.', cardType: 'Emboscada' })),

  // Táticas de utilidade
  // Same Full Art testing swap as Nobre da Cruzada/Comandante da Ordem above — both
  // Padrão and Full Art exist for this one, using Full Art for now.
  { id: 'cardeal_soldado_retorna', name: 'Retorno do Soldado', atk: 0, hp: 0, cost: 1, art: retornoDoSoldadoFullArt, isFullArt: true, effect: 'Adicione um soldado do cemitério à sua mão.', cardType: 'Tática' },
  { id: 'cardeal_busca_graal', name: 'Graal da Dádiva', atk: 0, hp: 0, cost: 1, art: graalDaDadivaArt, effect: 'Adicione uma carta de Terreno ou Relíquia do deck à sua mão.', cardType: 'Tática' },
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_nova_tatica_${i}`, name: 'Doutrina Renovada', atk: 0, hp: 0, cost: 1, art: doutrinaRenovadaArt, effect: 'Adicione uma carta de Tática do deck à sua mão.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_esc_dedo_${i}`, name: 'Recrutamento Seletivo', atk: 0, hp: 0, cost: 1, art: recrutamentoSeletivoArt, effect: 'Adicione um soldado do deck à sua mão.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_esc_tropas_${i}`, name: 'Recrutar Veteranos', atk: 0, hp: 0, cost: 1, art: recrutarVeteranosArt, effect: 'Veja as 4 cartas do topo. Adicione 2 à mão e coloque 2 no fundo do deck.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_impostos_${i}`, name: 'Tributo de Guerra', atk: 0, hp: 0, cost: 0, art: tributoDeGuerraArt, effect: 'Ganhe 1 ouro adicional neste turno.', cardType: 'Tática' })),
  ...Array(2).fill(null).map((_, i): CardData => ({ id: `cardeal_reuniao_${i}`, name: 'Chamado às Armas', atk: 0, hp: 0, cost: 2, art: chamadoAsArmasArt, effect: 'Invoque do deck até 2 soldados com 0 ATK para slots livres na Vanguarda. Embaralhe o deck.', cardType: 'Tática' })),
];

// The playable pool each side actually draws from during a match — the General
// isn't a draw, it's placed straight onto the board at kickoff (see resetGame).
const DECKS = {
  capitao: {
    id: 'capitao' as const,
    name: 'Deck Capitão',
    description: 'Infantaria disciplinada e reformação tática.',
    general: DECK_CAPITAO.find(c => c.cardType === 'General')!,
    pool: DECK_CAPITAO.filter(c => c.cardType !== 'General'),
  },
  cardeal: {
    id: 'cardeal' as const,
    name: 'Deck Cardeal Pedro',
    description: 'Fé e ferro — cura, invocações e emboscadas sagradas.',
    general: DECK_CARDEAL.find(c => c.cardType === 'General')!,
    pool: DECK_CARDEAL.filter(c => c.cardType !== 'General'),
  },
} as const;
type DeckId = keyof typeof DECKS;

// Cavaleiro Hospitalário's "cure 1 HP de um aliado" only makes sense targeting someone who's
// actually hurt — but CardData has no separate max-HP field, hp IS current HP (see
// resolveGeneralHeal, which has no such restriction and just heals whatever's
// clicked). So "damaged" is derived here instead: a card's starting HP is whatever
// its own deck-pool entry says, looked up by name (first match — every copy of a
// given card shares the same base stats).
const BASE_HP_BY_NAME: Record<string, number> = {};
[...DECK_CAPITAO, ...DECK_CARDEAL].forEach(c => {
  if (!(c.name in BASE_HP_BY_NAME)) BASE_HP_BY_NAME[c.name] = c.hp;
});
const isCardDamaged = (card: CardData): boolean => card.hp < (BASE_HP_BY_NAME[card.name] ?? card.hp);

// Display-only Portuguese labels for the main menu buttons — the mode strings
// themselves ('Quick Match' etc.) stay in English since they're also used as
// identifiers (gameMode comparisons, onSelectMode), not just display text.
const MODE_LABELS_PT: Record<string, string> = {
  'Campaign': 'Campanha',
  'Quick Match': 'Partida Rápida',
  'Multiplayer': 'Multijogador',
  'My Deck': 'Meu Deck',
};

// A single gold plaque texture (see art-prompts/README.md "4c" and
// button-plaque.webp — cropped from the user's own generated reference sheet,
// specifically the largest of several sizes it came in, per their instruction to
// resize ONE image via code rather than keep multiple generated variants) reused
// for every menu button below. Sizing differences between buttons (e.g. Quick
// Match reading as the "primary" action) are a later code-only change if wanted,
// not a reason to generate more image variants.
const MenuButton = ({ label, onClick, className = '' }: {
  label: string, onClick: (e: React.MouseEvent) => void, className?: string
}) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`relative w-full ${className}`}
    style={{ aspectRatio: '831 / 177' }}
  >
    <img src={buttonPlaqueImage} alt="" className="absolute inset-0 w-full h-full pointer-events-none select-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]" draggable={false} />
    {/* Text style matches the user's own reference mockup exactly (see
        art-prompts/reference/start-screen-mockup-v1.png): plain cream/off-white
        fill with a dark engraved outline, no icon — a bold condensed sans rather
        than the Cinzel serif used elsewhere, since that's what the reference
        actually uses for button labels (Cinzel stays on the logo/headings). */}
    <span
      className="absolute inset-0 flex items-center justify-center font-black uppercase tracking-wide text-base md:text-xl"
      style={{
        color: '#f3e3c3',
        textShadow: '-1px -1px 0 #2a1608, 1px -1px 0 #2a1608, -1px 1px 0 #2a1608, 1px 1px 0 #2a1608, 0 2px 3px rgba(0,0,0,0.6)',
      }}
    >
      {label}
    </span>
  </motion.button>
);

const MainMenu = ({ onSelectMode }: { onSelectMode: (mode: string) => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [-500, 500], [-8, 8]);
  const bgY = useTransform(mouseY, [-500, 500], [-8, 8]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseMove={(e) => {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
      }}
      className="flex flex-col items-center justify-center w-full h-full bg-zinc-950 text-white relative overflow-hidden"
    >
      {/* Background — a besieged castle at dusk (art-prompts/README.md "4"),
          generated landscape but reads well cropped to a phone's portrait screen
          via object-cover (the castle sits naturally near center). A subtle
          mouse-parallax drift on the image itself, and a bottom-heavy dark
          gradient so the menu buttons stay legible over busy sky/cloud detail. */}
      <motion.img
        src={startScreenBgImage}
        alt=""
        style={{ x: bgX, y: bgY }}
        className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] object-cover z-0 pointer-events-none select-none"
        draggable={false}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/10 via-black/40 to-black/85" />

      {/* Logo — cropped straight out of the card back's own emblem (see
          card-backplate.webp / art-prompts/README.md "4d"): that art already had a
          fully-lettered "PRICE OF WAR — FAITH AND FIRE" crest painted into it, so
          there was no need to generate a whole separate logo asset. */}
      <motion.img
        src={logoImage}
        alt="Price of War — Faith and Fire"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-[85vw] max-w-md mb-10 z-10 select-none pointer-events-none drop-shadow-[0_0_35px_rgba(212,175,55,0.35)]"
        draggable={false}
      />

      <div className="flex flex-col gap-4 relative z-10 w-[85vw] max-w-sm">
        {/* The mode identifiers themselves (used in onSelectMode/gameMode comparisons
            elsewhere) stay in English — only the label actually shown is translated,
            so this doesn't need to touch any of the logic keyed off those strings. */}
        {(['Campaign', 'Quick Match', 'Multiplayer', 'My Deck'] as const).map((mode) => (
          <MenuButton
            key={mode}
            label={MODE_LABELS_PT[mode]}
            onClick={(e) => { e.stopPropagation(); onSelectMode(mode); }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const InstallPrompt = ({
  kind, onInstall, onDismiss
}: {
  kind: 'native' | 'ios', onInstall: () => void, onDismiss: () => void
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 pointer-events-auto"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="w-full max-w-xs bg-gradient-to-b from-[#e8dcbe] via-[#c9b48a] to-[#a3895f] rounded-2xl border-2 border-[#5c4a30] shadow-2xl p-6 flex flex-col items-center gap-4 text-center"
      style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.45), 0 10px 40px rgba(0,0,0,0.6)' }}
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#5c4a30] shadow-lg shrink-0">
        <img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-lg font-black uppercase tracking-wide text-[#2a2117]">Instale o Price of War</h2>
      {kind === 'native' ? (
        <>
          <p className="text-sm text-[#4a3b2c]">Jogue em tela cheia, sem as barras do navegador. Instale o app no seu aparelho.</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onDismiss}
              className="flex-1 px-4 py-2 rounded-full border-2 border-[#5c4a30] text-[#4a3b2c] font-bold text-sm hover:bg-black/5 transition-colors"
            >
              Agora não
            </button>
            <button
              onClick={onInstall}
              className="flex-1 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition-colors"
            >
              Instalar
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-[#4a3b2c]">
            Toque em <strong>Compartilhar</strong> e depois em <strong>"Adicionar à Tela de Início"</strong> para jogar em tela cheia, sem as barras do navegador.
          </p>
          <button
            onClick={onDismiss}
            className="px-6 py-2 rounded-full border-2 border-[#5c4a30] text-[#4a3b2c] font-bold text-sm hover:bg-black/5 transition-colors"
          >
            Entendi
          </button>
        </>
      )}
    </motion.div>
  </motion.div>
);

// Shown right after tapping "Quick Match" — picking a deck here is what decides
// which General and card pool the player gets; the AI always takes the other
// deck (see resetGame), so every match pits the two against each other.
const DeckPickerModal = ({ onSelect, onClose }: { onSelect: (deckId: DeckId) => void, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 pointer-events-auto"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm flex flex-col gap-4"
    >
      <h2 className="text-center text-xl font-black uppercase tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Escolha seu Deck</h2>
      {Object.values(DECKS).map((deck) => (
        <motion.button
          key={deck.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(deck.id)}
          className="text-left bg-gradient-to-b from-[#e8dcbe] via-[#c9b48a] to-[#a3895f] rounded-2xl border-2 border-[#5c4a30] shadow-2xl p-5 flex flex-col gap-1"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.45), 0 10px 40px rgba(0,0,0,0.6)' }}
        >
          <span className="text-lg font-black uppercase tracking-wide text-[#2a2117]">{deck.name}</span>
          <span className="text-xs font-bold text-[#5c4a30]">General: {deck.general.name}</span>
          <span className="text-sm text-[#4a3b2c] mt-1">{deck.description}</span>
          <span className="text-[11px] text-[#6b5636] mt-1 uppercase tracking-wide">{deck.pool.length + 1} cartas</span>
        </motion.button>
      ))}
      <button onClick={onClose} className="mx-auto mt-1 px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
        Cancelar
      </button>
    </motion.div>
  </motion.div>
);

// Shown before the main menu so a cold load never drops the player straight into
// gameplay with art still fetching mid-match. Two phases: a plain black screen
// (minimum ~500ms) while just the start screen's own background + logo load, then
// a progress bar while every other card/board image in the game preloads — by the
// time this unmounts, the whole game's art is already in the browser's cache.
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [showBar, setShowBar] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const preload = (src: string) => new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });

    (async () => {
      const minBlackScreen = new Promise<void>((resolve) => setTimeout(resolve, 500));
      await Promise.all([preload(startScreenBgImage), preload(logoImage), minBlackScreen]);
      if (cancelled) return;
      setShowBar(true);

      let loaded = 0;
      const total = ALL_PRELOAD_IMAGES.length;
      await Promise.all(ALL_PRELOAD_IMAGES.map((src) => preload(src).then(() => {
        loaded++;
        if (!cancelled) setProgress(Math.round((loaded / total) * 100));
      })));
      if (!cancelled) onDone();
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {showBar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 w-56"
        >
          <img src={logoImage} alt="" className="w-40 select-none pointer-events-none" draggable={false} />
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-white/40 text-[11px] uppercase tracking-widest">Carregando...</span>
        </motion.div>
      )}
    </div>
  );
};

export default function App() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [gameMode, setGameMode] = useState<string | null>(null);
  // Quick Match asks which deck to play before actually starting the match —
  // see DECKS above and the DeckPickerModal rendered in the !gameMode branch.
  const [deckPickerOpen, setDeckPickerOpen] = useState(false);

  // Duel background music: decoded once into a raw AudioBuffer and looped through
  // the Web Audio API — NOT a plain <audio loop> element. A looping <audio> element
  // re-seeks/re-buffers at the loop point, which on this track was audible as a
  // brief stutter/pause before it picked back up. An AudioBufferSourceNode with
  // loop = true instead just keeps reading the same decoded PCM samples in a
  // circle, so the seam is sample-accurate and silent. Started whenever a match
  // is in progress, stopped the moment gameMode goes back to null (menu).
  const duelMusicCtxRef = useRef<AudioContext | null>(null);
  const duelMusicBufferRef = useRef<AudioBuffer | null>(null);
  const duelMusicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  useEffect(() => {
    if (!gameMode) {
      duelMusicSourceRef.current?.stop();
      duelMusicSourceRef.current = null;
      return;
    }
    let cancelled = false;
    (async () => {
      // Only ever constructed once a match actually starts — never during the
      // loading screen or the menu, so it never competes for bandwidth with the
      // loading screen's own image preloading.
      const ctx = duelMusicCtxRef.current ?? (duelMusicCtxRef.current = new AudioContext());
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      if (!duelMusicBufferRef.current) {
        const arrayBuffer = await fetch(duelMusicUrl).then(r => r.arrayBuffer());
        if (cancelled) return;
        duelMusicBufferRef.current = await ctx.decodeAudioData(arrayBuffer);
      }
      if (cancelled || duelMusicSourceRef.current) return;
      const source = ctx.createBufferSource();
      source.buffer = duelMusicBufferRef.current;
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = 0.25;
      source.connect(gain).connect(ctx.destination);
      source.start();
      duelMusicSourceRef.current = source;
    })();
    return () => { cancelled = true; };
  }, [gameMode]);
  const [viewState, setViewState] = useState<'hand' | 'field'>('hand');
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'npc'>('player');
  // 0 (not 1) — resetGame always sets this to 1 at match start, and the turn-start
  // effect below (keyed on [currentTurn, turnNumber]) only fires when a dependency
  // actually CHANGES value; starting at the same 1 it gets reset to meant that
  // effect silently no-opped for a match's very first turn (including announcePhase,
  // so the opening "Fase de Preparação" banner never played) — it only ever fired
  // correctly from the second match of a session onward, once turnNumber had moved
  // away from 1 for resetGame to change it back from.
  const [turnNumber, setTurnNumber] = useState(0);
  // Which part of the player's own turn they're in — see TurnPhase above. The AI's
  // turn doesn't use this; it just plays/attacks directly via playAiTurn.
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('preparacao');
  // The AI doesn't have real gated phases (see the currentTurn==='npc' effect below)
  // — this just drives the phase-tag column mirrored onto its own field, so that
  // column shows something instead of always sitting dark. null outside its turn.
  const [npcVisiblePhase, setNpcVisiblePhase] = useState<'preparacao' | 'combate' | null>(null);
  // Slots (0-9) that have already moved/swapped this reposition phase — each unit
  // gets one reposition action per own turn, then it's locked until the next one.
  const [movedSlots, setMovedSlots] = useState<Set<number>>(new Set());
  const [selectedMoverIndex, setSelectedMoverIndex] = useState<number | null>(null);
  // Reformar Linhas: extra reposition moves for this Preparação, usable even on a
  // unit that already moved (bypassing the movedSlots gate) — see handleSlotClick.
  const [bonusRepositions, setBonusRepositions] = useState(0);
  // A Tática card that's been played and is now waiting for the player to click its
  // target on the board (see TARGETABLE_TACTICS / resolveOwnTacticTarget /
  // resolveEnemyTacticTarget) — the card is already out of hand and mana already
  // spent by this point, same as a normal card that's mid-flight to a slot.
  const [pendingTacticAction, setPendingTacticAction] = useState<{ card: CardData; kind: TacticTargetKind } | null>(null);
  // Batedor: "Move após combate" — the slot it's standing in right after it survives
  // an attack, so handleSlotClick can grant it exactly one free reposition even
  // though it's the Batalha phase (see the reposition branch's own phase check).
  const [batedorFreeMove, setBatedorFreeMove] = useState<number | null>(null);

  // ── General activatable abilities (Yu-Gi-Oh-style "you may activate this" prompt) ──
  // Cardeal Pedro, Voz da Fé's "Fase Principal: cure 1 HP em um soldado aliado. Pague 1 ouro
  // para curar 3 HP em vez disso." used to be pure flavor text with no way to trigger
  // it at all. Instead of hardcoding just this one ability, this is meant to read as
  // the general shape a card game like this needs: the game itself notices the
  // General has an available Fase-Principal effect and surfaces it (a glowing prompt
  // on the General, see the CardSlot call sites below) rather than the player having
  // to already know it's there. generalAbilityUses resets every player turn (see the
  // currentTurn === 'player' effect) and caps at 1, or 2 while Cálice da Graça sits in
  // the Relíquia slot (see getGeneralAbilityMaxUses).
  const [playerGeneralAbilityUses, setPlayerGeneralAbilityUses] = useState(0);
  const [npcGeneralAbilityUses, setNpcGeneralAbilityUses] = useState(0);
  // "Ativar habilidade?" — the first prompt, offering the free vs. paid variant (or
  // just a plain activate/cancel for an ability with no cost choice).
  // `confirmed` splits this into the two Yu-Gi-Oh-style steps: first a plain "activate
  // this effect?" yes/no on the card itself, and only once the player says yes does
  // the card's own cost/amount choice show up (see activateGeneralHeal) — instead of
  // dumping both decisions on the player at once.
  const [generalAbilityPrompt, setGeneralAbilityPrompt] = useState<{ kind: 'cardeal_heal', confirmed: boolean } | null>(null);
  // Set once the player has committed to activating and chosen an amount — now
  // waiting for them to click the actual ally to heal, same two-step shape as
  // pendingTacticAction above.
  const [pendingGeneralHeal, setPendingGeneralHeal] = useState<{ amount: number } | null>(null);

  // Infiltrado da Ordem's "Se o General aliado receber dano, no próximo turno não
  // poderá usar sua habilidade." pendingPlayerGeneralAbilityBlock/
  // pendingNpcGeneralAbilityBlock are set the moment that side's General takes
  // damage while a living Infiltrado da Ordem is on their own board (see the damage
  // checks in handleNpcSlotClick and the AI turn loop). The "...BlockedThisTurn"
  // pair is what actually gates the ability and is deliberately a ref, not
  // state: it's flipped on inside the currentTurn-start effect (copied from the
  // pending flag above, which is then cleared) and needs to already read as
  // updated to the AI-turn-runner effect that fires in that very same
  // currentTurn-change pass — a state update made by one effect isn't visible to
  // a sibling effect's closure until a further render, but a ref mutation is
  // immediate. playerGeneralAbilityAvailable below reads it straight off the ref
  // at render time for the same reason; it still catches every real change
  // because the same effect that flips it always also calls other setState
  // (e.g. setPlayerGeneralAbilityUses(0)) that forces the next render anyway.
  const [pendingPlayerGeneralAbilityBlock, setPendingPlayerGeneralAbilityBlock] = useState(false);
  const [pendingNpcGeneralAbilityBlock, setPendingNpcGeneralAbilityBlock] = useState(false);
  const playerGeneralAbilityBlockedThisTurnRef = useRef(false);
  const npcGeneralAbilityBlockedThisTurnRef = useRef(false);

  // Mercador da Cruzada ("Uma vez por turno: veja as 2 cartas do topo do
  // deck...") and Cavaleiro Hospitalário ("Uma vez por turno: cure 1 HP...") — the same
  // Yu-Gi-Oh-style on-board prompt as the General's own ability above, just keyed
  // per-card instead of only the General slot (see getPlayerCreatureAbilityKind).
  // Tracks card INSTANCE ids (stable while a card sits on the board) rather than
  // names, since both cards have 2 copies that could be on the field at once, each
  // usable independently. Resets every player turn (see the currentTurn effect).
  const [playerActivatedAbilityIds, setPlayerActivatedAbilityIds] = useState<Set<string>>(new Set());
  // Cavaleiro Hospitalário's two independent halves (heal an ally, then damage an enemy
  // Vanguarda unit) — same two-step "commit, then click a target" shape as
  // pendingGeneralHeal, except it can move straight to 'damage' without ever
  // showing 'heal' (see activateHospitalario) when there's no damaged ally to
  // heal, so the card isn't wasted just because the heal half has no target.
  const [pendingHospitalario, setPendingHospitalario] = useState<{ step: 'heal' | 'damage' } | null>(null);

  // Arqueiro da Ordem's "Pode atacar duas vezes por rodada" is the game's
  // first case of any unit attacking more than once a turn, which means this is
  // also the game's first "already attacked this turn" tracker — every other
  // unit is implicitly capped at 1 through the exact same map (see
  // getMaxAttacksPerTurn). Keyed by slot index rather than card id: a slot that's
  // attacked once and then had its occupant swapped out via a reposition mid-turn
  // is an edge case this doesn't try to chase — Batalha-phase repositioning is
  // already restricted to Batedor's one free move (see batedorFreeMove) so it's
  // not really reachable in practice. Reset every player turn (see the
  // currentTurn effect). The AI's own attacks aren't tracked here at all — it
  // never lets a unit swing more than aiService.ts's own per-unit loop already
  // decides (see playAiTurn's Arqueiro da Ordem case), so it never needs to
  // consult this.
  const [playerAttackCounts, setPlayerAttackCounts] = useState<Record<number, number>>({});

  // The reveal/search Táticas (Retorno do Soldado, Graal da Dádiva, Nova
  // Tática, Recrutamento Seletivo, Recrutar Veteranos, Chamado às Armas) all boil down to
  // the same shape: show the player a set of candidate cards and let them pick
  // one (or a couple), then do something with the pick(s) — see openCardPicker
  // and its call sites in handlePlayCardButtonClick.
  const [cardPicker, setCardPicker] = useState<{
    title: string;
    options: CardData[];
    maxPicks: number;
    selected: CardData[];
    onConfirm: (picked: CardData[]) => void;
  } | null>(null);
  const openCardPicker = (title: string, options: CardData[], maxPicks: number, onConfirm: (picked: CardData[]) => void) => {
    setCardPicker({ title, options, maxPicks, selected: [], onConfirm });
  };

  const [playerMana, setPlayerMana] = useState(10);
  const [npcMana, setNpcMana] = useState(10);

  const [hand, setHand] = useState<CardData[]>([]);
  // The opponent's actual hand of real cards — it plays from this on its turn (see
  // playAiTurn) instead of conjuring a placeholder card out of nowhere. The face-down
  // card backs shown above the board (see npcHand.length below) are just its length;
  // the player never sees what's actually in it.
  const [npcHand, setNpcHand] = useState<CardData[]>([]);
  const [playerSlots, setPlayerSlots] = useState<(CardData | null)[]>(Array(13).fill(null));
  const [npcSlots, setNpcSlots] = useState<(CardData | null)[]>(Array(13).fill(null));
  // Cards that have died in combat, per side — shown in the on-board Graveyard pile
  // (see GraveyardPile) so a destroyed card visibly ends up somewhere instead of just
  // disappearing after its destruction animation plays out.
  const [playerGraveyard, setPlayerGraveyard] = useState<CardData[]>([]);
  const [npcGraveyard, setNpcGraveyard] = useState<CardData[]>([]);
  // Which graveyard (if any) the browser overlay below is currently showing — either
  // pile is public information (same as most card games), so the opponent's is just as
  // browsable as the player's own, not only the top card GraveyardPile itself shows.
  const [viewingGraveyard, setViewingGraveyard] = useState<'player' | 'npc' | null>(null);

  const [selectedAttackerIndex, setSelectedAttackerIndex] = useState<number | null>(null);
  // Floating combat/gold numbers (Hearthstone-style "-3"/"+2" popping off a card or
  // the gold badge) — a plain list of already-positioned, already-timed entries
  // rather than anything tied to React state elsewhere, so any call site that just
  // resolved damage/a heal/a gold change can fire one off with only a DOM id and a
  // number, no matter how deep in a combat/effect branch it is. Removed by its own
  // timeout (see spawnFloatingNumber below), not by the animation's onComplete —
  // onComplete doesn't fire reliably for elements added and removed within the same
  // render batch that a fast double-attack can produce.
  const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; x: number; y: number; text: string; kind: 'damage' | 'heal' | 'gold-gain' | 'gold-spend' }[]>([]);
  const floatingNumberIdRef = useRef(0);
  const spawnFloatingNumber = (x: number, y: number, value: number, kind: 'damage' | 'heal' | 'gold-gain' | 'gold-spend') => {
    if (value === 0) return;
    const id = ++floatingNumberIdRef.current;
    const text = (kind === 'heal' || kind === 'gold-gain') ? `+${value}` : `-${value}`;
    // A little horizontal jitter so two numbers landing on the same spot at once
    // (e.g. an attacker and defender trading damage right next to each other, or
    // Trabuco de Cerco's AOE hitting a whole row at once) don't render as one
    // unreadable stack of overlapping digits.
    const jitterX = x + (Math.random() - 0.5) * 20;
    setFloatingNumbers(prev => [...prev, { id, x: jitterX, y, text, kind }]);
    window.setTimeout(() => setFloatingNumbers(prev => prev.filter(f => f.id !== id)), 1300);
  };
  // Convenience wrapper for the overwhelmingly common case: the number belongs
  // over a specific board slot or the gold badge, identified the same way the
  // rest of this file already finds those elements (document.getElementById).
  const spawnFloatingNumberAtId = (elementId: string, value: number, kind: 'damage' | 'heal' | 'gold-gain' | 'gold-spend') => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const r = el.getBoundingClientRect();
    spawnFloatingNumber(r.left + r.width / 2, r.top + r.height * 0.35, value, kind);
  };
  // Center-screen phase announcement (Yu-Gi-Oh-style crimson ribbon banner that
  // rushes in from the right and back out to the left) — see the banner overlay
  // further down. Keyed by an incrementing id (not just the text) so announcing the
  // SAME phase name twice in a row still replays the animation instead of
  // AnimatePresence treating it as the same already-mounted element.
  const [phaseBanner, setPhaseBanner] = useState<{ id: number; title: string; subtitle: string; stage: 'in' | 'hold' | 'out' } | null>(null);
  const phaseBannerIdRef = useRef(0);
  // Blocks every board/hand tap while a phase banner is on screen — the banner used
  // to be purely decorative on top of state that had already changed, so a fast
  // sequence of actions (the AI's own turn especially, see the currentTurn effect)
  // could blow right through it before it even finished sliding in. Whatever called
  // announcePhase is expected to hold off on its own state change (see the turn
  // button and the turn-start effect below) until this clears, and every click
  // handler that can act on the board checks it too, so nothing sneaks in through a
  // path that isn't gated by the phase this banner is actually announcing.
  const [phaseTransitionLock, setPhaseTransitionLock] = useState(false);
  const phaseLockGenRef = useRef(0);
  // Shared by announcePhase (below) and announceTurnChange — the ribbon itself
  // doesn't actually care whether its text is a phase name or a turn handoff,
  // just that something worth a beat's pause just happened.
  const showBanner = (title: string, subtitle: string) => {
    const id = ++phaseBannerIdRef.current;
    const gen = ++phaseLockGenRef.current;
    setPhaseBanner({ id, title, subtitle, stage: 'in' });
    setPhaseTransitionLock(true);
    window.setTimeout(() => setPhaseBanner(prev => (prev?.id === id ? { ...prev, stage: 'hold' } : prev)), PHASE_BANNER_STAGE_MS.in);
    window.setTimeout(() => setPhaseBanner(prev => (prev?.id === id ? { ...prev, stage: 'out' } : prev)), PHASE_BANNER_STAGE_MS.in + PHASE_BANNER_STAGE_MS.hold);
    window.setTimeout(() => {
      setPhaseBanner(prev => (prev?.id === id ? null : prev));
      // Only the MOST RECENT call gets to release the lock — if this ever fires
      // again before the last one's timer clears it, that second call extends the
      // wait instead of the first banner's own timer cutting it short out from
      // under the second.
      if (phaseLockGenRef.current === gen) setPhaseTransitionLock(false);
    }, PHASE_BANNER_DURATION_MS);
  };
  const announcePhase = (phase: TurnPhase) => {
    const { title, subtitle } = PHASE_BANNER_TEXT[phase];
    showBanner(title, subtitle);
  };
  // "Seu Turno" / "Turno do Adversário" — the same handoff moment used to only
  // show up as the Avançar button quietly changing color/label, easy to miss.
  // Not called on the very first turn of a match (see startGame) — there's no
  // "the other side just finished" to announce yet.
  const announceTurnChange = (turn: 'player' | 'npc') => {
    showBanner(
      turn === 'player' ? 'Seu Turno' : 'Turno do Adversário',
      turn === 'player' ? 'Jogue suas cartas e ataque' : 'Aguarde enquanto ele joga'
    );
  };
  // Board card preview (see the fixed overlay further down) — set from CardSlot's
  // own onClick now, alongside whatever game action that same tap already performs,
  // so it needs to clear itself instead of waiting on an explicit close every time.
  const [detailedCard, setDetailedCard] = useState<CardData | null>(null);
  useEffect(() => {
    if (!detailedCard) return;
    const t = window.setTimeout(() => setDetailedCard(null), 2200);
    return () => clearTimeout(t);
  }, [detailedCard]);
  // A brief, bigger callout for whichever card was just played — mainly for the
  // opponent's plays, which otherwise happen inside a small board slot that's easy to
  // miss on a phone. Player's own plays already get a large preview during selection.
  const [announcedCard, setAnnouncedCard] = useState<{ card: CardData, side: 'player' | 'npc' } | null>(null);

  const [isImpacting, setIsImpacting] = useState(false);
  const [attackAnim, setAttackAnim] = useState<{ attackerIndex: number, targetIndex: number, isPlayerAttacking: boolean } | null>(null);
  // Forces a re-render every animation frame while an attack is in flight, purely so
  // activeAttackLine (below) re-measures the attacking card's live position instead of
  // freezing on wherever it was the instant attackAnim was first set — that instant is
  // BEFORE the card's own lunge (see CardSlot's isAttacking y/z/scale) has actually
  // moved it, so without this the arrow started from the card's now-empty home slot
  // instead of visibly tracking the card itself mid-lunge.
  const [, forceAttackLineTick] = useState(0);
  useEffect(() => {
    if (!attackAnim) return;
    let raf = 0;
    const loop = () => { forceAttackLineTick(t => t + 1); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [attackAnim]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [gameOverWinner, setGameOverWinner] = useState<'player' | 'npc' | null>(null);

  // Emboscada (ambush) interrupt — ported/generalized from the old full-art version's
  // trap-card system: whenever EITHER side is about to take a hit, if the DEFENDING
  // side has an Emboscada card in hand, combat pauses so that card can be activated
  // before damage lands. Works both ways now (the old version only paused for the
  // human defending; here the AI gets the same reactive option, decided by a simple
  // heuristic instead of a modal — see maybeActivatePlayerAmbush/maybeActivateNpcAmbush).
  // No per-card effectKeys exist yet (none of the Emboscada cards' flavor text is wired
  // to real logic, same as every other card right now), so activating any of them
  // applies one generic reactive buff (+2 ATK / +2 HP to the unit being attacked) —
  // a placeholder in the same spirit as the rest of the deck's flavor-only effects.
  const [ambushPrompt, setAmbushPrompt] = useState<{
    defenderName: string;
    attackerName: string;
    options: CardData[];
    resolve: (chosen: CardData | null) => void;
  } | null>(null);

  // Prompt to install the game as an app (standalone, no browser chrome) — since it's
  // played almost entirely on phones, that extra screen space matters. Shown every time
  // the game is opened in a regular browser tab (never persisted as "don't show again").
  const [installPromptKind, setInstallPromptKind] = useState<'native' | 'ios' | null>(null);
  const deferredInstallPromptRef = useRef<any>(null);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      // iOS Safari has no beforeinstallprompt API — there's nothing to defer, so show
      // manual "Add to Home Screen" instructions right away.
      setInstallPromptKind('ios');
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredInstallPromptRef.current = e;
      setInstallPromptKind('native');
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      deferredInstallPromptRef.current = null;
      setInstallPromptKind(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredInstallPromptRef.current;
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    deferredInstallPromptRef.current = null;
    setInstallPromptKind(null);
  };

  // Flight animation for a card being played from hand onto a board slot: computed from real
  // on-screen positions (getBoundingClientRect), since the hand sits in a flat layer while the
  // board is a heavily 3D-transformed one — Framer Motion's automatic layoutId animation can't
  // reconcile the two, so this animates plain 2D screen coordinates instead.
  // The camera zooms toward the target slot BEFORE the card starts flying, so that by the
  // time we measure the slot's real screen position the board has already stopped moving —
  // otherwise the zoom/pan mid-flight makes the card land visibly offset from the real slot.
  const [preZoomSlot, setPreZoomSlot] = useState<{ slotIndex: number } | null>(null);
  const [flyingCard, setFlyingCard] = useState<{
    card: CardData; slotIndex: number;
    fromX: number; fromY: number; fromW: number; fromH: number;
    toX: number; toY: number; toW: number; toH: number;
  } | null>(null);
  // Holds the camera's zoomed-in focus for a brief moment after the card lands,
  // so the placement reads clearly before the view eases back to normal.
  const [cameraSettling, setCameraSettling] = useState<{ slotIndex: number } | null>(null);
  // A brief flash/ring burst at the screen position where a played card just landed.
  const [impactBurst, setImpactBurst] = useState<{ x: number; y: number; big?: boolean } | null>(null);
  // A "full art" card (see CardData.isFullArt) landing makes the whole board react —
  // a stronger camera shake (see getBoardAnimation's cameraSettling branch) and every
  // other card on the field flinches (see CardSlot's shockActive). Just a boolean pulse:
  // true for one beat, then back to false.
  const [boardShock, setBoardShock] = useState(false);
  const triggerFullArtReaction = () => {
    setBoardShock(true);
    setTimeout(() => setBoardShock(false), 500);
  };
  const handCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Where a targetable Tática's tap-to-target lands, stashed here (not resolved
  // immediately) because handlePlayCardButtonClick's own commit — spending the
  // mana, removing the card from hand, setting pendingTacticAction — has to land
  // and re-render before resolveOwnTacticTarget/resolveEnemyTacticTarget (which
  // both read pendingTacticAction straight off state) can see it. The effect
  // right after this component's other pendingTacticAction-driven effects picks
  // this up the moment that render happens — see its own comment. Side is still
  // called 'npc' (not 'enemy') to match dragHoverSlot's old naming everywhere else
  // this side/index pair shows up (slot DOM ids, handleNpcSlotClick, ...).
  const pendingDropTargetRef = useRef<{ side: 'own' | 'npc', index: number } | null>(null);

  const isMobile = windowSize.width < 768;
  // Board container is a fixed 1000x1400px canvas (see the 3D Board div below) that gets
  // scaled down to fit the real viewport — these divisors must match those exact dimensions.
  // On phones this layout is always width-bound (viewport width/1000 comes out smaller than
  // viewport height/H for any H a real phone's aspect ratio would need — see boardScale's
  // isMobile branch), so boardScale itself is set entirely by width and doesn't change
  // just because H changes. What DOES change is how much of the real screen the resulting
  // (bigger) canvas actually fills: bumping H bumps the final on-screen board height by the
  // exact same ratio, since it's the same boardScale applied to a taller canvas. Was 1250,
  // briefly 1600 (see git history) — 1600 grew CardSlot enough that on a real phone (with
  // its browser chrome eating into the actual usable height, unlike a headless test's full
  // window) the player's own General/Relíquia/Terreno row ended up covered by the hand tray.
  // 1400 is the trimmed-back number: still noticeably more room than the original 1250 for
  // CardSlot (see its own w-28/h-36+ sizing below) to grow into, with enough slack left over
  // for a phone's real chrome instead of just enough for a full-height simulator window.
  // 1.15 (was 1.05) per the user's own ask to zoom in on just the board for
  // readability once everything else here settled — hand cards don't use this at
  // all (see handScale below, sized purely off viewport WIDTH), so they stay exactly
  // the size they were. The margin this eats into above/below the board (see
  // boardTopMargin) was comfortably oversized before this change (see its own
  // measurements) with room to spare for the bump.
  const boardScale = isMobile ? Math.min(windowSize.width / 1000, windowSize.height / 1250) * 1.15 : Math.min(windowSize.width / 1600, 1);
  // Hand cards are fanned out (see getFanRotation below), so the outer cards' bounding box
  // is wider than their flat width — account for that tilt or the fan's edge cards clip.
  // Scale so the WHOLE hand always fits on screen — no floor, or large hands would overflow
  // and get clipped past the screen edges (the outer container clips, it doesn't scroll).
  // Sized against a fixed reference count (not the hand's actual current length) so cards
  // stay the SAME size while dealing the opening hand (1 card growing to 5) instead of
  // visibly shrinking card by card as each new one arrives — it only starts shrinking
  // further once the hand genuinely grows past a normal opening hand's size.
  const HAND_SCALE_REFERENCE_COUNT = 5;
  const handScaleCount = Math.max(hand.length, HAND_SCALE_REFERENCE_COUNT);
  const handTotalWidth = handScaleCount > 0 ? HAND_CARD_WIDTH + (handScaleCount - 1) * HAND_CARD_STEP : HAND_CARD_WIDTH;
  const handFanMaxAngleRad = (FAN_SPREAD_DEG / 2) * (Math.PI / 180);
  const handFanExtraWidth = handScaleCount > 1 ? HAND_CARD_HEIGHT * Math.sin(handFanMaxAngleRad) : 0;
  // The 0.88 safety factor accounts for what the width-only math above doesn't: the fan's
  // rotation also pushes each card's TOP edge higher (a rotated rectangle's bounding box
  // is taller than the flat card, not just wider) and the outer cards get lifted further
  // down via getFanLift — without this margin, real devices measured the fan's outer/edge
  // cards clipping past the bottom (and, on the widest hands, the left/right) screen edges
  // instead of just sitting snugly inside them.
  const handScale = isMobile
    ? Math.min(0.85, (windowSize.width - 32) / (handTotalWidth + handFanExtraWidth)) * 0.88
    : 1;
  // Kept in sync so code running inside timers set up once at match start (which close
  // over stale state values from that render) can still read the current hand/handScale.
  // Declared here (rather than nearer their only other use, further down) because this
  // whole component returns early for the menu screen below — hooks can't come after that.
  const handRef = useRef(hand);
  useEffect(() => { handRef.current = hand; }, [hand]);
  const handScaleRef = useRef(handScale);
  useEffect(() => { handScaleRef.current = handScale; }, [handScale]);
  // The AI-turn effect (below) fires on the same currentTurn change as the redraw
  // effect that hands the NPC its per-turn card — reading npcHand directly there would
  // close over the pre-redraw value, since that update lands in a later render this
  // effect's own dependencies don't re-trigger on. A ref side-steps that: it's updated
  // synchronously enough that the AI turn, even scheduled moments later, sees the draw.
  const npcHandRef = useRef(npcHand);
  useEffect(() => { npcHandRef.current = npcHand; }, [npcHand]);

  // Real on-board deck piles — the thing the player actually looks at on the table, and
  // the anchor a newly drawn card's own arrival animation starts from (see
  // computeDrawOrigin). Kept as refs so we can read their true, on-screen position
  // (getBoundingClientRect already resolves the board's 3D transform) whenever a draw
  // happens, instead of hardcoding coordinates that would drift if the layout changes.
  const playerDeckRef = useRef<HTMLDivElement>(null);
  const npcDeckRef = useRef<HTMLDivElement>(null);
  // Which deck's pool each side is currently drawing from — set in resetGame from
  // the deck chosen at the Quick Match picker, so this can't just be a constant
  // anymore now that there are two real decks instead of one shared card pool.
  const playerDeckPoolRef = useRef<readonly CardData[]>(DECKS.capitao.pool);
  const npcDeckPoolRef = useRef<readonly CardData[]>(DECKS.cardeal.pool);
  // Each side's General comes from the same chosen deck as its draw pool — set
  // alongside it in resetGame instead of the fixed GENERAL_PLAYER/GENERAL_NPC
  // constants this replaced.
  const generalPlayerRef = useRef<CardData>(DECKS.capitao.general);
  const generalNpcRef = useRef<CardData>(DECKS.cardeal.general);
  // A shuffled draw pile, reshuffled from the active deck once exhausted — draws
  // come from here instead of a plain random pick so the same card can't turn up
  // twice in a row purely by chance (with only 10 card types and a 5-card opening
  // hand, picking WITH replacement made an immediate repeat likely on almost every
  // match, which read as the game "swapping" a card for another copy of itself
  // rather than dealing a fresh one).
  const deckQueueRef = useRef<CardData[]>([]);
  const drawFromDeck = (): CardData => {
    if (deckQueueRef.current.length === 0) {
      deckQueueRef.current = [...playerDeckPoolRef.current].sort(() => Math.random() - 0.5);
    }
    const card = deckQueueRef.current.shift()!;
    playCardDrawSfx();
    return { ...card, id: `hand_${Date.now()}_${Math.random()}` };
  };
  // The opponent's own independent shuffled draw pile — same mechanism as the
  // player's, kept separate so the two sides don't deplete/reshuffle one shared queue.
  const npcDeckQueueRef = useRef<CardData[]>([]);
  const drawFromNpcDeck = (): CardData => {
    if (npcDeckQueueRef.current.length === 0) {
      npcDeckQueueRef.current = [...npcDeckPoolRef.current].sort(() => Math.random() - 0.5);
    }
    const card = npcDeckQueueRef.current.shift()!;
    playCardDrawSfx();
    return { ...card, id: `npc_hand_${Date.now()}_${Math.random()}` };
  };

  // Atirador da Cruzada: "Ao ir ao cemitério: compre 3 cartas." Called from every
  // "push these destroyed cards onto the graveyard" call site (the same ones
  // withEquippedWeapons already touches — see its own comment), so it fires
  // whether the player's or the NPC's copy is the one that died. Takes the raw
  // (pre-withEquippedWeapons) destroyed list since an equipped weapon can never
  // itself be named 'Atirador da Cruzada'. No hand-size cap — same as every other
  // draw in this game (drawFromDeck/drawFromNpcDeck have none either).
  const drawForAtiradorInfluente = (destroyedCards: CardData[], isPlayerOwner: boolean) => {
    const count = destroyedCards.filter(c => c.name === 'Atirador da Cruzada').length;
    for (let i = 0; i < count * 3; i++) {
      if (isPlayerOwner) {
        setHand(prev => [...prev, drawFromDeck()]);
      } else {
        setNpcHand(prev => [...prev, drawFromNpcDeck()]);
      }
    }
  };

  // Where a newly drawn card should land: right next to the last real hand card (or the
  // tray's own resting spot if the hand is still empty) — an approximation of the new
  // card's actual fan slot, close enough that the flight's landing point and the real
  // hand card's resting spot read as the same place instead of two unrelated ones. Reads
  // through refs (not the hand/handScale state directly) because this is called from
  // inside timers set up once at match start (startMatchIntro) — a closure over the
  // state variables themselves would keep seeing the hand as it was at that moment.
  const getHandArrivalPoint = () => {
    const currentHand = handRef.current;
    const lastId = currentHand.length > 0 ? currentHand[currentHand.length - 1].id : null;
    const lastEl = lastId ? handCardRefs.current[lastId] : null;
    if (lastEl) {
      const r = lastEl.getBoundingClientRect();
      return { x: r.left + r.width / 2 + (HAND_CARD_STEP - HAND_CARD_WIDTH) * handScaleRef.current, y: r.top + r.height / 2 };
    }
    return { x: windowSize.width / 2, y: windowSize.height - 140 };
  };
  // Fan the hand out like a real card fan: a modest total spread, distributed evenly
  // across however many cards are in hand, with the center card slightly raised.
  // totalOverride lets code compute what a card's fan spot WILL be before it's actually
  // in the hand array yet (see computeDrawOrigin) — normal rendering just omits it and
  // uses the hand's current length. Declared here (rather than down with the rest of the
  // render-time helpers) so computeDrawOrigin below can call it without a forward
  // reference — a plain function is safe to call from a deferred timer either way, but
  // referencing one declared later in the same component is still a temporal-dead-zone
  // error at the moment this function is DEFINED, since JS evaluates default parameter
  // and closure bindings eagerly for const declarations in source order.
  const getFanRotation = (index: number, totalOverride?: number) => {
    const total = totalOverride ?? hand.length;
    if (total <= 1) return 0;
    const mid = (total - 1) / 2;
    const step = FAN_SPREAD_DEG / (total - 1);
    return (index - mid) * step;
  };
  const getFanLift = (index: number, totalOverride?: number) => {
    const total = totalOverride ?? hand.length;
    if (total <= 1) return 0;
    const mid = (total - 1) / 2;
    const normalized = mid === 0 ? 0 : (index - mid) / mid;
    return normalized * normalized * FAN_LIFT_PX;
  };
  // A newly drawn hand card's OWN initial x/y/scale (in the same local, pre-handScale
  // units its normal resting animate already uses — see the hand card's `initial` below)
  // so it starts sitting right at the real on-board deck and animates itself into its
  // fan slot, flipping face-up along the way. This card is the ONLY element involved
  // start to finish — no separate flight overlay that then hands off to a different real
  // card, which is what used to read as the card "turning into a different game element"
  // partway through, no matter how well the handoff was timed.
  const drawOriginsRef = useRef<Record<string, { x: number; y: number; scale: number }>>({});
  const computeDrawOrigin = (deckRef: React.RefObject<HTMLDivElement>, index: number) => {
    const rect = deckRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const arrival = getHandArrivalPoint();
    const scale = handScaleRef.current;
    const restLift = getFanLift(index, index + 1);
    const deckX = rect.left + rect.width / 2;
    const deckY = rect.top + rect.height / 2;
    return {
      x: (deckX - arrival.x) / scale,
      y: restLift + (deckY - arrival.y) / scale,
      scale: Math.max(0.2, rect.width / (HAND_CARD_WIDTH * scale)),
    };
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const announceCardPlayRef = useRef<number | null>(null);
  const announceCardPlay = (card: CardData, side: 'player' | 'npc') => {
    if (announceCardPlayRef.current) window.clearTimeout(announceCardPlayRef.current);
    setAnnouncedCard({ card, side });
    announceCardPlayRef.current = window.setTimeout(() => setAnnouncedCard(null), 1400);
  };

  // On mobile, window.innerHeight at the very first paint often doesn't match the real
  // settled viewport yet (the browser's own URL bar is still on screen and collapses a
  // moment later), which fires a resize -> windowSize update -> boardScale change right
  // as a match starts. Since the board's own transform animates smoothly (see the 3D
  // board's transition below), that correction used to play out as a real, visible 0.8s
  // glide of the WHOLE board — deck included — overlapping the opening deal's very
  // first draw and making the card's start point (measured mid-glide) land in a
  // slightly wrong spot, as if it hadn't come from the deck at all. Suppressing the
  // smooth transition for a brief settle window after a match starts makes any such
  // correction snap instantly instead of visibly animating, so by the time the deal's
  // first card measures the deck it's already sitting at its true final position.
  const [viewportSettled, setViewportSettled] = useState(false);
  useEffect(() => {
    if (!gameMode) { setViewportSettled(false); return; }
    const t = window.setTimeout(() => setViewportSettled(true), 500);
    return () => window.clearTimeout(t);
  }, [gameMode]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pending timers for the match-intro sequence (see startMatchIntro) — tracked so a
  // fresh resetGame (e.g. backing out to the menu and starting a new match right away)
  // can cancel any that haven't fired yet instead of letting a stale sequence land on
  // top of the new match.
  const matchIntroTimeoutsRef = useRef<number[]>([]);

  // Brings both Generals onto the board, then deals both starting hands (5 cards each)
  // with a staggered "drawn from the deck" beat — the player's own draw-animation
  // viewState for their hand, and incrementally revealing the opponent's face-down
  // hand for theirs — so the match visibly begins instead of the board and both hands
  // just appearing fully set up the instant the match starts.
  const startMatchIntro = () => {
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      matchIntroTimeoutsRef.current.push(id);
    };

    schedule(() => {
      setPlayerSlots(prev => { const next = [...prev]; next[12] = generalPlayerRef.current; return next; });
      setNpcSlots(prev => { const next = [...prev]; next[12] = generalNpcRef.current; return next; });
    }, 300);

    // Kept comfortably past the 500ms viewport-settle window above (see
    // viewportSettled) so the deck's on-screen position is already final, not still
    // correcting itself, by the time the first card's flight measures it.
    const DEAL_START = 1300;
    const DEAL_STEP = 820;
    for (let i = 0; i < 5; i++) {
      const t = DEAL_START + i * DEAL_STEP;
      schedule(() => {
        const newCard = drawFromDeck();
        const origin = computeDrawOrigin(playerDeckRef, handRef.current.length);
        if (origin) drawOriginsRef.current[newCard.id] = origin;
        setHand(prev => [...prev, newCard]);
      }, t);
      schedule(() => setNpcHand(prev => [...prev, drawFromNpcDeck()]), t + 400);
    }
  };

  // deckId is which deck the PLAYER picked at the Quick Match screen; the AI
  // always plays the other one, so every match shows both decks in action.
  const resetGame = (deckId: DeckId = 'capitao') => {
    matchIntroTimeoutsRef.current.forEach(clearTimeout);
    matchIntroTimeoutsRef.current = [];

    const npcDeckId: DeckId = deckId === 'capitao' ? 'cardeal' : 'capitao';
    playerDeckPoolRef.current = DECKS[deckId].pool;
    npcDeckPoolRef.current = DECKS[npcDeckId].pool;
    generalPlayerRef.current = DECKS[deckId].general;
    generalNpcRef.current = DECKS[npcDeckId].general;
    deckQueueRef.current = [];
    npcDeckQueueRef.current = [];

    setGameOverWinner(null);
    setCurrentTurn('player');
    setTurnNumber(1);
    setTurnPhase('preparacao');
    setMovedSlots(new Set());
    setSelectedMoverIndex(null);
    setBonusRepositions(0);
    setPendingTacticAction(null);
    setBatedorFreeMove(null);
    setAmbushPrompt(null);
    setPlayerGeneralAbilityUses(0);
    setNpcGeneralAbilityUses(0);
    setGeneralAbilityPrompt(null);
    setPendingGeneralHeal(null);
    setPlayerMana(10);
    setNpcMana(10);
    setSelectedCardIndex(null);
    setSelectedAttackerIndex(null);
    setViewState('hand');

    // Start from a clean, empty board and hand — startMatchIntro (above) brings the
    // Generals and both starting hands on with a visible entrance. Each side's General
    // is the only thing that belongs on the board at kickoff; no other cards should be
    // there until actually played.
    setHand([]);
    setNpcHand([]);
    setPlayerSlots(Array(13).fill(null));
    setNpcSlots(Array(13).fill(null));
    setPlayerGraveyard([]);
    setNpcGraveyard([]);

    startMatchIntro();
  };

  const startGame = (mode: string, deckId?: DeckId) => {
    resetGame(deckId);
    setGameMode(mode);
  };

  useEffect(() => {
    if (currentTurn === 'player') {
      // Ouro (gold) is a persistent economy, not a Hearthstone-style mana crystal that
      // refills to a fixed amount every turn: it starts at 10, sits still through turns
      // 1-2, then grows by +4 every turn from turn 3 onward with no upper cap — and
      // whatever wasn't spent carries over. So a big play can be saved up for instead
      // of always being locked to what a single turn's allowance affords.
      if (turnNumber >= 3) {
        setPlayerMana(prev => prev + 4);
        spawnFloatingNumberAtId('player-gold-badge', 4, 'gold-gain');
      }
      // The NPC's turn forces viewState to 'field' (zoomed out to watch it play), which
      // leaves the hand tray dimmed and pushed down off-screen (see the Hand UI's own
      // animate below) — nothing ever brought it back once play returned to the
      // player, so the hand looked like it had vanished. Bring it back to 'hand' here.
      setViewState('hand');
      // Fresh turn, fresh phase cycle — back to Preparação and every unit's move
      // available again. A single banner here (not a Compra-then-Preparação pair —
      // see git history) sidesteps a real bug that pairing had: its second banner
      // was scheduled to fire at the exact millisecond the first one's own cleanup
      // timer did, and depending on timer ordering the second could get its state
      // clobbered by the first's before ever finishing its entrance.
      // Same reasoning applies to "Seu Turno" below: fire it THEN chain the phase
      // banner after its own full cycle, rather than the two racing for the same
      // phaseBanner state in the same tick (which just clobbers one before it can
      // ever render). Only for an actual handoff (turnNumber > 1) — the very first
      // turn of a match has no "other side just finished" to announce.
      if (turnNumber > 1) {
        announceTurnChange('player');
        window.setTimeout(() => announcePhase('preparacao'), PHASE_BANNER_DURATION_MS);
      } else {
        announcePhase('preparacao');
      }
      setTurnPhase('preparacao');
      setMovedSlots(new Set());
      setSelectedMoverIndex(null);
      setBonusRepositions(0);
      setBatedorFreeMove(null);
      setPlayerGeneralAbilityUses(0);
      // See pendingPlayerGeneralAbilityBlock's own comment for why this is a ref,
      // not state: playerGeneralAbilityAvailable reads it straight off at render
      // time, and a ref mutation (unlike a sibling setState call made in this same
      // effect) is visible on the very next render this effect's own other
      // setState calls already force.
      playerGeneralAbilityBlockedThisTurnRef.current = pendingPlayerGeneralAbilityBlock;
      if (pendingPlayerGeneralAbilityBlock) setPendingPlayerGeneralAbilityBlock(false);
      setPlayerActivatedAbilityIds(new Set());
      setPlayerAttackCounts({});
      if (turnNumber > 1 && hand.length < 10) {
        const newCard = drawFromDeck();
        const origin = computeDrawOrigin(playerDeckRef, hand.length);
        if (origin) drawOriginsRef.current[newCard.id] = origin;
        setHand(prev => [...prev, newCard]);
      }
      // Intendente do Exército: "Uma vez por turno: se você tiver menos de 2 cartas
      // na mão, compre até ficar com 2." A passive check (no button, unlike
      // Mercador da Cruzada/Cavaleiro Hospitalário) piggybacked on this same
      // once-per-turn-start effect instead of a separate per-turn guard.
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => playerSlots[i] && !playerSlots[i]?.isDestroyed && playerSlots[i]?.name === 'Intendente do Exército')) {
        setHand(prev => prev.length >= 2 ? prev : [...prev, ...Array.from({ length: 2 - prev.length }, () => drawFromDeck())]);
      }
    } else {
      if (turnNumber >= 3) {
        setNpcMana(prev => prev + 4);
        spawnFloatingNumberAtId('npc-gold-badge', 4, 'gold-gain');
      }
      setViewState('field');
      setNpcGeneralAbilityUses(0);
      // Same ref-not-state reasoning as the player branch above, but here it's
      // load-bearing for a different reason: the AI-turn-runner effect below
      // fires in this exact same currentTurn-change pass, and its closure would
      // otherwise still see the pre-update value if this were plain state (a
      // sibling effect's setState isn't visible to another effect's closure
      // until a further render — a ref mutation is immediate).
      npcGeneralAbilityBlockedThisTurnRef.current = pendingNpcGeneralAbilityBlock;
      if (pendingNpcGeneralAbilityBlock) setPendingNpcGeneralAbilityBlock(false);
      if (turnNumber > 1 && npcHand.length < 10) {
        setNpcHand(prev => [...prev, drawFromNpcDeck()]);
      }
      // Intendente do Exército, NPC side — same passive check as the player's own above.
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => npcSlots[i] && !npcSlots[i]?.isDestroyed && npcSlots[i]?.name === 'Intendente do Exército')) {
        setNpcHand(prev => prev.length >= 2 ? prev : [...prev, ...Array.from({ length: 2 - prev.length }, () => drawFromNpcDeck())]);
      }
    }
  }, [currentTurn, turnNumber]);

  useEffect(() => {
    if (currentTurn === 'npc' && gameMode === 'Quick Match' && !isAnimating && !gameOverWinner) {
      const runAiTurn = async () => {
        setIsAnimating(true);
        // No real gated phases on the AI's side (it just runs its whole turn as one
        // sequence), but the phase-tag column mirrored onto its own field (see
        // npcVisiblePhase below) reads better showing SOMETHING than always sitting
        // dark — Preparação while it's still placing cards, Combate once it starts
        // attacking. There's no Movimentação beat since the AI never repositions its
        // own units (see the end-of-turn comment further down).
        setNpcVisiblePhase('preparacao');
        const { actions, playedCardIds } = playAiTurn(npcSlots, playerSlots, npcMana, npcHandRef.current, getValidAttackTargets, turnNumber);
        if (playedCardIds.length > 0) {
          setNpcHand(prev => prev.filter(c => !playedCardIds.includes(c.id)));
        }

        let currentNpcSlots = [...npcSlots];
        let currentPlayerSlots = [...playerSlots];
        let currentNpcMana = npcMana;
        let playerGeneralFell = false;

        // Cardeal Pedro, Voz da Fé's General ability (see resolveGeneralHeal/GENERAL_ABILITIES
        // below for the player-facing version of the exact same rule) has no target
        // to pick for the AI — it just always heals its currently weakest ally,
        // spending gold for the bigger heal whenever it can afford to. Mirrors the
        // player's own once-or-twice-per-turn cap (Cálice da Graça) instead of a
        // separate, potentially more generous rule for the opponent.
        // Infiltrado da Ordem: blocked for exactly the turn after the General took
        // damage (see npcGeneralAbilityBlockedThisTurnRef's own comment above).
        if (currentNpcSlots[12]?.name === 'Cardeal Pedro, Voz da Fé' && !npcGeneralAbilityBlockedThisTurnRef.current) {
          const maxUses = currentNpcSlots[10]?.name === 'Cálice da Graça' ? 2 : 1;
          let usesThisTurn = 0;
          while (usesThisTurn < maxUses) {
            const allyIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => currentNpcSlots[i]);
            if (allyIndices.length === 0) break;
            const weakest = allyIndices.reduce((a, b) => currentNpcSlots[a]!.hp <= currentNpcSlots[b]!.hp ? a : b);
            const payGold = currentNpcMana >= 1;
            const healAmount = payGold ? 3 : 1;
            if (payGold) currentNpcMana -= 1;
            let healed = { ...currentNpcSlots[weakest]!, hp: currentNpcSlots[weakest]!.hp + healAmount };
            // Recruta Devoto: "Ao ser curado: recebe +1 ATK permanente."
            if (healed.name === 'Recruta Devoto') healed = { ...healed, atk: healed.atk + 1 };
            currentNpcSlots[weakest] = healed;
            usesThisTurn++;
          }
          if (usesThisTurn > 0) {
            setNpcGeneralAbilityUses(usesThisTurn);
            setNpcSlots([...currentNpcSlots]);
            setNpcMana(currentNpcMana);
            showToast(`O oponente usou a habilidade do General (${usesThisTurn}x)!`);
            await new Promise(resolve => setTimeout(resolve, 700));
          }
        }

        // Mercador da Cruzada / Cavaleiro Hospitalário: the same once-per-turn creature
        // abilities as the player's own copies (see activateComercianteDasCruzadas/
        // activateHospitalario below), just auto-run with no UI — every living copy
        // on the NPC's board fires once, same as the player only ever gets one
        // activation per copy per turn.
        for (let i = 0; i <= 9; i++) {
          const ownedCard = currentNpcSlots[i];
          if (!ownedCard || ownedCard.isDestroyed) continue;
          if (ownedCard.name === 'Mercador da Cruzada') {
            if (npcDeckQueueRef.current.length < 2) {
              npcDeckQueueRef.current = [...npcDeckQueueRef.current, ...[...npcDeckPoolRef.current].sort(() => Math.random() - 0.5)];
            }
            const revealed = npcDeckQueueRef.current.splice(0, 2);
            if (revealed.length > 0) {
              // Not real strategy, just a simple heuristic: prefer an actual
              // creature over a 0/0 Tática/Emboscada, otherwise take the first.
              const creatureIdx = revealed.findIndex(c => c.cardType !== 'Tática' && c.cardType !== 'Emboscada');
              const pickIdx = creatureIdx !== -1 ? creatureIdx : 0;
              const chosen = revealed[pickIdx];
              const leftovers = revealed.filter((_, idx) => idx !== pickIdx);
              npcDeckQueueRef.current = [...npcDeckQueueRef.current, ...leftovers];
              setNpcHand(prev => [...prev, { ...chosen, id: `npc_hand_${Date.now()}_${Math.random()}` }]);
            }
          } else if (ownedCard.name === 'Cavaleiro Hospitalário') {
            const allyIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(j => currentNpcSlots[j] && !currentNpcSlots[j]!.isDestroyed && isCardDamaged(currentNpcSlots[j]!));
            if (allyIndices.length > 0) {
              const weakest = allyIndices.reduce((a, b) => currentNpcSlots[a]!.hp <= currentNpcSlots[b]!.hp ? a : b);
              let healed = { ...currentNpcSlots[weakest]!, hp: currentNpcSlots[weakest]!.hp + 1 };
              if (healed.name === 'Recruta Devoto') healed = { ...healed, atk: healed.atk + 1 };
              currentNpcSlots[weakest] = healed;
            }
            const enemyVanguardaIndices = [0, 1, 2, 3, 4].filter(j => currentPlayerSlots[j] && !currentPlayerSlots[j]!.isDestroyed);
            if (enemyVanguardaIndices.length > 0) {
              const dmgTarget = enemyVanguardaIndices[Math.floor(Math.random() * enemyVanguardaIndices.length)];
              const dmg = applyDamageToSlot(currentPlayerSlots, dmgTarget, 1);
              currentPlayerSlots = dmg.slots;
              if (dmg.destroyed) {
                setPlayerGraveyard(g => [...g, ...withEquippedWeapons([dmg.destroyed!])]);
                drawForAtiradorInfluente([dmg.destroyed], true);
              }
            }
          }
        }
        setNpcSlots([...currentNpcSlots]);
        setPlayerSlots([...currentPlayerSlots]);

        for (const action of actions) {
          if (action.type === 'play_card') {
            // General (12) is fixed at game start; Relíquia/Terreno slots (10/11) are off-limits to the AI's generic minions
            if (action.slotIndex >= 10) continue;
            // Show the card big in the corner and pause on it for a beat BEFORE it lands
            // on the board — the opponent used to slap cards down almost instantly, too
            // fast to read on a small phone screen, and this fixes both problems at once.
            announceCardPlay(action.card, 'npc');
            await new Promise(resolve => setTimeout(resolve, 1000));
            currentNpcSlots[action.slotIndex] = action.card;
            // Nobre da Cruzada: "Ao entrar em campo: invoca Soldados Leais..." —
            // applies regardless of which side plays it.
            currentNpcSlots = applyNobreReligiosoSummon(currentNpcSlots, action.slotIndex);
            currentNpcMana -= action.card.cost;
            setNpcSlots([...currentNpcSlots]);
            setNpcMana(currentNpcMana);
            spawnFloatingNumberAtId('npc-gold-badge', action.card.cost, 'gold-spend');
            await new Promise(resolve => setTimeout(resolve, 700));
          } else if (action.type === 'attack') {
            setNpcVisiblePhase('combate');
            setAttackAnim({ attackerIndex: action.attackerSlot, targetIndex: action.targetSlot, isPlayerAttacking: false });
            await new Promise(resolve => setTimeout(resolve, 300));

            playAttackSfx();
            setIsImpacting(true);
            await new Promise(resolve => setTimeout(resolve, 200));
            setIsImpacting(false);

            const attacker = currentNpcSlots[action.attackerSlot];
            if (!attacker) continue;

            let hasDestroyed = false;

            let defender = currentPlayerSlots[action.targetSlot];
            let targetSlot = action.targetSlot;
            if (defender) {
              const ambushCard = await maybeActivatePlayerAmbush(attacker, defender, currentNpcSlots);
              let cancelled = false;
              if (ambushCard) {
                const resolved = resolveAmbushEffect(ambushCard, currentNpcSlots, action.attackerSlot, currentPlayerSlots, action.targetSlot);
                currentNpcSlots = resolved.attackerSlots;
                currentPlayerSlots = resolved.defenderSlots;
                targetSlot = resolved.defenderIndex;
                defender = resolved.defender;
                cancelled = resolved.cancelled;
                setNpcSlots([...currentNpcSlots]);
                setPlayerSlots([...currentPlayerSlots]);
              }

              if (!cancelled && defender) {
                let attackerAtk = getEffectiveAtk(attacker, action.attackerSlot, currentNpcSlots, currentPlayerSlots);
                // Fanático da Cruzada — see the exact same check (and its comment) in
                // handleNpcSlotClick above; this is the AI-side mirror of it.
                if (attacker.name === 'Fanático da Cruzada' && currentPlayerSlots[12] && currentPlayerSlots[12]?.name !== 'Cardeal Pedro, Voz da Fé') attackerAtk += 2;
                const defenderAtk = getEffectiveAtk(defender, targetSlot, currentPlayerSlots, currentNpcSlots);
                const attackerReduction = getIncomingDamageReduction(action.attackerSlot, currentNpcSlots);
                const defenderReduction = getIncomingDamageReduction(targetSlot, currentPlayerSlots);
                const attackerHpBonus = (attacker.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(attacker, currentNpcSlots);
                const defenderHpBonus = (defender.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(defender, currentPlayerSlots);
                const damageToDefender = Math.max(0, attackerAtk - defenderReduction);
                const damageToAttacker = Math.max(0, defenderAtk - attackerReduction);

                // Infiltrado da Ordem — see the exact same check (and its comment) in
                // handleNpcSlotClick above; here the DEFENDER's side is the player.
                if (targetSlot === 12 && damageToDefender > 0 && hasEspiaoOnBoard(currentPlayerSlots)) {
                  setPendingPlayerGeneralAbilityBlock(true);
                  showToast('Infiltrado da Ordem: a habilidade do seu General foi bloqueada no seu próximo turno!');
                }

                const updatedAttacker = {
                  ...attacker,
                  hp: attacker.hp + attackerHpBonus - damageToAttacker,
                  pendingCombatBonus: undefined,
                };
                const updatedDefender = {
                  ...defender,
                  hp: defender.hp + defenderHpBonus - damageToDefender,
                  pendingCombatBonus: undefined,
                };

                // Hearthstone-style floating combat numbers — mirrors the player-
                // attacking block in handleNpcSlotClick above.
                spawnFloatingNumberAtId(`npc-${action.attackerSlot}`, damageToAttacker, 'damage');
                spawnFloatingNumberAtId(`player-${targetSlot}`, damageToDefender, 'damage');

                if (updatedAttacker.hp <= 0) {
                  currentNpcSlots[action.attackerSlot] = { ...updatedAttacker, isDestroyed: true };
                  hasDestroyed = true;
                } else {
                  currentNpcSlots[action.attackerSlot] = updatedAttacker;
                }

                if (updatedDefender.hp <= 0) {
                  currentPlayerSlots[targetSlot] = { ...updatedDefender, isDestroyed: true };
                  hasDestroyed = true;
                  if (updatedDefender.cardType === 'General') {
                    playerGeneralFell = true;
                  }
                } else {
                  currentPlayerSlots[targetSlot] = updatedDefender;
                }

                // Jorge, Lança Sagrada: "Ao atacar a Vanguarda: causa 2 de dano à
                // unidade na Retaguarda da mesma coluna." A splash side-effect,
                // independent of whether the main target survived.
                if (attacker.name === 'Jorge, Lança Sagrada' && isFrontline(targetSlot) && currentPlayerSlots[targetSlot + 5]) {
                  spawnFloatingNumberAtId(`player-${targetSlot + 5}`, 2, 'damage');
                  const splash = applyDamageToSlot(currentPlayerSlots, targetSlot + 5, 2);
                  currentPlayerSlots = splash.slots;
                  if (splash.destroyed) {
                    setPlayerGraveyard(g => [...g, ...withEquippedWeapons([splash.destroyed!])]);
                    drawForAtiradorInfluente([splash.destroyed], true);
                    hasDestroyed = true;
                  }
                }
              }

              setNpcSlots([...currentNpcSlots]);
              setPlayerSlots([...currentPlayerSlots]);
            }

            setAttackAnim(null);

            if (playerGeneralFell) break;

            if (hasDestroyed) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              const destroyedNpcCards = currentNpcSlots.filter((c): c is CardData => !!c?.isDestroyed);
              const destroyedPlayerCards = currentPlayerSlots.filter((c): c is CardData => !!c?.isDestroyed);
              if (destroyedNpcCards.length) {
                setNpcGraveyard(g => [...g, ...withEquippedWeapons(destroyedNpcCards)]);
                drawForAtiradorInfluente(destroyedNpcCards, false);
              }
              if (destroyedPlayerCards.length) {
                setPlayerGraveyard(g => [...g, ...withEquippedWeapons(destroyedPlayerCards)]);
                drawForAtiradorInfluente(destroyedPlayerCards, true);
              }
              currentNpcSlots = currentNpcSlots.map(c => c?.isDestroyed ? null : c);
              currentPlayerSlots = currentPlayerSlots.map(c => c?.isDestroyed ? null : c);
              setNpcSlots([...currentNpcSlots]);
              setPlayerSlots([...currentPlayerSlots]);
            } else {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
        }

        if (playerGeneralFell) {
          setGameOverWinner('npc');
          setNpcVisiblePhase(null);
          setIsAnimating(false);
          return;
        }

        // The NPC's own turn just ended too — same Soldado Tático end-of-turn swap
        // as the player's side (see applyEndOfTurnSwaps), in case the AI ends up
        // playing Deck Capitão this match (see resetGame). Aurelion's active isn't
        // mirrored here: it only fires off actual repositioning, and the AI never
        // repositions its own units (see the Relíquia/Terreno skip above).
        currentNpcSlots = applyEndOfTurnSwaps(currentNpcSlots);
        setNpcSlots([...currentNpcSlots]);

        setNpcVisiblePhase(null);
        setCurrentTurn('player');
        setTurnNumber(prev => prev + 1);
        setIsAnimating(false);
      };
      
      const timer = setTimeout(runAiTurn, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameMode, gameOverWinner]);

  // Bridges the one-render gap between handlePlayCardButtonClick committing a
  // targetable Tática (spending its mana/hand slot and setting pendingTacticAction
  // — see the TARGETABLE_TACTICS branch there, defined further down) and
  // resolveOwnTacticTarget/resolveEnemyTacticTarget actually being safe to call,
  // since both read pendingTacticAction straight off state rather than taking it
  // as a parameter. Declared up here (ahead of the assetsReady/gameMode early
  // returns below, unlike resolveOwnTacticTarget itself) because this IS a hook —
  // conditionally skipping a useEffect call on some renders but not others breaks
  // React's hook-order tracking. Referencing resolveOwnTacticTarget/
  // resolveEnemyTacticTarget before their own declaration further down is safe
  // here specifically because this callback only actually runs after the whole
  // component function (including those declarations) has finished executing for
  // that render. pendingDropTargetRef is set by handleSlotClick's/
  // handleNpcSlotClick's own occupied-slot-tap branches right before they call
  // handlePlayCardButtonClick (see getCardDropKind's ownTarget/enemyTarget kinds)
  // — any other path into pendingTacticAction leaves it null and this effect is a
  // no-op, same as before that tap-to-target flow existed.
  useEffect(() => {
    if (pendingTacticAction && pendingDropTargetRef.current) {
      const target = pendingDropTargetRef.current;
      pendingDropTargetRef.current = null;
      if (target.side === 'own') resolveOwnTacticTarget(target.index);
      else resolveEnemyTacticTarget(target.index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTacticAction]);

  if (!assetsReady) {
    return <LoadingScreen onDone={() => setAssetsReady(true)} />;
  }

  if (!gameMode) {
    return (
      <div className="relative w-full h-dvh bg-zinc-950 text-white">
        <MainMenu onSelectMode={(mode) => {
          if (mode === 'Quick Match') setDeckPickerOpen(true);
          else startGame(mode);
        }} />
        <AnimatePresence>
          {deckPickerOpen && (
            <DeckPickerModal
              onSelect={(deckId) => { setDeckPickerOpen(false); startGame('Quick Match', deckId); }}
              onClose={() => setDeckPickerOpen(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {installPromptKind && (
            <InstallPrompt
              kind={installPromptKind}
              onInstall={handleInstallClick}
              onDismiss={() => setInstallPromptKind(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  const handleCardClick = (index: number) => {
    if (viewState === 'field') return; // hand cards are non-interactive once zoomed to the board
    if (phaseTransitionLock) return; // see announcePhase — a phase banner is still on screen
    if (turnPhase !== 'preparacao') {
      showToast("Jogar cartas só na fase de Preparação!");
      return;
    }
    if (selectedCardIndex === index) {
      // Tapped the already-selected card again. For a card with a real board
      // destination (place a creature/Relíquia/Terreno, or target a Tática at an
      // occupied slot — see getCardDropKind), that destination is a highlighted
      // slot elsewhere on the board (see getPlayerSlotHint/isTacticTargetSlot), so
      // re-tapping the card itself just cancels the selection. An immediate-effect
      // or blocked card (Reformar Linhas, Tributo de Guerra, Emboscada, ...) has no
      // such destination at all — the card itself IS the only thing to tap to
      // confirm it, so this second tap plays it instead (handlePlayCardButtonClick
      // resolves it fully, or shows the explanatory toast for a blocked one).
      // Canceling one of those instead is still one tap away, on the background.
      const kind = getCardDropKind(hand[index]);
      if (kind === 'immediate' || kind === 'blocked') {
        handlePlayCardButtonClick();
      } else {
        setSelectedCardIndex(null);
      }
    } else {
      // First tap: bring the card to the front of the overlapping fan as an
      // enlarged, clearly-selected preview, without leaving the hand view yet —
      // the board highlights this card's valid destinations at the same time
      // (see getPlayerSlotHint/isTacticTargetSlot), so tapping one of those next
      // plays it straight from here.
      setSelectedCardIndex(index);
      setSelectedAttackerIndex(null);
      playSelectSfx();
    }
  };

  const handlePlayCardButtonClick = () => {
    const card = hand[selectedCardIndex!];
    if (playerMana < card.cost) {
      showToast("Ouro insuficiente!");
      return;
    }

    // Reformar Linhas: no target to pick, it just grants bonus reposition moves —
    // resolve it immediately instead of zooming to the board for nothing.
    if (card.name === 'Reformar Linhas') {
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setPlayerGraveyard(g => [...g, card]);
      setBonusRepositions(prev => prev + 3);
      setSelectedCardIndex(null);
      showToast('Reformar Linhas: +3 reposicionamentos bônus neste turno!');
      return;
    }

    // Tributo de Guerra (Deck Cardeal): immediate, no target.
    if (card.name === 'Tributo de Guerra') {
      setPlayerMana(prev => prev - card.cost + 1);
      const netGoldChange = 1 - card.cost;
      if (netGoldChange >= 0) spawnFloatingNumberAtId('player-gold-badge', netGoldChange, 'gold-gain');
      else spawnFloatingNumberAtId('player-gold-badge', -netGoldChange, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setPlayerGraveyard(g => [...g, card]);
      setSelectedCardIndex(null);
      showToast('Tributo de Guerra: +1 ouro neste turno!');
      return;
    }

    // Trabuco de Cerco (Deck Cardeal): "Causa 2 de dano a TODAS as unidades inimigas" —
    // immediate AOE, no target to pick. Hits every enemy creature/General (0-9,
    // 12) — the Relíquia/Terreno slots (10/11) aren't "unidades".
    if (card.name === 'Trabuco de Cerco') {
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setPlayerGraveyard(g => [...g, card]);
      setSelectedCardIndex(null);
      let nextNpcSlots = [...npcSlots];
      const destroyed: CardData[] = [];
      let npcGeneralFell = false;
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12].forEach(i => {
        if (!nextNpcSlots[i]) return;
        spawnFloatingNumberAtId(`npc-${i}`, 2, 'damage');
        const result = applyDamageToSlot(nextNpcSlots, i, 2);
        nextNpcSlots = result.slots;
        if (result.destroyed) {
          destroyed.push(result.destroyed);
          if (result.destroyed.cardType === 'General') npcGeneralFell = true;
        }
      });
      setNpcSlots(nextNpcSlots);
      if (destroyed.length) {
        setNpcGraveyard(g => [...g, ...withEquippedWeapons(destroyed)]);
        drawForAtiradorInfluente(destroyed, false);
      }
      showToast('Trabuco de Cerco: 2 de dano a todas as unidades inimigas!');
      if (npcGeneralFell) setGameOverWinner('player');
      return;
    }

    // The other 4 targetable Táticas (see TARGETABLE_TACTICS) — commit to playing
    // the card now (same as any other card, mana spent and out of hand), then wait
    // for the player to click its target instead of a slot to place it in.
    const kind = TARGETABLE_TACTICS[card.name];
    if (kind) {
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setPendingTacticAction({ card, kind });
      setSelectedCardIndex(null);
      setViewState('field');
      showToast(TACTIC_TARGET_PROMPTS[kind]);
      return;
    }

    // Retorno do Soldado: reclaim one soldier from your own graveyard.
    if (card.name === 'Retorno do Soldado') {
      const candidates = playerGraveyard.filter(c => SOLDIER_TYPES.includes(c.cardType as CardType));
      if (candidates.length === 0) {
        setSelectedCardIndex(null);
        showToast('Não há soldados no cemitério.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setSelectedCardIndex(null);
      openCardPicker('Escolha um soldado do cemitério para adicionar à mão', candidates, 1, (picked) => {
        const chosen = picked[0];
        setPlayerGraveyard(g => g.filter(c => c.id !== chosen.id).concat(card));
        setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}`, isDestroyed: undefined }]);
        setCardPicker(null);
        showToast(`${chosen.name} voltou para sua mão!`);
      });
      return;
    }

    // Graal da Dádiva: search the deck for a Terreno or Relíquia.
    if (card.name === 'Graal da Dádiva') {
      const candidates = playerDeckPoolRef.current.filter(c => c.cardType === 'Terreno' || c.cardType === 'Relíquia');
      if (candidates.length === 0) {
        setSelectedCardIndex(null);
        showToast('Não há Terreno ou Relíquia no deck.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setSelectedCardIndex(null);
      openCardPicker('Escolha uma carta de Terreno ou Relíquia do deck', candidates, 1, (picked) => {
        const chosen = picked[0];
        setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}` }]);
        setPlayerGraveyard(g => [...g, card]);
        setCardPicker(null);
        showToast(`${chosen.name} adicionada à mão!`);
      });
      return;
    }

    // Doutrina Renovada: search the deck for any Tática.
    if (card.name === 'Doutrina Renovada') {
      const candidates = playerDeckPoolRef.current.filter(c => c.cardType === 'Tática');
      if (candidates.length === 0) {
        setSelectedCardIndex(null);
        showToast('Não há Táticas no deck.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setSelectedCardIndex(null);
      openCardPicker('Escolha uma Tática do deck para adicionar à mão', candidates, 1, (picked) => {
        const chosen = picked[0];
        setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}` }]);
        setPlayerGraveyard(g => [...g, card]);
        setCardPicker(null);
        showToast(`${chosen.name} adicionada à mão!`);
      });
      return;
    }

    // Recrutamento Seletivo: search the deck for any soldier.
    if (card.name === 'Recrutamento Seletivo') {
      const candidates = playerDeckPoolRef.current.filter(c => SOLDIER_TYPES.includes(c.cardType as CardType));
      if (candidates.length === 0) {
        setSelectedCardIndex(null);
        showToast('Não há soldados no deck.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setSelectedCardIndex(null);
      openCardPicker('Escolha um soldado do deck para adicionar à mão', candidates, 1, (picked) => {
        const chosen = picked[0];
        setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}` }]);
        setPlayerGraveyard(g => [...g, card]);
        setCardPicker(null);
        showToast(`${chosen.name} adicionada à mão!`);
      });
      return;
    }

    // Recrutar Veteranos: reveal the real top 4 of the deck (not just the pool —
    // this one actually cares about draw order), keep 2, bottom 2.
    if (card.name === 'Recrutar Veteranos') {
      if (deckQueueRef.current.length < 4) {
        deckQueueRef.current = [...deckQueueRef.current, ...[...playerDeckPoolRef.current].sort(() => Math.random() - 0.5)];
      }
      const revealed = deckQueueRef.current.splice(0, 4);
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setSelectedCardIndex(null);
      openCardPicker('Veja as 4 cartas do topo — escolha 2 para a mão', revealed, 2, (picked) => {
        const pickedIds = new Set(picked.map(c => c.id));
        const leftovers = revealed.filter(c => !pickedIds.has(c.id));
        deckQueueRef.current = [...deckQueueRef.current, ...leftovers];
        setHand(prev => [...prev, ...picked.map(c => ({ ...c, id: `hand_${Date.now()}_${Math.random()}` }))]);
        setPlayerGraveyard(g => [...g, card]);
        setCardPicker(null);
        showToast(`${picked.length} carta(s) adicionada(s) à mão!`);
      });
      return;
    }

    // Chamado às Armas: summon up to 2 zero-ATK soldiers straight from the deck
    // into empty Vanguarda slots, then shuffle.
    if (card.name === 'Chamado às Armas') {
      const candidates = playerDeckPoolRef.current.filter(c => SOLDIER_TYPES.includes(c.cardType as CardType) && c.atk === 0);
      const emptyVanguarda = [0, 1, 2, 3, 4].filter(i => !playerSlots[i]);
      if (candidates.length === 0 || emptyVanguarda.length === 0) {
        setSelectedCardIndex(null);
        showToast(candidates.length === 0 ? 'Não há soldados de 0 ATK no deck.' : 'Não há slots livres na Vanguarda.');
        return;
      }
      setPlayerMana(prev => prev - card.cost);
      spawnFloatingNumberAtId('player-gold-badge', card.cost, 'gold-spend');
      setHand(prev => prev.filter((_, i) => i !== selectedCardIndex));
      playTacticSfx();
      setSelectedCardIndex(null);
      openCardPicker(
        `Escolha até ${Math.min(2, emptyVanguarda.length)} soldado(s) de 0 ATK para invocar na Vanguarda`,
        candidates,
        Math.min(2, emptyVanguarda.length),
        (picked) => {
          setPlayerSlots(prev => {
            const next = [...prev];
            picked.forEach((chosen, i) => {
              const slot = emptyVanguarda[i];
              if (slot !== undefined) next[slot] = { ...chosen, id: `hand_${Date.now()}_${Math.random()}_${i}` };
            });
            return next;
          });
          deckQueueRef.current = [...playerDeckPoolRef.current].sort(() => Math.random() - 0.5);
          setPlayerGraveyard(g => [...g, card]);
          setCardPicker(null);
          showToast(`${picked.length} soldado(s) invocado(s)! Deck embaralhado.`);
        }
      );
      return;
    }

    // Emboscada cards have no placement behavior at all — they only resolve via the
    // ambush interrupt when the OPPONENT attacks (see maybeActivatePlayerAmbush).
    // Dropping one on the board like a creature would just waste it as an inert 0/0
    // body forever, so keep it in hand instead.
    if (card.cardType === 'Emboscada') {
      setSelectedCardIndex(null);
      showToast('Emboscadas ativam sozinhas quando você é atacado — mantenha na mão.');
      return;
    }
    // Any other Tática reaching this point isn't handled by the immediate/targetable
    // branches above, meaning it has no implemented effect yet (see the Deck Cardeal
    // mechanics note above this component) — same reasoning as Emboscada.
    if (card.cardType === 'Tática') {
      setSelectedCardIndex(null);
      showToast('Essa Tática ainda não pode ser jogada.');
      return;
    }

    // Every branch above returns for its own specific card kind (immediate,
    // targetable Tática, Emboscada, unimplemented Tática) — reaching here means
    // `card` is a plain creature/Relíquia/Terreno ('place' kind, see
    // getCardDropKind). Those are placed straight from handleSlotClick's own
    // empty-slot branch the instant their destination is tapped, without ever
    // routing through this function, so this is an unreachable safety fallback
    // rather than a real code path.
    setViewState('field');
  };

  // True for the whole hand-off from "card selected" to "card landed on the board" — the
  // camera pre-zoom, the flight itself, and the brief settle afterward. Used to ignore
  // stray clicks that would otherwise cancel the card's selection mid-transition.
  const isCardInFlightTransition = !!(preZoomSlot || flyingCard || cameraSettling);

  // Which of the opponent's slots the currently-selected attacker can actually reach
  // (see getValidAttackTargets) — a plain per-render computation rather than a Hook
  // (this component conditionally returns early above for the main menu, so anything
  // declared here can't be a Hook call without breaking React's rules-of-hooks).
  const validAttackTargets = selectedAttackerIndex !== null
    ? getValidAttackTargets(selectedAttackerIndex, playerSlots, npcSlots)
    : new Set<number>();

  // Which slots (0-9) the currently-selected mover can reposition into this
  // Preparação phase — an empty adjacent slot, or an adjacent ally to swap with.
  // Cavaleiro Tático gets the whole row instead (see canReposition).
  const validMoveTargets = selectedMoverIndex !== null
    ? new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => canReposition(playerSlots[selectedMoverIndex!], selectedMoverIndex!, i)))
    : new Set<number>();

  // Most turns (1-2) have exactly one phase, so the plaque just reads "SEU TURNO" like
  // it always has — tapping it ends the turn directly, no extra step. Only from turn 3
  // on, when Batalha exists as a second phase, does it briefly show a named transition
  // ("AVANÇAR: BATALHA") before settling back to "SEU TURNO" for the actual end-turn tap.
  const activePhases = phasesForTurn(turnNumber);
  const isLastPhaseOfTurn = activePhases[activePhases.length - 1] === turnPhase;

  // Cálice da Graça (Relíquia, the slot-10 special slot) lets Cardeal Pedro, Voz da Fé's General
  // ability fire twice per turn instead of once — see GENERAL_ABILITIES below.
  const playerGeneralAbilityMaxUses = playerSlots[10]?.name === 'Cálice da Graça' ? 2 : 1;
  // Whether the player's own General has an activatable Fase-Principal ability ready
  // right now — drives the glowing prompt icon on the General slot (see CardSlot's
  // showAbilityPrompt call sites). Requires an actual ally on the board to heal;
  // otherwise there's nothing to target and the prompt would just dead-end.
  const playerGeneralAbilityAvailable =
    playerSlots[12]?.name === 'Cardeal Pedro, Voz da Fé' && !playerSlots[12]?.isDestroyed &&
    currentTurn === 'player' && turnPhase === 'preparacao' &&
    playerGeneralAbilityUses < playerGeneralAbilityMaxUses &&
    // Infiltrado da Ordem: blocked for exactly the one turn following the General
    // taking damage (see playerGeneralAbilityBlockedThisTurnRef's own comment).
    !playerGeneralAbilityBlockedThisTurnRef.current &&
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => playerSlots[i]);

  // Mercador da Cruzada / Cavaleiro Hospitalário: which once-per-turn creature ability
  // (if any) is available to activate on this exact player slot right now — same
  // "you may activate this" shape as playerGeneralAbilityAvailable above, just
  // per-card instead of only the General (see the Sparkles button rendered next
  // to each of these below, and activateComercianteDasCruzadas/activateHospitalario).
  const getPlayerCreatureAbilityKind = (slotIndex: number): 'comerciante' | 'hospitalario' | null => {
    if (currentTurn !== 'player' || turnPhase !== 'preparacao') return null;
    const card = playerSlots[slotIndex];
    if (!card || card.isDestroyed || playerActivatedAbilityIds.has(card.id)) return null;
    if (card.name === 'Mercador da Cruzada') return 'comerciante';
    if (card.name === 'Cavaleiro Hospitalário') return 'hospitalario';
    return null;
  };

  // Resolves a slot id to the exact element the card's own art currently renders in —
  // data-card-visual (see CardSlot) is the inner element that physically lunges during
  // an attack, while the slotId div underneath it never moves. Falling back to the slot
  // div itself covers the (non-card) General/Relíquia/Terreno special-slot markup.
  const getCardVisualEl = (slotId: string): HTMLElement | null =>
    document.querySelector(`[data-card-visual="${slotId}"]`) ?? document.getElementById(slotId);

  // A "conducting line" from the selected attacker to every occupied enemy slot — green
  // and flowing for a reachable target, dim red for one that's blocked/out of range —
  // so the lane-blocking rule reads as an obvious line on the board, not just an arrow
  // or a border color the player has to notice on their own. Uses real on-screen
  // positions (via the slotId DOM ids) rather than board-local coordinates because the
  // two ends live in a 3D-tilted board and need to line up exactly as rendered.
  const attackLines: { x1: number; y1: number; x2: number; y2: number; valid: boolean }[] = [];
  if (selectedAttackerIndex !== null) {
    const fromEl = getCardVisualEl(`player-${selectedAttackerIndex}`);
    if (fromEl) {
      const fromRect = fromEl.getBoundingClientRect();
      const from = { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 };
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(i => {
        if (!npcSlots[i]) return;
        const toEl = getCardVisualEl(`npc-${i}`);
        if (!toEl) return;
        const toRect = toEl.getBoundingClientRect();
        attackLines.push({
          x1: from.x, y1: from.y,
          x2: toRect.left + toRect.width / 2, y2: toRect.top + toRect.height / 2,
          valid: validAttackTargets.has(i),
        });
      });
    }
  }

  // Attack-related halo rings (selected attacker / valid target / invalid target) —
  // drawn here in a top-level fixed overlay via real getBoundingClientRect positions,
  // exactly like attackLines above, instead of as an <img> inside each CardSlot. They
  // used to live inside the slot itself sized at 108% so the ring would read as
  // bigger than the card, but a slot with no z-index of its own doesn't get to paint
  // above a LATER sibling slot in plain DOM order — the overflow past a card's edge
  // was getting silently painted over by whichever occupied slot happened to sit
  // next to it, which is what read as "off-center" (really "half hidden"). Hoisting
  // them to one fixed top-level layer (same trick as the attack lines) sidesteps
  // that entirely.
  const activeHalos: { key: string; x: number; y: number; w: number; h: number; image: string; scale: number; glow: string }[] = [];
  if (selectedAttackerIndex !== null) {
    const selfEl = document.getElementById(`player-${selectedAttackerIndex}`);
    if (selfEl) {
      const r = selfEl.getBoundingClientRect();
      activeHalos.push({
        key: 'self', x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height,
        image: haloSelectionImage, scale: 1.15, glow: 'drop-shadow(0 0 10px rgba(96,165,250,0.8))',
      });
    }
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(i => {
      if (!npcSlots[i]) return;
      const el = document.getElementById(`npc-${i}`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const valid = validAttackTargets.has(i);
      activeHalos.push({
        key: `npc-halo-${i}`, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height,
        image: valid ? haloValidTargetImage : haloInvalidTargetImage,
        scale: valid ? 1.15 : 1,
        glow: valid ? 'drop-shadow(0 0 10px rgba(239,68,68,0.7))' : 'drop-shadow(0 0 8px rgba(0,0,0,0.7))',
      });
    });
  }

  // A single traveling-arrow line for whichever attack is actually happening right
  // now (see attackAnim) — separate from attackLines above, which only shows the
  // PLAYER's own candidate targets before committing to one. The NPC's attack
  // never goes through that selection step, so without this the opponent hitting
  // the player was the one attack in the game with no line at all showing what
  // was attacking what.
  const activeAttackLine: { x1: number; y1: number; x2: number; y2: number; isPlayerAttacking: boolean } | null = (() => {
    if (!attackAnim) return null;
    const fromId = attackAnim.isPlayerAttacking ? `player-${attackAnim.attackerIndex}` : `npc-${attackAnim.attackerIndex}`;
    const toId = attackAnim.isPlayerAttacking ? `npc-${attackAnim.targetIndex}` : `player-${attackAnim.targetIndex}`;
    const fromEl = getCardVisualEl(fromId);
    const toEl = getCardVisualEl(toId);
    if (!fromEl || !toEl) return null;
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    return {
      x1: fromRect.left + fromRect.width / 2, y1: fromRect.top + fromRect.height / 2,
      x2: toRect.left + toRect.width / 2, y2: toRect.top + toRect.height / 2,
      isPlayerAttacking: attackAnim.isPlayerAttacking,
    };
  })();

  // Shared visual for both attackLines and activeAttackLine above: the user's
  // own reference-sheet arrow art (see the asset imports above — attackArrowRed
  // for "ally → enemy", attackArrowBlue for "enemy → ally", matching that sheet's
  // own color key) repeatedly flying from source to target and fading out at
  // each end, instead of a static line/arrowhead sitting there unmoving the whole
  // time (see git history for the earlier hand-drawn-triangle version). A faint
  // guide line stays underneath so the full path is still legible between
  // pulses. Rotation is a plain SVG transform on the (non-animated) <image> —
  // nativeAngleDeg is where that image already points by default (-90 = up, 90 =
  // down, using screen/SVG's y-grows-downward convention) so only the difference
  // from the line's own angle needs applying; only x/y (a plain translate) is
  // left for framer-motion to animate on the wrapping <motion.g>.
  const renderTravelingArrow = (
    key: string | number, x1: number, y1: number, x2: number, y2: number,
    imageUrl: string, nativeAngleDeg: number, imgW: number, imgH: number,
    glowColor: string, durationSec: number
  ) => {
    const angleDeg = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const rotate = angleDeg - nativeAngleDeg;
    return (
      <g key={key}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={glowColor} strokeWidth={6} strokeLinecap="round" opacity={0.32} />
        <motion.g
          animate={{ x: [x1, x2], y: [y1, y2], opacity: [0, 1, 1, 0] }}
          transition={{ duration: durationSec, repeat: Infinity, ease: 'easeInOut', times: [0, 0.18, 0.82, 1] }}
        >
          <image
            href={imageUrl}
            x={-imgW / 2} y={-imgH / 2} width={imgW} height={imgH}
            transform={`rotate(${rotate})`}
            style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }}
          />
        </motion.g>
      </g>
    );
  };

  // Player is defending: pause and let them choose (or decline) — the actual prompt UI
  // lives right on the eligible card(s) in the hand fan (see the "isAmbushCandidate"
  // branch in the hand render below), not a separate modal, so the player keeps seeing
  // their whole hand while deciding. This toast is just the "why did my hand just pop
  // up" context, since that part has nowhere else to live.
  const maybeActivatePlayerAmbush = (attacker: CardData, defender: CardData, attackerSlots: (CardData | null)[]): Promise<CardData | null> => {
    // Infiltrado da Ordem: "Na Vanguarda: impede Emboscadas inimigas." The DEFENDER
    // here is the player — this card has to be read on the ATTACKER's (the NPC's)
    // side to matter, since it's the attacker's own Espião that "sees through"
    // the defender's ambush. Easy to get backwards: it does NOT protect whoever
    // it's standing in front of on defense, only whoever it's attacking WITH.
    if (hasEspiaoInVanguarda(attackerSlots)) return Promise.resolve(null);
    const options = handRef.current.filter(c => c.cardType === 'Emboscada');
    if (options.length === 0) return Promise.resolve(null);
    showToast(`${attacker.name} está atacando ${defender.name} — ativar Emboscada?`);
    return new Promise(resolve => {
      setAmbushPrompt({ defenderName: defender.name, attackerName: attacker.name, options, resolve });
    });
  };

  // AI is defending: no UI, just a simple heuristic — activate if the hit would
  // otherwise destroy the unit. Always picks the first Emboscada card it's holding.
  const maybeActivateNpcAmbush = async (attacker: CardData, defender: CardData, attackerSlots: (CardData | null)[]): Promise<CardData | null> => {
    // Same rule as maybeActivatePlayerAmbush above, mirrored: the player is
    // attacking here, so it's the PLAYER's own Infiltrado da Ordem (not the NPC's,
    // even though the NPC is the one defending) that blocks the NPC's Emboscada.
    if (hasEspiaoInVanguarda(attackerSlots)) return null;
    const options = npcHandRef.current.filter(c => c.cardType === 'Emboscada');
    if (options.length === 0) return null;
    const wouldDie = defender.hp - attacker.atk <= 0;
    if (!wouldDie) return null;
    const chosen = options[0];
    await new Promise(resolve => setTimeout(resolve, 500));
    setNpcHand(prev => prev.filter(c => c.id !== chosen.id));
    setNpcGraveyard(g => [...g, chosen]);
    showToast(`O oponente ativou uma Emboscada: ${chosen.name}!`);
    playTacticSfx();
    return chosen;
  };

  // Resolves Avanço Coordenado / Linha Fechada / Ordem de Retirada once the player
  // clicks their target on their OWN board (see pendingTacticAction). Reposicionamento
  // Rápido targets the enemy board instead — see resolveEnemyTacticTarget.
  const resolveOwnTacticTarget = (slotIndex: number) => {
    if (!pendingTacticAction) return;
    const { card, kind } = pendingTacticAction;
    if (kind === 'reposicionamento_rapido' || kind === 'balesta' || kind === 'catapulta') return;
    const target = playerSlots[slotIndex];

    if (kind === 'avanco_coordenado') {
      if (slotIndex > 9 || !target) { showToast('Escolha uma unidade sua no campo.'); return; }
      if (!movedSlots.has(slotIndex)) { showToast('Essa unidade não se moveu neste turno.'); return; }
      setPlayerSlots(prev => {
        const next = [...prev];
        next[slotIndex] = { ...next[slotIndex]!, atk: next[slotIndex]!.atk + 2 };
        return next;
      });
      showToast(`${target.name} recebeu +2 ATK!`);
    } else if (kind === 'linha_fechada') {
      if (slotIndex > 9 || !target) { showToast('Escolha uma unidade sua no campo.'); return; }
      setPlayerSlots(prev => {
        const next = [...prev];
        for (let j = 0; j <= 9; j++) {
          if (areSlotsAdjacent(slotIndex, j) && next[j]) {
            next[j] = { ...next[j]!, dmgReduction: (next[j]!.dmgReduction ?? 0) + 1 };
          }
        }
        return next;
      });
      showToast('Linha Fechada: aliados adjacentes recebem menos dano!');
    } else if (kind === 'ordem_retirada') {
      if (!isFrontline(slotIndex) || !target) { showToast('Escolha uma unidade sua na Vanguarda.'); return; }
      const backIndex = slotIndex + 5;
      if (playerSlots[backIndex]) { showToast('A Retaguarda dessa coluna já está ocupada.'); return; }
      setPlayerSlots(prev => {
        const next = [...prev];
        next[backIndex] = { ...next[slotIndex]!, hp: next[slotIndex]!.hp + 2 };
        next[slotIndex] = null;
        return next;
      });
      showToast(`${target.name} recuou para a Retaguarda e recuperou 2 HP!`);
    } else if (kind === 'equip_armadura' || kind === 'equip_corcelete' || kind === 'equip_flecha' || kind === 'equip_espada') {
      // Deck Cardeal's 4 "Armamento" Táticas — the one explicit exception to
      // "Táticas are single-use and go straight to the graveyard": an equipped
      // weapon stays in play, visually stacked behind the unit it's on (see
      // CardSlot), until that unit dies (see graveyardWithEquipment).
      const allowedTypes = EQUIP_ALLOWED_TYPES[kind];
      if (slotIndex > 9 || !target || !target.cardType || !allowedTypes.includes(target.cardType)) {
        showToast(`Escolha uma unidade do tipo certo: ${allowedTypes.join(' ou ')}.`);
        return;
      }
      const atkBonus = kind === 'equip_flecha' ? 1 : kind === 'equip_espada' ? 2 : 0;
      const hpBonus = kind === 'equip_armadura' ? 2 : kind === 'equip_corcelete' ? 1 : 0;
      setPlayerSlots(prev => {
        const next = [...prev];
        const equipped = next[slotIndex]!;
        next[slotIndex] = {
          ...equipped,
          atk: equipped.atk + atkBonus,
          hp: equipped.hp + hpBonus,
          equippedWeapons: [...(equipped.equippedWeapons ?? []), card],
        };
        return next;
      });
      showToast(`${target.name} equipado: ${card.name}!`);
      setPendingTacticAction(null);
      setViewState('hand');
      return;
    }

    setPlayerGraveyard(g => [...g, card]);
    setPendingTacticAction(null);
    setViewState('hand');
  };

  // Resolves Reposicionamento Rápido once the player clicks the enemy unit to
  // displace — the only Deck Capitão Tática that targets the opponent's board.
  const resolveEnemyTacticTarget = (slotIndex: number) => {
    if (!pendingTacticAction) return;
    const { card, kind } = pendingTacticAction;
    if (kind !== 'reposicionamento_rapido' && kind !== 'balesta' && kind !== 'catapulta') return;

    if (kind === 'reposicionamento_rapido') {
      if (slotIndex > 9 || !npcSlots[slotIndex]) { showToast('Escolha uma unidade inimiga no campo.'); return; }
      const emptyAdjacent = [slotIndex - 1, slotIndex + 1, slotIndex - 5, slotIndex + 5]
        .filter(j => areSlotsAdjacent(slotIndex, j) && !npcSlots[j]);
      if (emptyAdjacent.length > 0) {
        const dest = emptyAdjacent[Math.floor(Math.random() * emptyAdjacent.length)];
        setNpcSlots(prev => {
          const next = [...prev];
          next[dest] = next[slotIndex];
          next[slotIndex] = null;
          return next;
        });
        showToast('Reposicionamento Rápido: unidade inimiga deslocada!');
      } else {
        showToast('Não havia slot livre adjacente para deslocar a unidade.');
      }
    } else if (kind === 'balesta') {
      if (slotIndex > 9 || !npcSlots[slotIndex]) { showToast('Escolha uma unidade inimiga no campo.'); return; }
      const result = applyDamageToSlot(npcSlots, slotIndex, 3);
      setNpcSlots(result.slots);
      if (result.destroyed) {
        setNpcGraveyard(g => [...g, ...withEquippedWeapons([result.destroyed!])]);
        drawForAtiradorInfluente([result.destroyed], false);
        if (result.destroyed.cardType === 'General') setGameOverWinner('player');
      }
      showToast('Balestra de Precisão: 3 de dano causado!');
    } else if (kind === 'catapulta') {
      if (slotIndex > 9) { showToast('Escolha uma fileira inimiga (Vanguarda ou Retaguarda).'); return; }
      const row = getMoveRow(slotIndex) === 0 ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9];
      let nextNpcSlots = [...npcSlots];
      const destroyed: CardData[] = [];
      let npcGeneralFell = false;
      row.forEach(i => {
        const result = applyDamageToSlot(nextNpcSlots, i, 2);
        nextNpcSlots = result.slots;
        if (result.destroyed) {
          destroyed.push(result.destroyed);
          if (result.destroyed.cardType === 'General') npcGeneralFell = true;
        }
      });
      setNpcSlots(nextNpcSlots);
      if (destroyed.length) {
        setNpcGraveyard(g => [...g, ...withEquippedWeapons(destroyed)]);
        drawForAtiradorInfluente(destroyed, false);
      }
      if (npcGeneralFell) setGameOverWinner('player');
      showToast('Catapulta de Guerra: 2 de dano em toda a fileira!');
    }

    setPlayerGraveyard(g => [...g, card]);
    setPendingTacticAction(null);
    setViewState('hand');
  };

  // Toggles one option in/out of the current cardPicker selection — used by the
  // multi-pick cases (Recrutar Veteranos, Chamado às Armas); single-pick cases resolve
  // immediately on tap instead (see the cardPicker modal below) and never call this.
  const toggleCardPickerSelection = (option: CardData) => {
    setCardPicker(prev => {
      if (!prev) return prev;
      const already = prev.selected.some(c => c.id === option.id);
      if (already) return { ...prev, selected: prev.selected.filter(c => c.id !== option.id) };
      if (prev.selected.length >= prev.maxPicks) return prev; // already at the cap
      return { ...prev, selected: [...prev.selected, option] };
    });
  };

  // Commits to activating the General's ability with a chosen cost/amount (the first
  // "Ativar habilidade?" step — see generalAbilityPrompt's modal below) and opens
  // targeting for the actual ally to heal, same two-step shape as a targetable Tática.
  const activateGeneralHeal = (amount: number, cost: number) => {
    if (cost > 0) {
      setPlayerMana(prev => prev - cost);
      spawnFloatingNumberAtId('player-gold-badge', cost, 'gold-spend');
    }
    setPlayerGeneralAbilityUses(prev => prev + 1);
    setPendingGeneralHeal({ amount });
    setGeneralAbilityPrompt(null);
    playTacticSfx();
    showToast('Escolha um soldado aliado para curar.');
  };

  // Resolves the heal once the player clicks their chosen ally (see pendingGeneralHeal
  // above and its dispatch at the top of handleSlotClick).
  const resolveGeneralHeal = (slotIndex: number) => {
    if (!pendingGeneralHeal) return;
    const target = playerSlots[slotIndex];
    if (slotIndex > 9 || !target) { showToast('Escolha um soldado aliado no campo.'); return; }
    const amount = pendingGeneralHeal.amount;
    setPlayerSlots(prev => {
      const next = [...prev];
      let healed = { ...next[slotIndex]!, hp: next[slotIndex]!.hp + amount };
      // Recruta Devoto: "Ao ser curado: recebe +1 ATK permanente."
      if (healed.name === 'Recruta Devoto') healed = { ...healed, atk: healed.atk + 1 };
      next[slotIndex] = healed;
      return next;
    });
    spawnFloatingNumberAtId(`player-${slotIndex}`, amount, 'heal');
    showToast(`${target.name} recuperou ${amount} HP!`);
    setPendingGeneralHeal(null);
  };

  // Mercador da Cruzada: "Uma vez por turno: veja as 2 cartas do topo do
  // deck. Adicione 1 à mão e coloque a outra no fundo." Same reveal-then-choose
  // shape as Recrutar Veteranos above (see openCardPicker there), just N=2/keep=1
  // and triggered from the card's own on-board prompt instead of a hand Tática.
  const activateComercianteDasCruzadas = (card: CardData) => {
    playTacticSfx();
    setPlayerActivatedAbilityIds(prev => new Set(prev).add(card.id));
    if (deckQueueRef.current.length < 2) {
      deckQueueRef.current = [...deckQueueRef.current, ...[...playerDeckPoolRef.current].sort(() => Math.random() - 0.5)];
    }
    const revealed = deckQueueRef.current.splice(0, 2);
    openCardPicker('Mercador da Cruzada: veja as 2 cartas do topo — escolha 1 para a mão', revealed, 1, (picked) => {
      const chosen = picked[0];
      const other = revealed.find(c => c.id !== chosen.id);
      if (other) deckQueueRef.current = [...deckQueueRef.current, other];
      setHand(prev => [...prev, { ...chosen, id: `hand_${Date.now()}_${Math.random()}` }]);
      setCardPicker(null);
      showToast(`${chosen.name} adicionada à mão!`);
    });
  };

  // Cavaleiro Hospitalário: "Uma vez por turno: cure 1 HP de um aliado e cause 1 de dano a
  // um inimigo na Vanguarda." Two independent halves, each with its own target
  // (see pendingHospitalario/resolveHospitalarioHeal/resolveHospitalarioDamage) —
  // starts on whichever half actually has a target so a fully-healthy board (or
  // an empty enemy Vanguarda) never wastes the whole activation.
  const activateHospitalario = (card: CardData) => {
    playTacticSfx();
    setPlayerActivatedAbilityIds(prev => new Set(prev).add(card.id));
    const hasDamagedAlly = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(i => playerSlots[i] && !playerSlots[i]?.isDestroyed && isCardDamaged(playerSlots[i]!));
    if (hasDamagedAlly) {
      setPendingHospitalario({ step: 'heal' });
      showToast('Cavaleiro Hospitalário: escolha um aliado ferido para curar 1 HP.');
      return;
    }
    const hasEnemyVanguarda = [0, 1, 2, 3, 4].some(i => npcSlots[i] && !npcSlots[i]?.isDestroyed);
    if (hasEnemyVanguarda) {
      setPendingHospitalario({ step: 'damage' });
      showToast('Cavaleiro Hospitalário: escolha um inimigo na Vanguarda para causar 1 de dano.');
    } else {
      showToast('Cavaleiro Hospitalário: nenhum alvo disponível para nenhuma das duas metades.');
    }
  };

  // "You may activate this" prompts (the General's own Fase-Principal ability, plus
  // Mercador da Cruzada / Cavaleiro Hospitalário on their own slots) — used to be a
  // small circular Sparkles badge in the corner of each CardSlot; the user asked for
  // the reference sheet's own glowing card-frame border instead, sized to the whole
  // card so it reads as "the whole thing is armed," not a tiny decoration easy to
  // miss. Rendered in the same top-level fixed overlay as activeHalos above (see its
  // own comment for why: a slot with no z-index of its own can't guarantee painting
  // over a later sibling slot, which is what made the old halo overlay read as
  // "clipped" whenever a neighbor was occupied — same fix applies here).
  // Real on-screen positions via getBoundingClientRect (like attackLines/activeHalos
  // above) — a previous version tried to strip the board's own transform out by hand
  // (summing offsetLeft/offsetTop up the ancestor chain instead), reasoning that
  // transform never changes an element's own layout box. That's true for translation,
  // but the board's OWN permanent transform also SCALES its huge 1000x1250 design-space
  // box down to fit the viewport — offsetLeft/Top are pre-scale numbers in that same
  // huge coordinate space, so summing them landed the prompt hundreds of pixels off
  // (past the bottom of the viewport entirely for the General's slot), silently
  // unclickable. getBoundingClientRect always reflects the real, current, post-transform
  // position, so this can ride along with a card-play zoom for its brief duration —
  // a working prompt on rare occasion sliding slightly beats a permanently broken one.
  const abilityReadyPrompts: { key: string; x: number; y: number; w: number; h: number; onClick: () => void }[] = [];
  const pushAbilityPrompt = (key: string, slotId: string, onClick: () => void) => {
    const el = document.getElementById(slotId);
    if (!el) return;
    const r = el.getBoundingClientRect();
    abilityReadyPrompts.push({ key, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, onClick });
  };
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
    const kind = getPlayerCreatureAbilityKind(i);
    if (!kind) return;
    pushAbilityPrompt(`ability-${i}`, `player-${i}`, () => {
      if (kind === 'comerciante') activateComercianteDasCruzadas(playerSlots[i]!);
      else activateHospitalario(playerSlots[i]!);
    });
  });
  if (playerGeneralAbilityAvailable) {
    pushAbilityPrompt('ability-general', 'player-12', () => setGeneralAbilityPrompt({ kind: 'cardeal_heal', confirmed: false }));
  }

  // Resolves Cavaleiro Hospitalário's heal half once the player clicks their own board (see
  // pendingHospitalario's dispatch at the top of handleSlotClick).
  const resolveHospitalarioHeal = (slotIndex: number) => {
    if (!pendingHospitalario) return;
    const target = playerSlots[slotIndex];
    if (slotIndex > 9 || !target || !isCardDamaged(target)) { showToast('Escolha um aliado ferido no campo.'); return; }
    setPlayerSlots(prev => {
      const next = [...prev];
      let healed = { ...next[slotIndex]!, hp: next[slotIndex]!.hp + 1 };
      // Recruta Devoto: "Ao ser curado: recebe +1 ATK permanente."
      if (healed.name === 'Recruta Devoto') healed = { ...healed, atk: healed.atk + 1 };
      next[slotIndex] = healed;
      return next;
    });
    showToast(`${target.name} recuperou 1 HP!`);
    const hasEnemyVanguarda = [0, 1, 2, 3, 4].some(i => npcSlots[i] && !npcSlots[i]?.isDestroyed);
    if (hasEnemyVanguarda) {
      setPendingHospitalario({ step: 'damage' });
      showToast('Cavaleiro Hospitalário: escolha um inimigo na Vanguarda para causar 1 de dano.');
    } else {
      setPendingHospitalario(null);
    }
  };

  // Resolves Cavaleiro Hospitalário's damage half once the player clicks the enemy board
  // (see pendingHospitalario's dispatch at the top of handleNpcSlotClick).
  const resolveHospitalarioDamage = (slotIndex: number) => {
    if (!pendingHospitalario) return;
    if (!isFrontline(slotIndex) || !npcSlots[slotIndex] || npcSlots[slotIndex]?.isDestroyed) {
      showToast('Escolha um inimigo na Vanguarda.');
      return;
    }
    const result = applyDamageToSlot(npcSlots, slotIndex, 1);
    setNpcSlots(result.slots);
    if (result.destroyed) {
      setNpcGraveyard(g => [...g, ...withEquippedWeapons([result.destroyed!])]);
      drawForAtiradorInfluente([result.destroyed], false);
    }
    showToast('Cavaleiro Hospitalário causou 1 de dano!');
    setPendingHospitalario(null);
  };

  const handleSlotClick = (slotIndex: number, slotEl?: HTMLElement) => {
    if (gameOverWinner || isCardInFlightTransition) return;
    if (phaseTransitionLock) return; // see announcePhase — a phase banner is still on screen

    if (pendingTacticAction) { resolveOwnTacticTarget(slotIndex); return; }
    if (pendingGeneralHeal) { resolveGeneralHeal(slotIndex); return; }
    if (pendingHospitalario?.step === 'heal') { resolveHospitalarioHeal(slotIndex); return; }

    // Batedor's free post-combat move (see batedorFreeMove) opens this same
    // reposition flow even during Combate, but only for that one exact unit.
    const isBatedorFreeMove = batedorFreeMove !== null;
    if ((turnPhase === 'movimentacao' || isBatedorFreeMove) && selectedCardIndex === null) {
      // Reposition — only while no hand card is mid-selection (if one is, a click on
      // an empty slot means "play it here", handled below). Only Vanguarda/Retaguarda
      // units reposition — General/Relíquia/Terreno (10-12) are fixed, same as
      // everywhere else in this file.
      if (slotIndex > 9) {
        if (playerSlots[slotIndex]) showToast("Essa carta não pode ser reposicionada.");
        return;
      }
      if (selectedMoverIndex === null) {
        if (!playerSlots[slotIndex]) return;
        if (isBatedorFreeMove && slotIndex !== batedorFreeMove) {
          showToast("Só dá pra mover o Batedor que acabou de atacar.");
          return;
        }
        // Reformar Linhas' bonus moves (see bonusRepositions) let an already-moved
        // unit be picked back up anyway.
        if (!isBatedorFreeMove && movedSlots.has(slotIndex) && bonusRepositions <= 0) {
          showToast("Essa unidade já se reposicionou nesse turno.");
          return;
        }
        setSelectedMoverIndex(slotIndex);
        return;
      }
      if (selectedMoverIndex === slotIndex) { setSelectedMoverIndex(null); return; }
      if (!canReposition(playerSlots[selectedMoverIndex], selectedMoverIndex, slotIndex)) {
        // Clicking a different one of your own (unmoved) units re-selects it instead
        // of just failing — reads nicer than forcing a deselect first.
        if (!isBatedorFreeMove && playerSlots[slotIndex] && !movedSlots.has(slotIndex)) { setSelectedMoverIndex(slotIndex); return; }
        showToast("Só dá pra reposicionar para um slot adjacente!");
        return;
      }
      const wasAlreadyMoved = movedSlots.has(selectedMoverIndex);
      const mover = playerSlots[selectedMoverIndex];
      const occupant = playerSlots[slotIndex];
      const newSlots = [...playerSlots];
      newSlots[selectedMoverIndex] = occupant ?? null; // moving into empty, or swapping
      newSlots[slotIndex] = mover;
      // Capitão de Formação: "Ao mover: adjacentes +1 ATK" — a permanent stamp on
      // whoever ends up next to its new position.
      setPlayerSlots(applyFormationCaptainBuff(newSlots, slotIndex));
      setSelectedMoverIndex(null);

      if (isBatedorFreeMove) {
        setBatedorFreeMove(null);
        showToast("Batedor se reposicionou após o combate!");
        return;
      }
      setMovedSlots(prev => {
        const next = new Set(prev);
        next.add(selectedMoverIndex!);
        next.add(slotIndex);
        return next;
      });
      if (wasAlreadyMoved) setBonusRepositions(prev => Math.max(0, prev - 1));
      return;
    }
    if (selectedCardIndex !== null && !playerSlots[slotIndex]) {
      const cardToPlay = hand[selectedCardIndex];

      // Only a plain creature/Relíquia/Terreno actually gets placed INTO a slot —
      // a targetable Tática (ownTarget/enemyTarget) has its own occupied-slot
      // target-tap branch further down, and an immediate/blocked card has no board
      // destination at all (see handleCardClick's second-tap-plays behavior). An
      // empty slot is never a valid tap target for those, so guide the player back
      // to whichever gesture actually plays this specific card instead of trying
      // to drop it onto the board like a creature body.
      const dropKind = getCardDropKind(cardToPlay);
      if (dropKind !== 'place') {
        if (dropKind === 'ownTarget' || dropKind === 'enemyTarget') {
          const tacticKind = TARGETABLE_TACTICS[cardToPlay.name];
          showToast(tacticKind ? TACTIC_TARGET_PROMPTS[tacticKind] : "Escolha uma unidade no campo.");
        } else {
          showToast("Toque na carta novamente para jogá-la.");
        }
        return;
      }

      // Slot 12 is the fixed General slot — never played from hand.
      if (slotIndex === 12) {
        showToast("O General não pode ser substituído!");
        return;
      }
      // Slots 10/11 are the special slots beside the General — Relíquia/Terreno only.
      if ((slotIndex === 10 || slotIndex === 11) && cardToPlay.cardType !== 'Relíquia' && cardToPlay.cardType !== 'Terreno') {
        showToast("Esse slot é só para Relíquia ou Terreno!");
        return;
      }
      if (slotIndex <= 9 && (cardToPlay.cardType === 'Relíquia' || cardToPlay.cardType === 'Terreno')) {
        showToast("Relíquia/Terreno só pode ir no slot especial ao lado do General!");
        return;
      }

      if (playerMana < cardToPlay.cost) {
        showToast("Ouro insuficiente!");
        return;
      }

      setPlayerMana(prev => prev - cardToPlay.cost);
      spawnFloatingNumberAtId('player-gold-badge', cardToPlay.cost, 'gold-spend');

      const fromEl = handCardRefs.current[cardToPlay.id];
      const fromRect = fromEl?.getBoundingClientRect();

      if (fromRect && slotEl) {
        // Let the camera zoom/pan toward the slot and settle first — only once it has
        // stopped moving do we measure the slot's real on-screen position and start the
        // card's flight, so the landing spot doesn't drift out from under it mid-flight.
        // Crucially, the card stays selected and visible in its floating preview spot for
        // this whole hold — we don't touch the hand yet, so it never disappears.
        setPreZoomSlot({ slotIndex });
        setTimeout(() => {
          // Re-measure the card's own rect too, right before handing off to the flying
          // overlay, in case anything shifted during the hold.
          const latestFromRect = fromEl.getBoundingClientRect();
          const toRect = slotEl.getBoundingClientRect();
          setPreZoomSlot(null);
          setFlyingCard({
            card: cardToPlay,
            slotIndex,
            fromX: latestFromRect.left + latestFromRect.width / 2,
            fromY: latestFromRect.top + latestFromRect.height / 2,
            fromW: latestFromRect.width,
            fromH: latestFromRect.height,
            toX: toRect.left + toRect.width / 2,
            toY: toRect.top + toRect.height / 2,
            toW: toRect.width,
            toH: toRect.height,
          });
          // Only now remove the card from the hand and clear the selection — the flying
          // overlay takes over in this exact same update, so there's no frame where the
          // card isn't rendered anywhere.
          setHand(prevHand => {
            const idx = prevHand.findIndex(c => c.id === cardToPlay.id);
            if (idx === -1) return prevHand;
            const next = [...prevHand];
            next.splice(idx, 1);
            return next;
          });
          setSelectedCardIndex(null);
          setViewState('hand');
        }, 520);
      } else {
        // Couldn't measure a position (shouldn't normally happen) — place instantly.
        const newHand = [...hand];
        newHand.splice(selectedCardIndex, 1);
        setHand(newHand);
        setSelectedCardIndex(null);
        setViewState('hand');
        const newSlots = [...playerSlots];
        newSlots[slotIndex] = cardToPlay;
        setPlayerSlots(applyNobreReligiosoSummon(newSlots, slotIndex));
      }
    } else if (selectedCardIndex === null && playerSlots[slotIndex] && turnPhase === 'preparacao') {
      // Nothing to do here in Preparação beyond the preview its own onInfoClick
      // already opened — reposition happens in Movimentação, attacking in Combate.
      return;
    } else if (selectedCardIndex === null && playerSlots[slotIndex]) {
      // Only turnPhase === 'combate' reaches here (movimentacao was caught by the
      // very first branch above, preparacao by the one just above) — Combate never
      // unlocks before turn 3 (see phasesForTurn), so there's nothing left to guard.
      // Arqueiro da Ordem gets 2 attacks this turn; every other unit gets 1
      // (see getMaxAttacksPerTurn/playerAttackCounts).
      const usedAttacks = playerAttackCounts[slotIndex] ?? 0;
      if (usedAttacks >= getMaxAttacksPerTurn(playerSlots[slotIndex]!)) {
        showToast("Essa unidade já atacou neste turno.");
        return;
      }
      // Infantaria posted in the Retaguarda has zero valid attack targets, always
      // (see getValidAttackTargets' own identical check) — block the selection
      // itself with a clear reason instead of letting the player select it and
      // only discover why every enemy slot then reads as unreachable.
      if (playerSlots[slotIndex]!.cardType === 'Infantaria' && isBackline(slotIndex)) {
        showToast("Infantaria na Retaguarda não pode atacar.");
        return;
      }
      if (selectedAttackerIndex === slotIndex) {
        setSelectedAttackerIndex(null);
      } else {
        setSelectedAttackerIndex(slotIndex);
      }
    } else if (selectedCardIndex !== null && playerSlots[slotIndex]) {
      // An occupied own slot is exactly the target an 'ownTarget' Tática (an equip
      // or a buff — see getCardDropKind/TARGETABLE_TACTICS) needs tapped to play:
      // commit it now (spends the mana/removes it from hand and opens targeting —
      // see handlePlayCardButtonClick) with this slot pre-stashed as the target, so
      // the existing pendingTacticAction effect resolves it against this exact
      // slot the moment that commit lands, in one tap instead of two.
      const cardToPlay = hand[selectedCardIndex];
      if (getCardDropKind(cardToPlay) === 'ownTarget') {
        pendingDropTargetRef.current = { side: 'own', index: slotIndex };
        handlePlayCardButtonClick();
        return;
      }
      // Any other kind of card selected but this slot is already occupied — used to
      // be a silent no-op with no feedback at all.
      showToast("Esse slot já está ocupado!");
    }
  };

  const handleNpcSlotClick = async (slotIndex: number) => {
    if (gameOverWinner) return;
    if (phaseTransitionLock) return; // see announcePhase — a phase banner is still on screen
    if (pendingTacticAction) { resolveEnemyTacticTarget(slotIndex); return; }
    if (pendingHospitalario?.step === 'damage') { resolveHospitalarioDamage(slotIndex); return; }

    // A hand card is selected (not yet committed) and the player tapped the
    // opponent's board — the only card kind that ever wants that is an
    // 'enemyTarget' Tática (a damage/displace effect — see getCardDropKind), and
    // only on an occupied enemy slot. Commit it now with this slot pre-stashed as
    // the target (same one-tap bridge as the 'ownTarget' branch in handleSlotClick)
    // — anything else here (an empty enemy slot, or any other card kind selected)
    // just isn't a valid destination for whatever's selected, so say so instead of
    // silently doing nothing.
    if (selectedCardIndex !== null) {
      const cardToPlay = hand[selectedCardIndex];
      if (getCardDropKind(cardToPlay) === 'enemyTarget' && npcSlots[slotIndex]) {
        pendingDropTargetRef.current = { side: 'npc', index: slotIndex };
        handlePlayCardButtonClick();
      } else {
        showToast("Essa carta não pode ser jogada no campo do adversário.");
      }
      return;
    }
    if (selectedAttackerIndex !== null && npcSlots[slotIndex] && !isAnimating) {
      if (!validAttackTargets.has(slotIndex)) {
        showToast("Alvo fora de alcance — tem uma carta bloqueando o caminho!");
        return;
      }
      setIsAnimating(true);
      setAttackAnim({ attackerIndex: selectedAttackerIndex, targetIndex: slotIndex, isPlayerAttacking: true });
      
      await new Promise(resolve => setTimeout(resolve, 300));

      playAttackSfx();
      setIsImpacting(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      setIsImpacting(false);
      
      const attacker = playerSlots[selectedAttackerIndex];
      let defender = npcSlots[slotIndex];
      let targetSlot = slotIndex;

      if (attacker && defender) {
        const ambushCard = await maybeActivateNpcAmbush(attacker, defender, playerSlots);
        let attackerSlotsAfterAmbush: (CardData | null)[] = playerSlots;
        let defenderSlotsAfterAmbush: (CardData | null)[] = npcSlots;
        let cancelled = false;
        if (ambushCard) {
          const resolved = resolveAmbushEffect(ambushCard, playerSlots, selectedAttackerIndex, npcSlots, slotIndex);
          attackerSlotsAfterAmbush = resolved.attackerSlots;
          defenderSlotsAfterAmbush = resolved.defenderSlots;
          targetSlot = resolved.defenderIndex;
          defender = resolved.defender;
          cancelled = resolved.cancelled;
        }

        const newPlayerSlots = [...attackerSlotsAfterAmbush];
        const newNpcSlots = [...defenderSlotsAfterAmbush];

        let hasDestroyed = false;
        let npcGeneralFell = false;

        if (!cancelled && defender) {
          let attackerAtk = getEffectiveAtk(attacker, selectedAttackerIndex, newPlayerSlots, newNpcSlots);
          // Fanático da Cruzada: "Ao atacar: se o General inimigo for de tipo oposto,
          // ganha +2 ATK." The game has no real General-faction/type concept — with
          // only 2 decks existing today, "tipo oposto" is simplified to "the enemy
          // General isn't Cardeal Pedro, Voz da Fé" (this card only exists in Deck Cardeal, so
          // its "opposite type" enemy is always Deck Capitão's General in practice).
          // Revisit this exact check if a third deck/General is ever added.
          if (attacker.name === 'Fanático da Cruzada' && newNpcSlots[12] && newNpcSlots[12]?.name !== 'Cardeal Pedro, Voz da Fé') attackerAtk += 2;
          const defenderAtk = getEffectiveAtk(defender, targetSlot, newNpcSlots, newPlayerSlots);
          const attackerReduction = getIncomingDamageReduction(selectedAttackerIndex, newPlayerSlots);
          const defenderReduction = getIncomingDamageReduction(targetSlot, newNpcSlots);
          const attackerHpBonus = (attacker.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(attacker, newPlayerSlots);
          const defenderHpBonus = (defender.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(defender, newNpcSlots);
          const damageToDefender = Math.max(0, attackerAtk - defenderReduction);
          const damageToAttacker = Math.max(0, defenderAtk - attackerReduction);

          // Infiltrado da Ordem: "Se o General aliado receber dano, no próximo turno
          // não poderá usar sua habilidade." Checked on the DEFENDER's (NPC's) own
          // side, since it's their own General and their own Espião.
          if (targetSlot === 12 && damageToDefender > 0 && hasEspiaoOnBoard(newNpcSlots)) {
            setPendingNpcGeneralAbilityBlock(true);
            showToast('Infiltrado da Ordem: a habilidade do General inimigo foi bloqueada no próximo turno dele!');
          }

          const updatedAttacker = {
            ...attacker,
            hp: attacker.hp + attackerHpBonus - damageToAttacker,
            pendingCombatBonus: undefined,
          };
          const updatedDefender = {
            ...defender,
            hp: defender.hp + defenderHpBonus - damageToDefender,
            pendingCombatBonus: undefined,
          };

          // Hearthstone-style floating combat numbers, fired right as both sides'
          // new HP is decided so they land in sync with the impact flash above.
          spawnFloatingNumberAtId(`player-${selectedAttackerIndex}`, damageToAttacker, 'damage');
          spawnFloatingNumberAtId(`npc-${targetSlot}`, damageToDefender, 'damage');

          if (updatedAttacker.hp <= 0) {
            newPlayerSlots[selectedAttackerIndex] = { ...updatedAttacker, isDestroyed: true };
            hasDestroyed = true;
          } else {
            newPlayerSlots[selectedAttackerIndex] = updatedAttacker;
            // Batedor: "Move após combate" — a free reposition right after it lands
            // an attack and survives, even though Batalha doesn't normally allow
            // moving (see handleSlotClick's own isBatedorFreeMove bypass).
            if (attacker.name === 'Batedor') setBatedorFreeMove(selectedAttackerIndex);
          }

          if (updatedDefender.hp <= 0) {
            newNpcSlots[targetSlot] = { ...updatedDefender, isDestroyed: true };
            hasDestroyed = true;
            if (updatedDefender.cardType === 'General') npcGeneralFell = true;
          } else {
            newNpcSlots[targetSlot] = updatedDefender;
          }

          // Jorge, Lança Sagrada: "Ao atacar a Vanguarda: causa 2 de dano à unidade
          // na Retaguarda da mesma coluna." A splash side-effect, independent of
          // whether the main target survived.
          const splashTarget = attacker.name === 'Jorge, Lança Sagrada' && isFrontline(targetSlot) ? newNpcSlots[targetSlot + 5] : null;
          if (splashTarget) {
            const splashHp = splashTarget.hp - 2;
            spawnFloatingNumberAtId(`npc-${targetSlot + 5}`, 2, 'damage');
            if (splashHp <= 0) {
              newNpcSlots[targetSlot + 5] = null;
              setNpcGraveyard(g => [...g, ...withEquippedWeapons([{ ...splashTarget, hp: splashHp, isDestroyed: true }])]);
              drawForAtiradorInfluente([splashTarget], false);
              hasDestroyed = true;
              if (splashTarget.cardType === 'General') npcGeneralFell = true;
            } else {
              newNpcSlots[targetSlot + 5] = { ...splashTarget, hp: splashHp };
            }
          }
        }

        setPlayerSlots(newPlayerSlots);
        setNpcSlots(newNpcSlots);
        // Arqueiro da Ordem / getMaxAttacksPerTurn — recorded even if the
        // attacker didn't survive or the attack was ambush-cancelled; either way
        // it "attacked" this turn and the slot is either gone or spent.
        setPlayerAttackCounts(prev => ({ ...prev, [selectedAttackerIndex]: (prev[selectedAttackerIndex] ?? 0) + 1 }));
        setSelectedAttackerIndex(null);
        setAttackAnim(null);

        if (npcGeneralFell) {
          setGameOverWinner('player');
          setIsAnimating(false);
          return;
        }

        if (hasDestroyed) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const destroyedPlayerCards = newPlayerSlots.filter((c): c is CardData => !!c?.isDestroyed);
          const destroyedNpcCards = newNpcSlots.filter((c): c is CardData => !!c?.isDestroyed);
          if (destroyedPlayerCards.length) {
            setPlayerGraveyard(g => [...g, ...withEquippedWeapons(destroyedPlayerCards)]);
            drawForAtiradorInfluente(destroyedPlayerCards, true);
          }
          if (destroyedNpcCards.length) {
            setNpcGraveyard(g => [...g, ...withEquippedWeapons(destroyedNpcCards)]);
            drawForAtiradorInfluente(destroyedNpcCards, false);
          }
          setPlayerSlots(prev => prev.map(c => c?.isDestroyed ? null : c));
          setNpcSlots(prev => prev.map(c => c?.isDestroyed ? null : c));
        }
      }
      setIsAnimating(false);
    }
  };

  const handleBackgroundClick = () => {
    if (isCardInFlightTransition) return; // don't cancel a card mid hand-off to the board
    if (pendingTacticAction) {
      // The card's mana/hand cost is already spent (see handlePlayCardButtonClick) —
      // tapping away without picking a target just fizzles it into the graveyard
      // instead of leaving the player stuck if they change their mind or have no
      // valid target.
      setPlayerGraveyard(g => [...g, pendingTacticAction.card]);
      setPendingTacticAction(null);
      setViewState('hand');
      return;
    }
    if (pendingGeneralHeal) {
      // Same reasoning as pendingTacticAction above: the activation (and any gold
      // cost) is already committed, so backing out here just wastes it rather than
      // refunding — otherwise there'd be no real cost to peeking at the board first.
      showToast('Habilidade desperdiçada — nenhum alvo escolhido.');
      setPendingGeneralHeal(null);
      return;
    }
    if (pendingHospitalario) {
      // Same reasoning again — the card is already marked used (see
      // activateHospitalario) whether or not either half actually lands.
      showToast('Cavaleiro Hospitalário desperdiçado — nenhum alvo escolhido.');
      setPendingHospitalario(null);
      return;
    }
    if (viewState === 'field') {
      setSelectedCardIndex(null);
      setViewState('hand');
    } else if (selectedCardIndex !== null) {
      // Tapped away while a card was only selected (not yet played) — cancel it
      setSelectedCardIndex(null);
    }
  };

  // On mobile, the whole hand tray is itself scaled down by handScale (see above) to fit
  // the fan on screen — since that scale is anchored at the tray's own center, it also
  // shrinks how far any translate we apply actually moves a card on screen. Dividing our
  // desired on-screen distance by handScale compensates, so these two helpers always land
  // the previewed card at the same real screen position regardless of hand size/width.
  const previewScaleFactor = isMobile ? handScale : 1;

  const getSelectedCardX = (index: number) => {
    const startX = -handTotalWidth / 2 + HAND_CARD_WIDTH / 2;
    const cardX = startX + index * HAND_CARD_STEP;
    // Tuck the previewed card right up against a side edge while the player picks a
    // slot, so it blocks as little of the board (and its slot indicators) as possible,
    // while staying fully on-screen so the player always knows what they're about to play.
    const previewHalfWidthOnScreen = (HAND_CARD_WIDTH * (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) * previewScaleFactor) / 2;
    const edgeGap = 6;
    // Tucked to the LEFT edge on both mobile and desktop: the right side of the board
    // now holds the player's own deck + graveyard, so parking the preview there would
    // sit it right on top of them.
    const desiredAbsDelta = -(windowSize.width / 2) + edgeGap + previewHalfWidthOnScreen;
    const targetX = desiredAbsDelta / previewScaleFactor;
    return targetX - cardX;
  };

  // How far down the screen (0 = top, 1 = bottom) the previewed card centers on.
  // Anchored near the vertical middle of the screen (just above dead center) so it
  // reads as centered rather than pinned up near the top bar, while still mostly
  // clearing the player's own Retaguarda/Vanguarda slots below it — the row they
  // need to see to pick where to play the card.
  const PREVIEW_Y_FRACTION = 0.45;
  const getSelectedCardY = () => {
    if (!isMobile) return -490;
    // Empirically calibrated against the real rendered geometry (now that the hand tray
    // scales from a bottom-center origin — see the Hand UI wrapper below — its anchor
    // sits ~106px below the true bottom edge in local, pre-scale units, and the observed
    // lift comes out to ~94% of handScale rather than handScale exactly, likely from the
    // tray's own translate+scale composition). Solving that same relationship for an
    // arbitrary target screen position (instead of just dead center) keeps this correct
    // regardless of viewport height or hand size.
    const liftScale = handScale * 0.94;
    const targetAbsY = windowSize.height * PREVIEW_Y_FRACTION;
    return (targetAbsY - windowSize.height - 106) / liftScale;
  };

  // Fan the hand out like a real card fan: a modest total spread, distributed evenly
  // across however many cards are in hand, with the center card slightly raised.

  // `baseScaleOverride` lets the background art layer (see boardAnim/artAnim below)
  // share this exact same camera logic without also inheriting boardScale — that
  // responsive fit-to-viewport factor only makes sense for the 1000x1250 board box,
  // not for a full-viewport object-cover image that already fills the screen on its
  // own. Passing 1 there means "fully covering" is the resting state, and the zoom
  // multipliers below (1.15, the shake sequences, etc.) apply as ratios on top of
  // that instead of on top of the board's own fit-to-screen scale.
  const getBoardAnimation = (baseScaleOverride?: number) => {
    // The board stays visible at all times — like looking down at a table with the
    // hand of cards held up in front of it — instead of tilting away out of view
    // while browsing the hand. Drawing a card never moves the camera either: the new
    // hand card animates itself in from the on-board deck pile (see computeDrawOrigin)
    // while the view stays put.
    const baseAnim = {
      // Flattened all the way to a true top-down view (was 25/35deg originally, then
      // 8/12deg): any tilt at all makes the board's near (player) edge occupy more
      // screen height than its far (opponent) edge and the two rows of slots read as
      // different sizes — a straight-down Hearthstone-style view keeps every slot the
      // same size and shape, easier to scan at a glance on a small phone screen.
      rotateX: 0,
      rotateZ: 0,
      y: isMobile ? 0 : -50,
      x: 0,
      z: isMobile ? 50 : 50,
      scale: baseScaleOverride ?? (isMobile ? 1.0 : 0.85) * boardScale,
    };

    // Camera follows a card being played, zooming in toward the slot it's headed for —
    // a Yu-Gi-Oh Forbidden Memories-style summon camera used to pan/zoom/shake toward
    // whatever slot a card was headed for (preZoomSlot/flyingCard/cameraSettling), then
    // ease back once it landed — removed per explicit request: even with Vanguarda
    // exempted from it (see git history), the camera moving at all during a card play
    // read as wrong. The board now never moves for that reason, on either row, full
    // stop — preZoomSlot/flyingCard/cameraSettling/boardShock still exist and still
    // drive the card's own flight sprite and impact flash, just not this camera.
    return baseAnim;
  };

  // While a hand card is tap-selected, light up EVERY empty slot it could legally
  // land in at once (not just one the player happens to be pointing at) — the
  // whole point of tap-to-target instead of drag is that the board shows every
  // option up front. selectedCardIndex alone (no viewState gate — that only ever
  // flips to 'field' now during the flight animation itself, see handleSlotClick)
  // is enough: this card stays "previewed" the entire time it's selected.
  const previewedCard = selectedCardIndex !== null ? hand[selectedCardIndex] : null;
  const getPlayerSlotHint = (slotIndex: number): SlotHint | undefined =>
    previewedCard && !playerSlots[slotIndex]
      ? getSlotHint(previewedCard.cardType, slotIndex)
      : undefined;

  // Small always-on phase-tag column planted at a field's own edge (see the two
  // call sites below) — activePhase is null on the side whose turn it isn't, which
  // dims every tag (isCurrent never matches null). Combate's lock (turn 3+) is
  // shown on both sides for consistency, even on the NPC's — the AI is gated by
  // the exact same turnNumber check inside playAiTurn.
  const renderPhaseTagColumn = (activePhase: TurnPhase | null) => (
    <div className="flex flex-col gap-0.5">
      {PHASE_TAG_ORDER.map(p => {
        const isLocked = p === 'combate' && turnNumber < 3;
        const isCurrent = activePhase === p;
        return (
          <div
            key={p}
            className={`px-1 py-px rounded border text-center text-[5px] md:text-[6px] font-black uppercase tracking-wide whitespace-nowrap ${
              isCurrent
                ? 'bg-amber-500 border-amber-300 text-zinc-950 shadow-[0_0_6px_rgba(245,158,11,0.7)]'
                : isLocked
                  ? 'bg-zinc-950/80 border-zinc-700 text-zinc-600'
                  : 'bg-zinc-950/70 border-zinc-600 text-zinc-400'
            }`}
          >
            {PHASE_TAG_LABELS[p]}
          </div>
        );
      })}
    </div>
  );

  // Highlights EVERY occupied slot a selected targetable Tática (equip/buff/damage)
  // could legally land on — the 'place' kind (plain creatures/Relíquia/Terreno)
  // already gets its highlight for free from the hint system just above, since it
  // only ever targets an EMPTY slot; this is for the occupied-slot case that
  // system doesn't cover (see getCardDropKind/TARGETABLE_TACTICS).
  const isTacticTargetSlot = (side: 'own' | 'npc', slotIndex: number): boolean => {
    if (!previewedCard) return false;
    const kind = getCardDropKind(previewedCard);
    if (side === 'own') return kind === 'ownTarget' && !!playerSlots[slotIndex];
    return kind === 'enemyTarget' && !!npcSlots[slotIndex];
  };

  // Computed once and shared by both the background art layer below and the board's
  // own motion.div (see the "3D Board" comment further down) — the "summon camera"
  // zoom/pan toward a played card used to only apply to the board's own transparent
  // tint layer, since the battlefield art lived in a separate, untransformed <img>
  // outside of it: the slots would zoom in while the actual art underneath stayed
  // completely still, looking like the camera was zooming into an empty demarcated
  // box. Both layers are centered on the same point in the viewport, so animating
  // them off the same x/y/rotateX and a matching *ratio* of zoom keeps the art and
  // the board moving in lockstep — artAnim passes baseScaleOverride=1 so the art's
  // own full-viewport coverage isn't ALSO shrunk by the board's boardScale fit
  // factor, which doesn't apply to it at all.
  const artAnim = getBoardAnimation(1);
  const boardTransition = { duration: viewportSettled ? 0.8 : 0, ease: [0.32, 0.72, 0, 1] as const };

  // The grid board's own motion.div (see the "3D Board" comment further down) is split
  // into two nested layers instead of the single animate={getBoardAnimation()} the art
  // layer above still uses: an OUTER one carrying just gridBaseAnim (the resting
  // position/scale — identical formula to getBoardAnimation's own internal baseAnim,
  // duplicated here since that's local to the function) and an INNER one nested inside
  // it carrying only the extra "summon camera" pan/zoom as gridZoomDelta. The turn-button
  // HUD (see where it's now rendered, inside the OUTER, sibling of the INNER) needs
  // exactly the first half of that and none of the second — see its own comment for why.
  // gridZoomDelta expresses its pan as a ratio/offset RELATIVE to gridBaseAnim rather
  // than an absolute value: nesting it inside the OUTER means whatever local x/y this
  // inner element declares gets multiplied by the OUTER's own scale for free (ordinary
  // CSS transform composition, translate happens in the element's own local units and
  // an ancestor's scale stretches that local unit same as everything else it contains),
  // so dividing the desired pixel pan by gridBaseAnim.scale here cancels that out and
  // the combined (outer * inner) transform lands exactly where the old single-layer
  // getBoardAnimation() math used to.
  const gridBaseAnim = {
    rotateX: 0,
    rotateZ: 0,
    y: isMobile ? 0 : -50,
    x: 0,
    z: isMobile ? 50 : 50,
    scale: (isMobile ? 1.0 : 0.85) * boardScale,
  };
  // Used to carry the summon-camera pan/zoom/shake toward a played card's slot (see
  // getBoardAnimation's own matching comment for why that's gone now) — always identity
  // today, kept as its own layer rather than collapsed back into gridBaseAnim/the grid's
  // own motion.div since the HUD (see where it's rendered) specifically relies on being
  // a child of the OUTER layer and not this INNER one to share the board's exact resting
  // position with zero lag (see that comment) without inheriting whatever this ever does.
  const gridZoomDelta = { x: 0, y: 0, scale: 1 };

  // The root stage (see the outer `justify-center` div below) centers the board's
  // fixed 1000x1250 box inside the full viewport height, leaving an equal empty
  // margin above and below it — this is that margin's real size, used to plant the
  // NPC's floating hand (see below) right against the board's own top edge instead
  // of at a fixed offset that ignored how big this margin actually is on a given
  // screen (that mismatch used to leave a much bigger gap above the NPC's hand than
  // the player's own hand has below theirs, which sizes itself to fill this same
  // margin on the bottom via handScale).
  const boardHeightMultiplier = (isMobile ? 1.0 : 0.85) * boardScale;
  const boardTopMargin = (windowSize.height - 1250 * boardHeightMultiplier) / 2;

  return (
    <div
      className="relative w-full h-dvh bg-[#140f0a] overflow-hidden flex flex-col items-center justify-center touch-none"
      style={{ perspective: '1200px' }}
      onClick={handleBackgroundClick}
    >
      {/* Exterior — the space around the board (see BOARD_EXTERIOR_ART_URL), now that
          the flat top-down camera (see getBoardAnimation) leaves a visible strip of it
          above/below the board — right where the hand of cards floats — instead of
          just a sliver at the tilted edges. Falls back to the plain dark gradient below
          when no art has been dropped in yet; that fallback is now a dim warm brown
          (matching the new sandstone board, see art-prompts/README.md) instead of the
          old cold indigo/black, so it reads as "the same dim stone chamber continuing
          off past the table" rather than a jarring void behind the hand. */}
      <motion.div className="absolute inset-0" animate={artAnim} transition={boardTransition}>
        {BOARD_EXTERIOR_ART_URL && (
          <img src={BOARD_EXTERIOR_ART_URL} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        )}

        {/* Background ambient light — the heavy version below was tuned as a total
            fallback for when there was no exterior art at all (a flat void), so it's
            only rendered in that case now; with the real battlefield art in place it
            was dark/opaque enough to hide almost the entire image. A much lighter
            vignette still applies on top of real art, just for edge falloff. */}
        {!BOARD_EXTERIOR_ART_URL && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(70,52,34,0.75)_0%,rgba(15,10,6,1)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(180,120,50,0.12)_0%,transparent_60%)] pointer-events-none" />
          </>
        )}
        {BOARD_EXTERIOR_ART_URL && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />
        )}
      </motion.div>

      {/* 3D Board — flex-shrink-0 matters here: the root container above is a flex
          column, and this box's own explicit 1400px height is taller than most real
          viewports, so without it the browser's own flex layout was quietly shrinking
          this all the way down to viewport height BEFORE the boardScale transform
          below ever got applied — a second, uncontrolled scale-down stacked on top of
          the real one, which threw off both the object-cover crop on the board art
          (cropping away far more than intended) and any percentage-based positioning
          inside this box (resolved against the shrunk box, not the real 1000x1400). */}
      <motion.div
        className="w-[1000px] h-[1250px] shrink-0 relative"
        animate={gridBaseAnim}
        transition={boardTransition}
      >
      <motion.div
        className="absolute inset-0 grid grid-rows-2 gap-12 p-8"
        animate={gridZoomDelta}
        onClick={(e) => {
          e.stopPropagation();
          if (isCardInFlightTransition) return; // don't cancel a card mid hand-off to the board
          if (selectedCardIndex !== null) {
            setSelectedCardIndex(null);
            setViewState('hand');
          }
          if (selectedAttackerIndex !== null) {
            setSelectedAttackerIndex(null);
          }
        }}
      >
        {/* NPC Field — reverted back to the pre-gateway-art flex layout (three real
            rows: General/Relíquia/Terreno, then Retaguarda, then Vanguarda), per the
            user's explicit ask: the absolute-positioned single-row version above
            (see git history) put General/Relíquia/Terreno at almost the same board
            depth as Retaguarda, so it visually read as only two rows instead of three.
            The new gateway art sits behind this as a background image and isn't
            pixel-aligned to these rows anymore — the user prioritized the old,
            functionally-clear 3-row layout over exact alignment with the art's gate
            opening/torches. */}
        {/* justify-start + pt-0 (not -end/pt-3): the NPC's own hand is just a
            small stack of face-down card backs near the very top of the
            screen, leaving a big gap between it and the board before this —
            anchoring this field's content to its own TOP instead of its
            bottom closes that gap, matching the player field's own tight fit
            against their (much bigger) hand below. Any slack this content
            doesn't use now collects at the BOTTOM of this half instead — i.e.
            in the open board space near the center divider, not against the
            opponent's hand — so it doesn't reintroduce the old overflow-into-
            the-player's-field bug that justify-end used to guard against;
            these cards are still comfortably short of that 625px half. */}
        <div className="flex flex-col gap-4 justify-start pt-0">
          {/* General row (fixed) + Relíquia/Terreno slots — now a real 5-wide row
              like Retaguarda/Vanguarda: Cemitério and Deck used to float outside the
              board's own columns (see git history), which left this row looking like
              only 3 slots wide instead of 5. Cemitério always on the left, Deck always
              on the right (see the user's own "locais das cartas" ask) — same gap as
              the other two rows so all three columns line up. */}
          <div className="relative flex justify-center gap-3 md:gap-6 items-center">
            <div className="pointer-events-auto">
              <GraveyardPile cards={npcGraveyard} onClick={() => setViewingGraveyard('npc')} />
            </div>
            <CardSlot
              slotId="npc-10"
              card={npcSlots[10]}
              onClick={() => handleNpcSlotClick(10)}
              // Only shown during Preparação (see every other onInfoClick below too) —
              // in Combate almost every tap is either picking an attacker or picking
              // its target, and in Movimentação almost every tap is picking a mover or
              // its destination; the big floating preview this opens used to sit right
              // on top of the board, hiding whatever that tap was actually doing.
              // Preparação keeps the preview (reading a card there is still the point
              // of tapping it — nothing else consumes that tap in that phase).
              onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10}
              isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 10}
              attackDirection="down"
              isValidAttackTarget={validAttackTargets.has(10)}
              isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(10) && !!npcSlots[10]}
              isTacticDragTarget={isTacticTargetSlot('npc', 10)}
            />
            <div className="relative">
              <CardSlot
                slotId="npc-12"
                card={npcSlots[12]}
                onClick={() => handleNpcSlotClick(12)}
                onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 12}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(12)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(12)}
                isTacticDragTarget={isTacticTargetSlot('npc', 12)}
              />
            </div>
            <CardSlot
              slotId="npc-11"
              card={npcSlots[11]}
              onClick={() => handleNpcSlotClick(11)}
              onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11}
              isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 11}
              attackDirection="down"
              isValidAttackTarget={validAttackTargets.has(11)}
              isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(11) && !!npcSlots[11]}
              isTacticDragTarget={isTacticTargetSlot('npc', 11)}
            />
            <div ref={npcDeckRef} className="w-28 h-36 md:w-36 md:h-48 relative pointer-events-none">
              <CardBack offset={6} brightness={0.3} />
              <CardBack offset={3} brightness={0.55} />
              <CardBack shadow />
            </div>
          </div>
          {/* Retaguarda NPC (Backline) */}
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mb-3">Retaguarda</div>
          <div className="flex justify-center gap-3 md:gap-6">
            {[5, 6, 7, 8, 9].map((i) => (
              <CardSlot
                key={i}
                slotId={`npc-${i}`}
                card={npcSlots[i]}
                onClick={() => handleNpcSlotClick(i)}
                onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(i)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(i) && !!npcSlots[i]}
                isTacticDragTarget={isTacticTargetSlot('npc', i)}
              />
            ))}
          </div>
          {/* Vanguarda NPC (Frontline) */}
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mb-3">Vanguarda</div>
          <div className="flex justify-center gap-3 md:gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <CardSlot
                key={i}
                slotId={`npc-${i}`}
                card={npcSlots[i]}
                onClick={() => handleNpcSlotClick(i)}
                onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(i)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(i) && !!npcSlots[i]}
                isTacticDragTarget={isTacticTargetSlot('npc', i)}
              />
            ))}
          </div>
        </div>

        {/* Player Field — mirrors the NPC block above (see comment there). */}
        {/* justify-start (not -end) — mirrors the NPC field's own fix just above,
            same reasoning: anchors this field's Vanguarda row (its first child,
            closest to center) flush against this box's own top edge instead of
            letting overflow spill upward into the NPC field across the divider.
            Any overflow now pushes the General row down into the pb-16 reserve
            (and past it if needed) instead of into the opponent's cards. */}
        <div className="flex flex-col gap-4 justify-start pb-12 pointer-events-auto">
          {/* Vanguarda Player (Frontline) */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[0, 1, 2, 3, 4].map((i) => {
              return (
              <div key={i} className="relative">
              <CardSlot
                slotId={`player-${i}`}
                card={playerSlots[i]}
                onClick={(el) => handleSlotClick(i, el)}
                isSelected={selectedAttackerIndex === i}
                onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                hint={getPlayerSlotHint(i)}
                rowRoleHint={getPlayerSlotHint(i) === 'valid' ? getRowRoleHint(previewedCard?.cardType, i) : undefined}
                isMoverSelected={selectedMoverIndex === i}
                isValidMoveTarget={validMoveTargets.has(i)}
                hasMoved={movedSlots.has(i)}
                isTacticDragTarget={isTacticTargetSlot('own', i)}
              />
              </div>
              );
            })}
          </div>
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mt-3">Vanguarda</div>
          {/* Retaguarda Player (Backline) */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[5, 6, 7, 8, 9].map((i) => {
              return (
              <div key={i} className="relative">
              <CardSlot
                slotId={`player-${i}`}
                card={playerSlots[i]}
                onClick={(el) => handleSlotClick(i, el)}
                isSelected={selectedAttackerIndex === i}
                onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                hint={getPlayerSlotHint(i)}
                rowRoleHint={getPlayerSlotHint(i) === 'valid' ? getRowRoleHint(previewedCard?.cardType, i) : undefined}
                isMoverSelected={selectedMoverIndex === i}
                isValidMoveTarget={validMoveTargets.has(i)}
                hasMoved={movedSlots.has(i)}
                isTacticDragTarget={isTacticTargetSlot('own', i)}
              />
              </div>
              );
            })}
          </div>
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mt-3">Retaguarda</div>
          {/* General row (fixed) + Relíquia/Terreno slots — a real 5-wide row now,
              matching Retaguarda/Vanguarda (see the NPC field's own general row for
              the full explanation). Cemitério on the left, Deck on the right, same as
              the NPC's row above — both sides now agree on which side is which,
              instead of the old diagonal-corners layout (see git history). */}
          <div className="relative flex justify-center gap-3 md:gap-6 items-center">
            <div className="pointer-events-auto">
              <GraveyardPile cards={playerGraveyard} onClick={() => setViewingGraveyard('player')} />
            </div>
            <CardSlot
              slotId="player-10"
              card={playerSlots[10]}
              onClick={(el) => handleSlotClick(10, el)}
              isSelected={selectedAttackerIndex === 10}
              onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
              isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 10}
              isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 10}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 10}
              attackDirection="up"
              hint={getPlayerSlotHint(10)}
              isTacticDragTarget={isTacticTargetSlot('own', 10)}
            />
            <div className="relative">
              <CardSlot
                slotId="player-12"
                card={playerSlots[12]}
                onClick={(el) => handleSlotClick(12, el)}
                isSelected={selectedAttackerIndex === 12}
                onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12}
                isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 12}
                attackDirection="up"
                isTacticDragTarget={isTacticTargetSlot('own', 12)}
              />
            </div>
            <CardSlot
              slotId="player-11"
              card={playerSlots[11]}
              onClick={(el) => handleSlotClick(11, el)}
              isSelected={selectedAttackerIndex === 11}
              onInfoClick={turnPhase === 'preparacao' ? setDetailedCard : undefined}
              shockActive={boardShock}
              isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 11}
              isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 11}
              isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 11}
              attackDirection="up"
              hint={getPlayerSlotHint(11)}
              isTacticDragTarget={isTacticTargetSlot('own', 11)}
            />
            <motion.div
              ref={playerDeckRef}
              className="w-28 h-36 md:w-36 md:h-48 relative group pointer-events-none"
            >
              <CardBack offset={6} brightness={0.3} />
              <CardBack offset={3} brightness={0.55} />
              <CardBack shadow />
            </motion.div>
          </div>
        </div>

        {/* The wide avatar/name/HP panel that used to sit beside each General
            is gone — the board's own mini card already puts the General's HP
            directly on the card like every other creature, so a separate
            panel repeating the same number was redundant. */}
      </motion.div>
      {/* Turn Button + gold badges — now a CHILD of the board's own OUTER motion.div
          (see gridBaseAnim/gridZoomDelta above and the two nested motion.divs the 3D
          board comment introduces), not a plain sibling positioned by hand-rolled
          viewport-pixel math anymore. That JS math (boardTopMargin/boardHeightMultiplier,
          both derived from windowSize) was only ever an APPROXIMATION of where the
          board's own native CSS centering (a flexbox, tracking the real, live browser
          viewport height continuously) puts the board itself — the two could drift out
          of sync for a moment whenever the real viewport height changed for a reason
          this JS math didn't know about yet, most commonly a mobile browser's own URL
          bar collapsing or reappearing mid-play (an ordinary touch/scroll, like tapping
          a card to play it, is enough to trigger that on a real device — a fixed-size
          desktop or emulated viewport never shows it). The board's own CSS-native
          centering has no such lag; being a real DOM child of the SAME element that
          gets that centering (the OUTER motion.div, via gridBaseAnim) means this HUD
          now shares it exactly, at every instant, with nothing approximated in JS.
          left/top below are plain board-local pixel coordinates (0-1000 / 0-1250, the
          same space every slot in this grid is laid out in) instead of viewport pixels —
          500 is the board's own horizontal center, 600.5 is the vertical gap between
          the two Vanguarda rows (see the old comment's own ~24.5 design-px correction,
          preserved here: half of 1250, minus that correction).

          Being a child of the OUTER but not the INNER (the sibling motion.div just
          above, which carries gridZoomDelta) means this still doesn't inherit the
          "summon camera" pan/zoom toward a played card's slot — the whole point of
          this HUD is to always be right where the player expects it, so it stays put
          and visible through every zoom/pan, same as the always-on-top score overlay
          in any other card game (the floating "-N" spent-gold number, spawned once at
          a fixed viewport position right as that pan starts — see
          spawnFloatingNumberAtId — depends on the badge itself never moving for that
          reason too). The extra inline scale below cancels the OUTER's own ambient
          scale (gridBaseAnim.scale) back out, so this HUD's own fixed pixel sizes
          (w-[200px] etc. further down) keep rendering at the same physical size
          regardless of what boardScale currently is — only its POSITION is meant to
          track the board, not its size. */}
      <div
        className="absolute z-40 flex flex-row items-center gap-3 md:gap-5"
        style={{
          left: 500,
          top: 600.5,
          transform: `translate(-50%, -50%) scale(${1 / gridBaseAnim.scale})`,
          perspective: 600,
        }}
      >
        {/* NPC's gold — same distance from the button as the player's below. A red
            box drawn around the whole badge to tell the two piles apart (see git
            history) read as an error/warning state instead of a label, so this is a
            plain "ADVERSÁRIO" tag under it instead — swap-in point for that
            player's name/nick once real PvP exists, "JOGADOR" below getting the
            same treatment. Stacked (label under badge, not beside it) and the badge
            itself shrunk — side-by-side at the old size ran wider than the whole
            row had room for (the label text was visibly clipped at the screen's own
            edge), and freeing that width is what let the center turn button grow to
            its current size below. */}
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <div id="npc-gold-badge" onClick={(e) => e.stopPropagation()} className="pointer-events-auto shrink-0">
            <GoldBadge value={npcMana} className="w-14 md:w-16" />
          </div>
          <span className="text-[6px] md:text-[7px] font-black uppercase tracking-wide text-red-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
            Adversário
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            if (currentTurn !== 'player') return;
            if (phaseTransitionLock) return; // a banner from the last tap is still playing out
            setSelectedCardIndex(null);
            setSelectedAttackerIndex(null);
            setSelectedMoverIndex(null);
            if (isLastPhaseOfTurn) {
              // Movimentação (always the last phase — see phasesForTurn) is ending —
              // this is "Após Remanejamento" for Comandante Aurelion (see
              // grantAurelionBuff) and Soldado Tático's end-of-turn swap, both of
              // which read this turn's movedSlots, so they fire here rather than
              // when Preparação used to end, back when it was the phase movement
              // itself happened in.
              setPlayerSlots(prev => applyEndOfTurnSwaps(grantAurelionBuff(prev, movedSlots)));
              announceTurnChange('npc');
              setCurrentTurn('npc');
            } else {
              const idx = activePhases.indexOf(turnPhase);
              const nextPhase = activePhases[idx + 1];
              setTurnPhase(nextPhase);
              announcePhase(nextPhase);
            }
          }}
        >
          {/* A single rectangular button carrying its own text, replacing the old
              circular button + a separate "whose turn" label above it + a separate
              "Encerrar Turno" label below it (see git history) — that stack read as
              three things instead of one, and the top/bottom labels' text was tiny
              for how much vertical space the whole cluster spent. A FIXED WIDTH (not
              sized to its own text) — the text changes length by state (Avançar/
              Encerrar/Adversário), and letting the box follow that used to visibly
              push the gold badges on either side of it wider/narrower every time the
              turn or phase changed. The pulsing glow (still just the same decorative
              loop the old circular button had) is what actually signals "tap me"
              while it's the player's turn. Text: "Avançar" reads more honestly than
              the old "Seu Turno" did — tapping this advances to the NEXT phase, not
              the player's own turn ending, which only "Encerrar" (the very last
              phase) actually does.

              The player-turn version is built from a real art asset (button-frame.png,
              cropped from a reference sheet the user had an AI generate) instead of a
              plain CSS gradient box. Width and height are both fixed pixel values now,
              not the art's own native 1344:400 ratio locked via `aspectRatio` (see git
              history) — that kept the border from ever stretching, but also meant
              widening the box to fit bigger, more readable text always grew its height
              in lockstep, and this box's height is hard-capped by the ~48px gap between
              the board's own rows (see below). A mild ~25% horizontal stretch past the
              art's native ratio reads as fine given how simple its border geometry is
              (straight bevels and diamond accent points, no fine circular detail that
              stretching would visibly warp) — the tradeoff for legible text at this
              width. An earlier pass kept a plain amber CSS
              gradient behind it, meant to show through the plaque's transparent cutout —
              but that div was a plain rounded rectangle, and the frame's actual silhouette
              is an angular diamond-cut shape well INSIDE that rectangle's corners, so the
              gradient's own rounded corners poked out past the art (visibly, right where
              the diamond accents are) instead of being fully hidden behind it. Dropped
              entirely: the plaque's cutout now just shows the board through it, same as
              the track's own art (already fully opaque, no backdrop needed there).
              Both content zones below (top/left/width/height as percentages) are measured
              directly from the art's own transparent-plaque and opaque-track bounds (see
              the analysis behind this comment in git history) rather than eyeballed —
              this frame's border reads as quite thick relative to the whole asset, so a
              rough guess visibly off-centers text from the panel it should sit inside,
              not just looking a bit loose. Its track area has two chevrons pre-drawn, so
              the three phase groups use justify-around to fall roughly into the three
              lanes those imply, rather than drawing our own separator glyphs on top.

              Height is capped to fit the actual gap between the board's own npc/player
              Vanguarda rows (measured ~48px tall at this viewport) — a previous version
              locked to the art's own aspect ratio and grew past that gap, overlapping
              both neighboring rows by ~10px each side. Width, freed from that same
              ratio, grew separately once the gold badges beside this button dropped
              their old side-by-side label (stacked below the coin instead — see that
              badge's own comment) and stopped needing as much of the row's own width.
              The "Turno N" / "Combate no Turno 3" line lives in a THIRD zone here, in the
              frame's own bottom border margin (below the track's opaque panel, still
              within the art's own silhouette) rather than as a sibling below the frame —
              text-shadow (not a flat backdrop, there's no dedicated panel back there)
              keeps it legible over that textured trim. No pulsing box-shadow glow either
              anymore — it animated on this element's own bounding BOX, a plain rectangle
              that doesn't match the frame art's angular diamond-cut silhouette, so it
              read as a separate ghost rectangle floating around the ornate border rather
              than a glow coming from it. */}
          {(() => {
            // Shared by both branches below (see their own comments) — the same framed
            // layout now renders for BOTH turns, not just the player's: the opponent's
            // turn used to be a plain "Adversário" box with no phase info at all, but
            // the stepper is just as informative during their turn (it's watching the
            // SAME npcVisiblePhase this button's neighboring side-column already reads —
            // see renderPhaseTagColumn's own npc call site — just baked into this same
            // framed layout for consistency instead of a second, differently-styled
            // display). Combate's lock and the turn counter are global to the match, not
            // per-side, so they read identically either way.
            const isPlayerTurn = currentTurn === 'player';
            const activePhaseForStepper = isPlayerTurn ? turnPhase : npcVisiblePhase;
            const mainLabel = isPlayerTurn
              ? (isLastPhaseOfTurn ? 'Encerrar Turno' : `Finalizar ${PHASE_SHORT_LABEL[turnPhase]}`)
              : 'Adversário';
            return (
              <motion.div
                className={`relative w-[182px] md:w-[204px] h-[40px] md:h-[46px] font-black uppercase tracking-wide ${isPlayerTurn ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                whileTap={isPlayerTurn ? { scale: 0.95 } : undefined}
              >
                {/* The plaque's own cutout is fully transparent in the art (see the frame's
                    comment above) — this fills just that cutout's exact shape with color
                    (green for the player's turn, red for the opponent's, matching the
                    theme "Adversário" already had elsewhere) instead of the whole box, so
                    it can't poke out past the frame's angular corners the way a plain
                    rounded-rect backdrop did before. Built from a separate mask asset (see
                    git history for how it's derived from the same source sheet's alpha
                    channel) applied as a CSS mask — the mask image itself carries no
                    color, just the plaque's silhouette, so the actual color comes from this
                    div's own background and can change with isPlayerTurn without needing a
                    second image asset per color. */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    WebkitMaskImage: `url(${plaqueMaskImage})`,
                    maskImage: `url(${plaqueMaskImage})`,
                    WebkitMaskSize: '100% 100%',
                    maskSize: '100% 100%',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    background: isPlayerTurn
                      ? 'linear-gradient(to bottom, #4ade80, #15803d)'
                      : 'linear-gradient(to bottom, #f87171, #7f1d1d)',
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: `url(${turnButtonFrameImage})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }}
                />
                {/* All three zones below are measured pixel-for-pixel from the actual art
                    (its transparent "plaque" cutout, its opaque "track" panel, and the
                    plain border margin below that), not eyeballed — the frame's own
                    decorative border is quite thick relative to its total size, so a rough
                    guess here visibly off-centers content from the panel it's supposed to
                    sit inside instead of just looking a bit loose. Text color: the plaque's
                    own cutout shows the board through it (see the frame's own comment
                    above), so plain dark text (right for the amber CSS backdrop this used
                    to sit on) blended into whatever happened to be behind it — a bright
                    color with a strong dark text-shadow (same treatment as the turn-info
                    zone below) keeps it legible over any board texture instead of reading
                    as colorless. */}
                <div className="absolute flex items-center justify-center gap-1" style={{ top: '14%', left: '13%', width: '74%', height: '30%' }}>
                  {/* Both children measure as centered on the SAME row (verified via
                      getBoundingClientRect, not eyeballed) — the visible mismatch is bold
                      all-caps text's own glyphs sitting higher in their line box than a
                      tightly-cropped icon's ink fills its own box, not a layout bug, so
                      it's corrected with a small manual nudge instead of a flex property.
                      Text/icon sizes below are ~11% smaller than when this zone's own %
                      dimensions were first tuned (this whole button shrank by that much —
                      see its own w-/h- classes above) — this zone's own box shrank with
                      it, but the font size doesn't automatically follow a % width, so
                      "Finalizar Preparação" (the longest real label — Movimentação is
                      always the LAST phase of a turn, so "Finalizar Movimentação" itself
                      never actually renders) started overflowing the plaque's edges by a
                      few px. Verified via getBoundingClientRect again at this size: it
                      now clears both edges by ~2.5px with the icon+text group centered
                      within a fraction of a pixel. */}
                  {isPlayerTurn && (
                    <img src={chevronDoubleImage} className="w-[7.5px] h-[5.5px] md:w-[9px] md:h-[6.5px] shrink-0 -translate-y-[1.5px]" alt="" />
                  )}
                  <span
                    className="text-[8px] md:text-[10px] leading-none whitespace-nowrap text-white"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.95)' }}
                  >
                    {mainLabel}
                  </span>
                </div>
                {/* A mini phase stepper baked right into the button instead of a plain
                    "Avançar" — ALL THREE phases, always, Combate included even on turns
                    1-2 when it's locked — showing only the phases a turn currently has
                    used to make Combate vanish outright until turn 3, which read as if
                    it didn't exist rather than as "not yet". Each phase gets a small
                    ring badge (green = THIS is the phase being played right now, red =
                    every other phase, padlock = locked) instead of a colored pill — the
                    ask was specifically for only the active phase to read as "on", with
                    every other one (played already or still ahead) reading as "off"
                    rather than some third, in-between "available" state — full names
                    stay in text alongside it either way, so a player who doesn't
                    recognize the badge yet still has the word. The current phase's own
                    ring glows too (an animated drop-shadow, which follows the ring PNG's
                    actual round alpha shape instead of a rectangular box-shadow around
                    its bounding box) so "this one's active" reads at a glance even
                    before noticing the color — npcVisiblePhase never reaches
                    'movimentacao' (the AI never repositions), so that ring simply never
                    lights up on the opponent's turn, which is correct.

                    flex-1 on each phase (equal thirds), not justify-around on organically-
                    sized items — "Movimentação" was by far the longest name, and letting
                    it claim whatever width it wanted left less room for justify-around's
                    own gap math to work with, visibly cramming its ring against the
                    border and uneven-spacing "Combate" next to it. Equal columns make
                    every phase's available width the same regardless of its own name's
                    length; at the font size below (chosen by measuring "Movimentação"'s
                    own rendered width, not eyeballed) the full word now fits with margin
                    to spare, so it's spelled out in full like every other label.

                    Both node-current.webp and node-future.webp started as the same dark,
                    muted reference-sheet art (olive-green and neutral gray) — barely
                    distinguishable from each other at this render size, let alone
                    readable as "on" vs "off" at a glance. Recolored the ring band's own
                    pixels in both (see git history for how — the green ring's own hue
                    cleanly separated its ring band from its gold border in a way the
                    neutral gray one couldn't on its own, so that same mask, shape-matched
                    onto the gray source, drove the red recolor too), keeping the gold
                    border accents and each ring's own light/shadow shading intact.

                    leading-none on each span, matching the main label above (which
                    already had it for the same reason): without it, the browser's
                    default line-height reserves extra space around each word's own
                    glyphs, and how much space differs slightly per word depending on
                    ascenders/descenders — collapsing it to the font's own metrics keeps
                    items-center's centering based on the actual ink instead of that
                    reserved space, verified against getBoundingClientRect (all three
                    words now measure to the exact same top/bottom). object-contain on
                    the icon below matters specifically for the padlock: its own source
                    art (icon-lock-turn.webp) is a portrait 53x64 canvas, not the near-
                    square 64x61/64x60 the two ring badges use, so without it the padlock
                    was stretched wider to fill this same square box instead of keeping
                    its own proportions — same fix applied to its other use in the
                    turn-info line below.

                    The icon's own -translate-y-[0.8px]: even with leading-none, the
                    icon's box (sized to its own height, 8.5px) and the text's own line
                    box (collapsed to the font's real metrics, ~5.2px) each get centered
                    independently by items-center — correct per CSS, but a cap-height-only
                    word's ink isn't perfectly centered within ITS OWN line box either
                    (fonts generally reserve a bit more room above than below), so the
                    two centered boxes' actual ink still landed ~0.8px apart. Verified via
                    getBoundingClientRect: identical for all three phases (same offset,
                    same direction), so this is one shared, measurable icon-vs-text gap,
                    not three separately misaligned words — nudging the icon by that exact
                    measured amount (same fix pattern as the chevron in the main label
                    above) closes it. */}
                <div className="absolute flex items-center" style={{ top: '55.5%', left: '5%', width: '90%', height: '21%' }}>
                  {PHASE_TAG_ORDER.map(p => {
                    const isLocked = p === 'combate' && turnNumber < 3;
                    const isCurrent = p === activePhaseForStepper;
                    const nodeImg = isLocked ? nodeLockedImage : isCurrent ? nodeCurrentImage : nodeFutureImage;
                    return (
                      <span
                        key={p}
                        className={`flex-1 flex items-center justify-center gap-[1.5px] text-[4.5px] md:text-[5.5px] font-medium tracking-normal leading-none whitespace-nowrap ${
                          isCurrent ? 'text-amber-200' : 'text-zinc-400'
                        }`}
                      >
                        <motion.img
                          src={nodeImg}
                          className="w-[8.5px] h-[8.5px] md:w-[10px] md:h-[10px] shrink-0 object-contain -translate-y-[0.8px]"
                          alt=""
                          animate={isCurrent ? {
                            filter: [
                              'drop-shadow(0 0 1.5px rgba(57,255,20,0.9)) drop-shadow(0 0 0.5px rgba(190,255,170,1))',
                              'drop-shadow(0 0 3.5px rgba(57,255,20,1)) drop-shadow(0 0 1px rgba(190,255,170,1))',
                              'drop-shadow(0 0 1.5px rgba(57,255,20,0.9)) drop-shadow(0 0 0.5px rgba(190,255,170,1))',
                            ],
                          } : undefined}
                          transition={isCurrent ? { duration: 1.4, repeat: Infinity } : undefined}
                        />
                        {PHASE_SHORT_LABEL[p]}
                      </span>
                    );
                  })}
                </div>
                {/* The "Turno N" readout + (while locked) the "Combate no Turno 3" hint —
                    matches the info line under the user's own reference mockup. Sits in
                    the frame's bottom border margin (below the track's own art, still
                    within the whole asset's silhouette) with a text-shadow instead of a
                    background — there's no dedicated flat panel back there to match.
                    Always shown (not just on the player's turn, and not just while
                    Combate is locked) since both the turn counter and the lock hint are
                    global to the match, not tied to whose turn it currently is. Font size
                    (and its own icons, scaled the same ~18% down) now matches the phase
                    stepper line just above it exactly — it used to run noticeably bigger
                    than that line per the user's own explicit ask to bring the two in
                    line. leading-none added for the same reason the stepper line has it
                    (see its own comment): without it, the default line-height reserves
                    different amounts of space above/below words with a descender (the
                    "ç" in Combate No Turno 3 has none, this line's other words do) than
                    words without one, so "centered" text can look like it's sitting on a
                    slightly different baseline even though nothing is actually misaligned
                    in the font itself. */}
                <div
                  className="absolute flex items-center justify-center gap-1 text-[4.5px] md:text-[5.5px] font-black uppercase tracking-wide leading-none text-amber-200 whitespace-nowrap"
                  style={{ top: '80%', left: '4%', width: '92%', height: '16%', textShadow: '0 1px 1px rgba(0,0,0,0.9)' }}
                >
                  <img src={hourglassImage} className="w-[4.5px] h-[5.5px] md:w-[6px] md:h-[7px] shrink-0" alt="" />
                  {`Turno ${turnNumber}`}
                  {turnNumber < 3 && (
                    <>
                      <span className="text-amber-200/50">|</span>
                      <img src={nodeLockedImage} className="w-[4.5px] h-[5px] md:w-[6px] md:h-[6px] shrink-0 object-contain" alt="" />
                      Combate no Turno 3
                    </>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* Player's gold — same distance from the button as the NPC's above, same
            stacked-and-shrunk treatment (see that badge's own comment for why). */}
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <div id="player-gold-badge" onClick={(e) => e.stopPropagation()} className="pointer-events-auto shrink-0">
            <GoldBadge value={playerMana} className="w-14 md:w-16" />
          </div>
          <span className="text-[6px] md:text-[7px] font-black uppercase tracking-wide text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
            Jogador
          </span>
        </div>
      </div>
      </motion.div>

      {/* Phase-tag columns — one planted near each field's own edge, diagonally
          opposite each other (NPC's near the top-left, the player's own near the
          bottom-right) so each sits right next to that side's own field instead of
          competing for the center strip the gold/turn-button HUD uses (see that HUD's
          own comment just above — unlike this pair, it's now a board-local child of
          the board's own OUTER motion.div instead of viewport-pixel math). These stay
          on plain viewport pixels on purpose: the board can render WIDER than the
          viewport at this boardScale (see the zoom bump), so anchoring to the board's
          OWN left/right edge, which these originally did, put them off-screen half the
          time — the board's actual columns sit comfortably inset from the board's raw
          edges, but the raw edges themselves are exactly what a card-play zoom can push
          past the visible screen. Reuses boardTopMargin/boardHeightMultiplier from
          above — same viewport-space math, just at 24%/76% down the board's own
          height instead of 60%, and pinned to the screen's actual left/right edges
          instead of centered. */}
      <div
        className="absolute left-1 md:left-3 z-30 pointer-events-none"
        style={{ top: boardTopMargin + 0.24 * 1250 * boardHeightMultiplier, transform: 'translateY(-50%)' }}
      >
        {renderPhaseTagColumn(currentTurn === 'npc' ? npcVisiblePhase : null)}
      </div>
      <div
        className="absolute right-1 md:right-3 z-30 pointer-events-none"
        style={{ top: boardTopMargin + 0.76 * 1250 * boardHeightMultiplier, transform: 'translateY(-50%)' }}
      >
        {renderPhaseTagColumn(currentTurn === 'player' ? turnPhase : null)}
      </div>


      {/* Opponent Hand (Floating) — one face-down card back per card actually in
          npcHand, revealed one at a time during the match-intro deal (see
          startMatchIntro) and again whenever the AI draws for its turn, each card
          sliding in from roughly where the opponent's deck sits (on the LEFT side of
          the board). The player never sees what's actually in it. This lives as a
          sibling of the 3D board rather than inside it: the board's own motion.div
          carries a rotateX tilt (see baseAnim in getBoardAnimation) that every card
          lying flat on its surface should inherit, but this hand floats above the
          table facing the player and needs to stay upright. A counter-rotateX inside
          the board didn't work — the board never opts into transform-style:
          preserve-3d, so a child's own 3D scene gets flattened before the board's
          rotation is applied to it, and the counter-rotation has no visible effect.
          Living outside the tilted subtree entirely sidesteps that — but it also
          means this hand no longer inherits the board's own scale-down (see
          baseAnim.scale in getBoardAnimation), so without correcting for that it
          renders at full, unscaled card size instead of sitting small and "far
          away" like the rest of the opponent's side of the table. Reapplying that
          same scale factor here keeps it the same size it always was. */}
      <div
        // Planted just above the board's own top edge (see boardTopMargin above) with
        // only a small gap, the same way the player's own hand sits right up against
        // the board's bottom edge — it used to hang at a fixed offset that had no idea
        // how big the actual top margin was, leaving most of that margin empty above
        // the hand instead of using it to sit close to the board like the player's does.
        className="absolute left-1/2 -translate-x-1/2 flex pointer-events-none z-40"
        style={{
          top: `${boardTopMargin - (isMobile ? 192 : 224) * boardHeightMultiplier - 35}px`,
          transform: `scale(${boardHeightMultiplier})`,
          transformOrigin: 'top center',
        }}
      >
        {[...Array(npcHand.length)].map((_, i) => {
          // Same fan technique as the player's own hand (see getFanRotation/getFanLift
          // and HAND_CARD_STEP below): overlapping cards via a negative margin, rotated
          // and lifted outward from the center, instead of a flat evenly-gapped row —
          // otherwise this reads as a straight strip of tilted cards, not a hand fan.
          const npcCardWidth = isMobile ? 128 : 160;
          const npcCardStep = npcCardWidth * 0.5;
          return (
          <motion.div
            key={`npc-hand-${i}`}
            className="w-32 h-48 md:w-40 md:h-56 shrink-0 relative"
            style={{
              transformOrigin: 'top center',
              marginLeft: i === 0 ? 0 : npcCardStep - npcCardWidth,
            }}
            initial={{ x: -260, y: 40, opacity: 0, rotateZ: getFanRotation(i, npcHand.length) - 20, scale: 0.7 }}
            animate={{
              x: 0,
              y: getFanLift(i, npcHand.length),
              opacity: 1,
              rotateZ: getFanRotation(i, npcHand.length),
              scale: 1,
              zIndex: i + 1,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Card Back Design — flipped 180° around its OWN center (a separate inner
                wrapper, not folded into the fan's rotateZ above, which pivots around
                'top center': a 180° turn around THAT pivot would relocate the whole
                card to the opposite side of the pivot point instead of just flipping
                it in place). This is just the plain card-back art (no face content to
                read either way), kept flipped from the opponent's own perspective —
                unlike their BOARD cards, which no longer flip (see CardSlot below),
                since there's nothing here for that change to help read. */}
            <div style={{ transform: 'rotate(180deg)', transformOrigin: 'center center', width: '100%', height: '100%', position: 'relative' }}>
              <CardBack shadow />
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Hand UI */}
      <motion.div
        className="absolute inset-0 w-full h-full flex justify-center items-end pb-12 md:pb-6 pointer-events-none z-50"
        // Anchor scaling at the bottom-center of the screen (instead of the default
        // center) so shrinking the hand to fit (handScale) keeps it flush against the
        // real bottom edge rather than pulling it up toward the middle of the screen,
        // which used to leave a large empty gap below the cards on mobile.
        style={{ transformOrigin: 'bottom center' }}
        animate={{
          scale: handScale,
          // On mobile, the resting hand sits with roughly its bottom fifth
          // pushed past the real screen edge — tapping a card still shows it
          // in full (see the fixed tap-preview overlay further down, which
          // is positioned independently of this tray), so the hand can give
          // up that sliver of height without losing any readability, buying
          // back board space above it.
          y: isMobile
            ? (viewState === 'field' ? 200 : HAND_CARD_HEIGHT * handScale * 0.22)
            : (viewState === 'field' ? 220 : 0),
          // Hidden once the card is actually flying to the board (and briefly after, while
          // the camera settles) so the rest of the hand doesn't clutter the summon
          // animation. NOT hidden during the camera's pre-zoom hold, though — the selected
          // card is still sitting right here in its floating preview spot and must stay
          // visible the whole time, with no gap before the flying overlay takes over.
          opacity: (flyingCard || cameraSettling) ? 0 : 1,
        }}
        transition={{ opacity: { duration: 0.15 } }}
      >
        <div className="flex pointer-events-none">
          <AnimatePresence>
            {hand.map((card, i) => {
              const origin = drawOriginsRef.current[card.id];
              // An Emboscada card the player can react with right now (see
              // maybeActivatePlayerAmbush) — gets the exact same "floating preview"
              // treatment as a manually selected card below, so the ambush prompt
              // reads as this specific card in the player's hand standing out, not a
              // separate screen replacing the hand.
              const isAmbushCandidate = ambushPrompt?.options.some(o => o.id === card.id) ?? false;
              const isFocused = selectedCardIndex === i || isAmbushCandidate;
              return (
              <motion.div
                // No layoutId here: it would make Framer Motion auto-animate this card's
                // layout position with its own internal spring on ANY re-render that
                // shifts its computed position even slightly (e.g. when unrelated sibling
                // state like cameraSettling/impactBurst toggles) — fighting our own
                // explicit animate/transition below and causing a visible re-bounce each
                // time. key alone is enough for React to keep reusing this same DOM node.
                key={card.id}
                ref={(el) => { handCardRefs.current[card.id] = el; }}
                className={`w-56 h-80 shrink-0 cursor-pointer relative group ${viewState === 'field' || (selectedCardIndex !== null && !isFocused) ? 'pointer-events-none' : 'pointer-events-auto'}`}
                // A freshly drawn card (see computeDrawOrigin) mounts sitting right at the
                // real on-board deck's position/size and animates itself — this same
                // element, start to finish — into its fan slot below, flipping from its
                // back face to its front face along the way (see the 3D flip wrapper
                // inside). Nothing hands off to a different element partway through.
                initial={origin
                  ? { opacity: 1, x: origin.x, y: origin.y, scale: origin.scale, rotateZ: 0 }
                  : { opacity: 1, x: 0, y: getFanLift(i), scale: 1, rotateZ: getFanRotation(i) }
                }
                style={{
                  transformOrigin: 'bottom center',
                  marginLeft: i === 0 ? 0 : HAND_CARD_STEP - HAND_CARD_WIDTH,
                }}
                animate={{
                  // Hidden while tap-previewed (see the fixed "Hand card tap preview"
                  // overlay further down) — that floating, fixed-position copy does the
                  // showing instead, so this real element (still sitting inside the
                  // hand tray's own transformed stacking context) would otherwise
                  // double up with it on screen.
                  opacity: (isFocused && viewState === 'hand') ? 0 : viewState === 'field'
                    ? (isFocused ? 1 : 0.4)
                    // A selected card hides the rest of the hand outright (not just dimmed)
                    // — only the selected card should read as "in play" while the player
                    // picks a destination for it, per the user's own ask. An Emboscada
                    // interrupt prompt (ambushPrompt, unrelated to a manual selection)
                    // still just dims the rest, since that's a brief forced decision, not
                    // an open-ended "pick where to play this" state.
                    : (selectedCardIndex !== null && !isFocused ? 0 : ambushPrompt && !isFocused ? 0.3 : 1),
                  x: isFocused && viewState === 'field' ? getSelectedCardX(i) : 0,
                  // Float the previewed card up near the vertical center of the real screen
                  // instead of sitting down at the hand's normal resting height (see
                  // getSelectedCardY above for how mobile's handScale is compensated for).
                  y: isFocused && viewState === 'field' ? getSelectedCardY() : getFanLift(i),
                  scale: isFocused && viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) : 1,
                  rotateZ: isFocused || viewState === 'field' ? 0 : getFanRotation(i),
                  zIndex: isFocused ? 150 : i + 1,
                  // boxShadow lives on the front face now (see below), not here: a shadow
                  // on THIS element is a flat 2D box that doesn't perspective-foreshorten
                  // the way the nested 3D-rotated card does, so during the flip it kept
                  // rendering as a separate, undistorted rounded-rectangle ghost sitting
                  // behind the actual (already turning, narrower-looking) card.
                }}
                whileHover={{
                  y: isFocused && viewState === 'field' ? getSelectedCardY() : (viewState === 'field' ? 120 : -20),
                  scale: isFocused && viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) + 0.05 : 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                // A freshly drawn card gets a slower transition, matching the full travel
                // time from the deck (the flip itself is a separate, nested rotateY — see
                // below — kept off this element entirely: composing a Z-axis fan rotation
                // with a Y-axis flip on the SAME transform mirrors the fan rotation once
                // the flip passes 90°, which is what made settled cards look crooked).
                // Cleared via onAnimationComplete once that first arrival finishes, so
                // every later interaction (hover, selection, the fan reflowing for the
                // next card) goes back to the normal snappy transition.
                transition={{
                  duration: origin ? DRAW_FLIGHT_MS / 1000 : 0.4,
                  ease: "easeOut",
                  zIndex: { delay: isFocused ? 0 : 0.4 },
                }}
                onAnimationComplete={() => { delete drawOriginsRef.current[card.id]; }}
                onClick={(e) => {
                  e.stopPropagation();
                  // An ambush interrupt isn't the normal "pick a card to play" flow —
                  // tapping the highlighted card here shouldn't fall into handleCardClick's
                  // own selection logic (which would just bounce off the Preparação-phase
                  // check anyway, but with an unrelated toast).
                  if (ambushPrompt) return;
                  handleCardClick(i);
                }}
              >
                {/* The 3D flip lives on its own dedicated element, nested inside the outer
                    div above — never combined with that div's rotateZ (the fan angle).
                    Composing a Z rotation and a Y rotation on the SAME transform mirrors
                    the Z rotation once the Y flip passes 90° (each subsequent rotation
                    applies in the already-rotated local frame), which is exactly what was
                    making settled cards render crooked: every card's fan angle was being
                    flipped left-right once it finished turning face up. */}
                <div className="absolute inset-0" style={{ perspective: 1000 }}>
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                    initial={{ rotateY: origin ? 0 : 180 }}
                    animate={{ rotateY: 180 }}
                    transition={origin
                      ? { delay: DRAW_FLIGHT_MS * 0.55 / 1000, duration: DRAW_FLIGHT_MS * 0.4 / 1000, ease: "easeInOut" }
                      : { duration: 0 }
                    }
                  >
                    {/* Back face — plain card-back design, shown while rotateY is near 0.
                        backfaceVisibility hides this once flipped past 90°, leaving the
                        front face below. */}
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <CardBack shadow />
                    </div>

                    {/* Front face — the real card, pre-rotated 180° so it reads upright
                        once this wrapper reaches its rest angle. No background/border of
                        its own: CardFace's template art draws the entire frame, so this is
                        just a positioning shell. The selection/idle glow lives here (not on
                        the outer div) so it's part of the same 3D-rotated surface as the
                        card itself, instead of a flat 2D shadow that stayed undistorted
                        while the actual card was still perspective-foreshortened mid-flip. */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      // filter lives here too, not a separate wrapper, for the same
                      // foreshortening reason the comment above gives for boxShadow — see
                      // CARD_THICKNESS_SHADOW's own comment for what it's doing.
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', filter: CARD_THICKNESS_SHADOW }}
                      animate={{
                        boxShadow: isFocused
                          ? "inset 0 0 0 1px rgba(212,175,55,0.45), 0 0 120px rgba(212, 175, 55, 0.95)"
                          : "inset 0 0 0 1px rgba(212,175,55,0.45), 0 10px 30px rgba(0,0,0,0.5)"
                      }}
                      whileHover={{
                        boxShadow: isFocused
                          ? "0 0 80px rgba(212, 175, 55, 0.8)"
                          : "0 0 25px rgba(212, 175, 55, 0.5)"
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                  {/* No more Info button here — a plain tap now shows this exact card as
                      an enlarged floating preview (see the "Hand card tap preview"
                      overlay further down), big enough to read on its own and to tap a
                      highlighted board destination from, so the separate "i" button +
                      modal round-trip this used to open (still used by board cards, see
                      CardSlot) isn't needed for hand cards anymore. */}
                  <CardFace card={card} variant="hand" />

                  {/* Selection Glow — red for an Emboscada interrupt (matches the old
                      "Emboscada disponível!" warning color), gold for a normal
                      hand-card selection. */}
                  {isFocused && (
                    <div className={`absolute inset-0 rounded-xl border-2 pointer-events-none ${isAmbushCandidate ? 'shadow-[inset_0_0_30px_rgba(239,68,68,0.6)] border-[#ef4444]' : 'shadow-[inset_0_0_30px_rgba(212,175,55,0.6)] border-[#d4af37]'}`} />
                  )}

                  {/* Emboscada interrupt — "here's the card, activate it or not?" anchored
                      right on the eligible card itself instead of a separate dialog, so
                      the rest of the hand stays visible the whole time (see
                      maybeActivatePlayerAmbush). */}
                  {isAmbushCandidate && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.9 }}
                      className="absolute -top-5 left-1/2 -translate-x-1/2 z-40 flex gap-2 pointer-events-auto whitespace-nowrap"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHand(prev => prev.filter(c => c.id !== card.id));
                          setPlayerGraveyard(g => [...g, card]);
                          showToast(`Emboscada ativada: ${card.name}!`);
                          playTacticSfx();
                          ambushPrompt!.resolve(card);
                          setAmbushPrompt(null);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.7)] border-2 border-emerald-400"
                      >
                        Ativar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          ambushPrompt!.resolve(null);
                          setAmbushPrompt(null);
                        }}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-2 border-zinc-500"
                      >
                        Não
                      </button>
                    </motion.div>
                  )}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>



      {/* The manual "Visualizar Campo" toggle that used to live here was removed — it
          only duplicated what already happens automatically the moment a card is
          actually played (see handlePlayCardButtonClick, which sets viewState to
          'field' itself), so it was one more thing sitting in the corner without a
          real job, plus it was colliding with the opponent's hand fan up there. */}

      {/* Hand card tap preview — a plain tap on a hand card (see handleCardClick,
          selectedCardIndex) shows this instead of enlarging the real card in place:
          a fixed, top-level, always-on-top floating copy. The real hand card fades
          to opacity 0 for as long as this is up (see its own animate block above).
          This floating copy IS the selected-card representation the rest of the
          tap-to-play flow builds on: the board highlights this card's valid
          destinations at the same time (see getPlayerSlotHint/isTacticTargetSlot),
          and tapping one plays it — from the player's perspective it's the same
          card the whole time, just already big enough to read. Not shown during an
          Emboscada interrupt (that prompt anchors the real card itself, see
          isAmbushCandidate above). */}
      {selectedCardIndex !== null && viewState === 'hand' && !ambushPrompt && hand[selectedCardIndex] && (() => {
        const card = hand[selectedCardIndex];
        const previewScale = (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) * 0.55;
        const w = HAND_CARD_WIDTH * previewScale;
        const h = HAND_CARD_HEIGHT * previewScale;
        const edgeGap = 6;
        // Pushed as far left as it can go (centering it — see git history — still
        // sat it right on top of the General/Relíquia/Terreno row, the closest row
        // to the hand and dead-center on the board) so it clears both the board's
        // own destination highlights and the gold/turn-button HUD sitting near the
        // screen's vertical middle. The rest of the hand hides outright the moment a
        // card is selected (see the real hand card's own opacity above), so this can
        // sit right down at the true bottom-left corner without covering anything
        // back there either.
        return (
          <div
            className="fixed z-[260]"
            style={{ left: edgeGap, bottom: edgeGap, width: w, height: h }}
            onClick={(e) => { e.stopPropagation(); handleCardClick(selectedCardIndex); }}
          >
            {/* The glow radius here used to be tuned for this preview's old, much
                bigger size (before it shrank to get out of the board's way) — left
                as-is, that same 100px blur no longer read as a card glow at this
                smaller footprint, just a diffuse gold smudge bleeding out around it.
                Scaled down to match. */}
            <div
              className="relative w-full h-full rounded-xl"
              style={{ boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.45), 0 0 18px rgba(212, 175, 55, 0.8)", filter: CARD_THICKNESS_SHADOW }}
            >
              <CardFace card={card} variant="hand" />
            </div>
          </div>
        );
      })()}
      {/* Flying card — plays from hand to the chosen board slot along real screen coordinates.
          Rises to a large "presentation" size above the slot, holds briefly, then descends
          straight down into place. Kept simple on purpose: no wobble, dip, or shake. */}
      <AnimatePresence>
        {flyingCard && (() => {
          // Keep the box at the card's real intrinsic size (same as the hand card's own
          // w-56 h-80) and do ALL resizing through the scale transform, exactly like the
          // hand card does. Setting literal width/height to the small on-screen pixel
          // size (as this used to) breaks the content's own layout — a min-h-[5rem] text
          // box and full-size badges don't fit inside a ~100px-tall box, so everything
          // overflowed and badges flew off far outside the card.
          const HALF_W = HAND_CARD_WIDTH / 2;
          const HALF_H = HAND_CARD_HEIGHT / 2;
          const startScale = flyingCard.fromW / HAND_CARD_WIDTH;
          const endScale = flyingCard.toW / HAND_CARD_WIDTH;
          const hoverScale = Math.min(3, Math.max(0.8, 190 / flyingCard.fromW));
          const hoverX = flyingCard.toX;
          const hoverY = flyingCard.toY - 70;
          const times = [0, 0.55, 0.7, 1];
          return (
            <motion.div
              initial={{
                left: flyingCard.fromX - HALF_W,
                top: flyingCard.fromY - HALF_H,
                width: HAND_CARD_WIDTH,
                height: HAND_CARD_HEIGHT,
                scale: startScale,
              }}
              animate={{
                // Rise up to the hover presentation, hold there, then drop straight down.
                left: [flyingCard.fromX - HALF_W, hoverX - HALF_W, hoverX - HALF_W, flyingCard.toX - HALF_W],
                top: [flyingCard.fromY - HALF_H, hoverY - HALF_H, hoverY - HALF_H, flyingCard.toY - HALF_H],
                width: HAND_CARD_WIDTH,
                height: HAND_CARD_HEIGHT,
                scale: [startScale, startScale * hoverScale, startScale * hoverScale, endScale],
                times,
              }}
              transition={{ duration: 0.95, ease: ["easeOut", "linear", "easeIn"] }}
              onAnimationComplete={() => {
                setPlayerSlots(prev => {
                  const next = [...prev];
                  next[flyingCard.slotIndex] = flyingCard.card;
                  // Nobre da Cruzada: "Ao entrar em campo: invoca Soldados Leais..."
                  return applyNobreReligiosoSummon(next, flyingCard.slotIndex);
                });
                playCardPlaySfx();
                // Impact burst + brief camera shake right as the card lands. A full-art
                // card (see CardData.isFullArt) gets the bigger version of both, plus
                // makes every other card on the board flinch (see triggerFullArtReaction).
                const big = !!flyingCard.card.isFullArt;
                setImpactBurst({ x: flyingCard.toX, y: flyingCard.toY, big });
                setTimeout(() => setImpactBurst(null), big ? 950 : 780);
                if (big) triggerFullArtReaction();
                // Keep the camera's zoomed focus on the slot for a beat before easing back.
                setCameraSettling({ slotIndex: flyingCard.slotIndex });
                setFlyingCard(null);
                setTimeout(() => setCameraSettling(null), big ? 500 : 300);
              }}
              style={{
                position: 'fixed', zIndex: 500, transformOrigin: 'center center',
                boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.45), 0 0 40px rgba(212,175,55,0.6)',
                filter: CARD_THICKNESS_SHADOW,
              }}
              // Same frame, art, and layout as the hand card it came from — it should read
              // as the exact same card the whole time, not switch to a simplified design.
              className="pointer-events-none rounded-xl flex flex-col p-2 relative"
            >
              <CardFace card={flyingCard.card} variant="hand" />
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Impact burst — flash, double shockwave, radiating sparks and a ground shadow pulse
          where the card just landed. */}
      <AnimatePresence>
        {impactBurst && (() => {
          const big = !!impactBurst.big;
          const mult = big ? 1.6 : 1;
          // Real dust, not sparkle: dry earth tones, no glow/blur, and an actual arc —
          // kicked up fast, then gravity pulls each speck back down as it fades, instead
          // of just floating outward and dissolving. Twice the count on a full-art land.
          const dustCount = big ? 22 : 12;
          const dustTones = ['#8a7a5f', '#71614a', '#a3906d', '#5c5040', '#96835f'];
          return (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: big ? 0.95 : 0.75 }}
              style={{ position: 'fixed', left: impactBurst.x, top: impactBurst.y, zIndex: 499 }}
              className="pointer-events-none -translate-x-1/2 -translate-y-1/2"
            >
              {/* Ground shadow pulse — a flattened ring suggesting weight hitting the field */}
              <motion.div
                initial={{ scaleX: 0.3, scaleY: 0.1, opacity: 0.7 }}
                animate={{ scaleX: 2.4 * mult, scaleY: 0.5 * mult, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -inset-8 rounded-full bg-black/70 blur-sm"
              />
              {/* Bright core flash */}
              <motion.div
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: 1.4 * mult, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute -inset-4 rounded-full bg-white"
                style={{ boxShadow: '0 0 40px 10px rgba(255,255,255,0.95)' }}
              />
              {/* Inner glow */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0.95 }}
                animate={{ scale: 1.8 * mult, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute -inset-7 rounded-full bg-amber-200/70 blur-md"
              />
              {/* Two staggered shockwave rings */}
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 1.6 * mult, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -inset-6 rounded-full border-4 border-amber-300"
                style={{ boxShadow: '0 0 30px rgba(252,211,77,0.8)' }}
              />
              <motion.div
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 2.1 * mult, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
                className="absolute -inset-6 rounded-full border-2 border-orange-200"
              />
              {/* Radiating sparks */}
              {Array.from({ length: big ? 16 : 10 }).map((_, i) => {
                const n = big ? 16 : 10;
                const angle = (i / n) * Math.PI * 2;
                const dist = 38 * mult;
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-amber-300"
                    style={{ boxShadow: '0 0 8px rgba(252,211,77,0.9)' }}
                  />
                );
              })}
              {/* Real dust kicked up off the field — dry, matte earth-tone specks that
                  arc up and then actually fall back down as they fade, not glowing motes
                  that just float outward (see dustTones above). */}
              {Array.from({ length: dustCount }).map((_, i) => {
                const angle = (i / dustCount) * Math.PI * 2 + (i % 2) * 0.25;
                const outDist = (22 + (i % 5) * 9) * mult;
                const peakLift = (14 + (i % 4) * 7) * mult;
                const size = 2 + (i % 3) * 1.5;
                const tone = dustTones[i % dustTones.length];
                return (
                  <motion.div
                    key={`dust-${i}`}
                    initial={{ x: 0, y: 2, opacity: 0.9, scale: 0.7 }}
                    animate={{
                      // Kicked outward and up first (the "puff"), then gravity wins and it
                      // drifts back down while fading — a real arc, not a straight float.
                      x: [0, Math.cos(angle) * outDist * 0.6, Math.cos(angle) * outDist],
                      y: [2, -peakLift, Math.sin(angle) * outDist * 0.2 + peakLift * 0.5],
                      opacity: [0.9, 0.8, 0],
                      scale: [0.7, 1, 0.8],
                    }}
                    transition={{ duration: 0.55 + (i % 3) * 0.15, ease: "easeOut", delay: 0.015 * i }}
                    className="absolute top-1/2 left-1/2 rounded-full"
                    style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, backgroundColor: tone }}
                  />
                );
              })}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Attack Targeting Lines — see renderTravelingArrow above. Candidate targets
          (attackLines, the player's own selection) only draw an arrow toward
          slots that are ACTUALLY reachable this turn — an occupied-but-blocked
          slot already reads as invalid via its own halo (isInvalidAttackTarget),
          so a line pointing at something the player can't pick would just be
          noise. The ONE attack actually happening right now (activeAttackLine,
          either direction) gets its own line so the opponent attacking the player
          shows the same "what's hitting what" indicator the player's own attacks
          do. Drawn in real viewport coordinates (not board-local ones) since the
          board itself is 3D-tilted. */}
      {activeHalos.length > 0 && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {activeHalos.map(h => (
            <img
              key={h.key}
              src={h.image}
              alt=""
              style={{
                position: 'fixed', left: h.x, top: h.y,
                width: h.w * h.scale, height: h.h * h.scale,
                transform: 'translate(-50%, -50%)',
                objectFit: 'contain', filter: h.glow,
              }}
            />
          ))}
        </div>
      )}
      {/* "You may activate this" prompts — see abilityReadyPrompts above for why
          these moved out of each CardSlot and into this same top-level fixed layer. */}
      {abilityReadyPrompts.length > 0 && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {abilityReadyPrompts.map(p => (
            <motion.button
              key={p.key}
              onClick={(e) => { e.stopPropagation(); p.onClick(); }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-auto"
              style={{
                position: 'fixed', left: p.x, top: p.y,
                width: p.w * 1.12, height: p.h * 1.12,
                marginLeft: -(p.w * 1.12) / 2, marginTop: -(p.h * 1.12) / 2,
                backgroundImage: `url(${abilityReadyBorderImage})`,
                backgroundSize: '100% 100%',
                filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.8))',
              }}
            />
          ))}
        </div>
      )}
      {(attackLines.some(line => line.valid) || activeAttackLine) && (
        <svg className="fixed inset-0 z-40 pointer-events-none" width="100%" height="100%">
          {attackLines.filter(line => line.valid).map((line, idx) => renderTravelingArrow(
            idx, line.x1, line.y1, line.x2, line.y2,
            attackArrowRedImage, -90, 32, 160,
            '#ef4444', 1.1
          ))}
          {activeAttackLine && renderTravelingArrow(
            'active', activeAttackLine.x1, activeAttackLine.y1, activeAttackLine.x2, activeAttackLine.y2,
            activeAttackLine.isPlayerAttacking ? attackArrowRedImage : attackArrowBlueImage,
            activeAttackLine.isPlayerAttacking ? -90 : 90,
            activeAttackLine.isPlayerAttacking ? 32 : 25, 160,
            activeAttackLine.isPlayerAttacking ? '#ef4444' : '#3b82f6', 0.9
          )}
        </svg>
      )}

      {/* Toast Notification — same dark-crimson/gold-border/Crimson-Pro treatment as
          the phase announcement banner below, instead of a generic bright-red pill
          in a plain sans font that read as a browser alert rather than part of the
          game's own UI. */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.92 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] max-w-[90vw] px-6 py-3 rounded-xl border-2 border-amber-400/90 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #450a0a, #5a0e0e, #450a0a)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.7), 0 0 20px rgba(251,191,36,0.25)',
            }}
          >
            <span
              className="block text-center text-sm md:text-base font-bold"
              style={{
                fontFamily: "'Crimson Pro', serif",
                color: '#f5deb3',
                WebkitTextStroke: '0.4px rgba(60,10,10,0.6)',
                textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 14px rgba(251,191,36,0.4)',
              }}
            >
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Play Announcement — a bigger, clearer preview of whichever card the
          opponent just played, since the actual board slot is small on a phone and
          easy to miss what landed there. Tucked in the corner (the top-right HUD spot
          freed up when the old turn indicator moved onto the board) rather than dead
          center so it doesn't block the board while it's showing. */}
      <AnimatePresence>
        {announcedCard && (
          <motion.div
            key={announcedCard.card.id}
            initial={{ opacity: 0, scale: 0.6, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed top-20 right-3 md:top-24 md:right-6 z-[200] pointer-events-none flex flex-col items-end gap-1.5"
          >
            <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md ${
              announcedCard.side === 'npc' ? 'bg-red-900/90 text-red-200 border border-red-500' : 'bg-blue-900/90 text-blue-200 border border-blue-400'
            }`}>
              {announcedCard.side === 'npc' ? 'Adversário jogou' : 'Você jogou'}
            </span>
            {/* CARD_THICKNESS_SHADOW (drop-shadow, not box-shadow: the card frame's
                outline isn't a rectangle — wings and spires stick out past it). */}
            <div className="relative w-28 h-36 md:w-36 md:h-48" style={{ filter: CARD_THICKNESS_SHADOW }}>
              <CardFace card={announcedCard.card} variant="popup" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install-as-app prompt */}
      <AnimatePresence>
        {installPromptKind && (
          <InstallPrompt
            kind={installPromptKind}
            onInstall={handleInstallClick}
            onDismiss={() => setInstallPromptKind(null)}
          />
        )}
      </AnimatePresence>

      {/* Game Over Overlay — the General has fallen */}
      <AnimatePresence>
        {gameOverWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-black/90 pointer-events-auto"
          >
            <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-widest drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] ${gameOverWinner === 'player' ? 'text-emerald-400' : 'text-red-500'}`}>
              {gameOverWinner === 'player' ? 'Vitória!' : 'Derrota!'}
            </h1>
            <p className="text-zinc-300 text-sm md:text-base text-center max-w-xs">
              {gameOverWinner === 'player' ? 'O General inimigo caiu em batalha.' : 'Seu General caiu em batalha.'}
            </p>
            <button
              onClick={() => setGameMode(null)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-colors"
            >
              Voltar ao Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Picker — the reveal/search Táticas (Retorno do Soldado, Graal da
          Dádiva, Doutrina Renovada, Recrutamento Seletivo, Recrutar Veteranos, Chamado às Armas) all
          resolve through this: a set of real candidate cards the game found (in the
          graveyard, the deck's pool, or the actual top of the deck), tap one to pick
          it. Multi-pick cases (maxPicks > 1) toggle a selection and need an explicit
          confirm instead of resolving on the first tap. A 3-column grid (was a single
          horizontally-scrolling row the player had to drag through one card at a time,
          each one only partly visible at the screen's own edge) per the user's explicit
          ask — every card in a row renders at its full size, nothing cropped, and the
          grid just wraps into as many rows as there are options; overflow-y-auto/
          max-h scrolls (or "pages", same gesture) through more than fit on screen at
          once instead of the old horizontal drag. */}
      <AnimatePresence>
        {cardPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex flex-col items-center justify-center gap-4 p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
          >
            <p className="text-center text-amber-400 font-black uppercase tracking-wide text-sm max-w-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {cardPicker.title}
            </p>
            <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[65vh] w-full max-w-md px-2 py-2 content-start">
              {cardPicker.options.map(opt => {
                const isSelected = cardPicker.selected.some(c => c.id === opt.id);
                return (
                  <motion.div
                    key={opt.id}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                    onClick={() => {
                      if (cardPicker.maxPicks === 1) {
                        cardPicker.onConfirm([opt]);
                      } else {
                        toggleCardPickerSelection(opt);
                      }
                    }}
                  >
                    <div
                      className={`relative w-full aspect-[2/3] rounded-xl ${isSelected ? 'ring-4 ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.7)]' : ''}`}
                      style={{ filter: CARD_THICKNESS_SHADOW }}
                    >
                      <CardFace card={opt} variant="hand" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {cardPicker.maxPicks > 1 && (
              <button
                onClick={() => cardPicker.onConfirm(cardPicker.selected)}
                disabled={cardPicker.selected.length === 0}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.7)] border-2 border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
              >
                Confirmar ({cardPicker.selected.length}/{cardPicker.maxPicks})
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graveyard Browser — tapping either GraveyardPile (see its own onClick prop,
          wired at each side's usage) opens this: every card currently in that side's
          pile, not just the top one the pile itself shows. Both piles are public
          information, same as most card games, so the opponent's own graveyard is
          just as browsable as the player's. Same 3-column grid as the card picker
          above, but read-only — a tap does nothing (no selection/confirm state to
          drive), just a backdrop tap or the close button dismisses it. Most recently
          buried card shown first (reversed — the pile itself is a stack, last in is
          effectively "on top"). */}
      <AnimatePresence>
        {viewingGraveyard && (() => {
          const graveyardCards = viewingGraveyard === 'player' ? playerGraveyard : npcGraveyard;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[220] flex flex-col items-center justify-center gap-4 p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
              onClick={() => setViewingGraveyard(null)}
            >
              <p className="text-center text-amber-400 font-black uppercase tracking-wide text-sm max-w-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Cemitério {viewingGraveyard === 'player' ? 'do Jogador' : 'do Adversário'} ({graveyardCards.length})
              </p>
              {graveyardCards.length === 0 ? (
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Vazio</p>
              ) : (
                <div
                  className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[65vh] w-full max-w-md px-2 py-2 content-start"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[...graveyardCards].reverse().map(c => (
                    <div key={c.id} className="relative w-full aspect-[2/3] rounded-xl" style={{ filter: CARD_THICKNESS_SHADOW }}>
                      <CardFace card={c} variant="hand" />
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setViewingGraveyard(null)}
                className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-lg border-2 border-zinc-500"
              >
                Fechar
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Floating combat/gold numbers (see spawnFloatingNumber/spawnFloatingNumberAtId) —
          Hearthstone-style: pop in, drift up, fade out, over whatever card or gold
          badge they're reporting a change for. z-[290], above the board and its
          highlight rings but below the board/hand card previews (z-[260]) and the
          full-screen modals above those, so a preview opened right as a number
          spawns still reads on top of it. */}
      <div className="fixed inset-0 z-[290] pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floatingNumbers.map(fn => (
            <motion.div
              key={fn.id}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: -64, scale: [0.5, 1.25, 1, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, times: [0, 0.18, 0.75, 1], ease: 'easeOut' }}
              className="absolute font-black select-none"
              style={{
                left: fn.x,
                top: fn.y,
                transform: 'translate(-50%, -50%)',
                fontFamily: "'Cinzel', serif",
                fontSize: fn.kind === 'damage' ? '30px' : '24px',
                color: fn.kind === 'damage' ? '#ff5555' : fn.kind === 'heal' ? '#4ade80' : fn.kind === 'gold-gain' ? '#fde047' : '#fca5a5',
                WebkitTextStroke: '1.5px rgba(20,10,0,0.75)',
                textShadow: `0 2px 3px rgba(0,0,0,0.9), 0 0 14px ${
                  fn.kind === 'damage' ? 'rgba(255,60,60,0.85)' : fn.kind === 'heal' ? 'rgba(74,222,128,0.85)' : fn.kind === 'gold-gain' ? 'rgba(253,224,71,0.85)' : 'rgba(252,165,165,0.75)'
                }`,
              }}
            >
              {fn.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Center-screen phase announcement — Yu-Gi-Oh-style: a full-width crimson
          ribbon with the phase name on it rushes in from the right, holds just long
          enough to read, then keeps going and rushes out to the left (see
          announcePhase/phaseBanner above, and PHASE_BANNER_DURATION_MS/
          phaseTransitionLock for how long the game actually waits on it). Sits above
          the floating numbers (z-290) but below the board/hand card previews and
          full modals, same reasoning as that overlay. */}
      <div className="fixed inset-0 z-[292] pointer-events-none flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          {phaseBanner && (
            <motion.div
              key={phaseBanner.id}
              initial={{ opacity: 0, x: 420, y: PHASE_BANNER_Y }}
              animate={PHASE_BANNER_MOTION[phaseBanner.stage].animate}
              exit={{ opacity: 0, y: PHASE_BANNER_Y }}
              transition={PHASE_BANNER_MOTION[phaseBanner.stage].transition}
              className="relative flex flex-col items-center select-none py-2"
            >
              {/* The ribbon itself — bled to the full viewport width (not just this
                  block's own content width) via w-screen + centering, so it reads as
                  a banner stretched across the whole table, not a text-sized box. */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-14 md:h-[4.5rem] bg-gradient-to-b from-red-950 via-[#5a0e0e] to-red-950 border-y-2 border-amber-400/90 shadow-[0_4px_18px_rgba(0,0,0,0.7)]" />
              {/* Cinzel (still used elsewhere for card titles) reads great as a
                  logo-style word but is a titling face — thin strokes, tall narrow
                  letterforms — which got actively worse to read fast at this size
                  once a stroke outline and wide tracking were stacked on top of it,
                  exactly the "improve the font" complaint. Crimson Pro is the other
                  self-hosted serif already bundled for this game (see fonts.css) and
                  is a text face built for legibility rather than a display one, so
                  it's swapped in here instead — tracking and the outline stroke both
                  pulled back too, since those were compounding the problem as much
                  as the typeface itself was. */}
              <div
                className="relative text-2xl md:text-4xl font-black uppercase tracking-[0.02em] text-center whitespace-nowrap px-8"
                style={{
                  fontFamily: "'Crimson Pro', serif",
                  color: '#f5deb3',
                  WebkitTextStroke: '0.5px rgba(60,10,10,0.6)',
                  textShadow: '0 3px 6px rgba(0,0,0,0.9), 0 0 22px rgba(251,191,36,0.5)',
                }}
              >
                {phaseBanner.title}
              </div>
              <div className="relative mt-1 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-amber-100/90 text-center whitespace-nowrap px-8" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}>
                {phaseBanner.subtitle}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Board card preview — tapping any card already on the board (see CardSlot's
          root onClick) shows this: the same fixed, always-on-top, non-blocking
          enlarged copy the hand's own tap-preview uses (see BOARD_PREVIEW_SCALE
          below), NOT the old full-screen backdrop modal. That modal used to be the
          only way to read a board card, opened by a dedicated "i" button — since a
          plain tap now ALSO still does whatever it always did (select an attacker,
          pick a mover, resolve a Tática target, …), a screen-blocking backdrop here
          would swallow the very next tap needed to continue that action. This has
          no backdrop and pointer-events-none on everything but its own close
          button, so it never intercepts a click meant for the board underneath,
          and it auto-dismisses on its own after a couple seconds instead of
          requiring an explicit close every time. */}
      <AnimatePresence>
        {detailedCard && (() => {
          const w = HAND_CARD_WIDTH * BOARD_PREVIEW_SCALE;
          const h = HAND_CARD_HEIGHT * BOARD_PREVIEW_SCALE;
          return (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[260] pointer-events-none"
            // Plain pixel left/top instead of left:50%+transform:translate(-50%): once
            // this element also animates `scale` through Framer Motion, Motion takes
            // full ownership of the `transform` CSS property and overwrites any
            // manually-set transform value entirely — a translate(-50%,-50%) written
            // here would just get silently discarded (this was the actual cause of a
            // stray build's board-preview landing way off-center).
            style={{
              left: windowSize.width / 2 - w / 2, top: windowSize.height * PREVIEW_Y_FRACTION - h / 2,
              width: w, height: h,
            }}
          >
            <div className="relative w-full h-full rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(212,175,55,0.45)]" style={{ filter: CARD_THICKNESS_SHADOW }}>
              <CardFace card={detailedCard} variant="hand" />
            </div>
            <button
              onClick={() => setDetailedCard(null)}
              className="absolute -top-3 -left-3 w-8 h-8 bg-red-600 rounded-full border-2 border-red-900 flex items-center justify-center shadow-lg z-30 hover:bg-red-500 transition-colors pointer-events-auto"
            >
              <X className="text-white w-5 h-5" />
            </button>
          </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* "Ativar habilidade?" — the General's own Fase-Principal effect, offered
          Yu-Gi-Oh-style: the card floats up in the exact same tucked-aside "selected
          card" spot a hand card gets when picked to be played (see getSelectedCardX/Y
          and the hand render above), with a plain ativar/não first — only once the
          player says yes does the card's own cost choice (grátis vs. pago) show up,
          instead of dumping both decisions on the player in one screen. */}
      <AnimatePresence>
        {generalAbilityPrompt && playerSlots[12] && (
          <div
            className="fixed z-[210] left-2 md:left-6 pointer-events-none"
            style={{ top: '45%', transform: 'translateY(-50%)' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              style={{ transformOrigin: 'center left', filter: CARD_THICKNESS_SHADOW }}
              className="relative w-56 h-80 pointer-events-auto"
            >
              <CardFace card={playerSlots[12]!} variant="hand" />
              <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(212,175,55,0.6)] rounded-xl border-2 border-[#d4af37] pointer-events-none" />

              {!generalAbilityPrompt.confirmed ? (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-40 flex gap-2 whitespace-nowrap">
                  <button
                    onClick={() => setGeneralAbilityPrompt(prev => prev ? { ...prev, confirmed: true } : prev)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.7)] border-2 border-emerald-400"
                  >
                    Ativar
                  </button>
                  <button
                    onClick={() => setGeneralAbilityPrompt(null)}
                    className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-2 border-zinc-500"
                  >
                    Não ativar
                  </button>
                </div>
              ) : (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-1.5 items-center whitespace-nowrap">
                  <button
                    onClick={() => activateGeneralHeal(1, 0)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-[11px] uppercase tracking-wider shadow-[0_4px_16px_rgba(16,185,129,0.7)] border-2 border-emerald-400"
                  >
                    Curar 1 HP (grátis)
                  </button>
                  <button
                    onClick={() => activateGeneralHeal(3, 1)}
                    disabled={playerMana < 1}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-full text-white font-black text-[11px] uppercase tracking-wider shadow-[0_4px_16px_rgba(16,185,129,0.7)] border-2 border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                  >
                    Pagar 1 ouro: curar 3 HP
                  </button>
                  <button
                    onClick={() => setGeneralAbilityPrompt(null)}
                    className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-black text-[11px] uppercase tracking-wider shadow-[0_4px_16px_rgba(0,0,0,0.6)] border-2 border-zinc-500"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const CardSlot = ({
  onClick, onInfoClick, card, isSelected = false,
  isAttacking = false, isImpactingTarget = false, isImpactingAttacker = false, attackDirection = 'up', hint, rowRoleHint,
  isValidAttackTarget = false, isInvalidAttackTarget = false, slotId,
  isMoverSelected = false, isValidMoveTarget = false, hasMoved = false,
  shockActive = false, isTacticDragTarget = false,
}: {
  onClick?: (el: HTMLElement) => void, onInfoClick?: (card: CardData) => void, card?: CardData | null,
  isSelected?: boolean, isAttacking?: boolean, isImpactingTarget?: boolean, attackDirection?: 'up' | 'down',
  // True for the attacker's own card during the exact same impact window
  // isImpactingTarget uses on the defender — Hearthstone-style, both sides in a
  // collision rattle, not just whoever's taking the hit. See isImpacting/attackAnim.
  isImpactingAttacker?: boolean,
  hint?: SlotHint, key?: React.Key,
  // Annotates a 'valid' empty-slot hint with what this row actually lets the
  // selected unit DO once placed — 'combat' (Vanguarda) or 'support' (Retaguarda) —
  // see getRowRoleHint. Only ever set alongside hint === 'valid'; undefined means
  // "no distinction for this card type," not "Retaguarda."
  rowRoleHint?: 'combat' | 'support',
  // True for every occupied slot a selected targetable Tática could legally land
  // on (see getCardDropKind/isTacticTargetSlot) — an equip/buff aimed at your own
  // board, or a damage Tática aimed at the enemy's. The empty-slot 'place' case
  // already has its own hint prop.
  isTacticDragTarget?: boolean,
  // Shown on the opponent's slots while the player has an attacker selected: a green
  // glow on anything actually reachable this turn (see getValidAttackTargets), a
  // dimmed/grayed look on an occupied slot that's blocked or out of the attacker's
  // lane — so the lane-blocking rule reads as a visible board state, not a rejected
  // click the player has to guess at.
  isValidAttackTarget?: boolean, isInvalidAttackTarget?: boolean,
  // A stable DOM id (e.g. "player-3", "npc-12") so the targeting-line overlay can find
  // this exact slot's on-screen position via getBoundingClientRect, without needing a
  // forwarded ref on every one of the 26 slots on the board.
  slotId?: string,
  // Preparação-phase equivalents of isSelected/isValidAttackTarget/(already acted) —
  // a unit picked up to move, the adjacent slots it can move/swap into, and a unit
  // that already used its reposition this turn (dimmed, still clickable to inspect).
  isMoverSelected?: boolean, isValidMoveTarget?: boolean, hasMoved?: boolean,
  // True for one brief pulse whenever a full-art card lands anywhere on the board (see
  // CardData.isFullArt / triggerFullArtReaction) — every occupied slot flinches at once.
  shockActive?: boolean,
}) => {
  const attackY = attackDirection === 'up' ? -150 : 150;

  // Damage feedback — a brief shake plus a floating "-N" whenever this exact card
  // (same id) loses HP between renders, whatever the source: normal attack combat,
  // an AOE Tática (Trabuco/Catapulta/Balestra), a splash effect, anything. Purely
  // reactive to the HP value itself instead of threading a new prop through every
  // one of the many call sites that can reduce a card's HP, so it catches all of
  // them uniformly. Only fires on a decrease (never on a heal), and only compares
  // against the SAME card id — a different card landing in this slot (or this
  // card moving to a different slot) just re-baselines instead of reading as damage.
  const prevHpRef = useRef<number | undefined>(card?.hp);
  const prevCardIdRef = useRef<string | undefined>(card?.id);
  const [damageFlash, setDamageFlash] = useState<{ key: number; amount: number } | null>(null);
  // Physical "landing weight" — a brief non-uniform squash (see scaleY below) the
  // instant a genuinely NEW card occupies this slot, on top of the existing scale-in.
  // Keyed off the same id-change check as the damage flash below (a card moving
  // within/into this slot, not just its hp changing), but reads prevCardIdRef
  // BEFORE that effect updates it, so this has to run first.
  const [justLanded, setJustLanded] = useState(false);
  useEffect(() => {
    if (card && prevCardIdRef.current !== card.id) {
      setJustLanded(true);
      const t = window.setTimeout(() => setJustLanded(false), 380);
      return () => clearTimeout(t);
    }
  }, [card?.id]);
  useEffect(() => {
    if (card && prevCardIdRef.current === card.id && prevHpRef.current !== undefined && card.hp < prevHpRef.current) {
      setDamageFlash({ key: Date.now(), amount: prevHpRef.current - card.hp });
    }
    prevCardIdRef.current = card?.id;
    prevHpRef.current = card?.hp;
  }, [card?.id, card?.hp]);
  useEffect(() => {
    if (!damageFlash) return;
    const t = window.setTimeout(() => setDamageFlash(null), 900);
    return () => clearTimeout(t);
  }, [damageFlash]);

  // A valid placement slot's whole border/glow now carries the combat/support
  // color (amber/sky — same as the corner badge below) instead of a uniform
  // green, whenever that distinction actually applies (rowRoleHint set) — reading
  // it off the WHOLE slot instead of a small corner icon is what the player asked
  // for: "isso tem que ficar claro no tabuleiro," not just technically present.
  const hintClass = hint === 'invalid'
    ? 'border-red-500/60 bg-red-950/30'
    : hint === 'valid'
      ? rowRoleHint === 'combat'
        ? 'border-amber-400/80 bg-amber-500/15 shadow-[0_0_28px_rgba(245,158,11,0.6)]'
        : rowRoleHint === 'support'
          ? 'border-sky-400/80 bg-sky-500/15 shadow-[0_0_28px_rgba(14,165,233,0.6)]'
          : 'border-emerald-400/70 bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.5)]'
      : '';

  return (
    <motion.div
      id={slotId}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e.currentTarget as HTMLElement);
        }
        // Tapping a card anywhere on the board now shows the same enlarged, readable
        // preview a hand-card tap does (see the fixed overlay in App) — no more
        // separate "i" button to hit exactly. Fires alongside whatever onClick above
        // already does (select an attacker, pick a mover, resolve a Tática target,
        // …) rather than instead of it, so none of that existing board logic changes.
        if (card && !card.isDestroyed && onInfoClick) onInfoClick(card);
      }}
      className={`w-[7.5rem] h-[9.5rem] md:w-[9.5rem] md:h-[12.5rem] rounded-lg bg-transparent flex items-center justify-center transition-colors group relative ${card && !card.isDestroyed ? '' : 'border-[3px] border-[#e8dcc0]/35 hover:border-[#e8dcc0]/70 hover:bg-[#e8dcc0]/10 hover:shadow-[0_0_25px_rgba(232,220,192,0.45)]'} ${onClick ? 'cursor-pointer pointer-events-auto' : ''} ${hintClass} ${isInvalidAttackTarget ? 'opacity-40 saturate-50' : ''} ${isMoverSelected ? 'ring-4 ring-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.7)]' : ''} ${isValidMoveTarget ? 'ring-4 ring-sky-300/80 shadow-[0_0_22px_rgba(125,211,252,0.6)]' : ''} ${hasMoved && card ? 'opacity-60 saturate-[.6]' : ''} ${isTacticDragTarget ? 'ring-4 ring-fuchsia-400 shadow-[0_0_30px_rgba(232,121,249,0.75)]' : ''}`}
    >
      {!card && hint && (
        // Placement drop indicator on every legal empty slot at once while a hand
        // card is tap-selected (see getPlayerSlotHint) — a bouncing green arrow if
        // it can land here, a red X if it can't (wrong slot type, e.g. Relíquia/
        // Terreno's own special slots). Vanguarda and Retaguarda show the exact
        // same green arrow — placement itself doesn't care which row a creature
        // ends up in (see getSlotHint); the small corner badge just below is what
        // actually tells the two rows apart, and only for the one unit type whose
        // COMBAT eligibility (not placement) really does differ by row.
        <>
          {hint === 'invalid' ? (
            <X className="w-8 h-8 md:w-10 md:h-10 text-red-500/80 pointer-events-none" strokeWidth={3} />
          ) : (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none"
            >
              <ArrowUp
                className={`w-8 h-8 md:w-10 md:h-10 pointer-events-none ${
                  rowRoleHint === 'combat'
                    ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]'
                    : rowRoleHint === 'support'
                      ? 'text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.9)]'
                      : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                }`}
                strokeWidth={3}
              />
            </motion.div>
          )}
          {hint === 'valid' && rowRoleHint && (
            // Bigger than the first pass at this (see git history) — a corner icon
            // that small read as decoration, not information, and easy to miss on a
            // real phone screen. Sized to actually be read at a glance, same idea as
            // an ATK/HP badge, not a subtle hint.
            <img
              src={rowRoleHint === 'combat' ? badgeSwordImage : badgeShieldImage}
              alt={rowRoleHint === 'combat' ? 'Pode atacar a partir daqui' : 'Não pode atacar a partir daqui'}
              title={rowRoleHint === 'combat' ? 'Pode atacar a partir daqui' : 'Não pode atacar a partir daqui'}
              className={`absolute top-1 right-1 md:top-1.5 md:right-1.5 w-8 h-8 md:w-10 md:h-10 object-contain pointer-events-none ${
                rowRoleHint === 'combat' ? 'drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]' : 'drop-shadow-[0_0_10px_rgba(14,165,233,0.9)]'
              }`}
            />
          )}
        </>
      )}
      {!card && !hint && (
        <>
          <div className="w-[70%] h-[70%] border border-[#e8dcc0]/20 rotate-45 group-hover:border-[#e8dcc0]/50 group-hover:scale-110 transition-all pointer-events-none" />
          <div className="absolute inset-0 bg-[#e8dcc0]/0 group-hover:bg-[#e8dcc0]/15 transition-colors rounded-lg pointer-events-none" />
        </>
      )}
      {/* Attack targeting indicators — while the player has an attacker selected, a
          bouncing green arrow points down at every enemy slot it can actually reach
          (see getValidAttackTargets), and a red X marks an occupied enemy slot that's
          blocked or out of range (on top of the dimmed/grayed-out card itself), so the
          lane-blocking rule reads as something the player can SEE, not just a click
          that silently fails. */}
      {isValidAttackTarget && (
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-7 md:-top-9 left-1/2 -translate-x-1/2 pointer-events-none z-30"
        >
          <ArrowDown className="w-7 h-7 md:w-9 md:h-9 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,1)]" strokeWidth={3.5} />
        </motion.div>
      )}
      {/* Drag-to-play's own "drop it here" cue for a targetable Tática — a bouncing
          fuchsia arrow instead of the attack system's green/red so it never reads
          as an attack prompt. Direction always points down at the card, regardless
          of which side of the board this slot is on. */}
      {isTacticDragTarget && (
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-7 md:-top-9 left-1/2 -translate-x-1/2 pointer-events-none z-30"
        >
          <ArrowDown className="w-7 h-7 md:w-9 md:h-9 text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,1)]" strokeWidth={3.5} />
        </motion.div>
      )}
      {card && !card.isDestroyed && (
        <motion.div
          key={card.id}
          // A card arriving in a slot (a General at match start, an AI or opponent
          // play) should visibly appear, not just pop into existence — a quick
          // scale/drop-in with a touch of overshoot reads as it "landing" here.
          // Opponent cards used to render rotated 180° (as if laid out facing them,
          // across the table) — per the user's explicit ask, EVERY card on the board
          // now reads upright from the player's own side, opponent's included, since
          // being able to actually read the enemy's ATK/HP/effect text at a glance
          // matters more than the "laid out facing them" physical-table conceit.
          initial={{ opacity: 0, scale: 0.4, y: -24 }}
          animate={{
            opacity: 1,
            // Hearthstone-style wind-up: the attacker pulls back a little FIRST
            // (opposite direction, small distance) before rushing the rest of the
            // way to the target — reads as the card gathering momentum instead of
            // just teleporting to its lunge position. A full-art card landing
            // elsewhere on the board makes this one flinch (see shockActive).
            y: isAttacking
              ? [0, attackY > 0 ? -22 : 22, attackY]
              : (shockActive ? [0, -14, 2, 0] : 0),
            // Collision tremor — BOTH the attacker and the defender rattle the
            // instant the hit actually lands (isImpactingAttacker/isImpactingTarget,
            // both tied to the same isImpacting window), not just whichever card
            // ends up taking damage; separately, damageFlash below still adds its
            // own rattle once HP actually drops, so a real hit reads as two beats —
            // the impact itself, then the wound.
            x: damageFlash
              ? [0, -7, 7, -5, 5, -2, 0]
              : (isImpactingAttacker || isImpactingTarget) ? [0, -6, 6, -4, 4, 0] : 0,
            z: isAttacking ? 100 : 0,
            // A quick "punch" scale-up on the attacker right as it connects, and a
            // matching flinch (brief shrink) on whatever it's hitting — the same
            // push/give pairing a real collision has.
            scale: isImpactingAttacker ? 1.32 : isAttacking ? 1.2 : isImpactingTarget ? 0.9 : 1,
            // Physical landing weight (see justLanded above) — a squash-and-settle
            // on just the vertical axis, like the card actually has mass hitting the
            // table, instead of the plain uniform scale-in every card used to get.
            // Left undefined the rest of the time so it just follows `scale` above.
            scaleY: justLanded ? [0.55, 1.18, 0.92, 1.03, 1] : undefined,
            rotateX: isAttacking ? (attackDirection === 'up' ? 20 : -20) : 0,
          }}
          transition={{
            duration: isAttacking ? 0.3 : 0.2,
            times: isAttacking ? [0, 0.4, 1] : undefined,
            scale: { type: "spring", stiffness: 400, damping: 15 },
            scaleY: justLanded ? { duration: 0.38, ease: "easeOut", times: [0, 0.35, 0.6, 0.85, 1] } : undefined,
            y: shockActive ? { duration: 0.4, ease: "easeOut" } : undefined,
            x: damageFlash
              ? { duration: 0.45, ease: "easeOut" }
              : (isImpactingAttacker || isImpactingTarget) ? { duration: 0.25, ease: "easeOut" } : undefined,
          }}
          // CARD_THICKNESS_SHADOW (see its own comment) — a resting card reads as a
          // stack of real cardstock, not a flat sheet of paper.
          style={{ filter: CARD_THICKNESS_SHADOW }}
          className="w-full h-full rounded-lg flex flex-col p-1 relative"
          // Lets the attack-targeting-line overlay (see attackLines/activeAttackLine
          // in App) anchor to wherever this card ACTUALLY is on screen right now —
          // this is the element that physically lunges via the y/z/scale animate
          // above, while the slot's own outer div (slotId) stays put. Anchoring the
          // line to the outer div instead left the arrow starting from the card's
          // empty home slot mid-lunge, visibly detached from the card itself.
          data-card-visual={slotId}
        >
          {isImpactingTarget && <SlashEffect />}

          {/* Floating damage number — see damageFlash above. Rises and fades over
              the same window as the shake it plays alongside, so both read as one
              single "hit" beat instead of two separate, uncoordinated effects. */}
          {damageFlash && (
            <motion.div
              key={damageFlash.key}
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], y: -36, scale: 1.15 }}
              transition={{ duration: 0.9, ease: 'easeOut', opacity: { times: [0, 0.15, 0.7, 1] } }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
            >
              <span
                className="font-black text-lg md:text-2xl text-red-500"
                style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 3px rgba(0,0,0,0.9), 0 0 10px rgba(239,68,68,0.6)' }}
              >
                -{damageFlash.amount}
              </span>
            </motion.div>
          )}

          {/* Equipped Armamentos — the one Tática exception that doesn't discard to
              the graveyard on use (see equippedWeapons/withEquippedWeapons): instead
              it stays attached, peeking out from behind this card like a real stacked
              equip card, until this unit dies (equippedWeapons rides along with it to
              the graveyard then). Rendered before the CardFace below so it sits
              underneath in paint order, each one offset a little further out. */}
          {card.equippedWeapons?.map((weapon, wi) => (
            <div
              key={weapon.id}
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{ transform: `translate(${9 + wi * 6}px, ${9 + wi * 6}px) scale(0.9)`, filter: CARD_THICKNESS_SHADOW }}
            >
              <CardFace card={weapon} variant="field" />
            </div>
          ))}

          {/* No more Info button here — tapping the card itself (see the root
              onClick above) now shows the same enlarged preview this used to open
              on its own. */}
          {card.isFullArt ? <CardFaceFullArtMini card={card} /> : <CardFaceStandardMini card={card} />}
        </motion.div>
      )}
      {card && card.isDestroyed && (
        <>
          <motion.div
            initial={{ scale: 1, opacity: 1, rotateZ: 0 }}
            animate={{ 
              scale: [1, 1.1, 0.8, 0], 
              opacity: [1, 1, 0.5, 0], 
              rotateZ: [0, -5, 5, -10, 10, 0],
              filter: ["brightness(1)", "brightness(2)", "brightness(0.5)", "brightness(0)"]
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-40 pointer-events-none"
          >
            <div className="w-full h-full bg-[#c5b599] rounded-lg border-2 border-[#8c7a5f] shadow-lg overflow-hidden grayscale">
               {card.art ? (
                 <img src={card.art} className="w-full h-full object-cover opacity-50" />
               ) : (
                 <div className="w-full h-full bg-zinc-800" />
               )}
            </div>
          </motion.div>
          <ExplosionEffect />
        </>
      )}
    </motion.div>
  );
};

