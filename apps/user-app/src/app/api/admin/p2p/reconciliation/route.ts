import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runP2PReconciliation } from "@/reconciliation";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await runP2PReconciliation();
    return NextResponse.json(data);
  } catch (err) {
    console.error("P2P RECONCILIATION ERROR:", err);
    return NextResponse.json(
      { message: "Failed to run P2P reconciliation" },
      { status: 500 }
    );
  }
}