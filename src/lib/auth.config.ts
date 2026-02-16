import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config (no Node.js-only imports like bcrypt/prisma).
// Used by middleware. The full config with Credentials provider is in auth.ts.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [], // Credentials provider added in auth.ts (needs Node.js runtime)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
    async authorized({ auth: session, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isApiAdmin = request.nextUrl.pathname.startsWith("/api/admin");

      if (isAdmin || isApiAdmin) {
        return !!session?.user;
      }

      return true;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
