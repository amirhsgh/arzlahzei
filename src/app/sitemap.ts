import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://nerkhe.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "hourly", priority: 1.0 },
    { url: `${BASE_URL}/dollar`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/gold`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/coin`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/currency`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/crypto`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/ai`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/ai/daily-analysis`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/ai/trading`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/ai/forex`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/ai/news`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/learn/forex`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/learn/crypto`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/learn/ai-trading`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/learn/gold-investment`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/tools/currency-converter`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/gold-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/coin-bubble`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/profit-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic price pages from DB
  let pricePages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const [prices, articles] = await Promise.all([
      prisma.price.findMany({ select: { slug: true, category: true, updatedAt: true } }),
      prisma.article.findMany({
        where: { status: "published" },
        select: { slug: true, publishedAt: true, createdAt: true },
      }),
    ]);

    pricePages = prices.map((p) => {
      const prefix = p.category === "crypto" ? "crypto" : p.category === "currency" ? "currency" : null;
      const url = prefix ? `${BASE_URL}/${prefix}/${p.slug}` : `${BASE_URL}/${p.slug}`;
      return {
        url,
        lastModified: p.updatedAt,
        changeFrequency: "hourly" as const,
        priority: 0.9,
      };
    });

    blogPages = articles.map((a) => ({
      url: `${BASE_URL}/blog/${a.slug}`,
      lastModified: a.publishedAt || a.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not available during build — return static pages only
  }

  return [...staticPages, ...pricePages, ...blogPages];
}
