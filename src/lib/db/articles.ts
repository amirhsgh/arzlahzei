import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const CACHE_TTL = 120; // 2 minutes

// JSON.parse loses Date objects — this reviver restores ISO strings back to Date
function reviveDates(_key: string, value: unknown): unknown {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
}

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  try {
    const hit = await redis.get(key);
    if (hit) return JSON.parse(hit, reviveDates);
  } catch {}
  const data = await fn();
  try {
    await redis.setex(key, CACHE_TTL, JSON.stringify(data));
  } catch {}
  return data;
}

export async function getLatestArticles(limit = 6) {
  return cached(`db:articles:latest:${limit}`, async () => {
    return prisma.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  });
}

export async function getArticleBySlug(slug: string) {
  return cached(`db:article:${slug}`, async () => {
    return prisma.article.findUnique({ where: { slug } });
  });
}

export async function getArticlesByCategory(category: string, limit = 10) {
  return cached(`db:articles:cat:${category}:${limit}`, async () => {
    return prisma.article.findMany({
      where: { status: "published", category },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  });
}

export async function getAllPublishedArticles() {
  return cached("db:articles:all", async () => {
    return prisma.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
    });
  });
}
