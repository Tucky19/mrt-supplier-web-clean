import { useMemo, useRef, useState } from "react";
import { MAX_MULTI_PART_ROWS, parseMultiPartText } from "@/lib/search/multiPartInput";
import { buildRfqReferenceContext } from "@/lib/rfq/referenceContext";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  locale: string;
  initiallyExpanded?: boolean;
  parseInput?: typeof parseMultiPartText;
};

type FoundResult = {
  status: "found";
  originalPartNo: string;
  normalizedPartNo: string;
  qty: number;
  product: {
    id: string;
    partNo: string;
    brand?: string;
    title?: string;
    category?: string;
    matchType: string;
    matchedReference?: string;
  };
};

type MissingResult = {
  status: "missing";
  originalPartNo: string;
  normalizedPartNo: string;
  qty: number;
};

type AmbiguousResult = {
  status: "ambiguous";
  originalPartNo: string;
  normalizedPartNo: string;
  qty: number;
  matches: Array<{
    id: string;
    partNo: string;
    brand?: string;
    title?: string;
    category?: string;
    matchType: string;
    matchedReference?: string;
  }>;
};

type LookupResult = FoundResult | MissingResult | AmbiguousResult;

type LookupResponse = {
  error?: string;
  maxItems?: number;
  results?: LookupResult[];
};

