import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { WebApplicationJsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { AdSlot } from "@/components/ads/AdSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { ProfitCalculatorClient } from "./ProfitCalculatorClient";

export const metadata: Metadata = generatePageMetadata({
  title: "محاسبه سود سرمایه‌گذاری | محاسبه‌گر سود و زیان",
  description: "محاسبه آنلاین سود و زیان سرمایه‌گذاری. سود خرید و فروش ارز، طلا، سکه و ارز دیجیتال را محاسبه کنید.",
  keywords: ["محاسبه سود", "سود سرمایه‌گذاری", "محاسبه سود و زیان", "ماشین حساب سرمایه‌گذاری"],
  path: "/tools/profit-calculator",
});

export default function ProfitCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "ابزارها" },
          { label: "محاسبه سود" },
        ]}
      />
      <WebApplicationJsonLd
        name="محاسبه سود سرمایه‌گذاری"
        description="محاسبه آنلاین سود و زیان سرمایه‌گذاری در ارز، طلا و ارز دیجیتال"
        url="https://arzlahzei.ir/tools/profit-calculator"
      />
      <AdSlot position="above_fold" page="tools" className="mb-6" />
      <ProfitCalculatorClient />

      <AdSlot position="between_content" page="tools" className="my-6" />

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-bold">راهنمای محاسبه سود</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          با این ابزار می‌توانید سود یا زیان سرمایه‌گذاری خود را بر اساس قیمت خرید و فروش محاسبه کنید. کافیست قیمت خرید، قیمت فروش و مقدار سرمایه‌گذاری را وارد کنید تا سود خالص و درصد سود نمایش داده شود.
        </p>
      </section>
      <RelatedLinks links={[
        { label: "قیمت دلار", href: "/dollar" },
        { label: "قیمت طلا", href: "/gold" },
        { label: "قیمت سکه", href: "/coin" },
        { label: "تبدیل ارز", href: "/tools/currency-converter" },
        { label: "ارزهای دیجیتال", href: "/crypto" },
      ]} />
    </div>
  );
}
