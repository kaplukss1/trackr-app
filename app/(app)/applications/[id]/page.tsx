import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, DollarSign, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { EditApplicationDialog } from "@/components/applications/edit-application-dialog";
import { DeleteApplicationButton } from "@/components/applications/delete-application-button";
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

// 1. Pindahkan logika pengambilan data ke komponen terpisah
async function ApplicationDetailContent({ params }: { params: Promise<{ id: string }> }) {

    await connection();

    const { id } = await params; // <-- Await params di SINI (di dalam Suspense)
    const supabase = await createClient();

    const { data: app, error } = await supabase
        .from("applications")
        .select("*, application_events(*)")
        .eq("id", id)
        .single();

    if (error || !app) {
        notFound();
    }

    const timeline = app.application_events?.sort(
        (a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    ) || [];

    return (
        <>
            <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-6xl w-full mx-auto">
                {/* Header Section */}
                <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center text-xl shrink-0 mt-0.5">
                            {app.company_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold text-foreground">{app.company_name}</h1>
                                <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border", getStatusStyle(app.status))}>
                                    <span className="w-2 h-2 rounded-full bg-current"></span>
                                    {app.status}
                                </span>
                            </div>
                            <p className="text-lg text-muted-foreground font-medium mt-1">{app.position}</p>
                        </div>
                    </div>

                    {/* // btn edit dan delete */}
                    <EditApplicationDialog app={app} />
                    <DeleteApplicationButton id={app.id} />
                </section>

                <div>
                    <Link href="/applications" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Applications
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="p-6 rounded-md bg-card border border-border space-y-5">
                            <h2 className="text-lg font-semibold border-b border-border pb-3">Application Details</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                                {app.job_url && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-xs font-medium text-muted-foreground mb-1">Job Listing URL</dt>
                                        <dd>
                                            <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline font-medium break-all">
                                                <span>{app.job_url}</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-xs font-medium text-muted-foreground mb-1">Applied Date</dt>
                                    <dd className="font-semibold flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        {new Date(app.applied_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </dd>
                                </div>
                                {app.interview_date && (
                                    <div>
                                        <dt className="text-xs font-medium text-muted-foreground mb-1">Next Interview</dt>
                                        <dd className="text-status-interview font-semibold flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(app.interview_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                        </dd>
                                    </div>
                                )}
                                {app.location && (
                                    <div>
                                        <dt className="text-xs font-medium text-muted-foreground mb-1">Location</dt>
                                        <dd className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            {app.location}
                                        </dd>
                                    </div>
                                )}
                                {app.salary && (
                                    <div>
                                        <dt className="text-xs font-medium text-muted-foreground mb-1">Target Compensation</dt>
                                        <dd className="flex items-center gap-1.5">
                                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                                            {app.salary}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="p-6 rounded-md bg-card border border-border space-y-4">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <h2 className="text-lg font-semibold">Notes & Context</h2>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {app.notes || "Belum ada catatan untuk aplikasi ini."}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="p-6 rounded-md bg-card border border-border">
                            <div className="flex items-center justify-between border-b border-border pb-3 mb-6">
                                <h2 className="text-lg font-semibold">Stage Timeline</h2>
                                <span className="text-xs font-medium text-status-interview">Active Round</span>
                            </div>

                            {timeline.length > 0 ? (
                                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                    {timeline.map((event: any) => (
                                        <div key={event.id} className="relative">
                                            <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20"></span>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm font-semibold">{event.title}</h3>
                                                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                                                </div>
                                                <span className="text-xs font-semibold text-muted-foreground tabular-nums shrink-0">
                                                    {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada riwayat timeline.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

// 2. Fungsi utama halaman hanya membungkus konten dengan Suspense
export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <>
            <Header title="Application Detail" />
            <Suspense fallback={<div className="p-8 text-muted-foreground animate-pulse">Memuat detail aplikasi...</div>}>
                {/* Oper params ke dalam komponen Suspense */}
                <ApplicationDetailContent params={params} />
            </Suspense>
        </>
    );
}