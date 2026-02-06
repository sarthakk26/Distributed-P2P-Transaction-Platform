"use client";

import { useState } from "react";

export default function RunTimeoutButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function runTimeouts() {
    if (!confirm("Run timeout check now? This will auto-fail stuck transactions.")) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/onRamp/timeouts/run", {
        method: "POST",
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to run timeouts" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-900/50">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Manual Actions</h3>
            <p className="mt-1 text-sm text-slate-400">
              Force timeout check for stuck transactions. This will auto-fail transactions stuck in PROCESSING state.
            </p>
          </div>
        </div>
        
        <button
          onClick={runTimeouts}
          disabled={loading}
          className="shrink-0 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-600 disabled:hover:bg-slate-600"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Running...
            </span>
          ) : (
            "Run Timeout Check"
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs font-semibold text-slate-300">Result:</p>
          </div>
          <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-200">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}