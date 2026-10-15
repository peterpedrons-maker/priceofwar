<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11660 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:276 · DRAW_FLIGHT_MS:302 · sfxVol:311 · playCardDrawSfx:312 · playCardPlaySfx:326 · playAttackSfx:333 · playEffectSfx:335 · playTacticSfx:336 · playSelectSfx:344 · bannerAudioCtx:356 · playBannerSfx:357 · playUiClickSfx:400 · playCardLiftSfx:409 · playDamageSfx:421 · playGeneralDamageSfx:426 · playDestroySfx:436 · playAshArriveSfx:437 · playRevealGeneralSfx:439 · playWarHornSfx:445 · playBatalhaBannerSfx:450 · playBatalhaImpactSfx:458 · CardType:464 · CardData:466 · StatTone:517 · STAT_TONE_COLOR:518 · STAT_TONE_GRADIENT:519 · statsOf:524 · SlotHint:533 · getSlotHint:542 · RowRoleHint:548 · SOLDIER_CARD_TYPES:549 · getRowRoleHint:550 · ROW_ROLE_VIEW:557 · PHASE_BANNER_TEXT:581 · BATALHA_FALL_MS:603 · BATALHA_IMPACT_FRACTION:604 · BANNER_LEARN_COUNT:608 · bannersSeen:609 · PHASE_BANNER_STAGE_MS:610 · phaseBannerMs:611 · PHASE_BANNER_Y:619 · PHASE_BANNER_MOTION:620 · HIT_STOP_MS:631 · ATTACK_MS:634 · ATTACK_WINDUP_FRAC:635 · ATTACK_WINDUP_PX:636 · ATTACK_TILT_DEG:637 · IMPACT_MS:638 · TIME:641 · rangedKindOf:643 · FINAL_SLOW:644 · FINAL_INTRO_MS:645 · FINAL_FREEZE_MS:646 · FINAL_AFTER_MS:647 · SLASH_SPARK_ANGLES:650 · SlashEffect:659 · TargetKind:697 · TARGET_STYLE:698 · HUD_CARD_SCALE:704 · AmountBadge:708 · TargetingHud:725 · READY_COLORS:795 · SILHOUETTES:800 · silhouetteFor:805 · DEBUG_HOOKS:816 · TriggerIcon:818 · FLIGHT_MS:832 · HELD_SCALE:833 · HELD_GAP:834 · TriggerBurst:835 · TriggerFloatLayer:856 · AbilityReadyGlow:873 · TutRect:904 · tutPct:905 · tutSilBox:906 · tutElRect:915 · tutPad:916 · tutUnion:917 · TutResolved:922 · TUT_EMPTY:923 · visibleHandCards:924 · resolveTutTarget:925 · TutorialStage:972 · SpriteOnce:1016 · EffectIcon:1033 · EFFECT_ICONS:1034 · SpriteIcon:1042 · IconPop:1047 · SHIELD_SHEETS:1062 · GOLD_BUBBLE:1068 · ShieldAura:1069 · ShieldFxOnce:1089 · EquipFxLayer:1103 · PUNCH_FRAMES:1149 · PUNCH_FRAME_W:1150 · DRAW_STYLE:1158 · DrawFlightNovo:1159 · RepositionLegNovo:1204 · FlyingCardNovo:1230 · lastArrowKey:1260 · drawFlightDelay:1261 · PunchFx:1262 · BURN_FRAMES:1298 · BurningCard:1300 · GraveyardPile:1356 · AtkBadge:1388 · NUMBER_KIND_OF:1400 · NUMBER_TIERS:1405 · damageTier:1411 · floatLife:1412 · FloatNumber:1413 · HpBadge:1463 · GoldBadge:1492 · GoldNumber:1521 · CardBack:1581 · CARD_THICKNESS_SHADOW:1619 · cardBoxShadow:1630 · cardGlowFilter:1631 · CARD_FACE_VARIANTS:1641 · NO_STAT_TYPES:1658 · templateForType:1659 · templateForTypeMini:1664 · FitText:1683 · KeywordPill:1758 · STAT_TOKEN:1772 · STAT_NUMBER_STYLE:1773 · StatSymbol:1774 · CoinIcon:1782 · GoldSymbol:1785 · DamageSymbol:1790 · RULE_WORD_STYLE:1802 · renderEffectText:1803 · FitEffectText:1843 · FULL_ART_PLATE_VARIANTS:1907 · FULL_ART_SIZE_FIX:1917 · CardFaceFullArt:1918 · FullArtMiniConfig:2042 · FULL_ART_MINI_CONFIG:2047 · usesLightBar:2075 · nameTextStyle:2076 · FULL_ART_MINI_DEFAULT:2079 · fullArtMiniConfigForType:2084 · CardFaceFullArtMini:2099 · CARD_FACE_MINI_STD_SCALE:2149 · CardFaceStandardMini:2150 · rarNameCls:2216 · RarityCardShine:2217 · CardFace:2222 · BOARD_EXTERIOR_ART_URL:2336 · FIELD_PREVIEW_SCALE:2341 · BOARD_PREVIEW_SCALE:2359 · FAN_SPREAD_DEG:2362 · FAN_LIFT_PX:2363 · HAND_CARD_WIDTH:2364 · HAND_CARD_HEIGHT:2365 · HAND_CARD_STEP:2368 · HAND_FULL_SPREAD_COUNT:2371 · HAND_SELECT_SCALE:2374 · handStepFor:2375 · ART_BY_NAME:2382 · MERC_ART_FILES:2436 · artSlug:2437 · CAMPO_ART_FILES:2443 · CAPITAO_ART_FILES:2449 · cardDataFromName:2455 · buildDeckCards:2459 · DECK_CAPITAO:2467 · DECK_CARDEAL:2468 · DECK_MERCENARIOS:2469 · DECK_CAMPO:2470 · DECKS:2474 · ALL_DECK_IDS:2504 · BOOSTER_POOLS:2507 · DECK_STORE_KEY:2527 · CARD_INSTANCES_BY_NAME:2529 · cardByName:2537 · isGeneralName:2538 · DeckSlot:2540 · DeckStore:2542 · DeckSelection:2544 · lastDeckRar:2545 · OnlineMatch:2551 · needsServer:2583 · visibleKey:2595 · countByName:2600 · CAPITAO_STARTER_NAME:2606 · MERC_STARTER_NAME:2607 · CAMPO_STARTER_NAME:2608 · CLOUD_DECK_SLOTS:2610 · MAX_DECK_SLOTS:2611 · buildStarterStore:2614 · sameCards:2638 · ensureStarterDecks:2642 · lastSanitizeMigrated:2674 · sanitizeDeckStore:2675 · loadDeckStore:2713 · cloudUserId:2727 · pushTimer:2728 · pushing:2729 · pushAgain:2730 · toCloudDecks:2731 · runPush:2732 · saveDeckStore:2745 · stopCloudSync:2750 · flushCloudSync:2752 · syncDeckStoreWithCloud:2763 · deckCardCount:2794 · deckProblem:2796 · buildDeckSelection:2804 · deckIdOfGeneral:2813 · DEFAULT_DECK_SELECTION:2814 · PlayerProfile:2823 · AVATAR_OPTIONS:2839 · avatarById:2892 · PROFILE_STORAGE_KEY:2894 · DEFAULT_PROFILE:2895 · loadProfile:2908 · formatCoroas:2922 · saveProfile:2927 · MODE_LABELS_PT:2936 · AvatarBadge:2946 · PlayerPlate:2961 · WINDOW_FRAME_PX:2990 · WINDOW_FONT_DECO:2991 · FramedWindow:2993 · WindowOverlay:2998 · WindowDivider:3021 · WindowTitle:3029 · Edges:3037 · ArtFrame:3038 · VLine:3059 · HLine:3062 · ArtChip:3067 · WindowOption:3073 · WindowText:3077 · WindowButton:3081 · AvatarPickerModal:3087 · ALLOW_PROFILE_RENAME:3135 · ProfileBar:3136 · ComingSoonModal:3257 · ONLINE_MODES:3273 · OnlineModeModal:3277 · TapPhase:3309 · MENU_CONFIRM_MS:3310 · useMenuTap:3311 · PlaqueSparks:3335 · PLAQUE_ASPECT:3354 · PLAQUE_CAP_CQW:3355 · MenuCard:3356 · MenuTextButton:3405 · ago:3419 · GmPanel:3420 · MenuIconButton:3447 · MainMenu:3478 · InstallPrompt:3621 · DeckPickerModal:3657 · CARD_TYPE_ORDER:3688 · DeckSide:3689 · EditorSort:3690 · EDITOR_SORTS:3691 · EDITOR_MARGIN:3692 · EDITOR_FRAME:3693 · EDITOR_PAD:3694 · LIST_COLS:3697 · ROW_H:3698 · FULL_ART_TILE_SCALE:3699 · DeckEditor:3701 · ShopPhase:4281 · NpcMood:4282 · BoosterDef:4283 · BOOSTERS:4285 · TEST_FREE_BOOSTERS:4294 · SHELF_ROWS:4295 · SHELF_COLS:4296 · BOOSTER_ASPECT:4297 · SHELF_X0:4302 · SHELF_X1:4303 · SHELF_PLANKS:4304 · SHELF_OVERVIEW:4305 · SHELF_CLOSEUP:4306 · NPC_LINES:4308 · SHOP_ART:4316 · rollBooster:4324 · BoosterArt:4340 · NpcArt:4352 · PACK_TEAR_Y:4359 · LID_SLICES:4360 · LidSlice:4366 · PackTear:4389 · PulledCard:4458 · pullBooster:4459 · PackOpeningOld:4473 · CARD3D_FILES:4554 · card3dUrl:4555 · Booster3DOpening:4556 · PackOpening:4594 · OpenBoosterFromTable:4599 · ShopScreen:4605 · AuthBackdrop:4845 · GoogleMark:4866 · DiscordMark:4869 · AuthButton:4871 · authFieldClass:4877 · LoginScreen:4879 · NAME_RULE:4940 · ProfileSetupScreen:4942 · VolumeRow:5008 · ToggleRow:5017 · OptionsModal:5027 · SettingsModal:5061 · playCoinSfx:5098 · lastGoldSfx:5124 · playGoldSpendSfx:5125 · COIN_THICK:5129 · CoinFace:5130 · CoinRim:5139 · RemotePick:5158 · CoinToss:5159 · MatchSearchOverlay:5241 · OnlineSearchOverlay:5282 · LoadingScreen:5357 · App:5411 · IMMEDIATE_ZONE_LABEL:11107 · DragFinger:11112 · GuideInfo:11129 · DragGuide:11130 · arrivalDrops:11197 · arrivalListener:11199 · EmblemKind:11204 · EMBLEM_ART:11205 · SlotEmblem:11206 · RowPlaque:11219 · CardSlot:11231

