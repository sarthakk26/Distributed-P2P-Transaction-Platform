/**
 * helpers/db.ts
 *
 * Thin wrappers around Prisma for seeding and tearing down test data.
 * Every helper cleans up only what it creates — no truncate-all nukes
 * that would break parallel suite runs if we ever add them later.
 */

import { PrismaClient } from "@repo/db";

// Single Prisma client for the entire test run.
// DATABASE_URL is injected via .env.test by dotenv-cli.
export const db = new PrismaClient({
  log: [],
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SeedUserOptions {
  number: string;       // phone number — unique in the DB
  password?: string;
  balance?: number;     // available balance in paise / cents
  locked?: number;
}

export interface SeededUser {
  id: number;
  number: string;
}

// ---------------------------------------------------------------------------
// Seed helpers
// ---------------------------------------------------------------------------

/**
 * Create a user + optional balance row.
 * Returns just the fields tests need.
 */
export async function seedUser(opts: SeedUserOptions): Promise<SeededUser> {
  const user = await db.user.create({
    data: {
      number: opts.number,
      password: opts.password ?? "test-password",
      ...(opts.balance !== undefined && {
        Balance: {
          create: {
            amount: opts.balance,
            locked: opts.locked ?? 0,
          },
        },
      }),
    },
  });

  return { id: user.id, number: user.number };
}

/**
 * Seed an OnRampTransaction in a specific status.
 * Useful for webhook tests where we need a pre-existing txn row.
 */
export async function seedOnRamp(opts: {
  userId: number;
  token: string;
  amount: number;
  status: "INITIATED" | "PROCESSING" | "SUCCESS" | "FAILED";
}) {
  return db.onRampTransaction.create({
    data: {
      userId: opts.userId,
      token: opts.token,
      amount: opts.amount,
      status: opts.status,
      provider: "HDFC",
      startTime: new Date(),
    },
  });
}

// ---------------------------------------------------------------------------
// Teardown helpers
// ---------------------------------------------------------------------------

/**
 * Delete everything created for a set of user IDs,
 * respecting FK order: transfers → idempotency → balance → user.
 */
export async function cleanupUsers(userIds: number[]) {
  if (userIds.length === 0) return;

  const where = { userId: { in: userIds } };

  await db.transitionLog.deleteMany({});        // no FK — safe to wipe per-run
  await db.p2pTransfer.deleteMany({
    where: {
      OR: [{ fromUserId: { in: userIds } }, { toUserId: { in: userIds } }],
    },
  });
  await db.onRampTransaction.deleteMany({ where });
  await db.idempotencyKey.deleteMany({ where });
  await db.balance.deleteMany({ where });
  await db.user.deleteMany({ where: { id: { in: userIds } } });
}
