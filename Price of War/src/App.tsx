import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { fetchProfile, usernameAvailable, createProfile, updateProfileFields, fetchStore, pushStore, type CloudDeck } from './services/cloud';
import { getSession, onSessionChange, signInOAuth, signInEmail, signInGuest, signOut, authErrorText, authErrorDetail, authMode, type Session } from './services/auth';
import { motion, AnimatePresence, useMotionValue, useTransform, animate as motionAnimate, type MotionValue } from 'motion/react';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import { TurnTracker } from './TurnTracker';
// The 3D viewer (and three.js with it) is only downloaded the first time a card is opened in 3D.
const CardViewer3D = lazy(() => import('./CardViewer3D'));
import boardBattlefieldImage from './assets/board-battlefield.webp';
import logoImage from './assets/logo-price-of-war.webp';
import startScreenBgImage from './assets/start-screen-bg.webp';
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
// Main-menu art (see art-prompts/README.md 4e-4m for the briefs). The four menu-card
// backgrounds are 4:1 banners; the ui-* files are cut-outs with real alpha.
import menuCardDesafiosImage from './assets/menu-card-desafios.webp';
import menuCardOnlineImage from './assets/menu-card-online.webp';
import menuCardEditarDeckImage from './assets/menu-card-editar-deck.webp';
import menuCardLojaImage from './assets/menu-card-loja.webp';
import uiFrameMenuCardImage from './assets/ui-frame-menu-card.webp';
import shopShelfImage from './assets/shop-shelf.webp';
import shopCounterImage from './assets/shop-counter.webp';
import shopNpcGreetImage from './assets/shop-npc-greet.webp';
import shopNpcShowImage from './assets/shop-npc-show.webp';
import shopNpcHappyImage from './assets/shop-npc-happy.webp';
import shopNpcSorryImage from './assets/shop-npc-sorry.webp';
import boosterCardealImage from './assets/booster-cardeal.webp';
import coinCaraImage from './assets/coin-cara.webp';
import coinCoroaImage from './assets/coin-coroa.webp';
import uiStatAtkImage from './assets/ui-stat-atk.webp';
import uiStatHpImage from './assets/ui-stat-hp.webp';
import uiLineHImage from './assets/ui-line-h.webp';
import uiLineVImage from './assets/ui-line-v.webp';
import uiIconCardImage from './assets/ui-icon-card.webp';
import uiEditorHeaderImage from './assets/ui-editor-header.webp';
import uiEditorTabOnImage from './assets/ui-editor-tab-on.webp';
import uiEditorTabOffImage from './assets/ui-editor-tab-off.webp';
import uiWindowFrameImage from './assets/ui-window-frame.webp';
import uiWindowTextureImage from './assets/ui-window-texture.webp';
import uiPillCoroasImage from './assets/ui-pill-coroas.webp';
import uiProfilePlateImage from './assets/ui-profile-plate.webp';
import uiIconButtonImage from './assets/ui-icon-button.webp';
import uiIconConfigImage from './assets/ui-icon-config.webp';
import uiIconTutoriaisImage from './assets/ui-icon-tutoriais.webp';
import uiIconRankingImage from './assets/ui-icon-ranking.webp';
import uiIconSomImage from './assets/ui-icon-som.webp';
import uiIconCoroaImage from './assets/ui-icon-coroa.webp';
import uiIconDesafiosImage from './assets/ui-icon-desafios.webp';
import uiIconOnlineImage from './assets/ui-icon-online.webp';
import uiIconEditarDeckImage from './assets/ui-icon-editar-deck.webp';
import uiIconLojaImage from './assets/ui-icon-loja.webp';
import uiIconMaisImage from './assets/ui-icon-mais.webp';
// Player avatars (art-prompts/README.md 4n). Numbered after their prompt: 03 and
// 08+ haven't been generated yet.
import avatar01Image from './assets/avatar-01.webp';
import avatar02Image from './assets/avatar-02.webp';
import avatar04Image from './assets/avatar-04.webp';
import avatar05Image from './assets/avatar-05.webp';
import avatar06Image from './assets/avatar-06.webp';
import avatar07Image from './assets/avatar-07.webp';
// Combat visuals cropped from a single reference sheet the user supplied (a
// collage of style options, not individually-shipped assets — see git history
// for the exact crop coordinates) — one instance chosen per category instead of
// coding a full palette of unused alternatives.
import attackArrowRedImage from './assets/attack-arrow-red.png';
import attackArrowBlueImage from './assets/attack-arrow-blue.png';
import haloValidTargetImage from './assets/halo-valid-target.png';
import haloInvalidTargetImage from './assets/halo-invalid-target.png';
import haloSelectionImage from './assets/halo-selection.png';
import hintSwordImage from './assets/hint-sword.webp';
import hintShieldImage from './assets/hint-shield.webp';
import hintSwordShieldImage from './assets/hint-sword-shield.webp';
import fxAtkUpSheet from './assets/fx-atk-up-sheet.webp';
import fxAtkDownSheet from './assets/fx-atk-down-sheet.webp';
import fxHpUpSheet from './assets/fx-hp-up-sheet.webp';
import fxHpDownSheet from './assets/fx-hp-down-sheet.webp';
import fxReinforceSheet from './assets/fx-reinforce-sheet.webp';
import fxSwapSheet from './assets/fx-swap-sheet.webp';
import fxShieldAppearSheet from './assets/fx-shield-appear-sheet.webp';
import fxShieldLoopSheet from './assets/fx-shield-loop-sheet.webp';
import fxShieldHitSheet from './assets/fx-shield-hit-sheet.webp';
import fxShieldBreakSheet from './assets/fx-shield-break-sheet.webp';
import uiEffectAtkUpStill from './assets/ui-effect-atk-up.webp';
import uiEffectHpUpStill from './assets/ui-effect-hp-up.webp';
import uiIconSword from './assets/ui-icon-sword.webp';
import uiIconHeart from './assets/ui-icon-heart.webp';
import maskGold from './assets/mask-gold.webp';
import maskGoldRim from './assets/mask-gold-rim.webp';
import maskHandGold from './assets/mask-hand-gold.webp';
import maskHandGoldRim from './assets/mask-hand-gold-rim.webp';
import maskSilver from './assets/mask-silver.webp';
import maskSilverRim from './assets/mask-silver-rim.webp';
import maskChampagne from './assets/mask-champagne.webp';
import maskChampagneRim from './assets/mask-champagne-rim.webp';
import maskFullartGold from './assets/mask-fullart-gold.webp';
import maskFullartGoldRim from './assets/mask-fullart-gold-rim.webp';
import maskFullartTatica from './assets/mask-fullart-tatica.webp';
import maskFullartTaticaRim from './assets/mask-fullart-tatica-rim.webp';
import maskFullartEmboscada from './assets/mask-fullart-emboscada.webp';
import maskFullartEmboscadaRim from './assets/mask-fullart-emboscada-rim.webp';
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
// Deck Capitão's own card art (see art-prompts/README.md's "Deck Capitão" section
// for the prompts these came from). Six of these are Full Art prints used in place
// of their Padrão counterpart — same choice Deck Cardeal makes for its own
// Nobre da Cruzada/Cavaleiro da Luz/Comandante da Ordem/Trabuco de
// Cerco/Retorno do Soldado above (both versions exist, Full Art is just the one
// actually wired into CardData below).
import comandanteAurelionFullArt from './assets/card-comandante-aurelion-full.webp';
import estandarteDaLegiaoFullArt from './assets/card-estandarte-da-legiao-full.webp';
import soldadoTaticoArt from './assets/card-soldado-tatico.webp';
import escudeiroDeLinhaArt from './assets/card-escudeiro-de-linha.webp';
import capitaoDeFormacaoFullArt from './assets/card-capitao-de-formacao-full.webp';
import batedorArt from './assets/card-batedor.webp';
import lanceiroDeControleArt from './assets/card-lanceiro-de-controle.webp';
import cavaleiroTaticoFullArt from './assets/card-cavaleiro-tatico-full.webp';
import veteranoDeGuerraFullArt from './assets/card-veterano-de-guerra-full.webp';
import reformarLinhasFullArt from './assets/card-reformar-linhas-full.webp';
import avancoCoordenadoArt from './assets/card-avanco-coordenado.webp';
import reposicionamentoRapidoArt from './assets/card-reposicionamento-rapido.webp';
import linhaFechadaArt from './assets/card-linha-fechada.webp';
import ordemDeRetiradaArt from './assets/card-ordem-de-retirada.webp';
import bloqueioInstantaneoArt from './assets/card-bloqueio-instantaneo.webp';
import contraManobraFullArt from './assets/card-contra-manobra-full.webp';
import formacaoQuebradaArt from './assets/card-formacao-quebrada.webp';
import fortalezaDePedraFullArt from './assets/card-fortaleza-de-pedra-full.webp';
import pantanoMalditoArt from './assets/card-pantano-maldito.webp';
// User-provided artwork for the match-intro "BATALHA!" call-out and the Game Over
// screen's "VITÓRIA!"/"DERROTA" — replaces the plain typeset versions (see
// MatchIntroOverlay and the Game Over Overlay further below).
import bannerBatalhaImage from './assets/banner-batalha.webp';
import bannerVitoriaImage from './assets/banner-vitoria.webp';
import bannerDerrotaImage from './assets/banner-derrota.webp';
import fxPunchSheet from './assets/fx-punch-sheet.webp';
import fxBurnMask from './assets/fx-burn-mask.webp';
import fxBurnFire from './assets/fx-burn-fire.webp';
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
import attackSfxUrl from './assets/sfx-combate-explosao.wav';
import tacticSfxUrl from './assets/sfx-tatica.wav';
import effectSfxUrl from './assets/sfx-efeito-magico.mp3';
import selectSfxUrl from './assets/sfx-selecionar.wav';
// Second round of SFX (see the same play* helpers further below) — same CC0 sourcing
// approach as above, this time from lavenderdotpet/CC0-Public-Domain-Sounds on GitHub
// (itself a mirror of the Kenney UI/impact packs plus a small RPG SFX set), covering
// the gaps the user pointed out: nothing played for a plain UI button, a card lifting
// off to fly, a unit actually taking damage (as opposed to just the attack swing), a
// harder hit specifically when a General is the one hurt, or a card dying.
import uiClickSfxUrl from './assets/sfx-clique-ui.wav';
import cardLiftSfxUrl from './assets/sfx-levantar-carta.wav';
import damageSfxUrl from './assets/sfx-dano.wav';
import generalDamageSfxUrl from './assets/sfx-dano-general.wav';
import destroySfxUrl from './assets/sfx-destruicao-fogo.wav';
// Match-intro VS reveal (see startMatchIntro/MatchIntroOverlay further below) — a
// whoosh for each General's portrait sliding into view, and a metallic stinger for
// the "BATALHA" banner slam.
import revealGeneralSfxUrl from './assets/sfx-reveal-general.wav';
import batalhaBannerSfxUrl from './assets/sfx-batalha-banner.wav';
// A heavy stone-block impact (CC0, github.com/lavenderdotpet/CC0-Public-Domain-Sounds,
// 75-cc0-breaking-falling-hit-sfx/bfh1_rock_falling_01.ogg) — timed to the exact
// moment BATALHA's own fall lands, since a medieval war banner "slamming down like
// something heavy hitting the ground" calls for a stone/masonry thud, not a musical
// stinger.
import batalhaImpactSfxUrl from './assets/sfx-batalha-impacto.wav';
import { DECK_RECIPES, requireCardDef, getCardDef, starterDeckCards, type DeckId } from './engine/catalog';
import { applyAction, combatOpen as engineCombatOpen, activePhases as engineActivePhases, createMatch, deckSetupFromRecipe, newMatchLog, type MatchLog } from './engine/game';
import { aiNextAction } from './engine/ai';
import { glyphUrl, burstUrl, NUMBER_GLOW, type NumberKind } from './numberGlyphs';
import { triggerOf, triggerKeyOf, pulseCard, usePulse, TRIGGER_GLOW, TRIGGER_ICON } from './triggers';
import { playSfx, preloadSfx, dbgMark } from './sfx';
import { sfxLevel, musicLevel, MUSIC_BASE_GAIN, useAudioSettings, setAudioSettings, subscribeAudio } from './audioSettings';
import { useGameSettings, setGameSettings } from './gameSettings';
import tutHandSprite from './assets/tut-hand.webp';
import type { Trigger } from './engine/types';
import { cancelQueue, fetchResult, fetchViews, queueForMatch, queueStatus, sendAction, tickMatch, type ActResult, type MatchInit, type RewardInfo, type ViewRow } from './services/online';
import { xpToNext } from './engine/rewards';
import { STEPS as TUT_STEPS, BEATS as TUT_BEATS, COIN_STEP as TUT_COIN_STEP, OUTRO as TUT_OUTRO, CHAPTERS as TUT_CHAPTERS, createTutorialMatch, nextEnemyAction as tutEnemyAction, type Step as TutStep, type Tgt as TutTgt, type Until as TutUntil } from './tutorial/script';
import { ThinFrame, GameBox, GameButton } from './ui/ThinFrame';
import { NpcPanel, TapHand, Spotlight, TutorialList, TutorialIntro, markTutorialDone, type Hole as TutHole } from './tutorial/ui';
import { DECK_MAX_CARDS, DECK_MAX_COPIES, DECK_MIN_CARDS } from './engine/deck';
import {
  GOLD_PER_TURN, HAND_LIMIT, START_GOLD, START_HAND,
  abilityOn, abilityPhases, canPlayInPhase, areSlotsAdjacent, auraTotal, canPlaceInSlot, canReposition, getAuraCombatHpBonus, getCardDropKind, getEffectiveAtk, getIncomingDamageReduction,
  getLaneCol, getMaxAttacksPerTurn, getMoveRow, getValidAttackTargets, isBackline, isCardDamaged, isFrontline, needsHiddenInfo, phasesForTurn,
  specCandidatesOn, targetSpecOf, targetSpecsOf, verbsOn,
} from './engine/rules';
import { otherSeat, type Action as EngineAction, type Card as EngineCard, type GameEvent, type GameState, type Seat, type TurnPhase } from './engine/types';
export type { TurnPhase };

// Every card/board/UI image in the game besides the start screen's own background
// and logo (those two load first, in the loading screen's initial black-screen
// phase — see LoadingScreen below) — preloaded during the loading screen's bar
// phase so nothing pops in mid-match from a cold network fetch.
const ALL_PRELOAD_IMAGES: string[] = [
  boardBattlefieldImage, cardTemplateImage, cardTemplateSilverImage,
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
  menuCardDesafiosImage, menuCardOnlineImage, menuCardEditarDeckImage, menuCardLojaImage,
  uiFrameMenuCardImage, shopShelfImage, shopCounterImage, shopNpcGreetImage, shopNpcShowImage, shopNpcHappyImage, shopNpcSorryImage, boosterCardealImage, uiStatAtkImage, uiStatHpImage, uiLineHImage, uiLineVImage, uiIconCardImage, uiEditorHeaderImage, uiEditorTabOnImage, uiEditorTabOffImage, uiWindowFrameImage, uiWindowTextureImage, uiPillCoroasImage, uiProfilePlateImage, uiIconButtonImage,
  uiIconConfigImage, uiIconTutoriaisImage, uiIconRankingImage, uiIconSomImage,
  uiIconCoroaImage, uiIconDesafiosImage, uiIconOnlineImage, uiIconEditarDeckImage,
  uiIconLojaImage, uiIconMaisImage,
  avatar01Image, avatar02Image, avatar04Image, avatar05Image, avatar06Image, avatar07Image,
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
// Every <audio>-element sound goes through the player's effects volume (Som, in the menu).
const sfxVol = (v: number) => Math.min(1, v * sfxLevel());
const playCardDrawSfx = () => {
  window.setTimeout(() => {
    const audio = new Audio(cardDrawSfxUrl);
    audio.volume = sfxVol(0.6);
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
  audio.volume = sfxVol(0.7);
  audio.play().catch(() => {});
};
// The blow: sfx-combate-explosao.wav has its loud hit 42 ms in, so it is started just before the 40 ms hit-stop (HIT_STOP_MS)
// and the hit lands on the same frame as the impact visuals (see the two attack flows).
const playAttackSfx = () => playSfx(attackSfxUrl, 0.48, 'sfx:attack');
// A card's effect fires (its float + glow are timed to this clip: swell ~0.2 s, main hit ~0.73 s, ~1.9 s long).
const playEffectSfx = () => playSfx(effectSfxUrl, 0.7, 'sfx:effect');
const playTacticSfx = () => {
  const audio = new Audio(tacticSfxUrl);
  audio.volume = sfxVol(0.6);
  audio.play().catch(() => {});
};
// Deliberately quieter than the others — this one can fire many times in a row
// (every hand-card tap) where the others are one-per-event, so it needs to sit
// in the background instead of competing with them.
const playSelectSfx = () => {
  const audio = new Audio(selectSfxUrl);
  audio.volume = sfxVol(0.35);
  audio.play().catch(() => {});
};
// A plain click for any non-card UI button (menu, deck picker, phase/turn button,
// Cancelar, modal close, ability prompts, ...) — the game had sound for playing/
// attacking/selecting a CARD but total silence for everything else you tap, which
// read as half the interface being "dead" next to the other half.
// Sound for the centre-screen banners (phase changes and turn handoffs, for both sides). Synthesised
// with Web Audio so it needs no asset: a band-passed noise sweep (whoosh) and, for a turn handoff,
// a low two-note gong underneath.
let bannerAudioCtx: AudioContext | null = null;
const playBannerSfx = (kind: 'phase' | 'turn' = 'phase') => {
  const lvl = sfxLevel();
  if (lvl <= 0) return;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    bannerAudioCtx = bannerAudioCtx ?? new AC();
    const ctx = bannerAudioCtx;
    if (ctx.state === 'suspended') void ctx.resume();
    const t0 = ctx.currentTime;
    const dur = 0.42;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = 1.4;
    band.frequency.setValueAtTime(kind === 'turn' ? 300 : 500, t0);
    band.frequency.exponentialRampToValueAtTime(kind === 'turn' ? 1800 : 2600, t0 + 0.3);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, t0);
    ng.gain.exponentialRampToValueAtTime(0.32 * lvl, t0 + 0.12);
    ng.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    noise.connect(band).connect(ng).connect(ctx.destination);
    noise.start(t0);
    if (kind === 'turn') {
      [110, 165].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, t0 + i * 0.05);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0 + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.22 * lvl, t0 + i * 0.05 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
        o.connect(g).connect(ctx.destination);
        o.start(t0 + i * 0.05);
        o.stop(t0 + 1.15);
      });
    }
  } catch { /* audio is optional */ }
};
const playUiClickSfx = () => {
  const audio = new Audio(uiClickSfxUrl);
  audio.volume = sfxVol(0.4);
  audio.play().catch(() => {});
};
// The instant a card lifts off to fly somewhere — played from hand to the board
// (see flyingCard) or slid between two board slots (see repositionFlight) — so the
// motion has a sound at BOTH ends (liftoff here, the existing thud/tactic cue on
// arrival) instead of only announcing itself once it's already landed.
const playCardLiftSfx = () => {
  const audio = new Audio(cardLiftSfxUrl);
  audio.volume = sfxVol(0.45);
  audio.play().catch(() => {});
};
// Any card actually losing HP — see CardSlot's own damageFlash effect, which
// already uniformly detects this regardless of the source (a direct attack, an
// AOE Tática, a splash effect, anything), so hooking the sound there covers every
// case for free instead of needing to thread it through each damage call site.
// A General specifically gets the heavier/plated hit (playGeneralDamageSfx) —
// losing General HP is the whole win condition, so it should land differently
// from a regular soldier taking a hit.
const playDamageSfx = () => {
  const audio = new Audio(damageSfxUrl);
  audio.volume = sfxVol(0.55);
  audio.play().catch(() => {});
};
const playGeneralDamageSfx = () => {
  const audio = new Audio(generalDamageSfxUrl);
  audio.volume = sfxVol(0.65);
  audio.play().catch(() => {});
};
// A card actually dying (isDestroyed flips true) — see CardSlot's own destroy
// effect further below.
// A card burning away: sfx-destruicao-fogo.wav is the "fire burst" clip with its silent first 0.24 s cut, so the crackle starts
// building at 0.2 s and the burst lands at 0.44 s — frame 7 at 16 fps, the burn animation's brightest frame (BURN_FPS).
// Started on the frame the card starts burning (CardSlot's isDestroyed effect), it ends with the last of the fire (~1.1 s).
const playDestroySfx = () => playSfx(destroySfxUrl, 1.1, 'sfx:destroy');
// Match-intro VS reveal (see startMatchIntro/MatchIntroOverlay further below).
const playRevealGeneralSfx = () => {
  const audio = new Audio(revealGeneralSfxUrl);
  audio.volume = sfxVol(0.55);
  audio.play().catch(() => {});
};
const playBatalhaBannerSfx = () => {
  const audio = new Audio(batalhaBannerSfxUrl);
  audio.volume = sfxVol(0.6);
  audio.play().catch(() => {});
};
// The heavy stone-thud that lands exactly when BATALHA's own fall hits the board —
// see startMatchIntro's separate scheduled call for this, timed to the animation's
// own impact fraction rather than firing alongside playBatalhaBannerSfx above.
const playBatalhaImpactSfx = () => {
  const audio = new Audio(batalhaImpactSfxUrl);
  audio.volume = sfxVol(0.75);
  audio.play().catch(() => {});
};

export type CardType = import('./engine/types').CardType;

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
  // Escudo N (absorbs N damage) and Bloqueio (negates the next damage) — see the engine's soak().
  shield?: number;
  block?: boolean;
  // A permanent stack of "-1 damage taken" stamps — currently only granted by
  // Linha Fechada (see resolveOwnTacticTarget) to whoever was adjacent to the
  // chosen unit at cast time. Read in getIncomingDamageReduction alongside the
  // General/Fortaleza aura checks.
  dmgReduction?: number;
  // A temporary ATK stack from Capitão de Formação's "Ao mover: adjacentes +1
  // ATK" (see applyFormationCaptainBuff) — unlike dmgReduction above, this is
  // NOT permanent: it's cleared at the start of every player turn (see the
  // currentTurn === 'player' effect) so re-triggering it several times in one
  // turn (e.g. with Reformar Linhas' bonus moves) is a real but temporary
  // burst, not a free permanent stack. Read in getEffectiveAtk.
  formationBuffAtk?: number;
  // The explicit exception to "Táticas are single-use and never sit on the board":
  // an Armamento (Armadura de Guerra/Couraça Reforçada/Flechas Venenosas/Espada Longa) doesn't
  // go to the graveyard when used — it stays equipped, rendered as a card peeking
  // out from behind this one (see CardSlot), until this unit dies (see
  // graveyardWithEquipment, which sends any equipped weapons along with it).
  equippedWeapons?: CardData[];
  // What the numbers on a board card really are right now, and whether that is better (1), worse (-1) or the same (0) as
  // what the card is printed with: ATK after every aura, buff and weapon, HP after damage and the bonuses that hold in
  // combat. Only set for cards on the board (see boardView); the numbers are drawn from it, in green / red when they differ.
  shown?: { atk: number; hp: number; atkTone: StatTone; hpTone: StatTone };
};
type StatTone = -1 | 0 | 1;
const STAT_TONE_COLOR: Record<StatTone, string | undefined> = { 1: '#8dff7a', 0: undefined, [-1]: '#ff9a8a' };
const STAT_TONE_GRADIENT: Record<1 | -1, string> = {
  1: 'linear-gradient(180deg, #F4FFE9 0%, #A5F07A 32%, #45C23F 62%, #1F8030 100%)',
  [-1]: 'linear-gradient(180deg, #FFEBE6 0%, #FF9580 32%, #E8442F 62%, #9E1E13 100%)',
};
// The numbers a card face draws: the live ones when the card sits on the board, the printed ones everywhere else.
const statsOf = (card: CardData) => card.shown ?? { atk: card.atk, hp: card.hp, atkTone: 0 as StatTone, hpTone: 0 as StatTone };

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
const getSlotHint = (cardType: CardType | undefined, slotIndex: number): SlotHint =>
  canPlaceInSlot(cardType, slotIndex) ? 'valid' : 'invalid';

// What a lit empty slot tells the player about the card being placed, by row and type: the Vanguarda is where a
// unit attacks (and can be hit); in the Retaguarda an Infantaria is a reserve that does not attack, while any other
// soldier still attacks from there and is protected (its column's front card has to fall first).
export type RowRoleHint = 'attack' | 'reserve' | 'guard';
const SOLDIER_CARD_TYPES: CardType[] = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'];
const getRowRoleHint = (cardType: CardType | undefined, slotIndex: number): RowRoleHint | undefined => {
  if (!cardType || !SOLDIER_CARD_TYPES.includes(cardType)) return undefined;
  if (isFrontline(slotIndex)) return 'attack';
  if (isBackline(slotIndex)) return cardType === 'Infantaria' ? 'reserve' : 'guard';
  return undefined;
};
// size = label font size in board px (the board is drawn ~0.46x on a phone, and the word has to fit the 120px slot).
const ROW_ROLE_VIEW: Record<RowRoleHint, { icon: string; label: string; size: number; alt: string }> = {
  attack:  { icon: hintSwordImage,       label: 'ATACA',     size: 27, alt: 'Ataca daqui; fica exposta' },
  reserve: { icon: hintShieldImage,      label: 'RESERVA',   size: 22, alt: 'Reserva: não ataca' },
  guard:   { icon: hintSwordShieldImage, label: 'PROTEGIDA', size: 18, alt: 'Ataca daqui; fica protegida' },
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
// The ceremonial "FASE DE X" wording for the center-screen announcement banner
// (see announcePhase) — this is now the ONLY place a phase's name is shown to the
// player (the small always-on tracker chip was removed, see git history: too tiny
// to read, and redundant now that every transition gets this banner).
const PHASE_BANNER_TEXT: Record<TurnPhase, { title: string; subtitle: string }> = {
  compra: { title: 'Fase de Compra', subtitle: 'Você compra uma carta' },
  suprimentos: { title: 'Fase de Suprimentos', subtitle: 'Você recebe ouro' },
  preparacao: { title: 'Fase de Preparação', subtitle: 'Jogue cartas e ative habilidades' },
  combate: { title: 'Fase de Combate', subtitle: 'Ataque com suas unidades' },
  movimentacao: { title: 'Fase de Movimentação', subtitle: 'Mova tropas e jogue Táticas' },
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
// The match-intro "BATALHA!" reveal (see MatchIntroOverlay) is the whole word
// dropping onto the board as one piece — a heavy fall, then a hard
// squash-and-recoil landing, no vibration afterward. IMPACT_FRACTION is where in
// that fall (as a fraction of FALL_MS) the actual landing happens — both the impact
// flash and playBatalhaImpactSfx are timed off it, so the visual slam and the sound
// land on the exact same frame.
const BATALHA_FALL_MS = 680;
const BATALHA_IMPACT_FRACTION = 0.55;

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

// Both Generals now come from whichever deck each side is playing (see DECKS
// below) — picked at match start in resetGame, not fixed constants like before.

// The hit-stop: the attacker has landed and the whole board holds still for a beat (a few frames) before the hit
// connects. That micro-pause is what makes an attack feel heavy.
const HIT_STOP_MS = 40;
// The attack itself: the card pulls back to gather momentum (slow, ease-out), then strikes much faster (ease-in) with a
// corner leading, like hitting with the edge of the card. Total ATTACK_MS; the wind-up takes ATTACK_WINDUP_FRAC of it.
const ATTACK_MS = 400;
const ATTACK_WINDUP_FRAC = 0.74;
const ATTACK_WINDUP_PX = 46;
const ATTACK_TILT_DEG = 17;
const IMPACT_MS = 150;

// Evenly-spaced directions for SlashEffect's spark burst below.
const SLASH_SPARK_ANGLES = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);

// The moment of contact in any attack — rendered on BOTH the attacker and the
// defender now (see isImpactingAttacker/isImpactingTarget's shared isImpacting
// window), not just the defender, so a hit reads as one real collision both
// sides take part in instead of just a mark on whoever got hit. On top of the
// original crossed slash lines: a quick bright flash (the "snap" of contact),
// an expanding ring shockwave, and a handful of sparks kicked outward — still
// fast (under 0.3s) since this fires on every single attack, not a rare event.
const SlashEffect = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
    <motion.div
      initial={{ scale: 0.3, opacity: 1 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute w-10 h-10 md:w-14 md:h-14 bg-white rounded-full blur-md mix-blend-screen"
    />
    <motion.div
      initial={{ scale: 0.2, opacity: 0.9 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/90"
    />
    <motion.div
      initial={{ scale: 0, opacity: 1, rotateZ: -45 }}
      animate={{ scale: [0, 2, 2.5], opacity: [1, 1, 0] }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="w-[200%] h-4 bg-white shadow-[0_0_30px_rgba(255,255,255,1)] rounded-full" />
      <div className="absolute w-[200%] h-2 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] rounded-full" />
    </motion.div>
    {SLASH_SPARK_ANGLES.map((angle, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-300 rounded-full shadow-[0_0_6px_rgba(253,224,71,0.9)]"
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={{ x: Math.cos(angle) * 46, y: Math.sin(angle) * 46, opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      />
    ))}
  </div>
);

// ── Choosing a target for an effect (Hearthstone-style) ─────────────────────────────────────────────────────────────
// Whatever asks the player to pick a board target — the General's ability, Cavaleiro Hospitalário, a Tática from the
// hand — shows the same thing: the source card parked big and glowing in the bottom-left corner, a bar saying what to
// do, the legal targets marked with the attack reticle (recoloured by what the effect does) and everything else dimmed.
type TargetKind = 'heal' | 'damage' | 'buff' | 'move';
const TARGET_STYLE: Record<TargetKind, { label: string; color: string; halo: string }> = {
  heal: { label: '+HP', color: '#34d399', halo: 'hue-rotate(112deg) saturate(1.2) drop-shadow(0 0 10px rgba(52,211,153,0.95))' },
  damage: { label: 'Dano', color: '#ef4444', halo: 'drop-shadow(0 0 10px rgba(239,68,68,0.95))' },
  buff: { label: 'Bônus', color: '#fbbf24', halo: 'hue-rotate(40deg) saturate(1.2) drop-shadow(0 0 10px rgba(251,191,36,0.95))' },
  move: { label: 'Deslocar', color: '#60a5fa', halo: 'hue-rotate(205deg) saturate(1.2) drop-shadow(0 0 10px rgba(96,165,250,0.95))' },
};
const HUD_CARD_SCALE = 0.47;      // of the 224x320 hand-card box: ~105 px wide, a bit more than twice a card on the board

// The amount an effect gives or takes, drawn with the same number art that floats over a card when it happens ("+1" green with HP, "-3" red
// on its burst), so the figure on the bar is the one the player will then see on the board.
const AmountBadge = ({ kind, amount }: { kind: 'heal' | 'damage'; amount: number }) => {
  const nk: NumberKind = kind;
  const burst = burstUrl(nk);
  const text = `${kind === 'heal' ? '+' : '-'}${amount}`;
  return (
    <span className="relative inline-flex items-center shrink-0" style={{ height: 30, minWidth: 44, justifyContent: 'center' }}>
      {kind === 'damage' && burst && <img src={burst} alt="" draggable={false} className="absolute pointer-events-none select-none max-w-none" style={{ height: 60, width: 60, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.85 }} />}
      <span className="relative inline-flex items-center" style={{ filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.7)) drop-shadow(0 0 7px ${NUMBER_GLOW[nk]})` }}>
        {text.split('').map((ch, i) => {
          const url = glyphUrl(nk, ch);
          return url ? <img key={i} src={url} alt="" draggable={false} className="select-none" style={{ height: 28, marginLeft: i === 0 ? 0 : -4 }} /> : null;
        })}
      </span>
      {kind === 'heal' && <b className="relative ml-1.5" style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: '#8ff0b9', textShadow: '0 1px 2px #000, 0 0 6px rgba(52,211,153,0.8)' }}>HP</b>}
    </span>
  );
};
const TargetingHud = ({ source, mode, kind, title, hint, amount, windowH, promptButtons, onCancel }: {
  source: CardData; mode: 'prompt' | 'targeting'; kind: TargetKind; title: string; hint: string; amount?: number; windowH: number;
  promptButtons?: React.ReactNode; onCancel: () => void; key?: React.Key;
}) => {
  const st = TARGET_STYLE[kind];
  // In the prompt the card floats mid-left, big, with its buttons; once the effect is armed it settles in the corner.
  const promptScale = FIELD_PREVIEW_SCALE.mobile;
  const promptY = -(windowH * 0.55 - 12 - 160 * promptScale);
  return (
    <>
      <div className="fixed left-2 md:left-6 z-[218] pointer-events-none" style={{ bottom: 12 }}>
        <motion.div
          initial={{ scale: 0.25, opacity: 0, y: 50 }}
          animate={mode === 'prompt' ? { scale: promptScale, y: promptY, opacity: 1 } : { scale: HUD_CARD_SCALE, y: 0, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 21, stiffness: 230 }}
          style={{ transformOrigin: 'bottom left' }}
          className="relative w-56 h-80 pointer-events-auto"
        >
          {/* Only the card's art is drawn — no frame or box. It shines with a pulsing glow that follows the art's own
              outline (drop-shadow), in the colour of what the effect does, and sparks rise off it. */}
          <motion.div
            className="absolute inset-0"
            animate={{ filter: [`${CARD_THICKNESS_SHADOW} drop-shadow(0 0 5px ${st.color}aa)`, `${CARD_THICKNESS_SHADOW} drop-shadow(0 0 22px ${st.color})`, `${CARD_THICKNESS_SHADOW} drop-shadow(0 0 5px ${st.color}aa)`] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CardFace card={source} variant="hand" />
          </motion.div>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <motion.span
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{ left: `${8 + i * 13}%`, bottom: '4%', width: 7, height: 7, background: st.color, boxShadow: `0 0 10px 2px ${st.color}` }}
              animate={{ y: [0, -150 - (i % 3) * 40], opacity: [0, 1, 0], scale: [0.6, 1, 0.3] }}
              transition={{ duration: 1.7 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.23, ease: 'easeOut' }}
            />
          ))}
          {mode === 'prompt' && promptButtons && (
            <div className="absolute top-full mt-3 left-0 z-40 flex flex-col items-start gap-2 whitespace-nowrap">{promptButtons}</div>
          )}
        </motion.div>
      </div>
      {mode === 'targeting' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="fixed z-[218] pointer-events-auto"
          style={{ left: 8 + 224 * HUD_CARD_SCALE + 14, right: 8, bottom: 14 }}
        >
          <GameBox px={14} className="flex flex-col gap-1.5 px-1 py-0.5">
            <div className="flex items-center gap-2">
              {amount && (kind === 'heal' || kind === 'damage')
                ? <AmountBadge kind={kind} amount={amount} />
                : <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-black" style={{ background: st.color, fontFamily: "'Cinzel', serif" }}>{st.label}</span>}
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#f0e0bb] leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>{title}</span>
            </div>
            <p className="text-[15px] leading-snug text-[#f1e4c4]" style={{ fontFamily: "'Crimson Pro', serif", fontWeight: 600 }}>{hint}</p>
            <GameButton tone="danger" className="self-start" icon={<X className="w-3 h-3" strokeWidth={3} />} onClick={(e) => { e.stopPropagation(); onCancel(); }}>Cancelar</GameButton>
          </GameBox>
        </motion.div>
      )}
    </>
  );
};

// An ability that can be used right now: light flows over the WHOLE card, up and down, and a rim light pulses along its
// edge. Everything is cut with the card's exact silhouette (tools/vfx/card_masks.py — wings, spikes and notched corners
// included, never a rounded rectangle), placed with the same box the board draws that card's frame in.
// Colour by effect: heal green, damage red, anything else gold.
// One gold for everything, the same as the glow of an effect that fires (TRIGGER_GLOW): green for a heal and red for a damage clashed with it.
// What tells "can be used now" from "just fired" is the motion (light flowing over the card and a rim pulsing, versus a single burst).
const READY_COLORS: Record<'heal' | 'damage' | 'utility', { c1: string; c2: string }> = {
  heal: TRIGGER_GLOW,
  damage: TRIGGER_GLOW,
  utility: TRIGGER_GLOW,
};
const SILHOUETTES = {
  'hand-gold': [maskHandGold, maskHandGoldRim],
  gold: [maskGold, maskGoldRim], silver: [maskSilver, maskSilverRim], champagne: [maskChampagne, maskChampagneRim],
  'fullart-gold': [maskFullartGold, maskFullartGoldRim], 'fullart-tatica': [maskFullartTatica, maskFullartTaticaRim], 'fullart-emboscada': [maskFullartEmboscada, maskFullartEmboscadaRim],
} as const;
const silhouetteFor = (card: CardData | null): { masks: readonly [string, string]; box: React.CSSProperties } => {
  if (card?.isFullArt) {
    const cfg = fullArtMiniConfigForType(card.cardType);
    const key = cfg.image === cardFullArtFrameEmboscadaImage ? 'fullart-emboscada' : cfg.image === cardFullArtFrameTaticaImage ? 'fullart-tatica' : 'fullart-gold';
    return { masks: SILHOUETTES[key], box: { ...cfg.wrapper } };
  }
  const key = card?.cardType === 'Tática' || card?.cardType === 'Terreno' ? 'silver' : card?.cardType === 'Emboscada' ? 'champagne' : 'gold';
  return { masks: SILHOUETTES[key], box: { width: '122%', height: '145.5%', top: '50%', left: '50%', transform: 'translate(-50%, -46%)' } };
};
// The gatilho icon in a card's type line. It lights up (halo, same size) when that card's effect fires.
const TriggerIcon = ({ cardId, icon, trig, className = '', style }: { cardId: string; icon: string; trig: Trigger; className?: string; style?: React.CSSProperties }) => {
  const pulse = usePulse(cardId);
  return (
    <img
      key={pulse ? 'on' : 'off'} src={icon} alt="" aria-hidden draggable={false}
      className={`shrink-0 select-none pointer-events-none ${pulse ? 'tb-icon' : ''} ${className}`}
      style={{ ...style, ...(pulse ? { ['--c1' as string]: TRIGGER_GLOW.c1 } : {}) }}
    />
  );
};
// A card's effect fires: it glows gold (the same for every trigger), a band of light crosses it and a shock ring of its own
// shape grows and fades — all cut with the card's exact silhouette (same masks and box as AbilityReadyGlow), never a rectangle.
// The card lands: dust puffs kicked up along the ground (soft, drifting out and up while they fade), gold sparks that arc and fall, a flat
// shock ring and a short flash. Drawn on a small canvas centred on the slot; everything scales with the card's width (the design is
// for a 56-px-wide board card) and a full-art card kicks up far more of everything. `w` is the landed card's width in px.
// The player's card flight (see the flyingCard overlay): total length, and the moment the slam lands (the dust, the thud).
const FLIGHT_MS = 1000, FLIGHT_HIT_MS = 800;
const ImpactFx = ({ x, y, w, big }: { x: number; y: number; w: number; big: boolean; key?: React.Key }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const k = Math.max(0.6, w / 56) * (big ? 1.15 : 1);
  const S = Math.round((big ? 520 : 340) * Math.max(0.8, w / 56));
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = S * dpr; cv.height = S * dpr; ctx.scale(dpr, dpr);
    const rnd = Math.random, lerp = (a: number, b: number, t: number) => a + (b - a) * t, easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const cx = S / 2, ground = S / 2 + (w / 0.7) / 2;          // ground contact: the bottom edge of the landed card
    const TONES = [[226, 206, 170], [206, 182, 142], [150, 126, 92], [112, 92, 66]];       // pale dust, ochre, and darker earth for body and contrast
    const puffs = Array.from({ length: big ? 58 : 30 }, (_, i) => ({
      side: i % 2 ? 1 : -1, speed: lerp(22, big ? 230 : 170, rnd()) * k, ang: rnd() * 0.55, life: lerp(0.6, big ? 1.5 : 1.15, rnd()),
      rise: lerp(4, big ? 70 : 46, rnd()) * k, size: lerp(10, big ? 32 : 22, rnd()) * k, alpha: lerp(0.32, 0.6, rnd()), tone: TONES[Math.floor(rnd() * TONES.length)], delay: rnd() * 0.06,
    }));
    const sparks = Array.from({ length: big ? 34 : 18 }, (_, i) => ({
      ang: -Math.PI * (0.1 + 0.8 * rnd()), speed: lerp(100, big ? 340 : 250, rnd()) * k, life: lerp(0.32, 0.7, rnd()), gold: i % 3 !== 0,
    }));
    const t0 = performance.now(); const dur = big ? 1.8 : 1.35; let raf = 0;
    const loop = (now: number) => {
      const t = (now - t0) / 1000; ctx.clearRect(0, 0, S, S);
      if (t < 0.14) { const u = t / 0.14; const g = ctx.createRadialGradient(cx, ground - 10 * k, 0, cx, ground - 10 * k, lerp(14, big ? 90 : 56, u) * k); g.addColorStop(0, `rgba(255,243,200,${0.85 * (1 - u)})`); g.addColorStop(1, 'rgba(255,243,200,0)'); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, ground - 10 * k, lerp(14, big ? 90 : 56, u) * k, 0, 7); ctx.fill(); }
      puffs.forEach(p => {
        const u = (t - p.delay) / p.life; if (u < 0 || u > 1) return;
        const px = cx + p.side * p.speed * easeOut(u) * Math.cos(p.ang), py = ground - 4 * k - p.speed * 0.26 * easeOut(u) - p.rise * u, rad = p.size * lerp(0.5, 1.3, u);
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad); const a = p.alpha * (1 - u) * (u < 0.1 ? u / 0.1 : 1);
        g.addColorStop(0, `rgba(${p.tone[0]},${p.tone[1]},${p.tone[2]},${a})`); g.addColorStop(1, `rgba(${p.tone[0]},${p.tone[1]},${p.tone[2]},0)`);
        ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, rad, 0, 7); ctx.fill();
      });
      sparks.forEach(sp => {
        const u = t / sp.life; if (u < 0 || u > 1) return;
        const px = cx + Math.cos(sp.ang) * sp.speed * t, py = ground - 14 * k + Math.sin(sp.ang) * sp.speed * t + 420 * k * t * t;
        ctx.globalAlpha = 1 - u; ctx.fillStyle = sp.gold ? '#ffd36a' : '#fff6d8'; ctx.beginPath(); ctx.arc(px, py, lerp(2.8, 1, u) * Math.min(1.5, k), 0, 7); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (t < dur) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="fixed pointer-events-none" style={{ left: x - S / 2, top: y - S / 2, width: S, height: S, zIndex: 499 }} />;
};
const TriggerBurst = ({ x, y, w, h, card }: { x: number; y: number; w: number; h: number; card: CardData; key?: React.Key }) => {
  const { masks, box } = silhouetteFor(card);
  const maskCss = (url: string): React.CSSProperties => ({
    WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
  });
  return (
    <div className="fixed pointer-events-none" style={{ left: x - w / 2, top: y - h / 2, width: w, height: h, ['--c1' as string]: TRIGGER_GLOW.c1, ['--c2' as string]: TRIGGER_GLOW.c2 }}>
      <div className="absolute tb-shockwrap" style={box}><div className="absolute inset-0 tb-shock" style={maskCss(masks[1])} /></div>
      <div className="absolute tb-outer" style={box}>
        <div className="absolute inset-0 tb-fill" style={maskCss(masks[0])}>
          <div className="absolute inset-0 tb-wash" />
          <div className="absolute inset-0 tb-shine" />
        </div>
        <div className="absolute inset-0 tb-rim" style={maskCss(masks[1])} />
      </div>
    </div>
  );
};
// The card whose effect fires floats up off its slot (the real one is held empty meanwhile, holdsRef), glows in time with the
// sound, and stays up for as long as someone still has to decide — the player to use it or not, later the opponent to block it —
// then sets back down. Same lift pose as the equip scene (EquipFxLayer). Under the pick / target prompts (z 220), over the board.
const TriggerFloatLayer = ({ fx }: { fx: { id: number; card: CardData; rect: { x: number; y: number; w: number; h: number }; stage: 'up' | 'down' } }) => {
  const { rect, stage, card } = fx;
  const up = stage === 'up';
  const base: React.CSSProperties = { position: 'fixed', left: rect.x - rect.w / 2, top: rect.y - rect.h / 2, width: rect.w, height: rect.h };
  return (
    <>
      <motion.div className="fixed pointer-events-none rounded-full" style={{ left: rect.x - rect.w * 0.45, top: rect.y + rect.h * 0.34, width: rect.w * 0.9, height: rect.h * 0.16, background: 'radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)', zIndex: 213 }}
        initial={{ opacity: 0.35, scaleX: 1 }} animate={{ opacity: up ? 0.9 : 0.35, scaleX: up ? 0.85 : 1 }} transition={{ duration: 0.3 }} />
      <motion.div className="pointer-events-none" style={{ ...base, zIndex: 214, filter: CARD_THICKNESS_SHADOW }}
        initial={{ x: 0, y: 0, scale: 1 }} animate={up ? { x: 0, y: -rect.h * 0.2, scale: 1.1 } : { x: 0, y: 0, scale: 1 }}
        transition={up ? { type: 'spring', stiffness: 220, damping: 20 } : { type: 'spring', stiffness: 380, damping: 26 }}>
        {card.isFullArt ? <CardFaceFullArtMini card={card} /> : <CardFaceStandardMini card={card} />}
      </motion.div>
      {up && <div style={{ position: 'fixed', inset: 0, zIndex: 215, pointerEvents: 'none' }}><TriggerBurst key={fx.id} x={rect.x} y={rect.y - rect.h * 0.2} w={rect.w * 1.1} h={rect.h * 1.1} card={card} /></div>}
    </>
  );
};
const AbilityReadyGlow = ({ x, y, w, h, onClick, card = null, kind = 'utility' }: { x: number; y: number; w: number; h: number; onClick: () => void; card?: CardData | null; kind?: 'heal' | 'damage' | 'utility'; key?: React.Key }) => {
  const { masks, box } = silhouetteFor(card);
  const col = READY_COLORS[kind];
  const maskCss = (url: string): React.CSSProperties => ({
    WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
  });
  return (
    <div className="fixed pointer-events-none" style={{ left: x - w / 2, top: y - h / 2, width: w, height: h, ['--c1' as string]: col.c1, ['--c2' as string]: col.c2 }}>
      {/* the glow outside the edge follows the silhouette because it is a filter on the masked layers' parent */}
      <div className="absolute ar-outer" style={box}>
        <div className="absolute inset-0 ar-fill" style={maskCss(masks[0])}>
          <div className="absolute inset-0 ar-wash" />
          <div className="absolute inset-0 ar-band ar-band-a" />
          <div className="absolute inset-0 ar-band ar-band-b" />
        </div>
        <div className="absolute inset-0 ar-rim" style={maskCss(masks[1])} />
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="pointer-events-auto absolute inset-0"
        aria-label="Ativar efeito"
      />
    </div>
  );
};

// ── Tutorial stage ──────────────────────────────────────────────────────────────────────────────────────────────
// Dims the board, leaves what the step points at in plain colour (a card on the board is cut out with its exact
// silhouette — the same masks and boxes as AbilityReadyGlow — never a rounded rectangle), shows the tapping hand in a
// "do" step, and the instructor's panel. It also publishes the rectangles the player may touch, which the App's tap gate
// reads (see the tutorial block in App).
type TutRect = { x: number; y: number; w: number; h: number };
const tutPct = (v: unknown, base: number): number => typeof v === 'string' ? (v.endsWith('%') ? parseFloat(v) / 100 * base : parseFloat(v)) : typeof v === 'number' ? v : 0;
const tutSilBox = (box: React.CSSProperties, r: TutRect) => {
  const bw = box.width !== undefined ? tutPct(box.width, r.w) : r.w;
  const bh = box.height !== undefined ? tutPct(box.height, r.h) : r.h;
  let bx = r.x + (box.left !== undefined ? tutPct(box.left, r.w) : 0);
  let by = r.y + (box.top !== undefined ? tutPct(box.top, r.h) : 0);
  const m = typeof box.transform === 'string' ? box.transform.match(/translate\(\s*(-?[\d.]+)%\s*,\s*(-?[\d.]+)%\s*\)/) : null;
  if (m) { bx += parseFloat(m[1]) / 100 * bw; by += parseFloat(m[2]) / 100 * bh; }
  return { bx, by, bw, bh };
};
const tutElRect = (el: Element): TutRect => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
const tutPad = (r: TutRect, p: number): TutRect => ({ x: r.x - p, y: r.y - p, w: r.w + 2 * p, h: r.h + 2 * p });
const tutUnion = (rs: TutRect[]): TutRect | null => {
  if (!rs.length) return null;
  const x0 = Math.min(...rs.map(r => r.x)), y0 = Math.min(...rs.map(r => r.y)), x1 = Math.max(...rs.map(r => r.x + r.w)), y1 = Math.max(...rs.map(r => r.y + r.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
};
type TutResolved = { holes: TutHole[]; allow: TutRect[]; point: { x: number; y: number } | null };
const TUT_EMPTY: TutResolved = { holes: [], allow: [], point: null };
const visibleHandCards = () => [...document.querySelectorAll<HTMLElement>('[data-hand-card]')].filter(e => parseFloat(getComputedStyle(e).opacity) > 0.05);
const resolveTutTarget = (t: TutTgt, cardAt: (side: 'player' | 'npc', idx: number) => CardData | null): TutResolved => {
  if ('hand' in t) {
    const u = tutUnion(visibleHandCards().map(tutElRect)); if (!u) return TUT_EMPTY;
    const r = tutPad(u, 6);
    return { holes: [{ ...r, round: 22 }], allow: [r], point: { x: r.x + r.w * 0.5, y: r.y + r.h * 0.5 } };
  }
  if ('handCard' in t) {
    const els = visibleHandCards();
    const el = els.find(e => e.dataset.cardName === t.handCard); if (!el) return TUT_EMPTY;
    const r = tutElRect(el);
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    const ang = Math.atan2(m.b, m.a);
    const rotated = Math.abs(ang) > 0.02;
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    // the card's own (unrotated) size on screen, recovered from the bounding box of the tilted card
    const co = Math.abs(Math.cos(ang)), si = Math.abs(Math.sin(ang)), det = co * co - si * si || 1;
    const w0 = rotated ? (r.w * co - r.h * si) / det : r.w, h0 = rotated ? (r.h * co - r.w * si) / det : r.h;
    const [fill, rim] = SILHOUETTES['hand-gold'];
    const sb = tutSilBox({ width: '122%', height: '145.5%', top: '50%', left: '50%', transform: 'translate(-50%, -46%)' }, { x: cx - w0 / 2, y: cy - h0 / 2, w: w0, h: h0 });
    if (!rotated) {
      return { holes: [{ ...r, round: 16, sil: { fill, rim, ...sb } }], allow: [r], point: { x: r.x + r.w * 0.5, y: r.y + r.h * 0.42 } };
    }
    // a card in the fan: the whole fan stays lit, the glowing rim follows this one card's exact shape, tilted like the card
    const fan = tutUnion(els.map(tutElRect))!;
    return {
      holes: [{ ...tutPad(fan, 6), round: 22, noRing: true }, { x: r.x, y: r.y, w: r.w, h: r.h, sil: { fill, rim, ...sb, rotate: `rotate(${ang}rad)`, origin: `${cx - sb.bx}px ${cy - sb.by}px`, rimOnly: true } }],
      allow: [{ x: r.x, y: r.y + r.h * 0.15, w: r.w * 0.34, h: r.h * 0.85 }],
      point: { x: r.x + r.w * 0.2, y: r.y + r.h * 0.2 },
    };
  }
  const els = ('sels' in t ? t.sels : [t.sel]).map(q => document.querySelector(q)).filter((e): e is Element => !!e);
  if (!els.length) return TUT_EMPTY;
  if ('sel' in t) {
    const r = tutElRect(els[0]);
    const m = t.sel.match(/^#(player|npc)-(\d+)$/);
    const card = m ? cardAt(m[1] as 'player' | 'npc', Number(m[2])) : null;
    if (card && !card.isDestroyed) {
      const { masks, box } = silhouetteFor(card);
      return { holes: [{ ...r, sil: { fill: masks[0], rim: masks[1], ...tutSilBox(box, r) } }], allow: [r], point: { x: r.x + r.w * 0.5, y: r.y + r.h * 0.5 } };
    }
    const p = tutPad(r, t.pad ?? 5);
    return { holes: [{ ...p, round: 14 }], allow: [p], point: { x: p.x + p.w * 0.5, y: p.y + p.h * 0.5 } };
  }
  const u = tutPad(tutUnion(els.map(tutElRect))!, t.pad ?? 6);
  return { holes: [{ ...u, round: 16 }], allow: [u], point: { x: u.x + u.w * 0.5, y: u.y + u.h * 0.5 } };
};

const TutorialStage = ({ step, cardAt, allowRef, picked, replay, canBack, onNext, onBack, onRepeat, onSkip, nextLabel }: {
  step: TutStep; cardAt: (side: 'player' | 'npc', idx: number) => CardData | null; allowRef: React.MutableRefObject<TutRect[]>; picked: boolean; replay: number;
  canBack: boolean; onNext: () => void; onBack: () => void; onRepeat: () => void; onSkip: () => void; nextLabel?: string; key?: React.Key;
}) => {
  const [view, setView] = useState<{ holes: TutHole[]; point: { x: number; y: number } | null; avgY: number }>({ holes: [], point: null, avgY: 0.5 });
  const lastKey = useRef('');
  const cardAtRef = useRef(cardAt); cardAtRef.current = cardAt;
  const pickedRef = useRef(picked); pickedRef.current = picked;
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const at = (s: 'player' | 'npc', i: number) => cardAtRef.current(s, i);
      const targets = step.targets ?? [];
      const res = targets.map(t => resolveTutTarget(t, at));
      const holes = res.flatMap(r => r.holes);
      const allowRes = step.allow ? step.allow.map(t => resolveTutTarget(t, at)) : res;
      allowRef.current = step.kind === 'do' ? allowRes.flatMap(r => r.allow) : [];
      let point: { x: number; y: number } | null = null;
      if (step.kind === 'do') {
        const pr = step.point ? resolveTutTarget(step.point, at) : (pickedRef.current && res.length > 1 ? res[1] : res[0]);
        point = pr?.point ?? null;
      }
      const avgY = holes.length ? holes.reduce((a, h) => a + h.y + h.h / 2, 0) / holes.length / window.innerHeight : 0.5;
      const key = JSON.stringify([holes.map(h => [h.x, h.y, h.w, h.h, h.sil?.bx, h.sil?.by, h.sil?.rotate].map(v => typeof v === 'number' ? Math.round(v) : v)), point && [Math.round(point.x), Math.round(point.y)]]);
      if (key !== lastKey.current) { lastKey.current = key; setView({ holes, point, avgY }); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); allowRef.current = []; lastKey.current = ''; };
  }, [step.id]);
  const position = step.panel ?? (view.holes.length === 0 ? 'top' : view.avgY < 0.5 ? 'bottom' : 'top');
  return (
    <>
      {!step.quiet && view.holes.length > 0 && <Spotlight holes={view.holes} />}
      {step.kind === 'do' && view.point && <TapHand x={view.point.x} y={view.point.y} />}
      <NpcPanel step={step} chapter={step.chapter} chapters={TUT_CHAPTERS} position={position} replay={replay} canBack={canBack}
        onNext={step.kind === 'read' ? onNext : undefined} onBack={onBack} onRepeat={onRepeat} onSkip={onSkip} nextLabel={nextLabel} />
    </>
  );
};

// The bonus that shows when something raises a card's stats (equipment now; heals and buffs later). The icon is meant to be
// painted art (`iconSrc`); until it exists a plain symbol stands in. It always arrives through a reveal mask.
// A sprite sheet played once (and held on its last frame), after an optional delay.
const SpriteOnce = ({ sheet, cols, rows, frames, fps, delay = 0, className = '' }: { sheet: string; cols: number; rows: number; frames: number; fps: number; delay?: number; className?: string }) => {
  const [frame, setFrame] = useState(-1);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now() + delay;
    const loop = (now: number) => {
      setFrame(Math.max(-1, Math.min(frames - 1, Math.floor(((now - t0) / 1000) * fps))));
      if ((now - t0) / 1000 * fps < frames) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  if (frame < 0) return <div className={className} />;
  const col = frame % cols, row = Math.floor(frame / cols);
  return <div className={className} style={{ backgroundImage: `url(${sheet})`, backgroundRepeat: 'no-repeat', backgroundSize: `${cols * 100}% ${rows * 100}%`, backgroundPosition: `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%` }} />;
};
// The painted effect icons and their animation sheets (tools/vfx/effect_icons.py, tools/vfx/atk_up_icon.py).
type EffectIcon = 'atk-up' | 'atk-down' | 'hp-up' | 'hp-down' | 'reinforce' | 'swap';
const EFFECT_ICONS: Record<EffectIcon, { sheet: string; rows: number; frames: number; color: string }> = {
  'atk-up': { sheet: fxAtkUpSheet, rows: 6, frames: 36, color: '#ffb347' },
  'atk-down': { sheet: fxAtkDownSheet, rows: 5, frames: 30, color: '#ff6a55' },
  'hp-up': { sheet: fxHpUpSheet, rows: 5, frames: 30, color: '#ff8a7a' },
  'hp-down': { sheet: fxHpDownSheet, rows: 5, frames: 30, color: '#ff6a55' },
  'reinforce': { sheet: fxReinforceSheet, rows: 5, frames: 30, color: '#7fc3ff' },
  'swap': { sheet: fxSwapSheet, rows: 5, frames: 30, color: '#8fe3ff' },
};
const SpriteIcon = ({ icon, delay = 0, className = '' }: { icon: EffectIcon; delay?: number; className?: string }) => {
  const d = EFFECT_ICONS[icon];
  return <SpriteOnce sheet={d.sheet} cols={6} rows={d.rows} frames={d.frames} fps={30} delay={delay} className={className} />;
};
// A small icon that pops above a card when something happens to it (a heal, a bonus, a reinforcement, a swap) and fades.
const IconPop = ({ x, y, size = 92, icon, label }: { x: number; y: number; size?: number; icon: EffectIcon; label?: string; key?: React.Key }) => {
  const d = EFFECT_ICONS[icon];
  return (
    <motion.div className="fixed pointer-events-none flex flex-col items-center" style={{ left: x - size / 2, top: y - size, width: size, zIndex: 495 }}
      initial={{ opacity: 0, y: 10, scale: 0.7 }} animate={{ opacity: [0, 1, 1, 0], y: [10, 0, -6, -22], scale: [0.7, 1.05, 1, 1] }} transition={{ duration: 1.9, times: [0, 0.12, 0.7, 1], ease: 'easeOut' }}>
      <div style={{ width: size, height: size, filter: `drop-shadow(0 0 8px ${d.color}aa) drop-shadow(0 2px 4px rgba(0,0,0,0.7))` }}>
        <SpriteIcon icon={icon} className="w-full h-full" />
      </div>
      {label && <span className="font-black -mt-1 whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: '#fff7e0', textShadow: `0 2px 0 #000, 0 0 10px ${d.color}` }}>{label}</span>}
    </motion.div>
  );
};
// Escudo / Bloqueio on a card: a translucent shield-shaped bubble of glass around it (tools/vfx/shield_aura.py). Escudo is
// ice-blue and carries its value; Bloqueio is the same bubble turned gold. The sheets share the punch sheet's frame geometry
// (the card area plus 50 px on every side), so they are placed by percentages of the card.
const SHIELD_SHEETS = {
  appear: { sheet: fxShieldAppearSheet, rows: 2, frames: 10, fps: 24 },
  loop: { sheet: fxShieldLoopSheet, rows: 4, frames: 24, fps: 20 },
  hit: { sheet: fxShieldHitSheet, rows: 2, frames: 10, fps: 28 },
  break: { sheet: fxShieldBreakSheet, rows: 3, frames: 18, fps: 28 },
} as const;
const GOLD_BUBBLE = 'hue-rotate(-165deg) saturate(1.5) brightness(1.1)';
const ShieldAura = ({ kind, value }: { kind: 'shield' | 'block'; value?: number }) => {
  const d = SHIELD_SHEETS.loop;
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const loop = (now: number) => { setFrame(Math.floor(((now - t0) / 1000) * d.fps) % d.frames); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const col = frame % 6, row = Math.floor(frame / 6);
  return (
    <div className="absolute pointer-events-none" style={{ left: `${-PUNCH_PAD_X * 100}%`, top: `${-PUNCH_PAD_Y * 100}%`, width: `${PUNCH_FRAME_W * 100}%`, height: `${PUNCH_FRAME_H * 100}%`, zIndex: 7 }}>
      <div className="absolute inset-0" style={{ backgroundImage: `url(${d.sheet})`, backgroundRepeat: 'no-repeat', backgroundSize: `600% ${d.rows * 100}%`, backgroundPosition: `${(col / 5) * 100}% ${(row / (d.rows - 1)) * 100}%`, filter: kind === 'block' ? GOLD_BUBBLE : undefined }} />
      {kind === 'shield' && value !== undefined && (
        <div className="absolute flex items-center justify-center font-black" style={{ left: '50%', top: '20.5%', transform: 'translateX(-50%)', minWidth: 20, height: 20, padding: '0 5px', borderRadius: 10, background: 'linear-gradient(#5f7691, #2c3c52)', border: '1.5px solid #cfe7ff', boxShadow: '0 0 8px #7fb4ffaa, inset 0 1px 0 #ffffff55', color: '#f2f8ff', fontFamily: "'Cinzel', serif", fontSize: 12 }}>{value}</div>
      )}
    </div>
  );
};
// The same bubble played once over a slot (it appearing, a hit it shrugs off, or it shattering).
const ShieldFxOnce = ({ x, y, w, h, mode, gold }: { x: number; y: number; w: number; h: number; mode: 'appear' | 'hit' | 'break'; gold?: boolean; key?: React.Key }) => {
  const d = SHIELD_SHEETS[mode];
  const fw = w * PUNCH_FRAME_W, fh = h * PUNCH_FRAME_H;
  return (
    <div className="fixed pointer-events-none" style={{ left: x - fw / 2, top: y - fh / 2, width: fw, height: fh, zIndex: 492, filter: gold ? GOLD_BUBBLE : undefined }}>
      <SpriteOnce sheet={d.sheet} cols={6} rows={d.rows} frames={d.frames} fps={d.fps} className="w-full h-full" />
    </div>
  );
};

// Equipping, as a small scene on the board itself: the unit lifts a little, the equipment card slides in from the hand into
// the slot underneath it, the unit sets down on top of it with a flash, a ring and sparks, and the bonus icon pops over it.
// Positions are offsets from the slot's own rectangle, so it works for either side of the board; the slot itself is held
// empty on screen meanwhile (holdsRef).
const EquipFxLayer = ({ fx, vw, vh }: { fx: { side: 'player' | 'npc'; unit: CardData; unitAfter: CardData; weapon: CardData; atk: number; hp: number; stage: 'lift' | 'arrive' | 'land'; rect: { x: number; y: number; w: number; h: number } }; vw: number; vh: number }) => {
  const { rect, stage } = fx;
  const peek = 0.16;                                          // the same offset the board draws a stacked weapon at (9 px on a 56 px card)
  const weaponHome = { x: rect.w * peek, y: rect.w * peek, scale: 0.9, rotate: 0, opacity: 1 };
  const fromHand = { x: (vw / 2 - rect.x) * 0.5, y: vh - rect.y + rect.h * 0.4, scale: 1.1, rotate: -6, opacity: 0 };
  const weaponPose = stage === 'lift' ? fromHand : weaponHome;
  const unitPose = stage === 'lift' || stage === 'arrive' ? { x: 0, y: -rect.h * 0.2, scale: 1.1, rotate: 0 } : { x: 0, y: 0, scale: 1, rotate: 0 };
  const base: React.CSSProperties = { position: 'fixed', left: rect.x - rect.w / 2, top: rect.y - rect.h / 2, width: rect.w, height: rect.h };
  const lifted = stage !== 'land';
  const sparks = Array.from({ length: 10 }, (_, i) => i);
  return (
    <>
      {/* a soft shadow on the board under the lifted unit */}
      <motion.div className="fixed pointer-events-none rounded-full" style={{ left: rect.x - rect.w * 0.45, top: rect.y + rect.h * 0.34, width: rect.w * 0.9, height: rect.h * 0.16, background: 'radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)', zIndex: 480 }}
        animate={{ opacity: lifted ? 0.9 : 0.35, scaleX: lifted ? 0.85 : 1 }} transition={{ duration: 0.3 }} />
      <motion.div className="pointer-events-none" style={{ ...base, zIndex: 481, filter: CARD_THICKNESS_SHADOW }} initial={fromHand} animate={weaponPose}
        transition={stage === 'arrive' ? { type: 'spring', stiffness: 150, damping: 18 } : { duration: 0.2 }}>
        <CardFace card={fx.weapon} variant="field" />
      </motion.div>
      <motion.div className="pointer-events-none" style={{ ...base, zIndex: 482, filter: CARD_THICKNESS_SHADOW }} initial={{ x: 0, y: 0, scale: 1, rotate: 0 }} animate={unitPose}
        transition={stage === 'land' ? { type: 'spring', stiffness: 420, damping: 22 } : { type: 'spring', stiffness: 260, damping: 20 }}>
        <motion.div className="absolute inset-0" animate={stage === 'land' ? { filter: ['brightness(1.9) saturate(1.3)', 'brightness(1)'] } : { filter: 'brightness(1)' }} transition={{ duration: 0.45 }}>
          {fx.unit.isFullArt ? <CardFaceFullArtMini card={stage === 'land' ? fx.unitAfter : fx.unit} /> : <CardFaceStandardMini card={stage === 'land' ? fx.unitAfter : fx.unit} />}
        </motion.div>
      </motion.div>
      {stage === 'land' && (
        <div className="fixed pointer-events-none" style={{ left: rect.x, top: rect.y, width: 0, height: 0, zIndex: 484 }}>
          {[0, 0.12].map((delay, k) => (
            <motion.div key={k} className="absolute rounded-full" style={{ left: -rect.w * 0.6, top: -rect.w * 0.6, width: rect.w * 1.2, height: rect.w * 1.2, border: `${3 - k}px solid ${k ? '#fff3c4' : '#ffb347'}`, boxShadow: '0 0 14px #ffb347aa, inset 0 0 12px #ffb34755' }}
              initial={{ scale: 0.4, opacity: 0.95 }} animate={{ scale: 2.6 + k * 0.5, opacity: 0 }} transition={{ duration: 0.65, delay, ease: 'easeOut' }} />
          ))}
          {sparks.map(i => {
            const ang = (i / sparks.length) * Math.PI * 2 + 0.3, dist = rect.w * (0.9 + (i % 3) * 0.3);
            return <motion.span key={i} className="absolute rounded-full" style={{ left: -3, top: -3, width: 6, height: 6, background: '#ffe29a', boxShadow: '0 0 8px 2px #ffb347' }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(ang) * dist, y: Math.sin(ang) * dist * 0.8 - 6, opacity: 0, scale: 0.3 }} transition={{ duration: 0.6, ease: 'easeOut' }} />;
          })}
        </div>
      )}
    </>
  );
};

// The physical blow: a sprite sheet drawn over the card that was hit (impact star and speed lines, shock ring, dust,
// flying chips, a flash, a bruise, cracks that glow and then go dark). Made by tools/vfx/punch_overlay.py. The card's own
// shove, squash and tremor happen live in CardSlot; this is only what goes on top. Each frame is the card plus padding,
// so it is placed by percentages of the card and follows its size.
const PUNCH_FRAMES = 14, PUNCH_COLS = 5, PUNCH_ROWS = 3, PUNCH_FPS = 30;
const PUNCH_FRAME_W = 1.431, PUNCH_FRAME_H = 1.347, PUNCH_PAD_X = 0.2155, PUNCH_PAD_Y = 0.1736;   // frame size / padding as a fraction of the card
if (typeof Image !== 'undefined') { const warm = new Image(); warm.src = fxPunchSheet; }
const PunchFx = ({ x, y, w, h, heavy = false }: { x: number; y: number; w: number; h: number; heavy?: boolean }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const i = Math.floor((now - t0) / (1000 / PUNCH_FPS));
      if (i >= PUNCH_FRAMES) { setFrame(-1); return; }
      setFrame(i);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  if (frame < 0) return null;
  const col = frame % PUNCH_COLS, row = Math.floor(frame / PUNCH_COLS);
  const k = heavy ? 1.7 : 1.4;   // the cards are small on a phone: the blow is drawn bigger than the card
  const fw = w * PUNCH_FRAME_W * k, fh = h * PUNCH_FRAME_H * k;
  return (
    <div
      className="fixed pointer-events-none z-[190]"
      style={{
        left: x + w / 2 - fw / 2, top: y + h / 2 - fh / 2, width: fw, height: fh,
        backgroundImage: `url(${fxPunchSheet})`, backgroundRepeat: 'no-repeat',
        backgroundSize: `${PUNCH_COLS * 100}% ${PUNCH_ROWS * 100}%`,
        backgroundPosition: `${(col / (PUNCH_COLS - 1)) * 100}% ${(row / (PUNCH_ROWS - 1)) * 100}%`,
      }}
    />
  );
};

// A destroyed card burning away on its own art. Two sprite sheets made by tools/vfx/burn_sheets.py work over ANY card:
// the mask (opaque = the card is still there) is applied as a CSS mask to the live card face, and the fire sheet — the
// glowing edge, scorch, embers and smoke — is drawn over it. The fire starts low and in the middle (where the blow
// landed) and spreads outward. 18 frames at 16 fps = 1.1 s, inside the 1.3 s the destroyed card is kept on the board.
const BURN_FRAMES = 18, BURN_COLS = 6, BURN_ROWS = 3, BURN_FPS = 16;
if (typeof Image !== 'undefined') { [fxBurnMask, fxBurnFire].forEach(src => { const warm = new Image(); warm.src = src; }); }
const BurningCard = ({ children }: { children: React.ReactNode }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    dbgMark('visual:burn-start');
    const loop = (now: number) => {
      const i = Math.floor((now - t0) / (1000 / BURN_FPS));
      setFrame(Math.min(i, BURN_FRAMES));
      if (i < BURN_FRAMES) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  if (frame >= BURN_FRAMES) return null;
  const col = frame % BURN_COLS, row = Math.floor(frame / BURN_COLS);
  const pos = `${(col / (BURN_COLS - 1)) * 100}% ${(row / (BURN_ROWS - 1)) * 100}%`;
  const size = `${BURN_COLS * 100}% ${BURN_ROWS * 100}%`;
  return (
    <>
      <div
        className="absolute inset-0 z-40 pointer-events-none rounded-lg overflow-hidden w-full h-full"
        style={{
          WebkitMaskImage: `url(${fxBurnMask})`, maskImage: `url(${fxBurnMask})`,
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: size, maskSize: size,
          WebkitMaskPosition: pos, maskPosition: pos,
        }}
      >
        {children}
      </div>
      <div
        className="absolute z-[45] pointer-events-none"
        style={{
          left: `${-PUNCH_PAD_X * 100}%`, top: `${-PUNCH_PAD_Y * 100}%`, width: `${PUNCH_FRAME_W * 100}%`, height: `${PUNCH_FRAME_H * 100}%`,
          backgroundImage: `url(${fxBurnFire})`, backgroundRepeat: 'no-repeat', backgroundSize: size, backgroundPosition: pos,
        }}
      />
    </>
  );
};

// The on-board Graveyard pile — an empty placeholder box until a card actually dies.
// Shows the actual top (most recently destroyed) card as a real thumbnail now, not
// just its name as plain text — the same CardFace/"popup" variant/box size the card
// play announcement uses (see its own usage further down), since that's already
// tuned for a small, fully-legible card at this exact footprint. Clickable (onClick,
// wired by each call site below) to open the full graveyard browser overlay — the
// pile itself only ever shows the ONE top card, so opening it is the only way to see
// what else has piled up underneath.
const GraveyardPile = ({ cards, onClick, tut }: { cards: CardData[]; onClick?: () => void; tut?: string }) => (
  <div
    data-tut={tut}
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

// One floating number: a burst star pops behind it, the digits (image glyphs) swell, shake a little, drift up and fade.
// The size grows with the amount for damage. Positioned by its wrapper (centre = where the number starts).
const NUMBER_KIND_OF: Record<'damage' | 'heal' | 'gold-gain' | 'gold-spend' | 'shield', NumberKind> = {
  damage: 'damage', heal: 'heal', 'gold-gain': 'gold', 'gold-spend': 'goldspend', shield: 'shield',
};
const FloatNumber = ({ text, kind }: { text: string; kind: keyof typeof NUMBER_KIND_OF }) => {
  const k = NUMBER_KIND_OF[kind];
  const amount = parseInt(text.replace(/\D/g, ''), 10) || 0;
  const h = k === 'damage' ? Math.min(78, 44 + amount * 5) : 40;
  const burst = burstUrl(k);
  return (
    <div className="relative flex items-center justify-center" style={{ height: h }}>
      {burst && (
        <motion.img
          src={burst} alt=""
          initial={{ scale: 0.2, opacity: 0, rotate: -14 }}
          animate={{ scale: [0.2, 1.1, 1.55], opacity: [0, 1, 0], rotate: [-14, 0, 8] }}
          transition={{ duration: 0.55, ease: 'easeOut', times: [0, 0.35, 1] }}
          className="absolute pointer-events-none select-none max-w-none"
          style={{ height: h * 2.3, width: h * 2.3, opacity: 0 }}
          draggable={false}
        />
      )}
      <motion.div
        initial={{ scale: 0.3, opacity: 0, y: 0, rotate: -6 }}
        animate={{ scale: [0.3, 1.6, 1.2, 1.2, 1], opacity: [0, 1, 1, 1, 0], y: [0, -6, -20, -46, -80], rotate: [-6, 5, -2, 0, 0] }}
        transition={{ duration: 1.45, ease: 'easeOut', times: [0, 0.12, 0.3, 0.72, 1] }}
        className="relative flex items-center"
        style={{ filter: `drop-shadow(0 3px 3px rgba(0,0,0,0.7)) drop-shadow(0 0 10px ${NUMBER_GLOW[k]})` }}
      >
        {text.split('').map((ch, i) => {
          const url = glyphUrl(k, ch);
          if (!url) return null;
          const isSign = ch === '-' || ch === '+';
          return <img key={i} src={url} alt="" draggable={false} className="select-none" style={{ height: h * (isSign ? 1.05 : 1), marginLeft: i === 0 ? 0 : -h * 0.16 }} />;
        })}
      </motion.div>
    </div>
  );
};

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
    {/* Fixed, deliberately small size (not the self-fitting measure-and-shrink version
        this had briefly) per the user's own explicit ask: a plain smaller size that
        never reaches the strip's edges, comfortably fitting three digits (mana has no
        upper cap from turn 3 on) with real margin to spare, rather than a dynamic
        shrink that still read as "leaking" close to the border. */}
    <span className="absolute inset-y-0 right-[6%] left-[36%] flex items-center justify-center text-amber-100 font-black text-sm md:text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-none">
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
const GoldNumber = ({ value, className = "", dark = false, tone = 0 }: { value: number, className?: string, dark?: boolean, tone?: StatTone }) => {
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
          background: tone !== 0 ? STAT_TONE_GRADIENT[tone]
            : dark
            ? 'linear-gradient(180deg, #6b4a1e 0%, #3f2a0d 55%, #2b1a06 100%)'
            : 'linear-gradient(180deg, #FFFFFF 0%, #FDE08B 30%, #D4AF37 60%, #AA7200 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: dark
            ? 'drop-shadow(0 1px 0 rgba(255,248,230,0.75))'
            : 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.8))',
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

// A Full Art print's silhouette isn't a rectangle — wings and spikes overflow the
// card box and its corners are empty — so a ring/glow drawn on the card's own
// rectangular box shows through as a "container" around the frame. For those
// prints the rectangular box-shadow is dropped and the glow moves into the
// filter chain, where drop-shadow follows the frame's real alpha instead.
const cardBoxShadow = (card: CardData, rect: string) => (card.isFullArt ? 'none' : rect);
const cardGlowFilter = (card: CardData, glow: string) =>
  card.isFullArt ? `${CARD_THICKNESS_SHADOW} drop-shadow(${glow})` : CARD_THICKNESS_SHADOW;

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
        // lineHeight is set here (not left to the font-size utility's own bundled
        // default, e.g. text-2xl's fixed 2rem) specifically so it scales down
        // together with the font-size the binary search above picks — otherwise a
        // 2-line name's wrapped height stays roughly constant no matter how far the
        // search shrinks the font (only glyph width shrinks, not the fixed-px line
        // box), so it can never actually converge on something that fits a short
        // container — see Comandante Aurelion's name overflowing the reveal
        // cinematic's card, which is what surfaced this.
        style={{ ...style, display: 'block', textAlign: 'center', lineHeight: 1.05 }}
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
// The word that names an effect's trigger (Reforço, Postura, Comando…) as a small bronze label, with the trigger's own icon when there is
// one; it sizes itself from the text around it (em), so it shrinks together with the effect text when that is fitted into the card.
const KeywordPill = ({ label, icon }: { label: string; icon?: string; key?: React.Key }) => (
  <span style={{
    display: 'inline-block', fontFamily: "'Cinzel', serif", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.68em',
    color: '#fff3d0', background: 'linear-gradient(#b4742c, #7a4a12)', border: '1px solid #4a2a08', borderRadius: 5,
    padding: icon ? '1px 0.7em 1px 0.3em' : '1px 0.7em', margin: '0 0.5em 0 0', verticalAlign: '0.1em', textShadow: '0 1px 1px rgba(0,0,0,0.5)', lineHeight: 1.35, whiteSpace: 'nowrap',
  }}>
    {icon && <img src={icon} alt="" draggable={false} style={{ width: '1.35em', height: '1.35em', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle', marginRight: '0.3em' }} />}
    {label}
  </span>
);
// Rule numbers inside the effect text turn into the game's own symbols: "+2 ATK" → "+2" and the sword, "+1 HP" → "+1" and a red
// heart, "3 de dano" → the damage burst with the 3 inside. "+1/+1" becomes both. A reduction ("-1 de dano") stays words. The sizes
// are in em, so the symbols shrink with the text when it is fitted; they are a little under two lines' worth so that symbols on
// neighbouring lines never touch.
const STAT_TOKEN = /\*\*[^*]+\*\*|[+-]\d+\/[+-]\d+|[+-]\d+ (?:ATK|HP)\b|\d+ de dano/g;
const STAT_NUMBER_STYLE: React.CSSProperties = { fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: '1.3em', lineHeight: 1, verticalAlign: 'middle', textShadow: '0 1px 0 #000, 0 -1px 0 #000, 1px 0 0 #000, -1px 0 0 #000, 0 0 3px #000' };
const StatSymbol = ({ amount, kind }: { amount: string; kind: 'atk' | 'hp'; key?: React.Key }) => (
  <span style={{ display: 'inline-block', whiteSpace: 'nowrap', margin: '0 0.12em' }}>
    <span style={{ ...STAT_NUMBER_STYLE, color: kind === 'atk' ? '#ffe08a' : '#ffb3a8' }}>{amount}</span>
    <img src={kind === 'atk' ? uiIconSword : uiIconHeart} alt={kind === 'atk' ? 'ATK' : 'HP'} draggable={false}
      style={{ height: '1.6em', width: 'auto', display: 'inline-block', verticalAlign: 'middle', margin: '-0.5em 0 -0.5em 0.12em' }} />
  </span>
);
const DamageSymbol = ({ amount }: { amount: string; key?: React.Key }) => {
  const burst = burstUrl('damage');
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '1.8em', height: '1.4em', verticalAlign: 'middle', margin: '0 0.15em', whiteSpace: 'nowrap' }} aria-label={`${amount} de dano`}>
      {burst && <img src={burst} alt="" draggable={false} style={{ position: 'absolute', left: '50%', top: '50%', width: '2.1em', height: '2.1em', maxWidth: 'none', transform: 'translate(-50%, -50%)' }} />}
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.6))' }}>
        {amount.split('').map((ch, i) => { const g = glyphUrl('damage', ch); return g ? <img key={i} src={g} alt="" draggable={false} style={{ height: '1.05em', marginLeft: i ? '-0.1em' : 0 }} /> : null; })}
      </span>
    </span>
  );
};
const renderEffectText = (text: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  let last = 0, key = 0, m: RegExpExecArray | null;
  STAT_TOKEN.lastIndex = 0;
  while ((m = STAT_TOKEN.exec(text))) {
    const t = m[0], at = m.index;
    const prev = text[at - 1];
    const damage = t.endsWith(' de dano');
    if (damage && prev && /[-\d]/.test(prev)) continue;                  // "-1 de dano": a reduction, left as words
    if (at > last) out.push(text.slice(last, at));
    if (t.startsWith('**')) out.push(<KeywordPill key={key++} label={t.slice(2, -2)} />);
    else if (damage) out.push(<DamageSymbol key={key++} amount={t.split(' ')[0]} />);
    else if (t.includes('/')) { const [a, h] = t.split('/'); out.push(<StatSymbol key={key++} amount={a} kind="atk" />, <StatSymbol key={key++} amount={h} kind="hp" />); }
    else out.push(<StatSymbol key={key++} amount={t.split(' ')[0]} kind={t.endsWith('ATK') ? 'atk' : 'hp'} />);
    last = at + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};
const FitEffectText = ({ text, className, style, align = 'center', lead }: { text: string, className?: string, style?: React.CSSProperties, align?: 'center' | 'start', lead?: { label: string, icon?: string } }) => {
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
  }, [text, lead?.label]);

  // 'start' — the Full Art plate's own Yu-Gi-Oh-style flow: text begins at the
  // top-left and wraps normally left-to-right instead of centering as a block,
  // fitting more characters into the same box than a centered paragraph would.
  // 'center' (default) is the Padrão layout's existing look — unchanged.
  return (
    <div ref={containerRef} className={`w-full h-full flex overflow-hidden ${align === 'start' ? 'items-start justify-start' : 'items-center justify-center'}`}>
      <p ref={textRef} className={className} style={{ ...style, margin: 0 }}>
        {lead && <KeywordPill label={lead.label} icon={lead.icon} />}
        {renderEffectText(text)}
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

// Measured on real renders: a Full Art card's outer silhouette (frame + wings) comes out ~6% smaller
// than a Padrão one in the same 224x320 slot (239x352 vs 254x376 px), so every Full Art face is scaled
// up by this much around the card's centre and they all read as the same size side by side.
const FULL_ART_SIZE_FIX = 1.065;
const CardFaceFullArt = ({ card, variant = 'hand' }: { card: CardData, variant?: keyof typeof CARD_FACE_VARIANTS }) => {
  const v = CARD_FACE_VARIANTS[variant];
  const pv = FULL_ART_PLATE_VARIANTS[variant];
  const showStats = !NO_STAT_TYPES.has(card.cardType as CardType);
  const cfg = fullArtMiniConfigForType(card.cardType);
  const lightBar = usesLightBar(cfg);
  const trig = triggerOf(card.name);
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
    <div className="absolute pointer-events-none" style={{ ...cfg.wrapper, transform: `scale(${FULL_ART_SIZE_FIX})`, transformOrigin: '50% 50%' }}>
      <div className="absolute overflow-hidden" style={{ ...cfg.art }}>
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
              <div className={`${pv.type} flex items-center justify-center shrink-0`}>
                <span className="font-black uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif", color: '#e9d8a6' }}>
                  {card.cardType}
                </span>
                {trig && <TriggerIcon cardId={card.id} icon={trig.icon} trig={trig.key} style={{ height: '1.5em', width: '1.5em', marginLeft: '0.45em' }} />}
              </div>
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
              lead={trig ? { label: trig.label, icon: trig.icon } : undefined}
              align="start"
              className={`${pv.effect} text-left leading-snug`}
              style={{ fontFamily: "'PT Serif', serif", color: '#f3e6c8' }}
            />
          </div>
        </div>
      )}

      <img src={cfg.image} alt="" aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" draggable={false} />

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Name — sits on the frame's own dark top bar. Re-checked against the
            bar's actual dark fill (not just its outer gold trim): it runs from
            ~9% to ~71% (where the coin medallion starts), vertically ~8.5%-14% —
            the box now matches that instead of a slightly-off guess. */}
        <div className="absolute px-1 flex items-center" style={{ top: '8.5%', left: '9%', width: '62%', height: '5.5%' }}>
          <FitText
            text={card.name}
            className={`${v.name} font-bold uppercase tracking-tight`}
            style={{ fontFamily: "'Cinzel', serif", ...nameTextStyle(lightBar) }}
          />
        </div>

        {/* Cost — NOT inside the round medallion (that's a solid decorative coin,
            no room for a digit) but in the separate small dark plate immediately
            to its right, same idea as the Padrão layout's own coin+number pair.
            Pixel-checked against that plate's actual dark fill: x ~83.5%-91.5%,
            y ~9.3%-13.8%. */}
        <div className="absolute flex items-center justify-center" style={{ left: '83.5%', top: '9.3%', width: '8%', height: '4.5%' }}>
          <GoldNumber value={card.cost} className={v.stat} dark={lightBar} />
        </div>

        {/* ATK/HP — the frame's own black shield (left) and red heart shield
            (right). Nudged up slightly one more time per the user's final
            call after comparing the last deploy against the live card. */}
        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '16%', top: '85.7%', width: '14%', height: '11%', transform: 'translate(-50%, -50%)' }}>
              <GoldNumber value={statsOf(card).atk} tone={statsOf(card).atkTone} className={v.combatStat} />
            </div>
            <div className="absolute flex items-center justify-center" style={{ left: '84%', top: '85.7%', width: '14%', height: '11%', transform: 'translate(-50%, -50%)' }}>
              <GoldNumber value={statsOf(card).hp} tone={statsOf(card).hpTone} className={v.combatStat} />
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
  // Wrappers below place each frame's OUTER silhouette (wings, spikes and all)
  // exactly where the gold creature frame's own silhouette lands (x -3.8%..103.6%,
  // y -5.0%..105.4% of the card) — so every Full Art print has its rails at the
  // same spot and reads as the same size. An earlier version squeezed the whole
  // silhouette inside the card rectangle instead, which shrank the rails and art
  // window ~5% next to a gold card.
  Tática: {
    image: cardFullArtFrameTaticaImage,
    wrapper: { left: '-4.21%', top: '-5.69%', width: '108.1%', height: '114.1%' },
    art: { left: '9.77%', top: '15.43%', width: '80.86%', height: '72.72%' },
  },
  Emboscada: {
    image: cardFullArtFrameEmboscadaImage,
    wrapper: { left: '-4.65%', top: '-6.08%', width: '109%', height: '118.8%' },
    art: { left: '9.96%', top: '15.36%', width: '79.88%', height: '69.40%' },
  },
  // Terreno never shows ATK/HP either (NO_STAT_TYPES) but has no frame of its
  // own yet — borrows the Tática one (same geometry) until a dedicated color exists.
  Terreno: {
    image: cardFullArtFrameTaticaImage,
    wrapper: { left: '-4.21%', top: '-5.69%', width: '108.1%', height: '114.1%' },
    art: { left: '9.77%', top: '15.43%', width: '80.86%', height: '72.72%' },
  },
};
// The Tática/Emboscada/Terreno frames have LIGHT (silver/champagne) name and cost
// bars, unlike the creature frame's dark one — the usual pale-gold text washes out
// on them, so those get dark brown with a faint light edge instead.
const usesLightBar = (cfg: FullArtMiniConfig) => cfg.image !== cardTemplateFullArtGoldImage;
const nameTextStyle = (light: boolean): React.CSSProperties => light
  ? { color: '#3a2610', textShadow: '0 1px 0 rgba(255,248,230,0.7)' }
  : { color: '#f5deA0', textShadow: '0 1px 3px rgba(0,0,0,0.9)' };
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
  const lightBar = usesLightBar(cfg);
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
            style={{ fontFamily: "'Cinzel', serif", ...nameTextStyle(lightBar) }}
          >
            {card.name}
          </span>
        </div>

        <div className="absolute flex items-center justify-center" style={{ left: '83.5%', top: '9.3%', width: '8%', height: '4.5%' }}>
          <span className="font-black text-xs md:text-base" style={{ fontFamily: "'Cinzel', serif", ...(lightBar ? { color: '#3a2610', textShadow: '0 1px 0 rgba(255,248,230,0.7)' } : { color: '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }) }}>
            {card.cost}
          </span>
        </div>

        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '16%', top: '85.7%', width: '14%', height: '11%', transform: 'translate(-50%, -50%)' }}>
              <span className="font-black text-base md:text-xl" style={{ fontFamily: "'Cinzel', serif", color: STAT_TONE_COLOR[statsOf(card).atkTone] ?? '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
                {statsOf(card).atk}
              </span>
            </div>
            <div className="absolute flex items-center justify-center" style={{ left: '84%', top: '85.7%', width: '14%', height: '11%', transform: 'translate(-50%, -50%)' }}>
              <span className="font-black text-base md:text-xl" style={{ fontFamily: "'Cinzel', serif", color: STAT_TONE_COLOR[statsOf(card).hpTone] ?? '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
                {statsOf(card).hp}
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
              <span className="font-black text-base md:text-xl" style={{ fontFamily: "'Cinzel', serif", color: STAT_TONE_COLOR[statsOf(card).atkTone] ?? '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
                {statsOf(card).atk}
              </span>
            </div>
            <div className="absolute flex items-center justify-center" style={{ left: '89%', top: '88%', width: '20%', height: '12%', transform: 'translate(-50%, -50%)' }}>
              <span className="font-black text-base md:text-xl" style={{ fontFamily: "'Cinzel', serif", color: STAT_TONE_COLOR[statsOf(card).hpTone] ?? '#F5DEA0', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.85)' }}>
                {statsOf(card).hp}
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
  const trig = triggerOf(card.name);
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
              className={`${v.type} font-black uppercase tracking-widest truncate ${trig ? 'min-w-0' : 'w-full'} text-center`}
              style={{
                fontFamily: "'Cinzel', serif",
                color: card.cardType === 'Relíquia' ? '#6b3f00' : card.cardType === 'Terreno' ? '#17502a' : '#3a2408',
                textShadow: '0 1px 0 rgba(255,243,206,0.55)',
              }}
            >
              {card.cardType}
            </span>
            {/* Gatilho: ícone sem aro ao lado do tipo, no máximo da abertura da faixa (≈4,4% da altura da carta
                dentro de uma caixa de 7%): acima disso a moldura, que é desenhada por cima, corta o ícone. */}
            {trig && <TriggerIcon cardId={card.id} icon={trig.icon} trig={trig.key} style={{ height: '72%', aspectRatio: '1', marginLeft: '0.45em' }} />}
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
            lead={trig ? { label: trig.label, icon: trig.icon } : undefined}
            align="start"
            className={`${v.effect} text-[#0d0901] font-semibold text-left leading-tight`}
            style={{ fontFamily: "'Crimson Pro', serif" }}
          />
        </div>

        {/* ATK/HP — blade + heart emblems, only on the gold frame (see NO_STAT_TYPES) */}
        {showStats && (
          <>
            <div className="absolute flex items-center justify-center" style={{ left: '1%', bottom: '-2%', width: '20%', height: '13%' }}>
              <GoldNumber value={statsOf(card).atk} tone={statsOf(card).atkTone} className={v.combatStat} />
            </div>
            <div className="absolute flex items-center justify-center" style={{ right: '0%', bottom: '-2%', width: '20%', height: '13%' }}>
              <GoldNumber value={statsOf(card).hp} tone={statsOf(card).hpTone} className={v.combatStat} />
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
// Big hands (a match opens with 10-11 cards, up to HAND_LIMIT) overlap MORE instead of fanning
// out wider: the fan never gets wider than 7 cards' worth, so the cards stay a readable size.
const HAND_FULL_SPREAD_COUNT = 7;
// Tapping a hand card lifts it out of the fan and enlarges it so it can be read; the other cards stay on
// screen, and only those lying over it fade so the card shows through them.
const HAND_SELECT_SCALE = 1.65;
const handStepFor = (count: number) =>
  count <= HAND_FULL_SPREAD_COUNT ? HAND_CARD_STEP : (HAND_CARD_STEP * (HAND_FULL_SPREAD_COUNT - 1)) / (count - 1);

// ── Decks ────────────────────────────────────────────────────────────────────
// Every card's stats and rules text live in the engine's catalog (src/engine/catalog.ts) — the one
// place the rules read from, for the local game and for online play alike. The client only adds the
// artwork, looked up by card name.
const ART_BY_NAME: Record<string, string> = {
  "Comandante Aurelion, Mestre da Formação": comandanteAurelionFullArt,
  "Soldado Tático": soldadoTaticoArt,
  "Escudeiro de Linha": escudeiroDeLinhaArt,
  "Capitão de Formação": capitaoDeFormacaoFullArt,
  "Batedor": batedorArt,
  "Lanceiro de Controle": lanceiroDeControleArt,
  "Cavaleiro Tático": cavaleiroTaticoFullArt,
  "Veterano de Guerra": veteranoDeGuerraFullArt,
  "Reformar Linhas": reformarLinhasFullArt,
  "Avanço Coordenado": avancoCoordenadoArt,
  "Reposicionamento Rápido": reposicionamentoRapidoArt,
  "Linha Fechada": linhaFechadaArt,
  "Ordem de Retirada": ordemDeRetiradaArt,
  "Bloqueio Instantâneo": bloqueioInstantaneoArt,
  "Contra-Manobra": contraManobraFullArt,
  "Formação Quebrada": formacaoQuebradaArt,
  "Estandarte da Legião": estandarteDaLegiaoFullArt,
  "Fortaleza de Pedra": fortalezaDePedraFullArt,
  "Pântano Maldito": pantanoMalditoArt,
  "Cardeal Pedro, Voz da Fé": cardealPedroFullArt,
  "Cálice da Graça": caliceDaVidaFullArt,
  "Devotos da Cruzada": multidaoDeFieisArt,
  "Mercador da Cruzada": comercianteDasCruzadasArt,
  "Infiltrado da Ordem": espiaoSabotadorArt,
  "Fanático da Cruzada": soldadoFanaticoArt,
  "Recruta Devoto": recrutaDevotoArt,
  "Intendente do Exército": vigiaDeMantimentosArt,
  "Soldados da Ordem": infantariaTreinadaArt,
  "Jorge, Lança Sagrada": jorgeOLanceiroFullArt,
  "Cavaleiro Hospitalário": hospitalarioArt,
  "Nobre da Cruzada": nobreReligiosoFullArt,
  "Cavaleiro da Luz": cavaleiroDaLuzFullArt,
  "Comandante da Ordem": liderDeEsquadraoFullArt,
  "Arqueiro da Ordem": arqueiroProfissionalArt,
  "Atirador da Cruzada": atiradorInfluenteArt,
  "Trabuco de Cerco": trabucoDeCercoFullArt,
  "Catapulta de Guerra": catapultaDeGuerraArt,
  "Balestra de Precisão": balestraDePrecisaoArt,
  "Armadura de Guerra": armaduraDeGuerraArt,
  "Couraça Reforçada": couracaReforcadaArt,
  "Flechas Venenosas": flechasVenenosasArt,
  "Espada Longa": espadaLongaArt,
  "Reforços Ocultos": reforcosOcultosArt,
  "Retorno do Soldado": retornoDoSoldadoFullArt,
  "Graal da Dádiva": graalDaDadivaArt,
  "Doutrina Renovada": doutrinaRenovadaArt,
  "Recrutamento Seletivo": recrutamentoSeletivoArt,
  "Recrutar Veteranos": recrutarVeteranosArt,
  "Tributo de Guerra": tributoDeGuerraArt,
  "Chamado às Armas": chamadoAsArmasArt,
};

const cardDataFromName = (name: string, id: string): CardData => {
  const def = requireCardDef(name);
  return { id, name: def.name, atk: def.atk, hp: def.hp, cost: def.cost, art: ART_BY_NAME[name] ?? '', effect: def.effect, cardType: def.cardType, ...(def.isFullArt ? { isFullArt: true } : {}) };
};
const buildDeckCards = (deck: DeckId): CardData[] => {
  const recipe = DECK_RECIPES[deck];
  const cards: CardData[] = [cardDataFromName(recipe.general, `${deck}_general`)];
  Object.entries(recipe.cards).forEach(([name, n]) => {
    for (let i = 0; i < n; i++) cards.push(cardDataFromName(name, `${deck}_${name}_${i}`));
  });
  return cards;
};
const DECK_CAPITAO: CardData[] = buildDeckCards('capitao');
const DECK_CARDEAL: CardData[] = buildDeckCards('cardeal');

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
    description: 'Fé e ferro — cura, convocações e emboscadas sagradas.',
    general: DECK_CARDEAL.find(c => c.cardType === 'General')!,
    pool: DECK_CARDEAL.filter(c => c.cardType !== 'General'),
  },
} as const;

// ── Collection and saved decks (local-only for now) ─────────────────────────
// What the deck editor edits. The player owns a COLLECTION (card name -> copies) and builds
// DECKS out of it; whatever is owned but not in the deck is the reserve (never stored on
// its own, so a card can't get lost between the two). Everything is keyed by card NAME
// (every copy of a card shares its stats, same idea as BASE_HP_BY_NAME below) and the
// concrete CardData copies are only picked when a match starts (buildDeckSelection).
// Stored in localStorage like the profile, so an account backend can replace
// load/saveDeckStore without touching the screens. Until a shop/boosters exist, the first
// launch grants the Cardeal starter deck plus a random handful of Capitão cards, purely so
// the editor has something in its reserve to play with.
const DECK_STORE_KEY = 'pow_deck_store_v1';

const CARD_INSTANCES_BY_NAME: Record<string, CardData[]> = {};
[...DECK_CAPITAO, ...DECK_CARDEAL].forEach(c => {
  if (!CARD_INSTANCES_BY_NAME[c.name]) CARD_INSTANCES_BY_NAME[c.name] = [];
  CARD_INSTANCES_BY_NAME[c.name].push(c);
});
const cardByName = (name: string): CardData | undefined => CARD_INSTANCES_BY_NAME[name]?.[0];
const isGeneralName = (name: string) => cardByName(name)?.cardType === 'General';

type DeckSlot = { id: string; name: string; general: string; cards: Record<string, number> };
type DeckStore = { collection: Record<string, number>; slots: DeckSlot[]; owner?: string };
// What a match needs from a deck: the draw pool, the General, and which prebuilt deck the AI takes.
type DeckSelection = { cards: Record<string, number>; general: string; npcDeckId: DeckId; npcGeneral?: string };

// An online match, seen from this device. The server holds the real match; this device holds MY VIEW of it (the
// opponent's hand and every deck order removed). My own actions are applied to the view at once — so the screen
// answers instantly — and sent to the server; the view the server sends back replaces it. The opponent's actions
// (a person or the bot) arrive as ready-made steps: the events to show and the view after them.
type OnlineMatch = {
  init: MatchInit;
  lastSeen: number;
  // Steps of the opponent (a person or the bot) waiting to be played out on screen, in order.
  remote: ViewRow[];
  // The opponent's step being played out right now (taken from `remote`, committed by dispatchAction).
  cursor: ViewRow | null;
  // True while the presenter is waiting for the opponent's next step.
  waiting: boolean;
  // My sent actions waiting for their step; `optimistic` = already shown on screen when sent.
  ownQueue: { optimistic: boolean; done: (ok: boolean) => void }[];
  waiter: (() => void) | null;
  timer: number | null;
  sendChain: Promise<void>;
  // Bumped when the server refuses something: actions sent before that are dropped.
  epoch: number;
  stopped: boolean;
  finished: boolean;
  // The state of the last step that is on screen (what to go back to when the server refuses an action).
  confirmed: GameState | null;
  // The turn clock: when the player who has to move runs out of time (server time), and how far the server's clock is from ours.
  deadline: number | null;
  skew: number;
  beginRow: ViewRow | null;
  // Who goes first, once the toss winner's `choose_first` step is known (from my side: 'player' = me).
  pick: 'player' | 'npc' | null;
  lastTick: number;
  reward: RewardInfo | null;
};

// Actions whose result depends on what only the server knows (the deck, the opponent's hand): they are shown only
// once the server's step arrives, instead of being applied to the view at once.
const needsServer = (action: EngineAction, view: GameState): boolean => {
  const held = (id: string | null | undefined) => (id ? view.players[0].hand.find(h => h.id === id) : undefined);
  switch (action.type) {
    case 'attack': case 'concede': return true;   // the defender's hand decides whether an Emboscada answers
    case 'play': return needsHiddenInfo(verbsOn(held(action.cardId)?.name ?? '', 'play'));
    case 'ability': return needsHiddenInfo(verbsOn(view.players[0].board[action.slot]?.name ?? '', 'ability'));
    case 'ambush': return needsHiddenInfo(verbsOn(held(action.cardId)?.name ?? '', 'ambush'));
    default: return false;
  }
};
// What is on screen: used to tell whether the server's step changed anything the player can see.
const visibleKey = (s: GameState) => JSON.stringify([
  s.players.map((p, i) => [p.gold, i === 0 ? p.hand.map(c => c.id) : p.hand.length, p.board.map(c => (c ? `${c.id}:${c.atk}:${c.hp}` : '')), p.graveyard.map(c => c.id)]),
  s.turn.active, s.turn.phase, s.turn.round, s.winner,
]);

const countByName = (cards: readonly CardData[]) => {
  const out: Record<string, number> = {};
  cards.forEach(c => { out[c.name] = (out[c.name] ?? 0) + 1; });
  return out;
};

const CAPITAO_STARTER_NAME = 'Deck Capitão';
// Everybody starts with both prebuilt decks: the Cardeal list in slot 1 and the Capitão list in slot 2, each ready to play (the whole
// collection of both, so either can also be rebuilt).
const buildStarterStore = (): DeckStore => {
  const cardealCards = starterDeckCards('cardeal');
  const capitaoCards = starterDeckCards('capitao');
  const collection: Record<string, number> = {
    ...countByName(DECKS.cardeal.pool), [DECKS.cardeal.general.name]: 1,
  };
  Object.entries(DECK_RECIPES.capitao.cards).forEach(([name, n]) => { collection[name] = Math.max(collection[name] ?? 0, n); });
  collection[DECKS.capitao.general.name] = 1;
  return {
    collection,
    slots: [
      { id: 'slot1', name: DECKS.cardeal.name, general: DECKS.cardeal.general.name, cards: { ...cardealCards } },
      { id: 'slot2', name: CAPITAO_STARTER_NAME, general: DECKS.capitao.general.name, cards: { ...capitaoCards } },
    ],
  };
};
// Accounts and devices made before the Capitão deck was released: give them the whole Capitão collection and, when slot 2 is still empty,
// the ready Capitão deck in it (a slot the player has built on is never touched). Returns whether anything changed.
const ensureStarterDecks = (store: DeckStore): boolean => {
  let changed = false;
  Object.entries(DECK_RECIPES.capitao.cards).forEach(([name, n]) => {
    if ((store.collection[name] ?? 0) < n) { store.collection[name] = n; changed = true; }
  });
  if ((store.collection[DECKS.capitao.general.name] ?? 0) < 1) { store.collection[DECKS.capitao.general.name] = 1; changed = true; }
  const slot2 = store.slots[1];
  if (slot2 && Object.keys(slot2.cards).length === 0) {
    slot2.name = CAPITAO_STARTER_NAME; slot2.general = DECKS.capitao.general.name; slot2.cards = { ...starterDeckCards('capitao') };
    changed = true;
  }
  return changed;
};

// Drops anything the catalog no longer knows and clamps counts to what is owned, so a stale
// or hand-edited save can never produce an impossible deck.
const sanitizeDeckStore = (raw: any): DeckStore | null => {
  if (!raw || typeof raw !== 'object' || typeof raw.collection !== 'object' || !Array.isArray(raw.slots) || raw.slots.length < 2) return null;
  const collection: Record<string, number> = {};
  Object.entries(raw.collection as Record<string, number>).forEach(([name, n]) => {
    // Boosters can give more copies than the prebuilt decks hold, so the only cap is a sanity one.
    if (CARD_INSTANCES_BY_NAME[name] && Number.isFinite(n) && n > 0) collection[name] = Math.min(Math.floor(n), 999);
  });
  const ownedGenerals = Object.keys(collection).filter(isGeneralName);
  if (ownedGenerals.length === 0) return null;
  const slots: DeckSlot[] = raw.slots.slice(0, 2).map((sl: any, i: number): DeckSlot => {
    const cards: Record<string, number> = {};
    Object.entries((sl?.cards ?? {}) as Record<string, number>).forEach(([name, n]) => {
      const own = collection[name] ?? 0;
      if (own > 0 && !isGeneralName(name) && Number.isFinite(n) && n > 0) cards[name] = Math.min(Math.floor(n), own, DECK_MAX_COPIES);
    });
    return {
      id: `slot${i + 1}`,
      name: typeof sl?.name === 'string' && sl.name ? sl.name.slice(0, 24) : `Deck ${i + 1}`,
      general: ownedGenerals.includes(sl?.general) ? sl.general : ownedGenerals[0],
      cards,
    };
  });
  return { collection, slots, owner: typeof raw.owner === 'string' ? raw.owner : undefined };
};
const loadDeckStore = (): DeckStore => {
  try {
    const raw = localStorage.getItem(DECK_STORE_KEY);
    if (raw) {
      const ok = sanitizeDeckStore(JSON.parse(raw));
      if (ok) { if (ensureStarterDecks(ok)) saveDeckStore(ok); return ok; }
    }
  } catch { /* fall through to a fresh starter */ }
  const fresh = buildStarterStore();
  saveDeckStore(fresh);
  return fresh;
};
// Local copy first (instant, works offline); when a signed-in account is syncing, the same store is also
// pushed to the cloud a moment later (see syncDeckStoreWithCloud).
let cloudUserId: string | null = null;
let pushTimer: number | undefined;
let pushing = false;
let pushAgain = false;
const toCloudDecks = (store: DeckStore): CloudDeck[] => store.slots.map((sl, i) => ({ slot: i + 1, name: sl.name, general: sl.general, cards: sl.cards }));
const runPush = async () => {
  if (!cloudUserId) return;
  if (pushing) { pushAgain = true; return; }
  pushing = true;
  try {
    const store = loadDeckStore();
    const r = await pushStore(cloudUserId, { collection: store.collection, decks: toCloudDecks(store) });
    if (r.ok === false) { console.error('cloud save failed', r.message); window.clearTimeout(pushTimer); pushTimer = window.setTimeout(runPush, 8000); }
  } finally {
    pushing = false;
    if (pushAgain) { pushAgain = false; void runPush(); }
  }
};
const saveDeckStore = (store: DeckStore) => {
  if (cloudUserId) store.owner = cloudUserId;
  try { localStorage.setItem(DECK_STORE_KEY, JSON.stringify(store)); } catch { /* private mode etc. */ }
  if (cloudUserId) { window.clearTimeout(pushTimer); pushTimer = window.setTimeout(runPush, 700); }
};
const stopCloudSync = () => { cloudUserId = null; window.clearTimeout(pushTimer); };
// Pushes whatever is still waiting to be saved (the server reads the collection from the cloud to check a deck).
const flushCloudSync = async (): Promise<void> => {
  if (!cloudUserId) return;
  window.clearTimeout(pushTimer);
  const idle = async () => { for (let i = 0; i < 50 && pushing; i++) await new Promise(r => setTimeout(r, 100)); };
  await idle();
  await runPush();
  await idle();
};
// Called once after sign-in. The cloud copy wins when the account already has one. A brand-new account
// takes this device's store if nobody has claimed it yet (so what you built before accounts moves up),
// otherwise it starts from a fresh starter store. Resolves to an error message, or null.
const syncDeckStoreWithCloud = async (userId: string): Promise<string | null> => {
  const r = await fetchStore(userId);
  if (r.ok === false) return r.message;
  const { collection, decks } = r.data;
  if (Object.keys(collection).length > 0) {
    const slots = [1, 2].map(n => {
      const d = decks.find(x => x.slot === n);
      return { id: `slot${n}`, name: d?.name || `Deck ${n}`, general: d?.general || '', cards: d?.cards ?? {} };
    });
    const merged = sanitizeDeckStore({ collection, slots, owner: userId });
    if (merged) {
      const grew = ensureStarterDecks(merged);
      try { localStorage.setItem(DECK_STORE_KEY, JSON.stringify(merged)); } catch { /* ignore */ }
      cloudUserId = userId;
      if (grew) { const up = await pushStore(userId, { collection: merged.collection, decks: toCloudDecks(merged) }); if (up.ok === false) return up.message; }
      return null;
    }
  }
  const local = loadDeckStore();
  const base: DeckStore = local.owner === undefined || local.owner === userId ? local : buildStarterStore();
  base.owner = userId;
  try { localStorage.setItem(DECK_STORE_KEY, JSON.stringify(base)); } catch { /* ignore */ }
  const up = await pushStore(userId, { collection: base.collection, decks: toCloudDecks(base) });
  if (up.ok === false) return up.message;
  cloudUserId = userId;
  return null;
};

const deckCardCount = (slot: DeckSlot) => Object.values(slot.cards).reduce((a, b) => a + b, 0);
// null = playable; otherwise the reason it isn't (shown in the editor and the deck picker).
const deckProblem = (slot: DeckSlot): string | null => {
  const n = deckCardCount(slot);
  if (n < DECK_MIN_CARDS) return `Faltam ${DECK_MIN_CARDS - n} cartas (mínimo ${DECK_MIN_CARDS})`;
  if (n > DECK_MAX_CARDS) return `${n - DECK_MAX_CARDS} cartas a mais (máximo ${DECK_MAX_CARDS})`;
  return null;
};
const buildDeckSelection = (slot: DeckSlot): DeckSelection => {
  const general = cardByName(slot.general)?.name ?? DECKS.cardeal.general.name;
  // The AI plays the prebuilt deck of the OTHER faction, as before.
  const isCapitaoGeneral = general === DECKS.capitao.general.name;
  return { cards: { ...slot.cards }, general, npcDeckId: isCapitaoGeneral ? 'cardeal' : 'capitao' };
};
const DEFAULT_DECK_SELECTION: DeckSelection = { cards: countByName(DECKS.capitao.pool), general: DECKS.capitao.general.name, npcDeckId: 'cardeal' };

// ── Player profile (local-only for now) ─────────────────────────────────────
// No account/backend yet (see the user's own multiplayer/Supabase roadmap) — this
// is deliberately built as a self-contained local-storage-backed system so the
// main menu's UI, avatar picker, and Coroas balance are all already real and
// working. Swapping this for a Supabase-backed profile later means replacing
// loadProfile/saveProfile's storage, not touching any of the UI built against
// PlayerProfile's shape.
type PlayerProfile = {
  name: string;
  avatarId: string;
  coroas: number;
  rank: string;
  // false until the player has picked a name and avatar on the first-run profile screen.
  nameSet: boolean;
  level: number;
  xp: number;
  xpToNext: number;
};

// The avatar gallery: illustrated portraits (art-prompts/README.md 4n) picked in
// AvatarPickerModal. A profile only stores the id, so adding the other prompts'
// avatars later is just more entries here.
const AVATAR_OPTIONS: { id: string; image: string }[] = [
  { id: 'batedora', image: avatar01Image },
  { id: 'escudeiro', image: avatar02Image },
  { id: 'arqueiro', image: avatar04Image },
  { id: 'clerigo', image: avatar05Image },
  { id: 'soldado', image: avatar06Image },
  { id: 'cacadora', image: avatar07Image },
];
const avatarById = (id: string) => AVATAR_OPTIONS.find(a => a.id === id) ?? AVATAR_OPTIONS[0];

const PROFILE_STORAGE_KEY = 'pow_player_profile_v1';
const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Comandante',
  avatarId: AVATAR_OPTIONS[0].id,
  coroas: 150,
  rank: 'Recruta I',
  nameSet: false,
  level: 1,
  xp: 0,
  xpToNext: 100,
};
// Every read/write goes through these two — a private/blocked-storage browser
// (see the install-prompt code elsewhere for the same defensive pattern) just
// falls back to an in-memory default instead of throwing.
const loadProfile = (): PlayerProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const stored = { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    if (!AVATAR_OPTIONS.some(a => a.id === stored.avatarId)) stored.avatarId = DEFAULT_PROFILE.avatarId;
    // Old builds started everyone at level 3 with some XP; nobody has earned any yet, so reset that.
    if (stored.level === 3 && stored.xp === 35) { stored.level = 1; stored.xp = 0; }
    return stored;
  } catch {
    return { ...DEFAULT_PROFILE };
  }
};
// Keeps the Coroas pill short: full number up to 99.999, then "123 mil" / "1,2 mi".
const formatCoroas = (n: number) => {
  if (n < 100000) return n.toLocaleString('pt-BR');
  if (n < 1000000) return `${Math.floor(n / 1000)} mil`;
  return `${(Math.floor(n / 100000) / 10).toLocaleString('pt-BR')} mi`;
};
const saveProfile = (profile: PlayerProfile) => {
  try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile)); } catch { /* private mode etc. */ }
};

// Display-only Portuguese labels for the main menu buttons — the mode strings
// themselves ('Campaign' etc.) stay in English since they're also used as
// identifiers (onSelectMode), not just display text. The old "Partida Rápida"
// button is gone: Desafios now covers playing against the AI (see the
// onSelectMode handler in App).
const MODE_LABELS_PT: Record<string, string> = {
  'Campaign': 'Desafios',
  'Multiplayer': 'Online',
  'My Deck': 'Meu Deck',
};

// The circular avatar badge itself — used both in the main menu's profile bar
// (small) and inside the picker modal (bigger, one per option) so the exact
// look never drifts between the two. The portraits are square, cropped to the
// circle here.
const AvatarBadge = ({ avatarId, size = 48, bare = false }: { avatarId: string; size?: number | string; bare?: boolean }) => {
  const a = avatarById(avatarId);
  const box = typeof size === 'number' ? `${size}px` : size;
  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 bg-black ${bare ? '' : 'border-2 border-[#e8c766]'}`}
      style={{ width: box, height: box, boxShadow: bare ? undefined : 'inset 0 0 0 1px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.5)' }}
    >
      <img src={a.image} alt="" draggable={false} className="w-full h-full object-cover select-none pointer-events-none" />
    </div>
  );
};

// ---- Shared window layout ------------------------------------------------------
// Every window/popup in the menu (Online, avatars, "coming soon", deck picker, install
// prompt) uses this one look: the ornate square frame (ui-window-frame, drawn as a CSS
// 9-slice — the four corner flourishes keep their size, the thin straight lines stretch)
// around a dark panel filled with the embossed-leather texture (ui-window-texture, a
// seamless tile, shown at 400px so each stitched panel reads about 100px wide) under a
// soft warm highlight. Change the fill here and every window follows.
const WINDOW_FRAME_PX = 28;
const WINDOW_FONT_DECO = "'Cinzel Decorative', 'Cinzel', serif";

const FramedWindow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={className}
    style={{
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderWidth: WINDOW_FRAME_PX,
      borderImageSource: `url(${uiWindowFrameImage})`,
      borderImageSlice: '90',
      borderImageWidth: `${WINDOW_FRAME_PX}px`,
      borderImageRepeat: 'stretch',
      backgroundColor: '#150e08',
      backgroundImage: `radial-gradient(ellipse at 50% 25%, rgba(150,100,40,0.28), rgba(150,100,40,0) 70%), url(${uiWindowTextureImage})`,
      backgroundSize: '100% 100%, 400px 400px',
      backgroundRepeat: 'no-repeat, repeat',
      backgroundOrigin: 'border-box',
      backgroundClip: 'border-box',
      filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.7))',
    }}
  >
    {children}
  </div>
);

// Dimmed backdrop + centered FramedWindow; `onClose` is called on a tap outside.
const WindowOverlay = ({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 pointer-events-auto"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.92, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.92, y: 20 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm"
    >
      {children}
    </motion.div>
  </motion.div>
);

// Thin ornamental rule: two fading gold lines around a small diamond. Drawn in CSS for
// now; the divider art prompt in art-prompts/README.md (4o) can replace it later.
const WindowDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-2 w-4/5 mx-auto ${className}`} aria-hidden>
    <span className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(232,199,102,0.75))' }} />
    <span className="w-1.5 h-1.5 rotate-45 bg-[#e8c766] shadow-[0_0_6px_rgba(232,199,102,0.7)]" />
    <span className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(232,199,102,0.75))' }} />
  </div>
);

const WindowTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <h2
      className="text-center uppercase text-[#f3e3c3]"
      style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', textShadow: '0 2px 3px rgba(0,0,0,0.95)' }}
    >
      {children}
    </h2>
    <WindowDivider />
  </div>
);

// ThinFrame / GameBox / GameButton (the thin gold-line frame and what is built from it) live in src/ui/ThinFrame.tsx.

// A 9-slice frame drawn on its own layer, so the content on top is never pushed inwards by
// the border. `slice` is in the source image's pixels and `width` is the CSS size each edge
// is drawn at — pass width = slice x (rendered height / source height) to keep the art's
// proportions (sockets stay round, corners stay square).
type Edges = [number, number, number, number];
const ArtFrame = ({ src, slice, width, className = '', style, children }: {
  src: string; slice: Edges; width: Edges; className?: string; style?: React.CSSProperties; children?: React.ReactNode; key?: React.Key;
}) => (
  <div className={className} style={style}>
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderWidth: width.map(w => `${w}px`).join(' '),
        borderImageSource: `url(${src})`,
        borderImageSlice: slice.join(' '),
        borderImageWidth: width.map(w => `${w}px`).join(' '),
        borderImageRepeat: 'stretch',
      }}
    />
    {children}
  </div>
);

const VLine = ({ className = '' }: { className?: string }) => (
  <span aria-hidden className={`absolute left-0 top-[7px] bottom-[7px] w-[3px] pointer-events-none ${className}`} style={{ backgroundImage: `url(${uiLineVImage})`, backgroundSize: '100% 100%' }} />
);
const HLine = ({ className = '' }: { className?: string }) => (
  <span aria-hidden className={`absolute inset-x-0 bottom-0 h-[3px] pointer-events-none ${className}`} style={{ backgroundImage: `url(${uiLineHImage})`, backgroundSize: '100% 100%' }} />
);

// Small pill button drawn with the tab art (bright when selected, dim when not).
const ArtChip = ({ active, onClick, children, className = '', compact = false }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string; compact?: boolean; key?: React.Key }) => (
  <button onClick={() => { playUiClickSfx(); onClick(); }} className={`relative h-[34px] active:scale-95 transition ${className}`}>
    <ArtFrame
      src={active ? uiEditorTabOnImage : uiEditorTabOffImage}
      slice={[44, 44, 44, 44]}
      width={[11, 11, 11, 11]}
      className="absolute inset-0"
      style={{ background: active ? 'rgba(96,68,16,0.6)' : 'rgba(0,0,0,0.4)' }}
    />
    <span className={`relative block ${compact ? 'px-2.5' : 'px-4'} uppercase tracking-[0.1em] text-[11px] whitespace-nowrap ${active ? 'text-[#fff1c9]' : 'text-[#a89a78]'}`} style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>{children}</span>
  </button>
);

// A selectable row inside a window (deck choice, Casual/Ranqueado): an engraved inset
// with a soft top highlight and a gold accent on the left instead of a boxed outline.
const WindowOption = ({ children, onClick }: { children: React.ReactNode; onClick: () => void; key?: React.Key }) => (
  <button onClick={() => { playUiClickSfx(); onClick(); }} className="block w-full text-left active:brightness-125 active:scale-[0.98] transition">
    <ThinFrame px={13} style={{ background: 'linear-gradient(to right, rgba(74,48,20,0.5), rgba(24,15,7,0.5))', }}>
      <div className="px-2 py-1">{children}</div>
    </ThinFrame>
  </button>
);

const WindowText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-center text-[13px] leading-snug text-[#dccfae]" style={{ fontFamily: "'PT Serif', serif" }}>{children}</p>
);

const WindowButton = ({ children, onClick, primary = false, className = '' }: { children: React.ReactNode; onClick: () => void; primary?: boolean; className?: string }) => (
  <button onClick={() => { playUiClickSfx(); onClick(); }} className={`active:scale-95 active:brightness-125 transition ${className}`}>
    <ThinFrame px={11} style={{ background: primary ? 'rgba(122,90,22,0.55)' : 'rgba(20,13,6,0.45)', }}>
      <span
        className="block px-4 py-0.5 text-xs uppercase tracking-[0.12em] text-[#f0e0bb]"
        style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
      >
        {children}
      </span>
    </ThinFrame>
  </button>
);

// Local gallery picker — same modal-overlay pattern as InstallPrompt/
// DeckPickerModal elsewhere in this file.
const AvatarPickerModal = ({ current, onSelect, onClose }: {
  current: string; onSelect: (id: string) => void; onClose: () => void;
}) => (
  <WindowOverlay onClose={onClose}>
    <FramedWindow>
      <div className="flex flex-col items-center gap-4 px-2 py-2">
        <WindowTitle>Escolha seu Avatar</WindowTitle>
        <div className="grid grid-cols-3 gap-4">
          {AVATAR_OPTIONS.map(a => (
            <button
              key={a.id}
              onClick={() => { playUiClickSfx(); onSelect(a.id); }}
              className="relative active:scale-95 transition-transform"
            >
              <AvatarBadge avatarId={a.id} size={72} />
              {a.id === current && (
                <div className="absolute -inset-1 rounded-full border-2 border-emerald-400" />
              )}
            </button>
          ))}
        </div>
        <WindowButton onClick={onClose}>Fechar</WindowButton>
      </div>
    </FramedWindow>
  </WindowOverlay>
);

// The top profile bar — avatar (tap opens AvatarPickerModal), editable name,
// a static rank badge (no ranked system yet, see the user's own roadmap; this
// is just the slot it'll live in), and the Coroas balance. Coroas is the
// meta-progression currency spent on boosters/events OUTSIDE a match — kept
// visually distinct from in-match Ouro (a crown badge, not the round gold-coin
// hud-gold-badge used on the board) specifically so the two are never confused.
// Entirely local-storage-backed for now (see loadProfile/saveProfile) — no
// account system yet, but the UI itself is the real thing already.
// Renaming from the profile plate is switched off on purpose: a rename will come back later as a
// regulated option (for example, paid in Coroas). The rename logic (MainMenu.renameProfile) stays.
const ALLOW_PROFILE_RENAME = false;
const ProfileBar = ({ profile, onChange, onRename, onOpenAvatarPicker, onOpenShop }: {
  profile: PlayerProfile;
  onChange: (patch: Partial<PlayerProfile>) => void;
  onRename: (name: string) => void;
  onOpenAvatarPicker: () => void;
  onOpenShop: () => void;
}) => {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setNameDraft(profile.name);
    setEditingName(true);
  };
  const commitName = () => {
    const trimmed = nameDraft.trim().slice(0, 16);
    if (trimmed) onRename(trimmed);
    setEditingName(false);
  };

  useEffect(() => {
    if (editingName) inputRef.current?.select();
  }, [editingName]);

  const xpPct = Math.min(100, Math.round((profile.xp / Math.max(1, profile.xpToNext)) * 100));

  // Both containers below are thin gold-line cut-outs (ui-profile-plate / ui-pill-coroas)
  // whose enclosed areas were pre-filled dark in the art. Each is a container-query box
  // and everything inside is placed as a % of the art and sized in cqw, so it scales with
  // the plate's own width. Measured off the plate art (1740x454): avatar recess centre
  // (16.6%, 50%), 22.4% wide; level shield centre (26.8%, 82.3%); name field x 31-93%,
  // y 19-58%; XP track x 33-94%, y 68-76%. Coroas pill (1240x376): medallion socket
  // centred at (15%, 46.8%) — the pill art was shortened by cutting out its straight middle,
  // hence 1240 wide — value area to its right.
  return (
    <div
      className="absolute top-0 inset-x-0 z-20 px-3 pb-3"
      style={{ paddingTop: 'max(10px, env(safe-area-inset-top))', background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)', containerType: 'inline-size' }}
    >
      {/* Profile plate and Coroas pill share one height H (art aspect ratios 1740/454 and 1240/376),
          the tallest that fits both side by side, capped at 50px. */}
      <div className="flex items-center justify-between gap-2" style={{ ['--h' as any]: 'min(50px, calc((100cqw - 32px) / 7.131))' }}>
      <div className="relative shrink-0" style={{ width: 'calc(var(--h) * 3.8326)', aspectRatio: '1740 / 454', containerType: 'inline-size' }}>
        <img src={uiProfilePlateImage} alt="" draggable={false} className="absolute inset-0 w-full h-full select-none pointer-events-none" style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.55))' }} />
        {/* The avatar sits in the ring's recess (centre 16.6% / 50.7% of the plate) and is cut around
            the level shield, so the shield always draws on top of it instead of being half covered. */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <clipPath id="avatar-clip" clipPathUnits="objectBoundingBox">
              <path clipRule="evenodd" d="M0 0H1V1H0Z M0.22818 0.69338 L0.26818 0.65157 L0.30636 0.69338 L0.30636 0.82230 L0.29455 0.92683 L0.26818 1.00348 L0.24182 0.92683 L0.22818 0.82230 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="absolute inset-0 pointer-events-none" style={{ clipPath: 'url(#avatar-clip)' }}>
          <button
            onClick={() => { playUiClickSfx(); onOpenAvatarPicker(); }}
            className="absolute pointer-events-auto"
            style={{ left: '16.6%', top: '50.7%', width: '22.2cqw', height: '22.2cqw', transform: 'translate(-50%, -50%)' }}
            aria-label="Escolher avatar"
          >
            <AvatarBadge avatarId={profile.avatarId} size="22.2cqw" bare />
          </button>
        </div>
        <span
          className="absolute flex items-center justify-center font-black text-[#f8ecd0] leading-none"
          style={{ left: '26.8%', top: '82.3%', width: '6cqw', height: '6cqw', transform: 'translate(-50%, -50%)', fontFamily: "'Cinzel', serif", fontSize: '5cqw', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
        >
          {profile.level}
        </span>
        <div className="absolute flex items-center gap-[1.5cqw] min-w-0" style={{ left: '36%', top: '22%', width: '57%', height: '34%' }}>
          {editingName ? (
            <input
              ref={inputRef}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingName(false); }}
              maxLength={16}
              autoFocus
              className="bg-black/50 border border-[#e8c766]/70 rounded px-1 font-bold text-[#f3e3c3] w-[60%] outline-none"
              style={{ fontFamily: "'Cinzel', serif", fontSize: '5.4cqw', lineHeight: 1.2 }}
            />
          ) : (
            <button onClick={() => { if (!ALLOW_PROFILE_RENAME) return; playUiClickSfx(); startEditing(); }} className={`flex items-center gap-[1cqw] min-w-0 text-left ${ALLOW_PROFILE_RENAME ? '' : 'cursor-default'}`}>
              <span className="truncate font-bold text-[#f8ecd0]" style={{ fontFamily: "'Cinzel', serif", fontSize: '5.6cqw', lineHeight: 1, textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{profile.name}</span>
            </button>
          )}
        </div>
        {/* Cosmetic for now — no XP is actually awarded anywhere yet, same
            "real UI, no data feeding it yet" tier as Coroas/rank above. */}
        <div className="absolute rounded-full overflow-hidden" style={{ left: '33.3%', top: '68.3%', width: '60.5%', height: '7.4%' }}>
          <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#f3e3c3]" style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      <div className="relative shrink-0" style={{ width: 'calc(var(--h) * 3.2979)', aspectRatio: '1240 / 376', containerType: 'inline-size' }}>
        <img src={uiPillCoroasImage} alt="" draggable={false} className="absolute inset-0 w-full h-full select-none pointer-events-none" />
        <img src={uiIconCoroaImage} alt="" draggable={false} className="absolute select-none pointer-events-none object-contain" style={{ left: '15%', top: '46.8%', width: '17cqw', height: '17cqw', transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
        <div className="absolute flex items-center" style={{ left: '29%', right: '7%', top: '22%', bottom: '22%' }}>
          <span className="flex-1 text-center font-black text-[#f8ecd0]" style={{ fontFamily: "'Cinzel', serif", fontSize: '10cqw', lineHeight: 1, textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}>{formatCoroas(profile.coroas)}</span>
          <button
            onClick={() => { playUiClickSfx(); onOpenShop(); }}
            className="shrink-0 active:scale-90 transition-transform"
            style={{ width: '15cqw', height: '15cqw' }}
            aria-label="Comprar Coroas"
          >
            <img src={uiIconMaisImage} alt="" draggable={false} className="w-full h-full object-contain select-none pointer-events-none" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

// A lightweight stub for menu destinations that don't exist yet (shop,
// settings, tutorials, ranking) — same modal shell as AvatarPickerModal/
// InstallPrompt, just a title/message and a close button. Keeps the bottom
// icon row and the Coroas "+" button honest about what's real right now
// instead of silently doing nothing when tapped.
const ComingSoonModal = ({ title, message, onClose }: { title: string; message: string; onClose: () => void }) => (
  <WindowOverlay onClose={onClose}>
    <FramedWindow>
      <div className="flex flex-col items-center gap-3 px-2 py-2">
        <WindowTitle>{title}</WindowTitle>
        <WindowText>{message}</WindowText>
        <WindowButton onClick={onClose}>Fechar</WindowButton>
      </div>
    </FramedWindow>
  </WindowOverlay>
);

// The Online button's window: pick Casual or Ranqueado. Neither has a backend yet
// (accounts/matchmaking are the future Supabase work), so choosing one hands off to
// ComingSoonModal with its own message — but the choice itself is the real UI.
// Drawn with the shared FramedWindow, with the bronze plaque behind each option's icon.
const ONLINE_MODES: { id: 'casual' | 'ranked'; title: string; desc: string; icon: string }[] = [
  { id: 'casual', title: 'Casual', desc: 'Partidas amistosas, sem pontos em jogo.', icon: uiIconDesafiosImage },
  { id: 'ranked', title: 'Ranqueado', desc: 'Suba de rank e ganhe recompensas.', icon: uiIconRankingImage },
];
const OnlineModeModal = ({ onPick, onClose }: { onPick: (mode: 'casual' | 'ranked') => void; onClose: () => void }) => (
  <WindowOverlay onClose={onClose}>
    <FramedWindow>
      <div className="flex flex-col gap-3 px-1 py-1">
        <WindowTitle>Online</WindowTitle>
        {ONLINE_MODES.map(m => (
          <WindowOption key={m.id} onClick={() => onPick(m.id)}>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <img src={uiIconButtonImage} alt="" className="absolute inset-0 w-full h-full select-none" draggable={false} />
                <img src={m.icon} alt="" className="absolute left-1/2 top-1/2 w-[62%] h-[62%] -translate-x-1/2 -translate-y-1/2 object-contain select-none" style={{ filter: 'brightness(1.2) saturate(1.1)' }} draggable={false} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="uppercase text-[#f3e3c3]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em' }}>{m.title}</span>
                <span className="text-[11px] leading-tight text-[#cdbd97]" style={{ fontFamily: "'PT Serif', serif" }}>{m.desc}</span>
              </div>
            </div>
          </WindowOption>
        ))}
        <WindowButton onClick={onClose} className="self-center">Voltar</WindowButton>
      </div>
    </FramedWindow>
  </WindowOverlay>
);

// The image-card mode buttons: banner art under a thin bronze frame (the second
// round of frame art, ui-frame-menu-card — a slim rim with ornate corner brackets
// and a transparent window), with a drawn icon and the title on the left, where the
// art briefs (art-prompts/README.md) leave the scene dark on purpose. The card keeps
// the frame's own 1600:397 ratio so neither image is ever stretched, and the frame
// covers the art's outer edge, so the art just fills the whole card behind it.
// `icon` is the URL of one of the ui-icon-* cut-outs.
// Tap feedback shared by every main-menu button, in three beats:
//  1. touch     — the button sinks a little (98%), the frame flashes gold, the icon glows;
//  2. confirm   — for ~230ms the button stays brighter (and, on the big cards, a spark of
//                 gold runs along the frame);
//  3. transition — only then is the real action run (the target window fades in fast).
// Taps during the confirm beat are ignored so a double tap cannot fire the action twice.
type TapPhase = 'idle' | 'pressed' | 'confirm';
const MENU_CONFIRM_MS = 230;
const useMenuTap = (onActivate: () => void) => {
  const [phase, setPhase] = useState<TapPhase>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const busy = phase === 'confirm';
  const release = () => { if (!busy) setPhase('idle'); };
  return {
    phase,
    handlers: {
      onPointerDown: () => { if (!busy) setPhase('pressed'); },
      onPointerUp: release,
      onPointerLeave: release,
      onPointerCancel: release,
      onClick: () => {
        if (busy) return;
        playUiClickSfx();
        setPhase('confirm');
        timer.current = window.setTimeout(() => { setPhase('idle'); onActivate(); }, MENU_CONFIRM_MS);
      },
    },
  };
};

// Two sparks leave the top-left corner and race around the frame in opposite directions,
// meeting at the bottom-right (each covers half of the perimeter, which is why the leg
// times are split by the card's own edge lengths: about 80% along the long edge, 20% down
// the short one).
const FrameSparks = () => {
  const spark = 'absolute w-[5px] h-[5px] -ml-[2.5px] -mt-[2.5px] rounded-full bg-[#fff3c4]';
  const glow = { boxShadow: '0 0 7px 3px rgba(255,196,70,0.95)' };
  return (
    <div className="absolute inset-[1.5%] pointer-events-none">
      <motion.span
        className={spark} style={glow}
        initial={{ left: '0%', top: '0%', opacity: 0 }}
        animate={{ left: ['0%', '100%', '100%'], top: ['0%', '0%', '100%'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.26, times: [0, 0.8, 1], ease: 'linear' }}
      />
      <motion.span
        className={spark} style={glow}
        initial={{ left: '0%', top: '0%', opacity: 0 }}
        animate={{ left: ['0%', '0%', '100%'], top: ['0%', '100%', '100%'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.26, times: [0, 0.2, 1], ease: 'linear' }}
      />
    </div>
  );
};

// The image-card mode buttons: banner art under a thin bronze frame, with a drawn icon and
// the title on the left (the art briefs in art-prompts/README.md leave that side dark on
// purpose). The card keeps the frame's own 1600:397 ratio so neither image is stretched.
// `icon` is the URL of one of the ui-icon-* cut-outs.
const MenuCard = ({ icon, title, bgImage, onClick }: {
  icon: string; title: string; bgImage: string; onClick: () => void;
}) => {
  const { phase, handlers } = useMenuTap(onClick);
  const lit = phase !== 'idle';
  return (
    <motion.button
      {...handlers}
      animate={{ scale: lit ? 0.98 : 1 }}
      transition={{ duration: 0.09 }}
      className="relative w-full text-left"
      style={{ aspectRatio: '810 / 183', containerType: 'inline-size', filter: 'drop-shadow(0 5px 7px rgba(0,0,0,0.55))' }}
    >
      <div className="absolute inset-0" style={{ filter: phase === 'confirm' ? 'brightness(1.22) saturate(1.1)' : 'none', transition: 'filter 90ms' }}>
        <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.78), rgba(0,0,0,0.4) 45%, transparent 75%)' }} />
      </div>
      <img src={uiFrameMenuCardImage} alt="" className="absolute inset-0 w-full h-full pointer-events-none select-none" draggable={false} />
      {/* Same frame drawn again, lit up gold — fades in on touch and stays through the confirm beat. */}
      <img
        src={uiFrameMenuCardImage}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        draggable={false}
        style={{
          opacity: lit ? 1 : 0,
          transition: 'opacity 80ms',
          filter: 'brightness(1.9) saturate(2) sepia(0.35) drop-shadow(0 0 5px rgba(255,205,90,0.95))',
        }}
      />
      <div className="absolute inset-0 flex items-center gap-[2.5cqw]" style={{ paddingLeft: '7%', paddingRight: '5%' }}>
        <img
          src={icon}
          alt=""
          className="shrink-0 object-contain select-none pointer-events-none"
          style={{
            width: '10.5cqw', height: '10.5cqw',
            filter: lit ? 'brightness(1.3) drop-shadow(0 0 7px rgba(255,205,90,0.95))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.7))',
            transition: 'filter 100ms',
          }}
          draggable={false}
        />
        <span
          className="min-w-0 uppercase text-[#f3e3c3]"
          style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif", fontWeight: 700, fontSize: 'clamp(12px, 5cqw, 15px)', letterSpacing: '0.09em', lineHeight: 1.1, textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.7)' }}
        >
          {title}
        </span>
      </div>
      {phase === 'confirm' && <FrameSparks />}
    </motion.button>
  );
};

// Small secondary destinations row (settings/tutorials/ranking/sound) — none
// of these screens exist yet, so every one opens ComingSoonModal for now (see
// MainMenu). Same tap feedback as the cards minus the sparks: it sinks, the plaque
// flashes gold, the icon glows, and the window opens after the confirm beat.
const MenuIconButton = ({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) => {
  const { phase, handlers } = useMenuTap(onClick);
  const lit = phase !== 'idle';
  return (
    <motion.button {...handlers} animate={{ scale: lit ? 0.96 : 1 }} transition={{ duration: 0.09 }} className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14 drop-shadow-[0_3px_4px_rgba(0,0,0,0.6)]">
        <img src={uiIconButtonImage} alt="" className="absolute inset-0 w-full h-full select-none" draggable={false} />
        <img
          src={uiIconButtonImage}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full select-none pointer-events-none"
          draggable={false}
          style={{ opacity: lit ? 1 : 0, transition: 'opacity 80ms', filter: 'brightness(1.8) saturate(2) sepia(0.35) drop-shadow(0 0 5px rgba(255,205,90,0.95))' }}
        />
        <img
          src={icon}
          alt=""
          className="absolute left-1/2 top-1/2 w-[64%] h-[64%] -translate-x-1/2 -translate-y-1/2 object-contain select-none"
          style={{
            filter: lit ? 'brightness(1.4) saturate(1.1) drop-shadow(0 0 7px rgba(255,205,90,0.95))' : 'brightness(1.2) saturate(1.1) drop-shadow(0 1px 1px rgba(0,0,0,0.7))',
            transition: 'filter 100ms',
          }}
          draggable={false}
        />
      </div>
      <span className="text-[9px] uppercase tracking-[0.12em] font-bold text-[#f0e0bb]" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 1px 2px rgba(0,0,0,0.95)' }}>{label}</span>
    </motion.button>
  );
};

const MainMenu = ({ onSelectMode, onTutorials, session }: { onSelectMode: (mode: string) => void; onTutorials: () => void; session: Session | null }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [-500, 500], [-8, 8]);
  const bgY = useTransform(mouseY, [-500, 500], [-8, 8]);
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState<{ title: string; message: string } | null>(null);
  const [onlineOpen, setOnlineOpen] = useState(false);
  const [deckEditorOpen, setDeckEditorOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundOpen, setSoundOpen] = useState(false);
  const updateProfile = (patch: Partial<PlayerProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...patch };
      saveProfile(next);
      return next;
    });
    // The avatar is mirrored to the account (a failed sync is only logged; the local one is what shows).
    if (authMode === 'supabase' && session && patch.avatarId) void updateProfileFields(session.userId, { avatar_id: patch.avatarId });
  };
  // Renaming with real accounts has to be accepted by the server first (names are unique).
  const renameProfile = async (raw: string) => {
    const name = raw.trim().replace(/\s+/g, ' ');
    if (!NAME_RULE.test(name)) { setComingSoon({ title: 'Nome inválido', message: 'Use de 3 a 16 letras, números, espaço, _ . ou -' }); return; }
    if (name === profile.name) return;
    if (authMode === 'supabase' && session) {
      const r = await updateProfileFields(session.userId, { username: name });
      if (r.ok === false) { setComingSoon({ title: 'Não foi possível trocar o nome', message: r.message }); return; }
    }
    updateProfile({ name });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseMove={(e) => {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
      }}
      // Content starts right under the profile bar instead of floating in the middle
      // of the screen: with four compact buttons the whole stack is shorter than it
      // used to be, and centering it pushed the logo back down (the user has asked
      // twice for it to sit higher). The leftover space ends up above the icon row.
      style={{ paddingTop: 'calc(max(10px, env(safe-area-inset-top)) + 78px)' }}
      className="flex flex-col items-center justify-start w-full h-full bg-zinc-950 text-white relative overflow-hidden"
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

      <ProfileBar
        profile={profile}
        onChange={updateProfile}
        onRename={renameProfile}
        onOpenAvatarPicker={() => setAvatarPickerOpen(true)}
        onOpenShop={() => setComingSoon({ title: 'Loja de Coroas', message: 'Em breve você vai poder comprar Coroas aqui para trocar por boosters e eventos.' })}
      />
      <AnimatePresence>
        {avatarPickerOpen && (
          <AvatarPickerModal
            current={profile.avatarId}
            onSelect={(id) => { updateProfile({ avatarId: id }); setAvatarPickerOpen(false); }}
            onClose={() => setAvatarPickerOpen(false)}
          />
        )}
        {deckEditorOpen && <DeckEditor onClose={() => setDeckEditorOpen(false)} />}
        {settingsOpen && <SettingsModal session={session} profileName={profile.name} onClose={() => setSettingsOpen(false)} />}
        {soundOpen && <OptionsModal onClose={() => setSoundOpen(false)} />}
        {shopOpen && <ShopScreen coroas={profile.coroas} onSpend={(n) => updateProfile({ coroas: Math.max(0, profile.coroas - n) })} onClose={() => setShopOpen(false)} />}
        {onlineOpen && (
          <OnlineModeModal
            onClose={() => setOnlineOpen(false)}
            onPick={(mode) => {
              setOnlineOpen(false);
              if (mode === 'casual') { onSelectMode('OnlineCasual'); return; }
              setComingSoon({ title: 'Online Ranqueado', message: 'O sistema de partidas ranqueadas ainda está por vir.' });
            }}
          />
        )}
        {comingSoon && (
          <ComingSoonModal
            title={comingSoon.title}
            message={comingSoon.message}
            onClose={() => setComingSoon(null)}
          />
        )}
      </AnimatePresence>

      {/* No logo here: it moves to the login / create-account screen that will come
          before this menu once accounts exist (the user's call — after logging in, the
          menu is just the profile bar and the buttons). logo-price-of-war.webp stays
          in the project, and the loading screen still shows it. */}
      <div className="flex flex-col gap-2.5 relative z-10 w-[68vw] max-w-[270px] mt-auto mb-[104px]">
        {/* Four equal buttons, in the user's own order: Desafios first (the
            Hearthstone-style NPC ladder it will become — for now it just opens the
            deck picker and starts a match against the AI, the only mode whose
            opponent actually plays), then Online, Meu Deck and Loja. The old
            Partida Rápida button is gone on purpose. Online opens the
            Casual/Ranqueado picker (OnlineModeModal), Meu Deck the deck editor; Loja has
            no screen yet, so it opens ComingSoonModal instead of starting
            a match with a dead opponent. The mode identifiers ('Campaign' etc.)
            stay in English; only the label shown is translated. */}
        <MenuCard
          icon={uiIconDesafiosImage}
          title={MODE_LABELS_PT['Campaign']}
          bgImage={menuCardDesafiosImage}
          onClick={() => onSelectMode('Campaign')}
        />
        <MenuCard
          icon={uiIconOnlineImage}
          title={MODE_LABELS_PT['Multiplayer']}
          bgImage={menuCardOnlineImage}
          onClick={() => setOnlineOpen(true)}
        />
        <MenuCard
          icon={uiIconEditarDeckImage}
          title={MODE_LABELS_PT['My Deck']}
          bgImage={menuCardEditarDeckImage}
          onClick={() => setDeckEditorOpen(true)}
        />
        <MenuCard
          icon={uiIconLojaImage}
          title="Loja"
          bgImage={menuCardLojaImage}
          onClick={() => setShopOpen(true)}
        />
      </div>

      {/* Secondary destinations — none of these screens exist yet (see
          ComingSoonModal), just the slots the reference mockup reserves for them. */}
      <div
        className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center gap-6 pt-3"
        style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))', background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}
      >
        <MenuIconButton icon={uiIconConfigImage} label="Config." onClick={() => setSettingsOpen(true)} />
        <MenuIconButton icon={uiIconTutoriaisImage} label="Tutoriais" onClick={onTutorials} />
        <MenuIconButton icon={uiIconRankingImage} label="Ranking" onClick={() => setComingSoon({ title: 'Ranking', message: 'O sistema de partidas ranqueadas ainda está por vir.' })} />
        <MenuIconButton icon={uiIconSomImage} label="Opções" onClick={() => setSoundOpen(true)} />
      </div>
    </motion.div>
  );
};

const InstallPrompt = ({
  kind, onInstall, onDismiss
}: {
  kind: 'native' | 'ios', onInstall: () => void, onDismiss: () => void
}) => (
  <WindowOverlay>
    <FramedWindow>
      <div className="flex flex-col items-center gap-3 px-2 py-2 text-center">
        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#d4af37]/70 shadow-lg shrink-0">
          <img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="" className="w-full h-full object-cover" />
        </div>
        <WindowTitle>Instale o Price of War</WindowTitle>
        {kind === 'native' ? (
          <>
            <WindowText>Jogue em tela cheia, sem as barras do navegador. Instale o app no seu aparelho.</WindowText>
            <div className="flex gap-3">
              <WindowButton onClick={onDismiss}>Agora não</WindowButton>
              <WindowButton onClick={onInstall} primary>Instalar</WindowButton>
            </div>
          </>
        ) : (
          <>
            <WindowText>
              Toque em <strong>Compartilhar</strong> e depois em <strong>"Adicionar à Tela de Início"</strong> para jogar em tela cheia, sem as barras do navegador.
            </WindowText>
            <WindowButton onClick={onDismiss}>Entendi</WindowButton>
          </>
        )}
      </div>
    </FramedWindow>
  </WindowOverlay>
);

// Shown right after tapping Desafios — the player picks one of THEIR saved decks (see the
// deck editor); the AI takes the prebuilt deck of the other faction (see buildDeckSelection).
// A deck that breaks the size rules is listed but greyed out, with the reason.
const DeckPickerModal = ({ store, onSelect, onClose }: { store: DeckStore; onSelect: (sel: DeckSelection) => void, onClose: () => void }) => (
  <WindowOverlay onClose={onClose}>
    <FramedWindow>
      <div className="flex flex-col gap-3 px-1 py-1">
        <WindowTitle>Escolha seu Deck</WindowTitle>
        {store.slots.map((slot) => {
          const problem = deckProblem(slot);
          return (
            <WindowOption key={slot.id} onClick={() => { if (!problem) onSelect(buildDeckSelection(slot)); }}>
              <div className={`flex flex-col gap-0.5 ${problem ? 'opacity-45' : ''}`}>
                <span className="uppercase text-[#f3e3c3]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em' }}>{slot.name}</span>
                <span className="text-[11px] font-bold text-[#e8c766]" style={{ fontFamily: "'PT Serif', serif" }}>General: {slot.general}</span>
                <span className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ fontFamily: "'Cinzel', serif", color: problem ? '#e08a7a' : '#9d8d6b' }}>
                  {problem ?? `${deckCardCount(slot)} cartas`}
                </span>
              </div>
            </WindowOption>
          );
        })}
        <WindowButton onClick={onClose} className="self-center">Cancelar</WindowButton>
      </div>
    </FramedWindow>
  </WindowOverlay>
);

// ── Deck editor ─────────────────────────────────────────────────────────────
// Full-screen, Forbidden-Memories style: the screen shows ONE side at a time — the deck or
// the reserve — and a switch at the top flips between them. Tapping a card never moves it
// straight away (too easy to mis-tap on a phone): it opens a small window with the card, a
// quantity stepper and a clear "send to ..." button. Clear / auto-fill / general swap ask
// for confirmation as well. Every confirmed change is saved right away.
const CARD_TYPE_ORDER: CardType[] = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia', 'Tática', 'Emboscada', 'Terreno', 'Relíquia'];
type DeckSide = 'deck' | 'reserve';
type EditorSort = 'custo' | 'nome' | 'tipo';
const EDITOR_SORTS: EditorSort[] = ['custo', 'nome', 'tipo'];
const EDITOR_MARGIN = 5;
const EDITOR_FRAME = 18;
const EDITOR_PAD = 6;
// Spreadsheet columns of the list: cost | name | type | ATK | HP | quantity. Header and rows share
// this template, and the cells are split by the thin gold line art (ui-line-v / ui-line-h).
const LIST_COLS = '40px minmax(0,1fr) 70px 34px 34px 38px';
const ROW_H = 42;
const FULL_ART_TILE_SCALE = 1; // Full Art sizing is fixed inside CardFaceFullArt (FULL_ART_SIZE_FIX)

const DeckEditor = ({ onClose }: { onClose: () => void }) => {
  // `store` is the draft the player is editing; `saved` is what is on disk. Nothing reaches the
  // game (or storage) until Salvar copies the draft over.
  const [saved, setSaved] = useState<DeckStore>(loadDeckStore);
  const [store, setStore] = useState<DeckStore>(() => JSON.parse(JSON.stringify(saved)));
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [slotIdx, setSlotIdx] = useState(0);
  const [side, setSide] = useState<DeckSide>('deck');
  const flipDir = useRef(1);
  const [typeFilter, setTypeFilter] = useState<CardType | 'todas'>('todas');
  const [sort, setSort] = useState<EditorSort>('custo');
  const [query, setQuery] = useState('');
  // The editor always opens on the card grid, 4 per row (16 on screen): cards are what the player
  // wants to see first. List view and the card size are one tap away.
  const [view, setView] = useState<'lista' | 'cartas'>('cartas');
  const changeView = (v: 'lista' | 'cartas') => setView(v);
  const [gridCols, setGridCols] = useState<3 | 4 | 5>(4);
  const [picked, setPicked] = useState<string | null>(null);
  const [view3d, setView3d] = useState<number | null>(null);        // 3D viewer: index into the list below (the rows as filtered and sorted)
  const [qty, setQty] = useState(1);
  const [confirm, setConfirm] = useState<{ title: string; message: string; run: () => void } | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<{ type: CardType | 'todas'; sort: EditorSort }>({ type: 'todas', sort: 'custo' });
  // Visual confirmation of a move: a ghost of the card flies to the tab it went to, and a
  // short message says what happened.
  const deckTabRef = useRef<HTMLButtonElement>(null);
  const reserveTabRef = useRef<HTMLButtonElement>(null);
  const [fly, setFly] = useState<{ id: number; card: CardData; from: { x: number; y: number }; to: { x: number; y: number } } | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [generalOpen, setGeneralOpen] = useState(false);
  const [generalChoice, setGeneralChoice] = useState<string | null>(null);
  const [viewW, setViewW] = useState(typeof window !== 'undefined' ? window.innerWidth : 390);
  useEffect(() => {
    const on = () => setViewW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  // Filters that differ from the defaults, shown as a count on the Filtros button.
  const filterCount = (typeFilter !== 'todas' ? 1 : 0) + (sort !== 'custo' ? 1 : 0);
  const slot = store.slots[slotIdx];
  const total = deckCardCount(slot);
  const problem = deckProblem(slot);
  const ownedGenerals = Object.keys(store.collection).filter(isGeneralName);

  const commit = (mutate: (draft: DeckStore) => void) => {
    setStore(prev => {
      const next: DeckStore = JSON.parse(JSON.stringify(prev));
      mutate(next);
      return next;
    });
  };
  const dirty = JSON.stringify(store) !== JSON.stringify(saved);
  const showToast = (text: string) => {
    const id = Date.now();
    setToast({ id, text });
    window.setTimeout(() => setToast(t => (t && t.id === id ? null : t)), 1700);
  };
  const saveNow = () => {
    saveDeckStore(store);
    setSaved(JSON.parse(JSON.stringify(store)));
    showToast('Deck salvo');
  };
  const requestClose = () => { if (dirty) setLeaveOpen(true); else onClose(); };

  const inDeck = (name: string) => slot.cards[name] ?? 0;
  const owned = (name: string) => store.collection[name] ?? 0;
  // How many copies can move each way right now.
  const canAdd = (name: string) => Math.max(0, Math.min(owned(name) - inDeck(name), DECK_MAX_COPIES - inDeck(name), DECK_MAX_CARDS - total));
  const canRemove = (name: string) => inDeck(name);
  const addReason = (name: string) =>
    owned(name) - inDeck(name) <= 0 ? 'Sem cópias na reserva'
      : inDeck(name) >= DECK_MAX_COPIES ? `Limite de ${DECK_MAX_COPIES} cópias por carta`
      : total >= DECK_MAX_CARDS ? `Deck cheio (${DECK_MAX_CARDS}/${DECK_MAX_CARDS})` : '';

  const rows = (() => {
    const names = Object.keys(store.collection).filter(n => !isGeneralName(n));
    const list = names
      .map(name => ({ name, card: cardByName(name)!, count: side === 'deck' ? inDeck(name) : owned(name) - inDeck(name) }))
      .filter(r => r.count > 0)
      .filter(r => typeFilter === 'todas' || r.card.cardType === typeFilter)
      .filter(r => !query.trim() || r.name.toLowerCase().includes(query.trim().toLowerCase()));
    const typeRank = (t?: CardType) => { const i = CARD_TYPE_ORDER.indexOf(t as CardType); return i < 0 ? 99 : i; };
    list.sort((a, b) =>
      sort === 'nome' ? a.name.localeCompare(b.name, 'pt-BR')
      : sort === 'tipo' ? typeRank(a.card.cardType) - typeRank(b.card.cardType) || a.card.cost - b.card.cost || a.name.localeCompare(b.name, 'pt-BR')
      : a.card.cost - b.card.cost || a.name.localeCompare(b.name, 'pt-BR'));
    return list;
  })();
  const reserveCount = Object.keys(store.collection).filter(n => !isGeneralName(n)).reduce((sum, n) => sum + owned(n) - inDeck(n), 0);

  const openCard = (name: string) => { setPicked(name); setQty(1); };
  const maxQty = picked ? (side === 'deck' ? canRemove(picked) : canAdd(picked)) : 0;
  const applyMove = () => {
    if (!picked || maxQty < 1) return;
    const n = Math.min(qty, maxQty);
    commit(d => {
      const cards = d.slots[slotIdx].cards;
      const next = (cards[picked] ?? 0) + (side === 'deck' ? -n : n);
      if (next <= 0) delete cards[picked]; else cards[picked] = next;
    });
    const dest: DeckSide = side === 'deck' ? 'reserve' : 'deck';
    const card = cardByName(picked);
    const rect = (dest === 'deck' ? deckTabRef : reserveTabRef).current?.getBoundingClientRect();
    const id = Date.now();
    if (card) {
      setFly({
        id, card,
        from: { x: window.innerWidth / 2, y: window.innerHeight / 2 - 50 },
        to: rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: window.innerWidth / 2, y: 130 },
      });
    }
    showToast(`${n > 1 ? `${n}× ` : ''}${picked} → ${dest === 'deck' ? 'Deck' : 'Reserva'}`);
    setPicked(null);
  };

  const autoFillPlan = () => {
    const plan: Record<string, number> = {};
    let sum = total;
    const names = Object.keys(store.collection).filter(n => !isGeneralName(n)).sort((a, b) =>
      CARD_TYPE_ORDER.indexOf(cardByName(a)!.cardType as CardType) - CARD_TYPE_ORDER.indexOf(cardByName(b)!.cardType as CardType) || cardByName(a)!.cost - cardByName(b)!.cost);
    let added = true;
    while (sum < DECK_MAX_CARDS && added) {
      added = false;
      for (const name of names) {
        if (sum >= DECK_MAX_CARDS) break;
        const have = inDeck(name) + (plan[name] ?? 0);
        if (have < Math.min(owned(name), DECK_MAX_COPIES)) { plan[name] = (plan[name] ?? 0) + 1; sum++; added = true; }
      }
    }
    return plan;
  };

  const cellGap = 6;
  const gridW = Math.min(viewW, 480) - 2 * (EDITOR_MARGIN + EDITOR_FRAME + EDITOR_PAD) - 12; // outer margin, screen frame, inner padding, grid padding
  const cellW = Math.floor((gridW - cellGap * (gridCols - 1)) / gridCols);
  // The card art's wings stick out a bit past its 224x320 box, so it is drawn slightly smaller
  // than the cell to keep the silhouette inside it.
  const cellScale = cellW / 246;
  // The frames' points stick out above and below the 320px box too, so rows get extra height.
  const cellH = Math.round(320 * cellScale * 1.12) + 8;
  const pickedCard = picked ? cardByName(picked) : undefined;

  const chip = (active: boolean) =>
    `shrink-0 px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-[0.1em] transition-colors ${active ? 'border-[#e8c766] bg-[#7a5a16]/70 text-[#fff1c9]' : 'border-[#d4af37]/35 text-[#cdbd97]'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[300] flex flex-col items-center text-white"
      style={{
        backgroundColor: '#080503',
        paddingTop: 'calc(max(4px, env(safe-area-inset-top)) + 2px)',
        paddingBottom: 'calc(max(4px, env(safe-area-inset-bottom)) + 2px)',
        paddingLeft: EDITOR_MARGIN,
        paddingRight: EDITOR_MARGIN,
      }}
    >
      {/* The whole screen is one framed window: thin gold frame, and a deep oxblood leather
          tone with the shared texture, so the parchment-brown list panel inside reads clearly. */}
      <div
        className="w-full max-w-[480px] flex flex-col h-full gap-2"
        style={{
          borderStyle: 'solid',
          borderColor: 'transparent',
          borderWidth: EDITOR_FRAME,
          borderImageSource: `url(${uiWindowFrameImage})`,
          borderImageSlice: '90',
          borderImageWidth: `${EDITOR_FRAME}px`,
          borderImageRepeat: 'stretch',
          padding: `6px ${EDITOR_PAD}px`,
          backgroundColor: '#22100d',
          backgroundImage: `radial-gradient(ellipse at 50% 20%, rgba(170,70,50,0.22), rgba(170,70,50,0) 70%), linear-gradient(rgba(34,14,12,0.55), rgba(20,8,7,0.7)), url(${uiWindowTextureImage})`,
          backgroundSize: '100% 100%, 100% 100%, 400px 400px',
          backgroundRepeat: 'no-repeat, no-repeat, repeat',
          backgroundOrigin: 'border-box',
          backgroundClip: 'border-box',
        }}
      >
        {/* Header: back arrow, deck slots, save */}
        <div className="flex items-center gap-2 shrink-0">
          <button aria-label="Voltar" onClick={() => { playUiClickSfx(); requestClose(); }} className="shrink-0 active:scale-95 transition">
            <ThinFrame px={9} style={{ background: 'rgba(20,13,6,0.45)' }}>
              <span className="flex items-center gap-1 pl-1.5 pr-2.5 py-[2px] text-[10px] uppercase tracking-[0.1em] text-[#f0e0bb]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#f0e0bb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
                Voltar
              </span>
            </ThinFrame>
          </button>
          <div className="flex gap-1.5 flex-1 justify-center">
            {store.slots.map((sl, i) => (
              <ArtChip key={sl.id} compact active={i === slotIdx} onClick={() => { setSlotIdx(i); setPicked(null); }}>Deck {i + 1}</ArtChip>
            ))}
          </div>
          {/* Lit like a selected button (with a red dot) while there are unsaved changes */}
          <button onClick={() => { if (dirty) { playUiClickSfx(); saveNow(); } }} disabled={!dirty} aria-label="Salvar alterações" className={`relative h-[34px] shrink-0 transition ${dirty ? 'active:scale-95' : ''}`}>
            <ArtFrame src={dirty ? uiEditorTabOnImage : uiEditorTabOffImage} slice={[44, 44, 44, 44]} width={[11, 11, 11, 11]} className="absolute inset-0" style={{ background: dirty ? 'rgba(122,90,22,0.75)' : 'rgba(0,0,0,0.4)' }} />
            <span className={`relative block px-3 uppercase tracking-[0.08em] text-[11px] whitespace-nowrap ${dirty ? 'text-[#fff1c9]' : 'text-[#8fe0a4]/80'}`} style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>{dirty ? 'Salvar' : 'Salvo ✓'}</span>
            {dirty && <motion.span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#d8402a] shadow-[0_0_0_1.5px_#e8c766]" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />}
          </button>
        </div>
        {dirty && <p className="text-center text-[11px] -mt-1 text-[#f2c66a]" style={{ fontFamily: "'PT Serif', serif" }}>Alterações não salvas</p>}

        {/* Deck title + general + counter (the counter sits in the plate's own socket) */}
        <ArtFrame src={uiEditorHeaderImage} slice={[50, 130, 50, 70]} width={[15, 39, 15, 21]} className="relative shrink-0" style={{ height: 56, background: 'rgba(20,13,6,0.55)' }}>
          <div className="absolute inset-0 flex items-center gap-2 pl-6" style={{ paddingRight: 9 }}>
            <button onClick={() => { playUiClickSfx(); setGeneralChoice(slot.general); setGeneralOpen(true); }} aria-label="Trocar General" className="flex items-center min-w-0 flex-1 text-left gap-1.5">
              <span className="truncate uppercase text-[#f3e3c3] leading-tight" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700, fontSize: 12, letterSpacing: '0.02em' }}>{slot.name}</span>
              <span className="shrink-0 text-[12px] text-[#e8c766] opacity-80">✎</span>
            </button>
            <span className="shrink-0 flex flex-col text-right leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
              <span className="text-[9px] font-bold uppercase tracking-[0.03em] text-[#f3e3c3]">de {DECK_MAX_CARDS} cartas</span>
              <span className={`text-[8px] uppercase tracking-[0.03em] ${total < DECK_MIN_CARDS ? 'text-[#f08a78]' : 'text-[#a89a78]'}`}>mínimo {DECK_MIN_CARDS}</span>
            </span>
            <span className="shrink-0 w-[28px] text-center font-black leading-none" style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: problem ? '#f08a78' : '#8fe0a4' }}><motion.span key={total} className="inline-block" initial={{ scale: 1.6 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>{total}</motion.span></span>
          </div>
        </ArtFrame>
        {problem && <p className="text-center text-[11px] text-[#f0a595] -mt-1" style={{ fontFamily: "'PT Serif', serif" }}>{problem}</p>}

        {/* The switch: deck side / reserve side */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          {([['deck', 'Deck', total], ['reserve', 'Reserva', reserveCount]] as const).map(([id, label, n]) => (
            <button
              key={id}
              ref={id === 'deck' ? deckTabRef : reserveTabRef}
              onClick={() => { if (side === id) return; playUiClickSfx(); flipDir.current = id === 'reserve' ? 1 : -1; setSide(id); setPicked(null); }}
              className="relative h-[42px] active:scale-[0.97] transition"
            >
              <ArtFrame
                src={side === id ? uiEditorTabOnImage : uiEditorTabOffImage}
                slice={[44, 44, 44, 44]}
                width={[14, 14, 14, 14]}
                className="absolute inset-0"
                style={{ background: side === id ? 'rgba(96,68,16,0.6)' : 'rgba(0,0,0,0.4)' }}
              />
              <span className={`relative uppercase tracking-[0.12em] ${side === id ? 'text-[#fff1c9]' : 'text-[#a89a78]'}`} style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 13 }}>
                {label} <motion.span key={n} className="inline-block opacity-90" initial={{ scale: 1.55, color: '#ffe08a' }} animate={{ scale: 1, color: side === id ? '#fff1c9' : '#a89a78' }} transition={{ duration: 0.45 }}>({n})</motion.span>
              </span>
            </button>
          ))}
        </div>

        {/* Search + one Filtros button (type, order and view live in its window) */}
        <div className="flex gap-2 shrink-0">
          <ThinFrame px={11} className="flex-1 min-w-0" style={{ background: 'rgba(0,0,0,0.35)' }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="block w-full bg-transparent px-2 py-1 text-[13px] text-[#f3e3c3] placeholder:text-[#8d7f60] outline-none"
              style={{ fontFamily: "'PT Serif', serif" }}
            />
          </ThinFrame>
          <div className="flex gap-1 shrink-0">
            {([['cartas', 'Ver em cartas'], ['lista', 'Ver em lista']] as const).map(([id, label]) => (
              <button key={id} aria-label={label} title={label} onClick={() => { if (view !== id) { playUiClickSfx(); changeView(id); } }} className="relative w-[38px] flex items-center justify-center active:scale-95 transition">
                <ArtFrame src={view === id ? uiEditorTabOnImage : uiEditorTabOffImage} slice={[44, 44, 44, 44]} width={[11, 11, 11, 11]} className="absolute inset-0" style={{ background: view === id ? 'rgba(96,68,16,0.6)' : 'rgba(0,0,0,0.4)' }} />
                {id === 'lista' ? (
                  <svg viewBox="0 0 24 24" className="relative mx-auto" width="24" height="24" fill="none" stroke={view === id ? '#fff1c9' : '#a89a78'} strokeWidth="2.2" strokeLinecap="round">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  // a tiny real card frame from the game's own art
                  <img src={uiIconCardImage} alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[calc(100%-10px)] w-auto" style={{ opacity: view === id ? 1 : 0.55 }} />
                )}
              </button>
            ))}
          </div>
          {/* Always on screen so the header never shifts; dimmed and disabled in list view */}
          <button
            aria-label="Tamanho das cartas"
            title="Tamanho das cartas"
            disabled={view !== 'cartas'}
            onClick={() => { playUiClickSfx(); const next = gridCols === 3 ? 4 : gridCols === 4 ? 5 : 3; setGridCols(next); showToast(`Cartas ${next === 3 ? 'grandes' : next === 4 ? 'médias' : 'pequenas'}`); }}
            className={`relative shrink-0 w-[38px] flex items-center justify-center transition ${view === 'cartas' ? 'active:scale-95' : 'opacity-35 cursor-default'}`}
          >
            <ArtFrame src={uiEditorTabOffImage} slice={[44, 44, 44, 44]} width={[11, 11, 11, 11]} className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <svg viewBox="0 0 24 24" className="relative" width="22" height="22" fill="#e8c766">
              {Array.from({ length: gridCols === 3 ? 9 : gridCols === 4 ? 12 : 15 }).map((_, i) => {
                const rows = 3, c = gridCols, gap = 1.4, cw = (20 - gap * (c - 1)) / c, ch = (20 - gap * (rows - 1)) / rows;
                return <rect key={i} x={2 + (i % c) * (cw + gap)} y={2 + Math.floor(i / c) * (ch + gap)} width={cw} height={ch} rx="0.8" />;
              })}
            </svg>
          </button>
          <button onClick={() => { playUiClickSfx(); setDraft({ type: typeFilter, sort }); setFilterOpen(true); }} className="relative shrink-0 active:scale-95 transition">
            <ThinFrame px={11} style={{ background: filterCount > 0 ? 'rgba(122,90,22,0.55)' : 'rgba(20,13,6,0.45)' }}>
              <span className="block px-2 py-1 text-xs uppercase tracking-[0.1em] text-[#f0e0bb]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>Filtros</span>
            </ThinFrame>
            {filterCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-black text-[#fff1c9] bg-[#8a2a1a] shadow-[0_0_0_1.5px_#e8c766]" style={{ fontFamily: "'Cinzel', serif" }}>{filterCount}</span>
            )}
          </button>
        </div>

        {/* Cards: list (default) or card grid. Switching Deck <-> Reserva turns the page: the
            old side slides and tilts away, the new one swings in from the other edge. */}
        <div className="relative flex-1 min-h-0 rounded-md flex flex-col" style={{ background: 'linear-gradient(to bottom, rgba(112,80,44,0.34), rgba(74,50,26,0.3))', boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.14), inset 0 8px 18px rgba(0,0,0,0.25)', perspective: 900 }}>
          {view === 'lista' && rows.length > 0 && (
            // The column dividers run unbroken from the titles to the bottom of the list. This
            // layer sits over the scrolling rows and uses the same grid, so the lines line up.
            <div aria-hidden className="absolute inset-y-1.5 left-1.5 right-1.5 grid pointer-events-none z-10" style={{ gridTemplateColumns: LIST_COLS }}>
              {LIST_COLS.split(' ').map((_, i) => <span key={i} className="relative">{i > 0 && <VLine className="!top-0 !bottom-0" />}</span>)}
            </div>
          )}
          {view === 'lista' && rows.length > 0 && (
            // Column titles, one per cell of the rows below (same grid, so they line up).
            <div className="relative shrink-0 mx-1.5 mt-1.5 grid" style={{ gridTemplateColumns: LIST_COLS, height: 24 }}>
              {['Custo', 'Nome', 'Tipo', 'ATK', 'HP', 'Qtd'].map(label => (
                <span key={label} className="flex items-center justify-center text-[8px] uppercase tracking-[0.06em] text-[#e8c766]/90" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                  {label}
                </span>
              ))}
              <HLine />
            </div>
          )}
          <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${side}-${slotIdx}`}
              initial={{ opacity: 0, x: 60 * flipDir.current, rotateY: -22 * flipDir.current }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -60 * flipDir.current, rotateY: 22 * flipDir.current }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="h-full overflow-y-auto overflow-x-hidden"
              style={{ scrollbarWidth: 'none', transformOrigin: 'center center' }}
            >
              {rows.length === 0 ? (
                <p className="text-center text-[13px] text-[#a89a78] mt-10 px-4" style={{ fontFamily: "'PT Serif', serif" }}>
                  {side === 'deck' ? 'Nenhuma carta no deck com esse filtro.' : 'Nenhuma carta na reserva com esse filtro.'}
                </p>
              ) : view === 'lista' ? (
                <div className="flex flex-col px-1.5 pb-1.5">
                  {rows.map(r => {
                    const isUnit = ['Infantaria', 'Cavalaria', 'Arqueiro', 'Artilharia'].includes(r.card.cardType ?? '');
                    return (
                      <button
                        key={r.name}
                        onClick={() => { playUiClickSfx(); openCard(r.name); }}
                        className="relative grid w-full shrink-0 text-left active:bg-[#7a5a16]/35 transition-colors"
                        style={{ gridTemplateColumns: LIST_COLS, height: ROW_H }}
                      >
                        <span className="flex items-center justify-center text-[12px] font-black text-[#fff1c9]" style={{ fontFamily: "'Cinzel', serif" }}>{r.card.cost}</span>
                        <span className="flex items-center min-w-0 px-2">
                          <span className="text-[12px] leading-[1.1] text-[#f3e3c3] line-clamp-2" style={{ fontFamily: "'PT Serif', serif", fontWeight: 700 }}>{r.name}</span>
                        </span>
                        <span className="flex items-center justify-center text-center text-[7.5px] leading-tight uppercase tracking-[0.04em] text-[#cdbd97]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                          {r.card.cardType}
                        </span>
                        {([[uiStatAtkImage, r.card.atk], [uiStatHpImage, r.card.hp]] as const).map(([img, val], k) => (
                          <span key={k} className="flex items-center justify-center">
                              {isUnit ? (
                              <span className="flex items-center justify-center" style={{ width: 24, height: 27, backgroundImage: `url(${img})`, backgroundSize: '100% 100%' }}>
                                <span className="text-[12px] font-black leading-none pt-[2px]" style={{ fontFamily: "'Cinzel', serif", color: '#fff4d2', textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.8)' }}>{val}</span>
                              </span>
                            ) : <span className="text-[12px] text-[#6d6248]">—</span>}
                          </span>
                        ))}
                        <span className="flex items-center justify-center text-[12px] font-black text-[#e8c766]" style={{ fontFamily: "'Cinzel', serif" }}>
                          x{r.count}
                        </span>
                        <HLine />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid p-1.5" style={{ gridTemplateColumns: `repeat(${gridCols}, ${cellW}px)`, columnGap: cellGap, rowGap: cellGap, justifyContent: 'center' }}>
                  {rows.map(r => (
                    <button key={r.name} onClick={() => { playUiClickSfx(); openCard(r.name); }} className="relative active:brightness-125 active:scale-[0.97] transition" style={{ width: cellW, height: cellH }}>
                      {/* Every card gets the same cell, so the grid lines up exactly. Full Art
                          frames come out smaller than Padrão ones at the same scale, so they are
                          drawn slightly larger to look the same size. */}
                      <div className="absolute pointer-events-none" style={{ width: 224, height: 320, transform: `scale(${cellScale * (r.card.isFullArt ? FULL_ART_TILE_SCALE : 1)})`, transformOrigin: 'center center', left: (cellW - 224) / 2, top: (cellH - 320) / 2 }}>
                        <div className="relative w-full h-full rounded-xl">
                          <CardFace card={r.card} variant="hand" />
                        </div>
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 rounded-full flex items-center justify-center font-black text-[#fff1c9] bg-[#5a3d0c] shadow-[0_0_0_1.5px_#e8c766,0_2px_4px_rgba(0,0,0,0.6)] ${gridCols > 3 ? 'min-w-[14px] h-[14px] px-0.5 text-[8px]' : 'min-w-[18px] h-[18px] px-1 text-[10px]'}`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        x{r.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="flex gap-2 justify-center pt-1">
          <WindowButton
            onClick={() => setConfirm({
              title: 'Limpar deck',
              message: total === 0 ? 'O deck já está vazio.' : `Todas as ${total} cartas do ${slot.name} voltam para a reserva. O General continua o mesmo.`,
              run: () => { if (total > 0) commit(d => { d.slots[slotIdx].cards = {}; }); },
            })}
          >
            Limpar deck
          </WindowButton>
          <WindowButton
            onClick={() => {
              const plan = autoFillPlan();
              const add = Object.values(plan).reduce((a, b) => a + b, 0);
              setConfirm({
                title: 'Preencher automático',
                message: add === 0 ? `Nada para adicionar: o deck já tem ${total} cartas ou a reserva não tem mais cartas que caibam.` : `Vai adicionar ${add} cartas da reserva ao ${slot.name}, até ${DECK_MAX_CARDS}, respeitando o limite de ${DECK_MAX_COPIES} cópias.`,
                run: () => { if (add > 0) commit(d => { Object.entries(plan).forEach(([n, c]) => { d.slots[slotIdx].cards[n] = (d.slots[slotIdx].cards[n] ?? 0) + c; }); }); },
              });
            }}
          >
            Preencher automático
          </WindowButton>
        </div>
      </div>

      {view3d !== null && rows[view3d] && (
        <Suspense fallback={<div className="fixed inset-0 z-[900] flex items-center justify-center bg-[#0d0905] text-[#cdbd97]" style={{ fontFamily: "'Cinzel', serif" }}>Carregando…</div>}>
          <CardViewer3D
            cards={rows.map(r => ({ name: r.name, type: r.card.cardType, full: !!r.card.isFullArt }))}
            index={view3d}
            onIndex={(i) => { setView3d(i); setPicked(rows[i].name); }}
            onClose={() => setView3d(null)}
          />
        </Suspense>
      )}

      {/* Card window: what is being moved, how many, and the explicit button */}
      <AnimatePresence>
        {pickedCard && picked && (
          // Just the card lifted over a dimmed screen, with two plain choices under it —
          // no window, no text: the list already shows the details.
          <motion.div
            key="picked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center gap-7 p-4 bg-black/80"
            onClick={() => setPicked(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="relative shrink-0"
              style={{ width: 224 * 0.8, height: 320 * 0.8, filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.75))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 pointer-events-none" style={{ width: 224, height: 320, transform: 'scale(0.8)', transformOrigin: 'top left' }}>
                <div className="relative w-full h-full rounded-xl"><CardFace card={pickedCard} variant="hand" /></div>
              </div>
              <button
                aria-label="Ver a carta em 3D"
                onClick={() => { const i = rows.findIndex(r => r.name === picked); if (i >= 0) { playUiClickSfx(); setView3d(i); } }}
                className="absolute flex items-center justify-center active:brightness-125"
                style={{ right: -6, bottom: -6, width: 46, height: 46, borderRadius: 12, border: '2px solid #e8c766', background: 'linear-gradient(#3b2a12, #1c1308)', color: '#ffe9b0', fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 14, letterSpacing: '0.04em', boxShadow: '0 3px 8px rgba(0,0,0,0.7)' }}
              >3D</button>
            </motion.div>
            <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {maxQty > 1 && (
                <div className="flex items-center gap-3">
                  <WindowButton onClick={() => setQty(q => Math.max(1, q - 1))}>−</WindowButton>
                  <span className="min-w-[2ch] text-center text-lg font-black text-[#fff1c9]" style={{ fontFamily: "'Cinzel', serif" }}>{Math.min(qty, maxQty)}</span>
                  <WindowButton onClick={() => setQty(q => Math.min(maxQty, q + 1))}>+</WindowButton>
                </div>
              )}
              {maxQty === 0 && side === 'reserve' && (
                <span className="text-[12px] text-[#f0a595] text-center" style={{ fontFamily: "'PT Serif', serif" }}>{addReason(picked)}</span>
              )}
              <div className="flex gap-3 justify-center">
                {maxQty > 0 && (
                  <WindowButton primary onClick={applyMove}>
                    {side === 'deck' ? 'Remover do deck' : 'Para o deck'}
                  </WindowButton>
                )}
                <WindowButton onClick={() => setPicked(null)}>Cancelar</WindowButton>
              </div>
            </div>
          </motion.div>
        )}
        {confirm && (
          <WindowOverlay onClose={() => setConfirm(null)}>
            <FramedWindow>
              <div className="flex flex-col items-center gap-3 px-2 py-2">
                <WindowTitle>{confirm.title}</WindowTitle>
                <WindowText>{confirm.message}</WindowText>
                <div className="flex gap-3">
                  <WindowButton onClick={() => setConfirm(null)}>Cancelar</WindowButton>
                  <WindowButton primary onClick={() => { const run = confirm.run; setConfirm(null); run(); }}>Confirmar</WindowButton>
                </div>
              </div>
            </FramedWindow>
          </WindowOverlay>
        )}
        {leaveOpen && (
          <WindowOverlay onClose={() => setLeaveOpen(false)}>
            <FramedWindow>
              <div className="flex flex-col items-center gap-3 px-2 py-2">
                <WindowTitle>Alterações não salvas</WindowTitle>
                <WindowText>Você fez alterações no deck que ainda não foram salvas. Deseja salvar antes de sair?</WindowText>
                <div className="flex flex-col items-center gap-2">
                  <WindowButton primary onClick={() => { saveDeckStore(store); onClose(); }}>Salvar e sair</WindowButton>
                  <WindowButton onClick={() => { setLeaveOpen(false); onClose(); }}>Sair sem salvar</WindowButton>
                  <WindowButton onClick={() => setLeaveOpen(false)}>Continuar editando</WindowButton>
                </div>
              </div>
            </FramedWindow>
          </WindowOverlay>
        )}
        {filterOpen && (
          <WindowOverlay onClose={() => setFilterOpen(false)}>
            <FramedWindow>
              <div className="flex flex-col gap-3 px-1 py-1">
                <WindowTitle>Filtros</WindowTitle>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#a89a78]" style={{ fontFamily: "'Cinzel', serif" }}>Tipo</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['todas', ...CARD_TYPE_ORDER] as const).map(t => (
                      <ArtChip key={t} active={draft.type === t} onClick={() => setDraft(d => ({ ...d, type: t }))}>{t === 'todas' ? 'Todas' : t}</ArtChip>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#a89a78]" style={{ fontFamily: "'Cinzel', serif" }}>Ordem</span>
                  <div className="flex flex-wrap gap-1.5">
                    {EDITOR_SORTS.map(o => (
                      <ArtChip key={o} active={draft.sort === o} onClick={() => setDraft(d => ({ ...d, sort: o }))}>{o.charAt(0).toUpperCase() + o.slice(1)}</ArtChip>
                    ))}
                  </div>
                </div>
                <button onClick={() => { playUiClickSfx(); setDraft(d => ({ ...d, type: 'todas', sort: 'custo' })); }} className="self-center text-[11px] uppercase tracking-[0.14em] text-[#e8c766] underline underline-offset-4" style={{ fontFamily: "'Cinzel', serif" }}>Limpar filtros</button>
                <div className="flex gap-3 justify-center">
                  <WindowButton onClick={() => setFilterOpen(false)}>Cancelar</WindowButton>
                  <WindowButton primary onClick={() => { setTypeFilter(draft.type); setSort(draft.sort); setFilterOpen(false); }}>Aplicar</WindowButton>
                </div>
              </div>
            </FramedWindow>
          </WindowOverlay>
        )}
        {generalOpen && (
          <WindowOverlay onClose={() => setGeneralOpen(false)}>
            <FramedWindow>
              <div className="flex flex-col gap-3 px-1 py-1">
                <WindowTitle>General do deck</WindowTitle>
                {ownedGenerals.map(g => (
                  <WindowOption key={g} onClick={() => setGeneralChoice(g)}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-[#f3e3c3]" style={{ fontFamily: "'PT Serif', serif" }}>{g}</span>
                      {generalChoice === g && <span className="text-[#8fe0a4] text-sm">✓</span>}
                    </div>
                  </WindowOption>
                ))}
                <div className="flex gap-3 justify-center">
                  <WindowButton onClick={() => setGeneralOpen(false)}>Cancelar</WindowButton>
                  <WindowButton primary onClick={() => {
                    const g = generalChoice;
                    setGeneralOpen(false);
                    if (g && g !== slot.general) commit(d => { d.slots[slotIdx].general = g; });
                  }}>Confirmar</WindowButton>
                </div>
              </div>
            </FramedWindow>
          </WindowOverlay>
        )}
      </AnimatePresence>

      {/* Move feedback: the card flies to the tab it went to, and a message names the move */}
      {fly && (
        <motion.div
          key={fly.id}
          className="fixed left-0 top-0 z-[600] pointer-events-none"
          style={{ width: 112, height: 160, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.7))' }}
          initial={{ x: fly.from.x - 56, y: fly.from.y - 80, scale: 1.6, opacity: 1, rotate: 0 }}
          animate={{ x: fly.to.x - 56, y: fly.to.y - 80, scale: 0.16, opacity: 0.2, rotate: 10 }}
          transition={{ duration: 0.55, ease: [0.45, 0, 0.75, 0.4] }}
          onAnimationComplete={() => setFly(null)}
        >
          <div className="absolute top-0 left-0" style={{ width: 224, height: 320, transform: 'scale(0.5)', transformOrigin: 'top left' }}>
            <div className="relative w-full h-full rounded-xl"><CardFace card={fly.card} variant="hand" /></div>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="fixed left-1/2 z-[600] pointer-events-none"
            style={{ bottom: 'calc(max(4px, env(safe-area-inset-bottom)) + 96px)', x: '-50%' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <ArtFrame src={uiEditorTabOnImage} slice={[44, 44, 44, 44]} width={[12, 12, 12, 12]} className="relative" style={{ background: 'rgba(60,40,10,0.92)' }}>
              <span className="relative block px-5 py-2 text-[12px] text-[#fff1c9] whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, letterSpacing: '0.06em' }}>✓ {toast.text}</span>
            </ArtFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Loja de boosters ─────────────────────────────────────────────────────────
// A fixed 2D scene built from stacked layers (back to front): shelf wall, the boosters standing
// on it, the merchant, and the counter. "Camera" moves are just each layer animating at its own
// speed, which is what sells the depth: choosing Comprar pushes the counter down and the merchant
// forward and away while the shelf swells into view; picking a booster lifts it off the shelf
// toward the player. Every layer draws a provisional placeholder until real art is dropped into
// SHOP_ART (see art-prompts/README.md 4t).
type ShopPhase = 'front' | 'shelf' | 'detail' | 'opening';
type NpcMood = 'greet' | 'show' | 'happy' | 'sorry';
type BoosterDef = { id: string; name: string; description: string; faction: DeckId; price: number; cards: number; accent: string };

const BOOSTERS: BoosterDef[] = [
  { id: 'cardeal', name: 'Booster Cardeal', description: '5 cartas do baralho do Cardeal Pedro, Voz da Fé. Uma delas é sempre de custo 3 ou mais.', faction: 'cardeal', price: 100, cards: 5, accent: '#d9cfae' },
  { id: 'capitao', name: 'Booster Capitão', description: '5 cartas do baralho do Capitão. Uma delas é sempre de custo 3 ou mais.', faction: 'capitao', price: 100, cards: 5, accent: '#b8402c' },
];
// Room for 50 boosters: 5 shelves of up to 10. A booster's slot is its index in BOOSTERS.
// TEST BUILD: boosters cost nothing so the opening flow can be tried over and over. Set to false
// when accounts exist and Coroas are real; BoosterDef.price is what will be charged then.
const TEST_FREE_BOOSTERS = true;
const SHELF_ROWS = 5;
const SHELF_COLS = 10;
const BOOSTER_ASPECT = 512 / 882;
// Every layer is a 9:16 canvas drawn to the same proportions, so they are all laid out inside one
// "scene" box that covers the screen (like object-cover) and positioned in fractions of it.
// Measured off shop-shelf: the shelving interior spans x 22%-79%, and the tops of the first five
// planks (where boosters stand) sit at these fractions of the scene height.
const SHELF_X0 = 168 / 768;
const SHELF_X1 = 606 / 768;
const SHELF_PLANKS = [432, 538, 643, 742, 850].map(y => y / 1376);
const SHELF_OVERVIEW = 1.3;   // camera scale once the merchant is out of the way
const SHELF_CLOSEUP = 2.6;    // and after "Aproximar"

const NPC_LINES: Record<NpcMood, string> = {
  greet: 'Bem-vindo, viajante! Cartas novas para o seu baralho? Chegou na loja certa.',
  show: 'Venha, dê uma olhada. Tenho boosters de todos os reinos!',
  happy: 'Excelente escolha! Vamos ver o que o destino lhe reservou.',
  sorry: 'Hmm... suas Coroas não são suficientes para este.',
};

// The layer art (art-prompts/README.md 4u). A booster without art yet (Capitão) draws a placeholder.
const SHOP_ART: { counter: string; shelf: string; npc: Record<NpcMood, string>; boosters: Partial<Record<string, string>> } = {
  counter: shopCounterImage,
  shelf: shopShelfImage,
  npc: { greet: shopNpcGreetImage, show: shopNpcShowImage, happy: shopNpcHappyImage, sorry: shopNpcSorryImage },
  boosters: { cardeal: boosterCardealImage },
};

// Cheap cards are common, costly ones rarer; the last card of a pack is always a strong one.
const rollBooster = (def: BoosterDef): CardData[] => {
  const pool = DECKS[def.faction].pool;
  const weight = (c: CardData) => (c.cost <= 1 ? 6 : c.cost === 2 ? 4 : c.cost === 3 ? 2 : 1);
  const draw = (list: readonly CardData[]) => {
    let roll = Math.random() * list.reduce((sum, c) => sum + weight(c), 0);
    for (const c of list) { roll -= weight(c); if (roll <= 0) return c; }
    return list[list.length - 1];
  };
  const strong = pool.filter(c => c.cost >= 3 || c.isFullArt);
  const out: CardData[] = [];
  for (let i = 0; i < def.cards - 1; i++) out.push(draw(pool));
  out.push(draw(strong.length > 0 ? strong : pool));
  return out;
};

const BoosterArt = ({ def }: { def: BoosterDef }) => {
  const src = SHOP_ART.boosters[def.id];
  if (src) return <img src={src} alt={def.name} draggable={false} className="w-full h-full object-contain select-none pointer-events-none" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.55))' }} />;
  return (
    <div className="w-full h-full rounded-[10%] relative overflow-hidden flex flex-col items-center justify-center" style={{ background: `linear-gradient(160deg, ${def.accent}, #2a1a0c 85%)`, boxShadow: 'inset 0 0 0 2px rgba(232,199,102,0.85), 0 2px 6px rgba(0,0,0,0.6)' }}>
      <div className="absolute inset-x-0 top-0 h-[8%] bg-black/35" />
      <div className="absolute inset-x-0 bottom-0 h-[8%] bg-black/35" />
      <span className="text-[#fff1c9] font-black leading-none" style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 26%, 40px)' }}>{def.name.split(' ')[1]?.[0] ?? '?'}</span>
    </div>
  );
};

const NpcArt = ({ mood }: { mood: NpcMood }) => (
  <img src={SHOP_ART.npc[mood]} alt="" draggable={false} className="absolute inset-0 w-full h-full select-none pointer-events-none" />
);

// The sealed pack with a tear line near the top: the player swipes a finger along it (either
// direction) and the crimped strip peels away like thin plastic. A plain tap tears it too.
// `onTorn` fires once it is open and the first card should appear.
const PACK_TEAR_Y = 12; // % of the pack's height where the tear line runs
const LID_SLICES = 16;

// One vertical slice of the top strip. Slices hinge on the cut edge and fold back one after the
// other as the tear passes them (a wave, like a foil peeling), wobble, then the whole strip
// flutters up and away, each slice on its own delay. Being separate slices is what lets the
// strip bend and ripple instead of turning as one stiff board.
const LidSlice = ({ i, def, tip, fly, height }: { i: number; def: BoosterDef; tip: MotionValue<number>; fly: MotionValue<number>; height: number; key?: React.Key }) => {
  const N = LID_SLICES;
  const c = (i + 0.5) / N;
  const H = (height * PACK_TEAR_Y) / 100;
  const peel = (t: number) => { const k = Math.max(0, Math.min(1, (t - c) * 5)); return k * k * (3 - 2 * k); };
  const flight = (f: number) => Math.max(0, Math.min(1, (f - i * 0.012) / 0.86));
  const rotateX = useTransform([tip, fly] as MotionValue<number>[], ([t, f]: number[]) => peel(t) * (74 + Math.sin(i * 2.3) * 14) + flight(f) * 230);
  const rotateZ = useTransform([tip, fly] as MotionValue<number>[], ([t, f]: number[]) => Math.sin(i * 0.85 + t * 8) * peel(t) * 5 + flight(f) * (c - 0.5) * 120 + Math.sin(flight(f) * 18 + i) * 10 * flight(f));
  const y = useTransform([tip, fly] as MotionValue<number>[], ([t, f]: number[]) => -peel(t) * H * (0.38 + Math.cos(i * 1.7) * 0.08) - flight(f) * H * 4.2 + Math.sin(flight(f) * 14 + i * 0.7) * 8 * flight(f));
  const x = useTransform([fly] as MotionValue<number>[], ([f]: number[]) => (c - 0.5) * flight(f) * 120 - flight(f) * 26);
  const opacity = useTransform(fly, f => 1 - Math.max(0, (flight(f) - 0.5) / 0.5));
  const glare = useTransform([tip, fly] as MotionValue<number>[], ([t, f]: number[]) => Math.min(1, peel(t) * 0.9 + flight(f)));
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ clipPath: `inset(0 ${(1 - (i + 1) / N) * 100 - 0.25}% ${100 - PACK_TEAR_Y}% ${(i / N) * 100 - 0.25}%)`, transformOrigin: `${c * 100}% ${PACK_TEAR_Y}%`, transformPerspective: 500, rotateX, rotateZ, x, y, opacity }}
    >
      <BoosterArt def={def} />
      <motion.div className="absolute inset-0" style={{ opacity: glare, background: `linear-gradient(${100 + i * 6}deg, rgba(255,255,255,0) 15%, rgba(255,255,255,0.65) 45%, rgba(255,255,255,0) 75%)`, mixBlendMode: 'screen' }} />
    </motion.div>
  );
};

const PackTear = ({ def, width, height, onTorn }: { def: BoosterDef; width: number; height: number; onTorn: () => void }) => {
  const tip = useMotionValue(0);
  const fly = useMotionValue(0);
  const [torn, setTorn] = useState(false);
  const [touched, setTouched] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const glowWidth = useTransform(tip, v => `${v * 100}%`);
  const tipLeft = useTransform(tip, v => `${v * 100}%`);
  const finish = () => {
    if (torn) return;
    setTorn(true);
    motionAnimate(tip, 1, { duration: 0.15 });
    motionAnimate(fly, 1, { duration: 1.25, ease: [0.25, 0.6, 0.35, 1] });
    window.setTimeout(onTorn, 750);
  };
  // Progress = how far the finger has travelled along the strip from where it touched down,
  // whichever way it goes (most people swipe left to right, but not all).
  const follow = (clientX: number) => {
    if (torn) return;
    const t = Math.max(tip.get(), Math.min(1, Math.abs(clientX - startX.current) / (width * 0.8)));
    tip.set(t);
    if (t >= 0.94) finish();
  };
  return (
    <div ref={boxRef} className="relative" style={{ width, height }}>
      <motion.div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(${PACK_TEAR_Y}% 0 0 0)`, filter: 'drop-shadow(0 0 22px rgba(232,199,102,0.4))' }} animate={torn ? { opacity: [1, 1, 0], y: [0, 0, 36] } : { opacity: 1, y: 0 }} transition={torn ? { duration: 1.1, times: [0, 0.55, 1], ease: 'easeInOut' } : { duration: 0.2 }}><BoosterArt def={def} /></motion.div>
      {/* a small glow inside the opening only */}
      <motion.div className="absolute pointer-events-none" style={{ left: '0%', right: '0%', top: `${PACK_TEAR_Y - 6}%`, height: '13%', mixBlendMode: 'screen', background: 'radial-gradient(ellipse at 50% 55%, rgba(255,236,170,0.6) 0%, rgba(255,214,102,0.22) 50%, rgba(255,190,80,0) 75%)' }} initial={{ opacity: 0 }} animate={{ opacity: torn ? [0, 0.85, 0.35] : 0 }} transition={{ duration: 0.9, times: [0, 0.3, 1] }} />
      {Array.from({ length: LID_SLICES }).map((_, i) => <LidSlice key={i} i={i} def={def} tip={tip} fly={fly} height={height} />)}
      {/* the part of the cut that is already open shows a thin bright seam */}
      <motion.div className="absolute pointer-events-none" style={{ left: 0, top: `${PACK_TEAR_Y}%`, height: 4, width: glowWidth, y: '-50%', background: 'linear-gradient(to right, rgba(255,240,190,0.9), rgba(255,214,102,0.85))', boxShadow: '0 0 8px 2px rgba(255,214,102,0.7)', borderRadius: 2 }} />
      {/* dashed tear line with a scissors mark, fading once the player has started */}
      <motion.div className="absolute inset-x-[4%] pointer-events-none" style={{ top: `${PACK_TEAR_Y}%`, borderTop: '2.5px dashed rgba(70,40,10,0.85)' }} animate={{ opacity: touched || torn ? 0 : 1 }} />
      <span className="absolute pointer-events-none text-[18px]" style={{ left: '2%', top: `calc(${PACK_TEAR_Y}% - 14px)`, opacity: touched || torn ? 0 : 1, filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))' }}>✂</span>
      {!touched && (
        <motion.span
          className="absolute pointer-events-none text-[22px] font-black text-[#fff1c9]"
          style={{ top: `calc(${PACK_TEAR_Y}% - 15px)`, textShadow: '0 0 8px rgba(0,0,0,0.9)' }}
          animate={{ left: ['8%', '84%'] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        >➜</motion.span>
      )}
      <motion.span className="absolute pointer-events-none rounded-full" style={{ left: tipLeft, top: `${PACK_TEAR_Y}%`, width: 16, height: 16, x: '-50%', y: '-50%', background: 'radial-gradient(circle, #fff6d0, rgba(255,214,102,0.0) 70%)', opacity: touched && !torn ? 1 : 0 }} />
      {/* the swipe area: a generous strip over the tear line, above every other layer */}
      {!torn && (
        <div
          className="absolute inset-x-[-10%]"
          style={{ top: `calc(${PACK_TEAR_Y}% - 34px)`, height: 68, zIndex: 20, touchAction: 'none', cursor: 'grab' }}
          onPointerDown={(e) => { dragging.current = true; startX.current = e.clientX; setTouched(true); try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ } }}
          onPointerMove={(e) => { if (dragging.current) follow(e.clientX); }}
          onPointerUp={(e) => {
            if (!dragging.current) return;
            dragging.current = false;
            const moved = Math.abs(e.clientX - startX.current);
            // a tap, or a swipe let go past the middle, finishes the job
            if (moved < 10 || tip.get() > 0.4) { motionAnimate(tip, 1, { duration: 0.3, onUpdate: v => { if (v >= 0.94) finish(); } }); }
          }}
          onPointerCancel={() => { dragging.current = false; if (tip.get() > 0.4) finish(); }}
          aria-label="Rasgar o booster"
        />
      )}
    </div>
  );
};

const ShopScreen = ({ coroas, onSpend, onClose }: { coroas: number; onSpend: (n: number) => void; onClose: () => void }) => {
  const [phase, setPhase] = useState<ShopPhase>('front');
  const [mood, setMood] = useState<NpcMood>('greet');
  const [zoomed, setZoomed] = useState(false);
  const [selected, setSelected] = useState<{ def: BoosterDef; rect: { left: number; top: number; width: number; height: number } } | null>(null);
  const [pull, setPull] = useState<{ cards: { card: CardData; isNew: boolean; strong: boolean }[]; step: number; phase: 'sealed' | 'stack' | 'summary' } | null>(null);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const boosterEls = useRef<Record<string, HTMLElement | null>>({});
  // Which way each opened card was swiped (so it leaves that way).
  const dirs = useRef<Record<number, number>>({}).current;
  useEffect(() => {
    const on = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const stageW = Math.min(viewport.w, 480);
  // Scene box = the 9:16 canvas scaled to cover the stage.
  const sceneW = Math.max(stageW, viewport.h * 9 / 16);
  const sceneH = sceneW * 16 / 9;
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  // How far the zoomed shelf can be dragged before its edge would show inside the screen.
  const panLimitX = Math.max(0, (SHELF_CLOSEUP * sceneW - stageW) / 2);
  const panLimitY = Math.max(0, (SHELF_CLOSEUP * sceneH - viewport.h) / 2);
  const layerEase = [0.4, 0, 0.2, 1] as const;
  // Aproximar lands on the first shelf's left end, where the boosters start; leaving it recenters.
  useEffect(() => {
    if (zoomed && phase === 'shelf') {
      const fx = SHELF_X0 + 0.15 * (SHELF_X1 - SHELF_X0);
      const fy = SHELF_PLANKS[0];
      const clamp = (v: number, lim: number) => Math.max(-lim, Math.min(lim, v));
      motionAnimate(panX, clamp(-SHELF_CLOSEUP * (fx - 0.5) * sceneW, panLimitX), { duration: 0.5 });
      motionAnimate(panY, clamp((0.32 - 0.5) * viewport.h - SHELF_CLOSEUP * (fy - 0.5) * sceneH, panLimitY), { duration: 0.5 });
    } else if (phase !== 'shelf' || !zoomed) {
      motionAnimate(panX, 0, { duration: 0.4 });
      motionAnimate(panY, 0, { duration: 0.4 });
    }
  }, [zoomed, phase]);
  const dim = phase === 'detail' || phase === 'opening';

  const goShopping = () => {
    setMood('show');
    window.setTimeout(() => setPhase('shelf'), 900);
  };
  const backToCounter = () => { setZoomed(false); setMood('greet'); setPhase('front'); };
  const pickBooster = (def: BoosterDef) => {
    const r = boosterEls.current[def.id]?.getBoundingClientRect();
    if (!r) return;
    setSelected({ def, rect: { left: r.left, top: r.top, width: r.width, height: r.height } });
    setPhase('detail');
  };
  const buy = () => {
    if (!selected) return;
    const { def } = selected;
    if (!TEST_FREE_BOOSTERS) {
      if (coroas < def.price) { setMood('sorry'); return; }
      onSpend(def.price);
    }
    const store = loadDeckStore();
    // Shown from the least to the most rare, so the best card is always the last one revealed.
    const rarity = (c: CardData) => (c.isFullArt ? 10 : 0) + c.cost;
    const rolled = rollBooster(def).sort((a, b) => rarity(a) - rarity(b));
    const cards = rolled.map(card => {
      const isNew = (store.collection[card.name] ?? 0) === 0;
      store.collection[card.name] = (store.collection[card.name] ?? 0) + 1;
      return { card, isNew, strong: rarity(card) >= 4 };
    });
    saveDeckStore(store);
    setMood('happy');
    setPull({ cards, step: 0, phase: 'sealed' });
    setPhase('opening');
  };
  const finishOpening = () => { setPull(null); setSelected(null); setMood('show'); setPhase('shelf'); };

  // Detail: the chosen booster flies from its slot to the middle of the screen.
  const detailW = Math.min(stageW * 0.5, 200);
  const detailH = detailW / BOOSTER_ASPECT;
  const detailTarget = { left: (viewport.w - detailW) / 2, top: viewport.h * 0.14, width: detailW, height: detailH };

  const cardScale = Math.min(1.3, (stageW * 0.72) / 224);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] bg-black flex justify-center text-white overflow-hidden"
    >
      <div className="relative h-full w-full max-w-[480px] overflow-hidden">
        {/* The scene: one 9:16 box covering the screen; every layer below is a full canvas in it */}
        <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ width: sceneW, height: sceneH, transform: 'translate(-50%, -50%)' }}>
          {/* 1 · shelf wall + boosters (farthest). Its own scale is the "camera": pulled back and
              dim at the counter, pushed in for the shelf, further for Aproximar. */}
          <motion.div
            className="absolute inset-0 pointer-events-auto"
            style={{ x: panX, y: panY, touchAction: 'none' }}
            initial={false}
            animate={phase === 'front'
              ? { scale: 1, filter: 'brightness(0.72) blur(1.5px)' }
              : { scale: zoomed ? SHELF_CLOSEUP : SHELF_OVERVIEW, filter: `brightness(${dim ? 0.3 : 1}) blur(0px)` }}
            transition={{ duration: 0.9, ease: layerEase }}
            drag={phase === 'shelf' && zoomed}
            dragConstraints={{ left: -panLimitX, right: panLimitX, top: -panLimitY, bottom: panLimitY }}
            dragElastic={0.08}
          >
            <img src={SHOP_ART.shelf} alt="" draggable={false} className="absolute inset-0 w-full h-full select-none pointer-events-none" />
            {BOOSTERS.map((def, i) => {
              const row = Math.floor(i / SHELF_COLS);
              const col = i % SHELF_COLS;
              const hidden = selected?.def.id === def.id && phase !== 'shelf';
              return (
                <motion.button
                  key={def.id}
                  ref={(el: HTMLButtonElement | null) => { boosterEls.current[def.id] = el; }}
                  aria-label={def.name}
                  onTap={() => { if (phase === 'shelf') { playUiClickSfx(); pickBooster(def); } }}
                  whileHover={{ y: -3 }}
                  className="absolute"
                  style={{
                    left: `${(SHELF_X0 + ((col + 0.5) / SHELF_COLS) * (SHELF_X1 - SHELF_X0)) * 100}%`,
                    bottom: `${(1 - SHELF_PLANKS[row]) * 100 - 0.4}%`,
                    width: `${((SHELF_X1 - SHELF_X0) / SHELF_COLS) * 0.8 * 100}%`,
                    aspectRatio: `${BOOSTER_ASPECT}`,
                    x: '-50%',
                    opacity: hidden ? 0 : 1,
                    pointerEvents: phase === 'shelf' ? 'auto' : 'none',
                  }}
                >
                  <BoosterArt def={def} />
                </motion.button>
              );
            })}
          </motion.div>

          {/* 2 · the merchant */}
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: '50% 45%' }}
            initial={false}
            animate={phase === 'front' ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 1.3, y: -sceneH * 0.04 }}
            transition={{ duration: 0.8, ease: layerEase }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={mood} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <NpcArt mood={mood} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* 3 · the counter (nearest): drops away as the camera turns to the shelf */}
          <motion.img
            src={SHOP_ART.counter}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full select-none"
            initial={false}
            animate={phase === 'front' ? { y: 0, opacity: 1 } : { y: sceneH * 0.32, opacity: 0 }}
            transition={{ duration: 0.7, ease: layerEase }}
          />
        </div>

        {/* Talking at the counter */}
        <AnimatePresence>
          {phase === 'front' && (
            <motion.div key="talk" className="absolute z-40 inset-x-3" style={{ bottom: 'calc(max(10px, env(safe-area-inset-bottom)) + 8px)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
              <FramedWindow>
                <div className="flex flex-col items-center gap-3 px-1 py-1">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={mood} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                      <WindowText>{NPC_LINES[mood]}</WindowText>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex gap-3">
                    <WindowButton onClick={onClose}>Sair</WindowButton>
                    <WindowButton primary onClick={goShopping}>Comprar</WindowButton>
                  </div>
                </div>
              </FramedWindow>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shelf controls */}
        <AnimatePresence>
          {phase === 'shelf' && (
            <motion.div key="shelfui" className="absolute z-40 inset-x-3 flex flex-col gap-2" style={{ top: 'calc(max(10px, env(safe-area-inset-top)) + 4px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5, duration: 0.3 }}>
              <div className="flex items-center gap-2">
                <WindowButton onClick={backToCounter}>Voltar</WindowButton>
                <span className="flex-1 text-center text-[13px] uppercase tracking-[0.14em] text-[#f3e3c3]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700 }}>Prateleira</span>
                <WindowButton onClick={() => setZoomed(z => !z)}>{zoomed ? 'Afastar' : 'Aproximar'}</WindowButton>
              </div>
              <div className="flex justify-between text-[11px] text-[#e8c766]" style={{ fontFamily: "'PT Serif', serif" }}>
                <span>{zoomed ? 'Arraste para mover a prateleira' : 'Toque num booster'}</span>
                <span>{formatCoroas(coroas)} Coroas</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chosen booster: lifts off the shelf, with its price and the Comprar button */}
        <AnimatePresence>
          {phase === 'detail' && selected && (
            <motion.div key="detail" className="fixed inset-0 z-[400]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setPhase('shelf'); setSelected(null); setMood('show'); }}>
              <motion.div
                className="fixed"
                style={{ filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.75))' }}
                initial={selected.rect}
                animate={detailTarget}
                exit={selected.rect}
                transition={{ duration: 0.55, ease: layerEase }}
              >
                <BoosterArt def={selected.def} />
              </motion.div>
              <div className="fixed inset-x-3 mx-auto max-w-[456px]" style={{ bottom: 'calc(max(10px, env(safe-area-inset-bottom)) + 8px)' }} onClick={(e) => e.stopPropagation()}>
                <FramedWindow>
                  <div className="flex flex-col items-center gap-2 px-1 py-1">
                    <WindowTitle>{selected.def.name}</WindowTitle>
                    <WindowText>{mood === 'sorry' ? NPC_LINES.sorry : selected.def.description}</WindowText>
                    <span className="text-[15px] font-black text-[#e8c766]" style={{ fontFamily: "'Cinzel', serif" }}>
                      {TEST_FREE_BOOSTERS
                        ? <>Grátis <span className="text-[11px] font-normal text-[#a89a78]">(versão de teste)</span></>
                        : <>{selected.def.price} Coroas <span className="text-[11px] font-normal text-[#a89a78]">(você tem {formatCoroas(coroas)})</span></>}
                    </span>
                    <div className="flex gap-3">
                      <WindowButton onClick={() => { setPhase('shelf'); setSelected(null); setMood('show'); }}>Voltar</WindowButton>
                      <WindowButton primary onClick={buy}>Comprar</WindowButton>
                    </div>
                  </div>
                </FramedWindow>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opening: dark backdrop, swipe to tear the pack, then the cards come out stacked and the
            player swipes each one aside to see the next (least rare first, best last). */}
        <AnimatePresence>
          {phase === 'opening' && pull && selected && (
            <motion.div key="opening" className="fixed inset-0 z-[500] flex flex-col items-center justify-center gap-6" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(90,60,20,0.85), rgba(0,0,0,0.96) 70%)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {pull.phase === 'sealed' && (
                <>
                  <PackTear def={selected.def} width={detailW * 1.2} height={(detailW * 1.2) / BOOSTER_ASPECT} onTorn={() => setPull(p => (p ? { ...p, phase: 'stack' } : p))} />
                  <span className="text-[13px] uppercase tracking-[0.2em] text-[#f3e3c3] text-center px-6" style={{ fontFamily: "'Cinzel', serif" }}>Deslize o dedo sobre a linha para rasgar</span>
                </>
              )}
              {pull.phase === 'stack' && (
                <div className="flex flex-col items-center gap-8">
                  <div className="relative mb-14" style={{ width: 224 * cardScale, height: 320 * cardScale }}>
                    {pull.cards.map(({ card, isNew, strong }, i) => {
                      const r = i - pull.step;      // 0 = the card on top
                      const seen = r < 0;
                      // Only the top card is ever visible; the rest wait exactly underneath it,
                      // hidden, so what comes next stays a surprise.
                      return (
                        <motion.div
                          key={i}
                          className="absolute inset-0"
                          style={{ zIndex: 100 - r, touchAction: 'none', filter: `drop-shadow(0 0 ${strong ? 26 : 12}px rgba(232,199,102,${strong ? 0.85 : 0.4}))`, cursor: r === 0 ? 'grab' : 'default', pointerEvents: r === 0 ? 'auto' : 'none' }}
                          initial={{ y: 50, scale: 0.55, opacity: 0, rotate: 0 }}
                          animate={seen
                            ? { x: (dirs[i] ?? 1) * 380, y: 0, scale: 0.9, opacity: 0, rotate: (dirs[i] ?? 1) * 16 }
                            : r === 0
                              ? { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }
                              : { x: 0, y: 0, scale: 0.96, opacity: 0, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 240, damping: 24, delay: pull.step === 0 && r === 0 ? 0.1 : 0 }}
                          drag={r === 0 ? 'x' : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.9}
                          onDragEnd={(_, info) => {
                            if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 500) {
                              playUiClickSfx();
                              dirs[i] = info.offset.x < 0 ? -1 : 1;
                              const next = pull.step + 1;
                              setPull({ ...pull, step: next });
                              if (next >= pull.cards.length) window.setTimeout(() => setPull(p => (p ? { ...p, phase: 'summary' } : p)), 450);
                            }
                          }}
                        >
                          <div className="absolute top-0 left-0 pointer-events-none" style={{ width: 224, height: 320, transform: `scale(${cardScale})`, transformOrigin: 'top left' }}>
                            <div className="relative w-full h-full rounded-xl"><CardFace card={card} variant="hand" /></div>
                          </div>
                          {isNew && <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[11px] font-black text-[#fff1c9] bg-[#b8402c] shadow-[0_0_0_2px_#e8c766]" style={{ fontFamily: "'Cinzel', serif" }}>NOVA!</span>}
                        </motion.div>
                      );
                    })}
                  </div>
                  <span className="text-[12px] uppercase tracking-[0.18em] text-[#cdbd97] text-center px-6" style={{ fontFamily: "'Cinzel', serif" }}>
                    {pull.step < pull.cards.length ? `Arraste a carta para o lado · ${pull.cards.length - pull.step} ${pull.cards.length - pull.step === 1 ? 'restante' : 'restantes'}` : ''}
                  </span>
                </div>
              )}
              {pull.phase === 'summary' && (
                <div className="flex flex-col items-center gap-5 px-3">
                  <WindowTitle>Suas cartas</WindowTitle>
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-6">
                    {pull.cards.map(({ card, isNew }, i) => (
                      <motion.div key={i} className="relative" style={{ width: 224 * 0.42, height: 320 * 0.42 }} initial={{ opacity: 0, y: 24, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.09, type: 'spring', stiffness: 260, damping: 22 }}>
                        <div className="absolute top-0 left-0 pointer-events-none" style={{ width: 224, height: 320, transform: 'scale(0.42)', transformOrigin: 'top left' }}>
                          <div className="relative w-full h-full rounded-xl"><CardFace card={card} variant="hand" /></div>
                        </div>
                        {isNew && <span className="absolute -top-1 -right-1 px-1.5 rounded-full text-[8px] font-black text-[#fff1c9] bg-[#b8402c] shadow-[0_0_0_1.5px_#e8c766]" style={{ fontFamily: "'Cinzel', serif" }}>NOVA</span>}
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#a89a78]" style={{ fontFamily: "'PT Serif', serif" }}>As cartas já estão na sua coleção.</span>
                  <WindowButton primary onClick={finishOpening}>Continuar</WindowButton>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ── Login and first-run profile ──────────────────────────────────────────────
// Shown before the main menu: sign in (Google, Discord, e-mail or guest), then pick a name and avatar
// once. The logo that used to sit on the menu lives here. Accounts come from services/auth.ts.
const AuthBackdrop = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed inset-0 z-[250] overflow-hidden bg-black text-white flex justify-center">
    <img src={startScreenBgImage} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/90" />
    <div className="relative w-full max-w-[480px] h-full flex flex-col items-center px-4" style={{ paddingTop: 'max(22px, env(safe-area-inset-top))', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
      <motion.img
        src={logoImage}
        alt="Price of War"
        draggable={false}
        className="w-[15rem] max-w-[72%] select-none pointer-events-none"
        style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.75))' }}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      {children}
    </div>
  </div>
);

const GoogleMark = () => (
  <span className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center text-[14px] font-black leading-none" style={{ fontFamily: 'Arial, sans-serif', color: '#4285F4' }}>G</span>
);
const DiscordMark = () => (
  <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center" style={{ background: '#5865F2' }}>
    <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d="M8 7.2c1.2-.5 2.6-.8 4-.8s2.8.3 4 .8c1.6 2.3 2.4 4.8 2.6 7.6-1.1.9-2.3 1.4-3.6 1.8l-.8-1.3c.4-.2.8-.4 1.2-.7-.9.4-1.8.6-3.4.6s-2.5-.2-3.4-.6c.4.3.8.5 1.2.7l-.8 1.3c-1.3-.4-2.5-.9-3.6-1.8.2-2.8 1-5.3 2.6-7.6zm1.6 4.3a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2zm4.8 0a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z" /></svg>
  </span>
);

const AuthButton = ({ icon, label, onClick, busy = false, primary = false }: { icon?: React.ReactNode; label: string; onClick: () => void; busy?: boolean; primary?: boolean }) => (
  <button onClick={() => { if (!busy) { playUiClickSfx(); onClick(); } }} disabled={busy} className={`block w-full active:brightness-125 active:scale-[0.98] transition ${busy ? 'opacity-60' : ''}`}>
    <ThinFrame px={13} style={{ background: primary ? 'rgba(122,90,22,0.6)' : 'rgba(20,13,6,0.55)' }}>
      <span className="flex items-center justify-center gap-2.5 py-1.5 text-[13px] uppercase tracking-[0.1em] text-[#f3e3c3]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
        {icon}{label}
      </span>
    </ThinFrame>
  </button>
);

const authFieldClass = 'block w-full bg-transparent px-2 py-1.5 text-[14px] text-[#f3e3c3] placeholder:text-[#8d7f60] outline-none';

const LoginScreen = () => {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [errorDetail, setErrorDetail] = useState('');
  const [note, setNote] = useState('');
  const [emailOpen, setEmailOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const run = async (key: string, fn: () => Promise<void>) => {
    setError(''); setErrorDetail(''); setNote(''); setBusy(key);
    try { await fn(); } catch (e) { console.error('auth error', e); setError(authErrorText(e)); setErrorDetail(authErrorDetail(e)); } finally { setBusy(null); }
  };
  const submitEmail = () => run('email', async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error('valid email');
    if (password.length < 6) throw new Error('password 6');
    const r = await signInEmail(email.trim(), password, mode);
    if (r.needsConfirmation) setNote('Enviamos um e-mail de confirmação. Abra o link e depois toque em "Entrar".');
  });
  return (
    <AuthBackdrop>
      <div className="flex-1" />
      <motion.div className="w-full" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}>
        <FramedWindow>
          <div className="flex flex-col gap-2.5 px-1 py-1">
            <WindowTitle>Entrar</WindowTitle>
            <AuthButton icon={<GoogleMark />} label="Continuar com Google" busy={busy === 'google'} onClick={() => run('google', () => signInOAuth('google'))} />
            <AuthButton icon={<DiscordMark />} label="Continuar com Discord" busy={busy === 'discord'} onClick={() => run('discord', () => signInOAuth('discord'))} />
            {!emailOpen ? (
              <AuthButton label="Entrar com e-mail" onClick={() => setEmailOpen(true)} />
            ) : (
              <div className="flex flex-col gap-2">
                <ThinFrame px={11} style={{ background: 'rgba(0,0,0,0.35)' }}>
                  <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className={authFieldClass} style={{ fontFamily: "'PT Serif', serif" }} />
                </ThinFrame>
                <ThinFrame px={11} style={{ background: 'rgba(0,0,0,0.35)' }}>
                  <input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submitEmail(); }} placeholder="Senha (mín. 6 caracteres)" className={authFieldClass} style={{ fontFamily: "'PT Serif', serif" }} />
                </ThinFrame>
                <AuthButton primary label={mode === 'signin' ? 'Entrar' : 'Criar conta'} busy={busy === 'email'} onClick={submitEmail} />
                <button onClick={() => { playUiClickSfx(); setMode(m => (m === 'signin' ? 'signup' : 'signin')); setError(''); setNote(''); }} className="text-[12px] text-[#e8c766] underline underline-offset-4 self-center" style={{ fontFamily: "'PT Serif', serif" }}>
                  {mode === 'signin' ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
                </button>
              </div>
            )}
            {error && <p className="text-center text-[12px] text-[#f0a595]" style={{ fontFamily: "'PT Serif', serif" }}>{error}</p>}
            {error && errorDetail && <p className="text-center text-[9.5px] leading-snug text-[#8d7f60] break-words" style={{ fontFamily: 'monospace' }}>{errorDetail}</p>}
            {note && <p className="text-center text-[12px] text-[#8fe0a4]" style={{ fontFamily: "'PT Serif', serif" }}>{note}</p>}
            <div className="flex items-center gap-2 px-2 pt-0.5"><div className="flex-1 h-px bg-[#d4af37]/30" /><span className="text-[10px] uppercase tracking-[0.2em] text-[#a89a78]" style={{ fontFamily: "'Cinzel', serif" }}>ou</span><div className="flex-1 h-px bg-[#d4af37]/30" /></div>
            <AuthButton label="Jogar como convidado" busy={busy === 'guest'} onClick={() => run('guest', signInGuest)} />
            {authMode === 'local' && (
              <p className="text-center text-[10.5px] leading-snug text-[#a89a78]" style={{ fontFamily: "'PT Serif', serif" }}>
                Versão de teste: as contas online ainda não foram configuradas, então só o modo convidado funciona por enquanto.
              </p>
            )}
          </div>
        </FramedWindow>
      </motion.div>
    </AuthBackdrop>
  );
};

const NAME_RULE = /^[\p{L}\p{N} _.\-]{3,16}$/u;
// `onSubmit` resolves to an error message (name taken, no connection...) or null on success.
const ProfileSetupScreen = ({ initialName, initialAvatar, onSubmit }: { initialName: string; initialAvatar: string; onSubmit: (name: string, avatarId: string) => Promise<string | null> }) => {
  const [name, setName] = useState(initialName === DEFAULT_PROFILE.name ? '' : initialName);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [checking, setChecking] = useState(false);
  const [taken, setTaken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const trimmed = name.trim().replace(/\s+/g, ' ');
  const valid = NAME_RULE.test(trimmed);
  // With real accounts the name must be unique: ask the server (after a short pause in typing).
  useEffect(() => {
    setTaken(false);
    if (authMode !== 'supabase' || !valid) { setChecking(false); return; }
    setChecking(true);
    let alive = true;
    const t = window.setTimeout(async () => {
      const free = await usernameAvailable(trimmed);
      if (!alive) return;
      setTaken(free === false);
      setChecking(false);
    }, 450);
    return () => { alive = false; window.clearTimeout(t); };
  }, [trimmed, valid]);
  const hint = trimmed.length === 0 ? 'Escolha um nome de 3 a 16 caracteres.' : trimmed.length < 3 ? 'Muito curto: use pelo menos 3 caracteres.' : !valid ? 'Use só letras, números, espaço, _ . ou -' : taken ? 'Esse nome já está em uso.' : '';
  const canGo = valid && !taken && !checking && !saving;
  const go = async () => {
    if (!canGo) return;
    setSaving(true); setSubmitError('');
    const err = await onSubmit(trimmed, avatar);
    if (err) { setSubmitError(err); setSaving(false); if (/em uso/i.test(err)) setTaken(true); }
  };
  return (
    <AuthBackdrop>
      <div className="flex-1" />
      <motion.div className="w-full" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <FramedWindow>
          <div className="flex flex-col items-center gap-3 px-1 py-1">
            <WindowTitle>Crie seu perfil</WindowTitle>
            <WindowText>Assim os outros jogadores vão ver você.</WindowText>
            <div className="grid grid-cols-3 gap-x-5 gap-y-3">
              {AVATAR_OPTIONS.map(a => (
                <button key={a.id} onClick={() => { playUiClickSfx(); setAvatar(a.id); }} className="relative active:scale-95 transition-transform" aria-label={`Avatar ${a.id}`}>
                  <AvatarBadge avatarId={a.id} size={62} />
                  {a.id === avatar && <div className="absolute -inset-1 rounded-full border-2 border-[#8fe0a4]" />}
                </button>
              ))}
            </div>
            <div className="w-full">
              <ThinFrame px={11} style={{ background: 'rgba(0,0,0,0.35)' }}>
                <input value={name} onChange={(e) => { setName(e.target.value.slice(0, 16)); setSubmitError(''); }} onKeyDown={(e) => { if (e.key === 'Enter') void go(); }} placeholder="Nome do comandante" maxLength={16} autoFocus className={`${authFieldClass} text-center`} style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }} />
              </ThinFrame>
              <p className={`text-center text-[11px] mt-1.5 ${hint || submitError ? 'text-[#f0c9a0]' : checking ? 'text-[#a89a78]' : 'text-[#8fe0a4]'}`} style={{ fontFamily: "'PT Serif', serif" }}>
                {submitError || hint || (checking ? 'Verificando…' : '✓ Nome disponível')}
              </p>
            </div>
            <div className={canGo ? '' : 'opacity-40 pointer-events-none'}>
              <WindowButton primary onClick={() => void go()}>{saving ? 'Criando…' : 'Começar'}</WindowButton>
            </div>
          </div>
        </FramedWindow>
      </motion.div>
    </AuthBackdrop>
  );
};

// Som: overall volume, music and effects (a bar each) and a mute switch. Saved on the device (src/audioSettings.ts) and applied live.
const VolumeRow = ({ label, value, onChange, onRelease, dim }: { label: string; value: number; onChange: (v: number) => void; onRelease?: () => void; dim?: boolean }) => (
  <div className={`w-full flex flex-col gap-1.5 transition-opacity ${dim ? 'opacity-45' : ''}`}>
    <div className="flex items-baseline justify-between">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[#d8c9a3]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>{label}</span>
      <span className="text-[12px] tabular-nums text-[#f3e3c3]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>{Math.round(value * 100)}%</span>
    </div>
    <input
      type="range" min={0} max={100} step={1} value={Math.round(value * 100)} aria-label={label}
      className="vol-range" style={{ ['--v' as string]: `${Math.round(value * 100)}%` }}
      onChange={e => onChange(Number(e.target.value) / 100)}
      onPointerUp={onRelease} onKeyUp={onRelease}
    />
  </div>
);
const ToggleRow = ({ label, sub, on, onChange }: { label: string; sub: string; on: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => { playUiClickSfx(); onChange(!on); }} className="w-full flex items-center justify-between gap-3 text-left active:scale-[0.98] transition" role="switch" aria-checked={on}>
    <span className="flex flex-col">
      <span className="text-[11px] uppercase tracking-[0.14em] text-[#d8c9a3]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>{label}</span>
      <span className="text-[11px] leading-snug text-[#a89a78]" style={{ fontFamily: "'PT Serif', serif" }}>{sub}</span>
    </span>
    <span className="shrink-0 relative rounded-full transition-colors" style={{ width: 44, height: 24, background: on ? 'rgba(180,134,36,0.9)' : 'rgba(60,48,30,0.9)', border: '1px solid rgba(232,220,192,0.55)' }}>
      <span className="absolute top-[2px] rounded-full transition-all" style={{ width: 18, height: 18, left: on ? 22 : 2, background: on ? '#fff0c4' : '#9b8d6c' }} />
    </span>
  </button>
);
// Opções: the optional on-screen hints and the sound (overall, music, effects, mute). Reachable from the menu and during a match.
const OptionsModal = ({ onClose }: { onClose: () => void }) => {
  const a = useAudioSettings();
  const g = useGameSettings();
  return (
    <WindowOverlay onClose={onClose}>
      <FramedWindow>
        <div className="flex flex-col items-center gap-4 px-2 py-2 w-[min(82vw,330px)]">
          <WindowTitle>Opções</WindowTitle>
          <div className="w-full flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#a89a78]" style={{ fontFamily: "'Cinzel', serif" }}>Avisos na tela</span>
            <ToggleRow label="Dicas de arrastar" sub="Dedo sobre a mão, “segure e arraste” e “solte aqui”." on={g.hintsDrag} onChange={v => setGameSettings({ hintsDrag: v })} />
            <ToggleRow label="Dicas no tabuleiro" sub="Palavras nas casas (Ataca, Reserva, Protegida) e nos alvos das Táticas." on={g.hintsBoard} onChange={v => setGameSettings({ hintsBoard: v })} />
          </div>
          <div className="w-full flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#a89a78]" style={{ fontFamily: "'Cinzel', serif" }}>Som</span>
            <VolumeRow label="Geral" value={a.master} dim={a.muted} onChange={v => setAudioSettings({ master: v })} />
            <VolumeRow label="Música" value={a.music} dim={a.muted} onChange={v => setAudioSettings({ music: v })} />
            <VolumeRow label="Efeitos" value={a.effects} dim={a.muted} onChange={v => setAudioSettings({ effects: v })} onRelease={() => playSelectSfx()} />
          </div>
          <div className="flex gap-3">
            <WindowButton primary={a.muted} onClick={() => setAudioSettings({ muted: !a.muted })}>{a.muted ? 'Ativar som' : 'Mudo'}</WindowButton>
            <WindowButton onClick={onClose}>Fechar</WindowButton>
          </div>
        </div>
      </FramedWindow>
    </WindowOverlay>
  );
};

const SettingsModal = ({ session, profileName, onClose }: { session: Session | null; profileName: string; onClose: () => void }) => {
  const [confirming, setConfirming] = useState(false);
  const how = !session ? '' : session.guest ? 'Convidado' : session.provider === 'google' ? 'Google' : session.provider === 'discord' ? 'Discord' : 'E-mail';
  return (
    <WindowOverlay onClose={onClose}>
      <FramedWindow>
        <div className="flex flex-col items-center gap-3 px-2 py-2">
          <WindowTitle>Configurações</WindowTitle>
          <div className="w-full flex flex-col gap-1 text-center">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#a89a78]" style={{ fontFamily: "'Cinzel', serif" }}>Conta</span>
            <span className="text-[15px] text-[#f3e3c3]" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>{profileName}</span>
            <span className="text-[12px] text-[#cdbd97]" style={{ fontFamily: "'PT Serif', serif" }}>{how}{session?.email ? ` · ${session.email}` : ''}</span>
          </div>
          {session?.guest && (
            <WindowText>Como convidado, seu progresso existe só neste aparelho. Ligue uma conta para não perdê-lo.</WindowText>
          )}
          {!confirming ? (
            <div className="flex gap-3">
              <WindowButton onClick={onClose}>Fechar</WindowButton>
              <WindowButton onClick={() => setConfirming(true)}>Sair da conta</WindowButton>
            </div>
          ) : (
            <>
              <WindowText>{session?.guest ? 'Sair agora pode fazer você perder o acesso a este progresso de convidado. Sair mesmo?' : 'Sair desta conta?'}</WindowText>
              <div className="flex gap-3">
                <WindowButton onClick={() => setConfirming(false)}>Cancelar</WindowButton>
                <WindowButton primary onClick={() => { void signOut(); onClose(); }}>Sair</WindowButton>
              </div>
            </>
          )}
        </div>
      </FramedWindow>
    </WindowOverlay>
  );
};

// Short metallic "ting" for the coin landing (Web Audio, no asset), shared audio context with the banners.
const playCoinSfx = (kind: 'toss' | 'land') => {
  const lvl = sfxLevel();
  if (lvl <= 0) return;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    bannerAudioCtx = bannerAudioCtx ?? new AC();
    const ctx = bannerAudioCtx;
    if (ctx.state === 'suspended') void ctx.resume();
    const t0 = ctx.currentTime;
    const notes = kind === 'toss' ? [[900, 0], [1350, 0.06]] : [[2100, 0], [2800, 0.05], [1400, 0.11]];
    notes.forEach(([f, d]) => {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, t0 + d);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0 + d);
      g.gain.exponentialRampToValueAtTime((kind === 'toss' ? 0.12 : 0.2) * lvl, t0 + d + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + (kind === 'toss' ? 0.25 : 0.7));
      o.connect(g).connect(ctx.destination);
      o.start(t0 + d);
      o.stop(t0 + d + 0.8);
    });
  } catch { /* audio is optional */ }
};

// The coin: the two delivered faces (Cara / Coroa) set on either side of a stack of thin gold discs, so
// when it spins edge-on it has real thickness instead of vanishing into a line.
const COIN_THICK = 9;
const CoinFace = ({ side }: { side: 'cara' | 'coroa' }) => (
  <img
    src={side === 'cara' ? coinCaraImage : coinCoroaImage}
    alt=""
    draggable={false}
    className="absolute inset-0 w-full h-full select-none"
    style={{ transform: side === 'cara' ? `translateZ(${COIN_THICK / 2}px)` : `rotateX(180deg) translateZ(${COIN_THICK / 2}px)`, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
  />
);
const CoinRim = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{ inset: '3.2%', transform: `translateZ(${(i / 7 - 0.5) * (COIN_THICK - 1)}px)`, background: i % 2 ? 'linear-gradient(90deg, #a87820, #d6a93a 50%, #a87820)' : 'linear-gradient(90deg, #8f6416, #c2931f 50%, #8f6416)' }}
      />
    ))}
  </>
);

// Before BATALHA: nobody chooses anything. Each player is GIVEN a side of the coin ("Você é Cara" / "Você é Coroa"),
// the coin is tossed, and whoever holds the side that lands up plays first. Online the server hands out the sides
// (so two players can never pick the same one) and already knows who goes first (`forced`); against the AI the
// side and the landing are drawn here. `onResolved` hands the winner back to the match intro.
// The winner of the toss then picks to play first or second (`canChoose`). Against the AI the player picks here, and when the
// AI wins it picks at random. Online (`remote`) the server holds the choice: the winner sends it with `choose`, and `pick`
// (who goes first, once known) comes back from the server for both players. In the tutorial the result still decides it.
type RemotePick = { choose: (who: 'player' | 'npc') => Promise<boolean>; pick: 'player' | 'npc' | null };
const CoinToss = ({ onResolved, mySide, forced, canChoose = false, remote }: { onResolved: (first: 'player' | 'npc') => void; mySide: 'cara' | 'coroa'; forced?: 'player' | 'npc'; canChoose?: boolean; remote?: RemotePick; key?: React.Key }) => {
  const [aiPick] = useState<'player' | 'npc'>(() => (Math.random() < 0.5 ? 'npc' : 'player'));
  const [myPick, setMyPick] = useState<'player' | 'npc' | null>(null);
  const [sending, setSending] = useState(false);
  const [phase, setPhase] = useState<'assign' | 'flip' | 'result'>('assign');
  const [result] = useState<'cara' | 'coroa'>(() => (forced ? (forced === 'player' ? mySide : mySide === 'cara' ? 'coroa' : 'cara') : Math.random() < 0.5 ? 'cara' : 'coroa'));
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const t = timers.current;
    // The side is shown on its own for a beat, then the coin goes up by itself.
    t.push(window.setTimeout(() => { setPhase('flip'); playCoinSfx('toss'); }, 2000));
    t.push(window.setTimeout(() => { setPhase('result'); playCoinSfx('land'); }, 3900));
    if (!canChoose) t.push(window.setTimeout(() => onResolved(mySide === result ? 'player' : 'npc'), 5700));
    return () => { t.forEach(clearTimeout); };
  }, []);
  const label = (side: 'cara' | 'coroa') => (side === 'cara' ? 'Cara' : 'Coroa');
  const other = mySide === 'cara' ? 'coroa' : 'cara';
  const won = mySide === result;
  // Who goes first, once somebody has decided (null while the winner is still choosing).
  const decided = !canChoose ? null : remote ? remote.pick : won ? myPick : aiPick;
  useEffect(() => {
    if (!canChoose || phase !== 'result' || decided === null) return;
    const t = window.setTimeout(() => onResolved(decided), won ? 700 : 2200);
    return () => window.clearTimeout(t);
  }, [phase, decided]);
  const finalTurns = 9 * 360 + (result === 'cara' ? 0 : 180);
  const restTurns = mySide === 'cara' ? 0 : 180;   // while waiting, the coin shows the player's own face
  return (
    <motion.div className="fixed inset-0 z-[950] flex flex-col items-center justify-end pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* the coin hangs above the two Generals so it never overlaps them */}
      <div className="absolute left-1/2" style={{ top: '19vh', width: 120, height: 120, perspective: 800, marginLeft: -60 }}>
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ y: 0, rotateX: restTurns, scale: 1 }}
          animate={phase === 'assign' ? { y: [0, -6, 0], rotateX: restTurns, scale: 1 } : { y: [0, -150, 0, -16, 0], rotateX: finalTurns, scale: [1, 2.3, 1, 1, 1] }}
          transition={phase === 'assign' ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 1.8, times: [0, 0.42, 0.82, 0.92, 1], ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'] }}
        >
          <CoinRim />
          <CoinFace side="cara" />
          <CoinFace side="coroa" />
        </motion.div>
        <motion.div className="absolute left-1/2 -bottom-5 h-3 rounded-full bg-black/60 blur-md" style={{ x: '-50%' }} initial={{ width: 90 }} animate={phase === 'flip' ? { width: [90, 40, 90, 80, 90], opacity: [0.6, 0.25, 0.6, 0.5, 0.6] } : { width: 90 }} transition={{ duration: 1.8, times: [0, 0.42, 0.82, 0.92, 1] }} />
      </div>
      <div className="w-full max-w-[420px] px-5 flex flex-col items-center gap-3 pointer-events-none" style={{ paddingBottom: 'calc(max(18px, env(safe-area-inset-bottom)) + 7vh)', minHeight: 200 }}>
        {phase !== 'result' && (
          <motion.div className="flex flex-col items-center gap-1.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[12px] uppercase tracking-[0.22em] text-[#dccfae]" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>Você é</span>
            <span className="text-[30px] uppercase tracking-[0.12em] text-[#fff1c9]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.95)' }}>{label(mySide)}</span>
            <span className="text-[12px] text-[#dccfae] text-center" style={{ fontFamily: "'PT Serif', serif", textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
              {phase === 'assign' ? `O adversário é ${label(other)}. Quem ganhar o sorteio escolhe quem começa.` : 'A moeda está no ar…'}
            </span>
          </motion.div>
        )}
        {phase === 'result' && (
          <motion.div className="flex flex-col items-center gap-1" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
            <span className="text-[13px] uppercase tracking-[0.2em] text-[#dccfae]" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>Deu {label(result)}!</span>
            <span className="text-[20px] uppercase tracking-[0.12em]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700, color: decided === 'player' || (canChoose && won && decided === null) || (!canChoose && won) ? '#8fe0a4' : canChoose && decided === null ? '#f3e3c3' : '#f0a595', textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>{canChoose ? (decided === null ? (won ? 'Você escolhe!' : 'O adversário escolhe…') : (decided === 'player' ? 'Você começa!' : 'O adversário começa!')) : (won ? 'Você começa!' : 'O adversário começa!')}</span>
            {canChoose && !won && <span className="text-[12px] text-[#dccfae]" style={{ fontFamily: "'PT Serif', serif", textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{decided === null ? 'Aguardando a decisão dele…' : `O adversário escolheu ir ${decided === 'npc' ? 'primeiro' : 'depois'}.`}</span>}
            {canChoose && won && decided === null && (
              <div className="flex gap-3 mt-3 pointer-events-auto">
                {([['player', 'Começar'], ['npc', 'Ir depois']] as const).map(([who, text]) => (
                  <GameButton key={who} tone={who === 'player' ? 'primary' : 'neutral'} size={15}
                    className={sending || myPick !== null ? 'opacity-40' : ''}
                    onClick={() => {
                      if (sending || myPick !== null) return;
                      if (!remote) { setMyPick(who); return; }
                      setSending(true);
                      void remote.choose(who).then(ok => { if (!ok) setSending(false); });
                    }}>{text}</GameButton>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// "Procurando adversário" -> "Adversário encontrado" before the match loads. For now the opponent is the
// AI; the same screen will front the real matchmaking queue.
const MatchSearchOverlay = ({ onReady, onCancel }: { onReady: () => void; onCancel: () => void; key?: React.Key }) => {
  const [found, setFound] = useState(false);
  useEffect(() => {
    const t1 = window.setTimeout(() => { setFound(true); playBannerSfx('turn'); }, 1800 + Math.random() * 1600);
    return () => window.clearTimeout(t1);
  }, []);
  useEffect(() => {
    if (!found) return;
    const t = window.setTimeout(onReady, 1700);
    return () => window.clearTimeout(t);
  }, [found]);
  return (
    <motion.div className="fixed inset-0 z-[600] flex flex-col items-center justify-center gap-5 bg-black/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {!found ? (
        <>
          <motion.div className="w-14 h-14 rounded-full border-4 border-[#d4af37]/30 border-t-[#e8c766]" animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />
          <span className="text-[16px] uppercase tracking-[0.16em] text-[#fff1c9]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700 }}>Procurando adversário…</span>
          <span className="text-[11px] text-[#a89a78] text-center px-8" style={{ fontFamily: "'PT Serif', serif" }}>Versão de teste: o adversário é controlado pela IA.</span>
          <WindowButton onClick={onCancel}>Cancelar</WindowButton>
        </>
      ) : (
        <motion.div className="flex flex-col items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
          <span className="text-[22px] uppercase tracking-[0.14em] text-[#8fe0a4]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Adversário encontrado!</span>
          <span className="text-[12px] uppercase tracking-[0.2em] text-[#dccfae]" style={{ fontFamily: "'Cinzel', serif" }}>A batalha está a caminho…</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// The real queue: "Procurando adversário" while the server looks for another player (or hands the chair to the AI
// after a short wait), then "Adversário encontrado" with who it is. `challenge` is a match against the AI that still
// goes through the same server (Desafios).
const OnlineSearchOverlay = ({ selection, challenge, onMatched, onCancel, onUnavailable }: {
  selection: DeckSelection; challenge: boolean; onMatched: (init: MatchInit) => void; onCancel: () => void; onUnavailable?: () => void; key?: React.Key;
}) => {
  const [stage, setStage] = useState<{ kind: 'searching' } | { kind: 'found'; init: MatchInit } | { kind: 'error'; message: string }>({ kind: 'searching' });
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const found = (init: MatchInit) => { if (cancelled) return; playBannerSfx('turn'); setStage({ kind: 'found', init }); };
    const poll = async () => {
      if (cancelled) return;
      const r = await queueStatus();
      if (cancelled) return;
      if (r.ok === true && r.status === 'matched') return found(r.match);
      if (r.ok === false && !r.unavailable) { setStage({ kind: 'error', message: r.error }); return; }
      timer = window.setTimeout(poll, 1200);
    };
    (async () => {
      await flushCloudSync();
      const r = await queueForMatch({ general: selection.general, cards: selection.cards }, challenge);
      if (cancelled) return;
      if (r.ok === false) {
        if (r.unavailable && onUnavailable) { onUnavailable(); return; }
        setStage({ kind: 'error', message: r.error });
        return;
      }
      if (r.status === 'matched') return found(r.match);
      timer = window.setTimeout(poll, 1200);
    })();
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, []);
  useEffect(() => {
    if (stage.kind !== 'found') return;
    const t = window.setTimeout(() => onMatched(stage.init), 1700);
    return () => window.clearTimeout(t);
  }, [stage]);
  const cancel = () => { void cancelQueue(); onCancel(); };
  return (
    <motion.div className="fixed inset-0 z-[600] flex flex-col items-center justify-center gap-5 bg-black/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {stage.kind === 'searching' && (
        <>
          <motion.div className="w-14 h-14 rounded-full border-4 border-[#d4af37]/30 border-t-[#e8c766]" animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />
          <span className="text-[16px] uppercase tracking-[0.16em] text-[#fff1c9]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700 }}>{challenge ? 'Preparando o desafio…' : 'Procurando adversário…'}</span>
          {!challenge && <span className="text-[11px] text-[#a89a78] text-center px-8" style={{ fontFamily: "'PT Serif', serif" }}>Se ninguém aparecer em cerca de 15 segundos, um adversário controlado pela IA assume a partida.</span>}
          <WindowButton onClick={cancel}>Cancelar</WindowButton>
        </>
      )}
      {stage.kind === 'found' && (
        <motion.div className="flex flex-col items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}>
          <span className="text-[22px] uppercase tracking-[0.14em] text-[#8fe0a4]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{challenge ? 'Desafio pronto!' : 'Adversário encontrado!'}</span>
          <span className="text-[14px] uppercase tracking-[0.18em] text-[#fff1c9]" style={{ fontFamily: "'Cinzel', serif" }}>{stage.init.opponent.bot ? `${stage.init.opponent.name} (IA)` : stage.init.opponent.name}</span>
          <span className="text-[12px] uppercase tracking-[0.2em] text-[#dccfae]" style={{ fontFamily: "'Cinzel', serif" }}>A batalha está a caminho…</span>
        </motion.div>
      )}
      {stage.kind === 'error' && (
        <>
          <span className="text-[16px] uppercase tracking-[0.14em] text-[#f0a595]" style={{ fontFamily: WINDOW_FONT_DECO, fontWeight: 700 }}>Não foi possível entrar</span>
          <span className="text-[12px] text-[#dccfae] text-center px-8" style={{ fontFamily: "'PT Serif', serif" }}>{stage.message}</span>
          <WindowButton primary onClick={onCancel}>Voltar</WindowButton>
        </>
      )}
    </motion.div>
  );
};

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
  // Who is signed in (see services/auth.ts). `authReady` waits for the first answer so the login
  // screen does not flash for someone who is already signed in.
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileNamed, setProfileNamed] = useState(() => (authMode === 'local' ? loadProfile().nameSet : false));
  // With real accounts the profile lives in the cloud: wait for it before showing the menu.
  const [profileLoading, setProfileLoading] = useState(authMode === 'supabase');
  const [profileError, setProfileError] = useState('');
  const [profileTry, setProfileTry] = useState(0);
  useEffect(() => {
    if (authMode !== 'supabase') return;
    if (!session) { stopCloudSync(); setProfileNamed(false); setProfileLoading(false); setProfileError(''); return; }
    let alive = true;
    setProfileLoading(true); setProfileError('');
    fetchProfile(session.userId).then(async r => {
      if (!alive) return;
      if (r.ok === false) { setProfileError(r.message); setProfileLoading(false); return; }
      if (r.data) {
        const row = r.data;
        const syncErr = await syncDeckStoreWithCloud(session.userId);
        if (!alive) return;
        if (syncErr) { setProfileError(syncErr); setProfileLoading(false); return; }
        saveProfile({ ...DEFAULT_PROFILE, name: row.username, avatarId: AVATAR_OPTIONS.some(a => a.id === row.avatar_id) ? row.avatar_id : DEFAULT_PROFILE.avatarId, level: row.level, xp: row.xp, coroas: row.coroas, xpToNext: xpToNext(row.level), nameSet: true });
        setProfileNamed(true);
      } else {
        setProfileNamed(false);
      }
      setProfileLoading(false);
    });
    return () => { alive = false; };
  }, [session?.userId, profileTry]);
  useEffect(() => {
    let alive = true;
    getSession().then(sn => { if (alive) { setSession(sn); setAuthReady(true); } }).catch(() => { if (alive) setAuthReady(true); });
    const off = onSessionChange(sn => { setSession(sn); setAuthReady(true); });
    return () => { alive = false; off(); };
  }, []);
  const [gameMode, setGameMode] = useState<string | null>(null);
  // ── Tutorial (see src/tutorial): the director's state ──
  type TutState = { id: string; idx: number; beat: TutStep[] | null; beatIdx: number; beatDone: (() => void) | null; token: number; enemyRound: number; enemyDone: number };
  const tutRef = useRef<TutState | null>(null);
  const [tutOn, setTutOn] = useState(false);                         // a tutorial is running (gates the taps)
  const [tutShown, setTutShown] = useState<TutStep | null>(null);    // the step on screen (null while the board settles or the trainer plays)
  const [tutReplay, setTutReplay] = useState(0);
  const [tutTracker, setTutTracker] = useState<TurnPhase | null>(null);   // phase the turn panel shows during a step
  const [tutIntro, setTutIntro] = useState(false);
  const [tutListOpen, setTutListOpen] = useState(false);
  const tutAllowRef = useRef<{ x: number; y: number; w: number; h: number }[]>([]);
  const tutBusyRef = useRef(false);
  const tutCoinRef = useRef<{ acked: boolean; resolved: 'player' | 'npc' | null }>({ acked: false, resolved: null });
  // Quick Match asks which deck to play before actually starting the match —
  // see DECKS above and the DeckPickerModal rendered in the !gameMode branch.
  const [deckPickerOpen, setDeckPickerOpen] = useState(false);
  // Online Casual: which deck was chosen while the "searching for an opponent" screen is up.
  const [deckPickerFor, setDeckPickerFor] = useState<'desafios' | 'casual'>('desafios');
  const [searching, setSearching] = useState<{ sel: DeckSelection; challenge: boolean } | null>(null);

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
  const duelMusicGainRef = useRef<GainNode | null>(null);
  useEffect(() => subscribeAudio(() => { if (duelMusicGainRef.current) duelMusicGainRef.current.gain.value = MUSIC_BASE_GAIN * musicLevel(); }), []);
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
      [attackSfxUrl, destroySfxUrl, effectSfxUrl].forEach(preloadSfx);   // decoded now, so the first blow / burn starts on time
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
      gain.gain.value = MUSIC_BASE_GAIN * musicLevel();   // 60% of the level it first shipped at; the player's Som settings scale it (and follow live, below)
      duelMusicGainRef.current = gain;
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
  const [npcVisiblePhase, setNpcVisiblePhase] = useState<TurnPhase | null>(null);
  // Compra / Suprimentos run by themselves at the start of the player's turn; this lets the panel show them in passing.
  const [autoPhase, setAutoPhase] = useState<TurnPhase | null>(null);
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
  const [pendingTacticAction, setPendingTacticAction] = useState<{ card: CardData } | null>(null);
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
  // currentTurn === 'player' effect) and caps at 1 (see playerGeneralAbilityMaxUses).
  const [playerGeneralAbilityUses, setPlayerGeneralAbilityUses] = useState(0);
  const [npcGeneralAbilityUses, setNpcGeneralAbilityUses] = useState(0);
  // "Ativar habilidade?" — a plain activate/cancel prompt on the General itself
  // (see activateGeneralHeal below for the fixed 2-gold cost this commits to).
  // Set once the player has committed to activating and chosen an amount — now
  // waiting for them to click the actual ally to heal, same two-step shape as
  // pendingTacticAction above.
  // An ability of a card on the board (the General's, Mercador's, Hospitalário's…) that asks for board choices: `step` is which of
  // its targeted effects is being chosen now and `picks` what was chosen so far (see activateAbility).
  const [pendingAbility, setPendingAbility] = useState<{ slot: number; step: number; picks: (number | undefined)[] } | null>(null);
  const pendingAbilityRef = useRef(pendingAbility);
  pendingAbilityRef.current = pendingAbility;

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
    // At least this many must be chosen to confirm (1 for the reveal/search prompts, the exact count for a discard).
    minPicks: number;
    // True when even a single pick needs the Confirmar button (a discard is not undone by a mis-tap).
    alwaysConfirm: boolean;
    selected: CardData[];
    onConfirm: (picked: CardData[]) => void;
  } | null>(null);
  const openCardPicker = (title: string, options: CardData[], maxPicks: number, onConfirm: (picked: CardData[]) => void, extra: { minPicks?: number; alwaysConfirm?: boolean } = {}) => {
    setCardPicker({ title, options, maxPicks, minPicks: extra.minPicks ?? 1, alwaysConfirm: !!extra.alwaysConfirm, selected: [], onConfirm });
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
  const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; x: number; y: number; text: string; kind: 'damage' | 'heal' | 'gold-gain' | 'gold-spend' | 'shield' }[]>([]);
  const floatingNumberIdRef = useRef(0);
  const spawnFloatingNumber = (x: number, y: number, value: number, kind: 'damage' | 'heal' | 'gold-gain' | 'gold-spend' | 'shield') => {
    if (value === 0) return;
    const id = ++floatingNumberIdRef.current;
    const text = (kind === 'heal' || kind === 'gold-gain') ? `+${value}` : `-${value}`;
    // A little horizontal jitter so two numbers landing on the same spot at once
    // (e.g. an attacker and defender trading damage right next to each other, or
    // Trabuco de Cerco's AOE hitting a whole row at once) don't render as one
    // unreadable stack of overlapping digits.
    const jitterX = x + (Math.random() - 0.5) * 16;
    setFloatingNumbers(prev => [...prev, { id, x: jitterX, y, text, kind }]);
    window.setTimeout(() => setFloatingNumbers(prev => prev.filter(f => f.id !== id)), 1600);
  };
  // Convenience wrapper for the overwhelmingly common case: the number belongs
  // over a specific board slot or the gold badge, identified the same way the
  // rest of this file already finds those elements (document.getElementById).
  const spawnFloatingNumberAtId = (elementId: string, value: number, kind: 'damage' | 'heal' | 'gold-gain' | 'gold-spend' | 'shield') => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const r = el.getBoundingClientRect();
    spawnFloatingNumber(r.left + r.width / 2, r.top + r.height * 0.42, value, kind);
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
  const showBanner = (title: string, subtitle: string, sfx: 'phase' | 'turn' = 'phase') => {
    playBannerSfx(sfx);
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
  // While "Encerrar turno" runs through the remaining phases in one go, the per-phase banners stay quiet.
  const skipPhaseBannersRef = useRef(false);
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
      turn === 'player' ? 'Jogue suas cartas e ataque' : 'Aguarde enquanto ele joga',
      'turn'
    );
  };
  // Board card preview (see the fixed overlay further down) — set from CardSlot's
  // own onClick now, alongside whatever game action that same tap already performs,
  // so it needs to clear itself instead of waiting on an explicit close every time.
  const [detailedCard, setDetailedCard] = useState<CardData | null>(null);
  useEffect(() => {
    if (!detailedCard) return;
    if (tutOn) { setDetailedCard(null); return; }   // the tutorial lights the board itself; no pop-up previews over it
    const t = window.setTimeout(() => setDetailedCard(null), 2200);
    return () => clearTimeout(t);
  }, [detailedCard]);
  // A brief, bigger callout for whichever card was just played — mainly for the
  // opponent's plays, which otherwise happen inside a small board slot that's easy to
  // miss on a phone. Player's own plays already get a large preview during selection.
  const [announcedCard, setAnnouncedCard] = useState<{ card: CardData, side: 'player' | 'npc' } | null>(null);

  const [isImpacting, setIsImpacting] = useState(false);
  // True while a blow that an Escudo / Bloqueio swallows entirely lands: the defender stands still, no punch.
  const [soakedBlow, setSoakedBlow] = useState(false);
  const blowIsSoaked = (events: GameEvent[], defSeat: Seat, slot: number) =>
    events.some(e => e.t === 'shield_hit' && e.seat === defSeat && e.slot === slot) && !events.some(e => e.t === 'damage' && e.seat === defSeat && e.slot === slot && e.amount > 0);
  // The physical-hit sprite, drawn in a layer above the board over whichever card was hit (see PunchFx).
  const [punchFx, setPunchFx] = useState<{ key: number; x: number; y: number; w: number; h: number; heavy: boolean } | null>(null);
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
  // A board reposition (Movimentação phase move/swap — see handleSlotClick) sliding
  // between two real on-screen slot positions, same "measure the real DOM rects"
  // idea as flyingCard above, but deliberately smaller and quicker: a card being
  // shuffled a few feet over shouldn't get the big showcase hover-zoom a brand new
  // card gets when played from hand — just a low, quick hop so it visibly travels
  // instead of vanishing from one slot and popping into existence at the other.
  // `swapped` is only set when the destination slot was occupied (a real swap, both
  // cards crossing paths at once); moving into an empty slot only ever needs `mover`.
  const [repositionFlight, setRepositionFlight] = useState<{
    // Whose board the slide happens on (the opponent now repositions too).
    side: 'player' | 'npc';
    // Reforço: a card stepping forward after a fall. The engine already did it, so the slide only shows it.
    reinforce?: boolean;
    originIndex: number; destIndex: number;
    moverCard: CardData; swappedCard: CardData | null;
    mover: { fromX: number; fromY: number; toX: number; toY: number; w: number; h: number };
    swapped: { fromX: number; fromY: number; toX: number; toY: number; w: number; h: number } | null;
  } | null>(null);
  const repositionFlightRef = useRef(repositionFlight);
  repositionFlightRef.current = repositionFlight;
  // Equipping an Armamento: the unit floats up to the middle of the screen, the equipment card arrives, slides in underneath
  // it, the bonus shows, and both settle back into the slot. `stage` drives where each card is; the engine has already
  // applied everything (the slot is simply held empty on screen meanwhile, see holdsRef).
  const [equipFx, setEquipFx] = useState<null | {
    id: number; side: 'player' | 'npc'; slot: number; unit: CardData; unitAfter: CardData; weapon: CardData; atk: number; hp: number;
    stage: 'lift' | 'arrive' | 'land';
    rect: { x: number; y: number; w: number; h: number };
  }>(null);
  const equipFxIdRef = useRef(0);
  // Small effect icons floating over cards for a moment (see IconPop).
  const [iconPops, setIconPops] = useState<{ id: number; x: number; y: number; icon: EffectIcon; label?: string }[]>([]);
  const popIdRef = useRef(0);
  const [shieldFx, setShieldFx] = useState<{ id: number; x: number; y: number; w: number; h: number; mode: 'appear' | 'hit' | 'break'; gold: boolean }[]>([]);
  const shieldOverSlot = (side: 'player' | 'npc', slot: number, mode: 'appear' | 'hit' | 'break', gold = false, delay = 0) => {
    window.setTimeout(() => {
      const r = document.getElementById(`${side}-${slot}`)?.getBoundingClientRect();
      if (!r) return;
      const id = ++popIdRef.current;
      setShieldFx(f => [...f, { id, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, mode, gold }]);
      window.setTimeout(() => setShieldFx(f => f.filter(q => q.id !== id)), 900);
    }, delay);
  };
  const popOverSlot = (side: 'player' | 'npc', slot: number, icon: EffectIcon, label?: string, delay = 0) => {
    window.setTimeout(() => {
      const r = document.getElementById(`${side}-${slot}`)?.getBoundingClientRect();
      if (!r) return;
      const id = ++popIdRef.current;
      setIconPops(p => [...p, { id, x: r.left + r.width / 2, y: r.top + r.height * 0.35, icon, label }]);
      window.setTimeout(() => setIconPops(p => p.filter(q => q.id !== id)), 2000);
    }, delay);
  };
  // A card's effect fires (gatilho): its colour glows over the card's exact silhouette and its type-line icon pulses.
  const [triggerBursts, setTriggerBursts] = useState<{ id: number; x: number; y: number; w: number; h: number; card: CardData; trig: Trigger }[]>([]);
  const burstIdRef = useRef(0);
  const startTriggerFxRef = useRef<(side: 'player' | 'npc', slot: number, card: CardData, trig: Trigger, hold?: () => boolean) => void>(() => {});
  // Fires a card's trigger burst (set by burstAt) — a ref so the test hook can reach it.
  const burstFnRef = useRef<(side: 'player' | 'npc', slot: number, card: CardData, trig: Trigger, delay?: number) => void>(() => {});
  const burstAt = (side: 'player' | 'npc', slot: number, card: CardData, trig: Trigger, delay = 0) => {
    window.setTimeout(() => {
      const r = document.getElementById(`${side}-${slot}`)?.getBoundingClientRect();
      if (!r) return;
      const id = ++burstIdRef.current;
      setTriggerBursts(b => [...b, { id, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, card, trig }]);
      pulseCard(card.id, trig, 2000);
      playEffectSfx();
      window.setTimeout(() => setTriggerBursts(b => b.filter(q => q.id !== id)), 1700);
    }, delay);
  };
  burstFnRef.current = burstAt;

  // The full flow of an effect firing: the card floats up off its slot, glows in time with the sound, and STAYS up while
  // someone still has to decide — `hold()` says so (the player choosing a card / a target now; later the opponent's chance
  // to block the effect plugs into the same predicate) — then sets back down. Convocação, Manobra and Comando use it;
  // Queda (the card is burning) and Ofensiva (the card is mid-attack) only glow in place (burstAt). The sound and glow are
  // timed together (src/index.css, tb-*): swell ~0.2 s, main hit ~0.73 s.
  const TRIG_GLOW_MS = 1500;
  const [trigFx, setTrigFx] = useState<{ id: number; side: 'player' | 'npc'; slot: number; card: CardData; rect: { x: number; y: number; w: number; h: number }; stage: 'up' | 'down' } | null>(null);
  const trigChainRef = useRef<Promise<void>>(Promise.resolve());
  const trigActiveIdRef = useRef<string | null>(null);
  // Glows still playing: whatever the effect asks the player (a pick, a target) waits for them to end (whenGlowDone).
  const trigGlowPendingRef = useRef(0);
  const trigGlowWaitersRef = useRef<(() => void)[]>([]);
  const whenGlowDone = (fn: () => void) => { if (trigGlowPendingRef.current === 0) fn(); else trigGlowWaitersRef.current.push(fn); };
  const endGlow = () => {
    trigGlowPendingRef.current = Math.max(0, trigGlowPendingRef.current - 1);
    if (trigGlowPendingRef.current === 0) { const w = trigGlowWaitersRef.current; trigGlowWaitersRef.current = []; w.forEach(f => f()); }
  };
  const startTriggerFx = (side: 'player' | 'npc', slot: number, card: CardData, trig: Trigger, hold?: () => boolean) => {
    if (trigActiveIdRef.current === card.id) return;           // this card is already up: one float per effect
    trigActiveIdRef.current = card.id;
    trigGlowPendingRef.current += 1;
    trigChainRef.current = trigChainRef.current.then(async () => {
      const el = document.getElementById(`${side}-${slot}`);
      if (!el) { trigActiveIdRef.current = null; endGlow(); return; }
      const r = el.getBoundingClientRect();
      const id = ++burstIdRef.current;
      const holds = holdsRef.current[side];
      holds[slot] = null;                                       // the real card waits, hidden, while its copy floats
      if (engineRef.current) syncViewRef.current(engineRef.current);
      setTrigFx({ id, side, slot, card, rect: { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }, stage: 'up' });
      pulseCard(card.id, trig, 2600);
      playEffectSfx();
      await sleep(TRIG_GLOW_MS);
      endGlow();
      await sleep(80);                                          // let whatever the glow's end opens (a pick, a target) register
      for (let g = 0; hold && hold() && g < 1200; g++) await sleep(100);
      setTrigFx(f => (f?.id === id ? { ...f, stage: 'down' } : f));
      await sleep(380);
      delete holds[slot];
      setTrigFx(f => (f?.id === id ? null : f));
      trigActiveIdRef.current = null;
      if (engineRef.current) syncViewRef.current(engineRef.current);
    });
  };
  startTriggerFxRef.current = startTriggerFx;
  const holdForSeat = (seat: Seat) => () => {
    const pend = engineRef.current?.pending;
    return (!!pend && pend.seat === seat) || (seat === 0 && !!pendingAbilityRef.current);
  };
  // Convocação (a card with that trigger arrives on the board) and Queda (it falls): read straight off the boards, so they
  // fire at the moment the card is actually drawn there (landing animation done / burn begins), for either side.
  const burstSeenRef = useRef<{ ready: boolean; player: Record<string, boolean>; npc: Record<string, boolean>; arrived: Set<string> }>({ ready: false, player: {}, npc: {}, arrived: new Set() });
  useEffect(() => {
    const seen = burstSeenRef.current;
    (['player', 'npc'] as const).forEach(side => {
      const slots = side === 'player' ? playerSlots : npcSlots;
      const prev = seen[side]; const next: Record<string, boolean> = {};
      slots.forEach((c, i) => {
        if (!c || i > 9) return;
        const fell = !!c.isDestroyed;
        next[c.id] = fell;
        if (!seen.ready) seen.arrived.add(c.id);
        const trig = triggerKeyOf(c.name);
        if (!seen.ready || !trig) return;
        // `arrived` remembers every card already announced: a card hidden while it floats and shown again is not a new arrival
        if (trig === 'convocacao' && !fell && !seen.arrived.has(c.id)) { seen.arrived.add(c.id); startTriggerFx(side, i, c, trig); }
        if (trig === 'queda' && fell && prev[c.id] === false) burstAt(side, i, c, trig);
      });
      seen[side] = next;
    });
    seen.ready = true;
  }, [playerSlots, npcSlots]);

  // Holds the camera's zoomed-in focus for a brief moment after the card lands,
  // so the placement reads clearly before the view eases back to normal.
  const [cameraSettling, setCameraSettling] = useState<{ slotIndex: number } | null>(null);
  // A brief flash/ring burst at the screen position where a played card just landed.
  const [impactBurst, setImpactBurst] = useState<{ id: number; x: number; y: number; w: number; big?: boolean }[]>([]);
  const impactIdRef = useRef(0);
  // Several bursts can be alive at once (summoned soldiers landing one after another); each cleans itself up.
  // (x, y) is the centre of the card that landed and w its width: the dust is kicked up from its bottom edge, and a full-art card gets far more.
  const fireImpactBurst = (x: number, y: number, big = false, w = 56) => {
    const id = ++impactIdRef.current;
    setImpactBurst(prev => [...prev, { id, x, y, w, big }]);
    window.setTimeout(() => setImpactBurst(prev => prev.filter(b => b.id !== id)), big ? 1700 : 1350);
  };
  // A dropped card touched down: the thud, the dust, and the board reacting (see arrivalDrops).
  arrivalListener = (slotId, card) => {
    const r = document.getElementById(slotId)?.getBoundingClientRect();
    if (!r) return;
    playCardPlaySfx();
    fireImpactBurst(r.left + r.width / 2, r.top + r.height / 2, !!card.isFullArt, r.width);
  };
  // The slam lands at FLIGHT_HIT_MS into the flight: the thud and the dust (a full-art card kicks up far more).
  useEffect(() => {
    if (!flyingCard) return;
    const f = flyingCard;
    const id = window.setTimeout(() => { playCardPlaySfx(); fireImpactBurst(f.toX, f.toY, !!f.card.isFullArt, f.toW); }, FLIGHT_HIT_MS);
    return () => window.clearTimeout(id);
  }, [flyingCard]);
  const handCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Hand cards: a tap shows the card big in the middle of the screen (another tap puts it back); pressing, holding and dragging it plays it —
  // while it is held, the card floats under the finger (see `held`) and the board lights up where it can go.
  const [inspectId, setInspectId] = useState<string | null>(null);
  // How many cards the player has already played by dragging: the "arraste" hints show only until the first card is played.
  const gameSettings = useGameSettings();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [dragLessons, setDragLessons] = useState<number>(() => { try { return Number(localStorage.getItem('pow.drags') || 0); } catch { return 0; } });
  const noteDragPlay = () => setDragLessons(n => { const v = n + 1; try { localStorage.setItem('pow.drags', String(v)); } catch { /* no storage */ } return v; });
  const inspectOpenedAtRef = useRef(0);   // a touch's own click lands on the freshly opened scrim: ignore clicks right after opening
  const [held, setHeld] = useState<{ id: string; zone: { left: number; top: number; width: number; height: number; label: string } | null } | null>(null);   // which card is held; where it is lives in refs (no React re-render per finger move)
  const heldElRef = useRef<HTMLDivElement | null>(null);
  const guideInfoRef = useRef<GuideInfo | null>(null);
  const zoneElRef = useRef<HTMLDivElement | null>(null);
  const dragZoneRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const dragPointRef = useRef({ x: 0, y: 0 });
  const dragFrameRef = useRef<number | null>(null);
  const dragRef = useRef<{ index: number; id: string; startX: number; startY: number; dragging: boolean; blocked: boolean } | null>(null);
  const dropFromRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const dragApiRef = useRef<{ move: (x: number, y: number) => void; up: (x: number, y: number, cancelled: boolean) => void } | null>(null);
  useEffect(() => { if (selectedCardIndex === null) setHeld(null); }, [selectedCardIndex]);
  useEffect(() => { if (inspectId && !hand.some(c => c.id === inspectId)) setInspectId(null); }, [hand, inspectId]);
  // Where a targetable Tática's tap-to-target lands, stashed here (not resolved
  // immediately) because handlePlayCardButtonClick's own commit — spending the
  // mana, removing the card from hand, setting pendingTacticAction — has to land
  // and re-render before resolveOwnTacticTarget/resolveEnemyTacticTarget (which
  // both read pendingTacticAction straight off state) can see it. The effect
  // right after this component's other pendingTacticAction-driven effects picks
  // this up the moment that render happens — see its own comment. Side is still
  // called 'npc' (not 'enemy') to match dragHoverSlot's old naming everywhere else
  // this side/index pair shows up (slot DOM ids, handleNpcSlotClick, ...).

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
  const HAND_SCALE_REFERENCE_COUNT = HAND_FULL_SPREAD_COUNT;
  const handScaleCount = Math.max(hand.length, HAND_SCALE_REFERENCE_COUNT);
  const handStep = handStepFor(handScaleCount);
  const handTotalWidth = handScaleCount > 0 ? HAND_CARD_WIDTH + (handScaleCount - 1) * handStep : HAND_CARD_WIDTH;
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
  const handStepRef = useRef(handStep);
  useEffect(() => { handStepRef.current = handStep; }, [handStep]);
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
  // The match itself lives in the rules engine (src/engine): this ref holds its full state, and every
  // rule decision — the player's taps, the opponent AI, later the online server — goes through
  // applyAction. The React states below (hand, boards, gold, graveyards, turn, phase …) are only a
  // mirror of it, for drawing: syncView copies the engine's truth into them.
  const engineRef = useRef<GameState | null>(null);
  // Test hook: with ?debug in the address the full engine state can be read from the console / a test.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('debug')) return;
    (window as any).__powEngine = () => engineRef.current;
    (window as any).__powMatchLog = () => matchLogRef.current;
    // Lets a test set up a situation (give a card, move a unit…) and have the screen follow.
    // Test hook: play the trigger burst of the card standing on a slot (or force a given trigger).
    (window as any).__powBurst = (side: 'player' | 'npc', slot: number, trig?: Trigger) => {
      const c = engineRef.current?.players[side === 'player' ? 0 : 1].board[slot];
      if (!c) return false;
      burstFnRef.current(side, slot, toCardDataRef.current(c), trig ?? triggerKeyOf(c.name) ?? 'comando');
      return true;
    };
    // Test hook: the full effect flow (float, glow, sound) on a slot, holding the card up for `holdMs` more milliseconds.
    (window as any).__powTrigger = (side: 'player' | 'npc', slot: number, holdMs = 0, trig?: Trigger) => {
      const c = engineRef.current?.players[side === 'player' ? 0 : 1].board[slot];
      if (!c) return false;
      const until = Date.now() + 1500 + holdMs;
      startTriggerFxRef.current(side, slot, toCardDataRef.current(c), trig ?? triggerKeyOf(c.name) ?? 'comando', () => Date.now() < until);
      return true;
    };
    // Test hook: the client-side flow state (what is pending, which effect floats, how many glows are still playing).
    (window as any).__powFlow = () => ({ ability: pendingAbilityRef.current, floating: trigActiveIdRef.current, glows: trigGlowPendingRef.current });
    (window as any).__powSet = (mutate: (s: GameState) => void) => {
      const next = JSON.parse(JSON.stringify(engineRef.current)) as GameState;
      mutate(next);
      engineRef.current = next;
      syncViewRef.current(next);
    };
  }, []);
  const syncViewRef = useRef<(s: GameState) => void>(() => {});
  // The deck the player picked for the match in progress (the engine match is created once the coin
  // toss has decided who goes first).
  const matchSelectionRef = useRef<DeckSelection>(DEFAULT_DECK_SELECTION);
  // Every match — against the AI exactly like against a person — is recorded as how it was created plus the
  // actions applied, in order. That record is what lets a server re-run the match to validate a result before
  // giving out rewards, and lets any match be replayed.
  const matchLogRef = useRef<MatchLog | null>(null);
  // Online matches only (see OnlineMatch): the real-chairs replica, and who/what is on the other side.
  const onlineRef = useRef<OnlineMatch | null>(null);
  const ambushResolveRef = useRef<((card: CardData | null) => void) | null>(null);
  const cardPickerRef = useRef<unknown>(null);
  const [deckCounts, setDeckCounts] = useState<[number, number]>([0, 0]);   // cards left in each deck (yours, opponent's)
  const [turnClock, setTurnClock] = useState<{ deadline: number; skew: number } | null>(null);
  const [clockNow, setClockNow] = useState(0);
  const [matchReward, setMatchReward] = useState<RewardInfo | 'pending' | null>(null);
  const [opponentInfo, setOpponentInfo] = useState<{ name: string; avatarId: string; bot: boolean } | null>(null);
  const [waitingRemote, setWaitingRemote] = useState(false);

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
      return { x: r.left + r.width / 2 + (handStepRef.current - HAND_CARD_WIDTH) * handScaleRef.current, y: r.top + r.height / 2 };
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

  // Drives the Hearthstone-style "VS" reveal at the very start of a match (see
  // MatchIntroOverlay further below, and startMatchIntro): both Generals' art appears
  // huge on opposite sides and holds ('panels'), then the "BATALHA" banner slams down
  // between them while they're still frozen in that big reveal position ('battle') —
  // the declaration lands before either General has taken their place, not after —
  // and only once BATALHA has cleared do both shrink and fly down into their real
  // board slot ('descend'). null means no reveal is in progress.
  // The side of the coin this player was given for the opening toss (the server hands it out online).
  const [coinSide, setCoinSide] = useState<'cara' | 'coroa'>('cara');
  // Online: who goes first once the toss winner has chosen (null until then).
  const [onlinePick, setOnlinePick] = useState<'player' | 'npc' | null>(null);
  const [matchIntroStage, setMatchIntroStage] = useState<null | 'panels' | 'coin' | 'battle' | 'descend'>(null);
  // Who plays first, decided by the coin toss (the turn counter then advances after the SECOND player's turn).
  const firstSideRef = useRef<'player' | 'npc'>('player');
  // True from a lost toss until the opponent's first turn begins: blocks taps while the hands are dealt.
  const [npcKickoffPending, setNpcKickoffPending] = useState(false);
  // Set true for the very first turn of a fresh match (see resetGame) so the normal
  // per-turn "Fase de Preparação" ribbon (see the turnNumber effect below) doesn't
  // fire immediately and race the VS reveal above — startMatchIntro calls
  // announcePhase itself once the reveal's own "battle" stage has cleared, and
  // flips this back off right before doing so.
  const suppressInitialPhaseBannerRef = useRef(false);
  // Where the 'descend' stage's shrink animation ends — the real board General
  // slots' own on-screen rects, measured only once we're about to need them (they
  // don't exist meaningfully before the match's board has actually mounted).
  const [introDescendTargets, setIntroDescendTargets] = useState<{ player: DOMRect; npc: DOMRect } | null>(null);
  useEffect(() => {
    if (matchIntroStage !== 'descend') return;
    const playerEl = document.getElementById('player-12');
    const npcEl = document.getElementById('npc-12');
    if (playerEl && npcEl) {
      setIntroDescendTargets({ player: playerEl.getBoundingClientRect(), npc: npcEl.getBoundingClientRect() });
    }
  }, [matchIntroStage]);

  // ── Engine bridge ───────────────────────────────────────────────────────────
  // Draws an engine card: the engine knows nothing about artwork, so it is looked up by name here.
  const toCardDataRef = useRef<(c: EngineCard) => CardData>(() => ({ id: '', name: '', atk: 0, hp: 0, cost: 0, art: '', effect: '' }));
  const toCardData = (c: EngineCard): CardData => ({
    id: c.id, name: c.name, atk: c.atk, hp: c.hp, cost: c.cost, art: ART_BY_NAME[c.name] ?? '', effect: c.effect,
    cardType: c.cardType, isFullArt: c.isFullArt, pendingCombatBonus: c.pendingCombatBonus, dmgReduction: c.dmgReduction,
    formationBuffAtk: c.formationBuffAtk, equippedWeapons: c.equippedWeapons?.map(toCardData), shield: c.shield, block: c.block,
  });
  toCardDataRef.current = toCardData;
  // A unit that just died stays on its slot for a moment, flagged destroyed, so its explosion can play
  // before the slot clears (the engine removes it at once).
  const ghostsRef = useRef<{ player: Record<number, CardData>; npc: Record<number, CardData> }>({ player: {}, npc: {} });
  // Reforço: the engine has already moved the card up, but the screen first lets the fallen card burn in its slot
  // and shows the reinforcement still behind it until its slide starts (holds: slot -> what to show there).
  const holdsRef = useRef<{ player: Record<number, CardData | null>; npc: Record<number, CardData | null> }>({ player: {}, npc: {} });
  // The live numbers of a board card (see CardData.shown): ATK through every aura, buff and weapon (getEffectiveAtk, the same
  // function combat uses); HP as it stands plus what holds in combat. Green when better than printed, red when worse; for HP
  // "worse" means hurt — below what the card could have (its printed HP plus what its weapons add).
  const shownStats = (c: EngineCard, i: number, own: (EngineCard | null)[], foe: (EngineCard | null)[]): CardData['shown'] => {
    const def = getCardDef(c.name);
    if (!def) return undefined;
    const atk = getEffectiveAtk(c, i, own, foe);
    const hp = c.hp + (c.pendingCombatBonus?.hp ?? 0) + getAuraCombatHpBonus(i, own);
    const weaponHp = (c.equippedWeapons ?? []).reduce((n, w) => n + ((verbsOn(w.name, 'play').find(v => v.kind === 'equip') as { hp?: number } | undefined)?.hp ?? 0), 0);
    const maxHp = def.hp + weaponHp;
    const atkTone: StatTone = atk > def.atk ? 1 : atk < def.atk ? -1 : 0;
    const hpTone: StatTone = c.hp < maxHp ? -1 : hp > def.hp ? 1 : 0;
    return { atk, hp, atkTone, hpTone };
  };
  const boardView = (board: (EngineCard | null)[], ghosts: Record<number, CardData>, holds: Record<number, CardData | null> = {}, foe: (EngineCard | null)[] = []): (CardData | null)[] =>
    board.map((c, i) => (i in holds ? (holds[i] ?? ghosts[i] ?? null) : c ? { ...toCardData(c), shown: shownStats(c, i, board, foe) } : ghosts[i] ?? null));

  // Copies the engine state into the React mirror states. `skip` lets an animation hold back the hand or
  // the boards until it lands (a card in flight, for instance).
  const syncView = (s: GameState, skip: { hand?: boolean; boards?: boolean } = {}) => {
    const me = s.players[0];
    const foe = s.players[1];
    const mine = s.turn.active === 0;
    setPlayerMana(me.gold);
    setNpcMana(foe.gold);
    setDeckCounts([me.drawPile.length, foe.drawPile.length]);
    if (!skip.hand) setHand(me.hand.map(toCardData));
    setNpcHand(foe.hand.map(toCardData));
    if (!skip.boards) {
      setPlayerSlots(boardView(me.board, ghostsRef.current.player, holdsRef.current.player, foe.board));
      setNpcSlots(boardView(foe.board, ghostsRef.current.npc, holdsRef.current.npc, me.board));
    }
    setPlayerGraveyard(me.graveyard.map(toCardData));
    setNpcGraveyard(foe.graveyard.map(toCardData));
    setCurrentTurn(mine ? 'player' : 'npc');
    setTurnNumber(s.turn.round);
    setTurnPhase(s.turn.phase);
    setMovedSlots(new Set(mine ? s.turn.moved : []));
    setBonusRepositions(mine ? s.turn.bonusRepositions : 0);
    setBatedorFreeMove(mine ? s.turn.batedorFree : null);
    setPlayerAttackCounts(mine ? s.turn.attackCounts : {});
    setPlayerActivatedAbilityIds(new Set(s.turn.activated));
    setPlayerGeneralAbilityUses(me.generalAbilityUses);
    setNpcGeneralAbilityUses(foe.generalAbilityUses);
    playerGeneralAbilityBlockedThisTurnRef.current = me.generalAbilityBlocked;
  };

  syncViewRef.current = (s: GameState) => syncView(s);

  // Turns what happened into the sights and sounds of it.
  const processEvents = (events: GameEvent[], opts: { quietTurn?: boolean } = {}) => {
    let drawIndex = 0;
    let summonIndex = 0;
    let turnJustStarted = false;
    const ownerId = (seat: Seat) => (seat === 0 ? 'player' : 'npc');
    events.forEach(e => {
      switch (e.t) {
        case 'turn_start':
          turnJustStarted = true;
          setSelectedMoverIndex(null);
          if (e.seat === 0) {
            setViewState('hand');
            if (!opts.quietTurn) {
              // Compra and Suprimentos play out on the panel while the turn banner is up.
              setAutoPhase('compra');
              window.setTimeout(() => setAutoPhase('suprimentos'), 750);
              window.setTimeout(() => setAutoPhase(null), 1500);
              announceTurnChange('player');
              window.setTimeout(() => announcePhase('preparacao'), PHASE_BANNER_DURATION_MS);
            }
          } else {
            setViewState('field');
            if (!opts.quietTurn) announceTurnChange('npc');
          }
          break;
        case 'phase':
          if (e.seat === 0 && !turnJustStarted && !skipPhaseBannersRef.current) announcePhase(e.phase);
          break;
        case 'gold':
          spawnFloatingNumberAtId(`${ownerId(e.seat)}-gold-badge`, Math.abs(e.delta), e.delta > 0 ? 'gold-gain' : 'gold-spend');
          break;
        case 'draw':
          if (e.reason === 'deal') break;
          if (e.seat === 0) {
            const origin = computeDrawOrigin(playerDeckRef, handRef.current.length + drawIndex);
            if (origin) drawOriginsRef.current[e.card.id] = origin;
            drawIndex += 1;
          }
          playCardDrawSfx();
          break;
        case 'play':
          if (e.card.cardType === 'Tática') playTacticSfx();
          break;
        case 'place':
          // The opponent's cards have no flight from a hand on screen: they drop in from above (see CardSlot's arrival).
          if (e.seat === 1) arrivalDrops.set(e.card.id, { delay: 0.05 });
          // Postura: the stance is on the moment the card stands in the Vanguarda — the same gold glow as any effect, once it has landed.
          if (!opts.quietTurn && triggerKeyOf(e.card.name) === 'postura' && isFrontline(e.slot)) burstAt(ownerId(e.seat), e.slot, toCardData(e.card), 'postura', e.seat === 0 ? 1000 : 600);
          break;
        case 'summon':
          // Summoned soldiers drop in one after another, never all at the same instant.
          arrivalDrops.set(e.card.id, { delay: 0.2 + summonIndex * 0.16 + Math.random() * 0.12 });
          summonIndex += 1;
          break;
        case 'ability': {
          playTacticSfx();
          const c = engineRef.current?.players[e.seat].board[e.slot];
          if (c) startTriggerFx(ownerId(e.seat), e.slot, toCardData(c), triggerKeyOf(c.name) ?? 'comando', holdForSeat(e.seat));   // any card or General: the same float + glow
          break;
        }
        case 'attack': {
          const c = engineRef.current?.players[e.seat].board[e.from];
          if (c && triggerKeyOf(c.name) === 'ofensiva') burstAt(ownerId(e.seat), e.from, toCardData(c), 'ofensiva');
          break;
        }
        case 'ambush':
          playTacticSfx();
          if (e.seat === 1) showToast(`O oponente ativou uma Emboscada: ${e.card.name}!`);
          break;
        case 'damage':
          if (e.amount > 0) spawnFloatingNumberAtId(`${ownerId(e.seat)}-${e.slot}`, e.amount, 'damage');
          break;
        case 'heal':
          spawnFloatingNumberAtId(`${ownerId(e.seat)}-${e.slot}`, e.amount, 'heal');
          if (!opts.quietTurn) popOverSlot(e.seat === 0 ? 'player' : 'npc', e.slot, 'hp-up', `+${e.amount}`);
          break;
        case 'shield': {
          if (opts.quietTurn) break;
          const side = e.seat === 0 ? 'player' : 'npc';
          // after a Reforço the card is still sliding into place: the bubble waits for it to land
          const afterReinforce = events.some(x => x.t === 'reinforce' && x.seat === e.seat && x.to === e.slot);
          shieldOverSlot(side, e.slot, 'appear', e.block, afterReinforce ? 1900 : 0);
          break;
        }
        case 'shield_hit': {
          if (opts.quietTurn) break;
          const side = e.seat === 0 ? 'player' : 'npc';
          spawnFloatingNumberAtId(`${side}-${e.slot}`, e.absorbed, 'shield');
          shieldOverSlot(side, e.slot, e.broken || e.blocked ? 'break' : 'hit', e.blocked);
          break;
        }
        case 'buff': {
          // Reforço announces itself (its own icon); anything else that adds ATK / HP gets the matching icon.
          if (opts.quietTurn || events.some(x => x.t === 'reinforce' && x.seat === e.seat && x.to === e.slot)) break;
          if (e.atk > 0) popOverSlot(e.seat === 0 ? 'player' : 'npc', e.slot, 'atk-up', `+${e.atk}`);
          else if (e.hp > 0) popOverSlot(e.seat === 0 ? 'player' : 'npc', e.slot, 'hp-up', `+${e.hp}`);
          break;
        }
        case 'destroyed': {
          const ghosts = e.seat === 0 ? ghostsRef.current.player : ghostsRef.current.npc;
          ghosts[e.slot] = { ...toCardData(e.card), isDestroyed: true };
          window.setTimeout(() => {
            delete ghosts[e.slot];
            if (engineRef.current) syncView(engineRef.current);
          }, 1300);
          break;
        }
        case 'move': {
          const inFlight = repositionFlightRef.current && repositionFlightRef.current.originIndex === e.from && repositionFlightRef.current.destIndex === e.to;
          if (e.swapped && !opts.quietTurn && !inFlight) popOverSlot(e.seat === 0 ? 'player' : 'npc', e.to, 'swap', 'TROCA');   // (a slide shows its own swap sign)
          const c = engineRef.current?.players[e.seat].board[e.to];
          if (c && triggerKeyOf(c.name) === 'manobra' && !opts.quietTurn) window.setTimeout(() => startTriggerFx(ownerId(e.seat), e.to, toCardData(c), 'manobra'), 700);
          // Postura: a card that moves INTO the Vanguarda (and the one it swapped with, going the other way) glows as its stance switches on.
          if (!opts.quietTurn) {
            if (c && triggerKeyOf(c.name) === 'postura' && isFrontline(e.to) && !isFrontline(e.from)) burstAt(ownerId(e.seat), e.to, toCardData(c), 'postura', 250);
            const other = e.swapped ? engineRef.current?.players[e.seat].board[e.from] : null;
            if (other && triggerKeyOf(other.name) === 'postura' && isFrontline(e.from) && !isFrontline(e.to)) burstAt(ownerId(e.seat), e.from, toCardData(other), 'postura', 250);
          }
          break;
        }
        case 'equip': {
          if (opts.quietTurn) break;
          const side = e.seat === 0 ? 'player' : 'npc';
          const slotEl = document.getElementById(`${side}-${e.slot}`)?.getBoundingClientRect();
          const board = engineRef.current?.players[e.seat].board;
          const after = board?.[e.slot];
          if (!slotEl || !after) break;
          const unitAfter = toCardData(after);
          const weapon = toCardData(e.card);
          const unit: CardData = { ...unitAfter, atk: unitAfter.atk - e.atk, hp: unitAfter.hp - e.hp, equippedWeapons: unitAfter.equippedWeapons?.filter(w => w.id !== weapon.id) };
          const id = ++equipFxIdRef.current;
          holdsRef.current[side][e.slot] = null;             // the real card waits (hidden) while its copy performs
          setEquipFx({ id, side, slot: e.slot, unit, unitAfter, weapon, atk: e.atk, hp: e.hp, stage: 'lift', rect: { x: slotEl.left + slotEl.width / 2, y: slotEl.top + slotEl.height / 2, w: slotEl.width, h: slotEl.height } });
          playCardLiftSfx();
          const at = (ms: number, stage: 'arrive' | 'land') => window.setTimeout(() => setEquipFx(f => (f?.id === id ? { ...f, stage } : f)), ms);
          at(450, 'arrive'); at(1150, 'land');
          window.setTimeout(() => playCardPlaySfx(), 1200);
          popOverSlot(side, e.slot, e.atk > 0 ? 'atk-up' : 'hp-up', `+${e.atk > 0 ? e.atk : e.hp}`, 1500);
          window.setTimeout(() => {
            if (equipFxIdRef.current === id) delete holdsRef.current[side][e.slot];   // (a newer equip on this slot keeps its own hold)
            setEquipFx(f => (f?.id === id ? null : f));
            if (engineRef.current) syncView(engineRef.current);
          }, 2250);
          break;
        }
        case 'reinforce': {
          // The fallen card burns first; then the reinforcement slides up into its place.
          const side = e.seat === 0 ? 'player' : 'npc';
          const holds = holdsRef.current[side];
          const mover = toCardData(e.card);
          holds[e.to] = null;                                              // keep showing the burning ghost
          holds[e.from] = { ...mover, pendingCombatBonus: mover.pendingCombatBonus && { ...mover.pendingCombatBonus, atk: Math.max(0, mover.pendingCombatBonus.atk - 1) } };
          window.setTimeout(() => {
            const fromEl = document.getElementById(`${side}-${e.from}`)?.getBoundingClientRect();
            const toEl = document.getElementById(`${side}-${e.to}`)?.getBoundingClientRect();
            delete holds[e.to]; delete holds[e.from];
            popOverSlot(side, e.to, 'reinforce', 'REFORÇO', 420);
            if (!fromEl || !toEl) { if (engineRef.current) syncView(engineRef.current); return; }
            setRepositionFlight({
              side, reinforce: true, originIndex: e.from, destIndex: e.to, moverCard: mover, swappedCard: null,
              mover: { fromX: fromEl.left + fromEl.width / 2, fromY: fromEl.top + fromEl.height / 2, toX: toEl.left + toEl.width / 2, toY: toEl.top + toEl.height / 2, w: fromEl.width, h: fromEl.height },
              swapped: null,
            });
          }, 1450);
          // Reforço: the card that moved up glows gold once its slide has landed.
          if (!opts.quietTurn && triggerKeyOf(e.card.name) === 'reforco') burstAt(side, e.to, mover, 'reforco', 1450 + 480);
          break;
        }
        case 'log':
          if (e.text.includes(' equipado: ')) break;   // the equip scene says it itself
          // The AI's own prompts and its ambush line have their own wording elsewhere.
          if (e.seat === 1 && (e.text.includes('ativar Emboscada?') || e.text.startsWith('Emboscada ativada') || e.text.startsWith('Você tem'))) break;
          showToast(e.seat === 1 && e.text.includes('descartada') ? `O oponente descartou ${e.text.split(' ')[0]} carta(s).` : e.text);
          break;
        case 'winner':
          setGameOverWinner(e.seat === 0 ? 'player' : 'npc');
          break;
        default:
          break;
      }
    });
  };

  // The one door into the rules. Local match: the engine applies the action and the result is shown. Online match:
  // see dispatchOnline — the screen shows MY VIEW of the server's match.
  type Dispatched = { ok: true; state: GameState; events: GameEvent[]; wait?: Promise<boolean> } | { ok: false; error: string };
  const commitState = (state: GameState, events: GameEvent[], opts: { skip?: { hand?: boolean; boards?: boolean }; quietTurn?: boolean } = {}) => {
    engineRef.current = state;
    processEvents(events, opts);
    syncView(state, opts.skip);
  };

  const dispatchAction = (
    seat: Seat,
    action: EngineAction,
    opts: { skip?: { hand?: boolean; boards?: boolean }; quietTurn?: boolean } = {},
  ): Dispatched => {
    const online = onlineRef.current;
    if (online) return dispatchOnline(online, seat, action, opts);
    const current = engineRef.current;
    if (!current) return { ok: false, error: 'Não há partida em andamento.' };
    const r = applyAction(current, seat, action);
    if (r.ok === false) return r;
    commitState(r.state, r.events, opts);
    matchLogRef.current?.actions.push({ seat, action });
    if (tutRef.current && seat === 0) tutFromAction(current, action);
    return { ok: true, state: r.state, events: r.events };
  };

  // ── Online plumbing ─────────────────────────────────────────────────────────
  const wakeWaiter = (online: OnlineMatch) => { const w = online.waiter; online.waiter = null; w?.(); };
  const publishClock = (online: OnlineMatch) => setTurnClock(online.deadline !== null && !online.finished ? { deadline: online.deadline, skew: online.skew } : null);

  const dispatchOnline = (
    online: OnlineMatch,
    seat: Seat,
    action: EngineAction,
    opts: { skip?: { hand?: boolean; boards?: boolean }; quietTurn?: boolean },
  ): Dispatched => {
    const cur = engineRef.current;
    if (!cur) return { ok: false, error: 'Não há partida em andamento.' };
    // `begin` was done by the server when the match was created: both sides just show it.
    const shown = action.type === 'begin' ? online.beginRow : seat === 1 ? online.cursor : null;
    if (action.type === 'begin' || seat === 1) {
      if (seat === 1 && action.type !== 'begin') online.cursor = null;
      if (!shown) return { ok: false, error: 'Nada do adversário para mostrar.' };
      online.confirmed = shown.state;
      commitState(shown.state, shown.events, opts);
      return { ok: true, state: shown.state, events: shown.events };
    }
    if (cur.winner !== null) return { ok: false, error: 'A partida terminou.' };
    if (online.ownQueue.some(q => !q.optimistic)) return { ok: false, error: 'Aguarde o servidor responder.' };
    let applied: { state: GameState; events: GameEvent[] } | null = null;
    if (!needsServer(action, cur)) {
      try {
        const r = applyAction(cur, 0, action);
        if (r.ok === false) return r;
        applied = r;
      } catch { applied = null; }
    }
    let done: (ok: boolean) => void = () => {};
    const wait = new Promise<boolean>(resolve => { done = resolve; });
    online.ownQueue.push({ optimistic: !!applied, done });
    if (applied) commitState(applied.state, applied.events, opts);
    sendOnline(online, action);
    return { ok: true, state: engineRef.current!, events: applied?.events ?? [], wait };
  };

  // A step of mine came back from the server. Mine were already shown (unless the server had to decide first).
  const reconcileOwn = (online: OnlineMatch, row: ViewRow, own: { optimistic: boolean; done: (ok: boolean) => void }) => {
    online.confirmed = row.state;
    if (!own.optimistic) {
      commitState(row.state, row.events);
    } else if (online.ownQueue.length === 0) {
      const cur = engineRef.current;
      engineRef.current = row.state;
      if (cur && visibleKey(cur) !== visibleKey(row.state)) syncView(row.state);
      else setNpcHand(row.state.players[1].hand.map(toCardData));
    }
    own.done(true);
  };
  // A step of mine nobody asked for (my clock ran out and the server played my turn), or the opponent giving up
  // while nothing is being presented.
  const applyUnasked = (online: OnlineMatch, row: ViewRow) => {
    if (!engineRef.current) { online.remote.push(row); return; }
    online.confirmed = row.state;
    online.ownQueue.splice(0).forEach(q => q.done(false));
    const resolveAmbush = ambushResolveRef.current;
    ambushResolveRef.current = null;
    resolveAmbush?.(null);
    setAmbushPrompt(null);
    setCardPicker(null);
    setSelectedCardIndex(null);
    setSelectedAttackerIndex(null);
    setPendingTacticAction(null);
    commitState(row.state, row.events);
  };
  const ingestRows = (online: OnlineMatch, rows: ViewRow[]) => {
    let any = false;
    rows.forEach(row => {
      if (row.n <= online.lastSeen) return;
      online.lastSeen = row.n;
      any = true;
      online.deadline = row.deadline;
      if (row.state.winner !== null) online.finished = true;
      if (row.action.type === 'begin') { online.beginRow = row; return; }
      if (row.action.type === 'choose_first') {
        // The toss winner's choice: who goes first, seen from my chair (the chooser is me when actor is 0).
        online.pick = (row.actor === 0) === row.action.goFirst ? 'player' : 'npc';
        return;
      }
      if (row.actor === 0) {
        const own = online.ownQueue.shift();
        if (own) reconcileOwn(online, row, own); else applyUnasked(online, row);
      } else if (row.action.type === 'concede' && !online.cursor && !online.waiting && online.remote.length === 0) {
        // The opponent can give up at any moment, not only while their turn is being played out.
        applyUnasked(online, row);
      } else {
        online.remote.push(row);
      }
    });
    if (any) { publishClock(online); wakeWaiter(online); }
    if (online.pick && online.beginRow) setOnlinePick(online.pick);
  };
  // The toss winner sends the choice; the answer carries the match's first steps.
  const chooseFirstOnline = async (who: 'player' | 'npc'): Promise<boolean> => {
    const online = onlineRef.current;
    if (!online) return false;
    for (let attempt = 0; attempt < 4 && !online.stopped; attempt++) {
      const r = await sendAction(online.init.id, { type: 'choose_first', goFirst: who === 'player' }, online.lastSeen);
      if (online.stopped) return false;
      if (r.ok === true) { absorbAct(online, r); return true; }
      if (!r.unavailable) { showToast(r.error); return false; }
      await sleep(1500 * (attempt + 1));
    }
    showToast('Sem conexão com o servidor de partidas.');
    return false;
  };
  const absorbAct = (online: OnlineMatch, r: Extract<ActResult, { ok: true }>) => {
    online.skew = r.now - Date.now();
    ingestRows(online, r.rows);
    if (r.finished) online.finished = true;
    if (r.reward) online.reward = r.reward;
    online.deadline = r.finished ? null : r.deadline;
    publishClock(online);
  };
  // The server refused something I had already shown: say why and go back to the last step the server confirmed.
  const refuseOwn = (online: OnlineMatch, error: string) => {
    showToast(error);
    online.epoch += 1;
    online.ownQueue.splice(0).forEach(q => q.done(false));
    setAmbushPrompt(null);
    setCardPicker(null);
    setSelectedCardIndex(null);
    setSelectedAttackerIndex(null);
    setPendingTacticAction(null);
    if (online.confirmed) { engineRef.current = online.confirmed; syncView(online.confirmed); }
  };
  // My actions go to the server one at a time, in order.
  const sendOnline = (online: OnlineMatch, action: EngineAction) => {
    const epoch = online.epoch;
    online.sendChain = online.sendChain.then(async () => {
      for (let attempt = 0; attempt < 6 && !online.stopped; attempt++) {
        if (epoch !== online.epoch) return;
        const r = await sendAction(online.init.id, action, online.lastSeen);
        if (online.stopped) return;
        if (r.ok === true) { absorbAct(online, r); return; }
        if (!r.unavailable) { if (epoch === online.epoch) refuseOwn(online, r.error); return; }
        await sleep(1500 * (attempt + 1));
      }
      if (!online.stopped && epoch === online.epoch) refuseOwn(online, 'Sem conexão com o servidor de partidas.');
    });
  };
  const stopOnline = () => {
    const online = onlineRef.current;
    if (online) {
      online.stopped = true;
      if (online.timer) window.clearTimeout(online.timer);
      online.ownQueue.splice(0).forEach(q => q.done(false));
      wakeWaiter(online);
    }
    onlineRef.current = null;
    setOpponentInfo(null);
    setWaitingRemote(false);
    setTurnClock(null);
  };
  // Reads the steps I have not seen yet; every few seconds it also pokes the server so a turn clock that ran out
  // gets enforced even if both players are idle.
  const startOnlinePolling = (online: OnlineMatch) => {
    const poll = async () => {
      if (online.stopped) return;
      const rows = await fetchViews(online.init.id, online.lastSeen);
      if (online.stopped) return;
      if (rows && rows.length) ingestRows(online, rows);
      if (!online.finished && Date.now() - online.lastTick > 5000) {
        online.lastTick = Date.now();
        const r = await tickMatch(online.init.id, online.lastSeen);
        if (online.stopped) return;
        if (r.ok === true) absorbAct(online, r);
      }
      if (online.finished && !(rows && rows.length)) return;
      online.timer = window.setTimeout(poll, rows && rows.length ? 400 : 1000);
    };
    online.timer = window.setTimeout(poll, 600);
  };
  // The opponent's next action: the AI's decision in a local match, the next step from the server in an online one.
  const nextOpponentAction = async (): Promise<EngineAction | null> => {
    const online = onlineRef.current;
    if (tutRef.current) {
      // The tutorial's trainer plays a fixed script (src/tutorial/script.ts), not the AI.
      const st = engineRef.current, t = tutRef.current;
      if (!st) return null;
      if (t.enemyRound !== st.turn.round) { t.enemyRound = st.turn.round; t.enemyDone = 0; }
      return tutEnemyAction(st, t.enemyDone++);
    }
    if (!online) { const st = engineRef.current; return st ? aiNextAction(st, 1) : null; }
    const t0 = Date.now();
    let notified = false;
    online.waiting = true;
    try {
      while (!online.stopped) {
        const row = online.remote.shift();
        if (row) { online.cursor = row; setWaitingRemote(false); return row.action; }
        if (engineRef.current?.winner != null) return null;
        if (!notified && Date.now() - t0 > 2500) { notified = true; setWaitingRemote(true); }
        await new Promise<void>(resolve => { online.waiter = resolve; window.setTimeout(resolve, 500); });
      }
      return null;
    } finally {
      online.waiting = false;
    }
  };
  // Pays out into the profile kept on this device (the server already did it in the cloud).
  const applyRewardToProfile = (r: RewardInfo) => {
    const p = loadProfile();
    saveProfile({ ...p, level: r.level, xp: r.xp_after, coroas: r.coroas_after, xpToNext: xpToNext(r.level) });
  };

  // A pick prompt the engine is waiting on from the player (a search, a reveal): show it, then send the answer.
  cardPickerRef.current = cardPicker;
  const openPlayerPick = () => {
    if (cardPickerRef.current) return;
    // An effect is glowing right now (its card floats): what it asks the player appears once the glow is over.
    if (trigGlowPendingRef.current > 0) { whenGlowDone(() => { if (!cardPickerRef.current) openPlayerPick(); }); return; }
    const pend = engineRef.current?.pending;
    if (pend && pend.kind === 'discard' && pend.seat === 0) {
      // Over the hand limit at the end of the turn: choose which cards go to the graveyard.
      const hand12 = engineRef.current!.players[0].hand.map(toCardData);
      openCardPicker(`Mão acima do limite: descarte ${pend.count} carta${pend.count > 1 ? 's' : ''} para o cemitério`, hand12, pend.count, (picked) => {
        const r = dispatchAction(0, { type: 'discard', cardIds: picked.map(c => c.id) });
        if (r.ok === false) { showToast(r.error); return; }
        cardPickerRef.current = null;
        setCardPicker(null);
      }, { minPicks: pend.count, alwaysConfirm: true });
      return;
    }
    if (!pend || pend.kind !== 'pick' || pend.seat !== 0) return;
    openCardPicker(pend.title, pend.options.map(toCardData), pend.max, (picked) => {
      const r = dispatchAction(0, { type: 'choose', cardIds: picked.map(c => c.id) });
      if (r.ok === false) { showToast(r.error); return; }
      cardPickerRef.current = null;
      setCardPicker(null);
      if (r.wait) void r.wait.then(ok => { if (ok) openPlayerPick(); });
    });
  };

  // What the player's own taps use: dispatch, say why when the rules refuse, open any prompt that follows.
  const playerAct = (action: EngineAction, opts: { skip?: { hand?: boolean; boards?: boolean } } = {}): boolean => {
    const r = dispatchAction(0, action, opts);
    if (r.ok === false) { showToast(r.error); return false; }
    // A prompt that depends on what only the server knows (a deck search) opens once its answer is here.
    if (r.wait) void r.wait.then(ok => { if (ok) openPlayerPick(); });
    openPlayerPick();
    return true;
  };

  // "Encerrar turno": every phase still to come (Combate, Movimentação) is passed in one go, so the player never has to tap
  // through them one by one. The engine does the rest (Aurelion's bonus, the swaps, the discard prompt if the hand is over
  // the limit, the opponent's turn). It stops at anything the player still has to answer.
  const endTurnNow = () => {
    if (currentTurn !== 'player' || phaseTransitionLock || autoPhase || tutOn || !engineRef.current) return;
    playUiClickSfx();
    setSelectedCardIndex(null);
    setSelectedAttackerIndex(null);
    setSelectedMoverIndex(null);
    skipPhaseBannersRef.current = true;
    try {
      for (let guard = 0; guard < 8; guard++) {
        const eng = engineRef.current;
        if (!eng || eng.winner !== null || eng.turn.active !== 0 || eng.pending) break;
        const r = dispatchAction(0, { type: 'advance' });
        if (r.ok === false) { showToast(r.error); break; }
      }
    } finally { skipPhaseBannersRef.current = false; }
    openPlayerPick();
  };

  const sleep = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

  // ── Tutorial director ──────────────────────────────────────────────────────────────────────────────────────────
  // Walks the steps of src/tutorial/script.ts. A step is shown once the board is quiet (no banner, no animation); a
  // "do" step ends when the player really does the thing (tutSignal, fed by dispatchAction and a few taps); the
  // trainer's turn calls tutBeat() to talk between its moves. While a tutorial runs, the gate below lets the player
  // touch only what the step lights up.
  // "Busy" = something is still moving on the board: a banner, a card flying in from the hand, an attack, a slide, an equip.
  tutBusyRef.current = !!(phaseTransitionLock || autoPhase || attackAnim || repositionFlight || matchIntroStage || npcKickoffPending || equipFx || announcedCard || preZoomSlot || flyingCard || cameraSettling || isAnimating);
  if (typeof window !== 'undefined' && window.location.search.includes('debug')) {
    (window as any).__tutDebug = () => ({ shown: tutShown ? { id: tutShown.id, kind: tutShown.kind, until: tutShown.until ?? null } : null, current: tutCurrent()?.id ?? null, busy: tutBusyRef.current });
  }
  const tutCurrent = (): TutStep | null => {
    const t = tutRef.current; if (!t) return null;
    return t.beat ? (t.beat[t.beatIdx] ?? null) : (t.idx >= 0 ? (TUT_STEPS[t.idx] ?? null) : null);
  };
  const tutCanBack = (): boolean => {
    const t = tutRef.current; if (!t || !tutShown) return false;
    if (t.beat) return t.beatIdx > 0;
    return t.idx > 0 && TUT_STEPS[t.idx - 1].kind === 'read';
  };
  const tutShow = async (step: TutStep, immediate = false): Promise<void> => {
    const t = tutRef.current; if (!t) return;
    const token = ++t.token;
    setTutShown(null);
    // Wait for the board to be quiet (a card still flying into its slot, a hit, a slide…) and stay quiet for a moment,
    // so a new box never pops up while something is still being placed.
    if (!immediate) for (let i = 0, calm = 0; i < 120 && calm < 4 && tutRef.current?.token === token; i++) { await sleep(120); calm = tutBusyRef.current ? 0 : calm + 1; }
    if (tutRef.current?.token !== token) return;
    if (step.enter === 'unselect') { setSelectedCardIndex(null); setSelectedAttackerIndex(null); setSelectedMoverIndex(null); }
    if (step.enter === 'begin') dispatchAction(0, { type: 'begin' }, { quietTurn: true });
    if (step.enter === 'announce-prep') announcePhase('preparacao');
    setTutTracker(step.tracker ?? null);
    if (step.kind === 'wait') { await sleep(step.ms ?? 1000); if (tutRef.current?.token === token) tutNext(); return; }
    setTutReplay(0);
    setTutShown(step);
  };
  const tutGo = (idx: number) => {
    const t = tutRef.current; if (!t) return;
    t.idx = idx; t.beat = null;
    const step = TUT_STEPS[idx];
    if (!step) { setTutShown(null); return; }
    if (step.kind === 'enemy') { setTutShown(null); setTutTracker(null); return; }   // the trainer plays; the turn coming back moves us on
    void tutShow(step);
  };
  const tutNext = (delay = 0) => {
    if (!tutRef.current) return;
    const go = () => {
      const t = tutRef.current; if (!t) return;
      if (t.beat) {
        if (t.beatIdx + 1 < t.beat.length) { t.beatIdx++; void tutShow(t.beat[t.beatIdx], true); }
        else { const done = t.beatDone; t.beat = null; t.beatDone = null; setTutShown(null); setTutTracker(null); done?.(); }
        return;
      }
      tutGo(t.idx + 1);
    };
    setTutShown(null);
    if (delay > 0) window.setTimeout(go, delay); else go();
  };
  const tutBack = () => {
    const t = tutRef.current; if (!t) return;
    if (t.beat) { if (t.beatIdx > 0) { t.beatIdx--; void tutShow(t.beat[t.beatIdx], true); } return; }
    if (t.idx > 0) tutGo(t.idx - 1);
  };
  const tutMatches = (u: TutUntil, g: TutUntil): boolean => {
    if (u.t !== g.t) return false;
    switch (u.t) {
      case 'tracker': return true;
      case 'advance': return g.t === 'advance' && u.from === g.from;
      case 'select': return g.t === 'select' && u.card === g.card;
      case 'play': return g.t === 'play' && u.card === g.card && u.slot === g.slot;
      case 'attack': return g.t === 'attack' && u.from === g.from && u.to === g.to;
      case 'move': return g.t === 'move' && u.from === g.from && u.to === g.to;
      case 'slotTap': return g.t === 'slotTap' && u.slot === g.slot;
    }
  };
  const tutSignal = (g: TutUntil) => {
    const step = tutCurrent();
    if (!step || step.kind !== 'do' || !step.until || !tutMatches(step.until, g)) return;
    tutNext({ tracker: 150, advance: 600, select: 300, play: 800, move: 1000, attack: 1700, slotTap: 400 }[g.t]);
  };
  const tutFromAction = (before: GameState, a: EngineAction) => {
    if (a.type === 'play') { const c = before.players[0].hand.find(h => h.id === a.cardId); if (c && a.slot !== undefined) tutSignal({ t: 'play', card: c.name, slot: a.slot }); }
    else if (a.type === 'attack') tutSignal({ t: 'attack', from: a.from, to: a.to });
    else if (a.type === 'move') tutSignal({ t: 'move', from: a.from, to: a.to });
    else if (a.type === 'advance') tutSignal({ t: 'advance', from: before.turn.phase });
  };
  // The trainer's turn pauses here to talk (beats are keyed `enemy<round>:<moment>` in the script).
  const tutBeat = async (key: string): Promise<void> => {
    const t = tutRef.current, st = engineRef.current;
    const steps = t && st ? TUT_BEATS[`enemy${st.turn.round}:${key}`] : undefined;
    if (!t || !steps) return;
    if (key === 'afterAttack') await sleep(1700);   // let the fall and the Reforço slide finish before explaining them
    await new Promise<void>(resolve => { t.beat = steps; t.beatIdx = 0; t.beatDone = resolve; void tutShow(steps[0], true); });
  };
  const tutExit = () => {
    tutRef.current = null;
    setTutOn(false); setTutShown(null); setTutTracker(null); setTutIntro(false);
    matchIntroTimeoutsRef.current.forEach(clearTimeout); matchIntroTimeoutsRef.current = [];
    setMatchIntroStage(null); setGameOverWinner(null);
    stopOnline(); setGameMode(null);
  };
  const tutFinish = () => { const id = tutRef.current?.id; if (id) markTutorialDone(id); tutExit(); setTutListOpen(true); };
  const startTutorial = (id: string) => {
    setTutListOpen(false);
    tutRef.current = { id, idx: -1, beat: null, beatIdx: 0, beatDone: null, token: 0, enemyRound: 0, enemyDone: 0 };
    setTutOn(true); setTutIntro(true);
  };
  const tutLaunchDuel = () => { setTutIntro(false); stopOnline(); resetGame(); setGameMode('Quick Match'); };
  // The coin: the instructor explains it while it spins; the duel goes on once it has landed AND he has been heard.
  const tutCoinResolved = (first: 'player' | 'npc') => { tutCoinRef.current.resolved = first; if (tutCoinRef.current.acked) continueMatchIntro(first); };
  useEffect(() => {
    const t = tutRef.current;
    if (!t || matchIntroStage !== 'coin') return;
    tutCoinRef.current = { acked: false, resolved: null };
    t.beat = [TUT_COIN_STEP]; t.beatIdx = 0;
    t.beatDone = () => { tutCoinRef.current.acked = true; if (tutCoinRef.current.resolved) continueMatchIntro(tutCoinRef.current.resolved); };
    void tutShow(TUT_COIN_STEP, true);
  }, [matchIntroStage]);
  // The trainer's turn is over (the turn came back): the next step.
  useEffect(() => {
    const t = tutRef.current;
    if (!t || currentTurn !== 'player' || t.beat) return;
    if (TUT_STEPS[t.idx]?.kind === 'enemy') tutNext();
  }, [currentTurn]);
  // Touching a card in the hand answers a "read this card" step.
  useEffect(() => {
    if (!tutRef.current || selectedCardIndex === null) return;
    const c = handRef.current[selectedCardIndex];
    if (c) tutSignal({ t: 'select', card: c.name });
  }, [selectedCardIndex]);
  // Victory: the instructor closes the tutorial.
  useEffect(() => {
    const t = tutRef.current;
    if (!t || gameOverWinner !== 'player') return;
    const id = window.setTimeout(() => {
      const outro: TutStep = { id: 'outro', kind: 'read', expr: 'cheer', chapter: TUT_CHAPTERS, title: TUT_OUTRO.title, lines: TUT_OUTRO.lines, quiet: true, panel: 'bottom' };
      t.beat = [outro]; t.beatIdx = 0; t.beatDone = tutFinish;
      void tutShow(outro, true);
    }, 2600);
    return () => window.clearTimeout(id);
  }, [gameOverWinner]);
  // The gate: while a tutorial runs, every touch is swallowed unless it lands on the instructor's panel or, in a "do"
  // step, inside a rectangle the step lights up (the stage keeps tutAllowRef up to date).
  useEffect(() => {
    if (!tutOn) return;
    const types = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'touchstart', 'touchend', 'contextmenu'];
    const handler = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest?.('[data-tut-ui]')) return;
      const step = tutCurrent();
      let x = NaN, y = NaN;
      if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) { const tt = e.changedTouches[0] ?? e.touches[0]; if (tt) { x = tt.clientX; y = tt.clientY; } }
      else if ('clientX' in e) { x = (e as MouseEvent).clientX; y = (e as MouseEvent).clientY; }
      if (step?.kind === 'do' && tutAllowRef.current.some(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)) {
        if (e.type === 'click' && step.until?.t === 'slotTap') { const slot = step.until.slot; window.setTimeout(() => tutSignal({ t: 'slotTap', slot }), 0); }
        return;
      }
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };
    types.forEach(n => window.addEventListener(n, handler, true));
    return () => types.forEach(n => window.removeEventListener(n, handler, true));
  }, [tutOn]);

  // After an attack: if the defender may spring an Emboscada, wait for the answer — the human is asked on
  // screen, the AI decides by itself.
  const settleAmbush = async (): Promise<void> => {
    for (let guard = 0; guard < 4; guard++) {
      const s = engineRef.current;
      const pend = s?.pending;
      if (!s || !pend || pend.kind !== 'ambush') return;
      if (pend.seat === 0) {
        const attackerCard = s.players[pend.attacker].board[pend.from];
        const defenderCard = s.players[0].board[pend.to];
        const options = s.players[0].hand.filter(h => pend.options.includes(h.id)).map(toCardData);
        const chosen = await new Promise<CardData | null>(resolve => {
          ambushResolveRef.current = resolve;
          setAmbushPrompt({ defenderName: defenderCard?.name ?? '', attackerName: attackerCard?.name ?? '', options, resolve });
        });
        ambushResolveRef.current = null;
        // The prompt may have been settled for me meanwhile (online: my time ran out).
        const still = engineRef.current?.pending;
        if (!still || still.kind !== 'ambush' || still.seat !== 0) continue;
        const r = dispatchAction(0, { type: 'ambush', cardId: chosen?.id ?? null });
        if (r.ok === false) showToast(r.error);
        else if (r.wait) await r.wait;
      } else {
        const a = await nextOpponentAction();
        if (!a) return;
        if (a.type === 'ambush' && a.cardId && !onlineRef.current) await sleep(500);
        dispatchAction(1, a);
      }
    }
  };

  // Brings both Generals onto the board (after the VS reveal above plays out), then deals both starting
  // hands with a staggered "drawn from the deck" beat — the player's own draw animation for their hand,
  // and incrementally revealing the opponent's face-down hand for theirs — so the match visibly begins
  // instead of the board and both hands just appearing fully set up the instant the match starts.
  const startMatchIntro = () => {
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      matchIntroTimeoutsRef.current.push(id);
    };
    // Same 500ms mobile viewport-settle window as the deck-draw comment below (the browser's URL bar
    // collapsing right as a match starts nudges windowSize once, which the two big reveal portraits are
    // positioned from) — starting the reveal only once that's done means it never has to re-glide.
    const INTRO_START = 550;
    const online = onlineRef.current;
    setCoinSide(online ? (online.init.mySide ?? (online.init.iGoFirst ? 'cara' : 'coroa')) : Math.random() < 0.5 ? 'cara' : 'coroa');
    // Both Generals' art floats in from the sides and holds, frozen in that big reveal position...
    schedule(() => { setMatchIntroStage('panels'); playRevealGeneralSfx(); }, INTRO_START);
    // ...and then the coin toss decides who plays first (CoinToss calls continueMatchIntro).
    schedule(() => setMatchIntroStage('coin'), INTRO_START + 900);
  };

  // Everything after the toss: the engine match is created, BATALHA, the Generals landing, both hands dealt,
  // and — when the opponent won the toss — the opponent's first turn.
  const continueMatchIntro = (first: 'player' | 'npc') => {
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      matchIntroTimeoutsRef.current.push(id);
    };
    firstSideRef.current = first;
    const firstSeat: Seat = first === 'player' ? 0 : 1;
    const online = onlineRef.current;
    let created: { state: GameState };
    if (tutRef.current) {
      // Tutorial: the fixed duel (hands and draws set in advance), no seed, no match log.
      created = { state: createTutorialMatch() };
      matchLogRef.current = null;
      engineRef.current = created.state;
    } else if (online) {
      // Online: the match is the server's; this is how it stands before the first turn, seen from my chair.
      const st = online.init.start;
      created = { state: { ...st, turn: { ...st.turn, first: firstSeat, active: firstSeat } } };   // `start` was made before the toss winner chose
      online.confirmed = created.state;
      engineRef.current = created.state;
    } else {
      const sel = matchSelectionRef.current;
      const matchOptions = {
        seed: Math.floor(Math.random() * 0x7fffffff),
        decks: [{ general: sel.general, cards: sel.cards }, deckSetupFromRecipe(sel.npcDeckId)] as [ReturnType<typeof deckSetupFromRecipe>, ReturnType<typeof deckSetupFromRecipe>],
        first: firstSeat,
      };
      created = createMatch(matchOptions);
      matchLogRef.current = newMatchLog(matchOptions);
      engineRef.current = created.state;
    }
    const dealt = created.state;
    setNpcKickoffPending(true);   // nothing can be tapped until both hands are dealt
    const BATTLE_START = 250;
    // "BATALHA" slams down between the two still-frozen portraits — the declaration lands BEFORE either
    // General has taken their place on the board.
    schedule(() => { setMatchIntroStage('battle'); playBatalhaBannerSfx(); }, BATTLE_START);
    schedule(() => playBatalhaImpactSfx(), BATTLE_START + Math.round(BATALHA_FALL_MS * BATALHA_IMPACT_FRACTION));
    const BATTLE_BANNER_MS = BATALHA_FALL_MS + 1500;
    const DESCEND_START = BATTLE_START + BATTLE_BANNER_MS;
    schedule(() => setMatchIntroStage('descend'), DESCEND_START);
    const LAND = DESCEND_START + 750;
    schedule(() => {
      setPlayerSlots(prev => { const next = [...prev]; next[12] = toCardData(dealt.players[0].board[12]!); return next; });
      setNpcSlots(prev => { const next = [...prev]; next[12] = toCardData(dealt.players[1].board[12]!); return next; });
      playCardPlaySfx();
      setIntroDescendTargets(null);
      setMatchIntroStage(null);
    }, LAND);

    // Both starting hands (START_HAND cards each) are dealt fast, a card every DEAL_STEP ms, so the match
    // starts quickly. Kept comfortably past the viewport-settle window (see viewportSettled) so the deck's
    // on-screen position is already final by the time the first card's flight measures it.
    const DEAL_START = LAND + 400;
    const DEAL_STEP = 230;
    for (let i = 0; i < START_HAND; i++) {
      const t = DEAL_START + i * DEAL_STEP;
      schedule(() => {
        const card = toCardData(dealt.players[0].hand[i]);
        const origin = computeDrawOrigin(playerDeckRef, handRef.current.length);
        if (origin) drawOriginsRef.current[card.id] = origin;
        playCardDrawSfx();
        setHand(prev => [...prev, card]);
      }, t);
      schedule(() => {
        playCardDrawSfx();
        setNpcHand(prev => [...prev, toCardData(dealt.players[1].hand[i])]);
      }, t + 110);
    }
    const DEALT = DEAL_START + START_HAND * DEAL_STEP + DRAW_FLIGHT_MS * 0.6;
    schedule(() => {
      if (tutRef.current) {
        // Tutorial: nothing starts by itself. The instructor walks through the board and asks for the first draw.
        setNpcKickoffPending(false);
        tutGo(0);
        return;
      }
      if (first === 'player') {
        // The first player draws as their turn begins (11 cards), then the usual phase ribbon.
        dispatchAction(firstSeat, { type: 'begin' }, { quietTurn: true });
        setNpcKickoffPending(false);
        announcePhase('preparacao');
      } else {
        // The opponent opens: its draw happens as its turn starts, and its runner takes it from there.
        setNpcKickoffPending(false);
        dispatchAction(firstSeat, { type: 'begin' });
      }
    }, DEALT);
  };

  // `sel` is the deck the PLAYER picked (one of their saved decks, see buildDeckSelection);
  // the AI plays the prebuilt deck of the other faction, so every match shows both in action.
  const resetGame = (sel: DeckSelection = DEFAULT_DECK_SELECTION) => {
    matchIntroTimeoutsRef.current.forEach(clearTimeout);
    matchIntroTimeoutsRef.current = [];
    setMatchIntroStage(null);
    setIntroDescendTargets(null);
    burstSeenRef.current = { ready: false, player: {}, npc: {}, arrived: new Set() };   // a new match: nothing has arrived yet

    engineRef.current = null;
    matchLogRef.current = null;
    setMatchReward(null);
    setTurnClock(null);
    matchSelectionRef.current = sel;
    ghostsRef.current = { player: {}, npc: {} }; holdsRef.current = { player: {}, npc: {} };

    firstSideRef.current = 'player';
    setNpcKickoffPending(false);
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
    setCardPicker(null);
    setPlayerGeneralAbilityUses(0);
    setNpcGeneralAbilityUses(0);
    setPendingAbility(null);
    setPlayerAttackCounts({});
    setPlayerActivatedAbilityIds(new Set());
    setPlayerMana(START_GOLD);
    setNpcMana(START_GOLD);
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

  const startGame = (mode: string, sel?: DeckSelection) => {
    stopOnline();
    resetGame(sel);
    setGameMode(mode);
  };

  // An online match found by the queue (or the bot fallback): the same intro, then the server's match.
  const startOnlineMatch = (init: MatchInit) => {
    stopOnline();
    const online: OnlineMatch = {
      init, lastSeen: 0, remote: [], cursor: null, waiting: false, ownQueue: [], waiter: null, timer: null, sendChain: Promise.resolve(),
      epoch: 0, stopped: false, finished: init.status === 'finished', confirmed: null, deadline: init.deadline, skew: init.now - Date.now(),
      beginRow: null, pick: null, lastTick: Date.now(), reward: null,
    };
    onlineRef.current = online;
    setOnlinePick(null);
    setOpponentInfo(init.opponent);
    const sel: DeckSelection = { cards: init.myDeck.cards, general: init.myDeck.general, npcDeckId: 'cardeal', npcGeneral: init.opponentGeneral };
    resetGame(sel);
    setGameMode('Quick Match');
    if (init.resumed && init.latest) {
      // Coming back to a match already under way: no intro, straight to the board as it stands.
      matchIntroTimeoutsRef.current.forEach(clearTimeout);
      matchIntroTimeoutsRef.current = [];
      setMatchIntroStage(null);
      setNpcKickoffPending(false);
      const view = init.latest.state;
      online.lastSeen = init.latest.n;
      online.confirmed = view;
      engineRef.current = view;
      ghostsRef.current = { player: {}, npc: {} }; holdsRef.current = { player: {}, npc: {} };
      syncView(view);
      publishClock(online);
      if (view.winner !== null) setGameOverWinner(view.winner === 0 ? 'player' : 'npc');
      else {
        setViewState(view.turn.active === 0 ? 'hand' : 'field');
        // an answer may be owed (an ambush or a pick) — or awaited from the other side
        openPlayerPick();
        void settleAmbush();
      }
      startOnlinePolling(online);
      return;
    }
    ingestRows(online, init.rows);   // the begin step, and anything the bot already did while we were loading
    startOnlinePolling(online);
  };
  // Leaving a match from the menu: online, that is a concession (the server records it) — then back to the menu.
  const leaveMatch = async () => {
    const online = onlineRef.current;
    const live = engineRef.current && engineRef.current.winner === null;
    if (online && live) {
      online.stopped = true;
      if (online.timer) window.clearTimeout(online.timer);
      const r = await sendAction(online.init.id, { type: 'concede' }, online.lastSeen);
      if (r.ok === true && r.reward) applyRewardToProfile(r.reward);
    }
    stopOnline();
    setGameMode(null);
  };

  // The opponent's turn: the AI looks at the engine state and answers with one action at a time — exactly
  // the actions a human would send — and each one is dressed with the same pauses, banners and effects as
  // before. When the AI passes the last phase, the engine itself hands the turn to the player.
  useEffect(() => {
    if (currentTurn !== 'npc' || gameMode !== 'Quick Match' || isAnimating || gameOverWinner || !engineRef.current) return;
    const runAiTurn = async () => {
      setIsAnimating(true);
      // The "Turno do Adversário" banner is still on screen when this starts, so wait for it first.
      setNpcVisiblePhase('compra');
      await sleep(750);
      setNpcVisiblePhase('suprimentos');
      await sleep(Math.max(0, PHASE_BANNER_DURATION_MS - 1000 - 750) + 150);
      setNpcVisiblePhase('preparacao');
      showBanner('Fase de Preparação', 'O adversário joga suas cartas');
      await sleep(PHASE_BANNER_DURATION_MS + 150);
      let combatAnnounced = false;
      let movementAnnounced = false;
      await tutBeat('start');
      for (let guard = 0; guard < 300; guard++) {
        if (!engineRef.current || engineRef.current.winner !== null || engineRef.current.turn.active !== 1) break;
        const action = await nextOpponentAction();
        const s = engineRef.current;
        if (!action || !s || s.winner !== null) break;
        if (s.turn.phase === 'movimentacao' && (action.type === 'play' || action.type === 'ability')) {
          setNpcVisiblePhase('movimentacao');
          if (!movementAnnounced) {
            movementAnnounced = true;
            showBanner('Fase de Movimentação', 'O adversário move tropas e joga Táticas');
            await sleep(PHASE_BANNER_DURATION_MS + 150);
          }
        }
        if (action.type === 'play') {
          // Online the opponent's hand is hidden: the card they play is shown in the step itself.
          const shownPlay = onlineRef.current?.cursor?.events.find(e => e.t === 'play');
          const card = shownPlay && shownPlay.t === 'play' ? shownPlay.card : s.players[1].hand.find(h => h.id === action.cardId);
          if (!card) break;
          // Show the card big in the corner and pause on it for a beat BEFORE it lands on the board.
          announceCardPlay(toCardData(card), 'npc');
          await sleep(1000);
          if (dispatchAction(1, action).ok === false) break;
          await sleep(700);
        } else if (action.type === 'attack') {
          setNpcVisiblePhase('combate');
          if (!combatAnnounced) {
            combatAnnounced = true;
            showBanner('Fase de Combate', 'O adversário ataca suas unidades');
            await sleep(PHASE_BANNER_DURATION_MS + 150);
          }
          setAttackAnim({ attackerIndex: action.from, targetIndex: action.to, isPlayerAttacking: false });
          await sleep(ATTACK_MS);
          playAttackSfx();            // before the hit-stop: the clip's loud hit is 42 ms in, the hit-stop is 40 ms
          await sleep(HIT_STOP_MS);   // the lunge lands and everything holds for a beat before the hit
          const dryNpc = applyAction(engineRef.current!, 1, action);
          const soakedNpc = dryNpc.ok === true && blowIsSoaked(dryNpc.events, 0, action.to);
          setSoakedBlow(soakedNpc);
          setIsImpacting(true);
          if (!soakedNpc) triggerPunch(0, action.to);
          await sleep(IMPACT_MS);
          setIsImpacting(false);
          setSoakedBlow(false);
          const r = dispatchAction(1, action);
          if (r.ok === false) { setAttackAnim(null); break; }
          await settleAmbush();
          setAttackAnim(null);
          const killed = r.events.some(e => e.t === 'destroyed');
          await sleep(killed ? 1250 : 300);
          await tutBeat('afterAttack');
        } else if (action.type === 'move') {
          // Repositioning: the same slide the player's own moves get, on the opponent's board.
          setNpcVisiblePhase(s.turn.phase === 'combate' ? 'combate' : 'movimentacao');
          if (!movementAnnounced && s.turn.phase === 'movimentacao') {
            movementAnnounced = true;
            showBanner('Fase de Movimentação', 'O adversário reposiciona suas unidades');
            await sleep(PHASE_BANNER_DURATION_MS + 150);
          }
          const board = s.players[1].board;
          const originRect = document.getElementById(`npc-${action.from}`)?.getBoundingClientRect();
          const destRect = document.getElementById(`npc-${action.to}`)?.getBoundingClientRect();
          const mover = board[action.from];
          const occupant = board[action.to];
          if (originRect && destRect && mover) {
            playCardLiftSfx();
            setRepositionFlight({
              side: 'npc', originIndex: action.from, destIndex: action.to, moverCard: toCardData(mover), swappedCard: occupant ? toCardData(occupant) : null,
              mover: { fromX: originRect.left + originRect.width / 2, fromY: originRect.top + originRect.height / 2, toX: destRect.left + destRect.width / 2, toY: destRect.top + destRect.height / 2, w: originRect.width, h: originRect.height },
              swapped: occupant ? { fromX: destRect.left + destRect.width / 2, fromY: destRect.top + destRect.height / 2, toX: originRect.left + originRect.width / 2, toY: originRect.top + originRect.height / 2, w: destRect.width, h: destRect.height } : null,
            });
            await sleep(450);
          }
          const r = dispatchAction(1, action);
          setRepositionFlight(null);
          if (r.ok === false) break;
          await sleep(350);
        } else if (action.type === 'ability') {
          showToast(action.slot === 12 ? 'O oponente usou a habilidade do General!' : 'O oponente usou uma habilidade!');
          if (dispatchAction(1, action).ok === false) break;
          await sleep(700);
        } else {
          // advance / choose / ambush: no ceremony
          if (dispatchAction(1, action).ok === false) break;
        }
      }
      setNpcVisiblePhase(null);
      setIsAnimating(false);
    };
    const timer = setTimeout(runAiTurn, 1000);
    return () => clearTimeout(timer);
  }, [currentTurn, gameMode, gameOverWinner]);

  // Online: the turn clock ticks on screen once a second.
  useEffect(() => {
    if (!turnClock) return;
    setClockNow(Date.now());
    const id = window.setInterval(() => setClockNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [turnClock]);

  // Online: when the match is over, show what it paid (the server pays once, when the match ends).
  useEffect(() => {
    const online = onlineRef.current;
    if (!gameOverWinner || !online) return;
    let alive = true;
    setMatchReward('pending');
    (async () => {
      for (let i = 0; i < 8 && alive; i++) {
        const reward = online.reward ?? (await fetchResult(online.init.id))?.reward ?? null;
        if (!alive) return;
        if (reward) { online.reward = reward; applyRewardToProfile(reward); setMatchReward(reward); return; }
        await sleep(1200);
      }
      if (alive) setMatchReward(null);
    })();
    return () => { alive = false; };
  }, [gameOverWinner]);

  if (!assetsReady) {
    return <LoadingScreen onDone={() => setAssetsReady(true)} />;
  }

  if (!authReady) return <div className="fixed inset-0 bg-black" />;
  if (!session) return <LoginScreen />;
  if (authMode === 'supabase' && profileLoading) {
    return <div className="fixed inset-0 bg-black flex items-center justify-center text-[#cdbd97] text-[12px] uppercase tracking-[0.2em]" style={{ fontFamily: "'Cinzel', serif" }}>Carregando seu perfil…</div>;
  }
  if (profileError) {
    return (
      <AuthBackdrop>
        <div className="flex-1" />
        <FramedWindow>
          <div className="flex flex-col items-center gap-3 px-2 py-2">
            <WindowTitle>Não deu para carregar</WindowTitle>
            <WindowText>{profileError}</WindowText>
            <div className="flex gap-3">
              <WindowButton onClick={() => void signOut()}>Sair</WindowButton>
              <WindowButton primary onClick={() => setProfileTry(n => n + 1)}>Tentar de novo</WindowButton>
            </div>
          </div>
        </FramedWindow>
      </AuthBackdrop>
    );
  }
  if (!profileNamed) {
    const p = loadProfile();
    return (
      <ProfileSetupScreen
        initialName={authMode === 'supabase' ? '' : p.name}
        initialAvatar={p.avatarId}
        onSubmit={async (name, avatarId) => {
          if (authMode === 'supabase' && session) {
            const r = await createProfile(session.userId, name, avatarId);
            if (r.ok === false) return r.message;
            const row = r.data;
            const syncErr = await syncDeckStoreWithCloud(session.userId);
            if (syncErr) return syncErr;
            saveProfile({ ...DEFAULT_PROFILE, name: row.username, avatarId: row.avatar_id, level: row.level, xp: row.xp, coroas: row.coroas, xpToNext: xpToNext(row.level), nameSet: true });
          } else {
            saveProfile({ ...p, name, avatarId, nameSet: true });
          }
          setProfileNamed(true);
          return null;
        }}
      />
    );
  }

  if (!gameMode) {
    return (
      <div className="relative w-full h-dvh bg-zinc-950 text-white">
        <MainMenu session={session} onTutorials={() => setTutListOpen(true)} onSelectMode={(mode) => {
          // Desafios (mode 'Campaign') is the only menu entry that starts a match
          // for now: pick a deck, then play as 'Quick Match' — the one game mode the
          // NPC's turn logic is actually wired to (see the gameMode === 'Quick Match'
          // check in the NPC turn effect).
          if (mode === 'Campaign') { setDeckPickerFor('desafios'); setDeckPickerOpen(true); }
          else if (mode === 'OnlineCasual') { setDeckPickerFor('casual'); setDeckPickerOpen(true); }
          else startGame(mode);
        }} />
        <AnimatePresence>
          {tutListOpen && <TutorialList key="tut-list" onClose={() => setTutListOpen(false)} onPlay={startTutorial} />}
          {tutIntro && <TutorialIntro key="tut-intro" onStart={tutLaunchDuel} onClose={tutExit} />}
        </AnimatePresence>
        <AnimatePresence>
          {deckPickerOpen && (
            <DeckPickerModal
              store={loadDeckStore()}
              onSelect={(sel) => {
                setDeckPickerOpen(false);
                // With accounts, every match (against a person or the AI) goes through the game server; without them,
                // the local game stays as it was.
                if (deckPickerFor === 'casual') setSearching({ sel, challenge: false });
                else if (authMode === 'supabase') setSearching({ sel, challenge: true });
                else startGame('Quick Match', sel);
              }}
              onClose={() => setDeckPickerOpen(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {searching && authMode === 'supabase' && (
            <OnlineSearchOverlay
              key="searching-online"
              selection={searching.sel}
              challenge={searching.challenge}
              onCancel={() => setSearching(null)}
              onMatched={(init) => { setSearching(null); startOnlineMatch(init); }}
              // The server is not reachable (not deployed yet, no connection): a challenge still plays locally.
              onUnavailable={searching.challenge ? () => { const sel = searching.sel; setSearching(null); startGame('Quick Match', sel); } : undefined}
            />
          )}
          {searching && authMode !== 'supabase' && <MatchSearchOverlay key="searching" onCancel={() => setSearching(null)} onReady={() => { const sel = searching.sel; setSearching(null); startGame('Quick Match', sel); }} />}
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
    // Units, Relíquias and Terrenos only in Preparação; Táticas also in Movimentação.
    if (!canPlayInPhase(hand[index] ?? {}, turnPhase)) {
      showToast(turnPhase === 'movimentacao' ? 'Na Movimentação só dá pra jogar Táticas!' : 'Jogar cartas só nas fases de Preparação e Movimentação!');
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
      // A Tática that needs a target skips the "Jogar" step: one tap on the card goes straight to picking the
      // target (Cancelar puts it back in the hand). Without enough gold it is only selected, and says why.
      const firstTapKind = getCardDropKind(hand[index]);
      if ((firstTapKind === 'ownTarget' || firstTapKind === 'enemyTarget') && playerMana >= hand[index].cost) {
        playSelectSfx();
        setSelectedAttackerIndex(null);
        setPendingTacticAction({ card: hand[index] });
        setSelectedCardIndex(null);
        setViewState('field');
        return;
      }
      setSelectedCardIndex(index);
      setSelectedAttackerIndex(null);
      playSelectSfx();
      // Proactive guidance the instant a card with a non-obvious next step gets
      // selected, instead of only surfacing after the player either guesses right
      // or taps somewhere wrong first (see the empty-slot rejection toast below) —
      // that used to read as the game being stuck rather than teaching the actual
      // next tap.
      const card = hand[index];
      const dropKind = getCardDropKind(card);
      // (the Jogar / Cancelar bar next to the card says what to do next, so no toast here)
      void dropKind; void card;
    }
  };

  // The "play" tap on a selected hand card. Cards that need a board target arm a target-picking mode (nothing
  // is spent until the target is chosen); everything else is handed straight to the engine, which also says
  // why a card cannot be played (Emboscadas, searches with nothing to find, not enough gold…).
  const handlePlayCardButtonClick = () => {
    const card = hand[selectedCardIndex!];
    if (!card) return;
    const kind = getCardDropKind(card);
    if (kind === 'ownTarget' || kind === 'enemyTarget') {
      if (playerMana < card.cost) {
        showToast("Ouro insuficiente!");
        return;
      }
      setPendingTacticAction({ card });
      setSelectedCardIndex(null);
      setViewState('field');
      return;
    }
    if (kind === 'place') {
      // Placed straight from handleSlotClick's own empty-slot branch the instant its destination is tapped.
      setViewState('field');
      return;
    }
    setSelectedCardIndex(null);
    playerAct({ type: 'play', cardId: card.id });
  };

  // True for the whole hand-off from "card selected" to "card landed on the board" — the
  // camera pre-zoom, the flight itself, and the brief settle afterward. Used to ignore
  // stray clicks that would otherwise cancel the card's selection mid-transition.
  const isCardInFlightTransition = !!(preZoomSlot || flyingCard || cameraSettling || repositionFlight || equipFx);

  // Which of the opponent's slots the currently-selected attacker can actually reach
  // (see getValidAttackTargets) — a plain per-render computation rather than a Hook
  // (this component conditionally returns early above for the main menu, so anything
  // declared here can't be a Hook call without breaking React's rules-of-hooks).
  const eng = engineRef.current;
  const validAttackTargets = selectedAttackerIndex !== null && eng
    ? getValidAttackTargets(selectedAttackerIndex, eng.players[0].board, eng.players[1].board)
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
  // Combat is open from the 2nd turn of the match: always from round 2 on, and in round 1 only for the
  // player who goes second.
  const combatOpenNow = eng ? engineCombatOpen(eng) : false;
  const activePhases = eng ? engineActivePhases(eng) : phasesForTurn(false);
  const isLastPhaseOfTurn = activePhases[activePhases.length - 1] === turnPhase;

  // Cálice da Graça (Relíquia, the slot-10 special slot) used to grant a second use per
  // turn, which combined with the old free-heal exploit (see playerGeneralAbilityAvailable's
  // history below) let its ATK stacking double up. It now boosts the heal amount
  // instead (see activateGeneralHeal's call sites), so the ability stays capped at
  // once per turn regardless of relics equipped.
  const playerGeneralAbilityMaxUses = 1;
  // Whether the player's own General has an activatable Fase-Principal ability ready
  // right now — drives the glowing prompt icon on the General slot (see CardSlot's
  // showAbilityPrompt call sites). The ability now always costs 2 gold and can target
  // any ally, including one at full HP — healing an already-full Recruta Devoto (0/2,
  // "Ao ser curado: recebe +1 ATK permanente") still grants its ATK bonus, but paying
  // 2 gold for it every turn is a deliberate trade-off now instead of the free,
  // unlimited stack this used to be before the ability had any cost at all.
  // The units each of an ability's targeted effects could land on right now (empty = nothing to choose; fine for an `optional` one).
  const abilityStepCandidates = (ab: NonNullable<ReturnType<typeof abilityOn>>) =>
    targetSpecsOf(ab.do).map(spec => specCandidatesOn(spec, playerSlots, npcSlots, [...movedSlots]));
  // An ability with choices can be used only if there is something to choose (any one of them, when they are all optional).
  function abilityHasTargets(ab: NonNullable<ReturnType<typeof abilityOn>>): boolean {
    const specs = targetSpecsOf(ab.do);
    if (specs.length === 0) return true;
    const cands = abilityStepCandidates(ab);
    return specs.every(sp => sp.optional) ? cands.some(x => x.length > 0) : cands.every(x => x.length > 0);
  }

  const playerGeneralAbility = playerSlots[12] ? abilityOn(playerSlots[12]!.name, 'ability') : undefined;
  const playerGeneralAbilityAvailable =
    !!playerGeneralAbility && !playerSlots[12]?.isDestroyed &&
    currentTurn === 'player' && abilityPhases(playerSlots[12]!.name).includes(turnPhase) && !eng?.pending && !gameOverWinner &&
    playerGeneralAbilityUses < playerGeneralAbilityMaxUses &&
    !tutOn &&   // every ability is off in the tutorial (Tutorial 2 teaches them)
    playerMana >= (playerGeneralAbility.cost ?? 0) &&
    // Infiltrado da Ordem: blocked for exactly the one turn following the General
    // taking damage (see playerGeneralAbilityBlockedThisTurnRef's own comment).
    !playerGeneralAbilityBlockedThisTurnRef.current &&
    abilityHasTargets(playerGeneralAbility);

  // Which once-per-turn creature ability (if any) is available to activate on this exact player slot right now — same "you may
  // activate this" shape as playerGeneralAbilityAvailable above, just per-card (see the glowing prompt on each of these below and
  // activateAbility). The kind picks the prompt's look: a heal, a hit, or a plain utility.
  const getPlayerCreatureAbilityKind = (slotIndex: number): 'heal' | 'damage' | 'utility' | null => {
    if (currentTurn !== 'player' || (turnPhase !== 'preparacao' && turnPhase !== 'movimentacao') || eng?.pending || gameOverWinner) return null;
    const card = playerSlots[slotIndex];
    if (!card || card.isDestroyed || playerActivatedAbilityIds.has(card.id)) return null;
    const ab = abilityOn(card.name, 'ability');
    if (!ab || !abilityPhases(card.name).includes(turnPhase)) return null;
    const first = ab.do[0]?.kind;
    return first === 'heal' ? 'heal' : first === 'damage' ? 'damage' : 'utility';
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
  if (selectedMoverIndex !== null) {
    const selfEl = document.getElementById(`player-${selectedMoverIndex}`);
    if (selfEl) {
      const r = selfEl.getBoundingClientRect();
      activeHalos.push({ key: 'mover', x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, image: haloSelectionImage, scale: 1.15, glow: 'drop-shadow(0 0 10px rgba(96,165,250,0.8))' });
    }
    validMoveTargets.forEach(i => {
      if (!playerSlots[i]) return;   // an empty destination keeps the slot's own outline
      const el = document.getElementById(`player-${i}`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      activeHalos.push({ key: `move-${i}`, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, image: haloValidTargetImage, scale: 1.15, glow: TARGET_STYLE.move.halo });
    });
  }
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
  // Plays the blow over the target card: `targetSeat` is the screen seat (0 = me) of the card being hit.
  const triggerPunch = (targetSeat: Seat, index: number) => {
    dbgMark('visual:impact');
    const el = getCardVisualEl(`${targetSeat === 0 ? 'player' : 'npc'}-${index}`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const key = Date.now();
    setPunchFx({ key, x: r.left, y: r.top, w: r.width, h: r.height, heavy: index === 12 });
    window.setTimeout(() => setPunchFx(prev => (prev && prev.key === key ? null : prev)), 700);
  };

  const activeAttackLine: { x1: number; y1: number; x2: number; y2: number; isPlayerAttacking: boolean } | null = (() => {
    if (!attackAnim || isImpacting) return null;   // the arrow gets out of the way when the blow lands
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

  // Plays the armed Tática on the tapped board slot. Nothing was spent while it was only armed, so a refused
  // target (wrong type, out of reach…) just explains itself and lets the player tap another one.
  const playPendingTactic = (slotIndex: number) => {
    if (!pendingTacticAction) return;
    if (!playerAct({ type: 'play', cardId: pendingTacticAction.card.id, target: slotIndex })) return;
    setPendingTacticAction(null);
    setViewState('hand');
  };
  // Avanço Coordenado / Linha Fechada / Ordem de Retirada / the equips target the player's OWN board.
  const resolveOwnTacticTarget = (slotIndex: number) => {
    if (!pendingTacticAction || getCardDropKind(pendingTacticAction.card) === 'enemyTarget') return;
    playPendingTactic(slotIndex);
  };
  // Reposicionamento Rápido / Balestra de Precisão / Catapulta de Guerra target the ENEMY board.
  const resolveEnemyTacticTarget = (slotIndex: number) => {
    if (!pendingTacticAction || getCardDropKind(pendingTacticAction.card) !== 'enemyTarget') return;
    playPendingTactic(slotIndex);
  };

  // Toggles one option in/out of the current cardPicker selection — used by the
  // multi-pick cases (Recrutar Veteranos, Chamado às Armas); single-pick cases resolve
  // immediately on tap instead (see the cardPicker modal below) and never call this.
  const toggleCardPickerSelection = (option: CardData) => {
    setCardPicker(prev => {
      if (!prev) return prev;
      const already = prev.selected.some(c => c.id === option.id);
      if (already) return { ...prev, selected: prev.selected.filter(c => c.id !== option.id) };
      if (prev.maxPicks === 1) return { ...prev, selected: [option] };
      if (prev.selected.length >= prev.maxPicks) return prev; // already at the cap
      return { ...prev, selected: [...prev.selected, option] };
    });
  };

  // Activating the ability of a card on the board (the General's, a unit's): with no choices it is sent at once (the engine opens
  // any pick prompt itself); with choices, the card floats and glows first, then the player is asked for each target in turn
  // (see pendingAbility) and the whole thing is sent together. Nothing is spent until the engine accepts it.
  const abilityOf = (slot: number) => (playerSlots[slot] ? abilityOn(playerSlots[slot]!.name, 'ability') : undefined);
  // The first step (from `from`) that needs a choice: an optional target with no candidate is skipped.
  const nextAbilityStep = (ab: NonNullable<ReturnType<typeof abilityOn>>, from: number): number => {
    const specs = targetSpecsOf(ab.do);
    const cands = abilityStepCandidates(ab);
    for (let i = from; i < specs.length; i++) if (!(specs[i].optional && cands[i].length === 0)) return i;
    return -1;
  };
  const activateAbility = (slot: number) => {
    const ab = abilityOf(slot);
    const card = playerSlots[slot];
    if (!ab || !card) return;
    if (targetSpecsOf(ab.do).length === 0) { playerAct({ type: 'ability', slot }); return; }
    if (!abilityHasTargets(ab)) { showToast(`${card.name}: nenhum alvo disponível.`); return; }
    const step = nextAbilityStep(ab, 0);
    const start = () => { setViewState('field'); setPendingAbility({ slot, step, picks: [] }); };
    // the card floats and glows first; the targets open once the glow is over, and it stays up until the effect is resolved
    startTriggerFx('player', slot, card, triggerKeyOf(card.name) ?? 'comando', holdForSeat(0));
    whenGlowDone(start);
  };
  // The player tapped a board slot while an ability waits for its next choice.
  // Which side of the board the pending ability's current choice is on.
  const abilityStepSide = (): 'own' | 'enemy' | null => {
    if (!pendingAbility) return null;
    const name = playerSlots[pendingAbility.slot]?.name ?? trigFx?.card.name ?? '';
    const ab = abilityOn(name, 'ability');
    return ab ? targetSpecsOf(ab.do)[pendingAbility.step]?.side ?? null : null;
  };
  const resolveAbilityTarget = (slotIndex: number) => {
    const pend = pendingAbility;
    const ab = pend ? abilityOf(pend.slot) ?? (playerSlots[pend.slot] ? undefined : abilityOn(trigFx?.card.name ?? '', 'ability')) : undefined;
    if (!pend || !ab) return;
    const specs = targetSpecsOf(ab.do);
    const spec = specs[pend.step];
    const allowed = abilityStepCandidates(ab)[pend.step];
    if (!allowed.includes(slotIndex)) { showToast(spec.prompt ?? 'Escolha um alvo válido.'); return; }
    const picks = [...pend.picks]; picks[pend.step] = slotIndex;
    const next = nextAbilityStep(ab, pend.step + 1);
    if (next >= 0) { setPendingAbility({ slot: pend.slot, step: next, picks }); return; }
    if (!playerAct({ type: 'ability', slot: pend.slot, target: picks[0], target2: picks[1] })) return;
    setPendingAbility(null);
    setViewState('hand');
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
  const abilityReadyPrompts: { key: string; x: number; y: number; w: number; h: number; onClick: () => void; kind: 'heal' | 'damage' | 'utility'; card: CardData | null }[] = [];
  const pushAbilityPrompt = (key: string, slotId: string, onClick: () => void, kind: 'heal' | 'damage' | 'utility' = 'utility') => {
    const el = document.getElementById(slotId);
    const slotCard = playerSlots[Number(slotId.split('-')[1])] ?? null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    abilityReadyPrompts.push({ key, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, onClick, kind, card: slotCard });
  };
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
    const kind = getPlayerCreatureAbilityKind(i);
    if (!kind) return;
    pushAbilityPrompt(`ability-${i}`, `player-${i}`, () => activateAbility(i), kind === 'utility' ? 'utility' : kind);
  });
  if (playerGeneralAbilityAvailable) {
    // One tap: straight into picking the target (Cancelar backs out) — no "ativar?" step in between.
    const first = playerGeneralAbility!.do[0]?.kind;
    pushAbilityPrompt('ability-general', 'player-12', () => activateAbility(12), first === 'damage' ? 'damage' : 'heal');
  }

  // What the player is being asked to target right now, if anything (see TargetingHud): the source card, what the
  // effect does, the sentence to show, and the board slots it can legally land on.
  type TargetingMode = { source: CardData; kind: TargetKind; title: string; hint: string; amount?: number; valid: { side: 'player' | 'npc'; index: number }[] };
  const mine = (pred: (c: CardData, i: number) => boolean) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => playerSlots[i] && pred(playerSlots[i]!, i)).map(i => ({ side: 'player' as const, index: i }));
  const foes = (pred: (c: CardData, i: number) => boolean) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => npcSlots[i] && pred(npcSlots[i]!, i)).map(i => ({ side: 'npc' as const, index: i }));
  // The legal targets of a Tática that needs one (used both when it is armed and while it is only selected in the hand): read from
  // the card's own target spec, whatever card it is.
  const effectTargetKind = (verb: { kind: string } | undefined): TargetKind =>
    verb?.kind === 'heal' ? 'heal' : verb?.kind === 'damage' ? 'damage' : verb?.kind === 'displace' ? 'move' : 'buff';
  const specSlots = (spec: ReturnType<typeof targetSpecOf>) => {
    if (!spec) return [];
    const side = spec.side === 'own' ? 'player' as const : 'npc' as const;
    // a row effect can be aimed at any occupied slot of the side (the whole row is hit); the others follow the spec's filters
    // A card whose effect is playing floats off its slot and the slot is held empty on screen (trigFx, equipFx): for the
    // rules it is still there, so it stays a valid target — dropping a Tática on it works while the animation runs.
    const solid = (list: (CardData | null)[], who: 'player' | 'npc') => list.map((c, i) =>
      c ?? (trigFx && trigFx.side === who && trigFx.slot === i ? trigFx.card : equipFx && equipFx.side === who && equipFx.slot === i ? equipFx.unitAfter : null));
    const ownSolid = solid(playerSlots, 'player'), foeSolid = solid(npcSlots, 'npc');
    const slots = spec.area === 'row'
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => (spec.side === 'own' ? ownSolid : foeSolid)[i])
      : specCandidatesOn(spec, ownSolid, foeSolid, [...movedSlots]);
    return slots.map(index => ({ side, index }));
  };
  const tacticTargeting = (card: CardData): TargetingMode => {
    const spec = targetSpecOf(card.name);
    const verb = verbsOn(card.name, 'play').find(v => 'target' in v && v.target);
    const amount = verb && (verb.kind === 'heal' || verb.kind === 'damage') ? verb.amount : undefined;
    return { source: card, kind: effectTargetKind(verb), title: card.name, hint: spec?.prompt ?? 'Escolha um alvo no campo.', amount, valid: specSlots(spec) };
  };
  // While an effect's card floats, its slot is held empty on screen: the card that is asking for a target is still that one.
  const sourceAt = (slot: number): CardData | null => playerSlots[slot] ?? (trigFx && trigFx.side === 'player' && trigFx.slot === slot ? trigFx.card : null);
  const targetingMode: TargetingMode | null = (() => {
    if (pendingAbility && sourceAt(pendingAbility.slot)) {
      const source = sourceAt(pendingAbility.slot)!;
      const ab = abilityOn(source.name, 'ability');
      const specs = ab ? targetSpecsOf(ab.do) : [];
      const spec = specs[pendingAbility.step];
      const verb = ab?.do.filter(v => 'target' in v && v.target)[pendingAbility.step];
      const amount = verb?.kind === 'heal' ? verb.amount + (verb.withAuras ? auraTotal('healBonus', 12, playerSlots) : 0) : verb?.kind === 'damage' ? verb.amount : undefined;
      return {
        source, kind: effectTargetKind(verb), title: source.name, amount,
        hint: spec ? (spec.prompt ?? 'Escolha um alvo.') : '',
        valid: ab && spec ? abilityStepCandidates(ab)[pendingAbility.step].map(index => ({ side: spec.side === 'own' ? 'player' as const : 'npc' as const, index })) : [],
      };
    }
    if (pendingTacticAction) return tacticTargeting(pendingTacticAction.card);
    return null;
  })();
  const cancelTargeting = () => { playUiClickSfx(); handleBackgroundClick(); };

  // Plays a hand card that needs a board target straight onto the tapped slot (one tap: select, then tap the target).
  const playHandCardOnTarget = (card: CardData, slotIndex: number) => {
    if (!playerAct({ type: 'play', cardId: card.id, target: slotIndex })) return;
    setSelectedCardIndex(null);
    setViewState('hand');
  };

  // ── Press, hold and drag a hand card ──────────────────────────────────────────────────────────────────────────
  const HELD_SCALE = 0.55;
  const HELD_GAP = 92;       // the held card hangs below the finger (the finger stays above it, clear of the card), this far from the fingertip
  const heldTop = (y: number) => Math.min(y + HELD_GAP, windowSize.height - 320 * HELD_SCALE - 6);   // top edge of the held card on screen
  const slotUnder = (x: number, y: number): { side: 'player' | 'npc'; index: number; el: HTMLElement } | null => {
    for (const e of document.elementsFromPoint(x, y)) {
      for (let n: HTMLElement | null = e as HTMLElement; n && n !== document.body; n = n.parentElement) {
        const m = /^(player|npc)-(\d+)$/.exec(n.id);
        if (m) return { side: m[1] as 'player' | 'npc', index: Number(m[2]), el: n };
      }
    }
    return null;
  };
  const clearDragOver = () => document.querySelectorAll('[data-drag-over]').forEach(el => el.removeAttribute('data-drag-over'));
  // Why this card cannot be dragged right now (null = it can); 'wait' = say nothing.
  const dragBlockReason = (card: CardData): string | null => {
    if (gameOverWinner || ambushPrompt || targetingMode || viewState === 'field') return 'wait';
    // 'busy': a card is in flight, the camera is settling or a phase banner is up — nothing is picked up, and it says so
    // (the hand label stays quiet; the toast comes when a drag is tried). A finished equip animation does not hold the hand:
    // once its card has landed, what is left is glow.
    if (preZoomSlot || flyingCard || cameraSettling || repositionFlight || (equipFx && equipFx.stage !== 'land') || phaseTransitionLock) return 'busy';
    if (!canPlayInPhase(card, turnPhase)) {
      return turnPhase === 'movimentacao' ? 'Na Movimentação só dá pra jogar Táticas!' : 'Jogar cartas só nas fases de Preparação e Movimentação!';
    }
    if (getCardDropKind(card) === 'blocked') return card.cardType === 'Emboscada' ? 'Emboscadas ativam sozinhas quando você é atacado — mantenha na mão.' : 'Esta carta não pode ser jogada agora.';
    return null;
  };
  const tapHandCard = (index: number) => {
    const card = hand[index];
    if (!card) return;
    if (inspectId === card.id) { setInspectId(null); return; }
    playSelectSfx();
    inspectOpenedAtRef.current = performance.now();
    setInspectId(card.id);
  };
  const beginPress = (e: React.PointerEvent, index: number) => {
    if (dragRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const card = hand[index];
    if (!card) return;
    dragRef.current = { index, id: card.id, startX: e.clientX, startY: e.clientY, dragging: false, blocked: false };
    const move = (ev: PointerEvent) => dragApiRef.current?.move(ev.clientX, ev.clientY);
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      dragApiRef.current?.up(ev.clientX, ev.clientY, ev.type === 'pointercancel');
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };
  // Where the held card was let go: the play it means (a slot for a unit, a target for an aimed Tática, the board for the rest).
  const dropHeldCard = (index: number, x: number, y: number) => {
    const card = hand[index];
    const cancel = () => setSelectedCardIndex(null);
    if (!card) { cancel(); return; }
    const kind = getCardDropKind(card);
    const hit = slotUnder(x, y);
    if (kind === 'place') {
      if (!hit || hit.side !== 'player') { cancel(); return; }
      if (!canPlaceInSlot(card.cardType, hit.index) || playerSlots[hit.index]) { showToast('Solte a carta numa casa acesa do seu campo.'); cancel(); return; }
      const dry = applyAction(engineRef.current!, 0, { type: 'play', cardId: card.id, slot: hit.index });
      if (dry.ok === false) { showToast(dry.error); cancel(); return; }
      noteDragPlay();
      dropFromRef.current = { x, y: heldTop(y) + 160 * HELD_SCALE, w: 224 * HELD_SCALE, h: 320 * HELD_SCALE };
      handleSlotClick(hit.index, hit.el);   // the play clears the selection (and with it the held card) when the flight starts
      return;
    }
    if (kind === 'ownTarget' || kind === 'enemyTarget') {
      const spec = targetSpecOf(card.name);
      const ok = !!hit && specSlots(spec).some(v => v.side === hit.side && v.index === hit.index);
      if (!ok || !hit) { showToast(spec?.prompt ?? 'Solte a carta num alvo válido.'); cancel(); return; }
      setSelectedCardIndex(null);
      if (playerAct({ type: 'play', cardId: card.id, target: hit.index })) { setViewState('hand'); noteDragPlay(); }
      return;
    }
    const z = held?.zone;
    if (kind === 'immediate' && z && x >= z.left && x <= z.left + z.width && y >= z.top && y <= z.top + z.height) { noteDragPlay(); handlePlayCardButtonClick(); return; }
    cancel();
  };
  // Called once per frame while a card is held: moves the floating card, lights the slot under the finger, aims the guide.
  const updateHeld = () => {
    const { x, y } = dragPointRef.current;
    const top = heldTop(y);
    if (heldElRef.current) heldElRef.current.style.transform = `translate3d(${x - 112}px, ${top + 160 * HELD_SCALE - 160}px, 0)`;
    const hit = slotUnder(x, y);
    const idx = dragRef.current?.index;
    const card = idx !== undefined ? hand[idx] : undefined;
    const drop = hit && card ? dropOk(card, hit) : null;
    document.querySelectorAll('[data-drag-over]').forEach(el => { if (el !== (drop ? hit?.el : null)) el.removeAttribute('data-drag-over'); });
    if (drop && hit) hit.el.setAttribute('data-drag-over', drop.tone);
    const zone = dragZoneRef.current;
    const inZone = !!zone && x >= zone.left && x <= zone.left + zone.width && y >= zone.top && y <= zone.top + zone.height;
    zoneElRef.current?.classList.toggle('over', inZone);
    if (zone) guideInfoRef.current = { ex: zone.left + zone.width / 2, ey: zone.top + zone.height / 2, color: '#ffd36a', kind: 'blue' };
    else if (drop && hit) { const r = hit.el.getBoundingClientRect(); guideInfoRef.current = { ex: r.left + r.width / 2, ey: r.top + r.height / 2, color: drop.color, kind: hit.side === 'npc' ? 'red' : 'blue' }; }
    else guideInfoRef.current = null;
  };
  // Whether the card held would be accepted by the slot the finger is over (and what colour it lights): a unit in an empty slot of
  // its own; an aimed Tática on a valid target (red for damage, green for healing, gold for the rest).
  const dropOk = (card: CardData, hit: { side: 'player' | 'npc'; index: number }): { tone: 'gold' | 'red' | 'green'; color: string } | null => {
    const kind = getCardDropKind(card);
    if (kind === 'place') return hit.side === 'player' && canPlaceInSlot(card.cardType, hit.index) && !playerSlots[hit.index] ? { tone: 'gold', color: '#ffd36a' } : null;
    if (kind === 'ownTarget' || kind === 'enemyTarget') {
      const spec = targetSpecOf(card.name);
      if (!spec || !specSlots(spec).some(v => v.side === hit.side && v.index === hit.index)) return null;
      const verb = verbsOn(card.name, 'play').find(v => 'target' in v && v.target)?.kind;
      return verb === 'damage' ? { tone: 'red', color: '#ff6a5a' } : verb === 'heal' ? { tone: 'green', color: '#66f0a0' } : { tone: 'gold', color: '#ffd36a' };
    }
    return null;
  };
  dragApiRef.current = {
    move: (x, y) => {
      const d = dragRef.current;
      if (!d || d.blocked) return;
      if (!d.dragging) {
        if (Math.hypot(x - d.startX, y - d.startY) < 10) return;
        const card = hand[d.index];
        const why = card ? dragBlockReason(card) : 'wait';
        if (why) { d.blocked = true; if (why !== 'wait') showToast(why === 'busy' ? 'Só um instante: a animação ainda está rodando.' : why); return; }
        d.dragging = true;
        setInspectId(null);
        setSelectedCardIndex(d.index);
        setSelectedAttackerIndex(null);
        dragPointRef.current = { x, y };
        // A Tática used at once has no slot: the whole of your own field lights up as the place to let go of it.
        let zone: { left: number; top: number; width: number; height: number; label: string } | null = null;
        if (card && getCardDropKind(card) === 'immediate') {
          const rects = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => document.getElementById(`player-${i}`)?.getBoundingClientRect()).filter((r): r is DOMRect => !!r);
          if (rects.length) {
            const l = Math.min(...rects.map(r => r.left)) - 8, t = Math.min(...rects.map(r => r.top)) - 8;
            zone = { left: l, top: t, width: Math.max(...rects.map(r => r.right)) + 8 - l, height: Math.max(...rects.map(r => r.bottom)) + 8 - t, label: IMMEDIATE_ZONE_LABEL[verbsOn(card.name, 'play')[0]?.kind ?? ''] ?? 'ATIVAR' };
          }
        }
        dragZoneRef.current = zone;
        setHeld({ id: d.id, zone });
        playCardLiftSfx();
        return;
      }
      dragPointRef.current = { x, y };
      if (dragFrameRef.current === null) dragFrameRef.current = requestAnimationFrame(() => { dragFrameRef.current = null; updateHeld(); });
    },
    up: (x, y, cancelled) => {
      const d = dragRef.current;
      dragRef.current = null;
      clearDragOver();
      guideInfoRef.current = null; dragZoneRef.current = null;
      if (dragFrameRef.current !== null) { cancelAnimationFrame(dragFrameRef.current); dragFrameRef.current = null; }
      if (!d || d.blocked) return;
      if (!d.dragging) { if (!cancelled) tapHandCard(d.index); return; }
      if (cancelled) { setSelectedCardIndex(null); return; }
      dropHeldCard(d.index, x, y);
    },
  };

  const handleSlotClick = (slotIndex: number, slotEl?: HTMLElement) => {
    if (gameOverWinner || isCardInFlightTransition) return;
    if (phaseTransitionLock) return; // see announcePhase — a phase banner is still on screen

    if (pendingTacticAction) { resolveOwnTacticTarget(slotIndex); return; }
    if (pendingAbility && abilityStepSide() === 'own') { resolveAbilityTarget(slotIndex); return; }

    // Batedor's free post-combat move (see batedorFree) opens this same reposition flow even during Combate,
    // but only for that one exact unit.
    const isBatedorFreeMove = batedorFreeMove !== null;
    if ((turnPhase === 'movimentacao' || isBatedorFreeMove) && selectedCardIndex === null) {
      // Only Vanguarda/Retaguarda units reposition — General/Relíquia/Terreno (10-12) are fixed.
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
        // Reformar Linhas' bonus moves let an already-moved unit be picked back up anyway.
        if (!isBatedorFreeMove && movedSlots.has(slotIndex) && bonusRepositions <= 0) {
          showToast("Essa unidade já se reposicionou nesse turno.");
          return;
        }
        setSelectedMoverIndex(slotIndex);
        return;
      }
      if (selectedMoverIndex === slotIndex) { setSelectedMoverIndex(null); return; }
      if (!canReposition(playerSlots[selectedMoverIndex], selectedMoverIndex, slotIndex)) {
        // Clicking a different one of your own (unmoved) units re-selects it instead of just failing.
        if (!isBatedorFreeMove && playerSlots[slotIndex] && !movedSlots.has(slotIndex)) { setSelectedMoverIndex(slotIndex); return; }
        showToast("Só dá pra reposicionar para um slot adjacente!");
        return;
      }
      const mover = playerSlots[selectedMoverIndex];
      const occupant = playerSlots[slotIndex];
      const originIndex = selectedMoverIndex;
      const destIndex = slotIndex;
      // Ask the rules first (nothing changes yet) so a refused move explains itself before anything slides.
      const dry = applyAction(engineRef.current!, 0, { type: 'move', from: originIndex, to: destIndex });
      if (dry.ok === false) { showToast(dry.error); return; }
      setSelectedMoverIndex(null);

      // Slide both slots' real on-screen rects into a repositionFlight (see its own comment) instead of
      // swapping right away — the engine commits the move once that slide lands.
      const originRect = document.getElementById(`player-${originIndex}`)?.getBoundingClientRect();
      const destRect = document.getElementById(`player-${destIndex}`)?.getBoundingClientRect();
      if (!mover || !originRect || !destRect) {
        // Defensive fallback (should never happen — both slots are on-screen whenever they're clickable).
        dispatchAction(0, { type: 'move', from: originIndex, to: destIndex });
        return;
      }
      playCardLiftSfx();
      setRepositionFlight({
        side: 'player',
        originIndex, destIndex, moverCard: mover, swappedCard: occupant ?? null,
        mover: {
          fromX: originRect.left + originRect.width / 2, fromY: originRect.top + originRect.height / 2,
          toX: destRect.left + destRect.width / 2, toY: destRect.top + destRect.height / 2,
          w: originRect.width, h: originRect.height,
        },
        swapped: occupant ? {
          fromX: destRect.left + destRect.width / 2, fromY: destRect.top + destRect.height / 2,
          toX: originRect.left + originRect.width / 2, toY: originRect.top + originRect.height / 2,
          w: destRect.width, h: destRect.height,
        } : null,
      });
      return;
    }
    if (selectedCardIndex !== null && !playerSlots[slotIndex]) {
      const cardToPlay = hand[selectedCardIndex];

      // Only a plain creature/Relíquia/Terreno actually gets placed INTO a slot — a targetable Tática has its own
      // occupied-slot target-tap branch further down, and an immediate/blocked card has no board destination at
      // all. Guide the player back to whichever gesture actually plays this specific card.
      const dropKind = getCardDropKind(cardToPlay);
      if (dropKind !== 'place') {
        if (dropKind === 'ownTarget' || dropKind === 'enemyTarget') {
          showToast(targetSpecOf(cardToPlay.name)?.prompt ?? "Escolha uma unidade no campo.");
        } else {
          showToast("Toque na carta novamente para jogá-la.");
        }
        return;
      }

      // Ask the rules first (nothing changes yet): gold, slot rules and phase all explain themselves.
      const dry = applyAction(engineRef.current!, 0, { type: 'play', cardId: cardToPlay.id, slot: slotIndex });
      if (dry.ok === false) { showToast(dry.error); return; }

      const fromEl = handCardRefs.current[cardToPlay.id];
      const fromRect = fromEl?.getBoundingClientRect();

      if (fromRect && slotEl) {
        // The engine takes the card and the gold right away; the board and the hand on screen catch up as the
        // card flies in (see the flyingCard overlay), so only the gold is shown now.
        dispatchAction(0, { type: 'play', cardId: cardToPlay.id, slot: slotIndex }, { skip: { hand: true, boards: true } });
        // Let the camera zoom/pan toward the slot and settle first — only once it has stopped moving do we
        // measure the slot's real on-screen position and start the card's flight, so the landing spot doesn't
        // drift out from under it mid-flight. The card stays selected and visible in its floating preview spot
        // for this whole hold — we don't touch the hand yet, so it never disappears.
        setPreZoomSlot({ slotIndex });
        setTimeout(() => {
          // Re-measure the card's own rect too, right before handing off to the flying overlay (a dragged card starts flying from where it was dropped).
          const drop = dropFromRef.current;
          dropFromRef.current = null;
          const hr = fromEl.getBoundingClientRect();
          const latestFromRect = drop ? { left: drop.x - drop.w / 2, top: drop.y - drop.h / 2, width: drop.w, height: drop.h } : hr;
          const toRect = slotEl.getBoundingClientRect();
          setPreZoomSlot(null);
          playCardLiftSfx();
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
          // Only now remove the card from the hand and clear the selection — the flying overlay takes over in
          // this exact same update, so there's no frame where the card isn't rendered anywhere.
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
        dispatchAction(0, { type: 'play', cardId: cardToPlay.id, slot: slotIndex });
        setSelectedCardIndex(null);
        setViewState('hand');
      }
    } else if (selectedCardIndex === null && playerSlots[slotIndex] && turnPhase === 'preparacao') {
      // Nothing to do here in Preparação beyond the preview its own onInfoClick already opened — reposition
      // happens in Movimentação, attacking in Combate.
      return;
    } else if (selectedCardIndex === null && playerSlots[slotIndex]) {
      // Only turnPhase === 'combate' reaches here. Arqueiro da Ordem gets 2 attacks this turn; every other unit
      // gets 1 (see getMaxAttacksPerTurn/playerAttackCounts).
      const usedAttacks = playerAttackCounts[slotIndex] ?? 0;
      if (usedAttacks >= getMaxAttacksPerTurn(playerSlots[slotIndex]!)) {
        showToast("Essa unidade já atacou neste turno.");
        return;
      }
      // Infantaria posted in the Retaguarda has zero valid attack targets, always.
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
      // An occupied own slot is exactly the target an 'ownTarget' Tática (an equip or a buff) needs tapped to play.
      const cardToPlay = hand[selectedCardIndex];
      if (getCardDropKind(cardToPlay) === 'ownTarget') {
        playHandCardOnTarget(cardToPlay, slotIndex);
        return;
      }
      showToast("Esse slot já está ocupado!");
    }
  };

  const handleNpcSlotClick = async (slotIndex: number) => {
    if (gameOverWinner) return;
    if (phaseTransitionLock) return; // see announcePhase — a phase banner is still on screen
    if (pendingTacticAction) { resolveEnemyTacticTarget(slotIndex); return; }
    if (pendingAbility && abilityStepSide() === 'enemy') { resolveAbilityTarget(slotIndex); return; }

    // A hand card is selected (not yet committed) and the player tapped the opponent's board — the only card kind
    // that ever wants that is an 'enemyTarget' Tática, and only on an occupied enemy slot.
    if (selectedCardIndex !== null) {
      const cardToPlay = hand[selectedCardIndex];
      if (getCardDropKind(cardToPlay) === 'enemyTarget' && npcSlots[slotIndex]) {
        playHandCardOnTarget(cardToPlay, slotIndex);
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
      const from = selectedAttackerIndex;
      // Ask the rules first (nothing changes yet) — then play out the lunge and let the engine resolve the hit.
      const dry = applyAction(engineRef.current!, 0, { type: 'attack', from, to: slotIndex });
      if (dry.ok === false) { showToast(dry.error); return; }
      setIsAnimating(true);
      setAttackAnim({ attackerIndex: from, targetIndex: slotIndex, isPlayerAttacking: true });
      await sleep(ATTACK_MS);
      playAttackSfx();            // before the hit-stop: the clip's loud hit is 42 ms in, the hit-stop is 40 ms
      await sleep(HIT_STOP_MS);   // the lunge lands and everything holds for a beat before the hit
      const soaked = blowIsSoaked(dry.events, 1, slotIndex);
      setSoakedBlow(soaked);
      setIsImpacting(true);
      if (!soaked) triggerPunch(1, slotIndex);
      await sleep(IMPACT_MS);
      setIsImpacting(false);
      setSoakedBlow(false);
      const r = dispatchAction(0, { type: 'attack', from, to: slotIndex });
      if (r.ok === false) showToast(r.error);
      else {
        // Online, the defender's hand decides whether an Emboscada answers: the result is the server's.
        if (r.wait) await r.wait;
        await settleAmbush();
      }
      setSelectedAttackerIndex(null);
      setAttackAnim(null);
      setIsAnimating(false);
    }
  };

  const handleBackgroundClick = () => {
    if (isCardInFlightTransition) return; // don't cancel a card mid hand-off to the board
    // Nothing is spent until a target is actually chosen, so backing out of any target-picking mode is free.
    if (pendingTacticAction) {
      setPendingTacticAction(null);
      setViewState('hand');
      return;
    }
    if (pendingAbility) {
      setPendingAbility(null);
      setViewState('hand');
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

  // A tapped hand card grows around its own centre; at either end of a wide hand that would push it past the
  // screen edge, so slide it back inside (in the tray's own scaled units).
  const getTappedCardShift = (index: number) => {
    if (!isMobile) return 0;
    const cardX = -handTotalWidth / 2 + HAND_CARD_WIDTH / 2 + index * handStep;
    const centre = windowSize.width / 2 + cardX * handScale;
    const half = (HAND_CARD_WIDTH * HAND_SELECT_SCALE * handScale) / 2;
    const margin = 6;
    const shift = Math.max(0, margin - (centre - half)) - Math.max(0, centre + half - (windowSize.width - margin));
    return shift / handScale;
  };

  const getSelectedCardX = (index: number) => {
    const startX = -handTotalWidth / 2 + HAND_CARD_WIDTH / 2;
    const cardX = startX + index * handStep;
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
  // A targetable Tática that is only selected in the hand already marks where it could land (no HUD yet: the card itself is up).
  const previewTargeting = !targetingMode && previewedCard && targetSpecOf(previewedCard.name) ? tacticTargeting(previewedCard) : null;
  const targetLayer = targetingMode ?? previewTargeting;
  const getPlayerSlotHint = (slotIndex: number): SlotHint | undefined => {
    if (!previewedCard || playerSlots[slotIndex]) return undefined;
    // A targetable Tática (ownTarget/enemyTarget — see getCardDropKind) already has
    // real guidance: the highlighted occupied slot it can actually hit (see
    // isTacticDragTarget/isTacticTargetSlot). Marking every EMPTY slot invalid here
    // on top of that used to bury the one useful highlight under a board full of red
    // X's — confusing enough that it read as "nothing to do here, cancel and retry"
    // instead of "tap the highlighted target". No hint at all is the honest answer
    // for a slot this card was never going to touch anyway.
    const kind = getCardDropKind(previewedCard);
    if (kind !== 'place') return undefined;   // only a card that goes into a slot lights (or crosses) the empty ones
    return getSlotHint(previewedCard.cardType, slotIndex);
  };

  // Highlights EVERY occupied slot a selected targetable Tática (equip/buff/damage)
  // could legally land on — the 'place' kind (plain creatures/Relíquia/Terreno)
  // already gets its highlight for free from the hint system just above, since it
  // only ever targets an EMPTY slot; this is for the occupied-slot case that
  // system doesn't cover (see getCardDropKind/TARGETABLE_TACTICS).
  const isTacticTargetSlot = (side: 'own' | 'npc', slotIndex: number): boolean => {
    if (!previewedCard) return false;
    const kind = getCardDropKind(previewedCard);
    if (kind !== (side === 'own' ? 'ownTarget' : 'enemyTarget')) return false;
    return specSlots(targetSpecOf(previewedCard.name)).some(v => v.side === (side === 'own' ? 'player' : 'npc') && v.index === slotIndex);
  };
  // The short word on every valid target of the Tática being dragged ("DANO 3", "CURA 1", "+2 ATK"…), so the board says what the
  // card does there, the way the unit slots say ATACA / RESERVA.
  const tacticTagFor = (side: 'own' | 'npc', slotIndex: number): { text: string; color: string } | undefined => {
    if (!previewedCard || !isTacticTargetSlot(side, slotIndex)) return undefined;
    const v = verbsOn(previewedCard.name, 'play').find(x => 'target' in x && x.target);
    if (!v) return undefined;
    switch (v.kind) {
      case 'damage': return { text: v.target?.area === 'row' ? `${v.amount} NA FILA` : `DANO ${v.amount}`, color: '#ff9a8a' };
      case 'heal': return { text: `CURA ${v.amount}`, color: '#8affc0' };
      case 'buff': return { text: v.atk ? `+${v.atk} ATK` : `+${v.hp} HP`, color: '#ffd36a' };
      case 'equip': return { text: v.atk ? `+${v.atk} ATK` : `+${v.hp} HP`, color: '#ffd36a' };
      case 'guard_adjacent': return { text: 'PROTEGE', color: '#ffd36a' };
      case 'retreat': return { text: 'RECUA', color: '#9ad0ff' };
      case 'displace': return { text: 'DESLOCA', color: '#9ad0ff' };
      default: return { text: 'ALVO', color: '#ffd36a' };
    }
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
  // The board gives a short tremor when a hit lands (a General being hit shakes harder). Kept to a few pixels and a
  // third of a second — the camera must never read as moving. Pixel sizes are divided by the board's own scale so
  // they mean real screen pixels.
  const shakePx = (attackAnim && isImpacting ? (attackAnim.targetIndex === 12 ? 6 : 3) : 0) / gridBaseAnim.scale;
  const gridZoomDelta = shakePx > 0
    ? { x: [0, -shakePx, shakePx, -shakePx * 0.7, shakePx * 0.5, 0], y: [0, shakePx * 0.6, -shakePx * 0.5, shakePx * 0.3, -shakePx * 0.2, 0], scale: 1 }
    : { x: 0, y: 0, scale: 1 };

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
      // overflow:hidden still lets the browser scroll this box (focus, scrollIntoView): the board and everything fixed inside it
      // would slide sideways, so it is always put back.
      onScroll={(e) => { const el = e.currentTarget; if (el.scrollLeft !== 0) el.scrollLeft = 0; if (el.scrollTop !== 0) el.scrollTop = 0; }}
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
        transition={shakePx > 0 ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.12 }}
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
              onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10}
              isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 10}
              isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 10}
              attackDirection="down"
              isValidAttackTarget={validAttackTargets.has(10)}
              isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(10) && !!npcSlots[10]}
              isTacticDragTarget={isTacticTargetSlot('npc', 10)}
                tacticTag={tacticTagFor('npc', 10)}
            />
            <div className="relative">
              <CardSlot
                slotId="npc-12"
                card={npcSlots[12]}
                onClick={() => handleNpcSlotClick(12)}
                onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 12}
                isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 12}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(12)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(12)}
                isTacticDragTarget={isTacticTargetSlot('npc', 12)}
                tacticTag={tacticTagFor('npc', 12)}
              />
            </div>
            <CardSlot
              slotId="npc-11"
              card={npcSlots[11]}
              onClick={() => handleNpcSlotClick(11)}
              onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
              isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11}
              isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === 11}
              isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === 11}
              attackDirection="down"
              isValidAttackTarget={validAttackTargets.has(11)}
              isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(11) && !!npcSlots[11]}
              isTacticDragTarget={isTacticTargetSlot('npc', 11)}
                tacticTag={tacticTagFor('npc', 11)}
            />
            <div ref={npcDeckRef} className="w-28 h-36 md:w-36 md:h-48 relative pointer-events-none">
              <div className="absolute inset-0" style={{ opacity: deckCounts[1] === 0 ? 0.15 : 1 }}>
                <CardBack offset={6} brightness={0.3} />
                <CardBack offset={3} brightness={0.55} />
                <CardBack shadow />
              </div>
              <div className="absolute inset-x-0 -bottom-1 flex justify-center pointer-events-none z-10">
                <span className="px-2 rounded-md text-[22px] leading-tight font-extrabold" style={{ fontFamily: "'Cinzel', serif", color: deckCounts[1] === 0 ? '#ff9a8a' : '#ffe9b0', background: 'rgba(14,10,6,0.82)', border: '1px solid rgba(232,220,192,0.5)', textShadow: '0 1px 2px #000' }}>{deckCounts[1]}</span>
              </div>
            </div>
          </div>
          {/* Retaguarda NPC (Backline) */}
          <div className="text-center text-[8px] md:text-[10px] tracking-widest text-zinc-500 uppercase -mb-3">Retaguarda</div>
          <div className="flex justify-center gap-3 md:gap-6">
            {[5, 6, 7, 8, 9].map((i) => (
              <CardSlot
                key={i}
                slotId={`npc-${i}`}
                card={repositionFlight?.side === 'npc' && (i === repositionFlight.originIndex || i === repositionFlight.destIndex) ? null : npcSlots[i]}
                onClick={() => handleNpcSlotClick(i)}
                onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(i)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(i) && !!npcSlots[i]}
                isTacticDragTarget={isTacticTargetSlot('npc', i)}
                tacticTag={tacticTagFor('npc', i)}
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
                card={repositionFlight?.side === 'npc' && (i === repositionFlight.originIndex || i === repositionFlight.destIndex) ? null : npcSlots[i]}
                onClick={() => handleNpcSlotClick(i)}
                onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
                isAttacking={attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === true && attackAnim?.targetIndex === i}
                attackDirection="down"
                isValidAttackTarget={validAttackTargets.has(i)}
                isInvalidAttackTarget={selectedAttackerIndex !== null && !validAttackTargets.has(i) && !!npcSlots[i]}
                isTacticDragTarget={isTacticTargetSlot('npc', i)}
                tacticTag={tacticTagFor('npc', i)}
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
                card={repositionFlight?.side === 'player' && (i === repositionFlight.originIndex || i === repositionFlight.destIndex) ? null : playerSlots[i]}
                onClick={(el) => handleSlotClick(i, el)}
                isSelected={selectedAttackerIndex === i}
                onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                hint={getPlayerSlotHint(i)}
                rowRoleHint={getPlayerSlotHint(i) === 'valid' ? getRowRoleHint(previewedCard?.cardType, i) : undefined}
                isMoverSelected={selectedMoverIndex === i}
                isValidMoveTarget={validMoveTargets.has(i)}
                hasMoved={movedSlots.has(i)}
                isTacticDragTarget={isTacticTargetSlot('own', i)}
                tacticTag={tacticTagFor('own', i)}
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
                card={repositionFlight?.side === 'player' && (i === repositionFlight.originIndex || i === repositionFlight.destIndex) ? null : playerSlots[i]}
                onClick={(el) => handleSlotClick(i, el)}
                isSelected={selectedAttackerIndex === i}
                onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === i}
                isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === i}
                attackDirection="up"
                hint={getPlayerSlotHint(i)}
                rowRoleHint={getPlayerSlotHint(i) === 'valid' ? getRowRoleHint(previewedCard?.cardType, i) : undefined}
                isMoverSelected={selectedMoverIndex === i}
                isValidMoveTarget={validMoveTargets.has(i)}
                hasMoved={movedSlots.has(i)}
                isTacticDragTarget={isTacticTargetSlot('own', i)}
                tacticTag={tacticTagFor('own', i)}
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
              <GraveyardPile cards={playerGraveyard} onClick={() => setViewingGraveyard('player')} tut="graveyard" />
            </div>
            <CardSlot
              slotId="player-10"
              card={playerSlots[10]}
              onClick={(el) => handleSlotClick(10, el)}
              isSelected={selectedAttackerIndex === 10}
              onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
              isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 10}
              isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 10}
              isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 10}
              attackDirection="up"
              hint={getPlayerSlotHint(10)}
              isTacticDragTarget={isTacticTargetSlot('own', 10)}
                tacticTag={tacticTagFor('own', 10)}
            />
            <div className="relative">
              <CardSlot
                slotId="player-12"
                card={playerSlots[12]}
                onClick={(el) => handleSlotClick(12, el)}
                isSelected={selectedAttackerIndex === 12}
                onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
                isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12}
                isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12}
                isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 12}
                attackDirection="up"
                isTacticDragTarget={isTacticTargetSlot('own', 12)}
                tacticTag={tacticTagFor('own', 12)}
              />
            </div>
            <CardSlot
              slotId="player-11"
              card={playerSlots[11]}
              onClick={(el) => handleSlotClick(11, el)}
              isSelected={selectedAttackerIndex === 11}
              onInfoClick={turnPhase === 'preparacao' && !targetingMode && selectedCardIndex === null && !equipFx ? setDetailedCard : undefined}
              isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 11}
              isImpactingAttacker={isImpacting && attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 11}
              isImpactingTarget={isImpacting && !soakedBlow && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 11}
              attackDirection="up"
              hint={getPlayerSlotHint(11)}
              isTacticDragTarget={isTacticTargetSlot('own', 11)}
                tacticTag={tacticTagFor('own', 11)}
            />
            <motion.div
              ref={playerDeckRef}
              data-tut="deck"
              className="w-28 h-36 md:w-36 md:h-48 relative group pointer-events-none"
            >
              <div className="absolute inset-0" style={{ opacity: deckCounts[0] === 0 ? 0.15 : 1 }}>
                <CardBack offset={6} brightness={0.3} />
                <CardBack offset={3} brightness={0.55} />
                <CardBack shadow />
              </div>
              <div className="absolute inset-x-0 -bottom-1 flex justify-center pointer-events-none z-10">
                <span className="px-2 rounded-md text-[22px] leading-tight font-extrabold" style={{ fontFamily: "'Cinzel', serif", color: deckCounts[0] === 0 ? '#ff9a8a' : '#ffe9b0', background: 'rgba(14,10,6,0.82)', border: '1px solid rgba(232,220,192,0.5)', textShadow: '0 1px 2px #000' }}>{deckCounts[0]}</span>
              </div>
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
        className="absolute z-40 flex flex-row items-center justify-between pointer-events-none"
        style={{
          left: 500,
          top: 600.5,
          // The coins sit at the edges of the board (the screen, on a phone); the turn panel and its button share the middle.
          width: Math.max(280, Math.min(windowSize.width, 1000 * gridBaseAnim.scale) - 40),
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
            <GoldBadge value={npcMana} className="w-[46px] md:w-16" />
          </div>
          <span className="text-[6px] md:text-[7px] font-black uppercase tracking-wide text-red-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
            {opponentInfo?.name ?? 'Adversário'}
          </span>
        </div>

        <div
          className="flex flex-col items-center gap-0.5 cursor-pointer shrink-0 pointer-events-auto"
          data-tut="tracker"
          onClick={(e) => {
            e.stopPropagation();
            if (currentTurn !== 'player') return;
            // Tutorial: a "touch COMPRA / SUPRIMENTOS" step is answered by the instructor, not by the engine.
            if (tutRef.current && tutCurrent()?.until?.t === 'tracker') { playUiClickSfx(); tutSignal({ t: 'tracker' }); return; }
            if (phaseTransitionLock || autoPhase) return; // a banner from the last tap (or the automatic phases) is still playing out
            playUiClickSfx();
            setSelectedCardIndex(null);
            setSelectedAttackerIndex(null);
            setSelectedMoverIndex(null);
            // Advancing ends the phase — and, from the last phase, the turn (Aurelion's bonus, the Soldado Tático swap,
            // the opponent's turn starting) — all decided by the engine.
            playerAct({ type: 'advance' });
          }}
        >
          {/* The turn panel (see TurnTracker): six phase medallions under a band that is green on the player's turn
              and red on the adversary's. Tapping it advances the phase — from the last one it ends the turn. */}
          {(() => {
            const isPlayerTurn = currentTurn === 'player';
            const shownPhase = tutTracker ?? (isPlayerTurn ? (autoPhase ?? turnPhase) : npcVisiblePhase);
            const locked: TurnPhase[] = combatOpenNow ? [] : ['combate'];
            const automatic = isPlayerTurn && (shownPhase === 'compra' || shownPhase === 'suprimentos');
            return (
              <TurnTracker
                mine={isPlayerTurn}
                phase={shownPhase}
                locked={locked}
                name={isPlayerTurn ? undefined : 'ADVERSÁRIO'}
                tappable={isPlayerTurn && (!automatic || tutTracker !== null)}
                onEnd={endTurnNow}
                endReady={isPlayerTurn && !automatic && !phaseTransitionLock && !tutOn && autoPhase === null}
              />
            );
          })()}
        </div>

        {/* Player's gold — same distance from the button as the NPC's above, same
            stacked-and-shrunk treatment (see that badge's own comment for why). */}
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <div id="player-gold-badge" onClick={(e) => e.stopPropagation()} className="pointer-events-auto shrink-0">
            <GoldBadge value={playerMana} className="w-[46px] md:w-16" />
          </div>
          <span className="text-[6px] md:text-[7px] font-black uppercase tracking-wide text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
            Jogador
          </span>
        </div>
      </div>
      </motion.div>

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
              // The card the player tapped, in the hand view: it steps up out of the fan (see HAND_SELECT_SCALE).
              const isHeld = held?.id === card.id;   // being dragged: its place in the hand stays, dimmed
              const tapSelected = tutOn && viewState === 'hand' && selectedCardIndex === i && !isAmbushCandidate;
              // Cards in front of it whose area overlaps it fade away (and let taps through to it).
              const coveredBySelected = viewState === 'hand' && selectedCardIndex !== null && !ambushPrompt && tutOn
                && i > selectedCardIndex && (i - selectedCardIndex) * handStep < HAND_CARD_WIDTH * HAND_SELECT_SCALE;
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
                data-hand-card
                data-card-name={card.name}
                className={`w-56 h-80 shrink-0 cursor-pointer relative group ${viewState === 'field' || coveredBySelected ? 'pointer-events-none' : 'pointer-events-auto'}`}
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
                  marginLeft: i === 0 ? 0 : handStep - HAND_CARD_WIDTH,
                  touchAction: tutOn ? undefined : 'none',
                }}
                onPointerDown={tutOn || ambushPrompt ? undefined : (e: React.PointerEvent) => beginPress(e, i)}
                animate={{
                  // The tapped card shows in full; the ones lying over it fade so it reads through them; the rest of
                  // the hand stays as it was. An Emboscada prompt dims everything but the card in question.
                  opacity: isHeld ? 0.22 : tapSelected ? 1 : coveredBySelected ? 0 : viewState === 'field'
                    ? (isFocused ? 1 : 0.4)
                    : (ambushPrompt && !isFocused ? 0.3 : 1),
                  x: isFocused && viewState === 'field' ? getSelectedCardX(i) : tapSelected ? getTappedCardShift(i) : 0,
                  // Float the previewed card up near the vertical center of the real screen
                  // instead of sitting down at the hand's normal resting height (see
                  // getSelectedCardY above for how mobile's handScale is compensated for).
                  // (the resting hand sits partly below the screen edge on mobile, so the lift also brings it back up)
                  y: isFocused && viewState === 'field' ? getSelectedCardY() : tapSelected ? getFanLift(i) - (isMobile ? HAND_CARD_HEIGHT * 0.22 : 0) - 24 : getFanLift(i),
                  scale: isFocused && viewState === 'field' ? (isMobile ? FIELD_PREVIEW_SCALE.mobile : FIELD_PREVIEW_SCALE.desktop) : tapSelected ? HAND_SELECT_SCALE : 1,
                  rotateZ: isFocused || viewState === 'field' ? 0 : getFanRotation(i),
                  zIndex: isFocused && !tapSelected ? 150 : i + 1,
                  // boxShadow lives on the front face now (see below), not here: a shadow
                  // on THIS element is a flat 2D box that doesn't perspective-foreshorten
                  // the way the nested 3D-rotated card does, so during the flip it kept
                  // rendering as a separate, undistorted rounded-rectangle ghost sitting
                  // behind the actual (already turning, narrower-looking) card.
                }}
                whileHover={tapSelected ? undefined : {
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
                  if (tutOn) handleCardClick(i);   // outside the tutorial the press handlers decide: a tap shows the card, a drag plays it
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
                      className="absolute inset-0"
                      // Only the card's own art is drawn — no frame, line or box around it. A tapped card gets a soft glow
                      // that follows the art's outline (drop-shadow), not a rectangle.
                      style={{
                        backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                        filter: isAmbushCandidate
                          ? `${CARD_THICKNESS_SHADOW} drop-shadow(0 0 12px rgba(239,68,68,0.9))`
                          : tapSelected
                            ? `${CARD_THICKNESS_SHADOW} drop-shadow(0 0 10px rgba(212,175,55,0.85))`
                            : cardGlowFilter(card, isFocused ? '0 0 22px rgba(212,175,55,0.95)' : '0 0 0 transparent'),
                      }}
                    >
                  {/* The tapped card steps up in the hand (see tapSelected / the Jogar-Cancelar bar further down). */}
                  <CardFace card={card} variant="hand" />

                  {/* An Emboscada the player may spring is answered in the big overlay (see ambushPrompt below), not on the hand. */}
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

      {/* Emboscada interrupt — the cards that can answer this attack, big and centred, each with its own Ativar, and one
          wide Não ativar. (The question itself is the box at the top.) */}
      <AnimatePresence>
        {ambushPrompt && (() => {
          const n = ambushPrompt.options.length;
          const gap = 12;
          // One card: the two answers sit side by side under it. Several: an Ativar under each and one wide Não ativar. The card is sized
          // so that everything fits between the top bar and the bottom edge, whatever the phone.
          const single = n === 1;
          // The card's frame hangs about 34 px below its 224x320 box, so that is reserved too; the question box above ends near y=215.
          const topClear = 215, reserved = single ? 84 : 150, hang = 34;
          const fitH = (windowSize.height - topClear - reserved - 20) / (HAND_CARD_HEIGHT + hang);
          const scale = Math.max(0.5, Math.min(1, fitH, (windowSize.width - 24 - gap * (n - 1)) / (n * HAND_CARD_WIDTH)));
          const answer = (opt: CardData) => { ambushPrompt.resolve(opt); setAmbushPrompt(null); };
          const decline = () => { playUiClickSfx(); ambushPrompt.resolve(null); setAmbushPrompt(null); };
          return (
            <motion.div
              key="ambush-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-x-0 bottom-0 z-[268] flex flex-col items-center justify-end gap-3 pb-4 pointer-events-none"
              style={{ top: topClear, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 14%)' }}
            >
              <div className="flex items-start justify-center" style={{ gap }}>
                {ambushPrompt.options.map(opt => (
                  <div key={opt.id} className="flex flex-col items-center gap-2 pointer-events-auto" style={{ width: HAND_CARD_WIDTH * scale }}>
                    <div style={{ width: HAND_CARD_WIDTH * scale, height: (HAND_CARD_HEIGHT + hang) * scale, filter: 'drop-shadow(0 0 14px rgba(239,68,68,0.9))' }}>
                      <div style={{ width: HAND_CARD_WIDTH, height: HAND_CARD_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                        <CardFace card={opt} variant="hand" />
                      </div>
                    </div>
                    {!single && (
                      <GameButton tone="primary" size={18} className="w-full" onClick={(e) => { e.stopPropagation(); answer(opt); }}>Ativar</GameButton>
                    )}
                  </div>
                ))}
              </div>
              {single ? (
                <div className="pointer-events-auto flex gap-3" style={{ width: Math.min(320, windowSize.width - 32) }}>
                  <GameButton tone="neutral" size={16} className="flex-1" onClick={(e) => { e.stopPropagation(); decline(); }}>Não ativar</GameButton>
                  <GameButton tone="primary" size={16} className="flex-1" onClick={(e) => { e.stopPropagation(); answer(ambushPrompt.options[0]); }}>Ativar</GameButton>
                </div>
              ) : (
                <div className="pointer-events-auto" style={{ width: Math.min(260, windowSize.width - 40) }}>
                  <GameButton tone="neutral" size={16} className="w-full" onClick={(e) => { e.stopPropagation(); decline(); }}>Não ativar</GameButton>
                </div>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>

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
          const hoverY = flyingCard.toY - 86;
          // The card has weight and lands firmly: it rises to the hover over the slot, holds still for a beat, then drops straight down with
          // an accelerating slam and stops dead on the slot (no tilt, no squash, no bounce, nothing to re-adjust afterwards). On the way down
          // it also takes the slot's exact width AND height, so the real card that replaces it is the same size in the same place.
          // The impact itself (sound, dust) fires at FLIGHT_HIT_MS, when the slam ends (see the effect that schedules it).
          // Only transform (x / y / scale) is animated, never left / top / width / height: those force a layout every frame, which
          // is what made the big flying card stutter on phones.
          const X0 = flyingCard.fromX - HALF_W, X1 = hoverX - HALF_W;
          const Y0 = flyingCard.fromY - HALF_H, Y1 = hoverY - HALF_H, Y2 = flyingCard.toY - HALF_H;
          const hs = startScale * hoverScale, endScaleY = flyingCard.toH / HAND_CARD_HEIGHT;
          return (
            <motion.div
              key="flying-card"
              initial={{ x: X0, y: Y0, scaleX: startScale, scaleY: startScale, opacity: 1 }}
              animate={{
                x: [X0, X1, X1, X1, X1],
                y: [Y0, Y1, Y1, Y2, Y2],
                scaleX: [startScale, hs, hs, endScale, endScale],
                scaleY: [startScale, hs, hs, endScaleY, endScaleY],
                times: [0, 0.42, 0.58, 0.8, 1],
              }}
              exit={{ opacity: 0, transition: { duration: 0.16 } }}
              transition={{ duration: FLIGHT_MS / 1000, ease: ['easeInOut', 'linear', [0.6, 0, 0.95, 0.35], 'linear'] }}
              onAnimationComplete={() => {
                // The engine already holds the card (and any tokens it summoned): show the board as it is now.
                if (engineRef.current) syncView(engineRef.current);
                // Keep the camera's zoomed focus on the slot for a beat before easing back.
                const big = !!flyingCard.card.isFullArt;
                setCameraSettling({ slotIndex: flyingCard.slotIndex });
                setFlyingCard(null);
                setTimeout(() => setCameraSettling(null), big ? 500 : 300);
              }}
              style={{
                position: 'fixed', left: 0, top: 0, width: HAND_CARD_WIDTH, height: HAND_CARD_HEIGHT, zIndex: 500, transformOrigin: 'center center', willChange: 'transform',
                boxShadow: cardBoxShadow(flyingCard.card, 'inset 0 0 0 1px rgba(212,175,55,0.45), 0 0 40px rgba(212,175,55,0.6)'),
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

      {equipFx && <EquipFxLayer fx={equipFx} vw={windowSize.width} vh={windowSize.height} />}
      {trigFx && <TriggerFloatLayer fx={trigFx} />}
      {iconPops.map(p => <IconPop key={p.id} x={p.x} y={p.y} icon={p.icon} label={p.label} />)}
      {shieldFx.map(f => <ShieldFxOnce key={f.id} x={f.x} y={f.y} w={f.w} h={f.h} mode={f.mode} gold={f.gold} />)}

      {/* Reposition flight (see repositionFlight's own comment) — a low, quick slide
          between two real on-screen board slots, one leg per card involved (just the
          mover into an empty slot, or both mover+swapped crossing paths at once).
          Both origin and destination CardSlots hide their normal card render for the
          duration (see the `card={...}` ternary at each Vanguarda/Retaguarda map
          above), so this overlay is the only visible copy while it's mid-flight. */}
      <AnimatePresence>
        {repositionFlight && [
          { leg: repositionFlight.mover, card: repositionFlight.moverCard, isPrimary: true },
          ...(repositionFlight.swapped ? [{ leg: repositionFlight.swapped, card: repositionFlight.swappedCard!, isPrimary: false }] : []),
        ].map(({ leg, card, isPrimary }) => {
          // A small hop, not the hand-play showcase hover (see flyingCard) — this is a
          // card being nudged a few slots over, not a brand new card entering play.
          const LIFT = repositionFlight.reinforce ? 0 : 30;   // a reinforcement charges straight forward
          const midX = (leg.fromX + leg.toX) / 2;
          const midY = repositionFlight.reinforce ? (leg.fromY + leg.toY) / 2 : Math.min(leg.fromY, leg.toY) - LIFT;
          const tilt = repositionFlight.reinforce ? 0 : leg.toX === leg.fromX ? 0 : (leg.toX > leg.fromX ? 5 : -5);
          return (
            <motion.div
              key={card.id}
              initial={{ x: leg.fromX - leg.w / 2, y: leg.fromY - leg.h / 2, rotate: 0 }}
              animate={{
                x: [leg.fromX - leg.w / 2, midX - leg.w / 2, leg.toX - leg.w / 2],
                y: [leg.fromY - leg.h / 2, midY - leg.h / 2, leg.toY - leg.h / 2],
                rotate: [0, tilt, 0],
              }}
              transition={repositionFlight.reinforce ? { duration: 0.34, ease: [0.55, 0, 0.9, 0.55] } : { duration: 0.4, ease: "easeInOut" }}
              // Only the mover's own leg commits the actual slot swap — attaching this
              // to both legs of a swap would just run the same commit twice.
              onAnimationComplete={isPrimary ? () => {
                // The slide landed: the engine commits the move (swap, Capitão de Formação's buff, once-per-turn
                // bookkeeping, Batedor's free move) and the board shows the result.
                // (the opponent's moves are committed by its own turn runner, which waits for this slide)
                if (repositionFlight.reinforce) {
                  const r = document.getElementById(`${repositionFlight.side}-${repositionFlight.destIndex}`)?.getBoundingClientRect();
                  if (r) { playCardPlaySfx(); fireImpactBurst(r.left + r.width / 2, r.top + r.height / 2, false, r.width); }
                  setRepositionFlight(null);
                  if (engineRef.current) syncView(engineRef.current);
                  return;
                }
                if (repositionFlight.side === 'player') dispatchAction(0, { type: 'move', from: repositionFlight.originIndex, to: repositionFlight.destIndex });
                setRepositionFlight(null);
              } : undefined}
              style={{ position: 'fixed', left: 0, top: 0, width: leg.w, height: leg.h, zIndex: 480, filter: CARD_THICKNESS_SHADOW, willChange: 'transform' }}
              className="pointer-events-none rounded-lg flex flex-col p-1"
            >
              {card.isFullArt ? <CardFaceFullArtMini card={card} /> : <CardFaceStandardMini card={card} />}
              {/* The swap sign rides on each card that changes places, for as long as it moves. */}
              {repositionFlight.swapped && !repositionFlight.reinforce && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: [0, 1, 1, 0.9], scale: [0.4, 1.15, 1, 1] }} transition={{ duration: 0.4, times: [0, 0.3, 0.7, 1] }}
                >
                  <div style={{ width: '62%', height: '62%', filter: 'drop-shadow(0 0 8px rgba(120,200,255,0.9)) drop-shadow(0 2px 3px rgba(0,0,0,0.7))' }}>
                    <SpriteIcon icon="swap" className="w-full h-full" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Impact: dust, sparks, a flat shock ring and a flash where the card landed (see ImpactFx). */}
      {impactBurst.map(burst => <ImpactFx key={burst.id} x={burst.x} y={burst.y} w={burst.w} big={!!burst.big} />)}

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
      {abilityReadyPrompts.length > 0 && !targetingMode && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {abilityReadyPrompts.map(p => (
            <AbilityReadyGlow key={p.key} x={p.x} y={p.y} w={p.w} h={p.h} onClick={p.onClick} kind={p.kind} card={p.card} />
          ))}
        </div>
      )}
      {triggerBursts.length > 0 && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {triggerBursts.map(b => <TriggerBurst key={b.id} x={b.x} y={b.y} w={b.w} h={b.h} card={b.card} />)}
        </div>
      )}
      {/* Choosing a target: the legal ones wear the attack reticle (coloured by what the effect does), everything else is dimmed. */}
      {targetLayer && (() => {
        const st = TARGET_STYLE[targetLayer.kind];
        const validKeys = new Set(targetLayer.valid.map(v => `${v.side}-${v.index}`));
        const rects: { key: string; r: DOMRect; valid: boolean }[] = [];
        (['player', 'npc'] as const).forEach(side => {
          const slots = side === 'player' ? playerSlots : npcSlots;
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(i => {
            if (!slots[i]) return;
            const el = getCardVisualEl(`${side}-${i}`);
            if (el) rects.push({ key: `${side}-${i}`, r: el.getBoundingClientRect(), valid: validKeys.has(`${side}-${i}`) });
          });
        });
        return (
          <div className="fixed inset-0 z-[45] pointer-events-none">
            {rects.filter(x => !x.valid).map(x => (
              <div key={`dim-${x.key}`} className="absolute rounded-lg bg-black/55" style={{ left: x.r.left, top: x.r.top, width: x.r.width, height: x.r.height }} />
            ))}
            {rects.filter(x => x.valid).map(x => (
              <motion.img
                key={`ret-${x.key}`}
                src={haloValidTargetImage}
                alt=""
                className="absolute"
                animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                style={{ left: x.r.left + x.r.width / 2 - (x.r.width * 1.2) / 2, top: x.r.top + x.r.height / 2 - (x.r.height * 1.2) / 2, width: x.r.width * 1.2, height: x.r.height * 1.2, objectFit: 'contain', filter: st.halo }}
              />
            ))}
          </div>
        );
      })()}
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

      {/* Explicit "Cancelar" button — handleBackgroundClick already backed out of
          every one of these states (a hand card merely selected/previewed, or a
          committed Tática/cura do General/Cavaleiro Hospitalário waiting on a
          target) whenever the player tapped the board/background around the
          hand, but nothing on screen ever said that tap did anything — found only
          by accident. Same fixed spot every time, so it's learnable at a glance
          instead of rediscovered per session. */}
      <AnimatePresence>
        {!tutOn && selectedCardIndex !== null && viewState === 'field' && !targetingMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => { playUiClickSfx(); handleBackgroundClick(); }}
            className="fixed top-3 left-3 md:top-4 md:left-4 z-[205] pointer-events-auto active:scale-95"
          >
            <ThinFrame px={10} style={{ background: 'rgba(104,24,24,0.78)' }}>
              <span className="flex items-center gap-1.5 px-3 py-[3px] uppercase tracking-[0.12em] whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 11, color: '#ffd9d2' }}>
                <X className="w-3.5 h-3.5" strokeWidth={3} />
                Cancelar
              </span>
            </ThinFrame>
          </motion.button>
        )}
      </AnimatePresence>

      {punchFx && <React.Fragment key={punchFx.key}><PunchFx x={punchFx.x} y={punchFx.y} w={punchFx.w} h={punchFx.h} heavy={punchFx.heavy} /></React.Fragment>}

      {/* Opções (dicas e som) during a match, at the extreme top-left; it steps aside for the Cancelar button that shares the corner. */}
      {gameMode && matchIntroStage === null && !tutOn && !(selectedCardIndex !== null && viewState === 'field' && !targetingMode) && (
        <GameButton className="fixed top-3 left-3 z-[205]" size={10} onClick={() => setOptionsOpen(true)}>Opções</GameButton>
      )}
      <AnimatePresence>{optionsOpen && <OptionsModal onClose={() => setOptionsOpen(false)} />}</AnimatePresence>

      {/* Online: whose turn it is to move, and how long they have left. */}
      {turnClock && onlineRef.current && !gameOverWinner && matchIntroStage === null && engineRef.current && (() => {
        const eng = engineRef.current!;
        const mine = (eng.pending ? eng.pending.seat : eng.turn.active) === 0;
        const left = Math.max(0, Math.ceil((turnClock.deadline - (clockNow + turnClock.skew)) / 1000));
        const urgent = left <= 20;
        return (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[206] pointer-events-none">
            <GameBox px={10} tint={urgent ? 'rgba(70,12,12,0.9)' : undefined}>
              <span className="block px-2.5 py-0.5 text-[10px] uppercase tracking-widest tabular-nums whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: urgent ? '#ffb4a8' : '#f0e0bb' }}>
                {mine ? 'Você' : 'Rival'} {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
              </span>
            </GameBox>
          </div>
        );
      })()}
      {/* Online: the opponent has not answered yet. */}
      {waitingRemote && !gameOverWinner && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[206] pointer-events-none">
          <GameBox px={10}>
            <span className="block px-2.5 py-0.5 text-[10px] uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#ffd477' }}>Aguardando o adversário…</span>
          </GameBox>
        </div>
      )}
      {/* Leaving a match: online, it counts as giving up. */}
      {gameMode && !gameOverWinner && matchIntroStage === null && (
        <GameButton className="fixed top-3 right-3 z-[205]" size={10}
          onClick={() => { if (window.confirm(onlineRef.current ? 'Desistir da partida? Você perde a batalha.' : 'Sair da partida?')) { playUiClickSfx(); void leaveMatch(); } }}>
          {onlineRef.current ? 'Desistir' : 'Sair'}
        </GameButton>
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
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] max-w-[90vw] pointer-events-none"
          >
            <GameBox px={14} tint="rgba(54,10,10,0.92)" style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.7)' }}>
              <span className="block text-center px-3 py-1.5 text-[16px] md:text-base font-bold leading-snug" style={{ fontFamily: "'Crimson Pro', serif", color: '#f5deb3', textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
                {toastMessage}
              </span>
            </GameBox>
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

      {/* Match-intro "VS" reveal, portrait stage — see startMatchIntro/matchIntroStage
          above. Both Generals' art (no name/cost/stats — just the painting, see the
          user's own ask for a cleaner reveal) huge on opposite sides, held frozen
          there through the BATALHA banner below, then shrinking down into their real
          board slot (introDescendTargets) only once that banner has cleared. Rendered
          for 'panels'/'battle'/'descend' — 'battle' reuses the same frozen big-corner
          position as 'panels' (descending stays false until matchIntroStage is
          actually 'descend'), so the two Generals just sit still behind BATALHA
          instead of racing it to the board. Sits above everything else on screen
          (z-[900]+). */}
      <AnimatePresence>
        {(matchIntroStage === 'panels' || matchIntroStage === 'coin' || matchIntroStage === 'battle' || matchIntroStage === 'descend') && (() => {
          const bigW = windowSize.width * 0.34;
          const bigH = bigW * (400 / 300);
          const bigTop = windowSize.height * 0.46 - bigH / 2;
          const leftBigX = windowSize.width * 0.06;
          const rightBigX = windowSize.width - bigW - windowSize.width * 0.06;
          const descending = matchIntroStage === 'descend' && introDescendTargets;
          const panelTransition = descending
            ? { duration: 0.75, ease: 'easeInOut' as const }
            : { duration: 0.65, ease: 'easeOut' as const };
          const portraitFrame = (card: CardData) => (
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ boxShadow: 'inset 0 0 0 3px rgba(212,175,55,0.9), inset 0 0 50px 12px rgba(0,0,0,0.55), 0 0 50px rgba(0,0,0,0.85)' }}
            >
              <img src={card.art} alt={card.name} className="w-full h-full object-cover" draggable={false} />
            </div>
          );
          return (
            <motion.div
              key="match-intro"
              className="fixed inset-0 z-[900] pointer-events-none"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: matchIntroStage === 'descend' ? 0.35 : 0.8 }}
                transition={{ duration: 0.5 }}
              />
              {/* Player's General — slides in from the left */}
              <motion.div
                className="fixed"
                style={{ zIndex: 901, filter: CARD_THICKNESS_SHADOW }}
                initial={{ left: -bigW, top: bigTop, width: bigW, height: bigH, opacity: 0 }}
                animate={
                  descending && introDescendTargets
                    ? { left: introDescendTargets.player.left, top: introDescendTargets.player.top, width: introDescendTargets.player.width, height: introDescendTargets.player.height, opacity: 1 }
                    : { left: leftBigX, top: bigTop, width: bigW, height: bigH, opacity: 1 }
                }
                transition={panelTransition}
              >
                {portraitFrame(cardDataFromName(matchSelectionRef.current.general, 'intro-player'))}
              </motion.div>
              {/* NPC's General — slides in from the right, mirrored */}
              <motion.div
                className="fixed"
                style={{ zIndex: 901, filter: CARD_THICKNESS_SHADOW }}
                initial={{ left: windowSize.width, top: bigTop, width: bigW, height: bigH, opacity: 0 }}
                animate={
                  descending && introDescendTargets
                    ? { left: introDescendTargets.npc.left, top: introDescendTargets.npc.top, width: introDescendTargets.npc.width, height: introDescendTargets.npc.height, opacity: 1 }
                    : { left: rightBigX, top: bigTop, width: bigW, height: bigH, opacity: 1 }
                }
                transition={panelTransition}
              >
                {portraitFrame(matchSelectionRef.current.npcGeneral ? cardDataFromName(matchSelectionRef.current.npcGeneral, 'intro-npc') : DECKS[matchSelectionRef.current.npcDeckId].general)}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <AnimatePresence>{matchIntroStage === 'coin' && <CoinToss key="coin-toss" onResolved={tutRef.current ? tutCoinResolved : continueMatchIntro} mySide={coinSide} canChoose={!tutRef.current && !(onlineRef.current && onlineRef.current.init.iWonToss === undefined)} remote={onlineRef.current ? { choose: chooseFirstOnline, pick: onlinePick } : undefined} forced={onlineRef.current ? (onlineRef.current.init.iWonToss ?? onlineRef.current.init.iGoFirst ? 'player' : 'npc') : tutRef.current ? 'player' : undefined} />}</AnimatePresence>
      {/* Nothing behind the intro can be tapped (the turn button used to be reachable through it). */}
      {(npcKickoffPending || matchIntroStage !== null) && <div className="fixed inset-0 z-[700]" />}

      {/* Match-intro "VS" reveal, BATALHA stage — fires while both Generals are still
          frozen in their big reveal position (see startMatchIntro's BATTLE_START
          schedule), so the declaration lands between the two of them face-to-face,
          before either has taken their place on the board — only once this whole
          stage clears do they shrink down into their real slot ('descend'). User-
          supplied artwork (see bannerBatalhaImage), whole and in one piece — it drops
          hard from above and slams down (a heavy fall, then an exaggerated squash-
          and-recoil landing, see BATALHA_FALL_MS/BATALHA_IMPACT_FRACTION), with a
          bright flash and a heavy stone-thud (playBatalhaImpactSfx, scheduled in
          startMatchIntro) right as it hits — no vibration afterward once it's
          settled. The scene dims further behind it (stacking with the portrait
          stage's own scrim above) so the word reads clearly, and it's anchored near
          the TOP of the screen (items-start + pt-[9vh] on the flex box below) rather
          than centered, so it falls into the open space above the two frozen General
          portraits instead of landing on top of their art. */}
      <AnimatePresence>
        {matchIntroStage === 'battle' && (
          <motion.div
            key="batalha-banner"
            className="fixed inset-0 z-[900] flex items-start justify-center pt-[9vh] pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 0.35 }}
            />
            {/* Impact flash — timed to the same BATALHA_IMPACT_FRACTION point in the
                fall below, so the visual slam, the flash, and playBatalhaImpactSfx
                all land on the same frame. */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, rgba(255,246,220,0.9) 0%, rgba(255,246,220,0) 62%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{
                duration: BATALHA_FALL_MS / 1000,
                times: [0, BATALHA_IMPACT_FRACTION * 0.97, BATALHA_IMPACT_FRACTION, 1],
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="relative select-none"
              initial={{ y: -650, scaleX: 1, scaleY: 1 }}
              animate={{
                y: [-650, -650, 0, -10, 0],
                scaleY: [1, 1, 0.6, 1.08, 1],
                scaleX: [1, 1, 1.2, 0.95, 1],
              }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{
                duration: BATALHA_FALL_MS / 1000,
                times: [0, BATALHA_IMPACT_FRACTION * 0.8, BATALHA_IMPACT_FRACTION, BATALHA_IMPACT_FRACTION + (1 - BATALHA_IMPACT_FRACTION) * 0.45, 1],
                ease: ['linear', 'easeIn', 'easeOut', 'easeOut'],
              }}
            >
              <img
                src={bannerBatalhaImage}
                alt="Batalha!"
                draggable={false}
                className="block w-[92vw] max-w-3xl h-auto drop-shadow-[0_22px_40px_rgba(0,0,0,0.9)]"
              />
            </motion.div>
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

      {/* Game Over Overlay — the General has fallen. Same user-supplied artwork
          family as the match-intro BATALHA (see bannerVitoriaImage/
          bannerDerrotaImage), each with its own "surgir" treatment matching its
          mood rather than reusing BATALHA's violent slam: Vitória glows in from the
          inside out (a soft gold burst blooming behind it as it scales up), Derrota
          drifts down slowly out of a dark, desaturated haze — heavy and mournful,
          no bounce. */}
      <AnimatePresence>
        {gameOverWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-black/90 pointer-events-auto"
          >
            {gameOverWinner === 'player' ? (
              <div className="relative flex items-center justify-center w-[85vw] max-w-lg">
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(255,205,110,0.55) 0%, rgba(255,205,110,0) 70%)', maxWidth: '24rem', maxHeight: '24rem' }}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: [0.2, 1.4, 1.1], opacity: [0, 0.9, 0.55] }}
                  transition={{ duration: 1.1, times: [0, 0.6, 1], ease: 'easeOut' }}
                />
                <motion.img
                  src={bannerVitoriaImage}
                  alt="Vitória!"
                  draggable={false}
                  className="relative w-full h-auto"
                  style={{ filter: 'drop-shadow(0 10px 40px rgba(255,200,80,0.5))' }}
                  initial={{ scale: 0.35, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 13, stiffness: 140, delay: 0.1 }}
                />
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-[85vw] max-w-lg">
                <motion.img
                  src={bannerDerrotaImage}
                  alt="Derrota"
                  draggable={false}
                  className="relative w-full h-auto"
                  style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.9))' }}
                  initial={{ y: -70, opacity: 0, filter: 'brightness(0.4) saturate(0.5)' }}
                  animate={{ y: 0, opacity: 1, filter: 'brightness(1) saturate(1)' }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                />
              </div>
            )}
            <p className="text-zinc-300 text-sm md:text-base text-center max-w-xs">
              {gameOverWinner === 'player' ? 'O General inimigo caiu em batalha.' : 'Seu General caiu em batalha.'}
            </p>
            {matchReward === 'pending' && <p className="text-amber-200/80 text-xs uppercase tracking-widest">Calculando recompensas…</p>}
            {matchReward && matchReward !== 'pending' && (
              <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl border border-amber-400/50 bg-black/60 text-center">
                {matchReward.reason === 'too_short' && <p className="text-zinc-300 text-xs">Partida curta demais para render recompensas.</p>}
                {matchReward.reason === 'abandoned' && <p className="text-zinc-300 text-xs">Partida abandonada: sem recompensas.</p>}
                {(matchReward.reason === 'win' || matchReward.reason === 'loss') && (
                  <>
                    <p className="text-amber-300 font-black text-sm tracking-wide">+{matchReward.xp} XP · +{matchReward.coroas} Coroas</p>
                    {matchReward.levels_gained > 0 && <p className="text-emerald-300 font-black text-xs uppercase tracking-widest">Subiu para o nível {matchReward.level}!</p>}
                  </>
                )}
              </div>
            )}
            {!tutOn && (
            <button
              onClick={() => { playUiClickSfx(); stopOnline(); setGameMode(null); }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-colors"
            >
              Voltar ao Menu
            </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {tutOn && !tutShown && gameMode && (
        <GameButton tutUi size={10} onClick={tutExit} className="fixed z-[955] top-2.5 right-2.5">PULAR</GameButton>
      )}
      {tutOn && tutShown && (
        <TutorialStage key={tutShown.id} step={tutShown} allowRef={tutAllowRef} replay={tutReplay}
          picked={selectedCardIndex !== null || selectedAttackerIndex !== null || selectedMoverIndex !== null}
          cardAt={(side, idx) => { const c = engineRef.current?.players[side === 'player' ? 0 : 1].board[idx]; return c ? toCardData(c) : null; }}
          canBack={tutCanBack()} onNext={() => tutNext()} onBack={tutBack} onRepeat={() => setTutReplay(n => n + 1)} onSkip={tutExit}
          nextLabel={tutShown.id === 'outro' ? 'CONCLUIR' : undefined} />
      )}

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
            <GameBox px={14} className="max-w-xs">
              <p className="px-3 py-1 text-center text-[#ffe3a1] font-bold uppercase tracking-wide text-[13px] leading-snug" style={{ fontFamily: "'Cinzel', serif" }}>{cardPicker.title}</p>
            </GameBox>
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
                      if (cardPicker.maxPicks === 1 && !cardPicker.alwaysConfirm) {
                        cardPicker.onConfirm([opt]);
                      } else {
                        toggleCardPickerSelection(opt);
                      }
                    }}
                  >
                    <div
                      className={`relative w-full aspect-[2/3] rounded-xl transition-transform ${isSelected ? 'scale-[1.06] drop-shadow-[0_0_14px_rgba(52,211,153,0.95)]' : ''}`}
                      style={{ filter: CARD_THICKNESS_SHADOW }}
                    >
                      <CardFace card={opt} variant="hand" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {(cardPicker.maxPicks > 1 || cardPicker.alwaysConfirm) && (
              <GameButton tone="primary" size={12} disabled={cardPicker.selected.length < cardPicker.minPicks} onClick={() => { playUiClickSfx(); cardPicker.onConfirm(cardPicker.selected); }}>
                Confirmar ({cardPicker.selected.length}/{cardPicker.maxPicks})
              </GameButton>
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
              <GameButton size={12} onClick={() => { playUiClickSfx(); setViewingGraveyard(null); }}>Fechar</GameButton>
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
            <div key={fn.id} className="absolute flex items-center justify-center" style={{ left: fn.x, top: fn.y, transform: 'translate(-50%, -50%)' }}>
              <FloatNumber text={fn.text} kind={fn.kind} />
            </div>
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
            <div
              className={`relative w-full h-full rounded-xl ${detailedCard.isFullArt ? '' : 'shadow-[0_0_100px_rgba(0,0,0,0.8)]'}`}
              style={{ filter: cardGlowFilter(detailedCard, '0 0 40px rgba(0,0,0,0.8)') }}
            >
              <CardFace card={detailedCard} variant="hand" />
            </div>
            <button
              onClick={() => { playUiClickSfx(); setDetailedCard(null); }}
              className="absolute -top-3 -left-3 w-8 h-8 bg-red-600 rounded-full border-2 border-red-900 flex items-center justify-center shadow-lg z-30 hover:bg-red-500 transition-colors pointer-events-auto"
            >
              <X className="text-white w-5 h-5" />
            </button>
          </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* A hand card the player tapped: big in the middle of the screen so it can be read on the card itself. Tapping it again puts it back
          in the hand; pressing and dragging it plays it. */}
      <AnimatePresence>
        {!tutOn && inspectId && (() => {
          const idx = hand.findIndex(c => c.id === inspectId);
          const card = idx >= 0 ? hand[idx] : null;
          if (!card || held) return null;
          // The same size and place as the card that opens when a card on the board is tapped (detailedCard above).
          const k = BOARD_PREVIEW_SCALE;
          const lift = -windowSize.height * (0.5 - PREVIEW_Y_FRACTION);
          return (
            <motion.div
              key="inspect-scrim"
              className="fixed inset-0 z-[258] flex items-center justify-center"
              style={{ background: 'rgba(4,2,0,0.72)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { if (performance.now() - inspectOpenedAtRef.current > 500) setInspectId(null); }}
            >
              {/* Only opacity and a short slide are animated; the card is drawn at its final size from the first frame and carries no
                  filter — a big scaled card with chained drop-shadows was what made opening it stutter on phones. */}
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 46 }}
                animate={{ opacity: 1, y: lift }}
                exit={{ opacity: 0, y: 46 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="relative shrink-0"
                style={{ width: 224 * k, height: 320 * k, touchAction: 'none', willChange: 'transform, opacity' }}
                onPointerDown={(e: React.PointerEvent) => { e.stopPropagation(); beginPress(e, idx); }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="inspect-glow" />
                <div style={{ width: 224, height: 320, transform: `scale(${k})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0 }}>
                  <CardFace card={card} variant="hand" />
                </div>
              </motion.div>
              {/* What to do next: drag it to the board (or why it cannot be played now). */}
              {(() => {
                const why = dragBlockReason(card);
                if (why === 'wait' || why === 'busy') return null;
                return (
                  <div className="absolute inset-x-0 flex flex-col items-center gap-1 pointer-events-none" style={{ bottom: 22 }}>
                    {why ? (
                      <span className="px-3 py-1.5 rounded-md text-center" style={{ background: 'rgba(14,10,6,0.88)', border: '1px solid rgba(232,220,192,0.5)', color: '#f3e3c3', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', maxWidth: windowSize.width - 40 }}>{why}</span>
                    ) : !gameSettings.hintsDrag || dragLessons >= 1 ? null : (
                      <>
                        <DragFinger size={30} travel={46} />
                        <span className="px-3 py-1 rounded-md" style={{ background: 'rgba(14,10,6,0.88)', border: '1px solid rgba(255,214,110,0.7)', color: '#ffe9b0', fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          Segure e arraste para o campo
                        </span>
                      </>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* While the player has not yet learned the gesture: a finger sliding from the hand up to the board, above the hand. */}
      <AnimatePresence>
        {!tutOn && gameSettings.hintsDrag && !held && !inspectId && dragLessons < 1 && currentTurn === 'player' && turnPhase === 'preparacao' && viewState === 'hand' && !ambushPrompt && !targetingMode && !pendingAbility && !flyingCard && !preZoomSlot && !gameOverWinner
          && hand.some(c => playerMana >= c.cost && getCardDropKind(c) !== 'blocked') && (
          <motion.div key="drag-hint" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none" style={{ bottom: 150, zIndex: 214 }}>
            <DragFinger size={36} travel={60} />
            <span className="px-3 py-1 rounded-md text-center" style={{ background: 'rgba(14,10,6,0.88)', border: '1px solid rgba(255,214,110,0.75)', color: '#ffe9b0', fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Arraste a carta para o campo
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The card being held: it hangs below the finger, a little apart from it, so the player knows which card was picked up. Its position is
          written straight to the element while the finger moves (no React render per move) and it uses no filters, so it stays smooth. */}
      {!tutOn && held && (() => {
        const card = hand.find(c => c.id === held.id);
        if (!card) return null;
        const { x, y } = dragPointRef.current;
        return (
          <>
            {gameSettings.hintsDrag && dragLessons < 1 && <div className="fixed left-1/2 -translate-x-1/2 pointer-events-none px-4 py-1.5 rounded-md text-center" style={{ top: 84, zIndex: 321, background: 'rgba(14,10,6,0.9)', border: '1px solid rgba(255,214,110,0.8)', boxShadow: '0 0 16px rgba(255,200,80,0.45)', color: '#ffe9b0', fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {(() => {
                const k = getCardDropKind(card);
                return k === 'place' ? 'Solte na casa acesa' : k === 'enemyTarget' ? 'Solte em um alvo inimigo' : k === 'ownTarget' ? 'Solte em uma unidade sua' : 'Solte no seu campo';
              })()}
            </div>}
            <DragGuide infoRef={guideInfoRef} getStart={() => ({ x: dragPointRef.current.x, y: heldTop(dragPointRef.current.y) + 6 })} />
            {held.zone && (
              <div ref={zoneElRef} className="drop-zone fixed pointer-events-none flex flex-col items-center justify-center text-center"
                style={{ left: held.zone.left, top: held.zone.top, width: held.zone.width, height: held.zone.height, zIndex: 316 }}>
                <span className="drop-zone-title">SOLTE AQUI</span>
                <span className="drop-zone-sub">{held.zone.label}</span>
              </div>
            )}
            <div
              ref={heldElRef}
              className="fixed pointer-events-none"
              style={{ left: 0, top: 0, width: 224, height: 320, zIndex: 320, willChange: 'transform', transform: `translate3d(${x - 112}px, ${heldTop(y) + 160 * HELD_SCALE - 160}px, 0)` }}
            >
              <div style={{ width: 224, height: 320, transform: `scale(${HELD_SCALE}) rotate(-3deg)`, transformOrigin: 'center', position: 'relative' }}>
                <div className="held-glow" />
                <CardFace card={card} variant="hand" />
              </div>
            </div>
          </>
        );
      })()}

      {/* Target picking (see TargetingHud): the source card tucked in the corner, what the effect does, Cancelar. */}
      <AnimatePresence>
        {targetingMode && (
          <TargetingHud
            key="targeting-hud"
            source={targetingMode.source}
            mode="targeting"
            kind={targetingMode.kind}
            title={targetingMode.title}
            hint={targetingMode.hint}
            amount={targetingMode.amount}
            windowH={windowSize.height}
            onCancel={cancelTargeting}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// What a Tática used at once does, in a few words (shown in the zone where it is dropped).
const IMMEDIATE_ZONE_LABEL: Record<string, string> = {
  gold: 'GANHA OURO', draw: 'COMPRA CARTAS', refill_hand: 'COMPRA CARTAS', extra_moves: 'MOVE MAIS UNIDADES', damage: 'CAUSA DANO',
  look_top: 'VÊ O TOPO DO BARALHO', search: 'BUSCA UMA CARTA', summon_deck: 'CONVOCA DO BARALHO',
};
// "Segure e arraste": a finger that presses on a card and slides up toward the board, over and over. `size` is the icon size in px.
const DragFinger = ({ size = 34, travel = 54 }: { size?: number; travel?: number }) => {
  const h = size * 1.75, w = h * 0.8;   // the tutorial's hand, drawn smaller
  return (
    <span className="relative inline-flex flex-col items-center" style={{ width: w + 16, height: h + travel }}>
      <motion.span className="absolute left-1/2 -translate-x-1/2" style={{ top: 0, color: '#ffd36a' }}
        animate={{ y: [0, travel * 0.15, 0], opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        <ArrowUp strokeWidth={3.5} style={{ width: size * 0.7, height: size * 0.7, filter: 'drop-shadow(0 0 6px rgba(255,200,80,.9))' }} />
      </motion.span>
      <motion.img src={tutHandSprite} alt="" draggable={false} className="absolute left-1/2" style={{ bottom: 0, width: w, height: h, marginLeft: -w * 0.42, filter: 'drop-shadow(0 0 8px rgba(255,226,150,.85)) drop-shadow(0 2px 3px rgba(0,0,0,.7))' }}
        animate={{ y: [0, -travel, -travel, 0], scale: [1, 0.92, 0.92, 1], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.55, 0.8, 1] }} />
    </span>
  );
};

// The guide drawn while a card is dragged: from the top of the held card to where it would land, with the game's own attack arrows (red toward
// the enemy, blue toward your side) flowing along it and a light sweeping from one end to the other and back. Everything is driven by a
// frame loop that reads refs, so it follows the finger without any React render.
type GuideInfo = { ex: number; ey: number; color: string; kind: 'red' | 'blue' };
const DragGuide = ({ infoRef, getStart }: { infoRef: React.MutableRefObject<GuideInfo | null>; getStart: () => { x: number; y: number } }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    let raf = 0;
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const svg = svgRef.current;
      if (!svg) return;
      const info = infoRef.current;
      const q = (sel: string) => svg.querySelector(sel) as SVGElement | null;
      if (!info) { svg.style.opacity = '0'; return; }
      svg.style.opacity = '1';
      const { x: sx, y: sy } = getStart();
      const dx = info.ex - sx, dy = info.ey - sy, len = Math.max(1, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const now = performance.now() / 1000;
      // the light: out and back along the line
      const ph = (now % 1.4) / 1.4, p = ph < 0.5 ? ease(ph * 2) : ease((1 - ph) * 2);
      const grad = q('#drag-guide-grad');
      grad?.setAttribute('x1', String(sx)); grad?.setAttribute('y1', String(sy)); grad?.setAttribute('x2', String(info.ex)); grad?.setAttribute('y2', String(info.ey));
      const stops = grad?.querySelectorAll('stop');
      if (stops && stops.length === 3) {
        stops[0].setAttribute('offset', String(Math.max(0, p - 0.32))); stops[1].setAttribute('offset', String(p)); stops[2].setAttribute('offset', String(Math.min(1, p + 0.32)));
        stops.forEach((st, i) => { st.setAttribute('stop-color', i === 1 ? '#ffffff' : info.color); st.setAttribute('stop-opacity', i === 1 ? '1' : '0.28'); });
      }
      ['#drag-guide-glow', '#drag-guide-core'].forEach(id => { const l = q(id); l?.setAttribute('x1', String(sx)); l?.setAttribute('y1', String(sy)); l?.setAttribute('x2', String(info.ex)); l?.setAttribute('y2', String(info.ey)); });
      q('#drag-guide-glow')?.setAttribute('stroke', 'url(#drag-guide-grad)');
      q('#drag-guide-core')?.setAttribute('stroke', info.color);
      // the arrows (the game's own art), two of them half a cycle apart, flying toward the target and fading at both ends
      const h = Math.max(54, Math.min(120, len * 0.75)), native = info.kind === 'red' ? -90 : 90;
      const w = h * (info.kind === 'red' ? 70 : 55) / 350;
      ['a', 'b'].forEach((k, i) => {
        const img = q(`#drag-guide-${info.kind}-${k}`);
        const other = q(`#drag-guide-${info.kind === 'red' ? 'blue' : 'red'}-${k}`);
        other?.setAttribute('opacity', '0');
        if (!img) return;
        const f = ((now / 0.85) + i * 0.5) % 1, e = ease(f);
        const x = sx + dx * e, y = sy + dy * e;
        img.setAttribute('width', String(w)); img.setAttribute('height', String(h)); img.setAttribute('x', String(-w / 2)); img.setAttribute('y', String(-h / 2));
        img.setAttribute('transform', `translate(${x} ${y}) rotate(${angle - native})`);
        img.setAttribute('opacity', String(Math.sin(Math.PI * f)));
      });
      const ring = q('#drag-guide-ring');
      ring?.setAttribute('cx', String(info.ex)); ring?.setAttribute('cy', String(info.ey)); ring?.setAttribute('r', String(15 + 4 * Math.sin(now * 7))); ring?.setAttribute('stroke', info.color);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <svg ref={svgRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 319, opacity: 0 }}>
      <defs>
        <linearGradient id="drag-guide-grad" gradientUnits="userSpaceOnUse"><stop offset="0" /><stop offset="0.5" /><stop offset="1" /></linearGradient>
      </defs>
      <line id="drag-guide-glow" strokeWidth={12} strokeLinecap="round" />
      <line id="drag-guide-core" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
      <image id="drag-guide-red-a" href={attackArrowRedImage} /><image id="drag-guide-red-b" href={attackArrowRedImage} />
      <image id="drag-guide-blue-a" href={attackArrowBlueImage} /><image id="drag-guide-blue-b" href={attackArrowBlueImage} />
      <circle id="drag-guide-ring" fill="none" strokeWidth={4} />
    </svg>
  );
};

// ── How cards land on the board ─────────────────────────────────────────────────────────────────────────────────
// A card that arrives without a flight of its own (an opponent's play, a summoned soldier) drops in from above, each one a little
// different; when it touches down there is a thud and a puff of dust.
// Cards that will drop in the next time they appear on the board (set by processEvents, read once by the CardSlot that shows them).
const arrivalDrops = new Map<string, { delay: number }>();
// Called by a slot when a dropped card touches down (App draws the dust and starts the hops).
let arrivalListener: ((slotId: string, card: CardData) => void) | null = null;

const CardSlot = ({
  onClick, onInfoClick, card, isSelected = false,
  isAttacking = false, isImpactingTarget = false, isImpactingAttacker = false, attackDirection = 'up', hint, rowRoleHint,
  isValidAttackTarget = false, isInvalidAttackTarget = false, slotId,
  isMoverSelected = false, isValidMoveTarget = false, hasMoved = false,
  isTacticDragTarget = false, tacticTag,
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
  rowRoleHint?: RowRoleHint,
  // True for every occupied slot a selected targetable Tática could legally land
  // on (see getCardDropKind/isTacticTargetSlot) — an equip/buff aimed at your own
  // board, or a damage Tática aimed at the enemy's. The empty-slot 'place' case
  // already has its own hint prop.
  isTacticDragTarget?: boolean,
  // The word shown on a valid target of the Tática being dragged (see tacticTagFor).
  tacticTag?: { text: string; color: string },
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
}) => {
  const hintsBoard = useGameSettings().hintsBoard;
  const attackY = attackDirection === 'up' ? -150 : 150;

  // Drop-in arrival (see arrivalDrops): decided once per card that appears in this slot.
  const arrivalRef = useRef<{ id: string; delay: number; rot: number } | null>(null);
  if (card && arrivalRef.current?.id !== card.id) {
    const a = arrivalDrops.get(card.id);
    arrivalRef.current = { id: card.id, delay: a ? a.delay : -1, rot: (Math.random() - 0.5) * 22 };
  }
  const arrival = card && arrivalRef.current && arrivalRef.current.delay >= 0 ? arrivalRef.current : null;
  useEffect(() => {
    if (!card || !arrival) return;
    arrivalDrops.delete(card.id);
    const t = window.setTimeout(() => { if (slotId) arrivalListener?.(slotId, card); }, (arrival.delay + 0.4) * 1000);
    return () => window.clearTimeout(t);
  }, [card?.id]);

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
      // A General losing HP is the whole win condition, so it gets the heavier
      // plated-hit cue instead of the plain one every other unit takes.
      if (card.cardType === 'General') playGeneralDamageSfx(); else playDamageSfx();
    }
    prevCardIdRef.current = card?.id;
    prevHpRef.current = card?.hp;
  }, [card?.id, card?.hp]);
  useEffect(() => {
    if (!damageFlash) return;
    const t = window.setTimeout(() => setDamageFlash(null), 900);
    return () => clearTimeout(t);
  }, [damageFlash]);
  // A card actually dying — same "isDestroyed flips true" moment the destroy
  // animation below reacts to, tracked with its own ref since it's a boolean
  // transition rather than the value comparison prevHpRef does for damage.
  const prevIsDestroyedRef = useRef(false);
  useEffect(() => {
    if (card?.isDestroyed && !prevIsDestroyedRef.current) playDestroySfx();
    prevIsDestroyedRef.current = !!card?.isDestroyed;
  }, [card?.isDestroyed]);

  // A valid placement slot's whole border/glow now carries the combat/support
  // color (amber/sky — same as the corner badge below) instead of a uniform
  // green, whenever that distinction actually applies (rowRoleHint set) — reading
  // it off the WHOLE slot instead of a small corner icon is what the player asked
  // for: "isso tem que ficar claro no tabuleiro," not just technically present.
  const hintClass = hint === 'invalid'
    ? 'border-red-500/60 bg-red-950/30'
    : hint === 'valid'
      ? rowRoleHint === 'attack'
        ? 'border-amber-400/80 bg-amber-500/15 shadow-[0_0_28px_rgba(245,158,11,0.6)]'
        : rowRoleHint
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
      className={`w-[7.5rem] h-[9.5rem] md:w-[9.5rem] md:h-[12.5rem] rounded-lg bg-transparent flex items-center justify-center transition-colors group relative ${card && !card.isDestroyed ? '' : 'border-[3px] border-[#e8dcc0]/35 hover:border-[#e8dcc0]/70 hover:bg-[#e8dcc0]/10 hover:shadow-[0_0_25px_rgba(232,220,192,0.45)]'} ${onClick ? 'cursor-pointer pointer-events-auto' : ''} ${!card ? hintClass : ''} ${isInvalidAttackTarget ? 'opacity-40 saturate-50' : ''} ${!card && isValidMoveTarget ? 'ring-4 ring-sky-300/80 shadow-[0_0_22px_rgba(125,211,252,0.6)]' : ''} ${hasMoved && card ? 'opacity-60 saturate-[.6]' : ''}`}
    >
      {!card && hint && (
        // Placement hint on every legal empty slot at once while a hand card is tap-selected (see getPlayerSlotHint):
        // a red X where it cannot go; where a soldier can go, the same sword / shield art as the stat effects plus a
        // short word (ATACA, RESERVA, PROTEGIDA); a plain green arrow for the Relíquia / Terreno slots.
        <>
          {hint === 'invalid' ? (
            <X className="w-8 h-8 md:w-10 md:h-10 text-red-500/80 pointer-events-none" strokeWidth={3} />
          ) : rowRoleHint ? (
            <>
              <motion.img
                src={ROW_ROLE_VIEW[rowRoleHint].icon}
                alt={ROW_ROLE_VIEW[rowRoleHint].alt}
                animate={{ y: [0, -5, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute left-1/2 top-[8%] -translate-x-1/2 w-[72%] h-auto object-contain pointer-events-none ${
                  rowRoleHint === 'attack' ? 'drop-shadow-[0_0_14px_rgba(245,158,11,0.9)]' : 'drop-shadow-[0_0_14px_rgba(14,165,233,0.9)]'
                }`}
              />
              {hintsBoard && <div
                className="absolute inset-x-0 bottom-[7%] text-center leading-none pointer-events-none"
                style={{ fontFamily: "'Cinzel', serif", color: rowRoleHint === 'attack' ? '#ffd36a' : '#8fd4ff', textShadow: '0 1px 2px #000, 0 0 6px #000' }}
              >
                <b className="block font-extrabold tracking-[0.03em]" style={{ fontSize: ROW_ROLE_VIEW[rowRoleHint].size }}>{ROW_ROLE_VIEW[rowRoleHint].label}</b>
              </div>}
            </>
          ) : (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none"
            >
              <ArrowUp className="w-8 h-8 md:w-10 md:h-10 pointer-events-none text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" strokeWidth={3} />
            </motion.div>
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
      {isTacticDragTarget && tacticTag && hintsBoard && (
        <div className="absolute inset-x-0 bottom-[6%] z-30 flex justify-center pointer-events-none">
          <span className="px-2 rounded-md font-extrabold leading-tight whitespace-nowrap"
            style={{ fontFamily: "'Cinzel', serif", fontSize: 21, color: tacticTag.color, background: 'rgba(12,8,4,0.86)', border: `2px solid ${tacticTag.color}`, textShadow: '0 1px 2px #000', boxShadow: `0 0 14px ${tacticTag.color}aa` }}>
            {tacticTag.text}
          </span>
        </div>
      )}
      {card && !card.isDestroyed && (
        <motion.div
          key={`arrive-${card.id}`}
          className="w-full h-full"
          style={{ position: 'relative', zIndex: arrival ? 40 : undefined }}
          initial={arrival ? { y: -230, scale: 1.45, rotate: arrival.rot, opacity: 0 } : false}
          animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
          transition={arrival ? {
            delay: arrival.delay,
            y: { type: 'spring', stiffness: 190, damping: 12.5, mass: 1 },
            scale: { type: 'spring', stiffness: 210, damping: 14 },
            rotate: { type: 'spring', stiffness: 150, damping: 11 },
            opacity: { duration: 0.1, delay: arrival.delay },
          } : { duration: 0 }}
        >
        <motion.div
          key={card.id}
          // (A card that arrives on its own is dropped in by the wrapper above — see arrival; one that came with
          // its own flight just appears where it landed.)
          // Opponent cards used to render rotated 180° (as if laid out facing them,
          // across the table) — per the user's explicit ask, EVERY card on the board
          // now reads upright from the player's own side, opponent's included, since
          // being able to actually read the enemy's ATK/HP/effect text at a glance
          // matters more than the "laid out facing them" physical-table conceit.
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{
            opacity: 1,
            // Hearthstone-style wind-up: the attacker pulls back a little FIRST
            // (opposite direction, small distance) before rushing the rest of the
            // way to the target — reads as the card gathering momentum instead of
            // just teleporting to its lunge position. A full-art card landing
            // elsewhere on the board makes this one flinch (see shockActive).
            y: isAttacking
              ? [0, attackY > 0 ? -ATTACK_WINDUP_PX : ATTACK_WINDUP_PX, attackY]
              : isImpactingTarget
                // the defender is knocked back, away from whoever hit it, and settles
                ? [0, attackDirection === 'up' ? 12 : -12, 0]
                : 0,
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
            scale: isImpactingAttacker ? 1.32 : isAttacking ? [1, 0.93, 1.2] : isImpactingTarget ? 0.95 : 1,
            // Physical landing weight (see justLanded above) — a squash-and-settle
            // on just the vertical axis, like the card actually has mass hitting the
            // table, instead of the plain uniform scale-in every card used to get.
            // Left undefined the rest of the time so it just follows `scale` above.
            scaleY: justLanded ? [0.55, 1.18, 0.92, 1.03, 1] : isImpactingAttacker ? 0.9 : isImpactingTarget ? 0.88 : isAttacking ? 1.08 : 1,
            // Stretch on the way in, squash on contact (volume stays put, so it reads as weight).
            scaleX: isImpactingAttacker ? 1.08 : isImpactingTarget ? 1.09 : isAttacking ? 0.96 : 1,
            // the card that takes the blow is thrown off-axis for a moment and rights itself
            rotate: isAttacking
              // pulls back leaning one way, then the card comes in turned so a corner leads the blow
              ? [0, attackDirection === 'up' ? ATTACK_TILT_DEG * 0.5 : -ATTACK_TILT_DEG * 0.5, attackDirection === 'up' ? -ATTACK_TILT_DEG : ATTACK_TILT_DEG]
              : isImpactingTarget ? [0, attackDirection === 'up' ? -5 : 5, 2, 0] : 0,
            rotateX: isAttacking ? (attackDirection === 'up' ? 20 : -20) : 0,
          }}
          transition={{
            duration: isAttacking ? ATTACK_MS / 1000 : 0.2,
            times: isAttacking ? [0, ATTACK_WINDUP_FRAC, 1] : undefined,
            scale: isAttacking && !isImpactingAttacker
              ? { duration: ATTACK_MS / 1000, times: [0, ATTACK_WINDUP_FRAC, 1], ease: ['easeOut', 'easeIn'] }
              : { type: "spring", stiffness: 400, damping: 15 },
            scaleY: justLanded ? { duration: 0.38, ease: "easeOut", times: [0, 0.35, 0.6, 0.85, 1] } : { type: "spring", stiffness: 520, damping: 16 },
            scaleX: { type: "spring", stiffness: 520, damping: 16 },
            rotate: isAttacking && !isImpactingAttacker
              ? { duration: ATTACK_MS / 1000, times: [0, ATTACK_WINDUP_FRAC, 1], ease: ['easeOut', 'easeIn'] }
              : isImpactingTarget ? { duration: 0.3, ease: "easeOut", times: [0, 0.3, 0.65, 1] } : { duration: 0.2 },
            // ease-out into the pull-back, ease-in into the strike: it accelerates all the way to the hit
            y: isAttacking ? { duration: ATTACK_MS / 1000, times: [0, ATTACK_WINDUP_FRAC, 1], ease: ['easeOut', 'easeIn'] } : isImpactingTarget ? { duration: 0.3, ease: "easeOut", times: [0, 0.35, 1] } : undefined,
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
          {isImpactingAttacker && <SlashEffect />}

          {/* (the floating damage number is drawn by the global FloatNumber layer; damageFlash here only drives the shake) */}

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
          {(card.block || (card.shield ?? 0) > 0) && <ShieldAura kind={card.block ? 'block' : 'shield'} value={card.block ? undefined : card.shield} />}
          {/* Permanent marks: a card whose ATK or HP is above what is printed on it (equipment, buffs) wears the matching icon over that stat */}
          {slotId && /-\d$/.test(slotId) && (() => {
            const def = getCardDef(card.name);
            if (!def || card.cardType === 'General') return null;
            const atkNow = card.atk + (card.pendingCombatBonus?.atk ?? 0) + (card.formationBuffAtk ?? 0);
            return (
              <>
                {atkNow > def.atk && <img src={uiEffectAtkUpStill} alt="" aria-hidden draggable={false} className="absolute pointer-events-none select-none" style={{ left: '0%', bottom: '21%', width: '40%', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.85))', zIndex: 6 }} />}
                {card.hp > def.hp && <img src={uiEffectHpUpStill} alt="" aria-hidden draggable={false} className="absolute pointer-events-none select-none" style={{ right: '0%', bottom: '21%', width: '40%', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.85))', zIndex: 6 }} />}
              </>
            );
          })()}
        </motion.div>
        </motion.div>
      )}
      {card && card.isDestroyed && (
        <>
          {/* The card itself burning away — now the actual CardFace (same mini
              component the live card renders, see just above), not a flat beige
              placeholder with the raw art image pasted in. Reads as THIS exact
              card breaking apart instead of a generic dying rectangle, and no
              longer goes blank for cards with no art file yet (see DECK_CAPITAO,
              still art: '' everywhere) since it isn't just an <img> tag anymore. */}
          <BurningCard>
            {card.isFullArt ? <CardFaceFullArtMini card={card} /> : <CardFaceStandardMini card={card} />}
          </BurningCard>
        </>
      )}
    </motion.div>
  );
};

