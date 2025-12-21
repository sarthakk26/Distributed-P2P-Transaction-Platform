import { NextResponse } from "next/server";
import {prisma} from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sent = await prisma.p2pTransfer.findMany({
        where: { fromUserId: userId },
        include: { toUser: true },
    });
    const received = await prisma.p2pTransfer.findMany({
        where: { toUserId: userId },
        include: { fromUser: true },
    });
    const onRamps = await prisma.onRampTransaction.findMany({
        where: { userId },
    });

    // Normalize
    const normalized = [
        ...sent.map((tx) => ({
            id: tx.id,
            type: "SENT",
            amount: tx.amount,
            timestamp: tx.timestamp,
            otherUser: tx.toUser.number,
        })),
        ...received.map((tx) => ({
            id: tx.id,
            type: "RECEIVED",
            amount: tx.amount,
            timestamp: tx.timestamp,
            otherUser: tx.fromUser.number,
        })),
        ...onRamps.map((tx) => ({
            id: tx.id,
            type: "ADDED",
            amount: tx.amount,
            timestamp: tx.startTime,
            provider: tx.provider,
            status: tx.status,
        })),
    ];
    normalized.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return NextResponse.json(normalized);
}
