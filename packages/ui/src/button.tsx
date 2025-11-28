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
      className={
        `text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed 
         focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
         py-2.5 me-2 mb-2 ${className || ""}`
      }
    >
      {children}
    </button>
  );
};
