# Unused Files Audit

Date: 2026-05-23

Scope checked:
- `components/`
- `app/`
- `lib/`
- `data/`
- `scripts/`
- `public/images/products/`
- root-level markdown/json/report files

Method:
- Checked direct imports and local file references with `rg`
- Checked string-path references for API routes and public assets
- Checked `package.json` scripts
- Treated Next.js route/convention files as potentially live even when they are not imported

Notes:
- This is a static repo audit only. It does not prove whether an external client, bookmarked URL, cron job, or ops workflow still depends on a file.
- `public/images/products/` was reviewed conservatively because many assets can be referenced indirectly by part number or string path.

## Safe To Delete

These files look like clear leftovers, backups, or superseded artifacts with no current repo references.

| File | Reason |
| --- | --- |
| `components/home/HeroSection.backup.tsx` | Backup snapshot file. No current references. |
| `components/home/HeroSection.before-search-first.tsx` | Explicit pre-change snapshot. No current references. |
| `components/home/SearchHero.backup.tsx` | Backup snapshot file. No current references. |
| `page.before-search-first.tsx` | Root-level old page snapshot. No current references. |
| `en.before-search-first.json` | Root-level snapshot file. No current references. |
| `th.before-search-first.json` | Root-level snapshot file. No current references. |
| `data/search/index.old.ts` | Marked `old`; no current imports or script references. |
| `scripts/build-search-index.js` | Legacy JS builder. Current package scripts point to `scripts/build-search-index.ts`. |
| `data/products.dump.json` | Only referenced by the legacy `scripts/build-search-index.js`. If the JS builder is removed, this dump becomes orphaned. |
| `009.txt` | Looks like a temporary code snippet scratch file. No current references. |

## Needs Manual Review

These files appear unused, obsolete, duplicated, deprecated, or maintenance-only, but I would not remove them without a quick product/ops check.

### Deprecated or Compatibility API Routes

These routes are not used by the current UI code I found, but several explicitly act as deprecated aliases and may still exist for backward compatibility.

| File | Reason |
| --- | --- |
| `app/api/search/route.ts` | Explicitly returns a deprecated response pointing callers to `/api/search/suggest`. |
| `app/api/search-suggest/route.ts` | Alias wrapper around `/api/search/suggest`. No internal callers found. |
| `app/api/submit-rfq/route.ts` | Deprecated alias forwarding to `/api/rfq/submit`. |
| `app/api/submit-quote/route.ts` | Deprecated alias forwarding to `/api/rfq/submit`. |
| `app/api/quote/route.ts` | Wrapper that forwards to `/api/rfq/submit`; no current UI callers found. |
| `app/api/admin/rfqs/[id]/status/route.ts` | Deprecated plural alias forwarding to canonical singular admin route. |
| `app/api/admin/rfqs/[id]/notes/route.ts` | Deprecated plural alias forwarding to canonical singular admin route. |
| `app/api/admin/rfqs/[id]/quote/route.ts` | Deprecated plural alias forwarding to canonical singular admin routes. |
| `app/api/admin/rfqs/[id]/follow-ups/route.ts` | Deprecated plural alias forwarding to canonical singular admin route. |
| `app/api/admin/rfq/event/[eventId]/done/route.ts` | Explicitly marked deprecated in the route response. |

### Unreferenced `app/components/*`

These look like older catalog/support components. I found no imports from current route files.

| File | Reason |
| --- | --- |
| `app/components/AddToQuoteAdapter.tsx` | No current imports found. |
| `app/components/BrandBar.tsx` | No current imports found. |
| `app/components/CatalogShell.tsx` | No current imports found. |
| `app/components/InternalLinks.tsx` | No current imports found. |
| `app/components/Panel.tsx` | No current imports found. |
| `app/components/PopularSearches.tsx` | No current imports found. |
| `app/components/TrustStrip.tsx` | No current imports found. |

### Unreferenced Home/Search Variants

These look like older UI variants that are not used by the current home page, which now renders the hero inline and uses `components/search/SearchBar.tsx`.

