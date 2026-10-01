// The game server's brain: matchmaking and move validation. It owns the authoritative match (full state, in
// the database), refuses anything the engine refuses, runs the bot seat, and records every action in order.
// Players only ever see the list of actions (match_steps); both clients replay them with the same engine.
import { aiNextAction } from '../src/engine/ai';
import { DECK_RECIPES, type DeckId } from '../src/engine/catalog';
import { deckProblem } from '../src/engine/deck';
import { applyAction, createMatch } from '../src/engine/game';
import { nextRandom, seedFrom } from '../src/engine/rng';
import type { Action, GameState, Seat } from '../src/engine/types';
import type { Db, DeckJson, MatchRow, StepRow } from './types';

export interface GameConfig {
  // How long a player waits in the queue before a bot takes the other chair.
  botAfterMs: number;
  now: () => number;
  random: () => number;
}

export const defaultConfig = (): GameConfig => ({ botAfterMs: 15000, now: () => Date.now(), random: Math.random });

export interface MatchInit {
  id: string;
  seat: Seat;
  seed: number;
  first: Seat;
  decks: [DeckJson, DeckJson];
  opponent: { name: string; avatarId: string; bot: boolean };
  steps: StepRow[];
  status: 'active' | 'finished';
  winner: Seat | null;
  resumed: boolean;
}

export type GameRequest =
  | { op: 'queue'; cards: Record<string, number>; general: string; vsBot?: boolean }
  | { op: 'status' }
  | { op: 'cancel' }
  | { op: 'act'; matchId: string; action: Action; since?: number }
  | { op: 'steps'; matchId: string; since?: number };

export type GameResponse =
  | { ok: true; status: 'waiting' | 'none' }
  | { ok: true; status: 'matched'; match: MatchInit }
  | { ok: true; status: 'acted'; steps: StepRow[]; finished: boolean; winner: Seat | null }
  | { ok: false; error: string };

const BOT_PROFILE = { name: 'Adversário', avatarId: 'batedora' };
const STALE_MATCH_MS = 45 * 60 * 1000;
const BOT_STEP_LIMIT = 600;

const decksOf = (id: DeckId): DeckJson => ({ general: DECK_RECIPES[id].general, cards: { ...DECK_RECIPES[id].cards } });

// The bot plays the prebuilt deck of the other faction, as in the local game.
const botDeckFor = (deck: DeckJson): DeckJson => (deck.general === DECK_RECIPES.capitao.general ? decksOf('cardeal') : decksOf('capitao'));

const playerOf = (m: MatchRow, userId: string): Seat | null => (m.seat0 === userId ? 0 : m.seat1 === userId ? 1 : null);

// Lets the bot (if it is the one to move) keep acting until a human has to answer.
const runBot = (m: MatchRow, state: GameState, n: number): { state: GameState; n: number; steps: StepRow[] } => {
  const steps: StepRow[] = [];
  if (m.bot_seat === null) return { state, n, steps };
  const bot = m.bot_seat;
  const rng = { rng: seedFrom(m.seed * 31 + n) };
  const rand = () => nextRandom(rng);
  for (let i = 0; i < BOT_STEP_LIMIT && state.winner === null; i++) {
    const mover = state.pending ? state.pending.seat : state.turn.active;
    if (mover !== bot) break;
    const action = aiNextAction(state, bot, rand);
    const r = applyAction(state, bot, action);
    if (r.ok === false) break; // a bot move the rules refuse would be a bug: stop instead of looping
    state = r.state;
    steps.push({ n: ++n, seat: bot, action });
  }
  return { state, n, steps };
};

const initOf = async (db: Db, m: MatchRow, userId: string, cfg: GameConfig): Promise<MatchInit> => {
  const seat = playerOf(m, userId) as Seat;
  const steps = await db.steps(m.id, 0);
  const oppId = seat === 0 ? m.seat1 : m.seat0;
  const prof = oppId ? await db.profile(oppId) : null;
  return {
    id: m.id, seat, seed: m.seed, first: m.first, decks: m.decks,
    opponent: oppId ? { name: prof?.username ?? 'Jogador', avatarId: prof?.avatar_id ?? 'batedora', bot: false } : { name: BOT_PROFILE.name, avatarId: BOT_PROFILE.avatarId, bot: true },
    steps, status: m.status, winner: m.winner,
    // Already under way: this player acted before, or the match is old.
    resumed: steps.some(st => st.seat === seat && st.action.type !== 'begin') || cfg.now() - Date.parse(m.created_at) > 60000,
  };
};

