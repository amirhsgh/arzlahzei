import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { CollectionPageJsonLd } from "@/components/seo/JsonLd";
import { PriceTable } from "@/components/prices/PriceTable";
import { PriceCard } from "@/components/prices/PriceCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { getPricesByCategory } from "@/lib/db/prices";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "قیمت ارزها | نرخ لحظه‌ای دلار، یورو، درهم و سایر ارزها",
    description: "مشاهده قیمت لحظه‌ای ارزهای مختلف شامل دلار، یورو، پوند، درهم، لیر و سایر ارزها. نمودار تغییرات و تاریخچه قیمت.",
    keywords: ["قیمت ارز", "نرخ ارز", "قیمت دلار", "قیمت یورو", "قیمت درهم", "ارزهای خارجی"],
    path: "/currency",
  });
}

export default async function CurrencyPage() {
  const currencies = await getPricesByCategory("currency");

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ارزها" }]} />
      <CollectionPageJsonLd
        name="قیمت ارزها"
        description="لیست قیمت لحظه‌ای ارزهای مختلف"
        url="https://nerkhe.ir/currency"
        items={currencies.map((p) => ({ name: p.name, url: `https://nerkhe.ir/currency/${p.slug}` }))}
      />

      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">قیمت لحظه‌ای ارزها</h1>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        نرخ لحظه‌ای دلار آمریکا، یورو، پوند انگلیس، درهم امارات و سایر ارزهای رایج در بازار آزاد ایران.
      </p>

      <AdSlot position="above_fold" page="currency" className="mb-6" />

      <section className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currencies.slice(0, 3).map((p) => (
            <PriceCard key={p.id} price={p} featured />
          ))}
        </div>
      </section>

      <PriceTable prices={currencies} title="جدول کامل قیمت ارزها" />

      <AdSlot position="below_fold" page="currency" className="mt-6" />

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-bold">درباره بازار ارز</h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            بازار ارز ایران یکی از مهم‌ترین بازارهای مالی کشور است. قیمت ارزها تحت تأثیر عوامل مختلفی از جمله سیاست‌های پولی بانک مرکزی، تحولات بین‌المللی، تراز تجاری و میزان عرضه و تقاضا قرار دارد.
          </p>
          <p>
            در ارزلحظه‌ای، قیمت لحظه‌ای تمام ارزهای رایج از جمله دلار آمریکا، یورو، پوند، درهم امارات، لیر ترکیه و یوان چین را با نمودار تعاملی و تاریخچه قیمت ارائه می‌دهیم.
          </p>
        </div>
      </section>
    </div>
  );
}
