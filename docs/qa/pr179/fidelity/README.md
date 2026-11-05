# Homepage visual fidelity correction

Application commit: `414501420a34c166e2dd274c69149726ad785068` (main visual correction `52d8197`). Existing PR #179 / `growth/homepage-cro-v2`; Preview only.

## Preview and acceptance

- Exact Preview: https://mrt-supplier-web-clean-lfcm-kd84vzss8-tuckys-projects.vercel.app/th
- GitHub deployment `7413249620` records environment **Preview**, source SHA `414501420a34c166e2dd274c69149726ad785068`, status **success**.
- The previous visual correction deployment was independently opened in a fresh browser and redirected to Vercel Login. The connected browser host is unavailable; opening the existing Edge session timed out awaiting tool access. No access protection was changed. The final Preview still requires authorized access for rendered acceptance.
- All after screenshots here are fresh **local production-build** captures from final application commit `4145014`, not Vercel screenshots. Do not describe this as Vercel visual acceptance or owner approval. A share URL was requested for the remaining deployed-site checks.
- PR must remain Draft. No merge or production deployment was performed.

## Side-by-side evidence

- [Desktop: reference / before / after](comparison-desktop.png), [readable top](comparison-desktop-first.png)
- [Mobile: reference / before / after](comparison-mobile.png), [readable top](comparison-mobile-first.png)
- [1440 Thai full page](1440-th-full.png), [1440 English](1440-en-full.png), [1024 Thai](1024-th-full.png)
- [390 Thai full page](390-th-full.png), [390 first viewport](390-th-first.png), [390 English](390-en-full.png)
- [360 Thai](360-th-full.png), [430 Thai](430-th-full.png)
- [Mobile consent](390-th-consent.png), [English consent](390-en-consent.png), [mobile suggestions](390-suggestions.png), [desktop suggestions](1440-suggestions.png), [mobile menu](390-menu.png)

`approved-reference.png` is the exact supplied design board. Comparison HTML crops its desktop/mobile content, then displays reference and actual captures at the same visual width. Desktop actual browser viewport is 1440px, mobile is 390px; the supplied mockup does not define CSS viewport sizes, so its device frame and decorative outer canvas are excluded from the comparison. No new mockup was generated.

Before screenshots are the previous real local captures in `../approved-hero/` associated with `074bfcc` (application `d5772ff`). They are explicitly labeled historical. Some lower-page images were not loaded in those old captures; those blank areas are not evidence that the old implementation lacked the assets. Judge structural spacing against the baseline, and use new captures for current image verification.

## Differences corrected and still remaining

| Area | Before | Correction / remaining difference |
| --- | --- | --- |
| Header | Tall, rounded locale controls and generic navigation | Compact 70px desktop / 62px mobile header, simple language controls; homepage desktop navigation now Products / Brands / Articles / Contact. Existing logo, quote count, language and mobile menu behavior retained. Actual stacked logo differs from the mockup's horizontal mark; no replacement mark invented. |
| Hero | Two-line unrelated headline, large search card and excessive height | Reference-style white/orange headline, short subtitle, full industrial background, directional overlay and top-aligned desktop crop preserving helmet. Portrait mobile crop retained. Exact technician scale differs because approved source images and responsive viewport ratios differ from the mockup. |
| Typography | System fallbacks caused inconsistent Thai appearance | Self-hosted Noto Sans Thai variable font (official Google Fonts source, OFL license included), stronger heading weights and deliberate mobile line lengths. Reference text is raster artwork; line breaks are responsive, not pixel-identical. |
| Search and actions | Search and RFQ enclosed in a tall white box; LINE was a text link | Flat rectangular white search with orange submit, independent outlined RFQ and solid green LINE buttons below. Existing SearchBar, query examples, keyboard and tracked links retained. Example chips add height compared with mockup; retain them for verified discovery and 44px touch targets. |
| Product cards | Tall bordered cards, long descriptions and large blue buttons | Light neutral image-led cards, short labels, orange arrow treatment; the whole card is the link. Five verified categories retained, rather than the mockup's unsupported Hydraulics/Pneumatics selections. Catalog photos remain unchanged and retain their original gray backgrounds; no generated replacements or inferred stock claims. |
| Spacing and transitions | Repeated trust/audience/value sections with large padding | Compact hero benefits, categories immediately after hero, then horizontal workflow and logo strip. Repeated support content consolidated into three practical assistance blocks; both articles retained. Desktop Thai page is about 2,151px vs approximately 4,925px in the previous capture. |
| Three-step process | Three isolated tall cards and long introductory block | Connected icon/number process band, compact desktop layout and deliberate mobile three-column layout. Accurate Search → Add items → Submit RFQ wording retained even where longer than mockup text. |
| Brands | Large stacked descriptive brand cards | Compact logo strip linking to real catalog searches. Donaldson / MANN-FILTER / NTN only; no unsupported mockup brands or distributor claims. |
| Bottom CTA and footer | Large generic dark card separated from footer | Industrial background contact band, phone/email/LINE and orange RFQ action; compact existing footer. Full operational footer and useful knowledge/support content remain, so actual page is longer than the mockup. |

