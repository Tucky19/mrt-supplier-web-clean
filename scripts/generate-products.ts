import { writeFileSync } from "node:fs";
import path from "node:path";

const OUTPUT_PATH = path.join(
  process.cwd(),
  "data",
  "products",
  "products.generated.ts"
);

const BRANDS = ["donaldson", "mann", "fleetguard"] as const;
const PRODUCT_COUNT = 1000;
const SPEC = "OD 93mm x L 173mm";

const OFFICIAL_URLS = {
  donaldson: "https://www.donaldson.com/en-us/",
  mann: "https://www.donaldson.com/en-us/",
  fleetguard: "https://www.donaldson.com/en-us/",
} as const;

type Brand = (typeof BRANDS)[number];

type GeneratedProduct = {
  id: string;
  partNo: string;
  brand: string;
  title: string;
  spec: string;
  imageUrl: string;
  refs: string[];
  officialUrl: string;
};

function createPartNo(index: number) {
  return `P55${String(1000 + index).padStart(4, "0")}`;
}

function createBrand(index: number): Brand {
  return BRANDS[index % BRANDS.length];
}

function createId(brand: Brand, partNo: string) {
  return `${brand}-${partNo.toLowerCase()}`;
}

function uniqueRefs(sourcePartNo: string, pool: string[], count: number) {
  const refs: string[] = [];
  let cursor = sourcePartNo.charCodeAt(sourcePartNo.length - 1);

  while (refs.length < count) {
    cursor = (cursor * 17 + 29) % pool.length;
    const candidate = pool[cursor];

    if (candidate === sourcePartNo || refs.includes(candidate)) {
      cursor += 1;
      continue;
    }

    refs.push(candidate);
  }

  return refs;
}

function buildProducts() {
  const basePartNos = Array.from({ length: PRODUCT_COUNT }, (_, index) =>
    createPartNo(index)
  );

  return basePartNos.map((partNo, index): GeneratedProduct => {
    const brand = createBrand(index);
    const refCount = index % 2 === 0 ? 2 : 3;

    return {
      id: createId(brand, partNo),
      partNo,
      brand,
      title: `${brand.toUpperCase()} ${partNo} Filter`,
      spec: SPEC,
      imageUrl: `/images/product/${brand}/${partNo}.jpg`,
      refs: uniqueRefs(partNo, basePartNos, refCount),
      officialUrl: OFFICIAL_URLS[brand],
    };
  });
}

function buildFileContent(products: GeneratedProduct[]) {
  const serialized = JSON.stringify(products, null, 2);

  return `// AUTO-GENERATED FILE. DO NOT EDIT
import type { Product } from "@/types/product";

export const generatedProducts: Product[] = ${serialized};
`;
}

function main() {
  const products = buildProducts();
  const content = buildFileContent(products);

  writeFileSync(OUTPUT_PATH, content, "utf8");
  console.log(
    `Generated ${products.length} products to ${path.relative(process.cwd(), OUTPUT_PATH)}`
  );
}

main();
