// The ladder's pure rules: leagues from points, what a win or a loss is worth, placement, the shield, the matchmaking window:   npx tsx tests/ranked.ts
import { LEAGUES, applyRankedMatch, leagueLabel, leagueOf, mmrWindow, newRankedProfile, withTopLeague, MESTRE_FROM, SEASON_COROAS, SEASON_DAYS, SEASON_ONE_START, closeSeason, seasonAt, type RankedProfile } from '../src/engine/ranked';
let passed = 0, failed = 0;
const test = (name: string, fn: () => void) => { try { fn(); passed++; } catch (e) { failed++; console.log(`  ✗ ${name}\n      ${(e as Error).message}`); } };
const ok = (c: boolean, msg: string) => { if (!c) throw new Error(msg); };
const eq = (a: unknown, b: unknown, msg = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };
const play = (me: RankedProfile, won: boolean, opp = 1000, ending: 'general' | 'concede' | 'timeout' = 'general') => applyRankedMatch({ me, opponentMmr: opp, won, ending, counts: true });
const veteran = (points: number, extra: Partial<RankedProfile> = {}): RankedProfile => ({ ...newRankedProfile(), points, peak: points, games: 20, ...extra });

test('leagues and divisions from points (100 per division, 400 per league, Mestre from 2400)', () => {
  eq([0, 99, 100, 399, 400, 1262, 2399, 2400, 5000].map(p => leagueLabel(p)), ['Ferro IV', 'Ferro IV', 'Ferro III', 'Ferro I', 'Bronze IV', 'Ouro IV', 'Diamante I', 'Mestre', 'Mestre']);
  eq(leagueOf(1262).inDivision, 62);
  eq(leagueLabel(3000, true), 'Senhor da Guerra');
  eq(LEAGUES.length, 7);
});

test('placement: the first 5 matches move fast; a win is worth more than a loss costs', () => {
  let me = newRankedProfile();
  for (let i = 0; i < 5; i++) { const r = play(me, true); ok(r.placement && r.delta === 60, 'placement win +60: ' + r.delta); me = r.next; }
  eq(me.points, 300); eq(me.games, 5);
  const after = play(me, true); ok(!after.placement && after.delta >= 18 && after.delta <= 28, 'then the normal rate: ' + after.delta);
  const lose = play(newRankedProfile(), false); eq(lose.next.points, 0, 'points never go below zero');
});

test('a win against a stronger player is worth more, a loss to a weaker one costs more', () => {
  const me = veteran(800);
  const upset = play(me, true, 1400), expected = play(me, true, 1000), farmed = play(me, true, 600);
  ok(upset.delta > expected.delta && expected.delta > farmed.delta, `${upset.delta} > ${expected.delta} > ${farmed.delta}`);
  const badLoss = play(me, false, 600), fairLoss = play(me, false, 1000), okLoss = play(me, false, 1400);
  ok(badLoss.delta < fairLoss.delta && fairLoss.delta < okLoss.delta, `${badLoss.delta} < ${fairLoss.delta} < ${okLoss.delta}`);
  ok(upset.delta <= 28 && badLoss.delta >= -26, 'bounded');
});

test('hidden Elo: even match moves about half of K, an upset moves more', () => {
  const me = veteran(800);
  const even = play(me, true, 1000); eq(even.mmrDelta, 16);
  ok(play(me, true, 1400).mmrDelta > 16 && play(me, false, 1400).mmrDelta > -16, 'upset');
});

test('giving up or running out of time costs extra', () => {
  const me = veteran(800);
  ok(play(me, false, 1000, 'concede').delta < play(me, false, 1000, 'general').delta, 'concede is worse');
  eq(play(me, false, 1000, 'timeout').delta, play(me, false, 1000, 'concede').delta);
});

test('climbing into a higher league gives a shield: the next loss is free, once', () => {
  let me = veteran(396);                 // Ferro I, 96/100
  const up = play(me, true); ok(up.promoted && up.next.shield && up.leagueAfter.startsWith('Bronze'), 'promoted with shield: ' + JSON.stringify(up));
  const free = play(up.next, false); ok(free.shieldUsed && free.delta === 0 && !free.next.shield, 'free loss: ' + JSON.stringify(free));
  const next = play(free.next, false); ok(next.delta < 0, 'then losses cost again');
});

test('dropping a league demotes (and clears the shield)', () => {
  const r = play(veteran(402), false); ok(r.demoted && r.leagueAfter.startsWith('Ferro') && !r.next.shield, JSON.stringify(r));
});

test('a match too short to count moves nothing', () => {
  const me = veteran(500); const r = applyRankedMatch({ me, opponentMmr: 1000, won: true, ending: 'general', counts: false });
  eq([r.delta, r.next.games, r.next.points], [0, 20, 500]);
});

test('matchmaking window widens with the wait; top league is the best Mestres only', () => {
  ok(mmrWindow(0) < mmrWindow(30000), 'widens');
  const rows = [{ points: 5000 }, { points: 2500 }, { points: 2399 }, { points: 100 }];
  const t = withTopLeague(rows); eq(t.map(r => r.top), [true, true, false, false]); eq(t.map(r => r.rank), [1, 2, 3, 4]);
  ok(MESTRE_FROM === 2400, 'mestre from 2400');
});

test('seasons follow the calendar: 60 days each, numbered from 1', () => {
  eq(seasonAt(SEASON_ONE_START - 1000).number, 1, 'before the start counts as season 1');
  eq(seasonAt(SEASON_ONE_START).number, 1);
  const s1 = seasonAt(SEASON_ONE_START + 59 * 86400000); eq(s1.number, 1); eq(s1.endsAt - s1.startsAt, SEASON_DAYS * 86400000);
  const s2 = seasonAt(s1.endsAt); eq(s2.number, 2); eq(s2.startsAt, s1.endsAt);
});

test('closing a season: reward by the highest league reached, soft reset, frame kept', () => {
  const c = closeSeason(veteran(1283, { peak: 1450, wins: 30, losses: 12, shield: true }), 2, false);
  eq(c.league, 'ouro'); eq(c.coroas, SEASON_COROAS.ouro);
  eq(c.next.points, 600, 'half of 1283 down to a division edge'); eq(c.next.peak, 600);
  eq([c.next.games, c.next.wins, c.next.losses, c.next.shield, c.next.season, c.next.frame], [0, 0, 0, false, 2, 'ouro']);
  eq(c.next.mmr, 1000, 'the hidden Elo stays');
});

test('closing a season: Senhor da Guerra only for the top Mestres; a better old frame is kept', () => {
  eq(closeSeason(veteran(3000), 2, true).league, 'senhor-da-guerra');
  eq(closeSeason(veteran(3000), 2, false).league, 'mestre');
  eq(closeSeason(veteran(100, { frame: 'diamante' }), 2, false).next.frame, 'diamante');
  eq(closeSeason(veteran(100, { frame: 'diamante' }), 2, false).league, 'ferro');
  eq(closeSeason(newRankedProfile(), 2, false).next.points, 0);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
