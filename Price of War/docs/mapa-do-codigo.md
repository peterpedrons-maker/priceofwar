<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11455 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:271 · DRAW_FLIGHT_MS:297 · sfxVol:306 · playCardDrawSfx:307 · playCardPlaySfx:321 · playAttackSfx:328 · playEffectSfx:330 · playTacticSfx:331 · playSelectSfx:339 · bannerAudioCtx:351 · playBannerSfx:352 · playUiClickSfx:395 · playCardLiftSfx:404 · playDamageSfx:416 · playGeneralDamageSfx:421 · playDestroySfx:431 · playRevealGeneralSfx:433 · playWarHornSfx:439 · playBatalhaBannerSfx:444 · playBatalhaImpactSfx:452 · CardType:458 · CardData:460 · StatTone:508 · STAT_TONE_COLOR:509 · STAT_TONE_GRADIENT:510 · statsOf:515 · SlotHint:524 · getSlotHint:533 · RowRoleHint:539 · SOLDIER_CARD_TYPES:540 · getRowRoleHint:541 · ROW_ROLE_VIEW:548 · PHASE_BANNER_TEXT:572 · BATALHA_FALL_MS:594 · BATALHA_IMPACT_FRACTION:595 · BANNER_LEARN_COUNT:599 · bannersSeen:600 · PHASE_BANNER_STAGE_MS:601 · phaseBannerMs:602 · PHASE_BANNER_Y:610 · PHASE_BANNER_MOTION:611 · HIT_STOP_MS:622 · ATTACK_MS:625 · ATTACK_WINDUP_FRAC:626 · ATTACK_WINDUP_PX:627 · ATTACK_TILT_DEG:628 · IMPACT_MS:629 · TIME:632 · rangedKindOf:634 · FINAL_SLOW:635 · FINAL_INTRO_MS:636 · FINAL_FREEZE_MS:637 · FINAL_AFTER_MS:638 · SLASH_SPARK_ANGLES:641 · SlashEffect:650 · TargetKind:688 · TARGET_STYLE:689 · HUD_CARD_SCALE:695 · AmountBadge:699 · TargetingHud:716 · READY_COLORS:786 · SILHOUETTES:791 · silhouetteFor:796 · DEBUG_HOOKS:807 · TriggerIcon:809 · FLIGHT_MS:823 · HELD_SCALE:824 · HELD_GAP:825 · TriggerBurst:826 · TriggerFloatLayer:847 · AbilityReadyGlow:864 · TutRect:895 · tutPct:896 · tutSilBox:897 · tutElRect:906 · tutPad:907 · tutUnion:908 · TutResolved:913 · TUT_EMPTY:914 · visibleHandCards:915 · resolveTutTarget:916 · TutorialStage:963 · SpriteOnce:1007 · EffectIcon:1024 · EFFECT_ICONS:1025 · SpriteIcon:1033 · IconPop:1038 · SHIELD_SHEETS:1053 · GOLD_BUBBLE:1059 · ShieldAura:1060 · ShieldFxOnce:1080 · EquipFxLayer:1094 · PUNCH_FRAMES:1140 · PUNCH_FRAME_W:1141 · DRAW_STYLE:1149 · DrawFlightNovo:1150 · RepositionLegNovo:1195 · FlyingCardNovo:1221 · lastArrowKey:1251 · drawFlightDelay:1252 · PunchFx:1253 · BURN_FRAMES:1289 · BurningCard:1291 · GraveyardPile:1347 · AtkBadge:1379 · NUMBER_KIND_OF:1391 · NUMBER_TIERS:1396 · damageTier:1402 · floatLife:1403 · FloatNumber:1404 · HpBadge:1454 · GoldBadge:1483 · GoldNumber:1512 · CardBack:1572 · CARD_THICKNESS_SHADOW:1610 · cardBoxShadow:1621 · cardGlowFilter:1622 · CARD_FACE_VARIANTS:1632 · NO_STAT_TYPES:1649 · templateForType:1650 · templateForTypeMini:1655 · FitText:1674 · KeywordPill:1749 · STAT_TOKEN:1763 · STAT_NUMBER_STYLE:1764 · StatSymbol:1765 · CoinIcon:1773 · GoldSymbol:1776 · DamageSymbol:1781 · RULE_WORD_STYLE:1793 · renderEffectText:1794 · FitEffectText:1834 · FULL_ART_PLATE_VARIANTS:1898 · FULL_ART_SIZE_FIX:1908 · CardFaceFullArt:1909 · FullArtMiniConfig:2031 · FULL_ART_MINI_CONFIG:2036 · usesLightBar:2064 · nameTextStyle:2065 · FULL_ART_MINI_DEFAULT:2068 · fullArtMiniConfigForType:2073 · CardFaceFullArtMini:2088 · CARD_FACE_MINI_STD_SCALE:2137 · CardFaceStandardMini:2138 · CardFace:2201 · BOARD_EXTERIOR_ART_URL:2314 · FIELD_PREVIEW_SCALE:2319 · BOARD_PREVIEW_SCALE:2337 · FAN_SPREAD_DEG:2340 · FAN_LIFT_PX:2341 · HAND_CARD_WIDTH:2342 · HAND_CARD_HEIGHT:2343 · HAND_CARD_STEP:2346 · HAND_FULL_SPREAD_COUNT:2349 · HAND_SELECT_SCALE:2352 · handStepFor:2353 · ART_BY_NAME:2360 · MERC_ART_FILES:2414 · artSlug:2415 · CAMPO_ART_FILES:2421 · CAPITAO_ART_FILES:2427 · cardDataFromName:2433 · buildDeckCards:2437 · DECK_CAPITAO:2445 · DECK_CARDEAL:2446 · DECK_MERCENARIOS:2447 · DECK_CAMPO:2448 · DECKS:2452 · ALL_DECK_IDS:2482 · BOOSTER_POOLS:2485 · DECK_STORE_KEY:2505 · CARD_INSTANCES_BY_NAME:2507 · cardByName:2515 · isGeneralName:2516 · DeckSlot:2518 · DeckStore:2519 · DeckSelection:2521 · OnlineMatch:2527 · needsServer:2559 · visibleKey:2571 · countByName:2576 · CAPITAO_STARTER_NAME:2582 · MERC_STARTER_NAME:2583 · CAMPO_STARTER_NAME:2584 · CLOUD_DECK_SLOTS:2586 · MAX_DECK_SLOTS:2587 · buildStarterStore:2590 · sameCards:2614 · ensureStarterDecks:2618 · lastSanitizeMigrated:2650 · sanitizeDeckStore:2651 · loadDeckStore:2680 · cloudUserId:2694 · pushTimer:2695 · pushing:2696 · pushAgain:2697 · toCloudDecks:2698 · runPush:2699 · saveDeckStore:2712 · stopCloudSync:2717 · flushCloudSync:2719 · syncDeckStoreWithCloud:2730 · deckCardCount:2758 · deckProblem:2760 · buildDeckSelection:2768 · deckIdOfGeneral:2776 · DEFAULT_DECK_SELECTION:2777 · PlayerProfile:2786 · AVATAR_OPTIONS:2802 · avatarById:2855 · PROFILE_STORAGE_KEY:2857 · DEFAULT_PROFILE:2858 · loadProfile:2871 · formatCoroas:2885 · saveProfile:2890 · MODE_LABELS_PT:2899 · AvatarBadge:2909 · PlayerPlate:2924 · WINDOW_FRAME_PX:2953 · WINDOW_FONT_DECO:2954 · FramedWindow:2956 · WindowOverlay:2961 · WindowDivider:2984 · WindowTitle:2992 · Edges:3000 · ArtFrame:3001 · VLine:3022 · HLine:3025 · ArtChip:3030 · WindowOption:3036 · WindowText:3040 · WindowButton:3044 · AvatarPickerModal:3050 · ALLOW_PROFILE_RENAME:3098 · ProfileBar:3099 · ComingSoonModal:3220 · ONLINE_MODES:3236 · OnlineModeModal:3240 · TapPhase:3272 · MENU_CONFIRM_MS:3273 · useMenuTap:3274 · PlaqueSparks:3298 · PLAQUE_ASPECT:3317 · PLAQUE_CAP_CQW:3318 · MenuCard:3319 · MenuIconButton:3368 · MainMenu:3399 · InstallPrompt:3534 · DeckPickerModal:3570 · CARD_TYPE_ORDER:3601 · DeckSide:3602 · EditorSort:3603 · EDITOR_SORTS:3604 · EDITOR_MARGIN:3605 · EDITOR_FRAME:3606 · EDITOR_PAD:3607 · LIST_COLS:3610 · ROW_H:3611 · FULL_ART_TILE_SCALE:3612 · DeckEditor:3614 · ShopPhase:4177 · NpcMood:4178 · BoosterDef:4179 · BOOSTERS:4181 · TEST_FREE_BOOSTERS:4190 · SHELF_ROWS:4191 · SHELF_COLS:4192 · BOOSTER_ASPECT:4193 · SHELF_X0:4198 · SHELF_X1:4199 · SHELF_PLANKS:4200 · SHELF_OVERVIEW:4201 · SHELF_CLOSEUP:4202 · NPC_LINES:4204 · SHOP_ART:4212 · rollBooster:4220 · BoosterArt:4235 · NpcArt:4247 · PACK_TEAR_Y:4254 · LID_SLICES:4255 · LidSlice:4261 · PackTear:4284 · PulledCard:4353 · pullBooster:4354 · PackOpeningOld:4367 · CARD3D_FILES:4448 · card3dUrl:4449 · Booster3DOpening:4450 · PackOpening:4477 · OpenBoosterFromTable:4483 · ShopScreen:4489 · AuthBackdrop:4729 · GoogleMark:4750 · DiscordMark:4753 · AuthButton:4755 · authFieldClass:4761 · LoginScreen:4763 · NAME_RULE:4824 · ProfileSetupScreen:4826 · VolumeRow:4892 · ToggleRow:4901 · OptionsModal:4911 · SettingsModal:4945 · playCoinSfx:4982 · COIN_THICK:5010 · CoinFace:5011 · CoinRim:5020 · RemotePick:5039 · CoinToss:5040 · MatchSearchOverlay:5122 · OnlineSearchOverlay:5163 · LoadingScreen:5238 · App:5292 · IMMEDIATE_ZONE_LABEL:10909 · DragFinger:10914 · GuideInfo:10931 · DragGuide:10932 · arrivalDrops:10999 · arrivalListener:11001 · EmblemKind:11006 · EMBLEM_ART:11007 · SlotEmblem:11008 · RowPlaque:11021 · CardSlot:11033

