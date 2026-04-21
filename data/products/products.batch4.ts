// data/products/products.batch4.ts

import type { Product } from "@/types/product";

export const batch4Products: Product[] = [
  {
    id: "donaldson-p777868",
    partNo: "P777868",
    brand: "Donaldson",
    category: "air_filter",
    title: "Air Filter, Primary RadialSeal",
    shortDescription:
      "Primary RadialSeal air filter element for heavy-duty engine air intake.",
    // spec: เว้นว่าง (ไม่ยืนยันขนาด 100%)
    crossReferences: [
      "Fleetguard AF25454", // พบใช้แทนกันในตลาด
      "Baldwin RS3710",     // ใช้แทนกันในบาง catalog
    ],
    equipment: [],
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P777868",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "mixed",
    refs: ["Fleetguard AF25454", "Baldwin RS3710"],
  },

  {
    id: "donaldson-p553004",
    partNo: "P553004",
    brand: "Donaldson",
    category: "fuel_filter",
    title: "Fuel Filter Spin-On",
    shortDescription:
      "Spin-on fuel filter for diesel engine fuel system protection.",
    // spec: เว้น (thread/OD/length ต้อง confirm จาก datasheet)
    crossReferences: [
      "Fleetguard FF5052",
      "Baldwin BF7633",
      "WIX 33528",
    ],
    equipment: [],
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P553004",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "mixed",
    refs: ["Fleetguard FF5052", "Baldwin BF7633", "WIX 33528"],
  },

  {
    id: "donaldson-p559740",
    partNo: "P559740",
    brand: "Donaldson",
    category: "fuel_filter",
    title: "Fuel Filter Water Separator",
    shortDescription:
      "Fuel filter with water separation for diesel systems.",
    // spec: เว้น (micron / flow ยังไม่ confirm)
    crossReferences: [
      "Fleetguard FS19596", // ใช้แทนกันในหลาย application
    ],
    equipment: [],
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P559740",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "mixed",
    refs: ["Fleetguard FS19596"],
  },

  {
    id: "donaldson-p551315",
    partNo: "P551315",
    brand: "Donaldson",
    category: "oil_filter",
    title: "Lube Filter Spin-On",
    shortDescription:
      "Spin-on lube oil filter for engine lubrication system protection.",
    // spec: เว้น (thread / bypass / micron ยังไม่ confirm)
    crossReferences: [
      "Fleetguard LF3349",
      "Baldwin B7436",
      "WIX 51515",
    ],
    equipment: [],
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P551315",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "mixed",
    refs: ["Fleetguard LF3349", "Baldwin B7436", "WIX 51515"],
  },

  {
    id: "donaldson-p556485",
    partNo: "P556485",
    brand: "Donaldson",
    category: "fuel_filter",
    title: "Fuel Filter Spin-On",
    shortDescription:
      "Spin-on fuel filter for diesel fuel system protection.",
    // spec: เว้น (ยังไม่ confirm)
    crossReferences: [
      "Fleetguard FF5488",
      "Baldwin BF7949",
    ],
    equipment: [],
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P556485",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "mixed",
    refs: ["Fleetguard FF5488", "Baldwin BF7949"],
  },
];