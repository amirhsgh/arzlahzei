import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/arzlahzei",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123456",
    12
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@nerkhe.ir" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@nerkhe.ir",
      password: hashedPassword,
      name: "مدیر سایت",
      role: "admin",
    },
  });

  console.log("Admin user created");

  // Seed prices - Currencies
  const currencies = [
    { slug: "dollar", name: "دلار آمریکا", nameEn: "US Dollar", price: 85430 },
    { slug: "eur", name: "یورو", nameEn: "Euro", price: 92150 },
    { slug: "gbp", name: "پوند انگلیس", nameEn: "British Pound", price: 108200 },
    { slug: "aed", name: "درهم امارات", nameEn: "UAE Dirham", price: 23270 },
    { slug: "try", name: "لیر ترکیه", nameEn: "Turkish Lira", price: 2340 },
    { slug: "cny", name: "یوان چین", nameEn: "Chinese Yuan", price: 11750 },
    { slug: "jpy", name: "ین ژاپن", nameEn: "Japanese Yen", price: 570 },
    { slug: "cad", name: "دلار کانادا", nameEn: "Canadian Dollar", price: 61200 },
    { slug: "aud", name: "دلار استرالیا", nameEn: "Australian Dollar", price: 55300 },
    { slug: "chf", name: "فرانک سوئیس", nameEn: "Swiss Franc", price: 97800 },
    { slug: "sar", name: "ریال عربستان", nameEn: "Saudi Riyal", price: 22780 },
    { slug: "inr", name: "روپیه هند", nameEn: "Indian Rupee", price: 1015 },
    { slug: "iqd", name: "دینار عراق", nameEn: "Iraqi Dinar", price: 65 },
    { slug: "afn", name: "افغانی", nameEn: "Afghan Afghani", price: 1200 },
  ];

  // Seed prices - Gold
  const golds = [
    { slug: "gold-18k", name: "طلای ۱۸ عیار", nameEn: "18K Gold", price: 4852000 },
    { slug: "gold-24k", name: "طلای ۲۴ عیار", nameEn: "24K Gold", price: 6469000 },
    { slug: "mesghal", name: "مثقال طلا", nameEn: "Gold Mesghal", price: 21050000 },
    { slug: "ounce", name: "اونس جهانی طلا", nameEn: "Gold Ounce", price: 2635 },
  ];

  // Seed prices - Coins
  const coins = [
    { slug: "emami", name: "سکه امامی", nameEn: "Emami Coin", price: 48500000 },
    { slug: "bahar", name: "سکه بهار آزادی", nameEn: "Bahar Azadi Coin", price: 46200000 },
    { slug: "nim", name: "نیم سکه", nameEn: "Half Coin", price: 27800000 },
    { slug: "rob", name: "ربع سکه", nameEn: "Quarter Coin", price: 18200000 },
    { slug: "gerami", name: "سکه گرمی", nameEn: "Gram Coin", price: 10500000 },
  ];

  // Seed prices - Crypto (USD prices)
  const cryptos = [
    { slug: "bitcoin", name: "بیت‌کوین", nameEn: "Bitcoin", price: 97500 },
    { slug: "ethereum", name: "اتریوم", nameEn: "Ethereum", price: 3450 },
    { slug: "tether", name: "تتر", nameEn: "Tether", price: 1.0 },
    { slug: "binancecoin", name: "بایننس کوین", nameEn: "BNB", price: 680 },
    { slug: "ripple", name: "ریپل", nameEn: "XRP", price: 2.35 },
    { slug: "solana", name: "سولانا", nameEn: "Solana", price: 195 },
    { slug: "cardano", name: "کاردانو", nameEn: "Cardano", price: 0.98 },
    { slug: "dogecoin", name: "دوج‌کوین", nameEn: "Dogecoin", price: 0.32 },
    { slug: "polkadot", name: "پولکادات", nameEn: "Polkadot", price: 7.2 },
    { slug: "chainlink", name: "چین‌لینک", nameEn: "Chainlink", price: 22.5 },
  ];

  // Insert all prices
  for (const c of currencies) {
    const change = Math.round((Math.random() - 0.5) * c.price * 0.02);
    await prisma.price.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn,
        category: "currency",
        currentPrice: c.price,
        previousPrice: c.price - change,
        changeAmount: change,
        changePercent: parseFloat(((change / c.price) * 100).toFixed(2)),
        high24h: c.price + Math.abs(change),
        low24h: c.price - Math.abs(change),
      },
    });
  }

  for (const g of golds) {
    const change = Math.round((Math.random() - 0.5) * g.price * 0.015);
    await prisma.price.upsert({
      where: { slug: g.slug },
      update: {},
      create: {
        slug: g.slug,
        name: g.name,
        nameEn: g.nameEn,
        category: "gold",
        currentPrice: g.price,
        previousPrice: g.price - change,
        changeAmount: change,
        changePercent: parseFloat(((change / g.price) * 100).toFixed(2)),
        high24h: g.price + Math.abs(change),
        low24h: g.price - Math.abs(change),
      },
    });
  }

  for (const c of coins) {
    const change = Math.round((Math.random() - 0.5) * c.price * 0.02);
    await prisma.price.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn,
        category: "coin",
        currentPrice: c.price,
        previousPrice: c.price - change,
        changeAmount: change,
        changePercent: parseFloat(((change / c.price) * 100).toFixed(2)),
        high24h: c.price + Math.abs(change),
        low24h: c.price - Math.abs(change),
      },
    });
  }

  for (const cr of cryptos) {
    const change = parseFloat(((Math.random() - 0.5) * cr.price * 0.05).toFixed(4));
    await prisma.price.upsert({
      where: { slug: cr.slug },
      update: {},
      create: {
        slug: cr.slug,
        name: cr.name,
        nameEn: cr.nameEn,
        category: "crypto",
        currentPrice: cr.price,
        previousPrice: cr.price - change,
        changeAmount: change,
        changePercent: parseFloat(((change / cr.price) * 100).toFixed(2)),
        high24h: cr.price + Math.abs(change),
        low24h: cr.price - Math.abs(change),
      },
    });
  }

  console.log(`Seeded ${currencies.length + golds.length + coins.length + cryptos.length} prices`);

  // Seed sample articles
  const articles = [
    {
      title: "تحلیل روزانه بازار ارز - امروز",
      slug: "daily-analysis-today",
      excerpt: "بررسی وضعیت بازار ارز و پیش‌بینی روند قیمت دلار، یورو و سایر ارزها",
      content: `<h2>وضعیت بازار ارز</h2><p>بازار ارز امروز با نوسانات محدودی همراه بود. دلار آمریکا با اندکی افزایش به ۸۵,۴۳۰ تومان رسید.</p><h3>تحلیل تکنیکال دلار</h3><p>با توجه به سطوح حمایت و مقاومت، پیش‌بینی می‌شود دلار در محدوده ۸۴,۰۰۰ تا ۸۷,۰۰۰ تومان نوسان کند.</p><h3>عوامل موثر</h3><ul><li>سیاست‌های پولی بانک مرکزی</li><li>تحولات سیاسی منطقه</li><li>عرضه و تقاضای بازار آزاد</li></ul>`,
      category: "analysis",
      tags: ["تحلیل روزانه", "دلار", "بازار ارز"],
      seoTitle: "تحلیل روزانه بازار ارز | قیمت دلار امروز",
      seoDescription: "آخرین تحلیل بازار ارز و پیش‌بینی قیمت دلار، یورو و سایر ارزها",
      seoKeywords: ["تحلیل بازار ارز", "قیمت دلار امروز", "پیش‌بینی دلار"],
    },
    {
      title: "راهنمای خرید طلا در ایران",
      slug: "gold-buying-guide",
      excerpt: "هر آنچه باید درباره خرید طلا بدانید - از انواع طلا تا نکات مهم خرید",
      content: `<h2>انواع طلا برای سرمایه‌گذاری</h2><p>در بازار ایران، طلا در اشکال مختلفی عرضه می‌شود که هر کدام ویژگی‌های خاص خود را دارند.</p><h3>طلای ۱۸ عیار</h3><p>رایج‌ترین نوع طلا در ایران، طلای ۱۸ عیار است که ۷۵ درصد طلای خالص دارد.</p><h3>سکه طلا</h3><p>سکه‌های طلا شامل سکه امامی، بهار آزادی، نیم سکه و ربع سکه هستند.</p><h3>نکات مهم خرید</h3><ul><li>همیشه از فروشگاه‌های معتبر خرید کنید</li><li>فاکتور رسمی دریافت کنید</li><li>قیمت روز را از منابع معتبر بررسی کنید</li></ul>`,
      category: "education",
      tags: ["طلا", "سرمایه‌گذاری", "آموزش"],
      seoTitle: "راهنمای کامل خرید طلا در ایران | ارزلحظه‌ای",
      seoDescription: "راهنمای جامع خرید طلا - انواع طلا، نکات خرید و بهترین زمان سرمایه‌گذاری",
      seoKeywords: ["خرید طلا", "سرمایه‌گذاری طلا", "قیمت طلا"],
    },
    {
      title: "آشنایی با ارزهای دیجیتال",
      slug: "crypto-introduction",
      excerpt: "مقدمه‌ای بر دنیای ارزهای دیجیتال - از بیت‌کوین تا آلت‌کوین‌ها",
      content: `<h2>ارز دیجیتال چیست؟</h2><p>ارزهای دیجیتال، پول‌های الکترونیکی هستند که بر بستر فناوری بلاکچین کار می‌کنند.</p><h3>بیت‌کوین</h3><p>بیت‌کوین اولین و مهم‌ترین ارز دیجیتال است که در سال ۲۰۰۹ توسط ساتوشی ناکاموتو ایجاد شد.</p><h3>اتریوم</h3><p>اتریوم دومین ارز دیجیتال بزرگ جهان است که علاوه بر انتقال ارز، قابلیت اجرای قراردادهای هوشمند را دارد.</p>`,
      category: "education",
      tags: ["ارز دیجیتال", "بیت‌کوین", "اتریوم", "آموزش"],
      seoTitle: "آشنایی با ارزهای دیجیتال | راهنمای مبتدیان",
      seoDescription: "آموزش ارز دیجیتال برای مبتدیان - بیت‌کوین، اتریوم و سایر ارزها",
      seoKeywords: ["ارز دیجیتال", "بیت‌کوین", "آموزش کریپتو"],
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        coverImage: null,
        isAiGenerated: false,
        status: "published",
        publishedAt: new Date(),
        viewCount: Math.floor(Math.random() * 500) + 100,
      },
    });
  }

  console.log(`Seeded ${articles.length} articles`);

  // Seed sample ads
  const ads = [
    {
      title: "بنر صرافی آنلاین",
      type: "banner" as const,
      position: "header" as const,
      imageUrl: "https://placehold.co/728x90/0D9488/white?text=Exchange+Banner",
      linkUrl: "https://example.com/exchange",
      isActive: true,
      priority: 10,
      deviceTarget: "all" as const,
      pageTarget: ["home", "dollar"],
    },
    {
      title: "تبلیغ طلافروشی",
      type: "banner" as const,
      position: "sidebar" as const,
      imageUrl: "https://placehold.co/300x250/F59E0B/white?text=Gold+Shop",
      linkUrl: "https://example.com/gold-shop",
      isActive: true,
      priority: 8,
      deviceTarget: "desktop" as const,
      pageTarget: ["gold", "coin"],
    },
    {
      title: "بنر چسبان فوتر",
      type: "sticky_footer" as const,
      position: "footer" as const,
      imageUrl: "https://placehold.co/728x90/6366F1/white?text=Sticky+Footer",
      linkUrl: "https://example.com/app",
      isActive: true,
      priority: 9,
      deviceTarget: "mobile" as const,
      pageTarget: ["home", "dollar", "gold"],
    },
  ];

  for (const ad of ads) {
    await prisma.ad.create({ data: ad });
  }

  console.log(`Seeded ${ads.length} ads`);

  // Seed SEO meta
  const seoMetas = [
    {
      page: "/",
      title: "ارزلحظه‌ای | قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال",
      description: "مشاهده قیمت لحظه‌ای دلار، یورو، طلا، سکه و ارزهای دیجیتال با نمودار و تحلیل بازار",
      keywords: ["قیمت دلار", "قیمت طلا", "قیمت سکه", "ارز دیجیتال", "قیمت لحظه‌ای"],
    },
    {
      page: "/dollar",
      title: "قیمت دلار امروز | نمودار و تاریخچه قیمت دلار",
      description: "قیمت لحظه‌ای دلار آمریکا، نمودار تغییرات و تاریخچه قیمت دلار در ارزلحظه‌ای",
      keywords: ["قیمت دلار", "قیمت دلار امروز", "نمودار دلار"],
    },
    {
      page: "/gold",
      title: "قیمت طلا امروز | طلای ۱۸ عیار، مثقال و اونس جهانی",
      description: "قیمت لحظه‌ای طلا ۱۸ عیار، مثقال طلا و اونس جهانی با نمودار و تحلیل",
      keywords: ["قیمت طلا", "طلا ۱۸ عیار", "اونس طلا"],
    },
  ];

  for (const seo of seoMetas) {
    await prisma.seoMeta.upsert({
      where: { page: seo.page },
      update: {},
      create: seo,
    });
  }

  console.log(`Seeded ${seoMetas.length} SEO metas`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
