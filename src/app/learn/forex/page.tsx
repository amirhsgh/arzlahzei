import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "آموزش فارکس | راهنمای جامع بازار فارکس",
  description: "آموزش کامل بازار فارکس از مبتدی تا پیشرفته. مفاهیم جفت ارز، لات، پیپ، تحلیل تکنیکال و فاندامنتال.",
  keywords: ["آموزش فارکس", "جفت ارز", "تحلیل تکنیکال", "پیپ", "لات"],
  path: "/learn/forex",
});

const sections = [
  {
    title: "فارکس چیست؟",
    content:
      "بازار فارکس (Foreign Exchange) بزرگ‌ترین بازار مالی جهان است که در آن ارزهای مختلف در برابر یکدیگر مبادله می‌شوند. حجم معاملات روزانه این بازار بیش از ۶ تریلیون دلار است و ۲۴ ساعته در ۵ روز هفته فعال است.",
  },
  {
    title: "جفت ارزها",
    content:
      "در فارکس، ارزها به صورت جفتی معامله می‌شوند. جفت ارزهای اصلی شامل EUR/USD، GBP/USD، USD/JPY و USD/CHF هستند. ارز اول (پایه) خریداری و ارز دوم (مظنه) فروخته می‌شود.",
  },
  {
    title: "مفاهیم پایه",
    content:
      "پیپ (Pip) کوچک‌ترین واحد تغییر قیمت در فارکس است. لات (Lot) واحد اندازه‌گیری حجم معامله است (۱ لات استاندارد = ۱۰۰,۰۰۰ واحد). اسپرد تفاوت قیمت خرید و فروش و لوریج اهرم مالی ارائه‌شده توسط بروکر است.",
  },
  {
    title: "تحلیل تکنیکال",
    content:
      "تحلیل تکنیکال بررسی نمودارها و الگوهای قیمتی برای پیش‌بینی حرکات آینده بازار است. ابزارهای اصلی شامل خطوط حمایت و مقاومت، میانگین متحرک، RSI، MACD و الگوهای شمعی ژاپنی هستند.",
  },
  {
    title: "تحلیل فاندامنتال",
    content:
      "تحلیل فاندامنتال بررسی عوامل اقتصادی مؤثر بر ارزش ارزهاست. شاخص‌های مهم شامل نرخ بهره بانک مرکزی، تولید ناخالص داخلی (GDP)، نرخ تورم، نرخ بیکاری و تراز تجاری هستند.",
  },
  {
    title: "مدیریت ریسک",
    content:
      "مدیریت ریسک مهم‌ترین بخش معامله‌گری است. قوانین طلایی: هرگز بیش از ۲٪ سرمایه را در یک معامله ریسک نکنید، همیشه از حد ضرر (Stop Loss) استفاده کنید و نسبت سود به ضرر (Risk/Reward) حداقل ۱:۲ باشد.",
  },
];

export default function LearnForexPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "آموزش", href: "/learn" },
          { label: "آموزش فارکس" },
        ]}
      />

      <h1 className="mb-2 text-2xl font-bold md:text-3xl">آموزش فارکس</h1>
      <p className="mb-8 text-muted-foreground">
        راهنمای جامع بازار فارکس از مفاهیم پایه تا استراتژی‌های پیشرفته
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
