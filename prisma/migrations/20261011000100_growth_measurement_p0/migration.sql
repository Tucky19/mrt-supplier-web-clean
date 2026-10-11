-- Additive only. Reviewed/staged locally; NOT applied to any database by this task.
CREATE TYPE "RfqQualification" AS ENUM ('UNREVIEWED','QUALIFIED','UNQUALIFIED');
ALTER TABLE "Rfq" ADD COLUMN "qualification" "RfqQualification" NOT NULL DEFAULT 'UNREVIEWED',
  ADD COLUMN "qualifiedAt" TIMESTAMP(3), ADD COLUMN "qualificationUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "qualificationReason" TEXT, ADD COLUMN "qualificationVersion" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "submittedEventId" TEXT, ADD COLUMN "growthContext" JSONB;
CREATE UNIQUE INDEX "Rfq_submittedEventId_key" ON "Rfq"("submittedEventId");
ALTER TABLE "SearchEvent" ADD COLUMN "eventId" TEXT, ADD COLUMN "locale" TEXT,
  ADD COLUMN "eventSource" TEXT, ADD COLUMN "sessionId" TEXT, ADD COLUMN "searchEventId" TEXT;
CREATE UNIQUE INDEX "SearchEvent_eventId_key" ON "SearchEvent"("eventId");
