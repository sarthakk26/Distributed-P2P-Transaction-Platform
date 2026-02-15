"use client";

import { signOut } from "next-auth/react";
import { Shield, LogOut } from "lucide-react";

export default function AdminNavbar({ name }: { name?: string | null }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Left — brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Admin Dashboard</p>
              <p className="text-xs text-slate-400">System Operations</p>
            </div>
          </div>

          {/* Right — user + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-100">
                {name ?? "Admin"}
              </p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-slate-200">
              {name?.charAt(0).toUpperCase() ?? "A"}
            </div>

            {/* Logout */}
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-red-500/50 hover:bg-red-950/30 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}