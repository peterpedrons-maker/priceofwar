<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11230 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:266 · DRAW_FLIGHT_MS:292 · sfxVol:301 · playCardDrawSfx:302 · playCardPlaySfx:316 · playAttackSfx:323 · playEffectSfx:325 · playTacticSfx:326 · playSelectSfx:334 · bannerAudioCtx:346 · playBannerSfx:347 · playUiClickSfx:390 · playCardLiftSfx:399 · playDamageSfx:411 · playGeneralDamageSfx:416 · playDestroySfx:426 · playRevealGeneralSfx:428 · playWarHornSfx:434 · playBatalhaBannerSfx:439 · playBatalhaImpactSfx:447 · CardType:453 · CardData:455 · StatTone:503 · STAT_TONE_COLOR:504 · STAT_TONE_GRADIENT:505 · statsOf:510 · SlotHint:519 · getSlotHint:528 · RowRoleHint:534 · SOLDIER_CARD_TYPES:535 · getRowRoleHint:536 · ROW_ROLE_VIEW:543 · PHASE_BANNER_TEXT:567 · BATALHA_FALL_MS:589 · BATALHA_IMPACT_FRACTION:590 · BANNER_LEARN_COUNT:594 · bannersSeen:595 · PHASE_BANNER_STAGE_MS:596 · phaseBannerMs:597 · PHASE_BANNER_Y:605 · PHASE_BANNER_MOTION:606 · HIT_STOP_MS:617 · ATTACK_MS:620 · ATTACK_WINDUP_FRAC:621 · ATTACK_WINDUP_PX:622 · ATTACK_TILT_DEG:623 · IMPACT_MS:624 · TIME:627 · rangedKindOf:629 · FINAL_SLOW:630 · FINAL_INTRO_MS:631 · FINAL_FREEZE_MS:632 · FINAL_AFTER_MS:633 · SLASH_SPARK_ANGLES:636 · SlashEffect:645 · TargetKind:683 · TARGET_STYLE:684 · HUD_CARD_SCALE:690 · AmountBadge:694 · TargetingHud:711 · READY_COLORS:781 · SILHOUETTES:786 · silhouetteFor:791 · DEBUG_HOOKS:802 · TriggerIcon:804 · FLIGHT_MS:818 · HELD_SCALE:819 · HELD_GAP:820 · TriggerBurst:821 · TriggerFloatLayer:842 · AbilityReadyGlow:859 · TutRect:890 · tutPct:891 · tutSilBox:892 · tutElRect:901 · tutPad:902 · tutUnion:903 · TutResolved:908 · TUT_EMPTY:909 · visibleHandCards:910 · resolveTutTarget:911 · TutorialStage:958 · SpriteOnce:1002 · EffectIcon:1019 · EFFECT_ICONS:1020 · SpriteIcon:1028 · IconPop:1033 · SHIELD_SHEETS:1048 · GOLD_BUBBLE:1054 · ShieldAura:1055 · ShieldFxOnce:1075 · EquipFxLayer:1089 · PUNCH_FRAMES:1135 · PUNCH_FRAME_W:1136 · PunchFx:1138 · BURN_FRAMES:1174 · BurningCard:1176 · GraveyardPile:1226 · AtkBadge:1258 · NUMBER_KIND_OF:1270 · NUMBER_TIERS:1275 · damageTier:1281 · floatLife:1282 · FloatNumber:1283 · HpBadge:1331 · GoldBadge:1360 · GoldNumber:1389 · CardBack:1449 · CARD_THICKNESS_SHADOW:1487 · cardBoxShadow:1498 · cardGlowFilter:1499 · CARD_FACE_VARIANTS:1509 · NO_STAT_TYPES:1526 · templateForType:1527 · templateForTypeMini:1532 · FitText:1551 · KeywordPill:1626 · STAT_TOKEN:1640 · STAT_NUMBER_STYLE:1641 · StatSymbol:1642 · CoinIcon:1650 · GoldSymbol:1653 · DamageSymbol:1658 · RULE_WORD_STYLE:1670 · renderEffectText:1671 · FitEffectText:1711 · FULL_ART_PLATE_VARIANTS:1775 · FULL_ART_SIZE_FIX:1785 · CardFaceFullArt:1786 · FullArtMiniConfig:1908 · FULL_ART_MINI_CONFIG:1913 · usesLightBar:1941 · nameTextStyle:1942 · FULL_ART_MINI_DEFAULT:1945 · fullArtMiniConfigForType:1950 · CardFaceFullArtMini:1965 · CARD_FACE_MINI_STD_SCALE:2014 · CardFaceStandardMini:2015 · CardFace:2078 · BOARD_EXTERIOR_ART_URL:2191 · FIELD_PREVIEW_SCALE:2196 · BOARD_PREVIEW_SCALE:2214 · FAN_SPREAD_DEG:2217 · FAN_LIFT_PX:2218 · HAND_CARD_WIDTH:2219 · HAND_CARD_HEIGHT:2220 · HAND_CARD_STEP:2223 · HAND_FULL_SPREAD_COUNT:2226 · HAND_SELECT_SCALE:2229 · handStepFor:2230 · ART_BY_NAME:2237 · MERC_ART_FILES:2291 · artSlug:2292 · CAMPO_ART_FILES:2298 · CAPITAO_ART_FILES:2304 · cardDataFromName:2310 · buildDeckCards:2314 · DECK_CAPITAO:2322 · DECK_CARDEAL:2323 · DECK_MERCENARIOS:2324 · DECK_CAMPO:2325 · DECKS:2329 · ALL_DECK_IDS:2359 · BOOSTER_POOLS:2362 · DECK_STORE_KEY:2382 · CARD_INSTANCES_BY_NAME:2384 · cardByName:2392 · isGeneralName:2393 · DeckSlot:2395 · DeckStore:2396 · DeckSelection:2398 · OnlineMatch:2404 · needsServer:2436 · visibleKey:2448 · countByName:2453 · CAPITAO_STARTER_NAME:2459 · MERC_STARTER_NAME:2460 · CAMPO_STARTER_NAME:2461 · CLOUD_DECK_SLOTS:2463 · MAX_DECK_SLOTS:2464 · buildStarterStore:2467 · sameCards:2491 · ensureStarterDecks:2495 · lastSanitizeMigrated:2527 · sanitizeDeckStore:2528 · loadDeckStore:2557 · cloudUserId:2571 · pushTimer:2572 · pushing:2573 · pushAgain:2574 · toCloudDecks:2575 · runPush:2576 · saveDeckStore:2589 · stopCloudSync:2594 · flushCloudSync:2596 · syncDeckStoreWithCloud:2607 · deckCardCount:2635 · deckProblem:2637 · buildDeckSelection:2645 · deckIdOfGeneral:2653 · DEFAULT_DECK_SELECTION:2654 · PlayerProfile:2663 · AVATAR_OPTIONS:2679 · avatarById:2732 · PROFILE_STORAGE_KEY:2734 · DEFAULT_PROFILE:2735 · loadProfile:2748 · formatCoroas:2762 · saveProfile:2767 · MODE_LABELS_PT:2776 · AvatarBadge:2786 · PlayerPlate:2801 · WINDOW_FRAME_PX:2830 · WINDOW_FONT_DECO:2831 · FramedWindow:2833 · WindowOverlay:2838 · WindowDivider:2861 · WindowTitle:2869 · Edges:2877 · ArtFrame:2878 · VLine:2899 · HLine:2902 · ArtChip:2907 · WindowOption:2913 · WindowText:2917 · WindowButton:2921 · AvatarPickerModal:2927 · ALLOW_PROFILE_RENAME:2975 · ProfileBar:2976 · ComingSoonModal:3097 · ONLINE_MODES:3113 · OnlineModeModal:3117 · TapPhase:3149 · MENU_CONFIRM_MS:3150 · useMenuTap:3151 · PlaqueSparks:3175 · PLAQUE_ASPECT:3194 · PLAQUE_CAP_CQW:3195 · MenuCard:3196 · MenuIconButton:3245 · MainMenu:3276 · InstallPrompt:3411 · DeckPickerModal:3447 · CARD_TYPE_ORDER:3478 · DeckSide:3479 · EditorSort:3480 · EDITOR_SORTS:3481 · EDITOR_MARGIN:3482 · EDITOR_FRAME:3483 · EDITOR_PAD:3484 · LIST_COLS:3487 · ROW_H:3488 · FULL_ART_TILE_SCALE:3489 · DeckEditor:3491 · ShopPhase:4054 · NpcMood:4055 · BoosterDef:4056 · BOOSTERS:4058 · TEST_FREE_BOOSTERS:4067 · SHELF_ROWS:4068 · SHELF_COLS:4069 · BOOSTER_ASPECT:4070 · SHELF_X0:4075 · SHELF_X1:4076 · SHELF_PLANKS:4077 · SHELF_OVERVIEW:4078 · SHELF_CLOSEUP:4079 · NPC_LINES:4081 · SHOP_ART:4089 · rollBooster:4097 · BoosterArt:4112 · NpcArt:4124 · PACK_TEAR_Y:4131 · LID_SLICES:4132 · LidSlice:4138 · PackTear:4161 · PulledCard:4230 · pullBooster:4231 · PackOpening:4244 · OpenBoosterFromTable:4323 · ShopScreen:4329 · AuthBackdrop:4569 · GoogleMark:4590 · DiscordMark:4593 · AuthButton:4595 · authFieldClass:4601 · LoginScreen:4603 · NAME_RULE:4664 · ProfileSetupScreen:4666 · VolumeRow:4732 · ToggleRow:4741 · OptionsModal:4751 · SettingsModal:4784 · playCoinSfx:4821 · COIN_THICK:4849 · CoinFace:4850 · CoinRim:4859 · RemotePick:4878 · CoinToss:4879 · MatchSearchOverlay:4961 · OnlineSearchOverlay:5002 · LoadingScreen:5077 · App:5131 · IMMEDIATE_ZONE_LABEL:10692 · DragFinger:10697 · GuideInfo:10714 · DragGuide:10715 · arrivalDrops:10782 · arrivalListener:10784 · EmblemKind:10789 · EMBLEM_ART:10790 · SlotEmblem:10791 · RowPlaque:10804 · CardSlot:10816

