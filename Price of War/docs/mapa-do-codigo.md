<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11057 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:251 · DRAW_FLIGHT_MS:277 · sfxVol:286 · playCardDrawSfx:287 · playCardPlaySfx:301 · playAttackSfx:308 · playEffectSfx:310 · playTacticSfx:311 · playSelectSfx:319 · bannerAudioCtx:331 · playBannerSfx:332 · playUiClickSfx:375 · playCardLiftSfx:384 · playDamageSfx:396 · playGeneralDamageSfx:401 · playDestroySfx:411 · playRevealGeneralSfx:413 · playBatalhaBannerSfx:418 · playBatalhaImpactSfx:426 · CardType:432 · CardData:434 · StatTone:482 · STAT_TONE_COLOR:483 · STAT_TONE_GRADIENT:484 · statsOf:489 · SlotHint:498 · getSlotHint:507 · RowRoleHint:513 · SOLDIER_CARD_TYPES:514 · getRowRoleHint:515 · ROW_ROLE_VIEW:522 · PHASE_BANNER_TEXT:546 · BATALHA_FALL_MS:568 · BATALHA_IMPACT_FRACTION:569 · BANNER_LEARN_COUNT:573 · bannersSeen:574 · PHASE_BANNER_STAGE_MS:575 · phaseBannerMs:576 · PHASE_BANNER_Y:584 · PHASE_BANNER_MOTION:585 · HIT_STOP_MS:596 · ATTACK_MS:599 · ATTACK_WINDUP_FRAC:600 · ATTACK_WINDUP_PX:601 · ATTACK_TILT_DEG:602 · IMPACT_MS:603 · TIME:606 · rangedKindOf:608 · FINAL_SLOW:609 · FINAL_INTRO_MS:610 · FINAL_FREEZE_MS:611 · FINAL_AFTER_MS:612 · SLASH_SPARK_ANGLES:615 · SlashEffect:624 · TargetKind:662 · TARGET_STYLE:663 · HUD_CARD_SCALE:669 · AmountBadge:673 · TargetingHud:690 · READY_COLORS:760 · SILHOUETTES:765 · silhouetteFor:770 · TriggerIcon:780 · FLIGHT_MS:794 · HELD_SCALE:795 · HELD_GAP:796 · TriggerBurst:797 · TriggerFloatLayer:818 · AbilityReadyGlow:835 · TutRect:866 · tutPct:867 · tutSilBox:868 · tutElRect:877 · tutPad:878 · tutUnion:879 · TutResolved:884 · TUT_EMPTY:885 · visibleHandCards:886 · resolveTutTarget:887 · TutorialStage:934 · SpriteOnce:978 · EffectIcon:995 · EFFECT_ICONS:996 · SpriteIcon:1004 · IconPop:1009 · SHIELD_SHEETS:1024 · GOLD_BUBBLE:1030 · ShieldAura:1031 · ShieldFxOnce:1051 · EquipFxLayer:1065 · PUNCH_FRAMES:1111 · PUNCH_FRAME_W:1112 · PunchFx:1114 · BURN_FRAMES:1150 · BurningCard:1152 · GraveyardPile:1202 · AtkBadge:1234 · NUMBER_KIND_OF:1246 · NUMBER_TIERS:1251 · damageTier:1257 · floatLife:1258 · FloatNumber:1259 · HpBadge:1307 · GoldBadge:1336 · GoldNumber:1365 · CardBack:1425 · CARD_THICKNESS_SHADOW:1463 · cardBoxShadow:1474 · cardGlowFilter:1475 · CARD_FACE_VARIANTS:1485 · NO_STAT_TYPES:1502 · templateForType:1503 · templateForTypeMini:1508 · FitText:1527 · KeywordPill:1602 · STAT_TOKEN:1616 · STAT_NUMBER_STYLE:1617 · StatSymbol:1618 · DamageSymbol:1625 · renderEffectText:1636 · FitEffectText:1655 · FULL_ART_PLATE_VARIANTS:1719 · FULL_ART_SIZE_FIX:1729 · CardFaceFullArt:1730 · FullArtMiniConfig:1851 · FULL_ART_MINI_CONFIG:1856 · usesLightBar:1884 · nameTextStyle:1885 · FULL_ART_MINI_DEFAULT:1888 · fullArtMiniConfigForType:1893 · CardFaceFullArtMini:1908 · CARD_FACE_MINI_STD_SCALE:1957 · CardFaceStandardMini:1958 · CardFace:2021 · BOARD_EXTERIOR_ART_URL:2133 · FIELD_PREVIEW_SCALE:2138 · BOARD_PREVIEW_SCALE:2156 · FAN_SPREAD_DEG:2159 · FAN_LIFT_PX:2160 · HAND_CARD_WIDTH:2161 · HAND_CARD_HEIGHT:2162 · HAND_CARD_STEP:2165 · HAND_FULL_SPREAD_COUNT:2168 · HAND_SELECT_SCALE:2171 · handStepFor:2172 · ART_BY_NAME:2179 · MERC_ART_FILES:2233 · artSlug:2234 · cardDataFromName:2240 · buildDeckCards:2244 · DECK_CAPITAO:2252 · DECK_CARDEAL:2253 · DECK_MERCENARIOS:2254 · DECKS:2258 · ALL_DECK_IDS:2281 · BOOSTER_POOLS:2284 · DECK_STORE_KEY:2299 · CARD_INSTANCES_BY_NAME:2301 · cardByName:2309 · isGeneralName:2310 · DeckSlot:2312 · DeckStore:2313 · DeckSelection:2315 · OnlineMatch:2321 · needsServer:2353 · visibleKey:2365 · countByName:2370 · CAPITAO_STARTER_NAME:2376 · MERC_STARTER_NAME:2377 · CLOUD_DECK_SLOTS:2379 · MAX_DECK_SLOTS:2380 · buildStarterStore:2383 · sameCards:2405 · ensureStarterDecks:2409 · lastSanitizeMigrated:2436 · sanitizeDeckStore:2437 · loadDeckStore:2466 · cloudUserId:2480 · pushTimer:2481 · pushing:2482 · pushAgain:2483 · toCloudDecks:2484 · runPush:2485 · saveDeckStore:2498 · stopCloudSync:2503 · flushCloudSync:2505 · syncDeckStoreWithCloud:2516 · deckCardCount:2544 · deckProblem:2546 · buildDeckSelection:2552 · deckIdOfGeneral:2560 · DEFAULT_DECK_SELECTION:2561 · PlayerProfile:2570 · AVATAR_OPTIONS:2585 · avatarById:2593 · PROFILE_STORAGE_KEY:2595 · DEFAULT_PROFILE:2596 · loadProfile:2609 · formatCoroas:2623 · saveProfile:2628 · MODE_LABELS_PT:2637 · AvatarBadge:2647 · WINDOW_FRAME_PX:2667 · WINDOW_FONT_DECO:2668 · FramedWindow:2670 · WindowOverlay:2695 · WindowDivider:2718 · WindowTitle:2726 · Edges:2744 · ArtFrame:2745 · VLine:2766 · HLine:2769 · ArtChip:2774 · WindowOption:2789 · WindowText:2797 · WindowButton:2801 · AvatarPickerModal:2816 · ALLOW_PROFILE_RENAME:2853 · ProfileBar:2854 · ComingSoonModal:2975 · ONLINE_MODES:2991 · OnlineModeModal:2995 · TapPhase:3033 · MENU_CONFIRM_MS:3034 · useMenuTap:3035 · PlaqueSparks:3059 · PLAQUE_ASPECT:3078 · PLAQUE_CAP_CQW:3079 · MenuCard:3080 · MenuIconButton:3129 · MainMenu:3160 · InstallPrompt:3288 · DeckPickerModal:3324 · CARD_TYPE_ORDER:3355 · DeckSide:3356 · EditorSort:3357 · EDITOR_SORTS:3358 · EDITOR_MARGIN:3359 · EDITOR_FRAME:3360 · EDITOR_PAD:3361 · LIST_COLS:3364 · ROW_H:3365 · FULL_ART_TILE_SCALE:3366 · DeckEditor:3368 · ShopPhase:3986 · NpcMood:3987 · BoosterDef:3988 · BOOSTERS:3990 · TEST_FREE_BOOSTERS:3998 · SHELF_ROWS:3999 · SHELF_COLS:4000 · BOOSTER_ASPECT:4001 · SHELF_X0:4006 · SHELF_X1:4007 · SHELF_PLANKS:4008 · SHELF_OVERVIEW:4009 · SHELF_CLOSEUP:4010 · NPC_LINES:4012 · SHOP_ART:4020 · rollBooster:4028 · BoosterArt:4043 · NpcArt:4055 · PACK_TEAR_Y:4062 · LID_SLICES:4063 · LidSlice:4069 · PackTear:4092 · PulledCard:4161 · pullBooster:4162 · PackOpening:4175 · OpenBoosterFromTable:4254 · ShopScreen:4260 · AuthBackdrop:4500 · GoogleMark:4520 · DiscordMark:4523 · AuthButton:4529 · authFieldClass:4539 · LoginScreen:4541 · NAME_RULE:4602 · ProfileSetupScreen:4604 · VolumeRow:4670 · ToggleRow:4684 · OptionsModal:4696 · SettingsModal:4725 · playCoinSfx:4762 · COIN_THICK:4790 · CoinFace:4791 · CoinRim:4800 · RemotePick:4819 · CoinToss:4820 · MatchSearchOverlay:4902 · OnlineSearchOverlay:4935 · LoadingScreen:5004 · App:5058 · IMMEDIATE_ZONE_LABEL:10545 · DragFinger:10550 · GuideInfo:10567 · DragGuide:10568 · arrivalDrops:10635 · arrivalListener:10637 · EmblemKind:10642 · EMBLEM_ART:10643 · SlotEmblem:10644 · RowPlaque:10657 · CardSlot:10669

