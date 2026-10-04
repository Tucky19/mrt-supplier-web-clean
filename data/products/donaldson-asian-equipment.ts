import type { CatalogApplication, Product } from "@/types/product";
import sourceRows from "./donaldson-asian-equipment.json";

const source = "Donaldson F210074 — Filtration Solutions for Asian Equipment: Southern Africa";
const key = (value: string) => value.toLowerCase().replace(/[\s/_-]+/g, "");
const applicationsByPart = new Map<string, CatalogApplication[]>();

function machineDetails(equipment: string) {
  // Preserve the manufacturer's spelling. Engine variants stay in equipment.
  const machine = equipment.split(/\s+(?:Yanmar|Isuzu|Mitsubishi|SANY|Cummins|Weichai Power|Wechai|FAWDE|YUCHAI|Perkins|Guangxi Cummins|MTU|Deutz AG|WEICHAI|wechai|Sinotruk\(CNHTC\))\s+(?:Engine|Engin|Emgone)/i)[0]
    .replace(/\s+(?:D10|MC07)\s+Engine$/i, "");
  const [machineBrand, ...model] = machine.split(/\s+/);
  return { machineBrand, machineModel: model.join(" ") || undefined };
}

for (const row of sourceRows) {
  for (const partNo of row.parts) {
    const entries = applicationsByPart.get(key(partNo)) ?? [];
    // Keep page/table context. Never propagate a blank cell or create a kit from adjacent rows.
    const entry: CatalogApplication = {
      equipment: row.equipment,
      ...machineDetails(row.equipment),
      description: row.description,
      oemRaw: row.oemRaw,
      oemPartNumbers: row.oemPartNumbers,
      source,
      page: row.page,
      sourceTable: row.block,
      needsReview: row.reviewReasons.length > 0,
    };
    if (!entries.some((existing) => existing.page === entry.page &&
      existing.equipment === entry.equipment && existing.description === entry.description &&
      existing.oemRaw === entry.oemRaw)) entries.push(entry);
    applicationsByPart.set(key(partNo), entries);
  }
}

function category(description: string) {
  if (description.startsWith("AIR FILTER")) return "air_filter";
  if (description.startsWith("LUBE")) return "oil_filter";
  if (description.startsWith("FUEL")) return "fuel_filter";
  if (description.startsWith("HYDRAULIC")) return "hydraulic_filter";
  return "industrial_filter";
}

export const asianEquipmentProducts: Product[] = Array.from(
  new Set(sourceRows.flatMap((row) => row.parts)),
).map((partNo) => {
  const applications = applicationsByPart.get(key(partNo))!;
  return {
    id: partNo.toLowerCase(), partNo, brand: "Donaldson",
    title: `Donaldson ${partNo}`,
    category: category(applications[0].description),
    description: applications[0].description,
    dataQuality: "basic", stockStatus: "request",
    sourceType: "catalog", sourceNote: source,
  };
});

export function applyAsianEquipmentData(product: Product): Product {
  if (product.brand.toLowerCase() !== "donaldson") return product;
  const catalogApplications = applicationsByPart.get(key(product.partNo));
  return catalogApplications ? { ...product, catalogApplications } : product;
}
