"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import {prisma} from "@repo/db";
import { getGraphData } from "./getGraphData"; // Your existing SENT action
import { getReceivedGraphData } from "./getReceivedGraphData"; // The NEW action

export const getDashboardStats = async () => {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!userId) {
    return { balance: 0, sent: 0, received: 0, sentData: [], receivedData: [] };
  }

  const balance = await prisma.balance.findUnique({ where: { userId } });

  const [sentData, receivedData] = await Promise.all([
    getGraphData(),           //Red Graph
    getReceivedGraphData()    // Green Graph
  ]);

  const totalSent = sentData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalReceived = receivedData.reduce((acc, curr) => acc + curr.amount, 0);

  return {
    balance: balance?.amount || 0,
    sent: totalSent,
    received: totalReceived,
    sentData,
    receivedData
  };
};