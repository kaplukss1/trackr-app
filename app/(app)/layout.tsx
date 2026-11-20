import { Suspense } from "react";
import { connection } from "next/server";
import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";

// 1. Pindahkan logika pengambilan data user ke komponen khusus
async function SidebarWrapper() {
  await connection();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <Sidebar user={user} />;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* 2. Bungkus SidebarWrapper dengan Suspense */}
      <Suspense fallback={<div className="w-64 border-r border-border bg-card min-h-screen" />}>
        <SidebarWrapper />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}