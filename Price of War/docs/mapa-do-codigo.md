<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11591 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:275 · DRAW_FLIGHT_MS:301 · sfxVol:310 · playCardDrawSfx:311 · playCardPlaySfx:325 · playAttackSfx:332 · playEffectSfx:334 · playTacticSfx:335 · playSelectSfx:343 · bannerAudioCtx:355 · playBannerSfx:356 · playUiClickSfx:399 · playCardLiftSfx:408 · playDamageSfx:420 · playGeneralDamageSfx:425 · playDestroySfx:435 · playRevealGeneralSfx:437 · playWarHornSfx:443 · playBatalhaBannerSfx:448 · playBatalhaImpactSfx:456 · CardType:462 · CardData:464 · StatTone:515 · STAT_TONE_COLOR:516 · STAT_TONE_GRADIENT:517 · statsOf:522 · SlotHint:531 · getSlotHint:540 · RowRoleHint:546 · SOLDIER_CARD_TYPES:547 · getRowRoleHint:548 · ROW_ROLE_VIEW:555 · PHASE_BANNER_TEXT:579 · BATALHA_FALL_MS:601 · BATALHA_IMPACT_FRACTION:602 · BANNER_LEARN_COUNT:606 · bannersSeen:607 · PHASE_BANNER_STAGE_MS:608 · phaseBannerMs:609 · PHASE_BANNER_Y:617 · PHASE_BANNER_MOTION:618 · HIT_STOP_MS:629 · ATTACK_MS:632 · ATTACK_WINDUP_FRAC:633 · ATTACK_WINDUP_PX:634 · ATTACK_TILT_DEG:635 · IMPACT_MS:636 · TIME:639 · rangedKindOf:641 · FINAL_SLOW:642 · FINAL_INTRO_MS:643 · FINAL_FREEZE_MS:644 · FINAL_AFTER_MS:645 · SLASH_SPARK_ANGLES:648 · SlashEffect:657 · TargetKind:695 · TARGET_STYLE:696 · HUD_CARD_SCALE:702 · AmountBadge:706 · TargetingHud:723 · READY_COLORS:793 · SILHOUETTES:798 · silhouetteFor:803 · DEBUG_HOOKS:814 · TriggerIcon:816 · FLIGHT_MS:830 · HELD_SCALE:831 · HELD_GAP:832 · TriggerBurst:833 · TriggerFloatLayer:854 · AbilityReadyGlow:871 · TutRect:902 · tutPct:903 · tutSilBox:904 · tutElRect:913 · tutPad:914 · tutUnion:915 · TutResolved:920 · TUT_EMPTY:921 · visibleHandCards:922 · resolveTutTarget:923 · TutorialStage:970 · SpriteOnce:1014 · EffectIcon:1031 · EFFECT_ICONS:1032 · SpriteIcon:1040 · IconPop:1045 · SHIELD_SHEETS:1060 · GOLD_BUBBLE:1066 · ShieldAura:1067 · ShieldFxOnce:1087 · EquipFxLayer:1101 · PUNCH_FRAMES:1147 · PUNCH_FRAME_W:1148 · DRAW_STYLE:1156 · DrawFlightNovo:1157 · RepositionLegNovo:1202 · FlyingCardNovo:1228 · lastArrowKey:1258 · drawFlightDelay:1259 · PunchFx:1260 · BURN_FRAMES:1296 · BurningCard:1298 · GraveyardPile:1354 · AtkBadge:1386 · NUMBER_KIND_OF:1398 · NUMBER_TIERS:1403 · damageTier:1409 · floatLife:1410 · FloatNumber:1411 · HpBadge:1461 · GoldBadge:1490 · GoldNumber:1519 · CardBack:1579 · CARD_THICKNESS_SHADOW:1617 · cardBoxShadow:1628 · cardGlowFilter:1629 · CARD_FACE_VARIANTS:1639 · NO_STAT_TYPES:1656 · templateForType:1657 · templateForTypeMini:1662 · FitText:1681 · KeywordPill:1756 · STAT_TOKEN:1770 · STAT_NUMBER_STYLE:1771 · StatSymbol:1772 · CoinIcon:1780 · GoldSymbol:1783 · DamageSymbol:1788 · RULE_WORD_STYLE:1800 · renderEffectText:1801 · FitEffectText:1841 · FULL_ART_PLATE_VARIANTS:1905 · FULL_ART_SIZE_FIX:1915 · CardFaceFullArt:1916 · FullArtMiniConfig:2040 · FULL_ART_MINI_CONFIG:2045 · usesLightBar:2073 · nameTextStyle:2074 · FULL_ART_MINI_DEFAULT:2077 · fullArtMiniConfigForType:2082 · CardFaceFullArtMini:2097 · CARD_FACE_MINI_STD_SCALE:2147 · CardFaceStandardMini:2148 · rarNameCls:2214 · RarityCardShine:2215 · CardFace:2220 · BOARD_EXTERIOR_ART_URL:2334 · FIELD_PREVIEW_SCALE:2339 · BOARD_PREVIEW_SCALE:2357 · FAN_SPREAD_DEG:2360 · FAN_LIFT_PX:2361 · HAND_CARD_WIDTH:2362 · HAND_CARD_HEIGHT:2363 · HAND_CARD_STEP:2366 · HAND_FULL_SPREAD_COUNT:2369 · HAND_SELECT_SCALE:2372 · handStepFor:2373 · ART_BY_NAME:2380 · MERC_ART_FILES:2434 · artSlug:2435 · CAMPO_ART_FILES:2441 · CAPITAO_ART_FILES:2447 · cardDataFromName:2453 · buildDeckCards:2457 · DECK_CAPITAO:2465 · DECK_CARDEAL:2466 · DECK_MERCENARIOS:2467 · DECK_CAMPO:2468 · DECKS:2472 · ALL_DECK_IDS:2502 · BOOSTER_POOLS:2505 · DECK_STORE_KEY:2525 · CARD_INSTANCES_BY_NAME:2527 · cardByName:2535 · isGeneralName:2536 · DeckSlot:2538 · DeckStore:2540 · DeckSelection:2542 · lastDeckRar:2543 · OnlineMatch:2549 · needsServer:2581 · visibleKey:2593 · countByName:2598 · CAPITAO_STARTER_NAME:2604 · MERC_STARTER_NAME:2605 · CAMPO_STARTER_NAME:2606 · CLOUD_DECK_SLOTS:2608 · MAX_DECK_SLOTS:2609 · buildStarterStore:2612 · sameCards:2636 · ensureStarterDecks:2640 · lastSanitizeMigrated:2672 · sanitizeDeckStore:2673 · loadDeckStore:2711 · cloudUserId:2725 · pushTimer:2726 · pushing:2727 · pushAgain:2728 · toCloudDecks:2729 · runPush:2730 · saveDeckStore:2743 · stopCloudSync:2748 · flushCloudSync:2750 · syncDeckStoreWithCloud:2761 · deckCardCount:2792 · deckProblem:2794 · buildDeckSelection:2802 · deckIdOfGeneral:2811 · DEFAULT_DECK_SELECTION:2812 · PlayerProfile:2821 · AVATAR_OPTIONS:2837 · avatarById:2890 · PROFILE_STORAGE_KEY:2892 · DEFAULT_PROFILE:2893 · loadProfile:2906 · formatCoroas:2920 · saveProfile:2925 · MODE_LABELS_PT:2934 · AvatarBadge:2944 · PlayerPlate:2959 · WINDOW_FRAME_PX:2988 · WINDOW_FONT_DECO:2989 · FramedWindow:2991 · WindowOverlay:2996 · WindowDivider:3019 · WindowTitle:3027 · Edges:3035 · ArtFrame:3036 · VLine:3057 · HLine:3060 · ArtChip:3065 · WindowOption:3071 · WindowText:3075 · WindowButton:3079 · AvatarPickerModal:3085 · ALLOW_PROFILE_RENAME:3133 · ProfileBar:3134 · ComingSoonModal:3255 · ONLINE_MODES:3271 · OnlineModeModal:3275 · TapPhase:3307 · MENU_CONFIRM_MS:3308 · useMenuTap:3309 · PlaqueSparks:3333 · PLAQUE_ASPECT:3352 · PLAQUE_CAP_CQW:3353 · MenuCard:3354 · MenuIconButton:3403 · MainMenu:3434 · InstallPrompt:3570 · DeckPickerModal:3606 · CARD_TYPE_ORDER:3637 · DeckSide:3638 · EditorSort:3639 · EDITOR_SORTS:3640 · EDITOR_MARGIN:3641 · EDITOR_FRAME:3642 · EDITOR_PAD:3643 · LIST_COLS:3646 · ROW_H:3647 · FULL_ART_TILE_SCALE:3648 · DeckEditor:3650 · ShopPhase:4230 · NpcMood:4231 · BoosterDef:4232 · BOOSTERS:4234 · TEST_FREE_BOOSTERS:4243 · SHELF_ROWS:4244 · SHELF_COLS:4245 · BOOSTER_ASPECT:4246 · SHELF_X0:4251 · SHELF_X1:4252 · SHELF_PLANKS:4253 · SHELF_OVERVIEW:4254 · SHELF_CLOSEUP:4255 · NPC_LINES:4257 · SHOP_ART:4265 · rollBooster:4273 · BoosterArt:4289 · NpcArt:4301 · PACK_TEAR_Y:4308 · LID_SLICES:4309 · LidSlice:4315 · PackTear:4338 · PulledCard:4407 · pullBooster:4408 · PackOpeningOld:4422 · CARD3D_FILES:4503 · card3dUrl:4504 · Booster3DOpening:4505 · PackOpening:4543 · OpenBoosterFromTable:4548 · ShopScreen:4554 · AuthBackdrop:4794 · GoogleMark:4815 · DiscordMark:4818 · AuthButton:4820 · authFieldClass:4826 · LoginScreen:4828 · NAME_RULE:4889 · ProfileSetupScreen:4891 · VolumeRow:4957 · ToggleRow:4966 · OptionsModal:4976 · SettingsModal:5010 · playCoinSfx:5047 · COIN_THICK:5075 · CoinFace:5076 · CoinRim:5085 · RemotePick:5104 · CoinToss:5105 · MatchSearchOverlay:5187 · OnlineSearchOverlay:5228 · LoadingScreen:5303 · App:5357 · IMMEDIATE_ZONE_LABEL:11045 · DragFinger:11050 · GuideInfo:11067 · DragGuide:11068 · arrivalDrops:11135 · arrivalListener:11137 · EmblemKind:11142 · EMBLEM_ART:11143 · SlotEmblem:11144 · RowPlaque:11157 · CardSlot:11169

