import { NextResponse } from "next/server";
import { PrismaClient } from "@repo/db";

const db = new PrismaClient();

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");
        if (!token) {
            return NextResponse.json({ message: "Missing token" }, { status: 400 });
        }

        const trx = await db.onRampTransaction.findUnique({
            where: { token },
            select: { status: true, amount: true, provider: true, startTime: true }
        });

        if (!trx) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        return NextResponse.json({
            status: trx.status,
            amount: trx.amount,
            provider: trx.provider,
            startTime: trx.startTime,
        });
    } catch (err: any) {
        console.error("onramp status error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}