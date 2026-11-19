import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Calendar, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const COLUMNS = [
  { id: "Applied", label: "Applied", color: "bg-status-applied" },
  { id: "Screening", label: "Screening", color: "bg-status-screening" },
  { id: "Interview", label: "Interview", color: "bg-status-interview" },
  { id: "Offer", label: "Offer", color: "bg-status-offer" },
  { id: "Rejected", label: "Rejected", color: "bg-status-rejected" },
];

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

async function BoardData() {
  const supabase = await createClient();
  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .order("applied_date", { ascending: false });

  if (error) return <div className="text-destructive">Error: {error.message}</div>;

  return (
    <div className="flex items-start gap-5 min-w-[1240px] h-[calc(100vh-140px)] pb-4">
      {COLUMNS.map((col) => {
        const colApps = applications?.filter((app) => app.status === col.id) || [];

        return (
          <div key={col.id} className="w-[280px] shrink-0 flex flex-col rounded-md bg-muted/30 border border-border max-h-full">
            {/* Column Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-border bg-card rounded-t-md">
              <div className="flex items-center gap-2">
                <span className={cn("w-2.5 h-2.5 rounded-full", col.color)}></span>
                <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
              </div>
              <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border inline-flex items-center justify-center tabular-nums">
                {colApps.length}
              </span>
            </div>

            {/* Cards Container */}
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {colApps.map((app) => (
                <article
                  key={app.id}
                  className="p-4 rounded-md bg-card border border-border hover:border-primary/40 transition-all cursor-pointer group flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {app.company_name}
                    </span>
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0", getStatusStyle(app.status))}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {app.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground font-medium">
                    {app.position}
                  </p>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(app.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <GripVertical className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                </article>
              ))}

              {colApps.length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-md text-muted-foreground text-xs text-center px-4">
                  Tidak ada aplikasi di tahap ini.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BoardPage() {
  return (
    <>
      <Header title="Board" badge="Pipeline View" />
      <main className="flex-1 p-6 overflow-x-auto bg-background">
        <Suspense fallback={<div className="p-8 text-muted-foreground animate-pulse">Memuat Board...</div>}>
          <BoardData />
        </Suspense>
      </main>
    </>
  );
}