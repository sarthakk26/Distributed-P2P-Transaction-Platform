import { prisma } from '@repo/db'

const STUCK_THRESHOLD_MINUTES = 5;

export async function findStuckP2PTransfers() {
    const threshold = new Date(
        Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000
    );
    const stuckTransfers = await prisma.p2pTransfer.findMany({
        where: {
            status: "LOCKED",
            timestamp: {
                lt: threshold
            }
        },
        include: {
            fromUser: {
                select: { id: true, number: true }
            },
            toUser: {
                select: { id: true, number: true }
            }
        }
    });
    return stuckTransfers;
}