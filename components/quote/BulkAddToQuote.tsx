"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products/index";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  locale: string;
};

type QuoteProduct = {
  id: string;
  partNo: string;
  brand?: string;
  title?: string;
};

type ParsedRow = {
  partNo: string;
  normalizedPartNo: string;
  qty: number;
};

const MAX_QTY = 999;

function normalizePartNo(value: string) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s/_-]+/g, "");
}

function clampQty(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(value)));
}

function cleanPartNo(value: string) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseLine(rawLine: string, knownMap: Map<string, QuoteProduct>): ParsedRow | null {
  const trimmed = rawLine.trim();
  if (!trimmed) return null;

  const explicitPatterns = [
    /^(.+?)\s*[xX]\s*(\d+)$/,
    /^(.+?)\s*,\s*(\d+)$/,
    /^(.+?)\t+(\d+)$/,
    /^(.+?)\s+-\s+(\d+)$/,
  ];

  for (const pattern of explicitPatterns) {
    const match = trimmed.match(pattern);
    if (!match) continue;

    const partNo = cleanPartNo(match[1]);
    const qty = clampQty(Number(match[2]));
    if (!partNo) return null;

    return {
      partNo,
      normalizedPartNo: normalizePartNo(partNo),
      qty,
    };
  }

  const cleanedWhole = cleanPartNo(trimmed);
  const normalizedWhole = normalizePartNo(cleanedWhole);

  if (knownMap.has(normalizedWhole)) {
    return {
      partNo: cleanedWhole,
      normalizedPartNo: normalizedWhole,
      qty: 1,
    };
  }

  const trailingQtyMatch = trimmed.match(/^(.+?)\s+(\d+)$/);
  if (trailingQtyMatch) {
    const partNo = cleanPartNo(trailingQtyMatch[1]);
    const qty = clampQty(Number(trailingQtyMatch[2]));
    if (!partNo) return null;

    return {
      partNo,
      normalizedPartNo: normalizePartNo(partNo),
      qty,
    };
  }

  if (!normalizedWhole) return null;

  return {
    partNo: cleanedWhole,
    normalizedPartNo: normalizedWhole,
    qty: 1,
  };
}

export default function BulkAddToQuote({ locale }: Props) {
  const { addItem } = useQuote();
  const isThai = locale === "th";
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<{ added: number; manual: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const text = isThai
    ? {
        title: "ค้นหาหลาย Part Number ในครั้งเดียว",
        description:
          "วาง Part Number ทีละบรรทัด หรือคัดลอกจาก Excel เพื่อเพิ่มหลายรายการเข้า RFQ ได้ทันที",
        placeholder:
          "ตัวอย่าง:\nP551315 x 2\nP181104 x 1\nW 920/21 x 4\nC 20 500 x 1\nABC123 x 3",
        button: "เพิ่มทั้งหมดเข้า RFQ",
        success: (count: number) => `เพิ่ม ${count} รายการเข้า RFQ แล้ว`,
        manual: (count: number) =>
          `${count} รายการที่ยังไม่พบในระบบจะถูกส่งให้ทีมตรวจสอบใน RFQ`,
        invalid: "กรุณาวาง Part Number อย่างน้อย 1 รายการ",
        brand: "ขอให้ทีมตรวจสอบ",
        titleFallback: "รายการที่ลูกค้าระบุ",
      }
    : {
        title: "Add multiple Part Numbers at once",
        description:
          "Paste part numbers line by line or copy from Excel to add multiple items to your RFQ.",
        placeholder:
          "Example:\nP551315 x 2\nP181104 x 1\nW 920/21 x 4\nC 20 500 x 1\nABC123 x 3",
        button: "Add all to RFQ",
        success: (count: number) => `Added ${count} items to RFQ`,
        manual: (count: number) =>
          `${count} items were not found in the catalog and will be sent for review in the RFQ.`,
        invalid: "Please paste at least 1 part number.",
        brand: "Manual Request",
        titleFallback: "Customer requested part",
      };

  const knownProducts = useMemo(() => {
    const map = new Map<string, QuoteProduct>();

    for (const product of products) {
      const normalized = normalizePartNo(product.partNo);
      if (!normalized || map.has(normalized)) continue;

      map.set(normalized, {
        id: product.id,
        partNo: product.partNo,
        brand: product.brand,
        title: product.title,
      });
    }

    return map;
  }, []);

  const handleBulkAdd = () => {
    const merged = new Map<string, ParsedRow>();
    const lines = value.split(/\r?\n/);

    for (const line of lines) {
      const parsed = parseLine(line, knownProducts);
      if (!parsed) continue;

      const existing = merged.get(parsed.normalizedPartNo);
      if (existing) {
        existing.qty = clampQty(existing.qty + parsed.qty);
      } else {
        merged.set(parsed.normalizedPartNo, { ...parsed });
      }
    }

    if (merged.size === 0) {
      setError(text.invalid);
      setFeedback(null);
      return;
    }

    let manualCount = 0;

    for (const row of merged.values()) {
      const known = knownProducts.get(row.normalizedPartNo);

      if (known) {
        addItem({
          productId: known.id,
          partNo: known.partNo,
          brand: known.brand,
          title: known.title,
          qty: row.qty,
        });
        continue;
      }

      manualCount += 1;
      addItem({
        productId: `manual:${row.normalizedPartNo.toLowerCase()}`,
        partNo: row.partNo,
        brand: text.brand,
        title: text.titleFallback,
        qty: row.qty,
      });
    }

    setError(null);
    setFeedback({ added: merged.size, manual: manualCount });
    setValue("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div>
        <h3 className="text-base font-semibold text-slate-950">{text.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{text.description}</p>
      </div>

      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={text.placeholder}
        rows={6}
        className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleBulkAdd}
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
        >
          {text.button}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {feedback && !error && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="font-medium">{text.success(feedback.added)}</p>
          {feedback.manual > 0 && <p className="mt-1">{text.manual(feedback.manual)}</p>}
        </div>
      )}
    </div>
  );
}
