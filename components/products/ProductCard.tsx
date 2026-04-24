"use client";
import { getProductImageUrl } from "@/lib/products/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track";

type Product = {
  id: string;
  partNo: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
  imageUrl?: string;
  officialUrl?: string;
};

export default function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const href = `/${locale}/products/${encodeURIComponent(product.partNo)}`;

  const onClick = () => {
    trackEvent({
      type: "click",
      partNo: product.partNo,
      productId: product.id,
    });
  };
const imageUrl = product.imageUrl || getProductImageUrl(product.partNo);
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      {/* IMAGE */}
      <div className="mb-4 flex h-40 items-center justify-center overflow-hidden rounded-xl border bg-slate-50">
       {imageUrl ? (
  <img
    src={imageUrl}
    alt={product.partNo}
    className="max-h-full object-contain transition group-hover:scale-105"
  />
) : (
  <div className="text-xs text-slate-400">No Image</div>
)}
      </div>

      {/* PART NO */}
      <p className="text-sm font-semibold text-slate-900">
        {product.partNo}
      </p>

      {/* BRAND */}
      <p className="text-xs text-slate-500">
        {product.brand || "-"}
      </p>

      {/* TITLE */}
      {product.title && (
        <p className="mt-1 line-clamp-2 text-sm text-slate-700">
          {product.title}
        </p>
      )}

      {/* SPEC */}
      {product.spec && (
        <p className="mt-2 line-clamp-1 text-xs text-slate-500">
          {product.spec}
        </p>
      )}

      {/* TRUST */}
      <div className="mt-3 text-xs text-emerald-600">
        ✔ RFQ พร้อม | ตรวจสอบก่อนเสนอราคา
      </div>

      {/* CTA HINT */}
      <div className="mt-2 text-xs text-sky-600 group-hover:underline">
        ดูรายละเอียด →
      </div>
    </Link>
  );
}