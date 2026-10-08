<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11039 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:250 · DRAW_FLIGHT_MS:276 · sfxVol:285 · playCardDrawSfx:286 · playCardPlaySfx:300 · playAttackSfx:307 · playEffectSfx:309 · playTacticSfx:310 · playSelectSfx:318 · bannerAudioCtx:330 · playBannerSfx:331 · playUiClickSfx:374 · playCardLiftSfx:383 · playDamageSfx:395 · playGeneralDamageSfx:400 · playDestroySfx:410 · playRevealGeneralSfx:412 · playBatalhaBannerSfx:417 · playBatalhaImpactSfx:425 · CardType:431 · CardData:433 · StatTone:481 · STAT_TONE_COLOR:482 · STAT_TONE_GRADIENT:483 · statsOf:488 · SlotHint:497 · getSlotHint:506 · RowRoleHint:512 · SOLDIER_CARD_TYPES:513 · getRowRoleHint:514 · ROW_ROLE_VIEW:521 · PHASE_BANNER_TEXT:545 · BATALHA_FALL_MS:567 · BATALHA_IMPACT_FRACTION:568 · BANNER_LEARN_COUNT:572 · bannersSeen:573 · PHASE_BANNER_STAGE_MS:574 · phaseBannerMs:575 · PHASE_BANNER_Y:583 · PHASE_BANNER_MOTION:584 · HIT_STOP_MS:595 · ATTACK_MS:598 · ATTACK_WINDUP_FRAC:599 · ATTACK_WINDUP_PX:600 · ATTACK_TILT_DEG:601 · IMPACT_MS:602 · TIME:605 · rangedKindOf:607 · FINAL_SLOW:608 · FINAL_INTRO_MS:609 · FINAL_FREEZE_MS:610 · FINAL_AFTER_MS:611 · SLASH_SPARK_ANGLES:614 · SlashEffect:623 · TargetKind:661 · TARGET_STYLE:662 · HUD_CARD_SCALE:668 · AmountBadge:672 · TargetingHud:689 · READY_COLORS:759 · SILHOUETTES:764 · silhouetteFor:769 · TriggerIcon:779 · FLIGHT_MS:793 · HELD_SCALE:794 · HELD_GAP:795 · TriggerBurst:796 · TriggerFloatLayer:817 · AbilityReadyGlow:834 · TutRect:865 · tutPct:866 · tutSilBox:867 · tutElRect:876 · tutPad:877 · tutUnion:878 · TutResolved:883 · TUT_EMPTY:884 · visibleHandCards:885 · resolveTutTarget:886 · TutorialStage:933 · SpriteOnce:977 · EffectIcon:994 · EFFECT_ICONS:995 · SpriteIcon:1003 · IconPop:1008 · SHIELD_SHEETS:1023 · GOLD_BUBBLE:1029 · ShieldAura:1030 · ShieldFxOnce:1050 · EquipFxLayer:1064 · PUNCH_FRAMES:1110 · PUNCH_FRAME_W:1111 · PunchFx:1113 · BURN_FRAMES:1149 · BurningCard:1151 · GraveyardPile:1201 · AtkBadge:1233 · NUMBER_KIND_OF:1245 · NUMBER_TIERS:1250 · damageTier:1256 · floatLife:1257 · FloatNumber:1258 · HpBadge:1306 · GoldBadge:1335 · GoldNumber:1364 · CardBack:1424 · CARD_THICKNESS_SHADOW:1462 · cardBoxShadow:1473 · cardGlowFilter:1474 · CARD_FACE_VARIANTS:1484 · NO_STAT_TYPES:1501 · templateForType:1502 · templateForTypeMini:1507 · FitText:1526 · KeywordPill:1601 · STAT_TOKEN:1615 · STAT_NUMBER_STYLE:1616 · StatSymbol:1617 · DamageSymbol:1624 · renderEffectText:1635 · FitEffectText:1654 · FULL_ART_PLATE_VARIANTS:1718 · FULL_ART_SIZE_FIX:1728 · CardFaceFullArt:1729 · FullArtMiniConfig:1850 · FULL_ART_MINI_CONFIG:1855 · usesLightBar:1883 · nameTextStyle:1884 · FULL_ART_MINI_DEFAULT:1887 · fullArtMiniConfigForType:1892 · CardFaceFullArtMini:1907 · CARD_FACE_MINI_STD_SCALE:1956 · CardFaceStandardMini:1957 · CardFace:2020 · BOARD_EXTERIOR_ART_URL:2132 · FIELD_PREVIEW_SCALE:2137 · BOARD_PREVIEW_SCALE:2155 · FAN_SPREAD_DEG:2158 · FAN_LIFT_PX:2159 · HAND_CARD_WIDTH:2160 · HAND_CARD_HEIGHT:2161 · HAND_CARD_STEP:2164 · HAND_FULL_SPREAD_COUNT:2167 · HAND_SELECT_SCALE:2170 · handStepFor:2171 · ART_BY_NAME:2178 · MERC_ART_FILES:2232 · artSlug:2233 · cardDataFromName:2239 · buildDeckCards:2243 · DECK_CAPITAO:2251 · DECK_CARDEAL:2252 · DECK_MERCENARIOS:2253 · DECKS:2257 · ALL_DECK_IDS:2280 · BOOSTER_POOLS:2283 · DECK_STORE_KEY:2298 · CARD_INSTANCES_BY_NAME:2300 · cardByName:2308 · isGeneralName:2309 · DeckSlot:2311 · DeckStore:2312 · DeckSelection:2314 · OnlineMatch:2320 · needsServer:2352 · visibleKey:2364 · countByName:2369 · CAPITAO_STARTER_NAME:2375 · MERC_STARTER_NAME:2376 · CLOUD_DECK_SLOTS:2378 · MAX_DECK_SLOTS:2379 · buildStarterStore:2382 · sameCards:2404 · ensureStarterDecks:2408 · lastSanitizeMigrated:2435 · sanitizeDeckStore:2436 · loadDeckStore:2465 · cloudUserId:2479 · pushTimer:2480 · pushing:2481 · pushAgain:2482 · toCloudDecks:2483 · runPush:2484 · saveDeckStore:2497 · stopCloudSync:2502 · flushCloudSync:2504 · syncDeckStoreWithCloud:2515 · deckCardCount:2543 · deckProblem:2545 · buildDeckSelection:2551 · DEFAULT_DECK_SELECTION:2558 · PlayerProfile:2567 · AVATAR_OPTIONS:2582 · avatarById:2590 · PROFILE_STORAGE_KEY:2592 · DEFAULT_PROFILE:2593 · loadProfile:2606 · formatCoroas:2620 · saveProfile:2625 · MODE_LABELS_PT:2634 · AvatarBadge:2644 · WINDOW_FRAME_PX:2664 · WINDOW_FONT_DECO:2665 · FramedWindow:2667 · WindowOverlay:2692 · WindowDivider:2715 · WindowTitle:2723 · Edges:2741 · ArtFrame:2742 · VLine:2763 · HLine:2766 · ArtChip:2771 · WindowOption:2786 · WindowText:2794 · WindowButton:2798 · AvatarPickerModal:2813 · ALLOW_PROFILE_RENAME:2850 · ProfileBar:2851 · ComingSoonModal:2972 · ONLINE_MODES:2988 · OnlineModeModal:2992 · TapPhase:3030 · MENU_CONFIRM_MS:3031 · useMenuTap:3032 · PlaqueSparks:3056 · PLAQUE_ASPECT:3075 · PLAQUE_CAP_CQW:3076 · MenuCard:3077 · MenuIconButton:3126 · MainMenu:3157 · InstallPrompt:3285 · DeckPickerModal:3321 · CARD_TYPE_ORDER:3352 · DeckSide:3353 · EditorSort:3354 · EDITOR_SORTS:3355 · EDITOR_MARGIN:3356 · EDITOR_FRAME:3357 · EDITOR_PAD:3358 · LIST_COLS:3361 · ROW_H:3362 · FULL_ART_TILE_SCALE:3363 · DeckEditor:3365 · ShopPhase:3983 · NpcMood:3984 · BoosterDef:3985 · BOOSTERS:3987 · TEST_FREE_BOOSTERS:3995 · SHELF_ROWS:3996 · SHELF_COLS:3997 · BOOSTER_ASPECT:3998 · SHELF_X0:4003 · SHELF_X1:4004 · SHELF_PLANKS:4005 · SHELF_OVERVIEW:4006 · SHELF_CLOSEUP:4007 · NPC_LINES:4009 · SHOP_ART:4017 · rollBooster:4025 · BoosterArt:4040 · NpcArt:4052 · PACK_TEAR_Y:4059 · LID_SLICES:4060 · LidSlice:4066 · PackTear:4089 · PulledCard:4158 · pullBooster:4159 · PackOpening:4172 · OpenBoosterFromTable:4251 · ShopScreen:4257 · AuthBackdrop:4497 · GoogleMark:4517 · DiscordMark:4520 · AuthButton:4526 · authFieldClass:4536 · LoginScreen:4538 · NAME_RULE:4599 · ProfileSetupScreen:4601 · VolumeRow:4667 · ToggleRow:4681 · OptionsModal:4693 · SettingsModal:4722 · playCoinSfx:4759 · COIN_THICK:4787 · CoinFace:4788 · CoinRim:4797 · RemotePick:4816 · CoinToss:4817 · MatchSearchOverlay:4899 · OnlineSearchOverlay:4932 · LoadingScreen:5001 · App:5055 · IMMEDIATE_ZONE_LABEL:10527 · DragFinger:10532 · GuideInfo:10549 · DragGuide:10550 · arrivalDrops:10617 · arrivalListener:10619 · EmblemKind:10624 · EMBLEM_ART:10625 · SlotEmblem:10626 · RowPlaque:10639 · CardSlot:10651

