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
  if (r.won) return r.vsBot ? { xp: 35, coroas: 12, reason: 'win' } : { xp: 60, coroas: 25, reason: 'win' };
  // Giving up (or leaving the clock to run out) is not rewarded.
  if (r.ending !== 'general') return { xp: 0, coroas: 0, reason: 'abandoned' };
  return r.vsBot ? { xp: 12, coroas: 4, reason: 'loss' } : { xp: 25, coroas: 8, reason: 'loss' };
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
