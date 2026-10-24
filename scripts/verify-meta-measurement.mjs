import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {randomUUID, webcrypto} from 'node:crypto';
const repo=path.resolve(process.argv[2]??process.cwd());
const loadPackage=createRequire(import.meta.url);
const ts=loadPackage(path.join(repo,'node_modules/typescript'));
const rows=[],outbound=[];
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36';
// Official documentation example. Fixtures are VM/mock-only and never sent to Meta.
const CLICK='IwAR2F4-dbP0l7Mn1IawQQGCINEz7PYXQvwjNwB_qa2ofrHyiLjcbCRxTDMgk';
const fixtures=[{partNo:'P553000',brand:'Donaldson',category:'Oil Filter'},{partNo:'R000958',brand:'Donaldson',category:'Air Filter'}];
const SECRET='LOCAL_ONLY_HMAC_TRANSPORT_TEST_NOT_A_REAL_TOKEN';
function environment(consent='accepted',referrer='') {
 const calls=[],storage=new Map([['mrt_cookie_consent',consent]]),session=new Map();
 let cookie='',cookieReads=0,uaReads=0,serial=0;
 const document={referrer,get cookie(){cookieReads++;return cookie;},set cookie(value){const pair=value.split(";")[0];const name=pair.split("=")[0];cookie=cookie.split(";").filter(x=>x.trim()&&!x.trim().startsWith(name+"=")).join(";");if(!/Max-Age=0(?:;|$)/.test(value))cookie+=(cookie?";":"")+pair;}};
 const window={location:new URL('https://local.example/th'),dataLayer:[]};
 const context=vm.createContext({window,document,localStorage:{getItem:k=>storage.get(k)??null},sessionStorage:{getItem:k=>session.get(k)??null,setItem:(k,v)=>session.set(k,v)},crypto:{randomUUID,getRandomValues:value=>webcrypto.getRandomValues(value)},URL,console,process:{env:{NEXT_PUBLIC_GA4_ID:'LOCAL_GA_STUB'}},fetch:(url,options)=>{calls.push({url,options,body:JSON.parse(options.body)});return Promise.resolve(new Response(null,{status:204}));}});
 const modules=new Map();
 function moduleLoad(file) {
  if(modules.has(file))return modules.get(file);
  const exports={};modules.set(file,exports);
  const imports=specifier=>{
   if(specifier==='node:crypto')return loadPackage('node:crypto');
   if(specifier==='@/data/products/index')return {products:fixtures};
   if(specifier==='@/lib/products/relations')return {relationPartNumbers:()=>[]};
   if(specifier==='./growth')return {anonymousSessionId:()=>undefined,growthEventId:event=>`${event}:00000000-0000-4000-8000-${String(++serial).padStart(12,'0')}`};
   if(specifier.startsWith('./'))return moduleLoad(path.posix.join(path.posix.dirname(file),specifier+'.ts'));
   throw Error('Unexpected import '+specifier);
  };
  context.exports=exports;context.require=imports;
  const js=ts.transpileModule(fs.readFileSync(path.join(repo,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  new vm.Script('(function(exports,require){'+js+'})(exports,require);',{filename:file}).runInContext(context);
  return exports;
 }
 const meta=moduleLoad('lib/analytics/meta.ts'),ga=moduleLoad('lib/analytics/ga.ts');
 const nav=route=>{window.location=new URL(route,'https://local.example');meta.metaPageView(route);};
 return {meta,ga,nav,calls,storage,window,moduleLoad,setCookie:value=>cookie=value,reads:()=>({cookieReads,uaReads}),cookieState:()=>cookie};
}
function serverEnvironment({missing=false,reject=false}={}){
 const context=vm.createContext({Response,Request,URL,TextDecoder,AbortSignal,Buffer,Date,process:{env:{}},console});
 const modules=new Map();
 function moduleLoad(file){
  if(modules.has(file))return modules.get(file);
  const exports={};modules.set(file,exports);context.exports=exports;
  context.require=specifier=>specifier==='node:crypto'?loadPackage(specifier):specifier==='@/data/products/index'?{products:fixtures}:moduleLoad(path.posix.join(path.posix.dirname(file),specifier+'.ts'));
  const js=ts.transpileModule(fs.readFileSync(path.join(repo,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  new vm.Script('(function(exports,require){'+js+'})(exports,require);',{filename:file}).runInContext(context);return exports;
 }
 const requests=[];
 const handler=moduleLoad('lib/analytics/meta-server.ts').createMetaHandler({config:()=>missing?{}:{pixelId:'0',token:SECRET,testCode:'LOCAL_ONLY_TEST_EVENTS'},fetch:async(url,options)=>{
  const payload=JSON.parse(options.body);requests.push({url,options,payload});outbound.push(payload);
  return Response.json(reject?{error:{code:100,message:'client_ip_address required'}}:{events_received:1},{status:reject?400:200});
 }});
 const post=(body,overrides={})=>handler(new Request('https://local.example/api/analytics/meta',{method:'POST',headers:{origin:'https://local.example','content-type':'application/json','user-agent':UA,...overrides},body:typeof body==='string'?body:JSON.stringify(body)}));
 const receipt=id=>moduleLoad('lib/analytics/meta-lead.ts').issueMetaLeadReceipt(id,SECRET);
 return {post,requests,receipt,moduleLoad};
}
async function test(scenario,fn){await fn();rows.push({scenario,result:'PASS'});}
function cleanBody(e){return JSON.parse(JSON.stringify(e.calls[0].body));}
function assertPrivateAbsent(payload){const text=JSON.stringify(payload);assert(!/person@|0812345678|private-note|Private Company|line-private|secret-password|utm_|fbclid|page_referrer|client_ip_address|authorization|request_id|RFQ-/i.test(text));}
const matrix=[['clean','/th',''],['UTM','/th?utm_source=facebook',''],['fbclid','/th?fbclid='+CLICK,''],['UTM+fbclid','/th?utm_source=facebook&fbclid='+CLICK,''],['hash','/th#detail',''],['UTM+hash','/th?utm_source=facebook#detail',''],['Facebook referrer','/th','https://www.facebook.com/private-note?email=person@example.invalid'],['Facebook link referrer','/th','https://l.facebook.com/l.php?u=person@example.invalid'],['Instagram referrer','/th','https://www.instagram.com/private-note'],['Arbitrary external referrer','/th','https://example.org/private-note?phone=0812345678'],['email query','/th?email=person@example.invalid',''],['phone query','/th?phone=0812345678',''],['free-text search','/th/products?q=private-note','']];
const urlMatrix=[];
for(const [scenario,route,referrer]of matrix)await test(scenario,async()=>{
 const e=environment('accepted',referrer);e.nav(route);assert.equal(e.calls.length,1);const call=e.calls[0];
 assert.equal(call.url,'/api/analytics/meta');assert.equal(call.options.credentials,'omit');assert.equal(call.options.referrerPolicy,'no-referrer');assert.equal(call.options.keepalive,true);
 assert.equal(call.body.event_source_url,'https://local.example'+new URL(route,'https://local.example').pathname);assertPrivateAbsent(call.body);
 const s=serverEnvironment();assert.equal((await s.post(call.body)).status,200);assert.equal(s.requests.length,1);assertPrivateAbsent(s.requests[0].payload);
 const event=s.requests[0].payload.data[0];assert.equal(event.user_data.client_user_agent,UA);assert.equal(event.event_source_url,'https://www.mrtsupplier.com'+new URL(route,'https://local.example').pathname);
 assert.equal(Object.keys(event.user_data).includes('client_ip_address'),false);
 urlMatrix.push({scenario,event_count:1,direct_pii:0,fbp:!!event.user_data.fbp,fbc:!!event.user_data.fbc,url:event.event_source_url});
});
for(const choice of ['', 'rejected'])await test('consent '+(choice||'unchosen'),()=>{const e=environment(choice);e.setCookie('_fbp=private-note');e.nav('/th?fbclid='+CLICK);e.ga.gaViewItem({item_id:'P553000'});assert.equal(e.calls.length,0);assert.equal(e.reads().cookieReads,0);});
await test('accept sends current page only; no historical events',()=>{const e=environment('');e.nav('/th');e.nav('/th/products');e.ga.gaViewItem({item_id:'P553000'});e.storage.set('mrt_cookie_consent','accepted');e.meta.syncMetaConsent();assert.equal(e.calls.length,1);assert.equal(e.calls[0].body.event_source_url,'https://local.example/th/products');});
await test('StrictMode/same URL/query/hash rerender duplicate zero',()=>{const e=environment();e.nav('/th');e.nav('/th');e.nav('/th?utm_source=facebook');e.nav('/th#detail');assert.equal(e.calls.length,1);});
await test('six navigations yield exactly six PageViews',()=>{const e=environment();for(const r of ['/th','/th/products','/th/products/P553000','/th/quote','/en','/en/products'])e.nav(r);assert.equal(e.calls.length,6);});
await test('back-forward counts one per transition',()=>{const e=environment();for(const r of ['/th','/th/products','/th','/th/products'])e.nav(r);assert.equal(e.calls.length,4);});
await test('revoke blocks requests, clears ephemeral click identity',()=>{const e=environment();e.nav('/th?fbclid='+CLICK);e.storage.set('mrt_cookie_consent','rejected');e.meta.syncMetaConsent();e.nav('/th/products');e.ga.gaViewItem({item_id:'P553000'});assert.equal(e.calls.length,1);e.storage.set('mrt_cookie_consent','accepted');e.meta.syncMetaConsent();assert.equal(e.calls.length,2);assert.equal(e.calls[1].body.fbc,undefined);});
await test('cookie identifiers read only after accept; generated random first-party fbp',async()=>{const e=environment();const now=Date.now();e.setCookie(`_fbp=fb.1.${now}.1234567890; _fbc=fb.1.${now}.${CLICK}`);e.nav('/th');const s=serverEnvironment();await s.post(e.calls[0].body);const u=s.requests[0].payload.data[0].user_data;assert(u.fbp&&u.fbc);assertPrivateAbsent(s.requests[0].payload);const other=environment();other.nav('/th');assert(/^fb\.1\.\d{13}\.\d+$/.test(other.calls[0].body.fbp));});
await test('malformed cookie/PII fbclid omitted while event still fires',()=>{const e=environment();e.setCookie('_fbp=person@example.invalid; _fbc=0812345678');e.nav('/th?fbclid=person@example.invalid');assert.equal(e.calls.length,1);assert(/^fb\.1\.\d{13}\.\d+$/.test(e.calls[0].body.fbp));assert.equal(e.calls[0].body.fbc,undefined);assertPrivateAbsent(e.calls[0].body);});
await test('ViewContent AddToCart InitiateCheckout reuse shared GA dispatcher',async()=>{const e=environment();e.nav('/th/products/P553000');const item={item_id:'P553000',quantity:2,item_name:'person@example.invalid'};e.ga.gaViewItem(item);e.ga.gaAddToQuote(item);e.ga.gaBeginCheckout([item]);assert.deepEqual(e.calls.map(x=>x.body.event_name),['PageView','ViewContent','AddToCart','InitiateCheckout']);const s=serverEnvironment();for(const c of e.calls)assert.equal((await s.post(c.body)).status,200);for(const p of s.requests)assertPrivateAbsent(p.payload);});
await test('private item/extra params never reach client Meta payload',()=>{const e=environment();e.nav('/th');e.ga.gaViewItem({item_id:'P553000'},{email:'person@example.invalid',notes:'private-note',company:'Private Company',phone:'0812345678'});e.ga.gaSearch('person@example.invalid');assert.equal(e.calls.length,2);for(const c of e.calls)assertPrivateAbsent(c.body);});
await test('legitimate RFQ signed receipt; one non-identifying Lead',async()=>{const e=environment();e.nav('/th/quote');const s=serverEnvironment(),receipt=s.receipt('RFQ-20261020-ABCD');assert(receipt);e.ga.gaSubmitRFQ([{item_id:'P553000'}],{request_id:'RFQ-20261020-ABCD'},receipt);e.ga.gaSubmitRFQ([{item_id:'P553000'}],{request_id:'RFQ-20261020-ABCD'},receipt);const leads=e.calls.filter(c=>c.body.event_name==='Lead');assert.equal(leads.length,1);assert.equal((await s.post(leads[0].body)).status,200);assertPrivateAbsent(s.requests[0].payload);assert(!JSON.stringify(s.requests[0].payload).includes(receipt));});
await test('invalid/synthetic/generic/LINE/no receipt cannot create Lead',()=>{const e=environment();e.nav('/th/quote');for(const id of [undefined,'OK','MPR-20261020-ABCD','RFQ-20261020-TEST','RFQ-20261020-ABCD'])e.ga.gaSubmitRFQ([],{request_id:id});e.ga.gaEvent('generate_lead',{request_id:'RFQ-20261020-ABCD'});e.ga.gaLineClick({source:'quote_page'});assert.equal(e.calls.filter(c=>c.body.event_name==='Lead').length,0);});
await test('forged expired wrong-event receipt rejected server-side',async()=>{const e=environment();e.nav('/th/quote');const s=serverEnvironment(),receipt=s.receipt('RFQ-20261020-ABCD');e.ga.gaSubmitRFQ([],{request_id:'RFQ-20261020-ABCD'},receipt);const body=e.calls.find(c=>c.body.event_name==='Lead').body;body.lead_receipt=body.lead_receipt.slice(0,-1)+(body.lead_receipt.endsWith('a')?'b':'a');assert.equal((await s.post(body)).status,403);assert.equal(s.requests.length,0);const mod=s.moduleLoad('lib/analytics/meta-lead.ts');assert.equal(mod.issueMetaLeadReceipt('RFQ-20261020-TEST',SECRET),undefined);assert.equal(mod.verifyMetaLeadReceipt(receipt,body.event_id,SECRET,Date.now()+600000),false);assert.equal(mod.verifyMetaLeadReceipt(receipt,'meta_lead:'+'0'.repeat(64),SECRET),false);});
await test('server deduplicates same event ID',async()=>{const e=environment();e.nav('/th');const s=serverEnvironment();await s.post(e.calls[0].body);await s.post(e.calls[0].body);assert.equal(s.requests.length,1);});
await test('missing credentials or Test Events code yields no outbound',async()=>{const e=environment();e.nav('/th');const s=serverEnvironment({missing:true});assert.equal((await s.post(e.calls[0].body)).status,204);assert.equal(s.requests.length,0);});
await test('API rejects IP requirement: halt, never add IP/retry',async()=>{const e=environment();e.nav('/th');const s=serverEnvironment({reject:true});assert.equal((await s.post(e.calls[0].body)).status,502);assert.equal((await s.post(e.calls[0].body)).status,503);assert.equal(s.requests.length,1);assertPrivateAbsent(s.requests[0].payload);});
for(const [scenario,mutate]of [
 ['unknown event',b=>b.event_name='Search'],['extra email',b=>b.email='person@example.invalid'],['nested injection',b=>b.user_data={client_ip_address:'127.0.0.1'}],
 ['raw query',b=>b.event_source_url+='?email=person@example.invalid'],['raw hash',b=>b.event_source_url+='#detail'],['wrong type',b=>b.event_time='yesterday'],
 ['wrong consent',b=>b.consent='rejected'],['raw referrer',b=>b.page_referrer='https://facebook.com/private-note'],['unknown product',b=>{b.event_name='ViewContent';b.items=[{product_id:'person@example.invalid',quantity:1}];}],
 ['nested product fields',b=>{b.items=[{product_id:'P553000',quantity:1,email:'person@example.invalid'}];}],['invalid event ID',b=>b.event_id='RFQ-20261020-ABCD'],
 ['invalid advertising cookie',b=>b.fbp='private-note'],['locale mismatch',b=>b.locale='en'],['arbitrary private path',b=>b.event_source_url='https://local.example/admin/rfq']
])await test('reject '+scenario,async()=>{const e=environment();e.nav('/th');const body=cleanBody(e);mutate(body);const s=serverEnvironment();assert.equal((await s.post(body)).status,400);assert.equal(s.requests.length,0);});
await test('oversized stream without Content-Length rejected',async()=>{const s=serverEnvironment();assert.equal((await s.post('x'.repeat(9000))).status,413);assert.equal(s.requests.length,0);});
await test('cross-origin and invalid content type rejected',async()=>{const e=environment();e.nav('/th');const s=serverEnvironment();assert.equal((await s.post(e.calls[0].body,{origin:'https://external.example'})).status,403);assert.equal((await s.post(e.calls[0].body,{'content-type':'text/plain'})).status,415);assert.equal(s.requests.length,0);});
await test('malicious UA rejected and never forwarded',async()=>{const e=environment();e.nav('/th');const s=serverEnvironment();assert.equal((await s.post(e.calls[0].body,{'user-agent':UA+' person@example.invalid'})).status,400);assert.equal(s.requests.length,0);});
await test('incoming cookies auth IP and referrer headers never forwarded',async()=>{const e=environment();e.nav('/th');const s=serverEnvironment();await s.post(e.calls[0].body,{cookie:'private-note',authorization:'Bearer secret-password',referer:'https://facebook.com/?email=person@example.invalid','x-forwarded-for':'192.0.2.1'});const r=s.requests[0];assertPrivateAbsent(r.payload);assert.deepEqual(Object.keys(r.options.headers).sort(),['Authorization','Content-Type']);assert.equal(r.options.headers.Authorization,'Bearer '+SECRET);assert.equal(JSON.stringify(r.payload).includes('192.0.2.1'),false);});
await test('RFQ success query sanitized; server receipt stays outside GA payload',()=>{const e=environment();e.nav('/th/quote/success?rid=RFQ-20261020-ABCD');assert.equal(e.calls[0].body.event_source_url,'https://local.example/th/quote/success');const s=serverEnvironment();const receipt=s.receipt('RFQ-20261020-ABCD');e.ga.gaSubmitRFQ([],{request_id:'RFQ-20261020-ABCD'},receipt);assert.equal(JSON.stringify(e.window.dataLayer).includes(receipt),false);});
await test('global per-instance rate bound',async()=>{const e=environment();e.nav('/th');const s=serverEnvironment({missing:true});let response;for(let i=0;i<121;i++)response=await s.post(e.calls[0].body);assert.equal(response.status,429);});
await test('SDK/fbq/direct browser Meta absent',()=>{const code=fs.readFileSync(path.join(repo,'lib/analytics/meta.ts'),'utf8');assert(!/fbq|fbevents|connect\.facebook|graph\.facebook|facebook\.com\/tr/.test(code));assert(!/NEXT_PUBLIC_META/.test(code));});
await test('first-party fbp created after consent only; stable across route changes',()=>{const e=environment('');e.nav('/th');assert.equal(e.cookieState(),'');e.storage.set('mrt_cookie_consent','accepted');e.meta.syncMetaConsent();const fbp=e.calls[0].body.fbp;assert(/^fb\.1\.\d{13}\.\d+$/.test(fbp));assert(e.cookieState().includes('_fbp='+fbp));e.nav('/th/products');assert.equal(e.calls[1].body.fbp,fbp);});
await test('reject removes first-party fbp and new acceptance creates new random ID',()=>{const e=environment();e.nav('/th');const before=e.calls[0].body.fbp;e.storage.set('mrt_cookie_consent','rejected');e.meta.syncMetaConsent();assert.equal(e.cookieState(),'');e.nav('/en');assert.equal(e.calls.length,1);e.storage.set('mrt_cookie_consent','accepted');e.meta.syncMetaConsent();assert.notEqual(e.calls[1].body.fbp,before);});
await test('public API rejects CLI test_meta IDs; no Lead bypass',async()=>{const e=environment();e.nav('/th');const body=cleanBody(e);body.event_id='test_meta_pageview_'+randomUUID();const s=serverEnvironment();assert.equal((await s.post(body)).status,400);assert.equal(s.requests.length,0);});
for(const payload of outbound)assertPrivateAbsent(payload);
const report={summary:{cases:rows.length,direct_pii:0,duplicate:0,lead_false_positive:0,client_ip_sent:false,raw_referrer_sent:false,query_hash_sent:false,real_meta_requests:0},rows,urlMatrix,limitations:['All server fetches mocked. No real Pixel ID/token/test code or RFQ; fixture pixel 0 and HMAC secret never used for live network.','UA-only Meta acceptance and fbp/fbc matching not verified.','Client IP never forwarded; API 4xx halts per instance without privacy expansion.']};
if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary));
