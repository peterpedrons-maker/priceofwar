<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11002 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:260 · DRAW_FLIGHT_MS:286 · sfxVol:295 · playCardDrawSfx:296 · playCardPlaySfx:310 · playAttackSfx:317 · playEffectSfx:319 · playTacticSfx:320 · playSelectSfx:328 · bannerAudioCtx:340 · playBannerSfx:341 · playUiClickSfx:384 · playCardLiftSfx:393 · playDamageSfx:405 · playGeneralDamageSfx:410 · playDestroySfx:420 · playRevealGeneralSfx:422 · playWarHornSfx:428 · playBatalhaBannerSfx:433 · playBatalhaImpactSfx:441 · CardType:447 · CardData:449 · StatTone:497 · STAT_TONE_COLOR:498 · STAT_TONE_GRADIENT:499 · statsOf:504 · SlotHint:513 · getSlotHint:522 · RowRoleHint:528 · SOLDIER_CARD_TYPES:529 · getRowRoleHint:530 · ROW_ROLE_VIEW:537 · PHASE_BANNER_TEXT:561 · BATALHA_FALL_MS:583 · BATALHA_IMPACT_FRACTION:584 · BANNER_LEARN_COUNT:588 · bannersSeen:589 · PHASE_BANNER_STAGE_MS:590 · phaseBannerMs:591 · PHASE_BANNER_Y:599 · PHASE_BANNER_MOTION:600 · HIT_STOP_MS:611 · ATTACK_MS:614 · ATTACK_WINDUP_FRAC:615 · ATTACK_WINDUP_PX:616 · ATTACK_TILT_DEG:617 · IMPACT_MS:618 · TIME:621 · rangedKindOf:623 · FINAL_SLOW:624 · FINAL_INTRO_MS:625 · FINAL_FREEZE_MS:626 · FINAL_AFTER_MS:627 · SLASH_SPARK_ANGLES:630 · SlashEffect:639 · TargetKind:677 · TARGET_STYLE:678 · HUD_CARD_SCALE:684 · AmountBadge:688 · TargetingHud:705 · READY_COLORS:775 · SILHOUETTES:780 · silhouetteFor:785 · TriggerIcon:795 · FLIGHT_MS:809 · HELD_SCALE:810 · HELD_GAP:811 · TriggerBurst:812 · TriggerFloatLayer:833 · AbilityReadyGlow:850 · TutRect:881 · tutPct:882 · tutSilBox:883 · tutElRect:892 · tutPad:893 · tutUnion:894 · TutResolved:899 · TUT_EMPTY:900 · visibleHandCards:901 · resolveTutTarget:902 · TutorialStage:949 · SpriteOnce:993 · EffectIcon:1010 · EFFECT_ICONS:1011 · SpriteIcon:1019 · IconPop:1024 · SHIELD_SHEETS:1039 · GOLD_BUBBLE:1045 · ShieldAura:1046 · ShieldFxOnce:1066 · EquipFxLayer:1080 · PUNCH_FRAMES:1126 · PUNCH_FRAME_W:1127 · PunchFx:1129 · BURN_FRAMES:1165 · BurningCard:1167 · GraveyardPile:1217 · AtkBadge:1249 · NUMBER_KIND_OF:1261 · NUMBER_TIERS:1266 · damageTier:1272 · floatLife:1273 · FloatNumber:1274 · HpBadge:1322 · GoldBadge:1351 · GoldNumber:1380 · CardBack:1440 · CARD_THICKNESS_SHADOW:1478 · cardBoxShadow:1489 · cardGlowFilter:1490 · CARD_FACE_VARIANTS:1500 · NO_STAT_TYPES:1517 · templateForType:1518 · templateForTypeMini:1523 · FitText:1542 · KeywordPill:1617 · STAT_TOKEN:1631 · STAT_NUMBER_STYLE:1632 · StatSymbol:1633 · DamageSymbol:1640 · renderEffectText:1651 · FitEffectText:1670 · FULL_ART_PLATE_VARIANTS:1734 · FULL_ART_SIZE_FIX:1744 · CardFaceFullArt:1745 · FullArtMiniConfig:1866 · FULL_ART_MINI_CONFIG:1871 · usesLightBar:1899 · nameTextStyle:1900 · FULL_ART_MINI_DEFAULT:1903 · fullArtMiniConfigForType:1908 · CardFaceFullArtMini:1923 · CARD_FACE_MINI_STD_SCALE:1972 · CardFaceStandardMini:1973 · CardFace:2036 · BOARD_EXTERIOR_ART_URL:2148 · FIELD_PREVIEW_SCALE:2153 · BOARD_PREVIEW_SCALE:2171 · FAN_SPREAD_DEG:2174 · FAN_LIFT_PX:2175 · HAND_CARD_WIDTH:2176 · HAND_CARD_HEIGHT:2177 · HAND_CARD_STEP:2180 · HAND_FULL_SPREAD_COUNT:2183 · HAND_SELECT_SCALE:2186 · handStepFor:2187 · ART_BY_NAME:2194 · MERC_ART_FILES:2248 · artSlug:2249 · cardDataFromName:2255 · buildDeckCards:2259 · DECK_CAPITAO:2267 · DECK_CARDEAL:2268 · DECK_MERCENARIOS:2269 · DECKS:2273 · ALL_DECK_IDS:2296 · BOOSTER_POOLS:2299 · DECK_STORE_KEY:2314 · CARD_INSTANCES_BY_NAME:2316 · cardByName:2324 · isGeneralName:2325 · DeckSlot:2327 · DeckStore:2328 · DeckSelection:2330 · OnlineMatch:2336 · needsServer:2368 · visibleKey:2380 · countByName:2385 · CAPITAO_STARTER_NAME:2391 · MERC_STARTER_NAME:2392 · CLOUD_DECK_SLOTS:2394 · MAX_DECK_SLOTS:2395 · buildStarterStore:2398 · sameCards:2420 · ensureStarterDecks:2424 · lastSanitizeMigrated:2451 · sanitizeDeckStore:2452 · loadDeckStore:2481 · cloudUserId:2495 · pushTimer:2496 · pushing:2497 · pushAgain:2498 · toCloudDecks:2499 · runPush:2500 · saveDeckStore:2513 · stopCloudSync:2518 · flushCloudSync:2520 · syncDeckStoreWithCloud:2531 · deckCardCount:2559 · deckProblem:2561 · buildDeckSelection:2567 · deckIdOfGeneral:2575 · DEFAULT_DECK_SELECTION:2576 · PlayerProfile:2585 · AVATAR_OPTIONS:2600 · avatarById:2608 · PROFILE_STORAGE_KEY:2610 · DEFAULT_PROFILE:2611 · loadProfile:2624 · formatCoroas:2638 · saveProfile:2643 · MODE_LABELS_PT:2652 · AvatarBadge:2662 · WINDOW_FRAME_PX:2682 · WINDOW_FONT_DECO:2683 · FramedWindow:2685 · WindowOverlay:2690 · WindowDivider:2713 · WindowTitle:2721 · Edges:2729 · ArtFrame:2730 · VLine:2751 · HLine:2754 · ArtChip:2759 · WindowOption:2765 · WindowText:2769 · WindowButton:2773 · AvatarPickerModal:2779 · ALLOW_PROFILE_RENAME:2816 · ProfileBar:2817 · ComingSoonModal:2938 · ONLINE_MODES:2954 · OnlineModeModal:2958 · TapPhase:2990 · MENU_CONFIRM_MS:2991 · useMenuTap:2992 · PlaqueSparks:3016 · PLAQUE_ASPECT:3035 · PLAQUE_CAP_CQW:3036 · MenuCard:3037 · MenuIconButton:3086 · MainMenu:3117 · InstallPrompt:3245 · DeckPickerModal:3281 · CARD_TYPE_ORDER:3312 · DeckSide:3313 · EditorSort:3314 · EDITOR_SORTS:3315 · EDITOR_MARGIN:3316 · EDITOR_FRAME:3317 · EDITOR_PAD:3318 · LIST_COLS:3321 · ROW_H:3322 · FULL_ART_TILE_SCALE:3323 · DeckEditor:3325 · ShopPhase:3888 · NpcMood:3889 · BoosterDef:3890 · BOOSTERS:3892 · TEST_FREE_BOOSTERS:3900 · SHELF_ROWS:3901 · SHELF_COLS:3902 · BOOSTER_ASPECT:3903 · SHELF_X0:3908 · SHELF_X1:3909 · SHELF_PLANKS:3910 · SHELF_OVERVIEW:3911 · SHELF_CLOSEUP:3912 · NPC_LINES:3914 · SHOP_ART:3922 · rollBooster:3930 · BoosterArt:3945 · NpcArt:3957 · PACK_TEAR_Y:3964 · LID_SLICES:3965 · LidSlice:3971 · PackTear:3994 · PulledCard:4063 · pullBooster:4064 · PackOpening:4077 · OpenBoosterFromTable:4156 · ShopScreen:4162 · AuthBackdrop:4402 · GoogleMark:4423 · DiscordMark:4426 · AuthButton:4428 · authFieldClass:4434 · LoginScreen:4436 · NAME_RULE:4497 · ProfileSetupScreen:4499 · VolumeRow:4565 · ToggleRow:4574 · OptionsModal:4584 · SettingsModal:4617 · playCoinSfx:4654 · COIN_THICK:4682 · CoinFace:4683 · CoinRim:4692 · RemotePick:4711 · CoinToss:4712 · MatchSearchOverlay:4794 · OnlineSearchOverlay:4827 · LoadingScreen:4896 · App:4950 · IMMEDIATE_ZONE_LABEL:10464 · DragFinger:10469 · GuideInfo:10486 · DragGuide:10487 · arrivalDrops:10554 · arrivalListener:10556 · EmblemKind:10561 · EMBLEM_ART:10562 · SlotEmblem:10563 · RowPlaque:10576 · CardSlot:10588

