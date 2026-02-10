"use client"

import { useState } from "react";
import { CreditCard } from "@/components/CreditCard";
import { TrendCard } from "@/components/TrendCard";
import { QuickActionCard } from "@/components/QuickActionCard";
import { BalanceChart } from "@/components/BalanceChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransaction";
import { RecentContacts } from "@/components/dashboard/RecentContacts";

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
  
  const [selectedNumber, setSelectedNumber] = useState("");

  return (
    <div className="w-full max-w-[120rem] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Wallet Dashboard</h1>
        <p className="text-slate-400 text-sm md:text-base">
          Welcome Back, <span className="text-slate-400 font-bold">{firstName}</span>!
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
        
        {/* Left Content Area (Span 3) */}
        <div className="xl:col-span-3 flex flex-col gap-4 md:gap-6">
          
          {/* Top Row: 3 Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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

          {/* Bottom Row: Graph & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="min-h-[25rem]">
              <BalanceChart data={graphData}/>
            </div>
            <div className="min-h-[25rem]">
              <RecentTransactions transactions={transactions} />
            </div>
          </div>

        </div>

        {/* Right Sidebar Area (Span 1) */}
        <div className="xl:col-span-1 flex flex-col gap-4 md:gap-6">
          
          <div className="flex-1">
            <QuickActionCard selectedContactNumber={selectedNumber} />
          </div>

          <div className="h-auto">
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