Dentro de `App` (linhas 5411–11106), funções internas:
attackMarkFor:5661 · openCardPicker:5688 · spawnFloatingNumber:5724 · spawnFloatingNumberAtId:5740 · showBanner:5767 · announcePhase:5791 · announceTurnChange:5801 · trackOverlay:5834 · beginFinalBlow:5843 · endFinalBlow:5844 · blowIsSoaked:5847 · handleInstallClick:5936 · shieldOverSlot:5992 · popOverSlot:6001 · burstAt:6016 · whenGlowDone:6041 · endGlow:6042 · startTriggerFx:6046 · holdForSeat:6074 · terrainFxPlayer:6102 · terrainFxNpc:6103 · fireImpactBurst:6119 · noteDragPlay:6142 · handFanMaxAngleRad:6212 · getHandArrivalPoint:6321 · getFanRotation:6341 · getFanLift:6348 · computeDrawOrigin:6363 · showToast:6378 · announceCardPlay:6384 · rarityOfCard:6462 · toCardData:6469 · shownStats:6485 · boardView:6496 · syncView:6501 · processEvents:6537 · armedSlotsOf:6764 · cardOverlayFx:6765 · fxRectOf:6882 · fxEnvFor:6888 · pickTacticSpot:6905 · tacticFxOf:6914 · planFx:6918 · commitState:6948 · dispatchAction:6971 · wakeWaiter:6990 · publishClock:6991 · dispatchOnline:6993 · reconcileOwn:7029 · applyUnasked:7043 · ingestRows:7057 · chooseFirstOnline:7085 · absorbAct:7098 · refuseOwn:7107 · sendOnline:7119 · stopOnline:7133 · startOnlinePolling:7150 · fxIdleNow:7168 · waitFxIdle:7169 · nextOpponentAction:7177 · applyRewardToProfile:7204 · openPlayerPick:7211 · playerAct:7239 · openModePrompt:7251 · maybePromptRelicMode:7258 · confirmRelicMode:7267 · confirmUpkeep:7279 · endTurnNow:7291 · sleep:7310 · tutCurrent:7322 · tutCanBack:7326 · tutShow:7331 · tutGo:7347 · tutNext:7355 · tutBack:7369 · tutMatches:7374 · tutSignal:7386 · tutFromAction:7391 · tutBeat:7398 · tutExit:7405 · tutFinish:7412 · startTutorial:7413 · tutLaunchDuel:7418 · tutCoinResolved:7420 · settleAmbush:7477 · startMatchIntro:7510 · continueMatchIntro:7529 · resetGame:7625 · startGame:7685 · startOnlineMatch:7692 · leaveMatch:7734 · handleCardClick:8090 · handlePlayCardButtonClick:8150 · abilityStepCandidates:8209 · abilityHasTargets:8212 · getPlayerCreatureAbilityKind:8234 · getCardVisualEl:8248 · triggerPunch:8339 · renderTravelingArrow:8390 · playPendingTactic:8417 · resolveOwnTacticTarget:8424 · resolveEnemyTacticTarget:8429 · toggleCardPickerSelection:8437 · abilityOf:8451 · nextAbilityStep:8453 · activateAbility:8459 · abilityStepSide:8473 · resolveAbilityTarget:8479 · pushAbilityPrompt:8516 · mine:8537 · foes:8538 · effectTargetKind:8541 · specSlots:8543 · tacticTargeting:8557 · sourceAt:8564 · cancelTargeting:8582 · playHandCardOnTarget:8585 · heldTop:8592 · slotUnder:8593 · clearDragOver:8602 · dragBlockReason:8604 · tapHandCard:8616 · beginPress:8624 · returnHeld:8641 · dropHeldCard:8650 · updateHeld:8679 · dropOk:8698 · handleSlotClick:8754 · handleNpcSlotClick:8934 · handleBackgroundClick:9000 · getTappedCardShift:9031 · getSelectedCardX:9041 · getSelectedCardY:9063 · getBoardAnimation:9087 · getPlayerSlotHint:9128 · isTacticTargetSlot:9147 · tacticTagFor:9155 · boardHeightMultiplier:9231 · boardTopMargin:9232

