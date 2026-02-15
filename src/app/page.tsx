import type { Metadata } from "next";
import Link from "next/link";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { PriceCard } from "@/components/prices/PriceCard";
import { PriceTable } from "@/components/prices/PriceTable";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { getFeaturedPrices, getPricesByCategory } from "@/lib/db/prices";
import { getLatestArticles } from "@/lib/db/articles";

export const metadata: Metadata = {
  title: "ارزلحظه‌ای | قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال",
  description:
    "مشاهده قیمت لحظه‌ای دلار، یورو، طلا، سکه و ارزهای دیجیتال. نمودار قیمت، تحلیل بازار و ابزارهای محاسباتی ارزی.",
  keywords: [
    "قیمت دلار",
    "قیمت طلا",
    "قیمت سکه",
    "ارز دیجیتال",
    "قیمت لحظه‌ای",
    "نرخ ارز",
    "بیت‌کوین",
    "تتر",
  ],
  openGraph: {
    title: "ارزلحظه‌ای | قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال",
    description:
      "مشاهده قیمت لحظه‌ای دلار، یورو، طلا، سکه و ارزهای دیجیتال با نمودار و تحلیل بازار",
    url: "https://nerkhe.ir",
    type: "website",
    locale: "fa_IR",
    siteName: "ارزلحظه‌ای",
  },
  alternates: {
    canonical: "https://nerkhe.ir",
  },
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, currencies, gold, coins, crypto, articles] =
    await Promise.all([
      getFeaturedPrices(),
      getPricesByCategory("currency"),
      getPricesByCategory("gold"),
      getPricesByCategory("coin"),
      getPricesByCategory("crypto"),
      getLatestArticles(3),
    ]);

  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Ad: above fold */}
        <AdSlot position="above_fold" page="home" className="mb-6" />

        {/* Hero */}
        <section className="mb-8 text-center">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            قیمت لحظه‌ای <span className="text-primary">ارز</span>،{" "}
            <span className="text-gold">طلا</span>، سکه و ارز دیجیتال
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            مشاهده آنلاین قیمت دلار، یورو، طلای ۱۸ عیار، سکه امامی، بیت‌کوین
            و صدها ارز دیگر با نمودار تعاملی و تحلیل بازار
          </p>
        </section>

        {/* Featured 4 cards */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">قیمت‌های اصلی</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <PriceCard key={p.id} price={p} featured />
            ))}
          </div>
        </section>

        {/* Currency Prices */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">قیمت ارزها</h2>
            <Link
              href="/currency"
              className="text-sm text-primary hover:underline"
            >
              مشاهده همه
            </Link>
          </div>
          <PriceTable prices={currencies} />
        </section>

        {/* Ad: between content */}
        <AdSlot position="between_prices" page="home" className="mb-8" />

        {/* Gold & Coin side by side */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">قیمت طلا</h2>
              <Link
                href="/gold"
                className="text-sm text-primary hover:underline"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="space-y-3">
              {gold.map((p) => (
                <PriceCard key={p.id} price={p} />
              ))}
            </div>
          </section>
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">قیمت سکه</h2>
              <Link
                href="/coin"
                className="text-sm text-primary hover:underline"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="space-y-3">
              {coins.map((p) => (
                <PriceCard key={p.id} price={p} />
              ))}
            </div>
          </section>
        </div>

        {/* Crypto */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">ارزهای دیجیتال</h2>
            <Link
              href="/crypto"
              className="text-sm text-primary hover:underline"
            >
              مشاهده همه
            </Link>
          </div>
          <PriceTable prices={crypto.slice(0, 10)} />
        </section>

        {/* Tools */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold">ابزارهای محبوب</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "تبدیل ارز",
                href: "/tools/currency-converter",
                desc: "تبدیل سریع بین ارزهای مختلف",
                icon: "💱",
              },
              {
                title: "محاسبه‌گر طلا",
                href: "/tools/gold-calculator",
                desc: "محاسبه قیمت طلا بر اساس وزن",
                icon: "⚖️",
              },
              {
                title: "حباب سکه",
                href: "/tools/coin-bubble",
                desc: "محاسبه میزان حباب سکه",
                icon: "🫧",
              },
              {
                title: "محاسبه سود",
                href: "/tools/profit-calculator",
                desc: "محاسبه سود سرمایه‌گذاری",
                icon: "📈",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <span className="mb-2 block text-2xl">{tool.icon}</span>
                <h3 className="mb-1 font-semibold">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Ad: between articles */}
        <AdSlot position="between_articles" page="home" className="mb-8" />

        {/* Articles */}
        {articles.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">آخرین مقالات و تحلیل‌ها</h2>
              <Link
                href="/blog"
                className="text-sm text-primary hover:underline"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
