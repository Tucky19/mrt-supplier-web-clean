import { products as finalProducts } from "../data/products/index";

type ProductLike = {
  id?: string;
  partNo?: string;
  brand?: string;
  title?: string;
  dataQuality?: string;
  sourceType?: string;
};

function normalizePartNo(value: string | undefined | null) {
  return String(value ?? "").trim().toUpperCase().replace(/[\s/_-]+/g, "");
}

function main() {
  const byPartNo = new Map<string, ProductLike[]>();

  for (const product of finalProducts as ProductLike[]) {
    const key = normalizePartNo(product.partNo);
    if (!key) continue;

    const list = byPartNo.get(key) ?? [];
    list.push(product);
    byPartNo.set(key, list);
  }

  const duplicates = Array.from(byPartNo.entries()).filter(
    ([, items]) => items.length > 1
  );

  console.log("\n=== MRT Supplier Product Duplicate Report ===\n");

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found in final products export.");
    return;
  }

  console.log(`⚠️ Found ${duplicates.length} duplicated partNo group(s).\n`);

  for (const [partNo, items] of duplicates) {
    console.log(`\nPART NO: ${partNo}`);
    console.log(`COUNT: ${items.length}`);

    items.forEach((item, index) => {
      console.log(
        `  ${index + 1}. id=${item.id ?? "-"} | brand=${
          item.brand ?? "-"
        } | title=${item.title ?? "-"} | quality=${
          item.dataQuality ?? "-"
        } | source=${item.sourceType ?? "-"}`
      );
    });
  }

  console.log("\nDone.\n");
}

main();