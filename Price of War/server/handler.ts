// The game server's brain: matchmaking, move validation, the turn clock and rewards. It owns the authoritative
// match (full state, in the database), refuses anything the engine refuses, runs the bot seat, and records every
// action. Players never see the full state: for each step they get a view with the other player's hand and every
// deck order removed (see src/engine/view.ts), and their device just shows it.
import { aiNextAction } from '../src/engine/ai';
import { DECK_RECIPES, currentCardName, currentNames, type DeckId } from '../src/engine/catalog';
import { deckProblem } from '../src/engine/deck';
import { applyAction, createMatch } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import { applyReward, rewardFor } from '../src/engine/rewards';
import type { Action, GameEvent, GameState, Seat } from '../src/engine/types';
import { otherSeat } from '../src/engine/types';
import { eventsFor, viewFor } from '../src/engine/view';
import { LEAGUES, MESTRE_FROM, TOP_LEAGUE_SIZE, applyRankedMatch, closeSeason, leagueLabel, mmrWindow, leagueOf, newRankedProfile, seasonAt, withTopLeague, type RankedProfile } from '../src/engine/ranked';
import type { Db, DeckJson, EndReason, MatchPatch, MatchRow, QueueRow, RewardRow, StepRow, ViewRow } from './types';

export interface GameConfig {
  // A waiting player refreshes their queue entry with every status poll; an entry older than this is a player who left, and is skipped.
  queueStaleMs: number;
  // The clock: time for a whole turn, and for answering a prompt (an ambush, a pick, a discard).
  turnMs: number;
  promptMs: number;
  // Turns in a row a player may let run out before the match is forfeited.
  maxTimeouts: number;
  now: () => number;
  random: () => number;
}

export const defaultConfig = (): GameConfig => ({ queueStaleMs: 20000, turnMs: 150000, promptMs: 60000, maxTimeouts: 2, now: () => Date.now(), random: Math.random });

export interface MatchInit {
  id: string;
  // True when the player goes first. Until the toss winner has chosen (`chosen` false) this is just "I won the toss".
  iGoFirst: boolean;
  // Who won the coin toss: that player picks to play first or second (the `choose_first` action).
  iWonToss: boolean;
  // Whether the choice was already made (a bot that won the toss chooses at once).
  chosen: boolean;
  // The side of the coin this player was given: seat order is random, so seat 0 = Cara, seat 1 = Coroa is fair.
  mySide: 'cara' | 'coroa';
  myDeck: DeckJson;
  opponentGeneral: string;
  opponent: { name: string; avatarId: string; bot: boolean };
  // The match as dealt, before anything happened (hands drawn, Generals placed).
  start: GameState;
  // A new match: every step so far (`choose_first` and `begin`; none while the toss winner has not chosen). A match you are coming back to: empty, see `latest`.
  rows: ViewRow[];
  latest: ViewRow | null;
  status: 'active' | 'finished';
  winner: Seat | null;
  resumed: boolean;
  ranked: boolean;
  // Ranked only: the league key of each player, mine first (public, like the ranking list); drives the ring around the portraits.
  leagues?: [string, string];
  deadline: number | null;
  now: number;
}

// Quick messages: only ready-made codes (p1..p6 phrases, e1..e6 emojis), a pause between two of them, a cap per match.
const EMOTE_CODE = /^[pe][1-6]$/;
const EMOTE_GAP_MS = 2500;
const EMOTE_MAX_PER_MATCH = 80;

// What a client may know about a player's ladder numbers (the hidden Elo stays on the server).
export interface RankedView { points: number; label: string; league: string; division: number | null; inDivision: number; games: number; wins: number; losses: number; shield: boolean; peak: number; placementLeft: number; position: number; top: boolean;
  // The season these numbers belong to, when it ends, the portrait frame won earlier, and finished seasons whose Coroas were not claimed yet.
  season: number; endsAt: number; frame: string | null; pending: { season: number; league: string; coroas: number }[] }
