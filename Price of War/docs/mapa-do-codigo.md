<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (10908 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:250 · DRAW_FLIGHT_MS:276 · sfxVol:285 · playCardDrawSfx:286 · playCardPlaySfx:300 · playAttackSfx:307 · playEffectSfx:309 · playTacticSfx:310 · playSelectSfx:318 · bannerAudioCtx:330 · playBannerSfx:331 · playUiClickSfx:374 · playCardLiftSfx:383 · playDamageSfx:395 · playGeneralDamageSfx:400 · playDestroySfx:410 · playRevealGeneralSfx:412 · playBatalhaBannerSfx:417 · playBatalhaImpactSfx:425 · CardType:431 · CardData:433 · StatTone:481 · STAT_TONE_COLOR:482 · STAT_TONE_GRADIENT:483 · statsOf:488 · SlotHint:497 · getSlotHint:506 · RowRoleHint:512 · SOLDIER_CARD_TYPES:513 · getRowRoleHint:514 · ROW_ROLE_VIEW:521 · PHASE_BANNER_TEXT:545 · BATALHA_FALL_MS:567 · BATALHA_IMPACT_FRACTION:568 · PHASE_BANNER_STAGE_MS:570 · PHASE_BANNER_DURATION_MS:571 · PHASE_BANNER_Y:579 · PHASE_BANNER_MOTION:580 · HIT_STOP_MS:591 · ATTACK_MS:594 · ATTACK_WINDUP_FRAC:595 · ATTACK_WINDUP_PX:596 · ATTACK_TILT_DEG:597 · IMPACT_MS:598 · TIME:601 · rangedKindOf:603 · FINAL_SLOW:604 · FINAL_INTRO_MS:605 · FINAL_FREEZE_MS:606 · FINAL_AFTER_MS:607 · SLASH_SPARK_ANGLES:610 · SlashEffect:619 · TargetKind:657 · TARGET_STYLE:658 · HUD_CARD_SCALE:664 · AmountBadge:668 · TargetingHud:685 · READY_COLORS:755 · SILHOUETTES:760 · silhouetteFor:765 · TriggerIcon:775 · FLIGHT_MS:789 · HELD_SCALE:790 · HELD_GAP:791 · TriggerBurst:792 · TriggerFloatLayer:813 · AbilityReadyGlow:830 · TutRect:861 · tutPct:862 · tutSilBox:863 · tutElRect:872 · tutPad:873 · tutUnion:874 · TutResolved:879 · TUT_EMPTY:880 · visibleHandCards:881 · resolveTutTarget:882 · TutorialStage:929 · SpriteOnce:973 · EffectIcon:990 · EFFECT_ICONS:991 · SpriteIcon:999 · IconPop:1004 · SHIELD_SHEETS:1019 · GOLD_BUBBLE:1025 · ShieldAura:1026 · ShieldFxOnce:1046 · EquipFxLayer:1060 · PUNCH_FRAMES:1106 · PUNCH_FRAME_W:1107 · PunchFx:1109 · BURN_FRAMES:1145 · BurningCard:1147 · GraveyardPile:1197 · AtkBadge:1228 · NUMBER_KIND_OF:1240 · NUMBER_TIERS:1245 · damageTier:1251 · floatLife:1252 · FloatNumber:1253 · HpBadge:1301 · GoldBadge:1330 · GoldNumber:1359 · CardBack:1419 · CARD_THICKNESS_SHADOW:1457 · cardBoxShadow:1468 · cardGlowFilter:1469 · CARD_FACE_VARIANTS:1479 · NO_STAT_TYPES:1496 · templateForType:1497 · templateForTypeMini:1502 · FitText:1521 · KeywordPill:1596 · STAT_TOKEN:1610 · STAT_NUMBER_STYLE:1611 · StatSymbol:1612 · DamageSymbol:1619 · renderEffectText:1630 · FitEffectText:1649 · FULL_ART_PLATE_VARIANTS:1713 · FULL_ART_SIZE_FIX:1723 · CardFaceFullArt:1724 · FullArtMiniConfig:1845 · FULL_ART_MINI_CONFIG:1850 · usesLightBar:1878 · nameTextStyle:1879 · FULL_ART_MINI_DEFAULT:1882 · fullArtMiniConfigForType:1887 · CardFaceFullArtMini:1902 · CARD_FACE_MINI_STD_SCALE:1951 · CardFaceStandardMini:1952 · CardFace:2015 · BOARD_EXTERIOR_ART_URL:2127 · FIELD_PREVIEW_SCALE:2132 · BOARD_PREVIEW_SCALE:2150 · FAN_SPREAD_DEG:2153 · FAN_LIFT_PX:2154 · HAND_CARD_WIDTH:2155 · HAND_CARD_HEIGHT:2156 · HAND_CARD_STEP:2159 · HAND_FULL_SPREAD_COUNT:2162 · HAND_SELECT_SCALE:2165 · handStepFor:2166 · ART_BY_NAME:2173 · MERC_ART_FILES:2227 · artSlug:2228 · cardDataFromName:2234 · buildDeckCards:2238 · DECK_CAPITAO:2246 · DECK_CARDEAL:2247 · DECK_MERCENARIOS:2248 · DECKS:2252 · ALL_DECK_IDS:2275 · BOOSTER_POOLS:2278 · DECK_STORE_KEY:2293 · CARD_INSTANCES_BY_NAME:2295 · cardByName:2303 · isGeneralName:2304 · DeckSlot:2306 · DeckStore:2307 · DeckSelection:2309 · OnlineMatch:2315 · needsServer:2347 · visibleKey:2359 · countByName:2364 · CAPITAO_STARTER_NAME:2370 · MERC_STARTER_NAME:2371 · CLOUD_DECK_SLOTS:2373 · MAX_DECK_SLOTS:2374 · buildStarterStore:2377 · sameCards:2399 · ensureStarterDecks:2403 · lastSanitizeMigrated:2430 · sanitizeDeckStore:2431 · loadDeckStore:2460 · cloudUserId:2474 · pushTimer:2475 · pushing:2476 · pushAgain:2477 · toCloudDecks:2478 · runPush:2479 · saveDeckStore:2492 · stopCloudSync:2497 · flushCloudSync:2499 · syncDeckStoreWithCloud:2510 · deckCardCount:2538 · deckProblem:2540 · buildDeckSelection:2546 · DEFAULT_DECK_SELECTION:2553 · PlayerProfile:2562 · AVATAR_OPTIONS:2577 · avatarById:2585 · PROFILE_STORAGE_KEY:2587 · DEFAULT_PROFILE:2588 · loadProfile:2601 · formatCoroas:2615 · saveProfile:2620 · MODE_LABELS_PT:2629 · AvatarBadge:2639 · WINDOW_FRAME_PX:2659 · WINDOW_FONT_DECO:2660 · FramedWindow:2662 · WindowOverlay:2687 · WindowDivider:2710 · WindowTitle:2718 · Edges:2736 · ArtFrame:2737 · VLine:2758 · HLine:2761 · ArtChip:2766 · WindowOption:2781 · WindowText:2789 · WindowButton:2793 · AvatarPickerModal:2808 · ALLOW_PROFILE_RENAME:2845 · ProfileBar:2846 · ComingSoonModal:2967 · ONLINE_MODES:2983 · OnlineModeModal:2987 · TapPhase:3025 · MENU_CONFIRM_MS:3026 · useMenuTap:3027 · PlaqueSparks:3051 · PLAQUE_ASPECT:3070 · PLAQUE_CAP_CQW:3071 · MenuCard:3072 · MenuIconButton:3121 · MainMenu:3152 · InstallPrompt:3280 · DeckPickerModal:3316 · CARD_TYPE_ORDER:3347 · DeckSide:3348 · EditorSort:3349 · EDITOR_SORTS:3350 · EDITOR_MARGIN:3351 · EDITOR_FRAME:3352 · EDITOR_PAD:3353 · LIST_COLS:3356 · ROW_H:3357 · FULL_ART_TILE_SCALE:3358 · DeckEditor:3360 · ShopPhase:3978 · NpcMood:3979 · BoosterDef:3980 · BOOSTERS:3982 · TEST_FREE_BOOSTERS:3990 · SHELF_ROWS:3991 · SHELF_COLS:3992 · BOOSTER_ASPECT:3993 · SHELF_X0:3998 · SHELF_X1:3999 · SHELF_PLANKS:4000 · SHELF_OVERVIEW:4001 · SHELF_CLOSEUP:4002 · NPC_LINES:4004 · SHOP_ART:4012 · rollBooster:4020 · BoosterArt:4035 · NpcArt:4047 · PACK_TEAR_Y:4054 · LID_SLICES:4055 · LidSlice:4061 · PackTear:4084 · PulledCard:4153 · pullBooster:4154 · PackOpening:4167 · OpenBoosterFromTable:4246 · ShopScreen:4252 · AuthBackdrop:4492 · GoogleMark:4512 · DiscordMark:4515 · AuthButton:4521 · authFieldClass:4531 · LoginScreen:4533 · NAME_RULE:4594 · ProfileSetupScreen:4596 · VolumeRow:4662 · ToggleRow:4676 · OptionsModal:4688 · SettingsModal:4717 · playCoinSfx:4754 · COIN_THICK:4782 · CoinFace:4783 · CoinRim:4792 · RemotePick:4811 · CoinToss:4812 · MatchSearchOverlay:4894 · OnlineSearchOverlay:4927 · LoadingScreen:4996 · App:5050 · IMMEDIATE_ZONE_LABEL:10396 · DragFinger:10401 · GuideInfo:10418 · DragGuide:10419 · arrivalDrops:10486 · arrivalListener:10488 · EmblemKind:10493 · EMBLEM_ART:10494 · SlotEmblem:10495 · RowPlaque:10508 · CardSlot:10520

Dentro de `App` (linhas 5050–10395), funções internas:
openCardPicker:5304 · spawnFloatingNumber:5340 · spawnFloatingNumberAtId:5355 · showBanner:5381 · announcePhase:5400 · announceTurnChange:5408 · beginFinalBlow:5441 · endFinalBlow:5442 · blowIsSoaked:5445 · handleInstallClick:5529 · shieldOverSlot:5585 · popOverSlot:5594 · burstAt:5609 · whenGlowDone:5634 · endGlow:5635 · startTriggerFx:5639 · holdForSeat:5667 · fireImpactBurst:5700 · noteDragPlay:5723 · handFanMaxAngleRad:5793 · getHandArrivalPoint:5892 · getFanRotation:5912 · getFanLift:5919 · computeDrawOrigin:5934 · showToast:5949 · announceCardPlay:5955 · toCardData:6029 · shownStats:6044 · boardView:6055 · syncView:6060 · processEvents:6093 · fxRectOf:6306 · fxEnvFor:6312 · pickTacticSpot:6324 · planFx:6332 · commitState:6352 · dispatchAction:6375 · wakeWaiter:6394 · publishClock:6395 · dispatchOnline:6397 · reconcileOwn:6433 · applyUnasked:6447 · ingestRows:6461 · chooseFirstOnline:6489 · absorbAct:6502 · refuseOwn:6511 · sendOnline:6523 · stopOnline:6537 · startOnlinePolling:6552 · nextOpponentAction:6570 · applyRewardToProfile:6597 · openPlayerPick:6604 · playerAct:6631 · maybePromptRelicMode:6642 · confirmRelicMode:6652 · confirmUpkeep:6663 · endTurnNow:6675 · sleep:6694 · tutCurrent:6706 · tutCanBack:6710 · tutShow:6715 · tutGo:6731 · tutNext:6739 · tutBack:6753 · tutMatches:6758 · tutSignal:6770 · tutFromAction:6775 · tutBeat:6782 · tutExit:6789 · tutFinish:6796 · startTutorial:6797 · tutLaunchDuel:6802 · tutCoinResolved:6804 · settleAmbush:6861 · startMatchIntro:6894 · continueMatchIntro:6913 · resetGame:7005 · startGame:7058 · startOnlineMatch:7065 · leaveMatch:7105 · handleCardClick:7434 · handlePlayCardButtonClick:7494 · abilityStepCandidates:7562 · abilityHasTargets:7565 · getPlayerCreatureAbilityKind:7587 · getCardVisualEl:7601 · triggerPunch:7686 · renderTravelingArrow:7724 · playPendingTactic:7751 · resolveOwnTacticTarget:7758 · resolveEnemyTacticTarget:7763 · toggleCardPickerSelection:7771 · abilityOf:7785 · nextAbilityStep:7787 · activateAbility:7793 · abilityStepSide:7807 · resolveAbilityTarget:7813 · pushAbilityPrompt:7850 · mine:7871 · foes:7872 · effectTargetKind:7875 · specSlots:7877 · tacticTargeting:7891 · sourceAt:7898 · cancelTargeting:7916 · playHandCardOnTarget:7919 · heldTop:7926 · slotUnder:7927 · clearDragOver:7936 · dragBlockReason:7938 · tapHandCard:7950 · beginPress:7958 · returnHeld:7975 · dropHeldCard:7984 · updateHeld:8013 · dropOk:8032 · handleSlotClick:8088 · handleNpcSlotClick:8268 · handleBackgroundClick:8334 · getTappedCardShift:8365 · getSelectedCardX:8375 · getSelectedCardY:8397 · getBoardAnimation:8421 · getPlayerSlotHint:8462 · isTacticTargetSlot:8481 · tacticTagFor:8489 · shakePx:8552 · boardHeightMultiplier:8565 · boardTopMargin:8566

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
