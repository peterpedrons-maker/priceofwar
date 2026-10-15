<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11397 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · AVATAR_FILES:71 · avatarFile:72 · ALL_PRELOAD_IMAGES:269 · DRAW_FLIGHT_MS:295 · sfxVol:304 · playCardDrawSfx:305 · playCardPlaySfx:319 · playAttackSfx:326 · playEffectSfx:328 · playTacticSfx:329 · playSelectSfx:337 · bannerAudioCtx:349 · playBannerSfx:350 · playUiClickSfx:393 · playCardLiftSfx:402 · playDamageSfx:414 · playGeneralDamageSfx:419 · playDestroySfx:429 · playRevealGeneralSfx:431 · playWarHornSfx:437 · playBatalhaBannerSfx:442 · playBatalhaImpactSfx:450 · CardType:456 · CardData:458 · StatTone:506 · STAT_TONE_COLOR:507 · STAT_TONE_GRADIENT:508 · statsOf:513 · SlotHint:522 · getSlotHint:531 · RowRoleHint:537 · SOLDIER_CARD_TYPES:538 · getRowRoleHint:539 · ROW_ROLE_VIEW:546 · PHASE_BANNER_TEXT:570 · BATALHA_FALL_MS:592 · BATALHA_IMPACT_FRACTION:593 · BANNER_LEARN_COUNT:597 · bannersSeen:598 · PHASE_BANNER_STAGE_MS:599 · phaseBannerMs:600 · PHASE_BANNER_Y:608 · PHASE_BANNER_MOTION:609 · HIT_STOP_MS:620 · ATTACK_MS:623 · ATTACK_WINDUP_FRAC:624 · ATTACK_WINDUP_PX:625 · ATTACK_TILT_DEG:626 · IMPACT_MS:627 · TIME:630 · rangedKindOf:632 · FINAL_SLOW:633 · FINAL_INTRO_MS:634 · FINAL_FREEZE_MS:635 · FINAL_AFTER_MS:636 · SLASH_SPARK_ANGLES:639 · SlashEffect:648 · TargetKind:686 · TARGET_STYLE:687 · HUD_CARD_SCALE:693 · AmountBadge:697 · TargetingHud:714 · READY_COLORS:784 · SILHOUETTES:789 · silhouetteFor:794 · DEBUG_HOOKS:805 · TriggerIcon:807 · FLIGHT_MS:821 · HELD_SCALE:822 · HELD_GAP:823 · TriggerBurst:824 · TriggerFloatLayer:845 · AbilityReadyGlow:862 · TutRect:893 · tutPct:894 · tutSilBox:895 · tutElRect:904 · tutPad:905 · tutUnion:906 · TutResolved:911 · TUT_EMPTY:912 · visibleHandCards:913 · resolveTutTarget:914 · TutorialStage:961 · SpriteOnce:1005 · EffectIcon:1022 · EFFECT_ICONS:1023 · SpriteIcon:1031 · IconPop:1036 · SHIELD_SHEETS:1051 · GOLD_BUBBLE:1057 · ShieldAura:1058 · ShieldFxOnce:1078 · EquipFxLayer:1092 · PUNCH_FRAMES:1138 · PUNCH_FRAME_W:1139 · DrawFlightNovo:1146 · RepositionLegNovo:1186 · FlyingCardNovo:1212 · lastArrowKey:1242 · drawFlightDelay:1243 · PunchFx:1244 · BURN_FRAMES:1280 · BurningCard:1282 · GraveyardPile:1338 · AtkBadge:1370 · NUMBER_KIND_OF:1382 · NUMBER_TIERS:1387 · damageTier:1393 · floatLife:1394 · FloatNumber:1395 · HpBadge:1443 · GoldBadge:1472 · GoldNumber:1501 · CardBack:1561 · CARD_THICKNESS_SHADOW:1599 · cardBoxShadow:1610 · cardGlowFilter:1611 · CARD_FACE_VARIANTS:1621 · NO_STAT_TYPES:1638 · templateForType:1639 · templateForTypeMini:1644 · FitText:1663 · KeywordPill:1738 · STAT_TOKEN:1752 · STAT_NUMBER_STYLE:1753 · StatSymbol:1754 · CoinIcon:1762 · GoldSymbol:1765 · DamageSymbol:1770 · RULE_WORD_STYLE:1782 · renderEffectText:1783 · FitEffectText:1823 · FULL_ART_PLATE_VARIANTS:1887 · FULL_ART_SIZE_FIX:1897 · CardFaceFullArt:1898 · FullArtMiniConfig:2020 · FULL_ART_MINI_CONFIG:2025 · usesLightBar:2053 · nameTextStyle:2054 · FULL_ART_MINI_DEFAULT:2057 · fullArtMiniConfigForType:2062 · CardFaceFullArtMini:2077 · CARD_FACE_MINI_STD_SCALE:2126 · CardFaceStandardMini:2127 · CardFace:2190 · BOARD_EXTERIOR_ART_URL:2303 · FIELD_PREVIEW_SCALE:2308 · BOARD_PREVIEW_SCALE:2326 · FAN_SPREAD_DEG:2329 · FAN_LIFT_PX:2330 · HAND_CARD_WIDTH:2331 · HAND_CARD_HEIGHT:2332 · HAND_CARD_STEP:2335 · HAND_FULL_SPREAD_COUNT:2338 · HAND_SELECT_SCALE:2341 · handStepFor:2342 · ART_BY_NAME:2349 · MERC_ART_FILES:2403 · artSlug:2404 · CAMPO_ART_FILES:2410 · CAPITAO_ART_FILES:2416 · cardDataFromName:2422 · buildDeckCards:2426 · DECK_CAPITAO:2434 · DECK_CARDEAL:2435 · DECK_MERCENARIOS:2436 · DECK_CAMPO:2437 · DECKS:2441 · ALL_DECK_IDS:2471 · BOOSTER_POOLS:2474 · DECK_STORE_KEY:2494 · CARD_INSTANCES_BY_NAME:2496 · cardByName:2504 · isGeneralName:2505 · DeckSlot:2507 · DeckStore:2508 · DeckSelection:2510 · OnlineMatch:2516 · needsServer:2548 · visibleKey:2560 · countByName:2565 · CAPITAO_STARTER_NAME:2571 · MERC_STARTER_NAME:2572 · CAMPO_STARTER_NAME:2573 · CLOUD_DECK_SLOTS:2575 · MAX_DECK_SLOTS:2576 · buildStarterStore:2579 · sameCards:2603 · ensureStarterDecks:2607 · lastSanitizeMigrated:2639 · sanitizeDeckStore:2640 · loadDeckStore:2669 · cloudUserId:2683 · pushTimer:2684 · pushing:2685 · pushAgain:2686 · toCloudDecks:2687 · runPush:2688 · saveDeckStore:2701 · stopCloudSync:2706 · flushCloudSync:2708 · syncDeckStoreWithCloud:2719 · deckCardCount:2747 · deckProblem:2749 · buildDeckSelection:2757 · deckIdOfGeneral:2765 · DEFAULT_DECK_SELECTION:2766 · PlayerProfile:2775 · AVATAR_OPTIONS:2791 · avatarById:2844 · PROFILE_STORAGE_KEY:2846 · DEFAULT_PROFILE:2847 · loadProfile:2860 · formatCoroas:2874 · saveProfile:2879 · MODE_LABELS_PT:2888 · AvatarBadge:2898 · PlayerPlate:2913 · WINDOW_FRAME_PX:2942 · WINDOW_FONT_DECO:2943 · FramedWindow:2945 · WindowOverlay:2950 · WindowDivider:2973 · WindowTitle:2981 · Edges:2989 · ArtFrame:2990 · VLine:3011 · HLine:3014 · ArtChip:3019 · WindowOption:3025 · WindowText:3029 · WindowButton:3033 · AvatarPickerModal:3039 · ALLOW_PROFILE_RENAME:3087 · ProfileBar:3088 · ComingSoonModal:3209 · ONLINE_MODES:3225 · OnlineModeModal:3229 · TapPhase:3261 · MENU_CONFIRM_MS:3262 · useMenuTap:3263 · PlaqueSparks:3287 · PLAQUE_ASPECT:3306 · PLAQUE_CAP_CQW:3307 · MenuCard:3308 · MenuIconButton:3357 · MainMenu:3388 · InstallPrompt:3523 · DeckPickerModal:3559 · CARD_TYPE_ORDER:3590 · DeckSide:3591 · EditorSort:3592 · EDITOR_SORTS:3593 · EDITOR_MARGIN:3594 · EDITOR_FRAME:3595 · EDITOR_PAD:3596 · LIST_COLS:3599 · ROW_H:3600 · FULL_ART_TILE_SCALE:3601 · DeckEditor:3603 · ShopPhase:4166 · NpcMood:4167 · BoosterDef:4168 · BOOSTERS:4170 · TEST_FREE_BOOSTERS:4179 · SHELF_ROWS:4180 · SHELF_COLS:4181 · BOOSTER_ASPECT:4182 · SHELF_X0:4187 · SHELF_X1:4188 · SHELF_PLANKS:4189 · SHELF_OVERVIEW:4190 · SHELF_CLOSEUP:4191 · NPC_LINES:4193 · SHOP_ART:4201 · rollBooster:4209 · BoosterArt:4224 · NpcArt:4236 · PACK_TEAR_Y:4243 · LID_SLICES:4244 · LidSlice:4250 · PackTear:4273 · PulledCard:4342 · pullBooster:4343 · PackOpening:4356 · OpenBoosterFromTable:4435 · ShopScreen:4441 · AuthBackdrop:4681 · GoogleMark:4702 · DiscordMark:4705 · AuthButton:4707 · authFieldClass:4713 · LoginScreen:4715 · NAME_RULE:4776 · ProfileSetupScreen:4778 · VolumeRow:4844 · ToggleRow:4853 · OptionsModal:4863 · SettingsModal:4897 · playCoinSfx:4934 · COIN_THICK:4962 · CoinFace:4963 · CoinRim:4972 · RemotePick:4991 · CoinToss:4992 · MatchSearchOverlay:5074 · OnlineSearchOverlay:5115 · LoadingScreen:5190 · App:5244 · IMMEDIATE_ZONE_LABEL:10851 · DragFinger:10856 · GuideInfo:10873 · DragGuide:10874 · arrivalDrops:10941 · arrivalListener:10943 · EmblemKind:10948 · EMBLEM_ART:10949 · SlotEmblem:10950 · RowPlaque:10963 · CardSlot:10975

