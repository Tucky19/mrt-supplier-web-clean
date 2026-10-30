const { chromium } = require('playwright');
const fs = require('node:fs');
const phase = process.argv[2] || 'after';
const dir = `docs/qa/customer-theme/${phase}`;
const routes = { home:'', products:'products?q=P551864', brands:'brands', detail:'products/P551864', rfq:'quote', contact:'contact', article:'articles/industrial-filter-selection-guide' };
(async () => {
  fs.mkdirSync(dir,{recursive:true});
  const b = await chromium.launch();
  const results = [];
  for (const width of [1440,390]) for (const [name,route] of Object.entries(routes)) {
    for (const lang of phase === 'before' ? ['th'] : ['th','en']) {
      const p = await b.newPage({viewport:{width,height:900},locale:lang==='th'?'th-TH':'en-US'});
      await p.route('**/api/**',r=>r.request().method()==='POST'?r.abort():r.continue());
      await p.addInitScript(()=>localStorage.setItem('mrt_cookie_consent','rejected'));
      const response = await p.goto(`http://localhost:3100/${lang}/${route}`);
      await p.locator('h1:visible').first().waitFor();
      await p.evaluate(()=>document.fonts.ready);
      await p.evaluate(async () => {
        const images = [...document.images];
        images.forEach(image => { image.loading = 'eager'; });
        await Promise.race([
          Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; }))),
          new Promise(resolve => setTimeout(resolve,3000)),
        ]);
      });
      await p.waitForTimeout(400);
      await p.screenshot({path:`${dir}/${name}-${width}-${lang}.png`});
      if(phase==='after') await p.screenshot({path:`${dir}/${name}-${width}-${lang}-full.png`,fullPage:true});
      results.push(await p.evaluate(({name,status})=>({name,status,url:location.href,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,font:getComputedStyle(document.querySelector('h1')).fontFamily,headerHeight:document.querySelector('header')?.getBoundingClientRect().height,nav:[...document.querySelectorAll('header > div > nav a')].map(a=>({text:a.textContent,current:a.getAttribute('aria-current')}))}),{name,status:response.status()}));
      await p.close();
    }
  }
  fs.writeFileSync(`${dir}/results.json`,JSON.stringify(results,null,2));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
