<!-- GERADO por `npm run map` (tools/gen-code-map.ts): não edite à mão. As descrições de cada arquivo ficam em FILE_NOTES, no gerador. -->
# Mapa do código

Como achar as coisas sem ler tudo: procure o nome aqui (`grep -n NomeDaCoisa docs/mapa-do-codigo.md`), abra o arquivo na linha indicada.
As linhas são do momento em que o mapa foi gerado; depois de mexer no código, rode `npm run map`.

## src/App.tsx  (11103 linhas)
O app inteiro da tela: menu, perfil, loja, editor de decks, login, moeda, a partida (componente App) e o desenho das cartas. Arquivo gigante: use o índice abaixo.

CardViewer3D:8 · CollectionRoom:9 · ALL_PRELOAD_IMAGES:262 · DRAW_FLIGHT_MS:288 · sfxVol:297 · playCardDrawSfx:298 · playCardPlaySfx:312 · playAttackSfx:319 · playEffectSfx:321 · playTacticSfx:322 · playSelectSfx:330 · bannerAudioCtx:342 · playBannerSfx:343 · playUiClickSfx:386 · playCardLiftSfx:395 · playDamageSfx:407 · playGeneralDamageSfx:412 · playDestroySfx:422 · playRevealGeneralSfx:424 · playWarHornSfx:430 · playBatalhaBannerSfx:435 · playBatalhaImpactSfx:443 · CardType:449 · CardData:451 · StatTone:499 · STAT_TONE_COLOR:500 · STAT_TONE_GRADIENT:501 · statsOf:506 · SlotHint:515 · getSlotHint:524 · RowRoleHint:530 · SOLDIER_CARD_TYPES:531 · getRowRoleHint:532 · ROW_ROLE_VIEW:539 · PHASE_BANNER_TEXT:563 · BATALHA_FALL_MS:585 · BATALHA_IMPACT_FRACTION:586 · BANNER_LEARN_COUNT:590 · bannersSeen:591 · PHASE_BANNER_STAGE_MS:592 · phaseBannerMs:593 · PHASE_BANNER_Y:601 · PHASE_BANNER_MOTION:602 · HIT_STOP_MS:613 · ATTACK_MS:616 · ATTACK_WINDUP_FRAC:617 · ATTACK_WINDUP_PX:618 · ATTACK_TILT_DEG:619 · IMPACT_MS:620 · TIME:623 · rangedKindOf:625 · FINAL_SLOW:626 · FINAL_INTRO_MS:627 · FINAL_FREEZE_MS:628 · FINAL_AFTER_MS:629 · SLASH_SPARK_ANGLES:632 · SlashEffect:641 · TargetKind:679 · TARGET_STYLE:680 · HUD_CARD_SCALE:686 · AmountBadge:690 · TargetingHud:707 · READY_COLORS:777 · SILHOUETTES:782 · silhouetteFor:787 · DEBUG_HOOKS:798 · TriggerIcon:800 · FLIGHT_MS:814 · HELD_SCALE:815 · HELD_GAP:816 · TriggerBurst:817 · TriggerFloatLayer:838 · AbilityReadyGlow:855 · TutRect:886 · tutPct:887 · tutSilBox:888 · tutElRect:897 · tutPad:898 · tutUnion:899 · TutResolved:904 · TUT_EMPTY:905 · visibleHandCards:906 · resolveTutTarget:907 · TutorialStage:954 · SpriteOnce:998 · EffectIcon:1015 · EFFECT_ICONS:1016 · SpriteIcon:1024 · IconPop:1029 · SHIELD_SHEETS:1044 · GOLD_BUBBLE:1050 · ShieldAura:1051 · ShieldFxOnce:1071 · EquipFxLayer:1085 · PUNCH_FRAMES:1131 · PUNCH_FRAME_W:1132 · PunchFx:1134 · BURN_FRAMES:1170 · BurningCard:1172 · GraveyardPile:1222 · AtkBadge:1254 · NUMBER_KIND_OF:1266 · NUMBER_TIERS:1271 · damageTier:1277 · floatLife:1278 · FloatNumber:1279 · HpBadge:1327 · GoldBadge:1356 · GoldNumber:1385 · CardBack:1445 · CARD_THICKNESS_SHADOW:1483 · cardBoxShadow:1494 · cardGlowFilter:1495 · CARD_FACE_VARIANTS:1505 · NO_STAT_TYPES:1522 · templateForType:1523 · templateForTypeMini:1528 · FitText:1547 · KeywordPill:1622 · STAT_TOKEN:1636 · STAT_NUMBER_STYLE:1637 · StatSymbol:1638 · CoinIcon:1646 · GoldSymbol:1649 · DamageSymbol:1654 · renderEffectText:1665 · FitEffectText:1698 · FULL_ART_PLATE_VARIANTS:1762 · FULL_ART_SIZE_FIX:1772 · CardFaceFullArt:1773 · FullArtMiniConfig:1895 · FULL_ART_MINI_CONFIG:1900 · usesLightBar:1928 · nameTextStyle:1929 · FULL_ART_MINI_DEFAULT:1932 · fullArtMiniConfigForType:1937 · CardFaceFullArtMini:1952 · CARD_FACE_MINI_STD_SCALE:2001 · CardFaceStandardMini:2002 · CardFace:2065 · BOARD_EXTERIOR_ART_URL:2178 · FIELD_PREVIEW_SCALE:2183 · BOARD_PREVIEW_SCALE:2201 · FAN_SPREAD_DEG:2204 · FAN_LIFT_PX:2205 · HAND_CARD_WIDTH:2206 · HAND_CARD_HEIGHT:2207 · HAND_CARD_STEP:2210 · HAND_FULL_SPREAD_COUNT:2213 · HAND_SELECT_SCALE:2216 · handStepFor:2217 · ART_BY_NAME:2224 · MERC_ART_FILES:2278 · artSlug:2279 · CAPITAO_ART_FILES:2285 · cardDataFromName:2291 · buildDeckCards:2295 · DECK_CAPITAO:2303 · DECK_CARDEAL:2304 · DECK_MERCENARIOS:2305 · DECKS:2309 · ALL_DECK_IDS:2332 · BOOSTER_POOLS:2335 · DECK_STORE_KEY:2355 · CARD_INSTANCES_BY_NAME:2357 · cardByName:2365 · isGeneralName:2366 · DeckSlot:2368 · DeckStore:2369 · DeckSelection:2371 · OnlineMatch:2377 · needsServer:2409 · visibleKey:2421 · countByName:2426 · CAPITAO_STARTER_NAME:2432 · MERC_STARTER_NAME:2433 · CLOUD_DECK_SLOTS:2435 · MAX_DECK_SLOTS:2436 · buildStarterStore:2439 · sameCards:2461 · ensureStarterDecks:2465 · lastSanitizeMigrated:2492 · sanitizeDeckStore:2493 · loadDeckStore:2522 · cloudUserId:2536 · pushTimer:2537 · pushing:2538 · pushAgain:2539 · toCloudDecks:2540 · runPush:2541 · saveDeckStore:2554 · stopCloudSync:2559 · flushCloudSync:2561 · syncDeckStoreWithCloud:2572 · deckCardCount:2600 · deckProblem:2602 · buildDeckSelection:2610 · deckIdOfGeneral:2618 · DEFAULT_DECK_SELECTION:2619 · PlayerProfile:2628 · AVATAR_OPTIONS:2643 · avatarById:2651 · PROFILE_STORAGE_KEY:2653 · DEFAULT_PROFILE:2654 · loadProfile:2667 · formatCoroas:2681 · saveProfile:2686 · MODE_LABELS_PT:2695 · AvatarBadge:2705 · PlayerPlate:2720 · WINDOW_FRAME_PX:2749 · WINDOW_FONT_DECO:2750 · FramedWindow:2752 · WindowOverlay:2757 · WindowDivider:2780 · WindowTitle:2788 · Edges:2796 · ArtFrame:2797 · VLine:2818 · HLine:2821 · ArtChip:2826 · WindowOption:2832 · WindowText:2836 · WindowButton:2840 · AvatarPickerModal:2846 · ALLOW_PROFILE_RENAME:2883 · ProfileBar:2884 · ComingSoonModal:3005 · ONLINE_MODES:3021 · OnlineModeModal:3025 · TapPhase:3057 · MENU_CONFIRM_MS:3058 · useMenuTap:3059 · PlaqueSparks:3083 · PLAQUE_ASPECT:3102 · PLAQUE_CAP_CQW:3103 · MenuCard:3104 · MenuIconButton:3153 · MainMenu:3184 · InstallPrompt:3319 · DeckPickerModal:3355 · CARD_TYPE_ORDER:3386 · DeckSide:3387 · EditorSort:3388 · EDITOR_SORTS:3389 · EDITOR_MARGIN:3390 · EDITOR_FRAME:3391 · EDITOR_PAD:3392 · LIST_COLS:3395 · ROW_H:3396 · FULL_ART_TILE_SCALE:3397 · DeckEditor:3399 · ShopPhase:3962 · NpcMood:3963 · BoosterDef:3964 · BOOSTERS:3966 · TEST_FREE_BOOSTERS:3974 · SHELF_ROWS:3975 · SHELF_COLS:3976 · BOOSTER_ASPECT:3977 · SHELF_X0:3982 · SHELF_X1:3983 · SHELF_PLANKS:3984 · SHELF_OVERVIEW:3985 · SHELF_CLOSEUP:3986 · NPC_LINES:3988 · SHOP_ART:3996 · rollBooster:4004 · BoosterArt:4019 · NpcArt:4031 · PACK_TEAR_Y:4038 · LID_SLICES:4039 · LidSlice:4045 · PackTear:4068 · PulledCard:4137 · pullBooster:4138 · PackOpening:4151 · OpenBoosterFromTable:4230 · ShopScreen:4236 · AuthBackdrop:4476 · GoogleMark:4497 · DiscordMark:4500 · AuthButton:4502 · authFieldClass:4508 · LoginScreen:4510 · NAME_RULE:4571 · ProfileSetupScreen:4573 · VolumeRow:4639 · ToggleRow:4648 · OptionsModal:4658 · SettingsModal:4691 · playCoinSfx:4728 · COIN_THICK:4756 · CoinFace:4757 · CoinRim:4766 · RemotePick:4785 · CoinToss:4786 · MatchSearchOverlay:4868 · OnlineSearchOverlay:4909 · LoadingScreen:4984 · App:5038 · IMMEDIATE_ZONE_LABEL:10565 · DragFinger:10570 · GuideInfo:10587 · DragGuide:10588 · arrivalDrops:10655 · arrivalListener:10657 · EmblemKind:10662 · EMBLEM_ART:10663 · SlotEmblem:10664 · RowPlaque:10677 · CardSlot:10689

