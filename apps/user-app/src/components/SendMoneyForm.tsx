"use client";
import { Button } from "@repo/ui";
import { TextInput } from "@repo/ui";
import { useEffect, useState } from "react";
import { p2pTransfer } from "@/lib/action/p2pTransfer";
import { toast } from "sonner";

export const SendMoneyForm = ({ prefilledNumber }:{prefilledNumber?:string}) => {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  
  useEffect(() => {
    if (prefilledNumber) {
      setNumber(prefilledNumber);
    }
  }, [prefilledNumber]);

  const handleTransfer = async () => {
    if (!number || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    const toastId = toast.loading("Processing...");
    try {
      const result = await p2pTransfer(number, Number(amount));
      if (result && result.message !== "Transfer successful") {
        toast.dismiss(toastId);
        toast.error(result.message);
        return;
      }
      toast.dismiss(toastId);
      toast.success("Transfer successful!");
      setAmount("");
    } catch (e: any) {
      toast.dismiss(toastId);
      toast.error(e.message || "Transfer failed");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <TextInput
          label="Number"
          placeholder="Enter phone number"
          value={number}
          onChange={(val) => {
            setNumber(val);
          }}
        />
        <TextInput
          label="Amount"
          placeholder="Enter amount"
          value={amount}
          onChange={(val) => setAmount(val)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleTransfer}
          className="w-full bg-[#575DFF] hover:bg-[#4a4fc7] text-white"
        >
          Send Money
        </Button>
      </div>
    </div>
  );
};