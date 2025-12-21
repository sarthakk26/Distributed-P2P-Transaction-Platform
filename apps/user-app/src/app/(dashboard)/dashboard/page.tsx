import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardStats } from "@/lib/action/getDashboardStats";
import { getDashboardData } from "@/lib/action/getDashboardData";
import { getBalanceHistory } from "@/lib/action/getBalanceHistory";
import { DashboardClient } from "@/components/dashboard/DashboardClient"; // Import the wrapper

export default async function Dashboard() {
  // 1. Fetch all data on the Server
  const [session, stats, listData] = await Promise.all([
    getServerSession(authOptions),
    getDashboardStats(),
    getDashboardData()
  ]);

  if (!listData || "error" in listData) return <div className="p-8 text-red-500">Error loading dashboard data</div>;
  
  const { transactions, contacts } = listData;
  const firstName = session?.user?.name?.split(' ')[0] || "User";
  const userId = Number(session?.user?.id);
  const graphData = await getBalanceHistory(userId);

  // 2. Pass data to the Client Component
  return (
    <DashboardClient 
      stats={stats}
      transactions={transactions}
      contacts={contacts}
      graphData={graphData}
      firstName={firstName}
    />
  );
}