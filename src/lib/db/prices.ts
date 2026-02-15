import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import type { Category } from "@/types";

const CACHE_TTL = 60; // 1 minute

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  try {
    const hit = await redis.get(key);
    if (hit) return JSON.parse(hit);
  } catch {}
  const data = await fn();
  try {
    await redis.setex(key, CACHE_TTL, JSON.stringify(data));
  } catch {}
  return data;
}

export async function getFeaturedPrices() {
  return cached("db:featured", async () => {
    const slugs = ["dollar", "gold-18k", "emami", "bitcoin"];
    const prices = await prisma.price.findMany({
      where: { slug: { in: slugs } },
    });
    // Return in the order of slugs
    return slugs
      .map((s) => prices.find((p) => p.slug === s))
      .filter((p): p is NonNullable<typeof p> => p != null);
  });
}

export async function getPricesByCategory(category: Category) {
  return cached(`db:prices:${category}`, async () => {
    return prisma.price.findMany({
      where: { category },
      orderBy: { currentPrice: "desc" },
    });
  });
}

export async function getPriceBySlug(slug: string) {
  return cached(`db:price:${slug}`, async () => {
    return prisma.price.findUnique({ where: { slug } });
  });
}

export async function getPriceHistory(slug: string, days = 30) {
  return cached(`db:history:${slug}:${days}`, async () => {
    const price = await prisma.price.findUnique({ where: { slug } });
    if (!price) return [];
    const since = new Date();
    since.setDate(since.getDate() - days);
    return prisma.priceHistory.findMany({
      where: {
        priceId: price.id,
        date: { gte: since },
      },
      orderBy: { date: "asc" },
    });
  });
}

export async function getSparklineData(slug: string): Promise<number[]> {
  return cached(`db:sparkline:${slug}`, async () => {
    const price = await prisma.price.findUnique({ where: { slug } });
    if (!price) return [];
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const history = await prisma.priceHistory.findMany({
      where: {
        priceId: price.id,
        date: { gte: since },
      },
      orderBy: { date: "asc" },
      select: { close: true },
    });
    return history.map((h) => h.close || 0);
  });
}

export async function searchPrices(query: string) {
  if (!query || query.length < 2) return [];
  return cached(`db:search:${query}`, async () => {
    return prisma.price.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { nameEn: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      orderBy: { currentPrice: "desc" },
    });
  });
}

export async function getAllPrices() {
  return cached("db:prices:all", async () => {
    return prisma.price.findMany({
      orderBy: [{ category: "asc" }, { currentPrice: "desc" }],
    });
  });
}

export async function getCryptoPricesPaginated(page = 1, perPage = 50) {
  const skip = (page - 1) * perPage;
  return cached(`db:crypto:page:${page}:${perPage}`, async () => {
    const [prices, total] = await Promise.all([
      prisma.price.findMany({
        where: { category: "crypto" },
        orderBy: { currentPrice: "desc" },
        skip,
        take: perPage,
      }),
      prisma.price.count({ where: { category: "crypto" } }),
    ]);
    return { prices, total, totalPages: Math.ceil(total / perPage) };
  });
}
