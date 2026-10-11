// Ranked ladder: leagues, divisions and how a finished ranked match moves a player. Pure, so the server decides and the tests pin it down.
// (Numbers are first-version values: change them here and nowhere else; see docs/ranqueado.md.)
//
// Two numbers per player:
//  - `points` (PDL, shown): total ladder points. 100 points = one division, 4 divisions = one league. 0 to 399 is Ferro, 400 to 799 Bronze...
//    from 2400 up is Mestre (no divisions). The top of Mestre is "Senhor da Guerra", a flag the ranking computes (see TOP_LEAGUE_SIZE).
//  - `mmr` (hidden Elo): who a player really is. It decides how much a win is worth and, later, who is matched with whom.

export const LEAGUES = ['ferro', 'bronze', 'prata', 'ouro', 'platina', 'diamante', 'mestre'] as const;
export type League = (typeof LEAGUES)[number];
export const LEAGUE_NAMES: Record<League | 'senhor-da-guerra', string> = {
  ferro: 'Ferro', bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro', platina: 'Platina', diamante: 'Diamante', mestre: 'Mestre', 'senhor-da-guerra': 'Senhor da Guerra',
};
export const POINTS_PER_DIVISION = 100;
export const DIVISIONS = 4;
export const POINTS_PER_LEAGUE = POINTS_PER_DIVISION * DIVISIONS;       // 400
export const MESTRE_FROM = POINTS_PER_LEAGUE * 6;                       // 2400
export const TOP_LEAGUE_SIZE = 50;                                      // the best 50 Mestres are Senhor da Guerra (decided by the ranking)

export const PLACEMENT_MATCHES = 5;
export const START_MMR = 1000;
export const START_POINTS = 0;

// `season` is the season these numbers belong to; `frame` is the portrait frame (a league key) won in an earlier season.
export interface RankedProfile { points: number; mmr: number; games: number; wins: number; losses: number; shield: boolean; peak: number; season?: number; frame?: string | null }
export const newRankedProfile = (season = 1): RankedProfile => ({ points: START_POINTS, mmr: START_MMR, games: 0, wins: 0, losses: 0, shield: false, peak: START_POINTS, season, frame: null });

export interface LeagueInfo { league: League; division: 1 | 2 | 3 | 4 | null; inDivision: number }
// division 4 is the lowest (IV) and 1 the highest (I); Mestre has none.
export const leagueOf = (points: number): LeagueInfo => {
  const p = Math.max(0, Math.floor(points));
  if (p >= MESTRE_FROM) return { league: 'mestre', division: null, inDivision: p - MESTRE_FROM };
  const li = Math.floor(p / POINTS_PER_LEAGUE);
  const within = p - li * POINTS_PER_LEAGUE;
  const di = Math.floor(within / POINTS_PER_DIVISION);   // 0..3, 0 = lowest
  return { league: LEAGUES[li], division: (DIVISIONS - di) as 1 | 2 | 3 | 4, inDivision: within - di * POINTS_PER_DIVISION };
};
export const ROMAN = ['', 'I', 'II', 'III', 'IV'];
export const leagueLabel = (points: number, top = false): string => {
  const l = leagueOf(points);
  if (l.league === 'mestre') return top ? LEAGUE_NAMES['senhor-da-guerra'] : LEAGUE_NAMES.mestre;
  return `${LEAGUE_NAMES[l.league]} ${ROMAN[l.division!]}`;
};
export const leagueIndex = (points: number): number => LEAGUES.indexOf(leagueOf(points).league);

// ── One finished match ──────────────────────────────────────────────────────
export interface RankedInput {
  me: RankedProfile;
  opponentMmr: number;
  won: boolean;
  // How it ended for me: beaten in play, gave up, or ran out of time (giving up costs a little extra).
  ending: 'general' | 'concede' | 'timeout';
  // Too short to count (see rewards.ts): no points move.
  counts: boolean;
}
export interface RankedResult { next: RankedProfile; delta: number; mmrDelta: number; placement: boolean; promoted: boolean; demoted: boolean; shieldUsed: boolean; leagueBefore: string; leagueAfter: string }

