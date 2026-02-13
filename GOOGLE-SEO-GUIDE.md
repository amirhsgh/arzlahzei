# راهنمای ثبت سایت در Google Search Console و Google Analytics

---

## بخش ۱: Google Search Console (ایندکس شدن در گوگل)

### ۱.۱ — ساخت اکانت

1. برو به [search.google.com/search-console](https://search.google.com/search-console)
2. با اکانت گوگلت لاگین کن
3. روی **Add Property** کلیک کن

### ۱.۲ — اضافه کردن سایت

دو روش داری:

**روش پیشنهادی: Domain Property**
- تایپ کن: `arzlahzei.ir`
- یه رکورد TXT بهت میده → توی DNS دامنه‌ات اضافه کن
- مثال: `google-site-verification=xxxxxxxxxxxx`
- بعد از اضافه کردن DNS، روی **Verify** کلیک کن (ممکنه تا ۲۴ ساعت طول بکشه)

**روش جایگزین: URL Prefix**
- تایپ کن: `https://arzlahzei.ir`
- از بین روش‌های تأیید، **HTML Tag** رو انتخاب کن
- یه متا تگ بهت میده، مثلاً:
  ```html
  <meta name="google-site-verification" content="xxxxxxxxxxxx" />
  ```
- این رو اضافه کن به فایل `src/app/layout.tsx` توی بخش `metadata`:
  ```typescript
  export const metadata: Metadata = {
    // ... بقیه متادیتا
    verification: {
      google: "xxxxxxxxxxxx",  // ← کد تأییدت
    },
  };
  ```
- ری‌دیپلوی کن و بعد **Verify** بزن

### ۱.۳ — ثبت Sitemap

1. توی Search Console برو به **Sitemaps** (منوی چپ)
2. آدرس رو بزن: `https://arzlahzei.ir/sitemap.xml`
3. **Submit** رو بزن
4. وضعیت باید بشه **Success** (ممکنه چند دقیقه طول بکشه)

### ۱.۴ — درخواست ایندکس صفحات مهم

1. توی Search Console برو به **URL Inspection** (بالای صفحه)
2. آدرس صفحات مهم رو یکی‌یکی بزن:
   - `https://arzlahzei.ir/`
   - `https://arzlahzei.ir/dollar`
   - `https://arzlahzei.ir/gold`
   - `https://arzlahzei.ir/crypto`
   - `https://arzlahzei.ir/currency/usd`
   - `https://arzlahzei.ir/blog`
3. برای هر کدوم روی **Request Indexing** کلیک کن
4. گوگل معمولاً ظرف ۱-۳ روز ایندکس می‌کنه

### ۱.۵ — تنظیمات مهم

- **Settings → International Targeting**: زبان رو `فارسی` بذار
- **Settings → Change of Address**: اگه قبلاً دامنه دیگه‌ای داشتی
- **Removals**: اگه صفحه‌ای رو نمی‌خوای گوگل نشون بده

---

## بخش ۲: Google Analytics (آمار بازدید)

### ۲.۱ — ساخت اکانت Analytics

1. برو به [analytics.google.com](https://analytics.google.com)
2. **Start measuring** رو بزن
3. اطلاعات اکانت:
   - **Account name**: `arzlahzei`
   - تیک data sharing رو بذار
4. اطلاعات Property:
   - **Property name**: `arzlahzei.ir`
   - **Time zone**: `(GMT+03:30) Tehran`
   - **Currency**: `Iranian Rial (IRR)`
5. اطلاعات کسب‌وکار:
   - **Industry**: `Finance`
   - **Size**: `Small`
6. **Create** رو بزن

### ۲.۲ — گرفتن Measurement ID

1. بعد از ساخت، برو به **Admin → Data Streams → Web**
2. آدرس سایت: `https://arzlahzei.ir`
3. **Stream name**: `arzlahzei.ir`
4. **Create stream** رو بزن
5. یه **Measurement ID** بهت میده، مثلاً: `G-ABC123XYZ`

### ۲.۳ — اضافه کردن به سایت

**Measurement ID** رو توی `.env.production` بذار:

```bash
NEXT_PUBLIC_GA_ID=G-ABC123XYZ
```

بعد ری‌دیپلوی کن:
```bash
cd /opt/arzlahzei
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### ۲.۴ — چک کردن

1. سایت رو باز کن: `https://arzlahzei.ir`
2. توی Google Analytics برو به **Realtime**
3. باید بازدید خودت رو ببینی

---

## بخش ۳: اتصال Search Console به Analytics

1. توی **Google Analytics** برو به **Admin → Product links → Search Console links**
2. **Link** رو بزن
3. Property مربوط به `arzlahzei.ir` رو از Search Console انتخاب کن
4. **Confirm** بزن

حالا داده‌های سرچ گوگل (کوئری‌ها، کلیک‌ها، ایمپرشن‌ها) رو توی Analytics هم می‌بینی.

---

## بخش ۴: Bing Webmaster Tools (اختیاری ولی مفید)

1. برو به [bing.com/webmasters](https://www.bing.com/webmasters)
2. می‌تونی مستقیم از Google Search Console ایمپورت کنی
3. **Import from Google Search Console** رو بزن
4. همه چیز خودکار منتقل میشه

---

## بخش ۵: نکات SEO مهم بعد از لانچ

### هفته اول:
- [ ] Search Console verify شده
- [ ] Sitemap ثبت شده
- [ ] صفحات مهم Request Indexing شدن
- [ ] Google Analytics فعال و داده میاد
- [ ] Bing Webmaster اضافه شده

### هفته دوم:
- [ ] توی Search Console بخش **Coverage/Pages** رو چک کن — ارورها رو فیکس کن
- [ ] **Core Web Vitals** رو چک کن — باید سبز باشه
- [ ] **Mobile Usability** رو چک کن

### ماهانه:
- [ ] مقالات جدید بذار توی بلاگ (محتوای فارسی مرتبط با ارز و طلا)
- [ ] لینک‌های داخلی بین صفحات رو زیاد کن
- [ ] صفحات پربازدید رو توی Search Console ببین و بهینه کن
- [ ] **Search Console → Performance** رو ببین — چه کوئری‌هایی ترافیک میارن

### چک سریع SEO:
```bash
# robots.txt
curl https://arzlahzei.ir/robots.txt

# sitemap
curl https://arzlahzei.ir/sitemap.xml | head -50

# متا تگ‌ها
curl -s https://arzlahzei.ir | grep -i '<meta'
```

---

## خلاصه فایل‌های SEO سایت

| فایل | نقش |
|---|---|
| `public/robots.txt` | کنترل کرالرها |
| `src/app/sitemap.ts` | سایت‌مپ داینامیک (خودکار از DB) |
| `src/app/layout.tsx` | متادیتای اصلی + verification |
| `src/lib/utils/seo.ts` | هلپر متادیتا |
| `src/components/seo/JsonLd.tsx` | اسکیمای ساختاری (Schema.org) |
| `src/components/seo/Breadcrumb.tsx` | بردکرامب |
| `src/lib/seo/dynamic-content.ts` | تولید محتوای SEO داینامیک |
| `src/lib/seo/related-links.ts` | لینک‌های داخلی مرتبط |
