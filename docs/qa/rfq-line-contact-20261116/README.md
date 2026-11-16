# RFQ / LINE / contact batch QA — 2026-11-16

Base: `1c84a275e3b4b6dfa4e4e0f26ff3b05e5d360cd9` (main, PR #188). Isolated branch: `work/rfq-bulk-line-clarity`. PR #187 is retained; PR #186 is excluded. Original checkout edits were left untouched.

## Resulting behavior

RFQ bulk entry now uses the existing `/api/search/multi-part` read-only lookup and review UI. Existing search logic in `lib/search/search.ts` resolves `2P4004` to the stored `P554004` cross-reference. Exact products and reference suggestions have different labels. Reference searches retain the entered customer number in existing RFQ metadata, quote storage and copied LINE text. This does not certify compatibility. Multiple candidates (e.g. `FS1006`) are displayed and block adding until the customer edits the list; unknown numbers remain explicit manual requests. No catalog mappings were added.

Legacy RFQ bulk quantity syntax remains supported: `part x 2`, `partx2`, comma, tab, `part - 2`, and trailing quantities. Known spaced catalog numbers are preserved. Rows containing only part numbers default to 1; quantities remain directly editable later. Repeated lines merge quantities; repeated clicks on the same added results are disabled. A deliberate new lookup can add another batch and retains reference context.

Unknown-product help now presents product identifiers and contact methods first, with brand, application, dimensions and thread detail in a native disclosure. All original field IDs and validation remain. Dimension-prefilled enquiries expose the details. Website RFQ and LINE are separate actions: the former creates an RFQ number; the latter requires the customer to copy, paste and send. Desktop copy stays on the same computer; phone QR scanning does not transfer that clipboard. The existing OA link and `@mrtsupplier` remain.

Contact changes: Thai address-block legal name is `บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด`; English name and address/contact values remain. The email card retains `mailto:sales@mrtsupplier.com`. Its separate copy button announces success or a manual-copy fallback in TH/EN. The footer address is a mailto link. No provider or OS configuration was changed.

## Exact source files

| File | Purpose |
| --- | --- |
| `app/[locale]/quote/page.tsx` | Responsive desktop/mobile LINE instructions |
| `components/quote/BulkAddToQuote.tsx` | Reuse reviewed multi-part entry with legacy RFQ parser |
| `components/search/MultiPartNumberSearch.tsx` | Shared rendering, quantity hint and accessible textarea label |
| `hooks/useMultiPartSearch.ts` | Move existing search orchestration into a hook; stale-response and repeated-add guards |
| `lib/search/bulkPartInput.ts` | Preserve existing bulk quantity formats and known spaced numbers |
| `components/products/MissingProductRequestForm.tsx` | Reorder essentials; disclose optional details without removing fields |
| `lib/i18n/missingProductUi.ts` | Localized disclosure label |
| `lib/i18n/rfqUi.ts` | Separate website submission from manual LINE sending |
| `lib/i18n/lineContactUi.ts` | Shared QR/clipboard and non-submission clarification |
| `app/[locale]/contact/page.tsx` | Thai legal name, preserved mailto and separate copy fallback |
| `components/contact/CopyEmailButton.tsx` | Local clipboard state and localized success/failure announcements |
| `components/layout/SiteFooter.tsx` | Keyboard-accessible footer mailto |
| `scripts/verify-rfq-bulk-entry.ts` | Catalog parity, reference metadata, ambiguity, unknown, deployed exclusion and quantity regression checks |

This directory contains supporting QA evidence only. No catalog, schema, API persistence/notification/security, tracking, package/lockfile or deployment configuration was changed.

## Checks

- PASS: clean `npm ci --no-audit --no-fund` using the committed lockfile; no dependency-file edits.
- PASS: final `npm run build` with `DATABASE_URL=postgresql://local:local@127.0.0.1:9/local` (unreachable local-only placeholder). All 3,210 static pages generated; no production database credentials used. Initial build without any database URL failed at existing Prisma construction; placeholder build passed.
- PASS: final `npx tsc --noEmit`.
- PASS: focused ESLint for new hook/parser/component/test and modified localized copy/contact page.
- PASS: `npx tsx scripts/verify-rfq-bulk-entry.ts`.
- PASS: `npx tsx scripts/verify-multi-part-search.ts`.
- PASS: `npx tsx scripts/verify-search-exact-results-and-reference-autocomplete.ts`.
- PASS: source `git diff --check`; all original missing-product field IDs retained.
- LEGACY FAILURE: `npm run lint` invokes removed `next lint` behavior and reports an invalid `.../lint` project directory. Direct ESLint on source reports **144 errors / 27 warnings**, identical to an unchanged-main archive with the same clean dependencies. This includes the unchanged missing-product `setState` effect.
- LEGACY FAILURE: `npm run verify:search` points at missing `scripts/verify-search-score.ts`.
- LEGACY FAILURE: `scripts/verify-rfq-reference-context.ts` fails an object deep equality due to `growth: undefined`; reproduced on unchanged main. The new focused test and browser checks validate actual customer-number retention separately.

## Browser evidence

Real Chromium via Playwright CLI, localhost only, TH/EN at 1440×900 and 360/390/430×900. These are resized browser viewports, not physical-device acceptance. External requests were blocked; API write endpoints were intercepted. Optional-field payload checks used an intercepted local request with a synthetic error response; nothing was persisted or sent.

All eight locale/width combinations passed: exact/reference/multiple/unknown results; repeated lines and deliberate repeated batches; disabled duplicate Add click; edit invalidation and a deliberately delayed stale response; direct quantity editing and reload persistence; original reference number and quantity in copied summary; correct OA href, visible ID and responsive instructions; optional values retained across disclosure collapse, captured in mocked payload; contact and product validation; zero quantity blur correction; no horizontal overflow.

Contact QA separately passed all eight combinations: retained email-card and footer mailto targets; correct legal name; clipboard success, rejected write and unavailable API; Tab/Enter/Space operation; live feedback; `type="button"` and no synthetic form submission. No mailto link was activated and no email was sent. Initial extra validation run clicked before hydration; rerun waits for network idle and passed. A prior screenshot attempt was interrupted by Fast Refresh while files were being written; the settled final matrix passed.

[Machine-readable run results](results.txt). Reproduction snippets are `browser-check.txt`, `contact-check.txt`, and `extra-check.txt`, loaded through `playwright-cli run-code --filename` on a safe local app. They block external access / write endpoints and use only QA data. Do not run against production.

Selected rendered evidence:

- [Exact/reference/ambiguous/unknown desktop](results-en-1440.png), [Thai mobile](results-th-390.png)
- [Desktop LINE instructions](line-en-1440.png), [Thai mobile instructions](line-th-390.png)
- [Clean desktop help form](form-clean-en-1440.png), [Thai mobile help form](form-clean-th-390.png)
- [Thai clipboard success and keyboard focus](email-success-th-390.png), [English clipboard failure](email-failure-en-1440.png)
- [Thai legal-name/address block](address-th-390.png), [English address block](address-en-1440.png)

## Remaining acceptance limits

No merge, auto-merge, manual deployment, production write, real RFQ submission, email or LINE message was performed. Native mobile LINE launch/paste/send and OS mail-client association remain unverified. The QR continues to identify the OA; a QR containing prefilled RFQ text was not implemented. Production runtime/notification routing was not exercised. Existing repository lint/reference-script failures remain outside this batch.

Preview status will be reported against this branch SHA and project `mrt-supplier-web-clean-lfcm`. A canceled/ignored build is not successful Preview QA; no configuration will be changed to force a Preview. Boss retains separate merge/deploy approval.