Dentro de `App` (linhas 4950–10463), funções internas:
attackMarkFor:5193 · openCardPicker:5220 · spawnFloatingNumber:5256 · spawnFloatingNumberAtId:5271 · showBanner:5298 · announcePhase:5322 · announceTurnChange:5332 · beginFinalBlow:5365 · endFinalBlow:5366 · blowIsSoaked:5369 · handleInstallClick:5453 · shieldOverSlot:5509 · popOverSlot:5518 · burstAt:5533 · whenGlowDone:5558 · endGlow:5559 · startTriggerFx:5563 · holdForSeat:5591 · terrainFxPlayer:5619 · terrainFxNpc:5620 · fireImpactBurst:5635 · noteDragPlay:5658 · handFanMaxAngleRad:5728 · getHandArrivalPoint:5829 · getFanRotation:5849 · getFanLift:5856 · computeDrawOrigin:5871 · showToast:5886 · announceCardPlay:5892 · toCardData:5966 · shownStats:5981 · boardView:5992 · syncView:5997 · processEvents:6030 · cardOverlayFx:6240 · fxRectOf:6331 · fxEnvFor:6337 · pickTacticSpot:6354 · tacticFxOf:6363 · planFx:6367 · commitState:6397 · dispatchAction:6420 · wakeWaiter:6439 · publishClock:6440 · dispatchOnline:6442 · reconcileOwn:6478 · applyUnasked:6492 · ingestRows:6506 · chooseFirstOnline:6534 · absorbAct:6547 · refuseOwn:6556 · sendOnline:6568 · stopOnline:6582 · startOnlinePolling:6598 · nextOpponentAction:6616 · applyRewardToProfile:6643 · openPlayerPick:6650 · playerAct:6677 · maybePromptRelicMode:6688 · confirmRelicMode:6698 · confirmUpkeep:6709 · endTurnNow:6721 · sleep:6740 · tutCurrent:6752 · tutCanBack:6756 · tutShow:6761 · tutGo:6777 · tutNext:6785 · tutBack:6799 · tutMatches:6804 · tutSignal:6816 · tutFromAction:6821 · tutBeat:6828 · tutExit:6835 · tutFinish:6842 · startTutorial:6843 · tutLaunchDuel:6848 · tutCoinResolved:6850 · settleAmbush:6907 · startMatchIntro:6940 · continueMatchIntro:6959 · resetGame:7051 · startGame:7104 · startOnlineMatch:7111 · leaveMatch:7152 · handleCardClick:7493 · handlePlayCardButtonClick:7553 · abilityStepCandidates:7612 · abilityHasTargets:7615 · getPlayerCreatureAbilityKind:7637 · getCardVisualEl:7651 · triggerPunch:7736 · renderTravelingArrow:7774 · playPendingTactic:7801 · resolveOwnTacticTarget:7808 · resolveEnemyTacticTarget:7813 · toggleCardPickerSelection:7821 · abilityOf:7835 · nextAbilityStep:7837 · activateAbility:7843 · abilityStepSide:7857 · resolveAbilityTarget:7863 · pushAbilityPrompt:7900 · mine:7921 · foes:7922 · effectTargetKind:7925 · specSlots:7927 · tacticTargeting:7941 · sourceAt:7948 · cancelTargeting:7966 · playHandCardOnTarget:7969 · heldTop:7976 · slotUnder:7977 · clearDragOver:7986 · dragBlockReason:7988 · tapHandCard:8000 · beginPress:8008 · returnHeld:8025 · dropHeldCard:8034 · updateHeld:8063 · dropOk:8082 · handleSlotClick:8138 · handleNpcSlotClick:8318 · handleBackgroundClick:8384 · getTappedCardShift:8415 · getSelectedCardX:8425 · getSelectedCardY:8447 · getBoardAnimation:8471 · getPlayerSlotHint:8512 · isTacticTargetSlot:8531 · tacticTagFor:8539 · shakePx:8602 · boardHeightMultiplier:8615 · boardTopMargin:8616

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

