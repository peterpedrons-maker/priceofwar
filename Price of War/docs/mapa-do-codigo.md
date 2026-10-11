<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11071 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:261 · DRAW_FLIGHT_MS:287 · sfxVol:296 · playCardDrawSfx:297 · playCardPlaySfx:311 · playAttackSfx:318 · playEffectSfx:320 · playTacticSfx:321 · playSelectSfx:329 · bannerAudioCtx:341 · playBannerSfx:342 · playUiClickSfx:385 · playCardLiftSfx:394 · playDamageSfx:406 · playGeneralDamageSfx:411 · playDestroySfx:421 · playRevealGeneralSfx:423 · playWarHornSfx:429 · playBatalhaBannerSfx:434 · playBatalhaImpactSfx:442 · CardType:448 · CardData:450 · StatTone:498 · STAT_TONE_COLOR:499 · STAT_TONE_GRADIENT:500 · statsOf:505 · SlotHint:514 · getSlotHint:523 · RowRoleHint:529 · SOLDIER_CARD_TYPES:530 · getRowRoleHint:531 · ROW_ROLE_VIEW:538 · PHASE_BANNER_TEXT:562 · BATALHA_FALL_MS:584 · BATALHA_IMPACT_FRACTION:585 · BANNER_LEARN_COUNT:589 · bannersSeen:590 · PHASE_BANNER_STAGE_MS:591 · phaseBannerMs:592 · PHASE_BANNER_Y:600 · PHASE_BANNER_MOTION:601 · HIT_STOP_MS:612 · ATTACK_MS:615 · ATTACK_WINDUP_FRAC:616 · ATTACK_WINDUP_PX:617 · ATTACK_TILT_DEG:618 · IMPACT_MS:619 · TIME:622 · rangedKindOf:624 · FINAL_SLOW:625 · FINAL_INTRO_MS:626 · FINAL_FREEZE_MS:627 · FINAL_AFTER_MS:628 · SLASH_SPARK_ANGLES:631 · SlashEffect:640 · TargetKind:678 · TARGET_STYLE:679 · HUD_CARD_SCALE:685 · AmountBadge:689 · TargetingHud:706 · READY_COLORS:776 · SILHOUETTES:781 · silhouetteFor:786 · DEBUG_HOOKS:797 · TriggerIcon:799 · FLIGHT_MS:813 · HELD_SCALE:814 · HELD_GAP:815 · TriggerBurst:816 · TriggerFloatLayer:837 · AbilityReadyGlow:854 · TutRect:885 · tutPct:886 · tutSilBox:887 · tutElRect:896 · tutPad:897 · tutUnion:898 · TutResolved:903 · TUT_EMPTY:904 · visibleHandCards:905 · resolveTutTarget:906 · TutorialStage:953 · SpriteOnce:997 · EffectIcon:1014 · EFFECT_ICONS:1015 · SpriteIcon:1023 · IconPop:1028 · SHIELD_SHEETS:1043 · GOLD_BUBBLE:1049 · ShieldAura:1050 · ShieldFxOnce:1070 · EquipFxLayer:1084 · PUNCH_FRAMES:1130 · PUNCH_FRAME_W:1131 · PunchFx:1133 · BURN_FRAMES:1169 · BurningCard:1171 · GraveyardPile:1221 · AtkBadge:1253 · NUMBER_KIND_OF:1265 · NUMBER_TIERS:1270 · damageTier:1276 · floatLife:1277 · FloatNumber:1278 · HpBadge:1326 · GoldBadge:1355 · GoldNumber:1384 · CardBack:1444 · CARD_THICKNESS_SHADOW:1482 · cardBoxShadow:1493 · cardGlowFilter:1494 · CARD_FACE_VARIANTS:1504 · NO_STAT_TYPES:1521 · templateForType:1522 · templateForTypeMini:1527 · FitText:1546 · KeywordPill:1621 · STAT_TOKEN:1635 · STAT_NUMBER_STYLE:1636 · StatSymbol:1637 · DamageSymbol:1644 · renderEffectText:1655 · FitEffectText:1674 · FULL_ART_PLATE_VARIANTS:1738 · FULL_ART_SIZE_FIX:1748 · CardFaceFullArt:1749 · FullArtMiniConfig:1870 · FULL_ART_MINI_CONFIG:1875 · usesLightBar:1903 · nameTextStyle:1904 · FULL_ART_MINI_DEFAULT:1907 · fullArtMiniConfigForType:1912 · CardFaceFullArtMini:1927 · CARD_FACE_MINI_STD_SCALE:1976 · CardFaceStandardMini:1977 · CardFace:2040 · BOARD_EXTERIOR_ART_URL:2152 · FIELD_PREVIEW_SCALE:2157 · BOARD_PREVIEW_SCALE:2175 · FAN_SPREAD_DEG:2178 · FAN_LIFT_PX:2179 · HAND_CARD_WIDTH:2180 · HAND_CARD_HEIGHT:2181 · HAND_CARD_STEP:2184 · HAND_FULL_SPREAD_COUNT:2187 · HAND_SELECT_SCALE:2190 · handStepFor:2191 · ART_BY_NAME:2198 · MERC_ART_FILES:2252 · artSlug:2253 · cardDataFromName:2259 · buildDeckCards:2263 · DECK_CAPITAO:2271 · DECK_CARDEAL:2272 · DECK_MERCENARIOS:2273 · DECKS:2277 · ALL_DECK_IDS:2300 · BOOSTER_POOLS:2303 · DECK_STORE_KEY:2323 · CARD_INSTANCES_BY_NAME:2325 · cardByName:2333 · isGeneralName:2334 · DeckSlot:2336 · DeckStore:2337 · DeckSelection:2339 · OnlineMatch:2345 · needsServer:2377 · visibleKey:2389 · countByName:2394 · CAPITAO_STARTER_NAME:2400 · MERC_STARTER_NAME:2401 · CLOUD_DECK_SLOTS:2403 · MAX_DECK_SLOTS:2404 · buildStarterStore:2407 · sameCards:2429 · ensureStarterDecks:2433 · lastSanitizeMigrated:2460 · sanitizeDeckStore:2461 · loadDeckStore:2490 · cloudUserId:2504 · pushTimer:2505 · pushing:2506 · pushAgain:2507 · toCloudDecks:2508 · runPush:2509 · saveDeckStore:2522 · stopCloudSync:2527 · flushCloudSync:2529 · syncDeckStoreWithCloud:2540 · deckCardCount:2568 · deckProblem:2570 · buildDeckSelection:2578 · deckIdOfGeneral:2586 · DEFAULT_DECK_SELECTION:2587 · PlayerProfile:2596 · AVATAR_OPTIONS:2611 · avatarById:2619 · PROFILE_STORAGE_KEY:2621 · DEFAULT_PROFILE:2622 · loadProfile:2635 · formatCoroas:2649 · saveProfile:2654 · MODE_LABELS_PT:2663 · AvatarBadge:2673 · PlayerPlate:2688 · WINDOW_FRAME_PX:2717 · WINDOW_FONT_DECO:2718 · FramedWindow:2720 · WindowOverlay:2725 · WindowDivider:2748 · WindowTitle:2756 · Edges:2764 · ArtFrame:2765 · VLine:2786 · HLine:2789 · ArtChip:2794 · WindowOption:2800 · WindowText:2804 · WindowButton:2808 · AvatarPickerModal:2814 · ALLOW_PROFILE_RENAME:2851 · ProfileBar:2852 · ComingSoonModal:2973 · ONLINE_MODES:2989 · OnlineModeModal:2993 · TapPhase:3025 · MENU_CONFIRM_MS:3026 · useMenuTap:3027 · PlaqueSparks:3051 · PLAQUE_ASPECT:3070 · PLAQUE_CAP_CQW:3071 · MenuCard:3072 · MenuIconButton:3121 · MainMenu:3152 · InstallPrompt:3287 · DeckPickerModal:3323 · CARD_TYPE_ORDER:3354 · DeckSide:3355 · EditorSort:3356 · EDITOR_SORTS:3357 · EDITOR_MARGIN:3358 · EDITOR_FRAME:3359 · EDITOR_PAD:3360 · LIST_COLS:3363 · ROW_H:3364 · FULL_ART_TILE_SCALE:3365 · DeckEditor:3367 · ShopPhase:3930 · NpcMood:3931 · BoosterDef:3932 · BOOSTERS:3934 · TEST_FREE_BOOSTERS:3942 · SHELF_ROWS:3943 · SHELF_COLS:3944 · BOOSTER_ASPECT:3945 · SHELF_X0:3950 · SHELF_X1:3951 · SHELF_PLANKS:3952 · SHELF_OVERVIEW:3953 · SHELF_CLOSEUP:3954 · NPC_LINES:3956 · SHOP_ART:3964 · rollBooster:3972 · BoosterArt:3987 · NpcArt:3999 · PACK_TEAR_Y:4006 · LID_SLICES:4007 · LidSlice:4013 · PackTear:4036 · PulledCard:4105 · pullBooster:4106 · PackOpening:4119 · OpenBoosterFromTable:4198 · ShopScreen:4204 · AuthBackdrop:4444 · GoogleMark:4465 · DiscordMark:4468 · AuthButton:4470 · authFieldClass:4476 · LoginScreen:4478 · NAME_RULE:4539 · ProfileSetupScreen:4541 · VolumeRow:4607 · ToggleRow:4616 · OptionsModal:4626 · SettingsModal:4659 · playCoinSfx:4696 · COIN_THICK:4724 · CoinFace:4725 · CoinRim:4734 · RemotePick:4753 · CoinToss:4754 · MatchSearchOverlay:4836 · OnlineSearchOverlay:4877 · LoadingScreen:4952 · App:5006 · IMMEDIATE_ZONE_LABEL:10533 · DragFinger:10538 · GuideInfo:10555 · DragGuide:10556 · arrivalDrops:10623 · arrivalListener:10625 · EmblemKind:10630 · EMBLEM_ART:10631 · SlotEmblem:10632 · RowPlaque:10645 · CardSlot:10657

