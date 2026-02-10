"use client";
import { SparkAreaChart } from "@tremor/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useMemo } from "react";

interface TrendCardProps {
  type: "sent" | "received";
  amount: number;
  data: { day: string; amount: number }[];
}

function calculateTrend(data: { amount: number }[]) {
  if (!data || data.length < 2) return { value: "0.0%", isPositive: true };

  const recentData = data.slice(-3); 
  const oldData = data.slice(0, 3);

  const recentAvg = recentData.reduce((acc, curr) => acc + curr.amount, 0) / recentData.length;
  const oldAvg = oldData.reduce((acc, curr) => acc + curr.amount, 0) / oldData.length;

  if (oldAvg === 0) return { value: "100%", isPositive: true };

  const diff = recentAvg - oldAvg;
  const percent = (diff / oldAvg) * 100;

  return {
    value: `${Math.abs(percent).toFixed(1)}%`,
    isPositive: percent >= 0
  };
}

export const TrendCard = ({ type, amount, data }: TrendCardProps) => {
  const isReceived = type === "received";
  const label = isReceived ? "Total Received" : "Total Sent";
  
  const { value: percentValue, isPositive: isTrendPositive } = useMemo(() => calculateTrend(data), [data]);
  
  const isPositive = isReceived ? isTrendPositive : !isTrendPositive; 
  
  const trendColor = isTrendPositive ? "text-emerald-400" : "text-rose-400";
  const TrendIcon = isTrendPositive ? ArrowUpRight : ArrowDownRight;
  const chartColor = isReceived ? "emerald" : "rose";

  return (
    <div className="relative h-full bg-[#0F172A] border border-gray-800/50 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col justify-between overflow-hidden">
       
       {/* Header */}
       <div className="flex justify-between items-start z-10 mb-6 md:mb-8">
          <div className="flex flex-col">
            <h3 className="text-gray-400 text-xs md:text-sm font-semibold tracking-wide">
                {label}
            </h3>
            <p className="text-[0.625rem] md:text-xs text-gray-500 mt-1 font-medium">Last 7 Days</p> 
          </div>

          <div className="flex flex-col items-end">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 })}
            </h2>
            <div className={`flex items-center text-xs font-bold mt-1 ${trendColor}`}>
                <TrendIcon size={14} className="mr-1"/>
                <span>{percentValue}</span>
            </div>
          </div>
       </div>

       {/* Graph */}
       <div className={`absolute bottom-0 left-0 right-0 h-24 md:h-28 w-full z-0
           ${isReceived ? "drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"}`}
       >
          <SparkAreaChart
            data={data}
            categories={["amount"]}
            index="day"
            colors={[chartColor]}
            className="h-full w-full opacity-90"
          />
       </div>
    </div>
  );
};