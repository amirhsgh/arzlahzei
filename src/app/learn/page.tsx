import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "آموزش | یادگیری بازارهای مالی",
  description: "آموزش فارکس، ارز دیجیتال، معامله‌گری با هوش مصنوعی و سرمایه‌گذاری طلا. مقالات آموزشی جامع برای ورود به بازارهای مالی.",
  keywords: ["آموزش فارکس", "آموزش ارز دیجیتال", "آموزش ترید", "سرمایه‌گذاری طلا"],
  path: "/learn",
});

const topics = [
  {
    title: "آموزش فارکس",
    description: "مفاهیم پایه فارکس، جفت ارزها، تحلیل تکنیکال و فاندامنتال بازار فارکس.",
    href: "/learn/forex",
    icon: "💱",
  },
  {
    title: "آموزش ارز دیجیتال",
    description: "بلاکچین، کیف پول، صرافی‌ها، و نحوه خرید و فروش ارزهای دیجیتال.",
    href: "/learn/crypto",
    icon: "🪙",
  },
  {
    title: "معامله‌گری با هوش مصنوعی",
    description: "استفاده از هوش مصنوعی در تحلیل بازار، سیگنال‌یابی و مدیریت ریسک.",
    href: "/learn/ai-trading",
    icon: "🤖",
  },
  {
    title: "سرمایه‌گذاری طلا",
    description: "انواع سرمایه‌گذاری در طلا، سکه و صندوق‌های طلا. مقایسه روش‌های مختلف.",
    href: "/learn/gold-investment",
    icon: "🥇",
  },
];

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "آموزش" }]} />

      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">آموزش بازارهای مالی</h1>
      <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
        مقالات آموزشی جامع برای ورود به دنیای بازارهای مالی و سرمایه‌گذاری
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link key={topic.href} href={topic.href}>
            <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <span className="mb-3 block text-3xl">{topic.icon}</span>
                <h2 className="mb-2 text-lg font-bold">{topic.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {topic.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
