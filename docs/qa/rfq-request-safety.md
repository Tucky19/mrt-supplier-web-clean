# RFQ request safety — 2026-11-09 Asia/Bangkok

Base: main `2d507a0009b4fe6ca5c4ecc1fcb920377906084a` (PR184).
Target Vercel project: `mrt-supplier-web-clean-lfcm`.

## Changes

- `/api/quote` shares the `/api/rfq/submit` handler directly. No HTTP request
  to NEXT_PUBLIC_SITE_URL: preserves the ingress IP, user agent, trace and
  complete response, including Retry-After. Both routes consume the same limit.
- Both RFQ routes reject all Preview requests with 503, PREVIEW_RFQ_DISABLED,
  and Cache-Control: no-store before parsing or database/notification work.
- Invalid JSON on non-Preview returns 400.
- Preview Prisma uses an intentionally unavailable local endpoint, even if
  DATABASE_URL is accidentally inherited. Preview database-backed admin pages
  are unavailable; this is a read-only catalog/UI Preview, not an RFQ sandbox.
- No change to Production database, notification logic, payload schema, rate
  thresholds or existing fail-open behavior when rate-limit storage fails.

Vercel overwrites the ingress x-forwarded-for to prevent external IP spoofing:
https://vercel.com/docs/headers/request-headers#x-forwarded-for
Direct handler reuse avoids sending the request through that ingress twice.

## Configuration applied and reread

Removed Preview from the scopes of DATABASE_URL, SMTP_USER, SMTP_PASS,
LINE_CHANNEL_ACCESS_TOKEN and LINE_TARGET_USER_ID. All existing Production
and Development scopes and secret values were preserved. No secret values
were decrypted. No other Vercel project was changed.

Environment scope changes apply to future deployments, not existing immutable
Preview deployments. Do not submit RFQ on older Preview URLs. They are not
certified by this change. No Production deployment is included in this PR.
A future functional RFQ Preview requires an empty dedicated test database and
notification sandbox, plus an explicit review of these fail-closed guards.

## Validation

- TypeScript and focused ESLint: passed.
- verify-rfq-request-safety.ts: mocked DB, independent IP buckets, shared handler,
  429 with Retry-After and trace, malformed JSON 400, Preview 503 before DB.
- verify-preview-isolation.ts: all outbound HTTP mocked; Preview RFQ blocked,
  Meta disabled, Production/development local RFQ honeypot and Meta preserved.
- Preview webpack production-mode build with no DATABASE_URL: passed.
- Built local Preview HTTP: TH/EN product pages 200 with tracking omitted;
  both RFQ endpoints reject synthetic requests with 503. No RFQ was created.
- Production webpack build: passed. Built local TH/EN pages retain tracking;
  both RFQ routes return honeypot 200 with original trace and malformed JSON
  400 without database access or notification delivery.

Commands (only nonfunctional localhost fixtures):

```sh
DATABASE_URL=postgresql://test:test@127.0.0.1:1/test node --import tsx scripts/verify-rfq-request-safety.ts
DATABASE_URL=postgresql://test:test@127.0.0.1:1/test node --import tsx scripts/verify-preview-isolation.ts
VERCEL_ENV=preview npm run build -- --webpack
VERCEL_ENV=production DATABASE_URL=postgresql://test:test@127.0.0.1:1/test npm run build -- --webpack
```

Webpack was used because this isolated worktree links existing node_modules;
Turbopack rejects dependency symlinks outside its project root. No dependency
versions or build settings in the repository were changed.
