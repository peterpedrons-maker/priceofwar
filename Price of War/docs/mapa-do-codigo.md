<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11831 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:279 · DRAW_FLIGHT_MS:305 · sfxVol:314 · playCardDrawSfx:315 · playCardPlaySfx:329 · playAttackSfx:336 · playEffectSfx:338 · playTacticSfx:339 · playSelectSfx:347 · bannerAudioCtx:359 · playBannerSfx:360 · playUiClickSfx:403 · playCardLiftSfx:412 · playDamageSfx:424 · playGeneralDamageSfx:429 · playDestroySfx:439 · playAshArriveSfx:440 · playRevealGeneralSfx:442 · playWarHornSfx:448 · playBatalhaBannerSfx:453 · playBatalhaImpactSfx:461 · CardType:467 · CardData:469 · StatTone:520 · STAT_TONE_COLOR:521 · STAT_TONE_GRADIENT:522 · statsOf:527 · SlotHint:536 · getSlotHint:545 · RowRoleHint:551 · SOLDIER_CARD_TYPES:552 · getRowRoleHint:553 · ROW_ROLE_VIEW:560 · PHASE_BANNER_TEXT:584 · BATALHA_FALL_MS:606 · BATALHA_IMPACT_FRACTION:607 · BANNER_LEARN_COUNT:611 · bannersSeen:612 · PHASE_BANNER_STAGE_MS:613 · phaseBannerMs:614 · PHASE_BANNER_Y:622 · PHASE_BANNER_MOTION:623 · HIT_STOP_MS:634 · ATTACK_MS:637 · ATTACK_WINDUP_FRAC:638 · ATTACK_WINDUP_PX:639 · ATTACK_TILT_DEG:640 · IMPACT_MS:641 · TIME:644 · rangedKindOf:646 · FINAL_SLOW:647 · FINAL_INTRO_MS:648 · FINAL_FREEZE_MS:649 · FINAL_AFTER_MS:650 · SLASH_SPARK_ANGLES:653 · SlashEffect:662 · TargetKind:700 · TARGET_STYLE:701 · HUD_CARD_SCALE:707 · AmountBadge:711 · TargetingHud:728 · READY_COLORS:798 · SILHOUETTES:803 · silhouetteFor:808 · DEBUG_HOOKS:819 · TriggerIcon:821 · FLIGHT_MS:835 · HELD_SCALE:836 · HELD_GAP:837 · TriggerBurst:838 · TriggerFloatLayer:859 · AbilityReadyGlow:876 · TutRect:904 · tutPct:905 · tutSilBox:906 · tutElRect:915 · tutPad:916 · tutUnion:917 · TutResolved:922 · TUT_EMPTY:923 · visibleHandCards:924 · resolveTutTarget:925 · TutorialStage:972 · SpriteOnce:1016 · EffectIcon:1033 · EFFECT_ICONS:1034 · SpriteIcon:1042 · IconPop:1047 · SHIELD_SHEETS:1062 · GOLD_BUBBLE:1068 · ShieldAura:1069 · ShieldFxOnce:1078 · EquipFxLayer:1092 · PUNCH_FRAMES:1138 · PUNCH_FRAME_W:1139 · DRAW_STYLE:1147 · DrawFlightNovo:1148 · RepositionLegNovo:1193 · FlyingCardNovo:1219 · lastArrowKey:1249 · drawFlightDelay:1250 · PunchFx:1251 · BURN_FRAMES:1287 · BurningCard:1289 · GraveyardPile:1345 · AtkBadge:1377 · NUMBER_KIND_OF:1389 · NUMBER_TIERS:1394 · damageTier:1400 · floatLife:1401 · FloatNumber:1402 · HpBadge:1452 · GoldBadge:1481 · GoldNumber:1510 · CardBack:1570 · CARD_THICKNESS_SHADOW:1608 · cardBoxShadow:1619 · cardGlowFilter:1620 · CARD_FACE_VARIANTS:1630 · NO_STAT_TYPES:1647 · templateForType:1648 · templateForTypeMini:1653 · FitText:1672 · KeywordPill:1747 · STAT_TOKEN:1761 · STAT_NUMBER_STYLE:1762 · StatSymbol:1763 · CoinIcon:1771 · GoldSymbol:1774 · DamageSymbol:1779 · RULE_WORD_STYLE:1791 · renderEffectText:1792 · FitEffectText:1832 · FULL_ART_PLATE_VARIANTS:1896 · FULL_ART_SIZE_FIX:1906 · CardFaceFullArt:1907 · FullArtMiniConfig:2031 · FULL_ART_MINI_CONFIG:2036 · usesLightBar:2064 · nameTextStyle:2065 · FULL_ART_MINI_DEFAULT:2068 · fullArtMiniConfigForType:2073 · CardFaceFullArtMini:2088 · CARD_FACE_MINI_STD_SCALE:2138 · CardFaceStandardMini:2139 · rarNameCls:2205 · RarityCardShine:2206 · CardFace:2211 · BOARD_EXTERIOR_ART_URL:2325 · FIELD_PREVIEW_SCALE:2330 · BOARD_PREVIEW_SCALE:2348 · FAN_SPREAD_DEG:2351 · FAN_LIFT_PX:2352 · HAND_CARD_WIDTH:2353 · HAND_CARD_HEIGHT:2354 · HAND_CARD_STEP:2357 · HAND_FULL_SPREAD_COUNT:2360 · HAND_SELECT_SCALE:2363 · handStepFor:2364 · ART_BY_NAME:2371 · MERC_ART_FILES:2425 · artSlug:2426 · CAMPO_ART_FILES:2432 · CAPITAO_ART_FILES:2438 · cardDataFromName:2444 · buildDeckCards:2448 · DECK_CAPITAO:2456 · DECK_CARDEAL:2457 · DECK_MERCENARIOS:2458 · DECK_CAMPO:2459 · DECKS:2463 · ALL_DECK_IDS:2493 · BOOSTER_POOLS:2496 · DECK_STORE_KEY:2516 · CARD_INSTANCES_BY_NAME:2518 · cardByName:2526 · isGeneralName:2527 · DeckSlot:2529 · DeckStore:2531 · DeckSelection:2533 · lastDeckRar:2534 · OnlineMatch:2540 · needsServer:2572 · visibleKey:2584 · countByName:2589 · CAPITAO_STARTER_NAME:2595 · MERC_STARTER_NAME:2596 · CAMPO_STARTER_NAME:2597 · CLOUD_DECK_SLOTS:2599 · MAX_DECK_SLOTS:2600 · buildStarterStore:2603 · sameCards:2627 · ensureStarterDecks:2631 · lastSanitizeMigrated:2663 · sanitizeDeckStore:2664 · loadDeckStore:2702 · cloudUserId:2716 · pushTimer:2717 · pushing:2718 · pushAgain:2719 · toCloudDecks:2720 · runPush:2721 · saveDeckStore:2734 · stopCloudSync:2739 · flushCloudSync:2741 · syncDeckStoreWithCloud:2752 · deckCardCount:2783 · deckProblem:2785 · buildDeckSelection:2793 · deckIdOfGeneral:2802 · DEFAULT_DECK_SELECTION:2803 · PlayerProfile:2812 · AVATAR_OPTIONS:2828 · avatarById:2881 · PROFILE_STORAGE_KEY:2883 · DEFAULT_PROFILE:2884 · loadProfile:2897 · formatCoroas:2911 · saveProfile:2916 · MODE_LABELS_PT:2925 · AvatarBadge:2935 · PlayerPlate:2950 · WINDOW_FRAME_PX:2979 · WINDOW_FONT_DECO:2980 · FramedWindow:2982 · WindowOverlay:2987 · WindowDivider:3010 · WindowTitle:3018 · Edges:3026 · ArtFrame:3027 · VLine:3048 · HLine:3051 · ArtChip:3056 · WindowOption:3062 · WindowText:3066 · WindowButton:3070 · AvatarPickerModal:3076 · ALLOW_PROFILE_RENAME:3124 · ProfileBar:3125 · ComingSoonModal:3246 · ONLINE_MODES:3262 · OnlineModeModal:3266 · TapPhase:3298 · MENU_CONFIRM_MS:3299 · useMenuTap:3300 · PlaqueSparks:3324 · PLAQUE_ASPECT:3343 · PLAQUE_CAP_CQW:3344 · MenuCard:3345 · MenuTextButton:3394 · ago:3408 · GmPanel:3409 · MenuIconButton:3490 · MainMenu:3521 · InstallPrompt:3665 · DeckPickerModal:3701 · CARD_TYPE_ORDER:3732 · DeckSide:3733 · EditorSort:3734 · EDITOR_SORTS:3735 · EDITOR_MARGIN:3736 · EDITOR_FRAME:3737 · EDITOR_PAD:3738 · LIST_COLS:3741 · ROW_H:3742 · FULL_ART_TILE_SCALE:3743 · DeckEditor:3745 · ShopPhase:4325 · NpcMood:4326 · BoosterDef:4327 · BOOSTERS:4329 · TEST_FREE_BOOSTERS:4338 · SHELF_ROWS:4339 · SHELF_COLS:4340 · BOOSTER_ASPECT:4341 · SHELF_X0:4346 · SHELF_X1:4347 · SHELF_PLANKS:4348 · SHELF_OVERVIEW:4349 · SHELF_CLOSEUP:4350 · NPC_LINES:4352 · SHOP_ART:4360 · rollBooster:4368 · BoosterArt:4384 · NpcArt:4396 · PACK_TEAR_Y:4403 · LID_SLICES:4404 · LidSlice:4410 · PackTear:4433 · PulledCard:4502 · pullBooster:4503 · PackOpeningOld:4517 · CARD3D_FILES:4598 · card3dUrl:4599 · Booster3DOpening:4600 · PackOpening:4638 · OpenBoosterFromTable:4643 · ShopScreen:4649 · AuthBackdrop:4889 · GoogleMark:4910 · DiscordMark:4913 · AuthButton:4915 · authFieldClass:4921 · WelcomeBack:4924 · LoginScreen:4960 · NAME_RULE:5024 · ProfileSetupScreen:5026 · VolumeRow:5093 · ToggleRow:5102 · REPORT_REASON_LABELS:5112 · ReportModal:5113 · OptionsModal:5145 · SettingsModal:5180 · playCoinSfx:5232 · lastGoldSfx:5258 · playGoldSpendSfx:5259 · COIN_THICK:5263 · CoinFace:5264 · CoinRim:5273 · RemotePick:5292 · CoinToss:5293 · MatchSearchOverlay:5375 · OnlineSearchOverlay:5416 · LoadingScreen:5491 · App:5545 · IMMEDIATE_ZONE_LABEL:11277 · DragFinger:11282 · GuideInfo:11299 · DragGuide:11300 · arrivalDrops:11367 · arrivalListener:11369 · EmblemKind:11374 · EMBLEM_ART:11375 · SlotEmblem:11376 · RowPlaque:11389 · CardSlot:11401

