-- 1️⃣ Create enum
CREATE TYPE "P2PStatus" AS ENUM (
  'INITIATED',
  'LOCKED',
  'COMPLETED',
  'FAILED'
);

-- 2️⃣ Add column as nullable
ALTER TABLE "p2pTransfer"
ADD COLUMN "status" "P2PStatus";

-- 3️⃣ Backfill existing rows
UPDATE "p2pTransfer"
SET "status" = 'COMPLETED'
WHERE "status" IS NULL;

-- 4️⃣ Enforce NOT NULL
ALTER TABLE "p2pTransfer"
ALTER COLUMN "status" SET NOT NULL;

-- 5️⃣ Default for future inserts
ALTER TABLE "p2pTransfer"
ALTER COLUMN "status" SET DEFAULT 'INITIATED';