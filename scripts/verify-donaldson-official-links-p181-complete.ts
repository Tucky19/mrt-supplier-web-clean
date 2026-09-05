import { products } from "@/data/products/index";

const p181Products = products.filter((product) => /^P181\\d+$/.test(product.partNo));

if (p181Products.length === 0) {
  throw new Error("No active P181 products found");
}

const invalid = p181Products.filter((product) => {
  const canonicalPattern = new RegExp(
    `^https://shop\\\\.donaldson\\\\.com/store/[^/]+/product/${product.partNo}/\\\\d+$`,
  );
  return !product.officialUrl || !canonicalPattern.test(product.officialUrl);
});

if (invalid.length > 0) {
  throw new Error(
    `Non-canonical P181 official URLs:\\n${invalid
      .map((product) => `${product.partNo}: ${product.officialUrl ?? "none"}`)
      .join("\\n")}`,
  );
}

console.log(`Donaldson P181 URL validation passed for ${p181Products.length} active products`);