Dentro de `App` (linhas 5038–10564), funções internas:
attackMarkFor:5281 · openCardPicker:5308 · spawnFloatingNumber:5344 · spawnFloatingNumberAtId:5359 · showBanner:5386 · announcePhase:5410 · announceTurnChange:5420 · beginFinalBlow:5453 · endFinalBlow:5454 · blowIsSoaked:5457 · handleInstallClick:5541 · shieldOverSlot:5597 · popOverSlot:5606 · burstAt:5621 · whenGlowDone:5646 · endGlow:5647 · startTriggerFx:5651 · holdForSeat:5679 · terrainFxPlayer:5707 · terrainFxNpc:5708 · fireImpactBurst:5723 · noteDragPlay:5746 · handFanMaxAngleRad:5816 · getHandArrivalPoint:5923 · getFanRotation:5943 · getFanLift:5950 · computeDrawOrigin:5965 · showToast:5980 · announceCardPlay:5986 · toCardData:6060 · shownStats:6075 · boardView:6086 · syncView:6091 · processEvents:6124 · cardOverlayFx:6334 · fxRectOf:6425 · fxEnvFor:6431 · pickTacticSpot:6448 · tacticFxOf:6457 · planFx:6461 · commitState:6491 · dispatchAction:6514 · wakeWaiter:6533 · publishClock:6534 · dispatchOnline:6536 · reconcileOwn:6572 · applyUnasked:6586 · ingestRows:6600 · chooseFirstOnline:6628 · absorbAct:6641 · refuseOwn:6650 · sendOnline:6662 · stopOnline:6676 · startOnlinePolling:6693 · nextOpponentAction:6711 · applyRewardToProfile:6738 · openPlayerPick:6745 · playerAct:6772 · maybePromptRelicMode:6783 · confirmRelicMode:6793 · confirmUpkeep:6804 · endTurnNow:6816 · sleep:6835 · tutCurrent:6847 · tutCanBack:6851 · tutShow:6856 · tutGo:6872 · tutNext:6880 · tutBack:6894 · tutMatches:6899 · tutSignal:6911 · tutFromAction:6916 · tutBeat:6923 · tutExit:6930 · tutFinish:6937 · startTutorial:6938 · tutLaunchDuel:6943 · tutCoinResolved:6945 · settleAmbush:7002 · startMatchIntro:7035 · continueMatchIntro:7054 · resetGame:7146 · startGame:7199 · startOnlineMatch:7206 · leaveMatch:7248 · handleCardClick:7603 · handlePlayCardButtonClick:7663 · abilityStepCandidates:7722 · abilityHasTargets:7725 · getPlayerCreatureAbilityKind:7747 · getCardVisualEl:7761 · triggerPunch:7846 · renderTravelingArrow:7884 · playPendingTactic:7911 · resolveOwnTacticTarget:7918 · resolveEnemyTacticTarget:7923 · toggleCardPickerSelection:7931 · abilityOf:7945 · nextAbilityStep:7947 · activateAbility:7953 · abilityStepSide:7967 · resolveAbilityTarget:7973 · pushAbilityPrompt:8010 · mine:8031 · foes:8032 · effectTargetKind:8035 · specSlots:8037 · tacticTargeting:8051 · sourceAt:8058 · cancelTargeting:8076 · playHandCardOnTarget:8079 · heldTop:8086 · slotUnder:8087 · clearDragOver:8096 · dragBlockReason:8098 · tapHandCard:8110 · beginPress:8118 · returnHeld:8135 · dropHeldCard:8144 · updateHeld:8173 · dropOk:8192 · handleSlotClick:8248 · handleNpcSlotClick:8428 · handleBackgroundClick:8494 · getTappedCardShift:8525 · getSelectedCardX:8535 · getSelectedCardY:8557 · getBoardAnimation:8581 · getPlayerSlotHint:8622 · isTacticTargetSlot:8641 · tacticTagFor:8649 · shakePx:8712 · boardHeightMultiplier:8725 · boardTopMargin:8726

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