Dentro de `App` (linhas 5006–10532), funções internas:
attackMarkFor:5249 · openCardPicker:5276 · spawnFloatingNumber:5312 · spawnFloatingNumberAtId:5327 · showBanner:5354 · announcePhase:5378 · announceTurnChange:5388 · beginFinalBlow:5421 · endFinalBlow:5422 · blowIsSoaked:5425 · handleInstallClick:5509 · shieldOverSlot:5565 · popOverSlot:5574 · burstAt:5589 · whenGlowDone:5614 · endGlow:5615 · startTriggerFx:5619 · holdForSeat:5647 · terrainFxPlayer:5675 · terrainFxNpc:5676 · fireImpactBurst:5691 · noteDragPlay:5714 · handFanMaxAngleRad:5784 · getHandArrivalPoint:5891 · getFanRotation:5911 · getFanLift:5918 · computeDrawOrigin:5933 · showToast:5948 · announceCardPlay:5954 · toCardData:6028 · shownStats:6043 · boardView:6054 · syncView:6059 · processEvents:6092 · cardOverlayFx:6302 · fxRectOf:6393 · fxEnvFor:6399 · pickTacticSpot:6416 · tacticFxOf:6425 · planFx:6429 · commitState:6459 · dispatchAction:6482 · wakeWaiter:6501 · publishClock:6502 · dispatchOnline:6504 · reconcileOwn:6540 · applyUnasked:6554 · ingestRows:6568 · chooseFirstOnline:6596 · absorbAct:6609 · refuseOwn:6618 · sendOnline:6630 · stopOnline:6644 · startOnlinePolling:6661 · nextOpponentAction:6679 · applyRewardToProfile:6706 · openPlayerPick:6713 · playerAct:6740 · maybePromptRelicMode:6751 · confirmRelicMode:6761 · confirmUpkeep:6772 · endTurnNow:6784 · sleep:6803 · tutCurrent:6815 · tutCanBack:6819 · tutShow:6824 · tutGo:6840 · tutNext:6848 · tutBack:6862 · tutMatches:6867 · tutSignal:6879 · tutFromAction:6884 · tutBeat:6891 · tutExit:6898 · tutFinish:6905 · startTutorial:6906 · tutLaunchDuel:6911 · tutCoinResolved:6913 · settleAmbush:6970 · startMatchIntro:7003 · continueMatchIntro:7022 · resetGame:7114 · startGame:7167 · startOnlineMatch:7174 · leaveMatch:7216 · handleCardClick:7571 · handlePlayCardButtonClick:7631 · abilityStepCandidates:7690 · abilityHasTargets:7693 · getPlayerCreatureAbilityKind:7715 · getCardVisualEl:7729 · triggerPunch:7814 · renderTravelingArrow:7852 · playPendingTactic:7879 · resolveOwnTacticTarget:7886 · resolveEnemyTacticTarget:7891 · toggleCardPickerSelection:7899 · abilityOf:7913 · nextAbilityStep:7915 · activateAbility:7921 · abilityStepSide:7935 · resolveAbilityTarget:7941 · pushAbilityPrompt:7978 · mine:7999 · foes:8000 · effectTargetKind:8003 · specSlots:8005 · tacticTargeting:8019 · sourceAt:8026 · cancelTargeting:8044 · playHandCardOnTarget:8047 · heldTop:8054 · slotUnder:8055 · clearDragOver:8064 · dragBlockReason:8066 · tapHandCard:8078 · beginPress:8086 · returnHeld:8103 · dropHeldCard:8112 · updateHeld:8141 · dropOk:8160 · handleSlotClick:8216 · handleNpcSlotClick:8396 · handleBackgroundClick:8462 · getTappedCardShift:8493 · getSelectedCardX:8503 · getSelectedCardY:8525 · getBoardAnimation:8549 · getPlayerSlotHint:8590 · isTacticTargetSlot:8609 · tacticTagFor:8617 · shakePx:8680 · boardHeightMultiplier:8693 · boardTopMargin:8694

