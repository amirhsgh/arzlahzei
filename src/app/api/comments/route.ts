import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { priceSlug: slug, parentId: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          replies: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(ip, 5, 60_000);
  if (!success) {
    return rateLimitResponse();
  }

  let body: { priceSlug?: string; author?: string; email?: string; text?: string; parentId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { priceSlug, author, email, text, parentId } = body;

  if (!priceSlug || !author || !email || !text) {
    return NextResponse.json(
      { error: "priceSlug, author, email, and text are required" },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "ایمیل نامعتبر است" },
      { status: 400 }
    );
  }

  const sanitizedEmail = sanitizeString(email, 200).toLowerCase();

  // Check daily limit: 50 comments per email per day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const dailyCount = await prisma.comment.count({
    where: {
      email: sanitizedEmail,
      createdAt: { gte: startOfDay },
    },
  });
  if (dailyCount >= 50) {
    return NextResponse.json(
      { error: "شما به حداکثر تعداد نظرات روزانه (۵۰) رسیده‌اید." },
      { status: 429 }
    );
  }

  const sanitizedAuthor = sanitizeString(author, 100);
  const sanitizedText = sanitizeString(text, 1000);

  if (!sanitizedAuthor || !sanitizedText) {
    return NextResponse.json(
      { error: "author and text cannot be empty" },
      { status: 400 }
    );
  }

  // Validate parentId if provided
  if (parentId) {
    const parentExists = await prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentExists) {
      return NextResponse.json(
        { error: "نظر والد یافت نشد" },
        { status: 404 }
      );
    }
  }

  const comment = await prisma.comment.create({
    data: {
      priceSlug: sanitizeString(priceSlug, 200),
      author: sanitizedAuthor,
      email: sanitizedEmail,
      text: sanitizedText,
      parentId: parentId || null,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