| File | Reason |
| --- | --- |
| `components/home/Hero.tsx` | No current imports found. |
| `components/home/HeroSection.tsx` | No current imports found. |
| `components/home/HomeHero.tsx` | No current imports found. |
| `components/home/SearchHero.tsx` | No current imports found. |
| `components/home/BrandStrip.tsx` | No current imports found. |
| `components/home/TrustedStrip.tsx` | No current imports found. |
| `components/home/ProductOverviewBanner.tsx` | No current imports found. |
| `components/search/DualSearch.tsx` | No current imports found. |
| `components/search/BearingBuilder.tsx` | No current imports found. |
| `components/search/SpecBuilder.tsx` | No current imports found. |
| `components/search/SearchActions.tsx` | No current imports found. |
| `components/search/SearchInput.tsx` | No current imports found. |
| `components/search/SearchPanel.tsx` | No current imports found. |
| `components/search/SearchResultList.tsx` | No current imports found. |
| `components/search/ResultRow.tsx` | No current imports found. |
| `components/search/GlobalSearch.tsx` | Only referenced from `components/home/Hero.tsx`, which itself appears unused. |
| `components/search/SingleSearch.tsx` | Only referenced from unused hero variants. |
| `components/search/ModeToggle.tsx` | No current imports found. |

### Unreferenced Product/Admin UI Variants

These components do not appear in current route imports. Some may be older detail-page or admin workflow variants.

| File | Reason |
| --- | --- |
| `components/products/ProductImage.tsx` | No current imports found. |
| `components/products/RelatedProducts.tsx` | No current imports found. |
| `components/products/ReferenceBox.tsx` | No current imports found. |
| `components/products/ProductReferenceSection.tsx` | No current imports found. |
| `components/products/ProductCompareCard.tsx` | No current imports found. |
| `components/products/ProductHeaderActions.tsx` | No current imports found. |
| `components/products/BrandBadge.tsx` | No current imports found. |
| `components/products/CrossReferenceSection.tsx` | No current imports found. |
| `components/products/SpecsTable.tsx` | No current imports found. |
| `components/products/detail/ProductApplicationBlock.tsx` | No current imports found. |
| `components/products/detail/ProductCrossRefBlock.tsx` | No current imports found. |
| `components/products/detail/ProductCrossReferenceCards.tsx` | No current imports found. |
| `components/products/detail/ProductHero.tsx` | No current imports found. |
| `components/products/detail/ProductOfficialReference.tsx` | No current imports found. |
| `components/products/detail/ProductRfqCTA.tsx` | No current imports found. |
| `components/products/detail/ProductSpecTable.tsx` | No current imports found. |
| `components/admin/QuoteWorkflowForm.tsx` | No current imports found. |
| `components/admin/RfqFollowUpBox.tsx` | No current imports found. |
| `components/admin/RfqFollowUpList.tsx` | No current imports found. |
| `components/admin/RfqNoteBox.tsx` | No current imports found. |
| `components/admin/RfqQuickActions.tsx` | No current imports found. |
| `components/admin/RfqStatusActions.tsx` | No current imports found. |
| `components/quote/QuoteFormClient.tsx` | No current imports found; localized quote flow uses `app/[locale]/quote/QuoteClient.tsx`. |

### Duplicate or Orphaned Shared Components

These are not imported anywhere I could find, and some appear to overlap with active replacements.

| File | Reason |
| --- | --- |
| `components/StickyQuoteBar.tsx` | No current imports found; overlaps with `components/quote/StickyQuoteBar.tsx`. |
| `components/ToastRFQ.tsx` | No current imports found; overlaps with `components/ui/Toast.tsx`. |
| `components/ui/StockBadge.tsx` | No current imports found; overlaps with `components/StockBadge.tsx`. |
| `components/ui/Section.tsx` | No current imports found; overlaps with `components/layout/Section.tsx`. |
| `components/ui/Badge.tsx` | No current imports found. |
| `components/ui/CopyButton.tsx` | No current imports found. |
| `components/ui/FloatingLineButton.tsx` | No current imports found. |
| `components/AddToQuoteAdapter.tsx` | No current imports found; naming overlaps with `app/components/AddToQuoteAdapter.tsx`. |
| `components/LineButton.tsx` | No current imports found. |
| `components/MRTLogoDark.tsx` | No current imports found. |
| `components/PasteListSearch.tsx` | No current imports found. |
| `components/CategoryShortcuts.tsx` | No current imports found. |
| `components/layout/MobileBottomBar.tsx` | No current imports found. |

### Unreferenced Libraries

These files did not show current import-path references. Some may be old helpers or future utilities.

| File | Reason |
| --- | --- |
| `lib/utils/spec.ts` | No current imports found. |
| `lib/security.ts` | No current imports found. |
| `lib/searchTokens.ts` | No current imports found. |
| `lib/part-number.ts` | No current imports found. |
| `lib/rateLimit.ts` | No current imports found; RFQ and quote flows use other rate-limit helpers. |
| `lib/i18n/headerUi.ts` | No current imports found. |
| `lib/products/getEquivalent.ts` | No current imports found. |
| `lib/products/hydrate.ts` | No current imports found. |
| `lib/products/normalize.ts` | No current imports found. |
| `lib/email/sendQuoteEmails.ts` | No current imports found. |
| `lib/email/coldIntroductionEmail.ts` | No current imports found. |