Dentro de `App` (linhas 5357–11044), funções internas:
attackMarkFor:5600 · openCardPicker:5627 · spawnFloatingNumber:5663 · spawnFloatingNumberAtId:5679 · showBanner:5706 · announcePhase:5730 · announceTurnChange:5740 · trackOverlay:5773 · beginFinalBlow:5782 · endFinalBlow:5783 · blowIsSoaked:5786 · handleInstallClick:5875 · shieldOverSlot:5931 · popOverSlot:5940 · burstAt:5955 · whenGlowDone:5980 · endGlow:5981 · startTriggerFx:5985 · holdForSeat:6013 · terrainFxPlayer:6041 · terrainFxNpc:6042 · fireImpactBurst:6058 · noteDragPlay:6081 · handFanMaxAngleRad:6151 · getHandArrivalPoint:6260 · getFanRotation:6280 · getFanLift:6287 · computeDrawOrigin:6302 · showToast:6317 · announceCardPlay:6323 · rarityOfCard:6401 · toCardData:6408 · shownStats:6424 · boardView:6435 · syncView:6440 · processEvents:6476 · armedSlotsOf:6702 · cardOverlayFx:6703 · fxRectOf:6820 · fxEnvFor:6826 · pickTacticSpot:6843 · tacticFxOf:6852 · planFx:6856 · commitState:6886 · dispatchAction:6909 · wakeWaiter:6928 · publishClock:6929 · dispatchOnline:6931 · reconcileOwn:6967 · applyUnasked:6981 · ingestRows:6995 · chooseFirstOnline:7023 · absorbAct:7036 · refuseOwn:7045 · sendOnline:7057 · stopOnline:7071 · startOnlinePolling:7088 · fxIdleNow:7106 · waitFxIdle:7107 · nextOpponentAction:7115 · applyRewardToProfile:7142 · openPlayerPick:7149 · playerAct:7177 · openModePrompt:7189 · maybePromptRelicMode:7196 · confirmRelicMode:7205 · confirmUpkeep:7217 · endTurnNow:7229 · sleep:7248 · tutCurrent:7260 · tutCanBack:7264 · tutShow:7269 · tutGo:7285 · tutNext:7293 · tutBack:7307 · tutMatches:7312 · tutSignal:7324 · tutFromAction:7329 · tutBeat:7336 · tutExit:7343 · tutFinish:7350 · startTutorial:7351 · tutLaunchDuel:7356 · tutCoinResolved:7358 · settleAmbush:7415 · startMatchIntro:7448 · continueMatchIntro:7467 · resetGame:7563 · startGame:7623 · startOnlineMatch:7630 · leaveMatch:7672 · handleCardClick:8028 · handlePlayCardButtonClick:8088 · abilityStepCandidates:8147 · abilityHasTargets:8150 · getPlayerCreatureAbilityKind:8172 · getCardVisualEl:8186 · triggerPunch:8277 · renderTravelingArrow:8328 · playPendingTactic:8355 · resolveOwnTacticTarget:8362 · resolveEnemyTacticTarget:8367 · toggleCardPickerSelection:8375 · abilityOf:8389 · nextAbilityStep:8391 · activateAbility:8397 · abilityStepSide:8411 · resolveAbilityTarget:8417 · pushAbilityPrompt:8454 · mine:8475 · foes:8476 · effectTargetKind:8479 · specSlots:8481 · tacticTargeting:8495 · sourceAt:8502 · cancelTargeting:8520 · playHandCardOnTarget:8523 · heldTop:8530 · slotUnder:8531 · clearDragOver:8540 · dragBlockReason:8542 · tapHandCard:8554 · beginPress:8562 · returnHeld:8579 · dropHeldCard:8588 · updateHeld:8617 · dropOk:8636 · handleSlotClick:8692 · handleNpcSlotClick:8872 · handleBackgroundClick:8938 · getTappedCardShift:8969 · getSelectedCardX:8979 · getSelectedCardY:9001 · getBoardAnimation:9025 · getPlayerSlotHint:9066 · isTacticTargetSlot:9085 · tacticTagFor:9093 · boardHeightMultiplier:9169 · boardTopMargin:9170

