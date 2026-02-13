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

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Pre-render top 50 crypto at build time
  const { getPricesByCategory } = await import("@/lib/db/prices");
  try {
    const top = await getPricesByCategory("crypto");
    return top.slice(0, 50).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const price = await getPriceBySlug(slug);
  if (!price) return {};
  return generatePageMetadata({
    title: `قیمت ${price.name} امروز | قیمت لحظه‌ای ${price.name} به تومان`,
    description: `قیمت لحظه‌ای ${price.name} (${price.nameEn}) به تومان. نمودار تغییرات، تاریخچه قیمت و تحلیل بازار.`,
    keywords: [`قیمت ${price.name}`, price.nameEn, "ارز دیجیتال", "کریپتو", `${price.name} به تومان`],
    path: `/crypto/${slug}`,
  });
}

export default async function CryptoDetailPage({ params }: Props) {
  const { slug } = await params;
  const [price, history, allCrypto] = await Promise.all([
    getPriceBySlug(slug),
    getPriceHistory(slug),
    getPricesByCategory("crypto"),
  ]);

  if (!price || price.category !== "crypto") notFound();

  const related = allCrypto.filter((p) => p.slug !== slug).slice(0, 4);

  const faq = [
    { question: `قیمت ${price.name} امروز چنده؟`, answer: `قیمت لحظه‌ای ${price.name} به تومان را در بالای این صفحه مشاهده کنید. این قیمت از ضرب نرخ دلاری ${price.name} در قیمت دلار آزاد محاسبه شده و هر ۵ دقیقه بروزرسانی می‌شود.` },
    { question: `آیا سرمایه‌گذاری در ${price.name} مناسب است؟`, answer: `سرمایه‌گذاری در ارزهای دیجیتال دارای ریسک بالایی است. قبل از هر سرمایه‌گذاری، تحقیق کامل انجام دهید و فقط مبلغی را سرمایه‌گذاری کنید که توانایی از دست دادن آن را دارید.` },
    { question: `چگونه ${price.name} بخرم؟`, answer: `${price.name} را می‌توانید از صرافی‌های ارز دیجیتال داخلی مانند نوبیتکس، والکس یا صرافی‌های بین‌المللی مانند بایننس خریداری کنید.` },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "ارز دیجیتال", href: "/crypto" },
          { label: price.name },
        ]}
      />
      <FinancialProductJsonLd
        name={price.name}
        description={`قیمت لحظه‌ای ${price.name} به تومان در بازار ایران`}
        price={price.currentPrice}
        url={`https://arzlahzei.ir/crypto/${slug}`}
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
        title="مقایسه با سایر ارزهای دیجیتال"
      />

      {(() => {
        const dynamicFaq = generateDynamicFaq(price, "crypto");
        const seoText = generatePriceSeoText(price, history);
        return (
          <>
            <DynamicSeoSection seoText={seoText} faq={dynamicFaq} />
            <FAQJsonLd items={dynamicFaq} />
          </>
        );
      })()}

      <RelatedLinks links={getRelatedLinks(slug, "crypto")} />
    </div>
  );
}
