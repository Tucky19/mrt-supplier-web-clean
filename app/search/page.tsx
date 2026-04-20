import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    mode?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Search Industrial Parts | MRT Supplier",
  description:
    "Search industrial parts by part number, cross reference, title, brand, and specification.",
};

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const locale = await getLocale();
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(sp)) {
    const normalized = String(value ?? "").trim();
    if (normalized) {
      params.set(key, normalized);
    }
  }

  const qs = params.toString();
  redirect(qs ? `/${locale}/products?${qs}` : `/${locale}/products`);
}
