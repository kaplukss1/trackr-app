import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Calendar, Inbox, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

function getStatusStyle(status: string) {
  switch (status) {
    case "Applied": return "bg-status-applied-bg text-status-applied border-status-applied-border";
    case "Screening": return "bg-status-screening-bg text-status-screening border-status-screening-border";
    case "Interview": return "bg-status-interview-bg text-status-interview border-status-interview-border";
    case "Offer": return "bg-status-offer-bg text-status-offer border-status-offer-border";
    case "Rejected": return "bg-status-rejected-bg text-status-rejected border-status-rejected-border";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

async function DashboardContent() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user?.id) // <-- Tambahkan ini
    .order("applied_date", { ascending: false });

  if (error) return <div className="text-destructive">Error: {error.message}</div>;

  // Tambahkan baris ini untuk memastikan 'apps' tidak pernah null
  const apps = data || [];

  // 1. Hitung Statistik
  const stats = {
    applied: apps.filter((a) => a.status === "Applied").length,
    screening: apps.filter((a) => a.status === "Screening").length,
    interview: apps.filter((a) => a.status === "Interview").length,
    offer: apps.filter((a) => a.status === "Offer").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  };

  // 2. Ambil data untuk "Upcoming Interviews" (Interview date di masa depan, urutkan terdekat)
  const upcomingInterviews = apps
    .filter((a) => a.interview_date && new Date(a.interview_date) >= new Date())
    .sort((a, b) => new Date(a.interview_date).getTime() - new Date(b.interview_date).getTime())
    .slice(0, 4);

  // 3. Ambil data untuk "Needs Follow-up" (Status Applied/Screening, urutkan terlama)
  const needsFollowUp = apps
    .filter((a) => a.status === "Applied" || a.status === "Screening")
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Row of 5 Status Stat Cards */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Applied */}
          <div className="p-4 rounded-md bg-card border border-border hover:border-status-applied-border transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Applied</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-applied-bg text-status-applied border border-status-applied-border">
                <span className="w-1.5 h-1.5 rounded-full bg-status-applied"></span> Active
              </span>
            </div>
            <span className="text-2xl font-bold tabular-nums">{stats.applied}</span>
          </div>
          
          {/* Screening */}
          <div className="p-4 rounded-md bg-card border border-border hover:border-status-screening-border transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Screening</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-screening-bg text-status-screening border border-status-screening-border">
                <span className="w-1.5 h-1.5 rounded-full bg-status-screening"></span> In review
              </span>
            </div>
            <span className="text-2xl font-bold tabular-nums">{stats.screening}</span>
          </div>

          {/* Interview */}
          <div className="p-4 rounded-md bg-card border border-border hover:border-status-interview-border transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Interview</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-interview-bg text-status-interview border border-status-interview-border">
                <span className="w-1.5 h-1.5 rounded-full bg-status-interview"></span> Scheduled
              </span>
            </div>
            <span className="text-2xl font-bold tabular-nums">{stats.interview}</span>
          </div>

          {/* Offer */}
          <div className="p-4 rounded-md bg-card border border-border hover:border-status-offer-border transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Offer</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-offer-bg text-status-offer border border-status-offer-border">
                <span className="w-1.5 h-1.5 rounded-full bg-status-offer"></span> Extended
              </span>
            </div>
            <span className="text-2xl font-bold text-status-offer tabular-nums">{stats.offer}</span>
          </div>

          {/* Rejected */}
          <div className="p-4 rounded-md bg-card border border-border hover:border-status-rejected-border transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Rejected</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-rejected-bg text-status-rejected border border-status-rejected-border">
                <span className="w-1.5 h-1.5 rounded-full bg-status-rejected"></span> Closed
              </span>
            </div>
            <span className="text-2xl font-bold tabular-nums">{stats.rejected}</span>
          </div>
        </div>
      </section>

      {/* Two-Column Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Needs follow-up */}
        <div className="p-6 rounded-md bg-card border border-border">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Needs follow-up</h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border">
              {apps.filter(a => a.status === "Applied" || a.status === "Screening").length} pending
            </span>
          </div>

          <ul className="divide-y divide-border">
            {needsFollowUp.length > 0 ? (
              needsFollowUp.map((app) => (
                <li key={app.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                      {app.company_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <Link href={`/applications/${app.id}`} className="text-sm font-semibold hover:underline">{app.company_name}</Link>
                      <p className="text-xs text-muted-foreground">{app.position}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {new Date(app.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">Tidak ada antrean follow-up.</p>
            )}
          </ul>
        </div>

        {/* Upcoming interviews */}
        <div className="p-6 rounded-md bg-card border border-border">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-status-interview" />
              <h3 className="text-lg font-semibold">Upcoming interviews</h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-status-interview-bg text-status-interview border border-status-interview-border">
              {upcomingInterviews.length} rounds
            </span>
          </div>

          <ul className="divide-y divide-border">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((app) => (
                <li key={app.id} className="py-3.5 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-md bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {app.company_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <Link href={`/applications/${app.id}`} className="text-sm font-semibold hover:underline">{app.company_name}</Link>
                      <p className="text-xs text-muted-foreground">{app.position}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <Video className="w-3.5 h-3.5 text-primary" /> Interview Scheduled
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold block">
                      {new Date(app.interview_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {new Date(app.interview_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">Tidak ada jadwal interview terdekat.</p>
            )}
          </ul>
        </div>

      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" badge="Active Hunt" searchPlaceholder="Search roles or companies..." />
      <main className="flex-1 p-8 overflow-y-auto bg-background">
        <Suspense fallback={<div className="p-8 text-muted-foreground animate-pulse">Memuat dashboard...</div>}>
          <DashboardContent />
        </Suspense>
      </main>
    </>
  );
}