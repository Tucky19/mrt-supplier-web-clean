import { products } from "@/data/products/index";

const p181Products = products.filter((product) => /^P181\d+$/.test(product.partNo));

if (p181Products.length === 0) {
  throw new Error("No active P181 products found");
}

const invalid = p181Products.filter((product) => {
  if (!product.officialUrl) return true;

  const url = new URL(product.officialUrl);
  const segments = url.pathname.split("/").filter(Boolean);
  const productIndex = segments.indexOf("product");

  return (
    url.hostname !== "shop.donaldson.com" ||
    productIndex < 0 ||
    segments[productIndex + 1] !== product.partNo ||
    !/^\d+$/.test(segments[productIndex + 2] ?? "")
  );
});

if (invalid.length > 0) {
  throw new Error(
    `Non-canonical P181 official URLs:\n${invalid
      .map((product) => `${product.partNo}: ${product.officialUrl ?? "none"}`)
      .join("\n")}`,
  );
}

console.log(`Donaldson P181 URL validation passed for ${p181Products.length} active products`);
