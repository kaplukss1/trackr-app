import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Bungkus Sidebar dengan Suspense */}
      <Suspense fallback={<div className="w-64 border-r border-border bg-card min-h-screen" />}>
        <Sidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}