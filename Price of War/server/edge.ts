// Supabase Edge Function entry (Deno). Built into supabase/functions/game/index.ts by `npm run build:edge` —
// that single file is what gets deployed (CLI or pasted in the dashboard).
// @ts-ignore Deno resolves this specifier at runtime
import { createClient } from 'npm:@supabase/supabase-js@2';
import { handleGame, type GameRequest } from './handler';
import { supabaseDb } from './supabaseDb';

declare const Deno: { env: { get(name: string): string | undefined }; serve(handler: (req: Request) => Promise<Response> | Response): void };

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data?.user) return json({ ok: false, error: 'Entre na sua conta para jogar online.' }, 401);
    const body = (await req.json()) as GameRequest;
    return json(await handleGame(supabaseDb(admin), data.user.id, body));
  } catch (e) {
    console.error('game function error', e);
    return json({ ok: false, error: 'Erro no servidor de partidas. Tente de novo.' }, 500);
  }
});
