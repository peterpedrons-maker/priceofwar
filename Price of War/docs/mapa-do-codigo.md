<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11016 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:253 · DRAW_FLIGHT_MS:279 · sfxVol:288 · playCardDrawSfx:289 · playCardPlaySfx:303 · playAttackSfx:310 · playEffectSfx:312 · playTacticSfx:313 · playSelectSfx:321 · bannerAudioCtx:333 · playBannerSfx:334 · playUiClickSfx:377 · playCardLiftSfx:386 · playDamageSfx:398 · playGeneralDamageSfx:403 · playDestroySfx:413 · playRevealGeneralSfx:415 · playBatalhaBannerSfx:420 · playBatalhaImpactSfx:428 · CardType:434 · CardData:436 · StatTone:484 · STAT_TONE_COLOR:485 · STAT_TONE_GRADIENT:486 · statsOf:491 · SlotHint:500 · getSlotHint:509 · RowRoleHint:515 · SOLDIER_CARD_TYPES:516 · getRowRoleHint:517 · ROW_ROLE_VIEW:524 · PHASE_BANNER_TEXT:548 · BATALHA_FALL_MS:570 · BATALHA_IMPACT_FRACTION:571 · BANNER_LEARN_COUNT:575 · bannersSeen:576 · PHASE_BANNER_STAGE_MS:577 · phaseBannerMs:578 · PHASE_BANNER_Y:586 · PHASE_BANNER_MOTION:587 · HIT_STOP_MS:598 · ATTACK_MS:601 · ATTACK_WINDUP_FRAC:602 · ATTACK_WINDUP_PX:603 · ATTACK_TILT_DEG:604 · IMPACT_MS:605 · TIME:608 · rangedKindOf:610 · FINAL_SLOW:611 · FINAL_INTRO_MS:612 · FINAL_FREEZE_MS:613 · FINAL_AFTER_MS:614 · SLASH_SPARK_ANGLES:617 · SlashEffect:626 · TargetKind:664 · TARGET_STYLE:665 · HUD_CARD_SCALE:671 · AmountBadge:675 · TargetingHud:692 · READY_COLORS:762 · SILHOUETTES:767 · silhouetteFor:772 · TriggerIcon:782 · FLIGHT_MS:796 · HELD_SCALE:797 · HELD_GAP:798 · TriggerBurst:799 · TriggerFloatLayer:820 · AbilityReadyGlow:837 · TutRect:868 · tutPct:869 · tutSilBox:870 · tutElRect:879 · tutPad:880 · tutUnion:881 · TutResolved:886 · TUT_EMPTY:887 · visibleHandCards:888 · resolveTutTarget:889 · TutorialStage:936 · SpriteOnce:980 · EffectIcon:997 · EFFECT_ICONS:998 · SpriteIcon:1006 · IconPop:1011 · SHIELD_SHEETS:1026 · GOLD_BUBBLE:1032 · ShieldAura:1033 · ShieldFxOnce:1053 · EquipFxLayer:1067 · PUNCH_FRAMES:1113 · PUNCH_FRAME_W:1114 · PunchFx:1116 · BURN_FRAMES:1152 · BurningCard:1154 · GraveyardPile:1204 · AtkBadge:1236 · NUMBER_KIND_OF:1248 · NUMBER_TIERS:1253 · damageTier:1259 · floatLife:1260 · FloatNumber:1261 · HpBadge:1309 · GoldBadge:1338 · GoldNumber:1367 · CardBack:1427 · CARD_THICKNESS_SHADOW:1465 · cardBoxShadow:1476 · cardGlowFilter:1477 · CARD_FACE_VARIANTS:1487 · NO_STAT_TYPES:1504 · templateForType:1505 · templateForTypeMini:1510 · FitText:1529 · KeywordPill:1604 · STAT_TOKEN:1618 · STAT_NUMBER_STYLE:1619 · StatSymbol:1620 · DamageSymbol:1627 · renderEffectText:1638 · FitEffectText:1657 · FULL_ART_PLATE_VARIANTS:1721 · FULL_ART_SIZE_FIX:1731 · CardFaceFullArt:1732 · FullArtMiniConfig:1853 · FULL_ART_MINI_CONFIG:1858 · usesLightBar:1886 · nameTextStyle:1887 · FULL_ART_MINI_DEFAULT:1890 · fullArtMiniConfigForType:1895 · CardFaceFullArtMini:1910 · CARD_FACE_MINI_STD_SCALE:1959 · CardFaceStandardMini:1960 · CardFace:2023 · BOARD_EXTERIOR_ART_URL:2135 · FIELD_PREVIEW_SCALE:2140 · BOARD_PREVIEW_SCALE:2158 · FAN_SPREAD_DEG:2161 · FAN_LIFT_PX:2162 · HAND_CARD_WIDTH:2163 · HAND_CARD_HEIGHT:2164 · HAND_CARD_STEP:2167 · HAND_FULL_SPREAD_COUNT:2170 · HAND_SELECT_SCALE:2173 · handStepFor:2174 · ART_BY_NAME:2181 · MERC_ART_FILES:2235 · artSlug:2236 · cardDataFromName:2242 · buildDeckCards:2246 · DECK_CAPITAO:2254 · DECK_CARDEAL:2255 · DECK_MERCENARIOS:2256 · DECKS:2260 · ALL_DECK_IDS:2283 · BOOSTER_POOLS:2286 · DECK_STORE_KEY:2301 · CARD_INSTANCES_BY_NAME:2303 · cardByName:2311 · isGeneralName:2312 · DeckSlot:2314 · DeckStore:2315 · DeckSelection:2317 · OnlineMatch:2323 · needsServer:2355 · visibleKey:2367 · countByName:2372 · CAPITAO_STARTER_NAME:2378 · MERC_STARTER_NAME:2379 · CLOUD_DECK_SLOTS:2381 · MAX_DECK_SLOTS:2382 · buildStarterStore:2385 · sameCards:2407 · ensureStarterDecks:2411 · lastSanitizeMigrated:2438 · sanitizeDeckStore:2439 · loadDeckStore:2468 · cloudUserId:2482 · pushTimer:2483 · pushing:2484 · pushAgain:2485 · toCloudDecks:2486 · runPush:2487 · saveDeckStore:2500 · stopCloudSync:2505 · flushCloudSync:2507 · syncDeckStoreWithCloud:2518 · deckCardCount:2546 · deckProblem:2548 · buildDeckSelection:2554 · deckIdOfGeneral:2562 · DEFAULT_DECK_SELECTION:2563 · PlayerProfile:2572 · AVATAR_OPTIONS:2587 · avatarById:2595 · PROFILE_STORAGE_KEY:2597 · DEFAULT_PROFILE:2598 · loadProfile:2611 · formatCoroas:2625 · saveProfile:2630 · MODE_LABELS_PT:2639 · AvatarBadge:2649 · WINDOW_FRAME_PX:2669 · WINDOW_FONT_DECO:2670 · FramedWindow:2672 · WindowOverlay:2677 · WindowDivider:2700 · WindowTitle:2708 · Edges:2716 · ArtFrame:2717 · VLine:2738 · HLine:2741 · ArtChip:2746 · WindowOption:2752 · WindowText:2756 · WindowButton:2760 · AvatarPickerModal:2766 · ALLOW_PROFILE_RENAME:2803 · ProfileBar:2804 · ComingSoonModal:2925 · ONLINE_MODES:2941 · OnlineModeModal:2945 · TapPhase:2983 · MENU_CONFIRM_MS:2984 · useMenuTap:2985 · PlaqueSparks:3009 · PLAQUE_ASPECT:3028 · PLAQUE_CAP_CQW:3029 · MenuCard:3030 · MenuIconButton:3079 · MainMenu:3110 · InstallPrompt:3238 · DeckPickerModal:3274 · CARD_TYPE_ORDER:3305 · DeckSide:3306 · EditorSort:3307 · EDITOR_SORTS:3308 · EDITOR_MARGIN:3309 · EDITOR_FRAME:3310 · EDITOR_PAD:3311 · LIST_COLS:3314 · ROW_H:3315 · FULL_ART_TILE_SCALE:3316 · DeckEditor:3318 · ShopPhase:3936 · NpcMood:3937 · BoosterDef:3938 · BOOSTERS:3940 · TEST_FREE_BOOSTERS:3948 · SHELF_ROWS:3949 · SHELF_COLS:3950 · BOOSTER_ASPECT:3951 · SHELF_X0:3956 · SHELF_X1:3957 · SHELF_PLANKS:3958 · SHELF_OVERVIEW:3959 · SHELF_CLOSEUP:3960 · NPC_LINES:3962 · SHOP_ART:3970 · rollBooster:3978 · BoosterArt:3993 · NpcArt:4005 · PACK_TEAR_Y:4012 · LID_SLICES:4013 · LidSlice:4019 · PackTear:4042 · PulledCard:4111 · pullBooster:4112 · PackOpening:4125 · OpenBoosterFromTable:4204 · ShopScreen:4210 · AuthBackdrop:4450 · GoogleMark:4470 · DiscordMark:4473 · AuthButton:4479 · authFieldClass:4489 · LoginScreen:4491 · NAME_RULE:4552 · ProfileSetupScreen:4554 · VolumeRow:4620 · ToggleRow:4629 · OptionsModal:4639 · SettingsModal:4672 · playCoinSfx:4709 · COIN_THICK:4737 · CoinFace:4738 · CoinRim:4747 · RemotePick:4766 · CoinToss:4767 · MatchSearchOverlay:4849 · OnlineSearchOverlay:4882 · LoadingScreen:4951 · App:5005 · IMMEDIATE_ZONE_LABEL:10504 · DragFinger:10509 · GuideInfo:10526 · DragGuide:10527 · arrivalDrops:10594 · arrivalListener:10596 · EmblemKind:10601 · EMBLEM_ART:10602 · SlotEmblem:10603 · RowPlaque:10616 · CardSlot:10628