Dentro de `App` (linhas 5244–10850), funções internas:
attackMarkFor:5487 · openCardPicker:5514 · spawnFloatingNumber:5550 · spawnFloatingNumberAtId:5565 · showBanner:5592 · announcePhase:5616 · announceTurnChange:5626 · beginFinalBlow:5659 · endFinalBlow:5660 · blowIsSoaked:5663 · handleInstallClick:5749 · shieldOverSlot:5805 · popOverSlot:5814 · burstAt:5829 · whenGlowDone:5854 · endGlow:5855 · startTriggerFx:5859 · holdForSeat:5887 · terrainFxPlayer:5915 · terrainFxNpc:5916 · fireImpactBurst:5932 · noteDragPlay:5955 · handFanMaxAngleRad:6025 · getHandArrivalPoint:6134 · getFanRotation:6154 · getFanLift:6161 · computeDrawOrigin:6176 · showToast:6191 · announceCardPlay:6197 · toCardData:6271 · shownStats:6286 · boardView:6297 · syncView:6302 · processEvents:6336 · armedSlotsOf:6546 · cardOverlayFx:6547 · fxRectOf:6664 · fxEnvFor:6670 · pickTacticSpot:6687 · tacticFxOf:6696 · planFx:6700 · commitState:6730 · dispatchAction:6753 · wakeWaiter:6772 · publishClock:6773 · dispatchOnline:6775 · reconcileOwn:6811 · applyUnasked:6825 · ingestRows:6839 · chooseFirstOnline:6867 · absorbAct:6880 · refuseOwn:6889 · sendOnline:6901 · stopOnline:6915 · startOnlinePolling:6932 · nextOpponentAction:6950 · applyRewardToProfile:6977 · openPlayerPick:6984 · playerAct:7011 · openModePrompt:7023 · maybePromptRelicMode:7030 · confirmRelicMode:7039 · confirmUpkeep:7051 · endTurnNow:7063 · sleep:7082 · tutCurrent:7094 · tutCanBack:7098 · tutShow:7103 · tutGo:7119 · tutNext:7127 · tutBack:7141 · tutMatches:7146 · tutSignal:7158 · tutFromAction:7163 · tutBeat:7170 · tutExit:7177 · tutFinish:7184 · startTutorial:7185 · tutLaunchDuel:7190 · tutCoinResolved:7192 · settleAmbush:7249 · startMatchIntro:7282 · continueMatchIntro:7301 · resetGame:7393 · startGame:7446 · startOnlineMatch:7453 · leaveMatch:7495 · handleCardClick:7850 · handlePlayCardButtonClick:7910 · abilityStepCandidates:7969 · abilityHasTargets:7972 · getPlayerCreatureAbilityKind:7994 · getCardVisualEl:8008 · triggerPunch:8093 · renderTravelingArrow:8142 · playPendingTactic:8169 · resolveOwnTacticTarget:8176 · resolveEnemyTacticTarget:8181 · toggleCardPickerSelection:8189 · abilityOf:8203 · nextAbilityStep:8205 · activateAbility:8211 · abilityStepSide:8225 · resolveAbilityTarget:8231 · pushAbilityPrompt:8268 · mine:8289 · foes:8290 · effectTargetKind:8293 · specSlots:8295 · tacticTargeting:8309 · sourceAt:8316 · cancelTargeting:8334 · playHandCardOnTarget:8337 · heldTop:8344 · slotUnder:8345 · clearDragOver:8354 · dragBlockReason:8356 · tapHandCard:8368 · beginPress:8376 · returnHeld:8393 · dropHeldCard:8402 · updateHeld:8431 · dropOk:8450 · handleSlotClick:8506 · handleNpcSlotClick:8686 · handleBackgroundClick:8752 · getTappedCardShift:8783 · getSelectedCardX:8793 · getSelectedCardY:8815 · getBoardAnimation:8839 · getPlayerSlotHint:8880 · isTacticTargetSlot:8899 · tacticTagFor:8907 · boardHeightMultiplier:8983 · boardTopMargin:8984

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

