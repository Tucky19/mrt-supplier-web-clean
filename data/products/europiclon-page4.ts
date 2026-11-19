import type { Product } from "@/types/product";
import { normalizeProductRelations, type ProductRelationInput } from "@/lib/products/relations";

export const europiclonPage4Source = {
  publication: "Donaldson F111409 ENG (3/21), page 4",
  url: "https://www.donaldson.com/content/dam/donaldson/engine-hydraulics-bulk/literature/north-america/air/F111409-ENG/Air-Filters-for-Mann-Hummel-Europiclon.pdf#page=4",
  approvedBy: "Boss/MRT Supplier",
  approvedAt: "2026-11-19",
};

// Literal column order: Donaldson, Mann+Hummel, Baldwin, Fleetguard, Luber-finer, Wix.
// Null means no code is published. Rows are not primary/safety pairing evidence.
type Row = readonly [donaldson: string, mann: string, baldwin: string, fleetguard: string | null, luberFiner: string | null, wix: string | null];
export const europiclonPrimaryRows: readonly Row[] = [
  ["P778972", "C16400", "RS3922", "AF26393", "LAF9101", "46818"],
  ["P778979", "C11100", "RS3990", "AF26387", null, "49978"],
  ["P778984", "C14200", "RS3942", "AF26389", "LAF8749", "49462"],
  ["P778989", "C15300", "RS3920", "AF26391", "LAF3947", "46836"],
  ["P778994", "C20500", "RS3992", "AF26395", "LAF2342", "49131"],
  ["P782104", "C23610", "RS3994", "AF26397", "LAF4601", "49783"],
  ["P782105", "C257103", "RS3996", "AF26399", "LAF6098", "49711"],
  ["P782106", "C308103", "RS3998", "AF26401", "LAF6998", "49811"],
  ["P782328", "C259501", "RS4562", "AF25704", "LAF5704", null],
  ["P782880", "C258606", "RS4969", "AF25876", "LAF6682", null],
  ["P782881", "C256602", "RS4968", "AF25875", "LAF6683", null],
  ["P782936", "C2712501", "RS4971", "AF25894", "LAF6936", "WA10398"],
  ["P784198", "C258605", "RS5537", null, null, "WA10134"],
  ["P784456", "C2713202", "RS5508", "AF26202", null, null],
  ["P784457", "C2713203", "RS5358", "AF26242", "LAF6242", "49558"],
  ["P784525", "C2711704", "RS4959", "AF25975", null, null],
  ["P785352", "C3214202", "RS5356", "AF26241", "LAF6689", null],
  ["P786421", "C271170", "RS5534", "AF26246", "LAF6246", "49464"],
  ["P789377", "C261100", "RS5488", "AF26677", null, null],
];
export const europiclonSafetyRows: readonly Row[] = [
  ["P780012", "CF400", "RS3923", "AF26394", "LAF9100", "46829"],
  ["P780018", "CF100", "RS3991", "AF26388", null, "49968"],
  ["P780024", "CF200", "RS3943", "AF26390", "LAF8750", "49463"],
  ["P780030", "CF300", "RS3921", "AF26392", "LAF3948", "46837"],
  ["P780036", "CF500", "RS3993", "AF26396", "LAF2343", "49132"],
  ["P782107", "CF610", "RS3995", "AF26398", "LAF4602", "49782"],
  ["P782108", "CF710", "RS3997", "AF26400", "LAF6099", "49710"],
  ["P782109", "CF810", "RS3999", "AF26402", "LAF6999", "49810"],
  ["P782937", "CF1640", "RS5361", "AF25896", "LAF6937", null],
];
export const europiclonColumnBrands = ["Donaldson", "MANN-FILTER", "Baldwin", "Fleetguard", "Luber-finer", "Wix"] as const;
export const europiclonPage4Rows = [
  ...europiclonPrimaryRows.map((parts, index) => ({ role: "primary" as const, row: index + 1, parts })),
  ...europiclonSafetyRows.map((parts, index) => ({ role: "safety" as const, row: index + 1, parts })),
];

export function europiclonPartKey(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}
function brandKey(value: string) {
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ["mann", "mannfilter", "mannhummel"].includes(key) ? "mann" : key;
}
function matches(value: ProductRelationInput, brand: string, part: string) {
  if (typeof value === "string") {
    const colon = value.indexOf(":");
    return colon < 0 ? europiclonPartKey(value) === europiclonPartKey(part)
      : brandKey(value.slice(0, colon)) === brandKey(brand) && europiclonPartKey(value.slice(colon + 1)) === europiclonPartKey(part);
  }
  return (!value.brand || brandKey(String(value.brand)) === brandKey(brand)) &&
    europiclonPartKey(String(value.partNumber ?? value.partNo ?? "")) === europiclonPartKey(part);
}

// Direct Donaldson-to-competitor edges only. No competitor clique, transitivity,
// new products, dimensions, primary/safety pairs or machinery fitment are inferred.
export function applyEuropiclonPage4(product: Product): Product {
  const found = europiclonPage4Rows.find(({ parts }) => parts.some((part, column) => part &&
    brandKey(product.brand) === brandKey(europiclonColumnBrands[column]) && europiclonPartKey(product.partNo) === europiclonPartKey(part)));
  if (!found) return product;
  const isDonaldson = brandKey(product.brand) === "donaldson";
  const targets = isDonaldson ? found.parts.map((part, column) => ({ part, column })).slice(1) : [{ part: found.parts[0], column: 0 }];
  let crossReferences = [...(product.crossReferences ?? [])];
  let refs = [...(product.refs ?? [])];
  for (const { part, column } of targets) {
    if (!part) continue;
    const brand = europiclonColumnBrands[column];
    const previous = [...crossReferences, ...refs].filter(value => matches(value, brand, part));
    const structured = normalizeProductRelations(previous.filter(value => typeof value !== "string"), "unknown");
    // An explicit contrary decision needs review, not a silent override.
    if (structured.some(value => ["rejected", "hidden"].includes(value.verificationStatus) || !["unknown", "equivalent"].includes(value.relationType))) continue;
    const prior = structured[0];
    const citation = `${europiclonPage4Source.publication}; ${found.role} row ${found.row}; ${found.parts[0]} vs ${brand} ${part}.`;
    if (previous.length === 1 && crossReferences.some(value => matches(value, brand, part)) && prior?.evidenceUrl === europiclonPage4Source.url && prior.evidenceNote?.includes(citation) && prior.verificationStatus === "verified") continue;
    const evidenceNote = [prior?.evidenceNote, prior?.evidenceUrl && prior.evidenceUrl !== europiclonPage4Source.url ? `Prior source: ${prior.evidenceUrl}` : undefined,
      prior?.approvedAt ? `Prior approval: ${prior.approvedBy ?? "unspecified"}, ${prior.approvedAt}` : undefined,
      citation, "Manufacturer row cross-reference only; no primary/safety pairing or exact machinery fitment established."].filter(Boolean).join("\n");
    crossReferences = crossReferences.filter(value => !matches(value, brand, part));
    refs = refs.filter(value => !matches(value, brand, part));
    crossReferences.push({ ...prior, partNumber: part, brand, relationType: "equivalent", verificationStatus: "verified",
      source: europiclonPage4Source.publication, evidence: prior?.evidence ?? citation, evidenceUrl: europiclonPage4Source.url,
      evidenceNote, approvedBy: europiclonPage4Source.approvedBy, approvedAt: europiclonPage4Source.approvedAt });
  }
  return { ...product, refs, crossReferences };
}
