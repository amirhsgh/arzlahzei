"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "sonner";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  // Login page renders without the admin shell
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* noindex for admin pages */}
      <meta name="robots" content="noindex, nofollow" />

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <Sidebar onLogout={handleLogout} />
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative h-full w-56">
              <Sidebar onLogout={handleLogout} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                پنل مدیریت ارزلحظه‌ای
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                مشاهده سایت
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={handleLogout}
              >
                <LogOut className="ml-1 h-4 w-4" />
                خروج
              </Button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>

      <Toaster
        position="top-center"
        richColors
        dir="rtl"
        toastOptions={{
          style: { fontFamily: "inherit" },
        }}
      />
    </>
  );
}
