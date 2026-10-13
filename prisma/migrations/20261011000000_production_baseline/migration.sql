-- CreateEnum
CREATE TYPE "CrossReferenceType" AS ENUM ('equivalent', 'alternative', 'possible_match');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "RfqEventType" AS ENUM ('created', 'emailed_admin', 'emailed_customer', 'email_failed', 'viewed', 'status_changed', 'note', 'follow_up', 'quote_record', 'quote_document', 'owner_assigned');

-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('new', 'in_progress', 'quoted', 'closed', 'spam');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('in_stock', 'limited', 'preorder', 'unavailable');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "query" TEXT,
    "partNo" TEXT,
    "productId" TEXT,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrossReference" (
    "id" TEXT NOT NULL,
    "fromProductId" TEXT NOT NULL,
    "toProductId" TEXT NOT NULL,
    "relationType" "CrossReferenceType" NOT NULL DEFAULT 'equivalent',
    "confidenceScore" DECIMAL(5,2),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrossReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "note" TEXT,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "doneAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "lineId" TEXT,
    "company" TEXT,
    "name" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "partNo" TEXT NOT NULL,
    "normalizedPartNo" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT,
    "title" TEXT NOT NULL,
    "titleTh" TEXT,
    "titleEn" TEXT,
    "spec" TEXT,
    "description" TEXT,
    "unit" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'active',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rfq" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "note" TEXT,
    "contactPref" TEXT,
    "ipHash" TEXT,
    "lineId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'web',
    "status" "RfqStatus" NOT NULL DEFAULT 'new',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "leadId" TEXT,
    "quoteAmount" DECIMAL(12,2),
    "quoteCurrency" TEXT,
    "quoteDocumentUrl" TEXT,
    "quoteRef" TEXT,
    "quoteSentAt" TIMESTAMP(3),
    "quoteSentNote" TEXT,
    "quotedAt" TIMESTAMP(3),
    "quotedBy" TEXT,
    "validUntil" TIMESTAMP(3),
    "assignedAt" TIMESTAMP(3),
    "assignedTo" TEXT,

    CONSTRAINT "Rfq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfqEvent" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "type" "RfqEventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfqEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfqItem" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "productId" TEXT,
    "partNo" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "title" TEXT,
    "spec" TEXT,
    "qty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "RfqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfqNote" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfqNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfqRateLimit" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RfqRateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "query" TEXT,
    "partNo" TEXT,
    "matchType" TEXT,
    "resultCount" INTEGER,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "lineId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "reliabilityScore" DECIMAL(4,2),
    "leadTimeMinDays" INTEGER,
    "leadTimeMaxDays" INTEGER,
    "note" TEXT,
    "status" "SupplierStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPrice" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierPartNo" TEXT,
    "costAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "freightAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "handlingAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "importAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalCostAmount" DECIMAL(12,2) NOT NULL,
    "availableQty" INTEGER,
    "minOrderQty" INTEGER NOT NULL DEFAULT 1,
    "leadTimeDays" INTEGER,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "validUntil" TIMESTAMP(3),
    "stockStatus" "StockStatus" NOT NULL DEFAULT 'in_stock',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_query_idx" ON "AnalyticsEvent"("query");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateIndex
CREATE INDEX "CrossReference_fromProductId_idx" ON "CrossReference"("fromProductId");

-- CreateIndex
CREATE INDEX "CrossReference_toProductId_idx" ON "CrossReference"("toProductId");

-- CreateIndex
CREATE UNIQUE INDEX "CrossReference_fromProductId_toProductId_key" ON "CrossReference"("fromProductId", "toProductId");

-- CreateIndex
CREATE INDEX "FollowUp_doneAt_dueAt_idx" ON "FollowUp"("doneAt", "dueAt");

-- CreateIndex
CREATE INDEX "FollowUp_rfqId_dueAt_idx" ON "FollowUp"("rfqId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_phone_key" ON "Lead"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_lineId_key" ON "Lead"("lineId");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_normalizedPartNo_key" ON "Product"("normalizedPartNo");

-- CreateIndex
CREATE INDEX "Product_brand_category_idx" ON "Product"("brand", "category");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- CreateIndex
CREATE INDEX "Product_partNo_idx" ON "Product"("partNo");

-- CreateIndex
CREATE UNIQUE INDEX "Rfq_requestId_key" ON "Rfq"("requestId");

-- CreateIndex
CREATE INDEX "Rfq_createdAt_idx" ON "Rfq"("createdAt");

-- CreateIndex
CREATE INDEX "Rfq_leadId_createdAt_idx" ON "Rfq"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "Rfq_status_createdAt_idx" ON "Rfq"("status", "createdAt");

-- CreateIndex
CREATE INDEX "RfqEvent_rfqId_createdAt_idx" ON "RfqEvent"("rfqId", "createdAt");

-- CreateIndex
CREATE INDEX "RfqEvent_type_createdAt_idx" ON "RfqEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "RfqItem_partNo_idx" ON "RfqItem"("partNo");

-- CreateIndex
CREATE INDEX "RfqItem_productId_idx" ON "RfqItem"("productId");

-- CreateIndex
CREATE INDEX "RfqItem_rfqId_idx" ON "RfqItem"("rfqId");

-- CreateIndex
CREATE INDEX "RfqNote_rfqId_createdAt_idx" ON "RfqNote"("rfqId", "createdAt");

-- CreateIndex
CREATE INDEX "RfqRateLimit_windowStart_idx" ON "RfqRateLimit"("windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "RfqRateLimit_ipHash_windowStart_key" ON "RfqRateLimit"("ipHash", "windowStart");

-- CreateIndex
CREATE INDEX "SearchEvent_createdAt_idx" ON "SearchEvent"("createdAt");

-- CreateIndex
CREATE INDEX "SearchEvent_query_idx" ON "SearchEvent"("query");

-- CreateIndex
CREATE INDEX "SearchEvent_resultCount_idx" ON "SearchEvent"("resultCount");

-- CreateIndex
CREATE INDEX "SearchEvent_type_createdAt_idx" ON "SearchEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "SearchEvent_type_idx" ON "SearchEvent"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Supplier_status_idx" ON "Supplier"("status");

-- CreateIndex
CREATE INDEX "SupplierPrice_productId_idx" ON "SupplierPrice"("productId");

-- CreateIndex
CREATE INDEX "SupplierPrice_stockStatus_idx" ON "SupplierPrice"("stockStatus");

-- CreateIndex
CREATE INDEX "SupplierPrice_supplierId_idx" ON "SupplierPrice"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPrice_supplierId_productId_supplierPartNo_key" ON "SupplierPrice"("supplierId", "productId", "supplierPartNo");

-- AddForeignKey
ALTER TABLE "CrossReference" ADD CONSTRAINT "CrossReference_fromProductId_fkey" FOREIGN KEY ("fromProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrossReference" ADD CONSTRAINT "CrossReference_toProductId_fkey" FOREIGN KEY ("toProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "Rfq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rfq" ADD CONSTRAINT "Rfq_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfqEvent" ADD CONSTRAINT "RfqEvent_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "Rfq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfqItem" ADD CONSTRAINT "RfqItem_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "Rfq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfqNote" ADD CONSTRAINT "RfqNote_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "Rfq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPrice" ADD CONSTRAINT "SupplierPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPrice" ADD CONSTRAINT "SupplierPrice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
