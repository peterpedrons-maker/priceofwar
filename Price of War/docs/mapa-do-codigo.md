<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11306 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:268 · DRAW_FLIGHT_MS:294 · sfxVol:303 · playCardDrawSfx:304 · playCardPlaySfx:318 · playAttackSfx:325 · playEffectSfx:327 · playTacticSfx:328 · playSelectSfx:336 · bannerAudioCtx:348 · playBannerSfx:349 · playUiClickSfx:392 · playCardLiftSfx:401 · playDamageSfx:413 · playGeneralDamageSfx:418 · playDestroySfx:428 · playRevealGeneralSfx:430 · playWarHornSfx:436 · playBatalhaBannerSfx:441 · playBatalhaImpactSfx:449 · CardType:455 · CardData:457 · StatTone:505 · STAT_TONE_COLOR:506 · STAT_TONE_GRADIENT:507 · statsOf:512 · SlotHint:521 · getSlotHint:530 · RowRoleHint:536 · SOLDIER_CARD_TYPES:537 · getRowRoleHint:538 · ROW_ROLE_VIEW:545 · PHASE_BANNER_TEXT:569 · BATALHA_FALL_MS:591 · BATALHA_IMPACT_FRACTION:592 · BANNER_LEARN_COUNT:596 · bannersSeen:597 · PHASE_BANNER_STAGE_MS:598 · phaseBannerMs:599 · PHASE_BANNER_Y:607 · PHASE_BANNER_MOTION:608 · HIT_STOP_MS:619 · ATTACK_MS:622 · ATTACK_WINDUP_FRAC:623 · ATTACK_WINDUP_PX:624 · ATTACK_TILT_DEG:625 · IMPACT_MS:626 · TIME:629 · rangedKindOf:631 · FINAL_SLOW:632 · FINAL_INTRO_MS:633 · FINAL_FREEZE_MS:634 · FINAL_AFTER_MS:635 · SLASH_SPARK_ANGLES:638 · SlashEffect:647 · TargetKind:685 · TARGET_STYLE:686 · HUD_CARD_SCALE:692 · AmountBadge:696 · TargetingHud:713 · READY_COLORS:783 · SILHOUETTES:788 · silhouetteFor:793 · DEBUG_HOOKS:804 · TriggerIcon:806 · FLIGHT_MS:820 · HELD_SCALE:821 · HELD_GAP:822 · TriggerBurst:823 · TriggerFloatLayer:844 · AbilityReadyGlow:861 · TutRect:892 · tutPct:893 · tutSilBox:894 · tutElRect:903 · tutPad:904 · tutUnion:905 · TutResolved:910 · TUT_EMPTY:911 · visibleHandCards:912 · resolveTutTarget:913 · TutorialStage:960 · SpriteOnce:1004 · EffectIcon:1021 · EFFECT_ICONS:1022 · SpriteIcon:1030 · IconPop:1035 · SHIELD_SHEETS:1050 · GOLD_BUBBLE:1056 · ShieldAura:1057 · ShieldFxOnce:1077 · EquipFxLayer:1091 · PUNCH_FRAMES:1137 · PUNCH_FRAME_W:1138 · FlyingCardNovo:1142 · lastArrowKey:1172 · PunchFx:1173 · BURN_FRAMES:1209 · BurningCard:1211 · GraveyardPile:1267 · AtkBadge:1299 · NUMBER_KIND_OF:1311 · NUMBER_TIERS:1316 · damageTier:1322 · floatLife:1323 · FloatNumber:1324 · HpBadge:1372 · GoldBadge:1401 · GoldNumber:1430 · CardBack:1490 · CARD_THICKNESS_SHADOW:1528 · cardBoxShadow:1539 · cardGlowFilter:1540 · CARD_FACE_VARIANTS:1550 · NO_STAT_TYPES:1567 · templateForType:1568 · templateForTypeMini:1573 · FitText:1592 · KeywordPill:1667 · STAT_TOKEN:1681 · STAT_NUMBER_STYLE:1682 · StatSymbol:1683 · CoinIcon:1691 · GoldSymbol:1694 · DamageSymbol:1699 · RULE_WORD_STYLE:1711 · renderEffectText:1712 · FitEffectText:1752 · FULL_ART_PLATE_VARIANTS:1816 · FULL_ART_SIZE_FIX:1826 · CardFaceFullArt:1827 · FullArtMiniConfig:1949 · FULL_ART_MINI_CONFIG:1954 · usesLightBar:1982 · nameTextStyle:1983 · FULL_ART_MINI_DEFAULT:1986 · fullArtMiniConfigForType:1991 · CardFaceFullArtMini:2006 · CARD_FACE_MINI_STD_SCALE:2055 · CardFaceStandardMini:2056 · CardFace:2119 · BOARD_EXTERIOR_ART_URL:2232 · FIELD_PREVIEW_SCALE:2237 · BOARD_PREVIEW_SCALE:2255 · FAN_SPREAD_DEG:2258 · FAN_LIFT_PX:2259 · HAND_CARD_WIDTH:2260 · HAND_CARD_HEIGHT:2261 · HAND_CARD_STEP:2264 · HAND_FULL_SPREAD_COUNT:2267 · HAND_SELECT_SCALE:2270 · handStepFor:2271 · ART_BY_NAME:2278 · MERC_ART_FILES:2332 · artSlug:2333 · CAMPO_ART_FILES:2339 · CAPITAO_ART_FILES:2345 · cardDataFromName:2351 · buildDeckCards:2355 · DECK_CAPITAO:2363 · DECK_CARDEAL:2364 · DECK_MERCENARIOS:2365 · DECK_CAMPO:2366 · DECKS:2370 · ALL_DECK_IDS:2400 · BOOSTER_POOLS:2403 · DECK_STORE_KEY:2423 · CARD_INSTANCES_BY_NAME:2425 · cardByName:2433 · isGeneralName:2434 · DeckSlot:2436 · DeckStore:2437 · DeckSelection:2439 · OnlineMatch:2445 · needsServer:2477 · visibleKey:2489 · countByName:2494 · CAPITAO_STARTER_NAME:2500 · MERC_STARTER_NAME:2501 · CAMPO_STARTER_NAME:2502 · CLOUD_DECK_SLOTS:2504 · MAX_DECK_SLOTS:2505 · buildStarterStore:2508 · sameCards:2532 · ensureStarterDecks:2536 · lastSanitizeMigrated:2568 · sanitizeDeckStore:2569 · loadDeckStore:2598 · cloudUserId:2612 · pushTimer:2613 · pushing:2614 · pushAgain:2615 · toCloudDecks:2616 · runPush:2617 · saveDeckStore:2630 · stopCloudSync:2635 · flushCloudSync:2637 · syncDeckStoreWithCloud:2648 · deckCardCount:2676 · deckProblem:2678 · buildDeckSelection:2686 · deckIdOfGeneral:2694 · DEFAULT_DECK_SELECTION:2695 · PlayerProfile:2704 · AVATAR_OPTIONS:2720 · avatarById:2773 · PROFILE_STORAGE_KEY:2775 · DEFAULT_PROFILE:2776 · loadProfile:2789 · formatCoroas:2803 · saveProfile:2808 · MODE_LABELS_PT:2817 · AvatarBadge:2827 · PlayerPlate:2842 · WINDOW_FRAME_PX:2871 · WINDOW_FONT_DECO:2872 · FramedWindow:2874 · WindowOverlay:2879 · WindowDivider:2902 · WindowTitle:2910 · Edges:2918 · ArtFrame:2919 · VLine:2940 · HLine:2943 · ArtChip:2948 · WindowOption:2954 · WindowText:2958 · WindowButton:2962 · AvatarPickerModal:2968 · ALLOW_PROFILE_RENAME:3016 · ProfileBar:3017 · ComingSoonModal:3138 · ONLINE_MODES:3154 · OnlineModeModal:3158 · TapPhase:3190 · MENU_CONFIRM_MS:3191 · useMenuTap:3192 · PlaqueSparks:3216 · PLAQUE_ASPECT:3235 · PLAQUE_CAP_CQW:3236 · MenuCard:3237 · MenuIconButton:3286 · MainMenu:3317 · InstallPrompt:3452 · DeckPickerModal:3488 · CARD_TYPE_ORDER:3519 · DeckSide:3520 · EditorSort:3521 · EDITOR_SORTS:3522 · EDITOR_MARGIN:3523 · EDITOR_FRAME:3524 · EDITOR_PAD:3525 · LIST_COLS:3528 · ROW_H:3529 · FULL_ART_TILE_SCALE:3530 · DeckEditor:3532 · ShopPhase:4095 · NpcMood:4096 · BoosterDef:4097 · BOOSTERS:4099 · TEST_FREE_BOOSTERS:4108 · SHELF_ROWS:4109 · SHELF_COLS:4110 · BOOSTER_ASPECT:4111 · SHELF_X0:4116 · SHELF_X1:4117 · SHELF_PLANKS:4118 · SHELF_OVERVIEW:4119 · SHELF_CLOSEUP:4120 · NPC_LINES:4122 · SHOP_ART:4130 · rollBooster:4138 · BoosterArt:4153 · NpcArt:4165 · PACK_TEAR_Y:4172 · LID_SLICES:4173 · LidSlice:4179 · PackTear:4202 · PulledCard:4271 · pullBooster:4272 · PackOpening:4285 · OpenBoosterFromTable:4364 · ShopScreen:4370 · AuthBackdrop:4610 · GoogleMark:4631 · DiscordMark:4634 · AuthButton:4636 · authFieldClass:4642 · LoginScreen:4644 · NAME_RULE:4705 · ProfileSetupScreen:4707 · VolumeRow:4773 · ToggleRow:4782 · OptionsModal:4792 · SettingsModal:4826 · playCoinSfx:4863 · COIN_THICK:4891 · CoinFace:4892 · CoinRim:4901 · RemotePick:4920 · CoinToss:4921 · MatchSearchOverlay:5003 · OnlineSearchOverlay:5044 · LoadingScreen:5119 · App:5173 · IMMEDIATE_ZONE_LABEL:10760 · DragFinger:10765 · GuideInfo:10782 · DragGuide:10783 · arrivalDrops:10850 · arrivalListener:10852 · EmblemKind:10857 · EMBLEM_ART:10858 · SlotEmblem:10859 · RowPlaque:10872 · CardSlot:10884

