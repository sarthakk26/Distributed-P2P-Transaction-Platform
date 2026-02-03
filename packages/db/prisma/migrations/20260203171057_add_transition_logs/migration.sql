-- CreateTable
CREATE TABLE "TransitionLog" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "fromState" TEXT NOT NULL,
    "toState" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransitionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransitionLog_domain_entityId_idx" ON "TransitionLog"("domain", "entityId");

-- CreateIndex
CREATE INDEX "TransitionLog_createdAt_idx" ON "TransitionLog"("createdAt");
