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

        const idempotencyKey = req.headers.get("idempotency-key");
        if (!idempotencyKey) {
            return NextResponse.json(
                { message: "Idempotency-Key header required" },
                { status: 400 }
            );
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

        const result = await prisma.$transaction(async (txn) => {
            // Check for existing idempotency key
            const existing = await txn.idempotencyKey.findUnique({
                where: {
                    userId_key: {
                        userId: Number(userId),
                        key: idempotencyKey
                    }
                }
            });
            
            if (existing?.status === "COMPLETED") {
                return existing.response;
            }
            
            if (existing?.status === "PROCESSING") {
                throw new Error("REQUEST_IN_PROGRESS");
            }

            // Create idempotency key record
            await txn.idempotencyKey.create({
                data: {
                    userId: Number(userId),
                    key: idempotencyKey,
                    status: "PROCESSING"
                }
            });

            const token = generateToken();

            // Create onRamp transaction using txn (not prisma)
            await txn.onRampTransaction.create({
                data: {
                    provider,
                    status: "Processing",
                    startTime: new Date(),
                    token,
                    userId: Number(userId),
                    amount: amount,
                },
            });

            // Mark idempotency key as completed
            await txn.idempotencyKey.update({
                where: {
                    userId_key: {
                        userId: Number(userId),
                        key: idempotencyKey
                    }
                },
                data: {
                    status: "COMPLETED",
                    response: { token }
                }
            });
            
            return { token };
        });

        // Call bank webhook outside transaction
        try {
            await fetch(BANK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: (result as any).token,
                    userId: Number(userId),
                    amount: String(amount),
                })
            });
        } catch (err: any) {
            console.error("Call to dummy bank failed:", err?.message ?? err);
        }
        
        return NextResponse.json(result, { status: 201 });
        
    } catch (err: any) {
        if (err.message === "REQUEST_IN_PROGRESS") {
            return NextResponse.json(
                { message: "Request already in progress" },
                { status: 409 }
            );
        }
        
        console.error("onramp start error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}