Dentro de `App` (linhas 5055–10526), funções internas:
openCardPicker:5310 · spawnFloatingNumber:5346 · spawnFloatingNumberAtId:5361 · showBanner:5388 · announcePhase:5409 · announceTurnChange:5417 · beginFinalBlow:5450 · endFinalBlow:5451 · blowIsSoaked:5454 · handleInstallClick:5538 · shieldOverSlot:5594 · popOverSlot:5603 · burstAt:5618 · whenGlowDone:5643 · endGlow:5644 · startTriggerFx:5648 · holdForSeat:5676 · fireImpactBurst:5709 · noteDragPlay:5732 · handFanMaxAngleRad:5802 · getHandArrivalPoint:5901 · getFanRotation:5921 · getFanLift:5928 · computeDrawOrigin:5943 · showToast:5958 · announceCardPlay:5964 · toCardData:6038 · shownStats:6053 · boardView:6064 · syncView:6069 · processEvents:6102 · cardOverlayFx:6312 · fxRectOf:6403 · fxEnvFor:6409 · pickTacticSpot:6426 · tacticFxOf:6435 · planFx:6439 · commitState:6469 · dispatchAction:6492 · wakeWaiter:6511 · publishClock:6512 · dispatchOnline:6514 · reconcileOwn:6550 · applyUnasked:6564 · ingestRows:6578 · chooseFirstOnline:6606 · absorbAct:6619 · refuseOwn:6628 · sendOnline:6640 · stopOnline:6654 · startOnlinePolling:6669 · nextOpponentAction:6687 · applyRewardToProfile:6714 · openPlayerPick:6721 · playerAct:6748 · maybePromptRelicMode:6759 · confirmRelicMode:6769 · confirmUpkeep:6780 · endTurnNow:6792 · sleep:6811 · tutCurrent:6823 · tutCanBack:6827 · tutShow:6832 · tutGo:6848 · tutNext:6856 · tutBack:6870 · tutMatches:6875 · tutSignal:6887 · tutFromAction:6892 · tutBeat:6899 · tutExit:6906 · tutFinish:6913 · startTutorial:6914 · tutLaunchDuel:6919 · tutCoinResolved:6921 · settleAmbush:6978 · startMatchIntro:7011 · continueMatchIntro:7030 · resetGame:7122 · startGame:7175 · startOnlineMatch:7182 · leaveMatch:7222 · handleCardClick:7551 · handlePlayCardButtonClick:7611 · abilityStepCandidates:7679 · abilityHasTargets:7682 · getPlayerCreatureAbilityKind:7704 · getCardVisualEl:7718 · triggerPunch:7803 · renderTravelingArrow:7841 · playPendingTactic:7868 · resolveOwnTacticTarget:7875 · resolveEnemyTacticTarget:7880 · toggleCardPickerSelection:7888 · abilityOf:7902 · nextAbilityStep:7904 · activateAbility:7910 · abilityStepSide:7924 · resolveAbilityTarget:7930 · pushAbilityPrompt:7967 · mine:7988 · foes:7989 · effectTargetKind:7992 · specSlots:7994 · tacticTargeting:8008 · sourceAt:8015 · cancelTargeting:8033 · playHandCardOnTarget:8036 · heldTop:8043 · slotUnder:8044 · clearDragOver:8053 · dragBlockReason:8055 · tapHandCard:8067 · beginPress:8075 · returnHeld:8092 · dropHeldCard:8101 · updateHeld:8130 · dropOk:8149 · handleSlotClick:8205 · handleNpcSlotClick:8385 · handleBackgroundClick:8451 · getTappedCardShift:8482 · getSelectedCardX:8492 · getSelectedCardY:8514 · getBoardAnimation:8538 · getPlayerSlotHint:8579 · isTacticTargetSlot:8598 · tacticTagFor:8606 · shakePx:8669 · boardHeightMultiplier:8682 · boardTopMargin:8683

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

