# PR #179 QA — 28 October 2026

## 29 October 2026 — owner-approved layout polish (preview-only)

**Current application commit:** `d2319e3` (following `31d9666` and `5798349`). These three changes refine layout on top of `c41a2e4` while preserving the existing search, cross-reference, RFQ, LINE OA and tracking implementations.

- `31d9666`: Reduce excess blank space before mobile categories; place five category cards in a balanced 2-column composition by rendering the final odd card horizontally on small screens.
- `5798349`: Add a real, keyboard-focusable "ดูหมวดสินค้า / Explore" anchor in the responsive industrial-catalog Hero so visitors can discover categories without a second competing search box.
- `d2319e3`: Offset the category anchor for the sticky header, and use an explicit responsive card minimum height.
- No new customer reviews/ratings, supply or delivery-time guarantees, fabricated cross references, or fictitious employee/factory images were introduced.
- The Hero still uses **existing catalog product imagery**, NOT the desired rights-cleared technician photo. Visual fidelity to the owner's chosen industrial reference remains **unaccepted**.

**QA gate:** The 10 screenshots linked later in this report were captured from older `f710db4` and MUST NOT be presented as screenshots of `d2319e3`. Before any production release, capture and inspect fresh TH/EN desktop (1440px, 1024px) and mobile (360px, 390px, 430px) views, with and without cookie consent, and run real interactions for search suggestions/keyboard, sample part chips, LINE link, and RFQ without customer submission. Check mobile section rhythm, last card height, touch target clearance and no horizontal overflow. Record the Vercel build status separately; CI success is necessary but not proof of visual acceptance.

**Release gate:** Keep PR #179 draft; owner must see and approve the rendered Preview before any merge or production deployment. Rights to the existing catalog product photos and a future approved industrial-hero asset remain outstanding.

---

**Overall: NOT accepted for production.** Functional preview is ready. The approved Design 1 comparison image and licensed technician asset are missing, and repository-wide ESLint still fails its existing baseline. No merge or production deployment was performed.

## Preview and source

