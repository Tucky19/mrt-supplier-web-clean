import { getProductImageUrl } from "@/lib/products/image";
import { normalizeProducts } from "./normalize";
import { batch4FeaturedProducts } from "./products.batch4.featured";
import { batch4Products } from "./products.batch4";
import { donaldsonProducts } from "./products.donaldson";
import { donaldsonPriorityProducts } from "./products.donaldson.priority";
import { generatedProducts } from "./products.generated";
import { mannProducts } from "./products.mann";
import { newProducts } from "./products.new";
import { ntnProducts } from "./products.ntn";
import { uploadedProducts } from "./products.uploaded";
import { importedProducts } from "./products.imported";

const EXCLUDED_ACTIVE_PART_NOS = new Set([
  "6205-ZZ",
  "6205-LLU",
  "6204-ZZ",
  "6203-ZZ",
  "6305-ZZ",
  "6306-ZZ",
  "R011866",
  "P502344",
  "P509129",
  "P556485",
]);

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

const rawProducts = [
  ...donaldsonProducts,
  ...mannProducts,
  ...ntnProducts,
  ...newProducts,
  ...batch4Products,
  ...batch4FeaturedProducts,
  ...generatedProducts,
  ...uploadedProducts,
  ...donaldsonPriorityProducts,
   ...importedProducts,
];

export const products = Array.from(
  new Map(
    normalizeProducts(rawProducts)
      .filter((product) => !EXCLUDED_ACTIVE_PART_NOS.has(product.partNo))
      .map((product) => {
      const key = normalizePartNo(product.partNo);

      return [
        key,
        {
          ...product,
          title: product.title || `${product.brand?.toUpperCase()} ${product.partNo}`,
          description:
            product.description ||
            `Industrial part ${product.partNo} with OEM reference support.`,
          imageUrl: getProductImageUrl(
            product.brand,
            product.partNo,
            product.imageUrl
          ),
          refs: product.refs ?? [],
          crossReferences: product.crossReferences ?? [],
        },
      ];
    })
  ).values()
);
