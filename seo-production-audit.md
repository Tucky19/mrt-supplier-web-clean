# SEO Production Audit

Audit scope: MRT Supplier production SEO readiness for Google indexing and B2B product search traffic.

Files checked:

- `app/layout.tsx`
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/products/page.tsx`
- `app/[locale]/products/[id]/page.tsx`
- `app/[locale]/cross-reference/[partNo]/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- relevant metadata, canonical, sitemap, robots, and structured-data references

No code, product data, RFQ behavior, admin behavior, Prisma schema, or API behavior was modified for this audit.

## 1. Current SEO Status

Overall status: partially ready, but not production-complete for Google indexing.

What is in place:

- `app/robots.ts` exists and allows crawling.
- `app/sitemap.ts` exists and emits localized home, products, product detail, brand, and cross-reference URLs.
- `app/[locale]/products/page.tsx` has `generateMetadata`.
- `app/[locale]/products/[id]/page.tsx` has product-level `generateMetadata`.
- Product pages can set `robots: { index: true, follow: true }` when a product has basic indexable signals.
- Product and products pages set canonical URLs.
- Cross-reference pages also generate metadata and canonicals.

Main gaps:

- Root layout has no global `metadata`, `metadataBase`, Open Graph, Twitter, or default title template.
- Root `<html lang="en">` is hardcoded and does not reflect `/th` pages.
- `app/[locale]/layout.tsx` does not provide locale-aware metadata or alternate language links.
- `app/[locale]/page.tsx` has no homepage metadata.
- Canonicals are relative paths, and no `metadataBase` is defined in the checked root layout.
- No `alternates.languages` / hreflang entries were found for TH/EN pages.
- No Organization, LocalBusiness, WebSite, BreadcrumbList, or Product JSON-LD was found for the localized product flow.
- Sitemap includes localized brand URLs, but no `app/[locale]/brands` route exists in the checked route tree.
- `robots.ts` allows all routes, including admin paths unless those pages themselves noindex.

## 2. Missing Sitemap / Robots / Meta Items

### Sitemap

Current sitemap strengths:

- Uses `https://mrtsupplier.com`.
- Includes `/th` and `/en`.
- Includes `/th/products` and `/en/products`.
- Includes every product detail page for both locales.
- Includes cross-reference URLs for products with refs.

Sitemap issues:

- Sitemap emits `/${locale}/brands/${slug}`, but no `app/[locale]/brands` route was found. This can create sitemap URLs that return 404.
- Sitemap does not include locale alternates inside sitemap entries. Next metadata routes can include alternates, but the current implementation only lists separate URLs.
- `lastModified` is always current build time for every URL, not tied to product/content update time. This is acceptable initially but less useful for Google freshness signals.
- Sitemap includes all product pages regardless of product quality or `robots` noindex logic. If any product page noindexes due to weak data, sitemap and page robots can conflict.

### Robots

Current robots strengths:

- `robots.ts` exists.
- Allows crawling.
- Points to `https://mrtsupplier.com/sitemap.xml`.

Robots issues:

- Admin routes are not disallowed in robots. Prefer page-level noindex plus authentication, but robots can still reduce crawler noise.
- Search/query result URLs are not explicitly controlled. The `/products?q=...` URL is not in sitemap, but crawlers can still discover query URLs through links/forms.

### Metadata

Missing or incomplete:

- No global `metadataBase`.
- No global title template.
- No homepage `generateMetadata` or exported `metadata` for `app/[locale]/page.tsx`.
- No Open Graph metadata on homepage, products page, or product page.
- No Twitter card metadata.
- No product image metadata for social previews.
- Product page title is always `${partNo} | ${brand} Filter`, which is inaccurate for bearings or non-filter products.

## 3. Product Page SEO Readiness

Current strengths:

- Product pages have dynamic metadata.
- Product pages canonicalize to `/${locale}/products/${partNo}`.
- Product pages noindex missing products.
- Product pages conditionally noindex products without `spec` or cross references.
- Product detail UI contains specs, cross references, official references, and RFQ CTAs.

Product SEO issues:

- Product metadata descriptions are generic and do not include dimensions, product category, brand, or key cross-reference terms when available.
- Product metadata does not include Open Graph image, title, or description.
- Product metadata does not include Product JSON-LD.
- Product metadata does not include BreadcrumbList JSON-LD.
- Product canonical URLs are relative while no `metadataBase` was found.
- `generateStaticParams` in `app/[locale]/products/[id]/page.tsx` returns only `{ id }`, not explicit locale/id pairs. Build currently works, but explicit locale params would be clearer and safer for localized static generation.
- `hasIndexableProductSignals` only checks `spec` or refs/crossReferences; it does not consider structured specifications, images, official URLs, category, or brand. Some useful products could be noindexed if `spec` is absent but structured specs exist.
- No dedicated noindex behavior was found for weak search/listing states such as query URLs.

