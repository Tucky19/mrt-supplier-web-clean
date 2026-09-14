import type { Product } from "@/types/product";

// Approved scope: 19 rows, 18 distinct filter products.
// AF 1 / AF 2 rows and the five rows without replacement numbers are excluded.
// Quantities, prices and internal CODE values are intentionally not imported.
export const vehicleFilterProducts: Product[] = [
  {
    "id": "donaldson-p552050",
    "partNo": "P552050",
    "brand": "Donaldson",
    "title": "Lube Filter, Spin-On Full Flow",
    "category": "lube_filter",
    "spec": "OD 118 mm x L 199 mm x Thread 1 1/2-16 UN | Lube Filter, Spin-On Full Flow",
    "description": "HINO MEGA FM1J: กรองน้ำมันเครื่อง 15613-EVO20 → Donaldson P552050",
    "vehicleApplications": [
      "HINO MEGA FM1J: กรองน้ำมันเครื่อง 15613-EVO20 → Donaldson P552050"
    ],
    "crossReferences": [
      {
        "brand": "HINO",
        "partNumber": "15613-EVO20",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 2; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p552050.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 f9508fb8dd2baaf8d943d95a96e56dc93e5c7f1b67f1e4acbe0ddad230696ebb. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Outer Diameter",
        "value": "118 mm (4.65 inch)"
      },
      {
        "label": "Thread Size",
        "value": "1 1/2-16 UN"
      },
      {
        "label": "Length",
        "value": "199 mm (7.83 inch)"
      },
      {
        "label": "Gasket OD",
        "value": "110 mm (4.33 inch)"
      },
      {
        "label": "Gasket ID",
        "value": "98 mm (3.86 inch)"
      },
      {
        "label": "Efficiency 99%",
        "value": "39 micron"
      },
      {
        "label": "Efficiency Test Std",
        "value": "ISO 16889"
      },
      {
        "label": "Media Type",
        "value": "Cellulose"
      },
      {
        "label": "Type",
        "value": "Full-Flow"
      },
      {
        "label": "Style",
        "value": "Spin-On"
      },
      {
        "label": "Primary Application",
        "value": "HINO 156072050"
      },
      {
        "label": "UPC Code",
        "value": "742330107003"
      }
    ],
    "gtin": "742330107003",
    "imageUrl": "/images/products/donaldson/p552050.jpg"
  },
  {
    "id": "donaldson-p550225",
    "partNo": "P550225",
    "brand": "Donaldson",
    "title": "Fuel Filter, Spin-On Secondary",
    "category": "fuel_filter",
    "spec": "OD 84.1 mm x L 100.1 mm x Thread 3/4-16 UN | Fuel Filter, Spin-On Secondary",
    "description": "HINO MEGA FM1J: กรองน้ำมันดีเซล 23304-EVO60 → Donaldson P550225",
    "vehicleApplications": [
      "HINO MEGA FM1J: กรองน้ำมันดีเซล 23304-EVO60 → Donaldson P550225"
    ],
    "crossReferences": [
      {
        "brand": "HINO",
        "partNumber": "23304-EVO60",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 3; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p550225.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 dd992a0a8e179dcec1d4e83aeb823f8db65083cea7a88dd5658a5ac41b4adfe7. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Outer Diameter",
        "value": "84.1 mm (3.31 inch)"
      },
      {
        "label": "Thread Size",
        "value": "3/4-16 UN"
      },
      {
        "label": "Length",
        "value": "100.1 mm (3.94 inch)"
      },
      {
        "label": "Gasket OD",
        "value": "62.99 mm (2.48 inch)"
      },
      {
        "label": "Gasket ID",
        "value": "52.83 mm (2.08 inch)"
      },
      {
        "label": "Efficiency 50%",
        "value": "10 micron"
      },
      {
        "label": "Efficiency Test Std",
        "value": "JIS D 1611"
      },
      {
        "label": "Collapse Burst",
        "value": "6.9 bar (100 psi)"
      },
      {
        "label": "Type",
        "value": "Secondary"
      },
      {
        "label": "Style",
        "value": "Spin-On"
      },
      {
        "label": "Media Type",
        "value": "Cellulose"
      },
      {
        "label": "UPC Code",
        "value": "742330041635"
      }
    ],
    "gtin": "742330041635",
    "imageUrl": "/images/products/donaldson/p550225.jpg"
  },
  {
    "id": "donaldson-p551853",
    "partNo": "P551853",
    "brand": "Donaldson",
    "title": "Fuel Filter, Water Separator Spin-On",
    "category": "fuel_filter",
    "spec": "OD 107.7 mm x L 117 mm x Overall L 128.7 mm x Thread 1-14 UN | Fuel Filter, Water Separator Spin-On",
    "description": "HINO MEGA FM1J: กรองน้ำมันดีเซล 23304-EVO70 → Donaldson P551853",
    "vehicleApplications": [
      "HINO MEGA FM1J: กรองน้ำมันดีเซล 23304-EVO70 → Donaldson P551853"
    ],
    "crossReferences": [
      {
        "brand": "HINO",
        "partNumber": "23304-EVO70",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 4; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p551853.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 bd7a06479450bbd09d22b99fab38f560aa86c0ec30c4c9721532efb335dc5b4e. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Overall Length",
        "value": "128.7 mm (5.07 inch)"
      },
      {
        "label": "Outer Diameter",
        "value": "107.7 mm (4.24 inch)"
      },
      {
        "label": "Thread Size",
        "value": "1-14 UN"
      },
      {
        "label": "Length",
        "value": "117 mm (4.61 inch)"
      },
      {
        "label": "Gasket OD",
        "value": "90 mm (3.54 inch)"
      },
      {
        "label": "Gasket ID",
        "value": "80 mm (3.15 inch)"
      },
      {
        "label": "Bowl Thread",
        "value": "3 3/4-10 BUTT"
      },
      {
        "label": "Efficiency 90%",
        "value": "30 micron"
      },
      {
        "label": "Efficiency Test Std",
        "value": "ISO 4402/11171"
      },
      {
        "label": "Type",
        "value": "Water Separator"
      },
      {
        "label": "UPC Code",
        "value": "742330983287"
      }
    ],
    "gtin": "742330983287",
    "imageUrl": "/images/products/donaldson/p551853.jpg"
  },
  {
    "id": "donaldson-p502007",
    "partNo": "P502007",
    "brand": "Donaldson",
    "title": "Lube Filter, Spin-On Full Flow",
    "category": "lube_filter",
    "spec": "OD 68 mm x L 91 mm x Thread M20 x 1.5 | Lube Filter, Spin-On Full Flow",
    "description": "HINO MEGA FM1J: กรองน้ำมันเฟืองท้าย 15607-2060 P → Donaldson P502007",
    "vehicleApplications": [
      "HINO MEGA FM1J: กรองน้ำมันเฟืองท้าย 15607-2060 P → Donaldson P502007"
    ],
    "crossReferences": [
      {
        "brand": "HINO",
        "partNumber": "15607-2060 P",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 5; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p502007.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 849e33a0271aaa716208e6292af1cb8bb699886ffedeadb16eb52c5287b6135d. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping. Application review: spreadsheet calls this a final-drive oil filter; Donaldson identifies a full-flow lube filter. Preserve the vehicle/OEM mapping as pending, not a verified fitment.",
    "dataQuality": "needs_review",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Outer Diameter",
        "value": "68 mm (2.68 inch)"
      },
      {
        "label": "Thread Size",
        "value": "M20 x 1.5"
      },
      {
        "label": "Length",
        "value": "91 mm (3.58 inch)"
      },
      {
        "label": "Gasket OD",
        "value": "64 mm (2.52 inch)"
      },
      {
        "label": "Gasket ID",
        "value": "56 mm (2.20 inch)"
      },
      {
        "label": "Efficiency 50%",
        "value": "22.95 micron"
      },
      {
        "label": "Efficiency 90%",
        "value": "33.87 micron"
      },
      {
        "label": "Efficiency 95%",
        "value": "40 micron"
      },
      {
        "label": "Efficiency Beta 75",
        "value": "50 micron"
      },
      {
        "label": "Efficiency Test Std",
        "value": "JIS D 1611"
      },
      {
        "label": "Anti-Drainback Valve",
        "value": "Yes"
      },
      {
        "label": "Bypass Valve",
        "value": "Yes"
      },
      {
        "label": "Bypass Valve Setting LR",
        "value": "0.8 bar (12 psi)"
      },
      {
        "label": "Bypass Valve Setting HR",
        "value": "1 bar (15 psi)"
      },
      {
        "label": "Media Type",
        "value": "Cellulose"
      },
      {
        "label": "Collapse Burst",
        "value": "6.9 bar (100 psi)"
      },
      {
        "label": "Type",
        "value": "Full-Flow"
      },
      {
        "label": "Style",
        "value": "Spin-On"
      },
      {
        "label": "Primary Application",
        "value": "MITSUBISHI MD135737"
      },
      {
        "label": "UPC Code",
        "value": "742330109533"
      }
    ],
    "gtin": "742330109533",
    "imageUrl": "/images/products/donaldson/p502007.jpg"
  },
  {
    "id": "donaldson-p550453",
    "partNo": "P550453",
    "brand": "Donaldson",
    "title": "Lube Filter, Cartridge",
    "category": "lube_filter",
    "spec": "OD 121 mm x ID 45 mm x L 299 mm x Overall L 313.50 mm | Lube Filter, Cartridge",
    "description": "BENZ 2644 S: กรองน้ำมันเครื่อง A5411800209 → Donaldson P550453",
    "vehicleApplications": [
      "BENZ 2644 S: กรองน้ำมันเครื่อง A5411800209 → Donaldson P550453"
    ],
    "crossReferences": [
      {
        "brand": "BENZ",
        "partNumber": "A5411800209",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 9; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p550453.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 6bd7fc36333152ea536678da27cf3ad8dbf2215048e2715d6d3ce0148f22d348. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Overall Length",
        "value": "313.50 mm (12.34 inch)"
      },
      {
        "label": "Outer Diameter",
        "value": "121 mm (4.76 inch)"
      },
      {
        "label": "Inner Diameter",
        "value": "45 mm (1.77 inch)"
      },
      {
        "label": "Length",
        "value": "299 mm (11.77 inch)"
      },
      {
        "label": "Efficiency 99%",
        "value": "40 micron"
      },
      {
        "label": "Style",
        "value": "Cartridge"
      },
      {
        "label": "Primary Application",
        "value": "MERCEDES-BENZ A5411840225"
      },
      {
        "label": "UPC Code",
        "value": "742330126561"
      }
    ],
    "gtin": "742330126561",
    "imageUrl": "/images/products/donaldson/p550453.jpg"
  },
  {
    "id": "donaldson-p550762",
    "partNo": "P550762",
    "brand": "Donaldson",
    "title": "กรองน้ำมันดีเซล",
    "category": "fuel_filter",
    "spec": "กรองน้ำมันดีเซล",
    "description": "BENZ 2644 S: กรองน้ำมันดีเซล A5410900151 → Donaldson P550762",
    "vehicleApplications": [
      "BENZ 2644 S: กรองน้ำมันดีเซล A5410900151 → Donaldson P550762"
    ],
    "crossReferences": [
      {
        "brand": "BENZ",
        "partNumber": "A5410900151",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 10; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "internal",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    }
  },
  {
    "id": "donaldson-p551026",
    "partNo": "P551026",
    "brand": "Donaldson",
    "title": "Fuel Filter, Water Separator Spin-On Twist&Drain",
    "category": "fuel_filter",
    "spec": "OD 107.3 mm x L 243.6 mm x Thread 1-14 UN | Fuel Filter, Water Separator Spin-On Twist&Drain",
    "description": "BENZ 2644 S: กรองน้ำมันดีเซล A0004770103 → Donaldson P551026",
    "vehicleApplications": [
      "BENZ 2644 S: กรองน้ำมันดีเซล A0004770103 → Donaldson P551026"
    ],
    "crossReferences": [
      {
        "brand": "BENZ",
        "partNumber": "A0004770103",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 11; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p551026.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 97471750a790588e27ad1b53c74c2bc9d629886218bff444150e513c87ee61d8. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Outer Diameter",
        "value": "107.3 mm (4.22 inch)"
      },
      {
        "label": "Thread Size",
        "value": "1-14 UN"
      },
      {
        "label": "Length",
        "value": "243.6 mm (9.59 inch)"
      },
      {
        "label": "Gasket OD",
        "value": "99 mm (3.90 inch)"
      },
      {
        "label": "Gasket ID",
        "value": "90.3 mm (3.56 inch)"
      },
      {
        "label": "Efficiency 99%",
        "value": "10 micron"
      },
      {
        "label": "Efficiency Test Std",
        "value": "ISO 19438"
      },
      {
        "label": "Emulsified H2O Efficiency",
        "value": "95 Percent"
      },
      {
        "label": "Type",
        "value": "Water Separator"
      },
      {
        "label": "Style",
        "value": "Spin-On"
      },
      {
        "label": "Brand",
        "value": "Twist&Drain™"
      },
      {
        "label": "Media Type",
        "value": "Cellulose, Meltblown"
      },
      {
        "label": "Notes",
        "value": "Not for Marine Applications"
      },
      {
        "label": "UPC Code",
        "value": "742330201763"
      }
    ],
    "gtin": "742330201763",
    "imageUrl": "/images/products/donaldson/p551026.jpg"
  },
  {
    "id": "donaldson-p781466",
    "partNo": "P781466",
    "brand": "Donaldson",
    "title": "Air Dryer, Spin-On",
    "category": "air_dryer_filter",
    "spec": "OD 136 mm x L 165 mm x Thread M39 x 1.5 | Air Dryer, Spin-On",
    "description": "BENZ 2644 S: กรองแอร์ไดร์เออร์ A0004300969 → Donaldson P781466",
    "vehicleApplications": [
      "BENZ 2644 S: กรองแอร์ไดร์เออร์ A0004300969 → Donaldson P781466"
    ],
    "crossReferences": [
      {
        "brand": "BENZ",
        "partNumber": "A0004300969",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 12; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p781466.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 e5938201ec4373eecb940e90897d19b93a6fb00a5fae3dd8d738548071459490. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Outer Diameter",
        "value": "136 mm (5.35 inch)"
      },
      {
        "label": "Thread Size",
        "value": "M39 x 1.5"
      },
      {
        "label": "Length",
        "value": "165 mm (6.50 inch)"
      },
      {
        "label": "Gasket OD",
        "value": "110 mm (4.33 inch)"
      },
      {
        "label": "Gasket ID",
        "value": "99 mm (3.90 inch)"
      },
      {
        "label": "Style",
        "value": "Spin-On"
      },
      {
        "label": "UPC Code",
        "value": "742330126646"
      }
    ],
    "gtin": "742330126646",
    "imageUrl": "/images/products/donaldson/p781466.jpg"
  },
  {
    "id": "donaldson-p784473",
    "partNo": "P784473",
    "brand": "Donaldson",
    "title": "Air Filter, Panel Engine",
    "category": "air_filter",
    "spec": "L 382 mm x W 133 mm x H 35 mm | Air Filter, Panel Engine",
    "description": "BENZ 2644 S: กรองแอร์ A0008301118 → Donaldson P784473",
    "vehicleApplications": [
      "BENZ 2644 S: กรองแอร์ A0008301118 → Donaldson P784473"
    ],
    "crossReferences": [
      {
        "brand": "BENZ",
        "partNumber": "A0008301118",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 13; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p784473.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 923803a4b0243df5159b03d674118f85d601c8a8c837f8b13b7b369c55bcce14. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping. Application review: spreadsheet calls this an air-conditioning filter; Donaldson identifies Panel Engine, Type Engine. Preserve both source meanings pending application confirmation.",
    "dataQuality": "needs_review",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Length",
        "value": "382 mm (15.04 inch)"
      },
      {
        "label": "Width",
        "value": "133 mm (5.24 inch)"
      },
      {
        "label": "Height",
        "value": "35 mm (1.38 inch)"
      },
      {
        "label": "Efficiency Test Std",
        "value": "ISO 5011"
      },
      {
        "label": "Primary Application",
        "value": "MERCEDES-BENZ 0008301118"
      },
      {
        "label": "Type",
        "value": "Engine"
      },
      {
        "label": "Style",
        "value": "Panel"
      },
      {
        "label": "UPC Code",
        "value": "742330162910"
      }
    ],
    "gtin": "742330162910",
    "imageUrl": "/images/products/donaldson/p784473.jpg"
  },
  {
    "id": "donaldson-p550425",
    "partNo": "P550425",
    "brand": "Donaldson",
    "title": "กรองน้ำมันเครื่อง",
    "category": "oil_filter",
    "spec": "กรองน้ำมันเครื่อง",
    "description": "VOLVO 440 FH: กรองน้ำมันเครื่อง 21707132 → Donaldson P550425",
    "vehicleApplications": [
      "VOLVO 440 FH: กรองน้ำมันเครื่อง 21707132 → Donaldson P550425"
    ],
    "crossReferences": [
      {
        "brand": "VOLVO",
        "partNumber": "21707132",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 15; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "internal",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    }
  },
  {
    "id": "donaldson-p954895",
    "partNo": "P954895",
    "brand": "Donaldson",
    "title": "Fuel Filter, Water Separator Spin-On",
    "category": "fuel_filter",
    "spec": "OD 108 mm x L 158 mm x Overall L 160.5 mm x Thread 1-14 UN | Fuel Filter, Water Separator Spin-On",
    "description": "VOLVO 440 FH: กรองน้ำมันดีเซล 21380488 → Donaldson P954895",
    "vehicleApplications": [
      "VOLVO 440 FH: กรองน้ำมันดีเซล 21380488 → Donaldson P954895"
    ],
    "crossReferences": [
      {
        "brand": "VOLVO",
        "partNumber": "21380488",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 17; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p954895.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 938cd14ed82a80297d155d243a17103ffdbb5ab171323a47189d559bfedbfe21. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Overall Length",
        "value": "160.5 mm (6.32 inch)"
      },
      {
        "label": "Outer Diameter",
        "value": "108 mm (4.25 inch)"
      },
      {
        "label": "Thread Size",
        "value": "1-14 UN"
      },
      {
        "label": "Length",
        "value": "158 mm (6.22 inch)"
      },
      {
        "label": "Gasket OD",
        "value": "102 mm (4.02 inch)"
      },
      {
        "label": "Gasket ID",
        "value": "94 mm (3.70 inch)"
      },
      {
        "label": "Bowl Thread",
        "value": "3 1/8-10 UN"
      },
      {
        "label": "Efficiency 50%",
        "value": "9 micron"
      },
      {
        "label": "Efficiency 90%",
        "value": "20 micron"
      },
      {
        "label": "Efficiency 95%",
        "value": "25 micron"
      },
      {
        "label": "Efficiency 99%",
        "value": "30 micron"
      },
      {
        "label": "Efficiency Test Std",
        "value": "ISO 19438"
      },
      {
        "label": "Emulsified H2O Efficiency",
        "value": "90 Percent"
      },
      {
        "label": "Type",
        "value": "Water Separator"
      },
      {
        "label": "Style",
        "value": "Spin-On"
      },
      {
        "label": "Media Type",
        "value": "Cellulose, Meltblown"
      },
      {
        "label": "Primary Application",
        "value": "VOLVO 21380488"
      },
      {
        "label": "UPC Code",
        "value": "742330992913"
      }
    ],
    "gtin": "742330992913",
    "imageUrl": "/images/products/donaldson/p954895.jpg"
  },
  {
    "id": "donaldson-p550529",
    "partNo": "P550529",
    "brand": "Donaldson",
    "title": "กรองน้ำมันดีเซล",
    "category": "fuel_filter",
    "spec": "กรองน้ำมันดีเซล",
    "description": "VOLVO 440 FH: กรองน้ำมันดีเซล 22988765 → Donaldson P550529",
    "vehicleApplications": [
      "VOLVO 440 FH: กรองน้ำมันดีเซล 22988765 → Donaldson P550529"
    ],
    "crossReferences": [
      {
        "brand": "VOLVO",
        "partNumber": "22988765",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 18; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "internal",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    }
  },
  {
    "id": "mannfilter-hu721x",
    "partNo": "HU721X",
    "brand": "MANN-FILTER",
    "title": "กรองน้ำมันเกียร์",
    "category": "oil_filter",
    "spec": "กรองน้ำมันเกียร์",
    "description": "VOLVO 440 FH: กรองน้ำมันเกียร์ 22023120 → MANN-FILTER HU721X",
    "vehicleApplications": [
      "VOLVO 440 FH: กรองน้ำมันเกียร์ 22023120 → MANN-FILTER HU721X"
    ],
    "crossReferences": [
      {
        "brand": "VOLVO",
        "partNumber": "22023120",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 19; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "request",
    "sourceType": "internal",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14.",
    "dataQuality": "basic"
  },
  {
    "id": "mannfilter-cu31001",
    "partNo": "CU31001",
    "brand": "MANN-FILTER",
    "title": "กรองแอร์1",
    "category": "cabin_filter",
    "spec": "กรองแอร์1",
    "description": "VOLVO 440 FH: กรองแอร์1 23515329 → MANN-FILTER CU31001",
    "vehicleApplications": [
      "VOLVO 440 FH: กรองแอร์1 23515329 → MANN-FILTER CU31001"
    ],
    "crossReferences": [
      {
        "brand": "VOLVO",
        "partNumber": "23515329",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 21; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "internal",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    }
  },
  {
    "id": "donaldson-p955737",
    "partNo": "P955737",
    "brand": "Donaldson",
    "title": "Air Filter, Panel Ventilation",
    "category": "cabin_filter",
    "spec": "L 198 mm x W 272 mm x H 22 mm | Air Filter, Panel Ventilation",
    "description": "VOLVO 440 FH: กรองแอร์2 23515346 → Donaldson P955737",
    "vehicleApplications": [
      "VOLVO 440 FH: กรองแอร์2 23515346 → Donaldson P955737"
    ],
    "crossReferences": [
      {
        "brand": "VOLVO",
        "partNumber": "23515346",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 22; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "request",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p955737.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 11dcb33d21a005d5263a42f3e59bfc420dd0151df76dbc41531381a14043f7b3. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "specifications": [
      {
        "label": "Length",
        "value": "198 mm (7.80 inch)"
      },
      {
        "label": "Width",
        "value": "272 mm (10.71 inch)"
      },
      {
        "label": "Height",
        "value": "22 mm (0.87 inch)"
      },
      {
        "label": "Primary Application",
        "value": "VOLVO 82354791"
      },
      {
        "label": "Type",
        "value": "Ventilation"
      },
      {
        "label": "Style",
        "value": "Panel"
      },
      {
        "label": "UPC Code",
        "value": "742330225462"
      }
    ],
    "gtin": "742330225462",
    "imageUrl": "/images/products/donaldson/p955737.jpg"
  },
  {
    "id": "donaldson-p550335",
    "partNo": "P550335",
    "brand": "Donaldson",
    "title": "กรองน้ำมันเครื่อง",
    "category": "oil_filter",
    "spec": "กรองน้ำมันเครื่อง",
    "description": "TOYOTA: กรองน้ำมันเครื่อง 90915-TB001 → Donaldson P550335",
    "vehicleApplications": [
      "TOYOTA: กรองน้ำมันเครื่อง 90915-TB001 → Donaldson P550335",
      "TOYOTA REVO: กรองน้ำมันเครื่อง 90915-YZZD2 → Donaldson P550335"
    ],
    "crossReferences": [
      {
        "brand": "TOYOTA",
        "partNumber": "90915-TB001",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 25; customer-supplied vehicle/OEM-to-filter mapping."
      },
      {
        "brand": "TOYOTA",
        "partNumber": "90915-YZZD2",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 28; customer-supplied vehicle/OEM-to-filter mapping."
      },
      {
        "brand": "BLACK CLUBS",
        "partNumber": "BO234",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 28, column I. Boss corrected the column brand to BLACK CLUBS."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "internal",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    }
  },
  {
    "id": "donaldson-p506115",
    "partNo": "P506115",
    "brand": "Donaldson",
    "title": "Fuel Filter, Cartridge",
    "category": "fuel_filter",
    "spec": "OD 88.8 mm x ID 25 mm x Overall L 110 mm | Fuel Filter, Cartridge",
    "description": "TOYOTA REVO: กรองน้ำมันดีเซล 23390-OLO70 → Donaldson P506115",
    "vehicleApplications": [
      "TOYOTA REVO: กรองน้ำมันดีเซล 23390-OLO70 → Donaldson P506115"
    ],
    "crossReferences": [
      {
        "brand": "TOYOTA",
        "partNumber": "23390-OLO70",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 29; customer-supplied vehicle/OEM-to-filter mapping."
      },
      {
        "brand": "BLACK CLUBS",
        "partNumber": "BF168",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 29, column I. Boss corrected the column brand to BLACK CLUBS."
      }
    ],
    "stockStatus": "in_stock",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p506115.pdf, pages 1-2; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 4c84e33bd3bdb4368c6be859d5f0ba6196201d0c1d855d48bbe266f57361c061. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "mrtStockEvidence": {
      "status": "in_stock",
      "checkedAt": "2026-09-14",
      "source": "internal_record",
      "note": "Boss confirmed the มีสินค้า label from รายการ_น้ำมันและกรอง.xlsx on 2026-09-14."
    },
    "specifications": [
      {
        "label": "Overall Length",
        "value": "110 mm (4.33 inch)"
      },
      {
        "label": "Outer Diameter",
        "value": "88.8 mm (3.5 inch)"
      },
      {
        "label": "Inner Diameter",
        "value": "25 mm (0.98 inch)"
      },
      {
        "label": "Gasket OD",
        "value": "91.5 mm (3.6 inch)"
      },
      {
        "label": "Gasket ID",
        "value": "84.5 mm (3.33 inch)"
      },
      {
        "label": "Efficiency 99%",
        "value": "5 micron"
      },
      {
        "label": "Type",
        "value": "Water Separator"
      },
      {
        "label": "UPC Code",
        "value": "742330230268"
      }
    ],
    "gtin": "742330230268",
    "imageUrl": "/images/products/donaldson/p506115.jpg"
  },
  {
    "id": "donaldson-p903541",
    "partNo": "P903541",
    "brand": "Donaldson",
    "title": "Air Filter, Panel",
    "category": "air_filter",
    "spec": "L 324 mm x W 240 mm x H 58 mm | Air Filter, Panel",
    "description": "TOYOTA REVO: กรองอากาศ 178010LO40 → Donaldson P903541",
    "vehicleApplications": [
      "TOYOTA REVO: กรองอากาศ 178010LO40 → Donaldson P903541"
    ],
    "crossReferences": [
      {
        "brand": "TOYOTA",
        "partNumber": "178010LO40",
        "relationType": "unknown",
        "verificationStatus": "pending",
        "evidence": "MRT vehicle filter list",
        "source": "รายการ_น้ำมันและกรอง.xlsx",
        "evidenceNote": "รายการทั้งหมด, row 30; customer-supplied vehicle/OEM-to-filter mapping."
      }
    ],
    "stockStatus": "request",
    "sourceType": "mixed",
    "sourceNote": "รายการ_น้ำมันและกรอง.xlsx; รายการทั้งหมด. Boss confirmed scope and card statuses on 2026-09-14. Donaldson Product Specifications, p903541.pdf, pages 1; supplied 2026-09-14; specifications and original embedded 700x700 JPEG. PDF SHA-256 16a6464e07b74c68fb489ecde2602f035e27845c136f9b0a20da510a84eb7524. Manufacturer Primary Application is a separate reference, not proof of every spreadsheet OEM mapping.",
    "dataQuality": "basic",
    "specifications": [
      {
        "label": "Length",
        "value": "324 mm (12.76 inch)"
      },
      {
        "label": "Width",
        "value": "240 mm (9.45 inch)"
      },
      {
        "label": "Height",
        "value": "58 mm (2.28 inch)"
      },
      {
        "label": "Media Type",
        "value": "Flame Retardant"
      },
      {
        "label": "UPC Code",
        "value": "742330224328"
      }
    ],
    "gtin": "742330224328",
    "imageUrl": "/images/products/donaldson/p903541.jpg"
  }
];