## src/campoFx.ts  (336 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Side:9 · AURA:11 · Env:12 · cvs:15 · ctx:16 · fxs:17 · ensure:18 · resize:23 · R:24 · clamp:25 · eo:26 · lerp:27 · at:28 · add:29 · wait:30 · rc:33 · setU:34 · dirOf:35 · edgeY:36 · cols:37 · midY:38 · spawn:41 · glow:42 · drawP:43 · stepP:59 · flame:63 · ember:64 · fan:65 · ring:66 · dust:67 · glints:68 · Layer:72 · layers:73 · night:74 · animated:75 · tower:77 · armedOf:85 · Frame:90 · Sil:91 · SIL:92 · frameOf:93 · silOf:98 · ringOf:106 · edgeOf:115 · drawRing:119 · holderOf:120 · auraSlots:121 · layerTick:123 · layerDraw:146 · nightTick:156 · nightDraw:160 · inFrame:168 · overlayOpen:170 · busy:175 · frame:176 · step:181 · kick:197 · clearAll:198 · clearCampoLayers:199 · syncCampoLayers:203 · clang:225 · prep:226 · fxForjaPlaced:229 · equipTransfer:237 · fxForjaEquip:249 · fxFogoEquip:250 · fxArsenalEquip:251 · fxForjaModo:253 · fxFogoPlaced:260 · fxFogoTrincheira:270 · fxFogoSaque:279 · fxNoitePlay:289 · fxNoiteTrail:290 · branch:299 · fxMata:306 · WEAPONS:315 · weaponPath:316 · fxArsenalPlaced:324

## src/card3d.ts  (4 linhas)
Caminho das faces pré-renderizadas das cartas para o 3D.

cardSlug:2

## src/cardFx.ts  (344 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

CardRect:7 · Part:8 · cv:11 · parts:12 · ensure:13 · kick:19 · frame:20 · R:28 · clamp:29 · add:30 · run:32 · emit:39 · stepParts:40 · drawParts:43 · softGlow:53 · rr:54 · RINGS:57 · frameImgOf:58 · SOLID:60 · solidOf:61 · silRing:71 · drawSil:80 · hintEl:84 · fxHintFrame:86 · ctr:87 · fxLand:91 · fxImpact:117 · BN:145 · BURN:146 · noise:147 · nz:150 · F:152 · maskUrl:153 · burnMaskSheet:155 · mkLayer:162 · fxBurn:164 · fxLunge:205 · fxDrop:241 · ArrowSpec:259 · arrows:260 · exitT:261 · PERIOD:265 · drawArrow:266 · fxArrows:302 · fxDrawFollow:313 · fxMoveFollow:331

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
