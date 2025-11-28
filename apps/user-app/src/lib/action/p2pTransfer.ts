"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@repo/db";

const db = new PrismaClient();

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;
  if (!from) {
    return {
      message: "Error while sending",
    };
  }
  const toUser = await db.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      message: "User not found",
    };
  }

  await db.$transaction(async (tx) => {
    //Row locking to prevent race condition of concurrent transactions
    await tx.$queryRaw`
      SELECT * FROM "Balance" 
      WHERE "userId" = ${Number(from)} 
      FOR UPDATE
    `;

    const fromBalance = await tx.balance.findUnique({
      where: { userId: Number(from) },
    });

    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }

    await tx.balance.update({
      where: { userId: Number(from) },
      data: {
        amount: { decrement: amount },
      },
    });

    await tx.balance.update({
      where: { userId: toUser.id },
      data: {
        amount: { increment: amount },
      },
    });

    // ADD P2P TRANSFER RECORD
    await tx.p2pTransfer.create({
      data: {
        amount,
        fromUserId: Number(from),
        toUserId: toUser.id,
        // timestamp automatically set by @default(now())
      },
    });

    return { message: "Transfer successful" };

  });
}
