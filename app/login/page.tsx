"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast.success("Berhasil login!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12">
      
      {/* Left Column: Form */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-card border-r border-border">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-95 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Trackr</span>
        </Link>

        {/* Form */}
        <div className="w-full max-w-sm mx-auto my-12 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Sign in to track your job search pipeline.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-border"></div>
            <span className="absolute bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">or</span>
          </div>

          <Button variant="outline" className="w-full" onClick={() => toast.info("Fitur Google Login segera hadir!")}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"></path>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"></path>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"></path>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"></path>
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground/70">
          © 2026 Trackr Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Illustration */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-indigo-50/50 dark:bg-slate-950 p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-indigo-100/50 dark:bg-indigo-950/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-indigo-200/40 dark:bg-indigo-900/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
            Productivity Workspace
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Track every application. <br />Miss nothing.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Organize interviews, log compensation offers, and schedule prompt follow-ups across your entire search.
          </p>
        </div>

        <div className="relative z-10 my-8 w-full max-w-lg mx-auto">
          <div className="rounded-md border border-border bg-card/90 shadow-sm p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="font-semibold text-foreground">Active Pipeline</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-md bg-muted/50 border border-border space-y-2">
                <span className="text-[11px] font-semibold text-status-applied flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-applied"></span> Applied
                </span>
                <div className="p-2 rounded bg-card border border-border text-[11px] font-medium">Airbnb • Lead</div>
                <div className="p-2 rounded bg-card border border-border text-[11px] font-medium">Vercel • Design</div>
              </div>
              <div className="p-2.5 rounded-md bg-muted/50 border border-border space-y-2">
                <span className="text-[11px] font-semibold text-status-interview flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-interview"></span> Interview
                </span>
                <div className="p-2 rounded bg-card border border-status-interview-border text-[11px] font-medium ring-1 ring-status-interview/20">Stripe • Round 3</div>
              </div>
              <div className="p-2.5 rounded-md bg-muted/50 border border-border space-y-2">
                <span className="text-[11px] font-semibold text-status-offer flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-offer"></span> Offer
                </span>
                <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-[11px] font-medium text-emerald-800">Supabase • DX</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> Zero-latency local tracking</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> Private & encrypted</div>
        </div>
      </div>
    </main>
  );
}