## src/combatFx.ts  (1039 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

FxSide:47 · FxRect:48 · FxTarget:49 · FxEnv:51 · cv:65 · ctx:66 · RES:67 · fxs:68 · IMG:69 · SRC:70 · readyP:71 · preloadCombatFx:72 · resize:76 · ensureCanvas:77 · R:86 · clamp:87 · eo:88 · at:89 · add:90 · wait:91 · tick:93 · loop:104 · kick:108 · URLS:111 · play:112 · whoosh:113 · pick:116 · FS:123 · sprite:124 · explosion:131 · holy:139 · flash:142 · shock:146 · scorch:153 · puff:157 · dust:163 · debris:166 · sparks:175 · softAngle:182 · fly:193 · arcTangent:232 · stick:233 · ring:239 · burst:242 · sparksDir:247 · glint:254 · cleanHit:261 · lanceFade:265 · thunk:266 · rockBreak:272 · sheetXY:286 · playSheet:292 · ding:294 · coinAt:295 · coinFly:301 · coinBurst:310 · stonesFall:319 · drawBack:330 · flyBack:336 · setScale:341 · pt:342 · tacPoint:343 · landingImpact:347 · fxLanding:378 · landTactic:385 · leaveTactic:397 · weaponReveal:400 · once:427 · fxTactic:431 · fxHero:543 · fxRanged:576 · start:648 · toU:649 · fxUpkeep:653 · fxGoldGain:682 · fxRelicSoldo:695 · fxLoot:710 · fxPlaced:722 · fxReformar:749 · fxAmbush:761 · HOLY_SRC:795 · holyP:796 · loadHoly:797 · preloadHolyFx:798 · startHoly:799 · tween:800 · GOLDC:801 · twNow:804 · twMove:808 · twBurst:813 · charge:816 · risers:819 · groundGlow:822 · whiteFlash:826 · dimAt:830 · glowEl:837 · liftEl:840 · pilar:844 · sigilo:849 · cruzAt:853 · trompaAt:854 · almaAt:855 · heartAt:859 · godrays:862 · asasAt:869 · solAt:873 · portalAt:876 · orb:880 · cometaFly:888 · fxBencao:899 · fxCalice:926 · fxHospitalario:937 · fxNobre:963 · fxReforco:977 · fxComandante:990 · fxRetorno:1004 · fxAtirador:1029

