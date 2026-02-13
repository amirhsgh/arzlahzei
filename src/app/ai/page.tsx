import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "هوش مصنوعی | تحلیل بازار با AI",
  description: "تحلیل بازار ارز، طلا و ارز دیجیتال با هوش مصنوعی. تحلیل روزانه، سیگنال معاملاتی، تحلیل فارکس و اخبار.",
  keywords: ["هوش مصنوعی", "تحلیل بازار", "سیگنال معاملاتی", "تحلیل فارکس"],
  path: "/ai",
});

const sections = [
  {
    title: "تحلیل روزانه",
    description: "تحلیل روزانه بازار ارز، طلا و سکه توسط هوش مصنوعی با بررسی جامع تغییرات و پیش‌بینی روند بازار.",
    href: "/ai/daily-analysis",
    icon: "📊",
  },
  {
    title: "سیگنال معاملاتی",
    description: "سیگنال‌های خرید و فروش ارز دیجیتال بر اساس تحلیل تکنیکال و فاندامنتال هوش مصنوعی.",
    href: "/ai/trading",
    icon: "📈",
  },
  {
    title: "تحلیل فارکس",
    description: "تحلیل جفت ارزهای فارکس و تأثیر آن بر بازار ارز داخلی. بررسی DXY و جفت ارزهای اصلی.",
    href: "/ai/forex",
    icon: "💹",
  },
  {
    title: "اخبار هوش مصنوعی",
    description: "خلاصه مهم‌ترین اخبار اقتصادی و مالی روز توسط هوش مصنوعی. خبرهای تأثیرگذار بر بازار.",
    href: "/ai/news",
    icon: "📰",
  },
];

export default function AiPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">هوش مصنوعی ارزلحظه‌ای</h1>
      <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
        تحلیل‌ها و پیش‌بینی‌های بازار مالی با استفاده از هوش مصنوعی پیشرفته
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <span className="mb-3 block text-3xl">{section.icon}</span>
                <h2 className="mb-2 text-lg font-bold">{section.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
