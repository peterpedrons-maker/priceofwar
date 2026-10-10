// Renders every card of the catalog the way the game draws it (enlarged, with the wings of its frame and a margin, transparent
// background) so the 3D viewer can wrap it around a card. The game must be running (default http://localhost:4513/priceofwar/?debug).
//   node tools/card3d/render-faces.cjs [outDir] [url] [onlySlug,...]     then:  python3 tools/card3d/to-webp.py [outDir]
const fs = require('fs'); const path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const out = path.resolve(process.argv[2] || 'tools/card3d/png'); const url = process.argv[3] || 'http://localhost:4513/priceofwar/?debug';
const only = (process.argv[4] || '').split(',').filter(Boolean);
const cards = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards.json'), 'utf8')).filter(c => !only.length || only.includes(c.slug));
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const page = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true })).newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
  await page.getByText('Jogar como convidado').tap(); await page.waitForTimeout(800);
  await page.getByPlaceholder('Nome do comandante').fill('Cartas'); await page.getByText('Começar').tap(); await page.waitForTimeout(1500);
  await page.getByText('Desafios', { exact: true }).first().tap(); await page.waitForTimeout(1200);
  await page.evaluate(() => { window.__r = Math.random; Math.random = () => 0.1; });
  await page.getByText('Deck Capitão').first().tap();
  await page.waitForFunction(() => /Deu (Cara|Coroa)/i.test(document.body.innerText), null, { timeout: 20000 }); await page.waitForTimeout(1200);
  if (await page.getByText('Começar', { exact: true }).count()) await page.getByText('Começar', { exact: true }).first().tap();
  await page.evaluate(() => { Math.random = window.__r; });
  await page.waitForFunction(() => window.__powEngine && window.__powEngine() && window.__powEngine().turn.started, null, { timeout: 30000 });
  for (const c of cards) {
    await page.evaluate((c) => window.__powSet(st => {
      st.turn.round = 3; st.turn.phase = 'preparacao'; st.turn.active = 0; st.players[0].gold = 15; st.players[1].hand = [];
      for (let i = 0; i < 10; i++) { st.players[0].board[i] = null; st.players[1].board[i] = null; }
      const h = { id: 'h1', name: c.name, cardType: c.type, atk: c.atk, hp: c.hp, cost: c.cost, effect: c.effect || '' }; if (c.full) h.isFullArt = true;
      st.players[0].hand = [h];
    }), c);
    await page.waitForTimeout(1300);
    const el = await page.$('[data-hand-card]'); const bb = await el.boundingBox();
    await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height * 0.3); await page.waitForTimeout(1100);
    const r = await page.evaluate(() => {
      const g = document.querySelector('.inspect-glow'); const holder = g && g.parentElement; if (!holder) return null;
      const face = [...holder.querySelectorAll('div')].find(d => d.style.width === '224px' && d.style.height === '320px'); if (!face) return null;
      face.classList.add('__face');
      const st = document.createElement('style'); st.id = '__iso';
      st.textContent = 'html,body,#root{background:transparent !important} body *{visibility:hidden !important} .__face,.__face *{visibility:visible !important}';
      document.head.appendChild(st);
      const b = face.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height };
    });
    if (!r) { console.log('SKIP (no inspect)', c.slug); continue; }
    const mx = r.w * 0.16, my = r.h * 0.12; await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(out, c.slug + '.png'), clip: { x: Math.max(0, r.x - mx), y: Math.max(0, r.y - my), width: Math.min(390 - Math.max(0, r.x - mx), r.w + 2 * mx), height: r.h + 2 * my }, omitBackground: true });
    await page.evaluate(() => { document.getElementById('__iso')?.remove(); document.querySelectorAll('.__face').forEach(e => e.classList.remove('__face')); });
    await page.mouse.click(195, 120); await page.waitForTimeout(400);
    console.log('ok', c.slug);
  }
  await b.close();
})().catch(e => { console.log('SCRIPT ERROR', e.message); process.exit(1); });
