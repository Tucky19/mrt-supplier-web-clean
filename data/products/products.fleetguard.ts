import type { Product } from "@/types/product";

export const fleetguardProducts: Product[] = [
  {
    id: "fleetguard-fs36230",
    partNo: "FS36230",
    brand: "Fleetguard",
    category: "fuel_filter",
    title: "Fuel/Water Separator, Spin-On",
    spec: "OD 124 mm x ID 79.8 mm x H 204 mm x Thread 1-14 UNF 2B | Fuel/Water Separator, Spin-On",
    specifications: [
      { label: "Media Type", value: "Cellulose" },
      { label: "Largest Outside Diameter", value: "124.00 mm (4.88 inch)" },
      { label: "Gasket Inside Diameter", value: "79.80 mm (3.14 inch)" },
      { label: "Height", value: "204.00 mm (8.03 inch)" },
      { label: "Gasket Outside Diameter", value: "90.60 mm (3.57 inch)" },
      { label: "Thread Size", value: "1-14 UNF 2B" },
      { label: "Primary Particle Efficiency", value: "25.00 micron @ 96%" },
      { label: "Rated Flow", value: "7.60 L/min (2.01 gpm)" },
      {
        label: "Applicable Region",
        value:
          "North America, China, Europe, South America, South East Asia, South Pacific",
      },
    ],
    crossReferences: [
      {
        brand: "Donaldson",
        partNumber: "P502643",
        relationType: "equivalent",
        verificationStatus: "verified",
        source: "Customer-provided supplier product list",
        evidenceNote:
          "Previously approved as interchangeable by the site owner on 2026-09-21.",
        approvedBy: "Site owner",
        approvedAt: "2026-09-21",
      },
    ],
    pairedParts: [],
    stockStatus: "request",
    checkAvailability: true,
    sourceType: "official",
    sourceNote:
      "Fleetguard Product Specifications PDF supplied by the site owner on 2026-09-25.",
    dataQuality: "verified",
  },
  {
    id: "fleetguard-fs36210",
    partNo: "FS36210",
    brand: "Fleetguard",
    category: "fuel_filter",
    title: "Fuel/Water Separator, Spin-On",
    spec: "OD 111 mm x ID 79.8 mm x Thread 1-14 UNF 2B | Fuel/Water Separator, Spin-On",
    specifications: [
      { label: "Media Type", value: "Cellulose" },
      { label: "Largest Outside Diameter", value: "111.00 mm (4.37 inch)" },
      { label: "Gasket Inside Diameter", value: "79.80 mm (3.14 inch)" },
      { label: "Gasket Outside Diameter", value: "89.40 mm (3.52 inch)" },
      { label: "Thread Size", value: "1-14 UNF 2B" },
      { label: "Rated Flow", value: "7.60 L/min (2.01 gpm)" },
      {
        label: "Applicable Region",
        value:
          "North America, China, Europe, South America, South East Asia, South Pacific",
      },
    ],
    crossReferences: [
      {
        brand: "Donaldson",
        partNumber: "R010042",
        relationType: "equivalent",
        verificationStatus: "verified",
        source: "Customer-provided supplier product list",
        evidenceNote:
          "Previously approved as interchangeable by the site owner on 2026-09-21.",
        approvedBy: "Site owner",
        approvedAt: "2026-09-21",
      },
    ],
    pairedParts: [],
    stockStatus: "request",
    checkAvailability: true,
    sourceType: "official",
    sourceNote:
      "Fleetguard Product Specifications PDF supplied by the site owner on 2026-09-25.",
    dataQuality: "verified",
  },
  {
    id: "fleetguard-lf14000nn",
    partNo: "LF14000NN",
    brand: "Fleetguard",
    category: "oil_filter",
    title: "Lube Filter, Spin-On, NanoNet",
    spec: "OD 118.88 mm x L 294.69 mm x M95X2.5-7H Spin-On NanoNet Lube Filter",
    specifications: [
      { label: "Largest OD", value: "118.88 mm (4.68 inch)" },
      { label: "Length", value: "294.69 mm (11.60 inch)" },
      { label: "Thread Size", value: "M95X2.5-7H" },
      { label: "Gasket OD", value: "118.88 mm (4.68 inch)" },
      { label: "Gasket Inside Diameter", value: "101.60 mm (4.00 inch)" },
      { label: "Media Type", value: "NanoNet" },
      { label: "Pressure Valve", value: "No" },
      { label: "Pressure Valve Opening Pressure", value: "1.00 kPa" },
      { label: "Hydrostatic Burst Minimum", value: "2068.40 kPa (299.92 psi)" },
      { label: "Test Specification", value: "ISO 4548-12" },
      { label: "Rated Flow", value: "105.00 L/min (27.74 gpm)" },
      {
        label: "Applicable Region",
        value:
          "North America, China, Europe, South America, South East Asia, South Pacific, Others, Mexico and Central America",
      },
    ],
    officialUrl:
      "https://www.fleetguard.com/product/lf14000nn/01t5x000008FDTrAAO",
    refs: [],
    crossReferences: ["Donaldson P559000"],
    pairedParts: [],
    stockStatus: "request",
    sourceType: "official",
    sourceNote:
      "Official Fleetguard product page and PDF; Fleetguard search evidence confirms Donaldson P559000 cross-reference. Fleetguard replaces/upgrade notes LF9080, LF9001, and LF14001NN are not modeled as refs because the schema does not separate those relation types.",
    dataQuality: "verified",
  },
];
