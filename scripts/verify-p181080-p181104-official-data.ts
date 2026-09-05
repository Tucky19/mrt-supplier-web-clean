import assert from "node:assert/strict";

import { products } from "@/data/products/index";

const expected = {
  P181080: {
    officialUrl:
      "https://shop.donaldson.com/store/en-us/product/P181080/17841",
    title: "Air Filter, Primary Round",
    specifications: {
      "Overall Length": "343 mm (13.50 inch)",
      "Outer Diameter": "232.2 mm (9.14 inch)",
      "Inner Diameter": "146.8 mm (5.78 inch)",
      Length: "330.3 mm (13.00 inch)",
    },
  },
  P181104: {
    officialUrl:
      "https://shop.donaldson.com/store/en-us/product/P181104/17860",
    title: "Air Filter, Primary Round",
    specifications: {
      "Overall Length": "342.9 mm (13.50 inch)",
      "Outer Diameter": "281.7 mm (11.09 inch)",
      "Inner Diameter": "167.6 mm (6.60 inch)",
      Length: "330.2 mm (13.00 inch)",
    },
  },
} as const;

for (const [partNo, expectation] of Object.entries(expected)) {
  const product = products.find((item) => item.partNo === partNo);
  assert.ok(product, `${partNo} must remain in the active catalog`);
  assert.equal(product.officialUrl, expectation.officialUrl);
  assert.equal(product.title, expectation.title);

  const specifications = Object.fromEntries(
    (product.specifications ?? []).map((item) => [item.label, item.value]),
  );
  for (const [label, value] of Object.entries(expectation.specifications)) {
    assert.equal(
      specifications[label],
      value,
      `${partNo} ${label} must match the checked Donaldson page`,
    );
  }
}

console.log(
  "Verified P181080 and P181104 official URLs and catalog specifications.",
);
