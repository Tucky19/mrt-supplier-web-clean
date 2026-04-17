# MRT Supplier Web Refactor Notes

This cleaned package includes:
- unified RFQ submit aliases routed to `/api/rfq/submit`
- aligned RFQ statuses (`new`, `in_progress`, `quoted`, `closed`, `spam`)
- follow-up model added to Prisma schema
- admin follow-up endpoints moved to dedicated follow-up records
- admin basic auth moved to environment variables (`ADMIN_BASIC_USER`, `ADMIN_BASIC_PASS`)
- quote provider made backward-compatible with legacy UI components
- search ranking hardened for exact and prefix part-number matches
- duplicate root searchTokens file reduced to a re-export
- test table removed from Prisma schema

Before running in your environment:
1. `npm install`
2. `npx prisma migrate dev --name rfq_domain_cleanup`
3. `npx prisma generate`
4. `npm run build`

Required env additions:
- `ADMIN_BASIC_USER`
- `ADMIN_BASIC_PASS`

Because this environment is offline, Prisma client regeneration and DB migration were not executed here.
