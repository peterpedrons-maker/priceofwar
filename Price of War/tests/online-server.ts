// Checks of the game server's logic (matchmaking, validation, hidden information, turn clock, rewards, bot seat)
// on an in-memory database:   npx tsx tests/online-server.ts
import { aiNextAction } from '../src/engine/ai';
import { DECK_RECIPES } from '../src/engine/catalog';
import { BOOSTER_PRICE, boosterPool, rollBooster, settleBooster } from '../src/engine/boosters';
import { maxCopiesOf } from '../src/engine/deck';
import { applyAction, createMatch } from '../src/engine/game';
import { applyReward, rewardFor } from '../src/engine/rewards';
import type { Action, Seat } from '../src/engine/types';
import { viewFor } from '../src/engine/view';
import { SEASON_ONE_START } from '../src/engine/ranked';
import { FIRST_WIN_COROAS } from '../src/engine/rewards';
import { handleGame, resetRateLimits, type GameConfig, type GameResponse, type MatchInit } from '../server/handler';
import { MemoryDb } from '../server/memoryDb';

let passed = 0, failed = 0;
const test = async (name: string, fn: () => Promise<void>) => {
  try { await fn(); passed++; } catch (e) { failed++; console.log(`  ✗ ${name}\n      ${(e as Error).message}`); }
};
const ok = (c: boolean, msg: string) => { if (!c) throw new Error(msg); };
const eq = (a: unknown, b: unknown, msg = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };

let clock = 1_700_000_000_000;
let rngState = 7;
const cfg: GameConfig = {
  queueStaleMs: 20000, turnMs: 100000, promptMs: 40000, maxTimeouts: 2, now: () => clock,
  random: () => { rngState = (rngState * 1103515245 + 12345) & 0x7fffffff; return rngState / 0x7fffffff; },
};

const fresh = () => {
  const db = new MemoryDb();
  resetRateLimits();
  db.now = () => clock;   // the same clock as the server's, so "seen" times and days line up
  const addUser = (id: string, name: string, deck: 'cardeal' | 'capitao' = 'cardeal') => {
    db.tables.profiles.push({ id, username: name, avatar_id: 'batedora' });
    Object.entries(DECK_RECIPES[deck].cards).forEach(([card, copies]) => db.tables.collection.push({ user_id: id, card_name: card, copies }));
    db.tables.collection.push({ user_id: id, card_name: DECK_RECIPES[deck].general, copies: 1 });
  };
  addUser('A', 'Alice'); addUser('B', 'Bruno', 'capitao');
  return db;
};
// The prebuilt Capitão list has 62 cards; a player's deck is at most 60, so trim two copies off.
const deckOf = (d: 'cardeal' | 'capitao') => {
  const cards = { ...DECK_RECIPES[d].cards };
  let extra = Object.values(cards).reduce((a, n) => a + n, 0) - 60;
  for (const name of Object.keys(cards)) { while (extra > 0 && cards[name] > 1) { cards[name]--; extra--; } }
  return { cards, general: DECK_RECIPES[d].general };
};
const matched = (r: GameResponse): MatchInit => { if (r.ok !== true || r.status !== 'matched') throw new Error('not matched: ' + JSON.stringify(r)); return r.match; };

const userOf = (db: MemoryDb, seat: Seat) => (seat === 0 ? db.matches[0].seat0 : db.matches[0].seat1)!;
// The toss winner's choice, sent like a client would. `m.first` is the winner's chair.
const choose = async (db: MemoryDb, goFirst: boolean) => handleGame(db, userOf(db, db.matches[0].first), { op: 'act', matchId: db.matches[0].id, action: { type: 'choose_first', goFirst } }, cfg);
// A match against the bot, opened: when a person won the toss they go first (a bot that won already chose).
const botMatch = async (db: MemoryDb) => {
  const init = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true }, cfg));
  if (db.matches[0].steps_count === 0) { const r = await choose(db, true); ok(r.ok === true, 'choice accepted: ' + JSON.stringify(r)); }
  return init;
};
// A match between two people. By default the toss winner chooses to go first, so it is ready to play;
// `choice: null` leaves it waiting for the choice.
const pvp = async (db: MemoryDb, choice: boolean | null = true) => {
  await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
  const b = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
  const a = matched(await handleGame(db, 'A', { op: 'status' }, cfg));
  if (choice !== null) { const r = await choose(db, choice); ok(r.ok === true, 'choice accepted: ' + JSON.stringify(r)); }
  return { a, b, id: a.id };
};
// Plays the match with the AI choosing for whoever has to move, through the server, until `stop` says so.
const drive = async (db: MemoryDb, id: string, stop: (m: ReturnType<MemoryDb['matches']['at']> & object) => boolean, limit = 800) => {
  for (let i = 0; i < limit; i++) {
    const m = db.matches[0];
    if (m.status === 'finished' || stop(m)) return;
    const mover = (m.state.pending ? m.state.pending.seat : m.state.turn.active) as Seat;
    if (mover === m.bot_seat) throw new Error('the server left the bot with a move to make');
    const r = await handleGame(db, userOf(db, mover), { op: 'act', matchId: id, action: aiNextAction(m.state, mover, () => 0.43) }, cfg);
    if (r.ok === false) throw new Error('server rejected a legal action: ' + r.error);
  }
};

