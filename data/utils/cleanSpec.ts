// data/utils/cleanSpec.ts
export function cleanSpecText(input: unknown) {
  const s = String(input ?? "").trim();

  // ตัด junk ที่มาจาก tracking/script
  const kill = [
    "adobeDataLayer",
    "window[dataLayerName]",
    "JSON.parse(",
    "event:'cmp:show'",
    "repo:path",
    "xdm:",
  ];

  if (kill.some((k) => s.includes(k))) return "";

  // ตัดยาวเกินจริง (กัน paste web ทั้งหน้า)
  if (s.length > 500) return s.slice(0, 500).trim();

  return s;
}
