export type ProductRelationVerificationStatus =
  | "verified"
  | "pending"
  | "rejected"
  | "hidden";

export type ProductRelationType =
  | "equivalent"
  | "replaced_by"
  | "alternative"
  | "companion"
  | "local_equivalent"
  | "unknown";

export type ProductRelation = {
  partNumber: string;
  brand?: string;
  relationType: ProductRelationType;
  verificationStatus: ProductRelationVerificationStatus;
  evidence?: string;
  source?: string;
  evidenceUrl?: string;
  evidenceNote?: string;
  approvedBy?: string;
  approvedAt?: string;
  note?: string;
};

export type ProductRelationInput =
  | string
  | {
      partNumber?: unknown;
      partNo?: unknown;
      brand?: unknown;
      relationType?: unknown;
      relation?: unknown;
      verificationStatus?: unknown;
      evidence?: unknown;
      source?: unknown;
      evidenceUrl?: unknown;
      evidenceNote?: unknown;
      approvedBy?: unknown;
      approvedAt?: unknown;
      note?: unknown;
    };

const RELATION_STATUSES = new Set<ProductRelationVerificationStatus>([
  "verified",
  "pending",
  "rejected",
  "hidden",
]);

const RELATION_TYPES = new Set<ProductRelationType>([
  "equivalent",
  "replaced_by",
  "alternative",
  "companion",
  "local_equivalent",
  "unknown",
]);

function safeTrim(value: unknown) {
  const text = String(value ?? "").trim();
  return text || undefined;
}

function normalizeRelationType(
  value: unknown,
  fallback: ProductRelationType,
): ProductRelationType {
  const relationType = safeTrim(value);
  if (relationType && RELATION_TYPES.has(relationType as ProductRelationType)) {
    return relationType as ProductRelationType;
  }

  return fallback;
}

function normalizeVerificationStatus(value: unknown): ProductRelationVerificationStatus {
  const status = safeTrim(value);
  if (status && RELATION_STATUSES.has(status as ProductRelationVerificationStatus)) {
    return status as ProductRelationVerificationStatus;
  }

  return "pending";
}

function relationPartNumber(value: ProductRelationInput) {
  if (typeof value === "string") return safeTrim(value);
  return safeTrim(value.partNumber) ?? safeTrim(value.partNo);
}

export function normalizeProductRelations(
  values: unknown,
  defaultRelationType: ProductRelationType,
): ProductRelation[] {
  if (!Array.isArray(values)) return [];

  return values
    .map((value): ProductRelation | null => {
      if (typeof value === "string") {
        const partNumber = safeTrim(value);
        if (!partNumber) return null;

        return {
          partNumber,
          relationType: defaultRelationType,
          verificationStatus: "pending",
        };
      }

      if (!value || typeof value !== "object") return null;

      const input = value as Exclude<ProductRelationInput, string>;
      const partNumber = relationPartNumber(input);
      if (!partNumber) return null;

      const relationType = normalizeRelationType(
        input.relationType ?? input.relation,
        defaultRelationType,
      );
      const verificationStatus = normalizeVerificationStatus(input.verificationStatus);
      const evidence = safeTrim(input.evidence);
      const source = safeTrim(input.source);
      const evidenceUrl = safeTrim(input.evidenceUrl);
      const evidenceNote = safeTrim(input.evidenceNote);
      const approvedBy = safeTrim(input.approvedBy);
      const approvedAt = safeTrim(input.approvedAt);
      const verifiedAllowed = Boolean(
        (evidence || source || evidenceUrl || evidenceNote) && approvedBy && approvedAt,
      );

      return {
        partNumber,
        brand: safeTrim(input.brand),
        relationType,
        verificationStatus:
          verificationStatus === "verified" && !verifiedAllowed
            ? "pending"
            : verificationStatus,
        evidence,
        source,
        evidenceUrl,
        evidenceNote,
        approvedBy,
        approvedAt,
        note: safeTrim(input.note),
      };
    })
    .filter((relation): relation is ProductRelation => relation !== null);
}

export function relationPartNumbers(
  values: unknown,
  defaultRelationType: ProductRelationType,
): string[] {
  return normalizeProductRelations(values, defaultRelationType).map(
    (relation) => relation.partNumber,
  );
}

export function uniqueRelationPartNumbers(
  values: unknown,
  defaultRelationType: ProductRelationType,
): string[] {
  return Array.from(new Set(relationPartNumbers(values, defaultRelationType)));
}

function normalizedPartKey(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function normalizedTextKey(value: string | undefined) {
  return String(value ?? "").trim().toLowerCase();
}

function relationMetadataKey(relation: ProductRelation) {
  return [
    normalizedPartKey(relation.partNumber),
    normalizedTextKey(relation.brand),
    relation.relationType,
    relation.verificationStatus,
    normalizedTextKey(relation.evidence),
    normalizedTextKey(relation.source),
    normalizedTextKey(relation.evidenceUrl),
    normalizedTextKey(relation.evidenceNote),
    normalizedTextKey(relation.approvedBy),
    normalizedTextKey(relation.approvedAt),
    normalizedTextKey(relation.note),
  ].join("|");
}

export function normalizeCanonicalProductRelations(
  values: unknown,
  defaultRelationType: ProductRelationType,
): ProductRelationInput[] {
  if (!Array.isArray(values)) return [];

  const output: ProductRelationInput[] = [];
  const legacyPartIndexes = new Map<string, number>();
  const structuredPartKeys = new Set<string>();
  const structuredMetadataKeys = new Set<string>();

  for (const value of values) {
    if (typeof value === "string") {
      const partNumber = safeTrim(value);
      if (!partNumber) continue;

      const partKey = normalizedPartKey(partNumber);
      if (structuredPartKeys.has(partKey) || legacyPartIndexes.has(partKey)) {
        continue;
      }

      legacyPartIndexes.set(partKey, output.length);
      output.push(partNumber);
      continue;
    }

    const [relation] = normalizeProductRelations([value], defaultRelationType);
    if (!relation) continue;

    const partKey = normalizedPartKey(relation.partNumber);
    const metadataKey = relationMetadataKey(relation);
    if (structuredMetadataKeys.has(metadataKey)) continue;

    const legacyIndex = legacyPartIndexes.get(partKey);
    if (legacyIndex !== undefined) {
      output.splice(legacyIndex, 1);
      legacyPartIndexes.delete(partKey);

      for (const [key, index] of legacyPartIndexes) {
        if (index > legacyIndex) {
          legacyPartIndexes.set(key, index - 1);
        }
      }
    }

    structuredPartKeys.add(partKey);
    structuredMetadataKeys.add(metadataKey);
    output.push(relation);
  }

  return output;
}

export function hasRelationEvidence(relation: ProductRelation) {
  return Boolean(
    relation.evidence ||
      relation.source ||
      relation.evidenceUrl ||
      relation.evidenceNote,
  );
}