## src/Emotes.tsx  (156 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

GAP_MS:20 · SHOW_MS:21 · DECK_PHRASE:24 · deckOfGeneral:25 · PHRASES:29 · EMOJIS:33 · phraseText:36 · iconOf:37 · Bubble:39 · Emotes:41

## src/engine/ai.ts  (739 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:297 · upkeepAnswer:304 · wantedRelicMode:342 · aiLegacyAction:359 · AiStyle:474 · STYLE:475 · holdValue:478 · attackPotential:493 · sideValue:506 · upkeepBurden:523 · evalState:526 · sortedDesc:541 · forSearch:544 · candidates:554 · lastPhaseOf:625 · fingerprint:628 · Line:637 · SEARCH:639 · settle:642 · planTurn:653 · memo:694 · answerPending:696 · aiNextAction:715 · aiNextActionInner:720

## src/engine/catalog.ts  (427 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:221 · DeckRecipe:223 · DECK_RECIPES:225 · BALANCE:308 · STARTER_TRIM:320 · starterDeckCards:321 · LEGACY_STARTERS:329 · BY_NAME:343 · getCardDef:346 · registerCardDefs:348 · requireCardDef:349 · LEGACY_CARD_NAMES:356 · currentCardName:412 · currentNames:414 · isGeneralName:419 · TOKEN_DEFS:423