Dentro de `App` (linhas 5545–11276), funções internas:
attackMarkFor:5803 · openCardPicker:5830 · spawnFloatingNumber:5866 · spawnFloatingNumberAtId:5882 · showBanner:5909 · announcePhase:5933 · announceTurnChange:5943 · trackOverlay:5976 · beginFinalBlow:5985 · endFinalBlow:5986 · blowIsSoaked:5989 · handleInstallClick:6078 · shieldOverSlot:6134 · popOverSlot:6143 · burstAt:6158 · whenGlowDone:6183 · endGlow:6184 · startTriggerFx:6188 · holdForSeat:6216 · terrainFxPlayer:6244 · terrainFxNpc:6245 · fireImpactBurst:6261 · noteDragPlay:6285 · handFanMaxAngleRad:6355 · getHandArrivalPoint:6464 · getFanRotation:6484 · getFanLift:6491 · computeDrawOrigin:6506 · showToast:6521 · announceCardPlay:6527 · rarityOfCard:6605 · toCardData:6612 · shownStats:6628 · boardView:6639 · syncView:6644 · processEvents:6680 · armedSlotsOf:6921 · cardOverlayFx:6922 · fxRectOf:7039 · fxEnvFor:7045 · pickTacticSpot:7062 · tacticFxOf:7071 · planFx:7075 · commitState:7105 · dispatchAction:7128 · wakeWaiter:7147 · publishClock:7148 · dispatchOnline:7150 · reconcileOwn:7186 · applyUnasked:7200 · ingestRows:7214 · chooseFirstOnline:7242 · absorbAct:7255 · refuseOwn:7264 · sendOnline:7276 · stopOnline:7290 · startOnlinePolling:7307 · fxIdleNow:7325 · waitFxIdle:7326 · nextOpponentAction:7334 · applyRewardToProfile:7361 · openPlayerPick:7368 · playerAct:7396 · openModePrompt:7408 · maybePromptRelicMode:7415 · confirmRelicMode:7424 · confirmUpkeep:7436 · endTurnNow:7448 · sleep:7467 · tutCurrent:7479 · tutCanBack:7483 · tutShow:7488 · tutGo:7504 · tutNext:7512 · tutBack:7526 · tutMatches:7531 · tutSignal:7543 · tutFromAction:7548 · tutBeat:7555 · tutExit:7562 · tutFinish:7569 · startTutorial:7570 · tutLaunchDuel:7575 · tutCoinResolved:7577 · settleAmbush:7634 · startMatchIntro:7667 · continueMatchIntro:7686 · resetGame:7782 · startGame:7842 · startOnlineMatch:7849 · leaveMatch:7891 · handleCardClick:8251 · handlePlayCardButtonClick:8311 · abilityStepCandidates:8370 · abilityHasTargets:8373 · getPlayerCreatureAbilityKind:8395 · getCardVisualEl:8409 · triggerPunch:8500 · renderTravelingArrow:8551 · playPendingTactic:8578 · resolveOwnTacticTarget:8585 · resolveEnemyTacticTarget:8590 · toggleCardPickerSelection:8598 · abilityOf:8612 · nextAbilityStep:8614 · activateAbility:8620 · abilityStepSide:8634 · resolveAbilityTarget:8640 · pushAbilityPrompt:8677 · mine:8698 · foes:8699 · effectTargetKind:8702 · specSlots:8704 · tacticTargeting:8718 · sourceAt:8725 · cancelTargeting:8743 · playHandCardOnTarget:8746 · heldTop:8753 · slotUnder:8754 · clearDragOver:8763 · dragBlockReason:8765 · tapHandCard:8777 · beginPress:8785 · returnHeld:8802 · dropHeldCard:8811 · updateHeld:8840 · dropOk:8859 · handleSlotClick:8915 · handleNpcSlotClick:9095 · handleBackgroundClick:9161 · getTappedCardShift:9192 · getSelectedCardX:9202 · getSelectedCardY:9224 · getBoardAnimation:9248 · getPlayerSlotHint:9289 · isTacticTargetSlot:9308 · tacticTagFor:9316 · boardHeightMultiplier:9392 · boardTopMargin:9393

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

