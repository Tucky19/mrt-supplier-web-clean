import fs from "fs";
import pdf from "pdf-parse";

function extractField(text, label) {
  const regex = new RegExp(label + "\\s+(.+)");
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function normalizePart(partNo) {
  return partNo.toLowerCase();
}

function makeProduct(text) {
  const partNo = extractField(text, "P\\d+");
  if (!partNo) return null;

  return {
    id: `donaldson-${normalizePart(partNo)}`,
    partNo,
    brand: "Donaldson",
    category: text.includes("FUEL") ? "fuel_filter"
      : text.includes("HYDRAULIC") ? "hydraulic_filter"
      : "oil_filter",

    title: extractField(text, "FILTER.+") || "Filter",

    spec: "-",

    specifications: [],

    applications: [],
    refs: [],
    crossReferences: [],

    officialUrl: `https://shop.donaldson.com/store/en-th/product/${partNo}`,

    imageUrl: `/images/products/donaldson/${normalizePart(partNo)}.jpg`,

    stockStatus: "in_stock",
    sourceType: "official",
    dataQuality: "verified",
    enrichStatus: "verified",
  };
}

async function run(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);

  const product = makeProduct(data.text);

  console.log(JSON.stringify(product, null, 2));
}
const folder = "./pdf";

fs.readdirSync(folder).forEach(async (file) => {
  const buffer = fs.readFileSync(`${folder}/${file}`);
  const data = await pdf(buffer);

  const product = makeProduct(data.text);
  console.log(product);
});

run(process.argv[2]);