Visual review: structure and hierarchy are substantially closer to the supplied reference. This is not a claim of pixel equivalence, production readiness, or owner acceptance. The remaining styling/content differences are explicit above.

## Files and scope

- `components/home/SearchFirstHero.tsx`: reference-led responsive hero composition and compact benefits.
- `components/home/ProductGrid.tsx`: image-led category links.
- `components/home/BrandShowcase.tsx`: verified logo strip.
- `components/home/QuoteCTASection.tsx`: industrial contact band.
- `components/home/Homepage.module.css`: homepage-scoped layout, typography, cards, header/footer adjustments; no global stylesheet changes.
- `components/layout/SiteHeader.tsx`: optional homepage-only navigation variant; all other pages retain existing navigation.
- `app/[locale]/page.tsx`: compact process and consolidated assistance, existing article links and verified catalog data retained; remains a Server Component.
- `public/fonts/noto-sans-thai/`: official font and OFL license. Source: https://github.com/google/fonts/tree/main/ofl/notosansthai . No dependency additions.

Both approved hero WebP files are unchanged from `074bfcc`. Search scoring, cross-reference data, RFQ payloads, notifications, database schema and analytics implementation are unchanged. Browser QA blocks POSTs to `/api/` to avoid customer submissions and analytics test writes. Contact checks inspect destinations without sending messages.

## Validation

- `tsc --noEmit`: passed.
- Focused ESLint for all changed TSX: passed, no warnings.
- Final `next build`: passed (3,210 pages). Local installed dependencies resolve Next.js 16.2.3 from the parent workspace; lockfiles were not modified. Vercel's final deployment also reports success with its own install.
- `git diff --check`: passed.
- Browser matrix: 1440 TH/EN, 1024 TH, 390 TH/EN, 360 TH, 430 TH. No horizontal overflow; correct language and responsive source selection. Search begins around y=399 and LINE around y=502 on 390px; both remain above the cookie banner in fresh-consent screenshots.
- Desktop/mobile dropdown View all hit-testing: clickable and not clipped. ArrowDown / Escape retains input focus. Existing post-Escape draft synchronization remains outside this styling scope; tests re-focus before a new submission.
- Search `P181` reaches `/th/products?q=P181`; example `P551864` reaches its search results. Mobile menu opens; TH→EN navigation works; RFQ page loads without submission; both real articles return 200.
- Cross-reference query `P772580` still suggests `P828889`. `/th/cross-reference/P828889` returns 200. The initial direct URL test using `P772580` returned 404 because that URL expects an actual catalog part number; this was a test-input correction, not an application change. See `cross-reference.json` and `results.json`.
- LINE destinations inspected: approved `https://lin.ee/PsQGAuu`. No real LINE message, RFQ, email or production data mutation performed as part of this correction.

Run `capture.cjs` from the checkout root with the built site on port 3100 (or an authorized `BASE_URL`). Run `compare.cjs` after capturing to recreate comparison HTML and PNGs. Scripts create evidence, not implementation-mirroring tests.

## Remaining acceptance gates

1. Open the exact Preview with authorized Vercel access, repeat screenshot/interaction checks there and confirm font/asset loading.
2. Owner reviews the side-by-side comparisons and working Preview; visual acceptance remains pending.
3. Keep future Search UX work coordinated with Issue #180; preserve this task's homepage-only styling scope. No production merge/deployment until separate approval.
