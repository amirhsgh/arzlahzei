export const SITE_CONFIG = {
  name: "ارزلحظه‌ای",
  nameEn: "arzlahzei",
  url: "https://arzlahzei.ir",
  description:
    "قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال - نمودار و تحلیل بازار",
};

export const CATEGORIES = {
  currency: { name: "ارز", nameEn: "currency", icon: "💵" },
  gold: { name: "طلا", nameEn: "gold", icon: "🥇" },
  coin: { name: "سکه", nameEn: "coin", icon: "🪙" },
  crypto: { name: "ارز دیجیتال", nameEn: "crypto", icon: "₿" },
} as const;

export const NAV_ITEMS = [
  { label: "خانه", href: "/" },
  {
    label: "قیمت‌ها",
    href: "/currency",
    children: [
      { label: "دلار", href: "/dollar" },
      { label: "طلا", href: "/gold" },
      { label: "سکه", href: "/coin" },
      { label: "ارزها", href: "/currency" },
      { label: "ارز دیجیتال", href: "/crypto" },
    ],
  },
  {
    label: "ابزارها",
    href: "/tools",
    children: [
      { label: "تبدیل ارز", href: "/tools/currency-converter" },
      { label: "محاسبه‌گر طلا", href: "/tools/gold-calculator" },
      { label: "حباب سکه", href: "/tools/coin-bubble" },
      { label: "محاسبه سود", href: "/tools/profit-calculator" },
    ],
  },
  {
    label: "هوش مصنوعی",
    href: "/ai",
    children: [
      { label: "تحلیل روزانه", href: "/ai/daily-analysis" },
      { label: "سیگنال معاملاتی", href: "/ai/trading" },
      { label: "تحلیل فارکس", href: "/ai/forex" },
      { label: "اخبار", href: "/ai/news" },
    ],
  },
  { label: "آموزش", href: "/learn" },
  { label: "بلاگ", href: "/blog" },
] as const;

export const COLORS = {
  primary: "#3B82F6",
  gold: "#F59E0B",
  bgDark: "#0A0A0B",
  positive: "#22C55E",
  negative: "#EF4444",
} as const;

export const PRICE_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
