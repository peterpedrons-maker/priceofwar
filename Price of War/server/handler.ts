// The game server's brain: matchmaking, move validation, the turn clock and rewards. It owns the authoritative
// match (full state, in the database), refuses anything the engine refuses, runs the bot seat, and records every
// action. Players never see the full state: for each step they get a view with the other player's hand and every
// deck order removed (see src/engine/view.ts), and their device just shows it.
import { aiNextAction } from '../src/engine/ai';
import { DECK_RECIPES, type DeckId } from '../src/engine/catalog';
import { deckProblem } from '../src/engine/deck';
import { applyAction, createMatch } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import { applyReward, rewardFor } from '../src/engine/rewards';
import type { Action, GameEvent, GameState, Seat } from '../src/engine/types';
import { otherSeat } from '../src/engine/types';
import { eventsFor, viewFor } from '../src/engine/view';
import type { Db, DeckJson, EndReason, MatchPatch, MatchRow, RewardRow, StepRow, ViewRow } from './types';

export interface GameConfig {
  // How long a player waits in the queue before a bot takes the other chair.
  botAfterMs: number;
  // The clock: time for a whole turn, and for answering a prompt (an ambush, a pick, a discard).
  turnMs: number;
  promptMs: number;
  // Turns in a row a player may let run out before the match is forfeited.
  maxTimeouts: number;
  now: () => number;
  random: () => number;
}

export const defaultConfig = (): GameConfig => ({ botAfterMs: 15000, turnMs: 150000, promptMs: 60000, maxTimeouts: 2, now: () => Date.now(), random: Math.random });

export interface MatchInit {
  id: string;
  // True when the player goes first (decided by the server's coin toss).
  iGoFirst: boolean;
  // The side of the coin this player was given: seat order is random, so seat 0 = Cara, seat 1 = Coroa is fair.
  mySide: 'cara' | 'coroa';
  myDeck: DeckJson;
  opponentGeneral: string;
  opponent: { name: string; avatarId: string; bot: boolean };
  // The match as dealt, before anything happened (hands drawn, Generals placed).
  start: GameState;
  // A new match: every step so far (at least `begin`). A match you are coming back to: empty, see `latest`.
  rows: ViewRow[];
  latest: ViewRow | null;
  status: 'active' | 'finished';
  winner: Seat | null;
  resumed: boolean;
  deadline: number | null;
  now: number;
}

export type GameRequest =
  | { op: 'queue'; cards: Record<string, number>; general: string; vsBot?: boolean }
  | { op: 'status' }
  | { op: 'cancel' }
  | { op: 'act'; matchId: string; action: Action; since?: number }
  | { op: 'tick'; matchId: string; since?: number }
  | { op: 'result'; matchId: string };

export type GameResponse =
  | { ok: true; status: 'waiting' | 'none' }
  | { ok: true; status: 'matched'; match: MatchInit }
  | { ok: true; status: 'acted'; rows: ViewRow[]; finished: boolean; deadline: number | null; now: number; reward: RewardRow | null }
  | { ok: true; status: 'result'; finished: boolean; reward: RewardRow | null }
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

// ── Rewards ─────────────────────────────────────────────────────────────────
// Pays the match's rewards once it is over. Safe to call again: the database refuses to pay twice.
const ensureRewards = async (db: Db, m: MatchRow): Promise<RewardRow[] | null> => {
  if (m.status !== 'finished' || m.winner === null) return null;
  if (m.rewards) return m.rewards;
  const rows: RewardRow[] = [];
  for (const seat of [0, 1] as Seat[]) {
    const user = userOfSeat(m, seat);
    if (!user) continue;
    const prof = await db.profile(user);
    if (!prof) continue;
    const won = m.winner === seat;
    const reward = rewardFor({ won, vsBot: m.bot_seat !== null, ending: won ? 'general' : (m.end_reason ?? 'general'), rounds: m.state.turn.round, steps: m.steps_count });
    const after = applyReward({ level: prof.level, xp: prof.xp, coroas: prof.coroas }, reward);
    rows.push({ user_id: user, seat, reason: reward.reason, xp: reward.xp, coroas: reward.coroas, level: after.level, xp_after: after.xp, coroas_after: after.coroas, levels_gained: after.levelsGained });
  }
  if (rows.length === 0) return null;
  const applied = await db.applyRewards(m.id, rows);
  if (applied) return rows;
  return (await db.getMatch(m.id))?.rewards ?? null;
};

