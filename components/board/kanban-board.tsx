"use client";

import { useState } from "react";
import { Calendar, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { updateApplicationStatus } from "@/app/(app)/board/actions";

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

// ─── 1. KOMPONEN KARTU (Draggable) ───
function Card({ app }: { app: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    data: { app },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "p-4 rounded-md bg-card border border-border transition-all group flex flex-col gap-3 touch-none",
        isDragging ? "opacity-50 border-primary shadow-lg cursor-grabbing z-50" : "hover:border-primary/40 cursor-grab"
      )}
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
  );
}

// ─── 2. KOMPONEN KOLOM (Droppable) ───
function Column({ col, apps }: { col: any, apps: any[] }) {
  const { isOver, setNodeRef } = useDroppable({
    id: col.id,
  });

  return (
    <div className="w-[280px] shrink-0 flex flex-col rounded-md bg-muted/30 border border-border max-h-full">
      <div className="p-3.5 flex items-center justify-between border-b border-border bg-card rounded-t-md">
        <div className="flex items-center gap-2">
          <span className={cn("w-2.5 h-2.5 rounded-full", col.color)}></span>
          <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
        </div>
        <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border inline-flex items-center justify-center tabular-nums">
          {apps.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "p-3 space-y-3 overflow-y-auto flex-1 transition-colors min-h-[150px]",
          isOver && "bg-primary/5 ring-2 ring-primary/20 ring-inset"
        )}
      >
        {apps.map((app) => (
          <Card key={app.id} app={app} />
        ))}
        {apps.length === 0 && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-md text-muted-foreground text-xs text-center px-4">
            Geser kartu ke sini.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 3. KOMPONEN UTAMA BOARD ───
export function KanbanBoard({ initialData }: { initialData: any[] }) {
  const [apps, setApps] = useState(initialData);
  const [activeApp, setActiveApp] = useState<any | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const app = apps.find((a) => a.id === active.id);
    if (app) setActiveApp(app);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveApp(null);

    if (!over) return;

    const appId = active.id as string;
    const newStatus = over.id as string;
    const currentApp = apps.find((a) => a.id === appId);

    if (!currentApp || currentApp.status === newStatus) return;

    // 1. Update state secara instan (Optimistic UI)
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );

    // 2. Kirim perubahan ke Supabase di background
    const result = await updateApplicationStatus(appId, newStatus);

    if (result.error) {
      toast.error("Gagal memindahkan kartu: " + result.error);
      // Rollback jika gagal
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: currentApp.status } : a))
      );
    } else {
      toast.success(`Berhasil dipindah ke ${newStatus}`);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex items-start gap-5 min-w-[1240px] h-[calc(100vh-140px)] pb-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            col={col}
            apps={apps.filter((app) => app.status === col.id)}
          />
        ))}
      </div>

      {/* Overlay: Kartu yang mengikuti kursor saat di-drag */}
      <DragOverlay>
        {activeApp ? (
          <div className="p-4 rounded-md bg-card border-2 border-primary shadow-xl cursor-grabbing flex flex-col gap-3 rotate-2 opacity-90 w-[280px]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-primary">
                {activeApp.company_name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">{activeApp.position}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}