const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
(async () => {
  const b = await chromium.launch();
  for(const viewport of [1440,390]) {
    const width=viewport===1440?640:390;
    const rows=['products','brands','detail','rfq'].map(name=>`<section><h2>${name} — before / after</h2><div class="row"><img src="before/${name}-${viewport}-th.png"><img src="after/${name}-${viewport}-th.png"></div></section>`).join('');
    const html=`<!doctype html><meta charset="utf-8"><title>Customer theme before and after</title><style>body{margin:0;padding:20px;background:#e7edf3;font:15px Arial;color:#071d3c}h1{font-size:24px}h2{font-size:18px;margin:20px 0 10px}.row{display:grid;grid-template-columns:${width}px ${width}px;gap:16px}img{display:block;width:100%;background:white}section{margin-bottom:20px}</style><h1>Public pages — consistent homepage theme</h1><p>Left: previous theme at f4fc312. Right: corrected theme. Actual local production-build captures at ${viewport}px.</p>${rows}`;
    const file=path.resolve(`docs/qa/customer-theme/comparison-${viewport}.html`);
    fs.writeFileSync(file,html);
    const p=await b.newPage({viewport:{width:width*2+56,height:1000}});
    await p.goto(pathToFileURL(file).href);
    await p.screenshot({path:file.replace('.html','.png'),fullPage:true});
    await p.close();
  }
  await b.close();
})();
