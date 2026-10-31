const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const b = await chromium.launch();
  const results = [];
  for (const width of [1440,390]) {
    const p = await b.newPage({viewport:{width,height:900},locale:'en-US'});
    await p.route('**/api/**',r=>r.request().method()==='POST'?r.abort():r.continue());
    await p.addInitScript(()=>localStorage.setItem('mrt_cookie_consent','rejected'));
    await p.goto('http://localhost:3100/en/products?q=P551864');
    const card = p.locator('[data-customer-card]').first();
    await card.getByRole('textbox',{name:'Quantity',exact:true}).fill('2');
    const add = card.locator('[data-primary-action]');
    const activeColor = await add.evaluate(e=>getComputedStyle(e).backgroundColor);
    await add.click();
    await p.waitForFunction(()=>JSON.parse(localStorage.getItem('mrt_quote_v1')||'[]')[0]?.qty===2);
    assert.equal(await add.isDisabled(),true);
    await p.waitForTimeout(250); // Let the existing color transition complete.
    const successColor = await add.evaluate(e=>getComputedStyle(e).backgroundColor);
    assert.notEqual(activeColor,successColor);
    await p.goto('http://localhost:3100/en/products?q=P181080');
    await p.locator('[data-customer-card] [data-primary-action]').first().click();
    await p.waitForFunction(()=>JSON.parse(localStorage.getItem('mrt_quote_v1')||'[]').length===2);
    await p.goto('http://localhost:3100/en/quote');
    const qty = p.locator('input[aria-label*="P551864"]').first();
    await qty.fill('3'); await qty.press('Tab');
    await p.waitForFunction(()=>JSON.parse(localStorage.getItem('mrt_quote_v1')||'[]')[0]?.qty===3);
    await p.screenshot({path:`docs/qa/customer-theme/after/rfq-items-${width}.png`,fullPage:true});
    const input = p.locator('input').first();
    assert.equal(await input.isVisible(),true);
    await p.goto('http://localhost:3100/en/products');
    const search = p.locator('input[name=q]').first();
    await search.fill('P772580');
    await p.getByRole('button',{name:/P828889/}).first().waitFor();
    await search.press('ArrowDown'); await search.press('Escape');
    assert.equal(await search.evaluate(e=>e===document.activeElement),true);
    await p.locator('h1').click(); await search.click(); await search.fill('P181'); await search.press('Enter');
    await p.waitForURL('**/products?q=P181');
    await p.locator('header [aria-label="Language switcher"] a[href^="/th"]').click();
    await p.waitForURL('**/th/products?q=P181');
    if(width===390) {
      await p.locator('header summary').click();
      const menu = p.locator('header details');
      await menu.getByRole('link',{name:'แบรนด์สินค้า',exact:true}).click();
      await p.waitForURL('**/th/brands');
      assert.equal(await p.locator('header details').getAttribute('open'),null);
    }
    results.push({width,addToRfq:true,rfqItems:2,quantityPersisted:3,successStatePreserved:true,activeColor,successColor,crossReference:true,search:true,languageSwitch:true,rfqSubmitted:false});
    await p.close();
  }
  const p = await b.newPage();
  for(const route of ['products/dimensions','quote/success','privacy','feedback','cross-reference/P828889','articles/when-to-replace-engine-air-filter','applications/air-compressor-generator']) {
    const response = await p.goto(`http://localhost:3100/th/${route}`);
    assert.equal(response.status(),200);
    results.push({route,status:response.status()});
  }
  fs.writeFileSync('docs/qa/customer-theme/after/smoke.json',JSON.stringify(results,null,2));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
