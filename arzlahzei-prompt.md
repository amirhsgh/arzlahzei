# پرامپت جامع پروژه arzlahzei.ir — برای Claude Code

## دستور کلی
یک پلتفرم حرفه‌ای قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال بساز با Next.js 16 (App Router) و TypeScript. سایت باید کاملاً فارسی (RTL)، سئو محور، با CMS اختصاصی، سیستم تبلیغات داینامیک، و آپدیت اتوماتیک قیمت‌ها باشد. دامنه: arzlahzei.ir

---

## بخش ۱: استک فنی

```
Frontend: Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn\ui
Backend: Next.js API Routes + Server Actions
Database: PostgreSQL (Prisma ORM)
Cache: Redis (قیمت‌های لحظه‌ای)
Auth: NextAuth.js (برای پنل ادمین)
Deployment: Docker + docker-compose
Font: Vazirmatn (فونت فارسی)
Charts: Recharts یا Lightweight Charts (TradingView)
```

---

## بخش ۲: ساختار صفحات و روتینگ

```
/                          → صفحه اصلی (خلاصه همه قیمت‌ها + اخبار)
/dollar                    → قیمت دلار (لحظه‌ای + نمودار + تاریخچه)
/gold                      → قیمت طلا (۱۸ عیار، مثقال، اونس)
/coin                      → قیمت سکه (امامی، بهار، نیم، ربع)
/currency                  → لیست همه ارزها
/currency/[slug]           → صفحه اختصاصی هر ارز (یورو، درهم، پوند...)
/crypto                    → لیست ارزهای دیجیتال + قیمت تومانی
/crypto/[slug]             → صفحه اختصاصی هر ارز دیجیتال
/tools/currency-converter  → ابزار تبدیل ارز
/tools/gold-calculator     → محاسبه‌گر قیمت طلا
/tools/coin-bubble         → محاسبه حباب سکه
/tools/profit-calculator   → محاسبه سود سرمایه‌گذاری
/blog                      → لیست مقالات
/blog/[slug]               → صفحه مقاله
/blog/daily-analysis       → تحلیل روزانه بازار (AI-generated)
/about                     → درباره ما
/contact                   → تماس با ما
/admin                     → پنل مدیریت (محافظت شده)
```

---

## بخش ۳: دیتابیس (Prisma Schema)

جداول اصلی:

### Price (قیمت‌ها)
- id, slug, name, nameEn, category (currency|gold|coin|crypto), currentPrice, previousPrice, changePercent, changeAmount, high24h, low24h, updatedAt

### PriceHistory (تاریخچه قیمت)
- id, priceId, price, date, open, high, low, close, volume

### Article (مقالات)
- id, title, slug, excerpt, content, category, tags[], coverImage, isAiGenerated, seoTitle, seoDescription, seoKeywords[], publishedAt, viewCount, status (draft|published)

### Ad (تبلیغات)
- id, title, type (banner|sidebar|inline|popup|native|video|sticky_footer|sticky_header|between_content|fullscreen_interstitial), position (header|footer|sidebar|between_prices|between_articles|above_fold|below_fold|in_content), imageUrl, linkUrl, htmlCode, isActive, startDate, endDate, priority, impressionCount, clickCount, deviceTarget (all|mobile|desktop), pageTarget[] (مثلاً ["dollar", "gold", "home"])

### AdImpression (ثبت نمایش تبلیغ)
- id, adId, ip, userAgent, page, timestamp, isClick (boolean)

### PageView (آمار بازدید)
- id, page, ip, userAgent, referrer, country, city, device, browser, timestamp, sessionId

### DailyStats (آمار روزانه)
- id, date, totalViews, uniqueVisitors, topPages (JSON), topReferrers (JSON)

### SeoMeta (سئو داینامیک)
- id, page, title, description, keywords[], canonicalUrl, ogImage, schema (JSON-LD)

### User (ادمین)
- id, email, password, name, role (admin|editor)

---