## src/engine/deck.ts  (29 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_MAX_COPIES:7 · deckCardCount:9 · deckProblem:14

## src/engine/experimental.ts  (11 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

names:7 · MERCENARIOS_DEFS:8 · MERCENARIOS_RECIPE:9 · registerMercenarios:10

## src/engine/game.ts  (1084 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:159 · setWinner:176 · soak:185 · grantShield:197 · grantBlock:203 · damageSlot:211 · healSlot:227 · startTurn:237 · enterPreparation:294 · payUpkeep:301 · setRelicMode:334 · runTurnEnd:347 · endTurn:367 · assertCanAct:377 · Fx:388 · uniqueByName:395 · matchesFilter:396 · filterLabel:398 · specCandidates:401 · checkTarget:405 · activeTargets:423 · validateTargets:427 · checkVerb:434 · checkVerbTarget:448 · openPick:452 · runVerb:459 · runAbilities:618 · grantMovedBuff:624 · playCard:634 · useAbility:698 · choose:738 · attack:794 · respondAmbush:820 · resolveAmbushEffect:837 · resolveCombat:870 · move:947 · advance:980 · discardExcess:1002 · clone:1019 · applyAction:1021 · MatchLog:1063 · newMatchLog:1070 · replayMatch:1073

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (251 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · DRAW_PER_TURN:12 · GOLD_PER_TURN:13 · GOLD_FROM_ROUND:14 · COMBAT_FROM_ROUND:16 · HAND_LIMIT:17 · Unit:21 · Board:26 · phasesForTurn:29 · AUTOMATIC_PHASES:35 · restingPhasesForTurn:36 · abilitiesOf:41 · passivesOf:42 · abilityOn:43 · verbsOn:44 · hasVerb:45 · abilityPhases:48 · specCandidatesOn:51 · targetSpecsOf:66 · playTargetSpecs:67 · targetSpecOf:69 · needsHiddenInfo:73 · reinforceShield:78 · canReinforce:82 · AuraStat:85 · rowOk:86 · whoMatches:87 · auraTotal:97 · maxGeneralAbilityUses:119 · boardHasFlag:121 · upkeepOf:125 · relicModeOf:127 · canPlayInPhase:135 · isFrontline:139 · isBackline:140 · isUnitSlot:141 · getLaneCol:142 · getMoveRow:147 · getMoveCol:148 · areSlotsAdjacent:150 · adjacentSlots:154 · canReposition:158 · SOLDIER_TYPES:165 · CardDropKind:167 · getCardDropKind:170 · canPlaceInSlot:182 · isAliveAt:191 · isCardDamaged:193 · getAuraCombatHpBonus:196 · blocksAmbush:198 · locksGeneralOnDamage:200 · getMaxAttacksPerTurn:202 · getEffectiveAtk:206 · getIncomingDamageReduction:214 · getValidAttackTargets:218 · withEquippedWeapons:249

## src/engine/types.ts  (370 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:43 · Verb:47 · AbilityOn:86 · Ability:101 · Who:111 · Passive:121 · RelicMode:133 · CardDef:144 · Card:170 · SLOT_COUNT:201 · GENERAL_SLOT:202 · RELIC_SLOT:203 · TERRAIN_SLOT:204 · PlayerState:206 · TurnState:227 · PickMode:245 · Pending:248 · GameState:290 · Action:303 · GameEvent:330 · ActionResult:367

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

## src/services/auth.ts  (130 linhas)
Login (convidado, Google, Discord, e-mail) via Supabase.

AuthProvider:9 · Session:10 · OAuthProvider:11 · URL:13 · KEY:14 · authMode:15 · LOCAL_SESSION_KEY:17 · clientPromise:19 · client:20 · getClient:29 · fromUser:31 · readLocal:36 · writeLocal:39 · localListeners:42 · emitLocal:43 · remoteListeners:46 · announceRemote:47 · getSession:49 · onSessionChange:56 · authErrorText:70 · signInOAuth:83 · signInEmail:90 · signInGuest:105 · authErrorDetail:120 · signOut:126

## src/services/cloud.ts  (95 linhas)
Salvar/ler coleção e decks na nuvem.

CloudProfile:5 · CloudResult:6 · COLUMNS:8 · fail:10 · fetchProfile:22 · usernameAvailable:30 · createProfile:38 · updateProfileFields:46 · CloudDeck:55 · CloudStore:56 · fetchStore:58 · pushStore:75

## src/services/online.ts  (110 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:31 · QueueResult:51 · ActResult:56 · call:61 · asActResult:78 · queueForMatch:83 · queueStatus:84 · cancelQueue:85 · sendAction:86 · tickMatch:88 · fetchResult:89 · fetchViews:95 · EmoteMsg:104 · EmoteResult:105 · asEmoteResult:106 · sendEmote:108 · fetchEmotes:109

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

## server/edge.ts  (33 linhas)
Entrada da Edge Function (gerada em supabase/functions/game).

cors:10 · json:15

## server/handler.ts  (388 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:16 · defaultConfig:28 · MatchInit:30 · EMOTE_CODE:56 · EMOTE_GAP_MS:57 · EMOTE_MAX_PER_MATCH:58 · GameRequest:60 · GameResponse:70 · BOT_PROFILE:78 · STALE_MATCH_MS:79 · BOT_STEP_LIMIT:80 · AUTO_STEP_LIMIT:81 · recipeDeck:83 · botDeckFor:85 · playerOf:86 · userOfSeat:87 · moverOf:88 · moverKey:89 · Work:94 · startWork:103 · applyStep:106 · runBot:129 · patchOf:140 · ensureRewards:147 · rewardOf:167 · enforceClock:172 · openMatch:210 · viewRowsOf:217 · initOf:219 · startMatch:234 · finishIfStale:260 · handleGame:270

## server/memoryDb.ts  (90 linhas)
Banco em memória (testes).

MemoryTables:5 · clone:10 · MemoryDb:12

## server/supabaseDb.ts  (98 linhas)
Banco no Supabase.

Client:7 · must:9 · viewToDb:14 · viewFromDb:17 · matchFromDb:18 · supabaseDb:20

## server/types.ts  (95 linhas)
Tipos do servidor e do banco.

DeckJson:6 · QueueRow:8 · StepRow:15 · ViewRow:23 · EndReason:34 · RewardRow:36 · MatchRow:48 · MatchPatch:67 · EmoteRow:70 · Db:72

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

## tests/edge-bundle.ts  (21 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

dir:10 · out:11 · cmd:12 · fresh:14 · committed:15

## tests/engine-rules.ts  (1229 linhas)
Um cenário por regra do jogo (npm test).

passed:19 · test:20 · eq:23 · ok:26 · n:29 · mk:30 · fresh:35 · put:46 · give:47 · act:48 · refused:53 · names:58 · combat:59 · ambushSetup:368 · shielded:658 · aiTurn:719 · atkOf:897 · endTurnOf:898 · freshMerc:1100 · toNextTurn:1107

## tests/engine-sim.ts  (185 linhas)
Partidas IA × IA com invariantes, repetição determinística e fuzz (npm test).

failures:13 · usage:14 · tactics:15 · discards:16 · check:17 · allCards:19 · invariants:27 · play:47 · decks:80 · finished:81 · winsByDeck:82 · rnd:111 · R:112 · accepted:113

## tests/match-report.ts  (164 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Turn:15 · Game:16 · blank:25 · SOLD:26 · material:27 · count:28 · SLOT:29 · play:31 · avg:86 · f:87 · main:89

## tests/mock-supabase.ts  (119 linhas)
Supabase falso para os testes online.

Row:10 · tables:11 · memory:12 · cfg:13 · b64:18 · users:19 · cors:20 · send:26 · readBody:30 · uidFrom:33

## tests/online-server.ts  (422 linhas)
Testes do servidor online (npm test).

passed:12 · test:13 · ok:16 · eq:17 · clock:19 · rngState:20 · cfg:21 · fresh:26 · deckOf:37 · matched:43 · userOf:45 · choose:47 · botMatch:49 · pvp:56 · drive:64

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
