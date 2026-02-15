import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { CollectionPageJsonLd } from "@/components/seo/JsonLd";
import { PriceTable } from "@/components/prices/PriceTable";
import { PriceCard } from "@/components/prices/PriceCard";
import { PromoSlot } from "@/components/sponsor/PromoSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { getCryptoPricesPaginated } from "@/lib/db/prices";
import Link from "next/link";
import { toPersianDigits } from "@/lib/utils/format";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "قیمت ارزهای دیجیتال | بیت‌کوین، اتریوم، تتر و سایر رمزارزها",
    description: "مشاهده قیمت لحظه‌ای ارزهای دیجیتال به تومان. قیمت بیت‌کوین، اتریوم، تتر، سولانا و صدها رمزارز دیگر با نمودار و تحلیل.",
    keywords: ["ارز دیجیتال", "بیت‌کوین", "اتریوم", "تتر", "قیمت رمزارز", "کریپتو"],
    path: "/crypto",
  });
}

type Props = { searchParams: Promise<{ page?: string }> };

export default async function CryptoPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const { prices, total, totalPages } = await getCryptoPricesPaginated(page, 50);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ارز دیجیتال" }]} />
      <CollectionPageJsonLd
        name="قیمت ارزهای دیجیتال"
        description="لیست قیمت لحظه‌ای ارزهای دیجیتال به تومان"
        url="https://nerkhe.ir/crypto"
        items={prices.slice(0, 20).map((p) => ({ name: p.name, url: `https://nerkhe.ir/crypto/${p.slug}` }))}
      />

      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">قیمت لحظه‌ای ارزهای دیجیتال</h1>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        قیمت لحظه‌ای بیت‌کوین، اتریوم، تتر و سایر رمزارزها به تومان. مجموعاً {toPersianDigits(total.toLocaleString())} ارز دیجیتال.
      </p>

      <PromoSlot position="above_fold" page="crypto" className="mb-6" />

      {page === 1 && (
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prices.slice(0, 3).map((p) => (
              <PriceCard key={p.id} price={p} featured />
            ))}
          </div>
        </section>
      )}

      <PriceTable prices={prices} title="جدول کامل قیمت ارزهای دیجیتال" />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/crypto?page=${page - 1}`}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              صفحه قبل
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-muted-foreground">
            صفحه {toPersianDigits(page.toString())} از {toPersianDigits(totalPages.toString())}
          </span>
          {page < totalPages && (
            <Link
              href={`/crypto?page=${page + 1}`}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              صفحه بعد
            </Link>
          )}
        </div>
      )}

      <PromoSlot position="below_fold" page="crypto" className="mt-6" />

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-bold">درباره بازار ارزهای دیجیتال</h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            بازار ارزهای دیجیتال یکی از نوظهورترین و پرنوسان‌ترین بازارهای مالی جهان است. بیت‌کوین به عنوان اولین و بزرگ‌ترین ارز دیجیتال، نقش مهمی در تعیین جهت کلی بازار دارد.
          </p>
          <p>
            در ارزلحظه‌ای، قیمت ارزهای دیجیتال به تومان محاسبه شده و هر ۵ دقیقه بروزرسانی می‌شود. قیمت تومانی از ضرب قیمت دلاری ارز دیجیتال در نرخ دلار بازار آزاد به دست می‌آید.
          </p>
        </div>
      </section>
    </div>
  );
}
