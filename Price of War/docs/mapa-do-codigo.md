<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (10602 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:243 · DRAW_FLIGHT_MS:269 · sfxVol:278 · playCardDrawSfx:279 · playCardPlaySfx:293 · playAttackSfx:300 · playEffectSfx:302 · playTacticSfx:303 · playSelectSfx:311 · bannerAudioCtx:323 · playBannerSfx:324 · playUiClickSfx:367 · playCardLiftSfx:376 · playDamageSfx:388 · playGeneralDamageSfx:393 · playDestroySfx:403 · playRevealGeneralSfx:405 · playBatalhaBannerSfx:410 · playBatalhaImpactSfx:418 · CardType:424 · CardData:426 · StatTone:472 · STAT_TONE_COLOR:473 · STAT_TONE_GRADIENT:474 · statsOf:479 · SlotHint:488 · getSlotHint:497 · RowRoleHint:503 · SOLDIER_CARD_TYPES:504 · getRowRoleHint:505 · ROW_ROLE_VIEW:512 · PHASE_BANNER_TEXT:536 · BATALHA_FALL_MS:558 · BATALHA_IMPACT_FRACTION:559 · PHASE_BANNER_STAGE_MS:561 · PHASE_BANNER_DURATION_MS:562 · PHASE_BANNER_Y:570 · PHASE_BANNER_MOTION:571 · HIT_STOP_MS:582 · ATTACK_MS:585 · ATTACK_WINDUP_FRAC:586 · ATTACK_WINDUP_PX:587 · ATTACK_TILT_DEG:588 · IMPACT_MS:589 · TIME:592 · FINAL_SLOW:593 · FINAL_INTRO_MS:594 · FINAL_FREEZE_MS:595 · FINAL_AFTER_MS:596 · SLASH_SPARK_ANGLES:599 · SlashEffect:608 · TargetKind:646 · TARGET_STYLE:647 · HUD_CARD_SCALE:653 · AmountBadge:657 · TargetingHud:674 · READY_COLORS:744 · SILHOUETTES:749 · silhouetteFor:754 · TriggerIcon:764 · FLIGHT_MS:780 · HELD_SCALE:781 · HELD_GAP:782 · ImpactFx:783 · TriggerBurst:826 · TriggerFloatLayer:847 · AbilityReadyGlow:864 · TutRect:895 · tutPct:896 · tutSilBox:897 · tutElRect:906 · tutPad:907 · tutUnion:908 · TutResolved:913 · TUT_EMPTY:914 · visibleHandCards:915 · resolveTutTarget:916 · TutorialStage:963 · SpriteOnce:1007 · EffectIcon:1024 · EFFECT_ICONS:1025 · SpriteIcon:1033 · IconPop:1038 · SHIELD_SHEETS:1053 · GOLD_BUBBLE:1059 · ShieldAura:1060 · ShieldFxOnce:1080 · EquipFxLayer:1094 · PUNCH_FRAMES:1140 · PUNCH_FRAME_W:1141 · PunchFx:1143 · BURN_FRAMES:1179 · BurningCard:1181 · GraveyardPile:1231 · AtkBadge:1257 · NUMBER_KIND_OF:1269 · NUMBER_TIERS:1274 · damageTier:1280 · floatLife:1281 · FloatNumber:1282 · HpBadge:1331 · GoldBadge:1360 · GoldNumber:1389 · CardBack:1449 · CARD_THICKNESS_SHADOW:1487 · cardBoxShadow:1498 · cardGlowFilter:1499 · CARD_FACE_VARIANTS:1509 · NO_STAT_TYPES:1526 · templateForType:1527 · templateForTypeMini:1532 · FitText:1551 · KeywordPill:1626 · STAT_TOKEN:1640 · STAT_NUMBER_STYLE:1641 · StatSymbol:1642 · DamageSymbol:1649 · renderEffectText:1660 · FitEffectText:1679 · FULL_ART_PLATE_VARIANTS:1743 · FULL_ART_SIZE_FIX:1753 · CardFaceFullArt:1754 · FullArtMiniConfig:1875 · FULL_ART_MINI_CONFIG:1880 · usesLightBar:1908 · nameTextStyle:1909 · FULL_ART_MINI_DEFAULT:1912 · fullArtMiniConfigForType:1917 · CardFaceFullArtMini:1932 · CARD_FACE_MINI_STD_SCALE:1981 · CardFaceStandardMini:1982 · CardFace:2045 · BOARD_EXTERIOR_ART_URL:2157 · FIELD_PREVIEW_SCALE:2162 · BOARD_PREVIEW_SCALE:2180 · FAN_SPREAD_DEG:2183 · FAN_LIFT_PX:2184 · HAND_CARD_WIDTH:2185 · HAND_CARD_HEIGHT:2186 · HAND_CARD_STEP:2189 · HAND_FULL_SPREAD_COUNT:2192 · HAND_SELECT_SCALE:2195 · handStepFor:2196 · ART_BY_NAME:2203 · cardDataFromName:2256 · buildDeckCards:2260 · DECK_CAPITAO:2268 · DECK_CARDEAL:2269 · DECKS:2273 · BOOSTER_POOLS:2291 · DECK_STORE_KEY:2306 · CARD_INSTANCES_BY_NAME:2308 · cardByName:2316 · isGeneralName:2317 · DeckSlot:2319 · DeckStore:2320 · DeckSelection:2322 · OnlineMatch:2328 · needsServer:2360 · visibleKey:2371 · countByName:2376 · CAPITAO_STARTER_NAME:2382 · buildStarterStore:2385 · sameCards:2404 · ensureStarterDecks:2408 · sanitizeDeckStore:2429 · loadDeckStore:2453 · cloudUserId:2467 · pushTimer:2468 · pushing:2469 · pushAgain:2470 · toCloudDecks:2471 · runPush:2472 · saveDeckStore:2485 · stopCloudSync:2490 · flushCloudSync:2492 · syncDeckStoreWithCloud:2503 · deckCardCount:2531 · deckProblem:2533 · buildDeckSelection:2539 · DEFAULT_DECK_SELECTION:2545 · PlayerProfile:2554 · AVATAR_OPTIONS:2569 · avatarById:2577 · PROFILE_STORAGE_KEY:2579 · DEFAULT_PROFILE:2580 · loadProfile:2593 · formatCoroas:2607 · saveProfile:2612 · MODE_LABELS_PT:2621 · AvatarBadge:2631 · WINDOW_FRAME_PX:2651 · WINDOW_FONT_DECO:2652 · FramedWindow:2654 · WindowOverlay:2679 · WindowDivider:2702 · WindowTitle:2710 · Edges:2728 · ArtFrame:2729 · VLine:2750 · HLine:2753 · ArtChip:2758 · WindowOption:2773 · WindowText:2781 · WindowButton:2785 · AvatarPickerModal:2800 · ALLOW_PROFILE_RENAME:2837 · ProfileBar:2838 · ComingSoonModal:2959 · ONLINE_MODES:2975 · OnlineModeModal:2979 · TapPhase:3017 · MENU_CONFIRM_MS:3018 · useMenuTap:3019 · PlaqueSparks:3043 · PLAQUE_ASPECT:3062 · PLAQUE_CAP_CQW:3063 · MenuCard:3064 · MenuIconButton:3113 · MainMenu:3144 · InstallPrompt:3272 · DeckPickerModal:3308 · CARD_TYPE_ORDER:3339 · DeckSide:3340 · EditorSort:3341 · EDITOR_SORTS:3342 · EDITOR_MARGIN:3343 · EDITOR_FRAME:3344 · EDITOR_PAD:3345 · LIST_COLS:3348 · ROW_H:3349 · FULL_ART_TILE_SCALE:3350 · DeckEditor:3352 · ShopPhase:3970 · NpcMood:3971 · BoosterDef:3972 · BOOSTERS:3974 · TEST_FREE_BOOSTERS:3981 · SHELF_ROWS:3982 · SHELF_COLS:3983 · BOOSTER_ASPECT:3984 · SHELF_X0:3989 · SHELF_X1:3990 · SHELF_PLANKS:3991 · SHELF_OVERVIEW:3992 · SHELF_CLOSEUP:3993 · NPC_LINES:3995 · SHOP_ART:4003 · rollBooster:4011 · BoosterArt:4026 · NpcArt:4038 · PACK_TEAR_Y:4045 · LID_SLICES:4046 · LidSlice:4052 · PackTear:4075 · PulledCard:4144 · pullBooster:4145 · PackOpening:4158 · OpenBoosterFromTable:4237 · ShopScreen:4243 · AuthBackdrop:4483 · GoogleMark:4503 · DiscordMark:4506 · AuthButton:4512 · authFieldClass:4522 · LoginScreen:4524 · NAME_RULE:4585 · ProfileSetupScreen:4587 · VolumeRow:4653 · ToggleRow:4667 · OptionsModal:4679 · SettingsModal:4708 · playCoinSfx:4745 · COIN_THICK:4773 · CoinFace:4774 · CoinRim:4783 · RemotePick:4802 · CoinToss:4803 · MatchSearchOverlay:4885 · OnlineSearchOverlay:4918 · LoadingScreen:4987 · App:5041 · IMMEDIATE_ZONE_LABEL:10140 · DragFinger:10145 · GuideInfo:10162 · DragGuide:10163 · arrivalDrops:10230 · arrivalListener:10232 · CardSlot:10234

Dentro de `App` (linhas 5041–10139), funções internas:
openCardPicker:5294 · spawnFloatingNumber:5330 · spawnFloatingNumberAtId:5345 · showBanner:5371 · announcePhase:5390 · announceTurnChange:5398 · beginFinalBlow:5424 · endFinalBlow:5425 · blowIsSoaked:5428 · handleInstallClick:5506 · shieldOverSlot:5562 · popOverSlot:5571 · burstAt:5586 · whenGlowDone:5611 · endGlow:5612 · startTriggerFx:5616 · holdForSeat:5644 · fireImpactBurst:5680 · noteDragPlay:5707 · handFanMaxAngleRad:5777 · getHandArrivalPoint:5874 · getFanRotation:5894 · getFanLift:5901 · computeDrawOrigin:5916 · showToast:5931 · announceCardPlay:5937 · toCardData:6011 · shownStats:6026 · boardView:6037 · syncView:6042 · processEvents:6073 · commitState:6262 · dispatchAction:6268 · wakeWaiter:6286 · publishClock:6287 · dispatchOnline:6289 · reconcileOwn:6325 · applyUnasked:6339 · ingestRows:6353 · chooseFirstOnline:6381 · absorbAct:6394 · refuseOwn:6403 · sendOnline:6415 · stopOnline:6429 · startOnlinePolling:6444 · nextOpponentAction:6462 · applyRewardToProfile:6489 · openPlayerPick:6496 · playerAct:6523 · endTurnNow:6535 · sleep:6553 · tutCurrent:6565 · tutCanBack:6569 · tutShow:6574 · tutGo:6590 · tutNext:6598 · tutBack:6612 · tutMatches:6617 · tutSignal:6629 · tutFromAction:6634 · tutBeat:6641 · tutExit:6648 · tutFinish:6655 · startTutorial:6656 · tutLaunchDuel:6661 · tutCoinResolved:6663 · settleAmbush:6720 · startMatchIntro:6753 · continueMatchIntro:6772 · resetGame:6864 · startGame:6917 · startOnlineMatch:6924 · leaveMatch:6964 · handleCardClick:7282 · handlePlayCardButtonClick:7342 · abilityStepCandidates:7410 · abilityHasTargets:7413 · getPlayerCreatureAbilityKind:7435 · getCardVisualEl:7449 · triggerPunch:7534 · renderTravelingArrow:7572 · playPendingTactic:7599 · resolveOwnTacticTarget:7606 · resolveEnemyTacticTarget:7611 · toggleCardPickerSelection:7619 · abilityOf:7633 · nextAbilityStep:7635 · activateAbility:7641 · abilityStepSide:7655 · resolveAbilityTarget:7661 · pushAbilityPrompt:7698 · mine:7719 · foes:7720 · effectTargetKind:7723 · specSlots:7725 · tacticTargeting:7739 · sourceAt:7746 · cancelTargeting:7764 · playHandCardOnTarget:7767 · heldTop:7774 · slotUnder:7775 · clearDragOver:7784 · dragBlockReason:7786 · tapHandCard:7798 · beginPress:7806 · returnHeld:7823 · dropHeldCard:7832 · updateHeld:7861 · dropOk:7880 · handleSlotClick:7936 · handleNpcSlotClick:8116 · handleBackgroundClick:8171 · getTappedCardShift:8202 · getSelectedCardX:8212 · getSelectedCardY:8234 · getBoardAnimation:8258 · getPlayerSlotHint:8299 · isTacticTargetSlot:8318 · tacticTagFor:8326 · shakePx:8389 · boardHeightMultiplier:8402 · boardTopMargin:8403

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
