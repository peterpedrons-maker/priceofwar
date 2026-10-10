const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const S = '/tmp/claude-0/-home-user-priceofwar/53582eeb-f6be-53f8-9656-e04ea703ad88/scratchpad';
const DUR = { manutencao: 4.2, dispensar: 4.0, muralha: 4.2, chuva: 4.0, punhal: 3.8, bolsa: 4.2, boca: 3.0, codice: 5.2, contamoedas: 2.6, contra: 3.4, formacao: 3.6, reformar: 3.6, pantano: 5.2, estandarte: 3.6, brecha: 3.8, plantar: 4.2, pilhagem: 3.4, retomada: 4.0, reparar: 3.4 };
const only = process.argv[2] ? process.argv[2].split(',') : Object.keys(DUR);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 640 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4514/mockups/efeitos-decks/index.html'); await page.waitForTimeout(1800);
  await page.addStyleTag({ content: 'header,nav{display:none!important} #holder{position:fixed;inset:0} #stage{transform:none!important;border-radius:0!important;box-shadow:none!important}' });
  await page.waitForTimeout(300);
  const cdp = await ctx.newCDPSession(page);
  for (const k of only) {
    const frames = [];
    cdp.removeAllListeners('Page.screencastFrame');
    cdp.on('Page.screencastFrame', async f => { frames.push({ t: f.metadata.timestamp, d: f.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch {} });
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, everyNthFrame: 1 });
    await page.waitForTimeout(150);
    await page.evaluate(k => window.__run(k), k); const t0 = Date.now() / 1000;
    await page.waitForTimeout(DUR[k] * 1000 + 200);
    await cdp.send('Page.stopScreencast');
    const dir = `${S}/fr_${k}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/meta.json`, JSON.stringify({ t0, frames: frames.map((f, i) => ({ i, t: f.t })) }));
    frames.forEach((f, i) => fs.writeFileSync(`${dir}/${String(i).padStart(4, '0')}.jpg`, Buffer.from(f.d, 'base64')));
    console.log(k, frames.length, 'frames');
  }
  await b.close();
})();
