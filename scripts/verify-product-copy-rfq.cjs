const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch();const results=[];
 for(const locale of ['th','en']) for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  let rfqSubmissions=0;
  page.on('request',req=>{if(req.method()==='POST' && /\/api\/rfq/.test(req.url())) rfqSubmissions++});
  await page.goto(`http://localhost:3187/${locale}/products?q=P502649`,{waitUntil:'networkidle'});
  const reject=page.getByRole('button',{name:locale==='th'?'ปฏิเสธ':'Reject',exact:true});
  try{await reject.waitFor({state:'visible',timeout:3000});await reject.click()}catch{}
  const text=await page.locator('body').innerText();
  assert.ok(text.split('\n').includes(locale==='th'?'น้ำยาหล่อเย็น':'Coolant'));
  assert.ok(!text.split('\n').includes('Filter'));
  await page.getByRole('button',{name:locale==='th'?'เพิ่มใน RFQ':'Add to Quote',exact:true}).click();
  await page.goto(`http://localhost:3187/${locale}/quote`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.innerText.includes('P502649'));
  const items=await page.evaluate(()=>JSON.parse(localStorage.getItem('mrt_quote_v1')));
  assert.equal(items.length,1);assert.equal(items[0].partNo,'P502649');assert.equal(items[0].qty,1);
  assert.equal(items[0].title,'Coolant Concentrate, OAT 1L');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.innerText.includes('P502649'));
  assert.equal(rfqSubmissions,0);
  results.push({locale,width,category:'coolant',partNo:items[0].partNo,qty:items[0].qty,persisted:true,rfqSubmissions});
  await page.close();
 }
 fs.mkdirSync('output/product-copy-qa',{recursive:true});fs.writeFileSync('output/product-copy-qa/search-rfq.json',JSON.stringify(results,null,2));
 await browser.close();console.log('PASS 4 TH/EN mobile/desktop search-to-RFQ cases, reload persistence; zero RFQ submissions');
})().catch(e=>{console.error(e);process.exit(1)});
