import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { WebApplicationJsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { getPricesByCategory, getPriceBySlug } from "@/lib/db/prices";
import { CoinBubbleClient } from "./CoinBubbleClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMetadata({
  title: "محاسبه حباب سکه | ارزش ذاتی و حباب سکه امامی",
  description: "محاسبه آنلاین حباب سکه امامی، بهار آزادی، نیم سکه و ربع سکه. مقایسه قیمت بازاری با ارزش ذاتی سکه.",
  keywords: ["حباب سکه", "ارزش ذاتی سکه", "حباب سکه امامی", "محاسبه حباب"],
  path: "/tools/coin-bubble",
});

export default async function CoinBubblePage() {
  const [coinPrices, goldPrices, dollar] = await Promise.all([
    getPricesByCategory("coin"),
    getPricesByCategory("gold"),
    getPriceBySlug("dollar"),
  ]);

  const coinPrice = coinPrices.find((p) => p.slug === "coin-emami")?.currentPrice ?? 0;
  const ouncePrice = goldPrices.find((p) => p.slug === "gold-ounce")?.currentPrice ?? 0;
  const dollarPrice = dollar?.currentPrice ?? 0;

  const coinTypes = [
    { name: "سکه امامی", weight: 7.32, price: coinPrices.find((p) => p.slug === "coin-emami")?.currentPrice ?? 0 },
    { name: "سکه بهار آزادی", weight: 7.32, price: coinPrices.find((p) => p.slug === "coin-bahar")?.currentPrice ?? 0 },
    { name: "نیم سکه", weight: 3.66, price: coinPrices.find((p) => p.slug === "coin-nim")?.currentPrice ?? 0 },
    { name: "ربع سکه", weight: 1.83, price: coinPrices.find((p) => p.slug === "coin-rob")?.currentPrice ?? 0 },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ابزارها" }, { label: "حباب سکه" }]} />
      <WebApplicationJsonLd name="محاسبه حباب سکه" description="محاسبه آنلاین حباب سکه بر اساس ارزش ذاتی طلا" url="https://arzlahzei.ir/tools/coin-bubble" />
      <AdSlot position="above_fold" page="tools" className="mb-6" />
      <CoinBubbleClient coinPrice={coinPrice} ouncePrice={ouncePrice} dollarPrice={dollarPrice} coinTypes={coinTypes} />
      <AdSlot position="between_content" page="tools" className="my-6" />
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-bold">حباب سکه چیست؟</h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>حباب سکه به تفاوت بین قیمت بازاری سکه و ارزش ذاتی آن گفته می‌شود. ارزش ذاتی سکه بر اساس وزن طلای آن و قیمت جهانی اونس طلا محاسبه می‌شود.</p>
          <p>وقتی حباب مثبت است، یعنی سکه بالاتر از ارزش ذاتی خود معامله می‌شود. حباب منفی نشان‌دهنده فرصت خرید و حباب بالای مثبت نشان‌دهنده ریسک بالای خرید است.</p>
          <p>سکه تمام بهار آزادی حاوی ۸.۱۳۳ گرم طلای ۲۲ عیار (معادل ۷.۳۲ گرم طلای خالص) است.</p>
        </div>
      </section>
      <RelatedLinks links={[
        { label: "قیمت سکه", href: "/coin" },
        { label: "قیمت طلا", href: "/gold" },
        { label: "محاسبه‌گر طلا", href: "/tools/gold-calculator" },
        { label: "قیمت دلار", href: "/dollar" },
      ]} />
    </div>
  );
}
