import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Suspense } from "react";
import { KanbanBoard } from "@/components/board/kanban-board";
import { connection } from "next/server"; // Pastikan ini ada

async function BoardData() {
  await connection(); // Pastikan ini ada
  
  const supabase = await createClient();
  
  // Pastikan baris ini ada untuk mendapatkan user yang sedang login
  const { data: { user } } = await supabase.auth.getUser();

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user?.id) // <-- PASTIKAN BARIS INI ADA
    .order("applied_date", { ascending: false });

  // Tampilkan error ke layar jika ada masalah
  if (error) {
    return <div className="text-destructive p-4 border border-destructive bg-destructive/10 rounded-md">Error Board: {error.message}</div>;
  }

  return <KanbanBoard initialData={applications || []} />;
}

export default function BoardPage() {
  return (
    <>
      <Header title="Board" badge="Pipeline View" />
      <main className="flex-1 p-6 overflow-x-auto bg-background">
        <Suspense fallback={<div className="p-8 text-muted-foreground animate-pulse">Loading Board...</div>}>
          <BoardData />
        </Suspense>
      </main>
    </>
  );
}