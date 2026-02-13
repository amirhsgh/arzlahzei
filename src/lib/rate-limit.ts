import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 120_000);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}, 300_000);

export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const key = ip;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    return {
      success: false,
      remaining: 0,
      reset: oldest + windowMs,
    };
  }

  entry.timestamps.push(now);
  return {
    success: true,
    remaining: limit - entry.timestamps.length,
    reset: now + windowMs,
  };
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: "درخواست‌های بیش از حد مجاز. لطفا کمی صبر کنید." },
    { status: 429 }
  );
}
