"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  locale: string;
};

type FoundResult = {
  status: "found";
  originalPartNo: string;
  normalizedPartNo: string;
  product: {
    id: string;
    partNo: string;
    brand?: string;
    title?: string;
    category?: string;
  };
};

type MissingResult = {
  status: "missing";
  originalPartNo: string;
  normalizedPartNo: string;
};

type AmbiguousResult = {
  status: "ambiguous";
  originalPartNo: string;
  normalizedPartNo: string;
  matches: Array<{
    id: string;
    partNo: string;
    brand?: string;
    title?: string;
    category?: string;
  }>;
};

type LookupResult = FoundResult | MissingResult | AmbiguousResult;

type LookupResponse = {
  results?: LookupResult[];
};

function normalizePartNo(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "");
}

function cleanPartNo(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function parsePartNumbers(value: string) {
  const rows: Array<{ originalPartNo: string; normalizedPartNo: string }> = [];
  const seen = new Set<string>();

  for (const line of value.split(/\r?\n/)) {
    const originalPartNo = cleanPartNo(line);
    const normalizedPartNo = normalizePartNo(originalPartNo);

    if (!originalPartNo || !normalizedPartNo || seen.has(normalizedPartNo)) {
      continue;
    }

    seen.add(normalizedPartNo);
    rows.push({ originalPartNo, normalizedPartNo });
  }

  return rows;
}

export default function MultiPartNumberSearch({ locale }: Props) {
  const isThai = locale === "th";
  const { addItem } = useQuote();
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<LookupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const parsedRows = useMemo(() => parsePartNumbers(value), [value]);
  const foundCount = results.filter((result) => result.status === "found").length;
  const missingCount = results.filter(
    (result) => result.status === "missing",
  ).length;
  const ambiguousCount = results.filter(
    (result) => result.status === "ambiguous",
  ).length;
  const canAddResults = results.length > 0 && ambiguousCount === 0;

  const text = isThai
    ? {
        trigger: "ค้นหาหลายรายการ",
        title: "ค้นหาหลายรายการ",
        description:
          "วาง Part Number หลายรายการ เพื่อให้ทีมช่วยตรวจสอบและจัดหา",
        placeholder:
          "ตัวอย่าง:\nP553000\nC 20 500\nWK 842/2\nWDK 11 102/9\nUNKNOWN-TEST-001",
        check: "ตรวจสอบรายการ",
        checking: "กำลังตรวจสอบ...",
        reset: "ล้างรายการ",
        empty: "กรุณาวาง Part Number อย่างน้อย 1 รายการ",
        found: "พบสินค้า",
        missing: "ไม่พบในรายการเว็บไซต์ — ให้ทีมช่วยตรวจสอบ",
        ambiguous: "พบข้อมูลซ้ำ ต้องตรวจสอบก่อนเพิ่ม",
        addAll: "เพิ่มทั้งหมดไปยังรายการขอราคา",
        added: "เพิ่มรายการไปยังใบขอราคาแล้ว",
        quoteCta: "ไปที่รายการขอราคา",
        summary: (found: number, missing: number, ambiguous: number) =>
          `พบ ${found} รายการ, ให้ทีมตรวจสอบ ${missing} รายการ${
            ambiguous ? `, ข้อมูลซ้ำ ${ambiguous} รายการ` : ""
          }`,
        failed: "ตรวจสอบรายการไม่สำเร็จ กรุณาลองอีกครั้ง",
      }
    : {
        trigger: "Search multiple items",
        title: "Search multiple items",
        description:
          "Paste multiple Part Numbers for our team to check and source",
        placeholder:
          "Example:\nP553000\nC 20 500\nWK 842/2\nWDK 11 102/9\nUNKNOWN-TEST-001",
        check: "Check items",
        checking: "Checking...",
        reset: "Clear",
        empty: "Please paste at least 1 Part Number.",
        found: "Found",
        missing: "Not listed — our team will check",
        ambiguous: "Duplicate catalog matches — review before adding",
        addAll: "Add all to quote request",
        added: "Items added to quote request",
        quoteCta: "Go to quote request",
        summary: (found: number, missing: number, ambiguous: number) =>
          `Found ${found}, needs checking ${missing}${
            ambiguous ? `, ambiguous ${ambiguous}` : ""
          }`,
        failed: "Could not check items. Please try again.",
      };

  const handleLookup = async () => {
    setError("");
    setAdded(false);

    if (parsedRows.length === 0) {
      setError(text.empty);
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/search/multi-part", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partNumbers: parsedRows.map((row) => row.originalPartNo),
        }),
      });

      const data = (await response.json()) as LookupResponse;

      if (!response.ok || !Array.isArray(data.results)) {
        throw new Error(text.failed);
      }

      setResults(data.results);
    } catch {
      setError(text.failed);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = () => {
    for (const result of results) {
      if (result.status === "found") {
        addItem({
          productId: result.product.id,
          partNo: result.product.partNo,
          brand: result.product.brand,
          title: result.product.title,
          qty: 1,
        });
        continue;
      }

      if (result.status === "missing") {
        addItem({
          productId: `manual:${result.normalizedPartNo.toLowerCase()}`,
          partNo: result.originalPartNo,
          brand: isThai ? "ให้ทีมช่วยตรวจสอบ" : "Manual Request",
          title: isThai ? "รายการที่ลูกค้าระบุ" : "Customer requested part",
          qty: 1,
        });
      }
    }

    setAdded(true);
  };

  const handleReset = () => {
    setValue("");
    setResults([]);
    setError("");
    setAdded(false);
  };

  return (
    <div className="mt-4 max-w-4xl">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
        >
          {text.trigger}
        </button>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                {text.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {text.description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-fit rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
            >
              {text.reset}
            </button>
          </div>

          <textarea
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setAdded(false);
            }}
            placeholder={text.placeholder}
            rows={6}
            className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleLookup}
              disabled={loading}
              className="inline-flex justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? text.checking : text.check}
            </button>

            {results.length > 0 ? (
              <p className="text-sm text-slate-600">
                {text.summary(foundCount, missingCount, ambiguousCount)}
              </p>
            ) : null}
          </div>

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          {results.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="divide-y divide-slate-100">
                {results.map((result) => {
                  const isFound = result.status === "found";
                  const isAmbiguous = result.status === "ambiguous";
                  const statusLabel = isFound
                    ? text.found
                    : isAmbiguous
                      ? text.ambiguous
                      : text.missing;

                  return (
                    <div
                      key={result.normalizedPartNo}
                      className="grid gap-2 bg-white px-4 py-3 text-sm sm:grid-cols-[1fr_1.2fr_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                          {isThai ? "รายการที่วาง" : "Entered"}
                        </div>
                        <div className="mt-0.5 break-all font-semibold text-slate-950">
                          {result.originalPartNo}
                        </div>
                      </div>

                      <div className="min-w-0">
                        {isFound ? (
                          <>
                            <div className="break-all font-medium text-slate-900">
                              {result.product.partNo}
                            </div>
                            <div className="mt-0.5 text-xs leading-5 text-slate-500">
                              {[result.product.brand, result.product.title ?? result.product.category]
                                .filter(Boolean)
                                .join(" • ")}
                            </div>
                          </>
                        ) : isAmbiguous ? (
                          <div className="text-xs leading-5 text-amber-700">
                            {result.matches.map((match) => match.partNo).join(", ")}
                          </div>
                        ) : (
                          <div className="text-xs leading-5 text-slate-500">
                            {text.description}
                          </div>
                        )}
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                          isFound
                            ? "bg-emerald-50 text-emerald-700"
                            : isAmbiguous
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {results.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAddAll}
                disabled={!canAddResults}
                className="inline-flex justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {text.addAll}
              </button>

              {added ? (
                <div className="flex flex-col gap-2 text-sm text-emerald-700 sm:flex-row sm:items-center">
                  <span>{text.added}</span>
                  <Link
                    href={`/${locale}/quote`}
                    className="font-semibold text-slate-900 underline underline-offset-4"
                  >
                    {text.quoteCta}
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
