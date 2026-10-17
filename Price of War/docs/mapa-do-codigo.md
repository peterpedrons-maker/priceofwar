<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (12031 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:11 · CollectionRoom:12 · AVATAR_FILES:74 · avatarFile:75 · ALL_PRELOAD_IMAGES:283 · DRAW_FLIGHT_MS:309 · sfxVol:318 · playCardDrawSfx:319 · playCardPlaySfx:333 · playAttackSfx:340 · playEffectSfx:342 · playTacticSfx:343 · playSelectSfx:351 · bannerAudioCtx:363 · playBannerSfx:364 · playUiClickSfx:407 · playCardLiftSfx:416 · playDamageSfx:428 · playGeneralDamageSfx:433 · playDestroySfx:443 · playAshArriveSfx:444 · playRevealGeneralSfx:446 · playWarHornSfx:452 · playBatalhaBannerSfx:457 · playBatalhaImpactSfx:465 · CardType:471 · CardData:473 · StatTone:524 · STAT_TONE_COLOR:525 · STAT_TONE_GRADIENT:526 · statsOf:531 · SlotHint:540 · getSlotHint:549 · RowRoleHint:555 · SOLDIER_CARD_TYPES:556 · getRowRoleHint:557 · ROW_ROLE_VIEW:564 · PHASE_BANNER_TEXT:588 · BATALHA_FALL_MS:610 · BATALHA_IMPACT_FRACTION:611 · BANNER_LEARN_COUNT:615 · bannersSeen:616 · PHASE_BANNER_STAGE_MS:617 · phaseBannerMs:618 · PHASE_BANNER_Y:626 · PHASE_BANNER_MOTION:627 · HIT_STOP_MS:638 · ATTACK_MS:641 · ATTACK_WINDUP_FRAC:642 · ATTACK_WINDUP_PX:643 · ATTACK_TILT_DEG:644 · IMPACT_MS:645 · TIME:648 · rangedKindOf:650 · FINAL_SLOW:651 · FINAL_INTRO_MS:652 · FINAL_FREEZE_MS:653 · FINAL_AFTER_MS:654 · SLASH_SPARK_ANGLES:657 · SlashEffect:666 · TargetKind:704 · TARGET_STYLE:705 · HUD_CARD_SCALE:711 · AmountBadge:715 · TargetingHud:732 · READY_COLORS:802 · SILHOUETTES:807 · silhouetteFor:812 · DEBUG_HOOKS:823 · TriggerIcon:825 · FLIGHT_MS:839 · HELD_SCALE:840 · HELD_GAP:841 · TriggerBurst:842 · TriggerFloatLayer:863 · AbilityReadyGlow:880 · TutRect:908 · tutPct:909 · tutSilBox:910 · tutElRect:919 · tutPad:920 · tutUnion:921 · TutResolved:926 · TUT_EMPTY:927 · visibleHandCards:928 · resolveTutTarget:929 · TutorialStage:976 · SpriteOnce:1020 · EffectIcon:1037 · EFFECT_ICONS:1038 · SpriteIcon:1046 · IconPop:1051 · SHIELD_SHEETS:1066 · GOLD_BUBBLE:1072 · ShieldAura:1073 · ShieldFxOnce:1082 · EquipFxLayer:1096 · PUNCH_FRAMES:1142 · PUNCH_FRAME_W:1143 · DRAW_STYLE:1151 · DrawFlightNovo:1152 · RepositionLegNovo:1197 · FlyingCardNovo:1223 · lastArrowKey:1253 · drawFlightDelay:1254 · PunchFx:1255 · BURN_FRAMES:1291 · BurningCard:1293 · GraveyardPile:1349 · AtkBadge:1381 · NUMBER_KIND_OF:1393 · NUMBER_TIERS:1398 · damageTier:1404 · floatLife:1405 · FloatNumber:1406 · HpBadge:1456 · GoldBadge:1485 · GoldNumber:1514 · CardBack:1574 · CARD_THICKNESS_SHADOW:1612 · cardBoxShadow:1623 · cardGlowFilter:1624 · CARD_FACE_VARIANTS:1634 · NO_STAT_TYPES:1651 · templateForType:1652 · templateForTypeMini:1657 · FitText:1676 · KeywordPill:1751 · STAT_TOKEN:1765 · STAT_NUMBER_STYLE:1766 · StatSymbol:1767 · CoinIcon:1775 · GoldSymbol:1778 · DamageSymbol:1783 · RULE_WORD_STYLE:1795 · renderEffectText:1796 · FitEffectText:1836 · FULL_ART_PLATE_VARIANTS:1900 · FULL_ART_SIZE_FIX:1910 · CardFaceFullArt:1911 · FullArtMiniConfig:2035 · FULL_ART_MINI_CONFIG:2040 · usesLightBar:2068 · nameTextStyle:2069 · FULL_ART_MINI_DEFAULT:2072 · fullArtMiniConfigForType:2077 · CardFaceFullArtMini:2092 · CARD_FACE_MINI_STD_SCALE:2142 · CardFaceStandardMini:2143 · rarNameCls:2209 · RarityCardShine:2210 · CardFace:2215 · BOARD_EXTERIOR_ART_URL:2329 · FIELD_PREVIEW_SCALE:2334 · BOARD_PREVIEW_SCALE:2352 · FAN_SPREAD_DEG:2355 · FAN_LIFT_PX:2356 · HAND_CARD_WIDTH:2357 · HAND_CARD_HEIGHT:2358 · HAND_CARD_STEP:2361 · HAND_FULL_SPREAD_COUNT:2364 · HAND_SELECT_SCALE:2367 · handStepFor:2368 · ART_BY_NAME:2375 · MERC_ART_FILES:2429 · artSlug:2430 · CAMPO_ART_FILES:2436 · CAPITAO_ART_FILES:2442 · cardDataFromName:2448 · buildDeckCards:2452 · DECK_CAPITAO:2460 · DECK_CARDEAL:2461 · DECK_MERCENARIOS:2462 · DECK_CAMPO:2463 · DECKS:2467 · ALL_DECK_IDS:2497 · BOOSTER_POOLS:2500 · DECK_STORE_KEY:2520 · CARD_INSTANCES_BY_NAME:2522 · cardByName:2530 · isGeneralName:2531 · DeckSlot:2533 · DeckStore:2535 · DeckSelection:2537 · lastDeckRar:2538 · OnlineMatch:2544 · needsServer:2576 · visibleKey:2588 · countByName:2593 · CAPITAO_STARTER_NAME:2599 · MERC_STARTER_NAME:2600 · CAMPO_STARTER_NAME:2601 · CLOUD_DECK_SLOTS:2603 · MAX_DECK_SLOTS:2604 · buildStarterStore:2607 · sameCards:2631 · ensureStarterDecks:2635 · lastSanitizeMigrated:2667 · sanitizeDeckStore:2668 · loadDeckStore:2706 · cloudUserId:2720 · pushTimer:2721 · pushing:2722 · pushAgain:2723 · toCloudDecks:2724 · runPush:2725 · saveDeckStore:2738 · stopCloudSync:2743 · flushCloudSync:2745 · syncDeckStoreWithCloud:2756 · deckCardCount:2787 · deckProblem:2789 · buildDeckSelection:2797 · deckIdOfGeneral:2806 · DEFAULT_DECK_SELECTION:2807 · PlayerProfile:2816 · AVATAR_OPTIONS:2832 · avatarById:2885 · PROFILE_STORAGE_KEY:2887 · DEFAULT_PROFILE:2888 · loadProfile:2901 · formatCoroas:2915 · saveProfile:2920 · MODE_LABELS_PT:2929 · AvatarBadge:2939 · PlayerPlate:2954 · WINDOW_FRAME_PX:2983 · WINDOW_FONT_DECO:2984 · FramedWindow:2986 · WindowOverlay:2991 · WindowDivider:3014 · WindowTitle:3022 · Edges:3030 · ArtFrame:3031 · VLine:3052 · HLine:3055 · ArtChip:3060 · WindowOption:3066 · WindowText:3070 · WindowButton:3074 · AvatarPickerModal:3080 · ALLOW_PROFILE_RENAME:3128 · ProfileBar:3129 · ComingSoonModal:3250 · ONLINE_MODES:3266 · OnlineModeModal:3271 · TapPhase:3303 · MENU_CONFIRM_MS:3304 · useMenuTap:3305 · PlaqueSparks:3329 · PLAQUE_ASPECT:3348 · PLAQUE_CAP_CQW:3349 · MenuCard:3350 · MenuTextButton:3399 · ago:3413 · GmPanel:3414 · MenuIconButton:3505 · MainMenu:3536 · InstallPrompt:3672 · DeckPickerModal:3708 · CARD_TYPE_ORDER:3739 · DeckSide:3740 · EditorSort:3741 · EDITOR_SORTS:3742 · EDITOR_MARGIN:3743 · EDITOR_FRAME:3744 · EDITOR_PAD:3745 · LIST_COLS:3748 · ROW_H:3749 · FULL_ART_TILE_SCALE:3750 · DeckEditor:3752 · ShopPhase:4332 · NpcMood:4333 · BoosterDef:4334 · BOOSTERS:4336 · TEST_FREE_BOOSTERS:4345 · SHELF_ROWS:4346 · SHELF_COLS:4347 · BOOSTER_ASPECT:4348 · SHELF_X0:4353 · SHELF_X1:4354 · SHELF_PLANKS:4355 · SHELF_OVERVIEW:4356 · SHELF_CLOSEUP:4357 · NPC_LINES:4359 · SHOP_ART:4367 · rollBooster:4375 · BoosterArt:4391 · NpcArt:4403 · PACK_TEAR_Y:4410 · LID_SLICES:4411 · LidSlice:4417 · PackTear:4440 · PulledCard:4509 · pullBooster:4510 · PackOpeningOld:4524 · CARD3D_FILES:4605 · card3dUrl:4606 · Booster3DOpening:4607 · PackOpening:4645 · OpenBoosterFromTable:4650 · ShopScreen:4656 · AuthBackdrop:4896 · GoogleMark:4917 · DiscordMark:4920 · AuthButton:4922 · authFieldClass:4928 · WelcomeBack:4931 · LoginScreen:4967 · NAME_RULE:5031 · ProfileSetupScreen:5033 · VolumeRow:5100 · ToggleRow:5109 · REPORT_REASON_LABELS:5119 · ReportModal:5120 · makeFeedbackContext:5152 · FEEDBACK_LABELS:5158 · FeedbackModal:5159 · OptionsModal:5192 · SettingsModal:5228 · playCoinSfx:5280 · lastGoldSfx:5306 · playGoldSpendSfx:5307 · COIN_THICK:5311 · CoinFace:5312 · CoinRim:5321 · RemotePick:5340 · CoinToss:5341 · MatchSearchOverlay:5423 · OnlineSearchOverlay:5464 · LoadingScreen:5591 · App:5645 · IMMEDIATE_ZONE_LABEL:11477 · DragFinger:11482 · GuideInfo:11499 · DragGuide:11500 · arrivalDrops:11567 · arrivalListener:11569 · EmblemKind:11574 · EMBLEM_ART:11575 · SlotEmblem:11576 · RowPlaque:11589 · CardSlot:11601

Dentro de `App` (linhas 5645–11476), funções internas:
attackMarkFor:5919 · openCardPicker:5946 · spawnFloatingNumber:5982 · spawnFloatingNumberAtId:5998 · showBanner:6025 · announcePhase:6049 · announceTurnChange:6059 · trackOverlay:6092 · beginFinalBlow:6101 · endFinalBlow:6102 · blowIsSoaked:6105 · handleInstallClick:6194 · shieldOverSlot:6250 · popOverSlot:6259 · burstAt:6274 · whenGlowDone:6299 · endGlow:6300 · startTriggerFx:6304 · holdForSeat:6332 · terrainFxPlayer:6360 · terrainFxNpc:6361 · fireImpactBurst:6377 · noteDragPlay:6401 · handFanMaxAngleRad:6471 · getHandArrivalPoint:6580 · getFanRotation:6600 · getFanLift:6607 · computeDrawOrigin:6622 · showToast:6637 · announceCardPlay:6643 · rarityOfCard:6721 · toCardData:6728 · shownStats:6744 · boardView:6755 · syncView:6760 · processEvents:6796 · armedSlotsOf:7037 · cardOverlayFx:7038 · fxRectOf:7155 · fxEnvFor:7161 · pickTacticSpot:7178 · tacticFxOf:7187 · planFx:7191 · commitState:7221 · dispatchAction:7244 · wakeWaiter:7263 · publishClock:7264 · dispatchOnline:7266 · reconcileOwn:7302 · applyUnasked:7316 · ingestRows:7330 · chooseFirstOnline:7358 · absorbAct:7371 · refuseOwn:7380 · sendOnline:7392 · stopOnline:7406 · startOnlinePolling:7423 · fxIdleNow:7441 · waitFxIdle:7442 · nextOpponentAction:7450 · applyRewardToProfile:7477 · openPlayerPick:7484 · playerAct:7512 · openModePrompt:7524 · maybePromptRelicMode:7531 · confirmRelicMode:7540 · confirmUpkeep:7552 · canPlayNow:7565 · readyAttackers:7566 · endTurnWarning:7569 · askEndTurn:7577 · endTurnNow:7583 · sleep:7602 · tutCurrent:7614 · tutCanBack:7618 · tutShow:7623 · tutGo:7639 · tutNext:7647 · tutBack:7661 · tutMatches:7666 · tutSignal:7678 · tutFromAction:7683 · tutBeat:7690 · tutExit:7697 · tutFinish:7704 · startTutorial:7705 · tutLaunchDuel:7710 · tutCoinResolved:7712 · settleAmbush:7769 · startMatchIntro:7802 · continueMatchIntro:7821 · resetGame:7917 · startGame:7977 · startOnlineMatch:7984 · leaveMatch:8026 · handleCardClick:8423 · handlePlayCardButtonClick:8483 · abilityStepCandidates:8542 · abilityHasTargets:8545 · getPlayerCreatureAbilityKind:8567 · getCardVisualEl:8581 · triggerPunch:8672 · renderTravelingArrow:8723 · playPendingTactic:8750 · resolveOwnTacticTarget:8757 · resolveEnemyTacticTarget:8762 · toggleCardPickerSelection:8770 · abilityOf:8784 · nextAbilityStep:8786 · activateAbility:8792 · abilityStepSide:8806 · resolveAbilityTarget:8812 · pushAbilityPrompt:8849 · mine:8870 · foes:8871 · effectTargetKind:8874 · specSlots:8876 · tacticTargeting:8890 · sourceAt:8897 · cancelTargeting:8915 · playHandCardOnTarget:8918 · heldTop:8925 · slotUnder:8926 · clearDragOver:8935 · dragBlockReason:8937 · tapHandCard:8951 · beginPress:8959 · returnHeld:8976 · dropHeldCard:8985 · updateHeld:9014 · dropOk:9033 · handleSlotClick:9089 · handleNpcSlotClick:9269 · handleBackgroundClick:9335 · getTappedCardShift:9366 · getSelectedCardX:9376 · getSelectedCardY:9398 · getBoardAnimation:9422 · getPlayerSlotHint:9463 · isTacticTargetSlot:9482 · tacticTagFor:9490 · boardHeightMultiplier:9566 · boardTopMargin:9567

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

## src/MissionsScreen.tsx  (113 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CINZEL:25 · SERIF:26 · TAG:27 · iconOf:28 · Tab:29 · left:30 · MissionRow:32 · MissionsScreen:65 · MissionsHost:112

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

## src/VillageScene.tsx  (100 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

ICONS:11 · IW:15 · VillageId:16 · BUILDINGS:19 · GLOWS:29 · SOURCES:30 · Particle:31 · VillageScene:33

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

## tests/mock-supabase.ts  (119 linhas)
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
