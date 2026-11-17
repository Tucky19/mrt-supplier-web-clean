import { products } from "@/data/products/index";
import { normalizeMultiPartNumber, parseMultiPartInputs } from "./multiPartInput";

const catalogNumbers = new Set(products.map((product) => normalizeMultiPartNumber(product.partNo)));

// Preserve RFQ bulk quantity formats and spaced catalog part numbers.
export function parseBulkPartText(value: string) {
  return parseMultiPartInputs(value.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    const explicit = trimmed.match(/^(.+?)\s*[xX]\s*(\d+)$/)
      ?? trimmed.match(/^(.+?)\s*,\s*(\d+)$/)
      ?? trimmed.match(/^(.+?)\t+(\d+)$/)
      ?? trimmed.match(/^(.+?)\s+-\s+(\d+)$/);
    if (explicit) return { partNo: explicit[1], qty: Number(explicit[2]) };
    if (catalogNumbers.has(normalizeMultiPartNumber(trimmed))) return { partNo: trimmed, qty: 1 };
    const trailing = trimmed.match(/^(.+?)\s+(\d+)$/);
    return trailing ? { partNo: trailing[1], qty: Number(trailing[2]) } : { partNo: trimmed, qty: 1 };
  }));
}