Dentro de `App` (linhas 5131–10691), funções internas:
attackMarkFor:5374 · openCardPicker:5401 · spawnFloatingNumber:5437 · spawnFloatingNumberAtId:5452 · showBanner:5479 · announcePhase:5503 · announceTurnChange:5513 · beginFinalBlow:5546 · endFinalBlow:5547 · blowIsSoaked:5550 · handleInstallClick:5634 · shieldOverSlot:5690 · popOverSlot:5699 · burstAt:5714 · whenGlowDone:5739 · endGlow:5740 · startTriggerFx:5744 · holdForSeat:5772 · terrainFxPlayer:5800 · terrainFxNpc:5801 · fireImpactBurst:5817 · noteDragPlay:5840 · handFanMaxAngleRad:5910 · getHandArrivalPoint:6018 · getFanRotation:6038 · getFanLift:6045 · computeDrawOrigin:6060 · showToast:6075 · announceCardPlay:6081 · toCardData:6155 · shownStats:6170 · boardView:6181 · syncView:6186 · processEvents:6220 · armedSlotsOf:6430 · cardOverlayFx:6431 · fxRectOf:6544 · fxEnvFor:6550 · pickTacticSpot:6567 · tacticFxOf:6576 · planFx:6580 · commitState:6610 · dispatchAction:6633 · wakeWaiter:6652 · publishClock:6653 · dispatchOnline:6655 · reconcileOwn:6691 · applyUnasked:6705 · ingestRows:6719 · chooseFirstOnline:6747 · absorbAct:6760 · refuseOwn:6769 · sendOnline:6781 · stopOnline:6795 · startOnlinePolling:6812 · nextOpponentAction:6830 · applyRewardToProfile:6857 · openPlayerPick:6864 · playerAct:6891 · openModePrompt:6903 · maybePromptRelicMode:6910 · confirmRelicMode:6919 · confirmUpkeep:6931 · endTurnNow:6943 · sleep:6962 · tutCurrent:6974 · tutCanBack:6978 · tutShow:6983 · tutGo:6999 · tutNext:7007 · tutBack:7021 · tutMatches:7026 · tutSignal:7038 · tutFromAction:7043 · tutBeat:7050 · tutExit:7057 · tutFinish:7064 · startTutorial:7065 · tutLaunchDuel:7070 · tutCoinResolved:7072 · settleAmbush:7129 · startMatchIntro:7162 · continueMatchIntro:7181 · resetGame:7273 · startGame:7326 · startOnlineMatch:7333 · leaveMatch:7375 · handleCardClick:7730 · handlePlayCardButtonClick:7790 · abilityStepCandidates:7849 · abilityHasTargets:7852 · getPlayerCreatureAbilityKind:7874 · getCardVisualEl:7888 · triggerPunch:7973 · renderTravelingArrow:8011 · playPendingTactic:8038 · resolveOwnTacticTarget:8045 · resolveEnemyTacticTarget:8050 · toggleCardPickerSelection:8058 · abilityOf:8072 · nextAbilityStep:8074 · activateAbility:8080 · abilityStepSide:8094 · resolveAbilityTarget:8100 · pushAbilityPrompt:8137 · mine:8158 · foes:8159 · effectTargetKind:8162 · specSlots:8164 · tacticTargeting:8178 · sourceAt:8185 · cancelTargeting:8203 · playHandCardOnTarget:8206 · heldTop:8213 · slotUnder:8214 · clearDragOver:8223 · dragBlockReason:8225 · tapHandCard:8237 · beginPress:8245 · returnHeld:8262 · dropHeldCard:8271 · updateHeld:8300 · dropOk:8319 · handleSlotClick:8375 · handleNpcSlotClick:8555 · handleBackgroundClick:8621 · getTappedCardShift:8652 · getSelectedCardX:8662 · getSelectedCardY:8684 · getBoardAnimation:8708 · getPlayerSlotHint:8749 · isTacticTargetSlot:8768 · tacticTagFor:8776 · shakePx:8839 · boardHeightMultiplier:8852 · boardTopMargin:8853

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/campoFx.ts  (276 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:9 · Env:10 · cvs:13 · ctx:14 · fxs:15 · ensure:16 · resize:21 · R:22 · clamp:23 · eo:24 · lerp:25 · at:26 · add:27 · wait:28 · rc:31 · setU:32 · dirOf:33 · edgeY:34 · cols:35 · midY:36 · spawn:39 · glow:40 · drawP:41 · stepP:57 · flame:61 · ember:62 · fan:63 · ring:64 · dust:65 · glints:66 · Layer:70 · layers:71 · night:72 · animated:73 · tower:75 · armedOf:83 · layerTick:85 · layerDraw:100 · nightTick:120 · nightDraw:124 · inFrame:132 · busy:133 · frame:134 · step:138 · kick:153 · clearAll:154 · clearCampoLayers:155 · syncCampoLayers:159 · clang:181 · prep:182 · fxForjaPlaced:185 · fxForjaModo:193 · fxFogoPlaced:200 · fxFogoTrincheira:210 · fxFogoSaque:219 · fxNoitePlay:229 · fxNoiteTrail:230 · branch:239 · fxMata:246 · WEAPONS:255 · weaponPath:256 · fxArsenalPlaced:264

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/CardViewer3D.tsx  (175 linhas)
Visualizador 3D de carta (three.js, carregado sob demanda); também a página ?3d.

Viewer3DCard:8 · EMBED:11 · FILES:12 · urlOf:13 · W:16 · roundedShape:18 · BACK_SX:27 · backGeometry:28 · CardViewer3D:32

## src/CollectionRoom.tsx  (499 linhas)
Sala de Coleção: o quarto em imagem única com objetos tocáveis (livro, porta, estante de boosters, mesa/deck), câmera com zoom e o fichário (Binder).

CardViewer3D:12 · THUMBS:13 · thumbOf:14 · SW:16 · PER:17 · BOOK_W:18 · clamp:19 · wait:20 · GOLD:21 · SPOTS:24 · SpotKey:30 · Plaque:33 · BookTitle:48 · SHELF_ROWS:60 · shelfSlot:61 · Entry:66 · RoomPack:68 · CollectionRoom:69 · NS:226 · SS:227 · BEND:228 · Rect:229 · Phase:230 · Binder:232 · PACK_ASPECT:488 · SheenDriver:491

## src/combatFx.ts  (1040 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

FxSide:48 · FxRect:49 · FxTarget:50 · FxEnv:52 · cv:66 · ctx:67 · RES:68 · fxs:69 · IMG:70 · SRC:71 · readyP:72 · preloadCombatFx:73 · resize:77 · ensureCanvas:78 · R:87 · clamp:88 · eo:89 · at:90 · add:91 · wait:92 · tick:94 · loop:105 · kick:109 · URLS:112 · play:113 · whoosh:114 · pick:117 · FS:124 · sprite:125 · explosion:132 · holy:140 · flash:143 · shock:147 · scorch:154 · puff:158 · dust:164 · debris:167 · sparks:176 · softAngle:183 · fly:194 · arcTangent:233 · stick:234 · ring:240 · burst:243 · sparksDir:248 · glint:255 · cleanHit:262 · lanceFade:266 · thunk:267 · rockBreak:273 · sheetXY:287 · playSheet:293 · ding:295 · coinAt:296 · coinFly:302 · coinBurst:311 · stonesFall:320 · drawBack:331 · flyBack:337 · setScale:342 · pt:343 · tacPoint:344 · landingImpact:348 · fxLanding:379 · landTactic:386 · leaveTactic:398 · weaponReveal:401 · once:428 · fxTactic:432 · fxHero:544 · fxRanged:577 · start:649 · toU:650 · fxUpkeep:654 · fxGoldGain:683 · fxRelicSoldo:696 · fxLoot:711 · fxPlaced:723 · fxReformar:750 · fxAmbush:762 · HOLY_SRC:796 · holyP:797 · loadHoly:798 · preloadHolyFx:799 · startHoly:800 · tween:801 · GOLDC:802 · twNow:805 · twMove:809 · twBurst:814 · charge:817 · risers:820 · groundGlow:823 · whiteFlash:827 · dimAt:831 · glowEl:838 · liftEl:841 · pilar:845 · sigilo:850 · cruzAt:854 · trompaAt:855 · almaAt:856 · heartAt:860 · godrays:863 · asasAt:870 · solAt:874 · portalAt:877 · orb:881 · cometaFly:889 · fxBencao:900 · fxCalice:927 · fxHospitalario:938 · fxNobre:964 · fxReforco:978 · fxComandante:991 · fxRetorno:1005 · fxAtirador:1030

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

## src/engine/game.ts  (1104 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:165 · setWinner:182 · soak:191 · grantShield:203 · grantBlock:209 · damageSlot:217 · healSlot:233 · startTurn:243 · enterPreparation:301 · payUpkeep:308 · setRelicMode:341 · runTurnEnd:355 · endTurn:375 · assertCanAct:385 · Fx:396 · uniqueByName:403 · matchesFilter:404 · filterLabel:411 · specCandidates:414 · checkTarget:418 · activeTargets:436 · validateTargets:440 · checkVerb:447 · checkVerbTarget:461 · openPick:465 · runVerb:474 · runAbilities:633 · grantMovedBuff:639 · playCard:649 · useAbility:713 · choose:753 · attack:809 · respondAmbush:835 · resolveAmbushEffect:852 · resolveCombat:888 · move:967 · advance:1000 · discardExcess:1022 · clone:1039 · applyAction:1041 · MatchLog:1083 · newMatchLog:1090 · replayMatch:1093

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

## src/engine/types.ts  (378 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:44 · Verb:48 · AbilityOn:87 · Ability:102 · Who:112 · Passive:124 · RelicMode:138 · CardDef:150 · Card:178 · SLOT_COUNT:209 · GENERAL_SLOT:210 · RELIC_SLOT:211 · TERRAIN_SLOT:212 · PlayerState:214 · TurnState:235 · PickMode:253 · Pending:256 · GameState:298 · Action:311 · GameEvent:338 · ActionResult:375

## src/engine/view.ts  (66 linhas)
O que cada jogador pode ver (esconde mão e baralho do outro).

hiddenCard:6 · redactPlayer:8 · redactFor:16 · redactEvents:30 · mirrorSeats:42 · mirrorEvents:58 · viewFor:64 · eventsFor:65

## src/gameSettings.ts  (28 linhas)
Opções do jogador (avisos de arrastar/tabuleiro), hook useGameSettings.

GameSettings:5 · KEY:10 · DEFAULTS:11 · load:12 · state:18 · listeners:19 · getGameSettings:20 · subscribeSettings:21 · setGameSettings:22 · useGameSettings:27

## src/main.tsx  (31 linhas)
Ponto de entrada do React.

CardViewer3D:10 · Viewer3DPage:11 · only3d:16

## src/numberGlyphs.ts  (16 linhas)
Imagens dos números (ATK/HP/dano) usadas nas cartas.

NumberKind:3 · files:5 · NAME:6 · glyphUrl:8 · burstUrl:9 · NUMBER_GLOW:12

## src/RankedScreens.tsx  (373 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LeagueKey:44 · EMBLEM:45 · RING:46 · LeagueRing:48 · LEAGUE_COLOR:53 · RANGES:54 · keyOfPoints:55 · labelOfPoints:56 · DECO:58 · CINZEL:59 · SERIF:60 · Win:63 · KitButton:79 · Row:83 · Divisions:91 · PointsBar:98 · Emblem:115 · LigasScreen:118 · daysLeftText:168 · nameOfLeague:169 · RewardsScreen:170 · RankingScreen:209 · RankedResult:254 · PromoBurst:282 · PromotionOverlay:296 · ConfirmDialog:323 · Chip:340 · MatchResult:345

## src/services/auth.ts  (130 linhas)
Login (convidado, Google, Discord, e-mail) via Supabase.

AuthProvider:9 · Session:10 · OAuthProvider:11 · URL:13 · KEY:14 · authMode:15 · LOCAL_SESSION_KEY:17 · clientPromise:19 · client:20 · getClient:29 · fromUser:31 · readLocal:36 · writeLocal:39 · localListeners:42 · emitLocal:43 · remoteListeners:46 · announceRemote:47 · getSession:49 · onSessionChange:56 · authErrorText:70 · signInOAuth:83 · signInEmail:90 · signInGuest:105 · authErrorDetail:120 · signOut:126

## src/services/cloud.ts  (95 linhas)
Salvar/ler coleção e decks na nuvem.

CloudProfile:5 · CloudResult:6 · COLUMNS:8 · fail:10 · fetchProfile:22 · usernameAvailable:30 · createProfile:38 · updateProfileFields:46 · CloudDeck:55 · CloudStore:56 · fetchStore:58 · pushStore:75

## src/services/online.ts  (124 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:33 · QueueResult:55 · ActResult:60 · call:65 · asActResult:82 · queueForMatch:87 · queueStatus:88 · cancelQueue:89 · sendAction:90 · tickMatch:92 · fetchResult:93 · fetchViews:99 · EmoteMsg:108 · EmoteResult:109 · asEmoteResult:110 · sendEmote:112 · fetchEmotes:113 · RankedView:116 · RankingRow:118 · fetchRanked:119 · fetchRanking:120 · claimSeason:123

## src/sfx.ts  (89 linhas)
Efeitos sonoros curtos por Web Audio.

ctx:6 · buffers:7 · loading:8 · debugOn:10 · dbgMark:12 · getCtx:14 · preloadSfx:17 · playSfx:25 · playSfxAt:44 · playWhoosh:60 · playDing:77

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

## server/handler.ts  (553 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:17 · defaultConfig:29 · MatchInit:31 · EMOTE_CODE:60 · EMOTE_GAP_MS:61 · EMOTE_MAX_PER_MATCH:62 · RankedView:65 · PLACEMENT:68 · REPEAT_LIMIT:69 · frameRank:70 · calendar:72 · rankedView:77 · ladderOf:90 · GameRequest:103 · GameResponse:116 · BOT_PROFILE:127 · STALE_MATCH_MS:128 · BOT_STEP_LIMIT:129 · AUTO_STEP_LIMIT:130 · recipeDeck:132 · botDeckFor:134 · playerOf:135 · userOfSeat:136 · moverOf:137 · moverKey:138 · Work:143 · startWork:152 · applyStep:155 · runBot:178 · patchOf:189 · pickRankedOpponent:198 · ensureRewards:216 · publicReward:257 · rewardOf:263 · enforceClock:268 · openMatch:306 · viewRowsOf:313 · initOf:315 · startMatch:342 · finishIfStale:368 · OPS:379 · badRequest:380 · handleGame:402

## server/memoryDb.ts  (135 linhas)
Banco em memória (testes).

MemoryTables:6 · clone:11 · MemoryDb:13

## server/supabaseDb.ts  (159 linhas)
Banco no Supabase.

Client:8 · must:10 · viewToDb:15 · viewFromDb:18 · profileFromDb:19 · matchFromDb:20 · supabaseDb:22

## server/types.ts  (130 linhas)
Tipos do servidor e do banco.

DeckJson:7 · QueueRow:9 · StepRow:19 · ViewRow:27 · EndReason:38 · RewardRow:40 · RankedOutcome:53 · MatchRow:60 · MatchPatch:81 · EmoteRow:84 · SeasonRow:87 · Db:89

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

## tests/campo-rules.ts  (154 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

passed:11 · test:12 · eq:13 · ok:14 · n:16 · mk:17 · A:18 · campoSetup:19 · fresh:20 · put:26 · give:27 · act:28 · arm:29

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

## tests/online-server.ts  (594 linhas)
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
