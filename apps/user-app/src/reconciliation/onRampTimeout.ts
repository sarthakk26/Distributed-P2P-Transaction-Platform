import { prisma } from "@repo/db"
import { logTransition } from "@/observability/transitionLogger";
import { findStuckOnRamps } from "./OnRamp";

export async function autoFailOnRamp(id: number) {
    const updated = await prisma.onRampTransaction.updateMany({
        where: {
            id,
            status: "PROCESSING"
        },
        data: {
            status: "FAILED"
        }
    });

    if (updated.count === 1) {
        logTransition({
            domain: "ONRAMP",
            entityId: id,
            from: "PROCESSING",
            to: "FAILED",
            meta: { reason: "TIMEOUT" }
        })
        return true;
    }
    return false;
}

export async function runOnRampTimeouts() {
    const stuck = await findStuckOnRamps();

    const results = [];

    for (const txn of stuck) {
        const failed = await autoFailOnRamp(txn.id);
        results.push({
            id: txn.id,
            failed
        })
    }

    return {
        checked: stuck.length,
        results
    }
}