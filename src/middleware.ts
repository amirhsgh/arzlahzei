import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!session?.user) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = (session.user as unknown as { role: string }).role;
    if (role !== "admin" && role !== "editor") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect API admin routes
  if (pathname.startsWith("/api/admin")) {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as unknown as { role: string }).role;
    if (role !== "admin" && role !== "editor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
});

export const config = {
  matcher: ["/admin/((?!login).*)", "/api/admin/:path*"],
};
