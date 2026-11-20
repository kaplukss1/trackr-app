"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LayoutDashboard, Kanban, Table2, Settings, Database, Sun, Moon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/board", label: "Board", icon: Kanban },
  { href: "/applications", label: "Applications", icon: Table2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

// 1. Komponen Konten Sidebar (Bisa dipakai di Desktop & Mobile)
export function SidebarContent({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const supabase = createClient();

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "user@email.com";
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil logout");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-foreground">Trackr</span>
            <span className="text-[11px] text-muted-foreground font-normal">Job Application Hub</span>
          </div>
        </div>

        <nav aria-label="Main Navigation">
          <ul className="space-y-1.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors",
                      active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", active && "fill-current")} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4 m-4 rounded-md border border-border bg-muted/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-foreground truncate">{fullName}</p>
            <p className="text-[11px] text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="p-1.5 rounded-md text-muted-foreground hover:bg-card hover:text-foreground transition-colors">
            <Sun className="hidden dark:block w-4 h-4" />
            <Moon className="block dark:hidden w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Komponen Sidebar Desktop
export function Sidebar({ user }: { user: User | null }) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-card min-h-screen flex-col">
      <SidebarContent user={user} />
    </aside>
  );
}