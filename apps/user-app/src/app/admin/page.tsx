import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { runOnRampReconciliation } from "@/reconciliation";

import RiskSummary from "./_components/RiskSummary";
import StuckOnRampsTable from "./_components/StuckOnRampsTable";
import AutoFailedTable from "./_components/AutoFailedTable";
import RunTimeoutButton from "./_components/RunTimeoutButton";
import TransitionLogs from "./_components/TransitionLogs";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const data = await runOnRampReconciliation();

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Admin / Ops Dashboard</h1>
        <p className="text-sm text-slate-500">
          System health & transaction safety
        </p>
      </header>

      <RiskSummary data={data} />

      <StuckOnRampsTable rows={data.stuckProcessing} />

      <RunTimeoutButton />

      <AutoFailedTable rows={data.successWithoutBalance} />

      <TransitionLogs />
    </div>
  );
}
