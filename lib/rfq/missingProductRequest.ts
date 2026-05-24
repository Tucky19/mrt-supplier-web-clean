type JsonRecord = Record<string, unknown>;

export type MissingProductRequestThreadSystem =
  | "inch_un_npt"
  | "metric_m"
  | "not_sure";

type MissingProductRequestDimensions = {
  outerDiameter: string | null;
  innerDiameter: string | null;
  lengthHeight: string | null;
  threadSystem: MissingProductRequestThreadSystem | null;
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

export type MissingProductRequestSuggestedStatusLabel =
  | "New"
  | "Reviewing"
  | "Need More Info"
  | "Quoted"
  | "Added to Catalog"
  | "Closed";

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

function nullableThreadSystem(value: unknown): MissingProductRequestThreadSystem | null {
  const normalized = safeStr(value);

  if (
    normalized === "inch_un_npt" ||
    normalized === "metric_m" ||
    normalized === "not_sure"
  ) {
    return normalized;
  }

  return null;
}

export function getMissingProductRequestLabel() {
  return "Missing Product Request / คำขอสินค้าที่ค้นหาไม่เจอ";
}

export function getMissingProductRequestSuggestedStatusLabel(input: {
  rfqStatus: string | null | undefined;
  noteBodies?: Array<string | null | undefined>;
  followUpNotes?: Array<string | null | undefined>;
}): MissingProductRequestSuggestedStatusLabel {
  const rfqStatus = safeStr(input.rfqStatus).toLowerCase();
  const combinedText = [...(input.noteBodies ?? []), ...(input.followUpNotes ?? [])]
    .map((value) => safeStr(value).toLowerCase())
    .filter(Boolean)
    .join("\n");

  if (
    combinedText.includes("added to catalog") ||
    combinedText.includes("catalog added") ||
    combinedText.includes("catalogue added") ||
    combinedText.includes("เพิ่มเข้าคาตาล็อก") ||
    combinedText.includes("เพิ่มเข้าระบบสินค้า") ||
    combinedText.includes("เพิ่มสินค้าเข้าระบบ")
  ) {
    return "Added to Catalog";
  }

  if (rfqStatus === "quoted") {
    return "Quoted";
  }

  if (
    combinedText.includes("need more info") ||
    combinedText.includes("more info") ||
    combinedText.includes("awaiting customer") ||
    combinedText.includes("waiting customer") ||
    combinedText.includes("ขอข้อมูลเพิ่มเติม") ||
    combinedText.includes("ขอข้อมูลเพิ่ม") ||
    combinedText.includes("รอข้อมูล") ||
    combinedText.includes("รอลูกค้า")
  ) {
    return "Need More Info";
  }

  if (rfqStatus === "in_progress") {
    return "Reviewing";
  }

  if (rfqStatus === "closed" || rfqStatus === "spam") {
    return "Closed";
  }

  return "New";
}

export function getMissingProductRequestReplyTemplates(input: {
  requestId: string;
  partNo?: string | null;
  filterType?: string | null;
}) {
  const reference = safeStr(input.partNo) || safeStr(input.filterType) || input.requestId;

  return [
    {
      id: "acknowledged",
      title: "รับเรื่องแล้ว กำลังตรวจสอบ",
      body: `เรียนลูกค้า\n\nMRT Supplier ได้รับคำขอสินค้าที่ค้นหาไม่เจอสำหรับรายการ ${reference} เรียบร้อยแล้ว ขณะนี้ทีมงานกำลังตรวจสอบสเปกและเบอร์เทียบที่เกี่ยวข้องให้โดยเร็ว\n\nหากมีข้อมูลเพิ่มเติมที่ต้องการแจ้ง สามารถส่งกลับมาได้ตลอดครับ/ค่ะ\n\nขอบพระคุณครับ/ค่ะ`,
    },
    {
      id: "need-more-info",
      title: "ขอข้อมูลเพิ่มเติม",
      body: `เรียนลูกค้า\n\nเพื่อให้ MRT Supplier ช่วยตรวจสอบรายการ ${reference} ได้แม่นยำมากขึ้น รบกวนขอข้อมูลเพิ่มเติม เช่น\n- รูปสินค้าหรือป้ายสเปก\n- ขนาดที่วัดได้\n- รุ่นเครื่อง / การใช้งาน\n- เบอร์เดิมหรือเบอร์ที่ใกล้เคียง (ถ้ามี)\n\nเมื่อได้รับข้อมูลเพิ่มเติมแล้ว ทีมงานจะรีบตรวจสอบและตอบกลับให้ครับ/ค่ะ\n\nขอบพระคุณครับ/ค่ะ`,
    },
    {
      id: "preliminary-cross-reference",
      title: "แจ้งเบอร์เทียบเบื้องต้น",
      body: `เรียนลูกค้า\n\nจากข้อมูลเบื้องต้น MRT Supplier พบเบอร์เทียบที่อาจเกี่ยวข้องกับรายการ ${reference} ดังนี้\n[ระบุเบอร์เทียบเบื้องต้น]\n\nรบกวนตรวจสอบร่วมกับสเปก / ขนาด / ลักษณะการใช้งานอีกครั้งก่อนยืนยันสั่งซื้อ หากต้องการให้ทีมงานช่วยเช็กเพิ่มเติม สามารถแจ้งข้อมูลเพิ่มได้เลยครับ/ค่ะ\n\nขอบพระคุณครับ/ค่ะ`,
    },
  ] as const;
}

export function getMissingProductThreadSystemLabel(
  value: MissingProductRequestThreadSystem | null | undefined,
) {
  switch (value) {
    case "inch_un_npt":
      return "Inch / UN / NPT";
    case "metric_m":
      return "Metric / M";
    case "not_sure":
      return "Not sure";
    default:
      return null;
  }
}

export function formatMissingProductThreadDetail(details: {
  threadSystem?: MissingProductRequestThreadSystem | string | null;
  threadSize?: string | null;
}) {
  const threadSystemLabel = getMissingProductThreadSystemLabel(
    nullableThreadSystem(details.threadSystem),
  );
  const threadSize = nullableStr(details.threadSize);

  if (threadSystemLabel && threadSize) {
    return `${threadSystemLabel} ${threadSize}`;
  }

  return threadSystemLabel || threadSize;
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
      threadSystem: nullableThreadSystem(dimensions?.threadSystem),
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
    threadSystem: meta?.dimensions.threadSystem ?? null,
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
  threadSystem?: MissingProductRequestThreadSystem | string | null;
  threadSize?: string | null;
  gasketOD?: string | null;
  gasketID?: string | null;
}) {
  const threadDetail = formatMissingProductThreadDetail(details);

  return [
    details.outerDiameter ? `OD ${details.outerDiameter}` : "",
    details.innerDiameter ? `ID ${details.innerDiameter}` : "",
    details.lengthHeight ? `L/H ${details.lengthHeight}` : "",
    threadDetail ? `Thread ${threadDetail}` : "",
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
