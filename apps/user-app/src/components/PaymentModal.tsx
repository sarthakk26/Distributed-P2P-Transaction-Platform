"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Bank config ────────────────────────────────────────────────
const BANK_CONFIG: Record<string, { color: string; accent: string; logo: React.ReactNode }> = {
  "HDFC Bank": {
    color: "#003F7F",
    accent: "#E63946",
    logo: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg"
        alt="HDFC Bank"
        className="h-8 w-auto"
      />
    ),
  },
  "Axis Bank": {
    color: "#97144D",
    accent: "#ED1164",
    logo: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg"
        alt="Axis Bank"
        className="h-8 w-auto"
      />
    ),
  },
};

const FALLBACK_BANK: { color: string; accent: string; logo: React.ReactNode } = {
  color: "#1E293B",
  accent: "#575DFF",
  logo: <span className="text-white font-semibold text-sm">Bank</span>,
};

// ─── Animated ring ───────────────────────────────────────────────
function StatusRing({ status, accent }: { status: string; accent: string }) {
  const isSuccess = status === "SUCCESS";
  const isFailed = status === "FAILED";
  const isDone = isSuccess || isFailed;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isDone
            ? isSuccess
              ? "0 0 0 0px rgba(34,197,94,0)"
              : "0 0 0 0px rgba(239,68,68,0)"
            : [`0 0 0 4px ${accent}33`, `0 0 0 12px ${accent}11`, `0 0 0 4px ${accent}33`],
        }}
        transition={{ duration: 1.8, repeat: isDone ? 0 : Infinity, ease: "easeInOut" }}
      />

      {/* SVG ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
        {/* Track */}
        <circle cx="48" cy="48" r="40" stroke="#1E293B" strokeWidth="5" fill="none" />

        {/* Animated progress arc */}
        {!isDone && (
          <motion.circle
            cx="48" cy="48" r="40"
            stroke={accent}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="251"
            animate={{ strokeDashoffset: [251, 60, 251] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Success full ring */}
        {isSuccess && (
          <motion.circle
            cx="48" cy="48" r="40"
            stroke="#22C55E"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="251"
            initial={{ strokeDashoffset: 251 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {/* Failed ring */}
        {isFailed && (
          <motion.circle
            cx="48" cy="48" r="40"
            stroke="#EF4444"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="251"
            initial={{ strokeDashoffset: 251 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </svg>

      {/* Center icon */}
      <AnimatePresence mode="wait">
        {!isDone && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-transparent"
              style={{ borderTopColor: accent, borderRightColor: `${accent}44` }}
            />
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="z-10"
          >
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            </svg>
          </motion.div>
        )}

        {isFailed && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="z-10"
          >
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
              <motion.path
                d="M6 6l12 12M18 6L6 18"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Receipt row ─────────────────────────────────────────────────
function ReceiptRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-white" : "text-slate-300"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config = {
    SUCCESS:    { label: "Success",    className: "bg-green-500/10 text-green-400 border-green-500/20" },
    FAILED:     { label: "Failed",     className: "bg-red-500/10 text-red-400 border-red-500/20" },
    PROCESSING: { label: "Processing", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    INITIATED:  { label: "Initiated",  className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  }[status] ?? { label: status, className: "bg-slate-500/10 text-slate-400 border-slate-500/20" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
      {status === "PROCESSING" && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
      {config.label}
    </span>
  );
}

// ─── Main modal ───────────────────────────────────────────────────
export function PaymentModal({
  token,
  provider,
  amount,
  onClose,
  onComplete,
}: {
  token: string;
  provider: string;
  amount: number;
  onClose: () => void;
  onComplete: (status: string) => void;
}) {
  const [status, setStatus] = useState<string>("INITIATED");
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(() => new Date());

  const bank = BANK_CONFIG[provider] ?? FALLBACK_BANK;
  const isSuccess = status === "SUCCESS";
  const isFailed = status === "FAILED";
  const isDone = isSuccess || isFailed;

  // Format helpers
  const formatAmount = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // Polling
  useEffect(() => {
    let mounted = true;
    let attempts = 0;
    const maxAttempts = 60;

    const poll = async () => {
      try {
        const res = await fetch(`/api/onramp/status?token=${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (!mounted) return;

        const s = data.status || "PROCESSING";
        setStatus(s);

        if (s === "SUCCESS") {
          onComplete("Success");
        } else if (s === "FAILED") {
          setError("Payment was declined by your bank.");
          onComplete("Failure");
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            setError("Timed out waiting for payment confirmation.");
            onComplete("Timeout");
          } else {
            setTimeout(poll, 1000);
          }
        }
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          setError("Network error. Please check your connection.");
          onComplete("Timeout");
        } else {
          setTimeout(poll, 1000);
        }
      }
    };

    setStatus("PROCESSING");
    poll();
    return () => { mounted = false; };
  }, [token]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={isDone ? onClose : undefined}
        />

        {/* Modal card */}
        <motion.div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "#0A0F1E" }}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          {/* Top accent bar */}
          <motion.div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${bank.color}, ${bank.accent})` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/5">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Payment via</p>
              {bank.logo}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Amount</p>
              <p className="text-xl font-bold text-white tracking-tight">{formatAmount(amount)}</p>
            </div>
          </div>

          {/* Ring + status */}
          <div className="flex items-center gap-5 px-6 py-6 border-b border-white/5">
            <StatusRing status={status} accent={bank.accent} />
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Status</p>
              <StatusBadge status={status} />
              <p className="text-xs text-slate-400 max-w-[160px] leading-relaxed">
                {isSuccess
                  ? "Your money has been added successfully."
                  : isFailed
                  ? error ?? "Payment was declined."
                  : "Please do not close this window."}
              </p>
            </div>
          </div>

          {/* Receipt */}
          <div className="px-6 py-4 border-b border-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">Transaction Details</p>
            <ReceiptRow label="Token" value={`${token.slice(0, 8)}...${token.slice(-4)}`} />
            <ReceiptRow label="Bank" value={provider} />
            <ReceiptRow label="Date" value={formatDate(startTime)} />
            <ReceiptRow label="Time" value={formatTime(startTime)} />
            <ReceiptRow label="Amount" value={formatAmount(amount)} highlight />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-slate-600">
              {isDone ? "You can now close this window." : "Awaiting confirmation..."}
            </p>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isDone
                  ? "bg-white text-black hover:bg-slate-200"
                  : "bg-white/5 text-slate-400 border border-white/10 cursor-default"
              }`}
              disabled={!isDone}
            >
              {isSuccess ? "Done" : isFailed ? "Dismiss" : "Please wait..."}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}