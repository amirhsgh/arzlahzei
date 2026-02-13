import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sanitizeString, sanitizeSlug } from "@/lib/sanitize";

// GET /api/admin/prices — list prices with optional category filter
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50)));

    const where: Record<string, unknown> = {};
    if (category && category !== "all") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const [prices, total] = await Promise.all([
      prisma.price.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.price.count({ where }),
    ]);

    return NextResponse.json({ prices, total, page, limit });
  } catch (e) {
    console.error("Admin prices GET error:", e);
    return NextResponse.json({ error: "خطا در دریافت قیمت‌ها" }, { status: 500 });
  }
}

// POST /api/admin/prices — create a new price
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 30, 60_000);
  if (!rl.success) return rateLimitResponse();

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const name = sanitizeString(body.name);
    const nameEn = sanitizeString(body.nameEn);
    const slug = sanitizeSlug(body.slug);
    const { category, currentPrice } = body;

    if (!name || !nameEn || !slug || !category) {
      return NextResponse.json({ error: "فیلدهای الزامی: name, nameEn, slug, category" }, { status: 400 });
    }

    const existing = await prisma.price.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "این اسلاگ قبلا استفاده شده" }, { status: 409 });
    }

    const price = await prisma.price.create({
      data: {
        name,
        nameEn,
        slug,
        category,
        currentPrice: Number(currentPrice) || 0,
      },
    });

    return NextResponse.json(price, { status: 201 });
  } catch (e) {
    console.error("Admin prices POST error:", e);
    return NextResponse.json({ error: "خطا در ایجاد قیمت" }, { status: 500 });
  }
}