## src/engine/ai.ts  (736 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:297 · upkeepAnswer:304 · wantedRelicMode:340 · aiLegacyAction:356 · AiStyle:471 · STYLE:472 · holdValue:475 · attackPotential:490 · sideValue:503 · upkeepBurden:520 · evalState:523 · sortedDesc:538 · forSearch:541 · candidates:551 · lastPhaseOf:622 · fingerprint:625 · Line:634 · SEARCH:636 · settle:639 · planTurn:650 · memo:691 · answerPending:693 · aiNextAction:712 · aiNextActionInner:717

## src/engine/catalog.ts  (388 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:214 · DeckRecipe:216 · DECK_RECIPES:218 · BALANCE:301 · STARTER_TRIM:313 · starterDeckCards:314 · LEGACY_STARTERS:322 · BY_NAME:336 · getCardDef:339 · registerCardDefs:341 · requireCardDef:342 · LEGACY_CARD_NAMES:349 · currentCardName:373 · currentNames:375 · isGeneralName:380 · TOKEN_DEFS:384

## src/engine/deck.ts  (29 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_MAX_COPIES:7 · deckCardCount:9 · deckProblem:14

## src/engine/experimental.ts  (11 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

names:7 · MERCENARIOS_DEFS:8 · MERCENARIOS_RECIPE:9 · registerMercenarios:10

