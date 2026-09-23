# MRT Supplier — Master Project Status

Last updated: 2026-09-24 (Asia/Bangkok)
Repository: Tucky19/mrt-supplier-web-clean
Production site: https://www.mrtsupplier.com
Project owner: Boss
Primary operating goal: acquire 8–10 new online customers per month while improving the website, product data, lead handling, and repeatable B2B acquisition system.

> This file is the durable source of truth for project-management continuity.
> When a PM chat becomes too long or must be replaced, the new chat should read this file and `MRT_DECISION_LOG.md` before planning work.

## PM Operating Rules

1. This PM chat is the intake point for MRT Supplier work.
2. Do not create duplicate work before checking existing status, branches, PRs, campaigns, or waiting items.
3. Prioritize:
   - customer / revenue impact,
   - blockers,
   - website/data reliability,
   - marketing execution,
   - long-term improvements.
4. External-system waiting states (indexing, ad learning, vendor responses) stay marked Waiting instead of becoming daily tasks.
5. Major decisions must be added to `MRT_DECISION_LOG.md`.
6. Material project status changes must update this file.
7. New chat handoff phrase:
   - "ต่อ Project Manager MRT Supplier จาก Master Project Status ล่าสุด"
8. A new PM session should verify current GitHub/ads/CRM state before assuming a historical status is still current.

## Status Legend

- 🟢 Done / stable
- 🔵 In progress
- 🟡 Waiting / monitoring / review
- 🔴 Blocked / issue
- ⚪ Not started

## Current Top Priorities

### P1 — W 962/14 New Online Customer Acquisition Campaign
Status: 🔵 In progress

Purpose:
- Use a product that already sells organically to attract new online B2B accounts.
- This is NOT a clearance campaign and NOT an inventory liquidation exercise.

Approved commercial structure:
- Standard selling range: THB 320–350 / piece
- New online customer promo: THB 270 / piece
- First-order pack: 10 pieces for THB 2,500 (THB 250 / piece)
- Internal cost basis supplied by owner: THB 200 / piece
- Current stock estimate: ~700–800 pieces
- Campaign window: 2026-09-28 through 2026-10-11
- Midpoint review: Day 7
- Initial KPI: 5–10 qualified new companies in 14 days

Positioning:
- MANN-FILTER W 962/14
- Hydraulic filter with verified compressor applications
- Use precise application wording; do not claim universal compatibility with all air compressors.

Verified compressor-related applications currently recorded:
- Dalgakiran Compressors DVK series
- Fini ROTAR
- Schulz Compressors SRP series
- Sullair F series / S series
- Bottarini GBV series

Channel roles:
- Google Search: primary high-intent acquisition channel
- Website / RFQ: product discovery and conversion
- LINE OA: inquiry and follow-up
- Email outreach: selected compressor-related prospects
- Facebook: awareness / remarketing support, not the primary intent channel

Current implementation:
- Draft PR #151
- Branch: `pm/product-card-w962-campaign`
- PR includes:
  - stronger product-card hierarchy,
  - more prominent Part Number,
  - stronger Add to Quote CTA,
  - W 962/14 compressor application / OE enrichment,
  - campaign brief.
- Do not merge PR #151 until final website copy/layout is reviewed.

Next actions:
1. Add final campaign offer presentation to W 962/14 product experience.
2. Prepare Google Search campaign structure / keywords.
3. Prepare LINE / email / Facebook support copy.
4. Ensure new leads are tagged as new-online-customer acquisition.
5. Review campaign after 7 days and at campaign end.

### P2 — Lead Tracking / Sales Pipeline
Status: 🔵 In progress

Goal:
All new leads should be traceable regardless of source.

Common pipeline:
New Lead -> Contacted -> Need Identified -> RFQ -> Quotation -> Follow-up -> Won / Lost

Minimum fields:
- Company
- Contact / customer
- Source
- Product / need
- Contact date
- Status
- Next action

Lead sources:
- Website RFQ
- LINE OA
- Facebook
- Google Ads / Search
- Email outreach

CRM direction:
- HubSpot may be used for lead/status tracking.
- Avoid complex automation until the basic pipeline is reliable.

Primary KPI:
- Qualified new companies
- RFQs
- Quotations
- New-customer first orders
- Follow-on / cross-sell interest

### P3 — Website Product Discovery / Conversion
Status: 🔵 In progress

Current finding:
Product cards were visually too flat; Part Number, image, specifications, status, quantity controls, links, and CTA competed for attention.

Current improvement:
Draft PR #151 strengthens:
- Part Number hierarchy
- product image prominence
- Add to Quote CTA prominence
- lower visual weight for secondary information

Rule:
Do not spend time on small cosmetic changes unless they improve search, trust, RFQ, conversion, mobile usability, or campaign performance.

## Workstream Status

### Website / Production
Status: 🟢 / 🔵

