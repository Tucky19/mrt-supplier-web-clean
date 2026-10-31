# Customer theme consistency — Preview only

Follow-up to the owner's preliminary homepage acceptance. Draft PR #181, branch `work/customer-theme-consistency`, based on `growth/homepage-cro-v2` at `f4fc312`. This is a public-page visual foundation update, not a merge or production rollout.

Application commit: `6bfb2ff5e340151861b3e455bc9dc77689d34f54`.

## Review links

- [Preview — Products](https://mrt-supplier-web-clean-lfcm-nvxwplo61-tuckys-projects.vercel.app/th/products)
- [Preview — Brands](https://mrt-supplier-web-clean-lfcm-nvxwplo61-tuckys-projects.vercel.app/th/brands)
- [Preview — RFQ](https://mrt-supplier-web-clean-lfcm-nvxwplo61-tuckys-projects.vercel.app/th/quote)
- [Desktop before / after](comparison-1440.png)
- [Mobile before / after](comparison-390.png)
- [All new screenshots and measured results](after/)
- [RFQ with two items, desktop](after/rfq-items-1440.png), [mobile](after/rfq-items-390.png)

GitHub deployment `7450977760` maps to application SHA `6bfb2ff`, environment **Preview**, status **success**. Opening its exact URL in a fresh browser redirects to Vercel Login. No access controls were changed. Screenshots and browser checks here are from the local production build of that application commit, not captures from the protected Vercel deployment. Owner review and deployed-site visual acceptance remain pending.

## Audit findings and changes

The approved homepage had a self-hosted font, blue/navy colors, compact header/footer and 6–8px radii scoped to its own CSS module. Inner pages used the older font fallback, blueprint-grid background, different header navigation, large card radii and blue/black primary actions.

- Extracted the existing homepage foundation into `components/layout/CustomerTheme.module.css`; the homepage composes it, rather than creating a second competing theme.
- Opted 14 existing public page shells into the shared font, colors, neutral surfaces, focus treatment, compact header/footer and card tokens. Each page change is an import plus a shell class; page-specific layouts and all domain code remain.
- Standardized desktop navigation as Products / Brands / Articles / Contact, with active-page indication. Home remains accessible through the logo and mobile menu. Feedback remains in the footer and mobile menu. Existing locale/query preservation and same-page mobile menu closing remain.
- Products now use the shared content width and rectangular search treatment. Add-to-RFQ and brand primary actions use a deeper orange for readable white labels. Blue remains for navigation/secondary actions, green for LINE and successful add states. Disabled states retain their existing behavior.
- Product detail's hard-coded 20–28px card radii now use the shared token. Product photos, specifications, reference verification warnings and data are unchanged.
- Article, Contact, RFQ, success, dimensions, cross-reference, application, privacy and feedback pages share the same visual language without inheriting the homepage's large marketing hero.

## Scope boundaries and risk handling

No changes to `lib/search`, RFQ validation/payloads, QuoteProvider persistence, analytics handlers, notifications, API routes, database schemas, product records, admin UI, dependencies or production configuration. Only presentation attributes were added to add-to-quote controls; handlers were not rewritten.

The CSS module is explicitly applied to public shells, not global CSS. Its primary-action rules are restricted to inner-page shells; the accepted homepage retains its existing orange hero/search treatment. The main regression risk is visual wrapping/spacing on pages with long text or many RFQ items. Evidence below covers representative pages, languages, narrower widths and two-item RFQ state; this is not a claim that every possible content combination has been visually accepted.

Before any subsequent change to search ranking/filtering, RFQ contracts or persistence, notifications/tracking, schema/data, shared routing or production deployment, report the exact impact and proposed scope to the owner first. Current work remains isolated and reviewable in a dependent Draft PR.

## Validation

- TypeScript: passed. Final production build: passed, 3,210 pages. Local installed Next.js resolves to 16.2.3 in the parent workspace; package/lock files unchanged. Vercel deployment also passed.
- Focused ESLint for changed TSX: zero errors, two existing `no-img-element` warnings in ProductCardV2. Those image elements were not changed in this patch.
- `git diff --check`: passed.
- Visual matrix: Home, Products, Brands, Detail, RFQ, Contact and Article; TH/EN at 1440 and 390px, 28 rendered cases. All return 200, no horizontal overflow, same font; header heights are consistently 70px desktop / 62px mobile.
- Additional English width checks at 360, 430, 768 and 1024px for Products, Brands, Detail and RFQ: 16 cases, no horizontal overflow (`after/widths.json`).
- Desktop/mobile interaction checks: add P551864 quantity 2 and P181080 as a second RFQ item; update P551864 to quantity 3; local quote persists. Add button becomes disabled and green on success, preserving the existing state. No RFQ submitted.
- Search P181 navigates correctly; P772580 still suggests P828889; ArrowDown/Escape focus works. Language switch preserves the search query. Mobile menu navigates and closes.
- Supporting routes (dimensions, quote success, privacy, feedback, cross-reference P828889, second article, compressor/generator application) return 200.
- Browser API POSTs are blocked during QA so test actions do not send customer submissions or analytics writes. Contact destinations were not used to send messages.

Run `capture.cjs before|after`, `smoke.cjs`, and `compare.cjs` from the checkout root with the built application on port 3100. The comparison uses real matched-viewport captures; no generated mockups.

## Recommendations

Local environment finding: the repository's `prisma/schema.prisma` has `SearchEvent.eventId`, but the generated Prisma client resolved from the parent workspace does not. This explains the observed local `Unknown argument eventId` logging error. It is evidence of a local generated-client mismatch, not evidence of a production database failure or a regression from these style changes. No client regeneration, migration, database operation or tracking change was made; investigate that environment separately before proposing any data-layer correction.

1. Review and approve the shared foundation first, then require new public UI to use its tokens instead of adding page-specific colors/radii. Keep red/amber/green status colors semantic.
2. In a separately scoped Search UX task (#180), review duplicated search guidance and advanced/multi-part controls on mobile. Do not mix search behavior changes into this styling patch.
3. Before any production release, review a protected Preview with representative long product names and larger RFQ lists, and verify that commercial availability/response-time wording matches actual business policy. Such copy/data or behavioral changes need a concrete impact explanation before implementation.