## src/ashFx.ts  (123 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Box:5 · AshOpts:6 · NS:8 · nz:9 · noiseGrid:10 · lerp:11 · ease:12 · noise:13 · fbm:14 · HIT:15 · burnAt:16 · BURN_S:17 · loadImg:19 · Part:21 · Ash:22 · fxAshes:24

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/boosterOpen3d.ts  (203 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

OpenCard:13 · OpenOpts:14 · HALO:15 · ART_RECT:17 · playBoosterOpening:19

## src/campoFx.ts  (336 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:9 · AURA:11 · Env:12 · cvs:15 · ctx:16 · fxs:17 · ensure:18 · resize:23 · R:24 · clamp:25 · eo:26 · lerp:27 · at:28 · add:29 · wait:30 · rc:33 · setU:34 · dirOf:35 · edgeY:36 · cols:37 · midY:38 · spawn:41 · glow:42 · drawP:43 · stepP:59 · flame:63 · ember:64 · fan:65 · ring:66 · dust:67 · glints:68 · Layer:72 · layers:73 · night:74 · animated:75 · tower:77 · armedOf:85 · Frame:90 · Sil:91 · SIL:92 · frameOf:93 · silOf:98 · ringOf:106 · edgeOf:115 · drawRing:119 · holderOf:120 · auraSlots:121 · layerTick:123 · layerDraw:146 · nightTick:156 · nightDraw:160 · inFrame:168 · overlayOpen:170 · busy:175 · frame:176 · step:181 · kick:197 · clearAll:198 · clearCampoLayers:199 · syncCampoLayers:203 · clang:225 · prep:226 · fxForjaPlaced:229 · equipTransfer:237 · fxForjaEquip:249 · fxFogoEquip:250 · fxArsenalEquip:251 · fxForjaModo:253 · fxFogoPlaced:260 · fxFogoTrincheira:270 · fxFogoSaque:279 · fxNoitePlay:289 · fxNoiteTrail:290 · branch:299 · fxMata:306 · WEAPONS:315 · weaponPath:316 · fxArsenalPlaced:324

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/cardFx.ts  (358 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CardRect:7 · Part:8 · cv:11 · parts:12 · ensure:13 · kick:19 · frame:20 · R:28 · clamp:29 · add:30 · run:32 · emit:39 · stepParts:40 · drawParts:43 · softGlow:53 · rr:54 · RINGS:57 · frameImgOf:58 · SOLID:60 · solidOf:61 · silRing:71 · drawSil:80 · hintEl:84 · fxHintFrame:86 · ctr:87 · fxLand:91 · fxImpact:117 · BN:145 · BURN:146 · noise:147 · nz:150 · F:152 · maskUrl:153 · burnMaskSheet:155 · mkLayer:162 · fxBurn:164 · fxLunge:205 · fxDrop:241 · ArrowSpec:259 · arrows:260 · exitT:261 · PERIOD:265 · drawArrow:266 · fxArrows:302 · fxDrawFollow:313 · fxMoveFollow:331 · SelItem:347 · selItems:348 · fxSelection:349

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

## src/services/online.ts  (125 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:33 · QueueResult:56 · ActResult:61 · call:66 · asActResult:83 · queueForMatch:88 · queueStatus:89 · cancelQueue:90 · sendAction:91 · tickMatch:93 · fetchResult:94 · fetchViews:100 · EmoteMsg:109 · EmoteResult:110 · asEmoteResult:111 · sendEmote:113 · fetchEmotes:114 · RankedView:117 · RankingRow:119 · fetchRanked:120 · fetchRanking:121 · claimSeason:124

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

## server/edge.ts  (39 linhas)
Entrada da Edge Function (gerada em supabase/functions/game).

cors:10 · json:15

## server/handler.ts  (576 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:17 · defaultConfig:29 · MatchInit:31 · EMOTE_CODE:62 · EMOTE_GAP_MS:63 · EMOTE_MAX_PER_MATCH:64 · RankedView:67 · PLACEMENT:70 · REPEAT_LIMIT:71 · frameRank:72 · calendar:74 · rankedView:79 · ladderOf:92 · GameRequest:105 · GameResponse:118 · BOT_PROFILE:129 · STALE_MATCH_MS:130 · BOT_STEP_LIMIT:131 · AUTO_STEP_LIMIT:132 · recipeDeck:134 · botDeckFor:136 · playerOf:137 · userOfSeat:138 · moverOf:139 · moverKey:140 · Work:145 · startWork:154 · applyStep:157 · runBot:180 · patchOf:191 · pickRankedOpponent:200 · ensureRewards:218 · publicReward:259 · rewardOf:265 · enforceClock:270 · openMatch:308 · viewRowsOf:315 · initOf:317 · startMatch:344 · finishIfStale:370 · OPS:381 · badRequest:382 · withTotals:406 · cleanRar:412 · handleGame:424

## server/memoryDb.ts  (135 linhas)
Banco em memória (testes).

MemoryTables:6 · clone:11 · MemoryDb:13

## server/supabaseDb.ts  (159 linhas)
Banco no Supabase.

Client:8 · must:10 · viewToDb:15 · viewFromDb:18 · profileFromDb:19 · matchFromDb:20 · supabaseDb:22

## server/types.ts  (132 linhas)
Tipos do servidor e do banco.

DeckRar:8 · DeckJson:9 · QueueRow:11 · StepRow:21 · ViewRow:29 · EndReason:40 · RewardRow:42 · RankedOutcome:55 · MatchRow:62 · MatchPatch:83 · EmoteRow:86 · SeasonRow:89 · Db:91

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

## tests/online-server.ts  (606 linhas)
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
