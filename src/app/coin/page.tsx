import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { FinancialProductJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getRelatedLinks } from "@/lib/seo/related-links";
import { PriceDetailClient } from "@/components/prices/PriceDetailClient";
import { PriceCard } from "@/components/prices/PriceCard";
import { DynamicSeoSection } from "@/components/seo/DynamicSeoSection";
import { MarketComparison } from "@/components/prices/MarketComparison";
import { AdSlot } from "@/components/ads/AdSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { generatePriceSeoText, generateDynamicFaq } from "@/lib/seo/dynamic-content";
import { getPricesByCategory, getPriceHistory } from "@/lib/db/prices";

export const dynamic = 'force-dynamic';

const FAQ_ITEMS = [
  { question: "قیمت سکه امامی امروز چقدر است؟", answer: "قیمت لحظه‌ای سکه تمام بهار آزادی طرح امامی را در بالای این صفحه مشاهده کنید. قیمت هر ۵ دقیقه بروزرسانی می‌شود." },
  { question: "تفاوت سکه امامی و بهار آزادی چیست؟", answer: "سکه امامی (طرح جدید) تصویر امام خمینی را دارد و سکه بهار آزادی (طرح قدیم) تصویر شعر بهار آزادی را دارد. وزن هر دو ۸.۱۳۳ گرم طلای ۲۲ عیار است." },
  { question: "حباب سکه چیست؟", answer: "حباب سکه تفاوت بین قیمت بازاری سکه و ارزش ذاتی آن (بر اساس وزن طلا و اونس جهانی) است. وقتی حباب مثبت است یعنی سکه بالاتر از ارزش ذاتی معامله می‌شود." },
  { question: "نیم سکه و ربع سکه چه تفاوتی دارند؟", answer: "نیم سکه نصف وزن سکه تمام (۴.۰۶ گرم) و ربع سکه یک چهارم وزن آن (۲.۰۳ گرم) است. هر سه از طلای ۲۲ عیار ساخته شده‌اند." },
];

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "قیمت سکه امروز | سکه امامی، بهار آزادی، نیم و ربع سکه",
    description: "قیمت لحظه‌ای سکه امامی، سکه بهار آزادی، نیم سکه و ربع سکه. نمودار تغییرات قیمت، تاریخچه و محاسبه حباب سکه.",
    keywords: ["قیمت سکه", "سکه امامی", "سکه بهار آزادی", "نیم سکه", "ربع سکه", "حباب سکه"],
    path: "/coin",
  });
}

export default async function CoinPage() {
  const [coinPrices, goldPrices] = await Promise.all([
    getPricesByCategory("coin"),
    getPricesByCategory("gold"),
  ]);

  const mainPrice = coinPrices[0];
  if (!mainPrice) notFound();

  const history = await getPriceHistory(mainPrice.slug);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "سکه" }]} />
      <FinancialProductJsonLd name="سکه امامی" description="قیمت لحظه‌ای سکه تمام بهار آزادی طرح امامی" price={mainPrice.currentPrice} url="https://nerkhe.ir/coin" />
      <FAQJsonLd items={FAQ_ITEMS} />
      <AdSlot position="above_fold" page="coin" className="mb-6" />

      <PriceDetailClient
        price={mainPrice}
        history={history}
        relatedPrices={goldPrices.slice(0, 3)}
        faqItems={FAQ_ITEMS}
        pageName="coin"
      />

      <AdSlot position="between_content" page="coin" className="my-6" />

      {coinPrices.length > 1 && (
        <section className="mt-6">
          <h2 className="mb-4 text-lg font-bold">سایر قیمت‌های سکه</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coinPrices.slice(1).map((p) => (
              <PriceCard key={p.id} price={p} />
            ))}
          </div>
        </section>
      )}

      <MarketComparison
        items={goldPrices.slice(0, 4).map((r) => ({ name: r.name, currentPrice: r.currentPrice, changePercent: r.changePercent }))}
        title="مقایسه با قیمت طلا"
      />

      {(() => {
        const dynamicFaq = generateDynamicFaq(mainPrice, "coin");
        const seoText = generatePriceSeoText(mainPrice, history);
        return (
          <>
            <DynamicSeoSection seoText={seoText} faq={dynamicFaq} />
            <FAQJsonLd items={dynamicFaq} />
          </>
        );
      })()}

      <RelatedLinks links={getRelatedLinks("coin", "coin")} />
    </div>
  );
}
