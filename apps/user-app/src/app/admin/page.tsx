import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TransitionLogs from "./_components/TransitionLogs";
import OnRampReconciliation from "./_components/OnRampReconciliation";
import P2PReconciliation from "./_components/P2PReconciliation";
import { runOnRampReconciliation, runP2PReconciliation } from "@/reconciliation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  if (session.user.role !== "ADMIN") redirect("/");

  const [onRampData, p2pData] = await Promise.all([
    runOnRampReconciliation(),
    runP2PReconciliation(),
  ]);

  const criticalIssues =
    onRampData.stuckProcessing.length +
    p2pData.stuckLockedTransfers.length +
    p2pData.negativeBalances.length;

  const warnings =
    onRampData.successWithoutBalance.length +
    p2pData.failedWithLockedBalance.length;

  const cautions =
    onRampData.invalidStates.length + p2pData.invalidLockedState.length;

  const totalIssues = criticalIssues + warnings + cautions;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Critical Alerts Banner */}
        {totalIssues > 0 && (
          <div
            className={`mb-8 rounded-xl border-2 p-4 shadow-sm ${
              criticalIssues > 0
                ? "border-red-500/50 bg-red-950/50"
                : warnings > 0
                  ? "border-orange-500/50 bg-orange-950/50"
                  : "border-yellow-500/50 bg-yellow-950/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  criticalIssues > 0
                    ? "bg-red-900/50"
                    : warnings > 0
                      ? "bg-orange-900/50"
                      : "bg-yellow-900/50"
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
                    criticalIssues > 0
                      ? "text-red-400"
                      : warnings > 0
                        ? "text-orange-400"
                        : "text-yellow-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    criticalIssues > 0
                      ? "text-red-300"
                      : warnings > 0
                        ? "text-orange-300"
                        : "text-yellow-300"
                  }`}
                >
                  {criticalIssues > 0
                    ? `${criticalIssues} Critical Issue${criticalIssues !== 1 ? "s" : ""} Require Attention`
                    : warnings > 0
                      ? `${warnings} Warning${warnings !== 1 ? "s" : ""} Detected`
                      : `${cautions} Issue${cautions !== 1 ? "s" : ""} Need Review`}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    criticalIssues > 0
                      ? "text-red-200"
                      : warnings > 0
                        ? "text-orange-200"
                        : "text-yellow-200"
                  }`}
                >
                  {criticalIssues > 0
                    ? "Immediate action required. Review stuck transactions and negative balances."
                    : warnings > 0
                      ? "Some transactions may need manual intervention."
                      : "Review the details below for more information."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* System Health Overview */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                System Health Overview
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Real-time risk assessment across all transaction types
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Critical Issues */}
            <div className={`rounded-xl border-2 p-5 shadow-sm transition-all hover:shadow-md ${criticalIssues > 0 ? "border-red-500/50 bg-slate-800" : "border-green-500/50 bg-slate-800"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Critical Issues</p>
                  <p className={`mt-2 text-3xl font-bold ${criticalIssues > 0 ? "text-red-400" : "text-green-400"}`}>{criticalIssues}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${criticalIssues > 0 ? "bg-red-900/30" : "bg-green-900/30"}`}>
                  <svg className={`h-6 w-6 ${criticalIssues > 0 ? "text-red-400" : "text-green-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={criticalIssues > 0 ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                  </svg>
                </div>
              </div>
              {criticalIssues === 0 && <p className="mt-3 text-xs font-medium text-green-400">✓ All clear</p>}
            </div>

            {/* Warnings */}
            <div className={`rounded-xl border-2 p-5 shadow-sm transition-all hover:shadow-md ${warnings > 0 ? "border-orange-500/50 bg-slate-800" : "border-slate-700 bg-slate-800"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Warnings</p>
                  <p className={`mt-2 text-3xl font-bold ${warnings > 0 ? "text-orange-400" : "text-slate-300"}`}>{warnings}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${warnings > 0 ? "bg-orange-900/30" : "bg-slate-700"}`}>
                  <svg className={`h-6 w-6 ${warnings > 0 ? "text-orange-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              {warnings === 0 && <p className="mt-3 text-xs text-slate-500">No warnings</p>}
            </div>

            {/* Cautions */}
            <div className={`rounded-xl border-2 p-5 shadow-sm transition-all hover:shadow-md ${cautions > 0 ? "border-yellow-500/50 bg-slate-800" : "border-slate-700 bg-slate-800"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Cautions</p>
                  <p className={`mt-2 text-3xl font-bold ${cautions > 0 ? "text-yellow-400" : "text-slate-300"}`}>{cautions}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${cautions > 0 ? "bg-yellow-900/30" : "bg-slate-700"}`}>
                  <svg className={`h-6 w-6 ${cautions > 0 ? "text-yellow-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              {cautions === 0 && <p className="mt-3 text-xs text-slate-500">No cautions</p>}
            </div>

            {/* Total Issues */}
            <div className={`rounded-xl border-2 p-5 shadow-sm transition-all hover:shadow-md ${totalIssues > 0 ? "border-slate-700 bg-slate-800" : "border-green-500/50 bg-slate-800"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Issues</p>
                  <p className={`mt-2 text-3xl font-bold ${totalIssues > 0 ? "text-slate-200" : "text-green-400"}`}>{totalIssues}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${totalIssues > 0 ? "bg-slate-700" : "bg-green-900/30"}`}>
                  <svg className={`h-6 w-6 ${totalIssues === 0 ? "text-green-400" : "text-slate-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={totalIssues === 0 ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"} />
                  </svg>
                </div>
              </div>
              {totalIssues === 0 && <p className="mt-3 text-xs font-medium text-green-400">✓ System healthy</p>}
            </div>
          </div>
        </section>

        {/* OnRamp Section */}
        <section className="mb-8 rounded-xl border border-slate-700 bg-slate-800 shadow-sm">
          <div className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900/50">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">OnRamp Reconciliation</h2>
                <p className="text-sm text-slate-400">Monitor stuck transactions and timeout handling</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <OnRampReconciliation />
          </div>
        </section>

        {/* P2P Section */}
        <section className="mb-8 rounded-xl border border-slate-700 bg-slate-800 shadow-sm">
          <div className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-900/50">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">P2P Reconciliation</h2>
                <p className="text-sm text-slate-400">Track transfer states, locked balances, and invariant violations</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <P2PReconciliation />
          </div>
        </section>

        {/* Transition Logs — scrollable */}
        <section className="rounded-xl border border-slate-700 bg-slate-800 shadow-sm">
          <div className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/50">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">System Activity Logs</h2>
                <p className="text-sm text-slate-400">Recent state transitions across all domains</p>
              </div>
            </div>
          </div>
          {/* ↓ Fixed height scrollable area */}
          <div className="p-6">
            <div className="max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
              <TransitionLogs />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}