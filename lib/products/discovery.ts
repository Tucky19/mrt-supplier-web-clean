// Focused discovery copy based on the existing catalog and supplied specifications.
// No stock or compatibility claims: those remain owned by the product record.
export const productDiscovery = [
  { partNo: "P552050", th: "กรองน้ำมันเครื่อง", en: "Lube filter" },
  { partNo: "P550225", th: "กรองน้ำมันเชื้อเพลิง", en: "Fuel filter" },
  { partNo: "P551853", th: "กรองเชื้อเพลิงแยกน้ำ", en: "Fuel water separator" },
  { partNo: "P550453", th: "กรองน้ำมันเครื่องแบบไส้", en: "Lube filter cartridge" },
  { partNo: "P551026", th: "กรองเชื้อเพลิงแยกน้ำ", en: "Fuel water separator" },
  { partNo: "P781466", th: "กรองแอร์ดรายเออร์", en: "Air dryer filter" },
  { partNo: "P954895", th: "กรองเชื้อเพลิงแยกน้ำ", en: "Fuel water separator" },
  { partNo: "CU31001", th: "กรองแอร์ห้องโดยสาร", en: "Cabin air filter" },
  { partNo: "P506115", th: "กรองน้ำมันเชื้อเพลิงแบบไส้", en: "Fuel filter cartridge" },
  { partNo: "P550958", th: "กรองน้ำมันเชื้อเพลิง", en: "Fuel filter" },
] as const;

export function getProductDiscoveryLabel(partNo: string, locale: string) {
  const entry = productDiscovery.find((item) => item.partNo === partNo);
  return entry ? (locale === "th" ? entry.th : entry.en) : undefined;
}
