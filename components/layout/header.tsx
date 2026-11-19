import { Search } from "lucide-react";

interface HeaderProps {
  title: string;
  badge?: string;
  searchPlaceholder?: string;
  actionButton?: React.ReactNode; // Tambahkan prop ini
}

export function Header({ title, badge, searchPlaceholder, actionButton }: HeaderProps) {
  return (
    <header className="h-16 px-8 border-b border-border bg-card flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">{title}</h1>
        {badge && (
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted border border-border text-muted-foreground">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {searchPlaceholder && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="w-64 pl-9 pr-3 py-1.5 rounded-md text-sm bg-background border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
        )}
        
        {/* Render actionButton di sini */}
        {actionButton}
      </div>
    </header>
  );
}