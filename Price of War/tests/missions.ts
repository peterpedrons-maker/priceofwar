// Missões (dados): ids únicos, ranqueadas desligadas por padrão, e o teto de coroas por dia dentro do ritmo combinado (no máximo ~1 booster por dia).
import { MISSIONS, DAILY_SLOTS, WEEKLY_SLOTS, RANKED_MISSIONS_ON, missionsOf, slotsFor } from '../src/engine/missions';
let fails = 0; const ok = (c: boolean, m: string) => { if (!c) { fails++; console.log('  ✗ ' + m); } };
ok(new Set(MISSIONS.map(m => m.id)).size === MISSIONS.length, 'ids únicos');
ok(MISSIONS.every(m => m.reward > 0 && m.target > 0 && m.title && m.desc), 'toda missão tem alvo, prêmio e texto');
ok(RANKED_MISSIONS_ON === false, 'as missões ranqueadas começam DESLIGADAS');
ok(missionsOf('daily').every(m => m.mode !== 'ranked') && missionsOf('weekly').every(m => m.mode !== 'ranked') && missionsOf('season').length === 0, 'desligadas, nenhuma ranqueada vale');
ok(missionsOf('daily', true).some(m => m.mode === 'ranked') && missionsOf('season', true).length === 4, 'ligando a chave, elas aparecem');
const off = slotsFor('daily', false), on = slotsFor('daily', true);
ok(off.ranked === 0 && off.free === DAILY_SLOTS.free + DAILY_SLOTS.ranked && on.ranked === DAILY_SLOTS.ranked, 'a vaga ranqueada vira livre enquanto estiver desligada');
// pior caso do dia: as missões mais caras de cada vaga
const best = (kind: 'daily' | 'weekly', slots: Record<string, number>, rankedOn: boolean) => (['ia', 'free', 'ranked'] as const).reduce((sum, mode) => sum + missionsOf(kind, rankedOn).filter(m => m.mode === mode).map(m => m.reward).sort((a, b) => b - a).slice(0, slots[mode]).reduce((a, b) => a + b, 0), 0);
const dailyMax = best('daily', slotsFor('daily', false), false), weeklyMax = best('weekly', slotsFor('weekly', false), false);
ok(dailyMax <= 100, `diárias desligadas o ranqueado: no máximo 100 coroas por dia (deu ${dailyMax})`);
const perDay = dailyMax + weeklyMax / 7;
ok(perDay <= 150, `ritmo total (diárias + semanais/7) até 150 coroas/dia = 1 booster por dia (deu ${perDay.toFixed(0)})`);
const onMax = best('daily', slotsFor('daily', true), true) + best('weekly', slotsFor('weekly', true), true) / 7;
ok(onMax <= 160, `com as ranqueadas ligadas o ritmo continua perto de 1 booster por dia (deu ${onMax.toFixed(0)})`);
console.log(fails ? `${fails} falhas` : `missions: ok (diárias ${dailyMax}, semanais ${weeklyMax}, ritmo ${perDay.toFixed(0)}/dia; com ranqueadas ${onMax.toFixed(0)}/dia)`);
if (fails) process.exit(1);
