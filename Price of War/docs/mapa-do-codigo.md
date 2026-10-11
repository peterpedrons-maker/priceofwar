<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11043 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:261 · DRAW_FLIGHT_MS:287 · sfxVol:296 · playCardDrawSfx:297 · playCardPlaySfx:311 · playAttackSfx:318 · playEffectSfx:320 · playTacticSfx:321 · playSelectSfx:329 · bannerAudioCtx:341 · playBannerSfx:342 · playUiClickSfx:385 · playCardLiftSfx:394 · playDamageSfx:406 · playGeneralDamageSfx:411 · playDestroySfx:421 · playRevealGeneralSfx:423 · playWarHornSfx:429 · playBatalhaBannerSfx:434 · playBatalhaImpactSfx:442 · CardType:448 · CardData:450 · StatTone:498 · STAT_TONE_COLOR:499 · STAT_TONE_GRADIENT:500 · statsOf:505 · SlotHint:514 · getSlotHint:523 · RowRoleHint:529 · SOLDIER_CARD_TYPES:530 · getRowRoleHint:531 · ROW_ROLE_VIEW:538 · PHASE_BANNER_TEXT:562 · BATALHA_FALL_MS:584 · BATALHA_IMPACT_FRACTION:585 · BANNER_LEARN_COUNT:589 · bannersSeen:590 · PHASE_BANNER_STAGE_MS:591 · phaseBannerMs:592 · PHASE_BANNER_Y:600 · PHASE_BANNER_MOTION:601 · HIT_STOP_MS:612 · ATTACK_MS:615 · ATTACK_WINDUP_FRAC:616 · ATTACK_WINDUP_PX:617 · ATTACK_TILT_DEG:618 · IMPACT_MS:619 · TIME:622 · rangedKindOf:624 · FINAL_SLOW:625 · FINAL_INTRO_MS:626 · FINAL_FREEZE_MS:627 · FINAL_AFTER_MS:628 · SLASH_SPARK_ANGLES:631 · SlashEffect:640 · TargetKind:678 · TARGET_STYLE:679 · HUD_CARD_SCALE:685 · AmountBadge:689 · TargetingHud:706 · READY_COLORS:776 · SILHOUETTES:781 · silhouetteFor:786 · TriggerIcon:796 · FLIGHT_MS:810 · HELD_SCALE:811 · HELD_GAP:812 · TriggerBurst:813 · TriggerFloatLayer:834 · AbilityReadyGlow:851 · TutRect:882 · tutPct:883 · tutSilBox:884 · tutElRect:893 · tutPad:894 · tutUnion:895 · TutResolved:900 · TUT_EMPTY:901 · visibleHandCards:902 · resolveTutTarget:903 · TutorialStage:950 · SpriteOnce:994 · EffectIcon:1011 · EFFECT_ICONS:1012 · SpriteIcon:1020 · IconPop:1025 · SHIELD_SHEETS:1040 · GOLD_BUBBLE:1046 · ShieldAura:1047 · ShieldFxOnce:1067 · EquipFxLayer:1081 · PUNCH_FRAMES:1127 · PUNCH_FRAME_W:1128 · PunchFx:1130 · BURN_FRAMES:1166 · BurningCard:1168 · GraveyardPile:1218 · AtkBadge:1250 · NUMBER_KIND_OF:1262 · NUMBER_TIERS:1267 · damageTier:1273 · floatLife:1274 · FloatNumber:1275 · HpBadge:1323 · GoldBadge:1352 · GoldNumber:1381 · CardBack:1441 · CARD_THICKNESS_SHADOW:1479 · cardBoxShadow:1490 · cardGlowFilter:1491 · CARD_FACE_VARIANTS:1501 · NO_STAT_TYPES:1518 · templateForType:1519 · templateForTypeMini:1524 · FitText:1543 · KeywordPill:1618 · STAT_TOKEN:1632 · STAT_NUMBER_STYLE:1633 · StatSymbol:1634 · DamageSymbol:1641 · renderEffectText:1652 · FitEffectText:1671 · FULL_ART_PLATE_VARIANTS:1735 · FULL_ART_SIZE_FIX:1745 · CardFaceFullArt:1746 · FullArtMiniConfig:1867 · FULL_ART_MINI_CONFIG:1872 · usesLightBar:1900 · nameTextStyle:1901 · FULL_ART_MINI_DEFAULT:1904 · fullArtMiniConfigForType:1909 · CardFaceFullArtMini:1924 · CARD_FACE_MINI_STD_SCALE:1973 · CardFaceStandardMini:1974 · CardFace:2037 · BOARD_EXTERIOR_ART_URL:2149 · FIELD_PREVIEW_SCALE:2154 · BOARD_PREVIEW_SCALE:2172 · FAN_SPREAD_DEG:2175 · FAN_LIFT_PX:2176 · HAND_CARD_WIDTH:2177 · HAND_CARD_HEIGHT:2178 · HAND_CARD_STEP:2181 · HAND_FULL_SPREAD_COUNT:2184 · HAND_SELECT_SCALE:2187 · handStepFor:2188 · ART_BY_NAME:2195 · MERC_ART_FILES:2249 · artSlug:2250 · cardDataFromName:2256 · buildDeckCards:2260 · DECK_CAPITAO:2268 · DECK_CARDEAL:2269 · DECK_MERCENARIOS:2270 · DECKS:2274 · ALL_DECK_IDS:2297 · BOOSTER_POOLS:2300 · DECK_STORE_KEY:2315 · CARD_INSTANCES_BY_NAME:2317 · cardByName:2325 · isGeneralName:2326 · DeckSlot:2328 · DeckStore:2329 · DeckSelection:2331 · OnlineMatch:2337 · needsServer:2369 · visibleKey:2381 · countByName:2386 · CAPITAO_STARTER_NAME:2392 · MERC_STARTER_NAME:2393 · CLOUD_DECK_SLOTS:2395 · MAX_DECK_SLOTS:2396 · buildStarterStore:2399 · sameCards:2421 · ensureStarterDecks:2425 · lastSanitizeMigrated:2452 · sanitizeDeckStore:2453 · loadDeckStore:2482 · cloudUserId:2496 · pushTimer:2497 · pushing:2498 · pushAgain:2499 · toCloudDecks:2500 · runPush:2501 · saveDeckStore:2514 · stopCloudSync:2519 · flushCloudSync:2521 · syncDeckStoreWithCloud:2532 · deckCardCount:2560 · deckProblem:2562 · buildDeckSelection:2568 · deckIdOfGeneral:2576 · DEFAULT_DECK_SELECTION:2577 · PlayerProfile:2586 · AVATAR_OPTIONS:2601 · avatarById:2609 · PROFILE_STORAGE_KEY:2611 · DEFAULT_PROFILE:2612 · loadProfile:2625 · formatCoroas:2639 · saveProfile:2644 · MODE_LABELS_PT:2653 · AvatarBadge:2663 · WINDOW_FRAME_PX:2683 · WINDOW_FONT_DECO:2684 · FramedWindow:2686 · WindowOverlay:2691 · WindowDivider:2714 · WindowTitle:2722 · Edges:2730 · ArtFrame:2731 · VLine:2752 · HLine:2755 · ArtChip:2760 · WindowOption:2766 · WindowText:2770 · WindowButton:2774 · AvatarPickerModal:2780 · ALLOW_PROFILE_RENAME:2817 · ProfileBar:2818 · ComingSoonModal:2939 · ONLINE_MODES:2955 · OnlineModeModal:2959 · TapPhase:2991 · MENU_CONFIRM_MS:2992 · useMenuTap:2993 · PlaqueSparks:3017 · PLAQUE_ASPECT:3036 · PLAQUE_CAP_CQW:3037 · MenuCard:3038 · MenuIconButton:3087 · MainMenu:3118 · InstallPrompt:3253 · DeckPickerModal:3289 · CARD_TYPE_ORDER:3320 · DeckSide:3321 · EditorSort:3322 · EDITOR_SORTS:3323 · EDITOR_MARGIN:3324 · EDITOR_FRAME:3325 · EDITOR_PAD:3326 · LIST_COLS:3329 · ROW_H:3330 · FULL_ART_TILE_SCALE:3331 · DeckEditor:3333 · ShopPhase:3896 · NpcMood:3897 · BoosterDef:3898 · BOOSTERS:3900 · TEST_FREE_BOOSTERS:3908 · SHELF_ROWS:3909 · SHELF_COLS:3910 · BOOSTER_ASPECT:3911 · SHELF_X0:3916 · SHELF_X1:3917 · SHELF_PLANKS:3918 · SHELF_OVERVIEW:3919 · SHELF_CLOSEUP:3920 · NPC_LINES:3922 · SHOP_ART:3930 · rollBooster:3938 · BoosterArt:3953 · NpcArt:3965 · PACK_TEAR_Y:3972 · LID_SLICES:3973 · LidSlice:3979 · PackTear:4002 · PulledCard:4071 · pullBooster:4072 · PackOpening:4085 · OpenBoosterFromTable:4164 · ShopScreen:4170 · AuthBackdrop:4410 · GoogleMark:4431 · DiscordMark:4434 · AuthButton:4436 · authFieldClass:4442 · LoginScreen:4444 · NAME_RULE:4505 · ProfileSetupScreen:4507 · VolumeRow:4573 · ToggleRow:4582 · OptionsModal:4592 · SettingsModal:4625 · playCoinSfx:4662 · COIN_THICK:4690 · CoinFace:4691 · CoinRim:4700 · RemotePick:4719 · CoinToss:4720 · MatchSearchOverlay:4802 · OnlineSearchOverlay:4843 · LoadingScreen:4918 · App:4972 · IMMEDIATE_ZONE_LABEL:10505 · DragFinger:10510 · GuideInfo:10527 · DragGuide:10528 · arrivalDrops:10595 · arrivalListener:10597 · EmblemKind:10602 · EMBLEM_ART:10603 · SlotEmblem:10604 · RowPlaque:10617 · CardSlot:10629

