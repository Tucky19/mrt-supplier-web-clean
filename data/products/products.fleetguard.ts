import type { Product } from "@/types/product";

export const fleetguardProducts: Product[] = [
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
    officialUrl: "https://www.fleetguard.com/",
    refs: [],
    crossReferences: ["Donaldson P559000"],
    pairedParts: [],
    stockStatus: "request",
    sourceType: "official",
    sourceNote:
      "Official Fleetguard PDF; Fleetguard screenshot supplied by user confirms Donaldson P559000 cross-reference. Fleetguard replaces/upgrade notes LF9080, LF9001, and LF14001NN are not modeled as refs because the schema does not separate those relation types.",
    dataQuality: "verified",
  },
];
