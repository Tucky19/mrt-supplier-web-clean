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
    <div className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-3 transition hover:-translate-y-1 hover:shadow-md sm:p-4">
      <div
        className={`mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg border transition-colors duration-200 sm:h-36 ${
          hasProductImage
            ? "border-slate-200 bg-white group-hover:bg-slate-50"
            : "border-dashed border-slate-200 bg-slate-50 group-hover:bg-slate-100"
        }`}
      >
        <img
          src={image}
          alt={product.partNo}
          className="h-full w-full object-contain p-3 transition duration-200 group-hover:scale-[1.02] group-hover:brightness-105 sm:p-4"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
      </div>

      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:tracking-[0.14em]">
        {product.brand}
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
        <span className={`text-xs font-medium leading-5 ${statusTextClass} sm:text-[11px]`}>
          {statusLabel}
        </span>
      </div>

      <Link
        href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
        className="text-base font-semibold leading-tight text-gray-900 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 sm:text-[15px]"
      >
        {product.partNo}
      </Link>

      {product.title && (
        <div className="mt-1 min-h-[2.75rem] line-clamp-2 text-[13px] leading-5 text-gray-700 sm:min-h-[3rem] sm:text-sm">
          {product.title}
        </div>
      )}

      <div className="mt-2 min-h-[2.75rem] line-clamp-2 text-xs leading-5 text-gray-500 sm:min-h-[3rem] sm:text-xs">
        {specText}
      </div>

      {product.shortDescription && (
        <div className="mb-2 mt-2 hidden min-h-[2.75rem] line-clamp-2 text-xs leading-5 text-gray-600 sm:block">
          {product.shortDescription}
        </div>
      )}

      {refs.length > 0 && (
        <div className="mb-3 mt-2 flex min-h-[2.5rem] flex-wrap content-start gap-1.5 sm:min-h-[2.25rem] sm:gap-2">
          {refs.map((ref) => (
            <span
              key={ref}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-700 sm:text-[11px]"
            >
              {ref}
            </span>
          ))}
        </div>
      )}

      {product.officialUrl && (
        <a
          href={product.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 text-xs font-medium text-blue-700 underline-offset-2 hover:underline"
        >
          {text.viewOfficial}
        </a>
      )}

      <div className="mt-auto flex gap-2">
        <button
          onClick={handleAdd}
          disabled={justAdded}
          className={`inline-flex min-h-10 flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 ${
            justAdded
              ? "bg-emerald-600 focus-visible:ring-emerald-200"
              : "bg-slate-900 hover:bg-black focus-visible:ring-slate-300"
          } ${justAdded ? "cursor-default" : ""}`}
        >
          <ShoppingCart size={16} />
          {addButtonLabel}
        </button>

        <Link
          href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
        >
          {text.details}
        </Link>
      </div>
    </div>
  );
}