Dentro de `App` (linhas 5292–10908), funções internas:
attackMarkFor:5535 · openCardPicker:5562 · spawnFloatingNumber:5598 · spawnFloatingNumberAtId:5614 · showBanner:5641 · announcePhase:5665 · announceTurnChange:5675 · beginFinalBlow:5708 · endFinalBlow:5709 · blowIsSoaked:5712 · handleInstallClick:5798 · shieldOverSlot:5854 · popOverSlot:5863 · burstAt:5878 · whenGlowDone:5903 · endGlow:5904 · startTriggerFx:5908 · holdForSeat:5936 · terrainFxPlayer:5964 · terrainFxNpc:5965 · fireImpactBurst:5981 · noteDragPlay:6004 · handFanMaxAngleRad:6074 · getHandArrivalPoint:6183 · getFanRotation:6203 · getFanLift:6210 · computeDrawOrigin:6225 · showToast:6240 · announceCardPlay:6246 · toCardData:6320 · shownStats:6335 · boardView:6346 · syncView:6351 · processEvents:6385 · armedSlotsOf:6596 · cardOverlayFx:6597 · fxRectOf:6714 · fxEnvFor:6720 · pickTacticSpot:6737 · tacticFxOf:6746 · planFx:6750 · commitState:6780 · dispatchAction:6803 · wakeWaiter:6822 · publishClock:6823 · dispatchOnline:6825 · reconcileOwn:6861 · applyUnasked:6875 · ingestRows:6889 · chooseFirstOnline:6917 · absorbAct:6930 · refuseOwn:6939 · sendOnline:6951 · stopOnline:6965 · startOnlinePolling:6982 · nextOpponentAction:7000 · applyRewardToProfile:7027 · openPlayerPick:7034 · playerAct:7061 · openModePrompt:7073 · maybePromptRelicMode:7080 · confirmRelicMode:7089 · confirmUpkeep:7101 · endTurnNow:7113 · sleep:7132 · tutCurrent:7144 · tutCanBack:7148 · tutShow:7153 · tutGo:7169 · tutNext:7177 · tutBack:7191 · tutMatches:7196 · tutSignal:7208 · tutFromAction:7213 · tutBeat:7220 · tutExit:7227 · tutFinish:7234 · startTutorial:7235 · tutLaunchDuel:7240 · tutCoinResolved:7242 · settleAmbush:7299 · startMatchIntro:7332 · continueMatchIntro:7351 · resetGame:7443 · startGame:7496 · startOnlineMatch:7503 · leaveMatch:7545 · handleCardClick:7900 · handlePlayCardButtonClick:7960 · abilityStepCandidates:8019 · abilityHasTargets:8022 · getPlayerCreatureAbilityKind:8044 · getCardVisualEl:8058 · triggerPunch:8149 · renderTravelingArrow:8200 · playPendingTactic:8227 · resolveOwnTacticTarget:8234 · resolveEnemyTacticTarget:8239 · toggleCardPickerSelection:8247 · abilityOf:8261 · nextAbilityStep:8263 · activateAbility:8269 · abilityStepSide:8283 · resolveAbilityTarget:8289 · pushAbilityPrompt:8326 · mine:8347 · foes:8348 · effectTargetKind:8351 · specSlots:8353 · tacticTargeting:8367 · sourceAt:8374 · cancelTargeting:8392 · playHandCardOnTarget:8395 · heldTop:8402 · slotUnder:8403 · clearDragOver:8412 · dragBlockReason:8414 · tapHandCard:8426 · beginPress:8434 · returnHeld:8451 · dropHeldCard:8460 · updateHeld:8489 · dropOk:8508 · handleSlotClick:8564 · handleNpcSlotClick:8744 · handleBackgroundClick:8810 · getTappedCardShift:8841 · getSelectedCardX:8851 · getSelectedCardY:8873 · getBoardAnimation:8897 · getPlayerSlotHint:8938 · isTacticTargetSlot:8957 · tacticTagFor:8965 · boardHeightMultiplier:9041 · boardTopMargin:9042

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/boosterOpen3d.ts  (183 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

OpenCard:11 · OpenOpts:12 · HALO:13 · playBoosterOpening:15

## src/campoFx.ts  (336 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:9 · AURA:11 · Env:12 · cvs:15 · ctx:16 · fxs:17 · ensure:18 · resize:23 · R:24 · clamp:25 · eo:26 · lerp:27 · at:28 · add:29 · wait:30 · rc:33 · setU:34 · dirOf:35 · edgeY:36 · cols:37 · midY:38 · spawn:41 · glow:42 · drawP:43 · stepP:59 · flame:63 · ember:64 · fan:65 · ring:66 · dust:67 · glints:68 · Layer:72 · layers:73 · night:74 · animated:75 · tower:77 · armedOf:85 · Frame:90 · Sil:91 · SIL:92 · frameOf:93 · silOf:98 · ringOf:106 · edgeOf:115 · drawRing:119 · holderOf:120 · auraSlots:121 · layerTick:123 · layerDraw:146 · nightTick:156 · nightDraw:160 · inFrame:168 · overlayOpen:170 · busy:175 · frame:176 · step:181 · kick:197 · clearAll:198 · clearCampoLayers:199 · syncCampoLayers:203 · clang:225 · prep:226 · fxForjaPlaced:229 · equipTransfer:237 · fxForjaEquip:249 · fxFogoEquip:250 · fxArsenalEquip:251 · fxForjaModo:253 · fxFogoPlaced:260 · fxFogoTrincheira:270 · fxFogoSaque:279 · fxNoitePlay:289 · fxNoiteTrail:290 · branch:299 · fxMata:306 · WEAPONS:315 · weaponPath:316 · fxArsenalPlaced:324

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/cardFx.ts  (358 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CardRect:7 · Part:8 · cv:11 · parts:12 · ensure:13 · kick:19 · frame:20 · R:28 · clamp:29 · add:30 · run:32 · emit:39 · stepParts:40 · drawParts:43 · softGlow:53 · rr:54 · RINGS:57 · frameImgOf:58 · SOLID:60 · solidOf:61 · silRing:71 · drawSil:80 · hintEl:84 · fxHintFrame:86 · ctr:87 · fxLand:91 · fxImpact:117 · BN:145 · BURN:146 · noise:147 · nz:150 · F:152 · maskUrl:153 · burnMaskSheet:155 · mkLayer:162 · fxBurn:164 · fxLunge:205 · fxDrop:241 · ArrowSpec:259 · arrows:260 · exitT:261 · PERIOD:265 · drawArrow:266 · fxArrows:302 · fxDrawFollow:313 · fxMoveFollow:331 · SelItem:347 · selItems:348 · fxSelection:349

## src/CardViewer3D.tsx  (175 linhas)
Visualizador 3D de carta (three.js, carregado sob demanda); também a página ?3d.

Viewer3DCard:8 · EMBED:11 · FILES:12 · urlOf:13 · W:16 · roundedShape:18 · BACK_SX:27 · backGeometry:28 · CardViewer3D:32

## src/CollectionRoom.tsx  (499 linhas)
Sala de Coleção: o quarto em imagem única com objetos tocáveis (livro, porta, estante de boosters, mesa/deck), câmera com zoom e o fichário (Binder).

CardViewer3D:12 · THUMBS:13 · thumbOf:14 · SW:16 · PER:17 · BOOK_W:18 · clamp:19 · wait:20 · GOLD:21 · SPOTS:24 · SpotKey:30 · Plaque:33 · BookTitle:48 · SHELF_ROWS:60 · shelfSlot:61 · Entry:66 · RoomPack:68 · CollectionRoom:69 · NS:226 · SS:227 · BEND:228 · Rect:229 · Phase:230 · Binder:232 · PACK_ASPECT:488 · SheenDriver:491

## src/combatFx.ts  (1046 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

FxSide:50 · FxRect:51 · FxTarget:52 · FxEnv:54 · cv:68 · ctx:69 · RES:70 · fxs:71 · IMG:72 · SRC:73 · readyP:74 · preloadCombatFx:75 · resize:79 · ensureCanvas:80 · R:89 · clamp:90 · eo:91 · at:92 · add:93 · wait:94 · tick:96 · loop:107 · kick:111 · URLS:114 · play:115 · whoosh:116 · pick:119 · FS:126 · sprite:127 · explosion:134 · holy:142 · flash:145 · shock:149 · scorch:156 · puff:160 · dust:166 · debris:169 · sparks:178 · softAngle:185 · fly:196 · arcTangent:235 · stick:236 · ring:242 · burst:245 · sparksDir:250 · glint:257 · cleanHit:264 · lanceFade:268 · thunk:269 · rockBreak:275 · sheetXY:289 · playSheet:295 · ding:297 · coinAt:298 · coinFly:304 · coinBurst:313 · stonesFall:322 · drawBack:333 · flyBack:339 · setScale:344 · pt:345 · tacPoint:346 · landingImpact:350 · fxLanding:381 · landTactic:388 · leaveTactic:400 · weaponReveal:403 · once:430 · fxTactic:434 · fxHero:550 · fxRanged:583 · start:655 · toU:656 · fxUpkeep:660 · fxGoldGain:689 · fxRelicSoldo:702 · fxLoot:717 · fxPlaced:729 · fxReformar:756 · fxAmbush:768 · HOLY_SRC:802 · holyP:803 · loadHoly:804 · preloadHolyFx:805 · startHoly:806 · tween:807 · GOLDC:808 · twNow:811 · twMove:815 · twBurst:820 · charge:823 · risers:826 · groundGlow:829 · whiteFlash:833 · dimAt:837 · glowEl:844 · liftEl:847 · pilar:851 · sigilo:856 · cruzAt:860 · trompaAt:861 · almaAt:862 · heartAt:866 · godrays:869 · asasAt:876 · solAt:880 · portalAt:883 · orb:887 · cometaFly:895 · fxBencao:906 · fxCalice:933 · fxHospitalario:944 · fxNobre:970 · fxReforco:984 · fxComandante:997 · fxRetorno:1011 · fxAtirador:1036

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

## src/engine/game.ts  (1107 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:85 · RuleError:88 · fail:89 · log:91 · P:92 · combatOpen:94 · activePhases:95 · addGold:98 · removeOne:107 · takeFromDeck:108 · drawCards:110 · removeFromHand:123 · discard:130 · sendDestroyed:137 · reinforceFrom:166 · setWinner:183 · soak:192 · grantShield:204 · grantBlock:210 · damageSlot:218 · healSlot:234 · startTurn:244 · enterPreparation:302 · payUpkeep:309 · setRelicMode:342 · runTurnEnd:356 · endTurn:376 · assertCanAct:386 · Fx:397 · uniqueByName:404 · matchesFilter:405 · filterLabel:412 · specCandidates:415 · checkTarget:419 · activeTargets:437 · validateTargets:441 · checkVerb:448 · checkVerbTarget:462 · openPick:466 · runVerb:475 · runAbilities:634 · grantMovedBuff:640 · playCard:650 · useAbility:714 · choose:754 · attack:812 · respondAmbush:838 · resolveAmbushEffect:855 · resolveCombat:891 · move:970 · advance:1003 · discardExcess:1025 · clone:1042 · applyAction:1044 · MatchLog:1086 · newMatchLog:1093 · replayMatch:1096

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
