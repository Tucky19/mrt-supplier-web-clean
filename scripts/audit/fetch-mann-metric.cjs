// Read-only evidence collection. Does not mutate catalog or guess replacement PNs.
const fs = require('node:fs');
const {execFile} = require('node:child_process');
const {promisify} = require('node:util');
const cheerio = require('cheerio');
const run = promisify(execFile);
const catalog = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = process.argv[3];
const queue = catalog.filter(p => p.brand === 'MANN-FILTER' && p.officialUrl);
const results = [];
const key = v => v.toLowerCase().replace(/[^a-z0-9]/g, '');
async function worker() {
 while(queue.length) {
  const p=queue.shift();
  // Same exact product, international metric locale; no candidate PN substitutions.
  const slug=p.officialUrl.split('/product').pop().replace(/^\.suffix\.html\//,'.html/');
  const url='https://www.mann-filter.com/en/catalog/search-results/product'+slug;
  try {
   const {stdout}=await run('curl',['-L','-sS','--fail','--max-time','25',url],{maxBuffer:12*1024*1024});
   const $=cheerio.load(stdout);
   const headings=$('h1').text().replace(/\s+/g,' ').trim();
   const dims=$('.cmp-product__dimensions table tr').map((i,e)=>{
    const t=$(e).find('td').map((j,d)=>$(d).text().replace(/\s+/g,' ').trim()).get();
    return t.length===2?{label:t[0],value:t[1]}:null;
   }).get();
   const bullets=$('li').map((i,e)=>$(e).text().replace(/\s+/g,' ').trim()).get().filter(t=>/\([A-Z]\)\s*=/.test(t));
   const gtin=stdout.match(/GTIN Code[^\d]{0,60}(\d{13})/)?.[1];
   const identityMatch=key(headings).endsWith(key(p.partNo));
   results.push({partNo:p.partNo,url,checkedAt:'2026-10-01',identityMatch,headings,gtin,dimensions:dims,dimensionDescriptions:bullets});
  } catch(e) {results.push({partNo:p.partNo,url,error:String(e.message).slice(0,240)});}
  fs.writeFileSync(out,JSON.stringify(results,null,2)+'\n');
  console.log(results.length,p.partNo,results.at(-1).dimensions?.length??'failed');
 }
}
Promise.all(Array.from({length:4},worker));
