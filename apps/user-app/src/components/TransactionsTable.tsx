"use client";

import React from "react";

export const TransactionsTable = ({ transactions }: { transactions: any[] }) => {
  if (!transactions.length) {
    return (
        <div className="p-8 text-center text-slate-400 bg-[#0F172A] border border-gray-800 rounded-xl">
            No recent transactions
        </div>
    );
  }

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #475569 #1e293b;
        }
      `}</style>

      <div className="bg-[#0F172A] rounded-lg shadow-sm border border-gray-800 h-full flex flex-col overflow-hidden">
        
        <div className="overflow-y-auto overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-400">
            
            <thead className="bg-[#0F172A] text-slate-200 uppercase font-medium border-b border-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 tracking-wider text-xs text-slate-400">Name</th>
                <th className="px-6 py-4 tracking-wider text-xs text-slate-400">Date & Time</th>
                <th className="px-6 py-4 tracking-wider text-xs text-slate-400">Status</th>
                <th className="px-6 py-4 text-right tracking-wider text-xs text-slate-400">Amount</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-800">
              {transactions.map((t) => {
                const dateObj = new Date(t.date);
                const isDebit = t.type === "sent"; 
                
                let displayName = "Unknown";
                let subtext = "";
                let statusClasses = "bg-slate-500/10 text-slate-400"; 

                if (t.type === "deposit") {
                  displayName = "Wallet Load";
                  subtext = `Via ${t.provider}`;
                  
                  if (t.status === "Success") {
                      statusClasses = "bg-emerald-500/10 text-emerald-400";
                  } else if (t.status === "Processing") {
                      statusClasses = "bg-amber-500/10 text-amber-400";
                  } else {
                      statusClasses = "bg-rose-500/10 text-rose-400";
                  }
                } 
                else {
                  displayName = t.user;
                  subtext = t.type === "sent" ? "Sent P2P" : "Received P2P";
                  statusClasses = "bg-emerald-500/10 text-emerald-400"; 
                }

                return (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors duration-150 group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white tracking-wide">{displayName}</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors capitalize">
                          {subtext}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{dateObj.toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${statusClasses}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold tracking-wide ${isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isDebit ? '-' : '+'} ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};