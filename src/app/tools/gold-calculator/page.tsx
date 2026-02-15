import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { WebApplicationJsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { PromoSlot } from "@/components/sponsor/PromoSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { getPriceBySlug } from "@/lib/db/prices";
import { GoldCalculatorClient } from "./GoldCalculatorClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMetadata({
  title: "محاسبه‌گر قیمت طلا | محاسبه ارزش طلا بر اساس وزن",
  description: "محاسبه آنلاین قیمت طلا بر اساس وزن و عیار. ارزش طلای ۱۸ عیار، ۲۲ عیار و ۲۴ عیار را محاسبه کنید.",
  keywords: ["محاسبه قیمت طلا", "محاسبه‌گر طلا", "ارزش طلا", "قیمت طلا بر اساس وزن"],
  path: "/tools/gold-calculator",
});

export default async function GoldCalculatorPage() {
  const gold18 = await getPriceBySlug("gold-18k");
  const gold18Price = gold18?.currentPrice ?? 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ابزارها" }, { label: "محاسبه‌گر طلا" }]} />
      <WebApplicationJsonLd name="محاسبه‌گر قیمت طلا" description="محاسبه آنلاین قیمت طلا بر اساس وزن و عیار" url="https://nerkhe.ir/tools/gold-calculator" />
      <PromoSlot position="above_fold" page="tools" className="mb-6" />
      <GoldCalculatorClient gold18Price={gold18Price} />
      <PromoSlot position="between_content" page="tools" className="my-6" />
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-bold">راهنمای محاسبه قیمت طلا</h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>برای محاسبه قیمت طلا، وزن طلای خود را به گرم وارد کنید و عیار آن را انتخاب کنید. سیستم بر اساس آخرین قیمت لحظه‌ای طلا، ارزش طلای شما را محاسبه می‌کند.</p>
          <p>توجه داشته باشید که قیمت محاسبه شده بدون احتساب اجرت ساخت و سود فروشنده است. قیمت نهایی زیورآلات معمولاً ۷ تا ۲۵ درصد بالاتر از ارزش طلای خام است.</p>
        </div>
      </section>
      <RelatedLinks links={[
        { label: "قیمت طلا", href: "/gold" },
        { label: "قیمت سکه", href: "/coin" },
        { label: "حباب سکه", href: "/tools/coin-bubble" },
        { label: "محاسبه سود", href: "/tools/profit-calculator" },
      ]} />
    </div>
  );
}
