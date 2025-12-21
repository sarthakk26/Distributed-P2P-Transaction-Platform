import { prisma } from "@repo/db";

export async function getBalanceHistory(userId: number) {
    const balanceRecord = await prisma.balance.findUnique({
        where: { userId: userId }
    })
    let currentBalance = balanceRecord?.amount || 0;

    //past 7 days txns
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const sentTransfers = await prisma.p2pTransfer.findMany({
        where: { fromUserId: userId, timestamp: { gte: sevenDaysAgo } }
    })
    const receivedTransfers = await prisma.p2pTransfer.findMany({
        where: { toUserId: userId, timestamp: { gte: sevenDaysAgo } }
    });
    const addedMoney = await prisma.onRampTransaction.findMany({
        where: { userId: userId, status: "Success", startTime: { gte: sevenDaysAgo } }
    });

    const allTxns = [
        ...sentTransfers.map(t => ({ amount: t.amount, date: t.timestamp, type: 'sent' })),
        ...receivedTransfers.map(t => ({ amount: t.amount, date: t.timestamp, type: 'received' })),
        ...addedMoney.map(t => ({ amount: t.amount, date: t.startTime, type: 'received' }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Newest first

    const chartData = [];
    let runnerBalance = currentBalance;

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const dateString = date.toDateString();

        // Find transactions for this specific day
        const txnsOnThisDay = allTxns.filter(t =>
            t.date.toDateString() === dateString
        );

        chartData.push({
            date: date.toISOString(),
            balance: runnerBalance
        });
        // Reverse calculation
        txnsOnThisDay.forEach(t => {
            if (t.type === 'received') {
                runnerBalance -= t.amount;
            } else {
                runnerBalance += t.amount;
            }
        });
    }
    return chartData.reverse();
}