export function useMultiPartSearch({ locale, initiallyExpanded = false, parseInput = parseMultiPartText }: Props) {
  const isThai = locale === "th";
  const { addItem } = useQuote();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<LookupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const requestVersion = useRef(0);
  const resultsVersion = useRef<number | null>(null);

  const parsedRows = useMemo(() => parseInput(value), [value, parseInput]);
  const foundCount = results.filter(
    (result) => result.status === "found",
  ).length;
  const missingCount = results.filter(
    (result) => result.status === "missing",
  ).length;
  const ambiguousCount = results.filter(
    (result) => result.status === "ambiguous",
  ).length;
  const canAddResults = !loading && !added && results.length > 0;

  const text = isThai
    ? {
        quantityHint: "ใส่เฉพาะ Part Number ได้ ระบบใช้จำนวน 1 และปรับในรายการขอราคาได้",
        trigger: "ค้นหาหลายรายการ",
        title: "ค้นหาหลายรายการ",
        description:
          "วาง Part Number บรรทัดละเบอร์ แล้วปรับจำนวนในรายการขอราคาได้",
        placeholder:
          "ตัวอย่าง:\nP553000\nAF25555\nCR522\nUNKNOWN-TEST-001",
        check: "ตรวจสอบรายการ",
        checking: "กำลังตรวจสอบ...",
        reset: "ล้างรายการ",
        empty: "กรุณาวาง Part Number อย่างน้อย 1 รายการ",
        tooMany: `รองรับสูงสุด ${MAX_MULTI_PART_ROWS} รายการต่อครั้ง กรุณาแบ่งรายการแล้วลองใหม่`,
        found: "พบสินค้า",
        referenceFound: "พบ Cross Reference",
        missing: "ไม่พบในรายการเว็บไซต์ — ให้ทีมช่วยตรวจสอบ",
        ambiguous: "พบหลายเบอร์เทียบ — จะเพิ่มเบอร์เดิมให้ทีมตรวจสอบ",
        addAll: "เพิ่มทั้งหมดไปยังรายการขอราคา",
        added: "เพิ่มรายการไปยังใบขอราคาแล้ว",
        quoteCta: "ไปที่รายการขอราคา",
        summary: (found: number, missing: number, ambiguous: number) =>
          `พบ ${found} รายการ, ให้ทีมตรวจสอบ ${missing} รายการ${
            ambiguous ? `, หลายเบอร์เทียบ ${ambiguous} รายการ` : ""
          }`,
        failed: "ตรวจสอบรายการไม่สำเร็จ กรุณาลองอีกครั้ง",
        quantity: (qty: number) => `จำนวน ${qty}`,
        referenceNotice:
          "ผลลัพธ์จาก Cross Reference กรุณาตรวจสอบรุ่นและสเปกก่อนสั่งซื้อ",
      }
    : {
        quantityHint: "Part number only? Quantity defaults to 1 and can be adjusted in your quote list.",
        trigger: "Search multiple items",
        title: "Search multiple items",
        description:
          "Paste one Part Number per line, then adjust quantities in your quote list.",
        placeholder:
          "Example:\nP553000\nAF25555\nCR522\nUNKNOWN-TEST-001",
        check: "Check items",
        checking: "Checking...",
        reset: "Clear",
        empty: "Please paste at least 1 Part Number.",
        tooMany: `Up to ${MAX_MULTI_PART_ROWS} items are supported per request. Please split the list and try again.`,
        found: "Found",
        referenceFound: "Reference result",
        missing: "Not listed — our team will check",
        ambiguous: "Multiple candidates — add original number for team review",
        addAll: "Add all to quote request",
        added: "Items added to quote request",
        quoteCta: "Go to quote request",
        summary: (found: number, missing: number, ambiguous: number) =>
          `Found ${found}, needs checking ${missing}${
            ambiguous ? `, ambiguous ${ambiguous}` : ""
          }`,
        failed: "Could not check items. Please try again.",
        quantity: (qty: number) => `Qty ${qty}`,
        referenceNotice:
          "Reference result — verify the application and specifications before ordering.",
      };

  const handleLookup = async () => {
    const version = ++requestVersion.current;
    resultsVersion.current = null;
    setResults([]);
    setError("");
    setAdded(false);

    if (parsedRows.length === 0) {
      setError(text.empty);
      setResults([]);
      return;
    }

    if (parsedRows.length > MAX_MULTI_PART_ROWS) {
      setError(text.tooMany);
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/search/multi-part", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partNumbers: parsedRows.map((row) => ({
            partNo: row.originalPartNo,
            qty: row.qty,
          })),
        }),
      });

      const data = (await response.json()) as LookupResponse;
      if (version !== requestVersion.current) return;

      if (data.error === "too_many_items") {
        throw new Error(text.tooMany);
      }

      if (!response.ok || !Array.isArray(data.results)) {
        throw new Error(text.failed);
      }

      resultsVersion.current = version;
      setResults(data.results);
    } catch (requestError) {
      if (version !== requestVersion.current) return;
      setError(
        requestError instanceof Error ? requestError.message : text.failed,
      );
      setResults([]);
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  };

  const handleAddAll = () => {
    if (!canAddResults || resultsVersion.current !== requestVersion.current) return;
    for (const result of results) {
      if (result.status === "found") {
        const meta = buildRfqReferenceContext({
          searchQuery: result.originalPartNo,
          offeredPartNo: result.product.partNo,
          matchType: result.product.matchType,
        });

        addItem({
          productId: result.product.id,
          partNo: result.product.partNo,
          brand: result.product.brand,
          title: result.product.title,
          qty: result.qty,
          meta,
        });
        continue;
      }

      if (result.status === "missing" || result.status === "ambiguous") {
        addItem({
          productId: `manual:${result.normalizedPartNo.toLowerCase()}`,
          partNo: result.originalPartNo,
          brand: isThai ? "ให้ทีมช่วยตรวจสอบ" : "Manual Request",
          title: isThai ? "รายการที่ลูกค้าระบุ" : "Customer requested part",
          qty: result.qty,
        });
      }
    }

    setAdded(true);
  };

  const handleReset = () => {
    requestVersion.current += 1;
    resultsVersion.current = null;
    setLoading(false);
    setValue("");
    setResults([]);
    setError("");
    setAdded(false);
  };

  const handleInputChange = (nextValue: string) => {
    requestVersion.current += 1;
    resultsVersion.current = null;
    setValue(nextValue);
    setResults([]);
    setError("");
    setLoading(false);
    setAdded(false);
  };

  return { isThai, expanded, setExpanded, value, results, loading, error, added,
    canAddResults, foundCount, missingCount,
    ambiguousCount, text, handleLookup, handleAddAll, handleReset,
    handleInputChange };
}