## بخش ۴: CMS و پنل ادمین (/admin)

یک پنل ادمین کامل با سایدبار و داشبورد:

### ۴.۱ داشبورد
- تعداد بازدید امروز / هفته / ماه (بر اساس IP یونیک)
- نمودار بازدید ۳۰ روزه
- پربازدیدترین صفحات
- تعداد نمایش و کلیک تبلیغات
- درآمد تخمینی تبلیغات
- وضعیت آپدیت قیمت‌ها (آخرین آپدیت موفق/ناموفق)

### ۴.۲ مدیریت قیمت‌ها
- لیست همه قیمت‌ها با وضعیت آپدیت
- افزودن/ویرایش/حذف قیمت
- تنظیم منبع API هر قیمت
- فعال/غیرفعال کردن آپدیت اتوماتیک
- تنظیم فاصله زمانی آپدیت (هر ۱ دقیقه تا ۱ ساعت)

### ۴.۳ مدیریت مقالات
- WYSIWYG Editor (با TipTap یا EditorJS)
- فیلدهای SEO جداگانه (title, description, keywords)
- زمان‌بندی انتشار
- دکمه "تولید مقاله با AI" — یه فیلد prompt بده، با OpenAI API مقاله بسازه
- وضعیت: پیش‌نویس / منتشرشده
- آمار بازدید هر مقاله

### ۴.۴ مدیریت تبلیغات (خیلی مهم!)
- ایجاد تبلیغ جدید با انتخاب:
  - نوع: بنر تصویری / کد HTML / native / video / popup
  - موقعیت: هدر / فوتر / سایدبار / بین قیمت‌ها / بین مقالات / بالای صفحه / زیر صفحه / sticky
  - صفحات هدف: انتخاب چندتایی (همه صفحات / فقط صفحه دلار / فقط کریپتو / ...)
  - دستگاه: همه / فقط موبایل / فقط دسکتاپ
  - تاریخ شروع و پایان
  - اولویت (عدد بالاتر = نمایش بیشتر)
- آمار هر تبلیغ: impressions, clicks, CTR
- فعال/غیرفعال سریع

### ۴.۵ آمار و گزارشات
- بازدید بر اساس: روز / هفته / ماه
- بازدید بر اساس صفحه
- بازدید بر اساس شهر / دستگاه / مرورگر
- Referrer ها (از کجا اومدن)
- گزارش تبلیغات: نمایش / کلیک / CTR

### ۴.۶ تنظیمات سئو
- ویرایش meta title و description هر صفحه
- مدیریت JSON-LD Schema هر صفحه
- مدیریت robots.txt
- مشاهده و regenerate sitemap.xml

### ۴.۷ تنظیمات عمومی
- نام سایت، لوگو، favicon
- لینک شبکه‌های اجتماعی
- کد Google Analytics / Google Search Console verification
- تنظیمات SMTP برای ایمیل
- کلید API اوپن‌ای‌آی

---

## بخش ۵: سیستم تبلیغات داینامیک

### جایگاه‌های تبلیغاتی (Ad Slots)
در هر صفحه این جایگاه‌ها وجود داشته باشه:

```
┌─────────────────────────────────────┐
│  [AD: sticky_header - 728x90]       │  ← بنر بالای صفحه
├─────────────────────────────────────┤
│  HEADER + NAVIGATION                │
├─────────────────────────────────────┤
│  [AD: above_fold - 970x250]         │  ← بنر زیر منو
├──────────────────────┬──────────────┤
│                      │ [AD: sidebar]│
│   MAIN CONTENT       │ [AD: sidebar]│
│                      │ [AD: sidebar]│
│  [AD: between_content - 728x90]     │  ← بین محتوا
│                      │              │
│   MORE CONTENT       │ [AD: sidebar]│
│                      │              │
├──────────────────────┴──────────────┤
│  [AD: before_footer - 970x90]       │
├─────────────────────────────────────┤
│  FOOTER                             │
├─────────────────────────────────────┤
│  [AD: sticky_footer - 728x90]       │  ← بنر چسبان پایین
└─────────────────────────────────────┘
```