Dentro de `App` (linhas 5058–10544), funções internas:
openCardPicker:5316 · spawnFloatingNumber:5352 · spawnFloatingNumberAtId:5367 · showBanner:5394 · announcePhase:5415 · announceTurnChange:5423 · beginFinalBlow:5456 · endFinalBlow:5457 · blowIsSoaked:5460 · handleInstallClick:5544 · shieldOverSlot:5600 · popOverSlot:5609 · burstAt:5624 · whenGlowDone:5649 · endGlow:5650 · startTriggerFx:5654 · holdForSeat:5682 · fireImpactBurst:5715 · noteDragPlay:5738 · handFanMaxAngleRad:5808 · getHandArrivalPoint:5907 · getFanRotation:5927 · getFanLift:5934 · computeDrawOrigin:5949 · showToast:5964 · announceCardPlay:5970 · toCardData:6044 · shownStats:6059 · boardView:6070 · syncView:6075 · processEvents:6108 · cardOverlayFx:6318 · fxRectOf:6409 · fxEnvFor:6415 · pickTacticSpot:6432 · tacticFxOf:6441 · planFx:6445 · commitState:6475 · dispatchAction:6498 · wakeWaiter:6517 · publishClock:6518 · dispatchOnline:6520 · reconcileOwn:6556 · applyUnasked:6570 · ingestRows:6584 · chooseFirstOnline:6612 · absorbAct:6625 · refuseOwn:6634 · sendOnline:6646 · stopOnline:6660 · startOnlinePolling:6675 · nextOpponentAction:6693 · applyRewardToProfile:6720 · openPlayerPick:6727 · playerAct:6754 · maybePromptRelicMode:6765 · confirmRelicMode:6775 · confirmUpkeep:6786 · endTurnNow:6798 · sleep:6817 · tutCurrent:6829 · tutCanBack:6833 · tutShow:6838 · tutGo:6854 · tutNext:6862 · tutBack:6876 · tutMatches:6881 · tutSignal:6893 · tutFromAction:6898 · tutBeat:6905 · tutExit:6912 · tutFinish:6919 · startTutorial:6920 · tutLaunchDuel:6925 · tutCoinResolved:6927 · settleAmbush:6984 · startMatchIntro:7017 · continueMatchIntro:7036 · resetGame:7128 · startGame:7181 · startOnlineMatch:7188 · leaveMatch:7228 · handleCardClick:7569 · handlePlayCardButtonClick:7629 · abilityStepCandidates:7697 · abilityHasTargets:7700 · getPlayerCreatureAbilityKind:7722 · getCardVisualEl:7736 · triggerPunch:7821 · renderTravelingArrow:7859 · playPendingTactic:7886 · resolveOwnTacticTarget:7893 · resolveEnemyTacticTarget:7898 · toggleCardPickerSelection:7906 · abilityOf:7920 · nextAbilityStep:7922 · activateAbility:7928 · abilityStepSide:7942 · resolveAbilityTarget:7948 · pushAbilityPrompt:7985 · mine:8006 · foes:8007 · effectTargetKind:8010 · specSlots:8012 · tacticTargeting:8026 · sourceAt:8033 · cancelTargeting:8051 · playHandCardOnTarget:8054 · heldTop:8061 · slotUnder:8062 · clearDragOver:8071 · dragBlockReason:8073 · tapHandCard:8085 · beginPress:8093 · returnHeld:8110 · dropHeldCard:8119 · updateHeld:8148 · dropOk:8167 · handleSlotClick:8223 · handleNpcSlotClick:8403 · handleBackgroundClick:8469 · getTappedCardShift:8500 · getSelectedCardX:8510 · getSelectedCardY:8532 · getBoardAnimation:8556 · getPlayerSlotHint:8597 · isTacticTargetSlot:8616 · tacticTagFor:8624 · shakePx:8687 · boardHeightMultiplier:8700 · boardTopMargin:8701

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
