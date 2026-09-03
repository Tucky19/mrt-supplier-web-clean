import type { Product } from "@/types/product";

const addedAt = "2026-09-03";

const donaldsonProducts: Product[] = [
  ["B105002", "AIR FILTER, PRIMARY DURALITE", "air_filter", "https://shop.donaldson.com/store/en-th/product/B105002/11652", "b105002.jpg"],
  ["P169078", "HYDRAULIC FILTER, SPIN-ON DURAMAX", "hydraulic_filter", "https://shop.donaldson.com/store/en-th/product/P169078/16391", "p169078.jpg"],
  ["P550912", "FUEL FILTER, CARTRIDGE", "fuel_filter", "https://shop.donaldson.com/store/en-th/product/P550912/36752", "p550912.jpg"],
  ["P550932", "FUEL FILTER, SPIN-ON", "fuel_filter", "https://shop.donaldson.com/store/en-th/product/P550932/62266", "p550932.jpg"],
  ["P551039", "FUEL FILTER, WATER SEPARATOR SPIN-ON", "fuel_filter", "https://shop.donaldson.com/store/en-th/product/P551039/7632", "p551039.jpg"],
  ["P582263", "HYDRAULIC FILTER, CARTRIDGE", "hydraulic_filter", "https://shop.donaldson.com/store/en-th/product/P582263/prod2140031", "p582263.jpg"],
  ["P785590", "AIR FILTER, PRIMARY RADIALSEAL", "air_filter", "https://shop.donaldson.com/store/en-th/product/P785590/36991", "p785590.jpg"],
  ["X770689", "AIR FILTER KIT", "air_filter", "https://shop.donaldson.com/store/en-th/product/X770689/39889", "x770689.jpg"],
  ["P565149", "HYDRAULIC FILTER, SPIN-ON", "hydraulic_filter", "https://shop.donaldson.com/store/en-th/product/P565149/35297", "p565149.jpg"],
  ["R011812", "FUEL FILTER, WATER SEPARATOR CARTRIDGE", "fuel_filter", "https://shop.donaldson.com/store/en-th/product/R011812/prod2690039", "r011812.jpg"],
  ["P502363", "LUBE FILTER, SPIN-ON FULL FLOW", "oil_filter", "https://shop.donaldson.com/store/en-th/product/P502363/39300", "p502363.jpg"],
  ["P583856", "HYDRAULIC FILTER, SPIN-ON", "hydraulic_filter", "https://shop.donaldson.com/store/en-th/product/P583856/63298", "p583856.jpg"],
  ["P955606", "FUEL FILTER, WATER SEPARATOR SPIN-ON", "fuel_filter", "https://shop.donaldson.com/store/en-th/product/P955606/prod550378", "p955606.jpg"],
  ["P959083", "BREATHER, AIR", "air_filter", "https://shop.donaldson.com/store/en-th/product/P959083/prod2410033", "p959083.jpg"],
  ["P777871", "AIR FILTER, PRIMARY RADIALSEAL", "air_filter", "https://shop.donaldson.com/store/en-th/product/P777871/21960", "p777871.jpg"],
  ["P777875", "AIR FILTER, SAFETY RADIALSEAL", "air_filter", "https://shop.donaldson.com/store/en-th/product/P777875/21961", "p777875.jpg"],
  ["P581958", "HYDRAULIC FILTER, CARTRIDGE", "hydraulic_filter", "https://shop.donaldson.com/store/en-th/product/P581958/prod2040245", "p581958.jpg"],
  ["P550460", "FUEL FILTER, CARTRIDGE", "fuel_filter", "https://shop.donaldson.com/store/en-th/product/P550460/20389", "p550460.jpg"],
  ["P550904", "FUEL FILTER, WATER SEPARATOR SPIN-ON", "fuel_filter", "https://shop.donaldson.com/store/en-th/product/P550904/37024", "p550904.jpg"],
  ["P551424", "FUEL FILTER, WATER SEPARATOR SPIN-ON", "fuel_filter", "https://shop.donaldson.com/store/en-th/product/P551424/39794", "p551424.webp"],
].map(([partNo, title, category, officialUrl, imageFile]) => ({
  id: `donaldson-${partNo.toLowerCase()}`,
  partNo,
  brand: "donaldson",
  category,
  title,
  spec: title,
  imageUrl: `/images/products/donaldson/${imageFile}`,
  officialUrl,
  stockStatus: "request",
  sourceType: "official",
  sourceNote: `Donaldson Thailand official product page; user-provided product image; added ${addedAt}`,
  dataQuality: "basic",
}));

