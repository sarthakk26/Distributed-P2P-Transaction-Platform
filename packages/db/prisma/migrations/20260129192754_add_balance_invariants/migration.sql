-- Balance.amount must never be negative
ALTER TABLE "Balance"
ADD CONSTRAINT balance_amount_non_negative
CHECK (amount >= 0);

-- Balance.locked must never be negative
ALTER TABLE "Balance"
ADD CONSTRAINT balance_locked_non_negative
CHECK (locked >= 0);

-- Locked funds cannot exceed total balance
ALTER TABLE "Balance"
ADD CONSTRAINT balance_locked_lte_amount
CHECK (locked <= amount);
