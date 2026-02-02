import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runOnRampReconciliation } from "@/reconciliation";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 })
    }
    if (session.user.role != "ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        const data = await runOnRampReconciliation();
        return NextResponse.json(data);
    } catch (err) {
        console.error("ADMIN RECONCILIATION ERROR");
        return NextResponse.json(
            { message: "FAILED TO RUN RECONCILIATION" },
            { status: 500 }
        )
    }
}   