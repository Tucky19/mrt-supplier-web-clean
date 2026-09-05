import type { MetadataRoute } from "next";
import { products } from "@/data/products/index";

const SITE_URL = "https://www.mrtsupplier.com";
const LOCALES = ["th", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

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
        url: `${SITE_URL}/${locale}/privacy`,
        changeFrequency: "yearly",
        priority: 0.3,
      },
    );

    for (const product of products) {
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
