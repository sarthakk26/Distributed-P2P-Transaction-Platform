"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  balance: number;
}

export const BalanceChart = ({ data }: { data: DataPoint[] }) => {
  if (!data || data.length === 0) return null;

  const balances = data.map(d => d.balance);
  const maxBalance = Math.max(...balances);
  const minBalance = Math.min(...balances);

  return (
    <div className="h-full w-full bg-[#0F172A] border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
      
      {/* HEADER */}
      <div className="p-6 pb-4">
        <h3 className="pb-3 text-lg font-bold text-white tracking-wide">
          Weekly Trend
        </h3>
        <p className="text-sm text-gray-400">
          Your balance over the last 7 days
        </p>
      </div>
      
      {/* GRAPH BODY */}
      <div className="h-[220px] w-full px-2 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            
            <XAxis 
                dataKey="date" 
                tick={{fontSize: 12, fill: "#94a3b8"}} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                dy={10}
            />
            
            <YAxis 
                tick={{fontSize: 12, fill: "#94a3b8"}} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                domain={['auto', 'auto']}
                width={85} 
            />
            
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: "#1e293b", 
                    border: "1px solid #334155", 
                    borderRadius: "8px", 
                    color: "#fff" 
                }}
                itemStyle={{ color: "#fff" }}
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, "Balance"]}
            />
            
            <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: "#818cf8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-2 border-t border-gray-800 bg-white/5 p-4 mt-auto">
        <div className="text-center border-r border-gray-800">
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Weekly High</p>
            <p className="text-sm font-bold text-emerald-400">₹{maxBalance.toLocaleString('en-IN')}</p>
        </div>
        <div className="text-center">
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Weekly Low</p>
            <p className="text-sm font-bold text-rose-400">₹{minBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};