## src/engine/catalog.ts  (494 linhas)
TODAS as cartas (atributos, texto, efeitos em dados), as receitas dos dois decks, balanceamento (BALANCE), listas iniciais antigas (LEGACY_STARTERS).

SOLDIERS:8 · OWN_UNIT:9 · ENEMY_UNIT:10 · CARD_DEFS:12 · DeckId:254 · DeckRecipe:256 · DECK_RECIPES:258 · BALANCE:357 · BOOSTER_EXTRA:368 · STARTER_TRIM:376 · starterDeckCards:377 · LEGACY_STARTERS:385 · BY_NAME:410 · getCardDef:413 · registerCardDefs:415 · requireCardDef:416 · LEGACY_CARD_NAMES:423 · currentCardName:479 · currentNames:481 · isGeneralName:486 · TOKEN_DEFS:490

## src/engine/deck.ts  (31 linhas)
Regras de montagem de deck (40 a 60 cartas, 4 cópias).

DECK_MIN_CARDS:5 · DECK_MAX_CARDS:6 · DECK_DEFAULT_MAX_COPIES:8 · maxCopiesOf:9 · deckCardCount:11 · deckProblem:16

## src/engine/experimental.ts  (110 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

names:8 · MERCENARIOS_DEFS:9 · MERCENARIOS_RECIPE:10 · registerMercenarios:11 · OWN_UNIT:14 · equip:15 · GRAVE_EQUIP:17 · DECK_EQUIP:18 · CAMPO_DEFS:20 · CAMPO_RECIPE:97 · registerCampo:109