## src/engine/ranked.ts  (128 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LEAGUES:9 · League:10 · LEAGUE_NAMES:11 · POINTS_PER_DIVISION:14 · DIVISIONS:15 · POINTS_PER_LEAGUE:16 · MESTRE_FROM:17 · TOP_LEAGUE_SIZE:18 · PLACEMENT_MATCHES:20 · START_MMR:21 · START_POINTS:22 · RankedProfile:25 · newRankedProfile:26 · LeagueInfo:28 · leagueOf:30 · ROMAN:38 · leagueLabel:39 · leagueIndex:44 · RankedInput:47 · RankedResult:56 · expected:58 · clamp:59 · applyRankedMatch:61 · mmrWindow:93 · withTopLeague:96 · SEASON_DAYS:104 · SEASON_ONE_START:105 · DAY_MS:106 · SeasonInfo:107 · seasonAt:108 · RewardLeague:114 · SEASON_COROAS:115 · SeasonClose:117 · closeSeason:120

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

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

## src/RankedScreens.tsx  (373 linhas)
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

## src/services/online.ts  (159 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:33 · QueueResult:56 · ActResult:61 · friendly:65 · call:67 · asActResult:85 · queueForMatch:90 · queueStatus:91 · cancelQueue:92 · sendAction:93 · tickMatch:95 · fetchResult:96 · fetchViews:102 · EmoteMsg:111 · EmoteResult:112 · asEmoteResult:113 · sendEmote:115 · fetchEmotes:116 · RankedView:119 · RankingRow:121 · fetchRanked:122 · fetchRanking:123 · claimSeason:126 · ReportReason:129 · reportOpponent:130 · deleteMyAccount:135 · adminBan:140 · adminUnban:141 · AdminInfo:144 · fetchAdmin:156 · pingPresence:158

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

