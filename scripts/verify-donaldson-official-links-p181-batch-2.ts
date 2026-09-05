import { products } from "@/data/products/index";

const expected = new Map([
  ["P181009", "https://shop.donaldson.com/store/en-us/product/P181009/17777"],
  ["P181036", "https://shop.donaldson.com/store/en-us/product/P181036/17799"],
  ["P181106", "https://shop.donaldson.com/store/en-us/product/P181106/17862"],
  ["P181118", "https://shop.donaldson.com/store/en-us/product/P181118/17870"],
]);

for (const [partNo, officialUrl] of expected) {
  const product = products.find((candidate) => candidate.partNo === partNo);

  if (!product) {
    throw new Error(`Missing active Donaldson product ${partNo}`);
  }

  if (product.officialUrl !== officialUrl) {
    throw new Error(
      `${partNo} officialUrl mismatch: expected ${officialUrl}, received ${product.officialUrl ?? "none"}`,
    );
  }
}

console.log("Donaldson P181 official URL batch 2 validation passed");
