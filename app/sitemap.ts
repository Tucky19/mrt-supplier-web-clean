import type { MetadataRoute } from "next";
import { products } from "@/data/products/index";

const SITE_URL = "https://mrtsupplier.com";
const LOCALES = ["th", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push(
      {
        url: `${SITE_URL}/${locale}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/${locale}/products`,
        lastModified,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/${locale}/contact`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      },
    );

    for (const product of products) {
      entries.push({
        url: `${SITE_URL}/${locale}/products/${encodeURIComponent(
          product.partNo,
        )}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const product of products) {
      if (!product.refs?.length) continue;

      entries.push({
        url: `${SITE_URL}/${locale}/cross-reference/${encodeURIComponent(
          product.partNo,
        )}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
