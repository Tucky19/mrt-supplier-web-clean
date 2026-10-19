import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const loadPackage = createRequire(import.meta.url);
const repo = path.resolve(process.argv[2] ?? process.cwd());
const ts = loadPackage(path.join(repo, "node_modules/typescript"));
const results = [];
function environment(consent = "accepted", id = "LOCAL_ONLY_TRANSPORT_STUB", referrer = "") {
  const commands = [], scripts = [], storage = new Map([["mrt_cookie_consent", consent]]), session = new Map();
  const window = { location: new URL("https://local.example/th"), dataLayer: [] };
  let serial = 0;
  const context = vm.createContext({ window, document: { referrer, createElement: () => ({}), head: { appendChild: s => scripts.push(s) } }, localStorage: { getItem: k => storage.get(k) ?? null }, sessionStorage: { getItem: k => session.get(k) ?? null, setItem: (k,v) => session.set(k,v) }, URL, console, process: { env: { NEXT_PUBLIC_META_PIXEL_ID: id, NEXT_PUBLIC_GA4_ID: "LOCAL_GA_STUB" } } });
  function moduleLoad(file, imports) {
    const exports = {}; context.exports = exports; context.require = s => { if (!(s in imports)) throw Error(s); return imports[s]; };
    new vm.Script('(function(exports,require){'+ts.transpileModule(fs.readFileSync(path.join(repo,file),"utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText+'})(exports,require);', { filename:file }).runInContext(context);
    return exports;
  }
  const contract = moduleLoad("lib/analytics/contract.ts", { "@/data/products/index": {products:[{partNo:"P553000",brand:"Donaldson",category:"Oil Filter"},{partNo:"R000958",brand:"Donaldson",category:"Air Filter"}]}, "@/lib/products/relations":{relationPartNumbers:()=>[]} });
  const meta = moduleLoad("lib/analytics/meta.ts", {"./contract":contract});
  const ga = moduleLoad("lib/analytics/ga.ts", {"./contract":contract,"./meta":meta,"./growth":{anonymousSessionId:()=>undefined,growthEventId:event=>`${event}:00000000-0000-4000-8000-${String(++serial).padStart(12,"0")}`}});
  const nav = route => { window.location = new URL(route,"https://local.example"); meta.metaPageView(route); };
  const ready = () => { if(scripts[0]) { window.fbq.callMethod = (...args) => commands.push(args); scripts[0].onload(); } };
  const tracks = name => commands.filter(c=>c[0]==="trackSingle"&&(!name||c[2]===name));
  return {ga,meta,window,storage,scripts,commands,nav,ready,tracks};
}
function check(name,fn) { fn(); results.push({scenario:name,result:"PASS",duplicate:0,pii_findings:0,lead_false_positive:0}); }
check("missing Pixel env renders/initializes nothing",()=>{const e=environment("accepted","");e.nav("/th");assert.equal(e.scripts.length,0);});
for(const consent of ["", "rejected"]) check(`consent ${consent||"not chosen"}: zero SDK/event`,()=>{const e=environment(consent);e.nav("/th");e.ga.gaViewItem({item_id:"P553000"});assert.equal(e.scripts.length,0);assert.equal(e.tracks().length,0);});
check("accept consent initializes exactly once and tracks current route",()=>{const e=environment("");e.nav("/th");e.storage.set("mrt_cookie_consent","accepted");e.meta.syncMetaConsent();e.ready();e.meta.syncMetaConsent();assert.equal(e.commands.filter(c=>c[0]==="init").length,1);assert.equal(e.tracks("PageView").length,1);assert.equal(e.window.fbq.disablePushState,true);assert(e.commands.some(c=>c[0]==="set"&&c[1]==="autoConfig"&&c[2]===false));});
check("six SPA navigations: six PageViews",()=>{const e=environment();e.nav("/th");e.ready();for(const r of ["/th/products","/th/products/P553000","/th/quote","/en","/en/products"])e.nav(r);assert.equal(e.tracks("PageView").length,6);assert.equal(e.scripts.length,1);});
check("StrictMode replay and same route rerender",()=>{const e=environment();e.nav("/th");e.nav("/th");e.ready();e.nav("/th");assert.equal(e.tracks("PageView").length,1);});
check("back/forward sends one per actual transition",()=>{const e=environment();e.nav("/th");e.ready();for(const r of ["/th/products","/th","/th/products"])e.nav(r);assert.equal(e.tracks("PageView").length,4);});
check("revoke drops pending events before SDK load",()=>{const e=environment();e.nav("/th");e.storage.set("mrt_cookie_consent","rejected");e.meta.syncMetaConsent();e.ready();assert.equal(e.tracks().length,0);assert.equal(e.commands.filter(c=>c[0]==="init").length,0);e.storage.set("mrt_cookie_consent","accepted");e.meta.syncMetaConsent();assert.equal(e.tracks("PageView").length,1);});
check("rejected after initialization stops business events",()=>{const e=environment();e.nav("/th");e.ready();e.storage.set("mrt_cookie_consent","rejected");e.meta.syncMetaConsent();e.ga.gaAddToQuote({item_id:"P553000"});assert.equal(e.tracks("AddToCart").length,0);assert(e.commands.some(c=>c[0]==="consent"&&c[1]==="revoke"));});
check("adblock failure preserves GA business dispatch",()=>{const e=environment();e.nav("/th");e.scripts[0].onerror();e.ga.gaViewItem({item_id:"P553000"});assert.equal(e.tracks().length,0);assert(e.window.dataLayer.some(x=>x[1]==="view_item"));});
check("ViewContent/AddToCart/InitiateCheckout reuse GA definitions",()=>{const e=environment();e.nav("/th/products/P553000");e.ready();const item={item_id:"P553000",quantity:2,item_name:"private@example.invalid"};e.ga.gaViewItem(item);e.ga.gaAddToQuote(item);e.ga.gaBeginCheckout([item]);for(const n of ["ViewContent","AddToCart","InitiateCheckout"])assert.equal(e.tracks(n).length,1);assert(!JSON.stringify(e.commands).includes("private@"));});
check("Search public Part only; free text omitted",()=>{const e=environment();e.nav("/th");e.ready();e.ga.gaSearch("P553000");e.ga.gaSearch("private@example.invalid");assert.equal(e.tracks("Search").length,1);});
check("successful RFQ boundary maps one Lead in transport stub only",()=>{const e=environment();e.nav("/th/quote");e.ready();e.ga.gaSubmitRFQ([{item_id:"P553000"}],{request_id:"RFQ-20261020-ABCDEF"});e.ga.gaSubmitRFQ([{item_id:"P553000"}],{request_id:"RFQ-20261020-ABCDEF"});assert.equal(e.tracks("Lead").length,1);assert(!JSON.stringify(e.tracks()).includes("RFQ-"));});
check("no Lead for invalid, synthetic, LINE, form or generic event",()=>{const e=environment();e.nav("/th/quote");e.ready();for(const id of [undefined,"OK","MPR-20261020-ABCDEF","RFQ-20261020-TEST"])e.ga.gaSubmitRFQ([],{request_id:id});e.ga.gaEvent("generate_lead",{request_id:"RFQ-20261020-ABCDEF"});e.ga.gaLineClick({source:"quote_page"});e.ga.gaEvent("form_start",{});assert.equal(e.tracks("Lead").length,0);});
check("unsafe URL query/hash/private path never loads SDK",()=>{for(const r of ["/th/products?q=private@example.invalid","/th#private","/admin/rfq"]){const e=environment();e.nav(r);assert.equal(e.scripts.length,0);}});
check("unsafe referrer never loads SDK",()=>{const e=environment("accepted","LOCAL_ONLY_TRANSPORT_STUB","https://local.example/th?email=private@example.invalid");e.nav("/th");assert.equal(e.scripts.length,0);});
check("Meta payload whitelist rejects customer fields",()=>{const e=environment();e.nav("/th");e.ready();e.ga.gaViewItem({item_id:"P553000"},{name:"private name",email:"private@example.invalid",phone:"0812345678",company:"Private Co",notes:"private note",line_id:"private-line",address:"private address"});assert(!/private|0812345678/i.test(JSON.stringify(e.tracks())));});
const report={results,summary:{cases:results.length,duplicate:0,pii_findings:0,lead_false_positive:0},limitations:"Actual TS helpers with catalog fixtures and no-network SDK stub. LOCAL_ONLY_TRANSPORT_STUB is a non-ID sentinel, never a configured/fabricated advertising Pixel. No real RFQ created, no Meta delivery claim."};
if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary));
