# Approved hero implementation — 29 October 2026

Application commit: `d5772ff` (following `fa0d363` and `7a4105c`). Existing draft PR #179 only. No production deployment or merge.

## Changes

- Installed the exact owner-supplied desktop (149,394 bytes) and mobile (111,668 bytes) WebP binaries under `public/images/hero/`. Owner permission is recorded in the request; imagery does not assert an actual MRT employee or facility.
- Replaced the provisional product collage with one responsive picture, desktop technician right/content left, portrait mobile crop and dark contrast gradient. The existing SearchBar, example queries, analytics and tracked LINE links remain.
- Preserved five actual catalog category entries, Donaldson/MANN-FILTER/NTN, audience assistance, nameplate support, both existing articles and contact channels.
- Corrected TH/EN workflow to Search → Add items to RFQ → Submit Request for Quotation.
- Mobile RFQ remains in the header; reduced hero top spacing and made cookie decisions horizontal with 44px buttons to keep search and LINE accessible. Consent text and behavior remain unchanged.

## Validation and evidence limits

- TypeScript validation and focused ESLint passed. Final Next.js production build passed, generating 3,210 pages. The local checkout resolves installed Next.js 16.2.3 from parent dependencies; package files were not changed. Vercel uses its own locked dependency installation.
- PNGs in this folder are fresh **local production-build** browser captures, not Vercel captures. Older images in the parent directory are stale and are not acceptance evidence for this implementation.
- Matrix: 1440 TH/EN, 1024 TH, 390 TH/EN, 360 TH, 430 TH; full-page and consent state, mobile first viewport, desktop/mobile suggestions. `results.json` contains measured overflow, selected responsive image, link destinations and navigation observations.
- Vercel Preview requires Authentication. A fresh Playwright browser was redirected to Vercel Login. The connected browser host was unavailable. No authentication protection was disabled. Thus Vercel rendered visual acceptance remains **pending**, regardless of successful deployment/build status.
- No real RFQ or customer message was submitted. RFQ pre-submission and full cross-reference regression on Vercel remain pending.
- Existing SearchBar Escape handling can synchronize the draft back to the URL query; retest this under Issue #180. Search algorithms and contracts were not modified.

## Visual comparison

The implementation retains the approved navy industrial hero, orange headline/search accent, corporate navigation and category-first flow. It intentionally uses verified catalog photographs and five categories rather than the mockup's invented hydraulics/pneumatics selection. Brand presentation is limited to the three existing core brands. Existing useful assistance and knowledge sections make the page longer than the static mockup. Shared controls retain their existing tokens and rounded treatment. This is implementation progress, not a claim of pixel equivalence or owner acceptance.

## Follow-up design rollout

After homepage acceptance, apply existing navy/blue/orange tokens, heading scale, 44px controls, card/image proportions and spacing incrementally: Products/Search (coordinate Issue #180) → Product Detail → Brands → RFQ → Articles → Contact. Use focused PRs and TH/EN responsive screenshots per page; retain evidence labels, RFQ contracts and analytics semantics. No global CSS redesign is included here.

Final application `d5772ff`: Vercel commit status **success**, deployment inspector https://vercel.com/tuckys-projects/mrt-supplier-web-clean-lfcm/98b7dX3q5Z5YmDhDSa1TKjn9cTn8 . Branch Preview: https://mrt-supplier-web-clean-lfcm-git-growth-h-e85399-tuckys-projects.vercel.app/th (authentication required; rendered final deployment not independently inspected).

Local results: no horizontal overflow across all seven viewport/language cases; correct desktop/portrait source selection; all rendered LINE links use https://lin.ee/PsQGAuu . A fresh search submits to `/th/products?q=P181`; RFQ page opens without submission (`functional.json`). The matrix's post-Escape search stays on the homepage because the existing draft synchronization clears the query: this is a recorded functional limitation, not a passing navigation test. `capture-local.cjs` is a reproducible capture utility, run from the checkout root with the built site on port 3100. No dependency additions.
