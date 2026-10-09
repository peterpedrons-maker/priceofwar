<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11003 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:259 · DRAW_FLIGHT_MS:285 · sfxVol:294 · playCardDrawSfx:295 · playCardPlaySfx:309 · playAttackSfx:316 · playEffectSfx:318 · playTacticSfx:319 · playSelectSfx:327 · bannerAudioCtx:339 · playBannerSfx:340 · playUiClickSfx:383 · playCardLiftSfx:392 · playDamageSfx:404 · playGeneralDamageSfx:409 · playDestroySfx:419 · playRevealGeneralSfx:421 · playWarHornSfx:427 · playBatalhaBannerSfx:432 · playBatalhaImpactSfx:440 · CardType:446 · CardData:448 · StatTone:496 · STAT_TONE_COLOR:497 · STAT_TONE_GRADIENT:498 · statsOf:503 · SlotHint:512 · getSlotHint:521 · RowRoleHint:527 · SOLDIER_CARD_TYPES:528 · getRowRoleHint:529 · ROW_ROLE_VIEW:536 · PHASE_BANNER_TEXT:560 · BATALHA_FALL_MS:582 · BATALHA_IMPACT_FRACTION:583 · BANNER_LEARN_COUNT:587 · bannersSeen:588 · PHASE_BANNER_STAGE_MS:589 · phaseBannerMs:590 · PHASE_BANNER_Y:598 · PHASE_BANNER_MOTION:599 · HIT_STOP_MS:610 · ATTACK_MS:613 · ATTACK_WINDUP_FRAC:614 · ATTACK_WINDUP_PX:615 · ATTACK_TILT_DEG:616 · IMPACT_MS:617 · TIME:620 · rangedKindOf:622 · FINAL_SLOW:623 · FINAL_INTRO_MS:624 · FINAL_FREEZE_MS:625 · FINAL_AFTER_MS:626 · SLASH_SPARK_ANGLES:629 · SlashEffect:638 · TargetKind:676 · TARGET_STYLE:677 · HUD_CARD_SCALE:683 · AmountBadge:687 · TargetingHud:704 · READY_COLORS:774 · SILHOUETTES:779 · silhouetteFor:784 · TriggerIcon:794 · FLIGHT_MS:808 · HELD_SCALE:809 · HELD_GAP:810 · TriggerBurst:811 · TriggerFloatLayer:832 · AbilityReadyGlow:849 · TutRect:880 · tutPct:881 · tutSilBox:882 · tutElRect:891 · tutPad:892 · tutUnion:893 · TutResolved:898 · TUT_EMPTY:899 · visibleHandCards:900 · resolveTutTarget:901 · TutorialStage:948 · SpriteOnce:992 · EffectIcon:1009 · EFFECT_ICONS:1010 · SpriteIcon:1018 · IconPop:1023 · SHIELD_SHEETS:1038 · GOLD_BUBBLE:1044 · ShieldAura:1045 · ShieldFxOnce:1065 · EquipFxLayer:1079 · PUNCH_FRAMES:1125 · PUNCH_FRAME_W:1126 · PunchFx:1128 · BURN_FRAMES:1164 · BurningCard:1166 · GraveyardPile:1216 · AtkBadge:1248 · NUMBER_KIND_OF:1260 · NUMBER_TIERS:1265 · damageTier:1271 · floatLife:1272 · FloatNumber:1273 · HpBadge:1321 · GoldBadge:1350 · GoldNumber:1379 · CardBack:1439 · CARD_THICKNESS_SHADOW:1477 · cardBoxShadow:1488 · cardGlowFilter:1489 · CARD_FACE_VARIANTS:1499 · NO_STAT_TYPES:1516 · templateForType:1517 · templateForTypeMini:1522 · FitText:1541 · KeywordPill:1616 · STAT_TOKEN:1630 · STAT_NUMBER_STYLE:1631 · StatSymbol:1632 · DamageSymbol:1639 · renderEffectText:1650 · FitEffectText:1669 · FULL_ART_PLATE_VARIANTS:1733 · FULL_ART_SIZE_FIX:1743 · CardFaceFullArt:1744 · FullArtMiniConfig:1865 · FULL_ART_MINI_CONFIG:1870 · usesLightBar:1898 · nameTextStyle:1899 · FULL_ART_MINI_DEFAULT:1902 · fullArtMiniConfigForType:1907 · CardFaceFullArtMini:1922 · CARD_FACE_MINI_STD_SCALE:1971 · CardFaceStandardMini:1972 · CardFace:2035 · BOARD_EXTERIOR_ART_URL:2147 · FIELD_PREVIEW_SCALE:2152 · BOARD_PREVIEW_SCALE:2170 · FAN_SPREAD_DEG:2173 · FAN_LIFT_PX:2174 · HAND_CARD_WIDTH:2175 · HAND_CARD_HEIGHT:2176 · HAND_CARD_STEP:2179 · HAND_FULL_SPREAD_COUNT:2182 · HAND_SELECT_SCALE:2185 · handStepFor:2186 · ART_BY_NAME:2193 · MERC_ART_FILES:2247 · artSlug:2248 · cardDataFromName:2254 · buildDeckCards:2258 · DECK_CAPITAO:2266 · DECK_CARDEAL:2267 · DECK_MERCENARIOS:2268 · DECKS:2272 · ALL_DECK_IDS:2295 · BOOSTER_POOLS:2298 · DECK_STORE_KEY:2313 · CARD_INSTANCES_BY_NAME:2315 · cardByName:2323 · isGeneralName:2324 · DeckSlot:2326 · DeckStore:2327 · DeckSelection:2329 · OnlineMatch:2335 · needsServer:2367 · visibleKey:2379 · countByName:2384 · CAPITAO_STARTER_NAME:2390 · MERC_STARTER_NAME:2391 · CLOUD_DECK_SLOTS:2393 · MAX_DECK_SLOTS:2394 · buildStarterStore:2397 · sameCards:2419 · ensureStarterDecks:2423 · lastSanitizeMigrated:2450 · sanitizeDeckStore:2451 · loadDeckStore:2480 · cloudUserId:2494 · pushTimer:2495 · pushing:2496 · pushAgain:2497 · toCloudDecks:2498 · runPush:2499 · saveDeckStore:2512 · stopCloudSync:2517 · flushCloudSync:2519 · syncDeckStoreWithCloud:2530 · deckCardCount:2558 · deckProblem:2560 · buildDeckSelection:2566 · deckIdOfGeneral:2574 · DEFAULT_DECK_SELECTION:2575 · PlayerProfile:2584 · AVATAR_OPTIONS:2599 · avatarById:2607 · PROFILE_STORAGE_KEY:2609 · DEFAULT_PROFILE:2610 · loadProfile:2623 · formatCoroas:2637 · saveProfile:2642 · MODE_LABELS_PT:2651 · AvatarBadge:2661 · WINDOW_FRAME_PX:2681 · WINDOW_FONT_DECO:2682 · FramedWindow:2684 · WindowOverlay:2689 · WindowDivider:2712 · WindowTitle:2720 · Edges:2728 · ArtFrame:2729 · VLine:2750 · HLine:2753 · ArtChip:2758 · WindowOption:2764 · WindowText:2768 · WindowButton:2772 · AvatarPickerModal:2778 · ALLOW_PROFILE_RENAME:2815 · ProfileBar:2816 · ComingSoonModal:2937 · ONLINE_MODES:2953 · OnlineModeModal:2957 · TapPhase:2989 · MENU_CONFIRM_MS:2990 · useMenuTap:2991 · PlaqueSparks:3015 · PLAQUE_ASPECT:3034 · PLAQUE_CAP_CQW:3035 · MenuCard:3036 · MenuIconButton:3085 · MainMenu:3116 · InstallPrompt:3244 · DeckPickerModal:3280 · CARD_TYPE_ORDER:3311 · DeckSide:3312 · EditorSort:3313 · EDITOR_SORTS:3314 · EDITOR_MARGIN:3315 · EDITOR_FRAME:3316 · EDITOR_PAD:3317 · LIST_COLS:3320 · ROW_H:3321 · FULL_ART_TILE_SCALE:3322 · DeckEditor:3324 · ShopPhase:3887 · NpcMood:3888 · BoosterDef:3889 · BOOSTERS:3891 · TEST_FREE_BOOSTERS:3899 · SHELF_ROWS:3900 · SHELF_COLS:3901 · BOOSTER_ASPECT:3902 · SHELF_X0:3907 · SHELF_X1:3908 · SHELF_PLANKS:3909 · SHELF_OVERVIEW:3910 · SHELF_CLOSEUP:3911 · NPC_LINES:3913 · SHOP_ART:3921 · rollBooster:3929 · BoosterArt:3944 · NpcArt:3956 · PACK_TEAR_Y:3963 · LID_SLICES:3964 · LidSlice:3970 · PackTear:3993 · PulledCard:4062 · pullBooster:4063 · PackOpening:4076 · OpenBoosterFromTable:4155 · ShopScreen:4161 · AuthBackdrop:4401 · GoogleMark:4422 · DiscordMark:4425 · AuthButton:4427 · authFieldClass:4433 · LoginScreen:4435 · NAME_RULE:4496 · ProfileSetupScreen:4498 · VolumeRow:4564 · ToggleRow:4573 · OptionsModal:4583 · SettingsModal:4616 · playCoinSfx:4653 · COIN_THICK:4681 · CoinFace:4682 · CoinRim:4691 · RemotePick:4710 · CoinToss:4711 · MatchSearchOverlay:4793 · OnlineSearchOverlay:4826 · LoadingScreen:4895 · App:4949 · IMMEDIATE_ZONE_LABEL:10465 · DragFinger:10470 · GuideInfo:10487 · DragGuide:10488 · arrivalDrops:10555 · arrivalListener:10557 · EmblemKind:10562 · EMBLEM_ART:10563 · SlotEmblem:10564 · RowPlaque:10577 · CardSlot:10589

