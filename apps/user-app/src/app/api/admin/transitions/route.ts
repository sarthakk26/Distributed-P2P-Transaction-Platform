import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log(session)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  } 

  const logs = await prisma.transitionLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      domain: true,
      entityId: true,
      fromState: true,
      toState: true,
      meta: true,
      createdAt: true,
    },
  });

  return NextResponse.json(logs);
}
