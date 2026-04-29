"use client";
import { trackEvent } from "@/lib/analytics/track";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/search/search";

type Result = {
  id: string;
  partNo: string;
  brand: string;
};

export default function SearchInput() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();

  // 🔥 แก้ไขส่วน Debounce และย้าย trackEvent มาไว้ข้างใน
  useEffect(() => {
    const t = setTimeout(async () => { // เพิ่ม async เพื่อรองรับการค้นหา
      if (q.length >= 2) {
        // ต้องเอาผลลัพธ์จาก searchProducts มา set ลง State ด้วย
        const data = await searchProducts(q, { limit: 5 });
        setResults(data || []);
        
        // ✅ ย้าย trackEvent มาไว้ในนี้ เพื่อไม่ให้เกิด Infinite Loop
        trackEvent("search", { query: q });
      } else {
        setResults([]);
      }
      setActiveIndex(-1);
    }, 250);

    return () => clearTimeout(t);
  }, [q]); // ทำงานเฉพาะเมื่อค่า q เปลี่ยน

  // 🔥 keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // ถ้าไม่มีผลลัพธ์ ไม่ต้องรันโค้ดด้านล่าง (ยกเว้นกด Enter เพื่อไปหน้าค้นหาหลัก)
    if (e.key === "Enter" && !results.length) {
       router.push(`/products?q=${q}`);
       return;
    }
    
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        const selected = results[activeIndex];
        router.push(`/products/${selected.partNo}`);
      } else {
        router.push(`/products?q=${q}`);
      }
      setResults([]);
    }

    if (e.key === "Escape") {
      setResults([]);
    }
  };

  // 🔥 highlight
  const highlight = (text: string) => {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;

    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-yellow-200">
          {text.slice(idx, idx + q.length)}
        </span>
        {text.slice(idx + q.length)}
        <span className="ml-2 text-xs text-green-600">
         ✓ Available
        </span>
      </>
    );
  };

  return (
    <div className="relative w-full max-w-xl">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search part number (e.g. P550084)"
        className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-black"
      />

      {/* 🔥 Dropdown */}
      {results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border bg-white shadow-lg">
          {results.map((r, i) => {
            const imageSrc = `/images/products/${r.brand}/${r.partNo.toLowerCase()}.jpg`;

            return (
              <button
                key={r.id}
                onClick={() => {
                  trackEvent("select_result", {
                    partNo: r.partNo,
                    brand: r.brand,
                  });
                  router.push(`/products/${r.partNo}`);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                  i === activeIndex
                    ? "bg-black text-white"
                    : "hover:bg-slate-50 text-black"
                }`}
              >
                <img
                  src={imageSrc}
                  alt={r.partNo}
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/placeholder.png";
                  }}
                />
                <div>
                  <div className="font-medium">
                    {highlight(r.partNo)}
                  </div>
                  <div className={`text-xs ${i === activeIndex ? "text-gray-300" : "text-slate-500"}`}>
                    {r.brand.toUpperCase()} • Filter
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
