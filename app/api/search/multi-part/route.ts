import { NextRequest, NextResponse } from "next/server";
import {
  MAX_MULTI_PART_ROWS,
  parseMultiPartInputs,
} from "@/lib/search/multiPartInput";
import { createExactProductLookup } from "@/lib/search/search";

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
  matchType: string;
  matchedReference?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as LookupRequest;
  const rawPartNumbers = Array.isArray(body.partNumbers)
    ? body.partNumbers
    : [];

  const rows = parseMultiPartInputs(rawPartNumbers);

  if (rows.length > MAX_MULTI_PART_ROWS) {
    return NextResponse.json(
      { error: "too_many_items", maxItems: MAX_MULTI_PART_ROWS },
      { status: 400 },
    );
  }

  const exactLookup = createExactProductLookup();

  const results = rows.map((row) => {
    const matches: ProductMatch[] = exactLookup
      .find(row.originalPartNo)
      .map((item) => ({
        id: item.id,
        partNo: item.partNo,
        brand: item.brand,
        title: item.title,
        category: item.category,
        matchType: item._matchType,
        matchedReference: item._matchedRelation?.partNumber,
      }));

    if (matches.length === 1) {
      return {
        status: "found" as const,
        originalPartNo: row.originalPartNo,
        normalizedPartNo: row.normalizedPartNo,
        qty: row.qty,
        product: matches[0],
      };
    }

    if (matches.length > 1) {
      return {
        status: "ambiguous" as const,
        originalPartNo: row.originalPartNo,
        normalizedPartNo: row.normalizedPartNo,
        qty: row.qty,
        matches,
      };
    }

    return {
      status: "missing" as const,
      originalPartNo: row.originalPartNo,
      normalizedPartNo: row.normalizedPartNo,
      qty: row.qty,
    };
  });

  return NextResponse.json({ results });
}
