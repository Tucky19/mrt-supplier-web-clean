// lib/searchTokens.ts
function norm(s: unknown) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_/]/g, "");
}

function splitAlphaNum(s: string) {
  const raw = String(s || "").toLowerCase();
  const n = norm(raw);

  const chunks: string[] = [];
  if (raw) chunks.push(raw);
  if (n && n !== raw) chunks.push(n);

  chunks.push(...(n.match(/\d+/g) ?? []));
  chunks.push(...(n.match(/[a-z]+/g) ?? []));

  const letters = n.replace(/[^a-z]+/g, "");
  const nums = n.replace(/[^0-9]+/g, "");
  if (letters) chunks.push(letters);
  if (nums) chunks.push(nums);

  return chunks;
}

export function buildSearchTokens(input: {
  partNo: string;
  brand?: string;
  title?: string;
  series?: string;
  spec?: string;
  threadRaw?: string;
  extra?: string[];
}) {
  const base: string[] = [];
  base.push(...splitAlphaNum(input.partNo));
  if (input.brand) base.push(norm(input.brand), input.brand.toLowerCase());
  if (input.series) base.push(norm(input.series), input.series.toLowerCase());
  if (input.title) base.push(...splitAlphaNum(input.title));
  if (input.spec) base.push(...splitAlphaNum(input.spec));
  if (input.threadRaw) base.push(norm(input.threadRaw), input.threadRaw.toLowerCase());
  if (input.extra?.length) base.push(...input.extra.flatMap(splitAlphaNum));
  return Array.from(new Set(base.filter(Boolean))).slice(0, 80);
}