## src/engine/game.ts  (1103 linhas)
O motor: createMatch e applyAction (jogar, atacar, mover, habilidades, emboscada, fim de turno, vitória).

DeckSetup:25 · deckSetupFromRecipe:31 · expandCards:36 · MatchOptions:41 · cardFromName:49 · createMatch:58 · Ctx:84 · RuleError:87 · fail:88 · log:90 · P:91 · combatOpen:93 · activePhases:94 · addGold:97 · removeOne:106 · takeFromDeck:107 · drawCards:109 · removeFromHand:122 · discard:129 · sendDestroyed:136 · reinforceFrom:165 · setWinner:182 · soak:191 · grantShield:203 · grantBlock:209 · damageSlot:217 · healSlot:233 · startTurn:243 · enterPreparation:301 · payUpkeep:308 · setRelicMode:341 · runTurnEnd:354 · endTurn:374 · assertCanAct:384 · Fx:395 · uniqueByName:402 · matchesFilter:403 · filterLabel:410 · specCandidates:413 · checkTarget:417 · activeTargets:435 · validateTargets:439 · checkVerb:446 · checkVerbTarget:460 · openPick:464 · runVerb:473 · runAbilities:632 · grantMovedBuff:638 · playCard:648 · useAbility:712 · choose:752 · attack:808 · respondAmbush:834 · resolveAmbushEffect:851 · resolveCombat:887 · move:966 · advance:999 · discardExcess:1021 · clone:1038 · applyAction:1040 · MatchLog:1082 · newMatchLog:1089 · replayMatch:1092

## src/engine/ranked.ts  (128 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

