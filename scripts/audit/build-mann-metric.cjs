const fs=require('fs'); const results=[...JSON.parse(fs.readFileSync('docs/catalog-audit-2026-10-01/mann-source-evidence.json')),...JSON.parse(fs.readFileSync('docs/catalog-audit-2026-10-01/mann-additional-source-evidence.json'))];
const patches={};
for(const e of results){
 if(!e.identityMatch || !e.dimensionDescriptions?.length)continue;
 const dims=[];
 for(const desc of e.dimensionDescriptions){
  for(const m of desc.matchAll(/([^;=]+)\s*=\s*([^;]+)/g)){
   const label=m[1].trim(),value=m[2].trim().replace(/(\d),(\d)/g,'$1.$2');
   if(!/diameter|height|length|width|thread/i.test(label))continue;
   if(!/thread/i.test(label)&&!/^\d+(?:\.\d+)? mm$/.test(value))continue;
   if(!dims.some(d=>d.label===label))dims.push({label,value});
  }
 }
 if(!dims.length)continue;
 patches[e.partNo.replace(/[\s/_-]+/g,'').toLowerCase()]={partNo:e.partNo,source:e.url,checkedAt:e.checkedAt,dimensions:dims};
}
fs.writeFileSync('data/products/mann-metric-2026-10-01.json',JSON.stringify(patches,null,2)+'\n');console.log(Object.keys(patches).length);
