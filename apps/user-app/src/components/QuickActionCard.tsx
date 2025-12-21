"use client";
import { useEffect, useState } from "react";
import { SendMoneyForm } from "./SendMoneyForm";
import { AddMoneyForm } from "./AddMoneyForm";

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-5 text-md font-medium transition-all duration-200 relative ${
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
    <div className="h-full flex flex-col bg-[#0F172A] border border-gray-800 rounded-xl p-1 shadow-sm">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <TabButton active={action === "send"} onClick={() => setAction("send")}>
          Send Money
        </TabButton>
        <TabButton active={action === "add"} onClick={() => setAction("add")}>
          Add Balance
        </TabButton>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-start gap-6 p-6 min-h-[280px]">
        
        {/* Render Form */}
        {action === "send" ? <SendMoneyForm key={selectedContactNumber} prefilledNumber={selectedContactNumber} /> : <AddMoneyForm />}

      </div>
    </div>
  );
};