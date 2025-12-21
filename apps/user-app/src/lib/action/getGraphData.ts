"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import {prisma} from "@repo/db";

export const getGraphData = async () => {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!userId) {
    return [];
  }

  // 1. Get the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 2. Fetch sent transactions
  const transactions = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: userId,
      timestamp: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  // 3. Aggregate data by day (Sum amounts for each day)
  const aggregatedData: { [key: string]: number } = {};
  
  // Initialize last 7 days with 0 to ensure no empty gaps in graph
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Mon"
    aggregatedData[dayName] = 0;
  }

  // Fill in actual data
  transactions.forEach((t) => {
    const dayName = t.timestamp.toLocaleDateString("en-US", { weekday: "short" });
    if (aggregatedData[dayName] !== undefined) {
      aggregatedData[dayName] += t.amount;
    }
  });

  // 4. Convert to array and reverse to show oldest -> newest
  const result = Object.entries(aggregatedData)
    .map(([day, amount]) => ({ day, amount }))
    .reverse();

  return result;
};