Dentro de `App` (linhas 5005–10503), funções internas:
openCardPicker:5264 · spawnFloatingNumber:5300 · spawnFloatingNumberAtId:5315 · showBanner:5342 · announcePhase:5363 · announceTurnChange:5371 · beginFinalBlow:5404 · endFinalBlow:5405 · blowIsSoaked:5408 · handleInstallClick:5492 · shieldOverSlot:5548 · popOverSlot:5557 · burstAt:5572 · whenGlowDone:5597 · endGlow:5598 · startTriggerFx:5602 · holdForSeat:5630 · terrainFxPlayer:5658 · terrainFxNpc:5659 · fireImpactBurst:5674 · noteDragPlay:5697 · handFanMaxAngleRad:5767 · getHandArrivalPoint:5866 · getFanRotation:5886 · getFanLift:5893 · computeDrawOrigin:5908 · showToast:5923 · announceCardPlay:5929 · toCardData:6003 · shownStats:6018 · boardView:6029 · syncView:6034 · processEvents:6067 · cardOverlayFx:6277 · fxRectOf:6368 · fxEnvFor:6374 · pickTacticSpot:6391 · tacticFxOf:6400 · planFx:6404 · commitState:6434 · dispatchAction:6457 · wakeWaiter:6476 · publishClock:6477 · dispatchOnline:6479 · reconcileOwn:6515 · applyUnasked:6529 · ingestRows:6543 · chooseFirstOnline:6571 · absorbAct:6584 · refuseOwn:6593 · sendOnline:6605 · stopOnline:6619 · startOnlinePolling:6634 · nextOpponentAction:6652 · applyRewardToProfile:6679 · openPlayerPick:6686 · playerAct:6713 · maybePromptRelicMode:6724 · confirmRelicMode:6734 · confirmUpkeep:6745 · endTurnNow:6757 · sleep:6776 · tutCurrent:6788 · tutCanBack:6792 · tutShow:6797 · tutGo:6813 · tutNext:6821 · tutBack:6835 · tutMatches:6840 · tutSignal:6852 · tutFromAction:6857 · tutBeat:6864 · tutExit:6871 · tutFinish:6878 · startTutorial:6879 · tutLaunchDuel:6884 · tutCoinResolved:6886 · settleAmbush:6943 · startMatchIntro:6976 · continueMatchIntro:6995 · resetGame:7087 · startGame:7140 · startOnlineMatch:7147 · leaveMatch:7187 · handleCardClick:7528 · handlePlayCardButtonClick:7588 · abilityStepCandidates:7656 · abilityHasTargets:7659 · getPlayerCreatureAbilityKind:7681 · getCardVisualEl:7695 · triggerPunch:7780 · renderTravelingArrow:7818 · playPendingTactic:7845 · resolveOwnTacticTarget:7852 · resolveEnemyTacticTarget:7857 · toggleCardPickerSelection:7865 · abilityOf:7879 · nextAbilityStep:7881 · activateAbility:7887 · abilityStepSide:7901 · resolveAbilityTarget:7907 · pushAbilityPrompt:7944 · mine:7965 · foes:7966 · effectTargetKind:7969 · specSlots:7971 · tacticTargeting:7985 · sourceAt:7992 · cancelTargeting:8010 · playHandCardOnTarget:8013 · heldTop:8020 · slotUnder:8021 · clearDragOver:8030 · dragBlockReason:8032 · tapHandCard:8044 · beginPress:8052 · returnHeld:8069 · dropHeldCard:8078 · updateHeld:8107 · dropOk:8126 · handleSlotClick:8182 · handleNpcSlotClick:8362 · handleBackgroundClick:8428 · getTappedCardShift:8459 · getSelectedCardX:8469 · getSelectedCardY:8491 · getBoardAnimation:8515 · getPlayerSlotHint:8556 · isTacticTargetSlot:8575 · tacticTagFor:8583 · shakePx:8646 · boardHeightMultiplier:8659 · boardTopMargin:8660

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

