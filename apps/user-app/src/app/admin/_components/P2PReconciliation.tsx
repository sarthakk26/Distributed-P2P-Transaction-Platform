import { runP2PReconciliation } from "@/reconciliation";
import P2PRiskSummary from "./P2P/P2PRiskSummary";
import StuckLockedTransfersTable from "./P2P/StuckLockedTransfersTable";
import FailedWithLockedBalanceTable from "./P2P/FailedWithLockedBalanceTable";
import InvalidLockedStateTable from "./P2P/InvalidLockedStateTable";
import NegativeBalancesTable from "./P2P/NegativeBalancesTable";

export default async function P2PReconciliation() {
  try {
    const data = await runP2PReconciliation();

    return (
      <div className="space-y-6">
        {/* Risk Summary Cards */}
        <P2PRiskSummary summary={data.summary} />
        
        {/* Tables Grid - 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StuckLockedTransfersTable rows={data.stuckLockedTransfers} />
          <FailedWithLockedBalanceTable rows={data.failedWithLockedBalance} />
          <InvalidLockedStateTable rows={data.invalidLockedState} />
          <NegativeBalancesTable rows={data.negativeBalances} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("P2P reconciliation error:", error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 font-medium">
          Failed to load P2P reconciliation data
        </p>
        <p className="text-sm text-red-500 mt-1">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }
}