"use client"

import { useState } from "react";
import { CreditCard } from "@/components/CreditCard";
import { TrendCard } from "@/components/TrendCard";
import { QuickActionCard } from "@/components/QuickActionCard";
import { BalanceChart } from "@/components/BalanceChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransaction";
import { RecentContacts } from "@/components/dashboard/RecentContacts";

// Define the props we expect from the server
interface DashboardClientProps {
  stats: any;
  transactions: any[];
  contacts: any[];
  graphData: any[];
  firstName: string;
}

export const DashboardClient = ({ 
  stats, 
  transactions, 
  contacts, 
  graphData, 
  firstName 
}: DashboardClientProps) => {
  
  // Now useState works perfectly here!
  const [selectedNumber, setSelectedNumber] = useState("");

  return (
    <div className="w-full max-w-[1600px] px-4 md:px-8 py-4 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Wallet Dashboard</h1>
        <p className="text-slate-400 text-md">
            Welcome Back, <span className="text-slate-400 font-bold">{firstName}</span> !!
        </p>
      </div>

      {/* === MAIN LAYOUT GRID === */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* --- LEFT CONTENT AREA (Span 3) --- */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* 1. TOP ROW: 3 Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-52">
              <CreditCard amount={stats.balance} name={firstName} />
            </div>
            <div className="h-52">
              <TrendCard type="received" amount={stats.received} data={stats.receivedData} />
            </div>
            <div className="h-52">
              <TrendCard type="sent" amount={stats.sent} data={stats.sentData} />
            </div>
          </div>

          {/* 2. BOTTOM ROW: Graph & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="h-full min-h-[400px]">
              <BalanceChart data={graphData}/>
            </div>
            <div className="h-full min-h-[400px]">
              <RecentTransactions transactions={transactions} />
            </div>
          </div>

        </div>

        {/* --- RIGHT SIDEBAR AREA (Span 1) --- */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          <div className="flex-1">
            {/* Pass the state down */}
            <QuickActionCard selectedContactNumber={selectedNumber} />
          </div>

          <div className="h-auto">
            {/* Update the state up */}
            <RecentContacts 
                contacts={contacts} 
                onContactClick={(number) => {
                    setSelectedNumber(number)
                }} 
            />
          </div>
          
        </div>

      </div>
    </div>
  );
};