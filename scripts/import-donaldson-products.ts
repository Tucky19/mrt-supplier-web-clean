import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import axios from "axios";
import * as cheerio from "cheerio";

async function fetchOfficialUrl(partNo: string) {
  try {
    const searchUrl = `https://shop.donaldson.com/store/en-th/search?q=${partNo}`;

    const res = await axios.get(searchUrl);
    const $ = cheerio.load(res.data);

    let foundUrl: string | null = null;

    $("a").each((_, el) => {
      const href = $(el).attr("href");

      if (href && href.includes(`/product/${partNo}/`)) {
        foundUrl = "https://shop.donaldson.com" + href;
      }
    });

    return foundUrl;
  } catch (err) {
    return null;
  }
}
async function downloadImage(url: string, partNo: string) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const img = $("img").attr("src");

    if (!img) return;

    const imgUrl = img.startsWith("http")
      ? img
      : "https://shop.donaldson.com" + img;

    const imgData = await axios.get(imgUrl, {
      responseType: "arraybuffer",
    });

    const filePath = `public/images/products/donaldson/${partNo.toLowerCase()}.jpg`;

    fs.writeFileSync(filePath, imgData.data);
  } catch (err) {
    console.log("Image fail:", partNo);
  }
}


const PDF_DIR = "pdf/donaldson";
const OUTPUT_FILE = "data/products/products.imported.ts";

function normalizePartNo(partNo: string) {
  return partNo.trim().toUpperCase();
}

function makeId(partNo: string) {
  return `donaldson-${partNo.toLowerCase()}`;
}

function makeImagePath(partNo: string) {
  return `/images/products/donaldson/${partNo.toLowerCase()}.jpg`;
}

function detectCategory(text: string) {
  const t = text.toUpperCase();
  if (t.includes("FUEL")) return "fuel_filter";
  if (t.includes("HYDRAULIC")) return "hydraulic_filter";
  if (t.includes("AIR")) return "air_filter";
  if (t.includes("LUBE") || t.includes("OIL")) return "oil_filter";
  return "filter";
}

function extractPartNo(text: string) {
  const match = text.match(/P\d{6}|C\d{6}/);
  return match ? match[0] : null;
}

function extractTitle(text: string) {
  const match = text.match(/FILTER[^\n]+/i);
  return match ? match[0].trim() : "Filter";
}