const expected = (a: number, b: number) => 1 / (1 + Math.pow(10, (b - a) / 400));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const applyRankedMatch = (r: RankedInput): RankedResult => {
  const me = r.me;
  const before = leagueOf(me.points);
  if (!r.counts) return { next: { ...me }, delta: 0, mmrDelta: 0, placement: false, promoted: false, demoted: false, shieldUsed: false, leagueBefore: leagueLabel(me.points), leagueAfter: leagueLabel(me.points) };
  // Hidden Elo (K = 32; 48 during the placement matches, to settle quickly).
  const placement = me.games < PLACEMENT_MATCHES;
  const k = placement ? 48 : 32;
  const mmrDelta = Math.round(k * ((r.won ? 1 : 0) - expected(me.mmr, r.opponentMmr)));
  // Visible points: +20 / -18 as a base, moved up to +-8 by how far the opponent is above or below me (80 Elo = 1 point), twice as fast in placement.
  const gap = clamp((r.opponentMmr - me.mmr) / 80, -8, 8);
  let delta: number;
  if (r.won) delta = Math.round((placement ? 60 : 20) + (placement ? 0 : gap));
  else delta = -Math.round((placement ? 6 : 18) + (placement ? 0 : -gap)) - (r.ending === 'general' ? 0 : 6);
  if (r.won) delta = Math.max(8, delta);
  else delta = Math.min(-2, delta);
  // Shield: right after climbing into a higher league, the next loss costs nothing (once).
  let shield = me.shield, shieldUsed = false;
  if (!r.won && shield) { delta = 0; shield = false; shieldUsed = true; }
  const points = Math.max(0, me.points + delta);
  const after = leagueOf(points);
  const promoted = leagueIndex(points) > LEAGUES.indexOf(before.league);
  if (promoted) shield = true;
  const demoted = leagueIndex(points) < LEAGUES.indexOf(before.league);
  if (demoted) shield = false;
  const next: RankedProfile = {
    ...me, points, mmr: Math.max(100, me.mmr + mmrDelta), games: me.games + 1, wins: me.wins + (r.won ? 1 : 0), losses: me.losses + (r.won ? 0 : 1), shield, peak: Math.max(me.peak, points),
  };
  void after;
  return { next, delta: points - me.points, mmrDelta, placement, promoted, demoted, shieldUsed, leagueBefore: leagueLabel(me.points), leagueAfter: leagueLabel(points) };
};

// A matchmaking window: how far apart two Elos may be, widening the longer someone waits (ms).
export const mmrWindow = (waitedMs: number): number => 100 + Math.floor(waitedMs / 5000) * 50;

// Ranking order and the top league: the best TOP_LEAGUE_SIZE players inside Mestre are Senhor da Guerra.
export const withTopLeague = <T extends { points: number }>(rows: T[]): (T & { rank: number; top: boolean })[] => {
  const sorted = [...rows].sort((a, b) => b.points - a.points);
  return sorted.map((r, i) => ({ ...r, rank: i + 1, top: i < TOP_LEAGUE_SIZE && r.points >= MESTRE_FROM }));
};

// ── Seasons ─────────────────────────────────────────────────────────────────
// Seasons follow the calendar (no scheduled job): the number is computed from the date, and each player's ladder row is
// closed lazily the first time the server sees them in a newer season (reward for their highest league, then a soft reset).
export const SEASON_DAYS = 60;
export const SEASON_ONE_START = Date.UTC(2026, 9, 1);   // 1 Oct 2026
const DAY_MS = 86400000;
export interface SeasonInfo { number: number; startsAt: number; endsAt: number }
export const seasonAt = (nowMs: number): SeasonInfo => {
  const n = Math.max(0, Math.floor((nowMs - SEASON_ONE_START) / (SEASON_DAYS * DAY_MS)));
  return { number: n + 1, startsAt: SEASON_ONE_START + n * SEASON_DAYS * DAY_MS, endsAt: SEASON_ONE_START + (n + 1) * SEASON_DAYS * DAY_MS };
};

// What a season pays, by the highest league reached: the portrait frame of that league (always) and Coroas.
export type RewardLeague = League | 'senhor-da-guerra';
export const SEASON_COROAS: Record<RewardLeague, number> = { ferro: 25, bronze: 50, prata: 100, ouro: 200, platina: 350, diamante: 500, mestre: 800, 'senhor-da-guerra': 1500 };

export interface SeasonClose { league: RewardLeague; coroas: number; next: RankedProfile }
// Closes a season for one player. `top` = they finished among the best TOP_LEAGUE_SIZE Mestres. Points are halved (to a division edge),
// the hidden Elo stays, the placement matches come back, and the frame is the better of the old one and this season's league.
export const closeSeason = (p: RankedProfile, newSeason: number, top: boolean): SeasonClose => {
  const reached = leagueOf(Math.max(p.peak, p.points)).league;
  const league: RewardLeague = reached === 'mestre' && top ? 'senhor-da-guerra' : reached;
  const rank = (k: string | null | undefined) => (k === 'senhor-da-guerra' ? LEAGUES.length : k ? LEAGUES.indexOf(k as League) : -1);
  const frame = rank(league) >= rank(p.frame) ? league : (p.frame as string);
  const points = Math.floor(p.points / (2 * POINTS_PER_DIVISION)) * POINTS_PER_DIVISION;
  return { league, coroas: SEASON_COROAS[league], next: { points, mmr: p.mmr, games: 0, wins: 0, losses: 0, shield: false, peak: points, season: newSeason, frame } };
};
