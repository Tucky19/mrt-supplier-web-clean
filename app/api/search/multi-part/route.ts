import { NextRequest, NextResponse } from "next/server";
import { parseMultiPartInputs } from "@/lib/search/multiPartInput";
import { focusSearchResults, searchProducts } from "@/lib/search/search";

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

  const results = rows.map((row) => {
    const matches: ProductMatch[] = focusSearchResults(
      searchProducts(row.originalPartNo, { limit: 25 }),
    )
      .filter((item) =>
        ["Exact", "Cross Ref", "Same-brand Ref", "Kit Component"].includes(
          item._matchType,
        ),
      )
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
