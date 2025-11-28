"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password, name }),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Account created! Redirecting to login...");
      setTimeout(() => router.push("/api/auth/signin"), 800);
    } else {
      setMsg(data.message || "Signup failed");
    }
    setLoading(false);
  }

  return(
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-red-600 mt-2">{msg}</p>
      </form>
    </div>
  )
}
