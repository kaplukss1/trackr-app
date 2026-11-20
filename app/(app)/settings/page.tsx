"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { updateProfile, updatePassword, deleteAllApplications, getApplicationsForExport } from "./actions";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Database, Download, Trash2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFullName(user.user_metadata?.full_name || "");
        setEmail(user.email || "");
      }
    };
    getUser();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    const res = await updateProfile({ full_name: fullName });
    setIsLoadingProfile(false);
    if (res.error) toast.error(res.error);
    else toast.success("Profil berhasil diupdate!");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("Password minimal 6 karakter");
    setIsLoadingPassword(true);
    const res = await updatePassword(newPassword);
    setIsLoadingPassword(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Password berhasil diubah!");
      setNewPassword("");
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    const res = await getApplicationsForExport();
    setIsExporting(false);

    if (res.error) return toast.error(res.error);
    if (!res.data || res.data.length === 0) return toast.info("Belum ada data untuk di-export.");

    // Konversi JSON ke CSV
    const headers = ["Company", "Position", "Status", "Applied Date", "Location", "Salary", "URL"];
    const csvRows = res.data.map(app => [
      `"${app.company_name}"`, `"${app.position}"`, `"${app.status}"`,
      `"${app.applied_date}"`, `"${app.location || ''}"`,
      `"${app.salary || ''}"`, `"${app.job_url || ''}"`
    ].join(","));

    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `trackr-applications-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV berhasil didownload!");
  };

  const handleDeleteAllData = async () => {
    const res = await deleteAllApplications();
    if (res.error) toast.error(res.error);
    else {
      toast.success("Semua data lamaran berhasil dihapus.");
      window.location.reload();
    }
  };

  return (
    <>
      <Header title="Settings" />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-4xl mx-auto w-full">

        {/* 1. APPEARANCE */}
        <section className="p-6 rounded-md bg-card border border-border">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize how Trackr looks on your display. Toggle between clean light mode or comfortable graphite dark mode.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Sun className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Light Mode Card */}
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex items-start gap-4 p-4 rounded-md border text-left transition-all",
                mounted && theme === "light" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Light Mode</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Neutral off-white background</p>
              </div>
              {/* TAMBAHKAN suppressHydrationWarning DI SINI */}
              <div
                suppressHydrationWarning
                className={cn("w-4 h-4 rounded-full border ml-auto mt-1 shrink-0", mounted && theme === "light" ? "border-primary bg-primary" : "border-muted-foreground")}
              />
            </button>

            {/* Dark Mode Card */}
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex items-start gap-4 p-4 rounded-md border text-left transition-all",
                mounted && theme === "dark" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Dark Mode</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Graphite obsidian contrast</p>
              </div>
              {/* TAMBAHKAN suppressHydrationWarning DI SINI JUGA */}
              <div
                suppressHydrationWarning
                className={cn("w-4 h-4 rounded-full border ml-auto mt-1 shrink-0", mounted && theme === "dark" ? "border-primary bg-primary" : "border-muted-foreground")}
              />
            </button>
          </div>
        </section>

        {/* 2. FOLLOW-UP REMINDERS */}
        <section className="p-6 rounded-md bg-card border border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Follow-up Reminders</h2>
              <p className="text-sm text-muted-foreground">Set the inactivity duration before an application is highlighted in the "Needs follow-up" dashboard widget.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-md border border-border bg-muted/30">
            <div>
              <h3 className="text-sm font-semibold">Follow-up threshold (days)</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Applications with no status change after this duration trigger check-in alerts.</p>
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" defaultValue="7" className="w-20 text-center font-semibold tabular-nums" />
              <span className="text-sm text-muted-foreground font-medium">days</span>
            </div>
          </div>
        </section>

        {/* 3. DATA MANAGEMENT */}
        <section className="p-6 rounded-md bg-card border border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Data Management</h2>
              <p className="text-sm text-muted-foreground">Export your application history for external analysis or permanently erase local tracker data.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Database className="w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-md border border-border mb-4 gap-4">
            <div>
              <h3 className="text-sm font-semibold">Export Applications to CSV</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Download all tracked positions, interview notes, and stage histories into a portable spreadsheet.</p>
            </div>
            <Button variant="outline" onClick={handleExportCSV} disabled={isExporting} className="shrink-0 w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" /> {isExporting ? "Exporting..." : "Export to CSV"}
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-md border border-destructive/30 bg-destructive/5 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-destructive flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Delete all data
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-lg">
                This action cannot be undone. All active applications, interview records, compensation targets, and custom notes will be permanently wiped from your browser storage.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="shrink-0 w-full sm:w-auto">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete all data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Semua Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus <strong>seluruh riwayat lamaranmu secara permanen</strong>. Kamu tidak akan bisa mengembalikannya lagi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Ya, Hapus Semua
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        {/* --- BONUS: PROFILE & PASSWORD (Dari kode sebelumnya) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="p-6 rounded-md bg-card border border-border space-y-4">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={email} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <Button type="submit" disabled={isLoadingProfile} size="sm">
                {isLoadingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </section>

          <section className="p-6 rounded-md bg-card border border-border space-y-4">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Security</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" variant="secondary" disabled={isLoadingPassword} size="sm">
                {isLoadingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </section>
        </div>

      </main>
    </>
  );
}