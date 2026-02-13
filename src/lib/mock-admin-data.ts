// Mock data for admin panel — will be replaced with real DB queries

export const DASHBOARD_STATS = {
  todayViews: 2847,
  weekViews: 18923,
  monthViews: 78456,
  uniqueToday: 1203,
  uniqueWeek: 8745,
  uniqueMonth: 34521,
  totalAds: 12,
  activeAds: 8,
  totalImpressions: 145230,
  totalClicks: 3421,
  estimatedRevenue: 45000000,
  lastPriceUpdate: new Date().toISOString(),
  priceUpdateStatus: "success" as const,
  totalArticles: 24,
  publishedArticles: 18,
};

export function generateViewsChart() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      views: Math.floor(Math.random() * 3000 + 1500),
      unique: Math.floor(Math.random() * 1200 + 600),
    });
  }
  return data;
}

export const TOP_PAGES = [
  { page: "/", views: 12450, title: "صفحه اصلی" },
  { page: "/dollar", views: 8923, title: "قیمت دلار" },
  { page: "/gold", views: 6745, title: "قیمت طلا" },
  { page: "/crypto", views: 5432, title: "ارزهای دیجیتال" },
  { page: "/coin", views: 4321, title: "قیمت سکه" },
  { page: "/tools/currency-converter", views: 3210, title: "تبدیل ارز" },
  { page: "/blog/daily-analysis", views: 2890, title: "تحلیل روزانه" },
  { page: "/crypto/bitcoin", views: 2456, title: "بیت‌کوین" },
];

export const AD_STATS = [
  { id: "ad1", title: "بنر صرافی آنلاین", impressions: 45000, clicks: 1230, ctr: 2.73 },
  { id: "ad2", title: "تبلیغ طلافروشی", impressions: 32000, clicks: 890, ctr: 2.78 },
  { id: "ad3", title: "بنر اپلیکیشن ارزی", impressions: 28000, clicks: 654, ctr: 2.34 },
  { id: "ad4", title: "تبلیغ صندوق سرمایه‌گذاری", impressions: 18000, clicks: 342, ctr: 1.9 },
];

export const REFERRERS = [
  { source: "گوگل", visits: 34521, percent: 44 },
  { source: "مستقیم", visits: 18234, percent: 23 },
  { source: "تلگرام", visits: 12456, percent: 16 },
  { source: "اینستاگرام", visits: 7890, percent: 10 },
  { source: "سایر", visits: 5355, percent: 7 },
];

export const DEVICE_STATS = [
  { device: "موبایل", percent: 68 },
  { device: "دسکتاپ", percent: 27 },
  { device: "تبلت", percent: 5 },
];

export const BROWSER_STATS = [
  { browser: "Chrome", percent: 54 },
  { browser: "Safari", percent: 22 },
  { browser: "Firefox", percent: 12 },
  { browser: "Samsung Internet", percent: 7 },
  { browser: "سایر", percent: 5 },
];

export const SEO_PAGES = [
  { page: "/", title: "ارزلحظه‌ای | قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال", description: "مشاهده قیمت لحظه‌ای دلار، یورو، طلا، سکه و ارزهای دیجیتال." },
  { page: "/dollar", title: "قیمت دلار امروز | نرخ لحظه‌ای دلار آمریکا", description: "قیمت لحظه‌ای دلار آمریکا. نمودار تغییرات و تحلیل بازار ارز." },
  { page: "/gold", title: "قیمت طلا امروز | طلای ۱۸ عیار، مثقال و اونس", description: "قیمت لحظه‌ای طلای ۱۸ عیار، مثقال طلا و اونس جهانی." },
  { page: "/coin", title: "قیمت سکه امروز | سکه امامی، بهار آزادی", description: "قیمت لحظه‌ای سکه امامی، بهار آزادی، نیم و ربع سکه." },
  { page: "/crypto", title: "ارزهای دیجیتال | بیت‌کوین، اتریوم و تتر", description: "قیمت لحظه‌ای ارزهای دیجیتال به تومان." },
  { page: "/blog", title: "بلاگ | مقالات و تحلیل بازار", description: "آخرین تحلیل‌ها و مقالات بازار ارز و طلا." },
];
