import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// GET /api/admin/settings — get all SEO meta / site settings
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const settings = await prisma.seoMeta.findMany();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت تنظیمات" },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings — upsert settings
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 30, 60_000);
  if (!rl.success) return rateLimitResponse();

  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { page, title, description, keywords, canonicalUrl, ogImage, schema } =
      body;

    if (!page) {
      return NextResponse.json(
        { error: "پارامتر page الزامی است" },
        { status: 400 }
      );
    }

    const setting = await prisma.seoMeta.upsert({
      where: { page },
      create: {
        page,
        title: title || null,
        description: description || null,
        keywords: keywords || [],
        canonicalUrl: canonicalUrl || null,
        ogImage: ogImage || null,
        schema: schema || null,
      },
      update: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(keywords !== undefined && { keywords }),
        ...(canonicalUrl !== undefined && { canonicalUrl }),
        ...(ogImage !== undefined && { ogImage }),
        ...(schema !== undefined && { schema }),
      },
    });

    return NextResponse.json(setting);
  } catch {
    return NextResponse.json(
      { error: "خطا در ذخیره تنظیمات" },
      { status: 500 }
    );
  }
}
