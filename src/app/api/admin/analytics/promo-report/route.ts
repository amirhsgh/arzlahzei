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

    const ads = await prisma.ad.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        position: true,
        isActive: true,
        impressionCount: true,
        clickCount: true,
        _count: {
          select: {
            impressions: {
              where: { timestamp: { gte: from } },
            },
          },
        },
      },
      orderBy: { impressionCount: "desc" },
    });

    const report = ads.map((ad) => ({
      id: ad.id,
      title: ad.title,
      type: ad.type,
      position: ad.position,
      isActive: ad.isActive,
      totalImpressions: ad.impressionCount,
      totalClicks: ad.clickCount,
      periodImpressions: ad._count.impressions,
      ctr:
        ad.impressionCount > 0
          ? ((ad.clickCount / ad.impressionCount) * 100).toFixed(2)
          : "0",
    }));

    return NextResponse.json(report);
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت گزارش تبلیغات" },
      { status: 500 }
    );
  }
}
