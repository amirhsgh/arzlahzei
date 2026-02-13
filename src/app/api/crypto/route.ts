import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const CACHE_KEY = "prices:crypto";
const CACHE_TTL = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const skip = (page - 1) * limit;

  try {
    const cacheKey = `${CACHE_KEY}:${page}:${limit}`;
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    const [prices, total] = await Promise.all([
      prisma.price.findMany({
        where: { category: "crypto" },
        orderBy: { currentPrice: "desc" },
        skip,
        take: limit,
      }),
      prisma.price.count({ where: { category: "crypto" } }),
    ]);

    const result = { prices, total, page, limit };
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result)).catch(() => {});

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت ارزهای دیجیتال" },
      { status: 500 }
    );
  }
}
