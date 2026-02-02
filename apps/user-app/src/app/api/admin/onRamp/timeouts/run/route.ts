import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { runOnRampTimeouts } from "@/reconciliation";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        const result = await runOnRampTimeouts();
        return NextResponse.json(result)
    } catch (err) {
        console.error("ADMIN TIMEOUT RUN ERROR:", err);
        return NextResponse.json(
            { message: "Failed to run timeouts" },
            { status: 500 }
        )
    }
}