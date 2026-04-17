// scripts/enrich-mann.mjs
// run: node scripts/enrich-mann.mjs
import fs from "fs";
import path from "path";

const LIST = path.join(process.cwd(), "mann_web.txt"); // ✅ อยู่ root ข้าง package.json
const OUT_JSON = path.join(process.cwd(), "data", "mann_enriched.json");
const OUT_TS = path.join(process.cwd(), "data", "products", "products.mann.ts");

// ลอง 2 ฐาน (international ก่อน, ไทยเป็น fallback)
const BASES = [
  "https://www.mann-filter.com/en/catalog/international/search-results/product.html/",
  "https://www.mann-filter.com/th-th/catalog/search-results/product.html/",
];

// ปรับได้ถ้าอยากสุภาพกับเว็บมากขึ้น
const CONCURRENCY = 5;
const DELAY_MS = 120;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugFromPartNo(partNo) {
  return `${String(partNo).trim().toLowerCase()}_mann-filter.html`;
}

function prefixFromPartNo(partNo) {
  const s = String(partNo || "").trim();
  const m = s.match(/^[A-Za-z]+/);
  return (m ? m[0][0] : s[0] || "").toUpperCase();
}

function pick(re, text) {
  const m = text.match(re);
  return m ? String(m[1]).replace(/\s+/g, " ").trim() : "";
}

function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ดึงประเภทกรอง (Oil/Fuel/Air/Hydraulic/...) จากหน้า
function parseFilterType(html) {
  const h1 = stripTags(pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html));
  if (h1 && h1.length < 60) return h1;

  const h2 = stripTags(pick(/<h2[^>]*>([\s\S]*?)<\/h2>/i, html));
  if (h2 && /filter|hydraulic|air|fuel|oil/i.test(h2)) return h2;

  const kw = pick(
    />\s*(Oil Filter|Fuel Filter|Air Filter|Hydraulic[^<]*Filter|Cabin Filter|Coolant Filter)\s*</i,
    html
  );
  return kw || "";
}

function parseDims(html) {
  // รูปแบบ bullet: "* A = 108 mm; B = 93 mm; ..." (เจอบ่อย)
  const bullet = pick(/\*\s*A\s*=\s*([\s\S]*?)<\/(p|li)>/i, html);
  const line = bullet ? stripTags(bullet) : "";

  const fromLine = (key) => pick(new RegExp(`${key}\\s*=\\s*([^;\\n]+)`, "i"), line);

  // fallback: ตาราง (บาง locale)
  const fromTable = (key) =>
    stripTags(pick(new RegExp(`\\b${key}\\b[\\s\\S]{0,120}?<[^>]+>([^<]+)<`, "i"), html));

  const A = fromLine("A") || fromTable("A");
  const B = fromLine("B") || fromTable("B");
  const C = fromLine("C") || fromTable("C");
  const H = fromLine("H") || fromTable("H");
  const G = fromLine("G") || fromTable("G");

  return { A, B, C, H, G };
}

function buildSpec(type, dims) {
  const parts = [];
  if (type) parts.push(type);

  const dimBits = [];
  if (dims.A) dimBits.push(`A ${dims.A}`);
  if (dims.B) dimBits.push(`B ${dims.B}`);
  if (dims.C) dimBits.push(`C ${dims.C}`);
  if (dims.H) dimBits.push(`H ${dims.H}`);
  if (dimBits.length) parts.push(dimBits.join(" • "));
  if (dims.G) parts.push(`G ${dims.G}`);

  return parts.length ? parts.join(" | ") : "Filter (verify application via RFQ)";
}

/* ===========================
   ✅ Fallback search helpers
   =========================== */
function searchUrl(base, partNo) {
  const q = encodeURIComponent(String(partNo).trim());
  return base.includes("/th-th/")
    ? `https://www.mann-filter.com/th-th/catalog/search-results.html?query=${q}`
    : `https://www.mann-filter.com/in-en/catalogue/search-results.html?query=${q}`;
}


function extractFirstProductLink(html) {
  const m = html.match(/href=['"]([^'"]+_mann-filter\.html)['"]/i);
  if (!m) return "";
  const href = m[1];
  if (href.startsWith("http")) return href;
  return `https://www.mann-filter.com${href.startsWith("/") ? "" : "/"}${href}`;
}

