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
      <div className="h-full w-full bg-[#0F172A] border border-gray-800 rounded-2xl p-4 md:p-6 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#0F172A] border border-gray-800 rounded-2xl p-4 md:p-6 overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base md:text-lg font-bold text-white tracking-wide">
          Recent Transactions
        </h3>
      </div>

      {/* Transactions List */}
      <div className="flex flex-col overflow-y-auto pr-2 custom-scrollbar">
        {transactions.map((t) => {
          
          const isDeposit = t.type === 'deposit';
          const isReceived = t.type === 'received';
          
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
              className="flex justify-between items-center border-b border-gray-800 py-3 md:py-4 last:border-b-0 group cursor-pointer hover:bg-white/5 px-2 rounded-lg transition-colors"
            >
              
              {/* Left Side: Icon & Details */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                
                {/* Icon Background */}
                <div className={`h-9 w-9 md:h-10 md:w-10 flex-shrink-0 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
                  <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                </div>

                {/* Text Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs md:text-sm font-bold text-white tracking-wide truncate">
                    {t.description}
                  </span>
                  <span className="text-[0.625rem] md:text-xs font-medium text-gray-500">
                    {new Date(t.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Right Side: Amount */}
              <div className={`text-xs md:text-sm font-bold ${amountColor} flex-shrink-0 ml-2`}>
                {sign} ₹{t.amount.toLocaleString('en-IN')}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0.5rem;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 0.25rem;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 0.25rem;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #475569 #1e293b;
        }
      `}</style>
    </div>
  );
};