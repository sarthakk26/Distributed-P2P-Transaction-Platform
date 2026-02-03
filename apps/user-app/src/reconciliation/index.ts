import { findStuckOnRamps, findSuccessWithoutBalanceRow, findInvalidStates } from './OnRamp'
import {findStuckLockedTransfers,findFailedWithLockedBalance,findInvalidLockedState,findNegativeBalances,} from "./P2P";
export async function runOnRampReconciliation() {
    const [stuck, missingBalance, invalidStates] = await Promise.all([
        findStuckOnRamps(),
        findSuccessWithoutBalanceRow(),
        findInvalidStates(),
    ]);

    return {
        stuckProcessing: stuck,
        successWithoutBalance: missingBalance,
        invalidStates,
    };
}

export async function runP2PReconciliation() {
  const [
    stuckLockedTransfers,
    failedWithLockedBalance,
    invalidLockedState,
    negativeBalances,
  ] = await Promise.all([
    findStuckLockedTransfers(),
    findFailedWithLockedBalance(),
    findInvalidLockedState(),
    findNegativeBalances(),
  ]);

  return {
    stuckLockedTransfers,
    failedWithLockedBalance,
    invalidLockedState,
    negativeBalances,

    // 🔢 Risk summary counters (for Admin UI)
    summary: {
      stuckLockedTransfers: stuckLockedTransfers.length,
      failedWithLockedBalance: failedWithLockedBalance.length,
      invalidLockedState: invalidLockedState.length,
      negativeBalances: negativeBalances.length,
    },
  };
}

// export * from "./OnRamp"
// export * from "./onRampTimeout"