const {spawn}=require('node:child_process');const assert=require('node:assert/strict');const ch=require(process.cwd()+'/node_modules/cheerio');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3010'],{env:{...process.env,DATABASE_URL:'postgresql://audit:audit@127.0.0.1:1/audit?connect_timeout=1',NEXT_TELEMETRY_DISABLED:'1'}});
server.stderr.on('data',d=>process.stderr.write(d));
let ran=false;
server.stdout.on('data',async d=>{if(ran||!d.toString().includes('Ready'))return;ran=true;
try{
const cases=[
['/th/products/BFU%20900%20x',s=>{assert.match(s,/13\.3 mm/);assert.doesNotMatch(s,/5\.24 in/);assert.doesNotMatch(s,/Spin-on/);}],
['/en/products/BFU%20900%20x',s=>{assert.match(s,/13\.3 mm/);assert.doesNotMatch(s,/5\.24 in/);}],
['/th/products/dimensions?category=fuel_filter&od=85&id=13.3&length=145',s=>assert.match(s,/BFU 900 x/)],
['/th/products/dimensions?category=fuel_filter&id=133.096',s=>assert.doesNotMatch(s,/BFU 900 x/)],
['/th/products/dimensions?category=air_oil_separator&od=70&length=200',s=>assert.match(s,/LE5001X/)],
['/th/products/C%2014%20200',s=>{assert.match(s,/DONALDSON/);assert.match(s,/P778984/);}],
['/th/products/P537877',s=>{assert.match(s,/ขนาดสินค้ารอตรวจสอบ/);assert.doesNotMatch(s,/230.*210.*30/);}]
];
for(const [route,verify] of cases){const r=await fetch('http://127.0.0.1:3010'+route);assert.equal(r.status,200,route);const $=ch.load(await r.text());$('script,style').remove();verify($('body').text());console.log('PASS',route);}
}catch(e){console.error(e);process.exitCode=1;}finally{server.kill();}
});
setTimeout(()=>{if(!ran){server.kill();process.exitCode=1;}},15000).unref();
