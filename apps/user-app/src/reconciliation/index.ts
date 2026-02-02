import { findStuckOnRamps, findSuccessWithoutBalanceRow,findInvalidStates} from './OnRamp'

export * from "./OnRamp"
export * from "./onRampTimeout"

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