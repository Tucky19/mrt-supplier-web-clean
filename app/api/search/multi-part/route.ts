import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products/index";

export const dynamic = "force-dynamic";

type LookupRequest = {
  partNumbers?: unknown;
};

type ProductMatch = {
  id: string;
  partNo: string;
  brand?: string;
  title?: string;
  category?: string;
};

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function cleanPartNo(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as LookupRequest;
  const rawPartNumbers = Array.isArray(body.partNumbers)
    ? body.partNumbers
    : [];

  const rows: Array<{ originalPartNo: string; normalizedPartNo: string }> = [];
  const seen = new Set<string>();

  for (const rawPartNo of rawPartNumbers) {
    const originalPartNo = cleanPartNo(rawPartNo);
    const normalizedPartNo = normalizePartNo(originalPartNo);

    if (!originalPartNo || !normalizedPartNo || seen.has(normalizedPartNo)) {
      continue;
    }

    seen.add(normalizedPartNo);
    rows.push({ originalPartNo, normalizedPartNo });
  }

  const matchesByNormalizedPartNo = new Map<string, ProductMatch[]>();

  for (const product of products) {
    const normalizedPartNo = normalizePartNo(product.partNo);
    if (!normalizedPartNo) continue;

    const matches = matchesByNormalizedPartNo.get(normalizedPartNo) ?? [];
    matches.push({
      id: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      category: product.category,
    });
    matchesByNormalizedPartNo.set(normalizedPartNo, matches);
  }

  const results = rows.map((row) => {
    const matches = matchesByNormalizedPartNo.get(row.normalizedPartNo) ?? [];

    if (matches.length === 1) {
      return {
        status: "found" as const,
        originalPartNo: row.originalPartNo,
        normalizedPartNo: row.normalizedPartNo,
        product: matches[0],
      };
    }

    if (matches.length > 1) {
      return {
        status: "ambiguous" as const,
        originalPartNo: row.originalPartNo,
        normalizedPartNo: row.normalizedPartNo,
        matches,
      };
    }

    return {
      status: "missing" as const,
      originalPartNo: row.originalPartNo,
      normalizedPartNo: row.normalizedPartNo,
    };
  });

  return NextResponse.json({ results });
}
