<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11659 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:278 · DRAW_FLIGHT_MS:304 · sfxVol:313 · playCardDrawSfx:314 · playCardPlaySfx:328 · playAttackSfx:335 · playEffectSfx:337 · playTacticSfx:338 · playSelectSfx:346 · bannerAudioCtx:358 · playBannerSfx:359 · playUiClickSfx:402 · playCardLiftSfx:411 · playDamageSfx:423 · playGeneralDamageSfx:428 · playDestroySfx:438 · playAshArriveSfx:439 · playRevealGeneralSfx:441 · playWarHornSfx:447 · playBatalhaBannerSfx:452 · playBatalhaImpactSfx:460 · CardType:466 · CardData:468 · StatTone:519 · STAT_TONE_COLOR:520 · STAT_TONE_GRADIENT:521 · statsOf:526 · SlotHint:535 · getSlotHint:544 · RowRoleHint:550 · SOLDIER_CARD_TYPES:551 · getRowRoleHint:552 · ROW_ROLE_VIEW:559 · PHASE_BANNER_TEXT:583 · BATALHA_FALL_MS:605 · BATALHA_IMPACT_FRACTION:606 · BANNER_LEARN_COUNT:610 · bannersSeen:611 · PHASE_BANNER_STAGE_MS:612 · phaseBannerMs:613 · PHASE_BANNER_Y:621 · PHASE_BANNER_MOTION:622 · HIT_STOP_MS:633 · ATTACK_MS:636 · ATTACK_WINDUP_FRAC:637 · ATTACK_WINDUP_PX:638 · ATTACK_TILT_DEG:639 · IMPACT_MS:640 · TIME:643 · rangedKindOf:645 · FINAL_SLOW:646 · FINAL_INTRO_MS:647 · FINAL_FREEZE_MS:648 · FINAL_AFTER_MS:649 · SLASH_SPARK_ANGLES:652 · SlashEffect:661 · TargetKind:699 · TARGET_STYLE:700 · HUD_CARD_SCALE:706 · AmountBadge:710 · TargetingHud:727 · READY_COLORS:797 · SILHOUETTES:802 · silhouetteFor:807 · DEBUG_HOOKS:818 · TriggerIcon:820 · FLIGHT_MS:834 · HELD_SCALE:835 · HELD_GAP:836 · TriggerBurst:837 · TriggerFloatLayer:858 · AbilityReadyGlow:875 · TutRect:903 · tutPct:904 · tutSilBox:905 · tutElRect:914 · tutPad:915 · tutUnion:916 · TutResolved:921 · TUT_EMPTY:922 · visibleHandCards:923 · resolveTutTarget:924 · TutorialStage:971 · SpriteOnce:1015 · EffectIcon:1032 · EFFECT_ICONS:1033 · SpriteIcon:1041 · IconPop:1046 · SHIELD_SHEETS:1061 · GOLD_BUBBLE:1067 · ShieldAura:1068 · ShieldFxOnce:1077 · EquipFxLayer:1091 · PUNCH_FRAMES:1137 · PUNCH_FRAME_W:1138 · DRAW_STYLE:1146 · DrawFlightNovo:1147 · RepositionLegNovo:1192 · FlyingCardNovo:1218 · lastArrowKey:1248 · drawFlightDelay:1249 · PunchFx:1250 · BURN_FRAMES:1286 · BurningCard:1288 · GraveyardPile:1344 · AtkBadge:1376 · NUMBER_KIND_OF:1388 · NUMBER_TIERS:1393 · damageTier:1399 · floatLife:1400 · FloatNumber:1401 · HpBadge:1451 · GoldBadge:1480 · GoldNumber:1509 · CardBack:1569 · CARD_THICKNESS_SHADOW:1607 · cardBoxShadow:1618 · cardGlowFilter:1619 · CARD_FACE_VARIANTS:1629 · NO_STAT_TYPES:1646 · templateForType:1647 · templateForTypeMini:1652 · FitText:1671 · KeywordPill:1746 · STAT_TOKEN:1760 · STAT_NUMBER_STYLE:1761 · StatSymbol:1762 · CoinIcon:1770 · GoldSymbol:1773 · DamageSymbol:1778 · RULE_WORD_STYLE:1790 · renderEffectText:1791 · FitEffectText:1831 · FULL_ART_PLATE_VARIANTS:1895 · FULL_ART_SIZE_FIX:1905 · CardFaceFullArt:1906 · FullArtMiniConfig:2030 · FULL_ART_MINI_CONFIG:2035 · usesLightBar:2063 · nameTextStyle:2064 · FULL_ART_MINI_DEFAULT:2067 · fullArtMiniConfigForType:2072 · CardFaceFullArtMini:2087 · CARD_FACE_MINI_STD_SCALE:2137 · CardFaceStandardMini:2138 · rarNameCls:2204 · RarityCardShine:2205 · CardFace:2210 · BOARD_EXTERIOR_ART_URL:2324 · FIELD_PREVIEW_SCALE:2329 · BOARD_PREVIEW_SCALE:2347 · FAN_SPREAD_DEG:2350 · FAN_LIFT_PX:2351 · HAND_CARD_WIDTH:2352 · HAND_CARD_HEIGHT:2353 · HAND_CARD_STEP:2356 · HAND_FULL_SPREAD_COUNT:2359 · HAND_SELECT_SCALE:2362 · handStepFor:2363 · ART_BY_NAME:2370 · MERC_ART_FILES:2424 · artSlug:2425 · CAMPO_ART_FILES:2431 · CAPITAO_ART_FILES:2437 · cardDataFromName:2443 · buildDeckCards:2447 · DECK_CAPITAO:2455 · DECK_CARDEAL:2456 · DECK_MERCENARIOS:2457 · DECK_CAMPO:2458 · DECKS:2462 · ALL_DECK_IDS:2492 · BOOSTER_POOLS:2495 · DECK_STORE_KEY:2515 · CARD_INSTANCES_BY_NAME:2517 · cardByName:2525 · isGeneralName:2526 · DeckSlot:2528 · DeckStore:2530 · DeckSelection:2532 · lastDeckRar:2533 · OnlineMatch:2539 · needsServer:2571 · visibleKey:2583 · countByName:2588 · CAPITAO_STARTER_NAME:2594 · MERC_STARTER_NAME:2595 · CAMPO_STARTER_NAME:2596 · CLOUD_DECK_SLOTS:2598 · MAX_DECK_SLOTS:2599 · buildStarterStore:2602 · sameCards:2626 · ensureStarterDecks:2630 · lastSanitizeMigrated:2662 · sanitizeDeckStore:2663 · loadDeckStore:2701 · cloudUserId:2715 · pushTimer:2716 · pushing:2717 · pushAgain:2718 · toCloudDecks:2719 · runPush:2720 · saveDeckStore:2733 · stopCloudSync:2738 · flushCloudSync:2740 · syncDeckStoreWithCloud:2751 · deckCardCount:2782 · deckProblem:2784 · buildDeckSelection:2792 · deckIdOfGeneral:2801 · DEFAULT_DECK_SELECTION:2802 · PlayerProfile:2811 · AVATAR_OPTIONS:2827 · avatarById:2880 · PROFILE_STORAGE_KEY:2882 · DEFAULT_PROFILE:2883 · loadProfile:2896 · formatCoroas:2910 · saveProfile:2915 · MODE_LABELS_PT:2924 · AvatarBadge:2934 · PlayerPlate:2949 · WINDOW_FRAME_PX:2978 · WINDOW_FONT_DECO:2979 · FramedWindow:2981 · WindowOverlay:2986 · WindowDivider:3009 · WindowTitle:3017 · Edges:3025 · ArtFrame:3026 · VLine:3047 · HLine:3050 · ArtChip:3055 · WindowOption:3061 · WindowText:3065 · WindowButton:3069 · AvatarPickerModal:3075 · ALLOW_PROFILE_RENAME:3123 · ProfileBar:3124 · ComingSoonModal:3245 · ONLINE_MODES:3261 · OnlineModeModal:3265 · TapPhase:3297 · MENU_CONFIRM_MS:3298 · useMenuTap:3299 · PlaqueSparks:3323 · PLAQUE_ASPECT:3342 · PLAQUE_CAP_CQW:3343 · MenuCard:3344 · MenuTextButton:3393 · ago:3407 · GmPanel:3408 · MenuIconButton:3435 · MainMenu:3466 · InstallPrompt:3609 · DeckPickerModal:3645 · CARD_TYPE_ORDER:3676 · DeckSide:3677 · EditorSort:3678 · EDITOR_SORTS:3679 · EDITOR_MARGIN:3680 · EDITOR_FRAME:3681 · EDITOR_PAD:3682 · LIST_COLS:3685 · ROW_H:3686 · FULL_ART_TILE_SCALE:3687 · DeckEditor:3689 · ShopPhase:4269 · NpcMood:4270 · BoosterDef:4271 · BOOSTERS:4273 · TEST_FREE_BOOSTERS:4282 · SHELF_ROWS:4283 · SHELF_COLS:4284 · BOOSTER_ASPECT:4285 · SHELF_X0:4290 · SHELF_X1:4291 · SHELF_PLANKS:4292 · SHELF_OVERVIEW:4293 · SHELF_CLOSEUP:4294 · NPC_LINES:4296 · SHOP_ART:4304 · rollBooster:4312 · BoosterArt:4328 · NpcArt:4340 · PACK_TEAR_Y:4347 · LID_SLICES:4348 · LidSlice:4354 · PackTear:4377 · PulledCard:4446 · pullBooster:4447 · PackOpeningOld:4461 · CARD3D_FILES:4542 · card3dUrl:4543 · Booster3DOpening:4544 · PackOpening:4582 · OpenBoosterFromTable:4587 · ShopScreen:4593 · AuthBackdrop:4833 · GoogleMark:4854 · DiscordMark:4857 · AuthButton:4859 · authFieldClass:4865 · LoginScreen:4867 · NAME_RULE:4928 · ProfileSetupScreen:4930 · VolumeRow:4996 · ToggleRow:5005 · OptionsModal:5015 · SettingsModal:5049 · playCoinSfx:5086 · lastGoldSfx:5112 · playGoldSpendSfx:5113 · COIN_THICK:5117 · CoinFace:5118 · CoinRim:5127 · RemotePick:5146 · CoinToss:5147 · MatchSearchOverlay:5229 · OnlineSearchOverlay:5270 · LoadingScreen:5345 · App:5399 · IMMEDIATE_ZONE_LABEL:11105 · DragFinger:11110 · GuideInfo:11127 · DragGuide:11128 · arrivalDrops:11195 · arrivalListener:11197 · EmblemKind:11202 · EMBLEM_ART:11203 · SlotEmblem:11204 · RowPlaque:11217 · CardSlot:11229

