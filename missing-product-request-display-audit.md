# Missing Product Request Display Audit

Source files reviewed:
- [app/api/missing-product-request/route.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/api/missing-product-request/route.ts)
- [lib/mail.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/lib/mail.ts)
- [lib/line/sendRfqLineNotification.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/lib/line/sendRfqLineNotification.ts)
- [app/admin/rfq/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/admin/rfq/page.tsx)
- [app/admin/rfq/[id]/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/admin/rfq/[id]/page.tsx)
- [app/api/admin/rfqs/route.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/api/admin/rfqs/route.ts)
- [app/api/admin/rfqs/[id]/route.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/api/admin/rfqs/[id]/route.ts)
- [prisma/schema.prisma](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/prisma/schema.prisma)

Scope:
- Audit/report only
- No schema or product-data changes made

## Overall Verdict

Missing Product Request submissions are saved with enough raw information to be operationally usable, but readability is uneven across channels.

Current state:
- Admin RFQ list: only partially readable
- Admin RFQ detail: readable, but important fields are flattened into notes instead of shown as structured request data
- Admin email: readable enough for staff follow-up
- Customer confirmation email: weak for Missing Product Request specifics
- LINE notification: strongest structured format right now

Main architectural finding:
- The route stores rich Missing Product Request data in `RfqItem.meta`
- Current admin UI does not render `RfqItem.meta`
- Admin detail mostly relies on:
  - top-level `rfq.note`
  - item `category`
  - item `spec`
- The deprecated-style admin detail API route also does not expose item `meta`

## Data Flow Observed

`app/api/missing-product-request/route.ts` stores Missing Product Request submissions as:
- `rfq.source = "missing_product_request"`
- `rfq.requestId = MPR-...`
- `rfq.note =` multi-line text built from:
  - details/note
  - filter type
  - brand
  - machine/application
  - dimensions
  - search query
  - source page
  - locale
- one `RfqItem` with:
  - `partNo`
  - `brand`
  - `title = "Missing Product Request"`
  - `category = filterType`
  - `spec = dimensionSummary`
  - `qty`
  - `meta = { requestType, machineApplication, details, dimensions, contact }`

This means the data exists, but downstream presentation is mostly text-based, not structured.

## 1. Admin RFQ List

File:
- [app/admin/rfq/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/admin/rfq/page.tsx)

### What is readable now

- `requestId`: visible
- `source`: visible as `Source: missing_product_request`
- customer company/name: visible
- phone/email/LINE ID: visible
- item count: visible
- status/created time: visible

### What is missing

- no label or badge clearly calling this a “Missing Product Request”
- no `partNo` preview
- no `filterType`
- no `brand` preview for the requested item
- no `qty` preview beyond item count
- no dimension preview
- no machine/application preview
- no note/details preview
- no search/sourcePage/locale preview

### Readability assessment

- Staff can tell the RFQ came from `missing_product_request`
- Staff cannot quickly scan the actual request contents from the list view
- For operations, this likely forces opening the detail page every time

## 2. Admin RFQ Detail

File:
- [app/admin/rfq/[id]/page.tsx](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/admin/rfq/[id]/page.tsx)

### What is readable now

- `requestId`: clearly visible in page header
- `partNo`: visible in Requested Items table
- `filterType`: visible indirectly as item `category`
- `brand`: visible in Requested Items table
- `qty`: visible in Requested Items table
- dimensions:
  - visible indirectly through item `spec`
  - also visible inside `rfq.note` as `Dimensions: ...`
- machine/application:
  - visible inside `rfq.note`
- note/details:
  - visible inside `rfq.note`
- contact methods:
  - phone, email, lineId shown clearly in Customer Information
- source:
  - visible in Meta section as `missing_product_request`
- locale:
  - only visible inside `rfq.note`
- sourcePage/searchQuery:
  - only visible inside `rfq.note`

### What is missing

- no dedicated “Missing Product Request” section
- no explicit label on the page header or item row saying this is not a normal catalog RFQ
- `RfqItem.meta` is not rendered at all
- dimensions are compressed into one line instead of separated fields:
  - OD
  - ID
  - Length/Height
  - Thread
  - Gasket OD
  - Gasket ID
- machine/application is not separated from general notes
- sourcePage/searchQuery/locale are buried in the note block
- item title is always `Missing Product Request`, which is useful as a signal but not enough on its own

### Readability assessment

- Admin detail is usable today
- The operator can recover most of the request
- But it is not polished for fast scanning, because important fields are packed into `rfq.note` rather than rendered from `RfqItem.meta`

## 3. Admin Email Notification

File:
- [lib/mail.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/lib/mail.ts)

### What is readable now

- `requestId`: visible
- customer company/name/phone/email/LINE ID: visible
- item table shows:
  - `partNo`
  - `brand`
  - item title
  - `category` which carries `filterType`
  - `qty`
- staff note block includes `customer.note`
  - for Missing Product Request this is the stored multiline note
  - so it includes:
    - note/details
    - filterType
    - brand
    - machineApplication
    - dimensions
    - searchQuery
    - sourcePage
    - locale

### What is missing

- no explicit “Missing Product Request” label in subject or heading
- dimensions are not broken into separate rows or bullets
- `searchQuery`, `sourcePage`, and `locale` are only visible if staff reads the Note block carefully
- `filterType` appears twice in different forms:
  - item category
  - note text
  This is acceptable, but slightly redundant

### Readability assessment

- Admin email is readable now
- It is the most complete email channel because `customer.note` carries the extra request context
- Main weakness is presentation polish, not data loss

## 4. Customer Confirmation Email

File:
- [lib/mail.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/lib/mail.ts)

### What is readable now

