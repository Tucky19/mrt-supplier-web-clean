"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";
import { useQuote } from "@/providers/QuoteProvider";
import type { Product } from "@/types/product";

type Props = {
  locale: string;
  product: Product;
};

function normalizePath(src?: string) {
  if (!src) return "/images/placeholder.jpg";
  return src;
}

function ProductGallery({
  images,
  partNo,
}: {
  images: string[];
  partNo: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border bg-white p-6">
        <img
          src={normalizePath(images[active])}
          alt={partNo}
          className="h-72 w-full object-contain"
          onError={(event) => {
            event.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-2">
          {images.map((img, index) => (
            <button
              key={`${img}-${index}`}
              onClick={() => setActive(index)}
              className={`h-16 w-16 rounded border ${
                index === active ? "border-black" : "border-slate-200"
              }`}
            >
              <img
                src={normalizePath(img)}
                alt=""
                className="object-contain"
                onError={(event) => {
                  event.currentTarget.src = "/images/placeholder.jpg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function slugifyBrand(value: string) {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, "-");
}

export default function ProductDetailClient({ locale, product }: Props) {
  const router = useRouter();
  const { addItem } = useQuote();
  const isThai = locale === "th";

  const images =
    product.images?.length
      ? product.images
      : [
          product.imageUrl ||
            product.officialImageUrl ||
            `/images/products/${product.brand.toLowerCase()}/${product.partNo.toLowerCase()}.jpg`,
        ];

  const refs = useMemo(
    () =>
      Array.from(
        new Set([...(product.refs ?? []), ...(product.crossReferences ?? [])])
      )
        .map((value) => String(value).trim())
        .filter(Boolean)
        .slice(0, 5),
    [product.refs, product.crossReferences]
  );

  const applications = useMemo(
    () =>
      Array.from(
        new Set([...(product.application ?? []), ...(product.applications ?? [])])
      )
        .map((value) => String(value).trim())
        .filter(Boolean)
        .slice(0, 6),
    [product.application, product.applications]
  );

  const handleAdd = () => {
    trackEvent("add_to_quote", {
      partNo: product.partNo,
      brand: product.brand,
    });

    addItem({
      productId: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title ?? "",
      qty: 1,
    });
  };

  const handleRequestQuote = () => {
    handleAdd();
    router.push(`/${locale}/quote`);
  };

  return (
    <>
      <div className="grid gap-8 pb-28 md:gap-10 md:grid-cols-2 md:pb-0">
        <ProductGallery images={images} partNo={product.partNo} />

        <div className="self-start">
          <h1 className="text-2xl font-bold sm:text-3xl">{product.partNo}</h1>

          <Link
            href={`/${locale}/brands/${slugifyBrand(product.brand)}`}
            className="text-sm text-slate-500 underline-offset-2 hover:underline"
          >
            {product.brand.toUpperCase()}
          </Link>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
              OEM Reference
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
              {isThai ? "เกรดอุตสาหกรรม" : "Industrial Grade"}
            </span>
          </div>

          {product.title && (
            <div className="mt-3 text-base font-medium text-slate-900 sm:mt-4 sm:text-lg">
              {product.title}
            </div>
          )}

          {product.spec && (
            <div className="mt-3 rounded-xl border bg-gray-50 p-4 text-sm sm:mt-4">
              {product.spec}
            </div>
          )}

          {product.shortDescription && (
            <p className="mt-3 text-sm leading-6 text-gray-600 sm:mt-4">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {isThai ? "พร้อมขอราคา" : "Ready to quote"}
            </div>

            <p className="mt-2 text-sm text-slate-600">
              {isThai
                ? "เพิ่มสินค้ารายการนี้เข้าใบ RFQ หรือขอราคาได้ทันที พร้อมการช่วยเทียบรหัส"
                : "Add this part to your RFQ list or request a quote immediately for cross-reference support."}
            </p>

            <div className="mt-4 hidden space-y-3 md:block">
              <button
                onClick={handleAdd}
                className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                {isThai ? "เพิ่มเข้าใบขอราคา" : "Add to Quote"}
              </button>

              <button
                onClick={handleRequestQuote}
                className="w-full rounded-lg border border-slate-300 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              {isThai
                ? "รองรับการเทียบรหัส OEM และติดตาม RFQ ภายใน 24 ชั่วโมง"
                : "OEM reference support and RFQ follow-up within 24 hours"}
            </p>
          </div>

          {product.description && product.description !== product.shortDescription && (
            <p className="mt-3 text-sm leading-7 text-gray-600">
              {product.description}
            </p>
          )}

          {refs.length > 0 && (
            <div className="mt-5 sm:mt-6">
              <div className="text-xs uppercase text-gray-500">
                {isThai ? "รหัสเทียบ" : "Cross Reference"}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {refs.map((ref) => (
                  <Link
                    key={ref}
                    href={`/${locale}/products/${encodeURIComponent(ref)}`}
                    className="inline-flex min-h-9 items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {ref}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {applications.length > 0 && (
            <div className="mt-5 sm:mt-6">
              <div className="text-xs uppercase text-gray-500">
                {isThai ? "การใช้งาน" : "Applications"}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {applications.map((application) => (
                  <span
                    key={application}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {application}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-xl border sm:mt-6">
              <div className="border-b bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {isThai ? "สเปก" : "Specifications"}
              </div>

              <div className="divide-y">
                {product.specifications.slice(0, 8).map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="px-4 py-3 text-sm md:grid md:grid-cols-[140px_1fr] md:gap-4"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:text-sm md:font-normal md:uppercase-none md:tracking-normal">
                      {item.label}
                    </div>
                    <div className="mt-1 text-slate-900 md:mt-0">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.officialUrl && (
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-sm text-blue-700 underline underline-offset-2"
            >
              {isThai ? "ดูข้อมูลจากแหล่งทางการ" : "View Official Source"}
            </a>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            onClick={handleAdd}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {isThai ? "เพิ่มเข้าใบขอราคา" : "Add to Quote"}
          </button>

          <button
            onClick={handleRequestQuote}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            {isThai ? "ขอใบเสนอราคา" : "Request Quote"}
          </button>
        </div>
      </div>
    </>
  );
}
