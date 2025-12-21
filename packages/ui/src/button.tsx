"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button = ({ onClick, children, disabled, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={`
        text-white bg-[#575DFF] hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
        font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className || ""}
      `}
    >
      {children}
    </button>
  );
};