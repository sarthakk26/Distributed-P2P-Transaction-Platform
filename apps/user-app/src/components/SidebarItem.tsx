"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <div
      className={`
        flex items-center cursor-pointer p-3 pl-6 my-1 transition-all duration-200
        ${selected 
          ? "text-blue-500 border-l-4 border-blue-500 bg-[#1e293b]" 
          : "text-slate-400 hover:text-slate-100 hover:bg-[#1e293b]" 
        }
      `}
      onClick={() => {
        router.push(href);
      }}
    >
      <div className="pr-3">
        {icon}
      </div>
      <div className={`font-medium ${selected ? "text-blue-500" : "text-slate-400 hover:text-slate-100"}`}>
        {title}
      </div>
    </div>
  );
};