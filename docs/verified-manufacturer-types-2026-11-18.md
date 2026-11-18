# Verified manufacturer display types

Baseline: `db9142762a1d2655e87c8ad3c9f5a39210ebce52` (main, PRs #191/#192 included).

This presentation-only lookup is keyed by exact manufacturer and part number.
It does not derive a type from a part code, image shape, category, construction,
or `specifications.Type`. Primary labels and source URLs with review date are
kept in `lib/products/manufacturerType.ts`, separately from catalog data.

| Primary manufacturer label | Active catalog parts |
| --- | --- |
| LUBE FILTER | P554004, P553000, P550520, P502007 |
| FUEL FILTER | P551864, P550440, P551315, P550903, P550958 |
| AIR FILTER | P181080, P784473 |

Each lookup entry retains its public manufacturer source URL. P181080 is
identified directly in P127315's related-part entry. The four lube entries
retain the full source wording `LUBE FILTER, SPIN-ON FULL FLOW` as provenance;
only the primary type is promoted in the interface. Fuel construction/subtype
and P784473 engine/cabin application discrepancies are outside this change.

Search cards, exact autocomplete entries, product headings and quote items use
the verified label. Thai shows a translation alongside the manufacturer's
English label. Existing catalog titles, descriptions, specifications,
construction/type, internal categories, stock, prices and all relations remain
unchanged. Quote persistence, API payloads and notification logic are untouched.
Existing stored quote items also show the verified type after reload.

No blanket brand conversion is applied. MANN wording continues to come from
its existing catalog. P502649's approved coolant copy from #191 is unchanged.
P160473/P160710 are not introduced. P551006 is held pending local visual
verification of private packaging evidence; no P552006 wording is backported.
Private evidence is not included in this repository.

No catalog/index inputs change, so no generated data rewrite is needed.
The checked-in search index was validated with `node scripts/verify-search-index.js`.

## Validation

- Passed: production build using `DATABASE_URL=postgresql://build:build@127.0.0.1:1/build` (unreachable local placeholder; no live DB credentials).
- Passed: `npx tsc --noEmit`.
- Passed: new-file ESLint, verified manufacturer type test, existing product copy test, exact-result/reference-autocomplete test, multi-part search test and search-index validation.
- Existing changed-file ESLint failures: four `react-hooks/set-state-in-effect` errors in quote, product detail and SearchBar; two existing image warnings in ProductCardV2. Equivalent original files from main reproduce the errors. No adjacent cleanup included.
- Existing MANN verification script fails on HU721XKIT/CU31001 dimension-image paths and C 14 200 category; catalog files used by that check are unchanged.
- Passed: 88 browser cases via `node scripts/verify-manufacturer-types-browser.mjs` against a local production server on port 3191: all 11 parts, TH/EN, 390/1440 widths, search/detail add-to-quote, unchanged persisted items on reload, no overflow/page errors and zero RFQ POSTs. Eight additional P502649/MANN controls passed. Only analytics responses are mocked; external requests are blocked. Results and screenshots stay local under `output/playwright/manufacturer-types/`.
- Passed: four additional exact-autocomplete UI checks (TH/EN, 390/1440). Mobile Thai and desktop English product screenshots were visually inspected; existing specifications remain visible.

## Review and deployment boundary

Draft PR only; do not merge or deploy. `vercel.json` disables automatic Git
deployment specifically for `work/verified-manufacturer-types`, including its
initial push. This uses Vercel's documented `git.deploymentEnabled` branch
configuration ([reference](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled)). Other branches retain their existing behavior. No deployment
command or RFQ submission is part of validation.

Concurrent Draft PR #193 changes product-to-quote navigation, not manufacturer
types. This patch does not copy or alter its navigation behavior. Both touch
ProductDetailClient, so review/rebase them together before any future merge.
