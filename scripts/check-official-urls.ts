import { products } from "../data/products/index";

const missing: string[] = [];
const suspicious: string[] = [];

for (const p of products) {
  const url = p.officialUrl;

  if (!url) {
    missing.push(`${p.partNo} | ไม่มี officialUrl`);
    continue;
  }

  if (!url.includes(p.partNo)) {
    suspicious.push(`${p.partNo} | officialUrl อาจไม่ตรง: ${url}`);
  }
}

console.log("=== Official URL Check ===");

if (missing.length) {
  console.log(`\n❌ ไม่มี officialUrl ${missing.length} รายการ`);
  console.log(missing.join("\n"));
}

if (suspicious.length) {
  console.log(`\n⚠️ URL ไม่พบ partNo ในลิงก์ ${suspicious.length} รายการ`);
  console.log(suspicious.join("\n"));
}

if (!missing.length && !suspicious.length) {
  console.log("✅ officialUrl ครบ และ partNo ตรงใน URL ทุกตัว");
}
