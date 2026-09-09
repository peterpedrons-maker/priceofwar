import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const startIndex = code.indexOf('id="player_avatar"');
if (startIndex === -1) { console.log('not found'); process.exit(1); }

// find the preceding <div
const beforeDivIndex = code.lastIndexOf('<div', startIndex);

// find the next card slot section to stop at
const endIndex = code.indexOf('<div className="col-start-4">', startIndex);

const oldText = code.substring(beforeDivIndex, endIndex);

const replacement = `<div
                id="player_avatar"
                className="relative cursor-pointer pointer-events-auto"
              >
                  <CardSlot
                    slotId="player_slot_12"
                    card={playerSlots[12]}
                    onClick={() => handleSlotClick(12)}
                    onMouseEnter={() => setHoveredBoardSlot({ type: 'player', index: 12 })}
                    onMouseLeave={() => setHoveredBoardSlot(null)}
                    isHovered={(hoveredBoardSlot?.type === 'player' && hoveredBoardSlot.index === 12) || (selectedAttackerIndex === 12 && hoveredBoardSlot?.type === 'npc')}
                    isSelected={selectedAttackerIndex === 12}
                    onInfoClick={setDetailedCard}
                    isAttacking={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12}
                    attackDeltaX={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12 ? (attackAnim.deltaX ?? 0) : 0}
                    attackDeltaY={attackAnim?.isPlayerAttacking === true && attackAnim?.attackerIndex === 12 ? (attackAnim.deltaY ?? -450) : -450}
                    isImpactingTarget={isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 12}
                    attackDirection="up"
                    isRepositionSource={repositionSource === 12}
                    isAttackExhausted={turnPhase === 'battle' && attackedSlots.has(12)}
                    isSwapping={swapAnim !== null && (swapAnim.a === 12 || swapAnim.b === 12)}
                    swapFromX={getSwapFrom(12).x}
                    swapFromY={getSwapFrom(12).y}
                    isValidRepositionTarget={validRepositionTargets.has(12)}
                  />
                  {!playerSlots[12] && (
                    <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-[#8c7a5f]/60 bg-black/30 flex flex-col items-center justify-center gap-1 z-0">
                      <Shield className="w-5 h-5 text-blue-400/50" />
                      <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-blue-300/50">Classe</span>
                    </div>
                  )}
                  {isImpacting && attackAnim?.isPlayerAttacking === false && attackAnim?.targetIndex === 'avatar' && <SlashEffect />}

                <HpBadge value={playerHp} className="absolute -bottom-4 -right-4 w-10 h-10 md:w-14 md:h-14 text-lg md:text-2xl z-20 pointer-events-none" />
                <ManaBadge value={playerMana} className="absolute -bottom-4 -left-4 w-10 h-10 md:w-14 md:h-14 text-lg md:text-2xl z-20 pointer-events-none" />
              </div>
              </div>
              `;

code = code.replace(oldText, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('done');
