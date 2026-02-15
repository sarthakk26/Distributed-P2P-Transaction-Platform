"use client";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    const res = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid credentials");
      setIsLoading(false);
      return;
    }

    // Fetch the session to read the role
    const session = await getSession();
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#020617]">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/base.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.8,
        }}
      />

      <div className="relative z-10 w-full max-w-lg p-8">
        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-slate-400 text-sm">Login to your Wallet Dashboard</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#575DFF] focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#575DFF] focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#575DFF] hover:bg-[#4a4fc7] text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="flex flex-col items-center gap-4 mt-6">
              <button className="text-sm text-[#575DFF] hover:text-indigo-400 transition-colors">
                Forgot Password?
              </button>
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="text-[#575DFF] hover:text-indigo-400 font-medium transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}