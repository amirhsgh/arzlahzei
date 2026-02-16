import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { PromoSlot } from "@/components/sponsor/PromoSlot";
import { generatePageMetadata } from "@/lib/utils/seo";
import { Calculator, ArrowLeftRight, TrendingUp, Coins } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "ابزارهای مالی | محاسبه‌گر طلا، تبدیل ارز و حباب سکه",
  description:
    "ابزارهای رایگان مالی: محاسبه‌گر قیمت طلا، تبدیل ارز، محاسبه حباب سکه و محاسبه سود و زیان سرمایه‌گذاری.",
  keywords: [
    "ابزار مالی",
    "محاسبه‌گر طلا",
    "تبدیل ارز",
    "حباب سکه",
    "محاسبه سود",
  ],
  path: "/tools",
});

const TOOLS = [
  {
    title: "محاسبه‌گر قیمت طلا",
    description: "محاسبه ارزش طلا بر اساس وزن و عیار با قیمت لحظه‌ای",
    href: "/tools/gold-calculator",
    icon: Calculator,
  },
  {
    title: "تبدیل ارز",
    description: "تبدیل لحظه‌ای بین تومان و ارزهای خارجی",
    href: "/tools/currency-converter",
    icon: ArrowLeftRight,
  },
  {
    title: "حباب سکه",
    description: "محاسبه حباب سکه امامی، بهار آزادی، نیم و ربع سکه",
    href: "/tools/coin-bubble",
    icon: Coins,
  },
  {
    title: "محاسبه سود و زیان",
    description: "محاسبه سود یا زیان سرمایه‌گذاری بر اساس قیمت خرید و فروش",
    href: "/tools/profit-calculator",
    icon: TrendingUp,
  },
];

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ابزارها" }]} />
      <PromoSlot position="above_fold" page="tools" className="mb-6" />

      <h1 className="mb-2 text-2xl font-bold">ابزارهای مالی</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        مجموعه ابزارهای رایگان برای محاسبه و تبدیل قیمت ارز، طلا و سکه
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-1 text-base font-semibold group-hover:text-primary">
                {tool.title}
              </h2>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          );
        })}
      </div>

      <PromoSlot position="between_content" page="tools" className="mt-6" />
    </div>
  );
}
