import { prisma } from "@repo/db";

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

      // 🔒 3. Row locking (your existing logic)
      await tx.$queryRaw`
        SELECT * FROM "Balance"
        WHERE "userId" = ${from}
        FOR UPDATE
      `;

      const fromBalance = await tx.balance.findUnique({
        where: { userId: from }
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      // 💸 4. Balance updates
      await tx.balance.update({
        where: { userId: from },
        data: { amount: { decrement: amount } }
      });

      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } }
      });

      // 🧾 5. Transfer record
      await tx.p2pTransfer.create({
        data: {
          amount,
          fromUserId: from,
          toUserId: toUser.id,
          timestamp: new Date()
        }
      });

      const response: P2PResponse = { message: "Transfer successful" };

      // 🧠 6. Persist response for replay
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

    return { message: "Error while processing transfer" };
  }
}
