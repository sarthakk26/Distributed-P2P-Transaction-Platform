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
    <div className="border rounded-lg p-6 bg-slate-50">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">Manual Actions</h3>
          <p className="text-sm text-slate-600">
            Force timeout check for stuck transactions
          </p>
        </div>
        
        <button
          onClick={runTimeouts}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Running..." : "Run Timeout Check"}
        </button>
      </div>

      {result && (
        <div className="mt-4 bg-white border rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-600 mb-2">Result:</p>
          <pre className="text-xs bg-slate-100 p-3 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}