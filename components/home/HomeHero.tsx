"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const q = query.trim();
    if (!q) return;

    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="border-b border-neutral-900 bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
            MRT Supplier
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Reliable Industrial Parts Supplier
          </h1>

          <p className="max-w-xl text-sm leading-6 text-neutral-300 sm:text-base sm:leading-7">
            Search by part number, cross reference, or machine model. Fast
            sourcing for filters, bearings, and industrial components.
          </p>

          <div className="pt-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-3 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search part number, OEM, or application"
                  className="bg-neutral-950"
                  aria-label="Search part number, OEM, or application"
                />

                <Button type="submit" className="shrink-0">
                  Search
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-400 sm:text-sm">
            <span>✔ Industrial-grade parts</span>
            <span>✔ Fast RFQ response</span>
            <span>✔ Cross-reference support</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 text-center">
            <p className="text-sm text-neutral-400">Industrial Parts Platform</p>
            <p className="mt-2 text-lg font-semibold text-white">
              Search • Compare • Request Quote
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}