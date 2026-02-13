import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CRYPTO_NAMES } from "@/lib/api/crypto";

const CRON_SECRET = process.env.CRON_SECRET || "";
const COINGECKO_BASE =
  process.env.COINGECKO_API_URL || "https://api.coingecko.com/api/v3";

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  total_volume: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * One-time seed endpoint for crypto prices.
 * Fetches top 500 cryptos from CoinGecko (2 pages of 250) and upserts
 * them into the Price table with category "crypto".
 *
 * POST /api/cron/seed-crypto
 * Authorization: Bearer <CRON_SECRET>
 */
export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allCoins: CoinGeckoMarket[] = [];
    const totalPages = 2;
    const perPage = 250;

    for (let page = 1; page <= totalPages; page++) {
      const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;

      console.log(`Seed: Fetching page ${page}/${totalPages} (${perPage} per page)...`);

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        console.error(
          `Seed: CoinGecko page ${page} failed: ${res.status} ${res.statusText}`
        );

        // If rate limited, wait longer and retry once
        if (res.status === 429) {
          console.log(`Seed: Rate limited on page ${page}, waiting 15s and retrying...`);
          await delay(15000);
          const retryRes = await fetch(url, { cache: "no-store" });
          if (retryRes.ok) {
            const retryData: CoinGeckoMarket[] = await retryRes.json();
            allCoins.push(...retryData);
            console.log(`Seed: Retry succeeded, got ${retryData.length} coins`);
          } else {
            console.error(`Seed: Retry also failed for page ${page}`);
          }
        }

        // Wait before next page
        if (page < totalPages) await delay(2000);
        continue;
      }

      const data: CoinGeckoMarket[] = await res.json();
      allCoins.push(...data);

      console.log(
        `Seed: Page ${page} fetched: ${data.length} coins (total: ${allCoins.length})`
      );

      // Rate limit: wait 2 seconds between pages
      if (page < totalPages) {
        await delay(2000);
      }
    }

    if (allCoins.length === 0) {
      return NextResponse.json(
        { error: "No coins fetched from CoinGecko" },
        { status: 502 }
      );
    }

    let upserted = 0;
    let errors = 0;

    for (const coin of allCoins) {
      try {
        await prisma.price.upsert({
          where: { slug: coin.id },
          update: {
            name: CRYPTO_NAMES[coin.id] || coin.name,
            nameEn: coin.name,
            currentPrice: coin.current_price || 0,
            changeAmount: coin.price_change_24h || 0,
            changePercent: parseFloat(
              (coin.price_change_percentage_24h || 0).toFixed(2)
            ),
            high24h: coin.high_24h || 0,
            low24h: coin.low_24h || 0,
          },
          create: {
            slug: coin.id,
            name: CRYPTO_NAMES[coin.id] || coin.name,
            nameEn: coin.name,
            category: "crypto",
            currentPrice: coin.current_price || 0,
            previousPrice: 0,
            changeAmount: coin.price_change_24h || 0,
            changePercent: parseFloat(
              (coin.price_change_percentage_24h || 0).toFixed(2)
            ),
            high24h: coin.high_24h || 0,
            low24h: coin.low_24h || 0,
          },
        });
        upserted++;
      } catch (error) {
        console.error(`Seed: Error upserting ${coin.id}:`, error);
        errors++;
      }
    }

    console.log(
      `Seed complete: ${upserted} upserted, ${errors} errors, ${allCoins.length} total fetched`
    );

    return NextResponse.json({
      ok: true,
      fetched: allCoins.length,
      upserted,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Seed crypto error:", error);
    return NextResponse.json(
      { error: "خطا در seed کریپتو" },
      { status: 500 }
    );
  }
}
