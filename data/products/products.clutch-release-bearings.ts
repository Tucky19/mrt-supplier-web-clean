import type { Product } from "@/types/product";
import type { ProductRelationInput } from "@/lib/products/relations";

type ClutchReleaseBearingRow = {
  maker: string;
  mrk: string;
  parts: string[];
  nsk?: string[];
  ntn?: string[];
  koyo?: string[];
  nachi?: string[];
  type: "A" | "B";
};

// Transcribed from user-provided screenshots on 2026-09-24.
// Source legend: A = Angular Contact Type, B = Self Centering Type.
// Cross-reference mappings are intentionally pending until independently verified.
const rows: ClutchReleaseBearingRow[] = [
  { maker: "HYUNDAI", mrk: "TKS48-01K", parts: ["41421-21000/300/400/26000"], nsk: ["48TKA3201"], ntn: ["FCR48-11/2E"], koyo: ["RCT322SA"], nachi: ["48SCRN32K"], type: "B" },
  { maker: "HYUNDAI", mrk: "TKS55-17K", parts: ["41221-43010"], ntn: ["FCR55-17-8.9.10.11/2E"], koyo: ["RCTS325SA"], type: "B" },
  { maker: "HYUNDAI", mrk: "TKS48-33K", parts: ["41421-28000"], type: "B" },
  { maker: "HYUNDAI", mrk: "TKS68-47K", parts: ["41420-5H510"], koyo: ["RCT4700SA"], type: "B" },
  { maker: "HYUNDAI", mrk: "TKS58-37K", parts: ["41420-45001"], nsk: ["58TKA3702U3", "58TKA3703/B"], koyo: ["RCT371SA"], type: "B" },
  { maker: "KIA", mrk: "TKS48-29K", parts: ["0K2A1-16-510"], type: "B" },
  { maker: "SUZUKI", mrk: "24TK308BK", parts: ["09269-38001"], nsk: ["24TK308B2"], ntn: ["SF0816/2E"], koyo: ["RCT38SL1"], nachi: ["BC12S4SB"], type: "A" },
  { maker: "SUZUKI", mrk: "TKS52-28K", parts: ["09269-28006"], koyo: ["RCTS28SA"], type: "B" },
  { maker: "SUZUKI", mrk: "TKS50-30K", parts: ["09269-33001/2/3/5", "23265-70C00/80D00/77D00"], nsk: ["50TKB3304", "50TKE3301"], ntn: ["FCR50-30-2"], koyo: ["RCTS338SA1/2"], type: "B" },
  { maker: "SUZUKI", mrk: "TKS50-42K", parts: ["23265-65G00"], ntn: ["FCR50-42-2/2E"], type: "B" },
  { maker: "SUZUKI", mrk: "TKS44-30K", parts: ["09269-28004/5"], ntn: ["FCR44-9/2E"], koyo: ["RCT283SA"], type: "B" },
  { maker: "SUZUKI", mrk: "TKS48-39K", parts: ["23265-81A20"], ntn: ["FCR48-39-6/2E"], type: "B" },
  { maker: "HONDA", mrk: "TK35-2RS", parts: ["22863-689-000/003", "22863-PB6-000/003"], koyo: ["RCT3570-2RS"], nachi: ["35TRBC07-5SB"], type: "A" },
  { maker: "HONDA", mrk: "TK33-1K", parts: ["22863-634-003/023"], nsk: ["TK33-1U3"], ntn: ["SF0724/2E"], koyo: ["RCT3360SL1"], nachi: ["BC7S1SB"], type: "A" },
  { maker: "HONDA", mrk: "TKS-55/5K", parts: ["22810-PB6-921/2", "22810-PC6-921", "228010-PC8-921/2/3"], nsk: ["55TKA3102"], ntn: ["X10-FCR55-5/2E"], koyo: ["RCTS31SA"], type: "B" },
  { maker: "HONDA", mrk: "TKS55-35K", parts: ["22810-PX5-003/4", "22810-PG21-000/4/8", "22810-P21-003"], koyo: ["CBU553524", "RCTS354SA"], nachi: ["50SCRN41P"], type: "B" },
  { maker: "HONDA", mrk: "TKS47-40K", parts: ["22810-P20-003/5", "22810-PLW-003/5"], nsk: ["47TKB3102A"], nachi: ["47SCRN40P-4"], type: "B" },
  { maker: "HONDA", mrk: "TKS47-31K", parts: ["22810-PL3-003/5"], nsk: ["47TKB3101A"], type: "B" },
  { maker: "HONDA", mrk: "TKS55-38K", parts: ["22810-PS1-000/5/8/15"], nsk: ["55TKB3502A"], type: "B" },
  { maker: "HONDA", mrk: "TKS55-34K", parts: ["22810-PPT-003"], nachi: ["55SCRN34P-8"], type: "B" },
  { maker: "HINO", mrk: "TKS70-1K", parts: ["31242-1060/A", "312301040A"], nsk: ["TK70-1A1U3"], ntn: ["SF1412/2E"], koyo: ["CT70B/L1"], nachi: ["70TNK-1"], type: "A" },
  { maker: "ISUZU", mrk: "24TK308BK", parts: ["9-00095-040-1"], nsk: ["24TK308B2"], ntn: ["SF0816/2E"], koyo: ["RCT38SL1"], nachi: ["BC12S4SB"], type: "A" },
  { maker: "ISUZU", mrk: "TKS48-37K", parts: ["8-94101-243-0"], nsk: ["48TKA3214"], koyo: ["RCT37SA1"], type: "B" },
  { maker: "ISUZU", mrk: "TKS60-42K", parts: ["8-94453-348", "8-84379-499-0"], koyo: ["RCT422SA"], type: "B" },
  { maker: "ISUZU", mrk: "TKS87-43K", parts: ["8-94389-416-0", "8-94109-658-0/1"], koyo: ["RCT423SA"], type: "B" },
  { maker: "ISUZU", mrk: "TKS62-42K", parts: ["8-97023-074-0"], koyo: ["RCT473SA"], type: "B" },
  { maker: "ISUZU", mrk: "TKS54-40K", parts: ["5-31314-001"], nsk: ["54TKA3501"], koyo: ["RCT401SA"], type: "B" },
  { maker: "ISUZU", mrk: "TKS78-54K", parts: ["1-09820-078-0"], nsk: ["78TKC5401"], type: "B" },
  { maker: "ISUZU", mrk: "TK45-4UK", parts: ["9-00095-038-1"], nsk: ["TK45-4U3"], ntn: ["45TMK804X"], koyo: ["CT45-1S"], nachi: ["45TNK804"], type: "A" },
  { maker: "ISUZU", mrk: "TKS-55B", parts: ["1-09820-008-0", "9-00095-038-1"], nsk: ["TK55-1A1U3"], ntn: ["55TMK804X/2E"], koyo: ["CT55BL1"], nachi: ["55TMK804"], type: "A" },
  { maker: "ISUZU", mrk: "TKS70-1K", parts: ["9-00095-044-1"], nsk: ["TK70-1A1U3"], ntn: ["SF1412/2E"], koyo: ["CT70B/L1"], nachi: ["70TNK-1"], type: "A" },
  { maker: "ISUZU", mrk: "TKS48-45K", parts: ["8-97209-197-0"], nsk: ["48TKB3204R"], type: "B" },
  { maker: "ISUZU", mrk: "TKS48-43K", parts: ["8-97333-487-0"], nsk: ["48TKB3205"], type: "B" },
  { maker: "ISUZU", mrk: "TKS78-40K", parts: ["8-97089-652", "8-97013-553"], nsk: ["78TKL4001AR"], type: "B" },
  { maker: "ISUZU", mrk: "TKS78-48K", parts: ["8-97255-313-0"], nsk: ["78TKL4801R"], type: "B" },
  { maker: "ISUZU", mrk: "TKS68-32K", parts: ["8-94377-417-1"], nsk: ["68TKP3201"], type: "B" },
  { maker: "ISUZU", mrk: "TKS60-30K", parts: ["8-97316-591-0"], nsk: ["60TKZ3201"], type: "B" },
  { maker: "ISUZU", mrk: "TKS48-30K", parts: ["8-94133-417"], nsk: ["48TKA3211"], type: "B" },
  { maker: "ISUZU", mrk: "TKS60-50K", parts: ["8-97316-602-0"], nsk: ["60TKZ3503R"], type: "B" },
  { maker: "ISUZU", mrk: "TKS90-60K", parts: ["1-31310-022-0"], nsk: ["106TKL6101RA1"], type: "B" },
  { maker: "ISUZU", mrk: "TKS70-48K", parts: ["1-31310-012-0"], nsk: ["81TKL4801R"], type: "B" },
  { maker: "ISUZU", mrk: "TKS60-28K", parts: ["8-98169-826-1"], type: "B" },
  { maker: "SUBARU", mrk: "TK40-14K", parts: ["43151-7000"], nsk: ["TK40-14AU3"], ntn: ["SF0815/4E"], koyo: ["RCT4064SL1"], nachi: ["40TRK39-1SB"], type: "A" },
  { maker: "SUBARU", mrk: "35TMK29KR", parts: ["83151-4700", "30502-KA000"], nsk: ["35TMK29B2"], ntn: ["SF0721/2E"], koyo: ["RCT35-1"], nachi: ["35TRK-1"], type: "A" },
  { maker: "SUBARU", mrk: "TKS54-60K", parts: ["30502-AA042/043/080/100"], ntn: ["FCR54-60-10/2E", "FCR54-60-13/2E"], type: "B" },
  { maker: "MAZDA", mrk: "TK40-14K", parts: ["0221-16-222"], nsk: ["TK40-14AU3"], ntn: ["SF0815/4E"], koyo: ["RCT4064SL1"], nachi: ["40TRK39-1SB"], type: "A" },
  { maker: "MAZDA", mrk: "TK45-4BK", parts: ["0222-16-222"], nsk: ["TK40-14AU3"], ntn: ["SF0815/4E"], koyo: ["RCT4064SL1"], nachi: ["40TRK39-1SB"], type: "A" },
  { maker: "MAZDA", mrk: "TKS-54K", parts: ["8540-16-510B", "H606-16-510A"], nsk: ["54TKE3602A"], ntn: ["FCR54-10.46.58/2E"], koyo: ["RCT363SA"], nachi: ["54SCRN042S"], type: "B" },
  { maker: "MAZDA", mrk: "TKS50-10K", parts: ["E301-16-510"], ntn: ["FCR50-10/2E"], koyo: ["RCT331SA"], type: "B" },
  { maker: "MAZDA", mrk: "TKS50-1K", parts: ["8531-16-510A"], ntn: ["FCR50-1/2E"], koyo: ["RCT336SA"], type: "B" },
  { maker: "MAZDA", mrk: "TKS54-19K", parts: ["FE62-16-510A", "SE03-16-510A"], ntn: ["FCR54-13.19.47.48/2E"], koyo: ["RCT363SA1"], type: "B" },
  { maker: "MAZDA", mrk: "TKS50-17K", parts: ["E301-16-510A"], ntn: ["FCR50-17-8/2E"], koyo: ["RCT331SA1"], type: "B" },
  { maker: "MAZDA", mrk: "TKS44-21K", parts: ["B622-16-510"], ntn: ["FCR44-21/2E"], type: "B" },
  { maker: "MAZDA", mrk: "TKS54-33K", parts: ["FE84-16-510"], ntn: ["FCR54-33-1/2E"], koyo: ["CBU543625J"], type: "B" },
  { maker: "MAZDA", mrk: "TKS47-35K", parts: ["B315-16-510", "B301-16-510", "B311-16-510"], ntn: ["FCR47-8-4/2E"], koyo: ["CBU472921C"], nachi: ["47SCRN34-P6"], type: "B" },
  { maker: "MITSUBISHI", mrk: "TK45-4BK", parts: ["MD702241"], nsk: ["TK45-4BU3"], ntn: ["SF0914/4E"], koyo: ["RCT45-1S"], nachi: ["45TMK-1"], type: "A" },
  { maker: "MITSUBISHI", mrk: "24TK308BK", parts: ["MD701283"], nsk: ["24TK308B2"], ntn: ["SF0816/2E"], koyo: ["RCT38SL1"], nachi: ["BC12S4SB"], type: "A" },
  { maker: "MITSUBISHI", mrk: "TKS48-01K", parts: ["MD706180"], nsk: ["48TKA3201"], ntn: ["FCR48-11/2E"], koyo: ["RCT322SA"], nachi: ["48SCRN32K"], type: "B" },
  { maker: "MITSUBISHI", mrk: "TKS55-17K", parts: ["MD719469", "MR195689"], ntn: ["FCR55-17-8.9.10.11/2E"], koyo: ["RCTS325SA"], type: "B" },
  { maker: "MITSUBISHI", mrk: "TKS55-1K", parts: ["MD703270"], nsk: ["55TKA3201"], ntn: ["FCR55-1/2E"], koyo: ["RCTS324SA"], type: "B" },
  { maker: "MITSUBISHI", mrk: "TKS58-37K", parts: ["ME602710", "ME600576", "ME605584", "MR446314"], nsk: ["58TKA3702U3", "58TKA3703/B"], koyo: ["RCT371SA"], type: "B" },
  { maker: "MITSUBISHI", mrk: "TKS-55B", parts: ["ME620330"], nsk: ["TK55-1A1U3"], ntn: ["55TMK804X/2E"], koyo: ["CT55BL1"], nachi: ["55TMK804"], type: "A" },
  { maker: "MITSUBISHI", mrk: "TKS70-1K", parts: ["03452-21001/3/84/85"], nsk: ["TK70-1A1U3"], ntn: ["SF1412/2E"], koyo: ["CT70B/L1"], nachi: ["70TNK-1"], type: "A" },
  { maker: "MITSUBISHI", mrk: "TKS54-60K", parts: ["MR145619"], ntn: ["FCR54-60-10/2E", "FCR54-60-13/2E"], type: "B" },
  { maker: "MITSUBISHI", mrk: "TKS68-47K", parts: ["ME615140"], koyo: ["RCT4700SA"], type: "B" },
  { maker: "MITSUBISHI", mrk: "TKS32-1K", parts: ["MN171419"], koyo: ["RCT3200SA1"], type: "B" },
  { maker: "MITSUBISHI", mrk: "TKS68-26U", parts: ["MN168395"], type: "B" },
];