const crossReferenceEvidence = {
  relationType: "equivalent" as const,
  verificationStatus: "verified" as const,
  evidence: "User-confirmed CF 1600 to Donaldson P777551 cross reference",
  evidenceUrl:
    "https://www.mann-filter.com/th-th/catalog/search-results/product.html/cf1600_mann-filter.html",
  approvedBy: "Boss",
  approvedAt: addedAt,
};

export const officialProducts20260903: Product[] = [
  ...donaldsonProducts,
  {
    id: "donaldson-p777551",
    partNo: "P777551",
    brand: "donaldson",
    category: "air_filter",
    title: "AIR FILTER, SAFETY",
    spec: "Safety air filter element",
    imageUrl: "/images/products/donaldson/p777551.jpg",
    officialUrl:
      "https://shop.donaldson.com/store/en-th/product/P777551/21930",
    crossReferences: [
      {
        partNumber: "CF 1600",
        brand: "MANN-FILTER",
        ...crossReferenceEvidence,
      },
    ],
    stockStatus: "request",
    sourceType: "official",
    sourceNote: `Donaldson Thailand official product page; user-provided product image; added ${addedAt}`,
    dataQuality: "verified",
  },
  {
    id: "mann-cf1600",
    partNo: "CF 1600",
    brand: "MANN-FILTER",
    category: "air_filter",
    title: "Air Filter, Secondary Element",
    spec: "OD 161 mm × ID 145 mm × ID1 17 mm × OD1 152 mm × H 471 mm",
    specifications: [
      { label: "Product Type", value: "Secondary Air Filter Element" },
      { label: "GTIN", value: "4011558231705" },
      { label: "Outer Diameter (A)", value: "161 mm" },
      { label: "Inner Diameter (B)", value: "145 mm" },
      { label: "Inner Diameter 1 (C)", value: "17 mm" },
      { label: "Outer Diameter 1 (D)", value: "152 mm" },
      { label: "Height (H)", value: "471 mm" },
    ],
    applications: [
      "CLAAS Jaguar and Lexion; DEUTZ-FAHR 5000/5600/6000 Series; INGERSOLL-RAND XP Series; SCANIA 3 (93-143); SULLAIR F-Series",
    ],
    imageUrl: "/images/products/mann/cf1600.jpg",
    officialUrl:
      "https://www.mann-filter.com/th-th/catalog/search-results/product.html/cf1600_mann-filter.html",
    crossReferences: [
      {
        partNumber: "P777551",
        brand: "Donaldson",
        ...crossReferenceEvidence,
      },
    ],
    gtin: "4011558231705",
    stockStatus: "request",
    sourceType: "official",
    sourceNote: `MANN-FILTER Thailand official product page; user-provided product image; added ${addedAt}`,
    dataQuality: "verified",
  },
  {
    id: "mann-wd962-32",
    partNo: "WD 962/32",
    brand: "MANN-FILTER",
    category: "hydraulic_filter",
    title: "High-Pressure Oil Filter",
    spec: "OD 93 mm × gasket ID 63 mm × gasket OD 72 mm × M20x1.5 × H 212 mm",
    specifications: [
      { label: "Product Type", value: "High-Pressure Oil Filter" },
      { label: "GTIN", value: "4011558017934" },
      { label: "Outer Diameter (A)", value: "93 mm" },
      { label: "Gasket Inner Diameter (B)", value: "63 mm" },
      { label: "Gasket Outer Diameter (C)", value: "72 mm" },
      { label: "Thread Size (G)", value: "M20x1.5" },
      { label: "Height (H)", value: "212 mm" },
    ],
    applications: ["SCHULZ compressors, SRP Series"],
    imageUrl: "/images/products/mann/wd962_32.jpg",
    officialUrl:
      "https://www.mann-filter.com/th-th/catalog/search-results/product.html/wd962/32_mann-filter.html",
    gtin: "4011558017934",
    stockStatus: "request",
    sourceType: "official",
    sourceNote: `MANN-FILTER Thailand official product page; user-provided product image; added ${addedAt}`,
    dataQuality: "verified",
  },
];
