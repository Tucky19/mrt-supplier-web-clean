# Two-product content update (draft)

Scope: P502649 and P554004, Thai/English product-detail copy and metadata. No catalog, specifications, relations, applications, RFQ contracts, contact page, homepage, price or stock changes. P550440 is intentionally excluded pending reconciliation of manufacturer application sources.

## Primary references
- P502649: Donaldson SEA Product Bulletin May 2020, Coolant Filtration section: coolant concentrate, OAT, 1 L. https://www.donaldson.com/content/dam/donaldson/engine-hydraulics-bulk/literature/southeast-asia/new-products/SEA-Product-Bulletin-May-2020.pdf
- P554004: Donaldson April 2024 New Products, liquid filter kits: lube filter, spin-on full flow. https://www.donaldson.com/content/dam/donaldson/engine-hydraulics-bulk/literature/north-america/eafm-new-products/2024/Donaldson-New-Products-April-24.pdf

The first source is historical. Do not infer current mixing ratios, standards, service life or stock from it. Existing catalog technical fields remain unchanged.

## Hydraulic article draft (not routed or published)

Title: Before replacing a hydraulic filter, what installation details and specifications should you check?

Start with the full original part number, equipment model and installed filter location. Pressure requirements depend on the filter's position in the circuit. Check pressure rating, flow, efficiency and design against equipment requirements rather than assuming that matching dimensions establish compatibility. Follow the equipment manufacturer's maintenance schedule and confirm bypass arrangement where applicable.

For an RFQ, provide the original label photo, equipment model, installation location, available specification sheet and quantity. This is an information checklist, not a hydraulic-system servicing procedure. Replacement suitability must be checked before confirmation.

Source: https://www.donaldson.com/en/resources/technical-articles/replacing-hydraulic-filters/

Thai outline: ก่อนเปลี่ยนไส้กรองไฮดรอลิก ต้องรู้ตำแหน่งติดตั้งและสเปกอะไรบ้าง? เริ่มจากเบอร์เดิม ตำแหน่งติดตั้ง พิกัดแรงดัน อัตราการไหล ประสิทธิภาพ และข้อกำหนดผู้ผลิตเครื่อง เตรียมรูปฉลาก รุ่นเครื่องและจำนวนเพื่อขอราคา ไม่ยืนยันเบอร์แทนกันจากขนาดเพียงอย่างเดียว

No article route, sitemap entry or publication is included in this PR.

## Local QA results
- Base: origin/main 8173b62 (includes merged PR189). Separate worktree and branch.
- Clean npm ci followed by npm run build: passed. DATABASE_URL was a dummy localhost value; no real database or RFQ submission was used.
- TypeScript --noEmit --incremental false: passed.
- Scoped copy regression script: passed for both languages, unchanged catalog objects and all unrelated products.
- Browser script: 12 checks passed (P502649/P554004/P550440, TH/EN, 390/1440px), HTTP200, canonical/hreflang, preserved specs and cross-reference examples, no horizontal overflow or page errors. Screenshots in output/product-copy-qa (local only).
- Focused ESLint: new helper, metadata page and unit test passed. Existing ProductDetailClient gallery effect fails react-hooks/set-state-in-effect with lockfile-installed dependencies; the same finding was reproduced in unchanged HEAD at line49. It is not caused or fixed by this patch.
- npm ci reported 27 dependency advisories (10 moderate,16 high,1 critical). No lockfile/package upgrades were made in this content task.
- No Preview, production, email/LINE delivery or submitted RFQ verification is claimed. No merge or production deployment performed.

## Follow-up: search badge and RFQ trace
- Canonical P502649 title is already Coolant Concentrate, OAT 1L; its category remains filter in the catalog. This follow-up changes only ProductCardV2's visible category badge for verified Donaldson P502649, reusing localized copy. It does not change catalog classification, search ranking or analytics data.
- Existing search and detail add-to-RFQ paths preserve the correct coolant title, quantity 1 and part number. No misleading filter title was found in the RFQ item; RFQ renders the part number and brand.
- PR preview at b3e7250 auto-built on the legacy mrt-supplier-web-clean project. The intended mrt-supplier-web-clean-lfcm build was canceled by Ignored Build Step. These are not equivalent to successful intended-project Preview QA.
- Local analytics persistence is unverified: the QA server uses a dummy localhost database and logs connection errors for search events. No live database is contacted.
- Final follow-up QA: clean build and TypeScript passed; 12 product-page assertions and 4 TH/EN desktop/mobile search-to-RFQ + reload cases passed with zero RFQ POSTs. ProductCardV2 lint has zero errors and two pre-existing no-img-element warnings. Catalog files remain unchanged.
