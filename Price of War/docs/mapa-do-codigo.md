<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (10739 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:250 · DRAW_FLIGHT_MS:276 · sfxVol:285 · playCardDrawSfx:286 · playCardPlaySfx:300 · playAttackSfx:307 · playEffectSfx:309 · playTacticSfx:310 · playSelectSfx:318 · bannerAudioCtx:330 · playBannerSfx:331 · playUiClickSfx:374 · playCardLiftSfx:383 · playDamageSfx:395 · playGeneralDamageSfx:400 · playDestroySfx:410 · playRevealGeneralSfx:412 · playBatalhaBannerSfx:417 · playBatalhaImpactSfx:425 · CardType:431 · CardData:433 · StatTone:479 · STAT_TONE_COLOR:480 · STAT_TONE_GRADIENT:481 · statsOf:486 · SlotHint:495 · getSlotHint:504 · RowRoleHint:510 · SOLDIER_CARD_TYPES:511 · getRowRoleHint:512 · ROW_ROLE_VIEW:519 · PHASE_BANNER_TEXT:543 · BATALHA_FALL_MS:565 · BATALHA_IMPACT_FRACTION:566 · PHASE_BANNER_STAGE_MS:568 · PHASE_BANNER_DURATION_MS:569 · PHASE_BANNER_Y:577 · PHASE_BANNER_MOTION:578 · HIT_STOP_MS:589 · ATTACK_MS:592 · ATTACK_WINDUP_FRAC:593 · ATTACK_WINDUP_PX:594 · ATTACK_TILT_DEG:595 · IMPACT_MS:596 · TIME:599 · rangedKindOf:601 · FINAL_SLOW:602 · FINAL_INTRO_MS:603 · FINAL_FREEZE_MS:604 · FINAL_AFTER_MS:605 · SLASH_SPARK_ANGLES:608 · SlashEffect:617 · TargetKind:655 · TARGET_STYLE:656 · HUD_CARD_SCALE:662 · AmountBadge:666 · TargetingHud:683 · READY_COLORS:753 · SILHOUETTES:758 · silhouetteFor:763 · TriggerIcon:773 · FLIGHT_MS:787 · HELD_SCALE:788 · HELD_GAP:789 · TriggerBurst:790 · TriggerFloatLayer:811 · AbilityReadyGlow:828 · TutRect:859 · tutPct:860 · tutSilBox:861 · tutElRect:870 · tutPad:871 · tutUnion:872 · TutResolved:877 · TUT_EMPTY:878 · visibleHandCards:879 · resolveTutTarget:880 · TutorialStage:927 · SpriteOnce:971 · EffectIcon:988 · EFFECT_ICONS:989 · SpriteIcon:997 · IconPop:1002 · SHIELD_SHEETS:1017 · GOLD_BUBBLE:1023 · ShieldAura:1024 · ShieldFxOnce:1044 · EquipFxLayer:1058 · PUNCH_FRAMES:1104 · PUNCH_FRAME_W:1105 · PunchFx:1107 · BURN_FRAMES:1143 · BurningCard:1145 · GraveyardPile:1195 · AtkBadge:1226 · NUMBER_KIND_OF:1238 · NUMBER_TIERS:1243 · damageTier:1249 · floatLife:1250 · FloatNumber:1251 · HpBadge:1299 · GoldBadge:1328 · GoldNumber:1357 · CardBack:1417 · CARD_THICKNESS_SHADOW:1455 · cardBoxShadow:1466 · cardGlowFilter:1467 · CARD_FACE_VARIANTS:1477 · NO_STAT_TYPES:1494 · templateForType:1495 · templateForTypeMini:1500 · FitText:1519 · KeywordPill:1594 · STAT_TOKEN:1608 · STAT_NUMBER_STYLE:1609 · StatSymbol:1610 · DamageSymbol:1617 · renderEffectText:1628 · FitEffectText:1647 · FULL_ART_PLATE_VARIANTS:1711 · FULL_ART_SIZE_FIX:1721 · CardFaceFullArt:1722 · FullArtMiniConfig:1843 · FULL_ART_MINI_CONFIG:1848 · usesLightBar:1876 · nameTextStyle:1877 · FULL_ART_MINI_DEFAULT:1880 · fullArtMiniConfigForType:1885 · CardFaceFullArtMini:1900 · CARD_FACE_MINI_STD_SCALE:1949 · CardFaceStandardMini:1950 · CardFace:2013 · BOARD_EXTERIOR_ART_URL:2125 · FIELD_PREVIEW_SCALE:2130 · BOARD_PREVIEW_SCALE:2148 · FAN_SPREAD_DEG:2151 · FAN_LIFT_PX:2152 · HAND_CARD_WIDTH:2153 · HAND_CARD_HEIGHT:2154 · HAND_CARD_STEP:2157 · HAND_FULL_SPREAD_COUNT:2160 · HAND_SELECT_SCALE:2163 · handStepFor:2164 · ART_BY_NAME:2171 · cardDataFromName:2224 · buildDeckCards:2228 · DECK_CAPITAO:2236 · DECK_CARDEAL:2237 · DECKS:2241 · BOOSTER_POOLS:2259 · DECK_STORE_KEY:2274 · CARD_INSTANCES_BY_NAME:2276 · cardByName:2284 · isGeneralName:2285 · DeckSlot:2287 · DeckStore:2288 · DeckSelection:2290 · OnlineMatch:2296 · needsServer:2328 · visibleKey:2339 · countByName:2344 · CAPITAO_STARTER_NAME:2350 · buildStarterStore:2353 · sameCards:2372 · ensureStarterDecks:2376 · sanitizeDeckStore:2397 · loadDeckStore:2421 · cloudUserId:2435 · pushTimer:2436 · pushing:2437 · pushAgain:2438 · toCloudDecks:2439 · runPush:2440 · saveDeckStore:2453 · stopCloudSync:2458 · flushCloudSync:2460 · syncDeckStoreWithCloud:2471 · deckCardCount:2499 · deckProblem:2501 · buildDeckSelection:2507 · DEFAULT_DECK_SELECTION:2513 · PlayerProfile:2522 · AVATAR_OPTIONS:2537 · avatarById:2545 · PROFILE_STORAGE_KEY:2547 · DEFAULT_PROFILE:2548 · loadProfile:2561 · formatCoroas:2575 · saveProfile:2580 · MODE_LABELS_PT:2589 · AvatarBadge:2599 · WINDOW_FRAME_PX:2619 · WINDOW_FONT_DECO:2620 · FramedWindow:2622 · WindowOverlay:2647 · WindowDivider:2670 · WindowTitle:2678 · Edges:2696 · ArtFrame:2697 · VLine:2718 · HLine:2721 · ArtChip:2726 · WindowOption:2741 · WindowText:2749 · WindowButton:2753 · AvatarPickerModal:2768 · ALLOW_PROFILE_RENAME:2805 · ProfileBar:2806 · ComingSoonModal:2927 · ONLINE_MODES:2943 · OnlineModeModal:2947 · TapPhase:2985 · MENU_CONFIRM_MS:2986 · useMenuTap:2987 · PlaqueSparks:3011 · PLAQUE_ASPECT:3030 · PLAQUE_CAP_CQW:3031 · MenuCard:3032 · MenuIconButton:3081 · MainMenu:3112 · InstallPrompt:3240 · DeckPickerModal:3276 · CARD_TYPE_ORDER:3307 · DeckSide:3308 · EditorSort:3309 · EDITOR_SORTS:3310 · EDITOR_MARGIN:3311 · EDITOR_FRAME:3312 · EDITOR_PAD:3313 · LIST_COLS:3316 · ROW_H:3317 · FULL_ART_TILE_SCALE:3318 · DeckEditor:3320 · ShopPhase:3938 · NpcMood:3939 · BoosterDef:3940 · BOOSTERS:3942 · TEST_FREE_BOOSTERS:3949 · SHELF_ROWS:3950 · SHELF_COLS:3951 · BOOSTER_ASPECT:3952 · SHELF_X0:3957 · SHELF_X1:3958 · SHELF_PLANKS:3959 · SHELF_OVERVIEW:3960 · SHELF_CLOSEUP:3961 · NPC_LINES:3963 · SHOP_ART:3971 · rollBooster:3979 · BoosterArt:3994 · NpcArt:4006 · PACK_TEAR_Y:4013 · LID_SLICES:4014 · LidSlice:4020 · PackTear:4043 · PulledCard:4112 · pullBooster:4113 · PackOpening:4126 · OpenBoosterFromTable:4205 · ShopScreen:4211 · AuthBackdrop:4451 · GoogleMark:4471 · DiscordMark:4474 · AuthButton:4480 · authFieldClass:4490 · LoginScreen:4492 · NAME_RULE:4553 · ProfileSetupScreen:4555 · VolumeRow:4621 · ToggleRow:4635 · OptionsModal:4647 · SettingsModal:4676 · playCoinSfx:4713 · COIN_THICK:4741 · CoinFace:4742 · CoinRim:4751 · RemotePick:4770 · CoinToss:4771 · MatchSearchOverlay:4853 · OnlineSearchOverlay:4886 · LoadingScreen:4955 · App:5009 · IMMEDIATE_ZONE_LABEL:10234 · DragFinger:10239 · GuideInfo:10256 · DragGuide:10257 · arrivalDrops:10324 · arrivalListener:10326 · EmblemKind:10331 · EMBLEM_ART:10332 · SlotEmblem:10333 · RowPlaque:10346 · CardSlot:10358

Dentro de `App` (linhas 5009–10233), funções internas:
openCardPicker:5263 · spawnFloatingNumber:5299 · spawnFloatingNumberAtId:5314 · showBanner:5340 · announcePhase:5359 · announceTurnChange:5367 · beginFinalBlow:5400 · endFinalBlow:5401 · blowIsSoaked:5404 · handleInstallClick:5482 · shieldOverSlot:5538 · popOverSlot:5547 · burstAt:5562 · whenGlowDone:5587 · endGlow:5588 · startTriggerFx:5592 · holdForSeat:5620 · fireImpactBurst:5653 · noteDragPlay:5676 · handFanMaxAngleRad:5746 · getHandArrivalPoint:5845 · getFanRotation:5865 · getFanLift:5872 · computeDrawOrigin:5887 · showToast:5902 · announceCardPlay:5908 · toCardData:5982 · shownStats:5997 · boardView:6008 · syncView:6013 · processEvents:6044 · fxRectOf:6249 · fxEnvFor:6255 · pickTacticSpot:6267 · planFx:6275 · commitState:6295 · dispatchAction:6318 · wakeWaiter:6337 · publishClock:6338 · dispatchOnline:6340 · reconcileOwn:6376 · applyUnasked:6390 · ingestRows:6404 · chooseFirstOnline:6432 · absorbAct:6445 · refuseOwn:6454 · sendOnline:6466 · stopOnline:6480 · startOnlinePolling:6495 · nextOpponentAction:6513 · applyRewardToProfile:6540 · openPlayerPick:6547 · playerAct:6574 · endTurnNow:6586 · sleep:6604 · tutCurrent:6616 · tutCanBack:6620 · tutShow:6625 · tutGo:6641 · tutNext:6649 · tutBack:6663 · tutMatches:6668 · tutSignal:6680 · tutFromAction:6685 · tutBeat:6692 · tutExit:6699 · tutFinish:6706 · startTutorial:6707 · tutLaunchDuel:6712 · tutCoinResolved:6714 · settleAmbush:6771 · startMatchIntro:6804 · continueMatchIntro:6823 · resetGame:6915 · startGame:6968 · startOnlineMatch:6975 · leaveMatch:7015 · handleCardClick:7344 · handlePlayCardButtonClick:7404 · abilityStepCandidates:7472 · abilityHasTargets:7475 · getPlayerCreatureAbilityKind:7497 · getCardVisualEl:7511 · triggerPunch:7596 · renderTravelingArrow:7634 · playPendingTactic:7661 · resolveOwnTacticTarget:7668 · resolveEnemyTacticTarget:7673 · toggleCardPickerSelection:7681 · abilityOf:7695 · nextAbilityStep:7697 · activateAbility:7703 · abilityStepSide:7717 · resolveAbilityTarget:7723 · pushAbilityPrompt:7760 · mine:7781 · foes:7782 · effectTargetKind:7785 · specSlots:7787 · tacticTargeting:7801 · sourceAt:7808 · cancelTargeting:7826 · playHandCardOnTarget:7829 · heldTop:7836 · slotUnder:7837 · clearDragOver:7846 · dragBlockReason:7848 · tapHandCard:7860 · beginPress:7868 · returnHeld:7885 · dropHeldCard:7894 · updateHeld:7923 · dropOk:7942 · handleSlotClick:7998 · handleNpcSlotClick:8178 · handleBackgroundClick:8244 · getTappedCardShift:8275 · getSelectedCardX:8285 · getSelectedCardY:8307 · getBoardAnimation:8331 · getPlayerSlotHint:8372 · isTacticTargetSlot:8391 · tacticTagFor:8399 · shakePx:8462 · boardHeightMultiplier:8475 · boardTopMargin:8476

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

## src/combatFx.ts  (499 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

FxSide:24 · FxRect:25 · FxTarget:26 · FxEnv:28 · cv:37 · ctx:38 · RES:39 · fxs:40 · IMG:41 · SRC:42 · readyP:43 · preloadCombatFx:44 · resize:48 · ensureCanvas:49 · R:58 · clamp:59 · eo:60 · at:61 · add:62 · wait:63 · tick:65 · loop:76 · kick:80 · URLS:83 · play:84 · whoosh:85 · pick:88 · FS:95 · sprite:96 · explosion:103 · holy:111 · flash:114 · shock:118 · scorch:125 · puff:129 · dust:135 · debris:138 · sparks:147 · softAngle:154 · fly:165 · arcTangent:204 · stick:205 · ring:211 · burst:214 · sparksDir:219 · glint:226 · cleanHit:233 · lanceFade:237 · thunk:238 · rockBreak:244 · setScale:257 · pt:258 · tacPoint:259 · landingImpact:263 · fxLanding:294 · landTactic:301 · leaveTactic:313 · weaponReveal:316 · once:343 · fxTactic:347 · fxHero:413 · fxRanged:446

## src/engine/ai.ts  (695 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:297 · upkeepAnswer:303 · wantedRelicMode:323 · aiLegacyAction:339 · holdValue:453 · attackPotential:456 · sideValue:469 · upkeepBurden:484 · evalState:487 · sortedDesc:502 · forSearch:505 · candidates:515 · lastPhaseOf:586 · fingerprint:589 · Line:598 · SEARCH:600 · settle:603 · planTurn:614 · memo:655 · answerPending:657 · aiNextAction:676

## src/engine/catalog.ts  (279 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:155 · DeckRecipe:157 · DECK_RECIPES:159 · BALANCE:227 · STARTER_TRIM:239 · starterDeckCards:240 · LEGACY_STARTERS:248 · BY_NAME:260 · getCardDef:263 · registerCardDefs:265 · requireCardDef:266 · isGeneralName:271 · TOKEN_DEFS:275

## src/engine/deck.ts  (29 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_MAX_COPIES:7 · deckCardCount:9 · deckProblem:14

## src/engine/experimental.ts  (60 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

GENERAL_NAME:7 · MERCENARIOS_DEFS:11 · MERCENARIOS_RECIPE:43 · registerMercenarios:59

## src/engine/game.ts  (1061 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:158 · setWinner:175 · soak:184 · grantShield:196 · grantBlock:202 · damageSlot:210 · healSlot:226 · startTurn:235 · enterPreparation:291 · payUpkeep:298 · setRelicMode:331 · runTurnEnd:344 · endTurn:364 · assertCanAct:374 · Fx:385 · uniqueByName:392 · matchesFilter:393 · filterLabel:395 · specCandidates:398 · checkTarget:402 · activeTargets:420 · validateTargets:424 · checkVerb:431 · checkVerbTarget:445 · openPick:449 · runVerb:456 · runAbilities:595 · grantMovedBuff:601 · playCard:611 · useAbility:675 · choose:715 · attack:771 · respondAmbush:797 · resolveAmbushEffect:814 · resolveCombat:847 · move:924 · advance:957 · discardExcess:979 · clone:996 · applyAction:998 · MatchLog:1040 · newMatchLog:1047 · replayMatch:1050

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (247 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · GOLD_PER_TURN:11 · GOLD_FROM_ROUND:12 · COMBAT_FROM_ROUND:14 · HAND_LIMIT:15 · Unit:19 · Board:24 · phasesForTurn:27 · AUTOMATIC_PHASES:33 · restingPhasesForTurn:34 · abilitiesOf:39 · passivesOf:40 · abilityOn:41 · verbsOn:42 · hasVerb:43 · abilityPhases:46 · specCandidatesOn:49 · targetSpecsOf:64 · playTargetSpecs:65 · targetSpecOf:67 · needsHiddenInfo:71 · reinforceShield:76 · canReinforce:80 · AuraStat:83 · rowOk:84 · whoMatches:85 · auraTotal:95 · boardHasFlag:117 · upkeepOf:121 · relicModeOf:123 · canPlayInPhase:131 · isFrontline:135 · isBackline:136 · isUnitSlot:137 · getLaneCol:138 · getMoveRow:143 · getMoveCol:144 · areSlotsAdjacent:146 · adjacentSlots:150 · canReposition:154 · SOLDIER_TYPES:161 · CardDropKind:163 · getCardDropKind:166 · canPlaceInSlot:178 · isAliveAt:187 · isCardDamaged:189 · getAuraCombatHpBonus:192 · blocksAmbush:194 · locksGeneralOnDamage:196 · getMaxAttacksPerTurn:198 · getEffectiveAtk:202 · getIncomingDamageReduction:210 · getValidAttackTargets:214 · withEquippedWeapons:245

## src/engine/types.ts  (361 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:43 · Verb:47 · AbilityOn:83 · Ability:97 · Who:107 · Passive:117 · RelicMode:129 · CardDef:139 · Card:163 · SLOT_COUNT:194 · GENERAL_SLOT:195 · RELIC_SLOT:196 · TERRAIN_SLOT:197 · PlayerState:199 · TurnState:220 · PickMode:238 · Pending:241 · GameState:283 · Action:294 · GameEvent:321 · ActionResult:358

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

## tests/balance-merc.ts  (134 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Patch:23 · Per:24 · Rec:25 · setupOf:27 · applyPatch:31 · bump:48 · playGame:50 · pct:79 · main:81

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