Product pages are close to useful for B2B long-tail part-number traffic, but they need richer metadata and structured data before being considered fully production-ready.

## 4. TH/EN Locale SEO Issues

Current strengths:

- Localized routes exist under `/th` and `/en`.
- Sitemap includes both locales.
- Products and product detail metadata are locale-aware in basic title/description text.

Locale issues:

- Root `<html lang="en">` is hardcoded, so Thai pages likely render with `lang="en"`.
- No `alternates.languages` metadata was found for `/th` and `/en` equivalents.
- No `x-default` alternate was found.
- `app/[locale]/layout.tsx` only wraps providers and does not set locale-level metadata.
- Thai strings in several inspected files appeared mojibake in terminal output, which should be checked in browser/source output to ensure production text is valid UTF-8.
- Canonicals are locale-specific, but the corresponding alternate language relationships are missing.

Recommended hreflang pattern:

- `/th/...` should point to Thai canonical.
- `/en/...` should point to English canonical.
- Each localized page should include alternates for `th`, `en`, and ideally `x-default`.

## 5. Google Search Console Readiness

Ready:

- A sitemap endpoint exists.
- A robots endpoint exists and references the sitemap.
- Product URLs are generated consistently from part numbers.
- Public product pages are server-rendered and indexable when robot rules allow.

Not yet ready / should verify before submission:

- Verify `https://mrtsupplier.com/sitemap.xml` returns 200 in production.
- Verify sitemap URLs do not include 404 brand pages.
- Verify `/th` and `/en` pages render correct language tags and canonical tags.
- Verify admin pages are blocked by auth and noindexed.
- Verify production HTML includes correct Thai text encoding.
- Verify Google can render product pages without client-only dependency issues.
- Add and verify a domain property in Google Search Console.
- Submit sitemap after fixing route/canonical/hreflang issues.
- Use URL Inspection on representative pages:
  - `/th`
  - `/en`
  - `/th/products`
  - `/en/products`
  - a Donaldson product page
  - a MANN-FILTER product page
  - a no-result or missing-product flow should not be submitted as indexable content.

## 6. Recommended Implementation Plan

### Phase 1: Foundation

1. Add global metadata in `app/layout.tsx`.
2. Set `metadataBase` to `https://mrtsupplier.com`.
3. Add title template and default description.
4. Make `<html lang>` locale-aware, likely by moving the `html` lang handling into the locale layout or another supported App Router pattern.
5. Add homepage metadata for `app/[locale]/page.tsx`.

### Phase 2: Locale SEO

1. Add `alternates.languages` for localized pages.
2. Add `x-default` where appropriate.
3. Ensure canonicals are absolute through `metadataBase`.
4. Confirm Thai text output is valid UTF-8 in rendered production HTML.

### Phase 3: Product SEO

1. Improve product metadata title logic so non-filter categories are not labeled as `Filter`.
2. Build product descriptions from part number, brand, category, specs, and cross references when available.
3. Add product Open Graph metadata and use product image URLs where available.
4. Add Product JSON-LD for product detail pages.
5. Add BreadcrumbList JSON-LD for product detail pages.
6. Revisit `hasIndexableProductSignals` to include structured specifications and product image/official URL signals.

### Phase 4: Sitemap / Robots Cleanup

1. Remove brand URLs from sitemap until localized brand routes exist, or implement the missing brand routes.
2. Exclude noindex product pages from sitemap, or align product noindex logic so sitemap and robots are consistent.
3. Consider disallowing crawler access to `/admin` in `robots.ts`, while still keeping admin auth/noindex as the real protection.
4. Avoid indexing query URLs like `/products?q=...`; canonicalize them to `/products` or add noindex when appropriate.

### Phase 5: Search Console Launch

1. Deploy fixes.
2. Verify production `robots.txt` and `sitemap.xml`.
3. Add Google Search Console domain property.
4. Submit sitemap.
5. Inspect representative localized and product URLs.
6. Monitor indexing, duplicate canonical warnings, alternate-page warnings, and 404s from sitemap URLs.

## 7. Risks / Things Not To Change Yet

- Do not change RFQ flow for SEO; RFQ conversion is the primary business goal.
- Do not expose price or stock just for SEO unless operations can support accuracy.
- Do not generate broad speculative product pages without sufficient product signals.
- Do not index admin, quote success, or customer-specific flow pages.
- Do not add third-party SEO packages; the current Next.js metadata system is enough.
- Do not change product data during SEO metadata work unless a specific product enrichment task requires it.
- Do not add marketplace-style browse clutter; keep SEO improvements aligned with search-first B2B RFQ behavior.