### کامپوننت AdSlot
```tsx
<AdSlot position="header" page="dollar" device="all" />
```
- این کامپوننت از API تبلیغات، تبلیغ مناسب رو بر اساس position, page, device بگیره
- هر بار نمایش، یه impression ثبت کنه (با IP)
- کلیک رو هم ثبت کنه
- اگه تبلیغی نبود، جایگاه hidden بشه (فضای خالی نشون نده)
- Lazy load بشه برای سرعت

---

## بخش ۶: سیستم آمار بازدید (Analytics)

### ثبت بازدید
- یک API Route بساز: `POST /api/analytics/pageview`
- هر بار لود صفحه، این API رو بزن با:
  - page URL
  - IP (از headers)
  - User Agent
  - Referrer
  - Timestamp
- IP-based unique visitor detection (هر IP در هر روز = ۱ بازدید یونیک)
- Session tracking با کوکی (یک sessionId تولید کن)

### Middleware
- یک middleware بنویس که هر request رو log کنه
- Bot detection (googlebot, bingbot و... رو فیلتر کن از آمار)

---

## بخش ۷: سئو حرفه‌ای

### ۷.۱ Meta Tags (هر صفحه)
```tsx
export async function generateMetadata({ params }) {
  // Dynamic meta title, description, keywords
  // Open Graph tags
  // Twitter Card tags
  // Canonical URL
}
```

### ۷.۲ JSON-LD Schema
- صفحه اصلی: WebSite + Organization schema
- صفحات قیمت: Product schema با price و priceCurrency
- مقالات: Article + BreadcrumbList schema
- ابزارها: WebApplication schema
- FAQ schema در صفحات مناسب

### ۷.۳ Sitemap اتوماتیک
- `/sitemap.xml` — داینامیک تولید بشه
- شامل همه صفحات قیمت + مقالات + ابزارها
- lastmod بر اساس آخرین آپدیت
- Priority: صفحه اصلی 1.0، قیمت‌ها 0.9، مقالات 0.7

### ۷.۴ robots.txt
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Sitemap: https://arzlahzei.ir/sitemap.xml
```

### ۷.۵ Internal Linking
- هر صفحه قیمت به صفحات مرتبط لینک بده
- مقالات به صفحات قیمت لینک داشته باشن
- Breadcrumb در همه صفحات
- "مطالب مرتبط" در انتهای مقالات

### ۷.۶ Performance SEO
- Image optimization با next/image
- Font optimization (Vazirmatn)
- Code splitting خودکار Next.js
- Static generation (SSG) برای صفحاتی که میشه
- ISR (Incremental Static Regeneration) با revalidate: 60 برای صفحات قیمت
- Lazy loading برای نمودارها و تبلیغات

---

## بخش ۸: طراحی UI/UX

### اصول کلی
- کاملاً RTL و فارسی
- فونت: Vazirmatn (از next/font/google)
- رنگ اصلی: سبز تیره (#0D9488) + طلایی (#F59E0B) + پس‌زمینه تیره (#0F172A)
- Dark theme پیش‌فرض (با امکان light mode)
- موبایل فرست — responsive کامل
- انیمیشن‌های نرم (framer-motion)
- لودینگ skeleton برای قیمت‌ها

### صفحه اصلی
- هدر: لوگو + منو + جستجو + دکمه حالت شب/روز
- بخش قیمت‌های اصلی: ۴ کارت بزرگ (دلار، طلا، سکه، بیت‌کوین) با انیمیشن تغییر قیمت (سبز/قرمز)
- جدول قیمت ارزها (کارتی زیبا، نه جدول ساده)
- جدول قیمت ارزهای دیجیتال
- آخرین اخبار و تحلیل‌ها
- ابزارهای محبوب (لینک به محاسبه‌گرها)
- فوتر: لینک‌ها + شبکه‌های اجتماعی + نماد اعتماد

### صفحات قیمت (مثلاً /dollar)
- قیمت فعلی بزرگ با انیمیشن
- درصد تغییر + مقدار تغییر
- نمودار تعاملی (۱ روزه / ۱ هفته / ۱ ماه / ۳ ماه / ۱ سال)
- جدول تاریخچه قیمت
- تحلیل AI روزانه
- قیمت‌های مرتبط
- FAQ سئو محور

### ابزارها
- UI ساده و کاربردی
- Input‌های بزرگ و واضح
- نتیجه فوری (بدون reload)
- توضیحات SEO-friendly زیر ابزار

---

## بخش ۹: Cron Jobs و اتوماسیون

### ۹.۱ آپدیت قیمت‌ها
```
API Route: /api/cron/update-prices
Schedule: هر ۵ دقیقه
عملکرد:
1. Fetch قیمت از API های خارجی:
   - برای ارز: https://api.navasan.tech/latest/ یا bonbast
   - برای کریپتو: CoinGecko API (رایگان)
   - برای طلا: tgju API
