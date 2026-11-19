"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { LayoutDashboard, Kanban, Table2, Settings, Database, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/board", label: "Board", icon: Kanban },
  { href: "/applications", label: "Applications", icon: Table2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card min-h-screen flex flex-col justify-between">
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-foreground">Trackr</span>
            <span className="text-[11px] text-muted-foreground font-normal">Job Application Hub</span>
          </div>
        </div>

        {/* Nav */}
        <nav aria-label="Main Navigation">
          <ul className="space-y-1.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

      {/* User box */}
      <div className="p-4 m-4 rounded-md border border-border bg-muted/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
            AL
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-foreground truncate">Andika Prayoga Siswono</p>
            <p className="text-[11px] text-muted-foreground truncate">andikaprayoga118@gmail.com</p>
          </div>
        </div>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-card hover:text-foreground transition-colors shrink-0"
          title="Toggle Theme"
        >
          {/* Ikon Matahari (Hanya muncul saat Dark Mode) */}
          <Sun className="hidden dark:block w-4 h-4" />
          
          {/* Ikon Bulan (Hanya muncul saat Light Mode) */}
          <Moon className="block dark:hidden w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}