# SEO Current Audit

Files reviewed:
- [app/[locale]/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/[locale]/page.tsx)
- [app/[locale]/products/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/[locale]/products/page.tsx)
- [app/[locale]/products/[id]/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/[locale]/products/[id]/page.tsx)
- [app/[locale]/cross-reference/[partNo]/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/[locale]/cross-reference/[partNo]/page.tsx)
- [app/sitemap.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/sitemap.ts)
- [app/robots.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/robots.ts)

Supporting checks:
- [app/layout.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/layout.tsx)
- [app/search/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/search/page.tsx)

## Current Status

### 1. Homepage title/description TH/EN

Current status:
- `app/[locale]/page.tsx` does **not** define `generateMetadata` or `metadata`
- there is no route-level homepage title/description for either Thai or English in this file

Impact:
- homepage metadata is currently missing or left to fallback behavior
- there is no controlled TH/EN homepage title/description strategy in the reviewed route

### 2. Products page title/description

Current status:
- `app/[locale]/products/page.tsx` defines localized metadata
- EN title: `Products | MRT Supplier`
- EN description: `Search industrial parts by part number or cross reference and request a quotation quickly.`
- TH title/description exist, but the Thai strings in the file are mojibake / encoding-corrupted
- canonical is set to `/${locale}/products`

Assessment:
- structure is present
- English is acceptable
- Thai metadata needs repair before it is production-safe for SEO

### 3. Product detail dynamic title/description

Current status:
- `app/[locale]/products/[id]/page.tsx` defines dynamic metadata
- EN title pattern: `${partNo} | ${brand} Filter`
- EN description pattern: `Find ${partNo} with OEM cross reference and request quote`
- TH title/description exist, but Thai strings are mojibake / encoding-corrupted
- canonical is set to `/${locale}/products/${partNo}`

Assessment:
- dynamic metadata exists
- canonical logic is correct in shape
- English description is generic but usable
- Thai metadata is currently broken

### 4. Canonical URLs

Current status:
- products page canonical present
- product detail canonical present
- cross-reference detail canonical present
- homepage canonical is not explicitly defined in `app/[locale]/page.tsx`

Assessment:
- canonical coverage is decent for search/product routes
- homepage canonical is missing at the route level

### 5. Alternates hreflang if present

Current status:
- no `alternates.languages` / hreflang mapping found in the reviewed localized pages
- only canonical alternates are present

Assessment:
- there is currently **no hreflang implementation**
- this is a gap for a Thai/English localized site

### 6. noindex logic for weak product pages

Current status:
- `app/[locale]/products/[id]/page.tsx` computes `shouldNoIndex`
- rule: noindex product pages when they have neither:
  - `spec`
  - `refs` / `crossReferences`
- if weak: `robots: { index: false, follow: true }`
- if stronger: `robots: { index: true, follow: true }`

Assessment:
- this is a sensible, conversion-safe SEO guardrail
- it matches the current product-data quality strategy reasonably well

### 7. Sitemap includes important URLs

Current status:
- `app/sitemap.ts` includes:
  - `/{locale}`
  - `/{locale}/products`
  - all product detail pages
  - brand pages
  - cross-reference pages when `refs` exist

Assessment:
- core product URLs are included
- sitemap does **not** include some public static pages like:
  - `/contact`
  - `/faq`
  - `/why-us`
  - `/store-locator`
- sitemap currently includes all product pages, even though some product pages may be `noindex`

### 8. robots allows crawling

Current status:
- `app/robots.ts` allows `/`
- sitemap URL is present: `https://mrtsupplier.com/sitemap.xml`

Assessment:
- robots setup is simple and valid
- no crawl blocking issue found in the reviewed file

### 9. Missing Google Search Console verification

Current status:
- no Search Console verification metadata found
- no `google-site-verification` string found in reviewed app code
- `app/layout.tsx` has no metadata export containing verification

Assessment:
- Google Search Console verification appears to be missing from the codebase

## Issues Found

### High severity

- Homepage route has no explicit localized metadata
- Thai metadata strings in localized products/product-detail/cross-reference routes are mojibake and not SEO-safe
- No hreflang alternates for TH/EN localized routes

### Medium severity

- Homepage canonical is not explicitly defined
- Sitemap includes product pages broadly without considering the page-level noindex rule
- Sitemap misses important public marketing/support pages
- Product detail metadata is generic and does not use richer product fields like `seo`, `seoTitle`, or `seoDescription`

### Low severity

- Root layout sets `<html lang="en">` globally, which may not reflect the active locale correctly
- `/search` has metadata even though it redirects to localized `/products`; this is not harmful, but it is not the main SEO landing route

## Recommended Changes

### Homepage

- Add `generateMetadata` to `app/[locale]/page.tsx`
- define clean TH and EN title/description
- add homepage canonical for each locale

### Localized metadata quality

- Fix all mojibake Thai metadata strings in:
  - products page
  - product detail page
  - cross-reference detail page
- review visible Thai copy used in SEO-critical fields before deployment

### hreflang / alternates

- Add `alternates.languages` for TH/EN on:
  - homepage
  - products page
  - product detail page
  - cross-reference page where applicable

### Product detail metadata

- Upgrade product detail title/description to use richer product content where available
- consider product-level SEO fields if they are already present in data
- keep the current noindex rule unless product-data quality improves substantially

### Sitemap

- Add important public URLs such as:
  - contact
  - faq
  - why-us
  - store-locator
- review whether noindex product pages should be excluded from sitemap to reduce crawl waste

### Search Console verification

- Add Google Search Console verification metadata in a central metadata layer

## Priority Order

1. Fix broken Thai metadata strings in localized SEO fields.
2. Add explicit homepage metadata for TH/EN.
3. Add hreflang alternates for localized routes.
4. Add Google Search Console verification.
5. Expand sitemap to include important non-product public pages.
6. Review sitemap strategy for weak/noindex product pages.
7. Improve product detail metadata quality using richer product fields.

## Bottom Line

Current SEO setup has a decent structural base for products:
- canonicals exist on key product routes
- robots allows crawling
- sitemap exists
- weak product noindex logic is already implemented

The main current problems are content and localization quality, not crawler access:
- homepage metadata is missing
- Thai metadata is broken
- hreflang is absent
- Search Console verification is missing
