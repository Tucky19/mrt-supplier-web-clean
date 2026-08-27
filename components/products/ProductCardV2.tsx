"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { gaAddToQuote } from "@/lib/analytics/ga";
import { getProductUiText } from "@/lib/i18n/productUi";
import { getSearchUiText } from "@/lib/i18n/searchUi";
import { getProductImageUrl } from "@/lib/products/image";
import {
  type ProductRelation,
  normalizeProductRelations,
} from "@/lib/products/relations";
import { useQuote } from "@/providers/QuoteProvider";
import type { Product } from "@/types/product";

type SearchProduct = Product & {
  _matchType?: string;
  _matchedRelation?: ProductRelation;
};

type ProductCardVariant = "default" | "search";

type MatchPresentation = {
  label: string;
  className: string;
};

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

function parseQuantity(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function formatCategoryLabel(value: string | undefined) {
  return String(value ?? "")
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getMatchPresentation(
  matchType: string | undefined,
  query: string,
  text: ReturnType<typeof getSearchUiText>,
): MatchPresentation | null {
  if (!matchType || !query) return null;

  const querySuffix = ` · ${query}`;

  if (matchType === "Exact") {
    return {
      label: text.exactMatch,
      className:
        "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    };
  }

  if (matchType === "Prefix" || matchType === "Contains") {
    return {
      label: text.partNumberMatch,
      className:
        "border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-text)]",
    };
  }

  if (matchType === "Cross Ref" || matchType === "Same-brand Ref") {
    return null;
  }

  if (matchType === "Kit Component") {
    return {
      label: `${text.usedTogetherMatch}${querySuffix}`,
      className:
        "border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]",
    };
  }

  return {
    label: text.relatedMatch,
    className:
      "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text)]",
  };
}

function relationDisplayText(relation: ProductRelation) {
  if (relation.brand) return `${relation.brand} ${relation.partNumber}`;
  return relation.partNumber;
}

export default function ProductCardV2({
  product,
  locale = "th",
  searchQuery = "",
  variant = "default",
}: {
  product: SearchProduct;
  locale?: string;
  searchQuery?: string;
  variant?: ProductCardVariant;
}) {
  const { addItem } = useQuote();
  const { show } = useToast();
  const text = getProductUiText(locale);
  const searchText = getSearchUiText(locale);
  const isThai = locale === "th";
  const isSearchVariant = variant === "search";
  const [justAdded, setJustAdded] = useState(false);
  const [quantityInput, setQuantityInput] = useState("1");
  const resetTimerRef = useRef<number | null>(null);

  const refs = Array.from(
    new Map(
      [
        ...normalizeProductRelations(product.refs ?? [], "unknown"),
        ...normalizeProductRelations(product.crossReferences ?? [], "unknown"),
      ].map((relation) => [
        `${relation.brand ?? ""}|${relation.partNumber}`,
        relation,
      ]),
    ).values(),
  ).slice(0, 2);

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
  const statusDotClass = isRequest
    ? "bg-[var(--color-warning)]"
    : "bg-[var(--color-success)]";
  const statusTextClass = isRequest
    ? "text-[var(--color-warning-text)]"
    : "text-[var(--color-success-text)]";
  const hasProductImage = image !== "/images/placeholder.jpg";
  const quantity = parseQuantity(quantityInput);
  const officialReferenceLabel = isThai
    ? "อ้างอิงจากผู้ผลิต"
    : "Official Reference";
  const addButtonLabel = justAdded
    ? isThai
      ? "เพิ่มแล้ว"
      : "Added"
    : text.addToQuote;
  const referenceQuery = searchQuery.trim().toUpperCase();
  const matchPresentation = getMatchPresentation(
    product._matchType,
    referenceQuery,
    searchText,
  );
  const categoryLabel = formatCategoryLabel(product.category);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleQuantityChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "");

    if (!sanitized) {
      setQuantityInput("");
      return;
    }

    setQuantityInput(String(Math.max(1, Number.parseInt(sanitized, 10))));
  };

  const handleQuantityBlur = () => {
    setQuantityInput(String(quantity));
  };

  const adjustQuantity = (delta: number) => {
    setQuantityInput(String(Math.max(1, quantity + delta)));
  };

  const handleAdd = () => {
    addItem({
      productId: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      qty: quantity,
    });

    gaAddToQuote(
      {
        item_id: product.partNo || product.id,
        item_name: product.title || product.partNo,
        item_brand: product.brand,
        item_category: product.category,
        quantity,
      },
      {
        locale,
        source: "products_page",
      },
    );

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
    <div className="group flex h-full flex-col overflow-hidden rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex min-h-7 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text)] shadow-[var(--shadow-sm)]">
              {product.brand}
            </span>
            {isSearchVariant && categoryLabel ? (
              <span className="truncate text-[11px] font-medium text-[var(--color-text-muted)]">
                {categoryLabel}
              </span>
            ) : null}
          </div>
          <span
            className={`inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTextClass} ${
              isRequest
                ? "bg-[var(--color-warning-soft)]"
                : "bg-[var(--color-success-soft)]"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
            {statusLabel}
          </span>
        </div>

        {isSearchVariant ? (
          <>
            {matchPresentation ? (
              <div className="mt-3">
                <span
                  className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${matchPresentation.className}`}
                >
                  {matchPresentation.label}
                </span>
              </div>
            ) : null}

            <Link
              href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
              className="mt-2 block [overflow-wrap:anywhere] text-[1.4rem] font-semibold leading-tight tracking-[-0.035em] text-[var(--color-text)] transition-colors hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)] sm:text-[1.5rem]"
            >
              {product.partNo}
            </Link>

            {product.title ? (
              <div className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--color-text-muted)]">
                {product.title}
              </div>
            ) : null}

            <div className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
              <div
                className={`flex h-[5.5rem] items-center justify-center overflow-hidden rounded-[var(--mrt-radius-md)] border shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ${
                  hasProductImage
                    ? "border-[var(--color-border)] bg-[var(--color-surface)]"
                    : "border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)]"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.brand} ${product.partNo}`}
                  className="h-full w-full object-contain p-2.5 transition duration-200 group-hover:scale-[1.03]"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/images/placeholder.jpg";
                  }}
                />
              </div>

              <div className="min-w-0 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  {isThai ? "สเปกโดยสรุป" : "Specification Summary"}
                </div>
                <div className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-text-muted)] sm:text-sm">
                  {specText}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`mt-3 flex h-36 items-center justify-center overflow-hidden rounded-[var(--mrt-radius-lg)] border shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors duration-200 sm:h-40 ${
              hasProductImage
                ? "border-[var(--color-border)] bg-[var(--color-surface)]"
                : "border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)]"
            }`}
          >
            <img
              src={image}
              alt={`${product.brand} ${product.partNo}`}
              className="h-full w-full object-contain p-4 transition duration-200 group-hover:scale-[1.03] group-hover:brightness-105 sm:p-5"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = "/images/placeholder.jpg";
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {!isSearchVariant ? (
          <>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              {isThai ? "รหัสสินค้า" : "Part Number"}
            </div>

            <Link
              href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
              className="mt-1 [overflow-wrap:anywhere] text-[1.45rem] font-semibold leading-tight tracking-[-0.04em] text-[var(--color-text)] transition-colors hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] sm:text-[1.55rem]"
            >
              {product.partNo}
            </Link>

            {product.title ? (
              <div className="mt-2 min-h-[2.75rem] line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {product.title}
              </div>
            ) : null}

            <div className="mt-4 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                {isThai ? "สเปกโดยสรุป" : "Specification Summary"}
              </div>
              <div className="mt-1.5 min-h-[3.25rem] line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {specText}
              </div>
            </div>
          </>
        ) : null}

        {refs.length > 0 && (
          <div className={isSearchVariant ? "order-2 mt-3" : "mt-4"}>
            <div className="flex min-h-[2.5rem] flex-wrap content-start gap-2">
              {refs.map((ref) => (
                <span
                  key={`${ref.brand ?? ""}-${ref.partNumber}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-muted)] shadow-[var(--shadow-sm)] sm:text-[11px]"
                >
                  {relationDisplayText(ref)}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isSearchVariant && product.shortDescription && (
          <div className="mt-4 hidden line-clamp-2 text-xs leading-5 text-[var(--color-text-muted)] sm:block">
            {product.shortDescription}
          </div>
        )}

        <div className={isSearchVariant ? "order-1" : "mt-auto pt-4"}>
          {!isSearchVariant && product.officialUrl && (
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 inline-flex text-xs font-medium text-[var(--color-primary)] underline-offset-2 hover:text-[var(--color-primary-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              {officialReferenceLabel}
            </a>
          )}

          <div className="mb-2 rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-1.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                className="inline-flex min-h-10 w-10 items-center justify-center rounded-[var(--mrt-radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-base font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                aria-label={isThai ? "Decrease quantity" : "Decrease quantity"}
              >
                -
              </button>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantityInput}
                onChange={(event) => handleQuantityChange(event.target.value)}
                onBlur={handleQuantityBlur}
                className="min-h-10 min-w-0 flex-1 rounded-[var(--mrt-radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-center text-sm font-semibold text-[var(--color-text)] transition focus-visible:border-[var(--color-primary)] focus-visible:[outline-color:var(--color-focus-ring)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
                style={{ outlineColor: "var(--color-focus-ring)" }}
                aria-label={isThai ? "Quantity" : "Quantity"}
              />

              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                className="inline-flex min-h-10 w-10 items-center justify-center rounded-[var(--mrt-radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-base font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-muted)]"
                aria-label={isThai ? "Increase quantity" : "Increase quantity"}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={justAdded}
              className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--mrt-radius-md)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${
                justAdded
                  ? "bg-[var(--color-success)]"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
              } ${justAdded ? "cursor-default" : ""}`}
            >
              <ShoppingCart size={16} />
              {addButtonLabel}
            </button>

            <Link
              href={`/${locale}/products/${encodeURIComponent(product.partNo)}`}
              className={`inline-flex min-h-11 items-center justify-center rounded-[var(--mrt-radius-md)] border border-[var(--color-border-strong)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${
                isSearchVariant ? "shrink-0" : "flex-1"
              }`}
            >
              {text.details}
            </Link>
          </div>

          {isSearchVariant && product.officialUrl ? (
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-xs font-medium text-[var(--color-primary)] underline-offset-2 hover:text-[var(--color-primary-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              {officialReferenceLabel}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
