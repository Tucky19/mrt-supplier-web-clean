export function normalizeId(input: string): string {
  return input
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[\/_-]/g, "");
}