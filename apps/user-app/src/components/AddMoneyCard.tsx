"use client";
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";
import { Select } from "@repo/ui";
import { TextInput } from "@repo/ui";
import { useState } from "react";
import { createOnRampTransaction } from "@/lib/action/createOnRampTransaction";
import { PaymentModal } from "./PaymentModal";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
  const [value, setValue] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  async function startPayment() {
    if (!value || value <= 0) {
      alert("Enter a valid amount");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/onramp/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, amount: value }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `status ${res.status}`);
      }

      const data = await res.json();
      if (data?.token) {
        setToken(data.token);
      } else {
        throw new Error("No token from server");
      }
    } catch (err: any) {
      console.error("startPayment error:", err);
      alert("Could not start payment. Try again.");
      setIsProcessing(false);
    }
  }

  return (
    <>
      <Card title="Add Money">
        <div className="w-full">
          <TextInput
            label={"Amount"}
            placeholder={"Amount"}
            onChange={(val) => {
              setValue(Number(val));
            }}
          />
          <div className="py-4 text-left">Bank</div>
          <Select
            onSelect={(value) => {
              setRedirectUrl(
                SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ""
              );
              setProvider(
                SUPPORTED_BANKS.find((x) => x.name === value)?.name || ""
              );
            }}
            options={SUPPORTED_BANKS.map((x) => ({
              key: x.name,
              value: x.name,
            }))}
          ></Select>
          <div className="flex justify-center pt-4">
            <Button onClick={startPayment} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Add Money"}
            </Button>
          </div>
        </div>
      </Card>
      {token && (
        <PaymentModal
          token={token}
          onClose={() => {
            setToken(null);
            setIsProcessing(false);
          }}
          onComplete={(status) => {
            // refresh the page (or refetch balance) to show updated balance and transactions
            // simple approach: reload
            window.location.reload();
          }}
        />
      )}
    </>
  );
};
