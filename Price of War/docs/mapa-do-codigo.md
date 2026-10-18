<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (12072 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:12 · CollectionRoom:13 · AVATAR_FILES:75 · avatarFile:76 · ALL_PRELOAD_IMAGES:286 · DRAW_FLIGHT_MS:312 · sfxVol:321 · playCardDrawSfx:322 · playCardPlaySfx:336 · playAttackSfx:343 · playEffectSfx:345 · lastEffectSfxAt:346 · playEffectSfxOnce:347 · playTacticSfx:348 · playSelectSfx:356 · bannerAudioCtx:368 · playBannerSfx:369 · playUiClickSfx:412 · playCardLiftSfx:421 · playDamageSfx:433 · playGeneralDamageSfx:438 · playDestroySfx:448 · playAshArriveSfx:449 · playRevealGeneralSfx:451 · playWarHornSfx:457 · playBatalhaBannerSfx:462 · playBatalhaImpactSfx:470 · CardType:476 · CardData:478 · StatTone:529 · STAT_TONE_COLOR:530 · STAT_TONE_GRADIENT:531 · statsOf:536 · SlotHint:545 · getSlotHint:554 · RowRoleHint:560 · SOLDIER_CARD_TYPES:561 · getRowRoleHint:562 · ROW_ROLE_VIEW:569 · PHASE_BANNER_TEXT:593 · BATALHA_FALL_MS:615 · BATALHA_IMPACT_FRACTION:616 · BANNER_LEARN_COUNT:620 · bannersSeen:621 · PHASE_BANNER_STAGE_MS:622 · phaseBannerMs:623 · PHASE_BANNER_Y:631 · PHASE_BANNER_MOTION:632 · HIT_STOP_MS:643 · ATTACK_MS:646 · ATTACK_WINDUP_FRAC:647 · ATTACK_WINDUP_PX:648 · ATTACK_TILT_DEG:649 · IMPACT_MS:650 · TIME:653 · rangedKindOf:655 · FINAL_SLOW:656 · FINAL_INTRO_MS:657 · FINAL_FREEZE_MS:658 · FINAL_AFTER_MS:659 · SLASH_SPARK_ANGLES:662 · SlashEffect:671 · TargetKind:709 · TARGET_STYLE:710 · HUD_CARD_SCALE:716 · AmountBadge:720 · TargetingHud:737 · READY_COLORS:807 · SILHOUETTES:812 · silhouetteFor:817 · DEBUG_HOOKS:828 · TriggerIcon:830 · FLIGHT_MS:844 · HELD_SCALE:845 · HELD_GAP:846 · TriggerBurst:847 · TriggerFloatLayer:868 · AbilityReadyGlow:885 · TutRect:913 · tutPct:914 · tutSilBox:915 · tutElRect:924 · tutPad:925 · tutUnion:926 · TutResolved:931 · TUT_EMPTY:932 · visibleHandCards:933 · resolveTutTarget:934 · TutorialStage:981 · SpriteOnce:1025 · EffectIcon:1042 · EFFECT_ICONS:1043 · SpriteIcon:1051 · IconPop:1056 · SHIELD_SHEETS:1072 · GOLD_BUBBLE:1078 · ShieldAura:1079 · ShieldFxOnce:1088 · EquipFxLayer:1102 · PUNCH_FRAMES:1148 · PUNCH_FRAME_W:1149 · DRAW_STYLE:1157 · DrawFlightNovo:1158 · RepositionLegNovo:1203 · FlyingCardNovo:1229 · lastArrowKey:1267 · drawFlightDelay:1268 · PunchFx:1269 · BURN_FRAMES:1305 · BurningCard:1307 · GraveyardPile:1363 · AtkBadge:1395 · NUMBER_KIND_OF:1407 · NUM_H:1410 · bangsOf:1411 · floatLife:1412 · FloatNumber:1413 · HpBadge:1456 · GoldBadge:1485 · GoldNumber:1514 · CardBack:1574 · CARD_THICKNESS_SHADOW:1612 · cardBoxShadow:1623 · cardGlowFilter:1624 · CARD_FACE_VARIANTS:1634 · NO_STAT_TYPES:1651 · templateForType:1652 · templateForTypeMini:1657 · FitText:1676 · KeywordPill:1751 · STAT_TOKEN:1765 · STAT_NUMBER_STYLE:1766 · StatSymbol:1767 · CoinIcon:1775 · GoldSymbol:1778 · DamageSymbol:1783 · RULE_WORD_STYLE:1795 · renderEffectText:1796 · FitEffectText:1836 · FULL_ART_PLATE_VARIANTS:1900 · FULL_ART_SIZE_FIX:1910 · CardFaceFullArt:1911 · FullArtMiniConfig:2035 · FULL_ART_MINI_CONFIG:2040 · usesLightBar:2068 · nameTextStyle:2069 · FULL_ART_MINI_DEFAULT:2072 · fullArtMiniConfigForType:2077 · CardFaceFullArtMini:2092 · CARD_FACE_MINI_STD_SCALE:2142 · CardFaceStandardMini:2143 · rarNameCls:2209 · RarityCardShine:2210 · CardFace:2215 · BOARD_EXTERIOR_ART_URL:2329 · FIELD_PREVIEW_SCALE:2334 · BOARD_PREVIEW_SCALE:2352 · FAN_SPREAD_DEG:2355 · FAN_LIFT_PX:2356 · HAND_CARD_WIDTH:2357 · HAND_CARD_HEIGHT:2358 · HAND_CARD_STEP:2361 · HAND_FULL_SPREAD_COUNT:2364 · HAND_SELECT_SCALE:2367 · handStepFor:2368 · ART_BY_NAME:2375 · MERC_ART_FILES:2429 · artSlug:2430 · CAMPO_ART_FILES:2436 · CAPITAO_ART_FILES:2442 · cardDataFromName:2448 · buildDeckCards:2452 · DECK_CAPITAO:2460 · DECK_CARDEAL:2461 · DECK_MERCENARIOS:2462 · DECK_CAMPO:2463 · DECKS:2467 · ALL_DECK_IDS:2497 · DECK_STORE_KEY:2509 · CARD_INSTANCES_BY_NAME:2511 · cardByName:2519 · isGeneralName:2520 · DeckSlot:2522 · DeckStore:2524 · DeckSelection:2526 · lastDeckRar:2527 · OnlineMatch:2533 · needsServer:2565 · visibleKey:2577 · countByName:2582 · CAPITAO_STARTER_NAME:2588 · MERC_STARTER_NAME:2589 · CAMPO_STARTER_NAME:2590 · CLOUD_DECK_SLOTS:2592 · MAX_DECK_SLOTS:2593 · buildStarterStore:2596 · sameCards:2620 · ensureStarterDecks:2624 · lastSanitizeMigrated:2656 · sanitizeDeckStore:2657 · loadDeckStore:2695 · cloudUserId:2709 · pushTimer:2710 · pushing:2711 · pushAgain:2712 · toCloudDecks:2713 · runPush:2714 · saveDeckStore:2727 · stopCloudSync:2732 · flushCloudSync:2734 · syncDeckStoreWithCloud:2745 · deckCardCount:2776 · deckProblem:2778 · buildDeckSelection:2786 · deckIdOfGeneral:2795 · DEFAULT_DECK_SELECTION:2796 · PlayerProfile:2805 · AVATAR_OPTIONS:2821 · avatarById:2874 · PROFILE_STORAGE_KEY:2876 · DEFAULT_PROFILE:2877 · loadProfile:2890 · formatCoroas:2904 · saveProfile:2909 · MODE_LABELS_PT:2918 · AvatarBadge:2928 · PlayerPlate:2943 · WINDOW_FRAME_PX:2972 · WINDOW_FONT_DECO:2973 · FramedWindow:2975 · WindowOverlay:2980 · WindowDivider:3003 · WindowTitle:3011 · Edges:3019 · ArtFrame:3020 · VLine:3041 · HLine:3044 · ArtChip:3049 · WindowOption:3055 · WindowText:3059 · WindowButton:3063 · AvatarPickerModal:3069 · ALLOW_PROFILE_RENAME:3117 · ProfileBar:3118 · ComingSoonModal:3239 · ONLINE_MODES:3255 · OnlineModeModal:3260 · TapPhase:3292 · MENU_CONFIRM_MS:3293 · useMenuTap:3294 · PlaqueSparks:3318 · PLAQUE_ASPECT:3337 · PLAQUE_CAP_CQW:3338 · MenuCard:3339 · MenuTextButton:3388 · ago:3402 · GmPanel:3403 · MenuIconButton:3494 · MainMenu:3525 · InstallPrompt:3662 · DeckPickerModal:3698 · CARD_TYPE_ORDER:3729 · DeckSide:3730 · EditorSort:3731 · EDITOR_SORTS:3732 · EDITOR_MARGIN:3733 · EDITOR_FRAME:3734 · EDITOR_PAD:3735 · LIST_COLS:3738 · ROW_H:3739 · FULL_ART_TILE_SCALE:3740 · DeckEditor:3742 · ShopPhase:4322 · NpcMood:4323 · BoosterDef:4324 · BOOSTERS:4326 · TEST_FREE_BOOSTERS:4335 · SHELF_ROWS:4336 · SHELF_COLS:4337 · BOOSTER_ASPECT:4338 · SHELF_X0:4343 · SHELF_X1:4344 · SHELF_PLANKS:4345 · SHELF_OVERVIEW:4346 · SHELF_CLOSEUP:4347 · NPC_LINES:4349 · SHOP_ART:4357 · BoosterArt:4364 · NpcArt:4376 · PACK_TEAR_Y:4383 · LID_SLICES:4384 · LidSlice:4390 · PackTear:4413 · PulledCard:4482 · ownedOf:4484 · applyAdds:4489 · toPulled:4497 · OpenResult:4503 · openBoosterFlow:4504 · PackOpeningOld:4518 · CARD3D_FILES:4599 · card3dUrl:4600 · Booster3DOpening:4601 · PackOpening:4645 · OpenBoosterFromTable:4650 · ShopScreen:4665 · AuthBackdrop:4908 · GoogleMark:4929 · DiscordMark:4932 · AuthButton:4934 · authFieldClass:4940 · WelcomeBack:4943 · LoginScreen:4979 · NAME_RULE:5043 · ProfileSetupScreen:5045 · VolumeRow:5112 · ToggleRow:5121 · REPORT_REASON_LABELS:5131 · ReportModal:5132 · makeFeedbackContext:5164 · FEEDBACK_LABELS:5170 · FeedbackModal:5171 · OptionsModal:5204 · SettingsModal:5240 · playCoinSfx:5292 · lastGoldSfx:5318 · playGoldSpendSfx:5319 · COIN_THICK:5323 · CoinFace:5324 · CoinRim:5333 · RemotePick:5352 · CoinToss:5353 · MatchSearchOverlay:5435 · OnlineSearchOverlay:5476 · LoadingScreen:5603 · App:5657 · IMMEDIATE_ZONE_LABEL:11518 · DragFinger:11523 · GuideInfo:11540 · DragGuide:11541 · arrivalDrops:11608 · arrivalListener:11610 · EmblemKind:11615 · EMBLEM_ART:11616 · SlotEmblem:11617 · RowPlaque:11630 · CardSlot:11642

Dentro de `App` (linhas 5657–11517), funções internas:
attackMarkFor:5931 · openCardPicker:5958 · spawnFloatingNumber:5994 · spawnFloatingNumberAtId:6010 · showBanner:6037 · announcePhase:6061 · announceTurnChange:6071 · trackOverlay:6104 · beginFinalBlow:6113 · endFinalBlow:6114 · blowIsSoaked:6117 · handleInstallClick:6206 · shieldOverSlot:6262 · popOverSlot:6274 · burstAt:6303 · glowTarget:6318 · trigFxAt:6331 · whenGlowDone:6337 · endGlow:6338 · startTriggerFx:6342 · holdForSeat:6370 · terrainFxPlayer:6398 · terrainFxNpc:6399 · fireImpactBurst:6415 · noteDragPlay:6439 · handFanMaxAngleRad:6509 · getHandArrivalPoint:6621 · getFanRotation:6641 · getFanLift:6648 · computeDrawOrigin:6663 · showToast:6678 · announceCardPlay:6684 · rarityOfCard:6762 · toCardData:6769 · shownStats:6785 · boardView:6796 · syncView:6801 · processEvents:6837 · armedSlotsOf:7078 · cardOverlayFx:7079 · fxRectOf:7196 · fxEnvFor:7202 · pickTacticSpot:7219 · tacticFxOf:7228 · planFx:7232 · commitState:7262 · dispatchAction:7285 · wakeWaiter:7304 · publishClock:7305 · dispatchOnline:7307 · reconcileOwn:7343 · applyUnasked:7357 · ingestRows:7371 · chooseFirstOnline:7399 · absorbAct:7412 · refuseOwn:7421 · sendOnline:7433 · stopOnline:7447 · startOnlinePolling:7464 · fxIdleNow:7482 · waitFxIdle:7483 · nextOpponentAction:7491 · applyRewardToProfile:7518 · openPlayerPick:7525 · playerAct:7553 · openModePrompt:7565 · maybePromptRelicMode:7572 · confirmRelicMode:7581 · confirmUpkeep:7593 · canPlayNow:7606 · readyAttackers:7607 · endTurnWarning:7610 · askEndTurn:7618 · endTurnNow:7624 · sleep:7643 · tutCurrent:7655 · tutCanBack:7659 · tutShow:7664 · tutGo:7680 · tutNext:7688 · tutBack:7702 · tutMatches:7707 · tutSignal:7719 · tutFromAction:7724 · tutBeat:7731 · tutExit:7738 · tutFinish:7745 · startTutorial:7746 · tutLaunchDuel:7751 · tutCoinResolved:7753 · settleAmbush:7810 · startMatchIntro:7843 · continueMatchIntro:7862 · resetGame:7958 · startGame:8018 · startOnlineMatch:8025 · leaveMatch:8067 · handleCardClick:8464 · handlePlayCardButtonClick:8524 · abilityStepCandidates:8583 · abilityHasTargets:8586 · getPlayerCreatureAbilityKind:8608 · getCardVisualEl:8622 · triggerPunch:8713 · renderTravelingArrow:8764 · playPendingTactic:8791 · resolveOwnTacticTarget:8798 · resolveEnemyTacticTarget:8803 · toggleCardPickerSelection:8811 · abilityOf:8825 · nextAbilityStep:8827 · activateAbility:8833 · abilityStepSide:8847 · resolveAbilityTarget:8853 · pushAbilityPrompt:8890 · mine:8911 · foes:8912 · effectTargetKind:8915 · specSlots:8917 · tacticTargeting:8931 · sourceAt:8938 · cancelTargeting:8956 · playHandCardOnTarget:8959 · heldTop:8966 · slotUnder:8967 · clearDragOver:8976 · dragBlockReason:8978 · tapHandCard:8992 · beginPress:9000 · returnHeld:9017 · dropHeldCard:9026 · updateHeld:9055 · dropOk:9074 · handleSlotClick:9130 · handleNpcSlotClick:9310 · handleBackgroundClick:9376 · getTappedCardShift:9407 · getSelectedCardX:9417 · getSelectedCardY:9439 · getBoardAnimation:9463 · getPlayerSlotHint:9504 · isTacticTargetSlot:9523 · tacticTagFor:9531 · boardHeightMultiplier:9607 · boardTopMargin:9608

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

## src/engine/boosters.ts  (64 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

BOOSTER_PRICE:7 · BOOSTER_CARDS:8 · BOOSTER_IDS:9 · DUP_COROAS:11 · NEW_CARD_BOOST:13 · PoolEntry:15 · boosterPool:17 · Pull:26 · rollBooster:28 · Settled:44 · settleBooster:51

## src/engine/catalog.ts  (600 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · equip:12 · GRAVE_EQUIP:14 · DECK_EQUIP:15 · ARMED:16 · CARD_DEFS:18 · DeckId:344 · DeckRecipe:346 · DECK_RECIPES:348 · BALANCE:460 · BOOSTER_EXTRA:471 · STARTER_TRIM:480 · starterDeckCards:481 · LEGACY_STARTERS:489 · BY_NAME:516 · getCardDef:519 · registerCardDefs:521 · requireCardDef:522 · LEGACY_CARD_NAMES:529 · currentCardName:585 · currentNames:587 · isGeneralName:592 · TOKEN_DEFS:596

## src/engine/deck.ts  (31 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_DEFAULT_MAX_COPIES:8 · maxCopiesOf:9 · deckCardCount:11 · deckProblem:16

## src/engine/experimental.ts  (17 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

names:8 · MERCENARIOS_DEFS:9 · MERCENARIOS_RECIPE:10 · registerMercenarios:11 · campoNames:13 · CAMPO_DEFS:14 · CAMPO_RECIPE:15 · registerCampo:16

## src/engine/game.ts  (1117 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:85 · RuleError:88 · fail:89 · log:91 · P:92 · combatOpen:94 · activePhases:95 · addGold:98 · removeOne:107 · takeFromDeck:108 · drawCards:110 · removeFromHand:123 · discard:130 · sendDestroyed:137 · reinforceFrom:166 · setWinner:183 · soak:192 · grantShield:204 · grantBlock:210 · damageSlot:218 · healSlot:234 · startTurn:244 · enterPreparation:302 · payUpkeep:309 · setRelicMode:342 · runTurnEnd:356 · endTurn:376 · assertCanAct:386 · Fx:397 · uniqueByName:404 · matchesFilter:405 · filterLabel:412 · specCandidates:415 · checkTarget:419 · activeTargets:437 · validateTargets:441 · checkVerb:448 · checkVerbTarget:462 · openPick:466 · runVerb:475 · runAbilities:634 · grantMovedBuff:642 · playCard:652 · useAbility:719 · choose:759 · attack:817 · respondAmbush:843 · resolveAmbushEffect:860 · resolveCombat:896 · move:980 · advance:1013 · discardExcess:1035 · clone:1052 · applyAction:1054 · MatchLog:1096 · newMatchLog:1103 · replayMatch:1106

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

## src/menuMusic.ts  (47 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

ctx:6 · buffer:7 · loading:8 · source:9 · gain:10 · wanted:11 · unsub:12 · FADE_IN:13 · level:15 · begin:16 · unlock:24 · startMenuMusic:26 · stopMenuMusic:39

## src/MissionsScreen.tsx  (206 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CINZEL:22 · SERIF:23 · TAG:24 · Tab:25 · left:26 · COINS:29 · SPARKS:30 · Spark:31 · CollectFx:32 · MissionRow:66 · MissionsScreen:103 · MissionsHost:205

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

## src/rewardSfx.ts  (26 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

ctx:3 · ac:4 · tone:5 · playRewardSfx:11

## src/services/auth.ts  (130 linhas)
Login (convidado, Google, Discord, e-mail) via Supabase.

AuthProvider:9 · Session:10 · OAuthProvider:11 · URL:13 · KEY:14 · authMode:15 · LOCAL_SESSION_KEY:17 · clientPromise:19 · client:20 · getClient:29 · fromUser:31 · readLocal:36 · writeLocal:39 · localListeners:42 · emitLocal:43 · remoteListeners:46 · announceRemote:47 · getSession:49 · onSessionChange:56 · authErrorText:70 · signInOAuth:83 · signInEmail:90 · signInGuest:105 · authErrorDetail:120 · signOut:126

## src/services/cloud.ts  (114 linhas)
Salvar/ler coleção e decks na nuvem.

CloudProfile:5 · CloudResult:6 · COLUMNS:8 · fail:10 · fetchProfile:23 · usernameAvailable:31 · createProfile:39 · updateProfileFields:47 · RarityMap:58 · CloudDeck:59 · CloudStore:60 · RAR_KEYS:61 · splitRar:62 · joinRar:70 · fetchStore:76 · pushStore:94

## src/services/online.ts  (204 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:34 · QueueResult:57 · ActResult:62 · friendly:66 · call:68 · asActResult:86 · queueForMatch:91 · queueStatus:92 · cancelQueue:93 · sendAction:94 · tickMatch:96 · fetchResult:97 · fetchViews:103 · EmoteMsg:112 · EmoteResult:113 · asEmoteResult:114 · sendEmote:116 · fetchEmotes:117 · RankedView:120 · RankingRow:122 · fetchRanked:123 · fetchRanking:124 · claimSeason:127 · FriendRoom:130 · FriendResult:131 · friendCreate:132 · friendStatus:133 · friendCancel:134 · friendJoin:135 · friendPeek:136 · friendLink:141 · ReportReason:144 · reportOpponent:145 · deleteMyAccount:150 · FeedbackKind:155 · sendFeedback:156 · adminFeedbackDone:160 · adminBan:162 · adminUnban:163 · AdminInfo:166 · fetchAdmin:179 · pingPresence:181 · MissionView:184 · MissionsBoard:185 · MissionsResult:186 · missionsCall:187 · fetchMissions:192 · claimMission:193 · rerollMission:194 · BoosterCard:197 · BoosterResult:198 · openBoosterOnServer:199

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

## src/VillageScene.tsx  (142 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

ICONS:16 · IW:20 · VillageId:21 · BUILDINGS:24 · GLOWS:34 · SOURCES:35 · SPR_META:37 · SPR_SRC:38 · Particle:39 · VillageScene:41

## server/edge.ts  (41 linhas)
Entrada da Edge Function (gerada em supabase/functions/game).

cors:10 · json:15

## server/handler.ts  (808 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:23 · defaultConfig:35 · MatchInit:37 · EMOTE_CODE:68 · EMOTE_GAP_MS:69 · EMOTE_MAX_PER_MATCH:70 · RankedView:73 · PLACEMENT:76 · REPEAT_LIMIT:77 · frameRank:78 · calendar:80 · rankedView:85 · ladderOf:98 · GameRequest:111 · GameResponse:141 · BOT_PROFILE:160 · STALE_MATCH_MS:161 · BOT_STEP_LIMIT:162 · AUTO_STEP_LIMIT:163 · recipeDeck:165 · botDeckFor:167 · playerOf:168 · userOfSeat:169 · moverOf:170 · moverKey:171 · Work:176 · startWork:185 · applyStep:188 · runBot:211 · patchOf:222 · pickRankedOpponent:231 · ensureRewards:249 · UNIT_TYPES:295 · countMissions:296 · publicReward:314 · rewardOf:320 · enforceClock:325 · openMatch:363 · viewRowsOf:370 · initOf:372 · startMatch:399 · finishIfStale:425 · OPS:436 · badRequest:437 · withTotals:472 · cleanRar:478 · Who:492 · isAdmin:493 · ONLINE_MS:494 · LIMITS:498 · DEFAULT_LIMIT:502 · hits:503 · rateLimited:504 · resetRateLimits:512 · REPORT_DAILY_MAX:513 · ROOM_MS:514 · ROOM_ALPHABET:515 · handleGame:517

## server/memoryDb.ts  (215 linhas)
Banco em memória (testes).

MemoryTables:8 · clone:13 · MemoryDb:15

## server/missions.ts  (146 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

MissionItem:8 · MissionState:9 · MissionView:10 · MissionsBoard:11 · BR:16 · weekStart:17 · dayEndsAt:18 · weekEndsAt:19 · seedOf:22 · rngOf:23 · shuffled:24 · drawMissions:26 · defOf:36 · kindOfKey:37 · load:40 · mutate:51 · keysAt:61 · MatchFacts:63 · countMatch:65 · viewOf:85 · syncSeason:91 · board:101 · claim:115 · reroll:133

## server/supabaseDb.ts  (282 linhas)
Banco no Supabase.

Client:10 · must:12 · viewToDb:17 · viewFromDb:20 · profileFromDb:21 · matchFromDb:22 · supabaseDb:24

## server/types.ts  (250 linhas)
Tipos do servidor e do banco.

DeckRar:8 · DeckJson:9 · RoomRow:12 · QueueRow:14 · StepRow:24 · ViewRow:32 · EndReason:43 · RewardRow:45 · RankedOutcome:59 · MatchRow:66 · MatchPatch:87 · EmoteRow:90 · SeasonRow:93 · AdminOverview:96 · FeedbackKind:111 · FEEDBACK_KINDS:112 · FeedbackRow:113 · AdminFeedback:114 · ReportReason:115 · REPORT_REASONS:116 · ReportRow:117 · AdminReport:118 · AdminPlayer:122 · MissionStateRow:131 · Db:133 · buildAdminPlayers:207 · dayKey:225 · lastDays:226 · windowsOf:227 · buildAdminReports:233 · buildAdminFeedback:247

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

## tests/mock-supabase.ts  (128 linhas)
Supabase falso para os testes online.

Row:10 · tables:11 · memory:12 · cfg:13 · b64:18 · users:19 · cors:20 · send:26 · readBody:30 · uidFrom:33

## tests/online-server.ts  (813 linhas)
Testes do servidor online (npm test).

passed:16 · test:17 · ok:20 · eq:21 · clock:23 · rngState:24 · cfg:25 · fresh:30 · deckOf:43 · matched:49 · userOf:51 · choose:53 · botMatch:55 · pvp:62 · drive:70

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
