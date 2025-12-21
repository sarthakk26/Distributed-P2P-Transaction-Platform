"use client";
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal, Landmark } from "lucide-react";

interface Transaction {
  id: string;
  type: "deposit" | "sent" | "received";
  amount: number;
  date: Date;
  status: string;
  description: string;
}

export const RecentTransactions = ({ transactions }: { transactions: Transaction[] }) => {
  if (!transactions.length) {
    return (
      <div className="h-full w-full bg-[#0F172A] border border-gray-800 rounded-2xl p-6 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#0F172A] border border-gray-800 rounded-2xl p-6 overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white tracking-wide">
          Recent Transactions
        </h3>
      </div>

      {/* Transactions List */}
      <div className="flex flex-col overflow-y-auto pr-2 custom-scrollbar">
        {transactions.map((t) => {
          
          const isDeposit = t.type === 'deposit';
          const isReceived = t.type === 'received';
          
          // Logic to choose the correct icon
          let Icon = ArrowUpRight; // Default: Sent
          if (isDeposit) Icon = Landmark; // Bank Deposit
          else if (isReceived) Icon = ArrowDownLeft; // Received from User

          // Color Logic (Green for Money IN, Red for Money OUT)
          const isPositive = isDeposit || isReceived;
          const iconColor = isPositive ? "text-emerald-500" : "text-rose-500";
          const iconBg = isPositive ? "bg-emerald-500/10" : "bg-rose-500/10";
          const amountColor = isPositive ? "text-emerald-400" : "text-rose-400";
          const sign = isPositive ? "+" : "-";

          return (
            <div 
              key={t.id} 
              className="flex justify-between items-center border-b border-gray-800 py-4 last:border-b-0 group cursor-pointer hover:bg-white/5 px-2 rounded-lg transition-colors"
            >
              
              {/* Left Side: Icon & Details */}
              <div className="flex items-center gap-4">
                
                {/* Icon Background */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
                  <Icon size={18} />
                </div>

                {/* Text Info */}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-wide">
                    {t.description}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {new Date(t.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Right Side: Amount */}
              <div className={`text-sm font-bold ${amountColor}`}>
                {sign} ₹{t.amount.toLocaleString('en-IN')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};