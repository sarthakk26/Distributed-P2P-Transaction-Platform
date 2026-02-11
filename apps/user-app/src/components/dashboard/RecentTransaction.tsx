"use client";
import { ArrowUpRight, ArrowDownLeft, Landmark } from "lucide-react";

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
      <div className="h-full w-full bg-[#0F172A] border border-gray-800 rounded-2xl p-4 md:p-4 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#0F172A] border border-gray-800 rounded-2xl p-4 md:p-6 flex flex-col overflow-hidden">
      
      {/* Header */}
      <h3 className="text-base md:text-lg font-bold text-white tracking-wide mb-1 md:mb-1">
        Recent Transactions
      </h3>

      {/* Transactions List — NO SCROLL */}
      <div className="flex-1 overflow-hidden pt-2">
        <div className="flex flex-col">
          {transactions.slice(0, 6).map((t) => {
            
            const isDeposit = t.type === "deposit";
            const isReceived = t.type === "received";
            
            let Icon = ArrowUpRight;
            if (isDeposit) Icon = Landmark;
            else if (isReceived) Icon = ArrowDownLeft;

            const isPositive = isDeposit || isReceived;
            const iconColor = isPositive ? "text-emerald-500" : "text-rose-500";
            const iconBg = isPositive ? "bg-emerald-500/10" : "bg-rose-500/10";
            const amountColor = isPositive ? "text-emerald-400" : "text-rose-400";
            const sign = isPositive ? "+" : "-";

            return (
              <div 
                key={t.id}
                className="flex justify-between items-center border-b border-gray-800 py-2.5 last:border-b-0 group cursor-pointer hover:bg-white/5 px-2 rounded-lg transition-colors"
              >
                
                {/* Left Side */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  
                  <div className={`h-8 w-8 md:h-9 md:w-9 flex-shrink-0 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
                    <Icon size={15} className="md:w-4 md:h-4" />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs md:text-sm font-bold text-white tracking-wide truncate">
                      {t.description}
                    </span>
                    <span className="text-[0.625rem] md:text-xs font-medium text-gray-500">
                      {new Date(t.date).toLocaleDateString("en-IN", { 
                        day: "numeric", 
                        month: "short", 
                        year: "numeric" 
                      })}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className={`text-xs md:text-sm font-bold ${amountColor} flex-shrink-0 ml-2`}>
                  {sign} ₹{t.amount.toLocaleString("en-IN")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