## server/handler.ts  (655 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:18 · defaultConfig:30 · MatchInit:32 · EMOTE_CODE:63 · EMOTE_GAP_MS:64 · EMOTE_MAX_PER_MATCH:65 · RankedView:68 · PLACEMENT:71 · REPEAT_LIMIT:72 · frameRank:73 · calendar:75 · rankedView:80 · ladderOf:93 · GameRequest:106 · GameResponse:125 · BOT_PROFILE:139 · STALE_MATCH_MS:140 · BOT_STEP_LIMIT:141 · AUTO_STEP_LIMIT:142 · recipeDeck:144 · botDeckFor:146 · playerOf:147 · userOfSeat:148 · moverOf:149 · moverKey:150 · Work:155 · startWork:164 · applyStep:167 · runBot:190 · patchOf:201 · pickRankedOpponent:210 · ensureRewards:228 · publicReward:269 · rewardOf:275 · enforceClock:280 · openMatch:318 · viewRowsOf:325 · initOf:327 · startMatch:354 · finishIfStale:380 · OPS:391 · badRequest:392 · withTotals:419 · cleanRar:425 · Who:439 · isAdmin:440 · ONLINE_MS:441 · LIMITS:445 · DEFAULT_LIMIT:449 · hits:450 · rateLimited:451 · resetRateLimits:459 · REPORT_DAILY_MAX:460 · handleGame:462