Dentro de `App` (linhas 5173–10759), funções internas:
attackMarkFor:5416 · openCardPicker:5443 · spawnFloatingNumber:5479 · spawnFloatingNumberAtId:5494 · showBanner:5521 · announcePhase:5545 · announceTurnChange:5555 · beginFinalBlow:5588 · endFinalBlow:5589 · blowIsSoaked:5592 · handleInstallClick:5677 · shieldOverSlot:5733 · popOverSlot:5742 · burstAt:5757 · whenGlowDone:5782 · endGlow:5783 · startTriggerFx:5787 · holdForSeat:5815 · terrainFxPlayer:5843 · terrainFxNpc:5844 · fireImpactBurst:5860 · noteDragPlay:5883 · handFanMaxAngleRad:5953 · getHandArrivalPoint:6062 · getFanRotation:6082 · getFanLift:6089 · computeDrawOrigin:6104 · showToast:6119 · announceCardPlay:6125 · toCardData:6199 · shownStats:6214 · boardView:6225 · syncView:6230 · processEvents:6264 · armedSlotsOf:6474 · cardOverlayFx:6475 · fxRectOf:6591 · fxEnvFor:6597 · pickTacticSpot:6614 · tacticFxOf:6623 · planFx:6627 · commitState:6657 · dispatchAction:6680 · wakeWaiter:6699 · publishClock:6700 · dispatchOnline:6702 · reconcileOwn:6738 · applyUnasked:6752 · ingestRows:6766 · chooseFirstOnline:6794 · absorbAct:6807 · refuseOwn:6816 · sendOnline:6828 · stopOnline:6842 · startOnlinePolling:6859 · nextOpponentAction:6877 · applyRewardToProfile:6904 · openPlayerPick:6911 · playerAct:6938 · openModePrompt:6950 · maybePromptRelicMode:6957 · confirmRelicMode:6966 · confirmUpkeep:6978 · endTurnNow:6990 · sleep:7009 · tutCurrent:7021 · tutCanBack:7025 · tutShow:7030 · tutGo:7046 · tutNext:7054 · tutBack:7068 · tutMatches:7073 · tutSignal:7085 · tutFromAction:7090 · tutBeat:7097 · tutExit:7104 · tutFinish:7111 · startTutorial:7112 · tutLaunchDuel:7117 · tutCoinResolved:7119 · settleAmbush:7176 · startMatchIntro:7209 · continueMatchIntro:7228 · resetGame:7320 · startGame:7373 · startOnlineMatch:7380 · leaveMatch:7422 · handleCardClick:7777 · handlePlayCardButtonClick:7837 · abilityStepCandidates:7896 · abilityHasTargets:7899 · getPlayerCreatureAbilityKind:7921 · getCardVisualEl:7935 · triggerPunch:8020 · renderTravelingArrow:8070 · playPendingTactic:8097 · resolveOwnTacticTarget:8104 · resolveEnemyTacticTarget:8109 · toggleCardPickerSelection:8117 · abilityOf:8131 · nextAbilityStep:8133 · activateAbility:8139 · abilityStepSide:8153 · resolveAbilityTarget:8159 · pushAbilityPrompt:8196 · mine:8217 · foes:8218 · effectTargetKind:8221 · specSlots:8223 · tacticTargeting:8237 · sourceAt:8244 · cancelTargeting:8262 · playHandCardOnTarget:8265 · heldTop:8272 · slotUnder:8273 · clearDragOver:8282 · dragBlockReason:8284 · tapHandCard:8296 · beginPress:8304 · returnHeld:8321 · dropHeldCard:8330 · updateHeld:8359 · dropOk:8378 · handleSlotClick:8434 · handleNpcSlotClick:8614 · handleBackgroundClick:8680 · getTappedCardShift:8711 · getSelectedCardX:8721 · getSelectedCardY:8743 · getBoardAnimation:8767 · getPlayerSlotHint:8808 · isTacticTargetSlot:8827 · tacticTagFor:8835 · boardHeightMultiplier:8911 · boardTopMargin:8912

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/campoFx.ts  (336 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:9 · AURA:11 · Env:12 · cvs:15 · ctx:16 · fxs:17 · ensure:18 · resize:23 · R:24 · clamp:25 · eo:26 · lerp:27 · at:28 · add:29 · wait:30 · rc:33 · setU:34 · dirOf:35 · edgeY:36 · cols:37 · midY:38 · spawn:41 · glow:42 · drawP:43 · stepP:59 · flame:63 · ember:64 · fan:65 · ring:66 · dust:67 · glints:68 · Layer:72 · layers:73 · night:74 · animated:75 · tower:77 · armedOf:85 · Frame:90 · Sil:91 · SIL:92 · frameOf:93 · silOf:98 · ringOf:106 · edgeOf:115 · drawRing:119 · holderOf:120 · auraSlots:121 · layerTick:123 · layerDraw:146 · nightTick:156 · nightDraw:160 · inFrame:168 · overlayOpen:170 · busy:175 · frame:176 · step:181 · kick:197 · clearAll:198 · clearCampoLayers:199 · syncCampoLayers:203 · clang:225 · prep:226 · fxForjaPlaced:229 · equipTransfer:237 · fxForjaEquip:249 · fxFogoEquip:250 · fxArsenalEquip:251 · fxForjaModo:253 · fxFogoPlaced:260 · fxFogoTrincheira:270 · fxFogoSaque:279 · fxNoitePlay:289 · fxNoiteTrail:290 · branch:299 · fxMata:306 · WEAPONS:315 · weaponPath:316 · fxArsenalPlaced:324

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/cardFx.ts  (290 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CardRect:7 · Part:8 · cv:11 · parts:12 · ensure:13 · kick:19 · frame:20 · R:28 · clamp:29 · add:30 · run:32 · emit:39 · stepParts:40 · drawParts:43 · softGlow:53 · rr:54 · RINGS:57 · frameImgOf:58 · SOLID:60 · solidOf:61 · silRing:71 · drawSil:80 · hintEl:84 · fxHintFrame:86 · ctr:87 · fxLand:91 · fxImpact:117 · BN:145 · BURN:146 · noise:147 · nz:150 · F:152 · maskUrl:153 · burnMaskSheet:155 · mkLayer:162 · fxBurn:164 · fxLunge:205 · fxDrop:236 · ArrowSpec:254 · arrows:255 · exitT:256 · drawArrow:257 · fxArrows:283

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

## src/gameSettings.ts  (29 linhas)
Opções do jogador (avisos de arrastar/tabuleiro), hook useGameSettings.

GameSettings:5 · KEY:11 · DEFAULTS:12 · load:13 · state:19 · listeners:20 · getGameSettings:21 · subscribeSettings:22 · setGameSettings:23 · useGameSettings:28

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

## tests/balance-todos-report.ts  (32 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

g:3 · IDS:4 · avg:5 · row:6 · per:7 · dur:15 · types:25 · modes:29

## tests/balance-todos.ts  (64 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

IDS:13 · Per:14 · Rec:15 · bump:16 · unitsOf:17 · playGame:19 · main:48

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
