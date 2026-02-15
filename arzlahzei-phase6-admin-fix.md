# فاز ۶ — تکمیل و فیکس کامل پنل ادمین

## مشکلات فعلی که باید حل بشن:

### مشکل ۱: پنل ادمین بدون احراز هویته (اورژانسی!)
الان هرکسی آدرس /admin رو بزنه میره تو پنل. این باید فوری فیکس بشه.

### مشکل ۲: صفحات پنل ادمین کار نمیکنن
صفحات داخلی پنل ادمین یا خالی هستن یا عملکردشون پیاده‌سازی نشده.

---

## بخش ۱: سیستم احراز هویت ادمین (Authentication)

### ۱.۱ Setup NextAuth.js با Credentials Provider

```
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

فایل `/src/app/api/auth/[...nextauth]/route.ts` بساز:

- از **CredentialsProvider** استفاده کن
- Login فقط با email + password
- Password با **bcryptjs** هش بشه
- Session strategy: **JWT**
- فقط یوزرهایی با role = "admin" یا "editor" بتونن لاگین کنن
- **هیچ صفحه ثبت‌نامی وجود نداره** — یوزر ادمین فقط از طریق seed یا مستقیم از دیتابیس اضافه میشه

### ۱.۲ صفحه لاگین: `/admin/login`

یک صفحه لاگین حرفه‌ای و زیبا بساز:
- فرم وسط صفحه (centered card)
- فیلد ایمیل + فیلد پسورد
- دکمه "ورود به پنل مدیریت"
- نمایش خطا اگه اطلاعات اشتباه بود
- لوگوی سایت بالای فرم
- پس‌زمینه گرادیانت تیره
- بدون هیچ لینک ثبت‌نام یا فراموشی رمز
- بعد از لاگین موفق redirect به `/admin`
- کاملاً فارسی و RTL

### ۱.۳ محافظت از روت‌های ادمین (Middleware)

فایل `src/middleware.ts` بساز یا آپدیت کن:

```typescript
// هر request به /admin/* (بجز /admin/login) چک بشه
// اگه session نداره → redirect به /admin/login
// اگه session داره ولی role ادمین نیست → redirect به /
// روت‌های /api/admin/* هم محافظت بشن
```

### ۱.۴ محافظت از API Routes ادمین

تمام API route های `/api/admin/*` باید:
- Session رو چک کنن
- اگه unauthorized بود 401 برگردونن
- یک helper function بنویس: `requireAdmin(request)` که تو همه API ها استفاده بشه

### ۱.۵ Seed یوزر ادمین

در فایل `prisma/seed.ts` یوزر ادمین اولیه اضافه کن:
```
Email: admin@nerkhe.ir
Password: (از env بخون ADMIN_PASSWORD) → هش شده با bcrypt ذخیره بشه
Role: admin
Name: مدیر سایت
```

---

## بخش ۲: فیکس کامل تمام صفحات پنل ادمین

هر صفحه زیر باید **کاملاً عملیاتی** باشه با دیتای واقعی از دیتابیس:

### ۲.۱ داشبورد (`/admin`)

این صفحه باید این اطلاعات رو نشون بده (با API واقعی):

**کارت‌های آماری بالای صفحه:**
- بازدید امروز (عدد + درصد تغییر نسبت به دیروز)
- بازدید کنندگان یونیک امروز
- کل نمایش تبلیغات امروز
- کل کلیک تبلیغات امروز

**نمودار بازدید ۳۰ روزه:**
- Line chart با Recharts
- محور X: تاریخ شمسی
- محور Y: تعداد بازدید
- دو خط: بازدید کل + یونیک

**پربازدیدترین صفحات (جدول):**
- نام صفحه | بازدید امروز | بازدید هفته | بازدید ماه

**آخرین فعالیت‌ها:**
- آخرین ۱۰ بازدید با IP، صفحه، زمان

**وضعیت سیستم:**
- آخرین آپدیت قیمت‌ها (زمان + وضعیت سبز/قرمز)
- تعداد مقالات منتشر شده
- تعداد تبلیغات فعال

API مورد نیاز: `GET /api/admin/dashboard` → همه این دیتاها رو aggregate کنه و برگردونه

### ۲.۲ مدیریت قیمت‌ها (`/admin/prices`)

**لیست قیمت‌ها (جدول):**
- نام | قیمت فعلی | تغییر | دسته‌بندی | آخرین آپدیت | وضعیت | عملیات
- دکمه ویرایش / حذف / فعال-غیرفعال
- فیلتر بر اساس دسته‌بندی (ارز / طلا / سکه / کریپتو)
- جستجو بر اساس نام

**دکمه "افزودن قیمت جدید":**
- Modal یا صفحه جدید با فرم:
  - نام فارسی، نام انگلیسی، slug
  - دسته‌بندی (dropdown)
  - قیمت اولیه
  - منبع API (URL)
  - فاصله آپدیت (dropdown: ۱ دقیقه / ۵ دقیقه / ۱۵ دقیقه / ۱ ساعت)
  - فعال/غیرفعال

**دکمه "آپدیت دستی همه قیمت‌ها":**
- Trigger کردن cron job بصورت دستی
- نمایش loading و نتیجه

APIs:
- `GET /api/admin/prices` → لیست با pagination
- `POST /api/admin/prices` → ایجاد
- `PUT /api/admin/prices/[id]` → ویرایش
- `DELETE /api/admin/prices/[id]` → حذف
- `POST /api/admin/prices/update-all` → آپدیت دستی

### ۲.۳ مدیریت مقالات (`/admin/articles`)

**لیست مقالات (جدول):**
- عنوان | دسته‌بندی | وضعیت (پیش‌نویس/منتشرشده) | بازدید | تاریخ | AI | عملیات
- فیلتر بر اساس وضعیت و دسته‌بندی
- جستجو

**صفحه ایجاد/ویرایش مقاله (`/admin/articles/new` و `/admin/articles/[id]`):**

فرم کامل با:
- عنوان مقاله
- Slug (auto-generate از عنوان + قابل ویرایش)
- خلاصه (excerpt)
- **ادیتور محتوا** — از یک Rich Text Editor استفاده کن:
  - اگه TipTap یا EditorJS سخته، از **React Quill** یا **@uiw/react-md-editor** استفاده کن
  - باید bold, italic, heading, list, link, image, code block ساپورت کنه
- دسته‌بندی (dropdown)
- تگ‌ها (multi-input)
- تصویر کاور (URL input)
- وضعیت: پیش‌نویس / منتشرشده
- تاریخ انتشار (date picker)
- **بخش SEO (expandable section):**
  - عنوان سئو (اگه خالی، از عنوان مقاله استفاده بشه)
  - توضیحات سئو
  - کلمات کلیدی
- **دکمه "تولید با هوش مصنوعی":**
  - یه textarea برای prompt
  - دکمه "تولید مقاله"
  - Loading state
  - نتیجه رو در ادیتور بذاره
  - همزمان title و SEO meta هم تولید کنه

APIs:
- `GET /api/admin/articles` → لیست با pagination و فیلتر
- `GET /api/admin/articles/[id]` → یک مقاله
- `POST /api/admin/articles` → ایجاد
- `PUT /api/admin/articles/[id]` → ویرایش
- `DELETE /api/admin/articles/[id]` → حذف
- `POST /api/admin/ai/generate-article` → تولید مقاله AI (input: prompt, output: title + content + seoTitle + seoDescription + keywords)

### ۲.۴ مدیریت تبلیغات (`/admin/ads`)

**لیست تبلیغات (جدول):**
- عنوان | نوع | موقعیت | نمایش | کلیک | CTR | وضعیت | عملیات
- فیلتر بر اساس نوع و وضعیت
- Toggle فعال/غیرفعال سریع (switch)

**صفحه ایجاد/ویرایش تبلیغ (`/admin/ads/new` و `/admin/ads/[id]`):**

فرم با این فیلدها:
- عنوان تبلیغ
- **نوع تبلیغ** (radio buttons با توضیح):
  - بنر تصویری: فقط عکس + لینک
  - کد HTML: کد HTML دلخواه (مثلاً کد تبلیغات شبکه‌های ایرانی)
  - Native: عنوان + توضیح + عکس + لینک (شبیه محتوا)
  - Popup: محتوای popup + تنظیم زمان نمایش
  - Video: لینک ویدیو + poster
- **موقعیت** (dropdown multi-select):
  - بالای صفحه (sticky header)
  - زیر منو (above fold)
  - سایدبار
  - بین محتوا
  - قبل از فوتر
  - پایین صفحه (sticky footer)
  - بین قیمت‌ها
  - بین مقالات
- **صفحات هدف** (checkboxes):
  - همه صفحات
  - صفحه اصلی
  - صفحه دلار
  - صفحه طلا
  - صفحه سکه
  - صفحه کریپتو
  - صفحات ارز دیجیتال
  - صفحات مقالات
  - صفحات ابزار
- **دستگاه هدف** (radio):
  - همه / فقط موبایل / فقط دسکتاپ
- **بنر تصویری** (اگه نوع = بنر):
  - آپلود عکس یا URL عکس
  - لینک مقصد
  - سایز پیشنهادی
- **کد HTML** (اگه نوع = HTML):
  - Textarea برای paste کردن کد
  - Preview دکمه
- تاریخ شروع و پایان
- اولویت (عدد ۱ تا ۱۰۰)
- فعال/غیرفعال

**آمار هر تبلیغ (در صفحه ویرایش):**
- نمودار نمایش/کلیک ۳۰ روزه
- CTR کل
- نمایش امروز / هفته / ماه

APIs:
- `GET /api/admin/ads` → لیست با pagination
- `GET /api/admin/ads/[id]` → یک تبلیغ + آمار
- `POST /api/admin/ads` → ایجاد
- `PUT /api/admin/ads/[id]` → ویرایش
- `DELETE /api/admin/ads/[id]` → حذف
- `GET /api/admin/ads/[id]/stats` → آمار تبلیغ

### ۲.۵ آمار و آنالیتیکس (`/admin/analytics`)

**Tab ها:**

**تب بازدید:**
- نمودار بازدید ۳۰ روزه (line chart)
- فیلتر بازه زمانی: امروز / هفته / ماه / ۳ ماه / سفارشی
- جدول پربازدیدترین صفحات
- جدول top referrers
- توزیع دستگاه (pie chart: mobile vs desktop)
- توزیع مرورگر (pie chart)

**تب تبلیغات:**
- نمودار نمایش و کلیک ۳۰ روزه (bar chart)
- جدول عملکرد هر تبلیغ: نام | نمایش | کلیک | CTR
- بهترین جایگاه تبلیغاتی
- بهترین صفحه برای تبلیغ

**تب بازدیدکنندگان:**
- تعداد یونیک IP ها
- توزیع جغرافیایی (اگه IP lookup داری)
- ساعات پیک بازدید (bar chart ساعتی)

APIs:
- `GET /api/admin/analytics/pageviews?range=30d`
- `GET /api/admin/analytics/top-pages?range=30d`
- `GET /api/admin/analytics/referrers?range=30d`
- `GET /api/admin/analytics/devices?range=30d`
- `GET /api/admin/analytics/ads-report?range=30d`

### ۲.۶ تنظیمات سئو (`/admin/seo`)

**لیست صفحات با SEO قابل ویرایش:**
- جدول: صفحه | عنوان سئو | توضیحات | وضعیت
- کلیک روی هر ردیف → modal ویرایش:
  - Meta Title
  - Meta Description
  - Keywords
  - Canonical URL
  - OG Image URL
  - JSON-LD Schema (textarea)

**Sitemap:**
- دکمه "بازسازی Sitemap"
- نمایش آخرین زمان بازسازی
- لینک مستقیم به sitemap.xml

**Robots.txt:**
- Textarea قابل ویرایش
- دکمه ذخیره

APIs:
- `GET /api/admin/seo` → لیست SEO meta ها
- `PUT /api/admin/seo/[page]` → ویرایش
- `POST /api/admin/seo/regenerate-sitemap`

### ۲.۷ تنظیمات عمومی (`/admin/settings`)

فرم با بخش‌های مختلف (accordion/tabs):

**عمومی:**
- نام سایت
- توضیح سایت
- URL لوگو
- URL فاویکون

**شبکه‌های اجتماعی:**
- لینک اینستاگرام
- لینک تلگرام
- لینک توییتر
- لینک یوتیوب

**آنالیتیکس:**
- Google Analytics ID
- Google Search Console Verification Tag

**API Keys:**
- کلید OpenAI API
- کلید Navasan API
- کلید CoinGecko API

**ایمیل (SMTP):**
- Host
- Port
- Username
- Password

دکمه "ذخیره تنظیمات"

API:
- `GET /api/admin/settings` → همه تنظیمات
- `PUT /api/admin/settings` → ذخیره

---

## بخش ۳: ظاهر پنل ادمین

### Layout ادمین (`/admin/layout.tsx`)
- **سایدبار چپ** (تو RTL سمت راست): لوگو + منوی ناوبری + نام ادمین + دکمه خروج
- **هدر بالا**: عنوان صفحه فعلی + breadcrumb + دکمه "مشاهده سایت" (لینک به /)
- **محتوای اصلی**: وسط صفحه
- Sidebar collapsible در موبایل (hamburger menu)

### منوی سایدبار:
```
🏠 داشبورد          → /admin
💰 مدیریت قیمت‌ها    → /admin/prices
📝 مقالات           → /admin/articles
📢 تبلیغات          → /admin/ads
📊 آمار و گزارشات   → /admin/analytics
🔍 تنظیمات سئو      → /admin/seo
⚙️ تنظیمات          → /admin/settings
🚪 خروج             → logout
```

### استایل:
- پس‌زمینه سایدبار: تیره‌تر از محتوا
- آیتم فعال: highlight با رنگ اصلی سایت
- جداول: zebra striping + hover effect
- دکمه‌ها: رنگ‌بندی واضح (سبز=ذخیره، قرمز=حذف، آبی=ویرایش)
- فرم‌ها: label واضح + validation + error messages فارسی
- Toast notifications برای عملیات موفق/ناموفق
- Loading states برای همه API calls
- Empty states وقتی دیتا نیست

---

## بخش ۴: نکات مهم اجرایی

1. **هیچ صفحه ثبت‌نامی نساز** — فقط لاگین
2. **Session timeout**: بعد از ۲۴ ساعت خودکار logout بشه
3. **همه فرم‌ها validation داشته باشن** — هم client-side هم server-side
4. **Pagination** برای همه لیست‌ها (۲۰ آیتم در صفحه)
5. **Search/Filter** در همه لیست‌ها
6. **Confirm dialog** قبل از حذف
7. **Toast notification** بعد از هر عملیات (react-hot-toast یا sonner)
8. **همه API ها error handling مناسب داشته باشن**
9. **Loading skeleton** برای همه صفحات
10. **صفحه ادمین نباید توسط موتورهای جستجو ایندکس بشه** — noindex, nofollow

---

## دستور به Claude Code:

مطمئن شو که:
- تمام API routes واقعاً از دیتابیس read/write میکنن (نه mock data)
- Prisma client درست initialize شده
- NextAuth کامل setup شده و session در همه جا چک میشه
- هر صفحه ادمین یک loading state و error state داره
- فرم‌ها واقعاً submit میکنن و دیتا ذخیره میشه
- حذف واقعاً حذف میکنه
- ویرایش واقعاً آپدیت میکنه
- اگه کتابخانه‌ای لازمه install کن