- Tested application commit: `f710db4ec29ccd5fd90fe2acd50dfa32b0ed18fe`, branch `growth/homepage-cro-v2`.
- [Thai preview](https://mrt-supplier-web-clean-lfcm-c6yamawjy-tuckys-projects.vercel.app/th) / [English preview](https://mrt-supplier-web-clean-lfcm-c6yamawjy-tuckys-projects.vercel.app/en).
- [Branch preview](https://mrt-supplier-web-clean-lfcm-git-growth-h-e85399-tuckys-projects.vercel.app/th).
- Vercel: Ready; normal `npm run build` completed, including 3,210 generated pages. Vercel Authentication remains enabled: reviewers need authorized project access or an owner-provided share link. No protection settings were changed.
- Commit `0ff3469` was unavailable locally and through GitHub's commit API. Recreated the requested work as `1d9bd8f`, followed by stacking fix `2b65bbb` and mobile consent-spacing fix `f710db4`. No history rewrite.

## QA results

| Check | Result | Evidence / limits |
| --- | --- | --- |
| Desktop 1440×1000 | Pass for implemented layout | Navy/orange hero, primary search, secondary RFQ, categories immediately after hero; no horizontal overflow. |
| Mobile 390×844 | Pass | Headline, search, verified part chips and LINE fit first viewport. RFQ accessible in header; menu opens/closes. Chrome viewport emulation, not physical-device testing. |
| Fresh cookie consent | Pass | Search visible; hero LINE 44px target at y=435.66–479.66 receives pointer hits while consent is open. Consent behavior/copy unchanged. |
| Design 1 technician composition P2 | **Fail / asset required** | Explicitly labeled provisional graphic replaces duplicated product images. No technician or exact Design 1 reference is available; no visual/pixel acceptance claimed. |
| Category sequence P2 | Pass | Hero → Air → Oil → Fuel → Hydraulic → Bearings, before trust/audience/workflow. Cards link to category searches. |
| Product imagery / rights | Partial | Existing catalog photos P181080, P558615, P551864, P550148 and existing bearing photo all render. Existing repository use does not independently prove licensing; owner must confirm rights. No generated/stock technician introduced. |
| Dropdown / View all | Pass | P55 suggestions extend over category cards. Desktop/mobile pointer hit tests pass; actual View all click navigates to products?q=P55. Hero stacking context now has z-index with overflow allowed. |
| Keyboard / focus | Pass | ArrowUp→Enter selects View all; results route preserves input focus. Escape closes dropdown. |
| Known-part search / quote | Pass | P181080 chip opens exact result and adds to local quote/header count. Search scoring, cross-reference logic and analytics implementation unchanged. |
| Multi-part RFQ | Pass before submission | P551864 ×2 and FS1242 ×3 yield two rows with correct quantities on final Preview. TH/EN forms render on desktop/mobile. No real submission or notification sent. |
| LINE OA | Pass | Owner PR instruction confirms https://lin.ee/PsQGAuu. Live redirect opens MRT Supplier / @mrtsupplier at page.line.me/074hxyed. Website contact/search/RFQ links aligned. No message sent. |
| TH/EN | Pass | Actual language switch, desktop/mobile full-page rendering; no horizontal overflow. |
| TypeScript | Pass | `npx tsc --noEmit`. |
| Focused homepage ESLint | Pass | Hero, grid, locale homepage, shared header/footer and homepage CTA files pass. |
| Full ESLint | **Fail: existing baseline** | `npx eslint app components hooks lib providers`: 78 errors / 16 warnings. Three URL-only modified files have existing set-state-in-effect errors: quote/page.tsx, MissingProductRequestForm.tsx, ProductDetailClient.tsx, verified against 46662eb. Other error files unchanged. No broad lint refactor. Used ESLint directly because package lint script still uses legacy next lint. |
| Production build | Pass on Vercel | Final application commit normal npm run build compiles and generates 3,210 pages. Local production webpack build also passed; default local Turbopack blocked by nested Windows workspace/junction discovery. Build config unchanged. |
| Required environment | Pass for presence | DATABASE_URL, ADMIN_BASIC_USER, ADMIN_BASIC_PASS set; SMTP and RFQ sender/recipient also set. No values printed/committed. |
| LINE notification environment | **Not ready / unverified** | LINE_CHANNEL_ACCESS_TOKEN and LINE_TARGET_USER_ID empty/absent in pulled branch Preview env, although names exist in inventory. SITE_URL and RFQ_DEV_MOCK also empty/absent; NEXT_PUBLIC_SITE_URL set. Delivery deliberately untested. Configure Preview-specific values through Vercel, never in PR/chat. |

## Changed files

- `components/home/SearchFirstHero.tsx`: compact TH/EN hero, verified sample parts, provisional graphic, category slot before trust/audience, dropdown stacking and mobile LINE spacing/touch target.
- `app/[locale]/page.tsx`: five category searches, existing catalog photos, category composition immediately after main hero.
- `components/home/ProductGrid.tsx`: responsive five-column grid and image sizes.
- URL-only changes in shared header/footer, homepage CTAs, products/contact/brands/feedback, locale Organization metadata and RFQ entry/success components: approved LINE OA. RFQ payloads, notification code, persistence, schema and admin unchanged.
- This directory: real rendered screenshots and QA evidence.

## Captures

Homepage/RFQ captures are from application commit f710db4. Lazy images loaded before full-page capture. Optional tracking declined for unobstructed views; fresh-consent capture included separately.

- [Thai desktop full page](pr179-desktop-th.png)
- [Thai mobile full page](pr179-mobile-th.png)
- [Mobile above the fold](pr179-mobile-above-fold.png)
- [Mobile fresh cookie consent](pr179-mobile-consent.png)
- [English desktop full page](pr179-desktop-en.png)
- [English mobile full page](pr179-mobile-en.png)
- [Desktop dropdown](pr179-desktop-dropdown.png)
- [Mobile dropdown](pr179-mobile-dropdown.png)
- [Desktop RFQ without submission](pr179-desktop-rfq.png)
- [Mobile RFQ without submission](pr179-mobile-rfq.png)

## Remaining acceptance inputs

1. Actual Design 1 left-panel image, approved technician photo and usage rights.
2. Owner confirmation of reused product/brand image rights.
3. Separate scope or explicit acceptance decision for existing ESLint debt.
4. Preview notification configuration and separately authorized delivery test if needed; current QA does not establish email/LINE delivery.

Keep PR draft while these gaps remain. Explicit owner approval required before merge or production deployment.
