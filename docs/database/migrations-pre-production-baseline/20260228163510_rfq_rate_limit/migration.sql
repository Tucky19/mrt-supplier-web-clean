-- CreateTable
CREATE TABLE "RfqRateLimit" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RfqRateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RfqRateLimit_windowStart_idx" ON "RfqRateLimit"("windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "RfqRateLimit_ipHash_windowStart_key" ON "RfqRateLimit"("ipHash", "windowStart");
