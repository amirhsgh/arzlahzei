import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CRON_SECRET = process.env.CRON_SECRET || "";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Calculate stats for yesterday
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get all page views for yesterday
    const pageViews = await prisma.pageView.findMany({
      where: {
        timestamp: {
          gte: yesterday,
          lt: todayStart,
        },
      },
      select: {
        ip: true,
        page: true,
        referrer: true,
      },
    });

    const totalViews = pageViews.length;
    const uniqueIPs = new Set(pageViews.map((pv) => pv.ip));
    const uniqueVisitors = uniqueIPs.size;

    // Calculate top pages
    const pageCounts = new Map<string, number>();
    for (const pv of pageViews) {
      pageCounts.set(pv.page, (pageCounts.get(pv.page) || 0) + 1);
    }
    const topPages = Array.from(pageCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([page, views]) => ({ page, views }));

    // Calculate top referrers
    const refCounts = new Map<string, number>();
    for (const pv of pageViews) {
      if (pv.referrer) {
        try {
          const host = new URL(pv.referrer).hostname;
          refCounts.set(host, (refCounts.get(host) || 0) + 1);
        } catch {
          refCounts.set(pv.referrer, (refCounts.get(pv.referrer) || 0) + 1);
        }
      }
    }
    const topReferrers = Array.from(refCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, visits]) => ({ source, visits }));

    // Upsert daily stats
    await prisma.dailyStats.upsert({
      where: { date: yesterday },
      create: {
        date: yesterday,
        totalViews,
        uniqueVisitors,
        topPages,
        topReferrers,
      },
      update: {
        totalViews,
        uniqueVisitors,
        topPages,
        topReferrers,
      },
    });

    return NextResponse.json({
      ok: true,
      date: yesterday.toISOString().split("T")[0],
      totalViews,
      uniqueVisitors,
      topPages: topPages.length,
      topReferrers: topReferrers.length,
    });
  } catch (error) {
    console.error("Daily stats error:", error);
    return NextResponse.json(
      { error: "خطا در محاسبه آمار روزانه" },
      { status: 500 }
    );
  }
}
