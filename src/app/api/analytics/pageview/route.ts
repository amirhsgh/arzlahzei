import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIP, getUserAgent, parseUserAgent, isBot } from "@/lib/utils/request";

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIP();
    const userAgent = await getUserAgent();

    // Filter out bots
    if (isBot(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const body = await request.json();
    const { page, referrer, sessionId } = body;

    if (!page) {
      return NextResponse.json(
        { error: "پارامتر page الزامی است" },
        { status: 400 }
      );
    }

    const { device, browser } = parseUserAgent(userAgent);

    await prisma.pageView.create({
      data: {
        page,
        ip,
        userAgent,
        referrer: referrer || null,
        device,
        browser,
        sessionId: sessionId || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Don't fail silently but don't expose errors to client
    return NextResponse.json({ ok: true });
  }
}
