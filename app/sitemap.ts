import type { MetadataRoute } from "next";
import { products } from "@/data/products/index";
import { relationPartNumbers } from "@/lib/products/relations";

const SITE_URL = "https://www.mrtsupplier.com";
const LOCALES = ["th", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  // Match the existing product-page robots policy without changing product data.
  const indexableProducts = products.filter((product) => {
    const hasSpec = Boolean(product.spec?.trim());
    const hasRefs = Boolean(
      [
        ...relationPartNumbers(product.refs ?? [], "unknown"),
        ...relationPartNumbers(product.crossReferences ?? [], "unknown"),
      ].some((value) => value.trim()),
    );

    return !product.partNumberOnly && (hasSpec || hasRefs);
  });

  for (const locale of LOCALES) {
    entries.push(
      {
        url: `${SITE_URL}/${locale}`,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/${locale}/products`,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/${locale}/brands`,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/${locale}/applications/air-compressor-generator`,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/${locale}/contact`,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/${locale}/products/dimensions`,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/${locale}/articles/industrial-filter-selection-guide`,
        lastModified: new Date("2026-09-21"),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/${locale}/articles/when-to-replace-engine-air-filter`,
        lastModified: new Date("2026-09-23"),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/${locale}/privacy`,
        changeFrequency: "yearly",
        priority: 0.3,
      },
    );

    for (const product of indexableProducts) {
      entries.push({
        url: `${SITE_URL}/${locale}/products/${encodeURIComponent(
          product.partNo,
        )}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
