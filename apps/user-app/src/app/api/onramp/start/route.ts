import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateToken } from "@/lib/token";

const BANK_URL = process.env.DUMMY_BANK_URL;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 })
        }


        const body = await req.json();
        const provider: string = body?.provider;
        const amount: number = Number(body?.amount);

        if (!provider || !amount || amount <= 0) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        if (!BANK_URL) {
            console.error("DUMMY_BANK_URL not set");
            return NextResponse.json({ message: "Server config error" }, { status: 500 });
        }

        const token = generateToken();

        // 1️⃣ Create intent in INITIATED
        const txn = await prisma.onRampTransaction.create({
            data: {
                userId:Number(userId),
                provider,
                amount,
                token,
                status: "INITIATED",
                startTime: new Date()
            }
        })

        // 2️⃣ Call bank (external side-effect)
        try {
            await fetch(BANK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    userId,
                    amount: String(amount)
                })
            })

        } catch (err: any) {
            console.error("Bank call failed", err);
            return NextResponse.json(
                { message: "Bank unavailable, try again later" },
                { status: 503 }
            );
        }
        // 3️⃣ Transition INITIATED → PROCESSING (guarded)
        const updated = await prisma.onRampTransaction.updateMany({
            where: {
                id: txn.id,
                status: "INITIATED"
            },
            data: {
                status: "PROCESSING"
            }
        });

        if (updated.count !== 1) {
            // Extremely rare — race or bug
            return NextResponse.json(
                { message: "Invalid transaction state" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { token },
            { status: 201 }
        )

    } catch (err) {
        console.error("onramp start error:", err);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}