const PLACEMENT = 5;
const REPEAT_LIMIT = 3;
const frameRank = (k: string | null | undefined) => (k === 'senhor-da-guerra' ? LEAGUES.length : k ? LEAGUES.indexOf(k as any) : -1);
// The season calendar, moved forward by the test setting `season_offset_days` (0 normally). `endsAt` is returned in real time.
const calendar = async (db: Db, cfg: GameConfig) => {
  const offset = Math.round((await db.seasonOffsetDays()) * 86400000);
  const s = seasonAt(cfg.now() + offset);
  return { number: s.number, endsAt: s.endsAt - offset };
};
const rankedView = async (db: Db, cfg: GameConfig, p: RankedProfile, userId?: string): Promise<RankedView> => {
  const l = leagueOf(p.points);
  const cal = await calendar(db, cfg);
  const season = p.season ?? cal.number;
  const position = await db.rankedPosition(p.points, season);
  const top = p.points >= MESTRE_FROM && position <= TOP_LEAGUE_SIZE;
  const pending = userId ? (await db.rankedSeasons(userId)).filter(x => !x.claimed).map(x => ({ season: x.season, league: x.league, coroas: x.coroas })) : [];
  return { points: p.points, label: leagueLabel(p.points, top), league: top ? 'senhor-da-guerra' : l.league, division: l.division, inDivision: l.inDivision, games: p.games, wins: p.wins, losses: p.losses, shield: p.shield, peak: p.peak, placementLeft: Math.max(0, PLACEMENT - p.games), position, top,
    season, endsAt: cal.endsAt, frame: p.frame ?? null, pending };
};

// The player's ladder row for the CURRENT season. A row left over from an older season is closed first (once): the season pays by the highest
// league reached (Senhor da Guerra if they were among the best Mestres), the points are halved and the frame is kept.
const ladderOf = async (db: Db, cfg: GameConfig, userId: string): Promise<RankedProfile> => {
  const current = (await calendar(db, cfg)).number;
  const p = await db.rankedProfile(userId);
  if (!p) return newRankedProfile(current);
  const old = p.season ?? 1;
  if (old >= current) return p;
  const reached = Math.max(p.peak, p.points);
  const top = reached >= MESTRE_FROM && (await db.rankedPosition(reached, old)) <= TOP_LEAGUE_SIZE;
  const c = closeSeason(p, current, top);
  await db.rankedCloseSeason(userId, { season: old, peak: reached, league: c.league, coroas: c.coroas, claimed: false }, c.next);
  return (await db.rankedProfile(userId)) ?? c.next;
};

export type GameRequest =
  | { op: 'queue'; cards: Record<string, number>; general: string; vsBot?: boolean; botDeck?: string; ranked?: boolean }
  | { op: 'ranked' }
  | { op: 'claim'; season: number }
  | { op: 'ranking'; limit?: number }
  | { op: 'status' }
  | { op: 'cancel' }
  | { op: 'act'; matchId: string; action: Action; since?: number }
  | { op: 'tick'; matchId: string; since?: number }
  | { op: 'result'; matchId: string }
  | { op: 'emote'; matchId: string; code: string; since?: number }
  | { op: 'emotes'; matchId: string; since?: number };

export type GameResponse =
  | { ok: true; status: 'waiting' | 'none' }
  | { ok: true; status: 'matched'; match: MatchInit }
  | { ok: true; status: 'acted'; rows: ViewRow[]; finished: boolean; deadline: number | null; now: number; reward: RewardRow | null }
  | { ok: true; status: 'result'; finished: boolean; reward: RewardRow | null }
  | { ok: true; status: 'ranked'; profile: RankedView }
  | { ok: true; status: 'claimed'; coroas: number; coroas_after: number; profile: RankedView }
  | { ok: true; status: 'ranking'; rows: { rank: number; user: string; name: string; avatarId: string; points: number; label: string; top: boolean; me: boolean }[]; me: RankedView }
  | { ok: true; status: 'emotes'; emotes: { id: number; from: 0 | 1; code: string }[] }
  | { ok: false; error: string };

const BOT_PROFILE = { name: 'Adversário', avatarId: 'batedora' };
const STALE_MATCH_MS = 45 * 60 * 1000;
const BOT_STEP_LIMIT = 600;
const AUTO_STEP_LIMIT = 40;

const recipeDeck = (id: DeckId): DeckJson => ({ general: DECK_RECIPES[id].general, cards: { ...DECK_RECIPES[id].cards } });
// The bot plays the prebuilt deck of the other faction, as in the local game.
const botDeckFor = (deck: DeckJson): DeckJson => (deck.general === DECK_RECIPES.capitao.general ? recipeDeck('cardeal') : recipeDeck('capitao'));
const playerOf = (m: MatchRow, userId: string): Seat | null => (m.seat0 === userId ? 0 : m.seat1 === userId ? 1 : null);
const userOfSeat = (m: MatchRow, seat: Seat): string | null => (seat === 0 ? m.seat0 : m.seat1);
const moverOf = (s: GameState): Seat => (s.pending ? s.pending.seat : s.turn.active);
const moverKey = (s: GameState) => `${s.turn.round}:${s.turn.active}:${s.pending ? s.pending.kind + s.pending.seat : ''}`;

// ── Recording steps ─────────────────────────────────────────────────────────
// A working copy of a match while actions are being applied: the new state, the numbering, the clock, and what
// has to be written once the whole thing succeeds.
interface Work {
  state: GameState;
  n: number;
  key: string;
  deadline: number | null;
  steps: StepRow[];
  views: ViewRow[];
}

