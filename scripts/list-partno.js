// scripts/list-partno.js
const { products } = require("../data/products");

function pick(p) {
  return (p.partNo || p.part_no || "").toString().trim();
}

const partNos = products
  .map(pick)
  .filter(Boolean);

const uniq = Array.from(new Set(partNos));

console.log("Total products:", products.length);
console.log("Total partNo:", partNos.length);
console.log("Unique partNo:", uniq.length);

console.log("\nSample 50 partNos:");
uniq.slice(0, 50).forEach((x) => console.log("-", x));
