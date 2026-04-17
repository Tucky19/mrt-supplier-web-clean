export function safeStr(value: unknown): string {
  return String(value ?? "").trim();
}

export function normalizeText(value: unknown): string {
  return safeStr(value)
    .toLowerCase()
    .replace(/[×]/g, "x")
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePart(value: unknown): string {
  return safeStr(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function canonicalPart(value: unknown): string {
  return normalizePart(value);
}

export function digitsOnly(value: unknown): string {
  return safeStr(value).replace(/\D/g, "");
}

export function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .map((v) => safeStr(v))
        .filter(Boolean)
    )
  );
}

export function buildPartKeys(partNo: string): string[] {
  const raw = safeStr(partNo);
  const normalized = normalizePart(raw);

  return uniqueStrings([raw, normalized]);
}

export function tokenize(value: unknown): string[] {
  return normalizeText(value)
    .split(" ")
    .map((x) => x.trim())
    .filter(Boolean);
}