const rewardOf = (m: MatchRow, rows: RewardRow[] | null, userId: string): RewardRow | null => rows?.find(r => r.user_id === userId) ?? m.rewards?.find(r => r.user_id === userId) ?? null;

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
      for (let i = 0; i < AUTO_STEP_LIMIT && w.state.winner === null && moverOf(w.state) === mover; i++) {
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
    if (m.status === 'finished') await ensureRewards(db, m);
  }
  return m;
};

// ── Starting a match ────────────────────────────────────────────────────────
const viewRowsOf = (db: Db, m: MatchRow, seat: Seat, since: number) => db.views(m.id, seat, since);

const initOf = async (db: Db, m: MatchRow, userId: string, cfg: GameConfig): Promise<MatchInit> => {
  const seat = playerOf(m, userId) as Seat;
  const oppId = userOfSeat(m, otherSeat(seat));
  const prof = oppId ? await db.profile(oppId) : null;
  const rows = await viewRowsOf(db, m, seat, 0);
  const resumed = rows.some(r => r.actor === 0 && r.action.type !== 'begin') || cfg.now() - Date.parse(m.created_at) > 60000;
  const start = viewFor(createMatch({ seed: m.seed, decks: m.decks, first: m.first }).state, seat);
  return {
    id: m.id, iGoFirst: m.first === seat, mySide: seat === 0 ? 'cara' : 'coroa', myDeck: m.decks[seat], opponentGeneral: m.decks[otherSeat(seat)].general,
    opponent: oppId ? { name: prof?.username ?? 'Jogador', avatarId: prof?.avatar_id ?? 'batedora', bot: false } : { ...BOT_PROFILE, bot: true },
    start, rows: resumed ? [] : rows, latest: resumed ? (rows[rows.length - 1] ?? null) : null,
    status: m.status, winner: m.winner === null ? null : (m.winner === seat ? 0 : 1), resumed, deadline: m.turn_deadline, now: cfg.now(),
  };
};

