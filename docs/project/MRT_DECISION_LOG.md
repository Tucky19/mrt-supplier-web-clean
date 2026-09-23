# MRT Supplier — Decision Log

Last updated: 2026-09-24 (Asia/Bangkok)

Purpose:
Record decisions that materially affect scope, pricing, campaign strategy, channels, website behavior, data governance, or project-management workflow. This explains not only WHAT is being done, but WHY.

## 2026-09-24 — Use a Central Project Manager Workflow

Decision:
MRT Supplier work should enter through a central PM conversation instead of requiring Boss to decide which specialist chat to use.

Reason:
Work had become spread across website, SEO, ads, content, CRM, product data, and sales chats, creating duplicate tasks and unclear status.

Operating model:
Boss -> PM -> appropriate workstream/tool -> result returns to PM -> Master Status updated.

## 2026-09-24 — Create Durable Project State Outside Chat History

Decision:
Use GitHub files as durable project-management state:
- `docs/project/MRT_MASTER_PROJECT_STATUS.md`
- `docs/project/MRT_DECISION_LOG.md`

Reason:
Chat history can become too long or require migration. Project continuity must not depend on one conversation window.

Handoff phrase:
"ต่อ Project Manager MRT Supplier จาก Master Project Status ล่าสุด"

## 2026-09-24 — Project Priority Is New Online Customers

Decision:
Primary operating goal remains approximately 8–10 new online customers per month.

Implication:
Website, content, ads, outreach, CRM, and product-data work should be evaluated by their contribution to qualified acquisition / RFQ / conversion, not activity volume alone.

## 2026-09-24 — W 962/14 Is a Customer Acquisition Campaign, Not Clearance

Decision:
Use MANN-FILTER W 962/14 as an entry product to attract new online B2B customers.

Context:
W 962/14 already sells on its own and current stock is approximately 700–800 pieces. The campaign is intended to accelerate online new-customer acquisition rather than clear inventory.

Implication:
Do not use clearance language or low-stock claims.

## 2026-09-24 — W 962/14 Promotional Pricing

Decision:
- Standard selling range: THB 320–350 / piece
- New online customer promo: THB 270 / piece
- First-order 10-piece pack: THB 2,500 (THB 250 / piece)
- Internal cost basis supplied: THB 200 / piece

Reason:
THB 270 provides a meaningful first-order incentive while retaining more margin.
THB 250 is reserved for a 10-piece condition to increase initial order value and should not become the perceived normal single-piece price.

Guardrail:
Do not automatically continue the THB 250 pricing after the campaign.

## 2026-09-24 — W 962/14 Campaign Duration

Decision:
Run the initial campaign for 14 days:
2026-09-28 through 2026-10-11.

Review:
- Day 7 midpoint review
- Final review after campaign end

Reason:
A B2B buyer may need time to verify Part Number, usage, quantity, and purchasing approval. A 14-day window also provides more useful acquisition data than an ultra-short flash sale.

## 2026-09-24 — W 962/14 Campaign KPI

Decision:
Evaluate by new-customer acquisition rather than units moved.

Initial target:
5–10 qualified new companies in 14 days.

Track:
- new companies/leads
- qualified RFQs
- first quotations
- new-customer first orders
- cost per qualified lead/customer
- downstream cross-sell interest

Reason:
The strategic value is the new B2B account and future purchases of other compressor / industrial filtration products.

## 2026-09-24 — W 962/14 Channel Strategy

Decision:
- Google Search = primary high-intent channel
- Website/RFQ = conversion destination
- LINE OA = inquiry and follow-up
- Email outreach = selected prospects
- Facebook = awareness / retargeting support

Reason:
W 962/14 already has existing product demand and Part Number intent. High-intent search should be prioritized over broad demand-generation alone.

## 2026-09-24 — W 962/14 Compatibility Messaging

Decision:
Describe W 962/14 precisely as a hydraulic filter with verified compressor applications.

Known verified application families recorded for campaign support include:
- Dalgakiran DVK
- Fini ROTAR
- Schulz SRP
- Sullair F / S series
- Bottarini GBV

Guardrail:
Do not imply universal compatibility with all air compressors.

## 2026-09-24 — Product Listing Needs Stronger Visual Hierarchy

Decision:
Improve ProductCardV2 so Part Number and RFQ/Add-to-Quote actions lead the visual hierarchy.

Reason:
Current product cards present many pieces of information with similar visual weight, making products feel less prominent and slowing scanning.

Implementation:
Draft PR #151, not yet merged.

## Existing Standing Decisions Carried Forward

### LINE visibility
Keep LINE visible on website/RFQ because it is a core contact and ordering channel.

### Content
Prefer short, practical Thai technical content connected to product pages and RFQ rather than long general articles.

### Cross-reference governance
Cross-reference changes require evidence and controlled relation types; unknown or uncertain relations should not be presented as verified equivalence.

### Ads
Judge paid media by qualified leads / RFQs / new customers, not clicks or reach alone.

### HubSpot
Use CRM first for basic lead tracking. Defer complex automation until the pipeline is stable.

### Product-data prioritization
Prioritize commercially relevant products (sales/search/customer/campaign demand) rather than bulk catalog expansion for its own sake.

## How to Add a Decision

For each material decision record:
- Date
- Decision
- Reason
- Implication / guardrail
- Related PR/campaign when relevant

Do not log routine micro-edits unless they materially affect project direction.
