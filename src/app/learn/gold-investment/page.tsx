import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "سرمایه‌گذاری طلا | راهنمای جامع خرید طلا و سکه",
  description: "آموزش سرمایه‌گذاری در طلا و سکه. انواع طلا، سکه بهار آزادی، صندوق‌های طلا و نکات خرید و فروش.",
  keywords: ["سرمایه‌گذاری طلا", "خرید سکه", "صندوق طلا", "طلای آبشده"],
  path: "/learn/gold-investment",
});

const sections = [
  {
    title: "چرا سرمایه‌گذاری در طلا؟",
    content:
      "طلا از دیرباز به عنوان پناهگاه امن سرمایه‌گذاری شناخته شده است. در شرایط تورمی و بی‌ثباتی اقتصادی، طلا ارزش خود را حفظ می‌کند. در ایران، طلا یکی از محبوب‌ترین ابزارهای سرمایه‌گذاری برای حفظ ارزش پول است.",
  },
  {
    title: "انواع سرمایه‌گذاری در طلا",
    content:
      "سرمایه‌گذاری در طلا به روش‌های مختلفی امکان‌پذیر است: خرید طلای فیزیکی (زیورآلات، شمش)، سکه بهار آزادی، طلای آبشده، صندوق‌های سرمایه‌گذاری طلا (ETF) و گواهی سپرده طلا در بورس کالا.",
  },
  {
    title: "سکه بهار آزادی",
    content:
      "سکه بهار آزادی رایج‌ترین شکل سرمایه‌گذاری طلا در ایران است. انواع آن شامل سکه تمام بهار آزادی (۸.۱۳۳ گرم)، نیم سکه، ربع سکه و سکه گرمی است. قیمت سکه تحت تأثیر قیمت جهانی طلا، نرخ دلار و عرضه و تقاضا است.",
  },
  {
    title: "صندوق‌های سرمایه‌گذاری طلا",
    content:
      "صندوق‌های طلا مانند لوتوس، زر و عیار امکان سرمایه‌گذاری در طلا بدون نگهداری فیزیکی را فراهم می‌کنند. مزایا: نقدشوندگی بالا، بدون ریسک سرقت، امکان خرید با مبالغ کم و معافیت مالیاتی.",
  },
  {
    title: "عوامل مؤثر بر قیمت طلا",
    content:
      "قیمت طلا در ایران از سه عامل اصلی تأثیر می‌پذیرد: قیمت جهانی اونس طلا (تحت تأثیر سیاست‌های فدرال رزرو و تنش‌های ژئوپلیتیک)، نرخ دلار در بازار آزاد، و حباب سکه (تفاوت قیمت واقعی و بازاری سکه).",
  },
  {
    title: "نکات مهم خرید و فروش",
    content:
      "همیشه از مراکز معتبر خرید کنید. طلای فیزیکی را با فاکتور رسمی بخرید. در خرید سکه به حباب توجه کنید. سرمایه‌گذاری را پله‌ای انجام دهید. حداقل ۲۰٪ از سبد سرمایه‌گذاری را به طلا اختصاص دهید.",
  },
];

export default function LearnGoldInvestmentPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "آموزش", href: "/learn" },
          { label: "سرمایه‌گذاری طلا" },
        ]}
      />

      <h1 className="mb-2 text-2xl font-bold md:text-3xl">سرمایه‌گذاری طلا</h1>
      <p className="mb-8 text-muted-foreground">
        راهنمای جامع سرمایه‌گذاری در طلا، سکه و صندوق‌های طلا
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
