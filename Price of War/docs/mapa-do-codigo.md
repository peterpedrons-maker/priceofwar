<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (10572 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:239 · DRAW_FLIGHT_MS:265 · sfxVol:274 · playCardDrawSfx:275 · playCardPlaySfx:289 · playAttackSfx:296 · playEffectSfx:298 · playTacticSfx:299 · playSelectSfx:307 · bannerAudioCtx:319 · playBannerSfx:320 · playUiClickSfx:363 · playCardLiftSfx:372 · playDamageSfx:384 · playGeneralDamageSfx:389 · playDestroySfx:399 · playRevealGeneralSfx:401 · playBatalhaBannerSfx:406 · playBatalhaImpactSfx:414 · CardType:420 · CardData:422 · StatTone:468 · STAT_TONE_COLOR:469 · STAT_TONE_GRADIENT:470 · statsOf:475 · SlotHint:484 · getSlotHint:493 · RowRoleHint:499 · SOLDIER_CARD_TYPES:500 · getRowRoleHint:501 · ROW_ROLE_VIEW:508 · PHASE_BANNER_TEXT:532 · BATALHA_FALL_MS:554 · BATALHA_IMPACT_FRACTION:555 · PHASE_BANNER_STAGE_MS:557 · PHASE_BANNER_DURATION_MS:558 · PHASE_BANNER_Y:566 · PHASE_BANNER_MOTION:567 · HIT_STOP_MS:578 · ATTACK_MS:581 · ATTACK_WINDUP_FRAC:582 · ATTACK_WINDUP_PX:583 · ATTACK_TILT_DEG:584 · IMPACT_MS:585 · SLASH_SPARK_ANGLES:588 · SlashEffect:597 · TargetKind:635 · TARGET_STYLE:636 · HUD_CARD_SCALE:642 · AmountBadge:646 · TargetingHud:663 · READY_COLORS:733 · SILHOUETTES:738 · silhouetteFor:743 · TriggerIcon:753 · FLIGHT_MS:769 · HELD_SCALE:770 · HELD_GAP:771 · ImpactFx:772 · TriggerBurst:815 · TriggerFloatLayer:836 · AbilityReadyGlow:853 · TutRect:884 · tutPct:885 · tutSilBox:886 · tutElRect:895 · tutPad:896 · tutUnion:897 · TutResolved:902 · TUT_EMPTY:903 · visibleHandCards:904 · resolveTutTarget:905 · TutorialStage:952 · SpriteOnce:996 · EffectIcon:1013 · EFFECT_ICONS:1014 · SpriteIcon:1022 · IconPop:1027 · SHIELD_SHEETS:1042 · GOLD_BUBBLE:1048 · ShieldAura:1049 · ShieldFxOnce:1069 · EquipFxLayer:1083 · PUNCH_FRAMES:1129 · PUNCH_FRAME_W:1130 · PunchFx:1132 · BURN_FRAMES:1167 · BurningCard:1169 · GraveyardPile:1218 · AtkBadge:1244 · NUMBER_KIND_OF:1256 · FloatNumber:1259 · HpBadge:1301 · GoldBadge:1330 · GoldNumber:1359 · CardBack:1419 · CARD_THICKNESS_SHADOW:1457 · cardBoxShadow:1468 · cardGlowFilter:1469 · CARD_FACE_VARIANTS:1479 · NO_STAT_TYPES:1496 · templateForType:1497 · templateForTypeMini:1502 · FitText:1521 · KeywordPill:1596 · STAT_TOKEN:1610 · STAT_NUMBER_STYLE:1611 · StatSymbol:1612 · DamageSymbol:1619 · renderEffectText:1630 · FitEffectText:1649 · FULL_ART_PLATE_VARIANTS:1713 · FULL_ART_SIZE_FIX:1723 · CardFaceFullArt:1724 · FullArtMiniConfig:1845 · FULL_ART_MINI_CONFIG:1850 · usesLightBar:1878 · nameTextStyle:1879 · FULL_ART_MINI_DEFAULT:1882 · fullArtMiniConfigForType:1887 · CardFaceFullArtMini:1902 · CARD_FACE_MINI_STD_SCALE:1951 · CardFaceStandardMini:1952 · CardFace:2015 · BOARD_EXTERIOR_ART_URL:2127 · FIELD_PREVIEW_SCALE:2132 · BOARD_PREVIEW_SCALE:2150 · FAN_SPREAD_DEG:2153 · FAN_LIFT_PX:2154 · HAND_CARD_WIDTH:2155 · HAND_CARD_HEIGHT:2156 · HAND_CARD_STEP:2159 · HAND_FULL_SPREAD_COUNT:2162 · HAND_SELECT_SCALE:2165 · handStepFor:2166 · ART_BY_NAME:2173 · cardDataFromName:2226 · buildDeckCards:2230 · DECK_CAPITAO:2238 · DECK_CARDEAL:2239 · DECKS:2243 · BOOSTER_POOLS:2261 · DECK_STORE_KEY:2276 · CARD_INSTANCES_BY_NAME:2278 · cardByName:2286 · isGeneralName:2287 · DeckSlot:2289 · DeckStore:2290 · DeckSelection:2292 · OnlineMatch:2298 · needsServer:2330 · visibleKey:2341 · countByName:2346 · CAPITAO_STARTER_NAME:2352 · buildStarterStore:2355 · sameCards:2374 · ensureStarterDecks:2378 · sanitizeDeckStore:2399 · loadDeckStore:2423 · cloudUserId:2437 · pushTimer:2438 · pushing:2439 · pushAgain:2440 · toCloudDecks:2441 · runPush:2442 · saveDeckStore:2455 · stopCloudSync:2460 · flushCloudSync:2462 · syncDeckStoreWithCloud:2473 · deckCardCount:2501 · deckProblem:2503 · buildDeckSelection:2509 · DEFAULT_DECK_SELECTION:2515 · PlayerProfile:2524 · AVATAR_OPTIONS:2539 · avatarById:2547 · PROFILE_STORAGE_KEY:2549 · DEFAULT_PROFILE:2550 · loadProfile:2563 · formatCoroas:2577 · saveProfile:2582 · MODE_LABELS_PT:2591 · AvatarBadge:2601 · WINDOW_FRAME_PX:2621 · WINDOW_FONT_DECO:2622 · FramedWindow:2624 · WindowOverlay:2649 · WindowDivider:2672 · WindowTitle:2680 · Edges:2698 · ArtFrame:2699 · VLine:2720 · HLine:2723 · ArtChip:2728 · WindowOption:2743 · WindowText:2751 · WindowButton:2755 · AvatarPickerModal:2770 · ALLOW_PROFILE_RENAME:2807 · ProfileBar:2808 · ComingSoonModal:2929 · ONLINE_MODES:2945 · OnlineModeModal:2949 · TapPhase:2987 · MENU_CONFIRM_MS:2988 · useMenuTap:2989 · FrameSparks:3016 · MenuCard:3041 · MenuIconButton:3100 · MainMenu:3131 · InstallPrompt:3302 · DeckPickerModal:3338 · CARD_TYPE_ORDER:3369 · DeckSide:3370 · EditorSort:3371 · EDITOR_SORTS:3372 · EDITOR_MARGIN:3373 · EDITOR_FRAME:3374 · EDITOR_PAD:3375 · LIST_COLS:3378 · ROW_H:3379 · FULL_ART_TILE_SCALE:3380 · DeckEditor:3382 · ShopPhase:4000 · NpcMood:4001 · BoosterDef:4002 · BOOSTERS:4004 · TEST_FREE_BOOSTERS:4011 · SHELF_ROWS:4012 · SHELF_COLS:4013 · BOOSTER_ASPECT:4014 · SHELF_X0:4019 · SHELF_X1:4020 · SHELF_PLANKS:4021 · SHELF_OVERVIEW:4022 · SHELF_CLOSEUP:4023 · NPC_LINES:4025 · SHOP_ART:4033 · rollBooster:4041 · BoosterArt:4056 · NpcArt:4068 · PACK_TEAR_Y:4075 · LID_SLICES:4076 · LidSlice:4082 · PackTear:4105 · PulledCard:4174 · pullBooster:4175 · PackOpening:4188 · OpenBoosterFromTable:4267 · ShopScreen:4273 · AuthBackdrop:4513 · GoogleMark:4533 · DiscordMark:4536 · AuthButton:4542 · authFieldClass:4552 · LoginScreen:4554 · NAME_RULE:4615 · ProfileSetupScreen:4617 · VolumeRow:4683 · ToggleRow:4697 · OptionsModal:4709 · SettingsModal:4738 · playCoinSfx:4775 · COIN_THICK:4803 · CoinFace:4804 · CoinRim:4813 · RemotePick:4832 · CoinToss:4833 · MatchSearchOverlay:4915 · OnlineSearchOverlay:4948 · LoadingScreen:5017 · App:5071 · IMMEDIATE_ZONE_LABEL:10110 · DragFinger:10115 · GuideInfo:10132 · DragGuide:10133 · arrivalDrops:10200 · arrivalListener:10202 · CardSlot:10204

Dentro de `App` (linhas 5071–10109), funções internas:
openCardPicker:5294 · spawnFloatingNumber:5330 · spawnFloatingNumberAtId:5345 · showBanner:5371 · announcePhase:5390 · announceTurnChange:5398 · blowIsSoaked:5423 · handleInstallClick:5501 · shieldOverSlot:5557 · popOverSlot:5566 · burstAt:5581 · whenGlowDone:5606 · endGlow:5607 · startTriggerFx:5611 · holdForSeat:5639 · fireImpactBurst:5675 · noteDragPlay:5702 · handFanMaxAngleRad:5772 · getHandArrivalPoint:5869 · getFanRotation:5889 · getFanLift:5896 · computeDrawOrigin:5911 · showToast:5926 · announceCardPlay:5932 · toCardData:6006 · shownStats:6021 · boardView:6032 · syncView:6037 · processEvents:6068 · commitState:6254 · dispatchAction:6260 · wakeWaiter:6278 · publishClock:6279 · dispatchOnline:6281 · reconcileOwn:6317 · applyUnasked:6331 · ingestRows:6345 · chooseFirstOnline:6373 · absorbAct:6386 · refuseOwn:6395 · sendOnline:6407 · stopOnline:6421 · startOnlinePolling:6436 · nextOpponentAction:6454 · applyRewardToProfile:6481 · openPlayerPick:6488 · playerAct:6515 · endTurnNow:6527 · sleep:6545 · tutCurrent:6557 · tutCanBack:6561 · tutShow:6566 · tutGo:6582 · tutNext:6590 · tutBack:6604 · tutMatches:6609 · tutSignal:6621 · tutFromAction:6626 · tutBeat:6633 · tutExit:6640 · tutFinish:6647 · startTutorial:6648 · tutLaunchDuel:6653 · tutCoinResolved:6655 · settleAmbush:6712 · startMatchIntro:6745 · continueMatchIntro:6764 · resetGame:6856 · startGame:6908 · startOnlineMatch:6915 · leaveMatch:6955 · handleCardClick:7269 · handlePlayCardButtonClick:7329 · abilityStepCandidates:7397 · abilityHasTargets:7400 · getPlayerCreatureAbilityKind:7422 · getCardVisualEl:7436 · triggerPunch:7521 · renderTravelingArrow:7559 · playPendingTactic:7586 · resolveOwnTacticTarget:7593 · resolveEnemyTacticTarget:7598 · toggleCardPickerSelection:7606 · abilityOf:7620 · nextAbilityStep:7622 · activateAbility:7628 · abilityStepSide:7642 · resolveAbilityTarget:7648 · pushAbilityPrompt:7685 · mine:7706 · foes:7707 · effectTargetKind:7710 · specSlots:7712 · tacticTargeting:7726 · sourceAt:7733 · cancelTargeting:7751 · playHandCardOnTarget:7754 · heldTop:7761 · slotUnder:7762 · clearDragOver:7771 · dragBlockReason:7773 · tapHandCard:7785 · beginPress:7793 · returnHeld:7810 · dropHeldCard:7819 · updateHeld:7848 · dropOk:7867 · handleSlotClick:7923 · handleNpcSlotClick:8103 · handleBackgroundClick:8154 · getTappedCardShift:8185 · getSelectedCardX:8195 · getSelectedCardY:8217 · getBoardAnimation:8241 · getPlayerSlotHint:8282 · isTacticTargetSlot:8301 · tacticTagFor:8309 · shakePx:8372 · boardHeightMultiplier:8385 · boardTopMargin:8386

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/CardViewer3D.tsx  (175 linhas)
Visualizador 3D de carta (three.js, carregado sob demanda); também a página ?3d.

Viewer3DCard:8 · EMBED:11 · FILES:12 · urlOf:13 · W:16 · roundedShape:18 · BACK_SX:27 · backGeometry:28 · CardViewer3D:32

## src/CollectionRoom.tsx  (523 linhas)
Sala de Coleção: o quarto em imagem única com objetos tocáveis (livro, porta, estante de boosters, mesa/deck), câmera com zoom e o fichário (Binder).

CardViewer3D:12 · THUMBS:13 · thumbOf:14 · SW:16 · PER:17 · BOOK_W:18 · clamp:19 · wait:20 · GOLD:21 · SPOTS:24 · SpotKey:30 · Plaque:33 · BookTitle:48 · SHELF_ROWS:60 · shelfSlot:61 · Entry:66 · RoomPack:68 · CollectionRoom:69 · NS:250 · SS:251 · BEND:252 · Rect:253 · Phase:254 · Binder:256 · PACK_ASPECT:512 · SheenDriver:515

## src/engine/ai.ts  (644 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:297 · aiLegacyAction:300 · holdValue:413 · attackPotential:416 · sideValue:429 · evalState:443 · sortedDesc:457 · forSearch:460 · candidates:470 · lastPhaseOf:541 · fingerprint:544 · Line:553 · SEARCH:555 · settle:558 · planTurn:569 · memo:610 · answerPending:612 · aiNextAction:630

## src/engine/catalog.ts  (277 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:155 · DeckRecipe:157 · DECK_RECIPES:159 · BALANCE:227 · STARTER_TRIM:239 · starterDeckCards:240 · LEGACY_STARTERS:248 · BY_NAME:260 · getCardDef:263 · requireCardDef:264 · isGeneralName:269 · TOKEN_DEFS:273

## src/engine/deck.ts  (29 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_MAX_COPIES:7 · deckCardCount:9 · deckProblem:14

## src/engine/game.ts  (982 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:148 · setWinner:165 · soak:174 · grantShield:186 · grantBlock:192 · damageSlot:200 · healSlot:216 · startTurn:225 · runTurnEnd:273 · endTurn:293 · assertCanAct:303 · Fx:314 · uniqueByName:321 · matchesFilter:322 · filterLabel:324 · specCandidates:327 · checkTarget:331 · activeTargets:349 · validateTargets:353 · checkVerb:360 · checkVerbTarget:374 · openPick:378 · runVerb:385 · runAbilities:524 · grantMovedBuff:530 · playCard:540 · useAbility:602 · choose:642 · attack:694 · respondAmbush:720 · resolveAmbushEffect:737 · resolveCombat:770 · move:847 · advance:880 · discardExcess:902 · clone:919 · applyAction:921 · MatchLog:961 · newMatchLog:968 · replayMatch:971

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (237 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · GOLD_PER_TURN:11 · GOLD_FROM_ROUND:12 · COMBAT_FROM_ROUND:14 · HAND_LIMIT:15 · Unit:19 · Board:24 · phasesForTurn:27 · AUTOMATIC_PHASES:33 · restingPhasesForTurn:34 · abilitiesOf:39 · passivesOf:40 · abilityOn:41 · verbsOn:42 · hasVerb:43 · abilityPhases:46 · specCandidatesOn:49 · targetSpecsOf:64 · playTargetSpecs:65 · targetSpecOf:67 · needsHiddenInfo:71 · reinforceShield:76 · canReinforce:80 · AuraStat:83 · rowOk:84 · whoMatches:85 · auraTotal:95 · boardHasFlag:117 · canPlayInPhase:122 · isFrontline:126 · isBackline:127 · isUnitSlot:128 · getLaneCol:129 · getMoveRow:134 · getMoveCol:135 · areSlotsAdjacent:137 · adjacentSlots:141 · canReposition:145 · SOLDIER_TYPES:152 · CardDropKind:154 · getCardDropKind:157 · canPlaceInSlot:169 · isAliveAt:178 · isCardDamaged:180 · getAuraCombatHpBonus:183 · blocksAmbush:185 · locksGeneralOnDamage:187 · getMaxAttacksPerTurn:189 · getEffectiveAtk:193 · getIncomingDamageReduction:200 · getValidAttackTargets:204 · withEquippedWeapons:235

## src/engine/types.ts  (321 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:43 · Verb:47 · AbilityOn:83 · Ability:96 · Who:106 · Passive:116 · CardDef:126 · Card:145 · SLOT_COUNT:174 · GENERAL_SLOT:175 · RELIC_SLOT:176 · TERRAIN_SLOT:177 · PlayerState:179 · TurnState:198 · PickMode:216 · Pending:219 · GameState:251 · Action:262 · GameEvent:285 · ActionResult:318

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

## src/sfx.ts  (41 linhas)
Efeitos sonoros curtos por Web Audio.

ctx:6 · buffers:7 · loading:8 · debugOn:10 · dbgMark:12 · getCtx:14 · preloadSfx:17 · playSfx:25

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

## tests/engine-rules.ts  (1085 linhas)
Um cenário por regra do jogo (npm test).

passed:11 · test:12 · eq:15 · ok:18 · n:21 · mk:22 · fresh:27 · put:38 · give:39 · act:40 · refused:45 · names:50 · combat:51 · ambushSetup:360 · shielded:642 · aiTurn:703 · atkOf:881 · endTurnOf:882

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
