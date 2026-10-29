// Screenshot comparison only: no generated or altered design imagery.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  for (const mobile of [false, true]) {
    const width = mobile ? 390 : 560;
    const sourceWidth = mobile ? 328 : 1114;
    const scale = width / sourceWidth;
    const refHeight = (mobile ? 890 : 987) * scale;
    const x = (mobile ? 1175 : 31) * scale;
    const y = (mobile ? 78 : 18) * scale;
    const viewport = mobile ? 390 : 1440;
    const kind = mobile ? 'mobile' : 'desktop';
    const html = `<!doctype html><meta charset="utf-8"><title>${kind} fidelity comparison</title>
      <style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#e7edf3;font:15px Arial;color:#10243d}h1{font-size:24px;margin:0 0 8px}p{margin:0 0 20px}main{display:grid;grid-template-columns:repeat(3,${width}px);gap:20px}h2{font-size:18px;margin:0 0 5px}small{display:block;margin:0 0 12px}.panel{background:white;width:${width}px}.panel>img{display:block;width:100%}.reference{position:relative;overflow:hidden;height:${refHeight}px}.reference img{position:absolute;max-width:none;width:${1536*scale}px;left:-${x}px;top:-${y}px}</style>
      <h1>${kind === 'mobile' ? 'Mobile 390px' : 'Desktop 1440px'} — approved reference / before / corrected render</h1>
      <p>Actual browser captures are local production builds. Reference is the supplied static mockup, cropped to its ${kind} content and scaled to the same displayed width.</p>
      <main><section><h2>Approved reference</h2><small>Owner-supplied image; no new mockup</small><div class="panel reference"><img src="approved-reference.png"></div></section>
      <section><h2>Before — 074bfcc</h2><small>Prior actual local render; ${viewport}px viewport</small><div class="panel"><img src="../approved-hero/${viewport}-th-full.png"></div></section>
      <section><h2>Corrected implementation</h2><small>Fresh actual local render; ${viewport}px viewport</small><div class="panel"><img src="${viewport}-th-full.png"></div></section></main>`;
    const file = path.resolve(`docs/qa/pr179/fidelity/comparison-${kind}.html`);
    fs.writeFileSync(file, html);
    const page = await browser.newPage({ viewport: { width: width * 3 + 88, height: 1000 } });
    await page.goto(pathToFileURL(file).href);
    await page.screenshot({ path: file.replace('.html','.png'), fullPage: true });
    await page.screenshot({ path: file.replace('.html','-first.png'), fullPage: false });
    await page.close();
  }
  await browser.close();
})();
