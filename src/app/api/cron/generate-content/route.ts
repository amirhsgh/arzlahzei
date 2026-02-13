import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateDailyAnalysis,
  generateTradingSignal,
  generateForexAnalysis,
  generateNewsDigest,
} from "@/lib/api/openai";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const CRON_SECRET = process.env.CRON_SECRET || "";

type ContentType = "analysis" | "trading" | "forex" | "news";

const CONTENT_CONFIG: Record<
  ContentType,
  {
    category: string;
    slugPrefix: string;
    tags: string[];
    generator: (priceData: string) => Promise<{
      title: string;
      content: string;
      excerpt: string;
      seoTitle: string;
      seoDescription: string;
      seoKeywords: string[];
      slug: string;
    }>;
  }
> = {
  analysis: {
    category: "analysis",
    slugPrefix: "daily-analysis",
    tags: ["تحلیل روزانه", "بازار ارز", "طلا"],
    generator: generateDailyAnalysis,
  },
  trading: {
    category: "trading",
    slugPrefix: "trading-signal",
    tags: ["سیگنال معاملاتی", "ارز دیجیتال", "تحلیل تکنیکال"],
    generator: generateTradingSignal,
  },
  forex: {
    category: "forex",
    slugPrefix: "forex-analysis",
    tags: ["تحلیل فارکس", "جفت ارز", "DXY"],
    generator: generateForexAnalysis,
  },
  news: {
    category: "news",
    slugPrefix: "news-digest",
    tags: ["اخبار اقتصادی", "خلاصه اخبار", "بازار مالی"],
    generator: generateNewsDigest,
  },
};

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 10, 60_000);
  if (!rl.success) return rateLimitResponse();

  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const type = (searchParams.get("type") || "analysis") as ContentType;

    const config = CONTENT_CONFIG[type];
    if (!config) {
      return NextResponse.json(
        { error: `نوع محتوای نامعتبر: ${type}` },
        { status: 400 }
      );
    }

    // Get latest prices for the content
    const categories: ("currency" | "gold" | "coin" | "crypto")[] =
      type === "trading"
        ? ["crypto"]
        : type === "forex"
          ? ["currency"]
          : ["currency", "gold", "coin"];

    const prices = await prisma.price.findMany({
      where: { category: { in: categories } },
      orderBy: { category: "asc" },
    });

    if (prices.length === 0) {
      return NextResponse.json(
        { error: "داده‌ای قیمتی برای تحلیل وجود ندارد" },
        { status: 400 }
      );
    }

    // Format price data for AI
    const priceData = prices
      .map(
        (p) =>
          `${p.name}: ${p.currentPrice.toLocaleString()} ${type === "trading" ? "USD" : "تومان"} (تغییر: ${p.changePercent > 0 ? "+" : ""}${p.changePercent}%)`
      )
      .join("\n");

    const article = await config.generator(priceData);

    // Check for existing slug and make unique
    const today = new Date().toISOString().split("T")[0];
    let slug = article.slug || `${config.slugPrefix}-${today}`;
    const existingSlug = await prisma.article.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Save article
    const savedArticle = await prisma.article.create({
      data: {
        title: article.title,
        slug,
        excerpt: article.excerpt,
        content: article.content,
        category: config.category,
        tags: config.tags,
        isAiGenerated: true,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        seoKeywords: article.seoKeywords,
        status: "published",
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      type,
      articleId: savedArticle.id,
      slug: savedArticle.slug,
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "خطا در تولید محتوا" },
      { status: 500 }
    );
  }
}
