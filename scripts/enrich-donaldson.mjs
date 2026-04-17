// scripts/enrich-donaldson.mjs
// run: node scripts/enrich-donaldson.mjs
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const LIST = path.join(process.cwd(), "donaldson_web.txt");
const OUT_JSON = path.join(process.cwd(), "data", "donaldson_enriched.json");
const OUT_TS = path.join(process.cwd(), "data", "products", "products.donaldson.ts");

const BASE_TH = "https://shop.donaldson.com/store/en-th";
const SEARCH_TH = `${BASE_TH}/search?query=`;

const CONCURRENCY = 2; // อย่ายิงแรง เดี๋ยวโดนบล็อก
const DELAY_MS = 250;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function prefixFromPartNo(partNo) {
  const s = String(partNo || "").trim();
  const m = s.match(/^[A-Za-z]+/);
  return (m ? m[0][0] : s[0] || "").toUpperCase();
}
function safeText(s) { return String(s || "").replace(/\s+/g, " ").trim(); }

function toTs(products) {
  return `// data/products/products.donaldson.ts
import type { Product } from "@/data/types";

export const donaldsonProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;
}

async function parseFromPage(page, partNo) {
  const url = `${SEARCH_TH}${encodeURIComponent(partNo)}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // รอเผื่อ JS ทำงาน
  await page.waitForTimeout(900);

  // ถ้าหน้า search มีผลลัพธ์เป็นรายการ ให้คลิกลิงก์สินค้าตัวแรก
  // ถ้าโดน redirect เข้า product page แล้วก็ผ่าน
  const isProduct = page.url().includes("/product/");
  if (!isProduct) {
    const firstLink = page.locator('a[href*="/product/"]').first();
    const cnt = await firstLink.count();
    if (cnt === 0) throw new Error("No product link rendered (JS)");
    await firstLink.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(700);
  }

  const officialUrl = page.url();

  // ดึง title (h1 เป็นหลัก)
  const title = safeText(await page.locator("h1").first().textContent().catch(() => "")) ||
    `Donaldson Part - ${partNo}`;

  // ดึง Attributes: เอา text แถบ section “Attributes” แบบ best-effort
  // (โครงจริงอาจต่างกันตามสินค้า เราเอาอ่านได้ก่อน)
  let attrsText = "";
  const attrHeading = page.getByText("Attributes", { exact: true });
  if (await attrHeading.count().catch(() => 0)) {
    // เอา container ที่อยู่ใกล้ๆ heading
    const block = attrHeading.locator("xpath=ancestor::*[self::section or self::div][1]");
    attrsText = safeText(await block.textContent().catch(() => ""));
  } else {
    // fallback: ดึงทั้งหน้าแล้วค่อยกรอง
    attrsText = safeText(await page.content());
  }

  // ทำ spec แบบอ่านง่าย: เอาคำสำคัญที่พบบ่อย
  const pick = (re) => {
    const m = attrsText.match(re);
    return m ? safeText(m[1]) : "";
  };

  const inner = pick(/Inner Diameter\s*[:\-]?\s*([^\n|]+?)(?:Outer Diameter|Length|Material|$)/i);
  const outer = pick(/Outer Diameter\s*[:\-]?\s*([^\n|]+?)(?:Length|Material|$)/i);
  const length = pick(/Length\s*[:\-]?\s*([^\n|]+?)(?:Material|$)/i);
  const thread = pick(/Thread\s*[:\-]?\s*([^\n|]+?)(?:Material|$)/i);
  const material = pick(/Material\s*[:\-]?\s*([^\n|]+?)(?:Efficiency|Media Type|$)/i);

  const bits = [];
  if (inner) bits.push(`Inner Diameter: ${inner}`);
  if (outer) bits.push(`Outer Diameter: ${outer}`);
  if (length) bits.push(`Length: ${length}`);
  if (thread) bits.push(`Thread: ${thread}`);
  if (material) bits.push(`Material: ${material}`);

  const spec = bits.length ? `${title} | ${bits.join(" | ")}` : `${title} (verify application via RFQ)`;

  return {
    ok: true,
    partNo,
    brand: "DONALDSON",
    category: "filter",
    title,
    spec,
    
    prefix: prefixFromPartNo(partNo),
    refs: [],
    officialUrl,
  };
}

async function main() {
  if (!fs.existsSync(LIST)) {
    console.error("❌ ไม่เจอไฟล์:", LIST);
    process.exit(1);
  }

  const partNos = fs.readFileSync(LIST, "utf8")
    .split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  console.log("🔎 parts:", partNos.length);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "en-US",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  });

  // ทำทีละ batch แบบจำกัด concurrency
  const results = [];
  let i = 0;

  async function worker() {
    const page = await context.newPage();
    while (true) {
      const idx = i++;
      if (idx >= partNos.length) break;
      const pn = partNos[idx];

      try {
        const r = await parseFromPage(page, pn);
        results[idx] = r;
      } catch (e) {
        results[idx] = {
          ok: false,
          partNo: pn,
          brand: "DONALDSON",
          category: "filter",
          title: `Donaldson Part - ${pn}`,
          spec: "Filter/Part (verify application via RFQ)",
          
          prefix: prefixFromPartNo(pn),
          refs: [],
          officialUrl: `${SEARCH_TH}${encodeURIComponent(pn)}`,
          error: String(e?.message || e),
        };
      }

      await sleep(DELAY_MS);
      if ((idx + 1) % 10 === 0) console.log(`...done ${idx + 1}/${partNos.length}`);
    }
    await page.close();
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, partNos.length) }, worker);
  await Promise.all(workers);

  await browser.close();

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2), "utf8");

  const ok = results.filter((x) => x.ok);

  const tsProducts = ok.map((x) => ({
    id: `don-${String(x.partNo).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    partNo: x.partNo,
    brand: "DONALDSON",
    category: x.category || "filter",
    title: x.title,
    spec: x.spec,
    
    prefix: x.prefix,
    refs: x.refs || [],
    officialUrl: x.officialUrl,
  }));

  fs.mkdirSync(path.dirname(OUT_TS), { recursive: true });
  fs.writeFileSync(OUT_TS, toTs(tsProducts), "utf8");

  console.log("✅ wrote:", OUT_JSON);
  console.log("✅ wrote:", OUT_TS);
  console.log("✅ ok:", ok.length, "fail:", results.length - ok.length);
}

main();
