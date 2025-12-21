import React from "react";

export const CardWrapper = ({ 
  children, 
  title 
}: { 
  children: React.ReactNode; 
  title: string; 
}) => {
  return (
    <div className="bg-[#0F172A] p-6 rounded-lg shadow-sm h-full">
      <h2 className="text-sm font-medium text-white uppercase tracking-wider mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
};