Dentro de `App` (linhas 4949–10464), funções internas:
attackMarkFor:5192 · openCardPicker:5219 · spawnFloatingNumber:5255 · spawnFloatingNumberAtId:5270 · showBanner:5297 · announcePhase:5321 · announceTurnChange:5331 · beginFinalBlow:5364 · endFinalBlow:5365 · blowIsSoaked:5368 · handleInstallClick:5452 · shieldOverSlot:5508 · popOverSlot:5517 · burstAt:5532 · whenGlowDone:5557 · endGlow:5558 · startTriggerFx:5562 · holdForSeat:5590 · terrainFxPlayer:5618 · terrainFxNpc:5619 · fireImpactBurst:5634 · noteDragPlay:5657 · handFanMaxAngleRad:5727 · getHandArrivalPoint:5826 · getFanRotation:5846 · getFanLift:5853 · computeDrawOrigin:5868 · showToast:5883 · announceCardPlay:5889 · toCardData:5963 · shownStats:5978 · boardView:5989 · syncView:5994 · processEvents:6027 · cardOverlayFx:6237 · fxRectOf:6328 · fxEnvFor:6334 · pickTacticSpot:6351 · tacticFxOf:6360 · planFx:6364 · commitState:6394 · dispatchAction:6417 · wakeWaiter:6436 · publishClock:6437 · dispatchOnline:6439 · reconcileOwn:6475 · applyUnasked:6489 · ingestRows:6503 · chooseFirstOnline:6531 · absorbAct:6544 · refuseOwn:6553 · sendOnline:6565 · stopOnline:6579 · startOnlinePolling:6594 · nextOpponentAction:6612 · applyRewardToProfile:6639 · openPlayerPick:6646 · playerAct:6673 · maybePromptRelicMode:6684 · confirmRelicMode:6694 · confirmUpkeep:6705 · endTurnNow:6717 · sleep:6736 · tutCurrent:6748 · tutCanBack:6752 · tutShow:6757 · tutGo:6773 · tutNext:6781 · tutBack:6795 · tutMatches:6800 · tutSignal:6812 · tutFromAction:6817 · tutBeat:6824 · tutExit:6831 · tutFinish:6838 · startTutorial:6839 · tutLaunchDuel:6844 · tutCoinResolved:6846 · settleAmbush:6903 · startMatchIntro:6936 · continueMatchIntro:6955 · resetGame:7047 · startGame:7100 · startOnlineMatch:7107 · leaveMatch:7147 · handleCardClick:7488 · handlePlayCardButtonClick:7548 · abilityStepCandidates:7616 · abilityHasTargets:7619 · getPlayerCreatureAbilityKind:7641 · getCardVisualEl:7655 · triggerPunch:7740 · renderTravelingArrow:7778 · playPendingTactic:7805 · resolveOwnTacticTarget:7812 · resolveEnemyTacticTarget:7817 · toggleCardPickerSelection:7825 · abilityOf:7839 · nextAbilityStep:7841 · activateAbility:7847 · abilityStepSide:7861 · resolveAbilityTarget:7867 · pushAbilityPrompt:7904 · mine:7925 · foes:7926 · effectTargetKind:7929 · specSlots:7931 · tacticTargeting:7945 · sourceAt:7952 · cancelTargeting:7970 · playHandCardOnTarget:7973 · heldTop:7980 · slotUnder:7981 · clearDragOver:7990 · dragBlockReason:7992 · tapHandCard:8004 · beginPress:8012 · returnHeld:8029 · dropHeldCard:8038 · updateHeld:8067 · dropOk:8086 · handleSlotClick:8142 · handleNpcSlotClick:8322 · handleBackgroundClick:8388 · getTappedCardShift:8419 · getSelectedCardX:8429 · getSelectedCardY:8451 · getBoardAnimation:8475 · getPlayerSlotHint:8516 · isTacticTargetSlot:8535 · tacticTagFor:8543 · shakePx:8606 · boardHeightMultiplier:8619 · boardTopMargin:8620

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

