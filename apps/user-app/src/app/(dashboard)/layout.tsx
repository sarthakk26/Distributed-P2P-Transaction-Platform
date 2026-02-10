import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { Providers } from "../../providers/providers";
import {prisma} from "@repo/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Fetch user's avatar ID from database
  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { avatarId: true }
  });

  const avatarId = user?.avatarId || 1; // Default to 1 if not found

  return (
    <Providers>
      <div className="min-h-screen bg-[#0a0e1a]">
        <NavbarWrapper 
          user={session.user} 
          avatarId={avatarId}
        />
        <main className="w-full">
          {children}
        </main>
      </div>
    </Providers>
  );
}