const SOURCE = "MRK Clutch Release Bearings chart (Scribd document 402068671)";
const SOURCE_URL = "https://www.scribd.com/document/402068671/Clutch-Release-Bearing";

function relation(partNumber: string, brand: string, maker?: string): ProductRelationInput {
  return {
    partNumber,
    brand,
    relationType: "unknown",
    verificationStatus: "pending",
    source: SOURCE,
    evidenceUrl: SOURCE_URL,
    evidenceNote: maker
      ? `Transcribed from the ${maker} row in screenshots supplied by the site owner on 2026-09-24; not independently verified.`
      : "Transcribed from screenshots supplied by the site owner on 2026-09-24; not independently verified.",
  };
}

function uniqueRelations(values: ProductRelationInput[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    if (typeof value === "string") return false;
    const key = `${String(value.brand ?? "").toLowerCase()}|${String(value.partNumber ?? value.partNo ?? "").toLowerCase()}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const rowsByMrk = new Map<string, ClutchReleaseBearingRow[]>();
for (const row of rows) {
  const group = rowsByMrk.get(row.mrk) ?? [];
  group.push(row);
  rowsByMrk.set(row.mrk, group);
}

export const clutchReleaseBearingProducts: Product[] = Array.from(rowsByMrk.entries()).map(([mrk, groupedRows]) => {
  const makers = Array.from(new Set(groupedRows.map((row) => row.maker)));
  const types = Array.from(new Set(groupedRows.map((row) => row.type)));
  const crossReferences: ProductRelationInput[] = [];
  const vehicleApplications: string[] = [];

  for (const row of groupedRows) {
    for (const part of row.parts) crossReferences.push(relation(part, row.maker, row.maker));
    for (const part of row.nsk ?? []) crossReferences.push(relation(part, "NSK", row.maker));
    for (const part of row.ntn ?? []) crossReferences.push(relation(part, "NTN", row.maker));
    for (const part of row.koyo ?? []) crossReferences.push(relation(part, "KOYO", row.maker));
    for (const part of row.nachi ?? []) crossReferences.push(relation(part, "NACHI", row.maker));
    vehicleApplications.push(`${row.maker}: ${row.parts.join(", ")}`);
  }

  const typeLabel = types.length === 1
    ? types[0] === "A" ? "Angular Contact" : "Self Centering"
    : "Mixed catalog type";

  return {
    id: `mrk-clutch-release-${mrk.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    partNo: mrk,
    brand: "MRK",
    title: "Clutch Release Bearing Cross Reference",
    category: "clutch_release_bearing",
    spec: `${typeLabel} clutch release bearing reference | ${makers.join(", ")}`,
    description: `Clutch release bearing reference for ${makers.join(", ")}. Searchable by OEM, NSK, NTN, KOYO and NACHI references where supplied.`,
    vehicleApplications: Array.from(new Set(vehicleApplications)),
    crossReferences: uniqueRelations(crossReferences),
    specifications: [
      { label: "Catalog Type", value: types.join(" / ") },
      { label: "Type Meaning", value: typeLabel },
      { label: "Vehicle Makes", value: makers.join(", ") },
    ],
    checkAvailability: true,
    partNumberOnly: true,
    stockStatus: "request",
    sourceType: "catalog",
    sourceNote: `${SOURCE}. Transcribed from screenshots supplied by the site owner on 2026-09-24; mappings remain pending verification.`,
    dataQuality: "needs_review",
  };
});