function grab(re: RegExp, text: string) {
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function extractSpecs(text: string) {
  const od =
    grab(/Outer Diameter\s+([\d.]+\s*mm)/i, text) ||
    grab(/\bOD\s+([\d.]+\s*mm)/i, text);

  const id =
    grab(/Inner Diameter\s+([\d.]+\s*mm)/i, text) ||
    grab(/\bID\s+([\d.]+\s*mm)/i, text);

  const length =
    grab(/\bLength\s+([\d.]+\s*mm)/i, text) ||
    grab(/\bL\s+([\d.]+\s*mm)/i, text);

  const thread = grab(/Thread Size\s+([^\n]+)/i, text);

  const eff99 =
    grab(/Efficiency\s*99(?:\.9)?%?\s+([\d.]+\s*micron)/i, text) ||
    grab(/99(?:\.9)?%\s+([\d.]+\s*micron)/i, text);

  const effBeta1000 =
    grab(/Beta\s*1000\s*[:\-]?\s*([\d.]+\s*micron)/i, text) ||
    grab(/Efficiency\s*Beta\s*1000\s+([\d.]+\s*micron)/i, text);

  const parts: string[] = [];

  if (od) parts.push(`OD ${od}`);
  if (id) parts.push(`ID ${id}`);
  if (length) parts.push(`L ${length}`);
  if (thread) parts.push(thread);
  if (eff99) parts.push(eff99);
  else if (effBeta1000) parts.push(effBeta1000);

  const spec = parts.length ? parts.join(" × ") : "-";

  const specifications: { label: string; value: string }[] = [];

  if (od) specifications.push({ label: "Outer Diameter", value: od });
  if (id) specifications.push({ label: "Inner Diameter", value: id });
  if (length) specifications.push({ label: "Length", value: length });
  if (thread) specifications.push({ label: "Thread Size", value: thread });
  if (eff99)
    specifications.push({ label: "Efficiency 99%", value: eff99 });
  if (effBeta1000)
    specifications.push({
      label: "Efficiency Beta 1000",
      value: effBeta1000,
    });

  return { spec, specifications };
}

// ✅ ภาษาไทย
function makeThaiCopy(partNo: string, category: string) {
  if (category === "fuel_filter") {
    return {
      shortDescription: `${partNo} กรองเชื้อเพลิง Donaldson สำหรับระบบน้ำมันดีเซล`,
      description: `${partNo} เป็นกรองเชื้อเพลิง Donaldson ออกแบบมาเพื่อช่วยดักจับสิ่งปนเปื้อนในน้ำมัน ปกป้องหัวฉีดและปั๊มเชื้อเพลิง`,
    };
  }

  if (category === "oil_filter") {
    return {
      shortDescription: `${partNo} กรองน้ำมันเครื่อง Donaldson สำหรับระบบหล่อลื่น`,
      description: `${partNo} เป็นกรองน้ำมันเครื่อง Donaldson ช่วยรักษาความสะอาดของน้ำมัน ลดการสึกหรอ และยืดอายุการใช้งานของเครื่องยนต์`,
    };
  }

  if (category === "hydraulic_filter") {
    return {
      shortDescription: `${partNo} ไส้กรองไฮดรอลิก Donaldson สำหรับระบบไฮดรอลิก`,
      description: `${partNo} เป็นไส้กรองไฮดรอลิก Donaldson ช่วยควบคุมสิ่งปนเปื้อนในน้ำมันไฮดรอลิกและปกป้องอุปกรณ์ในระบบ`,
    };
  }

  if (category === "air_filter") {
    return {
      shortDescription: `${partNo} กรองอากาศ Donaldson สำหรับระบบไอดีเครื่องยนต์`,
      description: `${partNo} เป็นกรองอากาศ Donaldson ช่วยกรองฝุ่นและสิ่งปนเปื้อนก่อนเข้าสู่เครื่องยนต์`,
    };
  }

  return {
    shortDescription: `${partNo} ไส้กรอง Donaldson สำหรับงานอุตสาหกรรม`,
    description: `${partNo} เป็นไส้กรอง Donaldson สำหรับเครื่องจักรและระบบอุตสาหกรรม`,
  };
}
function uniq(values: string[]) {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

function extractPrimaryApplication(text: string) {
  return grab(/Primary Application\s+([^\n]+)/i, text);
}

function extractCrossReferences(text: string, partNo: string) {
  const refs: string[] = [];

  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const upper = line.toUpperCase();

    const isRelevant =
      upper.includes("FLEETGUARD") ||
      upper.includes("BALDWIN") ||
      upper.includes("WIX") ||
      upper.includes("HYDAC") ||
      upper.includes("MANN") ||
      upper.includes("PALL") ||
      upper.includes("CASE") ||
      upper.includes("KOMATSU");

    if (!isRelevant) continue;

    const cleaned = line
      .replace(/Primary Application/i, "")
      .trim();

    if (!cleaned || cleaned.includes(partNo)) continue;

    // 🔥 ตัดเลขล้วน (UPC, serial ฯลฯ)
    if (/^\d{6,}$/.test(cleaned)) continue;

    refs.push(cleaned);
  }

  return Array.from(new Set(refs)).slice(0, 20);
}

async function parseFile(filePath: string) {
  const buffer = fs.readFileSync(filePath);


  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  const text = result.text;

  const partNo = extractPartNo(text);
  if (!partNo) return null;

  const category = detectCategory(text);
  const thaiCopy = makeThaiCopy(partNo, category);
  const { spec, specifications } = extractSpecs(text);
  const crossRefs = extractCrossReferences(text, partNo);
  const officialUrl = await fetchOfficialUrl(partNo);

if (officialUrl) {
  await downloadImage(officialUrl, partNo);
  
}

  return {
    
    id: makeId(partNo),
    partNo,
    brand: "Donaldson",
    category,
    title: extractTitle(text),

    shortDescription: thaiCopy.shortDescription,
    description: thaiCopy.description,

    spec,
    specifications,

    applications: crossRefs,
    refs: crossRefs,
    crossReferences: crossRefs,

    officialUrl: `https://shop.donaldson.com/store/en-th/product/${partNo}`,
    officialImageUrl: null,
    imageUrl: makeImagePath(partNo),

    stockStatus: "in_stock",
    sourceType: "official",
    dataQuality: "basic",
    enrichStatus: "pending",
    
  };
}

async function run() {
  const files = fs.readdirSync(PDF_DIR);

  const products: any[] = [];

  for (const file of files) {
    if (!file.endsWith(".pdf")) continue;

    const fullPath = path.join(PDF_DIR, file);

    try {
      const product = await parseFile(fullPath);
      if (product) products.push(product);
    } catch (err) {
      console.error("Error parsing:", file);
      console.error(err);
    }
  }

  const output = `export const importedProducts = ${JSON.stringify(
    products,
    null,
    2
  )};\n`;

  fs.writeFileSync(OUTPUT_FILE, output);

  console.log(`✅ Imported ${products.length} products`);
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});