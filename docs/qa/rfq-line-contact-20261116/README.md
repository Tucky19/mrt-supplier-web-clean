# RFQ / LINE / contact batch QA — 2026-11-16

Base: `1c84a275e3b4b6dfa4e4e0f26ff3b05e5d360cd9` (main, PR #188). Isolated branch: `work/rfq-bulk-line-clarity`. PR #187 is retained; PR #186 is excluded. Original checkout edits were left untouched.

## Resulting behavior

RFQ bulk entry now uses the existing `/api/search/multi-part` read-only lookup and review UI. Existing search logic in `lib/search/search.ts` resolves `2P4004` to the stored `P554004` cross-reference. Exact products and reference suggestions have different labels. Reference searches retain the entered customer number in existing RFQ metadata, quote storage and copied LINE text. This does not certify compatibility. Multiple candidates (e.g. `FS1006`) are displayed and remain addable as the original number for team review, without choosing a candidate; unknown numbers remain explicit manual requests. No catalog mappings were added.

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

## Review corrections

Examples now contain only one Part Number per line in TH/EN; quantities are adjusted later, while manually entered legacy quantity syntax remains supported. Ambiguous rows no longer block the batch. For the mixed input `P551315 x 2`, `2P4004`, `FS1006 x 4`, `FS1006,2`, `UNKNOWN-TEST-001`, Add all keeps all four rows: exact quantity 2, reference quantity 1 with original search number, manual `FS1006` quantity 6, and unknown quantity 1. None of the three FS1006 candidate product numbers is substituted. Responsive TH/EN checks at all four widths passed after this correction; the recorded browser snippet and mixed-results screenshots are updated. Ambiguous-only default quantity 1, repeated manual additions and reload persistence also pass at all eight combinations. [English part-only examples](examples-en-1440.png), [Thai part-only examples](examples-th-390.png). Supplementary reproduction: `corrections-check.txt`. Final build, TypeScript and focused lint passed after these corrections.

## Verified business-map pin

The Contact page iframe now uses `https://www.google.com/maps?cid=12083572000753456527&output=embed`; its external link uses `https://www.google.com/maps?cid=12083572000753456527`. This is exactly the supplied verified business identifier. Product code changes for this follow-up are limited to those two URL replacements in `app/[locale]/contact/page.tsx`. No address/contact data, coordinates, layout, or Google Maps business data was edited.

PASS: final build with the localhost-only database placeholder, TypeScript, Contact-page ESLint, and patch whitespace checks. Real Chromium TH/EN checks passed at 1440/360/390/430 widths: exact iframe/link URLs, localized accessible iframe title, existing 430px desktop / 320px mobile map heights, keyboard focus, and no horizontal overflow. Unlike the earlier isolated clipboard tests, these checks allowed read-only Google Maps loading. All eight embeds loaded Google's embed URL carrying the same CID. Rendered desktop/mobile images display the business marker.

The external Open in Google Maps link was activated once in a new tab and displayed `บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด`, its existing address and `mrtsupplier.com`. No save, edit, review, listing-management or other write action was taken. Google displayed its limited-view notice; native phone Maps-app launch and full interactive Maps functions were not tested. The text-only web reader could not access the Maps URL, but the real browser successfully displayed the embed and listing.

[Desktop business-pin embed](map-en-1440.png), [Thai mobile embed](map-th-390.png), [external business listing](map-business-link.png), [run results](map-results.txt). Reproduction: `map-check.txt`. No merge or production deployment; the same draft PR remains the review target.

## Manual-request labels after language switches

Reviewed remote draft head `093f26334026e0e147b9d4e481289ddc94c2d95e` before this fix. Manual items store their creation-language label in `brand`; rendering that field directly caused the stale-language display. The only product-code change is the quote-card label in `app/[locale]/quote/page.tsx`: `manual:` items display the existing `text.manualRequest` for the current locale; catalog products continue displaying their stored brand/title. No saved data, provider, payload, catalog, or API behavior was changed, and no migration is performed.

PASS: build with the same localhost-only database placeholder; TypeScript; patch whitespace. The affected page retains its existing `react-hooks/set-state-in-effect` lint error at line 131, reproduced identically on unchanged main. The old local dev server had stopped before the first browser attempt; after restarting it, all final browser scenarios passed.

Real Chromium passed TH→EN→TH and EN→TH→EN at 1440/360/390/430 widths. Each scenario adds an unknown request (qty 2), ambiguous `FS1006` (qty 3), exact catalog control `P551315` (qty 4), and reference `2P4004`. Assertions cover both manual labels, preserved legacy saved source-language labels, unchanged catalog brand, byte-identical localStorage before/after switching/reload/roundtrip, unchanged copied RFQ text, preserved quantities/reference metadata, and no horizontal overflow. All write endpoints were blocked; no RFQ or message was sent. These checks are local browser evidence, not hosted Preview acceptance.

[Thai-created request displayed in English on mobile](locale-th-to-en-390.png), [English-created request displayed in Thai on desktop](locale-en-to-th-1440.png), [run results](locale-results.txt). Reproduction: `locale-check.txt`. The updated head and Preview status are recorded in the draft PR; no merge or deployment is authorized.

## RFQ clipboard diagnosis and failure handling

Inspected remote head `28055a508fe8f0299604ab38830fc5b8009897ee`. The RFQ copy handler was unchanged from main at that head. It awaited `navigator.clipboard.writeText` before showing Copied, but had no catch or failure message. A rejected write produced an unhandled error and no feedback; a previous success could remain visible until its old timer expired. This is an existing app defect, not a proven regression introduced by earlier PR #189 edits.

### Native behavior versus automation

Before changing code, a fresh headed Chromium session confirmed the clipboard implementation was native (no navigator override and `writeText` reported native code). The real contact Copy email button put `sales@mrtsupplier.com` on the clipboard. The real RFQ Copy button then replaced it with the exact RFQ text: known part/quantity, `P554004` with original `2P4004`, and the unknown part/quantity. Trusted Ctrl+V pasted that text. Independent Windows `Get-Clipboard` matched after CRLF/LF normalization and was not the old email. An initial raw string comparison failed only because of Windows newline normalization; it was not evidence of a stale clipboard.

A separate controlled negative test replaced `writeText` with an async no-op. The app displayed Copied while actual Ctrl+V still pasted the prior email. This reproduces the *symptom* when automation reports a successful write without performing one. It does **not** prove that the hosted QA session used such an override. The earlier QA snippets using clipboard stubs verified payload construction and feedback only; they did not establish OS clipboard contents. The final native tests below supersede that limitation.

The correct `mrt-supplier-web-clean-lfcm` deployment for `28055a5` was canceled by Ignored Build Step. The separate similarly named project's READY deployment for the same SHA was identified, but fresh-browser access redirected to Vercel login. No authentication bypass, permission/configuration change, or deployment was performed. The exact cause of the reported hosted stale-email event remains **unconfirmed**.

### Narrow app fix

Product files changed only:

- `components/ui/CopyButton.tsx`: explicit pending/success/failure state, catch rejected/unavailable clipboard writes, clear the previous success timer before retry, disable duplicate pending clicks, and polite live feedback. Copied is shown only after the API resolves. No clipboard read permission or deprecated fallback was introduced. An optional failure label keeps the other caller's existing labels compatible.
- `lib/i18n/rfqUi.ts`: localized RFQ failure/retry label.
- `app/[locale]/quote/page.tsx`: pass that failure label to the existing button.

The app cannot establish real clipboard contents if a test double falsely resolves a write; test native paste/readback instead. The fix addresses verified failure handling and does not claim to solve an unconfirmed hosted/browser issue.

### Final checks

PASS: build with the localhost-only placeholder, TypeScript, focused ESLint for the shared button and copy strings, patch whitespace. Real Chromium TH/EN at 1440/360/390/430 passed native email→RFQ copy and trusted Ctrl+V with exact payload; controlled rejected/unavailable/pending failures; no stale Copied on failure; old timer cannot erase the failure; retry by Enter/Space; polite feedback and non-submit button; unchanged saved quote data; no horizontal overflow and zero unhandled clipboard errors. Success tests used the native API, while only failures were injected. The final Windows clipboard matched the RFQ after newline normalization. Native Part No. copy/paste on the existing product-detail caller also passed in TH/EN.

No RFQ, email or LINE message was submitted. Actual hosted acceptance and an actual user-browser permission-denial scenario remain unverified; permission failures were safely injected without changing browser/OS settings.

[Native success desktop](native-copy-success-en-1440.png), [Thai mobile success](native-copy-success-th-390.png), [failure desktop](native-copy-failure-en-1440.png), [Thai mobile failure](native-copy-failure-th-390.png), [results](clipboard-results.txt). Reproduction: `native-copy-check.txt`, `copy-diagnosis.txt` (pre-fix diagnosis/negative control), `clipboard-regression.txt`, and `product-copy-control.txt`.
