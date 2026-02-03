import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TransitionLogs from "./_components/TransitionLogs";
import OnRampReconciliation from "./_components/OnRampReconciliation";
import P2PReconciliation from "./_components/P2PReconciliation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-white border rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800">
            Admin / Ops Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            System health monitoring & transaction safety
          </p>
        </header>

        {/* OnRamp Section */}
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              OnRamp Reconciliation
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Monitor stuck transactions and timeout handling
            </p>
          </div>
          <OnRampReconciliation />
        </section>

        {/* P2P Section */}
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              P2P Reconciliation
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Track transfer states, locked balances, and invariant violations
            </p>
          </div>
          <P2PReconciliation />
        </section>

        {/* Transition Logs */}
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              System Activity Logs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Recent state transitions across all domains
            </p>
          </div>
          <TransitionLogs />
        </section>
      </div>
    </div>
  );
}