LEAGUES:9 · League:10 · LEAGUE_NAMES:11 · POINTS_PER_DIVISION:14 · DIVISIONS:15 · POINTS_PER_LEAGUE:16 · MESTRE_FROM:17 · TOP_LEAGUE_SIZE:18 · PLACEMENT_MATCHES:20 · START_MMR:21 · START_POINTS:22 · RankedProfile:25 · newRankedProfile:26 · LeagueInfo:28 · leagueOf:30 · ROMAN:38 · leagueLabel:39 · leagueIndex:44 · RankedInput:47 · RankedResult:56 · expected:58 · clamp:59 · applyRankedMatch:61 · mmrWindow:93 · withTopLeague:96 · SEASON_DAYS:104 · SEASON_ONE_START:105 · DAY_MS:106 · SeasonInfo:107 · seasonAt:108 · RewardLeague:114 · SEASON_COROAS:115 · SeasonClose:117 · closeSeason:120

## src/engine/rewards.ts  (38 linhas)
Regras de recompensa (XP, Coroas, nível).

REWARD_MIN_ROUNDS:4 · REWARD_MIN_STEPS:5 · RewardInput:7 · Reward:15 · rewardFor:17 · xpToNext:26 · Progress:28 · applyReward:31

## src/engine/rng.ts  (31 linhas)
Números aleatórios com semente (a partida pode ser repetida).

seedFrom:5 · nextRandom:8 · randomInt:16 · pickRandom:19 · shuffled:23

## src/engine/rules.ts  (256 linhas)
Constantes (ouro, mão, início do combate) e perguntas sobre o tabuleiro (alcance, ATK efetivo, redução de dano, fases).

R:8 · START_GOLD:9 · START_HAND:10 · DRAW_PER_TURN:12 · GOLD_PER_TURN:13 · GOLD_FROM_ROUND:14 · COMBAT_FROM_ROUND:16 · HAND_LIMIT:17 · Unit:21 · Board:26 · phasesForTurn:29 · AUTOMATIC_PHASES:35 · restingPhasesForTurn:36 · abilitiesOf:41 · passivesOf:42 · abilityOn:43 · verbsOn:44 · hasVerb:45 · abilityPhases:48 · specCandidatesOn:51 · targetSpecsOf:66 · playTargetSpecs:67 · targetSpecOf:69 · needsHiddenInfo:73 · reinforceShield:78 · canReinforce:82 · AuraStat:85 · rowOk:86 · armedCount:87 · whoMatches:88 · auraTotal:99 · maxGeneralAbilityUses:124 · boardHasFlag:126 · upkeepOf:130 · relicModeOf:132 · canPlayInPhase:140 · isFrontline:144 · isBackline:145 · isUnitSlot:146 · getLaneCol:147 · getMoveRow:152 · getMoveCol:153 · areSlotsAdjacent:155 · adjacentSlots:159 · canReposition:163 · SOLDIER_TYPES:170 · CardDropKind:172 · getCardDropKind:175 · canPlaceInSlot:187 · isAliveAt:196 · isCardDamaged:198 · getAuraCombatHpBonus:201 · blocksAmbush:203 · locksGeneralOnDamage:205 · getMaxAttacksPerTurn:207 · getEffectiveAtk:211 · getIncomingDamageReduction:219 · getValidAttackTargets:223 · withEquippedWeapons:254

## src/engine/types.ts  (377 linhas)
Tipos: GameState, Action, GameEvent, CardDef, os verbos de efeito (Verb) e passivas.

CardType:4 · Seat:10 · otherSeat:11 · TurnPhase:15 · Trigger:19 · TRIGGER_LABEL:20 · TargetSpec:31 · CardFilter:44 · Verb:48 · AbilityOn:87 · Ability:102 · Who:112 · Passive:124 · RelicMode:138 · CardDef:149 · Card:177 · SLOT_COUNT:208 · GENERAL_SLOT:209 · RELIC_SLOT:210 · TERRAIN_SLOT:211 · PlayerState:213 · TurnState:234 · PickMode:252 · Pending:255 · GameState:297 · Action:310 · GameEvent:337 · ActionResult:374

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

## tests/balance-campo.ts  (132 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

Patch:29 · Per:30 · Rec:31 · setupOf:33 · applyPatch:37 · bump:54 · playGame:56 · pct:86 · main:88

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

## tests/campo-rules.ts  (119 linhas)
(sem descrição ainda: acrescente em FILE_NOTES)

passed:11 · test:12 · eq:13 · ok:14 · n:16 · mk:17 · A:18 · campoSetup:19 · fresh:20 · put:26 · give:27 · act:28 · arm:29

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
