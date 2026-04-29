"use client";

import { Product } from "@/types/product";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  product: Product;
  allProducts: Product[];
};

/**
 * 🔥 normalize สำหรับ debug (กัน data พัง)
 */
function normalizeId(input?: string) {
  if (!input) return "";
  return input
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[\/_-]/g, "");
}

/**
 * 🔥 FIND EQUIVALENT (debug-safe)
 */
function findEquivalent(p: Product | undefined, all: Product[]) {
  if (!p || !p.refs || p.refs.length === 0) return null;

  const target = normalizeId(p.refs[0]);

  return (
    all.find((x) => normalizeId(x.id) === target) ||
    null
  );
}

export default function ProductCompareCard({
  product,
  allProducts,
}: Props) {
  const { addItem } = useQuote();

  const equivalent = findEquivalent(product, allProducts);

  /**
   * 🔥 DEBUG ZONE
   */
  console.log("========== PRODUCT DEBUG ==========");
  console.log("product.id:", product.id);
  console.log("product.partNo:", product.partNo);
  console.log("product.refs:", product.refs);
  console.log("normalized ref:", normalizeId(product.refs?.[0]));
  console.log("allProducts count:", allProducts.length);
  console.log("EQUIVALENT:", equivalent);
  console.log("===================================");

  const handleAdd = (p: Product) => {
    addItem({
      productId: p.id,
      partNo: p.partNo,
      brand: p.brand,
      qty: 1,
    });
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">

      {/* 🔵 ORIGINAL */}
      <div>
        <div className="flex justify-between text-xs text-slate-400">
          <span className="text-blue-600 font-medium">Original</span>
          <span>{product.brand}</span>
        </div>

        <h3 className="mt-1 text-xl font-bold">
          {product.partNo}
        </h3>

        {product.type && (
          <span className="mt-1 inline-block text-xs bg-slate-100 px-2 py-0.5 rounded">
            {product.type}
          </span>
        )}

        <img
          src={product.imageUrl || "/images/placeholder.png"}
          className="mx-auto my-3 h-28 object-contain"
        />

        {product.description && (
          <p className="text-sm text-slate-600">
            {product.description}
          </p>
        )}

        {/* quick spec */}
        {(product.od_mm || product.length_mm) && (
          <div className="mt-2 text-xs text-slate-500">
            {product.od_mm && <>OD: {product.od_mm} mm<br /></>}
            {product.length_mm && <>L: {product.length_mm} mm</>}
          </div>
        )}

        <button
          onClick={() => handleAdd(product)}
          className="mt-3 w-full rounded bg-black py-2 text-white text-sm hover:bg-slate-800"
        >
          ขอราคา
        </button>
      </div>

      {/* 🟢 EQUIVALENT */}
      {equivalent && (
        <>
          <div className="mt-4 border-t pt-3 text-center text-xs text-slate-400">
            Alternative (Compatible)
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="text-green-600 font-medium">
                Equivalent
              </span>
              <span>{equivalent.brand}</span>
            </div>

            <h4 className="mt-1 font-semibold">
              {equivalent.partNo}
            </h4>

            <img
              src={equivalent.imageUrl || "/images/placeholder.png"}
              className="mx-auto my-2 h-24 object-contain"
            />

            {equivalent.description && (
              <p className="text-sm text-slate-600">
                {equivalent.description}
              </p>
            )}

            {(equivalent.od_mm || equivalent.length_mm) && (
              <div className="mt-2 text-xs text-slate-500">
                {equivalent.od_mm && <>OD: {equivalent.od_mm} mm<br /></>}
                {equivalent.length_mm && <>L: {equivalent.length_mm} mm</>}
              </div>
            )}

            <button
              onClick={() => handleAdd(equivalent)}
              className="mt-2 w-full rounded border py-2 text-sm hover:bg-slate-100"
            >
              ขอราคา
            </button>
          </div>
        </>
      )}
    </div>
  );
}