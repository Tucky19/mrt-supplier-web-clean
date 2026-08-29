import type { Product } from "@/types/product";

export type DimensionField =
  | "outerDiameterMm"
  | "innerDiameterMm"
  | "lengthMm"
  | "widthMm";

export type NormalizedDimensions = Partial<Record<DimensionField, number>> & {
  threadSize?: string;
};

export type DimensionSearchCriteria = Partial<Record<DimensionField, number>> & {
  threadSize?: string;
  toleranceMm?: number;
};

const FIELD_LABELS: Record<DimensionField, RegExp[]> = {
  outerDiameterMm: [/^outer diameter(?: \([a-z]\))?$/i, /^od$/i],
  innerDiameterMm: [
    /^inner diameter(?: \([a-z]\))?$/i,
    /^id$/i,
    /^bore(?: diameter)?$/i,
  ],
  lengthMm: [
    /^(?:overall |body )?length(?: \([a-z]\))?$/i,
    /^height(?: \([a-z]\))?$/i,
  ],
  widthMm: [/^width(?: \([a-z]\))?$/i],
};

function roundMillimeters(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function parseMillimeters(value: string | number): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const text = String(value).trim();
  if (!text) return undefined;

  const metricMatch = text.match(/(-?\d+(?:\.\d+)?)\s*mm\b/i);
  if (metricMatch) return Number(metricMatch[1]);

  const inchMatch = text.match(
    /(-?\d+(?:\.\d+)?)\s*(?:in(?:ch(?:es)?)?\b|")/i,
  );
  if (inchMatch) return roundMillimeters(Number(inchMatch[1]) * 25.4);

  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text);

  return undefined;
}

function normalizeLabel(label: string) {
  return label.trim().replace(/\s+/g, " ");
}

function normalizeThread(value: string) {
  return value.toLowerCase().replace(/[\s_/-]+/g, "");
}

function dimensionFromSpecifications(
  product: Product,
  field: DimensionField,
): number | undefined {
  for (const specification of product.specifications ?? []) {
    const label = normalizeLabel(String(specification.label ?? ""));
    if (!FIELD_LABELS[field].some((pattern) => pattern.test(label))) continue;

    const value = parseMillimeters(specification.value);
    if (value !== undefined) return value;
  }

  return undefined;
}

function parseBearingTriple(spec: string) {
  const match = spec.match(
    /(-?\d+(?:\.\d+)?)\s*[x×]\s*(-?\d+(?:\.\d+)?)\s*[x×]\s*(-?\d+(?:\.\d+)?)\s*mm\b/i,
  );

  if (!match) return {};

  return {
    innerDiameterMm: Number(match[1]),
    outerDiameterMm: Number(match[2]),
    widthMm: Number(match[3]),
  } satisfies NormalizedDimensions;
}

export function getNormalizedDimensions(product: Product): NormalizedDimensions {
  const bearingDimensions = parseBearingTriple(String(product.spec ?? ""));
  const threadSpecification = (product.specifications ?? []).find((item) =>
    /^thread(?: size)?(?: \([a-z]\))?$/i.test(
      normalizeLabel(String(item.label ?? "")),
    ),
  );

  return {
    outerDiameterMm:
      product.od_mm ??
      dimensionFromSpecifications(product, "outerDiameterMm") ??
      bearingDimensions.outerDiameterMm,
    innerDiameterMm:
      product.id_mm ??
      dimensionFromSpecifications(product, "innerDiameterMm") ??
      bearingDimensions.innerDiameterMm,
    lengthMm:
      product.length_mm ?? dimensionFromSpecifications(product, "lengthMm"),
    widthMm:
      dimensionFromSpecifications(product, "widthMm") ??
      bearingDimensions.widthMm,
    threadSize:
      product.thread ??
      (threadSpecification ? String(threadSpecification.value).trim() : undefined),
  };
}

export const FILTER_DIMENSION_TOLERANCE_MM = 3;

export function isFilterProduct(product: Product) {
  const category = String(product.category ?? "").toLowerCase();
  const title = String(product.title ?? "").toLowerCase();

  if (category.includes("bearing") || title.includes("bearing")) {
    return false;
  }

  return category.includes("filter") || title.includes("filter");
}

export function dimensionToleranceForProduct(product: Product) {
  return isFilterProduct(product) ? FILTER_DIMENSION_TOLERANCE_MM : 0;
}

function dimensionValueAfterLabel(query: string, labels: string[]) {
  const labelPattern = labels.join("|");
  const match = query.match(
    new RegExp(
      `(?:^|\\s)(?:${labelPattern})\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*(?:mm)?(?=\\s|$)`,
      "i",
    ),
  );

  return match ? Number(match[1]) : undefined;
}

export function parseDimensionSearchCriteria(
  query: string,
): DimensionSearchCriteria {
  const criteria: DimensionSearchCriteria = {
    outerDiameterMm: dimensionValueAfterLabel(query, [
      "od",
      "outer\\s*diameter",
    ]),
    innerDiameterMm: dimensionValueAfterLabel(query, [
      "id",
      "inner\\s*diameter",
      "bore(?:\\s*diameter)?",
    ]),
    lengthMm: dimensionValueAfterLabel(query, [
      "l",
      "length",
      "height",
    ]),
    widthMm: dimensionValueAfterLabel(query, ["w", "width"]),
  };
  const threadMatch = query.match(
    /(?:^|\s)thread(?:\s*size)?\s*[:=]?\s*(.+?)(?=\s+(?:od|id|outer\s*diameter|inner\s*diameter|length|height|width)\b|$)/i,
  );

  if (threadMatch?.[1]?.trim()) {
    criteria.threadSize = threadMatch[1].trim();
  }

  return criteria;
}

export function hasDimensionSearchCriteria(
  criteria: DimensionSearchCriteria,
) {
  return (
    criteria.outerDiameterMm !== undefined ||
    criteria.innerDiameterMm !== undefined ||
    criteria.lengthMm !== undefined ||
    criteria.widthMm !== undefined ||
    Boolean(criteria.threadSize?.trim())
  );
}

export function dimensionDistanceMm(
  product: Product,
  criteria: DimensionSearchCriteria,
) {
  const normalized = getNormalizedDimensions(product);
  const fields: DimensionField[] = [
    "outerDiameterMm",
    "innerDiameterMm",
    "lengthMm",
    "widthMm",
  ];

  return fields.reduce((distance, field) => {
    const requested = criteria[field];
    if (requested === undefined) return distance;

    const actual = normalized[field];
    return actual === undefined
      ? Number.POSITIVE_INFINITY
      : distance + Math.abs(actual - requested);
  }, 0);
}

export function matchesDimensions(
  product: Product,
  criteria: DimensionSearchCriteria,
) {
  const normalized = getNormalizedDimensions(product);
  const toleranceMm = Math.max(0, criteria.toleranceMm ?? 0);
  const fields: DimensionField[] = [
    "outerDiameterMm",
    "innerDiameterMm",
    "lengthMm",
    "widthMm",
  ];

  for (const field of fields) {
    const requested = criteria[field];
    if (requested === undefined) continue;

    const actual = normalized[field];
    if (actual === undefined || Math.abs(actual - requested) > toleranceMm) {
      return false;
    }
  }

  if (criteria.threadSize) {
    if (!normalized.threadSize) return false;
    if (
      normalizeThread(normalized.threadSize) !== normalizeThread(criteria.threadSize)
    ) {
      return false;
    }
  }

  return true;
}
