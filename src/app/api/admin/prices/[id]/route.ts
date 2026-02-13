import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// GET /api/admin/prices/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const price = await prisma.price.findUnique({ where: { id } });
    if (!price) {
      return NextResponse.json({ error: "قیمت یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(price);
  } catch (e) {
    console.error("Admin price GET error:", e);
    return NextResponse.json({ error: "خطا در دریافت قیمت" }, { status: 500 });
  }
}

// PUT /api/admin/prices/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 30, 60_000);
  if (!rl.success) return rateLimitResponse();

  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, nameEn, slug, category, currentPrice } = body;

    const price = await prisma.price.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(nameEn !== undefined && { nameEn }),
        ...(slug !== undefined && { slug }),
        ...(category !== undefined && { category }),
        ...(currentPrice !== undefined && { currentPrice: Number(currentPrice) }),
      },
    });

    return NextResponse.json(price);
  } catch (e) {
    console.error("Admin price PUT error:", e);
    return NextResponse.json({ error: "خطا در بروزرسانی قیمت" }, { status: 500 });
  }
}

// DELETE /api/admin/prices/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 30, 60_000);
  if (!rl.success) return rateLimitResponse();

  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.price.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Admin price DELETE error:", e);
    return NextResponse.json({ error: "خطا در حذف قیمت" }, { status: 500 });
  }
}
