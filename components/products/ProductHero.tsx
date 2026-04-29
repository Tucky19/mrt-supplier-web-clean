"use client";

import Link from "next/link";
import { useQuote } from "@/providers/QuoteProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { ShoppingCart, ExternalLink } from "lucide-react";
import type { Product } from "@/types/product";

export default function ProductHero({ product }: { product: Product }) {
  const { addItem } = useQuote();
  const { show } = useToast();

  const handleAdd = () => {
    addItem({
      productId: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      qty: 1,
    });

    show(`Added ${product.partNo} to quote`);
  };

 const image =
  product.imageUrl || product.officialImageUrl || "/images/placeholder.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">

      {/* LEFT: IMAGE */}
      <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
        <img
          src={image}
          alt={product.partNo}
          className="max-h-[320px] object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/images/placeholder.jpg";
          }}
        />
      </div>

      {/* RIGHT: INFO */}
      <div className="flex flex-col gap-4">

        {/* BRAND */}
        <div className="text-sm text-blue-600 font-medium uppercase">
          {product.brand}
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-900">
          {product.title}
        </h1>

        {/* PART NO */}
        <div className="text-gray-600">
          Part Number: <span className="font-medium">{product.partNo}</span>
        </div>

        {/* SHORT SPEC */}
        {product.spec && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {product.spec}
          </div>
        )}

        {/* DESCRIPTION */}
        {product.description && (
          <p className="text-sm text-gray-600">
            {product.description}
          </p>
        )}

        {/* 🔥 OEM REF */}
        {product.refs && product.refs.length > 0 && (
          <div className="text-sm">
            <span className="font-medium text-gray-800">OEM Reference: </span>
            <span className="text-gray-700">{product.refs.join(", ")}</span>
          </div>
        )}

        {/* 🔥 CROSS REF */}
        {product.crossReferences && product.crossReferences.length > 0 && (
          <div className="text-sm">
            <span className="font-medium text-gray-800">Cross Reference: </span>
            <span className="text-gray-700">
              {product.crossReferences.join(", ")}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3 pt-2">

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F172A] px-5 py-3 text-white text-sm hover:bg-black transition"
          >
            <ShoppingCart size={16} />
            Add to Quote
          </button>

          {product.officialUrl && (
            <a
              href={product.officialUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Official Page
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* 🔥 SPEC TABLE */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="md:col-span-2 mt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Specifications
          </h2>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {product.specifications.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-none"
                  >
                    <td className="bg-gray-50 px-4 py-2 text-gray-600 w-1/3">
                      {item.label}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
