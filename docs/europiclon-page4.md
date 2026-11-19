# Europiclon page 4: approved direct cross-references

Base: main `11876f7177ca05bc20321683a50099e23a2e5a44` (includes #193).
Related earlier work: merged #120/#121. No same open Europiclon work was found.
This branch does not include or modify #194 product labels or #195 landing work.

## Evidence and scope

[Donaldson F111409 ENG (3/21), page 4](https://www.donaldson.com/content/dam/donaldson/engine-hydraulics-bulk/literature/north-america/air/F111409-ENG/Air-Filters-for-Mann-Hummel-Europiclon.pdf#page=4), specifically the 19 Primary and 9 Safety cross-reference rows.
Boss approved this page on 2026-11-19. The Library page-4 extraction was read;
the publisher PDF was downloaded and page 4 rendered and visually checked
against its row/column layout. The local Library transfer helper failed on
Windows because `os.setxattr` is unavailable; the fallback used the exact
public manufacturer URL supplied by Boss, not a guessed storage URL.

Publisher PDF: 270281 bytes; SHA256
`66db19a4ae4cfed9aa826bb73793073b1361d342de08aeb8eac416820b21b47d`.
Binary identity with the Library copy was not independently verified. Both
page-4 table text and the rendered publisher page agree with the recorded rows.
No graphics, PDF bytes, marketing prose or data from pages 1-3 are committed.

Only direct Donaldson-to-column-brand edges are applied. MANN-FILTER catalog
identities correspond to the source's Mann+Hummel column. Published reference
codes are retained; existing product part numbers are not renamed. Matching
uses the repository's case/space/slash/hyphen normalization. There is no
competitor-to-competitor expansion, transitive equivalence, new primary/safety
pair, housing assumption, machinery application or product/stock creation.
DBA5207 is not a competitor cross-reference. Existing independently sourced
pairs, applications and unrelated references are preserved.

## Counts and holds

| Unit | Count |
| --- | ---: |
| Source rows | 28 (19 primary, 9 safety) |
| Published direct Donaldson/competitor pairs | 125 |
| Already represented by at least one active endpoint | 24 |
| Newly represented pairs | 30 |
| Held pairs without an active endpoint for that pair | 71 |
| Applied pairs | 54 |
| Directed catalog records | 64 (34 existing, 30 new) |
| Existing products receiving provenance/canonical relations | 24 |
| Products before/after | 798 / 798 |
| Rows with no active endpoint at all | 14 |

Four additional rows have an active MANN endpoint but no active Donaldson
product: P778989/C15300, P782106/C308103, P780030/CF300 and P782107/CF610.
Only their direct Donaldson reference is exposed from the existing MANN
product; the other competitor edges stay held. The other 14 rows and all held
codes remain factual source records for later review, without fabricated SKUs.
Full row status and field-level differences are in `europiclon-page4-audit.json`.

Existing matching legacy strings are canonicalized to one structured,
verified cross-reference; duplicated matching `refs` entries are removed.
Prior evidence/note/source URL and approval details are retained where present.
Explicit rejected/hidden or contrary relationship-type decisions are held by
the applicator rather than overwritten (synthetic conflict controls tested).
No such blocking relationship decision was found among the applied edges.

## Dimensions: preserved, not updated

All product fields outside `refs`/`crossReferences` are deep-compared against
main, including specifications, stock, prices, application data and pairs.
The page's dimensions were treated only as Donaldson evidence for review.
Nothing was copied to MANN or another brand, and P782937 has no dimension row.

The audit found 7 rounding/precision differences (kept), one ambiguous
Length/Overall Length case (P778972), and 15 conflicting fields across:

| Donaldson part | Fields needing separate review |
| --- | --- |
| P778984 | Length |
| P778994 | ID, Length |
| P782104 | ID, OD, Length |
| P782105 | ID, Length |
| P780024 | ID, OD, Length |
| P780036 | ID |
| P782109 | ID, OD, Length |

All current values remain intact. The JSON audit records both values rather
than silently treating source precision or dimension semantics as corrections.

## Generation and validation

The ordinary generator would also refresh stale specifications on 8 unrelated
indexed products. The optional `--relations-only` mode preserves every existing
document field except refs/crossReferences, then rebuilds maps with stable key
order. Default generator behavior is unchanged. Exactly 20 indexed documents
change, exclusively in relationship arrays; source metadata-only changes on
four other products do not alter their search-document content.

```text
npx tsx scripts/build-search-index.ts --relations-only
EUROPICLON_PAGE4_TEXT=<local page-4 text> npx tsx scripts/verify-europiclon-page4.ts
node scripts/verify-search-index.js
npx tsc --noEmit --incremental false
npx eslint data/products/europiclon-page4.ts scripts/build-search-index.ts scripts/verify-europiclon-page4.ts scripts/verify-europiclon-page4-browser.mjs
npm run build
node scripts/verify-europiclon-page4-browser.mjs
```

The exhaustive validator compares all 28 source rows against actual PDF page-4
text when supplied, then checks every active directed edge against the final
catalog and generated index. It also checks idempotence, canonical dedupe,
contrary-decision holds, complete non-relation data preservation and forward/
reverse searches including C14200/P778984, CF200/P780024, LAF8749 and RS3943.

Passed: production build, nonincremental TypeScript, scoped ESLint, all 28
source-row comparisons, all 64 active directed edges in catalog/index,
idempotence, conflict controls, immutable non-relation data, generated-index
validation and the existing exact-result/reference-autocomplete regression.
Local built-app UI passed 48 checks: 32 searches and 16 product reference
tables across TH/EN and desktop 1440/mobile 390, with no page errors, horizontal
overflow or RFQ POSTs. Primary mobile Thai and safety desktop English images
were visually inspected. Local results/screenshots are under
`output/europiclon-page4/browser/`.

UI exact-part prioritization is preserved: C14200 shows the existing MANN
C 14 200 product, and P778984 shows the Donaldson product. The broader search
function and both product tables establish the two directions; the UI is not
changed to show cross-reference alternatives ahead of an exact product.
Non-catalog competitor IDs LAF8749/RS3943 resolve to their correct Donaldson
rows. Queries P778989/P780030 resolve to the existing MANN products without
creating missing Donaldson SKUs. Primary/safety negative search controls pass.

Known pre-existing broad checks: cross-reference-single-source still reports
28 legacy overlaps outside the approved direct edges (36 unique overlaps in
the baseline; no new overlap). Cross-reference-governance hardcodes 478 products
and fails against the unchanged baseline/current total of 798. Those tests and
unrelated data were not modified to hide the failures.

## Approval boundaries

Draft PR only. No merge, promotion, remote environment-variable change or
deployment. `vercel.json` disables automatic deployment only for
`work/europiclon-page4`. Canonical project remains `mrt-supplier-web-clean-lfcm`.
Local builds use an inert localhost database placeholder, never live credentials.
Browser QA blocks all RFQ/quote POST aliases and external requests, and mocks
analytics only. Live Vercel Preview and production verification require their
separate approval gates and are not claimed here.
