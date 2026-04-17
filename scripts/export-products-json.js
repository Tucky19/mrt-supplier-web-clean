// scripts/export-products-json.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadTsArray(fileAbsPath) {
  let code = fs.readFileSync(fileAbsPath, "utf8");

  // ตัด import ทั้งหมด
  code = code.replace(/^import .*?;?\s*$/gm, "");

  // เปลี่ยน export const xxx: Type[] =  -> module.exports =
  code = code.replace(
    /export\s+const\s+\w+\s*:\s*[^=]+=\s*/m,
    "module.exports = "
  );

  // เผื่อไม่มี type (export const xxx =)
  code = code.replace(/export\s+const\s+\w+\s*=\s*/m, "module.exports = ");

  // ลบ "as const" ถ้ามี
  code = code.replace(/\s+as\s+const/g, "");

  // รันใน sandbox
  const sandbox = { module: { exports: null }, exports: null };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: fileAbsPath });

  const arr = sandbox.module.exports;
  if (!Array.isArray(arr)) {
    throw new Error(`❌ ไม่ได้ array จากไฟล์: ${path.basename(fileAbsPath)}`);
  }
  return arr;
}

function main() {
  const base = path.join(process.cwd(), "data", "products");

  const files = [
    "products.donaldson.ts",
    "products.mann.ts",
    "products.ntn.ts",
    "products.fleetguard.ts",
  ]
    .map((f) => path.join(base, f))
    .filter((p) => fs.existsSync(p));

  if (!files.length) {
    throw new Error("❌ ไม่พบไฟล์ data/products/products.*.ts");
  }

  const merged = [];
  for (const f of files) {
    const arr = loadTsArray(f);
    merged.push(...arr);
    console.log("✅ loaded", path.basename(f), "=", arr.length);
  }

  const out = path.join(process.cwd(), "data", "products.json");
  fs.writeFileSync(out, JSON.stringify(merged, null, 2), "utf8");
  console.log("✅ wrote data/products.json =", merged.length);
}

main();
