"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !password) {
        toast.error("Please fill in all fields");
        return;
    }

    setIsLoading(true);

    try {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password, name }),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("Account created successfully!");
            // Redirect to your CUSTOM signin page, not the default next-auth one
            setTimeout(() => router.push("/signin"), 1000);
        } else {
            toast.error(data.message || "Signup failed");
            setIsLoading(false);
        }
    } catch (error) {
        toast.error("Something went wrong. Please try again.");
        setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#020617]">
      
      {/* 1. BACKGROUND IMAGE (Same as Sign In) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: `url('/auth-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8 
        }}
      />

      {/* 2. SIGN UP CARD */}
      <div className="relative z-10 w-full max-w-lg p-8">
        
        {/* Glassmorphism Container */}
        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-500/20">
            
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Join Wallet</h1>
                <p className="text-slate-400 text-sm">Create an account to get started</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                        Full Name
                    </label>
                    <input 
                        type="text" 
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#575DFF] focus:border-transparent transition-all"
                    />
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                        Phone Number
                    </label>
                    <input 
                        type="text" 
                        placeholder="1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#575DFF] focus:border-transparent transition-all"
                    />
                </div>

                {/* Password Input */}
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

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#575DFF] hover:bg-[#4a4fc7] text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                </button>

                {/* Footer Links */}
                <div className="flex justify-center mt-6">
                    <p className="text-slate-400 text-sm">
                        Already have an account?{" "}
                        <button 
                            type="button"
                            onClick={() => router.push("/signin")} 
                            className="text-[#575DFF] hover:text-indigo-400 font-medium transition-colors"
                        >
                            Login
                        </button>
                    </p>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}