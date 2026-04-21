// data/products/products.batch6.ts

import type { Product } from "@/types/product";

export const batch6Products: Product[] = [
  {
    id: "mann-w962-14",
    partNo: "W 962/14",
    brand: "MANN-FILTER",
    category: "hydraulic_filter",
    title: "Hydraulics W 962/14",
    shortDescription:
      "Hydraulic spin-on filter for clean hydraulic oil and system protection.",
    officialUrl:
      "https://www.mann-filter.com/mea-en/catalogue/search-results/product.html/w962/14_mann-filter.html",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "official",
    refs: [],
    crossReferences: [],
  },

  {
    id: "donaldson-p554004",
    partNo: "P554004",
    brand: "Donaldson",
    category: "oil_filter",
    title: "Lube Filter, Spin-On Full Flow",
    shortDescription:
      "Spin-on full-flow lube filter for engine oil system protection.",
    description:
      "Donaldson P554004 is a spin-on full-flow lube filter designed to maintain oil cleanliness and protect engines from wear-causing contaminants.",
    spec: "OD 108 mm × L 262 mm × Thread 1 1/8-16 × Beta 2 20 micron",
    specifications: [
      { label: "Outside Diameter", value: "108 mm" },
      { label: "Length", value: "262 mm" },
      { label: "Thread Size", value: "1 1/8-16" },
      { label: "Gasket OD", value: "99 mm" },
      { label: "Gasket ID", value: "90 mm" },
      { label: "Efficiency Beta 2", value: "20 micron" },
      { label: "Efficiency Beta 20", value: "35 micron" },
    ],
    applications: ["Caterpillar 1R0658", "Caterpillar 2P4004"],
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P554004/20876",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "mixed",
    refs: ["Caterpillar 1R0658", "Caterpillar 2P4004"],
    crossReferences: ["Caterpillar 1R0658", "Caterpillar 2P4004"],
  },

  {
    id: "donaldson-p556845",
    partNo: "P556845",
    brand: "Donaldson",
    category: "fuel_filter",
    title: "Fuel Filter, Spin-On",
    shortDescription:
      "Spin-on fuel filter for diesel fuel system protection.",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "catalog",
    refs: [],
    crossReferences: [],
  },

  {
    id: "donaldson-p181004",
    partNo: "P181004",
    brand: "Donaldson",
    category: "air_filter",
    title: "Air Filter, Primary Round",
    shortDescription:
      "Primary round air filter for heavy-duty engine air intake systems.",
    description:
      "Donaldson P181004 is a primary round air filter for combustion air applications and heavy-duty intake protection.",
    spec: "OD 324 mm × ID 213 mm × L 356 mm × Overall L 381 mm",
    specifications: [
      { label: "Outside Diameter", value: "324 mm" },
      { label: "Inner Diameter", value: "213 mm" },
      { label: "Length", value: "356 mm" },
      { label: "Overall Length", value: "381 mm" },
      { label: "Efficiency", value: "99.9%" },
      { label: "Efficiency Test Std", value: "ISO 5011" },
    ],
    applications: ["MACK 57MD31"],
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P181004/17772",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "mixed",
    refs: ["MACK 57MD31"],
    crossReferences: ["MACK 57MD31"],
  },

  {
    id: "donaldson-p553000",
    partNo: "P553000",
    brand: "Donaldson",
    category: "oil_filter",
    title: "Lube Filter, Spin-On Full Flow",
    shortDescription:
      "Spin-on full-flow lube filter for engine oil system protection.",
    description:
      "Donaldson P553000 is a spin-on full-flow lube filter designed to maintain oil cleanliness and protect engines from wear-causing contaminants.",
    spec: "OD 118 mm × L 296 mm × Thread 2 1/4-12 UN",
    specifications: [
      { label: "Outside Diameter", value: "118 mm" },
      { label: "Length", value: "296 mm" },
      { label: "Thread Size", value: "2 1/4-12 UN" },
      { label: "Gasket OD", value: "119 mm" },
      { label: "Gasket ID", value: "102 mm" },
    ],
    officialUrl: "https://shop.donaldson.com/store/en-us/product/P553000/20848",
    officialImageUrl: null,
    stockStatus: "request",
    sourceType: "official",
    refs: [],
    crossReferences: [],
  },
];