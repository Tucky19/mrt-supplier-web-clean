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
  heightMm?: number;
  overallHeightMm?: number;
};

const FIELD_LABELS: Record<DimensionField, RegExp[]> = {
  outerDiameterMm: [/^(?:outer|outside) diameter(?: \([a-z]\)| [a-z])?$/i, /^(?:largest )?od$/i, /^largest outside diameter$/i],
  innerDiameterMm: [
    /^(?:inner|inside) diameter(?: \([a-z]\)| [a-z])?$/i,
    /^id$/i,
    /^bore(?: diameter)?$/i,
  ],
  lengthMm: [
    /^(?:body )?length(?: \([a-z]\)| [a-z])?$/i,
    /^height(?: \([a-z]\)| [a-z])?$/i,
  ],
  widthMm: [/^width(?: \([a-z]\))?$/i],
};

function roundMillimeters(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function parseMillimeters(value: string | number): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? value : undefined;
  }

  const text = String(value).trim().replace(/(\d),(\d)/g, "$1.$2");
  if (!text) return undefined;
  // Do not read the last number from ranges, negative values, or dimensions tuples.
  if (/^-|\d\s*(?:-|–|×|x)\s*\d/i.test(text)) return undefined;

  const metricMatch = text.match(/^(?:.*?\()?\s*(\d+(?:\.\d+)?)\s*mm\b/i);
  if (metricMatch) return Number(metricMatch[1]);

  const inchMatch = text.match(
    /^(\d+(?:\.\d+)?)\s*(?:in(?:ch(?:es)?)?\b|")/i,
  );
  if (inchMatch) return roundMillimeters(Number(inchMatch[1]) * 25.4);

  if (/^\d+(?:\.\d+)?$/.test(text)) return Number(text);

  return undefined;
}

function normalizeLabel(label: string) {
  return label.trim().replace(/\s*\(mm\)\s*$/i, "").replace(/\s+/g, " ");
}

export function normalizeThread(value: string) {
  return value.toLowerCase().replace(/[\s_/-]+/g, "");
}

function dimensionFromSpecifications(
  product: Product,
  field: DimensionField,
): number | undefined {
  // Prefer ordinary Length regardless of source row order.
  const rows = [...(product.specifications ?? [])];
  if (field === "lengthMm") rows.sort((a, b) =>
    Number(!/^length(?: \([a-z]\)| [a-z])?$/i.test(normalizeLabel(a.label))) -
    Number(!/^length(?: \([a-z]\)| [a-z])?$/i.test(normalizeLabel(b.label))),
  );
  for (const specification of rows) {
    const label = normalizeLabel(String(specification.label ?? ""));
    if (!FIELD_LABELS[field].some((pattern) => pattern.test(label))) continue;

    // Bare numbers are only metric when the label explicitly says so.
    const raw = specification.value;
    const value = typeof raw === "number" || /\(mm\)/i.test(specification.label) || /\b(?:mm|in|inch|inches)\b|"/i.test(String(raw))
      ? parseMillimeters(raw) : undefined;
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
  if (product.dimensionReviewRequired || product.excludeDimensionSearch) return {};
  const bearingDimensions = /bearing/i.test(`${product.category} ${product.title}`)
    ? parseBearingTriple(String(product.spec ?? "")) : {};
  const threadSpecification = (product.specifications ?? []).find((item) =>
    /^thread(?: size)?(?: \([a-z]\))?$/i.test(
      normalizeLabel(String(item.label ?? "")),
    ),
  );

  const dimensions: NormalizedDimensions = {
    outerDiameterMm:
      product.od_mm ??
      dimensionFromSpecifications(product, "outerDiameterMm") ??
      bearingDimensions.outerDiameterMm,
    innerDiameterMm:
      product.id_mm ??
      dimensionFromSpecifications(product, "innerDiameterMm") ??
      bearingDimensions.innerDiameterMm,
    lengthMm:
      dimensionFromSpecifications(product, "lengthMm") ??
      // A legacy override must not turn Overall Length into ordinary Length.
      (product.specifications?.some(row => /^overall length/i.test(normalizeLabel(row.label)))
        ? undefined : product.length_mm),
    widthMm:
      dimensionFromSpecifications(product, "widthMm") ??
      bearingDimensions.widthMm,
    threadSize:
      product.thread ??
      (threadSpecification ? String(threadSpecification.value).trim() : undefined),
  };
  for (const field of ["outerDiameterMm", "innerDiameterMm", "lengthMm", "widthMm"] as const) {
    const value = dimensions[field];
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) delete dimensions[field];
  }
  if (dimensions.outerDiameterMm !== undefined && dimensions.innerDiameterMm !== undefined && dimensions.innerDiameterMm >= dimensions.outerDiameterMm) return {};
  return dimensions;
}

// One search input accepts either explicitly labelled length, without conflating them.
export function getSearchableLengths(product: Product): number[] {
  if (product.dimensionReviewRequired || product.excludeDimensionSearch) return [];
  const ordinaryLength = getNormalizedDimensions(product).lengthMm;
  const values = [ordinaryLength];
  for (const row of product.specifications ?? []) {
    if (!/^overall length(?: \([a-z]\)| [a-z])?$/i.test(normalizeLabel(row.label))) continue;
    if (typeof row.value !== "number" && !/\(mm\)/i.test(row.label) && !/\b(?:mm|in|inch|inches)\b|"/i.test(String(row.value))) continue;
    const overallLength = parseMillimeters(row.value);
    // Owner policy: when overall is shorter than ordinary length, use ordinary only.
    if (overallLength !== undefined && (ordinaryLength === undefined || overallLength >= ordinaryLength)) {
      values.push(overallLength);
    }
  }
  return [...new Set(values.filter((value): value is number => value !== undefined && Number.isFinite(value) && value >= 0))];
}

// Height search uses the ordinary axial dimension; bearing width is its axial height.
export function getSearchHeight(product: Product): number | undefined {
  const dims = getNormalizedDimensions(product);
  return /bearing/i.test(`${product.category} ${product.title}`) ? dims.widthMm : dims.lengthMm;
}

export function getOverallSearchHeight(product: Product): number | undefined {
  if (product.dimensionReviewRequired || product.excludeDimensionSearch) return undefined;
  const ordinary = getSearchHeight(product);
  for (const row of product.specifications ?? []) {
    if (!/^overall (?:length|height)(?: \([a-z]\)| [a-z])?$/i.test(normalizeLabel(row.label))) continue;
    if (typeof row.value !== "number" && !/\(mm\)/i.test(row.label) && !/\b(?:mm|in|inch|inches)\b|"/i.test(String(row.value))) continue;
    const value = parseMillimeters(row.value);
    if (value !== undefined && (ordinary === undefined || value >= ordinary)) return value;
  }
  return undefined;
}

export const FILTER_DIMENSION_TOLERANCE_MM = 3;

export function isFilterProduct(product: Product) {
  const category = String(product.category ?? "").toLowerCase();
  const title = String(product.title ?? "").toLowerCase();

  if (category.includes("bearing") || title.includes("bearing")) {
    return false;
  }

  return category.includes("filter") || title.includes("filter") ||
    category.includes("separator") || title.includes("separator");
}

export function dimensionToleranceForProduct(product: Product) {
  return isFilterProduct(product) ? FILTER_DIMENSION_TOLERANCE_MM : 0;
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

  const heightDistance = [
    [criteria.heightMm, getSearchHeight(product)],
    [criteria.overallHeightMm, getOverallSearchHeight(product)],
  ].reduce((sum, [requested, actual]) => requested === undefined ? sum :
    sum + (actual === undefined ? Number.POSITIVE_INFINITY : Math.abs(actual - requested)), 0);
  return fields.reduce((distance, field) => {
    const requested = criteria[field];
    if (requested === undefined) return distance;

    if (field === "lengthMm") {
      return distance + Math.min(...getSearchableLengths(product).map(value => Math.abs(value - requested)));
    }
    const actual = normalized[field];
    return actual === undefined
      ? Number.POSITIVE_INFINITY
      : distance + Math.abs(actual - requested);
  }, heightDistance);
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
    if (!Number.isFinite(requested) || requested < 0) return false;

    if (field === "lengthMm") {
      if (!getSearchableLengths(product).some(value => Math.abs(value - requested) <= toleranceMm)) return false;
      continue;
    }
    const actual = normalized[field];
    if (actual === undefined || Math.abs(actual - requested) > toleranceMm) {
      return false;
    }
  }

  for (const [requested, actual] of [
    [criteria.heightMm, getSearchHeight(product)],
    [criteria.overallHeightMm, getOverallSearchHeight(product)],
  ]) {
    if (requested !== undefined && (!Number.isFinite(requested) || requested < 0 || actual === undefined || Math.abs(actual - requested) > toleranceMm)) return false;
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
