import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";


async function LayoutContent({ children }: { children: React.ReactNode }) {

  await connection();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Kita akan oper user lewat context atau modifikasi page, 
            tapi untuk simplenya kita render children saja di sini */}
        {children}
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}