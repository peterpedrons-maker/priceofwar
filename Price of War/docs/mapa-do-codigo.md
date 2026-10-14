<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11288 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:268 · DRAW_FLIGHT_MS:294 · sfxVol:303 · playCardDrawSfx:304 · playCardPlaySfx:318 · playAttackSfx:325 · playEffectSfx:327 · playTacticSfx:328 · playSelectSfx:336 · bannerAudioCtx:348 · playBannerSfx:349 · playUiClickSfx:392 · playCardLiftSfx:401 · playDamageSfx:413 · playGeneralDamageSfx:418 · playDestroySfx:428 · playRevealGeneralSfx:430 · playWarHornSfx:436 · playBatalhaBannerSfx:441 · playBatalhaImpactSfx:449 · CardType:455 · CardData:457 · StatTone:505 · STAT_TONE_COLOR:506 · STAT_TONE_GRADIENT:507 · statsOf:512 · SlotHint:521 · getSlotHint:530 · RowRoleHint:536 · SOLDIER_CARD_TYPES:537 · getRowRoleHint:538 · ROW_ROLE_VIEW:545 · PHASE_BANNER_TEXT:569 · BATALHA_FALL_MS:591 · BATALHA_IMPACT_FRACTION:592 · BANNER_LEARN_COUNT:596 · bannersSeen:597 · PHASE_BANNER_STAGE_MS:598 · phaseBannerMs:599 · PHASE_BANNER_Y:607 · PHASE_BANNER_MOTION:608 · HIT_STOP_MS:619 · ATTACK_MS:622 · ATTACK_WINDUP_FRAC:623 · ATTACK_WINDUP_PX:624 · ATTACK_TILT_DEG:625 · IMPACT_MS:626 · TIME:629 · rangedKindOf:631 · FINAL_SLOW:632 · FINAL_INTRO_MS:633 · FINAL_FREEZE_MS:634 · FINAL_AFTER_MS:635 · SLASH_SPARK_ANGLES:638 · SlashEffect:647 · TargetKind:685 · TARGET_STYLE:686 · HUD_CARD_SCALE:692 · AmountBadge:696 · TargetingHud:713 · READY_COLORS:783 · SILHOUETTES:788 · silhouetteFor:793 · DEBUG_HOOKS:804 · TriggerIcon:806 · FLIGHT_MS:820 · HELD_SCALE:821 · HELD_GAP:822 · TriggerBurst:823 · TriggerFloatLayer:844 · AbilityReadyGlow:861 · TutRect:892 · tutPct:893 · tutSilBox:894 · tutElRect:903 · tutPad:904 · tutUnion:905 · TutResolved:910 · TUT_EMPTY:911 · visibleHandCards:912 · resolveTutTarget:913 · TutorialStage:960 · SpriteOnce:1004 · EffectIcon:1021 · EFFECT_ICONS:1022 · SpriteIcon:1030 · IconPop:1035 · SHIELD_SHEETS:1050 · GOLD_BUBBLE:1056 · ShieldAura:1057 · ShieldFxOnce:1077 · EquipFxLayer:1091 · PUNCH_FRAMES:1137 · PUNCH_FRAME_W:1138 · FlyingCardNovo:1142 · PunchFx:1168 · BURN_FRAMES:1204 · BurningCard:1206 · GraveyardPile:1262 · AtkBadge:1294 · NUMBER_KIND_OF:1306 · NUMBER_TIERS:1311 · damageTier:1317 · floatLife:1318 · FloatNumber:1319 · HpBadge:1367 · GoldBadge:1396 · GoldNumber:1425 · CardBack:1485 · CARD_THICKNESS_SHADOW:1523 · cardBoxShadow:1534 · cardGlowFilter:1535 · CARD_FACE_VARIANTS:1545 · NO_STAT_TYPES:1562 · templateForType:1563 · templateForTypeMini:1568 · FitText:1587 · KeywordPill:1662 · STAT_TOKEN:1676 · STAT_NUMBER_STYLE:1677 · StatSymbol:1678 · CoinIcon:1686 · GoldSymbol:1689 · DamageSymbol:1694 · RULE_WORD_STYLE:1706 · renderEffectText:1707 · FitEffectText:1747 · FULL_ART_PLATE_VARIANTS:1811 · FULL_ART_SIZE_FIX:1821 · CardFaceFullArt:1822 · FullArtMiniConfig:1944 · FULL_ART_MINI_CONFIG:1949 · usesLightBar:1977 · nameTextStyle:1978 · FULL_ART_MINI_DEFAULT:1981 · fullArtMiniConfigForType:1986 · CardFaceFullArtMini:2001 · CARD_FACE_MINI_STD_SCALE:2050 · CardFaceStandardMini:2051 · CardFace:2114 · BOARD_EXTERIOR_ART_URL:2227 · FIELD_PREVIEW_SCALE:2232 · BOARD_PREVIEW_SCALE:2250 · FAN_SPREAD_DEG:2253 · FAN_LIFT_PX:2254 · HAND_CARD_WIDTH:2255 · HAND_CARD_HEIGHT:2256 · HAND_CARD_STEP:2259 · HAND_FULL_SPREAD_COUNT:2262 · HAND_SELECT_SCALE:2265 · handStepFor:2266 · ART_BY_NAME:2273 · MERC_ART_FILES:2327 · artSlug:2328 · CAMPO_ART_FILES:2334 · CAPITAO_ART_FILES:2340 · cardDataFromName:2346 · buildDeckCards:2350 · DECK_CAPITAO:2358 · DECK_CARDEAL:2359 · DECK_MERCENARIOS:2360 · DECK_CAMPO:2361 · DECKS:2365 · ALL_DECK_IDS:2395 · BOOSTER_POOLS:2398 · DECK_STORE_KEY:2418 · CARD_INSTANCES_BY_NAME:2420 · cardByName:2428 · isGeneralName:2429 · DeckSlot:2431 · DeckStore:2432 · DeckSelection:2434 · OnlineMatch:2440 · needsServer:2472 · visibleKey:2484 · countByName:2489 · CAPITAO_STARTER_NAME:2495 · MERC_STARTER_NAME:2496 · CAMPO_STARTER_NAME:2497 · CLOUD_DECK_SLOTS:2499 · MAX_DECK_SLOTS:2500 · buildStarterStore:2503 · sameCards:2527 · ensureStarterDecks:2531 · lastSanitizeMigrated:2563 · sanitizeDeckStore:2564 · loadDeckStore:2593 · cloudUserId:2607 · pushTimer:2608 · pushing:2609 · pushAgain:2610 · toCloudDecks:2611 · runPush:2612 · saveDeckStore:2625 · stopCloudSync:2630 · flushCloudSync:2632 · syncDeckStoreWithCloud:2643 · deckCardCount:2671 · deckProblem:2673 · buildDeckSelection:2681 · deckIdOfGeneral:2689 · DEFAULT_DECK_SELECTION:2690 · PlayerProfile:2699 · AVATAR_OPTIONS:2715 · avatarById:2768 · PROFILE_STORAGE_KEY:2770 · DEFAULT_PROFILE:2771 · loadProfile:2784 · formatCoroas:2798 · saveProfile:2803 · MODE_LABELS_PT:2812 · AvatarBadge:2822 · PlayerPlate:2837 · WINDOW_FRAME_PX:2866 · WINDOW_FONT_DECO:2867 · FramedWindow:2869 · WindowOverlay:2874 · WindowDivider:2897 · WindowTitle:2905 · Edges:2913 · ArtFrame:2914 · VLine:2935 · HLine:2938 · ArtChip:2943 · WindowOption:2949 · WindowText:2953 · WindowButton:2957 · AvatarPickerModal:2963 · ALLOW_PROFILE_RENAME:3011 · ProfileBar:3012 · ComingSoonModal:3133 · ONLINE_MODES:3149 · OnlineModeModal:3153 · TapPhase:3185 · MENU_CONFIRM_MS:3186 · useMenuTap:3187 · PlaqueSparks:3211 · PLAQUE_ASPECT:3230 · PLAQUE_CAP_CQW:3231 · MenuCard:3232 · MenuIconButton:3281 · MainMenu:3312 · InstallPrompt:3447 · DeckPickerModal:3483 · CARD_TYPE_ORDER:3514 · DeckSide:3515 · EditorSort:3516 · EDITOR_SORTS:3517 · EDITOR_MARGIN:3518 · EDITOR_FRAME:3519 · EDITOR_PAD:3520 · LIST_COLS:3523 · ROW_H:3524 · FULL_ART_TILE_SCALE:3525 · DeckEditor:3527 · ShopPhase:4090 · NpcMood:4091 · BoosterDef:4092 · BOOSTERS:4094 · TEST_FREE_BOOSTERS:4103 · SHELF_ROWS:4104 · SHELF_COLS:4105 · BOOSTER_ASPECT:4106 · SHELF_X0:4111 · SHELF_X1:4112 · SHELF_PLANKS:4113 · SHELF_OVERVIEW:4114 · SHELF_CLOSEUP:4115 · NPC_LINES:4117 · SHOP_ART:4125 · rollBooster:4133 · BoosterArt:4148 · NpcArt:4160 · PACK_TEAR_Y:4167 · LID_SLICES:4168 · LidSlice:4174 · PackTear:4197 · PulledCard:4266 · pullBooster:4267 · PackOpening:4280 · OpenBoosterFromTable:4359 · ShopScreen:4365 · AuthBackdrop:4605 · GoogleMark:4626 · DiscordMark:4629 · AuthButton:4631 · authFieldClass:4637 · LoginScreen:4639 · NAME_RULE:4700 · ProfileSetupScreen:4702 · VolumeRow:4768 · ToggleRow:4777 · OptionsModal:4787 · SettingsModal:4821 · playCoinSfx:4858 · COIN_THICK:4886 · CoinFace:4887 · CoinRim:4896 · RemotePick:4915 · CoinToss:4916 · MatchSearchOverlay:4998 · OnlineSearchOverlay:5039 · LoadingScreen:5114 · App:5168 · IMMEDIATE_ZONE_LABEL:10742 · DragFinger:10747 · GuideInfo:10764 · DragGuide:10765 · arrivalDrops:10832 · arrivalListener:10834 · EmblemKind:10839 · EMBLEM_ART:10840 · SlotEmblem:10841 · RowPlaque:10854 · CardSlot:10866

