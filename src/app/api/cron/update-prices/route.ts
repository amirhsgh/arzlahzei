import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { fetchAllNavasanPrices } from "@/lib/api/prices";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const CRON_SECRET = process.env.CRON_SECRET || "";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 10, 60_000);
  if (!rl.success) return rateLimitResponse();

  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Single API call for ALL prices (currency + gold + coin + crypto)
    const allPrices = await fetchAllNavasanPrices();

    if (allPrices.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No prices fetched from Navasan" },
        { status: 502 }
      );
    }

    let updated = 0;
    let created = 0;
    let historyAdded = 0;

    // Determine if we should add a history entry (max 1 per 6 hours per price)
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    for (const priceData of allPrices) {
      const existing = await prisma.price.findUnique({
        where: { slug: priceData.slug },
      });

      if (existing) {
        await prisma.price.update({
          where: { slug: priceData.slug },
          data: {
            previousPrice: existing.currentPrice,
            currentPrice: priceData.currentPrice,
            changeAmount: priceData.changeAmount,
            changePercent: priceData.changePercent,
            high24h: priceData.high24h,
            low24h: priceData.low24h,
          },
        });

        // Only add history if no entry exists in the last 6 hours
        const recentHistory = await prisma.priceHistory.findFirst({
          where: {
            priceId: existing.id,
            date: { gte: sixHoursAgo },
          },
        });

        if (!recentHistory) {
          await prisma.priceHistory.create({
            data: {
              priceId: existing.id,
              price: priceData.currentPrice,
              date: new Date(),
              open: existing.currentPrice,
              high: priceData.high24h,
              low: priceData.low24h,
              close: priceData.currentPrice,
            },
          });
          historyAdded++;
        }

        updated++;
      } else {
        const newPrice = await prisma.price.create({
          data: {
            slug: priceData.slug,
            name: priceData.name,
            nameEn: priceData.nameEn,
            category: priceData.category,
            currentPrice: priceData.currentPrice,
            previousPrice: 0,
            changeAmount: priceData.changeAmount,
            changePercent: priceData.changePercent,
            high24h: priceData.high24h,
            low24h: priceData.low24h,
          },
        });

        await prisma.priceHistory.create({
          data: {
            priceId: newPrice.id,
            price: priceData.currentPrice,
            date: new Date(),
            open: priceData.currentPrice,
            high: priceData.high24h,
            low: priceData.low24h,
            close: priceData.currentPrice,
          },
        });

        created++;
        historyAdded++;
      }

      // Update Redis cache
      await redis
        .setex(`price:${priceData.slug}`, 21600, JSON.stringify(priceData))
        .catch(() => {});
    }

    // Invalidate list caches
    const cacheKeys = ["prices:all", "prices:currency", "prices:gold", "prices:coin", "prices:crypto"];
    for (const key of cacheKeys) {
      await redis.del(key).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      updated,
      created,
      historyAdded,
      total: allPrices.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Price update error:", error);
    return NextResponse.json(
      { error: "خطا در آپدیت قیمت‌ها" },
      { status: 500 }
    );
  }
}
