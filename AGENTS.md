# AGENTS.md

## Project
mrt-supplier-web-clean

B2B industrial parts platform focused on:
- search-first UX
- RFQ conversion
- admin RFQ handling
- practical, production-ready implementation
- clean architecture with strict scope control

---

## Core Product Direction
The system is NOT a marketplace-style browsing experience.

Primary flow:
1. Search
2. Add to Quote
3. Submit RFQ
4. Sales/Admin follow-up

Optimize for:
- speed
- clarity
- conversion
- maintainability

Avoid:
- decorative complexity
- marketplace clutter
- overengineering
- broad speculative refactors

---

## Non-Negotiable Engineering Rules

### 1) Respect scope strictly
When asked to change one feature or one bug:
- change only the minimum required files
- do not refactor unrelated areas
- do not rename unrelated modules
- do not "clean up" adjacent code unless required for correctness
- do not introduce new architecture without explicit approval

If a change would broaden scope, stop at the smallest safe implementation.

---

### 2) Keep current stack
Must fit current stack:
- Next.js App Router
- TypeScript
- Prisma
- Neon/Postgres
- Tailwind
- next-intl
- existing Quote/RFQ/Admin architecture

Do not introduce new libraries unless explicitly requested.

---

### 3) Prefer practical production fixes
Choose:
- simple
- explicit
- readable
- easy to maintain

Avoid:
- clever abstractions
- unnecessary generic helpers
- premature optimization
- large-scale rewrites unless explicitly requested

---

## Architecture Boundaries

### app/
Purpose:
- routing
- page composition
- server entry points
- API routes

Rules:
- keep page files thin
- `page.tsx` should be Server Component by default
- do not put heavy business logic in page files
- do not place search scoring/filtering logic in app pages
- interactive UI belongs in client components, not server page files

### components/
Purpose:
- presentational UI
- small interactive UI blocks

Rules:
- components should not own domain/business logic
- components may manage local UI state only
- components must not implement search scoring
- components must not implement RFQ business rules
- components must not contain backend/data-layer logic

Allowed in components:
- rendering
- local toggles
- input display state
- visual loading state
- composing hooks

Not allowed in components:
- search ranking algorithms
- database logic
- API persistence logic
- multi-step business orchestration

### hooks/
Purpose:
- UI orchestration
- debounced inputs
- derived state
- component-level workflow helpers

Rules:
- hooks may coordinate state and timing
- hooks may call pure functions from `lib/`
- hooks must not absorb domain logic that belongs in `lib/`
- hooks should stay focused and not become mini frameworks

Good examples:
- debounce handling
- search orchestration
- UI filtering state
- result limiting for rendering

Bad examples:
- scoring algorithms
- Prisma logic
- email sending
- route persistence logic

### lib/
Purpose:
- business logic
- search logic
- utilities
- backend helpers
- domain rules

Rules:
- pure domain logic belongs here
- search scoring belongs here
- reusable data normalization belongs here
- RFQ/business validation helpers belong here

Good examples:
- `lib/search/search.ts`
- normalization
- scoring
- reusable validation logic

### providers/
Purpose:
- app-wide client context

Rules:
- only global/shared client state belongs here
- do not move ordinary feature logic into providers unnecessarily

### prisma/
Purpose:
- schema
- migrations
- seed
- DB model evolution

Rules:
- schema changes must be intentional
- avoid schema churn during UI tasks
- do not edit schema unless the task requires DB changes

---

## Search System Rules

Search is a core conversion engine.

### Required rules
- search business logic must stay in `lib/search/search.ts`
- UI components must not implement scoring logic
- search components must use hooks for orchestration
- hooks may debounce and cap results
- result rendering should be limited for performance
- optimize for mobile responsiveness

### Search performance rules
- do not run heavy search logic directly inside render
- use debounced query handling for text input
- use memoization when transforming large product arrays
- cap rendered result count
- preserve perceived responsiveness on mobile

### Search UX rules
- search-first is the primary user flow
- empty state should lead toward RFQ / assisted conversion
- exact or likely part matches should be prioritized
- do not turn search into a browse-heavy catalog experience unless explicitly requested

---

## RFQ Rules

RFQ is a core business flow.

### Must preserve
- simple submission flow
- low friction
- quote list to RFQ pipeline
- admin review workflow
- email/LINE notification integrity

