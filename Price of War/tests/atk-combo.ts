// "Teto" do Capitão: a melhor sequência que uma pessoa acha na Movimentação (no motor de verdade) e o ATK que sai dela.
import { requireCardDef } from '../src/engine/catalog';
import { applyAction, createMatch, deckSetupFromRecipe } from '../src/engine/game';
import { getEffectiveAtk } from '../src/engine/rules';
import type { Action, Card, GameState, Seat } from '../src/engine/types';
let n = 0;
const mk = (name: string): Card => { const d = requireCardDef(name); return { id: `c${++n}`, name: d.name, cardType: d.cardType, atk: d.atk, hp: d.hp, cost: d.cost, effect: d.effect } as Card; };
let s: GameState = createMatch({ seed: 3, decks: [deckSetupFromRecipe('capitao'), deckSetupFromRecipe('mercenarios')], first: 0 }).state;
s = (applyAction(s, 0, { type: 'begin' }) as any).state; s.players.forEach(p => { p.hand = []; p.gold = 30; });
s.turn.round = 4; s.turn.phase = 'movimentacao'; s.turn.moved = []; s.turn.bonusRepositions = 0;
const B = s.players[0].board, F = s.players[1].board;
B[0] = mk('Soldado Tático'); B[1] = mk('Capitão de Formação'); B[2] = mk('Veterano de Guerra'); B[3] = mk('Cavaleiro Tático'); B[4] = mk('Batedor');
B[7] = mk('Capitão de Formação');
const act = (a: Action, who: Seat = 0) => { const r: any = applyAction(s, who, a); if (r.ok === false) { console.log('  recusado:', JSON.stringify(a), r.error); return false; } s = r.state; return true; };
const show = (t: string) => { const b = s.players[0].board; console.log(t.padEnd(46), b.slice(0, 10).map((c, i) => (c ? `${i}:${c.name.split(' ')[0]} ${getEffectiveAtk(c, i, b as any, s.players[1].board as any)}` : '')).filter(Boolean).join(' | ')); };
show('início');
// Avanço Coordenado e Reformar Linhas na mão
const rl = mk('Reformar Linhas'), av1 = mk('Avanço Coordenado'), av2 = mk('Avanço Coordenado');
s.players[0].hand.push(rl, av1, av2);
act({ type: 'play', cardId: rl.id } as any); show('Reformar Linhas (+3 movimentos)');
// Capitão de Formação (col 1) vai e volta; cada movimento dá +2 aos vizinhos
for (let k = 0; k < 3; k++) { act({ type: 'move', from: 1, to: 6 } as any); act({ type: 'move', from: 6, to: 1 } as any); show(`Capitão de Formação vai e volta (${k + 1}x)`); }
act({ type: 'move', from: 3, to: 2 } as any); show('Cavaleiro Tático troca com o Veterano');
act({ type: 'play', cardId: av1.id, target: 2 } as any); show('Avanço Coordenado +3 no Veterano');
act({ type: 'play', cardId: av2.id, target: 2 } as any); show('segundo Avanço Coordenado +3');
console.log('movimentos extras que sobraram:', s.turn.bonusRepositions);
act({ type: 'advance' } as any);   // fim da movimentação → turn_end do General
show('fim do turno (Aurelion +2 a quem se moveu)');
