"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import AddToQuoteButton from "@/components/rfq/AddToQuoteButton";

type Product = {
  id: string;
  partNo: string;
  brand: string;
  category: string;
  title?: string;
  spec?: string;
  officialUrl?: string;
};

type Props = {
  item: Product;
};

export default function ResultRow({ item }: Props) {
  const locale = useLocale();
  const p = item;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-lg font-bold tracking-tight text-white">
              {p.partNo}
            </div>
            <div className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-neutral-300">
              {p.brand}
            </div>
          </div>

          <div className="mt-1 text-sm text-neutral-400">{p.category}</div>

          {p.title ? (
            <p className="mt-2 text-sm leading-6 text-neutral-200">{p.title}</p>
          ) : null}

          {p.spec ? (
            <p className="mt-1 text-sm leading-6 text-neutral-400">{p.spec}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {p.officialUrl ? (
            <a
              href={p.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-sm text-neutral-200 transition hover:border-white/20 hover:text-white"
            >
              Official
              <ArrowRight size={14} />
            </a>
          ) : null}

          <Link
            href={`/${locale}/products/${p.id}`}
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-sm text-neutral-200 transition hover:border-white/20 hover:text-white"
          >
            Detail
            <ArrowRight size={14} />
          </Link>

          <AddToQuoteButton
            productId={p.id}
            partNo={p.partNo}
            brand={p.brand}
            title={p.title}
          />
        </div>
      </div>
    </div>
  );
}
