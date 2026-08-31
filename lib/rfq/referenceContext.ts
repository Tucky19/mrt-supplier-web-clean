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

export type RfqReferenceMetadata =
  | RfqReferenceContext
  | {
      source: "product_search_references";
      references: RfqReferenceContext[];
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

function parseRfqReferenceContext(meta: unknown): RfqReferenceContext | null {
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

function visibleContextKey(context: RfqReferenceContext): string {
  return `${context.searchQuery}|${context.matchType}`;
}

export function getRfqReferenceContexts(meta: unknown): RfqReferenceContext[] {
  const values =
    meta && typeof meta === "object" &&
    (meta as { source?: unknown }).source === "product_search_references" &&
    Array.isArray((meta as { references?: unknown }).references)
      ? (meta as { references: unknown[] }).references
      : [meta];

  const contexts = new Map<string, RfqReferenceContext>();
  for (const value of values) {
    const context = parseRfqReferenceContext(value);
    if (!context) continue;

    const key = visibleContextKey(context);
    const existing = contexts.get(key);
    contexts.set(key, {
      ...existing,
      ...context,
      matchedRelation: context.matchedRelation ?? existing?.matchedRelation,
    });
  }

  return Array.from(contexts.values());
}

export function getRfqReferenceContext(meta: unknown): RfqReferenceContext | null {
  return getRfqReferenceContexts(meta)[0] ?? null;
}

export function mergeRfqReferenceContext(
  existing: RfqReferenceMetadata | undefined,
  incoming: RfqReferenceMetadata | undefined,
): RfqReferenceMetadata | undefined {
  const contexts = getRfqReferenceContexts({
    source: "product_search_references",
    references: [
      ...getRfqReferenceContexts(existing),
      ...getRfqReferenceContexts(incoming),
    ],
  });

  if (contexts.length === 0) return undefined;
  if (contexts.length === 1) return contexts[0];
  return { source: "product_search_references", references: contexts };
}

export function getRfqReferenceContextKey(meta: unknown): string {
  return getRfqReferenceContexts(meta)
    .map(visibleContextKey)
    .sort()
    .join("||");
}
