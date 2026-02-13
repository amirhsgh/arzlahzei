import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const CACHE_TTL = 300; // 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const position = searchParams.get("position");
  const page = searchParams.get("page");
  const device = searchParams.get("device") || "all";

  if (!position) {
    return NextResponse.json(
      { error: "پارامتر position الزامی است" },
      { status: 400 }
    );
  }

  try {
    const cacheKey = `ad:${position}:${page}:${device}`;
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Return null (empty) if no ad cached
      if (!parsed) return NextResponse.json(null);
      return NextResponse.json(parsed);
    }

    const now = new Date();

    // Find matching active ads
    const ads = await prisma.ad.findMany({
      where: {
        isActive: true,
        position: position as never,
        deviceTarget: { in: [device as never, "all" as never] },
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { priority: "desc" },
    });

    // Filter by pageTarget (array contains page)
    const matching = page
      ? ads.filter((ad) => ad.pageTarget.length === 0 || ad.pageTarget.includes(page))
      : ads;

    // Pick top priority ad (or weighted random among top ones)
    const ad = matching[0] || null;

    const result = ad
      ? {
          id: ad.id,
          title: ad.title,
          type: ad.type,
          position: ad.position,
          imageUrl: ad.imageUrl,
          linkUrl: ad.linkUrl,
          htmlCode: ad.htmlCode,
          isActive: ad.isActive,
          priority: ad.priority,
          deviceTarget: ad.deviceTarget,
          pageTarget: ad.pageTarget,
        }
      : null;

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result)).catch(() => {});

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(null);
  }
}