### Unreferenced or Historical Data Files

These look like source-material, staging, or enrichment leftovers rather than active runtime data.

| File | Reason |
| --- | --- |
| `data/search/autocomplete.ts` | No current imports found. |
| `data/search/meta.json` | No current app imports found; only the unused `scripts/check-count.cjs` reads it. |
| `data/refs/refs.ts` | No current imports found. |
| `data/enrichment/candidates.ts` | No current imports found. |
| `data/enrichment/drafts.ts` | No current imports found. |
| `data/products/brand-donaldson.ts` | No current imports found. |
| `data/products/brand-mann.ts` | No current imports found. |
| `data/products/brand-ntn.ts` | No current imports found. |
| `data/products/extracted-donaldson-products.ts` | No current imports found. |
| `data/products/products.batch1.ts` | No current imports found. |
| `data/products/products.batch2.ts` | No current imports found. |
| `data/products/products.batch3.ts` | No current imports found. |
| `data/products/products.batch5.ts` | No current imports found. |
| `data/products/products.batch6.ts` | No current imports found. |
| `data/products/products.card-ready.ts` | No current imports found. |
| `data/products/products.example.ts` | No current imports found. |
| `data/products/products_filters_mrt_v2.ts` | No current imports found. |
| `data/products/donaldson.batch-verified.json` | No current imports found. |
| `data/mann_enriched.json` | No current imports found. |
| `data/donaldson_enriched.json` | No current imports found. |

### Maintenance Scripts Not Wired Into `package.json`

These may still be useful ad hoc tooling, but they are not currently invoked by package scripts and I found no code references to them.

| File | Reason |
| --- | --- |
| `scripts/audit-official-urls-live.ts` | Standalone maintenance script; outputs root-level reports. |
| `scripts/audit-products-completeness.ts` | Standalone maintenance script; no package script entry. |
| `scripts/check-count.cjs` | Standalone utility; no package script entry; only reads `data/search/meta.json`. |
| `scripts/check-count.mjs` | Standalone utility; no package script entry. |
| `scripts/check-missing-product-images.ts` | Standalone maintenance script; no package script entry. |
| `scripts/check-official-urls.ts` | Standalone maintenance script; no package script entry. |
| `scripts/check-product-images.ts` | Standalone maintenance script; no package script entry. |
| `scripts/convert-excel-to-products.ts` | Standalone import script; no package script entry. |
| `scripts/debug-index.ts` | Standalone debug script; no package script entry. |
| `scripts/find-bad-official-urls.ts` | Standalone maintenance script; no package script entry. |
| `scripts/generate-mann-product.ts` | Standalone generation script; no package script entry. |
| `scripts/generate-products.ts` | Standalone generation script; no package script entry. |
| `scripts/generate-seo.ts` | Standalone generation script; no package script entry. |
| `scripts/import-donaldson-products.ts` | Standalone import script; no package script entry. |
| `scripts/parse-donaldson.js` | Standalone parsing script; no package script entry. |
| `scripts/xlsx-to-products.mjs` | Standalone import script; overlaps in purpose with `convert-excel-to-products.ts`. |

### Public Product Images With No Detected String/Data Matches

These are the clearest possible orphan candidates in `public/images/products/`, but I would still verify against intended catalog coverage before deleting.

| File | Reason |
| --- | --- |
| `public/images/products/mann/w962-14-detail.jpg` | No filename or part-number matches found outside the asset itself. |
| `public/images/products/mann/w950-detail.jpg` | No filename or part-number matches found outside the asset itself. |
| `public/images/products/mann/lb13145-3-detail.jpg` | No filename or part-number matches found outside the asset itself. |
| `public/images/products/mann/c23610-detail.jpg` | No filename or part-number matches found outside the asset itself. |
| `public/images/products/donaldson/p119372.jpg` | No filename or part-number matches found outside the asset itself. |
| `public/images/products/donaldson/P502643.jpg` | No filename or part-number matches found outside the asset itself. |
| `public/images/products/donaldson/p953564.jpg` | No filename or part-number matches found outside the asset itself. |
| `public/images/products/donaldson/p554770.jpg` | No filename or part-number matches found outside the asset itself. |

### Root-Level Reports and Notes

These are not part of the runtime app. Some are generated outputs, some look like one-off audits, and some may still be useful operational notes.

