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

const FAQ_ITEMS = [
  { question: "قیمت دلار امروز چنده؟", answer: "قیمت لحظه‌ای دلار آمریکا در بازار آزاد را می‌توانید در بالای این صفحه مشاهده کنید. این قیمت هر ۵ دقیقه بروزرسانی می‌شود." },
  { question: "چرا قیمت دلار نوسان دارد؟", answer: "قیمت دلار تحت تأثیر عوامل مختلفی مانند سیاست‌های پولی بانک مرکزی، عرضه و تقاضا، تحولات سیاسی و اقتصادی داخلی و بین‌المللی قرار دارد." },
  { question: "تفاوت دلار آزاد و نیمایی چیست؟", answer: "دلار آزاد قیمتی است که در بازار غیررسمی معامله می‌شود، اما دلار نیمایی نرخ ارز در سامانه نیما (سامانه یکپارچه معاملات ارزی) بانک مرکزی است." },
  { question: "بهترین زمان خرید دلار چه وقتی است؟", answer: "پیش‌بینی دقیق بهترین زمان خرید دلار ممکن نیست، اما معمولاً در زمان‌هایی که بازار آرام است و نوسانات کمتری وجود دارد، شرایط بهتری برای خرید فراهم می‌شود." },
];

export async function generateMetadata(): Promise<Metadata> {
  const price = await getPriceBySlug("dollar");
  return generatePageMetadata({
    title: "قیمت دلار امروز | نرخ لحظه‌ای دلار آمریکا",
    description: `قیمت لحظه‌ای دلار آمریکا ${price ? Math.round(price.currentPrice).toLocaleString("fa-IR") : ""} تومان. نمودار تغییرات، تاریخچه قیمت و تحلیل بازار ارز.`,
    keywords: ["قیمت دلار", "قیمت دلار امروز", "نرخ دلار", "دلار آمریکا", "قیمت لحظه‌ای دلار", "نرخ ارز"],
    path: "/dollar",
  });
}

export default async function DollarPage() {
  const [price, history, currencies, gold] = await Promise.all([
    getPriceBySlug("dollar"),
    getPriceHistory("dollar"),
    getPricesByCategory("currency"),
    getPricesByCategory("gold"),
  ]);

  if (!price) notFound();

  const related = [
    ...currencies.filter((p) => p.slug !== "dollar").slice(0, 3),
    ...gold.slice(0, 1),
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ارزها", href: "/currency" }, { label: "دلار آمریکا" }]} />
      <FinancialProductJsonLd name="دلار آمریکا" description="قیمت لحظه‌ای دلار آمریکا در بازار آزاد ایران" price={price.currentPrice} url="https://arzlahzei.ir/dollar" />
      <FAQJsonLd items={FAQ_ITEMS} />
      <AdSlot position="above_fold" page="dollar" className="mb-6" />
      <PriceDetailClient
        price={price}
        history={history}
        relatedPrices={related}
        faqItems={FAQ_ITEMS}
        pageName="dollar"
      />
      <AdSlot position="below_fold" page="dollar" className="mt-6" />

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

      <RelatedLinks links={getRelatedLinks("dollar", "currency")} />
    </div>
  );
}
