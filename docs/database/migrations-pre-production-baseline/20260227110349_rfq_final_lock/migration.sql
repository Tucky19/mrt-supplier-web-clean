/*
  Warnings:

  - You are about to drop the `EventLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuoteItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuoteRequest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Rfq` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('new', 'in_progress', 'quoted', 'closed', 'spam');

-- CreateEnum
CREATE TYPE "RfqEventType" AS ENUM ('created', 'emailed_admin', 'emailed_customer', 'email_failed', 'viewed', 'status_changed', 'note_added');

-- DropForeignKey
ALTER TABLE "EventLog" DROP CONSTRAINT "EventLog_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "QuoteItem" DROP CONSTRAINT "QuoteItem_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "QuoteRequest" DROP CONSTRAINT "QuoteRequest_leadId_fkey";

-- DropIndex
DROP INDEX "RfqItem_productId_idx";

-- AlterTable
ALTER TABLE "Rfq" ADD COLUMN     "contactPref" TEXT,
ADD COLUMN     "ipHash" TEXT,
ADD COLUMN     "lineId" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'web',
ADD COLUMN     "status" "RfqStatus" NOT NULL DEFAULT 'new',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "RfqItem" ADD COLUMN     "meta" JSONB;

-- DropTable
DROP TABLE "EventLog";

-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "QuoteItem";

-- DropTable
DROP TABLE "QuoteRequest";

-- DropEnum
DROP TYPE "QuoteStatus";

-- CreateTable
CREATE TABLE "RfqEvent" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "type" "RfqEventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfqEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RfqEvent_rfqId_createdAt_idx" ON "RfqEvent"("rfqId", "createdAt");

-- CreateIndex
CREATE INDEX "RfqEvent_type_createdAt_idx" ON "RfqEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "Rfq_createdAt_idx" ON "Rfq"("createdAt");

-- CreateIndex
CREATE INDEX "Rfq_status_createdAt_idx" ON "Rfq"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "RfqEvent" ADD CONSTRAINT "RfqEvent_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "Rfq"("id") ON DELETE CASCADE ON UPDATE CASCADE;