const startWork = (m: MatchRow): Work => ({ state: m.state, n: m.steps_count, key: moverKey(m.state), deadline: m.turn_deadline, steps: [], views: [] });

// Applies one action to the working copy and records it (and what each human player sees of it).
const applyStep = (m: MatchRow, w: Work, seat: Seat, action: Action, cfg: GameConfig, notes?: (viewer: Seat) => GameEvent[]): { ok: true } | { ok: false; error: string } => {
  const r = applyAction(w.state, seat, action);
  if (r.ok === false) return r;
  w.state = r.state;
  const n = ++w.n;
  w.steps.push({ n, seat, action });
  // The clock restarts whenever the turn, or who has to answer a prompt, changes.
  const key = moverKey(w.state);
  if (w.state.winner !== null) w.deadline = null;
  else if (key !== w.key) { w.key = key; w.deadline = cfg.now() + (w.state.pending ? cfg.promptMs : cfg.turnMs); }
  ([0, 1] as Seat[]).forEach(viewer => {
    const user = userOfSeat(m, viewer);
    if (!user) return;
    w.views.push({
      n, viewer, user, actor: seat === viewer ? 0 : 1, action,
      events: eventsFor([...r.events, ...(notes ? notes(viewer) : [])], viewer),
      state: viewFor(w.state, viewer), deadline: w.deadline,
    });
  });
  return { ok: true };
};

// Lets the bot (if it is the one to move) keep acting until a human has to answer.
const runBot = (m: MatchRow, w: Work, cfg: GameConfig) => {
  if (m.bot_seat === null) return;
  const bot = m.bot_seat;
  const rng = { rng: seedFrom(m.seed * 31 + w.n) };
  const rand = () => nextRandom(rng);
  for (let i = 0; i < BOT_STEP_LIMIT && w.state.winner === null; i++) {
    if (moverOf(w.state) !== bot) break;
    if (applyStep(m, w, bot, aiNextAction(w.state, bot, rand), cfg).ok === false) break; // a refused bot move would be a bug: stop instead of looping
  }
};

const patchOf = (m: MatchRow, w: Work, extra: Partial<MatchPatch> = {}): MatchPatch => ({
  state: w.state, steps_count: w.n, status: w.state.winner !== null ? 'finished' : 'active', winner: w.state.winner,
  turn_deadline: w.deadline, timeouts: m.timeouts, end_reason: m.end_reason, ...extra,
});


// ── Ranked matchmaking ──────────────────────────────────────────────────────
// Players of similar hidden Elo are paired. The accepted gap starts at 100 and widens with the longest wait of the two (`mmrWindow`), so
// nobody waits forever. The closest Elo among those inside the window is taken; if somebody else took it first, the next one is tried.
const pickRankedOpponent = async (db: Db, cfg: GameConfig, userId: string, myWaitedMs: number): Promise<QueueRow | null> => {
  const waiting = (await db.queueWaiting(userId, true)).filter(q => cfg.now() - Date.parse(q.created_at) <= cfg.queueStaleMs);
  if (!waiting.length) return null;
  const mine = (await ladderOf(db, cfg, userId)).mmr;
  const scored: { q: QueueRow; gap: number }[] = [];
  for (const q of waiting) {
    const theirs = (await ladderOf(db, cfg, q.user_id)).mmr;
    const waited = Math.max(myWaitedMs, cfg.now() - Date.parse(q.since ?? q.created_at));
    const gap = Math.abs(mine - theirs);
    if (gap <= mmrWindow(waited)) scored.push({ q, gap });
  }
  scored.sort((a, b) => a.gap - b.gap);
  for (const { q } of scored) { const taken = await db.queueTakeUser(q.user_id); if (taken) return taken; }
  return null;
};

