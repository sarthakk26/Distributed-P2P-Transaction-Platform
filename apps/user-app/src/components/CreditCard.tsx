"use client";
import Image from "next/image";

// 1. Add 'name' to the props definition
export const CreditCard = ({ 
  amount, 
  name 
}: { 
  amount: number; 
  name: string;
}) => {
  return (
    <div className="h-full w-full rounded-xl relative overflow-hidden p-6 flex flex-col justify-between shadow-lg">
      
      {/* 1. Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#7c3aed] to-[#db2777] z-0"></div>
      
      {/* 2. Shine/Noise Overlay */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-black/40 to-transparent z-0"></div>

      {/* Content Layer */}
      <div className="relative z-10 text-white h-full flex flex-col justify-between">
        
        {/* Top: Chip & Wifi */}
        <div className="flex justify-between items-start">
          <div className="relative">
             <Image 
                src="/chip.png" 
                alt="Smart Chip" 
                width={45} 
                height={45} 
                className="object-contain opacity-90 drop-shadow-sm"
             />
           </div>
           
           <div className="relative">
             <Image 
                src="/contactless.svg" 
                alt="Contactless" 
                width={30} 
                height={30} 
                className="object-contain opacity-80 invert"
             />
           </div>
        </div>

        {/* Middle: Balance */}
        <div className="mt-4">
           <p className="text-purple-200 text-xs font-medium tracking-wider mb-1">Total Balance</p>
           <h2 className="text-3xl font-bold tracking-tight text-white">
             ₹ {amount.toLocaleString('en-IN')}
           </h2>
        </div>

        {/* Bottom: Name & Number */}
        <div className="mt-2 flex justify-between items-end opacity-90">
           <div>
             {/* 2. Display the 'name' prop, forcing Uppercase for that credit-card look */}
             <p className="font-semibold tracking-wide text-sm">
                {name.toUpperCase()}
             </p>
           </div>
           <div className="text-sm font-mono tracking-widest">
             **** 8859
           </div>
        </div>
      </div>
    </div>
  );
};