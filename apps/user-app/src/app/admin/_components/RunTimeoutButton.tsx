"use client";

import { useState } from "react";

export default function RunTimeoutButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function runTimeouts() {
    if (!confirm("Run Timeout check now?")) return;

    setLoading(true);
    const res = await fetch("/api/admin/onRamp/timeouts/run", {
      method: "POST",
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Manual Actions</h3>
      <button
        onClick={runTimeouts}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        {loading ? "Running..." : "Run timeout check now"}
      </button>

      {result && (
        <pre className="mt-2 text-xs bg-slate-100 p-2 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
