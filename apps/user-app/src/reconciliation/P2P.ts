import { prisma } from '@repo/db'

const STUCK_THRESHOLD_MINUTES = 5;

export async function runReconciliation() {
    const report: string[] = [];

    // 1️⃣ LOCKED balances without LOCKED transfers
    const lockedBalances = await prisma.balance.findMany({
        where: {
            locked: { gt: 0 }
        },
        include: {
            user: {
                select: { id: true, number: true }
            }
        }
    })

    for (const bal of lockedBalances) {
        const lockedTransfersCount = await prisma.p2pTransfer.count({
            where: {
                fromUserId: bal.userId,
                status: "LOCKED"
            }
        })

        if (lockedTransfersCount === 0) {
            report.push(
                `❌ User ${bal.user.number} has locked balance ${bal.locked} with no LOCKED transfers`
            )
        }
    };

    // 2️⃣ Stuck LOCKED transfers
    const threshold = new Date(
        Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000
    );

    const stuckTransfers = await prisma.p2pTransfer.findMany({
        where: {
            status: "LOCKED",
            timestamp: { lt: threshold }
        },
        include: {
            fromUser: { select: { number: true } },
            toUser: { select: { number: true } }
        }
    });

    for (const tx of stuckTransfers) {
        report.push(
            `⚠️ P2P#${tx.id} LOCKED for too long | from=${tx.fromUser.number} → to=${tx.toUser.number} | amount=${tx.amount}`
        );
    }

    // 3️⃣ Negative balances
    const negativeBalances = await prisma.balance.findMany({
        where: {
            amount: { lt: 0 }
        },
        include: {
            user: { select: { number: true } }
        }
    })

    for (const bal of negativeBalances) {
        report.push(
            `❌ NEGATIVE balance detected | user=${bal.user.number} | amount=${bal.amount}`
        );
    }
    // 4️⃣ Summary
    if (report.length === 0) {
        console.log("✅ Reconciliation clean: no issues detected");
    } else {
        console.warn("🚨 RECONCILIATION ISSUES DETECTED");
        for (const line of report) {
            console.warn(line);
        }
    }
    return report
}