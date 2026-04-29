import type { MetadataRoute } from "next";
import { products } from "@/data/products/index";
import { brands } from "@/data/brands/index";

const SITE_URL = "https://mrtsupplier.com";

/**
 * 🔥 กำหนด locale ที่ใช้จริง
 * - ถ้ามี 2 ภาษา → ใส่ ["th", "en"]
 * - ถ้า default มี redirect → เลือกตัวเดียว (เช่น ["en"])
 */
const LOCALES = ["th", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    /* Static */
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
      }
    );

    /* Products */
    for (const p of products) {
      entries.push({
        url: `${SITE_URL}/${locale}/products/${encodeURIComponent(
          p.partNo
        )}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    /* Brands */
    for (const b of brands) {
      entries.push({
        url: `${SITE_URL}/${locale}/brands/${encodeURIComponent(b.slug)}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    /* Cross Reference (ถ้ามีหน้า) */
    for (const p of products) {
      if (p.refs?.length) {
        entries.push({
          url: `${SITE_URL}/${locale}/cross-reference/${encodeURIComponent(
            p.partNo
          )}`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}