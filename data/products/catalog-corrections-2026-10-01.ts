import type { Product } from "@/types/product";
import metricEvidence from "./mann-metric-2026-10-01.json";
import { isLinearDimensionLabel } from "@/lib/products/metric";

type MetricEvidence = { source: string; checkedAt: string; dimensions: Array<{label: string; value: string}> };
const evidence: Record<string, MetricEvidence> = metricEvidence;

export function applyCatalogCorrections(product: Product): Product {
  let result = product;
  if (product.brand === "MANN-FILTER") {
    const key = product.partNo.toLowerCase().replace(/[\s/_-]+/g, "");
    const metric = evidence[key];
    if (metric) {
      result = {
        ...product,
        officialUrl: metric.source,
        partNumberOnly: false,
        specifications: [
          ...(product.specifications ?? []).filter(row => !isLinearDimensionLabel(row.label) && !/thread/i.test(row.label)),
          ...metric.dimensions,
        ],
        spec: metric.dimensions.map(row => `${row.label}: ${row.value}`).join(" · "),
        // Remove older dimensional overrides; search now uses the verified metric rows.
        od_mm: undefined, id_mm: undefined, length_mm: undefined, thread: undefined,
      };
    }
    if (key === "bfu900x") result = { ...result, type: "cartridge", description: "ไส้กรองเชื้อเพลิงดีเซลแบบไส้เปลี่ยน พร้อมปะเก็น / Diesel fuel filter element with gasket." };
    if (key === "c14200") result = {
      ...result, category: "air_filter",
      // Brand confirmed by Donaldson; interchange compatibility remains pending.
      crossReferences: [{ partNumber: "P778984", brand: "Donaldson", relationType: "unknown", verificationStatus: "pending", evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P778984/22048" }],
      specifications: result.specifications?.filter(row => !/valve/i.test(row.label)),
    };
  }
  // Existing rectangular dimensions contradict the manufacturer's RadialSeal identity.
  // Keep these parts available for RFQ, but do not use the unverified dimensions.
  if (["P537876", "P537877"].includes(product.partNo) && product.brand.toLowerCase() === "donaldson") {
    result = { ...result, dimensionReviewRequired: true, dataQuality: "needs_review", spec: undefined,
      specifications: result.specifications?.filter(row => !isLinearDimensionLabel(row.label)),
      od_mm: undefined, id_mm: undefined, length_mm: undefined,
    };
  }
  return result;
}
