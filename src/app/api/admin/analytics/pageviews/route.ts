import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { searchParams } = request.nextUrl;
  const days = parseInt(searchParams.get("days") || "30");

  try {
    const from = new Date();
    from.setDate(from.getDate() - days);

    // Get daily stats from DailyStats table
    const dailyStats = await prisma.dailyStats.findMany({
      where: { date: { gte: from } },
      orderBy: { date: "asc" },
    });

    // If no daily stats yet, compute from raw PageViews
    if (dailyStats.length === 0) {
      const pageViews = await prisma.pageView.findMany({
        where: { timestamp: { gte: from } },
        select: { timestamp: true, ip: true, page: true },
      });

      // Group by date
      const byDate = new Map<string, { views: number; ips: Set<string> }>();
      for (const pv of pageViews) {
        const dateKey = pv.timestamp.toISOString().split("T")[0];
        const entry = byDate.get(dateKey) || { views: 0, ips: new Set() };
        entry.views++;
        entry.ips.add(pv.ip);
        byDate.set(dateKey, entry);
      }

      const computed = Array.from(byDate.entries())
        .map(([date, data]) => ({
          date,
          totalViews: data.views,
          uniqueVisitors: data.ips.size,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return NextResponse.json(computed);
    }

    return NextResponse.json(
      dailyStats.map((s) => ({
        date: s.date.toISOString().split("T")[0],
        totalViews: s.totalViews,
        uniqueVisitors: s.uniqueVisitors,
        topPages: s.topPages,
        topReferrers: s.topReferrers,
      }))
    );
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت آمار بازدید" },
      { status: 500 }
    );
  }
}
