import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const self=fileURLToPath(import.meta.url);
if(!process.argv[1] || path.resolve(process.argv[1])!==self)throw Error('CLI test harness cannot be imported into application request flow');
const repo=path.resolve(path.dirname(self),'..');
const require=createRequire(import.meta.url);
const flag=name=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
if(!process.argv.includes('--consent-accepted'))throw Error('Explicit accepted marketing consent required');
if(!process.argv.includes('--execute-test-events'))throw Error('Explicit Test Events execution flag required');
const contextFile=flag('context'),output=flag('output');
if(!contextFile || !output || !path.isAbsolute(contextFile) || !path.isAbsolute(output))throw Error('Absolute local context/output files required');
if(fs.existsSync(output))throw Error('Refusing to overwrite Test Events results');
if(fs.existsSync(path.join(repo,'.env.local')))process.loadEnvFile(path.join(repo,'.env.local'));
const config={pixelId:process.env.META_PIXEL_ID,token:process.env.META_CONVERSIONS_API_TOKEN,testCode:process.env.META_TEST_EVENT_CODE};
if(config.pixelId!=='1801250074527984' || config.testCode!=='TEST18610' || !config.token)throw Error('Approved Meta dataset/token/Test Events code required');
const context=JSON.parse(fs.readFileSync(contextFile,'utf8'));
if(context.consent!=='accepted' || !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(context.origin) || Date.now()-context.created_at>15*60000 || context.created_at>Date.now())throw Error('Fresh consented first-party local browser context required');
if(typeof context.user_agent!=='string' || !context.user_agent.startsWith('Mozilla/5.0 ') || context.user_agent.length>512 || /[@\r\n<>]/.test(context.user_agent))throw Error('Invalid browser device data');
if(typeof context.fbp!=='string' || !/^fb\.[0-2]\.\d{13}\.\d{1,20}$/.test(context.fbp))throw Error('Real generated first-party fbp required');
// Never read fbc/fbclid in this harness. The first verification uses UA + fbp only.
const ts=require(path.join(repo,'node_modules/typescript'));
const exports={};
const source=ts.transpileModule(fs.readFileSync(path.join(repo,'lib/analytics/meta-capi.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
vm.runInNewContext(source,{exports,URL,AbortSignal},{filename:'meta-capi.ts'});
const results=[];
for(const event_name of ['PageView','ViewContent','AddToCart','InitiateCheckout','Lead']){
 const event_id='test_meta_'+event_name.toLowerCase()+'_'+randomUUID();
 const event_source_url='https://www.mrtsupplier.com'+(event_name==='PageView'?'/th':event_name==='Lead'||event_name==='InitiateCheckout'?'/th/quote':'/th/products/donaldson-p553000');
 const input={event_name,event_id,event_time:Math.floor(Date.now()/1000),event_source_url,locale:'th',items:event_name==='PageView'?[]:[{product_id:'P553000',quantity:1}],client_user_agent:context.user_agent,fbp:context.fbp};
 let response;
 try{response=await exports.sendMetaCapi(input,config,fetch);}catch{response={http_status:0,events_received:null,messages:[],fbtrace_id:'',error_code:null,error_subcode:null,error_message:'Transport unavailable (no retry)'};}
 const accepted=response.http_status>=200&&response.http_status<300&&response.events_received>=1&&!response.error_code;
 results.push({event_name,event_id,event_source_url,response,accepted,user_data_keys:['client_user_agent','fbp'],direct_pii_findings:0,client_ip_sent:false,fbc_sent:false,test_events_only:true,timestamp_utc:new Date().toISOString()});
 fs.writeFileSync(output,JSON.stringify({results,rfq_records_created:0,application_generate_lead_calls:0,production_eligibility_changed:false,status:accepted&&results.length===5?'PASS':'HOLD'},null,2),{mode:0o600});
 console.log(JSON.stringify({event_name,http_status:response.http_status,events_received:response.events_received,accepted}));
 if(!accepted){process.exitCode=2;break;} // STOP: never add IP/email/phone/external_id or manufacture fbc.
}
