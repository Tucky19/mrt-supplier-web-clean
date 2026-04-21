export const SYNONYM_MAP: Record<string, string[]> = {
  filter: [
    "oil filter",
    "fuel filter",
    "air filter",
    "hydraulic filter",
    "lube filter",
    "ไส้กรอง",
    "กรองน้ำมัน",
    "กรองอากาศ",
    "กรองเชื้อเพลิง",
  ],
  bearing: [
    "ball bearing",
    "roller bearing",
    "needle bearing",
    "ลูกปืน",
    "ตลับลูกปืน",
  ],
  seal: [
    "oil seal",
    "shaft seal",
    "mechanical seal",
    "ซีล",
    "ซีลน้ำมัน",
  ],
  belt: [
    "v belt",
    "timing belt",
    "สายพาน",
    "สายพานเครื่อง",
  ],
  gasket: [
    "ปะเก็น",
    "gasket kit",
  ],
  hydraulic: [
    "hydraulic",
    "ไฮดรอลิก",
  ],
  fuel: [
    "fuel",
    "diesel",
    "เชื้อเพลิง",
    "น้ำมันเชื้อเพลิง",
  ],
  air: [
    "air",
    "อากาศ",
  ],
  oil: [
    "oil",
    "lube",
    "น้ำมัน",
  ],
};

export function getSynonymExpansions(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const expansions = new Set<string>();

  for (const [key, values] of Object.entries(SYNONYM_MAP)) {
    if (q.includes(key) || values.some((value) => q.includes(value))) {
      expansions.add(key);
      for (const value of values) {
        expansions.add(value);
      }
    }
  }

  return Array.from(expansions);
}