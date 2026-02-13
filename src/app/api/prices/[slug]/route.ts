import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const CACHE_TTL = 60;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const cacheKey = `price:${slug}`;
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    const price = await prisma.price.findUnique({
      where: { slug },
    });

    if (!price) {
      return NextResponse.json(
        { error: "قیمت مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(price)).catch(() => {});

    return NextResponse.json(price);
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت قیمت" },
      { status: 500 }
    );
  }
}