## src/audioSettings.ts  (31 linhas)
Volumes de música e efeitos (localStorage).

AudioSettings:5 · KEY:6 · clamp01:7 · load:8 · state:14 · listeners:15 · getAudioSettings:16 · subscribeAudio:17 · setAudioSettings:18 · useAudioSettings:23 · curve:26 · sfxLevel:27 · musicLevel:28 · MUSIC_BASE_GAIN:30

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

## src/DesafiosScreen.tsx  (176 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

DzOpponent:12 · DzDeck:13 · PLACES:16 · LOCKED:22 · MAPPX:24 · PIN_SVG:25 · LAST_DECK_KEY:26 · DesafiosScreen:28

## src/Emotes.tsx  (186 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

GAP_MS:20 · SHOW_MS:22 · DECK_PHRASE:25 · deckOfGeneral:26 · PHRASES:30 · EMOJIS:34 · phraseText:37 · iconOf:38 · Bubble:40 · PUFFS:43 · Puff:44 · Emotes:53

## src/engine/ai.ts  (741 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:298 · upkeepAnswer:305 · wantedRelicMode:343 · aiLegacyAction:360 · AiStyle:475 · STYLE:476 · holdValue:479 · attackPotential:494 · sideValue:507 · upkeepBurden:524 · evalState:527 · sortedDesc:542 · forSearch:545 · candidates:555 · lastPhaseOf:627 · fingerprint:630 · Line:639 · SEARCH:641 · settle:644 · planTurn:655 · memo:696 · answerPending:698 · aiNextAction:717 · aiNextActionInner:722