## server/memoryDb.ts  (180 linhas)
Banco em memória (testes).

MemoryTables:8 · clone:13 · MemoryDb:15

## server/supabaseDb.ts  (234 linhas)
Banco no Supabase.

Client:10 · must:12 · viewToDb:17 · viewFromDb:20 · profileFromDb:21 · matchFromDb:22 · supabaseDb:24

## server/types.ts  (215 linhas)
Tipos do servidor e do banco.

DeckRar:8 · DeckJson:9 · QueueRow:11 · StepRow:21 · ViewRow:29 · EndReason:40 · RewardRow:42 · RankedOutcome:55 · MatchRow:62 · MatchPatch:83 · EmoteRow:86 · SeasonRow:89 · AdminOverview:92 · ReportReason:106 · REPORT_REASONS:107 · ReportRow:108 · AdminReport:109 · AdminPlayer:113 · Db:122 · buildAdminPlayers:176 · dayKey:194 · lastDays:195 · windowsOf:196 · buildAdminReports:202

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

## tests/engine-rules.ts  (1321 linhas)
Um cenário por regra do jogo (npm test).

passed:19 · test:20 · eq:23 · ok:26 · n:29 · FIXTURE_HP:31 · mk:32 · fresh:37 · put:48 · give:49 · act:50 · refused:55 · names:60 · combat:61 · ambushSetup:438 · shielded:740 · aiTurn:801 · atkOf:979 · endTurnOf:980 · freshMerc:1182 · toNextTurn:1189

## tests/engine-sim.ts  (186 linhas)
Partidas IA × IA com invariantes, repetição determinística e fuzz (npm test).

failures:13 · usage:14 · tactics:15 · discards:16 · check:17 · allCards:19 · invariants:27 · play:48 · decks:81 · finished:82 · winsByDeck:83 · rnd:112 · R:113 · accepted:114

## tests/match-report.ts  (164 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Turn:15 · Game:16 · blank:25 · SOLD:26 · material:27 · count:28 · SLOT:29 · play:31 · avg:86 · f:87 · main:89

## tests/mock-supabase.ts  (119 linhas)
Supabase falso para os testes online.

Row:10 · tables:11 · memory:12 · cfg:13 · b64:18 · users:19 · cors:20 · send:26 · readBody:30 · uidFrom:33

## tests/online-server.ts  (676 linhas)
Testes do servidor online (npm test).

passed:13 · test:14 · ok:17 · eq:18 · clock:20 · rngState:21 · cfg:22 · fresh:27 · deckOf:40 · matched:46 · userOf:48 · choose:50 · botMatch:52 · pvp:59 · drive:67

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
