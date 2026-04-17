"use client";

import Link from "next/link";

export default function CatalogClient() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
        Catalog
      </h1>

      <p className="mt-2 text-neutral-600">
        Browse industrial parts by category or brand.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Search Products
        </Link>

        <Link
          href="/brands"
          className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-400"
        >
          View Brands
        </Link>
      </div>
    </main>
  );
}