## src/engine/catalog.ts  (493 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:254 · DeckRecipe:256 · DECK_RECIPES:258 · BALANCE:358 · BOOSTER_EXTRA:369 · STARTER_TRIM:377 · starterDeckCards:378 · LEGACY_STARTERS:386 · BY_NAME:409 · getCardDef:412 · registerCardDefs:414 · requireCardDef:415 · LEGACY_CARD_NAMES:422 · currentCardName:478 · currentNames:480 · isGeneralName:485 · TOKEN_DEFS:489

## src/engine/deck.ts  (31 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_DEFAULT_MAX_COPIES:8 · maxCopiesOf:9 · deckCardCount:11 · deckProblem:16

## src/engine/experimental.ts  (11 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

names:7 · MERCENARIOS_DEFS:8 · MERCENARIOS_RECIPE:9 · registerMercenarios:10

## src/engine/game.ts  (1089 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:159 · setWinner:176 · soak:185 · grantShield:197 · grantBlock:203 · damageSlot:211 · healSlot:227 · startTurn:237 · enterPreparation:295 · payUpkeep:302 · setRelicMode:335 · runTurnEnd:348 · endTurn:368 · assertCanAct:378 · Fx:389 · uniqueByName:396 · matchesFilter:397 · filterLabel:399 · specCandidates:402 · checkTarget:406 · activeTargets:424 · validateTargets:428 · checkVerb:435 · checkVerbTarget:449 · openPick:453 · runVerb:460 · runAbilities:619 · grantMovedBuff:625 · playCard:635 · useAbility:699 · choose:739 · attack:795 · respondAmbush:821 · resolveAmbushEffect:838 · resolveCombat:874 · move:952 · advance:985 · discardExcess:1007 · clone:1024 · applyAction:1026 · MatchLog:1068 · newMatchLog:1075 · replayMatch:1078