// ── Rewards ─────────────────────────────────────────────────────────────────
// Pays the match's rewards once it is over. Safe to call again: the database refuses to pay twice.
const ensureRewards = async (db: Db, cfg: GameConfig, m: MatchRow): Promise<RewardRow[] | null> => {
  if (m.status !== 'finished' || m.winner === null) return null;
  let rows: RewardRow[] | null = m.rewards;
  if (!rows) {
    const made: RewardRow[] = [];
    // Ranked: both players' ladder numbers are read before either moves, so the result does not depend on the order.
    const ladder: Partial<Record<Seat, RankedProfile>> = {};
    // Fair play: the same two players can earn points from only the first REPEAT_LIMIT matches against each other in 24 hours.
    let repeat = false;
    if (m.ranked && m.seat0 && m.seat1) repeat = (await db.rankedPairCount(m.seat0, m.seat1, cfg.now() - 24 * 3600 * 1000, m.id)) >= REPEAT_LIMIT;
    if (m.ranked) for (const seat of [0, 1] as Seat[]) { const u = userOfSeat(m, seat); if (u) ladder[seat] = await ladderOf(db, cfg, u); }
    for (const seat of [0, 1] as Seat[]) {
      const user = userOfSeat(m, seat);
      if (!user) continue;
      const prof = await db.profile(user);
      if (!prof) continue;
      const won = m.winner === seat;
      const ending = won ? 'general' : (m.end_reason ?? 'general');
      const reward = rewardFor({ won, vsBot: m.bot_seat !== null, ending, rounds: m.state.turn.round, steps: m.steps_count });
      const after = applyReward({ level: prof.level, xp: prof.xp, coroas: prof.coroas }, reward);
      const row: RewardRow = { user_id: user, seat, reason: reward.reason, xp: reward.xp, coroas: reward.coroas, level: after.level, xp_after: after.xp, coroas_after: after.coroas, levels_gained: after.levelsGained };
      const me = ladder[seat], foe = ladder[otherSeat(seat)];
      if (m.ranked && me && foe) {
        const r = applyRankedMatch({ me, opponentMmr: foe.mmr, won, ending, counts: reward.reason !== 'too_short' && !repeat });
        row.ranked = { delta: r.delta, mmr_delta: r.mmrDelta, placement: r.placement, promoted: r.promoted, demoted: r.demoted, shield_used: r.shieldUsed, league_before: r.leagueBefore, league_after: r.leagueAfter, profile: r.next, ...(repeat && reward.reason !== 'too_short' ? { repeat: true } : {}) };
      }
      made.push(row);
    }
    if (made.length === 0) return null;
    const applied = await db.applyRewards(m.id, made);
    rows = applied ? made : (await db.getMatch(m.id))?.rewards ?? null;
  }
  // The ladder points are applied once, even if the call that paid the rewards died before it got here.
  if (rows && m.ranked && !m.ranked_done) {
    const items = rows.filter(r => r.ranked).map(r => ({ user_id: r.user_id, profile: r.ranked!.profile }));
    if (items.length) await db.rankedSettle(m.id, items);
  }
  return rows;
};

// What a device may see of its reward: the hidden Elo (and how much it moved) is stripped from the ladder part.
const publicReward = (r: RewardRow | null): RewardRow | null => {
  if (!r || !r.ranked) return r;
  const { mmr: _mmr, ...profile } = r.ranked.profile;
  const { mmr_delta: _d, ...rest } = r.ranked;
  return { ...r, ranked: { ...rest, profile } as any };
};
const rewardOf = (m: MatchRow, rows: RewardRow[] | null, userId: string): RewardRow | null => publicReward(rows?.find(r => r.user_id === userId) ?? m.rewards?.find(r => r.user_id === userId) ?? null);

// ── The turn clock ──────────────────────────────────────────────────────────
// Called whenever anybody touches the match: if the player who has to move ran out of time, their turn is played out
// for them (pass; prompts answered by the default choice) — and a second timeout in a row forfeits the match.
const enforceClock = async (db: Db, m: MatchRow, cfg: GameConfig): Promise<MatchRow> => {
  for (let guard = 0; guard < 3; guard++) {
    if (m.status !== 'active' || m.turn_deadline === null || cfg.now() <= m.turn_deadline) return m;
    const mover = moverOf(m.state);
    if (mover === m.bot_seat) return m;
    const timeouts: [number, number] = [m.timeouts[0], m.timeouts[1]];
    timeouts[mover] += 1;
    const w = startWork(m);
    let endReason = m.end_reason;
    if (timeouts[mover] >= cfg.maxTimeouts) {
      endReason = 'timeout';
      applyStep(m, w, mover, { type: 'concede' }, cfg, viewer => [{ t: 'log', seat: viewer, text: viewer === mover ? 'O tempo acabou de novo: você perdeu a partida.' : 'O adversário esgotou o tempo: vitória!' }]);
    } else {
      let first = true;
      // Nobody chose yet (the toss winner let the clock run out): the match just opens, with them going first.
      const unopened = w.state.turn.started === false;
      if (unopened) openMatch(m, w, true, cfg);
      for (let i = 0; !unopened && i < AUTO_STEP_LIMIT && w.state.winner === null && moverOf(w.state) === mover; i++) {
        const action: Action = w.state.pending ? aiNextAction(w.state, mover, () => 0.5) : { type: 'advance' };
        const note = first ? (viewer: Seat): GameEvent[] => [{ t: 'log', seat: viewer, text: viewer === mover ? 'O tempo acabou: seu turno foi encerrado automaticamente.' : 'O adversário demorou demais: turno encerrado automaticamente.' }] : undefined;
        if (applyStep(m, w, mover, action, cfg, note).ok === false) break;
        first = false;
      }
      runBot(m, w, cfg);
      if (w.state.winner === null && w.key === moverKey(m.state)) w.deadline = cfg.now() + cfg.turnMs; // nothing moved on: give a fresh clock
    }
    const saved = await db.saveMatch(m.id, m.steps_count, patchOf({ ...m, timeouts, end_reason: endReason }, w, { timeouts, end_reason: endReason }), w.steps, w.views);
    const fresh = await db.getMatch(m.id);
    if (!fresh) return m;
    m = fresh;
    if (!saved) continue;
    if (m.status === 'finished') await ensureRewards(db, cfg, m);
  }
  return m;
};

