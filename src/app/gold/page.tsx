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
  { question: "قیمت طلای ۱۸ عیار امروز چقدر است؟", answer: "قیمت لحظه‌ای طلای ۱۸ عیار را در بالای این صفحه مشاهده کنید. قیمت هر ۵ دقیقه بروزرسانی می‌شود." },
  { question: "تفاوت طلای ۱۸ عیار و ۲۴ عیار چیست؟", answer: "طلای ۲۴ عیار خالص‌ترین نوع طلاست، در حالی که طلای ۱۸ عیار حاوی ۷۵ درصد طلای خالص و ۲۵ درصد فلزات دیگر است. طلای ۱۸ عیار برای ساخت زیورآلات مناسب‌تر است." },
  { question: "قیمت مثقال طلا چگونه محاسبه می‌شود؟", answer: "هر مثقال طلا معادل ۴.۶۰۸ گرم طلای ۱۷ عیار است. قیمت مثقال از ضرب قیمت هر گرم طلای ۱۸ عیار در وزن مثقال و اعمال ضرایب مربوطه محاسبه می‌شود." },
  { question: "اونس جهانی طلا چیست؟", answer: "اونس جهانی طلا واحد سنجش طلا در بازارهای بین‌المللی است. هر اونس طلا معادل ۳۱.۱ گرم طلای خالص (۲۴ عیار) است و قیمت آن به دلار آمریکا تعیین می‌شود." },
];

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "قیمت طلا امروز | طلای ۱۸ عیار، مثقال و اونس جهانی",
    description: "قیمت لحظه‌ای طلای ۱۸ عیار، مثقال طلا و اونس جهانی. نمودار تغییرات قیمت طلا، تاریخچه و تحلیل بازار.",
    keywords: ["قیمت طلا", "طلای ۱۸ عیار", "مثقال طلا", "اونس جهانی", "قیمت طلا امروز"],
    path: "/gold",
  });
}

export default async function GoldPage() {
  const [goldPrices, coinPrices] = await Promise.all([
    getPricesByCategory("gold"),
    getPricesByCategory("coin"),
  ]);

  const mainPrice = goldPrices[0];
  if (!mainPrice) notFound();

  const history = await getPriceHistory(mainPrice.slug);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "طلا" }]} />
      <FinancialProductJsonLd name="طلای ۱۸ عیار" description="قیمت لحظه‌ای طلای ۱۸ عیار در بازار ایران" price={mainPrice.currentPrice} url="https://nerkhe.ir/gold" />
      <FAQJsonLd items={FAQ_ITEMS} />
      <AdSlot position="above_fold" page="gold" className="mb-6" />

      <PriceDetailClient
        price={mainPrice}
        history={history}
        relatedPrices={coinPrices.slice(0, 3)}
        faqItems={FAQ_ITEMS}
        pageName="gold"
      />

      <AdSlot position="between_content" page="gold" className="my-6" />

      {goldPrices.length > 1 && (
        <section className="mt-6">
          <h2 className="mb-4 text-lg font-bold">سایر قیمت‌های طلا</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {goldPrices.slice(1).map((p) => (
              <PriceCard key={p.id} price={p} />
            ))}
          </div>
        </section>
      )}

      <MarketComparison
        items={coinPrices.slice(0, 4).map((r) => ({ name: r.name, currentPrice: r.currentPrice, changePercent: r.changePercent }))}
        title="مقایسه با قیمت سکه"
      />

      {(() => {
        const dynamicFaq = generateDynamicFaq(mainPrice, "gold");
        const seoText = generatePriceSeoText(mainPrice, history);
        return (
          <>
            <DynamicSeoSection seoText={seoText} faq={dynamicFaq} />
            <FAQJsonLd items={dynamicFaq} />
          </>
        );
      })()}

      <RelatedLinks links={getRelatedLinks("gold", "gold")} />
    </div>
  );
}