/* =========================== */
function candidates(partNo) {
  const pn = String(partNo).trim();
  const out = [pn];

  // HU931/5 -> HU931/5X (พบในเว็บบ่อย)
  if (/^HU/i.test(pn) && pn.includes("/") && !/x$/i.test(pn)) out.push(pn + "X");

  // LB13174/2 อาจเป็น LB1374/2 (กรณีตัวเลขเกิน 1 หลักหลัง LB)
  // ถ้า LB + 5-6 digit ก่อน / ให้ลองตัด "1" ตัวแรกหลัง LB ออก
  if (/^LB\d{5,6}\//i.test(pn)) out.push(pn.replace(/^LB1/i, "LB"));

  // unique
  return Array.from(new Set(out));
}

async function fetchOne(partNo) {
  const list = candidates(partNo);

  for (const pn of list) {
    const slug = slugFromPartNo(pn);

    // 1) ยิงตรงแบบเดิมก่อน
    for (const base of BASES) {
      const url = base + slug;
      try {
        const res = await fetch(url, { redirect: "follow" });
        if (!res.ok) continue;

        const html = await res.text();
        if (!/mann-filter/i.test(html) && !/MANN/i.test(html)) continue;

        const type = parseFilterType(html);
        const dims = parseDims(html);

        return {
          ok: true,
          partNo: pn, // ✅ ใช้ pn (candidate) ที่เจอจริง
          brand: "MANN",
          category: "filter",
          title: `MANN Filter - ${pn}`,
          spec: buildSpec(type, dims),
          
          prefix: prefixFromPartNo(pn),
          refs: [],
          officialUrl: url,
          mannType: type,
          dimensions: dims,
        };
      } catch {
        // try next base
      }
    }

    // 2) fallback: ไปหน้า search ด้วย query แล้วตาม product link
    for (const base of BASES) {
      try {
        const sUrl = searchUrl(base, pn);
        const sRes = await fetch(sUrl, { redirect: "follow" });
        if (!sRes.ok) continue;

        const sHtml = await sRes.text();
        const pUrl = extractFirstProductLink(sHtml);
        if (!pUrl) continue;

        const pRes = await fetch(pUrl, { redirect: "follow" });
        if (!pRes.ok) continue;

        const html = await pRes.text();
        const type = parseFilterType(html);
        const dims = parseDims(html);

        return {
          ok: true,
          partNo: pn,
          brand: "MANN",
          category: "filter",
          title: `MANN Filter - ${pn}`,
          spec: buildSpec(type, dims),
          
          prefix: prefixFromPartNo(pn),
          refs: [],
          officialUrl: pUrl,
          mannType: type,
          dimensions: dims,
        };
      } catch {
        // try next base
      }
    }
  }

  // ✅ ปิดวงเล็บครบแน่นอน เพราะเรา return หลังวนครบทุก candidate แล้ว
  return {
    ok: false,
    partNo,
    brand: "MANN",
    category: "filter",
    title: `MANN Filter - ${partNo}`,
    spec: "Filter (verify application via RFQ)",
    
    prefix: prefixFromPartNo(partNo),
    refs: [],
    officialUrl: "",
    error: "Not found",
  };
}

async function mapLimit(list, limit, fn) {
  const out = Array(list.length);
  let i = 0;

  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= list.length) break;
      out[idx] = await fn(list[idx]);
      await sleep(DELAY_MS);
      if ((idx + 1) % 20 === 0) console.log(`...done ${idx + 1}/${list.length}`);
    }
  });

  await Promise.all(workers);
  return out;
}

function toTs(products) {
  return `// data/products/products.mann.ts
import type { Product } from "@/data/types";

export const mannProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;
}

async function main() {
  if (!fs.existsSync(LIST)) {
    console.error("❌ ไม่เจอไฟล์:", LIST);
    process.exit(1);
  }

  const partNos = fs
    .readFileSync(LIST, "utf8")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  console.log("🔎 parts:", partNos.length);

  const enriched = await mapLimit(partNos, CONCURRENCY, fetchOne);

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(enriched, null, 2), "utf8");

  const ok = enriched.filter((x) => x.ok);

  const tsProducts = ok.map((x) => ({
    id: `man-${String(x.partNo).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    partNo: x.partNo,
    brand: "MANN",
    category: "filter",
    title: `MANN Filter - ${x.partNo}`,
    spec: x.spec,
    
    prefix: x.prefix,
    refs: [],
    officialUrl: x.officialUrl,
  }));

  fs.mkdirSync(path.dirname(OUT_TS), { recursive: true });
  fs.writeFileSync(OUT_TS, toTs(tsProducts), "utf8");

  console.log("✅ wrote:", OUT_JSON);
  console.log("✅ wrote:", OUT_TS);
  console.log("✅ ok:", ok.length, "fail:", enriched.length - ok.length);
 }
  main();
