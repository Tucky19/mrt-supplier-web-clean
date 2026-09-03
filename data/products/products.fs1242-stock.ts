import type { Product } from "@/types/product";

export const fs1242StockProducts: Product[] = [
  {
    id: "fleetguard-fs1242",
    partNo: "FS1242",
    brand: "Fleetguard",
    category: "fuel_filter",
    title: "Fuel/Water Separator",
    spec: "Fuel/Water Separator Spin-On; Cummins 3355903",
    specifications: [
      { label: "Type", value: "Fuel/Water Separator Spin-On" },
      { label: "Application Reference", value: "Cummins 3355903" },
    ],
    refs: [
      {
        brand: "Cummins",
        partNumber: "3355903",
        relationType: "unknown",
        verificationStatus: "pending",
        evidence: "MRT physical stock photo",
        evidenceNote:
          "Boss-provided physical MRT stock photo dated 2026-08-31 shows Cummins 3355903 printed on the sealed Fleetguard FS1242. Confirm the equipment/application before selection.",
      },
    ],
    crossReferences: [],
    imageUrl:
      "https://www.fleetguard.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=800/https://atmus.widen.net/content/clw7liie4e/original/FS1242.jpg",
    officialUrl: "https://www.fleetguard.com/product/FS1242",
    stockStatus: "in_stock",
    mrtStockEvidence: {
      status: "in_stock",
      checkedAt: "2026-08-31",
      source: "physical_count",
      note: "Boss-provided physical MRT stock photo shows a sealed Fleetguard FS1242 labeled Fuel/Water Separator and Cummins 3355903.",
    },
    sourceType: "internal",
    sourceNote:
      "MRT physical stock photo supplied by Boss on 2026-08-31. Donaldson alternative is stored on P551864 as a pending informational cross-reference.",
    dataQuality: "verified",
  },
  {
    id: "donaldson-p551864",
    partNo: "P551864",
    brand: "Donaldson",
    category: "fuel_filter",
    title: "Fuel Filter, Water Separator Spin-On",
    spec: "OD 94 mm x L 156 mm x Thread 1-14 UN Fuel/Water Separator Spin-On",
    specifications: [
      { label: "Outer Diameter", value: "94 mm (3.70 inch)" },
      { label: "Length", value: "156 mm (6.14 inch)" },
      { label: "Thread Size", value: "1-14 UN" },
      { label: "Gasket OD", value: "71 mm (2.80 inch)" },
      { label: "Gasket ID", value: "62.5 mm (2.46 inch)" },
      { label: "Type", value: "Fuel/Water Separator Spin-On" },
    ],
    imageUrl: "/images/products/donaldson/p551864.jpg",
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P551864/75230",
    refs: [],
    crossReferences: [
      {
        brand: "Fleetguard",
        partNumber: "FS1242",
        relationType: "unknown",
        verificationStatus: "pending",
        evidence: "Donaldson official product search and product page",
        evidenceNote:
          "Official Donaldson search for FS1242 displays Fleetguard FS1242 mapped to Donaldson P551864; official P551864 product page identifies Fuel Filter, Water Separator Spin-On. User-supplied Donaldson screenshots dated 2026-08-31 preserve the displayed mapping and dimensions. FOR REFERENCE PURPOSES ONLY—CHECK VEHICLE APPLICATION LISTING FOR CORRECT DONALDSON FILTER.",
      },
    ],
    stockStatus: "request",
    sourceType: "official",
    sourceNote:
      "Official Donaldson product page and Boss-provided Donaldson search/compare screenshots. P555001 is intentionally excluded because its dimensions differ materially.",
    dataQuality: "needs_review",
  },
];