## src/DesafiosScreen.tsx  (176 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

DzOpponent:12 · DzDeck:13 · PLACES:16 · LOCKED:22 · MAPPX:24 · PIN_SVG:25 · LAST_DECK_KEY:26 · DesafiosScreen:28

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

## src/services/online.ts  (102 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:31 · QueueResult:51 · ActResult:56 · call:61 · asActResult:78 · queueForMatch:83 · queueStatus:84 · cancelQueue:85 · sendAction:86 · tickMatch:88 · fetchResult:89 · fetchViews:95

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

## src/tutorial/script.ts  (240 linhas)
Dados do tutorial 1: partida fixa, jogadas do treinador, passos e falas.

TutorialMeta:8 · TUTORIALS:9 · Expr:16 · NPC_NAME:17 · Tgt:20 · Until:27 · Step:36 · CHAPTERS:54 · HAND_P:57 · PILE_P:58 · HAND_E:59 · PILE_E:60 · uid:62 · fresh:63 · createTutorialMatch:69 · EnemyMove:80 · ADV:81 · ENEMY_SCRIPT:82 · nextEnemyAction:88 · PlayerMove:99 · PLAYER_PATH:100 · G:108 · E:109 · row:110 · TRACKER:111 · GOLD_ME:112 · GOLD_FOE:113 · INTRO_LINES:116 · COIN_STEP:123 · STEPS:125 · R:193 · BEATS:194 · OUTRO:207 · playTutorialForTest:213

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

## server/handler.ts  (361 linhas)
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

## tests/engine-rules.ts  (1174 linhas)
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

## tests/online-server.ts  (399 linhas)
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
