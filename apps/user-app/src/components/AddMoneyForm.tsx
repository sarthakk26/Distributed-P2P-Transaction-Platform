"use client";
import { Button } from "@repo/ui";
import { TextInput } from "@repo/ui";
import { useState, useRef, useEffect } from "react";
import { PaymentModal } from "./PaymentModal";
import { toast } from "sonner";
import { ChevronDown, Check } from "lucide-react";

const SUPPORTED_BANKS = [
  { name: "HDFC Bank", redirectUrl: "https://netbanking.hdfcbank.com" },
  { name: "Axis Bank", redirectUrl: "https://www.axisbank.com/" },
];

export const AddMoneyForm = () => {
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
  const [value, setValue] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  async function startPayment() {
    if (!value || value <= 0) {
        toast.error("Enter a valid amount");
        return;
    }
    setIsProcessing(true);
    const toastId = toast.loading("Connecting to bank...");
    try {
      const res = await fetch("/api/onramp/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, amount: value }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setToken(data.token);
      toast.dismiss(toastId);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Failed to start payment");
      setIsProcessing(false);
    }
  }

  return (
    <>
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-4">
          <TextInput
            label="Amount"
            placeholder="Enter amount"
            onChange={(val) => setValue(Number(val))}
          />
          
          <div className="pt-2">
            <CustomSelect
              label="Select Bank"
              options={SUPPORTED_BANKS.map((x) => ({
                key: x.name,
                value: x.name,
              }))}
              onSelect={(value) => {
                const bank = SUPPORTED_BANKS.find((x) => x.name === value);
                setRedirectUrl(bank?.redirectUrl || "");
                setProvider(bank?.name || "");
              }}
              initialValue={provider}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={startPayment} disabled={isProcessing} className="w-full bg-[#575DFF] hover:bg-[#4a4fc7]">
            {isProcessing ? "Processing..." : "Add Money"}
          </Button>
        </div>
      </div>

      {token && (
        <PaymentModal
          token={token}
          onClose={() => { setToken(null); setIsProcessing(false); }}
          onComplete={() => window.location.reload()}
        />
      )}
    </>
  );
};

// --- UPDATED HIGH-CONTRAST SELECT ---

interface Option {
  key: string;
  value: string;
}

const CustomSelect = ({ 
  label, 
  options, 
  onSelect, 
  initialValue 
}: { 
  label: string; 
  options: Option[]; 
  onSelect: (value: string) => void; 
  initialValue?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(initialValue || options[0]?.value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-medium text-slate-400 mb-2 pl-1">
        {label}
      </label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full bg-[#0F172A] border border-gray-800 text-white font-medium text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block p-3 text-left flex items-center justify-between transition-all ${isOpen ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}
      >
        <span className="truncate">{selected}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#0F172A] border border-gray-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <ul className="py-1 max-h-60 overflow-auto custom-scrollbar">
            {options.map((option) => (
              <li
                key={option.key}
                onClick={() => {
                  setSelected(option.value);
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 text-sm font-medium cursor-pointer flex items-center justify-between group transition-colors
                  ${selected === option.value 
                    ? 'bg-[#575DFF] text-white' // SELECTED: Blue Background, White Text
                    : 'text-slate-300 hover:bg-white/5 hover:text-white' // NORMAL: Light Gray, White on Hover
                  }
                `}
              >
                {option.value}
                {selected === option.value && <Check size={16} className="text-white" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};