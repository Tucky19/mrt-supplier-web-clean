import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {AsyncLocalStorage} from 'node:async_hooks';
const loadPackage=createRequire(import.meta.url);
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const repo=process.argv[2]??path.join(__dirname,'..'), mode=process.argv[3]??'patched', output=process.argv[4];
const ts=loadPackage(path.join(repo,'node_modules/typescript'));
globalThis.AsyncLocalStorage=AsyncLocalStorage;
function environment(consent='accepted',boot=true,gaId='G-LOCAL-MOCK'){
 const queue=[],effects=[],refs=[],dependencies=[];let cursor=0;
 const win={location:{origin:'https://local.example',href:'https://local.example/th'},dataLayer:queue};
 const storage=new Map([['mrt_cookie_consent',consent]]);
 const context=vm.createContext({window:win,document:{referrer:'https://ref.example/private/person@example.invalid?email=person@example.invalid',title:'private person@example.invalid'},localStorage:{getItem:k=>storage.get(k)??null},URL,process:{env:{NEXT_PUBLIC_GA4_ID:gaId}},console});
 const source=file=>fs.readFileSync(path.join(repo,file),'utf8');
 function moduleLoad(file,imports){const exports={};const js=ts.transpileModule(source(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;context.exports=exports;context.require=s=>{if(!(s in imports))throw Error('Unexpected import '+s);return imports[s];};new vm.Script(js,{filename:file}).runInContext(context);return exports;}
 const ga=moduleLoad('lib/analytics/ga.ts',{'./contract':{safeEventParams:p=>p,safeId:v=>v},'./meta':{dispatchMetaBusinessEvent:()=>false},'./growth':{anonymousSessionId:()=>undefined,growthEventId:()=>undefined}});
 let pathname='/th',query='';
 const component=moduleLoad('components/analytics/GA4PageView.tsx',{'next/navigation':{usePathname:()=>pathname,useSearchParams:()=>new URLSearchParams(query)},react:{useMemo:f=>f(),useRef:initial=>{const i=cursor++;return refs[i]??(refs[i]={current:initial});},useEffect:(f,deps)=>{const i=cursor++;if(!dependencies[i]||deps.some((v,n)=>v!==dependencies[i][n])){effects.push(f);dependencies[i]=deps;}}},'@/lib/analytics/ga':ga}).default;
 if(boot){const gtm=source('components/analytics/GTM.tsx').match(/__html:\s*`([\s\S]*?)`/)[1];new vm.Script(gtm).runInContext(context);}
 function init(){let script=source('components/analytics/GA4.tsx').match(/<Script id="ga4-init"[\s\S]*?\{`([\s\S]*?)`\}/)[1];script=script.replaceAll('${GA_ID}',gaId);new vm.Script(script).runInContext(context);}
 const commands=()=>queue.map(x=>Array.from(x));
 function nav(url,replay=false){const u=new URL(url,win.location.origin);win.location.href=u.href;pathname=u.pathname;query=u.search.slice(1);cursor=0;effects.length=0;component();for(const f of effects){f();if(replay)f();}}
 function consentUpdate(choice) {
   const js=ts.transpileModule(source('components/privacy/CookieConsent.tsx'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
   context.exports={};context.require=()=>({});
   const update=new vm.Script('(function(){'+js+';return updateGoogleConsent;})()').runInContext(context);
   update(choice);
 }
 return {ga,win,queue,commands,nav,init,consentUpdate};
}
const results=[];
function run(name,steps,consent='accepted',boot=true,gaId='G-LOCAL-MOCK'){
 const e=environment(consent,boot,gaId);if(boot)e.init();
 for(const step of steps){const before=e.commands().length;e.nav(step.url,step.replay);const commands=e.commands().slice(before);const pv=commands.filter(x=>x[0]==='event'&&x[1]==='page_view');const configs=commands.filter(x=>x[0]==='config');const params=pv.map(x=>x[2]);
 const unsafe=params.filter(p=>/person@|customer@|email=|secret|PRIVATE|private\//i.test(JSON.stringify(p))).length;
 const lastConsent=e.commands().filter(x=>x[0]==='consent').at(-1)?.[2]?.analytics_storage;
 results.push({scenario:name,route:step.url,consent,explicit_page_view_count:pv.length,config_side_effect_calls:configs.length,expected:gaId?1:0,duplicate_count:Math.max(0,pv.length-(gaId?1:0)),payload:JSON.stringify(params),pii_findings:unsafe,consent_state:lastConsent??'not bootstrapped',mode});
 if(mode==='patched'){assert.equal(pv.length,gaId?1:0,name+': event count');assert.equal(configs.length,0,name+': no config side effect');assert.equal(unsafe,0);if(boot)assert.equal(lastConsent,consent==='accepted'?'granted':'denied');}
 }
 return e;
}
run('initial /th',[{url:'/th'}]);
run('SPA chain',[{url:'/th'},{url:'/th/products/P553000'},{url:'/th/quote'}]);
run('back/forward',[{url:'/th/products/P553000'},{url:'/th/quote'},{url:'/th/products/P553000'},{url:'/th/quote'}]);
run('direct /en',[{url:'/en'}]);
run('rejected consent',[{url:'/th'},{url:'/th/products/P553000'}],'rejected');
run('accepted consent',[{url:'/th'},{url:'/th/products/P553000'}],'accepted');
run('StrictMode effect replay',[{url:'/th',replay:true},{url:'/th/products/P553000',replay:true}]);
run('different products same sanitized section',[{url:'/en/products/P553000'},{url:'/en/products/P550520'}]);
run('sanitized query/hash/path',[{url:'/th/products/customer@example.invalid?email=person@example.invalid#secret'}]);
run('missing gtag bootstrap',[{url:'/th'}],'accepted',false);
run('GA disabled',[{url:'/th'}],'accepted',true,'');
// Same URL rerender must not emit again. Navigation away/back must still emit.
const stable=run('same URL stable',[{url:'/th'}]);const prior=stable.commands().length;stable.nav('/th');assert.equal(stable.commands().length,prior);
// Consent update uses the unchanged actual CookieConsent updater, not a replacement rule.
if(mode==='patched'){
 const consent=run('consent transition initial denied',[{url:'/th'}],'rejected');
 const count=()=>consent.commands().filter(x=>x[0]==='event'&&x[1]==='page_view').length;
 consent.consentUpdate('accepted');consent.nav('/th');assert.equal(count(),1);
 const granted=consent.commands().filter(x=>x[0]==='consent').at(-1)[2];assert.equal(granted.analytics_storage,'granted');
 consent.nav('/th/products/P553000');assert.equal(count(),2);
 consent.consentUpdate('rejected');consent.nav('/th/quote');assert.equal(count(),3);
 assert.equal(consent.commands().filter(x=>x[0]==='consent').at(-1)[2].analytics_storage,'denied');
 results.push({scenario:'consent accept/reject transition',route:'/th -> /th/products/P553000 -> /th/quote',consent:'denied -> granted -> denied',explicit_page_view_count:3,config_side_effect_calls:0,expected:3,duplicate_count:0,payload:'Consent-only same-URL update emits0 extra page_view; subsequent navigation emits1',pii_findings:0,consent_state:'denied',mode});
}
// Read actual proxy matcher config through Next's own testing helper where available.
const proxySource=fs.readFileSync(path.join(repo,'proxy.ts'),'utf8');const matchers=Array.from(proxySource.match(/matcher:\s*\[([\s\S]*?)\]/)[1].matchAll(/"((?:\\.|[^"\\])*)"/g),m=>JSON.parse('"'+m[1]+'"'));
const {unstable_doesMiddlewareMatch:unstable_doesProxyMatch}=loadPackage(path.join(repo,'node_modules/next/experimental/testing/server'));
const known=['/en/products/FCR55-17-8.9.10.11%2F2E','/en/products/FCR54-10.46.58%2F2E','/en/products/FCR54-13.19.47.48%2F2E'];
const matcherResults=[...known,'/th/products/P553000','/favicon.ico','/_next/static/test.js','/api/admin/rfqs'].map(url=>({url,matches:unstable_doesProxyMatch({config:{matcher:matchers},url:'https://local.example'+url})}));
if(mode==='patched'){for(const r of matcherResults.slice(0,4))assert.equal(r.matches,true);assert.equal(matcherResults[4].matches,false);assert.equal(matcherResults[5].matches,false);assert.equal(matcherResults[6].matches,true);}
const report={mode,results,matcherResults,summary:{rows:results.length,explicit_page_views:results.reduce((s,r)=>s+r.explicit_page_view_count,0),duplicate_count:results.reduce((s,r)=>s+r.duplicate_count,0),pii_findings:results.reduce((s,r)=>s+r.pii_findings,0)},limitations:'Controlled gtag queue/React hook harness; no external SDK, GTM container, Google network delivery or actual GA4 receipt. Existing advanced-consent denied queue behavior preserved; no storage/cookie SDK simulation.'};
if(output)fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify({mode,summary:report.summary,matcherResults}));