const startMatch = async (db: Db, cfg: GameConfig, a: { user: string | null; deck: DeckJson }, b: { user: string | null; deck: DeckJson }): Promise<MatchRow> => {
  const seed = Math.floor(cfg.random() * 0x7fffffff) + 1;
  const first = (cfg.random() < 0.5 ? 0 : 1) as Seat;
  // Seat order is random too, so being the first to queue is no advantage.
  const [p0, p1] = cfg.random() < 0.5 ? [b, a] : [a, b];
  const bot_seat: Seat | null = p0.user === null ? 0 : p1.user === null ? 1 : null;
  const decks: [DeckJson, DeckJson] = [p0.deck, p1.deck];
  const created = createMatch({ seed, decks, first });
  const draft: Omit<MatchRow, 'id' | 'created_at'> = {
    seed, status: 'active', first, seat0: p0.user, seat1: p1.user, bot_seat, decks, state: created.state, steps_count: 0, winner: null,
    turn_deadline: null, timeouts: [0, 0], end_reason: null, rewards: null,
  };
  const m: MatchRow = { ...draft, id: '', created_at: new Date(cfg.now()).toISOString() };
  const w = startWork(m);
  w.key = ''; // so the clock starts with the first turn
  if (applyStep(m, w, first, { type: 'begin' }, cfg).ok === false) throw new Error('begin refused');
  runBot(m, w, cfg);
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
export const handleGame = async (db: Db, userId: string, req: GameRequest, cfg: GameConfig = defaultConfig()): Promise<GameResponse> => {
  switch (req.op) {
    case 'queue': {
      if (!req.cards || typeof req.cards !== 'object' || typeof req.general !== 'string') return { ok: false, error: 'Deck inválido.' };
      const resume = await finishIfStale(db, cfg, await db.activeMatchOf(userId));
      if (resume) return { ok: true, status: 'matched', match: await initOf(db, await enforceClock(db, resume, cfg), userId, cfg) };
      const problem = deckProblem(req.cards, req.general, await db.collection(userId));
      if (problem) return { ok: false, error: problem };
      const deck: DeckJson = { general: req.general, cards: req.cards };
      await db.queueDelete(userId);
      if (req.vsBot) {
        const m = await startMatch(db, cfg, { user: userId, deck }, { user: null, deck: botDeckFor(deck) });
        return { ok: true, status: 'matched', match: await initOf(db, m, userId, cfg) };
      }
      const other = await db.queueTake(userId);
      if (other) {
        const m = await startMatch(db, cfg, { user: userId, deck }, { user: other.user_id, deck: other.deck });
        return { ok: true, status: 'matched', match: await initOf(db, m, userId, cfg) };
      }
      await db.queuePut({ user_id: userId, deck, created_at: new Date(cfg.now()).toISOString() });
      return { ok: true, status: 'waiting' };
    }
    case 'status': {
      const active = await finishIfStale(db, cfg, await db.activeMatchOf(userId));
      if (active) return { ok: true, status: 'matched', match: await initOf(db, await enforceClock(db, active, cfg), userId, cfg) };
      const q = await db.queueGet(userId);
      if (!q) return { ok: true, status: 'none' };
      if (cfg.now() - Date.parse(q.created_at) >= cfg.botAfterMs) {
        // Nobody showed up: the bot takes the other chair (same rules, same record, same rewards).
        await db.queueDelete(userId);
        const m = await startMatch(db, cfg, { user: userId, deck: q.deck }, { user: null, deck: botDeckFor(q.deck) });
        return { ok: true, status: 'matched', match: await initOf(db, m, userId, cfg) };
      }
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
        if (!rows.some(r => r.actor === 0 && r.action.type !== 'begin')) {
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
          const rewards = await ensureRewards(db, m);
          return { ok: true, status: 'acted', rows: await db.views(m.id, seat, req.since ?? 0), finished: m.status === 'finished', deadline: m.turn_deadline, now: cfg.now(), reward: rewardOf(m, rewards, userId) };
        }
        const w = startWork(m);
        const timeouts: [number, number] = [m.timeouts[0], m.timeouts[1]];
        timeouts[seat] = 0; // acting clears the "ran out of time" streak
        const act = (req as Extract<GameRequest, { op: 'act' }>).action;
        const applied = applyStep(m, w, seat, act, cfg);
        if (applied.ok === false) return { ok: false, error: applied.error };
        runBot(m, w, cfg);
        const endReason: EndReason | null = act.type === 'concede' ? 'concede' : w.state.winner !== null ? 'general' : m.end_reason;
        const saved = await db.saveMatch(m.id, m.steps_count, patchOf({ ...m, timeouts }, w, { timeouts, end_reason: endReason }), w.steps, w.views);
        if (!saved) continue; // somebody else moved first: look again
        const fresh = (await db.getMatch(m.id)) ?? m;
        const rewards = w.state.winner !== null ? await ensureRewards(db, fresh) : null;
        return { ok: true, status: 'acted', rows: await db.views(m.id, seat, req.since ?? 0), finished: w.state.winner !== null, deadline: w.deadline, now: cfg.now(), reward: rewardOf(fresh, rewards, userId) };
      }
      return { ok: false, error: 'A partida mudou enquanto você jogava. Tente de novo.' };
    }
    case 'result': {
      const m = await db.getMatch(req.matchId);
      if (!m || playerOf(m, userId) === null) return { ok: false, error: 'Partida não encontrada.' };
      const rewards = await ensureRewards(db, m);
      return { ok: true, status: 'result', finished: m.status === 'finished', reward: rewardOf(m, rewards, userId) };
    }
    default:
      return { ok: false, error: 'Pedido desconhecido.' };
  }
};
