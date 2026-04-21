import type { Product } from "@/types/product";

export const donaldsonP558615: Product = {
  id: "donaldson-p558615",
  partNo: "P558615",
  brand: "Donaldson",
  category: "filter",

  title: "Lube Filter Spin-On",
  shortDescription:
    "Heavy-duty spin-on lube filter for industrial engine applications.",
  description:
    "Donaldson P558615 is a spin-on lube filter designed for reliable oil filtration in demanding industrial and mobile equipment environments.",

  crossReferences: ["LF16015", "P550425"],
  oemReferences: ["OEM-123456"],
  keywords: ["oil filter", "lube filter", "engine filter"],

  spec: "OD 93mm × L 173mm × 1-12 UN",
  specifications: [
    { label: "Outer Diameter", value: "93 mm" },
    { label: "Length", value: "173 mm" },
    { label: "Thread Size", value: "1-12 UN" },
  ],

  equipment: ["Cummins", "Komatsu PC200"],
  applications: ["Industrial engine", "Construction equipment"],

  officialUrl: "https://www.donaldson.com/...",
  officialImageUrl: null,

  stockStatus: "request",
  isFeatured: true,

  sourceType: "official",
  sourceNote: "Derived from manufacturer reference page",

  refs: ["LF16015", "P550425"],
};
