"use client";
import { useEffect, useState } from "react";
import { SendMoneyForm } from "./SendMoneyForm";
import { AddMoneyForm } from "./AddMoneyForm";

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-sm md:text-base font-medium transition-all duration-200 relative ${
        active ? "text-[#575DFF]" : "text-white hover:text-gray-400"
      }`}
    >
      {children}
      {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#575DFF] rounded-t-md" />}
    </button>
  );
};

export const QuickActionCard = ({selectedContactNumber}:{selectedContactNumber?:string}) => {
  const [action, setAction] = useState<"send" | "add">("send");

  useEffect(()=>{
    if(selectedContactNumber){
      setAction("send")
    }
  },[selectedContactNumber])

  return (
    <div className="w-full flex flex-col bg-[#0F172A] border border-gray-800 rounded-xl p-1 shadow-sm">
      
      {/* Tabs - FIXED */}
      <div className="flex border-b border-gray-800 flex-shrink-0">
        <TabButton active={action === "send"} onClick={() => setAction("send")}>
          Send Money
        </TabButton>
        <TabButton active={action === "add"} onClick={() => setAction("add")}>
          Add Balance
        </TabButton>
      </div>

      {/* Content Area - Natural Height */}
      <div className="p-4 md:p-6">
        {/* Render Form */}
        {action === "send" ? <SendMoneyForm key={selectedContactNumber} prefilledNumber={selectedContactNumber} /> : <AddMoneyForm />}
      </div>
    </div>
  );
};