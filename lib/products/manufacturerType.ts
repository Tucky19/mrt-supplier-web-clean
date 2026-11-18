import type { Product } from "@/types/product";

// Verified presentation vocabulary, independent of internal category/type and specs.
// Only these exact manufacturer/part identities are covered; never infer a type.
export const verifiedManufacturerTypes: Record<string, {
  label: string;
  thai: string;
  source: string;
  sourceKind: "manufacturer_page" | "user_label_photo";
  checkedAt: string;
  originalWording?: string;
}> = Object.fromEntries([
  ["P554004", "20876", "LUBE FILTER"],
  ["P553000", "20848", "LUBE FILTER"],
  ["P550520", "20439", "LUBE FILTER"],
  ["P502007", "18796", "LUBE FILTER"],
  ["P551864", "75230", "FUEL FILTER"],
  ["P550440", "20376", "FUEL FILTER"],
  ["P551315", "20732", "FUEL FILTER"],
  ["P550903", "37023", "FUEL FILTER"],
  ["P550958", "20552", "FUEL FILTER"],
  ["P784473", "34593", "AIR FILTER"],
  // P181080 is named directly in P127315's manufacturer related-part entry.
  ["P181080", "15260", "AIR FILTER"],
].map(([partNo, page, label]) => [partNo, {
  label,
  thai: label === "LUBE FILTER" ? "ไส้กรองน้ำมันเครื่อง" : label === "FUEL FILTER" ? "ไส้กรองเชื้อเพลิง" : "ไส้กรองอากาศ",
  source: `https://shop.donaldson.com/store/en-us/product/${partNo === "P181080" ? "P127315" : partNo}/${page}`,
  checkedAt: "2026-11-18",
  sourceKind: "manufacturer_page" as const,
  originalWording: label === "LUBE FILTER" ? "LUBE FILTER, SPIN-ON FULL FLOW" : undefined,
}]));

// Owner-provided label photo visually verified by dot; primary type only.
// Private image/reference stays outside the public repository.
verifiedManufacturerTypes.P551006 = {
  label: "FUEL FILTER",
  thai: "ไส้กรองเชื้อเพลิง",
  source: "User-supplied Donaldson P551006 label photo, visually verified by dot: Fuel Filter",
  sourceKind: "user_label_photo",
  checkedAt: "2026-11-18",
};

export function getManufacturerType(product: Pick<Product, "brand" | "partNo">, locale: string) {
  if (product.brand.trim().toLowerCase() !== "donaldson") return undefined;
  const verified = verifiedManufacturerTypes[product.partNo];
  if (!verified) return undefined;
  return locale === "th" ? `${verified.thai} / ${verified.label}` : verified.label;
}
