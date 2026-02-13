import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      todayViews,
      todayUnique,
      weekViews,
      weekUnique,
      monthViews,
      monthUnique,
      totalAds,
      activeAds,
      totalImpressions,
      totalClicks,
    ] = await Promise.all([
      prisma.pageView.count({ where: { timestamp: { gte: todayStart } } }),
      prisma.pageView.groupBy({
        by: ["ip"],
        where: { timestamp: { gte: todayStart } },
      }).then((r) => r.length),
      prisma.pageView.count({ where: { timestamp: { gte: weekStart } } }),
      prisma.pageView.groupBy({
        by: ["ip"],
        where: { timestamp: { gte: weekStart } },
      }).then((r) => r.length),
      prisma.pageView.count({ where: { timestamp: { gte: monthStart } } }),
      prisma.pageView.groupBy({
        by: ["ip"],
        where: { timestamp: { gte: monthStart } },
      }).then((r) => r.length),
      prisma.ad.count(),
      prisma.ad.count({ where: { isActive: true } }),
      prisma.ad.aggregate({ _sum: { impressionCount: true } }),
      prisma.ad.aggregate({ _sum: { clickCount: true } }),
    ]);

    return NextResponse.json({
      today: { views: todayViews, unique: todayUnique },
      week: { views: weekViews, unique: weekUnique },
      month: { views: monthViews, unique: monthUnique },
      ads: {
        total: totalAds,
        active: activeAds,
        impressions: totalImpressions._sum.impressionCount || 0,
        clicks: totalClicks._sum.clickCount || 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت آمار" },
      { status: 500 }
    );
  }
}
