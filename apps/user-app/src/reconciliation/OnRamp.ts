import { prisma } from "@repo/db";

const STUCK_AFTER_MINUTES = 10;

export async function findStuckOnRamps() {
    const stuck = await prisma.onRampTransaction.findMany({
        where: {
            status: "PROCESSING",
            startTime: { lt: new Date(Date.now() - STUCK_AFTER_MINUTES * 60 * 1000) }
        },
        orderBy: { startTime: "asc" }
    })

    return stuck.map(t => ({
        id: t.id,
        userId: t.userId,
        amount: t.amount,
        provider: t.provider,
        startTime: t.startTime

    }))
}

export async function findSuccessWithoutBalanceRow() {
  return prisma.$queryRaw<
    {
      onRampId: number;
      userId: number;
    }[]
  >`
    SELECT
      t.id       AS "onRampId",
      t."userId" AS "userId"
    FROM "OnRampTransaction" t
    LEFT JOIN "Balance" b
      ON b."userId" = t."userId"
    WHERE t.status = 'SUCCESS'
      AND b."userId" IS NULL
  `;
}

export async function findInvalidStates() {
  return prisma.$queryRaw<
    { id: number; status: string }[]
  >`
    SELECT id, status
    FROM "OnRampTransaction"
    WHERE status NOT IN ('INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED')
  `;
}