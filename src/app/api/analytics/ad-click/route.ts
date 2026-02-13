import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIP, getUserAgent, isBot } from "@/lib/utils/request";

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIP();
    const userAgent = await getUserAgent();

    if (isBot(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const { adId, page } = await request.json();

    if (!adId || !page) {
      return NextResponse.json(
        { error: "پارامترهای adId و page الزامی هستند" },
        { status: 400 }
      );
    }

    // Record click
    await prisma.$transaction([
      prisma.adImpression.create({
        data: {
          adId,
          ip,
          userAgent: userAgent || null,
          page,
          isClick: true,
        },
      }),
      prisma.ad.update({
        where: { id: adId },
        data: { clickCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
