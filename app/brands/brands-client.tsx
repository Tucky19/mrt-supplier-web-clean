"use client";

import Link from "next/link";

export default function BrandsClient() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
        Brands
      </h1>

      <p className="mt-2 text-neutral-600">
        Browse our supported industrial brands.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Search Products
        </Link>

        <Link
          href="/catalog"
          className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-400"
        >
          Catalog
        </Link>
      </div>
    </main>
  );
}