## src/ashFx.ts  (123 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Box:5 · AshOpts:6 · NS:8 · nz:9 · noiseGrid:10 · lerp:11 · ease:12 · noise:13 · fbm:14 · HIT:15 · burnAt:16 · BURN_S:17 · loadImg:19 · Part:21 · Ash:22 · fxAshes:24

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/boosterOpen3d.ts  (203 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

OpenCard:13 · OpenOpts:14 · HALO:15 · ART_RECT:17 · playBoosterOpening:19

## src/campoFx.ts  (325 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:9 · AURA:11 · Env:12 · cvs:15 · ctx:16 · fxs:17 · ensure:18 · resize:23 · R:24 · clamp:25 · eo:26 · lerp:27 · at:28 · add:29 · wait:30 · rc:33 · setU:34 · dirOf:35 · edgeY:36 · cols:37 · midY:38 · spawn:41 · glow:42 · drawP:43 · stepP:59 · flame:63 · ember:64 · fan:65 · ring:66 · dust:67 · glints:68 · Layer:72 · layers:73 · night:74 · animated:75 · armedOf:77 · Frame:82 · Sil:83 · SIL:84 · frameOf:85 · silOf:90 · ringOf:98 · edgeOf:107 · drawRing:111 · holderOf:112 · auraSlots:113 · layerTick:115 · layerDraw:139 · nightTick:148 · nightDraw:152 · inFrame:160 · overlayOpen:162 · busy:167 · frame:168 · step:173 · kick:194 · clearAll:195 · clearCampoLayers:196 · syncCampoLayers:200 · clang:222 · prep:223 · fxForjaPlaced:226 · equipTransfer:234 · fxForjaEquip:246 · fxFogoEquip:247 · fxArsenalEquip:248 · fxForjaModo:250 · fxFogoPlaced:257 · fxFogoTrincheira:265 · fxFogoSaque:272 · fxNoitePlay:282 · fxNoiteTrail:283 · branch:292 · fxMata:299 · WEAPONS:308 · weaponPath:309 · fxArsenalPlaced:317

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/cardFx.ts  (354 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CardRect:7 · Part:8 · cv:11 · parts:12 · ensure:13 · kick:19 · frame:20 · R:28 · clamp:29 · add:30 · run:32 · emit:39 · stepParts:40 · drawParts:43 · softGlow:53 · rr:54 · RINGS:57 · frameImgOf:58 · SOLID:60 · solidOf:61 · silRing:71 · drawSil:80 · hintEl:84 · fxHintFrame:86 · ctr:87 · fxLand:91 · fxImpact:117 · BN:145 · BURN:146 · noise:147 · nz:150 · F:152 · maskUrl:153 · burnMaskSheet:155 · mkLayer:162 · fxBurn:164 · fxLunge:205 · fxDrop:237 · ArrowSpec:255 · arrows:256 · exitT:257 · PERIOD:261 · drawArrow:262 · fxArrows:298 · fxDrawFollow:309 · fxMoveFollow:327 · SelItem:343 · selItems:344 · fxSelection:345

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

## src/engine/game.ts  (1110 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:85 · RuleError:88 · fail:89 · log:91 · P:92 · combatOpen:94 · activePhases:95 · addGold:98 · removeOne:107 · takeFromDeck:108 · drawCards:110 · removeFromHand:123 · discard:130 · sendDestroyed:137 · reinforceFrom:166 · setWinner:183 · soak:192 · grantShield:204 · grantBlock:210 · damageSlot:218 · healSlot:234 · startTurn:244 · enterPreparation:302 · payUpkeep:309 · setRelicMode:342 · runTurnEnd:356 · endTurn:376 · assertCanAct:386 · Fx:397 · uniqueByName:404 · matchesFilter:405 · filterLabel:412 · specCandidates:415 · checkTarget:419 · activeTargets:437 · validateTargets:441 · checkVerb:448 · checkVerbTarget:462 · openPick:466 · runVerb:475 · runAbilities:634 · grantMovedBuff:640 · playCard:650 · useAbility:717 · choose:757 · attack:815 · respondAmbush:841 · resolveAmbushEffect:858 · resolveCombat:894 · move:973 · advance:1006 · discardExcess:1028 · clone:1045 · applyAction:1047 · MatchLog:1089 · newMatchLog:1096 · replayMatch:1099

## src/engine/ranked.ts  (128 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LEAGUES:9 · League:10 · LEAGUE_NAMES:11 · POINTS_PER_DIVISION:14 · DIVISIONS:15 · POINTS_PER_LEAGUE:16 · MESTRE_FROM:17 · TOP_LEAGUE_SIZE:18 · PLACEMENT_MATCHES:20 · START_MMR:21 · START_POINTS:22 · RankedProfile:25 · newRankedProfile:26 · LeagueInfo:28 · leagueOf:30 · ROMAN:38 · leagueLabel:39 · leagueIndex:44 · RankedInput:47 · RankedResult:56 · expected:58 · clamp:59 · applyRankedMatch:61 · mmrWindow:93 · withTopLeague:96 · SEASON_DAYS:104 · SEASON_ONE_START:105 · DAY_MS:106 · SeasonInfo:107 · seasonAt:108 · RewardLeague:114 · SEASON_COROAS:115 · SeasonClose:117 · closeSeason:120

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (259 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · DRAW_PER_TURN:12 · GOLD_PER_TURN:13 · GOLD_FROM_ROUND:14 · COMBAT_FROM_ROUND:16 · HAND_LIMIT:17 · Unit:21 · Board:26 · phasesForTurn:29 · AUTOMATIC_PHASES:35 · restingPhasesForTurn:36 · abilitiesOf:41 · passivesOf:42 · abilityOn:43 · verbsOn:44 · hasVerb:45 · abilityPhases:48 · specCandidatesOn:51 · targetSpecsOf:66 · playTargetSpecs:67 · targetSpecOf:69 · needsHiddenInfo:73 · reinforceShield:78 · canReinforce:82 · AuraStat:85 · rowOk:86 · armedCount:87 · whoMatches:88 · auraTotal:99 · maxGeneralAbilityUses:125 · boardHasFlag:127 · upkeepOf:131 · modeAt:133 · relicModeOf:138 · terrainModeOf:139 · canPlayInPhase:143 · isFrontline:147 · isBackline:148 · isUnitSlot:149 · getLaneCol:150 · getMoveRow:155 · getMoveCol:156 · areSlotsAdjacent:158 · adjacentSlots:162 · canReposition:166 · SOLDIER_TYPES:173 · CardDropKind:175 · getCardDropKind:178 · canPlaceInSlot:190 · isAliveAt:199 · isCardDamaged:201 · getAuraCombatHpBonus:204 · blocksAmbush:206 · locksGeneralOnDamage:208 · getMaxAttacksPerTurn:210 · getEffectiveAtk:214 · getIncomingDamageReduction:222 · getValidAttackTargets:226 · withEquippedWeapons:257

## src/engine/types.ts  (380 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:44 · Verb:48 · AbilityOn:87 · Ability:102 · Who:112 · Passive:124 · RelicMode:138 · CardDef:150 · Card:178 · SLOT_COUNT:209 · GENERAL_SLOT:210 · RELIC_SLOT:211 · TERRAIN_SLOT:212 · PlayerState:214 · TurnState:235 · PickMode:253 · Pending:256 · GameState:298 · Action:311 · GameEvent:338 · ActionResult:377

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

## src/services/cloud.ts  (113 linhas)
Salvar/ler coleção e decks na nuvem.

CloudProfile:5 · CloudResult:6 · COLUMNS:8 · fail:10 · fetchProfile:22 · usernameAvailable:30 · createProfile:38 · updateProfileFields:46 · RarityMap:57 · CloudDeck:58 · CloudStore:59 · RAR_KEYS:60 · splitRar:61 · joinRar:69 · fetchStore:75 · pushStore:93

## src/services/online.ts  (135 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:33 · QueueResult:56 · ActResult:61 · call:66 · asActResult:83 · queueForMatch:88 · queueStatus:89 · cancelQueue:90 · sendAction:91 · tickMatch:93 · fetchResult:94 · fetchViews:100 · EmoteMsg:109 · EmoteResult:110 · asEmoteResult:111 · sendEmote:113 · fetchEmotes:114 · RankedView:117 · RankingRow:119 · fetchRanked:120 · fetchRanking:121 · claimSeason:124 · AdminInfo:127 · fetchAdmin:132 · pingPresence:134

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

## server/handler.ts  (595 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:17 · defaultConfig:29 · MatchInit:31 · EMOTE_CODE:62 · EMOTE_GAP_MS:63 · EMOTE_MAX_PER_MATCH:64 · RankedView:67 · PLACEMENT:70 · REPEAT_LIMIT:71 · frameRank:72 · calendar:74 · rankedView:79 · ladderOf:92 · GameRequest:105 · GameResponse:120 · BOT_PROFILE:132 · STALE_MATCH_MS:133 · BOT_STEP_LIMIT:134 · AUTO_STEP_LIMIT:135 · recipeDeck:137 · botDeckFor:139 · playerOf:140 · userOfSeat:141 · moverOf:142 · moverKey:143 · Work:148 · startWork:157 · applyStep:160 · runBot:183 · patchOf:194 · pickRankedOpponent:203 · ensureRewards:221 · publicReward:262 · rewardOf:268 · enforceClock:273 · openMatch:311 · viewRowsOf:318 · initOf:320 · startMatch:347 · finishIfStale:373 · OPS:384 · badRequest:385 · withTotals:409 · cleanRar:415 · Who:429 · isAdmin:430 · ONLINE_MS:431 · handleGame:433

## server/memoryDb.ts  (151 linhas)
Banco em memória (testes).

MemoryTables:6 · clone:11 · MemoryDb:13

## server/supabaseDb.ts  (176 linhas)
Banco no Supabase.

Client:8 · must:10 · viewToDb:15 · viewFromDb:18 · profileFromDb:19 · matchFromDb:20 · supabaseDb:22

## server/types.ts  (142 linhas)
Tipos do servidor e do banco.

DeckRar:8 · DeckJson:9 · QueueRow:11 · StepRow:21 · ViewRow:29 · EndReason:40 · RewardRow:42 · RankedOutcome:55 · MatchRow:62 · MatchPatch:83 · EmoteRow:86 · SeasonRow:89 · AdminOverview:92 · Db:98

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

## tests/online-server.ts  (624 linhas)
Testes do servidor online (npm test).

passed:13 · test:14 · ok:17 · eq:18 · clock:20 · rngState:21 · cfg:22 · fresh:27 · deckOf:38 · matched:44 · userOf:46 · choose:48 · botMatch:50 · pvp:57 · drive:65

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

## tools/mercenarios-prompts.ts  (216 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

slug:8 · LOOK:11 · LAND:12 · TALL:13 · END_LAND:14 · END_TALL:15 · Entry:17 · ENTRIES:19 · defs:132 · recipe:133 · order:134 · DELIVERED:138 · promptOf:139 · kind:140 · stats:141 · cleanEffect:142 · allOrdered:145 · numberOf:146 · ordered:147 · md:148 · readmePath:156 · readme:157 · start:158 · esc:170 · cards:171 · html:179

## tools/mercenarios-tabela.ts  (20 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

rows:6 · table:12 · path:13 · doc:14 · start:15 · end:16
