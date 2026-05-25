import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/th/admin",
          "/th/admin/",
          "/en/admin",
          "/en/admin/",
          "/th/quote/success",
          "/en/quote/success",
        ],
      },
    ],
    sitemap: "https://mrtsupplier.com/sitemap.xml",
  };
}
