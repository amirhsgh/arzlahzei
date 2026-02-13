import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: "احراز هویت الزامی است" },
        { status: 401 }
      ),
      session: null,
    };
  }

  const role = (session.user as unknown as { role: string }).role;
  if (role !== "admin" && role !== "editor") {
    return {
      error: NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}
