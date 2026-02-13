"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/lib/constants";

export function Navigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav
      className={cn(
        "flex gap-1",
        mobile ? "flex-col" : "items-center"
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        if ("children" in item && item.children) {
          return (
            <div key={item.href} className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === item.href ? null : item.href
                  )
                }
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    openDropdown === item.href && "rotate-180"
                  )}
                />
              </button>
              {openDropdown === item.href && (
                <div
                  className={cn(
                    "z-50 min-w-[160px] rounded-lg border border-border bg-card p-1 shadow-lg",
                    mobile
                      ? "mt-1"
                      : "absolute right-0 top-full mt-1"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpenDropdown(null)}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