Dentro de `App` (linhas 4972–10504), funções internas:
attackMarkFor:5215 · openCardPicker:5242 · spawnFloatingNumber:5278 · spawnFloatingNumberAtId:5293 · showBanner:5320 · announcePhase:5344 · announceTurnChange:5354 · beginFinalBlow:5387 · endFinalBlow:5388 · blowIsSoaked:5391 · handleInstallClick:5475 · shieldOverSlot:5531 · popOverSlot:5540 · burstAt:5555 · whenGlowDone:5580 · endGlow:5581 · startTriggerFx:5585 · holdForSeat:5613 · terrainFxPlayer:5641 · terrainFxNpc:5642 · fireImpactBurst:5657 · noteDragPlay:5680 · handFanMaxAngleRad:5750 · getHandArrivalPoint:5853 · getFanRotation:5873 · getFanLift:5880 · computeDrawOrigin:5895 · showToast:5910 · announceCardPlay:5916 · toCardData:5990 · shownStats:6005 · boardView:6016 · syncView:6021 · processEvents:6054 · cardOverlayFx:6264 · fxRectOf:6355 · fxEnvFor:6361 · pickTacticSpot:6378 · tacticFxOf:6387 · planFx:6391 · commitState:6421 · dispatchAction:6444 · wakeWaiter:6463 · publishClock:6464 · dispatchOnline:6466 · reconcileOwn:6502 · applyUnasked:6516 · ingestRows:6530 · chooseFirstOnline:6558 · absorbAct:6571 · refuseOwn:6580 · sendOnline:6592 · stopOnline:6606 · startOnlinePolling:6622 · nextOpponentAction:6640 · applyRewardToProfile:6667 · openPlayerPick:6674 · playerAct:6701 · maybePromptRelicMode:6712 · confirmRelicMode:6722 · confirmUpkeep:6733 · endTurnNow:6745 · sleep:6764 · tutCurrent:6776 · tutCanBack:6780 · tutShow:6785 · tutGo:6801 · tutNext:6809 · tutBack:6823 · tutMatches:6828 · tutSignal:6840 · tutFromAction:6845 · tutBeat:6852 · tutExit:6859 · tutFinish:6866 · startTutorial:6867 · tutLaunchDuel:6872 · tutCoinResolved:6874 · settleAmbush:6931 · startMatchIntro:6964 · continueMatchIntro:6983 · resetGame:7075 · startGame:7128 · startOnlineMatch:7135 · leaveMatch:7176 · handleCardClick:7531 · handlePlayCardButtonClick:7591 · abilityStepCandidates:7650 · abilityHasTargets:7653 · getPlayerCreatureAbilityKind:7675 · getCardVisualEl:7689 · triggerPunch:7774 · renderTravelingArrow:7812 · playPendingTactic:7839 · resolveOwnTacticTarget:7846 · resolveEnemyTacticTarget:7851 · toggleCardPickerSelection:7859 · abilityOf:7873 · nextAbilityStep:7875 · activateAbility:7881 · abilityStepSide:7895 · resolveAbilityTarget:7901 · pushAbilityPrompt:7938 · mine:7959 · foes:7960 · effectTargetKind:7963 · specSlots:7965 · tacticTargeting:7979 · sourceAt:7986 · cancelTargeting:8004 · playHandCardOnTarget:8007 · heldTop:8014 · slotUnder:8015 · clearDragOver:8024 · dragBlockReason:8026 · tapHandCard:8038 · beginPress:8046 · returnHeld:8063 · dropHeldCard:8072 · updateHeld:8101 · dropOk:8120 · handleSlotClick:8176 · handleNpcSlotClick:8356 · handleBackgroundClick:8422 · getTappedCardShift:8453 · getSelectedCardX:8463 · getSelectedCardY:8485 · getBoardAnimation:8509 · getPlayerSlotHint:8550 · isTacticTargetSlot:8569 · tacticTagFor:8577 · shakePx:8640 · boardHeightMultiplier:8653 · boardTopMargin:8654

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

