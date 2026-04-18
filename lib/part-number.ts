export function normalizePartNo(value: string): string {
  return value.trim().toUpperCase().replace(/[\s\-_]/g, '');
}