import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart);
    monthStart.setDate(monthStart.getDate() - 30);

    // Run all queries in parallel
    const [
      todayViews,
      yesterdayViews,
      todayUnique,
      todayImpressions,
      todayClicks,
      publishedArticles,
      totalArticles,
      activeAds,
      totalAds,
      lastPrice,
      chartData,
      topPagesRaw,
      recentViews,
    ] = await Promise.all([
      // Today views
      prisma.pageView.count({ where: { timestamp: { gte: todayStart } } }),
      // Yesterday views
      prisma.pageView.count({ where: { timestamp: { gte: yesterdayStart, lt: todayStart } } }),
      // Today unique IPs
      prisma.pageView.groupBy({ by: ["ip"], where: { timestamp: { gte: todayStart } } }).then((r) => r.length),
      // Today ad impressions
      prisma.adImpression.count({ where: { timestamp: { gte: todayStart }, isClick: false } }),
      // Today ad clicks
      prisma.adImpression.count({ where: { timestamp: { gte: todayStart }, isClick: true } }),
      // Published articles
      prisma.article.count({ where: { status: "published" } }),
      // Total articles
      prisma.article.count(),
      // Active ads
      prisma.ad.count({ where: { isActive: true } }),
      // Total ads
      prisma.ad.count(),
      // Last price update
      prisma.price.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      // 30-day chart from DailyStats
      prisma.dailyStats.findMany({
        where: { date: { gte: monthStart } },
        orderBy: { date: "asc" },
        select: { date: true, totalViews: true, uniqueVisitors: true },
      }),
      // Top pages today
      prisma.pageView.groupBy({
        by: ["page"],
        where: { timestamp: { gte: todayStart } },
        _count: { page: true },
        orderBy: { _count: { page: "desc" } },
        take: 10,
      }),
      // Recent 10 page views
      prisma.pageView.findMany({
        orderBy: { timestamp: "desc" },
        take: 10,
        select: { ip: true, page: true, timestamp: true, device: true, browser: true },
      }),
    ]);

    const changePercent = yesterdayViews > 0
      ? (((todayViews - yesterdayViews) / yesterdayViews) * 100).toFixed(1)
      : "0";

    return NextResponse.json({
      stats: {
        todayViews,
        yesterdayViews,
        changePercent: Number(changePercent),
        todayUnique,
        todayImpressions,
        todayClicks,
        publishedArticles,
        totalArticles,
        activeAds,
        totalAds,
        lastPriceUpdate: lastPrice?.updatedAt || null,
      },
      chart: chartData.map((d) => ({
        date: d.date.toISOString(),
        views: d.totalViews,
        unique: d.uniqueVisitors,
      })),
      topPages: topPagesRaw.map((p) => ({
        page: p.page,
        views: p._count.page,
      })),
      recentViews,
    });
  } catch (e) {
    console.error("Dashboard API error:", e);
    return NextResponse.json({ error: "خطا در دریافت اطلاعات داشبورد" }, { status: 500 });
  }
}
