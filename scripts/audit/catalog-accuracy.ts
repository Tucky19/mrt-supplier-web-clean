import fs from "node:fs";
import path from "node:path";
import { products } from "@/data/products/index";
import { getNormalizedDimensions } from "@/lib/search/dimensions";
import { isLinearDimensionLabel } from "@/lib/products/metric";
import { normalizeProductRelations } from "@/lib/products/relations";
import metricEvidence from "@/data/products/mann-metric-2026-10-01.json";

const evidenceKeys = new Set(Object.keys(metricEvidence));
const key = (s:string)=>s.toLowerCase().replace(/[\s/_-]+/g, "");
const rows = products.map(product => {
  const dims = getNormalizedDimensions(product);
  const linearDimensions = Object.entries(dims).filter(([k,v]) => k !== "threadSize" && v !== undefined);
  const relations = normalizeProductRelations(product.crossReferences, "unknown");
  const issues:string[]=[];
  const image = product.imageUrl;
  if (!image || image.includes("placeholder")) issues.push("missing_product_image");
  else if (image.startsWith("/") && !fs.existsSync(path.join(process.cwd(),"public",image))) issues.push("missing_image_file");
  if (!product.officialUrl) issues.push("missing_official_product_url");
  if (!linearDimensions.length) issues.push("no_searchable_linear_dimensions");
  if (product.dimensionReviewRequired) issues.push("conflicting_dimensions_quarantined");
  if (!product.category || product.category === "filter") issues.push("generic_or_missing_category");
  const pendingRefs = relations.filter(r=>r.verificationStatus!=="verified").length;
  if(pendingRefs) issues.push("cross_references_need_verification");
  if(relations.some(r=>!r.brand && !r.partNumber.includes(":"))) issues.push("cross_reference_brand_unspecified");
  if((product.specifications??[]).some(s=>isLinearDimensionLabel(s.label)&&/\b(?:in|inch|inches)\b/.test(String(s.value)))) issues.push("imperial_linear_dimension_unresolved");
  const metricSourceChecked = product.brand === "MANN-FILTER" && evidenceKeys.has(key(product.partNo));
  return {partNo:product.partNo,brand:product.brand,category:product.category,dimensionsMm:dims,metricSourceChecked,
    officialUrl:product.officialUrl??null,imageUrl:image??null,imageVisuallyReverified:false,
    existingDataQuality:product.dataQuality,pendingCrossReferences:pendingRefs,issues,
    verificationScope:metricSourceChecked ? "metric dimensions compared with manufacturer on 2026-10-01; other fields not fully reverified" : "structural audit only; full manufacturer reverification pending"};
});
const count=(predicate:(row:typeof rows[number])=>boolean)=>rows.filter(predicate).length;
const counts:Record<string,number>={};for(const row of rows)for(const issue of row.issues)counts[issue]=(counts[issue]??0)+1;
const summary={total:rows.length,metricSourceChecked:count(r=>r.metricSourceChecked),hasSearchableDimensions:count(r=>Object.values(r.dimensionsMm).some(v=>v!==undefined)),issueCounts:counts};
const dir="docs/catalog-audit-2026-10-01";
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(`${dir}/catalog-audit.json`,JSON.stringify({date:"2026-10-01",scope:"All active runtime products; structural checks are not manufacturer certification",summary,products:rows},null,2)+"\n");
const escape=(s:unknown)=>String(s??"—").replace(/\|/g,"/").replace(/\n/g," ");
fs.writeFileSync(`${dir}/catalog-audit.md`,[
"# MRT Supplier — ตรวจข้อมูลสินค้าและหน่วยมิลลิเมตร (1 ต.ค. 2026)","",
`ตรวจโครงสร้างข้อมูลสินค้าที่ใช้งานจริงครบ ${rows.length} รายการ ตรวจขนาดกับหน้าผู้ผลิต MANN-FILTER ได้ ${summary.metricSourceChecked} รายการ การตรวจโครงสร้างไม่ได้ยืนยันว่าสินค้าทุกรายการถูกต้องจากผู้ผลิตแล้ว`,"",
"## สิ่งที่แก้","",
"- แสดงและค้นหาขนาดเชิงเส้นด้วย mm; รักษาเกลียวและหน่วยความดันตามมาตรฐานเดิม",
"- BFU 900 x: OD 85 / ID 13.3 / H 145 mm; แบบไส้เปลี่ยน",
"- เลิกเติม Spin-on อัตโนมัติเมื่อข้อมูลชนิดไม่ระบุ",
"- เลิกใช้ยี่ห้อสินค้าหลักแทนยี่ห้อที่ไม่ทราบในตาราง Cross Reference",
"- C 14 200 → P778984: ระบุ Donaldson แต่ยังไม่ยืนยันว่าใช้แทนกันได้",
"- ไม่อ่านขนาดกรองสี่เหลี่ยมเป็น ID × OD × Width ของตลับลูกปืน",
"- P537876/P537877: กักขนาดสี่เหลี่ยมเดิมที่ขัดกับชนิด RadialSeal ไว้รอตรวจ ไม่ใช้ค้นหาและไม่เดาขนาดแทน",
"- เพิ่มประเภทสินค้าทั้งหมด ตลับลูกปืน ไส้แยกน้ำมันอากาศ และช่องความกว้าง; หน่วย mm",
"","## ผลตรวจและงานคงเหลือ","",
`- ค้นหาได้จากขนาด/เกลียว: ${summary.hasSearchableDimensions} รายการ`,
...Object.entries(counts).map(([name,n])=>`- ${name}: ${n} รายการ`),
"- ภาพยังไม่ได้เปรียบเทียบกับภาพผู้ผลิตใหม่ทุกรายการ; ตรวจเพียงการมีไฟล์/ภาพ placeholder",
"- Cross Reference ที่ไม่มีหลักฐานยังคงรอตรวจ ไม่เปลี่ยนเป็น verified อัตโนมัติ",
"- รายการที่ไม่มีขนาดต้องเติมจากเอกสารตรงรุ่นก่อนจึงจะค้นหาด้วยขนาดได้ การแปลงหน่วยไม่สามารถเติมข้อมูลที่ไม่มีได้",
"- หน้าผู้ผลิต Donaldson ที่ทดสอบส่ง HTML ตารางสเปกว่าง ต้องใช้ PDF ตรงรุ่นหรืออ่านข้อมูลที่โหลดบนหน้าเว็บเพิ่มเติม",
"","## รายการทั้งหมด","",
"| Part No. | Brand | ขนาดตรวจจาก MANN | ประเด็นรอตรวจ |",
"|---|---|---|---|",
...rows.map(r=>`| ${escape(r.partNo)} | ${escape(r.brand)} | ${r.metricSourceChecked?"ตรวจแล้ว":"—"} | ${escape(r.issues.join(", ")||"ยังต้องตรวจหลักฐานสินค้า/ภาพ") } |`),
"",
].join("\n"));
console.log(JSON.stringify(summary,null,2));
