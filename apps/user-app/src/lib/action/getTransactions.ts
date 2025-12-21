"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import {prisma} from "@repo/db"

export async function getOnRampTransactions(txnsCount: number, offset: number) {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    if (!userId) {
        return [];
    }
    const txns = await prisma.onRampTransaction.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        take: txnsCount,
        skip: offset,
    });
    return txns.map(t => ({
        id: t.id,
        amount: t.amount,
        date: t.startTime,
        status: t.status,
        provider: t.provider,
        type: 'deposit' as const
    }));
}

export async function getP2PTranssactions(txnsCount: number, offset: number) {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) return [];
    const sent = await prisma.p2pTransfer.findMany({
        where: { fromUserId: userId },
        include: { toUser: true },
        orderBy: { timestamp: 'desc' },
        take: txnsCount,
        skip: offset,
    })

    const received = await prisma.p2pTransfer.findMany({
        where: { toUserId: userId },
        include: { fromUser: true },
        orderBy: { timestamp: 'desc' },
        take: txnsCount,
        skip: offset,
    })

    const sentTxns = sent.map(t => ({
        id: t.id,
        amount: t.amount,
        date: t.timestamp,
        status: 'Success',
        user: t.toUser.name || t.toUser.number,
        userNumber: t.toUser.number,
        type: 'sent' as const
    }))
    const receivedTxns = received.map(t => ({
        id: t.id,
        amount: t.amount,
        date: t.timestamp,
        status: 'Success',
        user: t.fromUser.name || t.fromUser.number,
        userNumber: t.fromUser.number,
        type: 'received' as const
    }));

    return [...sentTxns, ...receivedTxns];
}

export async function getAllTransactions(limit: number = 10, offset: number = 0) {
    
    const onRampTxns = await getOnRampTransactions(limit, offset);
    const p2pTxns = await getP2PTranssactions(limit, offset);

    const allTxns = [...onRampTxns, ...p2pTxns];

    allTxns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allTxns.slice(0, limit);
}