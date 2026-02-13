import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period") || "30d";

  try {
    const price = await prisma.price.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!price) {
      return NextResponse.json(
        { error: "قیمت مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // Calculate date range
    const now = new Date();
    let from: Date;
    switch (period) {
      case "1d":
        from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const history = await prisma.priceHistory.findMany({
      where: {
        priceId: price.id,
        date: { gte: from },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(history);
  } catch {
    return NextResponse.json(
      { error: "خطا در دریافت تاریخچه" },
      { status: 500 }
    );
  }
}
