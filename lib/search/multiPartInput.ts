export type MultiPartInputRow = {
  originalPartNo: string;
  normalizedPartNo: string;
  qty: number;
};

const MAX_ROWS = 100;
const MAX_QTY = 999;

export function normalizeMultiPartNumber(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/_.-]+/g, "");
}

function cleanPartNo(value: unknown) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function clampQty(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(parsed)));
}

function parseTextLine(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const quantityPatterns = [
    /^(.+?)\t+(\d+)$/,
    /^(.+?)\s+[xX]\s*(\d+)$/,
    /^(.+?),\s*(\d+)$/,
  ];

  for (const pattern of quantityPatterns) {
    const match = trimmed.match(pattern);
    if (!match) continue;

    return { partNo: cleanPartNo(match[1]), qty: clampQty(match[2]) };
  }

  return { partNo: cleanPartNo(trimmed), qty: 1 };
}

function mergeRows(rows: Array<{ partNo: string; qty: number }>) {
  const merged = new Map<string, MultiPartInputRow>();

  for (const row of rows) {
    const normalizedPartNo = normalizeMultiPartNumber(row.partNo);
    if (!row.partNo || !normalizedPartNo) continue;

    const existing = merged.get(normalizedPartNo);
    if (existing) {
      existing.qty = clampQty(existing.qty + row.qty);
      continue;
    }

    if (merged.size >= MAX_ROWS) break;
    merged.set(normalizedPartNo, {
      originalPartNo: row.partNo,
      normalizedPartNo,
      qty: clampQty(row.qty),
    });
  }

  return Array.from(merged.values());
}

export function parseMultiPartText(value: string) {
  const rows = value
    .split(/\r?\n/)
    .map(parseTextLine)
    .filter((row): row is { partNo: string; qty: number } => row !== null);

  return mergeRows(rows);
}

export function parseMultiPartInputs(values: unknown[]) {
  const rows: Array<{ partNo: string; qty: number }> = [];

  for (const value of values) {
    if (typeof value === "string") {
      const parsedRows = value
        .split(/\r?\n/)
        .map(parseTextLine)
        .filter((row): row is { partNo: string; qty: number } => row !== null);
      rows.push(...parsedRows);
      continue;
    }

    if (value && typeof value === "object") {
      const input = value as { partNo?: unknown; qty?: unknown };
      rows.push({
        partNo: cleanPartNo(input.partNo),
        qty: clampQty(input.qty),
      });
    }
  }

  return mergeRows(rows);
}