## src/DesafiosScreen.tsx  (174 linhas)
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

## src/TurnTracker.tsx  (143 linhas)
Marcador de turno/fases na tela da partida.

TRACKER_PHASES:11 · MEDALLION_X:13 · BAND_TOP:15 · TRACKER_NAMES:17 · PALETTE:21 · PLATE_W:28 · END_W:30 · trackerScale:31 · useTrackerScale:32 · Props:42 · TurnTracker:60

## src/tutorial/script.ts  (240 linhas)
Dados do tutorial 1: partida fixa, jogadas do treinador, passos e falas.

TutorialMeta:8 · TUTORIALS:9 · Expr:16 · NPC_NAME:17 · Tgt:20 · Until:27 · Step:36 · CHAPTERS:54 · HAND_P:57 · PILE_P:58 · HAND_E:59 · PILE_E:60 · uid:62 · fresh:63 · createTutorialMatch:69 · EnemyMove:80 · ADV:81 · ENEMY_SCRIPT:82 · nextEnemyAction:88 · PlayerMove:99 · PLAYER_PATH:100 · G:108 · E:109 · row:110 · TRACKER:111 · GOLD_ME:112 · GOLD_FOE:113 · INTRO_LINES:116 · COIN_STEP:123 · STEPS:125 · R:193 · BEATS:194 · OUTRO:207 · playTutorialForTest:213

## src/tutorial/ui.tsx  (266 linhas)
Peças visuais do tutorial: Aldric, mãozinha, escurecimento com buracos, lista.

NPC_ART:13 · npcArt:14 · GLYPH:15 · FONT_HEAD:17 · FONT_BODY:18 · NpcPortrait:20 · NpcPhoto:52 · PanelProps:78 · NpcPanel:88 · TapHand:136 · Hole:148 · roundedRectUri:154 · Spotlight:157 · DONE_KEY:193 · loadTutorialsDone:194 · markTutorialDone:195 · TutorialList:197 · TutorialIntro:234

## src/ui/Kit.tsx  (61 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

KitWindow:18 · KitTitle:22 · KitButton:29 · KitRow:39 · KitTab:43 · KitToggle:50 · KitRange:54

## src/ui/ThinFrame.tsx  (48 linhas)
Moldura fina reutilizável.

ThinFrame:8 · GameBox:29 · TONES:33 · TEXT:34 · GameButton:36

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