2. ذخیره در Redis (cache لحظه‌ای)
3. ذخیره در PostgreSQL (تاریخچه)
4. محاسبه تغییرات
```

### ۹.۲ تولید محتوای AI
```
API Route: /api/cron/generate-content
Schedule: هر روز ساعت ۷ صبح
عملکرد:
1. قیمت‌های روز قبل رو از دیتابیس بخون
2. با OpenAI API یه تحلیل روزانه تولید کن
3. عنوان SEO-friendly + meta description تولید کن
4. ذخیره به عنوان مقاله جدید (published)
```

### ۹.۳ محاسبه آمار روزانه
```
API Route: /api/cron/daily-stats
Schedule: هر شب ساعت ۱۲
عملکرد:
1. PageView های امروز رو aggregate کن
2. Unique IPs بشمر
3. Top pages محاسبه کن
4. ذخیره در DailyStats
```

---

## بخش ۱۰: API Routes

```
GET  /api/prices                    → همه قیمت‌ها
GET  /api/prices/[slug]             → قیمت یک آیتم
GET  /api/prices/[slug]/history     → تاریخچه قیمت
GET  /api/crypto                    → لیست ارز دیجیتال
GET  /api/crypto/[slug]             → قیمت یک ارز دیجیتال
POST /api/analytics/pageview        → ثبت بازدید
POST /api/analytics/ad-impression   → ثبت نمایش تبلیغ
POST /api/analytics/ad-click        → ثبت کلیک تبلیغ
GET  /api/ads?position=X&page=Y     → دریافت تبلیغ مناسب

