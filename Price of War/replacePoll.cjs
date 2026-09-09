const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// Use platform-agnostic newline detection
const NL = c.includes('\r\n') ? '\r\n' : '\n';
const n = NL;

const OLD_MARKER_START = `// \u2500\u2500 Multiplayer: poll opponent state while it's their turn`;
const OLD_MARKER_END = `  }, [currentTurn, gameMode, multiplayerGameId, isP1, startupPhase]);${n}${n}  useEffect(() => {${n}    if (currentTurn === 'npc' && gameMode === 'Quick Match'`;

const startIdx = c.indexOf(OLD_MARKER_START);
const endIdx = c.indexOf(OLD_MARKER_END);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found!', 'start:', startIdx, 'end:', endIdx);
  process.exit(1);
}

// Find the start of the line (2 spaces of indentation before the comment)
const lineStart = c.lastIndexOf(n, startIdx) + 1;

const blockToReplace = c.slice(lineStart, endIdx + `  }, [currentTurn, gameMode, multiplayerGameId, isP1, startupPhase]);`.length);

const NEW_BLOCK = `  // \u2500\u2500 Multiplayer: poll opponent state and animate each action in real-time \u2500\u2500${n}  useEffect(() => {${n}    if (gameMode !== 'Multiplayer' || !multiplayerGameId || startupPhase !== 'playing') return;${n}    if (currentTurn !== 'npc') return;${n}${n}    let cancelled = false;${n}    const poll = async () => {${n}      while (!cancelled) {${n}        await new Promise(r => setTimeout(r, 1200));${n}        if (cancelled) break;${n}        const game = await getGame(multiplayerGameId);${n}        if (!game || cancelled) break;${n}${n}        const myKey         = isP1 ? 'p1'      : 'p2';${n}        const oppSlotsKey   = isP1 ? 'p2_slots' : 'p1_slots';${n}        const oppHpKey      = isP1 ? 'p2_hp'    : 'p1_hp';${n}        const oppManaKey    = isP1 ? 'p2_mana'  : 'p1_mana';${n}        const myHpKeyPoll   = isP1 ? 'p1_hp'    : 'p2_hp';${n}        const mySlotKeyPoll = isP1 ? 'p1_slots' : 'p2_slots';${n}${n}        const actionId = game.last_action?.action_id as string | undefined;${n}        const isNewAction = !!actionId && actionId !== lastProcessedActionIdRef.current;${n}${n}        if (isNewAction) {${n}          lastProcessedActionIdRef.current = actionId!;${n}          const action = game.last_action;${n}${n}          if (action.type === 'attack_slot' || action.type === 'attack_avatar') {${n}            // Show attack animation BEFORE applying post-attack board state${n}            const attackerEl = document.getElementById(\`npc_slot_\${action.attackerIndex}\`);${n}            const targetEl = action.type === 'attack_slot'${n}              ? document.getElementById(\`player_slot_\${action.targetIndex}\`)${n}              : document.getElementById('player_avatar');${n}            let deltaX = 0, deltaY = 600;${n}            if (attackerEl && targetEl) {${n}              const aRect = attackerEl.getBoundingClientRect();${n}              const dRect = targetEl.getBoundingClientRect();${n}              deltaX = dRect.left - aRect.left + dRect.width / 2 - aRect.width / 2;${n}              deltaY = dRect.top  - aRect.top  + dRect.height / 2 - aRect.height / 2;${n}            }${n}            setAttackAnim({${n}              attackerIndex: action.attackerIndex as number,${n}              targetIndex: action.type === 'attack_avatar' ? 'avatar' : action.targetIndex as number,${n}              isPlayerAttacking: false,${n}              deltaX,${n}              deltaY,${n}            });${n}            await new Promise(r => setTimeout(r, 350));${n}            if (cancelled) break;${n}            setIsImpacting(true);${n}            await new Promise(r => setTimeout(r, 300));${n}            setIsImpacting(false);${n}            await new Promise(r => setTimeout(r, 380));${n}            setAttackAnim(null);${n}          }${n}${n}          // Apply resulting board state after the action${n}          setNpcSlots(game[oppSlotsKey] ?? Array(13).fill(null));${n}          setNpcHp(game[oppHpKey] ?? 20);${n}          setNpcMana(game[oppManaKey] ?? 15);${n}          if (game[myHpKeyPoll] !== undefined) setPlayerHp(game[myHpKeyPoll]);${n}          if (game[mySlotKeyPoll]) setPlayerSlots(game[mySlotKeyPoll]);${n}        }${n}${n}        // Check if opponent ended their turn${n}        if (game.active_player === myKey) {${n}          if (!isNewAction) {${n}            // Apply final end-of-turn state if no new action was processed this tick${n}            setNpcSlots(game[oppSlotsKey] ?? Array(13).fill(null));${n}            setNpcHp(game[oppHpKey] ?? 20);${n}            setNpcMana(game[oppManaKey] ?? 15);${n}            if (game[myHpKeyPoll] !== undefined) setPlayerHp(game[myHpKeyPoll]);${n}            if (game[mySlotKeyPoll]) setPlayerSlots(game[mySlotKeyPoll]);${n}          }${n}          if (game.status === 'finished') { cancelled = true; break; }${n}          setCurrentTurn('player');${n}          setTurnNumber(game.turn_number ?? (turnNumber + 1));${n}          break;${n}        }${n}      }${n}    };${n}    poll();${n}    return () => { cancelled = true; };${n}  }, [currentTurn, gameMode, multiplayerGameId, isP1, startupPhase]);`;

if (!c.includes(blockToReplace.slice(0, 80))) {
  console.error('Block not found in file, first 80 chars:', JSON.stringify(blockToReplace.slice(0, 80)));
  process.exit(1);
}

c = c.replace(blockToReplace, NEW_BLOCK);
fs.writeFileSync('src/App.tsx', c);
console.log('Done! Replaced poll loop.');