const startMatch = async (db: Db, cfg: GameConfig, a: { user: string | null; deck: DeckJson }, b: { user: string | null; deck: DeckJson }): Promise<MatchRow> => {
  const seed = Math.floor(cfg.random() * 0x7fffffff) + 1;
  const first = (cfg.random() < 0.5 ? 0 : 1) as Seat;
  // Seat order is random too, so being the first to queue is no advantage.
  const swap = cfg.random() < 0.5;
  const [p0, p1] = swap ? [b, a] : [a, b];
  const bot_seat: Seat | null = p0.user === null ? 0 : p1.user === null ? 1 : null;
  const decks: [DeckJson, DeckJson] = [p0.deck, p1.deck];
  const created = createMatch({ seed, decks, first });
  const begun = applyAction(created.state, first, { type: 'begin' });
  if (begun.ok === false) throw new Error(begun.error);
  const draft = { seed, status: 'active' as const, first, seat0: p0.user, seat1: p1.user, bot_seat, decks, state: begun.state, steps_count: 1, winner: null };
  const steps: StepRow[] = [{ n: 1, seat: first, action: { type: 'begin' } }];
  const bot = runBot({ ...draft, id: '', created_at: '' }, begun.state, 1);
  steps.push(...bot.steps);
  return db.createMatch({ ...draft, state: bot.state, steps_count: bot.n, status: bot.state.winner !== null ? 'finished' : 'active', winner: bot.state.winner }, steps);
};

const finishIfStale = async (db: Db, cfg: GameConfig, m: MatchRow | null): Promise<MatchRow | null> => {
  if (!m) return null;
  if (cfg.now() - Date.parse(m.created_at) > STALE_MATCH_MS) {
    await db.saveMatch(m.id, m.steps_count, { state: m.state, steps_count: m.steps_count, status: 'finished', winner: m.winner }, []);
    return null;
  }
  return m;
};

export const handleGame = async (db: Db, userId: string, req: GameRequest, cfg: GameConfig = defaultConfig()): Promise<GameResponse> => {
  switch (req.op) {
    case 'queue': {
      if (!req.cards || typeof req.cards !== 'object' || typeof req.general !== 'string') return { ok: false, error: 'Deck inválido.' };
      const resume = await finishIfStale(db, cfg, await db.activeMatchOf(userId));
      if (resume) return { ok: true, status: 'matched', match: await initOf(db, resume, userId, cfg) };
      const collection = await db.collection(userId);
      const problem = deckProblem(req.cards, req.general, collection);
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
      if (active) return { ok: true, status: 'matched', match: await initOf(db, active, userId, cfg) };
      const q = await db.queueGet(userId);
      if (!q) return { ok: true, status: 'none' };
      if (cfg.now() - Date.parse(q.created_at) >= cfg.botAfterMs) {
        // Nobody showed up: the bot takes the other chair (same rules, same record, same rewards later).
        await db.queueDelete(userId);
        const m = await startMatch(db, cfg, { user: userId, deck: q.deck }, { user: null, deck: botDeckFor(q.deck) });
        return { ok: true, status: 'matched', match: await initOf(db, m, userId, cfg) };
      }
      return { ok: true, status: 'waiting' };
    }
    case 'cancel': {
      await db.queueDelete(userId);
      // Backing out right as a match was being made for you: it counts as walking away, so you are not
      // dropped back into a match you never saw (the other player, if any, wins).
      const m = await db.activeMatchOf(userId);
      const seat = m ? playerOf(m, userId) : null;
      if (m && seat !== null && cfg.now() - Date.parse(m.created_at) < 60000) {
        const steps = await db.steps(m.id, 0);
        if (!steps.some(st => st.seat === seat && st.action.type !== 'begin')) {
          const r = applyAction(m.state, seat, { type: 'concede' });
          if (r.ok === true) await db.saveMatch(m.id, m.steps_count, { state: r.state, steps_count: m.steps_count + 1, status: 'finished', winner: r.state.winner }, [{ n: m.steps_count + 1, seat, action: { type: 'concede' } }]);
        }
      }
      return { ok: true, status: 'none' };
    }
    case 'steps': {
      const m = await db.getMatch(req.matchId);
      if (!m || playerOf(m, userId) === null) return { ok: false, error: 'Partida não encontrada.' };
      return { ok: true, status: 'acted', steps: await db.steps(m.id, req.since ?? 0), finished: m.status === 'finished', winner: m.winner };
    }
    case 'act': {
      if (!req.action || typeof req.action.type !== 'string' || req.action.type === 'begin') return { ok: false, error: 'Ação inválida.' };
      for (let attempt = 0; attempt < 3; attempt++) {
        const m = await db.getMatch(req.matchId);
        if (!m) return { ok: false, error: 'Partida não encontrada.' };
        const seat = playerOf(m, userId);
        if (seat === null) return { ok: false, error: 'Você não está nessa partida.' };
        if (m.status !== 'active') return { ok: false, error: 'A partida já terminou.' };
        const r = applyAction(m.state, seat, req.action);
        if (r.ok === false) return { ok: false, error: r.error };
        let n = m.steps_count;
        const steps: StepRow[] = [{ n: ++n, seat, action: req.action }];
        const bot = runBot(m, r.state, n);
        steps.push(...bot.steps);
        const saved = await db.saveMatch(m.id, m.steps_count, {
          state: bot.state, steps_count: bot.n, status: bot.state.winner !== null ? 'finished' : 'active', winner: bot.state.winner,
        }, steps);
        if (!saved) continue; // somebody else moved first: look again
        return { ok: true, status: 'acted', steps: await db.steps(m.id, req.since ?? 0), finished: bot.state.winner !== null, winner: bot.state.winner };
      }
      return { ok: false, error: 'A partida mudou enquanto você jogava. Tente de novo.' };
    }
    default:
      return { ok: false, error: 'Pedido desconhecido.' };
  }
};

