# MRT Supplier Current Backlog

Source basis:
- Current repo state on 2026-05-23
- Recent work from latest commits:
  - Missing Product Request
  - GA4 page views and conversion tracking
  - Product Detail updates
  - Search/spec search work
  - Product data and cross-reference updates
  - SEO and cleanup audits

Build status:
- `npm run build` passes in the current repo state

## 1. Urgent / must verify after deploy

- Verify `NEXT_PUBLIC_GA4_ID` is set in production and GA4 page views are firing on public pages, especially `/{locale}/products`, `/{locale}/products/[id]`, and `/{locale}/quote`.
- Verify GA4 conversion events appear in DebugView / realtime for:
  - search
  - add_to_quote
  - rfq_submit_success
  - missing_product_request_submit
- Verify the Missing Product Request flow end-to-end:
  - form submit succeeds
  - RFQ record is created with `source: "missing_product_request"`
  - admin email sends
  - customer confirmation email sends when email is provided
  - LINE notification sends
  - rate limit still behaves correctly
- Verify duplicate-contact handling on missing product requests with:
  - existing email only
  - existing phone only
  - existing LINE ID only
  - conflicting contact fields
- Verify product detail pages render correctly for products with:
  - structured `specifications`
  - only `spec`
  - no cross references
  - same-brand alternatives / paired parts
- Verify search result quality on live data for:
  - exact part number
  - cross reference
  - dimension/spec query
  - empty-result path into Missing Product Request

## 2. Next development tasks

- Add `view_item` GA4 tracking on product detail page load. The helper exists in `lib/analytics/ga.ts` but is not currently used.
- Tighten product detail content QA:
  - remove mojibake/broken Thai text in product detail metadata and UI copy
  - review mixed English/Thai labels in detail sections
- Refine product detail layout for mobile scanning:
  - confirm spec table readability
  - confirm sticky bottom CTA does not conflict with long spec/cross-reference sections
  - confirm empty cross-reference fallback remains conversion-focused
- Continue search/dimension search tuning in `lib/search/search.ts` using real query cases:
  - OD / ID / length / thread combinations
  - mixed punctuation and spacing
  - shorthand dimension queries
- Review search UI path duplication:
  - `/search` redirects into localized `/products`
  - keep one clear search-first entry flow and reduce confusion in future work

## 3. Product data tasks

- Prioritize dimensional spec enrichment for the 114 products called out in `cleanup-review/product-dimension-completeness-audit.md`.
- Start with the generic-only Donaldson products where current specs are too weak for dimension search and product detail usefulness.
- Review cross-reference depth product-by-product:
  - identify products still relying on sparse `refs`
  - add same-brand alternatives / paired parts where clearly supported
- Audit whether `seo`, `seoTitle`, and `seoDescription` fields in product data should become the canonical source for product metadata instead of current fallback strings.
- Keep `data/products/index.ts` as the only active UI catalog source and avoid reviving old product source files during enrichment.

## 4. Analytics/GA4 tasks

- Add an analytics verification checklist for production deploys so GA4 setup is not rechecked ad hoc every release.
- Define a small event naming contract for MRT Supplier conversions:
  - search
  - view_item
  - add_to_quote
  - rfq_submit_success
  - missing_product_request_submit
- Decide whether admin pages should stay out of GA4 or be tracked separately.
- Decide whether to add source attribution fields consistently across events, especially:
  - homepage search
  - products search
  - product detail CTA
  - missing product request
- Review whether current local analytics storage / admin analytics paths are still needed alongside GA4 or should remain as a separate internal reporting track.

## 5. SEO tasks

- Fix broken Thai metadata strings on product and cross-reference pages.
- Review product detail indexability rule:
  - currently pages with no spec and no refs are `noindex`
  - confirm this is still the intended SEO threshold
- Review sitemap scope:
  - all product pages are currently included
  - cross-reference pages are included when `refs` exist
  - confirm this matches the desired crawl strategy
- Add richer product metadata where safe:
  - better title/description generation from structured product fields
  - optional Open Graph refinement for product pages
- Decide whether cross-reference pages should stay indexable long-term or remain secondary to product pages.

## 6. Cleanup/manual-review tasks

- Review the `unused-files-audit.md` manual-review bucket before deleting anything. There are many unreferenced components, old search variants, and historical data files.
- Remove only the clearly safe backup/snapshot files first if cleanup is approved later.
- Review deprecated alias API routes before any removal. Several may still exist for backward compatibility.
- Review unused scripts and root-level reports, then decide whether they should live under `docs/` / `cleanup-review` or be removed later.
- Remove accidental non-product artifacts from the working tree before future feature work:
  - `scripts/__pycache__/`
  - `scripts/file_organizer_safe.py`

## 7. Risks / things not to touch yet

- Do not change RFQ payload shapes, admin RFQ flow structure, notification behavior, or rate-limit logic while missing product request stabilization is still in progress.
- Do not refactor search logic out of `lib/search/search.ts` during tuning work. Keep ranking changes narrow and testable.
- Do not start broad product-data file cleanup until active source boundaries are confirmed. Many old files look unused, but deleting the wrong source material could slow future enrichment.
- Do not remove legacy alias routes until external/manual consumers are checked.
- Do not broaden SEO work into a large metadata rewrite yet. First fix encoding/copy quality and confirm indexability rules.
- Treat current uncommitted edits in `lib/search/search.ts` and `components/products/detail/ProductSpecTable.tsx` as in-flight work, not cleanup targets.
