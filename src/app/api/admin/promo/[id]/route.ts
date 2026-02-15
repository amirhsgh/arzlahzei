import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { requireAdmin } from "@/lib/auth-utils";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

async function invalidateAdCache() {
  const keys = await redis.keys("promo:*").catch(() => []);
  if (keys.length) await redis.del(...keys).catch(() => {});
}

// GET /api/admin/promo/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            impressions: true,
          },
        },
      },
    });

    if (!ad) {
      return NextResponse.json({ error: "تبلیغ یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch {
    return NextResponse.json({ error: "خطا در دریافت تبلیغ" }, { status: 500 });
  }
}

// PUT /api/admin/promo/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 30, 60_000);
  if (!rl.success) return rateLimitResponse();

  const { error: authErr } = await requireAdmin();
  if (authErr) return authErr;

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title,
      type,
      position,
      imageUrl,
      linkUrl,
      htmlCode,
      isActive,
      startDate,
      endDate,
      priority,
      deviceTarget,
      pageTarget,
    } = body;

    const ad = await prisma.ad.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(position !== undefined && { position }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(linkUrl !== undefined && { linkUrl }),
        ...(htmlCode !== undefined && { htmlCode }),
        ...(isActive !== undefined && { isActive }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(priority !== undefined && { priority }),
        ...(deviceTarget !== undefined && { deviceTarget }),
        ...(pageTarget !== undefined && { pageTarget }),
      },
    });

    await invalidateAdCache();
    return NextResponse.json(ad);
  } catch {
    return NextResponse.json({ error: "خطا در ویرایش تبلیغ" }, { status: 500 });
  }
}

// DELETE /api/admin/promo/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 30, 60_000);
  if (!rl.success) return rateLimitResponse();

  const { error: authErr2 } = await requireAdmin();
  if (authErr2) return authErr2;

  const { id } = await params;

  try {
    await prisma.ad.delete({ where: { id } });
    await invalidateAdCache();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطا در حذف تبلیغ" }, { status: 500 });
  }
}
