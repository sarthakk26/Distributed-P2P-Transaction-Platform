"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import {prisma} from "@repo/db";

export const getReceivedGraphData = async () => {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!userId) return [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // 1. Fetch P2P Received
  const p2pReceived = await prisma.p2pTransfer.findMany({
    where: {
      toUserId: userId,
      timestamp: { gte: sevenDaysAgo },
    },
  });

  // 2. Fetch Bank Deposits (OnRamp)
  const onRampReceived = await prisma.onRampTransaction.findMany({
    where: {
      userId: userId,
      status: "Success",
      startTime: { gte: sevenDaysAgo },
    },
  });

  // 3. Aggregate by Day
  const aggregatedData: { [key: string]: number } = {};
  
  // Initialize last 7 days with 0
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    aggregatedData[dayName] = 0;
  }

  // Helper to sum amounts
  const addToAgg = (date: Date, amount: number) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    if (aggregatedData[dayName] !== undefined) {
      aggregatedData[dayName] += amount;
    }
  };

  p2pReceived.forEach(t => addToAgg(t.timestamp, t.amount));
  onRampReceived.forEach(t => addToAgg(t.startTime, t.amount));

  // 4. Return formatted array
  return Object.entries(aggregatedData)
    .map(([day, amount]) => ({ day, amount }))
    .reverse();
};