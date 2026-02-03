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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 font-medium">
          Failed to load OnRamp reconciliation data
        </p>
        <p className="text-sm text-red-500 mt-1">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }
}