export function buildSearchTokens(value: string) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .split(/[\s/_-]+/)
    .filter(Boolean);
}