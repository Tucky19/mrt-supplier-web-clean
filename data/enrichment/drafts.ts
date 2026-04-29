export type ProductDataQuality = "basic" | "enriched" | "verified";
export type ProductEnrichStatus = "pending" | "needs_review" | "verified";

export type ProductEnrichmentDraft = {
  id: string;
  partNo: string;
  brand: "Donaldson" | string;
  category: string;
  title: string;
  shortDescription: string;
  description: string;
  spec: string;
  specifications: { label: string; value: string }[];
  applications: string[];
  officialUrl: string | null;
  officialImageUrl: string | null;
  stockStatus: "in_stock" | "low_stock" | "request";
  sourceType: "mixed" | "official" | "manual";
  refs: string[];
  crossReferences: string[];
  dataQuality: ProductDataQuality;
  enrichStatus: ProductEnrichStatus;
};

const DONALDSON_PARTS = [
  "P553004",
  "P550084",
  "P550162",
  "P558615",
  "P554620",
  "P554685",
  "P555461",
  "P550057",
  "P550008",
  "P550920",
  "P550848",
  "P550335",
  "P550020",
  "P550820",
  "P550777",
  "P550105",
  "P550132",
  "P550065",
  "P550086",
  "P550223",
  "P550222",
] as const;

function makeDonaldsonDraft(partNo: string): ProductEnrichmentDraft {
  return {
    id: `donaldson-${partNo.toLowerCase()}`,
    partNo,
    brand: "Donaldson",
    category: "filter",
    title: "Donaldson Filter",
    shortDescription:
      "Industrial-grade Donaldson filter for equipment and engine systems.",
    description:
      "Donaldson filter prepared as a catalog draft for RFQ discovery. Final technical specifications should be verified before publishing as enriched or verified product data.",
    spec: "-",
    specifications: [],
    applications: [],
    officialUrl: null,
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "mixed",
    refs: [],
    crossReferences: [],
    dataQuality: "basic",
    enrichStatus: "pending",
  };
}

export const productEnrichmentDrafts: ProductEnrichmentDraft[] =
  DONALDSON_PARTS.map(makeDonaldsonDraft);

export function getProductEnrichmentDraft(partNo: string) {
  const normalized = partNo.trim().toUpperCase();

  return productEnrichmentDrafts.find(
    (draft) => draft.partNo.trim().toUpperCase() === normalized
  );
}

export function getPendingProductEnrichmentDrafts() {
  return productEnrichmentDrafts.filter(
    (draft) => draft.enrichStatus === "pending"
  );
}