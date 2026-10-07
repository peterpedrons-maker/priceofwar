<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (10672 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:244 · DRAW_FLIGHT_MS:270 · sfxVol:279 · playCardDrawSfx:280 · playCardPlaySfx:294 · playAttackSfx:301 · playEffectSfx:303 · playTacticSfx:304 · playSelectSfx:312 · bannerAudioCtx:324 · playBannerSfx:325 · playUiClickSfx:368 · playCardLiftSfx:377 · playDamageSfx:389 · playGeneralDamageSfx:394 · playDestroySfx:404 · playRevealGeneralSfx:406 · playBatalhaBannerSfx:411 · playBatalhaImpactSfx:419 · CardType:425 · CardData:427 · StatTone:473 · STAT_TONE_COLOR:474 · STAT_TONE_GRADIENT:475 · statsOf:480 · SlotHint:489 · getSlotHint:498 · RowRoleHint:504 · SOLDIER_CARD_TYPES:505 · getRowRoleHint:506 · ROW_ROLE_VIEW:513 · PHASE_BANNER_TEXT:537 · BATALHA_FALL_MS:559 · BATALHA_IMPACT_FRACTION:560 · PHASE_BANNER_STAGE_MS:562 · PHASE_BANNER_DURATION_MS:563 · PHASE_BANNER_Y:571 · PHASE_BANNER_MOTION:572 · HIT_STOP_MS:583 · ATTACK_MS:586 · ATTACK_WINDUP_FRAC:587 · ATTACK_WINDUP_PX:588 · ATTACK_TILT_DEG:589 · IMPACT_MS:590 · TIME:593 · rangedKindOf:595 · FINAL_SLOW:596 · FINAL_INTRO_MS:597 · FINAL_FREEZE_MS:598 · FINAL_AFTER_MS:599 · SLASH_SPARK_ANGLES:602 · SlashEffect:611 · TargetKind:649 · TARGET_STYLE:650 · HUD_CARD_SCALE:656 · AmountBadge:660 · TargetingHud:677 · READY_COLORS:747 · SILHOUETTES:752 · silhouetteFor:757 · TriggerIcon:767 · FLIGHT_MS:781 · HELD_SCALE:782 · HELD_GAP:783 · TriggerBurst:784 · TriggerFloatLayer:805 · AbilityReadyGlow:822 · TutRect:853 · tutPct:854 · tutSilBox:855 · tutElRect:864 · tutPad:865 · tutUnion:866 · TutResolved:871 · TUT_EMPTY:872 · visibleHandCards:873 · resolveTutTarget:874 · TutorialStage:921 · SpriteOnce:965 · EffectIcon:982 · EFFECT_ICONS:983 · SpriteIcon:991 · IconPop:996 · SHIELD_SHEETS:1011 · GOLD_BUBBLE:1017 · ShieldAura:1018 · ShieldFxOnce:1038 · EquipFxLayer:1052 · PUNCH_FRAMES:1098 · PUNCH_FRAME_W:1099 · PunchFx:1101 · BURN_FRAMES:1137 · BurningCard:1139 · GraveyardPile:1189 · AtkBadge:1215 · NUMBER_KIND_OF:1227 · NUMBER_TIERS:1232 · damageTier:1238 · floatLife:1239 · FloatNumber:1240 · HpBadge:1288 · GoldBadge:1317 · GoldNumber:1346 · CardBack:1406 · CARD_THICKNESS_SHADOW:1444 · cardBoxShadow:1455 · cardGlowFilter:1456 · CARD_FACE_VARIANTS:1466 · NO_STAT_TYPES:1483 · templateForType:1484 · templateForTypeMini:1489 · FitText:1508 · KeywordPill:1583 · STAT_TOKEN:1597 · STAT_NUMBER_STYLE:1598 · StatSymbol:1599 · DamageSymbol:1606 · renderEffectText:1617 · FitEffectText:1636 · FULL_ART_PLATE_VARIANTS:1700 · FULL_ART_SIZE_FIX:1710 · CardFaceFullArt:1711 · FullArtMiniConfig:1832 · FULL_ART_MINI_CONFIG:1837 · usesLightBar:1865 · nameTextStyle:1866 · FULL_ART_MINI_DEFAULT:1869 · fullArtMiniConfigForType:1874 · CardFaceFullArtMini:1889 · CARD_FACE_MINI_STD_SCALE:1938 · CardFaceStandardMini:1939 · CardFace:2002 · BOARD_EXTERIOR_ART_URL:2114 · FIELD_PREVIEW_SCALE:2119 · BOARD_PREVIEW_SCALE:2137 · FAN_SPREAD_DEG:2140 · FAN_LIFT_PX:2141 · HAND_CARD_WIDTH:2142 · HAND_CARD_HEIGHT:2143 · HAND_CARD_STEP:2146 · HAND_FULL_SPREAD_COUNT:2149 · HAND_SELECT_SCALE:2152 · handStepFor:2153 · ART_BY_NAME:2160 · cardDataFromName:2213 · buildDeckCards:2217 · DECK_CAPITAO:2225 · DECK_CARDEAL:2226 · DECKS:2230 · BOOSTER_POOLS:2248 · DECK_STORE_KEY:2263 · CARD_INSTANCES_BY_NAME:2265 · cardByName:2273 · isGeneralName:2274 · DeckSlot:2276 · DeckStore:2277 · DeckSelection:2279 · OnlineMatch:2285 · needsServer:2317 · visibleKey:2328 · countByName:2333 · CAPITAO_STARTER_NAME:2339 · buildStarterStore:2342 · sameCards:2361 · ensureStarterDecks:2365 · sanitizeDeckStore:2386 · loadDeckStore:2410 · cloudUserId:2424 · pushTimer:2425 · pushing:2426 · pushAgain:2427 · toCloudDecks:2428 · runPush:2429 · saveDeckStore:2442 · stopCloudSync:2447 · flushCloudSync:2449 · syncDeckStoreWithCloud:2460 · deckCardCount:2488 · deckProblem:2490 · buildDeckSelection:2496 · DEFAULT_DECK_SELECTION:2502 · PlayerProfile:2511 · AVATAR_OPTIONS:2526 · avatarById:2534 · PROFILE_STORAGE_KEY:2536 · DEFAULT_PROFILE:2537 · loadProfile:2550 · formatCoroas:2564 · saveProfile:2569 · MODE_LABELS_PT:2578 · AvatarBadge:2588 · WINDOW_FRAME_PX:2608 · WINDOW_FONT_DECO:2609 · FramedWindow:2611 · WindowOverlay:2636 · WindowDivider:2659 · WindowTitle:2667 · Edges:2685 · ArtFrame:2686 · VLine:2707 · HLine:2710 · ArtChip:2715 · WindowOption:2730 · WindowText:2738 · WindowButton:2742 · AvatarPickerModal:2757 · ALLOW_PROFILE_RENAME:2794 · ProfileBar:2795 · ComingSoonModal:2916 · ONLINE_MODES:2932 · OnlineModeModal:2936 · TapPhase:2974 · MENU_CONFIRM_MS:2975 · useMenuTap:2976 · PlaqueSparks:3000 · PLAQUE_ASPECT:3019 · PLAQUE_CAP_CQW:3020 · MenuCard:3021 · MenuIconButton:3070 · MainMenu:3101 · InstallPrompt:3229 · DeckPickerModal:3265 · CARD_TYPE_ORDER:3296 · DeckSide:3297 · EditorSort:3298 · EDITOR_SORTS:3299 · EDITOR_MARGIN:3300 · EDITOR_FRAME:3301 · EDITOR_PAD:3302 · LIST_COLS:3305 · ROW_H:3306 · FULL_ART_TILE_SCALE:3307 · DeckEditor:3309 · ShopPhase:3927 · NpcMood:3928 · BoosterDef:3929 · BOOSTERS:3931 · TEST_FREE_BOOSTERS:3938 · SHELF_ROWS:3939 · SHELF_COLS:3940 · BOOSTER_ASPECT:3941 · SHELF_X0:3946 · SHELF_X1:3947 · SHELF_PLANKS:3948 · SHELF_OVERVIEW:3949 · SHELF_CLOSEUP:3950 · NPC_LINES:3952 · SHOP_ART:3960 · rollBooster:3968 · BoosterArt:3983 · NpcArt:3995 · PACK_TEAR_Y:4002 · LID_SLICES:4003 · LidSlice:4009 · PackTear:4032 · PulledCard:4101 · pullBooster:4102 · PackOpening:4115 · OpenBoosterFromTable:4194 · ShopScreen:4200 · AuthBackdrop:4440 · GoogleMark:4460 · DiscordMark:4463 · AuthButton:4469 · authFieldClass:4479 · LoginScreen:4481 · NAME_RULE:4542 · ProfileSetupScreen:4544 · VolumeRow:4610 · ToggleRow:4624 · OptionsModal:4636 · SettingsModal:4665 · playCoinSfx:4702 · COIN_THICK:4730 · CoinFace:4731 · CoinRim:4740 · RemotePick:4759 · CoinToss:4760 · MatchSearchOverlay:4842 · OnlineSearchOverlay:4875 · LoadingScreen:4944 · App:4998 · IMMEDIATE_ZONE_LABEL:10222 · DragFinger:10227 · GuideInfo:10244 · DragGuide:10245 · arrivalDrops:10312 · arrivalListener:10314 · CardSlot:10316

Dentro de `App` (linhas 4998–10221), funções internas:
openCardPicker:5252 · spawnFloatingNumber:5288 · spawnFloatingNumberAtId:5303 · showBanner:5329 · announcePhase:5348 · announceTurnChange:5356 · beginFinalBlow:5389 · endFinalBlow:5390 · blowIsSoaked:5393 · handleInstallClick:5471 · shieldOverSlot:5527 · popOverSlot:5536 · burstAt:5551 · whenGlowDone:5576 · endGlow:5577 · startTriggerFx:5581 · holdForSeat:5609 · fireImpactBurst:5642 · noteDragPlay:5665 · handFanMaxAngleRad:5735 · getHandArrivalPoint:5834 · getFanRotation:5854 · getFanLift:5861 · computeDrawOrigin:5876 · showToast:5891 · announceCardPlay:5897 · toCardData:5971 · shownStats:5986 · boardView:5997 · syncView:6002 · processEvents:6033 · fxRectOf:6238 · fxEnvFor:6244 · pickTacticSpot:6256 · planFx:6264 · commitState:6284 · dispatchAction:6307 · wakeWaiter:6326 · publishClock:6327 · dispatchOnline:6329 · reconcileOwn:6365 · applyUnasked:6379 · ingestRows:6393 · chooseFirstOnline:6421 · absorbAct:6434 · refuseOwn:6443 · sendOnline:6455 · stopOnline:6469 · startOnlinePolling:6484 · nextOpponentAction:6502 · applyRewardToProfile:6529 · openPlayerPick:6536 · playerAct:6563 · endTurnNow:6575 · sleep:6593 · tutCurrent:6605 · tutCanBack:6609 · tutShow:6614 · tutGo:6630 · tutNext:6638 · tutBack:6652 · tutMatches:6657 · tutSignal:6669 · tutFromAction:6674 · tutBeat:6681 · tutExit:6688 · tutFinish:6695 · startTutorial:6696 · tutLaunchDuel:6701 · tutCoinResolved:6703 · settleAmbush:6760 · startMatchIntro:6793 · continueMatchIntro:6812 · resetGame:6904 · startGame:6957 · startOnlineMatch:6964 · leaveMatch:7004 · handleCardClick:7333 · handlePlayCardButtonClick:7393 · abilityStepCandidates:7461 · abilityHasTargets:7464 · getPlayerCreatureAbilityKind:7486 · getCardVisualEl:7500 · triggerPunch:7585 · renderTravelingArrow:7623 · playPendingTactic:7650 · resolveOwnTacticTarget:7657 · resolveEnemyTacticTarget:7662 · toggleCardPickerSelection:7670 · abilityOf:7684 · nextAbilityStep:7686 · activateAbility:7692 · abilityStepSide:7706 · resolveAbilityTarget:7712 · pushAbilityPrompt:7749 · mine:7770 · foes:7771 · effectTargetKind:7774 · specSlots:7776 · tacticTargeting:7790 · sourceAt:7797 · cancelTargeting:7815 · playHandCardOnTarget:7818 · heldTop:7825 · slotUnder:7826 · clearDragOver:7835 · dragBlockReason:7837 · tapHandCard:7849 · beginPress:7857 · returnHeld:7874 · dropHeldCard:7883 · updateHeld:7912 · dropOk:7931 · handleSlotClick:7987 · handleNpcSlotClick:8167 · handleBackgroundClick:8233 · getTappedCardShift:8264 · getSelectedCardX:8274 · getSelectedCardY:8296 · getBoardAnimation:8320 · getPlayerSlotHint:8361 · isTacticTargetSlot:8380 · tacticTagFor:8388 · shakePx:8451 · boardHeightMultiplier:8464 · boardTopMargin:8465

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

## src/engine/ai.ts  (644 linhas)
A IA do adversário: planeja o turno simulando no próprio motor (aiNextAction) e a IA antiga (aiLegacyAction).

Rand:18 · randomOf:20 · weakest:22 · UNIT_SLOTS:25 · isSoldier:26 · cardValue:29 · unitWorth:37 · isRangedType:42 · boardScore:44 · swapped:79 · MoveOption:85 · moveOptions:88 · bestMove:112 · planGain:119 · bestSlot:147 · attackScore:162 · matches:182 · tacticPlay:185 · abilityAction:274 · bestIds:297 · aiLegacyAction:300 · holdValue:413 · attackPotential:416 · sideValue:429 · evalState:443 · sortedDesc:457 · forSearch:460 · candidates:470 · lastPhaseOf:541 · fingerprint:544 · Line:553 · SEARCH:555 · settle:558 · planTurn:569 · memo:610 · answerPending:612 · aiNextAction:630

## src/engine/catalog.ts  (277 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:155 · DeckRecipe:157 · DECK_RECIPES:159 · BALANCE:227 · STARTER_TRIM:239 · starterDeckCards:240 · LEGACY_STARTERS:248 · BY_NAME:260 · getCardDef:263 · requireCardDef:264 · isGeneralName:269 · TOKEN_DEFS:273

## src/engine/deck.ts  (29 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_MAX_COPIES:7 · deckCardCount:9 · deckProblem:14

## src/engine/game.ts  (986 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:148 · setWinner:165 · soak:174 · grantShield:186 · grantBlock:192 · damageSlot:200 · healSlot:216 · startTurn:225 · runTurnEnd:273 · endTurn:293 · assertCanAct:303 · Fx:314 · uniqueByName:321 · matchesFilter:322 · filterLabel:324 · specCandidates:327 · checkTarget:331 · activeTargets:349 · validateTargets:353 · checkVerb:360 · checkVerbTarget:374 · openPick:378 · runVerb:385 · runAbilities:524 · grantMovedBuff:530 · playCard:540 · useAbility:602 · choose:642 · attack:698 · respondAmbush:724 · resolveAmbushEffect:741 · resolveCombat:774 · move:851 · advance:884 · discardExcess:906 · clone:923 · applyAction:925 · MatchLog:965 · newMatchLog:972 · replayMatch:975

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (237 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · GOLD_PER_TURN:11 · GOLD_FROM_ROUND:12 · COMBAT_FROM_ROUND:14 · HAND_LIMIT:15 · Unit:19 · Board:24 · phasesForTurn:27 · AUTOMATIC_PHASES:33 · restingPhasesForTurn:34 · abilitiesOf:39 · passivesOf:40 · abilityOn:41 · verbsOn:42 · hasVerb:43 · abilityPhases:46 · specCandidatesOn:49 · targetSpecsOf:64 · playTargetSpecs:65 · targetSpecOf:67 · needsHiddenInfo:71 · reinforceShield:76 · canReinforce:80 · AuraStat:83 · rowOk:84 · whoMatches:85 · auraTotal:95 · boardHasFlag:117 · canPlayInPhase:122 · isFrontline:126 · isBackline:127 · isUnitSlot:128 · getLaneCol:129 · getMoveRow:134 · getMoveCol:135 · areSlotsAdjacent:137 · adjacentSlots:141 · canReposition:145 · SOLDIER_TYPES:152 · CardDropKind:154 · getCardDropKind:157 · canPlaceInSlot:169 · isAliveAt:178 · isCardDamaged:180 · getAuraCombatHpBonus:183 · blocksAmbush:185 · locksGeneralOnDamage:187 · getMaxAttacksPerTurn:189 · getEffectiveAtk:193 · getIncomingDamageReduction:200 · getValidAttackTargets:204 · withEquippedWeapons:235

## src/engine/types.ts  (323 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:43 · Verb:47 · AbilityOn:83 · Ability:96 · Who:106 · Passive:116 · CardDef:126 · Card:145 · SLOT_COUNT:174 · GENERAL_SLOT:175 · RELIC_SLOT:176 · TERRAIN_SLOT:177 · PlayerState:179 · TurnState:198 · PickMode:216 · Pending:219 · GameState:253 · Action:264 · GameEvent:287 · ActionResult:320

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

## tests/balance-comeback.ts  (32 linhas)
Mede viradas (comeback) a partir dos resultados do laboratório.

G:5 · games:6 · afterRound:7 · trailed:21

## tests/balance-lab.ts  (114 linhas)
LABORATÓRIO de balanceamento: joga muitas partidas IA × IA, com patches "e se" (docs/balanceamento.md).

Patch:21 · Per:22 · GameRecord:24 · applyPatch:26 · bump:48 · playGame:50 · main:89

## tests/balance-matchup.ts  (32 linhas)
Teste rápido Cardeal × Capitão.

N:9 · cardealWins:14

## tests/balance-report.ts  (130 linhas)
Transforma os resultados do laboratório em uma página (relatório lado a lado).

Per:5 · G:6 · Lab:7 · load:9 · mean:10 · se:11 · summarize:13 · base:51 · detail:52 · variants:53 · html:54 · BASE:77 · pct:78 · summary:79 · deckTable:87 · changes:106 · compare:114 · h:123

## tests/balance-rules-preload.ts  (7 linhas)
Passa as regras do patch (ouro, início do combate) ao motor antes de ele carregar.

## tests/engine-rules.ts  (1089 linhas)
Um cenário por regra do jogo (npm test).

passed:11 · test:12 · eq:15 · ok:18 · n:21 · mk:22 · fresh:27 · put:38 · give:39 · act:40 · refused:45 · names:50 · combat:51 · ambushSetup:360 · shielded:646 · aiTurn:707 · atkOf:885 · endTurnOf:886

## tests/engine-sim.ts  (185 linhas)
Partidas IA × IA com invariantes, repetição determinística e fuzz (npm test).

failures:13 · usage:14 · tactics:15 · discards:16 · check:17 · allCards:19 · invariants:27 · play:47 · decks:80 · finished:81 · winsByDeck:82 · rnd:111 · R:112 · accepted:113

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
