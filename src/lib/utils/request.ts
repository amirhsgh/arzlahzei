import { headers } from "next/headers";

export async function getClientIP(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function getUserAgent(): Promise<string> {
  const h = await headers();
  return h.get("user-agent") || "";
}

export function parseUserAgent(ua: string) {
  let device = "desktop";
  if (/mobile|android|iphone|ipad/i.test(ua)) device = "mobile";
  else if (/tablet/i.test(ua)) device = "tablet";

  let browser = "other";
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edge/i.test(ua)) browser = "Edge";

  return { device, browser };
}

const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /baiduspider/i,
  /duckduckbot/i,
  /slurp/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /telegrambot/i,
  /applebot/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bot\b/i,
  /crawler/i,
  /spider/i,
];

export function isBot(ua: string): boolean {
  return BOT_PATTERNS.some((pattern) => pattern.test(ua));
}
