// A tiny seeded random generator (mulberry32). Its whole state is one 32-bit number kept inside the
// match state, so the same seed + the same actions always produce the same match — on a server,
// on a client replaying events, or in a test.

export const seedFrom = (n: number): number => (n >>> 0) || 1;

// Advances `holder.rng` and returns a float in [0, 1).
export const nextRandom = (holder: { rng: number }): number => {
  holder.rng = (holder.rng + 0x6d2b79f5) >>> 0;
  let t = holder.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const randomInt = (holder: { rng: number }, maxExclusive: number): number =>
  Math.floor(nextRandom(holder) * maxExclusive);

export const pickRandom = <T>(holder: { rng: number }, items: readonly T[]): T =>
  items[randomInt(holder, items.length)];

// Fisher–Yates on a copy.
export const shuffled = <T>(holder: { rng: number }, items: readonly T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(holder, i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
