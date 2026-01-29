import { prisma } from "@repo/db";

export async function transferMoney(from: number, to: string, amount: number) {
  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      message: "User not found",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Row locking
      await tx.$queryRaw`
        SELECT * FROM "Balance" 
        WHERE "userId" = ${from} 
        FOR UPDATE
      `;

      const fromBalance = await tx.balance.findUnique({
        where: { userId: from },
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      await tx.balance.update({
        where: { userId: from },
        data: { amount: { decrement: amount } },
      });

      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      await tx.p2pTransfer.create({
        data: {
          amount,
          fromUserId: from,
          toUserId: toUser.id,
          timestamp: new Date(),
        },
      });
    });

    return { message: "Transfer successful" };

  } catch (e) {
    return { message: "Error while processing transfer" };
  }
}