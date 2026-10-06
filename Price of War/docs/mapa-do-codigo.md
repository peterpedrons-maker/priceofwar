<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (10546 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:243 · DRAW_FLIGHT_MS:269 · sfxVol:278 · playCardDrawSfx:279 · playCardPlaySfx:293 · playAttackSfx:300 · playEffectSfx:302 · playTacticSfx:303 · playSelectSfx:311 · bannerAudioCtx:323 · playBannerSfx:324 · playUiClickSfx:367 · playCardLiftSfx:376 · playDamageSfx:388 · playGeneralDamageSfx:393 · playDestroySfx:403 · playRevealGeneralSfx:405 · playBatalhaBannerSfx:410 · playBatalhaImpactSfx:418 · CardType:424 · CardData:426 · StatTone:472 · STAT_TONE_COLOR:473 · STAT_TONE_GRADIENT:474 · statsOf:479 · SlotHint:488 · getSlotHint:497 · RowRoleHint:503 · SOLDIER_CARD_TYPES:504 · getRowRoleHint:505 · ROW_ROLE_VIEW:512 · PHASE_BANNER_TEXT:536 · BATALHA_FALL_MS:558 · BATALHA_IMPACT_FRACTION:559 · PHASE_BANNER_STAGE_MS:561 · PHASE_BANNER_DURATION_MS:562 · PHASE_BANNER_Y:570 · PHASE_BANNER_MOTION:571 · HIT_STOP_MS:582 · ATTACK_MS:585 · ATTACK_WINDUP_FRAC:586 · ATTACK_WINDUP_PX:587 · ATTACK_TILT_DEG:588 · IMPACT_MS:589 · SLASH_SPARK_ANGLES:592 · SlashEffect:601 · TargetKind:639 · TARGET_STYLE:640 · HUD_CARD_SCALE:646 · AmountBadge:650 · TargetingHud:667 · READY_COLORS:737 · SILHOUETTES:742 · silhouetteFor:747 · TriggerIcon:757 · FLIGHT_MS:773 · HELD_SCALE:774 · HELD_GAP:775 · ImpactFx:776 · TriggerBurst:819 · TriggerFloatLayer:840 · AbilityReadyGlow:857 · TutRect:888 · tutPct:889 · tutSilBox:890 · tutElRect:899 · tutPad:900 · tutUnion:901 · TutResolved:906 · TUT_EMPTY:907 · visibleHandCards:908 · resolveTutTarget:909 · TutorialStage:956 · SpriteOnce:1000 · EffectIcon:1017 · EFFECT_ICONS:1018 · SpriteIcon:1026 · IconPop:1031 · SHIELD_SHEETS:1046 · GOLD_BUBBLE:1052 · ShieldAura:1053 · ShieldFxOnce:1073 · EquipFxLayer:1087 · PUNCH_FRAMES:1133 · PUNCH_FRAME_W:1134 · PunchFx:1136 · BURN_FRAMES:1171 · BurningCard:1173 · GraveyardPile:1222 · AtkBadge:1248 · NUMBER_KIND_OF:1260 · FloatNumber:1263 · HpBadge:1305 · GoldBadge:1334 · GoldNumber:1363 · CardBack:1423 · CARD_THICKNESS_SHADOW:1461 · cardBoxShadow:1472 · cardGlowFilter:1473 · CARD_FACE_VARIANTS:1483 · NO_STAT_TYPES:1500 · templateForType:1501 · templateForTypeMini:1506 · FitText:1525 · KeywordPill:1600 · STAT_TOKEN:1614 · STAT_NUMBER_STYLE:1615 · StatSymbol:1616 · DamageSymbol:1623 · renderEffectText:1634 · FitEffectText:1653 · FULL_ART_PLATE_VARIANTS:1717 · FULL_ART_SIZE_FIX:1727 · CardFaceFullArt:1728 · FullArtMiniConfig:1849 · FULL_ART_MINI_CONFIG:1854 · usesLightBar:1882 · nameTextStyle:1883 · FULL_ART_MINI_DEFAULT:1886 · fullArtMiniConfigForType:1891 · CardFaceFullArtMini:1906 · CARD_FACE_MINI_STD_SCALE:1955 · CardFaceStandardMini:1956 · CardFace:2019 · BOARD_EXTERIOR_ART_URL:2131 · FIELD_PREVIEW_SCALE:2136 · BOARD_PREVIEW_SCALE:2154 · FAN_SPREAD_DEG:2157 · FAN_LIFT_PX:2158 · HAND_CARD_WIDTH:2159 · HAND_CARD_HEIGHT:2160 · HAND_CARD_STEP:2163 · HAND_FULL_SPREAD_COUNT:2166 · HAND_SELECT_SCALE:2169 · handStepFor:2170 · ART_BY_NAME:2177 · cardDataFromName:2230 · buildDeckCards:2234 · DECK_CAPITAO:2242 · DECK_CARDEAL:2243 · DECKS:2247 · BOOSTER_POOLS:2265 · DECK_STORE_KEY:2280 · CARD_INSTANCES_BY_NAME:2282 · cardByName:2290 · isGeneralName:2291 · DeckSlot:2293 · DeckStore:2294 · DeckSelection:2296 · OnlineMatch:2302 · needsServer:2334 · visibleKey:2345 · countByName:2350 · CAPITAO_STARTER_NAME:2356 · buildStarterStore:2359 · sameCards:2378 · ensureStarterDecks:2382 · sanitizeDeckStore:2403 · loadDeckStore:2427 · cloudUserId:2441 · pushTimer:2442 · pushing:2443 · pushAgain:2444 · toCloudDecks:2445 · runPush:2446 · saveDeckStore:2459 · stopCloudSync:2464 · flushCloudSync:2466 · syncDeckStoreWithCloud:2477 · deckCardCount:2505 · deckProblem:2507 · buildDeckSelection:2513 · DEFAULT_DECK_SELECTION:2519 · PlayerProfile:2528 · AVATAR_OPTIONS:2543 · avatarById:2551 · PROFILE_STORAGE_KEY:2553 · DEFAULT_PROFILE:2554 · loadProfile:2567 · formatCoroas:2581 · saveProfile:2586 · MODE_LABELS_PT:2595 · AvatarBadge:2605 · WINDOW_FRAME_PX:2625 · WINDOW_FONT_DECO:2626 · FramedWindow:2628 · WindowOverlay:2653 · WindowDivider:2676 · WindowTitle:2684 · Edges:2702 · ArtFrame:2703 · VLine:2724 · HLine:2727 · ArtChip:2732 · WindowOption:2747 · WindowText:2755 · WindowButton:2759 · AvatarPickerModal:2774 · ALLOW_PROFILE_RENAME:2811 · ProfileBar:2812 · ComingSoonModal:2933 · ONLINE_MODES:2949 · OnlineModeModal:2953 · TapPhase:2991 · MENU_CONFIRM_MS:2992 · useMenuTap:2993 · PlaqueSparks:3017 · PLAQUE_ASPECT:3036 · PLAQUE_CAP_CQW:3037 · MenuCard:3038 · MenuIconButton:3087 · MainMenu:3118 · InstallPrompt:3246 · DeckPickerModal:3282 · CARD_TYPE_ORDER:3313 · DeckSide:3314 · EditorSort:3315 · EDITOR_SORTS:3316 · EDITOR_MARGIN:3317 · EDITOR_FRAME:3318 · EDITOR_PAD:3319 · LIST_COLS:3322 · ROW_H:3323 · FULL_ART_TILE_SCALE:3324 · DeckEditor:3326 · ShopPhase:3944 · NpcMood:3945 · BoosterDef:3946 · BOOSTERS:3948 · TEST_FREE_BOOSTERS:3955 · SHELF_ROWS:3956 · SHELF_COLS:3957 · BOOSTER_ASPECT:3958 · SHELF_X0:3963 · SHELF_X1:3964 · SHELF_PLANKS:3965 · SHELF_OVERVIEW:3966 · SHELF_CLOSEUP:3967 · NPC_LINES:3969 · SHOP_ART:3977 · rollBooster:3985 · BoosterArt:4000 · NpcArt:4012 · PACK_TEAR_Y:4019 · LID_SLICES:4020 · LidSlice:4026 · PackTear:4049 · PulledCard:4118 · pullBooster:4119 · PackOpening:4132 · OpenBoosterFromTable:4211 · ShopScreen:4217 · AuthBackdrop:4457 · GoogleMark:4477 · DiscordMark:4480 · AuthButton:4486 · authFieldClass:4496 · LoginScreen:4498 · NAME_RULE:4559 · ProfileSetupScreen:4561 · VolumeRow:4627 · ToggleRow:4641 · OptionsModal:4653 · SettingsModal:4682 · playCoinSfx:4719 · COIN_THICK:4747 · CoinFace:4748 · CoinRim:4757 · RemotePick:4776 · CoinToss:4777 · MatchSearchOverlay:4859 · OnlineSearchOverlay:4892 · LoadingScreen:4961 · App:5015 · IMMEDIATE_ZONE_LABEL:10084 · DragFinger:10089 · GuideInfo:10106 · DragGuide:10107 · arrivalDrops:10174 · arrivalListener:10176 · CardSlot:10178

Dentro de `App` (linhas 5015–10083), funções internas:
openCardPicker:5268 · spawnFloatingNumber:5304 · spawnFloatingNumberAtId:5319 · showBanner:5345 · announcePhase:5364 · announceTurnChange:5372 · blowIsSoaked:5397 · handleInstallClick:5475 · shieldOverSlot:5531 · popOverSlot:5540 · burstAt:5555 · whenGlowDone:5580 · endGlow:5581 · startTriggerFx:5585 · holdForSeat:5613 · fireImpactBurst:5649 · noteDragPlay:5676 · handFanMaxAngleRad:5746 · getHandArrivalPoint:5843 · getFanRotation:5863 · getFanLift:5870 · computeDrawOrigin:5885 · showToast:5900 · announceCardPlay:5906 · toCardData:5980 · shownStats:5995 · boardView:6006 · syncView:6011 · processEvents:6042 · commitState:6228 · dispatchAction:6234 · wakeWaiter:6252 · publishClock:6253 · dispatchOnline:6255 · reconcileOwn:6291 · applyUnasked:6305 · ingestRows:6319 · chooseFirstOnline:6347 · absorbAct:6360 · refuseOwn:6369 · sendOnline:6381 · stopOnline:6395 · startOnlinePolling:6410 · nextOpponentAction:6428 · applyRewardToProfile:6455 · openPlayerPick:6462 · playerAct:6489 · endTurnNow:6501 · sleep:6519 · tutCurrent:6531 · tutCanBack:6535 · tutShow:6540 · tutGo:6556 · tutNext:6564 · tutBack:6578 · tutMatches:6583 · tutSignal:6595 · tutFromAction:6600 · tutBeat:6607 · tutExit:6614 · tutFinish:6621 · startTutorial:6622 · tutLaunchDuel:6627 · tutCoinResolved:6629 · settleAmbush:6686 · startMatchIntro:6719 · continueMatchIntro:6738 · resetGame:6830 · startGame:6882 · startOnlineMatch:6889 · leaveMatch:6929 · handleCardClick:7243 · handlePlayCardButtonClick:7303 · abilityStepCandidates:7371 · abilityHasTargets:7374 · getPlayerCreatureAbilityKind:7396 · getCardVisualEl:7410 · triggerPunch:7495 · renderTravelingArrow:7533 · playPendingTactic:7560 · resolveOwnTacticTarget:7567 · resolveEnemyTacticTarget:7572 · toggleCardPickerSelection:7580 · abilityOf:7594 · nextAbilityStep:7596 · activateAbility:7602 · abilityStepSide:7616 · resolveAbilityTarget:7622 · pushAbilityPrompt:7659 · mine:7680 · foes:7681 · effectTargetKind:7684 · specSlots:7686 · tacticTargeting:7700 · sourceAt:7707 · cancelTargeting:7725 · playHandCardOnTarget:7728 · heldTop:7735 · slotUnder:7736 · clearDragOver:7745 · dragBlockReason:7747 · tapHandCard:7759 · beginPress:7767 · returnHeld:7784 · dropHeldCard:7793 · updateHeld:7822 · dropOk:7841 · handleSlotClick:7897 · handleNpcSlotClick:8077 · handleBackgroundClick:8128 · getTappedCardShift:8159 · getSelectedCardX:8169 · getSelectedCardY:8191 · getBoardAnimation:8215 · getPlayerSlotHint:8256 · isTacticTargetSlot:8275 · tacticTagFor:8283 · shakePx:8346 · boardHeightMultiplier:8359 · boardTopMargin:8360

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
