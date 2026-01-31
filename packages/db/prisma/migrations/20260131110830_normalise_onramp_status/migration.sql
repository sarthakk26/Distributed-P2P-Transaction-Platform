-- 1️⃣ Create new enum with correct naming
CREATE TYPE "OnRampStatus_new" AS ENUM (
  'INITIATED',
  'PROCESSING',
  'SUCCESS',
  'FAILED'
);

-- 2️⃣ Drop default temporarily
ALTER TABLE "OnRampTransaction"
ALTER COLUMN "status" DROP DEFAULT;

-- 3️⃣ Migrate existing data
ALTER TABLE "OnRampTransaction"
ALTER COLUMN "status" TYPE "OnRampStatus_new"
USING (
  CASE
    WHEN "status"::text = 'Processing' THEN 'PROCESSING'
    WHEN "status"::text = 'Success' THEN 'SUCCESS'
    WHEN "status"::text = 'Failure' THEN 'FAILED'
    ELSE 'INITIATED'
  END
)::"OnRampStatus_new";

-- 4️⃣ Drop old enum
DROP TYPE "OnRampStatus";

-- 5️⃣ Rename new enum
ALTER TYPE "OnRampStatus_new" RENAME TO "OnRampStatus";

-- 6️⃣ Restore default
ALTER TABLE "OnRampTransaction"
ALTER COLUMN "status" SET DEFAULT 'INITIATED';
