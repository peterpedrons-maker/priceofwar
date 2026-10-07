<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (10721 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:244 · DRAW_FLIGHT_MS:270 · sfxVol:279 · playCardDrawSfx:280 · playCardPlaySfx:294 · playAttackSfx:301 · playEffectSfx:303 · playTacticSfx:304 · playSelectSfx:312 · bannerAudioCtx:324 · playBannerSfx:325 · playUiClickSfx:368 · playCardLiftSfx:377 · playDamageSfx:389 · playGeneralDamageSfx:394 · playDestroySfx:404 · playRevealGeneralSfx:406 · playBatalhaBannerSfx:411 · playBatalhaImpactSfx:419 · CardType:425 · CardData:427 · StatTone:473 · STAT_TONE_COLOR:474 · STAT_TONE_GRADIENT:475 · statsOf:480 · SlotHint:489 · getSlotHint:498 · RowRoleHint:504 · SOLDIER_CARD_TYPES:505 · getRowRoleHint:506 · ROW_ROLE_VIEW:513 · PHASE_BANNER_TEXT:537 · BATALHA_FALL_MS:559 · BATALHA_IMPACT_FRACTION:560 · PHASE_BANNER_STAGE_MS:562 · PHASE_BANNER_DURATION_MS:563 · PHASE_BANNER_Y:571 · PHASE_BANNER_MOTION:572 · HIT_STOP_MS:583 · ATTACK_MS:586 · ATTACK_WINDUP_FRAC:587 · ATTACK_WINDUP_PX:588 · ATTACK_TILT_DEG:589 · IMPACT_MS:590 · TIME:593 · rangedKindOf:595 · FINAL_SLOW:596 · FINAL_INTRO_MS:597 · FINAL_FREEZE_MS:598 · FINAL_AFTER_MS:599 · SLASH_SPARK_ANGLES:602 · SlashEffect:611 · TargetKind:649 · TARGET_STYLE:650 · HUD_CARD_SCALE:656 · AmountBadge:660 · TargetingHud:677 · READY_COLORS:747 · SILHOUETTES:752 · silhouetteFor:757 · TriggerIcon:767 · FLIGHT_MS:783 · HELD_SCALE:784 · HELD_GAP:785 · ImpactFx:786 · TriggerBurst:829 · TriggerFloatLayer:850 · AbilityReadyGlow:867 · TutRect:898 · tutPct:899 · tutSilBox:900 · tutElRect:909 · tutPad:910 · tutUnion:911 · TutResolved:916 · TUT_EMPTY:917 · visibleHandCards:918 · resolveTutTarget:919 · TutorialStage:966 · SpriteOnce:1010 · EffectIcon:1027 · EFFECT_ICONS:1028 · SpriteIcon:1036 · IconPop:1041 · SHIELD_SHEETS:1056 · GOLD_BUBBLE:1062 · ShieldAura:1063 · ShieldFxOnce:1083 · EquipFxLayer:1097 · PUNCH_FRAMES:1143 · PUNCH_FRAME_W:1144 · PunchFx:1146 · BURN_FRAMES:1182 · BurningCard:1184 · GraveyardPile:1234 · AtkBadge:1260 · NUMBER_KIND_OF:1272 · NUMBER_TIERS:1277 · damageTier:1283 · floatLife:1284 · FloatNumber:1285 · HpBadge:1333 · GoldBadge:1362 · GoldNumber:1391 · CardBack:1451 · CARD_THICKNESS_SHADOW:1489 · cardBoxShadow:1500 · cardGlowFilter:1501 · CARD_FACE_VARIANTS:1511 · NO_STAT_TYPES:1528 · templateForType:1529 · templateForTypeMini:1534 · FitText:1553 · KeywordPill:1628 · STAT_TOKEN:1642 · STAT_NUMBER_STYLE:1643 · StatSymbol:1644 · DamageSymbol:1651 · renderEffectText:1662 · FitEffectText:1681 · FULL_ART_PLATE_VARIANTS:1745 · FULL_ART_SIZE_FIX:1755 · CardFaceFullArt:1756 · FullArtMiniConfig:1877 · FULL_ART_MINI_CONFIG:1882 · usesLightBar:1910 · nameTextStyle:1911 · FULL_ART_MINI_DEFAULT:1914 · fullArtMiniConfigForType:1919 · CardFaceFullArtMini:1934 · CARD_FACE_MINI_STD_SCALE:1983 · CardFaceStandardMini:1984 · CardFace:2047 · BOARD_EXTERIOR_ART_URL:2159 · FIELD_PREVIEW_SCALE:2164 · BOARD_PREVIEW_SCALE:2182 · FAN_SPREAD_DEG:2185 · FAN_LIFT_PX:2186 · HAND_CARD_WIDTH:2187 · HAND_CARD_HEIGHT:2188 · HAND_CARD_STEP:2191 · HAND_FULL_SPREAD_COUNT:2194 · HAND_SELECT_SCALE:2197 · handStepFor:2198 · ART_BY_NAME:2205 · cardDataFromName:2258 · buildDeckCards:2262 · DECK_CAPITAO:2270 · DECK_CARDEAL:2271 · DECKS:2275 · BOOSTER_POOLS:2293 · DECK_STORE_KEY:2308 · CARD_INSTANCES_BY_NAME:2310 · cardByName:2318 · isGeneralName:2319 · DeckSlot:2321 · DeckStore:2322 · DeckSelection:2324 · OnlineMatch:2330 · needsServer:2362 · visibleKey:2373 · countByName:2378 · CAPITAO_STARTER_NAME:2384 · buildStarterStore:2387 · sameCards:2406 · ensureStarterDecks:2410 · sanitizeDeckStore:2431 · loadDeckStore:2455 · cloudUserId:2469 · pushTimer:2470 · pushing:2471 · pushAgain:2472 · toCloudDecks:2473 · runPush:2474 · saveDeckStore:2487 · stopCloudSync:2492 · flushCloudSync:2494 · syncDeckStoreWithCloud:2505 · deckCardCount:2533 · deckProblem:2535 · buildDeckSelection:2541 · DEFAULT_DECK_SELECTION:2547 · PlayerProfile:2556 · AVATAR_OPTIONS:2571 · avatarById:2579 · PROFILE_STORAGE_KEY:2581 · DEFAULT_PROFILE:2582 · loadProfile:2595 · formatCoroas:2609 · saveProfile:2614 · MODE_LABELS_PT:2623 · AvatarBadge:2633 · WINDOW_FRAME_PX:2653 · WINDOW_FONT_DECO:2654 · FramedWindow:2656 · WindowOverlay:2681 · WindowDivider:2704 · WindowTitle:2712 · Edges:2730 · ArtFrame:2731 · VLine:2752 · HLine:2755 · ArtChip:2760 · WindowOption:2775 · WindowText:2783 · WindowButton:2787 · AvatarPickerModal:2802 · ALLOW_PROFILE_RENAME:2839 · ProfileBar:2840 · ComingSoonModal:2961 · ONLINE_MODES:2977 · OnlineModeModal:2981 · TapPhase:3019 · MENU_CONFIRM_MS:3020 · useMenuTap:3021 · PlaqueSparks:3045 · PLAQUE_ASPECT:3064 · PLAQUE_CAP_CQW:3065 · MenuCard:3066 · MenuIconButton:3115 · MainMenu:3146 · InstallPrompt:3274 · DeckPickerModal:3310 · CARD_TYPE_ORDER:3341 · DeckSide:3342 · EditorSort:3343 · EDITOR_SORTS:3344 · EDITOR_MARGIN:3345 · EDITOR_FRAME:3346 · EDITOR_PAD:3347 · LIST_COLS:3350 · ROW_H:3351 · FULL_ART_TILE_SCALE:3352 · DeckEditor:3354 · ShopPhase:3972 · NpcMood:3973 · BoosterDef:3974 · BOOSTERS:3976 · TEST_FREE_BOOSTERS:3983 · SHELF_ROWS:3984 · SHELF_COLS:3985 · BOOSTER_ASPECT:3986 · SHELF_X0:3991 · SHELF_X1:3992 · SHELF_PLANKS:3993 · SHELF_OVERVIEW:3994 · SHELF_CLOSEUP:3995 · NPC_LINES:3997 · SHOP_ART:4005 · rollBooster:4013 · BoosterArt:4028 · NpcArt:4040 · PACK_TEAR_Y:4047 · LID_SLICES:4048 · LidSlice:4054 · PackTear:4077 · PulledCard:4146 · pullBooster:4147 · PackOpening:4160 · OpenBoosterFromTable:4239 · ShopScreen:4245 · AuthBackdrop:4485 · GoogleMark:4505 · DiscordMark:4508 · AuthButton:4514 · authFieldClass:4524 · LoginScreen:4526 · NAME_RULE:4587 · ProfileSetupScreen:4589 · VolumeRow:4655 · ToggleRow:4669 · OptionsModal:4681 · SettingsModal:4710 · playCoinSfx:4747 · COIN_THICK:4775 · CoinFace:4776 · CoinRim:4785 · RemotePick:4804 · CoinToss:4805 · MatchSearchOverlay:4887 · OnlineSearchOverlay:4920 · LoadingScreen:4989 · App:5043 · IMMEDIATE_ZONE_LABEL:10259 · DragFinger:10264 · GuideInfo:10281 · DragGuide:10282 · arrivalDrops:10349 · arrivalListener:10351 · CardSlot:10353

Dentro de `App` (linhas 5043–10258), funções internas:
openCardPicker:5297 · spawnFloatingNumber:5333 · spawnFloatingNumberAtId:5348 · showBanner:5374 · announcePhase:5393 · announceTurnChange:5401 · beginFinalBlow:5434 · endFinalBlow:5435 · blowIsSoaked:5438 · handleInstallClick:5516 · shieldOverSlot:5572 · popOverSlot:5581 · burstAt:5596 · whenGlowDone:5621 · endGlow:5622 · startTriggerFx:5626 · holdForSeat:5654 · fireImpactBurst:5690 · noteDragPlay:5717 · handFanMaxAngleRad:5787 · getHandArrivalPoint:5886 · getFanRotation:5906 · getFanLift:5913 · computeDrawOrigin:5928 · showToast:5943 · announceCardPlay:5949 · toCardData:6023 · shownStats:6038 · boardView:6049 · syncView:6054 · processEvents:6085 · fxRectOf:6290 · fxEnvFor:6296 · planFx:6306 · commitState:6326 · dispatchAction:6348 · wakeWaiter:6367 · publishClock:6368 · dispatchOnline:6370 · reconcileOwn:6406 · applyUnasked:6420 · ingestRows:6434 · chooseFirstOnline:6462 · absorbAct:6475 · refuseOwn:6484 · sendOnline:6496 · stopOnline:6510 · startOnlinePolling:6525 · nextOpponentAction:6543 · applyRewardToProfile:6570 · openPlayerPick:6577 · playerAct:6604 · endTurnNow:6616 · sleep:6634 · tutCurrent:6646 · tutCanBack:6650 · tutShow:6655 · tutGo:6671 · tutNext:6679 · tutBack:6693 · tutMatches:6698 · tutSignal:6710 · tutFromAction:6715 · tutBeat:6722 · tutExit:6729 · tutFinish:6736 · startTutorial:6737 · tutLaunchDuel:6742 · tutCoinResolved:6744 · settleAmbush:6801 · startMatchIntro:6834 · continueMatchIntro:6853 · resetGame:6945 · startGame:6998 · startOnlineMatch:7005 · leaveMatch:7045 · handleCardClick:7374 · handlePlayCardButtonClick:7434 · abilityStepCandidates:7502 · abilityHasTargets:7505 · getPlayerCreatureAbilityKind:7527 · getCardVisualEl:7541 · triggerPunch:7626 · renderTravelingArrow:7664 · playPendingTactic:7691 · resolveOwnTacticTarget:7698 · resolveEnemyTacticTarget:7703 · toggleCardPickerSelection:7711 · abilityOf:7725 · nextAbilityStep:7727 · activateAbility:7733 · abilityStepSide:7747 · resolveAbilityTarget:7753 · pushAbilityPrompt:7790 · mine:7811 · foes:7812 · effectTargetKind:7815 · specSlots:7817 · tacticTargeting:7831 · sourceAt:7838 · cancelTargeting:7856 · playHandCardOnTarget:7859 · heldTop:7866 · slotUnder:7867 · clearDragOver:7876 · dragBlockReason:7878 · tapHandCard:7890 · beginPress:7898 · returnHeld:7915 · dropHeldCard:7924 · updateHeld:7953 · dropOk:7972 · handleSlotClick:8028 · handleNpcSlotClick:8208 · handleBackgroundClick:8274 · getTappedCardShift:8305 · getSelectedCardX:8315 · getSelectedCardY:8337 · getBoardAnimation:8361 · getPlayerSlotHint:8402 · isTacticTargetSlot:8421 · tacticTagFor:8429 · shakePx:8492 · boardHeightMultiplier:8505 · boardTopMargin:8506

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/CardViewer3D.tsx  (175 linhas)
Visualizador 3D de carta (three.js, carregado sob demanda); também a página ?3d.

Viewer3DCard:8 · EMBED:11 · FILES:12 · urlOf:13 · W:16 · roundedShape:18 · BACK_SX:27 · backGeometry:28 · CardViewer3D:32

## src/CollectionRoom.tsx  (499 linhas)
Sala de Coleção: o quarto em imagem única com objetos tocáveis (livro, porta, estante de boosters, mesa/deck), câmera com zoom e o fichário (Binder).

CardViewer3D:12 · THUMBS:13 · thumbOf:14 · SW:16 · PER:17 · BOOK_W:18 · clamp:19 · wait:20 · GOLD:21 · SPOTS:24 · SpotKey:30 · Plaque:33 · BookTitle:48 · SHELF_ROWS:60 · shelfSlot:61 · Entry:66 · RoomPack:68 · CollectionRoom:69 · NS:226 · SS:227 · BEND:228 · Rect:229 · Phase:230 · Binder:232 · PACK_ASPECT:488 · SheenDriver:491

## src/combatFx.ts  (468 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

FxSide:24 · FxRect:25 · FxTarget:26 · FxEnv:28 · cv:36 · ctx:37 · RES:38 · fxs:39 · IMG:40 · SRC:41 · readyP:42 · preloadCombatFx:43 · resize:47 · ensureCanvas:48 · R:57 · clamp:58 · eo:59 · at:60 · add:61 · wait:62 · tick:64 · loop:75 · kick:79 · URLS:82 · play:83 · whoosh:84 · pick:87 · FS:94 · sprite:95 · explosion:102 · holy:110 · flash:113 · shock:117 · scorch:124 · puff:128 · dust:134 · debris:137 · sparks:146 · softAngle:153 · fly:164 · arcTangent:203 · stick:204 · ring:210 · burst:213 · sparksDir:218 · glint:225 · cleanHit:232 · lanceFade:236 · thunk:237 · rockBreak:243 · setScale:256 · pt:257 · tacticSpot:259 · tacPoint:264 · landTactic:267 · leaveTactic:282 · weaponReveal:285 · once:312 · fxTactic:316 · fxHero:382 · fxRanged:415

## src/engine/ai.ts  (644 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:297 · aiLegacyAction:300 · holdValue:413 · attackPotential:416 · sideValue:429 · evalState:443 · sortedDesc:457 · forSearch:460 · candidates:470 · lastPhaseOf:541 · fingerprint:544 · Line:553 · SEARCH:555 · settle:558 · planTurn:569 · memo:610 · answerPending:612 · aiNextAction:630

## src/engine/catalog.ts  (277 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:155 · DeckRecipe:157 · DECK_RECIPES:159 · BALANCE:227 · STARTER_TRIM:239 · starterDeckCards:240 · LEGACY_STARTERS:248 · BY_NAME:260 · getCardDef:263 · requireCardDef:264 · isGeneralName:269 · TOKEN_DEFS:273

## src/engine/deck.ts  (29 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_MAX_COPIES:7 · deckCardCount:9 · deckProblem:14

## src/engine/game.ts  (986 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:148 · setWinner:165 · soak:174 · grantShield:186 · grantBlock:192 · damageSlot:200 · healSlot:216 · startTurn:225 · runTurnEnd:273 · endTurn:293 · assertCanAct:303 · Fx:314 · uniqueByName:321 · matchesFilter:322 · filterLabel:324 · specCandidates:327 · checkTarget:331 · activeTargets:349 · validateTargets:353 · checkVerb:360 · checkVerbTarget:374 · openPick:378 · runVerb:385 · runAbilities:524 · grantMovedBuff:530 · playCard:540 · useAbility:602 · choose:642 · attack:698 · respondAmbush:724 · resolveAmbushEffect:741 · resolveCombat:774 · move:851 · advance:884 · discardExcess:906 · clone:923 · applyAction:925 · MatchLog:965 · newMatchLog:972 · replayMatch:975

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (237 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · GOLD_PER_TURN:11 · GOLD_FROM_ROUND:12 · COMBAT_FROM_ROUND:14 · HAND_LIMIT:15 · Unit:19 · Board:24 · phasesForTurn:27 · AUTOMATIC_PHASES:33 · restingPhasesForTurn:34 · abilitiesOf:39 · passivesOf:40 · abilityOn:41 · verbsOn:42 · hasVerb:43 · abilityPhases:46 · specCandidatesOn:49 · targetSpecsOf:64 · playTargetSpecs:65 · targetSpecOf:67 · needsHiddenInfo:71 · reinforceShield:76 · canReinforce:80 · AuraStat:83 · rowOk:84 · whoMatches:85 · auraTotal:95 · boardHasFlag:117 · canPlayInPhase:122 · isFrontline:126 · isBackline:127 · isUnitSlot:128 · getLaneCol:129 · getMoveRow:134 · getMoveCol:135 · areSlotsAdjacent:137 · adjacentSlots:141 · canReposition:145 · SOLDIER_TYPES:152 · CardDropKind:154 · getCardDropKind:157 · canPlaceInSlot:169 · isAliveAt:178 · isCardDamaged:180 · getAuraCombatHpBonus:183 · blocksAmbush:185 · locksGeneralOnDamage:187 · getMaxAttacksPerTurn:189 · getEffectiveAtk:193 · getIncomingDamageReduction:200 · getValidAttackTargets:204 · withEquippedWeapons:235

## src/engine/types.ts  (323 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:43 · Verb:47 · AbilityOn:83 · Ability:96 · Who:106 · Passive:116 · CardDef:126 · Card:145 · SLOT_COUNT:174 · GENERAL_SLOT:175 · RELIC_SLOT:176 · TERRAIN_SLOT:177 · PlayerState:179 · TurnState:198 · PickMode:216 · Pending:219 · GameState:253 · Action:264 · GameEvent:287 · ActionResult:320

## src/engine/view.ts  (66 linhas)
O que cada jogador pode ver (esconde mão e baralho do outro).

hiddenCard:6 · redactPlayer:8 · redactFor:16 · redactEvents:30 · mirrorSeats:42 · mirrorEvents:58 · viewFor:64 · eventsFor:65

## src/gameSettings.ts  (27 linhas)
Opções do jogador (avisos de arrastar/tabuleiro), hook useGameSettings.

GameSettings:5 · KEY:9 · DEFAULTS:10 · load:11 · state:17 · listeners:18 · getGameSettings:19 · subscribeSettings:20 · setGameSettings:21 · useGameSettings:26

## src/main.tsx  (31 linhas)
Ponto de entrada do React.

CardViewer3D:10 · Viewer3DPage:11 · only3d:16

## src/numberGlyphs.ts  (16 linhas)
Imagens dos números (ATK/HP/dano) usadas nas cartas.

NumberKind:3 · files:5 · NAME:6 · glyphUrl:8 · burstUrl:9 · NUMBER_GLOW:12

## src/services/auth.ts  (130 linhas)
Login (convidado, Google, Discord, e-mail) via Supabase.

AuthProvider:9 · Session:10 · OAuthProvider:11 · URL:13 · KEY:14 · authMode:15 · LOCAL_SESSION_KEY:17 · clientPromise:19 · client:20 · getClient:29 · fromUser:31 · readLocal:36 · writeLocal:39 · localListeners:42 · emitLocal:43 · remoteListeners:46 · announceRemote:47 · getSession:49 · onSessionChange:56 · authErrorText:70 · signInOAuth:83 · signInEmail:90 · signInGuest:105 · authErrorDetail:120 · signOut:126

## src/services/cloud.ts  (95 linhas)
Salvar/ler coleção e decks na nuvem.

CloudProfile:5 · CloudResult:6 · COLUMNS:8 · fail:10 · fetchProfile:22 · usernameAvailable:30 · createProfile:38 · updateProfileFields:46 · CloudDeck:55 · CloudStore:56 · fetchStore:58 · pushStore:75

## src/services/online.ts  (102 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:31 · QueueResult:51 · ActResult:56 · call:61 · asActResult:78 · queueForMatch:83 · queueStatus:84 · cancelQueue:85 · sendAction:86 · tickMatch:88 · fetchResult:89 · fetchViews:95

## src/sfx.ts  (75 linhas)
Efeitos sonoros curtos por Web Audio.

ctx:6 · buffers:7 · loading:8 · debugOn:10 · dbgMark:12 · getCtx:14 · preloadSfx:17 · playSfx:25 · playSfxAt:44 · playWhoosh:60

## src/triggers.ts  (41 linhas)
Ícones/nomes dos gatilhos (Convocação, Ofensiva, ...).

TRIGGER_ICON:13 · TRIGGER_GLOW:20 · triggerKeyOf:22 · triggerOf:25 · pulsing:32 · listeners:33 · emit:34 · pulseCard:35 · usePulse:39

## src/TurnTracker.tsx  (143 linhas)
Marcador de turno/fases na tela da partida.

TRACKER_PHASES:11 · MEDALLION_X:13 · BAND_TOP:15 · TRACKER_NAMES:17 · PALETTE:21 · PLATE_W:28 · END_W:30 · trackerScale:31 · useTrackerScale:32 · Props:42 · TurnTracker:60

## src/tutorial/script.ts  (240 linhas)
Dados do tutorial 1: partida fixa, jogadas do treinador, passos e falas.

TutorialMeta:8 · TUTORIALS:9 · Expr:16 · NPC_NAME:17 · Tgt:20 · Until:27 · Step:36 · CHAPTERS:54 · HAND_P:57 · PILE_P:58 · HAND_E:59 · PILE_E:60 · uid:62 · fresh:63 · createTutorialMatch:69 · EnemyMove:80 · ADV:81 · ENEMY_SCRIPT:82 · nextEnemyAction:88 · PlayerMove:99 · PLAYER_PATH:100 · G:108 · E:109 · row:110 · TRACKER:111 · GOLD_ME:112 · GOLD_FOE:113 · INTRO_LINES:116 · COIN_STEP:123 · STEPS:125 · R:193 · BEATS:194 · OUTRO:207 · playTutorialForTest:213

## src/tutorial/ui.tsx  (266 linhas)
Peças visuais do tutorial: Aldric, mãozinha, escurecimento com buracos, lista.

NPC_ART:13 · npcArt:14 · GLYPH:15 · FONT_HEAD:17 · FONT_BODY:18 · NpcPortrait:20 · NpcPhoto:52 · PanelProps:78 · NpcPanel:88 · TapHand:136 · Hole:148 · roundedRectUri:154 · Spotlight:157 · DONE_KEY:193 · loadTutorialsDone:194 · markTutorialDone:195 · TutorialList:197 · TutorialIntro:234

## src/ui/ThinFrame.tsx  (48 linhas)
Moldura fina reutilizável.

ThinFrame:8 · GameBox:29 · TONES:33 · TEXT:34 · GameButton:36

## server/edge.ts  (33 linhas)
Entrada da Edge Function (gerada em supabase/functions/game).

cors:10 · json:15

## server/handler.ts  (357 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:16 · defaultConfig:28 · MatchInit:30 · GameRequest:55 · GameResponse:63 · BOT_PROFILE:70 · STALE_MATCH_MS:71 · BOT_STEP_LIMIT:72 · AUTO_STEP_LIMIT:73 · recipeDeck:75 · botDeckFor:77 · playerOf:78 · userOfSeat:79 · moverOf:80 · moverKey:81 · Work:86 · startWork:95 · applyStep:98 · runBot:121 · patchOf:132 · ensureRewards:139 · rewardOf:159 · enforceClock:164 · openMatch:202 · viewRowsOf:209 · initOf:211 · startMatch:226 · finishIfStale:252 · handleGame:262

## server/memoryDb.ts  (80 linhas)
Banco em memória (testes).

MemoryTables:5 · clone:10 · MemoryDb:12

## server/supabaseDb.ts  (90 linhas)
Banco no Supabase.

Client:7 · must:9 · viewToDb:14 · viewFromDb:17 · matchFromDb:18 · supabaseDb:20

## server/types.ts  (90 linhas)
Tipos do servidor e do banco.

DeckJson:6 · QueueRow:8 · StepRow:15 · ViewRow:23 · EndReason:34 · RewardRow:36 · MatchRow:48 · MatchPatch:67 · Db:69

## tests/ai-arena.ts  (39 linhas)
IA nova contra a antiga.

N:9 · D:10 · planWins:11 · byDeck:12

## tests/balance-comeback.ts  (32 linhas)
Mede viradas (comeback) a partir dos resultados do laboratório.

G:5 · games:6 · afterRound:7 · trailed:21

## tests/balance-lab.ts  (114 linhas)
LABORATÓRIO de balanceamento: joga muitas partidas IA × IA, com patches "e se" (docs/balanceamento.md).

Patch:21 · Per:22 · GameRecord:24 · applyPatch:26 · bump:48 · playGame:50 · main:89

## tests/balance-matchup.ts  (32 linhas)
Teste rápido Cardeal × Capitão.

N:9 · cardealWins:14

## tests/balance-report.ts  (130 linhas)
Transforma os resultados do laboratório em uma página (relatório lado a lado).

Per:5 · G:6 · Lab:7 · load:9 · mean:10 · se:11 · summarize:13 · base:51 · detail:52 · variants:53 · html:54 · BASE:77 · pct:78 · summary:79 · deckTable:87 · changes:106 · compare:114 · h:123

## tests/balance-rules-preload.ts  (7 linhas)
Passa as regras do patch (ouro, início do combate) ao motor antes de ele carregar.

## tests/engine-rules.ts  (1089 linhas)
Um cenário por regra do jogo (npm test).

passed:11 · test:12 · eq:15 · ok:18 · n:21 · mk:22 · fresh:27 · put:38 · give:39 · act:40 · refused:45 · names:50 · combat:51 · ambushSetup:360 · shielded:646 · aiTurn:707 · atkOf:885 · endTurnOf:886

## tests/engine-sim.ts  (185 linhas)
Partidas IA × IA com invariantes, repetição determinística e fuzz (npm test).

failures:13 · usage:14 · tactics:15 · discards:16 · check:17 · allCards:19 · invariants:27 · play:47 · decks:80 · finished:81 · winsByDeck:82 · rnd:111 · R:112 · accepted:113

## tests/mock-supabase.ts  (119 linhas)
Supabase falso para os testes online.

Row:10 · tables:11 · memory:12 · cfg:13 · b64:18 · users:19 · cors:20 · send:26 · readBody:30 · uidFrom:33

## tests/online-server.ts  (388 linhas)
Testes do servidor online (npm test).

passed:12 · test:13 · ok:16 · eq:17 · clock:19 · rngState:20 · cfg:21 · fresh:26 · deckOf:37 · matched:43 · userOf:45 · choose:47 · botMatch:49 · pvp:56 · drive:64

## tests/raw-stats.ts  (3 linhas)
Faz os testes de regras usarem os atributos base (ignora BALANCE).

## tests/tutorial-script.ts  (18 linhas)
Joga o tutorial inteiro e confere que o jogador vence no 4º turno (npm test).

fail:6 · r:7 · s:10 · ids:13

## tools/card3d/list-cards.ts  (5 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

## tools/gen-code-map.ts  (79 linhas)
Gera este arquivo.

FILE_NOTES:6 · ROOTS:52 · files:53 · walk:54 · DECL:58 · NESTED:59 · out:60