## src/engine/ranked.ts  (128 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LEAGUES:9 · League:10 · LEAGUE_NAMES:11 · POINTS_PER_DIVISION:14 · DIVISIONS:15 · POINTS_PER_LEAGUE:16 · MESTRE_FROM:17 · TOP_LEAGUE_SIZE:18 · PLACEMENT_MATCHES:20 · START_MMR:21 · START_POINTS:22 · RankedProfile:25 · newRankedProfile:26 · LeagueInfo:28 · leagueOf:30 · ROMAN:38 · leagueLabel:39 · leagueIndex:44 · RankedInput:47 · RankedResult:56 · expected:58 · clamp:59 · applyRankedMatch:61 · mmrWindow:93 · withTopLeague:96 · SEASON_DAYS:104 · SEASON_ONE_START:105 · DAY_MS:106 · SeasonInfo:107 · seasonAt:108 · RewardLeague:114 · SEASON_COROAS:115 · SeasonClose:117 · closeSeason:120

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (251 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · DRAW_PER_TURN:12 · GOLD_PER_TURN:13 · GOLD_FROM_ROUND:14 · COMBAT_FROM_ROUND:16 · HAND_LIMIT:17 · Unit:21 · Board:26 · phasesForTurn:29 · AUTOMATIC_PHASES:35 · restingPhasesForTurn:36 · abilitiesOf:41 · passivesOf:42 · abilityOn:43 · verbsOn:44 · hasVerb:45 · abilityPhases:48 · specCandidatesOn:51 · targetSpecsOf:66 · playTargetSpecs:67 · targetSpecOf:69 · needsHiddenInfo:73 · reinforceShield:78 · canReinforce:82 · AuraStat:85 · rowOk:86 · whoMatches:87 · auraTotal:97 · maxGeneralAbilityUses:119 · boardHasFlag:121 · upkeepOf:125 · relicModeOf:127 · canPlayInPhase:135 · isFrontline:139 · isBackline:140 · isUnitSlot:141 · getLaneCol:142 · getMoveRow:147 · getMoveCol:148 · areSlotsAdjacent:150 · adjacentSlots:154 · canReposition:158 · SOLDIER_TYPES:165 · CardDropKind:167 · getCardDropKind:170 · canPlaceInSlot:182 · isAliveAt:191 · isCardDamaged:193 · getAuraCombatHpBonus:196 · blocksAmbush:198 · locksGeneralOnDamage:200 · getMaxAttacksPerTurn:202 · getEffectiveAtk:206 · getIncomingDamageReduction:214 · getValidAttackTargets:218 · withEquippedWeapons:249

## src/engine/types.ts  (372 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:43 · Verb:47 · AbilityOn:86 · Ability:101 · Who:111 · Passive:121 · RelicMode:133 · CardDef:144 · Card:172 · SLOT_COUNT:203 · GENERAL_SLOT:204 · RELIC_SLOT:205 · TERRAIN_SLOT:206 · PlayerState:208 · TurnState:229 · PickMode:247 · Pending:250 · GameState:292 · Action:305 · GameEvent:332 · ActionResult:369

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

## tests/cost-audit.ts  (34 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

UNITS:10 · bandCost:11 · defs:12 · where:13 · rows:19 · off:32

## tests/deck-rules.ts  (63 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

passed:4 · test:5 · ok:6 · eq:7 · recipe:9 · listOf:11

## tests/edge-bundle.ts  (21 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

dir:10 · out:11 · cmd:12 · fresh:14 · committed:15

## tests/engine-rules.ts  (1316 linhas)
Um cenário por regra do jogo (npm test).

passed:19 · test:20 · eq:23 · ok:26 · n:29 · FIXTURE_HP:31 · mk:32 · fresh:37 · put:48 · give:49 · act:50 · refused:55 · names:60 · combat:61 · ambushSetup:433 · shielded:735 · aiTurn:796 · atkOf:974 · endTurnOf:975 · freshMerc:1177 · toNextTurn:1184

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