## src/engine/ranked.ts  (99 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LEAGUES:9 · League:10 · LEAGUE_NAMES:11 · POINTS_PER_DIVISION:14 · DIVISIONS:15 · POINTS_PER_LEAGUE:16 · MESTRE_FROM:17 · TOP_LEAGUE_SIZE:18 · PLACEMENT_MATCHES:20 · START_MMR:21 · START_POINTS:22 · RankedProfile:24 · newRankedProfile:25 · LeagueInfo:27 · leagueOf:29 · ROMAN:37 · leagueLabel:38 · leagueIndex:43 · RankedInput:46 · RankedResult:55 · expected:57 · clamp:58 · applyRankedMatch:60 · mmrWindow:92 · withTopLeague:95

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

## src/RankedScreens.tsx  (283 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LeagueKey:36 · EMBLEM:37 · LEAGUE_COLOR:38 · RANGES:39 · keyOfPoints:40 · labelOfPoints:41 · DECO:43 · CINZEL:44 · SERIF:45 · Win:48 · KitButton:64 · Row:68 · Divisions:76 · PointsBar:83 · Emblem:101 · LigasScreen:104 · REWARD_LINES:153 · RewardsScreen:157 · RankingScreen:172 · RankedResult:217 · PromoBurst:245 · PromotionOverlay:259

