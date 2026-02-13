import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 5, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "تلاش‌های ورود بیش از حد مجاز. لطفا یک دقیقه صبر کنید." },
      { status: 429 }
    );
  }
  return handlers.POST(request);
}