// ── Starting a match ────────────────────────────────────────────────────────
// The toss winner's choice and the opening of the first turn: two steps (choose_first, then begin by whoever goes first).
const openMatch = (m: MatchRow, w: Work, goFirst: boolean, cfg: GameConfig) => {
  const winner = w.state.turn.active;
  if (applyStep(m, w, winner, { type: 'choose_first', goFirst }, cfg).ok === false) throw new Error('choose_first refused');
  w.key = ''; // so the clock starts with the first turn, even when the same person goes first
  if (applyStep(m, w, w.state.turn.active, { type: 'begin' }, cfg).ok === false) throw new Error('begin refused');
};

const viewRowsOf = (db: Db, m: MatchRow, seat: Seat, since: number) => db.views(m.id, seat, since);

const initOf = async (db: Db, m: MatchRow, userId: string, cfg: GameConfig): Promise<MatchInit> => {
  const seat = playerOf(m, userId) as Seat;
  const oppId = userOfSeat(m, otherSeat(seat));
  const prof = oppId ? await db.profile(oppId) : null;
  const rows = await viewRowsOf(db, m, seat, 0);
  const resumed = rows.length > 0 && (rows.some(r => r.actor === 0 && r.action.type !== 'begin' && r.action.type !== 'choose_first') || cfg.now() - Date.parse(m.created_at) > 60000);
  const start = viewFor(createMatch({ seed: m.seed, decks: m.decks, first: m.state.turn.first }).state, seat);
  let leagues: [string, string] | undefined;
  if (m.ranked) {
    const ids = [userId, oppId];
    // The ring around a portrait: the better of the frame won in an earlier season and the current league.
    const keys = await Promise.all(ids.map(async u => {
      if (!u) return 'ferro';
      const p = await ladderOf(db, cfg, u);
      const now = (await rankedView(db, cfg, p)).league;
      return frameRank(p.frame) > frameRank(now) ? (p.frame as string) : now;
    }));
    leagues = [keys[0], keys[1]];
  }
  return {
    id: m.id, iGoFirst: m.state.turn.first === seat, iWonToss: m.first === seat, chosen: m.steps_count > 0, mySide: seat === 0 ? 'cara' : 'coroa', myDeck: m.decks[seat], opponentGeneral: m.decks[otherSeat(seat)].general,
    opponent: oppId ? { name: prof?.username ?? 'Jogador', avatarId: prof?.avatar_id ?? 'batedora', bot: false } : { ...BOT_PROFILE, bot: true },
    start, rows: resumed ? [] : rows, latest: resumed ? (rows[rows.length - 1] ?? null) : null,
    status: m.status, winner: m.winner === null ? null : (m.winner === seat ? 0 : 1), resumed, ranked: m.ranked, leagues, deadline: m.turn_deadline, now: cfg.now(),
  };
};

const startMatch = async (db: Db, cfg: GameConfig, a: { user: string | null; deck: DeckJson }, b: { user: string | null; deck: DeckJson }, ranked = false): Promise<MatchRow> => {
  const seed = Math.floor(cfg.random() * 0x7fffffff) + 1;
  // The coin toss: its winner picks to play first or second (see `choose_first`); `first` stays the winner's chair.
  const first = (cfg.random() < 0.5 ? 0 : 1) as Seat;
  // Seat order is random too, so being the first to queue is no advantage.
  const [p0, p1] = cfg.random() < 0.5 ? [b, a] : [a, b];
  const bot_seat: Seat | null = p0.user === null ? 0 : p1.user === null ? 1 : null;
  const decks: [DeckJson, DeckJson] = [p0.deck, p1.deck];
  const created = createMatch({ seed, decks, first });
  const draft: Omit<MatchRow, 'id' | 'created_at'> = {
    seed, status: 'active', first, seat0: p0.user, seat1: p1.user, bot_seat, decks, state: created.state, steps_count: 0, winner: null,
    turn_deadline: null, timeouts: [0, 0], end_reason: null, rewards: null, ranked, ranked_done: false,
  };
  const m: MatchRow = { ...draft, id: '', created_at: new Date(cfg.now()).toISOString() };
  const w = startWork(m);
  if (bot_seat === first) {
    // The bot won the toss: it chooses at random, and the match opens at once.
    openMatch(m, w, cfg.random() < 0.5, cfg);
    runBot(m, w, cfg);
  } else {
    // A person won the toss: the match waits (no step yet) for their choice, on the usual clock.
    w.deadline = cfg.now() + cfg.promptMs;
  }
  return db.createMatch({ ...draft, ...patchOf(m, w) }, w.steps, w.views);
};