- `requestId`: visible
- item table shows:
  - `partNo`
  - `brand`
  - title
  - category/filterType
  - `qty`

### What is missing

- no missing-product-specific wording
- no machine/application
- no dimension breakdown
- no customer-entered note/details
- no searchQuery/sourcePage/locale
- no clear recap that the request was saved as a “Missing Product Request”
- no explicit confirmation of contact method received

### Readability assessment

- Customer confirmation is functional but thin
- It confirms receipt of the RFQ, not the specific Missing Product Request details
- For this flow, the customer email is currently the weakest display surface

## 5. LINE Notification

Files:
- [app/api/missing-product-request/route.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/app/api/missing-product-request/route.ts)
- [lib/line/sendRfqLineNotification.ts](/c:/Users/lkjhg/Projects/mrt-supplier-web-clean/lib/line/sendRfqLineNotification.ts)

### What is readable now

- `requestId`
- company/name/phone/email
- item count
- `partNo`
- `filterType`
- `brand`
- `qty`
- `machineApplication`
- dimension summary
- `lineId`
- note/details
- `searchQuery`
- `sourcePage`
- `locale`

### What is missing

- no explicit “Missing Product Request” heading
- dimensions are summarized as one line, not field-by-field
- no separate “preferred contact method” concept

### Readability assessment

- LINE notification is the clearest operational channel right now
- It includes nearly all requested audit fields in a structured line-by-line format

## Field Coverage Check

### `requestId`

- Admin RFQ list: yes
- Admin RFQ detail: yes
- Admin email: yes
- Customer confirmation email: yes
- LINE: yes

### `partNo`

- Admin RFQ list: no
- Admin RFQ detail: yes
- Admin email: yes
- Customer confirmation email: yes
- LINE: yes

### `filterType`

- Admin RFQ list: no
- Admin RFQ detail: partial via item category and note
- Admin email: yes
- Customer confirmation email: partial via item category
- LINE: yes

### `brand`

- Admin RFQ list: no item brand preview
- Admin RFQ detail: yes
- Admin email: yes
- Customer confirmation email: yes
- LINE: yes

### `qty`

- Admin RFQ list: only item count, not item qty
- Admin RFQ detail: yes
- Admin email: yes
- Customer confirmation email: yes
- LINE: yes

### `machineApplication`

- Admin RFQ list: no
- Admin RFQ detail: yes, but only inside note
- Admin email: yes, but inside note
- Customer confirmation email: no
- LINE: yes

### `OD / ID / Length / Thread / Gasket`

- Admin RFQ list: no
- Admin RFQ detail: partial via summary line and note
- Admin email: partial via summary line and note
- Customer confirmation email: no
- LINE: partial via summary line

### `note`

- Admin RFQ list: no
- Admin RFQ detail: yes
- Admin email: yes
- Customer confirmation email: no
- LINE: yes

### `contact method`

- Admin RFQ list: yes
- Admin RFQ detail: yes
- Admin email: yes
- Customer confirmation email: not recapped back to user
- LINE: yes

### `sourcePage / searchQuery / locale`

- Admin RFQ list: no
- Admin RFQ detail: only inside note
- Admin email: only inside note
- Customer confirmation email: no
- LINE: yes

## `RfqItem.meta` Usage Audit

### Current storage

`RfqItem.meta` is used in the submit route to store:
- `requestType`
- `filterType`
- `machineApplication`
- `details`
- `dimensions`
- `contact`

### Current rendering/API usage

- Admin detail page does not render `item.meta`
- Admin list does not render `item.meta`
- Reviewed admin detail API route does not include `item.meta`
- Mail functions do not receive or render `item.meta`

### Impact

- Important Missing Product Request structure exists in the database
- But current UI/email surfaces mostly ignore it
- This is the main reason the display feels flattened

## Recommended UI / Email Polish

### High-value admin polish

- Add a clear badge or label: `Missing Product Request`
- In admin RFQ list, show a compact second line for these entries:
  - partNo or `MISSING-PRODUCT`
  - filterType
  - short dimension summary
- In admin RFQ detail, add a dedicated block for Missing Product Request fields:
  - partNo
  - filterType
  - brand
  - qty
  - machine/application
  - OD
  - ID
  - Length/Height
  - Thread
  - Gasket OD
  - Gasket ID
  - sourcePage
  - searchQuery
  - locale
- Prefer rendering those fields from `RfqItem.meta` instead of parsing `rfq.note`

### Email polish

- Admin email:
  - add a header label such as `Missing Product Request`
  - split measured dimensions into separate bullet lines or rows
  - separate `sourcePage`, `searchQuery`, and `locale` from the generic Note block
- Customer confirmation email:
  - add a short recap section specifically for Missing Product Request
  - include machine/application
  - include measured dimensions
  - include free-text details/note
  - optionally include a line that the team will verify cross reference / application before quoting

### LINE polish

- Add a top label such as `Missing Product Request`
- Optional: split dimensions into individual lines when present

## Does Admin Need A Label Like “Missing Product Request”?

Yes.

Reason:
- `rfq.source = "missing_product_request"` exists, but it is too subtle in the current list/detail presentation
- these requests behave differently from normal catalog RFQs
- operators benefit from instantly knowing:
  - this may not map to a normal product
  - dimensions and machine/application matter more
  - follow-up may require lookup/identification rather than quotation only

Recommended wording:
- `Missing Product Request`
- or shorter admin badge: `Missing Product`

## Bottom Line

Readable now:
- Admin detail
- Admin email
- LINE notification

Weak or flattened now:
- Admin list
- Customer confirmation email
- any structured use of `RfqItem.meta`

Highest-value next improvement:
- Add a visible `Missing Product Request` label in admin
- Render `RfqItem.meta` as structured fields in admin detail instead of depending on the note blob
