"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  FileText,
  Megaphone,
  BarChart3,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const sidebarItems = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "قیمت‌ها", href: "/admin/prices", icon: DollarSign },
  { label: "مقالات", href: "/admin/articles", icon: FileText },
  { label: "تبلیغات", href: "/admin/promo", icon: Megaphone },
  { label: "آمار", href: "/admin/analytics", icon: BarChart3 },
  { label: "سئو", href: "/admin/seo", icon: Search },
  { label: "تنظیمات", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  onLogout?: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-l border-border bg-card">
      <div className="p-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">پنل</span>
          <span className="text-lg font-bold text-gold">مدیریت</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {onLogout && (
        <div className="border-t border-border p-2">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      )}
    </aside>
  );
}
