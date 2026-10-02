import type { Product } from "@/types/product";
import metricEvidence from "./mann-metric-2026-10-01.json";
import bearingEvidence from "./ntn-metric-2026-10-02.json";
import donaldsonEvidence from "./donaldson-metric-2026-10-02.json";
import { isLinearDimensionLabel } from "@/lib/products/metric";

type MetricEvidence = { source: string; checkedAt: string; dimensions: Array<{label: string; value: string}> };
const evidence: Record<string, MetricEvidence> = metricEvidence;

export function applyCatalogCorrections(product: Product): Product {
  let result = product;
  const ownerInterchangeGroups = [
    ["P170306", "P170310", "P170312", "P170308"],
    ["P551006", "P552006"],
  ];
  const interchangeGroup = product.brand.toLowerCase() === "donaldson"
    ? ownerInterchangeGroups.find(group => group.includes(product.partNo)) : undefined;
  if (interchangeGroup) result = {
    ...result,
    crossReferences: [
      ...(result.crossReferences ?? []).filter(row => typeof row === "string" ||
        !(String(row.brand ?? "").toLowerCase() === "donaldson" && interchangeGroup.includes(String(row.partNumber ?? "")))),
      ...interchangeGroup.filter(partNo => partNo !== product.partNo).map(partNumber => ({
        brand: "Donaldson", partNumber, relationType: "equivalent" as const,
        verificationStatus: "verified" as const, source: "owner_confirmation",
        evidenceNote: "Boss explicitly confirmed mutual interchangeability of this group on 2026-10-02 09:31 Asia/Bangkok.",
        approvedBy: "Boss", approvedAt: "2026-10-02",
      })),
    ],
  };
  const donaldson = product.brand.toLowerCase() === "donaldson"
    ? (donaldsonEvidence as Record<string, MetricEvidence>)[product.partNo]
    : undefined;
  if (donaldson) {
    result = {
      ...result,
      partNumberOnly: false,
      specifications: [
        ...(result.specifications ?? []).filter(row => !isLinearDimensionLabel(row.label) && !/^thread size$/i.test(row.label)),
        ...donaldson.dimensions,
      ],
      spec: donaldson.dimensions.map(row => `${row.label}: ${row.value}`).join(" · "),
      od_mm: undefined, id_mm: undefined, length_mm: undefined, thread: undefined,
    };
    // p954604.pdf identifies a cartridge, not the older Spin-On placeholder.
    if (product.partNo === "P954604") result = {
      ...result, category: "fuel_filter", type: "cartridge",
      title: "Fuel Filter, Cartridge",
      description: "ไส้กรองเชื้อเพลิงแบบไส้เปลี่ยน / Fuel filter cartridge",
      shortDescription: "Fuel filter cartridge",
      specifications: [
        ...(result.specifications ?? []).filter(row => !/^(?:product )?type$|^style$/i.test(row.label)),
        { label: "Style", value: "Cartridge" },
      ],
    };
  }
  const bearing = product.brand === "NTN"
    ? (bearingEvidence as Record<string, { source: string; dimensions: Array<{ label: string; value: string }> }>)[product.partNo]
    : undefined;
  if (bearing) {
    result = {
      ...result,
      officialUrl: bearing.source,
      partNumberOnly: false,
      specifications: [
        ...(product.specifications ?? []).filter(row => !isLinearDimensionLabel(row.label)),
        ...bearing.dimensions,
      ],
      spec: bearing.dimensions.map(row => `${row.label}: ${row.value}`).join(" · "),
      od_mm: undefined, id_mm: undefined, length_mm: undefined,
    };
  }
  if (product.brand === "MANN-FILTER") {
    const key = product.partNo.toLowerCase().replace(/[\s/_-]+/g, "");
    const metric = evidence[key];
    if (metric) {
      result = {
        ...product,
        officialUrl: metric.source,
        partNumberOnly: false,
        specifications: [
          ...(product.specifications ?? []).filter(row => !isLinearDimensionLabel(row.label) && !/thread/i.test(row.label)),
          ...metric.dimensions,
        ],
        spec: metric.dimensions.map(row => `${row.label}: ${row.value}`).join(" · "),
        // Remove older dimensional overrides; search now uses the verified metric rows.
        od_mm: undefined, id_mm: undefined, length_mm: undefined, thread: undefined,
      };
    }
    // Owner confirmed stock and supplied manufacturer screenshots on 2026-10-02.
    if (key === "tb13941x") result = {
      ...result,
      stockStatus: "in_stock",
      checkAvailability: false,
      mrtStockEvidence: { status: "in_stock", checkedAt: "2026-10-02", source: "internal_record", note: "Stock confirmed by Boss; manufacturer availability is not used as MRT stock evidence." },
      crossReferences: [
        ...(result.crossReferences ?? []),
        ...[
          ["AGCO", "72631214"],
          ...["5801382289", "503137742", "500041486", "500055322", "500086279", "503137484", "500050616"].map(partNo => ["IVECO", partNo]),
        ].map(([brand, partNumber]) => ({ brand, partNumber, relationType: "equivalent", verificationStatus: "verified", source: "owner_supplied_manufacturer_screenshot", evidenceNote: "Visible expanded AGCO and IVECO entries in image(1).png, explicitly identified by Boss as TB1394/1X references on 2026-10-02. Confirm application before ordering.", approvedBy: "Boss", approvedAt: "2026-10-02" })),
      ],
    };
    if (key === "bfu900x") result = { ...result, type: "cartridge", description: "ไส้กรองเชื้อเพลิงดีเซลแบบไส้เปลี่ยน พร้อมปะเก็น / Diesel fuel filter element with gasket." };
    if (key === "c14200") result = {
      ...result, category: "air_filter",
      // Brand confirmed by Donaldson; interchange compatibility remains pending.
      crossReferences: [{ partNumber: "P778984", brand: "Donaldson", relationType: "unknown", verificationStatus: "pending", evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P778984/22048" }],
      specifications: result.specifications?.filter(row => !/valve/i.test(row.label)),
    };
  }
  // Manufacturer Product Specifications PDFs supplied and reviewed on 2026-10-02.
  if (["P537876", "P537877"].includes(product.partNo) && product.brand.toLowerCase() === "donaldson") {
    const primary = product.partNo === "P537876";
    const [od, id, length] = primary ? [281.6, 147.9, 510] : [150.9, 109.6, 496.4];
    result = { ...result, dimensionReviewRequired: false, partNumberOnly: false,
      title: primary ? "Air Filter, Primary RadialSeal" : "Air Filter, Safety RadialSeal",
      description: primary ? "ไส้กรองอากาศหลักแบบ RadialSeal / Primary RadialSeal air filter" : "ไส้กรองอากาศชั้นในแบบ Safety RadialSeal / Safety RadialSeal air filter",
      spec: `OD ${od} mm · ID ${id} mm · Length ${length} mm`,
      specifications: [
        {label:"Outer Diameter",value:`${od} mm`},
        {label:"Inner Diameter",value:`${id} mm`},
        {label:"Length",value:`${length} mm`},
        {label:"Type",value:primary ? "Primary" : "Safety"},
        {label:"Style",value:"RadialSeal"},
        {label:"Media Type",value:primary ? "Cellulose" : "Safety"},
        {label:"Efficiency",value:primary ? "99.9" : "95"},
        {label:"Efficiency Test Std",value:"ISO 5011"},
        ...(primary ? [{label:"Family",value:"FRG"}] : []),
        {label:"UPC Code",value:primary ? "742330086797" : "742330086803"},
      ],
      od_mm: od, id_mm: id, length_mm: length,
    };
  }
  // Boss confirmed ordinary Length 524 mm on 2026-10-02; retire conflicting 517.8 overall value.
  if (product.partNo === "P777868" && product.brand.toLowerCase() === "donaldson") {
    result = { ...result, length_mm: 524,
      specifications: [
        ...(result.specifications ?? []).filter(row => !/^(?:overall )?length(?: \(mm\))?$/i.test(row.label.trim())),
        { label: "Length", value: "524 mm" },
      ],
    };
  }
  const brandImage = product.brand === "FULL"
    ? "/images/brands/secondary/full-filter.webp"
    : product.brand === "BLACK CLUB" ? "/images/brands/secondary/backcup.webp" : undefined;
  if (brandImage) result = {
    ...result, inquiryOnly: true, excludeDimensionSearch: true, checkAvailability: true, partNumberOnly: false,
    stockStatus: "request", mrtStockEvidence: undefined,
    imageUrl: brandImage, detailImageUrl: brandImage, images: [brandImage], media: [brandImage], officialImageUrl: null,
  };
  return result;
}
