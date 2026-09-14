import { getProductImageUrl } from "@/lib/products/image";
import { normalizeCanonicalProductRelations } from "@/lib/products/relations";
import { normalizeProducts } from "./normalize";
import { batch4FeaturedProducts } from "./products.batch4.featured";
import { batch4Products } from "./products.batch4";
import { donaldsonProducts } from "./products.donaldson";
import { donaldsonPriorityProducts } from "./products.donaldson.priority";
import { generatedProducts } from "./products.generated";
import { fleetguardProducts } from "./products.fleetguard";
import { fs1242StockProducts } from "./products.fs1242-stock";
import { mannProducts } from "./products.mann";
import { newProducts } from "./products.new";
import { ntnProducts } from "./products.ntn";
import { uploadedProducts } from "./products.uploaded";
import { importedProducts } from "./products.imported";
import { officialProducts20260903 } from "./products.official-2026-09-03";
import { stanadyneCrossReferencesByDonaldson } from "./stanadyne-cross-references";
import { sureSakuraCrossReferencesByDonaldson } from "./sure-sakura-cross-references";
import { getVerifiedAirFilterPairedParts } from "./air-filter-pairs";
import { vehicleFilterProducts } from "./products.vehicle-filters";

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
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/_-]+/g, "");
}

const rawProducts = [
  ...donaldsonProducts,
  ...mannProducts,
  ...ntnProducts,
  ...newProducts,
  ...batch4Products,
  ...batch4FeaturedProducts,
  ...generatedProducts,
  ...fleetguardProducts,
  ...fs1242StockProducts,
  ...uploadedProducts,
  ...donaldsonPriorityProducts,
  ...importedProducts,
  ...officialProducts20260903,
];

export const products = Array.from(
  new Map(
    normalizeProducts([
      ...rawProducts,
      ...vehicleFilterProducts.filter(
        (incoming) => !rawProducts.some(
          (existing) => normalizePartNo(existing.partNo) === normalizePartNo(incoming.partNo),
        ),
      ),
    ])
      .filter((product) => !EXCLUDED_ACTIVE_PART_NOS.has(product.partNo))
      .map((product) => {
        const key = normalizePartNo(product.partNo);
        const vehicleData = vehicleFilterProducts.find(
          (incoming) => normalizePartNo(incoming.partNo) === key &&
            incoming.brand.toLowerCase() === product.brand.toLowerCase(),
        );
        const stanadyneCrossReferences =
          stanadyneCrossReferencesByDonaldson[product.partNo] ?? [];
        const sureSakuraCrossReferences =
          product.brand?.toLowerCase() === "donaldson"
            ? sureSakuraCrossReferencesByDonaldson[product.partNo] ?? []
            : [];
        const verifiedAirFilterPairs = getVerifiedAirFilterPairedParts(
          product.partNo,
        );
        const pairedParts = [
          ...(product.pairedParts ?? []),
          ...verifiedAirFilterPairs,
        ].filter(
          (pairedPart, index, allPairedParts) =>
            allPairedParts.findIndex(
              (candidate) =>
                normalizePartNo(candidate.partNo) ===
                normalizePartNo(pairedPart.partNo),
            ) === index,
        );

        return [
          key,
          {
            ...product,
            ...(vehicleData ? {
              vehicleApplications: vehicleData.vehicleApplications,
              stockStatus: vehicleData.stockStatus,
              mrtStockEvidence: vehicleData.mrtStockEvidence,
            } : {}),
            title:
              product.title ||
              `${product.brand?.toUpperCase()} ${product.partNo}`,
            description:
              product.description ||
              `Industrial part ${product.partNo} with OEM reference support.`,
            imageUrl: getProductImageUrl(
              product.brand,
              product.partNo,
              product.imageUrl,
            ),
            refs: product.refs ?? [],
            crossReferences: normalizeCanonicalProductRelations(
              [
                ...(product.crossReferences ?? []),
                ...stanadyneCrossReferences,
                ...sureSakuraCrossReferences,
                ...(vehicleData?.crossReferences ?? []),
              ],
              "unknown",
            ),
            pairedParts,
          },
        ];
      }),
  ).values(),
);
