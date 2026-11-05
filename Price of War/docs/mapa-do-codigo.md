<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (12172 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:13 · CollectionRoom:14 · AVATAR_FILES:76 · avatarFile:77 · ALL_PRELOAD_IMAGES:293 · DRAW_FLIGHT_MS:319 · sfxVol:328 · playCardDrawSfx:329 · playCardPlaySfx:343 · playAttackSfx:350 · playEffectSfx:352 · lastEffectSfxAt:353 · playEffectSfxOnce:354 · playTacticSfx:355 · playSelectSfx:363 · bannerAudioCtx:375 · playBannerSfx:376 · playUiClickSfx:419 · playCardLiftSfx:428 · playDamageSfx:440 · playGeneralDamageSfx:445 · playDestroySfx:455 · playAshArriveSfx:456 · playRevealGeneralSfx:458 · playWarHornSfx:464 · playMatchEndSfx:470 · playBatalhaBannerSfx:475 · playBatalhaImpactSfx:483 · CardType:489 · CardData:491 · StatTone:542 · STAT_TONE_COLOR:543 · STAT_TONE_GRADIENT:544 · statsOf:549 · SlotHint:558 · getSlotHint:567 · RowRoleHint:573 · SOLDIER_CARD_TYPES:574 · getRowRoleHint:575 · ROW_ROLE_VIEW:582 · PHASE_BANNER_TEXT:606 · BATALHA_FALL_MS:628 · BATALHA_IMPACT_FRACTION:629 · BANNER_LEARN_COUNT:633 · bannersSeen:634 · PHASE_BANNER_STAGE_MS:635 · phaseBannerMs:636 · PHASE_BANNER_Y:644 · PHASE_BANNER_MOTION:645 · HIT_STOP_MS:656 · ATTACK_MS:659 · ATTACK_WINDUP_FRAC:660 · ATTACK_WINDUP_PX:661 · ATTACK_TILT_DEG:662 · IMPACT_MS:663 · TIME:666 · rangedKindOf:668 · FINAL_SLOW:669 · FINAL_INTRO_MS:670 · FINAL_FREEZE_MS:671 · FINAL_AFTER_MS:672 · SLASH_SPARK_ANGLES:675 · SlashEffect:684 · TargetKind:722 · TARGET_STYLE:723 · HUD_CARD_SCALE:729 · AmountBadge:733 · TargetingHud:750 · READY_COLORS:820 · SILHOUETTES:825 · silhouetteFor:830 · DEBUG_HOOKS:841 · TriggerIcon:843 · FLIGHT_MS:857 · HELD_SCALE:858 · HELD_GAP:859 · TriggerBurst:860 · TriggerFloatLayer:881 · AbilityReadyGlow:898 · TutRect:926 · tutPct:927 · tutSilBox:928 · tutElRect:937 · tutPad:938 · tutUnion:939 · TutResolved:944 · TUT_EMPTY:945 · visibleHandCards:946 · resolveTutTarget:947 · TutorialStage:994 · SpriteOnce:1038 · EffectIcon:1055 · EFFECT_ICONS:1056 · SpriteIcon:1064 · IconPop:1069 · SHIELD_SHEETS:1085 · GOLD_BUBBLE:1091 · ShieldAura:1092 · ShieldFxOnce:1101 · EquipFxLayer:1115 · PUNCH_FRAMES:1161 · PUNCH_FRAME_W:1162 · DRAW_STYLE:1170 · DrawFlightNovo:1171 · RepositionLegNovo:1216 · FlyingCardNovo:1242 · lastArrowKey:1280 · drawFlightDelay:1281 · PunchFx:1282 · BURN_FRAMES:1318 · BurningCard:1320 · GraveyardPile:1376 · AtkBadge:1408 · NUMBER_KIND_OF:1420 · NUM_H:1423 · bangsOf:1424 · floatLife:1425 · FloatNumber:1426 · HpBadge:1469 · GoldBadge:1498 · GoldNumber:1527 · CardBack:1587 · CARD_THICKNESS_SHADOW:1625 · cardBoxShadow:1636 · cardGlowFilter:1637 · CARD_FACE_VARIANTS:1647 · NO_STAT_TYPES:1664 · templateForType:1665 · templateForTypeMini:1670 · FitText:1689 · KeywordPill:1764 · STAT_TOKEN:1778 · STAT_NUMBER_STYLE:1779 · StatSymbol:1780 · CoinIcon:1788 · GoldSymbol:1791 · DamageSymbol:1796 · RULE_WORD_STYLE:1808 · renderEffectText:1809 · FitEffectText:1849 · FULL_ART_PLATE_VARIANTS:1914 · FULL_ART_SIZE_FIX:1924 · CardFaceFullArt:1925 · FullArtMiniConfig:2049 · FULL_ART_MINI_CONFIG:2054 · usesLightBar:2082 · nameTextStyle:2083 · FULL_ART_MINI_DEFAULT:2086 · fullArtMiniConfigForType:2091 · CardFaceFullArtMini:2106 · CARD_FACE_MINI_STD_SCALE:2156 · CardFaceStandardMini:2157 · rarNameCls:2223 · RarityCardShine:2224 · CardFace:2229 · BOARD_EXTERIOR_ART_URL:2343 · FIELD_PREVIEW_SCALE:2348 · BOARD_PREVIEW_SCALE:2366 · FAN_SPREAD_DEG:2369 · FAN_LIFT_PX:2370 · HAND_CARD_WIDTH:2371 · HAND_CARD_HEIGHT:2372 · HAND_CARD_STEP:2375 · HAND_FULL_SPREAD_COUNT:2378 · HAND_SELECT_SCALE:2381 · handStepFor:2382 · ART_BY_NAME:2389 · MERC_ART_FILES:2443 · artSlug:2444 · CAMPO_ART_FILES:2450 · CAPITAO_ART_FILES:2456 · cardDataFromName:2462 · buildDeckCards:2466 · DECK_CAPITAO:2474 · DECK_CARDEAL:2475 · DECK_MERCENARIOS:2476 · DECK_CAMPO:2477 · DECKS:2481 · ALL_DECK_IDS:2511 · DECK_STORE_KEY:2523 · CARD_INSTANCES_BY_NAME:2525 · cardByName:2533 · isGeneralName:2534 · DeckSlot:2536 · DeckStore:2538 · DeckSelection:2540 · lastDeckRar:2541 · OnlineMatch:2547 · needsServer:2579 · visibleKey:2591 · countByName:2596 · CAPITAO_STARTER_NAME:2602 · MERC_STARTER_NAME:2603 · CAMPO_STARTER_NAME:2604 · CLOUD_DECK_SLOTS:2606 · MAX_DECK_SLOTS:2607 · buildStarterStore:2610 · sameCards:2634 · ensureStarterDecks:2638 · lastSanitizeMigrated:2670 · sanitizeDeckStore:2671 · loadDeckStore:2709 · cloudUserId:2723 · pushTimer:2724 · pushing:2725 · pushAgain:2726 · toCloudDecks:2727 · runPush:2728 · saveDeckStore:2741 · stopCloudSync:2746 · flushCloudSync:2748 · syncDeckStoreWithCloud:2759 · deckCardCount:2789 · deckProblem:2791 · buildDeckSelection:2799 · deckIdOfGeneral:2808 · DEFAULT_DECK_SELECTION:2809 · PlayerProfile:2818 · AVATAR_OPTIONS:2834 · avatarById:2887 · PROFILE_STORAGE_KEY:2889 · DEFAULT_PROFILE:2890 · loadProfile:2903 · formatCoroas:2917 · saveProfile:2922 · MODE_LABELS_PT:2931 · AvatarBadge:2941 · PlayerPlate:2956 · WINDOW_FRAME_PX:2985 · WINDOW_FONT_DECO:2986 · FramedWindow:2988 · WindowOverlay:2993 · WindowDivider:3016 · WindowTitle:3024 · Edges:3032 · ArtFrame:3033 · VLine:3054 · HLine:3057 · ArtChip:3062 · WindowOption:3068 · WindowText:3072 · WindowButton:3076 · AvatarPickerModal:3082 · ALLOW_PROFILE_RENAME:3130 · ProfileBar:3131 · ComingSoonModal:3252 · ONLINE_MODES:3268 · OnlineModeModal:3273 · TapPhase:3305 · MENU_CONFIRM_MS:3306 · useMenuTap:3307 · PlaqueSparks:3331 · PLAQUE_ASPECT:3350 · PLAQUE_CAP_CQW:3351 · MenuCard:3352 · MenuTextButton:3401 · ago:3415 · GmPanel:3416 · MenuIconButton:3507 · MainMenu:3538 · InstallPrompt:3687 · DeckPickerModal:3723 · CARD_TYPE_ORDER:3754 · DeckSide:3755 · EditorSort:3756 · EDITOR_SORTS:3757 · EDITOR_MARGIN:3758 · EDITOR_FRAME:3759 · EDITOR_PAD:3760 · LIST_COLS:3763 · ROW_H:3764 · FULL_ART_TILE_SCALE:3765 · DeckCodeModal:3768 · DeckEditor:3821 · ShopPhase:4408 · NpcMood:4409 · BoosterDef:4410 · BOOSTERS:4412 · TEST_FREE_BOOSTERS:4421 · SHELF_ROWS:4422 · SHELF_COLS:4423 · BOOSTER_ASPECT:4424 · SHELF_X0:4429 · SHELF_X1:4430 · SHELF_PLANKS:4431 · SHELF_OVERVIEW:4432 · SHELF_CLOSEUP:4433 · NPC_LINES:4435 · SHOP_ART:4443 · BoosterArt:4450 · NpcArt:4462 · PACK_TEAR_Y:4469 · LID_SLICES:4470 · LidSlice:4476 · PackTear:4499 · PulledCard:4568 · ownedOf:4570 · applyAdds:4575 · toPulled:4583 · OpenResult:4589 · openBoosterFlow:4590 · PackOpeningOld:4604 · card3dUrl:4685 · Booster3DOpening:4686 · PackOpening:4730 · OpenBoosterFromTable:4735 · ShopScreen:4750 · AuthBackdrop:4993 · GoogleMark:5014 · DiscordMark:5017 · AuthButton:5019 · authFieldClass:5025 · WelcomeBack:5028 · LoginScreen:5064 · NAME_RULE:5128 · ProfileSetupScreen:5130 · VolumeRow:5197 · ToggleRow:5206 · REPORT_REASON_LABELS:5216 · ReportModal:5217 · makeFeedbackContext:5249 · FEEDBACK_LABELS:5255 · FeedbackModal:5256 · OptionsModal:5289 · SettingsModal:5334 · playCoinSfx:5386 · lastGoldSfx:5412 · playGoldSpendSfx:5413 · COIN_THICK:5417 · CoinFace:5418 · CoinRim:5427 · RemotePick:5446 · CoinToss:5447 · MatchSearchOverlay:5529 · OnlineSearchOverlay:5570 · LoadingScreen:5697 · App:5751 · IMMEDIATE_ZONE_LABEL:11618 · DragFinger:11623 · GuideInfo:11640 · DragGuide:11641 · arrivalDrops:11708 · arrivalListener:11710 · EmblemKind:11715 · EMBLEM_ART:11716 · SlotEmblem:11717 · RowPlaque:11730 · CardSlot:11742

Dentro de `App` (linhas 5751–11617), funções internas:
attackMarkFor:6025 · openCardPicker:6052 · spawnFloatingNumber:6088 · spawnFloatingNumberAtId:6104 · showBanner:6131 · announcePhase:6155 · announceTurnChange:6165 · trackOverlay:6198 · beginFinalBlow:6207 · endFinalBlow:6208 · blowIsSoaked:6211 · handleInstallClick:6300 · shieldOverSlot:6356 · popOverSlot:6368 · burstAt:6397 · glowTarget:6412 · trigFxAt:6425 · whenGlowDone:6431 · endGlow:6432 · startTriggerFx:6436 · holdForSeat:6464 · terrainFxPlayer:6492 · terrainFxNpc:6493 · fireImpactBurst:6509 · noteDragPlay:6533 · handFanMaxAngleRad:6603 · getHandArrivalPoint:6716 · getFanRotation:6736 · getFanLift:6743 · computeDrawOrigin:6758 · showToast:6773 · announceCardPlay:6779 · rarityOfCard:6857 · toCardData:6864 · shownStats:6880 · boardView:6891 · syncView:6896 · processEvents:6932 · armedSlotsOf:7173 · cardOverlayFx:7174 · fxRectOf:7291 · fxEnvFor:7297 · pickTacticSpot:7314 · tacticFxOf:7323 · planFx:7327 · commitState:7357 · dispatchAction:7380 · wakeWaiter:7399 · publishClock:7400 · dispatchOnline:7402 · reconcileOwn:7438 · applyUnasked:7452 · ingestRows:7466 · chooseFirstOnline:7494 · absorbAct:7507 · refuseOwn:7516 · sendOnline:7528 · stopOnline:7542 · startOnlinePolling:7559 · fxIdleNow:7577 · waitFxIdle:7578 · nextOpponentAction:7586 · applyRewardToProfile:7613 · openPlayerPick:7621 · playerAct:7649 · openModePrompt:7661 · maybePromptRelicMode:7668 · confirmRelicMode:7677 · confirmUpkeep:7689 · canPlayNow:7702 · readyAttackers:7703 · endTurnWarning:7706 · askEndTurn:7714 · endTurnNow:7720 · sleep:7739 · tutCurrent:7751 · tutCanBack:7755 · tutShow:7760 · tutGo:7776 · tutNext:7784 · tutBack:7798 · tutMatches:7803 · tutSignal:7815 · tutFromAction:7820 · tutBeat:7827 · tutExit:7834 · tutFinish:7841 · startTutorial:7842 · tutLaunchDuel:7847 · tutCoinResolved:7849 · settleAmbush:7906 · startMatchIntro:7939 · continueMatchIntro:7958 · resetGame:8054 · startGame:8114 · startOnlineMatch:8121 · leaveMatch:8163 · handleCardClick:8564 · handlePlayCardButtonClick:8624 · abilityStepCandidates:8683 · abilityHasTargets:8686 · getPlayerCreatureAbilityKind:8708 · getCardVisualEl:8722 · triggerPunch:8813 · renderTravelingArrow:8864 · playPendingTactic:8891 · resolveOwnTacticTarget:8898 · resolveEnemyTacticTarget:8903 · toggleCardPickerSelection:8911 · abilityOf:8925 · nextAbilityStep:8927 · activateAbility:8933 · abilityStepSide:8947 · resolveAbilityTarget:8953 · pushAbilityPrompt:8990 · mine:9011 · foes:9012 · effectTargetKind:9015 · specSlots:9017 · tacticTargeting:9031 · sourceAt:9038 · cancelTargeting:9056 · playHandCardOnTarget:9059 · heldTop:9066 · slotUnder:9067 · clearDragOver:9076 · dragBlockReason:9078 · tapHandCard:9092 · beginPress:9100 · returnHeld:9117 · dropHeldCard:9126 · updateHeld:9155 · dropOk:9174 · handleSlotClick:9230 · handleNpcSlotClick:9410 · handleBackgroundClick:9476 · getTappedCardShift:9507 · getSelectedCardX:9517 · getSelectedCardY:9539 · getBoardAnimation:9563 · getPlayerSlotHint:9604 · isTacticTargetSlot:9623 · tacticTagFor:9631 · boardHeightMultiplier:9707 · boardTopMargin:9708

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

Viewer3DCard:9 · EMBED:12 · urlOf:13 · W:16 · roundedShape:18 · BACK_SX:27 · backGeometry:28 · CardViewer3D:32

## src/CollectionRoom.tsx  (542 linhas)
Sala de Coleção: o quarto em imagem única com objetos tocáveis (livro, porta, estante de boosters, mesa/deck), câmera com zoom e o fichário (Binder).

CardViewer3D:14 · thumbOf:15 · Stock:17 · RARS:18 · versionsOf:19 · bestOf:20 · FOIL_OP:21 · SW:23 · PER:24 · BOOK_W:25 · clamp:26 · wait:27 · GOLD:28 · SPOTS:31 · SpotKey:37 · Plaque:40 · BookTitle:55 · SHELF_ROWS:67 · shelfSlot:68 · Entry:73 · RoomPack:75 · CollectionRoom:76 · NS:233 · SS:234 · BEND:235 · Rect:236 · Phase:237 · Binder:239 · PACK_ASPECT:531 · SheenDriver:534

## src/combatFx.ts  (1069 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

FxSide:50 · FxRect:51 · FxTarget:52 · FxEnv:54 · cv:68 · ctx:69 · RES:70 · fxs:71 · IMG:72 · SRC:73 · readyP:74 · preloadCombatFx:75 · resize:79 · ensureCanvas:80 · R:89 · clamp:90 · eo:91 · at:92 · add:93 · wait:94 · tick:96 · loop:107 · kick:111 · URLS:114 · play:115 · whoosh:116 · pick:119 · FS:126 · sprite:127 · explosion:134 · holy:142 · flash:145 · shock:149 · scorch:156 · puff:160 · dust:166 · debris:169 · sparks:178 · softAngle:185 · fly:196 · arcTangent:235 · stick:236 · ring:242 · burst:245 · sparksDir:250 · glint:257 · cleanHit:264 · lanceFade:268 · thunk:269 · rockBreak:275 · sheetXY:289 · playSheet:295 · ding:297 · coinAt:298 · coinFly:304 · coinBurst:313 · stonesFall:322 · drawBack:333 · flyBack:339 · setScale:344 · pt:345 · tacPoint:346 · landingImpact:350 · fxLanding:381 · landTactic:388 · leaveTactic:400 · weaponReveal:403 · once:430 · fxTactic:434 · fxHero:550 · fxRanged:583 · start:655 · toU:656 · fxUpkeep:660 · fxGoldGain:689 · fxRelicSoldo:702 · fxLoot:717 · fxPlaced:729 · fxReformar:756 · fxAmbush:768 · HOLY_SRC:802 · holyP:803 · loadHoly:804 · preloadHolyFx:805 · startHoly:806 · tween:807 · GOLDC:808 · twNow:811 · twMove:815 · twBurst:820 · charge:823 · risers:826 · groundGlow:829 · whiteFlash:833 · dimAt:837 · glowEl:844 · liftEl:847 · pilar:851 · sigilo:856 · cruzAt:860 · trompaAt:861 · almaAt:862 · heartAt:866 · godrays:869 · asasAt:876 · solAt:880 · portalAt:883 · orb:887 · cometaFly:895 · fxBencao:906 · fxCalice:933 · fxHospitalario:944 · fxNobre:970 · fxReforco:984 · fxComandante:997 · fxRetorno:1011 · fxRetornoCarry:1037 · fxAtirador:1059

## src/deckCode.ts  (42 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

BY_NUMBER:8 · b64:11 · unb64:12 · sum8:15 · encodeDeck:17 · DecodedDeck:25 · decodeDeck:26

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

## src/engine/boosters.ts  (75 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

BOOSTER_PRICE:7 · BOOSTER_CARDS:8 · BOOSTER_IDS:9 · DUP_COROAS:11 · NEW_CARD_BOOST:13 · PoolEntry:15 · boosterPool:17 · Pull:26 · rollBooster:28 · Settled:44 · settleBooster:51 · starterCollection:67

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

## src/i18n/banners.ts  (18 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

EN_ART:5 · WORD:6 · COLORS:7 · svgBanner:8 · bannerSrc:13

## src/i18n/cardFaces.ts  (16 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

PT:6 · EN:7 · PT_EAGER:8 · EN_EAGER:9 · faceUrl:11 · faceThumb:15

## src/i18n/index.ts  (122 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Lang:7 · KEY:8 · read:9 · lang:10 · getLang:11 · hasChosenLang:12 · setLang:13 · changeLang:15 · DICT:17 · norm:18 · esc:19 · Pat:20 · patterns:21 · buildPatterns:22 · cache:30 · lookup:32 · keepEdges:53 · t:55 · tEffect:57 · hasEnglish:58 · ATTRS:64 · origText:65 · origAttr:66 · SKIP:67 · skipNode:68 · hasLetters:69 · originalOf:70 · runOf:71 · setText:75 · processText:76 · processAttrs:87 · walk:97 · observer:105 · startTranslator:106

## src/i18n/LanguageGate.tsx  (22 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

BTN:6 · LanguageGate:11

## src/main.tsx  (40 linhas)
Ponto de entrada do React.

CardViewer3D:12 · Viewer3DPage:13 · only3d:18 · Root:21

## src/menuMusic.ts  (48 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

ctx:6 · buffer:7 · loading:8 · source:9 · gain:10 · wanted:11 · unsub:12 · FADE_IN:13 · level:15 · begin:16 · unlock:24 · startMenuMusic:26 · stopMenuMusic:39 · menuMusicState:47

## src/missionBanner.tsx  (61 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Item:9 · known:10 · started:11 · seq:12 · listeners:13 · noteMissions:16 · checkMissionBanners:30 · Banner:32 · mounted:54 · mountMissionBanner:55

## src/MissionsScreen.tsx  (207 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CINZEL:23 · SERIF:24 · TAG:25 · Tab:26 · left:27 · COINS:30 · SPARKS:31 · Spark:32 · CollectFx:33 · MissionRow:67 · MissionsScreen:104 · MissionsHost:206

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

## src/services/cloud.ts  (113 linhas)
Salvar/ler coleção e decks na nuvem.

CloudProfile:5 · CloudResult:6 · COLUMNS:8 · fail:10 · fetchProfile:23 · usernameAvailable:31 · createProfile:39 · updateProfileFields:47 · RarityMap:58 · CloudDeck:59 · CloudStore:60 · RAR_KEYS:61 · splitRar:62 · joinRar:70 · fetchStore:76 · pushStore:95

## src/services/online.ts  (207 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:34 · QueueResult:57 · ActResult:62 · friendly:66 · call:68 · asActResult:86 · queueForMatch:91 · queueStatus:92 · cancelQueue:93 · sendAction:94 · tickMatch:96 · fetchResult:97 · fetchViews:103 · EmoteMsg:112 · EmoteResult:113 · asEmoteResult:114 · sendEmote:116 · fetchEmotes:117 · RankedView:120 · RankingRow:122 · fetchRanked:123 · fetchRanking:124 · claimSeason:127 · FriendRoom:130 · FriendResult:131 · friendCreate:132 · friendStatus:133 · friendCancel:134 · friendJoin:135 · friendPeek:136 · friendLink:141 · ReportReason:144 · reportOpponent:145 · deleteMyAccount:150 · FeedbackKind:155 · sendFeedback:156 · adminFeedbackDone:160 · adminBan:162 · adminUnban:163 · AdminInfo:166 · fetchAdmin:179 · pingPresence:181 · MissionView:184 · MissionsBoard:185 · MissionsResult:186 · missionsCall:187 · fetchMissions:192 · claimMission:193 · rerollMission:194 · BoosterCard:197 · BoosterResult:198 · openBoosterOnServer:199 · ensureCollectionOnServer:206

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

## server/handler.ts  (815 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:23 · defaultConfig:35 · MatchInit:37 · EMOTE_CODE:68 · EMOTE_GAP_MS:69 · EMOTE_MAX_PER_MATCH:70 · RankedView:73 · PLACEMENT:76 · REPEAT_LIMIT:77 · frameRank:78 · calendar:80 · rankedView:85 · ladderOf:98 · GameRequest:111 · GameResponse:142 · BOT_PROFILE:162 · STALE_MATCH_MS:163 · BOT_STEP_LIMIT:164 · AUTO_STEP_LIMIT:165 · recipeDeck:167 · botDeckFor:169 · playerOf:170 · userOfSeat:171 · moverOf:172 · moverKey:173 · Work:178 · startWork:187 · applyStep:190 · runBot:213 · patchOf:224 · pickRankedOpponent:233 · ensureRewards:251 · UNIT_TYPES:297 · countMissions:298 · publicReward:316 · rewardOf:322 · enforceClock:327 · openMatch:365 · viewRowsOf:372 · initOf:374 · startMatch:401 · finishIfStale:427 · OPS:438 · badRequest:439 · withTotals:474 · cleanRar:480 · Who:494 · isAdmin:495 · ONLINE_MS:496 · LIMITS:500 · DEFAULT_LIMIT:504 · hits:505 · rateLimited:506 · resetRateLimits:514 · REPORT_DAILY_MAX:515 · ROOM_MS:516 · ROOM_ALPHABET:517 · handleGame:519

## server/memoryDb.ts  (222 linhas)
Banco em memória (testes).

MemoryTables:8 · clone:13 · MemoryDb:15

## server/missions.ts  (146 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

MissionItem:8 · MissionState:9 · MissionView:10 · MissionsBoard:11 · BR:16 · weekStart:17 · dayEndsAt:18 · weekEndsAt:19 · seedOf:22 · rngOf:23 · shuffled:24 · drawMissions:26 · defOf:36 · kindOfKey:37 · load:40 · mutate:51 · keysAt:61 · MatchFacts:63 · countMatch:65 · viewOf:85 · syncSeason:91 · board:101 · claim:115 · reroll:133

## server/supabaseDb.ts  (286 linhas)
Banco no Supabase.

Client:10 · must:12 · viewToDb:17 · viewFromDb:20 · profileFromDb:21 · matchFromDb:22 · supabaseDb:24

## server/types.ts  (252 linhas)
Tipos do servidor e do banco.

DeckRar:8 · DeckJson:9 · RoomRow:12 · QueueRow:14 · StepRow:24 · ViewRow:32 · EndReason:43 · RewardRow:45 · RankedOutcome:59 · MatchRow:66 · MatchPatch:87 · EmoteRow:90 · SeasonRow:93 · AdminOverview:96 · FeedbackKind:111 · FEEDBACK_KINDS:112 · FeedbackRow:113 · AdminFeedback:114 · ReportReason:115 · REPORT_REASONS:116 · ReportRow:117 · AdminReport:118 · AdminPlayer:122 · MissionStateRow:131 · Db:133 · buildAdminPlayers:209 · dayKey:227 · lastDays:228 · windowsOf:229 · buildAdminReports:235 · buildAdminFeedback:249

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

## tests/deck-code.ts  (18 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

failed:4 · ok:5 · code:11

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

## tests/i18n.ts  (25 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

failed:8 · check:9 · D:10 · ignore:11 · missing:12

## tests/match-report.ts  (164 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Turn:15 · Game:16 · blank:25 · SOLD:26 · material:27 · count:28 · SLOT:29 · play:31 · avg:86 · f:87 · main:89

## tests/missions.ts  (21 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

fails:3 · off:9 · best:12 · dailyMax:13 · perDay:15 · onMax:17

## tests/mock-supabase.ts  (128 linhas)
Supabase falso para os testes online.

Row:10 · tables:11 · memory:12 · cfg:13 · b64:18 · users:19 · cors:20 · send:26 · readBody:30 · uidFrom:33

## tests/online-server.ts  (825 linhas)
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

## tools/i18n/extrair.ts  (61 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

ROOT:8 · FILES:9 · walk:10 · ACCENT:17 · STOP:18 · looksCode:19 · CSS:20 · isPt:21 · extrairTudo:23 · found:24

## tools/mercenarios-prompts.ts  (216 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

slug:8 · LOOK:11 · LAND:12 · TALL:13 · END_LAND:14 · END_TALL:15 · Entry:17 · ENTRIES:19 · defs:132 · recipe:133 · order:134 · DELIVERED:138 · promptOf:139 · kind:140 · stats:141 · cleanEffect:142 · allOrdered:145 · numberOf:146 · ordered:147 · md:148 · readmePath:156 · readme:157 · start:158 · esc:170 · cards:171 · html:179

## tools/mercenarios-tabela.ts  (20 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

rows:6 · table:12 · path:13 · doc:14 · start:15 · end:16

## tools/video/gerar-defs.ts  (7 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

d:3 · out:4