| File | Reason |
| --- | --- |
| `official-url-live-check-report.md` | Generated output of `scripts/audit-official-urls-live.ts`. |
| `official-url-live-check-report.json` | Generated output of `scripts/audit-official-urls-live.ts`. |
| `official-url-audit-current.md` | Audit/note file; no runtime references found. |
| `official-url-quality-audit-donaldson.md` | Audit/note file; no runtime references found. |
| `product-completeness-summary.md` | Audit/note file; no runtime references found. |
| `product-dimension-completeness-audit.md` | Audit/note file; no runtime references found. |
| `product-enrichment-next-batches.md` | Audit/note file; no runtime references found. |
| `REFRACTOR_NOTES.md` | Note file; no runtime references found. |
| `SYSTEM_INVENTORY.md` | Note file; no runtime references found. |

## Should Keep

These files or file groups appear active, framework-required, or intentionally part of the current runtime/build flow.

| File or Group | Reason |
| --- | --- |
| `app/**/page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts` | Next.js convention files can be live through filesystem routing even with no imports. |
| `app/[locale]/page.tsx`, `app/[locale]/products/**`, `app/[locale]/quote/**` | Current public flow files for search, product detail, and RFQ/quote flow. |
| `app/api/rfq/submit/route.ts`, `app/api/rfq/route.ts`, `app/api/search/suggest/route.ts` | Canonical RFQ and search endpoints used by current UI. |
| `components/search/SearchBar.tsx`, `components/products/ProductListClient.tsx`, `components/products/ProductDetailClient.tsx`, `components/products/MissingProductRequestForm.tsx` | Actively used by current public product/search pages. |
| `components/layout/SiteHeader.tsx`, `components/layout/SiteFooter.tsx` | Actively used by current pages. |
| `data/products/index.ts` and files it imports directly | These are part of the current product aggregation/runtime data load. |
| `lib/products/image.ts` | Runtime image resolution helper for product assets. |
| `scripts/build-search-index.ts`, `scripts/verify-search-index.js`, `scripts/check-env.mjs`, `scripts/check-product-catalog.ts`, `scripts/run-search-tuning.ts`, `scripts/report-product-duplicates.ts`, `scripts/validate-products.ts`, `scripts/import-products.ts`, `scripts/export-products-json.js` | Referenced by `package.json` scripts or clearly part of the current data/search toolchain. |
| `README.md`, `AGENTS.md`, `DEPLOY_CHECKLIST.md`, `package.json`, `package-lock.json`, `tsconfig.json` | Active project documentation/configuration. |
| Most files under `public/images/products/` | Many are resolved indirectly by `lib/products/image.ts` or product data, so lack of direct imports is not enough to remove them safely. |

## Recommended Cleanup Commands

Do not run these blindly. They are suggestions only.

### Conservative Safe Cleanup

```powershell
Remove-Item -LiteralPath `
  "components/home/HeroSection.backup.tsx", `
  "components/home/HeroSection.before-search-first.tsx", `
  "components/home/SearchHero.backup.tsx", `
  "page.before-search-first.tsx", `
  "en.before-search-first.json", `
  "th.before-search-first.json", `
  "data/search/index.old.ts", `
  "scripts/build-search-index.js", `
  "data/products.dump.json", `
  "009.txt"
```

### Safer Review Workflow For The Manual-Review Bucket

```powershell
New-Item -ItemType Directory -Force .\\cleanup-review
```

```powershell
Move-Item -LiteralPath `
  "official-url-live-check-report.md", `
  "official-url-live-check-report.json", `
  "official-url-audit-current.md", `
  "official-url-quality-audit-donaldson.md", `
  "product-completeness-summary.md", `
  "product-dimension-completeness-audit.md", `
  "product-enrichment-next-batches.md", `
  "REFRACTOR_NOTES.md", `
  "SYSTEM_INVENTORY.md" `
  -Destination .\\cleanup-review
```

### Useful Verification Searches Before Removing Manual-Review Files

```powershell
rg -n "X-MRT-Deprecated|Deprecated endpoint|Deprecated alias" app/api
```

```powershell
rg -n "HeroSection|SearchHero|GlobalSearch|SingleSearch|QuoteFormClient" app components
```

```powershell
rg -n "p119372|P502643|p953564|p554770|w962-14-detail|w950-detail|lb13145-3-detail|c23610-detail" .
```

## Suggested Next Cleanup Order

1. Remove the `Safe To Delete` files.
2. Decide whether deprecated alias API routes must stay for backward compatibility.
3. Review the unreferenced UI variants and older data source files in one batch.
4. Review root-level audit/report files and move any worth keeping into `docs/` if you want them preserved.
