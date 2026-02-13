import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";

// POST /api/admin/prices/update-all — manually trigger price update
export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    // Call the cron update endpoint internally
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const cronSecret = process.env.CRON_SECRET || "";

    const res = await fetch(`${baseUrl}/api/cron/update-prices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cronSecret && { Authorization: `Bearer ${cronSecret}` }),
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.error || "خطا در بروزرسانی قیمت‌ها" },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json({ success: true, ...result });
  } catch (e) {
    console.error("Manual price update error:", e);
    return NextResponse.json({ error: "خطا در بروزرسانی قیمت‌ها" }, { status: 500 });
  }
}
