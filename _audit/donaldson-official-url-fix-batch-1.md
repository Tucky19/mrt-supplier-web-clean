# Donaldson Official URL Fix Batch 1

- Date: 2026-07-19
- Repository: `D:\Projects\mrt-supplier-web-clean`
- Branch: `work/fix-donaldson-official-urls-batch-1`
- Scope: `officialUrl` fields only
- Approved target list: `P555461`, `X770088`, `P554620`, `P559000`, `P181045`, `P181054`, `P181064`, `P181082`, `P181191`, `P169478`

## Correction From Initial Patch

The initial patch incorrectly updated three unapproved products:

- `P558615`
- `P554685`
- `P538259`

Those `officialUrl` changes were reverted. They were not substituted into this batch.

## P559000 Duplicate-Safe Identification

Two raw `P559000` records exist in `data/products/products.donaldson.ts`.

| Raw location | Array | Distinguishing fields | Outcome |
| --- | --- | --- | --- |
| Around line 1310 | `donaldsonBatch1` | `title: "Donaldson Filter P559000"`, `category: "filter"` | Losing duplicate; not modified |
| Around line 3242 | `donaldsonBatchNewA` | `title: "Lube Filter, Spin-On Full Flow"`, `category: "oil_filter"` | Active-winning source record; `officialUrl` updated |

Why it wins:

- `donaldsonProducts` is built from a `Map` keyed by normalized part number.
- The raw source order is `donaldsonBatch1`, `donaldsonPhase3Batch03`, `donaldsonBatchNewA`, `donaldsonBatchNewB`, `donaldsonRfqSkeletonBatch`, then `rawDonaldson`.
- Later entries with the same normalized part number replace earlier entries in that `Map`.
- Runtime aggregate verification for `P559000` returns `title: "Lube Filter, Spin-On Full Flow"` and `category: "oil_filter"`, matching the later `donaldsonBatchNewA` record.

## Updated Products

| Part No. | Old active URL | New URL |
| --- | --- | --- |
| P555461 | `https://shop.donaldson.com/store/en-us/product/P555461` | `https://shop.donaldson.com/store/en-th/product/P555461/20930` |
| X770088 | `https://shop.donaldson.com/store/en-us/product/X770088` | `https://shop.donaldson.com/store/en-th/product/X770088/22949` |
| P554620 | `https://shop.donaldson.com/store/en-us/product/P554620` | `https://shop.donaldson.com/store/en-th/product/P554620/20900` |
| P559000 | `https://shop.donaldson.com/store/en-us/product/P559000` | `https://shop.donaldson.com/store/en-th/product/P559000/21000` |
| P181045 | `https://shop.donaldson.com/store/en-us/product/P181045` | `https://shop.donaldson.com/store/en-th/product/P181045/17808` |
| P181054 | `https://shop.donaldson.com/store/en-us/product/P181054` | `https://shop.donaldson.com/store/en-th/product/P181054/17816` |
| P181064 | `https://shop.donaldson.com/store/en-us/product/P181064` | `https://shop.donaldson.com/store/en-th/product/P181064/17826` |
| P181082 | `https://shop.donaldson.com/store/en-us/product/P181082` | `https://shop.donaldson.com/store/en-th/product/P181082/17842` |
| P181191 | `https://shop.donaldson.com/store/en-us/product/P181191` | `https://shop.donaldson.com/store/en-th/product/P181191/17906` |
| P169478 | `https://shop.donaldson.com/store/en-us/product/P169478` | `https://shop.donaldson.com/store/en-th/product/P169478/16452` |

## NOT_UPDATED

- None. Verified official URLs were available for all approved targets.

## Reverted / Unapproved

| Part No. | Status |
| --- | --- |
| P558615 | Reverted; active URL is again the generated fallback `https://shop.donaldson.com/store/en-us/product/P558615` |
| P554685 | Reverted; active URL is again the generated fallback `https://shop.donaldson.com/store/en-us/product/P554685` |
| P538259 | Reverted; active URL is again the generated fallback `https://shop.donaldson.com/store/en-us/product/P538259` |

## Changed Files

- `data/products/products.donaldson.ts`
- `_audit/donaldson-official-url-fix-batch-1.md`

## Validation

- `git diff --check`: pass
- `.\node_modules\.bin\tsc.cmd --noEmit`: pass
- `npm run build`: pass after rerun with escalation; first sandboxed run compiled successfully but stopped at local `spawn EPERM`

## Git Status

```text
 M data/products/products.donaldson.ts
?? _audit/audit-naming-after-pr25.mjs
?? _audit/audit-naming-after-pr25.ts
?? _audit/audit_source_keyword_scan.txt
?? _audit/current-donaldson-dimension-spec-audit-after-pr24.md
?? _audit/current-donaldson-dimension-spec-audit.md
?? _audit/current-donaldson-generic-title-description-audit-after-latest-naming-pr.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr25.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr26.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr27.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr29.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr30.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr31.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr32.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr33.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr34.md
?? _audit/current-donaldson-generic-title-description-audit-after-pr35-final.md
?? _audit/current-donaldson-generic-title-description-audit.md
?? _audit/current-donaldson-naming-quality-audit-after-pr36-final.md
?? _audit/current-donaldson-official-link-and-spec-completeness-audit.md
?? _audit/current-donaldson-weak-spec-summary-evidence-audit.md
?? _audit/current-product-data-quality-audit.md
?? _audit/current-product-image-crossref-official-link-audit-before-ui-batch2.md
?? _audit/current-ui-batch-2-search-listing-audit.md
?? _audit/current-ui-ux-refresh-audit.md
?? _audit/donaldson-official-url-fix-batch-1.md
?? _audit/needs_fix_closed_products.txt
?? _audit/next10-donaldson-naming-quality-evidence-review-after-pr25.md
?? _audit/next10-donaldson-naming-quality-evidence-review-after-pr27.md
?? _audit/next10-donaldson-naming-quality-evidence-review.md
?? _audit/next10-donaldson-pdf-evidence-audit.md
?? _audit/p502084-duplicate-winner-investigation.md
?? _audit/weak-donaldson-local-pdf-crossmatch.md
?? _audit/weak-donaldson-pdf-manual-review-resolution.md
?? "_audit/\340\270\245\340\270\264\340\270\207\340\270\204\340\271\214\340\270\201\340\270\243\340\270\255\340\270\207-6-\340\270\243\340\270\262\340\270\242\340\270\201\340\270\262\340\270\243.txt"
?? incoming/
```
