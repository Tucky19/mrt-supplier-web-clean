# RFQ quota storage outage — 2026-11-12 Asia/Bangkok

Base: `f8edba199a1481ce7448a4193bf6344eed855365` (PR #185).

## Change

When quota storage throws, return an unavailable result instead of allowing
submission. The shared handler returns 503 `RFQ_RATE_LIMIT_UNAVAILABLE`,
`Retry-After: 60`, `Cache-Control: no-store`, and the existing trace ID before
validation, dedupe reads, RFQ creation, events, email, LINE or lead receipts.
This covers `/api/quote`, `/api/rfq/submit`, and the frontend `/api/rfq` alias.
The previous QA document describes #185; this change supersedes its statement
that quota-storage failures remain fail-open.

Healthy quota exhaustion remains 429. Thresholds, window, payload, honeypot,
dedupe behavior, notification code, Preview guard and dependencies are unchanged.
During an outage legitimate customers must retry later; 60 seconds is retry
guidance, not a guarantee of recovery. The form's existing failure path retains
the quote list. No automatic submission retries are added.

## Validation

- TypeScript (`npx tsc --noEmit`): passed.
- Focused ESLint on rateLimit.ts and verify-rfq-request-safety.ts: passed.
- Extended safety script: 12 serial/concurrent outage requests across all three
  aliases returned 503 with retry/cache/trace headers, no request ID or lead
  measurement, and zero downstream RFQ reads/writes. RFQ database methods were
  replaced with throwing traps and HTTP disabled. Healthy limits, separate IPs,
  malformed JSON, honeypot, Preview and recovery checks passed.
- Existing verify-preview-isolation.ts: passed with mocked outbound HTTP.
- Production-mode webpack build: passed (3210 static pages).
- Built local HTTP smoke: all three aliases returned the expected 503, code and
  headers using synthetic data and an unavailable localhost database on port 1.
  No customer records or notifications were created. The CLI server encountered
  an environment network-interface error; the smoke used Next's request handler
  through a localhost HTTP server against the same production build.

Commands:

```sh
DATABASE_URL=postgresql://test:test@127.0.0.1:1/test node --import tsx scripts/verify-rfq-request-safety.ts
DATABASE_URL=postgresql://test:test@127.0.0.1:1/test node --import tsx scripts/verify-preview-isolation.ts
npx tsc --noEmit
npx eslint lib/rfq/rateLimit.ts scripts/verify-rfq-request-safety.ts
VERCEL_ENV=production DATABASE_URL=postgresql://test:test@127.0.0.1:1/test npm run build -- --webpack
```

## Release gate and limitations

Not merged or deployed to Production during this work. Requires owner approval
before release. No real RFQ was submitted. Hosted Preview acceptance is pending.
This patch prevents downstream RFQ side effects during quota storage failures;
it does not eliminate incoming function/database connection/logging load, protect
against distributed IP traffic, change dedupe races, or alter the distinct legacy
`/api/quote/submit` implementation. Those are separate scope decisions.
