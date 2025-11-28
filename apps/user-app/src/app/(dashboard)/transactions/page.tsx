"use client";

import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [tx, setTx] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTx(data);
    }
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Transactions</h1>

      <div className="space-y-4">
        {tx.map((t: any) => (
          <div
            key={t.id}
            className="border p-4 rounded shadow-sm flex justify-between"
          >
            <div>
              <p className="font-semibold">
                {t.type === "ADDED" && "Money Added"}
                {t.type === "SENT" && `Sent to ${t.otherUser}`}
                {t.type === "RECEIVED" && `Received from ${t.otherUser}`}
              </p>

              <p className="text-sm text-gray-600">
                {new Date(t.timestamp).toLocaleString()}
              </p>

              {t.type === "ADDED" && (
                <p className="text-sm text-gray-600">
                  Provider: {t.provider} – Status: {t.status}
                </p>
              )}
            </div>

            <div
              className={`font-bold text-lg ${
                t.type === "SENT" ? "text-red-600" : "text-green-600"
              }`}
            >
              {t.type === "SENT" ? "-" : "+"}₹{t.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
