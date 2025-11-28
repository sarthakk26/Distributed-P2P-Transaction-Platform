"use client";

import { useEffect, useState } from "react";

export function PaymentModal({
  token,
  onClose,
  onComplete,
}: {
  token: string;
  onClose: () => void;
  onComplete: (status: string) => void;
}) {
  const [status, setStatus] = useState<string>("Processing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let attempts = 0;
    const maxAttempts = 60;
    const interval = 1000;

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/onramp/status?token=${encodeURIComponent(token)}`
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `status ${res.status}`);
        }
        const data = await res.json();
        if (!mounted) return;

        setStatus(data.status || "Processing");

        if (data.status === "Success") {
          onComplete("Success");
        } else if (data.status === "Failure") {
          setError("Payment Failed");
          onComplete("Failure");
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            setError("Timed out waiting for payment");
            onComplete("Timeout");
          } else {
            setTimeout(poll, interval);
          }
        }
      } catch (err: any) {
        attempts++;
        if (attempts >= maxAttempts) {
          setError("Network or server error (timeout)");
          onComplete("Timeout");
        } else {
          setTimeout(poll, interval);
        }
      }
    };

    poll();

    return () => {
      mounted = false;
    };
  }, [token]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
        <p className="text-sm text-slate-600 mb-4">
          We are processing your payment. Do not close this window.
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-slate-200 animate-spin" />
          <div>
            <div className="text-sm">Status</div>
            <div className="font-medium">{status}</div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => {
              onClose();
            }}
            className="px-4 py-2 rounded border"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