## src/services/auth.ts  (130 linhas)
Login (convidado, Google, Discord, e-mail) via Supabase.

AuthProvider:9 · Session:10 · OAuthProvider:11 · URL:13 · KEY:14 · authMode:15 · LOCAL_SESSION_KEY:17 · clientPromise:19 · client:20 · getClient:29 · fromUser:31 · readLocal:36 · writeLocal:39 · localListeners:42 · emitLocal:43 · remoteListeners:46 · announceRemote:47 · getSession:49 · onSessionChange:56 · authErrorText:70 · signInOAuth:83 · signInEmail:90 · signInGuest:105 · authErrorDetail:120 · signOut:126

## src/services/cloud.ts  (95 linhas)
Salvar/ler coleção e decks na nuvem.

CloudProfile:5 · CloudResult:6 · COLUMNS:8 · fail:10 · fetchProfile:22 · usernameAvailable:30 · createProfile:38 · updateProfileFields:46 · CloudDeck:55 · CloudStore:56 · fetchStore:58 · pushStore:75

## src/services/online.ts  (119 linhas)
Cliente do modo online: fila, partida por passos, relógio.

DeckJson:9 · ViewRow:12 · RewardInfo:21 · MatchInit:33 · QueueResult:54 · ActResult:59 · call:64 · asActResult:81 · queueForMatch:86 · queueStatus:87 · cancelQueue:88 · sendAction:89 · tickMatch:91 · fetchResult:92 · fetchViews:98 · EmoteMsg:107 · EmoteResult:108 · asEmoteResult:109 · sendEmote:111 · fetchEmotes:112 · RankedView:115 · RankingRow:116 · fetchRanked:117 · fetchRanking:118

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

## server/handler.ts  (438 linhas)
Servidor da partida online: fila, passos, relógio, recompensas.

GameConfig:17 · defaultConfig:29 · MatchInit:31 · EMOTE_CODE:58 · EMOTE_GAP_MS:59 · EMOTE_MAX_PER_MATCH:60 · RankedView:63 · PLACEMENT:64 · rankedView:65 · GameRequest:72 · GameResponse:84 · BOT_PROFILE:94 · STALE_MATCH_MS:95 · BOT_STEP_LIMIT:96 · AUTO_STEP_LIMIT:97 · recipeDeck:99 · botDeckFor:101 · playerOf:102 · userOfSeat:103 · moverOf:104 · moverKey:105 · Work:110 · startWork:119 · applyStep:122 · runBot:145 · patchOf:156 · ensureRewards:163 · publicReward:201 · rewardOf:207 · enforceClock:212 · openMatch:250 · viewRowsOf:257 · initOf:259 · startMatch:274 · finishIfStale:300 · handleGame:310

## server/memoryDb.ts  (107 linhas)
Banco em memória (testes).

MemoryTables:6 · clone:11 · MemoryDb:13

## server/supabaseDb.ts  (122 linhas)
Banco no Supabase.

Client:8 · must:10 · viewToDb:15 · viewFromDb:18 · matchFromDb:19 · supabaseDb:21

## server/types.ts  (111 linhas)
Tipos do servidor e do banco.

DeckJson:7 · QueueRow:9 · StepRow:17 · ViewRow:25 · EndReason:36 · RewardRow:38 · RankedOutcome:51 · MatchRow:56 · MatchPatch:77 · EmoteRow:80 · Db:82

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

## tests/online-server.ts  (480 linhas)
Testes do servidor online (npm test).

passed:12 · test:13 · ok:16 · eq:17 · clock:19 · rngState:20 · cfg:21 · fresh:26 · deckOf:37 · matched:43 · userOf:45 · choose:47 · botMatch:49 · pvp:56 · drive:64

## tests/ranked.ts  (71 linhas)
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
