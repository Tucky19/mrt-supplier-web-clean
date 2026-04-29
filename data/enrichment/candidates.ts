export type EnrichmentReason =
  | "has_image"
  | "high_search"
  | "high_click"
  | "high_rfq"
  | "manual_priority";

export type EnrichmentCandidate = {
  partNo: string;
  brand: "Donaldson" | string;
  reason: EnrichmentReason;
  priority: number;
  note?: string;
};

export const enrichmentCandidates: EnrichmentCandidate[] = [
  {
    partNo: "P553004",
    brand: "Donaldson",
    reason: "manual_priority",
    priority: 100,
    note: "Baseline product used for routing, image, RFQ, and OG testing.",
  },
  {
    partNo: "P550084",
    brand: "Donaldson",
    reason: "has_image",
    priority: 92,
  },
  {
    partNo: "P550162",
    brand: "Donaldson",
    reason: "has_image",
    priority: 90,
  },
  {
    partNo: "P558615",
    brand: "Donaldson",
    reason: "has_image",
    priority: 88,
  },
  {
    partNo: "P554620",
    brand: "Donaldson",
    reason: "has_image",
    priority: 86,
  },
  {
    partNo: "P554685",
    brand: "Donaldson",
    reason: "has_image",
    priority: 84,
  },
  {
    partNo: "P555461",
    brand: "Donaldson",
    reason: "has_image",
    priority: 82,
  },
  {
    partNo: "P550057",
    brand: "Donaldson",
    reason: "has_image",
    priority: 80,
  },
  {
    partNo: "P550008",
    brand: "Donaldson",
    reason: "has_image",
    priority: 78,
  },
  {
    partNo: "P550920",
    brand: "Donaldson",
    reason: "has_image",
    priority: 76,
  },
  {
    partNo: "P550848",
    brand: "Donaldson",
    reason: "has_image",
    priority: 74,
  },
  {
    partNo: "P550335",
    brand: "Donaldson",
    reason: "has_image",
    priority: 72,
  },
  {
    partNo: "P550020",
    brand: "Donaldson",
    reason: "has_image",
    priority: 70,
  },
  {
    partNo: "P550820",
    brand: "Donaldson",
    reason: "has_image",
    priority: 68,
  },
  {
    partNo: "P550777",
    brand: "Donaldson",
    reason: "has_image",
    priority: 66,
  },
  {
    partNo: "P550105",
    brand: "Donaldson",
    reason: "has_image",
    priority: 64,
  },
  {
    partNo: "P550132",
    brand: "Donaldson",
    reason: "has_image",
    priority: 62,
  },
  {
    partNo: "P550065",
    brand: "Donaldson",
    reason: "has_image",
    priority: 60,
  },
  {
    partNo: "P550086",
    brand: "Donaldson",
    reason: "has_image",
    priority: 58,
  },
  {
    partNo: "P550223",
    brand: "Donaldson",
    reason: "has_image",
    priority: 56,
  },
  {
    partNo: "P550222",
    brand: "Donaldson",
    reason: "has_image",
    priority: 54,
  },
];

export function getEnrichmentCandidate(partNo: string) {
  const normalized = partNo.trim().toUpperCase();

  return enrichmentCandidates.find(
    (candidate) => candidate.partNo.trim().toUpperCase() === normalized
  );
}

export function getSortedEnrichmentCandidates() {
  return [...enrichmentCandidates].sort((a, b) => b.priority - a.priority);
}