import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { FinancialProductJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getRelatedLinks } from "@/lib/seo/related-links";
import { PriceDetailClient } from "@/components/prices/PriceDetailClient";
import { DynamicSeoSection } from "@/components/seo/DynamicSeoSection";
import { MarketComparison } from "@/components/prices/MarketComparison";
import { AdSlot } from "@/components/ads/AdSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { generatePriceSeoText, generateDynamicFaq } from "@/lib/seo/dynamic-content";
import { getPriceBySlug, getPriceHistory, getPricesByCategory } from "@/lib/db/prices";

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const price = await getPriceBySlug(slug);
  if (!price) return {};
  return generatePageMetadata({
    title: `قیمت ${price.name} امروز | نرخ لحظه‌ای ${price.name}`,
    description: `قیمت لحظه‌ای ${price.name} (${price.nameEn}) در بازار آزاد. نمودار تغییرات، تاریخچه قیمت و تحلیل.`,
    keywords: [`قیمت ${price.name}`, `نرخ ${price.name}`, price.nameEn, "نرخ ارز"],
    path: `/currency/${slug}`,
  });
}

export default async function CurrencyDetailPage({ params }: Props) {
  const { slug } = await params;
  const [price, history, currencies] = await Promise.all([
    getPriceBySlug(slug),
    getPriceHistory(slug),
    getPricesByCategory("currency"),
  ]);

  if (!price || price.category !== "currency") notFound();

  const related = currencies.filter((p) => p.slug !== slug).slice(0, 4);

  const faq = [
    { question: `قیمت ${price.name} امروز چقدر است؟`, answer: `قیمت لحظه‌ای ${price.name} را در بالای این صفحه مشاهده کنید. قیمت‌ها هر ۵ دقیقه بروزرسانی می‌شوند.` },
    { question: `عوامل موثر بر قیمت ${price.name} چیست؟`, answer: `قیمت ${price.name} تحت تأثیر عرضه و تقاضا، سیاست‌های پولی، تحولات اقتصادی و سیاسی بین‌المللی و شرایط بازار داخلی قرار دارد.` },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "ارزها", href: "/currency" },
          { label: price.name },
        ]}
      />
      <FinancialProductJsonLd
        name={price.name}
        description={`قیمت لحظه‌ای ${price.name} در بازار آزاد ایران`}
        price={price.currentPrice}
        url={`https://arzlahzei.ir/currency/${slug}`}
      />
      <FAQJsonLd items={faq} />
      <AdSlot position="above_fold" page={slug} className="mb-6" />
      <PriceDetailClient
        price={price}
        history={history}
        relatedPrices={related}
        faqItems={faq}
        pageName={slug}
      />
      <AdSlot position="below_fold" page={slug} className="mt-6" />

      <MarketComparison
        items={related.map((r) => ({ name: r.name, currentPrice: r.currentPrice, changePercent: r.changePercent }))}
        title="مقایسه با سایر ارزها"
      />

      {(() => {
        const dynamicFaq = generateDynamicFaq(price, "currency");
        const seoText = generatePriceSeoText(price, history);
        return (
          <>
            <DynamicSeoSection seoText={seoText} faq={dynamicFaq} />
            <FAQJsonLd items={dynamicFaq} />
          </>
        );
      })()}

      <RelatedLinks links={getRelatedLinks(slug, "currency")} />
    </div>
  );
}