## src/engine/game.ts  (1062 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:159 · setWinner:176 · soak:185 · grantShield:197 · grantBlock:203 · damageSlot:211 · healSlot:227 · startTurn:236 · enterPreparation:292 · payUpkeep:299 · setRelicMode:332 · runTurnEnd:345 · endTurn:365 · assertCanAct:375 · Fx:386 · uniqueByName:393 · matchesFilter:394 · filterLabel:396 · specCandidates:399 · checkTarget:403 · activeTargets:421 · validateTargets:425 · checkVerb:432 · checkVerbTarget:446 · openPick:450 · runVerb:457 · runAbilities:596 · grantMovedBuff:602 · playCard:612 · useAbility:676 · choose:716 · attack:772 · respondAmbush:798 · resolveAmbushEffect:815 · resolveCombat:848 · move:925 · advance:958 · discardExcess:980 · clone:997 · applyAction:999 · MatchLog:1041 · newMatchLog:1048 · replayMatch:1051

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (249 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · DRAW_PER_TURN:12 · GOLD_PER_TURN:13 · GOLD_FROM_ROUND:14 · COMBAT_FROM_ROUND:16 · HAND_LIMIT:17 · Unit:21 · Board:26 · phasesForTurn:29 · AUTOMATIC_PHASES:35 · restingPhasesForTurn:36 · abilitiesOf:41 · passivesOf:42 · abilityOn:43 · verbsOn:44 · hasVerb:45 · abilityPhases:48 · specCandidatesOn:51 · targetSpecsOf:66 · playTargetSpecs:67 · targetSpecOf:69 · needsHiddenInfo:73 · reinforceShield:78 · canReinforce:82 · AuraStat:85 · rowOk:86 · whoMatches:87 · auraTotal:97 · boardHasFlag:119 · upkeepOf:123 · relicModeOf:125 · canPlayInPhase:133 · isFrontline:137 · isBackline:138 · isUnitSlot:139 · getLaneCol:140 · getMoveRow:145 · getMoveCol:146 · areSlotsAdjacent:148 · adjacentSlots:152 · canReposition:156 · SOLDIER_TYPES:163 · CardDropKind:165 · getCardDropKind:168 · canPlaceInSlot:180 · isAliveAt:189 · isCardDamaged:191 · getAuraCombatHpBonus:194 · blocksAmbush:196 · locksGeneralOnDamage:198 · getMaxAttacksPerTurn:200 · getEffectiveAtk:204 · getIncomingDamageReduction:212 · getValidAttackTargets:216 · withEquippedWeapons:247

## src/engine/types.ts  (363 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:43 · Verb:47 · AbilityOn:83 · Ability:97 · Who:107 · Passive:117 · RelicMode:129 · CardDef:139 · Card:165 · SLOT_COUNT:196 · GENERAL_SLOT:197 · RELIC_SLOT:198 · TERRAIN_SLOT:199 · PlayerState:201 · TurnState:222 · PickMode:240 · Pending:243 · GameState:285 · Action:296 · GameEvent:323 · ActionResult:360

## src/engine/view.ts  (66 linhas)
O que cada jogador pode ver (esconde mão e baralho do outro).

hiddenCard:6 · redactPlayer:8 · redactFor:16 · redactEvents:30 · mirrorSeats:42 · mirrorEvents:58 · viewFor:64 · eventsFor:65

## src/gameSettings.ts  (27 linhas)
Opções do jogador (avisos de arrastar/tabuleiro), hook useGameSettings.

GameSettings:5 · KEY:9 · DEFAULTS:10 · load:11 · state:17 · listeners:18 · getGameSettings:19 · subscribeSettings:20 · setGameSettings:21 · useGameSettings:26

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

## src/services/online.ts  (102 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:31 · QueueResult:51 · ActResult:56 · call:61 · asActResult:78 · queueForMatch:83 · queueStatus:84 · cancelQueue:85 · sendAction:86 · tickMatch:88 · fetchResult:89 · fetchViews:95

## src/sfx.ts  (89 linhas)
Efeitos sonoros curtos por Web Audio.

ctx:6 · buffers:7 · loading:8 · debugOn:10 · dbgMark:12 · getCtx:14 · preloadSfx:17 · playSfx:25 · playSfxAt:44 · playWhoosh:60 · playDing:77

## src/triggers.ts  (41 linhas)
Ícones/nomes dos gatilhos (Convocação, Ofensiva, ...).

TRIGGER_ICON:13 · TRIGGER_GLOW:20 · triggerKeyOf:22 · triggerOf:25 · pulsing:32 · listeners:33 · emit:34 · pulseCard:35 · usePulse:39

## src/TurnTracker.tsx  (143 linhas)
Marcador de turno/fases na tela da partida.

TRACKER_PHASES:11 · MEDALLION_X:13 · BAND_TOP:15 · TRACKER_NAMES:17 · PALETTE:21 · PLATE_W:28 · END_W:30 · trackerScale:31 · useTrackerScale:32 · Props:42 · TurnTracker:60

## src/tutorial/script.ts  (240 linhas)
Dados do tutorial 1: partida fixa, jogadas do treinador, passos e falas.

TutorialMeta:8 · TUTORIALS:9 · Expr:16 · NPC_NAME:17 · Tgt:20 · Until:27 · Step:36 · CHAPTERS:54 · HAND_P:57 · PILE_P:58 · HAND_E:59 · PILE_E:60 · uid:62 · fresh:63 · createTutorialMatch:69 · EnemyMove:80 · ADV:81 · ENEMY_SCRIPT:82 · nextEnemyAction:88 · PlayerMove:99 · PLAYER_PATH:100 · G:108 · E:109 · row:110 · TRACKER:111 · GOLD_ME:112 · GOLD_FOE:113 · INTRO_LINES:116 · COIN_STEP:123 · STEPS:125 · R:193 · BEATS:194 · OUTRO:207 · playTutorialForTest:213

## src/tutorial/ui.tsx  (266 linhas)
Peças visuais do tutorial: Aldric, mãozinha, escurecimento com buracos, lista.

NPC_ART:13 · npcArt:14 · GLYPH:15 · FONT_HEAD:17 · FONT_BODY:18 · NpcPortrait:20 · NpcPhoto:52 · PanelProps:78 · NpcPanel:88 · TapHand:136 · Hole:148 · roundedRectUri:154 · Spotlight:157 · DONE_KEY:193 · loadTutorialsDone:194 · markTutorialDone:195 · TutorialList:197 · TutorialIntro:234

## src/ui/ThinFrame.tsx  (48 linhas)
Moldura fina reutilizável.

ThinFrame:8 · GameBox:29 · TONES:33 · TEXT:34 · GameButton:36

## server/edge.ts  (33 linhas)
Entrada da Edge Function (gerada em supabase/functions/game).

cors:10 · json:15

## server/handler.ts  (359 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:16 · defaultConfig:28 · MatchInit:30 · GameRequest:55 · GameResponse:63 · BOT_PROFILE:70 · STALE_MATCH_MS:71 · BOT_STEP_LIMIT:72 · AUTO_STEP_LIMIT:73 · recipeDeck:75 · botDeckFor:77 · playerOf:78 · userOfSeat:79 · moverOf:80 · moverKey:81 · Work:86 · startWork:95 · applyStep:98 · runBot:121 · patchOf:132 · ensureRewards:139 · rewardOf:159 · enforceClock:164 · openMatch:202 · viewRowsOf:209 · initOf:211 · startMatch:226 · finishIfStale:252 · handleGame:262

## server/memoryDb.ts  (80 linhas)
Banco em memória (testes).

MemoryTables:5 · clone:10 · MemoryDb:12

## server/supabaseDb.ts  (90 linhas)
Banco no Supabase.

Client:7 · must:9 · viewToDb:14 · viewFromDb:17 · matchFromDb:18 · supabaseDb:20

## server/types.ts  (90 linhas)
Tipos do servidor e do banco.

DeckJson:6 · QueueRow:8 · StepRow:15 · ViewRow:23 · EndReason:34 · RewardRow:36 · MatchRow:48 · MatchPatch:67 · Db:69

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

## tests/engine-rules.ts  (1175 linhas)
Um cenário por regra do jogo (npm test).

passed:11 · test:12 · eq:15 · ok:18 · n:21 · mk:22 · fresh:27 · put:38 · give:39 · act:40 · refused:45 · names:50 · combat:51 · ambushSetup:360 · shielded:646 · aiTurn:707 · atkOf:885 · endTurnOf:886 · freshMerc:1088 · toNextTurn:1095

## tests/engine-sim.ts  (185 linhas)
Partidas IA × IA com invariantes, repetição determinística e fuzz (npm test).

failures:13 · usage:14 · tactics:15 · discards:16 · check:17 · allCards:19 · invariants:27 · play:47 · decks:80 · finished:81 · winsByDeck:82 · rnd:111 · R:112 · accepted:113

## tests/match-report.ts  (164 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Turn:15 · Game:16 · blank:25 · SOLD:26 · material:27 · count:28 · SLOT:29 · play:31 · avg:86 · f:87 · main:89

## tests/mock-supabase.ts  (119 linhas)
Supabase falso para os testes online.

Row:10 · tables:11 · memory:12 · cfg:13 · b64:18 · users:19 · cors:20 · send:26 · readBody:30 · uidFrom:33

## tests/online-server.ts  (388 linhas)
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
