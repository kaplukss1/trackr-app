"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Loader2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      
      toast.success("Akun berhasil dibuat! Silakan cek email atau langsung login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12">
      
      {/* Left Column: Form */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-8 sm:p-12 lg:p-14 bg-card border-r border-border overflow-y-auto">
        
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-95 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Trackr</span>
        </Link>

        <div className="w-full max-w-sm mx-auto my-8 space-y-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Start tracking applications and organize your hunt.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label>Full name</Label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="e.g. Alex Lewis" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="you@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Password</Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a password (min 6 chars)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required 
                  minLength={6}
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

            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground pt-1">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
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
            Get Started in Seconds
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Track every application. <br />Miss nothing.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Join thousands of designers, engineers, and product builders managing their careers with precision.
          </p>
        </div>

        <div className="relative z-10 my-8 w-full max-w-lg mx-auto">
          <div className="rounded-md border border-border bg-card/90 shadow-sm p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="font-semibold text-foreground">New Applicant Board</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-md bg-muted/50 border border-border space-y-2">
                <span className="text-[11px] font-semibold text-status-applied flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-status-applied"></span> Applied</span>
                <div className="p-2 rounded bg-card border border-border text-[11px] font-medium">Linear • Frontend</div>
              </div>
              <div className="p-2.5 rounded-md bg-muted/50 border border-border space-y-2">
                <span className="text-[11px] font-semibold text-status-interview flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-status-interview"></span> Interview</span>
                <div className="p-2 rounded bg-card border border-status-interview-border text-[11px] font-medium ring-1 ring-status-interview/20">Stripe • Round 1</div>
              </div>
              <div className="p-2.5 rounded-md bg-muted/50 border border-border space-y-2">
                <span className="text-[11px] font-semibold text-status-offer flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-status-offer"></span> Offer</span>
                <div className="h-10 rounded border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">Ready</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> 100% Free for job seekers</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> Instant cloud sync</div>
        </div>
      </div>
    </main>
  );
}