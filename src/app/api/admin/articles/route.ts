import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sanitizeString, sanitizeSlug, sanitizeHtml } from "@/lib/sanitize";

// GET /api/admin/articles — list articles with filters
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const skip = (page - 1) * limit;

  try {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({ articles, total, page, limit });
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت مقالات" },
      { status: 500 }
    );
  }
}

// POST /api/admin/articles — create new article
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 30, 60_000);
  if (!rl.success) return rateLimitResponse();

  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const title = sanitizeString(body.title, 300);
    const slug = sanitizeSlug(body.slug);
    const excerpt = body.excerpt ? sanitizeString(body.excerpt, 1000) : body.excerpt;
    const content = body.content ? sanitizeHtml(body.content) : body.content;
    const {
      category,
      tags,
      coverImage,
      isAiGenerated,
      seoTitle,
      seoDescription,
      seoKeywords,
      status,
      publishedAt,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "فیلدهای عنوان، اسلاگ و محتوا الزامی هستند" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "این اسلاگ قبلا استفاده شده است" },
        { status: 409 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        category: category || null,
        tags: tags || [],
        coverImage: coverImage || null,
        isAiGenerated: isAiGenerated || false,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || [],
        status: status || "draft",
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "خطا در ایجاد مقاله" },
      { status: 500 }
    );
  }
}
