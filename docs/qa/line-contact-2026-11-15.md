# Unified LINE contact — 15 November 2026 (Asia/Bangkok)

## Scope and provenance

Continues draft PR #187, branch `fix/no-results-copy-search`.
Starting head: f43ae2f2ac99e7c3cae9eb79000669d9db24ff36.
Base main: f8edba199a1481ce7448a4193bf6344eed855365.
Application commit: bef2509be8ba0932b0bccac5d2fab89170c71f8e.
Application tree: 789457c419f6e765d59bcdeb5335f07c4143f8f7.

Read root AGENTS.md; no checkout `.agents/skills` or nested AGENTS/SKILL files
were present. Used an isolated worktree from remote PR head because the earlier
checkout contained uncommitted work. No other branch or PR was changed. Git CLI
push lacked credentials, so the same tree was pushed through the GitHub connector
with an expected-head lease. Remote tree matches the tested local tree exactly.

Boss reported OA payment/restoration on 15 November. Independently retested both
short links in desktop cloud Chrome without sending messages:
- https://lin.ee/PsQGAuu -> https://page.line.me/074hxyed?oat_content=url&openQrModal=true
- https://lin.ee/eBPIShC -> https://page.line.me/074hxyed?openQrModal=true
Both rendered MRT Supplier and @mrtsupplier. The previous LINE STORE observation
is historical, not evidence of a current broken account or a confirmed cause.
Kept the original short link and SVG. Independent CairoSVG + ZXing decoding of
the existing SVG returned exactly https://lin.ee/PsQGAuu.

## Changes

- `components/contact/LineContactLink.tsx`: shared native modal dialog, portaled
  to body so header/hero styles and stacking cannot clip it. Desktop >=768px
  opens QR + selectable OA ID. Mobile retains native external navigation and
  leaves contact help available on return, including a retry link and ID.
  Close/Escape, native focus handling, body scroll cleanup, pathname-keyed reset.
- `components/analytics/TrackedLineLink.tsx`: delegates to shared contact UI;
  existing source/locale analytics fire only for external navigation, not panel
  opening. No new event names or tracking configuration.
- `components/search/NoResultsContactActions.tsx`: removes duplicate LINE panel;
  preserves verbatim decoded query copying and accessible error fallback.
- `lib/i18n/lineContactUi.ts`, `lib/i18n/searchUi.ts`: shared TH/EN contact copy
  separated from query-copy text.
- `components/home/MissingProductRequestCta.tsx`,
  `components/products/MissingProductRequestForm.tsx`,
  `app/[locale]/quote/success/page.tsx`: previously direct links use same UI;
  existing analytics callbacks retained; previously untracked links stay untracked.
- `scripts/verify-line-contact.mjs`, `scripts/verify-no-results-copy.mjs`: prepared
  repeatable TH/EN desktop/mobile checks. External traffic and non-GET/HEAD
  submissions are blocked by the test scripts.

Existing TrackedLineLink callers include header (desktop/mobile menu), hero,
footer, both contact-page links, no-results, product detail, quote, brands,
feedback and homepage contact/audience CTAs. Search engine, RFQ submission,
notification logic, SVG, package files and project settings are unchanged.

## Results and limits

PASS:
- `npx tsc --noEmit`.
- Focused ESLint on new/shared contact, tracking wrapper, copy component,
  homepage missing-product CTA, quote success page and both translation files.
- `VERCEL_ENV=preview npm run build -- --webpack`; local production build passed.
- `git diff --check` and syntax checks for both browser scripts.
- Local built HTTP 8/8: TH/EN home, contact, no-results and P828889 matching results.
- Independent SVG decoding (see above).
- Temporary React/jsdom simulation: 4 TH/EN desktop/mobile policy cases, each
  with three open/close cycles, route departure/return, callback counts;
  6 TH/EN clipboard success/denied/unavailable cases with exact spaces/symbols
  and accessible fallback. Dialog, matchMedia and clipboard are mocked. This
  does NOT verify viewport layout, native focus trapping or real phone behavior.
- Live desktop Chrome on exact Preview: TH/EN header, hero, homepage contact and
  footer; both contact-page links; no-results LINE panel. Repeated opening and
  closing, Escape on TH no-results, localized QR/ID and close focus observed.
  Desktop screenshot inspected: centered readable panel and visible QR.
- Live TH/EN copy buttons displayed their success feedback. This confirms the
  write promise resolved, not that cross-app paste was independently verified.

FAILED / BLOCKED:
- Lint including MissingProductRequestForm reports pre-existing
  react-hooks/set-state-in-effect at the initial form reset (line 107 after import).
  The identical code exists at starting head. No unrelated form refactor made.
- Local Playwright Chromium cannot launch: process_singleton socket Operation
  not permitted. The committed viewport test suites are NOT marked passed.
- Browser clipboard read returned an empty virtual clipboard; paste reported
  "virtual clipboard has no data to paste". Real copy/paste remains unverified;
  this is not sufficient evidence to call the website copy operation broken.
- No rendered 390px mobile viewport run, physical iOS/Android test, phone QR scan,
  app handoff or real analytics-delivery test. No real RFQ or LINE message sent.

## Preview

Project: mrt-supplier-web-clean-lfcm.
Deployment: dpl_GBK9TDVfgPa1FnfLeRm3kzDHMo1B, READY.
URL: https://mrt-supplier-web-clean-lfcm-85fdeswe4-tuckys-projects.vercel.app
SHA: bef2509be8ba0932b0bccac5d2fab89170c71f8e.
Initial share access redirected to login during the build; after READY it worked,
and both connector GET (200) and live desktop browser checks succeeded.
Later QA-only commit does not change application files. Do not substitute the
separate Vercel project without `-lfcm` for acceptance evidence.

## Remaining owner acceptance (no sends required)

1. On a real phone, open Preview TH and EN; tap LINE from header menu, hero,
   contact, footer and no-results. Confirm intended MRT Supplier account opens.
2. Return to browser; confirm fallback ID/retry, readable layout, close button,
   scrolling and reopening work. Check narrow portrait and landscape.
3. Scan desktop panel QR using phone LINE; confirm MRT Supplier / @mrtsupplier.
4. Copy an unsuccessful query containing spaces, Thai and `/ + & # %`; paste
   into a private draft/notes or unsent LINE draft and confirm exact text.
5. Check three open/close cycles, Escape on desktop, navigating away/back and
   changing language. No stale panel, frozen scroll or erased query.

Keep draft; no merge, auto-merge or Production deployment authorized/performed.
