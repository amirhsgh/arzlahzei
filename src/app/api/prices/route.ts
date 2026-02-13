import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const CACHE_KEY = "prices:all";
const CACHE_TTL = 60; // 1 minute

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    // Skip cache when searching
    if (!search) {
      // Try Redis cache first
      const cacheKey = category ? `prices:${category}` : CACHE_KEY;
      const cached = await redis.get(cacheKey).catch(() => null);
      if (cached) {
        return NextResponse.json(JSON.parse(cached));
      }
    }

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch from database
    const prices = await prisma.price.findMany({
      where,
      orderBy: [{ category: "asc" }, { currentPrice: "desc" }],
    });

    // Cache the result (only for non-search queries)
    if (!search) {
      const cacheKey = category ? `prices:${category}` : CACHE_KEY;
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(prices)).catch(() => {});
    }

    return NextResponse.json(prices);
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت قیمت‌ها" },
      { status: 500 }
    );
  }
}
