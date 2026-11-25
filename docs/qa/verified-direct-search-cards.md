# Verified direct cross-reference cards

Checked 2026-11-25. Base main: `11876f7177ca05bc20321683a50099e23a2e5a44`.
Canonical Vercel project `mrt-supplier-web-clean-lfcm` production read reported
READY deployment `dpl_dyJ3gDkRmEKfiYhiajvpBJZfXV3B`, release
`cce01165dfcfbc8350cff64b4ed2018a5df1f5a3` on
`release/mrt-stock-verified-2026-11-21`. That release differs from main only in
the confirmed-stock overlay, its application and verifier. An ephemeral test
applying that exact overlay also passed C20500/P778994 in both directions.

Open drafts #194 (types), #195 (landing), #196 (Europiclon data) were inspected
and left untouched. The separate `codex/five-available-products` branch was
also inspected and not imported. This repair starts from main in an isolated
worktree, `D:/Temp/mrt-verified-direct-search`, branch
`fix/verified-direct-search-cards`.

## Behavior and boundaries

Before: C20500 returned only C 20 500; P778994 returned only P778994.
After: each exact card stays first, followed by the other existing active
product with its own brand, title, specifications, image, detail link and Quote
identity. The added card identifies a cross-reference match to the query.

The search expands only one direct, explicitly branded `equivalent` edge
whose normalized status is verified under the repository's existing evidence
and approval rules. It checks either stored direction, preserves source
evidence and orients RFQ context to the searched endpoint. Explicit hidden or
rejected copies veto that edge. No replacement reversal, companion/primary-
safety inference, transitive traversal, missing-product construction or legacy
string promotion is added. Existing non-core stock ranking behavior is
preserved outside this verified-card case; result limits still apply.

No catalog, index, prices, stock, dimensions, applications, compatibility,
cross-reference data, RFQ contracts or notification paths changed. The test
also checks catalog JSON byte equality before/after search. No mapping import
was necessary: C 20 500 already carries its approved direct Donaldson P778994
edge in `products.mann.ts`.

## Published Donaldson/MANN coverage

The audit enumerates and deduplicates all normalized verified equivalent
Donaldson/MANN edges from canonical refs and crossReferences: **27 pairs**.
**16 pairs have both active endpoints; all 32 directional checks now pass**
(0/32 passed the exact-first plus separate-counterpart criterion before).
For 22 directional cases an incoming normalized-part edge existed but focus
filtering removed the card. Ten cases had only the opposite stored direction;
these are direct symmetric equivalences, not missing approved mappings.

**11 pairs have absent endpoints** and receive no fabricated card:
P551426/WK8113, P550318/W920/7, W 940/5/P559418, CF 610/P782107,
C 30 810/3/P782106, WD 962/P550230, P551065/WK1060/3X,
P556745/WK8106, P550939/W962/21, C1140/P784578,
TB1394/1X/P951413. Similar-looking codes are not normalized into other models.

This is a current published-data eligibility audit, not a fresh claim that
every historical source has been independently revalidated. The focused
Donaldson publication was independently checked for the Europiclon cases.

## Manufacturer page-4 examples and held cases

Source: [Donaldson F111409 ENG (3/21), printed page 4](https://www.donaldson.com/content/dam/donaldson/engine-hydraulics-bulk/literature/north-america/air/F111409-ENG/Air-Filters-for-Mann-Hummel-Europiclon.pdf#page=4).
Rows below count separately from 1 within each primary/safety cross-reference
table. All ten pairs are directly printed in that table, not transitive.
MANN part-number spacing follows the active catalog where present.

| Donaldson | MANN-FILTER | Role / row | Draft search eligibility |
| --- | --- | --- | --- |
| P778972 | C 16 400 | Primary 1 | Displayable, existing verified edge |
| P778984 | C 14 200 | Primary 3 | Held: missing verified published edge |
| P778994 | C 20 500 | Primary 5 | Displayable, existing verified edge |
| P782104 | C 23 610 | Primary 6 | Displayable, existing verified edge |
| P782105 | C 25 710/3 | Primary 7 | Displayable, existing verified edge |
| P780012 | CF 400 | Safety 1 | Displayable, existing verified edge |
| P780024 | CF 200 | Safety 3 | Held: missing verified published edge |
| P780036 | CF 500 | Safety 5 | Displayable, existing verified edge |
| P782108 | CF 710 | Safety 7 | Displayable, existing verified edge |
| P782109 | CF 810 | Safety 8 | Displayable, existing verified edge |

Across all 28 Donaldson/MANN source rows: 8 eligible published pairs, 2 pairs
with both endpoints but no verified edge, 18 rows missing at least one endpoint.
The two missing-edge cases remain in the separate data review (#196); no
other page-4 rows are imported here. No primary/safety pairing or machinery
fitment claim is made, and no dimension is edited.

## Verification

Passed:

- `npx tsx scripts/verify-verified-direct-search.ts`: normalized queries,
  exact first, both directions, dedupe, limits, RFQ metadata, all published
  active pairs, catalog immutability; negative legacy/pending/unapproved/
  wrong-brand/hidden/rejected/replacement/companion/size/transitive/absent cases.
- Existing exact-result/reference-autocomplete, MRT priority, multi-part,
  brand-prefix, RFQ bulk-entry and dimension-search verifiers (537 dimension
  round trips).
- `npx tsc --noEmit --incremental false`; production build (3210 pages).
- Scoped ESLint: zero errors; two existing ProductCardV2 img warnings.
- HTTP product slash/SEO route regression: 60 products, 151 checks.
- Actual product-results pages for all 16 active published Donaldson/MANN
  pairs, both directions in TH/EN: 64 checks passed at desktop width, exact
  first and one counterpart card each.
- Local production-build UI, actual Search input/Enter: 16 query cases,
  TH/EN at 390/1440px; exact card first, unique branded counterpart and
  localized cross-reference badge, no horizontal overflow. Both detail pages
  retain identity and canonical links. Both cross-reference directions add
  the correct product and source context to Quote, persisted across reload.
  All browser API POSTs were intercepted during the final run; zero RFQ POST
  attempts. External HTTPS browser traffic was blocked. Four screenshots are
  retained locally under `output/verified-direct-search/`.

Known baseline failure: `verify-rfq-reference-context.ts` fails its line-41
deep equality because existing merge output contains `growth: undefined`.
Its imported RFQ modules and that test are unchanged from main. It does not
import the modified search or card modules. No unrelated fix was made.

One earlier browser attempt saw a hydration error while resetting reused
local storage; the completed final 16-case run passed. Initial analytics GET/
POST handling before isolation reached only the dummy local database and
could not persist; no production database or notifications were configured.

Remote Preview and production acceptance of this patch are **not run**:
deployment is intentionally disabled for this branch in `vercel.json` before
first push. No merge, deployment, promotion, project settings/environment
change or actual RFQ submission is part of this draft.
