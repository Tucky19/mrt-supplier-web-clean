export type VerifiedAirFilterPair = {
  primaryPartNo: string;
  safetyPartNo: string;
  evidenceUrl: string;
  evidenceDirection: "reciprocal" | "primary_to_safety" | "safety_to_primary";
};

export const verifiedAirFilterPairs: VerifiedAirFilterPair[] = [
  {
    primaryPartNo: "P181059",
    safetyPartNo: "P112212",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P181059/17821",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P181046",
    safetyPartNo: "P119373",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P119373/15053",
    evidenceDirection: "safety_to_primary",
  },
  {
    primaryPartNo: "P181034",
    safetyPartNo: "P119374",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P181034/17797",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P182034",
    safetyPartNo: "P119374",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P182034/17937",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P535365",
    safetyPartNo: "P119374",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P535365/19668",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "R800103",
    safetyPartNo: "P119374",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/R800103/22654",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P181064",
    safetyPartNo: "P119375",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P181064/17826",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P181052",
    safetyPartNo: "P123160",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P123160/15172",
    evidenceDirection: "safety_to_primary",
  },
  {
    primaryPartNo: "P181080",
    safetyPartNo: "P127315",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P127315/15260",
    evidenceDirection: "safety_to_primary",
  },
  {
    primaryPartNo: "P181042",
    safetyPartNo: "P128408",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P181042/17805",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P181054",
    safetyPartNo: "P131394",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P181054/17816",
    evidenceDirection: "primary_to_safety",
  },
  {
    primaryPartNo: "P181103",
    safetyPartNo: "P158661",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P181103/17859",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P181103",
    safetyPartNo: "P158678",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P181103/17859",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P181104",
    safetyPartNo: "P158669",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P158669/15743",
    evidenceDirection: "safety_to_primary",
  },
  {
    primaryPartNo: "P181118",
    safetyPartNo: "P158670",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P158670/15744",
    evidenceDirection: "safety_to_primary",
  },
  {
    primaryPartNo: "P181119",
    safetyPartNo: "P158671",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P158671/15745",
    evidenceDirection: "safety_to_primary",
  },
  {
    primaryPartNo: "P181191",
    safetyPartNo: "P522452",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P181191/17906",
    evidenceDirection: "primary_to_safety",
  },
  {
    primaryPartNo: "P781039",
    safetyPartNo: "P777639",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P777639/21940",
    evidenceDirection: "safety_to_primary",
  },
  {
    primaryPartNo: "P777871",
    safetyPartNo: "P777875",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P777871/21960",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P778972",
    safetyPartNo: "P780012",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P778972/22046",
    evidenceDirection: "reciprocal",
  },
  {
    primaryPartNo: "P778984",
    safetyPartNo: "P780024",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P778984/22048",
    evidenceDirection: "primary_to_safety",
  },
  {
    primaryPartNo: "P778994",
    safetyPartNo: "P780036",
    evidenceUrl: "https://shop.donaldson.com/store/en-us/product/P778994/22050",
    evidenceDirection: "reciprocal",
  },
];

function normalizePartNo(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/_-]+/g, "");
}

const pairedPartsByPartNo = new Map<
  string,
  Array<{ partNo: string; relation: "outer" | "inner"; note: string }>
>();

for (const pair of verifiedAirFilterPairs) {
  const primaryKey = normalizePartNo(pair.primaryPartNo);
  const safetyKey = normalizePartNo(pair.safetyPartNo);
  const primaryPairs = pairedPartsByPartNo.get(primaryKey) ?? [];
  const safetyPairs = pairedPartsByPartNo.get(safetyKey) ?? [];

  primaryPairs.push({
    partNo: pair.safetyPartNo,
    relation: "inner",
    note: "Safety Filter ที่ Donaldson ระบุว่าใช้ร่วมกับ Primary Filter เบอร์นี้",
  });
  safetyPairs.push({
    partNo: pair.primaryPartNo,
    relation: "outer",
    note: "Primary Filter ที่ Donaldson ระบุว่าใช้ร่วมกับ Safety Filter เบอร์นี้",
  });

  pairedPartsByPartNo.set(primaryKey, primaryPairs);
  pairedPartsByPartNo.set(safetyKey, safetyPairs);
}

export function getVerifiedAirFilterPairedParts(partNo: string) {
  return pairedPartsByPartNo.get(normalizePartNo(partNo)) ?? [];
}
