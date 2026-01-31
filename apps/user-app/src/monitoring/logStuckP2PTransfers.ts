import { findStuckP2PTransfers } from "./stuckP2PTransfers";

export async function logStuckP2PTransfers() {

    const stuckTransfers = await findStuckP2PTransfers();

    if (stuckTransfers.length === 0) {
        return;
    }

    console.warn("🚨 STUCK P2P TRANSFERS DETECTED");

    for (const tx of stuckTransfers) {
        console.warn({
            transferId: tx.id,
            amount: tx.amount,
            status: tx.status,
            createdAt: tx.timestamp,
            fromUser: tx.fromUser.number,
            toUser: tx.toUser.number
        });
    }
}