const finishIfStale = async (db: Db, cfg: GameConfig, m: MatchRow | null): Promise<MatchRow | null> => {
  if (!m) return null;
  if (cfg.now() - Date.parse(m.created_at) > STALE_MATCH_MS) {
    await db.saveMatch(m.id, m.steps_count, { ...patchOf(m, startWork(m)), status: 'finished' }, [], []);
    return null;
  }
  return m;
};

// ── Requests ────────────────────────────────────────────────────────────────
// A request is untrusted input from a phone: the shape and sizes are checked before anything reads it (the game rules themselves are checked by the engine).
const OPS = new Set(['queue', 'ranked', 'claim', 'ranking', 'status', 'cancel', 'act', 'tick', 'result', 'emote', 'emotes']);
export const badRequest = (req: unknown): string | null => {
  if (!req || typeof req !== 'object' || Array.isArray(req)) return 'Pedido inválido.';
  const r = req as Record<string, unknown>;
  if (typeof r.op !== 'string' || !OPS.has(r.op)) return 'Pedido desconhecido.';
  if (r.matchId !== undefined && (typeof r.matchId !== 'string' || r.matchId.length > 64)) return 'Pedido inválido.';
  if (r.since !== undefined && !(Number.isInteger(r.since) && (r.since as number) >= 0 && (r.since as number) < 1e7)) return 'Pedido inválido.';
  if (r.season !== undefined && !(Number.isInteger(r.season) && (r.season as number) >= 0 && (r.season as number) < 1e4)) return 'Pedido inválido.';
  if (r.limit !== undefined && !(typeof r.limit === 'number' && Number.isFinite(r.limit))) return 'Pedido inválido.';
  if (r.code !== undefined && (typeof r.code !== 'string' || r.code.length > 8)) return 'Pedido inválido.';
  if (r.general !== undefined && (typeof r.general !== 'string' || r.general.length > 80)) return 'Deck inválido.';
  if (r.botDeck !== undefined && (typeof r.botDeck !== 'string' || r.botDeck.length > 40)) return 'Pedido inválido.';
  if (r.cards !== undefined) {
    const c = r.cards;
    if (!c || typeof c !== 'object' || Array.isArray(c)) return 'Deck inválido.';
    const entries = Object.entries(c as Record<string, unknown>);
    if (entries.length > 200) return 'Deck inválido.';
    for (const [name, n] of entries) if (name.length > 80 || !Number.isInteger(n) || (n as number) < 0 || (n as number) > 99) return 'Deck inválido.';
  }
  if (r.action !== undefined && (!r.action || typeof r.action !== 'object' || Array.isArray(r.action) || JSON.stringify(r.action).length > 2000)) return 'Ação inválida.';
  return null;
};