--- Admin APIs (protected) ---
GET/POST/PUT/DELETE /api/admin/articles
GET/POST/PUT/DELETE /api/admin/ads
GET  /api/admin/analytics/overview
GET  /api/admin/analytics/pageviews
GET  /api/admin/analytics/ads-report
POST /api/admin/ai/generate-article
POST /api/admin/settings
POST /api/cron/update-prices
POST /api/cron/generate-content
POST /api/cron/daily-stats
```

---

## بخش ۱۱: ساختار فولدر پروژه

```
arzlahzei/
├── prisma/
│   └── schema.prisma
├── public/
│   ├── robots.txt
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx              (Root layout - RTL, fonts, theme)
│   │   ├── page.tsx                (Home)
│   │   ├── dollar/page.tsx
│   │   ├── gold/page.tsx
│   │   ├── coin/page.tsx
│   │   ├── currency/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── crypto/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── tools/
│   │   │   ├── currency-converter/page.tsx
│   │   │   ├── gold-calculator/page.tsx
│   │   │   ├── coin-bubble/page.tsx
│   │   │   └── profit-calculator/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            (Dashboard)
│   │   │   ├── prices/page.tsx
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── ads/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── seo/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── prices/
│   │   │   ├── crypto/
│   │   │   ├── ads/
│   │   │   ├── analytics/
│   │   │   ├── admin/
│   │   │   ├── cron/
│   │   │   └── auth/
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── prices/
│   │   │   ├── PriceCard.tsx
│   │   │   ├── PriceTable.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   └── PriceChange.tsx
│   │   ├── ads/
│   │   │   ├── AdSlot.tsx
│   │   │   └── AdTracker.tsx
│   │   ├── blog/
│   │   │   ├── ArticleCard.tsx
│   │   │   └── ArticleList.tsx
│   │   ├── tools/
│   │   │   └── Calculator.tsx
│   │   ├── seo/
│   │   │   ├── JsonLd.tsx
│   │   │   └── Breadcrumb.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── SearchBar.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   ├── api/
│   │   │   ├── prices.ts           (fetch external price APIs)
│   │   │   ├── crypto.ts           (CoinGecko integration)
│   │   │   └── openai.ts           (AI content generation)
│   │   ├── utils/
│   │   │   ├── format.ts           (price formatting, Persian numbers)
│   │   │   ├── date.ts             (Jalali date conversion)
│   │   │   └── seo.ts              (SEO helpers)
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── usePrices.ts
│   │   └── useAnalytics.ts
│   └── types/
│       └── index.ts
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## بخش ۱۲: Docker Setup

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/arzlahzei
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=xxx
      - OPENAI_API_KEY=xxx
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: arzlahzei
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

  # Cron runner (optional - can use Vercel cron or external)
  cron:
    build: .
    command: node scripts/cron-runner.js
    depends_on:
      - db
      - redis

volumes:
  pgdata:
  redisdata:
```

---

## بخش ۱۳: نکات مهم

1. **تمام متن‌ها فارسی باشن** — هیچ متن انگلیسی به کاربر نشون نده
2. **اعداد فارسی** — قیمت‌ها با جداکننده هزارتایی فارسی نمایش بدن (مثل ۸۵,۴۳۰ تومان)
3. **تاریخ شمسی** — از jalali-moment یا date-fns-jalali استفاده کن
4. **تم تیره پیش‌فرض** — با toggle به روشن
5. **Skeleton loading** — تا وقتی دیتا لود میشه skeleton نشون بده
6. **Error handling** — اگه API خارجی down بود، آخرین قیمت از cache نشون بده
7. **SEO اول** — هر صفحه باید بدون JS هم محتوا داشته باشه (SSR)
8. **سرعت** — Core Web Vitals باید سبز باشه (LCP < 2.5s)
9. **تبلیغات نباید سرعت رو بکشه پایین** — lazy load + intersection observer
10. **Seed data** — یه فایل seed بنویس که دیتابیس رو با قیمت‌های اولیه و چند مقاله نمونه پر کنه

---

## بخش ۱۴: Environment Variables

```env
# .env.example
DATABASE_URL=postgresql://user:pass@localhost:5432/arzlahzei
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://arzlahzei.ir
OPENAI_API_KEY=sk-xxx

# Price APIs
NAVASAN_API_KEY=your-key
COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXX

# Admin credentials (initial)
ADMIN_EMAIL=admin@arzlahzei.ir
ADMIN_PASSWORD=change-this-password
```

---

## دستور اجرا بعد از کد زدن:

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Run development
npm run dev

# 4. Run with Docker
docker-compose up -d

# 5. Build for production
npm run build
npm start
```

---

## 🎯 خلاصه اولویت‌ها:
1. **سئو عالی** — مهم‌ترین اولویت
2. **سرعت بالا** — Core Web Vitals سبز
3. **CMS کامل** — مدیریت آسان بدون کدنویسی
4. **تبلیغات داینامیک** — جایگاه‌های متعدد + آمار دقیق
5. **آپدیت اتوماتیک** — قیمت‌ها بدون دخالت دستی
6. **طراحی حرفه‌ای** — Dark theme، انیمیشن، RTL کامل
7. **آمار دقیق** — بازدید بر اساس IP + گزارشات
