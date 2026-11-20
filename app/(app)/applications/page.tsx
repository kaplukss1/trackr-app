import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ApplicationRowActions } from "@/components/applications/application-row-actions";
import { AddApplicationDialog } from "@/components/applications/add-application-dialog";

// Helper untuk warna badge status
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

async function ApplicationsTable() {
  await connection();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user?.id)
    .order("applied_date", { ascending: false });

  const applications = data || [];

  if (error) {
    return <div className="p-8 text-destructive bg-destructive/10 rounded-md">Error: {error.message}</div>;
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden shadow-sm">
      {/* Wrapper untuk scroll di mobile */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="py-3 px-5 text-xs font-semibold text-muted-foreground">Company</th>
              <th className="py-3 px-5 text-xs font-semibold text-muted-foreground">Position</th>
              <th className="py-3 px-5 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="py-3 px-5 text-xs font-semibold text-muted-foreground">Applied Date</th>
              {/* <th className="py-3 px-5 text-xs font-semibold text-muted-foreground">Interview Date</th> */}
              <th className="py-3 px-5 text-xs font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-muted/50 transition-colors group cursor-pointer">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                      {app.company_name.substring(0, 2).toUpperCase()}
                    </div>
                    <Link href={`/applications/${app.id}`} className="font-semibold text-foreground group-hover:text-primary transition-colors hover:underline">
                      {app.company_name}
                    </Link>
                  </div>
                </td>
                <td className="py-4 px-5 font-medium">{app.position}</td>
                <td className="py-4 px-5">
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border", getStatusStyle(app.status))}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {app.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-muted-foreground tabular-nums">
                  {new Date(app.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                {/* 
                <td className="py-4 px-5 text-muted-foreground tabular-nums">
                  {app.interview_date 
                    ? new Date(app.interview_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                    : "—"}
                </td> 
                */}
                <td className="py-4 px-5 text-right">
                  <ApplicationRowActions app={app} />
                </td>
              </tr>
            ))}
            
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  Belum ada data aplikasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <>
      <Header 
        title="Applications" 
        actionButton={<AddApplicationDialog />} 
      />
      
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        {/* Filters Bar */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search by company or role..." 
              className="w-full pl-9 pr-3 py-2 rounded-md text-sm bg-card border border-border focus:border-primary outline-none" 
            />
          </div>
        </section>

        {/* Bungkus tabel dengan Suspense */}
        <Suspense fallback={
          <div className="p-8 text-center text-muted-foreground animate-pulse">
            Memuat data dari Supabase...
          </div>
        }>
          <ApplicationsTable />
        </Suspense>
      </main>
    </>
  );
}