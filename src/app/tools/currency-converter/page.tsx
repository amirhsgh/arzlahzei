import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { WebApplicationJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { getPricesByCategory } from "@/lib/db/prices";
import { CurrencyConverterClient } from "./CurrencyConverterClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMetadata({
  title: "تبدیل ارز | مبدل آنلاین ارز",
  description: "ابزار تبدیل آنلاین ارز. تبدیل دلار به تومان، یورو به تومان و سایر ارزها با نرخ لحظه‌ای بازار آزاد.",
  keywords: ["تبدیل ارز", "مبدل ارز", "دلار به تومان", "یورو به تومان", "ماشین حساب ارز"],
  path: "/tools/currency-converter",
});

const FAQ_ITEMS = [
  { question: "نرخ تبدیل ارز از کجا گرفته می‌شود؟", answer: "نرخ‌های تبدیل از بازار آزاد ایران گرفته شده و هر ۵ دقیقه بروزرسانی می‌شوند." },
  { question: "آیا نرخ‌ها شامل کارمزد صرافی است؟", answer: "خیر، نرخ‌های نمایش داده شده نرخ میانگین بازار هستند. صرافی‌ها ممکن است کارمزد جداگانه‌ای دریافت کنند." },
];

export default async function CurrencyConverterPage() {
  const currencies = await getPricesByCategory("currency");
  const currencyRates = currencies.map((p) => ({
    code: p.nameEn,
    name: p.name,
    rate: p.currentPrice,
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ابزارها" }, { label: "تبدیل ارز" }]} />
      <WebApplicationJsonLd name="تبدیل ارز آنلاین" description="ابزار تبدیل آنلاین ارز با نرخ لحظه‌ای بازار" url="https://nerkhe.ir/tools/currency-converter" />
      <FAQJsonLd items={FAQ_ITEMS} />
      <AdSlot position="above_fold" page="tools" className="mb-6" />
      <CurrencyConverterClient currencyRates={currencyRates} />
      <AdSlot position="between_content" page="tools" className="my-6" />
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-bold">درباره ابزار تبدیل ارز</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          با ابزار تبدیل ارز ارزلحظه‌ای می‌توانید به راحتی مقدار ارزهای مختلف را به تومان و بالعکس تبدیل کنید. نرخ‌ها بر اساس آخرین قیمت بازار آزاد محاسبه می‌شوند.
        </p>
        <h3 className="mb-2 font-semibold">سوالات متداول</h3>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i}>
              <p className="text-sm font-medium">{item.question}</p>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <RelatedLinks links={[
        { label: "قیمت دلار", href: "/dollar" },
        { label: "قیمت یورو", href: "/currency/euro" },
        { label: "همه ارزها", href: "/currency" },
        { label: "محاسبه سود", href: "/tools/profit-calculator" },
      ]} />
    </div>
  );
}
