type JsonRecord = Record<string, unknown>;

type MissingProductRequestDimensions = {
  outerDiameter: string | null;
  innerDiameter: string | null;
  lengthHeight: string | null;
  threadSize: string | null;
  gasketOD: string | null;
  gasketID: string | null;
};

export type MissingProductRequestMeta = {
  requestType: "missing_product_request";
  filterType: string | null;
  machineApplication: string | null;
  details: string | null;
  searchQuery: string | null;
  sourcePage: string | null;
  locale: string | null;
  dimensions: MissingProductRequestDimensions;
};

export type MissingProductRequestItemLike = {
  productId?: string | null;
  partNo?: string | null;
  brand?: string | null;
  category?: string | null;
  title?: string | null;
  spec?: string | null;
  qty?: number | null;
  meta?: unknown;
};

function safeStr(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): JsonRecord | null {
  return typeof value === "object" && value !== null
    ? (value as JsonRecord)
    : null;
}

function nullableStr(value: unknown) {
  const normalized = safeStr(value);
  return normalized || null;
}

export function getMissingProductRequestLabel() {
  return "Missing Product Request / คำขอสินค้าที่ค้นหาไม่เจอ";
}

export function isMissingProductRequestSource(source: string | null | undefined) {
  return safeStr(source) === "missing_product_request";
}

export function parseMissingProductRequestMeta(
  meta: unknown,
): MissingProductRequestMeta | null {
  const data = asRecord(meta);
  if (!data || data.requestType !== "missing_product_request") {
    return null;
  }

  const dimensions = asRecord(data.dimensions);

  return {
    requestType: "missing_product_request",
    filterType: nullableStr(data.filterType),
    machineApplication: nullableStr(data.machineApplication),
    details: nullableStr(data.details),
    searchQuery: nullableStr(data.searchQuery),
    sourcePage: nullableStr(data.sourcePage),
    locale: nullableStr(data.locale),
    dimensions: {
      outerDiameter: nullableStr(dimensions?.outerDiameter),
      innerDiameter: nullableStr(dimensions?.innerDiameter),
      lengthHeight: nullableStr(dimensions?.lengthHeight),
      threadSize: nullableStr(dimensions?.threadSize),
      gasketOD: nullableStr(dimensions?.gasketOD),
      gasketID: nullableStr(dimensions?.gasketID),
    },
  };
}

export function isMissingProductRequestItem(item: MissingProductRequestItemLike) {
  return (
    parseMissingProductRequestMeta(item.meta) !== null ||
    safeStr(item.productId) === "missing-product-request"
  );
}

export function getMissingProductRequestItemDetails(
  item: MissingProductRequestItemLike,
) {
  const meta = parseMissingProductRequestMeta(item.meta);
  if (!meta && !isMissingProductRequestItem(item)) {
    return null;
  }

  return {
    requestTypeLabel: getMissingProductRequestLabel(),
    partNo: nullableStr(item.partNo),
    filterType: meta?.filterType ?? nullableStr(item.category),
    brand: nullableStr(item.brand),
    qty: typeof item.qty === "number" ? item.qty : null,
    machineApplication: meta?.machineApplication ?? null,
    outerDiameter: meta?.dimensions.outerDiameter ?? null,
    innerDiameter: meta?.dimensions.innerDiameter ?? null,
    lengthHeight: meta?.dimensions.lengthHeight ?? null,
    threadSize: meta?.dimensions.threadSize ?? null,
    gasketOD: meta?.dimensions.gasketOD ?? null,
    gasketID: meta?.dimensions.gasketID ?? null,
    note: meta?.details ?? null,
    searchQuery: meta?.searchQuery ?? null,
    sourcePage: meta?.sourcePage ?? null,
    locale: meta?.locale ?? null,
    dimensionSummary: nullableStr(item.spec),
  };
}

export function buildMissingProductRequestDimensionSummary(details: {
  outerDiameter?: string | null;
  innerDiameter?: string | null;
  lengthHeight?: string | null;
  threadSize?: string | null;
  gasketOD?: string | null;
  gasketID?: string | null;
}) {
  return [
    details.outerDiameter ? `OD ${details.outerDiameter}` : "",
    details.innerDiameter ? `ID ${details.innerDiameter}` : "",
    details.lengthHeight ? `L/H ${details.lengthHeight}` : "",
    details.threadSize ? `Thread ${details.threadSize}` : "",
    details.gasketOD ? `Gasket OD ${details.gasketOD}` : "",
    details.gasketID ? `Gasket ID ${details.gasketID}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

export function buildContactMethodPresenceSummary(contact: {
  phone?: string | null;
  email?: string | null;
  lineId?: string | null;
}) {
  const methods = [
    contact.phone ? "Phone" : "",
    contact.email ? "Email" : "",
    contact.lineId ? "LINE" : "",
  ].filter(Boolean);

  return methods.length > 0 ? methods.join(", ") : "No direct contact method";
}
