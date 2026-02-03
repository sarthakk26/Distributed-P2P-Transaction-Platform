import { Prisma } from "@repo/db"


type transitionLogInput = {
    domain: "P2P" | "ONRAMP";
    entityId: number;
    from: string,
    to: string,
    meta?: Record<string, any>;
}

export async function logTransition(
    tx:  Prisma.TransactionClient,
    input: transitionLogInput
) {
    await tx.transitionLog.create({
        data: {
            domain: input.domain,
            entityId: input.entityId,
            fromState: input.from,
            toState: input.to,
            meta: input.meta ?? {},
        }
    })

}