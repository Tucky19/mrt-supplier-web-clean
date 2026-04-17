export function formatTolerance(mm?: number) {
  if (!mm) return null;
  return `${mm}±3mm`;
}

export function buildSpecSummary(p: any) {
  const od = formatTolerance(p.dimensions?.outer_diameter_mm);
  const len = formatTolerance(p.dimensions?.length_mm);
  const thread = p.thread?.raw;

  const parts = [];
  if (od) parts.push(`OD ${od}`);
  if (len) parts.push(`L ${len}`);
  if (thread) parts.push(thread);

  return parts.join(" × ");
}
export function formatWithTolerance(mm?: number | null) {
  if (mm === undefined || mm === null || Number.isNaN(mm as any)) return "-";
  const n = Math.round(Number(mm));
  return `${n} mm (±3 mm)`;
}