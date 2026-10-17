<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (12039 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:280 · DRAW_FLIGHT_MS:306 · sfxVol:315 · playCardDrawSfx:316 · playCardPlaySfx:330 · playAttackSfx:337 · playEffectSfx:339 · playTacticSfx:340 · playSelectSfx:348 · bannerAudioCtx:360 · playBannerSfx:361 · playUiClickSfx:404 · playCardLiftSfx:413 · playDamageSfx:425 · playGeneralDamageSfx:430 · playDestroySfx:440 · playAshArriveSfx:441 · playRevealGeneralSfx:443 · playWarHornSfx:449 · playBatalhaBannerSfx:454 · playBatalhaImpactSfx:462 · CardType:468 · CardData:470 · StatTone:521 · STAT_TONE_COLOR:522 · STAT_TONE_GRADIENT:523 · statsOf:528 · SlotHint:537 · getSlotHint:546 · RowRoleHint:552 · SOLDIER_CARD_TYPES:553 · getRowRoleHint:554 · ROW_ROLE_VIEW:561 · PHASE_BANNER_TEXT:585 · BATALHA_FALL_MS:607 · BATALHA_IMPACT_FRACTION:608 · BANNER_LEARN_COUNT:612 · bannersSeen:613 · PHASE_BANNER_STAGE_MS:614 · phaseBannerMs:615 · PHASE_BANNER_Y:623 · PHASE_BANNER_MOTION:624 · HIT_STOP_MS:635 · ATTACK_MS:638 · ATTACK_WINDUP_FRAC:639 · ATTACK_WINDUP_PX:640 · ATTACK_TILT_DEG:641 · IMPACT_MS:642 · TIME:645 · rangedKindOf:647 · FINAL_SLOW:648 · FINAL_INTRO_MS:649 · FINAL_FREEZE_MS:650 · FINAL_AFTER_MS:651 · SLASH_SPARK_ANGLES:654 · SlashEffect:663 · TargetKind:701 · TARGET_STYLE:702 · HUD_CARD_SCALE:708 · AmountBadge:712 · TargetingHud:729 · READY_COLORS:799 · SILHOUETTES:804 · silhouetteFor:809 · DEBUG_HOOKS:820 · TriggerIcon:822 · FLIGHT_MS:836 · HELD_SCALE:837 · HELD_GAP:838 · TriggerBurst:839 · TriggerFloatLayer:860 · AbilityReadyGlow:877 · TutRect:905 · tutPct:906 · tutSilBox:907 · tutElRect:916 · tutPad:917 · tutUnion:918 · TutResolved:923 · TUT_EMPTY:924 · visibleHandCards:925 · resolveTutTarget:926 · TutorialStage:973 · SpriteOnce:1017 · EffectIcon:1034 · EFFECT_ICONS:1035 · SpriteIcon:1043 · IconPop:1048 · SHIELD_SHEETS:1063 · GOLD_BUBBLE:1069 · ShieldAura:1070 · ShieldFxOnce:1079 · EquipFxLayer:1093 · PUNCH_FRAMES:1139 · PUNCH_FRAME_W:1140 · DRAW_STYLE:1148 · DrawFlightNovo:1149 · RepositionLegNovo:1194 · FlyingCardNovo:1220 · lastArrowKey:1250 · drawFlightDelay:1251 · PunchFx:1252 · BURN_FRAMES:1288 · BurningCard:1290 · GraveyardPile:1346 · AtkBadge:1378 · NUMBER_KIND_OF:1390 · NUMBER_TIERS:1395 · damageTier:1401 · floatLife:1402 · FloatNumber:1403 · HpBadge:1453 · GoldBadge:1482 · GoldNumber:1511 · CardBack:1571 · CARD_THICKNESS_SHADOW:1609 · cardBoxShadow:1620 · cardGlowFilter:1621 · CARD_FACE_VARIANTS:1631 · NO_STAT_TYPES:1648 · templateForType:1649 · templateForTypeMini:1654 · FitText:1673 · KeywordPill:1748 · STAT_TOKEN:1762 · STAT_NUMBER_STYLE:1763 · StatSymbol:1764 · CoinIcon:1772 · GoldSymbol:1775 · DamageSymbol:1780 · RULE_WORD_STYLE:1792 · renderEffectText:1793 · FitEffectText:1833 · FULL_ART_PLATE_VARIANTS:1897 · FULL_ART_SIZE_FIX:1907 · CardFaceFullArt:1908 · FullArtMiniConfig:2032 · FULL_ART_MINI_CONFIG:2037 · usesLightBar:2065 · nameTextStyle:2066 · FULL_ART_MINI_DEFAULT:2069 · fullArtMiniConfigForType:2074 · CardFaceFullArtMini:2089 · CARD_FACE_MINI_STD_SCALE:2139 · CardFaceStandardMini:2140 · rarNameCls:2206 · RarityCardShine:2207 · CardFace:2212 · BOARD_EXTERIOR_ART_URL:2326 · FIELD_PREVIEW_SCALE:2331 · BOARD_PREVIEW_SCALE:2349 · FAN_SPREAD_DEG:2352 · FAN_LIFT_PX:2353 · HAND_CARD_WIDTH:2354 · HAND_CARD_HEIGHT:2355 · HAND_CARD_STEP:2358 · HAND_FULL_SPREAD_COUNT:2361 · HAND_SELECT_SCALE:2364 · handStepFor:2365 · ART_BY_NAME:2372 · MERC_ART_FILES:2426 · artSlug:2427 · CAMPO_ART_FILES:2433 · CAPITAO_ART_FILES:2439 · cardDataFromName:2445 · buildDeckCards:2449 · DECK_CAPITAO:2457 · DECK_CARDEAL:2458 · DECK_MERCENARIOS:2459 · DECK_CAMPO:2460 · DECKS:2464 · ALL_DECK_IDS:2494 · BOOSTER_POOLS:2497 · DECK_STORE_KEY:2517 · CARD_INSTANCES_BY_NAME:2519 · cardByName:2527 · isGeneralName:2528 · DeckSlot:2530 · DeckStore:2532 · DeckSelection:2534 · lastDeckRar:2535 · OnlineMatch:2541 · needsServer:2573 · visibleKey:2585 · countByName:2590 · CAPITAO_STARTER_NAME:2596 · MERC_STARTER_NAME:2597 · CAMPO_STARTER_NAME:2598 · CLOUD_DECK_SLOTS:2600 · MAX_DECK_SLOTS:2601 · buildStarterStore:2604 · sameCards:2628 · ensureStarterDecks:2632 · lastSanitizeMigrated:2664 · sanitizeDeckStore:2665 · loadDeckStore:2703 · cloudUserId:2717 · pushTimer:2718 · pushing:2719 · pushAgain:2720 · toCloudDecks:2721 · runPush:2722 · saveDeckStore:2735 · stopCloudSync:2740 · flushCloudSync:2742 · syncDeckStoreWithCloud:2753 · deckCardCount:2784 · deckProblem:2786 · buildDeckSelection:2794 · deckIdOfGeneral:2803 · DEFAULT_DECK_SELECTION:2804 · PlayerProfile:2813 · AVATAR_OPTIONS:2829 · avatarById:2882 · PROFILE_STORAGE_KEY:2884 · DEFAULT_PROFILE:2885 · loadProfile:2898 · formatCoroas:2912 · saveProfile:2917 · MODE_LABELS_PT:2926 · AvatarBadge:2936 · PlayerPlate:2951 · WINDOW_FRAME_PX:2980 · WINDOW_FONT_DECO:2981 · FramedWindow:2983 · WindowOverlay:2988 · WindowDivider:3011 · WindowTitle:3019 · Edges:3027 · ArtFrame:3028 · VLine:3049 · HLine:3052 · ArtChip:3057 · WindowOption:3063 · WindowText:3067 · WindowButton:3071 · AvatarPickerModal:3077 · ALLOW_PROFILE_RENAME:3125 · ProfileBar:3126 · ComingSoonModal:3247 · ONLINE_MODES:3263 · OnlineModeModal:3268 · TapPhase:3300 · MENU_CONFIRM_MS:3301 · useMenuTap:3302 · PlaqueSparks:3326 · PLAQUE_ASPECT:3345 · PLAQUE_CAP_CQW:3346 · MenuCard:3347 · MenuTextButton:3396 · ago:3410 · GmPanel:3411 · MenuIconButton:3502 · MainMenu:3533 · InstallPrompt:3680 · DeckPickerModal:3716 · CARD_TYPE_ORDER:3747 · DeckSide:3748 · EditorSort:3749 · EDITOR_SORTS:3750 · EDITOR_MARGIN:3751 · EDITOR_FRAME:3752 · EDITOR_PAD:3753 · LIST_COLS:3756 · ROW_H:3757 · FULL_ART_TILE_SCALE:3758 · DeckEditor:3760 · ShopPhase:4340 · NpcMood:4341 · BoosterDef:4342 · BOOSTERS:4344 · TEST_FREE_BOOSTERS:4353 · SHELF_ROWS:4354 · SHELF_COLS:4355 · BOOSTER_ASPECT:4356 · SHELF_X0:4361 · SHELF_X1:4362 · SHELF_PLANKS:4363 · SHELF_OVERVIEW:4364 · SHELF_CLOSEUP:4365 · NPC_LINES:4367 · SHOP_ART:4375 · rollBooster:4383 · BoosterArt:4399 · NpcArt:4411 · PACK_TEAR_Y:4418 · LID_SLICES:4419 · LidSlice:4425 · PackTear:4448 · PulledCard:4517 · pullBooster:4518 · PackOpeningOld:4532 · CARD3D_FILES:4613 · card3dUrl:4614 · Booster3DOpening:4615 · PackOpening:4653 · OpenBoosterFromTable:4658 · ShopScreen:4664 · AuthBackdrop:4904 · GoogleMark:4925 · DiscordMark:4928 · AuthButton:4930 · authFieldClass:4936 · WelcomeBack:4939 · LoginScreen:4975 · NAME_RULE:5039 · ProfileSetupScreen:5041 · VolumeRow:5108 · ToggleRow:5117 · REPORT_REASON_LABELS:5127 · ReportModal:5128 · makeFeedbackContext:5160 · FEEDBACK_LABELS:5166 · FeedbackModal:5167 · OptionsModal:5200 · SettingsModal:5236 · playCoinSfx:5288 · lastGoldSfx:5314 · playGoldSpendSfx:5315 · COIN_THICK:5319 · CoinFace:5320 · CoinRim:5329 · RemotePick:5348 · CoinToss:5349 · MatchSearchOverlay:5431 · OnlineSearchOverlay:5472 · LoadingScreen:5599 · App:5653 · IMMEDIATE_ZONE_LABEL:11485 · DragFinger:11490 · GuideInfo:11507 · DragGuide:11508 · arrivalDrops:11575 · arrivalListener:11577 · EmblemKind:11582 · EMBLEM_ART:11583 · SlotEmblem:11584 · RowPlaque:11597 · CardSlot:11609

Dentro de `App` (linhas 5653–11484), funções internas:
attackMarkFor:5927 · openCardPicker:5954 · spawnFloatingNumber:5990 · spawnFloatingNumberAtId:6006 · showBanner:6033 · announcePhase:6057 · announceTurnChange:6067 · trackOverlay:6100 · beginFinalBlow:6109 · endFinalBlow:6110 · blowIsSoaked:6113 · handleInstallClick:6202 · shieldOverSlot:6258 · popOverSlot:6267 · burstAt:6282 · whenGlowDone:6307 · endGlow:6308 · startTriggerFx:6312 · holdForSeat:6340 · terrainFxPlayer:6368 · terrainFxNpc:6369 · fireImpactBurst:6385 · noteDragPlay:6409 · handFanMaxAngleRad:6479 · getHandArrivalPoint:6588 · getFanRotation:6608 · getFanLift:6615 · computeDrawOrigin:6630 · showToast:6645 · announceCardPlay:6651 · rarityOfCard:6729 · toCardData:6736 · shownStats:6752 · boardView:6763 · syncView:6768 · processEvents:6804 · armedSlotsOf:7045 · cardOverlayFx:7046 · fxRectOf:7163 · fxEnvFor:7169 · pickTacticSpot:7186 · tacticFxOf:7195 · planFx:7199 · commitState:7229 · dispatchAction:7252 · wakeWaiter:7271 · publishClock:7272 · dispatchOnline:7274 · reconcileOwn:7310 · applyUnasked:7324 · ingestRows:7338 · chooseFirstOnline:7366 · absorbAct:7379 · refuseOwn:7388 · sendOnline:7400 · stopOnline:7414 · startOnlinePolling:7431 · fxIdleNow:7449 · waitFxIdle:7450 · nextOpponentAction:7458 · applyRewardToProfile:7485 · openPlayerPick:7492 · playerAct:7520 · openModePrompt:7532 · maybePromptRelicMode:7539 · confirmRelicMode:7548 · confirmUpkeep:7560 · canPlayNow:7573 · readyAttackers:7574 · endTurnWarning:7577 · askEndTurn:7585 · endTurnNow:7591 · sleep:7610 · tutCurrent:7622 · tutCanBack:7626 · tutShow:7631 · tutGo:7647 · tutNext:7655 · tutBack:7669 · tutMatches:7674 · tutSignal:7686 · tutFromAction:7691 · tutBeat:7698 · tutExit:7705 · tutFinish:7712 · startTutorial:7713 · tutLaunchDuel:7718 · tutCoinResolved:7720 · settleAmbush:7777 · startMatchIntro:7810 · continueMatchIntro:7829 · resetGame:7925 · startGame:7985 · startOnlineMatch:7992 · leaveMatch:8034 · handleCardClick:8431 · handlePlayCardButtonClick:8491 · abilityStepCandidates:8550 · abilityHasTargets:8553 · getPlayerCreatureAbilityKind:8575 · getCardVisualEl:8589 · triggerPunch:8680 · renderTravelingArrow:8731 · playPendingTactic:8758 · resolveOwnTacticTarget:8765 · resolveEnemyTacticTarget:8770 · toggleCardPickerSelection:8778 · abilityOf:8792 · nextAbilityStep:8794 · activateAbility:8800 · abilityStepSide:8814 · resolveAbilityTarget:8820 · pushAbilityPrompt:8857 · mine:8878 · foes:8879 · effectTargetKind:8882 · specSlots:8884 · tacticTargeting:8898 · sourceAt:8905 · cancelTargeting:8923 · playHandCardOnTarget:8926 · heldTop:8933 · slotUnder:8934 · clearDragOver:8943 · dragBlockReason:8945 · tapHandCard:8959 · beginPress:8967 · returnHeld:8984 · dropHeldCard:8993 · updateHeld:9022 · dropOk:9041 · handleSlotClick:9097 · handleNpcSlotClick:9277 · handleBackgroundClick:9343 · getTappedCardShift:9374 · getSelectedCardX:9384 · getSelectedCardY:9406 · getBoardAnimation:9430 · getPlayerSlotHint:9471 · isTacticTargetSlot:9490 · tacticTagFor:9498 · boardHeightMultiplier:9574 · boardTopMargin:9575

## src/ashFx.ts  (123 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Box:5 · AshOpts:6 · NS:8 · nz:9 · noiseGrid:10 · lerp:11 · ease:12 · noise:13 · fbm:14 · HIT:15 · burnAt:16 · BURN_S:17 · loadImg:19 · Part:21 · Ash:22 · fxAshes:24

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/boosterOpen3d.ts  (203 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

OpenCard:13 · OpenOpts:14 · HALO:15 · ART_RECT:17 · playBoosterOpening:19

## src/campoFx.ts  (329 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:9 · AURA:11 · PERSISTENT_AURAS:13 · Env:14 · cvs:17 · ctx:18 · fxs:19 · ensure:20 · resize:25 · R:26 · clamp:27 · eo:28 · lerp:29 · at:30 · add:31 · wait:32 · rc:35 · setU:36 · dirOf:37 · edgeY:38 · cols:39 · midY:40 · spawn:43 · glow:44 · drawP:45 · stepP:61 · flame:65 · ember:66 · fan:67 · ring:68 · dust:69 · glints:70 · Layer:74 · layers:75 · night:76 · animated:77 · armedOf:79 · Frame:84 · Sil:85 · SIL:86 · frameOf:87 · silOf:92 · ringOf:100 · edgeOf:109 · drawRing:113 · holderOf:114 · auraSlots:115 · layerTick:117 · layerDraw:142 · nightTick:152 · nightDraw:156 · inFrame:164 · overlayOpen:166 · busy:171 · frame:172 · step:177 · kick:198 · clearAll:199 · clearCampoLayers:200 · syncCampoLayers:204 · clang:226 · prep:227 · fxForjaPlaced:230 · equipTransfer:238 · fxForjaEquip:250 · fxFogoEquip:251 · fxArsenalEquip:252 · fxForjaModo:254 · fxFogoPlaced:261 · fxFogoTrincheira:269 · fxFogoSaque:276 · fxNoitePlay:286 · fxNoiteTrail:287 · branch:296 · fxMata:303 · WEAPONS:312 · weaponPath:313 · fxArsenalPlaced:321

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/cardFx.ts  (355 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CardRect:7 · Part:8 · cv:11 · parts:12 · ensure:13 · kick:19 · frame:20 · R:28 · clamp:29 · add:30 · run:32 · emit:39 · stepParts:40 · drawParts:43 · softGlow:53 · rr:54 · RINGS:57 · frameImgOf:58 · SOLID:60 · solidOf:61 · silRing:71 · drawSil:80 · hintEl:84 · fxHintFrame:86 · ctr:87 · fxLand:91 · fxImpact:117 · BN:145 · BURN:146 · noise:147 · nz:150 · F:152 · maskUrl:153 · burnMaskSheet:155 · mkLayer:162 · fxBurn:164 · fxLunge:205 · fxDrop:237 · ArrowSpec:255 · arrows:256 · exitT:257 · PERIOD:261 · drawArrow:262 · fxArrows:298 · fxDrawFollow:309 · fxMoveFollow:327 · SelItem:343 · covered:344 · selItems:345 · fxSelection:346

## src/CardViewer3D.tsx  (176 linhas)
Visualizador 3D de carta (three.js, carregado sob demanda); também a página ?3d.

Viewer3DCard:8 · EMBED:11 · FILES:12 · urlOf:13 · W:16 · roundedShape:18 · BACK_SX:27 · backGeometry:28 · CardViewer3D:32

## src/CollectionRoom.tsx  (542 linhas)
Sala de Coleção: o quarto em imagem única com objetos tocáveis (livro, porta, estante de boosters, mesa/deck), câmera com zoom e o fichário (Binder).

CardViewer3D:13 · THUMBS:14 · thumbOf:15 · Stock:17 · RARS:18 · versionsOf:19 · bestOf:20 · FOIL_OP:21 · SW:23 · PER:24 · BOOK_W:25 · clamp:26 · wait:27 · GOLD:28 · SPOTS:31 · SpotKey:37 · Plaque:40 · BookTitle:55 · SHELF_ROWS:67 · shelfSlot:68 · Entry:73 · RoomPack:75 · CollectionRoom:76 · NS:233 · SS:234 · BEND:235 · Rect:236 · Phase:237 · Binder:239 · PACK_ASPECT:531 · SheenDriver:534

## src/combatFx.ts  (1069 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

FxSide:50 · FxRect:51 · FxTarget:52 · FxEnv:54 · cv:68 · ctx:69 · RES:70 · fxs:71 · IMG:72 · SRC:73 · readyP:74 · preloadCombatFx:75 · resize:79 · ensureCanvas:80 · R:89 · clamp:90 · eo:91 · at:92 · add:93 · wait:94 · tick:96 · loop:107 · kick:111 · URLS:114 · play:115 · whoosh:116 · pick:119 · FS:126 · sprite:127 · explosion:134 · holy:142 · flash:145 · shock:149 · scorch:156 · puff:160 · dust:166 · debris:169 · sparks:178 · softAngle:185 · fly:196 · arcTangent:235 · stick:236 · ring:242 · burst:245 · sparksDir:250 · glint:257 · cleanHit:264 · lanceFade:268 · thunk:269 · rockBreak:275 · sheetXY:289 · playSheet:295 · ding:297 · coinAt:298 · coinFly:304 · coinBurst:313 · stonesFall:322 · drawBack:333 · flyBack:339 · setScale:344 · pt:345 · tacPoint:346 · landingImpact:350 · fxLanding:381 · landTactic:388 · leaveTactic:400 · weaponReveal:403 · once:430 · fxTactic:434 · fxHero:550 · fxRanged:583 · start:655 · toU:656 · fxUpkeep:660 · fxGoldGain:689 · fxRelicSoldo:702 · fxLoot:717 · fxPlaced:729 · fxReformar:756 · fxAmbush:768 · HOLY_SRC:802 · holyP:803 · loadHoly:804 · preloadHolyFx:805 · startHoly:806 · tween:807 · GOLDC:808 · twNow:811 · twMove:815 · twBurst:820 · charge:823 · risers:826 · groundGlow:829 · whiteFlash:833 · dimAt:837 · glowEl:844 · liftEl:847 · pilar:851 · sigilo:856 · cruzAt:860 · trompaAt:861 · almaAt:862 · heartAt:866 · godrays:869 · asasAt:876 · solAt:880 · portalAt:883 · orb:887 · cometaFly:895 · fxBencao:906 · fxCalice:933 · fxHospitalario:944 · fxNobre:970 · fxReforco:984 · fxComandante:997 · fxRetorno:1011 · fxRetornoCarry:1037 · fxAtirador:1059

## src/DesafiosScreen.tsx  (180 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

DzOpponent:12 · DzDeck:13 · PLACES:16 · LOCKED:23 · MAPPX:25 · PhotoPin:27 · LAST_DECK_KEY:30 · DesafiosScreen:32

## src/diag.ts  (11 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

BUILD_ID:3 · recent:4 · keep:5 · recentErrors:10

## src/Emotes.tsx  (186 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

GAP_MS:20 · SHOW_MS:22 · DECK_PHRASE:25 · deckOfGeneral:26 · PHRASES:30 · EMOJIS:34 · phraseText:37 · iconOf:38 · Bubble:40 · PUFFS:43 · Puff:44 · Emotes:53

## src/engine/ai.ts  (766 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:298 · upkeepAnswer:305 · wantedRelicMode:343 · wantedTerrainMode:361 · aiLegacyAction:383 · AiStyle:498 · STYLE:499 · holdValue:502 · attackPotential:517 · sideValue:530 · upkeepBurden:547 · evalState:550 · sortedDesc:565 · forSearch:568 · candidates:578 · lastPhaseOf:650 · fingerprint:653 · Line:662 · SEARCH:664 · settle:667 · planTurn:678 · memo:719 · answerPending:721 · aiNextAction:740 · aiNextActionInner:745

## src/engine/catalog.ts  (600 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · equip:12 · GRAVE_EQUIP:14 · DECK_EQUIP:15 · ARMED:16 · CARD_DEFS:18 · DeckId:344 · DeckRecipe:346 · DECK_RECIPES:348 · BALANCE:460 · BOOSTER_EXTRA:471 · STARTER_TRIM:480 · starterDeckCards:481 · LEGACY_STARTERS:489 · BY_NAME:516 · getCardDef:519 · registerCardDefs:521 · requireCardDef:522 · LEGACY_CARD_NAMES:529 · currentCardName:585 · currentNames:587 · isGeneralName:592 · TOKEN_DEFS:596

## src/engine/deck.ts  (31 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_DEFAULT_MAX_COPIES:8 · maxCopiesOf:9 · deckCardCount:11 · deckProblem:16

## src/engine/experimental.ts  (17 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

names:8 · MERCENARIOS_DEFS:9 · MERCENARIOS_RECIPE:10 · registerMercenarios:11 · campoNames:13 · CAMPO_DEFS:14 · CAMPO_RECIPE:15 · registerCampo:16

## src/engine/game.ts  (1120 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:85 · RuleError:88 · fail:89 · log:91 · P:92 · combatOpen:94 · activePhases:95 · addGold:98 · removeOne:107 · takeFromDeck:108 · drawCards:110 · removeFromHand:123 · discard:130 · sendDestroyed:137 · reinforceFrom:166 · setWinner:183 · soak:192 · grantShield:204 · grantBlock:210 · damageSlot:218 · healSlot:234 · startTurn:244 · enterPreparation:302 · payUpkeep:309 · setRelicMode:342 · runTurnEnd:356 · endTurn:376 · assertCanAct:386 · Fx:397 · uniqueByName:404 · matchesFilter:405 · filterLabel:412 · specCandidates:415 · checkTarget:419 · activeTargets:437 · validateTargets:441 · checkVerb:448 · checkVerbTarget:462 · openPick:466 · runVerb:475 · runAbilities:634 · grantMovedBuff:642 · playCard:652 · useAbility:719 · choose:759 · attack:817 · respondAmbush:843 · resolveAmbushEffect:860 · resolveCombat:896 · move:983 · advance:1016 · discardExcess:1038 · clone:1055 · applyAction:1057 · MatchLog:1099 · newMatchLog:1106 · replayMatch:1109

## src/engine/missions.ts  (55 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

MissionKind:4 · MissionMode:5 · MissionMetric:7 · MissionDef:8 · RANKED_MISSIONS_ON:15 · MISSIONS:17 · DAILY_SLOTS:41 · WEEKLY_SLOTS:42 · REROLLS_PER_DAY:43 · DIVISION_BONUS:45 · missionsOf:48 · slotsFor:50

## src/engine/ranked.ts  (128 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LEAGUES:9 · League:10 · LEAGUE_NAMES:11 · POINTS_PER_DIVISION:14 · DIVISIONS:15 · POINTS_PER_LEAGUE:16 · MESTRE_FROM:17 · TOP_LEAGUE_SIZE:18 · PLACEMENT_MATCHES:20 · START_MMR:21 · START_POINTS:22 · RankedProfile:25 · newRankedProfile:26 · LeagueInfo:28 · leagueOf:30 · ROMAN:38 · leagueLabel:39 · leagueIndex:44 · RankedInput:47 · RankedResult:56 · expected:58 · clamp:59 · applyRankedMatch:61 · mmrWindow:93 · withTopLeague:96 · SEASON_DAYS:104 · SEASON_ONE_START:105 · DAY_MS:106 · SeasonInfo:107 · seasonAt:108 · RewardLeague:114 · SEASON_COROAS:115 · SeasonClose:117 · closeSeason:120

## src/engine/rewards.ts  (51 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · BOT_DAILY_CAP:27 · FIRST_WIN_COROAS:28 · DailyState:29 · withDaily:30 · xpToNext:39 · Progress:41 · applyReward:44

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (263 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · DRAW_PER_TURN:12 · GOLD_PER_TURN:13 · GOLD_FROM_ROUND:14 · COMBAT_FROM_ROUND:16 · HAND_LIMIT:17 · Unit:21 · Board:26 · phasesForTurn:29 · AUTOMATIC_PHASES:35 · restingPhasesForTurn:36 · abilitiesOf:41 · passivesOf:42 · abilityOn:43 · verbsOn:44 · hasVerb:45 · abilityPhases:48 · specCandidatesOn:51 · targetSpecsOf:66 · playTargetSpecs:67 · targetSpecOf:69 · needsHiddenInfo:73 · reinforceShield:78 · canReinforce:82 · AuraStat:85 · rowOk:86 · armedCount:87 · whoMatches:88 · AuraHit:100 · auraTotal:101 · maxGeneralAbilityUses:129 · boardHasFlag:131 · upkeepOf:135 · modeAt:137 · relicModeOf:142 · terrainModeOf:143 · canPlayInPhase:147 · isFrontline:151 · isBackline:152 · isUnitSlot:153 · getLaneCol:154 · getMoveRow:159 · getMoveCol:160 · areSlotsAdjacent:162 · adjacentSlots:166 · canReposition:170 · SOLDIER_TYPES:177 · CardDropKind:179 · getCardDropKind:182 · canPlaceInSlot:194 · isAliveAt:203 · isCardDamaged:205 · getAuraCombatHpBonus:208 · blocksAmbush:210 · locksGeneralOnDamage:212 · getMaxAttacksPerTurn:214 · getEffectiveAtk:218 · getIncomingDamageReduction:226 · getValidAttackTargets:230 · withEquippedWeapons:261

## src/engine/types.ts  (382 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:44 · Verb:48 · AbilityOn:87 · Ability:102 · Who:112 · Passive:124 · RelicMode:138 · CardDef:150 · Card:178 · SLOT_COUNT:209 · GENERAL_SLOT:210 · RELIC_SLOT:211 · TERRAIN_SLOT:212 · PlayerState:214 · TurnState:235 · PickMode:253 · Pending:256 · GameState:298 · Action:311 · GameEvent:338 · ActionResult:379

## src/engine/view.ts  (66 linhas)
O que cada jogador pode ver (esconde mão e baralho do outro).

hiddenCard:6 · redactPlayer:8 · redactFor:16 · redactEvents:30 · mirrorSeats:42 · mirrorEvents:58 · viewFor:64 · eventsFor:65

## src/fpsMeter.ts  (19 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

el:5 · tick:6 · sync:13 · initFpsMeter:18

## src/gameSettings.ts  (30 linhas)
Opções do jogador (avisos de arrastar/tabuleiro), hook useGameSettings.

GameSettings:5 · KEY:12 · DEFAULTS:13 · load:14 · state:20 · listeners:21 · getGameSettings:22 · subscribeSettings:23 · setGameSettings:24 · useGameSettings:29

## src/main.tsx  (31 linhas)
Ponto de entrada do React.

CardViewer3D:10 · Viewer3DPage:11 · only3d:16

## src/nameFilter.ts  (31 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

BAD_SUBSTR:6 · BAD_WORD_START:12 · BAD_WORD_EXACT:14 · ACCENTS:16 · LEET:17 · squash:18 · clean:19 · isNameAllowed:21 · NAME_REFUSED:30

## src/numberGlyphs.ts  (16 linhas)
Imagens dos números (ATK/HP/dano) usadas nas cartas.

NumberKind:3 · files:5 · NAME:6 · glyphUrl:8 · burstUrl:9 · NUMBER_GLOW:12

## src/RankedScreens.tsx  (374 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LeagueKey:44 · EMBLEM:45 · RING:46 · LeagueRing:48 · LEAGUE_COLOR:53 · RANGES:54 · keyOfPoints:55 · labelOfPoints:56 · DECO:58 · CINZEL:59 · SERIF:60 · Win:63 · KitButton:79 · Row:83 · Divisions:91 · PointsBar:98 · Emblem:115 · LigasScreen:118 · daysLeftText:168 · nameOfLeague:169 · RewardsScreen:170 · RankingScreen:209 · RankedResult:254 · PromoBurst:282 · PromotionOverlay:296 · ConfirmDialog:323 · Chip:340 · MatchResult:345

## src/rarity.ts  (33 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Rarity:9 · RARITY_CODE:10 · RARITY_NAME:11 · RARITY_ORDER:12 · RARITY_ODDS:16 · FULLART_PACK_CHANCE:17 · rollRarity:18 · Shine:22 · shineOf:23 · NUMBERS:29 · cardNumber:30 · cardCode:31 · RarityCounts:32

## src/services/auth.ts  (130 linhas)
Login (convidado, Google, Discord, e-mail) via Supabase.

AuthProvider:9 · Session:10 · OAuthProvider:11 · URL:13 · KEY:14 · authMode:15 · LOCAL_SESSION_KEY:17 · clientPromise:19 · client:20 · getClient:29 · fromUser:31 · readLocal:36 · writeLocal:39 · localListeners:42 · emitLocal:43 · remoteListeners:46 · announceRemote:47 · getSession:49 · onSessionChange:56 · authErrorText:70 · signInOAuth:83 · signInEmail:90 · signInGuest:105 · authErrorDetail:120 · signOut:126

## src/services/cloud.ts  (114 linhas)
Salvar/ler coleção e decks na nuvem.

CloudProfile:5 · CloudResult:6 · COLUMNS:8 · fail:10 · fetchProfile:23 · usernameAvailable:31 · createProfile:39 · updateProfileFields:47 · RarityMap:58 · CloudDeck:59 · CloudStore:60 · RAR_KEYS:61 · splitRar:62 · joinRar:70 · fetchStore:76 · pushStore:94

## src/services/online.ts  (182 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:34 · QueueResult:57 · ActResult:62 · friendly:66 · call:68 · asActResult:86 · queueForMatch:91 · queueStatus:92 · cancelQueue:93 · sendAction:94 · tickMatch:96 · fetchResult:97 · fetchViews:103 · EmoteMsg:112 · EmoteResult:113 · asEmoteResult:114 · sendEmote:116 · fetchEmotes:117 · RankedView:120 · RankingRow:122 · fetchRanked:123 · fetchRanking:124 · claimSeason:127 · FriendRoom:130 · FriendResult:131 · friendCreate:132 · friendStatus:133 · friendCancel:134 · friendJoin:135 · friendPeek:136 · friendLink:141 · ReportReason:144 · reportOpponent:145 · deleteMyAccount:150 · FeedbackKind:155 · sendFeedback:156 · adminFeedbackDone:160 · adminBan:162 · adminUnban:163 · AdminInfo:166 · fetchAdmin:179 · pingPresence:181

## src/sfx.ts  (89 linhas)
Efeitos sonoros curtos por Web Audio.

ctx:6 · buffers:7 · loading:8 · debugOn:10 · dbgMark:12 · getCtx:14 · preloadSfx:17 · playSfx:25 · playSfxAt:44 · playWhoosh:60 · playDing:77

## src/shuffleFx.ts  (86 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

busy:8 · tex:9 · radial:10 · fxShuffle:13

## src/terrainFx.ts  (181 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

TerrainFxKind:11 · Side:12 · Sprite:13 · Inst:14 · SRC:16 · IMG:17 · readyP:18 · preloadTerrainFx:19 · clamp:21 · easeOut:22 · back:23 · seed:24 · GX:27 · TOWER_H:30 · wallRun:31 · SPRITES:35 · SIDE_X:40 · TORCHES:41 · ORDER:42 · Piece:43 · mkPiece:44 · PIECES:45 · SIDE_CHUNKS:46 · cv:50 · scn:51 · sc:52 · RES:53 · insts:54 · wanted:55 · ensureCanvas:57 · resize:64 · animated:65 · Geo:68 · geoOf:69 · spr:76 · dust:83 · flame:84 · torch:96 · pennant:103 · pedraPat:105 · drawSide:106 · redraw:154 · frame:155 · stopLater:163 · kick:164 · shutdown:165 · syncTerrainFx:168 · clearTerrainFx:177 · terrainHit:179

## src/triggers.ts  (41 linhas)
Ícones/nomes dos gatilhos (Convocação, Ofensiva, ...).

TRIGGER_ICON:13 · TRIGGER_GLOW:20 · triggerKeyOf:22 · triggerOf:25 · pulsing:32 · listeners:33 · emit:34 · pulseCard:35 · usePulse:39

## src/TurnTracker.tsx  (145 linhas)
Marcador de turno/fases na tela da partida.

TRACKER_PHASES:11 · MEDALLION_X:13 · BAND_TOP:15 · TRACKER_NAMES:17 · PALETTE:21 · PLATE_W:28 · END_W:30 · trackerScale:31 · useTrackerScale:32 · Props:42 · TurnTracker:62

## src/tutorial/script.ts  (248 linhas)
Dados do tutorial 1: partida fixa, jogadas do treinador, passos e falas.

TutorialMeta:8 · TUTORIALS:9 · Expr:16 · NPC_NAME:17 · Tgt:20 · Until:27 · Step:36 · CHAPTERS:54 · HAND_P:57 · PILE_P:58 · HAND_E:59 · PILE_E:60 · uid:62 · TUTORIAL_STATS:64 · fresh:69 · createTutorialMatch:76 · EnemyMove:88 · ADV:89 · ENEMY_SCRIPT:90 · nextEnemyAction:96 · PlayerMove:107 · PLAYER_PATH:108 · G:116 · E:117 · row:118 · TRACKER:119 · GOLD_ME:120 · GOLD_FOE:121 · INTRO_LINES:124 · COIN_STEP:131 · STEPS:133 · R:201 · BEATS:202 · OUTRO:215 · playTutorialForTest:221

## src/tutorial/ui.tsx  (266 linhas)
Peças visuais do tutorial: Aldric, mãozinha, escurecimento com buracos, lista.

NPC_ART:13 · npcArt:14 · GLYPH:15 · FONT_HEAD:17 · FONT_BODY:18 · NpcPortrait:20 · NpcPhoto:52 · PanelProps:78 · NpcPanel:88 · TapHand:136 · Hole:148 · roundedRectUri:154 · Spotlight:157 · DONE_KEY:193 · loadTutorialsDone:194 · markTutorialDone:195 · TutorialList:197 · TutorialIntro:234

## src/ui/Kit.tsx  (142 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

KitWindow:18 · KitTitle:22 · KitButton:29 · KitRow:40 · KitTab:50 · KitToggle:57 · KitRange:61 · KIT_ICONS:84 · KitIcon:86 · KitIconButton:91 · KitPlate:102 · KitCount:110 · KitSearch:114 · KitCoins:123 · KitField:130 · PromptTitle:135

## src/ui/ThinFrame.tsx  (72 linhas)
Moldura fina reutilizável.

ThinFrame:16 · GameBox:38 · TONE_ART:53 · TONE_TEXT:54 · GameButtonTone:55 · GameButton:57

## server/edge.ts  (41 linhas)
Entrada da Edge Function (gerada em supabase/functions/game).

cors:10 · json:15

## server/handler.ts  (745 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:20 · defaultConfig:32 · MatchInit:34 · EMOTE_CODE:65 · EMOTE_GAP_MS:66 · EMOTE_MAX_PER_MATCH:67 · RankedView:70 · PLACEMENT:73 · REPEAT_LIMIT:74 · frameRank:75 · calendar:77 · rankedView:82 · ladderOf:95 · GameRequest:108 · GameResponse:134 · BOT_PROFILE:151 · STALE_MATCH_MS:152 · BOT_STEP_LIMIT:153 · AUTO_STEP_LIMIT:154 · recipeDeck:156 · botDeckFor:158 · playerOf:159 · userOfSeat:160 · moverOf:161 · moverKey:162 · Work:167 · startWork:176 · applyStep:179 · runBot:202 · patchOf:213 · pickRankedOpponent:222 · ensureRewards:240 · publicReward:285 · rewardOf:291 · enforceClock:296 · openMatch:334 · viewRowsOf:341 · initOf:343 · startMatch:370 · finishIfStale:396 · OPS:407 · badRequest:408 · withTotals:440 · cleanRar:446 · Who:460 · isAdmin:461 · ONLINE_MS:462 · LIMITS:466 · DEFAULT_LIMIT:470 · hits:471 · rateLimited:472 · resetRateLimits:480 · REPORT_DAILY_MAX:481 · ROOM_MS:482 · ROOM_ALPHABET:483 · handleGame:485

## server/memoryDb.ts  (194 linhas)
Banco em memória (testes).

MemoryTables:8 · clone:13 · MemoryDb:15

## server/supabaseDb.ts  (261 linhas)
Banco no Supabase.

Client:10 · must:12 · viewToDb:17 · viewFromDb:20 · profileFromDb:21 · matchFromDb:22 · supabaseDb:24

## server/types.ts  (241 linhas)
Tipos do servidor e do banco.

DeckRar:8 · DeckJson:9 · RoomRow:12 · QueueRow:14 · StepRow:24 · ViewRow:32 · EndReason:43 · RewardRow:45 · RankedOutcome:59 · MatchRow:66 · MatchPatch:87 · EmoteRow:90 · SeasonRow:93 · AdminOverview:96 · FeedbackKind:111 · FEEDBACK_KINDS:112 · FeedbackRow:113 · AdminFeedback:114 · ReportReason:115 · REPORT_REASONS:116 · ReportRow:117 · AdminReport:118 · AdminPlayer:122 · Db:131 · buildAdminPlayers:198 · dayKey:216 · lastDays:217 · windowsOf:218 · buildAdminReports:224 · buildAdminFeedback:238

## tests/ai-arena.ts  (39 linhas)
IA nova contra a antiga.

N:9 · D:10 · planWins:11 · byDeck:12

## tests/ai-ration.ts  (85 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:12 · Rec:13 · RATION:14 · play:16 · main:48

## tests/atk-audit.ts  (46 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

DECKS:11 · D:12 · N:13 · stat:14 · play:17 · pairs:38 · f:40

## tests/atk-combo.ts  (29 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

n:6 · mk:7 · s:8 · B:11 · act:14 · show:15 · rl:18

## tests/balance-campo.ts  (132 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Patch:29 · Per:30 · Rec:31 · setupOf:33 · applyPatch:37 · bump:54 · playGame:56 · pct:86 · main:88

## tests/balance-comeback.ts  (32 linhas)
Mede viradas (comeback) a partir dos resultados do laboratório.

G:5 · games:6 · afterRound:7 · trailed:21

## tests/balance-lab.ts  (115 linhas)
LABORATÓRIO de balanceamento: joga muitas partidas IA × IA, com patches "e se" (docs/balanceamento.md).

Patch:21 · Per:22 · GameRecord:24 · applyPatch:26 · bump:48 · playGame:50 · main:90

## tests/balance-matchup.ts  (32 linhas)
Teste rápido Cardeal × Capitão.

N:9 · cardealWins:14

## tests/balance-merc.ts  (141 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Patch:29 · Per:30 · Rec:31 · setupOf:33 · applyPatch:37 · bump:54 · playGame:56 · pct:86 · main:88

## tests/balance-report.ts  (130 linhas)
Transforma os resultados do laboratório em uma página (relatório lado a lado).

Per:5 · G:6 · Lab:7 · load:9 · mean:10 · se:11 · summarize:13 · base:51 · detail:52 · variants:53 · html:54 · BASE:77 · pct:78 · summary:79 · deckTable:87 · changes:106 · compare:114 · h:123

## tests/balance-rules-preload.ts  (7 linhas)
Passa as regras do patch (ouro, início do combate) ao motor antes de ele carregar.

## tests/balance-todos-report.ts  (32 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

g:3 · IDS:4 · avg:5 · row:6 · per:7 · dur:15 · types:25 · modes:29

## tests/balance-todos.ts  (64 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

IDS:13 · Per:14 · Rec:15 · bump:16 · unitsOf:17 · playGame:19 · main:48

## tests/campo-rules.ts  (165 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

passed:11 · test:12 · eq:13 · ok:14 · n:16 · mk:17 · A:18 · campoSetup:19 · fresh:20 · put:26 · give:27 · act:28 · arm:29

## tests/cloud-rarity.ts  (14 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

ok:3 · check:4 · rar:5 · joined:6 · back:8

## tests/cost-audit.ts  (34 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

UNITS:10 · bandCost:11 · defs:12 · where:13 · rows:19 · off:32

## tests/deck-rules.ts  (63 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

passed:4 · test:5 · ok:6 · eq:7 · recipe:9 · listOf:11

## tests/edge-bundle.ts  (21 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

dir:10 · out:11 · cmd:12 · fresh:14 · committed:15

## tests/engine-rules.ts  (1337 linhas)
Um cenário por regra do jogo (npm test).

passed:19 · test:20 · eq:23 · ok:26 · n:29 · FIXTURE_HP:31 · mk:32 · fresh:37 · put:48 · give:49 · act:50 · refused:55 · names:60 · combat:61 · ambushSetup:438 · shielded:740 · aiTurn:801 · atkOf:995 · endTurnOf:996 · freshMerc:1198 · toNextTurn:1205

## tests/engine-sim.ts  (186 linhas)
Partidas IA × IA com invariantes, repetição determinística e fuzz (npm test).

failures:13 · usage:14 · tactics:15 · discards:16 · check:17 · allCards:19 · invariants:27 · play:48 · decks:81 · finished:82 · winsByDeck:83 · rnd:112 · R:113 · accepted:114

## tests/match-report.ts  (164 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Turn:15 · Game:16 · blank:25 · SOLD:26 · material:27 · count:28 · SLOT:29 · play:31 · avg:86 · f:87 · main:89

## tests/missions.ts  (21 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

fails:3 · off:9 · best:12 · dailyMax:13 · perDay:15 · onMax:17

## tests/mock-supabase.ts  (119 linhas)
Supabase falso para os testes online.

Row:10 · tables:11 · memory:12 · cfg:13 · b64:18 · users:19 · cors:20 · send:26 · readBody:30 · uidFrom:33

## tests/online-server.ts  (724 linhas)
Testes do servidor online (npm test).

passed:14 · test:15 · ok:18 · eq:19 · clock:21 · rngState:22 · cfg:23 · fresh:28 · deckOf:41 · matched:47 · userOf:49 · choose:51 · botMatch:53 · pvp:60 · drive:68

## tests/ranked.ts  (94 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

passed:3 · test:4 · ok:5 · eq:6 · play:7 · veteran:8

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

## tools/gerar-filtro-sql.ts  (85 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

arr:6 · sql:7

## tools/mercenarios-prompts.ts  (216 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

slug:8 · LOOK:11 · LAND:12 · TALL:13 · END_LAND:14 · END_TALL:15 · Entry:17 · ENTRIES:19 · defs:132 · recipe:133 · order:134 · DELIVERED:138 · promptOf:139 · kind:140 · stats:141 · cleanEffect:142 · allOrdered:145 · numberOf:146 · ordered:147 · md:148 · readmePath:156 · readme:157 · start:158 · esc:170 · cards:171 · html:179

## tools/mercenarios-tabela.ts  (20 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

rows:6 · table:12 · path:13 · doc:14 · start:15 · end:16

## tools/video/gerar-defs.ts  (7 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

d:3 · out:4
