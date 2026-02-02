import { prisma } from "@repo/db";
import { logTransition } from "@/observability/transitionLogger";

type P2PResponse = {
  message: string;
};

export async function transferMoney(
  from: number,
  to: string,
  amount: number,
  idempotencyKey: string
): Promise<P2PResponse> {
  if (!idempotencyKey) {
    return { message: "Idempotency key required" };
  }

  const toUser = await prisma.user.findFirst({
    where: { number: to },
  });

  if (!toUser) {
    return { message: "User not found" };
  }

  try {
    const result = await prisma.$transaction<P2PResponse>(async (tx) => {

      // 1️⃣ Idempotency check
      const existing = await tx.idempotencyKey.findUnique({
        where: {
          userId_key: {
            userId: from,
            key: idempotencyKey
          }
        }
      });

      if (existing?.status === "COMPLETED") {
        return existing.response as P2PResponse;
      }

      if (existing?.status === "PROCESSING") {
        throw new Error("REQUEST_IN_PROGRESS");
      }

      // 🆕 2. Create idempotency record
      await tx.idempotencyKey.create({
        data: {
          userId: from,
          key: idempotencyKey,
          status: "PROCESSING"
        }
      });

      // 3️⃣ Create transfer in INITIATED
      const transfer = await tx.p2pTransfer.create({
        data: {
          fromUserId: from,
          toUserId: toUser.id,
          amount,
          status: "INITIATED"
        }
      })

      // 4️⃣ Transition INITIATED → LOCKED (guarded)
      const lockResult = await tx.p2pTransfer.updateMany({
        where: {
          id: transfer.id,
          status: "INITIATED"
        },
        data: {
          status: "LOCKED"
        }
      })

      if (lockResult.count !== 1) {
        throw new Error("INVALID_STATE_TRANSITION");
      }

      logTransition({
        domain: "P2P",
        entityId: transfer.id,
        from: "INITIATED",
        to: "LOCKED ",
        meta: { amount, fromUserId: from, toUserId: toUser.id }
      })

      // 5️⃣ Lock sender balance row
      await tx.$queryRaw`
        SELECT * FROM "Balance"
        WHERE "userId" = ${from}
        FOR UPDATE
      `;

      const fromBalance = await tx.balance.findUnique({
        where: { userId: from }
      });

      if (!fromBalance || fromBalance.amount < amount) {
        // Fail safely
        await tx.p2pTransfer.update({
          where: { id: transfer.id },
          data: { status: "FAILED" }
        })
        logTransition({
          domain: "P2P",
          entityId: transfer.id,
          from: "LOCKED",
          to: "FAILED",
          meta: { reason: "INSUFFICIENT_FUNDS" }
        })
        throw new Error("INSUFFICIENT_FUNDS");
      }



      // 6️⃣ Reserve funds
      await tx.balance.update({
        where: { userId: from },
        data: {
          locked: { increment: amount }
        }
      })

      // 7️⃣ Move money
      await tx.balance.update({
        where: { userId: from },
        data: {
          amount: { decrement: amount }
        }
      });

      await tx.balance.update({
        where: { userId: toUser.id },
        data: {
          amount: { increment: amount }
        }
      });

      const response: P2PResponse = { message: "Transfer successful" };

      // 8️⃣ Transition LOCKED → COMPLETED (guarded)
      const completeResult = await tx.p2pTransfer.updateMany({
        where: {
          id: transfer.id,
          status: "LOCKED"
        },
        data: {
          status: "COMPLETED"
        }
      })
      logTransition({
        domain: "P2P",
        entityId: transfer.id,
        from: "LOCKED",
        to: "COMPLETED",
        meta: { amount }
      })


      // 9️⃣ Mark idempotency completed
      await tx.idempotencyKey.update({
        where: {
          userId_key: {
            userId: from,
            key: idempotencyKey
          }
        },
        data: {
          status: "COMPLETED",
          response
        }
      });

      return response;
    });

    return result;

  } catch (e: any) {
    if (e.message === "REQUEST_IN_PROGRESS") {
      return { message: "Transfer already in progress, try later" };
    }
    if (e.message === "INSUFFICIENT_FUNDS") {
      return { message: "Insufficient funds" };
    }
    return { message: "Error while processing transfer" };
  }
}