Dentro de `App` (linhas 5399–11104), funções internas:
attackMarkFor:5649 · openCardPicker:5676 · spawnFloatingNumber:5712 · spawnFloatingNumberAtId:5728 · showBanner:5755 · announcePhase:5779 · announceTurnChange:5789 · trackOverlay:5822 · beginFinalBlow:5831 · endFinalBlow:5832 · blowIsSoaked:5835 · handleInstallClick:5924 · shieldOverSlot:5980 · popOverSlot:5989 · burstAt:6004 · whenGlowDone:6029 · endGlow:6030 · startTriggerFx:6034 · holdForSeat:6062 · terrainFxPlayer:6090 · terrainFxNpc:6091 · fireImpactBurst:6107 · noteDragPlay:6131 · handFanMaxAngleRad:6201 · getHandArrivalPoint:6310 · getFanRotation:6330 · getFanLift:6337 · computeDrawOrigin:6352 · showToast:6367 · announceCardPlay:6373 · rarityOfCard:6451 · toCardData:6458 · shownStats:6474 · boardView:6485 · syncView:6490 · processEvents:6526 · armedSlotsOf:6754 · cardOverlayFx:6755 · fxRectOf:6872 · fxEnvFor:6878 · pickTacticSpot:6895 · tacticFxOf:6904 · planFx:6908 · commitState:6938 · dispatchAction:6961 · wakeWaiter:6980 · publishClock:6981 · dispatchOnline:6983 · reconcileOwn:7019 · applyUnasked:7033 · ingestRows:7047 · chooseFirstOnline:7075 · absorbAct:7088 · refuseOwn:7097 · sendOnline:7109 · stopOnline:7123 · startOnlinePolling:7140 · fxIdleNow:7158 · waitFxIdle:7159 · nextOpponentAction:7167 · applyRewardToProfile:7194 · openPlayerPick:7201 · playerAct:7229 · openModePrompt:7241 · maybePromptRelicMode:7248 · confirmRelicMode:7257 · confirmUpkeep:7269 · endTurnNow:7281 · sleep:7300 · tutCurrent:7312 · tutCanBack:7316 · tutShow:7321 · tutGo:7337 · tutNext:7345 · tutBack:7359 · tutMatches:7364 · tutSignal:7376 · tutFromAction:7381 · tutBeat:7388 · tutExit:7395 · tutFinish:7402 · startTutorial:7403 · tutLaunchDuel:7408 · tutCoinResolved:7410 · settleAmbush:7467 · startMatchIntro:7500 · continueMatchIntro:7519 · resetGame:7615 · startGame:7675 · startOnlineMatch:7682 · leaveMatch:7724 · handleCardClick:8080 · handlePlayCardButtonClick:8140 · abilityStepCandidates:8199 · abilityHasTargets:8202 · getPlayerCreatureAbilityKind:8224 · getCardVisualEl:8238 · triggerPunch:8329 · renderTravelingArrow:8380 · playPendingTactic:8407 · resolveOwnTacticTarget:8414 · resolveEnemyTacticTarget:8419 · toggleCardPickerSelection:8427 · abilityOf:8441 · nextAbilityStep:8443 · activateAbility:8449 · abilityStepSide:8463 · resolveAbilityTarget:8469 · pushAbilityPrompt:8506 · mine:8527 · foes:8528 · effectTargetKind:8531 · specSlots:8533 · tacticTargeting:8547 · sourceAt:8554 · cancelTargeting:8572 · playHandCardOnTarget:8575 · heldTop:8582 · slotUnder:8583 · clearDragOver:8592 · dragBlockReason:8594 · tapHandCard:8606 · beginPress:8614 · returnHeld:8631 · dropHeldCard:8640 · updateHeld:8669 · dropOk:8688 · handleSlotClick:8744 · handleNpcSlotClick:8924 · handleBackgroundClick:8990 · getTappedCardShift:9021 · getSelectedCardX:9031 · getSelectedCardY:9053 · getBoardAnimation:9077 · getPlayerSlotHint:9118 · isTacticTargetSlot:9137 · tacticTagFor:9145 · boardHeightMultiplier:9221 · boardTopMargin:9222

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

## tools/video/gerar-defs.ts  (7 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

d:3 · out:4
