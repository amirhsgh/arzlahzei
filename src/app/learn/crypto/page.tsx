import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "آموزش ارز دیجیتال | راهنمای جامع کریپتوکارنسی",
  description: "آموزش کامل ارز دیجیتال از مبتدی تا پیشرفته. بلاکچین، بیت‌کوین، اتریوم، کیف پول و صرافی‌ها.",
  keywords: ["آموزش ارز دیجیتال", "بلاکچین", "بیت‌کوین", "کریپتوکارنسی"],
  path: "/learn/crypto",
});

const sections = [
  {
    title: "ارز دیجیتال چیست؟",
    content:
      "ارز دیجیتال یا کریپتوکارنسی، پول دیجیتالی است که از رمزنگاری برای امنیت تراکنش‌ها استفاده می‌کند. بیت‌کوین اولین و مشهورترین ارز دیجیتال است که در سال ۲۰۰۹ توسط ساتوشی ناکاموتو معرفی شد.",
  },
  {
    title: "بلاکچین چیست؟",
    content:
      "بلاکچین یک دفتر کل توزیع‌شده و غیرمتمرکز است که تراکنش‌ها را به صورت بلوک‌های زنجیره‌ای ذخیره می‌کند. هر بلوک حاوی اطلاعات تراکنش‌ها و هش بلوک قبلی است که امکان تغییر اطلاعات قبلی را عملاً غیرممکن می‌کند.",
  },
  {
    title: "کیف پول دیجیتال",
    content:
      "کیف پول دیجیتال ابزاری برای ذخیره و مدیریت ارزهای دیجیتال است. کیف پول‌ها به دو دسته گرم (متصل به اینترنت مانند متامسک و تراست ولت) و سرد (آفلاین مانند لجر و ترزور) تقسیم می‌شوند.",
  },
  {
    title: "صرافی‌های ارز دیجیتال",
    content:
      "صرافی‌ها پلتفرم‌هایی هستند که امکان خرید، فروش و تبادل ارزهای دیجیتال را فراهم می‌کنند. صرافی‌ها به دو دسته متمرکز (مانند بایننس و کوکوین) و غیرمتمرکز (مانند یونی‌سواپ و پنکیک‌سواپ) تقسیم می‌شوند.",
  },
  {
    title: "ارزهای دیجیتال مهم",
    content:
      "بیت‌کوین (BTC) به عنوان طلای دیجیتال، اتریوم (ETH) با قابلیت قراردادهای هوشمند، تتر (USDT) به عنوان استیبل‌کوین، و سولانا (SOL) با سرعت بالا از مهم‌ترین ارزهای دیجیتال هستند.",
  },
  {
    title: "نکات امنیتی",
    content:
      "کلید خصوصی و عبارت بازیابی خود را هرگز با کسی به اشتراک نگذارید. از احراز هویت دو مرحله‌ای استفاده کنید. تمام سرمایه را در یک صرافی نگه ندارید. مراقب کلاهبرداری‌ها و پروژه‌های پانزی باشید.",
  },
];

export default function LearnCryptoPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "آموزش", href: "/learn" },
          { label: "آموزش ارز دیجیتال" },
        ]}
      />

      <h1 className="mb-2 text-2xl font-bold md:text-3xl">آموزش ارز دیجیتال</h1>
      <p className="mb-8 text-muted-foreground">
        راهنمای جامع ارز دیجیتال از مفاهیم پایه تا نکات پیشرفته
      </p>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardContent className="p-4 sm:p-6">
              <h2 className="mb-3 text-lg font-bold">{section.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