Stable:
- Production site running on Vercel
- Next.js 16.x
- RFQ flow exists
- Site header/footer and key B2B UX improvements already deployed
- LINE CTA is intentionally retained and should remain visible

In progress:
- Product-card hierarchy work in PR #151

Guardrail:
- Use branch + PR workflow for changes.
- Do not merge campaign-specific changes without review.

### Product Data
Status: 🔵

Primary catalog brands:
- Donaldson
- MANN-FILTER
- NTN Bearing

Approximate active catalog: ~453 items.

Current data governance:
- Cross-reference relation types include:
  - equivalent
  - replaced_by
  - alternative
  - companion
  - local_equivalent
  - unknown
- Evidence / approval matters for cross-reference changes.

Current W 962/14:
- MANN-FILTER
- Hydraulic Filter
- Compressor application data added on PR #151 branch.

Rule:
Prioritize products with sales demand, search demand, customer requests, or campaign relevance instead of bulk data expansion without commercial reason.

### SEO / Content
Status: 🔵

Operating plan:
- 2 content items per week
- Prefer practical Thai technical explainers based on OEM knowledge
- Link content back to relevant product pages / RFQ
- Avoid long articles without commercial purpose

Primary sources:
- Donaldson
- MANN-FILTER
- NTN

Goal:
Part Number / cross-reference / technical-search traffic -> product page -> RFQ.

### Google Search Console
Status: 🟡 Waiting / monitoring

Known:
- Domain verified
- Live URL inspection previously passed
- Indexing requests submitted

Rule:
Do not repeatedly resubmit every day.
Monitor indexing / coverage and act only on specific issues.

### Google Ads
Status: 🔵

Known budget baseline:
- ~THB 200/day from current setup period

Campaign approach:
- High-intent industrial search
- For W 962/14 prioritize:
  - exact / close Part Number intent
  - relevant OE references
  - relevant compressor application intent

Success metric:
Qualified new-company acquisition, not clicks alone.

### Facebook
Status: 🔵 / 🟡

Known:
- Page exists
- Ads previously launched
- Prior approved spend: THB 1,400 / 7 days
- Leads have started appearing but quality must be assessed

Contact strategy:
- LINE OA and website
- Do not rely on Messenger as the core inquiry channel

For W 962/14:
Use Facebook as awareness / support / retargeting rather than the principal high-intent channel.

### LINE OA
Status: 🟢

Role:
- Contact / inquiry / RFQ support
- Keep LINE CTA visible
- Can store reusable sales messages for easy sending

### Email Outreach
Status: 🔵

Operating baseline:
- 5 companies/day, Monday–Friday
- Focus on new online prospects
- Once an outreach batch is approved, sending does not require repeated approval unless the strategy changes

Need:
Track evidence, company, date, response, and follow-up.

### HubSpot / CRM
Status: 🟡 / 🔵

Current stage:
- Basic setup / learning
- Useful primarily for tracking lead status

Guardrail:
Do not build complex workflows before the basic lead pipeline and data capture are proven.

### RFQ / Sales
Status: 🔵

Known:
- Website RFQ flow operational
- LINE remains a core CTA

Priority:
Every qualified lead must have a next action and should not disappear between channels.

## Important Open PRs / Branches

### PR #151
Title: Improve product card hierarchy and prepare W 962/14 compressor campaign
Branch: `pm/product-card-w962-campaign`
Status: Draft / not merged
Purpose:
- Product-card hierarchy
- W 962/14 compressor data
- Campaign plan

### Project-control branch
Branch: `pm/project-control-center`
Purpose:
- Durable PM status and decision-log system
- Should be merged independently from campaign work

## Waiting / Do Not Rework Repeatedly

- Search Console indexing: monitor, do not resubmit daily
- Ad-learning periods: collect enough data before major budget/creative conclusions
- HubSpot advanced automation: postpone until lead basics are stable

## Avoid / Deprioritize

- UI polish with no conversion or usability impact
- Adding large volumes of products with no demand signal
- Rebuilding CRM before the pipeline is understood
- Duplicating work across separate chats
- Measuring ad success only by clicks/reach
- Treating W 962/14 promo as stock clearance

## Standard New-Task Intake

When Boss sends a new instruction, PM should classify it as one or more of:
- Website
- Product Data
- Campaign / Marketing
- SEO / Content
- Ads
- Lead / Sales
- CRM
- Operations

Then determine:
1. Is it already done / in progress / waiting?
2. Does it conflict with another task?
3. What is the commercial impact?
4. Who/tool should execute it?
5. What constitutes done?
6. What must be recorded in status / decision log?

## Handoff Checklist for a New Chat

A replacement PM chat should:
1. Read this file.
2. Read `docs/project/MRT_DECISION_LOG.md`.
3. Check current open GitHub PRs before planning code work.
4. Verify current campaign dates/status.
5. Verify any live ad/CRM state when relevant.
6. Continue from the highest-priority incomplete item.
7. Do not ask Boss to retell project history that is already documented.

