import { prisma } from "@repo/db";

const STUCK_THRESHOLD_MINUTES = 5;

/**
 * 1. Stuck LOCKED transfers
 * Transfers stuck in LOCKED beyond threshold
 */
export async function findStuckLockedTransfers() {
  const threshold = new Date(
    Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000
  );

  return prisma.p2pTransfer.findMany({
    where: {
      status: "LOCKED",
      timestamp: { lt: threshold },
    },
    select: {
      id: true,
      amount: true,
      timestamp: true,
      fromUser: { select: { number: true } },
      toUser: { select: { number: true } },
    },
  });
}

/**
 * 2. FAILED transfers with locked balance still present
 * Indicates rollback failure or invariant violation
 */
export async function findFailedWithLockedBalance() {
  return prisma.p2pTransfer.findMany({
    where: {
      status: "FAILED",
      fromUser: {
        Balance: {
          locked: { gt: 0 },
        },
      },
    },
    select: {
      id: true,
      amount: true,
      fromUser: {
        select: {
          number: true,
          Balance: {
            select: { locked: true },
          },
        },
      },
    },
  });
}

/**
 * 3. Invalid LOCKED state
 * LOCKED transfer but:
 * - no balance row
 * - locked < transfer amount
 */
export async function findInvalidLockedState() {
  const lockedTransfers = await prisma.p2pTransfer.findMany({
    where: { status: "LOCKED" },
    select: {
      id: true,
      amount: true,
      fromUser: {
        select: {
          number: true,
          Balance: {
            select: { locked: true },
          },
        },
      },
    },
  });

  return lockedTransfers.filter((tx) => {
    const balance = tx.fromUser.Balance;

    // Missing balance row OR insufficient locked amount
    if (!balance) return true;

    return balance.locked < tx.amount;
  });
}

/**
 * 4. Negative balances
 */
export async function findNegativeBalances() {
  return prisma.balance.findMany({
    where: {
      amount: { lt: 0 },
    },
    select: {
      amount: true,
      user: {
        select: { number: true },
      },
    },
  });
}