(async () => {
  await test('deck rules are enforced on the server (size, copies, ownership)', async () => {
    const db = fresh();
    const small = await handleGame(db, 'A', { op: 'queue', cards: { 'Sentinela do Claustro': 2 }, general: DECK_RECIPES.cardeal.general }, cfg);
    ok(small.ok === false && /Faltam/.test(small.error), 'too small: ' + JSON.stringify(small));
    const notMine = await handleGame(db, 'A', { op: 'queue', ...deckOf('capitao') }, cfg);
    ok(notMine.ok === false && /não tem/.test(notMine.error), 'not owned: ' + JSON.stringify(notMine));
    const cheat = await handleGame(db, 'A', { op: 'queue', cards: { ...deckOf('cardeal').cards, 'Paladino do Alvorecer': 9 }, general: DECK_RECIPES.cardeal.general }, cfg);
    ok(cheat.ok === false, 'too many copies');
  });

  await test('GM: só a conta do dono (e-mail confirmado ou id) vê o painel; "online" vem do ping', async () => {
    const db = fresh();
    const owner = { email: 'Dono@Exemplo.com', verified: true, admins: ['dono@exemplo.com'], adminIds: [] as string[] };
    const nope = await handleGame(db, 'A', { op: 'admin' }, cfg, { email: 'alice@x.com', verified: true, admins: ['dono@exemplo.com'] });
    ok(nope.ok === false, 'um jogador comum não entra no painel');
    const unverified = await handleGame(db, 'A', { op: 'admin' }, cfg, { ...owner, verified: false });
    ok(unverified.ok === false, 'e-mail não confirmado não vale');
    const noList = await handleGame(db, 'A', { op: 'admin' }, cfg, { email: 'dono@exemplo.com', verified: true, admins: [] });
    ok(noList.ok === false, 'sem a lista de admins ninguém entra');
    await handleGame(db, 'A', { op: 'ping' }, cfg); await handleGame(db, 'B', { op: 'ping' }, cfg);
    Object.assign(db.tables.profiles.find(p => p.id === 'A')!, { coroas: 500, xp: 120, level: 3 });
    const r = await handleGame(db, 'A', { op: 'admin' }, cfg, owner);
    ok(r.ok === true && r.status === 'admin', 'o dono entra');
    if (r.ok === true && r.status === 'admin') { eq([r.admin.accounts, r.admin.online, r.admin.me.email], [2, 2, 'Dono@Exemplo.com'], 'contas, online e quem está logado'); ok(Array.isArray(r.admin.top), 'topo do ranking');
      const a = r.admin.players.find(p => p.id === 'A'), b = r.admin.players.find(p => p.id === 'B');
      ok(!!a && !!b && a.online && b.online, 'a lista de jogadores marca quem está online pelo ping');
      eq([a!.coroas, a!.level, a!.xp], [500, 3, 120], 'coroas, nível e XP de cada conta');
      ok(a!.cards > 0 && r.admin.totals.cards >= a!.cards && r.admin.totals.coroas >= 500, 'cartas e totais somados');
      eq([r.admin.windows.h1, r.admin.windows.h24, r.admin.windows.d30], [2, 2, 2], 'vistos na última hora, em 24 h e em 30 dias');
      const today = r.admin.daily[r.admin.daily.length - 1];
      eq([r.admin.daily.length, today.active], [14, 2], '14 dias de histórico, 2 jogadores ativos hoje'); }
    const byId = await handleGame(db, 'A', { op: 'admin' }, cfg, { adminIds: ['a'] });
    ok(byId.ok === false, 'id diferente não entra'); const byId2 = await handleGame(db, 'A', { op: 'admin' }, cfg, { adminIds: ['A'.toLowerCase()] });
    ok(byId2.ok === false, 'o id precisa ser igual ao do login (A ≠ a aqui)');
    const byId3 = await handleGame(db, 'A', { op: 'admin' }, cfg, { adminIds: ['A'] }); ok(byId3.ok === true, 'o id da lista vale');
  });
  await test('denúncia e banimento: só denuncia o adversário de uma partida sua; o GM bane e desbane; banido não joga', async () => {
    const db = fresh(); const { id } = await pvp(db);
    db.tables.profiles.push({ id: 'OWNER', username: 'Dono', avatar_id: 'batedora' });
    const owner = { email: 'dono@exemplo.com', verified: true, admins: ['dono@exemplo.com'] };
    const bad = await handleGame(db, 'A', { op: 'report', matchId: id, reason: 'xingar' }, cfg);
    ok(bad.ok === false, 'motivo desconhecido é recusado');
    const stranger = await handleGame(db, 'C', { op: 'report', matchId: id, reason: 'nome' }, cfg);
    ok(stranger.ok === false, 'quem não estava na partida não denuncia');
    const r1 = await handleGame(db, 'A', { op: 'report', matchId: id, reason: 'nome', note: 'nome ofensivo' }, cfg);
    ok(r1.ok === true && r1.status === 'reported', 'denúncia aceita');
    const r2 = await handleGame(db, 'A', { op: 'report', matchId: id, reason: 'comportamento' }, cfg);
    ok(r2.ok === true, 'a segunda denúncia da mesma partida é aceita sem duplicar');
    eq(db.reports.length, 1, 'uma denúncia só por jogador e partida');
    eq([db.reports[0].reporter, db.reports[0].reported], ['A', 'B'], 'o denunciado é o adversário, escolhido pelo servidor');
    const bot = await handleGame(db, 'A', { op: 'ban' as any, target: 'B' } as any, cfg, owner);
    ok(bot.ok === false, 'op desconhecida');
    const notGm = await handleGame(db, 'A', { op: 'adminBan', target: 'B' }, cfg, { email: 'alice@x.com', verified: true, admins: ['dono@exemplo.com'] });
    ok(notGm.ok === false, 'jogador comum não bane');
    const self = await handleGame(db, 'OWNER', { op: 'adminBan', target: 'OWNER' }, cfg, { ...owner, adminIds: ['OWNER'] });
    ok(self.ok === false, 'o GM não bane a si mesmo');
    const ban = await handleGame(db, 'OWNER', { op: 'adminBan', target: 'B', reason: 'nome ofensivo' }, cfg, owner);
    ok(ban.ok === true, 'o GM bane');
    const refused = await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg);
    ok(refused.ok === false && refused.error === 'banned', 'banido não entra na fila: ' + JSON.stringify(refused));
    const ping = await handleGame(db, 'B', { op: 'ping' }, cfg); ok(ping.ok === true, 'o ping continua (o painel mostra que a conta existe)');
    const panel = await handleGame(db, 'OWNER', { op: 'admin' }, cfg, owner);
    ok(panel.ok === true && panel.status === 'admin' && panel.admin.reports.length === 1 && panel.admin.reports[0].reported.banned && panel.admin.bans.length === 1, 'o painel mostra a denúncia e o banido');
    if (panel.ok === true && panel.status === 'admin') eq([panel.admin.reports[0].reported.name, panel.admin.reports[0].reporter.name, panel.admin.reports[0].reason], ['Bruno', 'Alice', 'nome'], 'nomes e motivo');
    await handleGame(db, 'OWNER', { op: 'adminUnban', target: 'B' }, cfg, owner);
    const back = await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg); ok(back.ok === true, 'desbanido volta a jogar');
  });
  await test('limite de pedidos por conta: um script martelando é barrado; uma pessoa nunca chega perto; a janela anda', async () => {
    const db = fresh();
    let blocked = 0; for (let i = 0; i < 30; i++) { const r = await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg); if (r.ok === false && /Muitos pedidos/.test(r.error)) blocked++; }
    ok(blocked >= 8, 'fila: acima de 20 pedidos em 30 s é barrado (barrou ' + blocked + ')');
    const other = await handleGame(db, 'B', { op: 'ping' }, cfg); ok(other.ok === true, 'o limite é por conta: outra conta não é afetada');
    clock += 31000;
    const again = await handleGame(db, 'A', { op: 'status' }, cfg); ok(again.ok === true || !/Muitos pedidos/.test((again as any).error ?? ''), 'passada a janela, volta a responder');
    let reps = 0; const { id } = await pvp(fresh());
    for (let i = 0; i < 12; i++) { const r = await handleGame(db, 'A', { op: 'report', matchId: 'x'.repeat(8), reason: 'nome' }, cfg); if (r.ok === false && /Muitos pedidos/.test(r.error)) reps++; }
    ok(reps >= 4, 'denúncias: no máximo 8 por hora (barrou ' + reps + ')'); void id;
  });
  await test('desafio por link: o anfitrião cria a sala, o amigo entra com o código e a partida é privada (sem ranking); o convite vale uma vez', async () => {
    const db = fresh();
    const bad = await handleGame(db, 'A', { op: 'friendCreate', cards: { 'Sentinela do Claustro': 2 }, general: DECK_RECIPES.cardeal.general }, cfg);
    ok(bad.ok === false, 'deck inválido não cria sala');
    const room = await handleGame(db, 'A', { op: 'friendCreate', ...deckOf('cardeal') }, cfg);
    ok(room.ok === true && room.status === 'room' && /^[A-Z2-9]{6}$/.test(room.code), 'sala criada com código legível: ' + JSON.stringify(room));
    const code = (room as any).code as string;
    const still = await handleGame(db, 'A', { op: 'friendStatus' }, cfg); ok(still.ok === true && still.status === 'room', 'o anfitrião vê a sala esperando');
    const peek = await handleGame(db, 'B', { op: 'friendPeek', code: code.toLowerCase() }, cfg);
    ok(peek.ok === true && peek.status === 'peek' && peek.host === 'Alice', 'o convidado vê quem convidou (código sem diferença de maiúscula)');
    const own = await handleGame(db, 'A', { op: 'friendJoin', code, ...deckOf('cardeal') }, cfg); ok(own.ok === false, 'ninguém entra no próprio convite');
    const wrong = await handleGame(db, 'B', { op: 'friendJoin', code: 'ZZZZZZ', ...deckOf('capitao') }, cfg); ok(wrong.ok === false, 'código que não existe');
    const notOwned = await handleGame(db, 'B', { op: 'friendJoin', code, ...deckOf('cardeal') }, cfg); ok(notOwned.ok === false, 'o deck do convidado também é conferido com a coleção dele');
    const joined = await handleGame(db, 'B', { op: 'friendJoin', code, ...deckOf('capitao') }, cfg);
    ok(joined.ok === true && joined.status === 'matched', 'o amigo entra: ' + JSON.stringify(joined).slice(0, 120));
    eq([db.matches.length, db.matches[0].ranked, db.matches[0].bot_seat], [1, false, null], 'uma partida entre duas pessoas, sem ranking');
    const host = await handleGame(db, 'A', { op: 'friendStatus' }, cfg); ok(host.ok === true && host.status === 'matched', 'o anfitrião recebe a partida pelo mesmo pedido de espera');
    const again = await handleGame(db, 'C', { op: 'friendJoin', code, ...deckOf('capitao') }, cfg); ok(again.ok === false, 'o convite vale uma vez só');
    // cancelar e expirar
    const db2 = fresh(); const r2 = await handleGame(db2, 'A', { op: 'friendCreate', ...deckOf('cardeal') }, cfg); const c2 = (r2 as any).code as string;
    await handleGame(db2, 'A', { op: 'friendCancel' }, cfg);
    const gone = await handleGame(db2, 'B', { op: 'friendPeek', code: c2 }, cfg); ok(gone.ok === false, 'cancelar apaga o convite');
    const r3 = await handleGame(db2, 'A', { op: 'friendCreate', ...deckOf('cardeal') }, cfg); const c3 = (r3 as any).code as string;
    clock += 16 * 60 * 1000;
    const late = await handleGame(db2, 'B', { op: 'friendJoin', code: c3, ...deckOf('capitao') }, cfg); ok(late.ok === false, 'passados 15 minutos o convite expira');
    const expired = await handleGame(db2, 'A', { op: 'friendStatus' }, cfg); ok(expired.ok === true && expired.status === 'none', 'o anfitrião vê que expirou');
    const badCode = await handleGame(db2, 'B', { op: 'friendPeek', code: '<script>' }, cfg); ok(badCode.ok === false, 'código com símbolos é recusado');
  });
  await test('reportar problema: texto curto, tipo válido, só guarda partida que é do jogador, limite por hora; só o GM lê e resolve', async () => {
    const db = fresh(); const { id } = await pvp(db);
    db.tables.profiles.push({ id: 'OWNER', username: 'Dono', avatar_id: 'batedora' });
    const owner = { email: 'dono@exemplo.com', verified: true, admins: ['dono@exemplo.com'] };
    ok((await handleGame(db, 'A', { op: 'feedback', kind: 'xingar', text: 'algo errado aqui' }, cfg)).ok === false, 'tipo desconhecido');
    ok((await handleGame(db, 'A', { op: 'feedback', kind: 'bug', text: 'ab' }, cfg)).ok === false, 'texto curto demais');
    const r1 = await handleGame(db, 'A', { op: 'feedback', kind: 'bug', text: 'A carta sumiu da mão depois de jogar', matchId: id, ctx: 'build=x; tela=partida' }, cfg);
    ok(r1.ok === true && r1.status === 'feedback', 'aviso aceito');
    await handleGame(db, 'C', { op: 'feedback', kind: 'ideia', text: 'Queria um modo treino', matchId: id }, cfg);
    eq([db.feedbackRows.length, db.feedbackRows[0].match_id, db.feedbackRows[1].match_id], [2, id, null], 'a partida só fica no aviso de quem estava nela');
    ok((await handleGame(db, 'A', { op: 'adminFeedbackDone', id: 1 }, cfg, { email: 'alice@x.com', verified: true, admins: ['dono@exemplo.com'] })).ok === false, 'jogador comum não resolve');
    const panel = await handleGame(db, 'OWNER', { op: 'admin' }, cfg, owner);
    ok(panel.ok === true && panel.status === 'admin' && panel.admin.feedback.length === 2, 'o painel lista os avisos');
    if (panel.ok === true && panel.status === 'admin') { const fa = panel.admin.feedback.find(x => x.user.id === 'A')!; eq([fa.user.name, fa.kind, fa.matchId], ['Alice', 'bug', id], 'quem mandou, tipo e partida'); }
    await handleGame(db, 'OWNER', { op: 'adminFeedbackDone', id: 1 }, cfg, owner);
    const after = await handleGame(db, 'OWNER', { op: 'admin' }, cfg, owner); ok(after.ok === true && after.status === 'admin' && after.admin.feedback.length === 1, 'resolvido sai da lista');
    let blocked = 0; for (let i = 0; i < 9; i++) { const r = await handleGame(db, 'A', { op: 'feedback', kind: 'outro', text: 'mais um aviso de teste ' + i }, cfg); if (r.ok === false) blocked++; }
    ok(blocked >= 3, 'no máximo 6 avisos por hora (barrou ' + blocked + ')');
  });
  await test('versões (raridades): o adversário recebe só as versões que a conta tem, com o total de cópias da carta', async () => {
    const db = fresh();
    const d = deckOf('cardeal'), [card] = Object.keys(d.cards), copies = d.cards[card];
    db.tables.collection.push({ user_id: 'A', card_name: `${card}#rara`, copies: 1 });   // A owns ONE rare of it
    await handleGame(db, 'A', { op: 'queue', ...d, rar: { [card]: { rara: 3, ultra: 2 }, 'Carta Que Não Existe': { rara: 1 } } }, cfg);
    const b = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
    const a = matched(await handleGame(db, 'A', { op: 'status' }, cfg));
    eq(b.opponentRar, { [card]: { rara: 1, n: copies } }, 'only the rare A owns, capped; no ultra (not owned); nothing for cards outside the deck');
    ok(a.opponentRar === undefined, 'B sent no versions');
    const bad = await handleGame(db, 'A', { op: 'queue', ...d, rar: 'x' as any }, cfg);
    ok(bad.ok === false, 'a malformed rar is refused');
  });
  await test('queue: two players are matched; each gets only their own view (no seed, no opponent deck or hand)', async () => {
    const db = fresh();
    const { a, b } = await pvp(db, null);
    eq(a.id, b.id);
    ok(a.iWonToss !== b.iWonToss, 'exactly one wins the toss');
    eq([a.chosen, b.chosen, a.rows.length, b.rows.length], [false, false, 0, 0], 'nothing happens until the winner chooses');
    ok(db.matches[0].turn_deadline !== null && db.matches[0].turn_deadline! > clock, 'the choice has a clock');
    ok(a.mySide !== b.mySide && [a.mySide, b.mySide].includes('cara') && [a.mySide, b.mySide].includes('coroa'), 'one is Cara, the other Coroa');
    eq([a.opponent.name, b.opponent.name], ['Bruno', 'Alice']);
    eq(a.myDeck.general, DECK_RECIPES.cardeal.general);
    eq(a.opponentGeneral, DECK_RECIPES.capitao.general);
    for (const init of [a, b]) {
      ok(!('seed' in init) && !('decks' in init), 'no seed / decks in what a player receives');
      ok(init.start.players[1].hand.every(c => c.hidden) && init.start.players[0].hand.every(c => !c.hidden), 'start view: own hand shown, opponent hand hidden');
      eq(init.start.players[0].hand.length, 7);
    }
    eq(db.queue.length, 0);
    // the winner chooses to go first: choose_first then begin, both by the winner
    const winner = a.iWonToss ? 'A' : 'B';
    const r = await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'choose_first', goFirst: true } }, cfg);
    ok(r.ok === true && r.status === 'acted', 'choice accepted');
    for (const user of ['A', 'B']) {
      const rows = await db.views(a.id, user === 'A' ? (db.matches[0].seat0 === 'A' ? 0 : 1) : (db.matches[0].seat0 === 'B' ? 0 : 1), 0);
      eq(rows.map(x => x.action.type), ['choose_first', 'begin']);
      eq(rows.map(x => x.actor === 0), user === winner ? [true, true] : [false, false]);
      ok(rows[1].deadline !== null, 'the turn clock started');
    }
  });

  await test('the toss winner chooses to go second: the other player opens the match; only the winner may choose, once', async () => {
    const db = fresh();
    const { a, b } = await pvp(db, null);
    const loser = a.iWonToss ? 'B' : 'A';
    const winner = a.iWonToss ? 'A' : 'B';
    const m = db.matches[0];
    const no = await handleGame(db, loser, { op: 'act', matchId: a.id, action: { type: 'choose_first', goFirst: true } }, cfg);
    ok(no.ok === false && /moeda/.test(no.error), 'the loser cannot choose: ' + JSON.stringify(no));
    const early = await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'advance' } }, cfg);
    ok(early.ok === false, 'nothing else before the choice');
    eq(db.matches[0].steps_count, 0, 'refusals record nothing');
    const r = await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'choose_first', goFirst: false } }, cfg);
    ok(r.ok === true, 'accepted');
    const after = db.matches[0];
    ok(after.state.turn.started && after.state.turn.first === (m.first === 0 ? 1 : 0) && after.state.turn.active === after.state.turn.first, 'the other chair goes first');
    eq(after.first, m.first, 'the stored toss winner does not change');
    const again = await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'choose_first', goFirst: true } }, cfg);
    ok(again.ok === false, 'no second choice: ' + JSON.stringify(again));
    // the first player can play; the winner (second) cannot yet
    const firstUser = after.state.turn.first === 0 ? after.seat0! : after.seat1!;
    ok((await handleGame(db, winner, { op: 'act', matchId: a.id, action: { type: 'advance' } }, cfg)).ok === false, 'not the winner\'s turn');
    ok((await handleGame(db, firstUser, { op: 'act', matchId: a.id, action: { type: 'advance' } }, cfg)).ok === true, 'the first player acts');
    // a player's own init after the choice
    const initWinner = matched(await handleGame(db, winner, { op: 'queue', ...deckOf('cardeal') }, cfg));
    eq([initWinner.iWonToss, initWinner.iGoFirst, initWinner.chosen], [true, false, true]);
    void b;
  });

  await test('the toss winner lets the clock run out: the match opens with them going first, no forfeit', async () => {
    const db = fresh();
    const { id, a } = await pvp(db, null);
    const winner = a.iWonToss ? 'A' : 'B';
    const loser = a.iWonToss ? 'B' : 'A';
    clock += 41000;
    const t = await handleGame(db, loser, { op: 'tick', matchId: id, since: 0 }, cfg);
    ok(t.ok === true && t.status === 'acted', 'tick ok');
    const m = db.matches[0];
    ok(m.status === 'active' && m.state.turn.started && m.state.turn.first === m.first, 'opened with the winner first');
    eq(m.timeouts[m.first], 1);
    ok(m.turn_deadline! > clock, 'fresh turn clock');
    eq((await db.steps(id, 0)).map(x => x.action.type), ['choose_first', 'begin']);
    void winner;
  });

  await test('a challenge can name the opponent deck (Desafios map); a bad name falls back', async () => {
    for (const id of ['capitao', 'cardeal', 'mercenarios'] as const) {
      const db = fresh();
      const init = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true, botDeck: id }, cfg));
      eq(init.opponentGeneral, DECK_RECIPES[id].general, 'opponent ' + id);
    }
    const db = fresh();
    const init = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true, botDeck: 'toString' }, cfg));
    ok(init.opponentGeneral === DECK_RECIPES.capitao.general, 'unknown name: the usual pick');
  });

  await test('a bot that wins the toss chooses at random and the match opens at once', async () => {
    const seen = new Set<boolean>();
    let botWon = 0;
    for (let i = 0; i < 40; i++) {
      const db = fresh();
      const init = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), vsBot: true }, cfg));
      const m = db.matches[0];
      if (m.first === m.bot_seat) {
        botWon++;
        ok(init.chosen && m.state.turn.started, 'opened by the bot');
        seen.add(m.state.turn.first === m.bot_seat);
      } else {
        ok(!init.chosen && m.steps_count === 0 && init.rows.length === 0, 'waits for the human');
        ok(init.iWonToss, 'the human won the toss');
      }
    }
    ok(botWon > 5 && botWon < 35, 'the bot wins about half the tosses: ' + botWon);
    ok(seen.size === 2, 'sometimes it goes first, sometimes second');
  });

  await test('a whole match through the server: every view hides the other hand; steps replay to the stored state', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    await drive(db, id, () => false);
    const m = db.matches[0];
    ok(m.status === 'finished' && m.winner !== null && m.steps_count > 30, 'played to the end: ' + m.steps_count);
    // replay exactly what the record says
    let s = createMatch({ seed: m.seed, decks: m.decks, first: m.first }).state;
    for (const st of await db.steps(m.id, 0)) { const r = applyAction(s, st.seat, st.action); if (r.ok === false) throw new Error('replay refused step ' + st.n + ': ' + r.error); s = r.state; }
    eq(JSON.stringify(s), JSON.stringify(m.state), 'replayed state');
    for (const viewer of [0, 1] as Seat[]) {
      const rows = await db.views(m.id, viewer, 0);
      eq(rows.length, m.steps_count, 'a view for every step');
      ok(rows.every((r, i) => r.n === i + 1), 'numbered in order');
      ok(rows.every(r => r.state.players[1].hand.every(c => c.hidden && c.name === '') && r.state.players[1].drawPile.every(x => x === '') && r.state.players[0].drawPile.every(x => x === '')), `viewer ${viewer}: no hidden card or deck order in any state`);
      ok(rows.every(r => r.events.every(e => !(e.t === 'draw' && e.seat === 1) || (e as any).card.hidden)), `viewer ${viewer}: opponent draws hidden`);
      eq(JSON.stringify(rows[rows.length - 1].state), JSON.stringify(viewFor(m.state, viewer)), 'last view = the final state as that player sees it');
    }
  });

  await test('the server refuses cheats: out of turn, a stranger, begin, made-up cards, after the end', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    const m = db.matches[0];
    const idle = (m.state.turn.active === 0 ? m.seat1 : m.seat0)!;
    const active = (m.state.turn.active === 0 ? m.seat0 : m.seat1)!;
    const r1 = await handleGame(db, idle, { op: 'act', matchId: id, action: { type: 'advance' } }, cfg);
    ok(r1.ok === false && /turno/.test(r1.error), 'out of turn: ' + JSON.stringify(r1));
    ok((await handleGame(db, 'Z', { op: 'act', matchId: id, action: { type: 'advance' } }, cfg)).ok === false, 'stranger');
    ok((await handleGame(db, active, { op: 'act', matchId: id, action: { type: 'begin' } }, cfg)).ok === false, 'client cannot send begin');
    ok((await handleGame(db, active, { op: 'act', matchId: id, action: { type: 'play', cardId: 'made-up', slot: 1 } }, cfg)).ok === false, 'made-up card');
    eq(db.matches[0].steps_count, 2, 'nothing recorded for refused actions (only choose_first and begin)');
    const r5 = await handleGame(db, active, { op: 'act', matchId: id, action: { type: 'concede' } }, cfg);
    ok(r5.ok === true && r5.status === 'acted' && r5.finished, 'concede ends the match');
    const r6 = await handleGame(db, active, { op: 'act', matchId: id, action: { type: 'advance' } }, cfg);
    ok(r6.ok === false && /terminou/.test(r6.error), 'after the end');
  });

  await test('vs bot: the bot seat plays through the same server; the human always has the move', async () => {
    const db = fresh();
    const init = await botMatch(db);
    eq(init.opponent.bot, true);
    const m0 = db.matches[0];
    eq(m0.bot_seat === 0 ? m0.seat0 : m0.seat1, null);
    let human = 0;
    for (let i = 0; i < 300 && db.matches[0].status === 'active' && human < 30; i++) {
      const m = db.matches[0];
      const mover = (m.state.pending ? m.state.pending.seat : m.state.turn.active) as Seat;
      ok(mover !== m.bot_seat, 'server left the bot with a move to make');
      const r = await handleGame(db, 'A', { op: 'act', matchId: init.id, action: aiNextAction(m.state, mover, () => 0.43) }, cfg);
      ok(r.ok === true, 'human action refused: ' + JSON.stringify(r));
      if (r.ok === true && r.status === 'acted') ok(r.rows.every(x => x.viewer === (m.seat0 === 'A' ? 0 : 1)), 'only my own views come back');
      human++;
    }
    const steps = await db.steps(init.id, 0);
    ok(steps.some(s => s.seat === db.matches[0].bot_seat), 'bot steps were recorded');
    ok(steps.every((s, i) => s.n === i + 1), 'steps are numbered 1..n');
  });

  await test('nobody to play with: the player keeps waiting, no bot takes the other chair', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    for (let i = 0; i < 12; i++) { clock += 5000; eq(((await handleGame(db, 'A', { op: 'status' }, cfg)) as any).status, 'waiting'); }
    eq(db.queue.length, 1);
    eq(db.matches.length, 0);
  });

  await test('a player who left (no status polls) is skipped; a polling player is still matched', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    clock += 25000;                                        // A closed the app long ago
    const r = await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg);
    ok(r.ok === true && r.status === 'waiting', 'B must wait instead of facing a ghost: ' + JSON.stringify(r));
    clock += 8000; await handleGame(db, 'B', { op: 'status' }, cfg);   // B polls, so B stays fresh
    clock += 8000;
    const c = await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);   // A is back
    ok(c.ok === true && c.status === 'matched', 'A meets the still-polling B: ' + JSON.stringify(c));
    eq(db.queue.length, 0);
  });

  await test('cancel leaves the queue; queueing again during a match resumes it (with the latest view only)', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    await handleGame(db, 'A', { op: 'cancel' }, cfg);
    eq(db.queue.length, 0);
    const first = await botMatch(db);
    // act a bit so the match is under way
    const m = db.matches[0];
    const mover = (m.state.pending ? m.state.pending.seat : m.state.turn.active) as Seat;
    await handleGame(db, 'A', { op: 'act', matchId: first.id, action: aiNextAction(m.state, mover, () => 0.4) }, cfg);
    const again = matched(await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg));
    eq(again.id, first.id);
    eq([again.resumed, again.rows.length, again.latest !== null], [true, 0, true]);
    eq(db.matches.length, 1);
  });

  await test('backing out just as a match was made ends it instead of leaving it waiting', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    const mb = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg));
    await handleGame(db, 'A', { op: 'cancel' }, cfg);
    eq(db.matches[0].status, 'finished');
    eq(db.matches[0].winner, db.matches[0].seat0 === 'B' ? 0 : 1, 'B (still there) wins');
    void mb;
    const again = await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal') }, cfg);
    eq([again.ok && again.status], ['waiting']);
  });

  await test('two writers at once: only one wins the compare-and-swap', async () => {
    const db = fresh();
    const init = await botMatch(db);
    const m = (await db.getMatch(init.id))!;
    const patch = { state: m.state, steps_count: m.steps_count + 1, status: 'active' as const, winner: null, turn_deadline: m.turn_deadline, timeouts: m.timeouts, end_reason: null };
    const a = await db.saveMatch(m.id, m.steps_count, patch, [{ n: m.steps_count + 1, seat: 0, action: { type: 'advance' } as Action }], []);
    const b = await db.saveMatch(m.id, m.steps_count, patch, [{ n: m.steps_count + 1, seat: 1, action: { type: 'advance' } as Action }], []);
    eq([a, b], [true, false]);
  });

  await test('turn clock: the first time out passes the turn for you, the second forfeits the match', async () => {
    const db = fresh();
    const init = await botMatch(db);
    const mySeat: Seat = db.matches[0].seat0 === 'A' ? 0 : 1;
    ok(db.matches[0].turn_deadline !== null && db.matches[0].turn_deadline! > clock, 'a deadline is running');
    // it is my move (the bot has already played if it opened). let the clock run out.
    eq((db.matches[0].state.pending ? db.matches[0].state.pending.seat : db.matches[0].state.turn.active), mySeat);
    clock += 101000;
    const t1 = await handleGame(db, 'A', { op: 'tick', matchId: init.id, since: 0 }, cfg);
    ok(t1.ok === true && t1.status === 'acted', 'tick answered');
    const m1 = db.matches[0];
    eq(m1.timeouts[mySeat], 1);
    ok(m1.status === 'active', 'still playing after one timeout');
    if (t1.ok === true && t1.status === 'acted') ok(t1.rows.some(r => r.events.some(e => e.t === 'log' && /tempo acabou/i.test(e.text))), 'the player is told what happened');
    eq((m1.state.pending ? m1.state.pending.seat : m1.state.turn.active), mySeat, 'my move again (the bot played its turn)');
    ok(m1.turn_deadline! > clock, 'fresh clock');
    // a real move clears the streak
    clock += 1000;
    const mover = mySeat;
    await handleGame(db, 'A', { op: 'act', matchId: init.id, action: aiNextAction(m1.state, mover, () => 0.4) }, cfg);
    eq(db.matches[0].timeouts[mySeat], 0, 'acting resets the streak');
    // two in a row: forfeit
    clock += 101000; await handleGame(db, 'A', { op: 'tick', matchId: init.id }, cfg);
    clock += 101000; await handleGame(db, 'A', { op: 'tick', matchId: init.id }, cfg);
    const m2 = db.matches[0];
    eq([m2.status, m2.winner], ['finished', db.matches[0].bot_seat]);
    // the forfeit comes with the second timeout — unless the (stronger) bot had already felled the idle player's General by then
    ok(m2.end_reason === 'timeout' || m2.state.players[mySeat].board[12] === null, 'ended by the clock or by the General falling: ' + m2.end_reason);
  });

  await test('turn clock between two people: the waiting player\'s tick enforces it, and both are told', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    const m = db.matches[0];
    const afk = (m.state.turn.active) as Seat;
    const waiting = userOf(db, afk === 0 ? 1 : 0);
    clock += 101000;
    const t = await handleGame(db, waiting, { op: 'tick', matchId: id, since: 1 }, cfg);
    ok(t.ok === true && t.status === 'acted', 'tick ok');
    const rows = t.ok === true && t.status === 'acted' ? t.rows : [];
    ok(rows.length > 0 && rows.every(r => r.actor === 1), 'the waiting player sees the AFK player\'s turn pass (actor = opponent)');
    ok(rows.some(r => r.events.some(e => e.t === 'log' && /demorou demais/.test(e.text))), 'told the opponent was too slow');
    const afkRows = await db.views(id, afk, 1);
    ok(afkRows.some(r => r.events.some(e => e.t === 'log' && /seu turno foi encerrado/.test(e.text))), 'the AFK player is told too');
    eq(db.matches[0].state.turn.active, afk === 0 ? 1 : 0, 'the turn really passed');
  });

  await test('rewards: paid once, to both, by the rules; the profile is updated; a second ask pays nothing more', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    await drive(db, id, () => false);
    const m = db.matches[0];
    ok(m.status === 'finished' && m.rewards !== null && m.rewards.length === 2, 'rewards were stored for both players');
    const winnerUser = userOf(db, m.winner as Seat);
    const loserUser = userOf(db, (m.winner === 0 ? 1 : 0) as Seat);
    const expectWin = { ...rewardFor({ won: true, vsBot: false, ending: 'general', rounds: m.state.turn.round, steps: m.steps_count }), coroas: FIRST_WIN_COROAS };   // pessoa x pessoa não paga coroas, só a 1ª vitória do dia
    const expectLoss = rewardFor({ won: false, vsBot: false, ending: 'general', rounds: m.state.turn.round, steps: m.steps_count });
    const w = m.rewards!.find(r => r.user_id === winnerUser)!;
    const l = m.rewards!.find(r => r.user_id === loserUser)!;
    eq([w.xp, w.coroas, w.reason], [expectWin.xp, expectWin.coroas, expectWin.reason]);
    eq([l.xp, l.coroas, l.reason], [expectLoss.xp, expectLoss.coroas, expectLoss.reason]);
    const prof = (u: string) => db.tables.profiles.find(p => p.id === u)!;
    eq([prof(winnerUser).xp, prof(winnerUser).coroas], [applyReward({ level: 1, xp: 0, coroas: 150 }, expectWin).xp, 150 + expectWin.coroas]);
    const r1 = await handleGame(db, winnerUser, { op: 'result', matchId: id }, cfg);
    const r2 = await handleGame(db, winnerUser, { op: 'result', matchId: id }, cfg);
    ok(r1.ok === true && r1.status === 'result' && r1.reward !== null && r1.reward.reason === 'win', 'result says what I got');
    eq(JSON.stringify(r1), JSON.stringify(r2));
    eq(prof(winnerUser).coroas, 150 + expectWin.coroas, 'not paid twice');
  });

  await test('rewards: a match given up early pays nothing; a forfeit by the clock pays the one who stayed', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    const m = db.matches[0];
    const quitter = userOf(db, m.state.turn.active as Seat);
    await handleGame(db, quitter, { op: 'act', matchId: id, action: { type: 'concede' } }, cfg);
    const r = await handleGame(db, quitter, { op: 'result', matchId: id }, cfg);
    ok(r.ok === true && r.status === 'result' && r.reward?.reason === 'too_short', 'too short to pay: ' + JSON.stringify(r));
    const db2 = fresh();
    const g = await pvp(db2);
    await drive(db2, g.id, mm => mm.state.turn.round >= 2);   // early: the planner finishes matches fast
    const m2 = db2.matches[0];
    const afk = m2.state.turn.active as Seat;
    clock += 101000; await handleGame(db2, userOf(db2, afk === 0 ? 1 : 0), { op: 'tick', matchId: g.id }, cfg);
    // the AFK player's turn was passed; make them miss again
    for (let i = 0; i < 80 && db2.matches[0].status === 'active'; i++) {
      const mv = (db2.matches[0].state.pending ? db2.matches[0].state.pending.seat : db2.matches[0].state.turn.active) as Seat;
      if (mv === afk) { clock += 101000; await handleGame(db2, userOf(db2, afk === 0 ? 1 : 0), { op: 'tick', matchId: g.id }, cfg); }
      else { const mm = db2.matches[0]; await handleGame(db2, userOf(db2, mv), { op: 'act', matchId: g.id, action: mm.state.pending ? aiNextAction(mm.state, mv, () => 0.4) : { type: 'advance' } }, cfg); }   // the one who stayed just passes, so the match cannot end any other way
    }
    const f = db2.matches[0];
    eq([f.status, f.end_reason], ['finished', 'timeout']);
    const stayed = userOf(db2, afk === 0 ? 1 : 0);
    const lost = userOf(db2, afk);
    eq(f.rewards!.find(x => x.user_id === stayed)!.reason, 'win');
    eq(f.rewards!.find(x => x.user_id === lost)!.reason, 'abandoned');
  });

  await test('quick messages: sent to the other chair only, with a pause, a code whitelist and no bot', async () => {
    const db = fresh();
    const { id } = await pvp(db);
    const A = userOf(db, 0), B = userOf(db, 1);
    const sent = await handleGame(db, A, { op: 'emote', matchId: id, code: 'p2' }, cfg);
    ok(sent.ok === true && sent.status === 'emotes' && sent.emotes.length === 1 && sent.emotes[0].from === 0, 'sender sees it as its own: ' + JSON.stringify(sent));
    const seen = await handleGame(db, B, { op: 'emotes', matchId: id, since: 0 }, cfg);
    ok(seen.ok === true && seen.status === 'emotes' && seen.emotes.length === 1 && seen.emotes[0].from === 1 && seen.emotes[0].code === 'p2', 'receiver: ' + JSON.stringify(seen));
    const later = await handleGame(db, B, { op: 'emotes', matchId: id, since: 1 }, cfg);
    ok(later.ok === true && later.status === 'emotes' && later.emotes.length === 0, 'nothing new after the last id');
    const tooSoon = await handleGame(db, A, { op: 'emote', matchId: id, code: 'e1' }, cfg);
    ok(tooSoon.ok === false, 'two messages in a row are refused');
    clock += 3000;
    ok((await handleGame(db, A, { op: 'emote', matchId: id, code: 'e1' }, cfg)).ok === true, 'after the pause it goes through');
    clock += 3000;
    ok((await handleGame(db, A, { op: 'emote', matchId: id, code: 'tudo livre' }, cfg)).ok === false, 'free text is refused');
    ok((await handleGame(db, A, { op: 'emote', matchId: id, code: 'p9' }, cfg)).ok === false, 'unknown code is refused');
    ok((await handleGame(db, 'C', { op: 'emote', matchId: id, code: 'p1' }, cfg)).ok === false, 'a stranger cannot speak');
    const db2 = fresh();
    const b = await botMatch(db2);
    ok((await handleGame(db2, 'A', { op: 'emote', matchId: b.id, code: 'p1' }, cfg)).ok === false, 'no messages against the bot');
  });

  await test('ranked seasons: a new season closes the old one once (reward, frame, soft reset) and the Coroas are claimed once', async () => {
    const db = fresh();
    db.rankedRows.set('A', { points: 1283, peak: 1450, mmr: 1100, games: 30, wins: 18, losses: 12, shield: true, season: 1, frame: null });
    db.rankedRows.set('B', { points: 500, peak: 500, mmr: 1000, games: 9, wins: 5, losses: 4, shield: false, season: 1, frame: null });
    const saved = clock;
    clock = SEASON_ONE_START + 61 * 86400000;
    const v = await handleGame(db, 'A', { op: 'ranked' }, cfg);
    ok(v.ok === true && v.status === 'ranked', 'ranked view: ' + JSON.stringify(v));
    if (v.ok === true && v.status === 'ranked') {
      eq([v.profile.season, v.profile.points, v.profile.frame, v.profile.games, v.profile.shield], [2, 600, 'ouro', 0, false]);
      eq(v.profile.pending, [{ season: 1, league: 'ouro', coroas: 200 }]);
      ok(!('mmr' in v.profile), 'the hidden Elo stays hidden');
    }
    await handleGame(db, 'A', { op: 'ranked' }, cfg);
    eq(db.seasonRows.filter(r => r.user_id === 'A').length, 1, 'closed only once');
    const c1 = await handleGame(db, 'A', { op: 'claim', season: 1 }, cfg);
    ok(c1.ok === true && c1.status === 'claimed' && c1.coroas === 200 && c1.coroas_after === 350 && c1.profile.pending.length === 0, 'claim pays: ' + JSON.stringify(c1));
    const c2 = await handleGame(db, 'A', { op: 'claim', season: 1 }, cfg);
    eq(c2.ok, false, 'a second claim pays nothing');
    const c3 = await handleGame(db, 'B', { op: 'claim', season: 1 }, cfg);
    eq(c3.ok, false, 'nothing to claim before the season is closed for B');
    // the ranking only lists players of the current season (B was not closed yet, so is not listed)
    const rk = await handleGame(db, 'A', { op: 'ranking' }, cfg);
    ok(rk.ok === true && rk.status === 'ranking' && rk.rows.length === 1 && rk.rows[0].me, 'only the current season: ' + JSON.stringify(rk));
    clock = saved;
  });

  await test('ranked seasons: the test offset moves the calendar forward without touching the clock', async () => {
    const db = fresh();
    db.rankedRows.set('A', { points: 900, peak: 900, mmr: 1000, games: 10, wins: 6, losses: 4, shield: false, season: 1, frame: null });
    const saved = clock;
    clock = SEASON_ONE_START + 86400000;
    const before = await handleGame(db, 'A', { op: 'ranked' }, cfg);
    ok(before.ok === true && before.status === 'ranked' && before.profile.season === 1 && before.profile.pending.length === 0, 'still season 1: ' + JSON.stringify(before));
    db.seasonOffset = 61;
    const after = await handleGame(db, 'A', { op: 'ranked' }, cfg);
    ok(after.ok === true && after.status === 'ranked' && after.profile.season === 2 && after.profile.pending.length === 1 && after.profile.pending[0].league === 'prata', 'season 2 after the offset: ' + JSON.stringify(after));
    if (after.ok === true && after.status === 'ranked') {
      const days = (after.profile.endsAt - clock) / 86400000;
      ok(days > 57 && days < 59, 'the end is reported in real time: ' + days);
    }
    clock = saved;
  });

  await test('ranked matchmaking: players far apart in Elo are not paired at first, the window widens with the wait', async () => {
    const db = fresh();
    const setMmr = (u: string, mmr: number) => db.rankedRows.set(u, { points: 0, peak: 0, mmr, games: 10, wins: 5, losses: 5, shield: false, season: 1, frame: null });
    setMmr('A', 1000); setMmr('B', 1800);
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), ranked: true }, cfg);
    const b = await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao'), ranked: true }, cfg);
    ok(b.ok === true && b.status === 'waiting', 'Elo 1000 and 1800 do not pair at once: ' + JSON.stringify(b));
    const t0 = clock;
    let matchedAt = -1;
    for (let i = 1; i <= 7 && matchedAt < 0; i++) {
      clock = t0 + i * 15000;
      const a = await handleGame(db, 'A', { op: 'status' }, cfg);
      const bb = await handleGame(db, 'B', { op: 'status' }, cfg);
      if ((a.ok === true && a.status === 'matched') || (bb.ok === true && bb.status === 'matched')) matchedAt = i * 15;
    }
    clock = t0;
    ok(matchedAt >= 75, 'a gap of 800 needs about 70 s of waiting, matched at ' + matchedAt + ' s');
    eq(db.matches.length, 1, 'exactly one match was made');
    eq(db.matches[0].ranked, true);
  });

  await test('ranked matchmaking: the closest Elo among those inside the window is chosen', async () => {
    const db = fresh();
    db.tables.profiles.push({ id: 'C', username: 'Carla', avatar_id: 'batedora' });
    Object.entries(DECK_RECIPES.cardeal.cards).forEach(([card, copies]) => db.tables.collection.push({ user_id: 'C', card_name: card, copies }));
    db.tables.collection.push({ user_id: 'C', card_name: DECK_RECIPES.cardeal.general, copies: 1 });
    const setMmr = (u: string, mmr: number) => db.rankedRows.set(u, { points: 0, peak: 0, mmr, games: 10, wins: 5, losses: 5, shield: false, season: 1, frame: null });
    setMmr('A', 1000); setMmr('C', 1300); setMmr('B', 1250);
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), ranked: true }, cfg);
    await handleGame(db, 'C', { op: 'queue', ...deckOf('cardeal'), ranked: true }, cfg);
    eq(db.matches.length, 0, 'A and C are 300 apart: both wait');
    const m = matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao'), ranked: true }, cfg));
    eq(m.opponent.name, 'Carla', 'B (1250) is paired with C (1300), not A (1000)');
    eq((await db.queueGet('A'))?.user_id, 'A', 'A keeps waiting');
  });

  await test('ranked: the ranked queue never mixes with the casual one, and a bot is never ranked', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), ranked: true }, cfg);
    const casual = await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao') }, cfg);
    ok(casual.ok === true && casual.status === 'waiting', 'a casual player does not take a ranked one: ' + JSON.stringify(casual));
    eq(db.queue.length, 2);
    const db2 = fresh();
    await handleGame(db2, 'A', { op: 'queue', ...deckOf('cardeal'), ranked: true }, cfg);
    const r = matched(await handleGame(db2, 'B', { op: 'queue', ...deckOf('capitao'), ranked: true }, cfg));
    eq(r.ranked, true);
    eq(db2.matches[0].ranked, true);
    const db3 = fresh();
    const bot = matched(await handleGame(db3, 'A', { op: 'queue', ...deckOf('cardeal'), ranked: true, vsBot: true }, cfg));
    eq([bot.ranked, db3.matches[0].ranked], [false, false]);
  });

  await test('fair play: after 3 ranked matches in a day between the same two players, the next one moves no points', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), ranked: true }, cfg);
    matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao'), ranked: true }, cfg));
    const id = db.matches[0].id;
    for (let i = 1; i <= 3; i++) db.matches.push({ ...JSON.parse(JSON.stringify(db.matches[0])), id: `old-${i}`, status: 'finished', created_at: new Date().toISOString() });
    ok((await choose(db, true)).ok === true, 'chosen');
    await drive(db, id, () => false, 4000);
    const m = db.matches.find(x => x.id === id)!;
    eq(m.status, 'finished');
    const winner = userOf(db, m.winner as Seat);
    const rw = await handleGame(db, winner, { op: 'result', matchId: id }, cfg);
    ok(rw.ok === true && rw.status === 'result' && !!rw.reward && rw.reward.reason !== 'too_short', 'the match must count: ' + JSON.stringify(rw));
    if (rw.ok === true && rw.status === 'result' && rw.reward && rw.reward.reason !== 'too_short') {
      ok(rw.reward.ranked?.repeat === true && rw.reward.ranked.delta === 0, 'repeat flagged, no points: ' + JSON.stringify(rw.reward.ranked));
      eq((await db.rankedProfile(winner))?.points ?? 0, 0, 'the winner keeps 0 points');
    }
  });

  await test('requests: odd or oversized input is refused before anything reads it', async () => {
    const db = fresh();
    const bad = async (req: any) => { const r = await handleGame(db, 'A', req, cfg); ok(r.ok === false, 'refused: ' + JSON.stringify(req).slice(0, 80)); };
    await bad(null); await bad([]); await bad({ op: 'drop table' }); await bad({ op: 5 }); await bad({});
    await bad({ op: 'queue', cards: { ['X'.repeat(500)]: 1 }, general: 'g' });
    await bad({ op: 'queue', cards: { Soldado: -3 }, general: 'g' });
    await bad({ op: 'queue', cards: { Soldado: 1.5 }, general: 'g' });
    await bad({ op: 'queue', cards: Object.fromEntries(Array.from({ length: 300 }, (_, i) => [`c${i}`, 1])), general: 'g' });
    await bad({ op: 'act', matchId: 'm'.repeat(200), action: { type: 'pass' } });
    await bad({ op: 'act', matchId: 'x', action: { type: 'pass', junk: 'y'.repeat(5000) } });
    await bad({ op: 'status', since: -1 });
    await bad({ op: 'emote', matchId: 'x', code: 'p1'.repeat(10) });
  });

  await test('ranked: a finished match moves the ladder once (winner up, loser down or kept at 0), and the reward carries it', async () => {
    const db = fresh();
    await handleGame(db, 'A', { op: 'queue', ...deckOf('cardeal'), ranked: true }, cfg);
    matched(await handleGame(db, 'B', { op: 'queue', ...deckOf('capitao'), ranked: true }, cfg));
    const id = db.matches[0].id;
    const ch = await choose(db, true); ok(ch.ok === true, 'chosen');
    await drive(db, id, () => false, 4000);
    const m = db.matches[0];
    eq(m.status, 'finished');
    const winner = userOf(db, m.winner as Seat), loser = userOf(db, (m.winner === 0 ? 1 : 0) as Seat);
    const rw = await handleGame(db, winner, { op: 'result', matchId: id }, cfg);
    ok(rw.ok === true && rw.status === 'result' && !!rw.reward?.ranked, 'the winner gets ranked info: ' + JSON.stringify(rw));
    ok(!JSON.stringify(rw).includes('mmr'), 'the hidden Elo is never sent to a device');
    const rl = await handleGame(db, loser, { op: 'result', matchId: id }, cfg);
    const p1 = await db.rankedProfile(winner), p2 = await db.rankedProfile(loser);
    ok(!!p1 && !!p2, 'both ladder rows exist');
    if (rw.ok === true && rw.status === 'result' && rw.reward?.reason !== 'too_short') {
      ok(p1!.points > 0 && p1!.wins === 1 && p1!.games === 1, 'winner climbed: ' + JSON.stringify(p1));
      ok(p2!.points === 0 && p2!.losses === 1, 'loser stays at the floor: ' + JSON.stringify(p2));
      ok(p1!.mmr > 1000 && p2!.mmr < 1000, 'hidden Elo moved');
    }
    // asking again never applies it twice
    await handleGame(db, winner, { op: 'result', matchId: id }, cfg); await handleGame(db, loser, { op: 'result', matchId: id }, cfg);
    eq((await db.rankedProfile(winner))!.games, 1);
    void rl;
    // the client view: no hidden Elo, a position and the label
    const v = await handleGame(db, winner, { op: 'ranked' }, cfg);
    ok(v.ok === true && v.status === 'ranked' && !('mmr' in v.profile) && v.profile.position === 1 && /Ferro|Bronze/.test(v.profile.label), 'ranked view: ' + JSON.stringify(v));
    const top = await handleGame(db, loser, { op: 'ranking' }, cfg);
    ok(top.ok === true && top.status === 'ranking' && top.rows.length === 2 && top.rows[0].me === false && top.rows[1].me === true, 'ranking lists both, me flagged: ' + JSON.stringify(top));
  });

  await test('missões: sorteio estável, contagem pela partida, coleta paga uma vez, troca 1 por dia, virada do dia', async () => {
    const db = fresh();
    const get = async () => { const r = await handleGame(db, 'A', { op: 'missions' }, cfg); if (r.ok !== true || r.status !== 'missions') throw new Error('missions: ' + JSON.stringify(r)); return r; };
    const b0 = await get();
    eq([b0.daily.length, b0.weekly.length, b0.season.length], [5, 3, 0], 'vagas: 5 diárias, 3 semanais, sem temporada (ranqueadas desligadas)');
    eq(b0.daily.filter(m => m.mode === 'ia').length, 2, '2 diárias contra a IA');
    ok(b0.daily.every(m => m.mode !== 'ranked') && b0.weekly.every(m => m.mode !== 'ranked'), 'nenhuma ranqueada');
    eq((await get()).daily.map(m => m.id), b0.daily.map(m => m.id), 'o quadro do dia não muda ao pedir de novo');
    eq([b0.rerollsLeft, b0.claimable], [1, 0]);
    // uma partida contra a IA vira progresso (unidades convocadas e partida jogada)
    const { id } = await botMatch(db);
    await drive(db, id, () => false, 4000);
    ok(db.matches[0].status === 'finished', 'a partida terminou');
    const b1 = await get();
    const summon = b1.daily.find(m => m.id === 'd-free-summon8')!;
    ok(summon.progress > 0, 'convocar unidades contou: ' + JSON.stringify(summon));
    const iaPlay = b1.daily.find(m => m.id === 'd-ia-play3');
    if (iaPlay) eq(iaPlay.progress, 1, 'partida contra a IA contou como 1 partida');
    await handleGame(db, 'A', { op: 'result', matchId: id }, cfg);   // pedir o resultado de novo não conta duas vezes
    eq((await get()).daily.find(m => m.id === 'd-free-summon8')!.progress, summon.progress, 'não conta duas vezes');
    // coleta: só com a missão cumprida, uma vez, e paga as coroas
    const key = b1.daily[0].key, first = b1.daily[0];
    const early = await handleGame(db, 'A', { op: 'missionClaim', key, mission: first.id }, cfg);
    ok(early.ok === false, 'não coleta missão incompleta');
    const row = db.missionRows.get(`A|${key}`)!; const item = row.data.items.find(x => x.id === first.id)!; item.progress = first.target;
    const before = db.tables.profiles.find(x => x.id === 'A')!.coroas ?? 150;
    const c1 = await handleGame(db, 'A', { op: 'missionClaim', key, mission: first.id }, cfg);
    ok(c1.ok === true && c1.status === 'missions' && c1.paid === first.reward && c1.coroas_after === before + first.reward, 'pagou: ' + JSON.stringify(c1));
    const c2 = await handleGame(db, 'A', { op: 'missionClaim', key, mission: first.id }, cfg);
    ok(c2.ok === false, 'não paga duas vezes');
    eq(db.tables.profiles.find(x => x.id === 'A')!.coroas, before + first.reward);
    ok((await handleGame(db, 'A', { op: 'missionClaim', key: 'd:2001-01-01', mission: first.id }, cfg)).ok === false, 'período velho não coleta');
    // troca: 1 por dia, só de missão não cumprida, e a nova não repete
    const target = (await get()).daily.find(m => m.reroll)!;
    const rr = await handleGame(db, 'A', { op: 'missionReroll', mission: target.id }, cfg);
    ok(rr.ok === true && rr.status === 'missions' && rr.rerollsLeft === 0 && !rr.daily.some(m => m.id === target.id) && new Set(rr.daily.map(m => m.id)).size === 5, 'trocou: ' + JSON.stringify(rr));
    ok((await handleGame(db, 'A', { op: 'missionReroll', mission: (rr as any).daily[1].id }, cfg)).ok === false, 'só 1 troca por dia');
    // outro jogador tem o próprio quadro
    const other = await handleGame(db, 'B', { op: 'missions' }, cfg);
    ok(other.ok === true && other.status === 'missions' && other.daily.every(m => m.progress === 0), 'o quadro do outro jogador é separado');
    // virada do dia: novas missões, as de ontem somem
    const keep = clock; clock += 24 * 3600e3;
    const next = await get();
    ok(next.daily[0].key !== key && next.daily.every(m => m.progress === 0) && next.rerollsLeft === 1, 'novo dia, quadro novo');
    clock = keep;
  });

  await test('booster: servidor cobra 150, sorteia 5, grava na coleção; repetidas viram coroas; sem coroas recusa', async () => {
    const db = fresh();
    const prof = () => db.tables.profiles.find(x => x.id === 'A')!;
    const total = () => db.tables.collection.filter(r => r.user_id === 'A' && !r.card_name.includes('#')).reduce((n, r) => n + r.copies, 0);
    const before = total();
    ok((await handleGame(db, 'A', { op: 'openBooster', booster: 'nada' }, cfg)).ok === false, 'booster desconhecido recusado');
    const r = await handleGame(db, 'A', { op: 'openBooster', booster: 'campo' }, cfg);
    if (r.ok !== true || r.status !== 'booster') throw new Error('booster: ' + JSON.stringify(r));
    eq(r.cards.length, 5, '5 cartas');
    eq(r.spent, BOOSTER_PRICE);
    eq(prof().coroas, 150 - BOOSTER_PRICE + r.refund, 'saldo = 150 - preço + repetidas');
    eq(r.coroas_after, prof().coroas);
    const gained = r.cards.filter(c => c.dup === 'no').length;
    eq(total() - before, gained, 'só as cartas que não eram repetidas entram na coleção');
    eq(r.refund, r.cards.reduce((n, c) => n + c.coroas, 0), 'o reembolso é a soma das repetidas');
    // sem coroas: recusa e não muda nada
    prof().coroas = 100;
    const snap = JSON.stringify(db.tables.collection);
    const no = await handleGame(db, 'A', { op: 'openBooster', booster: 'cardeal' }, cfg);
    ok(no.ok === false && prof().coroas === 100 && JSON.stringify(db.tables.collection) === snap, 'sem coroas nada muda');
    // repetidas: quem tem tudo no máximo recebe coroas pelas cartas (5 a comum)
    prof().coroas = 1000;
    for (const e of boosterPool('cardeal')) { const n = maxCopiesOf(e.name); const row = db.tables.collection.find(x => x.user_id === 'A' && x.card_name === e.name); if (row) row.copies = n; else db.tables.collection.push({ user_id: 'A', card_name: e.name, copies: n }); }
    const dup = await handleGame(db, 'A', { op: 'openBooster', booster: 'cardeal' }, cfg);
    if (dup.ok !== true || dup.status !== 'booster') throw new Error('dup: ' + JSON.stringify(dup));
    ok(dup.cards.every(c => c.dup !== 'no' && !c.isNew) && dup.refund >= 25, 'tudo repetido rende coroas: ' + JSON.stringify(dup.cards));
    eq(prof().coroas, 1000 - BOOSTER_PRICE + dup.refund);
    // settleBooster: rara sobre 3 comuns vira melhoria (a comum rende 5), ultra sobre 3 ultras rende 50
    const s1 = settleBooster({ 'Cavalaria': 3 }, [{ name: 'Cavalaria', rarity: 'rara' }]);
    eq([s1.cards[0].dup, s1.refund, s1.adds], ['upgrade', 5, { 'Cavalaria#rara': 1 }], 'melhoria');
    const s2 = settleBooster({ 'Cavalaria': 3, 'Cavalaria#ultra': 3 }, [{ name: 'Cavalaria', rarity: 'ultra' }]);
    eq([s2.cards[0].dup, s2.refund], ['coroas', 50], 'ultra repetida');
    // proteção de sorte: carta nova pesa mais (média de cartas novas por pacote sobe)
    let plain = 0, boosted = 0;
    const own: Record<string, number> = {}; boosterPool('capitao').forEach((e, i) => { if (i % 2) own[e.name] = 3; });
    let st = 1; const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
    for (let i = 0; i < 400; i++) { plain += rollBooster('capitao', Object.fromEntries(boosterPool('capitao').map(e => [e.name, 3])), rnd).filter(c => !own[c.name]).length; boosted += rollBooster('capitao', own, rnd).filter(c => !own[c.name]).length; }
    ok(boosted > plain, 'carta nova sai mais quando falta na coleção: ' + boosted + ' x ' + plain);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
