# No-results copy action — 2026-11-14 Asia/Bangkok

Related to Issue #180 (partial delivery, not closure of the entire issue).
Base main: f8edba199a1481ce7448a4193bf6344eed855365.

## Scope

Add a copy-search button adjacent to the existing tracked LINE link. Preserve
the decoded URL q verbatim for copying, including spaces and special characters.
The existing trimmed query continues to drive search, analytics and the RFQ form.
SearchBar's pre-existing trimming before URL navigation is unchanged: whitespace
already removed there cannot be recovered by this button. No search-engine, tracking, LINE destination, form, API or dependency changes.
The desktop LINE interaction is corrected as described below. Preview build
overrides are deployment-specific; project settings are unchanged.

Feedback is localized through searchUi.ts, announced with role=status and a
polite atomic live region. On clipboard rejection/unavailability, expose the
original text in a labeled read-only textarea that selects on focus. Retry is
available; changing query/locale remounts the component to clear stale feedback.
Buttons stack below sm and sit side by side above sm, with minimum 44px height.
These responsive classes still require rendered browser acceptance below.

The existing generic CopyButton was inspected but lacks failure handling and
accessible feedback. A small search-specific component avoids changing unrelated
product/RFQ copy controls. The page remains a Server Component.

## Passed

- TypeScript and focused ESLint (page, component, search translations).
- Local Preview-mode webpack production build (3210 static pages).
- React DOM simulation in a temporary jsdom test environment: six TH/EN cases
  for success, permission rejection and missing Clipboard API; each also checks
  retry, exact text including spaces/special characters, live feedback, unchanged
  LINE href and reset on a new query. This is not browser clipboard permission QA.
  Temporary test tooling is outside the repository; dependencies are unchanged.
- Local built HTTP: TH/EN no-result and P828889 matching-result cases (4 checks).
  Copy action appears only for no results; LINE URL and RFQ form remain present;
  Preview tracking bootstrap is omitted.
- Hosted application commit daf1bdcb416275ed870e1936e3900a138ae4305f:
  Vercel project mrt-supplier-web-clean-lfcm, deployment
  dpl_4Pfv4yN5xVzC4RwUEfBhezaQbC6b READY. Authenticated GET checks of TH/EN
  no-results pages returned 200 and contained the localized button, original LINE
  URL and existing form. This evidence predates the desktop LINE fix below and does not certify it.

## Pending: do not approve merge/release yet

Playwright Chromium launch failed before page tests because this execution
environment rejects its process-singleton socket. Cloud browser access became available in the desktop-fix round, but the new
Preview share URL redirected to Vercel sign-in and the Vercel fetch connector independently returned
`deployment_authentication_required`: its temporary share link was not accepted.
No rendered acceptance or real browser clipboard results for the new SHA are claimed.

Run the committed browser test in a browser-capable environment:

```sh
VERCEL_ENV=preview npm run build -- --webpack
node scripts/verify-no-results-copy.mjs
# Or pass the exact hosted Preview origin. Supply its temporary share URL
# through PREVIEW_ACCESS_URL if needed; never commit/log that URL or token.
```

The script defines 12 TH/EN x 390/1440px x success/denied/unavailable cases,
keyboard activation, manual fallback selection, no horizontal overflow, touch
target size, query navigation reset and matching-result regression. Clipboard
outcomes are injected; additionally verify actual copy/paste on mobile Safari
and desktop Chrome without sending a LINE message. External requests and all
non-GET/HEAD requests are blocked during the scripted page checks.

Fixture note: ZZZXQ999999999 is confirmed to yield no results with the unchanged
search engine. Alphabetic-only nonsense can return 14 existing results; that is
pre-existing search behavior and is not changed in this UI task.

No LINE message, RFQ submission, merge or Production deployment occurred.

## Desktop LINE correction

Application SHA: 4f56833cfdb3a86f5f16b4e4f0017ebf442d409c.

A live desktop browser reproduced the original short link opening the generic
LINE STORE page instead of an OA contact view. This does not establish that the
OA ID is wrong. Keep the existing destination https://lin.ee/PsQGAuu.

At widths >=768px the adjacent LINE button now expands local contact help with
a QR encoding that exact link and the existing public ID @mrtsupplier. It does
not navigate away or fire the external-link analytics event. Below 768px the
existing tracked link remains, with a separate contact-help disclosure. Copying
the search still preserves the decoded URL query verbatim; help never replaces
the clipboard with the OA ID. TH/EN instructions remind customers to review
their text before sending. No message is sent automatically.

Validation of this application SHA: TypeScript, focused ESLint, diff whitespace
check and Preview-mode webpack build passed. The updated browser script also
covers the responsive disclosure, unchanged mobile href and visible QR/ID.
Its execution is blocked by the Chromium process-singleton socket error.

Requested Preview on mrt-supplier-web-clean-lfcm:
- Deployment: dpl_8LK5g5U9RMpBUK2Ft8NeLGoQAJ61
- URL: https://mrt-supplier-web-clean-lfcm-1u9x4sndw-tuckys-projects.vercel.app
- SHA: 4f56833cfdb3a86f5f16b4e4f0017ebf442d409c
- At this documentation checkpoint it was building; logs confirmed cloning
  the correct branch/SHA and successful compilation. Build completion alone is
  not rendered acceptance.

Remaining gate: rendered TH/EN desktop/mobile, actual clipboard copy/paste,
and phone scan to the intended MRT Supplier OA. QR payload is the existing
link; actual device routing still requires verification. No merge/release yet.
