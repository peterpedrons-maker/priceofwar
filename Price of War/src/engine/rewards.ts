// What a finished online match is worth. Pure, so the server decides it and the tests can pin it down.
// (Numbers are test-phase values: change them here and nowhere else.)

export const REWARD_MIN_ROUNDS = 3;   // a match that ended before the 3rd round pays nothing (no quick-quit farming)
export const REWARD_MIN_STEPS = 14;

export interface RewardInput {
  won: boolean;
  vsBot: boolean;
  // How the match ended for this player: they were beaten in play, gave up, or ran out of time.
  ending: 'general' | 'concede' | 'timeout';
  rounds: number;
  steps: number;
}
export interface Reward { xp: number; coroas: number; reason: 'win' | 'loss' | 'too_short' | 'abandoned' }

export const rewardFor = (r: RewardInput): Reward => {
  if (r.rounds < REWARD_MIN_ROUNDS || r.steps < REWARD_MIN_STEPS) return { xp: 0, coroas: 0, reason: 'too_short' };
  // Decisão do dono (rodada 26): partida online contra pessoa NÃO paga coroas (só XP e ranking, como no Hearthstone); coroas vêm da IA (pouco), da 1ª vitória do dia e das missões.
  if (r.won) return r.vsBot ? { xp: 35, coroas: 5, reason: 'win' } : { xp: 60, coroas: 0, reason: 'win' };
  // Giving up (or leaving the clock to run out) is not rewarded.
  if (r.ending !== 'general') return { xp: 0, coroas: 0, reason: 'abandoned' };
  return r.vsBot ? { xp: 12, coroas: 2, reason: 'loss' } : { xp: 25, coroas: 0, reason: 'loss' };
};

// Daily limits (the server keeps one small row per player per day, Brasília time): coroas from the AI are capped, and the first win of the day pays a bonus in any mode.
export const BOT_DAILY_CAP = 30;
export const FIRST_WIN_COROAS = 30;
export interface DailyState { bot_coroas: number; first_win: boolean }
export const withDaily = (reward: Reward, r: { won: boolean; vsBot: boolean }, daily: DailyState): { reward: Reward & { first_win?: number }; daily: DailyState } => {
  let coroas = reward.coroas, firstWin = 0;
  const next = { ...daily };
  if (r.vsBot) { coroas = Math.max(0, Math.min(coroas, BOT_DAILY_CAP - daily.bot_coroas)); next.bot_coroas += coroas; }
  if (r.won && reward.reason === 'win' && !daily.first_win) { firstWin = FIRST_WIN_COROAS; next.first_win = true; }
  return { reward: { ...reward, coroas: coroas + firstWin, ...(firstWin ? { first_win: firstWin } : {}) }, daily: next };
};

// XP needed to go from `level` to the next one.
export const xpToNext = (level: number): number => 100 + 50 * (Math.max(1, level) - 1);

export interface Progress { level: number; xp: number; coroas: number }

// Adds a reward to a profile's numbers; `xp` is progress inside the current level.
export const applyReward = (p: Progress, gain: { xp: number; coroas: number }): Progress & { levelsGained: number } => {
  let { level, xp } = p;
  xp += gain.xp;
  let levelsGained = 0;
  while (xp >= xpToNext(level) && level < 99) { xp -= xpToNext(level); level += 1; levelsGained += 1; }
  return { level, xp, coroas: p.coroas + gain.coroas, levelsGained };
};
