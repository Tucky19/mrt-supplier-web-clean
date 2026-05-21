"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { getProductUiText } from "@/lib/i18n/productUi";
import { getProductImageUrl } from "@/lib/products/image";
import { useQuote } from "@/providers/QuoteProvider";
import type { Product } from "@/types/product";

function normalizeSpecLabel(value: string) {
  return value.trim().toLowerCase();
}

function buildSpecificationSummary(product: Product) {
  const rows = (product.specifications ?? []).filter(
    (item) =>
      String(item?.label ?? "").trim().length > 0 &&
      String(item?.value ?? "").trim().length > 0,
  );

  if (rows.length === 0) return "";

  const specMap = new Map(
    rows.map((item) => [
      normalizeSpecLabel(String(item.label)),
      String(item.value).trim(),
    ]),
  );

  return [
    specMap.get("type"),
    specMap.get("style"),
    specMap.get("position") ?? specMap.get("stage"),
    specMap.get("flow"),
    specMap.get("seal"),
    specMap.get("shape") ?? specMap.get("form"),
  ]
    .filter(
      (value, index, array): value is string =>
        Boolean(value) && array.indexOf(value) === index,
    )
    .slice(0, 3)
    .join(" • ");
}

export default function ProductCardV2({
  product,
  locale = "th",
}: {
  product: Product;
  locale?: string;
}) {
  const { addItem } = useQuote();
  const { show } = useToast();
  const text = getProductUiText(locale);
  const isThai = locale === "th";
  const [justAdded, setJustAdded] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const refs = Array.from(
    new Set([...(product.refs ?? []), ...(product.crossReferences ?? [])])
  )
    .map((value) => String(value).trim())
    .filter(Boolean)
    .slice(0, 2);

  const image = getProductImageUrl(
    product.brand,
    product.partNo,
    product.imageUrl,
  );
  const specText =
    product.spec?.trim() ||
    buildSpecificationSummary(product) ||
    "Specification to be confirmed";
  const isRequest = product.stockStatus === "request";
  const statusLabel = isRequest ? text.statusRequest : text.statusAvailable;
  const statusDotClass = isRequest ? "bg-amber-400" : "bg-emerald-500";
  const statusTextClass = isRequest ? "text-amber-800" : "text-emerald-700";
  const hasProductImage = image !== "/images/placeholder.jpg";
  const addButtonLabel = justAdded
    ? isThai
      ? "เพิ่มแล้ว ✓"
      : "Added ✓"
    : text.addToQuote;

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      qty: 1,
    });

    show(`${text.addedToQuote}: ${product.partNo}`);
    setJustAdded(true);

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setJustAdded(false);
      resetTimerRef.current = null;
    }, 1500);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_38px_rgba(15,23,42,0.1)]">
      <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fbfd_0%,#ffffff_100%)] p-3 sm:p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="inline-flex min-h-7 items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-sm">
            {product.brand}
          </span>
          <span
            className={`inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTextClass} ${
              isRequest ? "bg-amber-50" : "bg-emerald-50"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
            {statusLabel}
          </span>
        </div>

        <div
          className={`flex h-36 items-center justify-center overflow-hidden rounded-[20px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors duration-200 sm:h-40 ${
            hasProductImage
              ? "border-slate-200 bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_68%,#eef2f7_100%)]"
              : "border-dashed border-slate-200 bg-slate-50"
          }`}
        >
          <img
            src={image}
            alt={product.partNo}
            className="h-full w-full object-contain p-4 transition duration-200 group-hover:scale-[1.03] group-hover:brightness-105 sm:p-5"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = "/images/placeholder.jpg";
            }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {isThai ? "รหัสสินค้า" : "Part Number"}
        </div>

        <Link
          href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
          className="mt-1 break-all text-xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 transition-colors hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 sm:text-[1.45rem]"
        >
          {product.partNo}
        </Link>

        {product.title && (
          <div className="mt-2 min-h-[2.75rem] line-clamp-2 text-sm leading-6 text-slate-700">
            {product.title}
          </div>
        )}

        <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50/80 px-3.5 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {isThai ? "สเปกโดยสรุป" : "Specification Summary"}
          </div>
          <div className="mt-1.5 min-h-[3.25rem] line-clamp-2 text-sm leading-6 text-slate-700">
            {specText}
          </div>
        </div>

        {refs.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {isThai ? "อ้างอิง / ทดแทน" : "Reference / Interchange"}
            </div>
            <div className="flex min-h-[2.5rem] flex-wrap content-start gap-2">
              {refs.map((ref) => (
                <span
                  key={ref}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 shadow-sm sm:text-[11px]"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.shortDescription && (
          <div className="mt-4 hidden line-clamp-2 text-xs leading-5 text-slate-500 sm:block">
            {product.shortDescription}
          </div>
        )}

        <div className="mt-auto pt-4">
          {product.officialUrl && (
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 inline-flex text-xs font-medium text-blue-700 underline-offset-2 hover:text-blue-800 hover:underline"
            >
              {text.viewOfficial}
            </a>
          )}

          <div className="flex gap-2">
        <button
          onClick={handleAdd}
          disabled={justAdded}
          className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${
            justAdded
              ? "bg-emerald-600 focus-visible:ring-emerald-200"
              : "bg-slate-900 hover:bg-slate-800 focus-visible:ring-slate-300"
          } ${justAdded ? "cursor-default" : ""}`}
        >
          <ShoppingCart size={16} />
          {addButtonLabel}
        </button>

        <Link
          href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
        >
          {text.details}
        </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
