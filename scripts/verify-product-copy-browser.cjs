const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const results=[];
 for(const width of [390,1440]) for(const locale of ['th','en']) for(const sku of ['P502649','P554004','P550440']){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(`http://localhost:3187/${locale}/products/${sku}`,{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  const reject=page.getByRole("button",{name:locale==="th"?"ปฏิเสธ":"Reject",exact:true});
  if(await reject.isVisible()) await reject.click();
  const title=await page.title(), text=await page.locator('body').innerText();
  assert.ok(title.includes(sku));
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),`https://www.mrtsupplier.com/${locale}/products/${sku}`);
  assert.equal(await page.locator('link[hreflang=th]').getAttribute('href'),`https://www.mrtsupplier.com/th/products/${sku}`);
  assert.equal(await page.locator('link[hreflang=en]').getAttribute('href'),`https://www.mrtsupplier.com/en/products/${sku}`);
  if(sku==='P502649'){
   assert.ok(text.includes(locale==='th'?'น้ำยาหล่อเย็น OAT ชนิดเข้มข้น 1 ลิตร':'OAT coolant concentrate, 1 litre'));
   assert.ok(text.includes(locale==='th'?'กรุณายืนยันสูตรน้ำยาหล่อเย็น':'Confirm the coolant formulation'));
   assert.ok(!text.split('\n').some(line=>line==='Filter'));
  }
  if(sku==='P554004') {assert.ok(text.includes('108 mm'));assert.ok(text.includes('2P4004'));assert.ok(text.includes('LF667'));}
  if(sku==='P550440') assert.ok(text.includes('FF5052'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
  assert.deepEqual(errors,[]);
  fs.mkdirSync('output/product-copy-qa',{recursive:true});
  await page.screenshot({path:`output/product-copy-qa/${sku}-${locale}-${width}.png`,fullPage:true});
  results.push({sku,locale,width,status:response.status(),title,errors});
  await page.close();
 }
 fs.writeFileSync('output/product-copy-qa/results.json',JSON.stringify(results,null,2));
 await browser.close(); console.log(`PASS ${results.length} page/viewport checks; no RFQ submitted`);
})().catch(e=>{console.error(e);process.exit(1)});
