import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { requireAdmin } from "@/lib/auth-utils";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sanitizeString, sanitizeHtml } from "@/lib/sanitize";

// GET /api/admin/ads — list all ads
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { searchParams } = request.nextUrl;
  const isActive = searchParams.get("active");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const skip = (page - 1) * limit;

  try {
    const where: Record<string, unknown> = {};
    if (isActive !== null) where.isActive = isActive === "true";

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.ad.count({ where }),
    ]);

    return NextResponse.json({ ads, total, page, limit });
  } catch {
    return NextResponse.json({ error: "خطا در دریافت تبلیغات" }, { status: 500 });
  }
}

// POST /api/admin/ads — create new ad
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 30, 60_000);
  if (!rl.success) return rateLimitResponse();

  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const title = sanitizeString(body.title, 300);
    const htmlCode = body.htmlCode ? sanitizeHtml(body.htmlCode) : body.htmlCode;
    const linkUrl = body.linkUrl ? sanitizeString(body.linkUrl, 2000) : body.linkUrl;
    const {
      type,
      position,
      imageUrl,
      isActive,
      startDate,
      endDate,
      priority,
      deviceTarget,
      pageTarget,
    } = body;

    if (!title || !type || !position) {
      return NextResponse.json(
        { error: "فیلدهای عنوان، نوع و موقعیت الزامی هستند" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        type,
        position,
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        htmlCode: htmlCode || null,
        isActive: isActive ?? true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        priority: priority || 0,
        deviceTarget: deviceTarget || "all",
        pageTarget: pageTarget || [],
      },
    });

    // Invalidate ad cache
    const keys = await redis.keys("ad:*").catch(() => []);
    if (keys.length) await redis.del(...keys).catch(() => {});

    return NextResponse.json(ad, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطا در ایجاد تبلیغ" }, { status: 500 });
  }
}
