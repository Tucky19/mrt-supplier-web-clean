// data/products/products.mann.ts
import type { Product } from "../types";
import { buildSearchTokens } from "@/lib/searchTokens";

/**
 * Source: MANN-FILTER Online Catalog
 * Notes:
 * - Spec string intentionally compact for card/search display.
 * - A/B/C are common catalog dimensions (OD / seal ID / seal OD depending on item family).
 */
export const mannProducts: Product[] = [
  // =========================
  // OIL / HYDRAULIC / TRANSMISSION (Spin-on)
  // =========================

  {
    id: "mann-w11102-36",
    partNo: "W11102/36",
    brand: "MANN-FILTER",
    title: "Oil Filter W 11 102/36",
    category: "filter",
  
 
    spec: "A108 B93 C103 | G 1 1/8-16 UN | H261 mm",
  }, // :contentReference[oaicite:0]{index=0}

  {
    id: "mann-w13145-3",
    partNo: "W13145/3",
    brand: "MANN-FILTER",
    title: "Hydraulic Transmission Filter W 13 145/3",
    category: "filter",
    spec: "A136 B100 C111 | G 1 1/2-16 UN | H308 mm | bypass 2.5",
  }, // :contentReference[oaicite:1]{index=1}

  {
    id: "mann-w920-21",
    partNo: "W920/21",
    brand: "MANN-FILTER",
    title: "Oil Filter W 920/21",
    category: "filter",
    
    spec: "A93 B62 C71 | G 3/4-16 UNF | H95 mm | bypass 0.8 | ADBV 1",
  }, // :contentReference[oaicite:2]{index=2}

  {
    id: "mann-w940-5",
    partNo: "W940/5",
    brand: "MANN-FILTER",
    title: "Oil Filter W 940/5",
    category: "filter",
    
 
    spec: "A93 B62 C71 | G 1-12 UNF | H157 mm | bypass 2.5 | ADBV 1",
  }, // :contentReference[oaicite:3]{index=3}

  {
    id: "mann-w950",
    partNo: "W950",
    brand: "MANN-FILTER",
    title: "Oil Filter W 950",
    category: "filter",
    
 
    spec: "A93 B62 C71 | G 1-12 UNF | H170 mm | bypass 2.5 | ADBV 1",
  }, // :contentReference[oaicite:4]{index=4}

  {
    id: "mann-w962-14",
    partNo: "W962/14",
    brand: "MANN-FILTER",
    title: "Hydraulics Filter W 962/14",
    category: "filter",
    
 
    spec: "A93 B62 C71 | G 1-12 UNF | H210 mm",
  }, // :contentReference[oaicite:5]{index=5}

  {
    id: "mann-w719-5",
    partNo: "W719/5",
    brand: "MANN-FILTER",
    title: "Oil Filter W 719/5",
    category: "filter",
    
 
    spec: "A76 B62 C71 | G 3/4-16 UNF | H123 mm | bypass 2.5 | ADBV 1",
  }, // :contentReference[oaicite:6]{index=6}

  // =========================
  // WD SERIES (High pressure / hydraulics)
  // =========================

  {
    id: "mann-wd962",
    partNo: "WD962",
    brand: "MANN-FILTER",
    title: "Hydraulic Transmission Filter WD 962",
    category: "filter",
    
 
    spec: "A93 B62 C71 | G 1-12 UNF | H212 mm | high pressure",
  }, // :contentReference[oaicite:7]{index=7}

  {
    id: "mann-wd13145",
    partNo: "WD13145",
    brand: "MANN-FILTER",
    title: "Oil Filter WD 13 145",
    category: "filter",
    
 
    spec: "A136 B100 C111 | G 1 1/2-16 UN | H302 mm | high pressure",
  }, // :contentReference[oaicite:8]{index=8}

  {
    id: "mann-wd1374",
    partNo: "WD1374",
    brand: "MANN-FILTER",
    title: "Hydraulic Transmission Filter WD 1374",
    category: "filter",
    
 
    spec: "A136 B100 C111 | G 1 1/2-16 UN | H177 mm | high pressure",
  }, // :contentReference[oaicite:9]{index=9}

  {
    id: "mann-wd920",
    partNo: "WD920",
    brand: "MANN-FILTER",
    title: "Hydraulics Filter WD 920",
    category: "filter",
    
 
    spec: "A3.7in B2.4in C2.8in | G 3/4-16 UNF | H3.8in | bypass 2.5",
  }, // :contentReference[oaicite:10]{index=10}

  // =========================
  // AIR FILTERS
  // =========================

  {
    id: "mann-c1112-2",
    partNo: "C1112/2",
    brand: "MANN-FILTER",
    title: "Air Filter C 1112/2",
    category: "filter",
    
 
    spec: "A98 B60 | H74 mm",
  }, // :contentReference[oaicite:11]{index=11}

  {
    id: "mann-c1250",
    partNo: "C1250",
    brand: "MANN-FILTER",
    title: "Air Filter C 1250 (Picolino)",
    category: "filter",
    
 
    spec: "A118 B67 C67 | H134 mm | Picolino",
  }, // :contentReference[oaicite:12]{index=12}

  {
    id: "mann-c1337",
    partNo: "C1337",
    brand: "MANN-FILTER",
    title: "Air Filter C 1337",
    category: "filter",
    
 
    spec: "A128 B64 C64 | H125 mm",
  }, // :contentReference[oaicite:13]{index=13}

  {
    id: "mann-c1633-1",
    partNo: "C1633/1",
    brand: "MANN-FILTER",
    title: "Air Filter C 1633/1",
    category: "filter",
    
 
    spec: "A159 B120 C120 | H75 mm",
  }, // :contentReference[oaicite:14]{index=14}

  {
    id: "mann-c25710-3",
    partNo: "C25710/3",
    brand: "MANN-FILTER",
    title: "Air Filter C 25 710/3 (EUROPICLON)",
    category: "filter",
    
 
    spec: "A240 B147 | H539 mm | EUROPICLON | secondary CF710",
  }, // :contentReference[oaicite:15]{index=15}

  {
    id: "mann-c23610",
    partNo: "C23610",
    brand: "MANN-FILTER",
    title: "Air Filter C 23 610 (EUROPICLON)",
    category: "filter",
    
 
    spec: "A220 B124 | H404 mm | EUROPICLON | secondary CF610",
  }, // :contentReference[oaicite:16]{index=16}

  {
    id: "mann-c23115",
    partNo: "C23115",
    brand: "MANN-FILTER",
    title: "Air Filter C 23 115",
    category: "filter",
    
 
    spec: "A228 B161 C161 D241 | H130 mm",
  }, // :contentReference[oaicite:17]{index=17}
];
[
  {
    "id": "mann-w962",
    "partNo": "W962",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER W962",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 93,
      "height_mm": 143,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF3345" },
      { "brand": "Baldwin", "partNo": "B2" },
      { "brand": "Donaldson", "partNo": "P550008" },
      { "brand": "Sakura", "partNo": "C-1110" }
    ],
    "applications": [
      "Cummins engines",
      "Komatsu equipment",
      "CAT industrial engines",
      "Heavy duty diesel engines"
    ],
    "description": "ไส้กรองน้ำมันเครื่องคุณภาพ OEM ช่วยกรองสิ่งสกปรกและปกป้องเครื่องยนต์ เหมาะสำหรับเครื่องยนต์ดีเซลและเครื่องจักรอุตสาหกรรม",
    "stock": "request"
  },
  {
    "id": "mann-w962-14",
    "partNo": "W962/14",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER W962/14",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 93,
      "height_mm": 170,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF3349" },
      { "brand": "Baldwin", "partNo": "B7333" },
      { "brand": "Donaldson", "partNo": "P550086" },
      { "brand": "Sakura", "partNo": "C-1112" }
    ],
    "applications": [
      "Cummins engines",
      "Heavy trucks",
      "Industrial diesel engines"
    ],
    "description": "ไส้กรองน้ำมันเครื่องมาตรฐาน OEM รองรับเครื่องยนต์ดีเซลหนัก เพิ่มอายุการใช้งานเครื่องยนต์",
    "stock": "request"
  },
  {
    "id": "mann-wd962",
    "partNo": "WD962",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER WD962",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 93,
      "height_mm": 170,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF3349" },
      { "brand": "Donaldson", "partNo": "P550086" },
      { "brand": "Baldwin", "partNo": "B7333" }
    ],
    "applications": [
      "Mercedes-Benz engines",
      "MAN engines",
      "Industrial equipment"
    ],
    "description": "ไส้กรองน้ำมันเครื่องประสิทธิภาพสูง ช่วยลดการสึกหรอของเครื่องยนต์",
    "stock": "request"
  },
  {
    "id": "mann-wd950",
    "partNo": "WD950",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER WD950",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 93,
      "height_mm": 174,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF4054" },
      { "brand": "Donaldson", "partNo": "P550086" },
      { "brand": "Baldwin", "partNo": "B495" }
    ],
    "applications": [
      "Heavy duty engines",
      "Construction equipment"
    ],
    "description": "ไส้กรองน้ำมันเครื่องสำหรับงานหนัก ปกป้องเครื่องยนต์จากสิ่งปนเปื้อน",
    "stock": "request"
  },
  {
    "id": "mann-w719-5",
    "partNo": "W719/5",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER W719/5",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 76,
      "height_mm": 120,
      "thread": "M20x1.5"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF3462" },
      { "brand": "Baldwin", "partNo": "B1400" },
      { "brand": "Donaldson", "partNo": "P550162" }
    ],
    "applications": [
      "Passenger vehicles",
      "Small diesel engines"
    ],
    "description": "ไส้กรองน้ำมันเครื่องมาตรฐาน OEM เหมาะสำหรับรถยนต์และเครื่องยนต์ขนาดเล็ก",
    "stock": "request"
  },
  {
    "id": "mann-c25710-3",
    "partNo": "C25710/3",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองอากาศ MANN-FILTER C25710/3",
    "category": "air_filter",
    "specs": {
      "outer_diameter_mm": 252,
      "height_mm": 410,
      "inner_diameter_mm": 160
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "AF25454" },
      { "brand": "Donaldson", "partNo": "P777638" },
      { "brand": "Baldwin", "partNo": "RS3737" }
    ],
    "applications": [
      "Heavy trucks",
      "Construction equipment",
      "Industrial engines"
    ],
    "description": "ไส้กรองอากาศคุณภาพสูง เพิ่มประสิทธิภาพการทำงานของเครื่องยนต์",
    "stock": "request"
  },
  {
    "id": "mann-wd13145",
    "partNo": "WD13145",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER WD13145",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 108,
      "height_mm": 260,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF9009" },
      { "brand": "Donaldson", "partNo": "P550949" }
    ],
    "applications": [
      "Cummins engines",
      "Heavy equipment"
    ],
    "description": "ไส้กรองน้ำมันเครื่องสำหรับเครื่องยนต์ Cummins และเครื่องจักรอุตสาหกรรม",
    "stock": "request"
  },
  {
    "id": "mann-wd1374",
    "partNo": "WD1374",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER WD1374",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 108,
      "height_mm": 210,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF670" },
      { "brand": "Donaldson", "partNo": "P550020" }
    ],
    "applications": [
      "Heavy diesel engines",
      "Industrial equipment"
    ],
    "description": "ไส้กรองน้ำมันเครื่อง WD1374 ให้ประสิทธิภาพการกรองสูง",
    "stock": "request"
  },
  {
    "id": "mann-c1250",
    "partNo": "C1250",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองอากาศ MANN-FILTER C1250",
    "category": "air_filter",
    "specs": {
      "outer_diameter_mm": 120,
      "height_mm": 250,
      "inner_diameter_mm": 65
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "AF257" },
      { "brand": "Donaldson", "partNo": "P771558" },
      { "brand": "Baldwin", "partNo": "PA1884" }
    ],
    "applications": [
      "Industrial engines",
      "Compressors",
      "Diesel engines"
    ],
    "description": "ไส้กรองอากาศ C1250 ปกป้องเครื่องยนต์จากฝุ่นและสิ่งปนเปื้อน",
    "stock": "request"
  }
];
[
  {
    "id": "mann-w11102-36",
    "partNo": "W11102/36",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER W11102/36",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 108,
      "height_mm": 260,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF9009" },
      { "brand": "Donaldson", "partNo": "P550949" }
    ],
    "applications": ["Cummins engines", "Heavy duty trucks"],
    "description": "ไส้กรองน้ำมันเครื่องมาตรฐาน OEM สำหรับเครื่องยนต์ดีเซลงานหนัก",
    "stock": "request"
  },
  {
    "id": "mann-w940",
    "partNo": "W940",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER W940",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 95,
      "height_mm": 140,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF4054" },
      { "brand": "Donaldson", "partNo": "P550086" }
    ],
    "applications": ["Industrial diesel engines"],
    "description": "ไส้กรองน้ำมันเครื่องคุณภาพสูงสำหรับเครื่องยนต์อุตสาหกรรม",
    "stock": "request"
  },
  {
    "id": "mann-w940-1",
    "partNo": "W940/1",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER W940/1",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 95,
      "height_mm": 160,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF3349" }
    ],
    "applications": ["Heavy equipment"],
    "description": "ไส้กรองน้ำมันเครื่องสำหรับเครื่องยนต์ดีเซลและเครื่องจักร",
    "stock": "request"
  },
  {
    "id": "mann-w940-5",
    "partNo": "W940/5",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER W940/5",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 95,
      "height_mm": 180,
      "thread": "1\"-12 UNF"
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF670" }
    ],
    "applications": ["Industrial engines"],
    "description": "ไส้กรองน้ำมันเครื่องสำหรับงานหนัก มาตรฐาน OEM",
    "stock": "request"
  },
  {
    "id": "mann-c25900",
    "partNo": "C25900",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองอากาศ MANN-FILTER C25900",
    "category": "air_filter",
    "specs": {
      "outer_diameter_mm": 252,
      "height_mm": 500,
      "inner_diameter_mm": 160
    },
    "cross_reference": [
      { "brand": "Donaldson", "partNo": "P777639" }
    ],
    "applications": ["Heavy trucks", "Construction equipment"],
    "description": "ไส้กรองอากาศสำหรับเครื่องยนต์ดีเซลหนัก",
    "stock": "request"
  },
  {
    "id": "mann-c30703",
    "partNo": "C30703",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองอากาศ MANN-FILTER C30703",
    "category": "air_filter",
    "specs": {
      "outer_diameter_mm": 300,
      "height_mm": 450,
      "inner_diameter_mm": 170
    },
    "cross_reference": [],
    "applications": ["Industrial engines"],
    "description": "ไส้กรองอากาศคุณภาพสูง เพิ่มประสิทธิภาพเครื่องยนต์",
    "stock": "request"
  },
  {
    "id": "mann-c30850-2",
    "partNo": "C30850/2",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองอากาศ MANN-FILTER C30850/2",
    "category": "air_filter",
    "specs": {
      "outer_diameter_mm": 303,
      "height_mm": 500,
      "inner_diameter_mm": 180
    },
    "cross_reference": [],
    "applications": ["Heavy equipment"],
    "description": "ไส้กรองอากาศสำหรับเครื่องจักรอุตสาหกรรม",
    "stock": "request"
  },
  {
    "id": "mann-c713",
    "partNo": "C713",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองอากาศ MANN-FILTER C713",
    "category": "air_filter",
    "specs": {
      "outer_diameter_mm": 70,
      "height_mm": 130,
      "inner_diameter_mm": 34
    },
    "cross_reference": [],
    "applications": ["Small engines"],
    "description": "ไส้กรองอากาศสำหรับเครื่องยนต์ขนาดเล็ก",
    "stock": "request"
  },
  {
    "id": "mann-c75-2",
    "partNo": "C75/2",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองอากาศ MANN-FILTER C75/2",
    "category": "air_filter",
    "specs": {
      "outer_diameter_mm": 75,
      "height_mm": 150,
      "inner_diameter_mm": 40
    },
    "cross_reference": [],
    "applications": ["Small diesel engines"],
    "description": "ไส้กรองอากาศคุณภาพสูงสำหรับเครื่องยนต์ขนาดเล็ก",
    "stock": "request"
  },

  {
    "id": "mann-hu7016x",
    "partNo": "HU7016X",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER HU7016X",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 65,
      "height_mm": 150,
      "inner_diameter_mm": 30
    },
    "cross_reference": [
      { "brand": "Fleetguard", "partNo": "LF16244" }
    ],
    "applications": ["Mercedes-Benz", "BMW"],
    "description": "ไส้กรองน้ำมันเครื่องแบบไส้ในคุณภาพ OEM",
    "stock": "request"
  },

  {
    "id": "mann-h729",
    "partNo": "H729",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองน้ำมันเครื่อง MANN-FILTER H729",
    "category": "oil_filter",
    "specs": {
      "outer_diameter_mm": 70,
      "height_mm": 160,
      "inner_diameter_mm": 32
    },
    "cross_reference": [],
    "applications": ["Industrial engines"],
    "description": "ไส้กรองน้ำมันเครื่องแบบไส้ในมาตรฐาน OEM",
    "stock": "request"
  },
{
  id: "mann-lb962-2",
  partNo: "LB962/2",
  brand: "MANN-FILTER",
  title: "Spin-On Fuel Filter",
  nameTh: "ไส้กรองเชื้อเพลิง MANN-FILTER LB962/2",
  category: "filter",
  filterCategoryKey: "fuel_filter",

  

  spec: "OD 95 mm × H 170 mm × 1\"-14 UNS",

  dimensions: {
    od_mm: 95,
    height_mm: 170,
  },

  thread: {
    raw: '1"-14 UNS',
    standard: "uns",
  },

  specifications: [
    { label: "Outer Diameter", value: 95, unit: "mm" },
    { label: "Height", value: 170, unit: "mm" },
    { label: "Thread Size", value: '1"-14 UNS' },
  ],

  cross_reference: [
    { brand: "Fleetguard", partNo: "FF5052" },
  ],

  applications: [
    "Diesel engines",
  ],

  images: [
    {
      src: "/products/mann/lb962-2.jpg",
      alt: "MANN-FILTER LB962/2 Fuel Filter",
    },
  ],

  seo: {
    description_th:
      "ไส้กรองเชื้อเพลิง MANN-FILTER LB962/2 สำหรับเครื่องยนต์ดีเซล ช่วยกรองสิ่งสกปรกและปกป้องระบบเชื้อเพลิง",
    keywords: [
      "LB962/2",
      "mann filter",
      "fuel filter",
      "ไส้กรองเชื้อเพลิง",
      "กรองดีเซล",
    ],
  },

  searchTokens: [
    "lb962/2",
    "lb9622",
    "mann",
    "fuel filter",
    "filter",
  ],

  search_tokens: [
    "lb962/2",
    "lb9622",
    "mann",
    "fuel",
    "filter",
  ],
},
  {
    "id": "mann-lb962-21",
    "partNo": "LB962/21",
    "brand": "MANN-FILTER",
    "title": "ไส้กรองเชื้อเพลิง MANN-FILTER LB962/21",
    "category": "fuel_filter",
    "specs": {
      "outer_diameter_mm": 95,
      "height_mm": 170,
      "thread": "1\"-14 UNS"
    },
    "cross_reference": [],
    "applications": ["Diesel engines"],
    "description": "ไส้กรองเชื้อเพลิงคุณภาพสูงสำหรับเครื่องยนต์ดีเซล",
    "stock": "request"
  },
]