Dentro de `App` (linhas 5168–10741), funções internas:
attackMarkFor:5411 · openCardPicker:5438 · spawnFloatingNumber:5474 · spawnFloatingNumberAtId:5489 · showBanner:5516 · announcePhase:5540 · announceTurnChange:5550 · beginFinalBlow:5583 · endFinalBlow:5584 · blowIsSoaked:5587 · handleInstallClick:5671 · shieldOverSlot:5727 · popOverSlot:5736 · burstAt:5751 · whenGlowDone:5776 · endGlow:5777 · startTriggerFx:5781 · holdForSeat:5809 · terrainFxPlayer:5837 · terrainFxNpc:5838 · fireImpactBurst:5854 · noteDragPlay:5877 · handFanMaxAngleRad:5947 · getHandArrivalPoint:6055 · getFanRotation:6075 · getFanLift:6082 · computeDrawOrigin:6097 · showToast:6112 · announceCardPlay:6118 · toCardData:6192 · shownStats:6207 · boardView:6218 · syncView:6223 · processEvents:6257 · armedSlotsOf:6467 · cardOverlayFx:6468 · fxRectOf:6584 · fxEnvFor:6590 · pickTacticSpot:6607 · tacticFxOf:6616 · planFx:6620 · commitState:6650 · dispatchAction:6673 · wakeWaiter:6692 · publishClock:6693 · dispatchOnline:6695 · reconcileOwn:6731 · applyUnasked:6745 · ingestRows:6759 · chooseFirstOnline:6787 · absorbAct:6800 · refuseOwn:6809 · sendOnline:6821 · stopOnline:6835 · startOnlinePolling:6852 · nextOpponentAction:6870 · applyRewardToProfile:6897 · openPlayerPick:6904 · playerAct:6931 · openModePrompt:6943 · maybePromptRelicMode:6950 · confirmRelicMode:6959 · confirmUpkeep:6971 · endTurnNow:6983 · sleep:7002 · tutCurrent:7014 · tutCanBack:7018 · tutShow:7023 · tutGo:7039 · tutNext:7047 · tutBack:7061 · tutMatches:7066 · tutSignal:7078 · tutFromAction:7083 · tutBeat:7090 · tutExit:7097 · tutFinish:7104 · startTutorial:7105 · tutLaunchDuel:7110 · tutCoinResolved:7112 · settleAmbush:7169 · startMatchIntro:7202 · continueMatchIntro:7221 · resetGame:7313 · startGame:7366 · startOnlineMatch:7373 · leaveMatch:7415 · handleCardClick:7770 · handlePlayCardButtonClick:7830 · abilityStepCandidates:7889 · abilityHasTargets:7892 · getPlayerCreatureAbilityKind:7914 · getCardVisualEl:7928 · triggerPunch:8013 · renderTravelingArrow:8052 · playPendingTactic:8079 · resolveOwnTacticTarget:8086 · resolveEnemyTacticTarget:8091 · toggleCardPickerSelection:8099 · abilityOf:8113 · nextAbilityStep:8115 · activateAbility:8121 · abilityStepSide:8135 · resolveAbilityTarget:8141 · pushAbilityPrompt:8178 · mine:8199 · foes:8200 · effectTargetKind:8203 · specSlots:8205 · tacticTargeting:8219 · sourceAt:8226 · cancelTargeting:8244 · playHandCardOnTarget:8247 · heldTop:8254 · slotUnder:8255 · clearDragOver:8264 · dragBlockReason:8266 · tapHandCard:8278 · beginPress:8286 · returnHeld:8303 · dropHeldCard:8312 · updateHeld:8341 · dropOk:8360 · handleSlotClick:8416 · handleNpcSlotClick:8596 · handleBackgroundClick:8662 · getTappedCardShift:8693 · getSelectedCardX:8703 · getSelectedCardY:8725 · getBoardAnimation:8749 · getPlayerSlotHint:8790 · isTacticTargetSlot:8809 · tacticTagFor:8817 · shakePx:8880 · boardHeightMultiplier:8893 · boardTopMargin:8894

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/campoFx.ts  (336 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:9 · AURA:11 · Env:12 · cvs:15 · ctx:16 · fxs:17 · ensure:18 · resize:23 · R:24 · clamp:25 · eo:26 · lerp:27 · at:28 · add:29 · wait:30 · rc:33 · setU:34 · dirOf:35 · edgeY:36 · cols:37 · midY:38 · spawn:41 · glow:42 · drawP:43 · stepP:59 · flame:63 · ember:64 · fan:65 · ring:66 · dust:67 · glints:68 · Layer:72 · layers:73 · night:74 · animated:75 · tower:77 · armedOf:85 · Frame:90 · Sil:91 · SIL:92 · frameOf:93 · silOf:98 · ringOf:106 · edgeOf:115 · drawRing:119 · holderOf:120 · auraSlots:121 · layerTick:123 · layerDraw:146 · nightTick:156 · nightDraw:160 · inFrame:168 · overlayOpen:170 · busy:175 · frame:176 · step:181 · kick:197 · clearAll:198 · clearCampoLayers:199 · syncCampoLayers:203 · clang:225 · prep:226 · fxForjaPlaced:229 · equipTransfer:237 · fxForjaEquip:249 · fxFogoEquip:250 · fxArsenalEquip:251 · fxForjaModo:253 · fxFogoPlaced:260 · fxFogoTrincheira:270 · fxFogoSaque:279 · fxNoitePlay:289 · fxNoiteTrail:290 · branch:299 · fxMata:306 · WEAPONS:315 · weaponPath:316 · fxArsenalPlaced:324

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/cardFx.ts  (205 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CardRect:7 · Part:8 · cv:11 · parts:12 · ensure:13 · kick:19 · frame:20 · R:28 · clamp:29 · add:30 · run:32 · emit:39 · stepParts:40 · drawParts:43 · softGlow:53 · rr:54 · ctr:55 · fxLand:59 · fxImpact:73 · BN:101 · BURN:102 · noise:103 · nz:106 · F:108 · maskUrl:109 · burnMaskSheet:111 · mkLayer:118 · fxBurn:120 · fxLunge:161 · fxDrop:192

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
