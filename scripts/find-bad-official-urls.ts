import { products } from "../data/products/index";

for (const p of products) {
  const url = p.officialUrl;

  if (!url) continue;

  const bad =
    url.includes("_requestid") ||
    url.includes("?") ||
    !url.includes(`/product/${p.partNo}/`);

  if (bad) {
    console.log(`${p.partNo} | ${p.id}`);
    console.log(url);
    console.log("---");
  }
}