export const handleGame = async (db: Db, userId: string, req: GameRequest, cfg: GameConfig = defaultConfig()): Promise<GameResponse> => {
  const invalid = badRequest(req);
  if (invalid) return { ok: false, error: invalid };
  switch (req.op) {
    case 'queue': {
      if (!req.cards || typeof req.cards !== 'object' || typeof req.general !== 'string') return { ok: false, error: 'Deck inválido.' };
      // saves antigos (decks e coleção) podem ter os nomes que os Mercenários tinham antes da rodada 18
      const cards = currentNames(req.cards), general = currentCardName(req.general);
      const resume = await finishIfStale(db, cfg, await db.activeMatchOf(userId));
      if (resume) return { ok: true, status: 'matched', match: await initOf(db, await enforceClock(db, resume, cfg), userId, cfg) };
      const problem = deckProblem(cards, general, currentNames(await db.collection(userId)));
      if (problem) return { ok: false, error: problem };
      const deck: DeckJson = { general, cards };
      const ranked = req.ranked === true && !req.vsBot;   // ranked is people only; a challenge against the AI is never ranked
      await db.queueDelete(userId);
      if (req.vsBot) {
        // A challenge may name the opponent's prebuilt deck (the Desafios map); anything else falls back to the usual pick.
        const chosen = typeof req.botDeck === 'string' && Object.prototype.hasOwnProperty.call(DECK_RECIPES, req.botDeck) ? recipeDeck(req.botDeck as DeckId) : botDeckFor(deck);
        const m = await startMatch(db, cfg, { user: userId, deck }, { user: null, deck: chosen });
        return { ok: true, status: 'matched', match: await initOf(db, m, userId, cfg) };
      }
      // Matchmaking is between people only: nobody is waiting -> wait (the AI is only for challenges, `vsBot` above).
      // Entries nobody has refreshed lately belong to players who left: skip them.
      let other: QueueRow | null;
      if (ranked) other = await pickRankedOpponent(db, cfg, userId, 0);
      else {
        other = await db.queueTake(userId, ranked);
        for (let i = 0; other && cfg.now() - Date.parse(other.created_at) > cfg.queueStaleMs && i < 20; i++) other = await db.queueTake(userId, ranked);
        if (other && cfg.now() - Date.parse(other.created_at) > cfg.queueStaleMs) other = null;
      }
      if (other) {
        const m = await startMatch(db, cfg, { user: userId, deck }, { user: other.user_id, deck: other.deck }, ranked);
        return { ok: true, status: 'matched', match: await initOf(db, m, userId, cfg) };
      }
      await db.queuePut({ user_id: userId, deck, created_at: new Date(cfg.now()).toISOString(), ranked, ...(ranked ? { since: new Date(cfg.now()).toISOString() } : {}) });
      return { ok: true, status: 'waiting' };
    }
    case 'status': {
      const active = await finishIfStale(db, cfg, await db.activeMatchOf(userId));
      if (active) return { ok: true, status: 'matched', match: await initOf(db, await enforceClock(db, active, cfg), userId, cfg) };
      const q = await db.queueGet(userId);
      if (!q) return { ok: true, status: 'none' };
      // Ranked: the window of accepted Elo gaps widens with the wait, so each poll looks again for someone now inside it.
      if (q.ranked) {
        const waited = cfg.now() - Date.parse(q.since ?? q.created_at);
        const other = await pickRankedOpponent(db, cfg, userId, waited);
        if (other) {
          // Take my own entry first: if somebody paired with me meanwhile, that match is mine (and the opponent I picked goes back to waiting).
          const mine = await db.queueTakeUser(userId);
          if (!mine) { await db.queuePut(other); const done = await db.activeMatchOf(userId); if (done) return { ok: true, status: 'matched', match: await initOf(db, done, userId, cfg) }; return { ok: true, status: 'waiting' }; }
          const m = await startMatch(db, cfg, { user: userId, deck: mine.deck }, { user: other.user_id, deck: other.deck }, true);
          return { ok: true, status: 'matched', match: await initOf(db, m, userId, cfg) };
        }
      }
      // Still waiting (no bot fills in): polling keeps the entry fresh.
      await db.queuePut({ user_id: userId, deck: q.deck, created_at: new Date(cfg.now()).toISOString(), ranked: q.ranked, ...(q.ranked ? { since: q.since ?? q.created_at } : {}) });
      return { ok: true, status: 'waiting' };
    }
    case 'cancel': {
      await db.queueDelete(userId);
      // Backing out right as a match was being made for you: it counts as walking away, so you are not
      // dropped back into a match you never saw (the other player, if any, wins — no rewards, it never began).
      const m = await db.activeMatchOf(userId);
      const seat = m ? playerOf(m, userId) : null;
      if (m && seat !== null && cfg.now() - Date.parse(m.created_at) < 60000) {
        const rows = await db.views(m.id, seat, 0);
        if (!rows.some(r => r.actor === 0 && r.action.type !== 'begin' && r.action.type !== 'choose_first')) {
          const w = startWork(m);
          if (applyStep(m, w, seat, { type: 'concede' }, cfg).ok === true) await db.saveMatch(m.id, m.steps_count, patchOf({ ...m, end_reason: 'concede' }, w, { end_reason: 'concede' }), w.steps, w.views);
        }
      }
      return { ok: true, status: 'none' };
    }
    case 'tick':
    case 'act': {
      if (req.op === 'act' && (!req.action || typeof req.action.type !== 'string' || req.action.type === 'begin')) return { ok: false, error: 'Ação inválida.' };
      for (let attempt = 0; attempt < 3; attempt++) {
        let m = await db.getMatch(req.matchId);
        if (!m) return { ok: false, error: 'Partida não encontrada.' };
        const seat = playerOf(m, userId);
        if (seat === null) return { ok: false, error: 'Você não está nessa partida.' };
        m = await enforceClock(db, m, cfg);
        if (req.op === 'tick' || m.status !== 'active') {
          if (req.op === 'act') return { ok: false, error: 'A partida já terminou.' };
          const rewards = await ensureRewards(db, cfg, m);
          return { ok: true, status: 'acted', rows: await db.views(m.id, seat, req.since ?? 0), finished: m.status === 'finished', deadline: m.turn_deadline, now: cfg.now(), reward: rewardOf(m, rewards, userId) };
        }
        const w = startWork(m);
        const timeouts: [number, number] = [m.timeouts[0], m.timeouts[1]];
        timeouts[seat] = 0; // acting clears the "ran out of time" streak
        const act = (req as Extract<GameRequest, { op: 'act' }>).action;
        const applied = applyStep(m, w, seat, act, cfg);
        if (applied.ok === false) return { ok: false, error: applied.error };
        // The toss winner's choice opens the match: the first player's `begin` follows by itself.
        if (act.type === 'choose_first') {
          w.key = '';
          if (applyStep(m, w, w.state.turn.active, { type: 'begin' }, cfg).ok === false) return { ok: false, error: 'Não foi possível começar a partida.' };
        }
        runBot(m, w, cfg);
        const endReason: EndReason | null = act.type === 'concede' ? 'concede' : w.state.winner !== null ? 'general' : m.end_reason;
        const saved = await db.saveMatch(m.id, m.steps_count, patchOf({ ...m, timeouts }, w, { timeouts, end_reason: endReason }), w.steps, w.views);
        if (!saved) continue; // somebody else moved first: look again
        const fresh = (await db.getMatch(m.id)) ?? m;
        const rewards = w.state.winner !== null ? await ensureRewards(db, cfg, fresh) : null;
        return { ok: true, status: 'acted', rows: await db.views(m.id, seat, req.since ?? 0), finished: w.state.winner !== null, deadline: w.deadline, now: cfg.now(), reward: rewardOf(fresh, rewards, userId) };
      }
      return { ok: false, error: 'A partida mudou enquanto você jogava. Tente de novo.' };
    }
    case 'result': {
      const m = await db.getMatch(req.matchId);
      if (!m || playerOf(m, userId) === null) return { ok: false, error: 'Partida não encontrada.' };
      const rewards = await ensureRewards(db, cfg, m);
      return { ok: true, status: 'result', finished: m.status === 'finished', reward: rewardOf(m, rewards, userId) };
    }
    case 'ranked': {
      return { ok: true, status: 'ranked', profile: await rankedView(db, cfg, await ladderOf(db, cfg, userId), userId) };
    }
    case 'claim': {
      const paid = await db.rankedClaim(userId, Math.floor(Number(req.season)));
      if (!paid) return { ok: false, error: 'Nada para resgatar.' };
      return { ok: true, status: 'claimed', coroas: paid.coroas, coroas_after: paid.coroas_after, profile: await rankedView(db, cfg, await ladderOf(db, cfg, userId), userId) };
    }
    case 'ranking': {
      const limit = Math.max(1, Math.min(100, Math.floor(Number(req.limit) || 50)));
      const mine = await ladderOf(db, cfg, userId);
      const top = withTopLeague((await db.rankedTop(limit, mine.season ?? 1)).map(r => ({ ...r, points: r.profile.points })));
      return { ok: true, status: 'ranking', me: await rankedView(db, cfg, mine, userId), rows: top.map(r => ({ rank: r.rank, user: r.user_id, name: r.username, avatarId: r.avatar_id, points: r.points, label: leagueLabel(r.points, r.top), top: r.top, me: r.user_id === userId })) };
    }
    case 'emote':
    case 'emotes': {
      const m = await db.getMatch(req.matchId);
      if (!m) return { ok: false, error: 'Partida não encontrada.' };
      const seat = playerOf(m, userId);
      if (seat === null) return { ok: false, error: 'Você não está nessa partida.' };
      if (req.op === 'emote') {
        if (m.status !== 'active') return { ok: false, error: 'A partida já terminou.' };
        if (m.bot_seat !== null) return { ok: false, error: 'Contra o adversário automático não há mensagens.' };
        if (typeof req.code !== 'string' || !EMOTE_CODE.test(req.code)) return { ok: false, error: 'Mensagem inválida.' };
        const mine = (await db.emotesSince(m.id, 0)).filter(e => e.seat === seat);
        const now = cfg.now();
        if (mine.length >= EMOTE_MAX_PER_MATCH) return { ok: false, error: 'Mensagens demais nessa partida.' };
        if (mine.length && now - mine[mine.length - 1].at < EMOTE_GAP_MS) return { ok: false, error: 'Espere um instante.' };
        await db.addEmote(m.id, seat, req.code, now);
      }
      const rows = await db.emotesSince(m.id, Math.max(0, Number(req.since) || 0));
      return { ok: true, status: 'emotes', emotes: rows.map(e => ({ id: e.id, from: (e.seat === seat ? 0 : 1) as 0 | 1, code: e.code })) };
    }
    default:
      return { ok: false, error: 'Pedido desconhecido.' };
  }
};
