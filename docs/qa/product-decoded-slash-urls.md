# Decoded product slash URL compatibility

Date: 2026-11-07. Base: origin/main at 0710eca.

## Problem and implementation

Read-only production HEAD requests reproduced the reported issue:
`/th/products/W%20962/14` returned 404 while
`/th/products/W%20962%2F14` returned 200. The November 5 inspection log
was supplied by the owner; this task did not independently retrieve that log.

The existing `[id]` page only matches one path segment. A separate catch-all
GET route handles multiple segments, joins them with `/`, and requires an
exact match to an active catalog `partNo` containing `/`. It deliberately
does not use the existing page's fuzzy punctuation/space normalization.

A match returns 308 to the existing `encodeURIComponent(partNo)` URL in
the same locale, preserving the query string. No match returns an HTTP 404
with `X-Robots-Tag: noindex`. No product page, metadata, sitemap, internal
link, catalog, RFQ, or proxy code was changed. Static routes and the original
single-segment product route retain precedence.

## Verification before Preview

- `npm ci --no-audit --no-fund`: passed; lockfile unchanged.
- `npx tsx scripts/verify-product-slash-urls.ts`: passed, 141 cases.
- `npx eslint 'app/[locale]/products/[...partNo]/route.ts' scripts/verify-product-slash-urls.ts`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed with Next.js 16.2.9; 3,210 static pages generated.
  Used a local placeholder DATABASE_URL, not a production credential.
  Existing edge-runtime/static-generation warning remains.
- `npx tsx scripts/verify-product-slash-urls.ts http://localhost:3219`:
  passed, 151 cases against `next start` after the build.
- `git diff --check`: passed.

The HTTP suite covers all 60 current slash-bearing catalog part numbers in
both TH and EN. Each decoded URL must return 308, the encoded target must
return 200, and its HTML must contain the original production canonical,
TH/EN hreflang and x-default URLs. Sample families include `W 962/14`,
`C 1633/1`, `LB 962/2`, `HU 931/5 x`, and `W 11 102/36`.

Negative cases include unknown suffixes, extra segments, `P181/080` (must
not resolve to `P181080`), `W 962/1/4`, encoded slash injected into another
segment, mixed encoded/decoded multi-slash unknown codes, and added spaces.
HEAD uses the framework's GET handler support; read-only curl checks passed.

Also verified lowercase `%2f`, Google-InspectionTool user-agent parity,
query preservation, an ordinary product and the static dimensions page.
next-intl already normalizes an extra encoded space in `W%2520962/14`;
this resolves to the same existing SKU and redirects to its canonical URL.
The new handler itself performs no additional percent decoding. Empty
segments are rejected at handler level; framework trailing/repeated-slash
normalization remains outside this change.

## Scope

No merge or production deployment is authorized. A Preview must be tested
separately after GitHub/Vercel has built this branch. Local HTTP results do
not establish Vercel edge behavior. Final Preview SHA and URL are reported
in the task response after deployment verification.
