import { NextResponse } from "next/server";
import {prisma} from "@repo/db";
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

        await prisma.onRampTransaction.create({
            data: {
                provider,
                status: "Processing",
                startTime: new Date(),
                token,
                userId: Number(userId),
                amount: amount,
            },
        });

        try {
            await fetch(BANK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    userId: Number(userId),
                    amount: String(amount),
                })
            })
        } catch (err: any) {
            // Bank call failed — log but still return token so frontend can poll status.
            console.error("Call to dummy bank failed:", err?.message ?? err);
            // Optionally you could mark the transaction as Failure here.
        }
        return NextResponse.json({ token }, { status: 201 });
    } catch (err: any) {
        console.error("onramp start error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}