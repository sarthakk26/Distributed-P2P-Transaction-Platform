"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, LogOut, LayoutDashboard, ArrowLeftRight } from "lucide-react";

interface NavbarProps {
  user?: {
    name?: string | null;
    id?: string | null;
  };
  onSignout: () => void;
  avatarId?: number;
}

export const Navbar = ({ user, onSignout, avatarId = 1 }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/transactions", label: "Transactions", icon: <ArrowLeftRight size={18} /> },
  ];

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0F172A] border-b border-gray-800 backdrop-blur-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#575DFF] text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Right: User Info & Dropdown */}
          <div className="flex items-center gap-3" ref={dropdownRef}>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-700">
              <img
                src={`/avatars/${avatarId}.png`}
                alt={firstName}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* User Name (Hidden on small screens) */}
            <span className="hidden sm:block text-sm font-semibold text-white">
              {firstName}
            </span>

            {/* Dropdown Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-14 right-4 sm:right-6 lg:right-8 w-48 bg-[#0F172A] border border-gray-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onSignout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-3 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#575DFF] text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};