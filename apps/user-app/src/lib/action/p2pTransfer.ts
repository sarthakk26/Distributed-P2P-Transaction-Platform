"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { transferMoney } from "../transfer";

export async function p2pTransfer(to: string, amount: number,idempotencyKey: string) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;
  
  if (!from) {
    return {
      message: "Error while sending",
    };
  }
  
  return await transferMoney(Number(from), to, amount,idempotencyKey);
}