### Do not do casually
- change RFQ payload shape
- alter admin flow structure
- rename API contracts
- change notification behavior
- modify dedupe/rate-limit logic
without explicit request

---

## Admin Rules

Admin is for operational handling, not visual experimentation.

Rules:
- prioritize clarity over fancy UI
- preserve status visibility
- preserve item visibility
- preserve note/follow-up usefulness
- do not rename RFQ concepts inconsistently

### Naming rule
Use:
- `rfq` for singular UI/business entity
- `rfqs` for plural collections/endpoints

Do not introduce:
- `rgq`
- `rgqs`
- mixed variants

This rule is strict.

---

## App Router / Client-Server Boundary Rules

### Server-first rule
In App Router:
- `page.tsx` should stay server by default
- only move interactivity into dedicated client components

### Client component rule
Use `"use client"` only when required, such as:
- `useState`
- `useEffect`
- browser-only APIs
- event-driven UI behavior

Do not mark whole pages as client unnecessarily.

### next-intl rule
- only use locale hooks where the proper context exists
- if a page is outside locale/provider scope, do not use locale hooks there
- avoid introducing prerender errors through client-only locale assumptions

---

## TypeScript Rules

### Strictness
- no implicit `any`
- prefer explicit types at API boundaries
- prefer stable, readable typing over clever typing

### API route rules
- route handlers should return predictable JSON shape
- explicitly type transformed data if inference becomes unstable
- avoid fragile type tricks if they slow delivery or break builds

### Preferred style
- explicit callback parameter types when needed
- simple local shape types are acceptable
- production reliability is more important than type cleverness

---

## File Editing Rules for Codex / Agents

When modifying code:

### Always do
- inspect the exact target file first
- preserve existing conventions where reasonable
- keep patch size minimal
- explain what changed and why
- avoid touching unrelated imports or paths
- respect existing folder structure unless there is a clear reason not to

### Never do
- silently move files without saying so
- rename routes casually
- rewrite large files for style only
- introduce unrelated cleanup
- swap architectural patterns without approval

---

## Allowed Change Size

### Small task
Examples:
- TS error
- build fix
- loading state
- debounce
- API typing fix

Expected:
- minimum viable patch
- no unrelated refactor

### Medium task
Examples:
- search orchestration split
- admin flow cleanup
- page/client separation

Expected:
- focused refactor
- preserve current behavior
- document file changes clearly

### Large task
Examples:
- schema change
- RFQ contract change
- localization restructure
- deployment architecture

Expected:
- do not proceed broadly without explicit instruction

---

## UI/UX Rules

The UI style should feel:
- clean
- trustworthy
- enterprise-ready
- conversion-focused

Avoid:
- noisy layouts
- overly playful design
- unnecessary animations
- excessive visual density

### Product/search pages
Prioritize:
- fast search input
- clear result cards
- easy RFQ path
- useful empty states

### Admin pages
Prioritize:
- operational clarity
- fast scanning
- direct actions
- reliable data visibility

---

## Performance Rules

Prioritize practical wins:
- debounce search input
- memoize large transforms
- limit rendered results
- avoid heavy re-renders
- preserve mobile responsiveness

Do not:
- introduce worker/virtualization/caching complexity
unless profiling or actual pain justifies it

---

## i18n Rules

The language strategy must remain controlled.

Rules:
- do not mix locale-aware and non-locale-aware paths carelessly
- do not add locale logic into components unless needed
- keep translations centralized where possible
- avoid hardcoding mixed-language UX in newly modified areas unless consistent with the existing page

If a page is non-localized or outside provider scope:
- do not use locale hooks there

---

## Deployment Safety Rules

Before considering a task done:
- build must pass
- affected flow should be manually smoke tested
- route names must be consistent
- no new TypeScript errors introduced

For risky changes:
- prefer build-safe incremental patches

---

## Preferred Response Style for Agents

When implementing:
1. state what files changed
2. state why they changed
3. keep the patch narrow
4. mention any risks or follow-up checks
5. do not claim broad improvements beyond the actual patch

---

## Current Known Priorities
1. performance, especially mobile search responsiveness
2. conversion refinement
3. architecture discipline
4. prevent scope leakage
5. deployment readiness

---

## Summary Rule
This project should evolve like a disciplined B2B production system.

That means:
- narrow patches
- stable naming
- server/client boundary discipline
- search logic in `lib`
- orchestration in hooks
- UI in components
- no unnecessary scope expansion