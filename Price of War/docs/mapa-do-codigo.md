<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (10901 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:250 · DRAW_FLIGHT_MS:276 · sfxVol:285 · playCardDrawSfx:286 · playCardPlaySfx:300 · playAttackSfx:307 · playEffectSfx:309 · playTacticSfx:310 · playSelectSfx:318 · bannerAudioCtx:330 · playBannerSfx:331 · playUiClickSfx:374 · playCardLiftSfx:383 · playDamageSfx:395 · playGeneralDamageSfx:400 · playDestroySfx:410 · playRevealGeneralSfx:412 · playBatalhaBannerSfx:417 · playBatalhaImpactSfx:425 · CardType:431 · CardData:433 · StatTone:481 · STAT_TONE_COLOR:482 · STAT_TONE_GRADIENT:483 · statsOf:488 · SlotHint:497 · getSlotHint:506 · RowRoleHint:512 · SOLDIER_CARD_TYPES:513 · getRowRoleHint:514 · ROW_ROLE_VIEW:521 · PHASE_BANNER_TEXT:545 · BATALHA_FALL_MS:567 · BATALHA_IMPACT_FRACTION:568 · PHASE_BANNER_STAGE_MS:570 · PHASE_BANNER_DURATION_MS:571 · PHASE_BANNER_Y:579 · PHASE_BANNER_MOTION:580 · HIT_STOP_MS:591 · ATTACK_MS:594 · ATTACK_WINDUP_FRAC:595 · ATTACK_WINDUP_PX:596 · ATTACK_TILT_DEG:597 · IMPACT_MS:598 · TIME:601 · rangedKindOf:603 · FINAL_SLOW:604 · FINAL_INTRO_MS:605 · FINAL_FREEZE_MS:606 · FINAL_AFTER_MS:607 · SLASH_SPARK_ANGLES:610 · SlashEffect:619 · TargetKind:657 · TARGET_STYLE:658 · HUD_CARD_SCALE:664 · AmountBadge:668 · TargetingHud:685 · READY_COLORS:755 · SILHOUETTES:760 · silhouetteFor:765 · TriggerIcon:775 · FLIGHT_MS:789 · HELD_SCALE:790 · HELD_GAP:791 · TriggerBurst:792 · TriggerFloatLayer:813 · AbilityReadyGlow:830 · TutRect:861 · tutPct:862 · tutSilBox:863 · tutElRect:872 · tutPad:873 · tutUnion:874 · TutResolved:879 · TUT_EMPTY:880 · visibleHandCards:881 · resolveTutTarget:882 · TutorialStage:929 · SpriteOnce:973 · EffectIcon:990 · EFFECT_ICONS:991 · SpriteIcon:999 · IconPop:1004 · SHIELD_SHEETS:1019 · GOLD_BUBBLE:1025 · ShieldAura:1026 · ShieldFxOnce:1046 · EquipFxLayer:1060 · PUNCH_FRAMES:1106 · PUNCH_FRAME_W:1107 · PunchFx:1109 · BURN_FRAMES:1145 · BurningCard:1147 · GraveyardPile:1197 · AtkBadge:1228 · NUMBER_KIND_OF:1240 · NUMBER_TIERS:1245 · damageTier:1251 · floatLife:1252 · FloatNumber:1253 · HpBadge:1301 · GoldBadge:1330 · GoldNumber:1359 · CardBack:1419 · CARD_THICKNESS_SHADOW:1457 · cardBoxShadow:1468 · cardGlowFilter:1469 · CARD_FACE_VARIANTS:1479 · NO_STAT_TYPES:1496 · templateForType:1497 · templateForTypeMini:1502 · FitText:1521 · KeywordPill:1596 · STAT_TOKEN:1610 · STAT_NUMBER_STYLE:1611 · StatSymbol:1612 · DamageSymbol:1619 · renderEffectText:1630 · FitEffectText:1649 · FULL_ART_PLATE_VARIANTS:1713 · FULL_ART_SIZE_FIX:1723 · CardFaceFullArt:1724 · FullArtMiniConfig:1845 · FULL_ART_MINI_CONFIG:1850 · usesLightBar:1878 · nameTextStyle:1879 · FULL_ART_MINI_DEFAULT:1882 · fullArtMiniConfigForType:1887 · CardFaceFullArtMini:1902 · CARD_FACE_MINI_STD_SCALE:1951 · CardFaceStandardMini:1952 · CardFace:2015 · BOARD_EXTERIOR_ART_URL:2127 · FIELD_PREVIEW_SCALE:2132 · BOARD_PREVIEW_SCALE:2150 · FAN_SPREAD_DEG:2153 · FAN_LIFT_PX:2154 · HAND_CARD_WIDTH:2155 · HAND_CARD_HEIGHT:2156 · HAND_CARD_STEP:2159 · HAND_FULL_SPREAD_COUNT:2162 · HAND_SELECT_SCALE:2165 · handStepFor:2166 · ART_BY_NAME:2173 · MERC_ART_FILES:2227 · artSlug:2228 · cardDataFromName:2234 · buildDeckCards:2238 · DECK_CAPITAO:2246 · DECK_CARDEAL:2247 · DECK_MERCENARIOS:2248 · DECKS:2252 · ALL_DECK_IDS:2275 · BOOSTER_POOLS:2278 · DECK_STORE_KEY:2293 · CARD_INSTANCES_BY_NAME:2295 · cardByName:2303 · isGeneralName:2304 · DeckSlot:2306 · DeckStore:2307 · DeckSelection:2309 · OnlineMatch:2315 · needsServer:2347 · visibleKey:2359 · countByName:2364 · CAPITAO_STARTER_NAME:2370 · MERC_STARTER_NAME:2371 · CLOUD_DECK_SLOTS:2373 · MAX_DECK_SLOTS:2374 · buildStarterStore:2377 · sameCards:2399 · ensureStarterDecks:2403 · sanitizeDeckStore:2429 · loadDeckStore:2453 · cloudUserId:2467 · pushTimer:2468 · pushing:2469 · pushAgain:2470 · toCloudDecks:2471 · runPush:2472 · saveDeckStore:2485 · stopCloudSync:2490 · flushCloudSync:2492 · syncDeckStoreWithCloud:2503 · deckCardCount:2531 · deckProblem:2533 · buildDeckSelection:2539 · DEFAULT_DECK_SELECTION:2546 · PlayerProfile:2555 · AVATAR_OPTIONS:2570 · avatarById:2578 · PROFILE_STORAGE_KEY:2580 · DEFAULT_PROFILE:2581 · loadProfile:2594 · formatCoroas:2608 · saveProfile:2613 · MODE_LABELS_PT:2622 · AvatarBadge:2632 · WINDOW_FRAME_PX:2652 · WINDOW_FONT_DECO:2653 · FramedWindow:2655 · WindowOverlay:2680 · WindowDivider:2703 · WindowTitle:2711 · Edges:2729 · ArtFrame:2730 · VLine:2751 · HLine:2754 · ArtChip:2759 · WindowOption:2774 · WindowText:2782 · WindowButton:2786 · AvatarPickerModal:2801 · ALLOW_PROFILE_RENAME:2838 · ProfileBar:2839 · ComingSoonModal:2960 · ONLINE_MODES:2976 · OnlineModeModal:2980 · TapPhase:3018 · MENU_CONFIRM_MS:3019 · useMenuTap:3020 · PlaqueSparks:3044 · PLAQUE_ASPECT:3063 · PLAQUE_CAP_CQW:3064 · MenuCard:3065 · MenuIconButton:3114 · MainMenu:3145 · InstallPrompt:3273 · DeckPickerModal:3309 · CARD_TYPE_ORDER:3340 · DeckSide:3341 · EditorSort:3342 · EDITOR_SORTS:3343 · EDITOR_MARGIN:3344 · EDITOR_FRAME:3345 · EDITOR_PAD:3346 · LIST_COLS:3349 · ROW_H:3350 · FULL_ART_TILE_SCALE:3351 · DeckEditor:3353 · ShopPhase:3971 · NpcMood:3972 · BoosterDef:3973 · BOOSTERS:3975 · TEST_FREE_BOOSTERS:3983 · SHELF_ROWS:3984 · SHELF_COLS:3985 · BOOSTER_ASPECT:3986 · SHELF_X0:3991 · SHELF_X1:3992 · SHELF_PLANKS:3993 · SHELF_OVERVIEW:3994 · SHELF_CLOSEUP:3995 · NPC_LINES:3997 · SHOP_ART:4005 · rollBooster:4013 · BoosterArt:4028 · NpcArt:4040 · PACK_TEAR_Y:4047 · LID_SLICES:4048 · LidSlice:4054 · PackTear:4077 · PulledCard:4146 · pullBooster:4147 · PackOpening:4160 · OpenBoosterFromTable:4239 · ShopScreen:4245 · AuthBackdrop:4485 · GoogleMark:4505 · DiscordMark:4508 · AuthButton:4514 · authFieldClass:4524 · LoginScreen:4526 · NAME_RULE:4587 · ProfileSetupScreen:4589 · VolumeRow:4655 · ToggleRow:4669 · OptionsModal:4681 · SettingsModal:4710 · playCoinSfx:4747 · COIN_THICK:4775 · CoinFace:4776 · CoinRim:4785 · RemotePick:4804 · CoinToss:4805 · MatchSearchOverlay:4887 · OnlineSearchOverlay:4920 · LoadingScreen:4989 · App:5043 · IMMEDIATE_ZONE_LABEL:10389 · DragFinger:10394 · GuideInfo:10411 · DragGuide:10412 · arrivalDrops:10479 · arrivalListener:10481 · EmblemKind:10486 · EMBLEM_ART:10487 · SlotEmblem:10488 · RowPlaque:10501 · CardSlot:10513

Dentro de `App` (linhas 5043–10388), funções internas:
openCardPicker:5297 · spawnFloatingNumber:5333 · spawnFloatingNumberAtId:5348 · showBanner:5374 · announcePhase:5393 · announceTurnChange:5401 · beginFinalBlow:5434 · endFinalBlow:5435 · blowIsSoaked:5438 · handleInstallClick:5522 · shieldOverSlot:5578 · popOverSlot:5587 · burstAt:5602 · whenGlowDone:5627 · endGlow:5628 · startTriggerFx:5632 · holdForSeat:5660 · fireImpactBurst:5693 · noteDragPlay:5716 · handFanMaxAngleRad:5786 · getHandArrivalPoint:5885 · getFanRotation:5905 · getFanLift:5912 · computeDrawOrigin:5927 · showToast:5942 · announceCardPlay:5948 · toCardData:6022 · shownStats:6037 · boardView:6048 · syncView:6053 · processEvents:6086 · fxRectOf:6299 · fxEnvFor:6305 · pickTacticSpot:6317 · planFx:6325 · commitState:6345 · dispatchAction:6368 · wakeWaiter:6387 · publishClock:6388 · dispatchOnline:6390 · reconcileOwn:6426 · applyUnasked:6440 · ingestRows:6454 · chooseFirstOnline:6482 · absorbAct:6495 · refuseOwn:6504 · sendOnline:6516 · stopOnline:6530 · startOnlinePolling:6545 · nextOpponentAction:6563 · applyRewardToProfile:6590 · openPlayerPick:6597 · playerAct:6624 · maybePromptRelicMode:6635 · confirmRelicMode:6645 · confirmUpkeep:6656 · endTurnNow:6668 · sleep:6687 · tutCurrent:6699 · tutCanBack:6703 · tutShow:6708 · tutGo:6724 · tutNext:6732 · tutBack:6746 · tutMatches:6751 · tutSignal:6763 · tutFromAction:6768 · tutBeat:6775 · tutExit:6782 · tutFinish:6789 · startTutorial:6790 · tutLaunchDuel:6795 · tutCoinResolved:6797 · settleAmbush:6854 · startMatchIntro:6887 · continueMatchIntro:6906 · resetGame:6998 · startGame:7051 · startOnlineMatch:7058 · leaveMatch:7098 · handleCardClick:7427 · handlePlayCardButtonClick:7487 · abilityStepCandidates:7555 · abilityHasTargets:7558 · getPlayerCreatureAbilityKind:7580 · getCardVisualEl:7594 · triggerPunch:7679 · renderTravelingArrow:7717 · playPendingTactic:7744 · resolveOwnTacticTarget:7751 · resolveEnemyTacticTarget:7756 · toggleCardPickerSelection:7764 · abilityOf:7778 · nextAbilityStep:7780 · activateAbility:7786 · abilityStepSide:7800 · resolveAbilityTarget:7806 · pushAbilityPrompt:7843 · mine:7864 · foes:7865 · effectTargetKind:7868 · specSlots:7870 · tacticTargeting:7884 · sourceAt:7891 · cancelTargeting:7909 · playHandCardOnTarget:7912 · heldTop:7919 · slotUnder:7920 · clearDragOver:7929 · dragBlockReason:7931 · tapHandCard:7943 · beginPress:7951 · returnHeld:7968 · dropHeldCard:7977 · updateHeld:8006 · dropOk:8025 · handleSlotClick:8081 · handleNpcSlotClick:8261 · handleBackgroundClick:8327 · getTappedCardShift:8358 · getSelectedCardX:8368 · getSelectedCardY:8390 · getBoardAnimation:8414 · getPlayerSlotHint:8455 · isTacticTargetSlot:8474 · tacticTagFor:8482 · shakePx:8545 · boardHeightMultiplier:8558 · boardTopMargin:8559

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

## src/combatFx.ts  (499 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

FxSide:24 · FxRect:25 · FxTarget:26 · FxEnv:28 · cv:37 · ctx:38 · RES:39 · fxs:40 · IMG:41 · SRC:42 · readyP:43 · preloadCombatFx:44 · resize:48 · ensureCanvas:49 · R:58 · clamp:59 · eo:60 · at:61 · add:62 · wait:63 · tick:65 · loop:76 · kick:80 · URLS:83 · play:84 · whoosh:85 · pick:88 · FS:95 · sprite:96 · explosion:103 · holy:111 · flash:114 · shock:118 · scorch:125 · puff:129 · dust:135 · debris:138 · sparks:147 · softAngle:154 · fly:165 · arcTangent:204 · stick:205 · ring:211 · burst:214 · sparksDir:219 · glint:226 · cleanHit:233 · lanceFade:237 · thunk:238 · rockBreak:244 · setScale:257 · pt:258 · tacPoint:259 · landingImpact:263 · fxLanding:294 · landTactic:301 · leaveTactic:313 · weaponReveal:316 · once:343 · fxTactic:347 · fxHero:413 · fxRanged:446

## src/engine/ai.ts  (736 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:297 · upkeepAnswer:304 · wantedRelicMode:340 · aiLegacyAction:356 · AiStyle:471 · STYLE:472 · holdValue:475 · attackPotential:490 · sideValue:503 · upkeepBurden:520 · evalState:523 · sortedDesc:538 · forSearch:541 · candidates:551 · lastPhaseOf:622 · fingerprint:625 · Line:634 · SEARCH:636 · settle:639 · planTurn:650 · memo:691 · answerPending:693 · aiNextAction:712 · aiNextActionInner:717

## src/engine/catalog.ts  (355 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:214 · DeckRecipe:216 · DECK_RECIPES:218 · BALANCE:301 · STARTER_TRIM:313 · starterDeckCards:314 · LEGACY_STARTERS:322 · BY_NAME:336 · getCardDef:339 · registerCardDefs:341 · requireCardDef:342 · isGeneralName:347 · TOKEN_DEFS:351

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

## src/engine/types.ts  (361 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:43 · Verb:47 · AbilityOn:83 · Ability:97 · Who:107 · Passive:117 · RelicMode:129 · CardDef:139 · Card:163 · SLOT_COUNT:194 · GENERAL_SLOT:195 · RELIC_SLOT:196 · TERRAIN_SLOT:197 · PlayerState:199 · TurnState:220 · PickMode:238 · Pending:241 · GameState:283 · Action:294 · GameEvent:321 · ActionResult:358

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

## src/sfx.ts  (75 linhas)
Efeitos sonoros curtos por Web Audio.

ctx:6 · buffers:7 · loading:8 · debugOn:10 · dbgMark:12 · getCtx:14 · preloadSfx:17 · playSfx:25 · playSfxAt:44 · playWhoosh:60

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

## server/handler.ts  (357 linhas)
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

## tests/engine-rules.ts  (1167 linhas)
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
