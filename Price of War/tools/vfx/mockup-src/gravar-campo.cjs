// Grava os efeitos do mockup do Campo em quadros PNG (20 por segundo), avançando o tempo da simulação à mão e sincronizando as animações CSS.
// Uso: node tools/vfx/mockup-src/gravar-campo.cjs <url> <pasta-saida> ; depois: python3 tools/vfx/mockup-src/montar-campo.py <pasta-saida> <pasta-gifs>
const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const fs = require('fs');
const url = process.argv[2] || 'http://localhost:4513/priceofwar/mockups/efeitos-campo/?manual', out = process.argv[3] || '/tmp/gifcampo';
const FPS = 20;
// [nome, cena, segundos antes de gravar, ação do modo (opcional), segundos gravados]
const PLAN = [
  ['forja', 'forja', 0, null, 4.4], ['forja-muralha', 'forja', 3.2, 'forja-muralha', 2.4], ['forja-afiacao', 'forja', 3.2, 'forja-afiacao', 2.4],
  ['fogo-sinal', 'fogo', 0, null, 4.4], ['fogo-saque', 'fogo', 3.8, 'fogo-saque', 2.6], ['fogo-trincheira', 'fogo', 3.8, 'fogo-trincheira', 2.4],
  ['noite-sem-parar', 'noite', 0, null, 5.4], ['a-mata-devolve', 'mata', 0, null, 4.0], ['arsenal-dos-mil-invernos', 'arsenal', 0, null, 4.4],
];
(async () => {
  const b = await chromium.launch(); const page = await (await b.newContext({ viewport: { width: 390, height: 1150 }, deviceScaleFactor: 1 })).newPage();
  page.on('pageerror', e => console.log('ERR', e.message));
  await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  await page.evaluate(() => { window.__starts = new Map(); window.setTimeout = (fn, ms) => { at(ms / 1000, fn); return 0; }; });
  const sync = () => page.evaluate(() => { for (const a of document.getAnimations()) { if (!__starts.has(a)) { __starts.set(a, now); a.pause(); } a.currentTime = (now - __starts.get(a)) * 1000; } });
  for (const [name, scene, pre, mode, secs] of PLAN) {
    fs.rmSync(`${out}/${name}`, { recursive: true, force: true }); fs.mkdirSync(`${out}/${name}`, { recursive: true });
    await page.evaluate(([s, p]) => { window.__run(s); if (p) window.__step(p); }, [scene, pre]);
    if (mode) await page.evaluate(m => window.__do(m), mode);
    const n = Math.round(secs * FPS);
    for (let i = 0; i < n; i++) { await page.evaluate(d => window.__step(d), 1 / FPS); await sync(); await page.waitForTimeout(25); await page.locator('#stage').screenshot({ path: `${out}/${name}/${String(i).padStart(3, '0')}.png` }); }
    console.log('ok', name, n);
  }
  await b.close();
})();
