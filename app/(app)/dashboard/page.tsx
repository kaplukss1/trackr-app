import { Header } from "@/components/layout/header";

export default function DashboardPage() {
  return (
    <>
      <Header 
        title="Dashboard" 
        badge="Active Hunt" 
        searchPlaceholder="Search roles or companies..." 
      />
      <main className="flex-1 p-8">
        <div className="p-6 rounded-md border border-border bg-card">
          <p className="text-muted-foreground">🚧 Dashboard content coming soon...</p>
        </div>
      </main>
    </>
  );
}