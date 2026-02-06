import { runOnRampReconciliation } from "@/reconciliation";
import RiskSummary from "./onRamp/RiskSummary";
import StuckOnRampsTable from "./onRamp/StuckOnRampsTable";
import AutoFailedTable from "./onRamp/AutoFailedTable";
import RunTimeoutButton from "./onRamp/RunTimeoutButton";

export default async function OnRampReconciliation() {
  try {
    const data = await runOnRampReconciliation();

    return (
      <div className="space-y-6">
        {/* Risk Summary Cards */}
        <RiskSummary data={data} />

        {/* Main Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StuckOnRampsTable rows={data.stuckProcessing} />
          <AutoFailedTable rows={data.successWithoutBalance} />
        </div>

        {/* Action Button */}
        <RunTimeoutButton />
      </div>
    );
  } catch (error) {
    console.error("OnRamp reconciliation error:", error);
    return (
      <div className="rounded-xl border-2 border-red-500/50 bg-red-950/30 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-900/50">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-300">
              Failed to load OnRamp reconciliation data
            </p>
            <p className="mt-1 text-sm text-red-200">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}