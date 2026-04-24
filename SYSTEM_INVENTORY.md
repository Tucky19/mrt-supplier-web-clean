# MRT Supplier — System Inventory

## 1. Overview

MRT Supplier is a B2B industrial parts platform focused on:

Search → Product → Quote → RFQ → Admin Follow-up

Primary goal:
- Help customers quickly find parts
- Convert search into RFQ (Request for Quotation)

---

## 2. Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Neon)
- Nodemailer (Zoho SMTP)
- next-intl (i18n)
- Vercel (deployment)

---

## 3. Core User Flow

### 1. Search
User searches by:
- Part number
- Keyword
- Spec

### 2. Product List
- Filter by brand
- Ranked results (search scoring)

### 3. Product Detail
- Part info
- Spec
- Cross references
- Official link

### 4. Quote / RFQ
- Add items to quote
- Submit RFQ

### 5. Admin
- Receive RFQ
- Update status
- Follow up

---

## 4. Frontend Modules

### Product Search

Files:
- app/[locale]/products/page.tsx
- components/products/ProductListClient.tsx
- hooks/useProductSearch.ts
- lib/search/search.ts
- data/search-index.v2.json

Notes:
- search uses scoring system
- search index is prebuilt JSON
- exact part match must always rank highest

---

### Product Card

File:
- components/products/ProductCard.tsx

Responsibilities:
- Display product
- Link to detail page
- RFQ entry point

IMPORTANT:
- Must link using correct identifier (id or partNo)
- Wrong mapping will cause 404 on detail page

---

### Product Detail

Files:
- app/[locale]/products/[id]/page.tsx
- components/products/detail/*

Responsibilities:
- Resolve product by id or partNo
- Render full product info

Common bug:
- incoming id does not match catalog → notFound()

---

### Quote / RFQ System

Features:
- Add to quote
- Quote page
- Submit RFQ
- Email + LINE notification

Key paths:
- /quote
- /api/rfq/submit

---

## 5. Admin System

### RFQ Dashboard

Pages:
- /[locale]/admin/rfq
- /[locale]/admin/rfq/[id]

Capabilities:
- View RFQs
- Update status
- Add notes
- Follow-up tracking

API:
- /api/admin/rfq/*
- /api/admin/rfqs/*

NOTE:
- There are both canonical and legacy routes
- Do not overwrite with simplified version

---

## 6. Product Data System

### Canonical Catalog (IMPORTANT)

File:
- data/products/index.ts

This is the ONLY source used by UI.

---

### Product Sources

Brand sources:
- brand-donaldson
- brand-ntn
- brand-mann

Batch sources:
- products.batch4.ts
- products.batch4.featured.ts
- other batch files

---

### Data Rules (CRITICAL)

1. All products must be merged into:
   → data/products/index.ts

2. product.partNo MUST exist
   → missing partNo will break system

3. Deduplication:
   → based on normalized partNo

---

### Search Index

File:
- data/search-index.v2.json

Used for:
- fast search runtime

IMPORTANT:
- If product data changes, index may need rebuild
- UI uses index + product catalog together

---

## 7. Environment Variables

Required:

DATABASE_URL=
NEXT_PUBLIC_SITE_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

RFQ_TO_EMAIL=
RFQ_FROM_EMAIL=

LINE_CHANNEL_ACCESS_TOKEN=
LINE_TARGET_USER_ID=

ADMIN_BASIC_USER=
ADMIN_BASIC_PASS=

---

## 8. Deployment

Platform:
- Vercel

Commands: