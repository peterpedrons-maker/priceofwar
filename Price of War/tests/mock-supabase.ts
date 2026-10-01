// A stand-in for Supabase on localhost, to try the online game without a real project:
//   MOCK_BOT_MS=4000 npx tsx tests/mock-supabase.ts          (listens on 54321)
// It speaks just enough of the auth, REST and Edge Function APIs for the game, and runs the REAL game-server handler
// (server/handler.ts) on an in-memory database. Build the app against it with:
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=test.anon.key npm run build
import http from 'node:http';
import { handleGame, type GameConfig, type GameRequest } from '../server/handler';
import { MemoryDb } from '../server/memoryDb';

type Row = Record<string, any>;
const tables: { profiles: Row[]; collection: Row[]; decks: Row[] } = { profiles: [], collection: [], decks: [] };
const memory = new MemoryDb({ profiles: tables.profiles as any, collection: tables.collection as any });
const cfg: GameConfig = {
  botAfterMs: Number(process.env.MOCK_BOT_MS ?? 15000), turnMs: Number(process.env.MOCK_TURN_MS ?? 150000), promptMs: Number(process.env.MOCK_PROMPT_MS ?? 60000),
  maxTimeouts: 2, now: () => Date.now(), random: Math.random,
};

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
let users = 0;
const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, apikey, content-type, x-client-info, x-supabase-api-version, prefer, accept, accept-profile, content-profile, range',
  'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'access-control-expose-headers': 'content-range',
};
const send = (res: http.ServerResponse, code: number, body?: unknown) => {
  res.writeHead(code, { 'content-type': 'application/json', ...cors });
  res.end(body === undefined ? '' : JSON.stringify(body));
};
const readBody = (req: http.IncomingMessage) => new Promise<any>(resolve => {
  let d = ''; req.on('data', c => { d += c; }); req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch { resolve({}); } });
});
const uidFrom = (req: http.IncomingMessage): string | null => {
  try { return JSON.parse(Buffer.from((req.headers.authorization || '').replace('Bearer ', '').split('.')[1], 'base64url').toString()).sub; } catch { return null; }
};

http.createServer(async (req, res) => {
  const url = new URL(req.url!, 'http://x');
  if (req.method === 'OPTIONS') return send(res, 204);
  const path = url.pathname;

  if (path === '/auth/v1/signup') {
    const id = `00000000-0000-4000-8000-${String(++users).padStart(12, '0')}`;
    const now = Math.floor(Date.now() / 1000);
    const jwt = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: id, role: 'authenticated', is_anonymous: true, exp: now + 3600 })}.sig`;
    return send(res, 200, { access_token: jwt, token_type: 'bearer', expires_in: 3600, expires_at: now + 3600, refresh_token: 'r' + id, user: { id, aud: 'authenticated', role: 'authenticated', is_anonymous: true, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() } });
  }
  if (path.startsWith('/auth/v1/')) return send(res, 200, {});

  const uid = uidFrom(req);

  // ── the game server ──
  if (path === '/functions/v1/game' && req.method === 'POST' && process.env.NO_GAME) return send(res, 404, { message: 'Requested function was not found' });
  if (path === '/functions/v1/game' && req.method === 'POST') {
    if (!uid) return send(res, 401, { ok: false, error: 'Entre na sua conta para jogar online.' });
    const body = (await readBody(req)) as GameRequest;
    return send(res, 200, await handleGame(memory, uid, body, cfg));
  }

  const wantObj = (req.headers.accept || '').includes('pgrst.object');
  const eq = (k: string) => { const v = url.searchParams.get(k); return v && v.startsWith('eq.') ? v.slice(3) : null; };

  if (path === '/rest/v1/rpc/username_available') {
    const b = await readBody(req);
    return send(res, 200, !tables.profiles.some(p => p.username.toLowerCase() === String(b.name).trim().toLowerCase()));
  }

  // match_views: each player reads only the rows made for them (what they may see of every step)
  if (path === '/rest/v1/match_views' && req.method === 'GET') {
    const id = eq('match_id');
    const gt = Number((url.searchParams.get('n') ?? 'gt.0').replace('gt.', ''));
    const rows = memory.viewRows.filter(v => v.match_id === id && v.user === uid && v.n > gt).sort((x, y) => x.n - y.n)
      .map(({ n, actor, action, events, state, deadline }) => ({ n, actor, action, events, state, deadline }));
    return send(res, 200, rows);
  }

  const m = path.match(/^\/rest\/v1\/(\w+)$/);
  if (!m || !(m[1] in tables)) return send(res, 404, { message: 'not found' });
  const t = m[1] as keyof typeof tables;
  const key = t === 'profiles' ? 'id' : 'user_id';
  if (req.method === 'GET') {
    let rows = tables[t].filter(r => r[key] === uid);
    const v = eq(key); if (v) rows = rows.filter(r => r[key] === v);
    if (wantObj) return rows[0] ? send(res, 200, rows[0]) : send(res, 406, { code: 'PGRST116', message: 'no rows' });
    return send(res, 200, rows);
  }
  const body = await readBody(req);
  const items: Row[] = Array.isArray(body) ? body : [body];
  if (req.method === 'POST') {
    const out: Row[] = [];
    for (const it of items) {
      if (t === 'profiles') {
        if (tables.profiles.some(p => p.username.toLowerCase() === it.username.toLowerCase())) return send(res, 409, { code: '23505', message: 'duplicate key value violates unique constraint "profiles_username_key"' });
        if (!/^[\p{L}\p{N} _.-]{3,16}$/u.test(it.username)) return send(res, 400, { code: '23514', message: 'check constraint' });
        const row = { id: it.id, username: it.username, avatar_id: it.avatar_id, level: 1, xp: 0, coroas: 150 };
        tables.profiles.push(row); out.push(row);
      } else {
        const idx = tables[t].findIndex(r => r.user_id === it.user_id && (t === 'collection' ? r.card_name === it.card_name : r.slot === it.slot));
        if (idx >= 0) tables[t][idx] = { ...tables[t][idx], ...it }; else tables[t].push(it);
        out.push(it);
      }
    }
    return send(res, 201, wantObj ? out[0] : out);
  }
  if (req.method === 'PATCH') {
    const v = eq(key); const rows = tables[t].filter(r => r[key] === v);
    if (t === 'profiles' && body.username && tables.profiles.some(p => p.id !== v && p.username.toLowerCase() === body.username.toLowerCase())) return send(res, 409, { code: '23505', message: 'duplicate' });
    rows.forEach(r => Object.assign(r, body));
    return send(res, 200, wantObj ? rows[0] : rows);
  }
  if (req.method === 'DELETE') {
    const v = eq(key);
    for (let i = tables[t].length - 1; i >= 0; i--) if (tables[t][i][key] === v) tables[t].splice(i, 1);   // in place: the game server shares these arrays
    return send(res, 204);
  }
  send(res, 405, {});
}).listen(Number(process.env.PORT ?? 54321), () => console.log('mock supabase on ' + (process.env.PORT ?? 54321) + ' (bot after ' + cfg.botAfterMs + ' ms)'));
setInterval(() => {}, 1e6);
