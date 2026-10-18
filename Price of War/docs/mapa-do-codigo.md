<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (12059 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:12 · CollectionRoom:13 · AVATAR_FILES:75 · avatarFile:76 · ALL_PRELOAD_IMAGES:284 · DRAW_FLIGHT_MS:310 · sfxVol:319 · playCardDrawSfx:320 · playCardPlaySfx:334 · playAttackSfx:341 · playEffectSfx:343 · lastEffectSfxAt:344 · playEffectSfxOnce:345 · playTacticSfx:346 · playSelectSfx:354 · bannerAudioCtx:366 · playBannerSfx:367 · playUiClickSfx:410 · playCardLiftSfx:419 · playDamageSfx:431 · playGeneralDamageSfx:436 · playDestroySfx:446 · playAshArriveSfx:447 · playRevealGeneralSfx:449 · playWarHornSfx:455 · playBatalhaBannerSfx:460 · playBatalhaImpactSfx:468 · CardType:474 · CardData:476 · StatTone:527 · STAT_TONE_COLOR:528 · STAT_TONE_GRADIENT:529 · statsOf:534 · SlotHint:543 · getSlotHint:552 · RowRoleHint:558 · SOLDIER_CARD_TYPES:559 · getRowRoleHint:560 · ROW_ROLE_VIEW:567 · PHASE_BANNER_TEXT:591 · BATALHA_FALL_MS:613 · BATALHA_IMPACT_FRACTION:614 · BANNER_LEARN_COUNT:618 · bannersSeen:619 · PHASE_BANNER_STAGE_MS:620 · phaseBannerMs:621 · PHASE_BANNER_Y:629 · PHASE_BANNER_MOTION:630 · HIT_STOP_MS:641 · ATTACK_MS:644 · ATTACK_WINDUP_FRAC:645 · ATTACK_WINDUP_PX:646 · ATTACK_TILT_DEG:647 · IMPACT_MS:648 · TIME:651 · rangedKindOf:653 · FINAL_SLOW:654 · FINAL_INTRO_MS:655 · FINAL_FREEZE_MS:656 · FINAL_AFTER_MS:657 · SLASH_SPARK_ANGLES:660 · SlashEffect:669 · TargetKind:707 · TARGET_STYLE:708 · HUD_CARD_SCALE:714 · AmountBadge:718 · TargetingHud:735 · READY_COLORS:805 · SILHOUETTES:810 · silhouetteFor:815 · DEBUG_HOOKS:826 · TriggerIcon:828 · FLIGHT_MS:842 · HELD_SCALE:843 · HELD_GAP:844 · TriggerBurst:845 · TriggerFloatLayer:866 · AbilityReadyGlow:883 · TutRect:911 · tutPct:912 · tutSilBox:913 · tutElRect:922 · tutPad:923 · tutUnion:924 · TutResolved:929 · TUT_EMPTY:930 · visibleHandCards:931 · resolveTutTarget:932 · TutorialStage:979 · SpriteOnce:1023 · EffectIcon:1040 · EFFECT_ICONS:1041 · SpriteIcon:1049 · IconPop:1054 · SHIELD_SHEETS:1070 · GOLD_BUBBLE:1076 · ShieldAura:1077 · ShieldFxOnce:1086 · EquipFxLayer:1100 · PUNCH_FRAMES:1146 · PUNCH_FRAME_W:1147 · DRAW_STYLE:1155 · DrawFlightNovo:1156 · RepositionLegNovo:1201 · FlyingCardNovo:1227 · lastArrowKey:1265 · drawFlightDelay:1266 · PunchFx:1267 · BURN_FRAMES:1303 · BurningCard:1305 · GraveyardPile:1361 · AtkBadge:1393 · NUMBER_KIND_OF:1405 · NUM_H:1408 · bangsOf:1409 · floatLife:1410 · FloatNumber:1411 · HpBadge:1454 · GoldBadge:1483 · GoldNumber:1512 · CardBack:1572 · CARD_THICKNESS_SHADOW:1610 · cardBoxShadow:1621 · cardGlowFilter:1622 · CARD_FACE_VARIANTS:1632 · NO_STAT_TYPES:1649 · templateForType:1650 · templateForTypeMini:1655 · FitText:1674 · KeywordPill:1749 · STAT_TOKEN:1763 · STAT_NUMBER_STYLE:1764 · StatSymbol:1765 · CoinIcon:1773 · GoldSymbol:1776 · DamageSymbol:1781 · RULE_WORD_STYLE:1793 · renderEffectText:1794 · FitEffectText:1834 · FULL_ART_PLATE_VARIANTS:1898 · FULL_ART_SIZE_FIX:1908 · CardFaceFullArt:1909 · FullArtMiniConfig:2033 · FULL_ART_MINI_CONFIG:2038 · usesLightBar:2066 · nameTextStyle:2067 · FULL_ART_MINI_DEFAULT:2070 · fullArtMiniConfigForType:2075 · CardFaceFullArtMini:2090 · CARD_FACE_MINI_STD_SCALE:2140 · CardFaceStandardMini:2141 · rarNameCls:2207 · RarityCardShine:2208 · CardFace:2213 · BOARD_EXTERIOR_ART_URL:2327 · FIELD_PREVIEW_SCALE:2332 · BOARD_PREVIEW_SCALE:2350 · FAN_SPREAD_DEG:2353 · FAN_LIFT_PX:2354 · HAND_CARD_WIDTH:2355 · HAND_CARD_HEIGHT:2356 · HAND_CARD_STEP:2359 · HAND_FULL_SPREAD_COUNT:2362 · HAND_SELECT_SCALE:2365 · handStepFor:2366 · ART_BY_NAME:2373 · MERC_ART_FILES:2427 · artSlug:2428 · CAMPO_ART_FILES:2434 · CAPITAO_ART_FILES:2440 · cardDataFromName:2446 · buildDeckCards:2450 · DECK_CAPITAO:2458 · DECK_CARDEAL:2459 · DECK_MERCENARIOS:2460 · DECK_CAMPO:2461 · DECKS:2465 · ALL_DECK_IDS:2495 · BOOSTER_POOLS:2498 · DECK_STORE_KEY:2518 · CARD_INSTANCES_BY_NAME:2520 · cardByName:2528 · isGeneralName:2529 · DeckSlot:2531 · DeckStore:2533 · DeckSelection:2535 · lastDeckRar:2536 · OnlineMatch:2542 · needsServer:2574 · visibleKey:2586 · countByName:2591 · CAPITAO_STARTER_NAME:2597 · MERC_STARTER_NAME:2598 · CAMPO_STARTER_NAME:2599 · CLOUD_DECK_SLOTS:2601 · MAX_DECK_SLOTS:2602 · buildStarterStore:2605 · sameCards:2629 · ensureStarterDecks:2633 · lastSanitizeMigrated:2665 · sanitizeDeckStore:2666 · loadDeckStore:2704 · cloudUserId:2718 · pushTimer:2719 · pushing:2720 · pushAgain:2721 · toCloudDecks:2722 · runPush:2723 · saveDeckStore:2736 · stopCloudSync:2741 · flushCloudSync:2743 · syncDeckStoreWithCloud:2754 · deckCardCount:2785 · deckProblem:2787 · buildDeckSelection:2795 · deckIdOfGeneral:2804 · DEFAULT_DECK_SELECTION:2805 · PlayerProfile:2814 · AVATAR_OPTIONS:2830 · avatarById:2883 · PROFILE_STORAGE_KEY:2885 · DEFAULT_PROFILE:2886 · loadProfile:2899 · formatCoroas:2913 · saveProfile:2918 · MODE_LABELS_PT:2927 · AvatarBadge:2937 · PlayerPlate:2952 · WINDOW_FRAME_PX:2981 · WINDOW_FONT_DECO:2982 · FramedWindow:2984 · WindowOverlay:2989 · WindowDivider:3012 · WindowTitle:3020 · Edges:3028 · ArtFrame:3029 · VLine:3050 · HLine:3053 · ArtChip:3058 · WindowOption:3064 · WindowText:3068 · WindowButton:3072 · AvatarPickerModal:3078 · ALLOW_PROFILE_RENAME:3126 · ProfileBar:3127 · ComingSoonModal:3248 · ONLINE_MODES:3264 · OnlineModeModal:3269 · TapPhase:3301 · MENU_CONFIRM_MS:3302 · useMenuTap:3303 · PlaqueSparks:3327 · PLAQUE_ASPECT:3346 · PLAQUE_CAP_CQW:3347 · MenuCard:3348 · MenuTextButton:3397 · ago:3411 · GmPanel:3412 · MenuIconButton:3503 · MainMenu:3534 · InstallPrompt:3671 · DeckPickerModal:3707 · CARD_TYPE_ORDER:3738 · DeckSide:3739 · EditorSort:3740 · EDITOR_SORTS:3741 · EDITOR_MARGIN:3742 · EDITOR_FRAME:3743 · EDITOR_PAD:3744 · LIST_COLS:3747 · ROW_H:3748 · FULL_ART_TILE_SCALE:3749 · DeckEditor:3751 · ShopPhase:4331 · NpcMood:4332 · BoosterDef:4333 · BOOSTERS:4335 · TEST_FREE_BOOSTERS:4344 · SHELF_ROWS:4345 · SHELF_COLS:4346 · BOOSTER_ASPECT:4347 · SHELF_X0:4352 · SHELF_X1:4353 · SHELF_PLANKS:4354 · SHELF_OVERVIEW:4355 · SHELF_CLOSEUP:4356 · NPC_LINES:4358 · SHOP_ART:4366 · rollBooster:4374 · BoosterArt:4390 · NpcArt:4402 · PACK_TEAR_Y:4409 · LID_SLICES:4410 · LidSlice:4416 · PackTear:4439 · PulledCard:4508 · pullBooster:4509 · PackOpeningOld:4523 · CARD3D_FILES:4604 · card3dUrl:4605 · Booster3DOpening:4606 · PackOpening:4644 · OpenBoosterFromTable:4649 · ShopScreen:4655 · AuthBackdrop:4895 · GoogleMark:4916 · DiscordMark:4919 · AuthButton:4921 · authFieldClass:4927 · WelcomeBack:4930 · LoginScreen:4966 · NAME_RULE:5030 · ProfileSetupScreen:5032 · VolumeRow:5099 · ToggleRow:5108 · REPORT_REASON_LABELS:5118 · ReportModal:5119 · makeFeedbackContext:5151 · FEEDBACK_LABELS:5157 · FeedbackModal:5158 · OptionsModal:5191 · SettingsModal:5227 · playCoinSfx:5279 · lastGoldSfx:5305 · playGoldSpendSfx:5306 · COIN_THICK:5310 · CoinFace:5311 · CoinRim:5320 · RemotePick:5339 · CoinToss:5340 · MatchSearchOverlay:5422 · OnlineSearchOverlay:5463 · LoadingScreen:5590 · App:5644 · IMMEDIATE_ZONE_LABEL:11505 · DragFinger:11510 · GuideInfo:11527 · DragGuide:11528 · arrivalDrops:11595 · arrivalListener:11597 · EmblemKind:11602 · EMBLEM_ART:11603 · SlotEmblem:11604 · RowPlaque:11617 · CardSlot:11629

Dentro de `App` (linhas 5644–11504), funções internas:
attackMarkFor:5918 · openCardPicker:5945 · spawnFloatingNumber:5981 · spawnFloatingNumberAtId:5997 · showBanner:6024 · announcePhase:6048 · announceTurnChange:6058 · trackOverlay:6091 · beginFinalBlow:6100 · endFinalBlow:6101 · blowIsSoaked:6104 · handleInstallClick:6193 · shieldOverSlot:6249 · popOverSlot:6261 · burstAt:6290 · glowTarget:6305 · trigFxAt:6318 · whenGlowDone:6324 · endGlow:6325 · startTriggerFx:6329 · holdForSeat:6357 · terrainFxPlayer:6385 · terrainFxNpc:6386 · fireImpactBurst:6402 · noteDragPlay:6426 · handFanMaxAngleRad:6496 · getHandArrivalPoint:6608 · getFanRotation:6628 · getFanLift:6635 · computeDrawOrigin:6650 · showToast:6665 · announceCardPlay:6671 · rarityOfCard:6749 · toCardData:6756 · shownStats:6772 · boardView:6783 · syncView:6788 · processEvents:6824 · armedSlotsOf:7065 · cardOverlayFx:7066 · fxRectOf:7183 · fxEnvFor:7189 · pickTacticSpot:7206 · tacticFxOf:7215 · planFx:7219 · commitState:7249 · dispatchAction:7272 · wakeWaiter:7291 · publishClock:7292 · dispatchOnline:7294 · reconcileOwn:7330 · applyUnasked:7344 · ingestRows:7358 · chooseFirstOnline:7386 · absorbAct:7399 · refuseOwn:7408 · sendOnline:7420 · stopOnline:7434 · startOnlinePolling:7451 · fxIdleNow:7469 · waitFxIdle:7470 · nextOpponentAction:7478 · applyRewardToProfile:7505 · openPlayerPick:7512 · playerAct:7540 · openModePrompt:7552 · maybePromptRelicMode:7559 · confirmRelicMode:7568 · confirmUpkeep:7580 · canPlayNow:7593 · readyAttackers:7594 · endTurnWarning:7597 · askEndTurn:7605 · endTurnNow:7611 · sleep:7630 · tutCurrent:7642 · tutCanBack:7646 · tutShow:7651 · tutGo:7667 · tutNext:7675 · tutBack:7689 · tutMatches:7694 · tutSignal:7706 · tutFromAction:7711 · tutBeat:7718 · tutExit:7725 · tutFinish:7732 · startTutorial:7733 · tutLaunchDuel:7738 · tutCoinResolved:7740 · settleAmbush:7797 · startMatchIntro:7830 · continueMatchIntro:7849 · resetGame:7945 · startGame:8005 · startOnlineMatch:8012 · leaveMatch:8054 · handleCardClick:8451 · handlePlayCardButtonClick:8511 · abilityStepCandidates:8570 · abilityHasTargets:8573 · getPlayerCreatureAbilityKind:8595 · getCardVisualEl:8609 · triggerPunch:8700 · renderTravelingArrow:8751 · playPendingTactic:8778 · resolveOwnTacticTarget:8785 · resolveEnemyTacticTarget:8790 · toggleCardPickerSelection:8798 · abilityOf:8812 · nextAbilityStep:8814 · activateAbility:8820 · abilityStepSide:8834 · resolveAbilityTarget:8840 · pushAbilityPrompt:8877 · mine:8898 · foes:8899 · effectTargetKind:8902 · specSlots:8904 · tacticTargeting:8918 · sourceAt:8925 · cancelTargeting:8943 · playHandCardOnTarget:8946 · heldTop:8953 · slotUnder:8954 · clearDragOver:8963 · dragBlockReason:8965 · tapHandCard:8979 · beginPress:8987 · returnHeld:9004 · dropHeldCard:9013 · updateHeld:9042 · dropOk:9061 · handleSlotClick:9117 · handleNpcSlotClick:9297 · handleBackgroundClick:9363 · getTappedCardShift:9394 · getSelectedCardX:9404 · getSelectedCardY:9426 · getBoardAnimation:9450 · getPlayerSlotHint:9491 · isTacticTargetSlot:9510 · tacticTagFor:9518 · boardHeightMultiplier:9594 · boardTopMargin:9595

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

## src/services/online.ts  (195 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:34 · QueueResult:57 · ActResult:62 · friendly:66 · call:68 · asActResult:86 · queueForMatch:91 · queueStatus:92 · cancelQueue:93 · sendAction:94 · tickMatch:96 · fetchResult:97 · fetchViews:103 · EmoteMsg:112 · EmoteResult:113 · asEmoteResult:114 · sendEmote:116 · fetchEmotes:117 · RankedView:120 · RankingRow:122 · fetchRanked:123 · fetchRanking:124 · claimSeason:127 · FriendRoom:130 · FriendResult:131 · friendCreate:132 · friendStatus:133 · friendCancel:134 · friendJoin:135 · friendPeek:136 · friendLink:141 · ReportReason:144 · reportOpponent:145 · deleteMyAccount:150 · FeedbackKind:155 · sendFeedback:156 · adminFeedbackDone:160 · adminBan:162 · adminUnban:163 · AdminInfo:166 · fetchAdmin:179 · pingPresence:181 · MissionView:184 · MissionsBoard:185 · MissionsResult:186 · missionsCall:187 · fetchMissions:192 · claimMission:193 · rerollMission:194

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

## server/handler.ts  (791 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:22 · defaultConfig:34 · MatchInit:36 · EMOTE_CODE:67 · EMOTE_GAP_MS:68 · EMOTE_MAX_PER_MATCH:69 · RankedView:72 · PLACEMENT:75 · REPEAT_LIMIT:76 · frameRank:77 · calendar:79 · rankedView:84 · ladderOf:97 · GameRequest:110 · GameResponse:139 · BOT_PROFILE:157 · STALE_MATCH_MS:158 · BOT_STEP_LIMIT:159 · AUTO_STEP_LIMIT:160 · recipeDeck:162 · botDeckFor:164 · playerOf:165 · userOfSeat:166 · moverOf:167 · moverKey:168 · Work:173 · startWork:182 · applyStep:185 · runBot:208 · patchOf:219 · pickRankedOpponent:228 · ensureRewards:246 · UNIT_TYPES:292 · countMissions:293 · publicReward:311 · rewardOf:317 · enforceClock:322 · openMatch:360 · viewRowsOf:367 · initOf:369 · startMatch:396 · finishIfStale:422 · OPS:433 · badRequest:434 · withTotals:468 · cleanRar:474 · Who:488 · isAdmin:489 · ONLINE_MS:490 · LIMITS:494 · DEFAULT_LIMIT:498 · hits:499 · rateLimited:500 · resetRateLimits:508 · REPORT_DAILY_MAX:509 · ROOM_MS:510 · ROOM_ALPHABET:511 · handleGame:513

## server/memoryDb.ts  (205 linhas)
Banco em memória (testes).

MemoryTables:8 · clone:13 · MemoryDb:15

## server/missions.ts  (146 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

MissionItem:8 · MissionState:9 · MissionView:10 · MissionsBoard:11 · BR:16 · weekStart:17 · dayEndsAt:18 · weekEndsAt:19 · seedOf:22 · rngOf:23 · shuffled:24 · drawMissions:26 · defOf:36 · kindOfKey:37 · load:40 · mutate:51 · keysAt:61 · MatchFacts:63 · countMatch:65 · viewOf:85 · syncSeason:91 · board:101 · claim:115 · reroll:133

## server/supabaseDb.ts  (276 linhas)
Banco no Supabase.

Client:10 · must:12 · viewToDb:17 · viewFromDb:20 · profileFromDb:21 · matchFromDb:22 · supabaseDb:24

## server/types.ts  (248 linhas)
Tipos do servidor e do banco.

DeckRar:8 · DeckJson:9 · RoomRow:12 · QueueRow:14 · StepRow:24 · ViewRow:32 · EndReason:43 · RewardRow:45 · RankedOutcome:59 · MatchRow:66 · MatchPatch:87 · EmoteRow:90 · SeasonRow:93 · AdminOverview:96 · FeedbackKind:111 · FEEDBACK_KINDS:112 · FeedbackRow:113 · AdminFeedback:114 · ReportReason:115 · REPORT_REASONS:116 · ReportRow:117 · AdminReport:118 · AdminPlayer:122 · MissionStateRow:131 · Db:133 · buildAdminPlayers:205 · dayKey:223 · lastDays:224 · windowsOf:225 · buildAdminReports:231 · buildAdminFeedback:245

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

## tests/online-server.ts  (771 linhas)
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
