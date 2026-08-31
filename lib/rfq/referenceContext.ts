import type { ProductRelation } from "@/lib/products/relations";

export type RfqReferenceContext = {
  source: "product_search";
  searchQuery: string;
  matchType: "Cross Ref" | "Same-brand Ref";
  matchedRelation?: {
    brand?: string;
    partNumber: string;
    relationType: ProductRelation["relationType"];
    verificationStatus: ProductRelation["verificationStatus"];
  };
};

function safeText(value: unknown, maxLength = 120) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export function buildRfqReferenceContext(input: {
  searchQuery: string;
  offeredPartNo: string;
  matchType?: string;
  matchedRelation?: ProductRelation;
}): RfqReferenceContext | undefined {
  if (input.matchType !== "Cross Ref" && input.matchType !== "Same-brand Ref") {
    return undefined;
  }

  const searchQuery = safeText(input.searchQuery).toUpperCase();
  const offeredPartNo = safeText(input.offeredPartNo).toUpperCase();
  if (!searchQuery || searchQuery === offeredPartNo) return undefined;

  const relation = input.matchedRelation;

  return {
    source: "product_search",
    searchQuery,
    matchType: input.matchType,
    matchedRelation: relation
      ? {
          brand: safeText(relation.brand) || undefined,
          partNumber: safeText(relation.partNumber),
          relationType: relation.relationType,
          verificationStatus: relation.verificationStatus,
        }
      : undefined,
  };
}

export function getRfqReferenceContext(meta: unknown): RfqReferenceContext | null {
  if (!meta || typeof meta !== "object") return null;

  const value = meta as Partial<RfqReferenceContext>;
  if (
    value.source !== "product_search" ||
    (value.matchType !== "Cross Ref" && value.matchType !== "Same-brand Ref")
  ) {
    return null;
  }

  const searchQuery = safeText(value.searchQuery).toUpperCase();
  if (!searchQuery) return null;

  return {
    source: "product_search",
    searchQuery,
    matchType: value.matchType,
    matchedRelation: value.matchedRelation,
  };
}

export function mergeRfqReferenceContext(
  existing: RfqReferenceContext | undefined,
  incoming: RfqReferenceContext | undefined,
): RfqReferenceContext | undefined {
  return incoming ?? existing;
}

export function getRfqReferenceContextKey(meta: unknown): string {
  const context = getRfqReferenceContext(meta);
  if (!context) return "";

  const relation = context.matchedRelation;
  return [
    context.searchQuery,
    context.matchType,
    safeText(relation?.brand).toUpperCase(),
    safeText(relation?.partNumber).toUpperCase(),
    relation?.relationType ?? "",
    relation?.verificationStatus ?? "",
  ].join("|");
}
