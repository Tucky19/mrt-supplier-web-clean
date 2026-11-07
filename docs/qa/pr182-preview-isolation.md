# PR182 Preview isolation

Preview is identified by `VERCEL_ENV=preview`, supplied at build and runtime.
The root layout omits GTM, its noscript iframe, GA4 and automatic Meta/page-view
components in Preview. Production/development retain the existing rendering.
The server Meta endpoint receives no transport configuration in Preview even
if Meta credentials are accidentally present. Valid events therefore return
204 without outbound transport; ordinary request validation remains active.

The legacy `/api/quote` wrapper invokes the existing RFQ submission handler
locally in Preview, after its existing JSON validation. It cannot forward to
an inherited production `NEXT_PUBLIC_SITE_URL`. Outside Preview its existing
forwarding behavior is unchanged. The submission handler, database writes,
rate limiting and notification handling are otherwise unchanged.

## Required deployment isolation

- Use an empty test PostgreSQL database, not a copy of customer records.
- Scope its `DATABASE_URL` to the PR's Preview branch only. Apply the existing
  two active migrations only to the verified empty test database.
- Do not supply live SMTP, LINE or Google Sheets webhook credentials to Preview.
  Existing notification functions reject missing credentials before transport.
  Admin email destinations are hardcoded in existing modules; changing
  `RFQ_TO_EMAIL` alone is NOT a delivery safeguard.
- Withhold Meta and GA4 credentials as defense in depth. Do not rely on a Meta
  test-event code as an outbound-traffic blocker.
- Use only synthetic records. RFQ success with notification failures is a
  database-flow result, not proof that notification delivery works.
- No production changes, automatic-build enablement or merge is part of this patch.

## Verification

Run in dedicated test processes (the test script sets nonfunctional fixtures
and mocks all network traffic for its API-level assertions):

```
node --import tsx scripts/verify-preview-isolation.ts
```

Checks Preview malformed JSON handling, local RFQ honeypot handling without DB
access, no quote forwarding, and no Meta transport even with dummy credentials.
Also checks unchanged production/development transport using mocked fetch.

After a production-mode build/start, pass the local base URL and `tracking` to
verify both locales retain GTM markup. After a separate Preview build/start,
pass the URL without `tracking` to verify both locales omit tracking markup.
Build with the same VERCEL_ENV that will be used at runtime; do not reuse
production prerendered HTML as a Preview build.

Rerun `scripts/verify-product-slash-urls.ts` against the Preview-built server,
as well as focused ESLint, TypeScript and the production build. Real Preview
identity, database health/persistence and browser network inspection remain
separate deployment checks. These local tests do not validate email/LINE or
prove a remote Preview deployment's configuration.

## Local results (2026-11-07)

- Focused ESLint and `tsc --noEmit`: passed.
- Dedicated Preview-isolation API assertions: passed with mocked outbound fetch.
- Separate `VERCEL_ENV=production` and `VERCEL_ENV=preview` builds: passed,
  3,210 static pages each; pre-existing edge-runtime warning remains.
- Built TH/EN HTML: GTM retained for production, omitted for Preview.
- Built Preview API checks: malformed quote JSON 400, local honeypot response
  200 without DB access, valid Meta event 204 with nonfunctional test credentials.
- Existing slash-URL suite: 141 handler checks and 151 Preview-built HTTP checks
  passed across 60 slash-bearing catalog SKUs.
- `git diff --check`: passed. No database connection or migrations were performed.

The existing contact-page Google Maps embed remains unchanged. This patch
suppresses production measurement, not every third-party browser resource.
